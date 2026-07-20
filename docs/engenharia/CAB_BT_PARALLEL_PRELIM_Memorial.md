---
status: EXPERIMENTAL_PRELIMINAR_NAO_CANONICO
uso: LABORATORIO_APENAS
proibido_para: PROJETO_COMPRA_INSTALACAO_MEMORIAL_FINAL
fonte_primaria_completa: AUSENTE
estado_producao: BLOQUEADO
os: CAB-BT-PARALLEL-001-SCI-PRELIM
classe: CHG-3 científica experimental
persona: "@Engenheiro_Eletricista"
baseline: origin/main@006a56c4d2412d83548129b24aac10a4692dc4fa
worktree: tmp/worktrees/cab-bt-parallel-prelim-sci
data: 2026-07-19
---

# Memorial preliminar — Múltiplos condutores em paralelo por fase (BT)

> **LABORATÓRIO APENAS.** Toda conclusão numérica abaixo é **física de teoria de circuitos** ou
> **hipótese `ASSUMPTION_ONLY`**. **Nenhum** resultado é "conforme IEC". Norma primária **AUSENTE**.
> Proibido para projeto, compra, instalação ou memorial final. Fontes e lacunas em
> [[cab-bt-parallel-prelim-rnc-p]]; cenários em [[cab-bt-parallel-prelim-bdd]].

Unidades: **SI** (mm², m, A, V, Ω, s). ANSI/NEC **proibido**. Equações em LaTeX; todas as substituições
numéricas são reproduzíveis pelo script do Apêndice A (executado; saídas transcritas verbatim).

---

## 0. Escopo e não-objetivos

**Escopo:** a física de $n_p$ condutores idênticos-por-projeto em paralelo por fase, entre dois nós
comuns (barra→barra), em BT (≤ 1 kV). **Não-objetivos:** fixar $k_g$, limites de $n_p$, limite de ΔU,
constante $k$, contagem de circuitos ou qualquer conformidade — todos **BLOQUEADOS** (RNC-P §3.6).

Convenções: $n_p$ = condutores em paralelo por fase; $n_c$ = circuitos agrupados; $\underline{Z}_i=R_i+jX_i$
= impedância **total** do ramo $i$ (já ×comprimento), Ω; $\underline{Y}_i=1/\underline{Z}_i$, S.

### 0.1 Tolerância computacional de laboratório

Todo valor precedido de "≈"/"aproximadamente" e **todo resultado reproduzível** deste memorial está sujeito
à **`TOLERANCIA_COMPUTACIONAL_LAB_AMPAI` = ±0,5 % relativo** (determinística). Ela cobre arredondamento e
diferença de ponto flutuante entre execuções; **NÃO** é tolerância normativa IEC e **não** implica
aceitação de engenharia. A mesma tolerância aplica-se aos cenários do BDD irmão e à tabela do Apêndice A.

---

## 1. Modelo de circuito

$n_p$ ramos ligados aos **mesmos dois nós** (mesma fase, da barra à carga) partilham a mesma tensão
complexa $\underline{V}$ entre nós. Por Kirchhoff:

$$\underline{I}_i = \underline{V}\,\underline{Y}_i, \qquad
\underline{I}_{tot} = \sum_{k=1}^{n_p}\underline{I}_k = \underline{V}\sum_{k=1}^{n_p}\underline{Y}_k .$$

**Checagem dimensional:** $[\underline{Y}]=\Omega^{-1}=\text{S}$; $[\underline{V}\cdot\underline{Y}]=\text{V·S}=\text{A}$. ✔

---

## 2. Divisão de corrente por admitâncias (Lei L-01)

Eliminando $\underline{V}$:

$$\boxed{\;\underline{I}_i = \underline{I}_{tot}\,\dfrac{\underline{Y}_i}{\sum_{k}\underline{Y}_k}
= \underline{I}_{tot}\,\dfrac{\underline{Z}_{eq}}{\underline{Z}_i}\;},
\qquad \underline{Z}_{eq}=\Big(\sum_k \underline{Y}_k\Big)^{-1}.$$

Define-se a **fração de ramo** $\underline{f}_i=\underline{I}_i/\underline{I}_{tot}=\underline{Y}_i/\sum_k\underline{Y}_k$.

