/**
 * @file core_curto_circuito.test.js
 * @persona @Senior_QA_Security — TDD FASE RED (Governança AmpAI v7.0)
 * @missao Algemas de segurança física para os motores de impedância IEC 60909-0:2016.
 *         ESTE ARQUIVO NÃO CONTÉM A MATEMÁTICA REAL. Ele apenas EXIGE o contrato.
 *
 * @norma   IEC 60909-0:2016 — Zk, Rk, Xk de Rede, Transformador, Gerador, Cabo e Agregação.
 * @fonte   docs/features/IEC_60909_Impedancias_BDD.md  (VERDADE ÚNICA — Gherkin + gabaritos)
 * @alvo    js/core_curto_circuito.js  →  classe CurtoCircuitoIEC60909
 * @isolamento ZERO dependência de DOM / ui_render (Diretriz 2). Apenas o motor lógico isolado.
 *
 * =============================================================================
 *  ESTADO ESPERADO AGORA: 🔴 VERMELHO TOTAL (Fase RED).
 *  A implementação matemática do backend NÃO existe. Todos os testes DEVEM falhar.
 *  `node tests/core_curto_circuito.test.js`  →  process.exit(1)  ←  ISSO É SUCESSO NA FASE RED.
 * =============================================================================
 *
 *  CONTRATO QUE A FASE GREEN DEVERÁ SATISFAZER (Result Pattern obrigatório, SI/Ohms):
 *
 *    Sucesso  →  { isSuccess: true,  value: { ...grandezas físicas... }, error: null }
 *    Bloqueio →  { isSuccess: false, value: null, error: "<razão física técnica>" }
 *    PROIBIDO: lançar exceção genérica ou quebrar o script (Manifesto §2 / §3 — DDD).
 *
 *    Métodos estáticos exigidos em CurtoCircuitoIEC60909 (todos retornam Result; valores em Ω):
 *
 *    1) calcularImpedanciaRede({ Unq, IkqPP, c, tr })
 *         value: { Zq, Zqt, Rqt, Xqt }
 *    2) calcularImpedanciaTransformador({ Srt, Urt, ukr, Pkrt, uRr, cMax, tipoTrafo })
 *         tipoTrafo: 'rede' | 'grupo_gerador'   ·   value: { Zt, Rt, Xt, xT, Kt, Ztk:{re,im} }
 *    3) calcularImpedanciaGerador({ Urg, Srg, xdPP, cosPhi, Un, cMax, Rg, regime })
 *         regime: 'maxima' | 'minima'           ·   value: { Zrg, XdPP, Kg, Zgk:{re,im} }
 *    4) calcularImpedanciaCabo({ qn, L, xLinhaOhmKm, rho, regime, thetaE, alpha, thetaMax, f })
 *         value: { Rl, Xl, moduloZl }
 *    5) agregarImpedanciaCurto({ componentes, Un, cMax, Um })
 *         componentes: Array<{re, im}> (Ω)      ·   value: { Rk, Xk, moduloZk }
 * =============================================================================
 */

'use strict';

const assert = require('assert');
const { CurtoCircuitoIEC60909 } = require('../js/core_curto_circuito.js');

// ───────────────────────────── Infraestrutura de teste ──────────────────────
// Runner mínimo nativo (sem Jest, sem DOM). Acumula RED e finaliza com exit(1).

const mOhm = 1e-3;        // 1 mΩ em Ohms — legibilidade dos gabaritos (BDD usa mΩ; contrato é Ω/SI)
const kV   = 1e3;
const TOL  = 0.005;       // tolerância relativa padrão = 0,5% (declarada no cenário BDD da rede)

let verdes = 0;
let vermelhos = 0;
const falhas = [];

function teste(id, nome, fn) {
    try {
        fn();
        verdes++;
        console.log(`✅ VERDE  [${id}] ${nome}`);
    } catch (err) {
        vermelhos++;
        falhas.push({ id, nome, erro: err.message });
        console.error(`🔴 RED    [${id}] ${nome}\n          → ${err.message}`);
    }
}

/**
 * Invoca um método do motor garantindo um RED descritivo caso o contrato ainda não exista.
 * (Na Fase RED, este é o caminho normal: o método ainda não foi implementado.)
 */
