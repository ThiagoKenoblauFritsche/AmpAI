---
tags: [engenharia, normas, iec60909, cobertura, governanca]
versao: 1.2.1
status: ratificado
autor: "@Engenheiro_Eletricista (AmpAI Governança v7.0)"
data: 2026-07-06
data_ratificacao: 2026-07-07
autoridade_ratificacao: "@Arquiteto_Chefe_e_Governanca"
baseline_ratificacao: 641d8ab9705630da5180eae7764b272f6a2e3867
revisao: "v1.1 devolvida; v1.2 base 48 + embutimento de M00; v1.2.1 (2ª auditoria) — denominador só IDs Mxx e contraste M01 [0,90;1,10] vs M16 (0;1,10]"
---

# Matriz de Cobertura Normativa — Família IEC 60909 · v1.2.1

> **Fonte primária:** IEC 60909-0:2016 — *Short-circuit currents in three-phase a.c. systems — Part 0: Calculation of currents*
> **Classificação da fonte:** RNC-P (`docs/normas/IEC_60909_Short_Circuit/IEC 60909-0-2016.md`)
> **Fontes secundárias consultadas:** IEC 60909-3:2009 (norma primária, não TR), IEC TR 60909-1, IEC TR 60909-2, Cahier Technique Schneider n° 158 (referência secundária)
>
> ⚠️ **Aviso de Governança:** Esta matriz descreve o domínio computacional da norma e o estado de implementação no AmpAI. Ela própria é um documento de rastreabilidade, **não um RNC-C**. Candidatos RNC-C para cada motor devem ser produzidos, auditados e ratificados separadamente antes de qualquer nova implementação.
>
> **Selo documental:** ratificada para circulação operacional em 2026-07-07 por `@Arquiteto_Chefe_e_Governanca`, sobre a baseline `641d8ab9705630da5180eae7764b272f6a2e3867`. O RNC-C canônico da fundação é `docs/engenharia/RNC-C_Fundacao_M00_M04_M15.md`.

---

## 1. Legenda de Estados

| Estado | Significado |
|--------|-------------|
| `não estudado` | Cláusula identificada na norma; nenhuma análise ou BDD iniciado |
| `especificado` | BDD escrito em `docs/features/`; fonte RNC-P (não promovida a RNC-C); sem implementação verificada |
| `implementado_sem_validacao` | Método existe em `js/`; sem teste específico aprovado pelo QA; não pode ser declarado GREEN |
| `RED` | Testes específicos escritos e esperando falhar; implementação ausente ou incorreta para esse escopo |
| `GREEN` | Implementação passa os testes específicos; validado pelo QA |
| `stable` | GREEN confirmado em CI; suíte de regressão aprovada; registrado no manifesto |

> **Nota sobre `core_curto_circuito.test.js`:** O arquivo contém textos históricos como "FASE RED" nos comentários, que eram precisos quando escrito. A execução atual é `39 verdes / 0 vermelhos / exit 0`. A classificação `stable` no manifesto está factualmente correta. A nomenclatura obsoleta nos comentários é dívida técnica de documentação interna do QA — não altera o estado funcional.

---

## 2. Baseline Executável Verificada (2026-07-06)

| Arquivo | Status | Evidência |
|---------|--------|-----------|
| `js/core_curto_circuito.js` | **Existe** (264 linhas, ~13 KB) | Lido e auditado |
| `tests/core_curto_circuito.test.js` | 39 testes, exit 0 | Manifesto `stable`; 39 verdes |
| `qa/test-manifest.json` | Correto | Exige 39; protocolo `legacy-zombies` |
| Métodos testados pelos 39 | `calcularImpedanciaRede`, `calcularImpedanciaTransformador`, `calcularImpedanciaGerador`, `calcularImpedanciaCabo`, `agregarImpedanciaCurto` | Auditoria de código |
| Método sem teste específico | `calcularCorrenteInicialSimetrica(Un, Zk, c)` | Existe em `js/`; não referenciado nos 39 testes |

---

## 3. Matriz de Cobertura — IEC 60909-0:2016

### 3.1 Fundação: Método de Cálculo (Cláusula 5)

| Norma/Edição | Cláusula | Capacidade | Aplicabilidade | Entradas | Saídas | Dependências | Estado | Gabarito | Limitações |
|---|---|---|---|---|---|---|---|---|---|
| IEC 60909-0:2016 | 5.1–5.2 | Premissas gerais: CA trifásico, regime quase-estacionário, cargas pré-falta ignoradas | Toda aplicação do método | — | Conjunto de hipóteses declaradas | — | `especificado` (implícito no BDD e no cabeçalho do motor) | Seção 5 da norma | Não modela transitórios eletromagnéticos completos; não aplica a sistemas CC |
| IEC 60909-0:2016 | 5.3.1 | **[M00]** Fator de tensão $c$ (Tabela 1: $c_{\max}$, $c_{\min}$ por nível de tensão); restrição dielétrica $c_{\max} \cdot U_n \le U_m$ | Todos os cálculos de $I_k''$; seleção entre corrente máxima e mínima | $U_n$ (V), regime (`maxima`/`minima`), $U_m$ (V) | $c$ ∈ {0,90; 0,95; 1,00; 1,05; 1,10} | — | `especificado` parcial — validação de $c$ existe no motor (intervalo [0,90; 1,10]); **seletor automático da Tabela 1 por nível de tensão não implementado** | Tabela 1 da norma; BDD `IEC_60909_Impedancias_BDD.md` | Validação de intervalo presente; seleção $c$ por $U_n$/regime requer motor separado |
| IEC 60909-0:2016 | 5.3.2 | Componentes simétricas (sequência positiva, negativa, zero) | Faltas assimétricas (7.3, 7.4, 7.5) | $\underline{Z}_{(1)}, \underline{Z}_{(2)}, \underline{Z}_{(0)}$ (Ω) | Decomposição fasorial $I_{(1)}, I_{(2)}, I_{(0)}$ (A) | M01–M11 (impedâncias de sequência de cada componente) | `não estudado` | Exemplo do Anexo B da norma | Exige mapeamento de $\underline{Z}_{(0)}$ para todos os equipamentos; aterramento do neutro determina o resultado |

