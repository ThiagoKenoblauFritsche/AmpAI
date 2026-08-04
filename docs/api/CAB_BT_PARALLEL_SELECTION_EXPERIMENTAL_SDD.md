---
status: SDD_EXPERIMENTAL_RATIFICADO_PARA_CORRECAO_DO_RED
document_class: active
authority: "@CTO"
consumers:
  - "@Senior_QA_Security"
  - "@Senior_Backend_Dev"
  - "@Senior_Frontend_Dev"
lifecycle: "candidato até ratificação do Conselho; experimental enquanto a fonte primária integral estiver ausente"
governanca: v7.3
os: CAB-BT-PARALLEL-002-SDD-EXP-R3
classe: CHG-3 arquitetural/contratual experimental
baseline_imutavel: 2b61627d8640fce91eb229ca522ae33a143671df
baseline_git_da_correcao: 39d1b2c6b43a3f8a1a0f8ee8fcc03f03f234192d
parecer_origem: CAB-BT-PARALLEL-002-CONTRACT-ORACLE-001
baseline_main_de_origem: 83e24131c0cc09813be65a5fa269961b9cc80c5c
fonte_primaria_completa: AUSENTE
estado_producao: BLOQUEADO
productionAllowed: false
teste_do_ceo: SIM_APOS_GREEN_INDEPENDENTE_E_REMOTO_DA_UI
data: 2026-08-03
---

# SDD experimental — Enumeração e comparação preliminar de cabos BT em paralelo

> **PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.**
>
> Este contrato é **EXPERIMENTAL_PRELIMINAR_NAO_CANONICO**, para **LABORATORIO_APENAS**.
> Ele não é RNC-C, não declara conformidade IEC, não autoriza memorial final e mantém
> `productionAllowed=false`, `installableSelection=null` e os bloqueios B-01…B-06.
> A PR #40 permanece **DO NOT MERGE** e não é baseline desta implementação.

## 1. Decisão executiva e alcance

Este SDD transforma o pacote científico ratificado no commit
`2b61627d8640fce91eb229ca522ae33a143671df` em um contrato técnico testável para:

1. validar um catálogo experimental rastreável;
2. formar o produto cartesiano completo `seções × nParallel`;
3. preparar uma entrada distinta do motor L0 para cada combinação;
4. consumir, sem recalcular, o envelope real de
   `calculateCablingBTParallelExperimental()`;
5. avaliar ampacidade, queda de tensão e curto-circuito;
6. particionar todas as combinações em válidas e rejeitadas/bloqueadas;
7. computar a fronteira não dominada;
8. ordenar alternativas por objetivo configurável, sem eleger solução instalável;
9. fornecer um modelo de apresentação compreensível, como `2 × 240 mm² por fase`.

O contrato **não** autoriza seleção produtiva, recomendação comercial, aquisição, instalação,
dimensionamento final, memorial final ou afirmação de conformidade IEC. Enquanto a IEC 60364-5-52
Ed. 3.1 integral e os dados normativos bloqueados não forem adquiridos e ratificados, toda saída é
`MATHEMATICAL_ONLY`.

### 1.1 Justificativa do novo arquivo

Este documento tem autoridade, consumidores e ciclo de vida diferentes do SDD do motor L0 existente:

- `CAB_BT_PARALLEL_EXPERIMENTAL_SDD.md` especifica exclusivamente divisão por impedâncias e proxies L0;
- este documento especifica L1–L3, o catálogo, a enumeração, a comparação e o modelo de apresentação;
- o motor L0 integrado pela PR #39 permanece imutável e é dependência obrigatória.

## 2. Fontes, autoridade e precedência

| Fonte | Identificação | Classe | Autoridade neste SDD |
| --- | --- | --- | --- |
| Registro científico prático | `RNC-P_CAB_BT_PARALLEL_SELECTION_PRELIM.md` em `2b61627d…` | RNC-P experimental ratificado para SDD | requisitos e limites L1–L3 |
| Memorial prático | `CAB_BT_PARALLEL_SELECTION_PRELIM_Memorial.md` em `2b61627d…` | memorial experimental | equações, casos e números esperados |
| BDD prático | `CAB_BT_PARALLEL_SELECTION_PRELIM_BDD.feature` em `2b61627d…` | evidência comportamental científica | cenários obrigatórios do RED |
| Motor integrado | `js/core_cabos_bt_parallel_experimental.js` em `main@83e24131…` | implementação experimental L0 | única fonte executável de L0 |
| SDD L0 | `docs/api/CAB_BT_PARALLEL_EXPERIMENTAL_SDD.md` | contrato experimental integrado | envelope e erros do L0 |
| IEC 60364-5-52 Ed. 3.1 integral | ausente | norma primária ausente | **não disponível para regra produtiva** |

Precedência vinculante:

1. norma primária integral e futuro RNC-C, quando ratificados;
2. contrato L0 integrado para os cálculos que já executa;
3. pacote científico `2b61627d…` para L1–L3;
4. este SDD para estrutura de software, DTOs, Result Pattern e evidência;
5. exemplos e textos de interface, que nunca substituem os itens anteriores.

Qualquer divergência científica retorna ao Conselho; Backend, Frontend e QA não reinterpretam fórmulas.

## 3. Arquitetura e fronteiras

### 3.1 Componentes previstos

| Camada | Arquivo/função | Responsabilidade |
| --- | --- | --- |
| L0 existente | `js/core_cabos_bt_parallel_experimental.js` / `calculateCablingBTParallelExperimental(input)` | admitâncias, correntes, `Zeq`, `deltaLoad`, proxy térmico, queda em V e adiabático |
| L1–L3 novo | `js/core_cabos_bt_parallel_selection_experimental.js` / `enumerateCablingBTParallelAlternativesExperimental(input)` | validar catálogo, enumerar, chamar L0, avaliar critérios, fronteira e ordenação |
| UI futura | `index.html` e `js/ui_render.js` | coletar/confirmar entradas e renderizar exclusivamente o modelo recebido |
| RED core | `tests/test_cab_bt_parallel_selection_experimental.js` | 74 contratos processáveis: 48 científicos + 26 técnicos |
| RED visual futuro | `tests/test_cab_bt_parallel_selection_ui_experimental.js` | 15 contratos visuais, somente após GREEN independente do core |

### 3.2 Regras arquiteturais vinculantes

- O novo motor é síncrono, determinístico e puro.
- Zero DOM, renderer, console, rede, filesystem, relógio, locale implícito ou aleatoriedade no core.
- Zero mutação da entrada, do catálogo, dos envelopes L0 ou de estado global.
- O novo motor **deve chamar** `calculateCablingBTParallelExperimental()` exatamente uma vez por combinação
  que alcance L0; não copia nem reimplementa sua matemática.
- L1 lê exclusivamente estes caminhos do sucesso L0:
  - `data.capacityProxy.totalAdmissibleCurrentProxy_A`;
  - `data.capacityProxy.nParallelContinuousProxy`;
  - `data.voltageDrop.threePhase_V`;
  - `data.faultAdiabatic.minimumSectionContinuous_mm2`;
  - `data.loadSharing.deltaLoad`;
  - `blockers`, `assumptions`, `sourceStatus`, `productionAllowed` e `displayNotice`.
- Um erro L0 é propagado nominalmente para a combinação; não há número parcial, fallback ou segunda chamada.
- Nenhum valor de `material`, `insulation` ou `installationMethod` deriva silenciosamente ampacidade,
  impedância, `k`, `k_g` ou geometria.
- A UI não contém fórmulas, fronteira, ordenação, interpretação IEC ou regra de elegibilidade.
- O vocabulário produtivo “recomendado”, “selecionado”, “solução final” e “dimensionamento final” é proibido.

## 4. Contrato público L1–L3

### 4.1 Função e versão

```js
enumerateCablingBTParallelAlternativesExperimental(input)
```

- versão exata: `CAB-BT-PARALLEL-SELECTION-EXP-1`;
- CommonJS: `module.exports = { enumerateCablingBTParallelAlternativesExperimental }`;
- browser futuro: `window.enumerateCablingBTParallelAlternativesExperimental`;
- retorno: Result Pattern; erros de entrada e domínio nunca escapam por `throw`.

O nome histórico `SELECTION` aparece apenas na versão/arquivos para rastreabilidade. A semântica pública é
**enumeração e comparação**, jamais seleção instalável.

### 4.2 Entrada de referência reproduzível

O fixture-base abaixo é vinculante para os números do Memorial. Todos os valores de catálogo são
`ASSUMPTION_ONLY` e a hipótese guiada precisa ser apresentada e confirmada antes da chamada.

