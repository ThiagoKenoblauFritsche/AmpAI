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

> **Universo parametrizado (O.S. 004):** o **valor inicial da UI** passa a `maxParallelCount=10` (universo
> bruto **60**; §9); a partição **24 / 14 / 10 / 14** acima é a instância $n_p^{max}=4$ desta fixture
> ($I_b=600$ A). A projeção "menor quantidade que atende por seção" e a **fixture prática do CEO** ($I_b=1800$ A,
> 5×300) estão em **§9**.

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

## 9. Projeção "menor quantidade que atende por seção" — universo até 10 e fixture prática (O.S. 004)

> Contrato **`APROVADO_COM_AJUSTES_VISUAIS_FOCAIS`** (CEO, O.S. CAB-BT-PARALLEL-004). Materializa (A) universo
> parametrizado até 10 paralelos; (B) enumeração integral no motor; (C) projeção de **apresentação** "menor
> quantidade que atende por seção"; (E) objetivos sobre o conjunto filtrado; (F) terminologia; (G) localização
> PT/EN/ES; (H) guardrails. **O filtro é exclusivamente de apresentação** — o envelope bruto do motor permanece
> íntegro. **Nada** aqui elege solução instalável. Todos os números vêm do **motor real** (§Apêndice A;
> protótipo `minimum_per_section.js`).

### 9.1 Universo parametrizado (A)

$U=\text{catálogo}\times\{1,\dots,\text{maxParallelCount}\}$, catálogo `{95,120,150,185,240,300}` (6 seções),
`maxParallelCount` **inteiro**, $n_p\in\{1,\dots,\text{maxParallelCount}\}$. **Valor inicial da UI = 10**;
**limite visual permitido 1…10**. $n_p$ permanece **independente de $n_c$** (§7; mapa $n_p\!\to\!n_c$ BLOQUEADO,
B-02). Com o valor inicial, $|U|=6\times10=\mathbf{60}$; ao reduzir o limite para 7, $|U|=6\times7=\mathbf{42}$ —
**ambos reproduzidos no motor** (§9.6). O motor **não muda de equações** para $n_p$ até 10 (**Análise 1**:
`evaluate(300,10)` → `ok=true`, `MATHEMATICAL_ONLY`, `productionAllowed=false`, `installableSelection=null`;
`voltageDropPercent=null` é **saída interna do L0** — o L0 **não conhece a tensão**, e o percentual visível por
candidata é `voltageDrop.actualPercent` do L1 (§9.11)).

### 9.2 Enumeração integral (B)

O motor **avalia todas** as combinações de $U$. **Proibido** interromper a enumeração ao encontrar a primeira
válida; **proibido** assumir monotonicidade científica para pular cálculos. A menor-por-seção (§9.3) é uma
**projeção de leitura computada após** a enumeração completa.

### 9.3 Definição — menor quantidade que atende por seção (C)

Para cada `section_mm2` $=S$:
$$\text{minimumPassingBySection}(S)=\arg\min_{n_p}\{\,n_p:\ (S,n_p)\ \text{é integralmente válida nos três critérios ratificados (§2)}\,\}.$$
Regras de **apresentação**: (1) apenas candidatas **integralmente válidas**; (2) escolher a de **menor $n_p$**;
(3) **no máximo uma** por seção; (4) **ocultar** da apresentação principal **e da impressão** as candidatas da
**mesma seção com $n_p$ superior**; (5) **não** apagar nem remover essas candidatas do **envelope bruto** do
motor. Se **nenhuma** candidata da seção atende até `maxParallelCount`: **não** inventar candidata, **não**
exibir número aprovado, e **registrar nominalmente** a ausência (§9.10).

### 9.4 Fixture prática (ASSUMPTION_ONLY) e critério vinculante

| Parâmetro | Valor | Classe |
|---|---|---|
| $I_b$ | 1800 A | `INFORMADA_PELO_USUARIO` |
| $U_{LL}$ | 400 V | `INFORMADA_PELO_USUARIO` |
| $\Delta U_{max}$ | 3 % | `INFORMADA_PELO_USUARIO` (**não** IEC) |
| $I_k$ / $t$ | 20 000 A / 0,2 s | `INFORMADA_PELO_USUARIO` |
| $k$ | 115 A·s$^{1/2}$/mm² | `ASSUMPTION_ONLY` |
| $k_g$ | 0,8 | `LAB_CONSTANT_CONFIRMED` / `ASSUMPTION_ONLY` |
| $\cos\varphi$ | 0,9 | `SUGERIDA_COM_CONFIRMACAO` |
| $\delta_{fault}$ | 1 | `ASSUMPTION_ONLY` |

