/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AmpAI — core_cabos_mt.js
 * Motor Matemático: Dimensionamento de Cabos MT (IEC 60502-2 / IEC 60949 / IEC 60287)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * MOTOR 100% PURO (Governança v7.0 — Contrato SDD O.S. 046/047/048-R):
 * • NÃO lê DOM. NÃO renderiza. NÃO usa console. A leitura de formulário e o
 *   render vivem em js/ui_render.js.
 * • Contrato: window.calculateCablingMT(input) → envelope { ok, data, warnings }.
 *     - Sucesso: { ok:true,  data:<payload>, warnings:[ {code,params,severity:'warning'} ] }
 *     - Falha:   { ok:false, data:null, warnings:[],
 *                  error:<RFC 7807 {type,title,status,code,params,severity:'error'}> }
 * • O core emite SOMENTE code + params (agnóstico de idioma); mensagens humanas
 *   são responsabilidade da camada de apresentação (i18n em ui_render.js).
 * • Erros de domínio são 100% return-based (sem exceções internas). A ausência
 *   total de input é erro técnico de PROGRAMAÇÃO (throw), fora do catálogo SDD.
 *
 * CONTRATO DE DADOS — Payload (data) de calculateCablingMT(): matemática, unidades,
 * limites e formato numérico preservados integralmente:
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
 *   // Objeto de entrada espelhado (mesmos campos recebidos)
 *   input: Object
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
    // AUD-2026-001/F005 — Rastreabilidade: condutor de cobre ENCORDOADO classe 2
    // (IEC 60228): ρ20 = 0,01836 Ω·mm²/m → ρ90 = 0,01836 × [1 + 0,00393·(90−20)]
    // = 0,01836 × 1,2751 = 0,02341. Conservador ≈ +6,5% vs Cu sólido puro da
    // IEC 60287-1-1 (ρ90,DC = 0,021985), cobrindo encordoamento sem efeitos CA.
    rho90: 0.02341,   // Cu encordoado a 90°C (XLPE/EPR em regime permanente)

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
    getMaxSection() { return Math.max.apply(null, this.series); },
    // Lookup puro: retorna a ampacidade (Number) ou null se a seção não existir
    // na tabela. O tratamento do caso ausente (QA-MT-046) é return-based no caller.
    getIzFromTable(section, conductor, insulation) {
        const iz = this.IZ_BASE_MT[conductor]?.[insulation]?.[section];
        return typeof iz === 'number' ? iz : null;
    },

    SQRT3: Math.sqrt(3)
};
// ── Contrato SDD (O.S. 046/047/048-R) — fábricas de envelope RFC 7807 e avisos ──
// O core emite SOMENTE code + params (sem `detail`, agnóstico de idioma).
// Nomes prefixados (sddMT*) para não colidir com core_cabos_bt.js no escopo global.
const SDD_MT_PROBLEM_BASE = 'https://ampai.dev/problems/';

function sddMTProblem(code, params) {
    return {
        type: SDD_MT_PROBLEM_BASE + code,
        title: code,
        status: 422,
        code: code,
        params: params || {},
        severity: 'error'
    };
}

function sddMTWarning(code, params) {
    return { code: code, params: params || {}, severity: 'warning' };
}

function sddMTOk(data, warnings) {
    return { ok: true, data: data, warnings: warnings || [] };
}

function sddMTFail(problem) {
    return { ok: false, data: null, warnings: [], error: problem };
}

// ── Alias globais para compatibilidade com código legado ───────────────────
window.getMTIzFromTable  = (s, c, i) => MT.getIzFromTable(s, c, i);
window.roundToIEC_MT     = (sCalc) => MT.series.find(s => s >= sCalc) || MT.getMaxSection();

// ═══════════════════════════════════════════════════════════════════════════
// Estado Modular MT (compartilhado com index.html)
// ═══════════════════════════════════════════════════════════════════════════
// Globais descontinuadas: O cálculo utiliza estritamente o objeto de entrada.
// A leitura de inputs do DOM foi movida para js/ui_render.js (Contrato SDD).

