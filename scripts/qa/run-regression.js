#!/usr/bin/env node
'use strict';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AmpAI — Executor único do Gate Consolidado de Regressão (O.S. INF-028-B / -R)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CLI:
 *   node scripts/qa/run-regression.js --manifest <json> --suite core|browser|all --output <dir>
 *
 * Exit codes (precedência CONFIG_ERROR → INFRA_BLOCKED → FUNCTIONAL_FAILURE → PASS):
 *   0 = PASS               1 = FUNCTIONAL_FAILURE
 *   2 = INFRA_BLOCKED      3 = CONFIG_ERROR
 *
 * Princípios (docs/AmpAI_Gate_Regressao.md / SDD docs/api/INF028_Gate_Executor_SDD.md):
 *   • Manifesto explícito; nenhuma descoberta por glob; nenhum comando shell no manifesto.
 *   • Somente testes `stable` integram core/browser/all.
 *   • Classificação por configuração + estágios + preflight + relatórios + exit code
 *     (nunca só pelo exit code bruto). Anti-falso-GREEN em todas as fronteiras.
 *   • Segurança: process.execPath, array de argumentos, shell:false; arquivos só sob
 *     um --output contido em tmp/ do repositório ou no temporário do sistema.
 *   • Evidência consolidada é obrigatória: falha ao gravar summary.json → CONFIG_ERROR.
 *   • RFC 7807 não se aplica (infraestrutura, sem endpoint HTTP nem erro de domínio).
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_SCHEMA = path.resolve(ROOT, 'qa', 'test-manifest.schema.json');
const OFFICIAL_MANIFEST = path.resolve(ROOT, 'qa', 'test-manifest.json');
const TESTS_ROOT = path.resolve(ROOT, 'tests');
const INFRA_MARKER = 'INF028_FIXTURE_INFRA';
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

// ─────────────────────────────────────────────────────────────────────────────
// Utilitários
// ─────────────────────────────────────────────────────────────────────────────
function normalizeSlashes(value) {
  return String(value || '').replace(/\\/g, '/');
}

function emptyStages() {
  return {
    configValidated: false,
    dependenciesReady: false,
    preflightPassed: false,
    testStarted: false,
    assertionExercised: false,
    reportsValidated: false,
  };
}

function makeResult(testId, classification, extra = {}) {
  return {
    schemaVersion: 1,
    testId,
    classification,
    stages: extra.stages || emptyStages(),
    preflight: { exitCode: Number.isInteger(extra.preflightExit) ? extra.preflightExit : 0 },
    process: { exitCode: Number.isInteger(extra.processExit) ? extra.processExit : 0 },
    reports: extra.reports || { expected: 0, observed: 0, conforming: 0, nonConforming: 0 },
  };
}

function getByPath(object, dotPath) {
  return String(dotPath).split('.').reduce(
    (acc, key) => (acc === null || acc === undefined ? undefined : acc[key]),
    object
  );
}

function worstClassification(classifications) {
  for (const level of PRECEDENCE) {
    if (classifications.includes(level)) return level;
  }
  return CLASSIFICATION.PASS;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeSegment(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]/g, '_') || 'test';
}

// ─────────────────────────────────────────────────────────────────────────────
// Parsing estrito de argumentos (arg desconhecido / valor ausente → erro)
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { manifest: null, suite: null, output: null, testId: null, errors: [] };
  const known = { '--manifest': 'manifest', '--suite': 'suite', '--output': 'output', '--test-id': 'testId' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    let key = token;
    let inlineValue = null;
    const eq = token.indexOf('=');
    if (token.startsWith('--') && eq !== -1) {
      key = token.slice(0, eq);
      inlineValue = token.slice(eq + 1);
    }
    if (!Object.prototype.hasOwnProperty.call(known, key)) {
      args.errors.push(`argumento desconhecido: ${token}`);
      continue;
    }
    const field = known[key];
    let value = inlineValue;
    if (value === null) {
      const next = argv[i + 1];
      if (next === undefined || (typeof next === 'string' && next.startsWith('--'))) {
        args.errors.push(`valor ausente para ${key}`);
        continue;
      }
      value = next;
      i += 1;
    }
    if (value === '') {
      args.errors.push(`valor vazio para ${key}`);
      continue;
    }
    if (field === 'testId') {
      // Seleção por ID é sempre singular: sem múltiplos IDs, glob ou lista textual.
      if (args.testId !== null) {
        args.errors.push('múltiplos --test-id não são permitidos (selecione exatamente um ID)');
        continue;
      }
      if (/[,*?[\]\s]/.test(value)) {
        args.errors.push(`--test-id inválido (sem glob, lista ou espaços): ${value}`);
        continue;
      }
    }
    args[field] = value;
  }
  return args;
}