```json
{
  "contractVersion": "CAB-BT-PARALLEL-SELECTION-EXP-1",
  "analysisMode": "MODO_GUIADO_PRELIMINAR",
  "objective": "NONE",
  "totalLoadCurrent_A": 600,
  "lineVoltage_V": 400,
  "powerFactor": {
    "value": 0.9,
    "inputClass": "SUGERIDA_COM_CONFIRMACAO",
    "confirmed": true,
    "provenance": "ASSUMPTION_ONLY"
  },
  "maximumVoltageDrop_percent": 3,
  "maxParallelCount": 4,
  "nCircuits": 1,
  "arrangement": "LAB_IDENTICAL_BRANCHES",
  "catalog": {
    "mode": "CATALOGO_LAB_ASSUMPTION_ONLY",
    "confirmed": true,
    "source": "CAB_BT_PARALLEL_SELECTION_PRELIM_Memorial.md",
    "sourceVersion": "2b61627d8640fce91eb229ca522ae33a143671df",
    "provenance": "ASSUMPTION_ONLY",
    "impedanceBasis": {
      "length_m": 100,
      "description": "Z(S)=2.25/S+j0.008 ohm; laboratory placeholder",
      "provenance": "ASSUMPTION_ONLY"
    },
    "candidates": [
      {
        "section_mm2": 95,
        "tabulatedAmpacity_A": 240,
        "material": "COPPER_LAB",
        "insulation": "LAB_UNSPECIFIED",
        "installationMethod": "LAB_UNSPECIFIED",
        "referenceTemperature_C": 30,
        "units": "SI",
        "source": "LAB_CATALOG",
        "sourceVersion": "PRELIM-1",
        "provenance": "ASSUMPTION_ONLY",
        "impedance_ohm": { "re": 0.02368421052631579, "im": 0.008 }
      },
      {
        "section_mm2": 120,
        "tabulatedAmpacity_A": 285,
        "material": "COPPER_LAB",
        "insulation": "LAB_UNSPECIFIED",
        "installationMethod": "LAB_UNSPECIFIED",
        "referenceTemperature_C": 30,
        "units": "SI",
        "source": "LAB_CATALOG",
        "sourceVersion": "PRELIM-1",
        "provenance": "ASSUMPTION_ONLY",
        "resistance_ohm": 0.01875,
        "reactance_ohm": 0.008
      },
      {
        "section_mm2": 150,
        "tabulatedAmpacity_A": 330,
        "material": "COPPER_LAB",
        "insulation": "LAB_UNSPECIFIED",
        "installationMethod": "LAB_UNSPECIFIED",
        "referenceTemperature_C": 30,
        "units": "SI",
        "source": "LAB_CATALOG",
        "sourceVersion": "PRELIM-1",
        "provenance": "ASSUMPTION_ONLY",
        "impedance_ohm": { "re": 0.015, "im": 0.008 }
      },
      {
        "section_mm2": 185,
        "tabulatedAmpacity_A": 380,
        "material": "COPPER_LAB",
        "insulation": "LAB_UNSPECIFIED",
        "installationMethod": "LAB_UNSPECIFIED",
        "referenceTemperature_C": 30,
        "units": "SI",
        "source": "LAB_CATALOG",
        "sourceVersion": "PRELIM-1",
        "provenance": "ASSUMPTION_ONLY",
        "impedance_ohm": { "re": 0.012162162162162163, "im": 0.008 }
      },
      {
        "section_mm2": 240,
        "tabulatedAmpacity_A": 445,
        "material": "COPPER_LAB",
        "insulation": "LAB_UNSPECIFIED",
        "installationMethod": "LAB_UNSPECIFIED",
        "referenceTemperature_C": 30,
        "units": "SI",
        "source": "LAB_CATALOG",
        "sourceVersion": "PRELIM-1",
        "provenance": "ASSUMPTION_ONLY",
        "impedance_ohm": { "re": 0.009375, "im": 0.008 }
      }
    ]
  },
  "grouping": {
    "mode": "LAB_CONSTANT_CONFIRMED",
    "value": 0.8,
    "confirmed": true,
    "source": "laboratory sensitivity",
    "sourceVersion": "PRELIM-1",
    "provenance": "ASSUMPTION_ONLY"
  },
  "guidedHypothesis": {
    "displayedBeforeCalculation": true,
    "confirmed": true,
    "provenance": "ASSUMPTION_ONLY"
  },
  "advancedBranchesByCombination": [],
  "fault": {
    "totalFaultCurrent_A": 20000,
    "clearingTime_s": 0.2,
    "adiabaticK_A_sqrt_s_per_mm2": {
      "value": 115,
      "provenance": "ASSUMPTION_ONLY"
    },
    "imbalance": {
      "mode": "EXPLICIT_ASSUMPTION",
      "deltaFault": 1,
      "provenance": "ASSUMPTION_ONLY"
    }
  },
  "pruning": {
    "maximumSection_mm2": null,
    "confirmed": false,
    "provenance": null
  },
  "providedCombination": { "section_mm2": 150, "nParallel": 3 }
}
```

### 4.3 Campos globais e domínios

