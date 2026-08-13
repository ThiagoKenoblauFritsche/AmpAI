'use strict';

const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');

const REPORT_PREFIX = 'CAB_BT_PARALLEL_MINIMUM_PER_SECTION_EXP_REPORT ';
const SUMMARY_PREFIX = 'CAB_BT_PARALLEL_MINIMUM_PER_SECTION_EXP_SUMMARY ';
const CATEGORY = 'minimum_per_section_core_experimental';
const EXPECTED_REPORTS = 16;
const EXPECTED_CASES = 134;
const CONTRACT_VERSION = 'CAB-BT-PARALLEL-SELECTION-EXP-1';
const MODULE_PATH = path.resolve(__dirname, '..', 'js', 'core_cabos_bt_parallel_selection_experimental.js');
const CASE_COUNTS = [2, 5, 2, 6, 6, 4, 60, 4, 4, 18, 4, 2, 4, 3, 6, 4];
const EXPECTED_IDS = CASE_COUNTS.map((_count, index) => `MPS-CORE-${String(index + 1).padStart(2, '0')}`);
const SECTIONS = [95, 120, 150, 185, 240, 300];
const OBJECTIVES = ['NONE', 'MIN_PARALLEL_COUNT', 'MIN_TOTAL_COPPER', 'MAX_MINIMUM_MARGIN'];
const POLICY = Object.freeze({
  mode: 'MINIMUM_PASSING_PER_SECTION',
  confirmed: true,
  provenance: 'CEO_APPROVED_PRESENTATION_POLICY',
});
const PERMANENT_GUARD_CODES = ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'];
const ABSENT_PATH = Object.freeze({ pathState: 'ABSENT' });

const DEFAULT_MINIMUMS = Object.freeze({
  95: '10x95', 120: '8x120', 150: '7x150', 185: '6x185', 240: '6x240', 300: '5x300',
});
const LIMIT7_MINIMUMS = Object.freeze({
  95: null, 120: null, 150: '7x150', 185: '6x185', 240: '6x240', 300: '5x300',
});
const DEFAULT_ORDERS = Object.freeze({
  NONE: ['5x300', '6x185', '6x240', '7x150', '8x120', '10x95'],
  MIN_PARALLEL_COUNT: ['5x300', '6x240', '6x185', '7x150', '8x120', '10x95'],
  MIN_TOTAL_COPPER: ['10x95', '8x120', '7x150', '6x185', '6x240', '5x300'],
  MAX_MINIMUM_MARGIN: ['6x240', '5x300', '10x95', '7x150', '8x120', '6x185'],
});
const LIMIT7_ORDERS = Object.freeze({
  NONE: ['5x300', '6x185', '6x240', '7x150'],
  MIN_PARALLEL_COUNT: ['5x300', '6x240', '6x185', '7x150'],
  MIN_TOTAL_COPPER: ['7x150', '6x185', '6x240', '5x300'],
  MAX_MINIMUM_MARGIN: ['6x240', '5x300', '7x150', '6x185'],
});
const DEFAULT_HIDDEN = Object.freeze([
  '9x120', '10x120',
  '8x150', '9x150', '10x150',
  '7x185', '8x185', '9x185', '10x185',
  '7x240', '8x240', '9x240', '10x240',
  '6x300', '7x300', '8x300', '9x300', '10x300',
]);
const LIMIT7_HIDDEN = Object.freeze(['7x185', '7x240', '6x300', '7x300']);

const REPORT_CONTRACTS = Object.freeze([
  'omitted/null policy preserves ALL_VALID_LEGACY without CAB-004 fields',
  'invalid explicit policies return exact PRESENTATION_POLICY_INVALID',
  'raw, valid and filtered counts reconcile for limits 10 and 7',
  'default 10 retains the exact minimum passing candidate per section',
  'limit 7 records exact absences and minimum passing candidates',
  '300 mm2 raw validity is preserved while presentation retains only 5x300',
  'the complete 60-combination universe is evaluated with one L0 call each',
  'all four default objective orders are exact',
  'all four limit-7 objective orders are exact',
  'default hiddenCandidateIds are exact and remain in candidateAlternatives',
  'limit-7 hiddenCandidateIds are exact',
  'nCircuits does not change the universe or minimum-by-section projection',
  'purity, determinism, raw arrays and frontier remain intact',
  'closed schemas discriminate CAB-004 success from legacy success',
  'visible and hidden lists are disjoint, complete and reconciled by section',
  'all objectives preserve production guards and B-01 through B-06',
]);

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
    const result = {};
    Object.keys(value).forEach((key) => { result[key] = clone(value[key]); });
    return result;
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
      || !Object.prototype.hasOwnProperty.call(current, segment)) return absentPath();
    current = current[segment];
  }
  return current === undefined ? absentPath() : current;
}