**Duas checagens contestáveis (independentes de valores):**

$$\sum_i \underline{f}_i = 1 \;\;(\text{exato, soma complexa}); \qquad
\sum_i |\underline{f}_i| \ge 1 \;\;(\text{desigualdade triangular}).$$

A igualdade $\sum|\underline{f}_i|=1$ vale **se e só se** todos os $\underline{f}_i$ têm a mesma fase —
ou seja, quando não há assimetria de **ângulo** de impedância. O excesso $\sum|\underline{f}_i|-1>0$ é,
portanto, uma **medida direta de desbalanço** — e é exatamente o que se observa no Exemplo 3 (§5.3).

---

## 3. Compartilhamento ideal (Lei L-02)

Se $\underline{Z}_1=\dots=\underline{Z}_{n_p}=\underline{Z}$, então $\underline{f}_i=1/n_p$ e

$$\underline{I}_i = \underline{I}_{tot}/n_p, \qquad \underline{Z}_{eq}=\underline{Z}/n_p .$$

**Condição matemática vinculante** para compartilhamento uniforme (segue diretamente de L-01):

$$\boxed{\;\underline{Z}_1=\underline{Z}_2=\dots=\underline{Z}_{n_p}\;}\;\;\Longleftrightarrow\;\;\underline{f}_i=\tfrac{1}{n_p}\ \forall i.$$

Esta é a **única** condição necessária e suficiente. Os itens físicos abaixo — mesmo comprimento, seção,
material e geometria/posição — são **controles físicos suficientes e usualmente empregados** para
*realizar* $\underline{Z}_i$ iguais, **não** condições matematicamente necessárias (duas vias com $L$, $S$
ou geometria distintos poderiam, em princípio, ter $\underline{Z}$ coincidente):

| Controle físico | Efeito sobre $\underline{Z}$ |
|---|---|
| mesmo comprimento | $R,X \propto L$ |
| mesma seção e material | $R=\rho L/S$ |
| mesma isolação | temperatura de operação → $\rho(\theta)$ |
| mesma geometria/posição relativa | $X$ (indutância própria+mútua, função do arranjo) |

> **A geometria/posição é o controle que os guias secundários omitem.** Duas vias fisicamente idênticas em
> **posições** diferentes têm $X$ diferentes e **não** compartilham igualmente. O **Anexo H** (informativo,
> RNC-P P-03) **ilustra** essa relevância técnica — mas, por ser **informativo**, **não estabelece por si
> obrigação normativa**; obrigatoriedade e limites dependem do texto de **523.7** (AUSENTE). Declarar os
> quatro controles físicos como lista normativa completa é **proibido pela O.S.**

---

## 4. Assimetria e ramo mais carregado (Leis L-03, L-04)

Com $\underline{Z}_i$ não idênticos, $|\underline{f}_i|$ variam. Em **regime de carga**, define-se o
**fator de desbalanço** $\delta_{load}$ do ramo mais carregado:

$$\boxed{\;\delta_{load} \;=\; \dfrac{I_{max}}{I_{tot}/n_p} \;=\; n_p\,\max_i|\underline{f}_i|
\;=\; n_p\,\dfrac{|\underline{Y}_{max}|}{\big|\sum_k \underline{Y}_k\big|}\;}\;\;(\delta_{load}\ge 1).$$

**Critério conservador de carga (L-04):** cada ramo deve suportar $I_{max}=\delta_{load}\,(I_{tot}/n_p)$,
**não** $I_{tot}/n_p$. A **ampacidade útil do conjunto** cai:

$$I_{tot}^{adm} = n_p\,I_z\big/\delta_{load} \;=\; (n_p\,I_z)\cdot\underbrace{(1/\delta_{load})}_{\text{derate}} .$$

Interpretação: a assimetria "rouba" capacidade — o conjunto **não** entrega $n_p\,I_z$, mas
$n_p\,I_z/\delta_{load}$. Isto motiva fisicamente os arranjos simétricos (trifólio, transposição) que o
**Anexo H (informativo)** ilustra.

