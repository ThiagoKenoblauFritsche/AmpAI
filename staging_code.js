/**
 * STAGING CODE FOR AMPAI - O.S. #003 REFATORAÇÃO DE UI/UX PARA MT
 * - Card Tela Metálica com Tailwind CSS
 * - Update do Chart Iz x Seção para MT (IEC 60502-2)
 * - Refatoração do renderCablingMTResults com try/catch e vinculação de norma
 */

// 1. HTML Card da Tela Metálica (injeção no DOM)
const cardHTML = `
<!-- KPI 5: Seção da Tela Metálica (MT only) -->
<div class="result-card info flex flex-col justify-between p-4 space-y-2 border-l-4 border-blue-500 rounded-lg shadow-sm bg-white" id="mt-card-screen" style="display: none;">
    <div class="result-title flex items-center justify-between text-slate-700">
        <span class="font-semibold">Seção da Tela (S<sub>tela</sub>)</span>
        <i data-lucide="shield" style="color: var(--info); width: 18px; height: 18px;"></i>
    </div>
    <div class="result-value text-3xl font-bold text-slate-900 mt-2" id="mt-val-screen">--
        <span class="result-unit text-sm font-normal text-slate-500">mm²</span>
    </div>
    <div class="result-desc text-xs text-slate-500 mt-2" id="mt-val-screen-desc">IEC 60949 (Adiabático)</div>
</div>
`;

// 2. JS: Refatoração da função de Chart para suportar MT
const chartOverrideJS = `
        function renderCablingChart(sFinalParam = 0) {
            const ctx = document.getElementById('cb-sensitivity-chart').getContext('2d');
            const isMT = typeof cbVoltageLevel !== 'undefined' && cbVoltageLevel === 'MT';
            
            let table;
            let methodLabel = '';
            
            if (isMT) {
                const conductor = document.getElementById('mt-conductor').value;
                const insulation = document.getElementById('mt-insulation').value;
                table = MT.IZ_BASE_MT[conductor][insulation];
                methodLabel = \`MT (\${conductor}, \${insulation})\`;
            } else {
                const method = document.getElementById('cb-method').value;
                const ins    = cbInsulation;
                table  = IZ_BASE[method]?.Cu?.[ins];
                methodLabel = \`BT (\${method}, Cu, \${ins})\`;
            }
            
            if (!table) return;

            const sections = Object.keys(table).map(Number).sort((a, b) => a - b);
            const izValues = sections.map(s => table[s]);

            const sFinal = sFinalParam > 0 ? sFinalParam : (parseInt(document.getElementById('cb-val-section').textContent) || 0);
            const Ib     = parseFloat(document.getElementById(isMT ? 'mt-ib' : 'cb-ib').value) || 0;

            if (cbCablingChart) cbCablingChart.destroy();

            cbCablingChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: sections.map(s => s + ' mm²'),
                    datasets: [
                        {
                            label: \`Ampacidade Iz \${methodLabel}\`,
                            data: izValues,
                            borderColor: '#0f172a',
                            borderWidth: 2,
                            pointBackgroundColor: sections.map(s => s === sFinal ? '#f59e0b' : '#0f172a'),
                            pointRadius: sections.map(s => s === sFinal ? 7 : 3),
                            tension: 0.3,
                            fill: false
                        },
                        {
                            label: \`Corrente de Projeto Ib = \${Ib}A\`,
                            data: sections.map(() => Ib),
                            borderColor: '#ef4444',
                            borderWidth: 1.5,
                            borderDash: [6, 4],
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Corrente (A)' } },
                        x: { title: { display: true, text: 'Seção Nominal (mm²)' } }
                    },
                    plugins: {
                        legend: { position: 'top', labels: { font: { family: 'Inter', size: 11 } } },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if(context.datasetIndex === 0 && sections[context.dataIndex] === sFinal) {
                                        return [context.dataset.label + ': ' + context.raw + ' A', '★ SEÇÃO ADOTADA'];
                                    }
                                    return context.dataset.label + ': ' + context.raw + ' A';
                                }
                            }
                        }
                    }
                }
            });
        }
`;