function exactKeys(value, expectedKeys) {
  return isPlainObject(value)
    && isDeepStrictEqual(Object.keys(value).sort(), expectedKeys.slice().sort());
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
    totalLoadCurrent_A: 1800,
    lineVoltage_V: 400,
    powerFactor: {
      value: 0.9,
      inputClass: 'SUGERIDA_COM_CONFIRMACAO',
      confirmed: true,
      provenance: 'ASSUMPTION_ONLY',
    },
    maximumVoltageDrop_percent: 3,
    maxParallelCount: 10,
    nCircuits: 1,
    arrangement: 'LAB_IDENTICAL_BRANCHES',
    catalog: {
      mode: 'CATALOGO_LAB_ASSUMPTION_ONLY',
      confirmed: true,
      source: 'CAB_BT_PARALLEL_SELECTION_PRELIM_Memorial.md',
      sourceVersion: '122b885db40f69b422dac8ea4c2e419dc547220f',
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
        candidate(300, 516, { impedance_ohm: { re: 0.0075, im: 0.008 } }),
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
    providedCombination: { section_mm2: 300, nParallel: 5 },
  };
}

function policyInput(limit = 10, objective = 'NONE', nCircuits = 1) {
  const input = baseInput();
  input.maxParallelCount = limit;
  input.objective = objective;
  input.nCircuits = nCircuits;
  input.presentationPolicy = clone(POLICY);
  return input;
}

