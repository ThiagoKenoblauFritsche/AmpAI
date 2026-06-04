/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AmpAI — core_cabos_mt.js
 * Motor Matemático: Dimensionamento de Cabos MT (IEC 60502-2 / IEC 60949 / IEC 60287)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CONTRATO DE DADOS — Payload de Saída de calculateCablingMT():
 * {
 *   // Critérios e Seção Final
 *   S1: Number,           // mm² — Seção por Ampacidade
 *   S2_cont: Number,      // mm² — Seção contínua por ΔU
 *   S2: Number,           // mm² — Seção normalizada por ΔU
 *   S3_cont: Number,      // mm² — Seção contínua por curto (condutor)
 *   S3: Number,           // mm² — Seção normalizada por curto
 *   sFinal: Number,       // mm² — Seção final adotada (max dos 3 critérios)
 *   dominant: String,     // 'AMPACIDADE' | 'QUEDA DE TENSÃO' | 'CURTO-CIRCUITO'
 *
 *   // Tela Metálica (IEC 60949)
 *   S_screen_cont: Number,// mm² — Tela contínua
 *   S_screen: Number,     // mm² — Tela normalizada adotada
 *   k_screen: Number,     // A·s½/mm²
 *   k_cond: Number,       // A·s½/mm²
 *
 *   // Fatores de Correção (IEC 60287)
 *   f_temp: Number,       // Fator de temperatura do solo
 *   f_soil: Number,       // Fator de resistividade do solo
 *   f_depth: Number,      // Fator de profundidade de instalação
 *   f_group: Number,      // Fator de agrupamento de circuitos
 *   f_combined: Number,   // Produto de todos os fatores
 *
 *   // Ampacidade
 *   Iz_base: Number,      // A — Iz tabelada para sFinal
 *   Iz_corr: Number,      // A — Iz corrigida pelos fatores
 *
 *   // Temperatura e ΔU
 *   thetaOp: Number,      // °C — Temperatura de operação real
 *   thetaMax: Number,     // °C — Temperatura máxima da isolação
 *   du_pct: Number,       // % — Queda de tensão real com sFinal
 *   du_V: Number,         // V — Queda de tensão em Volts
 *
 *   // Objeto de entrada espelhado para o renderizador
 *   input: Object         // Todos os campos de readMTInputs()
 * }
 */

