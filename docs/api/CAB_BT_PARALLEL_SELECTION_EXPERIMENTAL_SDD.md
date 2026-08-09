---
status: SDD_CANDIDATO_PARA_AUDITORIA
document_class: active
authority: "@CTO"
consumers:
  - "@Senior_QA_Security"
  - "@Senior_Backend_Dev"
  - "@Senior_Frontend_Dev"
lifecycle: "candidato até ratificação do Conselho; experimental enquanto a fonte primária integral estiver ausente"
governanca: v7.3
os: CAB-BT-PARALLEL-004-SDD-MINIMUM-PER-SECTION-EXP
classe: CHG-3 arquitetural/contratual experimental
baseline_imutavel: b58254bf8ecffcaa4825d2c3225977c30eb01174
baseline_cientifica_minimum_per_section: b58254bf8ecffcaa4825d2c3225977c30eb01174
baseline_cientifica_300mm2: 122b885db40f69b422dac8ea4c2e419dc547220f
baseline_errata_nonfinite: dc37b9c56a6bb28da72f86a0ce8c190c1168b7c1
baseline_errata_catalog_entry_id: 54941f9d3a126116ecaf9d519eb2b904ea6034f0
baseline_sdd_300mm2_r2: 380b949a9fba20bf63e9b052f03d5899046046c8
baseline_sdd_nonfinite_r4: 9d5403fff49567cf74af4ce18fdd5f168e59b547
baseline_core_green: 5411779a86a3280bb6b35a90e2efa8f024a7e1b8
baseline_core_green_300mm2: 71e3f78a5160203c524d3ae3ff5cee0ae0c7f017
baseline_ui_green_anterior: c3e49d1a8bf6e8376e9f1ddd6d1c2737d5ce8f81
baseline_ui_green_300mm2: 27186bb595c0f0719809303ccb72c0f9ef684700
baseline_red_visual_anterior: 0984fb0c0881df8d4e5c9f7ad520e383b8a586a8
parecer_origem: CAB-BT-PARALLEL-004-SCI-MINIMUM-PER-SECTION-EXP-R2-AUDIT
parecer_contratual_r1: RATIFICADO_COM_CONDICOES_CONTRATUAIS_PRECEDENTES_AO_RED
baseline_main_de_origem: 83e24131c0cc09813be65a5fa269961b9cc80c5c
fonte_primaria_completa: AUSENTE
estado_producao: BLOQUEADO
productionAllowed: false
teste_do_ceo: APROVADO_COM_AJUSTES_VISUAIS_FOCAIS_ENCERRAMENTO_PENDENTE
data: 2026-08-09
---

# SDD experimental — Enumeração e comparação preliminar de cabos BT em paralelo

> **PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.**
>
> Este contrato é **EXPERIMENTAL_PRELIMINAR_NAO_CANONICO**, para **LABORATORIO_APENAS**.
> Ele não é RNC-C, não declara conformidade IEC, não autoriza memorial final e mantém
> `productionAllowed=false`, `installableSelection=null` e os bloqueios B-01…B-06.
> A PR #40 permanece **DO NOT MERGE** e não é baseline desta implementação.

## 1. Decisão executiva e alcance

Este SDD transforma o pacote científico CAB-004 ratificado e publicado em
`b58254bf8ecffcaa4825d2c3225977c30eb01174`, incluindo as bases científicas precedentes, em um contrato
técnico testável para:

1. validar um catálogo experimental rastreável;
2. formar o produto cartesiano completo `seções × nParallel`;
3. preparar uma entrada distinta do motor L0 para cada combinação;
4. consumir, sem recalcular, o envelope real de
   `calculateCablingBTParallelExperimental()`;
5. avaliar ampacidade, queda de tensão e curto-circuito;
6. particionar todas as combinações em válidas e rejeitadas/bloqueadas;
7. computar a fronteira não dominada;
8. ordenar alternativas por objetivo configurável, sem eleger solução instalável;
9. fornecer um modelo de apresentação compreensível, como `2 × 300 mm² por fase`.

O contrato **não** autoriza seleção produtiva, recomendação comercial, aquisição, instalação,
dimensionamento final, memorial final ou afirmação de conformidade IEC. Enquanto a IEC 60364-5-52
Ed. 3.1 integral e os dados normativos bloqueados não forem adquiridos e ratificados, toda saída é
`MATHEMATICAL_ONLY`.

### 1.1 Justificativa do novo arquivo

Este documento tem autoridade, consumidores e ciclo de vida diferentes do SDD do motor L0 existente:

- `CAB_BT_PARALLEL_EXPERIMENTAL_SDD.md` especifica exclusivamente divisão por impedâncias e proxies L0;
- este documento especifica L1–L3, o catálogo, a enumeração, a comparação e o modelo de apresentação;
- o motor L0 integrado pela PR #39 permanece imutável e é dependência obrigatória.

### 1.2 Emenda focal CAB-BT-PARALLEL-003 — seção experimental de 300 mm²

Esta revisão estende o catálogo laboratorial de cinco para seis seções. Ela tem precedência sobre qualquer
contagem, fixture, objetivo ou exemplo histórico deste documento que ainda mencione o universo limitado a
`{95, 120, 150, 185, 240}` mm². Tais referências antigas permanecem somente como regressão histórica da
cadeia CAB-BT-PARALLEL-002 e não definem o estado atual.

O item adicional é exatamente:

```json
{
  "section_mm2": 300,
  "tabulatedAmpacity_A": 516,
  "material": "COPPER_LAB",
  "insulation": "LAB_UNSPECIFIED",
  "installationMethod": "LAB_UNSPECIFIED",
  "referenceTemperature_C": 30,
  "units": "SI",
  "source": "LAB_CATALOG",
  "sourceVersion": "PRELIM-1",
  "provenance": "ASSUMPTION_ONLY",
  "impedance_ohm": { "re": 0.0075, "im": 0.008 }
}
```

Os identificadores são laboratoriais. `516 A` e `0,0075+j0,008 Ω` são hipóteses experimentais rastreadas,
não valores IEC, de fabricante ou de catálogo comercial. A extrapolação que originou a hipótese não pertence
ao motor nem à UI: ambos recebem o item já materializado e nunca o recalculam.

Com `maxParallelCount=4`, o universo atual é o produto cartesiano completo de seis seções por quatro
quantidades: `24` combinações avaliadas, `14` alternativas válidas, `10` rejeitadas e `14` não dominadas.
Para o fixture de 600 A / 400 V / 3%, os resultados determinísticos são:

| Objetivo | Primeiro item apresentado | Natureza |
| --- | --- | --- |
| `NONE` | `2 × 185 mm² por fase` | apenas ordem de apresentação |
| `MIN_PARALLEL_COUNT` | `2 × 300 mm² por fase` | empate em quantidade resolvido pela margem |
| `MIN_TOTAL_COPPER` | `3 × 120 mm² por fase` | ordenação matemática |
| `MAX_MINIMUM_MARGIN` | `4 × 300 mm² por fase` | ordenação matemática |

`1×300` reprova somente por ampacidade; `2×300`, `3×300` e `4×300` são alternativas válidas no laboratório.
Nenhum desses resultados elege, recomenda ou autoriza instalação.

Na etapa CAB-003, o motor orientado pelo catálogo foi caracterizado antes de qualquer mudança Backend. Esse
fluxo histórico foi encerrado pelo core GREEN `71e3f78a…` e pela UI GREEN `27186bb5…`. A emenda CAB-004 possui
um delta novo e explícito no Backend: produzir a projeção mínima por seção depois da enumeração integral. O
Frontend continua proibido de calcular essa projeção; limita-se a fornecer a política, o limite e a renderizar
os paths recebidos, sem fórmula, extrapolação ou fallback visual.

O `catalog.sourceVersion` da fixture atual é `122b885d…`. O campo histórico
`sourceStatus.scientificBaselineSha` emitido pelo motor continua identificando a ciência de origem da
implementação L1–L3 (`2b61627d…`) e não deve ser falsificado pela UI nem alterado sem mudança explícita de
contrato do core. A rastreabilidade da extensão ocorre pelo catálogo de entrada, por este SDD e pelos testes
focais.

### 1.3 Errata contratual de valores não finitos — R3

Esta R3 incorpora a errata científica publicada em
`dc37b9c56a6bb28da72f86a0ce8c190c1168b7c1`. Ela não altera equações, valores de 300 mm², universo,
fronteira ou objetivos. A emenda separa valores presentes inválidos nos dez escalares conhecidos de valores
presentes inválidos na representação de impedância, preserva a taxonomia detalhada de não finitude e impede
que uma entrada conhecida inválida alcance L0 ou a matemática L1–L3.

### 1.4 Fechamento contratual R4

Esta R4 fecha exclusivamente duas lacunas de schema identificadas na auditoria da R3: o valor de
`provenance` com tipo string, porém fora do domínio `ASSUMPTION_ONLY`, e a identidade histórica exata da
issue `CANDIDATE_IMPEDANCE_VALUE_INVALID`. Nenhuma contagem, fixture, ciência ou resultado focal é alterado.

### 1.5 Identidade canônica do item de catálogo — R5

Esta R5 incorpora a errata publicada em `54941f9d3a126116ecaf9d519eb2b904ea6034f0`. Para seção finita,
positiva e única, `catalogEntryId` é sempre `section-${section_mm2}`; portanto, a candidata focal usa
`catalogEntryId="section-300"`, mesmo quando ampacidade ou impedância estão inválidas. Se a própria
`section_mm2` estiver ausente ou inválida, permanece `catalogEntryId="catalog-entry-${index}"`. O identificador
do item não depende de `nParallel`; `candidateId` só identifica posteriormente cada combinação enumerada.

### 1.6 Emenda focal CAB-BT-PARALLEL-004 — menor quantidade que atende por seção

Esta revisão incorpora o pacote científico-documental publicado em
`b58254bf8ecffcaa4825d2c3225977c30eb01174` e tem precedência sobre qualquer regra de apresentação
anterior que mostre simultaneamente duas ou mais candidatas válidas da mesma seção. Ela não altera as
equações, os três critérios, a fronteira, o catálogo, o envelope bruto nem os bloqueios produtivos.

O core L1–L3 passa a aceitar uma política **explícita e opcional** de apresentação. Quando ausente, o modo
histórico `ALL_VALID_LEGACY` preserva byte-conceitualmente os 74 relatórios e os consumidores existentes.
Quando a UI envia `MINIMUM_PASSING_PER_SECTION`, o core enumera e avalia todo o universo, escolhe para cada
`section_mm2` somente a candidata `VALID` com menor `nParallel` e aplica o comparador do objetivo apenas ao
conjunto filtrado. A UI consome essa projeção pronta; não agrupa, compara margens, reordena ou recalcula.

No perfil visual desta revisão:

- `maxParallelCount` inicia em `10` e o controle aceita somente inteiros de `1` a `10`;
- o catálogo possui seis seções, logo o universo inicial bruto possui `60` combinações;
- o usuário pode reduzir o limite; com `7`, o universo possui `42` combinações;
- `candidateAlternatives`, `evaluatedCandidates`, `rejectedCandidates` e `nonDominatedAlternatives`
  permanecem integrais;
- somente `presentationOrder`, `firstInPresentationOrder` e `presentationModel.cards` usam a projeção;
- candidatas válidas superiores da mesma seção permanecem rastreáveis em `hiddenCandidateIds`;
- seção sem candidata válida produz ausência nominal, nunca número, fallback ou recomendação.

Para a fixture do CEO (`1800 A`, `400 V`, `3%`, `maxParallelCount=7`), a seção de `300 mm²` contém
`5x300`, `6x300` e `7x300` válidas; somente `5x300` é apresentada. A regra é idêntica para todas as seções.

Esta emenda também fecha a localização dos onze grupos visíveis PT/EN/ES. O `displayNotice` bruto do motor
permanece imutável e rastreável; a camada visual apresenta a tradução exata vinculada à chave semântica,
sem esconder a advertência. Códigos, enums, `ASSUMPTION_ONLY` e B-01…B-06 nunca são traduzidos.

### 1.7 Fechamento contratual CAB-004 R1

Esta R1 atende exclusivamente às três condições precedentes ao RED: fecha o JSON Schema discriminado dos
dois sucessos, torna as contagens do summary core factuais em `CONFIG_ERROR` e transforma `MPS-UI-11` em
oráculo nominal dos dois paths observados pelo CEO. Ciência, contagens, ordenações, traduções e guardrails não
foram reabertos.

## 2. Fontes, autoridade e precedência