function legacyInput(policyState = 'omitted') {
  const input = baseInput();
  input.totalLoadCurrent_A = 600;
  input.maxParallelCount = 4;
  input.providedCombination = { section_mm2: 150, nParallel: 3 };
  if (policyState === 'null') input.presentationPolicy = null;
  return input;
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

function idsAt(result, segments) {
  const value = readPath(result, segments);
  if (!Array.isArray(value)) return absentPath();
  return value.map((item) => readPath(item, ['candidateId']));
}

function scalarArrayAt(result, segments) {
  const value = readPath(result, segments);
  return Array.isArray(value) ? clone(value) : absentPath();
}

function objectAt(result, segments) {
  return clone(readPath(result, segments));
}

function candidateAt(result, collection, candidateId) {
  const list = readPath(result, ['data', collection]);
  if (!Array.isArray(list)) return absentPath();
  return list.find((item) => readPath(item, ['candidateId']) === candidateId) || absentPath();
}

function candidateIdsForSection(result, collection, section) {
  const list = readPath(result, ['data', collection]);
  if (!Array.isArray(list)) return absentPath();
  return list
    .filter((item) => readPath(item, ['section_mm2']) === section)
    .map((item) => readPath(item, ['candidateId']));
}

function exactCandidateIds(limit) {
  const ids = [];
  for (let nParallel = 1; nParallel <= limit; nParallel += 1) {
    SECTIONS.forEach((section) => ids.push(`${nParallel}x${section}`));
  }
  return ids;
}

function validIdsForSection(section, limit) {
  const threshold = Number(String((limit === 7 ? LIMIT7_MINIMUMS : DEFAULT_MINIMUMS)[section] || '').split('x')[0]);
  if (!Number.isInteger(threshold) || threshold > limit) return [];
  return Array.from({ length: limit - threshold + 1 }, (_unused, index) => `${threshold + index}x${section}`);
}

function expectedMinimumItem(section, limit) {
  const candidateId = (limit === 7 ? LIMIT7_MINIMUMS : DEFAULT_MINIMUMS)[section];
  return {
    section_mm2: section,
    candidateId,
    status: candidateId === null
      ? 'NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE'
      : 'PASSING_ALTERNATIVE_FOUND',
    evaluatedRange: { minimum: 1, maximum: limit },
  };
}

function observeLegacy(call) {
  const result = call.result;
  return {
    threw: call.threw,
    ok: readPath(result, ['ok']),
    error: readPath(result, ['error']),
    presentationProjection: readPath(result, ['data', 'presentationProjection']),
    projectionMode: readPath(result, ['data', 'presentationModel', 'projectionMode']),
    absenceEntries: readPath(result, ['data', 'presentationModel', 'absenceEntries']),
  };
}

function observeInvalidPolicy(call) {
  const result = call.result;
  const params = readPath(result, ['error', 'params']);
  return {
    threw: call.threw,
    ok: readPath(result, ['ok']),
    data: readPath(result, ['data']),
    errorCode: readPath(result, ['error', 'code']),
    errorParams: clone(params),
    errorParamKeys: isPlainObject(params) ? Object.keys(params).sort() : absentPath(),
    productionAllowed: readPath(result, ['productionAllowed']),
  };
}

function observeCounts(call) {
  const result = call.result;
  return {
    threw: call.threw,
    ok: readPath(result, ['ok']),
    rawCount: readPath(result, ['data', 'presentationProjection', 'rawCount']),
    validRawCount: readPath(result, ['data', 'presentationProjection', 'validRawCount']),
    filteredCount: readPath(result, ['data', 'presentationProjection', 'filteredCount']),
    evaluatedCandidatesLength: Array.isArray(readPath(result, ['data', 'evaluatedCandidates']))
      ? readPath(result, ['data', 'evaluatedCandidates']).length : absentPath(),
    candidateAlternativesLength: Array.isArray(readPath(result, ['data', 'candidateAlternatives']))
      ? readPath(result, ['data', 'candidateAlternatives']).length : absentPath(),
    presentationOrderLength: Array.isArray(readPath(result, ['data', 'presentationOrder']))
      ? readPath(result, ['data', 'presentationOrder']).length : absentPath(),
    cardsLength: Array.isArray(readPath(result, ['data', 'presentationModel', 'cards']))
      ? readPath(result, ['data', 'presentationModel', 'cards']).length : absentPath(),
  };
}

function makeDefinition(reportNumber, caseNumber, inputFactory, expected, observe, verify) {
  return {
    reportId: `MPS-CORE-${String(reportNumber).padStart(2, '0')}`,
    caseId: `MPS-CORE-${String(reportNumber).padStart(2, '0')}-CASE-${String(caseNumber).padStart(2, '0')}`,
    inputFactory,
    expected: clone(expected),
    observe,
    verify,
  };
}

function exactVerifier(expected) {
  return (observed) => isDeepStrictEqual(observed, expected);
}

function buildDefinitions() {
  const definitions = [];
  const addExact = (report, caseNumber, inputFactory, expected, observer) => {
    definitions.push(makeDefinition(report, caseNumber, inputFactory, expected, observer, exactVerifier(expected)));
  };

  const legacyExpected = {
    threw: false,
    ok: true,
    error: null,
    presentationProjection: absentPath(),
    projectionMode: absentPath(),
    absenceEntries: absentPath(),
  };
  addExact(1, 1, () => legacyInput('omitted'), legacyExpected, (_enumerate, fixture) => observeLegacy(invoke(_enumerate, fixture)));
  addExact(1, 2, () => legacyInput('null'), legacyExpected, (_enumerate, fixture) => observeLegacy(invoke(_enumerate, fixture)));

  const invalidPolicies = [
    'MINIMUM_PASSING_PER_SECTION',
    { ...POLICY, extra: true },
    { ...POLICY, mode: 'ALL_VALID_LEGACY' },
    { ...POLICY, confirmed: false },
    { ...POLICY, provenance: 'ASSUMPTION_ONLY' },
  ];
  const invalidExpected = {
    threw: false,
    ok: false,
    data: null,
    errorCode: 'PRESENTATION_POLICY_INVALID',
    errorParams: { path: '$.presentationPolicy', reason: 'unsupported_or_unconfirmed_policy' },
    errorParamKeys: ['path', 'reason'],
    productionAllowed: false,
  };
  invalidPolicies.forEach((policy, index) => addExact(2, index + 1, () => {
    const input = baseInput();
    input.presentationPolicy = clone(policy);
    return input;
  }, invalidExpected, (_enumerate, fixture) => observeInvalidPolicy(invoke(_enumerate, fixture))));

  [
    { limit: 10, raw: 60, valid: 24, filtered: 6 },
    { limit: 7, raw: 42, valid: 8, filtered: 4 },
  ].forEach((item, index) => {
    const expected = {
      threw: false, ok: true,
      rawCount: item.raw, validRawCount: item.valid, filteredCount: item.filtered,
      evaluatedCandidatesLength: item.raw, candidateAlternativesLength: item.valid,
      presentationOrderLength: item.filtered, cardsLength: item.filtered,
    };
    addExact(3, index + 1, () => policyInput(item.limit), expected,
      (_enumerate, fixture) => observeCounts(invoke(_enumerate, fixture)));
  });

  SECTIONS.forEach((section, index) => {
    const expected = expectedMinimumItem(section, 10);
    addExact(4, index + 1, () => policyInput(10), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      const items = readPath(result, ['data', 'presentationProjection', 'minimumPassingBySection']);
      return Array.isArray(items)
        ? clone(items.find((item) => readPath(item, ['section_mm2']) === section) || absentPath())
        : absentPath();
    });
  });

  SECTIONS.forEach((section, index) => {
    const expected = expectedMinimumItem(section, 7);
    addExact(5, index + 1, () => policyInput(7), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      const items = readPath(result, ['data', 'presentationProjection', 'minimumPassingBySection']);
      return Array.isArray(items)
        ? clone(items.find((item) => readPath(item, ['section_mm2']) === section) || absentPath())
        : absentPath();
    });
  });

  [
    { id: '4x300', status: 'REJECTED', evaluated: true, rejected: true, rawValid: false, visible: false, hidden: false },
    { id: '5x300', status: 'VALID', evaluated: true, rejected: false, rawValid: true, visible: true, hidden: false },
    { id: '6x300', status: 'VALID', evaluated: true, rejected: false, rawValid: true, visible: false, hidden: true },
    { id: '7x300', status: 'VALID', evaluated: true, rejected: false, rawValid: true, visible: false, hidden: true },
  ].forEach((item, index) => {
    const expected = clone(item);
    addExact(6, index + 1, () => policyInput(7), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      const evaluated = candidateAt(result, 'evaluatedCandidates', item.id);
      const visible = scalarArrayAt(result, ['data', 'presentationProjection', 'visibleCandidateIds']);
      const hidden = scalarArrayAt(result, ['data', 'presentationProjection', 'hiddenCandidateIds']);
      return {
        id: item.id,
        status: readPath(evaluated, ['status']),
        evaluated: !isDeepStrictEqual(evaluated, ABSENT_PATH),
        rejected: !isDeepStrictEqual(candidateAt(result, 'rejectedCandidates', item.id), ABSENT_PATH),
        rawValid: !isDeepStrictEqual(candidateAt(result, 'candidateAlternatives', item.id), ABSENT_PATH),
        visible: Array.isArray(visible) ? visible.includes(item.id) : absentPath(),
        hidden: Array.isArray(hidden) ? hidden.includes(item.id) : absentPath(),
      };
    });
  });

  let universeCase = 0;
  for (let nParallel = 1; nParallel <= 10; nParallel += 1) {
    SECTIONS.forEach((section) => {
      universeCase += 1;
      const candidateId = `${nParallel}x${section}`;
      const expected = {
        rawCount: 60,
        candidate: { candidateId, section_mm2: section, nParallel, l0CallCount: 1 },
        occurrenceCount: 1,
      };
      addExact(7, universeCase, () => policyInput(10), expected, (_enumerate, fixture) => {
        const result = invoke(_enumerate, fixture).result;
        const list = readPath(result, ['data', 'evaluatedCandidates']);
        const matches = Array.isArray(list)
          ? list.filter((candidateItem) => readPath(candidateItem, ['candidateId']) === candidateId) : [];
        const found = matches.length === 1 ? matches[0] : absentPath();
        return {
          rawCount: Array.isArray(list) ? list.length : absentPath(),
          candidate: {
            candidateId: readPath(found, ['candidateId']),
            section_mm2: readPath(found, ['section_mm2']),
            nParallel: readPath(found, ['nParallel']),
            l0CallCount: readPath(found, ['l0CallCount']),
          },
          occurrenceCount: Array.isArray(list) ? matches.length : absentPath(),
        };
      });
    });
  }

  OBJECTIVES.forEach((objective, index) => {
    const expected = {
      presentationOrder: clone(DEFAULT_ORDERS[objective]),
      cardOrder: clone(DEFAULT_ORDERS[objective]),
      firstInPresentationOrder: DEFAULT_ORDERS[objective][0],
    };
    addExact(8, index + 1, () => policyInput(10, objective), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      return {
        presentationOrder: idsAt(result, ['data', 'presentationOrder']),
        cardOrder: idsAt(result, ['data', 'presentationModel', 'cards']),
        firstInPresentationOrder: readPath(result, ['data', 'firstInPresentationOrder', 'candidateId']),
      };
    });
  });

  OBJECTIVES.forEach((objective, index) => {
    const expected = {
      presentationOrder: clone(LIMIT7_ORDERS[objective]),
      cardOrder: clone(LIMIT7_ORDERS[objective]),
      firstInPresentationOrder: LIMIT7_ORDERS[objective][0],
    };
    addExact(9, index + 1, () => policyInput(7, objective), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      return {
        presentationOrder: idsAt(result, ['data', 'presentationOrder']),
        cardOrder: idsAt(result, ['data', 'presentationModel', 'cards']),
        firstInPresentationOrder: readPath(result, ['data', 'firstInPresentationOrder', 'candidateId']),
      };
    });
  });

  DEFAULT_HIDDEN.forEach((candidateId, index) => {
    const expected = {
      hiddenCount: 18, hiddenAtIndex: candidateId,
      inCandidateAlternatives: true, inVisibleCandidateIds: false,
    };
    addExact(10, index + 1, () => policyInput(10), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      const hidden = scalarArrayAt(result, ['data', 'presentationProjection', 'hiddenCandidateIds']);
      const visible = scalarArrayAt(result, ['data', 'presentationProjection', 'visibleCandidateIds']);
      return {
        hiddenCount: Array.isArray(hidden) ? hidden.length : absentPath(),
        hiddenAtIndex: Array.isArray(hidden) ? readPath(hidden, [index]) : absentPath(),
        inCandidateAlternatives: !isDeepStrictEqual(candidateAt(result, 'candidateAlternatives', candidateId), ABSENT_PATH),
        inVisibleCandidateIds: Array.isArray(visible) ? visible.includes(candidateId) : absentPath(),
      };
    });
  });

  LIMIT7_HIDDEN.forEach((candidateId, index) => {
    const expected = { hiddenCount: 4, hiddenAtIndex: candidateId, inCandidateAlternatives: true, inVisibleCandidateIds: false };
    addExact(11, index + 1, () => policyInput(7), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      const hidden = scalarArrayAt(result, ['data', 'presentationProjection', 'hiddenCandidateIds']);
      const visible = scalarArrayAt(result, ['data', 'presentationProjection', 'visibleCandidateIds']);
      return {
        hiddenCount: Array.isArray(hidden) ? hidden.length : absentPath(),
        hiddenAtIndex: Array.isArray(hidden) ? readPath(hidden, [index]) : absentPath(),
        inCandidateAlternatives: !isDeepStrictEqual(candidateAt(result, 'candidateAlternatives', candidateId), ABSENT_PATH),
        inVisibleCandidateIds: Array.isArray(visible) ? visible.includes(candidateId) : absentPath(),
      };
    });
  });

  [1, 3].forEach((nCircuits, index) => {
    const expected = {
      nCircuits,
      rawCandidateIds: exactCandidateIds(10),
      minimumPassingBySection: SECTIONS.map((section) => expectedMinimumItem(section, 10)),
      visibleCandidateIds: SECTIONS.map((section) => DEFAULT_MINIMUMS[section]),
    };
    addExact(12, index + 1, () => policyInput(10, 'NONE', nCircuits), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      return {
        nCircuits,
        rawCandidateIds: idsAt(result, ['data', 'evaluatedCandidates']),
        minimumPassingBySection: objectAt(result, ['data', 'presentationProjection', 'minimumPassingBySection']),
        visibleCandidateIds: objectAt(result, ['data', 'presentationProjection', 'visibleCandidateIds']),
      };
    });
  });

  addExact(13, 1, () => policyInput(10), { inputUnchanged: true, candidateThrew: false }, (_enumerate, fixture) => {
    const before = clone(fixture);
    const call = invoke(_enumerate, fixture);
    return { inputUnchanged: isDeepStrictEqual(fixture, before), candidateThrew: call.threw };
  });
  addExact(13, 2, () => policyInput(10), { deterministic: true, firstThrew: false, secondThrew: false }, (_enumerate, fixture) => {
    const first = invoke(_enumerate, clone(fixture));
    const second = invoke(_enumerate, clone(fixture));
    return { deterministic: isDeepStrictEqual(first.result, second.result), firstThrew: first.threw, secondThrew: second.threw };
  });
  addExact(13, 3, () => ({ policy: policyInput(10), legacy: (() => { const input = baseInput(); return input; })() }), {
    evaluatedEqual: true, alternativesEqual: true, rejectedEqual: true,
    evaluatedLength: 60, alternativesLength: 24, rejectedLength: 36,
  }, (_enumerate, fixture) => {
    const policyResult = invoke(_enumerate, fixture.policy).result;
    const legacyResult = invoke(_enumerate, fixture.legacy).result;
    const policyEvaluated = readPath(policyResult, ['data', 'evaluatedCandidates']);
    const legacyEvaluated = readPath(legacyResult, ['data', 'evaluatedCandidates']);
    const policyAlternatives = readPath(policyResult, ['data', 'candidateAlternatives']);
    const legacyAlternatives = readPath(legacyResult, ['data', 'candidateAlternatives']);
    const policyRejected = readPath(policyResult, ['data', 'rejectedCandidates']);
    const legacyRejected = readPath(legacyResult, ['data', 'rejectedCandidates']);
    return {
      evaluatedEqual: isDeepStrictEqual(policyEvaluated, legacyEvaluated),
      alternativesEqual: isDeepStrictEqual(policyAlternatives, legacyAlternatives),
      rejectedEqual: isDeepStrictEqual(policyRejected, legacyRejected),
      evaluatedLength: Array.isArray(policyEvaluated) ? policyEvaluated.length : absentPath(),
      alternativesLength: Array.isArray(policyAlternatives) ? policyAlternatives.length : absentPath(),
      rejectedLength: Array.isArray(policyRejected) ? policyRejected.length : absentPath(),
    };
  });
  addExact(13, 4, () => ({ policy: policyInput(10), legacy: baseInput() }), {
    frontierEqual: true, policyFrontierIsRawSubset: true,
  }, (_enumerate, fixture) => {
    const policyResult = invoke(_enumerate, fixture.policy).result;
    const legacyResult = invoke(_enumerate, fixture.legacy).result;
    const policyFrontier = readPath(policyResult, ['data', 'nonDominatedAlternatives']);
    const legacyFrontier = readPath(legacyResult, ['data', 'nonDominatedAlternatives']);
    const rawIds = idsAt(policyResult, ['data', 'candidateAlternatives']);
    const frontierIds = idsAt(policyResult, ['data', 'nonDominatedAlternatives']);
    return {
      frontierEqual: isDeepStrictEqual(policyFrontier, legacyFrontier),
      policyFrontierIsRawSubset: Array.isArray(rawIds) && Array.isArray(frontierIds)
        ? frontierIds.every((candidateId) => rawIds.includes(candidateId)) : false,
    };
  });

  addExact(14, 1, () => policyInput(7), {
    projectionClosed: true, itemSchemasClosed: true, rangeSchemasClosed: true,
    visibleUnique: true, hiddenUnique: true, noPassingUnique: true,
  }, (_enumerate, fixture) => {
    const result = invoke(_enumerate, fixture).result;
    const projection = readPath(result, ['data', 'presentationProjection']);
    const items = readPath(projection, ['minimumPassingBySection']);
    const visible = readPath(projection, ['visibleCandidateIds']);
    const hidden = readPath(projection, ['hiddenCandidateIds']);
    const noPassing = readPath(projection, ['noPassingSections_mm2']);
    return {
      projectionClosed: exactKeys(projection, [
        'mode', 'rawCount', 'validRawCount', 'filteredCount', 'minimumPassingBySection',
        'visibleCandidateIds', 'hiddenCandidateIds', 'noPassingSections_mm2',
      ]),
      itemSchemasClosed: Array.isArray(items) && items.length === 6
        && items.every((item) => exactKeys(item, ['section_mm2', 'candidateId', 'status', 'evaluatedRange'])),
      rangeSchemasClosed: Array.isArray(items)
        && items.every((item) => exactKeys(readPath(item, ['evaluatedRange']), ['minimum', 'maximum'])),
      visibleUnique: Array.isArray(visible) && new Set(visible).size === visible.length,
      hiddenUnique: Array.isArray(hidden) && new Set(hidden).size === hidden.length,
      noPassingUnique: Array.isArray(noPassing) && new Set(noPassing).size === noPassing.length,
    };
  });
  addExact(14, 2, () => policyInput(7), {
    topLevelClosed: true, dataClosed: true, presentationModelClosed: true,
    absenceEntriesClosed: true, ok: true, classification: 'MATHEMATICAL_ONLY', error: null,
  }, (_enumerate, fixture) => {
    const result = invoke(_enumerate, fixture).result;
    const data = readPath(result, ['data']);
    const model = readPath(data, ['presentationModel']);
    const absences = readPath(model, ['absenceEntries']);
    return {
      topLevelClosed: exactKeys(result, [
        'ok', 'classification', 'data', 'assumptions', 'blockers', 'warnings',
        'sourceStatus', 'productionAllowed', 'displayNotice', 'error',
      ]),
      dataClosed: exactKeys(data, [
        'contractVersion', 'analysisMode', 'objective', 'universe', 'evaluatedCandidates',
        'candidateAlternatives', 'rejectedCandidates', 'nonDominatedAlternatives',
        'presentationOrder', 'firstInPresentationOrder', 'objectiveDisposition',
        'providedCombination', 'installableSelection', 'discreteSelectionBlocked',
        'installationAuthorized', 'presentationModel', 'presentationProjection',
      ]),
      presentationModelClosed: exactKeys(model, [
        'notice', 'objective', 'analysisMode', 'installationAuthorized', 'heading',
        'cards', 'projectionMode', 'absenceEntries',
      ]),
      absenceEntriesClosed: Array.isArray(absences) && absences.every((entry) => (
        exactKeys(entry, ['section_mm2', 'messageKey', 'messageArgs'])
        && exactKeys(readPath(entry, ['messageArgs']), ['section_mm2', 'minimum', 'maximum'])
      )),
      ok: readPath(result, ['ok']),
      classification: readPath(result, ['classification']),
      error: readPath(result, ['error']),
    };
  });
  addExact(14, 3, () => ({ omitted: legacyInput('omitted'), nullPolicy: legacyInput('null') }), {
    omitted: { presentationProjectionAbsent: true, projectionModeAbsent: true, absenceEntriesAbsent: true },
    nullPolicy: { presentationProjectionAbsent: true, projectionModeAbsent: true, absenceEntriesAbsent: true },
  }, (_enumerate, fixture) => {
    const observeAbsence = (input) => {
      const result = invoke(_enumerate, input).result;
      return {
        presentationProjectionAbsent: isDeepStrictEqual(readPath(result, ['data', 'presentationProjection']), ABSENT_PATH),
        projectionModeAbsent: isDeepStrictEqual(readPath(result, ['data', 'presentationModel', 'projectionMode']), ABSENT_PATH),
        absenceEntriesAbsent: isDeepStrictEqual(readPath(result, ['data', 'presentationModel', 'absenceEntries']), ABSENT_PATH),
      };
    };
    return { omitted: observeAbsence(fixture.omitted), nullPolicy: observeAbsence(fixture.nullPolicy) };
  });

  SECTIONS.forEach((section, index) => {
    const rawValid = validIdsForSection(section, 10);
    const visible = [DEFAULT_MINIMUMS[section]];
    const hidden = rawValid.slice(1);
    const expected = {
      section_mm2: section,
      visibleCandidateIds: visible,
      hiddenCandidateIds: hidden,
      rawValidCandidateIds: rawValid,
      disjoint: true,
      complete: true,
    };
    addExact(15, index + 1, () => policyInput(10), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      const rawIds = candidateIdsForSection(result, 'candidateAlternatives', section);
      const allVisible = scalarArrayAt(result, ['data', 'presentationProjection', 'visibleCandidateIds']);
      const allHidden = scalarArrayAt(result, ['data', 'presentationProjection', 'hiddenCandidateIds']);
      const visibleIds = Array.isArray(allVisible) && Array.isArray(rawIds)
        ? rawIds.filter((candidateId) => allVisible.includes(candidateId)) : absentPath();
      const hiddenIds = Array.isArray(allHidden) && Array.isArray(rawIds)
        ? rawIds.filter((candidateId) => allHidden.includes(candidateId)) : absentPath();
      const disjoint = Array.isArray(visibleIds) && Array.isArray(hiddenIds)
        ? visibleIds.every((candidateId) => !hiddenIds.includes(candidateId)) : false;
      const complete = Array.isArray(visibleIds) && Array.isArray(hiddenIds) && Array.isArray(rawIds)
        ? isDeepStrictEqual([...visibleIds, ...hiddenIds], rawIds) : false;
      return {
        section_mm2: section,
        visibleCandidateIds: visibleIds,
        hiddenCandidateIds: hiddenIds,
        rawValidCandidateIds: rawIds,
        disjoint,
        complete,
      };
    });
  });

  OBJECTIVES.forEach((objective, index) => {
    const expected = {
      productionAllowed: false,
      installableSelection: null,
      installationAuthorized: false,
      permanentGuardCodes: clone(PERMANENT_GUARD_CODES),
      permanentGuardCounts: [1, 1, 1, 1, 1, 1],
      error: null,
    };
    addExact(16, index + 1, () => policyInput(10, objective), expected, (_enumerate, fixture) => {
      const result = invoke(_enumerate, fixture).result;
      const blockers = readPath(result, ['blockers']);
      const codes = Array.isArray(blockers) ? blockers.map((item) => readPath(item, ['code'])) : absentPath();
      return {
        productionAllowed: readPath(result, ['productionAllowed']),
        installableSelection: readPath(result, ['data', 'installableSelection']),
        installationAuthorized: readPath(result, ['data', 'installationAuthorized']),
        permanentGuardCodes: Array.isArray(codes) ? codes.slice(0, 6) : absentPath(),
        permanentGuardCounts: Array.isArray(codes)
          ? PERMANENT_GUARD_CODES.map((code) => codes.filter((item) => item === code).length) : absentPath(),
        error: readPath(result, ['error']),
      };
    });
  });

  return definitions;
}