O schema abaixo é estrutural e válido em JSON Schema 2020-12. As tabelas e regras condicionais das
subseções seguintes são igualmente vinculantes e resolvem códigos de domínio; falha de keyword não escolhe
automaticamente um código RFC 7807.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ampai.dev/schemas/cab-bt-parallel-selection-exp-1.json",
  "title": "CAB-BT-PARALLEL-SELECTION-EXP-1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "contractVersion",
    "analysisMode",
    "objective",
    "totalLoadCurrent_A",
    "lineVoltage_V",
    "powerFactor",
    "maximumVoltageDrop_percent",
    "maxParallelCount",
    "nCircuits",
    "arrangement",
    "catalog",
    "grouping",
    "guidedHypothesis",
    "advancedBranchesByCombination",
    "fault",
    "pruning",
    "providedCombination"
  ],
  "properties": {
    "contractVersion": { "const": "CAB-BT-PARALLEL-SELECTION-EXP-1" },
    "analysisMode": {
      "enum": ["MODO_GUIADO_PRELIMINAR", "MODO_AVANCADO"]
    },
    "objective": {
      "enum": ["NONE", "MIN_PARALLEL_COUNT", "MIN_TOTAL_COPPER", "MAX_MINIMUM_MARGIN"]
    },
    "totalLoadCurrent_A": { "type": "number", "exclusiveMinimum": 0 },
    "lineVoltage_V": { "type": "number", "exclusiveMinimum": 0 },
    "powerFactor": { "$ref": "#/$defs/powerFactor" },
    "maximumVoltageDrop_percent": { "type": "number", "exclusiveMinimum": 0 },
    "maxParallelCount": { "type": "integer", "minimum": 1 },
    "nCircuits": { "type": "integer", "minimum": 1 },
    "arrangement": { "type": "string", "minLength": 1 },
    "catalog": { "$ref": "#/$defs/catalog" },
    "grouping": { "type": "object" },
    "guidedHypothesis": { "type": ["object", "null"] },
    "advancedBranchesByCombination": { "type": "array" },
    "fault": { "type": "object" },
    "pruning": { "$ref": "#/$defs/pruning" },
    "providedCombination": {
      "oneOf": [
        { "type": "null" },
        {
          "type": "object",
          "additionalProperties": false,
          "required": ["section_mm2", "nParallel"],
          "properties": {
            "section_mm2": { "type": "number", "exclusiveMinimum": 0 },
            "nParallel": { "type": "integer", "minimum": 1 }
          }
        }
      ]
    }
  },
  "$defs": {
    "powerFactor": {
      "type": "object",
      "additionalProperties": false,
      "required": ["value", "inputClass", "confirmed", "provenance"],
      "properties": {
        "value": { "type": "number", "minimum": 0, "maximum": 1 },
        "inputClass": {
          "enum": ["INFORMADA_PELO_USUARIO", "SUGERIDA_COM_CONFIRMACAO"]
        },
        "confirmed": { "type": "boolean" },
        "provenance": { "const": "ASSUMPTION_ONLY" }
      }
    },
    "catalog": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "mode",
        "confirmed",
        "source",
        "sourceVersion",
        "provenance",
        "impedanceBasis",
        "candidates"
      ],
      "properties": {
        "mode": {
          "enum": [
            "CATALOGO_FORNECIDO_PELO_USUARIO",
            "CATALOGO_SECUNDARIO_IDENTIFICADO",
            "CATALOGO_LAB_ASSUMPTION_ONLY"
          ]
        },
        "confirmed": { "type": "boolean" },
        "source": { "type": "string", "minLength": 1 },
        "sourceVersion": { "type": "string", "minLength": 1 },
        "provenance": { "const": "ASSUMPTION_ONLY" },
        "impedanceBasis": {
          "type": "object",
          "additionalProperties": false,
          "required": ["length_m", "description", "provenance"],
          "properties": {
            "length_m": { "type": "number", "exclusiveMinimum": 0 },
            "description": { "type": "string", "minLength": 1 },
            "provenance": { "const": "ASSUMPTION_ONLY" }
          }
        },
        "candidates": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/$defs/catalogCandidate" }
        }
      }
    },
    "catalogCandidate": {
      "type": "object",
      "properties": {
        "section_mm2": { "type": "number", "exclusiveMinimum": 0 },
        "tabulatedAmpacity_A": { "type": "number", "exclusiveMinimum": 0 },
        "material": { "type": "string", "minLength": 1 },
        "insulation": { "type": "string", "minLength": 1 },
        "installationMethod": { "type": "string", "minLength": 1 },
        "referenceTemperature_C": { "type": "number" },
        "units": { "type": "string", "minLength": 1 },
        "source": { "type": "string", "minLength": 1 },
        "sourceVersion": { "type": "string", "minLength": 1 },
        "provenance": { "const": "ASSUMPTION_ONLY" },
        "impedance_ohm": {
          "type": "object",
          "properties": { "re": { "type": "number" }, "im": { "type": "number" } }
        },
        "resistance_ohm": { "type": "number" },
        "reactance_ohm": { "type": "number" }
      }
    },
    "pruning": {
      "type": "object",
      "additionalProperties": false,
      "required": ["maximumSection_mm2", "confirmed", "provenance"],
      "properties": {
        "maximumSection_mm2": { "type": ["number", "null"], "exclusiveMinimum": 0 },
        "confirmed": { "type": "boolean" },
        "provenance": { "type": ["string", "null"] }
      }
    }
  }
}
```

Deliberadamente, `catalogCandidate` não usa `required`, `oneOf` nem `additionalProperties:false` como fonte
isolada de classificação: o validador de domínio precisa acumular `missingFields[]`, decidir conflito por
presença antes de tipo/completude e emitir os códigos específicos da §11. Da mesma forma, finitude é
verificada em runtime porque JSON não representa `NaN` ou `Infinity`.

| Path | Tipo/domínio | Regra |
| --- | --- | --- |
| `contractVersion` | string | valor exato do contrato |
| `analysisMode` | enum | `MODO_GUIADO_PRELIMINAR` ou `MODO_AVANCADO` |
| `objective` | enum | `NONE`, `MIN_PARALLEL_COUNT`, `MIN_TOTAL_COPPER`, `MAX_MINIMUM_MARGIN` |
| `totalLoadCurrent_A` | number finito `>0` | corrente de projeto informada |
| `lineVoltage_V` | number finito `>0` | tensão linha-linha usada somente em L1 |
| `powerFactor.value` | number finito `[0,1]` | repassado a L0 |
| `powerFactor.inputClass` | enum | `INFORMADA_PELO_USUARIO` ou `SUGERIDA_COM_CONFIRMACAO` |
| `powerFactor.confirmed` | boolean | obrigatório `true` quando sugerido |
| `powerFactor.provenance` | string | `ASSUMPTION_ONLY` no perfil atual |
| `maximumVoltageDrop_percent` | number finito `>0` | limite do usuário; nunca chamado de IEC |
| `maxParallelCount` | integer `>=1` | limite preliminar informado pelo usuário |
| `nCircuits` | integer `>=1` | independente de `maxParallelCount`/`nParallel` |
| `arrangement` | string não vazia | identificador do arranjo, sem derivar `k_g` |
| `fault.*` | contrato EXP-1 | mesmos domínios e omissões condicionais do L0 |
| `providedCombination` | objeto ou `null` | se presente, seção do catálogo e inteiro `nParallel>=1` |

`deltaFault` e `provenance` dentro de `fault.imbalance` existem somente em
`EXPLICIT_ASSUMPTION`. Em `CONSERVATIVE_SINGLE_BRANCH` e `BLOCK`, essas propriedades devem ser
fisicamente omitidas, conforme o contrato L0.

`providedCombination` é validada em duas fases. Tipo, propriedades, finitude e domínio básico são
validados junto aos metadados globais; a pertença da seção ao catálogo retido e de `nParallel` ao universo
formado é validada na etapa 18 do pipeline. Se o valor for `null`, o sucesso preserva `null`. Se a combinação
for válida, o sucesso pode apenas ecoar a análise da combinação, sem elegê-la ou promovê-la. Qualquer seção
ausente do catálogo retido, quantidade inválida ou combinação fora de `U` retorna imediatamente envelope de
falha RFC 7807 com `PROVIDED_COMBINATION_INVALID`; esse código é proibido dentro de `data`, `warnings`,
diagnósticos ou blockers de candidata em um envelope de sucesso.

### 4.4 Catálogo e representação de impedância

Cada item possui exatamente dez campos escalares obrigatórios:

`section_mm2`, `tabulatedAmpacity_A`, `material`, `insulation`, `installationMethod`,
`referenceTemperature_C`, `units`, `source`, `sourceVersion`, `provenance`.

O catálogo v1 é explicitamente **homogêneo**: existe no máximo um item por seção e todos os itens devem ter
os mesmos `material`, `insulation`, `installationMethod`, `referenceTemperature_C` e `units`. Variantes de
mesma seção exigirão uma versão futura do contrato com identificador estável próprio; não são aceitas no v1.

`catalogEntryId` e `candidateId` não são entradas. Para seção finita e única, a camada gera
`catalogEntryId="section-${section_mm2}"` e `candidateId="${nParallel}x${section_mm2}"`, sempre com
representação decimal canônica; esses IDs não dependem da ordem do array. Se a seção estiver ausente,
inválida ou duplicada, o item recebe `catalogEntryId="catalog-entry-${index}"` (índice zero-based observado
antes de qualquer ordenação) e **cada** combinação bloqueada recebe
`candidateId="catalog-entry-${index}-np-${nParallel}"`; assim, nenhum dos valores de `nParallel` desaparece
ou colide. Se uma seção aparecer mais de uma vez, **todos** os itens dessa seção são bloqueados como
`CANDIDATE_STRUCTURE_INVALID/duplicate_section`; não existe regra “primeiro vence”.

Regras escalares:

- `section_mm2` e `tabulatedAmpacity_A`: números finitos `>0`;
- `referenceTemperature_C`: número finito, nominalmente em graus Celsius (`degC`);
- os demais: strings não vazias;
- `provenance`: valor exato `ASSUMPTION_ONLY` no perfil experimental atual;
- seções repetidas são rejeitadas como `CANDIDATE_STRUCTURE_INVALID`/`duplicate_section`.

Além deles, existe **exatamente uma** representação:

1. `impedance_ohm: { re, im }`, ambos números finitos; ou
2. `resistance_ohm` e `reactance_ohm`, ambos números finitos.

Presença é existência da propriedade. A precedência é vinculante:

1. `hasImpedance && (hasResistance || hasReactance)` →
   `CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT`, antes de tipo/completude/finitude;
2. apenas `impedance_ohm` → validar `IMPEDANCE_COMPLEX`;
3. sem `impedance_ohm`, com R ou X → validar `RESISTANCE_REACTANCE_PAIR`;
4. nenhum → `CANDIDATE_INCOMPLETE`, `missingFields=["impedanceRepresentation"]`.

Ausência usa `CANDIDATE_INCOMPLETE`; propriedade presente inválida usa
`CANDIDATE_IMPEDANCE_VALUE_INVALID`. Não há coerção de string numérica, fallback, impedância parcial ou
componente inventado.

Ordem canônica de `missingFields[]`:

```text
section_mm2, tabulatedAmpacity_A, material, insulation, installationMethod,
referenceTemperature_C, units, source, sourceVersion, provenance,
impedanceRepresentation, impedance_ohm.re, impedance_ohm.im,
resistance_ohm, reactance_ohm
```

Ordem canônica de `invalidFields[]`:

```text
impedance_ohm, impedance_ohm.re, impedance_ohm.im, resistance_ohm, reactance_ohm
```

Cada `invalidFields[]` contém `{ path, reason, observedType }`; `reason` é
`NOT_SIMPLE_OBJECT`, `NOT_NUMBER` ou `NON_FINITE`. As coleções acumulam todos os paths aplicáveis, removem
duplicidades e são independentes da ordem das propriedades.

### 4.5 Modos de catálogo

| Modo | Contrato |
| --- | --- |
| `CATALOGO_FORNECIDO_PELO_USUARIO` | avalia itens completos; registra incompletos; se nenhum item completo existir, bloqueia |
| `CATALOGO_SECUNDARIO_IDENTIFICADO` | exige fonte, versão e proveniência; sempre `MATHEMATICAL_ONLY` |
| `CATALOGO_LAB_ASSUMPTION_ONLY` | exige schema completo, `confirmed=true` e proveniência `ASSUMPTION_ONLY` |

No perfil experimental v1, `catalog.confirmed=true` é obrigatório nos três modos. Essa confirmação registra
que o usuário revisou os dados completos e, em especial, qualquer `referenceTemperature_C` sugerida. Todos os
valores continuam editáveis antes da chamada. `confirmed=false` retorna `CATALOG_CONFIRMATION_MISSING`;
confirmação não transforma a fonte em norma nem em RNC-C.

`catalog.impedanceBasis.length_m` deve ser finito e `>0`. A camada não escala impedância por comprimento:
ela apenas registra a base. Qualquer transformação de comprimento precisa chegar já materializada no
catálogo e rastreada em `description`; derivação silenciosa é proibida.

### 4.6 Modos de fator de agrupamento

| Modo | Estrutura vinculante |
| --- | --- |
| `CANDIDATE_SPECIFIC` | `entries[]` por `candidateId`, cada uma com `value`, fonte, versão, método, arranjo, `nParallel`, `nCircuits`, `provenance` |
| `GROUPING_MATRIX` | matriz explícita com fonte/versão/proveniência e entradas por `nParallel`, `nCircuits`, método e arranjo |
| `LAB_CONSTANT_CONFIRMED` | `value`, `confirmed=true`, fonte/versão e `provenance=ASSUMPTION_ONLY` |

Todo valor deve ser finito e `0 < k_g <= 1`. Entrada específica/matriz sem correspondência bloqueia somente
a combinação. Constante laboratorial não confirmada bloqueia o envelope inteiro. Nenhum modo presume mapa
`nParallel → nCircuits`.

### 4.7 Modos de geometria

#### `MODO_GUIADO_PRELIMINAR`

- `guidedHypothesis.displayedBeforeCalculation=true`;
- `guidedHypothesis.confirmed=true`;
- `guidedHypothesis.provenance="ASSUMPTION_ONLY"`;
- `advancedBranchesByCombination=[]`;
- para cada combinação, repete-se a impedância normalizada do item do catálogo em `nParallel` ramos;
- o L0 deve produzir `deltaLoad=1`; a camada apenas observa e verifica esse valor;
- o DTO L0 usa `geometry.status="NOT_PROVIDED"` e preserva `ENGINEERING_ADEQUACY_BLOCKED`.

Ausência de apresentação/confirmacão retorna `GUIDED_HYPOTHESIS_UNCONFIRMED` antes de formar o universo.

#### `MODO_AVANCADO`

- `guidedHypothesis` deve ser `null`;
- `advancedBranchesByCombination` contém uma entrada para cada combinação que será avaliada;
- cada entrada possui `candidateId`, `geometryDescription` não vazia e `branches[]` com exatamente
  `nParallel` itens no schema L0 (`id`, `impedance_ohm`, `provenance=ASSUMPTION_ONLY`);
- o DTO L0 usa `geometry.status="DESCRIBED"` e a descrição fornecida;
- a impedância do item de catálogo continua validada/rastreada, mas **não** substitui nem completa os ramos
  avançados; `branches[]` é a única fonte de `Z_i` para L0 nesse modo.

Os caminhos nominais são fechados:

| Natureza | Caminho contratual | `params` exatos |
| --- | --- | --- |
| mapa global não-array | falha de topo RFC 7807: `error` e `blockers[10]` | `{ reason: "map_not_array" }` |
| combinação ausente no mapa | `data.evaluatedCandidates[i].blockers[j]` | `{ candidateId, reason: "combination_missing" }` |
| descrição ausente/vazia | `data.evaluatedCandidates[i].blockers[j]` | `{ candidateId, reason: "description_missing" }` |
| quantidade de ramos incompatível | `data.evaluatedCandidates[i].blockers[j]` | `{ candidateId, reason: "branch_count_mismatch", expected, observed }` |
| ID de ramo duplicado | `data.evaluatedCandidates[i].blockers[j]` | `{ candidateId, reason: "branch_id_duplicate", observed }` |
| impedância de ramo inválida | `data.evaluatedCandidates[i].blockers[j]` | `{ candidateId, reason: "branch_impedance_invalid", observed }` |
| proveniência de ramo inválida | `data.evaluatedCandidates[i].blockers[j]` | `{ candidateId, reason: "branch_provenance_invalid", observed }` |

Cada blocker de combinação é exatamente
`{ code:"ADVANCED_BRANCHES_INVALID", params:<tabela>, severity:"blocker" }`, sem propriedade extra. Ele
bloqueia somente a combinação correspondente e permanece em `rejectedCandidates` enquanto ao menos uma
combinação for avaliável. O caso global `map_not_array` não forma universo e retorna imediatamente falha de
topo com `data=null`, dez guardrails e o blocker específico na posição 11.

Se todas as combinações forem bloqueadas, o envelope de topo passa a
`NO_EVALUABLE_COMBINATION`. Seus params exatos são
`{ evaluatedCount, blockersByCandidate }`; `blockersByCandidate[]` preserva cada `candidateId` e seu array de
blockers exatos, inclusive `ADVANCED_BRANCHES_INVALID`, sem converter, ocultar ou promover esse código ao
erro de topo. Para falhas de ramos avançados antes de qualquer chamada L0, `evaluatedCount=0`.

Em `MODO_AVANCADO` válido, `ADVANCED_BRANCHES_INVALID` deve estar ausente de todo o envelope, inclusive
`universe`, candidatos, blockers, warnings e diagnósticos. O contrato atual não define `enforcedRuleCode`
nem reutiliza código de erro como telemetria positiva.

### 4.8 Poda e universo

Sem poda, o universo é:

```text
U = todos os itens do catálogo de entrada × {1, 2, …, maxParallelCount}
```

`pruning.maximumSection_mm2`, quando não nulo, só é aplicado se `confirmed=true` e
`provenance=ASSUMPTION_ONLY`. A poda ocorre antes de formar `U` e cada item removido é registrado em
`universe.prunedCatalogEntries`. Poda não confirmada retorna `SUGGESTION_UNCONFIRMED`.

Itens incompletos que permanecerem no catálogo participam nominalmente do universo e geram combinações
`BLOCKED`; assim, nenhuma entrada desaparece silenciosamente. Se não existir item completo, retorna
`CATALOG_NO_EVALUABLE_CANDIDATE`.

## 5. Pipeline determinístico

Ordem obrigatória e observável:

1. validar raiz como objeto simples;
2. rejeitar propriedade desconhecida em qualquer escopo conhecido;
3. validar versão e containers estruturais;
4. validar metadados globais e confirmações;
5. validar modo/rastreabilidade do catálogo;
6. validar todos os itens do catálogo, acumulando erros por item;
7. aplicar poda confirmada e registrar removidos;
8. verificar se existe item completo;
9. formar o produto cartesiano completo e IDs `${nParallel}x${section_mm2}`;
10. resolver `k_g` por combinação;
11. resolver hipótese guiada ou ramos avançados;
12. montar o DTO L0 sem propriedades extras;
13. chamar L0 exatamente uma vez para a combinação avaliável;
14. propagar erro/blockers L0 ou calcular as três margens L1;
15. particionar e reconciliar o universo;
16. computar a fronteira somente sobre válidas;
17. ordenar todas as válidas pelo objetivo;
18. resolver `providedCombination`, sem promovê-la; valor inválido encerra em falha RFC 7807;
19. validar finitude de todo resultado numérico;
20. emitir Result Pattern imutável.

Nenhuma exceção de domínio pode escapar. Exceção inesperada de programação não deve ser convertida em
sucesso; o teste a classifica como falha.

## 6. Mapeamento exato para L0

Para cada combinação avaliável, o DTO de `CAB-BT-PARALLEL-EXP-1` é:

| Path L0 | Origem L1–L3 |
| --- | --- |
| `contractVersion` | literal `CAB-BT-PARALLEL-EXP-1` |
| `totalLoadCurrent_A` | `input.totalLoadCurrent_A` |
| `powerFactor` | `input.powerFactor.value` |
| `nParallel` | quantidade da combinação |
| `nCircuits` | `input.nCircuits`, nunca inferido |
| `geometry` | regra do modo §4.7 |
| `branches` | repetição confirmada no guiado ou ramos explícitos no avançado |
| `capacityProxy.groupingFactor` | `k_g` resolvido; proveniência experimental preservada |
| `capacityProxy.tabulatedAmpacityPerConductor_A` | item do catálogo |
| `fault` | cópia estrutural do contrato L0, sem propriedades extras |

O wrapper deve clonar os valores necessários; não entrega referências mutáveis ao L0 nem altera a entrada.
`referenceTemperature_C` não possui path no L0: permanece metadado L1–L3, é ecoado sem conversão no
candidato/modelo de apresentação e sempre usa a unidade nominal `degC`/símbolo visual `°C`.

## 7. Avaliação L1 e métricas

Com sucesso L0:

```text
Iadm = l0.data.capacityProxy.totalAdmissibleCurrentProxy_A
mAmp = Iadm / totalLoadCurrent_A - 1

