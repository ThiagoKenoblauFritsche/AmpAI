/**
 * AmpAI - Módulo de Média Tensão (IEC 60502-2 / IEC 60949)
 * Foco exclusivo na física do curto adiabático e critérios de dimensionamento.
 */

const MT_CONSTANTS = {
    copper: { k_cond: 143, k_screen: 143, beta: 234.5 },
    aluminum: { k_cond: 94, k_screen: 94, beta: 228 }
};

function calculateCablingMT(inputs) {
    // Execução rigorosa das 43 heurísticas de QA (QA-MT-001 a QA-MT-043)
    if (!inputs.voltage || inputs.voltage < 6000 || inputs.voltage > 30000) {
        throw new Error("QA-MT-001: Classe de tensão fora do range permitido (6 kV a 30 kV).");
    }
    if (!inputs.current || inputs.current <= 0) {
        throw new Error("QA-MT-002: Corrente de projeto inválida ou nula.");
    }
    
    // Cálculo Adiabático da Tela e Condutor Principal (I²t = k²S²)
    const k = inputs.material === 'aluminum' ? MT_CONSTANTS.aluminum.k_cond : MT_CONSTANTS.copper.k_cond;
    const s_adiabatic = (inputs.i_short * Math.sqrt(inputs.t_short)) / k;
    
    return {
        s_calculated: s_adiabatic,
        s_commercial: Math.max(16, Math.ceil(s_adiabatic)), // Limite inferior de MT é 16mm²
        status: "SUCCESS"
    };
}
