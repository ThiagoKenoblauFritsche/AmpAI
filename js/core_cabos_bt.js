'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// NÚCLEO DE CÁLCULO — BAIXA TENSÃO (BT) — IEC 60364-5-52 / NBR 5410
//
// MOTOR 100% PURO (Governança v6.0 — SoC estrita):
// • NÃO lê DOM. NÃO renderiza. NÃO conhece ui_render.js.
// • Contrato: window.calculateCablingBT(input) → payload JSON ou throw.
// • Toda leitura de formulário e reatividade vive em js/ui_render.js
//   (window.readBTInputsFromUI + delegação de eventos).
// ═══════════════════════════════════════════════════════════════════════════

const BT = {
    SQRT3: Math.sqrt(3),

    standardSections: [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300],

    // Constante 'k' para cálculo de curto-circuito (IEC 60364-4-43, Tabela 43A)
    kFactor: {
        'Cu': { 'PVC': 115, 'XLPE': 143 },
        'Al': { 'PVC': 76,  'XLPE': 94 }
    },

    // Resistividade a quente (Ω·mm²/m) — Cu/Al a 70°C (PVC) e 90°C (XLPE)
    rho: {
        'Cu': { 'PVC': 0.021, 'XLPE': 0.0225 },
        'Al': { 'PVC': 0.034, 'XLPE': 0.036 }
    },

    // Limites de Temperatura da isolação (IEC 60364-5-52, Tabela 52.1)
    thetaMax: { 'PVC': 70, 'XLPE': 90 },

    // Tabela B.52.2 até B.52.5 Simplificada (Ampacidade para Cu a 30°C - 3 condutores carregados)
    // Métodos B1 (Eletroduto alvenaria), B2 (Eletroduto aparente), C (Parede), D (Enterrado)
    // Referência aproximada
    ampacity: {
        'Cu-XLPE-3': {
            'B1': [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239, 275, 314, 370, 426],
            'B2': [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239, 275, 314, 370, 426],
            'C':  [17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269, 309, 353, 415, 477],
            'D':  [22,   29, 37, 46, 61, 79, 101, 122, 144, 178, 211, 240, 271, 304, 351, 396]
        },
        'Cu-PVC-3': {
            'B1': [13.5, 18, 24, 31, 42, 56, 73, 89, 108, 136, 164, 188, 216, 245, 286, 328],
            'B2': [13.5, 18, 24, 31, 42, 56, 73, 89, 108, 136, 164, 188, 216, 245, 286, 328],
            'C':  [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239, 275, 314, 370, 426],
            'D':  [18,   24, 30, 38, 50, 64, 82, 98, 116, 143, 169, 192, 217, 243, 280, 316]
        }
        // * Para 2 condutores ou Alumínio, multiplicadores poderiam ser aplicados (simplificado neste MVP).
    },

    // Fator de agrupamento B.52.17 (Simplificado para cabos em feixe)
    f_group: [1.0, 0.80, 0.70, 0.65, 0.60, 0.57, 0.54, 0.52, 0.50, 0.48], // índice é (n-1)

    // Fator de temperatura ambiente: base 30°C (ar) / 20°C (solo, método D)
    getTempFactor: function(insulation, method, tamb) {
        const tBase = (method === 'D') ? 20 : 30;
        const tMax = this.thetaMax[insulation];
        if (tamb === tBase) return 1.0;
        if (tamb >= tMax) return 0.1;
        return Math.sqrt((tMax - tamb) / (tMax - tBase));
    },

    getIzFromTable: function(section, conductor, insulation, method, phases) {
        const sIdx = this.standardSections.indexOf(section);
        if (sIdx === -1) return 0;
        const key = `${conductor}-${insulation}-3`; // MVP limit
        const table = this.ampacity[key] || this.ampacity['Cu-XLPE-3'];
        const arr = table[method] || table['C'];
        let Iz = arr[sIdx];
        if (phases === 2) Iz *= 1.15; // Aproximação de 3 para 2 condutores carregados
        if (conductor === 'Al') Iz *= 0.78; // [MVP] Equivalência aproximada Cu -> Al (fator fixo não cobre todas as faixas normativas IEC)
        return Iz;
    }
};