> **$\delta_{load}$ é grandeza de regime de carga.** É **proibido** reutilizá-la no cálculo de
> curto-circuito (§8): a distribuição da corrente de falta depende da **localização da falta** e das
> impedâncias vigentes **durante o curto** — em geral incluindo a impedância da fonte e a topologia no
> ponto de falta, que **podem** alterar a partilha em relação ao regime de carga. As admitâncias relevantes
> **não** são, em geral, as mesmas do regime de carga — ver $\delta_{fault}$ em §8. A partilha de carga
> **não prova** a partilha de falta.

---

## 5. Exemplos reproduzíveis (números verificados pelo motor — Apêndice A)

> Impedâncias de ramo são **`ASSUMPTION_ONLY` (AO-1)**: arbitradas para isolar o efeito. Apenas o
> **espalhamento relativo** governa $\delta_{load}$; os valores absolutos não pretendem representar catálogo.

### 5.1 Exemplo 1 — Compartilhamento ideal (sanidade)

$n_p=3$, $\underline{Z}_i=0{,}020+j0{,}024\ \Omega$ (idênticos), $I_{tot}=900\ \text{A}$.

| Ramo | $I_i$ (A) | $|\underline{f}_i|$ |
|---|---|---|
| 1–3 | 300,00 | 0,3333 |

$\underline{Z}_{eq}=0{,}006667+j0{,}008000\ \Omega=\underline{Z}/3$ ✔ · $\delta_{load}=1{,}0000$ · derate $=1{,}0000$ ·
$\sum\underline{f}_i=1{,}000000+0j$ · $\sum|\underline{f}_i|=1{,}000000$. **Sanidade OK.**

### 5.2 Exemplo 2 — Assimetria resistiva (comprimento +5 %, R puro)

$n_p=3$; $R_1=1{,}05R$, $R_2=R_3=R$ com $R=0{,}020\ \Omega$; $X$ desprezado; $I_{tot}=900\ \text{A}$.

| Ramo | $Z$ (Ω) | $I_i$ (A) | $|\underline{f}_i|$ |
|---|---|---|---|
| 1 (mais longo) | 0,02100 | **290,32** | 0,3226 |
| 2, 3 | 0,02000 | **304,84** | 0,3387 |

Espalhamento $4{,}8\%$ · $\delta_{load}=1{,}0161$ (**+1,6 %**) · derate $0{,}9841$. **Os ramos mais curtos
conduzem mais.** No **experimento executado**, uma assimetria de 5 % em comprimento (R puro, $X=0$)
produziu $\delta_{load}-1 = 0{,}0161$. Nenhuma generalização de "ordem" é feita — ver a comparação
normalizada em §5.4.

### 5.3 Exemplo 3 — Assimetria de reatância / posição (o caso que importa)

$n_p=4$; $R=0{,}020\ \Omega$ em todos; reatâncias com espalhamento $\pm25\%$ em torno de $0{,}024$:
$X=\{0{,}030;\,0{,}024;\,0{,}024;\,0{,}018\}\ \Omega$; $I_{tot}=1200\ \text{A}$.

| Ramo | $Z$ (Ω) | $I_i$ (A) | $|\underline{f}_i|$ |
|---|---|---|---|
| 1 ($X$ alto) | 0,020+0,030j | 259,20 | 0,2160 |
| 2, 3 | 0,020+0,024j | 299,15 | 0,2493 |
| 4 ($X$ baixo) | 0,020+0,018j | **347,33** | 0,2894 |

$\underline{Z}_{eq}=0{,}005095+j0{,}005891\ \Omega$ · espalhamento **29,4 %** · $\delta_{load}=1{,}1578$
(**+15,8 %**) · derate **0,8637** (perde **13,6 %** de $n_p I_z$).

**Prova contestável:** $\sum\underline{f}_i=1{,}000000+0j$ (exato), porém
$\sum|\underline{f}_i|=1{,}004026>1$ — a assimetria é **real** (frações com fases distintas), não
arredondamento. Um espalhamento de reatância de ±25 % produziu $\delta_{load}-1=0{,}1578$ (**+15,8 %**) de
sobrecarga no ramo pior. A comparação normalizada com o Exemplo 2 está em §5.4; **nenhuma dominância
universal é afirmada**.

