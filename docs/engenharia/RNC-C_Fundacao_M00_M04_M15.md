---
tags: [engenharia, rnc-c, canonico, iec60909, fundacao]
versao: 1.2.1
status: ratificado
autor: "@Engenheiro_Eletricista (AmpAI Governança v7.0)"
data: 2026-07-06
data_ratificacao: 2026-07-07
autoridade_ratificacao: "@Arquiteto_Chefe_e_Governanca"
baseline_ratificacao: 641d8ab9705630da5180eae7764b272f6a2e3867
rnc_classe: RNC-C (canônico — ratificado)
motores: [M00, M01, M02a, M02b, M03, M04, M15]
revisao: "v1.1 devolvida (11 bloqueios); v1.2 encerrou os 11; v1.2.1 aplica os 5 ajustes residuais da 2ª auditoria (F14 sem l, denominador só IDs Mxx, M01 [0,90;1,10] vs M16 (0;1,10], natureza dos bloqueios M15/θe, testes M16 c<0,90 e c=0,93, KT mín 6.3.3+7.1.2)"
---

# RNC-C Canônico — Fundação IEC 60909: M00–M04 e M15 · v1.2.1

> **Status:** RATIFICADO como RNC-C canônico pela Governança em 2026-07-07, sobre a baseline `641d8ab9705630da5180eae7764b272f6a2e3867`.
>
> Cumpre os 9 critérios mínimos da Taxonomia RNC (`docs/AmpAI_RNC_Taxonomia.md`) para a fundação dos motores M00–M04 e M15. Constitui a regularização retrospectiva da base científica da suíte `stable` existente (39 testes em `tests/core_curto_circuito.test.js`).
>
> **v1.2 — resposta à 1ª auditoria.** Esta versão distingue rigorosamente **o que os 39 testes exercem** do **que é proposto sem teste**, classifica a natureza de cada limite, e alinha cada regra ao comportamento real de `js/core_curto_circuito.js` verificado linha a linha.
>
> **Determinações vinculantes da ratificação:** $U_n$ é a tensão nominal do sistema; no perfil IEC atual, $c \in \{0{,}90; 0{,}95; 1{,}00; 1{,}05; 1{,}10\}$; qualquer valor fora desse conjunto deve ser bloqueado. M16 permanece `implementado_sem_validacao` até concluir RED→GREEN independente.

---

## 0. Convenções de Classificação (leitura obrigatória)

Toda regra deste documento carrega **duas etiquetas**:

### 0.1 Natureza do limite

| Etiqueta | Significado |
|----------|-------------|
| **FÍS** | Impossibilidade física fundamental (divisão por zero, sinal negativo, radicando negativo). Não é número arbitrário. |
| **NORM** | Requisito normativo com cláusula IEC citável. |
| **ENV** | Envelope de produto AmpAI — limite numérico escolhido pela engenharia, com justificativa; **não** é da norma. |
| **ENV numérico** | Caso particular de ENV: guarda numérica de estabilidade computacional (ex.: limiar $10^{-9}\ \Omega$ para detectar $Z_k\to0$). A *condição física* pode ser FÍS, mas o *valor do limiar* é escolha de engenharia. |
| **CONTR** | Validação de contrato/interface (ex.: tipo/forma do argumento, array não-vazio). Não é impossibilidade física nem limite normativo. |
| **HEUR** | Heurística configurável (aviso/warning), ajustável por parametrização. |

### 0.2 Status de implementação/teste

| Etiqueta | Significado |
|----------|-------------|
| **TESTADO** | Exercido por um dos 39 testes `stable` (ID do teste indicado). Faz parte do contrato blindado. |
| **COD** | Codificado em `js/core_curto_circuito.js`, porém **sem teste específico** — não é regressão-protegido. |
| **PROP** | **Proposto**: nem codificado, nem testado. Requer O.S. + teste RED antes de virar contrato. |

> **Regra de governança desta v1.2:** nenhuma linha `PROP` pode ser tratada como capacidade existente. Os seis motores `stable` são definidos **exclusivamente** pelas linhas `TESTADO`.

---

## Critério 1 — Fontes Normativas Primárias e Referências Secundárias

| Tipo | Referência | Papel |
|------|------------|-------|
| **Norma primária** | IEC 60909-0:2016 (Ed. 2.0, 2016-01). ICS 17.220.01; 29.240.20. ISBN 978-2-8322-3158-6 | Fonte autoritativa de todas as fórmulas, tabelas e limites normativos |
| **Norma auxiliar** | IEC 60038:2009 — *IEC Standard Voltages* | Base das tensões nominais da Tabela 1 |
| **Referência secundária** | Cahier Technique Schneider n° 158 (rev. 2005-09) | Gabaritos numéricos (§3.5, Problemas 1 e 2). **Não** substitui a norma primária |
| **RNC-P consultado** | `docs/normas/IEC_60909_Short_Circuit/IEC 60909-0-2016.md` | Fonte operacional; classe RNC-P |
| **BDD associado** | `docs/features/IEC_60909_Impedancias_BDD.md` | Especificação de comportamento fundamentada por este RNC-C |

