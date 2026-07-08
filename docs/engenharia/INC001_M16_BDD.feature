# language: pt
# ─────────────────────────────────────────────────────────────────────────────
# O.S.: INC-001-01  ·  Capacidade: M16 — corrente inicial simétrica trifásica I''k
# Fase: Ciência / BDD  ·  Autor: @Engenheiro_Eletricista (AmpAI Governança v7.0)
# Baseline canônica da O.S.: main@bf0d592a215353d3f5382ed4f7234d85340bbb18
# Fonte vinculante: docs/engenharia/RNC-C_Fundacao_M00_M04_M15.md (RATIFICADO), §9.3
#                   IEC 60909-0:2016, cláusula 7.2.1 e Tabela 1 (5.3.1)
# Numeração da fórmula: "Fórmula (33)" VERIFICADA na fonte (RNC-P IEC 60909-0-2016.md,
#                   §7.2.1: prosa "using Formula (33)" + equação numerada (33) concordam).
#                   Âncora robusta = §7.2.1; numeração confirmada na extração RNC-P.
# Gabarito secundário (subordinado): Schneider CT-158 §3.5 Problema 1 (TC-M16-01)
#
# ESTADO: M16 = implementado_sem_validacao. Estes cenários são CANDIDATOS
#         experimental / PROP. Este arquivo NÃO valida M16, NÃO o promove a
#         `stable` e NÃO reproduz mensagens textuais da implementação atual —
#         descreve apenas comportamento científico observável.
#
# Convenção de unidades (SI): U_n em volts (V); |Z_k| em ohms (Ω); c adimensional;
#         I''k em amperes (A), reportado também em quiloamperes (kA).
# Convenção de U_n: tensão NOMINAL do sistema (não a tensão de placa do enrolamento).
# ─────────────────────────────────────────────────────────────────────────────