| Fonte | Identificação | Classe | Autoridade neste SDD |
| --- | --- | --- | --- |
| Registro científico prático | `RNC-P_CAB_BT_PARALLEL_SELECTION_PRELIM.md` em `122b885d…` | RNC-P experimental ratificado para SDD | requisitos e limites L1–L3, incluindo 300 mm² |
| Memorial prático | `CAB_BT_PARALLEL_SELECTION_PRELIM_Memorial.md` em `122b885d…` | memorial experimental | equações, casos e números esperados, incluindo 300 mm² |
| BDD prático + erratas | `CAB_BT_PARALLEL_SELECTION_PRELIM_BDD.feature` em `54941f9…` | evidência comportamental científica | cenários obrigatórios da extensão focal, valores presentes inválidos e identidade canônica do item |
| Pacote científico CAB-004 | RNC-P, Memorial e BDD em `b58254bf8ecffcaa4825d2c3225977c30eb01174` | contrato experimental ratificado para SDD | universo até 10, `minimumPassingBySection`, ordens, i18n e paths dos guardrails |
| Motor integrado | `js/core_cabos_bt_parallel_experimental.js` em `main@83e24131…` | implementação experimental L0 | única fonte executável de L0 |
| SDD L0 | `docs/api/CAB_BT_PARALLEL_EXPERIMENTAL_SDD.md` | contrato experimental integrado | envelope e erros do L0 |
| IEC 60364-5-52 Ed. 3.1 integral | ausente | norma primária ausente | **não disponível para regra produtiva** |

Precedência vinculante:

1. norma primária integral e futuro RNC-C, quando ratificados;
2. contrato L0 integrado para os cálculos que já executa;
3. pacote científico `122b885d…`, complementado pelas erratas `dc37b9c…` e `54941f9…`, para L1–L3 e extensão focal de 300 mm²;
4. pacote `b58254bf…` para a política de apresentação mínima por seção, faixa visual `1…10`, localização e
   paths de guardrails;
5. este SDD para estrutura de software, DTOs, Result Pattern e evidência;
6. exemplos e textos de interface, que nunca substituem os itens anteriores.

Qualquer divergência científica retorna ao Conselho; Backend, Frontend e QA não reinterpretam fórmulas.

## 3. Arquitetura e fronteiras

### 3.1 Componentes previstos

| Camada | Arquivo/função | Responsabilidade |
| --- | --- | --- |
| L0 existente | `js/core_cabos_bt_parallel_experimental.js` / `calculateCablingBTParallelExperimental(input)` | admitâncias, correntes, `Zeq`, `deltaLoad`, proxy térmico, queda em V e adiabático |
| L1–L3 integrado | `js/core_cabos_bt_parallel_selection_experimental.js` / `enumerateCablingBTParallelAlternativesExperimental(input)` em `71e3f78a…` | validar catálogo, enumerar, chamar L0, avaliar critérios, fronteira e ordenação; ainda não expõe CAB-004 |
| UI GREEN 300 mm² | `index.html` e `js/ui_render.js` em `27186bb5…` | seis seções e correção OS044R; ainda apresenta todas as válidas |
| Regressão core | `tests/test_cab_bt_parallel_selection_experimental.js` | 74 contratos processáveis: 48 científicos + 26 técnicos |
| Regressão visual | `tests/test_cab_bt_parallel_selection_ui_experimental.js` | 15 contratos da UI anterior |
| Caracterização/RED focal | arquivos definidos em §14.5 | provar core dinâmico e produzir RED visual específico de 300 mm² |
| RED CAB-004 | arquivos definidos em §14.6 | provar projeção mínima por seção, default 10 e localização integral |

### 3.2 Regras arquiteturais vinculantes

