---
tags: [engenharia, memorial, iec60909, m16, inc-001, bdd]
os: INC-001-01
capacidade: M16 — corrente inicial simétrica trifásica I''k
estado_obrigatorio: GREEN_nao_stable
autor: "@Engenheiro_Eletricista (AmpAI Governança v7.0)"
data: 2026-07-07
baseline_os: bf0d592a215353d3f5382ed4f7234d85340bbb18
baseline_green: 433b311fd7bd529d4785e95a146a5c09099a33d4
status: memorial_cientifico_validado_GREEN_nao_stable
---

# Memorial de Cálculo Contestável — M16 (I''k trifásico) · O.S. INC-001-01

> **Escopo original deste memorial:** contrato científico do motor M16 produzido antes do teste RED e da adequação Backend. Acompanha `INC001_M16_BDD.feature`.
>
> **Atualização documental pós-GREEN:** o ciclo INC-001 concluiu RED→GREEN independente. M16 = `GREEN`, **não `stable`**. Nada aqui promove M16 ao manifesto do Gate Consolidado.
>
> **Evidências de rastreabilidade:** INC-001-01 / INC-001-01-R (BDD científico e memorial aprovados); PR #22 (motor M16 corrigido); PR #24 (executor M16 versionado); QA independente com `tests/test_inc001_m16.js` 24/24, exit 0, e `tests/core_curto_circuito.test.js` 39/39, exit 0; merge `433b311fd7bd529d4785e95a146a5c09099a33d4`; Gate shadow pós-merge #28988541103 SUCCESS.

---

## 0. Fontes e Classificação (Restrição 5 — precedência)

| Fonte | Classe | Uso neste memorial |
|---|---|---|
| `docs/engenharia/RNC-C_Fundacao_M00_M04_M15.md` §9.3 | **RNC-C ratificado (canônico)** | Determinações vinculantes: $U_n$ nominal; conjunto discreto de $c$; casos TC-M16-01…07 |
| IEC 60909-0:2016, 7.2.1 (Fórmula 33) e 5.3.1 (Tabela 1) | **Norma primária** | Fórmula e faixa/tabela de $c$ |
| Schneider CT-158 §3.5 Problema 1 | **Referência secundária** | Conferência numérica do gabarito de TC-M16-01 (subordinada) |
| Álgebra dimensional e limites de divisão | **Dedução matemática** | Bloqueios físicos e conversões |

> **Precedência (Taxonomia RNC):** norma primária ≡ RNC-C ratificado **>** referência secundária. **A referência Schneider NÃO se sobrepõe** à IEC nem ao RNC-C; serve apenas para cruzar o valor numérico de TC-M16-01.

---

## 1. Fórmula e Derivação Dimensional

**Origem:** norma primária — IEC 60909-0:2016, **cláusula 7.2.1**.

$$I_k'' = \frac{c \cdot U_n}{\sqrt{3}\,\lvert \underline{Z}_k \rvert} \tag{33}$$

> **Verificação da numeração (correção O.S. R, item 4):** a numeração **Fórmula (33)** foi conferida diretamente na fonte disponível — RNC-P `docs/normas/IEC_60909_Short_Circuit/IEC 60909-0-2016.md`, cláusula **7.2.1**: a prosa afirma *"shall be calculated using Formula (33)"* **e** a equação está numerada `(33)` (prosa e tag concordam). **Não** atribuída por memória.
> **Ressalva de proveniência:** a fonte lida é a **extração processada RNC-P**, não o PDF primário selado. Âncora robusta = **§7.2.1**; a numeração **(33)** fica *confirmada na extração* e sujeita à conferência final contra o PDF primário quando disponível.

**Checagem dimensional** (dedução matemática):

$$[I_k''] = \frac{(\text{adimensional}) \cdot \text{V}}{(\text{adimensional}) \cdot \Omega} = \frac{\text{V}}{\Omega} = \frac{\text{V}}{\text{V/A}} = \text{A} \;\checkmark$$

