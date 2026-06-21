/**
 * @file core_curto_circuito.js
 * @description Motor Matemático Isolado para cálculos de Curto-Circuito.
 * @norma Baseado estritamente na norma internacional IEC 60909-0:2016.
 * @architecture Este módulo não possui dependências de Front-End (DOM, UI).
 * @persona @Senior_Backend_Dev — Governança AmpAI v7.0. Zero DOM. Result Pattern estrito (zero `throw`).
 * @fonte docs/features/IEC_60909_Impedancias_BDD.md (verdade única — fórmulas, gabaritos e blindagens físicas)
 */

'use strict';

/** Result Pattern — única forma de retorno permitida neste motor (Manifesto §2/§3, DDD). */
const Result = {
    ok(value) {
        return { isSuccess: true, value, error: null };
    },
    fail(error) {
        return { isSuccess: false, value: null, error };
    },
};

class CurtoCircuitoIEC60909 {
    /**
     * Valida os limites físicos dos parâmetros de entrada (Metodologia ZOMBIES).
     * @returns {Object|null} Result.fail(...) se inválido, ou null se os parâmetros estão OK.
     */
    static _validarLimitesFisicos(Un, Zk, c) {
        if (typeof Un !== 'number' || Un <= 0) {
            return Result.fail('[IEC 60909] Violação Física: A tensão nominal (Un) deve ser maior que 0 Volts.');
        }
        if (typeof Zk !== 'number' || Zk <= 0) {
            return Result.fail('[IEC 60909] Violação Física: A impedância equivalente (Zk) deve ser maior que 0 Ohms.');
        }
        if (typeof c !== 'number' || c <= 0 || c > 1.1) {
            return Result.fail('[IEC 60909] Violação Física: O fator de tensão (c) deve estar no intervalo (0, 1.1].');
        }
        return null;
    }

    /**
     * Calcula a Corrente de Curto-Circuito Inicial Simétrica Trifásica (Ik'').
     * @param {number} Un - Tensão nominal do sistema linha-a-linha em Volts (V).
     * @param {number} Zk - Impedância de curto-circuito equivalente da rede por fase em Ohms (Ω).
     * @param {number} c - Fator de tensão (geralmente 1.05 para BT ou 1.1 para MT/AT).
     * @returns {Object} Result Pattern: { isSuccess, value, error }.
     */
    static calcularCorrenteInicialSimetrica(Un, Zk, c) {
        const erro = this._validarLimitesFisicos(Un, Zk, c);
        if (erro) return erro;

        // Ik'' = (c * Un) / (sqrt(3) * Zk)
        const raizDeTres = Math.sqrt(3);
        const ikDuasLinhas = (c * Un) / (raizDeTres * Zk);

        return Result.ok({
            simbolo: "Ik''",
            descricao: 'Corrente de Curto-Circuito Inicial Simétrica',
            valor_amperes: ikDuasLinhas,
            valor_kiloamperes: ikDuasLinhas / 1000,
            equacao_latex: "I_k'' = \\frac{c \\cdot U_n}{\\sqrt{3} \\cdot Z_k}",
            parametros_utilizados: { Un, Zk, c },
        });
    }

