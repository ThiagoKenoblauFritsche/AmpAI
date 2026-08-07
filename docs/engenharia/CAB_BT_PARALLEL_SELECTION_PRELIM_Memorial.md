---
status: EXPERIMENTAL_PRELIMINAR_NAO_CANONICO
uso: LABORATORIO_APENAS
proibido_para: PROJETO_COMPRA_INSTALACAO_MEMORIAL_FINAL
fonte_primaria_completa: AUSENTE
estado_producao: BLOQUEADO
productionAllowed: false
os: CAB-BT-PARALLEL-002-SCI-PRACTICAL
classe: CHG-3 científica experimental
persona: "@Engenheiro_Eletricista"
baseline: origin/main@83e24131c0cc09813be65a5fa269961b9cc80c5c
nucleo_integrado: js/core_cabos_bt_parallel_experimental.js (CAB-BT-PARALLEL-EXP-1)
data: 2026-07-20
---

# Memorial — Enumeração e comparação preliminar de cabos BT em paralelo

> **PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.** `productionAllowed=false`.
> Toda conclusão é **`MATHEMATICAL_ONLY`** sobre hipóteses `ASSUMPTION_ONLY`; nenhuma é recomendação
> produtiva nem "conforme IEC". Núcleo: [[cab-bt-parallel-selection-prelim-rnc-p]]. Ciência-base:
> [[cab-bt-parallel-prelim-memorial]]. **Não** há "seleção" nem "alternativa preferencial": há
> **alternativas candidatas ordenadas** por objetivo. **PR #40 DO NOT MERGE.**

Unidades **SI**. Equações em LaTeX; **todos os números vêm da execução do motor REAL da PR #39** (`require()`
do núcleo; §Apêndice A).

### 0.1 Tolerância computacional (política AmpAI)

`TOLERANCIA_COMPUTACIONAL_LAB_AMPAI` = **±0,5 % relativo**, determinística, **não** normativa IEC. Aplica-se
a todo valor "≈", a empates da fronteira (§4) e às comparações de dominância.

---

## 1. O que a enumeração consome do núcleo (contrato CAB-BT-PARALLEL-EXP-1)

Por candidato ($S$, $n_p$), monta-se o `input` com $n_p$ ramos (idênticos no MODO_GUIADO,
`provenance: 'ASSUMPTION_ONLY'`) e lê-se: `capacityProxy.totalAdmissibleCurrentProxy_A` (ampacidade),
`voltageDrop.threePhase_V` (÷ $U_{LL}$ → %), `faultAdiabatic.minimumSectionContinuous_mm2` (curto),
`loadSharing.deltaLoad`, e `blockers`/`productionAllowed`/`displayNotice` (propagados intactos). O núcleo
**não** conhece $U_{LL}$ nem seleciona quantidade.

---

## 2. Avaliação dos três critérios (Objetivo 5)

$$I_{adm}^{proxy}=\frac{n_p\,I_z\,k_g}{\delta_{load}}\ \ge\ I_b,\quad m_{amp}=\frac{I_{adm}^{proxy}}{I_b}-1;
\qquad \Delta U\%=\frac{\Delta U_{3\phi}}{U_{LL}}\cdot100\ \le\ \Delta U_{max},\quad m_{du}=\frac{\Delta U_{max}-\Delta U\%}{\Delta U_{max}};$$
$$S\ \ge\ S_{min}=\frac{I_{k,ramo}\sqrt{t}}{k},\quad m_{sc}=\frac{S}{S_{min}}-1.$$

$\Delta U_{max}$ é limite do **usuário** (não IEC). $k_g$ segue um dos modos determinísticos do RNC-P §4;
$k$ é `ASSUMPTION_ONLY` ($\text{A}\cdot\text{s}^{1/2}/\text{mm}^2$). **Checagem dimensional:** $S_{min}$ em
mm² ✔; margens adimensionais ✔. Um candidato **atende** sse os três atendem. **Critério dominante** = o de
**menor margem**. Reprovação lista os critérios que falham (ou o código de blocker do núcleo).

---

## 3. Quantidade discreta (Objetivo 5)

