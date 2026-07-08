---
tags: [sdd, gate, ci, shadow, infraestrutura, qa]
versao: 1.0
status: candidata
os: INF-028-C
baseline: f728fe2bf7d9f11412dcab696150a1945e7ccea9
---

# SDD — Gate Consolidado em Shadow Mode (CI)

> Contrato do workflow experimental de CI do Gate Consolidado. Complementa
> `docs/api/INF028_Gate_Executor_SDD.md` (executor local). Decisão canônica em
> `docs/AmpAI_Gate_Regressao.md`.
>
> **Shadow mode:** informativo. **NÃO** é required check, **não** substitui
> `qa-visual.yml`/`qa-os040r.yml`, **não** faz deploy nem merge, **não** executa
> testes experimentais, **não** usa rerun automático. O workflow pode ficar
> vermelho — isso é evidência válida.
>
> **RFC 7807 não se aplica** (infraestrutura, sem endpoint HTTP nem erro de domínio).

## 1. Componentes

| Artefato | Caminho | Papel |
| --- | --- | --- |
| Workflow | `.github/workflows/regression-gate-shadow.yml` | Orquestra os quatro jobs em CI. |
| Executor | `scripts/qa/run-regression.js` | Estendido com `--test-id` para seleção segura de um teste. |
| Agregador | `scripts/qa/aggregate-results.js` | Consolida os cinco resultados stable em um veredito. |

## 2. Extensão do executor — `--test-id`

```
node scripts/qa/run-regression.js --manifest <json> --suite <s> --test-id <id> --output <dir>
```

- **Opcional.** Sem `--test-id`, o comportamento é idêntico ao da INF-028-B (todos os
  stable da suíte).
- Com `--test-id`, executa **exatamente um** teste, e apenas se:
  - o ID existir no manifesto;
  - o teste for `classification: "stable"` (experimental → `CONFIG_ERROR`, exit 3);
  - a suíte do teste for compatível com `--suite` (`all` aceita qualquer stable).
- **Nunca** aceita múltiplos IDs, glob ou lista textual (`,`, `*`, `?`, `[`, `]`,
  espaços → `CONFIG_ERROR`). Não enfraquece a barreira stable-only.

## 3. Workflow

**Triggers:** `pull_request` (branches: main), `push` (branches: main),
`workflow_dispatch`.
**Permissões:** `contents: read` (nenhuma permissão de escrita, nenhum segredo).

### Jobs

Todos os jobs usam **Node 24** (`setup-node@v4`).

| Job | Papel | Resultado esperado |
| --- | --- | --- |
| `manifest-validation` | `npm ci` + `node tests/test_inf028_gate_contract.js`; grava `status.json` (PASS/FUNCTIONAL_FAILURE/INFRA_BLOCKED) | 18/18, exit 0 |
| `core` | `npm ci` + `npm run test:core` | 39/39, 8/8, PASS |
| `browser` | matriz `[os040r, os042r, os044r]`, `fail-fast: false`, um teste por runner isolado via `--test-id` | PASS ou INFRA_BLOCKED legítimo |
| `regression-gate` | `if: always()`, `needs` os três; baixa artifacts, agrega, consolida (agregador × `manifest-validation.status`) | PASS somente se tudo PASS |

Cada runner do `browser` habilita o sandbox de namespace do Chromium
(`kernel.apparmor_restrict_unprivileged_userns=0`), **registrando** sempre o resultado
do `sysctl` (nunca silenciado). **Jamais** usa `--no-sandbox`; respeita
`CHROME_DEVEL_SANDBOX` quando definido. Indisponibilidade real do Chromium é capturada
como `INFRA_BLOCKED` pelo preflight do executor.

### Captura de falhas (ordem obrigatória)

Cada job de teste: **1)** captura o exit code (`set +e`, grava em output); **2)**
faz upload do artifact (`if: always()`, `if-no-files-found: error`); **3)** só então
propaga o exit code em passo dedicado. Proibidos: converter falha em warning,
`continue-on-error` para check verde, rerun, retry, ignorar artifact ausente, ou
retornar zero após classificação não-PASS.