### 3.2 Impedâncias de Equipamentos (Cláusula 6)

| Norma/Edição | Cláusula | Capacidade | Aplicabilidade | Entradas | Saídas | Dependências | Estado | Gabarito | Limitações |
|---|---|---|---|---|---|---|---|---|---|
| IEC 60909-0:2016 | 6.1 | Regra geral: $\underline{Z}_{(2)} = \underline{Z}_{(1)}$ para equipamentos estáticos | Transformadores, cabos, reatores | — | Premissa de simetria de sequência | — | `especificado` (premissa declarada no BDD) | Seção 6.1 | Não se aplica a geradores e motores |
| IEC 60909-0:2016 | 6.2 | **[M01]** Impedância da rede de alimentação $\underline{Z}_Q$; referência por $t_r^2$; aproximação $R_Q = 0{,}1 X_Q$ quando $R_Q$ desconhecida | Barramento com corrente de curto fornecida pela concessionária | $U_{nQ}$ (V, >0), $I_{kQ}''$ (A, >0), $c$ ∈ [0,90; 1,10], $t_r$ ≥ 1 | $Z_Q$, $Z_{Qt}$, $R_{Qt}$, $X_{Qt}$ (Ω) | M00 ($c$) | `stable` (coberto pelos 39 testes) | CT-158 Schneider Problema 1; BDD `IEC_60909_Impedancias_BDD.md` | $\underline{Z}_{Q(0)}$ não implementada (impedância de sequência zero da rede) |
| IEC 60909-0:2016 | 6.3.1 | **[M02a]** Transformador de dois enrolamentos: $Z_T$, $R_T$, $X_T$ (Fórmulas 7–9) | Transformadores de rede e distribuição | $S_{rT}$ (VA, >0), $U_{rT}$ (V, >0), $u_{kr}$ (%, (0; 20]), $P_{krT}$ (W, >0); $u_{Rr}$ ≤ $u_{kr}$ | $Z_T$, $R_T$, $X_T$ (Ω) | — | `stable` (coberto pelos 39 testes) | CT-158 Schneider Problema 1; BDD `IEC_60909_Impedancias_BDD.md` | Não modela tap variável; $Z_{(0)}$ do trafo não implementada |
| IEC 60909-0:2016 | 6.3.3 | **[M02b]** Fator de correção $K_T$ para transformadores de rede (Fórmula 12a); bloqueio para trafo de grupo gerador | Somente trafos de **rede** no cálculo de corrente **máxima** | $x_T$, $c_{\max}$ | $K_T$ (adimensional), $\underline{Z}_{TK}$ = {re, im} (Ω) | M02a, M00 | `stable` (coberto pelos 39 testes) | CT-158 Schneider; BDD `IEC_60909_Impedancias_BDD.md` | $K_T$ bloqueado para trafo de grupo gerador (usa $K_S$/$K_{SO}$, cláusula 6.7) |
| IEC 60909-0:2016 | 6.3.2 | **[M05]** Transformador de três enrolamentos | Subestações com três níveis de tensão | Dados de placa dos três enrolamentos | $Z_{T1}$, $Z_{T2}$, $Z_{T3}$ (Ω) referidos ao mesmo lado | M02a | `não estudado` | Figura 6 da norma | Exige referência cruzada entre enrolamentos; complexidade de $Z_{(0)}$ triplicada |
| IEC 60909-0:2016 | 6.4 | **[M04]** Linha aérea e cabo: $R_L$, $X_L$; correção térmica de $R_L$ pela temperatura (Fórmula 32) | Todo condutor de seção e comprimento conhecidos | $q_n$ (mm², >0), $l$ (m, >0), $\rho$ (Ω·mm²/m, >0), $x'$ (Ω/km), $\theta_e$ (°C), $\alpha$ (K⁻¹), $\theta_{máx}$ (°C), $f$ ∈ {50; 60} Hz | $R_L$, $X_L$, $\lvert\underline{Z}_L\rvert$ (Ω) | M00 (regime máx/mín) | `stable` (coberto pelos 39 testes) | CT-158 Schneider; BDD `IEC_60909_Impedancias_BDD.md` | $\underline{Z}_{L(0)}$ não implementada; cabos com blindagem metálica não cobertos |
| IEC 60909-0:2016 | 6.5 | **[M06]** Reator limitador de corrente de curto | Quando o sistema usa reator em série para limitar $I_k''$ | $X_{RL}$ (Ω), $R_{RL}$ (Ω) | $\underline{Z}_{RL}$ (Ω) | M00 | `não estudado` | Seção 6.5 da norma | Pouco frequente em MT industrial; sem dados de catálogo padronizados |
| IEC 60909-0:2016 | 6.6.1 | **[M03]** Gerador síncrono: $\underline{Z}_{GK}$, fator $K_G$ (Fórmulas 17–18); resistência fictícia $R_{Gf}$ para crista | Geradores ligados diretamente ao barramento | $U_{rG}$ (V, >0), $S_{rG}$ (VA, >0), $x_d''$ ∈ (0; 1] p.u., $\cos\varphi_{rG}$ ∈ [0; 1], $R_G$ ≥ 0 Ω, $U_n$, $c_{\max}$, regime | $Z_{rG}$, $X_d''$, $K_G$, $\underline{Z}_{GK}$ = {re, im} (Ω) | M00 | `stable` (coberto pelos 39 testes) | CT-158 Schneider Problema 2; BDD `IEC_60909_Impedancias_BDD.md` | $R_{Gf}$ (resistência fictícia para crista) não integrada ao motor M22; $\underline{Z}_{G(2)}$ não implementada |
| IEC 60909-0:2016 | 6.6.2 | **[M08c]** Compensadores e motores síncronos | Motores síncronos de alta potência em regime de motor | Análogo a M03 | $\underline{Z}_{GK}$ análoga | M03 | `não estudado` | Seção 6.6.2 | Raramente diferenciado de geradores na prática |
| IEC 60909-0:2016 | 6.7.1 | **[M07]** Grupo gerador com OLTC: fator $K_S$ | Usinas com transformador com comutador sob carga (on-load tap-changer) | $U_{rG}$, $S_{rG}$, $x_d''$, $\cos\varphi_r$, $u_{krT}$, $u_{RrT}$, $U_{nQ}$, tap atual $t_r$ | $K_S$, $\underline{Z}_{SK}$ (Ω) | M03, M02a | `não estudado` | Seção 6.7.1; Figura 11 da norma | Exige tap atual como entrada; não usar $K_T$ em paralelo |
| IEC 60909-0:2016 | 6.7.2 | **[M08]** Grupo gerador sem OLTC: fator $K_{SO}$ | Usinas com transformador fixo (unidades de bloco) | Análogo a M07 sem tap variável | $K_{SO}$, $\underline{Z}_{SOK}$ (Ω) | M03, M02a | `não estudado` | Seção 6.7.2; Figura 11 da norma | Mais simples que M07; frequente em geração centralizada |
| IEC 60909-0:2016 | 6.8.2 | **[M10a]** Unidade eólica com gerador assíncrono (SCIG) | Parques eólicos de primeira geração | $I_{rM}$, $U_{rM}$, pares de polos $p$ | $\underline{Z}_M$ (Ω) | M09 | `não estudado` | Seção 6.8.2 | Contribuição limitada e dependente da proteção; declina rápido |
| IEC 60909-0:2016 | 6.8.3 | **[M10b]** Unidade eólica com DFIG (gerador assíncrono duplamente alimentado) | Parques eólicos modernos com controle do conversor do rotor | $I_{rM}$, $U_{rM}$, $U_{rM(rotor)}$, fator conversor | $\underline{Z}_M$ equivalente (Ω) | M11 | `não estudado` | Seção 6.8.3 | Contribuição limitada pelo controle do conversor |
| IEC 60909-0:2016 | 6.9 | **[M11]** Unidade com conversor de potência plena (full-size converter) | Fontes conectadas por conversor de plena potência (eólica, fotovoltaica, etc.) | $I_{skSS}$ (A nominal), $U_{rM}$ (V) | Corrente limitada pelo conversor ≈ $I_{skSS}$ | M00 | `não estudado` | Seção 6.9 | Modelagem simplificada pela limitação do conversor; sem contribuição assimétrica |
| IEC 60909-0:2016 | 6.10 | **[M09]** Motor assíncrono: $\underline{Z}_M$; threshold de inclusão | Grupos de motores em barramentos industriais cuja contribuição não é desprezível | $P_{rM}$ (W), $U_{rM}$ (V), $I_{rM}$ (A), $\eta_r$, $\cos\varphi_r$, $I_{LR}/I_{rM}$, threshold de potência | $\underline{Z}_M$ (Ω), flag de inclusão | M00 | `não estudado` | Seção 6.10; Tabela 4 da norma | Threshold de inclusão ($\sum P_{rM} \ge 1\%$ de $S_{kQ}$) deve ser declarado como premissa |
| IEC 60909-0:2016 | 6.11 | **[M11b]** Acionamentos por conversor estático (VFD) | Inversores de frequência em série com motores | — | Geralmente desprezado ($\underline{Z}_M \to \infty$) | M00 | `não estudado` | Seção 6.11 | Contribuição normalmente nula segundo a norma |
| IEC 60909-0:2016 | 6.12 | **[M11c]** Capacitores e cargas não rotativas | Bancos de capacitores em derivação | — | Geralmente desprezado | M00 | `não estudado` | Seção 6.12 | Efeito desprezável na maioria dos casos práticos |