$n_p\in\mathbb{Z}_{\ge1}$. `nParallelContinuousProxy` é **sensibilidade**, nunca instalável
(`installableSelection: null`, `discreteSelectionBlocked: true`). Menor $n_p$ discreto que atende acima da
quantidade máxima do usuário → `EXCESSIVE_COUNT`.

---

## 4. Fronteira não dominada (Objetivo 6)

Somente candidatos **válidos** (os três critérios atendem) participam. Métricas comparadas e sentido:

| Métrica | Símbolo | Sentido |
|---|---|---|
| Quantidade em paralelo | $n_p$ | **minimizar** |
| Cobre total | $C=n_p\cdot S$ | **minimizar** |
| Margem vinculante | $m^\star=\min(m_{amp},m_{du},m_{sc})$ | **maximizar** |

**Dominância:** $A \succ B$ (A domina B) sse A **não é pior** em nenhuma métrica **e** é **estritamente
melhor** em ao menos uma:
$$n_p^A\le n_p^B \ \wedge\ C^A\le C^B \ \wedge\ m^{\star A}\ge m^{\star B} \ \wedge\ (\text{ao menos uma estrita}).$$

**Fronteira não dominada** $=\{A \text{ válido} : \nexists\,B \text{ válido},\ B\succ A\}$.

**Comparador operacional (Objetivo 6).** Métricas **discretas** — $n_p$, $S$ (`section_mm2`) e cobre
$C$ (`totalCopper_mm2`) — usam **comparação exata**. A **margem mínima** $m^\star$ (precisão de máquina do
motor, **não** arredondada) usa igualdade aproximada com base simétrica:
$$\text{approximatelyEqual}(a,b)\iff |a-b|\le 0{,}005\cdot\max(|a|,|b|,\varepsilon),\qquad \varepsilon=10^{-12},$$
onde $0{,}005=\pm0{,}5\%$ e $\varepsilon$ evita base zero. Na dominância, valores aproximadamente iguais
**não** constituem desigualdade estrita; **ao menos uma** métrica deve ser **estritamente melhor além da
tolerância**. O arredondamento visual **não** participa. Para **validação de valor esperado** a base do erro
relativo é declarada **separadamente** (não se reutiliza o comparador de ordenação).

A apresentação retorna **todas** as candidatas válidas e **destaca a fronteira**, **sem eleger** uma
solução instalável.

---

## 5. Objetivo configurável — comparadores totais (Objetivos 7–11)

O **objetivo** (preferência do usuário/produto, **nunca IEC**) apenas **ordena** as **14 candidatas
válidas** (universo completo §6.0); **não** elege solução instalável. Comparadores **totais
determinísticos** (desempate final por `candidateId` crescente):

| Objetivo | Cadeia de comparação | Primeira na ordem (verificada) | Antes (até 240) |
|---|---|---|---|
| `NONE` | $n_p$↑, `section_mm2`↑, `candidateId`↑ | **2×185** — `PRESENTATION_ORDER_ONLY`, `NO_CANDIDATE_ELECTED` | 2×185 (igual) |
| `MIN_PARALLEL_COUNT` | $n_p$↑, $m^\star$↓, $C$↑, $S$↑, `candidateId`↑ | **2×300** | 2×240 → **mudou** |
| `MIN_TOTAL_COPPER` | $C$↑, $m^\star$↓, $n_p$↑, $S$↑, `candidateId`↑ | **3×120** ($C=360$ mm²) | 3×120 (igual) |
| `MAX_MINIMUM_MARGIN` | $m^\star$↓, $C$↑, $n_p$↑, $S$↑, `candidateId`↑ | **4×300** ($m^\star=0{,}778360$) | 4×240 → **mudou** |

**300 mm² altera duas ordens:** `MIN_PARALLEL_COUNT` passa a começar por **2×300** (empate em $n_p=2$
desempatado por margem: 2×300 $m^\star=0{,}376$ > 2×240 $0{,}186667$ > 2×185 $0{,}013333$); `MAX_MINIMUM_MARGIN`
por **4×300** ($m^\star=0{,}778360>0{,}741824$ de 4×240). `NONE` (2×185) e `MIN_TOTAL_COPPER` (3×120) **não**
mudam. **Nenhuma primeira posição é seleção ou recomendação instalável.**