> **Correção de premissa (1ª auditoria):** o gabarito Schneider §3.5 Problema 1 usa $U_n = 400\ \text{V}$ (**tensão nominal do sistema**), **não** $U_{rTLV} = 410\ \text{V}$ (tensão de placa do enrolamento). Isso governa o caso TC-M16-01 (Critério 9).

---

## Critério 2 — Edição, Ano, Escopo e Limitações de Aplicação

**Edição:** IEC 60909-0:2016 (Ed. 2.0). Edição vigente adotada pelo AmpAI.

**Escopo coberto:** M00 (fator $c$, 5.3.1), M01 (rede $\underline{Z}_Q$, 6.2), M02a (trafo 2 enrol., 6.3.1), M02b (fator $K_T$, 6.3.3), M03 (gerador $\underline{Z}_{GK}$/$K_G$, 6.6.1), M04 (cabo $\underline{Z}_L$ + correção térmica, 6.4 e cláusula 7.1.2), M15 (agregação $\underline{Z}_k$).

**Limitações de aplicação:**
1. Apenas sistemas CA trifásicos em regime quase-estacionário; $f \in \{50; 60\}$ Hz.
2. **Não** aplica a CC, monofásico, ou transitório eletromagnético completo.
3. **Não** cobre $\underline{Z}_{(0)}$ nem $\underline{Z}_{(2)}$ (faltas assimétricas 7.3–7.5) — incrementos futuros.
4. **Não** cobre trafo 3 enrol. (6.3.2), grupos geradores (6.7), motores (6.10) nem renováveis.
5. **$K_T$ (M02b):** a Fórmula (12a) aplica-se **somente** a trafo de **rede**. Trafo de grupo gerador → bloqueio (usar $K_S/K_{SO}$, 6.7).
   - ⚠️ **Ressalva de implementação (1ª auditoria, ponto 6):** o método `calcularImpedanciaTransformador` **não recebe parâmetro `regime`** e **sempre** calcula $K_T$ pela Fórmula (12a). A regra normativa "$K_T = 1$ em corrente mínima" — fundamentada **conjuntamente em 6.3.3 e 7.1.2** (7.1.2 item 3: "The impedance correction factors are equal to 1" no cálculo de corrente mínima) — está **`PROP`**: não codificada nem testada em M02b. Contraste: M03 (gerador) **recebe** `regime` e implementa $K_G = 1$ em mínima (testado por C·O).
6. **$R_{Gf}$** (6.6.1, resistência fictícia): serve **apenas** ao pico $i_p$ (8.1.1) — não entra em $\underline{Z}_{GK}$. Não implementada nesta fundação (`PROP`, pertence a M22).

---

## Critério 3 — Equações em LaTeX Revisadas

### M00 — Fator de tensão $c$ (5.3.1, Tabela 1)

Escalar tabelado (sem fórmula). Restrição dielétrica:

$$c_{\max} \cdot U_n \le U_m \tag{T1-restr.}$$

**Tabela 1 (reprodução fiel):**

| $U_n$ | $c_{\max}$ | $c_{\min}$ |
|---|---|---|
| BT 100–1000 V (tol. ±6 %) | 1,05 | 0,95 |
| BT 100–1000 V (tol. ±10 %) | 1,10 | 0,90 |
| AT >1 kV–230 kV | 1,10 | 1,00 |
| AT >230 kV (até $U_m$=420 kV) | 1,10 | 1,00 |

### M01 — Rede de alimentação (6.2)

$$\underline{Z}_Q = \frac{c \cdot U_{nQ}}{\sqrt{3} \cdot I_{kQ}''} \tag{4} \qquad \underline{Z}_{Qt} = \underline{Z}_Q \cdot \frac{1}{t_r^2} \tag{6}$$
$$X_{Qt} = 0{,}995 \cdot Z_{Qt}, \qquad R_{Qt} = 0{,}1 \cdot X_{Qt} \tag{6-aprox}$$

### M02a — Transformador de dois enrolamentos (6.3.1)

$$Z_T = \frac{u_{kr}}{100\%} \cdot \frac{U_{rT}^2}{S_{rT}} \tag{7} \qquad R_T = \frac{P_{krT} \cdot U_{rT}^2}{S_{rT}^2} \tag{8} \qquad X_T = \sqrt{Z_T^2 - R_T^2} \tag{9}$$

> **Equivalência da Fórmula (8):** a norma escreve $R_T = \frac{u_{Rr}}{100\%}\frac{U_{rT}^2}{S_{rT}} = \frac{P_{krT}}{3 I_{rT}^2}$. Como $3 I_{rT}^2 = S_{rT}^2/U_{rT}^2$, resulta $R_T = P_{krT} U_{rT}^2 / S_{rT}^2$ (forma implementada).
> ⚠️ **Limite FÍS:** (9) exige $R_T \le Z_T$ ($u_{Rr} \le u_{kr}$). Senão radicando negativo → $X_T$ imaginário → bloqueio.