### 3.3 Corrente Simétrica Inicial $I_k''$ (Cláusula 7)

| Norma/Edição | Cláusula | Capacidade | Aplicabilidade | Entradas | Saídas | Dependências | Estado | Gabarito | Limitações |
|---|---|---|---|---|---|---|---|---|---|
| IEC 60909-0:2016 | 7.1.1 | Visão geral: topologia da falta, tabela de importância (Tabela 2), critério de seleção do tipo de falta | Orientação para todos os cálculos; seleção da falta dominante | Tipo de falta, diagrama topológico do sistema | Corrente dominante identificada; tipo de curto selecionado | Todos M01–M11 | `não estudado` | Figura 7 e Tabela 2 da norma | Requer conhecimento completo das impedâncias de sequência antes da seleção |
| IEC 60909-0:2016 | 7.1.2 | $I_{k,\max}''$ e $I_{k,\min}''$: critérios de escolha de $c$ e de temperatura | Dimensionamento de proteções (máx) e verificação de sensibilidade (mín) | $c_{\max}$/$c_{\min}$; temperatura de resistências para mínima | $I_{k,\max}''$ (A), $I_{k,\min}''$ (A) | M00, M01–M04, M15 | `não estudado` | Seção 7.1.2 | Corrente mínima exige correção de temperatura em todas as resistências do circuito |
| IEC 60909-0:2016 | 7.1.3 | Contribuição de motores assíncronos a $I_k''$ (threshold de inclusão) | Redes industriais com carga motora significativa | $\sum P_{rM}$ (W), $U_n$ (V), comparação com threshold | Correção aditiva de $I_k''$ por contribuição motora (A) | M09, M16 | `não estudado` | Seção 7.1.3 | Threshold de inclusão ($\ge 1\%$ de $S_{kQ}$) deve ser premissa declarada explicitamente |
| IEC 60909-0:2016 | 7.2.1 | **[M16]** $I_k''$ trifásico simétrico — alimentação simples e múltipla em redes radiais | Falta trifásica (caso de maior corrente em sistemas equilibrados sem geradores próximos) | $\lvert\underline{Z}_k\rvert$ (Ω), $c$, $U_n$ (V) | $I_k''$ (A) — corrente simétrica inicial trifásica | M00, M15 (e M01–M04 ou subconjunto aplicável ao perfil) | `implementado_sem_validacao` — método `calcularCorrenteInicialSimetrica(Un, Zk, c)` existe em `js/core_curto_circuito.js`; sem teste específico aprovado pelo QA | CT-158 Schneider; Exemplo Anexo B da norma | Interface atual usa args posicionais $(U_n, Z_k, c)$; não integrada ao pipeline de objeto da M15; nenhum teste de caminho triste específico |
| IEC 60909-0:2016 | 7.2.2 | **[M17a]** $I_k''$ trifásico dentro do grupo gerador **com** OLTC | Falta entre gerador e trafo de bloco com comutador | Análogo a M16 + dados de tap | $I_k''$ local (A) | M07, M15 | `não estudado` | Figura 11 da norma | Curto interno ao grupo gerador; raramente exigido em projetos MT/BT |
| IEC 60909-0:2016 | 7.2.3 | **[M17b]** $I_k''$ trifásico dentro do grupo gerador **sem** OLTC | Análogo a M17a para transformadores fixos | Análogo a M08 | $I_k''$ local (A) | M08, M15 | `não estudado` | Figura 11 da norma | Idem M17a |
| IEC 60909-0:2016 | 7.3 | **[M19]** $I_k''$ bifásico sem terra | Falta fase-fase sem envolvimento do condutor de terra | $\underline{Z}_{(1)}$, $\underline{Z}_{(2)}$ dos componentes | $I_k''$ bifásico (A) | 5.3.2, M12–M14 | `não estudado` | Seção 7.3 da norma | Exige $\underline{Z}_{(2)}$ de todos os equipamentos no caminho da falta |
| IEC 60909-0:2016 | 7.4 | **[M20]** $I_k''$ bifásico com terra | Falta fase-fase-terra | $\underline{Z}_{(1)}$, $\underline{Z}_{(2)}$, $\underline{Z}_{(0)}$ | $I_k''$ e correntes parciais (A) | 5.3.2, M12–M14, IEC 60909-3:2009 | `não estudado` | Seção 7.4 da norma | Fortemente dependente do método de aterramento do neutro |
| IEC 60909-0:2016 | 7.5 | **[M21]** $I_k''$ fase-terra | Falta monofásica a terra (pode superar trifásica dependendo do aterramento) | $\underline{Z}_{(1)}$, $\underline{Z}_{(0)}$ | $I_k''$ fase-terra (A) | 5.3.2, M12–M14 | `não estudado` | Seção 7.5 da norma | Resultado muito sensível ao método de aterramento; pode ser o caso determinante |