function validateDefinitions(definitions) {
  const issues = [];
  if (!Array.isArray(definitions) || definitions.length !== EXPECTED_CASES) issues.push('definition_count');
  const observedCaseIds = definitions.map((definition) => definition.caseId);
  const expectedCaseIds = [];
  CASE_COUNTS.forEach((count, reportIndex) => {
    for (let caseIndex = 1; caseIndex <= count; caseIndex += 1) {
      expectedCaseIds.push(`MPS-CORE-${String(reportIndex + 1).padStart(2, '0')}-CASE-${String(caseIndex).padStart(2, '0')}`);
    }
  });
  if (!isDeepStrictEqual(observedCaseIds, expectedCaseIds)) issues.push('definition_case_ids');
  if (new Set(observedCaseIds).size !== EXPECTED_CASES) issues.push('definition_case_id_uniqueness');
  definitions.forEach((definition) => {
    if (typeof definition.inputFactory !== 'function') issues.push(`${definition.caseId}.inputFactory`);
    if (typeof definition.observe !== 'function') issues.push(`${definition.caseId}.observe`);
    if (typeof definition.verify !== 'function') issues.push(`${definition.caseId}.verify`);
    if (!isPlainObject(definition.expected) && !Array.isArray(definition.expected)) issues.push(`${definition.caseId}.expected`);
  });
  return issues;
}

