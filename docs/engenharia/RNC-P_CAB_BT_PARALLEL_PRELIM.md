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
rnc_classe: RNC-P (Registro Normativo Computável Processado)
---

# RNC-P — Múltiplos condutores em paralelo por fase (BT) · Registro preliminar de fontes e lacunas

> **AVISO DE USO — LEIA ANTES DE QUALQUER CONSUMO.**
> Este é um **RNC-P experimental de laboratório**. **NÃO** é RNC-C, **NÃO** é canônico e **NÃO**
> autoriza implementação de produção, memorial final, projeto, compra ou instalação. Nenhuma regra
> aqui pode ser rotulada "conforme IEC". A norma primária completa (IEC 60364-5-52:2009+AMD1:2024
> Ed. 3.1) está **AUSENTE**. Rastreabilidade durável das fontes em §2.2; a matriz de aquisição vive no
> registro do @CTO (não é dependência probatória desta ciência).

Documentos irmãos desta O.S.: [[cab-bt-parallel-prelim-memorial]] · [[cab-bt-parallel-prelim-bdd]].

---

## 1. Propósito

Registrar, de forma classificada e rastreável, **o que se sabe** e **o que falta** para estudar
múltiplos condutores em paralelo por fase no dimensionamento BT — separando rigorosamente física
independente da norma, estrutura normativa confirmada, interpretação secundária, hipótese do AmpAI,
conteúdo normativo ausente e bloqueios de produção. Este registro **reduz alucinação** ao impedir que
qualquer valor secundário ou hipótese de laboratório seja tratado como regra IEC.

---

## 2. Classificação das fontes (conforme O.S.)

| Fonte | Classificação (tag da O.S.) | Verificação por este engenheiro | O que legitimamente fornece |
|---|---|---|---|
| Preview ANSI da IEC 60364-5-52 **Ed. 3.1** | `NORMA_PRIMARIA_PREVIEW_PARCIAL_AUTORIZADA` | ⚠️ HTTP 403 ao meu ambiente; **verificação independente do @CTO** (URL + 2026-07-19; §2.2) | **Persistência na Ed. 3.1** dos identificadores existentes (523.7, B.52.17, Anexo H, H.52.1–H.52.9). **Não** fornece texto/valores/notas/delta |
| Preview oficial gratuito IEC 60364-5-52 **Ed. 3.0** (17 pp.) | norma primária — **extrato parcial oficial** | ✅ **Lido e auditado localmente** (hash §2.2) | **Existência** dos identificadores (523.7, B.52.17, Anexo H + figuras); sumário, foreword, 520.1–520.4 |
| Página oficial IEC (webstore pub. 103734) | `METADADO_PRIMARIO` | ✅ lido | Edição 3.1, 177 pp., 2024-11-22, em vigor. **Não** contém texto de cláusula |
| IEC TR 61200-52:2013 | `GUIA_TECNICO_OFICIAL_COMPLEMENTAR` | metadado lido; corpo AUSENTE | *Guidance* oficial da Parte 5-52 (520.1 NOTE 2). Secundário |
| Schneider EIG, Prysmian, Nexans, livros, artigos | `REFERENCIA_SECUNDARIA` | não consumidos como regra | Forma das regras, intuição de engenharia. **Não** substitui norma |
| Conversas com IA | `INTAKE_NAO_NORMATIVO` | não utilizado | Contexto de problema apenas |
| Teoria de circuitos (Kirchhoff, divisor de corrente) | `DEDUCAO_FISICA_CONTESTAVEL` | ✅ derivado e conferido | Física de divisão de corrente, ΔU, adiabático por ramo |

### 2.1 Nota de integridade científica (obrigatória para CHG-3)

Dois níveis de evidência, deliberadamente separados:

- **Existência dos identificadores** (523.7, B.52.17, Anexo H, figuras H.52.1–H.52.9): confirmada por
  **leitura pessoal** do **preview oficial gratuito da IEC, Ed. 3.0** — arquivo **auditado localmente**
  (SHA-256 em §2.2). É a fonte primária-parcial que este engenheiro efetivamente leu.