### 3.4 Corrente de Crista $i_p$ (Cláusula 8)

| Norma/Edição | Cláusula | Capacidade | Aplicabilidade | Entradas | Saídas | Dependências | Estado | Gabarito | Limitações |
|---|---|---|---|---|---|---|---|---|---|
| IEC 60909-0:2016 | 8.1.1 | **[M22]** Fator $\kappa$ e corrente de crista $i_p$ — alimentação simples (Fórmulas 52–54; Figura 12) | Dimensionamento eletrodinâmico de barramentos, disjuntores e condutores | $R_k/X_k$ (ou $X_k/R_k$), $I_k''$ (A) | $\kappa$ (adimensional), $i_p = \kappa\sqrt{2} \cdot I_k''$ (A pico) | M16, M03 ($R_{Gf}$ para gerador) | `não estudado` | Figura 12 da norma (tabela ou equação necessária) | $R_{Gf}$ (6.6.1, resistência fictícia do gerador) necessária para calcular $\kappa$ correto de geradores |
| IEC 60909-0:2016 | 8.1.2 | **[M23]** $i_p$ — alimentação múltipla (Fórmulas 55–58) | Barramentos com múltiplas fontes em paralelo | $\kappa_i$, $I_{k,i}''$ por fonte; topologia da rede | $i_p$ combinado (A pico) | M22, M17 | `não estudado` | Seção 8.1.2 | Critério de seleção entre Fórmulas 55, 56 e 58 deve ser declarado explicitamente como premissa |
| IEC 60909-0:2016 | 8.2–8.4 | **[M24]** $i_p$ para faltas assimétricas (bifásico, bifásico-terra, fase-terra) | Dimensionamento eletrodinâmico com faltas assimétricas | $\kappa$ calculado com $\underline{Z}_{(1)}$ do lado da falta; $I_k''$ assimétrico | $i_p$ (A pico) | M19–M21, M22 | `não estudado` | Seções 8.2–8.4 | Depende das correntes assimétricas das cláusulas 7.3–7.5 |