### M02b — Fator de correção $K_T$ (6.3.3, Fórmula 12a)

$$x_T = \frac{X_T}{U_{rT}^2 / S_{rT}} \qquad K_T = 0{,}95 \cdot \frac{c_{\max}}{1 + 0{,}6 \cdot x_T} \tag{12a} \qquad \underline{Z}_{TK} = K_T \cdot (R_T + \mathrm{j}\,X_T)$$

### M03 — Gerador síncrono (6.6.1)

$$Z_{rG} = \frac{U_{rG}^2}{S_{rG}} \qquad X_d'' = x_d'' \cdot Z_{rG} \qquad K_G = \frac{U_n}{U_{rG}} \cdot \frac{c_{\max}}{1 + x_d'' \cdot \sqrt{1 - \cos^2\!\varphi_{rG}}} \tag{18}$$
$$\underline{Z}_{GK} = K_G \cdot (R_G + \mathrm{j}\,X_d'') \tag{17}$$

> **Corrente mínima:** $K_G = 1$ (6.6.1) — implementado e **TESTADO** (C·O).

### M04 — Linha aérea e cabo (6.4 e cláusula 7.1.2)

A Fórmula (14) da norma define **apenas a resistência por unidade de comprimento**:

$$R_L' = \frac{\rho}{q_n} \tag{14}$$

A resistência total é uma **derivação** (multiplicação pelo comprimento) — sem `tag{14}` própria, pois não consta assim na norma:

$$R_{L20} = R_L' \cdot l \quad(\text{derivação}) \qquad X_L = x' \cdot l \cdot 10^{-3} \qquad |\underline{Z}_L| = \sqrt{R_L^2 + X_L^2}$$

Correção térmica para corrente mínima — **Fórmula (32), que pertence à cláusula 7.1.2** (não ao Anexo A; o Anexo A trata somente dos fatores $m$ e $n$):

$$R_L = R_{L20} \cdot [1 + \alpha \cdot (\theta_e - 20\,°\text{C})], \quad \alpha = 0{,}004\ \text{K}^{-1} \tag{32}$$

Resistividades a 20 °C: Cu $\rho = 1/54$; Al $1/34$; liga Al $1/31\ \Omega\cdot\text{mm}^2/\text{m}$.

### M15 — Agregação $\underline{Z}_k$ (decorre de 5.3.1 + topologia série)

$$R_k = \sum_i R_i, \quad X_k = \sum_i X_i \qquad |\underline{Z}_k| = \sqrt{R_k^2 + X_k^2}$$

> **Pré-condição:** toda $\underline{Z}_i$ referida ao mesmo nível de tensão (via $t_r^2$) antes da soma.

---

## Critério 4 — Unidades SI e Checagem Dimensional