Ramos idênticos ⇒ $\delta_{load}=1$ (observado do L0) ⇒ $I_{adm}^{proxy}=n_p\,A_S\,k_g$. Nesta fixture a
**ampacidade é o critério vinculante** (queda e curto já atendem no $n_p$ mínimo de ampacidade), logo
$\text{minimumPassingBySection}(S)=\lceil I_b/(A_S\,k_g)\rceil$. Fixture **`ASSUMPTION_ONLY`** construída para
**realizar o exemplo vinculante do CEO** (5×300); **não** é dado normativo, comercial ou instalável.

### 9.5 Exemplo vinculante do CEO (D) — reproduzido

Fixture acima com **`maxParallelCount=7`**, seção 300 mm² (Análise 5):

| Candidata | $I_{adm}$ (A) | Atende? | Apresentação/impressão |
|---|---:|:---:|---|
| 4×300 | 1651,2 | **não** (AMPACIDADE) | — |
| **5×300** | 2064,0 | **sim** | **exibida (menor)** |
| 6×300 | 2476,8 | sim | **oculta** (permanece no bruto) |
| 7×300 | 2889,6 | sim | **oculta** (permanece no bruto) |

A apresentação e a impressão da seção 300 mostram **somente 5×300**; 6×300 e 7×300 **atendem** e **permanecem
no resultado bruto**, mas ficam **ocultas** (§9.7). A regra é exercida para **todas** as seções (§9.6).

### 9.6 Inventário por seção (reproduzido) — Análises 2–4 e 8

Contagens brutas: $|U(\text{maxP}=10)|=\mathbf{60}$; $|U(\text{maxP}=7)|=\mathbf{42}$.

| Seção (mm²) | $A\cdot k_g$ (A/paralelo) | Menor válida (limite 7) | Menor válida (limite 10) | $m^\star$ da menor exibida |
|---|---:|---|---|---:|
| 95 | 192,0 | — **nenhuma** (exigiria 10) | 10×95 | 0,066667 |
| 120 | 228,0 | — **nenhuma** (exigiria 8) | 8×120 | 0,013333 |
| 150 | 264,0 | 7×150 | 7×150 | 0,026667 |
| 185 | 304,0 | 6×185 | 6×185 | 0,013333 |
| 240 | 356,0 | 6×240 | 6×240 | 0,186667 |
| 300 | 412,8 | **5×300** | **5×300** | 0,146667 |

Com `maxParallelCount=7`, as seções **95 e 120 não têm candidata válida** dentro do limite → mensagem de
ausência (§9.10); com `maxParallelCount=10`, as seis seções têm menor válida. ($m^\star$ das seções 95/120
refere-se à candidata do limite 10.)

### 9.7 Retenção do envelope bruto e filtro só de apresentação (E) — Análises 5–6

O universo bruto permanece **inalterado** ($|U(7)|=42$); a apresentação filtrada tem **4** candidatas (uma por
seção válida): `[7×150, 6×185, 6×240, 5×300]`. As candidatas ocultas da seção 300 (`6×300, 7×300`) e todas as
demais combinações **continuam presentes** em `evaluatedCandidates`/resultado bruto — **nenhuma remoção**. O
filtro é uma **projeção de leitura**, não uma poda do motor.

### 9.8 Impacto nos quatro objetivos (E) — Análise 7

Os quatro objetivos **apenas reordenam o conjunto filtrado**; **nenhum** reintroduz candidata superior da mesma
seção nem transforma a saída em recomendação instalável (verificado no motor: **`TODAS as 4 ordens == gabarito`**;
`reintroduz superior? false`). `installableSelection: null`, `DISCRETE_SELECTION_BLOCKED`, `productionAllowed=false`.