    /**
     * Impedância equivalente da rede de alimentação (Zq) — IEC 60909-0:2016, 6.2, Fórmulas (4) e (6).
     * @returns {Object} Result Pattern com value: { Zq, Zqt, Rqt, Xqt } (Ω).
     */
    static calcularImpedanciaRede({ Unq, IkqPP, c, tr }) {
        if (typeof Unq !== 'number' || Unq <= 0) {
            return Result.fail(`[Rede 6.2] Unq (tensão nominal) deve ser positiva (maior que 0 V). Valor recebido: ${Unq}.`);
        }
        if (typeof tr !== 'number' || tr < 1) {
            return Result.fail(`[Rede 6.2] tr (relação de transformação) deve ser ≥ 1 — posição principal do tap; valor inválido: ${tr}.`);
        }
        if (typeof c !== 'number' || c < 0.90 || c > 1.10) {
            return Result.fail(`[Rede 6.2] Fator de tensão c = ${c} está fora da Tabela 1 (intervalo [0,90; 1,10]) — IEC 60909-0:2016, 5.3.1.`);
        }
        if (typeof IkqPP !== 'number' || IkqPP < 0) {
            return Result.fail(`[Rede 6.2] I''kq negativa é corrente fisicamente impossível (< 0 A). Valor: ${IkqPP} A.`);
        }
        if (IkqPP === 0) {
            return Result.fail("[Rede 6.2] I''kq deve ser estritamente positiva (> 0 A) — corrente nula implica divisão por zero na Fórmula (4).");
        }

        // Fórmula (4): Zq = c·Unq / (√3·I''kq)
        const Zq = (c * Unq) / (Math.sqrt(3) * IkqPP);
        // Fórmula (6): Zqt referida ao lado BT pela razão de transformação tr.
        const Zqt = Zq / (tr * tr);
        // Na ausência de Rq: Xq = 0,995·Zq e Rq = 0,1·Xq (6.2).
        const Xqt = 0.995 * Zqt;
        const Rqt = 0.1 * Xqt;

        return Result.ok({ Zq, Zqt, Rqt, Xqt });
    }

    /**
     * Impedância de transformador de dois enrolamentos — IEC 60909-0:2016, 6.3.1/6.3.3, Fórmulas (7)-(9)-(12a).
     * @param {'rede'|'grupo_gerador'} tipoTrafo Kt aplica-se SOMENTE a 'rede' (grupo gerador usa Ks/Kso, 6.7).
     * @returns {Object} Result Pattern com value: { Zt, Rt, Xt, xT, Kt, Ztk:{re,im} } (Ω).
     */
    static calcularImpedanciaTransformador({ Srt, Urt, ukr, Pkrt, uRr, cMax, tipoTrafo }) {
        if (typeof Srt !== 'number' || Srt <= 0) {
            return Result.fail(`[Trafo 6.3.1] Srt (potência nominal) deve ser estritamente positiva (> 0 VA). Valor: ${Srt}.`);
        }
        if (typeof Urt !== 'number' || Urt <= 0) {
            return Result.fail(`[Trafo 6.3.1] Urt (tensão de referência) deve ser positiva (> 0 V). Valor: ${Urt}.`);
        }
        if (typeof ukr !== 'number' || ukr <= 0) {
            return Result.fail(`[Trafo 6.3.1] ukr (tensão de curto-circuito) deve estar na faixa física positiva (0 % < ukr ≤ 20 %). Valor: ${ukr}%.`);
        }
        if (ukr > 20) {
            return Result.fail(`[Trafo 6.3.1] ukr = ${ukr}% excede o teto físico de 20% (faixa máxima permitida).`);
        }
        if (typeof uRr === 'number' && uRr > ukr) {
            return Result.fail(`[Trafo 6.3.3] uRr (${uRr}%) não pode exceder ukr (${ukr}%): Rt > Zt tornaria Xt imaginário (fisicamente impossível, Fórmula 9).`);
        }
        if (typeof Pkrt !== 'number' || Pkrt <= 0) {
            return Result.fail(`[Trafo 6.3.1] Pkrt (perdas no cobre) deve ser estritamente positiva (> 0 W). Valor: ${Pkrt}.`);
        }

        // Fórmula (7): Zt = (ukr/100)·Urt²/Srt
        const Zt = (ukr / 100) * (Urt * Urt) / Srt;
        // Fórmula (8): Rt = Pkrt·Urt²/Srt² (equivalente a (uRr/100)·Urt²/Srt quando uRr é conhecido)
        const Rt = (Pkrt * Urt * Urt) / (Srt * Srt);

        // Limite físico-matemático (Fórmula 9): exige Rt ≤ Zt, senão Xt seria imaginário.
        const radicando = Zt * Zt - Rt * Rt;
        if (radicando < 0) {
            return Result.fail(`[Trafo 6.3.3] Rt (${Rt}) > Zt (${Zt}): o radicando da Fórmula (9) é negativo — Xt seria imaginário (fisicamente impossível).`);
        }
        const Xt = Math.sqrt(radicando);
        const xT = Xt / ((Urt * Urt) / Srt);

        // Regra de aplicação: Kt é exclusivo de trafo de rede; grupo gerador usa Ks/Kso (6.7).
        if (tipoTrafo === 'grupo_gerador') {
            return Result.fail('[Trafo 6.7] Transformador classificado como grupo-gerador: Kt não deve ser aplicado (evita dupla correção); usar Ks/Kso conforme 6.7.');
        }

        // Fórmula (12a): Kt = 0,95·cMax / (1 + 0,6·xT)
        const Kt = 0.95 * cMax / (1 + 0.6 * xT);
        const Ztk = { re: Kt * Rt, im: Kt * Xt };

        return Result.ok({ Zt, Rt, Xt, xT, Kt, Ztk });
    }