### 3.5 Corrente de Interrupção $I_b$ (Cláusula 9)

| Norma/Edição | Cláusula | Capacidade | Aplicabilidade | Entradas | Saídas | Dependências | Estado | Gabarito | Limitações |
|---|---|---|---|---|---|---|---|---|---|
| IEC 60909-0:2016 | 9.1.1 | **[M25]** $I_b$ — máquinas síncronas; fator $\mu$ (Figura 13) | Especificação da capacidade de ruptura de disjuntores (interrupção assíncrona) | $I_k''$ do gerador (A), $t_{min}$ (s), ratio $I_{kG}''/I_{rG}$ | $\mu$ (adimensional), $I_b$ (A) | M16, M22 | `não estudado` | Figura 13 da norma | $\mu$ é função gráfica → necessita tabela de interpolação ou equação analítica |
| IEC 60909-0:2016 | 9.1.2 | **[M26]** $I_b$ — motores assíncronos; fator $q$ (Figura 14) | Redes industriais com contribuição motora relevante | $I_k''$ motor (A), $t_{min}$ (s), $P_{rM}$ (W) | $q$ (adimensional), $I_b$ (A) | M09, M22 | `não estudado` | Figura 14 da norma | $q$ é função gráfica; necessita interpolação |
| IEC 60909-0:2016 | 9.1.3–9.1.4 | **[M26b]** $I_b$ — DFIG e conversores full-size | Parques eólicos, fotovoltaicos via conversor | Análogo a M25 com limitação do conversor | $I_b$ (A) | M10b, M11 | `não estudado` | Seções 9.1.3–9.1.4 | Simplificado pela limitação do conversor |
| IEC 60909-0:2016 | 9.1.5 | **[M27b]** $I_b$ — rede de alimentação | Contribuição da concessionária à ruptura (sem decaimento) | $I_k''$ rede (A), $t_{min}$ (s) | $I_b \approx I_k''$ (A) | M01, M16 | `não estudado` | Seção 9.1.5 | Rede não decai; $I_b = I_k''$ — implementação trivial, mas requer evidência |
| IEC 60909-0:2016 | 9.1.6–9.1.7 | **[M27c]** $I_b$ — combinação múltiplas alimentações | Combinação de contribuições individuais | $\sum I_{b,i}$ por fonte | $I_b$ total (A) | M25–M27b | `não estudado` | Seções 9.1.6–9.1.7 | Requer todas as contribuições individuais aprovadas |
| IEC 60909-0:2016 | 9.2 | **[M27d]** $I_b$ — faltas assimétricas | Ruptura com falta bifásica ou fase-terra | $I_k''$ assimétrico (A) | $I_b$ (A) | M19–M21, M25 | `não estudado` | Seção 9.2 | Depende de toda a cadeia das sequências simétricas |

### 3.6 Componente CC e Corrente em Regime (Cláusulas 10–11)

