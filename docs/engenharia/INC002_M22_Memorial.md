---
tags: [engenharia, memorial, iec60909, m22, inc-002, crista, kappa]
os: INC-002-01-R4
classe: CHG-3 (científica)
capacidade: M22 — fator κ e corrente de crista i_p (IEC 60909-0:2016, §8.1.1)
estado: não estudado (pré-BDD/SDD; nada implementado)
autor: "@Engenheiro_Eletricista (AmpAI Governança v7.2)"
data: 2026-07-13
baseline_os: e7bf237e73c96f20be8a6c63da399e5c57d44417
worktree: "isolado sobre baseline limpa e7bf237 (INC-002-01-R4); 3 entregáveis M22 untracked + Matriz tracked-modificada"
fonte_primaria: "IEC 60909-0:2016.pdf (norma primária selada; 154 págs.; NÃO versionado)"
sha256_fonte: "425250C7CA547C3110E4C1702BA83DE1DFA97C90A3DC0EA33BDE3F4F6F7C61E0"
status: "memorial de suporte ao RNC-C ratificado; estado_m22: não estudado"
---

# Memorial de Cálculo Contestável — M22 (κ e corrente de crista $i_p$) · O.S. INC-002-01-R4

> **Classe:** `CHG-3 — científica/documental`. **Escopo:** memorial de cálculo de M22, suporte do RNC-C **ratificado com condições documentais**. Acompanha `INC002_M22_BDD.feature` e `RNC-C_INC002_M22.md`. **`estado_m22: não estudado`** — M22 **não** está implementado, RED, GREEN nem stable.
>
> **v-R4 (materialização documental final):** (1) **pré-condição canônica do M15** (referência/normalização antes da soma); (2) X=0 por **limite unilateral $X \to 0^+$** (não "extensão contínua"); (3) identificação harmonizada (**INC-002-01-R4 / Governança v7.2**); (4) RNC-C renomeado e ratificado; (5) **A Matriz v1.2.3 foi corrigida na INC-002-01-R4 para (56), (57), (59) e (60)**. Preserva SHA-256 integral, Provas A–E, $R_{Gf}$ exclusivo da crista, $R_G$ real no $i_{DC}$, inconsistência editorial (76)×(81), `TOLERÂNCIA_QA_ENV_AMPAI`, distinção máquina isolada × ramo completo, exclusões M23/conversores.

---

## 0. Fontes e Classificação (Restrição 5 — precedência)

| Fonte | Classe | Função exata |
|---|---|---|
| **`IEC 60909-0-2016.pdf`** (SHA-256 `425250C7CA547C3110E4C1702BA83DE1DFA97C90A3DC0EA33BDE3F4F6F7C61E0`; 154 págs.) — fora do repositório, **não versionado** | **NORMA PRIMÁRIA (fonte selada)** | Verificação primária de (56),(57),(58),(59),(60),(61),(76),(81) e $R_{Gf}$ |
| `docs/normas/IEC_60909_Short_Circuit/IEC 60909-0-2016.md` §8.1.1 | **RNC-P auxiliar** (extração Markdown) | Fonte operacional de trabalho; conferida contra o PDF selado |
| `docs/engenharia/RNC-C_Fundacao_M00_M04_M15.md` | **RNC-C canônico** | Sustenta **M03** ($X_d''$, $\underline{Z}_{GK}$) e **M15** (agregação de $\underline{Z}_k$). **NÃO** sustenta M16. |
| `docs/engenharia/INC001_M16_Memorial.md` + `docs/api/INC001_M16_SDD.md` | **base canônica de M16** | M16 (`calcularCorrenteInicialSimetrica`) fornece o insumo $I_k''$ |
| `tests/test_inc001_m16.js` | **evidência executável `stable`, `core`, 24/24** — **NÃO é fonte normativa** | Comprova o comportamento de M16; não substitui norma nem RNC-C |
| Cahier Schneider CT-158 §3.5; Kasikci (Wiley 2002) | **referência secundária** | Conferência numérica dos gabaritos (subordinada; **não** contraria a norma) |

> **Precedência:** **norma primária (PDF selado)** ≡ RNC-C **>** referência secundária. A extração RNC-P é **auxiliar**. Evidência executável (`tests/test_inc001_m16.js`, `stable core 24/24`) comprova comportamento, **não** dita norma.

### 0.1 Registro de Verificação Primária (INC-002-01-R2, mantido)

**Verificação primária CONCLUÍDA** contra o PDF selado, com autorização do CEO. O PDF **não foi copiado nem versionado**.

