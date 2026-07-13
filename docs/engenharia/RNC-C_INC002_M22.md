---
tags: [engenharia, rnc-c, iec60909, m22, inc-002]
os: INC-002-01-R4
classe: CHG-3 (científica/documental)
versao: "1.4"
ratificação: RATIFICADO_COM_CONDIÇÕES_DOCUMENTAIS_ATENDIDAS
vigência: PENDENTE_DE_INTEGRAÇÃO_NA_MAIN
estado_m22: não estudado
autor: "@Engenheiro_Eletricista (AmpAI Governança v7.2)"
data: 2026-07-13
baseline_os: e7bf237e73c96f20be8a6c63da399e5c57d44417
worktree: "isolado sobre baseline limpa e7bf237 (INC-002-01-R4); 3 entregáveis M22 untracked + Matriz tracked-modificada"
fonte_primaria: "IEC 60909-0:2016.pdf (norma primária selada; SHA-256 425250C7CA547C3110E4C1702BA83DE1DFA97C90A3DC0EA33BDE3F4F6F7C61E0; NÃO versionado)"
rnc_classe: RNC-C (ratificado com condições documentais)
capacidade: M22 — fator κ e corrente de crista i_p (IEC 60909-0:2016, §8.1.1)
---

# RNC-C — M22: fator κ e corrente de crista $i_p$ · INC-002-01-R4 (RATIFICADO com condições documentais)

> **Status documental:** `RATIFICADO_COM_CONDIÇÕES_DOCUMENTAIS_ATENDIDAS`; **vigência** `PENDENTE_DE_INTEGRAÇÃO_NA_MAIN`. Núcleo científico ratificado pelo Conselho. **`estado_m22: não estudado`** — M22 **não** está implementado, RED, GREEN nem stable. Especificação científica ratificada (**não** é evidência executável). Acompanha `INC002_M22_Memorial.md` e `INC002_M22_BDD.feature`.
>
> **v1.4 (INC-002-01-R4):** materialização documental final — pré-condição canônica do M15 (referência/normalização antes da soma); X=0 por **limite unilateral $X \to 0^+$**; identificação harmonizada (R4 / v7.2); estado de ratificação. Preserva SHA-256 integral, Provas A–E, $R_{Gf}$ exclusivo da crista, $R_G$ real no $i_{DC}$, inconsistência editorial (76)×(81), `TOLERÂNCIA_QA_ENV_AMPAI`, distinção máquina isolada × ramo completo, exclusões M23/conversores.

---

## Critério 1 — Fontes e Classificação

| Fonte | Classe |
|---|---|
| **`IEC 60909-0-2016.pdf`** (SHA-256 `425250C7CA547C3110E4C1702BA83DE1DFA97C90A3DC0EA33BDE3F4F6F7C61E0`; 154 págs.; não versionado) | **NORMA PRIMÁRIA (fonte selada)** — conferida diretamente |
| `docs/normas/.../IEC 60909-0-2016.md` | **RNC-P auxiliar** (extração Markdown) — conferida contra o PDF selado |
| `RNC-C_Fundacao_M00_M04_M15.md` | **RNC-C canônico** — sustenta **M03** ($X_d''$) e **M15** (agregação); **NÃO** M16 |
| `INC001_M16_Memorial.md` + `INC001_M16_SDD.md` | **base canônica de M16** — fornece o insumo $I_k''$ |
| `tests/test_inc001_m16.js` | **evidência executável `stable`, `core`, 24/24** — **NÃO é fonte normativa** |
| Cahier Schneider CT-158 §3.5; Kasikci (2002) | **referência secundária** |

> **Precedência:** **norma primária (PDF selado)** ≡ RNC-C **>** referência secundária. RNC-P é **auxiliar**. Evidência de `tests/` (`stable core 24/24`) comprova comportamento, não dita norma.
> **Verificação primária CONCLUÍDA:** SHA-256 casado; fórmulas conferidas nas págs. físicas 51–53 e 58–60 (normativas 49–51 e 56–58). PDF **não copiado nem versionado**.

---

## Critério 2 — Edição, Ano, Escopo e Limitações

**Edição:** IEC 60909-0:2016 (Ed. 2.0). **Cláusula:** §8.1.1. **Escopo M22 = (56), (57), (59), (60).**