| Norma/Edição | Cláusula | Capacidade | Aplicabilidade | Entradas | Saídas | Dependências | Estado | Gabarito | Limitações |
|---|---|---|---|---|---|---|---|---|---|
| IEC 60909-0:2016 | 10 | **[M27]** Componente CC $i_{DC}(t)$ (Fórmula 64) | Proteção diferencial, relés de distância; verificação de solicitação CC em disjuntores | $I_k''$ (A), $R_k/X_k$, $t$ (s), $f$ (Hz) | $i_{DC}(t)$ (A) | M15, M16 | `não estudado` | Seção 10 da norma | Aproximação de primeiro grau; assume $R/X$ constante ao longo do transitório |
| IEC 60909-0:2016 | 11.2.1 | **[M28]** $I_k$ em regime — gerador síncrono; fatores $\lambda_{\max}$, $\lambda_{\min}$ (Figuras 15–16) | Coordenação de proteção de longa duração; verificação de limites térmicos | $I_{rG}$ (A), $x_d$, $x_{dsat}$, condição de excitação | $I_{k,\max}$ e $I_{k,\min}$ em regime (A) | M03, M16 | `não estudado` | Figuras 15 e 16 da norma | $\lambda$ são funções gráficas → necessitam tabela ou equação analítica |
| IEC 60909-0:2016 | 11.2.2 | **[M29]** $I_k$ regime — motor/gerador assíncrono | Proteção de máquinas rotativas; corrente de longa duração | Análogo; dados do motor assíncrono | $I_k$ regime (A) | M09 | `não estudado` | Seção 11.2.2 | Contribuição decai para zero em motores sem excitação própria |
| IEC 60909-0:2016 | 11.2.3–11.2.4 | **[M29b]** $I_k$ regime — DFIG e conversor full-size | Parques eólicos/fotovoltaicos | Análogo; limitação do conversor | $I_k$ regime (A) | M10b, M11 | `não estudado` | Seções 11.2.3–11.2.4 | |
| IEC 60909-0:2016 | 11.2.5–11.2.7 | **[M30]** $I_k$ regime — rede e combinações | Sistemas com múltiplas fontes em regime permanente | Superposição de contribuições | $I_k$ regime total (A) | M28–M29b | `não estudado` | Seções 11.2.5–11.2.7 | |
| IEC 60909-0:2016 | 11.3 | **[M30b]** $I_k$ regime — faltas assimétricas | Faltas bifásicas e fase-terra em regime | Componentes simétricas em regime | $I_k$ assimétrico (A) | 5.3.2, M28–M30 | `não estudado` | Seção 11.3 | |

### 3.7 Casos Especiais e Corrente Térmica (Cláusulas 12–14)

| Norma/Edição | Cláusula | Capacidade | Aplicabilidade | Entradas | Saídas | Dependências | Estado | Gabarito | Limitações |
|---|---|---|---|---|---|---|---|---|---|
| IEC 60909-0:2016 | 12 | **[M34]** Curto no lado BT com um condutor aberto no AT (trafo Dyn5, Tabela 3) | Faltas específicas em transformadores Dyn5 com proteção por fusível no AT | Topologia Dyn5, $\underline{Z}_k$, $c$; fatores $\alpha$, $\beta$ da Tabela 3 | Correntes nas três fases do lado BT (A) | M02a, 5.3.2 | `não estudado` | Figura 17 e Tabela 3 da norma | Muito específico; raramente exigido em projetos comuns |
| IEC 60909-0:2016 | 13 | **[M33]** Curto terminal de motores assíncronos (Tabela 4) | Verificação de curto nos terminais do próprio motor | $I_{rM}$, $U_{rM}$ (V), $I_{LR}/I_{rM}$ | $I_k''$ nos terminais do motor (A) | M09 | `não estudado` | Tabela 4 da norma | |
| IEC 60909-0:2016 | 14 | **[M32]** Corrente térmica equivalente $I_{th}$; integral de Joule; fatores $m$ e $n$ | Verificação de suportabilidade térmica de cabos e equipamentos; seleção de bitola para curto | $I_k''$ (A), $t_k$ (s), $f$ (Hz), $m(f, R_k/X_k, t_k)$, $n(f, t_k)$ | $I_{th}$ (A), $W_{th} = I_{th}^2 \cdot t_k$ (A²·s) | M16, M22, M31 | `não estudado` | Figuras 18–19 e Annex A da norma | Fatores $m$ e $n$ são funções de parâmetros contínuos; requerem implementação algébrica do Annex A |
| IEC 60909-0:2016 | Annex A (normativo) | **[M31]** Fórmulas algébricas de $m$ e $n$ | Substituição das leituras gráficas das Figuras 18–19 em implementações computacionais | $f$ (Hz), $R_k/X_k$, $t_k$ (s) | $m(f, R_k/X_k, t_k)$, $n(f, t_k)$ (adimensionais) | M15, M16 | `não estudado` | Annex A da norma (equações explícitas — normativo) | Annex A é mandatório para implementações computacionais |
| IEC 60909-0:2016 | Annex B (informativo) | **[M35]** Matrizes de admitância e impedância nodal | Redes malhadas — método matricial alternativo ao circuito equivalente | Topologia completa, $\underline{Y}$ nodal (S) | $\underline{Z}$ nodal (Ω), correntes nos nós (A) | M01–M14 | `não estudado` | Exemplo Figura B.2 e Tabela B.1 da norma | Informativo; não mandatório; necessário para redes com múltiplas malhas |

### 3.8 Impedâncias de Sequência Zero e Negativa (Pré-requisito das Faltas Assimétricas)

> Estas capacidades não têm cláusula dedicada na IEC 60909-0:2016 (são distribuídas pelas seções 6.x), mas constituem motores independentes necessários antes das cláusulas 7.3–7.5.

| Capacidade | Cláusulas de origem | Dependências | Estado |
|---|---|---|---|
| **[M12]** $\underline{Z}_{(0)}$ de transformadores (função da ligação: Dyn, YNyn, Yzn, etc.) | 6.3.1/6.3.2; dados de catálogo ou IEC TR 60909-2 | M02a, M05 | `não estudado` |
| **[M13]** $\underline{Z}_{(0)}$ de linhas e cabos (função da configuração de retorno) | 6.4; IEC TR 60909-2 | M04 | `não estudado` |
| **[M14]** $\underline{Z}_{(2)}$ de geradores e motores (sequência negativa $\ne$ positiva) | 6.6; IEC TR 60909-2 | M03, M09 | `não estudado` |