- **SHA-256 conferido:** `425250C7CA547C3110E4C1702BA83DE1DFA97C90A3DC0EA33BDE3F4F6F7C61E0` ✓ · **154 páginas físicas** ✓.

| Pág. física | Pág. normativa | Conteúdo conferido diretamente |
|---|---|---|
| 51 | 49 | §8.1.1 e **(56)** $i_p=\kappa\sqrt2 I_k''$ |
| 52 | 50 | **(57)**, **(58)**; faixas de $R_{Gf}$ (0,05/0,07/0,15); **referência literal à "Formula (76)"** no parágrafo de $R_{Gf}$ |
| 53 | 51 | **(59)**, **(60)**; §8.1.2 e **(61)** |
| 58 | 56 | §9.1.7 e **(76)** = $I_b$ |
| 59–60 | 57–58 | §10; **iDC ↔ (81)**; *"the correct resistance $R_G$ … should be used and not $R_{Gf}$"* |

---

## 1. Divergência de numeração — RESOLVIDA (verificada no PDF selado)

**Escopo de M22 = Fórmulas (56), (57), (59), (60).** A Matriz v1.2.3 foi corrigida na INC-002-01-R4 para (56), (57), (59) e (60).

| Conteúdo | Nº (PDF selado) | Pertence a M22? |
|---|---|---|
| $i_p = \kappa\sqrt2\,I_k''$ | **(56)** | **SIM** |
| $\kappa = 1{,}02 + 0{,}98\,e^{-3R/X}$ | **(57)** | **SIM** |
| $i_p = \sum_i i_{pi}$ | **(59)/(60)** | **SIM** |
| $i_p = \sqrt2\,I_{kPF}''$ (conversor) | **(58)** | **NÃO — fora do escopo** |

**Verificação no PDF primário selado:** págs. físicas 51–53 (normativas 49–51). Numeração **confirmada na fonte selada**. **Correção documental aplicada:** M22 = (56),(57),(59),(60); (58) fora. **A Matriz v1.2.3 foi corrigida na INC-002-01-R4 para (56), (57), (59) e (60).**

---

## 2. Fórmulas Verificadas (LaTeX) — norma primária (PDF selado, §8.1.1)

**(56)** $$i_p = \kappa \cdot \sqrt{2} \cdot I_k'' \tag{56}$$
**(57)** $$\kappa = 1{,}02 + 0{,}98 \cdot e^{-3R/X} \tag{57}$$
**(59)/(60)** $$i_p = \sum_i i_{pi} \tag{59} \qquad i_p = i_{pS} + i_{pT} + i_{pWF} + i_{pM} \tag{60}$$

**FORA do escopo M22 (registrada):** $i_p = \sqrt{2}\, I_{kPF}''$ **(58)** (conversor, sem κ); $i_p = \kappa\sqrt2\,I_{kmaxPFO}'' + \sqrt2\,I_{kPF}''$ **(61)** (§8.1.2 multiple-fed — M23).

**Constante:** $\sqrt{2} = 1{,}4142135623730951$.

---

## 3. Domínio de κ e regra única de X=0

$$\kappa(R/X{=}0) = 2{,}00 \qquad \lim_{R/X \to \infty} \kappa = 1{,}02 \qquad \Rightarrow \qquad \kappa \in [1{,}02;\ 2{,}00]$$

### 3.1 Regra única para X=0 — `DEDUÇÃO_MATEMÁTICA_RATIFICADA`

**Decisão de contrato (ratificada):** $X_k = 0$ com $R_k > 0$ → **$\kappa := 1{,}02$** por **extensão pelo limite unilateral $X \to 0^+$, dentro do perfil indutivo suportado** (limite $R/X \to \infty$). **Não há extensão pelo lado $X<0$**, que é `FORA_DO_PERFIL_M22_V1`.
- **Classificação: `DEDUÇÃO_MATEMÁTICA_RATIFICADA`** — não é texto normativo explícito; é o limite da Fórmula (57).
- **Ação determinística:** retorna $\kappa=1{,}02$ (sem aviso/bloqueio). Domínio fechado em 1,02.
- **Piso 1,02:** fidelidade à norma (não o teórico 1,00).
- **$R_k=0$ e $X_k=0$:** $\underline{Z}_k=0$ (curto franco; $R/X=0/0$ indeterminado) → **bloqueio físico** (distinto de X=0 com R>0).

---

## 4. Checagem Dimensional e Unidades SI

