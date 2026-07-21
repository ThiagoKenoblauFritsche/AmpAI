---
title: SDD experimental — Condutores BT em paralelo por fase
id: CAB-BT-PARALLEL-001-SDD-EXP
classe: CHG-3 científica experimental
governanca: v7.3
status: motor_green_integrado_ui_sdd_candidato_para_auditoria
autoridade: "@CTO"
consumidores: ["@Senior_QA_Security", "@Senior_Backend_Dev", "@Senior_Frontend_Dev"]
baseline_cientifica: 18627dd02c94265984aa953d35f47c2745cab61d
baseline_ui: 83e24131c0cc09813be65a5fa269961b9cc80c5c
motor_green_sha: b6466f768bf60dc2d010d9a87d85f7edd10e9c60
fonte_cientifica: RNC-P experimental não canônico
fonte_primaria_completa: AUSENTE
estado_producao: BLOQUEADO
teste_do_ceo_nesta_etapa: NÃO
teste_do_ceo_ui_futura: SIM
---

# SDD experimental — Condutores BT em paralelo por fase

> **PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO**

## 1. Decisão executiva e alcance

Este contrato especifica um **protótipo matemático de laboratório** para estudar
condutores BT em paralelo por fase. Ele não dimensiona uma instalação real, não
seleciona uma quantidade instalável de cabos e não declara conformidade com a
IEC 60364-5-52.

Neste contrato:

- `ok: true` significa somente que o cálculo matemático solicitado terminou;
- todo sucesso permanece `classification: "MATHEMATICAL_ONLY"`;
- `productionAllowed` é sempre `false`;
- a ausência, ocultação ou redução do aviso vinculante é falha bloqueante;
- os bloqueios B-01 a B-06 permanecem presentes em toda resposta de sucesso;
- nenhum resultado pode alimentar projeto, compra, instalação ou memorial final.

O protótipo deve ficar em módulo próprio. É proibido alterar o comportamento do
motor BT vigente para encaixar este experimento.

### 1.1 Aviso vinculante

Valor exato e imutável da constante pública `displayNotice`:

```text
PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO
```

Toda saída JSON, relatório de teste e futura representação visual relevante deve
conter esse valor integralmente. Não é permitido substituí-lo por tooltip, nota
oculta, abreviação ou aviso exibido apenas uma vez.

## 2. Fontes, autoridade e precedência

Baseline científica imutável:

```text
18627dd02c94265984aa953d35f47c2745cab61d
```

Documentos científicos vinculantes para o experimento:

- `docs/engenharia/RNC-P_CAB_BT_PARALLEL_PRELIM.md`;
- `docs/engenharia/CAB_BT_PARALLEL_PRELIM_Memorial.md`;
- `docs/engenharia/CAB_BT_PARALLEL_PRELIM_BDD.feature`.

Classificação:

- os documentos são `EXPERIMENTAL_PRELIMINAR_NAO_CANONICO`;
- o RNC-P não é RNC-C;
- a fonte primária completa está ausente;
- a preview autorizada confirma somente a estrutura documental registrada no
  RNC-P, não o conteúdo integral, valores, notas ou delta material da AMD1:2024;
- valores de impedância, `k_g`, ampacidade tabulada, `k` e `deltaFault` são
  `ASSUMPTION_ONLY` quando utilizados pelo protótipo.

Em caso de conflito, prevalecem os bloqueios dos documentos científicos e o
protótipo deve falhar fechado. Este SDD não promove hipótese a regra normativa.

## 3. Arquitetura e fronteiras

### 3.1 Módulo futuro

Arquivo do motor integrado pela PR #39:

```text
js/core_cabos_bt_parallel_experimental.js
```

Interface pública prevista:

```js
calculateCablingBTParallelExperimental(input)
```

Exposição futura, se necessária para os dois runtimes:

```js
window.calculateCablingBTParallelExperimental
module.exports = { calculateCablingBTParallelExperimental }
```

### 3.2 Regras arquiteturais

- função síncrona, determinística e pura;
- zero DOM, rede, filesystem, relógio, aleatoriedade ou estado global mutável;
- zero `console.log`, `console.warn` e `console.error`;
- zero texto localizado no motor;
- zero arredondamento interno;
- complexos representados por objetos `{ re, im }` com números reais finitos;
- nenhuma dependência de `js/core_cabos_bt.js` ou de suas tabelas aproximadas;
- nenhuma escrita em `index.html` ou `js/ui_render.js` na fase Backend;
- nenhuma seleção de seção comercial, terminal, quantidade instalável ou busway;
- erros de entrada retornam Result Pattern; não usam `throw` como fluxo de domínio.

Erro de programação fora do contrato, como invocação sem argumento, também deve
ser convertido em Problem Details para manter o protótipo fail-closed.

## 4. Contrato de entrada

### 4.1 Exemplo completo

```json
{
  "contractVersion": "CAB-BT-PARALLEL-EXP-1",
  "totalLoadCurrent_A": 900,
  "powerFactor": 0.9,
  "nParallel": 3,
  "nCircuits": 1,
  "geometry": {
    "status": "NOT_PROVIDED",
    "description": null
  },
  "branches": [
    {
      "id": "P1",
      "impedance_ohm": { "re": 0.02, "im": 0.03 },
      "provenance": "ASSUMPTION_ONLY"
    },
    {
      "id": "P2",
      "impedance_ohm": { "re": 0.02, "im": 0.024 },
      "provenance": "ASSUMPTION_ONLY"
    },
    {
      "id": "P3",
      "impedance_ohm": { "re": 0.02, "im": 0.018 },
      "provenance": "ASSUMPTION_ONLY"
    }
  ],
  "capacityProxy": {
    "groupingFactor": {
      "value": 0.7,
      "provenance": "ASSUMPTION_ONLY"
    },
    "tabulatedAmpacityPerConductor_A": {
      "value": 344,
      "provenance": "ASSUMPTION_ONLY"
    }
  },
  "fault": {
    "totalFaultCurrent_A": 20000,
    "clearingTime_s": 0.2,
    "adiabaticK_A_sqrt_s_per_mm2": {
      "value": 115,
      "provenance": "ASSUMPTION_ONLY"
    },
    "imbalance": {
      "mode": "EXPLICIT_ASSUMPTION",
      "deltaFault": 1.1,
      "provenance": "ASSUMPTION_ONLY"
    }
  }
}
```

### 4.2 Campos e domínios

| Campo | Tipo e unidade | Regra |
| --- | --- | --- |
| `contractVersion` | string | valor exato `CAB-BT-PARALLEL-EXP-1` |
| `totalLoadCurrent_A` | number, A | finito e `> 0` |
| `powerFactor` | number | finito no intervalo `[0, 1]`; perfil trifásico atrasado do experimento |
| `nParallel` | integer | `>= 1`; quantidade matemática de ramos por fase |
| `nCircuits` | integer | `>= 1`; informação térmica distinta, nunca derivada de `nParallel` |
| `geometry.status` | enum | `NOT_PROVIDED` ou `DESCRIBED` |
| `geometry.description` | string/null | obrigatório e não vazio quando `DESCRIBED` |
| `branches` | array | exatamente `nParallel` itens, IDs únicos |
| `impedance_ohm.re/im` | number, ohm | finitos; o módulo complexo deve ser `> 0` |
| `branches[].provenance` | enum | valor exato `ASSUMPTION_ONLY` |
| `groupingFactor.value` | number | finito, `0 < k_g <= 1` |
| `tabulatedAmpacityPerConductor_A.value` | number, A | finito e `> 0` |
| proveniências da capacidade | enum | valor exato `ASSUMPTION_ONLY` |
| `totalFaultCurrent_A` | number, A | finito e `>= 0` |
| `clearingTime_s` | number, s | finito e `>= 0` |
| `adiabaticK_A_sqrt_s_per_mm2.value` | number | finito e `> 0`; unidade A·s^0,5/mm² |
| `fault.imbalance.mode` | enum | `EXPLICIT_ASSUMPTION`, `CONSERVATIVE_SINGLE_BRANCH` ou `BLOCK` |
| `deltaFault` | number | obrigatório, finito e `>= 1` apenas no modo explícito |
| proveniências de falta | enum | valor exato `ASSUMPTION_ONLY` quando o valor é explícito |