// ═══════════════════════════════════════════════════════════════════════════
// Constantes Físicas Globais (IEC 60949 + IEC 60287 + IEC 60502-2)
// ═══════════════════════════════════════════════════════════════════════════
const MT = {
    // ── Material Constants (IEC 60949) ─────────────────────────────────────
    material: {
        Cu: { K: 226, beta: 234.5, Qc: 3.45e-3, rho20: 17.241e-6 },
        Al: { K: 148, beta: 228,   Qc: 2.50e-3, rho20: 28.264e-6 }
    },

    // ── Limites Térmicos — Condutor (IEC 60502-2 / IEC 60986) ─────────────
    conductor: {
        XLPE: { thetaMax: 90, thetaEmergency: 130, thetaSC: 250 },
        EPR:  { thetaMax: 90, thetaEmergency: 130, thetaSC: 250 }
    },

    // ── Limites Térmicos — Tela/Bainha (IEC 60502-2) ──────────────────────
    sheath: {
        PVC:  { thetaI: 70, thetaF: 160 },
        PE:   { thetaI: 70, thetaF: 250 },
        LSZH: { thetaI: 70, thetaF: 200 }
    },

    // ── Classes de Tensão (IEC 60502-2) ───────────────────────────────────
    voltageClasses: {
        '3.6/6':  { U0: 3.6,  U: 6,   Um: 7.2,  ULL: 6000  },
        '6/10':   { U0: 6,    U: 10,  Um: 12,   ULL: 10000 },
        '8.7/15': { U0: 8.7,  U: 15,  Um: 17.5, ULL: 15000 },
        '12/20':  { U0: 12,   U: 20,  Um: 24,   ULL: 20000 },
        '18/30':  { U0: 18,   U: 30,  Um: 36,   ULL: 30000 }
    },

    // ── k-fatores Pré-calculados (A·s½/mm²) ───────────────────────────────
    // k = K × √ln[(β + θf) / (β + θi)]  — θi=90°C (XLPE/EPR op.), θf=250°C
    kConductor: { Cu: 143, Al: 94 },

    // k_tela (cobre): varia com o material da bainha
    kScreen: { PVC: 115, PE: 143, LSZH: 128 },

    // ── Resistividade operacional (Ω·mm²/m) ───────────────────────────────
    rho90: 0.02341,   // Cu a 90°C (XLPE/EPR em regime permanente)

    // ── Condições de Referência (IEC 60287) ───────────────────────────────
    ref: {
        rhoSoil:  1.0,   // K·m/W — resistividade térmica do solo de referência
        depth:    0.80,  // m     — profundidade de referência
        thetaA:   20,    // °C   — temperatura ambiente de referência
        thetaMax: 90     // °C   — temperatura máxima do condutor (XLPE/EPR)
    },

    // ── Fatores de Agrupamento (IEC 60287, cabos enterrados) ──────────────
    grouping: {
        trefoil_touching: [0, 1.00, 0.80, 0.70, 0.63, 0.57, 0.55],
        trefoil_spaced:   [0, 1.00, 0.85, 0.76, 0.69, 0.63, 0.60],
        flat_touching:    [0, 1.00, 0.78, 0.67, 0.61, 0.56, 0.53],
        flat_spaced:      [0, 1.00, 0.82, 0.72, 0.66, 0.61, 0.59]
    },

    // ── Fatores de Profundidade (IEC 60287) ───────────────────────────────
    depthFactors: {
        0.50: 1.04, 0.60: 1.02, 0.80: 1.00,
        1.00: 0.98, 1.20: 0.96, 1.50: 0.93, 2.00: 0.89
    },

    // ── Série Normalizada IEC 60228 para MT (mm²) ─────────────────────────
    series: [10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300,
             400, 500, 630, 800, 1000, 1200],

    // ── Tabela de Ampacidade Base MT (A) — IEC 60502-2, instalação enterrada
    IZ_BASE_MT: {
        Cu: {
            XLPE: { 10:80,  16:105, 25:135, 35:160, 50:190, 70:240, 95:285,
                    120:325, 150:370, 185:420, 240:480, 300:550, 400:640,
                    500:740, 630:850, 800:970, 1000:1100, 1200:1250 },
            EPR:  { 10:80,  16:105, 25:135, 35:160, 50:190, 70:240, 95:285,
                    120:325, 150:370, 185:420, 240:480, 300:550, 400:640,
                    500:740, 630:850, 800:970, 1000:1100, 1200:1250 },
            PVC:  { 10:68,  16:89,  25:114, 35:136, 50:161, 70:204, 95:242,
                    120:276, 150:314, 185:357, 240:408, 300:467, 400:544,
                    500:629, 630:722, 800:824, 1000:935,  1200:1062 }
        },
        Al: {
            XLPE: { 10:62, 16:82, 25:105, 35:125, 50:150, 70:187, 95:222,
                    120:253, 150:288, 185:327, 240:374, 300:429, 400:499,
                    500:577, 630:663, 800:756, 1000:858, 1200:975 },
            EPR:  { 10:62, 16:82, 25:105, 35:125, 50:150, 70:187, 95:222,
                    120:253, 150:288, 185:327, 240:374, 300:429, 400:499,
                    500:577, 630:663, 800:756, 1000:858, 1200:975 },
            PVC:  { 10:53, 16:70, 25:89,  35:106, 50:127, 70:159, 95:189,
                    120:215, 150:245, 185:278, 240:318, 300:365, 400:424,
                    500:490, 630:564, 800:643, 1000:729, 1200:829 }
        }
    },

    // ── Helpers ────────────────────────────────────────────────────────────
    getMaxSection() { return Math.max(...this.series); },
    getIzFromTable(section, conductor, insulation) {
        return this.IZ_BASE_MT[conductor]?.[insulation]?.[section] || 1500;
    },

    SQRT3: Math.sqrt(3)
};

// ── Alias globais para compatibilidade com código legado ───────────────────
window.getMTIzFromTable  = (s, c, i) => MT.getIzFromTable(s, c, i);
window.roundToIEC_MT     = (sCalc) => MT.series.find(s => s >= sCalc) || MT.getMaxSection();