// ─────────────────────────────────────────────────────────────────────────────
// Contenção de caminhos (via path.relative, nunca prefixo textual)
// ─────────────────────────────────────────────────────────────────────────────
function isWithin(base, target) {
  if (base === target) return true;
  const rel = path.relative(base, target);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function resolveMaybeReal(rawPath) {
  const abs = path.resolve(rawPath);
  try {
    return fs.existsSync(abs) ? fs.realpathSync(abs) : abs;
  } catch (_) {
    return abs;
  }
}

function validateOutputDir(rawOutput) {
  const target = resolveMaybeReal(rawOutput);

  // Nunca aceitar um caminho que seja arquivo.
  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    return { ok: false, reason: `--output aponta para um arquivo, não um diretório: ${rawOutput}` };
  }

  // Allow-list: sob tmp/ do repositório OU sob o temporário do sistema (usado pelo QA).
  const repoTmp = resolveMaybeReal(path.join(ROOT, 'tmp'));
  const sysTmp = resolveMaybeReal(os.tmpdir());
  const allowed = isWithin(repoTmp, target) || isWithin(sysTmp, target);
  if (!allowed) {
    return { ok: false, reason: `--output deve residir sob 'tmp/' do repositório ou sob o diretório temporário do sistema: ${rawOutput}` };
  }

  // Deny explícito: raiz do projeto e pastas protegidas (defesa em profundidade).
  if (target === resolveMaybeReal(ROOT)) {
    return { ok: false, reason: `--output não pode ser a raiz do projeto: ${rawOutput}` };
  }
  const protectedDirs = PROTECTED_OUTPUT_DIRS.map((d) => resolveMaybeReal(path.join(ROOT, d)));
  if (protectedDirs.some((p) => target === p || isWithin(p, target))) {
    return { ok: false, reason: `--output não pode residir em pasta protegida (${PROTECTED_OUTPUT_DIRS.join('/')}): ${rawOutput}` };
  }

  return { ok: true, target };
}

// ─────────────────────────────────────────────────────────────────────────────
// Validação de manifesto — schema (Ajv) + semântica
// ─────────────────────────────────────────────────────────────────────────────
function validateSchema(manifest, schema) {
  // Ajv é a única fonte da validação estrutural (não duplicada manualmente).
  let Ajv;
  try {
    Ajv = require('ajv');
  } catch (error) {
    return { ok: false, errors: [`Ajv indisponível: ${error.message}`] };
  }
  const ajv = new Ajv({ allErrors: true, strict: false });
  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (error) {
    return { ok: false, errors: [`schema não compilável: ${error.message}`] };
  }
  const valid = validate(manifest);
  if (valid) return { ok: true, errors: [] };
  const errors = (validate.errors || []).map(
    (err) => `${err.instancePath || '(raiz)'} ${err.message}`
  );
  return { ok: false, errors };
}

function validateSemantics(manifest, manifestPath) {
  const issues = [];
  const tests = Array.isArray(manifest.tests) ? manifest.tests : [];
  const isOfficial = path.resolve(manifestPath) === OFFICIAL_MANIFEST;
  const seenIds = new Set();
  const forbiddenKeys = ['command', 'script', 'shell', 'exec', 'cmd', 'run'];

  for (const test of tests) {
    const id = test && test.id;
    if (seenIds.has(id)) issues.push(`id duplicado: ${id}`);
    seenIds.add(id);

    for (const key of forbiddenKeys) {
      if (test && Object.prototype.hasOwnProperty.call(test, key)) {
        issues.push(`chave de comando arbitrário proibida ('${key}') em ${id}`);
      }
    }

    const rawFile = test && test.file;
    const file = normalizeSlashes(rawFile);
    if (/[*?[\]]/.test(file)) issues.push(`glob não permitido em file: ${rawFile}`);
    if (file.split('/').includes('..')) issues.push(`travessia '..' não permitida em file: ${rawFile}`);
    if (path.isAbsolute(String(rawFile))) issues.push(`caminho absoluto não permitido em file: ${rawFile}`);
    if (!file.endsWith('.js')) issues.push(`extensão deve ser .js: ${rawFile}`);

    const resolved = path.resolve(ROOT, String(rawFile));
    if (!isWithin(TESTS_ROOT, resolved)) issues.push(`file deve residir sob tests/: ${rawFile}`);
    else if (!fs.existsSync(resolved)) issues.push(`arquivo inexistente: ${rawFile}`);

    if (test && test.classification === 'stable' && !test.report) {
      issues.push(`teste stable requer contrato de relatório: ${id}`);
    }
  }

  if (isOfficial) {
    const stableCount = tests.filter((test) => test && test.classification === 'stable').length;
    if (stableCount !== 5) issues.push(`manifesto oficial deve ter exatamente cinco entradas stable (encontrado: ${stableCount})`);
  }

  return issues;
}

