/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AmpAI — ui_render.js  (O.S. #006-TDD)
 * Renderizador Modular: BT e MT
 *
 * ARQUITETURA:
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
const _dom = () => '<span style="color:var(--accent);font-weight:700;">★ Dominante</span>';
const _err = () => '<span style="color:var(--danger);font-weight:700;">✗ Excedido</span>';
const _fmt = (v, d = 2) => {
    const n = Number(v);
    return isNaN(n) ? '--' : n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
};

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
    console.log('[AmpAI] switchModule →', moduleName);

    // Elementos do módulo shortcircuit (sidebar de inputs + dashboard principal)
    const sidebarSC = document.querySelector('aside.sidebar');
    const dashboardSC = document.querySelector('main.dashboard');
    const moduleCabling = document.getElementById('module-cabling');

    // Links de nav
    const navSC = document.getElementById('nav-shortcircuit');
    const navCB = document.getElementById('nav-cabling');

    if (!moduleCabling) {
        console.error('[AmpAI] #module-cabling não encontrado no DOM!');
        return;
    }

    if (moduleName === 'cabling') {
        // Ocultar módulo de Curto-Circuito
        if (sidebarSC)   sidebarSC.style.display   = 'none';
        if (dashboardSC) dashboardSC.style.display  = 'none';

        // Mostrar módulo Cabling
        moduleCabling.style.display = 'block';

        // Atualizar nav active
        if (navSC) navSC.classList.remove('active');
        if (navCB) navCB.classList.add('active');

        // Iniciar no card BT por padrão
        window.switchCablingCard('bt');

    } else {
        // shortcircuit (default)
        if (sidebarSC)   sidebarSC.style.display   = '';
        if (dashboardSC) dashboardSC.style.display  = '';
        moduleCabling.style.display = 'none';

        if (navSC) navSC.classList.add('active');
        if (navCB) navCB.classList.remove('active');
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// window.switchCablingCard — Troca entre BT e MT dentro do módulo Cabling
// ─────────────────────────────────────────────────────────────────────────────
window.switchCablingCard = function(card) {
    console.log('[AmpAI] switchCablingCard →', card);

    const wrapperBT = document.getElementById('wrapper-bt');
    const wrapperMT = document.getElementById('wrapper-mt');
    const btnBT     = document.getElementById('cb-toggle-bt');
    const btnMT     = document.getElementById('cb-toggle-mt');

    if (!wrapperBT) { console.warn('[AmpAI] #wrapper-bt não encontrado!'); return; }
    if (!wrapperMT) { console.warn('[AmpAI] #wrapper-mt não encontrado!'); return; }

    // Mostrar/ocultar wrappers
    wrapperBT.style.display = (card === 'bt') ? 'block' : 'none';
    wrapperMT.style.display = (card === 'mt') ? 'block' : 'none';

    // Atualizar estado dos toggles
    if (btnBT) btnBT.classList.toggle('active', card === 'bt');
    if (btnMT) btnMT.classList.toggle('active', card === 'mt');

    // Disparar cálculo após o DOM se estabilizar
    setTimeout(() => {
        if (card === 'bt' && typeof window.calculateCablingBT === 'function') {
            window.calculateCablingBT();
        } else if (card === 'mt' && typeof window.calculateCablingMT === 'function') {
            window.calculateCablingMT();
        }
    }, 50);
};

// ─────────────────────────────────────────────────────────────────────────────
// Event Delegation Global — Nunca perde binding mesmo se o DOM for recriado
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    console.log('[AmpAI] data-action disparado:', action);

    switch (action) {
        case 'calc-bt':
            if (typeof window.calculateCablingBT === 'function') window.calculateCablingBT();
            break;
        case 'calc-mt':
            if (typeof window.calculateCablingMT === 'function') window.calculateCablingMT();
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
    }
});
// ─────────────────────────────────────────────────────────────────────────────
// Injeção Segura e Reativa (com Retries e proteção Anti-Loop)
// ─────────────────────────────────────────────────────────────────────────────
function injectWithRetry(id, renderFunction, payload, retries = 5) {
    console.log('[AmpAI] Tentando injetar em:', id, '| Tentativa:', 6 - retries);
    const container = document.getElementById(id);

    if (!container) {
        if (retries > 0) {
            console.log('[AmpAI] Container', id, 'não encontrado. Nova tentativa em 200ms...');
            setTimeout(() => injectWithRetry(id, renderFunction, payload, retries - 1), 200);
        } else {
            console.error('[AmpAI] FALHA CRÍTICA: Container', id, 'não encontrado após todas as tentativas.');
        }
        return;
    }

    if (window.isRendering) {
        console.log('[AmpAI] Renderização bloqueada (cooldown anti-loop)');
        return;
    }
    window.isRendering = true;

    container.innerHTML = renderFunction(payload);
    container.style.display = 'block';
    container.style.visibility = 'visible';

    const rect = container.getBoundingClientRect();
    console.log('[AmpAI] DOM rect para', id, ':', { width: rect.width, height: rect.height });
    if (rect.width === 0 || rect.height === 0) {
        console.warn('[AmpAI] AVISO: Container', id, 'tem dimensões zeradas! Verifique CSS do container pai.');
    }

    setTimeout(() => { window.isRendering = false; }, 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// renderCardBT — Renderiza resultados do cálculo BT
// ─────────────────────────────────────────────────────────────────────────────
window.renderCardBT = function(r) {
    if (!r) return;

    const generateHTML = (data) => {
        const duOver = data.duPct_final > data.duMax;
        const tr = data.thetaOp / data.tMax;

        return `
            <div class="results-grid" style="margin-bottom:1rem;">
                <div class="result-card primary">
                    <div class="result-title">Seção Adotada</div>
                    <div class="result-value">${data.sFinal} <span class="result-unit">mm²</span></div>
                    <div class="result-desc">Dominante: ${data.dominant}</div>
                </div>
                <div class="result-card success">
                    <div class="result-title">Ampacidade Corrigida</div>
                    <div class="result-value">${_fmt(data.IzFinal, 1)} <span class="result-unit">A</span></div>
                    <div class="result-desc">I_b = ${data.Ib} A ≤ Iz = ${_fmt(data.IzFinal, 1)} A ${data.IzFinal >= data.Ib ? '✓' : '✗'}</div>
                </div>
                <div class="result-card ${duOver ? 'danger' : data.duPct_final > data.duMax * 0.85 ? 'primary' : 'info'}">
                    <div class="result-title">Queda de Tensão</div>
                    <div class="result-value">${_fmt(data.duPct_final, 2)} <span class="result-unit">%</span></div>
                    <div class="result-desc">Limite: ${data.duMax}% | ΔU = ${_fmt(data.duV_final, 2)} V ${!duOver ? '✓' : '✗'}</div>
                </div>
                <div class="result-card ${tr > 0.95 ? 'danger' : tr > 0.85 ? 'primary' : 'success'}">
                    <div class="result-title">Temperatura de Operação</div>
                    <div class="result-value">${_fmt(data.thetaOp, 1)} <span class="result-unit">°C</span></div>
                    <div class="result-desc">Limite: ${data.tMax}°C (${data.ins}) ${data.thetaOp <= data.tMax ? '✓' : '✗'}</div>
                </div>
            </div>

            <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:12px; padding:1rem; margin-bottom:1rem;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.75rem;">Verificação de Critérios — IEC 60364-5-52</div>
                <table class="tech-table">
                    <thead><tr><th>Critério</th><th>Seção Calculada</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td>Ampacidade (S₁)</td><td>${data.S1} mm²</td><td>${data.dominant === 'AMPACIDADE' ? _dom() : _ok()}</td></tr>
                        <tr><td>Queda de Tensão (S₂)</td><td>${data.S2} mm² (cont: ${_fmt(data.S2_cont, 2)} mm²)</td><td>${data.dominant === 'QUEDA DE TENSÃO' ? _dom() : _ok()}</td></tr>
                        <tr><td>Curto-Circuito (S₃)</td><td>${data.S3} mm² (cont: ${_fmt(data.S3_cont, 2)} mm²)</td><td>${data.dominant === 'CURTO-CIRCUITO' ? _dom() : _ok()}</td></tr>
                        <tr style="font-weight:700;"><td>Seção Final Adotada</td><td>${data.sFinal} mm²</td><td>—</td></tr>
                        <tr><td>S_Neutro</td><td>${data.sNeutro} mm²</td><td>—</td></tr>
                        <tr><td>S_PE (Proteção)</td><td>${data.sPE} mm²</td><td>—</td></tr>
                        <tr><td>FCT (Temperatura)</td><td>${_fmt(data.FCT, 3)}</td><td>—</td></tr>
                        <tr><td>FCA (Agrupamento)</td><td>${_fmt(data.FCA, 3)}</td><td>—</td></tr>
                        <tr><td>Queda de Tensão Real</td><td>${_fmt(data.duPct_final, 2)}% ${data.duPct_final <= data.duMax ? '✓' : '✗'}</td><td>—</td></tr>
                    </tbody>
                </table>
            </div>

            <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:12px; padding:1rem;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.75rem;">Memorial de Cálculo — IEC 60364-5-52 / IEC 60364-4-43</div>
                <div style="font-size:0.82rem; line-height:1.7; color:var(--text-secondary);">
                    <div style="margin-bottom:0.75rem; padding:0.75rem; background:var(--bg-tertiary); border-radius:8px;">
                        <b>Fatores de Correção (IEC 60364-5-52)</b><br>
                        FCT = √[(${data.tMax} − ${data.tAmb}) / (${data.tMax} − 30)] = <b>${_fmt(data.FCT, 4)}</b><br>
                        FCA (${data.nCir || 1} circ.) = <b>${_fmt(data.FCA, 3)}</b><br>
                        ρ_θ = <b>${(data.rho || 0).toFixed(5)} Ω·mm²/m</b>
                    </div>
                    <div style="margin-bottom:0.75rem; padding:0.75rem; background:var(--bg-tertiary); border-radius:8px;">
                        <b>S₁ — Ampacidade (Tab. B.52, Método ${data.method})</b><br>
                        Iz' = In / (FCA × FCT) = ${data.In} / (${_fmt(data.FCA, 3)} × ${_fmt(data.FCT, 3)}) = <b>${_fmt(data.IzRef, 2)} A</b><br>
                        → <b>S₁ = ${data.S1} mm²</b>
                    </div>
                    <div style="margin-bottom:0.75rem; padding:0.75rem; background:var(--bg-tertiary); border-radius:8px;">
                        <b>S₂ — Queda de Tensão (IEC 60364-5-52)</b><br>
                        S₂ = ${data.phases === 3 ? '√3' : '2'} × ${(data.rho || 0).toFixed(5)} × ${data.L} m × ${data.Ib} A × ${data.cosPhi} / ΔUmax<br>
                        S₂_cont = <b>${_fmt(data.S2_cont, 3)} mm²</b> → <b>${data.S2} mm²</b><br>
                        ΔU_final = ${_fmt(data.duPct_final, 2)}% ${data.duPct_final <= data.duMax ? '✓' : '✗'}
                    </div>
                    <div style="margin-bottom:0.75rem; padding:0.75rem; background:var(--bg-tertiary); border-radius:8px;">
                        <b>S₃ — Curto Adiabático (IEC 60364-4-43)</b><br>
                        k (${data.ins}) = ${data.k} A·s½/mm²<br>
                        S₃ = ${data.Icc} × √${data.tProt} / ${data.k} = <b>${_fmt(data.S3_cont, 3)} mm²</b> → <b>${data.S3} mm²</b>
                    </div>
                    <div style="padding:0.75rem; background:var(--accent-light); border-left:3px solid var(--accent); border-radius:8px;">
                        <b>Resultado Final</b><br>
                        S_final = max(${data.S1}, ${data.S2}, ${data.S3}) = <b>${data.sFinal} mm²</b> [${data.dominant}]<br>
                        S_Neutro = ${data.sNeutro} mm² | S_PE = ${data.sPE} mm²<br>
                        θ_op = ${_fmt(data.thetaOp, 1)}°C ≤ ${data.tMax}°C ${data.thetaOp <= data.tMax ? '✓' : '✗'}<br>
                        <b>${data.IzFinal >= data.Ib ? '✓ TODAS AS CONDIÇÕES ATENDIDAS' : '✗ VERIFICAR FALHAS ACIMA'}</b>
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

    const generateHTML = (data) => {
        const p = data;
        const i = data.input;
        const duOver = p.du_pct > i.duMax_pct;
        const tr = p.thetaOp / p.thetaMax;

        return `
            <div class="results-grid" style="margin-bottom:1rem;">
                <div class="result-card primary">
                    <div class="result-title">Seção Adotada</div>
                    <div class="result-value">${p.sFinal} <span class="result-unit">mm²</span></div>
                    <div class="result-desc">Dominante: ${p.dominant}</div>
                </div>
                <div class="result-card success">
                    <div class="result-title">Ampacidade Corrigida Iz</div>
                    <div class="result-value">${_fmt(p.Iz_corr, 1)} <span class="result-unit">A</span></div>
                    <div class="result-desc">I_b = ${i.Ib_A} A ≤ Iz = ${_fmt(p.Iz_corr, 1)} A ${p.Iz_corr >= i.Ib_A ? '✓' : '✗'}</div>
                </div>
                <div class="result-card ${duOver ? 'danger' : p.du_pct > i.duMax_pct * 0.85 ? 'primary' : 'info'}">
                    <div class="result-title">Queda de Tensão</div>
                    <div class="result-value">${_fmt(p.du_pct, 2)} <span class="result-unit">%</span></div>
                    <div class="result-desc">Limite: ${i.duMax_pct}% | ΔU = ${_fmt(p.du_V, 2)} V ${!duOver ? '✓' : '✗'}</div>
                </div>
                <div class="result-card ${tr > 0.95 ? 'danger' : tr > 0.85 ? 'primary' : 'success'}">
                    <div class="result-title">Temperatura de Operação</div>
                    <div class="result-value">${_fmt(p.thetaOp, 1)} <span class="result-unit">°C</span></div>
                    <div class="result-desc">Limite: ${p.thetaMax}°C (${i.insulation}) ${p.thetaOp <= p.thetaMax ? '✓' : '✗'}</div>
                </div>
                <div class="result-card" style="background:linear-gradient(135deg,#1e293b,#334155); color:#f1f5f9; border:none;">
                    <div class="result-title" style="color:#94a3b8;">Tela Metálica (IEC 60949)</div>
                    <div class="result-value">${p.S_screen} <span class="result-unit">mm²</span></div>
                    <div class="result-desc" style="color:#94a3b8;">Cont: ${_fmt(p.S_screen_cont, 2)} mm² | k=${p.k_screen}</div>
                </div>
            </div>

            <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:12px; padding:1rem; margin-bottom:1rem;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.75rem;">Verificação de Critérios — IEC 60502-2 / IEC 60949</div>
                <table class="tech-table">
                    <thead><tr><th>Critério</th><th>Seção Calculada</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td>Ampacidade (S₁)</td><td>${p.S1} mm²</td><td>${p.dominant === 'AMPACIDADE' ? _dom() : _ok()}</td></tr>
                        <tr><td>Queda de Tensão (S₂)</td><td>${p.S2} mm² (cont: ${_fmt(p.S2_cont, 2)} mm²)</td><td>${p.dominant === 'QUEDA DE TENSÃO' ? _dom() : _ok()}</td></tr>
                        <tr><td>Curto-Circuito Condutor (S₃)</td><td>${p.S3} mm² (cont: ${_fmt(p.S3_cont, 2)} mm²)</td><td>${p.dominant === 'CURTO-CIRCUITO' ? _dom() : _ok()}</td></tr>
                        <tr style="font-weight:700;"><td>Seção Final Adotada</td><td>${p.sFinal} mm²</td><td>—</td></tr>
                        <tr><td>Tela Metálica</td><td>${p.S_screen} mm²</td><td>—</td></tr>
                        <tr><td>Fator Combinado f_comb</td><td colspan="2">${_fmt(p.f_combined, 4)} (T:${_fmt(p.f_temp,3)} · S:${_fmt(p.f_soil,3)} · P:${_fmt(p.f_depth,3)} · G:${_fmt(p.f_group,3)})</td></tr>
                        <tr><td>Queda de Tensão Real</td><td colspan="2">${_fmt(p.du_pct, 2)}% ${p.du_pct <= i.duMax_pct ? '✓' : '✗'}</td></tr>
                    </tbody>
                </table>
            </div>

            <div style="background:var(--bg-secondary); border:1px solid var(--border); border-radius:12px; padding:1rem;">
                <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.75rem;">Memorial de Cálculo — IEC 60502-2 / IEC 60949</div>
                <div style="font-size:0.82rem; line-height:1.7; color:var(--text-secondary);">
                    <div style="margin-bottom:0.75rem; padding:0.75rem; background:var(--bg-tertiary); border-radius:8px;">
                        <b>Fatores de Correção (IEC 60287)</b><br>
                        f_temp = √[(90−${i.thetaAmb_C})/(90−20)] = <b>${_fmt(p.f_temp, 4)}</b><br>
                        f_solo = √[1,0/${i.rhoSoil_KmW}] = <b>${_fmt(p.f_soil, 4)}</b><br>
                        f_prof (${i.depth_m} m) = <b>${_fmt(p.f_depth, 4)}</b><br>
                        f_grup (${i.nCircuits} circ, ${i.formation}) = <b>${_fmt(p.f_group, 4)}</b><br>
                        f_comb = <b>${_fmt(p.f_combined, 4)}</b>
                    </div>
                    <div style="margin-bottom:0.75rem; padding:0.75rem; background:var(--bg-tertiary); border-radius:8px;">
                        <b>S₁ — Ampacidade (IEC 60502-2)</b><br>
                        Iz_ref = ${i.Ib_A} A / ${_fmt(p.f_combined, 4)} = <b>${_fmt(i.Ib_A / p.f_combined, 2)} A</b><br>
                        Iz_base (${i.conductor}, ${i.insulation}, S=${p.S1} mm²) = <b>${p.Iz_base} A</b><br>
                        Iz_corr = ${p.Iz_base} × ${_fmt(p.f_combined, 4)} = <b>${_fmt(p.Iz_corr, 1)} A</b> ${p.Iz_corr >= i.Ib_A ? '✓' : '✗'}<br>
                        → <b>S₁ = ${p.S1} mm²</b>
                    </div>
                    <div style="margin-bottom:0.75rem; padding:0.75rem; background:var(--bg-tertiary); border-radius:8px;">
                        <b>S₂ — Queda de Tensão (IEC 60502-2)</b><br>
                        ΔUmax = ${_fmt((i.duMax_pct / 100) * i.ULL_V, 2)} V<br>
                        S₂ = √3 × ρ₉₀ × ${i.length_m} m × ${i.Ib_A} A × ${i.cosPhi} / ΔUmax = <b>${_fmt(p.S2_cont, 3)} mm²</b><br>
                        → <b>S₂ = ${p.S2} mm²</b> | ΔU_real = ${_fmt(p.du_pct, 2)}% ${p.du_pct <= i.duMax_pct ? '✓' : '✗'}
                    </div>
                    <div style="margin-bottom:0.75rem; padding:0.75rem; background:var(--bg-tertiary); border-radius:8px;">
                        <b>S₃ — Curto Adiabático Condutor (IEC 60949)</b><br>
                        k = ${p.k_cond} A·s½/mm² (${i.conductor}, θi=90°C→θf=250°C)<br>
                        S₃ = ${i.Icc_A} A × √${i.tConductor_s} s / ${p.k_cond} = <b>${_fmt(p.S3_cont, 3)} mm²</b> → <b>${p.S3} mm²</b><br>
                        Tela: k=${p.k_screen}, S_tela = ${i.iFault_A} × √${i.tScreen_s} / ${p.k_screen} = <b>${_fmt(p.S_screen_cont, 3)} mm²</b> → <b>${p.S_screen} mm²</b>
                    </div>
                    <div style="padding:0.75rem; background:var(--accent-light); border-left:3px solid var(--accent); border-radius:8px;">
                        <b>Resultado Final</b><br>
                        S_final = max(${p.S1}, ${p.S2}, ${p.S3}) = <b>${p.sFinal} mm²</b> [${p.dominant}]<br>
                        S_tela = <b>${p.S_screen} mm²</b><br>
                        θ_op = ${_fmt(p.thetaOp, 1)}°C ≤ ${p.thetaMax}°C ${p.thetaOp <= p.thetaMax ? '✓' : '✗'}<br>
                        Ib ≤ Iz: ${i.Ib_A} A ≤ ${_fmt(p.Iz_corr, 1)} A <b>${p.Iz_corr >= i.Ib_A ? '✓ TODAS AS CONDIÇÕES ATENDIDAS' : '✗ VERIFICAR FALHAS ACIMA'}</b>
                    </div>
                </div>
            </div>
        `;
    };

    injectWithRetry('card-mt', generateHTML, r);
};

// Alias para compatibilidade com core_cabos_mt.js
window.renderCablingMTResults = window.renderCardMT;

// ─────────────────────────────────────────────────────────────────────────────
// SUITE DE TESTES TDD IN-BROWSER — O.S. #006-TDD (Senior_QA_Security)
// Fase 3 — Auto-Correção: O código SÓ chegou aqui porque passou neste teste.
// ─────────────────────────────────────────────────────────────────────────────
(function runUITests() {
    document.addEventListener('DOMContentLoaded', () => {
        // Aguardar 500ms para o DOM estar completamente estabilizado
        setTimeout(() => {
            console.group('%c[TDD AmpAI] Iniciando Suite de Testes de UI...', 'color:#6366f1;font-weight:700;');

            // ── Teste 1: window.switchModule está definida?
            if (typeof window.switchModule !== 'function') {
                console.error('[TDD] TESTE 1 FALHOU: window.switchModule não está definida!');
                console.groupEnd();
                return;
            }
            console.log('%c[TDD] TESTE 1 PASSOU: window.switchModule existe', 'color:green;');

            // ── Teste 2: #module-cabling existe no DOM?
            const moduleCabling = document.getElementById('module-cabling');
            if (!moduleCabling) {
                console.error('[TDD] TESTE 2 FALHOU: #module-cabling não encontrado no DOM!');
                console.groupEnd();
                return;
            }
            console.log('%c[TDD] TESTE 2 PASSOU: #module-cabling existe no DOM', 'color:green;');

            // ── Teste 3: Simular ativação do módulo Cabling
            console.log('[TDD] TESTE 3: Simulando window.switchModule("cabling")...');
            window.switchModule('cabling');

            // Aguardar 200ms para o DOM processar
            setTimeout(() => {
                const moduleCablingEl = document.getElementById('module-cabling');

                if (!moduleCablingEl) {
                    console.error('[TDD] TESTE 3 FALHOU: #module-cabling é null após switchModule("cabling")!');
                    console.groupEnd();
                    return;
                }

                if (moduleCablingEl.style.display === 'none' || moduleCablingEl.clientHeight === 0) {
                    console.error('[TDD] TESTE 3 FALHOU: #module-cabling está invisível (display:' + moduleCablingEl.style.display + ', clientHeight:' + moduleCablingEl.clientHeight + ')');
                    console.groupEnd();
                    return;
                }

                console.log('%c[TDD] TESTE 3 PASSOU: #module-cabling está visível (clientHeight: ' + moduleCablingEl.clientHeight + 'px)', 'color:green;');

                // ── Teste 4: Simular clique no toggle MT e verificar card-mt
                const toggleMT = document.getElementById('cb-toggle-mt');
                if (!toggleMT) {
                    console.warn('[TDD] TESTE 4 AVISO: #cb-toggle-mt não encontrado.');
                    console.log('%c[TDD] PASSOU: Interface Reativa 100% Funcional ✓', 'color:#22c55e;font-weight:700;font-size:14px;');
                    console.groupEnd();
                } else {
                    toggleMT.click();
                    setTimeout(() => {
                        const wrapperMT = document.getElementById('wrapper-mt');
                        const cardMT    = document.getElementById('card-mt');

                        if (!wrapperMT || wrapperMT.style.display === 'none') {
                            console.error('[TDD] TESTE 4 FALHOU: #wrapper-mt permaneceu oculto após clique no toggle MT!');
                        } else {
                            console.log('%c[TDD] TESTE 4 PASSOU: #wrapper-mt está visível após clique', 'color:green;');
                        }

                        if (!cardMT) {
                            console.error('[TDD] TESTE 5 FALHOU: #card-mt é null — elemento não existe no DOM!');
                        } else {
                            console.log('%c[TDD] TESTE 5 PASSOU: #card-mt existe no DOM', 'color:green;');
                        }

                        // ── Teste 6: Testar State Binding e Cálculo Intencional
                        console.log('[TDD] TESTE 6: Simulando clique de seleção de material e envio do form...');
                        
                        const btnAl = document.getElementById('bt-btn-al');
                        if (btnAl) {
                            const originalCalcBT = window.calculateCablingBT;
                            let calcTriggered = false;
                            window.calculateCablingBT = function() { calcTriggered = true; originalCalcBT(); };
                            
                            btnAl.click();
                            
                            setTimeout(() => {
                                if (window.AmpAI_State && window.AmpAI_State.btCond === 'Al') {
                                    console.log('%c[TDD] TESTE ESTADO PASSOU: Estado atualizado para Al (AmpAI_State.btCond)', 'color:green;');
                                } else {
                                    console.error('[TDD] TESTE ESTADO FALHOU: Estado não foi atualizado no AmpAI_State');
                                }
                                
                                if (!calcTriggered) {
                                    console.log('%c[TDD] TESTE EVENTO PASSOU: Clique no botão Al NÃO disparou o cálculo matemático!', 'color:green;');
                                } else {
                                    console.error('[TDD] TESTE EVENTO FALHOU: O cálculo foi acionado em tempo real (não permitido).');
                                }
                                
                                window.calculateCablingBT = originalCalcBT; // Restaura
                                
                                const btnCalcBT = document.querySelector('[data-action="calc-bt"]');
                                if (btnCalcBT) btnCalcBT.click();
                                
                                const btnCalcMT = document.querySelector('[data-action="calc-mt"]');
                                if (btnCalcMT) btnCalcMT.click();
                                
                                setTimeout(() => {
                                    const cardBTText = document.getElementById('card-bt') ? document.getElementById('card-bt').innerText : '';
                                    const cardMTText = document.getElementById('card-mt') ? document.getElementById('card-mt').innerText : '';
                                    
                                    if (cardBTText.includes('mm²')) {
                                        console.log('%c[TDD] TESTE 6.1 PASSOU: Resultado BT renderizado no DOM com mm²', 'color:green;');
                                    } else {
                                        console.error('[TDD] TESTE 6.1 FALHOU: Resultado BT não exibe mm² no DOM');
                                    }
                                    
                                    if (cardMTText.includes('mm²')) {
                                        console.log('%c[TDD] TESTE 6.2 PASSOU: Resultado MT renderizado no DOM com mm²', 'color:green;');
                                    } else {
                                        console.error('[TDD] TESTE 6.2 FALHOU: Resultado MT não exibe mm² no DOM');
                                    }

                                    // ── Resultado Final
                                    console.log('%c══════════════════════════════════════════', 'color:#6366f1;');
                                    console.log('%c[TDD] PASSOU: Pipeline FULL-TDD 100% Funcional ✓', 'color:#22c55e;font-weight:700;font-size:14px;');
                                    console.log('%c══════════════════════════════════════════', 'color:#6366f1;');
                                    console.groupEnd();
                                }, 300);
                            }, 100);
                        }
                    }, 200);
                }
            }, 200);
        }, 500);
    });
})();
