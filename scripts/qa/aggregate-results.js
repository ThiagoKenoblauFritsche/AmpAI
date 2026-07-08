#!/usr/bin/env node
'use strict';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AmpAI — Agregador de evidências do Gate Consolidado (O.S. INF-028-C / -R)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CLI:
 *   node scripts/qa/aggregate-results.js --input <dir-com-artifacts> --output <dir-consolidado>
 *
 * Varre os artifacts dos jobs (result.json por teste), VALIDA rigorosamente cada
 * resultado, consolida os cinco stable esperados (2 core + 3 browser, derivados do
 * manifesto canônico) e grava: summary.json · manifest.json · environment.json
 *
 * Anti-falso-GREEN (precedência CONFIG_ERROR → INFRA_BLOCKED → FUNCTIONAL_FAILURE → PASS):
 *   • classificação fora de {PASS,FUNCTIONAL_FAILURE,INFRA_BLOCKED,CONFIG_ERROR} → CONFIG_ERROR
 *   • campos/tipos/contagens/exit codes ausentes ou inválidos → CONFIG_ERROR
 *   • reports.expected divergente do manifesto canônico → CONFIG_ERROR
 *   • PASS sem relatórios completos e conformes → CONFIG_ERROR
 *   • artifact ausente / JSON ausente ou inválido → CONFIG_ERROR
 *   • ID duplicado, experimental ou desconhecido → CONFIG_ERROR
 *   • falha ao gravar summary/manifest/environment → CONFIG_ERROR
 *   • qualquer INFRA_BLOCKED → INFRA_BLOCKED (salvo precedência de configuração)
 *   • qualquer falha funcional → FUNCTIONAL_FAILURE
 *   • cinco resultados válidos PASS → PASS
 *
 * RFC 7807 não se aplica (infraestrutura, sem endpoint HTTP nem erro de domínio).
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const OFFICIAL_MANIFEST = path.resolve(ROOT, 'qa', 'test-manifest.json');
const PROTECTED_OUTPUT_DIRS = ['js', 'docs', 'tests', 'qa', 'scripts', '.github'];

const CLASSIFICATION = Object.freeze({
  PASS: 'PASS',
  FUNCTIONAL_FAILURE: 'FUNCTIONAL_FAILURE',
  INFRA_BLOCKED: 'INFRA_BLOCKED',
  CONFIG_ERROR: 'CONFIG_ERROR',
});

const EXIT_CODE = Object.freeze({
  PASS: 0,
  FUNCTIONAL_FAILURE: 1,
  INFRA_BLOCKED: 2,
  CONFIG_ERROR: 3,
});

// Pior classificação primeiro (precedência consolidada).
const PRECEDENCE = [
  CLASSIFICATION.CONFIG_ERROR,
  CLASSIFICATION.INFRA_BLOCKED,
  CLASSIFICATION.FUNCTIONAL_FAILURE,
  CLASSIFICATION.PASS,
];