Todas as ordens são **preferência de apresentação**: `firstInPresentationOrder` **não** significa
instalação autorizada. `installableSelection: null`, `DISCRETE_SELECTION_BLOCKED`, `productionAllowed=false`.
Nenhuma candidata é chamada de selecionada/recomendada/solução final/dimensionamento final/preferencial.

---

## 6. Universo cartesiano completo e casos (Objetivo 10 — números do motor real)

Base: $U_{LL}=400$ V, $\cos\varphi=0{,}9$, $I_b=600$ A, $I_k=20\,000$ A, $t=0{,}2$ s, $k=115$,
$k_g=0{,}8$ (**`LAB_CONSTANT_CONFIRMED` / `ASSUMPTION_ONLY`**), $\Delta U_{max}=3\%$, ramos idênticos
(**$\delta_{load}=1$ produzido pelo L0**), catálogo `ASSUMPTION_ONLY` **estendido** {95:240, 120:285,
150:330, 185:380, 240:445, **300:516**} A (entrada de 300 mm² em §6.0-A), modelo
$\underline{Z}(S)=\tfrac{2{,}25}{S}+j0{,}008\ \Omega$ (RNC-P §5; $L_{ref}=100$ m).

### 6.0-A Entrada laboratorial de 300 mm² (sexta seção)

Campos **exatos do catálogo executável** (todos `ASSUMPTION_ONLY`; **identificadores laboratoriais — não
especificação física, comercial ou normativa de cabo**; **não IEC**):
`section_mm2=300` · `tabulatedAmpacity_A=516` · `material=COPPER_LAB` · `insulation=LAB_UNSPECIFIED` ·
`installationMethod=LAB_UNSPECIFIED` · `referenceTemperature_C=30` · `units=SI` · `source=LAB_CATALOG` ·
`sourceVersion=PRELIM-1` · `provenance=ASSUMPTION_ONLY` · `impedance_ohm={ re: 0.0075, im: 0.008 }`
(representação `IMPEDANCE_COMPLEX`).

**Ampacidade — método documentado (sem extrapolação silenciosa):** os valores do catálogo são placeholders
de laboratório. Adota-se **extrapolação linear monótona** dos dois pontos superiores $(185,380)$ e
$(240,445)$: inclinação $\tfrac{445-380}{240-185}=1{,}1818\ \text{A/mm}^2$ ⇒ $A(300)=445+1{,}1818\cdot60=
515{,}9\approx\mathbf{516}$ A. **Sensibilidade:** a lei de potência $A=c\,S^{n}$ (mesmos dois pontos) dá
$A(300)=509{,}5$ A; **intervalo produzido pelos dois métodos de extrapolação avaliados: aproximadamente
509–516 A**. **Valor determinístico adotado: 516 A** (`ASSUMPTION_ONLY`);
qualquer valor sem fonte primária é `ASSUMPTION_ONLY`; **nenhuma conformidade IEC**.

**Impedância:** estende-se a hipótese laboratorial $\underline{Z}(S)=\tfrac{2{,}25}{S}+j0{,}008\ \Omega$ →
$\underline{Z}(300)=\mathbf{0{,}0075}+j0{,}008\ \Omega$. **$R=0{,}0075\ \Omega$ decorre apenas dessa hipótese
laboratorial** ($2{,}25\ \Omega\cdot\text{mm}^2 / 300\ \text{mm}^2$), **não da IEC**, e **não** é dado
normativo nem comercial.

**Robustez do universo (sensibilidade):** para qualquer $A(300)\ge 480$ A o resultado qualitativo é
**invariante** (14 válidas, fronteira 14, `MIN_PARALLEL_COUNT`→2×300, `MAX_MINIMUM_MARGIN`→4×300). O ponto
$A(300)=445$ A é **cenário-limite externo à faixa de extrapolação adotada** (509–516 A), **não utilizado
como valor do catálogo** e **incluído apenas como contraprova de sensibilidade** (nesse limite o 2×300
empataria com 2×240); **nenhuma conclusão física universal** é formulada sem fonte primária. As duas
extrapolações (509/516 A) caem na faixa robusta.