Onde $\sqrt{3}$ e $c$ são adimensionais; $U_n$ em V; $\lvert\underline{Z}_k\rvert$ em Ω; resultado em A. Coerente com o SI declarado no RNC-C Critério 4.

---

## 2. Convenção de $U_n$ — tensão nominal do sistema (vinculante)

**Origem:** RNC-C ratificado (determinação vinculante) + norma primária (5.3.1, definição 3.13 de $U_n$).

$U_n$ é a **tensão nominal do sistema** (line-to-line), **não** a tensão de placa do enrolamento $U_{rTLV}$. No gabarito Schneider §3.5 Problema 1 o sistema é de 400 V (placa do trafo 410 V). Portanto **TC-M16-01 usa $U_n = 400$ V**, conforme exigido pela O.S. e pelo RNC-C.

---

## 3. Perfil discreto do fator $c$ — justificativa normativa

**Origem:** norma primária (IEC 60909-0:2016, 5.3.1, **Tabela 1**) + RNC-C §9.3.

A Tabela 1 tabela $c$ por nível de tensão e regime (máx/mín). Os **únicos** valores que a norma atribui são:

$$c \in \{\,0{,}90;\ 0{,}95;\ 1{,}00;\ 1{,}05;\ 1{,}10\,\}$$

| Valor | Origem na Tabela 1 |
|---|---|
| 1,10 | $c_{\max}$ (BT ±10 %; AT) |
| 1,05 | $c_{\max}$ (BT ±6 %) |
| 1,00 | $c_{\min}$ (AT) |
| 0,95 | $c_{\min}$ (BT ±6 %) |
| 0,90 | $c_{\min}$ (BT ±10 %) |

O conjunto é **discreto**: um valor como $c = 0{,}93$, embora dentro da faixa numérica $[0{,}90;\,1{,}10]$, **não é tabelado** e deve ser bloqueado. Não há interpolação de $c$ na norma.

---

## 4. Conversões de Unidade (explícitas)

**Origem:** dedução matemática.

$$1\ \text{m}\Omega = 10^{-3}\ \Omega \qquad\Rightarrow\qquad 17{,}17\ \text{m}\Omega = 0{,}01717\ \Omega; \quad 17{,}0\ \text{m}\Omega = 0{,}017\ \Omega$$

$$1\ \text{kA} = 10^{3}\ \text{A} \qquad\Rightarrow\qquad 14\,122{,}7206\ \text{A} = 14{,}1227206\ \text{kA}; \quad 13\,228{,}1135\ \text{A} = 13{,}2281135\ \text{kA}$$

Constante utilizada: $\sqrt{3} = 1{,}7320508075688772$.

---

## 5. Caminhos Felizes — cálculo reproduzível

### 5.1 TC-M16-01 (gabarito Schneider; $c$ máximo BT)

Entradas: $U_n = 400\ \text{V}$; $\lvert\underline{Z}_k\rvert = 17{,}17\ \text{m}\Omega = 0{,}01717\ \Omega$; $c = 1{,}05$.

$$\text{numerador} = c \cdot U_n = 1{,}05 \times 400 = 420\ \text{V}$$
$$\text{denominador} = \sqrt{3}\,\lvert\underline{Z}_k\rvert = 1{,}7320508075688772 \times 0{,}01717 = 0{,}0297393124\ \Omega$$
$$I_k'' = \frac{420}{0{,}0297393124} = 14\,122{,}7206\ \text{A} = \boxed{14{,}1227206\ \text{kA}}$$

**Conferência secundária (subordinada):** Schneider CT-158 arredonda para 14,12 kA. Consistente; não altera o valor canônico.

### 5.2 TC-M16-05 (corrente mínima ilustrativa; $c = 0{,}95$)

Entradas: $U_n = 410\ \text{V}$; $\lvert\underline{Z}_k\rvert = 17{,}0\ \text{m}\Omega = 0{,}017\ \Omega$; $c = 0{,}95$.