dUPercent = l0.data.voltageDrop.threePhase_V / lineVoltage_V * 100
mVoltageDrop = (maximumVoltageDrop_percent - dUPercent) / maximumVoltageDrop_percent

Smin = l0.data.faultAdiabatic.minimumSectionContinuous_mm2
mShortCircuit = Smin === 0 ? +Infinity : section_mm2 / Smin - 1
```

Critério atende quando a margem é `>=0`. `minimumMargin` é o menor valor finito das três margens; quando
`Smin=0`, a margem de curto é representada no envelope como `null` com
`shortCircuit.unboundedPositiveMargin=true`, para manter JSON válido, e não pode ser o dominante.

`dominantCriteria[]` contém todos os critérios empatados pela tolerância computacional, na ordem canônica:
`AMPACIDADE`, `QUEDA`, `CURTO`. `failedCriteria[]` usa a mesma ordem.

Um candidato válido atende os três. Combinação com erro L0 ou de preparação tem `status="BLOCKED"` e nenhum
campo numérico L1 utilizável. Combinação com cálculo concluído e algum critério negativo tem
`status="REJECTED"`. As demais têm `status="VALID"`.

## 8. Fronteira e objetivos

Métricas da dominância:

- minimizar `nParallel` — comparação inteira exata;
- minimizar `totalCopper_mm2 = nParallel * section_mm2` — comparação exata;
- maximizar `minimumMargin` — comparação com tolerância simétrica.

```text
approximatelyEqual(a,b) = abs(a-b) <= 0.005 * max(abs(a), abs(b), 1e-12)
```

Valores aproximadamente iguais não constituem melhoria estrita. A domina B somente se não for pior nas
três métricas e for estritamente melhor, além da tolerância, em ao menos uma.

Comparadores totais:

| Objetivo | Cadeia |
| --- | --- |
| `NONE` | `nParallel` asc, `section_mm2` asc, `candidateId` asc |
| `MIN_PARALLEL_COUNT` | `nParallel` asc, `minimumMargin` desc, `totalCopper_mm2` asc, seção asc, ID asc |
| `MIN_TOTAL_COPPER` | cobre asc, margem desc, `nParallel` asc, seção asc, ID asc |
| `MAX_MINIMUM_MARGIN` | margem desc, cobre asc, `nParallel` asc, seção asc, ID asc |

`NONE` retorna `NO_CANDIDATE_ELECTED` e `PRESENTATION_ORDER_ONLY`. Nos demais, o primeiro elemento é apenas
`firstInPresentationOrder`; em todos os objetivos:

```text
installableSelection = null
discreteSelectionBlocked = true
installationAuthorized = false
productionAllowed = false
```

`firstInPresentationOrder` contém a primeira candidata válida também em `NONE` (2×185 no fixture-base),
mas nunca é uma eleição. Ele é `null` somente quando nenhuma candidata atende. Quando ao menos uma
combinação foi calculada e todas foram reprovadas por critério, o envelope continua `ok=true`, retorna todas
as rejeitadas e inclui `NO_VALID_ALTERNATIVE`; isso é diferente de `NO_EVALUABLE_COMBINATION`, usado quando
todas bloquearam antes de uma avaliação L1 completa.

### 8.1 Ordenação canônica dos arrays

- o catálogo validado é normalizado por `section_mm2` ascendente; empate de seção é erro, não desempate;
- `evaluatedCandidates`, `candidateAlternatives`, `rejectedCandidates` e
  `nonDominatedAlternatives` usam `nParallel` ascendente, seção ascendente e `candidateId` ascendente;
- itens sem seção válida são identificados pelo índice original e vêm após itens numericamente ordenáveis;
- somente `presentationOrder` aplica o comparador do objetivo;
- `blockers` é deduplicado por `code + params` canônico e ordenado B-01…B-06, guardrails permanentes e
  depois códigos lexicográficos;
- `assumptions` é deduplicado por `id + field + candidateId` e ordenado por esses campos;
- a ordem de entrada de propriedades ou itens equivalentes não pode mudar o resultado semântico.

## 9. Envelope de sucesso

JSON Schema estrutural resumido do sucesso (os schemas específicos dos candidatos são vinculados pela
§9.1):

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "ok", "classification", "data", "assumptions", "blockers", "warnings",
    "sourceStatus", "productionAllowed", "displayNotice", "error"
  ],
  "properties": {
    "ok": { "const": true },
    "classification": { "const": "MATHEMATICAL_ONLY" },
    "data": {
      "type": "object",
      "required": [
        "contractVersion", "analysisMode", "objective", "universe",
        "evaluatedCandidates", "candidateAlternatives", "rejectedCandidates",
        "nonDominatedAlternatives", "presentationOrder", "firstInPresentationOrder",
        "objectiveDisposition", "providedCombination", "installableSelection",
        "discreteSelectionBlocked", "installationAuthorized", "presentationModel"
      ],
      "properties": {
        "contractVersion": { "const": "CAB-BT-PARALLEL-SELECTION-EXP-1" },
        "analysisMode": { "type": "string" },
        "objective": { "type": "string" },
        "universe": { "type": "object" },
        "evaluatedCandidates": { "type": "array" },
        "candidateAlternatives": { "type": "array" },
        "rejectedCandidates": { "type": "array" },
        "nonDominatedAlternatives": { "type": "array" },
        "presentationOrder": { "type": "array" },
        "firstInPresentationOrder": { "type": ["object", "null"] },
        "objectiveDisposition": { "type": "string" },
        "providedCombination": { "type": ["object", "null"] },
        "installableSelection": { "type": "null" },
        "discreteSelectionBlocked": { "const": true },
        "installationAuthorized": { "const": false },
        "presentationModel": { "type": "object" }
      }
    },
    "assumptions": { "type": "array" },
    "blockers": { "type": "array", "minItems": 10 },
    "warnings": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "code", "candidateId", "continuousProxy", "continuousProxyDisplay",
          "discreteRequired", "maxParallelCount", "note", "normativeThreshold"
        ],
        "properties": {
          "code": { "const": "EXCESSIVE_COUNT" },
          "candidateId": { "type": "string", "minLength": 1 },
          "continuousProxy": { "type": "number" },
          "continuousProxyDisplay": { "type": "number" },
          "discreteRequired": { "type": "integer", "minimum": 1 },
          "maxParallelCount": { "type": "integer", "minimum": 1 },
          "note": { "const": "evaluate_busway_qualitatively" },
          "normativeThreshold": { "type": "null" }
        }
      }
    },
    "sourceStatus": {
      "type": "object",
      "required": [
        "classification", "scientificBaselineSha", "l0ScientificBaselineSha",
        "l0IntegrationMainSha", "primarySourceComplete", "iecConformity"
      ],
      "properties": {
        "classification": { "const": "RNC-P_EXPERIMENTAL_NON_CANONICAL" },
        "scientificBaselineSha": {
          "const": "2b61627d8640fce91eb229ca522ae33a143671df"
        },
        "l0ScientificBaselineSha": {
          "const": "18627dd02c94265984aa953d35f47c2745cab61d"
        },
        "l0IntegrationMainSha": {
          "const": "83e24131c0cc09813be65a5fa269961b9cc80c5c"
        },
        "primarySourceComplete": { "const": false },
        "iecConformity": { "const": false }
      }
    },
    "productionAllowed": { "const": false },
    "displayNotice": {
      "const": "PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO"
    },
    "error": { "type": "null" }
  }
}
```