function executeDefinition(enumerate, definition, harnessErrors) {
  let observed;
  let compliant = false;
  try {
    const fixture = definition.inputFactory();
    observed = definition.observe(enumerate, fixture);
    compliant = definition.verify(observed) === true;
  } catch (error) {
    observed = {
      harnessError: {
        name: error && error.name ? String(error.name) : 'Error',
        message: error && error.message ? String(error.message) : String(error),
      },
    };
    harnessErrors.push({ caseId: definition.caseId, ...observed.harnessError });
  }
  return {
    caseId: definition.caseId,
    expected: clone(definition.expected),
    observed: clone(observed),
    assertionExercised: true,
    compliant,
  };
}

function buildReports(definitions, enumerate, harnessErrors) {
  return EXPECTED_IDS.map((id, reportIndex) => {
    const reportDefinitions = definitions.filter((definition) => definition.reportId === id);
    const cases = reportDefinitions.map((definition) => executeDefinition(enumerate, definition, harnessErrors));
    const issues = cases.filter((item) => item.compliant !== true).map((item) => ({
      caseId: item.caseId,
      expected: clone(item.expected),
      observed: clone(item.observed),
    }));
    const compliant = cases.length === CASE_COUNTS[reportIndex] && issues.length === 0;
    return {
      id,
      category: CATEGORY,
      classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
      compliant,
      assertionExercised: cases.length === CASE_COUNTS[reportIndex]
        && cases.every((item) => item.assertionExercised === true),
      expected: {
        contract: REPORT_CONTRACTS[reportIndex],
        cases: CASE_COUNTS[reportIndex],
        caseIds: reportDefinitions.map((definition) => definition.caseId),
      },
      observed: { cases },
      issues,
    };
  });
}