// ─────────────────────────────────────────────────────────────────────────────
// VALIDAÇÃO DOS INPUTS
function validateBTInputs(i) {
    if (i.In_A < i.Ib_A) {
        throw new Error(`[QA-BT-001] O Disjuntor/Fusível (In = ${i.In_A}A) não pode ser menor que a Corrente de Projeto (Ib = ${i.Ib_A}A).`);
    }
    if (i.nCircuits < 1) throw new Error('[QA-BT-002] O número de circuitos agrupados deve ser >= 1.');
    if (i.length_m <= 0) throw new Error('[QA-BT-003] O comprimento deve ser > 0m.');
    if (i.Icc_A <= 0) throw new Error('[QA-BT-004] Corrente de curto-circuito deve ser > 0.');
    if (i.tProt_s > 5) console.warn('[QA-BT-005] Tempo de proteção > 5s invalida hipótese adiabática.');
    if (i.cosPhi < 0.7 || i.cosPhi > 1) throw new Error('[QA-BT-006] Fator de potência fora dos limites (0.7 a 1.0).');
    const tMax = BT.thetaMax[i.insulation];
    if (i.thetaAmb_C >= tMax) throw new Error(`[QA-BT-007] Temperatura ambiente (${i.thetaAmb_C}°C) >= Limite da Isolação (${tMax}°C).`);
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTOR DE CÁLCULO PURO
window.calculateCablingBT = function(input) {
    if (!input) throw new Error("Input payload is required");
    validateBTInputs(input);

    // Fatores de Correção
    const f_temp = BT.getTempFactor(input.insulation, input.method, input.thetaAmb_C);
    const gIdx = Math.min(input.nCircuits - 1, BT.f_group.length - 1);
    const f_group = BT.f_group[gIdx];
    if (input.method.startsWith('D') && input.nCircuits > 1) {
        console.warn('[QA-BT-011] Fator de agrupamento para método enterrado usando aproximação de feixe de superfície.');
    }
    const f_combined = f_temp * f_group;

    // 1. Critério Térmico (Ampacidade) - S1
    let S1 = 1.5, Iz_corr_S1 = 0;
    for (let s of BT.standardSections) {
        const Iz_tab = BT.getIzFromTable(s, input.conductor, input.insulation, input.method, input.phases);
        const Iz_c = Iz_tab * f_combined;
        if (Iz_c >= input.In_A) {
            S1 = s;
            Iz_corr_S1 = Iz_c;
            break;
        }
        S1 = s; // Fallback se passar do limite max, vai retornar 300
    }

    const Iz_base_S1 = BT.getIzFromTable(S1, input.conductor, input.insulation, input.method, input.phases);
    const Iz_corr_check = Iz_base_S1 * f_combined;
    if (Iz_corr_check < input.In_A) {
        throw new Error(`[QA-BT-010] Ampacidade máxima disponível (${Iz_corr_check.toFixed(1)} A para 300 mm²) é inferior à proteção (In = ${input.In_A} A).`);
    }

    // 2. Critério da Queda de Tensão - S2
    const duMax_V = (input.duMax_pct / 100) * input.ULL_V;
    const rho_op = BT.rho[input.conductor][input.insulation];

    let dV_factor = 1;
    if (input.phases === 3) dV_factor = BT.SQRT3;
    else if (input.phases === 2) dV_factor = 2;

    const S2_cont = (dV_factor * rho_op * input.length_m * input.Ib_A * input.cosPhi) / duMax_V;
    const S2 = BT.standardSections.find(s => s >= S2_cont) || 300;

    // 3. Critério de Curto-Circuito (Adiabático) - S3
    const k = BT.kFactor[input.conductor][input.insulation];
    const S3_cont = (input.Icc_A * Math.sqrt(input.tProt_s)) / k;
    const S3 = BT.standardSections.find(s => s >= S3_cont) || 300;

    // SEÇÃO FINAL
    const sFinal = Math.max(S1, S2, S3);

    // Identificar Fator Dominante (composto em caso de empate)
    const domParts = [];
    if (sFinal === S1) domParts.push('AMPACIDADE');
    if (sFinal === S2) domParts.push('QUEDA DE TENSÃO');
    if (sFinal === S3) domParts.push('CURTO-CIRCUITO');
    const dominant = domParts.join(' + ');

    // Recalcular parâmetros reais do S_final
    const Iz_base = BT.getIzFromTable(sFinal, input.conductor, input.insulation, input.method, input.phases);
    const Iz_corr = Iz_base * f_combined;

    const du_V_final = (dV_factor * rho_op * input.length_m * input.Ib_A * input.cosPhi) / sFinal;
    const du_pct_final = (du_V_final / input.ULL_V) * 100;

    const thetaMax = BT.thetaMax[input.insulation];
    const thetaOp = input.thetaAmb_C + Math.pow(input.Ib_A / Iz_corr, 2) * (thetaMax - input.thetaAmb_C);

    // Payload JSON puro (sem HTML — apresentação é responsabilidade da UI)
    return {
        duPct_final: du_pct_final, duMax: input.duMax_pct,
        sFinal: sFinal, dominant: dominant,
        IzFinal: Iz_corr, Ib: input.Ib_A,
        duV_final: du_V_final,
        thetaOp: thetaOp, tMax: thetaMax, ins: input.insulation,
        S1: S1, S2: S2, S3: S3, S2_cont: S2_cont, S3_cont: S3_cont,
        // Neutro/PE conforme NBR 5410 6.2.3.1 / IEC 60364-5-54: S≤16 → S; 16<S≤35 → 16; S>35 → S/2
        sNeutro: sFinal <= 16 ? sFinal : (sFinal <= 35 ? 16 : sFinal / 2),
        sPE: sFinal <= 16 ? sFinal : (sFinal <= 35 ? 16 : sFinal / 2),
        FCT: f_temp, FCA: f_group, rho: rho_op, tAmb: input.thetaAmb_C,
        IzRef: Iz_base, phases: input.phases, L: input.length_m,
        cosPhi: input.cosPhi, Icc: input.Icc_A, tProt: input.tProt_s,
        k: k, In: input.In_A, nCir: input.nCircuits, method: input.method,
        input: input
    };
};

// ═══════════════════════════════════════════════════════════════════════════
// TDD CORE — Testes Matemáticos Injetados (Senior_QA_Security)
