/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AmpAI — ui_render.js  (O.S. #006-TDD + O.S. #012)
 * Renderizador Modular: BT e MT
 *
 * ARQUITETURA (Governança v6.0 — SoC estrita):
 * • Motores (core_cabos_*.js) são PUROS: recebem payload, devolvem payload.
 * • TODA leitura de DOM e reatividade vive AQUI (readBTInputsFromUI + eventos).
 * • window.switchModule(name) — troca módulos visíveis (shortcircuit / cabling)
 * • window.switchCablingCard(card) — troca entre BT e MT dentro do módulo cabling
 * • Event Delegation via document (jamais perde binding após recriar DOM)
 * • runUITests() — Suite TDD in-browser (injetada ao final do arquivo)
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers puros (sem estado)
// ─────────────────────────────────────────────────────────────────────────────
window.isRendering = false; // Flag Global Anti-Loop
window.AmpAI_State = window.AmpAI_State || {}; // Estado global dos seletores

const _ok  = () => '<span style="color:var(--success);font-weight:700;">✓ OK</span>';
const _dom = () => `<span style="color:var(--accent);font-weight:700;">★ ${_tbt('mt.tbl.statusDominant')}</span>`;
const _err = () => '<span style="color:var(--danger);font-weight:700;">✗ Excedido</span>';
const _fmt = (v, d = 2) => {
    const n = Number(v);
    return isNaN(n) ? '--' : n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
};

// ─────────────────────────────────────────────────────────────────────────────
// O.S. 045 — Helpers de acessibilidade dinâmica
// Expõem/limpam aria-invalid + aria-describedby nos campos associados ao
// alert-banner que reporta o erro. Reutilizados por BT, MT e ICC.
// ─────────────────────────────────────────────────────────────────────────────
window.setAccessibleError = function(inputIds, bannerId) {
    (inputIds || []).forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', bannerId);
    });
};

window.clearAccessibleError = function(inputIds) {
    (inputIds || []).forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
    });
};

// Mapa código QA (SDD O.S. 046/047/048) → campo(s) DOM implicado(s).
// Cobre o catálogo completo de erros e avisos (docs/api/OS046_Erros_Avisos_SDD.md).
// Permite apontar aria-describedby/aria-invalid para o campo certo sem alterar os motores.
const BT_ERROR_FIELDS = {
    'QA-BT-001': ['bt-in', 'bt-ib'],
    'QA-BT-002': ['bt-ncirc'],
    'QA-BT-003': ['bt-length'],
    'QA-BT-004': ['bt-icc'],
    'QA-BT-005': ['bt-tprot'],
    'QA-BT-006': ['bt-cosphi'],
    'QA-BT-007': ['bt-tamb'],
    'QA-BT-010': ['bt-in'],
    'QA-BT-011': ['bt-method', 'bt-ncirc']
};
const BT_MAPPED_FIELDS = [...new Set(Object.values(BT_ERROR_FIELDS).flat())];

const MT_ERROR_FIELDS = {
    'QA-MT-001': ['mt-insulation-class'],
    'QA-MT-002': ['mt-insulation-class'],
    'QA-MT-003': ['mt-insulation-class'],
    'QA-MT-004': ['mt-insulation-class'],
    'QA-MT-005': ['mt-ib'],
    'QA-MT-006': ['mt-cosphi'],
    'QA-MT-007': ['mt-ull'],
    'QA-MT-010': ['mt-icc'],
    'QA-MT-011': ['mt-icc'],
    'QA-MT-012': ['mt-tcond'],
    'QA-MT-013': ['mt-tcond'],
    'QA-MT-014': ['mt-tcond'],
    'QA-MT-015': ['mt-ifault'],
    'QA-MT-020': ['mt-tamb'],
    'QA-MT-021': ['mt-tamb'],
    'QA-MT-022': ['mt-rho-soil'],
    'QA-MT-023': ['mt-rho-soil'],
    'QA-MT-024': ['mt-depth'],
    'QA-MT-025': ['mt-depth'],
    'QA-MT-030': [],
    'QA-MT-032': ['mt-ifault', 'mt-tscreen'],
    'QA-MT-033': ['mt-ifault', 'mt-tscreen'],
    'QA-MT-034': ['mt-ncirc'],
    'QA-MT-035': ['mt-ncirc'],
    'QA-MT-036': ['mt-length'],
    'QA-MT-037': ['mt-length'],
    'QA-MT-038': ['mt-du-max'],
    'QA-MT-040': [],
    'QA-MT-041': ['mt-ib'],
    'QA-MT-042': ['mt-tamb', 'mt-rho-soil', 'mt-depth', 'mt-ncirc'],
    'QA-MT-043': ['mt-ull'],
    'QA-MT-044': ['mt-in'],
    'QA-MT-045': ['mt-in', 'mt-ib'],
    'QA-MT-046': [],
    'QA-MT-047': ['mt-formation']
};
const MT_MAPPED_FIELDS = [...new Set(Object.values(MT_ERROR_FIELDS).flat())];

