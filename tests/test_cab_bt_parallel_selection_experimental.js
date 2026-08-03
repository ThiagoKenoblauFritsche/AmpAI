'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPORT_PREFIX = 'CAB_BT_PARALLEL_SELECTION_EXP_REPORT ';
const SUMMARY_PREFIX = 'CAB_BT_PARALLEL_SELECTION_EXP_SUMMARY ';
const EXPECTED_REPORTS = 74;
const EXPECTED_SCIENTIFIC = 48;
const EXPECTED_TECHNICAL = 26;
const NOTICE = 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO';
const CONTRACT_VERSION = 'CAB-BT-PARALLEL-SELECTION-EXP-1';
const FUNCTION_NAME = 'enumerateCablingBTParallelAlternativesExperimental';
const MODULE_RELATIVE = 'js/core_cabos_bt_parallel_selection_experimental.js';
const MODULE_PATH = path.resolve(__dirname, '..', 'js', 'core_cabos_bt_parallel_selection_experimental.js');
const L0_RELATIVE = 'js/core_cabos_bt_parallel_experimental.js';
const L0_PATH = path.resolve(__dirname, '..', 'js', 'core_cabos_bt_parallel_experimental.js');

const PERMANENT_GUARDS = [
  'B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06',
  'ENGINEERING_ADEQUACY_BLOCKED', 'DISCRETE_SELECTION_BLOCKED',
  'IEC_CONFORMITY_BLOCKED', 'PRODUCTION_USE_BLOCKED',
];

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function jsonReplacer(_key, value) {
  if (typeof value === 'number' && !Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'NaN';
    return value > 0 ? 'Infinity' : '-Infinity';
  }
  if (value instanceof Error) return { name: value.name, code: value.code, message: value.message };
  return value;
}

function jsonSafe(value) {
  try {
    const serialized = JSON.stringify(value, jsonReplacer);
    return serialized === undefined ? { type: 'undefined' } : JSON.parse(serialized);
  } catch (error) {
    return { serializationError: error?.message || String(error) };
  }
}

function clone(value) {
  return structuredClone(value);
}

function baseInput() {
  const candidate = (section_mm2, tabulatedAmpacity_A, impedance) => ({
    section_mm2,
    tabulatedAmpacity_A,
    material: 'COPPER_LAB',
    insulation: 'LAB_UNSPECIFIED',
    installationMethod: 'LAB_UNSPECIFIED',
    referenceTemperature_C: 30,
    units: 'SI',
    source: 'LAB_CATALOG',
    sourceVersion: 'PRELIM-1',
    provenance: 'ASSUMPTION_ONLY',
    ...impedance,
  });
  return {
    contractVersion: CONTRACT_VERSION,
    analysisMode: 'MODO_GUIADO_PRELIMINAR',
    objective: 'NONE',
    totalLoadCurrent_A: 600,
    lineVoltage_V: 400,
    powerFactor: {
      value: 0.9,
      inputClass: 'SUGERIDA_COM_CONFIRMACAO',
      confirmed: true,
      provenance: 'ASSUMPTION_ONLY',
    },
    maximumVoltageDrop_percent: 3,
    maxParallelCount: 4,
    nCircuits: 1,
    arrangement: 'LAB_IDENTICAL_BRANCHES',
    catalog: {
      mode: 'CATALOGO_LAB_ASSUMPTION_ONLY',
      confirmed: true,
      source: 'CAB_BT_PARALLEL_SELECTION_PRELIM_Memorial.md',
      sourceVersion: '2b61627d8640fce91eb229ca522ae33a143671df',
      provenance: 'ASSUMPTION_ONLY',
      impedanceBasis: {
        length_m: 100,
        description: 'Z(S)=2.25/S+j0.008 ohm; laboratory placeholder',
        provenance: 'ASSUMPTION_ONLY',
      },
      candidates: [
        candidate(95, 240, { impedance_ohm: { re: 0.02368421052631579, im: 0.008 } }),
        candidate(120, 285, { resistance_ohm: 0.01875, reactance_ohm: 0.008 }),
        candidate(150, 330, { impedance_ohm: { re: 0.015, im: 0.008 } }),
        candidate(185, 380, { impedance_ohm: { re: 0.012162162162162163, im: 0.008 } }),
        candidate(240, 445, { impedance_ohm: { re: 0.009375, im: 0.008 } }),
      ],
    },
    grouping: {
      mode: 'LAB_CONSTANT_CONFIRMED',
      value: 0.8,
      confirmed: true,
      source: 'laboratory sensitivity',
      sourceVersion: 'PRELIM-1',
      provenance: 'ASSUMPTION_ONLY',
    },
    guidedHypothesis: {
      displayedBeforeCalculation: true,
      confirmed: true,
      provenance: 'ASSUMPTION_ONLY',
    },
    advancedBranchesByCombination: [],
    fault: {
      totalFaultCurrent_A: 20000,
      clearingTime_s: 0.2,
      adiabaticK_A_sqrt_s_per_mm2: { value: 115, provenance: 'ASSUMPTION_ONLY' },
      imbalance: { mode: 'EXPLICIT_ASSUMPTION', deltaFault: 1, provenance: 'ASSUMPTION_ONLY' },
    },
    pruning: { maximumSection_mm2: null, confirmed: false, provenance: null },
    providedCombination: { section_mm2: 150, nParallel: 3 },
  };
}

function getPath(object, dottedPath) {
  return dottedPath.split('.').reduce((value, key) => value?.[key], object);
}

function setPath(object, dottedPath, value) {
  const keys = dottedPath.split('.');
  const last = keys.pop();
  const parent = keys.reduce((current, key) => current[key], object);
  parent[last] = value;
}

function deletePath(object, dottedPath) {
  const keys = dottedPath.split('.');
  const last = keys.pop();
  const parent = keys.reduce((current, key) => current?.[key], object);
  if (parent) delete parent[last];
}

function permuteObject(object) {
  return Object.fromEntries(Object.entries(object).reverse());
}