### 6.0 Universo cartesiano completo (vinculante)

$U = \text{catálogo}\times\{1,\dots,n_p^{max}\}$; catálogo **estendido** {95,120,150,185,240,**300**},
$n_p^{max}=4$ ⇒ $|U|=6\times4=\mathbf{24}$. **Proibidos** amostragem parcial, poda silenciosa, fronteira
sobre subconjunto ilustrativo e objetivos sobre subconjunto diferente de $U$.

**Partição determinística (verificada no motor real):** `evaluatedCandidates`=**24** ·
`candidateAlternatives`=**14** · `rejectedCandidates`=**10** · `nonDominatedAlternatives`=**14**.
Reconciliação: $14+10=24$; $\text{nonDominated}\subseteq\text{candidateAlternatives}$.
**Antes** (catálogo até 240): 20 / 11 / 9 / 11.

**As 14 candidatas válidas** ($m^\star$ = precisão do motor; **em negrito as 3 novas de 300 mm²**):

| Candidata | $n_p$ | Cobre (mm²) | $m^\star$ |
|---|---:|---:|---:|
| 2×185 | 2 | 370 | 0,013333 |
| 2×240 | 2 | 480 | 0,186667 |
| **2×300** | 2 | 600 | **0,376000** |
| 3×120 | 3 | 360 | 0,140000 |
| 3×150 | 3 | 450 | 0,320000 |
| 3×185 | 3 | 555 | 0,520000 |
| 3×240 | 3 | 720 | 0,655766 |
| **3×300** | 3 | 900 | **0,704480** |
| 4×95 | 4 | 380 | 0,280000 |
| 4×120 | 4 | 480 | 0,520000 |
| 4×150 | 4 | 600 | 0,632218 |
| 4×185 | 4 | 740 | 0,687515 |
| 4×240 | 4 | 960 | 0,741824 |
| **4×300** | 4 | 1200 | **0,778360** |

**As 10 candidatas rejeitadas** (sem omissão; nenhuma tem blocker de núcleo — reprovação de critério em L1):

| Candidata | $I_{adm}$ (A) | $\Delta U\%$ | $S_{min}$ (mm²) | Critérios reprovados |
|---|---:|---:|---:|---|
| 1×95 | 192 | 6,444 | 77,78 | AMPACIDADE, QUEDA |
| 1×120 | 228 | 5,290 | 77,78 | AMPACIDADE, QUEDA |
| 1×150 | 264 | 4,413 | 77,78 | AMPACIDADE, QUEDA |
| 1×185 | 304 | 3,750 | 77,78 | AMPACIDADE, QUEDA |
| 1×240 | 356 | 3,098 | 77,78 | AMPACIDADE, QUEDA |
| **1×300** | **413** | **2,660** | 77,78 | **AMPACIDADE** |
| 2×95 | 384 | 3,222 | 38,89 | AMPACIDADE, QUEDA |
| 2×120 | 456 | 2,645 | 38,89 | AMPACIDADE |
| 2×150 | 528 | 2,207 | 38,89 | AMPACIDADE |
| 3×95 | 576 | 2,148 | 25,93 | AMPACIDADE |

**Fronteira = todas as 14 válidas.** Cada candidata preserva uma **troca** entre $n_p$, cobre e margem;
nenhuma domina outra (verificado). As **3 novas** (2×300, 3×300, 4×300) **entram** na fronteira e **nenhuma
existente é removida**.

---

### Exemplos individuais ratificados (ilustrações; **não** constituem o universo-base §6.0)

Casos com catálogo/parâmetros próprios, preservados como **ilustrações individuais** — não são o universo.

#### 6.1 Alternativa candidata única
Catálogo {240}, $I_b=600$, $n_p^{max}=2$: **1×240** rejeitado (amp 356<600; ΔU 3,098%>3); **2×240** atende
(712) → única candidata válida deste catálogo restrito.