| Grandeza | Símbolo | Unidade |
|---|---|---|
| Corrente inicial simétrica (RMS) | $I_k''$ | A |
| Resistência / reatância de curto (equivalentes) | $R_k, X_k$ (ou $R_{eq}, X_{eq}$) | Ω |
| Razão / fator de crista | $R/X$, $\kappa$ | adimensional |
| Corrente de crista | $i_p$ | A (pico) |
| Reatância subtransitória / resistência fictícia | $X_d''$, $R_{Gf}$ | Ω |
| Tensão / potência nominal do gerador | $U_{rG}, S_{rG}$ | V, VA |

$$[i_p]=\text{adim.}\cdot\text{adim.}\cdot\text{A}=\text{A}\ \checkmark \qquad [R/X]=\Omega/\Omega=\text{adim.}\ \checkmark \qquad [R_{Gf}]=\text{adim.}\cdot\Omega=\Omega\ \checkmark$$

---

## 5. Resistência fictícia $R_{Gf}$ — MÁQUINA ISOLADA vs RAMO COMPLETO (regra vinculante)

As três faixas normativas (§8.1.1) fornecem $R_{Gf}$ **do componente isolado da máquina síncrona**:
$$R_{Gf} = 0{,}05\,X_d'' \ (U_{rG}>1\text{kV}\wedge S_{rG}\ge100\text{MVA}); \quad 0{,}07\,X_d'' \ (U_{rG}>1\text{kV}\wedge S_{rG}<100\text{MVA}); \quad 0{,}15\,X_d'' \ (U_{rG}\le1000\text{V})$$

> ⚠️ **Os fatores 0,05 / 0,07 / 0,15 representam $R_{Gf}/X_d''$ APENAS para o componente isolado da máquina** (nos terminais do gerador, sem impedância série). **NÃO** são a razão $R/X$ do ramo completo.

### 5.1 Ramo completo (regra vinculante)

Para um **ramo completo** (gerador + transformador de bloco + cabo + reator + qualquer impedância série), a razão que entra na Fórmula (57) é a do **equivalente série do ramo**:

$$R_{eq} = R_{Gf} + \sum_j R_j^{\text{série}} \qquad X_{eq} = X_d'' + \sum_j X_j^{\text{série}} \qquad \boxed{\kappa = 1{,}02 + 0{,}98\,e^{-3\,R_{eq}/X_{eq}}}$$

- **Transformador, cabo, reator e qualquer outra impedância série NÃO podem ser ignorados.**
- Somente no caso degenerado **sem impedância série** (máquina isolada nos terminais) é que $R_{eq}/X_{eq} = R_{Gf}/X_d'' \in \{0{,}05;0{,}07;0{,}15\}$.
- **Proibição:** tratar "ramo de gerador" genericamente como razão fixa 0,05/0,07/0,15. Isso só vale para a máquina isolada.
- $R_{Gf}$ substitui a resistência da **máquina** (fictícia); as resistências série ($R_T$, $R_L$, …) entram com seus valores **reais**.

### 5.1.1 Pré-condição canônica do M15 (referência e normalização antes da soma)

> **Todas as parcelas de $R_{eq}$ e $X_{eq}$ devem estar corrigidas, normalizadas e referidas ao mesmo nível de tensão antes da soma.**

- M22 deve **preferencialmente consumir o equivalente já agregado por M15** (que já entrega $\underline{Z}_k$ referido e corrigido).
- Componentes individuais **só podem ser somados se estiverem no mesmo nível de referência**.
- **Fatores de correção aplicáveis** (referência por $t_r^2$; $K_T$, $K_G$, $K_S/K_{SO}$ conforme a fundação M00–M04/M15) devem estar **incorporados antes** de M22.
- É **proibido somar impedâncias brutas de lados de tensão diferentes** (resultado sem significado físico).
- M22 **não repete nem substitui** a responsabilidade de normalização/referência do M15 — apenas consome o equivalente já normalizado.
- **Bloqueio:** parcelas sem referência comum ou em níveis de tensão incompatíveis → rejeição (ver cenário `TC-M22-BLK-referencia` no BDD).

### 5.2 Isolamento de $R_{Gf}$ e APARENTE INCONSISTÊNCIA EDITORIAL DA EDIÇÃO IEC 60909-0:2016

$R_{Gf}$ é **fictícia** e existe **exclusivamente** para a crista $i_p$ (§8.1.1). **Não pode contaminar:**
- **M16**: usa $\underline{Z}_k$ com a **resistência real** $R_G$ (via $\underline{Z}_{GK}$ de M03). Não recebe $R_{Gf}$.
- **Componente CC $i_{DC}$** (§10): computável pela **Fórmula (81)**; deve usar $R_G$ **real**, não $R_{Gf}$.