### 5.4 Sensibilidade normalizada X vs R — conclusão do experimento (não é lei universal)

Comparando **apenas** os dois experimentos executados, com a sensibilidade normalizada
$S = (\delta_{load}-1)/\text{incremento relativo}$:

| Experimento | incremento relativo | $\delta_{load}-1$ | $S$ |
|---|---|---|---|
| Ex. 2 — em $R$ | 0,05 (5 %) | 0,016129 | 0,322581 |
| Ex. 3 — em $X$ | 0,25 (25 %) | 0,157768 | 0,631073 |

$$\frac{S_X}{S_R} = \frac{0{,}631073}{0{,}322581} \approx \mathbf{1{,}96}\quad(\text{valor exato do motor: }1{,}9563).$$

**No experimento executado**, a sensibilidade normalizada ao incremento escolhido de $X$ foi ≈ **1,96×** a
sensibilidade ao incremento escolhido de $R$. **Isto NÃO demonstra dominância universal:** os dois casos
diferem em $n_p$ (3 vs 4), em ser perturbação de um ramo vs espalhamento completo, e o Exemplo 2 usa
$X=0$. É observação pontual, sujeita à `TOLERANCIA_COMPUTACIONAL_LAB_AMPAI` (§0.1).

---

## 6. Sensibilidade ao fator de agrupamento $k_g$ (AO-2)

$k_g$ é **`ASSUMPTION_ONLY`** (RNC-P B-02). Com $I_{z,corr}=I_{z,tab}\cdot k_g$ e critério ideal
$n_{p,min}=I_b/I_{z,corr}$; aqui $I_{z,tab}=344\ \text{A}$ (AO-4), $I_b=820\ \text{A}$:

| $k_g$ | $I_{z,corr}$ (A) | $n_{p,min}$ (ideal) | cobre relativo |
|---|---|---|---|
| 1,00 | 344,0 | 2,384 | 1,00× |
| 0,85 | 292,4 | 2,804 | 1,18× |
| 0,70 | 240,8 | 3,405 | 1,43× |
| 0,50 | 172,0 | 4,767 | 2,00× |

**O resultado é altamente sensível a $k_g$:** cair de 1,00 para 0,70 exige **+43 %** de cobre; para 0,50,
**+100 %**. Isso **por si só** justifica o bloqueio B-02: adotar um $k_g$ secundário errado erra o
dimensionamento em dezenas de porcento. A dependência é exatamente $\text{cobre}\propto 1/k_g$.

> **Classificação (O.S. R2):** os $n_{p,min}$ **contínuos** e os percentuais de "cobre adicional" acima são
> **análise matemática de sensibilidade**, **não** quantidade instalável. A **seleção real é discreta** —
> $n_p\in\mathbb{Z}_{\ge 1}$ e seções da série IEC 60228 — e permanece **BLOQUEADA** (exige a norma, B-02).
> Nenhum $n_{p,min}$ fracionário representa cabo instalável.

---

## 7. Queda de tensão do conjunto (Lei L-05)

Trifásico, com $\underline{Z}_{eq}=R_{eq}+jX_{eq}$ do conjunto:

$$\Delta U_{3\phi} \approx \sqrt{3}\,I_{tot}\,(R_{eq}\cos\varphi + X_{eq}\sin\varphi).$$

$I_{tot}=900\ \text{A}$, $\cos\varphi=0{,}90$ ($\sin\varphi=0{,}4359$).

Dados de origem (todos `ASSUMPTION_ONLY`, AO-1): **3× idênticos** $\underline{Z}=0{,}020+j0{,}024\ \Omega$;
**3× assimétricos** $\underline{Z}_1=0{,}020+j0{,}030$, $\underline{Z}_2=0{,}020+j0{,}024$,
$\underline{Z}_3=0{,}020+j0{,}018\ \Omega$; $\underline{Z}_{eq}=(\sum_k\underline{Y}_k)^{-1}$.

| Caso | $\underline{Z}_{eq}$ (Ω) | $\Delta U$ (V) |
|---|---|---|
| 3× idênticos | 0,006667+0,008000j | **14,789** |
| 3× assimétricos (Z acima) | 0,006833+0,007805j | 14,890 |
| 1 ramo só (0,020+0,024j) | — | 44,367 |