function chamar(metodo, params, contexto) {
    if (typeof CurtoCircuitoIEC60909[metodo] !== 'function') {
        throw new Error(
            `[CONTRATO PENDENTE] ${contexto}: CurtoCircuitoIEC60909.${metodo}() não existe. ` +
            `A Fase GREEN deve implementá-lo retornando o Result Pattern.`
        );
    }
    return CurtoCircuitoIEC60909[metodo](params);
}

/** Igualdade numérica com tolerância relativa e mensagem cirúrgica. */
function assertAprox(obtido, esperado, msg, tol = TOL) {
    assert.ok(
        typeof obtido === 'number' && Number.isFinite(obtido),
        `${msg} | valor ausente/não-numérico (obtido: ${obtido}). O motor deve devolver um número finito.`
    );
    const erroRel = Math.abs(obtido - esperado) / Math.max(Math.abs(esperado), 1e-12);
    assert.ok(
        erroRel <= tol,
        `${msg} | esperado ≈ ${esperado}, obtido ${obtido} ` +
        `(erro ${(erroRel * 100).toFixed(4)}% > tolerância ${(tol * 100).toFixed(2)}%)`
    );
}

/** Valida o Result Pattern de SUCESSO e devolve `value`. */
function assertSucesso(resultado, contexto) {
    assert.ok(resultado && typeof resultado === 'object',
        `${contexto}: o motor deve retornar um objeto Result. Obtido: ${resultado}`);
    assert.strictEqual(resultado.isSuccess, true,
        `${contexto}: esperado isSuccess === true. Obtido: ${JSON.stringify(resultado)}`);
    assert.ok(resultado.value && typeof resultado.value === 'object',
        `${contexto}: em sucesso, 'value' deve conter o objeto físico calculado.`);
    return resultado.value;
}

/**
 * Valida o Result Pattern de BLOQUEIO (a alma da Fase RED).
 * Exige isSuccess===false, error técnico não-vazio casando TODOS os termos, e value nulo.
 * @param {RegExp[]} termosObrigatorios todos devem casar a mensagem de erro do motor.
 */
function assertBloqueio(resultado, termosObrigatorios, contexto) {
    assert.ok(resultado && typeof resultado === 'object',
        `${contexto}: deve retornar objeto Result (NUNCA lançar exceção — Manifesto §2/§3). Obtido: ${resultado}`);
    assert.strictEqual(resultado.isSuccess, false,
        `${contexto}: o motor DEVE bloquear (isSuccess === false) via Result Pattern, sem throw.`);
    assert.ok(typeof resultado.error === 'string' && resultado.error.length > 0,
        `${contexto}: deve conter 'error' (string técnica não-vazia) explicando a razão física.`);
    for (const termo of termosObrigatorios) {
        assert.ok(termo.test(resultado.error),
            `${contexto}: a mensagem de erro deve comunicar ${termo}. Obtido: "${resultado.error}"`);
    }
    assert.ok(resultado.value === null || resultado.value === undefined,
        `${contexto}: NENHUM valor físico deve ser retornado em um bloqueio. Obtido value=${JSON.stringify(resultado.value)}`);
}

console.log('🧟  AmpAI — Suíte ZOMBIES de Curto-Circuito (IEC 60909-0:2016) — FASE RED\n');

// ╔════════════════════════════════════════════════════════════════════════╗
// ║  I — INTERFACE / CONTRATO (ZOMBIES: Interface)                          ║
// ║  Checklist do contrato. Vermelho agora = método ainda não implementado. ║
// ╚════════════════════════════════════════════════════════════════════════╝
for (const metodo of [
    'calcularImpedanciaRede',
    'calcularImpedanciaTransformador',
    'calcularImpedanciaGerador',
    'calcularImpedanciaCabo',
    'agregarImpedanciaCurto',
]) {
    teste(`I·${metodo}`, `Contrato: CurtoCircuitoIEC60909.${metodo}() deve existir`, () => {
        assert.strictEqual(typeof CurtoCircuitoIEC60909[metodo], 'function',
            `O motor deve expor o método estático ${metodo}() (Fase GREEN pendente).`);
    });
}