> ⚠️ **APARENTE INCONSISTÊNCIA EDITORIAL DA EDIÇÃO IEC 60909-0:2016 (confirmada no PDF selado):** o parágrafo de $R_{Gf}$ (pág. física 52 / normativa 50) cita literalmente *"…cannot be used when calculating the aperiodic component $i_{DC}$ … **according to Formula (76)**"*. Porém, **no PDF oficial**: a **(76)** (pág. física 58 / normativa 56, §9.1.7) é a corrente de interrupção $I_b=I_{kmax}''$, e o $i_{DC}$ é a **(81)** (§10; confirmado pela Fórmula 82, pág. física 60: *"iDC … see Formula (81)"*). A referência "(76)" **está no original 2016** — não é erro de extração.
> **Tratamento (preservado):** (a) preservar a referência **literal à (76)**; (b) vincular o $i_{DC}$ computável a **§10/Fórmula (81)**; (c) usar **$R_G$ real** (pág. física 60: *"the correct resistance $R_G$ … not $R_{Gf}$"*); (d) proibir $R_{Gf}$ no $i_{DC}$. **Encaminhar ao Conselho** como inconsistência editorial da norma. A substância não depende da numeração.

---

## 6. Perfis de cálculo (§8.1.1 vs §8.1.2) — escopo de M22

| Perfil | Definição | Fórmula | Escopo |
|---|---|---|---|
| **Alimentação simples** | uma fonte, radial, sem impedâncias paralelas; $R/X$ do **ramo completo** ($R_{eq}/X_{eq}$) | (56) | **EM escopo** |
| **Múltiplas alimentações simples** | várias fontes radiais (Fig. 9), sem impedâncias paralelas; $i_p=\sum \kappa_i\sqrt2 I_{ki}''$ | (59)/(60) | **EM escopo** |
| **Rede multiple-fed** (§8.1.2) | fontes com impedâncias paralelas/malha (Fig. 10); κ único (métodos a/b/c; fator 1,15; tetos 1,8 BT / 2,0 AT) | (61) | **FORA — M23** |
| **Conversor full-size** | fonte via conversor; $\sqrt2 I_{kPF}''$ (sem κ) | (58) | **FORA — não suportado** |

---

## 7. Provas de Cálculo Contestáveis (reproduzíveis) — `TOLERÂNCIA_QA_ENV_AMPAI`

$\sqrt2 = 1{,}4142135623730951$.

### Prova A — $R=0 \Rightarrow \kappa = 2$ (insumo de M16)
$I_k''=14\,122{,}72$ A, $R_k=0$, $X_k=17{,}17$ mΩ → $R/X=0$.
$$\kappa = 2{,}000 \qquad i_p = 2{,}000\times1{,}4142135624\times14\,122{,}72 = \boxed{39\,945{,}1\ \text{A} \approx 39{,}95\ \text{kA}}$$

### Prova B — $R/X>0$ (cross-check Schneider CT-158 P1)
$\underline{Z}_k=(5{,}18+\mathrm{j}16{,}37)$ mΩ → $R/X=0{,}316432$; $I_k''=14\,122{,}7$ A.
$$\kappa = 1{,}02+0{,}98\,e^{-0{,}949297} = 1{,}3993 \qquad i_p = \boxed{27\,947\ \text{A} \approx 27{,}95\ \text{kA}}$$

### Prova C — MÁQUINA ISOLADA nos terminais (cross-check Schneider CT-158 P2)
Gerador $U_{rG}=21$ kV, $S_{rG}=250$ MVA → **RGf-1**; $X_d''=0{,}2999\ \Omega$ → $R_{Gf}=0{,}05\times0{,}2999=0{,}014995\ \Omega$. **Sem impedância série** → $R_{eq}/X_{eq}=R_{Gf}/X_d''=0{,}05$.
$$\kappa_G = 1{,}02+0{,}98\,e^{-0{,}15} = \boxed{1{,}8635}$$
Schneider P2 → $\kappa_G=1{,}86$. Consistente. **(Este é o caso degenerado de máquina isolada; não vale para ramo com série.)**

