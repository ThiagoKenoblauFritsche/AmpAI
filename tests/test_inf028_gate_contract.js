/**
 * O.S. INF-028-A — QA RED do contrato do Gate Consolidado local.
 *
 * Este arquivo não implementa manifesto, schema ou executor. Ele descreve o
 * contrato executável futuro e continua emitindo os 18 relatórios mesmo quando
 * as três capacidades-alvo ainda não existem.
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

const EXPECTED_STABLE = {
  core: [
    'tests/core_curto_circuito.test.js',
    'tests/test_os047.js',
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
  const fixtureIssues = validateFixtures();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ampai-inf028a-'));
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
      && tests.filter((test) => test.classification === 'stable').length === 5;
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

    reports.forEach((report) => {
      process.stdout.write(`INF028A_REPORT ${JSON.stringify(report)}\n`);
    });

    assert.equal(reports.length, 18, `INF-028-A exige exatamente 18 relatórios; obtidos: ${reports.length}.`);
    assert.deepEqual(reports.map((report) => report.case), REQUIRED_CASES, 'Ordem/conjunto de casos INF-028-A divergente.');
    assert.equal(reports.every((report) => report.assertionExercised === true), true, 'Todos os 18 casos devem exercer sua asserção.');

    if (fixtureIssues.length > 0) {
      const error = new Error(`CONFIG_ERROR: fixtures INF-028-A inválidos: ${fixtureIssues.join('; ')}`);
      error.exitCode = 3;
      throw error;
    }

    const failures = reports.filter((report) => !report.compliant);
    assert.equal(
      failures.length,
      0,
      `Gate consolidado ausente/incompleto em ${failures.length}/18 contratos: ${failures.map((report) => report.case).join(', ')}`
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = Number.isInteger(error?.exitCode) ? error.exitCode : 1;
});
