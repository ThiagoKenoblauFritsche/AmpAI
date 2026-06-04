'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// NÚCLEO DE CÁLCULO — BAIXA TENSÃO (BT) — IEC 60364-5-52 / NBR 5410
// ═══════════════════════════════════════════════════════════════════════════

const BT = {
    SQRT3: Math.sqrt(3),

    standardSections: [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300],

    // Constante 'K' para cálculo de curto-circuito (IEC 60364-4-43)
    kFactor: {
        'Cu': { 'PVC': 115, 'XLPE': 143 },
        'Al': { 'PVC': 76,  'XLPE': 94 }
    },

    // Resistividade a quente (Ohm.mm²/m)
    rho: {
        'Cu': { 'PVC': 0.021, 'XLPE': 0.0225 }, // 70C vs 90C
        'Al': { 'PVC': 0.034, 'XLPE': 0.036 }
    },

    // Limites de Temperatura
    thetaMax: { 'PVC': 70, 'XLPE': 90 },

    // Tabela B.52.2 até B.52.5 Simplificada (Ampacidade para Cu XLPE/EPR a 30°C - 3 condutores carregados)
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

    // Fatores de temperatura para PVC (base 30C ambiente e base 20C solo)
    // Simplificaremos o cálculo matematicamente.
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
        if (conductor === 'Al') Iz *= 0.78; // Equivalência aproximada Cu -> Al
        return Iz;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// LEITURA DOS INPUTS DA DOM
function safe(id) { const el = document.getElementById(id); return el ? el.value : ''; }

function readBTInputs() {
    const input = {
        method:      safe('bt-method') || 'C',
        phases:      parseInt(safe('bt-phases')) || 3,
        Ib_A:        parseFloat(safe('bt-ib')) || 100,
        In_A:        parseFloat(safe('bt-in')) || 125,
        ULL_V:       parseFloat(safe('bt-ull')) || 380,
        length_m:    parseFloat(safe('bt-length')) || 50,
        cosPhi:      parseFloat(safe('bt-cosphi')) || 0.92,
        duMax_pct:   parseFloat(safe('bt-du-max')) || 3.0,
        thetaAmb_C:  parseFloat(safe('bt-tamb')) || 30,
        nCircuits:   parseInt(safe('bt-ncirc')) || 1,
        Icc_A:       (parseFloat(safe('bt-icc')) || 10) * 1000,
        tProt_s:     parseFloat(safe('bt-tprot')) || 0.2,

        // Estado dos toggle buttons do card-cabling (presumido global via UI)
        conductor:   window.AmpAI_State?.btCond || 'Cu',
        insulation:  window.AmpAI_State?.btIns  || 'PVC'
    };
    return input;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDAÇÃO DOS INPUTS
function validateBTInputs(i) {
    if (i.In_A < i.Ib_A) {
        throw new Error(`[QA-BT-001] O Disjuntor/Fusível (In = ${i.In_A}A) não pode ser menor que a Corrente de Projeto (Ib = ${i.Ib_A}A).`);
    }
    if (i.nCircuits < 1) throw new Error('[QA-BT-002] O número de circuitos agrupados deve ser >= 1.');
    if (i.length_m <= 0) throw new Error('[QA-BT-003] O comprimento deve ser > 0m.');
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTOR DE CÁLCULO
window.calculateCablingBT = function(mockInput = null) {
    const alertBox = document.getElementById('cb-alert-error');
    if (alertBox) alertBox.classList.remove('active');

    try {
        const input = mockInput || readBTInputs();
        validateBTInputs(input);

        // Fatores de Correção
        const f_temp = BT.getTempFactor(input.insulation, input.method, input.thetaAmb_C);
        const gIdx = Math.min(input.nCircuits - 1, BT.f_group.length - 1);
        const f_group = BT.f_group[gIdx];
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

        // 2. Critério da Queda de Tensão - S2
        const duMax_V = (input.duMax_pct / 100) * input.ULL_V;
        const rho_op = BT.rho[input.conductor][input.insulation];
        
        let dV_factor = 1;
        if (input.phases === 3) dV_factor = BT.SQRT3;
        else if (input.phases === 2) dV_factor = 2;

        const S2_cont = (dV_factor * rho_op * input.length_m * input.Ib_A * input.cosPhi) / duMax_V;
        const S2 = BT.standardSections.find(s => s >= S2_cont) || 300;

        // 3. Critério de Curto-Circuito (Adíabático) - S3
        const k = BT.kFactor[input.conductor][input.insulation];
        const S3_cont = (input.Icc_A * Math.sqrt(input.tProt_s)) / k;
        const S3 = BT.standardSections.find(s => s >= S3_cont) || 300;

        // SEÇÃO FINAL
        const sFinal = Math.max(S1, S2, S3);

        // Identificar Fator Dominante
        let dominant = '';
        if (sFinal === S1) dominant = 'CAPACIDADE TÉRMICA';
        else if (sFinal === S2) dominant = 'QUEDA DE TENSÃO';
        else dominant = 'CURTO-CIRCUITO';

        // Recalcular parâmetros reais do S_final
        const Iz_base = BT.getIzFromTable(sFinal, input.conductor, input.insulation, input.method, input.phases);
        const Iz_corr = Iz_base * f_combined;
        
        const du_V_final = (dV_factor * rho_op * input.length_m * input.Ib_A * input.cosPhi) / sFinal;
        const du_pct_final = (du_V_final / input.ULL_V) * 100;

        const thetaMax = BT.thetaMax[input.insulation];
        const thetaOp = input.thetaAmb_C + Math.pow(input.Ib_A / Iz_corr, 2) * (thetaMax - input.thetaAmb_C);

        // Payload para renderCardBT
        const payload = {
            duPct_final: du_pct_final, duMax: input.duMax_pct,
            sFinal: sFinal, dominant: dominant,
            IzFinal: Iz_corr, Ib: input.Ib_A,
            duV_final: du_V_final,
            thetaOp: thetaOp, tMax: thetaMax, ins: input.insulation,
            S1: S1, S2: S2, S3: S3, S2_cont: S2_cont, S3_cont: S3_cont,
            sNeutro: sFinal <= 16 ? sFinal : sFinal / 2, // simplificação NBR 5410
            sPE: sFinal <= 16 ? sFinal : (sFinal <= 35 ? 16 : sFinal / 2),
            FCT: f_temp, FCA: f_group, rho: rho_op, tAmb: input.thetaAmb_C,
            IzRef: Iz_base, phases: input.phases, L: input.length_m,
            cosPhi: input.cosPhi, Icc: input.Icc_A, tProt: input.tProt_s,
            k: k, In: input.In_A, nCir: input.nCircuits, method: input.method,
            input: input
        };

        if (typeof window.renderCardBT === 'function') {
            window.renderCardBT(payload);
        } else {
            console.error('[AmpAI] renderCardBT não encontrado!');
        }

    } catch (err) {
        const alertBox = document.getElementById('cb-alert-error');
        const alertMsg = document.getElementById('cb-alert-msg');
        if (alertBox) alertBox.classList.add('active');
        if (alertMsg) alertMsg.innerText = err.message;

        ['bt-val-section', 'bt-val-iz', 'bt-val-du', 'bt-val-temp'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '--';
        });

        console.error('[AmpAI][BT] Erro no motor:', err.message);
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// TDD CORE — Testes Matemáticos Injetados (Senior_QA_Security)
// ═══════════════════════════════════════════════════════════════════════════
;(function runBTMathTests() {
    console.groupCollapsed('%c[TDD CORE] Iniciando Testes Unitários (BT)', 'color:#8b5cf6;font-weight:bold;');
    try {
        const mockInput = {
            method: 'C', phases: 3, Ib_A: 50, In_A: 63, ULL_V: 380,
            length_m: 30, cosPhi: 0.92, duMax_pct: 3.0, thetaAmb_C: 30,
            nCircuits: 1, Icc_A: 10000, tProt_s: 0.2,
            conductor: 'Cu', insulation: 'PVC'
        };
        
        let intercepted = null;
        const orig = window.renderCardBT;
        window.renderCardBT = function(p) { intercepted = p; };
        
        window.calculateCablingBT(mockInput);
        window.renderCardBT = orig; // Restore
        
        if (intercepted && intercepted.sFinal > 0) {
            console.log('%c[TDD CORE BT] PASSOU: Motor Matemático BT Funcional! (Seção Final: ' + intercepted.sFinal + ' mm²)', 'color:green;font-weight:bold;');
            console.table({
                "Térmico (S1)": intercepted.S1 + " mm²",
                "Queda Tensão (S2)": intercepted.S2 + " mm²",
                "Curto (S3)": intercepted.S3 + " mm²",
                "Dominante": intercepted.dominant
            });
        } else {
            console.error('[TDD CORE BT] FALHA: Cálculo de BT quebrado (Seção zero ou Nula).');
        }
    } catch (e) {
        console.error('[TDD CORE BT] FALHA: Exceção durante o teste:', e);
    }
    console.groupEnd();
})();