**Default `maxParallelCount=10`** — `rawCount=60`, `filteredCount=6`, conjunto filtrado
`[10×95, 8×120, 7×150, 6×185, 6×240, 5×300]` (menor válida por seção; ordens **completas** vinculantes):

| Objetivo | Ordem completa (6 candidatas, default 10) |
|---|---|
| `NONE` | 5×300, 6×185, 6×240, 7×150, 8×120, 10×95 |
| `MIN_PARALLEL_COUNT` | 5×300, 6×240, 6×185, 7×150, 8×120, 10×95 |
| `MIN_TOTAL_COPPER` | 10×95, 8×120, 7×150, 6×185, 6×240, 5×300 |
| `MAX_MINIMUM_MARGIN` | 6×240, 5×300, 10×95, 7×150, 8×120, 6×185 |

**Reduzido `maxParallelCount=7`** — conjunto filtrado `[7×150, 6×185, 6×240, 5×300]` (95 e 120 sem candidata):

| Objetivo | Ordem (4 candidatas, limite 7) |
|---|---|
| `NONE` | 5×300, 6×185, 6×240, 7×150 |
| `MIN_PARALLEL_COUNT` | 5×300, 6×240, 6×185, 7×150 |
| `MIN_TOTAL_COPPER` | 7×150, 6×185, 6×240, 5×300 |
| `MAX_MINIMUM_MARGIN` | 6×240, 5×300, 7×150, 6×185 |

Nenhuma primeira posição é seleção/recomendação/instalação; nenhuma candidata superior da mesma seção
(6×300/7×300) é reintroduzida por qualquer objetivo.

### 9.9 Terminologia (F)

**Proibido na interface:** "recomendado", "selecionado", "ótimo para instalação", "dimensionamento final".
**Usar:** **"Menor quantidade que atende por seção no intervalo avaliado"**.

### 9.10 Localização PT/EN/ES (G)

**Todos** os textos visíveis acompanham o idioma selecionado. **Códigos técnicos, enums e identificadores
B-01…B-06 permanecem invariantes** (não traduzidos). O aviso preserva **significado, severidade e permanência**
nos três idiomas; a UI **não pode** ocultar a advertência (o valor bruto do motor pode permanecer rastreável).

| Texto visível | PT | EN | ES |
|---|---|---|---|
| Aviso permanente | PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO. | PRELIMINARY — DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION. | PRELIMINAR — NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN. |
| Instalação autorizada | Instalação autorizada: NÃO | Installation authorized: NO | Instalación autorizada: NO |
| Estado de produção | Estado de produção: BLOQUEADO | Production state: BLOCKED | Estado de producción: BLOQUEADO |
| Status da fonte | Fonte primária IEC integral: AUSENTE — sem conformidade IEC | Full primary IEC source: ABSENT — no IEC conformity | Fuente primaria IEC íntegra: AUSENTE — sin conformidad IEC |
| Hipóteses | Hipóteses (ASSUMPTION_ONLY) | Assumptions (ASSUMPTION_ONLY) | Hipótesis (ASSUMPTION_ONLY) |
| Bloqueadores | Bloqueadores | Blockers | Bloqueadores |
| Entradas confirmadas | Entradas confirmadas | Confirmed inputs | Entradas confirmadas |
| Título da apresentação | Menor quantidade que atende por seção no intervalo avaliado | Smallest quantity meeting the criteria per section within the evaluated range | Menor cantidad que cumple por sección en el intervalo evaluado |
| Critérios | Critérios: ampacidade, queda de tensão, curto-circuito | Criteria: ampacity, voltage drop, short-circuit | Criterios: ampacidad, caída de tensión, cortocircuito |
| Ausência de alternativa (seção S, limite N) | Nenhuma alternativa da seção S atende dentro do intervalo avaliado de 1 até N cabos por fase. | No alternative for section S meets the criteria within the evaluated range of 1 to N conductors per phase. | Ninguna alternativa de la sección S cumple dentro del intervalo evaluado de 1 a N conductores por fase. |
| Impressão | Impressão preliminar — não é memorial final | Preliminary print — not a final report | Impresión preliminar — no es memoria final |

**Invariantes (não traduzidos):** `productionAllowed`, `installableSelection`, `EXPERIMENTAL_PRELIMINAR_NAO_CANONICO`,
`LABORATORIO_APENAS`, `NONE`/`MIN_PARALLEL_COUNT`/`MIN_TOTAL_COPPER`/`MAX_MINIMUM_MARGIN`, `B-01…B-06`.

