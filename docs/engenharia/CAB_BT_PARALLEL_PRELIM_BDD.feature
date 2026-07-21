# language: pt
# status: EXPERIMENTAL_PRELIMINAR_NAO_CANONICO
# uso: LABORATORIO_APENAS
# proibido_para: PROJETO_COMPRA_INSTALACAO_MEMORIAL_FINAL
# fonte_primaria_completa: AUSENTE
# estado_producao: BLOQUEADO
# os: CAB-BT-PARALLEL-001-SCI-PRELIM
# baseline: origin/main@006a56c4d2412d83548129b24aac10a4692dc4fa
# persona: @Engenheiro_Eletricista
# irmaos: RNC-P_CAB_BT_PARALLEL_PRELIM.md, CAB_BT_PARALLEL_PRELIM_Memorial.md
#
# AVISO: cenarios de LABORATORIO. Descrevem apenas fisica de teoria de circuitos
# (livre) e o comportamento fail-closed do prototipo experimental. NENHUM cenario
# emite conformidade IEC nem valores normativos (k_g, k, limites) — todos BLOQUEADOS.

Funcionalidade: Estudo experimental de condutores em paralelo por fase (BT)
  Como Engenheiro Eletricista em laboratorio
  Quero uma fundacao fisica contestavel para multiplos condutores em paralelo
  A fim de preparar um SDD experimental sem afirmar conformidade normativa

  Contexto:
    Dado um conjunto de "n_p" condutores por fase ligados aos mesmos dois nos (barra a barra)
    E que a norma primaria IEC 60364-5-52 Ed. 3.1 esta AUSENTE
    E que todo fator de agrupamento, constante adiabatica e limite e ASSUMPTION_ONLY
    E que o desbalanco de carga "delta_load" NAO e reutilizavel como desbalanco de falta "delta_fault"
    E que todo valor "aproximado" segue a TOLERANCIA_COMPUTACIONAL_LAB_AMPAI = +-0,5% relativo (deterministica, NAO normativa IEC)
    E que o prototipo opera com "estado_producao: BLOQUEADO"

  # ───────────────────────── CAMINHOS MATEMATICOS PRELIMINARES ─────────────────────────

  Cenario: [Fisica] Divisao de corrente por admitancias
    Dado ramos com impedancias "Z_i" e admitancias "Y_i = 1/Z_i"
    Quando calculo a corrente de cada ramo
    Entao "I_i = I_tot * Y_i / soma(Y_k)"
    E a soma complexa das fracoes "f_i" e exatamente "1 + 0j"
    E a soma dos modulos "|f_i|" e maior ou igual a 1

  Cenario: [Feliz] Compartilhamento ideal com ramos identicos
    Dado 3 ramos identicos "Z = 0,020 + 0,024j ohm" e "I_tot = 900 A"
    Quando calculo a divisao de corrente
    Entao cada ramo conduz "300,00 A"
    E o fator de desbalanco de carga "delta_load" e "1,0000"
    E "Z_eq = Z/3 = 0,006667 + 0,008000j ohm"
    E o resultado NAO e rotulado como "conforme IEC"

  Cenario: [Triste] Compartilhamento desigual por assimetria de reatancia
    Dado 4 ramos com "R = 0,020 ohm" e reatancias "{0,030; 0,024; 0,024; 0,018} ohm"
    E "I_tot = 1200 A"
    Quando calculo a divisao de corrente
    Entao o ramo de menor reatancia conduz "347,33 A"
    E o ramo de maior reatancia conduz "259,20 A"
    E o fator de desbalanco de CARGA "delta_load" e "1,1578" (+15,8%)
    E a ampacidade util do conjunto e derada por "1/delta_load = 0,8637"
    E o prototipo EXIGE dimensionar cada ramo pela corrente do ramo mais carregado
    E "delta_load" NAO pode ser reutilizado no calculo de curto-circuito

  Esquema do Cenario: [Sensibilidade] Assimetria resistiva por comprimento
    Dado 3 ramos com "R = 0,020 ohm" e um ramo com comprimento "<fator>"
    Quando calculo a divisao de corrente
    Entao o desbalanco de carga "delta_load" e aproximadamente "<delta_load>"

    Exemplos:
      | fator   | delta_load |
      | 1.00    | 1,0000     |
      | 1.05    | 1,0161     |

  # ───────────────────────── PROVENIENCIA E ENTRADAS AUSENTES ─────────────────────────

  Cenario: [Triste] Fator de agrupamento k_g ausente
    Dado que "k_g" nao foi informado como entrada explicita
    Quando o prototipo tenta corrigir a ampacidade
    Entao o calculo e BLOQUEADO com motivo "k_g AUSENTE — ASSUMPTION_ONLY obrigatorio (B-02)"
    E nenhum "k_g" e presumido a partir de guia secundario

  Cenario: [Triste] Proveniencia de um fator nao declarada
    Dado um fator numerico fornecido sem origem/proveniencia
    Quando o prototipo tenta usa-lo no memorial
    Entao o uso e BLOQUEADO com motivo "PROVENIENCIA AUSENTE"
    E o fator so e aceito se marcado explicitamente como "ASSUMPTION_ONLY" com origem

  Cenario: [Triste] Sem geometria, mas com todos os Z_i explicitos (ASSUMPTION_ONLY)
    Dado que a geometria/posicao relativa NAO foi informada
    E que TODOS os "Z_i" sao fornecidos explicitamente como ASSUMPTION_ONLY
    Quando o prototipo calcula a divisao de corrente
    Entao o resultado e rotulado "MATHEMATICAL_ONLY"
    E qualquer alegacao de "adequacao de engenharia" ou "conformidade IEC" e BLOQUEADA
    E um mero AVISO NAO e considerado suficiente para uso tecnico
    E o Anexo H (informativo) e citado apenas como relevancia tecnica, nunca como requisito normativo

  Cenario: [Bloqueio] Sem geometria e sem Z_i explicitos
    Dado que a geometria/posicao relativa NAO foi informada
    E que os "Z_i" NAO foram fornecidos
    Quando o prototipo tenta calcular a divisao de corrente
    Entao o calculo e BLOQUEADO com motivo "sem geometria e sem Z_i — indeterminado"
    E nenhum numero utilizavel e produzido
    E qualquer alegacao de adequacao de engenharia ou conformidade IEC e BLOQUEADA

  Cenario: [Triste] Seccao, material ou comprimento divergentes entre ramos
    Dado ramos com seccao, material ou comprimento diferentes
    Quando calculo a divisao de corrente
    Entao o prototipo usa impedancias distintas por ramo
    E reporta "delta_load > 1" e o ramo mais carregado
    E NAO aplica a simplificacao "I_tot/n_p"

  # ───────────────────────── VALIDACAO DE ENTRADAS ─────────────────────────

  Esquema do Cenario: [Triste] Numero de paralelos invalido
    Dado "n_p = <n>"
    Quando o prototipo valida a entrada
    Entao o resultado e "<resultado>"

    Exemplos:
      | n   | resultado                                  |
      | 0   | ERRO: n_p deve ser inteiro >= 1            |
      | -2  | ERRO: n_p deve ser inteiro >= 1            |
      | 1.5 | ERRO: n_p deve ser inteiro                 |
      | 1   | OK: caso degenerado (condutor unico)       |
      | 4   | OK: conjunto em paralelo                   |

  Cenario: [Triste] Terminais incompativeis com o numero de vias
    Dado "n_p" vias por fase
    E terminais/lugs que nao acomodam "n_p" condutores
    Quando o prototipo verifica a terminacao
    Entao emite AVISO experimental "terminacao incompativel — verificar 526/526.8 (AUSENTE)"
    E marca o item como BLOQUEADO para producao

  # ───────────────── CURTO-CIRCUITO: delta_fault e INDEPENDENTE de delta_load ─────────────────

  Cenario: [Bloqueio] Curto-circuito nao pode herdar o desbalanco de carga
    Dado um desbalanco de carga "delta_load" ja calculado em regime de carga
    Quando o prototipo tenta o adiabatico de curto-circuito
    Entao e PROIBIDO usar "delta_load" como "delta_fault"
    E e PROIBIDO presumir admitancias iguais nos regimes de carga e de falta
    E a divisao de carga NAO e aceita como prova da divisao da corrente de falta
    E o adiabatico so aceita: "delta_fault" explicito ASSUMPTION_ONLY, OU cenario extremo conservador, OU bloqueio
    E sem modelo de falta o resultado adiabatico e BLOQUEADO

  Esquema do Cenario: [Fisica] Adiabatico por ramo com delta_fault explicito
    Dado "I_k_tot = 20000 A", "t = 0,2 s" e "k = 115" (ASSUMPTION_ONLY)
    E "n_p = 3" e "delta_fault = <df>" fornecido explicitamente como ASSUMPTION_ONLY
    Quando calculo "S_min = (I_k_tot/n_p)*delta_fault*sqrt(t)/k" com "k" em "A.s^0.5/mm2"
    Entao "S_min" e aproximadamente "<S>" mm2 (dentro da TOLERANCIA_COMPUTACIONAL_LAB_AMPAI)
    E o resultado NAO e rotulado "conforme IEC"

    Exemplos:
      | df   | S      |
      | 1,00 | 25,93  |
      | 1,10 | 28,52  |

  Cenario: [Conservador] CENARIO_CONSERVADOR_ESCOLHIDO — 1 ramo conduz a falta total
    Dado que um unico ramo remanescente pode conduzir a falta total "I_k_tot = 20000 A"
    E "t = 0,2 s" e "k = 115 A.s^0.5/mm2" (ASSUMPTION_ONLY)
    Quando aplico o adiabatico extremo "S_min = I_k_tot*sqrt(t)/k"
    Entao "S_min" e aproximadamente "77,78" mm2 (dentro da TOLERANCIA_COMPUTACIONAL_LAB_AMPAI)
    E o cenario e identificado como "CENARIO_CONSERVADOR_ESCOLHIDO"
    E declara-se que "delta_fault = n_p" e o rotulo aritmetico deste cenario, NAO um limite universal
    E seu dominio fisico e "demais ramos abertos por fusivel/falta, ou maldistribuicao extrema"
    E permanece BLOQUEADO para producao ate a norma de protecao (IEC 60364-4-43, AUSENTE)

  # ───────────── FAIL-CLOSED NUMERICO (entradas invalidas ou nao finitas) ─────────────

  Esquema do Cenario: [Bloqueio] Entradas invalidas ou nao finitas sao rejeitadas deterministicamente
    Dado a entrada "<parametro>" com valor "<valor>"
    Quando o prototipo valida a entrada ANTES de qualquer calculo
    Entao o resultado e "BLOQUEADO: <motivo>"
    E nenhum numero utilizavel e produzido silenciosamente

    Exemplos:
      | parametro   | valor | motivo                                            |
      | Z_i         | 0     | Z_i = 0 -> admitancia infinita (divisao por zero) |
      | Z_i         | Inf   | Z_i nao finito                                    |
      | Z_i         | NaN   | Z_i nao finito                                    |
      | I_k         | -1    | I_k < 0 fisicamente impossivel                    |
      | I_k         | NaN   | I_k nao finito                                    |
      | t           | -0,1  | t < 0 fisicamente impossivel                      |
      | t           | Inf   | t nao finito                                      |
      | k           | 0     | k <= 0 invalido (divisao por zero)                |
      | k           | -5    | k <= 0 invalido                                   |
      | delta_fault | 0,5   | delta_fault < 1 invalido (abaixo do share ideal)  |
      | delta_fault | -1    | delta_fault invalido                              |
      | delta_fault | Inf   | delta_fault nao finito                            |

  # ───────────────────────── FAIL-CLOSED NORMATIVO ─────────────────────────

  Cenario: [Bloqueio] Tentativa de emitir conformidade IEC
    Dado qualquer resultado preliminar de laboratorio
    Quando alguem solicita rotular a saida como "conforme IEC 60364-5-52"
    Entao o prototipo RECUSA com motivo "norma primaria AUSENTE — conformidade PROIBIDA (B-06)"
    E o veredito permanece experimental

  Cenario: [Bloqueio] Tentativa de gerar memorial final de projeto
    Dado "estado_producao: BLOQUEADO"
    Quando alguem solicita um memorial final para projeto/compra/instalacao
    Entao o prototipo RECUSA com motivo "LABORATORIO_APENAS — proibido_para PROJETO_COMPRA_INSTALACAO_MEMORIAL_FINAL"
    E nenhum artefato de producao e emitido

  Cenario: [Experimental] Recomendacao qualitativa de barramento/busway
    Dado "n_p" crescente e/ou "delta_load" elevado e/ou seccao total inviavel
    Quando o prototipo avalia as variaveis de decisao experimentais
    Entao pode emitir recomendacao QUALITATIVA de barramento/busway
    E a recomendacao e marcada "experimental, NAO-IEC (limiar normativo AUSENTE — B-04)"
    E nenhum limiar numerico normativo e afirmado