// ═══════════════════════════════════════════════════════════════════════════
// Estado Modular MT (compartilhado com index.html)
// ═══════════════════════════════════════════════════════════════════════════
if (typeof window.mtConductor === 'undefined') window.mtConductor = 'Cu';
if (typeof window.mtInsulation === 'undefined') window.mtInsulation = 'XLPE';

// ═══════════════════════════════════════════════════════════════════════════
// Leitura de Inputs
// ═══════════════════════════════════════════════════════════════════════════
function readMTInputs() {
    const safe = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
    
    const ull = parseFloat(safe('mt-ull')) || 13.8;
    let vClass = '8.7/15';
    if (ull <= 7.2) vClass = '3.6/6';
    else if (ull <= 12) vClass = '6/10';
    else if (ull <= 17.5) vClass = '8.7/15';
    else if (ull <= 24) vClass = '12/20';
    else vClass = '18/30';

    return {
        voltageClass:   vClass,
        earthing:       safe('mt-earthing') || 'solid',
        iFault_A:       parseFloat(safe('mt-ifault')) * 1000,
        conductor:      window.mtConductor,
        insulation:     window.mtInsulation,
        Ib_A:           parseFloat(safe('mt-ib')),
        cosPhi:         parseFloat(safe('mt-cosphi')),
        ULL_V:          ull * 1000,
        length_m:       parseFloat(safe('mt-length')),
        duMax_pct:      parseFloat(safe('mt-du-max')),
        formation:      safe('mt-formation'),
        nCircuits:      parseInt(safe('mt-ncirc')) || 1,
        rhoSoil_KmW:    parseFloat(safe('mt-rho-soil')),
        depth_m:        parseFloat(safe('mt-depth')),
        thetaAmb_C:     parseFloat(safe('mt-tamb')),
        Icc_A:          parseFloat(safe('mt-icc')) * 1000,
        tConductor_s:   parseFloat(safe('mt-tcond')),
        tScreen_s:      parseFloat(safe('mt-tscreen')),
        sheath:         safe('mt-sheath') || 'PVC',
        _warnings:      []
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// Validação — QA-MT-001 a QA-MT-043
// ═══════════════════════════════════════════════════════════════════════════
function validateMTInputs(i) {
    const V = MT.voltageClasses[i.voltageClass];
    if (!V)                         throw new Error('[QA-MT-004] Classe de tensão não padronizada pela IEC 60502-2.');
    if (V.U0 < 3.6)                 throw new Error('[QA-MT-001] Tensão U₀ < 3,6 kV — utilize o módulo BT.');
    if (V.U0 > 18)                  throw new Error('[QA-MT-002] Tensão U₀ > 18 kV (Um > 36 kV) — use IEC 60840.');
    if (i.insulation === 'PVC' && V.U0 > 6) throw new Error('[QA-MT-003] Isolação PVC não aplicável acima de 6 kV (IEC 60502-2).');

    if (isNaN(i.Ib_A) || i.Ib_A <= 0) throw new Error('[QA-MT-005] Corrente de projeto Ib deve ser positiva.');
    if (isNaN(i.cosPhi) || i.cosPhi < 0.70 || i.cosPhi > 1.00) throw new Error('[QA-MT-006] Fator de potência deve estar entre 0,70 e 1,00.');
    if (isNaN(i.ULL_V) || i.ULL_V <= 0) throw new Error('[QA-MT-007] Tensão ULL deve ser positiva.');
    if (V.ULL < i.ULL_V)            throw new Error('[QA-MT-043] Tensão de operação superior à classe de isolação do cabo — verifique o campo ULL.');

    if (isNaN(i.Icc_A) || i.Icc_A <= 0) throw new Error('[QA-MT-010] Corrente de curto-circuito deve ser estritamente positiva.');
    if (i.Icc_A > 100000) i._warnings.push('[QA-MT-011] Icc > 100 kA é fisicamente improvável em MT.');
    if (isNaN(i.tConductor_s) || i.tConductor_s <= 0) throw new Error('[QA-MT-012] Tempo de eliminação do curto deve ser positivo.');
    if (i.tConductor_s > 5.0)       i._warnings.push('[QA-MT-013] t > 5 s invalida hipótese adiabática (IEC 60949).');
    if (i.tConductor_s < 0.01)      i._warnings.push('[QA-MT-014] t < 10 ms é incomum para sistemas MT.');

    if (isNaN(i.iFault_A) || i.iFault_A <= 0) throw new Error('[QA-MT-015] Corrente de falta na tela deve ser positiva.');
    if (i.iFault_A > i.Icc_A)       throw new Error('[QA-MT-015] Corrente de falta na tela não pode superar a Icc do sistema.');

    if (i.thetaAmb_C < -20)         i._warnings.push('[QA-MT-020] Temperatura < -20°C é incomum.');
    const thetaMax = MT.conductor[i.insulation] ? MT.conductor[i.insulation].thetaMax : 90;
    if (i.thetaAmb_C >= thetaMax)   throw new Error(`[QA-MT-021] Temperatura do solo (${i.thetaAmb_C}°C) ≥ θmax do condutor (${thetaMax}°C). Dissipação térmica impossível.`);

    if (isNaN(i.rhoSoil_KmW) || i.rhoSoil_KmW <= 0) throw new Error('[QA-MT-022] Resistividade térmica do solo deve ser > 0.');
    if (i.rhoSoil_KmW > 5.0)        i._warnings.push('[QA-MT-023] Resistividade > 5,0 K·m/W é extrema — verifique o solo.');
    if (isNaN(i.depth_m) || i.depth_m < 0.3) throw new Error('[QA-MT-024] Profundidade < 0,30 m viola proteção mecânica (IEC 60502-2).');
    if (i.depth_m > 5.0)            i._warnings.push('[QA-MT-025] Profundidade > 5,0 m é incomum.');

    if (isNaN(i.nCircuits) || i.nCircuits < 1) throw new Error('[QA-MT-034] Número de circuitos deve ser ≥ 1.');
    if (i.nCircuits > 20)           i._warnings.push('[QA-MT-035] > 20 circuitos agrupados exige análise por Elementos Finitos.');
    if (isNaN(i.length_m) || i.length_m <= 0) throw new Error('[QA-MT-036] Comprimento do cabo deve ser > 0.');
    if (i.length_m > 50000)         i._warnings.push('[QA-MT-037] Comprimento > 50 km é atípico para MT — verifique o dado.');
    if (isNaN(i.duMax_pct) || i.duMax_pct <= 0 || i.duMax_pct > 15) throw new Error('[QA-MT-038] ΔUmax deve estar entre 0,1% e 15%.');
}

// ═══════════════════════════════════════════════════════════════════════════
// Fatores de Correção (IEC 60287)
// ═══════════════════════════════════════════════════════════════════════════

/** Fator de temperatura do solo (IEC 60287-3-1, eq. de referência) */
function getMTFtemp(thetaA) {
    const tMax = MT.ref.thetaMax;
    const tRef = MT.ref.thetaA;
    if (thetaA >= tMax) throw new Error('[QA-MT-021] Temperatura do solo ≥ 90°C — dissipação térmica impossível.');
    return Math.sqrt((tMax - thetaA) / (tMax - tRef));
}

/** Fator de resistividade do solo */
function getMTFsoil(rhoSoil) {
    return Math.sqrt(MT.ref.rhoSoil / rhoSoil);
}

/** Fator de profundidade (interpolação linear na tabela IEC 60287) */
function getMTFdepth(depth) {
    const keys = Object.keys(MT.depthFactors).map(Number).sort((a, b) => a - b);
    if (depth <= keys[0])               return MT.depthFactors[keys[0]];
    if (depth >= keys[keys.length - 1]) return MT.depthFactors[keys[keys.length - 1]];
    for (let j = 0; j < keys.length - 1; j++) {
        if (depth >= keys[j] && depth <= keys[j + 1]) {
            const t = (depth - keys[j]) / (keys[j + 1] - keys[j]);
            return MT.depthFactors[keys[j]] * (1 - t) + MT.depthFactors[keys[j + 1]] * t;
        }
    }
    return 1.00;
}

/** Fator de agrupamento (IEC 60287-1-1, Tabela B.2) */
function getMTFgrouping(nCircuits, formation) {
    const table = MT.grouping[formation];
    if (!table) return 1.00;
    const n = Math.min(Math.max(1, Math.round(nCircuits)), table.length - 1);
    return table[n];
}

// ═══════════════════════════════════════════════════════════════════════════
// Busca de Seção por Ampacidade
// ═══════════════════════════════════════════════════════════════════════════
function getMTSectionByAmpacity(IzRef, conductor, insulation) {
    for (const s of MT.series) {
        if (MT.getIzFromTable(s, conductor, insulation) >= IzRef) return s;
    }
    return 1200; // overflow — retorna máximo da série
}

// ═══════════════════════════════════════════════════════════════════════════
// Motor Principal — calculateCablingMT()
// IEC 60502-2 (Ampacidade e ΔU) + IEC 60949 (Adiabático) + IEC 60287 (Fatores)
// ═══════════════════════════════════════════════════════════════════════════
window.calculateCablingMT = function(mockInput = null) {
    const alertBox = document.getElementById('cb-alert-error');
    if (alertBox) alertBox.classList.remove('active');

    try {
        // 1. Leitura dos inputs (Mock ou DOM)
        const input = mockInput || readMTInputs();

        // 2. Validação (QA-MT-001 a QA-MT-043)
        validateMTInputs(input);

        // 3. Fatores de Correção (IEC 60287)
        const f_temp     = getMTFtemp(input.thetaAmb_C);
        const f_soil     = getMTFsoil(input.rhoSoil_KmW);
        const f_depth    = getMTFdepth(input.depth_m);
        const f_group    = getMTFgrouping(input.nCircuits, input.formation);
        const f_combined = f_temp * f_soil * f_depth * f_group;

        if (f_combined < 0.30) input._warnings.push('[QA-MT-042] Fator combinado < 0,30 — condições de instalação extremas.');
        if (f_combined <= 0)   throw new Error('[QA-MT-042] Fator combinado nulo ou negativo — verifique os parâmetros de solo e agrupamento.');

        // 4. CRITÉRIO 1 — Ampacidade (IEC 60502-2)
        //    Iz_corr = Iz_base × f_combined ≥ Ib  →  Iz_base ≥ Ib / f_combined
        const IzRef = input.Ib_A / f_combined;
        const S1    = getMTSectionByAmpacity(IzRef, input.conductor, input.insulation);

        // 5. CRITÉRIO 2 — Queda de Tensão (IEC 60502-2)
        //    S = (√3 · ρ · L · Ib · cosφ) / ΔUmax_V
        const duMax_V  = (input.duMax_pct / 100) * input.ULL_V;
        if (duMax_V <= 0) throw new Error('[QA-MT-038] ΔUmax calculada é zero ou negativa — verifique ULL e ΔUmax%.');
        const rho_op   = MT.rho90;
        const S2_cont  = (MT.SQRT3 * rho_op * input.length_m * input.Ib_A * input.cosPhi) / duMax_V;
        const S2       = window.roundToIEC_MT(S2_cont);

        // 6. CRITÉRIO 3 — Curto-Circuito Adiabático Condutor (IEC 60949)
        //    S = (Icc · √t) / k
        const k_cond   = MT.kConductor[input.conductor];
        const S3_cont  = (input.Icc_A * Math.sqrt(input.tConductor_s)) / k_cond;
        const S3       = window.roundToIEC_MT(S3_cont);

        // 7. Seção Final: max(S1, S2, S3) → normalizar IEC 60228
        const sCalc    = Math.max(S1, S2, S3);
        const sFinal   = window.roundToIEC_MT(sCalc);

        if (sCalc < 10)   throw new Error('[QA-MT-030] Seção calculada < 10 mm² — não padronizada para MT.');
        if (sFinal > 1200) throw new Error('[QA-MT-040] Seção excede 1200 mm² — projete paralelismo de cabos ou limite a Icc.');

        const dominant = (S3 > S1 && S3 > S2) ? 'CURTO-CIRCUITO'
                       : (S2 > S1)             ? 'QUEDA DE TENSÃO'
                       :                         'AMPACIDADE';

        // 8. Seção da Tela Metálica (IEC 60949)
        const k_screen      = MT.kScreen[input.sheath] || 115;
        const S_screen_cont = (input.iFault_A * Math.sqrt(input.tScreen_s)) / k_screen;
        const S_screen      = window.roundToIEC_MT(S_screen_cont);

        if (S_screen < 6)       throw new Error('[QA-MT-032] Seção da tela < 6 mm² — insuficiente para suportar a corrente de falta.');
        if (S_screen > sFinal)  input._warnings.push('[QA-MT-033] Seção da tela > condutor principal — verifique a corrente de falta.');

        // 9. Verificações Finais de Ampacidade
        const Iz_base = MT.getIzFromTable(sFinal, input.conductor, input.insulation);
        const Iz_corr = Iz_base * f_combined;

        if (Iz_corr <= 0) throw new Error('[QA-MT-041] Ampacidade corrigida inválida — verifique os fatores de correção.');
        if (Iz_corr < input.Ib_A) throw new Error(`[QA-MT-041] Ampacidade corrigida Iz=${Iz_corr.toFixed(1)} A < Ib=${input.Ib_A} A — aumente a seção.`);

        // 10. Temperatura de Operação
        const thetaMax = MT.conductor[input.insulation]?.thetaMax || 90;
        const thetaOp  = input.thetaAmb_C + Math.pow(input.Ib_A / Iz_corr, 2) * (thetaMax - input.thetaAmb_C);

        // 11. Queda de Tensão com Seção Final
        const du_V   = (MT.SQRT3 * rho_op * input.length_m * input.Ib_A * input.cosPhi) / sFinal;
        const du_pct = (du_V / input.ULL_V) * 100;

        // 12. Montar payload e chamar renderizador
        const payload = {
            S1, S2_cont, S2, S3_cont, S3, sFinal, dominant,
            S_screen_cont, S_screen, k_screen, k_cond,
            f_temp, f_soil, f_depth, f_group, f_combined,
            Iz_base, Iz_corr, thetaOp, thetaMax,
            du_pct, du_V,
            input
        };

        // Chamar renderizador (definido em ui_render.js)
        if (typeof window.renderCablingMTResults === 'function') {
            window.renderCablingMTResults(payload);
        } else {
            console.error('[AmpAI] renderCablingMTResults não encontrado — verifique se ui_render.js foi carregado.');
        }

    } catch (err) {
        const alertBox = document.getElementById('cb-alert-error');
        const alertMsg = document.getElementById('cb-alert-msg');
        if (alertBox) alertBox.classList.add('active');
        if (alertMsg) alertMsg.innerText = err.message;

        // Limpar KPIs em caso de erro
        ['cb-val-section', 'cb-val-iz', 'cb-val-du', 'cb-val-temp', 'mt-val-screen'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '--';
        });

        console.error('[AmpAI][MT] Erro no motor:', err.message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TDD CORE — Testes Matemáticos Injetados
// ═══════════════════════════════════════════════════════════════════════════
;(function runMathTests() {
    console.groupCollapsed('%c[TDD CORE] Iniciando Testes Unitários (MT)', 'color:#8b5cf6;font-weight:bold;');
    try {
        const mockInput = {
            voltageClass: '8.7/15', earthing: 'solid', iFault_A: 1000,
            conductor: 'Cu', insulation: 'XLPE', Ib_A: 150, cosPhi: 0.9,
            ULL_V: 13800, length_m: 100, duMax_pct: 2, formation: 'flat',
            nCircuits: 1, rhoSoil_KmW: 1.0, depth_m: 0.8, thetaAmb_C: 25,
            Icc_A: 12500, tConductor_s: 0.5, tScreen_s: 0.5, sheath: 'PVC',
            _warnings: []
        };
        
        let interceptedPayload = null;
        const originalRender = window.renderCablingMTResults;
        window.renderCablingMTResults = function(payload) { interceptedPayload = payload; };
        
        window.calculateCablingMT(mockInput);
        window.renderCablingMTResults = originalRender; // Restore
        
        if (interceptedPayload && interceptedPayload.sFinal > 0) {
            console.log('%c[TDD CORE] PASSOU: Motor Matemático MT Funcional! (Seção Final: ' + interceptedPayload.sFinal + ' mm²)', 'color:green;font-weight:bold;');
        } else {
            console.error('[TDD CORE] FALHA: Cálculo retornou Vazio ou Inválido');
        }
    } catch (e) {
        console.error('[TDD CORE] FALHA: Exceção durante o teste:', e);
    }
    console.groupEnd();
})();
