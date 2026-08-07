# language: pt
# status: EXPERIMENTAL_PRELIMINAR_NAO_CANONICO
# uso: LABORATORIO_APENAS
# proibido_para: PROJETO_COMPRA_INSTALACAO_MEMORIAL_FINAL
# fonte_primaria_completa: AUSENTE
# estado_producao: BLOQUEADO
# productionAllowed: false
# os: CAB-BT-PARALLEL-002-SCI-PRACTICAL
# baseline: origin/main@83e24131c0cc09813be65a5fa269961b9cc80c5c
# nucleo_integrado: js/core_cabos_bt_parallel_experimental.js (CAB-BT-PARALLEL-EXP-1, PR #39)
# persona: @Engenheiro_Eletricista
# irmaos: RNC-P_CAB_BT_PARALLEL_SELECTION_PRELIM.md, CAB_BT_PARALLEL_SELECTION_PRELIM_Memorial.md
#
# AVISO PERMANENTE: PRELIMINAR — NAO UTILIZAR PARA PROJETO, COMPRA OU INSTALACAO. PR #40 DO NOT MERGE.
# Enumeracao e comparacao preliminar (NAO "selecao"): alternativas candidatas ordenadas por objetivo.
# A camada PREPARA entradas e LE saidas do nucleo da PR #39; NAO altera o nucleo, NAO contorna blockers,
# NAO elege solucao instalavel, NAO emite conformidade IEC.