#### 9.10.1 Oráculo de vazamento linguístico por listas fechadas (O.S. 004-R2)

A detecção de vazamento PT/EN/ES **não** usa regra genérica ("qualquer texto PT em ES", "qualquer palavra
coincidente com PT", comparação parcial) — isso gera **falsos positivos** com cognatos. O vazamento é definido
**exclusivamente** por **listas fechadas** de expressões **completas e exclusivas** do idioma incorreto,
**determinísticas**, **sem** busca recursiva nem aproximação semântica. Três conjuntos de expressões exclusivas
(derivadas dos 11 grupos):

- **P (PT-exclusivas):** "NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO" · "Instalação autorizada: NÃO" ·
  "Estado de produção: BLOQUEADO" · "queda de tensão" · "cabos por fase" · "não é memorial final".
- **E (EN-exclusivas):** "DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION" · "Installation authorized: NO" ·
  "Production state: BLOCKED" · "voltage drop" · "conductors per phase" · "not a final report".
- **S (ES-exclusivas):** "NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN" · "Instalación autorizada: NO" ·
  "Estado de producción: BLOQUEADO" · "caída de tensión" · "conductores por fase" · "no es memoria final".

**Estrutura vinculante** `forbiddenExpressionsByLanguage`: `pt → { en: E, es: S }`; `en → { pt: P, es: S }`;
`es → { pt: P, en: E }`. Uma expressão sinaliza vazamento **se e somente se** pertencer à lista fechada do
idioma ativo — nunca por coincidência de palavra isolada.

**Cognatos legítimos em ES** (traduções espanholas válidas, **não** vazamento de português; **não** aparecem em
nenhuma lista): **`Bloqueadores`**, **`Entradas confirmadas`**, **`PRELIMINAR`**. São formas idênticas
compartilhadas por PT e ES e os termos vinculantes ratificados (Bloqueadores por O.S. 004-R1). **Não** se cria
exceção genérica; cada cognato é **nominal e justificado**.

**Comparação das 11 traduções atuais:** por **igualdade INTEGRAL UTF-8** — **sem** remoção de acentos, **sem**
case-insensitive quando o contrato exige forma exata, **sem** substring como substituta de igualdade, **sem**
tradução parcial.

**Restrição de NFD:** o NFD é permitido **somente** no **oráculo histórico de vocabulário proibido**
(`recomendado`/`selecionado`/`ótimo para instalação`/`dimensionamento final` — §9.9 e §7); **não** participa da
validação das 11 traduções atuais; **não** identifica vazamento entre PT/EN/ES. Os dois oráculos permanecem
**claramente separados e nominalmente identificados**.

### 9.11 Guardrails (H) — paths corretos, preservados e reproduzidos

Contrato do **envelope de seleção** (reproduzido no motor, default 10): **`result.ok = true`** (um **único**
booleano de nível de resultado) e **`result.data.evaluatedCandidates.length = 60`**. Para **cada** candidata
L1–L3:

- `result.data.evaluatedCandidates[*].productionAllowed = false`;
- `result.data.evaluatedCandidates[*].installableSelection = null`;
- `result.data.evaluatedCandidates[*].voltageDrop.actualPercent = número finito` (faixa reproduzida
  **0,7979 %–19,3320 %**).

**Não** se usa `voltageDropPercent` nem `voltageDropPercent=null` como expectativa das candidatas L1–L3. O
`voltageDropPercent=null` é **saída interna do L0** (o L0 **não conhece a tensão**; devolve $\Delta U$ em Volts)
e **não** se confunde com `evaluatedCandidates[*].voltageDrop.actualPercent`, que o L1 computa por
$\Delta U_{3\phi}/U_{LL}\cdot100$. Preservados `EXPERIMENTAL_PRELIMINAR_NAO_CANONICO`, `LABORATORIO_APENAS`,
`installationAuthorized=false`, **fonte primária integral AUSENTE**, **sem conformidade IEC**, **B-01…B-06**,
**nenhuma recomendação comercial ou autorização de instalação**. **PR #40 DO NOT MERGE.**

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
