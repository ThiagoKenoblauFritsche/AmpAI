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
nucleo_integrado: js/core_cabos_bt_parallel_experimental.js (contrato CAB-BT-PARALLEL-EXP-1, PR #39)
baseline_cientifica_do_nucleo: 18627dd02c94265984aa953d35f47c2745cab61d
worktree: tmp/worktrees/cab-bt-parallel-selection-prelim-sci
data: 2026-07-20
rnc_classe: RNC-P (Registro Normativo Computável Processado)
---

# RNC-P — Enumeração e comparação preliminar de cabos BT em paralelo · Registro

> **PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.**
> **RNC-P experimental de laboratório.** **NÃO** é RNC-C, **NÃO** é canônico, `productionAllowed=false`.
> Nenhuma alternativa é recomendação produtiva ou "conforme IEC". Norma primária IEC 60364-5-52 Ed. 3.1
> **AUSENTE**. **PR #40 DO NOT MERGE** (UI reprovada). Irmãos: [[cab-bt-parallel-selection-prelim-memorial]]
> · [[cab-bt-parallel-selection-prelim-bdd]]. Ciência-base: [[cab-bt-parallel-prelim-rnc-p]].

> **Nomenclatura (R1):** este pacote define **enumeração e comparação preliminar**, **não** uma "camada de
> seleção". Não há "alternativa preferencial" nem "solução instalável": há **alternativas candidatas
> ordenadas** por um **objetivo configurável** do usuário. O nome de arquivo mantém `SELECTION` por
> continuidade de rastreabilidade; o conteúdo é enumeração/comparação.

---

## 1. Propósito e relação com o núcleo integrado (PR #39)

A UI experimental (PR #40) foi reprovada por exigir variáveis que o usuário típico não tem e devolver
resultado matemático pouco útil. Este registro define a **enumeração e comparação preliminar** de
alternativas de cabos em paralelo (ex.: 2×240, 3×150) **sobre** o motor já integrado pela PR #39, **sem
alterá-lo nem reinterpretá-lo**.

**Núcleo integrado (imutável, não tocar):** `js/core_cabos_bt_parallel_experimental.js`, função
`calculateCablingBTParallelExperimental(input)`, contrato **`CAB-BT-PARALLEL-EXP-1`**, baseline científica
`18627dd…`. Função pura, Result Pattern (RFC 7807). Em sucesso: sempre `MATHEMATICAL_ONLY`,
`productionAllowed=false`, `displayNotice`, e blockers **B-01…B-06** + `ENGINEERING_ADEQUACY_BLOCKED` +
`DISCRETE_SELECTION_BLOCKED` + `IEC_CONFORMITY_BLOCKED` + `PRODUCTION_USE_BLOCKED`. A enumeração **não pode
contornar** nenhum blocker. O núcleo **não conhece a tensão** (ΔU em Volts; `voltageDropPercent: null`) e
**não seleciona quantidade** (`installableSelection: null`, `discreteSelectionBlocked: true`).

---

## 2. Estratos (Objetivo 1)

| Estrato | Responsabilidade | Onde vive |
|---|---|---|
| **L0 — núcleo de divisão por impedâncias** | admitâncias, $Z_{eq}$, correntes de ramo, $\delta_{load}$, proxy de capacidade, ΔU (V), adiabático por ramo | **PR #39 (imutável)** |
| **L1 — avaliação dos critérios** | ampacidade, queda (%), curto; margem e critério dominante por candidato | este pacote |
| **L2 — enumeração de candidatos** | combinações discretas $S\times n_p$ a partir de catálogo completo | este pacote |
| **L3 — comparação e ordenação** | fronteira não dominada + ordenação por **objetivo configurável** | este pacote |

L1/L2/L3 **preparam entradas** e **interpretam saídas** do L0; nunca recalculam sua física nem alteram seus
blockers.

**Universo vinculante (R2):** L2 forma o **produto cartesiano completo** $U=\text{catálogo}\times\{1,\dots,n_p^{max}\}$
e avalia **todas** as combinações — **proibidos** amostragem parcial, poda silenciosa e fronteira/objetivo
sobre subconjunto ilustrativo. Poda autorizada por entrada do usuário ocorre **antes** de formar $U$ e é
registrada nominalmente. A saída particiona $U$ deterministicamente:
**`evaluatedCandidates`** (todo $U$) = **`candidateAlternatives`** (válidas) ∪ **`rejectedCandidates`**
(reprovadas/bloqueadas); **`nonDominatedAlternatives`** ⊆ válidas; **`providedCombination`** quando o usuário
informa uma combinação. **Reconciliação obrigatória** das contagens. Preserva `installableSelection: null`,
`DISCRETE_SELECTION_BLOCKED`, `productionAllowed=false`. Exemplo-base: $|U|=5\times4=20$ → **20** avaliadas,
**11** válidas, **9** rejeitadas, **11** não dominadas (Memorial §6.0).

---

## 3. Taxonomia de entradas (Objetivo 2)

Classes: `INFORMADA_PELO_USUARIO` · `OBTIDA_DE_CATALOGO` · `SUGERIDA_COM_CONFIRMACAO` · `ASSUMPTION_ONLY`
· `AUSENTE_BLOQUEANTE`.

| Entrada | Classe | Consumidor | Observação |
|---|---|---|---|
| Corrente de projeto $I_b$ | `INFORMADA_PELO_USUARIO` | L0 | — |
| Tensão $U_{LL}$ | `INFORMADA_PELO_USUARIO` | **L1** (ΔU %) | L0 não usa tensão |
| Material, isolação, método de instalação | `INFORMADA_PELO_USUARIO` | L2 (metadados do candidato) | **não derivam** valores (§4) |
| Temperatura ambiente / de referência | `SUGERIDA_COM_CONFIRMACAO` | L2 | default editável e confirmado |
| Comprimento $L$ | `INFORMADA_PELO_USUARIO` | L2 | — |
| Fator de potência $\cos\varphi$ | `SUGERIDA_COM_CONFIRMACAO` | L0 | confirmado |
| Queda de tensão máxima $\Delta U_{max}$ | `INFORMADA_PELO_USUARIO` | **L1** | escolha do usuário, **NÃO limite IEC** |
| Corrente $I_k$ e duração $t$ do curto | `INFORMADA_PELO_USUARIO` | L0 | — |
| Catálogo de seções (com schema §5) | `OBTIDA_DE_CATALOGO` | L2 | modos §6 |
| Seção máxima preferencial | `SUGERIDA_COM_CONFIRMACAO` | L2 (poda) | — |
| Quantidade máx. preliminar de cabos/fase | `INFORMADA_PELO_USUARIO` | L2 (poda) | excesso → rejeição L2 |
| Geometria/arranjo | `INFORMADA_PELO_USUARIO` **ou** `AUSENTE_BLOQUEANTE` | L0 + L2 | ausente ⇒ modo guiado (§9) |
| Circuitos agrupados $n_c$ | `INFORMADA_PELO_USUARIO` | L0 + $k_g$ | **≠ $n_p$**; mapa → $k_g$ **BLOQUEADO** (B-02) |
| Objetivo de ordenação | `INFORMADA_PELO_USUARIO` | L3 | preferência de usuário/produto, **nunca IEC** (§8) |

**Inferência silenciosa proibida (Objetivo 3):** todo valor `SUGERIDA_COM_CONFIRMACAO` deve, antes do
cálculo, **aparecer** com classe, **indicar fonte ou `ASSUMPTION_ONLY`**, ser **editável**, exigir
**confirmação** e **jamais** ser apresentado como IEC. Não confirmado ⇒ `AUSENTE_BLOQUEANTE` (bloqueia).

---

## 4. Fator de agrupamento $k_g$ — três modos determinísticos (Objetivo 1)

O núcleo consome `capacityProxy.groupingFactor` (`ASSUMPTION_ONLY`). A enumeração define **como** esse
$k_g$ é obtido, **por candidato**:

| Modo | Definição | Bloqueio |
|---|---|---|
| **`CANDIDATE_SPECIFIC`** | cada candidato tem seu $k_g$, com **fonte, versão, método, arranjo, $n_p$ e $n_c$** identificados | campo faltante bloqueia o candidato |
| **`GROUPING_MATRIX`** | $k_g = k_g(n_p, n_c, \text{método}, \text{arranjo})$ obtido de **matriz explícita** com fonte e proveniência | **combinação ausente na matriz bloqueia o candidato** |
| **`LAB_CONSTANT_CONFIRMED`** | **constante única** apenas como `ASSUMPTION_ONLY`, **confirmada explicitamente** antes do cálculo | válido **só para sensibilidade laboratorial**; **não** sustenta preferência instalável nem comparação dita "prática" |

> Os exemplos deste pacote usam $k_g=0{,}8$ declarado nominalmente **`LAB_CONSTANT_CONFIRMED` /
> `ASSUMPTION_ONLY`**. Enquanto as notas de B.52.17 estiverem ausentes (B-02), `GROUPING_MATRIX` com fonte
> IEC é **indisponível**.

---

## 5. Proibição de derivações sem modelo + schema de candidato (Objetivos 4 e 2)

**Proibido** afirmar que material, isolação ou método, isoladamente, **"derivam"** $R$, $X$, ampacidade,
$k$ ou $k_g$. Até existir tabela/modelo ratificado, esses valores são **entradas do catálogo**, **entradas
técnicas do usuário** ou **`ASSUMPTION_ONLY` confirmado** — nunca deduzidos silenciosamente.

**Modelo laboratorial de impedância** (usado só nos exemplos, `ASSUMPTION_ONLY`):

$$\underline{Z}(S) = \frac{2{,}25}{S} + j\,0{,}008\ \Omega, \qquad
\text{2,25 tem unidade } \Omega\cdot\text{mm}^2 \;(=\rho L,\ \rho=0{,}0225\ \Omega\cdot\text{mm}^2/\text{m},\ L_{ref}=100\ \text{m}).$$

- **Natureza:** placeholder de **laboratório**; $X=0{,}008\ \Omega$ é reatância assumida plana.
- **Comprimento de referência:** $L_{ref}=100$ m; outra extensão exige $\times (L/100)$ **explícito**.
- **Sem validade normativa**; **proibida** extrapolação silenciosa a outras seções, comprimentos,
  materiais ou geometrias.

**Schema de cada candidato de catálogo.** **Dez campos escalares obrigatórios** — exigidos
**independentemente** da representação de impedância:

`section_mm2`, `tabulatedAmpacity_A`, `material`, `insulation`, `installationMethod`, `referenceTemperature`,
`units`, `source`, `sourceVersion`, `provenance`.

Mais **exatamente uma** representação de impedância:

- **A. `IMPEDANCE_COMPLEX`** — `impedance_ohm: { re: finito, im: finito }`; `resistance_ohm` e `reactance_ohm`
  **omitidos**; `impedance_ohm.re` e `impedance_ohm.im` **obrigatórios**.
- **B. `RESISTANCE_REACTANCE_PAIR`** — `resistance_ohm: finito` e `reactance_ohm: finito` **conjuntamente
  obrigatórios**; `impedance_ohm` **omitido**.

**Presença por existência da propriedade** (independe de valor, tipo, finitude, completude e ordem):
`hasImpedance` = existe `impedance_ohm`; `hasResistance` = existe `resistance_ohm`; `hasReactance` = existe
`reactance_ohm`.

**Precedência vinculante (nesta ordem exata):**

- **A. Conflito estrutural (primeiro, por presença):** se `hasImpedance` **e** (`hasResistance` **ou**
  `hasReactance`) → **imediatamente** **`CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT`**, **antes** de validar
  completude de qualquer representação, tipos ou finitude. Nenhuma propriedade da segunda representação é
  ignorada.
- **B. Somente impedance:** `hasImpedance` e **não** `hasResistance` e **não** `hasReactance` → valida
  **`IMPEDANCE_COMPLEX`**.
- **C. Somente R/X iniciada:** **não** `hasImpedance` e (`hasResistance` **ou** `hasReactance`) → valida
  **`RESISTANCE_REACTANCE_PAIR`**.
- **D. Nenhuma representação:** nenhum dos três campos existe → **`CANDIDATE_INCOMPLETE`**
  (`missingFields=["impedanceRepresentation"]`).

**Casos de conflito** (todos → `CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT`, exclusivamente; ordem das
propriedades irrelevante): impedance completo + só resistance; + só reactance; impedance incompleto + R e X;
incompleto + só resistance; incompleto + só reactance; completo + R e X; impedance **inválido** + qualquer R
ou X.

**Ausente vs. inválido (distinção vinculante):**
- **Ausente** — a propriedade **não existe** → **`CANDIDATE_INCOMPLETE`** com **`missingFields[]`**.
- **Inválido** — a propriedade **existe** mas o tipo/valor é inválido, numa **representação única** (sem
  conflito) → **`CANDIDATE_IMPEDANCE_VALUE_INVALID`** com **`invalidFields[]`** — **nunca**
  `CANDIDATE_INCOMPLETE`, **nunca** fallback à outra representação, **nunca** coerção silenciosa.
- Exemplos: `impedance_ohm` sem `re` → ausente/incompleto; `impedance_ohm` com `re: null` →
  presente/**inválido**; só `resistance_ohm` (sem `reactance_ohm`) → `reactance_ohm` ausente/incompleto;
  `resistance_ohm: "0.015"` → presente/**inválido** (string **não** convertida em número).

**`CANDIDATE_IMPEDANCE_VALUE_INVALID` — estrutura do erro:**
`{ code: "CANDIDATE_IMPEDANCE_VALUE_INVALID", candidateId, invalidFields: [ { path, reason, observedType } ], mode }`.
`reason` determinístico: **`NOT_SIMPLE_OBJECT`** (impedance_ohm não é objeto simples); **`NOT_NUMBER`**
(re/im/R/X é string, booleano, objeto/array ou null); **`NON_FINITE`** (NaN, +Infinity, −Infinity). Regras:
**nenhum número utilizável**; **não** retorna impedância parcial; **não** altera valores; **não** converte
string numérica em number.

**Ordem canônica de `missingFields[]`** (coletar todos os ausentes aplicáveis, remover duplicidades, ordenar
**sempre** por esta lista — a ordem de entrada não interfere; mesma entrada semântica em ordens diferentes
gera resultado idêntico): `section_mm2` (1) · `tabulatedAmpacity_A` (2) · `material` (3) · `insulation` (4)
· `installationMethod` (5) · `referenceTemperature` (6) · `units` (7) · `source` (8) · `sourceVersion` (9)
· `provenance` (10) · `impedanceRepresentation` (11) · `impedance_ohm.re` (12) · `impedance_ohm.im` (13) ·
`resistance_ohm` (14) · `reactance_ohm` (15).

**Ordem canônica de `invalidFields[]`** (registrar todos, remover duplicidades, ordenar por esta lista;
independente da ordem de entrada): `impedance_ohm` (1) · `impedance_ohm.re` (2) · `impedance_ohm.im` (3) ·
`resistance_ohm` (4) · `reactance_ohm` (5).

**Regras adicionais:**
- ausência de **campo escalar obrigatório** ou de componente exigido pela representação → `CANDIDATE_INCOMPLETE`
  (`candidateId`, `missingFields[]` canônico, `mode`, `provenance` observada);
- **nenhuma normalização inventa componente ausente**; `impedance_ohm` **incompleto não cai** para R/X;
- ausência de **metadados globais indispensáveis** (tensão, $I_b$, $I_k$, $t$, objetivo-modo) →
  **`GLOBAL_METADATA_MISSING`**; **catálogo sem candidato completo** → **`CATALOG_NO_EVALUABLE_CANDIDATE`**.

---

## 6. Modos de catálogo determinísticos (Objetivo 3)

Transição única por modo (sem "bloqueia ou permanece matemática/preliminar"):

| Modo | Regra determinística |
|---|---|
| **`CATALOGO_FORNECIDO_PELO_USUARIO`** | avalia candidatos **completos**; rejeita **nominalmente** os incompletos (`CANDIDATE_INCOMPLETE`); **bloqueia o cálculo** se nenhum candidato completo existir (`CATALOG_NO_EVALUABLE_CANDIDATE`) |
| **`CATALOGO_SECUNDARIO_IDENTIFICADO`** | exige **fonte, versão e proveniência**; resultado **sempre `MATHEMATICAL_ONLY`**; ausência de rastreabilidade **bloqueia** (`CATALOG_TRACEABILITY_MISSING`) |
| **`CATALOGO_LAB_ASSUMPTION_ONLY`** | exige **schema completo** e **confirmação explícita**; resultado **sempre `MATHEMATICAL_ONLY`**; ausência de confirmação ou campo obrigatório **bloqueia** (`CATALOG_CONFIRMATION_MISSING` / `CANDIDATE_INCOMPLETE`) |

Nenhum modo produz seleção instalável; todos preservam `productionAllowed=false`.

---

## 7. Condições físicas do paralelismo (preservadas)

- **Condição matemática vinculante** de compartilhamento uniforme: $\underline{Z}_1=\dots=\underline{Z}_{n_p}$.
  Mesma seção, material, isolação, comprimento e **arranjo/terminações compatíveis** são **controles físicos
  suficientes/usuais**, não condições necessárias.
- **`nParallel` ≠ `nCircuits`**: $n_p$ elétrico; $n_c$ térmico ($k_g$, §4). Mapa $n_p\!\to\!n_c$ **BLOQUEADO** (B-02).
- **$\delta_{load}$ separado de $\delta_{fault}$** (núcleo). Impacto da geometria e situações que exigem
  impedâncias explícitas: modo avançado (§9). Sem geometria **e** sem `branches[]` → núcleo bloqueia
  (`GEOMETRY_AND_IMPEDANCE_MISSING`).

---

## 8. Objetivo configurável e ausência de preferência universal (Objetivos 5 e 7)

**Não há preferência universal.** A comparação retorna a **fronteira não dominada** (§Memorial) e ordena
por um **objetivo** — preferência do usuário/produto, **nunca IEC**:

| Objetivo | Sentido |
|---|---|
| `NONE` | nenhuma eleição; apresentação determinística sem escolher |
| `MIN_PARALLEL_COUNT` | menos cabos em paralelo primeiro |
| `MIN_TOTAL_COPPER` | menor cobre total primeiro |
| `MAX_MINIMUM_MARGIN` | maior margem vinculante primeiro |

Regras: **ausência de objetivo não elege candidata**; ordenação fixa existe **apenas** para apresentação
determinística; **o objetivo não transforma candidata em seleção instalável**. Exemplo sobre o universo
completo de 11 válidas (Memorial §5/§6.0): `NONE` → 2×185 (só apresentação, nada eleito);
`MIN_PARALLEL_COUNT` → 2×240 primeiro (empate $n_p=2$ desempatado por margem, 2×240 antes de 2×185);
`MIN_TOTAL_COPPER` → **3×120** primeiro (360 mm²); `MAX_MINIMUM_MARGIN` → 4×240 primeiro; **nenhuma** é
"solução IEC" ou instalável.

---

## 9. Dois modos de uso (Objetivo 8)

- **`MODO_GUIADO_PRELIMINAR`**: impedâncias **idênticas** permitidas como **hipótese**, exigindo
  (a) **apresentação da hipótese antes do cálculo**, (b) **confirmação explícita**, (c)
  `provenance=ASSUMPTION_ONLY`, (d) **`deltaLoad=1` produzido pelo L0** (observado, **não** fixado pela
  camada), (e) `ENGINEERING_ADEQUACY_BLOCKED`, (f) **nenhuma** alegação de adequação. **Sem confirmação,
  bloqueia deterministicamente** (`GUIDED_HYPOTHESIS_UNCONFIRMED`).
- **`MODO_AVANCADO`**: `branches[]` explícitos, geometria descrita, $k_g$ (§4) e catálogo técnicos;
  $\delta_{load}$ real; ainda `productionAllowed=false`.

---

## 10. Fontes com rastreabilidade durável (Objetivo 11)

| Item | Publicação/arquivo | Edição | Cláusula/pág. | URL/arquivo | Acesso | SHA-256 | Classe |
|---|---|---|---|---|---|---|---|
| Núcleo de cálculo | `js/core_cabos_bt_parallel_experimental.js` | PR #39 | — | repo (baseline 83e2413) | 2026-07-20 | blob no repo | integrado, imutável |
| Ciência-base | `_PARALLEL_PRELIM` (RNC-P/Memorial/BDD) | R2-F1 | — | repo (commit 18627dd) | 2026-07-20 | `18627dd…` | RNC-P experimental |
| Estrutura IEC 60364-5-52 | preview oficial Ed. 3.0 | 3.0 | 523.7/B.52.17/Anexo H | webstore.iec.ch/publication/1878 | 2026-07-19 | `FBB2EF5E…672951FE` (cache) | primária-parcial |
| Persistência Ed. 3.1 | preview ANSI (verif. @CTO) | 3.1 | idem | webstore.ansi.org (403 a mim) | 2026-07-19 | — | primária-parcial autorizada |
| Catálogo/ampacidade/$Z$/$k_g$/$k$ dos exemplos | **laboratório** | — | — | — | 2026-07-20 | — | **`ASSUMPTION_ONLY`** |

**Fonte integral IEC AUSENTE. Não se declara conformidade IEC.**

---

## 11. Guardrails e bloqueios (Objetivo 12)

- **B-01…B-06** preservados (propagados pelo núcleo); + `ENGINEERING_ADEQUACY_BLOCKED`,
  `DISCRETE_SELECTION_BLOCKED`, `IEC_CONFORMITY_BLOCKED`, `PRODUCTION_USE_BLOCKED`.
- `EXPERIMENTAL_PRELIMINAR_NAO_CANONICO`, `LABORATORIO_APENAS`, `productionAllowed=false`, **nenhuma
  recomendação produtiva**, **nenhum RNC-C**, aviso permanente **"PRELIMINAR — NÃO UTILIZAR PARA PROJETO,
  COMPRA OU INSTALAÇÃO"**, **L0 da PR #39 imutável**, **PR #40 DO NOT MERGE**.
- Tolerância **±0,5 % relativo** (`TOLERANCIA_COMPUTACIONAL_LAB_AMPAI`) é **política computacional AmpAI**,
  não normativa IEC. Matriz preliminar × produção: [[cab-bt-parallel-selection-prelim-memorial]] §8.