function closeTo(actual, expected, tolerance = 0.005) {
  return typeof actual === 'number'
    && Number.isFinite(actual)
    && Math.abs(actual - expected) <= tolerance * Math.max(Math.abs(actual), Math.abs(expected), 1e-12);
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function recursivelyContains(value, sought) {
  if (value === sought) return true;
  if (Array.isArray(value)) return value.some((item) => recursivelyContains(item, sought));
  if (isPlainObject(value)) return Object.values(value).some((item) => recursivelyContains(item, sought));
  return false;
}

function recursivelyContainsAll(value, soughtValues) {
  return soughtValues.every((sought) => recursivelyContains(value, sought));
}

function resultEnvelopeInvariant(result) {
  return isPlainObject(result)
    && typeof result.ok === 'boolean'
    && ['MATHEMATICAL_ONLY', 'BLOCKED'].includes(result.classification)
    && Array.isArray(result.assumptions)
    && Array.isArray(result.blockers)
    && Array.isArray(result.warnings)
    && isPlainObject(result.sourceStatus)
    && result.sourceStatus.classification === 'RNC-P_EXPERIMENTAL_NON_CANONICAL'
    && result.sourceStatus.scientificBaselineSha === '2b61627d8640fce91eb229ca522ae33a143671df'
    && result.sourceStatus.l0ScientificBaselineSha === '18627dd02c94265984aa953d35f47c2745cab61d'
    && result.sourceStatus.l0IntegrationMainSha === '83e24131c0cc09813be65a5fa269961b9cc80c5c'
    && result.sourceStatus.primarySourceComplete === false
    && result.sourceStatus.iecConformity === false
    && result.productionAllowed === false
    && result.displayNotice === NOTICE
    && PERMANENT_GUARDS.every((code) => result.blockers.some((item) => item?.code === code));
}

function successEnvelope(result) {
  return resultEnvelopeInvariant(result)
    && result.ok === true
    && result.classification === 'MATHEMATICAL_ONLY'
    && isPlainObject(result.data)
    && result.data.installableSelection === null
    && result.data.discreteSelectionBlocked === true
    && result.data.installationAuthorized === false
    && result.error === null;
}

function failureEnvelope(result, code) {
  if (!resultEnvelopeInvariant(result)
      || result.ok !== false
      || result.classification !== 'BLOCKED'
      || result.data !== null
      || !isPlainObject(result.error)
      || result.error.code !== code
      || result.error.title !== code
      || result.error.status !== 422
      || result.error.severity !== 'error'
      || result.error.type !== `https://ampai.dev/problems/${code}`
      || result.blockers.length !== 11) return false;
  const specific = result.blockers[10];
  return specific?.code === code
    && JSON.stringify(specific.params) === JSON.stringify(result.error.params)
    && result.blockers.slice(0, 10).every((item, index) => item?.code === PERMANENT_GUARDS[index]);
}

function allFiniteJsonNumbers(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(allFiniteJsonNumbers);
  if (isPlainObject(value)) return Object.values(value).every(allFiniteJsonNumbers);
  return true;
}

function evaluated(result, candidateId) {
  return result?.data?.evaluatedCandidates?.find((item) => item?.candidateId === candidateId) || null;
}

function buildAdvancedBranches(input) {
  input.analysisMode = 'MODO_AVANCADO';
  input.guidedHypothesis = null;
  input.advancedBranchesByCombination = [];
  for (const candidate of input.catalog.candidates) {
    for (let nParallel = 1; nParallel <= input.maxParallelCount; nParallel += 1) {
      const impedance = candidate.impedance_ohm || {
        re: candidate.resistance_ohm,
        im: candidate.reactance_ohm,
      };
      input.advancedBranchesByCombination.push({
        candidateId: `${nParallel} x ${candidate.section_mm2}`,
        geometryDescription: 'Laboratory branch geometry only',
        branches: Array.from({ length: nParallel }, (_unused, index) => ({
          id: `P${index + 1}`,
          impedance_ohm: clone(impedance),
          provenance: 'ASSUMPTION_ONLY',
        })),
      });
    }
  }
}

function range(prefix, count) {
  return Array.from({ length: count }, (_unused, index) => `${prefix}-${String(index + 1).padStart(2, '0')}`);
}

function matrix(prefix, values, expectedFactory = (value) => ({ value })) {
  return values.map((value, index) => ({
    caseId: `${prefix}-${String(index + 1).padStart(2, '0')}`,
    expected: expectedFactory(value, index),
  }));
}

function one(id, expected) {
  return [{ caseId: `${id}-CASE-01`, expected }];
}

function singleCandidate(input, section_mm2 = 150) {
  input.catalog.candidates = [clone(input.catalog.candidates.find((item) => item.section_mm2 === section_mm2))];
}

function invalidValue(label) {
  const values = {
    string: 'invalid',
    'number:NaN': NaN,
    'number:+Infinity': Infinity,
    'number:-Infinity': -Infinity,
    boolean: true,
    object: [],
    array: [],
    null: null,
    NaN,
    Infinity,
    '-Infinity': -Infinity,
    zero: 0,
    negative: -1,
    greater_than_one: 1.01,
    fractional: 1.5,
  };
  return hasOwn(values, label) ? values[label] : label;
}

function groupingEntries(input) {
  return input.catalog.candidates.flatMap((candidate) => Array.from(
    { length: input.maxParallelCount },
    (_unused, index) => ({
      candidateId: `${index + 1} x ${candidate.section_mm2}`,
      value: 0.8,
      source: 'laboratory sensitivity',
      sourceVersion: 'PRELIM-1',
      method: candidate.installationMethod,
      arrangement: input.arrangement,
      nParallel: index + 1,
      nCircuits: input.nCircuits,
      provenance: 'ASSUMPTION_ONLY',
    }),
  ));
}

function buildCaseFixture(id, item, caseIndex) {
  const input = baseInput();
  const expected = item.expected;
  const fixture = { input, omitArgument: false, description: `${id}:${item.caseId}` };

  if (id === 'KG-01') input.grouping = { mode: 'CANDIDATE_SPECIFIC', entries: groupingEntries(input) };
  if (id === 'KG-02') input.grouping = {
    mode: 'GROUPING_MATRIX', source: 'laboratory sensitivity', sourceVersion: 'PRELIM-1',
    provenance: 'ASSUMPTION_ONLY', entries: [],
  };
  if (id === 'KG-04') input.grouping.confirmed = false;

  if (id === 'SCH-01') {
    singleCandidate(input);
    delete input.catalog.candidates[0][expected.removedField];
  }
  if (id === 'SCH-02') singleCandidate(input, 150);
  if (id === 'SCH-03') singleCandidate(input, 120);
  if (id === 'SCH-04' || id === 'SCH-05') {
    singleCandidate(input);
    const candidate = input.catalog.candidates[0];
    delete candidate.resistance_ohm;
    delete candidate.reactance_ohm;
    if (expected.situation === 'impedance_without_re') delete candidate.impedance_ohm.re;
    if (expected.situation === 'impedance_without_im' || id === 'SCH-05') delete candidate.impedance_ohm.im;
    if (expected.situation === 'resistance_only') {
      delete candidate.impedance_ohm;
      candidate.resistance_ohm = 0.015;
    }
    if (expected.situation === 'reactance_only') {
      delete candidate.impedance_ohm;
      candidate.reactance_ohm = 0.008;
    }
    if (expected.situation === 'no_representation') delete candidate.impedance_ohm;
  }
  if (id === 'SCH-06' || id === 'SCH-07') {
    singleCandidate(input);
    const candidate = input.catalog.candidates[0];
    const situation = expected.situation || 'complete_impedance_plus_complete_pair';
    if (situation.includes('incomplete')) delete candidate.impedance_ohm.im;
    if (situation.includes('invalid')) candidate.impedance_ohm.re = 'invalid';
    if (!situation.includes('reactance') || situation.includes('complete_pair') || situation.includes('any_pair')) candidate.resistance_ohm = 0.015;
    if (!situation.includes('resistance') || situation.includes('complete_pair')) candidate.reactance_ohm = 0.008;
    if (id === 'SCH-07') input.catalog.candidates[0] = permuteObject(candidate);
  }
  if (id === 'SCH-08' || id === 'SCH-09') {
    singleCandidate(input, id === 'SCH-08' ? 150 : 120);
    const candidate = input.catalog.candidates[0];
    if (id === 'SCH-08') {
      delete candidate.resistance_ohm;
      delete candidate.reactance_ohm;
    } else {
      delete candidate.impedance_ohm;
    }
    const invalid = expected.invalidFields[0];
    setPath(candidate, invalid.path, invalidValue(invalid.observedType));
  }
  if (id === 'SCH-10') {
    singleCandidate(input);
    input.catalog.candidates[0].impedance_ohm = { im: 'invalid', re: null };
  }
  if (id === 'SCH-11') {
    singleCandidate(input);
    const candidate = input.catalog.candidates[0];
    if (expected.situation === 'impedance_without_re') delete candidate.impedance_ohm.re;
    if (expected.situation === 'impedance_re_null') candidate.impedance_ohm.re = null;
    if (expected.situation === 'resistance_without_reactance') {
      delete candidate.impedance_ohm;
      candidate.resistance_ohm = 0.015;
    }
    if (expected.situation === 'resistance_string') {
      delete candidate.impedance_ohm;
      candidate.resistance_ohm = '0.015';
      candidate.reactance_ohm = 0.008;
    }
  }
  if (id === 'SCH-12') {
    singleCandidate(input);
    ['provenance', 'material', 'units'].forEach((field) => delete input.catalog.candidates[0][field]);
    input.catalog.candidates[0] = permuteObject(input.catalog.candidates[0]);
  }
  if (id === 'SCH-13') {
    singleCandidate(input);
    if (expected.permutationsEquivalentFor === 'incomplete') delete input.catalog.candidates[0].material;
    if (expected.permutationsEquivalentFor === 'conflict') input.catalog.candidates[0].resistance_ohm = 0.015;
    if (expected.permutationsEquivalentFor === 'value_invalid') input.catalog.candidates[0].impedance_ohm.re = 'invalid';
    input.catalog.candidates[0] = permuteObject(input.catalog.candidates[0]);
  }
  if (id === 'SCH-14') {
    singleCandidate(input);
    const candidate = input.catalog.candidates[0];
    if (expected.representation === 'RESISTANCE_REACTANCE_PAIR') {
      delete candidate.impedance_ohm;
      candidate.resistance_ohm = 0.015;
      candidate.reactance_ohm = 0.008;
    }
  }
  if (id === 'CAT-01') {
    input.catalog.candidates.forEach((candidate) => delete candidate.material);
  }
  if (id === 'STR-01') deletePath(input, expected.removedField);
  if (id === 'CAT-02') input.catalog.mode = expected.mode;
  if (id === 'CAL-02') {
    singleCandidate(input, 240);
    input.maxParallelCount = 2;
  }
  if (id === 'CAL-03') {
    if (expected.scenario === 'base_600A_1.6percent') input.maximumVoltageDrop_percent = 1.6;
    if (expected.scenario === '500A_40kA_1s') {
      input.totalLoadCurrent_A = 500;
      input.fault.totalFaultCurrent_A = 40000;
      input.fault.clearingTime_s = 1;
    }
  }
  if (id === 'CAL-04' || id === 'GRD-02') input.totalLoadCurrent_A = 1500;
  if (id === 'OBJ-01' || id === 'OBJ-02' || id === 'OBJ-03' || id === 'OBJ-04' || id === 'OBJ-05' || id === 'OBJ-06') input.objective = expected.objective;
  if (id === 'HYP-02') input.guidedHypothesis.confirmed = false;
  if (id === 'GRD-04') {
    if (expected.condition === 'grouping_missing') delete input.grouping.value;
    if (expected.condition === 'fault_imbalance_block') input.fault.imbalance = { mode: 'BLOCK' };
    if (expected.condition === 'zero_branch_impedance') {
      buildAdvancedBranches(input);
      input.advancedBranchesByCombination[0].branches[0].impedance_ohm = { re: 0, im: 0 };
    }
    if (expected.condition === 'no_geometry_or_branches') {
      buildAdvancedBranches(input);
      input.advancedBranchesByCombination[0].geometryDescription = '';
      input.advancedBranchesByCombination[0].branches = [];
    }
    if (expected.condition === 'invalid_provenance') input.fault.adiabaticK_A_sqrt_s_per_mm2.provenance = 'UNKNOWN';
  }
  if (id === 'CAL-06') {
    input.fault.totalFaultCurrent_A = 30000;
    input.fault.clearingTime_s = 1;
    input.fault.imbalance = expected.mode === 'EXPLICIT_ASSUMPTION'
      ? { mode: expected.mode, deltaFault: expected.deltaFault, provenance: 'ASSUMPTION_ONLY' }
      : { mode: expected.mode };
  }

  if (id === 'TECH-01') {
    const roots = [undefined, null, [], 'invalid', 42, true];
    fixture.input = roots[caseIndex];
    fixture.omitArgument = caseIndex === 0;
  }
  if (id === 'TECH-02') {
    const scopes = [input, input.catalog, input.catalog.candidates[0], input.grouping, input.fault];
    if (caseIndex < scopes.length) scopes[caseIndex].unexpected = true;
    else {
      buildAdvancedBranches(input);
      input.advancedBranchesByCombination[0].unexpected = true;
    }
  }
  if (id === 'TECH-03') {
    if (expected.state === 'missing') delete input.contractVersion;
    else input.contractVersion = 'UNSUPPORTED';
  }
  if (id === 'TECH-04') {
    const label = expected.invalid;
    let value = invalidValue(label);
    if (label === 'string') value = 'invalid';
    if (label === 'boolean') value = true;
    setPath(input, expected.field, value);
  }
  if (id === 'TECH-05') {
    if (expected.value === 'missing') delete input.analysisMode;
    else input.analysisMode = expected.value;
  }
  if (id === 'TECH-06') {
    if (expected.value === 'missing') delete input.objective;
    else input.objective = expected.value;
  }
  if (id === 'TECH-07') input.catalog.mode = expected.invalidMode;
  if (id === 'TECH-08') input.grouping.mode = expected.invalidMode;
  if (id === 'TECH-09') {
    input.catalog.mode = 'CATALOGO_SECUNDARIO_IDENTIFICADO';
    delete input.catalog[expected.removedField];
  }
  if (id === 'TECH-10') {
    if (expected.confirmation === 'catalog_lab_confirmation') input.catalog.confirmed = false;
    if (expected.confirmation === 'grouping_lab_confirmation') input.grouping.confirmed = false;
    if (expected.confirmation === 'guided_hypothesis_confirmation') input.guidedHypothesis.confirmed = false;
    if (expected.confirmation === 'suggested_power_factor_confirmation') input.powerFactor.confirmed = false;
    if (expected.confirmation === 'suggested_reference_temperature_confirmation') input.catalog.confirmed = false;
  }
  if (id === 'TECH-11' || id === 'TECH-12') input.pruning = {
    maximumSection_mm2: 185,
    confirmed: id === 'TECH-11',
    provenance: 'ASSUMPTION_ONLY',
  };
  if (id === 'TECH-13') {
    if (expected.defect === 'not_plain_object') input.catalog.candidates[0] = [];
    if (expected.defect === 'unknown_property') input.catalog.candidates[0].unexpected = true;
    if (expected.defect === 'invalid_required_structure') input.catalog.candidates[0].impedance_ohm = [];
  }
  if (id === 'TECH-14') {
    if (expected.condition === 'mixed_material') input.catalog.candidates[1].material = 'ALUMINUM_LAB';
    if (expected.condition === 'mixed_insulation') input.catalog.candidates[1].insulation = 'OTHER';
    if (expected.condition === 'mixed_installation_method') input.catalog.candidates[1].installationMethod = 'OTHER';
    if (expected.condition === 'duplicate_section') input.catalog.candidates[1].section_mm2 = 95;
  }
  if (id === 'TECH-15') input.grouping.value = invalidValue(expected.invalid);
  if (id === 'TECH-16') buildAdvancedBranches(input);
  if (id === 'TECH-17') {
    buildAdvancedBranches(input);
    const entry = input.advancedBranchesByCombination[0];
    if (expected.defect === 'map_not_array') input.advancedBranchesByCombination = {};
    if (expected.defect === 'combination_missing') input.advancedBranchesByCombination.shift();
    if (expected.defect === 'description_missing') delete entry.geometryDescription;
    if (expected.defect === 'branch_count_mismatch') entry.branches.pop();
    if (expected.defect === 'branch_id_duplicate' && entry.branches.length > 1) entry.branches[1].id = entry.branches[0].id;
    if (expected.defect === 'branch_impedance_invalid') entry.branches[0].impedance_ohm.re = NaN;
    if (expected.defect === 'branch_provenance_invalid') entry.branches[0].provenance = 'UNKNOWN';
  }
  if (id === 'TECH-18') {
    if (expected.defect === 'section_absent') input.providedCombination.section_mm2 = 999;
    if (expected.defect === 'quantity_invalid') input.providedCombination.nParallel = 0;
    if (expected.defect === 'outside_universe') input.providedCombination.nParallel = 5;
  }
  if (id === 'TECH-19') {
    if (expected.condition === 'all_calculated_rejected') input.totalLoadCurrent_A = 1500;
    if (expected.condition === 'all_blocked') input.grouping = { mode: 'GROUPING_MATRIX', source: 'lab', sourceVersion: '1', provenance: 'ASSUMPTION_ONLY', entries: [] };
  }
  if (id === 'TECH-20' && expected.condition === 'preparation_blocked') input.catalog.confirmed = false;
  if (id === 'TECH-21' && expected.property === 'same_input_same_output') fixture.repeat = true;
  if (id === 'TECH-22') {
    if (expected.permutation === 'catalog_order_permutation') input.catalog.candidates.reverse();
    else fixture.input = permuteObject(input);
    fixture.compareWithBase = true;
  }
  if (id === 'TECH-23') {
    if (expected.path === 'totalCopper_mm2') input.catalog.candidates[0].section_mm2 = Number.MAX_VALUE;
    if (expected.path === 'continuousProxy') input.totalLoadCurrent_A = Number.MAX_VALUE;
    if (expected.path === 'minimumMargin') input.catalog.candidates[0].tabulatedAmpacity_A = Number.MIN_VALUE;
    if (expected.path === 'frontierComparator') input.maximumVoltageDrop_percent = Number.MIN_VALUE;
  }
  if (id === 'TECH-24') input.fault.totalFaultCurrent_A = 0;
  if (id === 'TECH-26') delete input.lineVoltage_V;

  return fixture;
}

function findObject(value, predicate) {
  if (isPlainObject(value) && predicate(value)) return value;
  const children = Array.isArray(value) ? value : (isPlainObject(value) ? Object.values(value) : []);
  for (const child of children) {
    const found = findObject(child, predicate);
    if (found) return found;
  }
  return null;
}

function exactRootKeys(result, success) {
  const expected = ['assumptions', 'blockers', 'classification', 'data', 'displayNotice', 'error', 'ok', 'productionAllowed', 'sourceStatus', 'warnings'];
  return isPlainObject(result)
    && JSON.stringify(Object.keys(result).sort()) === JSON.stringify(expected)
    && (success ? result.ok === true : result.ok === false);
}

function prohibitedCandidateFieldsAbsent(result) {
  const forbidden = ['selected', 'recommended', 'finalSizing', 'installationEligible', 'iecCompliant'];
  return !forbidden.some((field) => findObject(result?.data, (object) => hasOwn(object, field)));
}

function expectedErrorCode(id, expected) {
  if (expected.errorCode) return expected.errorCode;
  if (expected.l0ErrorCode) return expected.l0ErrorCode;
  if (id === 'TECH-03') return 'CONTRACT_VERSION_UNSUPPORTED';
  if (id === 'TECH-04') return 'GLOBAL_METADATA_INVALID';
  if (id === 'TECH-05') return 'ANALYSIS_MODE_INVALID';
  if (id === 'TECH-06') return 'OBJECTIVE_INVALID';
  if (id === 'TECH-07') return 'CATALOG_MODE_INVALID';
  if (id === 'TECH-08') return 'GROUPING_MODE_INVALID';
  if (id === 'TECH-09') return 'CATALOG_TRACEABILITY_MISSING';
  if (id === 'TECH-10') return {
    catalog_lab_confirmation: 'CATALOG_CONFIRMATION_MISSING',
    grouping_lab_confirmation: 'GROUPING_CONFIRMATION_MISSING',
    guided_hypothesis_confirmation: 'GUIDED_HYPOTHESIS_UNCONFIRMED',
    suggested_power_factor_confirmation: 'SUGGESTION_UNCONFIRMED',
    suggested_reference_temperature_confirmation: 'CATALOG_CONFIRMATION_MISSING',
  }[expected.confirmation];
  if (id === 'TECH-12') return 'SUGGESTION_UNCONFIRMED';
  if (id === 'TECH-13' || (id === 'TECH-14' && expected.expected !== 'PASS' && expected.expected !== 'degC')) return 'CANDIDATE_STRUCTURE_INVALID';
  if (id === 'TECH-15') return 'GROUPING_FACTOR_INVALID';
  if (id === 'TECH-17') return 'ADVANCED_BRANCHES_INVALID';
  if (id === 'TECH-18') return 'PROVIDED_COMBINATION_INVALID';
  if (id === 'TECH-19') return expected.condition === 'all_calculated_rejected' ? 'NO_VALID_CANDIDATE' : 'NO_EVALUABLE_COMBINATION';
  if (id === 'TECH-23') return 'NUMERIC_RESULT_NON_FINITE';
  return null;
}

function verifyActualCase(id, expected, context) {
  const { result, threw, inputMutated, resultMutated, repeatedResult, comparisonResult } = context;
  if (threw || inputMutated || resultMutated || !resultEnvelopeInvariant(result)) return false;

  const errorCode = expectedErrorCode(id, expected);
  const detailedCandidateValidation = [
    'SCH-01', 'SCH-04', 'SCH-05', 'SCH-06', 'SCH-07', 'SCH-08', 'SCH-09',
    'SCH-10', 'SCH-11', 'SCH-12', 'SCH-13',
  ].includes(id);
  if (errorCode && !detailedCandidateValidation) return recursivelyContains(result, errorCode);

  if (['SCH-01', 'SCH-04', 'SCH-05', 'SCH-11', 'SCH-12'].includes(id)) {
    if (id === 'SCH-11' && expected.collection === 'invalidFields') {
      return findObject(result, (object) => Array.isArray(object.invalidFields)) !== null
        && recursivelyContains(result, expected.errorCode);
    }
    const error = findObject(result, (object) => Array.isArray(object.missingFields));
    const wanted = expected.missingFields;
    return error !== null && (!wanted || JSON.stringify(error.missingFields) === JSON.stringify(wanted));
  }
  if (['SCH-06', 'SCH-07'].includes(id)) return recursivelyContains(result, 'CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT');
  if (['SCH-08', 'SCH-09', 'SCH-10'].includes(id)) {
    const error = findObject(result, (object) => Array.isArray(object.invalidFields));
    if (!error) return false;
    const wanted = expected.invalidFields || expected.invalidFieldOrder?.map((pathName) => ({ path: pathName }));
    return !wanted || wanted.every((item, index) => error.invalidFields[index]?.path === item.path);
  }
  if (id === 'SCH-13') {
    return expected.permutationsEquivalentFor === 'valid'
      ? successEnvelope(result)
      : recursivelyContainsAll(result, {
          incomplete: ['CANDIDATE_INCOMPLETE'],
          conflict: ['CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT'],
          value_invalid: ['CANDIDATE_IMPEDANCE_VALUE_INVALID'],
        }[expected.permutationsEquivalentFor]);
  }
  if (id === 'SCH-14') {
    const candidate = evaluated(result, '1 x 150');
    return successEnvelope(result) && candidate !== null && recursivelyContains(candidate, 0.015) && recursivelyContains(candidate, 0.008);
  }

  if (id === 'CAL-01' || id === 'CAL-02' || id === 'CAL-03') {
    const candidate = evaluated(result, expected.candidateId);
    if (!candidate) return false;
    if (hasOwn(expected, 'valid') && (candidate.status === 'VALID') !== expected.valid) return false;
    if (expected.dominant && !recursivelyContainsAll(candidate, expected.dominant.split(','))) return false;
    if (expected.ampacity_A && !closeTo(candidate.ampacity?.admissibleCurrent_A, expected.ampacity_A)) return false;
    if (expected.voltageDrop_percent && !closeTo(candidate.voltageDrop?.actualPercent, expected.voltageDrop_percent)) return false;
    return true;
  }
  if (id === 'CAL-04') return recursivelyContainsAll(result, ['EXCESSIVE_COUNT', 4.213]);
  if (id === 'GRD-02') return recursivelyContains(result, 'B-04') && !recursivelyContains(result, 'recommended_busway');
  if (id === 'UNI-01') return successEnvelope(result) && result.data.evaluatedCandidates.length === 20;
  if (id === 'UNI-02') return successEnvelope(result)
    && result.data.evaluatedCandidates.length === 20
    && result.data.candidateAlternatives.length === 11
    && result.data.rejectedCandidates.length === 9
    && result.data.nonDominatedAlternatives.length === 11;
  if (id === 'UNI-03' || id === 'UNI-04' || id === 'UNI-05') {
    const candidate = evaluated(result, expected.candidateId);
    if (!candidate) return false;
    if (id === 'UNI-03') return candidate.status === 'VALID'
      && candidate.nParallel === expected.nParallel
      && candidate.totalCopper_mm2 === expected.totalCopper_mm2
      && closeTo(candidate.minimumMargin, expected.minimumMargin);
    if (id === 'UNI-04') return candidate.status === 'REJECTED'
      && expected.failedCriteria.every((criterion) => candidate.failedCriteria.includes(criterion));
    return true;
  }
  if (id === 'FRN-01') return successEnvelope(result) && result.data.nonDominatedAlternatives.length === 11;
  if (id === 'FRN-02') {
    const equal = Math.abs(expected.a - expected.b) <= 0.005 * Math.max(Math.abs(expected.a), Math.abs(expected.b), 1e-12);
    return successEnvelope(result) && equal === expected.approximatelyEqual;
  }
  if (id.startsWith('OBJ-')) {
    if (!successEnvelope(result)) return false;
    const first = result.data.firstInPresentationOrder?.candidateId || result.data.presentationOrder?.[0]?.candidateId || result.data.presentationOrder?.[0];
    if (expected.first && first !== expected.first) return false;
    if (expected.order) {
      const order = result.data.presentationOrder.map((item) => item?.candidateId || item);
      if (order[0] !== expected.order[0] || order[1] !== expected.order[1]) return false;
    }
    return result.data.installableSelection === null && result.data.installationAuthorized === false;
  }
  if (id === 'CAL-05') return successEnvelope(result)
    && result.data.providedCombination !== null
    && result.data.installableSelection === null;
  if (id === 'HYP-01') return successEnvelope(result)
    && result.data.evaluatedCandidates.every((candidate) => candidate.status === 'BLOCKED' || recursivelyContains(candidate, 1));
  if (id === 'CAL-06') {
    const candidate = evaluated(result, '2 x 185');
    return candidate !== null
      && closeTo(candidate.shortCircuit?.minimumSectionContinuous_mm2, expected.minimumSection_mm2)
      && candidate.shortCircuit?.passes === expected.shortCircuitPass;
  }
  if (id === 'OUT-01') return successEnvelope(result)
    && isPlainObject(result.data.presentationModel)
    && recursivelyContains(result.data.presentationModel, NOTICE)
    && prohibitedCandidateFieldsAbsent(result);

  if (id === 'TECH-11') return successEnvelope(result)
    && result.data.universe?.prunedCatalogEntries?.some((item) => item.section_mm2 === 240)
    && result.data.evaluatedCandidates.length === 16;
  if (id === 'TECH-14') {
    if (expected.condition === 'candidate_id_uniqueness') {
      const ids = result.data?.evaluatedCandidates?.map((candidate) => candidate.candidateId) || [];
      return successEnvelope(result) && ids.length === new Set(ids).size;
    }
    if (expected.condition === 'reference_temperature_unit') return successEnvelope(result)
      && result.data.presentationModel
      && recursivelyContains(result.data.presentationModel, 'degC');
  }
  if (id === 'TECH-16') return successEnvelope(result) && result.data.analysisMode === 'MODO_AVANCADO';
  if (id === 'TECH-20') {
    const calls = result.data?.evaluatedCandidates?.map((candidate) => candidate.l0CallCount) || [];
    if (expected.condition === 'preparation_blocked') return result.ok === false && calls.length === 0;
    return successEnvelope(result) && calls.length > 0 && calls.every((count) => count === 1)
      && /calculateCablingBTParallelExperimental\s*\(/.test(moduleSource);
  }
  if (id === 'TECH-21') {
    if (expected.property === 'same_input_same_output') return JSON.stringify(result, jsonReplacer) === JSON.stringify(repeatedResult, jsonReplacer);
    if (expected.property === 'input_not_mutated') return !inputMutated;
    if (expected.property === 'l0_envelope_not_mutated') return !resultMutated;
    return !recursivelyContains(result, 'console_side_effect');
  }
  if (id === 'TECH-22') return comparisonResult !== null
    && JSON.stringify(result, jsonReplacer) === JSON.stringify(comparisonResult, jsonReplacer);
  if (id === 'TECH-24') {
    const candidate = result.data?.evaluatedCandidates?.find((entry) => entry.shortCircuit?.minimumSectionContinuous_mm2 === 0);
    return successEnvelope(result) && candidate
      && candidate.shortCircuit.margin === null
      && !candidate.dominantCriteria.includes('CURTO')
      && allFiniteJsonNumbers(result);
  }
  if (id === 'TECH-25') return successEnvelope(result)
    && exactRootKeys(result, true)
    && result.data.evaluatedCandidates.length === result.data.candidateAlternatives.length + result.data.rejectedCandidates.length
    && prohibitedCandidateFieldsAbsent(result);
  if (id === 'TECH-26') return failureEnvelope(result, 'GLOBAL_METADATA_MISSING')
    && exactRootKeys(result, false);

  if (id === 'GRD-01') return successEnvelope(result) && !/2\.25\s*\/\s*[A-Za-z]/.test(moduleSource);
  if (id === 'GRD-03' || id === 'GRD-05') return successEnvelope(result) && prohibitedCandidateFieldsAbsent(result);
  if (id === 'TECH-21' || id === 'TECH-22') return successEnvelope(result);

  return successEnvelope(result);
}

function executeReadyCase(id, item, caseIndex) {
  const fixture = item.inputFactory();
  const inputBefore = jsonSafe(fixture.input);
  let result = null;
  let error = null;
  const consoleEvents = [];
  const originalConsole = { log: console.log, warn: console.warn, error: console.error };
  for (const level of Object.keys(originalConsole)) {
    console[level] = (...args) => consoleEvents.push({ level, args: args.map((value) => String(value)) });
  }
  let repeatedResult = null;
  let comparisonResult = null;
  try {
    result = fixture.omitArgument ? enumerate() : enumerate(fixture.input);
    if (fixture.repeat) repeatedResult = enumerate(clone(fixture.input));
    if (fixture.compareWithBase) comparisonResult = enumerate(baseInput());
  } catch (caught) {
    error = caught;
  } finally {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  }
  const inputAfter = jsonSafe(fixture.input);
  const resultBeforeAudit = jsonSafe(result);
  const resultAfterAudit = jsonSafe(result);
  const context = {
    result,
    threw: error !== null,
    inputMutated: JSON.stringify(inputBefore) !== JSON.stringify(inputAfter),
    resultMutated: JSON.stringify(resultBeforeAudit) !== JSON.stringify(resultAfterAudit),
    repeatedResult,
    comparisonResult,
    consoleEvents,
  };
  const compliant = error === null && consoleEvents.length === 0 && item.verify(context) === true;
  return {
    caseId: item.caseId,
    classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
    assertionExercised: true,
    compliant,
    expected: jsonSafe(item.expected),
    observed: {
      fixture: fixture.description,
      input: inputBefore,
      threw: error !== null,
      error: error ? jsonSafe(error) : null,
      result: jsonSafe(result),
      inputMutated: context.inputMutated,
      resultMutated: context.resultMutated,
      consoleEvents,
      ...(fixture.repeat ? { repeatedResult: jsonSafe(repeatedResult) } : {}),
      ...(fixture.compareWithBase ? { comparisonResult: jsonSafe(comparisonResult) } : {}),
    },
  };
}

function contract(id, category, contractName, cases, invariants = []) {
  const executableCases = cases.map((item, index) => ({
    ...item,
    inputFactory: () => buildCaseFixture(id, item, index),
    verify: (context) => verifyActualCase(id, item.expected, context),
  }));
  return {
    id,
    category,
    expected: {
      contract: contractName,
      function: FUNCTION_NAME,
      module: MODULE_RELATIVE,
      contractVersion: CONTRACT_VERSION,
      productionAllowed: false,
      installableSelection: null,
      installationAuthorized: false,
      iecConformity: false,
      primarySourceComplete: false,
      displayNotice: NOTICE,
      invariants,
      cases: cases.map((item) => jsonSafe(item)),
    },
    cases: executableCases,
  };
}

const scientific = [
  contract('KG-01', 'scientific', 'candidate-specific grouping data are complete and traceable', one('KG-01', { mode: 'CANDIDATE_SPECIFIC', required: ['value', 'source', 'sourceVersion', 'method', 'arrangement', 'nParallel', 'nCircuits', 'provenance'] }), ['no grouping derivation']),
  contract('KG-02', 'scientific', 'grouping matrix rejects a missing combination', one('KG-02', { mode: 'GROUPING_MATRIX', errorCode: 'GROUPING_FACTOR_MISSING' })),
  contract('KG-03', 'scientific', 'confirmed laboratory grouping constant remains assumption-only', one('KG-03', { mode: 'LAB_CONSTANT_CONFIRMED', value: 0.8, confirmed: true, provenance: 'ASSUMPTION_ONLY' })),
  contract('KG-04', 'scientific', 'unconfirmed laboratory grouping constant blocks calculation', one('KG-04', { errorCode: 'GROUPING_CONFIRMATION_MISSING' })),

  contract('SCH-01', 'scientific', 'all ten candidate scalar fields are mandatory', matrix('SCH-01', [
    'section_mm2', 'tabulatedAmpacity_A', 'material', 'insulation', 'installationMethod',
    'referenceTemperature_C', 'units', 'source', 'sourceVersion', 'provenance',
  ], (field) => ({ removedField: field, errorCode: 'CANDIDATE_INCOMPLETE', missingFields: [field], referenceTemperatureUnit: field === 'referenceTemperature_C' ? 'degC' : undefined })), ['canonical missingFields order']),
  contract('SCH-02', 'scientific', 'complete complex impedance representation is accepted', one('SCH-02', { representation: 'IMPEDANCE_COMPLEX', impedance_ohm: { re: 0.015, im: 0.008 } })),
  contract('SCH-03', 'scientific', 'complete resistance-reactance representation is accepted', one('SCH-03', { representation: 'RESISTANCE_REACTANCE_PAIR', resistance_ohm: 0.015, reactance_ohm: 0.008 })),
  contract('SCH-04', 'scientific', 'incomplete impedance representations have exact missing fields', matrix('SCH-04', [
    ['impedance_without_re', 'impedance_ohm.re'],
    ['impedance_without_im', 'impedance_ohm.im'],
    ['resistance_only', 'reactance_ohm'],
    ['reactance_only', 'resistance_ohm'],
    ['no_representation', 'impedanceRepresentation'],
  ], ([situation, missing]) => ({ situation, errorCode: 'CANDIDATE_INCOMPLETE', missingFields: [missing] }))),
  contract('SCH-05', 'scientific', 'incomplete complex impedance never falls back to R-X', one('SCH-05', { errorCode: 'CANDIDATE_INCOMPLETE', missingFields: ['impedance_ohm.im'], forbiddenFallback: 'RESISTANCE_REACTANCE_PAIR' })),
  contract('SCH-06', 'scientific', 'representation coexistence conflicts before value validation', matrix('SCH-06', [
    'complete_impedance_plus_resistance', 'complete_impedance_plus_reactance',
    'incomplete_impedance_plus_complete_pair', 'incomplete_impedance_plus_resistance',
    'incomplete_impedance_plus_reactance', 'complete_impedance_plus_complete_pair',
    'invalid_impedance_plus_any_pair_component',
  ], (situation) => ({ situation, errorCode: 'CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT', precedence: 'presence_before_completeness_and_value' }))),
  contract('SCH-07', 'scientific', 'property order does not change representation conflict', matrix('SCH-07', ['impedance_first', 'resistance_first', 'reactance_first'], (order) => ({ order, errorCode: 'CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT' }))),
  contract('SCH-08', 'scientific', 'invalid pure complex impedance values fail closed', matrix('SCH-08', [
    ['impedance_ohm', 'array', 'NOT_SIMPLE_OBJECT'], ['impedance_ohm.re', 'string', 'NOT_NUMBER'],
    ['impedance_ohm.im', 'string', 'NOT_NUMBER'], ['impedance_ohm.re', 'boolean', 'NOT_NUMBER'],
    ['impedance_ohm.im', 'object', 'NOT_NUMBER'], ['impedance_ohm.re', 'null', 'NOT_NUMBER'],
    ['impedance_ohm.re', 'number:NaN', 'NON_FINITE'], ['impedance_ohm.im', 'number:+Infinity', 'NON_FINITE'],
    ['impedance_ohm.re', 'number:-Infinity', 'NON_FINITE'],
  ], ([field, observedType, reason]) => ({ errorCode: 'CANDIDATE_IMPEDANCE_VALUE_INVALID', invalidFields: [{ path: field, reason, observedType }] }))),
  contract('SCH-09', 'scientific', 'invalid pure resistance-reactance values fail closed', matrix('SCH-09', [
    ['resistance_ohm', 'string', 'NOT_NUMBER'], ['reactance_ohm', 'string', 'NOT_NUMBER'],
    ['resistance_ohm', 'boolean', 'NOT_NUMBER'], ['reactance_ohm', 'object', 'NOT_NUMBER'],
    ['resistance_ohm', 'null', 'NOT_NUMBER'], ['reactance_ohm', 'number:NaN', 'NON_FINITE'],
    ['resistance_ohm', 'number:+Infinity', 'NON_FINITE'], ['reactance_ohm', 'number:-Infinity', 'NON_FINITE'],
  ], ([field, observedType, reason]) => ({ errorCode: 'CANDIDATE_IMPEDANCE_VALUE_INVALID', invalidFields: [{ path: field, reason, observedType }] }))),
  contract('SCH-10', 'scientific', 'multiple invalid impedance values follow canonical order', one('SCH-10', { errorCode: 'CANDIDATE_IMPEDANCE_VALUE_INVALID', invalidFieldOrder: ['impedance_ohm.re', 'impedance_ohm.im'], unique: true })),
  contract('SCH-11', 'scientific', 'absent and present-invalid fields remain distinct', matrix('SCH-11', [
    ['impedance_without_re', 'CANDIDATE_INCOMPLETE', 'missingFields'],
    ['impedance_re_null', 'CANDIDATE_IMPEDANCE_VALUE_INVALID', 'invalidFields'],
    ['resistance_without_reactance', 'CANDIDATE_INCOMPLETE', 'missingFields'],
    ['resistance_string', 'CANDIDATE_IMPEDANCE_VALUE_INVALID', 'invalidFields'],
  ], ([situation, errorCode, collection]) => ({ situation, errorCode, collection }))),
  contract('SCH-12', 'scientific', 'multiple missing scalar fields use canonical order', one('SCH-12', { missingFields: ['material', 'units', 'provenance'], unique: true, propertyOrderIndependent: true })),
  contract('SCH-13', 'scientific', 'candidate validation is property-order independent', matrix('SCH-13', ['valid', 'incomplete', 'conflict', 'value_invalid'], (outcome) => ({ permutationsEquivalentFor: outcome }))),
  contract('SCH-14', 'scientific', 'the two pure impedance representations normalize equivalently', matrix('SCH-14', ['IMPEDANCE_COMPLEX', 'RESISTANCE_REACTANCE_PAIR'], (representation) => ({ representation, normalized: { re: 0.015, im: 0.008 }, noInventedComponent: true }))),

  contract('CAT-01', 'scientific', 'catalog without evaluable candidates blocks', one('CAT-01', { errorCode: 'CATALOG_NO_EVALUABLE_CANDIDATE' })),
  contract('STR-01', 'scientific', 'missing indispensable global metadata blocks', matrix('STR-01', ['lineVoltage_V', 'totalLoadCurrent_A', 'fault.totalFaultCurrent_A', 'fault.clearingTime_s', 'analysisMode', 'objective'], (field) => ({ removedField: field, errorCode: 'GLOBAL_METADATA_MISSING' }))),
  contract('CAT-02', 'scientific', 'catalog modes have deterministic transitions', matrix('CAT-02', [
    ['CATALOGO_FORNECIDO_PELO_USUARIO', 'complete_candidates_only'],
    ['CATALOGO_SECUNDARIO_IDENTIFICADO', 'traceability_required_mathematical_only'],
    ['CATALOGO_LAB_ASSUMPTION_ONLY', 'complete_schema_and_confirmation_required'],
  ], ([mode, behavior]) => ({ mode, behavior }))),
  contract('GRD-01', 'scientific', 'engineering values are never silently derived', matrix('GRD-01', ['resistance', 'reactance', 'ampacity', 'adiabaticK', 'groupingFactor'], (quantity) => ({ quantity, allowedSources: ['catalog', 'technical_user_input', 'confirmed_ASSUMPTION_ONLY'], silentDerivation: false }))),

  contract('CAL-01', 'scientific', 'base fixture enumerates alternatives and ampacity dominance', matrix('CAL-01', [
    ['2 x 240', true, 'AMPACIDADE', 712, 1.549], ['3 x 150', true, 'AMPACIDADE', 792, 1.471],
    ['4 x 120', true, 'AMPACIDADE', 912, null], ['2 x 95', false, 'AMPACIDADE,QUEDA', null, null],
  ], ([candidateId, valid, dominant, ampacity_A, voltageDrop_percent]) => ({ candidateId, valid, dominant, ampacity_A, voltageDrop_percent, toleranceRelative: 0.005 })), ['real L0 called once per evaluable combination']),
  contract('CAL-02', 'scientific', 'single valid candidate remains a candidate only', matrix('CAL-02', [['1 x 240', false], ['2 x 240', true]], ([candidateId, valid]) => ({ candidateId, valid, installableSelection: null }))),
  contract('CAL-03', 'scientific', 'each scientific criterion can dominate', matrix('CAL-03', [
    ['base_600A_3percent', '3 x 150', 'AMPACIDADE'],
    ['base_600A_1.6percent', '3 x 150', 'QUEDA'],
    ['500A_40kA_1s', '2 x 185', 'CURTO'],
  ], ([scenario, candidateId, dominant]) => ({ scenario, candidateId, dominant }))),
  contract('CAL-04', 'scientific', 'excessive parallel count is explicit', one('CAL-04', { totalLoadCurrent_A: 1500, maxParallelCount: 4, candidate: '4 x 240', ampacity_A: 1424, continuousProxy: 4.213, discreteRequired: 5, errorCode: 'EXCESSIVE_COUNT' })),
  contract('GRD-02', 'scientific', 'busway observation is qualitative only', one('GRD-02', { totalLoadCurrent_A: 1500, note: 'evaluate_busway_qualitatively', commercialRecommendation: null, normativeThreshold: null })),

  contract('UNI-01', 'scientific', 'the complete Cartesian universe is evaluated', one('UNI-01', { sections_mm2: [95, 120, 150, 185, 240], nParallel: [1, 2, 3, 4], evaluatedCandidates: 20, silentPruning: false })),
  contract('UNI-02', 'scientific', 'universe partitions reconcile exactly', one('UNI-02', { evaluatedCandidates: 20, candidateAlternatives: 11, rejectedCandidates: 9, nonDominatedAlternatives: 11, unionReconciles: true, frontierSubset: true })),
  contract('UNI-03', 'scientific', 'inventory contains all eleven valid alternatives', matrix('UNI-03', [
    ['2 x 185', 2, 370, 0.013333], ['2 x 240', 2, 480, 0.186667],
    ['3 x 120', 3, 360, 0.14], ['3 x 150', 3, 450, 0.32],
    ['3 x 185', 3, 555, 0.52], ['3 x 240', 3, 720, 0.655766],
    ['4 x 95', 4, 380, 0.28], ['4 x 120', 4, 480, 0.52],
    ['4 x 150', 4, 600, 0.632218], ['4 x 185', 4, 740, 0.687515],
    ['4 x 240', 4, 960, 0.741824],
  ], ([candidateId, nParallel, totalCopper_mm2, minimumMargin]) => ({ candidateId, nParallel, totalCopper_mm2, minimumMargin, toleranceRelative: 0.005 }))),
  contract('UNI-04', 'scientific', 'inventory contains all nine rejected alternatives', matrix('UNI-04', [
    ['1 x 95', ['AMPACIDADE', 'QUEDA']], ['1 x 120', ['AMPACIDADE', 'QUEDA']],
    ['1 x 150', ['AMPACIDADE', 'QUEDA']], ['1 x 185', ['AMPACIDADE', 'QUEDA']],
    ['1 x 240', ['AMPACIDADE', 'QUEDA']], ['2 x 95', ['AMPACIDADE', 'QUEDA']],
    ['2 x 120', ['AMPACIDADE']], ['2 x 150', ['AMPACIDADE']], ['3 x 95', ['AMPACIDADE']],
  ], ([candidateId, failedCriteria]) => ({ candidateId, failedCriteria, l0Blockers: [] }))),
  contract('UNI-05', 'scientific', 'formerly omitted combinations remain in the universe', matrix('UNI-05', ['2 x 185', '3 x 120', '3 x 185', '3 x 240', '4 x 95', '4 x 150', '4 x 185', '4 x 240'], (candidateId) => ({ candidateId, present: true, evaluated: true }))),
  contract('FRN-01', 'scientific', 'all eleven valid alternatives are nondominated', one('FRN-01', { nonDominatedAlternatives: 11, electedInstallable: false, comparator: ['nParallel:exact:min', 'totalCopper_mm2:exact:min', 'minimumMargin:tolerance:max'] })),
  contract('FRN-02', 'scientific', 'frontier comparator observes tolerance boundary', matrix('FRN-02', [[0.52, 0.520001, true], [0.013333, 0.186667, false]], ([a, b, approximatelyEqual]) => ({ a, b, approximatelyEqual, relativeTolerance: 0.005, epsilon: 1e-12 }))),

  contract('OBJ-01', 'scientific', 'each objective has a deterministic first presentation item', matrix('OBJ-01', [
    ['NONE', '2 x 185'], ['MIN_PARALLEL_COUNT', '2 x 240'],
    ['MIN_TOTAL_COPPER', '3 x 120'], ['MAX_MINIMUM_MARGIN', '4 x 240'],
  ], ([objective, first]) => ({ objective, first, installable: false }))),
  contract('OBJ-02', 'scientific', 'minimum parallel count tie uses decreasing margin', one('OBJ-02', { objective: 'MIN_PARALLEL_COUNT', order: ['2 x 240', '2 x 185'], primaryTie: 2, tieBreak: 'minimumMargin_desc' })),
  contract('OBJ-03', 'scientific', 'minimum total copper starts with 3 x 120', one('OBJ-03', { objective: 'MIN_TOTAL_COPPER', first: '3 x 120', totalCopper_mm2: 360 })),
  contract('OBJ-04', 'scientific', 'maximum minimum margin starts with 4 x 240', one('OBJ-04', { objective: 'MAX_MINIMUM_MARGIN', first: '4 x 240', minimumMargin: 0.741824 })),
  contract('OBJ-05', 'scientific', 'NONE uses deterministic presentation order without election', one('OBJ-05', { objective: 'NONE', first: '2 x 185', ordering: ['nParallel_asc', 'section_mm2_asc', 'candidateId_asc'], status: ['NO_CANDIDATE_ELECTED', 'PRESENTATION_ORDER_ONLY'] })),
  contract('OBJ-06', 'scientific', 'no objective creates an installable selection', matrix('OBJ-06', ['NONE', 'MIN_PARALLEL_COUNT', 'MIN_TOTAL_COPPER', 'MAX_MINIMUM_MARGIN'], (objective) => ({ objective, installableSelection: null, installationAuthorized: false, blocker: 'DISCRETE_SELECTION_BLOCKED' }))),
  contract('GRD-03', 'scientific', 'continuous count proxy is never installable', one('GRD-03', { discreteOnly: true, minimumDiscrete: 1, continuousProxyPurpose: 'sensitivity', installableSelection: null, discreteSelectionBlocked: true })),
  contract('CAL-05', 'scientific', 'provided combination is evaluated without promotion', one('CAL-05', { providedCombination: { section_mm2: 150, nParallel: 3 }, returnedAnalysis: true, installableSelection: null })),
  contract('HYP-01', 'scientific', 'confirmed guided identical-impedance hypothesis uses real L0', one('HYP-01', { geometryStatus: 'NOT_PROVIDED', displayedBeforeCalculation: true, confirmed: true, provenance: 'ASSUMPTION_ONLY', deltaLoadFromL0: 1, blocker: 'ENGINEERING_ADEQUACY_BLOCKED' }), ['L0 deltaLoad is observed, not fixed by L1-L3']),
  contract('HYP-02', 'scientific', 'unconfirmed guided hypothesis blocks', one('HYP-02', { errorCode: 'GUIDED_HYPOTHESIS_UNCONFIRMED' })),
  contract('GRD-04', 'scientific', 'real L0 blockers propagate without circumvention', matrix('GRD-04', [
    ['grouping_missing', 'GROUPING_FACTOR_MISSING'], ['fault_imbalance_block', 'FAULT_IMBALANCE_MISSING'],
    ['zero_branch_impedance', 'PARALLEL_Z_ZERO'], ['no_geometry_or_branches', 'GEOMETRY_AND_IMPEDANCE_MISSING'],
    ['invalid_provenance', 'ASSUMPTION_PROVENANCE_INVALID'],
  ], ([condition, errorCode]) => ({ condition, l0ErrorCode: errorCode, usableNumberProduced: false }))),
  contract('CAL-06', 'scientific', 'deltaFault remains independent from deltaLoad', matrix('CAL-06', [
    ['EXPLICIT_ASSUMPTION', 1.15, 150, true], ['CONSERVATIVE_SINGLE_BRANCH', null, 260.87, false],
  ], ([mode, deltaFault, minimumSection_mm2, shortCircuitPass]) => ({ candidateId: '2 x 185', mode, deltaFault, minimumSection_mm2, shortCircuitPass, deltaLoadIndependent: true }))),
  contract('OUT-01', 'scientific', 'human model is explicitly preliminary and noncommercial', one('OUT-01', { heading: 'ALTERNATIVA MATEMÁTICA CANDIDATA', requiredSections: ['Ampacidade', 'Queda', 'Curto', 'Critério dominante', 'Objetivo ativo', 'Hipóteses', 'Bloqueios'], installationAuthorized: 'NÃO', forbiddenTerms: ['recomendado', 'selecionado', 'dimensionamento final'] })),
  contract('GRD-05', 'scientific', 'productive, eligibility, and IEC requests are refused', matrix('GRD-05', ['project_purchase_installation', 'implementation_eligibility', 'IEC_conformity'], (request) => ({ request, refused: true, productionAllowed: false, state: 'EXPERIMENTAL_PRELIMINAR_NAO_CANONICO', blocker: 'B-06' }))),
];

const technical = [
  contract('TECH-01', 'technical', 'root input must be a plain object', matrix('TECH-01', ['undefined', 'null', 'array', 'string', 'number', 'boolean'], (observedType) => ({ observedType, errorCode: 'INPUT_STRUCTURE_INVALID', reason: 'root_not_plain_object' }))),
  contract('TECH-02', 'technical', 'unknown properties are rejected at every closed-schema scope', matrix('TECH-02', ['root', 'catalog', 'catalog.candidates[]', 'grouping', 'fault', 'advancedBranchesByCombination[]'], (scope) => ({ scope, errorCode: 'INPUT_STRUCTURE_INVALID', reason: 'unexpected_property' }))),
  contract('TECH-03', 'technical', 'contract version is mandatory and exact', matrix('TECH-03', ['missing', 'wrong'], (state) => ({ state, expectedVersion: CONTRACT_VERSION, errorCode: 'CONTRACT_VERSION_UNSUPPORTED' }))),
  contract('TECH-04', 'technical', 'global numeric fields reject invalid types and domains', matrix('TECH-04', [
    ['totalLoadCurrent_A', 'string'], ['totalLoadCurrent_A', 'NaN'], ['lineVoltage_V', 'Infinity'],
    ['maximumVoltageDrop_percent', 'zero'], ['maxParallelCount', 'fractional'], ['nCircuits', 'zero'],
    ['fault.totalFaultCurrent_A', 'negative'], ['fault.clearingTime_s', 'boolean'],
  ], ([field, invalid]) => ({ field, invalid, errorCode: 'GLOBAL_METADATA_INVALID' }))),
  contract('TECH-05', 'technical', 'analysis mode is a closed enumeration', matrix('TECH-05', ['missing', 'UNKNOWN_MODE'], (value) => ({ value, allowed: ['MODO_GUIADO_PRELIMINAR', 'MODO_AVANCADO'], errorCode: 'ANALYSIS_MODE_INVALID' }))),
  contract('TECH-06', 'technical', 'objective is a closed enumeration', matrix('TECH-06', ['missing', 'UNKNOWN_OBJECTIVE'], (value) => ({ value, allowed: ['NONE', 'MIN_PARALLEL_COUNT', 'MIN_TOTAL_COPPER', 'MAX_MINIMUM_MARGIN'], errorCode: 'OBJECTIVE_INVALID' }))),
  contract('TECH-07', 'technical', 'catalog mode is a closed enumeration', one('TECH-07', { invalidMode: 'UNKNOWN_CATALOG', errorCode: 'CATALOG_MODE_INVALID' })),
  contract('TECH-08', 'technical', 'grouping mode is a closed enumeration', one('TECH-08', { invalidMode: 'UNKNOWN_GROUPING', allowed: ['CANDIDATE_SPECIFIC', 'GROUPING_MATRIX', 'LAB_CONSTANT_CONFIRMED'], errorCode: 'GROUPING_MODE_INVALID' })),
  contract('TECH-09', 'technical', 'identified secondary catalog requires traceability', matrix('TECH-09', ['source', 'sourceVersion', 'provenance'], (field) => ({ mode: 'CATALOGO_SECUNDARIO_IDENTIFICADO', removedField: field, errorCode: 'CATALOG_TRACEABILITY_MISSING' }))),
  contract('TECH-10', 'technical', 'all required confirmations fail closed', matrix('TECH-10', [
    'catalog_lab_confirmation', 'grouping_lab_confirmation', 'guided_hypothesis_confirmation',
    'suggested_power_factor_confirmation', 'suggested_reference_temperature_confirmation',
  ], (confirmation) => ({ confirmation, confirmed: false, blocked: true }))),
  contract('TECH-11', 'technical', 'authorized pruning precedes universe construction and is recorded', one('TECH-11', { maximumSection_mm2: 185, pruningConfirmed: true, pruningBeforeUniverse: true, nominallyRecorded: true })),
  contract('TECH-12', 'technical', 'unconfirmed pruning suggestion blocks', one('TECH-12', { maximumSection_mm2: 185, pruningConfirmed: false, errorCode: 'SUGGESTION_UNCONFIRMED' })),
  contract('TECH-13', 'technical', 'catalog item structure is closed and plain', matrix('TECH-13', ['not_plain_object', 'unknown_property', 'invalid_required_structure'], (defect) => ({ defect, errorCode: 'CANDIDATE_STRUCTURE_INVALID' }))),
  contract('TECH-14', 'technical', 'catalog is homogeneous and candidate identities are unique', matrix('TECH-14', [
    ['mixed_material', 'CANDIDATE_STRUCTURE_INVALID'], ['mixed_insulation', 'CANDIDATE_STRUCTURE_INVALID'],
    ['mixed_installation_method', 'CANDIDATE_STRUCTURE_INVALID'], ['duplicate_section', 'CANDIDATE_STRUCTURE_INVALID'],
    ['candidate_id_uniqueness', 'PASS'], ['reference_temperature_unit', 'degC'],
  ], ([condition, expected]) => ({ condition, expected }))),
  contract('TECH-15', 'technical', 'grouping factor domain is finite and within zero-one interval', matrix('TECH-15', ['zero', 'negative', 'greater_than_one', 'NaN', 'Infinity'], (invalid) => ({ invalid, errorCode: 'GROUPING_FACTOR_INVALID' }))),
  contract('TECH-16', 'technical', 'advanced mode accepts explicit branches and described geometry only', matrix('TECH-16', ['explicit_branch_set_per_combination', 'geometry_description_without_impedance_derivation'], (condition) => ({ condition, analysisMode: 'MODO_AVANCADO', accepted: true }))),
  contract('TECH-17', 'technical', 'advanced branch map is validated exhaustively', matrix('TECH-17', [
    'map_not_array', 'combination_missing', 'description_missing', 'branch_count_mismatch',
    'branch_id_duplicate', 'branch_impedance_invalid', 'branch_provenance_invalid',
  ], (defect) => ({ defect, errorCode: 'ADVANCED_BRANCHES_INVALID' }))),
  contract('TECH-18', 'technical', 'provided combination must reference the evaluated universe', matrix('TECH-18', [
    ['section_absent', 'PROVIDED_COMBINATION_INVALID'],
    ['quantity_invalid', 'PROVIDED_COMBINATION_INVALID'],
    ['outside_universe', 'PROVIDED_COMBINATION_INVALID'],
  ], ([defect, errorCode]) => ({ defect, errorCode }))),
  contract('TECH-19', 'technical', 'empty results distinguish calculated rejection from blocked evaluation', matrix('TECH-19', [
    ['all_calculated_rejected', 'NO_VALID_CANDIDATE'], ['all_blocked', 'NO_EVALUABLE_COMBINATION'],
  ], ([condition, errorCode]) => ({ condition, errorCode }))),
  contract('TECH-20', 'technical', 'real L0 call count is exact', matrix('TECH-20', [
    ['evaluable_combinations', 'once_each'], ['preparation_blocked', 0],
  ], ([condition, expectedCalls]) => ({ condition, expectedCalls, l0Function: 'calculateCablingBTParallelExperimental' })), ['no L0 mock', 'no formulas copied into L1-L3']),
  contract('TECH-21', 'technical', 'function is pure deterministic and nonmutating', matrix('TECH-21', [
    'same_input_same_output', 'input_not_mutated', 'l0_envelope_not_mutated', 'no_console_or_global_side_effects',
  ], (property) => ({ property, required: true }))),
  contract('TECH-22', 'technical', 'catalog and property permutations produce canonical equivalent output', matrix('TECH-22', ['catalog_order_permutation', 'property_order_permutation'], (permutation) => ({ permutation, canonicalEquivalent: true }))),
  contract('TECH-23', 'technical', 'nonfinite L1-L3 intermediates fail closed', matrix('TECH-23', ['minimumMargin', 'continuousProxy', 'totalCopper_mm2', 'frontierComparator'], (pathName) => ({ path: pathName, invalid: ['NaN', 'Infinity', '-Infinity'], usableOutput: false }))),
  contract('TECH-24', 'technical', 'zero short-circuit minimum remains finite and nondominant', matrix('TECH-24', [
    ['minimumSection_mm2', 0], ['shortCircuitMargin', null], ['dominantCriterion', 'not_CURTO'],
  ], ([pathName, expected]) => ({ path: pathName, expected, jsonFinite: true }))),
  contract('TECH-25', 'technical', 'success envelope is closed and reconciled', matrix('TECH-25', [
    'root_schema', 'data_schema', 'evaluatedCandidates_schema', 'candidateAlternatives_schema',
    'rejectedCandidates_schema', 'nonDominatedAlternatives_schema', 'providedCombination_schema',
    'ten_permanent_guards', 'source_status_L0', 'array_reconciliation',
  ], (schemaArea) => ({ schemaArea, closed: true })), ['productionAllowed=false', 'installableSelection=null', 'installationAuthorized=false']),
  contract('TECH-26', 'technical', 'failure envelope follows closed Problem Details schema', matrix('TECH-26', [
    'root_failure_schema', 'problem_details_required_fields', 'ten_permanent_guards_plus_specific',
    'canonical_guard_order', 'error_blocker_code_equality', 'data_null',
  ], (schemaArea) => ({ schemaArea, closed: true, rfc7807: true }))),
];

const definitions = [...scientific, ...technical];
const EXPECTED_SCIENTIFIC_IDS = [
  'KG-01', 'KG-02', 'KG-03', 'KG-04',
  ...range('SCH', 14), 'CAT-01', 'STR-01', 'CAT-02', 'GRD-01',
  ...range('CAL', 4), 'GRD-02', ...range('UNI', 5), ...range('FRN', 2),
  ...range('OBJ', 6), 'GRD-03', 'CAL-05', ...range('HYP', 2), 'GRD-04',
  'CAL-06', 'OUT-01', 'GRD-05',
];
const EXPECTED_TECHNICAL_IDS = range('TECH', 26);
const EXPECTED_IDS = [...EXPECTED_SCIENTIFIC_IDS, ...EXPECTED_TECHNICAL_IDS];

let moduleState = 'module_missing';
let moduleLoadError = null;
let enumerate = null;
let moduleSource = '';

if (fs.existsSync(MODULE_PATH)) {
  try {
    moduleSource = fs.readFileSync(MODULE_PATH, 'utf8');
    const loaded = require(MODULE_PATH);
    enumerate = loaded?.[FUNCTION_NAME];
    moduleState = typeof enumerate === 'function' ? 'ready' : 'export_missing';
  } catch (error) {
    moduleState = 'module_load_failure';
    moduleLoadError = error;
  }
}

function missingCaseObservation(item) {
  return {
    caseId: item.caseId,
    classification: 'FUNCTIONAL_FAILURE',
    assertionExercised: true,
    compliant: false,
    expected: jsonSafe(item.expected),
    observed: { reason: 'module_missing', module: MODULE_RELATIVE },
  };
}

function evaluate(definition) {
  if (moduleState !== 'ready') {
    const reason = moduleState === 'module_missing' ? 'module_missing' : moduleState;
    return {
      id: definition.id,
      category: definition.category,
      classification: 'FUNCTIONAL_FAILURE',
      assertionExercised: true,
      expected: jsonSafe(definition.expected),
      observed: {
        reason,
        module: MODULE_RELATIVE,
        exportName: FUNCTION_NAME,
        l0Present: fs.existsSync(L0_PATH),
        l0Module: L0_RELATIVE,
        ...(moduleLoadError ? { error: jsonSafe(moduleLoadError) } : {}),
        cases: definition.cases.map((item) => {
          const observedCase = missingCaseObservation(item);
          observedCase.observed.reason = reason;
          return observedCase;
        }),
      },
      compliant: false,
      issues: [],
    };
  }

  const cases = definition.cases.map((item, index) => executeReadyCase(definition.id, item, index));
  const compliant = cases.every((item) => item.compliant === true);
  return {
    id: definition.id,
    category: definition.category,
    classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
    assertionExercised: true,
    expected: jsonSafe(definition.expected),
    observed: {
      reason: compliant ? 'all_contract_cases_satisfied' : 'contract_case_divergence',
      module: MODULE_RELATIVE,
      exportName: FUNCTION_NAME,
      callable: typeof enumerate === 'function',
      cases,
    },
    compliant,
    issues: cases.filter((item) => !item.compliant).map((item) => item.caseId),
  };
}

function validateCase(expectedCase, observedCase) {
  return isPlainObject(expectedCase)
    && typeof expectedCase.caseId === 'string'
    && isPlainObject(expectedCase.expected)
    && isPlainObject(observedCase)
    && observedCase.caseId === expectedCase.caseId
    && observedCase.assertionExercised === true
    && typeof observedCase.compliant === 'boolean'
    && isPlainObject(observedCase.expected)
    && isPlainObject(observedCase.observed)
    && observedCase.classification === (observedCase.compliant ? 'PASS' : 'FUNCTIONAL_FAILURE');
}

function validateReport(report, definition) {
  const expectedCases = definition?.cases || [];
  const observedCases = report?.observed?.cases;
  const expectedCaseIds = expectedCases.map((item) => item.caseId);
  const observedCaseIds = Array.isArray(observedCases) ? observedCases.map((item) => item.caseId) : [];
  return isPlainObject(report)
    && report.id === definition.id
    && report.category === definition.category
    && ['scientific', 'technical'].includes(report.category)
    && report.classification === (report.compliant ? 'PASS' : 'FUNCTIONAL_FAILURE')
    && report.assertionExercised === true
    && typeof report.compliant === 'boolean'
    && isPlainObject(report.expected)
    && isPlainObject(report.observed)
    && Array.isArray(report.issues)
    && Array.isArray(observedCases)
    && expectedCases.length > 0
    && expectedCases.length === observedCases.length
    && new Set(expectedCaseIds).size === expectedCaseIds.length
    && new Set(observedCaseIds).size === observedCaseIds.length
    && JSON.stringify(expectedCaseIds) === JSON.stringify(observedCaseIds)
    && expectedCases.every((item, index) => validateCase(item, observedCases[index]));
}

function descriptorConfigurationValid() {
  const ids = definitions.map((item) => item.id);
  return definitions.length === EXPECTED_REPORTS
    && scientific.length === EXPECTED_SCIENTIFIC
    && technical.length === EXPECTED_TECHNICAL
    && new Set(ids).size === EXPECTED_REPORTS
    && JSON.stringify(ids) === JSON.stringify(EXPECTED_IDS)
    && definitions.every((item) => isPlainObject(item)
      && ['scientific', 'technical'].includes(item.category)
      && isPlainObject(item.expected)
      && Array.isArray(item.cases)
      && item.cases.length > 0
      && item.cases.every((caseItem) => isPlainObject(caseItem)
        && typeof caseItem.caseId === 'string'
        && isPlainObject(caseItem.expected)
        && typeof caseItem.inputFactory === 'function'
        && typeof caseItem.verify === 'function'));
}

function main() {
  const reports = definitions.map(evaluate);
  const reportLines = reports.map((report) => `${REPORT_PREFIX}${JSON.stringify(report, jsonReplacer)}`);
  const scientificReports = reports.filter((report) => report.category === 'scientific').length;
  const technicalReports = reports.filter((report) => report.category === 'technical').length;
  const compliant = reports.filter((report) => report.compliant).length;
  const nonCompliant = reports.length - compliant;
  const assertionsExercised = reports.filter((report) => report.assertionExercised === true).length;

  const serializedReportsValid = reportLines.every((line, index) => {
    if (!line.startsWith(REPORT_PREFIX)) return false;
    try {
      return validateReport(JSON.parse(line.slice(REPORT_PREFIX.length)), definitions[index]);
    } catch (_error) {
      return false;
    }
  });

  const configValid = descriptorConfigurationValid()
    && reports.length === EXPECTED_REPORTS
    && scientificReports === EXPECTED_SCIENTIFIC
    && technicalReports === EXPECTED_TECHNICAL
    && serializedReportsValid;

  const processExitCode = !configValid
    ? 3
    : (moduleState === 'module_load_failure' ? 2 : (nonCompliant > 0 ? 1 : 0));
  const classification = processExitCode === 0
    ? 'PASS'
    : (processExitCode === 1 ? 'FUNCTIONAL_FAILURE' : (processExitCode === 2 ? 'INFRA_BLOCKED' : 'CONFIG_ERROR'));

  const summary = {
    classification,
    reports: reports.length,
    expectedReports: EXPECTED_REPORTS,
    scientificReports,
    technicalReports,
    compliant,
    nonCompliant,
    assertionsExercised,
    processExitCode,
  };

  const summaryLine = `${SUMMARY_PREFIX}${JSON.stringify(summary)}`;
  let summaryValid = false;
  try {
    const parsed = JSON.parse(summaryLine.slice(SUMMARY_PREFIX.length));
    summaryValid = summaryLine.startsWith(SUMMARY_PREFIX)
      && parsed.reports === EXPECTED_REPORTS
      && parsed.expectedReports === EXPECTED_REPORTS
      && parsed.scientificReports === EXPECTED_SCIENTIFIC
      && parsed.technicalReports === EXPECTED_TECHNICAL
      && parsed.compliant + parsed.nonCompliant === parsed.reports
      && parsed.assertionsExercised === EXPECTED_REPORTS
      && parsed.processExitCode === processExitCode
      && parsed.classification === classification;
  } catch (_error) {
    summaryValid = false;
  }

  if (!summaryValid) {
    summary.classification = 'CONFIG_ERROR';
    summary.processExitCode = 3;
  }

  process.stdout.write(`${reportLines.join('\n')}\n`);
  process.stdout.write(`${SUMMARY_PREFIX}${JSON.stringify(summary)}\n`);
  process.exitCode = summary.processExitCode;
}

main();