function selectTests(manifest, suite) {
  const stable = (manifest.tests || []).filter((test) => test.classification === 'stable');
  if (suite === 'core') return stable.filter((test) => test.suite === 'core');
  if (suite === 'browser') return stable.filter((test) => test.suite === 'browser');
  return stable; // 'all' → todos os stable, jamais experimentais
}

/**
 * Seleção segura por --test-id (exatamente um teste). Rejeita, com CONFIG_ERROR:
 * ID inexistente; ID não-stable (experimental incluso); e incompatibilidade com --suite.
 * Nunca enfraquece a barreira stable-only (não seleciona experimentais).
 */
function selectById(manifest, testId, suite) {
  const entry = (manifest.tests || []).find((test) => test.id === testId);
  if (!entry) {
    return { ok: false, reason: `--test-id inexistente no manifesto: ${testId}` };
  }
  if (entry.classification !== 'stable') {
    return { ok: false, reason: `--test-id '${testId}' não é stable (classification='${entry.classification}'); experimentais não são executados pelo gate` };
  }
  if (suite !== 'all' && entry.suite !== suite) {
    return { ok: false, reason: `--test-id '${testId}' (suite='${entry.suite}') é incompatível com --suite '${suite}'` };
  }
  return { ok: true, tests: [entry] };
}

// ─────────────────────────────────────────────────────────────────────────────
// Preflight
// ─────────────────────────────────────────────────────────────────────────────
function preflightNode(filePath) {
  // Runtime disponível (process.execPath), arquivo resolvido e sintaxe executável.
  if (!fs.existsSync(filePath)) return { ok: false, exitCode: 1, reason: 'arquivo não resolvido' };
  const check = spawnSync(process.execPath, ['--check', filePath], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    timeout: 15000,
  });
  return { ok: check.status === 0, exitCode: Number.isInteger(check.status) ? check.status : 1, reason: 'node --check' };
}