// ╔════════════════════════════════════════════════════════════════════════╗
// ║  A — REDE DE ALIMENTAÇÃO (Zq)  — IEC 60909-0:2016, 6.2 / Fórmula (4)    ║
// ╚════════════════════════════════════════════════════════════════════════╝

// A·S (Simple) — caminho feliz: Zq = c·Unq / (√3·I''kq); referida ao lado BT por 1/tr².
teste('A·S', 'Rede — Zq, Zqt, Xqt, Rqt (gabarito CT-158)', () => {
    const v = assertSucesso(
        chamar('calcularImpedanciaRede', { Unq: 20000, IkqPP: 10000, c: 1.10, tr: 48.78 }, 'Rede feliz'),
        'Rede feliz'
    );
    assertAprox(v.Zq, 1.270, 'Zq deve ser 1,270 Ω (tol. 0,5%)');           // BDD §2.1
    assertAprox(v.Zqt, 0.534 * mOhm, 'Zqt (referida ao BT) deve ser 0,534 mΩ');
    assertAprox(v.Xqt, 0.531 * mOhm, 'Xqt = 0,995·Zqt deve ser 0,531 mΩ');
    assertAprox(v.Rqt, 0.0531 * mOhm, 'Rqt = 0,1·Xqt deve ser 0,0531 mΩ');
});

// A·E (Exception/Zero) — I''kq = 0  → divisão por zero na Eq. (4).
teste('A·E1', 'Rede — BLOQUEIO: I\'\'kq = 0 A (divisão por zero)', () => {
    // BDD exige: "I''kq deve ser estritamente positiva (> 0 A)"
    assertBloqueio(
        chamar('calcularImpedanciaRede', { Unq: 20000, IkqPP: 0, c: 1.10, tr: 48.78 }, 'Rede I\'\'kq=0'),
        [/corrente|ikq|i'+kq/i, /positiv|>\s*0|nula|zero|divis/i],
        'Rede I\'\'kq=0'
    );
});

// A·E (Exception) — I''kq negativa → corrente fisicamente impossível.
teste('A·E2', 'Rede — BLOQUEIO: I\'\'kq = -5000 A (corrente impossível)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaRede', { Unq: 20000, IkqPP: -5000, c: 1.10, tr: 48.78 }, 'Rede I\'\'kq<0'),
        [/corrente|ikq|i'+kq/i, /negativ|impossiv|<\s*0/i],
        'Rede I\'\'kq<0'
    );
});

// A·Z (Zero) — tensão nominal nula (§4.1: bloquear Unq ≤ 0).
teste('A·Z', 'Rede — BLOQUEIO: Unq = 0 V', () => {
    assertBloqueio(
        chamar('calcularImpedanciaRede', { Unq: 0, IkqPP: 10000, c: 1.10, tr: 48.78 }, 'Rede Unq=0'),
        [/un|tens/i, /positiv|>\s*0|maior/i],
        'Rede Unq=0'
    );
});

// A·B (Boundary) — relação de transformação tr < 1 (§4.1: bloquear tr < 1 — fora do tap principal).
teste('A·B1', 'Rede — BLOQUEIO: tr = 0,9 (< 1, posição de tap inválida)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaRede', { Unq: 20000, IkqPP: 10000, c: 1.10, tr: 0.9 }, 'Rede tr<1'),
        [/tr|rela|tap/i, /<\s*1|principal|posi|inval/i],
        'Rede tr<1'
    );
});

// A·B (Boundary) — fator de tensão fora da Tabela 1 [0,90; 1,10] (§4.1).
teste('A·B2', 'Rede — BLOQUEIO: c = 1,20 (fora da Tabela 1)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaRede', { Unq: 20000, IkqPP: 10000, c: 1.20, tr: 48.78 }, 'Rede c fora'),
        [/\bc\b|fator|tens/i, /tabela|0[.,]9|1[.,]1|interval|faixa|fora/i],
        'Rede c fora'
    );
});

// ╔════════════════════════════════════════════════════════════════════════╗
// ║  B — TRANSFORMADOR (Zt, Rt, Xt, Kt, Ztk) — IEC 60909-0:2016, 6.3.1/6.3.3 ║
// ╚════════════════════════════════════════════════════════════════════════╝