Funcionalidade: Enumeracao e comparacao preliminar de cabos BT em paralelo
  Como Engenheiro Eletricista em laboratorio
  Quero enumerar e comparar alternativas candidatas (ex.: 2x240, 3x150) com criterios, fronteira e objetivo
  A fim de apoiar analise preliminar sem eleger solucao instalavel nem afirmar conformidade

  Contexto:
    Dado o nucleo integrado "calculateCablingBTParallelExperimental" (contrato CAB-BT-PARALLEL-EXP-1)
    E que a camada NAO altera nem reinterpreta o nucleo
    E que a norma primaria IEC 60364-5-52 Ed. 3.1 esta AUSENTE
    E que catalogo, ampacidade, impedancias, k_g, k e delta_fault sao ASSUMPTION_ONLY salvo indicacao
    E que a TOLERANCIA_COMPUTACIONAL_LAB_AMPAI = +-0,5% relativo e politica computacional (nao IEC)
    E que toda saida tem "productionAllowed = false", "installableSelection = null" e o aviso "PRELIMINAR — NAO UTILIZAR..."

  # ───────────────────────── k_g POR CANDIDATO (3 MODOS) ─────────────────────────

  Cenario: [k_g] Modo CANDIDATE_SPECIFIC
    Dado um candidato com k_g proprio e fonte, versao, metodo, arranjo, nParallel e nCircuits identificados
    Quando a camada avalia o candidato
    Entao o k_g e aceito como CANDIDATE_SPECIFIC
    E a ausencia de qualquer desses campos bloqueia o candidato

  Cenario: [k_g] Modo GROUPING_MATRIX sem combinacao correspondente
    Dado k_g obtido de "k_g(nParallel, nCircuits, metodo, arranjo)" de matriz com fonte e proveniencia
    E que a combinacao pedida NAO existe na matriz
    Quando a camada avalia o candidato
    Entao o candidato e BLOQUEADO por combinacao ausente na matriz

  Cenario: [k_g] Constante laboratorial confirmada
    Dado k_g = 0,8 declarado LAB_CONSTANT_CONFIRMED e ASSUMPTION_ONLY
    Quando a confirmacao explicita e dada antes do calculo
    Entao o k_g e usado apenas para sensibilidade laboratorial
    E NAO sustenta preferencia instalavel nem comparacao dita "pratica"

  Cenario: [Bloqueio] Constante laboratorial NAO confirmada
    Dado k_g LAB_CONSTANT_CONFIRMED sem confirmacao explicita
    Quando a camada tenta calcular
    Entao o calculo e BLOQUEADO (confirmacao ausente)

  # ───────────────────────── SCHEMA DE CANDIDATO / CATALOGO ─────────────────────────

  Esquema do Cenario: [Schema] Campo escalar obrigatorio ausente -> CANDIDATE_INCOMPLETE
    Dado um candidato "candidateId" sem o campo escalar obrigatorio "<campo>"
    Quando a camada valida o candidato
    Entao ele e rejeitado como "CANDIDATE_INCOMPLETE"
    E "missingFields[]" contem o path nominal "<campo>"
    E o erro identifica "candidateId", "mode" e "provenance" observada quando houver
    E nenhum numero utilizavel e produzido para esse candidato

    Exemplos:
      | campo                |
      | section_mm2          |
      | tabulatedAmpacity_A  |
      | material             |
      | insulation           |
      | installationMethod   |
      | referenceTemperature_C |
      | units                |
      | source               |
      | sourceVersion        |
      | provenance           |

  Cenario: [Schema] IMPEDANCE_COMPLEX completo sem R/X e valido
    Dado os 10 campos escalares obrigatorios presentes
    E "impedance_ohm = { re: finito, im: finito }" e sem "resistance_ohm"/"reactance_ohm"
    Quando a camada seleciona a representacao
    Entao a representacao e "IMPEDANCE_COMPLEX" e o candidato e valido

  Cenario: [Schema] RESISTANCE_REACTANCE_PAIR completo sem impedance e valido
    Dado os 10 campos escalares obrigatorios presentes
    E "resistance_ohm" e "reactance_ohm" finitos e sem "impedance_ohm"
    Quando a camada seleciona a representacao
    Entao a representacao e "RESISTANCE_REACTANCE_PAIR" e o candidato e valido

  Esquema do Cenario: [Schema] Representacao incompleta -> CANDIDATE_INCOMPLETE com missingFields exato
    Dado um candidato com "<situacao>"
    Quando a camada valida a representacao de impedancia
    Entao ele e rejeitado como "CANDIDATE_INCOMPLETE"
    E "missingFields[]" e exatamente "<missing>"

    Exemplos:
      | situacao                                              | missing                     |
      | impedance_ohm presente sem re                         | ["impedance_ohm.re"]        |
      | impedance_ohm presente sem im                         | ["impedance_ohm.im"]        |
      | somente resistance_ohm (sem reactance, sem impedance) | ["reactance_ohm"]           |
      | somente reactance_ohm (sem resistance, sem impedance) | ["resistance_ohm"]          |
      | nenhuma representacao (sem impedance, sem R, sem X)    | ["impedanceRepresentation"] |

  Cenario: [Bloqueio] Impedance incompleto NAO cai para R+X silenciosamente
    Dado "impedance_ohm" presente sem "im", e "resistance_ohm"/"reactance_ohm" ausentes
    Quando a camada seleciona a representacao (impedance_ohm presente -> IMPEDANCE_COMPLEX)
    Entao ele e rejeitado como "CANDIDATE_INCOMPLETE" com missingFields "[\"impedance_ohm.im\"]"
    E NAO ha fallback silencioso para RESISTANCE_REACTANCE_PAIR

  # --- Coexistencia parcial: conflito por PRESENCA, antes de qualquer validacao de valor ---

  Esquema do Cenario: [Conflito] Coexistencia por presenca -> CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT
    Dado "hasImpedance" e ("hasResistance" ou "hasReactance") na situacao "<situacao>"
    Quando a camada aplica a precedencia (conflito primeiro, por presenca)
    Entao o resultado e EXCLUSIVAMENTE "CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT"
    E o conflito e decidido ANTES de validar completude, tipos ou finitude
    E NAO e classificado como "CANDIDATE_INCOMPLETE" nem "CANDIDATE_IMPEDANCE_VALUE_INVALID"

    Exemplos:
      | situacao                                  |
      | impedance completo + somente resistance   |
      | impedance completo + somente reactance    |
      | impedance incompleto + R e X completos    |
      | impedance incompleto + somente resistance |
      | impedance incompleto + somente reactance  |
      | impedance completo + R e X completos      |
      | impedance invalido + qualquer R ou X      |

  Cenario: [Conflito] Ordem das propriedades nao altera o conflito
    Dado os mesmos campos de coexistencia em ordens de propriedade diferentes
    Quando a camada valida cada ordem
    Entao todas retornam "CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT"

  # --- Valor presente invalido em representacao UNICA -> CANDIDATE_IMPEDANCE_VALUE_INVALID ---

  Esquema do Cenario: [Invalido] IMPEDANCE_COMPLEX puro com valor presente invalido
    Dado "impedance_ohm" presente (sem R/X) com "<defeito>"
    Quando a camada valida a representacao unica
    Entao o resultado e "CANDIDATE_IMPEDANCE_VALUE_INVALID" (nunca CANDIDATE_INCOMPLETE, nunca fallback, nunca coercao)
    E "invalidFields[]" contem { path: "<path>", reason: "<reason>", observedType: "<tipo>" }
    E nenhum numero utilizavel e produzido; nenhuma impedancia parcial e retornada

    Exemplos:
      | defeito                            | path             | reason            | tipo    |
      | impedance_ohm nao e objeto simples | impedance_ohm    | NOT_SIMPLE_OBJECT | array   |
      | re string nao numerica             | impedance_ohm.re | NOT_NUMBER        | string  |
      | im string numerica "0.008"         | impedance_ohm.im | NOT_NUMBER        | string  |
      | re booleano                        | impedance_ohm.re | NOT_NUMBER        | boolean |
      | im objeto/array                    | impedance_ohm.im | NOT_NUMBER        | object  |
      | re null                            | impedance_ohm.re | NOT_NUMBER        | null    |
      | re NaN                             | impedance_ohm.re | NON_FINITE        | number  |
      | im +Infinity                       | impedance_ohm.im | NON_FINITE        | number  |
      | re -Infinity                       | impedance_ohm.re | NON_FINITE        | number  |

  Esquema do Cenario: [Invalido] RESISTANCE_REACTANCE_PAIR puro com valor presente invalido
    Dado "resistance_ohm" e "reactance_ohm" presentes (sem impedance) com "<defeito>"
    Quando a camada valida a representacao unica
    Entao o resultado e "CANDIDATE_IMPEDANCE_VALUE_INVALID"
    E "invalidFields[]" contem { path: "<path>", reason: "<reason>", observedType: "<tipo>" }
    E a string numerica NAO e convertida em number

    Exemplos:
      | defeito                       | path           | reason     | tipo    |
      | resistance string "0.015"     | resistance_ohm | NOT_NUMBER | string  |
      | reactance string nao numerica | reactance_ohm  | NOT_NUMBER | string  |
      | resistance booleano           | resistance_ohm | NOT_NUMBER | boolean |
      | reactance objeto/array        | reactance_ohm  | NOT_NUMBER | object  |
      | resistance null               | resistance_ohm | NOT_NUMBER | null    |
      | reactance NaN                 | reactance_ohm  | NON_FINITE | number  |
      | resistance +Infinity          | resistance_ohm | NON_FINITE | number  |
      | reactance -Infinity           | reactance_ohm  | NON_FINITE | number  |

  Cenario: [Invalido] Varios componentes invalidos -> invalidFields[] em ordem canonica
    Dado "impedance_ohm" presente (sem R/X) com "re" e "im" ambos invalidos
    Quando a camada valida
    Entao "invalidFields[]" registra ambos, sem duplicidade
    E a ordem canonica coloca "impedance_ohm.re" antes de "impedance_ohm.im" (independente da ordem de entrada)

  # --- Ausente vs invalido: distincao vinculante ---

  Esquema do Cenario: [Distincao] Campo ausente (incomplete) vs presente invalido (value_invalid)
    Dado a situacao "<situacao>"
    Entao o codigo e "<codigo>" e a colecao de erro e "<colecao>"

    Exemplos:
      | situacao                         | codigo                            | colecao       |
      | impedance sem re                 | CANDIDATE_INCOMPLETE              | missingFields |
      | impedance com re: null           | CANDIDATE_IMPEDANCE_VALUE_INVALID | invalidFields |
      | somente R (reactance ausente)    | CANDIDATE_INCOMPLETE              | missingFields |
      | resistance presente como "0.015" | CANDIDATE_IMPEDANCE_VALUE_INVALID | invalidFields |

  # --- Ordenacao canonica das colecoes ---

  Cenario: [Determinismo] Multiplos escalares ausentes em ordens diferentes -> mesmo missingFields[] canonico
    Dado dois candidatos aos quais faltam "provenance", "material" e "units" em ordens de propriedade diferentes
    Quando a camada valida ambos
    Entao "missingFields[]" e identico e ordenado pela lista canonica: ["material","units","provenance"]
    E remove duplicidades; a ordem de entrada nao interfere

  Cenario: [Determinismo] Ordem das propriedades nao altera resultado nem colecoes
    Dado dois candidatos com os mesmos campos em ordens de propriedade diferentes
    Quando a camada valida ambos
    Entao o resultado (valido, incompleto, conflito ou value_invalid) e identico
    E "missingFields[]" e "invalidFields[]" sao ordenados deterministicamente pela lista canonica

  Cenario: [Equivalencia] Representacoes numericamente equivalentes -> mesma impedancia complexa
    Dado "IMPEDANCE_COMPLEX { re: 0,015, im: 0,008 }" e "RESISTANCE_REACTANCE_PAIR { resistance_ohm: 0,015, reactance_ohm: 0,008 }"
    Quando a camada normaliza cada representacao em candidatos SEPARADOS (sem coexistencia)
    Entao ambas produzem a mesma impedancia "0,015 + j0,008 ohm"
    E nenhuma normalizacao inventa componente ausente

  Cenario: [Bloqueio] Catalogo inteiro sem candidato avaliavel
    Dado que todos os candidatos do catalogo estao incompletos
    Quando a camada tenta enumerar
    Entao o calculo e BLOQUEADO com "CATALOG_NO_EVALUABLE_CANDIDATE"

  Cenario: [Bloqueio] Metadados globais indispensaveis ausentes
    Dado que faltam metadados globais (ex.: tensao, I_b, I_k, t ou objetivo-modo)
    Quando a camada tenta calcular
    Entao o calculo e BLOQUEADO com "GLOBAL_METADATA_MISSING"

  Esquema do Cenario: [Catalogo] Transicoes determinísticas por modo
    Dado o modo de catalogo "<modo>"
    Quando a camada enumera
    Entao o comportamento e "<comportamento>"

    Exemplos:
      | modo                            | comportamento                                                                 |
      | CATALOGO_FORNECIDO_PELO_USUARIO | avalia completos; rejeita incompletos; bloqueia se nenhum completo existir     |
      | CATALOGO_SECUNDARIO_IDENTIFICADO| exige fonte/versao/proveniencia; sempre MATHEMATICAL_ONLY; sem rastreio bloqueia |
      | CATALOGO_LAB_ASSUMPTION_ONLY    | exige schema completo + confirmacao; sempre MATHEMATICAL_ONLY; sem confirmacao bloqueia |

  # ───────────────────────── DERIVACOES PROIBIDAS ─────────────────────────

  Cenario: [Bloqueio] Nenhum valor e derivado de material/isolacao/metodo isoladamente
    Dado material, isolacao e metodo informados
    Quando a camada precisa de R, X, ampacidade, k ou k_g
    Entao NENHUM desses e derivado apenas desses metadados
    E cada um vem do catalogo, de entrada tecnica do usuario ou e ASSUMPTION_ONLY confirmado
    E o modelo "Z(S) = 2,25/S + j0,008 ohm" e usado apenas como ASSUMPTION_ONLY (2,25 em ohm·mm², L_ref=100 m, sem validade normativa)

  # ───────────────────────── CRITERIOS E CANDIDATOS ─────────────────────────

  Cenario: [Feliz] Duas ou mais candidatas validas (dominante por ampacidade)
    Dado "I_b = 600 A", "U_LL = 400 V", "cos_phi = 0,9", "ΔUmax = 3%", "k_g = 0,8 LAB_CONSTANT_CONFIRMED"
    E o catalogo {95,120,150,185,240} e "n_p max = 4"
    Quando a camada avalia cada combinacao pelo nucleo real
    Entao "2 x 240" atende (I_adm≈712, ΔU=1,549%, S_min≈38,9) dominante "AMPACIDADE"
    E "3 x 150" atende (I_adm≈792, ΔU=1,471%) dominante "AMPACIDADE"
    E "4 x 120" atende (I_adm≈912) dominante "AMPACIDADE"
    E "2 x 95" e rejeitado por "AMPACIDADE" e "QUEDA"
    E toda candidata mantem "productionAllowed = false" e "installableSelection = null"

  Cenario: [Feliz] Alternativa candidata unica
    Dado o catalogo {240}, "I_b = 600 A" e "n_p max = 2"
    Quando a camada avalia
    Entao "1 x 240" e rejeitado (I_adm=356<600; ΔU=3,098%>3%)
    E "2 x 240" atende (I_adm=712)
    E a unica candidata valida e "2 x 240"

  Esquema do Cenario: [Dominante] Cada criterio pode dominar
    Dado o cenario "<cenario>"
    Quando a camada avalia a alternativa "<alt>"
    Entao ela atende e o criterio dominante e "<dominante>"

    Exemplos:
      | cenario                    | alt      | dominante  |
      | base I_b=600 ΔUmax=3%      | 3 x 150  | AMPACIDADE |
      | base I_b=600 ΔUmax=1,6%    | 3 x 150  | QUEDA      |
      | I_b=500 I_k=40000 t=1,0    | 2 x 185  | CURTO      |

  Cenario: [Triste] Quantidade excessiva de cabos
    Dado "I_b = 1500 A" e "n_p max = 4" com catalogo ate 240 mm²
    Quando a camada avalia
    Entao "4 x 240" e rejeitado por AMPACIDADE (I_adm=1424 < 1500)
    E o proxy continuo indica "n_p ≈ 4,213" (NAO instalavel)
    E a quantidade discreta necessaria (5) excede "n_p max" -> "EXCESSIVE_COUNT"

  Cenario: [Experimental] Corrente elevada sugere avaliar barramento
    Dado "I_b = 1500 A" e todas as candidatas dentro de "n_p max = 4" reprovando ampacidade
    Quando a camada conclui a enumeracao
    Entao emite nota QUALITATIVA "avaliar barramento/busway (limiar normativo AUSENTE — B-04)"
    E NAO emite recomendacao comercial automatica

  # ───────────────── UNIVERSO CARTESIANO COMPLETO (24 COMBINACOES; catalogo estendido a 300) ─────────────────

  Cenario: [Universo] Produto cartesiano completo sem poda silenciosa
    Dado o catalogo estendido {95,120,150,185,240,300} e "n_p max = 4"
    Quando a camada forma o universo U = catalogo x {1,2,3,4}
    Entao "evaluatedCandidates" tem exatamente 24 combinacoes
    E NAO ha amostragem parcial nem poda silenciosa
    E qualquer poda autorizada pelo usuario ocorre ANTES de formar U e e registrada nominalmente

  Cenario: [Universo] Contagens reconciliadas 24 / 14 / 10 / 14 (antes: 20 / 11 / 9 / 11)
    Dado o universo U (base I_b=600, U_LL=400, ΔUmax=3%, k_g=0,8, I_k=20000, t=0,2, k=115; A(300)=516 ASSUMPTION_ONLY)
    Quando a camada particiona U pelo nucleo real
    Entao "evaluatedCandidates" = 24
    E "candidateAlternatives" (validas) = 14
    E "rejectedCandidates" = 10
    E "nonDominatedAlternatives" = 14
    E "candidateAlternatives" uniao "rejectedCandidates" = "evaluatedCandidates" (reconciliacao)
    E "nonDominatedAlternatives" esta contido em "candidateAlternatives"

  Esquema do Cenario: [Universo] Inventario das 14 validas (3 novas de 300 mm²)
    Dado a candidata valida "<id>"
    Entao seu "nParallel" e "<nP>", "totalCopper_mm2" e "<cobre>" e a margem minima e aproximadamente "<m>"

    Exemplos:
      | id      | nP | cobre | m        |
      | 2 x 185 | 2  | 370   | 0,013333 |
      | 2 x 240 | 2  | 480   | 0,186667 |
      | 2 x 300 | 2  | 600   | 0,376000 |
      | 3 x 120 | 3  | 360   | 0,140000 |
      | 3 x 150 | 3  | 450   | 0,320000 |
      | 3 x 185 | 3  | 555   | 0,520000 |
      | 3 x 240 | 3  | 720   | 0,655766 |
      | 3 x 300 | 3  | 900   | 0,704480 |
      | 4 x 95  | 4  | 380   | 0,280000 |
      | 4 x 120 | 4  | 480   | 0,520000 |
      | 4 x 150 | 4  | 600   | 0,632218 |
      | 4 x 185 | 4  | 740   | 0,687515 |
      | 4 x 240 | 4  | 960   | 0,741824 |
      | 4 x 300 | 4  | 1200  | 0,778360 |

  Esquema do Cenario: [Universo] Inventario das 10 rejeitadas (sem omissao; inclui 1×300)
    Dado a candidata rejeitada "<id>"
    Entao os criterios reprovados sao "<fails>" e nenhum blocker de nucleo se aplica

    Exemplos:
      | id      | fails             |
      | 1 x 95  | AMPACIDADE, QUEDA |
      | 1 x 120 | AMPACIDADE, QUEDA |
      | 1 x 150 | AMPACIDADE, QUEDA |
      | 1 x 185 | AMPACIDADE, QUEDA |
      | 1 x 240 | AMPACIDADE, QUEDA |
      | 1 x 300 | AMPACIDADE        |
      | 2 x 95  | AMPACIDADE, QUEDA |
      | 2 x 120 | AMPACIDADE        |
      | 2 x 150 | AMPACIDADE        |
      | 3 x 95  | AMPACIDADE        |

  Cenario: [Universo] 300 mm²: 1×300 reprova; 2×300, 3×300 e 4×300 sao validas
    Dado o catalogo estendido e "A(300)=516 A" ASSUMPTION_ONLY
    Quando a camada avalia as combinacoes de 300 mm² pelo nucleo real
    Entao "1 x 300" e rejeitada por "AMPACIDADE" (I_adm=413 < 600; ΔU=2,660% OK; curto OK)
    E "2 x 300" atende (cobre=600, m*=0,376000)
    E "3 x 300" atende (cobre=900, m*=0,704480)
    E "4 x 300" atende (cobre=1200, m*=0,778360)
    E todas mantem "productionAllowed=false" e "installableSelection=null"

  Cenario: [Universo] Candidatas antes omitidas e as novas de 300 estao presentes
    Dado o universo completo U (24 combinacoes)
    Entao as candidatas "2 x 185", "3 x 120", "3 x 185", "3 x 240", "4 x 95", "4 x 150", "4 x 185" e "4 x 240" estao presentes e avaliadas
    E as novas "1 x 300", "2 x 300", "3 x 300" e "4 x 300" estao presentes e avaliadas
    E nenhuma foi omitida por nao aparecer em exemplos ilustrativos anteriores

  # ─────────────── ENTRADA DE 300 mm²: FAIL-CLOSED E CATALOGO HETEROGENEO ───────────────

  Esquema do Cenario: [300] Campo escalar obrigatorio ausente na entrada de 300 -> CANDIDATE_INCOMPLETE
    Dado a entrada de "300 mm²" sem o campo escalar obrigatorio "<campo>"
    Quando a camada valida o candidato de 300
    Entao e rejeitado como "CANDIDATE_INCOMPLETE" com "missingFields[]" contendo "<campo>"

    Exemplos:
      | campo               |
      | tabulatedAmpacity_A |
      | provenance          |

  Cenario: [300] Ampacidade de 300 nao finita -> fail-closed
    Dado a entrada de "300 mm²" com "tabulatedAmpacity_A" nao finita (NaN ou Infinity)
    Quando a camada valida
    Entao o candidato de 300 e rejeitado, sem numero utilizavel e sem ampacidade inventada

  Cenario: [300] Impedancia de 300 nao finita em representacao unica -> CANDIDATE_IMPEDANCE_VALUE_INVALID
    Dado a entrada de "300 mm²" (sem conflito) com componente de impedancia nao finita
    Quando a camada valida
    Entao o resultado e "CANDIDATE_IMPEDANCE_VALUE_INVALID" com "invalidFields[]" e reason "NON_FINITE"

  Cenario: [300] Conflito de representacao na entrada de 300
    Dado a entrada de "300 mm²" com "impedance_ohm" presente E "resistance_ohm"/"reactance_ohm" presentes
    Quando a camada aplica a precedencia (conflito primeiro, por presenca)
    Entao o resultado e "CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT"

  Esquema do Cenario: [Catalogo] Campo homogeneo divergente -> CANDIDATE_STRUCTURE_INVALID / catalog_heterogeneous
    Dado um candidato cujo campo homogeneo "<campo>" DIVERGE do perfil laboratorial do catalogo
    Quando a camada valida a homogeneidade do catalogo
    Entao o codigo e "CANDIDATE_STRUCTURE_INVALID" com reason "catalog_heterogeneous"
    E o campo divergente "<campo>" e identificado nominalmente
    E a candidata divergente e BLOQUEADA, sem aceitacao silenciosa
    E nenhum numero utilizavel e produzido para a candidata
    E NAO ha fallback nem normalizacao do campo divergente

    Exemplos:
      | campo                  |
      | material               |
      | insulation             |
      | installationMethod     |
      | referenceTemperature_C |
      | units                  |

  # ───────────────────────── FRONTEIRA NAO DOMINADA (14) ─────────────────────────

  Cenario: [Fronteira] Todas as 14 validas sao nao dominadas (3 novas de 300 entram; nenhuma existente sai)
    Dado as 14 candidatas validas do universo base estendido
    Quando a camada computa a fronteira (n_p min exato, cobre min exato, margem minima max com tolerancia +-0,5%)
    Entao "nonDominatedAlternatives" contem as 14 validas
    E "2 x 300", "3 x 300" e "4 x 300" entram na fronteira e nenhuma existente e removida
    E nenhuma candidata domina outra, pois cada uma preserva alguma troca entre n_p, cobre e margem
    E a saida retorna TODAS as candidatas e DESTACA a fronteira sem eleger instalavel

  Esquema do Cenario: [Comparador] Dominancia dentro e fora da tolerancia
    Dado duas margens minimas "<a>" e "<b>"
    Quando a camada aplica "approximatelyEqual(a,b) = |a-b| <= 0,005 * max(|a|,|b|,epsilon)" com epsilon = 1e-12
    Entao a igualdade aproximada e "<aprox>"
    E dentro da tolerancia NAO ha desigualdade estrita; fora da tolerancia ha

    Exemplos:
      | a        | b        | aprox |
      | 0,520000 | 0,520001 | sim   |
      | 0,013333 | 0,186667 | nao   |

  # ───────────────────────── OBJETIVO CONFIGURAVEL ─────────────────────────

  Esquema do Cenario: [Objetivo] Comparador total por objetivo (14 validas); 300 mm² muda dois firsts
    Dado as 14 candidatas validas
    Quando o objetivo ativo e "<objetivo>"
    Entao a PRIMEIRA na ordem de apresentacao e "<primeira>" (antes era "<antes>")
    E nenhuma candidata e chamada de solucao IEC ou instalavel

    Exemplos:
      | objetivo            | primeira | antes   |
      | NONE                | 2 x 185  | 2 x 185 |
      | MIN_PARALLEL_COUNT  | 2 x 300  | 2 x 240 |
      | MIN_TOTAL_COPPER    | 3 x 120  | 3 x 120 |
      | MAX_MINIMUM_MARGIN  | 4 x 300  | 4 x 240 |

  Cenario: [Objetivo] Empate primario e desempate de MIN_PARALLEL_COUNT (agora com 2×300)
    Dado que "2 x 185", "2 x 240" e "2 x 300" empatam em nParallel = 2
    Quando o objetivo e "MIN_PARALLEL_COUNT" (n_p asc, margem minima desc, cobre asc, secao asc, candidateId asc)
    Entao o desempate por margem minima decrescente coloca "2 x 300" (0,376000) ANTES de "2 x 240" (0,186667) e "2 x 185" (0,013333)
    E isso e ordenacao por preferencia, nao selecao instalavel

  Cenario: [Objetivo] MIN_TOTAL_COPPER inicia por 3 x 120 (inalterado por 300)
    Dado o objetivo "MIN_TOTAL_COPPER"
    Quando a camada ordena as 14 validas
    Entao a primeira e "3 x 120" (cobre total 360 mm²)
    E NAO e chamada de selecionada nem recomendada

  Cenario: [Objetivo] MAX_MINIMUM_MARGIN inicia por 4 x 300 (antes 4 x 240)
    Dado o objetivo "MAX_MINIMUM_MARGIN"
    Quando a camada ordena as 14 validas
    Entao a primeira e "4 x 300" (margem minima 0,778360), acima de "4 x 240" (0,741824)

  Cenario: [Objetivo] NONE nao elege e usa ordem de apresentacao
    Dado o objetivo "NONE"
    Quando a camada apresenta as 14 validas
    Entao nenhuma candidata e eleita ("NO_CANDIDATE_ELECTED", "PRESENTATION_ORDER_ONLY")
    E a ordem e determinística: nParallel asc, section_mm2 asc, candidateId asc
    E a primeira apresentada e "2 x 185"
    E "installableSelection" permanece nulo

  Cenario: [Ausencia] Nenhuma preferencia instalavel
    Dado qualquer objetivo ativo
    Quando a camada ordena a fronteira
    Entao a ordenacao NAO transforma candidata em selecao instalavel
    E "firstInPresentationOrder" NAO significa instalacao autorizada
    E "installableSelection" permanece nulo e "DISCRETE_SELECTION_BLOCKED" ativo

  # ───────────────────────── QUANTIDADE DISCRETA ─────────────────────────

  Cenario: [Bloqueio] Proxy continuo nunca e quantidade instalavel
    Dado qualquer candidata avaliada
    Quando a camada le "nParallelContinuousProxy"
    Entao ela o trata como sensibilidade
    E "installableSelection = null" e "discreteSelectionBlocked = true"
    E somente inteiros "n_p >= 1" aparecem como quantidade

  Cenario: [Usuario] Combinacao informada (providedCombination) sem promocao instalavel
    Dado que o usuario informa a combinacao "3 x 150"
    Quando a camada avalia
    Entao "providedCombination" retorna atende/margens/dominante de "3 x 150"
    E NAO e promovida a selecao instalavel ("installableSelection = null")

  # ───────────────────────── MODO GUIADO ─────────────────────────

  Cenario: [Guiado] Hipotese de impedancias identicas confirmada
    Dado "geometry.status = NOT_PROVIDED" e a hipotese de impedancias identicas
    Quando a hipotese e APRESENTADA antes do calculo e CONFIRMADA com provenance ASSUMPTION_ONLY
    Entao o nucleo retorna "MATHEMATICAL_ONLY" com "delta_load = 1" PRODUZIDO PELO L0 (observado, nao fixado pela camada)
    E inclui o blocker "ENGINEERING_ADEQUACY_BLOCKED" (reason geometry_not_provided)
    E nenhuma adequacao de engenharia ou conformidade IEC e afirmada

  Cenario: [Bloqueio] Modo guiado nao confirmado
    Dado a hipotese de impedancias identicas SEM confirmacao explicita
    Quando a camada tenta calcular
    Entao o resultado e BLOQUEADO com "GUIDED_HYPOTHESIS_UNCONFIRMED"

  # ───────────────── FAIL-CLOSED: BLOCKERS REAIS DO NUCLEO ─────────────────

  Esquema do Cenario: [Bloqueio] A camada propaga os blockers do nucleo, sem contornar
    Dado a condicao "<condicao>"
    Quando a camada chama o nucleo
    Entao o nucleo retorna BLOCKED com "<codigo>"
    E a camada propaga sem produzir numero utilizavel

    Exemplos:
      | condicao                        | codigo                         |
      | k_g ausente                     | GROUPING_FACTOR_MISSING        |
      | fault.imbalance.mode = BLOCK    | FAULT_IMBALANCE_MISSING        |
      | impedancia de ramo Z = 0        | PARALLEL_Z_ZERO                |
      | sem geometria e sem branches    | GEOMETRY_AND_IMPEDANCE_MISSING |
      | provenance != ASSUMPTION_ONLY   | ASSUMPTION_PROVENANCE_INVALID  |

  Cenario: [Conservador] delta_fault muda a decisao (mesmo cabo)
    Dado "2 x 185", "I_k = 30000 A", "t = 1,0 s", "k = 115" (ASSUMPTION_ONLY)
    Quando o modo de desbalanco de falta e "EXPLICIT_ASSUMPTION" com "delta_fault = 1,15"
    Entao "S_min ≈ 150,0 mm²" e "185" atende ao curto
    Mas quando o modo e "CONSERVATIVE_SINGLE_BRANCH"
    Entao "S_min ≈ 260,87 mm²" e "185" e rejeitado no curto
    E delta_fault permanece independente de delta_load

  # ───────────────────────── SAIDA HUMANA ─────────────────────────

  Cenario: [Saida] Formato humano de alternativa candidata
    Dado a alternativa candidata "2 x 240" com objetivo ativo "MIN_PARALLEL_COUNT"
    Quando a camada renderiza a saida
    Entao apresenta "ALTERNATIVA MATEMATICA CANDIDATA" com secao x quantidade
    E linhas de Ampacidade ("atende no cenario laboratorial"), Queda ("atende ao limite informado pelo usuario") e Curto ("atende as hipoteses informadas")
    E "Criterio dominante", "Objetivo ativo", "Hipoteses" e "Bloqueios"
    E "Instalacao autorizada: NAO"
    E NAO usa "recomendado", "selecionado" nem "dimensionamento final"
    E o aviso "PRELIMINAR — NAO UTILIZAR PARA PROJETO, COMPRA OU INSTALACAO"

  # ───────────────────────── GUARDRAILS FAIL-CLOSED ─────────────────────────

  Cenario: [Bloqueio] Tentativa de uso produtivo, elegibilidade ou conformidade IEC
    Dado qualquer alternativa candidata
    Quando alguem solicita "usar para projeto/compra/instalacao", "elegivel para implementacao" ou "conforme IEC"
    Entao a camada RECUSA (productionAllowed=false; B-06)
    E mantem o aviso permanente e o estado EXPERIMENTAL_PRELIMINAR_NAO_CANONICO