- **Persistência na Ed. 3.1** (mesmos identificadores após o AMD1:2024): registrada por **verificação
  independente do @CTO** do preview ANSI Ed. 3.1 (§2.2), **sem** leitura pessoal — o acesso ao preview ANSI
  retornou **HTTP 403** ao ambiente deste engenheiro em 2026-07-19 (duas tentativas).

**Escopo da evidência de preview — restrito a existência/estrutura:** 523.7, B.52.17, **Anexo H** e as nove
figuras H.52.1–H.52.9 (6/9/12 unipolares). **NÃO** cobre: texto integral de 523.7; valores e **notas** de
B.52.17; desenhos e **condições completas** do Anexo H; **delta material do AMD1:2024**. Esses itens
permanecem AUSENTES (§3.5) e sustentam os bloqueios (§3.6).

**Advertência de paginação:** o preview ANSI Ed. 3.1 contém sumários **redline** e **final** com paginações
**diferentes** — não misturar. Este registro **não cita páginas da Ed. 3.1**; a única paginação citada
(auxiliar) é a da Ed. 3.0.

### 2.2 Rastreabilidade durável das fontes (O.S. R2, ponto 10)

| Documento | Título | Org. | Edição | URL | Acesso | Hash (arquivo auditado) |
|---|---|---|---|---|---|---|
| Preview gratuito IEC 60364-5-52 | LV electrical installations – Part 5-52: Wiring systems | IEC | **3.0 (2009)** | webstore.iec.ch/publication/1878 (preview) | 2026-07-19 | SHA-256 `FBB2EF5E9F9E05AC6AF1C0C7CB7C1DB9E0575436C4CA4D974D88331E672951FE` (cache de sessão, não versionado) |
| Preview ANSI IEC 60364-5-52 | idem | ANSI (distr. IEC) | **3.1 (2009+AMD1:2024)** | webstore.ansi.org/preview-pages/IEC/preview_iec60364-5-52{ed3.1}en.pdf | 2026-07-19 (CTO; **403** a este engenheiro) | — (não auditado localmente) |
| Página oficial IEC | metadados da Ed. 3.1 | IEC | 3.1 | webstore.iec.ch/en/publication/103734 | 2026-07-19 | — |
| IEC TR 61200-52 | Electrical installation guide – Part 52 | IEC | 2.0 (2013) | webstore.iec.ch/en/publication/4895 | 2026-07-19 | — (metadado) |

Complementares (metadados verificados, corpo AUSENTE): IEC 60228:2023 (pub. 71891); IEC 60364-4-43:2023
(pub. 28432); IEC 60364-5-54:2011+AMD1:2021 (pub. 68865); IEC 61439-6:2012 (pub. 5463). **Regra:** hash só
é registrado quando há **arquivo local auditado**; do contrário, a durabilidade vem de **URL + edição +
data de acesso**. Nenhum PDF é incorporado ao repositório.

---

## 3. As seis separações obrigatórias

### 3.1 (1) Leis físicas independentes da IEC — **utilizáveis já**

Derivadas de teoria de circuitos; nenhuma norma as concede ou revoga. Detalhe e prova em
[[cab-bt-parallel-prelim-memorial]].

- **L-01** Divisor de corrente por admitâncias: $\underline{I}_i = \underline{I}_{tot}\,\underline{Y}_i/\sum_k \underline{Y}_k$.
- **L-02** Compartilhamento uniforme **exige impedâncias de ramo idênticas** (não apenas seção/material/comprimento — inclui **geometria/posição**, via reatância).
- **L-03** Assimetria de impedância ⇒ divisão desigual ⇒ existe um **ramo mais carregado** que excede $I_{tot}/n_p$.
- **L-04** Critério conservador: dimensionar cada ramo pela corrente do **ramo mais carregado**, nunca por $I_{tot}/n_p$.
- **L-05** Impedância equivalente do conjunto $\underline{Z}_{eq}=(\sum_k \underline{Y}_k)^{-1}$; para ramos idênticos $\underline{Z}_{eq}=\underline{Z}/n_p$ ⇒ $\Delta U \propto 1/n_p$.
- **L-06** Adiabático de curto-circuito ($S \ge I\sqrt{t}/k$) aplica-se **por condutor**, com a corrente de falta do ramo pertinente segundo **$\delta_{fault}$** (§3.4 H-02) — **nunca** com $\delta_{load}$. O valor de $k$ **NÃO é física livre** (vem de norma ausente).