// B·S (Simple) — caminho feliz: Zt(7), Rt(8), Xt(9) e correção Kt(12a).
teste('B·S', 'Trafo — Zt, Rt, Xt, Kt, Ztk (gabarito CT-158)', () => {
    const v = assertSucesso(
        chamar('calcularImpedanciaTransformador',
            { Srt: 400000, Urt: 410, ukr: 4, Pkrt: 4600, uRr: undefined, cMax: 1.05, tipoTrafo: 'rede' },
            'Trafo feliz'),
        'Trafo feliz'
    );
    assertAprox(v.Zt, 16.81 * mOhm, 'Zt deve ser 16,81 mΩ');               // BDD §2.2
    assertAprox(v.Rt, 4.83 * mOhm, 'Rt deve ser 4,83 mΩ');
    assertAprox(v.Xt, 16.10 * mOhm, 'Xt = √(Zt²−Rt²) deve ser 16,10 mΩ');
    assertAprox(v.Kt, 0.975, 'Kt (Fórmula 12a) deve ser 0,975');
    assert.ok(v.Ztk && typeof v.Ztk === 'object', 'Trafo feliz: Ztk deve ser objeto {re, im}.');
    assertAprox(v.Ztk.re, 4.71 * mOhm, 'Re(Ztk) deve ser 4,71 mΩ');
    assertAprox(v.Ztk.im, 15.70 * mOhm, 'Im(Ztk) deve ser 15,70 mΩ');
});

// B·E (Exception CRÍTICA) — uRr > ukr → Rt > Zt → Xt = √(negativo) IMAGINÁRIO.
// Maior armadilha física do transformador: jamais permitir reatância imaginária.
teste('B·E·crit', 'Trafo — BLOQUEIO CRÍTICO: uRr=5% > ukr=4% (Xt imaginário)', () => {
    // BDD: "uRr nao pode exceder ukr: Rt > Zt torna Xt imaginario (impossivel)"
    assertBloqueio(
        chamar('calcularImpedanciaTransformador',
            { Srt: 400000, Urt: 410, ukr: 4, Pkrt: 4600, uRr: 5, cMax: 1.05, tipoTrafo: 'rede' },
            'Trafo uRr>ukr'),
        [/urr/i, /ukr/i, /imaginar|impossiv|exced|negativ|radicand/i],
        'Trafo uRr>ukr'
    );
});

// B·Z (Zero) — potência nominal nula → divisão por zero na Eq. (7).
teste('B·Z1', 'Trafo — BLOQUEIO: Srt = 0 VA (divisão por zero)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaTransformador',
            { Srt: 0, Urt: 410, ukr: 4, Pkrt: 4600, cMax: 1.05, tipoTrafo: 'rede' }, 'Trafo Srt=0'),
        [/srt|potenc/i, /positiv|>\s*0/i],
        'Trafo Srt=0'
    );
});

// B·E (Exception) — tensão de curto-circuito não positiva (§4.2).
teste('B·E1', 'Trafo — BLOQUEIO: ukr = 0 % (fora da faixa física)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaTransformador',
            { Srt: 400000, Urt: 410, ukr: 0, Pkrt: 4600, cMax: 1.05, tipoTrafo: 'rede' }, 'Trafo ukr=0'),
        [/ukr|curto/i, /positiv|>\s*0|faixa|0\s*%/i],
        'Trafo ukr=0'
    );
});

// B·B (Boundary) — ukr acima do teto físico de 20% (§4.2).
teste('B·B', 'Trafo — BLOQUEIO: ukr = 25 % (> 20% — teto físico)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaTransformador',
            { Srt: 400000, Urt: 410, ukr: 25, Pkrt: 4600, cMax: 1.05, tipoTrafo: 'rede' }, 'Trafo ukr>20'),
        [/ukr/i, /20|faixa|max|excede/i],
        'Trafo ukr>20'
    );
});

// B·Z (Zero) — tensão de referência nula (§4.2).
teste('B·Z2', 'Trafo — BLOQUEIO: Urt = 0 V', () => {
    assertBloqueio(
        chamar('calcularImpedanciaTransformador',
            { Srt: 400000, Urt: 0, ukr: 4, Pkrt: 4600, cMax: 1.05, tipoTrafo: 'rede' }, 'Trafo Urt=0'),
        [/urt|tens/i, /positiv|>\s*0/i],
        'Trafo Urt=0'
    );
});