function validateProtocol(reports) {
  const issues = [];
  const reportKeys = [
    'id', 'category', 'classification', 'compliant', 'assertionExercised',
    'expected', 'observed', 'issues',
  ];
  const caseKeys = ['caseId', 'expected', 'observed', 'assertionExercised', 'compliant'];
  if (reports.length !== EXPECTED_REPORTS) issues.push('report_count');
  if (!isDeepStrictEqual(reports.map((report) => report.id), EXPECTED_IDS)) issues.push('report_ids');
  if (new Set(reports.map((report) => report.id)).size !== EXPECTED_REPORTS) issues.push('report_id_uniqueness');
  let observedCases = 0;
  const allCaseIds = [];
  reports.forEach((report, reportIndex) => {
    if (!exactKeys(report, reportKeys)) issues.push(`${report.id}.schema`);
    if (report.category !== CATEGORY) issues.push(`${report.id}.category`);
    if (!isPlainObject(report.expected) || !exactKeys(report.observed, ['cases']) || !Array.isArray(report.issues)) {
      issues.push(`${report.id}.payload_schema`);
    }
    const cases = readPath(report, ['observed', 'cases']);
    if (!Array.isArray(cases) || cases.length !== CASE_COUNTS[reportIndex]) {
      issues.push(`${report.id}.case_count`);
      return;
    }
    observedCases += cases.length;
    cases.forEach((item, caseIndex) => {
      const expectedCaseId = `${report.id}-CASE-${String(caseIndex + 1).padStart(2, '0')}`;
      allCaseIds.push(item.caseId);
      if (item.caseId !== expectedCaseId) issues.push(`${report.id}.case_order`);
      if (!exactKeys(item, caseKeys)) issues.push(`${item.caseId}.schema`);
      if (item.assertionExercised !== true) issues.push(`${item.caseId}.assertionExercised`);
    });
    const expectedCompliant = cases.every((item) => item.compliant === true);
    if (report.compliant !== expectedCompliant) issues.push(`${report.id}.compliant`);
    if (report.classification !== (expectedCompliant ? 'PASS' : 'FUNCTIONAL_FAILURE')) {
      issues.push(`${report.id}.classification`);
    }
    if (report.assertionExercised !== cases.every((item) => item.assertionExercised === true)) {
      issues.push(`${report.id}.assertionExercised`);
    }
  });
  if (observedCases !== EXPECTED_CASES) issues.push('case_count');
  if (new Set(allCaseIds).size !== observedCases) issues.push('case_id_uniqueness');
  return issues;
}