- O motor L1–L3 integrado é síncrono, determinístico e puro.
- Zero DOM, renderer, console, rede, filesystem, relógio, locale implícito ou aleatoriedade no core.
- Zero mutação da entrada, do catálogo, dos envelopes L0 ou de estado global.
- O motor L1–L3 **deve chamar** `calculateCablingBTParallelExperimental()` exatamente uma vez por combinação
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
    "sourceVersion": "122b885db40f69b422dac8ea4c2e419dc547220f",
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
      },
      {
        "section_mm2": 300,
        "tabulatedAmpacity_A": 516,
        "material": "COPPER_LAB",
        "insulation": "LAB_UNSPECIFIED",
        "installationMethod": "LAB_UNSPECIFIED",
        "referenceTemperature_C": 30,
        "units": "SI",
        "source": "LAB_CATALOG",
        "sourceVersion": "PRELIM-1",
        "provenance": "ASSUMPTION_ONLY",
        "impedance_ohm": { "re": 0.0075, "im": 0.008 }
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
    "presentationPolicy": {
      "oneOf": [
        { "type": "null" },
        {
          "type": "object",
          "additionalProperties": false,
          "required": ["mode", "confirmed", "provenance"],
          "properties": {
            "mode": { "const": "MINIMUM_PASSING_PER_SECTION" },
            "confirmed": { "const": true },
            "provenance": { "const": "CEO_APPROVED_PRESENTATION_POLICY" }
          }
        }
      ]
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
| `presentationPolicy` | objeto ou ausente/`null` | ausente/`null` preserva `ALL_VALID_LEGACY`; no CAB-004 exige o objeto fechado da §4.9 |
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

Ausência usa `CANDIDATE_INCOMPLETE`. Propriedade escalar conhecida presente e inválida usa
`CANDIDATE_VALUE_INVALID`; propriedade de impedância presente e inválida usa exclusivamente
`CANDIDATE_IMPEDANCE_VALUE_INVALID`. Não há coerção de string numérica, fallback, impedância parcial,
componente inventado nem passagem de entrada inválida para L0/L1–L3.

Ordem canônica de `missingFields[]`:

```text
section_mm2, tabulatedAmpacity_A, material, insulation, installationMethod,
referenceTemperature_C, units, source, sourceVersion, provenance,
impedanceRepresentation, impedance_ohm.re, impedance_ohm.im,
resistance_ohm, reactance_ohm
```

Ordem canônica de `invalidFields[]` para os dez escalares:

```text
section_mm2, tabulatedAmpacity_A, material, insulation, installationMethod,
referenceTemperature_C, units, source, sourceVersion, provenance
```

Ordem canônica de `invalidFields[]` para impedância:

```text
impedance_ohm, impedance_ohm.re, impedance_ohm.im, resistance_ohm, reactance_ohm
```

Cada `invalidFields[]` contém exclusivamente `{ path, reason, observedType }`. Para escalares, `reason` é
`NOT_NUMBER`, `NON_FINITE`, `OUT_OF_RANGE`, `NOT_STRING` ou `NOT_ASSUMPTION_ONLY`, conforme tipo e domínio
do campo; para
impedância, permanece `NOT_SIMPLE_OBJECT`, `NOT_NUMBER` ou `NON_FINITE`. As coleções acumulam todos os paths
aplicáveis, removem duplicidades e são independentes da ordem das propriedades.

`observedType` usa a taxonomia vinculante `number:NaN`, `number:+Infinity` e `number:-Infinity` para números
não finitos. `number` fica reservado a número finito, inclusive fora de faixa. Os demais tipos são nominais:
`string`, `boolean`, `object`, `array`, `null` e `undefined`. String numérica não é convertida.

A issue escalar dentro de `CATALOG_NO_EVALUABLE_CANDIDATE.params.errors[]` possui schema fechado, sem
propriedades adicionais:

```json
{
  "code": "CANDIDATE_VALUE_INVALID",
  "catalogEntryId": "section-300",
  "catalogEntryIndex": 0,
  "invalidFields": [
    {
      "path": "tabulatedAmpacity_A",
      "reason": "NON_FINITE",
      "observedType": "number:NaN"
    }
  ],
  "mode": "CATALOGO_LAB_ASSUMPTION_ONLY"
}
```

`code`, `catalogEntryId`, `catalogEntryIndex`, `invalidFields` e `mode` são obrigatórios. Cada item de
`invalidFields` exige exatamente `path`, `reason` e `observedType`. Ausências e valores inválidos independentes
no mesmo item acumulam issues na precedência da §11.1; conflito de representação continua terminal e impede
qualquer issue posterior para o item.

Para `provenance`, a resolução é determinística: valor presente não-string retorna `NOT_STRING`; valor string
diferente de `ASSUMPTION_ONLY` retorna `NOT_ASSUMPTION_ONLY`. Caso técnico nominal de schema
`R4-PROVENANCE-DOMAIN` — sem novo relatório ou `caseId`: entrada com `provenance="USER_CONFIRMED"` produz
exatamente `invalidFields[0]={path:"provenance",reason:"NOT_ASSUMPTION_ONLY",observedType:"string"}` dentro
de uma issue `CANDIDATE_VALUE_INVALID`; não alcança L0/L1–L3. A ordem canônica permanece a dos dez escalares.

A issue histórica de impedância dentro de `CATALOG_NO_EVALUABLE_CANDIDATE.params.errors[]` também possui
schema fechado, sem `candidateId`, `catalogEntryIndex` ou propriedade adicional:

```json
{
  "code": "CANDIDATE_IMPEDANCE_VALUE_INVALID",
  "catalogEntryId": "section-300",
  "invalidFields": [
    {
      "path": "resistance_ohm",
      "reason": "NON_FINITE",
      "observedType": "number:+Infinity"
    }
  ],
  "mode": "CATALOGO_LAB_ASSUMPTION_ONLY"
}
```

Para essa issue, `code`, `catalogEntryId`, `invalidFields` e `mode` são os únicos campos obrigatórios e
permitidos. Cada item de `invalidFields` continua fechado em `path`, `reason` e `observedType`.

Em catálogo misto, um item escalarmente inválido não invalida entradas independentes válidas, mas suas
combinações são bloqueadas antes de L0. A fixture vinculante usa `maxParallelCount=1`, item 95 válido e item
300 com `tabulatedAmpacity_A=NaN`: `evaluatedCandidates[1].candidateId="1x300"`, status `BLOCKED`,
`evaluatedCandidates[1].blockers[0].code="CANDIDATE_STRUCTURE_INVALID"` e
`evaluatedCandidates[1].blockers[0].params.reason="candidate_value_invalid"`. `1x300` não aparece em
`candidateAlternatives`, não produz número utilizável e não alcança L0/L1–L3. `catalogEntryIndex` não é índice
de `evaluatedCandidates`; a posição `[1]` decorre somente dessa fixture e da ordem canônica. Uma localização
alternativa exige igualdade exata de `candidateId`; busca recursiva, parcial ou por blocker semelhante é
proibida.

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

### 4.9 Política opcional de apresentação

`presentationPolicy` não entra em `required` para preservar os contratos históricos. As únicas formas válidas são:

```json
null
```

ou:

```json
{
  "mode": "MINIMUM_PASSING_PER_SECTION",
  "confirmed": true,
  "provenance": "CEO_APPROVED_PRESENTATION_POLICY"
}
```

Ausência ou `null` resolve internamente para `ALL_VALID_LEGACY` e não acrescenta campos ao envelope histórico.
Objeto, propriedade, valor ou confirmação divergente retorna falha RFC 7807 de topo:

```json
{
  "code": "PRESENTATION_POLICY_INVALID",
  "params": {
    "path": "$.presentationPolicy",
    "reason": "unsupported_or_unconfirmed_policy"
  }
}
```

O código é proibido no sucesso. A política não muda `U`, chamadas L0, margens, status, fronteira ou arrays brutos.
O controle visual `maxParallelCount` inicia em `10`, possui `min=1`, `max=10`, `step=1` e não aceita vazio,
fração, zero, negativo ou valor maior que `10`. Entrada visual inválida bloqueia a chamada ao core e produz falha
de integração da UI, sem envelope sintético de domínio. O core genérico continua aceitando inteiro `>=1` para
consumidores não visuais; o limite `1…10` é contrato da UI CAB-004.

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
17. resolver a política: legado mantém todas as válidas; CAB-004 agrupa as válidas por `section_mm2` e retém
    exatamente o menor `nParallel` de cada seção;
18. registrar contagens, ausências e todos os IDs válidos ocultados, sem removê-los dos arrays brutos;
19. ordenar pelo objetivo o conjunto resultante da política e construir os cards somente a partir dele;
20. resolver `providedCombination`, sem promovê-la; valor inválido encerra em falha RFC 7807;
21. validar finitude de todo resultado numérico;
22. emitir Result Pattern imutável.

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

### 8.2 Projeção determinística `MINIMUM_PASSING_PER_SECTION`

Para cada seção `S` do catálogo retido:

```text
validForSection(S) = candidateAlternatives filtradas por section_mm2 === S
minimumPassingBySection(S) = item de validForSection(S) com menor nParallel
```

Como o universo possui no máximo uma combinação por par `section_mm2 × nParallel`, não existe empate primário.
Mesmo assim, o comparador total interno é `nParallel` ascendente e `candidateId` ascendente. O core avalia primeiro
todo o universo; é proibido parar após encontrar a primeira válida ou inferir monotonicidade dos critérios.

`minimumPassingBySection[]` usa seção ascendente e contém exatamente uma entrada por seção do catálogo retido:

```json
{
  "section_mm2": 300,
  "candidateId": "5x300",
  "status": "PASSING_ALTERNATIVE_FOUND",
  "evaluatedRange": { "minimum": 1, "maximum": 7 }
}
```

Quando não existe válida:

```json
{
  "section_mm2": 95,
  "candidateId": null,
  "status": "NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE",
  "evaluatedRange": { "minimum": 1, "maximum": 7 }
}
```

Após formar esse array, o core aplica o comparador do objetivo somente às entradas com `candidateId` não nulo.
`presentationOrder`, `firstInPresentationOrder` e `presentationModel.cards` refletem esse conjunto. Os arrays
`evaluatedCandidates`, `candidateAlternatives`, `rejectedCandidates` e `nonDominatedAlternatives` permanecem
inalterados e reconciliados com o universo bruto.

Para a fixture do CEO no default `10`:

| Seção | Candidata mínima |
| --- | --- |
| 95 | `10x95` |
| 120 | `8x120` |
| 150 | `7x150` |
| 185 | `6x185` |
| 240 | `6x240` |
| 300 | `5x300` |

`rawCount=60`, `validRawCount=24` e `filteredCount=6`. As ordens vinculantes são:

| Objetivo | Ordem completa |
| --- | --- |
| `NONE` | `5x300`, `6x185`, `6x240`, `7x150`, `8x120`, `10x95` |
| `MIN_PARALLEL_COUNT` | `5x300`, `6x240`, `6x185`, `7x150`, `8x120`, `10x95` |
| `MIN_TOTAL_COPPER` | `10x95`, `8x120`, `7x150`, `6x185`, `6x240`, `5x300` |
| `MAX_MINIMUM_MARGIN` | `6x240`, `5x300`, `10x95`, `7x150`, `8x120`, `6x185` |

Com limite `7`, `rawCount=42`, `validRawCount=8`, `filteredCount=4`, as seções `95` e `120` ficam sem
alternativa, e a projeção contém `7x150`, `6x185`, `6x240`, `5x300`. `6x300` e `7x300` permanecem válidas
no bruto e aparecem em `hiddenCandidateIds`, mas nunca em cards ou impressão.

As ordens completas vinculantes para o limite `7` são:

| Objetivo | Ordem completa |
| --- | --- |
| `NONE` | `5x300`, `6x185`, `6x240`, `7x150` |
| `MIN_PARALLEL_COUNT` | `5x300`, `6x240`, `6x185`, `7x150` |
| `MIN_TOTAL_COPPER` | `7x150`, `6x185`, `6x240`, `5x300` |
| `MAX_MINIMUM_MARGIN` | `6x240`, `5x300`, `7x150`, `6x185` |

## 9. Envelope de sucesso

JSON Schema discriminado do sucesso (os schemas específicos dos candidatos continuam vinculados pela §9.1):

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "ok", "classification", "data", "assumptions", "blockers", "warnings",
    "sourceStatus", "productionAllowed", "displayNotice", "error"
  ],
  "$defs": {
    "evaluatedRange": {
      "type": "object",
      "additionalProperties": false,
      "required": ["minimum", "maximum"],
      "properties": {
        "minimum": { "const": 1 },
        "maximum": { "type": "integer", "minimum": 1 }
      }
    },
    "minimumPassingItem": {
      "type": "object",
      "additionalProperties": false,
      "required": ["section_mm2", "candidateId", "status", "evaluatedRange"],
      "properties": {
        "section_mm2": { "type": "number", "exclusiveMinimum": 0 },
        "candidateId": {
          "oneOf": [
            { "type": "null" },
            { "type": "string", "pattern": "^[1-9][0-9]*x[1-9][0-9]*(?:\\.[0-9]+)?$" }
          ]
        },
        "status": {
          "enum": [
            "PASSING_ALTERNATIVE_FOUND",
            "NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE"
          ]
        },
        "evaluatedRange": { "$ref": "#/$defs/evaluatedRange" }
      },
      "allOf": [
        {
          "if": { "properties": { "status": { "const": "PASSING_ALTERNATIVE_FOUND" } } },
          "then": { "properties": { "candidateId": { "type": "string" } } }
        },
        {
          "if": {
            "properties": {
              "status": { "const": "NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE" }
            }
          },
          "then": { "properties": { "candidateId": { "type": "null" } } }
        }
      ]
    },
    "absenceEntry": {
      "type": "object",
      "additionalProperties": false,
      "required": ["section_mm2", "messageKey", "messageArgs"],
      "properties": {
        "section_mm2": { "type": "number", "exclusiveMinimum": 0 },
        "messageKey": { "const": "NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE" },
        "messageArgs": {
          "type": "object",
          "additionalProperties": false,
          "required": ["section_mm2", "minimum", "maximum"],
          "properties": {
            "section_mm2": { "type": "number", "exclusiveMinimum": 0 },
            "minimum": { "const": 1 },
            "maximum": { "type": "integer", "minimum": 1 }
          }
        }
      }
    },
    "presentationProjection": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "mode", "rawCount", "validRawCount", "filteredCount",
        "minimumPassingBySection", "visibleCandidateIds", "hiddenCandidateIds",
        "noPassingSections_mm2"
      ],
      "properties": {
        "mode": { "const": "MINIMUM_PASSING_PER_SECTION" },
        "rawCount": { "type": "integer", "minimum": 0 },
        "validRawCount": { "type": "integer", "minimum": 0 },
        "filteredCount": { "type": "integer", "minimum": 0 },
        "minimumPassingBySection": {
          "type": "array",
          "items": { "$ref": "#/$defs/minimumPassingItem" }
        },
        "visibleCandidateIds": {
          "type": "array",
          "uniqueItems": true,
          "items": { "type": "string", "pattern": "^[1-9][0-9]*x[1-9][0-9]*(?:\\.[0-9]+)?$" }
        },
        "hiddenCandidateIds": {
          "type": "array",
          "uniqueItems": true,
          "items": { "type": "string", "pattern": "^[1-9][0-9]*x[1-9][0-9]*(?:\\.[0-9]+)?$" }
        },
        "noPassingSections_mm2": {
          "type": "array",
          "uniqueItems": true,
          "items": { "type": "number", "exclusiveMinimum": 0 }
        }
      }
    },
    "presentationModelLegacy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "notice", "objective", "analysisMode", "installationAuthorized", "heading", "cards"
      ],
      "properties": {
        "notice": { "type": "string" },
        "objective": { "type": "string" },
        "analysisMode": { "type": "string" },
        "installationAuthorized": { "const": false },
        "heading": { "type": "string" },
        "cards": { "type": "array" }
      }
    },
    "presentationModelMinimum": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "notice", "objective", "analysisMode", "installationAuthorized", "heading", "cards",
        "projectionMode", "absenceEntries"
      ],
      "properties": {
        "notice": { "type": "string" },
        "objective": { "type": "string" },
        "analysisMode": { "type": "string" },
        "installationAuthorized": { "const": false },
        "heading": { "type": "string" },
        "cards": { "type": "array" },
        "projectionMode": { "const": "MINIMUM_PASSING_PER_SECTION" },
        "absenceEntries": {
          "type": "array",
          "items": { "$ref": "#/$defs/absenceEntry" }
        }
      }
    }
  },
  "properties": {
    "ok": { "const": true },
    "classification": { "const": "MATHEMATICAL_ONLY" },
    "data": {
      "type": "object",
      "additionalProperties": false,
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
        "presentationModel": {
          "oneOf": [
            { "$ref": "#/$defs/presentationModelLegacy" },
            { "$ref": "#/$defs/presentationModelMinimum" }
          ]
        },
        "presentationProjection": { "$ref": "#/$defs/presentationProjection" }
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
  },
  "oneOf": [
    {
      "title": "ALL_VALID_LEGACY",
      "properties": {
        "data": {
          "not": { "required": ["presentationProjection"] },
          "properties": {
            "presentationModel": { "$ref": "#/$defs/presentationModelLegacy" }
          }
        }
      }
    },
    {
      "title": "MINIMUM_PASSING_PER_SECTION",
      "properties": {
        "data": {
          "required": ["presentationProjection"],
          "properties": {
            "presentationProjection": { "$ref": "#/$defs/presentationProjection" },
            "presentationModel": { "$ref": "#/$defs/presentationModelMinimum" }
          }
        }
      }
    }
  ]
}
```

Para o fixture-base histórico CAB-003 (`maxParallelCount=4`), os arrays devem ser materializados integralmente
e reconciliar `24/14/10/14`; não se aceita envelope resumido, paginação ou omissão de candidatas no core. A
fixture CAB-004 possui as contagens próprias da §8.2 e não altera retrospectivamente esse contrato.

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
substituir `firstInPresentationOrder` por “recomendado”. No modo legado, não oculta alternativa válida. No
modo CAB-004, renderiza exclusivamente os cards recebidos do core e só deixa de mostrar as candidatas
nominalmente registradas pela projeção; não implementa filtro próprio.

O JSON Schema discriminado da §9 torna `presentationProjection`, `projectionMode` e `absenceEntries`
obrigatórios no sucesso `MINIMUM_PASSING_PER_SECTION`. No sucesso `ALL_VALID_LEGACY`, esses três campos são
fisicamente ausentes. `minimumPassingBySection[]`, `evaluatedRange`, `absenceEntries[]` e seus argumentos são
objetos fechados por `$defs`, sem propriedades adicionais.

Exemplo vinculante da fixture `42/8/4` — não substitui o schema estrutural genérico da §9:

```json
{
  "mode": "MINIMUM_PASSING_PER_SECTION",
  "rawCount": 42,
  "validRawCount": 8,
  "filteredCount": 4,
  "minimumPassingBySection": [
    {
      "section_mm2": 95,
      "candidateId": null,
      "status": "NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE",
      "evaluatedRange": { "minimum": 1, "maximum": 7 }
    },
    {
      "section_mm2": 120,
      "candidateId": null,
      "status": "NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE",
      "evaluatedRange": { "minimum": 1, "maximum": 7 }
    },
    {
      "section_mm2": 150,
      "candidateId": "7x150",
      "status": "PASSING_ALTERNATIVE_FOUND",
      "evaluatedRange": { "minimum": 1, "maximum": 7 }
    },
    {
      "section_mm2": 185,
      "candidateId": "6x185",
      "status": "PASSING_ALTERNATIVE_FOUND",
      "evaluatedRange": { "minimum": 1, "maximum": 7 }
    },
    {
      "section_mm2": 240,
      "candidateId": "6x240",
      "status": "PASSING_ALTERNATIVE_FOUND",
      "evaluatedRange": { "minimum": 1, "maximum": 7 }
    },
    {
      "section_mm2": 300,
      "candidateId": "5x300",
      "status": "PASSING_ALTERNATIVE_FOUND",
      "evaluatedRange": { "minimum": 1, "maximum": 7 }
    }
  ],
  "visibleCandidateIds": ["7x150", "6x185", "6x240", "5x300"],
  "hiddenCandidateIds": ["7x185", "7x240", "6x300", "7x300"],
  "noPassingSections_mm2": [95, 120]
}
```

Na mesma fixture, as extensões de `presentationModel` são exatamente:

```json
{
  "projectionMode": "MINIMUM_PASSING_PER_SECTION",
  "absenceEntries": [
    {
      "section_mm2": 95,
      "messageKey": "NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE",
      "messageArgs": { "section_mm2": 95, "minimum": 1, "maximum": 7 }
    },
    {
      "section_mm2": 120,
      "messageKey": "NO_PASSING_ALTERNATIVE_IN_EVALUATED_RANGE",
      "messageArgs": { "section_mm2": 120, "minimum": 1, "maximum": 7 }
    }
  ]
}
```

Todas as propriedades acima são obrigatórias e `additionalProperties=false`. `visibleCandidateIds` acompanha
a ordem canônica de seção de `minimumPassingBySection`, não a ordem do objetivo; `presentationOrder` contém
a ordem do objetivo. `hiddenCandidateIds` usa seção ascendente, depois `nParallel` ascendente. Ausência,
duplicidade, ID extra, contagem divergente ou candidata visível também presente em `hiddenCandidateIds` é
`CONFIG_ERROR` no oráculo.

As reconciliações semânticas, não expressáveis apenas pelas keywords estruturais, também são vinculantes:
`rawCount = evaluatedCandidates.length`; `validRawCount = candidateAlternatives.length`;
`filteredCount = visibleCandidateIds.length = presentationOrder.length = presentationModel.cards.length`;
`hiddenCandidateIds` é exatamente `candidateAlternatives[].candidateId − visibleCandidateIds`;
`noPassingSections_mm2` é exatamente o conjunto dos itens de `minimumPassingBySection` com `candidateId=null`;
e `presentationModel.absenceEntries` corresponde um-a-um, por igualdade profunda de seção e intervalo, a esse
mesmo conjunto. `minimumPassingBySection` e `absenceEntries` usam seção ascendente.

### 9.3 Warning `EXCESSIVE_COUNT`

`warnings[]` possui schema fechado e, nesta versão, aceita somente `EXCESSIVE_COUNT`. O campo
`continuousProxy` contém o valor integral de precisão de máquina produzido pelo cálculo. O campo
`continuousProxyDisplay` contém exclusivamente `round(continuousProxy, 3)` para apresentação. Todas as
comparações, `discreteRequired`, margens, ordenação e fronteira usam apenas `continuousProxy`; o valor de
apresentação nunca retroalimenta cálculo ou decisão. O RED verifica o valor bruto pela tolerância
computacional já declarada e o valor apresentado por igualdade com o arredondamento a três casas.

### 9.4 Localização visual CAB-004

O core não traduz frases. A UI mantém um catálogo único de chaves PT/EN/ES e troca todo texto visível quando
`document.documentElement.lang` muda. O aviso bruto `displayNotice` permanece no envelope e deve ser exatamente
o literal histórico em português; a UI reconhece esse valor apenas para selecionar a chave semântica
`PRELIMINARY_DO_NOT_USE`. Valor bruto desconhecido nunca é ocultado: gera `uiFailure` fail-closed e é mostrado
verbatim junto da advertência localizada.

Os onze grupos vinculantes são:

| Chave | PT | EN | ES |
| --- | --- | --- | --- |
| `warning` | `PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.` | `PRELIMINARY — DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION.` | `PRELIMINAR — NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN.` |
| `installation` | `Instalação autorizada: NÃO` | `Installation authorized: NO` | `Instalación autorizada: NO` |
| `production` | `Estado de produção: BLOQUEADO` | `Production state: BLOCKED` | `Estado de producción: BLOQUEADO` |
| `source` | `Fonte primária IEC integral: AUSENTE — sem conformidade IEC` | `Full primary IEC source: ABSENT — no IEC conformity` | `Fuente primaria IEC íntegra: AUSENTE — sin conformidad IEC` |
| `assumptions` | `Hipóteses (ASSUMPTION_ONLY)` | `Assumptions (ASSUMPTION_ONLY)` | `Hipótesis (ASSUMPTION_ONLY)` |
| `blockers` | `Bloqueadores` | `Blockers` | `Bloqueadores` |
| `confirmedInputs` | `Entradas confirmadas` | `Confirmed inputs` | `Entradas confirmadas` |
| `heading` | `Menor quantidade que atende por seção no intervalo avaliado` | `Smallest quantity meeting the criteria per section within the evaluated range` | `Menor cantidad que cumple por sección en el intervalo evaluado` |
| `criteria` | `Critérios: ampacidade, queda de tensão, curto-circuito` | `Criteria: ampacity, voltage drop, short-circuit` | `Criterios: ampacidad, caída de tensión, cortocircuito` |
| `absence(S,N)` | `Nenhuma alternativa da seção S atende dentro do intervalo avaliado de 1 até N cabos por fase.` | `No alternative for section S meets the criteria within the evaluated range of 1 to N conductors per phase.` | `Ninguna alternativa de la sección S cumple dentro del intervalo evaluado de 1 a N conductores por fase.` |
| `printLabel` | `Impressão preliminar — não é memorial final` | `Preliminary print — not a final report` | `Impresión preliminar — no es memoria final` |

`S` e `N` são interpolados somente depois de selecionar a tradução; o BDD materializa `N=7` e `N=10`.
Comparação do oráculo atual usa igualdade UTF-8 integral: sem NFD, remoção de acentos, substring, tradução
parcial ou equivalência case-insensitive. `Bloqueadores`, `Entradas confirmadas` e `PRELIMINAR` são cognatos
espanhóis válidos, não vazamento de português.

Vazamento usa apenas as listas fechadas ratificadas:

```json
{
  "pt": [
    "NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO",
    "Instalação autorizada: NÃO",
    "Estado de produção: BLOQUEADO",
    "queda de tensão",
    "cabos por fase",
    "não é memorial final"
  ],
  "en": [
    "DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION",
    "Installation authorized: NO",
    "Production state: BLOCKED",
    "voltage drop",
    "conductors per phase",
    "not a final report"
  ],
  "es": [
    "NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN",
    "Instalación autorizada: NO",
    "Estado de producción: BLOQUEADO",
    "caída de tensión",
    "conductores por fase",
    "no es memoria final"
  ]
}
```

PT rejeita as listas EN/ES; EN rejeita PT/ES; ES rejeita PT/EN. NFD permanece permitido exclusivamente no
oráculo histórico de vocabulário proibido (`recomendado`, `selecionado`, `ótimo para instalação`,
`dimensionamento final`) e não participa da localização atual. A tela e a árvore de impressão usam o mesmo
catálogo de traduções e o idioma ativo; nenhum segundo conjunto hardcoded é permitido.

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
| `PRESENTATION_POLICY_INVALID` | política presente com tipo, propriedades, modo, confirmação ou proveniência divergente | `{ path:"$.presentationPolicy", reason:"unsupported_or_unconfirmed_policy" }` |
| `SUGGESTION_UNCONFIRMED` | valor sugerido/poda sem confirmação | `{ path }` |
| `CATALOG_MODE_INVALID` | modo de catálogo desconhecido | `{ received }` |
| `CATALOG_TRACEABILITY_MISSING` | modo secundário sem fonte/versão/proveniência | `{ paths[] }` |
| `CATALOG_CONFIRMATION_MISSING` | catálogo laboratorial sem confirmação | `{ path }` |
| `CATALOG_NO_EVALUABLE_CANDIDATE` | zero item completo após validação/poda | `{ catalogEntryCount, errors[] }` |
| `CANDIDATE_STRUCTURE_INVALID` | item não objeto simples, propriedade desconhecida, catálogo heterogêneo ou seção duplicada | `{ catalogEntryId, catalogEntryIndex, reason, path?, conflictingEntryIds? }` |
| `CANDIDATE_INCOMPLETE` | escalar/componente conhecido ausente | `{ candidateId, missingFields[], mode, provenance }` |
| `CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT` | coexistência por presença | `{ candidateId, presentFields[] }` |
| `CANDIDATE_VALUE_INVALID` | valor presente inválido em um dos dez escalares conhecidos | issue fechada `{ code, catalogEntryId, catalogEntryIndex, invalidFields[], mode }` conforme §4.4 |
| `CANDIDATE_IMPEDANCE_VALUE_INVALID` | valor presente inválido exclusivamente em `impedance_ohm`, `.re`, `.im`, `resistance_ohm` ou `reactance_ohm` | issue fechada `{ code, catalogEntryId, invalidFields[], mode }`; `candidateId` e `catalogEntryIndex` proibidos |
| `GROUPING_MODE_INVALID` | modo `k_g` desconhecido | `{ received }` |
| `GROUPING_FACTOR_MISSING` | entrada específica/matriz sem correspondência | `{ candidateId, nParallel, nCircuits }` |
| `GROUPING_FACTOR_INVALID` | `k_g` fora de `(0,1]` ou não finito | `{ candidateId, value }` |
| `GROUPING_CONFIRMATION_MISSING` | constante laboratorial não confirmada | `{ path }` |
| `GUIDED_HYPOTHESIS_UNCONFIRMED` | hipótese não exibida/confirmada/proveniente | `{ missing[] }` |
| `ADVANCED_BRANCHES_INVALID` | mapa/descrição/ramos ausentes ou incompatíveis | mapa global: `{ reason:"map_not_array" }`; combinação: schema exato da matriz §4.7 |
| `PROVIDED_COMBINATION_INVALID` | combinação informada fora do catálogo/domínio | `{ section_mm2, nParallel }` |
| `NO_EVALUABLE_COMBINATION` | todas as combinações bloquearam antes/depois de L0 | `{ evaluatedCount, blockersByCandidate[] }` |
| `NUMERIC_RESULT_NON_FINITE` | resultado computacional inesperadamente não finito após todas as entradas serem válidas, fora do caso `Smin=0` tratado | `{ stage, field, candidateId? }` |
| `PRODUCTION_USE_BLOCKED` | solicitação produtiva | `{ prohibitedUse }` |
| `IEC_CONFORMITY_BLOCKED` | solicitação de conformidade | `{ sourceStatus }` |

Erros L0 mantêm o código e `params` originais dentro do candidato. A camada não troca
`PARALLEL_Z_ZERO`, `FAULT_IMBALANCE_MISSING`, `GROUPING_FACTOR_MISSING` ou outro código L0 por erro genérico.
Nenhum código aceita `relatedCodes`. `GLOBAL_METADATA_MISSING.params` contém exclusivamente `paths`;
propriedade desconhecida em item usa exclusivamente `CANDIDATE_STRUCTURE_INVALID`; valor escalar ou valor/
estrutura de impedância usa o único código primário determinado pela precedência. `NUMERIC_RESULT_NON_FINITE`
é defesa interna tardia e nunca substitui a validação de uma entrada conhecida inválida. Problemas independentes acumuláveis são
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
6. por item: estrutura do item;
7. por item: conflito de representação de impedância, **terminal**;
8. por item: campos ausentes → `CANDIDATE_INCOMPLETE`;
9. por item: escalares presentes inválidos → `CANDIDATE_VALUE_INVALID`;
10. por item: valores de impedância presentes inválidos → `CANDIDATE_IMPEDANCE_VALUE_INVALID`;
11. modo/resolução de agrupamento;
12. hipótese guiada/ramos avançados;
13. erro L0;
14. finitude computacional L1–L3.

Validações por item acumulam ausências e valores inválidos independentes nessa ordem; conflito de
representação é terminal para o item. Nenhum valor inválido alcança L0 ou a matemática L1–L3. Falhas globais
retornam imediatamente.

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

## 13. Contrato histórico congelado do core — catálogo até 240 mm²

Esta seção preserva byte-conceitualmente a regressão de 74 relatórios da CAB-BT-PARALLEL-002. Sua fixture
continua limitada a `{95,120,150,185,240}` mm² e seus resultados permanecem `20/11/9/11`. Nenhum contrato
desta seção é atualizado para 300 mm²; a extensão pertence exclusivamente aos 12 relatórios `MM300-CORE-*`
da §14.5.1. A execução atual esperada é PASS contra o módulo integrado em `5411779a…`.

### 13.1 Arquivo, execução e estado histórico

- executor: `@Senior_QA_Security`;
- arquivo exclusivo inicial: `tests/test_cab_bt_parallel_selection_experimental.js`;
- classificação: `experimental`, fora de `qa/test-manifest.json`;
- baseline histórica do oráculo: RED R4 em `86085949e7a8c5b4c2334854550aab0764811da6`;
- candidata GREEN histórica: `5411779a86a3280bb6b35a90e2efa8f024a7e1b8`;
- comando sintático: `node --check tests/test_cab_bt_parallel_selection_experimental.js` → exit `0`;
- comando funcional: `node tests/test_cab_bt_parallel_selection_experimental.js`;
- estado atual: módulo presente, 74 relatórios completos, 244 subcasos exercidos, PASS e exit `0`;
- o caminho histórico `module_missing` permanece apenas como evidência do RED original; não é precondição atual;
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
  "classification": "PASS",
  "compliant": true,
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
  "classification": "PASS",
  "reports": 74,
  "expectedReports": 74,
  "scientificReports": 48,
  "technicalReports": 26,
  "compliant": 74,
  "nonCompliant": 0,
  "assertionsExercised": 74,
  "processExitCode": 0
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
| `UNI-02` | reconciliação histórica `20/11/9/11` |
| `UNI-03` | inventário matricial histórico das 11 válidas até 240 mm² |
| `UNI-04` | inventário matricial histórico das 9 rejeitadas até 240 mm² |
| `UNI-05` | candidatas antes omitidas presentes |
| `FRN-01` | fronteira histórica com 11 não dominadas |
| `FRN-02` | matriz do comparador dentro/fora da tolerância |
| `OBJ-01` | matriz dos quatro objetivos |
| `OBJ-02` | empate de `MIN_PARALLEL_COUNT` |
| `OBJ-03` | `MIN_TOTAL_COPPER` inicia em 3×120 |
| `OBJ-04` | `MAX_MINIMUM_MARGIN` histórico inicia em 4×240 |
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
| `TECH-23` | após entradas válidas, `NaN`/infinito produzido inesperadamente em L1–L3 → `NUMERIC_RESULT_NON_FINITE`, sem número parcial; entrada conhecida inválida é excluída deste contrato |
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

### 14.1 Backend GREEN histórico — não reaberto pela extensão

O motor está GREEN em `5411779a…`. A allowlist histórica foi:

```text
js/core_cabos_bt_parallel_selection_experimental.js
```

Na CAB-BT-PARALLEL-003, o Backend permanece fora do fluxo nominal. Proibido alterar L0, UI, testes, manifesto,
workflow, packages ou documentação científica sem divergência focal comprovada e nova O.S. O Backend não
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

### 14.3 UI focal somente depois da caracterização GREEN do core

Allowlist de Frontend:

```text
index.html
js/ui_render.js
```

A UI deve priorizar entradas que o usuário conhece e colocar hipóteses/catalogação em seção explícita de
laboratório, editável e confirmável. Deve mostrar todas as alternativas candidatas, especialmente frases
como `2 × 240 mm² por fase` e `3 × 150 mm² por fase`, com três critérios e dominante. Nenhuma variável é
inventada; falta de catálogo/hipótese bloqueia.

### 14.4 Regressão visual anterior — 15 relatórios

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

### 14.5 Protocolo focal de 300 mm² — autoridade sobre a extensão CAB-BT-PARALLEL-003

Os testes históricos de 74 relatórios core e 15 relatórios visuais continuam como regressão. A extensão é
exercida por dois arquivos novos e experimentais, fora do manifesto stable:

```text
tests/test_cab_bt_parallel_selection_300mm2_experimental.js
tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js
```

#### 14.5.1 Caracterização do core existente — 12 relatórios

O primeiro arquivo nasceu como caracterização do motor já integrado. Após a evidência original e a ratificação
das erratas nonfinite e de identidade do item, sua próxima revisão será o RED focal contratualmente válido: deve chamar
`enumerateCablingBTParallelAlternativesExperimental(input)` com o catálogo real de seis seções, sem stub,
mock, adaptador ou alteração do motor. Prefixos exatos:

```text
CAB_BT_PARALLEL_300_CORE_EXP_REPORT
CAB_BT_PARALLEL_300_CORE_EXP_SUMMARY
```

IDs exatos e únicos:

| ID | Contrato focal |
| --- | --- |
| `MM300-CORE-01` | item de 300 mm² coincide exatamente com os 11 campos e a impedância ratificada |
| `MM300-CORE-02` | universo completo: 24 avaliadas, 14 válidas, 10 rejeitadas e 14 não dominadas |
| `MM300-CORE-03` | `1×300` reprova somente por ampacidade |
| `MM300-CORE-04` | `2×300` é alternativa válida, sem autorização instalável |
| `MM300-CORE-05` | `3×300` é alternativa válida, sem autorização instalável |
| `MM300-CORE-06` | `4×300` é alternativa válida, sem autorização instalável |
| `MM300-CORE-07` | `NONE` inicia em 2×185 e não elege candidata |
| `MM300-CORE-08` | objetivos iniciam em 2×300, 3×120 e 4×300 nos modos respectivos |
| `MM300-CORE-09` | catálogo homogêneo produz zero `catalog_heterogeneous` e zero `CANDIDATE_STRUCTURE_INVALID` |
| `MM300-CORE-10` | distingue catálogo histórico válido sem 300, fixture focal sem linha 300, candidata incompleta e valores presentes inválidos |
| `MM300-CORE-11` | representação de impedância conflitante e metadado homogêneo divergente têm códigos/paths exatos |
| `MM300-CORE-12` | pureza, não mutação, determinismo, B-01…B-06 e guardrails produtivos permanecem íntegros |

A ausência de 300 mm² não é erro do core genérico. Um catálogo válido de cinco seções deve continuar
retornando sucesso histórico `20/11/9/11`. Já a fixture **focal** dos testes MM300/UI300 sem a linha de 300 é
erro de configuração do harness, detectado antes de chamar o motor e encerrado com exit `3`; não produz
relatório funcional falso. Quando a candidata 300 existe, campo ausente retorna `CANDIDATE_INCOMPLETE` no
caminho nominal do erro de catálogo. Escalar conhecido presente não finito/não numérico retorna
`CANDIDATE_VALUE_INVALID` com `invalidFields[]` exato; propriedade de impedância presente inválida retorna
`CANDIDATE_IMPEDANCE_VALUE_INVALID`. Impedância incompleta ou conflitante mantém os códigos e paths definidos
nas §§4.4 e 11. Nenhum desses valores pode alcançar L0 ou a matemática L1–L3.

Cada relatório possui schema fechado:

```json
{
  "id": "MM300-CORE-01",
  "category": "core_characterization_300mm2_experimental",
  "classification": "PASS",
  "compliant": true,
  "assertionExercised": true,
  "expected": {},
  "observed": {},
  "issues": []
}
```

Summary único:

```json
{
  "classification": "PASS",
  "reports": 12,
  "expectedReports": 12,
  "compliant": 12,
  "nonCompliant": 0,
  "assertionsExercised": 12,
  "processExitCode": 0
}
```

Prefixo e JSON ocupam uma única linha por relatório/summary. Exit `0` é PASS; `1` é
`FUNCTIONAL_FAILURE` com 12 relatórios completos; `2` é `INFRA_BLOCKED` antes das asserções; `3` é
`CONFIG_ERROR` por protocolo, fixture, schema, quantidade, ID ou summary inválido. Ausência de relatório ou
`assertionExercised=false` fora do bloqueio de infraestrutura nunca é GREEN. Uma divergência funcional
reproduzível neste teste retorna ao CTO; só então ele pode emitir O.S. de Backend focal.

#### 14.5.2 RED visual focal — 15 relatórios

O segundo arquivo deve falhar funcionalmente contra a UI de cinco seções e passar somente quando a UI
materializar o catálogo de seis seções sem recálculo. Prefixos exatos:

```text
CAB_BT_PARALLEL_300_UI_EXP_REPORT
CAB_BT_PARALLEL_300_UI_EXP_SUMMARY
```

IDs exatos e únicos:

| ID | Contrato visual focal |
| --- | --- |
| `UI300-01` | `<details data-advanced>` inicia fechado e contém seis linhas de catálogo |
| `UI300-02` | existem exatamente 42 campos editáveis do catálogo, sete por seção |
| `UI300-03` | as duas confirmações permanecem visíveis, habilitadas e fora do conteúdo recolhido |
| `UI300-04` | a linha 300 e os metadados DOM compartilhados formam, por igualdade profunda, o DTO completo ratificado |
| `UI300-05` | sete edições nominais da linha 300 alteram exclusivamente o path correspondente no DTO completo |
| `UI300-06` | nenhuma extrapolação, fórmula, fallback ou valor estático de recuperação existe na UI |
| `UI300-07` | envelope real projeta 24/14/10/14 e as alternativas 1×…4×300 com seus estados reais |
| `UI300-08` | `NONE` apresenta 2×185 primeiro sem eleger ou recomendar |
| `UI300-09` | `MIN_PARALLEL_COUNT` apresenta 2×300 primeiro |
| `UI300-10` | `MIN_TOTAL_COPPER` apresenta 3×120 primeiro |
| `UI300-11` | `MAX_MINIMUM_MARGIN` apresenta 4×300 primeiro |
| `UI300-12` | ausência, inválido, não finito, conflito e heterogeneidade são projetados fail-closed, sem números parciais |
| `UI300-13` | PT/EN/ES exibem 300 mm² e não vazam idioma nem vocabulário proibido |
| `UI300-14` | 375 px, temas claro/escuro, foco, labels, landmark e zero overflow permanecem conformes |
| `UI300-15` | impressão contém aviso, seis entradas, 300 mm², objetivos, critérios e “Instalação autorizada: NÃO” |

Schema fechado de relatório:

```json
{
  "id": "UI300-01",
  "category": "visual_300mm2_experimental",
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

Summary único:

```json
{
  "classification": "PASS",
  "reports": 15,
  "expectedReports": 15,
  "compliant": 15,
  "nonCompliant": 0,
  "assertionsExercised": 15,
  "processExitCode": 0,
  "preflightExitCode": 0,
  "preflightError": null,
  "functionalError": null
}
```

Exit `0/1/2/3` significa, respectivamente, `PASS`, `FUNCTIONAL_FAILURE`, `INFRA_BLOCKED` exclusivo do
preflight Chromium e `CONFIG_ERROR`. O processo emite exatamente 15 relatórios e um summary até no bloqueio
de preflight; nesse caso todos são `INFRA_BLOCKED` com `assertionExercised=false`. Erro após o preflight é
`CONFIG_ERROR`, nunca `INFRA_BLOCKED`. O coletor preserva stdout/stderr integrais.

#### 14.5.3 Comandos, ordem e evidência

Após ratificação e materialização deste SDD, o roteamento é:

```text
@Senior_QA_Security:
  node --check tests/test_cab_bt_parallel_selection_300mm2_experimental.js
  node tests/test_cab_bt_parallel_selection_300mm2_experimental.js
  node --check tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js
  node tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js

@Senior_Frontend_Dev, somente após RED visual funcional válido:
  alterar exclusivamente index.html e js/ui_render.js

@Senior_QA_Security, na candidata GREEN imutável:
  node tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js
  node tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js
  node tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js
  node tests/test_cab_bt_parallel_selection_300mm2_experimental.js
  node tests/test_cab_bt_parallel_selection_experimental.js
  node tests/test_cab_bt_parallel_experimental.js
  npm run test:regression
  git diff --check <baseline>...HEAD
```

Os três processos visuais locais devem ser independentes, 15/15 PASS e byte-equivalentes em conteúdo
funcional. Se o primeiro bloquear no Chromium, os outros dois não são executados sem nova autorização.
O GREEN remoto usa `qa-visual.yml`, `workflow_dispatch`, attempt 1, SHA imutável e input exato
`tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js`. O artifact é `qa-visual-evidence` e contém
`qa-visual-evidence.txt` UTF-8 com run ID, evento, attempt, branch, SHA, arquivo, Chromium, preflight, stdout,
stderr e exit. O QA registra ID, tamanho, digest GitHub e SHA-256 recalculado do ZIP. Depois executa uma única
vez o Regression Gate shadow na mesma SHA. Artifact ausente, truncado, ilegível ou divergente é
`CONFIG_ERROR`. Retry, rerun, aumento de timeout ou alteração de assertions exigem O.S. distinta.

#### 14.5.4 Contrato de UI

- O painel avançado inicia fechado e contém as seis linhas e os 42 controles editáveis do catálogo.
- Os sete controles editáveis de cada linha são exatamente `section_mm2`, `tabulatedAmpacity_A`,
  `resistance_ohm`, `reactance_ohm`, `referenceTemperature_C`, `material` e `provenance`.
- A representação enviada é exclusivamente `RESISTANCE_REACTANCE_PAIR`: cada candidata contém
  `resistance_ohm` e `reactance_ohm` e omite fisicamente `impedance_ohm`. Enviar ambas as representações é
  proibido e deve falhar antes de qualquer apresentação numérica.
- Os cinco escalares não editáveis por linha residem em metadados compartilhados, somente leitura, dentro do
  DOM do painel avançado: `[data-catalog-shared-metadata] [data-meta="insulation"]`,
  `[data-meta="installationMethod"]`, `[data-meta="units"]`, `[data-meta="source"]` e
  `[data-meta="entrySourceVersion"]`. Seus `data-value` são, respectivamente, `LAB_UNSPECIFIED`,
  `LAB_UNSPECIFIED`, `SI`, `LAB_CATALOG` e `PRELIM-1`. A UI os lê do DOM; não os recupera de constantes JS.
- `catalog.sourceVersion` vem exclusivamente do elemento DOM somente leitura
  `[data-catalog-metadata] [data-meta="catalogSourceVersion"]`, cujo `data-value` é a SHA completa
  `122b885db40f69b422dac8ea4c2e419dc547220f`. O mesmo bloco fornece `catalog.source`, `catalog.mode`,
  `catalog.provenance` e a base de impedância; nenhum deles é inferido da candidata.
- O DTO de cada candidata possui exatamente os dez escalares do §4.4 e somente o par R+X. `UI300-04` faz
  igualdade profunda do DTO completo da linha 300; `UI300-05` altera cada um dos sete campos editáveis e
  exige que apenas o path correspondente mude, mantendo os cinco metadados compartilhados e a omissão de
  `impedance_ohm`.
- As duas confirmações ratificadas permanecem visíveis e habilitadas na visão principal; movê-las para o
  conteúdo fechado exige revisão coordenada do oráculo visual.
- `catalog.candidates` é construído exclusivamente do DOM. Campo ausente/vazio/inválido permanece inválido;
  catálogo ausente vira coleção vazia; não há recuperação por fixture ou constante.
- A UI chama o motor real uma única vez, projeta o envelope recebido e não calcula ampacidade, impedância,
  critérios, fronteira, margem ou objetivos.
- No sucesso e no erro, aviso, `productionAllowed`, `installableSelection`, `installationAuthorized`, fonte,
  assumptions, blockers e códigos são projetados dos caminhos reais. Falha da camada visual permanece em
  `uiFailure`, sem inventar `error.code` de domínio.

#### 14.5.5 Matrizes vinculantes e oráculo fechado

Todo relatório matricial contém `observed.cases[]` com quantidade e IDs exatos. Cada item é objeto fechado com
estas propriedades, sem extras:

```json
{
  "caseId": "MM300-CORE-08-CASE-01",
  "assertionExercised": true,
  "compliant": true,
  "expected": { "paths": {} },
  "observed": { "paths": {} },
  "issues": []
}
```

O harness compara os paths nominais por igualdade profunda. Busca recursiva por valor, texto, código ou
fragmento — inclusive `recursivelyContains`, `recursivelyContainsAll`, regex global do envelope ou
`JSON.stringify(...).includes(...)` — é proibida para decidir conformidade. Caminhos felizes exigem também
asserções negativas de ausência dos códigos de erro, de `recommended`, `selected`, `installationAuthorized`
verdadeiro e de `productionAllowed` verdadeiro.

Matrizes core:

| Relatório | Casos exatos | Paths/resultado vinculante |
| --- | --- | --- |
| `MM300-CORE-08` | 4: `...-01` NONE; `...-02` MIN_PARALLEL_COUNT; `...-03` MIN_TOTAL_COPPER; `...-04` MAX_MINIMUM_MARGIN | `result.data.firstInPresentationOrder.{nParallel,section_mm2}` = `{2,185}`, `{2,300}`, `{3,120}`, `{4,300}`; `result.data.installableSelection=null`; `result.data.installationAuthorized=false` |
| `MM300-CORE-10` | 4: `...-01` catálogo histórico; `...-02` 300 sem ampacidade; `...-03` ampacidade 300=`NaN`; `...-04` `resistance_ohm` 300=`Infinity` | quatro subcontratos nominais abaixo; casos 02–04 usam catálogo somente com 300 e exigem `result.error.code="CATALOG_NO_EVALUABLE_CANDIDATE"` |
| `MM300-CORE-11` | 2: `...-01` coexistência de representações; `...-02` material heterogêneo | caso 01, catálogo somente com 300: `result.error.params.errors[0].code="CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT"`; caso 02, `maxParallelCount=1`, catálogo 95+300: `result.data.evaluatedCandidates[1].candidateId="1x300"`, `blockers[0].code="CANDIDATE_STRUCTURE_INVALID"`, `blockers[0].params.reason="catalog_heterogeneous"`; zero alternativa 300 válida |
| `MM300-CORE-12` | 4: `...-01` pureza; `...-02` determinismo; `...-03` guardrails; `...-04` campos proibidos | clone profundo da entrada permanece idêntico; duas saídas são profundamente iguais; `result.productionAllowed=false`, `result.data.installableSelection=null`, `result.data.installationAuthorized=false`; `result.blockers[0].code="B-01"`, `result.blockers[1].code="B-02"`, `result.blockers[2].code="B-03"`, `result.blockers[3].code="B-04"`, `result.blockers[4].code="B-05"`, `result.blockers[5].code="B-06"`; `recommended`, `selected` e `finalSizing` ausentes nos paths de topo e das candidatas |

Subcontratos fechados de `MM300-CORE-10`:

1. `MM300-CORE-10-CASE-01`: `result.ok=true`; comprimentos exatos de
   `result.data.evaluatedCandidates`, `candidateAlternatives`, `rejectedCandidates` e
   `nonDominatedAlternatives` iguais a `20`, `11`, `9` e `11`.
2. `MM300-CORE-10-CASE-02`: `result.error.params.errors[0].code="CANDIDATE_INCOMPLETE"` e
   `result.error.params.errors[0].missingFields[0]="tabulatedAmpacity_A"`.
3. `MM300-CORE-10-CASE-03`: `result.error.params.errors[0]` profundamente igual, sem propriedades
   adicionais, a
   `{code:"CANDIDATE_VALUE_INVALID",catalogEntryId:"section-300",catalogEntryIndex:0,invalidFields:[{path:"tabulatedAmpacity_A",reason:"NON_FINITE",observedType:"number:NaN"}],mode:"CATALOGO_LAB_ASSUMPTION_ONLY"}`.
4. `MM300-CORE-10-CASE-04`:
   `result.error.params.errors[0]` profundamente igual, sem propriedades adicionais, a
   `{code:"CANDIDATE_IMPEDANCE_VALUE_INVALID",catalogEntryId:"section-300",invalidFields:[{path:"resistance_ohm",reason:"NON_FINITE",observedType:"number:+Infinity"}],mode:"CATALOGO_LAB_ASSUMPTION_ONLY"}`.
   `candidateId` e `catalogEntryIndex` são nominalmente ausentes.

Nos casos 03 e 04, `errors[0]` obedece ao schema fechado e nenhum número utilizável alcança L0/L1–L3.

A correção do oráculo focal pelo QA é restrita a essas expectativas de CASE-03 e CASE-04; IDs, fixtures,
quantidades, schemas, caminhos e demais valores permanecem congelados. Após a correção, CASE-04 deve ficar
PASS sem alteração de Backend, pois a candidata já emite `number:+Infinity`. CASE-03 deve permanecer RED,
exigindo `CANDIDATE_VALUE_INVALID/number:NaN` e demonstrando que a validação tardia atual ainda permite que
`tabulatedAmpacity_A=NaN` alcance `minimumMargin`. Qualquer alteração adicional do teste exige nova O.S.

Antes de emitir qualquer relatório core focal, o harness valida que sua fixture nominal contém exatamente seis
seções e uma única `section_mm2=300`. Zero ou múltiplas linhas 300, metadado diferente ou contagem diferente
encerra com `CONFIG_ERROR`, exit `3`, sem chamar o motor. Isso não altera o fato de que um consumidor genérico
pode enviar catálogo válido de cinco seções e obter sucesso histórico.

No teste visual, a ausência da linha 300 na página é divergência funcional nominal de `UI300-01` e produz o
RED esperado contra a UI anterior. Já a ausência da candidata 300 na fixture interna do próprio harness é
`CONFIG_ERROR`/exit `3`. Assim, falha do produto e defeito do oráculo não são confundidos.

Matrizes visuais:

| Relatório | Casos exatos | Paths/resultado vinculante |
| --- | --- | --- |
| `UI300-05` | 7: `...-01` seção; `...-02` ampacidade; `...-03` R; `...-04` X; `...-05` temperatura; `...-06` material; `...-07` proveniência | em cada caso, somente `capturedInput.catalog.candidates[5].<path>` muda para o valor injetado; os demais paths mantêm igualdade profunda com a fixture; `impedance_ohm` permanece ausente; os cinco metadados compartilhados e `catalog.sourceVersion` permanecem exatos |
| `UI300-12` | 5: `...-01` ampacidade ausente; `...-02` ampacidade não finita; `...-03` R não finita; `...-04` conflito estrutural; `...-05` material heterogêneo | casos 01–03 e 05 alteram o DOM, capturam o DTO exato e exigem `engineResult.data.evaluatedCandidates[5].candidateId="1x300"`; nesse mesmo item, `blockers[0].{code,params.reason}` = `CANDIDATE_STRUCTURE_INVALID/candidate_incomplete`, `CANDIDATE_STRUCTURE_INVALID/candidate_value_invalid`, `CANDIDATE_STRUCTURE_INVALID/candidate_value_invalid`, `CANDIDATE_STRUCTURE_INVALID/catalog_heterogeneous`; caso 04 usa o motor real sobre clone focal cujo catálogo contém somente a linha 300 capturada acrescida de `impedance_ohm` e exige `engineResult.error.params.errors[0].code="CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT"`; a UI projeta o envelope real sem cards ou números parciais |
| `UI300-13` | 3: `...-01` PT; `...-02` EN; `...-03` ES | `document.documentElement.lang`, rótulo 300 mm², aviso literal e listas nominais de termos proibidos são verificados por idioma; zero vazamento cruzado |
| `UI300-14` | 4: `...-01` 375 claro; `...-02` 375 escuro; `...-03` acessibilidade desktop; `...-04` teclado/foco | `document.documentElement.scrollWidth<=clientWidth`, zero elemento recortado, seis linhas após abrir o painel, labels associados, landmark único, ordem DOM, tabulação e estilo de foco visível nos paths/elementos nominais |

`UI300-13` reutiliza nominalmente a lista histórica, congelada abaixo após normalização NFD, remoção de marcas
diacríticas, lowercase e compactação de espaços:

| Idioma | Chave | Padrão proibido exato |
| --- | --- | --- |
| PT | `recommended` | `\brecomendad[oa]\b` |
| PT | `selected` | `\bselecionad[oa]\b` |
| PT | `final_solution` | `solucao final` |
| PT | `iec_conformity` | `conforme iec` |
| PT | `productive_release` | `liberad[oa] para (?:projeto|compra|instalacao)` |
| EN | `recommended` | `\brecommended\b` |
| EN | `selected` | `\bselected\b` |
| EN | `final_solution` | `final solution` |
| EN | `iec_conformity` | `iec (?:compliant|conformant)` |
| EN | `productive_release` | `(?:released|approved) for (?:design|purchase|installation)` |
| ES | `recommended` | `\brecomendad[oa]\b` |
| ES | `selected` | `\bseleccionad[oa]\b` |
| ES | `final_solution` | `solucion final` |
| ES | `iec_conformity` | `conforme con iec` |
| ES | `productive_release` | `(?:liberad[oa]|aprobad[oa]) para (?:proyecto|compra|instalacion)` |

Os quinze padrões devem ser compilados individualmente; padrão ausente, extra ou alterado é
`CONFIG_ERROR`, não PASS funcional.

No caso `UI300-12-CASE-04`, o envelope não é mock: ele é produzido pelo motor real com fault injection
explicitamente registrada em `observed.faultInjection`. O harness não altera código de produção. Em todos os
demais casos, a chamada ocorre pelo fluxo real da página.

Para cada matriz acima, ausência, duplicidade, `caseId` extra, ordem divergente, path não exercido,
`assertionExercised=false`, schema incompleto ou summary incompatível torna a execução inteira
`CONFIG_ERROR`/exit `3`. Um relatório agregado não pode passar por maioria; todos os seus casos precisam estar
conformes.

### 14.6 Protocolo focal CAB-BT-PARALLEL-004

Esta seção tem autoridade sobre a implementação da política `MINIMUM_PASSING_PER_SECTION` e da localização
integral. Os testes são experimentais e permanecem fora de `qa/test-manifest.json`.

#### 14.6.1 RED core — 16 relatórios e 134 casos

Arquivo exclusivo inicial:

```text
tests/test_cab_bt_parallel_selection_minimum_per_section_experimental.js
```

Prefixos exatos:

```text
CAB_BT_PARALLEL_MINIMUM_PER_SECTION_EXP_REPORT
CAB_BT_PARALLEL_MINIMUM_PER_SECTION_EXP_SUMMARY
```

IDs exatos `MPS-CORE-01`…`MPS-CORE-16`, sem lacunas ou duplicidades:

| ID | Casos | Contrato |
| --- | ---: | --- |
| `MPS-CORE-01` | 2 | política omitida e `null` preservam envelope histórico sem campos CAB-004 |
| `MPS-CORE-02` | 5 | tipo, propriedade extra, modo, confirmação e proveniência inválidos retornam `PRESENTATION_POLICY_INVALID` exato |
| `MPS-CORE-03` | 2 | default 10 produz `rawCount=60`; limite 7 produz `rawCount=42` |
| `MPS-CORE-04` | 6 | default 10 contém exatamente `10x95`, `8x120`, `7x150`, `6x185`, `6x240`, `5x300` por seção |
| `MPS-CORE-05` | 6 | limite 7 contém ausências 95/120 e mínimas `7x150`, `6x185`, `6x240`, `5x300` |
| `MPS-CORE-06` | 4 | `4x300` rejeitada; `5x300`, `6x300`, `7x300` válidas; somente `5x300` visível |
| `MPS-CORE-07` | 60 | enumeração integral default: IDs canônicos e `l0CallCount=1` em cada combinação avaliável; zero parada antecipada |
| `MPS-CORE-08` | 4 | quatro ordens completas do default 10, profundamente iguais à §8.2 |
| `MPS-CORE-09` | 4 | quatro ordens completas do limite 7, conforme pacote científico |
| `MPS-CORE-10` | 18 | `hiddenCandidateIds` default exatos, canônicos e ainda presentes em `candidateAlternatives` |
| `MPS-CORE-11` | 4 | limite 7 oculta exatamente `7x185`, `7x240`, `6x300`, `7x300` |
| `MPS-CORE-12` | 2 | `nCircuits=1` e `3` não alteram universo, IDs nem escolha mínima por seção |
| `MPS-CORE-13` | 4 | pureza, determinismo, arrays brutos e fronteira permanecem íntegros |
| `MPS-CORE-14` | 3 | schemas fechados da projeção, sucesso CAB-004 e ausência física dos campos no legado |
| `MPS-CORE-15` | 6 | listas visible/hidden são disjuntas, completas e reconciliadas por seção |
| `MPS-CORE-16` | 4 | todos os objetivos preservam `productionAllowed=false`, `installableSelection=null`, `installationAuthorized=false` e B-01…B-06 |

Total exato: `16` relatórios e `134` `caseId`. Em cada linha da tabela, os IDs são nominalmente
`MPS-CORE-NN-CASE-01` até `MPS-CORE-NN-CASE-CC`, onde `CC` é a contagem exata daquela linha, sempre com dois
dígitos. Em `MPS-CORE-07`, `01…60` mapeia `nParallel` ascendente e, dentro dele, `section_mm2` ascendente.
Cada caso contém exatamente `caseId`, `expected`, `observed`, `assertionExercised` e `compliant`, sem propriedade
adicional. Ausência, duplicidade, ordem divergente ou caso extra classifica toda a execução como
`CONFIG_ERROR`.

Schema fechado de relatório:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "id", "category", "classification", "compliant", "assertionExercised",
    "expected", "observed", "issues"
  ],
  "properties": {
    "id": { "pattern": "^MPS-CORE-(0[1-9]|1[0-6])$" },
    "category": { "const": "minimum_per_section_core_experimental" },
    "classification": { "enum": ["PASS", "FUNCTIONAL_FAILURE", "CONFIG_ERROR"] },
    "compliant": { "type": "boolean" },
    "assertionExercised": { "type": "boolean" },
    "expected": { "type": "object" },
    "observed": {
      "type": "object",
      "additionalProperties": false,
      "required": ["cases"],
      "properties": {
        "cases": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["caseId", "expected", "observed", "assertionExercised", "compliant"],
            "properties": {
              "caseId": { "type": "string" },
              "expected": {},
              "observed": {},
              "assertionExercised": { "type": "boolean" },
              "compliant": { "type": "boolean" }
            }
          }
        }
      }
    },
    "issues": { "type": "array" }
  }
}
```

Summary fechado:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "classification", "reports", "expectedReports", "cases", "expectedCases",
    "compliant", "nonCompliant", "assertionsExercised", "caseAssertionsExercised",
    "processExitCode"
  ],
  "properties": {
    "classification": { "enum": ["PASS", "FUNCTIONAL_FAILURE", "CONFIG_ERROR"] },
    "reports": { "type": "integer", "minimum": 0, "maximum": 16 },
    "expectedReports": { "const": 16 },
    "cases": { "type": "integer", "minimum": 0, "maximum": 134 },
    "expectedCases": { "const": 134 },
    "compliant": { "type": "integer", "minimum": 0, "maximum": 16 },
    "nonCompliant": { "type": "integer", "minimum": 0, "maximum": 16 },
    "assertionsExercised": { "type": "integer", "minimum": 0, "maximum": 16 },
    "caseAssertionsExercised": { "type": "integer", "minimum": 0, "maximum": 134 },
    "processExitCode": { "enum": [0, 1, 3] }
  },
  "allOf": [
    {
      "if": { "properties": { "classification": { "const": "PASS" } } },
      "then": {
        "properties": {
          "reports": { "const": 16 },
          "cases": { "const": 134 },
          "compliant": { "const": 16 },
          "nonCompliant": { "const": 0 },
          "assertionsExercised": { "const": 16 },
          "caseAssertionsExercised": { "const": 134 },
          "processExitCode": { "const": 0 }
        }
      }
    },
    {
      "if": { "properties": { "classification": { "const": "FUNCTIONAL_FAILURE" } } },
      "then": {
        "properties": {
          "reports": { "const": 16 },
          "cases": { "const": 134 },
          "nonCompliant": { "type": "integer", "minimum": 1, "maximum": 16 },
          "assertionsExercised": { "const": 16 },
          "caseAssertionsExercised": { "const": 134 },
          "processExitCode": { "const": 1 }
        }
      }
    },
    {
      "if": { "properties": { "classification": { "const": "CONFIG_ERROR" } } },
      "then": { "properties": { "processExitCode": { "const": 3 } } }
    }
  ]
}
```

