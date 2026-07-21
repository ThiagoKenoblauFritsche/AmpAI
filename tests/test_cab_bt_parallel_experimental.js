'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPORT_PREFIX = 'CAB_BT_PARALLEL_EXP_REPORT ';
const SUMMARY_PREFIX = 'CAB_BT_PARALLEL_EXP_SUMMARY ';
const EXPECTED_REPORTS = 40;
const RELATIVE_TOLERANCE = 0.005;
const ZERO_ABSOLUTE_TOLERANCE = 1e-12;
const NOTICE = 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO';
const SCIENTIFIC_BASELINE = '18627dd02c94265984aa953d35f47c2745cab61d';
const MODULE_PATH = path.resolve(__dirname, '..', 'js', 'core_cabos_bt_parallel_experimental.js');

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};
const consoleEvents = [];

for (const level of Object.keys(originalConsole)) {
  console[level] = (...args) => {
    consoleEvents.push({ level, args: args.map((value) => String(value)) });
  };
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function jsonReplacer(_key, value) {
  if (typeof value === 'number' && !Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'NaN';
    return value > 0 ? 'Infinity' : '-Infinity';
  }
  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }
  return value;
}

function jsonSafe(value) {
  try {
    return JSON.parse(JSON.stringify(value, jsonReplacer));
  } catch (error) {
    return { serializationError: error?.message || String(error) };
  }
}

function closeTo(observed, expected) {
  if (typeof observed !== 'number' || !Number.isFinite(observed)) return false;
  if (expected === 0) return Math.abs(observed) <= ZERO_ABSOLUTE_TOLERANCE;
  return Math.abs(observed - expected) / Math.abs(expected) <= RELATIVE_TOLERANCE;
}

function complex(re, im) {
  return { re, im };
}

