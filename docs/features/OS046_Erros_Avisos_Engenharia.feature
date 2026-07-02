# language: pt

Funcionalidade: Governança de Erros e Avisos de Engenharia (O.S. 046-R2)
  Como o motor matemático de engenharia elétrica (AmpAI)
  Eu quero catalogar rigorosamente todas as falhas físicas e avisos normativos de BT e MT
  Para que o CTO e o sistema SDD possam rastreá-los de forma agnóstica de idioma.

  Regras de Saída SDD:
  - Sucesso: { "ok": true, "data": { ... }, "warnings": [ { "code": "...", "params": {...}, "severity": "warning" } ] }
  - Falha: { "ok": false, "error": { "code": "...", "params": {...}, "severity": "error" } }

  # ==============================================================================
  # BDD: CAMINHOS DE EXECUÇÃO
  # ==============================================================================

  Esquema do Cenario: Validacao de Caminhos Felizes e Limites (Sucesso)
    Dado que os motores recebem um objeto de entrada perfeitamente valido
    Quando o parametro esta dentro da tolerancia da <Norma>
    Entao o sistema DEVE processar o calculo com sucesso
    E retornar de forma neutra o objeto { "ok": true, "data": <DadosProcessados>, "warnings": [] }

    Exemplos:
      | Dominio | Regra de Limite Validado                     | Norma                 |
      | BT      | In >= Ib (Ex: Ib=10, In=16)                  | IEC 60364-5-52        |
      | MT      | U0 = 18kV (Extremo superior permitido)       | IEC 60502-2           |
      | MT      | cosPhi = 0.70 (Extremo inferior permitido)   | IEC 60502-2           |

  Esquema do Cenario: Bloqueio Estrutural de BT e MT (Caminhos Tristes)
    Dado que o motor detecta uma falha fisica grave
    Quando o input causar a falha da regra <CodigoErro>
    Entao o motor DEVE interromper a execucao
    E retornar { "ok": false, "error": { "code": "<CodigoErro>", "params": <Params>, "severity": "error" } }

    Exemplos:
      | CodigoErro | Condicao Violada (Input Falso)               | Params Exemplo                             |
      | QA-BT-001  | In < Ib (Disjuntor menor que projeto)        | { "In_A": 10, "Ib_A": 16 }                 |
      | QA-BT-002  | Agrupamento nulo (nCircuits < 1)             | { "nCircuits": 0 }                         |
      | QA-BT-003  | Comprimento invalido (length <= 0)           | { "length_m": -10 }                        |
      | QA-BT-004  | Icc nula (Icc <= 0)                          | { "Icc_A": 0 }                             |
      | QA-BT-006  | Fator de Potencia fora da faixa (0.7 a 1)    | { "cosPhi": 0.5 }                          |
      | QA-BT-007  | Temperatura >= Isolacao                      | { "thetaAmb_C": 95, "tMax": 90 }           |
      | QA-BT-010  | Ampacidade < Protecao (Iz_corr < In)         | { "Iz_corr": 15, "In_A": 20 }              |
      | QA-MT-001  | Tensao muito baixa para MT (U0 < 3.6)        | { "U0": 2.0 }                              |
      | QA-MT-002  | Tensao muito alta para MT (U0 > 18)          | { "U0": 35.0 }                             |
      | QA-MT-003  | PVC acima de 6kV                             | { "insulation": "PVC", "U0": 8.7 }         |
      | QA-MT-004  | Tensao desconhecida ou nao padronizada       | { "U0": null }                             |
      | QA-MT-005  | Ib <= 0                                      | { "Ib_A": 0 }                              |
      | QA-MT-006  | FP fora da faixa MT (0.7 a 1)                | { "cosPhi": 1.2 }                          |
      | QA-MT-007  | ULL <= 0                                     | { "ULL_V": 0 }                             |
      | QA-MT-010  | Icc <= 0 em MT                               | { "Icc_A": -500 }                          |
      | QA-MT-012  | Tempo do condutor <= 0                       | { "tConductor_s": 0 }                      |
      | QA-MT-015  | Corrente tela nula ou > Icc                  | { "iFault_A": 150000, "Icc_A": 10000 }     |
      | QA-MT-021  | Temp Solo >= Temp Max do Condutor            | { "thetaAmb_C": 90, "thetaMax": 90 }       |
      | QA-MT-022  | Resistividade Solo nula (<= 0)               | { "rhoSoil_KmW": 0 }                       |
      | QA-MT-024  | Profundidade mecanica perigosa (< 0.3)       | { "depth_m": 0.2 }                         |
      | QA-MT-030  | Secao calculada MT < 10 mm2                  | { "sCalc": 6 }                             |
      | QA-MT-032  | Secao da tela MT < 6 mm2                     | { "S_screen": 4 }                          |
      | QA-MT-034  | Circuitos nulos MT (< 1)                     | { "nCircuits": 0 }                         |
      | QA-MT-036  | Comprimento MT nulo (<= 0)                   | { "length_m": 0 }                          |
      | QA-MT-038  | Queda Tensao MT nula ou absurda (> 15%)      | { "duMax_pct": 20 }                        |
      | QA-MT-040  | Secao final excedeu 1200 mm2                 | { "sFinal": 1500 }                         |
      | QA-MT-041  | Ampacidade <= 0 ou menor que Ib              | { "Iz_corr": 50, "Ib_A": 100 }             |
      | QA-MT-042  | Fator Combinado negativo/nulo (erro rigoroso)| { "f_combined": 0, "condition": "zero" }   |
      | QA-MT-043  | ULL excede isolacao (Um)                     | { "ULL_V": 15000, "Um": 12.0 }             |
      | QA-MT-044  | In nula (<= 0)                               | { "In_A": 0 }                              |
      | QA-MT-045  | In MT < Ib MT                                | { "In_A": 50, "Ib_A": 60 }                 |
      | QA-MT-046  | Ampacidade da secao inexistente em tabela    | { "section": 999, "insulation": "EPR" }    |
      | QA-MT-047  | Formacao de instalacao desconhecida          | { "formation": "unknown_formation" }       |

  Esquema do Cenario: Avisos Auditados de BT e MT (Preservando o Calculo)
    Dado que a condicao e fisicamente resolvida mas subotima
    Quando a regra <CodigoAviso> for atingida
    Entao o motor DEVE concluir o calculo (ok: true)
    E anexar em 'warnings' o objeto { "code": "<CodigoAviso>", "params": <Params>, "severity": "warning" }

    Exemplos:
      | CodigoAviso | Condicao Subotima                           | Params Exemplo                             |
      | QA-BT-005   | Tempo de protecao longo (tProt > 5s)        | { "tProt_s": 6 }                           |
      | QA-BT-011   | Fator agrupamento aproximado por feixe      | { "method": "enterrado", "approx": true }  |
      | QA-MT-011   | Icc extremamente alta em MT (> 100 kA)      | { "Icc_A": 120000 }                        |
      | QA-MT-013   | Tempo falta longo, sem adiabatica (t > 5)   | { "tConductor_s": 6 }                      |
      | QA-MT-014   | Tempo falta atipicamente curto (t < 0.01)   | { "tConductor_s": 0.005 }                  |
      | QA-MT-020   | Temperatura MT mt baixa (< -20 C)           | { "thetaAmb_C": -30 }                      |
      | QA-MT-023   | Resistividade Solo extrema (> 5.0)          | { "rhoSoil_KmW": 6.5 }                     |
      | QA-MT-025   | Profundidade extrema (> 5.0 m)              | { "depth_m": 6.0 }                         |
      | QA-MT-033   | Tela da MT > Condutor Principal             | { "S_screen": 50, "sFinal": 35 }           |
      | QA-MT-035   | Agrupamento MT extremo (> 20 circuitos)     | { "nCircuits": 25 }                        |
      | QA-MT-037   | Comprimento MT atipico (> 50 km)            | { "length_m": 60000 }                      |
      | QA-MT-042   | Fator combinado extremo (0 < f < 0.30)      | { "f_combined": 0.25, "condition": "low" } |

  # ==============================================================================
  # REGRAS CANDIDATAS FUTURAS (NÃO IMPLEMENTADAS)
  # ==============================================================================
  # @Future @UnderReview
  # - QA-WARN-BT-001: Queda de tensão marginal (3.5% < dU <= 4.0%).
  # - QA-WARN-BT-002: Fator de potência indesejável (0.7 <= cosPhi < 0.92).

