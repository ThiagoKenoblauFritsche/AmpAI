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
  return JSON.parse(JSON.stringify(value, jsonReplacer));
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

function contract(id, category, contractName, cases, invariants = []) {
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
    cases,
  };
}

const scientific = [
  contract('KG-01', 'scientific', 'candidate-specific grouping data are complete and traceable', one('KG-01', { mode: 'CANDIDATE_SPECIFIC', required: ['value', 'source', 'sourceVersion', 'method', 'arrangement', 'nParallel', 'nCircuits', 'provenance'] }), ['no grouping derivation']),
  contract('KG-02', 'scientific', 'grouping matrix rejects a missing combination', one('KG-02', { mode: 'GROUPING_MATRIX', errorCode: 'GROUPING_MATRIX_COMBINATION_MISSING' })),
  contract('KG-03', 'scientific', 'confirmed laboratory grouping constant remains assumption-only', one('KG-03', { mode: 'LAB_CONSTANT_CONFIRMED', value: 0.8, confirmed: true, provenance: 'ASSUMPTION_ONLY' })),
  contract('KG-04', 'scientific', 'unconfirmed laboratory grouping constant blocks calculation', one('KG-04', { errorCode: 'GROUPING_FACTOR_UNCONFIRMED' })),

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
  contract('TECH-03', 'technical', 'contract version is mandatory and exact', matrix('TECH-03', ['missing', 'wrong'], (state) => ({ state, expectedVersion: CONTRACT_VERSION, errorCode: 'CONTRACT_VERSION_INVALID' }))),
  contract('TECH-04', 'technical', 'global numeric fields reject invalid types and domains', matrix('TECH-04', [
    ['totalLoadCurrent_A', 'string'], ['totalLoadCurrent_A', 'NaN'], ['lineVoltage_V', 'Infinity'],
    ['maximumVoltageDrop_percent', 'zero'], ['maxParallelCount', 'fractional'], ['nCircuits', 'zero'],
    ['fault.totalFaultCurrent_A', 'negative'], ['fault.clearingTime_s', 'boolean'],
  ], ([field, invalid]) => ({ field, invalid, errorCode: 'GLOBAL_VALUE_INVALID' }))),
  contract('TECH-05', 'technical', 'analysis mode is a closed enumeration', matrix('TECH-05', ['missing', 'UNKNOWN_MODE'], (value) => ({ value, allowed: ['MODO_GUIADO_PRELIMINAR', 'MODO_AVANCADO_PRELIMINAR'], errorCode: 'ANALYSIS_MODE_INVALID' }))),
  contract('TECH-06', 'technical', 'objective is a closed enumeration', matrix('TECH-06', ['missing', 'UNKNOWN_OBJECTIVE'], (value) => ({ value, allowed: ['NONE', 'MIN_PARALLEL_COUNT', 'MIN_TOTAL_COPPER', 'MAX_MINIMUM_MARGIN'], errorCode: 'OBJECTIVE_INVALID' }))),
  contract('TECH-07', 'technical', 'catalog mode is a closed enumeration', one('TECH-07', { invalidMode: 'UNKNOWN_CATALOG', errorCode: 'CATALOG_MODE_INVALID' })),
  contract('TECH-08', 'technical', 'grouping mode is a closed enumeration', one('TECH-08', { invalidMode: 'UNKNOWN_GROUPING', allowed: ['CANDIDATE_SPECIFIC', 'GROUPING_MATRIX', 'LAB_CONSTANT_CONFIRMED'], errorCode: 'GROUPING_MODE_INVALID' })),
  contract('TECH-09', 'technical', 'identified secondary catalog requires traceability', matrix('TECH-09', ['source', 'sourceVersion', 'provenance'], (field) => ({ mode: 'CATALOGO_SECUNDARIO_IDENTIFICADO', removedField: field, errorCode: 'CATALOG_TRACEABILITY_MISSING' }))),
  contract('TECH-10', 'technical', 'all required confirmations fail closed', matrix('TECH-10', [
    'catalog_lab_confirmation', 'grouping_lab_confirmation', 'guided_hypothesis_confirmation',
    'suggested_power_factor_confirmation', 'suggested_reference_temperature_confirmation',
  ], (confirmation) => ({ confirmation, confirmed: false, blocked: true }))),
  contract('TECH-11', 'technical', 'authorized pruning precedes universe construction and is recorded', one('TECH-11', { maximumSection_mm2: 185, pruningConfirmed: true, pruningBeforeUniverse: true, nominallyRecorded: true })),
  contract('TECH-12', 'technical', 'unconfirmed pruning suggestion blocks', one('TECH-12', { maximumSection_mm2: 185, pruningConfirmed: false, errorCode: 'PRUNING_UNCONFIRMED' })),
  contract('TECH-13', 'technical', 'catalog item structure is closed and plain', matrix('TECH-13', ['not_plain_object', 'unknown_property', 'invalid_required_structure'], (defect) => ({ defect, errorCode: 'CANDIDATE_STRUCTURE_INVALID' }))),
  contract('TECH-14', 'technical', 'catalog is homogeneous and candidate identities are unique', matrix('TECH-14', [
    ['mixed_material', 'CATALOG_HETEROGENEOUS'], ['mixed_insulation', 'CATALOG_HETEROGENEOUS'],
    ['mixed_installation_method', 'CATALOG_HETEROGENEOUS'], ['duplicate_section', 'CATALOG_SECTION_DUPLICATED'],
    ['candidate_id_uniqueness', 'PASS'], ['reference_temperature_unit', 'degC'],
  ], ([condition, expected]) => ({ condition, expected }))),
  contract('TECH-15', 'technical', 'grouping factor domain is finite and within zero-one interval', matrix('TECH-15', ['zero', 'negative', 'greater_than_one', 'NaN', 'Infinity'], (invalid) => ({ invalid, errorCode: 'GROUPING_FACTOR_INVALID' }))),
  contract('TECH-16', 'technical', 'advanced mode accepts explicit branches and described geometry only', matrix('TECH-16', ['explicit_branch_set_per_combination', 'geometry_description_without_impedance_derivation'], (condition) => ({ condition, analysisMode: 'MODO_AVANCADO_PRELIMINAR', accepted: true }))),
  contract('TECH-17', 'technical', 'advanced branch map is validated exhaustively', matrix('TECH-17', [
    'map_not_array', 'combination_missing', 'description_missing', 'branch_count_mismatch',
    'branch_id_duplicate', 'branch_impedance_invalid', 'branch_provenance_invalid',
  ], (defect) => ({ defect, errorCode: 'ADVANCED_BRANCHES_INVALID' }))),
  contract('TECH-18', 'technical', 'provided combination must reference the evaluated universe', matrix('TECH-18', [
    ['section_absent', 'PROVIDED_COMBINATION_SECTION_UNKNOWN'],
    ['quantity_invalid', 'PROVIDED_COMBINATION_QUANTITY_INVALID'],
    ['outside_universe', 'PROVIDED_COMBINATION_NOT_EVALUATED'],
  ], ([defect, errorCode]) => ({ defect, errorCode }))),
  contract('TECH-19', 'technical', 'empty results distinguish calculated rejection from blocked evaluation', matrix('TECH-19', [
    ['all_calculated_rejected', 'NO_VALID_CANDIDATE'], ['all_blocked', 'NO_EVALUABLE_CANDIDATE'],
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

if (fs.existsSync(MODULE_PATH)) {
  try {
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
    };
  }

  return {
    id: definition.id,
    category: definition.category,
    classification: 'FUNCTIONAL_FAILURE',
    assertionExercised: true,
    expected: jsonSafe(definition.expected),
    observed: {
      reason: 'implementation_present_contract_evaluation_required',
      module: MODULE_RELATIVE,
      exportName: FUNCTION_NAME,
      callable: typeof enumerate === 'function',
      cases: definition.cases.map((item) => ({
        caseId: item.caseId,
        classification: 'FUNCTIONAL_FAILURE',
        assertionExercised: true,
        compliant: false,
        expected: jsonSafe(item.expected),
        observed: { reason: 'contract_not_yet_satisfied' },
      })),
    },
    compliant: false,
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
        && isPlainObject(caseItem.expected)));
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