### Prova D — X=0 (limite unilateral $X \to 0^+$, `DEDUÇÃO_MATEMÁTICA_RATIFICADA`)
$I_k''=10\,000$ A, $R_k=0{,}02\ \Omega$, $X_k=0$ → $R/X\to\infty$.
$$\kappa = 1{,}0200 \qquad i_p = 1{,}0200\times1{,}4142135624\times10\,000 = \boxed{14\,425\ \text{A} \approx 14{,}42\ \text{kA}}$$

### Prova E — RAMO COMPLETO de gerador COM impedância série
Gerador $X_d''=0{,}30\ \Omega$ → $R_{Gf}=0{,}05\times0{,}30=0{,}015\ \Omega$ (razão isolada 0,05). **Em série:** transformador/cabo/reator com $R_L=0{,}10\ \Omega$, $X_L=0{,}20\ \Omega$.
$$R_{eq} = 0{,}015 + 0{,}10 = 0{,}115\ \Omega \qquad X_{eq} = 0{,}30 + 0{,}20 = 0{,}50\ \Omega \qquad \frac{R_{eq}}{X_{eq}} = 0{,}23 \ne 0{,}05$$
$$\kappa = 1{,}02+0{,}98\,e^{-3\times0{,}23} = 1{,}02+0{,}98\,e^{-0{,}69} = \boxed{1{,}5115}$$
Com $I_k''=20\,000$ A: $i_p = \kappa\sqrt2\,I_k'' = 1{,}51154\times1{,}4142135624\times20\,000 = \boxed{42\,753\ \text{A} \approx 42{,}75\ \text{kA}}$.

> **Conclusão da Prova E:** a presença de impedância série **muda $R/X$ de 0,05 para 0,23** e $\kappa$ de 1,8635 para 1,5115. **Confirma que "ramo de gerador" NÃO é razão fixa** — só a máquina isolada (Prova C) usa 0,05/0,07/0,15.

> **`TOLERÂNCIA_QA_ENV_AMPAI` — relativa ≤ 0,1%:** é **critério de aceitação do AmpAI** (envelope de QA), **NÃO** tolerância normativa da IEC. **Não** altera a fórmula nem o cálculo em precisão de máquina (a implementação computa κ e $i_p$ com $\sqrt2$/$e$ em precisão de máquina; o ≤ 0,1% governa apenas a comparação de teste).

---

## 8. Bloqueios e tratamentos

| ID | Condição | Classificação | Ação (determinística) |
|---|---|---|---|
| B-A | $I_k'' \le 0$ | **físico** | bloquear |
| B-B | $R_k < 0$ (ou $R_{eq}<0$) | **físico** | bloquear (resistência passiva $\ge 0$) |
| P-C | **$X_k < 0$** (ou $X_{eq}<0$) | **`FORA_DO_PERFIL_M22_V1`** | bloquear em runtime — **fora do perfil**, não "impossível" |
| T-D | $X_k = 0$ com $R_k > 0$ | **`DEDUÇÃO_MATEMÁTICA_RATIFICADA`** | $\kappa=1{,}02$ (sem aviso/bloqueio) |
| B-E | $R_k = 0$ e $X_k = 0$ | **físico** | bloquear (curto franco) |
| B-F | $X_d'' \le 0$ | **físico** | bloquear |
| B-G | $U_{rG} \le 0$ ou $S_{rG} \le 0$ | **físico** | bloquear |
| B-H | entrada ausente / não numérica / não finita | **estrutural** | bloquear |
| B-I | impedâncias paralelas (§8.1.2) ou conversor (58) | **normativo (exclusão)** | não suportado — sinalizar |
| B-J | parcelas de $R_{eq}$/$X_{eq}$ **sem referência comum** ou em **níveis de tensão incompatíveis** | **pré-condição M15 violada** | bloquear (ver §5.1.1; cenário `TC-M22-BLK-referencia`) |

> **`FORA_DO_PERFIL_M22_V1` (texto obrigatório):** *"M22 v1 suporta ramos equivalentes passivos indutivos com R >= 0 e X >= 0. X < 0 pode ocorrer em redes com compensação capacitiva, mas permanece fora do perfil suportado nesta versão."* O bloqueio runtime de $X<0$ **permanece proposto**; apenas a justificativa muda (perfil, não impossibilidade física).
> **Unidades:** precondição de contrato (número cru não distingue Ω de mΩ) — normalização SI antes da chamada; DTO tipado é competência do SDD. **Códigos RFC 7807: não definidos nesta fase** (CTO no SDD).

---

## 9. Rastreabilidade (Requisito → Fonte → Cenário BDD → Resultado)