    /**
     * Impedância de gerador síncrono (Zgk, Kg) — IEC 60909-0:2016, 6.6.1, Fórmulas (17) e (18).
     * @param {'maxima'|'minima'} regime Em corrente mínima, Kg = 1 (sem correção c_max).
     * @returns {Object} Result Pattern com value: { Zrg, XdPP, Kg, Zgk:{re,im} } (Ω).
     */
    static calcularImpedanciaGerador({ Urg, Srg, xdPP, cosPhi, Un, cMax, Rg, regime }) {
        if (typeof Urg !== 'number' || Urg <= 0) {
            return Result.fail(`[Gerador 6.6.1] Urg (tensão nominal do gerador) deve ser positiva (> 0 V). Valor: ${Urg}.`);
        }
        if (typeof Srg !== 'number' || Srg <= 0) {
            return Result.fail(`[Gerador 6.6.1] Srg (potência aparente nominal) deve ser estritamente positiva (> 0 VA). Valor: ${Srg}.`);
        }
        if (typeof xdPP !== 'number' || xdPP <= 0) {
            return Result.fail(`[Gerador 6.6.1] x''d (reatância subtransitória) deve ser estritamente positiva (> 0 p.u.); valor nulo/zero. Valor: ${xdPP}.`);
        }
        if (xdPP > 1) {
            return Result.fail(`[Gerador 6.6.1] x''d = ${xdPP} p.u. excede o limite físico (faixa máxima permitida: 1 p.u.).`);
        }
        if (typeof cosPhi !== 'number' || cosPhi < 0 || cosPhi > 1) {
            return Result.fail(`[Gerador 6.6.1] cos(φ) = ${cosPhi} está fora do intervalo físico [0; 1].`);
        }
        if (typeof Rg !== 'number' || Rg < 0) {
            return Result.fail(`[Gerador 6.6.1] Rg (resistência do gerador) não pode ser negativa (< 0 Ω). Valor: ${Rg}.`);
        }

        // Zrg = Urg²/Srg ; X''d = x''d · Zrg
        const Zrg = (Urg * Urg) / Srg;
        const XdPP = xdPP * Zrg;

        // Fórmula (18): em corrente mínima, Kg = 1 (sem correção de c_max).
        let Kg;
        if (regime === 'minima') {
            Kg = 1;
        } else {
            Kg = (Un / Urg) * cMax / (1 + xdPP * Math.sqrt(1 - cosPhi * cosPhi));
        }

        // Fórmula (17): Zgk = Kg·(Rg + j·X''d)
        const Zgk = { re: Kg * Rg, im: Kg * XdPP };

        return Result.ok({ Zrg, XdPP, Kg, Zgk });
    }