function summaryFor(reports, classification, processExitCode) {
  const cases = reports.flatMap((report) => (
    report && report.observed && Array.isArray(report.observed.cases) ? report.observed.cases : []
  ));
  return {
    classification,
    reports: reports.length,
    expectedReports: EXPECTED_REPORTS,
    cases: cases.length,
    expectedCases: EXPECTED_CASES,
    compliant: reports.filter((report) => report.compliant === true).length,
    nonCompliant: reports.filter((report) => report.compliant !== true).length,
    assertionsExercised: reports.filter((report) => report.assertionExercised === true).length,
    caseAssertionsExercised: cases.filter((item) => item.assertionExercised === true).length,
    processExitCode,
  };
}

function emitBarrierConfigurationError(reason, details) {
  const summary = {
    classification: 'CONFIG_ERROR',
    reports: 0,
    expectedReports: EXPECTED_REPORTS,
    cases: 0,
    expectedCases: EXPECTED_CASES,
    compliant: 0,
    nonCompliant: 0,
    assertionsExercised: 0,
    caseAssertionsExercised: 0,
    processExitCode: 3,
  };
  process.stderr.write(`CONFIG_ERROR ${reason} ${JSON.stringify(details)}\n`);
  process.stdout.write(`${SUMMARY_PREFIX}${JSON.stringify(summary)}\n`);
  process.exitCode = 3;
}