**Checagem $1/n_p$:** $44{,}367/3=14{,}789$ V — bate com o caso idêntico ✔. A assimetria eleva levemente
$\Delta U$ (14,890 vs 14,789). $\underline{Z}_{eq}$ e $\Delta U$ são **reproduzíveis exclusivamente a
partir dos dados de origem acima**. **Nota:** o **limite** de ΔU (conteúdo a adquirir — Anexo G, B-05) está
**ausente**; aqui só se calcula o **valor físico**, nunca a aprovação/reprovação. (Sem classificação
normativo/informativo do Anexo G — não sustentada pela preview.)

---

## 8. Curto-circuito adiabático por ramo (Lei L-06 + hipótese H-02)

Por condutor: $S \ge I_k\sqrt{t}/k$, com $I_k$ = corrente de falta **do ramo** e $S$ em mm². A constante
$k$ tem **dimensão $\text{A}\cdot\text{s}^{1/2}/\text{mm}^2$**; adota-se
$k=115\ \text{A}\,\text{s}^{1/2}/\text{mm}^2$ como **`ASSUMPTION_ONLY` (AO-3)** — origem IEC 60364-4-43 /
-5-54, **ausentes** (B-03).

> **Regra dura (O.S. R1):** o fator de partilha de falta **$\delta_{fault}$ é independente de
> $\delta_{load}$** (§4). É **proibido** (i) aplicar $\delta_{load}$ automaticamente ao curto, (ii)
> presumir que as admitâncias relevantes são iguais nos dois regimes e (iii) usar a divisão de carga como
> prova da divisão de falta. O adiabático preliminar aceita **somente** um destes três modos:
> **(a)** $\delta_{fault}$ fornecido explicitamente como `ASSUMPTION_ONLY` (AO-6);
> **(b)** **cenário extremo conservador** identificado (um único ramo conduz a falta total);
> **(c)** **BLOQUEIO** por ausência de modelo de falta.

Ilustração com $k=115$, $t=0{,}2\ \text{s}$, $I_{k,tot}=20\,000\ \text{A}$. Os $\delta_{fault}$ abaixo são
**entradas `ASSUMPTION_ONLY` (AO-6)**, **não** derivadas do regime de carga (§4–5):

| Modo | $\delta_{fault}$ (origem) | $I_{k,ramo}$ (A) | $S_{min}$ (mm²) |
|---|---|---|---|
| (a) partilha ideal de falta | 1,00 — ASSUMPTION_ONLY | 6 667 | 25,93 |
| (a) partilha desigual assumida | 1,10 — ASSUMPTION_ONLY | 7 333 | 28,52 |
| (b) **`CENARIO_CONSERVADOR_ESCOLHIDO`: 1 ramo conduz $I_k$ total** | $\delta_{fault}=n_p$ (deste cenário) | 20 000 | **77,78** |
| (c) sem modelo de falta | — | — | **BLOQUEADO** |

Pontos críticos: (a) $\delta_{fault}$ **não** é $\delta_{load}$ — a partilha de carga (§5) **não prova** a
partilha de falta, pois durante o curto a topologia no ponto de falta (incluindo a impedância da fonte)
**pode** redistribuir a corrente; (b) o **`CENARIO_CONSERVADOR_ESCOLHIDO`** — um ramo conduz $I_k$ total —
tem **domínio físico restrito**: aplica-se quando os demais ramos estão abertos (fusível/falta que isola
cada ramo) ou em maldistribuição extrema. **$\delta_{fault}=n_p$ é o rótulo aritmético deste cenário
escolhido — NÃO um limite universal de $\delta_{fault}$.** Ele eleva $S_{min}$ de ~26 para **~78 mm²**
(fator ~3). Se o cenário é exigível **é questão normativa** (coordenação de proteção de paralelos,
IEC 60364-4-43, ausente — B-05). **Registrado, não adotado.**

---

## 9. Neutro e harmônicas (qualitativo — BLOQUEADO)