`expectedReports=16` e `expectedCases=134` são invariáveis; `reports`, `cases`, `assertionsExercised` e
`caseAssertionsExercised` são contagens **observadas e factuais**. `compliant + nonCompliant = reports`.
`PASS` exige protocolo integral `16/134`, assertions `16/134`, `16/0` e exit `0`. `FUNCTIONAL_FAILURE` exige o
mesmo protocolo integral, ao menos um não conforme e exit `1`. Relatório/caso ausente ou extra, duplicidade,
execução parcial, assertion não exercida, schema inválido ou summary divergente produz `CONFIG_ERROR`/exit `3`;
nesse estado o summary registra as contagens realmente emitidas/exercidas e nunca inventa `16/134`. Se uma
barreira externa capturar exceção antes de qualquer relatório, registra `reports=0`, `cases=0`, assertions
`0/0`, `compliant=0` e `nonCompliant=0`, mantendo os dois expected invariáveis.

O RED contra o core `71e3f78a…` deve ser `FUNCTIONAL_FAILURE`/exit `1` porque a política ainda não existe;
todos os relatórios e casos precisam ser emitidos e exercidos. `module_missing` não é o RED esperado. A
quantidade exata de relatórios conformes no RED é observada, não presumida pelo SDD.

#### 14.6.2 RED visual — 15 relatórios e 87 casos