### 3.2 (2) Regras confirmadas por fonte primária **parcial** — somente estrutura

**Identificadores confirmados na Ed. 3.1** pela preview ANSI autorizada (§2.1). **Nenhum texto de corpo,
valor ou nota foi obtido.** (A grade de páginas da Ed. 3.0, do preview oficial gratuito lido na rodada
anterior, é auxiliar e **não** deve ser misturada com a paginação — redline ou final — da Ed. 3.1.)

- **P-01** Existe a subcláusula **523.7 — *Conductors in parallel*** (Ed. 3.1, confirmada).
- **P-02** Existe a **Tabela B.52.17** (Ed. 3.1, confirmada). Seu **título** (visto na Ed. 3.0) indexa por **"one circuit / one multi-core cable / group of more than one circuit"** — e **não** por "condutor em paralelo". As **notas** que decidiriam a contagem continuam AUSENTES.
- **P-03** Existe o **Anexo H — *Examples of configurations of parallel cables*** com as **9 figuras H.52.1–H.52.9** (6/9/12 unipolares em paralelo), confirmado na Ed. 3.1. **Anexo H é INFORMATIVO** — classificação **sustentada pela preview autorizada** (§2.1): demonstra que **geometria e disposição são tecnicamente relevantes**, mas **NÃO permite, sozinho, inferir obrigação normativa** — obrigatoriedade, limites e condições dependem do **texto completo de 523.7** e demais cláusulas, ainda AUSENTES. **Esta é a única classificação de anexo baseada nesta preview**; nenhuma classificação ampla dos Anexos A–I é feita.

> **P-02 é o cerne do problema `nParallel` × `nCircuits`.** Como o *título* de B.52.17 fala em "circuito",
> **não se pode saber, sem as notas da tabela e o texto de 523.7**, se $n_p$ condutores por fase contam
> como 1 circuito ou como $n_p$ circuitos para efeito de $k_g$. **BLOQUEADO** (ver §3.6, B-02).

### 3.3 (3) Interpretações de fontes secundárias — **registradas, NÃO adotadas**

Marcadas como `REFERENCIA_SECUNDARIA`. Constam apenas para orientar o desenho experimental; **proibido**
tratá-las como regra. Nenhum valor numérico secundário é importado para o Memorial.

- **S-01** Guias práticos costumam enunciar como condição de paralelismo "mesmo comprimento, seção, material e isolação". **A O.S. proíbe declarar isso como lista normativa completa.** O Anexo H (informativo, P-03) mostra que **geometria/arranjo é tecnicamente relevante** e, portanto, que a lista de 4 itens é **tecnicamente insuficiente** — mas isto é argumento **físico/técnico**, **não** prova de requisito normativo, que depende do texto de 523.7 (AUSENTE).
- **S-02** Guias sugerem limitar o número de condutores em paralelo e preferir barramento acima de certo ponto. **Nenhum número** é adotado (ver B-04).
- **S-03** Guias apresentam $k_g$ tabelado. **Nenhum valor** é importado; $k_g$ entra como `ASSUMPTION_ONLY` (§5).

### 3.4 (4) Hipóteses experimentais do AmpAI — `ASSUMPTION_ONLY`

Registradas em §5. São **entradas explícitas** de laboratório, com proveniência e estudo de sensibilidade
obrigatórios; **nunca** apresentadas como valor IEC.