O neutro pode ou não ser paralelizado em razão $1{:}1$ com as fases — **decisão normativa** (524.2 +
Anexo E, ausentes). Com correntes harmônicas triplas, o neutro pode conduzir corrente elevada e a
IEC 60364-4-43:2023 **adicionou** requisitos de proteção de neutro/ponto médio "com e sem harmônicos
triplos" (confirmado em metadado — RNC-P A-06). **Nenhum fator de redução harmônica é derivável de física
livre.** BLOQUEADO.

---

## 10. Conexões, terminais e proteção (qualitativo — BLOQUEADO)

Cada via em paralelo exige terminação própria compatível (526/526.8, ausentes). A proteção contra
sobrecorrente de condutores em paralelo tem condições específicas (4-43, ausente): risco de que a
proteção não "enxergue" a sobrecarga de um único ramo assimétrico. **Modo de falha experimental
relevante:** ramo mais carregado sob $\delta_{load}$ alto pode exceder sua ampacidade **antes** de o dispositivo
atuar sobre $I_{tot}$. Registrado como cenário BDD; **regra normativa BLOQUEADA**.

---

## 11. Gatilho experimental de barramento/busway (hipótese H-03)

Sem número normativo (B-04). Propõem-se **variáveis de decisão** de laboratório, todas monotônicas:

- $n_p$ crescente ⇒ mais terminações, mais risco de assimetria;
- $\delta_{load}$ crescente (arranjo assimétrico) ⇒ perda de capacidade útil (derate $1/\delta_{load}$);
- seção total de cobre e raio de curvatura ⇒ inviabilidade física;
- viabilidade de terminais/lugs por barra.

**Nenhum limiar numérico é fixado.** A recomendação experimental de busway é **qualitativa** e marcada
como não-IEC.

---

## 12. Separação explícita: físico × normativo

| Afirmação | Físico livre | Normativo (ausente) |
|---|---|---|
| $\underline{I}_i=\underline{I}_{tot}\underline{Y}_i/\sum\underline{Y}$ | ✅ | — |
| $\delta_{load}$ — desbalanço em regime de carga | ✅ | — |
| $\delta_{fault}$ — desbalanço em curto ($\ne\delta_{load}$) | **forma** ✅ | modelo de falta ❌ (B-03/B-05) |
| $\Delta U\propto 1/n_p$ (simétrico); $\underline{Z}_{eq}$ | ✅ | — |
| $S\ge I_k\sqrt{t}/k$ **forma** | ✅ | valor de $k$ ❌ (B-03) |
| Anexo H (informativo) prova requisito normativo? | — | ❌ (A-01) |
| $n_p$ conta como $n_c$ para $k_g$? | — | ❌ (B-02) |
| Valor de $k_g$ | — | ❌ (B-02) |
| Limite de ΔU; limite de $n_p$; busway | — | ❌ (B-04/B-05) |
| Lista completa de condições de 523.7 | — | ❌ (A-01) |
| Redução harmônica; neutro em paralelo | — | ❌ (A-04/A-06) |

---

## 13. Lista integral do que falta para produção

1. **Delta material do AMD1:2024** (CSV, *track changes*) → resolve B-01.
2. **Texto de 523.7** → condições completas, resolve A-01 e parte de B-04.
3. **Notas de B.52.17** → resolve `nParallel`×`nCircuits` e $k_g$ (B-02).
4. **Anexo A + B.52.1 + B.52.2–B.52.13 + B.52.21** → ampacidade base e agrupamento.
5. **Anexo G/G.52.1** → limite de ΔU (B-05).
6. **Anexo E/E.52.1 + 524.2** → neutro e harmônicas.
7. **IEC 60364-4-43:2023 (Table 1 + sobrecarga + neutro)** → proteção e $k$ (B-03/B-05).
8. **IEC 60364-5-54:2011+A1** → PE em paralelo e $k$.
9. **IEC 60228:2023** → série nominal e resistências (substitui AO-4).
10. **IEC 61439-6:2012** → base normativa de busway (B-04).

---

## 14. Matriz "preliminar × produção"