Arquivo exclusivo inicial:

```text
tests/test_cab_bt_parallel_selection_minimum_per_section_ui_experimental.js
```

Prefixos:

```text
CAB_BT_PARALLEL_MINIMUM_PER_SECTION_UI_EXP_REPORT
CAB_BT_PARALLEL_MINIMUM_PER_SECTION_UI_EXP_SUMMARY
```

| ID | Casos | Contrato |
| --- | ---: | --- |
| `MPS-UI-01` | 1 | controle inicia em 10 e possui `min=1`, `max=10`, `step=1` |
| `MPS-UI-02` | 1 | DTO envia política fechada e cada cálculo chama o core real exatamente uma vez |
| `MPS-UI-03` | 6 | default mostra exatamente uma candidata por seção |
| `MPS-UI-04` | 4 | quatro objetivos reproduzem as ordens completas do default 10 |
| `MPS-UI-05` | 4 | ao reduzir para 7, mostra `7x150`, `6x185`, `6x240`, `5x300` |
| `MPS-UI-06` | 2 | `6x300`/`7x300` ausentes dos cards e presentes no envelope bruto capturado |
| `MPS-UI-07` | 6 | ausências 95/120 localizadas com `N=7` em PT/EN/ES |
| `MPS-UI-08` | 33 | onze grupos por igualdade UTF-8 integral nos três idiomas |
| `MPS-UI-09` | 6 | seis relações idioma ativo × idioma incorreto usam listas fechadas |
| `MPS-UI-10` | 6 | cognatos ES válidos, acento removido, tradução parcial e separação NFD |
| `MPS-UI-11` | 2 | EN/ES validam nominalmente o aviso permanente e o aviso projetado no resultado |
| `MPS-UI-12` | 3 | impressão PT/EN/ES usa cards filtrados, ausências, aviso e rótulo localizados |
| `MPS-UI-13` | 5 | vazio, fração, zero, negativo e 11 bloqueiam antes do core, sem números parciais |
| `MPS-UI-14` | 4 | 375 px claro/escuro, acessibilidade e foco permanecem conformes com catálogo visível |
| `MPS-UI-15` | 4 | guardrails, códigos invariantes e vocabulário não instalável permanecem íntegros |