Para o fixture-base, os arrays devem ser materializados integralmente e reconciliar `20/11/9/11`; não se
aceita envelope resumido, paginação ou omissão de candidatas no core.

### 9.1 Candidato avaliado

Cada item de `evaluatedCandidates` contém no mínimo:

```text
candidateId, catalogEntryId, catalogEntryIndex, section_mm2, nParallel, totalCopper_mm2,
status: VALID | REJECTED | BLOCKED,
l0CallCount, l0Classification, l0Blockers, l0SourceStatus,
ampacity: { admissibleCurrent_A, requiredCurrent_A, margin, passes },
voltageDrop: { actualPercent, userLimitPercent, margin, passes, normativeLimit: null },
shortCircuit: { minimumSectionContinuous_mm2, providedSection_mm2, margin,
                unboundedPositiveMargin, passes },
minimumMargin, dominantCriteria[], failedCriteria[], assumptions[], blockers[],
productionAllowed: false, installableSelection: null
```

Para `BLOCKED`, campos numéricos derivados são `null`, `l0CallCount` é `0` ou `1` conforme a fase que bloqueou
e existe ao menos um blocker nominal. `candidateAlternatives` contém apenas `VALID`; `rejectedCandidates`
contém `REJECTED` e `BLOCKED`, preservando a reconciliação.

### 9.2 Modelo de apresentação

O core não localiza frases. Cada card contém dados e chaves semânticas:

```text
candidateId, quantityPerPhase, section_mm2,
headlineArgs: { quantityPerPhase, section_mm2 },
catalogMetadata: { material, insulation, installationMethod, referenceTemperature_C,
                   referenceTemperatureUnit: "degC" },
criteria.ampacity / voltageDrop / shortCircuit: { status, values, unit, qualifierKey },
dominantCriteria[], objective, installationAuthorized:false,
assumptionKeys[], blockerCodes[], notice
```

A UI renderiza “2 × 240 mm² por fase”, os três critérios, dominante, hipóteses e bloqueios. Ela não pode
substituir `firstInPresentationOrder` por “recomendado” nem ocultar alternativas válidas.

### 9.3 Warning `EXCESSIVE_COUNT`

`warnings[]` possui schema fechado e, nesta versão, aceita somente `EXCESSIVE_COUNT`. O campo
`continuousProxy` contém o valor integral de precisão de máquina produzido pelo cálculo. O campo
`continuousProxyDisplay` contém exclusivamente `round(continuousProxy, 3)` para apresentação. Todas as
comparações, `discreteRequired`, margens, ordenação e fronteira usam apenas `continuousProxy`; o valor de
apresentação nunca retroalimenta cálculo ou decisão. O RED verifica o valor bruto pela tolerância
computacional já declarada e o valor apresentado por igualdade com o arredondamento a três casas.

## 10. Result Pattern e RFC 7807