### 3.9 Partes Relacionadas da Família IEC 60909

| Norma | Designação correta | Conteúdo | Estado no AmpAI |
|---|---|---|---|
| IEC TR 60909-1 | IEC TR 60909-1 (Technical Report) | Fatores para cálculo de correntes de curto-circuito (informativo) | RNC-P não catalogado; `não estudado` |
| IEC TR 60909-2 | IEC TR 60909-2 (Technical Report) | Dados elétricos de equipamentos — impedâncias de catálogo e dados de placa | RNC-P não catalogado; `não estudado`; necessário para M12–M14 |
| IEC 60909-3 | **IEC 60909-3:2009** (International Standard, 3ª edição — **não é TR**) | Correntes durante duas faltas fase-terra simultâneas e separadas; correntes parciais via terra | RNC-P disponível (`docs/normas/IEC_60909_Short_Circuit/IEC60909-3.md`); `não estudado` |
| IEC TR 60909-4 | IEC TR 60909-4 (Technical Report) | Exemplos de cálculo (informativo) | Não catalogado; `não estudado` |

---

## 4. Grafo de Dependências dos Motores

> **Regra de dependência:** um motor pode ser iniciado quando seus predecessores diretos estiverem em `stable`. A agregação (M15) depende apenas do **subconjunto de motores aplicável ao perfil do caso**, não de todos os motores M01–M11.

```
NÍVEL 0 — Fundação normativa
│
├── [M00] Fator c — Tabela 1 (5.3.1)
│   NÃO há validação M00 uniforme. Contraste das faixas de c aceitas hoje:
│     M01 (calcularImpedanciaRede): c ∈ [0,90; 1,10] (banda fechada; testada só no topo, c=1,20 → A·B2);
│     M16 (calcularCorrenteInicialSimetrica): c ∈ (0; 1,10] — NÃO impõe c ≥ 0,90 (aceita c=0,85).
│     M02/M03 recebem cMax mas NÃO validam a banda; M04 não usa c;
│     M15 valida apenas o dielétrico c_max·Un ≤ Um (não a banda de c).
│   Seleção completa por Un/regime: especificado (não implementada separadamente)
│
NÍVEL 1 — Impedâncias de componentes individuais (sequência positiva)
│
├── [M01] Rede Zq (6.2) ────────────── dep: M00 ───────── stable ✓
├── [M02a] Trafo 2-enrol. Zt/Rt/Xt (6.3.1) ─ dep: M00 ── stable ✓
├── [M02b] Fator KT (6.3.3) ─────────── dep: M02a, M00 ── stable ✓
├── [M03] Gerador ZGK/KG (6.6.1) ────── dep: M00 ────────── stable ✓
├── [M04] Cabo ZL (6.4) + correção térmica (F32, cláusula 7.1.2) ─ dep: M00 ─ stable ✓
│
├── [M05] Trafo 3-enrol. (6.3.2) ────── dep: M02a ─────── não estudado
├── [M06] Reator limitador (6.5) ─────── dep: M00 ──────── não estudado
├── [M07] Grupo gerador OLTC / KS (6.7.1) ─ dep: M02a, M03 ─ não estudado
├── [M08] Grupo gerador fixo / KSO (6.7.2) ─ dep: M02a, M03 ─ não estudado
├── [M09] Motor assíncrono ZM (6.10) ── dep: M00 ────────── não estudado
├── [M10a] Eólica SCIG (6.8.2) ─────── dep: M09 ─────────── não estudado
├── [M10b] Eólica DFIG (6.8.3) ─────── dep: M11 ─────────── não estudado
├── [M11] Conversor full-size (6.9) ─── dep: M00 ────────── não estudado
│
NÍVEL 2 — Impedâncias de sequência zero e negativa
│
├── [M12] Z(0) transformadores ──── dep: M02a, M05 ─────── não estudado
├── [M13] Z(0) linhas/cabos ──────── dep: M04 ──────────── não estudado
├── [M14] Z(2) geradores/motores ─── dep: M03, M09 ──────── não estudado
│
NÍVEL 3 — Agregação e corrente inicial
│
├── [M15] Agregação Zk (subconjunto aplicável)
│   dep: subconjunto de M01–M11 conforme perfil ─────────── stable ✓
├── [M16] I''k trifásico (7.2.1)
│   dep: M00, M15 ────────────────────────────── implementado_sem_validacao ⚠
├── [M17a] I''k trifásico em grupo gerador OLTC (7.2.2) ─ dep: M07, M15 ─ não estudado
├── [M17b] I''k trifásico em grupo gerador fixo (7.2.3) ─ dep: M08, M15 ─ não estudado
├── [M18] Contribuição motora a I''k (7.1.3) ─ dep: M09, M16 ─ não estudado
│
NÍVEL 4 — Faltas assimétricas
│
├── [M19] I''k bifásico (7.3) ─── dep: M12–M15 ─────────── não estudado
├── [M20] I''k bifásico-terra (7.4) ─ dep: M12–M15 ──────── não estudado
├── [M21] I''k fase-terra (7.5) ─── dep: M12–M15 ──────────── não estudado
│
NÍVEL 5 — Corrente de crista
│
├── [M22] Fator κ e ip (8.1.1) ─────── dep: M16 ─────────── não estudado
├── [M23] ip múltipla alimentação (8.1.2) ─ dep: M22, M17a/b ─ não estudado
├── [M24] ip faltas assimétricas (8.2–8.4) ─ dep: M19–M21, M22 ─ não estudado
│
NÍVEL 6 — Corrente de interrupção e componente CC
│
├── [M25] Fator μ e Ib síncrono (9.1.1) ── dep: M16, M22 ── não estudado
├── [M26] Fator q e Ib assíncrono (9.1.2) ─ dep: M09, M22 ─ não estudado
├── [M27] Componente CC iDC (10) ──────── dep: M15, M16 ─── não estudado
│
NÍVEL 7 — Corrente em regime permanente
│
├── [M28] Ik regime gerador (11.2.1; λ min/max) ─ dep: M16, M03 ─ não estudado
├── [M29] Ik regime motor assíncrono (11.2.2) ─── dep: M16, M09 ─ não estudado
├── [M30] Ik regime rede e combinações (11.2.5–11.2.7) ─ dep: M01, M16 ─ não estudado
│
NÍVEL 8 — Corrente térmica e casos especiais
│
├── [M31] Fatores m e n — Annex A (normativo) ─ dep: M15, M16 ─ não estudado
├── [M32] Corrente térmica Ith (14) ──────────── dep: M16, M22, M31 ─ não estudado
├── [M33] Curto terminal motor assíncrono (13) ─ dep: M09, M16 ─ não estudado
├── [M34] Falta BT com AT aberto Dyn5 (12) ──── dep: M12, M02a ─ não estudado
│
NÍVEL 9 — Redes malhadas (avançado / informativo)
│
└── [M35] Matriz Y/Z nodal (Annex B) ─ dep: M01–M14 (subconjunto) ─ não estudado
```