Oráculo autossuficiente de `MPS-UI-11`:

| caseId | Idioma ativo | Paths exatos | Valor PT proibido exato | Valor esperado em ambos os paths |
| --- | --- | --- | --- | --- |
| `MPS-UI-11-CASE-01` | `en` e `document.documentElement.lang="en"` | `#cbpsx-notice.textContent` e `[data-cab-bt-parallel-display-notice].textContent` | `PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.` | `PRELIMINARY — DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION.` |
| `MPS-UI-11-CASE-02` | `es` e `document.documentElement.lang="es"` | `#cbpsx-notice.textContent` e `[data-cab-bt-parallel-display-notice].textContent` | `PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.` | `PRELIMINAR — NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN.` |

Cada caso exige existência e visibilidade dos dois nós, igualdade UTF-8 integral do `textContent` normalizado
somente por `trim()`, e rejeição do valor PT completo. Além da igualdade nominal, `en` aplica exclusivamente
`forbiddenExpressionsByLanguage.en.pt = P` e `es` aplica exclusivamente
`forbiddenExpressionsByLanguage.es.pt = P`, conforme §9.4. Não há busca por “qualquer texto português”,
idioma inferido, tradução parcial, substring como substituta da igualdade, NFD ou aproximação semântica.
O atributo `data-cab-bt-parallel-display-notice` é obrigatório na projeção visual do `displayNotice`; não altera
o envelope nem o valor bruto do core.