@experimental @PROP @M16 @INC-001 @iec60909-7.2.1
Funcionalidade: M16 — Corrente inicial simétrica trifásica I''k (IEC 60909-0:2016, 7.2.1)

  Como motor científico do AmpAI
  Quero calcular I''k = c·U_n / (√3·|Z_k|) a partir de U_n, |Z_k| e c em unidades SI
  Para que a corrente de curto trifásica seja obtida com prova contestável,
  bloqueando toda entrada fisicamente, normativamente ou estruturalmente inválida.

  # Origem das regras (classificação obrigatória):
  #  - Fórmula I''k .................. norma primária (IEC 60909-0:2016, Fórmula 33)
  #  - U_n = tensão nominal ......... RNC-C ratificado + norma primária (5.3.1)
  #  - Conjunto discreto de c ....... norma primária (Tabela 1) + RNC-C §9.3
  #  - Bloqueios U_n≤0 / |Z_k|≤0 .... dedução matemática (impossibilidade física)
  #  - Bloqueio c fora do conjunto .. norma primária (Tabela 1)
  #  - Bloqueio c ausente/não-finito. estrutural (contrato de interface)
  Contexto:
    Dado que o motor aplica a fórmula "I''k = c·U_n / (raiz(3)·|Z_k|)" (IEC 60909-0:2016, 7.2.1, Fórmula 33)
    E que U_n é a tensão nominal do sistema, expressa em volts
    E que |Z_k| é o módulo da impedância equivalente no ponto de falta, expresso em ohms
    E que c é o fator de tensão adimensional da Tabela 1 (IEC 60909-0:2016, 5.3.1)
    E que o perfil IEC vigente admite c somente no conjunto discreto {0,90; 0,95; 1,00; 1,05; 1,10}
    E que valores de c fora desse conjunto — mesmo dentro da faixa [0,90; 1,10] — não são tabelados

  # CONTRATO DE UNIDADES (precondição, NÃO bloqueio runtime):
  #   V, Ω e A são PRECONDIÇÕES do contrato. Um método que recebe números crus
  #   NÃO distingue 0,017 Ω de 0,017 mΩ; portanto NÃO há bloqueio runtime de
  #   unidade errada. A normalização/conversão para SI ocorre ANTES da chamada,
  #   ou exigiria um DTO tipado futuro (definição no SDD, fora de escopo).

  # ══════════════════════════════════════════════════════════════════════════
  #  CAMINHOS FELIZES (cálculo exato — gabarito reproduzível)
  # ══════════════════════════════════════════════════════════════════════════

  @caminho-feliz @gabarito-schneider
  Cenário: TC-M16-01 — I''k no ponto de falta do gabarito Schneider (c máximo BT)
    # Gabarito CT-158 §3.5 Problema 1: U_n é a tensão NOMINAL do sistema = 400 V,
    # e NÃO os 410 V de placa do enrolamento (determinação vinculante do RNC-C).
    Dado uma tensão nominal do sistema U_n = 400 V
    E um módulo de impedância de curto |Z_k| = 0,01717 Ω    # equivalente a 17,17 mΩ
    E um fator de tensão c = 1,05                            # pertence ao conjunto discreto
    Quando eu calculo a corrente inicial simétrica trifásica I''k
    Então o motor produz I''k ≈ 14,1227206 kA com tolerância relativa de 0,01%
    E o resultado equivale a ≈ 14122,7206 A

  @caminho-feliz @ilustrativo
  Cenário: TC-M16-05 — I''k com fator de tensão mínimo BT (c = 0,95)
    # Caso ilustrativo de corrente mínima; U_n = 410 V conforme dados declarados na O.S.
    Dado uma tensão nominal do sistema U_n = 410 V
    E um módulo de impedância de curto |Z_k| = 0,017 Ω      # equivalente a 17,0 mΩ
    E um fator de tensão c = 0,95                            # pertence ao conjunto discreto
    Quando eu calculo a corrente inicial simétrica trifásica I''k
    Então o motor produz I''k ≈ 13,2281135 kA com tolerância relativa de 0,01%
    E o resultado equivale a ≈ 13228,1135 A

  # ══════════════════════════════════════════════════════════════════════════
  #  CAMINHOS TRISTES (bloqueios — nenhuma corrente deve ser produzida)
  # ══════════════════════════════════════════════════════════════════════════

  @bloqueio @fisico
  Cenário: TC-M16-02 — BLOQUEIO físico: tensão nominal nula (divisão física impossível)
    Dado uma tensão nominal do sistema U_n = 0 V
    E um módulo de impedância de curto |Z_k| = 0,017 Ω
    E um fator de tensão c = 1,05
    Quando eu tento calcular a corrente inicial simétrica trifásica I''k
    Então o motor rejeita a entrada e não produz corrente
    E a natureza do bloqueio é classificada como física
    # Justificativa: U_n ≤ 0 é fisicamente impossível; anula o numerador c·U_n.

  @bloqueio @fisico
  Cenário: TC-M16-03 — BLOQUEIO físico: impedância de curto nula (I''k → infinito)
    Dado uma tensão nominal do sistema U_n = 410 V
    E um módulo de impedância de curto |Z_k| = 0 Ω
    E um fator de tensão c = 1,05
    Quando eu tento calcular a corrente inicial simétrica trifásica I''k
    Então o motor rejeita a entrada e não produz corrente
    E a natureza do bloqueio é classificada como física
    # Justificativa: |Z_k| = 0 é curto franco → divisão por zero → I''k tenderia a infinito.

  @bloqueio @normativo
  Cenário: TC-M16-04 — BLOQUEIO normativo: c acima do topo da Tabela 1 (c = 1,15 > 1,10)
    Dado uma tensão nominal do sistema U_n = 410 V
    E um módulo de impedância de curto |Z_k| = 0,017 Ω
    E um fator de tensão c = 1,15
    Quando eu tento calcular a corrente inicial simétrica trifásica I''k
    Então o motor rejeita a entrada e não produz corrente
    E a natureza do bloqueio é classificada como normativa
    # Justificativa: c = 1,15 excede o máximo 1,10 da Tabela 1 (IEC 60909-0:2016, 5.3.1).

  @bloqueio @normativo
  Cenário: TC-M16-06 — BLOQUEIO normativo: c abaixo da Tabela 1 (c = 0,85 < 0,90)
    Dado uma tensão nominal do sistema U_n = 410 V
    E um módulo de impedância de curto |Z_k| = 0,017 Ω
    E um fator de tensão c = 0,85
    Quando eu tento calcular a corrente inicial simétrica trifásica I''k
    Então o motor rejeita a entrada e não produz corrente
    E a natureza do bloqueio é classificada como normativa
    # Justificativa: c = 0,85 é inferior ao mínimo 0,90 da Tabela 1.
    # NOTA PROP: o motor ATUAL ainda aceita c = 0,85 (gap conhecido; comportamento proposto).

  @bloqueio @normativo
  Cenário: TC-M16-07 — BLOQUEIO normativo: c não tabelado dentro da faixa (c = 0,93)
    Dado uma tensão nominal do sistema U_n = 410 V
    E um módulo de impedância de curto |Z_k| = 0,017 Ω
    E um fator de tensão c = 0,93
    Quando eu tento calcular a corrente inicial simétrica trifásica I''k
    Então o motor rejeita a entrada e não produz corrente
    E a natureza do bloqueio é classificada como normativa
    # Justificativa: 0,93 ∈ [0,90; 1,10] porém NÃO pertence ao conjunto discreto
    # {0,90; 0,95; 1,00; 1,05; 1,10}; não é um valor tabelado.
    # NOTA PROP: o motor ATUAL ainda aceita c = 0,93 (gap conhecido; comportamento proposto).

  # ══════════════════════════════════════════════════════════════════════════
  #  COMPLEMENTAÇÃO O.S. INC-001-01-R  (não substitui TC-M16-01 a TC-M16-07)
  # ══════════════════════════════════════════════════════════════════════════

  # ── Item 2: semântica de ≤ 0 — os TCs 02/03 cobrem o zero; abaixo, os negativos.

  @bloqueio @fisico @complemento
  Cenário: TC-M16-02b — BLOQUEIO físico: tensão nominal NEGATIVA (U_n = -400 V)
    Dado uma tensão nominal do sistema U_n = -400 V
    E um módulo de impedância de curto |Z_k| = 0,017 Ω
    E um fator de tensão c = 1,05
    Quando eu tento calcular a corrente inicial simétrica trifásica I''k
    Então o motor rejeita a entrada e não produz corrente
    E a natureza do bloqueio é classificada como física
    # Justificativa: tensão nominal do sistema não pode ser negativa (impossibilidade física).

  @bloqueio @fisico @complemento
  Cenário: TC-M16-03b — BLOQUEIO físico: impedância de curto NEGATIVA (|Z_k| = -0,017 Ω)
    Dado uma tensão nominal do sistema U_n = 410 V
    E um módulo de impedância de curto |Z_k| = -0,017 Ω
    E um fator de tensão c = 1,05
    Quando eu tento calcular a corrente inicial simétrica trifásica I''k
    Então o motor rejeita a entrada e não produz corrente
    E a natureza do bloqueio é classificada como física
    # Justificativa: o módulo de uma impedância é não-negativo; valor < 0 é impossível.

  # ── Item 1: entradas estruturalmente inválidas (ausente / não numérico / NaN / ±Infinity).
  #    Em cada linha, exatamente UMA grandeza recebe o valor inválido; as outras duas
  #    são numéricas finitas e válidas (U_n = 410 V, |Z_k| = 0,017 Ω, c = 1,05).

  @bloqueio @estrutural @complemento
  Esquema do Cenário: Entrada estruturalmente inválida — <grandeza> = "<valor_invalido>"
    Dado que a grandeza "<grandeza>" recebe o valor inválido "<valor_invalido>"
    E que as demais grandezas são numéricas, finitas e válidas em SI
    Quando eu tento calcular a corrente inicial simétrica trifásica I''k
    Então o motor rejeita a entrada e não produz corrente
    E a natureza do bloqueio é classificada como estrutural

    Exemplos:
      | grandeza | valor_invalido      |
      | U_n      | ausente             |
      | U_n      | texto não numérico  |
      | U_n      | NaN                 |
      | U_n      | Infinity            |
      | U_n      | -Infinity           |
      | Z_k      | ausente             |
      | Z_k      | texto não numérico  |
      | Z_k      | NaN                 |
      | Z_k      | Infinity            |
      | Z_k      | -Infinity           |
      | c        | ausente             |
      | c        | texto não numérico  |
      | c        | NaN                 |
      | c        | Infinity            |
      | c        | -Infinity           |
