'use strict';

/*
 * Motor matematico experimental — Condutores BT em paralelo por fase (LABORATORIO).
 *
 * O.S.: CAB-BT-PARALLEL-001-BACKEND-GREEN-EXP (CHG-3 cientifica experimental, Governanca v7.3).
 * Contrato: docs/api/CAB_BT_PARALLEL_EXPERIMENTAL_SDD.md (CAB-BT-PARALLEL-001-SDD-EXP).
 * Ciencia: RNC-P_CAB_BT_PARALLEL_PRELIM.md, CAB_BT_PARALLEL_PRELIM_Memorial.md e o BDD irmao.
 * Baseline cientifica imutavel: 18627dd02c94265984aa953d35f47c2745cab61d.
 *
 * PRELIMINAR — NAO UTILIZAR PARA PROJETO, COMPRA OU INSTALACAO.
 *
 * Este e um prototipo de laboratorio. Todo sucesso permanece MATHEMATICAL_ONLY,
 * productionAllowed e sempre false e os bloqueios B-01..B-06 persistem. Nada aqui
 * dimensiona instalacao real, seleciona quantidade instalavel nem declara
 * conformidade IEC.
 *
 * Fronteiras (SDD secao 3.2):
 *  - funcao sincrona, deterministica e pura;
 *  - zero DOM, camada visual, saida de log, rede, filesystem, relogio ou aleatoriedade;
 *  - zero estado global mutavel; zero arredondamento interno (precisao de maquina);
 *  - complexos como { re, im } com reais finitos;
 *  - erros de entrada e de dominio retornam Result Pattern (RFC 7807), nunca lancam.
 */

var NOTICE = 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO';
var CONTRACT_VERSION = 'CAB-BT-PARALLEL-EXP-1';
var SCIENTIFIC_BASELINE_SHA = '18627dd02c94265984aa953d35f47c2745cab61d';

// Conjuntos de chaves conhecidas por escopo (SDD secao 4 / JSON Schema).
var KNOWN_KEYS = {
  root: [
    'contractVersion', 'totalLoadCurrent_A', 'powerFactor', 'nParallel',
    'nCircuits', 'geometry', 'branches', 'capacityProxy', 'fault',
  ],
  geometry: ['status', 'description'],
  branch: ['id', 'impedance_ohm', 'provenance'],
  impedance: ['re', 'im'],
  capacityProxy: ['groupingFactor', 'tabulatedAmpacityPerConductor_A'],
  valueProvenance: ['value', 'provenance'],
  fault: ['totalFaultCurrent_A', 'clearingTime_s', 'adiabaticK_A_sqrt_s_per_mm2', 'imbalance'],
  imbalance: ['mode', 'deltaFault', 'provenance'],
};

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

// Valor seguro para params: numeros finitos passam; ausencia/nao-finito vira null.
function safeNumber(value) {
  return isFiniteNumber(value) ? value : null;
}

// Motivo textualmente estavel (identificador, nao mensagem localizada).
function numberReason(value) {
  if (typeof value !== 'number') return value === undefined ? 'missing' : 'not_a_number';
  if (!Number.isFinite(value)) return 'not_finite';
  return 'out_of_range';
}

function buildSourceStatus() {
  return {
    classification: 'RNC-P_EXPERIMENTAL_NON_CANONICAL',
    scientificBaselineSha: SCIENTIFIC_BASELINE_SHA,
    primarySourceComplete: false,
    iecConformity: false,
  };
}