const VALID_CLASSES = new Set(Object.values(CLASSIFICATION));
const STAGE_KEYS = ['configValidated', 'dependenciesReady', 'preflightPassed', 'testStarted', 'assertionExercised', 'reportsValidated'];
const REPORT_KEYS = ['expected', 'observed', 'conforming', 'nonConforming'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function worstClassification(classifications) {
  for (const level of PRECEDENCE) {
    if (classifications.includes(level)) return level;
  }
  return CLASSIFICATION.PASS;
}

function parseArgs(argv) {
  const args = { input: null, output: null, errors: [] };
  const known = { '--input': 'input', '--output': 'output' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    let key = token;
    let inlineValue = null;
    const eq = token.indexOf('=');
    if (token.startsWith('--') && eq !== -1) { key = token.slice(0, eq); inlineValue = token.slice(eq + 1); }
    if (!Object.prototype.hasOwnProperty.call(known, key)) { args.errors.push(`argumento desconhecido: ${token}`); continue; }
    let value = inlineValue;
    if (value === null) {
      const next = argv[i + 1];
      if (next === undefined || (typeof next === 'string' && next.startsWith('--'))) { args.errors.push(`valor ausente para ${key}`); continue; }
      value = next; i += 1;
    }
    if (value === '') { args.errors.push(`valor vazio para ${key}`); continue; }
    args[known[key]] = value;
  }
  return args;
}

// ── Contenção segura do --output (via path.relative, nunca prefixo textual) ──
function isWithin(base, target) {
  if (base === target) return true;
  const rel = path.relative(base, target);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function resolveMaybeReal(rawPath) {
  const abs = path.resolve(rawPath);
  try { return fs.existsSync(abs) ? fs.realpathSync(abs) : abs; } catch (_) { return abs; }
}

function validateOutputDir(rawOutput) {
  const target = resolveMaybeReal(rawOutput);
  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    return { ok: false, reason: `--output aponta para um arquivo, não um diretório: ${rawOutput}` };
  }
  const repoTmp = resolveMaybeReal(path.join(ROOT, 'tmp'));
  const sysTmp = resolveMaybeReal(os.tmpdir());
  if (!(isWithin(repoTmp, target) || isWithin(sysTmp, target))) {
    return { ok: false, reason: `--output deve residir sob 'tmp/' do repositório ou sob o temporário do sistema: ${rawOutput}` };
  }
  if (target === resolveMaybeReal(ROOT)) {
    return { ok: false, reason: `--output não pode ser a raiz do projeto: ${rawOutput}` };
  }
  const protectedDirs = PROTECTED_OUTPUT_DIRS.map((d) => resolveMaybeReal(path.join(ROOT, d)));
  if (protectedDirs.some((p) => target === p || isWithin(p, target))) {
    return { ok: false, reason: `--output não pode residir em pasta protegida (${PROTECTED_OUTPUT_DIRS.join('/')}): ${rawOutput}` };
  }
  return { ok: true, target };
}

// Varre recursivamente por `result.json`; devolve {path, value} ou {path, error}.
function collectResultFiles(dir) {
  const found = [];
  if (!fs.existsSync(dir)) return found;
  const visit = (current) => {
    let entries;
    try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch (_) { return; }
    for (const entry of entries) {
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) visit(child);
      else if (entry.isFile() && entry.name === 'result.json') {
        try { found.push({ path: child, value: readJson(child) }); }
        catch (error) { found.push({ path: child, error: error.message }); }
      }
    }
  };
  visit(dir);
  return found;
}

function readExpectedStable() {
  const manifest = readJson(OFFICIAL_MANIFEST);
  const tests = Array.isArray(manifest.tests) ? manifest.tests : [];
  const byId = new Map(tests.map((t) => [t.id, t]));
  const stable = tests.filter((t) => t.classification === 'stable');
  return {
    byId,
    ids: stable.map((t) => t.id),
    core: stable.filter((t) => t.suite === 'core').map((t) => t.id),
    browser: stable.filter((t) => t.suite === 'browser').map((t) => t.id),
  };
}

/**
 * Validação rigorosa de um result.json contra o contrato do executor e o manifesto.
 * Devolve lista de problemas (vazia = válido). Qualquer problema torna o resultado
 * inválido/incompleto → o consolidado será CONFIG_ERROR.
 */
function validateResultShape(result, manifestEntry) {
  const issues = [];
  if (!result || typeof result !== 'object') return ['result.json não é objeto'];
  if (result.schemaVersion !== 1) issues.push('schemaVersion != 1');
  if (typeof result.testId !== 'string' || result.testId === '') issues.push('testId inválido');
  if (!VALID_CLASSES.has(result.classification)) issues.push(`classification desconhecida: ${JSON.stringify(result.classification)}`);

  const stages = result.stages;
  if (!stages || typeof stages !== 'object') issues.push('stages ausente/ inválido');
  else for (const key of STAGE_KEYS) if (typeof stages[key] !== 'boolean') issues.push(`stages.${key} não é booleano`);

  if (!result.preflight || !Number.isInteger(result.preflight.exitCode)) issues.push('preflight.exitCode não é inteiro');
  if (!result.process || !Number.isInteger(result.process.exitCode)) issues.push('process.exitCode não é inteiro');

  const rep = result.reports;
  if (!rep || typeof rep !== 'object') issues.push('reports ausente/ inválido');
  else {
    for (const key of REPORT_KEYS) {
      if (!Number.isInteger(rep[key]) || rep[key] < 0) issues.push(`reports.${key} não é inteiro >= 0`);
    }
    // Contagem esperada cruzada com o manifesto canônico.
    if (manifestEntry && manifestEntry.report && Number.isInteger(rep.expected)
        && rep.expected !== manifestEntry.report.expectedCount) {
      issues.push(`reports.expected (${rep.expected}) diverge do manifesto (${manifestEntry.report.expectedCount})`);
    }
  }

  // PASS exige relatórios completos e conformes (anti-falso-GREEN).
  if (result.classification === CLASSIFICATION.PASS) {
    if (rep && typeof rep === 'object') {
      if (rep.observed !== rep.expected) issues.push('PASS incompleto: observed != expected');
      if (rep.conforming !== rep.expected) issues.push('PASS incompleto: conforming != expected');
      if (rep.nonConforming !== 0) issues.push('PASS incompleto: nonConforming != 0');
    }
    if (result.process && result.process.exitCode !== 0) issues.push('PASS com process.exitCode != 0');
    if (stages && typeof stages === 'object') {
      for (const key of STAGE_KEYS) if (stages[key] !== true) issues.push(`PASS exige stages.${key} = true`);
    }
  }
  return issues;
}