- **H-01** Modelo do ramo mais carregado com **fator de desbalanço** $\delta_{load} = n_p\,|\underline{Y}_{max}|/|\sum\underline{Y}|$; ampacidade útil do conjunto $= n_p\,I_z/\delta_{load}$.
- **H-02** Curto-circuito por ramo com um fator **$\delta_{fault}$ próprio e independente** de $\delta_{load}$ (regime de carga). $\delta_{fault}$ só é aceito como (a) `ASSUMPTION_ONLY` explícito, (b) **`CENARIO_CONSERVADOR_ESCOLHIDO`** identificado (um único ramo remanescente conduz a falta total; $\delta_{fault}=n_p$ é o **rótulo aritmético** deste cenário, **não** limite universal), ou (c) **bloqueio** por ausência de modelo de falta. **Proibido** reutilizar $\delta_{load}$ como se fosse $\delta_{fault}$, e **proibido** presumir que as admitâncias relevantes sejam iguais nos dois regimes.
- **H-03** Gatilho experimental de busway como função de variáveis de decisão ($n_p$, $\delta_{load}$, seção total, viabilidade de terminação) — **sem** número normativo.

### 3.5 (5) Conteúdo normativo **AUSENTE**

- **A-01** Texto integral de **523.7** (condições, obrigatoriedade, limites).
- **A-02** **Notas** da Tabela B.52.17 e os fatores $k_g$ (valores + regra de contagem de circuitos).
- **A-03** **Delta real do AMD1:2024** — o que a Ed. 3.1 alterou vs. Ed. 3.0 (publicamente inexistente; ver devolução, achado F-01).
- **A-04** Conteúdo integral de **Anexo A** (métodos de instalação), **B.52.1**, **B.52.2–B.52.13**, **B.52.21**, **Anexo G/G.52.1** (limite de ΔU) e **Anexo E/E.52.1** (harmônicas) — **ausente**. Sem classificação normativo/informativo (não sustentada pela preview).
- **A-05** Séries nominais e resistências vigentes — IEC 60228:2023 Ed. 4.0.
- **A-06** Proteção contra sobrecorrente de condutores em paralelo e neutro/harmônicos triplos — IEC 60364-4-43:2023 Ed. 4.0 (**reestruturada**, exige Table 1 de correspondência).
- **A-07** Condutor de proteção em paralelo — IEC 60364-5-54:2011+AMD1:2021.
- **A-08** Constante adiabática $k$ por combinação isolação/material (origem: 4-43 / 5-54, ausentes).

### 3.6 (6) Bloqueios obrigatórios de produção

Enquanto **qualquer** item abaixo persistir, `estado_producao: BLOQUEADO`.

- **B-01** `A-03` — **estrutura e identificadores estão confirmados na Ed. 3.1** (523.7, B.52.17, Anexo H — §2.1); porém o **conteúdo normativo e o delta material do AMD1:2024 permanecem AUSENTES**. B-01 persiste **limitado ao conteúdo/delta**, **não** à existência das cláusulas.
- **B-02** `A-01`+`A-02` — regra de contagem `nParallel` vs `nCircuits` indefinida ⇒ **$k_g$ indeterminado**.
- **B-03** `A-08` — constante $k$ não confirmada ⇒ nenhum resultado adiabático pode ser rotulado IEC.
- **B-04** `A-02`/`S-02` — nenhum limite máximo de $n_p$ nem gatilho normativo de busway.
- **B-05** `A-04`/`A-06` — limite de ΔU e coordenação de proteção ausentes.
- **B-06** Qualquer tentativa de emitir "conformidade IEC" ou memorial final é **proibida** por este RNC-P.

---

## 4. `nParallel` × `nCircuits` — distinção conceitual (núcleo da O.S.)

| Grandeza | Símbolo | Natureza | O que afeta | Estado |
|---|---|---|---|---|
| Condutores em paralelo por fase | $n_p$ | **Elétrica** | Divisão de corrente; ampacidade total; $\Delta U$; adiabático por ramo | Física **livre** (L-01…L-06) |
| Circuitos/agrupamentos | $n_c$ | **Térmica** | Fator de agrupamento $k_g$ (aquecimento mútuo) | **BLOQUEADO** (B-02) |