---

## 5. Resumo Quantitativo Corrigido (base = 48 capacidades)

> **Base de contagem consolidada:** o denominador é composto **exclusivamente pelas 48 capacidades com identificador `Mxx`** (M00–M35, contando os sub-itens a/b/c: M02a, M02b, M08c, M10a, M10b, M11b, M11c, M17a, M17b, M26b, M27b–M27d, M29b, M30b). **Linhas contextuais SEM ID `Mxx` NÃO entram no denominador**: as premissas gerais (§3.1, cláusulas 5.1–5.2), a regra geral 6.1, e as partes da família IEC 60909-1/2/3/4 (§3.9) são referências de rastreabilidade, não capacidades contadas. O grafo da §4 exibe o subconjunto principal; a §3 é a enumeração completa dos 48 IDs.

| Estado | Motores | Qtd. | % (sobre 48) |
|--------|---------|------|--------------|
| `stable` | M01, M02a, M02b, M03, M04, M15 | 6 | 12,5% |
| `especificado` (parcial) | M00 — validação de banda de $c$ embutida só em M01; seletor Tabela 1 não implementado | 1 | 2,1% |
| `implementado_sem_validacao` | M16 — método existe; sem teste específico | 1 | 2,1% |
| `não estudado` | demais capacidades da §3 | 40 | 83,3% |
| `GREEN` / `RED` (estado explícito) | — | 0 | 0% |
| **Total** | | **48** | **100%** |

> **Verificação:** 6 + 1 + 1 + 40 = 48. ✓

---

## 6. Próximos Incrementos Recomendados (Corrigidos)

| Incremento | Motor | Ação necessária | Pré-condição |
|---|---|---|---|
| **INC-001** | M16: $I_k''$ trifásico (7.2.1) | **Não criar** `js/core_curto_circuito.js` (existe). 1) RNC-C da fundação M00–M04/M15 ratificado. 2) Engenheiro produz BDD específico para `calcularCorrenteInicialSimetrica`. 3) QA escreve teste RED específico para M16. 4) Backend valida ou corrige a interface existente. 5) Os 39 testes existentes permanecem como regressão `stable`. | **Satisfeita documentalmente** pelo RNC-C v1.2.1 ratificado |
| **INC-002** | M22: Fator κ e $i_p$ (8.1.1) | BDD → candidato RNC-C → RED → GREEN | M16 stable |
| **INC-003** | M09: Motor assíncrono $\underline{Z}_M$ (6.10) | BDD → candidato RNC-C → RED → GREEN | M00 seletor completo stable |
| **INC-004** | M18: Contribuição motora a $I_k''$ (7.1.3) | BDD → candidato RNC-C → RED → GREEN | M09, M16 stable |
| **INC-005** | M31+M32: Fatores m/n e $I_{th}$ (Annex A normativo + cláusula 14) | BDD → candidato RNC-C → RED → GREEN | M16, M22 stable |
| **INC-006** | M12–M14: Impedâncias de sequência zero e negativa | BDD → candidato RNC-C → RED → GREEN | M02a, M03, M04, M09 stable |
| **INC-007** | M19–M21: Faltas assimétricas (7.3–7.5) | BDD → candidato RNC-C → RED → GREEN | M12–M15 stable |

---

*Documento gerado pelo @Engenheiro_Eletricista (AmpAI Governança v7.0) · v1.2.1 · 2026-07-06. Fonte: RNC-P auditada contra baseline executável. **Este documento é de rastreabilidade — não é RNC-C.** Ratificado para circulação operacional pela Governança em 2026-07-07.*
