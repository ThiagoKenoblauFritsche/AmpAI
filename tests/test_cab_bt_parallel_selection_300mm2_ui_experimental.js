/**
 * O.S. CAB-BT-PARALLEL-003-QA-RED-UI-300MM2-EXP-R1
 *
 * RED visual experimental da interface prática de seleção paralela BT.
 * Abre a página real, observa apenas motores/envelopes reais e nunca cria UI,
 * substitui resultado ou reproduz fórmulas científicas.
 */
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const REPORT_PREFIX = 'CAB_BT_PARALLEL_300_UI_EXP_REPORT';
const SUMMARY_PREFIX = 'CAB_BT_PARALLEL_300_UI_EXP_SUMMARY';
const CATEGORY = 'visual_300mm2_experimental';
const NOTICE = 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.';
const RAW_NOTICE = 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO';
const POLICY = Object.freeze({
  mode: 'MINIMUM_PASSING_PER_SECTION',
  confirmed: true,
  provenance: 'CEO_APPROVED_PRESENTATION_POLICY',
});
const TRANSLATIONS = Object.freeze({
  warning: Object.freeze({ pt: NOTICE, en: 'PRELIMINARY — DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION.', es: 'PRELIMINAR — NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN.' }),
  installation: Object.freeze({ pt: 'Instalação autorizada: NÃO', en: 'Installation authorized: NO', es: 'Instalación autorizada: NO' }),
  production: Object.freeze({ pt: 'Estado de produção: BLOQUEADO', en: 'Production state: BLOCKED', es: 'Estado de producción: BLOQUEADO' }),
  source: Object.freeze({ pt: 'Fonte primária IEC integral: AUSENTE — sem conformidade IEC', en: 'Full primary IEC source: ABSENT — no IEC conformity', es: 'Fuente primaria IEC íntegra: AUSENTE — sin conformidad IEC' }),
  assumptions: Object.freeze({ pt: 'Hipóteses (ASSUMPTION_ONLY)', en: 'Assumptions (ASSUMPTION_ONLY)', es: 'Hipótesis (ASSUMPTION_ONLY)' }),
  blockers: Object.freeze({ pt: 'Bloqueadores', en: 'Blockers', es: 'Bloqueadores' }),
  confirmedInputs: Object.freeze({ pt: 'Entradas confirmadas', en: 'Confirmed inputs', es: 'Entradas confirmadas' }),
  heading: Object.freeze({ pt: 'Menor quantidade que atende por seção no intervalo avaliado', en: 'Smallest quantity meeting the criteria per section within the evaluated range', es: 'Menor cantidad que cumple por sección en el intervalo evaluado' }),
  criteria: Object.freeze({ pt: 'Critérios: ampacidade, queda de tensão, curto-circuito', en: 'Criteria: ampacity, voltage drop, short-circuit', es: 'Criterios: ampacidad, caída de tensión, cortocircuito' }),
  printLabel: Object.freeze({ pt: 'Impressão preliminar — não é memorial final', en: 'Preliminary print — not a final report', es: 'Impresión preliminar — no es memoria final' }),
});
const CLOSED_LANGUAGE_MARKERS = Object.freeze({
  pt: Object.freeze(['DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION', 'Installation authorized: NO', 'Production state: BLOCKED', 'voltage drop', 'not a final report', 'NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN', 'Instalación autorizada: NO', 'Estado de producción: BLOQUEADO', 'caída de tensión', 'no es memoria final']),
  en: Object.freeze(['NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO', 'Instalação autorizada: NÃO', 'Estado de produção: BLOQUEADO', 'queda de tensão', 'não é memorial final', 'NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN', 'Instalación autorizada: NO', 'Estado de producción: BLOQUEADO', 'caída de tensión', 'no es memoria final']),
  es: Object.freeze(['NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO', 'Instalação autorizada: NÃO', 'Estado de produção: BLOQUEADO', 'queda de tensão', 'não é memorial final', 'DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION', 'Installation authorized: NO', 'Production state: BLOCKED', 'voltage drop', 'not a final report']),
});
const SELECTION_MODULE = path.join(ROOT, 'js', 'core_cabos_bt_parallel_selection_experimental.js');
const SELECTION_EXPORT = 'enumerateCablingBTParallelAlternativesExperimental';
const IDS = Array.from({ length: 15 }, (_unused, index) => `UI300-${String(index + 1).padStart(2, '0')}`);
const OBJECTIVE_TOPS = {
  NONE: '2x185',
  MIN_PARALLEL_COUNT: '2x300',
  MIN_TOTAL_COPPER: '3x120',
  MAX_MINIMUM_MARGIN: '2x300',
};
const SHARED_METADATA = Object.freeze({
  insulation: 'LAB_UNSPECIFIED', installationMethod: 'LAB_UNSPECIFIED', units: 'SI',
  source: 'LAB_CATALOG', sourceVersion: 'PRELIM-1',
});
const CATALOG_METADATA = Object.freeze({
  mode: 'CATALOGO_LAB_ASSUMPTION_ONLY',
  source: 'CAB_BT_PARALLEL_SELECTION_PRELIM_Memorial.md',
  sourceVersion: '122b885db40f69b422dac8ea4c2e419dc547220f',
  provenance: 'ASSUMPTION_ONLY',
  impedanceBasis: {
    length_m: 100,
    description: 'Z(S)=2.25/S+j0.008 ohm; laboratory placeholder',
    provenance: 'ASSUMPTION_ONLY',
  },
});
function expectedCandidate(section_mm2, tabulatedAmpacity_A, resistance_ohm) {
  return {
    section_mm2, tabulatedAmpacity_A, material: 'COPPER_LAB',
    insulation: SHARED_METADATA.insulation,
    installationMethod: SHARED_METADATA.installationMethod,
    referenceTemperature_C: 30, units: SHARED_METADATA.units,
    source: SHARED_METADATA.source, sourceVersion: SHARED_METADATA.sourceVersion,
    provenance: 'ASSUMPTION_ONLY', resistance_ohm, reactance_ohm: 0.008,
  };
}
const EXPECTED_CATALOG = Object.freeze([
  expectedCandidate(95, 240, 0.02368421052631579),
  expectedCandidate(120, 285, 0.01875),
  expectedCandidate(150, 330, 0.015),
  expectedCandidate(185, 380, 0.012162162162162163),
  expectedCandidate(240, 445, 0.009375),
  expectedCandidate(300, 516, 0.0075),
]);
const EDIT_CASES = Object.freeze([
  ['UI300-05-CASE-01', 'section', 'section_mm2', 310],
  ['UI300-05-CASE-02', 'ampacity', 'tabulatedAmpacity_A', 521],
  ['UI300-05-CASE-03', 'r', 'resistance_ohm', 0.0076],
  ['UI300-05-CASE-04', 'x', 'reactance_ohm', 0.0081],
  ['UI300-05-CASE-05', 'temp', 'referenceTemperature_C', 31],
  ['UI300-05-CASE-06', 'material', 'material', 'COPPER_LAB_EDITED'],
  ['UI300-05-CASE-07', 'provenance', 'provenance', 'ASSUMPTION_ONLY_EDITED'],
]);
const ERROR_CASE_IDS = Object.freeze(Array.from({ length: 5 }, (_unused, index) => `UI300-12-CASE-${String(index + 1).padStart(2, '0')}`));
const LOCALE_CASE_IDS = Object.freeze(['UI300-13-CASE-01', 'UI300-13-CASE-02', 'UI300-13-CASE-03']);
const RESPONSIVE_CASE_IDS = Object.freeze(Array.from({ length: 4 }, (_unused, index) => `UI300-14-CASE-${String(index + 1).padStart(2, '0')}`));
const FORBIDDEN_PATTERNS = Object.freeze({
  pt: Object.freeze([
    ['recommended', '\\brecomendad[oa]\\b'], ['selected', '\\bselecionad[oa]\\b'],
    ['final_solution', 'solucao final'], ['iec_conformity', 'conforme iec'],
    ['productive_release', 'liberad[oa] para (?:projeto|compra|instalacao)'],
  ]),
  en: Object.freeze([
    ['recommended', '\\brecommended\\b'], ['selected', '\\bselected\\b'],
    ['final_solution', 'final solution'], ['iec_conformity', 'iec (?:compliant|conformant)'],
    ['productive_release', '(?:released|approved) for (?:design|purchase|installation)'],
  ]),
  es: Object.freeze([
    ['recommended', '\\brecomendad[oa]\\b'], ['selected', '\\bseleccionad[oa]\\b'],
    ['final_solution', 'solucion final'], ['iec_conformity', 'conforme con iec'],
    ['productive_release', '(?:liberad[oa]|aprobad[oa]) para (?:proyecto|compra|instalacion)'],
  ]),
});
const CEO_FIXTURE = {
  totalLoadCurrent_A: 600,
  lineVoltage_V: 400,
  maximumVoltageDrop_percent: 3,
};
const BT_PRODUCTIVE_FIXTURE = {
  'bt-method': 'C',
  'bt-phases': '3',
  'bt-ib': '100',
  'bt-in': '125',
  'bt-ull': '380',
  'bt-length': '50',
  'bt-cosphi': '0.92',
  'bt-du-max': '3',
  'bt-tamb': '30',
  'bt-ncirc': '1',
  'bt-icc': '10',
  'bt-tprot': '0.2',
};
const REGION_SELECTORS = [
  '[data-cab-bt-parallel-selection-experimental]',
  '[data-experimental-module="cab-bt-parallel-selection"]',
  '#cab-bt-parallel-selection-experimental',
  '#cab-bt-parallel-selection-lab',
];

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const LEGACY_CONTRACTS = {
  'UI-01': { contract: 'seção experimental isolada e BT produtivo preservado' },
  'UI-02': { contract: 'aviso experimental literal permanente', notice: NOTICE },
  'UI-03': { contract: 'entradas práticas prioritárias', fixture: CEO_FIXTURE },
  'UI-04': { contract: 'catálogo e hipóteses visíveis e confirmáveis', temperatureUnit: '°C' },
  'UI-05': { contract: 'alternativas n × S por fase vindas de presentationModel' },
  'UI-06': { contract: 'ampacidade, queda e curto observáveis por alternativa' },
  'UI-07': { contract: 'dominantCriteria projetado sem perda de empates' },
  'UI-08': { contract: 'quatro objetivos somente reordenam apresentação', objectiveTops: OBJECTIVE_TOPS },
  'UI-09': { contract: 'todas as alternativas e fronteira permanecem acessíveis' },
  'UI-10': { contract: 'instalação explicitamente não autorizada' },
  'UI-11': { contract: 'vocabulário produtivo e normativo proibido' },
  'UI-12': { contract: 'PT/EN/ES sem vazamento indevido' },
  'UI-13': { contract: 'landmark, labels, teclado, foco e eventos não inline' },
  'UI-14': { contract: 'mobile 375 e temas claro/escuro sem overflow' },
  'UI-15': { contract: 'árvore imprimível experimental completa e não normativa' },
};