**Perigo central:** confundir $n_p$ com $n_c$. Um circuito com $n_p$ condutores/fase **não é**
termicamente igual a $n_p$ circuitos independentes, mas ambos podem aparecer como "$n_p$ cabos" num
mesmo eletroduto. Como a contagem correta vive nas **notas de B.52.17** (ausentes), o AmpAI **não pode**
decidir isso agora. Precedente de risco: o motor MT já usa `nCircuits` como índice único de
`getMTFgrouping()` — o motor BT **não deve** herdar essa simplificação para paralelismo sem a norma.

---

## 5. Registro `ASSUMPTION_ONLY` (entradas de laboratório)

Todo valor abaixo é **hipótese explícita**, **não** IEC. Proveniência e sensibilidade obrigatórias.
Sensibilidades demonstradas em [[cab-bt-parallel-prelim-memorial]].

| ID | Símbolo | Significado | Valor assumido | Proveniência | Sensibilidade |
|---|---|---|---|---|---|
| AO-1 | $\underline{Z}_i$ | impedâncias de ramo dos exemplos | ver Memorial §5 | **arbitradas**; só o **espalhamento relativo** importa | domina $\delta_{load}$ |
| AO-2 | $k_g$ | fator de agrupamento | 1,00 / 0,85 / 0,70 / 0,50 (varredura) | **placeholder**, não IEC | cobre $\propto 1/k_g$ |
| AO-3 | $k$ | constante adiabática | 115 (placeholder) | **não confirmado** (origem 4-43/5-54) | $S\propto 1/k$ |
| AO-4 | $I_{z,tab}$ | ampacidade base de tabela | 344 A (placeholder) | **não IEC** | linear em $n_{p,min}$ |
| AO-5 | $\delta_{load}$ | desbalanço em **regime de carga** | derivado de AO-1 (admitâncias de carga) | dedução (L-03) | direto na corrente do ramo |
| AO-6 | $\delta_{fault}$ | desbalanço em **curto-circuito** | **entrada explícita** ou `CENARIO_CONSERVADOR_ESCOLHIDO`; **NÃO** derivável de $\delta_{load}$ | modelo de falta AUSENTE | direto no adiabático (Memorial §8) |

> **Tolerância (O.S. R2, ponto 5):** todo resultado reproduzível relacionado a estes `ASSUMPTION_ONLY`
> segue a **`TOLERANCIA_COMPUTACIONAL_LAB_AMPAI` = ±0,5 % relativo** — determinística, **não** normativa IEC
> (Memorial §0.1).
> **Proxy contínuo (O.S. R2, ponto 6):** o $n_{p,min}$ **contínuo** e os percentuais de "cobre adicional"
> (Memorial §6) são **análise de sensibilidade**, **não** quantidade instalável; a seleção discreta real
> ($n_p\in\mathbb{Z}_{\ge1}$, seções IEC 60228) permanece **BLOQUEADA**.

---

## 6. Precedência e regra anti-alucinação

1. **Norma primária ausente** ⇒ nenhuma regra deste registro é canônica.
2. Física livre (§3.1) **pode** ser usada em laboratório; conteúdo normativo (§3.5) **não pode** ser inventado.
3. `REFERENCIA_SECUNDARIA` **nunca** vira regra sem promoção explícita a RNC-C, que **não** ocorre aqui.
4. Em conflito, **devolver ao @CTO** — este engenheiro não decide rota nem promove fonte.

---

## 7. O que deverá ser revisto após obtenção da norma

Ao integrar a Ed. 3.1 (CSV) + 60228:2023 + 4-43:2023 + 5-54: reavaliar **P-01…P-03** contra o texto real;
**substituir** todos os `ASSUMPTION_ONLY` (AO-2, AO-3, AO-4) por valores rastreados; **resolver** B-02
(contagem de circuitos) pelas notas de B.52.17; **fixar** limites (B-04, B-05); e **só então** o @CTO
poderá avaliar a promoção a RNC-C. Lista detalhada em [[cab-bt-parallel-prelim-memorial]] §13.