// B·E (Exception) — perdas no cobre não positivas (§4.2).
teste('B·E2', 'Trafo — BLOQUEIO: Pkrt = 0 W', () => {
    assertBloqueio(
        chamar('calcularImpedanciaTransformador',
            { Srt: 400000, Urt: 410, ukr: 4, Pkrt: 0, cMax: 1.05, tipoTrafo: 'rede' }, 'Trafo Pkrt=0'),
        [/pkrt|perda|cobre/i, /positiv|>\s*0/i],
        'Trafo Pkrt=0'
    );
});

// B·Governança — Kt PROIBIDO em trafo de grupo gerador (usar Ks/Kso, 6.7). Evita dupla correção.
teste('B·Gov', 'Trafo — BLOQUEIO GOVERNANÇA: Kt indevido em grupo gerador', () => {
    // BDD: Kt NÃO deve ser aplicado; motor deve direcionar a Ks/Kso (6.7).
    assertBloqueio(
        chamar('calcularImpedanciaTransformador',
            { Srt: 400000, Urt: 410, ukr: 4, Pkrt: 4600, cMax: 1.05, tipoTrafo: 'grupo_gerador' },
            'Trafo grupo gerador'),
        [/grupo[\s-]?gerador|ks|kso|6\.7/i, /kt|n[ãa]o.*aplic|dupla|corre/i],
        'Trafo grupo gerador'
    );
});

// ╔════════════════════════════════════════════════════════════════════════╗
// ║  C — GERADOR SÍNCRONO (Zgk, Kg) — IEC 60909-0:2016, 6.6.1               ║
// ╚════════════════════════════════════════════════════════════════════════╝

// C·S (Simple) — caminho feliz: Zrg, X''d e Kg (Fórmulas 17/18). Rg=0 → Im(Zgk)=Kg·X''d.
teste('C·S', 'Gerador — Zrg, X\'\'d, Kg (gabarito CT-158)', () => {
    const v = assertSucesso(
        chamar('calcularImpedanciaGerador',
            { Urg: 21000, Srg: 250e6, xdPP: 0.17, cosPhi: 0.78, Un: 21000, cMax: 1.10, Rg: 0, regime: 'maxima' },
            'Gerador feliz'),
        'Gerador feliz'
    );
    assertAprox(v.Zrg, 1.764, 'Zrg = Urg²/Srg deve ser 1,764 Ω');          // BDD §2.3
    assertAprox(v.XdPP, 0.2999, 'X\'\'d = x\'\'d·Zrg deve ser 0,2999 Ω');
    assertAprox(v.Kg, 0.994, 'Kg (Fórmula 18) deve ser 0,994');
    assert.ok(v.Zgk && typeof v.Zgk === 'object', 'Gerador feliz: Zgk deve ser objeto {re, im}.');
    // Consistência da Fórmula (17) com Rg=0: Im(Zgk) = Kg·X''d (derivado de grandezas do próprio BDD).
    assertAprox(v.Zgk.im, 0.994 * 0.2999, 'Im(Zgk) = Kg·X\'\'d deve ser ≈ 0,298 Ω');
});

// C·O (One/regime mínimo) — corrente mínima neutraliza a correção: Kg = 1 exatamente.
teste('C·O', 'Gerador — CORRENTE MÍNIMA: Kg forçado a 1', () => {
    const v = assertSucesso(
        chamar('calcularImpedanciaGerador',
            { Urg: 21000, Srg: 250e6, xdPP: 0.17, cosPhi: 0.78, Un: 21000, cMax: 1.10, Rg: 0, regime: 'minima' },
            'Gerador mínima'),
        'Gerador mínima'
    );
    assertAprox(v.Kg, 1, 'Em corrente mínima Kg deve ser exatamente 1 (sem c_max)', 1e-9);
});

// C·E (Exception) — fator de potência fora de [0; 1] (Esquema do Cenário do BDD).
for (const cosPhi of [1.20, -0.30]) {
    teste(`C·E·cos(${cosPhi})`, `Gerador — BLOQUEIO: cos(φ) = ${cosPhi} (fora de [0; 1])`, () => {
        assertBloqueio(
            chamar('calcularImpedanciaGerador',
                { Urg: 21000, Srg: 250e6, xdPP: 0.17, cosPhi, Un: 21000, cMax: 1.10, Rg: 0, regime: 'maxima' },
                `Gerador cosφ=${cosPhi}`),
            [/cos|fator.*pot/i, /interval|\[0|0;\s*1|fora|1\]|faixa/i],
            `Gerador cosφ=${cosPhi}`
        );
    });
}