| Requisito | Fonte / cláusula | Origem | Cenário BDD | Resultado |
|---|---|---|---|---|
| R1 — $i_p=\kappa\sqrt2 I_k''$ | IEC §8.1.1 **(56)** | **norma primária (PDF selado)** | felizes | $i_p$ (A pico) |
| R2 — $\kappa=1{,}02+0{,}98e^{-3R/X}$ | IEC §8.1.1 **(57)** | **norma primária (PDF selado)** | felizes | κ adim. |
| R3 — $R=0 \Rightarrow \kappa=2$ | dedução sobre (57) | dedução matemática | TC-M22-01 | κ=2,00 |
| R4 — $X=0 \Rightarrow \kappa=1{,}02$ | limite de (57) | `DEDUÇÃO_MATEMÁTICA_RATIFICADA` | TC-M22-X0 | κ=1,02 |
| R5 — soma $i_p=\sum i_{pi}$ | IEC §8.1.1 **(59)/(60)** | **norma primária (PDF selado)** | TC-M22-mult | Σ contribuições |
| R6 — $R_{Gf}$ (máquina isolada) | IEC §8.1.1 (RGf) | **norma primária (PDF selado)** | TC-M22-RGf-*, TC-M22-03 | 0,05/0,07/0,15·X''d |
| R7 — **ramo completo** $R_{eq}/X_{eq}$ | dedução sobre (57) + topologia série | dedução matemática | TC-M22-ramo-completo | $\kappa(R_{eq}/X_{eq})$ |
| R8 — isolamento de $R_{Gf}$; iDC=(81); RG real | IEC §8.1.1 + §10 (81) | **norma primária (PDF selado)** + inconsistência editorial | — (premissa) | não contamina M16/$i_{DC}$ |
| R9 — $X<0$ fora do perfil | perfil M22 v1 | `FORA_DO_PERFIL_M22_V1` | TC-M22-BLK-Xneg | bloqueio (fora do perfil) |
| R10 — exclusão §8.1.2 / conversor | IEC §8.1.2 **(61)** / **(58)** | **norma primária (PDF selado)** | TC-M22-escopo | não suportado |

---

## 10. Premissas, Limites e Exclusões

**Premissas:** $I_k''$ vem de M16 (insumo executável, `stable core 24/24`); $X_d''$/agregação de M03/M15 (RNC-C_Fundacao). **Para o ramo completo, $R/X = R_{eq}/X_{eq}$** ($R_{eq}=R_{Gf}+\sum R^{\text{série}}$, $X_{eq}=X_d''+\sum X^{\text{série}}$). Máquina isolada é caso degenerado sem série.

**Limites:** $I_k''>0$; $R_{eq}\ge0$; $X_{eq}\ge0$ (perfil indutivo passivo); $X_d''>0$; $U_{rG}>0$; $S_{rG}>0$; $\kappa \in [1{,}02;\ 2{,}00]$.

**Exclusões:** §8.1.2 multiple-fed (M23); conversores (58); $X<0$ (`FORA_DO_PERFIL_M22_V1`); faltas assimétricas (§8.2–8.4); $i_{DC}$ (§10, Fórmula 81); integral de Joule (§14).

**Pontos ao Conselho:** verificação primária CONCLUÍDA (PDF selado); aparente inconsistência editorial (76)×(81) confirmada no PDF oficial.

---

## 11. Estado COD vs PROP

M22 = **`não estudado`**. O **núcleo científico foi ratificado** pelo Conselho (`RATIFICADO_COM_CONDIÇÕES_DOCUMENTAIS_ATENDIDAS`), porém **nenhum código/teste existe** e M22 **não** é implementado/RED/GREEN/stable. Fluxo restante: integração documental na `main` (`vigência PENDENTE_DE_INTEGRAÇÃO_NA_MAIN`) → SDD (CTO) → RED (QA) → GREEN (Backend).

---

*Memorial (v-R4) — @Engenheiro_Eletricista (AmpAI Governança v7.2) para a O.S. INC-002-01-R4 (CHG-3 científica/documental), em worktree isolado sobre a baseline limpa `origin/main@e7bf237`, com verificação primária contra o PDF selado (SHA-256 `425250C7CA547C3110E4C1702BA83DE1DFA97C90A3DC0EA33BDE3F4F6F7C61E0`). Suporte do RNC-C `RATIFICADO_COM_CONDIÇÕES_DOCUMENTAIS_ATENDIDAS`; `estado_m22: não estudado`. Nenhum commit/push/PR/merge; sem SDD/QA/Backend.*
