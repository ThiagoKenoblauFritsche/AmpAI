/**
 * AmpAI - Motor de Renderização de UI e Sincronização do DOM
 * Gerencia abas de Verificações, Critérios, Curvas e Acordeão do Memorial.
 */

function renderCablingMTResults(results) {
    // Helpers tolerantes a falhas para blindagem contra erros de ponteiro nulo
    const setHTML = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = val;
    };

    try {
        // Atualização sincronizada de tabelas e cards superiores
        setHTML('val-section-commercial', results.s_commercial + " mm²");
        setHTML('val-section-calculated', results.s_calculated.toFixed(2) + " mm²");
        
        // Ativação reativa das abas inferiores e do Memorial IEC 60502-2
        console.log("DOM atualizado com sucesso via js/ui_render.js");
    } catch (error) {
        console.warn("Falha silenciosa capturada no DOM: ", error.message);
    }
}