Total exato: `15` relatórios, IDs `MPS-UI-01…15`, e `87` casos únicos. Cada linha usa IDs nominais
`MPS-UI-NN-CASE-01…CC`, com a mesma regra fechada da §14.6.1. Cada relatório contém exatamente `id`,
`category`, `classification`, `compliant`, `assertionExercised`, `expected`, `observed`, `telemetry` e `issues`.
`category` é `minimum_per_section_ui_experimental`; `observed` contém exclusivamente `cases`; `telemetry`
contém exclusivamente os quatro campos abaixo:

```json
{
  "id": "MPS-UI-01",
  "category": "minimum_per_section_ui_experimental",
  "classification": "FUNCTIONAL_FAILURE",
  "compliant": false,
  "assertionExercised": true,
  "expected": {},
  "observed": { "cases": [] },
  "telemetry": {
    "pageLoaded": true,
    "consoleErrors": [],
    "pageErrors": [],
    "invalidTokens": []
  },
  "issues": []
}
```

O summary contém exatamente `classification`, `reports`, `expectedReports`, `cases`, `expectedCases`,
`compliant`, `nonCompliant`, `assertionsExercised`, `caseAssertionsExercised`, `processExitCode`,
`preflightExitCode`, `preflightError` e `functionalError`. `expectedReports=15` e `expectedCases=87` são
invariáveis; as outras contagens são factuais. Em `PASS`, `reports/cases=15/87`, os exits são `0`, as assertions
são `15/87`, `compliant/nonCompliant=15/0` e os dois erros são `null`. Em `FUNCTIONAL_FAILURE`, o mesmo
protocolo integral é obrigatório, preflight `0`, processo `1` e ao menos um relatório é não conforme. Em
`INFRA_BLOCKED`, existem `15` relatórios bloqueados, exits `2`, assertions `0/0` e somente `preflightError` é
não nulo. Qualquer outra quebra é `CONFIG_ERROR`/exit `3`, com contagens observadas sem preenchimento fictício.

