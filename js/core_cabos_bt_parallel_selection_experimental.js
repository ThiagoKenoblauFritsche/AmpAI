'use strict';

/*
 * Motor experimental L1-L3 — Enumeracao e comparacao preliminar de cabos BT em paralelo (LABORATORIO).
 *
 * O.S.: CAB-BT-PARALLEL-002-BACKEND-GREEN-CORE-EXP-R1 (CHG-3 cientifica experimental, Governanca v7.3).
 * Contrato: docs/api/CAB_BT_PARALLEL_SELECTION_EXPERIMENTAL_SDD.md (CAB-BT-PARALLEL-002-SDD-EXP).
 * Ciencia: RNC-P/Memorial/BDD de selecao preliminar, baseline 2b61627d8640fce91eb229ca522ae33a143671df.
 * L0 reutilizado (imutavel): js/core_cabos_bt_parallel_experimental.js @ main 83e24131c0cc09813be65a5fa269961b9cc80c5c.
 *
 * PRELIMINAR — NAO UTILIZAR PARA PROJETO, COMPRA OU INSTALACAO.
 *
 * Enumeracao e comparacao apenas; jamais selecao instalavel. Todo sucesso permanece
 * MATHEMATICAL_ONLY, productionAllowed=false, installableSelection=null e os bloqueios
 * B-01..B-06 persistem. Funcao sincrona, deterministica e pura: zero DOM, camada visual,
 * saida de log, rede, filesystem, relogio, locale implicito, aleatoriedade ou mutacao.
 * Chama o L0 exatamente uma vez por combinacao que o alcanca; nunca recalcula sua matematica.
 * Erros de entrada e dominio retornam Result Pattern (RFC 7807); nunca lancam.
 */

// Dependencia obrigatoria: motor L0 integrado (unica fonte executavel das grandezas L0).
var L0 = require('./core_cabos_bt_parallel_experimental.js');
var calculateCablingBTParallelExperimental = L0.calculateCablingBTParallelExperimental;

var NOTICE = 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO';
var CONTRACT_VERSION = 'CAB-BT-PARALLEL-SELECTION-EXP-1';
var L0_CONTRACT_VERSION = 'CAB-BT-PARALLEL-EXP-1';
var SCIENTIFIC_BASELINE_SHA = '2b61627d8640fce91eb229ca522ae33a143671df';
var L0_SCIENTIFIC_BASELINE_SHA = '18627dd02c94265984aa953d35f47c2745cab61d';
var L0_INTEGRATION_MAIN_SHA = '83e24131c0cc09813be65a5fa269961b9cc80c5c';

var RELATIVE_TOLERANCE = 0.005;
var ZERO_EPSILON = 1e-12;

var ANALYSIS_MODES = ['MODO_GUIADO_PRELIMINAR', 'MODO_AVANCADO'];
var OBJECTIVES = ['NONE', 'MIN_PARALLEL_COUNT', 'MIN_TOTAL_COPPER', 'MAX_MINIMUM_MARGIN'];
var CATALOG_MODES = ['CATALOGO_FORNECIDO_PELO_USUARIO', 'CATALOGO_SECUNDARIO_IDENTIFICADO', 'CATALOGO_LAB_ASSUMPTION_ONLY'];
var GROUPING_MODES = ['CANDIDATE_SPECIFIC', 'GROUPING_MATRIX', 'LAB_CONSTANT_CONFIRMED'];
var CRITERIA_ORDER = ['AMPACIDADE', 'QUEDA', 'CURTO'];

// Escalares obrigatorios do item de catalogo, em ordem canonica (SDD 4.4).
var CANDIDATE_SCALARS = [
  'section_mm2', 'tabulatedAmpacity_A', 'material', 'insulation', 'installationMethod',
  'referenceTemperature_C', 'units', 'source', 'sourceVersion', 'provenance',
];
var CANDIDATE_NUMBER_SCALARS = ['section_mm2', 'tabulatedAmpacity_A', 'referenceTemperature_C'];
var CANDIDATE_STRING_SCALARS = ['material', 'insulation', 'installationMethod', 'units', 'source', 'sourceVersion'];
// Ordem canonica de missingFields[] (SDD 4.4).
var MISSING_FIELD_ORDER = [
  'section_mm2', 'tabulatedAmpacity_A', 'material', 'insulation', 'installationMethod',
  'referenceTemperature_C', 'units', 'source', 'sourceVersion', 'provenance',
  'impedanceRepresentation', 'impedance_ohm.re', 'impedance_ohm.im', 'resistance_ohm', 'reactance_ohm',
];
// Ordem canonica de invalidFields[] (SDD 4.4).
var INVALID_FIELD_ORDER = ['impedance_ohm', 'impedance_ohm.re', 'impedance_ohm.im', 'resistance_ohm', 'reactance_ohm'];
// Homogeneidade obrigatoria do catalogo v1 (SDD 4.4).
var HOMOGENEOUS_FIELDS = ['material', 'insulation', 'installationMethod', 'referenceTemperature_C', 'units'];

// Chaves conhecidas por escopo fechado (SDD 4.3/4.4/JSON Schema); base do INPUT_STRUCTURE_INVALID.
var KNOWN_KEYS = {
  root: [
    'contractVersion', 'analysisMode', 'objective', 'totalLoadCurrent_A', 'lineVoltage_V',
    'powerFactor', 'maximumVoltageDrop_percent', 'maxParallelCount', 'nCircuits', 'arrangement',
    'catalog', 'grouping', 'guidedHypothesis', 'advancedBranchesByCombination', 'fault',
    'pruning', 'providedCombination', 'presentationPolicy',
  ],
  powerFactor: ['value', 'inputClass', 'confirmed', 'provenance'],
  catalog: ['mode', 'confirmed', 'source', 'sourceVersion', 'provenance', 'impedanceBasis', 'candidates'],
  impedanceBasis: ['length_m', 'description', 'provenance'],
  candidate: [
    'section_mm2', 'tabulatedAmpacity_A', 'material', 'insulation', 'installationMethod',
    'referenceTemperature_C', 'units', 'source', 'sourceVersion', 'provenance',
    'impedance_ohm', 'resistance_ohm', 'reactance_ohm',
  ],
  impedance: ['re', 'im'],
  grouping: ['mode', 'value', 'confirmed', 'source', 'sourceVersion', 'provenance', 'entries'],
  guidedHypothesis: ['displayedBeforeCalculation', 'confirmed', 'provenance'],
  advancedEntry: ['candidateId', 'geometryDescription', 'branches'],
  branch: ['id', 'impedance_ohm', 'provenance'],
  fault: ['totalFaultCurrent_A', 'clearingTime_s', 'adiabaticK_A_sqrt_s_per_mm2', 'imbalance'],
  adiabaticK: ['value', 'provenance'],
  imbalance: ['mode', 'deltaFault', 'provenance'],
  pruning: ['maximumSection_mm2', 'confirmed', 'provenance'],
  providedCombination: ['section_mm2', 'nParallel'],
};

// ---------- Helpers puros ----------

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  var prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function round3(value) {
  // Arredondamento nominal apenas para campos de apresentacao/diagnostico (nunca para o calculo).
  return Math.round(value * 1000) / 1000;
}

function approximatelyEqual(a, b) {
  return Math.abs(a - b) <= RELATIVE_TOLERANCE * Math.max(Math.abs(a), Math.abs(b), ZERO_EPSILON);
}

function observedType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'number:NaN';
    if (value === Infinity) return 'number:+Infinity';
    if (value === -Infinity) return 'number:-Infinity';
    return 'number';
  }
  return typeof value;
}

// Tipo observado de um componente escalar (re/im/resistance/reactance): array conta como 'object' (SDD 4.4).
function scalarObservedType(value) {
  if (value === null) return 'null';
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'number:NaN';
    if (value === Infinity) return 'number:+Infinity';
    if (value === -Infinity) return 'number:-Infinity';
    return 'number';
  }
  if (Array.isArray(value) || typeof value === 'object') return 'object';
  return typeof value;
}

function sourceStatus() {
  return {
    classification: 'RNC-P_EXPERIMENTAL_NON_CANONICAL',
    scientificBaselineSha: SCIENTIFIC_BASELINE_SHA,
    l0ScientificBaselineSha: L0_SCIENTIFIC_BASELINE_SHA,
    l0IntegrationMainSha: L0_INTEGRATION_MAIN_SHA,
    primarySourceComplete: false,
    iecConformity: false,
  };
}

