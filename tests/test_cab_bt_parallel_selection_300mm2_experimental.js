'use strict';

const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');

const REPORT_PREFIX = 'CAB_BT_PARALLEL_300_CORE_EXP_REPORT ';
const SUMMARY_PREFIX = 'CAB_BT_PARALLEL_300_CORE_EXP_SUMMARY ';
const CATEGORY = 'core_characterization_300mm2_experimental';
const EXPECTED_REPORTS = 12;
const CONTRACT_VERSION = 'CAB-BT-PARALLEL-SELECTION-EXP-1';
const MODULE_PATH = path.resolve(__dirname, '..', 'js', 'core_cabos_bt_parallel_selection_experimental.js');
const EXPECTED_IDS = Array.from({ length: EXPECTED_REPORTS }, (_unused, index) => (
  `MM300-CORE-${String(index + 1).padStart(2, '0')}`
));

const PERMANENT_GUARD_CODES = ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'];
const PROHIBITED_FIELDS = ['recommended', 'selected', 'finalSizing'];
const ABSENT_PATH = Object.freeze({ pathState: 'ABSENT' });

const CANDIDATE_300 = Object.freeze({
  section_mm2: 300,
  tabulatedAmpacity_A: 516,
  material: 'COPPER_LAB',
  insulation: 'LAB_UNSPECIFIED',
  installationMethod: 'LAB_UNSPECIFIED',
  referenceTemperature_C: 30,
  units: 'SI',
  source: 'LAB_CATALOG',
  sourceVersion: 'PRELIM-1',
  provenance: 'ASSUMPTION_ONLY',
  impedance_ohm: { re: 0.0075, im: 0.008 },
});

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOwn(object, key) {
  return isPlainObject(object) && Object.prototype.hasOwnProperty.call(object, key);
}

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (isPlainObject(value)) {
    const copy = {};
    Object.keys(value).forEach((key) => { copy[key] = clone(value[key]); });
    return copy;
  }
  return value;
}

function absentPath() {
  return clone(ABSENT_PATH);
}

function readPath(root, segments) {
  let current = root;
  for (const segment of segments) {
    if (current === null || current === undefined) return absentPath();
    if ((typeof current !== 'object' && typeof current !== 'function')
      || !Object.prototype.hasOwnProperty.call(current, segment)) {
      return absentPath();
    }
    current = current[segment];
  }
  return current === undefined ? absentPath() : current;
}

function pathPresent(root, segments) {
  return !isDeepStrictEqual(readPath(root, segments), ABSENT_PATH);
}

function readArrayLength(root, segments) {
  const value = readPath(root, segments);
  return Array.isArray(value) ? value.length : absentPath();
}

function readErrorCode(result) {
  if (!hasOwn(result, 'error')) return absentPath();
  if (result.error === null) return null;
  return readPath(result, ['error', 'code']);
}

function readMappedPath(root, segments, mapper) {
  const value = readPath(root, segments);
  return Array.isArray(value) ? value.map(mapper) : absentPath();
}

function candidatePresence(result, collectionName, candidateId) {
  const list = readPath(result, ['data', collectionName]);
  if (!Array.isArray(list)) return absentPath();
  return list.some((item) => readPath(item, ['candidateId']) === candidateId);
}

function expectedPermanentBlockers() {
  return [
    { code: 'B-01', params: {}, severity: 'blocker' },
    { code: 'B-02', params: {}, severity: 'blocker' },
    { code: 'B-03', params: {}, severity: 'blocker' },
    { code: 'B-04', params: {}, severity: 'blocker' },
    { code: 'B-05', params: {}, severity: 'blocker' },
    { code: 'B-06', params: {}, severity: 'blocker' },
    { code: 'ENGINEERING_ADEQUACY_BLOCKED', params: { reason: 'normative_source_incomplete' }, severity: 'blocker' },
    { code: 'DISCRETE_SELECTION_BLOCKED', params: {}, severity: 'blocker' },
    { code: 'IEC_CONFORMITY_BLOCKED', params: {}, severity: 'blocker' },
    { code: 'PRODUCTION_USE_BLOCKED', params: {}, severity: 'blocker' },
  ];
}

function expectedFailureBlockers(code, params) {
  return [...expectedPermanentBlockers(), { code, params, severity: 'blocker' }];
}

function candidate(section_mm2, tabulatedAmpacity_A, impedance) {
  return {
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
  };
}