async function preflightChromium(filePath) {
  if (!fs.existsSync(filePath)) return { ok: false, exitCode: 1, reason: 'arquivo não resolvido' };
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (error) {
    return { ok: false, exitCode: 2, reason: `Puppeteer indisponível: ${error.message}` };
  }
  let browser = null;
  try {
    // Sem --no-sandbox (respeita a política do gate; CI usa CHROME_DEVEL_SANDBOX).
    browser = await puppeteer.launch({ headless: 'new' });
    await browser.close();
    browser = null;
    return { ok: true, exitCode: 0, reason: 'chromium ok' };
  } catch (error) {
    if (browser) { try { await browser.close(); } catch (_) { /* noop */ } }
    return { ok: false, exitCode: 2, reason: `Chromium indisponível: ${error.message}` };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Classificação por protocolo de relatório
// (retorna assertionExercised calculado; jamais assumido como true)
// ─────────────────────────────────────────────────────────────────────────────
function classifyJsonLines(report, stdout, processExit) {
  const expected = Number(report.expectedCount);
  const prefix = String(report.prefix || '');
  const parsed = [];
  for (const line of String(stdout || '').split(/\r?\n/)) {
    if (!line.startsWith(`${prefix} `)) continue;
    try {
      parsed.push(JSON.parse(line.slice(prefix.length + 1)));
    } catch (_) {
      // Linha de relatório malformada: ignorada (não conta como relatório válido).
    }
  }
  const observed = parsed.length;
  const conforming = parsed.filter(
    (item) => getByPath(item, report.complianceField) === report.expectedValue
  ).length;
  const nonConforming = observed - conforming;
  const reports = { expected, observed, conforming, nonConforming };
  // Asserção exercida somente quando ≥1 relatório válido foi parseado.
  const assertionExercised = observed >= 1;

  if (observed !== expected) {
    // Falso-GREEN barrado: contagem de asserções divergente (inclui zero) → configuração.
    return { classification: CLASSIFICATION.CONFIG_ERROR, assertionExercised, reportsValidated: false, reports };
  }
  if (processExit !== 0) {
    return { classification: CLASSIFICATION.FUNCTIONAL_FAILURE, assertionExercised, reportsValidated: true, reports };
  }
  if (nonConforming > 0) {
    return { classification: CLASSIFICATION.FUNCTIONAL_FAILURE, assertionExercised, reportsValidated: true, reports };
  }
  return { classification: CLASSIFICATION.PASS, assertionExercised, reportsValidated: true, reports };
}

function parseLegacyLabel(stdout, label) {
  const escaped = String(label).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escaped}\\s*:\\s*(\\d+)`, 'i').exec(String(stdout || ''));
  return match ? Number(match[1]) : null;
}

function classifyLegacyZombies(report, stdout, processExit) {
  const expected = Number(report.expectedCount);
  const green = parseLegacyLabel(stdout, report.greenLabel);
  const red = parseLegacyLabel(stdout, report.redLabel);
  const total = parseLegacyLabel(stdout, report.totalLabel);
  const reports = {
    expected,
    observed: total === null ? 0 : total,
    conforming: green === null ? 0 : green,
    nonConforming: red === null ? 0 : red,
  };
  // Asserção exercida somente quando os três valores do resumo foram encontrados.
  const assertionExercised = green !== null && red !== null && total !== null;

  if (!assertionExercised) {
    return { classification: CLASSIFICATION.CONFIG_ERROR, assertionExercised, reportsValidated: false, reports };
  }
  if (total !== expected) {
    return { classification: CLASSIFICATION.CONFIG_ERROR, assertionExercised, reportsValidated: false, reports };
  }
  if (green + red !== total) {
    // Contabilidade incompleta (ex.: 38 verdes, 0 vermelhos, total 39) → falso-GREEN.
    return { classification: CLASSIFICATION.CONFIG_ERROR, assertionExercised, reportsValidated: false, reports };
  }
  if (red > 0) {
    return { classification: CLASSIFICATION.FUNCTIONAL_FAILURE, assertionExercised, reportsValidated: true, reports };
  }
  if (processExit !== 0) {
    return { classification: CLASSIFICATION.FUNCTIONAL_FAILURE, assertionExercised, reportsValidated: true, reports };
  }
  return { classification: CLASSIFICATION.PASS, assertionExercised, reportsValidated: true, reports };
}

// ─────────────────────────────────────────────────────────────────────────────
// Execução de um teste
// ─────────────────────────────────────────────────────────────────────────────
async function runOneTest(test) {
  const testId = test.id;
  const filePath = path.resolve(ROOT, String(test.file));
  const expectedCount = Number(test.report ? test.report.expectedCount : 0);
  const infraReports = { expected: expectedCount, observed: 0, conforming: 0, nonConforming: 0 };

  // Preflight (config já validado globalmente antes de chegar aqui).
  let preflight;
  if (test.preflight === 'chromium' || test.suite === 'browser') {
    preflight = await preflightChromium(filePath);
  } else {
    preflight = preflightNode(filePath);
  }

  if (!preflight.ok) {
    // Falha anterior ao contrato → INFRA_BLOCKED (nada exercido).
    const result = makeResult(testId, CLASSIFICATION.INFRA_BLOCKED, {
      stages: { ...emptyStages(), configValidated: true },
      preflightExit: preflight.exitCode,
      processExit: preflight.exitCode,
      reports: infraReports,
    });
    return { result, stdout: '', stderr: `preflight: ${preflight.reason}` };
  }

  // Execução isolada do teste — segurança: execPath + array + shell:false.
  const proc = spawnSync(process.execPath, [filePath], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    timeout: Math.max(1, Number(test.timeoutSeconds) || 60) * 1000,
    maxBuffer: 32 * 1024 * 1024,
  });

  const stdout = proc.stdout || '';
  const stderr = proc.stderr || '';

  // Marcador de infraestrutura reconhecido (exclusivo de teste; no real o preflight
  // controla a infraestrutura). Falha de infra antes do contrato → INFRA_BLOCKED.
  if (stderr.includes(INFRA_MARKER)) {
    const result = makeResult(testId, CLASSIFICATION.INFRA_BLOCKED, {
      stages: { ...emptyStages(), configValidated: true },
      preflightExit: Number.isInteger(proc.status) ? proc.status : 2,
      processExit: Number.isInteger(proc.status) ? proc.status : 2,
      reports: infraReports,
    });
    return { result, stdout, stderr };
  }

  // Timeout / término por sinal antes de um exit code inteiro → INFRA_BLOCKED.
  if (!Number.isInteger(proc.status)) {
    const result = makeResult(testId, CLASSIFICATION.INFRA_BLOCKED, {
      stages: { ...emptyStages(), configValidated: true, dependenciesReady: true, preflightPassed: true },
      preflightExit: 0,
      processExit: 124,
      reports: infraReports,
    });
    return { result, stdout, stderr };
  }

  const processExit = proc.status;
  const protocol = test.report ? test.report.protocol : 'json-lines';
  const classified = protocol === 'legacy-zombies'
    ? classifyLegacyZombies(test.report, stdout, processExit)
    : classifyJsonLines(test.report, stdout, processExit);

  // Estágios refletem o que o classificador de fato apurou (nunca assumido).
  const stages = {
    configValidated: true,
    dependenciesReady: true,
    preflightPassed: true,
    testStarted: true,
    assertionExercised: classified.assertionExercised,
    reportsValidated: classified.reportsValidated,
  };

  const result = makeResult(testId, classified.classification, {
    stages,
    preflightExit: 0,
    processExit,
    reports: classified.reports,
  });
  return { result, stdout, stderr };
}

// ─────────────────────────────────────────────────────────────────────────────
// Escrita de evidência (somente sob --output validado)
// ─────────────────────────────────────────────────────────────────────────────
function writeTestEvidence(outputDir, execution) {
  const dir = path.join(outputDir, safeSegment(execution.result.testId));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'result.json'), `${JSON.stringify(execution.result, null, 2)}\n`);
  fs.writeFileSync(path.join(dir, 'stdout.log'), execution.stdout || '');
  fs.writeFileSync(path.join(dir, 'stderr.log'), execution.stderr || '');
}

function writeSummary(outputDir, summary) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
}

/**
 * Emite o veredito. A evidência consolidada é obrigatória: se `summary.json` não puder
 * ser gravado, o resultado é rebaixado a CONFIG_ERROR (jamais silenciado). Um gate sem
 * evidência consolidada não pode retornar PASS.
 */
function emit(classification, summary, outputDir, humanLines) {
  let effective = classification;
  if (outputDir) {
    try {
      writeSummary(outputDir, summary);
    } catch (error) {
      process.stderr.write(`CONFIG_ERROR: falha ao gravar evidência consolidada (summary.json): ${error.message}\n`);
      effective = CLASSIFICATION.CONFIG_ERROR;
    }
  } else {
    // Sem diretório válido, publica a evidência mínima processável em stdout.
    process.stdout.write(`${JSON.stringify(summary)}\n`);
  }
  for (const line of humanLines) process.stdout.write(`${line}\n`);
  process.exitCode = EXIT_CODE[effective];
}

// ─────────────────────────────────────────────────────────────────────────────
// Orquestração
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv.slice(2));

  // Diretório de escrita: só é usado se --output for válido e contido.
  const outputInfo = args.output ? validateOutputDir(args.output) : { ok: false, reason: 'ausente' };
  const writeTarget = outputInfo.ok ? outputInfo.target : null;

  const configErrorSummary = (reason, detailList = []) => ({
    schemaVersion: 1,
    classification: CLASSIFICATION.CONFIG_ERROR,
    suite: args.suite || null,
    manifest: args.manifest ? normalizeSlashes(args.manifest) : null,
    reason,
    issues: detailList,
    tests: [],
  });

  // Argumentos desconhecidos / valores ausentes.
  if (args.errors.length > 0) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary('argumentos inválidos', args.errors), writeTarget,
      ['CONFIG_ERROR: argumentos inválidos:', ...args.errors.map((e) => `  - ${e}`)]);
  }
  if (!args.manifest || !args.output) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary('argumentos --manifest e --output são obrigatórios'), writeTarget,
      ['CONFIG_ERROR: argumentos --manifest e --output são obrigatórios.']);
  }
  if (!['core', 'browser', 'all'].includes(args.suite)) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary(`--suite inválido: ${args.suite}`), writeTarget,
      [`CONFIG_ERROR: --suite deve ser core|browser|all (recebido: ${args.suite}).`]);
  }
  if (!outputInfo.ok) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary(`--output inválido: ${outputInfo.reason}`), null,
      [`CONFIG_ERROR: ${outputInfo.reason}`]);
  }

  fs.mkdirSync(writeTarget, { recursive: true });

  // Schema.
  if (!fs.existsSync(DEFAULT_SCHEMA)) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary('schema ausente em qa/test-manifest.schema.json'), writeTarget,
      ['CONFIG_ERROR: JSON Schema ausente.']);
  }
  let schema;
  try { schema = readJson(DEFAULT_SCHEMA); } catch (error) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary(`schema inválido: ${error.message}`), writeTarget,
      ['CONFIG_ERROR: JSON Schema não parseável.']);
  }

  // Manifesto.
  const manifestPath = path.resolve(args.manifest);
  if (!fs.existsSync(manifestPath)) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary('manifesto ausente'), writeTarget,
      ['CONFIG_ERROR: manifesto ausente.']);
  }
  let manifest;
  try { manifest = readJson(manifestPath); } catch (error) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary(`manifesto inválido: ${error.message}`), writeTarget,
      ['CONFIG_ERROR: manifesto não parseável.']);
  }

  // Validação estrutural (Ajv) — protocolo de relatório incompleto reprova aqui.
  const schemaCheck = validateSchema(manifest, schema);
  if (!schemaCheck.ok) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary('manifesto reprovado no schema', schemaCheck.errors), writeTarget,
      ['CONFIG_ERROR: manifesto viola o JSON Schema:', ...schemaCheck.errors.map((e) => `  - ${e}`)]);
  }

  // Validação semântica.
  const semanticIssues = validateSemantics(manifest, manifestPath);
  if (semanticIssues.length > 0) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary('manifesto reprovado na validação semântica', semanticIssues), writeTarget,
      ['CONFIG_ERROR: validação semântica do manifesto falhou:', ...semanticIssues.map((e) => `  - ${e}`)]);
  }

  // Seleção. Com --test-id: exatamente um teste stable compatível com a suíte.
  // Sem --test-id: comportamento atual (todos os stable da suíte). Seleção vazia
  // ou ID inválido → CONFIG_ERROR (impede PASS vazio e seleção insegura).
  let selected;
  if (args.testId) {
    const selection = selectById(manifest, args.testId, args.suite);
    if (!selection.ok) {
      return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary(selection.reason), writeTarget,
        [`CONFIG_ERROR: ${selection.reason}`]);
    }
    selected = selection.tests;
  } else {
    selected = selectTests(manifest, args.suite);
  }
  if (selected.length === 0) {
    return emit(CLASSIFICATION.CONFIG_ERROR, configErrorSummary(`nenhum teste stable selecionado para a suíte '${args.suite}'`), writeTarget,
      [`CONFIG_ERROR: nenhum teste stable selecionado para a suíte '${args.suite}'.`]);
  }

  // Execução.
  const executions = [];
  for (const test of selected) {
    // eslint-disable-next-line no-await-in-loop
    const execution = await runOneTest(test);
    writeTestEvidence(writeTarget, execution);
    executions.push(execution);
  }

  const perTest = executions.map((exec) => exec.result);
  const consolidated = worstClassification(perTest.map((r) => r.classification));

  const summary = {
    schemaVersion: 1,
    classification: consolidated,
    suite: args.suite,
    manifest: normalizeSlashes(path.relative(ROOT, manifestPath)),
    total: perTest.length,
    byClassification: PRECEDENCE.reduce((acc, level) => {
      acc[level] = perTest.filter((r) => r.classification === level).length;
      return acc;
    }, {}),
    testIds: perTest.map((r) => r.testId),
  };

  const humanLines = [
    `Gate consolidado — suíte '${args.suite}': ${consolidated}`,
    ...perTest.map((r) => `  [${r.classification}] ${r.testId} (reports ${r.reports.conforming}/${r.reports.expected}, exit ${r.process.exitCode})`),
  ];

  return emit(consolidated, summary, writeTarget, humanLines);
}

main().catch((error) => {
  process.stderr.write(`${(error && error.stack) || error}\n`);
  // Erro inesperado no próprio executor é problema de configuração/infra do gate.
  process.exitCode = EXIT_CODE.CONFIG_ERROR;
});
