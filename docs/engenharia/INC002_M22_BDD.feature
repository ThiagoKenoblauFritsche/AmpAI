# language: pt
# ─────────────────────────────────────────────────────────────────────────────
# O.S.: INC-002-01-R4  ·  Classe: CHG-3 (científica)  ·  Capacidade: M22 — κ e crista i_p
# IEC 60909-0:2016, §8.1.1  ·  Autor: @Engenheiro_Eletricista (Governança v7.2)
# Baseline científica: e7bf237e73c96f20be8a6c63da399e5c57d44417 (INC-002-01-R4)
# Integração canônica: main@65579b2f7155c55096a9d794ca45251ce88ff22d (INC-002-CANON-001,
#   PR #33, 2026-07-14; gate pós-merge #29295637686 — PASS). vigência CANÔNICO; estado_m22: não estudado.
#
# FONTE PRIMÁRIA (selada, verificada): IEC 60909-0-2016.pdf — SHA-256 425250C7CA547C3110E4C1702BA83DE1DFA97C90A3DC0EA33BDE3F4F6F7C61E0
#   (154 págs.; fora do repo, NÃO versionado). Conferido nas págs. físicas 51–53 e 58–60.
#   A extração Markdown (docs/normas/...) é RNC-P AUXILIAR; Schneider é referência secundária.
#   M22 = Fórmulas (56) i_p=κ√2·I''k ; (57) κ=1,02+0,98·e^(-3R/X) ; (59)/(60) soma.
#   (58) conversor e (61) §8.1.2 multiple-fed → FORA do escopo M22.
#   A Matriz v1.2.3 foi corrigida na INC-002-01-R4 para (56), (57), (59) e (60).
#
# ESTADO: M22 = não estudado. Cenários CANDIDATOS PROP. Não implementa, não cria teste,
#   não promove M22, NÃO define códigos RFC 7807 (o CTO fará no SDD).
#   Insumo I''k vem de M16, cujo comportamento é comprovado por tests/test_inc001_m16.js
#   (evidência executável stable, core, 24/24 — NÃO é fonte normativa).
#
# UNIDADES (SI, precondição): I''k [A RMS]; R_k, X_k, X''d, R_L, X_L [Ω]; R/X [adim.];
#   κ [adim.]; i_p [A pico]; U_rG [V]; S_rG [VA].
# Constante √2 = 1,4142135623730951. Domínio de κ = [1,02; 2,00].
# TOLERÂNCIA_QA_ENV_AMPAI = relativa ≤ 0,1% — critério de aceitação do AmpAI (envelope QA),
#   NÃO é tolerância normativa IEC; não altera fórmula nem cálculo em precisão de máquina.
# ─────────────────────────────────────────────────────────────────────────────