    /**
     * Impedância de linha aérea / cabo (Zl) — IEC 60909-0:2016, 6.4 e Fórmula (32).
     * @param {'maxima'|'minima'} regime Em corrente mínima, Rl é corrigida pela temperatura (Fórmula 32).
     * @returns {Object} Result Pattern com value: { Rl, Xl, moduloZl } (Ω).
     */
    static calcularImpedanciaCabo({ qn, L, xLinhaOhmKm, rho, regime, thetaE, alpha, thetaMax, f }) {
        if (typeof qn !== 'number' || qn <= 0) {
            return Result.fail(`[Cabo 6.4] qn (seção nominal) deve ser estritamente positiva (> 0 mm²). Valor: ${qn}.`);
        }
        if (typeof L !== 'number' || L <= 0) {
            return Result.fail(`[Cabo 6.4] L (comprimento) deve ser positivo (maior que 0 m). Valor: ${L}.`);
        }
        if (typeof rho !== 'number' || rho <= 0) {
            return Result.fail(`[Cabo 6.4] rho (resistividade, ρ) deve ser positiva (> 0 Ω·mm²/m). Valor: ${rho}.`);
        }
        if (typeof f === 'number' && f !== 50 && f !== 60) {
            return Result.fail(`[Cabo 6.4] f (frequência) = ${f} Hz está fora do conjunto permitido {50; 60} Hz (premissa de frequência nominal).`);
        }

        // Fórmula (14): Rl20 = (ρ/qn)·L ; Xl = x'·l (x' em Ω/km, L em metros → fator 1e-3)
        const Rl20 = (rho / qn) * L;
        const Xl = xLinhaOhmKm * L * 1e-3;

        let Rl;
        if (regime === 'minima') {
            if (thetaE > thetaMax) {
                return Result.fail(`[Cabo 6.4/32] θe (temperatura final, ${thetaE} °C) excede/atinge o limite da isolação θmáx (${thetaMax} °C).`);
            }
            // Fórmula (32): Rl = Rl20·[1 + α·(θe − 20°C)]
            Rl = Rl20 * (1 + alpha * (thetaE - 20));
        } else {
            Rl = Rl20;
        }

        const moduloZl = Math.sqrt(Rl * Rl + Xl * Xl);

        return Result.ok({ Rl, Xl, moduloZl });
    }

    /**
     * Agregação da impedância de curto Zk no ponto de falta F — soma série + blindagem dielétrica.
     * @param {Array<{re:number, im:number}>} componentes Impedâncias (Ω) já referidas ao mesmo nível de tensão.
     * @returns {Object} Result Pattern com value: { Rk, Xk, moduloZk } (Ω).
     */
    static agregarImpedanciaCurto({ componentes, Un, cMax, Um }) {
        if (!Array.isArray(componentes) || componentes.length === 0) {
            return Result.fail('[Agregação Zk] componentes deve ser um array não-vazio de impedâncias {re, im} (Ω).');
        }

        const Rk = componentes.reduce((soma, z) => soma + z.re, 0);
        const Xk = componentes.reduce((soma, z) => soma + z.im, 0);
        const moduloZk = Math.sqrt(Rk * Rk + Xk * Xk);

        // Blindagem dielétrica: c_max·Un não deve exceder Um (restrição da Tabela 1).
        if (typeof Un === 'number' && typeof cMax === 'number' && typeof Um === 'number') {
            const tensaoEquivalente = cMax * Un;
            if (tensaoEquivalente > Um) {
                return Result.fail(`[Agregação Zk] c_max·Un (${(tensaoEquivalente / 1000).toFixed(1)} kV) excede Um (${(Um / 1000).toFixed(1)} kV) — violação dielétrica.`);
            }
        }

        // Curto franco (|Zk| → 0) implicaria Ik'' → ∞, fisicamente impossível.
        if (moduloZk < 1e-9) {
            return Result.fail("[Agregação Zk] |Zk| → 0: curto franco sem impedância — Ik'' tenderia a infinito (fisicamente impossível).");
        }

        return Result.ok({ Rk, Xk, moduloZk });
    }
}

// Exportação para Node.js (Testes) ou ES6 Modules (Front-End)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CurtoCircuitoIEC60909 };
}