const CONTRACTS = Object.freeze(Object.fromEntries(IDS.map((id, index) => [id, { contractNumber: index + 1 }])));
const REPORT_KEYS = ['id', 'category', 'classification', 'compliant', 'assertionExercised', 'expected', 'observed', 'telemetry', 'issues'];
const TELEMETRY_KEYS = ['pageLoaded', 'consoleErrors', 'pageErrors', 'invalidTokens'];
const CASE_KEYS = ['caseId', 'assertionExercised', 'compliant', 'expected', 'observed', 'issues'];
const SUMMARY_KEYS = ['classification', 'reports', 'expectedReports', 'compliant', 'nonCompliant', 'assertionsExercised', 'processExitCode', 'preflightExitCode', 'preflightError', 'functionalError'];

function serializeError(error) {
  return {
    name: error?.name || 'Error',
    message: String(error?.message || error),
    stack: String(error?.stack || ''),
  };
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function allTrue(checks) {
  return Object.values(checks).every((value) => value === true);
}

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${HOST}`);
    const relative = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
    const filePath = path.resolve(ROOT, `.${relative}`);
    if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    fs.readFile(filePath, (error, contents) => {
      if (error) {
        response.writeHead(error.code === 'ENOENT' ? 404 : 500).end(error.message);
        return;
      }
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      });
      response.end(contents);
    });
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, HOST, () => resolve({
      server,
      url: `http://${HOST}:${server.address().port}/index.html`,
    }));
  });
}

function closeServer(server) {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => server.close(resolve));
}

function loadRealCore() {
  try {
    const loaded = require(SELECTION_MODULE);
    return {
      module: path.relative(ROOT, SELECTION_MODULE).replace(/\\/g, '/'),
      exportName: SELECTION_EXPORT,
      available: typeof loaded?.[SELECTION_EXPORT] === 'function',
      error: null,
    };
  } catch (error) {
    return {
      module: path.relative(ROOT, SELECTION_MODULE).replace(/\\/g, '/'),
      exportName: SELECTION_EXPORT,
      available: false,
      error: serializeError(error),
    };
  }
}

function exactKeys(value, keys) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value)
    && isDeepStrictEqual(Object.keys(value).sort(), keys.slice().sort()));
}

function telemetry(pageLoaded, consoleErrors = [], pageErrors = [], invalidTokens = []) {
  return { pageLoaded, consoleErrors, pageErrors, invalidTokens };
}

function resultReport(id, checks, observed, reportTelemetry) {
  const compliant = allTrue(checks);
  const issues = Object.entries(checks)
    .filter(([, value]) => value !== true)
    .map(([pathName, value]) => ({ path: `${id}.${pathName}`, expected: true, observed: value }));
  return {
    id,
    category: CATEGORY,
    classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
    compliant,
    assertionExercised: true,
    expected: CONTRACTS[id],
    observed: { checks, ...observed },
    telemetry: reportTelemetry,
    issues,
  };
}

function matrixCase(caseId, expectedPaths, observedPaths) {
  const compliant = isDeepStrictEqual(observedPaths, expectedPaths);
  return {
    caseId,
    assertionExercised: true,
    compliant,
    expected: { paths: expectedPaths },
    observed: { paths: observedPaths },
    issues: compliant ? [] : [{ path: `${caseId}.paths`, expected: expectedPaths, observed: observedPaths }],
  };
}

function preflightBlockedReports(error, preflight) {
  return IDS.map((id) => ({
    id,
    category: CATEGORY,
    classification: 'INFRA_BLOCKED',
    compliant: false,
    assertionExercised: false,
    expected: CONTRACTS[id],
    observed: { reason: 'chromium_preflight_failed_before_assertions', preflight, error: serializeError(error) },
    telemetry: telemetry(false, [], [serializeError(error)], []),
    issues: [{ path: `${id}.preflight`, expected: 'Chromium available', observed: serializeError(error) }],
  }));
}

function configReports(error) {
  return IDS.map((id) => ({
    id,
    category: CATEGORY,
    classification: 'CONFIG_ERROR',
    compliant: false,
    assertionExercised: false,
    expected: CONTRACTS[id],
    observed: { reason: 'harness_or_protocol_invalid', error: serializeError(error) },
    telemetry: telemetry(false, [], [serializeError(error)], []),
    issues: [{ path: `${id}.configuration`, expected: 'valid harness protocol', observed: serializeError(error) }],
  }));
}

function protocolValid(reports) {
  return reports.length === IDS.length
    && new Set(reports.map((report) => report.id)).size === IDS.length
    && isDeepStrictEqual(reports.map((report) => report.id), IDS)
    && reports.every((report) => exactKeys(report, REPORT_KEYS)
      && report.category === CATEGORY
      && ['PASS', 'FUNCTIONAL_FAILURE', 'INFRA_BLOCKED', 'CONFIG_ERROR'].includes(report.classification)
      && typeof report.compliant === 'boolean'
      && typeof report.assertionExercised === 'boolean'
      && ((report.classification === 'PASS' && report.compliant === true)
        || (report.classification !== 'PASS' && report.compliant === false))
      && report.expected && typeof report.expected === 'object'
      && report.observed && typeof report.observed === 'object'
      && exactKeys(report.telemetry, TELEMETRY_KEYS)
      && Array.isArray(report.telemetry.consoleErrors)
      && Array.isArray(report.telemetry.pageErrors)
      && Array.isArray(report.telemetry.invalidTokens)
      && Array.isArray(report.issues))
    && [
      ['UI300-05', EDIT_CASES.map(([caseId]) => caseId)],
      ['UI300-12', ERROR_CASE_IDS],
      ['UI300-13', LOCALE_CASE_IDS],
      ['UI300-14', RESPONSIVE_CASE_IDS],
    ].every(([id, expectedCaseIds]) => {
      const report = reports.find((item) => item.id === id);
      if (!report || report.classification === 'INFRA_BLOCKED' || report.classification === 'CONFIG_ERROR') return true;
      const cases = report.observed?.cases;
      return Array.isArray(cases)
        && isDeepStrictEqual(cases.map((item) => item.caseId), expectedCaseIds)
        && new Set(cases.map((item) => item.caseId)).size === expectedCaseIds.length
        && cases.every((item) => exactKeys(item, CASE_KEYS)
          && item.assertionExercised === true
          && typeof item.compliant === 'boolean'
          && item.expected && typeof item.expected === 'object'
          && item.observed && typeof item.observed === 'object'
          && Array.isArray(item.issues));
    });
}

function summaryProtocolValid(summary, reports) {
  return exactKeys(summary, SUMMARY_KEYS)
    && summary.reports === IDS.length
    && summary.expectedReports === IDS.length
    && summary.compliant === reports.filter((report) => report.compliant).length
    && summary.nonCompliant === reports.filter((report) => !report.compliant).length
    && summary.assertionsExercised === reports.filter((report) => report.assertionExercised).length
    && summary.processExitCode === exitCodeFor(summary.classification);
}

function classify(reports, preflightBlocked) {
  if (preflightBlocked) return 'INFRA_BLOCKED';
  if (!protocolValid(reports) || reports.some((report) => report.classification === 'CONFIG_ERROR')
    || reports.some((report) => report.assertionExercised !== true)) return 'CONFIG_ERROR';
  return reports.every((report) => report.compliant) ? 'PASS' : 'FUNCTIONAL_FAILURE';
}

function exitCodeFor(classification) {
  return { PASS: 0, FUNCTIONAL_FAILURE: 1, INFRA_BLOCKED: 2, CONFIG_ERROR: 3 }[classification] ?? 3;
}