| Grandeza | Símbolo | Unidade SI |
|---|---|---|
| Tensão | $U_n, U_{rT}, U_{rG}$ | V |
| Corrente | $I_{kQ}''$ | A |
| Potência aparente | $S_{rT}, S_{rG}$ | VA |
| Perdas no cobre | $P_{krT}$ | W |
| Impedância | $Z, R, X$ | Ω |
| Resistividade | $\rho$ | Ω·mm²/m |
| Seção | $q_n$ | mm² |
| Comprimento | $l$ | m ($x'$ em Ω/km → fator $10^{-3}$) |
| Temperatura | $\theta$ | °C |
| $\alpha$ | — | K⁻¹ |
| $c, x_T, x_d'', K_T, K_G, t_r$ | — | adimensional |

**Verificação dimensional (equações-chave):**

| Equação | Verificação |
|---|---|
| $Z_Q = c U_{nQ}/(\sqrt3 I_{kQ}'')$ | V/A = Ω ✓ |
| $Z_T = (u_{kr}/100) U_{rT}^2/S_{rT}$ | V²/VA = Ω ✓ |
| $R_T = P_{krT} U_{rT}^2/S_{rT}^2$ | W·V²/(VA)² = W/A² = Ω ✓ |
| $Z_{rG} = U_{rG}^2/S_{rG}$ | V²/VA = Ω ✓ |
| $R_{L20} = (\rho/q_n) l$ | (Ω·mm²/m)/mm² · m = Ω ✓ |
| $X_L = x' l \cdot 10^{-3}$ | (Ω/km)·m·(km/1000 m) = Ω ✓ |

---

## Critério 5 — Premissas Adotadas e Proibidas

### Adotadas
1. CA trifásico simétrico; $f \in \{50; 60\}$ Hz.
2. Fonte de tensão equivalente $c U_n/\sqrt3$ (5.3.1).
3. **Máxima:** $c_{\max}$; resistências a 20 °C.
4. **Mínima:** $c_{\min}$; $K_G = 1$ (M03, testado); resistências corrigidas por (32). *(Para M02b, $K_T=1$ em mínima é `PROP` — ver Critério 2.5.)*
5. $R_Q$ desconhecida: $X_Q = 0{,}995 Z_Q$, $R_Q = 0{,}1 X_Q$ (6.2).
6. Equipamentos estáticos: $\underline{Z}_{(2)} = \underline{Z}_{(1)}$ (6.1).
7. $\rho_{20}$: Cu 1/54; Al 1/34; liga 1/31.
8. $\alpha = 0{,}004\ \text{K}^{-1}$.

### Proibidas (bloqueio de governança)
| Premissa proibida | Consequência |
|---|---|
| Unidades ANSI/NEC (AWG, kcmil, ft, °F) | Viola Restrição 1 do cérebro do Engenheiro |
| $K_T$ em trafo de grupo gerador | Dupla correção → $I_k''$ incorreta (bloqueado, TESTADO B·Gov) |
| $c > 1{,}10$ (em M01/M16) | Fora da Tabela 1 (M01 bloqueia; M16 bloqueia >1,10) |
| $u_{Rr} > u_{kr}$ | $X_T$ imaginário (bloqueado, TESTADO B·E·crit) |
| Somar $\underline{Z}$ de níveis de tensão distintos | Resultado sem significado físico |
| $I_{kQ}'' \le 0$; $S_{rT}\le0$; $S_{rG}\le0$; $q_n\le0$ | Divisão por zero (todos bloqueados e TESTADOS) |

---

## Critério 6 — Limites Físicos de Entrada e Saída (com Natureza e Status)

> Colunas **Nat.** (FÍS/NORM/ENV/HEUR) e **Status** (TESTADO/COD/PROP) conforme §0. IDs de teste em `tests/core_curto_circuito.test.js`.

### M01 — Rede (6.2)
| Parâmetro | Regra | Nat. | Status |
|---|---|---|---|
| $U_{nQ} \le 0$ | bloquear | FÍS | TESTADO (A·Z) |
| $I_{kQ}'' = 0$ | bloquear (÷0 na Eq. 4) | FÍS | TESTADO (A·E1) |
| $I_{kQ}'' < 0$ | bloquear | FÍS | TESTADO (A·E2) |
| $t_r < 1$ | bloquear (tap fora da posição principal) | NORM (§4.2: $t_r \ge 1$) | TESTADO (A·B1) |
| $c \notin [0{,}90;\,1{,}10]$ | bloquear | NORM (Tabela 1) | TESTADO **só no topo** (A·B2, c=1,20); limite inferior 0,90 é **COD** (não testado) |
| $U_{nQ} \le 550\,000$ V (máx) | — | ENV | **PROP** (não codificado) |
| $I_{kQ}'' \le 200\,000$ A (máx) | — | ENV | **PROP** (não codificado) |

### M02a/M02b — Transformador (6.3.1/6.3.3)
| Parâmetro | Regra | Nat. | Status |
|---|---|---|---|
| $S_{rT} \le 0$ | bloquear (÷0 na Eq. 7) | FÍS | TESTADO (B·Z1) |
| $U_{rT} \le 0$ | bloquear | FÍS | TESTADO (B·Z2) |
| $u_{kr} \le 0$ | bloquear | FÍS | TESTADO (B·E1) |
| $u_{Rr} > u_{kr}$ | bloquear ($X_T$ imaginário, Eq. 9) | FÍS | TESTADO (B·E·crit) |
| $P_{krT} \le 0$ | bloquear | FÍS | TESTADO (B·E2) |
| $u_{kr} > 20\%$ | bloquear | **ENV** (não é limite normativo; ver §"Classificação dos limites") | TESTADO (B·B) |
| `tipoTrafo = grupo_gerador` | bloquear (usar $K_S/K_{SO}$) | NORM (6.7) | TESTADO (B·Gov) |
| $K_T = 1$ em regime mínimo | — | NORM (**6.3.3 + 7.1.2**) | **PROP** (M02b não recebe `regime`; sempre calcula $K_T$) |
| $U_{rT} \le 550\,000$ V (máx) | — | ENV | **PROP** |

### M03 — Gerador (6.6.1)
| Parâmetro | Regra | Nat. | Status |
|---|---|---|---|
| $U_{rG} \le 0$ | bloquear | FÍS | TESTADO (C·Z2) |
| $S_{rG} \le 0$ | bloquear (÷0 em $Z_{rG}$) | FÍS | TESTADO (C·Z1) |
| $x_d'' \le 0$ | bloquear | FÍS | TESTADO (C·E·xdd) |
| $\cos\varphi_{rG} \notin [0;1]$ | bloquear | NORM (fator físico, 6.6.1) | TESTADO (C·E·cos ×2) |
| $R_G < 0$ | bloquear | FÍS | TESTADO (C·E·Rg) |
| $x_d'' > 1$ p.u. | **bloquear** | **ENV** (não normativo) | **TESTADO (C·B)** — *(corrige v1.1, que dizia "avisar")* |
| $K_G = 1$ em regime mínimo | forçar | NORM (6.6.1) | TESTADO (C·O) |
| aviso $x_d'' > 0{,}4$ p.u. | avisar | HEUR | **PROP** (não codificado) |

### M04 — Cabo (6.4 / 7.1.2)
| Parâmetro | Regra | Nat. | Status |
|---|---|---|---|
| $q_n \le 0$ | bloquear (÷0 na Eq. 14) | FÍS | TESTADO (D·Z1) |
| $l \le 0$ | bloquear | FÍS | TESTADO (D·Z2) |
| $\rho \le 0$ | bloquear | FÍS | TESTADO (D·E) |
| $f \notin \{50;60\}$ Hz (se $f$ fornecido) | bloquear | NORM (§1 escopo) | TESTADO (D·B2) |
| $\theta_e > \theta_{máx}$ (regime mínimo) | **bloquear (estrito `>`; igualdade PASSA)** | **ENV** (limite térmico da isolação; **enquanto não houver norma específica citada** — candidatas: IEC 60949, IEC 60986, citadas na NOTE de 7.1.2) | **TESTADO** (D·B1 bloqueia 120>90; **D·S·θ confirma 90=90 → sucesso**) — *(corrige v1.1, que dizia `≥`)* |
| $q_n \le 2\,000$ mm² (máx) | — | ENV | **PROP** |
| $l \le 50\,000$ m (máx) | — | ENV | **PROP** |

### M15 — Agregação
| Verificação | Regra | Nat. | Status |
|---|---|---|---|
| `componentes` vazio/não-array | bloquear (BLK-M15-002) | **CONTR** (validação de contrato) | **COD** (não há teste de array vazio) |
| $c_{\max} U_n > U_m$ | bloquear dielétrico (BLK-M15-003) | NORM (Tabela 1, nota a) | TESTADO (E·E·diel) |
| $Z_k = 0$ (curto franco, $I_k''\to\infty$) | bloquear (BLK-M15-001) | **FÍS** (a condição) | TESTADO (E·Z) |
| limiar $\lvert\underline{Z}_k\rvert < 10^{-9}\ \Omega$ | guarda numérica que implementa $Z_k\to0$ | **ENV numérico** (o *valor* do limiar) | TESTADO (E·Z) |
| Nível de tensão uniforme antes da soma | pré-condição de uso | NORM (5.2) | **PROP** (não verificado em código) |

---

## Critério 7 — Condições de Bloqueio e Avisos (códigos corrigidos)

> **Correção (1ª auditoria, ponto 8):** o dielétrico ganha código próprio **BLK-M15-003**; **BLK-M15-002** fica reservado exclusivamente a array vazio.

| Código | Motor | Condição | Nat. | Status | Mensagem |
|---|---|---|---|---|---|
| BLK-M01-001 | M01 | $I_{kQ}'' = 0$ | FÍS | TESTADO (A·E1) | `I''kq deve ser estritamente positiva (>0 A)` |
| BLK-M01-002 | M01 | $I_{kQ}'' < 0$ | FÍS | TESTADO (A·E2) | `corrente fisicamente impossível (<0 A)` |
| BLK-M01-003 | M01 | $c \notin [0{,}90;1{,}10]$ | NORM | TESTADO topo (A·B2); base 0,90 COD | `fator c fora da Tabela 1` |
| BLK-M01-004 | M01 | $t_r < 1$ | NORM | TESTADO (A·B1) | `tr deve ser ≥ 1 (posição principal do tap)` |
| BLK-M02-001 | M02a | $u_{Rr} > u_{kr}$ | FÍS | TESTADO (B·E·crit) | `uRr>ukr: Xt imaginário (radicando negativo, F9)` |
| BLK-M02-002 | M02a | $S_{rT} \le 0$ | FÍS | TESTADO (B·Z1) | `Srt deve ser >0 VA` |
| BLK-M02-003 | M02a | $u_{kr} \le 0$ | FÍS | TESTADO (B·E1) | `ukr fora da faixa física (>0)` |
| BLK-M02-004 | M02a | $u_{kr} > 20\%$ | ENV | TESTADO (B·B) | `ukr excede teto de produto 20%` |
| BLK-M02b-001 | M02b | trafo grupo gerador | NORM (6.7) | TESTADO (B·Gov) | `KT proibido em grupo gerador — usar KS/KSO` |
| BLK-M03-001 | M03 | $\cos\varphi \notin [0;1]$ | NORM | TESTADO (C·E·cos) | `cos(phi) fora de [0;1]` |
| BLK-M03-002 | M03 | $x_d'' \le 0$ | FÍS | TESTADO (C·E·xdd) | `x''d deve ser >0 p.u.` |
| BLK-M03-003 | M03 | $x_d'' > 1$ | ENV | TESTADO (C·B) | `x''d excede teto de produto 1 p.u.` |
| BLK-M03-004 | M03 | $R_G < 0$ | FÍS | TESTADO (C·E·Rg) | `Rg não pode ser negativa` |
| BLK-M04-001 | M04 | $q_n \le 0$ | FÍS | TESTADO (D·Z1) | `qn deve ser >0 mm² (÷0 na F14)` |
| BLK-M04-002 | M04 | $f \notin \{50;60\}$ | NORM | TESTADO (D·B2) | `frequência fora de {50;60} Hz` |
| BLK-M04-003 | M04 | $\theta_e > \theta_{máx}$ (estrito) | **ENV** (sem norma específica citada) | TESTADO (D·B1; igualdade passa por D·S·θ) | `θe excede θmáx da isolação` |
| BLK-M15-001 | M15 | $Z_k=0$ (condição) via limiar $10^{-9}\,\Omega$ | **FÍS** (condição) + **ENV numérico** (limiar) | TESTADO (E·Z) | `Zk→0: curto franco (Ik''→∞)` |
| BLK-M15-002 | M15 | `componentes` vazio | **CONTR** (validação de contrato) | **COD** | `array de componentes não pode ser vazio` |
| BLK-M15-003 | M15 | $c_{\max} U_n > U_m$ | NORM | TESTADO (E·E·diel) | `c_max·Un excede Um — violação dielétrica` |
| WARN-M02-001 | M02a | $u_{kr} > 15\%$ | HEUR | **PROP** | `ukr>15% — verificar trafo especial` |
| WARN-M03-001 | M03 | $x_d'' > 0{,}4$ p.u. | HEUR | **PROP** | `x''d>0,4 p.u. — confirmar placa` |

---

## Critério 8 — Rastreabilidade (origem na norma)

| Motor | Origem | Rastreabilidade corrigida |
|---|---|---|
| M00 | 5.3.1, **Tabela 1** | Voltage factor $c$ |
| M01 | 6.2, **Fórmulas (4), (6)** | Figure 5; §6.2 |
| M02a | 6.3.1, **Fórmulas (7), (8), (9)** | §6.3.1 |
| M02b | 6.3.3, **Fórmula (12a)** | §6.3.3 |
| M03 | 6.6.1, **Fórmulas (17), (18)** | §6.6.1 |
| M04 | 6.4, **Fórmula (14)** + **7.1.2, Fórmula (32)** | ⚠️ **Corrigido:** (14) em §6.4; **(32) em §7.1.2** (não no Anexo A). O Anexo A cobre somente $m$ e $n$. |
| M15 | 5.3.1 (método) + 7.2.1 (uso de $\underline{Z}_k$) | §5.3.1; §7.2.1 |

---

## Critério 9 — Critérios de QA/BDD Associados

### 9.1 Regras TESTADAS pelos 39 testes (contrato blindado)

A suíte `tests/core_curto_circuito.test.js` (39 testes, exit 0) distribui-se assim:

| Bloco | Testes | Motor | Cobre |
|---|---|---|---|
| Interface | 5 (I·*) | M01–M04, M15 | existência dos métodos |
| A — Rede | 6 (A·S, A·E1, A·E2, A·Z, A·B1, A·B2) | M01 | feliz + 5 bloqueios |
| B — Trafo | 8 (B·S, B·E·crit, B·Z1, B·E1, B·B, B·Z2, B·E2, B·Gov) | M02a+M02b | feliz + 7 bloqueios |
| C — Gerador | 9 (C·S, C·O, C·E·cos ×2, C·E·xdd, C·Z1, C·Z2, C·B, C·E·Rg) | M03 | feliz + mínima + 7 bloqueios |
| D — Cabo | 7 (D·S, D·S·θ, D·Z1, D·Z2, D·E, D·B1, D·B2) | M04 | feliz + correção térmica + 5 bloqueios |
| E — Agregação | 4 (E·M, E·O, E·E·diel, E·Z) | M15 | many + one + dielétrico + curto franco |
| **Σ** | **39** | | |

> **Nota:** `E·E·diel` exercita **BLK-M15-003** (dielétrico), **não** BLK-M15-002. O bloqueio de array vazio (BLK-M15-002) permanece **COD/não-testado**.

### 9.2 Provas de Cálculo Contestáveis (gabaritos — TODAS TESTADAS)

Fonte: Cahier Schneider n° 158, §3.5 Problema 1 (trafo 400 kVA). Tolerância declarada: ≤ 0,5 %.

**G01 — M01** (TESTADO A·S): $c=1{,}10$, $U_{nQ}=20\,000$ V, $I_{kQ}''=10\,000$ A, $t_r=48{,}78$
$$Z_Q = \frac{1{,}10 \times 20\,000}{\sqrt3 \times 10\,000} = 1{,}270\ \Omega; \quad Z_{Qt} = 1{,}270/48{,}78^2 = 0{,}534\ \text{m}\Omega; \quad X_{Qt}=0{,}531; \; R_{Qt}=0{,}0531\ \text{m}\Omega$$

**G02 — M02a+M02b** (TESTADO B·S): $S_{rT}=400\,000$ VA, $U_{rT}=410$ V, $u_{kr}=4\%$, $P_{krT}=4\,600$ W, $c_{\max}=1{,}05$
$$Z_T = 0{,}04 \cdot \frac{410^2}{400\,000} = 16{,}81\ \text{m}\Omega; \; R_T = \frac{4\,600 \cdot 410^2}{400\,000^2} = 4{,}836\ \text{m}\Omega; \; X_T = \sqrt{16{,}81^2-4{,}836^2}=16{,}10\ \text{m}\Omega$$
$$x_T = 0{,}03832; \quad K_T = \frac{0{,}95 \cdot 1{,}05}{1+0{,}6 \cdot 0{,}03832} = 0{,}975; \quad \underline{Z}_{TK}=(4{,}71+\mathrm{j}\,15{,}70)\ \text{m}\Omega$$

**G03 — M03** (TESTADO C·S): $U_{rG}=21\,000$ V, $S_{rG}=250\times10^6$ VA, $x_d''=0{,}17$, $\cos\varphi=0{,}78$, $U_n=U_{rG}$, $c_{\max}=1{,}10$
$$Z_{rG}=\frac{21\,000^2}{250\times10^6}=1{,}764\ \Omega; \; X_d''=0{,}2999\ \Omega; \; K_G=\frac{1{,}10}{1+0{,}17 \cdot 0{,}6258}=0{,}994$$

**G04 — M04** (TESTADO D·S): Cu $q_n=120$ mm², $l=100$ m, $\rho=1/54$, $x'=0{,}08\ \Omega/\text{km}$, 20 °C
$$R_{L20}=\frac{1/54}{120}\cdot100=15{,}43\ \text{m}\Omega; \; X_L=0{,}08 \cdot 100 \cdot 10^{-3}=8{,}00\ \text{m}\Omega; \; |\underline{Z}_L|=17{,}38\ \text{m}\Omega$$

**G05 — M04 correção térmica** (TESTADO D·S·θ): $R_{L20}=15{,}43$ mΩ, $\theta_e=90$ °C, $\theta_{máx}=90$ °C, $\alpha=0{,}004$
$$R_L = 15{,}43 \cdot [1+0{,}004(90-20)] = 19{,}75\ \text{m}\Omega \quad(\theta_e=\theta_{máx}\Rightarrow \text{passa; bloqueio é estrito }>)$$

**G06 — M15** (TESTADO E·M): $\underline{Z}_{Qt}+\underline{Z}_{TK}+\underline{Z}_L$
$$R_k=0{,}053+4{,}71+0{,}416=5{,}18\ \text{m}\Omega; \; X_k=0{,}531+15{,}70+0{,}136=16{,}37\ \text{m}\Omega; \; |\underline{Z}_k|=17{,}17\ \text{m}\Omega$$

### 9.3 Testes PROPOSTOS para M16 (`implementado_sem_validacao` — ainda sem teste)

> ⚠️ **Estes casos são `PROP`.** M16 (`calcularCorrenteInicialSimetrica(Un, Zk, c)`) valida hoje apenas: $U_n>0$, $Z_k>0$, $c\in(0;\,1{,}10]$.

**Contraste explícito de validação de $c$ (não há validação M00 uniforme):**

| Motor | Faixa de $c$ aceita hoje | Observação |
|---|---|---|
| **M01** (`calcularImpedanciaRede`) | **$c \in [0{,}90;\ 1{,}10]$** (banda fechada; bloqueia fora) | testado só no topo (A·B2) |
| **M16** (`calcularCorrenteInicialSimetrica`) | **$c \in (0;\ 1{,}10]$** (aceita, p.ex., $c=0{,}5$ ou $c=0{,}85$) | **não impõe $c \ge 0{,}90$** |

> **Perfil IEC do fator $c$ (a impor no M16, `PROP`):** no perfil normativo atual (Tabela 1), $c$ pertence ao **conjunto discreto** $\{0{,}90;\ 0{,}95;\ 1{,}00;\ 1{,}05;\ 1{,}10\}$. Valores fora deste conjunto (mesmo dentro de $[0{,}90;1{,}10]$, como $c=0{,}93$) **não são tabelados e devem ser bloqueados**. Hoje M16 os aceita — gap conhecido e regra `PROP`.

| Caso | Entrada | Saída esperada | Tipo | Regra no motor atual | Teste específico |
|---|---|---|---|---|---|
| TC-M16-01 | $U_n = 400$ V*, $Z_k = 17{,}17$ mΩ, $c = 1{,}05$ | **$I_k'' = 14{,}1227$ kA** | Feliz (gabarito Schneider) | **COD** | **PROP** |
| TC-M16-02 | $U_n = 0$, $Z_k = 0{,}017$, $c = 1{,}05$ | bloqueio ($U_n \le 0$) | FÍS | **COD** | **PROP** |
| TC-M16-03 | $U_n = 410$, $Z_k = 0$, $c = 1{,}05$ | bloqueio ($Z_k \le 0$) | FÍS | **COD** | **PROP** |
| TC-M16-04 | $U_n = 410$, $Z_k = 0{,}017$, $c = 1{,}15$ | bloqueio ($c > 1{,}10$) | NORM (topo Tabela 1) | **COD** | **PROP** |
| TC-M16-05 | $U_n = 410$ V**, $Z_k = 17{,}0$ mΩ, $c = 0{,}95$ | **$I_k'' = 13{,}2281$ kA** | Feliz (mínima ilustrativa) | **COD** | **PROP** |
| **TC-M16-06** | $U_n = 410$, $Z_k = 0{,}017$, **$c = 0{,}85$** ($< 0{,}90$) | **bloqueio** (abaixo da Tabela 1) | NORM (base Tabela 1) | **PROP — hoje aceita** | **PROP** |
| **TC-M16-07** | $U_n = 410$, $Z_k = 0{,}017$, **$c = 0{,}93$** (não tabelado) | **bloqueio** (valor não pertence ao conjunto) | NORM (perfil discreto) | **PROP — hoje aceita** | **PROP** |

\* **TC-M16-01:** $U_n = 400$ V (tensão **nominal do sistema**, gabarito Schneider), não 410 V.
$$I_k'' = \frac{1{,}05 \times 400}{\sqrt3 \times 17{,}17\times10^{-3}} = \frac{420}{0{,}0297393} = 14\,122{,}7\ \text{A} = 14{,}1227\ \text{kA}$$

\*\* **TC-M16-05 (aritmética):** com os dados declarados ($U_n=410$ V ilustrativo, $Z_k=17{,}0$ mΩ):
$$I_k'' = \frac{0{,}95 \times 410}{\sqrt3 \times 17{,}0\times10^{-3}} = \frac{389{,}5}{0{,}0294449} = 13\,228{,}1\ \text{A} = 13{,}2281\ \text{kA} \quad(\text{v1.1 dizia 13,15 — errado})$$

> **Determinações vinculantes para o QA ao escrever o RED de M16:**
> 1. Usar $U_n$ **nominal do sistema** — 400 V no gabarito Schneider — e não a tensão de placa do enrolamento.
> 2. Exigir $c \in \{0{,}90;0{,}95;1{,}00;1{,}05;1{,}10\}$. TC-M16-06 e TC-M16-07 devem bloquear. A adequação permanece `PROP` até o RED→GREEN.

---

## Classificação Consolidada dos Limites Citados pela Governança

Resposta direta ao ponto 10 da auditoria — cada limite recebe natureza + justificativa + status:

| Limite | Natureza | Justificativa / Cláusula | Status |
|---|---|---|---|
| $u_{kr} \le 20\%$ | **ENV** (envelope AmpAI) | Não há teto normativo. Trafos de distribuição/potência têm $u_{kr}$ 4–20 %; especiais (fornos, retificadores) excedem. Escolhido como guarda de produto. | TESTADO (B·B) |
| $x_d'' \le 1$ p.u. | **ENV** | Não normativo. Reatância subtransitória p.u. tipicamente 0,1–0,4; >1 é fisicamente improvável em placa. | TESTADO (C·B) |
| $U \le 550$ kV | **NORM** (fronteira de escopo) | IEC 60909-0:2016 §1: sistemas ≥ 550 kV exigem consideração especial. **Porém não codificado** → valor documental. | **PROP** |
| $I_{kQ}'' \le 200$ kA | **ENV** | Guarda de sanidade de produto; sem base normativa. | **PROP** |
| $l \le 50$ km | **ENV** | Guarda de produto para cabos/linhas de distribuição. | **PROP** |
| $q_n \le 2\,000$ mm² | **ENV** | Guarda de produto (seção máxima usual). | **PROP** |
| aviso $u_{kr} > 15\%$ | **HEUR** (configurável) | Sinaliza trafo especial; ajustável. | **PROP** |
| aviso $x_d'' > 0{,}4$ p.u. | **HEUR** | Sinaliza valor elevado de placa; ajustável. | **PROP** |

> **Consequência de governança:** dos oito limites acima, **apenas dois** ($u_{kr}\le20\%$ e $x_d''\le1$) são hoje contrato (codificados e testados). Os demais são **documentais/`PROP`** — não devem ser citados como capacidade existente até receberem código + teste.

---

## Estado Confirmado (alinhado à 2ª auditoria)

- **M01, M02a, M02b, M03, M04, M15:** `stable` dentro do contrato **atualmente testado** (linhas TESTADO). ✔
- Suíte: **39 verdes, exit 0**. ✔
- **M16:** `implementado_sem_validacao` — método existe; testes 9.3 são `PROP`. ✔
- Comentários "FASE RED" no arquivo de teste = **dívida documental** (QA/CTO), não estado funcional. ✔

---

*RNC-C canônico v1.2.1 — `docs/engenharia/RNC-C_Fundacao_M00_M04_M15.md` — produzido pelo @Engenheiro_Eletricista e ratificado por `@Arquiteto_Chefe_e_Governanca` em 2026-07-07, baseline `641d8ab9705630da5180eae7764b272f6a2e3867`. A classificação de M16 permanece `implementado_sem_validacao`; TC-M16-01 a TC-M16-07 permanecem testes `PROP` até execução formal do INC-001.*
