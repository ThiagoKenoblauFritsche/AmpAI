/**
 * O.S. UI-LUCIDE-BOOT-001-RED — resiliência de boot sem Lucide.
 *
 * Fault injection: bloqueia exclusivamente a requisição do pacote Lucide em
 * unpkg.com. Página, motores, navegação, cálculo e renderer permanecem reais.
 */
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const REPORT_PREFIX = 'UI_LUCIDE_BOOT_001_REPORT';
const SUMMARY_PREFIX = 'UI_LUCIDE_BOOT_001_SUMMARY';
const CASE_IDS = [
  'lucide-unavailable-no-reference-error',
  'app-ready-with-lucide-unavailable',
  'bt-calculation-renders-with-lucide-unavailable',
];

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const BT_FIXTURE = {
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

function serializeError(error) {
  return {
    name: error?.name || 'Error',
    message: String(error?.message || error),
    stack: String(error?.stack || ''),
  };
}

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${HOST}`);
    const relativePath = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
    const filePath = path.resolve(ROOT, `.${relativePath}`);

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
    server.listen(0, HOST, () => {
      resolve({ server, url: `http://${HOST}:${server.address().port}/index.html` });
    });
  });
}

function closeServer(server) {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => server.close(() => resolve()));
}

function isLucideUnpkgUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.hostname === 'unpkg.com' && /(^|\/)lucide(?:@|\/|$)/i.test(url.pathname);
  } catch {
    return false;
  }
}

function resultReport(caseId, compliant, evidence) {
  return {
    case: caseId,
    classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
    assertionExercised: true,
    ...evidence,
    compliant,
  };
}

function blockedReports(error) {
  return CASE_IDS.map((caseId) => ({
    case: caseId,
    classification: 'INFRA_BLOCKED',
    assertionExercised: false,
    preflightError: serializeError(error),
    compliant: false,
  }));
}

function configReports(error) {
  return CASE_IDS.map((caseId) => ({
    case: caseId,
    classification: 'CONFIG_ERROR',
    assertionExercised: false,
    harnessError: serializeError(error),
    compliant: false,
  }));
}

function exitCodeFor(classification) {
  return {
    PASS: 0,
    FUNCTIONAL_FAILURE: 1,
    INFRA_BLOCKED: 2,
    CONFIG_ERROR: 3,
  }[classification] ?? 3;
}

function classify(reports, preflightExitCode) {
  if (preflightExitCode !== 0) return 'INFRA_BLOCKED';
  if (
    reports.length !== CASE_IDS.length
    || reports.some((report) => report.classification === 'CONFIG_ERROR' || report.assertionExercised !== true)
  ) return 'CONFIG_ERROR';
  if (reports.some((report) => !report.compliant)) return 'FUNCTIONAL_FAILURE';
  return 'PASS';
}

async function chromiumPreflight(puppeteer) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const version = await browser.version();
    return {
      command: "puppeteer.launch({ headless: 'new' })",
      attempts: 1,
      browserVersion: version,
      executablePath: puppeteer.executablePath(),
      exitCode: 0,
    };
  } finally {
    if (browser) await browser.close();
  }
}