function validateHarnessConfiguration() {
  const canonicalPatterns = {
    pt: [
      ['recommended', '\\brecomendad[oa]\\b'], ['selected', '\\bselecionad[oa]\\b'],
      ['final_solution', 'solucao final'], ['iec_conformity', 'conforme iec'],
      ['productive_release', 'liberad[oa] para (?:projeto|compra|instalacao)'],
    ],
    en: [
      ['recommended', '\\brecommended\\b'], ['selected', '\\bselected\\b'],
      ['final_solution', 'final solution'], ['iec_conformity', 'iec (?:compliant|conformant)'],
      ['productive_release', '(?:released|approved) for (?:design|purchase|installation)'],
    ],
    es: [
      ['recommended', '\\brecomendad[oa]\\b'], ['selected', '\\bseleccionad[oa]\\b'],
      ['final_solution', 'solucion final'], ['iec_conformity', 'conforme con iec'],
      ['productive_release', '(?:liberad[oa]|aprobad[oa]) para (?:proyecto|compra|instalacion)'],
    ],
  };
  const failures = [];
  if (EXPECTED_CATALOG.length !== 6) failures.push('fixture_catalog_count');
  if (EXPECTED_CATALOG.filter((candidate) => candidate.section_mm2 === 300).length !== 1) failures.push('fixture_300_cardinality');
  if (!isDeepStrictEqual(EXPECTED_CATALOG[5], expectedCandidate(300, 516, 0.0075))) failures.push('fixture_300_dto');
  const expectedKeys = Object.keys(expectedCandidate(300, 516, 0.0075)).sort();
  if (!EXPECTED_CATALOG.every((candidate) => isDeepStrictEqual(Object.keys(candidate).sort(), expectedKeys)
    && !Object.prototype.hasOwnProperty.call(candidate, 'impedance_ohm'))) failures.push('fixture_candidate_schema');
  if (!isDeepStrictEqual(FORBIDDEN_PATTERNS, canonicalPatterns)) failures.push('forbidden_patterns_drift');
  try {
    Object.values(FORBIDDEN_PATTERNS).flat().forEach(([, source]) => new RegExp(source));
  } catch (error) {
    failures.push(`forbidden_pattern_invalid:${error.message}`);
  }
  if (Object.values(FORBIDDEN_PATTERNS).flat().length !== 15) failures.push('forbidden_pattern_count');
  if (!isDeepStrictEqual(EDIT_CASES.map(([id]) => id), Array.from({ length: 7 }, (_unused, index) => `UI300-05-CASE-${String(index + 1).padStart(2, '0')}`))) failures.push('edit_case_ids');
  if (IDS.length !== 15 || new Set(IDS).size !== 15) failures.push('report_ids');
  if (failures.length > 0) throw new Error(`Harness UI300 invÃ¡lido: ${failures.join(',')}`);
}

async function chromiumPreflight(puppeteer) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    return {
      attempts: 1,
      command: "puppeteer.launch({ headless: 'new' })",
      executablePath: puppeteer.executablePath(),
      browserVersion: await browser.version(),
      exitCode: 0,
    };
  } finally {
    if (browser) await browser.close();
  }
}

async function attachSelectionEngineCounter(page) {
  const client = await page.createCDPSession();
  await client.send('Debugger.enable');
  const evaluated = await client.send('Runtime.evaluate', {
    expression: 'window.enumerateCablingBTParallelAlternativesExperimental',
    objectGroup: 'qa-selection-counter',
    returnByValue: false,
  });
  if (!evaluated.result?.objectId) throw new Error('Motor real indisponível para instrumentação CDP read-only.');
  let count = 0;
  let resume = Promise.resolve();
  client.on('Debugger.paused', () => {
    count += 1;
    resume = resume.then(() => client.send('Debugger.resume')).catch(() => {});
  });
  const breakpoint = await client.send('Debugger.setBreakpointOnFunctionCall', { objectId: evaluated.result.objectId });
  await page.exposeFunction('__qaReadSelectionEngineCallCount', () => count);
  return async () => {
    await resume;
    if (breakpoint.breakpointId) await client.send('Debugger.removeBreakpoint', { breakpointId: breakpoint.breakpointId }).catch(() => {});
    await page.removeExposedFunction('__qaReadSelectionEngineCallCount').catch(() => {});
    await client.send('Runtime.releaseObjectGroup', { objectGroup: 'qa-selection-counter' }).catch(() => {});
    await client.send('Debugger.disable').catch(() => {});
    await client.detach().catch(() => {});
  };
}