#### 6.2 Critérios e dominante por AMPACIDADE (subconjunto ilustrativo)
Três das 14 válidas do §6.0, para ilustrar critérios (não é a fronteira — a fronteira tem 14):

| Cand. | $I_{adm}$ (A) | $m_{amp}$ | $\Delta U\%$ | $m_{du}$ | $S_{min}$ | $m_{sc}$ | $m^\star$ |
|---|---|---|---|---|---|---|---|
| 2×240 | 712 | 0,1867 | 1,549 | 0,4836 | 38,89 | 5,172 | **0,1867** |
| 3×150 | 792 | 0,3200 | 1,471 | 0,5096 | 25,93 | 4,786 | **0,3200** |
| 4×120 | 912 | 0,5200 | 1,323 | 0,5591 | 19,44 | 5,172 | **0,5200** |

#### 6.3 Dominante por QUEDA
3×150, $\Delta U_{max}=1{,}6\%$: $\Delta U\%$=1,471, $m_{du}$=**0,081** < demais → dominante QUEDA; atende.

#### 6.4 Dominante por CURTO
2×185, $I_k=40\,000$, $t=1{,}0$, $I_b=500$: $S_{min}$=**173,91**, $m_{sc}$=**0,064** < demais → dominante
CURTO; atende.

#### 6.5 Quantidade excessiva
$I_b=1500$, $n_p^{max}=4$: 4×240 rejeitado (amp 1424<1500); proxy contínuo 4,213 ⇒ discreto exigiria **5**
> 4 → **`EXCESSIVE_COUNT`**.

#### 6.6 Catálogo sem candidato avaliável
Catálogo cujos candidatos são todos incompletos (falta $R$/$Z$, ampacidade ou proveniência) →
**`CATALOG_NO_EVALUABLE_CANDIDATE`** (bloqueia integralmente). Candidato incompleto isolado →
**`CANDIDATE_INCOMPLETE`** (rejeitado nominalmente).

#### 6.7 Ausência de fator de agrupamento
$k_g$ não informado → o **núcleo** retorna **`GROUPING_FACTOR_MISSING`** (BLOCKED); propagado; nenhum $k_g$
é presumido (B-02). Em `GROUPING_MATRIX`, combinação $(n_p,n_c,\text{método},\text{arranjo})$ ausente →
candidato bloqueado.

#### 6.8 Arranjo não confirmado (modo guiado)
Hipótese de impedâncias idênticas **apresentada e confirmada** → sucesso **`MATHEMATICAL_ONLY`** com
**$\delta_{load}=1$ observado do L0** e blocker **`ENGINEERING_ADEQUACY_BLOCKED (geometry_not_provided)`**.
**Sem confirmação** → **`GUIDED_HYPOTHESIS_UNCONFIRMED`** (bloqueia). Nenhuma adequação de engenharia.

#### 6.9 Corrente elevada sugere avaliar barramento
$I_b=1500$, todas as candidatas ≤ $n_p^{max}=4$ reprovam ampacidade → nota **qualitativa** "avaliar
barramento/busway (limiar normativo AUSENTE — B-04)". **Nenhuma recomendação comercial automática.**

#### 6.10 $\delta_{fault}$: explícito vs conservador
2×185, $I_k=30\,000$, $t=1{,}0$: `EXPLICIT_ASSUMPTION` $\delta_{fault}=1{,}15$ → $S_{min}$=**150,00** (185
atende); `CONSERVATIVE_SINGLE_BRANCH` → $S_{min}$=**260,87** (185 **rejeita** curto). Ambos `ASSUMPTION_ONLY`.

#### 6.11 Combinação informada pelo usuário (`providedCombination`)
Quando o usuário informa uma combinação (ex.: 3×150), ela é avaliada e devolvida em `providedCombination`
com atende/margens/dominante — **sem** promoção a instalável (`installableSelection: null`).

---

## 7. Formato de saída humana (Objetivo 9)

Não é vetor bruto. Exemplo **real** (2×240, base §6.2, objetivo `MIN_PARALLEL_COUNT`):