#### 14.6.3 Correção de fixtures históricas

Os testes visuais existentes continuam regressão, mas seus cenários CAB-003 devem fixar explicitamente
`maxParallelCount=4` antes de calcular:

```text
tests/test_cab_bt_parallel_selection_ui_experimental.js
tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js
```

Essa correção não muda IDs, expectativas, contagens ou assertions históricas; apenas remove a dependência do
novo default visual `10`. Alterar tops, relaxar asserts ou aceitar `4` e `10` simultaneamente é proibido.

#### 14.6.4 Oráculo exato e proibições

- toda verificação usa paths nominais e igualdade profunda;
- `recursivelyContains`, busca por substring de IDs, “algum card semelhante” e maioria são proibidos;
- o core RED chama a função real; o visual carrega a página real e captura a chamada real;
- nenhum mock/stub substitui L0, L1–L3, DOM ou envelope;
- `candidateAlternatives.length` prova o bruto; `presentationProjection` prova o filtro;
- UI não pode calcular `arg min`, margem, cobre ou comparadores;
- cards, ausências e impressão devem vir dos paths do envelope CAB-004;
- valores localizados são comparados em UTF-8 integral; NFD somente no oráculo histórico proibido.

#### 14.6.5 Comandos, exits e evidência remota

Ordem mínima:

```text
node --check tests/test_cab_bt_parallel_selection_minimum_per_section_experimental.js
node tests/test_cab_bt_parallel_selection_minimum_per_section_experimental.js
node tests/test_cab_bt_parallel_selection_experimental.js
node tests/test_cab_bt_parallel_selection_300mm2_experimental.js
node tests/test_cab_bt_parallel_experimental.js
node --check tests/test_cab_bt_parallel_selection_minimum_per_section_ui_experimental.js
node tests/test_cab_bt_parallel_selection_minimum_per_section_ui_experimental.js
node tests/test_cab_bt_parallel_selection_ui_experimental.js
node tests/test_cab_bt_parallel_selection_300mm2_ui_experimental.js
npm.cmd run test:regression
```

GREEN independente exige três processos do core focal e três do visual focal, stdout byte-idêntico em cada
grupo, regressões históricas integrais e shadow Gate remoto na mesma SHA.

| Exit | Classificação |
| --- | --- |
| `0` | todos os relatórios/casos conformes, assertions exercidas e summary reconciliado |
| `1` | `FUNCTIONAL_FAILURE` processável com protocolo completo |
| `2` | `INFRA_BLOCKED` exclusivamente quando Chromium falha antes das assertions |
| `3` | `CONFIG_ERROR`: integridade, schema, contagem, caso, summary, execução parcial ou harness inválido |

O visual remoto usa `qa-visual.yml`, `workflow_dispatch`, attempt `1`, SHA imutável e artifact
`qa-visual-evidence`. O shadow usa `regression-gate-shadow.yml`. QA registra run, job, branch, SHA, exits,
versão Chromium, artifact ID/tamanho, digest GitHub, SHA-256 recalculado do ZIP e SHA-256 do TXT extraído.
Nenhum retry/rerun ocorre sem O.S. distinta.

#### 14.6.6 Sequência vinculante

1. auditoria e commit deste SDD;
2. QA corrige somente as duas fixtures históricas e produz o RED core CAB-004;
3. Backend implementa a projeção no L1–L3, sem alterar L0;
4. QA independente comprova GREEN core;
5. QA produz RED visual CAB-004;
6. Frontend altera somente `index.html`/`js/ui_render.js`, sem regra científica;
7. QA independente local/remoto executa focal, históricos e stable;
8. DevOps/SRE serve prévia na SHA imutável;
9. CEO retesta os três ajustes visuais;
10. PR e merge continuam dependentes de autorização humana posterior.

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
`2 × 300 mm² por fase`, utilizando catálogo e hipóteses explicitamente confirmados.

> PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.

O recurso não declara conformidade IEC, não seleciona solução instalável e permanece
`productionAllowed=false` enquanto a fonte normativa integral e os bloqueios B-01…B-06 estiverem abertos.
```

## 17. Registro Mestre — atualização futura

Entrada prevista:

| Campo | Valor |
| --- | --- |
| ID | `CAB-BT-PARALLEL-004` |
| Classe | `CHG-3 científica experimental` |
| Domínio | apresentação mínima válida por seção, localização integral PT/EN/ES e default de dez cabos por fase |
| Ciência | `b58254bf8ecffcaa4825d2c3225977c30eb01174` |
| Estado atual | `SDD_CANDIDATO_PARA_AUDITORIA` |
| Estado produtivo | `BLOQUEADO`, `productionAllowed=false` |
| Base executável | core 300 mm² `71e3f78a…`; UI 300 mm² e correção de foco `27186bb5…` |
| Teste novo | RED core focal com 16 relatórios/134 casos e RED visual focal com 15 relatórios/87 casos; ambos experimentais |
| Regressões preservadas | core histórico 74/244, core 300 mm² 12/14, L0 40/40, visual histórico 15/15 e stable Gate |
| TESTE DO CEO | `SIM`; estado recebido `APROVADO_COM_AJUSTES_VISUAIS_FOCAIS`, reteste após GREEN remoto CAB-004 |
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
| RED core CAB-004 e correção das duas fixtures históricas | Senior QA-Security | QA | CTO |
| GREEN core da projeção mínima por seção | Senior Backend Dev | sem veredito | CTO |
| GREEN core independente | Senior QA-Security | QA | CTO |
| RED visual CAB-004 | Senior QA-Security | QA | CTO |
| GREEN UI de localização/default/apresentação | Senior Frontend Dev | sem veredito | CTO |
| QA independente/remoto | Senior QA-Security | QA | CTO |
| Teste manual | CEO | CEO | CTO |
| Merge | CEO | CEO | CTO |
| Pós-merge/sincronização | Engenheiro DevOps/SRE | evidência operacional | CTO |

Não existe handoff direto entre executores. O CTO roteia cada etapa; QA não implementa e Fábrica não julga.

## 19. Decisão de aceite

**TESTE DO CEO: SIM.** O aceite anterior está registrado como
`APROVADO_COM_AJUSTES_VISUAIS_FOCAIS`; o reteste de encerramento só é liberado após:

1. GREEN independente do core CAB-004, incluindo 16/16 relatórios e 134/134 casos;
2. GREEN independente e remoto dos 15 contratos visuais CAB-004 na mesma SHA candidata;
3. regressões históricas, focal 300 mm², L0 e stable integralmente verdes;
4. prévia estável servida pelo DevOps/SRE na SHA imutável.

Cenário mínimo esperado pelo CEO:

- iniciar com `maxParallelCount=10`, podendo reduzi-lo no intervalo inteiro `1…10`;
- informar `I_b=1800 A`, `400 V`, limite de queda `3%`, reduzir o máximo para `7` e confirmar catálogo/hipóteses;
- visualizar exatamente uma alternativa mínima válida por seção: `7×150`, `6×185`, `6×240` e `5×300`;
- não visualizar `6×300`, `7×300`, `7×185` ou `7×240`, embora essas candidatas permaneçam no universo bruto;
- alternar os quatro objetivos e confirmar que eles apenas reordenam o mesmo conjunto filtrado;
- alternar PT/EN/ES e confirmar os onze grupos traduzidos, sem texto fixo em português e sem falso positivo para
  `Bloqueadores`, `Entradas confirmadas` e `PRELIMINAR` em espanhol;
- identificar critérios, dominante, hipóteses e a tradução ativa de “Instalação autorizada: NÃO”;
- não encontrar “recomendado”, “selecionado”, seleção instalável ou declaração IEC.

O aceite valida clareza e utilidade experimental; não remove nenhum bloqueio produtivo.

## 20. Ciclo de vida e encerramento

Estado atual recebido e preservado:

- core L1–L3 com seção de 300 mm² e validação nonfinite está GREEN em `71e3f78a5160203c524d3ae3ff5cee0ae0c7f017`;
- UI de 300 mm², localização precedente e correção de foco OS044R está GREEN em
  `27186bb595c0f0719809303ccb72c0f9ef684700`;
- a validação remota cumulativa dessa UI passou nos runs `31313774728`, `31313846258` e `31313907711`;
- o CEO aprovou a prévia e solicitou três ajustes focais: eliminar textos PT fixos, traduzir a apresentação de
  saída e mostrar somente o menor `nParallel` válido por seção, com default `10`;
- a ciência CAB-004 que fecha esses ajustes está publicada em
  `b58254bf8ecffcaa4825d2c3225977c30eb01174`;
- este SDD CAB-004 está materializado somente no worktree documental, permanece candidato e não commitado;
- ainda não existem RED CAB-004, implementação Backend CAB-004, GREEN Frontend CAB-004, PR ou merge.

Sequência vinculante após auditoria e commit documental: QA produz o RED core e corrige somente as duas
fixtures históricas identificadas → Backend implementa exclusivamente a projeção CAB-004 no L1–L3 → QA GREEN
independente do core → QA produz RED visual → Frontend implementa localização/default/apresentação sem fórmula
científica → QA independente local/remoto na mesma SHA → DevOps/SRE serve nova prévia → CEO executa o reteste
de encerramento. A PR #40 continua **DO NOT MERGE**. Após futura integração:

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
- [x] Regressão histórica de 74 relatórios core e 15 relatórios visuais preservada.
- [x] Caracterização focal core de 12 relatórios e RED visual focal de 15 relatórios definidos.
- [x] `CANDIDATE_VALUE_INVALID` separado de `CANDIDATE_IMPEDANCE_VALUE_INVALID`, com schemas e ordens fechados.
- [x] `provenance` não-string e string fora do domínio separados por `NOT_STRING`/`NOT_ASSUMPTION_ONLY`.
- [x] Issue de impedância fechada em `{code,catalogEntryId,invalidFields,mode}`, sem índices de candidata/catálogo.
- [x] `catalogEntryId="section-300"` reconciliado nos schemas e nos oráculos CASE-03/04.
- [x] Seção ausente/inválida preserva `catalogEntryId="catalog-entry-${index}"`; `candidateId` permanece distinto.
- [x] Taxonomia `number:NaN`/`number:+Infinity`/`number:-Infinity` e precedência da errata `dc37b9c…` incorporadas.
- [x] Caracterização original preservada como evidência não congelada; correção focal do oráculo precede Backend.
- [x] Catálogo de seis seções, 42 campos UI e objetivos com 300 mm² especificados.
- [x] `presentationPolicy` opcional preserva fisicamente o contrato histórico quando ausente.
- [x] Sucesso discriminado fecha `data`, `presentationProjection`, seus itens e as duas formas de `presentationModel`.
- [x] Enumeração bruta até dez cabos por fase separada da projeção mínima válida por seção.
- [x] Contagens `60/6` no default e `42/4` na fixture do CEO reconciliadas.
- [x] Quatro ordenações CAB-004 fechadas e incapazes de reintroduzir candidatas ocultas.
- [x] Onze grupos PT/EN/ES fechados em UTF-8 integral, com listas de vazamento e cognatos legítimos.
- [x] NFD restrito ao oráculo histórico de vocabulário proibido.
- [x] RED core CAB-004 fechado em 16 relatórios/134 casos e RED visual em 15 relatórios/87 casos.
- [x] Summary core distingue expected invariável de contagens observadas factuais em `CONFIG_ERROR`.
- [x] `MPS-UI-11` fecha EN/ES, dois paths, valores proibidos/esperados e listas aplicáveis.
- [x] Cenário de reteste do CEO atualizado para `1800 A / 400 V / 3% / max=7`, com default `10`.
- [x] Regressão stable, artifact remoto e CodeRabbit consultivo previstos.
- [x] `FUNCTIONAL_FAILURE`, `INFRA_BLOCKED` e `CONFIG_ERROR` separados.
- [x] O.S. classificada como CHG-3 e roteamento explicitado.
- [x] `TESTE DO CEO: SIM` com cenário concreto.
- [x] `MERGE_VALIDADO` separado de `ENCERRAMENTO_OPERACIONAL`.
- [x] Novo arquivo justificado por autoridade/consumidores/ciclo de vida próprios.
- [x] Plataforma CI e DevOps/SRE permanecem em escopos próprios.

---

**Estado vinculante:** `SDD_CANDIDATO_PARA_AUDITORIA`. Commit, push, caracterização core, RED visual, Backend,
Frontend, QA independente, PR e merge permanecem bloqueados até conferência focalizada do
`@Conselho_de_Arquitetura_e_Governanca` e autorização correspondente do `@CTO/@CEO`.