async function executeVisualScenario(puppeteer, nodeCore) {
  let server;
  let browser;
  let page;
  let counterCleanup;
  const consoleErrors = [];
  const pageErrors = [];
  try {
    const staticServer = await startStaticServer();
    server = staticServer.server;
    browser = await puppeteer.launch({ headless: 'new' });
    const browserVersion = await browser.version();
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(serializeError(error)));
    await page.goto(staticServer.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => document.readyState !== 'loading', { timeout: 15000 });
    await new Promise((resolve) => setTimeout(resolve, 250));
    counterCleanup = await attachSelectionEngineCounter(page);

    const api = await page.evaluate(() => ({
      switchModule: typeof window.switchModule,
      switchCablingCard: typeof window.switchCablingCard,
      calculateCablingBT: typeof window.calculateCablingBT,
      renderCardBT: typeof window.renderCardBT,
      setLanguage: typeof window.setLanguage,
      selectionEngine: typeof window.enumerateCablingBTParallelAlternativesExperimental,
      readyState: document.readyState,
    }));

    const desktop = await page.evaluate(async ({ fixture, regionSelectors, objectives, notice }) => {
      const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const waitFrames = (count) => new Promise((resolve) => {
        const next = () => {
          if (count-- <= 0) return resolve();
          requestAnimationFrame(next);
        };
        requestAnimationFrame(next);
      });
      if (typeof window.setLanguage === 'function') window.setLanguage('pt');
      await waitFrames(2);
      const desktopLanguage = {
        requested: 'pt',
        htmlLang: document.documentElement.lang,
        compatible: /^pt(?:-|$)/i.test(document.documentElement.lang || ''),
      };
      const normalized = (value) => String(value ?? '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
          && rect.width > 0 && rect.height > 0;
      };
      const findRegion = () => {
        for (const selector of regionSelectors) {
          const element = document.querySelector(selector);
          if (element) return { element, selector, semanticFallback: false };
        }
        const candidates = Array.from(document.querySelectorAll('section,[role="region"],article,.card'));
        const element = candidates.find((candidate) => {
          const text = normalized(candidate.innerText);
          return text.includes('preliminar') && /(alternativ|paralel)/.test(text) && /(instal|install)/.test(text);
        }) || null;
        return { element, selector: null, semanticFallback: Boolean(element) };
      };
      const queryAny = (root, selectors) => {
        if (!root) return null;
        for (const selector of selectors) {
          const element = root.querySelector(selector);
          if (element) return element;
        }
        return null;
      };
      const enabled = (control) => Boolean(control
        && !control.disabled && control.getAttribute('aria-disabled') !== 'true');
      const confirmed = (control) => {
        if (!control) return false;
        if (control.type === 'checkbox' || control.type === 'radio') return control.checked === true;
        if (control.getAttribute('aria-checked') !== null) return control.getAttribute('aria-checked') === 'true';
        if (control.getAttribute('aria-pressed') !== null) return control.getAttribute('aria-pressed') === 'true';
        return ['true', 'yes', 'sim', 'confirmed', 'confirmado', 'confirmada']
          .includes(normalized(control.value));
      };
      const controlState = (control) => ({
        present: Boolean(control),
        visible: visible(control),
        enabled: enabled(control),
      });
      const setControl = (control, value) => {
        if (!control) return false;
        if (control.type === 'checkbox' || control.type === 'radio') control.checked = Boolean(value);
        else control.value = String(value);
        control.dispatchEvent(new Event('input', { bubbles: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      };
      const safeJson = (value) => {
        try { return JSON.parse(JSON.stringify(value)); } catch (_error) { return null; }
      };
      const candidateVisible = (text, id) => {
        const [n, section] = String(id).split('x');
        const patterns = [id, `${n} × ${section}`, `${n}x${section}`, `${n} x ${section}`];
        return patterns.some((pattern) => normalized(text).includes(normalized(pattern)));
      };

      let productive = {
        attempted: false, engineCalls: 0, rendererCalls: 0, envelopeOk: false,
        cardBefore: '', cardAfter: '', unchanged: false,
      };
      if (['switchModule', 'switchCablingCard', 'calculateCablingBT', 'renderCardBT']
        .every((name) => typeof window[name] === 'function')) {
        window.switchModule('cabling');
        window.switchCablingCard('bt');
        await waitFrames(4);
        Object.entries(fixture.productive).forEach(([id, value]) => {
          const control = document.getElementById(id);
          if (control) setControl(control, value);
        });
        window.AmpAI_State = window.AmpAI_State || {};
        window.AmpAI_State.btCond = 'Cu';
        window.AmpAI_State.btIns = 'XLPE';
        const originalEngine = window.calculateCablingBT;
        const originalRenderer = window.renderCardBT;
        const engineResults = [];
        const rendererPayloads = [];
        window.calculateCablingBT = function observedProductiveEngine(input) {
          const result = originalEngine.apply(this, arguments);
          engineResults.push({ input: safeJson(input), result: safeJson(result) });
          return result;
        };
        window.renderCardBT = function observedProductiveRenderer(payload) {
          rendererPayloads.push(safeJson(payload));
          return originalRenderer.apply(this, arguments);
        };
        document.querySelector('#btn-bt')?.click();
        await waitFrames(12);
        await wait(150);
        window.calculateCablingBT = originalEngine;
        window.renderCardBT = originalRenderer;
        const card = document.querySelector('#card-bt');
        productive = {
          attempted: true,
          engineCalls: engineResults.length,
          rendererCalls: rendererPayloads.length,
          envelopeOk: engineResults.some((entry) => entry.result?.ok === true),
          cardBefore: card?.innerText || '',
          cardAfter: '',
          unchanged: false,
        };
      }

      const initialRegion = findRegion();
      const region = initialRegion.element;
      const practical = {
        current: queryAny(region, ['[data-selection-field="totalLoadCurrent_A"]', '[name="totalLoadCurrent_A"]', '#bt-parallel-selection-current']),
        voltage: queryAny(region, ['[data-selection-field="lineVoltage_V"]', '[name="lineVoltage_V"]', '#bt-parallel-selection-voltage']),
        drop: queryAny(region, ['[data-selection-field="maximumVoltageDrop_percent"]', '[name="maximumVoltageDrop_percent"]', '#bt-parallel-selection-drop']),
        objective: queryAny(region, ['[data-selection-field="objective"]', '[name="objective"]', '#bt-parallel-selection-objective']),
        catalogConfirmed: queryAny(region, ['[data-selection-confirm="catalog"]', '[name="catalogConfirmed"]', '#bt-parallel-selection-catalog-confirmed']),
        hypothesisConfirmed: queryAny(region, ['[data-selection-confirm="hypothesis"]', '[name="hypothesisConfirmed"]', '#bt-parallel-selection-hypothesis-confirmed']),
        action: queryAny(region, ['[data-selection-action="calculate"]', '[data-action="enumerate-parallel-selection"]', '#btn-bt-parallel-selection']),
      };
      const initialAdvancedElement = queryAny(region, ['details[data-advanced]', '[data-selection-advanced]', '.advanced-inputs']);
      const initialAdvancedCollapsible = Boolean(initialAdvancedElement
        && (initialAdvancedElement.matches('details') || initialAdvancedElement.hasAttribute('aria-expanded')));
      const initialAdvancedCollapsed = initialAdvancedElement?.matches('details')
        ? initialAdvancedElement.open === false
        : initialAdvancedElement?.hasAttribute('aria-expanded')
          ? initialAdvancedElement.getAttribute('aria-expanded') === 'false'
          : null;
      setControl(practical.current, fixture.ceo.totalLoadCurrent_A);
      setControl(practical.voltage, fixture.ceo.lineVoltage_V);
      setControl(practical.drop, fixture.ceo.maximumVoltageDrop_percent);
      setControl(practical.catalogConfirmed, true);
      setControl(practical.hypothesisConfirmed, true);

      const originalSelection = window.enumerateCablingBTParallelAlternativesExperimental;
      const engineCalls = [];
      const engineEnvelopes = [];

      const objectiveRuns = [];
      for (const objective of Object.keys(objectives)) {
        if (!region || !practical.objective || !practical.action) {
          objectiveRuns.push({ objective, attempted: false, expectedTop: objectives[objective], observedTop: null, regionText: '' });
          continue;
        }
        setControl(practical.objective, objective);
        const callsBefore = await window.__qaReadSelectionEngineCallCount();
        practical.action.click();
        await waitFrames(12);
        await wait(120);
        const callsAfter = await window.__qaReadSelectionEngineCallCount();
        const latestInput = safeJson(window._parSelLast?.input ?? null);
        const latest = safeJson(window._parSelLast?.envelope ?? null);
        engineCalls.push(latestInput);
        engineEnvelopes.push(latest);
        const regionText = findRegion().element?.innerText || '';
        const observedTop = latest?.data?.firstInPresentationOrder?.candidateId
          || latest?.data?.presentationOrder?.[0]?.candidateId || null;
        objectiveRuns.push({
          objective,
          attempted: true,
          newEngineCalls: callsAfter - callsBefore,
          expectedTop: objectives[objective],
          observedTop,
          topVisible: observedTop ? candidateVisible(regionText, observedTop) : false,
          installationAuthorized: latest?.data?.installationAuthorized,
          installableSelection: latest?.data?.installableSelection,
          productionAllowed: latest?.productionAllowed,
        });
      }

      const regionNow = findRegion().element;
      const regionText = regionNow?.innerText || '';
      const practicalNow = {
        current: queryAny(regionNow, ['[data-selection-field="totalLoadCurrent_A"]', '[name="totalLoadCurrent_A"]', '#bt-parallel-selection-current']),
        voltage: queryAny(regionNow, ['[data-selection-field="lineVoltage_V"]', '[name="lineVoltage_V"]', '#bt-parallel-selection-voltage']),
        drop: queryAny(regionNow, ['[data-selection-field="maximumVoltageDrop_percent"]', '[name="maximumVoltageDrop_percent"]', '#bt-parallel-selection-drop']),
        objective: queryAny(regionNow, ['[data-selection-field="objective"]', '[name="objective"]', '#bt-parallel-selection-objective']),
        catalogConfirmed: queryAny(regionNow, ['[data-selection-confirm="catalog"]', '[name="catalogConfirmed"]', '#bt-parallel-selection-catalog-confirmed']),
        hypothesisConfirmed: queryAny(regionNow, ['[data-selection-confirm="hypothesis"]', '[name="hypothesisConfirmed"]', '#bt-parallel-selection-hypothesis-confirmed']),
        action: queryAny(regionNow, ['[data-selection-action="calculate"]', '[data-action="enumerate-parallel-selection"]', '#btn-bt-parallel-selection']),
      };
      const latestEnvelope = engineEnvelopes[engineEnvelopes.length - 1] || null;
      const alternatives = latestEnvelope?.data?.candidateAlternatives || [];
      const frontier = latestEnvelope?.data?.nonDominatedAlternatives || [];
      const renderedCandidateIds = Array.from(regionNow?.querySelectorAll('[data-candidate-id]') || [])
        .map((element) => element.getAttribute('data-candidate-id')).filter(Boolean);
      const candidateCards = Array.from(regionNow?.querySelectorAll('[data-candidate-id],.candidate-card,.alternative-card') || []);
      const controls = Array.from(regionNow?.querySelectorAll('input,select,textarea,button,[tabindex]') || []);
      const labelsAssociated = controls.filter((control) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(control.tagName)).every((control) => (
        Boolean(control.getAttribute('aria-label') || control.getAttribute('aria-labelledby'))
        || Boolean(control.id && regionNow.querySelector(`label[for="${CSS.escape(control.id)}"]`))
        || control.closest('label') !== null
      ));
      let focusVisible = false;
      if (controls[0]) {
        controls[0].focus();
        const style = getComputedStyle(controls[0]);
        focusVisible = document.activeElement === controls[0]
          && (style.outlineStyle !== 'none' || style.boxShadow !== 'none');
      }
      const advancedElement = queryAny(regionNow, ['details[data-advanced]', '[data-selection-advanced]', '.advanced-inputs']);
      const practicalElements = ['current', 'voltage', 'drop', 'objective']
        .map((key) => practicalNow[key]).filter(Boolean);
      const practicalOrderEvidence = practicalElements.map((element) => {
        const relation = advancedElement ? element.compareDocumentPosition(advancedElement) : 0;
        return {
          control: element.name || element.id || element.getAttribute('data-selection-field') || element.tagName,
          relation,
          beforeAdvanced: Boolean(relation & Node.DOCUMENT_POSITION_FOLLOWING),
        };
      });
      const practicalBeforeAdvanced = Boolean(advancedElement && practicalElements.length === 4
        && practicalOrderEvidence.every((item) => item.beforeAdvanced));
      const cardsUseHumanForm = candidateCards.length > 0 && candidateCards.every((card) => /\b\d+\s*[×x]\s*\d+(?:[.,]\d+)?\s*mm²/i.test(card.innerText));
      const allAlternativeIdsVisible = alternatives.length > 0
        && alternatives.every((candidate) => candidateVisible(regionText, candidate.candidateId));
      const allFrontierIdsVisible = frontier.length > 0
        && frontier.every((candidate) => candidateVisible(regionText, candidate.candidateId));
      const dominantArrays = alternatives.map((candidate) => ({ id: candidate.candidateId, dominantCriteria: candidate.dominantCriteria }));
      const dominantVisible = dominantArrays.length > 0 && dominantArrays.every((candidate) => (
        Array.isArray(candidate.dominantCriteria) && candidate.dominantCriteria.length > 0
        && candidate.dominantCriteria.every((criterion) => normalized(regionText).includes(normalized(criterion)))
      ));
      const normalizedRegionText = normalized(regionText);
      const criteriaTokens = {
        ampacity: normalizedRegionText.includes('ampacidade'),
        voltageDrop: normalizedRegionText.includes('queda'),
        shortCircuit: normalizedRegionText.includes('curto'),
      };
      const criteriaVisible = Object.values(criteriaTokens).every(Boolean);
      const invalidTokens = ['undefined', 'nan', '--'].filter((token) => (
        token === '--' ? /(^|\s)--(?=\s|$)/.test(regionText) : new RegExp(`(^|\\s)${token}(?=\\s|$)`, 'i').test(regionText)
      ));
      const temperatureVisible = /(?:temperatura|temperature).*?(?:°c|degc)/i.test(regionText);
      const normativeLeak = /(?:valor|limite).*normativ[oa]/i.test(regionText);
      const installationNo = /(instala[cç][aã]o autorizada|installation authorized|instalaci[oó]n autorizada)\s*:\s*(n[aã]o|no)/i.test(regionText);
      const noticeVisible = regionText.includes(notice) && visible(regionNow);
      const sectionIsolated = Boolean(regionNow && !document.querySelector('#card-bt')?.contains(regionNow));
      const inlineHandlers = Array.from(regionNow?.querySelectorAll('*') || []).flatMap((element) => (
        Array.from(element.attributes).filter((attribute) => /^on/i.test(attribute.name)).map((attribute) => `${element.tagName}:${attribute.name}`)
      ));
      const landmark = Boolean(regionNow && (regionNow.matches('section,[role="region"]') || regionNow.getAttribute('aria-label') || regionNow.getAttribute('aria-labelledby')));

      const productiveCard = document.querySelector('#card-bt');
      productive.cardAfter = productiveCard?.innerText || '';
      productive.unchanged = productive.cardBefore.length > 0 && productive.cardBefore === productive.cardAfter;

      return {
        pageLoaded: true,
        section: {
          present: Boolean(regionNow), selector: initialRegion.selector,
          semanticFallback: initialRegion.semanticFallback, visible: visible(regionNow), isolated: sectionIsolated,
          text: regionText.slice(0, 12000), noticeVisible,
        },
        language: desktopLanguage,
        productive,
        controls: {
          current: controlState(practicalNow.current), voltage: controlState(practicalNow.voltage),
          drop: controlState(practicalNow.drop), objective: controlState(practicalNow.objective),
          catalogConfirmation: { ...controlState(practicalNow.catalogConfirmed), confirmed: confirmed(practicalNow.catalogConfirmed) },
          hypothesisConfirmation: { ...controlState(practicalNow.hypothesisConfirmed), confirmed: confirmed(practicalNow.hypothesisConfirmed) },
          action: controlState(practicalNow.action),
          objectiveOptions: Array.from(practicalNow.objective?.options || []).map((option) => option.value),
          practicalBeforeAdvanced,
          practicalOrderEvidence,
          advanced: {
            present: Boolean(advancedElement),
            initiallyPresent: Boolean(initialAdvancedElement),
            collapsible: initialAdvancedCollapsible,
            initiallyCollapsed: initialAdvancedCollapsed,
            initialCollapseValid: !initialAdvancedCollapsible || initialAdvancedCollapsed === true,
          },
        },
        engine: {
          functionAvailable: typeof originalSelection === 'function', callCount: engineCalls.length,
          inputs: engineCalls, envelopes: engineEnvelopes, latestEnvelope,
        },
        objectiveRuns,
        alternatives: {
          expectedCount: alternatives.length, frontierCount: frontier.length,
          renderedCandidateIds, allAlternativeIdsVisible, allFrontierIdsVisible,
          cardsUseHumanForm, dominantArrays, dominantVisible, criteriaVisible, criteriaTokens,
        },
        governance: {
          installationNo, temperatureVisible, normativeLeak,
          installableSelection: latestEnvelope?.data?.installableSelection,
          installationAuthorized: latestEnvelope?.data?.installationAuthorized,
          productionAllowed: latestEnvelope?.productionAllowed,
        },
        accessibility: { landmark, labelsAssociated, focusVisible, focusableCount: controls.length, inlineHandlers },
        invalidTokens,
      };
    }, {
      fixture: { ceo: CEO_FIXTURE, productive: BT_PRODUCTIVE_FIXTURE },
      regionSelectors: REGION_SELECTORS,
      objectives: OBJECTIVE_TOPS,
      notice: NOTICE,
    });

    const focal = await page.evaluate(async ({ ceo, editCases, objectives }) => {
      const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const frames = (count = 8) => new Promise((resolve) => {
        const next = () => (count-- <= 0 ? resolve() : requestAnimationFrame(next));
        requestAnimationFrame(next);
      });
      const copy = (value) => {
        try { return JSON.parse(JSON.stringify(value)); } catch (_error) { return null; }
      };
      const set = (element, value) => {
        if (!element) return false;
        if (element.type === 'checkbox') element.checked = Boolean(value);
        else element.value = String(value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      };
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const region = document.querySelector('#cab-bt-parallel-selection-experimental');
      const details = region?.querySelector('details[data-advanced]') || null;
      const rows = Array.from(region?.querySelectorAll('#cbpsx-catalog .cbpsx-cat-row[data-catalog-index]') || []);
      const fieldNames = ['section', 'ampacity', 'r', 'x', 'temp', 'material', 'provenance'];
      const fields = Array.from(region?.querySelectorAll('#cbpsx-catalog [data-catalog-index][data-catalog-field]') || []);
      const confirms = [
        document.querySelector('#bt-parallel-selection-catalog-confirmed'),
        document.querySelector('#bt-parallel-selection-hypothesis-confirmed'),
      ];
      const readMeta = (rootSelector, name) => {
        const element = document.querySelector(`${rootSelector} [data-meta="${name}"]`);
        return { present: Boolean(element), value: element?.getAttribute('data-value') ?? null };
      };
      const initial = {
        regionCount: document.querySelectorAll('#cab-bt-parallel-selection-experimental').length,
        detailsPresent: Boolean(details), detailsInitiallyOpen: details?.open ?? null,
        rowCount: rows.length,
        rowIndexes: rows.map((row) => row.getAttribute('data-catalog-index')),
        fieldCount: fields.length,
        fieldsPerRow: rows.map((row) => ({
          index: row.getAttribute('data-catalog-index'),
          names: Array.from(row.querySelectorAll('[data-catalog-field]')).map((control) => control.getAttribute('data-catalog-field')),
        })),
        confirmations: confirms.map((control) => ({
          present: Boolean(control), visible: visible(control), enabled: Boolean(control && !control.disabled),
          outsideDetails: Boolean(control && details && !details.contains(control)),
        })),
        sharedMetadata: {
          insulation: readMeta('[data-catalog-shared-metadata]', 'insulation'),
          installationMethod: readMeta('[data-catalog-shared-metadata]', 'installationMethod'),
          units: readMeta('[data-catalog-shared-metadata]', 'units'),
          source: readMeta('[data-catalog-shared-metadata]', 'source'),
          sourceVersion: readMeta('[data-catalog-shared-metadata]', 'entrySourceVersion'),
        },
        catalogMetadata: {
          sourceVersion: readMeta('[data-catalog-metadata]', 'catalogSourceVersion'),
          source: readMeta('[data-catalog-metadata]', 'catalogSource'),
          mode: readMeta('[data-catalog-metadata]', 'catalogMode'),
          provenance: readMeta('[data-catalog-metadata]', 'catalogProvenance'),
          impedanceLength: readMeta('[data-catalog-metadata]', 'impedanceLength_m'),
          impedanceDescription: readMeta('[data-catalog-metadata]', 'impedanceDescription'),
          impedanceProvenance: readMeta('[data-catalog-metadata]', 'impedanceProvenance'),
        },
      };

      set(document.querySelector('#bt-parallel-selection-current'), ceo.totalLoadCurrent_A);
      set(document.querySelector('#bt-parallel-selection-voltage'), ceo.lineVoltage_V);
      set(document.querySelector('#bt-parallel-selection-drop'), ceo.maximumVoltageDrop_percent);
      confirms.forEach((control) => set(control, true));
      const action = document.querySelector('#cbpsx-calculate');
      const objectiveControl = document.querySelector('#bt-parallel-selection-objective');
      const original = window.enumerateCablingBTParallelAlternativesExperimental;
      const click = async () => {
        const before = await window.__qaReadSelectionEngineCallCount();
        set(document.querySelector('#bt-parallel-selection-maxparallel'), 4);
        action?.click();
        await frames(12);
        await wait(80);
        const after = await window.__qaReadSelectionEngineCallCount();
        const input = copy(window._parSelLast?.input ?? null);
        const result = copy(window._parSelLast?.envelope ?? null);
        const rawArrays = {
          evaluatedCandidates: (result?.data?.evaluatedCandidates || []).map((item) => item.candidateId),
          candidateAlternatives: (result?.data?.candidateAlternatives || []).map((item) => item.candidateId),
          rejectedCandidates: (result?.data?.rejectedCandidates || []).map((item) => item.candidateId),
          nonDominatedAlternatives: (result?.data?.nonDominatedAlternatives || []).map((item) => item.candidateId),
        };
        const storedEnvelope = window._parSelLast?.envelope || null;
        const storedRawArrays = {
          evaluatedCandidates: (storedEnvelope?.data?.evaluatedCandidates || []).map((item) => item.candidateId),
          candidateAlternatives: (storedEnvelope?.data?.candidateAlternatives || []).map((item) => item.candidateId),
          rejectedCandidates: (storedEnvelope?.data?.rejectedCandidates || []).map((item) => item.candidateId),
          nonDominatedAlternatives: (storedEnvelope?.data?.nonDominatedAlternatives || []).map((item) => item.candidateId),
        };
        return {
          engineCalls: after - before,
          input,
          result,
          text: document.querySelector('#cbpsx-results')?.innerText || '',
          cards: document.querySelectorAll('#cbpsx-results [data-candidate-id]').length,
          cardIds: Array.from(document.querySelectorAll('#cbpsx-results .cbpsx-alt[data-candidate-id]')).map((element) => element.getAttribute('data-candidate-id')).filter(Boolean),
          presentationCardIds: (result?.data?.presentationModel?.cards || []).map((item) => item.candidateId),
          hiddenCandidateIds: result?.data?.presentationProjection?.hiddenCandidateIds || [],
          rawArrays,
          storedRawArrays,
          rawArraysUnmutated: JSON.stringify(rawArrays) === JSON.stringify(storedRawArrays),
        };
      };
      const nominalRuns = [];
      for (const objective of Object.keys(objectives)) {
        set(objectiveControl, objective);
        nominalRuns.push({ objective, ...(await click()) });
      }

      const editRuns = [];
      for (const [caseId, field, pathName, injectedValue] of editCases) {
        const control = document.querySelector(`[data-catalog-index="5"][data-catalog-field="${field}"]`);
        const originalValue = control?.value;
        set(control, injectedValue);
        const run = await click();
        editRuns.push({ caseId, field, pathName, injectedValue, controlPresent: Boolean(control), ...run });
        if (control) set(control, originalValue);
      }

      const errorRuns = [];
      const runDomError = async (caseId, field, mode, injectedValue) => {
        const control = document.querySelector(`[data-catalog-index="5"][data-catalog-field="${field}"]`);
        const ownValue = control ? Object.getOwnPropertyDescriptor(control, 'value') : null;
        const originalValue = control?.value;
        if (control && mode === 'missing') set(control, '');
        if (control && mode === 'nonfinite') {
          Object.defineProperty(control, 'value', { configurable: true, get: () => injectedValue, set: () => {} });
          control.dispatchEvent(new Event('input', { bubbles: true }));
          control.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (control && mode === 'value') set(control, injectedValue);
        const run = await click();
        errorRuns.push({ caseId, field, mode, injectedValue, controlPresent: Boolean(control), faultInjection: false, ...run });
        if (control && mode === 'nonfinite') {
          if (ownValue) Object.defineProperty(control, 'value', ownValue);
          else delete control.value;
          set(control, originalValue);
        } else if (control) set(control, originalValue);
      };
      await runDomError('UI300-12-CASE-01', 'ampacity', 'missing', null);
      await runDomError('UI300-12-CASE-02', 'ampacity', 'nonfinite', 'NaN');
      await runDomError('UI300-12-CASE-03', 'r', 'nonfinite', 'Infinity');

      const captured300 = copy(window._parSelLast?.input?.catalog?.candidates?.[5] || null);
      let conflictRun = { caseId: 'UI300-12-CASE-04', controlPresent: Boolean(captured300), faultInjection: true,
        engineCalls: 0, input: null, result: null, text: '', cards: null };
      if (captured300 && typeof original === 'function') {
        const cloned = copy(window._parSelLast?.input);
        const candidate = copy(cloned.catalog.candidates[5]);
        candidate.impedance_ohm = { re: candidate.resistance_ohm, im: candidate.reactance_ohm };
        cloned.catalog.candidates = [candidate];
        const before = await window.__qaReadSelectionEngineCallCount();
        const result = copy(original(cloned));
        const after = await window.__qaReadSelectionEngineCallCount();
        conflictRun = {
          caseId: 'UI300-12-CASE-04', controlPresent: true, faultInjection: true,
          engineCalls: after - before, input: cloned, result,
          text: document.querySelector('#cbpsx-results')?.innerText || '',
          cards: document.querySelectorAll('#cbpsx-results .cbpsx-alt[data-candidate-id]').length,
        };
      }
      errorRuns.push(conflictRun);
      await runDomError('UI300-12-CASE-05', 'material', 'value', 'ALUMINUM_LAB');

      const catalog = document.querySelector('#cbpsx-catalog');
      const parent = catalog?.parentNode || null;
      const next = catalog?.nextSibling || null;
      if (catalog) catalog.remove();
      const noCatalogRun = await click();
      if (catalog && parent) parent.insertBefore(catalog, next);
      set(objectiveControl, 'MAX_MINIMUM_MARGIN');
      const printRun = await click();

      const resultText = document.querySelector('#cbpsx-results')?.innerText || '';
      return {
        initial,
        fieldNames,
        nominalRuns,
        editRuns,
        errorRuns,
        noCatalogRun,
        printRun,
        finalResultText: resultText,
        engineAvailable: typeof original === 'function',
      };
    }, { ceo: CEO_FIXTURE, editCases: EDIT_CASES, objectives: OBJECTIVE_TOPS });

    const locales = {};
    for (const language of ['pt', 'en', 'es']) {
      locales[language] = await page.evaluate(async ({ language, selectors, translations, closedMarkers, rawNotice, patternSpecs }) => {
        if (typeof window.setLanguage === 'function') window.setLanguage(language);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const region = selectors.map((selector) => document.querySelector(selector)).find(Boolean)
          || Array.from(document.querySelectorAll('section,[role="region"],article,.card')).find((candidate) => {
            const text = (candidate.innerText || '').toLowerCase();
            return text.includes('preliminar') && /(alternativ|paralel)/.test(text) && /(instal|install)/.test(text);
          }) || null;
        const normalizedText = String(region?.innerText || '').normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
        const compiledPatterns = (patternSpecs[language] || []).map(([term, source]) => [term, source, new RegExp(source)]);
        const forbiddenVocabulary = compiledPatterns
          .filter(([, , pattern]) => pattern.test(normalizedText)).map(([term]) => term);
        const row300 = region?.querySelector('[data-catalog-index="5"]') || null;
        const permanent = document.querySelector('#cbpsx-notice');
        const projected = document.querySelector('[data-cab-bt-parallel-display-notice]');
        const exactTexts = Array.from(region?.querySelectorAll('*') || [])
          .filter((element) => element.childElementCount === 0 && element.textContent.trim())
          .map((element) => element.textContent.trim());
        const values = Object.fromEntries(Object.entries(translations).map(([group, byLanguage]) => [group,
          group === 'warning' ? permanent?.textContent.trim() ?? null : exactTexts.find((value) => value === byLanguage[language]) ?? null]));
        const combinedText = `${region?.innerText || ''}\n${projected?.textContent || ''}`;
        return {
          language,
          htmlLang: document.documentElement.lang,
          regionPresent: Boolean(region),
          text: region?.innerText || '',
          values,
          permanentNotice: permanent?.textContent.trim() ?? null,
          projectedNotice: projected?.textContent.trim() ?? null,
          rawDisplayNotice: window._parSelLast?.envelope?.displayNotice ?? null,
          rawNoticeExpected: rawNotice,
          row300Present: Boolean(row300),
          row300Text: row300?.innerText || '',
          patternSources: compiledPatterns.map(([term, source]) => [term, source]),
          forbiddenVocabulary,
          closedLanguageLeakage: closedMarkers[language].filter((value) => combinedText.includes(value)),
        };
      }, { language, selectors: REGION_SELECTORS, translations: TRANSLATIONS, closedMarkers: CLOSED_LANGUAGE_MARKERS, rawNotice: RAW_NOTICE, patternSpecs: FORBIDDEN_PATTERNS });
    }

    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
    const mobileThemes = {};
    for (const theme of ['light', 'dark']) {
      mobileThemes[theme] = await page.evaluate(({ theme, selectors }) => {
        if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        const region = selectors.map((selector) => document.querySelector(selector)).find(Boolean) || null;
        const details = region?.querySelector('details[data-advanced]') || null;
        if (details) details.open = true;
        const rect = region?.getBoundingClientRect() || null;
        const clipped = region ? Array.from(region.querySelectorAll('*')).filter((element) => (
          element.scrollWidth > element.clientWidth + 1 && getComputedStyle(element).overflowX === 'hidden'
        )).length : null;
        return {
          theme,
          viewportWidth: innerWidth,
          documentScrollWidth: document.documentElement.scrollWidth,
          documentClientWidth: document.documentElement.clientWidth,
          regionPresent: Boolean(region),
          regionLeft: rect?.left ?? null,
          regionRight: rect?.right ?? null,
          regionScrollWidth: region?.scrollWidth ?? null,
          regionClientWidth: region?.clientWidth ?? null,
          detailsOpen: details?.open ?? null,
          rowCount: region?.querySelectorAll('#cbpsx-catalog .cbpsx-cat-row[data-catalog-index]').length ?? null,
          clippedElements: clipped,
          noHorizontalOverflow: Boolean(region
            && document.documentElement.scrollWidth === document.documentElement.clientWidth
            && rect.left >= -1 && rect.right <= innerWidth + 1
            && region.scrollWidth <= region.clientWidth + 1 && clipped === 0),
        };
      }, { theme, selectors: REGION_SELECTORS });
    }

    const printable = {};
    for (const language of ['pt', 'en', 'es']) {
      await page.evaluate(async (activeLanguage) => {
        if (typeof window.setLanguage === 'function') window.setLanguage(activeLanguage);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, language);
      await page.emulateMediaType('print');
      printable[language] = await page.evaluate(({ selectors }) => {
        const region = selectors.map((selector) => document.querySelector(selector)).find(Boolean) || null;
        const details = region?.querySelector('details[data-advanced]') || null;
        if (details) details.open = true;
        const style = region ? getComputedStyle(region) : null;
        return {
          regionPresent: Boolean(region),
          visibleInPrint: Boolean(region && style.display !== 'none' && style.visibility !== 'hidden'),
          text: region?.innerText || '',
          cardIds: Array.from(region?.querySelectorAll('.cbpsx-alt[data-candidate-id]') || []).map((element) => element.getAttribute('data-candidate-id')).filter(Boolean),
          exactTexts: Array.from(region?.querySelectorAll('*') || []).filter((element) => element.childElementCount === 0 && element.textContent.trim()).map((element) => element.textContent.trim()),
        };
      }, { selectors: REGION_SELECTORS });
      await page.emulateMediaType('screen');
    }
    await new Promise((resolve) => setTimeout(resolve, 50));

    return {
      url: page.url(),
      browserVersion,
      api,
      nodeCore,
      desktop,
      focal,
      locales,
      mobileThemes,
      printable,
      consoleErrors: consoleErrors.slice(),
      pageErrors: pageErrors.slice(),
      rawConsoleErrors: consoleErrors.slice(),
      rawPageErrors: pageErrors.slice(),
    };
  } finally {
    if (counterCleanup) await counterCleanup().catch(() => {});
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    await closeServer(server);
  }
}

function buildReports(snapshot) {
  const d = snapshot.desktop;
  const f = snapshot.focal;
  const reportTelemetry = telemetry(d.pageLoaded === true, snapshot.consoleErrors, snapshot.pageErrors, d.invalidTokens);
  const common = {
    realPageLoaded: d.pageLoaded === true,
    realNodeCoreAvailable: snapshot.nodeCore.available === true,
    realPageEngineAvailable: f.engineAvailable === true,
    zeroConsoleErrors: snapshot.consoleErrors.length === 0,
    zeroPageErrors: snapshot.pageErrors.length === 0,
    zeroInvalidTokens: d.invalidTokens.length === 0,
  };
  const checks = (extra) => ({ ...common, ...extra });
  const nominal = f.nominalRuns[0] || {};
  const nominalResult = nominal.result;
  const nominalInput = nominal.input;
  const row300 = nominalInput?.catalog?.candidates?.[5];
  const catalogKeys = EXPECTED_CATALOG.map((candidate) => Object.keys(candidate).sort());
  const actualCatalogKeys = (nominalInput?.catalog?.candidates || []).map((candidate) => Object.keys(candidate).sort());
  const sharedObserved = Object.fromEntries(Object.entries(f.initial.sharedMetadata)
    .map(([key, item]) => [key, item.value]));
  const catalogObserved = {
    mode: f.initial.catalogMetadata.mode.value,
    source: f.initial.catalogMetadata.source.value,
    sourceVersion: f.initial.catalogMetadata.sourceVersion.value,
    provenance: f.initial.catalogMetadata.provenance.value,
    impedanceBasis: {
      length_m: Number(f.initial.catalogMetadata.impedanceLength.value),
      description: f.initial.catalogMetadata.impedanceDescription.value,
      provenance: f.initial.catalogMetadata.impedanceProvenance.value,
    },
  };

  const editMatrix = f.editRuns.map((run, index) => {
    const expectedCandidates = EXPECTED_CATALOG.map((candidate, candidateIndex) => (
      candidateIndex === 5 ? { ...candidate, [run.pathName]: run.injectedValue } : candidate
    ));
    return matrixCase(EDIT_CASES[index][0], {
      controlPresent: true,
      engineCalls: 1,
      candidates: expectedCandidates,
      candidateKeys: catalogKeys,
      catalogSourceVersion: CATALOG_METADATA.sourceVersion,
      impedancePresent: false,
    }, {
      controlPresent: run.controlPresent,
      engineCalls: run.engineCalls,
      candidates: run.input?.catalog?.candidates ?? null,
      candidateKeys: (run.input?.catalog?.candidates || []).map((candidate) => Object.keys(candidate).sort()),
      catalogSourceVersion: run.input?.catalog?.sourceVersion ?? null,
      impedancePresent: Object.prototype.hasOwnProperty.call(run.input?.catalog?.candidates?.[5] || {}, 'impedance_ohm'),
    });
  });

  const expectedErrorPaths = [
    { controlPresent: true, faultInjection: false, engineCalls: 1, candidateId: '1x300', blockerCode: 'CANDIDATE_STRUCTURE_INVALID', blockerReason: 'candidate_incomplete', cards: 0 },
    { controlPresent: true, faultInjection: false, engineCalls: 1, candidateId: '1x300', blockerCode: 'CANDIDATE_STRUCTURE_INVALID', blockerReason: 'candidate_value_invalid', cards: 0 },
    { controlPresent: true, faultInjection: false, engineCalls: 1, candidateId: '1x300', blockerCode: 'CANDIDATE_STRUCTURE_INVALID', blockerReason: 'candidate_value_invalid', cards: 0 },
    { controlPresent: true, faultInjection: true, engineCalls: 1, errorCode: 'CANDIDATE_IMPEDANCE_REPRESENTATION_CONFLICT', catalogLength: 1, cards: 0 },
    { controlPresent: true, faultInjection: false, engineCalls: 1, candidateId: '1x300', blockerCode: 'CANDIDATE_STRUCTURE_INVALID', blockerReason: 'catalog_heterogeneous', cards: 0 },
  ];
  const errorMatrix = f.errorRuns.map((run, index) => {
    const item = run.result?.data?.evaluatedCandidates?.[5];
    const observed = index === 3 ? {
      controlPresent: run.controlPresent,
      faultInjection: run.faultInjection,
      engineCalls: run.engineCalls,
      errorCode: run.result?.error?.params?.errors?.[0]?.code ?? null,
      catalogLength: run.input?.catalog?.candidates?.length ?? null,
      cards: run.cards,
    } : {
      controlPresent: run.controlPresent,
      faultInjection: run.faultInjection,
      engineCalls: run.engineCalls,
      candidateId: item?.candidateId ?? null,
      blockerCode: item?.blockers?.[0]?.code ?? null,
      blockerReason: item?.blockers?.[0]?.params?.reason ?? null,
      cards: run.cards,
    };
    return matrixCase(ERROR_CASE_IDS[index], expectedErrorPaths[index], observed);
  });

  const localeMatrix = ['pt', 'en', 'es'].map((language, index) => {
    const item = snapshot.locales[language];
    const expectedValues = Object.fromEntries(Object.entries(TRANSLATIONS).map(([group, byLanguage]) => [group, byLanguage[language]]));
    return matrixCase(LOCALE_CASE_IDS[index], {
      htmlLang: language,
      row300Present: true,
      row300Mentions300mm2: true,
      exactLocalizedValues: expectedValues,
      permanentNotice: TRANSLATIONS.warning[language],
      projectedNotice: TRANSLATIONS.warning[language],
      rawDisplayNotice: RAW_NOTICE,
      patternSources: FORBIDDEN_PATTERNS[language],
      forbiddenVocabulary: [],
      crossLanguageLeakage: [],
    }, {
      htmlLang: item.htmlLang,
      row300Present: item.row300Present,
      row300Mentions300mm2: /300\s*mm(?:Â²|²|2)/i.test(item.row300Text),
      exactLocalizedValues: item.values,
      permanentNotice: item.permanentNotice,
      projectedNotice: item.projectedNotice,
      rawDisplayNotice: item.rawDisplayNotice,
      patternSources: item.patternSources,
      forbiddenVocabulary: item.forbiddenVocabulary,
      crossLanguageLeakage: item.closedLanguageLeakage,
    });
  });

  const a11yExpected = {
    landmark: true, labelsAssociated: true, uniqueLandmark: true,
    confirmationsOutsideDetails: true,
  };
  const a11yObserved = {
    landmark: d.accessibility.landmark,
    labelsAssociated: d.accessibility.labelsAssociated,
    uniqueLandmark: f.initial.regionCount === 1,
    confirmationsOutsideDetails: f.initial.confirmations.every((item) => item.outsideDetails),
  };
  const responsiveMatrix = [
    matrixCase(RESPONSIVE_CASE_IDS[0], { viewportWidth: 375, noHorizontalOverflow: true, detailsOpen: true, rowCount: 6 }, {
      viewportWidth: snapshot.mobileThemes.light.viewportWidth,
      noHorizontalOverflow: snapshot.mobileThemes.light.noHorizontalOverflow,
      detailsOpen: snapshot.mobileThemes.light.detailsOpen,
      rowCount: snapshot.mobileThemes.light.rowCount,
    }),
    matrixCase(RESPONSIVE_CASE_IDS[1], { viewportWidth: 375, noHorizontalOverflow: true, detailsOpen: true, rowCount: 6 }, {
      viewportWidth: snapshot.mobileThemes.dark.viewportWidth,
      noHorizontalOverflow: snapshot.mobileThemes.dark.noHorizontalOverflow,
      detailsOpen: snapshot.mobileThemes.dark.detailsOpen,
      rowCount: snapshot.mobileThemes.dark.rowCount,
    }),
    matrixCase(RESPONSIVE_CASE_IDS[2], a11yExpected, a11yObserved),
    matrixCase(RESPONSIVE_CASE_IDS[3], { focusable: true, visibleFocus: true, noInlineHandlers: true }, {
      focusable: d.accessibility.focusableCount > 0,
      visibleFocus: d.accessibility.focusVisible,
      noInlineHandlers: d.accessibility.inlineHandlers.length === 0,
    }),
  ];

  const evaluated300 = ['1x300', '2x300', '3x300', '4x300'].map((candidateId) => {
    const item = nominalResult?.data?.evaluatedCandidates?.find((candidate) => candidate.candidateId === candidateId);
    return { candidateId, status: item?.status ?? null };
  });
  const objectiveReport = (id, objective) => {
    const run = f.nominalRuns.find((item) => item.objective === objective) || {};
    const top = run.result?.data?.firstInPresentationOrder?.candidateId
      || run.result?.data?.presentationOrder?.[0]?.candidateId || null;
    return resultReport(id, checks({
      exactlyOneEngineCall: run.engineCalls === 1,
      expectedFirstCandidate: top === OBJECTIVE_TOPS[objective],
      exactPresentationPolicy: isDeepStrictEqual(run.input?.presentationPolicy, POLICY),
      firstMatchesPresentationOrder: top === (run.result?.data?.presentationOrder?.[0]?.candidateId || null),
      cardsMatchPresentationModel: isDeepStrictEqual(run.cardIds, run.presentationCardIds),
      hiddenCandidatesAbsentFromDom: run.hiddenCandidateIds.every((candidateId) => !run.cardIds.includes(candidateId)),
      maximumMarginRetainsAll300Alternatives: objective !== 'MAX_MINIMUM_MARGIN'
        || ['2x300', '3x300', '4x300'].every((candidateId) => (run.result?.data?.candidateAlternatives || []).some((item) => item.candidateId === candidateId)),
      maximumMarginShowsOnlyMinimum300Card: objective !== 'MAX_MINIMUM_MARGIN'
        || (run.cardIds.includes('2x300') && !run.cardIds.includes('3x300') && !run.cardIds.includes('4x300')),
      noElection: run.result?.data?.installableSelection === null,
      installationNotAuthorized: run.result?.data?.installationAuthorized === false,
      productionNotAllowed: run.result?.productionAllowed === false,
      noRecommendedPath: !Object.prototype.hasOwnProperty.call(run.result?.data || {}, 'recommended'),
      noSelectedPath: !Object.prototype.hasOwnProperty.call(run.result?.data || {}, 'selected'),
    }), { objective, expectedTop: OBJECTIVE_TOPS[objective], expectedPolicy: POLICY, observedTop: top, run }, reportTelemetry);
  };
  const reports = [
    resultReport('UI300-01', checks({
      advancedDetailsPresent: f.initial.detailsPresent,
      initiallyClosed: f.initial.detailsInitiallyOpen === false,
      exactlySixCatalogRows: f.initial.rowCount === 6,
      exactIndexes: isDeepStrictEqual(f.initial.rowIndexes, ['0', '1', '2', '3', '4', '5']),
    }), { initial: f.initial }, reportTelemetry),
    resultReport('UI300-02', checks({
      exactly42EditableFields: f.initial.fieldCount === 42,
      sevenPerRow: f.initial.fieldsPerRow.length === 6
        && f.initial.fieldsPerRow.every((row) => isDeepStrictEqual(row.names, f.fieldNames)),
    }), { fieldCount: f.initial.fieldCount, fieldsPerRow: f.initial.fieldsPerRow }, reportTelemetry),
    resultReport('UI300-03', checks({
      exactlyTwoConfirmations: f.initial.confirmations.length === 2,
      visibleEnabledOutsideDetails: f.initial.confirmations.every((item) => item.present && item.visible && item.enabled && item.outsideDetails),
    }), { confirmations: f.initial.confirmations }, reportTelemetry),
    resultReport('UI300-04', checks({
      sixCandidatesCaptured: nominalInput?.catalog?.candidates?.length === 6,
      exactCandidate300Dto: isDeepStrictEqual(row300, EXPECTED_CATALOG[5]),
      exactCandidateSchemas: isDeepStrictEqual(actualCatalogKeys, catalogKeys),
      exactSharedMetadataFromDom: isDeepStrictEqual(sharedObserved, SHARED_METADATA),
      exactCatalogMetadataFromDom: isDeepStrictEqual(catalogObserved, CATALOG_METADATA),
      impedancePhysicallyAbsent: row300 && !Object.prototype.hasOwnProperty.call(row300, 'impedance_ohm'),
    }), { row300, sharedMetadata: sharedObserved, catalogMetadata: catalogObserved, candidateKeys: actualCatalogKeys }, reportTelemetry),
    resultReport('UI300-05', checks({
      exactlySevenCases: editMatrix.length === 7,
      allCasesCompliant: editMatrix.every((item) => item.compliant),
    }), { cases: editMatrix }, reportTelemetry),
    resultReport('UI300-06', checks({
      oneRealCallPerNominalAction: f.nominalRuns.every((run) => run.engineCalls === 1),
      catalogAbsentBecomesEmpty: isDeepStrictEqual(f.noCatalogRun.input?.catalog?.candidates, []),
      noCatalogRecoveryCallOnce: f.noCatalogRun.engineCalls === 1,
      resultProjectionUsesEnvelopeCounts: d.alternatives.expectedCount === (d.engine.latestEnvelope?.data?.candidateAlternatives?.length ?? -1),
    }), { nominalCallCounts: f.nominalRuns.map((run) => run.engineCalls), noCatalogRun: f.noCatalogRun }, reportTelemetry),
    resultReport('UI300-07', checks({
      evaluatedCount24: nominalResult?.data?.evaluatedCandidates?.length === 24,
      alternativesCount14: nominalResult?.data?.candidateAlternatives?.length === 14,
      rejectedCount10: nominalResult?.data?.rejectedCandidates?.length === 10,
      frontierCount14: nominalResult?.data?.nonDominatedAlternatives?.length === 14,
      rawScientificArraysUnmutated: f.nominalRuns.every((run) => run.rawArraysUnmutated),
      exact300States: isDeepStrictEqual(evaluated300, [
        { candidateId: '1x300', status: 'REJECTED' },
        { candidateId: '2x300', status: 'VALID' },
        { candidateId: '3x300', status: 'VALID' },
        { candidateId: '4x300', status: 'VALID' },
      ]),
    }), { counts: {
      evaluated: nominalResult?.data?.evaluatedCandidates?.length ?? null,
      alternatives: nominalResult?.data?.candidateAlternatives?.length ?? null,
      rejected: nominalResult?.data?.rejectedCandidates?.length ?? null,
      frontier: nominalResult?.data?.nonDominatedAlternatives?.length ?? null,
    }, evaluated300 }, reportTelemetry),
    objectiveReport('UI300-08', 'NONE'),
    objectiveReport('UI300-09', 'MIN_PARALLEL_COUNT'),
    objectiveReport('UI300-10', 'MIN_TOTAL_COPPER'),
    objectiveReport('UI300-11', 'MAX_MINIMUM_MARGIN'),
    resultReport('UI300-12', checks({
      exactlyFiveCases: errorMatrix.length === 5,
      allCasesCompliant: errorMatrix.every((item) => item.compliant),
    }), { cases: errorMatrix }, reportTelemetry),
    resultReport('UI300-13', checks({
      exactlyThreeCases: localeMatrix.length === 3,
      allCasesCompliant: localeMatrix.every((item) => item.compliant),
    }), { cases: localeMatrix }, reportTelemetry),
    resultReport('UI300-14', checks({
      exactlyFourCases: responsiveMatrix.length === 4,
      allCasesCompliant: responsiveMatrix.every((item) => item.compliant),
    }), { cases: responsiveMatrix }, reportTelemetry),
    resultReport('UI300-15', checks({
      allLanguagesVisibleInPrint: Object.values(snapshot.printable).every((item) => item.visibleInPrint),
      sixCatalogEntriesAnd300mm2: f.initial.rowCount === 6 && Object.values(snapshot.printable).every((item) => /300\s*mm(?:Â²|²|2)/i.test(item.text)),
      onlyMinimumCards: Object.values(snapshot.printable).every((item) => isDeepStrictEqual(item.cardIds, f.printRun?.presentationCardIds || [])),
      superior300CardsHidden: Object.values(snapshot.printable).every((item) => !item.cardIds.includes('3x300') && !item.cardIds.includes('4x300')),
      localizedWarningAndPrintLabel: Object.entries(snapshot.printable).every(([language, item]) => item.exactTexts.includes(TRANSLATIONS.warning[language]) && item.exactTexts.includes(TRANSLATIONS.printLabel[language])),
      criteriaPresent: Object.values(snapshot.printable).every((item) => {
        const text = normalize(item.text);
        return /(ampacidade|ampacity|ampacidad)/.test(text) && /(queda|voltage drop|caida)/.test(text) && /(curto|short-circuit|cortocircuito)/.test(text);
      }),
      installationNotAuthorized: Object.values(snapshot.printable).every((item) => /(instalacao autorizada|installation authorized|instalacion autorizada)\s*:\s*(nao|no)/.test(normalize(item.text))),
      guardrailsPreserved: nominalResult?.productionAllowed === false && nominalResult?.data?.installableSelection === null
        && nominalResult?.data?.installationAuthorized === false && ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'].every((code) => (nominalResult?.blockers || []).some((item) => item.code === code)),
    }), { printable: snapshot.printable, maximumMarginRun: f.printRun }, reportTelemetry),
  ];
  return reports;
}

async function main() {
  try {
    validateHarnessConfiguration();
  } catch (error) {
    const reports = configReports(error);
    const summary = {
      classification: 'CONFIG_ERROR', reports: reports.length, expectedReports: IDS.length,
      compliant: 0, nonCompliant: reports.length, assertionsExercised: 0,
      processExitCode: 3, preflightExitCode: 0, preflightError: null,
      functionalError: serializeError(error),
    };
    reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
    process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify(summary)}\n`);
    process.exitCode = 3;
    return;
  }
  const nodeCore = loadRealCore();
  let puppeteer;
  let preflight = null;
  let preflightError = null;
  let functionalError = null;
  let preflightBlocked = false;
  let reports = [];

  if (!nodeCore.available) {
    functionalError = new Error(`Módulo real indisponível: ${JSON.stringify(nodeCore)}`);
    reports = configReports(functionalError);
  } else {
    try {
      puppeteer = require('puppeteer');
    } catch (error) {
      functionalError = error;
      reports = configReports(error);
    }
    try {
      if (!puppeteer) throw new Error('Puppeteer indisponível antes do preflight.');
      preflight = await chromiumPreflight(puppeteer);
    } catch (error) {
      if (puppeteer) {
        preflightBlocked = true;
        preflightError = error;
        reports = preflightBlockedReports(error, preflight);
      }
    }
  }

  if (nodeCore.available && preflight?.exitCode === 0 && reports.length === 0) {
    try {
      const snapshot = await executeVisualScenario(puppeteer, nodeCore);
      reports = buildReports(snapshot);
    } catch (error) {
      functionalError = error;
      reports = configReports(error);
    }
  }

  if (reports.length !== IDS.length) reports = configReports(new Error(`Esperados 15 relatórios; obtidos ${reports.length}.`));
  const classification = classify(reports, preflightBlocked);
  const processExitCode = exitCodeFor(classification);
  const compliant = reports.filter((report) => report.compliant).length;
  const assertionsExercised = reports.filter((report) => report.assertionExercised).length;
  const summary = {
    classification,
    reports: reports.length,
    expectedReports: IDS.length,
    compliant,
    nonCompliant: reports.length - compliant,
    assertionsExercised,
    processExitCode,
    preflightExitCode: preflight?.exitCode ?? (preflightError ? 2 : 0),
    preflightError: preflightError ? serializeError(preflightError) : null,
    functionalError: functionalError ? serializeError(functionalError) : null,
  };

  if (!summaryProtocolValid(summary, reports)) {
    throw new Error('Summary UI300 nÃ£o reconciliado com os relatÃ³rios.');
  }

  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify(summary)}\n`);
  process.exitCode = processExitCode;
}

main().catch((error) => {
  const reports = configReports(error);
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify({
    classification: 'CONFIG_ERROR',
    reports: reports.length,
    expectedReports: IDS.length,
    compliant: 0,
    nonCompliant: reports.length,
    assertionsExercised: 0,
    processExitCode: 3,
    preflightExitCode: 0,
    preflightError: null,
    functionalError: serializeError(error),
  })}\n`);
  process.exitCode = 3;
});