| Domínio | Preliminar (laboratório) — **entregue** | Produção (exige norma) — **BLOQUEADO** |
|---|---|---|
| Divisão de corrente | física completa (§2–4) | — (já é física livre) |
| Ramo mais carregado / $\delta_{load}$ | modelo + 3 exemplos | validação vs. arranjos do Anexo H |
| $k_g$ / agrupamento | sensibilidade (§6) | valor real + contagem de circuitos (B-02) |
| Queda de tensão | valor físico (§7) | limite normativo (B-05) |
| Curto-circuito | forma + $\delta_{fault}$ (AO-6) + extrema (§8) | constante $k$ + modelo de falta + proteção (B-03/B-05) |
| Neutro/harmônicas | qualitativo (§9) | fatores + config (A-04/A-06) |
| Conexões/terminais | modo de falha (§10) | 526/526.8 |
| Busway | variáveis de decisão (§11) | limiar + 61439-6 (B-04) |
| Conformidade IEC | **proibida** | após RNC-C ratificado |

---

## Veredito preliminar (deste memorial)

A física de divisão de corrente, ramo mais carregado, queda de tensão e forma adiabática está **derivada,
conferida e reproduzível** — suficiente para um **SDD experimental de laboratório**. Toda regra
**normativa** (valores de $k_g$, $k$, limites, contagem de circuitos, conformidade) permanece
**BLOQUEADA**. Veredito sugerido ao @CTO: **`PRELIMINAR_APTO_PARA_SDD_EXPERIMENTAL`**, condicionado a
manter `estado_producao: BLOQUEADO` até a aquisição normativa da §13.

---

## Apêndice A — Reprodutibilidade autossuficiente (rastreabilidade durável, O.S. R2)

Este memorial é **autossuficiente**: todas as **entradas** (impedâncias dos §5/§7, $I_{tot}$, $I_{k,tot}$,
$t$, $k$, $k_g$, $I_{z,tab}$, $\cos\varphi$), todas as **fórmulas** (L-01…L-06 em §2/§4/§7/§8) e todos os
**resultados** (§5–§8) estão no próprio texto. **Nenhuma prova depende de wiki, script externo ou arquivo
não versionado.** O script `parallel_prelim.py` (Python 3, apenas `cmath`/`math`) é **mecanismo auxiliar**
de conferência, **não** fonte probatória. Núcleo algébrico (reproduzível à mão a partir das fórmulas):

```python
def divide(Itot, Zs):
    Ys = [1/Z for Z in Zs]; Ysum = sum(Ys)
    return [Itot*Y/Ysum for Y in Ys], 1/Ysum      # correntes de ramo, Zeq
# delta_load = n_p*max|Y_i|/|sum Y| ; derate = 1/delta_load          (REGIME DE CARGA)
# dU_3f      = sqrt(3)*Itot*(Zeq.real*cos + Zeq.imag*sin)
# S_adiab    = Ik_ramo*sqrt(t)/k ; Ik_ramo usa delta_fault (AO-6),   NUNCA delta_load
```

**Entradas e resultados-chave** (transcritos; sujeitos à `TOLERANCIA_COMPUTACIONAL_LAB_AMPAI`, §0.1):

| Ref. | Entradas (Ω, A, s) | Resultado |
|---|---|---|
| §5.1 | 3×(0,020+0,024j); $I_{tot}$=900 | $I_i$=300,00 A; $\delta_{load}$=1,0000; $Z_{eq}$=0,006667+0,008000j |
| §5.2 | (0,021),(0,020),(0,020); $I_{tot}$=900 | 290,32 / 304,84 A; $\delta_{load}$=1,0161 |
| §5.3 | (0,020+0,030j),(0,020+0,024j)×2,(0,020+0,018j); $I_{tot}$=1200 | 259,20 / 299,15 / 347,33 A; $\delta_{load}$=1,1578; $\sum\lvert f\rvert$=1,004026 |
| §5.4 | Ex.2 e Ex.3 | $S_X/S_R$=1,9563 ≈ 1,96 |
| §7 | ver §7 (Z de origem) | $\Delta U$: 14,789 / 14,890 / 44,367 V |
| §8 | $I_{k,tot}$=20000; t=0,2; k=115 | $S_{min}$: 25,93 / 28,52 / 77,78 mm² |

Fontes com rastreabilidade durável em [[cab-bt-parallel-prelim-rnc-p]] §2 (edição, URL, data de acesso e
hash quando auditado localmente).