### Bootstrap → INFRA_BLOCKED estruturado

Falha de bootstrap (`npm ci`) **não** apaga a evidência: cada job de teste, ao detectar
`npm ci` com exit ≠ 0, emite `result.json` estruturado com `classification: "INFRA_BLOCKED"`
(reports.expected lido do manifesto canônico) para o(s) teste(s) do job, antes do upload.
Assim o agregador vê `INFRA_BLOCKED` (não um artifact ausente que seria `CONFIG_ERROR`).
Falha real do Chromium/sandbox vira `INFRA_BLOCKED` pelo preflight do executor.

## 4. Agregador

```
node scripts/qa/aggregate-results.js --input <dir-com-artifacts> --output <dir-consolidado>
```

O `--output` do agregador também é contido por allow-list (`tmp/` do repositório ou
temporário do sistema, via `path.relative`); raiz/pastas protegidas/arquivo → `CONFIG_ERROR`.

**Validação rigorosa de cada `result.json`** (anti-falso-GREEN): `schemaVersion===1`;
`testId` string; `classification` ∈ {PASS, FUNCTIONAL_FAILURE, INFRA_BLOCKED, CONFIG_ERROR};
`stages` com os seis booleanos; `preflight.exitCode` e `process.exitCode` inteiros;
`reports` com quatro inteiros ≥ 0; `reports.expected` **igual** ao `expectedCount` do
manifesto canônico. **PASS** exige `observed===expected===conforming`, `nonConforming===0`,
`process.exitCode===0` e todos os `stages` verdadeiros. Resultado inválido/incompleto,
contagem divergente ou JSON corrompido → `CONFIG_ERROR`. Falha ao gravar
`summary.json`/`manifest.json`/`environment.json` → `CONFIG_ERROR`.

Varre `--input` por `result.json`, consolida os cinco resultados stable esperados
(2 core + 3 browser, derivados de `qa/test-manifest.json`) e grava:

- `summary.json` — `schemaVersion`, commit, branch, evento, PR (quando aplicável),
  IDs esperados/observados, classificação individual e consolidada, artifacts
  presentes/ausentes, exit code consolidado, início/término/duração;
- `manifest.json` — inventário esperado (IDs stable core/browser, experimentais excluídos);
- `environment.json` — Node, plataforma, runner, commit, branch, evento, PR.

### Classificação consolidada (precedência)

```
CONFIG_ERROR → INFRA_BLOCKED → FUNCTIONAL_FAILURE → PASS
```

- artifact ausente → `CONFIG_ERROR`;
- JSON ausente/ inválido → `CONFIG_ERROR`;
- ID duplicado, experimental ou desconhecido → `CONFIG_ERROR`;
- contagem ≠ 2 core / 3 browser → `CONFIG_ERROR`;
- qualquer `INFRA_BLOCKED` → `INFRA_BLOCKED` (salvo precedência de configuração);
- qualquer falha funcional → `FUNCTIONAL_FAILURE`;
- cinco PASS completos → `PASS`.

O `regression-gate` só retorna sucesso se `manifest-validation` passou **e** o agregador
consolidou `PASS`.

## 5. Artifacts e retenção

| Artifact | Conteúdo | Retenção |
| --- | --- | --- |
| `manifest-validation-evidence` | stdout, stderr, ambiente | 30 dias |
| `core-evidence` | result.json (2), summary.json, logs, ambiente | 30 dias |
| `browser-<id>-evidence` (×3) | result.json, summary.json, logs, ambiente | 30 dias |
| `regression-gate-evidence` | summary.json, manifest.json, environment.json | 90 dias |

Todos os uploads usam `if: always()` (evidência preservada mesmo em falha).

## 6. Limites do shadow mode

- não bloqueia merge por configuração de branch (não é required check);
- não altera a proteção de `main`;
- `qa-visual.yml` e `qa-os040r.yml` permanecem intactos e oficiais;
- o job reflete o resultado real — vermelho é evidência válida;
- a promoção a required check depende de veredito do QA e autorização do CEO
  (O.S. futura — GATE-REQUIRED).