$$\text{numerador} = 0{,}95 \times 410 = 389{,}5\ \text{V}$$
$$\text{denominador} = 1{,}7320508075688772 \times 0{,}017 = 0{,}0294448637\ \Omega$$
$$I_k'' = \frac{389{,}5}{0{,}0294448637} = 13\,228{,}1135\ \text{A} = \boxed{13{,}2281135\ \text{kA}}$$

---

## 6. Bloqueios — classificação e justificativa

Taxonomia de bloqueio (por O.S.): **físico**, **normativo**, **estrutural**, **envelope de produto**.

| Bloqueio | Condição | Natureza | Origem | Justificativa |
|---|---|---|---|---|
| B1 | $U_n \le 0$ | **físico** | dedução matemática | Tensão nominal não pode ser $\le 0$; anula/inverte o numerador. TC-M16-02. |
| B2 | $\lvert\underline{Z}_k\rvert \le 0$ | **físico** | dedução matemática | $\lvert Z\rvert = 0$ é curto franco → divisão por zero → $I_k''\to\infty$. TC-M16-03. |
| B3 | $c > 1{,}10$ | **normativo** | norma primária (Tabela 1) | Acima do máximo tabelado. TC-M16-04. |
| B4 | $c < 0{,}90$ | **normativo** | norma primária (Tabela 1) | Abaixo do mínimo tabelado. TC-M16-06. |
| B5 | $c \in [0{,}90;1{,}10]$ mas $\notin$ conjunto discreto | **normativo** | norma primária (Tabela 1) + RNC-C | Valor não tabelado (ex.: 0,93). TC-M16-07. |
| B6 | $U_n$, $Z_k$ ou $c$ ausente, não numérico ou não finito (NaN/±∞) | **estrutural** | dedução/contrato (RNC-C Critério 4) | Entrada não representa grandeza física válida; contrato de interface. |

> **Unidades (precondição do contrato, NÃO bloqueio runtime — correção O.S. R, item 3):** V, Ω e A são **precondições** do contrato de M16, não bloqueios. Um método que recebe **números crus não distingue** `0,017 Ω` de `0,017 mΩ`; portanto M16 **não promete bloqueio runtime de unidade errada**. A normalização/conversão para SI ocorre **antes da chamada**, ou exigiria um **DTO tipado futuro** (definição no SDD, fora de escopo). Por isso o antigo "B7" foi **removido da tabela de bloqueios** — não é verificável em runtime.

> **Envelope de produto:** **não se aplica** a M16 nesta O.S. — nenhum dos bloqueios mínimos é teto de produto (diferente de M02b $u_{kr}\le20\%$ ou M03 $x_d''\le1$). Registrado para completude da taxonomia.

> **Semântica de $\le 0$ (correção O.S. R, item 2):** os bloqueios B1 ($U_n\le0$) e B2 ($\lvert Z_k\rvert\le0$) cobrem **tanto o zero quanto o negativo**. O zero é divisão-por-zero / curto franco; o negativo é fisicamente impossível (tensão e módulo de impedância não podem ser negativos). Cenários dedicados: TC-M16-02 e TC-M16-02b ($U_n$); TC-M16-03 e TC-M16-03b ($Z_k$).

---

## 7. Rastreabilidade (Requisito → Fonte/Cláusula → Cenário BDD → Caso TC → Resultado)

