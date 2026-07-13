/**
 * O.S. INF-028-A / INC-001-06A-RF — contrato executável do Gate Consolidado.
 *
 * Este arquivo não implementa manifesto, schema ou executor. Ele descreve o
 * contrato executável futuro, preserva os 18 relatórios INF-028-A e acrescenta
 * as provas RED da promoção controlada do M16 e da taxonomia do workflow sem
 * implementar o Gate.
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const FIXTURES = path.join(__dirname, 'fixtures', 'inf028');
const MANIFEST_PATH = path.join(ROOT, 'qa', 'test-manifest.json');
const SCHEMA_PATH = path.join(ROOT, 'qa', 'test-manifest.schema.json');
const EXECUTOR_PATH = path.join(ROOT, 'scripts', 'qa', 'run-regression.js');
const AGGREGATOR_PATH = path.join(ROOT, 'scripts', 'qa', 'aggregate-results.js');
const SHADOW_WORKFLOW_PATH = path.join(ROOT, '.github', 'workflows', 'regression-gate-shadow.yml');
const DEPENDENCY_NODE_MODULES = path.dirname(path.dirname(require.resolve('ajv/package.json')));

const M16_ENTRY = {
  id: 'inc001-m16',
  file: 'tests/test_inc001_m16.js',
  classification: 'stable',
  suite: 'core',
  timeoutSeconds: 60,
  preflight: 'node',
  report: {
    protocol: 'json-lines',
    prefix: 'INC001_M16_REPORT',
    expectedCount: 24,
    complianceField: 'compliant',
    expectedValue: true,
  },
};

const EXPECTED_STABLE = {
  core: [
    'tests/core_curto_circuito.test.js',
    'tests/test_os047.js',
    M16_ENTRY.file,
  ],
  browser: [
    'tests/test_os040_restart.js',
    'tests/test_os042_restart.js',
    'tests/test_os044_restart.js',
  ],
};

const EXPECTED_EXPERIMENTAL = [
  'tests/test_os049.js',
  'tests/test_os049_e2e.js',
];

const REQUIRED_CASES = [
  'manifest-file-present',
  'manifest-schema-present',
  'manifest-schema-valid',
  'manifest-exact-stable-inventory',
  'manifest-experimental-excluded',
  'manifest-rejects-glob',
  'manifest-rejects-arbitrary-command',
  'manifest-rejects-duplicate-id',
  'executor-file-present',
  'executor-suite-filtering',
  'executor-pass-contract',
  'executor-functional-failure-contract',
  'executor-infra-blocked-contract',
  'executor-config-error-contract',
  'zero-without-reports-is-config-error',
  'wrong-report-count-is-config-error',
  'legacy-zombies-39-green-pass',
  'legacy-zombies-incomplete-or-red-blocks',
];

const PROMOTION_CASES = [
  'manifest-m16-entry-contract',
  'manifest-browser-inventory-preserved',
  'executor-official-six-stable-supported',
  'm16-missing-report-is-config-error',
  'aggregator-six-stable-pass',
  'aggregator-missing-m16-is-config-error',
  'workflow-core-fallback-includes-m16',
  'workflow-manifest-validation-exit-taxonomy',
  'operational-contract-declares-six-stable',
];

const OPERATIONAL_CONTRACT_FILES = [
  AGGREGATOR_PATH,
  SHADOW_WORKFLOW_PATH,
  path.join(ROOT, 'docs', 'AmpAI_Gate_Regressao.md'),
  path.join(ROOT, 'docs', 'api', 'INF028_Gate_Executor_SDD.md'),
  path.join(ROOT, 'README.md'),
];

const FIXTURE_EXPECTATIONS = {
  'pass.js': { exitCode: 0, prefix: 'FIXTURE_REPORT', reports: 2, conforming: 2 },
  'functional_failure.js': { exitCode: 1, prefix: 'FIXTURE_REPORT', reports: 2, conforming: 1 },
  'infra_blocked.js': { exitCode: 2, prefix: 'FIXTURE_REPORT', reports: 0, conforming: 0, infraMarker: true },
  'zero_without_reports.js': { exitCode: 0, prefix: 'FIXTURE_REPORT', reports: 0, conforming: 0 },
  'wrong_report_count.js': { exitCode: 0, prefix: 'FIXTURE_REPORT', reports: 1, conforming: 1 },
};

const LEGACY_EXPECTATIONS = {
  'legacy_pass.js': { exitCode: 0, green: 39, red: 0, total: 39 },
  'legacy_38_of_39.js': { exitCode: 0, green: 38, red: 0, total: 39 },
  'legacy_one_red.js': { exitCode: 0, green: 38, red: 1, total: 39 },
  'legacy_wrong_total.js': { exitCode: 0, green: 39, red: 0, total: 40 },
  'legacy_nonzero_exit.js': { exitCode: 1, green: 39, red: 0, total: 39 },
  'legacy_no_summary.js': { exitCode: 0, green: null, red: null, total: null },
};

function normalizeFile(value) {
  return String(value || '').replace(/\\/g, '/');
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function sameMembers(actual, expected) {
  return JSON.stringify(sorted(actual)) === JSON.stringify(sorted(expected));
}

function sameJsonValue(actual, expected) {
  try {
    assert.deepStrictEqual(actual, expected);
    return true;
  } catch (_) {
    return false;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function spawnNode(filePath, args = [], options = {}) {
  return spawnSync(process.execPath, [filePath, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });
}

function parseJsonLineReports(stdout, prefix) {
  return String(stdout || '')
    .split(/\r?\n/)
    .filter((line) => line.startsWith(`${prefix} `))
    .map((line) => JSON.parse(line.slice(prefix.length + 1)));
}

function parseLegacySummary(stdout) {
  const text = String(stdout || '');
  const value = (label) => {
    const match = new RegExp(`${label}\\s*:\\s*(\\d+)`, 'i').exec(text);
    return match ? Number(match[1]) : null;
  };
  return {
    green: value('Verdes'),
    red: value('Vermelhos'),
    total: value('Total'),
  };
}

function validateFixtures() {
  const issues = [];

  for (const [name, expected] of Object.entries(FIXTURE_EXPECTATIONS)) {
    const filePath = path.join(FIXTURES, name);
    const syntax = spawnNode(filePath, [], { timeout: 5000 });
    const reports = parseJsonLineReports(syntax.stdout, expected.prefix);
    const conforming = reports.filter((report) => report.compliant === true).length;
    if (syntax.status !== expected.exitCode) issues.push(`${name}: exit ${syntax.status}, esperado ${expected.exitCode}`);
    if (reports.length !== expected.reports) issues.push(`${name}: ${reports.length} relatórios, esperado ${expected.reports}`);
    if (conforming !== expected.conforming) issues.push(`${name}: ${conforming} conformes, esperado ${expected.conforming}`);
    if (expected.infraMarker && !String(syntax.stderr).includes('INF028_FIXTURE_INFRA')) {
      issues.push(`${name}: marcador de infraestrutura ausente`);
    }
  }

  for (const [name, expected] of Object.entries(LEGACY_EXPECTATIONS)) {
    const execution = spawnNode(path.join(FIXTURES, name), [], { timeout: 5000 });
    const summary = parseLegacySummary(execution.stdout);
    if (execution.status !== expected.exitCode) issues.push(`${name}: exit ${execution.status}, esperado ${expected.exitCode}`);
    for (const field of ['green', 'red', 'total']) {
      if (summary[field] !== expected[field]) issues.push(`${name}: ${field}=${summary[field]}, esperado ${expected[field]}`);
    }
  }

  return issues;
}

function baseEntry(id, file, suite = 'core', overrides = {}) {
  return {
    id,
    file: normalizeFile(file),
    classification: 'stable',
    suite,
    timeoutSeconds: suite === 'browser' ? 120 : 60,
    preflight: suite === 'browser' ? 'chromium' : 'node',
    report: {
      protocol: 'json-lines',
      prefix: 'FIXTURE_REPORT',
      expectedCount: 2,
      complianceField: 'compliant',
      expectedValue: true,
    },
    ...overrides,
  };
}

function fixtureFile(name) {
  return normalizeFile(path.relative(ROOT, path.join(FIXTURES, name)));
}

function writeManifest(tempDir, name, tests, overrides = {}) {
  const filePath = path.join(tempDir, `${name}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify({ schemaVersion: 1, tests, ...overrides }, null, 2)}\n`);
  return filePath;
}

function collectJsonFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const values = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      if (entry.isDirectory()) visit(child);
      else if (entry.isFile() && entry.name.endsWith('.json')) {
        try {
          values.push(readJson(child));
        } catch (error) {
          values.push({ parseError: error.message, file: child });
        }
      }
    }
  };
  visit(directory);
  return values;
}

function flattenResultObjects(value, output = []) {
  if (!value || typeof value !== 'object') return output;
  if (typeof value.classification === 'string' && (value.testId || value.schemaVersion === 1)) output.push(value);
  if (Array.isArray(value)) value.forEach((item) => flattenResultObjects(item, output));
  else Object.values(value).forEach((item) => flattenResultObjects(item, output));
  return output;
}

function parseJsonFromStdout(stdout) {
  const parsed = [];
  for (const line of String(stdout || '').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) continue;
    try {
      parsed.push(JSON.parse(trimmed));
    } catch (_) {
      // Logs humanos são permitidos; somente JSON completo é evidência processável.
    }
  }
  return parsed;
}

function runExecutor(tempDir, manifestPath, suite, label) {
  const outputDir = path.join(tempDir, `output-${label}`);
  fs.mkdirSync(outputDir, { recursive: true });
  const processResult = spawnNode(EXECUTOR_PATH, [
    '--manifest', manifestPath,
    '--suite', suite,
    '--output', outputDir,
  ], { timeout: 120000 });
  const jsonValues = [
    ...collectJsonFiles(outputDir),
    ...parseJsonFromStdout(processResult.stdout),
  ];
  return {
    exitCode: processResult.status,
    signal: processResult.signal,
    stdout: processResult.stdout,
    stderr: processResult.stderr,
    results: jsonValues.flatMap((value) => flattenResultObjects(value)),
  };
}

function futureManifestFrom(manifest) {
  const tests = Array.isArray(manifest?.tests) ? manifest.tests : [];
  return {
    schemaVersion: 1,
    tests: [
      ...tests.filter((test) => test.id !== M16_ENTRY.id),
      M16_ENTRY,
    ],
  };
}

function passResultFor(entry) {
  const expected = entry.report.expectedCount;
  return {
    schemaVersion: 1,
    testId: entry.id,
    classification: 'PASS',
    stages: {
      configValidated: true,
      dependenciesReady: true,
      preflightPassed: true,
      testStarted: true,
      assertionExercised: true,
      reportsValidated: true,
    },
    preflight: { exitCode: 0 },
    process: { exitCode: 0 },
    reports: {
      expected,
      observed: expected,
      conforming: expected,
      nonConforming: 0,
    },
  };
}

function runSixStableExecutorProbe(tempDir) {
  const probeRoot = path.join(tempDir, 'executor-six-stable');
  const scriptsDir = path.join(probeRoot, 'scripts', 'qa');
  const qaDir = path.join(probeRoot, 'qa');
  const testsDir = path.join(probeRoot, 'tests');
  const outputDir = path.join(probeRoot, 'tmp', 'output');
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.mkdirSync(qaDir, { recursive: true });
  fs.mkdirSync(testsDir, { recursive: true });
  fs.copyFileSync(EXECUTOR_PATH, path.join(scriptsDir, 'run-regression.js'));
  fs.copyFileSync(SCHEMA_PATH, path.join(qaDir, 'test-manifest.schema.json'));

  const ids = [
    'core-curto-circuito',
    'os047',
    'inc001-m16',
    'os040r',
    'os042r',
    'os044r',
  ];
  const entries = ids.map((id, index) => {
    const file = `tests/probe-${index + 1}.js`;
    fs.writeFileSync(
      path.join(probeRoot, file),
      "process.stdout.write('PROMOTION_PROBE_REPORT {\"compliant\":true}\\n');\n"
    );
    return {
      id,
      file,
      classification: 'stable',
      // Probe de capacidade do executor: seis entradas stable puramente Node.
      // O inventário real 3 core + 3 browser é protegido separadamente pelo
      // contrato do manifesto e não deve contaminar esta prova com Chromium.
      suite: 'core',
      timeoutSeconds: 60,
      preflight: 'node',
      report: {
        protocol: 'json-lines',
        prefix: 'PROMOTION_PROBE_REPORT',
        expectedCount: 1,
        complianceField: 'compliant',
        expectedValue: true,
      },
    };
  });
  fs.writeFileSync(
    path.join(qaDir, 'test-manifest.json'),
    `${JSON.stringify({ schemaVersion: 1, tests: entries }, null, 2)}\n`
  );

  const execution = spawnNode(path.join(scriptsDir, 'run-regression.js'), [
    '--manifest', path.join(qaDir, 'test-manifest.json'),
    '--suite', 'all',
    '--output', outputDir,
  ], {
    cwd: probeRoot,
    timeout: 120000,
    env: { ...process.env, NODE_PATH: DEPENDENCY_NODE_MODULES },
  });
  const values = [
    ...collectJsonFiles(outputDir),
    ...parseJsonFromStdout(execution.stdout),
  ].flatMap((value) => flattenResultObjects(value));
  return {
    exitCode: execution.status,
    stdout: execution.stdout,
    stderr: execution.stderr,
    resultIds: values.map((value) => value.testId).filter(Boolean),
    classifications: values.map((value) => value.classification).filter(Boolean),
  };
}

function runM16MissingReportProbe(tempDir) {
  const entry = {
    ...M16_ENTRY,
    file: fixtureFile('wrong_report_count.js'),
  };
  const manifestPath = writeManifest(tempDir, 'm16-missing-report', [entry]);
  return runExecutor(tempDir, manifestPath, 'core', 'm16-missing-report');
}

function runAggregatorProbe(tempDir, manifest, omittedIds, label) {
  const probeRoot = path.join(tempDir, `aggregator-${label}`);
  const scriptsDir = path.join(probeRoot, 'scripts', 'qa');
  const qaDir = path.join(probeRoot, 'qa');
  const inputDir = path.join(probeRoot, 'tmp', 'input');
  const outputDir = path.join(probeRoot, 'tmp', 'output');
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.mkdirSync(qaDir, { recursive: true });
  fs.mkdirSync(inputDir, { recursive: true });
  fs.copyFileSync(AGGREGATOR_PATH, path.join(scriptsDir, 'aggregate-results.js'));
  fs.writeFileSync(path.join(qaDir, 'test-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const omitted = new Set(omittedIds);
  const stable = manifest.tests.filter((entry) => entry.classification === 'stable');
  for (const entry of stable) {
    if (omitted.has(entry.id)) continue;
    const resultDir = path.join(inputDir, entry.id);
    fs.mkdirSync(resultDir, { recursive: true });
    fs.writeFileSync(path.join(resultDir, 'result.json'), `${JSON.stringify(passResultFor(entry), null, 2)}\n`);
  }

  const execution = spawnNode(path.join(scriptsDir, 'aggregate-results.js'), [
    '--input', inputDir,
    '--output', outputDir,
  ], { cwd: probeRoot, timeout: 30000 });
  let summary = null;
  const summaryPath = path.join(outputDir, 'summary.json');
  if (fs.existsSync(summaryPath)) {
    try { summary = readJson(summaryPath); } catch (_) { summary = null; }
  }
  return {
    exitCode: execution.status,
    stdout: execution.stdout,
    stderr: execution.stderr,
    summary,
  };
}

function staleOperationalClaims() {
  const stableFive = /\b(?:cinco|five|5)\s+(?:(?:entradas|resultados)\s+)?`?stable`?\b/i;
  const coreTwo = /\b(?:dois|two|2)\s+(?:resultados\s+|stable\s+)?core\b/i;
  const matches = [];
  for (const filePath of OPERATIONAL_CONTRACT_FILES) {
    if (!fs.existsSync(filePath)) continue;
    const relativeFile = normalizeFile(path.relative(ROOT, filePath));
    fs.readFileSync(filePath, 'utf8').split(/\r?\n/).forEach((line, index) => {
      if (stableFive.test(line) || coreTwo.test(line) || line.includes('aggregator(5 stable)')) {
        matches.push({ file: relativeFile, line: index + 1, text: line.trim() });
      }
    });
  }
  return matches;
}

function manifestValidationTaxonomyEvidence(workflowText) {
  const startMarker = 'node tests/test_inf028_gate_contract.js';
  const start = workflowText.indexOf(startMarker);
  const end = start >= 0 ? workflowText.indexOf('echo "code=$c"', start) : -1;
  const block = start >= 0 && end >= start
    ? workflowText.slice(start, end + 'echo "code=$c"'.length)
    : '';
  const mapping = { 0: null, 1: null, 2: null, 3: null, invalid: null };

  // Forma atual: um binário 0/outros. Registrá-la explicitamente torna visível
  // que 2 e 3 são indevidamente colapsados em FUNCTIONAL_FAILURE.
  const binary = /cls=\$\(\[\s*"?\$c"?\s*(?:=|==|-eq)\s*"?(\d+)"?\s*\]\s*&&\s*echo\s+([A-Z_]+)\s*\|\|\s*echo\s+([A-Z_]+)\s*\)/.exec(block);
  if (binary) {
    const matchedCode = Number(binary[1]);
    if (Object.prototype.hasOwnProperty.call(mapping, matchedCode)) mapping[matchedCode] = binary[2];
    for (const code of [0, 1, 2, 3]) {
      if (code !== matchedCode) mapping[code] = binary[3];
    }
    mapping.invalid = binary[3];
  }

  // Forma futura recomendada: case explícito. Também aceita if/elif explícito,
  // sem impor ao workflow uma única sintaxe de implementação.
  const caseArm = /^\s*(0|1|2|3)\)\s*[^\r\n]*?\b(?:cls|classification)=['"]?([A-Z_]+)['"]?/gm;
  let match;
  while ((match = caseArm.exec(block)) !== null) mapping[Number(match[1])] = match[2];
  const defaultArm = /^\s*\*\)\s*[^\r\n]*?\b(?:cls|classification)=['"]?([A-Z_]+)['"]?/m.exec(block);
  if (defaultArm) mapping.invalid = defaultArm[1];

  const explicitIf = /\b(?:if|elif)\s+\[\s*"?\$c"?\s*(?:=|==|-eq)\s*"?(0|1|2|3)"?\s*\]\s*;?\s*then[\s;]+(?:cls|classification)=['"]?([A-Z_]+)['"]?/g;
  while ((match = explicitIf.exec(block)) !== null) mapping[Number(match[1])] = match[2];
  const explicitElse = /\belse[\s;]+(?:cls|classification)=['"]?([A-Z_]+)['"]?/m.exec(block);
  if (explicitElse) mapping.invalid = explicitElse[1];

  const expected = {
    0: 'PASS',
    1: 'FUNCTIONAL_FAILURE',
    2: 'INFRA_BLOCKED',
    3: 'CONFIG_ERROR',
    invalid: 'CONFIG_ERROR',
  };
  const sourceLines = block.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /(?:cls|classification|case\s+"?\$c|^[*0-3]\))/.test(line));

  return {
    blockFound: block.length > 0,
    expected,
    observed: mapping,
    sourceLines,
    compliant: block.length > 0 && sameJsonValue(mapping, expected),
  };
}

function resultFor(execution, testId) {
  return execution.results.find((result) => result.testId === testId) || null;
}

function hasConfigError(execution) {
  return execution.exitCode === 3
    && execution.results.some((result) => result.classification === 'CONFIG_ERROR');
}

function validProcessableResult(result, expected) {
  if (!result || result.schemaVersion !== 1 || result.classification !== expected.classification) return false;
  const stages = result.stages || {};
  return typeof stages.configValidated === 'boolean'
    && typeof stages.dependenciesReady === 'boolean'
    && typeof stages.preflightPassed === 'boolean'
    && typeof stages.testStarted === 'boolean'
    && typeof stages.assertionExercised === 'boolean'
    && typeof stages.reportsValidated === 'boolean'
    && Number.isInteger(result.preflight?.exitCode)
    && Number.isInteger(result.process?.exitCode)
    && Number.isInteger(result.reports?.expected)
    && Number.isInteger(result.reports?.observed)
    && Number.isInteger(result.reports?.conforming)
    && Number.isInteger(result.reports?.nonConforming)
    && Object.entries(expected.stages || {}).every(([key, value]) => stages[key] === value)
    && Object.entries(expected.reports || {}).every(([key, value]) => result.reports[key] === value)
    && (expected.processExit === undefined || result.process.exitCode === expected.processExit)
    && (expected.preflightExit === undefined || result.preflight.exitCode === expected.preflightExit);
}

function schemaShapeIsValid(schema) {
  const required = schema?.required || [];
  const testItem = schema?.properties?.tests?.items;
  const testRequired = testItem?.required || [];
  return typeof schema?.$schema === 'string'
    && schema.type === 'object'
    && schema.additionalProperties === false
    && required.includes('schemaVersion')
    && required.includes('tests')
    && schema.properties?.schemaVersion?.const === 1
    && schema.properties?.tests?.type === 'array'
    && testItem?.type === 'object'
    && testItem?.additionalProperties === false
    && ['id', 'file', 'classification', 'suite', 'timeoutSeconds', 'preflight', 'report']
      .every((field) => testRequired.includes(field));
}

function createReport(caseName, target, capabilityPresent, expectedClassification, observedClassification, compliant, observed = {}) {
  return {
    case: caseName,
    target,
    capabilityPresent,
    assertionExercised: true,
    expectedClassification,
    observedClassification,
    compliant,
    observed,
  };
}

async function main() {
  const reports = [];
  const promotionReports = [];
  const fixtureIssues = validateFixtures();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ampai-inc001-06a-'));
  const manifestPresent = fs.existsSync(MANIFEST_PATH);
  const schemaPresent = fs.existsSync(SCHEMA_PATH);
  const executorPresent = fs.existsSync(EXECUTOR_PATH);
  let manifest = null;
  let schema = null;

  try {
    if (manifestPresent) {
      try { manifest = readJson(MANIFEST_PATH); } catch (_) { manifest = null; }
    }
    if (schemaPresent) {
      try { schema = readJson(SCHEMA_PATH); } catch (_) { schema = null; }
    }

    reports.push(createReport(
      'manifest-file-present', 'manifest', manifestPresent, 'PASS',
      manifestPresent ? 'PASS' : 'CONFIG_ERROR', manifestPresent,
      { path: normalizeFile(path.relative(ROOT, MANIFEST_PATH)) }
    ));

    reports.push(createReport(
      'manifest-schema-present', 'schema', schemaPresent, 'PASS',
      schemaPresent ? 'PASS' : 'CONFIG_ERROR', schemaPresent,
      { path: normalizeFile(path.relative(ROOT, SCHEMA_PATH)) }
    ));

    const schemaValid = schemaPresent && manifestPresent && Boolean(schema) && Boolean(manifest) && schemaShapeIsValid(schema);
    reports.push(createReport(
      'manifest-schema-valid', 'schema', schemaPresent && manifestPresent, 'PASS',
      schemaValid ? 'PASS' : 'CONFIG_ERROR', schemaValid,
      { schemaParsed: Boolean(schema), manifestParsed: Boolean(manifest), schemaShapeValid: Boolean(schema && schemaShapeIsValid(schema)) }
    ));

    const tests = Array.isArray(manifest?.tests) ? manifest.tests : [];
    const stableCore = tests.filter((test) => test.classification === 'stable' && test.suite === 'core').map((test) => normalizeFile(test.file));
    const stableBrowser = tests.filter((test) => test.classification === 'stable' && test.suite === 'browser').map((test) => normalizeFile(test.file));
    const exactInventory = manifestPresent
      && sameMembers(stableCore, EXPECTED_STABLE.core)
      && sameMembers(stableBrowser, EXPECTED_STABLE.browser)
      && tests.filter((test) => test.classification === 'stable').length === 6;
    reports.push(createReport(
      'manifest-exact-stable-inventory', 'manifest', manifestPresent, 'PASS',
      exactInventory ? 'PASS' : 'CONFIG_ERROR', exactInventory,
      { stableCore, stableBrowser }
    ));

    const experimental = tests.filter((test) => test.classification === 'experimental').map((test) => normalizeFile(test.file));
    const experimentalExcluded = manifestPresent
      && EXPECTED_EXPERIMENTAL.every((file) => experimental.includes(file))
      && EXPECTED_EXPERIMENTAL.every((file) => !stableCore.includes(file) && !stableBrowser.includes(file));
    reports.push(createReport(
      'manifest-experimental-excluded', 'manifest', manifestPresent, 'PASS',
      experimentalExcluded ? 'PASS' : 'CONFIG_ERROR', experimentalExcluded,
      { experimental }
    ));

    const passEntry = baseEntry('fixture-pass', fixtureFile('pass.js'));
    const invalidGlob = writeManifest(tempDir, 'invalid-glob', [{ ...passEntry, file: 'tests/*.js' }]);
    const invalidCommand = writeManifest(tempDir, 'invalid-command', [{ ...passEntry, command: 'node arbitrary.js' }]);
    const duplicateId = writeManifest(tempDir, 'duplicate-id', [passEntry, { ...passEntry, file: fixtureFile('wrong_report_count.js') }]);

    for (const [caseName, manifestPath] of [
      ['manifest-rejects-glob', invalidGlob],
      ['manifest-rejects-arbitrary-command', invalidCommand],
      ['manifest-rejects-duplicate-id', duplicateId],
    ]) {
      const capable = executorPresent && schemaPresent;
      const execution = capable ? runExecutor(tempDir, manifestPath, 'core', caseName) : null;
      const compliant = capable && hasConfigError(execution);
      reports.push(createReport(
        caseName, 'manifest', capable, 'CONFIG_ERROR',
        execution?.results.find((result) => result.classification)?.classification || 'CONFIG_ERROR',
        compliant,
        { exitCode: execution?.exitCode ?? null, resultCount: execution?.results.length ?? 0 }
      ));
    }

    const executorSyntax = executorPresent
      ? spawnSync(process.execPath, ['--check', EXECUTOR_PATH], { cwd: ROOT, encoding: 'utf8', timeout: 5000 })
      : null;
    const executorFileValid = executorPresent && executorSyntax.status === 0;
    reports.push(createReport(
      'executor-file-present', 'executor', executorPresent, 'PASS',
      executorFileValid ? 'PASS' : 'CONFIG_ERROR', executorFileValid,
      { path: normalizeFile(path.relative(ROOT, EXECUTOR_PATH)), syntaxExitCode: executorSyntax?.status ?? null }
    ));

    const filterManifest = writeManifest(tempDir, 'filtering', [
      baseEntry('core-a', fixtureFile('pass.js'), 'core'),
      baseEntry('browser-a', fixtureFile('pass.js'), 'browser'),
      baseEntry('experimental-a', fixtureFile('pass.js'), 'core', { classification: 'experimental' }),
    ]);
    const filterExecution = executorPresent ? runExecutor(tempDir, filterManifest, 'core', 'filtering') : null;
    const filterIds = filterExecution?.results.map((result) => result.testId).filter(Boolean) || [];
    const filteringWorks = executorPresent
      && filterExecution.exitCode === 0
      && sameMembers(filterIds, ['core-a']);
    reports.push(createReport(
      'executor-suite-filtering', 'executor', executorPresent, 'PASS',
      filteringWorks ? 'PASS' : 'CONFIG_ERROR', filteringWorks,
      { exitCode: filterExecution?.exitCode ?? null, observedTestIds: filterIds }
    ));

    const passManifest = writeManifest(tempDir, 'pass', [passEntry]);
    const passExecution = executorPresent ? runExecutor(tempDir, passManifest, 'core', 'pass') : null;
    const passResult = passExecution ? resultFor(passExecution, 'fixture-pass') : null;
    const passWorks = executorPresent
      && passExecution.exitCode === 0
      && validProcessableResult(passResult, {
        classification: 'PASS',
        stages: { configValidated: true, dependenciesReady: true, preflightPassed: true, testStarted: true, assertionExercised: true, reportsValidated: true },
        reports: { expected: 2, observed: 2, conforming: 2, nonConforming: 0 },
        processExit: 0,
        preflightExit: 0,
      });
    reports.push(createReport(
      'executor-pass-contract', 'executor', executorPresent, 'PASS',
      passResult?.classification || 'CONFIG_ERROR', passWorks,
      { exitCode: passExecution?.exitCode ?? null, result: passResult }
    ));

    const functionalEntry = baseEntry('fixture-functional', fixtureFile('functional_failure.js'));
    const functionalManifest = writeManifest(tempDir, 'functional', [functionalEntry]);
    const functionalExecution = executorPresent ? runExecutor(tempDir, functionalManifest, 'core', 'functional') : null;
    const functionalResult = functionalExecution ? resultFor(functionalExecution, 'fixture-functional') : null;
    const functionalWorks = executorPresent
      && functionalExecution.exitCode === 1
      && validProcessableResult(functionalResult, {
        classification: 'FUNCTIONAL_FAILURE',
        stages: { configValidated: true, dependenciesReady: true, preflightPassed: true, testStarted: true, assertionExercised: true, reportsValidated: true },
        reports: { expected: 2, observed: 2, conforming: 1, nonConforming: 1 },
        processExit: 1,
        preflightExit: 0,
      });
    reports.push(createReport(
      'executor-functional-failure-contract', 'executor', executorPresent, 'FUNCTIONAL_FAILURE',
      functionalResult?.classification || 'CONFIG_ERROR', functionalWorks,
      { exitCode: functionalExecution?.exitCode ?? null, result: functionalResult }
    ));

    const infraEntry = baseEntry('fixture-infra', fixtureFile('infra_blocked.js'), 'core', {
      report: { ...passEntry.report, expectedCount: 1 },
    });
    const infraManifest = writeManifest(tempDir, 'infra', [infraEntry]);
    const infraExecution = executorPresent ? runExecutor(tempDir, infraManifest, 'core', 'infra') : null;
    const infraResult = infraExecution ? resultFor(infraExecution, 'fixture-infra') : null;
    const infraWorks = executorPresent
      && infraExecution.exitCode === 2
      && validProcessableResult(infraResult, {
        classification: 'INFRA_BLOCKED',
        stages: { configValidated: true, dependenciesReady: false, preflightPassed: false, testStarted: false, assertionExercised: false, reportsValidated: false },
        reports: { expected: 1, observed: 0, conforming: 0, nonConforming: 0 },
        processExit: 2,
      });
    reports.push(createReport(
      'executor-infra-blocked-contract', 'executor', executorPresent, 'INFRA_BLOCKED',
      infraResult?.classification || 'CONFIG_ERROR', infraWorks,
      { exitCode: infraExecution?.exitCode ?? null, result: infraResult }
    ));

    const missingEntry = baseEntry('fixture-missing', 'tests/fixtures/inf028/does-not-exist.js');
    const missingManifest = writeManifest(tempDir, 'missing', [missingEntry]);
    const missingExecution = executorPresent ? runExecutor(tempDir, missingManifest, 'core', 'missing') : null;
    const configWorks = executorPresent && hasConfigError(missingExecution);
    reports.push(createReport(
      'executor-config-error-contract', 'executor', executorPresent, 'CONFIG_ERROR',
      missingExecution?.results.find((result) => result.classification)?.classification || 'CONFIG_ERROR',
      configWorks,
      { exitCode: missingExecution?.exitCode ?? null }
    ));

    for (const scenario of [
      { caseName: 'zero-without-reports-is-config-error', id: 'fixture-zero', file: 'zero_without_reports.js', expectedCount: 2 },
      { caseName: 'wrong-report-count-is-config-error', id: 'fixture-wrong-count', file: 'wrong_report_count.js', expectedCount: 2 },
    ]) {
      const entry = baseEntry(scenario.id, fixtureFile(scenario.file), 'core', {
        report: { ...passEntry.report, expectedCount: scenario.expectedCount },
      });
      const scenarioManifest = writeManifest(tempDir, scenario.caseName, [entry]);
      const execution = executorPresent ? runExecutor(tempDir, scenarioManifest, 'core', scenario.caseName) : null;
      const compliant = executorPresent && hasConfigError(execution);
      reports.push(createReport(
        scenario.caseName, 'executor', executorPresent, 'CONFIG_ERROR',
        execution?.results.find((result) => result.classification)?.classification || 'CONFIG_ERROR',
        compliant,
        { exitCode: execution?.exitCode ?? null, expectedCount: scenario.expectedCount }
      ));
    }

    const legacyReport = {
      protocol: 'legacy-zombies',
      expectedCount: 39,
      greenLabel: 'Verdes',
      redLabel: 'Vermelhos',
      totalLabel: 'Total',
    };
    const legacyPassEntry = baseEntry('legacy-pass', fixtureFile('legacy_pass.js'), 'core', { report: legacyReport });
    const legacyPassManifest = writeManifest(tempDir, 'legacy-pass', [legacyPassEntry]);
    const legacyPassExecution = executorPresent ? runExecutor(tempDir, legacyPassManifest, 'core', 'legacy-pass') : null;
    const legacyPassResult = legacyPassExecution ? resultFor(legacyPassExecution, 'legacy-pass') : null;
    const legacyPassWorks = executorPresent
      && legacyPassExecution.exitCode === 0
      && validProcessableResult(legacyPassResult, {
        classification: 'PASS',
        stages: { configValidated: true, dependenciesReady: true, preflightPassed: true, testStarted: true, assertionExercised: true, reportsValidated: true },
        reports: { expected: 39, observed: 39, conforming: 39, nonConforming: 0 },
        processExit: 0,
        preflightExit: 0,
      });
    reports.push(createReport(
      'legacy-zombies-39-green-pass', 'legacy-adapter', executorPresent, 'PASS',
      legacyPassResult?.classification || 'CONFIG_ERROR', legacyPassWorks,
      { exitCode: legacyPassExecution?.exitCode ?? null, result: legacyPassResult }
    ));

    const legacyBlockedScenarios = [
      { id: 'legacy-38', file: 'legacy_38_of_39.js', classification: 'CONFIG_ERROR' },
      { id: 'legacy-red', file: 'legacy_one_red.js', classification: 'FUNCTIONAL_FAILURE' },
      { id: 'legacy-total', file: 'legacy_wrong_total.js', classification: 'CONFIG_ERROR' },
      { id: 'legacy-exit', file: 'legacy_nonzero_exit.js', classification: 'FUNCTIONAL_FAILURE' },
      { id: 'legacy-no-summary', file: 'legacy_no_summary.js', classification: 'CONFIG_ERROR' },
    ];
    const legacyObserved = [];
    let legacyBlockedWorks = executorPresent;
    for (const scenario of legacyBlockedScenarios) {
      if (!executorPresent) break;
      const entry = baseEntry(scenario.id, fixtureFile(scenario.file), 'core', { report: legacyReport });
      const scenarioManifest = writeManifest(tempDir, scenario.id, [entry]);
      const execution = runExecutor(tempDir, scenarioManifest, 'core', scenario.id);
      const result = resultFor(execution, scenario.id);
      const blocked = result?.classification === scenario.classification && execution.exitCode !== 0;
      legacyBlockedWorks = legacyBlockedWorks && blocked;
      legacyObserved.push({
        id: scenario.id,
        expectedClassification: scenario.classification,
        observedClassification: result?.classification || null,
        exitCode: execution.exitCode,
      });
    }
    reports.push(createReport(
      'legacy-zombies-incomplete-or-red-blocks', 'legacy-adapter', executorPresent,
      'FUNCTIONAL_FAILURE|CONFIG_ERROR', legacyBlockedWorks ? 'BLOCKED' : 'CONFIG_ERROR',
      legacyBlockedWorks,
      { scenarios: legacyObserved }
    ));

    const m16ManifestEntry = tests.find((test) => test.id === M16_ENTRY.id) || null;
    const m16EntryCompliant = manifestPresent && sameJsonValue(m16ManifestEntry, M16_ENTRY);
    promotionReports.push(createReport(
      'manifest-m16-entry-contract', 'manifest', manifestPresent, 'PASS',
      m16EntryCompliant ? 'PASS' : 'CONFIG_ERROR', m16EntryCompliant,
      { expected: M16_ENTRY, observed: m16ManifestEntry }
    ));

    const browserInventoryPreserved = manifestPresent
      && stableBrowser.length === 3
      && sameMembers(stableBrowser, EXPECTED_STABLE.browser);
    promotionReports.push(createReport(
      'manifest-browser-inventory-preserved', 'manifest', manifestPresent, 'PASS',
      browserInventoryPreserved ? 'PASS' : 'CONFIG_ERROR', browserInventoryPreserved,
      { expected: EXPECTED_STABLE.browser, observed: stableBrowser }
    ));

    const sixStableExecution = executorPresent && schemaPresent
      ? runSixStableExecutorProbe(tempDir)
      : null;
    const sixStableIds = [...new Set(sixStableExecution?.resultIds || [])];
    const executorSupportsSix = Boolean(sixStableExecution)
      && sixStableExecution.exitCode === 0
      && sameMembers(sixStableIds, [
        'core-curto-circuito', 'os047', 'inc001-m16', 'os040r', 'os042r', 'os044r',
      ])
      && (sixStableExecution.classifications || []).every((value) => value === 'PASS');
    promotionReports.push(createReport(
      'executor-official-six-stable-supported', 'executor', Boolean(sixStableExecution), 'PASS',
      executorSupportsSix ? 'PASS' : 'CONFIG_ERROR', executorSupportsSix,
      {
        exitCode: sixStableExecution?.exitCode ?? null,
        resultIds: sixStableIds,
        classifications: sixStableExecution?.classifications || [],
        syntheticSuite: 'core',
        syntheticPreflight: 'node',
        chromiumRequired: false,
        stderr: String(sixStableExecution?.stderr || '').trim(),
        stdout: String(sixStableExecution?.stdout || '').trim(),
      }
    ));

    const m16MissingExecution = executorPresent
      ? runM16MissingReportProbe(tempDir)
      : null;
    const m16MissingResult = m16MissingExecution
      ? resultFor(m16MissingExecution, M16_ENTRY.id)
      : null;
    const missingM16ReportBlocked = Boolean(m16MissingExecution)
      && m16MissingExecution.exitCode === 3
      && m16MissingResult?.classification === 'CONFIG_ERROR'
      && m16MissingResult?.reports?.expected === 24
      && m16MissingResult?.reports?.observed === 0;
    promotionReports.push(createReport(
      'm16-missing-report-is-config-error', 'executor', Boolean(m16MissingExecution), 'CONFIG_ERROR',
      m16MissingResult?.classification || 'CONFIG_ERROR', missingM16ReportBlocked,
      {
        exitCode: m16MissingExecution?.exitCode ?? null,
        expectedReports: 24,
        observedReports: m16MissingResult?.reports?.observed ?? null,
        result: m16MissingResult,
      }
    ));

    const futureManifest = manifest ? futureManifestFrom(manifest) : null;
    const aggregateFull = futureManifest && fs.existsSync(AGGREGATOR_PATH)
      ? runAggregatorProbe(tempDir, futureManifest, [], 'full-six')
      : null;
    const fullSummary = aggregateFull?.summary || null;
    const aggregateSixPasses = Boolean(aggregateFull)
      && aggregateFull.exitCode === 0
      && fullSummary?.classification === 'PASS'
      && fullSummary?.counts?.core === 3
      && fullSummary?.counts?.browser === 3
      && Array.isArray(fullSummary?.expectedStableIds)
      && fullSummary.expectedStableIds.length === 6
      && Array.isArray(fullSummary?.issues)
      && fullSummary.issues.length === 0;
    promotionReports.push(createReport(
      'aggregator-six-stable-pass', 'aggregator', Boolean(aggregateFull), 'PASS',
      fullSummary?.classification || 'CONFIG_ERROR', aggregateSixPasses,
      {
        exitCode: aggregateFull?.exitCode ?? null,
        classification: fullSummary?.classification || null,
        counts: fullSummary?.counts || null,
        expectedStableIds: fullSummary?.expectedStableIds || [],
        issues: fullSummary?.issues || [],
      }
    ));

    const aggregateMissingM16 = futureManifest && fs.existsSync(AGGREGATOR_PATH)
      ? runAggregatorProbe(tempDir, futureManifest, [M16_ENTRY.id], 'missing-m16')
      : null;
    const missingSummary = aggregateMissingM16?.summary || null;
    const aggregateBlocksMissingM16 = Boolean(aggregateMissingM16)
      && aggregateMissingM16.exitCode === 3
      && missingSummary?.classification === 'CONFIG_ERROR'
      && missingSummary?.artifacts?.absent?.includes(M16_ENTRY.id)
      && Array.isArray(missingSummary?.issues)
      && missingSummary.issues.some((issue) => issue.includes(M16_ENTRY.id));
    promotionReports.push(createReport(
      'aggregator-missing-m16-is-config-error', 'aggregator', Boolean(aggregateMissingM16), 'CONFIG_ERROR',
      missingSummary?.classification || 'CONFIG_ERROR', aggregateBlocksMissingM16,
      {
        exitCode: aggregateMissingM16?.exitCode ?? null,
        classification: missingSummary?.classification || null,
        absent: missingSummary?.artifacts?.absent || [],
        issues: missingSummary?.issues || [],
      }
    ));

    const workflowPresent = fs.existsSync(SHADOW_WORKFLOW_PATH);
    const workflowText = workflowPresent ? fs.readFileSync(SHADOW_WORKFLOW_PATH, 'utf8') : '';
    const fallbackLine = workflowText.split(/\r?\n/).find(
      (line) => line.includes('tmp/qa-results/core core-curto-circuito')
    ) || '';
    const fallbackMatch = /tmp\/qa-results\/core\s+([a-z0-9-]+(?:\s+[a-z0-9-]+)*)\s*$/i.exec(fallbackLine.trim());
    const fallbackIds = fallbackMatch ? fallbackMatch[1].trim().split(/\s+/) : [];
    const expectedCoreIds = ['core-curto-circuito', 'os047', M16_ENTRY.id];
    const workflowFallbackCompliant = workflowPresent && sameMembers(fallbackIds, expectedCoreIds);
    promotionReports.push(createReport(
      'workflow-core-fallback-includes-m16', 'workflow', workflowPresent, 'PASS',
      workflowFallbackCompliant ? 'PASS' : 'CONFIG_ERROR', workflowFallbackCompliant,
      { expectedCoreIds, observedCoreIds: fallbackIds, sourceLine: fallbackLine.trim() }
    ));

    const taxonomy = manifestValidationTaxonomyEvidence(workflowText);
    promotionReports.push(createReport(
      'workflow-manifest-validation-exit-taxonomy', 'workflow', workflowPresent, 'PASS',
      taxonomy.compliant ? 'PASS' : 'CONFIG_ERROR', taxonomy.compliant,
      {
        blockFound: taxonomy.blockFound,
        expectedMapping: taxonomy.expected,
        observedMapping: taxonomy.observed,
        sourceLines: taxonomy.sourceLines,
      }
    ));

    const staleClaims = staleOperationalClaims();
    const operationalContractCompliant = OPERATIONAL_CONTRACT_FILES.every((filePath) => fs.existsSync(filePath))
      && staleClaims.length === 0;
    promotionReports.push(createReport(
      'operational-contract-declares-six-stable', 'operations-and-documentation',
      OPERATIONAL_CONTRACT_FILES.every((filePath) => fs.existsSync(filePath)), 'PASS',
      operationalContractCompliant ? 'PASS' : 'CONFIG_ERROR', operationalContractCompliant,
      { staleFiveStableOrTwoCoreClaims: staleClaims }
    ));

    reports.forEach((report) => {
      process.stdout.write(`INF028A_REPORT ${JSON.stringify(report)}\n`);
    });
    promotionReports.forEach((report) => {
      process.stdout.write(`INC001_06A_REPORT ${JSON.stringify(report)}\n`);
    });

    assert.equal(reports.length, 18, `INF-028-A exige exatamente 18 relatórios; obtidos: ${reports.length}.`);
    assert.deepEqual(reports.map((report) => report.case), REQUIRED_CASES, 'Ordem/conjunto de casos INF-028-A divergente.');
    assert.equal(reports.every((report) => report.assertionExercised === true), true, 'Todos os 18 casos devem exercer sua asserção.');
    assert.equal(promotionReports.length, 9, `INC-001-06A/RF exige exatamente 9 relatórios; obtidos: ${promotionReports.length}.`);
    assert.deepEqual(
      promotionReports.map((report) => report.case),
      PROMOTION_CASES,
      'Ordem/conjunto de casos INC-001-06A divergente.'
    );
    assert.equal(
      promotionReports.every((report) => report.assertionExercised === true),
      true,
      'Todos os 9 casos INC-001-06A/RF devem exercer sua asserção.'
    );

    if (fixtureIssues.length > 0) {
      const error = new Error(`CONFIG_ERROR: fixtures INF-028-A inválidos: ${fixtureIssues.join('; ')}`);
      error.exitCode = 3;
      throw error;
    }

    const failures = [...reports, ...promotionReports].filter((report) => !report.compliant);
    if (failures.length > 0) {
      const error = new assert.AssertionError({
        message: `CONFIG_ERROR: promoção M16 ausente/incompleta em ${failures.length}/27 contratos: ${failures.map((report) => report.case).join(', ')}`,
        actual: failures.length,
        expected: 0,
        operator: 'strictEqual',
      });
      error.exitCode = 3;
      throw error;
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = Number.isInteger(error?.exitCode) ? error.exitCode : 1;
});