async function executeFaultScenario(puppeteer) {
  let server;
  let browser;
  const pageErrors = [];
  const consoleErrors = [];
  const blockedRequests = [];
  const continuedRequests = [];
  const requestFailures = [];

  try {
    const staticServer = await startStaticServer();
    server = staticServer.server;
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('pageerror', (error) => pageErrors.push(serializeError(error)));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push({ type: message.type(), text: message.text() });
      }
    });
    page.on('requestfailed', (request) => {
      requestFailures.push({
        url: request.url(),
        errorText: request.failure()?.errorText || null,
      });
    });

    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const requestUrl = request.url();
      if (isLucideUnpkgUrl(requestUrl)) {
        blockedRequests.push(requestUrl);
        request.abort('failed');
        return;
      }
      continuedRequests.push(requestUrl);
      request.continue();
    });

    await page.goto(staticServer.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((resolve) => setTimeout(resolve, 250));

    const apiState = await page.evaluate(() => ({
      switchModule: typeof window.switchModule,
      switchCablingCard: typeof window.switchCablingCard,
      calculateCablingBT: typeof window.calculateCablingBT,
      renderCardBT: typeof window.renderCardBT,
      documentReadyState: document.readyState,
    }));

    const calculation = await page.evaluate(async (fixture) => {
      const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const requiredFunctions = [
        'switchModule', 'switchCablingCard', 'calculateCablingBT', 'renderCardBT',
      ];
      const missingFunctions = requiredFunctions.filter((name) => typeof window[name] !== 'function');
      if (missingFunctions.length > 0) {
        return {
          attempted: false,
          missingFunctions,
          engineCallCount: 0,
          rendererCallCount: 0,
          envelopeOk: false,
          resultRendered: false,
          criteriaTableRendered: false,
          invalidTokens: [],
        };
      }

      Object.entries(fixture).forEach(([id, value]) => {
        const input = document.getElementById(id);
        if (!input) throw new Error(`Harness: campo BT real ausente: #${id}`);
        input.value = value;
      });
      window.AmpAI_State = window.AmpAI_State || {};
      window.AmpAI_State.btCond = 'Cu';
      window.AmpAI_State.btIns = 'XLPE';

      const originalEngine = window.calculateCablingBT;
      const originalRenderer = window.renderCardBT;
      const engineResults = [];
      const rendererPayloads = [];

      window.calculateCablingBT = function observedRealEngine(input) {
        const result = originalEngine.apply(this, arguments);
        engineResults.push(result);
        return result;
      };
      window.renderCardBT = function observedRealRenderer(payload) {
        rendererPayloads.push(payload);
        return originalRenderer.apply(this, arguments);
      };

      window.switchModule('cabling');
      window.switchCablingCard('bt');
      await wait(350);

      window.calculateCablingBT = originalEngine;
      window.renderCardBT = originalRenderer;

      const latestEnvelope = [...engineResults].reverse().find((entry) => entry && typeof entry === 'object') || null;
      const data = latestEnvelope?.ok === true ? latestEnvelope.data : null;
      const card = document.querySelector('#card-bt');
      const cardText = card?.innerText || '';
      const primaryResult = card?.querySelector('.result-card.primary .result-value')?.innerText || '';
      const criteriaTable = Array.from(card?.querySelectorAll('table') || []).find((table) => {
        const text = (table.innerText || '').replace(/[₁₂₃]/g, (token) => ({ '₁': '1', '₂': '2', '₃': '3' }[token]));
        return table.querySelectorAll('thead th').length === 3
          && ['S1', 'S2', 'S3'].every((token) => text.includes(token));
      }) || null;
      const invalidTokens = ['undefined', 'NaN', '--'].filter((token) => {
        if (token === '--') return /(^|\s)--(?=\s|$)/.test(cardText);
        return new RegExp(`(^|\\s)${token}(?=\\s|$)`, 'i').test(cardText);
      });

      return {
        attempted: true,
        missingFunctions,
        engineCallCount: engineResults.length,
        rendererCallCount: rendererPayloads.length,
        envelopeOk: Boolean(data),
        envelopeSummary: data ? {
          S1: data.S1,
          S2: data.S2,
          S3: data.S3,
          sFinal: data.sFinal,
          dominant: data.dominant,
        } : null,
        dataDeliveredToRenderer: Boolean(data && rendererPayloads.includes(data)),
        resultRendered: Boolean(data && primaryResult.includes(String(data.sFinal))),
        primaryResult,
        criteriaTableRendered: Boolean(criteriaTable),
        criteriaCaption: criteriaTable?.querySelector('caption')?.innerText || '',
        criteriaHeaders: Array.from(criteriaTable?.querySelectorAll('thead th') || []).map((cell) => cell.innerText),
        invalidTokens,
      };
    }, BT_FIXTURE);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const lucideReferenceErrors = pageErrors.filter((error) => /lucide is not defined/i.test(error.message));
    const unexpectedPageErrors = pageErrors.filter((error) => !/lucide is not defined/i.test(error.message));
    const faultInjection = {
      target: 'unpkg.com/lucide',
      blockedRequests,
      blockedCount: blockedRequests.length,
      onlyLucideBlocked: blockedRequests.length > 0 && blockedRequests.every(isLucideUnpkgUrl),
      nonLucideRequestsContinued: continuedRequests.length,
      requestFailures,
    };

    const report1Compliant = faultInjection.onlyLucideBlocked && lucideReferenceErrors.length === 0;
    const report2Checks = {
      faultInjected: faultInjection.onlyLucideBlocked,
      switchModuleAvailable: apiState.switchModule === 'function',
      switchCablingCardAvailable: apiState.switchCablingCard === 'function',
      calculateCablingBTAvailable: apiState.calculateCablingBT === 'function',
      renderCardBTAvailable: apiState.renderCardBT === 'function',
    };
    const report3Checks = {
      faultInjected: faultInjection.onlyLucideBlocked,
      calculationAttempted: calculation.attempted === true,
      realEngineCalled: calculation.engineCallCount >= 1,
      realRendererCalled: calculation.rendererCallCount >= 1,
      successfulEnvelope: calculation.envelopeOk === true,
      envelopeDataDeliveredToRenderer: calculation.dataDeliveredToRenderer === true,
      resultRendered: calculation.resultRendered === true,
      criteriaTableRendered: calculation.criteriaTableRendered === true,
      noInvalidTokens: calculation.invalidTokens.length === 0,
      noUnexpectedPageErrors: unexpectedPageErrors.length === 0,
    };

    return [
      resultReport(CASE_IDS[0], report1Compliant, {
        faultInjection,
        telemetry: { pageErrors, consoleErrors },
        lucideReferenceErrors,
      }),
      resultReport(CASE_IDS[1], Object.values(report2Checks).every(Boolean), {
        faultInjection,
        apiState,
        checks: report2Checks,
        telemetry: { pageErrors, consoleErrors },
      }),
      resultReport(CASE_IDS[2], Object.values(report3Checks).every(Boolean), {
        faultInjection,
        checks: report3Checks,
        calculation,
        telemetry: { pageErrors, consoleErrors, unexpectedPageErrors },
      }),
    ];
  } finally {
    if (browser) await browser.close().catch(() => {});
    await closeServer(server);
  }
}