**Fora do escopo:** **(58)** conversor; **§8.1.2 (61)** multiple-fed (M23); **$X<0$** (`FORA_DO_PERFIL_M22_V1`); faltas assimétricas (§8.2–8.4); $i_{DC}$ (§10/Fórmula 81); integral de Joule (§14).

> **Correção da Matriz (aplicada):** **A Matriz v1.2.3 foi corrigida na INC-002-01-R4 para (56), (57), (59) e (60)** (verificado no PDF selado); **(58)** conversor fora do M22; **§8.1.2/(61)** reservado ao M23.

---

## Critério 3 — Equações em LaTeX Revisadas

$$i_p = \kappa \cdot \sqrt{2} \cdot I_k'' \tag{56} \qquad \kappa = 1{,}02 + 0{,}98 \cdot e^{-3R/X} \tag{57} \qquad i_p = \sum_i i_{pi} \tag{59}$$

**Ramo completo (razão que entra na 57):**
$$R_{eq} = R_{Gf} + \sum_j R_j^{\text{série}} \qquad X_{eq} = X_d'' + \sum_j X_j^{\text{série}} \qquad \kappa = 1{,}02 + 0{,}98\,e^{-3\,R_{eq}/X_{eq}}$$

**Componente ISOLADO da máquina (somente, sem série):**
$$R_{Gf} = 0{,}05\,X_d'' \ (U_{rG}>1\text{kV}\wedge S_{rG}\ge100\text{MVA}); \quad 0{,}07\,X_d'' \ (U_{rG}>1\text{kV}\wedge S_{rG}<100\text{MVA}); \quad 0{,}15\,X_d'' \ (U_{rG}\le1000\text{V})$$

**Domínio:** $\kappa \in [1{,}02;\ 2{,}00]$. $R=0\Rightarrow\kappa=2$; **$X=0$ ($R>0$) $\Rightarrow\kappa=1{,}02$** por **extensão pelo limite unilateral $X \to 0^+$, dentro do perfil indutivo suportado** = `DEDUÇÃO_MATEMÁTICA_RATIFICADA` (não há extensão pelo lado $X<0$, que é `FORA_DO_PERFIL_M22_V1`).

### Pré-condição canônica do M15 (referência e normalização antes da soma)

> **Todas as parcelas de R_eq e X_eq devem estar corrigidas, normalizadas e referidas ao mesmo nível de tensão antes da soma.**
>
> - M22 deve **preferencialmente consumir o equivalente já agregado por M15**;
> - componentes individuais só podem ser somados se estiverem no **mesmo nível de referência**;
> - **fatores de correção aplicáveis** (ex.: $t_r^2$, $K_T$, $K_G$) devem estar **incorporados antes** de M22;
> - é **proibido somar impedâncias brutas de lados de tensão diferentes**;
> - M22 **não repete nem substitui** a responsabilidade de normalização do M15.

---

## Critério 4 — Unidades SI e Checagem Dimensional

$$[i_p]=\text{adim.}\cdot\text{adim.}\cdot\text{A}=\text{A}\ \checkmark \qquad [R/X]=\Omega/\Omega=\text{adim.}\ \checkmark \qquad [R_{Gf}]=\text{adim.}\cdot\Omega=\Omega\ \checkmark$$
$I_k''$ [A]; $R_{eq}, X_{eq}, X_d'', R_{Gf}, R_L, X_L$ [Ω]; $U_{rG}$ [V]; $S_{rG}$ [VA]; $\kappa$, $R/X$ adim.

---

## Critério 5 — Premissas Adotadas e Proibidas

**Adotadas:** $I_k''$ de M16 (evidência `stable core 24/24`); $X_d''$/agregação de M03/M15; **$R/X = R_{eq}/X_{eq}$ do ramo completo**; ramo de gerador usa $R_{Gf}$ (fictícia) + resistências série reais; X=0→κ=1,02 (ratificada).