function baseInput() {
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
        clone(CANDIDATE_300),
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

function fixtureConfigurationIssues(input) {
  const issues = [];
  const candidates = input && input.catalog && input.catalog.candidates;
  if (!Array.isArray(candidates)) return ['fixture.catalog.candidates must be an array'];
  const sections = candidates.map((item) => item && item.section_mm2);
  const expectedSections = [95, 120, 150, 185, 240, 300];
  if (candidates.length !== 6) issues.push(`fixture candidate count: expected 6, observed ${candidates.length}`);
  if (!isDeepStrictEqual(sections, expectedSections)) issues.push('fixture sections differ from [95,120,150,185,240,300]');
  const entries300 = candidates.filter((item) => item && item.section_mm2 === 300);
  if (entries300.length !== 1) issues.push(`fixture 300 count: expected 1, observed ${entries300.length}`);
  if (entries300.length === 1 && !isDeepStrictEqual(entries300[0], CANDIDATE_300)) {
    issues.push('fixture 300 DTO differs from the ratified object');
  }
  return issues;
}

function invoke(enumerate, input) {
  try {
    return { threw: false, result: enumerate(input), exception: null };
  } catch (error) {
    return {
      threw: true,
      result: null,
      exception: {
        name: error && error.name ? String(error.name) : 'Error',
        message: error && error.message ? String(error.message) : String(error),
      },
    };
  }
}

function evaluated(result, candidateId) {
  const list = readPath(result, ['data', 'evaluatedCandidates']);
  if (!Array.isArray(list)) return absentPath();
  return list.find((item) => readPath(item, ['candidateId']) === candidateId) || absentPath();
}

function alternative(result, candidateId) {
  const list = readPath(result, ['data', 'candidateAlternatives']);
  if (!Array.isArray(list)) return absentPath();
  return list.find((item) => readPath(item, ['candidateId']) === candidateId) || absentPath();
}

function exactKeys(object, expectedKeys) {
  return isPlainObject(object)
    && isDeepStrictEqual(Object.keys(object).sort(), expectedKeys.slice().sort());
}

function issue(pathName, expected, observed) {
  return { path: pathName, expected, observed };
}

function makeReport(id, expected, observed, checks) {
  const issues = checks
    .filter((item) => item.compliant !== true)
    .map((item) => issue(item.path, item.expected, item.observed));
  const compliant = issues.length === 0;
  return {
    id,
    category: CATEGORY,
    classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
    compliant,
    assertionExercised: true,
    expected,
    observed,
    issues,
  };
}

function checked(pathName, observed, expected) {
  return { path: pathName, observed, expected, compliant: isDeepStrictEqual(observed, expected) };
}

function safeReport(id, expected, evaluator) {
  try {
    const evaluation = evaluator();
    return makeReport(id, expected, evaluation.observed, evaluation.checks);
  } catch (error) {
    const observed = {
      exception: {
        name: error && error.name ? String(error.name) : 'Error',
        message: error && error.message ? String(error.message) : String(error),
      },
    };
    return makeReport(id, expected, observed, [checked(`${id}.exception`, observed.exception, null)]);
  }
}

function makeCase(caseId, expectedPaths, observedPaths, extraChecks = []) {
  const checks = [checked(`${caseId}.paths`, observedPaths, expectedPaths), ...extraChecks];
  const issues = checks
    .filter((item) => item.compliant !== true)
    .map((item) => issue(item.path, item.expected, item.observed));
  return {
    caseId,
    assertionExercised: true,
    compliant: issues.length === 0,
    expected: { paths: expectedPaths },
    observed: { paths: observedPaths },
    issues,
  };
}

function matrixReport(id, cases, expectedCaseIds) {
  const observed = { cases };
  const expected = { caseIds: expectedCaseIds };
  const checks = [
    checked(`${id}.caseCount`, cases.length, expectedCaseIds.length),
    checked(`${id}.caseIds`, cases.map((item) => item.caseId), expectedCaseIds),
    checked(`${id}.uniqueCaseIds`, new Set(cases.map((item) => item.caseId)).size, expectedCaseIds.length),
    checked(`${id}.caseCompliance`, cases.map((item) => item.compliant), expectedCaseIds.map(() => true)),
  ];
  return makeReport(id, expected, observed, checks);
}

function noProhibitedFields(object) {
  if (!isPlainObject(object)) return absentPath();
  return PROHIBITED_FIELDS.every((field) => !hasOwn(object, field));
}

function candidatesHaveNoProhibitedFields(list) {
  return Array.isArray(list) ? list.every((item) => noProhibitedFields(item) === true) : absentPath();
}

function candidateCodesAbsent(result, codes) {
  const collections = [
    readPath(result, ['data', 'evaluatedCandidates']),
    readPath(result, ['data', 'candidateAlternatives']),
    readPath(result, ['data', 'rejectedCandidates']),
  ];
  if (collections.some((list) => !Array.isArray(list))) return absentPath();
  return collections.every((list) => list.every((item) => {
    const blockers = readPath(item, ['blockers']);
    return Array.isArray(blockers)
      && blockers.every((blocker) => !codes.includes(readPath(blocker, ['code'])));
  }));
}

function emitConfigurationError(reason, details) {
  const reports = EXPECTED_IDS.map((id) => ({
    id,
    category: CATEGORY,
    classification: 'CONFIG_ERROR',
    compliant: false,
    assertionExercised: false,
    expected: {},
    observed: { reason, details },
    issues: [{ path: 'harness.protocol', expected: 'valid', observed: reason }],
  }));
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX}${JSON.stringify(report)}\n`));
  const summary = {
    classification: 'CONFIG_ERROR',
    reports: reports.length,
    expectedReports: EXPECTED_REPORTS,
    compliant: 0,
    nonCompliant: reports.length,
    assertionsExercised: 0,
    processExitCode: 3,
  };
  process.stdout.write(`${SUMMARY_PREFIX}${JSON.stringify(summary)}\n`);
  process.exitCode = 3;
}

function emitInfrastructureBlocked(error) {
  const reports = EXPECTED_IDS.map((id) => ({
    id,
    category: CATEGORY,
    classification: 'INFRA_BLOCKED',
    compliant: false,
    assertionExercised: false,
    expected: {},
    observed: { reason: 'module_unavailable', error },
    issues: [{ path: 'module', expected: 'available', observed: 'unavailable' }],
  }));
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX}${JSON.stringify(report)}\n`));
  const summary = {
    classification: 'INFRA_BLOCKED',
    reports: reports.length,
    expectedReports: EXPECTED_REPORTS,
    compliant: 0,
    nonCompliant: reports.length,
    assertionsExercised: 0,
    processExitCode: 2,
  };
  process.stdout.write(`${SUMMARY_PREFIX}${JSON.stringify(summary)}\n`);
  process.exitCode = 2;
}