| Requisito | Fonte / cláusula | Origem | Cenário BDD | Caso TC | Resultado esperado |
|---|---|---|---|---|---|
| R1 — Fórmula $I_k''=cU_n/(\sqrt3\lvert Z_k\rvert)$ | IEC 60909-0:2016 §7.2.1 F(33) | norma primária | Contexto + felizes | TC-01, TC-05 | corrente calculada |
| R2 — $U_n$ = tensão nominal (400 V no gabarito) | RNC-C §9.3 + IEC 5.3.1; conf. CT-158 | RNC-C + norma primária | TC-M16-01 | 14,1227206 kA |
| R3 — $c \in \{0{,}90;0{,}95;1{,}00;1{,}05;1{,}10\}$ | IEC Tabela 1 (5.3.1) + RNC-C §9.3 | norma primária + RNC-C | TC-04, TC-06, TC-07 | bloqueio |
| R4 — bloquear $U_n\le0$ | divisão física impossível | dedução (físico) | TC-M16-02 | bloqueio físico |
| R5 — bloquear $\lvert Z_k\rvert\le0$ | curto franco, $I\to\infty$ | dedução (físico) | TC-M16-03 | bloqueio físico |
| R6 — bloquear $U_n$/$Z_k$/$c$ ausente/não-num./não-finito | contrato de interface | estrutural | Esquema estrutural §"BDD" | bloqueio estrutural |
| R7 — unidades V/Ω/A como **precondição** (sem bloqueio runtime) | RNC-C Critério 4 | precondição de contrato | Contexto (nota de unidades) | não distingue Ω de mΩ em número cru |
| R8 — valor de corrente mínima ilustrativa | IEC §7.2.1 | norma primária + dedução | TC-M16-05 | 13,2281135 kA |
| R9 — bloquear $U_n<0$ e $Z_k<0$ (negativos) | impossibilidade física | dedução (físico) | TC-M16-02b / TC-M16-03b | bloqueio físico |
| R10 — entradas estruturais inválidas ($U_n$/$Z_k$/$c$) | contrato de interface | estrutural | Esquema "Entradas estruturalmente inválidas" (15 exemplos) | bloqueio estrutural |

---

## 8. Premissas

**Origem:** RNC-C ratificado + norma primária.

1. Sistema CA trifásico simétrico; $f \in \{50; 60\}$ Hz (fora do cálculo direto de M16, mas herdado do escopo).
2. Método da fonte de tensão equivalente $cU_n/\sqrt3$ (5.3.1).
3. $\lvert\underline{Z}_k\rvert$ é fornecido já agregado por M15 (dependência), referido ao nível de $U_n$.
4. $U_n$ = tensão nominal do sistema (não placa).
5. Entradas em SI: $U_n$ [V], $\lvert Z_k\rvert$ [Ω], $c$ [adimensional]; saída em [A]/[kA].
6. $c$ restrito ao conjunto discreto da Tabela 1.

---

## 9. Limites de Escopo (fora de escopo por O.S.)

Não tratados neste memorial (competência do CTO/SDD e O.S. sequenciais): alteração da assinatura do método; Result Pattern/RFC 7807; códigos de erro; implementação backend; criação de testes; UI; M17+ e motores dependentes; promoção a `stable`; mudanças no Gate Consolidado.

> **Unidades (correção O.S. R, item 3):** V, Ω e A são **precondições** do contrato, não bloqueios. Um número cru não carrega unidade — o motor **não distingue** `0,017 Ω` de `0,017 mΩ`. A conversão/normalização para SI acontece **antes da chamada**; a verificação em runtime exigiria um **DTO tipado**, cuja definição pertence ao SDD (fora de escopo). Portanto M16 **não** promete bloqueio runtime de unidade incorreta.

---

## 10. Incertezas e Dependências de Norma Primária

1. **Precisão dos valores esperados:** 14,1227206 kA e 13,2281135 kA são exatos **dadas as entradas declaradas** e $\sqrt3$ com 17 dígitos. As entradas $\lvert Z_k\rvert$ (17,17 / 17,0 mΩ) têm 3–4 algarismos significativos; a tolerância de teste recomendada é **relativa ≤ 0,01 %**, coerente com essa precisão de entrada.
2. **Figura 7 / seleção do tipo de falta (7.1.1):** M16 é a falta **trifásica** isolada; a comparação com faltas assimétricas (para determinar a corrente dominante) depende de $\underline{Z}_{(0)}$/$\underline{Z}_{(2)}$ — fora do escopo de M16, sem acesso pleno confirmado à cláusula 7.1.1 para este incremento.
3. **$c$ acima de 420 kV:** a Tabela 1 não define $c$ para $U_m > 420$ kV; fora do perfil atual do AmpAI.

---