// C·E (Exception/Zero) — reatância subtransitória não positiva (BDD + §4.3).
teste('C·E·xdd', 'Gerador — BLOQUEIO: x\'\'d = 0 (subtransitória nula)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaGerador',
            { Urg: 21000, Srg: 250e6, xdPP: 0, cosPhi: 0.78, Un: 21000, cMax: 1.10, Rg: 0, regime: 'maxima' },
            'Gerador x\'\'d=0'),
        [/x'+d|subtransitor|reatan/i, /positiv|>\s*0|nula|zero/i],
        'Gerador x\'\'d=0'
    );
});

// C·Z (Zero) — potência aparente nula → divisão por zero em Zrg (§4.3).
teste('C·Z1', 'Gerador — BLOQUEIO: Srg = 0 VA (divisão por zero)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaGerador',
            { Urg: 21000, Srg: 0, xdPP: 0.17, cosPhi: 0.78, Un: 21000, cMax: 1.10, Rg: 0, regime: 'maxima' },
            'Gerador Srg=0'),
        [/srg|potenc/i, /positiv|>\s*0/i],
        'Gerador Srg=0'
    );
});

// C·Z (Zero) — tensão nominal do gerador nula (§4.3).
teste('C·Z2', 'Gerador — BLOQUEIO: Urg = 0 V', () => {
    assertBloqueio(
        chamar('calcularImpedanciaGerador',
            { Urg: 0, Srg: 250e6, xdPP: 0.17, cosPhi: 0.78, Un: 21000, cMax: 1.10, Rg: 0, regime: 'maxima' },
            'Gerador Urg=0'),
        [/urg|tens/i, /positiv|>\s*0/i],
        'Gerador Urg=0'
    );
});

// C·B (Boundary) — x''d acima do teto físico p.u. = 1 (§4.3).
teste('C·B', 'Gerador — BLOQUEIO: x\'\'d = 1,5 p.u. (> 1)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaGerador',
            { Urg: 21000, Srg: 250e6, xdPP: 1.5, cosPhi: 0.78, Un: 21000, cMax: 1.10, Rg: 0, regime: 'maxima' },
            'Gerador x\'\'d>1'),
        [/x'+d/i, /1|max|interval|excede|faixa/i],
        'Gerador x\'\'d>1'
    );
});

// C·E (Exception) — resistência do gerador negativa (§4.3: bloquear Rg < 0).
teste('C·E·Rg', 'Gerador — BLOQUEIO: Rg = -0,01 Ω (resistência negativa)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaGerador',
            { Urg: 21000, Srg: 250e6, xdPP: 0.17, cosPhi: 0.78, Un: 21000, cMax: 1.10, Rg: -0.01, regime: 'maxima' },
            'Gerador Rg<0'),
        [/rg|resist/i, /negativ|<\s*0|positiv/i],
        'Gerador Rg<0'
    );
});

// ╔════════════════════════════════════════════════════════════════════════╗
// ║  D — LINHA AÉREA / CABO (Zl, Rl, Xl) — IEC 60909-0:2016, 6.4 / Fórm.(32) ║
// ╚════════════════════════════════════════════════════════════════════════╝

// D·S (Simple) — caminho feliz a 20°C: Rl = (ρ/qn)·l ; Xl = x'·l ; |Zl| = √(Rl²+Xl²).
teste('D·S', 'Cabo — Rl, Xl, |Zl| (Cu 120 mm², 100 m)', () => {
    const v = assertSucesso(
        chamar('calcularImpedanciaCabo',
            { qn: 120, L: 100, xLinhaOhmKm: 0.08, rho: 1 / 54, regime: 'maxima' }, 'Cabo feliz'),
        'Cabo feliz'
    );
    assertAprox(v.Rl, 15.43 * mOhm, 'Rl deve ser 15,43 mΩ');               // BDD §2.4
    assertAprox(v.Xl, 8.00 * mOhm, 'Xl = x\'·l deve ser 8,00 mΩ');
    assertAprox(v.moduloZl, 17.38 * mOhm, '|Zl| deve ser 17,38 mΩ');
});