function main() {
  let enumerate;
  try {
    const moduleExports = require(MODULE_PATH);
    enumerate = moduleExports && moduleExports.enumerateCablingBTParallelAlternativesExperimental;
    if (typeof enumerate !== 'function') throw new TypeError('expected export is not a function');
  } catch (error) {
    emitBarrierConfigurationError('candidate_module_unavailable', {
      name: error && error.name ? String(error.name) : 'Error',
      message: error && error.message ? String(error.message) : String(error),
    });
    return;
  }

  let definitions;
  try {
    definitions = buildDefinitions();
  } catch (error) {
    emitBarrierConfigurationError('definition_build_failed', {
      name: error && error.name ? String(error.name) : 'Error',
      message: error && error.message ? String(error.message) : String(error),
    });
    return;
  }
  const definitionIssues = validateDefinitions(definitions);
  if (definitionIssues.length > 0) {
    emitBarrierConfigurationError('definition_protocol_invalid', definitionIssues);
    return;
  }

  const harnessErrors = [];
  const reports = buildReports(definitions, enumerate, harnessErrors);
  const protocolIssues = validateProtocol(reports);
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX}${JSON.stringify(report)}\n`));

  let classification;
  let processExitCode;
  if (protocolIssues.length > 0 || harnessErrors.length > 0) {
    classification = 'CONFIG_ERROR';
    processExitCode = 3;
    process.stderr.write(`CONFIG_ERROR protocol=${JSON.stringify(protocolIssues)} harness=${JSON.stringify(harnessErrors)}\n`);
  } else if (reports.every((report) => report.compliant === true)) {
    classification = 'PASS';
    processExitCode = 0;
  } else {
    classification = 'FUNCTIONAL_FAILURE';
    processExitCode = 1;
  }
  const summary = summaryFor(reports, classification, processExitCode);
  process.stdout.write(`${SUMMARY_PREFIX}${JSON.stringify(summary)}\n`);
  process.exitCode = processExitCode;
}

try {
  main();
} catch (error) {
  emitBarrierConfigurationError('unexpected_harness_exception', {
    name: error && error.name ? String(error.name) : 'Error',
    message: error && error.message ? String(error.message) : String(error),
  });
}