function validateProtocol(reports, summary) {
  const issues = [];
  const reportKeys = [
    'id', 'category', 'classification', 'compliant', 'assertionExercised',
    'expected', 'observed', 'issues',
  ];
  const caseKeys = ['caseId', 'assertionExercised', 'compliant', 'expected', 'observed', 'issues'];
  const summaryKeys = [
    'classification', 'reports', 'expectedReports', 'compliant', 'nonCompliant',
    'assertionsExercised', 'processExitCode',
  ];
  if (reports.length !== EXPECTED_REPORTS) issues.push('report_count');
  if (!isDeepStrictEqual(reports.map((report) => report.id), EXPECTED_IDS)) issues.push('report_ids');
  if (new Set(reports.map((report) => report.id)).size !== EXPECTED_REPORTS) issues.push('report_id_uniqueness');
  reports.forEach((report) => {
    if (!exactKeys(report, reportKeys)) issues.push(`${report.id}.schema`);
    if (report.category !== CATEGORY) issues.push(`${report.id}.category`);
    if (report.assertionExercised !== true) issues.push(`${report.id}.assertionExercised`);
    if (report.classification !== (report.compliant ? 'PASS' : 'FUNCTIONAL_FAILURE')) {
      issues.push(`${report.id}.classification`);
    }
    if (report.compliant !== (Array.isArray(report.issues) && report.issues.length === 0)) {
      issues.push(`${report.id}.issue_reconciliation`);
    }
    if (!isPlainObject(report.expected) || !isPlainObject(report.observed) || !Array.isArray(report.issues)) {
      issues.push(`${report.id}.payload_schema`);
    }
  });
  const matrixCases = {
    'MM300-CORE-08': [
      'MM300-CORE-08-CASE-01', 'MM300-CORE-08-CASE-02',
      'MM300-CORE-08-CASE-03', 'MM300-CORE-08-CASE-04',
    ],
    'MM300-CORE-10': [
      'MM300-CORE-10-CASE-01', 'MM300-CORE-10-CASE-02',
      'MM300-CORE-10-CASE-03', 'MM300-CORE-10-CASE-04',
    ],
    'MM300-CORE-11': ['MM300-CORE-11-CASE-01', 'MM300-CORE-11-CASE-02'],
    'MM300-CORE-12': [
      'MM300-CORE-12-CASE-01', 'MM300-CORE-12-CASE-02',
      'MM300-CORE-12-CASE-03', 'MM300-CORE-12-CASE-04',
    ],
  };
  Object.entries(matrixCases).forEach(([id, expectedCaseIds]) => {
    const report = reports.find((item) => item.id === id);
    const cases = report && report.observed && report.observed.cases;
    if (!Array.isArray(cases) || cases.length !== expectedCaseIds.length) {
      issues.push(`${id}.case_count`);
      return;
    }
    const observedCaseIds = cases.map((item) => item.caseId);
    if (!isDeepStrictEqual(observedCaseIds, expectedCaseIds)) issues.push(`${id}.case_ids`);
    if (new Set(observedCaseIds).size !== expectedCaseIds.length) issues.push(`${id}.case_id_uniqueness`);
    cases.forEach((item) => {
      if (!exactKeys(item, caseKeys)) issues.push(`${item.caseId || id}.schema`);
      if (item.assertionExercised !== true) issues.push(`${item.caseId || id}.assertionExercised`);
      if (item.compliant !== (Array.isArray(item.issues) && item.issues.length === 0)) {
        issues.push(`${item.caseId || id}.issue_reconciliation`);
      }
      if (!isPlainObject(item.expected) || !isPlainObject(item.observed) || !Array.isArray(item.issues)) {
        issues.push(`${item.caseId || id}.payload_schema`);
      }
    });
  });
  if (!exactKeys(summary, summaryKeys)) issues.push('summary_schema');
  if (summary.reports !== reports.length) issues.push('summary_reports');
  if (summary.expectedReports !== EXPECTED_REPORTS) issues.push('summary_expectedReports');
  if (summary.compliant !== reports.filter((report) => report.compliant).length) issues.push('summary_compliant');
  if (summary.nonCompliant !== reports.filter((report) => !report.compliant).length) issues.push('summary_nonCompliant');
  if (summary.assertionsExercised !== reports.filter((report) => report.assertionExercised).length) {
    issues.push('summary_assertionsExercised');
  }
  const expectedSummaryClassification = summary.compliant === EXPECTED_REPORTS ? 'PASS' : 'FUNCTIONAL_FAILURE';
  const expectedProcessExitCode = expectedSummaryClassification === 'PASS' ? 0 : 1;
  if (summary.classification !== expectedSummaryClassification) issues.push('summary_classification');
  if (summary.processExitCode !== expectedProcessExitCode) issues.push('summary_processExitCode');
  return issues;
}