function makeInput(options = {}) {
  const impedances = options.impedances || [
    complex(0.020, 0.030),
    complex(0.020, 0.024),
    complex(0.020, 0.018),
  ];
  const nParallel = options.nParallel ?? impedances.length;
  const geometryStatus = options.geometryStatus || 'NOT_PROVIDED';
  const imbalanceMode = options.imbalanceMode || 'EXPLICIT_ASSUMPTION';
  const imbalance = imbalanceMode === 'EXPLICIT_ASSUMPTION'
    ? {
        mode: imbalanceMode,
        deltaFault: options.deltaFault ?? 1.1,
        provenance: 'ASSUMPTION_ONLY',
      }
    : { mode: imbalanceMode };

  return {
    contractVersion: 'CAB-BT-PARALLEL-EXP-1',
    totalLoadCurrent_A: options.totalLoadCurrent_A ?? 900,
    powerFactor: options.powerFactor ?? 0.9,
    nParallel,
    nCircuits: options.nCircuits ?? 1,
    geometry: {
      status: geometryStatus,
      description: geometryStatus === 'DESCRIBED'
        ? (options.geometryDescription || 'Geometria descrita sem inferência de impedância')
        : null,
    },
    branches: impedances.map((impedance, index) => ({
      id: options.branchIds?.[index] || `P${index + 1}`,
      impedance_ohm: { ...impedance },
      provenance: 'ASSUMPTION_ONLY',
    })),
    capacityProxy: {
      groupingFactor: {
        value: options.groupingFactor ?? 0.7,
        provenance: 'ASSUMPTION_ONLY',
      },
      tabulatedAmpacityPerConductor_A: {
        value: options.tabulatedAmpacity_A ?? 344,
        provenance: 'ASSUMPTION_ONLY',
      },
    },
    fault: {
      totalFaultCurrent_A: options.totalFaultCurrent_A ?? 20000,
      clearingTime_s: options.clearingTime_s ?? 0.2,
      adiabaticK_A_sqrt_s_per_mm2: {
        value: options.adiabaticK ?? 115,
        provenance: 'ASSUMPTION_ONLY',
      },
      imbalance,
    },
  };
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

let moduleState = 'module_missing';
let moduleLoadError = null;
let calculate = null;
let moduleSource = '';

if (fs.existsSync(MODULE_PATH)) {
  try {
    moduleSource = fs.readFileSync(MODULE_PATH, 'utf8');
    const loaded = require(MODULE_PATH);
    calculate = loaded?.calculateCablingBTParallelExperimental;
    moduleState = typeof calculate === 'function' ? 'ready' : 'export_missing';
  } catch (error) {
    moduleState = 'module_load_failure';
    moduleLoadError = error;
  }
}
const moduleLoadConsoleCalls = consoleEvents.length;

function invoke(input, omitArgument = false) {
  const consoleCountBefore = consoleEvents.length;
  try {
    const result = omitArgument ? calculate() : calculate(input);
    return {
      threw: false,
      error: null,
      result,
      consoleCalls: consoleEvents.length - consoleCountBefore,
    };
  } catch (error) {
    return {
      threw: true,
      error,
      result: null,
      consoleCalls: consoleEvents.length - consoleCountBefore,
    };
  }
}

function invariantEnvelope(result) {
  return isPlainObject(result)
    && Object.prototype.hasOwnProperty.call(result, 'ok')
    && Object.prototype.hasOwnProperty.call(result, 'classification')
    && Object.prototype.hasOwnProperty.call(result, 'data')
    && Array.isArray(result.assumptions)
    && Array.isArray(result.blockers)
    && Array.isArray(result.warnings)
    && isPlainObject(result.sourceStatus)
    && result.productionAllowed === false
    && result.displayNotice === NOTICE
    && Object.prototype.hasOwnProperty.call(result, 'error');
}

function mathematicalSuccess(execution) {
  const result = execution.result;
  return !execution.threw
    && execution.consoleCalls === 0
    && invariantEnvelope(result)
    && result.ok === true
    && result.classification === 'MATHEMATICAL_ONLY'
    && isPlainObject(result.data)
    && result.error === null;
}

function problemFailure(execution, code, expectedParams = {}) {
  const result = execution.result;
  if (execution.threw || execution.consoleCalls !== 0 || !invariantEnvelope(result)) return false;
  const error = result.error;
  return result.ok === false
    && result.classification === 'BLOCKED'
    && result.data === null
    && isPlainObject(error)
    && error.type === `https://ampai.dev/problems/${code}`
    && error.title === code
    && error.status === 422
    && error.code === code
    && error.severity === 'error'
    && isPlainObject(error.params)
    && Object.entries(expectedParams).every(([key, value]) => error.params[key] === value);
}

function successObservation(execution) {
  const result = execution.result;
  return {
    threw: execution.threw,
    ok: result?.ok ?? null,
    classification: result?.classification ?? null,
    data: jsonSafe(result?.data ?? null),
    blockers: jsonSafe(result?.blockers ?? []),
    sourceStatus: jsonSafe(result?.sourceStatus ?? null),
    productionAllowed: result?.productionAllowed ?? null,
    displayNotice: result?.displayNotice ?? null,
    consoleCalls: execution.consoleCalls,
  };
}

function failureObservation(execution) {
  return {
    threw: execution.threw,
    thrown: execution.error ? jsonSafe(execution.error) : null,
    ok: execution.result?.ok ?? null,
    classification: execution.result?.classification ?? null,
    code: execution.result?.error?.code ?? null,
    params: jsonSafe(execution.result?.error?.params ?? null),
    productionAllowed: execution.result?.productionAllowed ?? null,
    displayNotice: execution.result?.displayNotice ?? null,
    consoleCalls: execution.consoleCalls,
  };
}

function scientific(id, expected, execute) {
  return { id, category: 'scientific', expected, execute };
}

function guardrail(id, expected, execute) {
  return { id, category: 'guardrail', expected, execute };
}

function numeric(id, expectedCode, mutate) {
  return {
    id,
    category: 'numeric_fail_closed',
    expected: {
      ok: false,
      classification: 'BLOCKED',
      errorCode: expectedCode,
      rfc7807Status: 422,
      productionAllowed: false,
      displayNotice: NOTICE,
    },
    execute() {
      const input = makeInput();
      mutate(input);
      const execution = invoke(input);
      return {
        compliant: problemFailure(execution, expectedCode),
        observed: failureObservation(execution),
      };
    },
  };
}

function structural(id, expected, call) {
  return {
    id,
    category: 'structure_fail_closed',
    expected: {
      ok: false,
      classification: 'BLOCKED',
      errorCode: 'INPUT_STRUCTURE_INVALID',
      rfc7807Status: 422,
      productionAllowed: false,
      displayNotice: NOTICE,
      ...expected,
    },
    execute: call,
  };
}

function currentMagnitudes(result) {
  return result?.data?.loadSharing?.branchCurrents?.map((branch) => branch.current_A?.magnitude) || [];
}

const definitions = [
  scientific('SCI-01', {
    case: 'three_identical_impedances',
    branchCurrents_A: [300, 300, 300],
    deltaLoad: 1,
    mostLoadedBranchId: 'P1',
    tiedMostLoadedBranchIds: ['P1', 'P2', 'P3'],
    equivalentImpedance_ohm: complex(0.006666666666666667, 0.008),
    relativeTolerance: RELATIVE_TOLERANCE,
  }, () => {
    const execution = invoke(makeInput({
      impedances: [complex(0.020, 0.024), complex(0.020, 0.024), complex(0.020, 0.024)],
      groupingFactor: 1,
    }));
    const result = execution.result;
    const magnitudes = currentMagnitudes(result);
    const zeq = result?.data?.loadSharing?.equivalentImpedance_ohm;
    const compliant = mathematicalSuccess(execution)
      && magnitudes.length === 3
      && magnitudes.every((value) => closeTo(value, 300))
      && closeTo(result.data.loadSharing.deltaLoad, 1)
      && result.data.loadSharing.mostLoadedBranchId === 'P1'
      && JSON.stringify(result.data.loadSharing.tiedMostLoadedBranchIds) === JSON.stringify(['P1', 'P2', 'P3'])
      && closeTo(zeq?.re, 0.006666666666666667)
      && closeTo(zeq?.im, 0.008);
    return { compliant, observed: successObservation(execution) };
  }),

  scientific('SCI-02', {
    case: 'resistive_asymmetry',
    branchCurrents_A: [290.3225806451613, 304.83870967741933, 304.83870967741933],
    deltaLoad: 1.0161290322580645,
    mostLoadedBranchId: 'P2',
    tiedMostLoadedBranchIds: ['P2', 'P3'],
    relativeTolerance: RELATIVE_TOLERANCE,
  }, () => {
    const execution = invoke(makeInput({
      impedances: [complex(0.021, 0), complex(0.020, 0), complex(0.020, 0)],
      groupingFactor: 1,
    }));
    const magnitudes = currentMagnitudes(execution.result);
    const compliant = mathematicalSuccess(execution)
      && magnitudes.length === 3
      && [290.3225806451613, 304.83870967741933, 304.83870967741933]
        .every((expected, index) => closeTo(magnitudes[index], expected))
      && closeTo(execution.result.data.loadSharing.deltaLoad, 1.0161290322580645)
      && execution.result.data.loadSharing.mostLoadedBranchId === 'P2'
      && JSON.stringify(execution.result.data.loadSharing.tiedMostLoadedBranchIds) === JSON.stringify(['P2', 'P3']);
    return { compliant, observed: successObservation(execution) };
  }),

  scientific('SCI-03', {
    case: 'reactive_asymmetry',
    branchCurrents_A: [259.20, 299.15, 299.15, 347.33],
    mostLoadedBranchId: 'P4',
    deltaLoad: 1.1578,
    relativeTolerance: RELATIVE_TOLERANCE,
  }, () => {
    const execution = invoke(makeInput({
      totalLoadCurrent_A: 1200,
      impedances: [
        complex(0.020, 0.030),
        complex(0.020, 0.024),
        complex(0.020, 0.024),
        complex(0.020, 0.018),
      ],
      groupingFactor: 1,
    }));
    const result = execution.result;
    const magnitudes = currentMagnitudes(result);
    const compliant = mathematicalSuccess(execution)
      && magnitudes.length === 4
      && [259.20, 299.15, 299.15, 347.33]
        .every((expected, index) => closeTo(magnitudes[index], expected))
      && result.data.loadSharing.mostLoadedBranchId === 'P4'
      && closeTo(result.data.loadSharing.deltaLoad, 1.1578);
    return { compliant, observed: successObservation(execution) };
  }),

  scientific('SCI-04', {
    case: 'asymmetric_zeq_and_voltage_drop',
    equivalentImpedance_ohm: complex(0.00683333052186479, 0.007804861591403654),
    threePhase_V: 14.890184427989706,
    voltageDropPercent: null,
    normativeVoltageDropLimit: null,
    relativeTolerance: RELATIVE_TOLERANCE,
  }, () => {
    const execution = invoke(makeInput());
    const result = execution.result;
    const zeq = result?.data?.loadSharing?.equivalentImpedance_ohm;
    const voltageDrop = result?.data?.voltageDrop;
    const compliant = mathematicalSuccess(execution)
      && closeTo(zeq?.re, 0.00683333052186479)
      && closeTo(zeq?.im, 0.007804861591403654)
      && closeTo(voltageDrop?.threePhase_V, 14.890184427989706)
      && voltageDrop?.voltageDropPercent === null
      && voltageDrop?.normativeVoltageDropLimit === null;
    return { compliant, observed: successObservation(execution) };
  }),

  ...[
    ['SCI-05', 1.00, 344, 2.383720930232558],
    ['SCI-06', 0.85, 292.4, 2.8043775649794804],
    ['SCI-07', 0.70, 240.8, 3.40531561461794],
    ['SCI-08', 0.50, 172, 4.767441860465116],
  ].map(([id, groupingFactor, correctedAmpacity, continuousProxy]) => scientific(id, {
    case: 'continuous_capacity_proxy',
    groupingFactor,
    correctedAmpacityPerConductor_A: correctedAmpacity,
    nParallelContinuousProxy: continuousProxy,
    installableSelection: null,
    discreteSelectionBlocked: true,
    relativeTolerance: RELATIVE_TOLERANCE,
  }, () => {
    const execution = invoke(makeInput({
      totalLoadCurrent_A: 820,
      impedances: [complex(0.020, 0.024), complex(0.020, 0.024), complex(0.020, 0.024)],
      groupingFactor,
    }));
    const capacity = execution.result?.data?.capacityProxy;
    const compliant = mathematicalSuccess(execution)
      && closeTo(capacity?.correctedAmpacityPerConductor_A, correctedAmpacity)
      && closeTo(capacity?.nParallelContinuousProxy, continuousProxy)
      && capacity?.installableSelection === null
      && capacity?.discreteSelectionBlocked === true;
    return { compliant, observed: successObservation(execution) };
  })),

  ...[
    ['SCI-09', 1.00, 6666.666666666667, 25.925925925925927],
    ['SCI-10', 1.10, 7333.333333333333, 28.51851851851852],
  ].map(([id, deltaFault, branchFaultCurrent, minimumSection]) => scientific(id, {
    case: 'explicit_fault_imbalance',
    deltaFault,
    branchFaultCurrent_A: branchFaultCurrent,
    minimumSectionContinuous_mm2: minimumSection,
    installableSection: null,
    relativeTolerance: RELATIVE_TOLERANCE,
  }, () => {
    const execution = invoke(makeInput({ deltaFault }));
    const fault = execution.result?.data?.faultAdiabatic;
    const compliant = mathematicalSuccess(execution)
      && fault?.mode === 'EXPLICIT_ASSUMPTION'
      && closeTo(fault?.deltaFaultEffective, deltaFault)
      && closeTo(fault?.branchFaultCurrent_A, branchFaultCurrent)
      && closeTo(fault?.minimumSectionContinuous_mm2, minimumSection)
      && fault?.installableSection === null;
    return { compliant, observed: successObservation(execution) };
  })),

  scientific('SCI-11', {
    case: 'CENARIO_CONSERVADOR_ESCOLHIDO',
    mode: 'CONSERVATIVE_SINGLE_BRANCH',
    deltaFaultEffective: 3,
    branchFaultCurrent_A: 20000,
    minimumSectionContinuous_mm2: 77.77777777777777,
    installableSection: null,
    relativeTolerance: RELATIVE_TOLERANCE,
  }, () => {
    const execution = invoke(makeInput({ imbalanceMode: 'CONSERVATIVE_SINGLE_BRANCH' }));
    const fault = execution.result?.data?.faultAdiabatic;
    const compliant = mathematicalSuccess(execution)
      && fault?.mode === 'CONSERVATIVE_SINGLE_BRANCH'
      && closeTo(fault?.deltaFaultEffective, 3)
      && closeTo(fault?.branchFaultCurrent_A, 20000)
      && closeTo(fault?.minimumSectionContinuous_mm2, 77.77777777777777)
      && fault?.installableSection === null;
    return { compliant, observed: successObservation(execution) };
  }),

  guardrail('GRD-01', {
    deltaLoadAndDeltaFaultIndependent: true,
    deltaFaultEffective: 1.1,
    branchFaultCurrent_A: 7333.333333333333,
  }, () => {
    const asymmetric = invoke(makeInput({ deltaFault: 1.1 }));
    const ideal = invoke(makeInput({
      impedances: [complex(0.020, 0.024), complex(0.020, 0.024), complex(0.020, 0.024)],
      deltaFault: 1.1,
    }));
    const a = asymmetric.result?.data;
    const b = ideal.result?.data;
    const compliant = mathematicalSuccess(asymmetric)
      && mathematicalSuccess(ideal)
      && !closeTo(a.loadSharing.deltaLoad, b.loadSharing.deltaLoad)
      && closeTo(a.faultAdiabatic.deltaFaultEffective, 1.1)
      && closeTo(b.faultAdiabatic.deltaFaultEffective, 1.1)
      && closeTo(a.faultAdiabatic.branchFaultCurrent_A, b.faultAdiabatic.branchFaultCurrent_A);
    return {
      compliant,
      observed: {
        asymmetric: successObservation(asymmetric),
        ideal: successObservation(ideal),
      },
    };
  }),

  guardrail('GRD-02', {
    nParallel: 3,
    nCircuitsValues: [1, 7],
    electricalResultsIndependentOfNCircuits: true,
  }, () => {
    const oneCircuit = invoke(makeInput({ nCircuits: 1 }));
    const sevenCircuits = invoke(makeInput({ nCircuits: 7 }));
    const a = oneCircuit.result?.data;
    const b = sevenCircuits.result?.data;
    const compliant = mathematicalSuccess(oneCircuit)
      && mathematicalSuccess(sevenCircuits)
      && a.inputEcho.nParallel === 3
      && b.inputEcho.nParallel === 3
      && a.inputEcho.nCircuits === 1
      && b.inputEcho.nCircuits === 7
      && closeTo(a.loadSharing.deltaLoad, b.loadSharing.deltaLoad)
      && closeTo(a.capacityProxy.nParallelContinuousProxy, b.capacityProxy.nParallelContinuousProxy);
    return { compliant, observed: { oneCircuit: successObservation(oneCircuit), sevenCircuits: successObservation(sevenCircuits) } };
  }),

  guardrail('GRD-03', {
    geometryStatus: 'NOT_PROVIDED',
    explicitImpedances: true,
    classification: 'MATHEMATICAL_ONLY',
    engineeringAdequacyBlocked: true,
  }, () => {
    const execution = invoke(makeInput());
    const blockers = execution.result?.blockers || [];
    const compliant = mathematicalSuccess(execution)
      && execution.result.data.inputEcho.geometryStatus === 'NOT_PROVIDED'
      && blockers.some((blocker) => blocker.code === 'ENGINEERING_ADEQUACY_BLOCKED');
    return { compliant, observed: successObservation(execution) };
  }),

  guardrail('GRD-04', {
    precedence: [
      { geometryStatus: 'NOT_PROVIDED', errorCode: 'GEOMETRY_AND_IMPEDANCE_MISSING' },
      { geometryStatus: 'DESCRIBED', errorCode: 'PARALLEL_Z_MISSING' },
    ],
  }, () => {
    const noGeometry = makeInput();
    delete noGeometry.branches;
    const described = makeInput({ geometryStatus: 'DESCRIBED' });
    delete described.branches;
    const first = invoke(noGeometry);
    const second = invoke(described);
    const compliant = problemFailure(first, 'GEOMETRY_AND_IMPEDANCE_MISSING')
      && problemFailure(second, 'PARALLEL_Z_MISSING');
    return { compliant, observed: { noGeometry: failureObservation(first), describedGeometry: failureObservation(second) } };
  }),

  guardrail('GRD-05', { displayNotice: NOTICE, presentInSuccessAndFailure: true }, () => {
    const success = invoke(makeInput());
    const invalid = makeInput();
    invalid.branches[0].impedance_ohm = complex(0, 0);
    const failure = invoke(invalid);
    const compliant = mathematicalSuccess(success)
      && problemFailure(failure, 'PARALLEL_Z_ZERO')
      && success.result.displayNotice === NOTICE
      && failure.result.displayNotice === NOTICE;
    return { compliant, observed: { success: successObservation(success), failure: failureObservation(failure) } };
  }),

  guardrail('GRD-06', { productionAllowed: false, invariantInSuccessAndFailure: true }, () => {
    const success = invoke(makeInput());
    const invalid = makeInput();
    invalid.fault.totalFaultCurrent_A = -1;
    const failure = invoke(invalid);
    const compliant = mathematicalSuccess(success)
      && problemFailure(failure, 'FAULT_CURRENT_INVALID')
      && success.result.productionAllowed === false
      && failure.result.productionAllowed === false;
    return { compliant, observed: { success: successObservation(success), failure: failureObservation(failure) } };
  }),

  guardrail('GRD-07', { requiredBlockers: ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'] }, () => {
    const execution = invoke(makeInput());
    const observedCodes = execution.result?.blockers?.map((blocker) => blocker.code) || [];
    const compliant = mathematicalSuccess(execution)
      && ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'].every((code) => observedCodes.includes(code));
    return { compliant, observed: { ...successObservation(execution), observedCodes } };
  }),

  guardrail('GRD-08', {
    providedParallelCountIsEcho: true,
    providedCountMeetsContinuousProxyIsMathematicalOnly: true,
    selectedFieldsAbsent: true,
    installableSelection: null,
    installableSection: null,
  }, () => {
    const execution = invoke(makeInput());
    const capacity = execution.result?.data?.capacityProxy;
    const fault = execution.result?.data?.faultAdiabatic;
    const selectedFields = capacity && Object.keys(capacity).filter((key) => /^selected/i.test(key));
    const compliant = mathematicalSuccess(execution)
      && capacity.providedParallelCount === 3
      && typeof capacity.providedCountMeetsContinuousProxy === 'boolean'
      && selectedFields.length === 0
      && capacity.installableSelection === null
      && capacity.discreteSelectionBlocked === true
      && fault.installableSection === null;
    return { compliant, observed: { ...successObservation(execution), selectedFields: selectedFields || null } };
  }),

  guardrail('GRD-09', {
    classification: 'RNC-P_EXPERIMENTAL_NON_CANONICAL',
    scientificBaselineSha: SCIENTIFIC_BASELINE,
    primarySourceComplete: false,
    iecConformity: false,
  }, () => {
    const execution = invoke(makeInput());
    const source = execution.result?.sourceStatus;
    const compliant = mathematicalSuccess(execution)
      && source.classification === 'RNC-P_EXPERIMENTAL_NON_CANONICAL'
      && source.scientificBaselineSha === SCIENTIFIC_BASELINE
      && source.primarySourceComplete === false
      && source.iecConformity === false;
    return { compliant, observed: successObservation(execution) };
  }),

  guardrail('GRD-10', {
    enginePrecision: 'machine_precision_no_internal_rounding',
    qaRelativeTolerance: RELATIVE_TOLERANCE,
    zeroAbsoluteTolerance: ZERO_ABSOLUTE_TOLERANCE,
    threePhase_V: 14.890184427989706,
  }, () => {
    const execution = invoke(makeInput());
    const observed = execution.result?.data?.voltageDrop?.threePhase_V;
    const compliant = mathematicalSuccess(execution)
      && closeTo(observed, 14.890184427989706)
      && observed !== Number(observed.toFixed(2));
    return { compliant, observed: { ...successObservation(execution), unroundedValue: observed } };
  }),

  guardrail('GRD-11', {
    synchronousDeterministicPureFunction: true,
    zeroDOMRendererConsoleNetworkFilesystem: true,
    inputNotMutated: true,
    domainErrorsDoNotThrow: true,
  }, () => {
    const input = makeInput();
    const before = JSON.stringify(input);
    const consoleCountBefore = consoleEvents.length;
    const first = invoke(input);
    const second = invoke(clone(input));
    const invalid = invoke(undefined, true);
    const source = stripComments(moduleSource);
    const forbidden = [
      /\bdocument\b/,
      /\b(?:render|renderer|ui_render)\b/,
      /\bXMLHttpRequest\b/,
      /\bWebSocket\b/,
      /\bfetch\s*\(/,
      /\bconsole\.(?:log|warn|error)\s*\(/,
      /require\s*\(\s*['"](?:node:)?(?:fs|http|https|net|dgram)['"]\s*\)/,
      /\bMath\.random\s*\(/,
      /\b(?:Date\.now|performance\.now)\s*\(/,
      /\bglobalThis\b/,
    ].filter((pattern) => pattern.test(source)).map((pattern) => pattern.source);
    const deterministic = mathematicalSuccess(first)
      && mathematicalSuccess(second)
      && JSON.stringify(first.result) === JSON.stringify(second.result);
    const compliant = deterministic
      && before === JSON.stringify(input)
      && !invalid.threw
      && problemFailure(invalid, 'INPUT_STRUCTURE_INVALID', { reason: 'root_not_plain_object' })
      && moduleLoadConsoleCalls === 0
      && consoleCountBefore === 0
      && consoleEvents.length === 0
      && forbidden.length === 0;
    return {
      compliant,
      observed: {
        deterministic,
        inputUnchanged: before === JSON.stringify(input),
        invalidCall: failureObservation(invalid),
        moduleLoadConsoleCalls,
        consoleCallsBeforePurityProbe: consoleCountBefore,
        consoleCallsDuringPurityProbe: consoleEvents.length - consoleCountBefore,
        forbiddenSourcePatterns: forbidden,
      },
    };
  }),

  numeric('NUM-01', 'PARALLEL_Z_ZERO', (input) => { input.branches[0].impedance_ohm = complex(0, 0); }),
  numeric('NUM-02', 'PARALLEL_Z_NON_FINITE', (input) => { input.branches[0].impedance_ohm.re = Infinity; }),
  numeric('NUM-03', 'PARALLEL_Z_NON_FINITE', (input) => { input.branches[0].impedance_ohm.im = NaN; }),
  numeric('NUM-04', 'FAULT_CURRENT_INVALID', (input) => { input.fault.totalFaultCurrent_A = -1; }),
  numeric('NUM-05', 'FAULT_CURRENT_INVALID', (input) => { input.fault.totalFaultCurrent_A = NaN; }),
  numeric('NUM-06', 'FAULT_TIME_INVALID', (input) => { input.fault.clearingTime_s = -0.1; }),
  numeric('NUM-07', 'FAULT_TIME_INVALID', (input) => { input.fault.clearingTime_s = Infinity; }),
  numeric('NUM-08', 'ADIABATIC_K_INVALID', (input) => { input.fault.adiabaticK_A_sqrt_s_per_mm2.value = 0; }),
  numeric('NUM-09', 'ADIABATIC_K_INVALID', (input) => { input.fault.adiabaticK_A_sqrt_s_per_mm2.value = -5; }),
  numeric('NUM-10', 'FAULT_IMBALANCE_INVALID', (input) => { input.fault.imbalance.deltaFault = 0.5; }),
  numeric('NUM-11', 'FAULT_IMBALANCE_INVALID', (input) => { input.fault.imbalance.deltaFault = -1; }),
  numeric('NUM-12', 'FAULT_IMBALANCE_INVALID', (input) => { input.fault.imbalance.deltaFault = Infinity; }),

  structural('STR-01', { path: '$', reason: 'root_not_plain_object', input: 'undefined' }, () => {
    const execution = invoke(undefined, true);
    return {
      compliant: problemFailure(execution, 'INPUT_STRUCTURE_INVALID', { path: '$', reason: 'root_not_plain_object' }),
      observed: failureObservation(execution),
    };
  }),
  structural('STR-02', { path: '$', reason: 'root_not_plain_object', input: null }, () => {
    const execution = invoke(null);
    return {
      compliant: problemFailure(execution, 'INPUT_STRUCTURE_INVALID', { path: '$', reason: 'root_not_plain_object' }),
      observed: failureObservation(execution),
    };
  }),
  structural('STR-03', { path: '$', reason: 'root_not_plain_object', input: [] }, () => {
    const execution = invoke([]);
    return {
      compliant: problemFailure(execution, 'INPUT_STRUCTURE_INVALID', { path: '$', reason: 'root_not_plain_object' }),
      observed: failureObservation(execution),
    };
  }),
  structural('STR-04', { path: '$', reason: 'root_not_plain_object', input: 'primitive' }, () => {
    const execution = invoke('invalid');
    return {
      compliant: problemFailure(execution, 'INPUT_STRUCTURE_INVALID', { path: '$', reason: 'root_not_plain_object' }),
      observed: failureObservation(execution),
    };
  }),
  structural('STR-05', { path: '$.geometry', reason: 'missing_structural_container' }, () => {
    const input = makeInput();
    delete input.geometry;
    const execution = invoke(input);
    return {
      compliant: problemFailure(execution, 'INPUT_STRUCTURE_INVALID', {
        path: '$.geometry',
        reason: 'missing_structural_container',
      }),
      observed: failureObservation(execution),
    };
  }),
  structural('STR-06', {
    reason: 'unexpected_property',
    scopes: ['root', 'nested'],
  }, () => {
    const rootInput = makeInput();
    rootInput.unexpected = true;
    const nestedInput = makeInput();
    nestedInput.geometry.unexpected = true;
    const root = invoke(rootInput);
    const nested = invoke(nestedInput);
    const compliant = problemFailure(root, 'INPUT_STRUCTURE_INVALID', { reason: 'unexpected_property' })
      && problemFailure(nested, 'INPUT_STRUCTURE_INVALID', { reason: 'unexpected_property' });
    return { compliant, observed: { root: failureObservation(root), nested: failureObservation(nested) } };
  }),
];

function categoryForId(id) {
  if (/^SCI-\d{2}$/.test(id)) return 'scientific';
  if (/^GRD-\d{2}$/.test(id)) return 'guardrail';
  if (/^NUM-\d{2}$/.test(id)) return 'numeric_fail_closed';
  if (/^STR-\d{2}$/.test(id)) return 'structure_fail_closed';
  return null;
}

function expectedIds() {
  const range = (prefix, count) => Array.from(
    { length: count },
    (_value, index) => `${prefix}-${String(index + 1).padStart(2, '0')}`,
  );
  return [
    ...range('SCI', 11),
    ...range('GRD', 11),
    ...range('NUM', 12),
    ...range('STR', 6),
  ];
}

function evaluate(definition) {
  if (moduleState !== 'ready') {
    return {
      id: definition.id,
      category: definition.category,
      classification: 'FUNCTIONAL_FAILURE',
      assertionExercised: true,
      expected: jsonSafe(definition.expected),
      observed: {
        reason: moduleState,
        ...(moduleLoadError ? { error: jsonSafe(moduleLoadError) } : {}),
      },
      compliant: false,
      displayNotice: NOTICE,
    };
  }

  try {
    const outcome = definition.execute();
    const compliant = outcome?.compliant === true;
    return {
      id: definition.id,
      category: definition.category,
      classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
      assertionExercised: true,
      expected: jsonSafe(definition.expected),
      observed: isPlainObject(outcome?.observed)
        ? jsonSafe(outcome.observed)
        : { reason: 'invalid_observation' },
      compliant,
      displayNotice: NOTICE,
    };
  } catch (error) {
    return {
      id: definition.id,
      category: definition.category,
      classification: 'FUNCTIONAL_FAILURE',
      assertionExercised: true,
      expected: jsonSafe(definition.expected),
      observed: { reason: 'assertion_exception', error: jsonSafe(error) },
      compliant: false,
      displayNotice: NOTICE,
    };
  }
}

function validateReport(report) {
  return isPlainObject(report)
    && typeof report.id === 'string'
    && report.category === categoryForId(report.id)
    && ['PASS', 'FUNCTIONAL_FAILURE'].includes(report.classification)
    && report.assertionExercised === true
    && isPlainObject(report.expected)
    && isPlainObject(report.observed)
    && typeof report.compliant === 'boolean'
    && report.classification === (report.compliant ? 'PASS' : 'FUNCTIONAL_FAILURE')
    && report.displayNotice === NOTICE;
}

function restoreConsole() {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
}

function main() {
  const reports = definitions.map(evaluate);
  const ids = reports.map((report) => report.id);
  const requiredIds = expectedIds();
  const uniqueIds = new Set(ids);
  const reportLines = reports.map((report) => `${REPORT_PREFIX}${JSON.stringify(report, jsonReplacer)}`);

  const parsedLinesValid = reportLines.every((line) => {
    if (!line.startsWith(REPORT_PREFIX)) return false;
    try {
      return validateReport(JSON.parse(line.slice(REPORT_PREFIX.length)));
    } catch (_error) {
      return false;
    }
  });

  const configValid = reports.length === EXPECTED_REPORTS
    && definitions.length === EXPECTED_REPORTS
    && uniqueIds.size === EXPECTED_REPORTS
    && JSON.stringify(ids) === JSON.stringify(requiredIds)
    && reports.every(validateReport)
    && parsedLinesValid;

  const compliant = reports.filter((report) => report.compliant).length;
  const nonCompliant = reports.length - compliant;
  const assertionsExercised = reports.filter((report) => report.assertionExercised === true).length;
  const processExitCode = !configValid ? 3 : (nonCompliant > 0 ? 1 : 0);
  const classification = processExitCode === 3
    ? 'CONFIG_ERROR'
    : (processExitCode === 1 ? 'FUNCTIONAL_FAILURE' : 'PASS');

  const summary = {
    classification,
    reports: reports.length,
    expectedReports: EXPECTED_REPORTS,
    compliant,
    nonCompliant,
    assertionsExercised,
    processExitCode,
  };
  const summaryLine = `${SUMMARY_PREFIX}${JSON.stringify(summary)}`;

  let summaryValid = summaryLine.startsWith(SUMMARY_PREFIX);
  try {
    const parsed = JSON.parse(summaryLine.slice(SUMMARY_PREFIX.length));
    summaryValid = summaryValid
      && parsed.reports === reports.length
      && parsed.expectedReports === EXPECTED_REPORTS
      && parsed.compliant === compliant
      && parsed.nonCompliant === nonCompliant
      && parsed.assertionsExercised === assertionsExercised
      && parsed.processExitCode === processExitCode
      && parsed.classification === classification;
  } catch (_error) {
    summaryValid = false;
  }

  if (!summaryValid && processExitCode !== 3) {
    summary.classification = 'CONFIG_ERROR';
    summary.processExitCode = 3;
  }

  restoreConsole();
  process.stdout.write(`${reportLines.join('\n')}\n`);
  process.stdout.write(`${SUMMARY_PREFIX}${JSON.stringify(summary)}\n`);
  process.exitCode = summary.processExitCode;
}

try {
  main();
} finally {
  restoreConsole();
}