function buildEnvironment() {
  const env = process.env;
  let pr = null;
  const prMatch = /^refs\/pull\/(\d+)\//.exec(env.GITHUB_REF || '');
  if (prMatch) pr = Number(prMatch[1]);
  return {
    schemaVersion: 1,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    runnerOs: env.RUNNER_OS || null,
    commit: env.GITHUB_SHA || null,
    branch: env.GITHUB_REF_NAME || null,
    event: env.GITHUB_EVENT_NAME || null,
    pr,
    workflow: env.GITHUB_WORKFLOW || null,
    runId: env.GITHUB_RUN_ID || null,
  };
}

function main() {
  const startMs = Date.now();
  const startIso = new Date(startMs).toISOString();
  const args = parseArgs(process.argv.slice(2));
  const environment = buildEnvironment();

  // Erros de argumento não têm destino de escrita confiável → stdout + exit 3.
  if (args.errors.length > 0) {
    process.stdout.write(`${JSON.stringify({ schemaVersion: 1, classification: CLASSIFICATION.CONFIG_ERROR, reason: 'argumentos inválidos', issues: args.errors })}\n`);
    process.exitCode = EXIT_CODE.CONFIG_ERROR;
    return;
  }
  if (!args.input || !args.output) {
    process.stdout.write(`${JSON.stringify({ schemaVersion: 1, classification: CLASSIFICATION.CONFIG_ERROR, reason: '--input e --output são obrigatórios' })}\n`);
    process.exitCode = EXIT_CODE.CONFIG_ERROR;
    return;
  }
  const outValidation = validateOutputDir(args.output);
  if (!outValidation.ok) {
    process.stdout.write(`${JSON.stringify({ schemaVersion: 1, classification: CLASSIFICATION.CONFIG_ERROR, reason: outValidation.reason })}\n`);
    process.stderr.write(`CONFIG_ERROR: ${outValidation.reason}\n`);
    process.exitCode = EXIT_CODE.CONFIG_ERROR;
    return;
  }
  const writeTarget = outValidation.target;

  let expected;
  try { expected = readExpectedStable(); } catch (error) {
    process.stdout.write(`${JSON.stringify({ schemaVersion: 1, classification: CLASSIFICATION.CONFIG_ERROR, reason: `manifesto oficial ilegível: ${error.message}` })}\n`);
    process.exitCode = EXIT_CODE.CONFIG_ERROR;
    return;
  }

  const inventory = {
    schemaVersion: 1,
    expectedStableIds: expected.ids,
    expectedCore: expected.core,
    expectedBrowser: expected.browser,
    experimentalExcluded: [...expected.byId.values()].filter((t) => t.classification === 'experimental').map((t) => t.id),
  };

  // ── Coleta e validação rigorosa ─────────────────────────────────────────
  const files = collectResultFiles(path.resolve(args.input));
  const parseErrors = files.filter((f) => f.error);
  const perTest = files.filter((f) => f.value !== undefined).map((f) => f.value);

  const invalid = [];
  for (const result of perTest) {
    const entry = (result && typeof result.testId === 'string') ? expected.byId.get(result.testId) : undefined;
    const shapeIssues = validateResultShape(result, entry);
    if (shapeIssues.length > 0) {
      invalid.push({ testId: (result && result.testId) || '(sem testId)', issues: shapeIssues });
    }
  }

  const observedIds = perTest.map((r) => (r && typeof r.testId === 'string') ? r.testId : '(sem testId)');
  const duplicates = observedIds.filter((id, idx) => observedIds.indexOf(id) !== idx);
  const experimentalObserved = observedIds.filter((id) => expected.byId.get(id)?.classification === 'experimental');
  const unknownObserved = observedIds.filter((id) => !expected.byId.has(id));
  const missing = expected.ids.filter((id) => !observedIds.includes(id));
  const coreCount = perTest.filter((r) => { const e = expected.byId.get(r?.testId); return e && e.classification === 'stable' && e.suite === 'core'; }).length;
  const browserCount = perTest.filter((r) => { const e = expected.byId.get(r?.testId); return e && e.classification === 'stable' && e.suite === 'browser'; }).length;

  const individual = perTest.map((r) => ({ testId: (r && r.testId) || null, classification: (r && r.classification) || null }));
  const artifacts = { present: expected.ids.filter((id) => observedIds.includes(id)), absent: missing };

  const configIssues = [];
  if (parseErrors.length) configIssues.push(`result.json inválido: ${parseErrors.map((f) => f.path).join(', ')}`);
  if (invalid.length) configIssues.push(`resultado(s) inválido(s)/incompleto(s): ${invalid.map((i) => `${i.testId} [${i.issues.join('; ')}]`).join(' | ')}`);
  if (duplicates.length) configIssues.push(`IDs duplicados: ${[...new Set(duplicates)].join(', ')}`);
  if (experimentalObserved.length) configIssues.push(`IDs experimentais presentes (proibidos): ${[...new Set(experimentalObserved)].join(', ')}`);
  if (unknownObserved.length) configIssues.push(`IDs desconhecidos: ${[...new Set(unknownObserved)].join(', ')}`);
  if (missing.length) configIssues.push(`artifacts ausentes para: ${missing.join(', ')}`);
  if (coreCount !== 2) configIssues.push(`esperados 2 resultados core, obtidos ${coreCount}`);
  if (browserCount !== 3) configIssues.push(`esperados 3 resultados browser, obtidos ${browserCount}`);

  const consolidated = configIssues.length > 0
    ? CLASSIFICATION.CONFIG_ERROR
    : worstClassification(perTest.map((r) => r.classification));

  const endMs = Date.now();
  const summary = {
    schemaVersion: 1,
    classification: consolidated,
    commit: environment.commit,
    branch: environment.branch,
    event: environment.event,
    pr: environment.pr,
    startedAt: startIso,
    finishedAt: new Date(endMs).toISOString(),
    durationMs: endMs - startMs,
    exitCode: EXIT_CODE[consolidated],
    expectedStableIds: expected.ids,
    observedIds,
    individual,
    artifacts,
    counts: { core: coreCount, browser: browserCount },
    issues: configIssues,
  };

  // ── Escrita obrigatória das três evidências. Falha → CONFIG_ERROR ────────
  let effective = consolidated;
  try {
    fs.mkdirSync(writeTarget, { recursive: true });
    fs.writeFileSync(path.join(writeTarget, 'manifest.json'), `${JSON.stringify(inventory, null, 2)}\n`);
    fs.writeFileSync(path.join(writeTarget, 'environment.json'), `${JSON.stringify(environment, null, 2)}\n`);
    // summary reflete o exit code efetivo; grava por último.
    fs.writeFileSync(path.join(writeTarget, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`CONFIG_ERROR: falha ao gravar evidência consolidada (summary/manifest/environment): ${error.message}\n`);
    effective = CLASSIFICATION.CONFIG_ERROR;
  }

  const humanLines = consolidated === CLASSIFICATION.CONFIG_ERROR && configIssues.length
    ? [`Gate consolidado: ${effective}`, ...configIssues.map((e) => `  - ${e}`)]
    : [`Gate consolidado: ${effective}`, ...individual.map((r) => `  [${r.classification}] ${r.testId}`)];
  for (const line of humanLines) process.stdout.write(`${line}\n`);
  process.exitCode = EXIT_CODE[effective];
}

main();