function main() {
  let enumerate;
  try {
    const moduleExports = require(MODULE_PATH);
    enumerate = moduleExports && moduleExports.enumerateCablingBTParallelAlternativesExperimental;
    if (typeof enumerate !== 'function') throw new TypeError('expected export is not a function');
  } catch (error) {
    emitInfrastructureBlocked({
      name: error && error.name ? String(error.name) : 'Error',
      message: error && error.message ? String(error.message) : String(error),
    });
    return;
  }

  const nominalInput = baseInput();
  const fixtureIssues = fixtureConfigurationIssues(nominalInput);
  if (fixtureIssues.length > 0) {
    emitConfigurationError('fixture_invalid', fixtureIssues);
    return;
  }

  const nominalBefore = clone(nominalInput);
  const nominalCall = invoke(enumerate, nominalInput);
  const nominalResult = nominalCall.result;

  const objectiveCalls = { NONE: nominalCall };
  ['MIN_PARALLEL_COUNT', 'MIN_TOTAL_COPPER', 'MAX_MINIMUM_MARGIN'].forEach((objective) => {
    const input = baseInput();
    input.objective = objective;
    objectiveCalls[objective] = invoke(enumerate, input);
  });

  const historicalInput = baseInput();
  historicalInput.catalog.candidates = historicalInput.catalog.candidates.filter((item) => item.section_mm2 !== 300);
  const historicalCall = invoke(enumerate, historicalInput);

  const missingAmpacityInput = baseInput();
  missingAmpacityInput.catalog.candidates = [clone(CANDIDATE_300)];
  delete missingAmpacityInput.catalog.candidates[0].tabulatedAmpacity_A;
  const missingAmpacityCall = invoke(enumerate, missingAmpacityInput);

  const nanAmpacityInput = baseInput();
  nanAmpacityInput.catalog.candidates = [clone(CANDIDATE_300)];
  nanAmpacityInput.catalog.candidates[0].tabulatedAmpacity_A = Number.NaN;
  const nanAmpacityCall = invoke(enumerate, nanAmpacityInput);

  const infiniteResistanceInput = baseInput();
  infiniteResistanceInput.catalog.candidates = [clone(CANDIDATE_300)];
  delete infiniteResistanceInput.catalog.candidates[0].impedance_ohm;
  infiniteResistanceInput.catalog.candidates[0].resistance_ohm = Number.POSITIVE_INFINITY;
  infiniteResistanceInput.catalog.candidates[0].reactance_ohm = 0.008;
  const infiniteResistanceCall = invoke(enumerate, infiniteResistanceInput);

  const conflictInput = baseInput();
  conflictInput.catalog.candidates = [clone(CANDIDATE_300)];
  conflictInput.catalog.candidates[0].resistance_ohm = 0.0075;
  conflictInput.catalog.candidates[0].reactance_ohm = 0.008;
  const conflictCall = invoke(enumerate, conflictInput);

  const heterogeneousInput = baseInput();
  heterogeneousInput.catalog.candidates = [
    clone(heterogeneousInput.catalog.candidates[0]),
    clone(CANDIDATE_300),
  ];
  heterogeneousInput.catalog.candidates[1].material = 'ALUMINUM_LAB';
  heterogeneousInput.maxParallelCount = 1;
  heterogeneousInput.providedCombination = { section_mm2: 95, nParallel: 1 };
  const heterogeneousCall = invoke(enumerate, heterogeneousInput);

  const deterministicInput = baseInput();
  const deterministicCall = invoke(enumerate, deterministicInput);

  const reports = [];

  reports.push(safeReport('MM300-CORE-01', {
    candidate: CANDIDATE_300,
    resultOk: true,
    universeSections_mm2: [95, 120, 150, 185, 240, 300],
  }, () => {
    const candidate300 = nominalInput.catalog.candidates.find((item) => item.section_mm2 === 300) || null;
    const observed = {
      candidate: candidate300,
      resultOk: readPath(nominalResult, ['ok']),
      universeSections_mm2: readPath(nominalResult, ['data', 'universe', 'sections_mm2']),
    };
    return { observed, checks: [
      checked('MM300-CORE-01.candidate', observed.candidate, CANDIDATE_300),
      checked('MM300-CORE-01.resultOk', observed.resultOk, true),
      checked('MM300-CORE-01.universeSections_mm2', observed.universeSections_mm2, [95, 120, 150, 185, 240, 300]),
      checked('MM300-CORE-01.throw', nominalCall.threw, false),
    ] };
  }));

  reports.push(safeReport('MM300-CORE-02', {
    evaluated: 24, valid: 14, rejected: 10, nonDominated: 14,
  }, () => {
    const observed = {
      evaluated: readArrayLength(nominalResult, ['data', 'evaluatedCandidates']),
      valid: readArrayLength(nominalResult, ['data', 'candidateAlternatives']),
      rejected: readArrayLength(nominalResult, ['data', 'rejectedCandidates']),
      nonDominated: readArrayLength(nominalResult, ['data', 'nonDominatedAlternatives']),
    };
    return { observed, checks: [checked('MM300-CORE-02.counts', observed, {
      evaluated: 24, valid: 14, rejected: 10, nonDominated: 14,
    })] };
  }));

  reports.push(safeReport('MM300-CORE-03', {
    candidateId: '1x300', status: 'REJECTED', failedCriteria: ['AMPACIDADE'],
    dominantCriteria: ['AMPACIDADE'], ampacityPasses: false, voltageDropPasses: true,
    shortCircuitPasses: true, blockerCodes: [], validAlternative: false,
  }, () => {
    const item = evaluated(nominalResult, '1x300');
    const observed = {
      candidateId: readPath(item, ['candidateId']),
      status: readPath(item, ['status']),
      failedCriteria: readPath(item, ['failedCriteria']),
      dominantCriteria: readPath(item, ['dominantCriteria']),
      ampacityPasses: readPath(item, ['ampacity', 'passes']),
      voltageDropPasses: readPath(item, ['voltageDrop', 'passes']),
      shortCircuitPasses: readPath(item, ['shortCircuit', 'passes']),
      blockerCodes: readMappedPath(item, ['blockers'], (blocker) => readPath(blocker, ['code'])),
      validAlternative: candidatePresence(nominalResult, 'candidateAlternatives', '1x300'),
    };
    return { observed, checks: [checked('MM300-CORE-03.paths', observed, {
      candidateId: '1x300', status: 'REJECTED', failedCriteria: ['AMPACIDADE'],
      dominantCriteria: ['AMPACIDADE'], ampacityPasses: false, voltageDropPasses: true,
      shortCircuitPasses: true, blockerCodes: [], validAlternative: false,
    })] };
  }));

  ['2x300', '3x300', '4x300'].forEach((candidateId, index) => {
    const id = `MM300-CORE-${String(index + 4).padStart(2, '0')}`;
    reports.push(safeReport(id, {
      candidateId, status: 'VALID', validAlternative: true, productionAllowed: false,
      candidateInstallableSelection: null, rootInstallableSelection: null,
      installationAuthorized: false, errorCode: null,
    }, () => {
      const item = evaluated(nominalResult, candidateId);
      const observed = {
        candidateId: readPath(item, ['candidateId']),
        status: readPath(item, ['status']),
        validAlternative: candidatePresence(nominalResult, 'candidateAlternatives', candidateId),
        productionAllowed: readPath(nominalResult, ['productionAllowed']),
        candidateInstallableSelection: readPath(item, ['installableSelection']),
        rootInstallableSelection: readPath(nominalResult, ['data', 'installableSelection']),
        installationAuthorized: readPath(nominalResult, ['data', 'installationAuthorized']),
        errorCode: readErrorCode(nominalResult),
      };
      return { observed, checks: [checked(`${id}.paths`, observed, {
        candidateId, status: 'VALID', validAlternative: true, productionAllowed: false,
        candidateInstallableSelection: null, rootInstallableSelection: null,
        installationAuthorized: false, errorCode: null,
      })] };
    }));
  });

  reports.push(safeReport('MM300-CORE-07', {
    objective: 'NONE', nParallel: 2, section_mm2: 185,
    objectiveDisposition: 'NO_CANDIDATE_ELECTED_PRESENTATION_ORDER_ONLY',
    installableSelection: null, installationAuthorized: false,
  }, () => {
    const observed = {
      objective: readPath(nominalResult, ['data', 'objective']),
      nParallel: readPath(nominalResult, ['data', 'firstInPresentationOrder', 'nParallel']),
      section_mm2: readPath(nominalResult, ['data', 'firstInPresentationOrder', 'section_mm2']),
      objectiveDisposition: readPath(nominalResult, ['data', 'objectiveDisposition']),
      installableSelection: readPath(nominalResult, ['data', 'installableSelection']),
      installationAuthorized: readPath(nominalResult, ['data', 'installationAuthorized']),
    };
    return { observed, checks: [checked('MM300-CORE-07.paths', observed, {
      objective: 'NONE', nParallel: 2, section_mm2: 185,
      objectiveDisposition: 'NO_CANDIDATE_ELECTED_PRESENTATION_ORDER_ONLY',
      installableSelection: null, installationAuthorized: false,
    })] };
  }));

  const objectiveDefinitions = [
    ['MM300-CORE-08-CASE-01', 'NONE', 2, 185],
    ['MM300-CORE-08-CASE-02', 'MIN_PARALLEL_COUNT', 2, 300],
    ['MM300-CORE-08-CASE-03', 'MIN_TOTAL_COPPER', 3, 120],
    ['MM300-CORE-08-CASE-04', 'MAX_MINIMUM_MARGIN', 4, 300],
  ];
  const objectiveCases = objectiveDefinitions.map(([caseId, objective, nParallel, section_mm2]) => {
    const call = objectiveCalls[objective];
    const result = call.result;
    const expectedPaths = {
      objective, nParallel, section_mm2, installableSelection: null,
      installationAuthorized: false, productionAllowed: false, errorCode: null,
    };
    const observedPaths = {
      objective: readPath(result, ['data', 'objective']),
      nParallel: readPath(result, ['data', 'firstInPresentationOrder', 'nParallel']),
      section_mm2: readPath(result, ['data', 'firstInPresentationOrder', 'section_mm2']),
      installableSelection: readPath(result, ['data', 'installableSelection']),
      installationAuthorized: readPath(result, ['data', 'installationAuthorized']),
      productionAllowed: readPath(result, ['productionAllowed']),
      errorCode: readErrorCode(result),
    };
    return makeCase(caseId, expectedPaths, observedPaths, [checked(`${caseId}.throw`, call.threw, false)]);
  });
  reports.push(matrixReport('MM300-CORE-08', objectiveCases, objectiveDefinitions.map((item) => item[0])));

  reports.push(safeReport('MM300-CORE-09', {
    resultOk: true, errorCode: null, forbiddenCandidateCodesAbsent: true,
  }, () => {
    const observed = {
      resultOk: readPath(nominalResult, ['ok']),
      errorCode: readErrorCode(nominalResult),
      forbiddenCandidateCodesAbsent: candidateCodesAbsent(
        nominalResult,
        ['CANDIDATE_STRUCTURE_INVALID', 'catalog_heterogeneous'],
      ),
    };
    return { observed, checks: [checked('MM300-CORE-09.paths', observed, {
      resultOk: true, errorCode: null, forbiddenCandidateCodesAbsent: true,
    })] };
  }));

  const historicalResult = historicalCall.result;
  const missingAmpacityResult = missingAmpacityCall.result;
  const nanAmpacityResult = nanAmpacityCall.result;
  const infiniteResistanceResult = infiniteResistanceCall.result;
  const missingAmpacityParams = {
    catalogEntryCount: 1,
    errors: [{
      code: 'CANDIDATE_INCOMPLETE',
      catalogEntryId: 'section-300',
      missingFields: ['tabulatedAmpacity_A'],
      mode: 'CATALOGO_LAB_ASSUMPTION_ONLY',
      provenance: 'ASSUMPTION_ONLY',
    }],
  };
  const nanAmpacityParams = {
    catalogEntryCount: 1,
    errors: [{
      code: 'CANDIDATE_VALUE_INVALID',
      catalogEntryId: 'section-300',
      catalogEntryIndex: 0,
      invalidFields: [{ path: 'tabulatedAmpacity_A', reason: 'NON_FINITE', observedType: 'number:NaN' }],
      mode: 'CATALOGO_LAB_ASSUMPTION_ONLY',
    }],
  };
  const infiniteResistanceParams = {
    catalogEntryCount: 1,
    errors: [{
      code: 'CANDIDATE_IMPEDANCE_VALUE_INVALID',
      catalogEntryId: 'section-300',
      invalidFields: [{ path: 'resistance_ohm', reason: 'NON_FINITE', observedType: 'number:+Infinity' }],
      mode: 'CATALOGO_LAB_ASSUMPTION_ONLY',
    }],
  };
  const core10Cases = [
    makeCase('MM300-CORE-10-CASE-01', {
      ok: true, evaluated: 20, valid: 11, rejected: 9, nonDominated: 11,
      errorCode: null, productionAllowed: false,
    }, {
      ok: readPath(historicalResult, ['ok']),
      evaluated: readArrayLength(historicalResult, ['data', 'evaluatedCandidates']),
      valid: readArrayLength(historicalResult, ['data', 'candidateAlternatives']),
      rejected: readArrayLength(historicalResult, ['data', 'rejectedCandidates']),
      nonDominated: readArrayLength(historicalResult, ['data', 'nonDominatedAlternatives']),
      errorCode: readErrorCode(historicalResult),
      productionAllowed: readPath(historicalResult, ['productionAllowed']),
    }, [checked('MM300-CORE-10-CASE-01.throw', historicalCall.threw, false)]),
    makeCase('MM300-CORE-10-CASE-02', {
      ok: false, data: null, errorCode: 'CATALOG_NO_EVALUABLE_CANDIDATE',
      firstErrorCode: 'CANDIDATE_INCOMPLETE', missingFields: ['tabulatedAmpacity_A'],
      errorParams: missingAmpacityParams, errorsPresent: true,
      blockers: expectedFailureBlockers('CATALOG_NO_EVALUABLE_CANDIDATE', missingAmpacityParams),
      productionAllowed: false,
    }, {
      ok: readPath(missingAmpacityResult, ['ok']),
      data: readPath(missingAmpacityResult, ['data']),
      errorCode: readPath(missingAmpacityResult, ['error', 'code']),
      firstErrorCode: readPath(missingAmpacityResult, ['error', 'params', 'errors', 0, 'code']),
      missingFields: readPath(missingAmpacityResult, ['error', 'params', 'errors', 0, 'missingFields']),
      errorParams: readPath(missingAmpacityResult, ['error', 'params']),
      errorsPresent: pathPresent(missingAmpacityResult, ['error', 'params', 'errors']),
      blockers: readPath(missingAmpacityResult, ['blockers']),
      productionAllowed: readPath(missingAmpacityResult, ['productionAllowed']),
    }, [checked('MM300-CORE-10-CASE-02.throw', missingAmpacityCall.threw, false)]),
    makeCase('MM300-CORE-10-CASE-03', {
      ok: false, data: null, errorCode: 'CATALOG_NO_EVALUABLE_CANDIDATE',
      firstErrorCode: 'CANDIDATE_VALUE_INVALID',
      invalidFields: [{ path: 'tabulatedAmpacity_A', reason: 'NON_FINITE', observedType: 'number:NaN' }],
      errorParams: nanAmpacityParams, errorsPresent: true,
      blockers: expectedFailureBlockers('CATALOG_NO_EVALUABLE_CANDIDATE', nanAmpacityParams),
      productionAllowed: false,
    }, {
      ok: readPath(nanAmpacityResult, ['ok']),
      data: readPath(nanAmpacityResult, ['data']),
      errorCode: readPath(nanAmpacityResult, ['error', 'code']),
      firstErrorCode: readPath(nanAmpacityResult, ['error', 'params', 'errors', 0, 'code']),
      invalidFields: readPath(nanAmpacityResult, ['error', 'params', 'errors', 0, 'invalidFields']),
      errorParams: readPath(nanAmpacityResult, ['error', 'params']),
      errorsPresent: pathPresent(nanAmpacityResult, ['error', 'params', 'errors']),
      blockers: readPath(nanAmpacityResult, ['blockers']),
      productionAllowed: readPath(nanAmpacityResult, ['productionAllowed']),
    }, [checked('MM300-CORE-10-CASE-03.throw', nanAmpacityCall.threw, false)]),
    makeCase('MM300-CORE-10-CASE-04', {
      ok: false, data: null, errorCode: 'CATALOG_NO_EVALUABLE_CANDIDATE',
      firstErrorCode: 'CANDIDATE_IMPEDANCE_VALUE_INVALID',
      invalidFields: [{ path: 'resistance_ohm', reason: 'NON_FINITE', observedType: 'number:+Infinity' }],
      errorParams: infiniteResistanceParams, errorsPresent: true,
      blockers: expectedFailureBlockers('CATALOG_NO_EVALUABLE_CANDIDATE', infiniteResistanceParams),
      productionAllowed: false,
    }, {
      ok: readPath(infiniteResistanceResult, ['ok']),
      data: readPath(infiniteResistanceResult, ['data']),
      errorCode: readPath(infiniteResistanceResult, ['error', 'code']),
      firstErrorCode: readPath(infiniteResistanceResult, ['error', 'params', 'errors', 0, 'code']),
      invalidFields: readPath(infiniteResistanceResult, ['error', 'params', 'errors', 0, 'invalidFields']),
      errorParams: readPath(infiniteResistanceResult, ['error', 'params']),
      errorsPresent: pathPresent(infiniteResistanceResult, ['error', 'params', 'errors']),
      blockers: readPath(infiniteResistanceResult, ['blockers']),
      productionAllowed: readPath(infiniteResistanceResult, ['productionAllowed']),
    }, [checked('MM300-CORE-10-CASE-04.throw', infiniteResistanceCall.threw, false)]),
  ];
  reports.push(matrixReport('MM300-CORE-10', core10Cases, core10Cases.map((item) => item.caseId)));

  const conflictResult = conflictCall.result;
  const heterogeneousResult = heterogeneousCall.result;
  const heterogeneous300 = readPath(heterogeneousResult, ['data', 'evaluatedCandidates', 1]);
  const conflictParams = {
    catalogEntryCount: 1,
    errors: [{
      code: 'CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT',
      catalogEntryId: 'section-300',
      presentFields: ['impedance_ohm', 'resistance_ohm', 'reactance_ohm'],
    }],
  };
  const core11Cases = [
    makeCase('MM300-CORE-11-CASE-01', {
      ok: false, data: null, errorCode: 'CATALOG_NO_EVALUABLE_CANDIDATE',
      firstErrorCode: 'CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT',
      errorParams: conflictParams, errorsPresent: true,
      blockers: expectedFailureBlockers('CATALOG_NO_EVALUABLE_CANDIDATE', conflictParams),
      productionAllowed: false,
    }, {
      ok: readPath(conflictResult, ['ok']),
      data: readPath(conflictResult, ['data']),
      errorCode: readPath(conflictResult, ['error', 'code']),
      firstErrorCode: readPath(conflictResult, ['error', 'params', 'errors', 0, 'code']),
      errorParams: readPath(conflictResult, ['error', 'params']),
      errorsPresent: pathPresent(conflictResult, ['error', 'params', 'errors']),
      blockers: readPath(conflictResult, ['blockers']),
      productionAllowed: readPath(conflictResult, ['productionAllowed']),
    }, [checked('MM300-CORE-11-CASE-01.throw', conflictCall.threw, false)]),
    makeCase('MM300-CORE-11-CASE-02', {
      ok: true, candidateId: '1x300', blockerCode: 'CANDIDATE_STRUCTURE_INVALID',
      blockerReason: 'catalog_heterogeneous', valid300Alternatives: 0,
      errorCode: null, productionAllowed: false, installableSelection: null,
      installationAuthorized: false,
    }, {
      ok: readPath(heterogeneousResult, ['ok']),
      candidateId: readPath(heterogeneous300, ['candidateId']),
      blockerCode: readPath(heterogeneous300, ['blockers', 0, 'code']),
      blockerReason: readPath(heterogeneous300, ['blockers', 0, 'params', 'reason']),
      valid300Alternatives: (() => {
        const alternatives = readPath(heterogeneousResult, ['data', 'candidateAlternatives']);
        return Array.isArray(alternatives)
          ? alternatives.filter((item) => readPath(item, ['section_mm2']) === 300).length
          : absentPath();
      })(),
      errorCode: readErrorCode(heterogeneousResult),
      productionAllowed: readPath(heterogeneousResult, ['productionAllowed']),
      installableSelection: readPath(heterogeneousResult, ['data', 'installableSelection']),
      installationAuthorized: readPath(heterogeneousResult, ['data', 'installationAuthorized']),
    }, [checked('MM300-CORE-11-CASE-02.throw', heterogeneousCall.threw, false)]),
  ];
  reports.push(matrixReport('MM300-CORE-11', core11Cases, core11Cases.map((item) => item.caseId)));

  const deterministicResult = deterministicCall.result;
  const data = readPath(nominalResult, ['data']);
  const topFieldsAbsent = noProhibitedFields(nominalResult);
  const candidateFieldsAbsent = {
    evaluatedCandidates: candidatesHaveNoProhibitedFields(readPath(data, ['evaluatedCandidates'])),
    candidateAlternatives: candidatesHaveNoProhibitedFields(readPath(data, ['candidateAlternatives'])),
    rejectedCandidates: candidatesHaveNoProhibitedFields(readPath(data, ['rejectedCandidates'])),
    nonDominatedAlternatives: candidatesHaveNoProhibitedFields(readPath(data, ['nonDominatedAlternatives'])),
    presentationOrder: candidatesHaveNoProhibitedFields(readPath(data, ['presentationOrder'])),
  };
  const core12Cases = [
    makeCase('MM300-CORE-12-CASE-01', {
      inputUnchanged: true, callDidNotThrow: true,
    }, {
      inputUnchanged: isDeepStrictEqual(nominalInput, nominalBefore),
      callDidNotThrow: nominalCall.threw === false,
    }),
    makeCase('MM300-CORE-12-CASE-02', {
      outputsDeeplyEqual: true, bothDidNotThrow: true,
    }, {
      outputsDeeplyEqual: isDeepStrictEqual(nominalResult, deterministicResult),
      bothDidNotThrow: nominalCall.threw === false && deterministicCall.threw === false,
    }),
    makeCase('MM300-CORE-12-CASE-03', {
      productionAllowed: false, installableSelection: null, installationAuthorized: false,
      guardCodes: PERMANENT_GUARD_CODES, errorCode: null,
    }, {
      productionAllowed: readPath(nominalResult, ['productionAllowed']),
      installableSelection: readPath(data, ['installableSelection']),
      installationAuthorized: readPath(data, ['installationAuthorized']),
      guardCodes: (() => {
        const blockers = readPath(nominalResult, ['blockers']);
        return Array.isArray(blockers)
          ? blockers.slice(0, 6).map((blocker) => readPath(blocker, ['code']))
          : absentPath();
      })(),
      errorCode: readErrorCode(nominalResult),
    }),
    makeCase('MM300-CORE-12-CASE-04', {
      topFieldsAbsent: true,
      candidateFieldsAbsent: {
        evaluatedCandidates: true,
        candidateAlternatives: true,
        rejectedCandidates: true,
        nonDominatedAlternatives: true,
        presentationOrder: true,
      },
      errorCode: null,
    }, {
      topFieldsAbsent,
      candidateFieldsAbsent,
      errorCode: readErrorCode(nominalResult),
    }),
  ];
  reports.push(matrixReport('MM300-CORE-12', core12Cases, core12Cases.map((item) => item.caseId)));

  const compliant = reports.filter((report) => report.compliant).length;
  const summary = {
    classification: compliant === EXPECTED_REPORTS ? 'PASS' : 'FUNCTIONAL_FAILURE',
    reports: reports.length,
    expectedReports: EXPECTED_REPORTS,
    compliant,
    nonCompliant: reports.length - compliant,
    assertionsExercised: reports.filter((report) => report.assertionExercised).length,
    processExitCode: compliant === EXPECTED_REPORTS ? 0 : 1,
  };

  const protocolIssues = validateProtocol(reports, summary);
  if (protocolIssues.length > 0) {
    emitConfigurationError('protocol_invalid', protocolIssues);
    return;
  }

  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX}${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX}${JSON.stringify(summary)}\n`);
  process.exitCode = summary.processExitCode;
}

try {
  main();
} catch (error) {
  emitConfigurationError('unexpected_harness_exception', {
    name: error && error.name ? String(error.name) : 'Error',
    message: error && error.message ? String(error.message) : String(error),
    stack: error && error.stack ? String(error.stack) : null,
  });
}
