---
tags: [sdd, gate, infraestrutura, qa]
versao: 1.0
status: candidata
os: INF-028-B
baseline: 8957e77cc8ba2149506621bcc2f1bd37d151b032
---

# SDD — Executor do Gate Consolidado (Fundação Local)

> Contrato técnico do executor único de regressão do AmpAI. Decisão canônica em
> `docs/AmpAI_Gate_Regressao.md`. Esta O.S. implementa **apenas a fundação local**
> (manifesto, schema, executor, comandos npm). GitHub Actions, artifacts completos e
> required check pertencem às O.S. INF-029 / GATE-CI-SHADOW / GATE-REQUIRED.
>
> **RFC 7807 não se aplica:** não há endpoint HTTP nem erro de domínio; a saída é
> evidência JSON processável de infraestrutura de teste, não Problem Details.

## 1. Componentes

| Artefato | Caminho | Papel |
| --- | --- | --- |
| Manifesto | `qa/test-manifest.json` | Fonte declarativa e explícita da suíte (8 entradas conhecidas). |
| Schema | `qa/test-manifest.schema.json` | JSON Schema (draft-07) validado por Ajv. |
| Executor | `scripts/qa/run-regression.js` | Executor Node único; seleciona, roda, classifica, evidencia. |
| Aliases npm | `package.json` | `test:core`, `test:browser`, `test:regression` — aliases finos, sem lógica. |

Nenhuma lógica de classificação é duplicada em `package.json`, YAML ou fora do executor.

## 2. CLI

```
node scripts/qa/run-regression.js --manifest <arquivo-json> --suite core|browser|all --output <diretório>
```

- `--manifest` obrigatório: caminho do manifesto (oficial ou subconjunto temporário da suíte QA).
- `--suite` obrigatório: `core` | `browser` | `all`.
- `--output` obrigatório: diretório onde (e **somente** onde) a evidência é escrita.
  Deve estar contido sob `tmp/` do repositório **ou** sob o diretório temporário do
  sistema; raiz do projeto, `js/`, `docs/`, `tests/`, `qa/`, `scripts/`, `.github/` e
  qualquer caminho que seja arquivo são rejeitados com `CONFIG_ERROR`.

Argumento desconhecido, valor ausente ou `--suite` fora de `core|browser|all` → `CONFIG_ERROR`.

## 3. Exit codes e precedência

```
0 = PASS               1 = FUNCTIONAL_FAILURE
2 = INFRA_BLOCKED      3 = CONFIG_ERROR
```

O exit consolidado é a **pior** classificação entre os testes selecionados, na precedência:

```
CONFIG_ERROR → INFRA_BLOCKED → FUNCTIONAL_FAILURE → PASS
```

A classificação nunca deriva apenas do exit code bruto do teste: combina configuração,
estágios, preflight, relatórios observados e exit code.

## 4. Seleção por suíte

Apenas testes `classification: "stable"` são elegíveis. Experimentais/flaky/archived/utility
nunca são executados pelos comandos do gate.

- `--suite core` → stable com `suite: "core"`.
- `--suite browser` → stable com `suite: "browser"`.
- `--suite all` → todos os stable (jamais experimentais).

## 5. Resultado por teste (JSON processável)

Escrito em `<output>/<testId>/result.json` (e `stdout.log`, `stderr.log`):

```json
{
  "schemaVersion": 1,
  "testId": "os047",
  "classification": "PASS",
  "stages": {
    "configValidated": true,
    "dependenciesReady": true,
    "preflightPassed": true,
    "testStarted": true,
    "assertionExercised": true,
    "reportsValidated": true
  },
  "preflight": { "exitCode": 0 },
  "process": { "exitCode": 0 },
  "reports": { "expected": 8, "observed": 8, "conforming": 8, "nonConforming": 0 }
}
```

Resumo consolidado em `<output>/summary.json` com `schemaVersion`, `classification`
consolidada, `suite`, contagens por classe e `testIds`.

`assertionExercised` é **calculado** pelo classificador, nunca assumido: só é `true` quando
há prova da asserção (≥1 relatório json-lines válido, ou os três valores do resumo legado).
Zero relatório → `assertionExercised:false` + `CONFIG_ERROR`; relatório parcial pode ter
`assertionExercised:true` mas sempre `reportsValidated:false`.

A evidência consolidada é **obrigatória**: se `summary.json` não puder ser gravado, o
veredito é rebaixado a `CONFIG_ERROR` (nunca silenciado). Um gate sem evidência consolidada
não pode retornar `PASS`.

## 6. Protocolos de relatório

### 6.1 `json-lines`

Linhas `"<prefix> {json}"`. `observed` = nº de relatórios; `conforming` = nº em que
`complianceField` (caminho por pontos, ex.: `documentMetrics.hasHorizontalOverflow`)
é igual a `expectedValue`.

- `observed ≠ expectedCount` → **CONFIG_ERROR** (barra falso-GREEN, inclui zero relatórios).
- `observed = expectedCount` e exit ≠ 0 → **FUNCTIONAL_FAILURE**.
- `observed = expectedCount` e `nonConforming > 0` → **FUNCTIONAL_FAILURE**.
- `observed = expectedCount`, todos conformes, exit 0 → **PASS**.

### 6.2 `legacy-zombies`

Resumo textual `greenLabel`/`redLabel`/`totalLabel` (ex.: Verdes/Vermelhos/Total).
`expectedCount = 39`.