// Dez guardrails permanentes, na ordem canonica (SDD 10, posicoes 1-10).
function permanentBlockers() {
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

// Falha bloqueante — envelope RFC 7807 fechado com 10 guardrails + 1 blocker especifico (SDD 10).
function problem(code, params) {
  var safeParams = isPlainObject(params) ? params : {};
  var blockers = permanentBlockers();
  blockers.push({ code: code, params: safeParams, severity: 'blocker' });
  return {
    ok: false,
    classification: 'BLOCKED',
    data: null,
    assumptions: [],
    blockers: blockers,
    warnings: [],
    sourceStatus: sourceStatus(),
    productionAllowed: false,
    displayNotice: NOTICE,
    error: {
      type: 'https://ampai.dev/problems/' + code,
      title: code,
      status: 422,
      code: code,
      params: safeParams,
      severity: 'error',
    },
  };
}

// Primeira chave desconhecida de um objeto simples.
function firstUnknownKey(object, knownList, basePath) {
  var keys = Object.keys(object);
  for (var i = 0; i < keys.length; i += 1) {
    if (knownList.indexOf(keys[i]) === -1) return basePath + '.' + keys[i];
  }
  return null;
}

// Escopos fechados exceto os itens de catalogo (tratados por CANDIDATE_STRUCTURE_INVALID na §11).
function findUnexpectedProperty(input) {
  var path = firstUnknownKey(input, KNOWN_KEYS.root, '$');
  if (path) return path;
  if (isPlainObject(input.powerFactor)) {
    path = firstUnknownKey(input.powerFactor, KNOWN_KEYS.powerFactor, '$.powerFactor');
    if (path) return path;
  }
  if (isPlainObject(input.catalog)) {
    path = firstUnknownKey(input.catalog, KNOWN_KEYS.catalog, '$.catalog');
    if (path) return path;
    if (isPlainObject(input.catalog.impedanceBasis)) {
      path = firstUnknownKey(input.catalog.impedanceBasis, KNOWN_KEYS.impedanceBasis, '$.catalog.impedanceBasis');
      if (path) return path;
    }
  }
  if (isPlainObject(input.grouping)) {
    path = firstUnknownKey(input.grouping, KNOWN_KEYS.grouping, '$.grouping');
    if (path) return path;
  }
  if (isPlainObject(input.guidedHypothesis)) {
    path = firstUnknownKey(input.guidedHypothesis, KNOWN_KEYS.guidedHypothesis, '$.guidedHypothesis');
    if (path) return path;
  }
  if (isPlainObject(input.fault)) {
    path = firstUnknownKey(input.fault, KNOWN_KEYS.fault, '$.fault');
    if (path) return path;
    if (isPlainObject(input.fault.adiabaticK_A_sqrt_s_per_mm2)) {
      path = firstUnknownKey(input.fault.adiabaticK_A_sqrt_s_per_mm2, KNOWN_KEYS.adiabaticK, '$.fault.adiabaticK_A_sqrt_s_per_mm2');
      if (path) return path;
    }
    if (isPlainObject(input.fault.imbalance)) {
      path = firstUnknownKey(input.fault.imbalance, KNOWN_KEYS.imbalance, '$.fault.imbalance');
      if (path) return path;
    }
  }
  if (isPlainObject(input.pruning)) {
    path = firstUnknownKey(input.pruning, KNOWN_KEYS.pruning, '$.pruning');
    if (path) return path;
  }
  if (isPlainObject(input.providedCombination)) {
    path = firstUnknownKey(input.providedCombination, KNOWN_KEYS.providedCombination, '$.providedCombination');
    if (path) return path;
  }
  if (Array.isArray(input.advancedBranchesByCombination)) {
    for (var a = 0; a < input.advancedBranchesByCombination.length; a += 1) {
      var entry = input.advancedBranchesByCombination[a];
      if (isPlainObject(entry)) {
        path = firstUnknownKey(entry, KNOWN_KEYS.advancedEntry, '$.advancedBranchesByCombination[' + a + ']');
        if (path) return path;
        if (Array.isArray(entry.branches)) {
          for (var b = 0; b < entry.branches.length; b += 1) {
            if (isPlainObject(entry.branches[b])) {
              path = firstUnknownKey(entry.branches[b], KNOWN_KEYS.branch, '$.advancedBranchesByCombination[' + a + '].branches[' + b + ']');
              if (path) return path;
            }
          }
        }
      }
    }
  }
  return null;
}

// ---------- Validacao estrutural e global (SDD 5 passos 1-4, precedencia 11.1) ----------

function validateStructureAndGlobals(input) {
  // 2. Propriedade desconhecida em qualquer escopo conhecido.
  var unexpected = findUnexpectedProperty(input);
  if (unexpected) return problem('INPUT_STRUCTURE_INVALID', { path: unexpected, reason: 'unexpected_property' });

  // Containers estruturais de tipo correto.
  var objectContainers = [
    ['powerFactor', input.powerFactor], ['catalog', input.catalog], ['grouping', input.grouping], ['fault', input.fault], ['pruning', input.pruning],
  ];
  for (var i = 0; i < objectContainers.length; i += 1) {
    if (has(input, objectContainers[i][0]) && !isPlainObject(objectContainers[i][1])) {
      return problem('INPUT_STRUCTURE_INVALID', { path: '$.' + objectContainers[i][0], reason: 'wrong_container_type' });
    }
  }
  // advancedBranchesByCombination nao-array e tratado no modo avancado como ADVANCED_BRANCHES_INVALID (SDD 4.7).

  // 3. Versao exata.
  if (input.contractVersion !== CONTRACT_VERSION) {
    return problem('CONTRACT_VERSION_UNSUPPORTED', { received: has(input, 'contractVersion') ? input.contractVersion : null, allowed: [CONTRACT_VERSION] });
  }

  // 4a. Presenca de metadados globais indispensaveis (ordem canonica). Enums ausentes anexam o codigo de dominio relacionado.
  var presenceChecks = [
    ['totalLoadCurrent_A', '$.totalLoadCurrent_A', null],
    ['lineVoltage_V', '$.lineVoltage_V', null],
    ['powerFactor', '$.powerFactor', null],
    ['maximumVoltageDrop_percent', '$.maximumVoltageDrop_percent', null],
    ['maxParallelCount', '$.maxParallelCount', null],
    ['nCircuits', '$.nCircuits', null],
    ['arrangement', '$.arrangement', null],
    ['analysisMode', '$.analysisMode', 'ANALYSIS_MODE_INVALID'],
    ['objective', '$.objective', 'OBJECTIVE_INVALID'],
    ['catalog', '$.catalog', null],
    ['grouping', '$.grouping', null],
    ['fault', '$.fault', null],
    ['pruning', '$.pruning', null],
    ['providedCombination', '$.providedCombination', null],
  ];
  var missingPaths = [];
  for (var p = 0; p < presenceChecks.length; p += 1) {
    if (!has(input, presenceChecks[p][0])) missingPaths.push(presenceChecks[p][1]);
  }
  // fault.* indispensaveis (STR-01).
  if (isPlainObject(input.fault)) {
    if (!has(input.fault, 'totalFaultCurrent_A')) missingPaths.push('$.fault.totalFaultCurrent_A');
    if (!has(input.fault, 'clearingTime_s')) missingPaths.push('$.fault.clearingTime_s');
  }
  if (missingPaths.length > 0) {
    // Schema fechado: GLOBAL_METADATA_MISSING carrega apenas { paths } (sem relatedCodes).
    return problem('GLOBAL_METADATA_MISSING', { paths: missingPaths });
  }

  // 4b. Enums fechados presentes-invalidos.
  if (ANALYSIS_MODES.indexOf(input.analysisMode) === -1) {
    return problem('ANALYSIS_MODE_INVALID', { received: input.analysisMode, allowed: ANALYSIS_MODES });
  }
  if (OBJECTIVES.indexOf(input.objective) === -1) {
    return problem('OBJECTIVE_INVALID', { received: input.objective, allowed: OBJECTIVES });
  }

  // 4c. Numericos globais presentes-invalidos (tipo/finitude/dominio).
  var numericError = validateGlobalNumerics(input);
  if (numericError) return numericError;

  // 4d. Confirmacao do fator de potencia sugerido.
  var pf = input.powerFactor;
  if (!isPlainObject(pf) || !isFiniteNumber(pf.value) || pf.value < 0 || pf.value > 1) {
    return problem('GLOBAL_METADATA_INVALID', { path: '$.powerFactor.value', reason: 'out_of_domain' });
  }
  if (pf.inputClass === 'SUGERIDA_COM_CONFIRMACAO' && pf.confirmed !== true) {
    return problem('SUGGESTION_UNCONFIRMED', { path: '$.powerFactor.confirmed' });
  }
  return null;
}

function validateGlobalNumerics(input) {
  var positive = [
    ['totalLoadCurrent_A', '$.totalLoadCurrent_A'],
    ['lineVoltage_V', '$.lineVoltage_V'],
    ['maximumVoltageDrop_percent', '$.maximumVoltageDrop_percent'],
  ];
  for (var i = 0; i < positive.length; i += 1) {
    var v = input[positive[i][0]];
    if (!isFiniteNumber(v) || v <= 0) return problem('GLOBAL_METADATA_INVALID', { path: positive[i][1], reason: 'not_positive_finite' });
  }
  var integers = [['maxParallelCount', '$.maxParallelCount'], ['nCircuits', '$.nCircuits']];
  for (var j = 0; j < integers.length; j += 1) {
    var n = input[integers[j][0]];
    if (!Number.isInteger(n) || n < 1) return problem('GLOBAL_METADATA_INVALID', { path: integers[j][1], reason: 'not_positive_integer' });
  }
  if (typeof input.arrangement !== 'string' || input.arrangement.length === 0) {
    return problem('GLOBAL_METADATA_INVALID', { path: '$.arrangement', reason: 'not_nonempty_string' });
  }
  if (!isPlainObject(input.fault)) return problem('GLOBAL_METADATA_INVALID', { path: '$.fault', reason: 'wrong_container_type' });
  if (!isFiniteNumber(input.fault.totalFaultCurrent_A) || input.fault.totalFaultCurrent_A < 0) {
    return problem('GLOBAL_METADATA_INVALID', { path: '$.fault.totalFaultCurrent_A', reason: 'negative_or_non_finite' });
  }
  if (!isFiniteNumber(input.fault.clearingTime_s) || input.fault.clearingTime_s < 0) {
    return problem('GLOBAL_METADATA_INVALID', { path: '$.fault.clearingTime_s', reason: 'negative_or_non_finite' });
  }
  return null;
}

// ---------- Catalogo: modo, rastreabilidade e confirmacao (SDD 4.5, precedencia 11.1 passo 5) ----------

function validateCatalogMeta(input) {
  var catalog = input.catalog;
  if (CATALOG_MODES.indexOf(catalog.mode) === -1) {
    return problem('CATALOG_MODE_INVALID', { received: typeof catalog.mode === 'string' ? catalog.mode : null });
  }
  if (catalog.mode === 'CATALOGO_SECUNDARIO_IDENTIFICADO') {
    var missing = [];
    if (typeof catalog.source !== 'string' || catalog.source.length === 0) missing.push('$.catalog.source');
    if (typeof catalog.sourceVersion !== 'string' || catalog.sourceVersion.length === 0) missing.push('$.catalog.sourceVersion');
    if (catalog.provenance !== 'ASSUMPTION_ONLY') missing.push('$.catalog.provenance');
    if (missing.length > 0) return problem('CATALOG_TRACEABILITY_MISSING', { paths: missing });
  }
  if (catalog.confirmed !== true) {
    return problem('CATALOG_CONFIRMATION_MISSING', { path: '$.catalog.confirmed' });
  }
  if (!Array.isArray(catalog.candidates) || catalog.candidates.length === 0) {
    return problem('CATALOG_NO_EVALUABLE_CANDIDATE', { catalogEntryCount: 0, errors: [] });
  }
  return null;
}

// ---------- Validacao por item do catalogo (SDD 4.4, precedencia 11.1 passos 6-8) ----------

// Produz issues detalhadas (schema fechado por codigo, SDD 11) + blockReason p/ o blocker de combinacao.
function validateCandidateItem(rawItem, index) {
  var detailedIssues = [];
  var catalogEntryIndex = index;
  var hasValidSection = isPlainObject(rawItem) && isFiniteNumber(rawItem.section_mm2) && rawItem.section_mm2 > 0;
  var catalogEntryId = hasValidSection ? 'section-' + rawItem.section_mm2 : 'catalog-entry-' + index;
  var mode = input_mode_ref.value;

  function result(complete, blockReason, normalizedImpedance, item) {
    return {
      index: index, catalogEntryId: catalogEntryId, catalogEntryIndex: catalogEntryIndex,
      section_mm2: hasValidSection ? rawItem.section_mm2 : null,
      complete: complete, detailedIssues: detailedIssues, blockReason: blockReason,
      item: item, normalizedImpedance: normalizedImpedance,
    };
  }

  if (!isPlainObject(rawItem)) {
    detailedIssues.push({ code: 'CANDIDATE_STRUCTURE_INVALID', catalogEntryId: catalogEntryId, catalogEntryIndex: catalogEntryIndex, reason: 'not_plain_object' });
    return result(false, 'not_plain_object', null, null);
  }

  // Propriedade desconhecida -> CANDIDATE_STRUCTURE_INVALID (terminal para o item).
  var unknown = firstUnknownKey(rawItem, KNOWN_KEYS.candidate, '$.catalog.candidates[' + index + ']');
  if (unknown) {
    detailedIssues.push({ code: 'CANDIDATE_STRUCTURE_INVALID', catalogEntryId: catalogEntryId, catalogEntryIndex: catalogEntryIndex, reason: 'unknown_property', path: unknown });
    return result(false, 'unknown_property', null, rawItem);
  }

  // 6. Conflito de representacao por presenca (antes de completude/tipo/valor) -> terminal.
  var hasImpedance = has(rawItem, 'impedance_ohm');
  var hasResistance = has(rawItem, 'resistance_ohm');
  var hasReactance = has(rawItem, 'reactance_ohm');
  if (hasImpedance && (hasResistance || hasReactance)) {
    var presentFields = [];
    if (hasImpedance) presentFields.push('impedance_ohm');
    if (hasResistance) presentFields.push('resistance_ohm');
    if (hasReactance) presentFields.push('reactance_ohm');
    detailedIssues.push({ code: 'CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT', catalogEntryId: catalogEntryId, presentFields: presentFields });
    return result(false, 'representation_conflict', null, rawItem);
  }

  // 7. Escalares/componentes ausentes -> missingFields[] (ordem canonica).
  var missingFields = [];
  for (var s = 0; s < CANDIDATE_SCALARS.length; s += 1) {
    if (!has(rawItem, CANDIDATE_SCALARS[s])) missingFields.push(CANDIDATE_SCALARS[s]);
  }
  // 8. Valores presentes invalidos -> invalidFields[] (ordem canonica).
  var invalidByPath = {};
  function markInvalid(path, reason, obsType) { invalidByPath[path] = { path: path, reason: reason, observedType: obsType }; }
  for (var n = 0; n < CANDIDATE_NUMBER_SCALARS.length; n += 1) {
    var nk = CANDIDATE_NUMBER_SCALARS[n];
    if (has(rawItem, nk)) {
      var nv = rawItem[nk];
      var mustBePositive = nk !== 'referenceTemperature_C';
      if (!isFiniteNumber(nv) || (mustBePositive && nv <= 0)) markInvalid(nk, isFiniteNumber(nv) ? 'OUT_OF_RANGE' : (typeof nv === 'number' ? 'NON_FINITE' : 'NOT_NUMBER'), scalarObservedType(nv));
    }
  }
  for (var g = 0; g < CANDIDATE_STRING_SCALARS.length; g += 1) {
    var gk = CANDIDATE_STRING_SCALARS[g];
    if (has(rawItem, gk) && (typeof rawItem[gk] !== 'string' || rawItem[gk].length === 0)) markInvalid(gk, 'NOT_STRING', scalarObservedType(rawItem[gk]));
  }
  if (has(rawItem, 'provenance') && rawItem.provenance !== 'ASSUMPTION_ONLY') markInvalid('provenance', 'NOT_ASSUMPTION_ONLY', scalarObservedType(rawItem.provenance));

  // Representacao de impedancia: presenca -> completude -> valor. Componente array conta como 'object'.
  var normalizedImpedance = null;
  if (hasImpedance) {
    var imp = rawItem.impedance_ohm;
    if (!isPlainObject(imp)) {
      // Container presente porem nao e objeto simples -> valor invalido (observedType do container).
      markInvalid('impedance_ohm', 'NOT_SIMPLE_OBJECT', observedType(imp));
    } else {
      var reAbsent = !has(imp, 're');
      var imAbsent = !has(imp, 'im');
      if (reAbsent) missingFields.push('impedance_ohm.re');
      if (imAbsent) missingFields.push('impedance_ohm.im');
      if (!reAbsent && !isFiniteNumber(imp.re)) markInvalid('impedance_ohm.re', typeof imp.re === 'number' ? 'NON_FINITE' : 'NOT_NUMBER', scalarObservedType(imp.re));
      if (!imAbsent && !isFiniteNumber(imp.im)) markInvalid('impedance_ohm.im', typeof imp.im === 'number' ? 'NON_FINITE' : 'NOT_NUMBER', scalarObservedType(imp.im));
      if (!reAbsent && !imAbsent && isFiniteNumber(imp.re) && isFiniteNumber(imp.im)) normalizedImpedance = { re: imp.re, im: imp.im };
    }
  } else if (hasResistance || hasReactance) {
    if (!hasResistance) missingFields.push('resistance_ohm');
    if (!hasReactance) missingFields.push('reactance_ohm');
    if (hasResistance && !isFiniteNumber(rawItem.resistance_ohm)) markInvalid('resistance_ohm', typeof rawItem.resistance_ohm === 'number' ? 'NON_FINITE' : 'NOT_NUMBER', scalarObservedType(rawItem.resistance_ohm));
    if (hasReactance && !isFiniteNumber(rawItem.reactance_ohm)) markInvalid('reactance_ohm', typeof rawItem.reactance_ohm === 'number' ? 'NON_FINITE' : 'NOT_NUMBER', scalarObservedType(rawItem.reactance_ohm));
    if (hasResistance && hasReactance && isFiniteNumber(rawItem.resistance_ohm) && isFiniteNumber(rawItem.reactance_ohm)) normalizedImpedance = { re: rawItem.resistance_ohm, im: rawItem.reactance_ohm };
  } else {
    missingFields.push('impedanceRepresentation');
  }

  var orderedMissing = MISSING_FIELD_ORDER.filter(function keepMissing(field) { return missingFields.indexOf(field) !== -1; });
  // Escalares conhecidos invalidos -> CANDIDATE_VALUE_INVALID (ordem canonica dos escalares).
  var scalarInvalid = CANDIDATE_SCALARS.filter(function keepScalar(p) { return has(invalidByPath, p); }).map(function pickScalar(p) { return invalidByPath[p]; });
  // Componentes de impedancia invalidos -> CANDIDATE_IMPEDANCE_VALUE_INVALID (ordem canonica de impedancia).
  var impedanceInvalid = INVALID_FIELD_ORDER.filter(function keepImp(p) { return has(invalidByPath, p); }).map(function pickImp(p) { return invalidByPath[p]; });
  if (orderedMissing.length > 0) {
    detailedIssues.push({ code: 'CANDIDATE_INCOMPLETE', catalogEntryId: catalogEntryId, missingFields: orderedMissing, mode: mode, provenance: 'ASSUMPTION_ONLY' });
  }
  if (scalarInvalid.length > 0) {
    detailedIssues.push({ code: 'CANDIDATE_VALUE_INVALID', catalogEntryId: catalogEntryId, catalogEntryIndex: catalogEntryIndex, invalidFields: scalarInvalid, mode: mode });
  }
  if (impedanceInvalid.length > 0) {
    detailedIssues.push({ code: 'CANDIDATE_IMPEDANCE_VALUE_INVALID', catalogEntryId: catalogEntryId, invalidFields: impedanceInvalid, mode: mode });
  }

  var complete = detailedIssues.length === 0;
  var blockReason = complete ? null : (orderedMissing.length > 0 ? 'candidate_incomplete' : 'candidate_value_invalid');
  return result(complete, blockReason, normalizedImpedance, rawItem);
}

// Referencia leve para propagar catalog.mode ao rotulo do erro sem passar por muitos argumentos.
var input_mode_ref = { value: null };

// Valida todos os itens, aplica homogeneidade e secao duplicada (cross-item).
function validateCatalogItems(input) {
  var candidates = input.catalog.candidates;
  input_mode_ref.value = input.catalog.mode;
  var validated = candidates.map(validateCandidateItem);

  // Secao duplicada: todas as ocorrencias da mesma secao -> CANDIDATE_STRUCTURE_INVALID/duplicate_section.
  var bySection = {};
  validated.forEach(function group(entry) {
    if (entry.section_mm2 !== null) {
      var key = String(entry.section_mm2);
      if (!bySection[key]) bySection[key] = [];
      bySection[key].push(entry);
    }
  });
  Object.keys(bySection).forEach(function checkDup(key) {
    var group = bySection[key];
    if (group.length > 1) {
      var conflicting = group.map(function id(e) { return e.catalogEntryId; });
      group.forEach(function block(entry) {
        entry.detailedIssues.push({ code: 'CANDIDATE_STRUCTURE_INVALID', catalogEntryId: entry.catalogEntryId, catalogEntryIndex: entry.catalogEntryIndex, reason: 'duplicate_section', conflictingEntryIds: conflicting });
        entry.complete = false;
        entry.blockReason = 'duplicate_section';
      });
    }
  });

  // Homogeneidade: referencia = primeiro item estruturalmente completo; divergentes -> CANDIDATE_STRUCTURE_INVALID/heterogeneous.
  var reference = null;
  for (var r = 0; r < validated.length; r += 1) {
    if (validated[r].complete && isPlainObject(validated[r].item)) { reference = validated[r].item; break; }
  }
  if (reference) {
    validated.forEach(function checkHomo(entry) {
      if (!entry.complete || !isPlainObject(entry.item) || entry.item === reference) return;
      for (var h = 0; h < HOMOGENEOUS_FIELDS.length; h += 1) {
        var field = HOMOGENEOUS_FIELDS[h];
        if (entry.item[field] !== reference[field]) {
          entry.detailedIssues.push({ code: 'CANDIDATE_STRUCTURE_INVALID', catalogEntryId: entry.catalogEntryId, catalogEntryIndex: entry.catalogEntryIndex, reason: 'catalog_heterogeneous', field: field });
          entry.complete = false;
          entry.blockReason = 'catalog_heterogeneous';
          return;
        }
      }
    });
  }
  return validated;
}

// ---------- Agrupamento (SDD 4.6, precedencia 11.1 passo 9) ----------

// Validacao global do modo/constante de agrupamento. Retorna problem (global) ou null.
function validateGroupingGlobal(input) {
  var grouping = input.grouping;
  if (!isPlainObject(grouping) || GROUPING_MODES.indexOf(grouping.mode) === -1) {
    return problem('GROUPING_MODE_INVALID', { received: isPlainObject(grouping) && typeof grouping.mode === 'string' ? grouping.mode : null });
  }
  // Constante laboratorial nao confirmada bloqueia o envelope inteiro (SDD 4.6). Valor ausente/invalido e por combinacao.
  if (grouping.mode === 'LAB_CONSTANT_CONFIRMED' && grouping.confirmed !== true) {
    return problem('GROUPING_CONFIRMATION_MISSING', { path: '$.grouping.confirmed' });
  }
  return null;
}

// Resolve k_g para uma combinacao. Retorna { value } ou { issue:{code,params} } (bloqueio somente da combinacao).
function resolveGroupingForCombination(input, section, nParallel, candidateId) {
  var grouping = input.grouping;
  if (grouping.mode === 'LAB_CONSTANT_CONFIRMED') {
    if (!has(grouping, 'value')) {
      return { issue: { code: 'GROUPING_FACTOR_MISSING', params: { candidateId: candidateId, nParallel: nParallel, nCircuits: input.nCircuits } } };
    }
    if (!isFiniteNumber(grouping.value) || grouping.value <= 0 || grouping.value > 1) {
      return { issue: { code: 'GROUPING_FACTOR_INVALID', params: { candidateId: candidateId, value: isFiniteNumber(grouping.value) ? grouping.value : null } } };
    }
    return { value: grouping.value };
  }
  var entries = Array.isArray(grouping.entries) ? grouping.entries : [];
  var match = null;
  for (var i = 0; i < entries.length; i += 1) {
    var e = entries[i];
    if (!isPlainObject(e)) continue;
    if (grouping.mode === 'CANDIDATE_SPECIFIC') {
      if (e.candidateId === candidateId) { match = e; break; }
    } else { // GROUPING_MATRIX
      if (e.nParallel === nParallel && e.nCircuits === input.nCircuits) { match = e; break; }
    }
  }
  if (!match) {
    return { issue: { code: 'GROUPING_FACTOR_MISSING', params: { candidateId: candidateId, nParallel: nParallel, nCircuits: input.nCircuits } } };
  }
  if (!isFiniteNumber(match.value) || match.value <= 0 || match.value > 1) {
    return { issue: { code: 'GROUPING_FACTOR_INVALID', params: { candidateId: candidateId, value: isFiniteNumber(match.value) ? match.value : null } } };
  }
  return { value: match.value };
}

// ---------- Geometria por combinacao (SDD 4.7, precedencia 11.1 passos 10-11) ----------

// Validacao global de hipotese guiada / mapa avancado. Retorna problem (global) ou null.
function validateGeometryGlobal(input) {
  if (input.analysisMode === 'MODO_GUIADO_PRELIMINAR') {
    var gh = input.guidedHypothesis;
    var missing = [];
    if (!isPlainObject(gh) || gh.displayedBeforeCalculation !== true) missing.push('displayedBeforeCalculation');
    if (!isPlainObject(gh) || gh.confirmed !== true) missing.push('confirmed');
    if (!isPlainObject(gh) || gh.provenance !== 'ASSUMPTION_ONLY') missing.push('provenance');
    if (missing.length > 0) return problem('GUIDED_HYPOTHESIS_UNCONFIRMED', { missing: missing });
  } else { // MODO_AVANCADO
    if (!Array.isArray(input.advancedBranchesByCombination)) {
      return problem('ADVANCED_BRANCHES_INVALID', { reason: 'map_not_array' });
    }
  }
  return null;
}

// Constroi a geometria/branches L0 para uma combinacao. Retorna { geometry, branches } ou { issue }.
function resolveGeometryForCombination(input, entry, section, nParallel, candidateId) {
  if (input.analysisMode === 'MODO_GUIADO_PRELIMINAR') {
    var branches = [];
    for (var i = 0; i < nParallel; i += 1) {
      branches.push({ id: 'P' + (i + 1), impedance_ohm: { re: entry.normalizedImpedance.re, im: entry.normalizedImpedance.im }, provenance: 'ASSUMPTION_ONLY' });
    }
    return { geometry: { status: 'NOT_PROVIDED', description: null }, branches: branches };
  }
  // MODO_AVANCADO: ramos explicitos, geometria descrita.
  var advanced = null;
  var list = input.advancedBranchesByCombination;
  for (var a = 0; a < list.length; a += 1) {
    if (isPlainObject(list[a]) && list[a].candidateId === candidateId) { advanced = list[a]; break; }
  }
  if (!advanced) return { issue: { code: 'ADVANCED_BRANCHES_INVALID', params: { candidateId: candidateId, reason: 'combination_missing' } } };
  var hasDescription = typeof advanced.geometryDescription === 'string' && advanced.geometryDescription.length > 0;
  var hasBranches = Array.isArray(advanced.branches) && advanced.branches.length > 0;
  // Sem geometria e sem ramos: deixa o L0 reportar GEOMETRY_AND_IMPEDANCE_MISSING (nao e ADVANCED_BRANCHES_INVALID).
  if (!hasDescription && !hasBranches) {
    return { geometry: { status: 'NOT_PROVIDED', description: null }, branches: [] };
  }
  if (!hasDescription) {
    return { issue: { code: 'ADVANCED_BRANCHES_INVALID', params: { candidateId: candidateId, reason: 'description_missing' } } };
  }
  if (!Array.isArray(advanced.branches) || advanced.branches.length !== nParallel) {
    return { issue: { code: 'ADVANCED_BRANCHES_INVALID', params: { candidateId: candidateId, reason: 'branch_count_mismatch', expected: nParallel, observed: Array.isArray(advanced.branches) ? advanced.branches.length : null } } };
  }
  var seen = {};
  var built = [];
  for (var b = 0; b < advanced.branches.length; b += 1) {
    var br = advanced.branches[b];
    if (!isPlainObject(br) || typeof br.id !== 'string' || br.id.length === 0 || has(seen, br.id)) {
      return { issue: { code: 'ADVANCED_BRANCHES_INVALID', params: { candidateId: candidateId, reason: 'branch_id_duplicate', observed: isPlainObject(br) && typeof br.id === 'string' ? br.id : null } } };
    }
    seen[br.id] = true;
    if (!isPlainObject(br.impedance_ohm) || !isFiniteNumber(br.impedance_ohm.re) || !isFiniteNumber(br.impedance_ohm.im)) {
      return { issue: { code: 'ADVANCED_BRANCHES_INVALID', params: { candidateId: candidateId, reason: 'branch_impedance_invalid', observed: 'NON_FINITE' } } };
    }
    if (br.provenance !== 'ASSUMPTION_ONLY') {
      return { issue: { code: 'ADVANCED_BRANCHES_INVALID', params: { candidateId: candidateId, reason: 'branch_provenance_invalid', observed: typeof br.provenance === 'string' ? br.provenance : null } } };
    }
    built.push({ id: br.id, impedance_ohm: { re: br.impedance_ohm.re, im: br.impedance_ohm.im }, provenance: 'ASSUMPTION_ONLY' });
  }
  return { geometry: { status: 'DESCRIBED', description: advanced.geometryDescription }, branches: built };
}

// ---------- DTO L0 e chamada unica ----------

function buildImbalanceDTO(imb) {
  if (!isPlainObject(imb)) return { mode: null };
  if (imb.mode === 'EXPLICIT_ASSUMPTION') return { mode: imb.mode, deltaFault: imb.deltaFault, provenance: imb.provenance };
  return { mode: imb.mode };
}

function buildL0Dto(input, entry, nParallel, kg, geometry, branches) {
  var adiabatic = isPlainObject(input.fault.adiabaticK_A_sqrt_s_per_mm2) ? input.fault.adiabaticK_A_sqrt_s_per_mm2 : {};
  return {
    contractVersion: L0_CONTRACT_VERSION,
    totalLoadCurrent_A: input.totalLoadCurrent_A,
    powerFactor: input.powerFactor.value,
    nParallel: nParallel,
    nCircuits: input.nCircuits,
    geometry: { status: geometry.status, description: geometry.description },
    branches: branches,
    capacityProxy: {
      groupingFactor: { value: kg, provenance: 'ASSUMPTION_ONLY' },
      tabulatedAmpacityPerConductor_A: { value: entry.item.tabulatedAmpacity_A, provenance: 'ASSUMPTION_ONLY' },
    },
    fault: {
      totalFaultCurrent_A: input.fault.totalFaultCurrent_A,
      clearingTime_s: input.fault.clearingTime_s,
      adiabaticK_A_sqrt_s_per_mm2: { value: adiabatic.value, provenance: adiabatic.provenance },
      imbalance: buildImbalanceDTO(input.fault.imbalance),
    },
  };
}

// ---------- Metricas L1 e criterios (SDD 7) ----------

function computeMetrics(input, entry, nParallel, l0data) {
  var section = entry.section_mm2;
  var Iadm = l0data.capacityProxy.totalAdmissibleCurrentProxy_A;
  var dU_V = l0data.voltageDrop.threePhase_V;
  var Smin = l0data.faultAdiabatic.minimumSectionContinuous_mm2;

  var mAmp = Iadm / input.totalLoadCurrent_A - 1;
  var dUPercent = dU_V / input.lineVoltage_V * 100;
  var mVD = (input.maximumVoltageDrop_percent - dUPercent) / input.maximumVoltageDrop_percent;
  var scUnbounded = Smin === 0;
  var mSC = scUnbounded ? Infinity : (section / Smin - 1);

  var ampacity = { admissibleCurrent_A: Iadm, requiredCurrent_A: input.totalLoadCurrent_A, margin: mAmp, passes: mAmp >= 0 };
  var voltageDrop = { actualPercent: dUPercent, userLimitPercent: input.maximumVoltageDrop_percent, margin: mVD, passes: mVD >= 0, normativeLimit: null };
  var shortCircuit = {
    minimumSectionContinuous_mm2: Smin,
    providedSection_mm2: section,
    margin: scUnbounded ? null : mSC,
    unboundedPositiveMargin: scUnbounded,
    passes: scUnbounded ? true : (mSC >= 0),
  };

  // minimumMargin = menor valor finito das tres margens (curto excluido quando Smin=0).
  var marginByCriterion = { AMPACIDADE: mAmp, QUEDA: mVD, CURTO: scUnbounded ? null : mSC };
  var finiteMargins = [];
  CRITERIA_ORDER.forEach(function collect(c) {
    var m = marginByCriterion[c];
    if (m !== null && Number.isFinite(m)) finiteMargins.push(m);
  });
  var minimumMargin = finiteMargins.length > 0 ? Math.min.apply(null, finiteMargins) : null;

  // failedCriteria: margens negativas (ordem canonica). dominantCriteria: falhas quando ha; senao, criterio(s) no minimo.
  var failedCriteria = [];
  CRITERIA_ORDER.forEach(function classifyFail(c) {
    var m = marginByCriterion[c];
    if (m !== null && Number.isFinite(m) && m < 0) failedCriteria.push(c);
  });
  var dominantCriteria = [];
  if (failedCriteria.length > 0) {
    dominantCriteria = failedCriteria.slice();
  } else {
    CRITERIA_ORDER.forEach(function classifyDom(c) {
      var m = marginByCriterion[c];
      if (m !== null && Number.isFinite(m) && minimumMargin !== null && approximatelyEqual(m, minimumMargin)) dominantCriteria.push(c);
    });
  }

  return {
    ampacity: ampacity, voltageDrop: voltageDrop, shortCircuit: shortCircuit,
    minimumMargin: minimumMargin, dominantCriteria: dominantCriteria, failedCriteria: failedCriteria,
    dUPercent: dUPercent,
  };
}

// ---------- Ordenacao (SDD 8) ----------

function compareCandidateId(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

function canonicalCompare(a, b) {
  if (a.nParallel !== b.nParallel) return a.nParallel - b.nParallel;
  if (a.section_mm2 !== b.section_mm2) return a.section_mm2 - b.section_mm2;
  return compareCandidateId(a.candidateId, b.candidateId);
}

function objectiveComparator(objective) {
  return function compare(a, b) {
    if (objective === 'MIN_PARALLEL_COUNT') {
      if (a.nParallel !== b.nParallel) return a.nParallel - b.nParallel;
      if (a.minimumMargin !== b.minimumMargin) return b.minimumMargin - a.minimumMargin;
    } else if (objective === 'MIN_TOTAL_COPPER') {
      if (a.totalCopper_mm2 !== b.totalCopper_mm2) return a.totalCopper_mm2 - b.totalCopper_mm2;
      if (a.minimumMargin !== b.minimumMargin) return b.minimumMargin - a.minimumMargin;
    } else if (objective === 'MAX_MINIMUM_MARGIN') {
      if (a.minimumMargin !== b.minimumMargin) return b.minimumMargin - a.minimumMargin;
      if (a.totalCopper_mm2 !== b.totalCopper_mm2) return a.totalCopper_mm2 - b.totalCopper_mm2;
    }
    return canonicalCompare(a, b);
  };
}

// ---------- Fronteira nao dominada (SDD 8) ----------

function dominates(a, b) {
  var notWorse = a.nParallel <= b.nParallel
    && a.totalCopper_mm2 <= b.totalCopper_mm2
    && (a.minimumMargin >= b.minimumMargin || approximatelyEqual(a.minimumMargin, b.minimumMargin));
  if (!notWorse) return false;
  return a.nParallel < b.nParallel
    || a.totalCopper_mm2 < b.totalCopper_mm2
    || (a.minimumMargin > b.minimumMargin && !approximatelyEqual(a.minimumMargin, b.minimumMargin));
}

function computeFrontier(valid) {
  return valid.filter(function keep(a) {
    return !valid.some(function other(b) { return b !== a && dominates(b, a); });
  });
}

// ---------- Modelo de apresentacao (SDD 9.2) ----------

function buildPresentationCard(candidate) {
  var meta = candidate._catalogMetadata;
  return {
    candidateId: candidate.candidateId,
    quantityPerPhase: candidate.nParallel,
    section_mm2: candidate.section_mm2,
    headlineArgs: { quantityPerPhase: candidate.nParallel, section_mm2: candidate.section_mm2 },
    catalogMetadata: {
      material: meta.material,
      insulation: meta.insulation,
      installationMethod: meta.installationMethod,
      referenceTemperature_C: meta.referenceTemperature_C,
      referenceTemperatureUnit: 'degC',
    },
    criteria: {
      ampacity: { status: candidate.ampacity.passes ? 'ATENDE' : 'NAO_ATENDE', values: { admissibleCurrent_A: candidate.ampacity.admissibleCurrent_A, requiredCurrent_A: candidate.ampacity.requiredCurrent_A, margin: candidate.ampacity.margin }, unit: 'A', qualifierKey: 'criterio.ampacidade' },
      voltageDrop: { status: candidate.voltageDrop.passes ? 'ATENDE' : 'NAO_ATENDE', values: { actualPercent: candidate.voltageDrop.actualPercent, userLimitPercent: candidate.voltageDrop.userLimitPercent, margin: candidate.voltageDrop.margin }, unit: 'percent', qualifierKey: 'criterio.queda' },
      shortCircuit: { status: candidate.shortCircuit.passes ? 'ATENDE' : 'NAO_ATENDE', values: { minimumSectionContinuous_mm2: candidate.shortCircuit.minimumSectionContinuous_mm2, providedSection_mm2: candidate.shortCircuit.providedSection_mm2, margin: candidate.shortCircuit.margin, unboundedPositiveMargin: candidate.shortCircuit.unboundedPositiveMargin }, unit: 'mm2', qualifierKey: 'criterio.curto' },
    },
    dominantCriteria: candidate.dominantCriteria,
    objective: candidate._objective,
    installationAuthorized: false,
    assumptionKeys: candidate.assumptions.map(function pickId(a) { return a.id; }),
    blockerCodes: ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'],
    notice: NOTICE,
  };
}

// Projecao leve para presentationOrder/nonDominated (nunca eleicao).
function projectCandidate(c) {
  return {
    candidateId: c.candidateId,
    nParallel: c.nParallel,
    section_mm2: c.section_mm2,
    totalCopper_mm2: c.totalCopper_mm2,
    minimumMargin: c.minimumMargin,
    dominantCriteria: c.dominantCriteria,
    installableSelection: null,
    installationAuthorized: false,
  };
}

// ---------- Politica de apresentacao (CAB-004: minimo aprovado por secao) ----------

function exactKeySet(object, keys) {
  if (!isPlainObject(object)) return false;
  var actual = Object.keys(object);
  if (actual.length !== keys.length) return false;
  for (var i = 0; i < keys.length; i += 1) { if (!has(object, keys[i])) return false; }
  return true;
}

// Resolve o modo de apresentacao. Ausente/null => ALL_VALID_LEGACY; objeto fechado exato => MINIMUM; senao => falha.
function resolvePresentationPolicy(input) {
  if (!has(input, 'presentationPolicy') || input.presentationPolicy === null) return { mode: 'LEGACY' };
  var p = input.presentationPolicy;
  if (exactKeySet(p, ['mode', 'confirmed', 'provenance'])
    && p.mode === 'MINIMUM_PASSING_PER_SECTION'
    && p.confirmed === true
    && p.provenance === 'CEO_APPROVED_PRESENTATION_POLICY') {
    return { mode: 'MINIMUM' };
  }
  return { problem: problem('PRESENTATION_POLICY_INVALID', { path: '$.presentationPolicy', reason: 'unsupported_or_unconfirmed_policy' }) };
}

// Projecao minima por secao (CAB-004 secoes 3-5). Nao altera o universo cientifico; apenas projeta a apresentacao.
function computeMinimumProjection(sectionsAsc, candidateAlternatives, evaluatedCount, validRawCount, maxParallel) {
  var minimumPassingBySection = [];
  var visibleCandidateIds = [];
  var hiddenCandidateIds = [];
  var noPassingSections = [];
  var minimumCandidates = [];
  var absenceEntries = [];
  sectionsAsc.forEach(function eachSection(section) {
    var validForSection = candidateAlternatives
      .filter(function bySection(c) { return c.section_mm2 === section; })
      .slice()
      .sort(function byNParallel(a, b) { return a.nParallel - b.nParallel; });
    var minItem = validForSection.length > 0 ? validForSection[0] : null;
    var candidateId = minItem ? minItem.candidateId : null;
    minimumPassingBySection.push({
      section_mm2: section,
      candidateId: candidateId,
      status: candidateId === null ? 'NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE' : 'PASSING_ALTERNATIVE_FOUND',
      evaluatedRange: { minimum: 1, maximum: maxParallel },
    });
    if (minItem) {
      visibleCandidateIds.push(candidateId);
      minimumCandidates.push(minItem);
      validForSection.slice(1).forEach(function pushHidden(c) { hiddenCandidateIds.push(c.candidateId); });
    } else {
      noPassingSections.push(section);
      absenceEntries.push({
        section_mm2: section,
        messageKey: 'presentation.no_passing_alternative_in_evaluated_range',
        messageArgs: { section_mm2: section, minimum: 1, maximum: maxParallel },
      });
    }
  });
  return {
    presentationProjection: {
      mode: 'MINIMUM_PASSING_PER_SECTION',
      rawCount: evaluatedCount,
      validRawCount: validRawCount,
      filteredCount: visibleCandidateIds.length,
      minimumPassingBySection: minimumPassingBySection,
      visibleCandidateIds: visibleCandidateIds,
      hiddenCandidateIds: hiddenCandidateIds,
      noPassingSections_mm2: noPassingSections,
    },
    minimumCandidates: minimumCandidates,
    absenceEntries: absenceEntries,
  };
}

// ---------- Orquestracao (SDD 5) ----------

/**
 * Interface publica L1-L3 prevista pelo SDD (CAB-BT-PARALLEL-SELECTION-EXP-1).
 * @param {object} input contrato de enumeracao/comparacao experimental.
 * @returns {object} Result Pattern experimental (MATHEMATICAL_ONLY em sucesso; BLOCKED em falha).
 */
function enumerateCablingBTParallelAlternativesExperimental(input) {
  // 1. Raiz objeto simples (fail-closed, sem lancar mesmo sem argumento).
  if (!isPlainObject(input)) {
    return problem('INPUT_STRUCTURE_INVALID', { path: '$', reason: 'root_not_plain_object' });
  }

  // 2-4. Estrutura, versao, metadados globais e confirmacoes.
  var structuralError = validateStructureAndGlobals(input);
  if (structuralError) return structuralError;

  // Politica de apresentacao (CAB-004): ausente/null => legado; objeto fechado exato => minimo por secao; senao => falha.
  var presentationPolicy = resolvePresentationPolicy(input);
  if (presentationPolicy.problem) return presentationPolicy.problem;
  var minimumMode = presentationPolicy.mode === 'MINIMUM';

  // 5. Modo/rastreabilidade/confirmacao do catalogo.
  var catalogMetaError = validateCatalogMeta(input);
  if (catalogMetaError) return catalogMetaError;

  // 6. Validacao por item (acumulada), homogeneidade e secao duplicada.
  var validated = validateCatalogItems(input);

  // Indice/ordem canonicos (secao asc, nulls por indice original) -> saida independente da ordem de entrada.
  var canonicalOrder = validated.map(function pair(e, i) { return { e: e, i: i }; }).sort(function cmp(a, b) {
    var as = a.e.section_mm2 === null ? Infinity : a.e.section_mm2;
    var bs = b.e.section_mm2 === null ? Infinity : b.e.section_mm2;
    if (as !== bs) return as - bs;
    return a.i - b.i;
  });
  canonicalOrder.forEach(function assign(o, pos) {
    o.e.catalogEntryIndex = pos;
    if (o.e.section_mm2 === null) o.e.catalogEntryId = 'catalog-entry-' + pos;
  });
  var orderedEntries = canonicalOrder.map(function pick(o) { return o.e; });

  // 8. Existe item completo?
  var completeEntries = validated.filter(function isComplete(entry) { return entry.complete; });
  if (completeEntries.length === 0) {
    var allErrors = [];
    validated.forEach(function collect(entry) { entry.detailedIssues.forEach(function push(issue) { allErrors.push(issue); }); });
    return problem('CATALOG_NO_EVALUABLE_CANDIDATE', { catalogEntryCount: validated.length, errors: allErrors });
  }

  // 9-10-11 (globais). Agrupamento e geometria globais.
  var groupingError = validateGroupingGlobal(input);
  if (groupingError) return groupingError;
  var geometryError = validateGeometryGlobal(input);
  if (geometryError) return geometryError;

  // 7. Poda confirmada (antes do universo) e registro de removidos.
  var pruning = input.pruning;
  var prunedCatalogEntries = [];
  var maxSection = null;
  if (isPlainObject(pruning) && pruning.maximumSection_mm2 !== null && pruning.maximumSection_mm2 !== undefined) {
    if (pruning.confirmed !== true || pruning.provenance !== 'ASSUMPTION_ONLY') {
      return problem('SUGGESTION_UNCONFIRMED', { path: '$.pruning.confirmed' });
    }
    if (!isFiniteNumber(pruning.maximumSection_mm2) || pruning.maximumSection_mm2 <= 0) {
      return problem('GLOBAL_METADATA_INVALID', { path: '$.pruning.maximumSection_mm2', reason: 'not_positive_finite' });
    }
    maxSection = pruning.maximumSection_mm2;
  }

  // Secao valida e unica -> id legivel; caso contrario id por indice (SDD 4.4).
  var sectionCounts = {};
  validated.forEach(function count(entry) {
    if (entry.section_mm2 !== null) { var k = String(entry.section_mm2); sectionCounts[k] = (sectionCounts[k] || 0) + 1; }
  });

  var retainedEntries = [];
  orderedEntries.forEach(function prune(entry) {
    if (maxSection !== null && entry.section_mm2 !== null && entry.section_mm2 > maxSection) {
      prunedCatalogEntries.push({ catalogEntryId: entry.catalogEntryId, catalogEntryIndex: entry.catalogEntryIndex, section_mm2: entry.section_mm2 });
      return;
    }
    retainedEntries.push(entry);
  });

  // 9-13. Universo cartesiano completo e avaliacao por combinacao (uma chamada L0 por combinacao avaliavel).
  var maxParallel = input.maxParallelCount;
  var evaluatedCandidates = [];
  var minContinuousProxy = null;
  var minProxySection = null;
  var numericFailure = null;

  retainedEntries.forEach(function eachEntry(entry) {
    if (numericFailure) return;
    var readableId = entry.section_mm2 !== null && sectionCounts[String(entry.section_mm2)] === 1;
    for (var nParallel = 1; nParallel <= maxParallel; nParallel += 1) {
      var candidateId = readableId ? (nParallel + 'x' + entry.section_mm2) : ('catalog-entry-' + entry.catalogEntryIndex + '-np-' + nParallel);
      var section = entry.section_mm2;
      var totalCopper = section !== null ? nParallel * section : null;

      // Item incompleto/defeituoso -> combinacao BLOCKED com blocker CANDIDATE_STRUCTURE_INVALID normalizado.
      if (!entry.complete) {
        evaluatedCandidates.push(buildBlockedCandidate(candidateId, entry, nParallel, totalCopper, 0, null, [], [{
          code: 'CANDIDATE_STRUCTURE_INVALID',
          params: { reason: entry.blockReason, catalogEntryId: entry.catalogEntryId, catalogEntryIndex: entry.catalogEntryIndex },
          severity: 'blocker',
        }]));
        continue;
      }

      // Agrupamento por combinacao.
      var kg = resolveGroupingForCombination(input, section, nParallel, candidateId);
      if (kg.issue) {
        evaluatedCandidates.push(buildBlockedCandidate(candidateId, entry, nParallel, totalCopper, 0, null, [], [{ code: kg.issue.code, params: kg.issue.params, severity: 'blocker' }]));
        continue;
      }

      // Geometria/branches por combinacao.
      var geometry = resolveGeometryForCombination(input, entry, section, nParallel, candidateId);
      if (geometry.issue) {
        evaluatedCandidates.push(buildBlockedCandidate(candidateId, entry, nParallel, totalCopper, 0, null, [], [{ code: geometry.issue.code, params: geometry.issue.params, severity: 'blocker' }]));
        continue;
      }

      // 19 (parcial). Finitude de intermediarios L1-L3, com atribuicao de campo (SDD 5 passo 19).
      if (!Number.isFinite(totalCopper)) { numericFailure = { field: 'totalCopper_mm2' }; return; }
      var correctedChk = entry.item.tabulatedAmpacity_A * kg.value;
      var continuousProxyChk = input.totalLoadCurrent_A / correctedChk;
      if (!Number.isFinite(continuousProxyChk)) { numericFailure = { field: 'minimumMargin' }; return; }
      if (!Number.isFinite(continuousProxyChk * 1000)) { numericFailure = { field: 'continuousProxy' }; return; }

      // DTO L0 e chamada unica.
      var dto = buildL0Dto(input, entry, nParallel, kg.value, geometry.geometry, geometry.branches);
      var l0 = calculateCablingBTParallelExperimental(dto);
      if (!l0 || l0.ok !== true) {
        var l0Error = l0 && l0.error ? l0.error : { code: 'L0_UNKNOWN', params: {} };
        var l0Blockers = l0 && Array.isArray(l0.blockers) ? l0.blockers : [];
        evaluatedCandidates.push(buildBlockedCandidate(candidateId, entry, nParallel, totalCopper, 1, l0 ? l0.classification : null, l0Blockers, [{ code: l0Error.code, params: isPlainObject(l0Error.params) ? l0Error.params : {}, severity: 'blocker' }]));
        continue;
      }

      // Metricas L1 e criterios.
      var metrics = computeMetrics(input, entry, nParallel, l0.data);
      // Margem de queda nao finita (ex.: limite de queda -> 0) encerra em falha atribuida ao comparador da fronteira.
      if (!Number.isFinite(metrics.voltageDrop.margin)) { numericFailure = { field: 'frontierComparator' }; return; }
      var continuousProxy = l0.data.capacityProxy.nParallelContinuousProxy;
      if (minContinuousProxy === null || continuousProxy < minContinuousProxy) { minContinuousProxy = continuousProxy; minProxySection = section; }

      var status = metrics.failedCriteria.length === 0 ? 'VALID' : 'REJECTED';
      evaluatedCandidates.push({
        candidateId: candidateId,
        catalogEntryId: entry.catalogEntryId,
        catalogEntryIndex: entry.catalogEntryIndex,
        section_mm2: section,
        nParallel: nParallel,
        totalCopper_mm2: totalCopper,
        status: status,
        l0CallCount: 1,
        l0Classification: l0.classification,
        l0Blockers: l0.blockers,
        l0SourceStatus: l0.sourceStatus,
        ampacity: metrics.ampacity,
        voltageDrop: metrics.voltageDrop,
        shortCircuit: metrics.shortCircuit,
        minimumMargin: metrics.minimumMargin,
        dominantCriteria: metrics.dominantCriteria,
        failedCriteria: metrics.failedCriteria,
        continuousProxy: continuousProxy,
        normalizedImpedance_ohm: entry.normalizedImpedance,
        assumptions: l0.assumptions,
        blockers: [],
        productionAllowed: false,
        installableSelection: null,
        _catalogMetadata: {
          material: entry.item.material, insulation: entry.item.insulation, installationMethod: entry.item.installationMethod, referenceTemperature_C: entry.item.referenceTemperature_C,
        },
        _objective: input.objective,
      });
    }
  });

  // Falha de finitude L1-L3 encerra em RFC 7807 de topo (SDD 5 passo 19).
  if (numericFailure) {
    return problem('NUMERIC_RESULT_NON_FINITE', { stage: 'L1-L3', field: numericFailure.field });
  }

  // 15. Particao e reconciliacao.
  var sortCanonical = function sortCanonical(list) { return list.slice().sort(canonicalCompare); };
  evaluatedCandidates = sortCanonical(evaluatedCandidates);
  var candidateAlternatives = sortCanonical(evaluatedCandidates.filter(function v(c) { return c.status === 'VALID'; }));
  var rejectedCandidates = sortCanonical(evaluatedCandidates.filter(function r(c) { return c.status === 'REJECTED' || c.status === 'BLOCKED'; }));
  var hasEvaluated = evaluatedCandidates.some(function e(c) { return c.status === 'VALID' || c.status === 'REJECTED'; });

  // Nenhuma combinacao avaliavel -> falha RFC 7807 de topo NO_EVALUABLE_COMBINATION (SDD 8/11).
  if (!hasEvaluated) {
    var blockersByCandidate = evaluatedCandidates.map(function b(c) { return { candidateId: c.candidateId, blockers: c.blockers }; });
    return problem('NO_EVALUABLE_COMBINATION', { evaluatedCount: 0, blockersByCandidate: blockersByCandidate });
  }

  // 18. providedCombination (sem promocao). Invalida -> falha RFC 7807 de topo.
  var providedCombination = null;
  if (isPlainObject(input.providedCombination)) {
    var pc = input.providedCombination;
    // O par nParallel x section deve pertencer ao universo U efetivamente formado (catalogo retido, SDD 4.8/10.1).
    var pcValid = isFiniteNumber(pc.section_mm2) && Number.isInteger(pc.nParallel) && pc.nParallel >= 1 && pc.nParallel <= maxParallel
      && retainedEntries.some(function s(entry) { return entry.section_mm2 === pc.section_mm2; });
    if (!pcValid) {
      return problem('PROVIDED_COMBINATION_INVALID', { section_mm2: pc.section_mm2, nParallel: pc.nParallel });
    }
    var pcId = pc.nParallel + 'x' + pc.section_mm2;
    var found = evaluatedCandidates.filter(function m(c) { return c.candidateId === pcId; })[0] || null;
    providedCombination = found ? projectCandidate(found) : { section_mm2: pc.section_mm2, nParallel: pc.nParallel, evaluated: false, installableSelection: null };
  }

  // 16-17. Fronteira e ordenacao (somente validas). Universo/fronteira NAO mudam com a politica.
  var nonDominated = computeFrontier(candidateAlternatives);
  var frontierProjected = sortCanonical(nonDominated).map(projectCandidate);

  // Projecao de apresentacao: legado ordena todas as validas; minimo por secao ordena apenas os minimos projetados.
  var presentationProjection = null;
  var absenceEntries = [];
  var presentationSource = candidateAlternatives;
  if (minimumMode) {
    var sectionSet = {};
    var sectionsAsc = [];
    retainedEntries.forEach(function collectSection(e) {
      if (e.section_mm2 !== null && !has(sectionSet, String(e.section_mm2))) { sectionSet[String(e.section_mm2)] = true; sectionsAsc.push(e.section_mm2); }
    });
    sectionsAsc.sort(function sortSec(a, b) { return a - b; });
    var proj = computeMinimumProjection(sectionsAsc, candidateAlternatives, evaluatedCandidates.length, candidateAlternatives.length, maxParallel);
    presentationProjection = proj.presentationProjection;
    absenceEntries = proj.absenceEntries;
    presentationSource = proj.minimumCandidates;
  }
  var presentationSorted = presentationSource.slice().sort(objectiveComparator(input.objective));
  var presentationOrder = presentationSorted.map(projectCandidate);
  var firstInPresentationOrder = presentationOrder.length > 0 ? presentationOrder[0] : null;

  var hasValid = candidateAlternatives.length > 0;
  var objectiveDisposition = !hasValid
    ? 'NO_VALID_ALTERNATIVE'
    : (input.objective === 'NONE' ? 'NO_CANDIDATE_ELECTED_PRESENTATION_ORDER_ONLY' : 'PRESENTATION_ORDER_ONLY_NO_ELECTION');

  // Aviso qualitativo de quantidade excessiva (proxy continuo excede maxParallelCount).
  var warnings = [];
  if (minContinuousProxy !== null && Math.ceil(minContinuousProxy) > maxParallel && minProxySection !== null) {
    warnings.push({
      code: 'EXCESSIVE_COUNT',
      candidateId: maxParallel + 'x' + minProxySection,
      continuousProxy: minContinuousProxy,
      continuousProxyDisplay: round3(minContinuousProxy),
      discreteRequired: Math.ceil(minContinuousProxy),
      maxParallelCount: maxParallel,
      note: 'evaluate_busway_qualitatively',
      normativeThreshold: null,
    });
  }

  var presentationModel = {
    notice: NOTICE,
    objective: input.objective,
    analysisMode: input.analysisMode,
    installationAuthorized: false,
    heading: 'ALTERNATIVA MATEMÁTICA CANDIDATA',
    cards: presentationSorted.map(buildPresentationCard),
  };
  if (minimumMode) {
    presentationModel.projectionMode = 'MINIMUM_PASSING_PER_SECTION';
    presentationModel.absenceEntries = absenceEntries;
  }

  var universe = {
    sections_mm2: retainedEntries.filter(function hv(e) { return e.section_mm2 !== null; }).map(function sm(e) { return e.section_mm2; }),
    nParallelRange: Array.from({ length: maxParallel }, function rng(_u, i) { return i + 1; }),
    evaluatedCount: evaluatedCandidates.length,
    prunedCatalogEntries: prunedCatalogEntries,
    silentPruning: false,
  };
  var data = {
    contractVersion: CONTRACT_VERSION,
    analysisMode: input.analysisMode,
    objective: input.objective,
    universe: universe,
    evaluatedCandidates: evaluatedCandidates.map(stripInternal),
    candidateAlternatives: candidateAlternatives.map(stripInternal),
    rejectedCandidates: rejectedCandidates.map(stripInternal),
    nonDominatedAlternatives: frontierProjected,
    presentationOrder: presentationOrder,
    firstInPresentationOrder: firstInPresentationOrder,
    objectiveDisposition: objectiveDisposition,
    providedCombination: providedCombination,
    installableSelection: null,
    discreteSelectionBlocked: true,
    installationAuthorized: false,
    presentationModel: presentationModel,
  };
  // CAB-004: no modo minimo por secao, a projecao e materializada; no legado permanece fisicamente ausente.
  if (minimumMode) data.presentationProjection = presentationProjection;

  // 19-20. Finitude de todo resultado numerico e envelope imutavel.
  if (!allFinite(data)) {
    return problem('NUMERIC_RESULT_NON_FINITE', { stage: 'L1-L3', field: 'aggregate' });
  }

  return {
    ok: true,
    classification: 'MATHEMATICAL_ONLY',
    data: data,
    assumptions: buildEnvelopeAssumptions(input),
    blockers: permanentBlockers(),
    warnings: warnings,
    sourceStatus: sourceStatus(),
    productionAllowed: false,
    displayNotice: NOTICE,
    error: null,
  };
}

// Combinacao bloqueada — campos numericos nulos (SDD 9.1).
function buildBlockedCandidate(candidateId, entry, nParallel, totalCopper, l0CallCount, l0Classification, l0Blockers, blockers) {
  return {
    candidateId: candidateId,
    catalogEntryId: entry.catalogEntryId,
    catalogEntryIndex: entry.catalogEntryIndex,
    section_mm2: entry.section_mm2,
    nParallel: nParallel,
    totalCopper_mm2: totalCopper,
    status: 'BLOCKED',
    l0CallCount: l0CallCount,
    l0Classification: l0Classification,
    l0Blockers: l0Blockers,
    l0SourceStatus: null,
    ampacity: null,
    voltageDrop: null,
    shortCircuit: null,
    minimumMargin: null,
    dominantCriteria: [],
    failedCriteria: [],
    continuousProxy: null,
    normalizedImpedance_ohm: entry.normalizedImpedance,
    assumptions: [],
    blockers: blockers,
    productionAllowed: false,
    installableSelection: null,
  };
}

// Remove chaves internas (prefixo _) antes de expor no envelope.
function stripInternal(candidate) {
  var copy = {};
  Object.keys(candidate).forEach(function keep(key) { if (key.charAt(0) !== '_') copy[key] = candidate[key]; });
  return copy;
}

function buildEnvelopeAssumptions(input) {
  var assumptions = [
    { id: 'AO-1', field: 'catalog.candidates[*].impedance', provenance: 'ASSUMPTION_ONLY' },
    { id: 'AO-2', field: 'grouping', provenance: 'ASSUMPTION_ONLY' },
    { id: 'AO-3', field: 'fault.adiabaticK_A_sqrt_s_per_mm2', provenance: 'ASSUMPTION_ONLY' },
    { id: 'AO-4', field: 'catalog.candidates[*].tabulatedAmpacity_A', provenance: 'ASSUMPTION_ONLY' },
  ];
  if (isPlainObject(input.fault) && isPlainObject(input.fault.imbalance) && input.fault.imbalance.mode === 'EXPLICIT_ASSUMPTION') {
    assumptions.push({ id: 'AO-6', field: 'fault.imbalance.deltaFault', provenance: 'ASSUMPTION_ONLY' });
  }
  return assumptions;
}

// Verifica finitude de todos os numeros do resultado (JSON valido; null permitido).
function allFinite(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(allFinite);
  if (isPlainObject(value)) return Object.keys(value).every(function k(key) { return allFinite(value[key]); });
  return true;
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { enumerateCablingBTParallelAlternativesExperimental: enumerateCablingBTParallelAlternativesExperimental };
}

if (typeof window !== 'undefined') {
  window.enumerateCablingBTParallelAlternativesExperimental = enumerateCablingBTParallelAlternativesExperimental;
}