// O.S. 050 — aria-describedby apenas (sem aria-invalid): um warning não torna
// o campo inválido (envelope.ok permanece true) — apenas adiciona contexto
// perceptível a leitores de tela, sem acusar o valor de estar errado.
window.setAccessibleNote = function(inputIds, bannerId) {
    (inputIds || []).forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.setAttribute('aria-describedby', bannerId);
    });
};
window.clearAccessibleNote = function(inputIds) {
    (inputIds || []).forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.removeAttribute('aria-describedby');
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// O.S. 050 — Catálogo de localização de diagnósticos (Contrato SDD O.S. 046).
// Os motores (core_cabos_*.js) emitem SOMENTE {code, params}; toda mensagem
// humana em PT/EN/ES é resolvida exclusivamente aqui a partir desse par.
// ─────────────────────────────────────────────────────────────────────────────
const DIAGNOSTIC_MESSAGES = {
    'QA-BT-001': {
        pt: (p) => `A corrente nominal do disjuntor (In = ${p.In_A} A) é menor que a corrente de projeto do circuito (Ib = ${p.Ib_A} A). O disjuntor deve suportar a corrente de projeto.`,
        en: (p) => `The breaker rated current (In = ${p.In_A} A) is lower than the circuit design current (Ib = ${p.Ib_A} A). The breaker must withstand the design current.`,
        es: (p) => `La corriente nominal del interruptor (In = ${p.In_A} A) es menor que la corriente de diseño del circuito (Ib = ${p.Ib_A} A). El interruptor debe soportar la corriente de diseño.`
    },
    'QA-BT-002': {
        pt: (p) => `O número de circuitos agrupados informado (${p.nCircuits}) deve ser no mínimo 1.`,
        en: (p) => `The provided number of grouped circuits (${p.nCircuits}) must be at least 1.`,
        es: (p) => `El número de circuitos agrupados informado (${p.nCircuits}) debe ser como mínimo 1.`
    },
    'QA-BT-003': {
        pt: (p) => `O comprimento do circuito informado (${p.length_m} m) deve ser maior que zero.`,
        en: (p) => `The provided circuit length (${p.length_m} m) must be greater than zero.`,
        es: (p) => `La longitud del circuito informada (${p.length_m} m) debe ser mayor que cero.`
    },
    'QA-BT-004': {
        pt: (p) => `A corrente de curto-circuito informada (${(p.Icc_A || 0) / 1000} kA) deve ser maior que zero.`,
        en: (p) => `The provided short-circuit current (${(p.Icc_A || 0) / 1000} kA) must be greater than zero.`,
        es: (p) => `La corriente de cortocircuito informada (${(p.Icc_A || 0) / 1000} kA) debe ser mayor que cero.`
    },
    'QA-BT-005': {
        pt: (p) => {
            const t = p.t_s ?? p.tProt_s;
            const max = p.recommendedMax_s;
            return max !== undefined
                ? `O tempo de atuação da proteção informado (${t} segundos) é maior que o limite recomendado de ${max} segundos para este critério de curto-circuito. O dimensionamento prossegue, mas verifique a coordenação da proteção.`
                : `O tempo de atuação da proteção informado (${t} segundos) está acima do usual para este critério de curto-circuito. O dimensionamento prossegue, mas verifique a coordenação da proteção.`;
        },
        en: (p) => {
            const t = p.t_s ?? p.tProt_s;
            const max = p.recommendedMax_s;
            return max !== undefined
                ? `The provided protection trip time (${t} seconds) exceeds the recommended limit of ${max} seconds for this short-circuit criterion. Sizing proceeds, but review protection coordination.`
                : `The provided protection trip time (${t} seconds) is above typical for this short-circuit criterion. Sizing proceeds, but review protection coordination.`;
        },
        es: (p) => {
            const t = p.t_s ?? p.tProt_s;
            const max = p.recommendedMax_s;
            return max !== undefined
                ? `El tiempo de actuación de la protección informado (${t} segundos) supera el límite recomendado de ${max} segundos para este criterio de cortocircuito. El dimensionamiento continúa, pero verifique la coordinación de la protección.`
                : `El tiempo de actuación de la protección informado (${t} segundos) está por encima de lo habitual para este criterio de cortocircuito. El dimensionamiento continúa, pero verifique la coordinación de la protección.`;
        }
    },
    'QA-BT-006': {
        pt: (p) => `O fator de potência informado (cosφ = ${p.cosPhi}) deve estar entre 0,70 e 1,00.`,
        en: (p) => `The provided power factor (cosφ = ${p.cosPhi}) must be between 0.70 and 1.00.`,
        es: (p) => `El factor de potencia informado (cosφ = ${p.cosPhi}) debe estar entre 0,70 y 1,00.`
    },
    'QA-BT-007': {
        pt: (p) => `A temperatura ambiente informada (${p.thetaAmb_C} °C) atingiu ou superou a temperatura máxima admissível da isolação (${p.tMax} °C).`,
        en: (p) => `The provided ambient temperature (${p.thetaAmb_C} °C) reached or exceeded the insulation's maximum admissible temperature (${p.tMax} °C).`,
        es: (p) => `La temperatura ambiente informada (${p.thetaAmb_C} °C) alcanzó o superó la temperatura máxima admisible del aislamiento (${p.tMax} °C).`
    },
    'QA-BT-010': {
        pt: (p) => `Nenhuma seção padronizada atende ao critério de ampacidade: mesmo na maior seção da tabela, a capacidade corrigida (${p.Iz_corr} A) é menor que a corrente nominal do disjuntor (In = ${p.In_A} A). Revise os fatores de correção ou o método de instalação.`,
        en: (p) => `No standard section satisfies the ampacity criterion: even at the table's largest section, the corrected capacity (${p.Iz_corr} A) is lower than the breaker rated current (In = ${p.In_A} A). Review the correction factors or installation method.`,
        es: (p) => `Ninguna sección normalizada cumple el criterio de amperaje: incluso en la mayor sección de la tabla, la capacidad corregida (${p.Iz_corr} A) es menor que la corriente nominal del interruptor (In = ${p.In_A} A). Revise los factores de corrección o el método de instalación.`
    },
    'QA-BT-011': {
        pt: (p) => `O método de instalação selecionado (${p.method}) com múltiplos circuitos agrupados utiliza um fator de agrupamento aproximado. O dimensionamento prossegue como estimativa conservadora.`,
        en: (p) => `The selected installation method (${p.method}) with multiple grouped circuits uses an approximate grouping factor. Sizing proceeds as a conservative estimate.`,
        es: (p) => `El método de instalación seleccionado (${p.method}) con múltiples circuitos agrupados utiliza un factor de agrupamiento aproximado. El dimensionamiento continúa como una estimación conservadora.`
    },
    'QA-MT-001': {
        pt: (p) => `A tensão fase-terra da classe selecionada (U0 = ${p.U0} kV) é menor que o mínimo suportado (3,6 kV).`,
        en: (p) => `The selected voltage class's phase-to-earth voltage (U0 = ${p.U0} kV) is below the supported minimum (3.6 kV).`,
        es: (p) => `La tensión fase-tierra de la clase seleccionada (U0 = ${p.U0} kV) es menor que el mínimo soportado (3,6 kV).`
    },
    'QA-MT-002': {
        pt: (p) => `A tensão fase-terra da classe selecionada (U0 = ${p.U0} kV) é maior que o máximo suportado (18 kV).`,
        en: (p) => `The selected voltage class's phase-to-earth voltage (U0 = ${p.U0} kV) exceeds the supported maximum (18 kV).`,
        es: (p) => `La tensión fase-tierra de la clase seleccionada (U0 = ${p.U0} kV) supera el máximo soportado (18 kV).`
    },
    'QA-MT-003': {
        pt: (p) => `A isolação ${p.insulation} não é adequada para a classe de tensão selecionada (U0 = ${p.U0} kV); PVC é limitado a até 6 kV.`,
        en: (p) => `${p.insulation} insulation is not suitable for the selected voltage class (U0 = ${p.U0} kV); PVC is limited to up to 6 kV.`,
        es: (p) => `El aislamiento ${p.insulation} no es adecuado para la clase de tensión seleccionada (U0 = ${p.U0} kV); el PVC está limitado a hasta 6 kV.`
    },
    'QA-MT-004': {
        pt: (p) => `A classe de tensão informada ("${p.voltageClass}") não é reconhecida pelo motor de cálculo.`,
        en: (p) => `The provided voltage class ("${p.voltageClass}") is not recognized by the calculation engine.`,
        es: (p) => `La clase de tensión informada ("${p.voltageClass}") no es reconocida por el motor de cálculo.`
    },
    'QA-MT-005': {
        pt: (p) => `A corrente de projeto (Ib = ${p.Ib_A} A) deve ser positiva (maior que zero).`,
        en: (p) => `The design current (Ib = ${p.Ib_A} A) must be positive (greater than zero).`,
        es: (p) => `La corriente de diseño (Ib = ${p.Ib_A} A) debe ser positiva (mayor que cero).`
    },
    'QA-MT-006': {
        pt: (p) => `O fator de potência informado (cosφ = ${p.cosPhi}) deve estar entre 0,70 e 1,00.`,
        en: (p) => `The provided power factor (cosφ = ${p.cosPhi}) must be between 0.70 and 1.00.`,
        es: (p) => `El factor de potencia informado (cosφ = ${p.cosPhi}) debe estar entre 0,70 y 1,00.`
    },
    'QA-MT-007': {
        pt: (p) => `A tensão de linha informada (ULL = ${p.ULL_V} V) deve ser maior que zero.`,
        en: (p) => `The provided line voltage (ULL = ${p.ULL_V} V) must be greater than zero.`,
        es: (p) => `La tensión de línea informada (ULL = ${p.ULL_V} V) debe ser mayor que cero.`
    },
    'QA-MT-010': {
        pt: (p) => `A corrente de curto-circuito informada (${(p.Icc_A || 0) / 1000} kA) deve ser maior que zero.`,
        en: (p) => `The provided short-circuit current (${(p.Icc_A || 0) / 1000} kA) must be greater than zero.`,
        es: (p) => `La corriente de cortocircuito informada (${(p.Icc_A || 0) / 1000} kA) debe ser mayor que cero.`
    },
    'QA-MT-011': {
        pt: (p) => {
            const value = p.Icc_A ?? p.Ib_A;
            const ref = p.referenceMax_A;
            return ref !== undefined
                ? `A corrente de curto-circuito informada (${value} A) é considerada muito alta e improvável frente à referência usual de ${ref} A. O dimensionamento prossegue; confirme o valor com o estudo de curto-circuito da instalação.`
                : `A corrente de curto-circuito informada (${value} A) é considerada muito alta e improvável para uma instalação MT típica. O dimensionamento prossegue; confirme o valor com o estudo de curto-circuito da instalação.`;
        },
        en: (p) => {
            const value = p.Icc_A ?? p.Ib_A;
            const ref = p.referenceMax_A;
            return ref !== undefined
                ? `The provided short-circuit current (${value} A) is considered unusually high and unlikely relative to the typical reference of ${ref} A. Sizing proceeds; confirm the value against the installation's short-circuit study.`
                : `The provided short-circuit current (${value} A) is considered unusually high and unlikely for a typical MV installation. Sizing proceeds; confirm the value against the installation's short-circuit study.`;
        },
        es: (p) => {
            const value = p.Icc_A ?? p.Ib_A;
            const ref = p.referenceMax_A;
            return ref !== undefined
                ? `La corriente de cortocircuito informada (${value} A) se considera muy alta e improbable frente a la referencia habitual de ${ref} A. El dimensionamiento continúa; confirme el valor con el estudio de cortocircuito de la instalación.`
                : `La corriente de cortocircuito informada (${value} A) se considera muy alta e improbable para una instalación MT típica. El dimensionamiento continúa; confirme el valor con el estudio de cortocircuito de la instalación.`;
        }
    },
    'QA-MT-012': {
        pt: (p) => `O tempo de atuação da proteção de fase informado (${p.tConductor_s} segundos) deve ser maior que zero.`,
        en: (p) => `The provided phase protection trip time (${p.tConductor_s} seconds) must be greater than zero.`,
        es: (p) => `El tiempo de actuación de la protección de fase informado (${p.tConductor_s} segundos) debe ser mayor que cero.`
    },
    'QA-MT-013': {
        pt: (p) => `O tempo de atuação da proteção de fase informado (${p.tConductor_s} segundos) é elevado; verifique a coordenação da proteção.`,
        en: (p) => `The provided phase protection trip time (${p.tConductor_s} seconds) is high; review protection coordination.`,
        es: (p) => `El tiempo de actuación de la protección de fase informado (${p.tConductor_s} segundos) es elevado; verifique la coordinación de la protección.`
    },
    'QA-MT-014': {
        pt: (p) => `O tempo de atuação da proteção de fase informado (${p.tConductor_s} segundos) é muito curto; confirme a configuração da proteção.`,
        en: (p) => `The provided phase protection trip time (${p.tConductor_s} seconds) is very short; confirm the protection settings.`,
        es: (p) => `El tiempo de actuación de la protección de fase informado (${p.tConductor_s} segundos) es muy corto; confirme la configuración de la protección.`
    },
    'QA-MT-015': {
        pt: (p) => `A corrente de falta fase-terra informada (${p.iFault_A} A) é inválida${p.Icc_A !== undefined ? ` (deve ser positiva e não superior à corrente de curto-circuito de ${p.Icc_A} A)` : ' (deve ser positiva)'}.`,
        en: (p) => `The provided phase-earth fault current (${p.iFault_A} A) is invalid${p.Icc_A !== undefined ? ` (it must be positive and not exceed the short-circuit current of ${p.Icc_A} A)` : ' (it must be positive)'}.`,
        es: (p) => `La corriente de falta fase-tierra informada (${p.iFault_A} A) es inválida${p.Icc_A !== undefined ? ` (debe ser positiva y no superar la corriente de cortocircuito de ${p.Icc_A} A)` : ' (debe ser positiva)'}.`
    },
    'QA-MT-020': {
        pt: (p) => `A temperatura ambiente informada (${p.thetaAmb_C} °C) é extremamente baixa; confirme o valor.`,
        en: (p) => `The provided ambient temperature (${p.thetaAmb_C} °C) is extremely low; confirm the value.`,
        es: (p) => `La temperatura ambiente informada (${p.thetaAmb_C} °C) es extremadamente baja; confirme el valor.`
    },
    'QA-MT-021': {
        pt: (p) => `A temperatura ambiente informada (${p.thetaAmb_C} °C) atingiu ou superou a temperatura máxima admissível da isolação (${p.thetaMax} °C).`,
        en: (p) => `The provided ambient temperature (${p.thetaAmb_C} °C) reached or exceeded the insulation's maximum admissible temperature (${p.thetaMax} °C).`,
        es: (p) => `La temperatura ambiente informada (${p.thetaAmb_C} °C) alcanzó o superó la temperatura máxima admisible del aislamiento (${p.thetaMax} °C).`
    },
    'QA-MT-022': {
        pt: (p) => `A resistividade térmica do solo informada (${p.rhoSoil_KmW} K·m/W) deve ser maior que zero.`,
        en: (p) => `The provided soil thermal resistivity (${p.rhoSoil_KmW} K·m/W) must be greater than zero.`,
        es: (p) => `La resistividad térmica del suelo informada (${p.rhoSoil_KmW} K·m/W) debe ser mayor que cero.`
    },
    'QA-MT-023': {
        pt: (p) => `A resistividade térmica do solo informada (${p.rhoSoil_KmW} K·m/W) é elevada; confirme o levantamento geotécnico.`,
        en: (p) => `The provided soil thermal resistivity (${p.rhoSoil_KmW} K·m/W) is high; confirm the geotechnical survey.`,
        es: (p) => `La resistividad térmica del suelo informada (${p.rhoSoil_KmW} K·m/W) es elevada; confirme el levantamiento geotécnico.`
    },
    'QA-MT-024': {
        pt: (p) => `A profundidade de instalação informada (${p.depth_m} m) deve ser de no mínimo 0,3 m.`,
        en: (p) => `The provided installation depth (${p.depth_m} m) must be at least 0.3 m.`,
        es: (p) => `La profundidad de instalación informada (${p.depth_m} m) debe ser de al menos 0,3 m.`
    },
    'QA-MT-025': {
        pt: (p) => `A profundidade de instalação informada (${p.depth_m} m) é incomum; confirme o projeto de lançamento.`,
        en: (p) => `The provided installation depth (${p.depth_m} m) is unusual; confirm the laying design.`,
        es: (p) => `La profundidad de instalación informada (${p.depth_m} m) es inusual; confirme el proyecto de tendido.`
    },
    'QA-MT-030': {
        pt: (p) => `A seção calculada (${p.sCalc} mm²) é menor que a mínima da série normalizada (10 mm²) para cabos MT.`,
        en: (p) => `The calculated section (${p.sCalc} mm²) is below the minimum standard series value (10 mm²) for MV cables.`,
        es: (p) => `La sección calculada (${p.sCalc} mm²) es menor que la mínima de la serie normalizada (10 mm²) para cables MT.`
    },
    'QA-MT-032': {
        pt: (p) => `A seção calculada da tela metálica (${p.S_screen} mm²) é menor que o mínimo usual (6 mm²).`,
        en: (p) => `The calculated metallic screen section (${p.S_screen} mm²) is below the usual minimum (6 mm²).`,
        es: (p) => `La sección calculada de la pantalla metálica (${p.S_screen} mm²) es menor que el mínimo habitual (6 mm²).`
    },
    'QA-MT-033': {
        pt: (p) => `A seção da tela metálica (${p.S_screen} mm²) é maior que a seção do condutor (${p.sFinal} mm²); configuração incomum, porém não impeditiva.`,
        en: (p) => `The metallic screen section (${p.S_screen} mm²) is larger than the conductor section (${p.sFinal} mm²); an unusual but non-blocking configuration.`,
        es: (p) => `La sección de la pantalla metálica (${p.S_screen} mm²) es mayor que la sección del conductor (${p.sFinal} mm²); una configuración inusual, pero no bloqueante.`
    },
    'QA-MT-034': {
        pt: (p) => `O número de circuitos agrupados informado (${p.nCircuits}) deve ser no mínimo 1.`,
        en: (p) => `The provided number of grouped circuits (${p.nCircuits}) must be at least 1.`,
        es: (p) => `El número de circuitos agrupados informado (${p.nCircuits}) debe ser como mínimo 1.`
    },
    'QA-MT-035': {
        pt: (p) => `O número de circuitos agrupados informado (${p.nCircuits}) é elevado; confirme o arranjo de instalação.`,
        en: (p) => `The provided number of grouped circuits (${p.nCircuits}) is high; confirm the installation arrangement.`,
        es: (p) => `El número de circuitos agrupados informado (${p.nCircuits}) es elevado; confirme la disposición de instalación.`
    },
    'QA-MT-036': {
        pt: (p) => `O comprimento do circuito informado (${p.length_m} m) deve ser maior que zero.`,
        en: (p) => `The provided circuit length (${p.length_m} m) must be greater than zero.`,
        es: (p) => `La longitud del circuito informada (${p.length_m} m) debe ser mayor que cero.`
    },
    'QA-MT-037': {
        pt: (p) => `O comprimento do circuito informado (${p.length_m} m) é incomum para um único circuito; confirme o valor.`,
        en: (p) => `The provided circuit length (${p.length_m} m) is unusual for a single circuit; confirm the value.`,
        es: (p) => `La longitud del circuito informada (${p.length_m} m) es inusual para un único circuito; confirme el valor.`
    },
    'QA-MT-038': {
        pt: (p) => `O limite de queda de tensão informado (${p.duMax_pct}%) é inválido; deve estar entre 0 (exclusivo) e 15%.`,
        en: (p) => `The provided maximum voltage drop (${p.duMax_pct}%) is invalid; it must be between 0 (exclusive) and 15%.`,
        es: (p) => `El límite de caída de tensión informado (${p.duMax_pct}%) es inválido; debe estar entre 0 (exclusivo) y 15%.`
    },
    'QA-MT-040': {
        pt: (p) => `A seção final calculada (${p.sFinal} mm²) excede o máximo da série normalizada (1200 mm²).`,
        en: (p) => `The calculated final section (${p.sFinal} mm²) exceeds the maximum standard series value (1200 mm²).`,
        es: (p) => `La sección final calculada (${p.sFinal} mm²) supera el máximo de la serie normalizada (1200 mm²).`
    },
    'QA-MT-041': {
        pt: (p) => `A ampacidade corrigida (${p.Iz_corr} A) é insuficiente para a corrente de projeto (Ib = ${p.Ib_A} A), mesmo na maior seção disponível.`,
        en: (p) => `The corrected ampacity (${p.Iz_corr} A) is insufficient for the design current (Ib = ${p.Ib_A} A), even at the largest available section.`,
        es: (p) => `El amperaje corregido (${p.Iz_corr} A) es insuficiente para la corriente de diseño (Ib = ${p.Ib_A} A), incluso en la mayor sección disponible.`
    },
    'QA-MT-042': {
        pt: (p) => p.condition === 'zero-or-negative'
            ? `O fator de correção combinado (f_comb = ${p.f_combined}) é nulo ou negativo; as condições de instalação informadas inviabilizam o cálculo. Revise temperatura, resistividade do solo, profundidade e agrupamento.`
            : `O fator de correção combinado (f_comb = ${p.f_combined}) é baixo; as condições de instalação são severas. O dimensionamento prossegue, mas revise temperatura, resistividade do solo, profundidade e agrupamento.`,
        en: (p) => p.condition === 'zero-or-negative'
            ? `The combined correction factor (f_comb = ${p.f_combined}) is zero or negative; the provided installation conditions make the calculation unfeasible. Review ambient temperature, soil resistivity, depth and grouping.`
            : `The combined correction factor (f_comb = ${p.f_combined}) is low; installation conditions are severe. Sizing proceeds, but review ambient temperature, soil resistivity, depth and grouping.`,
        es: (p) => p.condition === 'zero-or-negative'
            ? `El factor de corrección combinado (f_comb = ${p.f_combined}) es nulo o negativo; las condiciones de instalación informadas inviabilizan el cálculo. Revise temperatura, resistividad del suelo, profundidad y agrupamiento.`
            : `El factor de corrección combinado (f_comb = ${p.f_combined}) es bajo; las condiciones de instalación son severas. El dimensionamiento continúa, pero revise temperatura, resistividad del suelo, profundidad y agrupamiento.`
    },
    'QA-MT-043': {
        pt: (p) => `A tensão de linha informada (ULL = ${p.ULL_V} V) excede o máximo suportado pela classe (Um = ${p.Um} kV).`,
        en: (p) => `The provided line voltage (ULL = ${p.ULL_V} V) exceeds the maximum supported by the class (Um = ${p.Um} kV).`,
        es: (p) => `La tensión de línea informada (ULL = ${p.ULL_V} V) supera el máximo soportado por la clase (Um = ${p.Um} kV).`
    },
    'QA-MT-044': {
        pt: (p) => `A corrente nominal do disjuntor informada (In = ${p.In_A} A) deve ser maior que zero.`,
        en: (p) => `The provided breaker rated current (In = ${p.In_A} A) must be greater than zero.`,
        es: (p) => `La corriente nominal del interruptor informada (In = ${p.In_A} A) debe ser mayor que cero.`
    },
    'QA-MT-045': {
        pt: (p) => `A corrente nominal do disjuntor (In = ${p.In_A} A) é menor que a corrente de projeto do circuito (Ib = ${p.Ib_A} A).`,
        en: (p) => `The breaker rated current (In = ${p.In_A} A) is lower than the circuit design current (Ib = ${p.Ib_A} A).`,
        es: (p) => `La corriente nominal del interruptor (In = ${p.In_A} A) es menor que la corriente de diseño del circuito (Ib = ${p.Ib_A} A).`
    },
    'QA-MT-046': {
        pt: (p) => `Não há dado de ampacidade tabelado para a seção ${p.section} mm² com condutor ${p.conductor}/${p.insulation}.`,
        en: (p) => `No tabulated ampacity data is available for section ${p.section} mm² with ${p.conductor}/${p.insulation} conductor.`,
        es: (p) => `No hay datos de amperaje tabulados para la sección ${p.section} mm² con conductor ${p.conductor}/${p.insulation}.`
    },
    'QA-MT-047': {
        pt: (p) => `A formação de instalação informada ("${p.formation}") não é reconhecida pelo motor de cálculo.`,
        en: (p) => `The provided cable formation ("${p.formation}") is not recognized by the calculation engine.`,
        es: (p) => `La formación de instalación informada ("${p.formation}") no es reconocida por el motor de cálculo.`
    }
};

function _diagnosticLang() {
    const lang = document.documentElement.lang === 'en' ? 'en' : (document.documentElement.lang === 'es' ? 'es' : 'pt');
    return lang;
}

// Resolve {code, params} → texto localizado. Código desconhecido usa mensagem
// técnica genérica e segura (sem inventar diagnóstico físico).
function localizeDiagnostic(diagnostic) {
    const lang = _diagnosticLang();
    const params = diagnostic?.params || {};
    const entry = DIAGNOSTIC_MESSAGES[diagnostic?.code];
    if (!entry) {
        const generic = {
            pt: `Ocorreu uma condição não catalogada (código ${diagnostic?.code || '--'}). Verifique os parâmetros informados.`,
            en: `An uncatalogued condition occurred (code ${diagnostic?.code || '--'}). Please review the provided parameters.`,
            es: `Se produjo una condición no catalogada (código ${diagnostic?.code || '--'}). Verifique los parámetros informados.`
        };
        return generic[lang];
    }
    const template = entry[lang] || entry.pt;
    return template(params);
}

function showDiagnosticBanner(bannerId, msgId, diagnostic) {
    const banner = document.getElementById(bannerId);
    const msg = document.getElementById(msgId);
    if (!banner || !msg) return;
    msg.textContent = localizeDiagnostic(diagnostic);
    banner.setAttribute('data-diagnostic-code', diagnostic?.code || '');
    banner.classList.add('active');
}

function clearDiagnosticBanner(bannerId, msgId) {
    const banner = document.getElementById(bannerId);
    const msg = document.getElementById(msgId);
    if (banner) { banner.classList.remove('active'); banner.removeAttribute('data-diagnostic-code'); }
    if (msg) msg.textContent = '';
}

// ─────────────────────────────────────────────────────────────────────────────
// Dicionário i18n BT (O.S. #017 — Internacionalização Semântica)
// ─────────────────────────────────────────────────────────────────────────────
const _btI18n = {
    pt: {
        // BT Memorial
        'memorial.title': 'Memorial de Cálculo Completo (Norma IEC 60364-5-52)',
        'step1.num': 'Passo 1', 'step1.title': 'Dimensionamento Térmico (Critério de Ampacidade)',
        'step2.num': 'Passo 2', 'step2.title': 'Verificação de Queda de Tensão Contínua',
        'step3.num': 'Passo 3', 'step3.title': 'Curto-Circuito (Esforço Térmico Adiabático)',
        // MT KPI cards
        'mt.kpi.section':   'Seção Adotada',
        'mt.kpi.dominant':  'Dominante',
        'mt.kpi.ampacity':  'Ampacidade Corrigida Iz',
        'mt.kpi.voltdrop':  'Queda de Tensão',
        'mt.kpi.temp':      'Temperatura de Operação',
        // MT criteria table
        'mt.criteria.title':   'Verificação de Critérios — IEC 60502-2 / IEC 60949',
        'mt.tbl.criterion':    'Critério',
        'mt.tbl.calculated':   'Seção Calculada',
        'mt.tbl.status':       'Status',
        'mt.tbl.statusDominant': 'Dominante',
        'mt.tbl.ampacS1':      'Ampacidade (S₁)',
        'mt.tbl.voltdropS2':   'Queda de Tensão (S₂)',
        'mt.tbl.shortcircS3':  'Curto-Circuito Condutor (S₃)',
        'mt.tbl.finalSection': 'Seção Final Adotada',
        'mt.tbl.screen':       'Tela Metálica',
        'mt.tbl.fcomb':        'Fator Combinado f_comb',
        'mt.tbl.realVoltdrop': 'Queda de Tensão Real',
        // MT memorial steps
        'mt.memorial.title': 'Memorial de Cálculo — IEC 60502-2 / IEC 60949',
        'mt.s0.title': 'Fatores de Correção (IEC 60287)',
        'mt.s1.title': 'Ampacidade (IEC 60502-2)',
        'mt.s2.title': 'Queda de Tensão (IEC 60502-2)',
        'mt.s3.title': 'Curto Adiabático Condutor (IEC 60949)',
        'mt.result.title': 'Resultado Final',
        'mt.allOk':    'TODAS AS CONDIÇÕES ATENDIDAS',
        'mt.checkFails': 'VERIFICAR FALHAS ACIMA',
        'memorial.exportPDF': 'Imprimir Anexo',
        // BT KPI cards
        'bt.kpi.section':   'Seção Adotada (S_Final)',
        'bt.kpi.dominant':  'Fator Dominante',
        'bt.kpi.ampacity':  'Capacidade (Iz)',
        'bt.kpi.voltdrop':  'Queda de Tensão (ΔU%)',
        'bt.kpi.shortcirc': 'Curto-Circuito (S_min)',
        // BT params tab & table
        'bt.tab.params':  'Parâmetros de Entrada e Dados',
        'bt.tbl.param':   'Parâmetro do Sistema',
        'bt.tbl.symbol':  'Símbolo',
        'bt.tbl.value':   'Valor Definido',
        'bt.tbl.unit':    'Unidade',
        'bt.tbl.ib':      'Corrente de Projeto',
        'bt.tbl.in':      'Corrente do Disjuntor',
        'bt.tbl.icc':     'Corrente de Curto-Circuito',
        'bt.tbl.ull':     'Tensão Nominal de Linha',
        'bt.tbl.length':  'Comprimento do Circuito',
        'bt.tbl.pf':      'Fator de Potência',
        'bt.tbl.method':  'Método de Instalação',
        'bt.tbl.tamb':    'Temperatura Ambiente',
        // BT criteria table (O.S. CAB-BT-CRITERIA-001)
        'bt.crit.caption':      'Verificação de Critérios — IEC 60364-5-52 / IEC 60364-4-43',
        'bt.crit.criterion':    'Critério',
        'bt.crit.calculated':   'Seção Calculada',
        'bt.crit.status':       'Status',
        'bt.crit.statusDominant': 'Dominante',
        'bt.crit.ampacS1':      'Ampacidade (S₁)',
        'bt.crit.voltdropS2':   'Queda de Tensão (S₂)',
        'bt.crit.shortcircS3':  'Curto-Circuito do Condutor (S₃)',
        'bt.crit.finalSection': 'Seção Final Adotada',
        'bt.crit.factors':      'Fatores de Correção (FCT · FCA)',
        'bt.crit.realVoltdrop': 'Queda de Tensão Real',
        'bt.crit.discrete':     'discreta',
        'bt.crit.continuous':   'contínua',
        // BT memorial paragraph texts (placeholders: {cond}, {ins}, {duMax}, {t_s})
        'mem.bt.step1.p': 'Cálculo dos fatores de correção e corrente corrigida do condutor de {cond} isolado em {ins}:',
        'mem.bt.step2.p': 'Calculada com base na máxima queda admissível de {duMax}% e constante de resistividade operacional (ρ):',
        'mem.bt.step3.p': 'Determinação da secção mínima requerida para suportar a energia específica passante durante t = {t_s} s:',
    },
    en: {
        // BT Memorial
        'memorial.title': 'Complete Calculation Memorial (IEC 60364-5-52)',
        'step1.num': 'Step 1', 'step1.title': 'Thermal Sizing (Ampacity Criterion)',
        'step2.num': 'Step 2', 'step2.title': 'Continuous Voltage Drop Verification',
        'step3.num': 'Step 3', 'step3.title': 'Short-Circuit (Adiabatic Thermal Stress)',
        // MT KPI cards
        'mt.kpi.section':   'Adopted Section',
        'mt.kpi.dominant':  'Dominant',
        'mt.kpi.ampacity':  'Corrected Ampacity Iz',
        'mt.kpi.voltdrop':  'Voltage Drop',
        'mt.kpi.temp':      'Operating Temperature',
        // MT criteria table
        'mt.criteria.title':   'Criteria Verification — IEC 60502-2 / IEC 60949',
        'mt.tbl.criterion':    'Criterion',
        'mt.tbl.calculated':   'Calculated Section',
        'mt.tbl.status':       'Status',
        'mt.tbl.statusDominant': 'Dominant',
        'mt.tbl.ampacS1':      'Ampacity (S₁)',
        'mt.tbl.voltdropS2':   'Voltage Drop (S₂)',
        'mt.tbl.shortcircS3':  'Conductor Short-Circuit (S₃)',
        'mt.tbl.finalSection': 'Final Adopted Section',
        'mt.tbl.screen':       'Metal Screen',
        'mt.tbl.fcomb':        'Combined Factor f_comb',
        'mt.tbl.realVoltdrop': 'Actual Voltage Drop',
        // MT memorial steps
        'mt.memorial.title': 'Calculation Report — IEC 60502-2 / IEC 60949',
        'mt.s0.title': 'Correction Factors (IEC 60287)',
        'mt.s1.title': 'Ampacity (IEC 60502-2)',
        'mt.s2.title': 'Voltage Drop (IEC 60502-2)',
        'mt.s3.title': 'Conductor Adiabatic Short-Circuit (IEC 60949)',
        'mt.result.title': 'Final Result',
        'mt.allOk':    'ALL CONDITIONS MET',
        'mt.checkFails': 'CHECK FAILURES ABOVE',
        'memorial.exportPDF': 'Print Attachment',
        // BT KPI cards
        'bt.kpi.section':   'Adopted Section (S_Final)',
        'bt.kpi.dominant':  'Dominant Factor',
        'bt.kpi.ampacity':  'Ampacity (Iz)',
        'bt.kpi.voltdrop':  'Voltage Drop (ΔU%)',
        'bt.kpi.shortcirc': 'Short-Circuit (S_min)',
        // BT params tab & table
        'bt.tab.params':  'Input Parameters & Data',
        'bt.tbl.param':   'System Parameter',
        'bt.tbl.symbol':  'Symbol',
        'bt.tbl.value':   'Defined Value',
        'bt.tbl.unit':    'Unit',
        'bt.tbl.ib':      'Design Current',
        'bt.tbl.in':      'Breaker Rated Current',
        'bt.tbl.icc':     'Short-Circuit Current',
        'bt.tbl.ull':     'Nominal Line Voltage',
        'bt.tbl.length':  'Circuit Length',
        'bt.tbl.pf':      'Power Factor',
        'bt.tbl.method':  'Installation Method',
        'bt.tbl.tamb':    'Ambient Temperature',
        // BT criteria table (O.S. CAB-BT-CRITERIA-001)
        'bt.crit.caption':      'Criteria Verification — IEC 60364-5-52 / IEC 60364-4-43',
        'bt.crit.criterion':    'Criterion',
        'bt.crit.calculated':   'Calculated Section',
        'bt.crit.status':       'Status',
        'bt.crit.statusDominant': 'Dominant',
        'bt.crit.ampacS1':      'Ampacity (S₁)',
        'bt.crit.voltdropS2':   'Voltage Drop (S₂)',
        'bt.crit.shortcircS3':  'Conductor Short-Circuit (S₃)',
        'bt.crit.finalSection': 'Final Adopted Section',
        'bt.crit.factors':      'Correction Factors (FCT · FCA)',
        'bt.crit.realVoltdrop': 'Actual Voltage Drop',
        'bt.crit.discrete':     'discrete',
        'bt.crit.continuous':   'continuous',
        // BT memorial paragraph texts
        'mem.bt.step1.p': 'Calculation of correction factors and corrected current for the {cond} conductor insulated in {ins}:',
        'mem.bt.step2.p': 'Calculated based on the maximum allowable voltage drop of {duMax}% and operational resistivity constant (ρ):',
        'mem.bt.step3.p': 'Determination of the minimum section required to withstand the specific energy passing through during t = {t_s} s:',
    },
    es: {
        // BT Memorial
        'memorial.title': 'Memorial de Cálculo Completo (Norma IEC 60364-5-52)',
        'step1.num': 'Paso 1', 'step1.title': 'Dimensionamiento Térmico (Criterio de Amperaje)',
        'step2.num': 'Paso 2', 'step2.title': 'Verificación de Caída de Tensión',
        'step3.num': 'Paso 3', 'step3.title': 'Cortocircuito (Esfuerzo Térmico Adiabático)',
        // MT KPI cards
        'mt.kpi.section':   'Sección Adoptada',
        'mt.kpi.dominant':  'Dominante',
        'mt.kpi.ampacity':  'Amperaje Corregido Iz',
        'mt.kpi.voltdrop':  'Caída de Tensión',
        'mt.kpi.temp':      'Temperatura de Operación',
        // MT criteria table
        'mt.criteria.title':   'Verificación de Criterios — IEC 60502-2 / IEC 60949',
        'mt.tbl.criterion':    'Criterio',
        'mt.tbl.calculated':   'Sección Calculada',
        'mt.tbl.status':       'Estado',
        'mt.tbl.statusDominant': 'Dominante',
        'mt.tbl.ampacS1':      'Amperaje (S₁)',
        'mt.tbl.voltdropS2':   'Caída de Tensión (S₂)',
        'mt.tbl.shortcircS3':  'Cortocircuito Conductor (S₃)',
        'mt.tbl.finalSection': 'Sección Final Adoptada',
        'mt.tbl.screen':       'Pantalla Metálica',
        'mt.tbl.fcomb':        'Factor Combinado f_comb',
        'mt.tbl.realVoltdrop': 'Caída de Tensión Real',
        // MT memorial steps
        'mt.memorial.title': 'Memorial de Cálculo — IEC 60502-2 / IEC 60949',
        'mt.s0.title': 'Factores de Corrección (IEC 60287)',
        'mt.s1.title': 'Amperaje (IEC 60502-2)',
        'mt.s2.title': 'Caída de Tensión (IEC 60502-2)',
        'mt.s3.title': 'Cortocircuito Adiabático Conductor (IEC 60949)',
        'mt.result.title': 'Resultado Final',
        'mt.allOk':    'TODAS LAS CONDICIONES CUMPLIDAS',
        'mt.checkFails': 'VERIFICAR FALLOS ARRIBA',
        'memorial.exportPDF': 'Imprimir Anexo',
        // BT KPI cards
        'bt.kpi.section':   'Sección Adoptada (S_Final)',
        'bt.kpi.dominant':  'Factor Dominante',
        'bt.kpi.ampacity':  'Capacidad (Iz)',
        'bt.kpi.voltdrop':  'Caída de Tensión (ΔU%)',
        'bt.kpi.shortcirc': 'Cortocircuito (S_min)',
        // BT params tab & table
        'bt.tab.params':  'Parámetros de Entrada y Datos',
        'bt.tbl.param':   'Parámetro del Sistema',
        'bt.tbl.symbol':  'Símbolo',
        'bt.tbl.value':   'Valor Definido',
        'bt.tbl.unit':    'Unidad',
        'bt.tbl.ib':      'Corriente de Diseño',
        'bt.tbl.in':      'Corriente Nominal del Interruptor',
        'bt.tbl.icc':     'Corriente de Cortocircuito',
        'bt.tbl.ull':     'Tensión Nominal de Línea',
        'bt.tbl.length':  'Longitud del Circuito',
        'bt.tbl.pf':      'Factor de Potencia',
        'bt.tbl.method':  'Método de Instalación',
        'bt.tbl.tamb':    'Temperatura Ambiente',
        // BT criteria table (O.S. CAB-BT-CRITERIA-001)
        'bt.crit.caption':      'Verificación de Criterios — IEC 60364-5-52 / IEC 60364-4-43',
        'bt.crit.criterion':    'Criterio',
        'bt.crit.calculated':   'Sección Calculada',
        'bt.crit.status':       'Estado',
        'bt.crit.statusDominant': 'Dominante',
        'bt.crit.ampacS1':      'Amperaje (S₁)',
        'bt.crit.voltdropS2':   'Caída de Tensión (S₂)',
        'bt.crit.shortcircS3':  'Cortocircuito del Conductor (S₃)',
        'bt.crit.finalSection': 'Sección Final Adoptada',
        'bt.crit.factors':      'Factores de Corrección (FCT · FCA)',
        'bt.crit.realVoltdrop': 'Caída de Tensión Real',
        'bt.crit.discrete':     'discreta',
        'bt.crit.continuous':   'continua',
        // BT memorial paragraph texts
        'mem.bt.step1.p': 'Cálculo de los factores de corrección y corriente corregida del conductor {cond} aislado en {ins}:',
        'mem.bt.step2.p': 'Calculada con base en la caída máxima admisible de {duMax}% y la constante de resistividad operacional (ρ):',
        'mem.bt.step3.p': 'Determinación de la sección mínima requerida para soportar la energía específica durante t = {t_s} s:',
    }
};
function _tbt(key) {
    const lang = document.documentElement.lang === 'en' ? 'en' : (document.documentElement.lang === 'es' ? 'es' : 'pt');
    return (_btI18n[lang] || _btI18n.pt)[key] || _btI18n.pt[key] || key;
}

// ─────────────────────────────────────────────────────────────────────────────
// Leitura dos inputs BT da DOM (SoC: única ponte DOM → motor puro)
// ─────────────────────────────────────────────────────────────────────────────
window.readBTInputsFromUI = function() {
    const safe = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
    // 0 é falsy em JS — "|| fallback" mascarava valores inválidos digitados como
    // 0 (ex.: comprimento 0m) substituindo-os pelo default antes da validação.
    const num = (id, fallback) => { const v = parseFloat(safe(id)); return Number.isNaN(v) ? fallback : v; };
    return {
        method:      safe('bt-method') || 'C',
        phases:      parseInt(safe('bt-phases')) || 3,
        Ib_A:        num('bt-ib', 100),
        In_A:        num('bt-in', 125),
        ULL_V:       num('bt-ull', 380),
        length_m:    num('bt-length', 50),
        cosPhi:      num('bt-cosphi', 0.92),
        duMax_pct:   num('bt-du-max', 3.0),
        thetaAmb_C:  num('bt-tamb', 30),
        nCircuits:   parseInt(safe('bt-ncirc')) || 1,
        Icc_A:       num('bt-icc', 10) * 1000,
        tProt_s:     num('bt-tprot', 0.2),
        conductor:   window.AmpAI_State?.btCond || 'Cu',
        insulation:  window.AmpAI_State?.btIns  || 'XLPE'
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// Leitura dos inputs MT da DOM (O.S. 050 — o motor MT não lê mais o DOM; a UI
// deve construir e fornecer explicitamente o objeto de entrada).
// ─────────────────────────────────────────────────────────────────────────────
window.readMTInputsFromUI = function() {
    const safe = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
    const num = (id, fallback) => { const v = parseFloat(safe(id)); return Number.isNaN(v) ? fallback : v; };
    return {
        voltageClass: safe('mt-insulation-class') || '8.7/15',
        conductor:    window.AmpAI_State?.mtCond || 'Cu',
        insulation:   window.AmpAI_State?.mtIns  || 'XLPE',
        installation: safe('mt-installation') || 'UNDERGROUND_DUCT',
        formation:    safe('mt-formation') || 'TREFOIL_TOUCHING',
        Ib_A:         num('mt-ib', 250),
        In_A:         num('mt-in', 300),
        ULL_V:        num('mt-ull', 13.8) * 1000,
        length_m:     num('mt-length', 150),
        cosPhi:       num('mt-cosphi', 0.90),
        duMax_pct:    num('mt-du-max', 2.0),
        Icc_A:        num('mt-icc', 12.5) * 1000,
        iFault_A:     num('mt-ifault', 1) * 1000,
        tConductor_s: num('mt-tcond', 0.5),
        tScreen_s:    num('mt-tscreen', 1.0),
        thetaAmb_C:   num('mt-tamb', 20),
        depth_m:      num('mt-depth', 0.8),
        rhoSoil_KmW:  num('mt-rho-soil', 1.0),
        nCircuits:    parseInt(safe('mt-ncirc')) || 1,
        sheath:       'PVC'
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// O.S. 050 — Orquestrador único de consumo do envelope SDD (Contrato O.S. 046).
// Único ponto que decide o que fazer com {ok, data, warnings} ou
// {ok:false, error}: garante que apenas envelope.data (nunca o envelope
// inteiro) chega ao renderizador existente, que warnings não bloqueiam o
// resultado numérico e que erros nunca deixam resíduo numérico na tela.
// ─────────────────────────────────────────────────────────────────────────────
function consumeCablingEnvelope(domain, envelope) {
    const isBT = domain === 'BT';
    const cardId = isBT ? 'card-bt' : 'card-mt';
    const errorBannerId = isBT ? 'bt-alert-error' : 'mt-alert-error';
    const errorMsgId = isBT ? 'bt-alert-msg' : 'mt-alert-msg';
    const warningBannerId = isBT ? 'bt-alert-warning' : 'mt-alert-warning';
    const warningMsgId = isBT ? 'bt-alert-warning-msg' : 'mt-alert-warning-msg';
    const fieldsMap = isBT ? BT_ERROR_FIELDS : MT_ERROR_FIELDS;
    const mappedFields = isBT ? BT_MAPPED_FIELDS : MT_MAPPED_FIELDS;
    const renderFn = isBT ? window.renderCardBT : window.renderCardMT;

    // Estado residual (erro/aviso/aria) de execuções anteriores é sempre limpo primeiro.
    clearDiagnosticBanner(errorBannerId, errorMsgId);
    clearDiagnosticBanner(warningBannerId, warningMsgId);
    window.clearAccessibleError(mappedFields);
    window.clearAccessibleNote(mappedFields);

    if (!envelope || envelope.ok !== true) {
        const card = document.getElementById(cardId);
        if (card) card.innerHTML = '';
        const problem = envelope && envelope.error;
        if (problem) {
            showDiagnosticBanner(errorBannerId, errorMsgId, problem);
            window.setAccessibleError(fieldsMap[problem.code] || [], errorBannerId);
        }
        return;
    }

    if (typeof renderFn === 'function') renderFn(envelope.data);

    const warnings = envelope.warnings || [];
    if (warnings.length > 0) {
        const banner = document.getElementById(warningBannerId);
        const msg = document.getElementById(warningMsgId);
        if (banner && msg) {
            msg.textContent = warnings.map((w) => localizeDiagnostic(w)).join(' ');
            banner.setAttribute('data-diagnostic-code', warnings.map((w) => w.code).join(','));
            banner.classList.add('active');
        }
        warnings.forEach((w) => {
            window.setAccessibleNote(fieldsMap[w.code] || [], warningBannerId);
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Semeadura do estado no load (DOM → AmpAI_State)
// O HTML define quais toggles nascem .active; sem esta leitura inicial, o
// estado só seria populado no primeiro clique e os cálculos usariam os
// fallbacks dos leitores, divergindo do visual (ex.: card PVC com botão XLPE).
// Os fallbacks acima e em readMTInputs devem espelhar os .active do index.html.
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const seed = (key, pairs) => {
        for (const [id, value] of pairs) {
            const el = document.getElementById(id);
            if (el && el.classList.contains('active')) {
                window.AmpAI_State[key] = value;
                return;
            }
        }
    };
    seed('btCond', [['bt-btn-cu', 'Cu'],     ['bt-btn-al', 'Al']]);
    seed('btIns',  [['bt-btn-xlpe', 'XLPE'], ['bt-btn-pvc', 'PVC']]);
    seed('mtCond', [['mt-btn-cu', 'Cu'],     ['mt-btn-al', 'Al']]);
    seed('mtIns',  [['mt-btn-xlpe', 'XLPE'], ['mt-btn-epr', 'EPR']]);

    // Wrapper setLanguage — re-renderiza BT e MT cards ao trocar idioma (O.S. #017 / #023)
    const _origSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
        if (_origSetLanguage) _origSetLanguage.call(window, lang);
        if (window._lastBTPayload && typeof window.renderCardBT === 'function') {
            setTimeout(() => window.renderCardBT(window._lastBTPayload), 150);
        }
        if (window._lastMTPayload && typeof window.renderCardMT === 'function') {
            setTimeout(() => window.renderCardMT(window._lastMTPayload), 300); // Staggered to avoid isRendering lock
        }
    };
});

// ─────────────────────────────────────────────────────────────────────────────
// window.App — API global limpa
// ─────────────────────────────────────────────────────────────────────────────
window.App = {
    renderMT: () => { if (typeof window.renderCardMT === 'function') window.renderCardMT(); },
    renderBT: () => { if (typeof window.renderCardBT === 'function') window.renderCardBT(); }
};

// ─────────────────────────────────────────────────────────────────────────────
// window.switchModule — Troca entre módulos (shortcircuit / cabling)
// Esta é a função chamada pelos links do nav: window.switchModule('cabling')
// ─────────────────────────────────────────────────────────────────────────────
window.switchModule = function(moduleName) {
    localStorage.setItem('ampai-active-module', moduleName);

    // Elementos do módulo shortcircuit (sidebar de inputs + dashboard principal)
    const sidebarSC = document.querySelector('aside.sidebar');
    const dashboardSC = document.querySelector('main.dashboard');
    const moduleCabling = document.getElementById('module-cabling');

    // Links de nav
    const navSC = document.getElementById('nav-shortcircuit');
    const navCB = document.getElementById('nav-cabling');

    if (!moduleCabling) {
        return;
    }

    // Refs para header badge (O.S. #018 — Dynamic State Binding)
    const _badge  = document.getElementById('header-norm-badge');
    const _method = document.getElementById('header-method-span')
        || document.querySelector('[data-i18n="header.method"],[data-i18n="header.cabling.method"]');

    // Overlay do módulo de Impedâncias IEC 60909
    const moduleImpedances = document.getElementById('module-impedances');
    const navIMP = document.getElementById('nav-impedances');

    if (moduleName === 'impedances') {
        // Oculta a sidebar de inputs do Curto-Circuito e o dashboard de CC
        if (sidebarSC)   sidebarSC.style.display   = 'none';
        if (dashboardSC) dashboardSC.style.display  = 'none';
        moduleCabling.style.display = 'none';

        // Exibir módulo de Impedâncias (flui no DOM normalmente)
        if (moduleImpedances) moduleImpedances.style.display = 'block';

        // Atualizar nav active
        if (navSC)  navSC.classList.remove('active');
        if (navCB)  navCB.classList.remove('active');
        if (navIMP) navIMP.classList.add('active');

        // Header badge
        if (_badge)  _badge.textContent = 'IEC 60909-0';
        if (_method) _method.setAttribute('data-i18n', 'header.method');
        if (typeof window.translatePage === 'function') window.translatePage();

    } else if (moduleName === 'cabling') {
        // Ocultar módulo de Curto-Circuito e overlay de Impedâncias
        if (sidebarSC)   sidebarSC.style.display   = 'none';
        if (dashboardSC) dashboardSC.style.display  = 'none';
        if (moduleImpedances) moduleImpedances.style.display = 'none';

        // Mostrar módulo Cabling
        moduleCabling.style.display = 'block';

        // Atualizar nav active
        if (navSC)  navSC.classList.remove('active');
        if (navCB)  navCB.classList.add('active');
        if (navIMP) navIMP.classList.remove('active');

        // Header badge → norma de cabos (data-i18n dinâmico, sem hardcode PT)
        if (_badge)  _badge.textContent = 'IEC 60364 / 60502';
        if (_method) _method.setAttribute('data-i18n', 'header.cabling.method');
        if (typeof window.translatePage === 'function') window.translatePage();

        // Iniciar no card salvo (ou BT por padrão)
        const savedCard = localStorage.getItem('ampai-active-cabling-card') || 'bt';
        window.switchCablingCard(savedCard);
        
        // Pré-calcular MT para que _lastMTPayload fique disponível para i18n
        // Delay de 350ms: aguarda o cooldown de isRendering do BT (50ms + sync template + 100ms lock)
        setTimeout(() => {
            if (typeof window.calculateCablingMT === 'function') {
                const input = window.readMTInputsFromUI();
                consumeCablingEnvelope('MT', window.calculateCablingMT(input));
            }
        }, 350);

    } else {
        // shortcircuit (default)
        if (sidebarSC)   sidebarSC.style.display   = '';
        if (dashboardSC) dashboardSC.style.display  = '';
        moduleCabling.style.display = 'none';
        if (moduleImpedances) moduleImpedances.style.display = 'none';

        if (navSC)  navSC.classList.add('active');
        if (navCB)  navCB.classList.remove('active');
        if (navIMP) navIMP.classList.remove('active');

        // Header badge → norma de curto-circuito (data-i18n dinâmico, sem hardcode PT)
        if (_badge)  _badge.textContent = 'IEC 60909-0';
        if (_method) _method.setAttribute('data-i18n', 'header.method');
        if (typeof window.translatePage === 'function') window.translatePage();
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// window.toggleSidebar — Recolhe/expande o menu global de Soluções
// ─────────────────────────────────────────────────────────────────────────────
window.toggleSidebar = function() {
    const layout = document.querySelector('.main-layout');
    if (!layout) return;

    layout.classList.toggle('sidebar-collapsed');
    const isCollapsed = layout.classList.contains('sidebar-collapsed');
    // Persistência de UX — sobrevive ao F5
    localStorage.setItem('sidebarCollapsed', isCollapsed);
};

// Auto-init: restaura preferência do usuário no load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        const layout = document.querySelector('.main-layout');
        if (layout) layout.classList.add('sidebar-collapsed');
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// window.switchCablingCard — Troca entre BT e MT dentro do módulo Cabling
// ─────────────────────────────────────────────────────────────────────────────
window.switchCablingCard = function(card) {
    localStorage.setItem('ampai-active-cabling-card', card);
    const wrapperBT = document.getElementById('wrapper-bt');
    const wrapperMT = document.getElementById('wrapper-mt');
    const btnBT     = document.getElementById('cb-toggle-bt');
    const btnMT     = document.getElementById('cb-toggle-mt');

    if (!wrapperBT) { return; }
    if (!wrapperMT) { return; }

    // Mostrar/ocultar wrappers
    wrapperBT.style.display = (card === 'bt') ? 'block' : 'none';
    wrapperMT.style.display = (card === 'mt') ? 'block' : 'none';

    // Atualizar estado dos toggles
    if (btnBT) btnBT.classList.toggle('active', card === 'bt');
    if (btnMT) btnMT.classList.toggle('active', card === 'mt');

    // Disparar cálculo de forma síncrona para evitar flicker
    if (card === 'bt' && typeof window.calculateCablingBT === 'function') {
        const input = window.readBTInputsFromUI();
        consumeCablingEnvelope('BT', window.calculateCablingBT(input));
    } else if (card === 'mt' && typeof window.calculateCablingMT === 'function') {
        const input = window.readMTInputsFromUI();
        consumeCablingEnvelope('MT', window.calculateCablingMT(input));
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Event Delegation Global — Nunca perde binding mesmo se o DOM for recriado
// ─────────────────────────────────────────────────────────────────────────────

// Global Form Submit Delegation
document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'form-bt') {
        e.preventDefault();
        if (typeof window.calculateCablingBT === 'function') {
            const input = window.readBTInputsFromUI();
            consumeCablingEnvelope('BT', window.calculateCablingBT(input));
        }
    } else if (e.target && e.target.id === 'form-mt') {
        e.preventDefault();
        if (typeof window.calculateCablingMT === 'function') {
            const input = window.readMTInputsFromUI();
            consumeCablingEnvelope('MT', window.calculateCablingMT(input));
        }
    }
});

// Neutralizador de "Phantom Scrolling" em campos numéricos
document.addEventListener('wheel', function(event) {
    if (document.activeElement.type === 'number') {
        // Remove o foco do campo numérico para que o scroll atue na página
        document.activeElement.blur();
    }
});

document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');

    switch (action) {
        case 'calc-bt':
            if (typeof window.calculateCablingBT === 'function') {
                const input = window.readBTInputsFromUI();
                consumeCablingEnvelope('BT', window.calculateCablingBT(input));
            }
            break;
        case 'calc-mt':
            if (typeof window.calculateCablingMT === 'function') {
                const input = window.readMTInputsFromUI();
                consumeCablingEnvelope('MT', window.calculateCablingMT(input));
            }
            break;
        case 'calc-icc-rede':
            if (typeof window.calcIccRede === 'function') window.calcIccRede();
            break;
        case 'calc-icc-trafo':
            if (typeof window.calcIccTrafo === 'function') window.calcIccTrafo();
            break;
        case 'calc-icc-gerador':
            if (typeof window.calcIccGen === 'function') window.calcIccGen();
            break;
        case 'calc-icc-cabo':
            if (typeof window.calcIccCabo === 'function') window.calcIccCabo();
            break;
        case 'calc-icc-agregar':
            if (typeof window.calcIccAgr === 'function') window.calcIccAgr();
            break;
        case 'switch-bt':
            window.switchCablingCard('bt');
            break;
        case 'switch-mt':
            window.switchCablingCard('mt');
            break;
        case 'set-bt-cu':
        case 'set-bt-al': {
            const mat = action === 'set-bt-cu' ? 'Cu' : 'Al';
            window.AmpAI_State.btCond = mat;
            document.getElementById('bt-btn-cu')?.classList.toggle('active', mat === 'Cu');
            document.getElementById('bt-btn-al')?.classList.toggle('active', mat === 'Al');
            break;
        }
        case 'set-bt-xlpe':
        case 'set-bt-pvc': {
            const ins = action === 'set-bt-xlpe' ? 'XLPE' : 'PVC';
            window.AmpAI_State.btIns = ins;
            document.getElementById('bt-btn-xlpe')?.classList.toggle('active', ins === 'XLPE');
            document.getElementById('bt-btn-pvc')?.classList.toggle('active', ins === 'PVC');
            break;
        }
        case 'set-mt-cu':
        case 'set-mt-al': {
            const mat = action === 'set-mt-cu' ? 'Cu' : 'Al';
            window.AmpAI_State.mtCond = mat;
            document.getElementById('mt-btn-cu')?.classList.toggle('active', mat === 'Cu');
            document.getElementById('mt-btn-al')?.classList.toggle('active', mat === 'Al');
            break;
        }
        case 'set-mt-xlpe':
        case 'set-mt-epr': {
            const ins = action === 'set-mt-xlpe' ? 'XLPE' : 'EPR';
            window.AmpAI_State.mtIns = ins;
            document.getElementById('mt-btn-xlpe')?.classList.toggle('active', ins === 'XLPE');
            document.getElementById('mt-btn-epr')?.classList.toggle('active', ins === 'EPR');
            break;
        }
        case 'toggle-memorial-bt': {
            const el = document.getElementById('cb-mem-bt-container');
            if (el) {
                const abrir = el.classList.contains('hidden');
                el.classList.toggle('hidden', !abrir);
                el.classList.toggle('open', abrir);
                const chev = document.getElementById('accordion-chevron-bt');
                if (chev) chev.classList.toggle('rotated', abrir);
                const headerBT = document.getElementById('btn-memorial-bt');
                if (headerBT) headerBT.setAttribute('aria-expanded', String(abrir));
                if (abrir) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
            break;
        }
        case 'export-memorial-bt': {
            const container = document.getElementById('cb-mem-bt-container');
            if (container) {
                container.classList.remove('hidden');
                container.classList.add('open');
            }
            const chevBT = document.getElementById('accordion-chevron-bt');
            if (chevBT) chevBT.classList.add('rotated');
            document.getElementById('btn-memorial-bt')?.setAttribute('aria-expanded', 'true');
            setTimeout(() => window.print(), 100);
            break;
        }
        case 'toggle-memorial-mt': {
            const container = document.getElementById('cb-mem-mt-container');
            if (container) {
                const abrir = container.classList.contains('hidden');
                container.classList.toggle('hidden', !abrir);
                container.classList.toggle('open', abrir);
                const chev = document.getElementById('accordion-chevron-mt');
                if (chev) chev.classList.toggle('rotated', abrir);
                const headerMT = document.getElementById('btn-memorial-mt');
                if (headerMT) headerMT.setAttribute('aria-expanded', String(abrir));
                if (abrir) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
            break;
        }
        case 'export-memorial-mt': {
            const container = document.getElementById('cb-mem-mt-container');
            if (container) {
                container.classList.remove('hidden');
                container.classList.add('open');
            }
            document.getElementById('btn-memorial-mt')?.setAttribute('aria-expanded', 'true');
            setTimeout(() => window.print(), 100);
            break;
        }
    }
});
// ─────────────────────────────────────────────────────────────────────────────
// Injeção Segura e Reativa (com Retries e proteção Anti-Loop)
// ─────────────────────────────────────────────────────────────────────────────
function injectWithRetry(id, renderFunction, payload, retries = 5) {
    const container = document.getElementById(id);

    if (!container) {
        if (retries > 0) {
            setTimeout(() => injectWithRetry(id, renderFunction, payload, retries - 1), 200);
        } else {
            console.error('[AmpAI] FALHA CRÍTICA: Container', id, 'não encontrado após todas as tentativas.');
        }
        return;
    }

    if (window.isRendering) {
        // O.S. CAB-BT-CRITERIA-001: não descartar silenciosamente um re-render
        // pedido durante o lock anti-loop. Isso congelava o card num render
        // obsoleto quando "trocar de card + Calcular" aconteciam em <100ms (o
        // segundo render, com o envelope recém-calculado, era perdido). Guardamos
        // o pedido mais recente por container e o aplicamos quando o lock é
        // liberado (last-write-wins), preservando a proteção anti-reentrância.
        (window._pendingInject = window._pendingInject || {})[id] = { renderFunction, payload };
        return;
    }
    window.isRendering = true;

    container.innerHTML = renderFunction(payload);
    container.style.display = 'block';
    container.style.visibility = 'visible';

    setTimeout(() => {
        window.isRendering = false;
        const pending = window._pendingInject;
        if (pending) {
            window._pendingInject = null;
            Object.keys(pending).forEach((pid) => injectWithRetry(pid, pending[pid].renderFunction, pending[pid].payload));
        }
    }, 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// renderCardBT — Renderiza resultados do cálculo BT (O.S. #012: clone do
// padrão homologado do módulo Curto-Circuito; impressão via window.print())
// Decimais de governança: correntes 2 casas, coeficientes 4 casas.
// ─────────────────────────────────────────────────────────────────────────────
window.renderCardBT = function(r) {
    if (!r) return;
    window._lastBTPayload = r;

    const generateHTML = (data) => {
        const p = data;
        const i = data.input || {};
        const duOver = p.duPct_final > p.duMax;

        // O.S. CAB-BT-CRITERIA-001 — Dominância por INCLUSÃO no envelope p.dominant.
        // O motor emite dominant = ['AMPACIDADE','QUEDA DE TENSÃO','CURTO-CIRCUITO']
        // unidos por ' + ' em caso de empate. Igualdade exclusiva
        // (p.dominant === 'AMPACIDADE') falharia para o valor composto
        // "AMPACIDADE + QUEDA DE TENSÃO + CURTO-CIRCUITO"; por isso testamos inclusão
        // de cada token exatamente como o motor o produz (mesma fonte que o QA normaliza).
        const _dominant = String(p.dominant ?? '');
        const domAmp = _dominant.includes('AMPACIDADE');
        const domVd  = _dominant.includes('QUEDA DE TENSÃO');
        const domSc  = _dominant.includes('CURTO-CIRCUITO');
        // Status dominante da tabela BT consome chave PRÓPRIA bt.crit.statusDominant
        // (nunca mt.tbl.statusDominant): mantém o BT desacoplado do i18n do MT.
        // _dom()/comportamento MT permanecem intactos.
        const _domBT = () => `<span style="color:var(--accent);font-weight:700;">★ ${_tbt('bt.crit.statusDominant')}</span>`;
        const critStatus = (isDom) => (isDom ? _domBT() : _ok());

        return `
            <!-- Cabeçalho Corporativo Embutido para Impressão -->
            <div class="print-header" style="display: none; align-items: center; gap: 0.75rem; padding: 0.5rem 0.5rem 1.5rem 0.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1rem;">
                <div style="background: var(--accent); color: white; padding: 0.5rem; border-radius: 8px; font-weight: 900; font-size: 1.2rem; letter-spacing: -0.05em; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">A</div>
                <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.03em;">AmpAI</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Memorial de Cálculo BT - IEC 60364-5-52</span>
                </div>
            </div>

            <!-- Data-Dense KPI Summary Cards -->
            <div class="results-grid">
                <div class="result-card primary">
                    <div class="result-title">
                        <span>${_tbt('bt.kpi.section')}</span>
                    </div>
                    <div class="result-value">${p.sFinal} <span class="result-unit">mm²</span></div>
                    <div class="result-desc">${_tbt('bt.kpi.dominant')}: ${p.dominant}</div>
                </div>

                <div class="result-card ${p.IzFinal >= p.Ib ? 'success' : 'danger'}">
                    <div class="result-title">
                        <span>${_tbt('bt.kpi.ampacity')}</span>
                    </div>
                    <div class="result-value">${_fmt(p.IzFinal, 2)} <span class="result-unit">A</span></div>
                    <div class="result-desc">I_b = ${p.Ib} A ≤ Iz</div>
                </div>

                <div class="result-card ${!duOver ? 'success' : 'danger'}">
                    <div class="result-title">
                        <span>${_tbt('bt.kpi.voltdrop')}</span>
                    </div>
                    <div class="result-value">${_fmt(p.duPct_final, 2)} <span class="result-unit">%</span></div>
                    <div class="result-desc">Limite: ${p.duMax}% | ΔU = ${_fmt(p.duV_final, 2)} V</div>
                </div>

                <div class="result-card ${p.sFinal >= p.S3 ? 'success' : 'danger'}">
                    <div class="result-title">
                        <span>${_tbt('bt.kpi.shortcirc')}</span>
                    </div>
                    <div class="result-value">${_fmt(p.S3_cont, 2)} <span class="result-unit">mm²</span></div>
                    <div class="result-desc">Icc = ${(p.Icc||0)/1000} kA | t = ${_fmt(p.tProt, 2)} s</div>
                </div>
            </div>

            <!-- O.S. CAB-BT-CRITERIA-001 — Tabela auditável de critérios de seleção -->
            <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:12px; padding:1rem; margin:0 0 1rem 0;">
                <table class="tech-table table-results">
                    <caption style="text-align:left; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.75rem;">${_tbt('bt.crit.caption')}</caption>
                    <thead>
                        <tr>
                            <th>${_tbt('bt.crit.criterion')}</th>
                            <th>${_tbt('bt.crit.calculated')}</th>
                            <th>${_tbt('bt.crit.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${_tbt('bt.crit.ampacS1')}</td>
                            <td>${p.S1} mm²</td>
                            <td>${critStatus(domAmp)}</td>
                        </tr>
                        <tr>
                            <td>${_tbt('bt.crit.voltdropS2')}</td>
                            <td>${_tbt('bt.crit.discrete')}: ${p.S2} mm² · ${_tbt('bt.crit.continuous')}: ${_fmt(p.S2_cont, 2)} mm²</td>
                            <td>${critStatus(domVd)}</td>
                        </tr>
                        <tr>
                            <td>${_tbt('bt.crit.shortcircS3')}</td>
                            <td>${_tbt('bt.crit.discrete')}: ${p.S3} mm² · ${_tbt('bt.crit.continuous')}: ${_fmt(p.S3_cont, 2)} mm²</td>
                            <td>${critStatus(domSc)}</td>
                        </tr>
                        <tr style="font-weight:700;">
                            <td>${_tbt('bt.crit.finalSection')}</td>
                            <td>${p.sFinal} mm²</td>
                            <td>—</td>
                        </tr>
                        <tr>
                            <td>${_tbt('bt.crit.factors')}</td>
                            <td colspan="2">FCT = ${_fmt(p.FCT, 4)} · FCA = ${_fmt(p.FCA, 4)}</td>
                        </tr>
                        <tr>
                            <td>${_tbt('bt.crit.realVoltdrop')}</td>
                            <td colspan="2">${_fmt(p.duPct_final, 2)} % ${p.duPct_final <= p.duMax ? '✓' : '✗'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Tabs Navigation -->
            <div class="tabs-header">
                <button class="tab-btn active" onclick="event.preventDefault()">
                    <i data-lucide="table" style="width: 14px; height: 14px;"></i> <span>${_tbt('bt.tab.params')}</span>
                </button>
            </div>

            <!-- Tab Contents Card -->
            <div class="tab-content-card">
                <div class="tab-pane active" id="tab-results-bt">
                    <table class="tech-table table-results">
                        <thead>
                            <tr>
                                <th>${_tbt('bt.tbl.param')}</th>
                                <th>${_tbt('bt.tbl.symbol')}</th>
                                <th>${_tbt('bt.tbl.value')}</th>
                                <th>${_tbt('bt.tbl.unit')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${_tbt('bt.tbl.ib')}</td>
                                <td>Ib</td>
                                <td>${p.Ib}</td>
                                <td>A</td>
                            </tr>
                            <tr>
                                <td>${_tbt('bt.tbl.in')}</td>
                                <td>In</td>
                                <td>${p.In}</td>
                                <td>A</td>
                            </tr>
                            <tr>
                                <td>${_tbt('bt.tbl.icc')}</td>
                                <td>Icc</td>
                                <td>${(p.Icc||0)/1000}</td>
                                <td>kA</td>
                            </tr>
                            <tr>
                                <td>${_tbt('bt.tbl.ull')}</td>
                                <td>ULL</td>
                                <td>${i.ULL_V || '--'}</td>
                                <td>V</td>
                            </tr>
                            <tr>
                                <td>${_tbt('bt.tbl.length')}</td>
                                <td>L</td>
                                <td>${p.L}</td>
                                <td>m</td>
                            </tr>
                            <tr>
                                <td>${_tbt('bt.tbl.pf')}</td>
                                <td>cosφ</td>
                                <td>${p.cosPhi}</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>${_tbt('bt.tbl.method')}</td>
                                <td>M</td>
                                <td>${p.method}</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>${_tbt('bt.tbl.tamb')}</td>
                                <td>Tamb</td>
                                <td>${p.tAmb}</td>
                                <td>°C</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Accordion Memorial Section -->
            <div class="accordion-item">
                <button class="accordion-header" id="btn-memorial-bt" data-action="toggle-memorial-bt" aria-controls="cb-mem-bt-container" aria-expanded="false">
                    <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="file-text" style="width: 18px; height: 18px; color: var(--text-primary);"></i>
                        <span>${_tbt('memorial.title')}</span>
                    </span>
                    <i data-lucide="chevron-down" id="accordion-chevron-bt" class="chevron-icon" style="width: 18px; height: 18px;"></i>
                </button>
                <div class="accordion-content hidden" id="cb-mem-bt-container">

                    <!-- Step 1: Ampacidade -->
                    <div class="memorial-step">
                        <div class="step-header">
                            <span class="step-num">${_tbt('step1.num')}</span>
                            <span class="step-title">${_tbt('step1.title')}</span>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">${_tbt('mem.bt.step1.p').replace('{cond}', i.conductor || '--').replace('{ins}', p.ins)}</p>
                        <div class="math-block">
                            <div class="math-line">FCT = ${_fmt(p.FCT, 4)} | FCA = ${_fmt(p.FCA, 4)}</div>
                            <div class="math-line">IZ_req ≥ In / (FCA · FCT)</div>
                            <div class="math-line">IZ_req ≥ ${p.In} / (${_fmt(p.FCA, 4)} · ${_fmt(p.FCT, 4)})</div>
                            <div class="math-line" style="color:var(--text-primary); font-weight:700;">IZ_req ≥ ${_fmt(p.In / ((p.FCA||1) * (p.FCT||1)), 2)} A</div>
                            <br>
                            <div class="math-line">Iz_base (Tabela) = ${p.IzRef} A</div>
                            <div class="math-line">Iz_corrigida = Iz_base · FCA · FCT</div>
                            <div class="math-line" style="color:var(--text-primary); font-weight:700;">Iz_corrigida = ${_fmt(p.IzFinal, 2)} A</div>
                        </div>
                    </div>

                    <!-- Step 2: Voltage Drop -->
                    <div class="memorial-step">
                        <div class="step-header">
                            <span class="step-num">${_tbt('step2.num')}</span>
                            <span class="step-title">${_tbt('step2.title')}</span>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">${_tbt('mem.bt.step2.p').replace('{duMax}', p.duMax)}</p>
                        <div class="math-block">
                            <div class="math-line">ΔU_max = (V_LL · ΔU%) / 100</div>
                            <div class="math-line">ΔU_max = (${i.ULL_V || 0} · ${p.duMax}) / 100 = ${_fmt(((i.ULL_V || 0) * p.duMax) / 100, 2)} V</div>
                            <br>
                            <div class="math-line">S_req = (${p.phases === 3 ? '√3' : '2'} · ρ · L · IB · cosφ) / ΔU_max</div>
                            <div class="math-line">S_req = (${p.phases === 3 ? '√3' : '2'} · ${(p.rho||0).toFixed(5)} · ${p.L} · ${p.Ib} · ${p.cosPhi}) / ${_fmt(((i.ULL_V || 0) * p.duMax) / 100, 2)}</div>
                            <div class="math-line" style="color:var(--text-primary); font-weight:700;">S_req = ${_fmt(p.S2_cont, 2)} mm²</div>
                        </div>
                    </div>

                    <!-- Step 3: Short Circuit -->
                    <div class="memorial-step">
                        <div class="step-header">
                            <span class="step-num">${_tbt('step3.num')}</span>
                            <span class="step-title">${_tbt('step3.title')}</span>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">${_tbt('mem.bt.step3.p').replace('{t_s}', p.tProt)}</p>
                        <div class="math-block">
                            <div class="math-line">I²t = (Icc)² · t</div>
                            <div class="math-line">I²t = (${p.Icc||0})² · ${p.tProt} = ${_fmt(Math.pow(p.Icc||0, 2) * p.tProt, 2)} A²s</div>
                            <br>
                            <div class="math-line">S_min = (Icc · √t) / k</div>
                            <div class="math-line">S_min = (${p.Icc||0} · √${p.tProt}) / ${p.k}</div>
                            <div class="math-line" style="color:var(--text-primary); font-weight:700;">S_min = ${_fmt(p.S3_cont, 2)} mm²</div>
                        </div>
                    </div>

                    <!-- PDF Print Button inside Accordion (Impressão Nativa) -->
                    <div class="actions-bar" style="margin-top: 1rem;">
                        <button class="btn-action btn-secondary" id="btn-export-memorial-bt" data-action="export-memorial-bt">
                            <i data-lucide="printer" style="width: 14px; height: 14px;"></i> <span>${_tbt('memorial.exportPDF')}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    injectWithRetry('card-bt', generateHTML, r);
};

// ─────────────────────────────────────────────────────────────────────────────
// renderCardMT — Renderiza resultados do cálculo MT
// ─────────────────────────────────────────────────────────────────────────────
window.renderCardMT = function(r) {
    if (!r || !r.input) return;
    window._lastMTPayload = r;

    const generateHTML = (data) => {
        const p = data;
        const i = data.input;
        const duOver = p.du_pct > i.duMax_pct;
        const tr = p.thetaOp / p.thetaMax;

        return `
            <div class="results-grid" style="margin-bottom:1rem;">
                <div class="result-card primary">
                    <div class="result-title">${_tbt('mt.kpi.section')}</div>
                    <div class="result-value">${p.sFinal} <span class="result-unit">mm²</span></div>
                    <div class="result-desc">${_tbt('mt.kpi.dominant')}: ${p.dominant}</div>
                </div>
                <div class="result-card success">
                    <div class="result-title">${_tbt('mt.kpi.ampacity')}</div>
                    <div class="result-value">${_fmt(p.Iz_corr, 1)} <span class="result-unit">A</span></div>
                    <div class="result-desc">I_b = ${i.Ib_A} A ≤ Iz = ${_fmt(p.Iz_corr, 1)} A ${p.Iz_corr >= i.Ib_A ? '✓' : '✗'}</div>
                </div>
                <div class="result-card ${duOver ? 'danger' : p.du_pct > i.duMax_pct * 0.85 ? 'primary' : 'info'}">
                    <div class="result-title">${_tbt('mt.kpi.voltdrop')}</div>
                    <div class="result-value">${_fmt(p.du_pct, 2)} <span class="result-unit">%</span></div>
                    <div class="result-desc">Limite: ${i.duMax_pct}% | ΔU = ${_fmt(p.du_V, 2)} V ${!duOver ? '✓' : '✗'}</div>
                </div>
                <div class="result-card ${tr > 0.95 ? 'danger' : tr > 0.85 ? 'primary' : 'success'}">
                    <div class="result-title">${_tbt('mt.kpi.temp')}</div>
                    <div class="result-value">${_fmt(p.thetaOp, 1)} <span class="result-unit">°C</span></div>
                    <div class="result-desc">Limite: ${p.thetaMax}°C (${i.insulation}) ${p.thetaOp <= p.thetaMax ? '✓' : '✗'}</div>
                </div>
                <div class="result-card info">
                    <div class="result-title">${_tbt('mt.tbl.screen')} (IEC 60949)</div>
                    <div class="result-value">${p.S_screen} <span class="result-unit">mm²</span></div>
                    <div class="result-desc">Cont: ${_fmt(p.S_screen_cont, 2)} mm² | k=${p.k_screen}</div>
                </div>
            </div>

            <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:12px; padding:1rem; margin-bottom:1rem;">
                <table class="tech-table table-results">
                    <caption style="text-align:left; font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.75rem;">${_tbt('mt.criteria.title')}</caption>
                    <thead><tr><th>${_tbt('mt.tbl.criterion')}</th><th>${_tbt('mt.tbl.calculated')}</th><th>${_tbt('mt.tbl.status')}</th></tr></thead>
                    <tbody>
                        <tr><td>${_tbt('mt.tbl.ampacS1')}</td><td>${p.S1} mm²</td><td>${p.dominant === 'AMPACIDADE' ? _dom() : _ok()}</td></tr>
                        <tr><td>${_tbt('mt.tbl.voltdropS2')}</td><td>${p.S2} mm² (cont: ${_fmt(p.S2_cont, 2)} mm²)</td><td>${p.dominant === 'QUEDA DE TENSÃO' ? _dom() : _ok()}</td></tr>
                        <tr><td>${_tbt('mt.tbl.shortcircS3')}</td><td>${p.S3} mm² (cont: ${_fmt(p.S3_cont, 2)} mm²)</td><td>${p.dominant === 'CURTO-CIRCUITO' ? _dom() : _ok()}</td></tr>
                        <tr style="font-weight:700;"><td>${_tbt('mt.tbl.finalSection')}</td><td>${p.sFinal} mm²</td><td>—</td></tr>
                        <tr><td>${_tbt('mt.tbl.screen')}</td><td>${p.S_screen} mm²</td><td>—</td></tr>
                        <tr><td>${_tbt('mt.tbl.fcomb')}</td><td colspan="2">${_fmt(p.f_combined, 4)} (T:${_fmt(p.f_temp,3)} · S:${_fmt(p.f_soil,3)} · P:${_fmt(p.f_depth,3)} · G:${_fmt(p.f_group,3)})</td></tr>
                        <tr><td>${_tbt('mt.tbl.realVoltdrop')}</td><td colspan="2">${_fmt(p.du_pct, 2)}% ${p.du_pct <= i.duMax_pct ? '✓' : '✗'}</td></tr>
                    </tbody>
                </table>
            </div>

            <!-- Accordion Memorial Section -->
            <div class="accordion-item" style="margin-top: 1rem;">
                <button class="accordion-header" id="btn-memorial-mt" data-action="toggle-memorial-mt" aria-controls="cb-mem-mt-container" aria-expanded="false">
                    <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i data-lucide="file-text" style="width: 18px; height: 18px; color: var(--text-primary);"></i>
                        <span>${_tbt('mt.memorial.title')}</span>
                    </span>
                    <i data-lucide="chevron-down" id="accordion-chevron-mt" class="chevron-icon" style="width: 18px; height: 18px;"></i>
                </button>
                <div class="accordion-content hidden" id="cb-mem-mt-container">

                <div class="memorial-step">
                    <div class="step-header">
                        <span class="step-num">S₀</span>
                        <span class="step-title">${_tbt('mt.s0.title')}</span>
                    </div>
                    <div class="math-block">
                        <div class="math-line">f_temp = √[(90−${i.thetaAmb_C})/(90−20)] = <b>${_fmt(p.f_temp, 4)}</b></div>
                        <div class="math-line">f_solo = √[1,0/${i.rhoSoil_KmW}] = <b>${_fmt(p.f_soil, 4)}</b></div>
                        <div class="math-line">f_prof (${i.depth_m} m) = <b>${_fmt(p.f_depth, 4)}</b></div>
                        <div class="math-line">f_grup (${i.nCircuits} circ, ${i.formation}) = <b>${_fmt(p.f_group, 4)}</b></div>
                        <div class="math-line" style="font-weight:700;">f_comb = <b>${_fmt(p.f_combined, 4)}</b></div>
                    </div>
                </div>

                <div class="memorial-step">
                    <div class="step-header">
                        <span class="step-num">S₁</span>
                        <span class="step-title">${_tbt('mt.s1.title')}</span>
                    </div>
                    <div class="math-block">
                        <div class="math-line">Iz_ref = ${i.Ib_A} A / ${_fmt(p.f_combined, 4)} = <b>${_fmt(i.Ib_A / p.f_combined, 2)} A</b></div>
                        <div class="math-line">Iz_base (${i.conductor}, ${i.insulation}, S=${p.S1} mm²) = <b>${p.Iz_base} A</b></div>
                        <div class="math-line">Iz_corr = ${p.Iz_base} × ${_fmt(p.f_combined, 4)} = <b>${_fmt(p.Iz_corr, 1)} A</b> ${p.Iz_corr >= i.Ib_A ? '✓' : '✗'}</div>
                        <div class="math-line" style="font-weight:700;">→ S₁ = ${p.S1} mm²</div>
                    </div>
                </div>

                <div class="memorial-step">
                    <div class="step-header">
                        <span class="step-num">S₂</span>
                        <span class="step-title">${_tbt('mt.s2.title')}</span>
                    </div>
                    <div class="math-block">
                        <div class="math-line">ΔUmax = ${_fmt((i.duMax_pct / 100) * i.ULL_V, 2)} V</div>
                        <div class="math-line">S₂ = √3 × ρ₉₀ × ${i.length_m} m × ${i.Ib_A} A × ${i.cosPhi} / ΔUmax = <b>${_fmt(p.S2_cont, 3)} mm²</b></div>
                        <div class="math-line" style="font-weight:700;">→ S₂ = ${p.S2} mm² | ΔU_real = ${_fmt(p.du_pct, 2)}% ${p.du_pct <= i.duMax_pct ? '✓' : '✗'}</div>
                    </div>
                </div>

                <div class="memorial-step">
                    <div class="step-header">
                        <span class="step-num">S₃</span>
                        <span class="step-title">${_tbt('mt.s3.title')}</span>
                    </div>
                    <div class="math-block">
                        <div class="math-line">k = ${p.k_cond} A·s½/mm² (${i.conductor}, θi=90°C→θf=250°C)</div>
                        <div class="math-line">S₃ = ${i.Icc_A} A × √${i.tConductor_s} s / ${p.k_cond} = <b>${_fmt(p.S3_cont, 3)} mm²</b> → <b>${p.S3} mm²</b></div>
                        <div class="math-line">Tela: k=${p.k_screen}, S_tela = ${i.iFault_A} × √${i.tScreen_s} / ${p.k_screen} = <b>${_fmt(p.S_screen_cont, 3)} mm²</b> → <b>${p.S_screen} mm²</b></div>
                    </div>
                </div>

                <div class="memorial-step" style="background:var(--accent-light); border-left:3px solid var(--accent);">
                    <div class="step-header">
                        <span class="step-num">✓</span>
                        <span class="step-title">${_tbt('mt.result.title')}</span>
                    </div>
                    <div class="math-block">
                        <div class="math-line">S_final = max(${p.S1}, ${p.S2}, ${p.S3}) = <b>${p.sFinal} mm²</b> [${p.dominant}]</div>
                        <div class="math-line">S_tela = <b>${p.S_screen} mm²</b></div>
                        <div class="math-line">θ_op = ${_fmt(p.thetaOp, 1)}°C ≤ ${p.thetaMax}°C ${p.thetaOp <= p.thetaMax ? '✓' : '✗'}</div>
                        <div class="math-line" style="font-weight:700;">Ib ≤ Iz: ${i.Ib_A} A ≤ ${_fmt(p.Iz_corr, 1)} A ${p.Iz_corr >= i.Ib_A ? '✓ ' + _tbt('mt.allOk') : '✗ ' + _tbt('mt.checkFails')}</div>
                    </div>
                </div>
                <div style="margin-top: 1rem; text-align: right;"><button class="btn-action btn-secondary" id="btn-export-memorial-mt" data-action="export-memorial-mt"><i data-lucide="printer" style="width: 18px; height: 18px; color: currentColor;"></i> <span>${_tbt('memorial.exportPDF')}</span></button></div>
                </div>
            </div>
        `;
    };

    injectWithRetry('card-mt', generateHTML, r);
};

// Alias para compatibilidade com core_cabos_mt.js
window.renderCablingMTResults = window.renderCardMT;

// ─────────────────────────────────────────────────────────────────────────────
// FUNÇÕES DE INTEGRAÇÃO DO MOTOR DE CURTO-CIRCUITO (IEC 60909)
// ─────────────────────────────────────────────────────────────────────────────

window.showIccToaster = function(msg) {
    const toaster = document.getElementById('icc-toaster');
    const toasterMsg = document.getElementById('icc-toaster-msg');
    if (!toaster || !toasterMsg) return;
    
    toasterMsg.innerText = msg;
    toaster.classList.add('active');
    setTimeout(() => {
        toaster.classList.remove('active');
    }, 3000);
};

window.showIccError = function(alertId, inputIds) {
    const alertBox = document.getElementById(`icc-alert-${alertId}`);
    if (alertBox) alertBox.classList.add('active');

    if (inputIds && inputIds.length > 0) {
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('icc-input-error');
        });
    }
    window.setAccessibleError(inputIds, `icc-alert-${alertId}`);

    window.showIccToaster("Verifique os parâmetros e tente novamente.");
};

window.clearIccErrors = function(alertId, inputIds) {
    const alertBox = document.getElementById(`icc-alert-${alertId}`);
    if (alertBox) alertBox.classList.remove('active');
    window.clearAccessibleError(inputIds);
    
    if (inputIds && inputIds.length > 0) {
        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('icc-input-error');
        });
    }
};

window.renderIccPills = function(targetId, resultObj) {
    const container = document.getElementById(targetId);
    if (!container) return;
    
    let html = '';
    for (const [key, val] of Object.entries(resultObj)) {
        if (typeof val === 'number') {
            html += `<span class="icc-pill"><strong>${key}:</strong> ${val.toFixed(4)} mΩ</span>`;
        } else if (typeof val === 'object' && val !== null) {
            html += `<span class="icc-pill"><strong>${key}:</strong> R=${val.re.toFixed(4)}, X=${val.im.toFixed(4)} mΩ</span>`;
        } else {
            html += `<span class="icc-pill"><strong>${key}:</strong> ${val}</span>`;
        }
    }
    container.innerHTML = html;
};

window.calcIccRede = function() {
    window.clearIccErrors('rede', ['icc-unq', 'icc-ikqpp', 'icc-tr']);
    const inputs = {
        Unq: parseFloat(document.getElementById('icc-unq').value),
        IkqPP: parseFloat(document.getElementById('icc-ikqpp').value),
        c: parseFloat(document.getElementById('icc-c-rede').value),
        tr: parseFloat(document.getElementById('icc-tr').value)
    };
    
    const res = window.CurtoCircuito.calcularImpedanciaRede(inputs);
    if (!res.isSuccess) {
        document.getElementById('icc-alert-rede-msg').innerText = res.error;
        window.showIccError('rede', ['icc-unq', 'icc-ikqpp', 'icc-tr']);
        return;
    }
    
    window.renderIccPills('icc-pills-rede', res.value);
    document.getElementById('icc-result-rede').classList.add('active');
    
    // Libera o checkbox e guarda os dados
    const chk = document.getElementById('icc-chk-rede');
    if (chk) {
        chk.disabled = false;
        chk.checked = true;
        document.getElementById('icc-chk-status-rede').innerText = '✓ Zq';
        chk.dataset.z = JSON.stringify({ re: res.value.Rqt, im: res.value.Xqt });
    }
};

window.calcIccTrafo = function() {
    window.clearIccErrors('trafo', ['icc-srt', 'icc-urt', 'icc-ukr', 'icc-pkrt', 'icc-urr']);
    const uRrVal = document.getElementById('icc-urr').value;
    const inputs = {
        Srt: parseFloat(document.getElementById('icc-srt').value),
        Urt: parseFloat(document.getElementById('icc-urt').value),
        ukr: parseFloat(document.getElementById('icc-ukr').value),
        Pkrt: parseFloat(document.getElementById('icc-pkrt').value),
        uRr: uRrVal ? parseFloat(uRrVal) : undefined,
        cMax: parseFloat(document.getElementById('icc-cmax-trafo').value),
        tipoTrafo: document.getElementById('icc-tipo-trafo').value
    };
    
    const res = window.CurtoCircuito.calcularImpedanciaTransformador(inputs);
    if (!res.isSuccess) {
        document.getElementById('icc-alert-trafo-msg').innerText = res.error;
        window.showIccError('trafo', ['icc-srt', 'icc-urt', 'icc-ukr', 'icc-pkrt', 'icc-urr']);
        return;
    }
    
    window.renderIccPills('icc-pills-trafo', res.value);
    document.getElementById('icc-result-trafo').classList.add('active');
    
    const chk = document.getElementById('icc-chk-trafo');
    if (chk) {
        chk.disabled = false;
        chk.checked = true;
        document.getElementById('icc-chk-status-trafo').innerText = '✓ Ztk';
        chk.dataset.z = JSON.stringify(res.value.Ztk);
    }
};

window.calcIccGen = function() {
    window.clearIccErrors('gerador', ['icc-urg', 'icc-srg', 'icc-xdpp', 'icc-cosphi-gen', 'icc-un-gen', 'icc-rg']);
    const RgVal = document.getElementById('icc-rg').value;
    const inputs = {
        Urg: parseFloat(document.getElementById('icc-urg').value),
        Srg: parseFloat(document.getElementById('icc-srg').value),
        xdPP: parseFloat(document.getElementById('icc-xdpp').value),
        cosPhi: parseFloat(document.getElementById('icc-cosphi-gen').value),
        Un: parseFloat(document.getElementById('icc-un-gen').value),
        cMax: parseFloat(document.getElementById('icc-cmax-gen').value),
        Rg: RgVal ? parseFloat(RgVal) : undefined,
        regime: document.getElementById('icc-regime-gen').value
    };
    
    const res = window.CurtoCircuito.calcularImpedanciaGerador(inputs);
    if (!res.isSuccess) {
        document.getElementById('icc-alert-gerador-msg').innerText = res.error;
        window.showIccError('gerador', ['icc-urg', 'icc-srg', 'icc-xdpp', 'icc-cosphi-gen', 'icc-un-gen', 'icc-rg']);
        return;
    }
    
    window.renderIccPills('icc-pills-gerador', res.value);
    document.getElementById('icc-result-gerador').classList.add('active');
    
    const chk = document.getElementById('icc-chk-gerador');
    if (chk) {
        chk.disabled = false;
        chk.checked = true;
        document.getElementById('icc-chk-status-gerador').innerText = '✓ Zgk';
        chk.dataset.z = JSON.stringify(res.value.Zgk);
    }
};

window.calcIccCabo = function() {
    window.clearIccErrors('cabo', ['icc-qn', 'icc-L', 'icc-xline', 'icc-rho', 'icc-thetaE', 'icc-alpha', 'icc-thetaMax']);
    const tE = document.getElementById('icc-thetaE').value;
    const al = document.getElementById('icc-alpha').value;
    const tMax = document.getElementById('icc-thetaMax').value;
    const f = document.getElementById('icc-freq').value;

    const inputs = {
        qn: parseFloat(document.getElementById('icc-qn').value),
        L: parseFloat(document.getElementById('icc-L').value),
        xLinhaOhmKm: parseFloat(document.getElementById('icc-xline').value),
        rho: parseFloat(document.getElementById('icc-rho').value),
        regime: document.getElementById('icc-regime-cabo').value,
        thetaE: tE ? parseFloat(tE) : undefined,
        alpha: al ? parseFloat(al) : undefined,
        thetaMax: tMax ? parseFloat(tMax) : undefined,
        f: f ? parseFloat(f) : undefined
    };
    
    const res = window.CurtoCircuito.calcularImpedanciaCabo(inputs);
    if (!res.isSuccess) {
        document.getElementById('icc-alert-cabo-msg').innerText = res.error;
        window.showIccError('cabo', ['icc-qn', 'icc-L', 'icc-xline', 'icc-rho', 'icc-thetaE', 'icc-alpha', 'icc-thetaMax']);
        return;
    }
    
    window.renderIccPills('icc-pills-cabo', res.value);
    document.getElementById('icc-result-cabo').classList.add('active');
    
    const chk = document.getElementById('icc-chk-cabo');
    if (chk) {
        chk.disabled = false;
        chk.checked = true;
        document.getElementById('icc-chk-status-cabo').innerText = '✓ Zl';
        chk.dataset.z = JSON.stringify({ re: res.value.Rl, im: res.value.Xl });
    }
};

window.calcIccAgr = function() {
    window.clearIccErrors('agregar', ['icc-agr-un', 'icc-agr-um']);
    
    const componentes = [];
    ['icc-chk-rede', 'icc-chk-trafo', 'icc-chk-gerador', 'icc-chk-cabo'].forEach(id => {
        const chk = document.getElementById(id);
        if (chk && chk.checked && chk.dataset.z) {
            try {
                componentes.push(JSON.parse(chk.dataset.z));
            } catch(e) {}
        }
    });

    if (componentes.length === 0) {
        document.getElementById('icc-alert-agregar-msg').innerText = 'Nenhum componente selecionado/calculado para agregação.';
        window.showIccError('agregar', []);
        return;
    }

    const inputs = {
        componentes: componentes,
        Un: parseFloat(document.getElementById('icc-agr-un').value),
        cMax: parseFloat(document.getElementById('icc-agr-cmax').value),
        Um: parseFloat(document.getElementById('icc-agr-um').value)
    };
    
    const res = window.CurtoCircuito.agregarImpedanciaCurto(inputs);
    if (!res.isSuccess) {
        document.getElementById('icc-alert-agregar-msg').innerText = res.error;
        window.showIccError('agregar', ['icc-agr-un', 'icc-agr-um']);
        return;
    }
    
    window.renderIccPills('icc-pills-agregar', res.value);
    document.getElementById('icc-result-agregar').classList.add('active');
    
    window.showIccToaster("Cálculo de Agregação concluído com sucesso.");
};