- resumo ausente (qualquer rótulo não encontrado) → **CONFIG_ERROR**.
- `total ≠ 39` → **CONFIG_ERROR**.
- `verdes + vermelhos ≠ total` (contabilidade incompleta, ex.: 38/0/39) → **CONFIG_ERROR**.
- `vermelhos > 0` → **FUNCTIONAL_FAILURE**.
- resumo completo mas exit ≠ 0 → **FUNCTIONAL_FAILURE**.
- `verdes = 39`, `vermelhos = 0`, `total = 39`, exit 0 → **PASS**.

## 7. Preflight

- **node:** runtime disponível, arquivo resolvido, `node --check` (sintaxe). Preflight zero
  antes do teste; falha → INFRA_BLOCKED.
- **chromium:** localiza Puppeteer, inicializa e fecha o Chromium (sem `--no-sandbox`;
  no CI respeita `CHROME_DEVEL_SANDBOX`). Falha anterior ao teste → INFRA_BLOCKED.

O marcador **`INF028_FIXTURE_INFRA`** (stderr) é reconhecido **exclusivamente** para os
fixtures da INF-028-A e mapeia para INFRA_BLOCKED. Na execução real, o preflight controla a infraestrutura.

## 8. Taxonomia de classificação

| Classe | Condição | Exit |
| --- | --- | --- |
| `PASS` | config válida, preflight ok, teste iniciado, asserção exercida, relatórios completos e todos conformes, exit 0 | 0 |
| `FUNCTIONAL_FAILURE` | ambiente funcional, relatórios completos, ≥1 asserção não conforme ou falha funcional (exit ≠ 0) | 1 |
| `INFRA_BLOCKED` | falha anterior ao contrato (preflight/dependência/marcador de infra) | 2 |
| `CONFIG_ERROR` | schema/manifesto inválido, arquivo ausente, ID duplicado, glob, comando arbitrário, relatório ausente, contagem incorreta, falso-GREEN | 3 |

## 9. Validação do manifesto

1. **Ajv (estrutural):** `$schema`, `type:object`, `additionalProperties:false`,
   `schemaVersion:const 1`, `tests:array`, itens com `additionalProperties:false` e
   obrigatórios `id, file, classification, suite, timeoutSeconds, preflight, report`;
   enums de `classification`, `suite`, `preflight` e `report.protocol`.
   Propriedade extra (ex.: `command`) é rejeitada estruturalmente.
   **Condicional por protocolo:** `report.expectedCount ≥ 1`; `json-lines` exige
   `prefix`, `complianceField` e `expectedValue`; `legacy-zombies` exige `greenLabel`,
   `redLabel` e `totalLabel`. Protocolo incompleto → `CONFIG_ERROR` antes da execução.
2. **Semântica (executor):** IDs únicos; `file` sob `tests/`, extensão `.js`, existente;
   rejeição de `..`, caminho absoluto, glob (`* ? [ ]`) e chaves de comando
   (`command/script/shell/exec/cmd/run`); teste stable com contrato de relatório;
   e, **somente no manifesto oficial**, exatamente seis entradas stable.

Manifestos temporários da suíte QA podem conter subconjuntos válidos (a regra dos seis
stable é exclusiva do manifesto oficial `qa/test-manifest.json`).

## 10. Segurança do executor

- Execução com `process.execPath` + array de argumentos + `shell: false`.
- Nunca aceita, interpola ou executa comandos vindos do manifesto.
- Resolve e valida caminhos antes de executar; recusa escapar de `tests/`.
- **Contenção de `--output` por `path.relative`** (não por prefixo textual): aceita apenas
  sob `tmp/` do repositório ou sob o temporário do sistema; rejeita a raiz, pastas
  protegidas e caminhos que sejam arquivo. Cria arquivos **somente** sob `--output`;
  **nunca** apaga o diretório fornecido nem sobrescreve produção.
- Seleção vazia (nenhum stable para a suíte) → `CONFIG_ERROR`, jamais `PASS` vazio.
- Respeita timeout individual (`timeoutSeconds`); captura stdout e stderr separados.

## 11. Manifesto oficial (baseline)

Oito entradas conhecidas: seis `stable` (3 core + 3 browser) e duas `experimental`
(fora da execução stable).

| id | file | classe | suite | protocolo |
| --- | --- | --- | --- | --- |
| core-curto-circuito | tests/core_curto_circuito.test.js | stable | core | legacy-zombies (39) |
| os047 | tests/test_os047.js | stable | core | json-lines (8, `compliant`) |
| inc001-m16 | tests/test_inc001_m16.js | stable | core | json-lines (24, `compliant`) |
| os040r | tests/test_os040_restart.js | stable | browser | json-lines (9, `hasOwnVisualSignal`) |
| os042r | tests/test_os042_restart.js | stable | browser | json-lines (1, `documentMetrics.hasHorizontalOverflow=false`) |
| os044r | tests/test_os044_restart.js | stable | browser | json-lines (26, `compliant`) |
| os049 | tests/test_os049.js | experimental | browser | json-lines (14, `compliant`) |
| os049-e2e | tests/test_os049_e2e.js | experimental | browser | json-lines (2, `compliant`) |

## 12. Comandos

```bash
npm run test:core        # 3 stable core, sequencial
npm run test:browser     # 3 stable browser (Chromium; INFRA_BLOCKED se indisponível)
npm run test:regression  # 6 stable (core + browser)
```
