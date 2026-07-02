---
title: Contrato SDD — Erros e Avisos de Engenharia BT/MT
source_bdd: docs/features/OS046_Erros_Avisos_Engenharia.feature
status: aprovado_para_qa_red
---

# Contrato SDD — O.S. 046

## Escopo e fronteira

Este contrato regula as saídas dos motores de Cabos BT e MT. Os motores são
puros: não leem DOM, não chamam renderizadores e não produzem texto localizado.
`js/ui_render.js` é a única camada que traduz `code` e `params` para PT/EN/ES.

Não há endpoint HTTP nesta etapa. O contrato é um envelope JSON in-process,
testável pelo Node.js e preparado para futura exposição por API.

## Envelope de sucesso

```json
{
  "ok": true,
  "data": { "...": "resultado matemático existente" },
  "warnings": [
    {
      "code": "QA-BT-005",
      "params": { "tProt_s": 6 },
      "severity": "warning"
    }
  ]
}
```

- `data` preserva os campos numéricos e unidades já publicados pelo motor.
- `warnings` sempre existe; é `[]` quando não há condição marginal.
- Um warning nunca muda `ok` para `false` nem elimina `data`.

## Envelope de falha — RFC 7807

```json
{
  "ok": false,
  "data": null,
  "warnings": [],
  "error": {
    "type": "https://ampai.dev/problems/QA-BT-001",
    "title": "QA-BT-001",
    "status": 422,
    "code": "QA-BT-001",
    "params": { "In_A": 10, "Ib_A": 16 },
    "severity": "error"
  }
}
```

`type`, `title` e `status` cumprem a interoperabilidade RFC 7807. `title` é
um identificador estável, não texto para exibição. A UI localiza a mensagem a
partir de `code` e `params`. Erros de entrada e domínio usam `status: 422`.

## Esquema JSON resumido

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "oneOf": [
    {
      "properties": {
        "ok": { "const": true },
        "data": { "type": "object" },
        "warnings": { "$ref": "#/$defs/warnings" }
      },
      "required": ["ok", "data", "warnings"]
    },
    {
      "properties": {
        "ok": { "const": false },
        "data": { "type": "null" },
        "warnings": { "const": [] },
        "error": { "$ref": "#/$defs/problem" }
      },
      "required": ["ok", "data", "warnings", "error"]
    }
  ],
  "$defs": {
    "warning": {
      "type": "object",
      "properties": {
        "code": { "type": "string", "pattern": "^QA-(BT|MT)-[0-9]{3}$" },
        "params": { "type": "object" },
        "severity": { "const": "warning" }
      },
      "required": ["code", "params", "severity"]
    },
    "warnings": { "type": "array", "items": { "$ref": "#/$defs/warning" } },
    "problem": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "format": "uri" },
        "title": { "type": "string" },
        "status": { "const": 422 },
        "code": { "type": "string", "pattern": "^QA-(BT|MT)-[0-9]{3}$" },
        "params": { "type": "object" },
        "severity": { "const": "error" }
      },
      "required": ["type", "title", "status", "code", "params", "severity"]
    }
  }
}
```

## Catálogo de códigos

### Erros BT

`QA-BT-001`, `002`, `003`, `004`, `006`, `007`, `010`.

### Avisos BT

`QA-BT-005`, `QA-BT-011`.

### Erros MT

`QA-MT-001`, `002`, `003`, `004`, `005`, `006`, `007`, `010`, `012`,
`015`, `021`, `022`, `024`, `030`, `032`, `034`, `036`, `038`, `040`,
`041`, `042`, `043`, `044`, `045`, `046`, `047`.

### Avisos MT

`QA-MT-011`, `013`, `014`, `020`, `023`, `025`, `033`, `035`, `037`, `042`.

`QA-MT-042` é intencionalmente compartilhado: `severity: "warning"` quando
`0 < f_combined < 0.30` com `params.condition: "low"`; `severity: "error"`
quando `f_combined <= 0` com `params.condition: "zero-or-negative"`.

## Regras de implementação

1. Não lançar `Error` com texto para comunicar falha de domínio.
2. Não usar `console.warn` para comunicar warning de engenharia.
3. Não mudar a matemática, unidades ou limites físicos aprovados pelo BDD.
4. `js/core_cabos_bt.js` e `js/core_cabos_mt.js` produzem somente envelopes.
5. `index.html` e `js/ui_render.js` não contêm fórmulas IEC; apenas traduzem e
   renderizam os envelopes recebidos.

## Critérios para QA RED

O RED deve provar que os motores atuais ainda violam o contrato: lançam texto,
escrevem warnings no console ou acessam/renderizam DOM. Os testes devem exigir
o envelope acima para os códigos críticos definidos na O.S. 047.

## Bloco para README.md (aplicar somente na O.S. documental posterior)

```md
### Contrato de diagnósticos de Cabos

Os motores BT e MT retornam envelopes JSON com `ok`, `data` e `warnings`.
Erros seguem Problem Details (RFC 7807) com `code` e `params`; a UI é
responsável pela localização das mensagens e pela apresentação dos avisos.
```