async function main() {
  let reports = [];
  let preflightExitCode = 0;
  let preflight = null;
  let preflightError = null;

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
    preflight = await chromiumPreflight(puppeteer);
  } catch (error) {
    preflightExitCode = 2;
    preflightError = error;
    reports = blockedReports(error);
  }

  if (preflightExitCode === 0) {
    try {
      reports = await executeFaultScenario(puppeteer);
    } catch (error) {
      reports = configReports(error);
    }
  }

  if (reports.length !== CASE_IDS.length) {
    reports = configReports(new Error(`Esperados 3 relatórios; obtidos ${reports.length}.`));
  }

  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));

  const classification = classify(reports, preflightExitCode);
  const processExitCode = exitCodeFor(classification);
  const compliant = reports.filter((report) => report.compliant).length;
  const summary = {
    classification,
    reports: reports.length,
    compliant,
    nonCompliant: reports.length - compliant,
    preflightExitCode,
    processExitCode,
    preflight,
    preflightError: preflightError ? serializeError(preflightError) : null,
  };
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify(summary)}\n`);
  process.exitCode = processExitCode;
}

main().catch((error) => {
  const reports = configReports(error);
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify({
    classification: 'CONFIG_ERROR',
    reports: reports.length,
    compliant: 0,
    nonCompliant: reports.length,
    preflightExitCode: 0,
    processExitCode: 3,
    preflight: null,
    preflightError: null,
  })}\n`);
  process.exitCode = 3;
});