## 11. Estado pós-GREEN e histórico do gap encerrado

Na baseline de ratificação original (`641d8ab`), `calcularCorrenteInicialSimetrica(Un, Zk, c)` validava $U_n>0$, $Z_k>0$ e $c\in(0;\,1{,}10]$ (via `typeof` + `≤0` + `>1,1`). O INC-001 encerrou esse gap: no estado atual pós-merge `main@433b311fd7bd529d4785e95a146a5c09099a33d4`, M16 impõe o conjunto discreto de $c$ e bloqueia entradas estruturais inválidas com erro estruturado Problem Details/RFC 7807.

| Caso | Comportamento pré-INC-001 | Comportamento pós-GREEN |
|---|---|---|
| TC-M16-01 | calculava 14,1227206 kA sem teste específico | **VALIDADO_GREEN** |
| TC-M16-02 ($U_n=0$) | bloqueava sem teste específico | **VALIDADO_GREEN** com erro estruturado |
| TC-M16-03 ($Z_k=0$) | bloqueava sem teste específico | **VALIDADO_GREEN** com erro estruturado |
| TC-M16-04 ($c=1{,}15$) | bloqueava por $>1{,}10$ sem teste específico | **VALIDADO_GREEN** com erro estruturado |
| TC-M16-05 | calculava 13,2281135 kA sem teste específico | **VALIDADO_GREEN** |
| **TC-M16-06 ($c=0{,}85$)** | ⚠️ aceitava e calculava (gap) | **VALIDADO_GREEN**: bloqueia por fora do conjunto |
| **TC-M16-07 ($c=0{,}93$)** | ⚠️ aceitava e calculava (gap) | **VALIDADO_GREEN**: bloqueia por valor não tabelado |
| $c=1{,}15$ | bloqueio parcial por teto $>1{,}10$ | **VALIDADO_GREEN**: bloqueia como valor fora do conjunto discreto |
| B6 — $U_n$/$Z_k$/$c$ = NaN/±Infinity | comportamento incompleto ou acidental | **VALIDADO_GREEN**: bloqueio estrutural |
| Unidades SI | não detectável em runtime (número cru) — **precondição, não bloqueio** | permanece precondição; normalização antes da chamada; DTO tipado futuro se necessário |

> **Conclusão de estado:** M16 está `GREEN` por validação independente do INC-001. TC-M16-01 a TC-M16-07 são **`VALIDADO_GREEN`**. M16 ainda **não está `stable`**, pois `tests/test_inc001_m16.js` não foi versionado no manifesto do Gate Consolidado. Promoção para `stable` exige O.S. própria conforme `docs/AmpAI_Gate_Regressao.md`.

---

## 12. Divergência de baseline e disciplina de worktree (correção O.S. R, item 5)

A O.S. fixa a baseline `bf0d592…`, que **contém** `RNC-C_Fundacao_M00_M04_M15.md` e a matriz **rastreados**. O working tree local está em `641d8ab…` (anterior; `bf0d592` não é sua ancestral) e possui essas versões apenas como arquivos **não-rastreados**. Este memorial foi vinculado ao **conteúdo canônico ratificado lido de `bf0d592`** (via `git show`, sem checkout).

> **Disciplina de worktree (vinculante — substitui a recomendação anterior):** este working tree **sujo NÃO deve ser alterado nem sincronizado** por esta O.S. A futura **fase QA deverá partir de um worktree limpo criado sobre `origin/main`**. Os artefatos científicos (este memorial e o `.feature`) **deverão ser versionados antes do RED formal**. **Nenhuma sincronização de worktree é executada nem recomendada aqui.**

---

*Memorial produzido pelo @Engenheiro_Eletricista (AmpAI Governança v7.0) para a O.S. INC-001-01 e atualizado documentalmente após GREEN independente do INC-001 sobre `main@433b311fd7bd529d4785e95a146a5c09099a33d4`. M16 = `GREEN`, não `stable`. Nenhum commit/push/PR/merge nesta etapa sem autorização do CEO.*