// D·S (Simple/regime mínimo) — correção de resistência pela temperatura, Fórmula (32).
teste('D·S·θ', 'Cabo — CORRENTE MÍNIMA: Rl corrigida a 90°C = 19,75 mΩ', () => {
    const v = assertSucesso(
        chamar('calcularImpedanciaCabo',
            { qn: 120, L: 100, xLinhaOhmKm: 0.08, rho: 1 / 54, regime: 'minima',
              thetaE: 90, alpha: 0.004, thetaMax: 90 }, 'Cabo θ'),
        'Cabo θ'
    );
    // Rl = Rl20·(1 + 0,004·(90−20)) = 15,43·1,28 = 19,75 mΩ
    assertAprox(v.Rl, 19.75 * mOhm, 'Rl corrigida (Fórmula 32) deve ser 19,75 mΩ');
});

// D·Z (Zero) — seção nula → divisão por zero na Eq. (14).
teste('D·Z1', 'Cabo — BLOQUEIO: qn = 0 mm² (divisão por zero)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaCabo',
            { qn: 0, L: 100, xLinhaOhmKm: 0.08, rho: 1 / 54, regime: 'maxima' }, 'Cabo qn=0'),
        [/qn|se[cç]/i, /positiv|>\s*0/i],
        'Cabo qn=0'
    );
});

// D·Z (Zero) — comprimento não positivo (§4.4).
teste('D·Z2', 'Cabo — BLOQUEIO: L = 0 m', () => {
    assertBloqueio(
        chamar('calcularImpedanciaCabo',
            { qn: 120, L: 0, xLinhaOhmKm: 0.08, rho: 1 / 54, regime: 'maxima' }, 'Cabo L=0'),
        [/comprimento|\bl\b/i, /positiv|>\s*0|maior/i],
        'Cabo L=0'
    );
});

// D·E (Exception) — resistividade não positiva (§4.4).
teste('D·E', 'Cabo — BLOQUEIO: ρ = 0 (resistividade não positiva)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaCabo',
            { qn: 120, L: 100, xLinhaOhmKm: 0.08, rho: 0, regime: 'maxima' }, 'Cabo ρ=0'),
        [/rho|resistiv|ρ/i, /positiv|>\s*0/i],
        'Cabo ρ=0'
    );
});

// D·B (Boundary) — temperatura final acima do limite da isolação (§4.4).
teste('D·B1', 'Cabo — BLOQUEIO: θe = 120°C ≥ θmáx isolação (90°C)', () => {
    assertBloqueio(
        chamar('calcularImpedanciaCabo',
            { qn: 120, L: 100, xLinhaOhmKm: 0.08, rho: 1 / 54, regime: 'minima',
              thetaE: 120, alpha: 0.004, thetaMax: 90 }, 'Cabo θ>max'),
        [/temperat|theta|θ|isola/i, /excede|max|>=|>|limite|isola/i],
        'Cabo θ>max'
    );
});