// 3. Atualização do renderCablingMTResults
const mtResultsOverride = `
        window.renderCablingMTResults = function(r) {
            const f = (v, d=2) => Number(v).toLocaleString('pt-BR', {minimumFractionDigits: d, maximumFractionDigits: d});
            const input = r.input;

            const setHTML = (id, content) => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = content;
            };

            const setText = (id, content) => {
                const el = document.getElementById(id);
                if (el) el.textContent = content;
            };

            // KPI 1 a 4 + KPI 5 (Tela)
            try {
                setHTML('cb-val-section', \`\${r.sFinal} <span class="result-unit">mm²</span>\`);
                setText('cb-val-criterion', \`Critério dominante: \${r.dominant}\`);

                setHTML('cb-val-iz', \`\${f(r.Iz_corr, 1)} <span class="result-unit">A</span>\`);
                setText('cb-val-iz-desc', \`I_b=\${input.Ib_A}A ≤ Iz=\${f(r.Iz_corr,1)}A \${r.Iz_corr >= input.Ib_A ? '✓' : '✗'}\`);

                const duCard = document.getElementById('cb-card-du');
                if (duCard) duCard.className = 'result-card ' + (r.du_pct > input.duMax_pct ? 'danger' : r.du_pct > input.duMax_pct * 0.85 ? 'primary' : 'info');
                setHTML('cb-val-du', \`\${f(r.du_pct, 2)} <span class="result-unit">%</span>\`);
                setText('cb-val-du-desc', \`Limite: \${input.duMax_pct}% | ΔU = \${f(r.du_V,2)}V\`);

                const tempRatio = r.thetaOp / r.thetaMax;
                const tempCard  = document.getElementById('cb-card-temp');
                if (tempCard) {
                    tempCard.className = 'result-card ' + (tempRatio > 0.95 ? 'danger' : tempRatio > 0.85 ? 'primary' : 'success');
                    tempCard.style.setProperty('--temp-color', tempRatio > 0.95 ? 'var(--danger)' : tempRatio > 0.85 ? 'var(--cable-orange)' : 'var(--success)');
                }
                setHTML('cb-val-temp', \`\${f(r.thetaOp, 1)} <span class="result-unit">°C</span>\`);
                setText('cb-val-temp-desc', \`Limite: \${r.thetaMax}°C (\${input.insulation})\`);
                
                setHTML('mt-val-screen', \`\${r.S_screen} <span class="result-unit text-sm font-normal text-slate-500">mm²</span>\`);
                setText('mt-val-screen-desc', \`Contínuo: \${f(r.S_screen_cont, 2)} mm² | IEC 60949\`);
            } catch(e) { console.error("Erro KPIs MT:", e); }

            try {
                const statusOk   = '<span style="color:var(--success);font-weight:700;">✓ OK</span>';
                const statusDom  = '<span style="color:var(--accent-hover);font-weight:700;">★ Dominante</span>';

                setText('cb-tbl-s1', r.S1 + ' mm²');
                setText('cb-tbl-s2', r.S2 + ' mm² (contínuo: ' + f(r.S2_cont,2) + ')');
                setText('cb-tbl-s3', r.S3 + ' mm² (contínuo: ' + f(r.S3_cont,2) + ')');
                setText('cb-tbl-sfinal', r.sFinal + ' mm²');
                setText('cb-tbl-sn', '--');
                setText('cb-tbl-spe', r.S_screen + ' mm² (Tela)');
                setText('cb-tbl-fct', f(r.f_temp, 3));
                setText('cb-tbl-fca', f(r.f_group, 3));
                setText('cb-tbl-rho', f(r.f_soil, 2) + ' (Solo)');
                setText('cb-tbl-condition', \`\${input.Ib_A}A ≤ \${f(r.Iz_corr,1)}A\`);

                setHTML('cb-tbl-s1-status', r.dominant === 'AMPACIDADE' ? statusDom : statusOk);
                setHTML('cb-tbl-s2-status', r.dominant === 'QUEDA DE TENSÃO' ? statusDom : statusOk);
                setHTML('cb-tbl-s3-status', r.dominant === 'CURTO-CIRCUITO' ? statusDom : statusOk);

                // Memorial IEC 60502-2
                setHTML('cb-mem-step1', 
                    \`<span class="math-line">Critério de Ampacidade (S₁) — IEC 60502-2</span>
                    <span class="math-line">Iz_base (\${input.conductor}, \${input.insulation}, \${input.voltageClass} kV) = \${r.Iz_base} A</span>
                    <span class="math-line">Fator Combinado (FCT × FCA × Profundidade × Solo) = \${f(r.f_combined,3)}</span>
                    <span class="math-line">Iz_corrigida = \${f(r.Iz_corr,1)} A</span>\`
                );
                
                setHTML('cb-mem-step2', 
                    \`<span class="math-line">Critério de Queda de Tensão (S₂) — IEC 60502-2</span>
                    <span class="math-line">ΔU_max = \${input.duMax_pct}% = \${f(input.duMax_pct / 100 * input.ULL_V, 2)} V</span>
                    <span class="math-line">S₂ = (√3 · ρ · L · Ib · cosφ) / ΔU</span>
                    <span class="math-line">S₂ = \${f(r.S2_cont,2)} mm²</span>\`
                );
                
                setHTML('cb-mem-step3', 
                    \`<span class="math-line">Critério de Curto-Circuito Adiabático (S₃) — IEC 60949</span>
                    <span class="math-line">K_condutor (\${input.conductor}) = \${r.k_cond} | K_tela (Cobre/\${input.sheath}) = \${r.k_screen}</span>
                    <span class="math-line">S_cond = (\${input.Icc_A}A · √\${input.tConductor_s}s) / \${r.k_cond} = <span class="math-result">\${f(r.S3_cont,2)} mm²</span></span>
                    <span class="math-line">S_tela = (\${input.iFault_A}A · √\${input.tScreen_s}s) / \${r.k_screen} = <span class="math-result">\${f(r.S_screen_cont,2)} mm²</span></span>\`
                );
                
                setHTML('cb-mem-step4', \`<span class="math-line">Conclusão: Critério dominante = \${r.dominant}</span>\`);
                setHTML('cb-mem-step5', \`<span class="math-line">Adotado: \${r.sFinal} mm²</span>\`);

            } catch(e) { console.warn("Tabelas não renderizadas:", e); }

            // [F6 QA] Atualiza gráfico se aba estiver ativa
            if (typeof cbActiveTab !== 'undefined' && cbActiveTab === 'cb-tab-chart') {
                if (typeof renderCablingChart === 'function') renderCablingChart(r.sFinal);
            }
        };
`;