O envelope de falha é fechado pelo schema abaixo. Ele contém exatamente dez blockers permanentes e um
blocker específico da falha:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "ok", "classification", "data", "assumptions", "blockers", "warnings",
    "sourceStatus", "productionAllowed", "displayNotice", "error"
  ],
  "properties": {
    "ok": { "const": false },
    "classification": { "const": "BLOCKED" },
    "data": { "type": "null" },
    "assumptions": { "type": "array" },
    "blockers": {
      "type": "array",
      "minItems": 11,
      "maxItems": 11,
      "uniqueItems": true,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["code", "params", "severity"],
        "properties": {
          "code": { "type": "string", "minLength": 1 },
          "params": { "type": "object" },
          "severity": { "const": "blocker" }
        }
      },
      "allOf": [
        { "contains": { "properties": { "code": { "const": "B-01" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "B-02" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "B-03" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "B-04" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "B-05" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "B-06" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "ENGINEERING_ADEQUACY_BLOCKED" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "DISCRETE_SELECTION_BLOCKED" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "IEC_CONFORMITY_BLOCKED" } }, "required": ["code"] } },
        { "contains": { "properties": { "code": { "const": "PRODUCTION_USE_BLOCKED" } }, "required": ["code"] } }
      ]
    },
    "warnings": { "type": "array", "maxItems": 0 },
    "sourceStatus": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "classification", "scientificBaselineSha", "l0ScientificBaselineSha",
        "l0IntegrationMainSha", "primarySourceComplete", "iecConformity"
      ],
      "properties": {
        "classification": { "const": "RNC-P_EXPERIMENTAL_NON_CANONICAL" },
        "scientificBaselineSha": { "const": "2b61627d8640fce91eb229ca522ae33a143671df" },
        "l0ScientificBaselineSha": { "const": "18627dd02c94265984aa953d35f47c2745cab61d" },
        "l0IntegrationMainSha": { "const": "83e24131c0cc09813be65a5fa269961b9cc80c5c" },
        "primarySourceComplete": { "const": false },
        "iecConformity": { "const": false }
      }
    },
    "productionAllowed": { "const": false },
    "displayNotice": {
      "const": "PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO"
    },
    "error": {
      "type": "object",
      "additionalProperties": false,
      "required": ["type", "title", "status", "code", "params", "severity"],
      "properties": {
        "type": { "type": "string", "pattern": "^https://ampai\\.dev/problems/" },
        "title": { "type": "string", "minLength": 1 },
        "status": { "const": 422 },
        "code": { "type": "string", "minLength": 1 },
        "params": { "type": "object" },
        "severity": { "const": "error" }
      }
    }
  },
  "allOf": [
    {
      "if": {
        "properties": {
          "error": {
            "properties": { "code": { "const": "PROVIDED_COMBINATION_INVALID" } },
            "required": ["code"]
          }
        }
      },
      "then": {
        "properties": {
          "error": {
            "properties": {
              "params": {
                "type": "object",
                "additionalProperties": false,
                "required": ["section_mm2", "nParallel"],
                "properties": {
                  "section_mm2": {},
                  "nParallel": {}
                }
              }
            }
          }
        }
      }
    }
  ]
}
```

Exemplo RFC 7807 reconciliado para `GLOBAL_METADATA_MISSING`:

```json
{
  "ok": false,
  "classification": "BLOCKED",
  "data": null,
  "assumptions": [],
  "blockers": [
    { "code": "B-01", "params": {}, "severity": "blocker" },
    { "code": "B-02", "params": {}, "severity": "blocker" },
    { "code": "B-03", "params": {}, "severity": "blocker" },
    { "code": "B-04", "params": {}, "severity": "blocker" },
    { "code": "B-05", "params": {}, "severity": "blocker" },
    { "code": "B-06", "params": {}, "severity": "blocker" },
    { "code": "ENGINEERING_ADEQUACY_BLOCKED", "params": { "reason": "normative_source_incomplete" }, "severity": "blocker" },
    { "code": "DISCRETE_SELECTION_BLOCKED", "params": {}, "severity": "blocker" },
    { "code": "IEC_CONFORMITY_BLOCKED", "params": {}, "severity": "blocker" },
    { "code": "PRODUCTION_USE_BLOCKED", "params": {}, "severity": "blocker" },
    { "code": "GLOBAL_METADATA_MISSING", "params": { "paths": ["$.lineVoltage_V"] }, "severity": "blocker" }
  ],
  "warnings": [],
  "sourceStatus": {
    "classification": "RNC-P_EXPERIMENTAL_NON_CANONICAL",
    "scientificBaselineSha": "2b61627d8640fce91eb229ca522ae33a143671df",
    "l0ScientificBaselineSha": "18627dd02c94265984aa953d35f47c2745cab61d",
    "l0IntegrationMainSha": "83e24131c0cc09813be65a5fa269961b9cc80c5c",
    "primarySourceComplete": false,
    "iecConformity": false
  },
  "productionAllowed": false,
  "displayNotice": "PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO",
  "error": {
    "type": "https://ampai.dev/problems/GLOBAL_METADATA_MISSING",
    "title": "GLOBAL_METADATA_MISSING",
    "status": 422,
    "code": "GLOBAL_METADATA_MISSING",
    "params": { "paths": ["$.lineVoltage_V"] },
    "severity": "error"
  }
}
```

Reconciliação vinculante:

1. posições 1–6: B-01…B-06;
2. posições 7–10: `ENGINEERING_ADEQUACY_BLOCKED`, `DISCRETE_SELECTION_BLOCKED`,
   `IEC_CONFORMITY_BLOCKED`, `PRODUCTION_USE_BLOCKED`;
3. posição 11: blocker específico;
4. `blockers[10].code === error.code`, `blockers[10].params` é profundamente igual a `error.params`,
   `error.title === error.code` e `error.type` termina em `error.code`;
5. se o código específico também for um guardrail permanente, ele continua na posição 11 com os `params`
   específicos da tentativa; o item permanente permanece sem esses params e não há objeto duplicado;
6. todo envelope, inclusive falha estrutural, contém aviso integral, `productionAllowed=false`, fonte não
   canônica e conformidade falsa.
7. `relatedCodes` é proibido em `error`, `params`, blockers, issues, warnings e diagnósticos; um código só
   satisfaz o contrato no caminho nominal definido para ele.

### 10.1 Falha `PROVIDED_COMBINATION_INVALID`

Uma combinação informada com seção ausente do catálogo retido, `nParallel` inválido ou par fora do universo
retorna falha de topo: `ok=false`, `classification="BLOCKED"`, `data=null`, `status=422`, exatamente dez
guardrails permanentes e `blockers[10].code="PROVIDED_COMBINATION_INVALID"`. Os únicos params são, sem
coerção nem propriedades extras:

```json
{
  "section_mm2": "<valor recebido>",
  "nParallel": "<valor recebido>"
}
```

`error.params` e `blockers[10].params` são profundamente iguais. O envelope não contém `relatedCodes` nem
`data.providedCombination.code`. Combinação válida é apenas ecoada/analisada no sucesso, sem erro e sem
promoção; entrada `null` permanece `null`.

## 11. Catálogo determinístico de erros

| Código | Condição | `params` exato |
| --- | --- | --- |
| `INPUT_STRUCTURE_INVALID` | raiz não objeto simples, container de tipo errado, propriedade desconhecida | `{ path, reason }` |
| `CONTRACT_VERSION_UNSUPPORTED` | versão ausente/incorreta | `{ received, allowed }` |
| `GLOBAL_METADATA_MISSING` | campo global conhecido ausente | `{ paths[] }` em ordem canônica |
| `GLOBAL_METADATA_INVALID` | campo global conhecido presente, tipo/domínio inválido | `{ path, reason }` |
| `ANALYSIS_MODE_INVALID` | modo desconhecido | `{ received, allowed[] }` |
| `OBJECTIVE_INVALID` | objetivo desconhecido | `{ received, allowed[] }` |
| `SUGGESTION_UNCONFIRMED` | valor sugerido/poda sem confirmação | `{ path }` |
| `CATALOG_MODE_INVALID` | modo de catálogo desconhecido | `{ received }` |
| `CATALOG_TRACEABILITY_MISSING` | modo secundário sem fonte/versão/proveniência | `{ paths[] }` |
| `CATALOG_CONFIRMATION_MISSING` | catálogo laboratorial sem confirmação | `{ path }` |
| `CATALOG_NO_EVALUABLE_CANDIDATE` | zero item completo após validação/poda | `{ catalogEntryCount, errors[] }` |
| `CANDIDATE_STRUCTURE_INVALID` | item não objeto simples, propriedade desconhecida, catálogo heterogêneo ou seção duplicada | `{ catalogEntryId, catalogEntryIndex, reason, path?, conflictingEntryIds? }` |
| `CANDIDATE_INCOMPLETE` | escalar/componente conhecido ausente | `{ candidateId, missingFields[], mode, provenance }` |
| `CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT` | coexistência por presença | `{ candidateId, presentFields[] }` |
| `CANDIDATE_IMPEDANCE_VALUE_INVALID` | valor presente não numérico/não finito | `{ candidateId, invalidFields[], mode }` |
| `GROUPING_MODE_INVALID` | modo `k_g` desconhecido | `{ received }` |
| `GROUPING_FACTOR_MISSING` | entrada específica/matriz sem correspondência | `{ candidateId, nParallel, nCircuits }` |
| `GROUPING_FACTOR_INVALID` | `k_g` fora de `(0,1]` ou não finito | `{ candidateId, value }` |
| `GROUPING_CONFIRMATION_MISSING` | constante laboratorial não confirmada | `{ path }` |
| `GUIDED_HYPOTHESIS_UNCONFIRMED` | hipótese não exibida/confirmada/proveniente | `{ missing[] }` |
| `ADVANCED_BRANCHES_INVALID` | mapa/descrição/ramos ausentes ou incompatíveis | mapa global: `{ reason:"map_not_array" }`; combinação: schema exato da matriz §4.7 |
| `PROVIDED_COMBINATION_INVALID` | combinação informada fora do catálogo/domínio | `{ section_mm2, nParallel }` |
| `NO_EVALUABLE_COMBINATION` | todas as combinações bloquearam antes/depois de L0 | `{ evaluatedCount, blockersByCandidate[] }` |
| `NUMERIC_RESULT_NON_FINITE` | resultado L1–L3 não finito fora do caso `Smin=0` tratado | `{ stage, field, candidateId? }` |
| `PRODUCTION_USE_BLOCKED` | solicitação produtiva | `{ prohibitedUse }` |
| `IEC_CONFORMITY_BLOCKED` | solicitação de conformidade | `{ sourceStatus }` |

Erros L0 mantêm o código e `params` originais dentro do candidato. A camada não troca
`PARALLEL_Z_ZERO`, `FAULT_IMBALANCE_MISSING`, `GROUPING_FACTOR_MISSING` ou outro código L0 por erro genérico.
Nenhum código aceita `relatedCodes`. `GLOBAL_METADATA_MISSING.params` contém exclusivamente `paths`;
propriedade desconhecida em item usa exclusivamente `CANDIDATE_STRUCTURE_INVALID`; valor ou estrutura de
impedância usa o único código primário determinado pela precedência. Problemas independentes acumuláveis são
objetos separados no array contratual, nunca códigos embutidos em params de outro problema.
`advancedBranchesByCombination` não-array é a exceção específica à regra genérica de container incorreto: a
keyword de tipo nesse path resolve para `ADVANCED_BRANCHES_INVALID/map_not_array`, conforme §4.7, e não para
`INPUT_STRUCTURE_INVALID`.

### 11.1 Precedência de validação

1. estrutura global/propriedade desconhecida;
2. versão;
3. ausência de containers/metadados globais;
4. valor global inválido/confirmação;
5. modo/rastreabilidade do catálogo;
6. por item: conflito de representação **antes** de completude/tipo;
7. por item: escalares/componentes ausentes;
8. por item: valores presentes inválidos;
9. modo/resolução de agrupamento;
10. hipótese guiada/ramos avançados;
11. erro L0;
12. finitude L1–L3.

Validações por item acumulam todos os erros independentes permitidos; falhas globais retornam imediatamente.

## 12. Invariantes de segurança

Em sucesso e falha:

- `productionAllowed === false`;
- `sourceStatus.primarySourceComplete === false`;
- `sourceStatus.iecConformity === false`;
- aviso literal completo;
- B-01…B-06 preservados;
- `ENGINEERING_ADEQUACY_BLOCKED`, `DISCRETE_SELECTION_BLOCKED`, `IEC_CONFORMITY_BLOCKED` e
  `PRODUCTION_USE_BLOCKED` presentes no envelope bem-sucedido;
- `installableSelection === null` e `installationAuthorized === false`;
- nenhuma candidata possui campo `selected`, `recommended`, `finalSizing` ou equivalente;
- `nParallel` nunca é inferido de `nCircuits`, e o inverso também não;
- `deltaFault` nunca é inferido de `deltaLoad`;
- catálogo/objetivo não alteram blockers L0;
- a nota de barramento é qualitativa, com limiar normativo ausente, nunca recomendação automática.

## 13. Contrato do QA RED core

### 13.1 Arquivo, execução e estado

- executor: `@Senior_QA_Security`;
- arquivo exclusivo inicial: `tests/test_cab_bt_parallel_selection_experimental.js`;
- classificação: `experimental`, fora de `qa/test-manifest.json`;
- baseline imutável: commit do SDD ratificado, descendente de `2b61627d…`;
- comando sintático: `node --check tests/test_cab_bt_parallel_selection_experimental.js` → exit `0`;
- comando funcional: `node tests/test_cab_bt_parallel_selection_experimental.js`;
- RED válido: módulo novo ausente, 74 relatórios completos, asserções exercidas, exit `1`;
- não é permitido stub/mock do módulo produtivo.

### 13.2 Protocolo JSON-lines fechado

Cada linha de relatório começa exatamente com:

```text
CAB_BT_PARALLEL_SELECTION_EXP_REPORT {json}
```

Schema mínimo por relatório:

```json
{
  "id": "KG-01",
  "category": "grouping",
  "classification": "FUNCTIONAL_FAILURE",
  "compliant": false,
  "assertionExercised": true,
  "expected": {},
  "observed": {},
  "issues": []
}
```

Um relatório de matriz/outlines contém `observed.cases[]`; todas as linhas da tabela científica ou técnica
devem ser executadas e reconciliadas dentro do relatório. A linha final única é:

```text
CAB_BT_PARALLEL_SELECTION_EXP_SUMMARY {json}
```

Schema mínimo do summary:

```json
{
  "classification": "FUNCTIONAL_FAILURE",
  "reports": 74,
  "expectedReports": 74,
  "scientificReports": 48,
  "technicalReports": 26,
  "compliant": 0,
  "nonCompliant": 74,
  "assertionsExercised": 74,
  "processExitCode": 1
}
```

### 13.2.1 Oráculo contratual exato

Os 74 relatórios contêm exatamente 244 subcasos únicos. Cada subcaso possui fixture determinístico, invoca a
candidata real quando o módulo existe e decide `compliant` somente por caminhos contratuais exatos. Helpers de
busca recursiva, incluindo `recursivelyContains` e `recursivelyContainsAll`, são proibidos em qualquer decisão
de conformidade. Se existirem apenas para diagnóstico, seu resultado não pode influenciar relatório, subcaso
ou summary.

O oráculo exige simultaneamente:

- schema fechado, contagem, ordem e propriedades exatas;
- igualdade profunda de `params` e rejeição de propriedades extras;
- código positivo somente no caminho nominal: erro de topo, `blockers[10]`, blocker/issue de candidata,
  warning ou diagnóstico neutro são categorias distintas e não intercambiáveis;
- ausência integral de códigos de erro em caminhos felizes;
- `PROVIDED_COMBINATION_INVALID` inválido como falha de topo RFC 7807 e combinação válida sem código de erro;
- `ADVANCED_BRANCHES_INVALID` no caminho exato do defeito e ausência integral em `MODO_AVANCADO` válido;
- zero `relatedCodes` em todo envelope;
- `EXCESSIVE_COUNT.continuousProxy` bruto confrontado pela tolerância computacional e
  `continuousProxyDisplay` confrontado separadamente com o arredondamento a três casas.

Relatório que encontra o valor correto em caminho incorreto é não conforme. O caminho `module_missing`
continua produzindo RED completo; o caminho `ready` deve poder produzir PASS ou FUNCTIONAL_FAILURE conforme
o resultado real.

### 13.3 IDs exatos — 48 científicos + 26 técnicos

#### 13.3.1 Conjunto científico — 48

| ID | Contrato |
| --- | --- |
| `KG-01` | `CANDIDATE_SPECIFIC` completo |
| `KG-02` | `GROUPING_MATRIX` sem correspondência |
| `KG-03` | constante laboratorial confirmada |
| `KG-04` | constante laboratorial não confirmada |
| `SCH-01` | matriz dos 10 escalares ausentes; o path de temperatura é `referenceTemperature_C` e a unidade é `degC` |
| `SCH-02` | `IMPEDANCE_COMPLEX` puro válido |
| `SCH-03` | par R+X puro válido |
| `SCH-04` | matriz das cinco representações incompletas |
| `SCH-05` | impedance incompleto sem fallback |
| `SCH-06` | matriz dos sete conflitos por coexistência |
| `SCH-07` | conflito independente da ordem |
| `SCH-08` | matriz de valores inválidos `IMPEDANCE_COMPLEX` |
| `SCH-09` | matriz de valores inválidos R+X |
| `SCH-10` | múltiplos inválidos e ordem canônica |
| `SCH-11` | matriz ausência versus valor inválido |
| `SCH-12` | múltiplos ausentes e `missingFields[]` canônico |
| `SCH-13` | resultado independente da ordem das propriedades |
| `SCH-14` | equivalência das duas representações puras |
| `CAT-01` | catálogo sem candidato avaliável |
| `STR-01` | metadados globais ausentes |
| `CAT-02` | matriz dos três modos de catálogo |
| `GRD-01` | nenhuma derivação silenciosa |
| `CAL-01` | várias candidatas e dominante ampacidade |
| `CAL-02` | alternativa candidata única |
| `CAL-03` | matriz dos três critérios dominantes |
| `CAL-04` | quantidade excessiva com `continuousProxy` bruto e `continuousProxyDisplay` a três casas |
| `GRD-02` | nota qualitativa de barramento |
| `UNI-01` | produto cartesiano completo |
| `UNI-02` | reconciliação `20/11/9/11` |
| `UNI-03` | inventário matricial das 11 válidas |
| `UNI-04` | inventário matricial das 9 rejeitadas |
| `UNI-05` | candidatas antes omitidas presentes |
| `FRN-01` | fronteira com 11 não dominadas |
| `FRN-02` | matriz do comparador dentro/fora da tolerância |
| `OBJ-01` | matriz dos quatro objetivos |
| `OBJ-02` | empate de `MIN_PARALLEL_COUNT` |
| `OBJ-03` | `MIN_TOTAL_COPPER` inicia em 3×120 |
| `OBJ-04` | `MAX_MINIMUM_MARGIN` inicia em 4×240 |
| `OBJ-05` | `NONE` não elege e inicia em 2×185 |
| `OBJ-06` | objetivo nunca cria seleção instalável |
| `GRD-03` | proxy contínuo não instalável |
| `CAL-05` | `providedCombination` sem promoção |
| `HYP-01` | hipótese guiada confirmada e `deltaLoad=1` produzido por L0 |
| `HYP-02` | hipótese guiada não confirmada |
| `GRD-04` | matriz de cinco blockers reais L0 propagados |
| `CAL-06` | `deltaFault` explícito versus cenário conservador |
| `OUT-01` | modelo humano da alternativa candidata |
| `GRD-05` | tentativa de uso produtivo/conformidade recusada |

#### 13.3.2 Conjunto técnico do SDD — 26

Cada matriz deve registrar seus subcasos em `observed.cases[]`, com `caseId`, `assertionExercised`,
`compliant`, `expected` e `observed`. Um caso ausente torna o relatório inválido e a execução
`CONFIG_ERROR`.

| ID | Matriz/caso técnico obrigatório |
| --- | --- |
| `TECH-01` | raiz `undefined`, `null`, array, string, number e boolean → `INPUT_STRUCTURE_INVALID` |
| `TECH-02` | propriedades desconhecidas na raiz, catálogo, item, grouping, fault e modo avançado, com um único código no caminho exato |
| `TECH-03` | versão ausente e incorreta → `CONTRACT_VERSION_UNSUPPORTED` |
| `TECH-04` | metadados globais presentes com tipo, não finitude e domínio inválidos |
| `TECH-05` | `analysisMode` inválido → `ANALYSIS_MODE_INVALID` |
| `TECH-06` | `objective` inválido → `OBJECTIVE_INVALID` |
| `TECH-07` | modo de catálogo inválido → `CATALOG_MODE_INVALID` |
| `TECH-08` | modo de agrupamento inválido → `GROUPING_MODE_INVALID` |
| `TECH-09` | fonte, versão ou proveniência ausente no catálogo secundário |
| `TECH-10` | confirmação ausente nos três modos de catálogo e temperatura sugerida não confirmada |
| `TECH-11` | poda confirmada ocorre antes de U e registra nominalmente todos os itens removidos |
| `TECH-12` | poda não confirmada → `SUGGESTION_UNCONFIRMED`, sem formar U |
| `TECH-13` | item não objeto simples, propriedade desconhecida e estrutura inválida, sem código relacionado oculto |
| `TECH-14` | catálogo homogêneo, seção duplicada bloqueia todas as duplicatas, IDs por `nParallel` são únicos e `referenceTemperature_C`/`degC` permanecem explícitos |
| `TECH-15` | `k_g` zero, negativo, maior que 1, `NaN` e infinito → `GROUPING_FACTOR_INVALID` |
| `TECH-16` | `MODO_AVANCADO` feliz usa apenas ramos explícitos/geometria descrita e contém zero `ADVANCED_BRANCHES_INVALID` |
| `TECH-17` | matriz de `ADVANCED_BRANCHES_INVALID`: mapa não-array como falha de topo; demais defeitos como blocker exato da combinação; colapso integral em `NO_EVALUABLE_COMBINATION` |
| `TECH-18` | `providedCombination` com seção ausente, quantidade inválida ou fora de U retorna falha de topo RFC 7807 com params exatos |
| `TECH-19` | distinção: todas calculadas/reprovadas → `NO_VALID_ALTERNATIVE`; todas bloqueadas → `NO_EVALUABLE_COMBINATION` |
| `TECH-20` | L0 chamado exatamente uma vez por combinação avaliável e zero vezes quando o preparo bloqueia |
| `TECH-21` | pureza, determinismo, entrada e envelope L0 não mutados, zero efeitos colaterais |
| `TECH-22` | ordem de propriedades e permutação de itens completos produzem arrays canônicos equivalentes |
| `TECH-23` | `NaN`/infinito produzido em L1–L3 → `NUMERIC_RESULT_NON_FINITE`, sem número parcial |
| `TECH-24` | `Smin=0`: margem de curto `null`, flag positiva, curto não dominante e JSON finito |
| `TECH-25` | schema completo de sucesso, warning bruto/display fechado, reconciliação dos arrays, dez guardrails e fonte L0 preservada |
| `TECH-26` | schema fechado de falha, 10 guardrails + blocker específico, ordem, igualdade blocker/error e zero `relatedCodes` |

### 13.4 Exit codes

| Exit | Classificação | Condição |
| --- | --- | --- |
| `0` | `PASS` | 74 IDs únicos, todos conformes, todas as asserções exercidas e summary reconciliado |
| `1` | `FUNCTIONAL_FAILURE` | 74 relatórios completos, asserções exercidas e ao menos um não conforme |
| `2` | `INFRA_BLOCKED` | runtime/dependência indisponível antes das asserções |
| `3` | `CONFIG_ERROR` | relatório ausente/extra/duplicado/inválido, matriz incompleta, summary inconsistente ou `assertionExercised=false` |

Relatório incompleto nunca é RED/GREEN funcional.

## 14. Fases GREEN e QA independente

### 14.1 Backend GREEN

Executor: `@Senior_Backend_Dev`, após RED válido. Allowlist inicial:

```text
js/core_cabos_bt_parallel_selection_experimental.js
```

Proibido alterar L0, UI, teste RED, manifesto, workflow, packages ou documentação científica. O Backend não
emite veredito e devolve ao CTO.

### 14.2 QA independente do core

Comandos mínimos, em processos independentes:

```text
node --check js/core_cabos_bt_parallel_selection_experimental.js
node --check tests/test_cab_bt_parallel_selection_experimental.js
node tests/test_cab_bt_parallel_selection_experimental.js
node tests/test_cab_bt_parallel_selection_experimental.js
node tests/test_cab_bt_parallel_selection_experimental.js
node tests/test_cab_bt_parallel_experimental.js
npm run test:regression
git diff --check <baseline>...HEAD
```

Esperado: três processos novos com 74/74 PASS (48 científicos + 26 técnicos), L0 com 40/40 PASS e regressão
stable completa com exit `0`.
O teste novo continua `experimental` e não entra no manifesto nesta cadeia.

### 14.3 UI somente depois do GREEN do core

Allowlist de Frontend:

```text
index.html
js/ui_render.js
```

A UI deve priorizar entradas que o usuário conhece e colocar hipóteses/catalogação em seção explícita de
laboratório, editável e confirmável. Deve mostrar todas as alternativas candidatas, especialmente frases
como `2 × 240 mm² por fase` e `3 × 150 mm² por fase`, com três critérios e dominante. Nenhuma variável é
inventada; falta de catálogo/hipótese bloqueia.

### 14.4 RED visual futuro — 15 relatórios

Arquivo: `tests/test_cab_bt_parallel_selection_ui_experimental.js`, classificação `experimental`.
Prefixos `CAB_BT_PARALLEL_SELECTION_UI_EXP_REPORT` e
`CAB_BT_PARALLEL_SELECTION_UI_EXP_SUMMARY`.

Schema mínimo de cada relatório:

```json
{
  "id": "UI-01",
  "category": "visual_experimental",
  "classification": "PASS",
  "compliant": true,
  "assertionExercised": true,
  "expected": {},
  "observed": {},
  "telemetry": {
    "pageLoaded": true,
    "consoleErrors": [],
    "pageErrors": [],
    "invalidTokens": []
  },
  "issues": []
}
```

IDs exatos e únicos:

| ID | Contrato visual |
| --- | --- |
| `UI-01` | seção experimental isolada |
| `UI-02` | aviso permanente |
| `UI-03` | entradas práticas prioritárias |
| `UI-04` | hipóteses exibidas/confirmáveis, incluindo `referenceTemperature_C` em `°C` |
| `UI-05` | alternativa “n × S por fase” |
| `UI-06` | três critérios |
| `UI-07` | dominante |
| `UI-08` | objetivo configurável |
| `UI-09` | todas as alternativas e fronteira |
| `UI-10` | instalação não autorizada |
| `UI-11` | vocabulário proibido ausente |
| `UI-12` | PT/EN/ES |
| `UI-13` | acessibilidade e foco |
| `UI-14` | 375 px, temas claro/escuro e ausência de overflow |
| `UI-15` | árvore imprimível |

Summary único e reconciliado:

```json
{
  "classification": "PASS",
  "reports": 15,
  "expectedReports": 15,
  "compliant": 15,
  "nonCompliant": 0,
  "assertionsExercised": 15,
  "processExitCode": 0
}
```

| Exit | Classificação | Contrato processável |
| --- | --- | --- |
| `0` | `PASS` | 15 IDs exatos/únicos, 15 conformes, `assertionExercised=true`, summary reconciliado |
| `1` | `FUNCTIONAL_FAILURE` | 15 relatórios completos, todas as asserções exercidas e ao menos um não conforme |
| `2` | `INFRA_BLOCKED` | preflight Chromium falha antes da primeira asserção; ainda emite 15 relatórios `INFRA_BLOCKED`, todos com `assertionExercised=false`, e summary reconciliado |
| `3` | `CONFIG_ERROR` | relatório ausente, extra, duplicado, schema inválido, execução parcial, summary ausente/inconsistente ou asserção não exercida fora do preflight bloqueado |

Contrato do artifact remoto:

- workflow: `qa-visual.yml`, `workflow_dispatch`, attempt 1, SHA imutável e input exato do arquivo;
- nome: `qa-visual-evidence`;
- conteúdo obrigatório: um `qa-visual-evidence.txt` UTF-8 com metadados `runId`, `event`, `attempt`,
  `headSha`, `testFile`, versão do Chromium, exit do preflight, stdout integral, stderr integral e exit do
  processo;
- o stdout deve conter exatamente 15 linhas de relatório e uma linha de summary;
- o QA registra ID do artifact, tamanho, digest SHA-256 do GitHub e SHA-256 recalculado do ZIP bruto;
- artifact ausente, vazio, ilegível ou divergente impede GREEN remoto e classifica a evidência como
  `CONFIG_ERROR`;
- nenhum retry, mudança de timeout/assertions ou rerun sem autorização distinta.

## 15. Regressão, CI e PR

- Toda PR executável preserva `npm run test:regression` e o shadow Gate vigente.
- O novo teste permanece fora de `qa/test-manifest.json`; eventual promoção é mudança separada após parecer QA.
- Nenhum workflow, schema de Gate ou package é alterado nesta cadeia. Se necessário, a demanda vai ao
  `@Engenheiro_Plataforma_CI` em O.S. própria, sem alterar testes do QA.
- CodeRabbit é consultivo; comentário acionável retorna ao CTO e não substitui QA/artifact.
- `INFRA_BLOCKED` e `CONFIG_ERROR` bloqueiam avanço, mas não são falha funcional.
- Merge é exclusivamente humano pelo CEO.

## 16. README futuro — não aplicar nesta O.S.

Bloco preparado para futura integração, somente após aceite do pacote executável:

```markdown
### Laboratório experimental — alternativas de cabos BT em paralelo