// Falha bloqueante — envelope completo RFC 7807 (SDD secao 6.2). Sem detail localizado.
function problem(code, params) {
  var safeParams = isPlainObject(params) ? params : {};
  return {
    ok: false,
    classification: 'BLOCKED',
    data: null,
    assumptions: [],
    blockers: [{ code: code, params: safeParams, severity: 'blocker' }],
    warnings: [],
    sourceStatus: buildSourceStatus(),
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

// Primeira chave desconhecida de um objeto simples (SDD 7.1 -> unexpected_property).
function firstUnknownKey(object, knownList, basePath) {
  var keys = Object.keys(object);
  for (var i = 0; i < keys.length; i += 1) {
    if (knownList.indexOf(keys[i]) === -1) return basePath + '.' + keys[i];
  }
  return null;
}

function findUnexpectedProperty(input) {
  var path = firstUnknownKey(input, KNOWN_KEYS.root, '$');
  if (path) return path;

  if (isPlainObject(input.geometry)) {
    path = firstUnknownKey(input.geometry, KNOWN_KEYS.geometry, '$.geometry');
    if (path) return path;
  }

  if (isPlainObject(input.capacityProxy)) {
    path = firstUnknownKey(input.capacityProxy, KNOWN_KEYS.capacityProxy, '$.capacityProxy');
    if (path) return path;
    if (isPlainObject(input.capacityProxy.groupingFactor)) {
      path = firstUnknownKey(input.capacityProxy.groupingFactor, KNOWN_KEYS.valueProvenance, '$.capacityProxy.groupingFactor');
      if (path) return path;
    }
    if (isPlainObject(input.capacityProxy.tabulatedAmpacityPerConductor_A)) {
      path = firstUnknownKey(input.capacityProxy.tabulatedAmpacityPerConductor_A, KNOWN_KEYS.valueProvenance, '$.capacityProxy.tabulatedAmpacityPerConductor_A');
      if (path) return path;
    }
  }

  if (isPlainObject(input.fault)) {
    path = firstUnknownKey(input.fault, KNOWN_KEYS.fault, '$.fault');
    if (path) return path;
    if (isPlainObject(input.fault.adiabaticK_A_sqrt_s_per_mm2)) {
      path = firstUnknownKey(input.fault.adiabaticK_A_sqrt_s_per_mm2, KNOWN_KEYS.valueProvenance, '$.fault.adiabaticK_A_sqrt_s_per_mm2');
      if (path) return path;
    }
    if (isPlainObject(input.fault.imbalance)) {
      path = firstUnknownKey(input.fault.imbalance, KNOWN_KEYS.imbalance, '$.fault.imbalance');
      if (path) return path;
    }
  }

  if (Array.isArray(input.branches)) {
    for (var i = 0; i < input.branches.length; i += 1) {
      var branch = input.branches[i];
      if (isPlainObject(branch)) {
        path = firstUnknownKey(branch, KNOWN_KEYS.branch, '$.branches[' + i + ']');
        if (path) return path;
        if (isPlainObject(branch.impedance_ohm)) {
          path = firstUnknownKey(branch.impedance_ohm, KNOWN_KEYS.impedance, '$.branches[' + i + '].impedance_ohm');
          if (path) return path;
        }
      }
    }
  }

  return null;
}

// Estrutura de containers e propriedades desconhecidas (SDD secao 7, precedencia 1).
// Somente os tres containers geometry/capacityProxy/fault usam missing_structural_container.
function validateStructure(input) {
  if (has(input, 'branches') && !Array.isArray(input.branches)) {
    return problem('INPUT_STRUCTURE_INVALID', { path: '$.branches', reason: 'wrong_container_type' });
  }
  var containers = ['geometry', 'capacityProxy', 'fault'];
  var i;
  for (i = 0; i < containers.length; i += 1) {
    if (has(input, containers[i]) && !isPlainObject(input[containers[i]])) {
      return problem('INPUT_STRUCTURE_INVALID', { path: '$.' + containers[i], reason: 'wrong_container_type' });
    }
  }
  var unexpected = findUnexpectedProperty(input);
  if (unexpected) {
    return problem('INPUT_STRUCTURE_INVALID', { path: unexpected, reason: 'unexpected_property' });
  }
  for (i = 0; i < containers.length; i += 1) {
    if (!has(input, containers[i])) {
      return problem('INPUT_STRUCTURE_INVALID', { path: '$.' + containers[i], reason: 'missing_structural_container' });
    }
  }
  return null;
}

// Validacao escalar/semantica na ordem vinculante do SDD secao 7. Retorna o primeiro erro.
function validateSemantics(input) {
  if (input.contractVersion !== CONTRACT_VERSION) {
    return problem('CONTRACT_VERSION_UNSUPPORTED', { received: input.contractVersion, allowed: CONTRACT_VERSION });
  }

  if (!isFiniteNumber(input.totalLoadCurrent_A) || input.totalLoadCurrent_A <= 0) {
    return problem('LOAD_CURRENT_INVALID', { field: 'totalLoadCurrent_A', reason: numberReason(input.totalLoadCurrent_A), value: safeNumber(input.totalLoadCurrent_A) });
  }

  if (!isFiniteNumber(input.powerFactor) || input.powerFactor < 0 || input.powerFactor > 1) {
    return problem('POWER_FACTOR_INVALID', { field: 'powerFactor', reason: numberReason(input.powerFactor), value: safeNumber(input.powerFactor) });
  }

  if (!Number.isInteger(input.nParallel) || input.nParallel < 1) {
    return problem('PARALLEL_COUNT_INVALID', { value: safeNumber(input.nParallel) });
  }

  if (!Number.isInteger(input.nCircuits) || input.nCircuits < 1) {
    return problem('CIRCUIT_COUNT_INVALID', { value: safeNumber(input.nCircuits) });
  }

  var geometry = input.geometry;
  if (geometry.status !== 'NOT_PROVIDED' && geometry.status !== 'DESCRIBED') {
    return problem('GEOMETRY_STATUS_INVALID', { status: typeof geometry.status === 'string' ? geometry.status : null });
  }
  if (geometry.status === 'DESCRIBED' && (typeof geometry.description !== 'string' || geometry.description.length === 0)) {
    return problem('GEOMETRY_STATUS_INVALID', { status: geometry.status });
  }

  // Presenca do conjunto de impedancias (precedencia SDD secao 7).
  var hasBranches = Array.isArray(input.branches) && input.branches.length > 0;
  if (!hasBranches) {
    if (geometry.status === 'NOT_PROVIDED') {
      return problem('GEOMETRY_AND_IMPEDANCE_MISSING', { nParallel: input.nParallel });
    }
    return problem('PARALLEL_Z_MISSING', { expected: input.nParallel, observed: 0 });
  }

  if (input.branches.length !== input.nParallel) {
    return problem('PARALLEL_Z_MISSING', { expected: input.nParallel, observed: input.branches.length });
  }

  // IDs: presenca, tipo, nao vazio e unicidade.
  var seenIds = {};
  var index;
  for (index = 0; index < input.branches.length; index += 1) {
    var candidate = input.branches[index];
    if (!isPlainObject(candidate)) {
      return problem('PARALLEL_Z_MISSING', { expected: input.nParallel, observed: input.branches.length });
    }
    if (typeof candidate.id !== 'string' || candidate.id.length === 0 || has(seenIds, candidate.id)) {
      return problem('PARALLEL_BRANCH_ID_INVALID', { branchId: typeof candidate.id === 'string' ? candidate.id : null });
    }
    seenIds[candidate.id] = true;
  }

  // Impedancias: presenca dos componentes, finitude e modulo maior que zero.
  for (index = 0; index < input.branches.length; index += 1) {
    var impedance = input.branches[index].impedance_ohm;
    var branchId = input.branches[index].id;
    if (!isPlainObject(impedance) || !has(impedance, 're') || !has(impedance, 'im')) {
      return problem('PARALLEL_Z_MISSING', { branchId: branchId, expected: input.nParallel, observed: input.branches.length });
    }
    if (!isFiniteNumber(impedance.re)) {
      return problem('PARALLEL_Z_NON_FINITE', { branchId: branchId, component: 're' });
    }
    if (!isFiniteNumber(impedance.im)) {
      return problem('PARALLEL_Z_NON_FINITE', { branchId: branchId, component: 'im' });
    }
    if (impedance.re === 0 && impedance.im === 0) {
      return problem('PARALLEL_Z_ZERO', { branchId: branchId });
    }
  }

  // Proveniencia obrigatoria de cada ramo.
  for (index = 0; index < input.branches.length; index += 1) {
    if (input.branches[index].provenance !== 'ASSUMPTION_ONLY') {
      return problem('ASSUMPTION_PROVENANCE_INVALID', { field: '$.branches[' + index + '].provenance', expected: 'ASSUMPTION_ONLY' });
    }
  }

  // Capacidade: k_g, proveniencia e ampacidade tabulada.
  var capacity = input.capacityProxy;
  var groupingFactor = capacity.groupingFactor;
  if (!isPlainObject(groupingFactor)) {
    return problem('GROUPING_FACTOR_MISSING', { field: '$.capacityProxy.groupingFactor' });
  }
  if (!isFiniteNumber(groupingFactor.value) || groupingFactor.value <= 0 || groupingFactor.value > 1) {
    return problem('GROUPING_FACTOR_INVALID', { value: safeNumber(groupingFactor.value) });
  }
  if (!has(groupingFactor, 'provenance')) {
    return problem('GROUPING_PROVENANCE_MISSING', { field: '$.capacityProxy.groupingFactor.provenance' });
  }
  if (groupingFactor.provenance !== 'ASSUMPTION_ONLY') {
    return problem('ASSUMPTION_PROVENANCE_INVALID', { field: '$.capacityProxy.groupingFactor.provenance', expected: 'ASSUMPTION_ONLY' });
  }
  var tabulated = capacity.tabulatedAmpacityPerConductor_A;
  if (!isPlainObject(tabulated) || !isFiniteNumber(tabulated.value) || tabulated.value <= 0) {
    return problem('TABULATED_AMPACITY_INVALID', { value: isPlainObject(tabulated) ? safeNumber(tabulated.value) : null });
  }
  if (tabulated.provenance !== 'ASSUMPTION_ONLY') {
    return problem('ASSUMPTION_PROVENANCE_INVALID', { field: '$.capacityProxy.tabulatedAmpacityPerConductor_A.provenance', expected: 'ASSUMPTION_ONLY' });
  }

  // Falta: corrente, tempo, constante adiabatica e modo de desbalanco.
  var fault = input.fault;
  if (!isFiniteNumber(fault.totalFaultCurrent_A) || fault.totalFaultCurrent_A < 0) {
    return problem('FAULT_CURRENT_INVALID', { field: 'totalFaultCurrent_A', reason: numberReason(fault.totalFaultCurrent_A), value: safeNumber(fault.totalFaultCurrent_A) });
  }
  if (!isFiniteNumber(fault.clearingTime_s) || fault.clearingTime_s < 0) {
    return problem('FAULT_TIME_INVALID', { field: 'clearingTime_s', reason: numberReason(fault.clearingTime_s), value: safeNumber(fault.clearingTime_s) });
  }
  var adiabaticK = fault.adiabaticK_A_sqrt_s_per_mm2;
  if (!isPlainObject(adiabaticK) || !isFiniteNumber(adiabaticK.value) || adiabaticK.value <= 0) {
    return problem('ADIABATIC_K_INVALID', { value: isPlainObject(adiabaticK) ? safeNumber(adiabaticK.value) : null });
  }
  if (adiabaticK.provenance !== 'ASSUMPTION_ONLY') {
    return problem('ASSUMPTION_PROVENANCE_INVALID', { field: '$.fault.adiabaticK_A_sqrt_s_per_mm2.provenance', expected: 'ASSUMPTION_ONLY' });
  }
  var imbalance = fault.imbalance;
  var mode = imbalance.mode;
  if (mode === 'BLOCK') {
    return problem('FAULT_IMBALANCE_MISSING', { mode: 'BLOCK' });
  }
  if (mode !== 'EXPLICIT_ASSUMPTION' && mode !== 'CONSERVATIVE_SINGLE_BRANCH') {
    return problem('FAULT_IMBALANCE_INVALID', { mode: typeof mode === 'string' ? mode : null });
  }
  if (mode === 'EXPLICIT_ASSUMPTION') {
    if (!has(imbalance, 'deltaFault')) {
      return problem('FAULT_IMBALANCE_MISSING', { mode: mode });
    }
    if (!isFiniteNumber(imbalance.deltaFault) || imbalance.deltaFault < 1) {
      return problem('FAULT_IMBALANCE_INVALID', { value: safeNumber(imbalance.deltaFault) });
    }
    if (imbalance.provenance !== 'ASSUMPTION_ONLY') {
      return problem('ASSUMPTION_PROVENANCE_INVALID', { field: '$.fault.imbalance.provenance', expected: 'ASSUMPTION_ONLY' });
    }
  }

  return null;
}

// Reciproco complexo 1/Z = conj(Z)/|Z|^2 (Y_i = 1/Z_i, SDD 5.1).
function reciprocal(re, im) {
  var denom = re * re + im * im;
  return { re: re / denom, im: -im / denom };
}

// Blockers normativos permanentes retornados cumulativamente no sucesso (SDD 6.1).
function permanentBlockers(geometryStatus) {
  var adequacyReason = geometryStatus === 'NOT_PROVIDED'
    ? 'geometry_not_provided'
    : 'normative_source_incomplete';
  return [
    { code: 'B-01', severity: 'blocker' },
    { code: 'B-02', severity: 'blocker' },
    { code: 'B-03', severity: 'blocker' },
    { code: 'B-04', severity: 'blocker' },
    { code: 'B-05', severity: 'blocker' },
    { code: 'B-06', severity: 'blocker' },
    { code: 'ENGINEERING_ADEQUACY_BLOCKED', params: { reason: adequacyReason }, severity: 'blocker' },
    { code: 'DISCRETE_SELECTION_BLOCKED', severity: 'blocker' },
    { code: 'IEC_CONFORMITY_BLOCKED', severity: 'blocker' },
    { code: 'PRODUCTION_USE_BLOCKED', severity: 'blocker' },
  ];
}

// Nucleo matematico. Assume entrada ja validada. Precisao de maquina, sem arredondamento.
function computeMathematics(input) {
  var totalLoadCurrent = input.totalLoadCurrent_A;
  var nParallel = input.nParallel;
  var powerFactor = input.powerFactor;
  var groupingFactor = input.capacityProxy.groupingFactor.value;
  var tabulatedAmpacity = input.capacityProxy.tabulatedAmpacityPerConductor_A.value;
  var adiabaticK = input.fault.adiabaticK_A_sqrt_s_per_mm2.value;
  var totalFaultCurrent = input.fault.totalFaultCurrent_A;
  var clearingTime = input.fault.clearingTime_s;
  var mode = input.fault.imbalance.mode;

  // Admitancias e soma complexa (SDD 5.1).
  var admittances = input.branches.map(function mapAdmittance(branch) {
    return reciprocal(branch.impedance_ohm.re, branch.impedance_ohm.im);
  });
  var sumY = admittances.reduce(function accumulate(acc, y) {
    return { re: acc.re + y.re, im: acc.im + y.im };
  }, { re: 0, im: 0 });
  var sumYmagnitudeSquared = sumY.re * sumY.re + sumY.im * sumY.im;

  // Impedancia equivalente Zeq = (soma Y)^-1 (SDD 5.2).
  var equivalentImpedance = {
    re: sumY.re / sumYmagnitudeSquared,
    im: -sumY.im / sumYmagnitudeSquared,
  };

  // Correntes complexas por ramo I_i = I_tot * Y_i / soma(Y) (SDD 5.1).
  var branchCurrents = input.branches.map(function mapCurrent(branch, position) {
    var y = admittances[position];
    var fractionRe = (y.re * sumY.re + y.im * sumY.im) / sumYmagnitudeSquared;
    var fractionIm = (y.im * sumY.re - y.re * sumY.im) / sumYmagnitudeSquared;
    var currentRe = totalLoadCurrent * fractionRe;
    var currentIm = totalLoadCurrent * fractionIm;
    return {
      id: branch.id,
      current_A: {
        re: currentRe,
        im: currentIm,
        magnitude: Math.hypot(currentRe, currentIm),
      },
    };
  });

  // Ramo mais carregado e desbalanco de carga (SDD 5.3); empate pelo primeiro na ordem de entrada.
  var maxMagnitude = -Infinity;
  branchCurrents.forEach(function trackMax(entry) {
    if (entry.current_A.magnitude > maxMagnitude) maxMagnitude = entry.current_A.magnitude;
  });
  var tiedMostLoadedBranchIds = branchCurrents.filter(function isTied(entry) {
    var magnitude = entry.current_A.magnitude;
    return Math.abs(magnitude - maxMagnitude) <= Number.EPSILON * Math.max(1, magnitude, maxMagnitude);
  }).map(function pickId(entry) {
    return entry.id;
  });
  var deltaLoad = maxMagnitude / (totalLoadCurrent / nParallel);
  var deratingFactor = 1 / deltaLoad;

  // Proxy contInuo de capacidade — nunca instalavel (SDD 5.4).
  var correctedAmpacityPerConductor = tabulatedAmpacity * groupingFactor;
  var totalAdmissibleCurrentProxy = (nParallel * correctedAmpacityPerConductor) / deltaLoad;
  var nParallelContinuousProxy = (totalLoadCurrent * deltaLoad) / correctedAmpacityPerConductor;

  // Queda de tensao matematica em volts (SDD 5.5); percentual e limite normativo permanecem nulos.
  var sinPhi = Math.sqrt(1 - powerFactor * powerFactor);
  var threePhaseVoltageDrop = Math.sqrt(3) * totalLoadCurrent
    * (equivalentImpedance.re * powerFactor + equivalentImpedance.im * sinPhi);

  // Adiabatico por ramo (SDD 5.6). deltaFault e independente de deltaLoad.
  var deltaFaultEffective;
  var branchFaultCurrent;
  if (mode === 'EXPLICIT_ASSUMPTION') {
    deltaFaultEffective = input.fault.imbalance.deltaFault;
    branchFaultCurrent = (totalFaultCurrent / nParallel) * deltaFaultEffective;
  } else {
    // CONSERVATIVE_SINGLE_BRANCH: um unico ramo conduz a falta total; deltaFault=nParallel e so rotulo.
    deltaFaultEffective = nParallel;
    branchFaultCurrent = totalFaultCurrent;
  }
  var minimumSectionContinuous = (branchFaultCurrent * Math.sqrt(clearingTime)) / adiabaticK;

  return {
    branchCurrents: branchCurrents,
    equivalentImpedance: equivalentImpedance,
    mostLoadedBranchId: tiedMostLoadedBranchIds[0],
    tiedMostLoadedBranchIds: tiedMostLoadedBranchIds,
    deltaLoad: deltaLoad,
    deratingFactor: deratingFactor,
    correctedAmpacityPerConductor: correctedAmpacityPerConductor,
    totalAdmissibleCurrentProxy: totalAdmissibleCurrentProxy,
    nParallelContinuousProxy: nParallelContinuousProxy,
    threePhaseVoltageDrop: threePhaseVoltageDrop,
    faultMode: mode,
    deltaFaultEffective: deltaFaultEffective,
    branchFaultCurrent: branchFaultCurrent,
    minimumSectionContinuous: minimumSectionContinuous,
  };
}

// Monta as hipoteses efetivamente consumidas (SDD secao 13 / 6.1).
function buildAssumptions(input) {
  var assumptions = [
    { id: 'AO-1', field: 'branches[*].impedance_ohm', provenance: 'ASSUMPTION_ONLY' },
    { id: 'AO-2', field: 'capacityProxy.groupingFactor', value: input.capacityProxy.groupingFactor.value, provenance: 'ASSUMPTION_ONLY' },
    { id: 'AO-3', field: 'fault.adiabaticK_A_sqrt_s_per_mm2', value: input.fault.adiabaticK_A_sqrt_s_per_mm2.value, provenance: 'ASSUMPTION_ONLY' },
    { id: 'AO-4', field: 'capacityProxy.tabulatedAmpacityPerConductor_A', value: input.capacityProxy.tabulatedAmpacityPerConductor_A.value, provenance: 'ASSUMPTION_ONLY' },
  ];
  if (input.fault.imbalance.mode === 'EXPLICIT_ASSUMPTION') {
    assumptions.push({ id: 'AO-6', field: 'fault.imbalance.deltaFault', value: input.fault.imbalance.deltaFault, provenance: 'ASSUMPTION_ONLY' });
  }
  return assumptions;
}

/**
 * Interface publica prevista pelo SDD.
 * @param {object} input contrato CAB-BT-PARALLEL-EXP-1.
 * @returns {object} Result Pattern experimental (MATHEMATICAL_ONLY em sucesso; BLOCKED em falha).
 */
function calculateCablingBTParallelExperimental(input) {
  // 1. Estrutura da raiz (fail-closed, sem lancar mesmo sem argumento).
  if (!isPlainObject(input)) {
    return problem('INPUT_STRUCTURE_INVALID', { path: '$', reason: 'root_not_plain_object' });
  }

  // 2. Containers, propriedades desconhecidas e containers ausentes.
  var structuralError = validateStructure(input);
  if (structuralError) return structuralError;

  // 3. Validacao escalar/semantica na ordem vinculante.
  var semanticError = validateSemantics(input);
  if (semanticError) return semanticError;

  // 4. Calculos matematicos (precisao de maquina).
  var math = computeMathematics(input);

  // 5. Finitude dos resultados (fail-closed pos-calculo, SDD secao 7 passo 9).
  var finiteGuard = [
    math.equivalentImpedance.re,
    math.equivalentImpedance.im,
    math.deltaLoad,
    math.deratingFactor,
    math.correctedAmpacityPerConductor,
    math.totalAdmissibleCurrentProxy,
    math.nParallelContinuousProxy,
    math.threePhaseVoltageDrop,
    math.branchFaultCurrent,
    math.minimumSectionContinuous,
  ];
  var currentIndex;
  for (currentIndex = 0; currentIndex < math.branchCurrents.length; currentIndex += 1) {
    var current = math.branchCurrents[currentIndex].current_A;
    finiteGuard.push(current.re, current.im, current.magnitude);
  }
  for (currentIndex = 0; currentIndex < finiteGuard.length; currentIndex += 1) {
    if (!Number.isFinite(finiteGuard[currentIndex])) {
      return problem('NUMERIC_RESULT_NON_FINITE', { stage: 'mathematics', field: 'aggregate' });
    }
  }

  // 6. Envelope de sucesso MATHEMATICAL_ONLY.
  var data = {
    contractVersion: input.contractVersion,
    inputEcho: {
      nParallel: input.nParallel,
      nCircuits: input.nCircuits,
      geometryStatus: input.geometry.status,
    },
    loadSharing: {
      branchCurrents: math.branchCurrents,
      mostLoadedBranchId: math.mostLoadedBranchId,
      tiedMostLoadedBranchIds: math.tiedMostLoadedBranchIds,
      deltaLoad: math.deltaLoad,
      deratingFactor: math.deratingFactor,
      equivalentImpedance_ohm: math.equivalentImpedance,
    },
    capacityProxy: {
      correctedAmpacityPerConductor_A: math.correctedAmpacityPerConductor,
      totalAdmissibleCurrentProxy_A: math.totalAdmissibleCurrentProxy,
      nParallelContinuousProxy: math.nParallelContinuousProxy,
      providedParallelCount: input.nParallel,
      providedCountMeetsContinuousProxy: input.nParallel >= math.nParallelContinuousProxy,
      installableSelection: null,
      discreteSelectionBlocked: true,
    },
    voltageDrop: {
      threePhase_V: math.threePhaseVoltageDrop,
      voltageDropPercent: null,
      normativeVoltageDropLimit: null,
    },
    faultAdiabatic: {
      mode: math.faultMode,
      deltaFaultEffective: math.deltaFaultEffective,
      branchFaultCurrent_A: math.branchFaultCurrent,
      minimumSectionContinuous_mm2: math.minimumSectionContinuous,
      installableSection: null,
    },
  };

  return {
    ok: true,
    classification: 'MATHEMATICAL_ONLY',
    data: data,
    assumptions: buildAssumptions(input),
    blockers: permanentBlockers(input.geometry.status),
    warnings: [],
    sourceStatus: buildSourceStatus(),
    productionAllowed: false,
    displayNotice: NOTICE,
    error: null,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateCablingBTParallelExperimental: calculateCablingBTParallelExperimental };
}

if (typeof window !== 'undefined') {
  window.calculateCablingBTParallelExperimental = calculateCablingBTParallelExperimental;
}