`nParallel` e `nCircuits` são campos obrigatoriamente diferentes em significado.
O motor não exige que tenham valores numéricos diferentes, mas é proibido copiar,
inferir ou recalcular um a partir do outro.

Geometria descrita nunca substitui `branches[].impedance_ohm`. O protótipo não
converte disposição física em impedância. Sem geometria, os `Z_i` explícitos
permitem somente resultado `MATHEMATICAL_ONLY`. Sem geometria e sem `Z_i`, a
resposta é bloqueada.

### 4.3 JSON Schema resumido da entrada

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ampai.dev/schemas/cab-bt-parallel-exp-input-v1.json",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "contractVersion",
    "totalLoadCurrent_A",
    "powerFactor",
    "nParallel",
    "nCircuits",
    "geometry",
    "capacityProxy",
    "fault"
  ],
  "properties": {
    "contractVersion": { "const": "CAB-BT-PARALLEL-EXP-1" },
    "totalLoadCurrent_A": { "type": "number", "exclusiveMinimum": 0 },
    "powerFactor": { "type": "number", "minimum": 0, "maximum": 1 },
    "nParallel": { "type": "integer", "minimum": 1 },
    "nCircuits": { "type": "integer", "minimum": 1 },
    "geometry": {
      "type": "object",
      "additionalProperties": false,
      "required": ["status", "description"],
      "properties": {
        "status": { "enum": ["NOT_PROVIDED", "DESCRIBED"] },
        "description": { "type": ["string", "null"] }
      },
      "allOf": [
        {
          "if": { "properties": { "status": { "const": "DESCRIBED" } } },
          "then": {
            "properties": {
              "description": { "type": "string", "minLength": 1 }
            }
          }
        }
      ]
    },
    "branches": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["id", "impedance_ohm", "provenance"],
        "properties": {
          "id": { "type": "string", "minLength": 1 },
          "impedance_ohm": {
            "type": "object",
            "additionalProperties": false,
            "required": ["re", "im"],
            "properties": {
              "re": { "type": "number" },
              "im": { "type": "number" }
            }
          },
          "provenance": { "const": "ASSUMPTION_ONLY" }
        }
      }
    },
    "capacityProxy": {
      "type": "object",
      "additionalProperties": false,
      "required": ["groupingFactor", "tabulatedAmpacityPerConductor_A"],
      "properties": {
        "groupingFactor": {
          "type": "object",
          "additionalProperties": false,
          "required": ["value", "provenance"],
          "properties": {
            "value": { "type": "number", "exclusiveMinimum": 0, "maximum": 1 },
            "provenance": { "const": "ASSUMPTION_ONLY" }
          }
        },
        "tabulatedAmpacityPerConductor_A": {
          "type": "object",
          "additionalProperties": false,
          "required": ["value", "provenance"],
          "properties": {
            "value": { "type": "number", "exclusiveMinimum": 0 },
            "provenance": { "const": "ASSUMPTION_ONLY" }
          }
        }
      }
    },
    "fault": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "totalFaultCurrent_A",
        "clearingTime_s",
        "adiabaticK_A_sqrt_s_per_mm2",
        "imbalance"
      ],
      "properties": {
        "totalFaultCurrent_A": { "type": "number", "minimum": 0 },
        "clearingTime_s": { "type": "number", "minimum": 0 },
        "adiabaticK_A_sqrt_s_per_mm2": {
          "type": "object",
          "additionalProperties": false,
          "required": ["value", "provenance"],
          "properties": {
            "value": { "type": "number", "exclusiveMinimum": 0 },
            "provenance": { "const": "ASSUMPTION_ONLY" }
          }
        },
        "imbalance": {
          "oneOf": [
            {
              "type": "object",
              "additionalProperties": false,
              "required": ["mode", "deltaFault", "provenance"],
              "properties": {
                "mode": { "const": "EXPLICIT_ASSUMPTION" },
                "deltaFault": { "type": "number", "minimum": 1 },
                "provenance": { "const": "ASSUMPTION_ONLY" }
              }
            },
            {
              "type": "object",
              "additionalProperties": false,
              "required": ["mode"],
              "properties": {
                "mode": { "const": "CONSERVATIVE_SINGLE_BRANCH" }
              }
            },
            {
              "type": "object",
              "additionalProperties": false,
              "required": ["mode"],
              "properties": {
                "mode": { "const": "BLOCK" }
              }
            }
          ]
        }
      }
    }
  }
}
```

JSON não representa `NaN` ou infinito, mas a função JavaScript deve rejeitar
esses valores quando chamada diretamente em memória.

## 5. Cálculos matemáticos permitidos

### 5.1 Admitâncias e divisão da corrente de carga

Para cada ramo:

\[
\underline{Y}_i=\frac{1}{\underline{Z}_i},\qquad
\underline{f}_i=\frac{\underline{Y}_i}{\sum_k\underline{Y}_k},\qquad
\underline{I}_i=I_{tot}\underline{f}_i
\]

Devem ser retornados `re`, `im` e `magnitude_A` de cada corrente. A soma complexa
das frações deve permanecer sujeita à precisão de máquina; o motor não corrige o
resultado por arredondamento.

### 5.2 Impedância equivalente

\[
\underline{Z}_{eq}=\left(\sum_k\underline{Y}_k\right)^{-1}
\]

### 5.3 Ramo mais carregado e desbalanço de carga

\[
I_{max}=\max_i|\underline{I}_i|,\qquad
\delta_{load}=\frac{I_{max}}{I_{tot}/n_p},\qquad
d_{load}=\frac{1}{\delta_{load}}
\]

Empate deve ser resolvido deterministicamente pelo primeiro ramo na ordem de
entrada. Dois módulos são considerados numericamente empatados quando a diferença
absoluta é menor ou igual a `Number.EPSILON * max(1, |I_a|, |I_b|)`; a lista
completa de IDs empatados deve ser preservada.

### 5.4 Proxy de capacidade — não instalável

\[
I_{z,corr}=I_{z,tab}k_g
\]

\[
I_{tot,adm}^{proxy}=\frac{n_pI_{z,corr}}{\delta_{load}}
\]

\[
n_{p,min}^{cont}=\frac{I_{tot}\delta_{load}}{I_{z,corr}}
\]

`nParallelContinuousProxy` nunca é arredondado para produzir uma seleção. O campo
`installableSelection` deve ser sempre `null`, e
`discreteSelectionBlocked` deve ser sempre `true`. `providedParallelCount` apenas
ecoa a entrada do laboratório. `providedCountMeetsContinuousProxy` compara essa
entrada ao proxy contínuo e permanece explicitamente `MATHEMATICAL_ONLY`: não
representa seleção, adequação de engenharia ou quantidade instalável.

### 5.5 Queda de tensão matemática

Para o perfil trifásico atrasado deste experimento:

\[
\Delta U_{3\phi}=\sqrt{3}I_{tot}
(R_{eq}\cos\varphi+X_{eq}\sin\varphi)
\]

com:

\[
\sin\varphi=\sqrt{1-\cos^2\varphi}
\]

O resultado é retornado somente em volts. `voltageDropPercent` e
`normativeVoltageDropLimit` devem ser `null`, pois a tensão nominal e o limite
normativo não fazem parte deste contrato.

### 5.6 Curto-circuito adiabático por ramo

Modo `EXPLICIT_ASSUMPTION`:

\[
I_{k,ramo}=\frac{I_{k,tot}}{n_p}\delta_{fault}
\]

Modo `CONSERVATIVE_SINGLE_BRANCH`:

\[
I_{k,ramo}=I_{k,tot}
\]

Neste segundo modo, `deltaFaultEffective=nParallel` é somente o rótulo aritmético
do `CENARIO_CONSERVADOR_ESCOLHIDO`; não é limite universal.

Nos dois modos calculáveis:

\[
S_{min}^{adiab}=\frac{I_{k,ramo}\sqrt{t}}{k}
\]

Modo `BLOCK` retorna `FAULT_IMBALANCE_MISSING`. É proibido usar `deltaLoad` como
`deltaFault`, mesmo quando os valores coincidirem numericamente.

## 6. Result Pattern

### 6.1 Sucesso matemático

```json
{
  "ok": true,
  "classification": "MATHEMATICAL_ONLY",
  "data": {
    "contractVersion": "CAB-BT-PARALLEL-EXP-1",
    "inputEcho": {
      "nParallel": 3,
      "nCircuits": 1,
      "geometryStatus": "NOT_PROVIDED"
    },
    "loadSharing": {
      "branchCurrents": [
        {
          "id": "P1",
          "current_A": {
            "re": 256.71631720112686,
            "im": -33.855704188525834,
            "magnitude": 258.93913613706707
          }
        },
        {
          "id": "P2",
          "current_A": {
            "re": 298.75508172939055,
            "im": -7.287326462104227,
            "magnitude": 298.84394587493335
          }
        },
        {
          "id": "P3",
          "current_A": {
            "re": 344.5286010694826,
            "im": 41.14303065063006,
            "magnitude": 346.9765207128767
          }
        }
      ],
      "mostLoadedBranchId": "P3",
      "tiedMostLoadedBranchIds": ["P3"],
      "deltaLoad": 1.1565884023762558,
      "deratingFactor": 0.8646118169138314,
      "equivalentImpedance_ohm": {
        "re": 0.00683333052186479,
        "im": 0.007804861591403654
      }
    },
    "capacityProxy": {
      "correctedAmpacityPerConductor_A": 240.8,
      "totalAdmissibleCurrentProxy_A": 624.5955765385518,
      "nParallelContinuousProxy": 4.32279718496109,
      "providedParallelCount": 3,
      "providedCountMeetsContinuousProxy": false,
      "installableSelection": null,
      "discreteSelectionBlocked": true
    },
    "voltageDrop": {
      "threePhase_V": 14.890184427989706,
      "voltageDropPercent": null,
      "normativeVoltageDropLimit": null
    },
    "faultAdiabatic": {
      "mode": "EXPLICIT_ASSUMPTION",
      "deltaFaultEffective": 1.1,
      "branchFaultCurrent_A": 7333.333333333333,
      "minimumSectionContinuous_mm2": 28.51796840869297,
      "installableSection": null
    }
  },
  "assumptions": [
    {
      "id": "AO-1",
      "field": "branches[*].impedance_ohm",
      "provenance": "ASSUMPTION_ONLY"
    },
    {
      "id": "AO-2",
      "field": "capacityProxy.groupingFactor",
      "value": 0.7,
      "provenance": "ASSUMPTION_ONLY"
    },
    {
      "id": "AO-3",
      "field": "fault.adiabaticK_A_sqrt_s_per_mm2",
      "value": 115,
      "provenance": "ASSUMPTION_ONLY"
    },
    {
      "id": "AO-4",
      "field": "capacityProxy.tabulatedAmpacityPerConductor_A",
      "value": 344,
      "provenance": "ASSUMPTION_ONLY"
    },
    {
      "id": "AO-6",
      "field": "fault.imbalance.deltaFault",
      "value": 1.1,
      "provenance": "ASSUMPTION_ONLY"
    }
  ],
  "blockers": [
    { "code": "B-01", "severity": "blocker" },
    { "code": "B-02", "severity": "blocker" },
    { "code": "B-03", "severity": "blocker" },
    { "code": "B-04", "severity": "blocker" },
    { "code": "B-05", "severity": "blocker" },
    { "code": "B-06", "severity": "blocker" },
    {
      "code": "ENGINEERING_ADEQUACY_BLOCKED",
      "params": { "reason": "geometry_not_provided" },
      "severity": "blocker"
    },
    { "code": "DISCRETE_SELECTION_BLOCKED", "severity": "blocker" },
    { "code": "IEC_CONFORMITY_BLOCKED", "severity": "blocker" },
    { "code": "PRODUCTION_USE_BLOCKED", "severity": "blocker" }
  ],
  "warnings": [],
  "sourceStatus": {
    "classification": "RNC-P_EXPERIMENTAL_NON_CANONICAL",
    "scientificBaselineSha": "18627dd02c94265984aa953d35f47c2745cab61d",
    "primarySourceComplete": false,
    "iecConformity": false
  },
  "productionAllowed": false,
  "displayNotice": "PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO",
  "error": null
}
```

Os números acima apenas ilustram a estrutura. Gabaritos de QA devem vir dos
exemplos integralmente reproduzíveis do Memorial, não deste JSON abreviado.

### 6.2 Falha bloqueante — RFC 7807

```json
{
  "ok": false,
  "classification": "BLOCKED",
  "data": null,
  "assumptions": [],
  "blockers": [
    {
      "code": "PARALLEL_Z_NON_FINITE",
      "params": { "branchId": "P2", "component": "im" },
      "severity": "blocker"
    }
  ],
  "warnings": [],
  "sourceStatus": {
    "classification": "RNC-P_EXPERIMENTAL_NON_CANONICAL",
    "scientificBaselineSha": "18627dd02c94265984aa953d35f47c2745cab61d",
    "primarySourceComplete": false,
    "iecConformity": false
  },
  "productionAllowed": false,
  "displayNotice": "PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO",
  "error": {
    "type": "https://ampai.dev/problems/PARALLEL_Z_NON_FINITE",
    "title": "PARALLEL_Z_NON_FINITE",
    "status": 422,
    "code": "PARALLEL_Z_NON_FINITE",
    "params": { "branchId": "P2", "component": "im" },
    "severity": "error"
  }
}
```

`title` e `code` são identificadores estáveis, não mensagens para apresentação.
`detail` localizado é proibido no motor.

### 6.3 Campos invariantes

Os campos abaixo existem em sucesso e falha:

- `ok`;
- `classification`;
- `data`;
- `assumptions`;
- `blockers`;
- `warnings`;
- `sourceStatus`;
- `productionAllowed`;
- `displayNotice`;
- `error`.

É proibido interpretar `ok` isoladamente. Um consumidor deve verificar também
`classification`, `productionAllowed` e `blockers`.

## 7. Catálogo determinístico de bloqueios e erros

| Código | Condição mínima | `params` mínimo |
| --- | --- | --- |
| `INPUT_STRUCTURE_INVALID` | raiz ausente/não objeto simples; container com tipo incorreto; propriedade desconhecida; ausência exclusiva de `geometry`, `capacityProxy` ou `fault` | `{ path, reason, expected?, observed? }` |
| `CONTRACT_VERSION_UNSUPPORTED` | versão diferente da prevista | `{ received, allowed }` |
| `LOAD_CURRENT_INVALID` | ausente, não numérico, não finito ou `<= 0` | `{ field, reason }` |
| `POWER_FACTOR_INVALID` | não finito ou fora de `[0,1]` | `{ field, reason }` |
| `PARALLEL_COUNT_INVALID` | `nParallel` não inteiro ou `< 1` | `{ value }` |
| `CIRCUIT_COUNT_INVALID` | `nCircuits` não inteiro ou `< 1` | `{ value }` |
| `GEOMETRY_STATUS_INVALID` | status/descrição incompatível | `{ status }` |
| `GEOMETRY_AND_IMPEDANCE_MISSING` | geometria ausente e nenhum `Z_i` | `{ nParallel }` |
| `PARALLEL_Z_MISSING` | quantidade de `Z_i` diferente de `nParallel` ou componente ausente | `{ expected, observed, branchId? }` |
| `PARALLEL_Z_NON_FINITE` | `re` ou `im` não finito | `{ branchId, component }` |
| `PARALLEL_Z_ZERO` | módulo de `Z_i` igual a zero | `{ branchId }` |
| `PARALLEL_BRANCH_ID_INVALID` | ID vazio ou duplicado | `{ branchId }` |
| `ASSUMPTION_PROVENANCE_INVALID` | hipótese sem tag exata | `{ field, expected }` |
| `GROUPING_FACTOR_MISSING` | `k_g` ausente | `{ field }` |
| `GROUPING_FACTOR_INVALID` | `k_g` não finito ou fora de `(0,1]` | `{ value }` |
| `GROUPING_PROVENANCE_MISSING` | `k_g` sem proveniência permitida | `{ field }` |
| `TABULATED_AMPACITY_INVALID` | ampacidade ausente, não finita ou `<= 0` | `{ value }` |
| `FAULT_CURRENT_INVALID` | `I_k` não finito ou `< 0` | `{ value }` |
| `FAULT_TIME_INVALID` | `t` não finito ou `< 0` | `{ value }` |
| `ADIABATIC_K_INVALID` | `k` não finito ou `<= 0` | `{ value }` |
| `FAULT_IMBALANCE_MISSING` | modo `BLOCK` ou modo explícito sem valor | `{ mode }` |
| `FAULT_IMBALANCE_INVALID` | modo desconhecido ou `deltaFault` não finito/`< 1` | `{ mode?, value? }` |
| `NUMERIC_RESULT_NON_FINITE` | qualquer cálculo produz valor não finito | `{ stage, field }` |
| `ENGINEERING_ADEQUACY_BLOCKED` | geometria não fornecida/validada ou fonte normativa incompleta | `{ reason }` |
| `DISCRETE_SELECTION_BLOCKED` | tentativa de obter quantidade/seção instalável | `{ reason: "normative_source_incomplete" }` |
| `IEC_CONFORMITY_BLOCKED` | solicitação de conformidade IEC | `{ sourceStatus }` |
| `PRODUCTION_USE_BLOCKED` | solicitação de projeto, compra, instalação ou memorial final | `{ prohibitedUse }` |

Ordem de validação:

1. estrutura de containers e propriedades desconhecidas;
2. versão;
3. corrente e fator de potência;
4. `nParallel` e `nCircuits`;
5. geometria e presença do conjunto de impedâncias;
6. quantidade, IDs, finitude, módulo e proveniência dos `Z_i`;
7. `k_g`, ampacidade e proveniências;
8. entradas de falta, `k`, modo e `deltaFault`;
9. cálculos e finitude dos resultados.

Precedência vinculante para estrutura e impedâncias:

1. raiz ausente, `null`, array ou primitivo; container com tipo incorreto;
   propriedade desconhecida; ou ausência de um dos containers estruturais
   `geometry`, `capacityProxy` e `fault` retorna `INPUT_STRUCTURE_INVALID`;
2. depois de validada a estrutura, `geometry.status=NOT_PROVIDED` combinado com
   `branches` ausente ou vazio retorna `GEOMETRY_AND_IMPEDANCE_MISSING`;
3. com estrutura válida nos demais campos, `branches` ausente/vazio sob geometria
   descrita, quantidade diferente de `nParallel` ou `impedance_ohm` ausente em um
   item retorna `PARALLEL_Z_MISSING`;
4. somente depois da presença dos componentes são avaliados
   `PARALLEL_Z_NON_FINITE` e `PARALLEL_Z_ZERO`.

`branches` é deliberadamente opcional apenas no JSON Schema estrutural para tornar
o bloqueio `GEOMETRY_AND_IMPEDANCE_MISSING` observável e determinístico. Uma
resposta de sucesso continua exigindo exatamente `nParallel` impedâncias válidas.

Razões permitidas de `INPUT_STRUCTURE_INVALID`:

```text
root_not_plain_object
wrong_container_type
unexpected_property
missing_structural_container
```

Toda falha estrutural deve usar o envelope completo da seção 6.2. Nenhuma delas
pode escapar por `throw`, omitir `displayNotice` ou alterar
`productionAllowed=false`.

Não são executadas validações semânticas depois do primeiro erro estrutural.

### 7.1 Resolução vinculante de keywords do JSON Schema

Falhar uma keyword do JSON Schema **não** determina automaticamente
`INPUT_STRUCTURE_INVALID`. O código final é resolvido pelo par `path + keyword`
conforme a tabela abaixo. O validador pode usar JSON Schema como detector, mas deve
aplicar este mapeamento antes de construir o Problem Details.

| Path/escopo | Keyword ou condição | Código |
| --- | --- | --- |
| `$` | ausente, `null`, array ou primitivo | `INPUT_STRUCTURE_INVALID` / `root_not_plain_object` |
| qualquer container | `type` incompatível com objeto/array esperado | `INPUT_STRUCTURE_INVALID` / `wrong_container_type` |
| qualquer objeto | `additionalProperties` | `INPUT_STRUCTURE_INVALID` / `unexpected_property` |
| `$.geometry` | container ausente | `INPUT_STRUCTURE_INVALID` / `missing_structural_container` |
| `$.capacityProxy` | container ausente | `INPUT_STRUCTURE_INVALID` / `missing_structural_container` |
| `$.fault` | container ausente | `INPUT_STRUCTURE_INVALID` / `missing_structural_container` |
| `$.contractVersion` | `required`, `type` ou `const` | `CONTRACT_VERSION_UNSUPPORTED` |
| `$.totalLoadCurrent_A` | `required`, `type`, finitude ou limite | `LOAD_CURRENT_INVALID` |
| `$.powerFactor` | `required`, `type`, finitude ou limites | `POWER_FACTOR_INVALID` |
| `$.nParallel` | `required`, `type`, integralidade ou mínimo | `PARALLEL_COUNT_INVALID` |
| `$.nCircuits` | `required`, `type`, integralidade ou mínimo | `CIRCUIT_COUNT_INVALID` |
| `$.geometry.status/description` | `required`, `type`, `enum` ou `minLength` | `GEOMETRY_STATUS_INVALID` |
| `$.branches` | ausente/vazio com geometria não fornecida | `GEOMETRY_AND_IMPEDANCE_MISSING` |
| `$.branches` | ausente/vazio com geometria descrita; `minItems`; quantidade diferente de `nParallel` | `PARALLEL_Z_MISSING` |
| `$.branches[*].id` | `required`, `type`, vazio ou duplicado | `PARALLEL_BRANCH_ID_INVALID` |
| `$.branches[*].impedance_ohm` | `required` | `PARALLEL_Z_MISSING` |
| `$.branches[*].impedance_ohm.re/im` | `required` | `PARALLEL_Z_MISSING` |
| `$.branches[*].impedance_ohm.re/im` | `type` ou finitude | `PARALLEL_Z_NON_FINITE` |
| `$.branches[*].impedance_ohm` | módulo zero | `PARALLEL_Z_ZERO` |
| `$.branches[*].provenance` | ausente, `type` ou valor diferente do permitido | `ASSUMPTION_PROVENANCE_INVALID` |
| `$.capacityProxy.groupingFactor` | `required` | `GROUPING_FACTOR_MISSING` |
| `$.capacityProxy.groupingFactor.value` | `required`, `type`, finitude ou limites | `GROUPING_FACTOR_INVALID` |
| `$.capacityProxy.groupingFactor.provenance` | ausente | `GROUPING_PROVENANCE_MISSING` |
| `$.capacityProxy.groupingFactor.provenance` | valor fornecido diferente do permitido | `ASSUMPTION_PROVENANCE_INVALID` |
| `$.capacityProxy.tabulatedAmpacityPerConductor_A` ou `.value` | `required`, `type`, finitude ou limite | `TABULATED_AMPACITY_INVALID` |
| `$.capacityProxy.tabulatedAmpacityPerConductor_A.provenance` | ausente, `type` ou valor diferente do permitido | `ASSUMPTION_PROVENANCE_INVALID` |
| `$.fault.totalFaultCurrent_A` | `required`, `type`, finitude ou limite | `FAULT_CURRENT_INVALID` |
| `$.fault.clearingTime_s` | `required`, `type`, finitude ou limite | `FAULT_TIME_INVALID` |
| `$.fault.adiabaticK_A_sqrt_s_per_mm2` ou `.value` | `required`, `type`, finitude ou limite | `ADIABATIC_K_INVALID` |
| `$.fault.adiabaticK_A_sqrt_s_per_mm2.provenance` | ausente, `type` ou valor diferente do permitido | `ASSUMPTION_PROVENANCE_INVALID` |
| `$.fault.imbalance`, `.mode` ou `.deltaFault` no modo explícito | `required`; ou modo `BLOCK` | `FAULT_IMBALANCE_MISSING` |
| `$.fault.imbalance.mode` | `type` ou `enum` inválido | `FAULT_IMBALANCE_INVALID` |
| `$.fault.imbalance.deltaFault` | `type`, finitude ou mínimo | `FAULT_IMBALANCE_INVALID` |
| `$.fault.imbalance.provenance` | ausente, `type` ou valor diferente do permitido | `ASSUMPTION_PROVENANCE_INVALID` |

Campos escalares conhecidos nunca usam `INPUT_STRUCTURE_INVALID`. Ausência, tipo,
finitude e domínio desses campos são resolvidos pelo código específico da tabela.
Somente os três containers enumerados podem usar
`missing_structural_container`.

Somente o primeiro erro de entrada é retornado em `error`. Todos os bloqueios
normativos permanentes são retornados cumulativamente em respostas de sucesso.

## 8. Tolerância e representação numérica

Constante de QA:

```text
TOLERANCIA_COMPUTACIONAL_LAB_AMPAI = ±0,5% relativo
```

Ela é determinística, ambiental/computacional e não normativa IEC. O motor deve
retornar precisão de máquina; a tolerância pertence às asserções do teste, não ao
algoritmo. Para esperado igual a zero, o QA deve usar tolerância absoluta definida
no próprio teste e registrá-la no relatório, sem alterar a tolerância relativa dos
demais campos.

## 9. Invariantes de segurança

1. `deltaLoad` nunca é entrada do cálculo de falta.
2. `deltaFault` nunca é inferido de `deltaLoad`.
3. `nCircuits` nunca é inferido de `nParallel` e vice-versa.
4. Todos os `Z_i` são explícitos e `ASSUMPTION_ONLY`.
5. Geometria não gera impedância.
6. Sem geometria, o resultado permanece `MATHEMATICAL_ONLY` mesmo com `Z_i`.
7. Sem geometria e sem `Z_i`, a execução é bloqueada.
8. `nParallelContinuousProxy` não é arredondado para seleção instalável.
9. `installableSelection` e `installableSection` permanecem `null`.
10. `productionAllowed` permanece `false` em sucesso e falha.
11. O aviso vinculante permanece integral em toda saída.
12. Nenhum warning pode reduzir ou remover um blocker.
13. Nenhum resultado pode ser rotulado `PASS_IEC`, `COMPLIANT` ou equivalente.
14. Nenhum valor do motor BT atual é reutilizado como se fosse fonte normativa.

## 10. Estratégia TDD — RED experimental

O QA deverá criar um único teste inicialmente `experimental`, sem entrada no
manifesto `stable`. Arquivo sugerido:

```text
tests/test_cab_bt_parallel_experimental.js
```

O RED deve testar o módulo futuro diretamente em Node, sem DOM, e emitir relatórios
JSON processáveis. A baseline do RED será a branch do SDD após auditoria e commit
autorizado, nunca a `main`.

### 10.1 Protocolo JSON-lines fechado

Quantidade exata em execução funcional válida:

```text
CAB_BT_PARALLEL_EXP_REPORT count=40
```

Cada relatório ocupa uma única linha, iniciada pelo prefixo literal:

```text
CAB_BT_PARALLEL_EXP_REPORT<ASCII_SPACE>
```

Um único espaço ASCII depois de `REPORT` faz parte do prefixo e é seguido imediatamente por um
objeto JSON válido. Depois dos 40 relatórios, deve existir exatamente uma linha de
resumo com o prefixo:

```text
CAB_BT_PARALLEL_EXP_SUMMARY<ASCII_SPACE>
```

`<ASCII_SPACE>` é notação documental; na saída real corresponde ao byte `0x20` e
não aos caracteres `<`, `A`, `S`, `C`, `I`, `I`, `_`, `S`, `P`, `A`, `C`, `E`, `>`.

Schema mínimo obrigatório de cada relatório:

```json
{
  "id": "SCI-01",
  "category": "scientific",
  "classification": "PASS",
  "assertionExercised": true,
  "expected": {},
  "observed": {},
  "compliant": true
}
```

Restrições do relatório:

- `id`: um dos 40 IDs da seção 10.2, sem repetição;
- `category`: `scientific`, `guardrail`, `numeric_fail_closed` ou
  `structure_fail_closed`;
- `classification`: `PASS` quando `compliant=true` e `FUNCTIONAL_FAILURE` quando
  `compliant=false` em execução funcional;
- `assertionExercised`: boolean obrigatório;
- `expected` e `observed`: objetos obrigatórios, mesmo quando vazios;
- `compliant`: campo de conformidade obrigatório e booleano;
- relatório ausente, duplicado, extra, JSON inválido, campo ausente ou tipo
  incompatível invalida o harness como `CONFIG_ERROR`.

Schema mínimo do resumo:

```json
{
  "classification": "FUNCTIONAL_FAILURE",
  "reports": 40,
  "expectedReports": 40,
  "compliant": 0,
  "nonCompliant": 40,
  "assertionsExercised": 40,
  "processExitCode": 1
}
```

O resumo deve reconciliar exatamente os relatórios. Ele não substitui nenhuma
linha individual.

### 10.2 Mapeamento exato dos 40 relatórios

| ID | Categoria | Contrato exercido |
| --- | --- | --- |
| `SCI-01` | scientific | compartilhamento ideal com três impedâncias idênticas |
| `SCI-02` | scientific | assimetria resistiva do Memorial |
| `SCI-03` | scientific | assimetria reativa, ramo mais carregado e `deltaLoad` |
| `SCI-04` | scientific | `Zeq` e queda de tensão do exemplo assimétrico |
| `SCI-05` | scientific | proxy contínuo com `k_g=1,00` |
| `SCI-06` | scientific | proxy contínuo com `k_g=0,85` |
| `SCI-07` | scientific | proxy contínuo com `k_g=0,70` |
| `SCI-08` | scientific | proxy contínuo com `k_g=0,50` |
| `SCI-09` | scientific | adiabático com `deltaFault=1,00` |
| `SCI-10` | scientific | adiabático com `deltaFault=1,10` |
| `SCI-11` | scientific | `CENARIO_CONSERVADOR_ESCOLHIDO` |
| `GRD-01` | guardrail | `deltaFault` não é inferido nem substituído por `deltaLoad` |
| `GRD-02` | guardrail | `nParallel` e `nCircuits` permanecem independentes |
| `GRD-03` | guardrail | sem geometria, com todos os `Z_i`, retorna `MATHEMATICAL_ONLY` |
| `GRD-04` | guardrail | precedência: sem geometria/sem `Z_i` → `GEOMETRY_AND_IMPEDANCE_MISSING`; geometria descrita/sem `Z_i` → `PARALLEL_Z_MISSING` |
| `GRD-05` | guardrail | aviso literal e integral em sucesso e falha |
| `GRD-06` | guardrail | `productionAllowed=false` em sucesso e falha |
| `GRD-07` | guardrail | blockers B-01 a B-06 presentes no sucesso |
| `GRD-08` | guardrail | `providedParallelCount` e `providedCountMeetsContinuousProxy` são ecos matemáticos; campos `selected*` ausentes; seleções instaláveis `null` |
| `GRD-09` | guardrail | `sourceStatus` não canônico, fonte completa ausente e conformidade falsa |
| `GRD-10` | guardrail | precisão de máquina no motor e comparação QA pela tolerância de ±0,5% |
| `GRD-11` | guardrail | pureza: zero DOM, renderer, console, rede, filesystem e `throw` de domínio |
| `NUM-01` | numeric_fail_closed | `Z_i=0` → `PARALLEL_Z_ZERO` |
| `NUM-02` | numeric_fail_closed | `Z_i=Infinity` → `PARALLEL_Z_NON_FINITE` |
| `NUM-03` | numeric_fail_closed | `Z_i=NaN` → `PARALLEL_Z_NON_FINITE` |
| `NUM-04` | numeric_fail_closed | `I_k=-1` → `FAULT_CURRENT_INVALID` |
| `NUM-05` | numeric_fail_closed | `I_k=NaN` → `FAULT_CURRENT_INVALID` |
| `NUM-06` | numeric_fail_closed | `t=-0,1` → `FAULT_TIME_INVALID` |
| `NUM-07` | numeric_fail_closed | `t=Infinity` → `FAULT_TIME_INVALID` |
| `NUM-08` | numeric_fail_closed | `k=0` → `ADIABATIC_K_INVALID` |
| `NUM-09` | numeric_fail_closed | `k=-5` → `ADIABATIC_K_INVALID` |
| `NUM-10` | numeric_fail_closed | `deltaFault=0,5` → `FAULT_IMBALANCE_INVALID` |
| `NUM-11` | numeric_fail_closed | `deltaFault=-1` → `FAULT_IMBALANCE_INVALID` |
| `NUM-12` | numeric_fail_closed | `deltaFault=Infinity` → `FAULT_IMBALANCE_INVALID` |
| `STR-01` | structure_fail_closed | invocação sem argumento/`undefined` → `INPUT_STRUCTURE_INVALID` |
| `STR-02` | structure_fail_closed | raiz `null` → `INPUT_STRUCTURE_INVALID` |
| `STR-03` | structure_fail_closed | raiz array → `INPUT_STRUCTURE_INVALID` |
| `STR-04` | structure_fail_closed | raiz primitiva → `INPUT_STRUCTURE_INVALID` |
| `STR-05` | structure_fail_closed | container raiz `geometry` ausente → `INPUT_STRUCTURE_INVALID` com `path="$.geometry"` e `reason="missing_structural_container"` |
| `STR-06` | structure_fail_closed | propriedade desconhecida na raiz ou objeto aninhado → `INPUT_STRUCTURE_INVALID` |

### 10.3 Exit codes e RED válido

| Exit | Classificação | Condição |
| --- | --- | --- |
| `0` | `PASS` | exatamente 40 relatórios, IDs únicos, todos `compliant=true`, todos `assertionExercised=true` e resumo reconciliado |
| `1` | `FUNCTIONAL_FAILURE` | exatamente 40 relatórios completos, todos com asserção exercida e pelo menos um `compliant=false` |
| `2` | `INFRA_BLOCKED` | runtime/dependência indisponível antes de qualquer asserção; não permite inferência funcional |
| `3` | `CONFIG_ERROR` | relatório ausente/extra/duplicado/inválido, resumo ausente/inconsistente, prefixo incorreto ou qualquer `assertionExercised=false` |

Como o módulo ainda não existe, o teste deve iniciar normalmente e tratar a
ausência controlada do arquivo/export como `FUNCTIONAL_FAILURE`. Para manter o
protocolo fechado, ele deve emitir os 40 IDs, todos com
`assertionExercised=true`, `compliant=false` e `observed.reason="module_missing"`,
seguido do resumo com exit `1`. Um `require` não tratado que aborte antes dos
relatórios é `CONFIG_ERROR`, nunca RED válido.

Ausência ou incompletude de relatório tem precedência sobre a contagem de falhas
funcionais e normaliza o processo para exit `3`. O QA não cria stub de produção,
não implementa a correção e devolve o veredito exclusivamente ao CTO.

### 10.4 Regressão preservada

O teste novo permanece fora de `qa/test-manifest.json`. A regressão obrigatória da
futura candidata Backend inclui:

```text
npm.cmd run test:core
```

e os seis testes `stable` do Gate vigente quando houver execução remota aplicável.
Nenhuma promoção para `stable` faz parte desta cadeia experimental.

## 11. Backend integrado — registro histórico

O `@Senior_Backend_Dev` implementou o motor em worktree isolado sobre o RED
imutável. O QA independente confirmou 40/40 relatórios em três processos, e a
cadeia foi integrada pela PR #39. A allowlist executada foi:

```text
js/core_cabos_bt_parallel_experimental.js
```

O commit Backend `b6466f768bf60dc2d010d9a87d85f7edd10e9c60` adicionou somente esse
arquivo. O teste do QA, documentos científicos, SDD, UI, manifesto, workflow e
package permaneceram fora do commit. Esse histórico não autoriza nova mutação do
motor durante a fase de UI.

## 12. Contrato da UI experimental de laboratório

Esta seção autoriza **somente a esteira TDD da UI experimental**, condicionada à
auditoria documental do Conselho. O motor recebeu GREEN independente e foi
integrado pela PR #39 em `main@83e24131c0cc09813be65a5fa269961b9cc80c5c`.
Essa integração não promoveu o RNC-P, não resolveu B-01 a B-06 e não autorizou
uso produtivo.

### 12.1 Arquitetura, habitat e isolamento

A UI deve:

- permanecer no módulo Cabos, cartão BT, em painel separado denominado
  **Laboratório experimental — condutores em paralelo**;
- iniciar recolhida e ser aberta por controle explícito do usuário;
- coexistir com o dimensionamento BT vigente sem substituir, preencher, limpar,
  disparar ou reinterpretar seus controles e resultados;
- consumir exclusivamente
  `window.calculateCablingBTParallelExperimental(input)`;
- não reproduzir fórmula, tabela normativa, arredondamento de seleção ou regra de
  domínio em `index.html` ou `js/ui_render.js`;
- chamar o motor exatamente uma vez por acionamento válido de **Calcular estudo
  experimental**;
- limpar resultado experimental anterior antes de apresentar novo sucesso ou
  erro, sem tocar no resultado BT produtivo;
- manter o teste novo como `experimental`, fora do manifesto `stable`.

Allowlist futura do Frontend:

```text
index.html
js/ui_render.js
```

O Frontend não altera `js/core_cabos_bt_parallel_experimental.js`, `tests/**`,
documentação, manifesto, workflow ou package. Um novo arquivo de UI não é
autorizado nesta fase.

### 12.2 Contrato DOM mínimo e estável

Os identificadores abaixo são públicos para QA e não podem ser renomeados sem
nova revisão do contrato:

| ID | Papel |
| --- | --- |
| `cab-bt-par-exp-toggle` | abre/fecha o painel e mantém `aria-expanded` |
| `cab-bt-par-exp-panel` | região experimental isolada |
| `cab-bt-par-exp-notice` | aviso vinculante permanentemente visível no painel |
| `cab-bt-par-exp-form` | formulário de hipóteses laboratoriais |
| `cab-bt-par-exp-branches` | linhas dinâmicas de impedância dos ramos |
| `cab-bt-par-exp-calculate` | único acionador do motor |
| `cab-bt-par-exp-error` | Problem Details e governança de falha |
| `cab-bt-par-exp-result` | envelope de sucesso, sem memorial final |
| `cab-bt-par-exp-governance` | classificação, fonte, produção, assumptions e blockers |
| `cab-bt-par-exp-numbers` | resultados numéricos exibidos depois da governança |

O aviso em `cab-bt-par-exp-notice` deve usar o valor literal, integral e sem
tradução:

```text
PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO
```

Ele permanece visível desde a abertura do painel, antes do cálculo e depois de
sucesso ou falha. Tooltip, modal, rodapé recolhido ou texto abreviado não
satisfazem o contrato.

### 12.3 Entradas da UI

A UI materializa, sem reinterpretar, o contrato da seção 4:

| Campo visual | Campo do motor | Valor inicial do exemplo de laboratório |
| --- | --- | --- |
| Corrente total | `totalLoadCurrent_A` | `900 A` |
| Fator de potência | `powerFactor` | `0.9` |
| Ramos em paralelo por fase | `nParallel` | `3` |
| Circuitos agrupados | `nCircuits` | `1` |
| Estado/descrição da geometria | `geometry` | `NOT_PROVIDED` / `null` |
| Ramos P1…Pn | `branches` | impedâncias da seção 4.1 |
| Fator de agrupamento | `capacityProxy.groupingFactor.value` | `0.7` |
| Ampacidade tabelada por condutor | `capacityProxy.tabulatedAmpacityPerConductor_A.value` | `344 A` |
| Corrente de falta total | `fault.totalFaultCurrent_A` | `20000 A` |
| Tempo de eliminação | `fault.clearingTime_s` | `0.2 s` |
| Constante adiabática | `fault.adiabaticK_A_sqrt_s_per_mm2.value` | `115 A·√s/mm²` |
| Modo de desbalanço de falta | `fault.imbalance.mode` | `EXPLICIT_ASSUMPTION` |
| Desbalanço de falta | `fault.imbalance.deltaFault` | `1.1` |

`contractVersion` é fixo em `CAB-BT-PARALLEL-EXP-1`; todas as proveniências são
fixas e visíveis como `ASSUMPTION_ONLY`. Alterar `nParallel` reconstrói exatamente
`nParallel` linhas P1…Pn. A UI não copia esse valor para `nCircuits` e não infere
um campo do outro.

DTOs condicionais vinculantes de geometria:

```json
{ "status": "NOT_PROVIDED", "description": null }
```

```json
{ "status": "DESCRIBED", "description": "descrição não vazia informada pelo usuário" }
```

`NOT_PROVIDED` sempre envia `description:null`. `DESCRIBED` sempre envia uma
string não vazia. A descrição não gera nem substitui `branches[].impedance_ohm`.

DTOs condicionais vinculantes de falta:

```json
{
  "mode": "EXPLICIT_ASSUMPTION",
  "deltaFault": 1.1,
  "provenance": "ASSUMPTION_ONLY"
}
```

```json
{ "mode": "CONSERVATIVE_SINGLE_BRANCH" }
```

```json
{ "mode": "BLOCK" }
```

`deltaFault` e `provenance` existem **somente** em `EXPLICIT_ASSUMPTION`. Nos
modos `CONSERVATIVE_SINGLE_BRANCH` e `BLOCK`, a UI deve omitir fisicamente essas
duas propriedades do objeto enviado. Esconder campos no DOM sem removê-los do DTO
não satisfaz o contrato e pode produzir `INPUT_STRUCTURE_INVALID`. O modo `BLOCK`
é uma contraprova fail-closed esperada e retorna `FAULT_IMBALANCE_MISSING`.

Os campos numéricos preservam o valor informado para o motor. Restrições HTML
podem orientar o usuário, mas não substituem o Result Pattern nem inventam uma
segunda validação de domínio.

### 12.4 Ordem e conteúdo da saída

Em sucesso, a ordem visual vinculante é:

1. aviso permanente;
2. `MATHEMATICAL_ONLY`, `productionAllowed=false`, fonte primária ausente e
   `iecConformity=false`;
3. `assumptions` completas;
4. `blockers` completos, incluindo B-01 a B-06;
5. `warnings`;
6. somente então os números do envelope.

Os números devem ser projeções diretas dos caminhos reais do envelope, sem
adaptador, alias ou recálculo:

- `data.loadSharing.branchCurrents`;
- `data.loadSharing.mostLoadedBranchId`;
- `data.loadSharing.tiedMostLoadedBranchIds`;
- `data.loadSharing.deltaLoad` e `data.loadSharing.deratingFactor`;
- `data.loadSharing.equivalentImpedance_ohm`;
- `data.capacityProxy`, incluindo `nParallelContinuousProxy`,
  `providedParallelCount` e `providedCountMeetsContinuousProxy`;
- `data.voltageDrop.threePhase_V`, mantendo `voltageDropPercent` e
  `normativeVoltageDropLimit` como `null`;
- `data.faultAdiabatic`, inclusive modo, `deltaFaultEffective`, corrente por ramo
  e seção contínua matemática.

`nParallelContinuousProxy` nunca recebe `ceil`, arredondamento ou rótulo de
quantidade recomendada. `installableSelection` e `installableSection` permanecem
`null`; a UI deve apresentar **seleção instalável bloqueada**.

### 12.5 Falha e proibições observáveis

Em `ok:false`, a UI deve:

- manter aviso, `productionAllowed=false` e fonte não canônica visíveis;
- apresentar `error.code`, `title`, `status` e `params` do Problem Details;
- não lançar exceção, não deixar número de execução anterior e não converter a
  falha em alerta de conformidade.

São proibidos:

- botão, link ou ação de exportar memorial final, projeto, compra ou instalação;
- botão ou rótulo `conforme IEC`, `PASS_IEC`, `COMPLIANT` ou equivalente;
- inclusão do painel dentro de `#cb-mem-bt-container` ou acionamento de
  `#btn-memorial-bt`;
- preenchimento automático dos campos do dimensionamento BT vigente;
- recomendação de seção comercial, quantidade instalável, terminal ou busway;
- ocultação de assumption, blocker, aviso ou `productionAllowed=false`.

### 12.6 i18n, acessibilidade e responsividade

- rótulos e explicações da UI devem existir em PT, EN e ES;
- tokens contratuais, códigos, unidades e o aviso literal não são traduzidos;
- controles devem possuir `label`, foco por teclado e estados ARIA coerentes;
- erro usa região `role="alert"`; resultado usa região anunciável não assertiva;
- em 1280 px e 375 px não pode haver overflow horizontal do documento ou do
  cartão, truncamento de aviso, sobreposição ou perda de controles;
- temas claro e escuro devem preservar contraste e legibilidade;
- nenhum `console.error`, `pageerror`, `undefined`, `NaN` ou `--` é aceito.

### 12.7 RED visual experimental processável

Arquivo futuro exclusivo do QA:

```text
tests/test_cab_bt_parallel_ui_experimental.js
```

Classificação inicial: `experimental`. Protocolo JSON-lines:

```text
CAB_BT_PARALLEL_UI_EXP_REPORT {JSON}
CAB_BT_PARALLEL_UI_EXP_SUMMARY {JSON}
```

Cada relatório deve conter, no mínimo:

```json
{
  "id": "UI-01",
  "classification": "PASS|FUNCTIONAL_FAILURE|INFRA_BLOCKED|CONFIG_ERROR",
  "compliant": false,
  "assertionExercised": true,
  "expected": {},
  "observed": {}
}
```

Devem existir exatamente **15 relatórios**, com IDs únicos e nesta matriz:

| ID | Contrato |
| --- | --- |
| `UI-01` | painel experimental existe, inicia recolhido e não substitui BT |
| `UI-02` | aviso literal permanece visível antes/depois de sucesso e falha |
| `UI-03` | formulário materializa o exemplo completo e proveniências |
| `UI-04` | `nParallel` cria ramos exatos e não altera `nCircuits` |
| `UI-05` | clique chama o motor real exatamente uma vez, sem fórmula na UI |
| `UI-06` | governança aparece antes de qualquer número |
| `UI-07` | projeção numérica coincide diretamente com o envelope real |
| `UI-08` | Problem Details fail-closed limpa resultado anterior |
| `UI-09` | proxy não vira seleção discreta ou recomendação instalável |
| `UI-10` | nenhuma ação/rótulo de memorial final ou conformidade existe |
| `UI-11` | PT/EN/ES sem traduzir tokens nem o aviso vinculante |
| `UI-12` | desktop 1280 px sem overflow, truncamento ou sobreposição |
| `UI-13` | mobile 375 px e temas claro/escuro sem overflow ou perda |
| `UI-14` | teclado, labels, ARIA e regiões de anúncio conformes |
| `UI-15` | memorial BT, motor BT vigente e resultados existentes intactos |

Resumo obrigatório:

```json
{
  "classification": "PASS|FUNCTIONAL_FAILURE|INFRA_BLOCKED|CONFIG_ERROR",
  "reports": 15,
  "expectedReports": 15,
  "compliant": 0,
  "nonCompliant": 15,
  "assertionsExercised": 15,
  "processExitCode": 1
}
```

Mapeamento de processo: `0=PASS`, `1=FUNCTIONAL_FAILURE`, `2=INFRA_BLOCKED`,
`3=CONFIG_ERROR`. Relatório ausente, duplicado, incompleto ou summary não
reconciliado é `CONFIG_ERROR`. O RED válido exige preflight Chromium `0`, UI
ausente ou não conforme, assertions exercidas, 15 relatórios completos e exit `1`.

Regressões obrigatórias para o futuro GREEN, com comandos e resultados
determinísticos:

| Execução | Comando exato | Resultado esperado |
| --- | --- | --- |
| UI visual 1 | `node tests/test_cab_bt_parallel_ui_experimental.js` | exit `0`; 15/15 PASS |
| UI visual 2 | novo processo com o mesmo comando | exit `0`; 15/15 PASS |
| UI visual 3 | novo processo com o mesmo comando | exit `0`; 15/15 PASS |
| Motor experimental | `node tests/test_cab_bt_parallel_experimental.js` | exit `0`; 40/40 PASS |
| Critérios BT | `node tests/test_cab_bt_criteria_001.js` | exit `0`; 6/6 PASS |
| Resiliência Lucide | `node tests/test_ui_lucide_boot_001.js` | exit `0`; 3/3 PASS |
| Gate stable completo | `npm run test:regression` | exit `0`; seis stable, 3 core + 3 browser |
| Whitespace | `git diff --check <baseline>...HEAD` | exit `0` |

Em Windows, o executor pode invocar `npm.cmd run test:regression`, preservando o
mesmo script npm e contrato. A execução remota funcional obrigatória usa
`.github/workflows/qa-visual.yml`, `workflow_dispatch`, input
`test_file=tests/test_cab_bt_parallel_ui_experimental.js`, SHA imutável, attempt 1
e sem rerun. O artifact `qa-visual-evidence` deve conter exatamente os 15
relatórios, o summary reconciliado, preflight/processo `0/0` e stderr funcional
vazio. A futura PR também executa o Regression Gate shadow vigente; esse Gate
prova ausência de regressão stable, não substitui o GREEN visual experimental.

### 12.8 Handoff e aceite

Sequência autorizável após auditoria desta seção:

```text
Conselho → CTO → QA RED → CTO → Frontend GREEN → CTO → QA independente
→ CTO → TESTE DO CEO → PR → merge humano → pós-merge/encerramento
```

O Frontend devolve a candidata ao CTO e não contata o QA diretamente. O QA não
implementa correção. O CEO testa somente SHA imutável após GREEN independente e
remoto.

`TESTE DO CEO: SIM`. Cenário mínimo: abrir o painel no cartão BT, confirmar o
aviso antes dos resultados, executar o exemplo de 900 A/3 ramos e verificar que
`MATHEMATICAL_ONLY`, assumptions, blockers e `productionAllowed=false` precedem
os números e que nenhuma recomendação instalável ou memorial final é oferecido.

## 13. Evidência, Git e ciclo de vida

O motor e sua cadeia científica experimental foram integrados pela PR #39, com
GREEN independente e Gate pós-merge. Nesta revisão:

- somente o contrato da UI e o Registro Mestre podem mudar;
- não há teste visual ou implementação de UI autorizados antes da auditoria do
  Conselho;
- eventual commit/push documental exige autorização posterior do CEO;
- a implementação futura permanece experimental e somente pode chegar a PR após
  RED, GREEN, QA independente, CI remoto e teste manual do CEO;
- CodeRabbit não substitui Conselho, QA ou artifact;
- qualquer CI futura deve publicar artifact processável e preservar a taxonomia
  `PASS`, `FUNCTIONAL_FAILURE`, `INFRA_BLOCKED` e `CONFIG_ERROR`;
- integração em `main` não promove o conteúdo a RNC-C, `stable` ou produção.

Condição de arquivamento ou promoção: somente nova decisão científica, fonte
primária completa, promoção formal a RNC-C e resolução rastreável dos bloqueios
podem iniciar avaliação para produção. Isso exige nova O.S. CHG-3.

## 14. Bloco de README futuro — não aplicar nesta O.S.

```md
### Laboratório experimental — Cabos BT em paralelo

O AmpAI mantém um estudo matemático experimental de divisão de corrente entre
condutores BT em paralelo. O recurso é `MATHEMATICAL_ONLY`, usa hipóteses
`ASSUMPTION_ONLY` e não possui conformidade IEC nem autorização para projeto,
compra ou instalação. A seleção instalável permanece bloqueada até a obtenção e
ratificação das fontes normativas completas.
```

Este bloco só poderá ser considerado em uma mudança documental futura e nunca
deve apresentar o protótipo como funcionalidade produtiva.

## 15. Registro da mudança

```text
ID: CAB-BT-PARALLEL-001-SDD-EXP
Classe: CHG-3 científica experimental
Domínio: arquitetura de motor matemático BT em laboratório
Responsável pelo contrato: @CTO
Consultados: @Engenheiro_Eletricista; @Conselho_de_Arquitetura_e_Governanca
Baseline científica: 18627dd02c94265984aa953d35f47c2745cab61d
Produção: BLOQUEADA
Motor/teste/SDD integrados: PR #39; merge 83e24131c0cc09813be65a5fa269961b9cc80c5c
Motor GREEN: b6466f768bf60dc2d010d9a87d85f7edd10e9c60; QA 40/40 em três processos
Gate pós-merge: #29789874074 — SUCCESS
Estado atual: MOTOR_GREEN_INTEGRADO; UI_SDD_CANDIDATO_PARA_AUDITORIA
Condição para RED visual: auditoria focalizada do Conselho + commit/push documental autorizado + O.S. do CTO
Condição de encerramento desta etapa: parecer documental do Conselho sobre a UI
```

## 16. Roteamento e autoridade

| Fase | Executor | Autoridade do resultado | Retorno obrigatório |
| --- | --- | --- | --- |
| Auditoria do SDD | Conselho | Conselho | CTO |
| RED experimental | Senior QA-Security | QA | CTO |
| GREEN do motor | Senior Backend Dev | implementação sem veredito | CTO |
| QA independente | Senior QA-Security | QA | CTO |
| UI experimental futura | Senior Frontend Dev | implementação sem veredito | CTO |
| QA visual futura | Senior QA-Security | QA | CTO |
| Aceite manual futuro | CEO | CEO | CTO |

Nenhum executor escolhe ou contata autonomamente o próximo. O CTO permanece Torre
de Controle sem substituir a autoridade científica, institucional ou de QA.

## 17. Decisão de aceite

```text
TESTE DO CEO: NÃO
```

Justificativa nesta etapa: a alteração é exclusivamente documental e arquitetural.
A evidência substitutiva é a auditoria do Conselho, a rastreabilidade ao commit
científico e `git diff --check`.

Para qualquer protótipo observável futuro:

```text
TESTE DO CEO: SIM
```

Cenário mínimo futuro: informar hipóteses laboratoriais, executar um exemplo
reproduzível e confirmar que o aviso vinculante, `MATHEMATICAL_ONLY`, assumptions,
blockers e `productionAllowed=false` permanecem visíveis antes dos resultados.

## 18. Checklist interno do CTO

- [x] Contrato destinado a `docs/api/`.
- [x] Result Pattern e falhas RFC 7807 definidos.
- [x] Entradas, unidades, domínios e ordem de validação definidos.
- [x] Saídas matemáticas separadas de seleção instalável.
- [x] `deltaLoad` separado de `deltaFault`.
- [x] `nParallel` separado de `nCircuits`.
- [x] Aviso vinculante presente em sucesso e falha.
- [x] Produção e conformidade IEC bloqueadas.
- [x] Teste novo classificado como experimental.
- [x] Regressão `stable` preservada.
- [x] Arquitetura core sem DOM e UI sem fórmula preservada.
- [x] Diretriz RNC e critério de futura promoção registrados.
- [x] Bloco de README apenas proposto, não aplicado.
- [x] Registro, roteamento, habitat e aceite do CEO declarados.