O AmpAI pode enumerar e comparar alternativas matemáticas preliminares, como
`2 × 240 mm² por fase`, utilizando catálogo e hipóteses explicitamente confirmados.

> PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.

O recurso não declara conformidade IEC, não seleciona solução instalável e permanece
`productionAllowed=false` enquanto a fonte normativa integral e os bloqueios B-01…B-06 estiverem abertos.
```

## 17. Registro Mestre — atualização futura

Entrada prevista:

| Campo | Valor |
| --- | --- |
| ID | `CAB-BT-PARALLEL-002` |
| Classe | `CHG-3 científica experimental` |
| Domínio | enumeração/comparação preliminar de cabos BT em paralelo |
| Ciência | `2b61627d8640fce91eb229ca522ae33a143671df` |
| Estado atual | `SDD_EXPERIMENTAL_RATIFICADO_PARA_CORRECAO_DO_RED` |
| Estado produtivo | `BLOQUEADO`, `productionAllowed=false` |
| Teste novo | experimental, 74 relatórios core (48 científicos + 26 técnicos); 15 visuais em fase posterior |
| TESTE DO CEO | `SIM`, depois de GREEN independente e remoto da UI |
| PR/SHA/Gate | pendentes |
| Marco remoto | pendente |
| Marco operacional | pendente |
| Encerramento | merge validado + pós-merge main/Drive/hashes/worktrees |

A atualização do Registro Mestre não pertence à primeira materialização deste SDD e exige autorização de
escopo própria ou integração no mesmo pacote futuro expressamente autorizada.

## 18. Roteamento e autoridades

| Fase | Executor | Autoridade | Retorno |
| --- | --- | --- | --- |
| Auditoria deste SDD | Conselho de Arquitetura e Governança | Conselho | CTO |
| RED core experimental | Senior QA-Security | QA | CTO |
| GREEN core | Senior Backend Dev | sem veredito | CTO |
| QA independente core | Senior QA-Security | QA | CTO |
| RED visual | Senior QA-Security | QA | CTO |
| GREEN UI | Senior Frontend Dev | sem veredito | CTO |
| QA independente/remoto | Senior QA-Security | QA | CTO |
| Teste manual | CEO | CEO | CTO |
| Merge | CEO | CEO | CTO |
| Pós-merge/sincronização | Engenheiro DevOps/SRE | evidência operacional | CTO |

Não existe handoff direto entre executores. O CTO roteia cada etapa; QA não implementa e Fábrica não julga.

## 19. Decisão de aceite

**TESTE DO CEO: SIM.** O teste manual só é liberado após:

1. GREEN independente do core;
2. GREEN independente e remoto dos 15 contratos visuais na mesma SHA candidata;
3. checks da PR verdes;
4. prévia estável servida pelo DevOps/SRE.

Cenário mínimo esperado pelo CEO:

- informar `I_b=600 A`, `400 V`, limite de queda `3%` e confirmar o catálogo/hipóteses laboratoriais;
- visualizar, sem abrir painéis técnicos desnecessários, alternativas como 2×185, 2×240 e 3×120;
- alternar os objetivos e observar 2×240, 3×120 e 4×240 no topo conforme o objetivo;
- identificar critérios, dominante, hipóteses e “Instalação autorizada: NÃO”;
- não encontrar “recomendado”, “selecionado” ou declaração IEC.

O aceite valida clareza e utilidade experimental; não remove nenhum bloqueio produtivo.

## 20. Ciclo de vida e encerramento

Estado atual: SDD R3 materializado no worktree documental. O RED vigente na cadeia experimental ainda possui
oráculo permissivo e aguarda correção pelo QA somente depois da ratificação deste SDD. A candidata Backend
permanece untracked, bloqueada e sem elegibilidade para commit/push. Não existe PR ou merge desta cadeia.
Após futura integração:

- `MERGE_VALIDADO` exige PR, SHA e Gate remoto;
- `ENCERRAMENTO_OPERACIONAL` exige `origin/main → AmpAI/ em main → Google Drive`, hashes aplicáveis,
  raiz limpa e classificação dos worktrees;
- a rotina pós-merge é CHG-0 do `@Engenheiro_DevOps_SRE`;
- nenhum documento pós-merge deve gerar nova PR apenas para registrar um fato já rastreável no Registro Mestre.

## 21. Checklist interno do CTO

- [x] Contrato SDD em `docs/api/`.
- [x] Result Pattern e RFC 7807 especificados.
- [x] Matemática e comparação restritas a `js/core_*.js`.
- [x] Renderização restrita a `index.html`/`js/ui_render.js`.
- [x] Motor L0 integrado preservado e chamado sem recálculo.
- [x] RNC-P, memorial, BDD e fonte primária ausente classificados.
- [x] Teste novo experimental, RED e protocolo de 74 relatórios definidos.
- [x] RED visual futuro e 15 relatórios definidos.
- [x] Regressão stable, artifact remoto e CodeRabbit consultivo previstos.
- [x] `FUNCTIONAL_FAILURE`, `INFRA_BLOCKED` e `CONFIG_ERROR` separados.
- [x] O.S. classificada como CHG-3 e roteamento explicitado.
- [x] `TESTE DO CEO: SIM` com cenário concreto.
- [x] `MERGE_VALIDADO` separado de `ENCERRAMENTO_OPERACIONAL`.
- [x] Novo arquivo justificado por autoridade/consumidores/ciclo de vida próprios.
- [x] Plataforma CI e DevOps/SRE permanecem em escopos próprios.

---

**Estado vinculante:** `SDD_EXPERIMENTAL_RATIFICADO_PARA_CORRECAO_DO_RED`. Correção do RED, Backend, QA independente,
Frontend, commit, push, PR e merge permanecem bloqueados até conferência focalizada do Conselho e autorização
correspondente.