@experimental @PROP @M22 @INC-002 @CHG-3 @iec60909-8.1.1
Funcionalidade: M22 — Fator κ e corrente de crista i_p (IEC 60909-0:2016, §8.1.1)

  Como motor científico do AmpAI
  Quero calcular κ (Fórmula 57) a partir da razão R/X do RAMO COMPLETO e a crista i_p (56)
  Para dimensionamento eletrodinâmico, sem tratar "ramo de gerador" como razão fixa,
  com regra determinística para X=0 e X<0 fora do perfil v1,
  separando os casos não suportados (§8.1.2/M23 e conversores, Fórmula 58).

  Contexto:
    Dado que o motor aplica "i_p = κ·√2·I''k" (IEC 60909-0:2016, §8.1.1, Fórmula 56)
    E que "κ = 1,02 + 0,98·e^(-3·R/X)" (Fórmula 57)
    E que R/X é a razão do RAMO COMPLETO: R_eq = R_do_ramo, X_eq = X_do_ramo
    E que para um ramo com gerador, R_eq = R_Gf + Σ R_série e X_eq = X''d + Σ X_série
    E que, por pré-condição canônica do M15, todas as parcelas de R_eq e X_eq devem estar
      corrigidas, normalizadas e referidas ao mesmo nível de tensão antes da soma
    E que M22 preferencialmente consome o equivalente já agregado por M15 e não substitui essa normalização
    E que I''k é a corrente inicial simétrica trifásica em ampères RMS (insumo de M16)
    E que o domínio de κ é o intervalo fechado [1,02; 2,00]

  # ══════════════════════════════════════════════════════════════════════════
  #  CAMINHOS FELIZES
  # ══════════════════════════════════════════════════════════════════════════

  @caminho-feliz
  Cenário: TC-M22-01 — Circuito puramente reativo (R=0) demonstra κ=2
    Dado uma corrente inicial simétrica I''k = 14122,72 A
    E uma resistência de curto do ramo R_eq = 0 Ω
    E uma reatância de curto do ramo X_eq = 0,01717 Ω     # R/X = 0
    Quando eu calculo o fator κ pela Fórmula (57)
    Então κ deve ser exatamente 2,000
    E a corrente de crista i_p = κ·√2·I''k deve ser ≈ 39945,1 A (≈ 39,95 kA) dentro de TOLERÂNCIA_QA_ENV_AMPAI

  @caminho-feliz @gabarito-schneider
  Cenário: TC-M22-02 — Razão R/X > 0 (gabarito Schneider CT-158 P1)
    Dado uma corrente inicial simétrica I''k = 14122,7 A
    E uma resistência de curto do ramo R_eq = 0,00518 Ω   # 5,18 mΩ
    E uma reatância de curto do ramo X_eq = 0,01637 Ω     # 16,37 mΩ → R/X = 0,316432
    Quando eu calculo o fator κ pela Fórmula (57)
    Então κ deve ser ≈ 1,3993 dentro de TOLERÂNCIA_QA_ENV_AMPAI
    E a corrente de crista i_p deve ser ≈ 27947 A (≈ 27,95 kA) dentro de TOLERÂNCIA_QA_ENV_AMPAI
    # Conferência secundária subordinada: Schneider arredonda κ=1,4 → i_p=27,96 kA.

  @caminho-feliz @gerador @maquina-isolada
  Cenário: TC-M22-03 — MÁQUINA ISOLADA nos terminais (R_Gf/X''d = 0,05; SEM impedância série)
    Dado um gerador com U_rG = 21000 V e S_rG = 250000000 VA   # 250 MVA
    E reatância subtransitória X''d = 0,2999 Ω
    E NENHUMA impedância série no ramo (máquina isolada nos terminais)
    E a corrente inicial do gerador I''kG = 44740 A
    Quando eu determino R_Gf pela faixa aplicável (U_rG>1 kV e S_rG≥100 MVA → 0,05·X''d)
    E como não há série, R_eq/X_eq = R_Gf/X''d = 0,05
    Então R_Gf deve ser 0,014995 Ω
    E κ deve ser ≈ 1,8635 dentro de TOLERÂNCIA_QA_ENV_AMPAI
    E a corrente de crista i_p = κ·√2·I''kG deve ser ≈ 117907 A (≈ 117,9 kA) dentro de TOLERÂNCIA_QA_ENV_AMPAI
    # Este é o caso DEGENERADO de máquina isolada. NÃO generalizar para ramos com série.

  @caminho-feliz @gerador @ramo-completo
  Cenário: TC-M22-ramo-completo — RAMO COMPLETO de gerador COM impedância série: R/X deixa de ser 0,05
    Dado um gerador com reatância subtransitória X''d = 0,30 Ω
    E R_Gf = 0,05·X''d = 0,015 Ω (faixa RGf-1, componente ISOLADO da máquina)
    E uma impedância SÉRIE no ramo (transformador/cabo/reator) com R_L = 0,10 Ω e X_L = 0,20 Ω
    E a corrente inicial do ramo I''k = 20000 A
    Quando eu monto o equivalente série do ramo completo
    Então R_eq = R_Gf + R_L = 0,115 Ω
    E X_eq = X''d + X_L = 0,50 Ω
    E R_eq/X_eq = 0,23 (≠ 0,05 — a razão do ramo NÃO é a razão isolada da máquina)
    E κ = 1,02 + 0,98·e^(-3·0,23) deve ser ≈ 1,5115 dentro de TOLERÂNCIA_QA_ENV_AMPAI
    E a corrente de crista i_p = κ·√2·I''k deve ser ≈ 42753 A (≈ 42,75 kA) dentro de TOLERÂNCIA_QA_ENV_AMPAI
    # Prova de que transformador/cabo/reator NÃO podem ser ignorados no cálculo de κ.

  @caminho-feliz @multiplas-alimentacoes-simples
  Cenário: TC-M22-mult — Duas alimentações simples: κ_i e i_pi por ramo, depois soma (Fórmula 59)
    Dado duas alimentações simples independentes, radiais, sem impedâncias paralelas entre elas
    E o ramo A com I''kA = 14122,7 A, R_eq = 0,00518 Ω e X_eq = 0,01637 Ω   # R/X = 0,316432
    E o ramo B (máquina isolada) com I''kB = 44740 A e R_eq/X_eq = 0,05
    Quando eu calculo cada contribuição de crista separadamente
    Então κ_A ≈ 1,3993 e i_pA ≈ 27947 A (≈ 27,95 kA)
    E κ_B ≈ 1,8635 e i_pB ≈ 117907 A (≈ 117,9 kA)
    E a corrente de crista total pela Fórmula (59) i_p = i_pA + i_pB deve ser ≈ 145854 A (≈ 145,9 kA)
    # Válido APENAS para múltiplas alimentações simples (radiais). Rede multiple-fed (§8.1.2) → TC-M22-escopo-multifed.

  # ── Três faixas de R_Gf (componente ISOLADO da máquina; §8.1.1) ────────────

  @caminho-feliz @rgf @maquina-isolada
  Esquema do Cenário: R_Gf — três faixas normativas (componente isolado da máquina)
    Dado um gerador com U_rG = <UrG> V e S_rG = <SrG> VA
    E reatância subtransitória X''d = <Xdd> Ω
    Quando eu determino a resistência fictícia R_Gf do componente isolado da máquina
    Então R_Gf deve ser <fator>·X''d = <resultado> Ω

    Exemplos:
      | caso                  | UrG   | SrG        | Xdd  | fator | resultado |
      | HV, S≥100MVA (RGf-1)  | 20000 | 250000000  | 0,3  | 0,05  | 0,015     |
      | HV, S<100MVA  (RGf-2) | 6000  | 50000000   | 0,3  | 0,07  | 0,021     |
      | LV, U≤1000V   (RGf-3) | 400   | 800000     | 0,3  | 0,15  | 0,045     |

  @caminho-feliz @rgf @fronteira
  Cenário: TC-M22-RGf-1kV — U_rG = 1 kV cai na faixa LV (0,15·X''d)
    Dado um gerador com U_rG = 1000 V e S_rG = 250000000 VA e X''d = 0,3 Ω
    Quando eu determino R_Gf do componente isolado
    Então como "U_rG > 1 kV" é falso e "U_rG ≤ 1000 V" é verdadeiro, aplica-se RGf-3
    E R_Gf deve ser 0,15·X''d = 0,045 Ω

  @caminho-feliz @rgf @fronteira
  Cenário: TC-M22-RGf-100MVA — S_rG = 100 MVA cai na faixa 0,05·X''d
    Dado um gerador com U_rG = 20000 V e S_rG = 100000000 VA e X''d = 0,3 Ω
    Quando eu determino R_Gf do componente isolado
    Então como "S_rG ≥ 100 MVA" é verdadeiro, aplica-se RGf-1
    E R_Gf deve ser 0,05·X''d = 0,015 Ω

  # ══════════════════════════════════════════════════════════════════════════
  #  X=0 — DEDUÇÃO_MATEMÁTICA_RATIFICADA (limite unilateral X → 0⁺, dentro do perfil indutivo)
  # ══════════════════════════════════════════════════════════════════════════

  @tratamento @deducao-ratificada
  Cenário: TC-M22-X0 — X=0 com R>0: κ = 1,02 por limite unilateral X → 0⁺ (DEDUÇÃO_MATEMÁTICA_RATIFICADA)
    Dado uma corrente inicial simétrica I''k = 10000 A
    E uma resistência de curto do ramo R_eq = 0,02 Ω
    E uma reatância de curto do ramo X_eq = 0 Ω          # X → 0⁺, R/X → ∞ (limite unilateral)
    Quando eu calculo o fator κ pela extensão pelo limite unilateral X → 0⁺, dentro do perfil indutivo suportado, da Fórmula (57)
    Então κ deve ser exatamente 1,02 (limite unilateral X → 0⁺; DEDUÇÃO_MATEMÁTICA_RATIFICADA)
    E a corrente de crista i_p = 1,02·√2·I''k deve ser ≈ 14425 A (≈ 14,42 kA) dentro de TOLERÂNCIA_QA_ENV_AMPAI
    E o resultado é determinístico (sem aviso e sem bloqueio)

  # ══════════════════════════════════════════════════════════════════════════
  #  CAMINHOS TRISTES (bloqueios físicos, estruturais e fora-de-perfil)
  # ══════════════════════════════════════════════════════════════════════════

  @bloqueio @fisico
  Cenário: TC-M22-BLK-Ik0 — BLOQUEIO físico: I''k = 0 A
    Dado uma corrente inicial simétrica I''k = 0 A
    E R_eq = 0,005 Ω e X_eq = 0,016 Ω
    Quando eu tento calcular a corrente de crista i_p
    Então o motor rejeita a entrada e não produz corrente de crista
    E a natureza do bloqueio é classificada como física

  @bloqueio @fisico
  Cenário: TC-M22-BLK-IkNeg — BLOQUEIO físico: I''k negativa
    Dado uma corrente inicial simétrica I''k = -14000 A
    E R_eq = 0,005 Ω e X_eq = 0,016 Ω
    Quando eu tento calcular a corrente de crista i_p
    Então o motor rejeita a entrada e não produz corrente de crista
    E a natureza do bloqueio é classificada como física

  @bloqueio @fisico
  Cenário: TC-M22-BLK-Req-neg — BLOQUEIO físico: R_eq negativa (resistência passiva ≥ 0)
    Dado uma resistência de curto do ramo R_eq = -0,005 Ω
    E uma reatância de curto do ramo X_eq = 0,016 Ω
    E uma corrente inicial simétrica I''k = 14000 A
    Quando eu tento calcular a corrente de crista i_p
    Então o motor rejeita a entrada e não produz corrente de crista
    E a natureza do bloqueio é classificada como física (rede passiva: R ≥ 0)

  @bloqueio @fora-do-perfil
  Cenário: TC-M22-BLK-Xneg — X_eq negativa: FORA_DO_PERFIL_M22_V1 (não "impossível")
    Dado uma resistência de curto do ramo R_eq = 0,005 Ω
    E uma reatância de curto do ramo X_eq = -0,016 Ω     # capacitiva
    E uma corrente inicial simétrica I''k = 14000 A
    Quando eu tento calcular a corrente de crista i_p
    Então o motor rejeita a entrada em runtime e não produz corrente de crista
    E a justificativa é FORA_DO_PERFIL_M22_V1
    E vale o texto: "M22 v1 suporta ramos equivalentes passivos indutivos com R >= 0 e X >= 0. X < 0 pode ocorrer em redes com compensação capacitiva, mas permanece fora do perfil suportado nesta versão."

  @bloqueio @fisico
  Cenário: TC-M22-BLK-Zk0 — BLOQUEIO físico: R=0 e X=0 (curto franco, κ indeterminado)
    Dado uma resistência de curto do ramo R_eq = 0 Ω
    E uma reatância de curto do ramo X_eq = 0 Ω
    E uma corrente inicial simétrica I''k = 14000 A
    Quando eu tento calcular κ (R/X = 0/0 indeterminado)
    Então o motor rejeita a entrada e não produz corrente de crista
    E a natureza do bloqueio é classificada como física (curto franco — já vetado por M15/M16)

  @bloqueio @pre-condicao-m15
  Cenário: TC-M22-BLK-referencia — Parcelas sem referência comum ou em níveis de tensão incompatíveis
    Dado parcelas de R_eq/X_eq que NÃO estão referidas ao mesmo nível de tensão
    E que os fatores de correção/normalização (t_r², K_T, K_G, …) NÃO foram incorporados antes de M22
    Quando eu tento somar as parcelas e calcular κ
    Então o motor rejeita a entrada e não produz corrente de crista
    E o bloqueio decorre da pré-condição canônica do M15 (referência comum e normalização antes da soma)
    E M22 não deve normalizar por conta própria nem somar impedâncias brutas de lados de tensão diferentes
    # Não inventar código RFC 7807 nesta fase (competência do CTO no SDD).

  @bloqueio @fisico @rgf
  Esquema do Cenário: TC-M22-BLK-gerador — BLOQUEIO físico em R_Gf: <grandeza> ≤ 0
    Dado um gerador com U_rG = <UrG> V, S_rG = <SrG> VA e X''d = <Xdd> Ω
    Quando eu tento determinar R_Gf
    Então o motor rejeita a entrada e não produz R_Gf
    E a natureza do bloqueio é classificada como física

    Exemplos:
      | grandeza | UrG   | SrG        | Xdd |
      | X''d     | 20000 | 250000000  | 0   |
      | U_rG     | 0     | 250000000  | 0,3 |
      | U_rG     | -20000| 250000000  | 0,3 |
      | S_rG     | 20000 | 0          | 0,3 |
      | S_rG     | 20000 | -250000000 | 0,3 |

  @bloqueio @estrutural
  Esquema do Cenário: TC-M22-BLK-estrut — <grandeza> = "<valor_invalido>"
    Dado que a grandeza "<grandeza>" recebe o valor inválido "<valor_invalido>"
    E que as demais grandezas são numéricas, finitas e válidas em SI
    Quando eu tento calcular a corrente de crista i_p (ou R_Gf, se a grandeza for de gerador)
    Então o motor rejeita a entrada e não produz resultado
    E a natureza do bloqueio é classificada como estrutural

    Exemplos:
      | grandeza | valor_invalido     |
      | I''k     | ausente            |
      | I''k     | texto não numérico |
      | I''k     | NaN                |
      | I''k     | Infinity           |
      | I''k     | -Infinity          |
      | R_eq     | ausente            |
      | R_eq     | NaN                |
      | X_eq     | ausente            |
      | X_eq     | Infinity           |
      | X''d     | NaN                |
      | X''d     | -Infinity          |
      | U_rG     | texto não numérico |
      | S_rG     | ausente            |

  # ══════════════════════════════════════════════════════════════════════════
  #  SEPARAÇÃO DE ESCOPO (casos ainda NÃO suportados por M22)
  # ══════════════════════════════════════════════════════════════════════════

  @escopo @nao-suportado
  Cenário: TC-M22-escopo-multifed — Rede multiple-fed (§8.1.2) NÃO é M22
    Dado um sistema com impedâncias paralelas entre as fontes (rede multiple-fed, §8.1.2)
    Quando o caso é submetido a M22
    Então M22 deve sinalizar "não suportado — pertence a §8.1.2 / M23"
    E não deve aplicar a soma de contribuições independentes (Fórmula 59)
    # §8.1.2 exige κ único no ponto de falta (métodos a/b/c, fator 1,15, tetos 1,8 BT / 2,0 AT, Fórmula 61).

  @escopo @nao-suportado
  Cenário: TC-M22-escopo-conversor — Conversor full-size (Fórmula 58) NÃO é M22
    Dado uma fonte conectada por conversor de potência plena
    Quando o caso é submetido a M22
    Então M22 deve sinalizar "não suportado — conversor usa i_p = √2·I''kPF (Fórmula 58), sem κ"
    E não deve aplicar o fator κ da Fórmula (57)