```
ALTERNATIVA MATEMÁTICA CANDIDATA
2 × 240 mm² por fase
Ampacidade: atende no cenário laboratorial (I_adm≈712 A vs I_b=600 A; PROXY, não instalável)
Queda:      atende ao limite informado pelo usuário (1,549% ≤ 3%; NÃO é limite IEC)
Curto:      atende às hipóteses informadas (S=240 ≥ S_min≈38,9 mm²)
Critério dominante: AMPACIDADE
Objetivo ativo: MIN_PARALLEL_COUNT
Instalação autorizada: NÃO
Hipóteses: Z(S) ASSUMPTION_ONLY (idênticas confirmadas, δ_load=1 do L0); k_g=0,8 LAB_CONSTANT_CONFIRMED;
           ampacidade tab.=445 A; k=115 A·s^0,5/mm²; δ_fault=1 — todas ASSUMPTION_ONLY
Bloqueios: B-01…B-06; ENGINEERING_ADEQUACY_BLOCKED; DISCRETE_SELECTION_BLOCKED; IEC_CONFORMITY_BLOCKED
```

> **Vocabulário proibido:** "recomendado", "selecionado", "dimensionamento final", "solução". Só
> **"alternativa matemática candidata"**, **"ordenada"** e **"Instalação autorizada: NÃO"**.

---

## 8. Matriz preliminar × produção (Objetivo 12)

| Domínio | Preliminar (laboratório) — **entregue** | Produção — **BLOQUEADO** |
|---|---|---|
| Enumeração de candidatos | discreta $S\times n_p$, schema completo | série/ampacidade IEC (60228 / Anexo B — B-01) |
| $k_g$ | 3 modos; exemplos `LAB_CONSTANT_CONFIRMED` | matriz IEC (B.52.17 notas — B-02) |
| Queda | % vs limite do **usuário** | limite normativo (Anexo G — B-05) |
| Curto | $S_{min}$ com $k$/$\delta_{fault}$ ASSUMPTION_ONLY | $k$ + modelo de falta (4-43/5-54 — B-03/B-05) |
| Comparação | fronteira não dominada + objetivo | após RNC-C ratificado |
| Projeto/compra/instalação/memorial final/produção | **NÃO AUTORIZADO** | requer norma primária integral |

---

## Veredito preliminar (deste memorial)

Enumeração de candidatos, avaliação de critérios, **fronteira não dominada** e **ordenação por objetivo
configurável** estão definidas e **reproduzíveis sobre o motor real da PR #39**, sem eleger solução
instalável. Tudo `MATHEMATICAL_ONLY` / `productionAllowed=false`, B-01…B-06 preservados. Sugerido ao @CTO:
**`PARECER_R1_PRONTO_PARA_CONFERENCIA_FOCALIZADA`** (não libera SDD/UI/QA).

---

## Apêndice A — Reprodutibilidade (motor real)

Os números vêm de protótipos de laboratório que fazem `require()` do núcleo integrado e chamam
`calculateCablingBTParallelExperimental(input)`; **todas as entradas** estão neste documento (§6). Os
protótipos residem **fora do repositório** (scratchpad) e são **auxiliares**. Núcleo da comparação:

```text
por candidato (S, n_p): input EXP-1 -> r = core(input)
  amp:  I_adm = r.data.capacityProxy.totalAdmissibleCurrentProxy_A ; m_amp = I_adm/I_b - 1
  du:   dU%   = r.data.voltageDrop.threePhase_V / U_LL * 100 ;        m_du  = (dU_max - dU%)/dU_max
  sc:   S_min = r.data.faultAdiabatic.minimumSectionContinuous_mm2 ;  m_sc  = S/S_min - 1
  m* = min(m_amp,m_du,m_sc) ; dominante = argmin(m_amp,m_du,m_sc)
fronteira: validos nao dominados em (n_p min, copper min, m* max), tolerancia +-0,5%
objetivo: NONE | MIN_PARALLEL_COUNT | MIN_TOTAL_COPPER | MAX_MINIMUM_MARGIN  (so ordena; nao elege)
```