**Proibidas:**
| Premissa proibida | Consequência |
|---|---|
| **Tratar "ramo de gerador" como razão fixa 0,05/0,07/0,15** | Ignora transformador/cabo/reator série — $R/X$ errado (só vale para máquina isolada) |
| **Somar parcelas de $R_{eq}$/$X_{eq}$ em níveis de tensão diferentes ou sem referência comum** | Resultado sem significado físico — viola a pré-condição canônica do M15 |
| Usar $R_{Gf}$ em M16 ou no $i_{DC}$ (81) | Violação normativa — $R_{Gf}$ é exclusiva da crista; $i_{DC}$ usa $R_G$ real |
| Substituir o piso $\kappa=1{,}02$ por 1,00 | Contraria a Fórmula (57) |
| Enunciar "X=0→κ=1,02" como texto normativo explícito | É `DEDUÇÃO_MATEMÁTICA_RATIFICADA` (limite), não texto da norma |
| Classificar $X<0$ como "impossível" | É `FORA_DO_PERFIL_M22_V1` (capacitivo é real; fora do perfil v1) |
| Aplicar soma (59) a rede multiple-fed / κ a conversor | §8.1.2 exige κ único; conversor usa (58) sem κ |
| Aceitar $I_k''\le0$, $R_{eq}<0$, $X_d''\le0$, $U_{rG}\le0$, $S_{rG}\le0$ | Fisicamente impossível |
| Unidades ANSI/NEC | Viola SI obrigatório |

---

## Critério 6 — Limites Físicos de Entrada e Saída

| Parâmetro | Unidade | Regra |
|---|---|---|
| $I_k''$ | A | Bloquear se $\le 0$ (físico) |
| $R_{eq}$ | Ω | Bloquear se $< 0$ (físico) |
| $X_{eq}$ | Ω | $=0$ (com $R_{eq}>0$) → $\kappa=1{,}02$ (dedução ratificada); $<0$ → `FORA_DO_PERFIL_M22_V1`; $R_{eq}=X_{eq}=0$ → bloquear |
| $\kappa$ (saída) | — | $[1{,}02;\ 2{,}00]$ |
| $X_d''$ | Ω | Bloquear se $\le 0$ (físico) |
| $U_{rG}$ | V | Bloquear se $\le 0$ (físico); fronteira $=1000$ V → RGf-3 |
| $S_{rG}$ | VA | Bloquear se $\le 0$ (físico); fronteira $=100$ MVA → RGf-1 |

---

## Critério 7 — Condições de Bloqueio e Avisos

| ID | Condição | Classificação | Ação |
|---|---|---|---|
| B-A | $I_k'' \le 0$ | físico | bloquear |
| B-B | $R_{eq}<0$ | físico | bloquear |
| P-C | **$X_{eq}<0$** | **`FORA_DO_PERFIL_M22_V1`** | bloquear runtime (fora do perfil, não impossível) |
| T-D | $X_{eq}=0$ com $R_{eq}>0$ | **`DEDUÇÃO_MATEMÁTICA_RATIFICADA`** | $\kappa=1{,}02$ (sem aviso/bloqueio) |
| B-E | $R_{eq}=0$ e $X_{eq}=0$ | físico | bloquear (curto franco) |
| B-F | $X_d'' \le 0$ | físico | bloquear |
| B-G | $U_{rG}\le0$ ou $S_{rG}\le0$ | físico | bloquear |
| B-H | entrada ausente / não numérica / não finita | estrutural | bloquear |
| B-I | impedâncias paralelas (§8.1.2) ou conversor (58) | normativo (exclusão) | não suportado — sinalizar |

> **`FORA_DO_PERFIL_M22_V1` (texto obrigatório):** *"M22 v1 suporta ramos equivalentes passivos indutivos com R >= 0 e X >= 0. X < 0 pode ocorrer em redes com compensação capacitiva, mas permanece fora do perfil suportado nesta versão."* O bloqueio runtime de $X<0$ permanece proposto; muda a justificativa.
> **Códigos RFC 7807:** não definidos nesta fase (CTO no SDD).

---

## Critério 8 — Rastreabilidade

| Regra | Origem (norma primária = PDF selado) |
|---|---|
| $i_p=\kappa\sqrt2 I_k''$ | §8.1.1, **(56)** |
| $\kappa=1{,}02+0{,}98e^{-3R/X}$ | §8.1.1, **(57)**; Figura 12 |
| Ramo completo $R_{eq}/X_{eq}$ | dedução sobre (57) + topologia série |
| $i_p=\sum i_{pi}$ | §8.1.1, **(59)/(60)** |
| $R_{Gf}$ (máquina isolada, 3 faixas) | §8.1.1 |
| Isolamento de $R_{Gf}$; iDC=(81); RG real | §8.1.1 + §10 **(81)** — ⚠ inconsistência editorial |
| X=0 → κ=1,02 | limite de (57) — `DEDUÇÃO_MATEMÁTICA_RATIFICADA` |
| Exclusão multiple-fed / conversor | §8.1.2 **(61)** / **(58)** |