// ═══════════════════════════════════════════════════════════════════════════
// Validação — QA-MT-001 a QA-MT-047
// Retorna um problem (RFC 7807) na primeira falha física, ou null quando válido.
// Avisos não-fatais são acumulados no array `warnings` (preservam o cálculo).
// ═══════════════════════════════════════════════════════════════════════════
function validateMTInputs(i, warnings) {
    const V = MT.voltageClasses[i.voltageClass];
    if (!V)                         return sddMTProblem('QA-MT-004', { voltageClass: i.voltageClass });
    if (V.U0 < 3.6)                 return sddMTProblem('QA-MT-001', { U0: V.U0 });
    if (V.U0 > 18)                  return sddMTProblem('QA-MT-002', { U0: V.U0 });
    if (i.insulation === 'PVC' && V.U0 > 6) return sddMTProblem('QA-MT-003', { insulation: i.insulation, U0: V.U0 });

    if (isNaN(i.Ib_A) || i.Ib_A <= 0) return sddMTProblem('QA-MT-005', { Ib_A: i.Ib_A });
    if (isNaN(i.In_A) || i.In_A <= 0) return sddMTProblem('QA-MT-044', { In_A: i.In_A });
    if (i.In_A < i.Ib_A) return sddMTProblem('QA-MT-045', { In_A: i.In_A, Ib_A: i.Ib_A });
    if (isNaN(i.cosPhi) || i.cosPhi < 0.70 || i.cosPhi > 1.00) return sddMTProblem('QA-MT-006', { cosPhi: i.cosPhi });
    if (isNaN(i.ULL_V) || i.ULL_V <= 0) return sddMTProblem('QA-MT-007', { ULL_V: i.ULL_V });
    if (i.ULL_V > V.Um * 1000)      return sddMTProblem('QA-MT-043', { ULL_V: i.ULL_V, Um: V.Um });

    if (isNaN(i.Icc_A) || i.Icc_A <= 0) return sddMTProblem('QA-MT-010', { Icc_A: i.Icc_A });
    if (i.Icc_A > 100000) warnings.push(sddMTWarning('QA-MT-011', { Icc_A: i.Icc_A }));
    if (isNaN(i.tConductor_s) || i.tConductor_s <= 0) return sddMTProblem('QA-MT-012', { tConductor_s: i.tConductor_s });
    if (i.tConductor_s > 5.0)       warnings.push(sddMTWarning('QA-MT-013', { tConductor_s: i.tConductor_s }));
    if (i.tConductor_s < 0.01)      warnings.push(sddMTWarning('QA-MT-014', { tConductor_s: i.tConductor_s }));

    if (isNaN(i.iFault_A) || i.iFault_A <= 0) return sddMTProblem('QA-MT-015', { iFault_A: i.iFault_A });
    if (i.iFault_A > i.Icc_A)       return sddMTProblem('QA-MT-015', { iFault_A: i.iFault_A, Icc_A: i.Icc_A });

    if (i.thetaAmb_C < -20)         warnings.push(sddMTWarning('QA-MT-020', { thetaAmb_C: i.thetaAmb_C }));
    const thetaMax = MT.conductor[i.insulation] ? MT.conductor[i.insulation].thetaMax : 90;
    if (i.thetaAmb_C >= thetaMax)   return sddMTProblem('QA-MT-021', { thetaAmb_C: i.thetaAmb_C, thetaMax: thetaMax });

    if (isNaN(i.rhoSoil_KmW) || i.rhoSoil_KmW <= 0) return sddMTProblem('QA-MT-022', { rhoSoil_KmW: i.rhoSoil_KmW });
    if (i.rhoSoil_KmW > 5.0)        warnings.push(sddMTWarning('QA-MT-023', { rhoSoil_KmW: i.rhoSoil_KmW }));
    if (isNaN(i.depth_m) || i.depth_m < 0.3) return sddMTProblem('QA-MT-024', { depth_m: i.depth_m });
    if (i.depth_m > 5.0)            warnings.push(sddMTWarning('QA-MT-025', { depth_m: i.depth_m }));

    if (isNaN(i.nCircuits) || i.nCircuits < 1) return sddMTProblem('QA-MT-034', { nCircuits: i.nCircuits });
    if (i.nCircuits > 20)           warnings.push(sddMTWarning('QA-MT-035', { nCircuits: i.nCircuits }));
    if (isNaN(i.length_m) || i.length_m <= 0) return sddMTProblem('QA-MT-036', { length_m: i.length_m });
    if (i.length_m > 50000)         warnings.push(sddMTWarning('QA-MT-037', { length_m: i.length_m }));
    if (isNaN(i.duMax_pct) || i.duMax_pct <= 0 || i.duMax_pct > 15) return sddMTProblem('QA-MT-038', { duMax_pct: i.duMax_pct });

    // QA-MT-047 — formação de instalação reconhecida (mesma precedência do fluxo
    // original: após toda a validação, antes do cálculo dos fatores de correção).
    const fKey = String(i.formation || '').toLowerCase();
    if (!MT.grouping[fKey]) return sddMTProblem('QA-MT-047', { formation: i.formation });

    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// Fatores de Correção (IEC 60287)
// ═══════════════════════════════════════════════════════════════════════════

/** Fator de temperatura do solo (IEC 60287-3-1, eq. de referência).
 *  Pré-condição θA < θmax garantida por validateMTInputs (QA-MT-021). */
function getMTFtemp(thetaA) {
    const tMax = MT.ref.thetaMax;
    const tRef = MT.ref.thetaA;
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

/** Fator de agrupamento (IEC 60287-1-1, Tabela B.2).
 *  AUD-2026-001/F001: normalização de caixa. A formação já foi validada em
 *  validateMTInputs (QA-MT-047), portanto a tabela existe garantidamente. */
function getMTFgrouping(nCircuits, formation) {
    const key = String(formation || '').toLowerCase();
    const table = MT.grouping[key];
    const n = Math.min(Math.max(1, Math.round(nCircuits)), table.length - 1);
    return table[n];
}

// ═══════════════════════════════════════════════════════════════════════════
// Busca de Seção por Ampacidade
// (getIzFromTable retorna null fora da tabela; null >= IzRef é false → segue.)
// ═══════════════════════════════════════════════════════════════════════════
function getMTSectionByAmpacity(IzRef, conductor, insulation) {
    for (const s of MT.series) {
        const iz = MT.getIzFromTable(s, conductor, insulation);
        if (iz !== null && iz >= IzRef) return s;
    }
    return 1200; // overflow — retorna máximo da série
}

// ═══════════════════════════════════════════════════════════════════════════
// Motor Principal — calculateCablingMT()
// IEC 60502-2 (Ampacidade e ΔU) + IEC 60949 (Adiabático) + IEC 60287 (Fatores)
// ═══════════════════════════════════════════════════════════════════════════
window.calculateCablingMT = function(input) {
    // Ausência total de input é erro técnico de PROGRAMAÇÃO (contrato de chamada
    // violado), fora do catálogo de diagnósticos físicos. Sem DOM, sem envelope.
    if (!input) {
        throw new Error('calculateCablingMT: input payload é obrigatório (erro de programação, fora do catálogo SDD).');
    }

    const warnings = [];

    // 1. Validação (QA-MT-001 a QA-MT-047) + coleta de avisos
    const problem = validateMTInputs(input, warnings);
    if (problem) return sddMTFail(problem);

    // 2. Fatores de Correção (IEC 60287)
    const f_temp     = getMTFtemp(input.thetaAmb_C);
    const f_soil     = getMTFsoil(input.rhoSoil_KmW);
    const f_depth    = getMTFdepth(input.depth_m);
    const f_group    = getMTFgrouping(input.nCircuits, input.formation);
    const f_combined = f_temp * f_soil * f_depth * f_group;

    if (f_combined < 0.30) warnings.push(sddMTWarning('QA-MT-042', { f_combined: f_combined, condition: 'low' }));
    if (f_combined <= 0)   return sddMTFail(sddMTProblem('QA-MT-042', { f_combined: f_combined, condition: 'zero-or-negative' }));

    // 3. CRITÉRIO 1 — Ampacidade (IEC 60502-2)
    //    Iz_corr = Iz_base × f_combined ≥ Ib  →  Iz_base ≥ Ib / f_combined
    const IzRef = input.Ib_A / f_combined;
    const S1    = getMTSectionByAmpacity(IzRef, input.conductor, input.insulation);

    // 4. CRITÉRIO 2 — Queda de Tensão (IEC 60502-2)
    //    S = (√3 · ρ · L · Ib · cosφ) / ΔUmax_V
    const duMax_V  = (input.duMax_pct / 100) * input.ULL_V;
    if (duMax_V <= 0) return sddMTFail(sddMTProblem('QA-MT-038', { duMax_pct: input.duMax_pct, ULL_V: input.ULL_V }));
    const rho_op   = MT.rho90;
    const S2_cont  = (MT.SQRT3 * rho_op * input.length_m * input.Ib_A * input.cosPhi) / duMax_V;
    const S2       = window.roundToIEC_MT(S2_cont);

    // 5. CRITÉRIO 3 — Curto-Circuito Adiabático Condutor (IEC 60949)
    //    S = (Icc · √t) / k
    const k_cond   = MT.kConductor[input.conductor];
    const S3_cont  = (input.Icc_A * Math.sqrt(input.tConductor_s)) / k_cond;
    const S3       = window.roundToIEC_MT(S3_cont);

    // 6. Seção Final: max(S1, S2, S3) → normalizar IEC 60228
    const sCalc    = Math.max(S1, S2, S3);
    const sFinal   = window.roundToIEC_MT(sCalc);

    if (sCalc < 10)    return sddMTFail(sddMTProblem('QA-MT-030', { sCalc: sCalc }));
    if (sFinal > 1200) return sddMTFail(sddMTProblem('QA-MT-040', { sFinal: sFinal }));

    const dominant = (S3 > S1 && S3 > S2) ? 'CURTO-CIRCUITO'
                   : (S2 > S1)             ? 'QUEDA DE TENSÃO'
                   :                         'AMPACIDADE';

    // 7. Seção da Tela Metálica (IEC 60949)
    const k_screen      = MT.kScreen[input.sheath] || 115;
    const S_screen_cont = (input.iFault_A * Math.sqrt(input.tScreen_s)) / k_screen;
    const S_screen      = window.roundToIEC_MT(S_screen_cont);

    if (S_screen < 6)       return sddMTFail(sddMTProblem('QA-MT-032', { S_screen: S_screen }));
    if (S_screen > sFinal)  warnings.push(sddMTWarning('QA-MT-033', { S_screen: S_screen, sFinal: sFinal }));

    // 8. Verificações Finais de Ampacidade
    const Iz_base = MT.getIzFromTable(sFinal, input.conductor, input.insulation);
    if (Iz_base === null) return sddMTFail(sddMTProblem('QA-MT-046', { section: sFinal, conductor: input.conductor, insulation: input.insulation }));
    const Iz_corr = Iz_base * f_combined;

    if (Iz_corr <= 0) return sddMTFail(sddMTProblem('QA-MT-041', { Iz_corr: Iz_corr, Ib_A: input.Ib_A }));
    if (Iz_corr < input.Ib_A) return sddMTFail(sddMTProblem('QA-MT-041', { Iz_corr: Iz_corr, Ib_A: input.Ib_A }));

    // 9. Temperatura de Operação
    const thetaMax = MT.conductor[input.insulation]?.thetaMax || 90;
    const thetaOp  = input.thetaAmb_C + Math.pow(input.Ib_A / Iz_corr, 2) * (thetaMax - input.thetaAmb_C);

    // 10. Queda de Tensão com Seção Final
    const du_V   = (MT.SQRT3 * rho_op * input.length_m * input.Ib_A * input.cosPhi) / sFinal;
    const du_pct = (du_V / input.ULL_V) * 100;

    // 11. Montar payload (data) — formato numérico preservado integralmente
    const payload = {
        S1, S2_cont, S2, S3_cont, S3, sFinal, dominant,
        S_screen_cont, S_screen, k_screen, k_cond,
        f_temp, f_soil, f_depth, f_group, f_combined,
        Iz_base, Iz_corr, thetaOp, thetaMax,
        du_pct, du_V,
        input
    };

    return sddMTOk(payload, warnings);
};