// D·B (Boundary) — frequência fora de {50; 60} Hz (§4.4 / premissa §1).
teste('D·B2', 'Cabo — BLOQUEIO: f = 400 Hz (∉ {50; 60})', () => {
    assertBloqueio(
        chamar('calcularImpedanciaCabo',
            { qn: 120, L: 100, xLinhaOhmKm: 0.08, rho: 1 / 54, regime: 'maxima', f: 400 }, 'Cabo f inválida'),
        [/freq|\bf\b|hz/i, /50|60|\{50|interval/i],
        'Cabo f inválida'
    );
});

// ╔════════════════════════════════════════════════════════════════════════╗
// ║  E — AGREGAÇÃO Zk NO PONTO DE FALTA F (Rk, Xk, |Zk|) + BLINDAGEM DIELÉTRICA ║
// ╚════════════════════════════════════════════════════════════════════════╝

// E·M (Many) — soma série de rede + trafo + cabo curto (gabarito TC002).
teste('E·M', 'Agregação — Zk = (5,18 + j16,37) mΩ, |Zk| = 17,17 mΩ', () => {
    const componentes = [
        { re: 0.053 * mOhm, im: 0.531 * mOhm },   // Zqt
        { re: 4.71 * mOhm, im: 15.70 * mOhm },    // Ztk
        { re: 0.416 * mOhm, im: 0.136 * mOhm },   // Zl (cabo curto)
    ];
    const v = assertSucesso(
        chamar('agregarImpedanciaCurto', { componentes }, 'Agregação feliz'),
        'Agregação feliz'
    );
    assertAprox(v.Rk, 5.18 * mOhm, 'Rk = Σ Ri deve ser 5,18 mΩ');          // BDD §2.5
    assertAprox(v.Xk, 16.37 * mOhm, 'Xk = Σ Xi deve ser 16,37 mΩ');
    assertAprox(v.moduloZk, 17.17 * mOhm, '|Zk| = √(Rk²+Xk²) deve ser 17,17 mΩ');
});

// E·O (One) — agregação de um único componente devolve o próprio componente (identidade).
teste('E·O', 'Agregação — um único componente: |Zk| = √(5²+16²) = 16,76 mΩ', () => {
    const v = assertSucesso(
        chamar('agregarImpedanciaCurto', { componentes: [{ re: 5 * mOhm, im: 16 * mOhm }] }, 'Agregação singleton'),
        'Agregação singleton'
    );
    assertAprox(v.Rk, 5 * mOhm, 'Rk deve igualar o único Ri');
    assertAprox(v.Xk, 16 * mOhm, 'Xk deve igualar o único Xi');
    assertAprox(v.moduloZk, Math.sqrt(25 + 256) * mOhm, '|Zk| deve ser 16,76 mΩ');
});

// E·E (Exception dielétrica) — c_max·Un excede a tensão máxima do equipamento Um.
teste('E·E·diel', 'Agregação — BLOQUEIO DIELÉTRICO: c_max·Un (26,4 kV) > Um (24 kV)', () => {
    // BDD: "c_max*Un (26,4 kV) excede Um (24 kV) — violacao dieletrica"
    assertBloqueio(
        chamar('agregarImpedanciaCurto',
            { componentes: [{ re: 5 * mOhm, im: 16 * mOhm }], Un: 24 * kV, cMax: 1.10, Um: 24 * kV },
            'Agregação dielétrica'),
        [/diel[eé]tric|\bum\b|tens.*max/i, /excede|viola|>|maior/i],
        'Agregação dielétrica'
    );
});

// E·Z (Zero) — impedância de curto tendendo a zero (curto franco → Ik'' → ∞, impossível) (§4.5).
teste('E·Z', 'Agregação — BLOQUEIO: |Zk| → 0 (curto franco, Ik\'\' → ∞)', () => {
    assertBloqueio(
        chamar('agregarImpedanciaCurto',
            { componentes: [{ re: 0, im: 0 }] }, 'Agregação Zk→0'),
        [/zk|impedanc|franco/i, /zero|->\s*0|→\s*0|infinit|nula|franco/i],
        'Agregação Zk→0'
    );
});

// ─────────────────────────────── Relatório final ────────────────────────────
console.log('\n' + '═'.repeat(74));
console.log('RESUMO ZOMBIES — Fase RED (IEC 60909-0:2016 / core_curto_circuito.js)');
console.log(`   ✅ Verdes:    ${verdes}`);
console.log(`   🔴 Vermelhos: ${vermelhos}  (RED = esperado nesta fase)`);
console.log(`   Σ Total:     ${verdes + vermelhos}`);
console.log('═'.repeat(74));

if (vermelhos > 0) {
    console.log('\n🧟  FASE RED CONFIRMADA — o backend ainda não satisfaz o contrato.');
    console.log('    A Fase GREEN deve implementar as equações de impedância no Result Pattern.');
    console.log('    Contrato pendente (algemas ativas):');
    falhas.forEach((f, i) => {
        console.log(`      ${String(i + 1).padStart(2, ' ')}. [${f.id}] ${f.nome}`);
    });
    process.exit(1); // Convenção AmpAI: falha de teste encerra com código 1.
}

console.log('\n✅  VERDE TOTAL — contrato de impedância satisfeito. Liberar para auditoria em nuvem (CodeRabbit).');
process.exit(0);
