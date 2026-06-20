/**
 * @file core_curto_circuito.js
 * @description Motor Matemático Isolado para cálculos de Curto-Circuito.
 * @norma Baseado estritamente na norma internacional IEC 60909-0.
 * @architecture Este módulo não possui dependências de Front-End (DOM, UI).
 */

class CurtoCircuitoIEC60909 {
    /**
     * Valida os limites físicos dos parâmetros de entrada (Metodologia ZOMBIES).
     * @param {number} Un Tensão nominal (Volts)
     * @param {number} Zk Impedância equivalente da rede (Ohms)
     * @param {number} c Fator de tensão (Adimensional)
     */
    static _validarLimitesFisicos(Un, Zk, c) {
        if (typeof Un !== 'number' || Un <= 0) {
            throw new Error("[IEC 60909] Violação Física: A tensão nominal (Un) deve ser maior que 0 Volts.");
        }
        if (typeof Zk !== 'number' || Zk <= 0) {
            throw new Error("[IEC 60909] Violação Física: A impedância equivalente (Zk) deve ser maior que 0 Ohms.");
        }
        if (typeof c !== 'number' || c <= 0 || c > 1.1) {
            throw new Error("[IEC 60909] Violação Física: O fator de tensão (c) deve estar no intervalo (0, 1.1].");
        }
    }

    /**
     * Calcula a Corrente de Curto-Circuito Inicial Simétrica Trifásica (Ik'').
     * @param {number} Un - Tensão nominal do sistema linha-a-linha em Volts (V).
     * @param {number} Zk - Impedância de curto-circuito equivalente da rede por fase em Ohms (Ω).
     * @param {number} c - Fator de tensão (geralmente 1.05 para BT ou 1.1 para MT/AT).
     * @returns {Object} Um objeto contendo a corrente em Amperes (A) e os metadados do cálculo.
     */
    static calcularCorrenteInicialSimetrica(Un, Zk, c) {
        // 1. Validação defensiva
        this._validarLimitesFisicos(Un, Zk, c);

        // 2. Memorial de Cálculo (Equação Base da IEC 60909)
        // Ik'' = (c * Un) / (sqrt(3) * Zk)
        const raizDeTres = Math.sqrt(3);
        const ikDuasLinhas = (c * Un) / (raizDeTres * Zk);

        // 3. Retorno Estruturado (Pronto para consumo via API ou Front-End)
        return {
            simbolo: "Ik''",
            descricao: "Corrente de Curto-Circuito Inicial Simétrica",
            valor_amperes: ikDuasLinhas,
            valor_kiloamperes: ikDuasLinhas / 1000,
            equacao_latex: "I_k'' = \\frac{c \\cdot U_n}{\\sqrt{3} \\cdot Z_k}",
            parametros_utilizados: { Un, Zk, c }
        };
    }
}

// Exportação para Node.js (Testes Jest) ou ES6 Modules (Front-End)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CurtoCircuitoIEC60909 };
}