> ⚠️ **APARENTE INCONSISTÊNCIA EDITORIAL DA EDIÇÃO IEC 60909-0:2016 (confirmada no PDF selado):** o parágrafo de $R_{Gf}$ (pág. física 52) cita literalmente "Fórmula (76)" para $i_{DC}$; porém, **no PDF oficial**, a **(76)** (pág. física 58, §9.1.7) é $I_b$, e $i_{DC}$ é a **(81)** (§10). A referência "(76)" **está no original 2016** — não é erro de extração. **Tratamento:** preservar a referência literal à (76); vincular $i_{DC}$ à §10/(81); usar $R_G$ real (pág. física 60); proibir $R_{Gf}$ no $i_{DC}$. Encaminhar ao Conselho como inconsistência editorial da norma.

---

## Critério 9 — Critérios de QA/BDD Associados

**BDD:** `INC002_M22_BDD.feature` (cenários `experimental`/PROP — M22 `não estudado`) — felizes (R=0→κ=2; R/X>0; máquina isolada; **ramo completo com série**; múltiplas alimentações simples; 3 faixas de $R_{Gf}$; fronteiras 1 kV / 100 MVA; X=0→κ=1,02) e tristes (I''k≤0; R_eq<0; **X_eq<0 = FORA_DO_PERFIL_M22_V1**; R=X=0; X''d≤0; UrG≤0; SrG≤0; estruturais; exclusão §8.1.2 e conversor).

**Gabaritos independentes reproduzíveis:**

| Prova | Entrada | R/X | κ | $i_p$ | Cruzamento |
|---|---|---|---|---|---|
| A (R=0) | $I_k''=14122{,}72$ A | 0 | 2,0000 | 39,95 kA | dedução (limite de 57) |
| B (R/X>0) | $I_k''=14122{,}7$ A | 0,3164 | 1,3993 | 27,95 kA | Schneider CT-158 P1 (κ=1,4) |
| C (**máquina isolada**) | $X_d''=0{,}2999$ Ω, sem série | 0,05 | 1,8635 | 117,9 kA | Schneider CT-158 P2 (κ=1,86) |
| D (X=0) | $I_k''=10000$ A | →∞ | 1,0200 | 14,42 kA | dedução ratificada |
| **E (ramo completo)** | $X_d''=0{,}30$; $R_L=0{,}10$; $X_L=0{,}20$ Ω; $I_k''=20000$ A | **0,23** | **1,5115** | **42,75 kA** | dedução (série ≠ isolada) |

**`TOLERÂNCIA_QA_ENV_AMPAI`:** relativa $\le 0{,}1\%$ para $\kappa$ e $i_p$ — **critério de aceitação do AmpAI (envelope QA)**, **NÃO** tolerância normativa IEC; **não** altera fórmula nem cálculo em precisão de máquina.

---

## Estado

- **ratificação:** `RATIFICADO_COM_CONDIÇÕES_DOCUMENTAIS_ATENDIDAS`
- **vigência:** `PENDENTE_DE_INTEGRAÇÃO_NA_MAIN`
- **estado_m22:** `não estudado` (state lock do Conselho — M22 **não** é implementado/RED/GREEN/stable; nenhum código/teste criado)
- **fluxo restante:** integração na `main` → SDD → RED → GREEN

---

*RNC-C v1.4 — @Engenheiro_Eletricista (AmpAI Governança v7.2) para a O.S. INC-002-01-R4 (CHG-3 científica/documental), em worktree isolado sobre a baseline limpa `origin/main@e7bf237`, com verificação primária contra o PDF selado (SHA-256 `425250C7CA547C3110E4C1702BA83DE1DFA97C90A3DC0EA33BDE3F4F6F7C61E0`). Estado: `RATIFICADO_COM_CONDIÇÕES_DOCUMENTAIS_ATENDIDAS`, `vigência PENDENTE_DE_INTEGRAÇÃO_NA_MAIN`, `estado_m22: não estudado`. Nenhum commit/push/PR/merge; sem SDD/QA/Backend.*
