/**
 * O.S. 049-E2E — RED de cálculo real BT/MT.
 *
 * Executa a UI, motores e renderizadores reais. A instrumentação abaixo apenas
 * observa argumentos, retornos e erros; nenhum resultado é substituído.
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const FIXTURES = {
  BT: {
    values: {
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
    },
    state: { btCond: 'Cu', btIns: 'XLPE' },
    requiredKeys: [
      'method', 'phases', 'Ib_A', 'In_A', 'ULL_V', 'length_m', 'cosPhi',
      'duMax_pct', 'thetaAmb_C', 'nCircuits', 'Icc_A', 'tProt_s',
      'conductor', 'insulation',
    ],
    numericKeys: [
      'phases', 'Ib_A', 'In_A', 'ULL_V', 'length_m', 'cosPhi', 'duMax_pct',
      'thetaAmb_C', 'nCircuits', 'Icc_A', 'tProt_s',
    ],
  },
  MT: {
    values: {
      'mt-ull': '13.8',
      'mt-insulation-class': '8.7/15',
      'mt-installation': 'UNDERGROUND_DUCT',
      'mt-formation': 'TREFOIL_TOUCHING',
      'mt-ib': '250',
      'mt-in': '300',
      'mt-length': '150',
      'mt-cosphi': '0.90',
      'mt-du-max': '2',
      'mt-icc': '12.5',
      'mt-ifault': '1',
      'mt-tcond': '0.5',
      'mt-tscreen': '1',
      'mt-tamb': '20',
      'mt-depth': '0.8',
      'mt-rho-soil': '1',
      'mt-ncirc': '1',
    },
    state: { mtCond: 'Cu', mtIns: 'XLPE' },
    requiredKeys: [
      'ULL_V', 'Ib_A', 'In_A', 'length_m', 'cosPhi', 'duMax_pct', 'Icc_A',
      'iFault_A', 'tConductor_s', 'tScreen_s', 'thetaAmb_C', 'depth_m',
      'rhoSoil_KmW', 'nCircuits', 'voltageClass', 'formation', 'conductor',
      'insulation', 'sheath',
    ],
    numericKeys: [
      'ULL_V', 'Ib_A', 'In_A', 'length_m', 'cosPhi', 'duMax_pct', 'Icc_A',
      'iFault_A', 'tConductor_s', 'tScreen_s', 'thetaAmb_C', 'depth_m',
      'rhoSoil_KmW', 'nCircuits',
    ],
  },
};

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
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function runDomain(page, domain) {
  const fixture = FIXTURES[domain];

  return page.evaluate(async ({ selectedDomain, selectedFixture }) => {
    const domainLower = selectedDomain.toLowerCase();
    const engineName = selectedDomain === 'BT' ? 'calculateCablingBT' : 'calculateCablingMT';
    const rendererNames = selectedDomain === 'BT'
      ? ['renderCardBT', 'renderCablingBTResults']
      : ['renderCardMT', 'renderCablingMTResults'];
    const cardSelector = `#card-${domainLower}`;
    const card = document.querySelector(cardSelector);
    const button = document.querySelector(`#btn-${domainLower}`);

    const waitFrames = (count) => new Promise((resolve) => {
      const next = () => {
        if (count-- <= 0) return resolve();
        requestAnimationFrame(next);
      };
      requestAnimationFrame(next);
    });

    const isVisible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && style.opacity !== '0'
        && rect.width > 0
        && rect.height > 0;
    };

    const waitUntilStable = (element, maxFrames = 180) => new Promise((resolve, reject) => {
      let previous = null;
      let stable = 0;
      let frames = 0;
      const observe = () => {
        frames += 1;
        const rect = element.getBoundingClientRect();
        const current = [rect.left, rect.top, rect.width, rect.height];
        const unchanged = previous && current.every((value, index) => Math.abs(value - previous[index]) < 0.01);
        stable = isVisible(element) && unchanged ? stable + 1 : 0;
        previous = current;
        if (stable >= 60) return resolve({ frames, rect: current });
        if (frames >= maxFrames) return reject(new Error(`${cardSelector} não ficou visível e estável.`));
        requestAnimationFrame(observe);
      };
      requestAnimationFrame(observe);
    });

    const normalize = (value) => String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const numberAppears = (text, value) => {
      if (!Number.isFinite(value)) return false;
      const normalizedText = normalize(text).replace(/,/g, '.');
      const candidates = new Set([
        String(value),
        value.toFixed(0),
        value.toFixed(1),
        value.toFixed(2),
        value.toFixed(4),
      ]);
      return [...candidates].some((candidate) => normalizedText.includes(candidate));
    };

    const serializeError = (error) => ({
      name: error?.name || 'Error',
      message: String(error?.message || error),
    });

    if (
      !card
      || !button
      || typeof window.switchModule !== 'function'
      || typeof window.switchCablingCard !== 'function'
      || typeof window[engineName] !== 'function'
    ) {
      throw new Error(`Harness O.S.049-E2E sem API/seletor obrigatório para ${selectedDomain}.`);
    }

    const navigationErrors = [];
    try {
      window.switchModule('cabling');
    } catch (error) {
      navigationErrors.push({ step: 'switchModule', ...serializeError(error) });
    }
    try {
      window.switchCablingCard(domainLower);
    } catch (error) {
      navigationErrors.push({ step: 'switchCablingCard', ...serializeError(error) });
    }
    const stableState = await waitUntilStable(card);

    Object.entries(selectedFixture.values).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (!input) throw new Error(`Campo real ausente: #${id}`);
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    window.AmpAI_State = window.AmpAI_State || {};
    Object.assign(window.AmpAI_State, selectedFixture.state);

    await waitFrames(3);

    const engineCalls = [];
    const engineResults = [];
    const engineErrors = [];
    const rendererCalls = [];
    const rendererErrors = [];
    const consoleErrors = [];
    const browserErrors = [];

    const originalEngine = window[engineName];
    const originalRenderers = new Map(rendererNames.map((name) => [name, window[name]]));
    const originalConsoleError = console.error;
    const onBrowserError = (event) => {
      browserErrors.push(serializeError(event.error || event.message));
    };
    const onUnhandledRejection = (event) => {
      browserErrors.push(serializeError(event.reason));
    };

    window[engineName] = function observedRealEngine(input) {
      engineCalls.push(input);
      try {
        const result = originalEngine.call(this, input);
        engineResults.push(result);
        return result;
      } catch (error) {
        engineErrors.push(serializeError(error));
        throw error;
      }
    };

    rendererNames.forEach((name) => {
      const originalRenderer = originalRenderers.get(name);
      if (typeof originalRenderer !== 'function') return;
      window[name] = function observedRealRenderer(payload) {
        rendererCalls.push({ name, payload });
        try {
          return originalRenderer.apply(this, arguments);
        } catch (error) {
          rendererErrors.push({ name, ...serializeError(error) });
          throw error;
        }
      };
    });

    console.error = function observedConsoleError() {
      consoleErrors.push(Array.from(arguments).map((value) => String(value)));
      return originalConsoleError.apply(this, arguments);
    };
    window.addEventListener('error', onBrowserError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    engineCalls.length = 0;
    engineResults.length = 0;
    engineErrors.length = 0;
    rendererCalls.length = 0;
    rendererErrors.length = 0;
    consoleErrors.length = 0;
    browserErrors.length = 0;
    const cardVisibleBeforeAction = isVisible(card);
    const cardTextBeforeAction = card.innerText || '';

    let actionError = null;
    try {
      button.click();
      await waitFrames(12);
    } catch (error) {
      actionError = serializeError(error);
    }

    const cardText = card.innerText || '';
    const cardChangedAfterAction = cardText !== cardTextBeforeAction;
    const resultCards = Array.from(card.querySelectorAll('.result-card'));
    const finalEnvelope = [...engineResults].reverse().find((result) => result && typeof result === 'object') || null;
    const data = finalEnvelope?.ok === true ? finalEnvelope.data : null;
    const capturedInput = engineCalls.find((input) => input && typeof input === 'object') || null;
    const missingInputKeys = selectedFixture.requiredKeys.filter((key) => !(key in (capturedInput || {})));
    const invalidNumericKeys = selectedFixture.numericKeys.filter((key) => {
      const value = capturedInput?.[key];
      return !Number.isFinite(value) || value < 0 || (key !== 'thetaAmb_C' && value === 0);
    });
    const completeValidInput = Boolean(capturedInput)
      && missingInputKeys.length === 0
      && invalidNumericKeys.length === 0;
    const successfulEnvelopes = engineResults.filter((result) => result?.ok === true && result.data);
    const envelopeOk = engineResults.length > 0 && engineResults.every((result) => result?.ok === true && result.data);
    const dataDeliveredToRenderer = successfulEnvelopes.some((envelope) => (
      rendererCalls.some((call) => call.payload === envelope.data)
    ));
    const envelopePassedAsLegacyPayload = engineResults.some((envelope) => (
      rendererCalls.some((call) => call.payload === envelope)
    ));

    const metricData = data && selectedDomain === 'BT'
      ? {
        section: data.sFinal,
        capacity: data.IzFinal,
        voltageDrop: data.duPct_final,
        dominant: data.dominant,
      }
      : data && selectedDomain === 'MT'
        ? {
          section: data.sFinal,
          capacity: data.Iz_corr,
          voltageDrop: data.du_pct,
          dominant: data.dominant,
        }
        : null;

    const sectionCardText = resultCards[0]?.innerText || '';
    const capacityCardText = resultCards[1]?.innerText || '';
    const voltageDropCardText = resultCards[2]?.innerText || '';
    const visibleMetrics = {
      section: Boolean(metricData && isVisible(resultCards[0]) && numberAppears(sectionCardText, metricData.section)),
      capacity: Boolean(metricData && isVisible(resultCards[1]) && numberAppears(capacityCardText, metricData.capacity)),
      voltageDrop: Boolean(metricData && isVisible(resultCards[2]) && numberAppears(voltageDropCardText, metricData.voltageDrop)),
      dominant: Boolean(metricData && isVisible(resultCards[0]) && normalize(sectionCardText).includes(normalize(metricData.dominant))),
    };
    const noInvalidPlaceholders = cardText.trim().length > 0
      && !/(^|\s)(undefined|nan)(?=\s|$)/i.test(cardText)
      && !/(^|\s)--(?=\s|$)/.test(cardText);
    const valuesCompatibleWithEnvelope = Object.values(visibleMetrics).every(Boolean);
    const exactlyOneCalculation = engineCalls.length === 1;
    const noConsoleErrors = consoleErrors.length === 0 && browserErrors.length === 0;

    const compliant = completeValidInput
      && exactlyOneCalculation
      && envelopeOk
      && dataDeliveredToRenderer
      && !envelopePassedAsLegacyPayload
      && rendererCalls.length === 1
      && rendererErrors.length === 0
      && Object.values(visibleMetrics).every(Boolean)
      && noInvalidPlaceholders
      && valuesCompatibleWithEnvelope
      && noConsoleErrors
      && !actionError;

    const report = {
      case: `real-calculation-${domainLower}`,
      domain: selectedDomain,
      action: `#btn-${domainLower}`,
      navigationPrepared: true,
      cardVisibleBeforeAction,
      stableState,
      navigationErrors,
      engineCallCount: engineCalls.length,
      completeValidInput,
      missingInputKeys,
      invalidNumericKeys,
      capturedInput,
      engineResultCount: engineResults.length,
      engineErrors,
      envelopeOk,
      envelopeSummary: finalEnvelope ? {
        ok: finalEnvelope.ok,
        hasData: Boolean(finalEnvelope.data),
        warningCount: Array.isArray(finalEnvelope.warnings) ? finalEnvelope.warnings.length : null,
      } : null,
      rendererCallCount: rendererCalls.length,
      rendererNames: rendererCalls.map((call) => call.name),
      rendererErrors,
      dataDeliveredToRenderer,
      envelopePassedAsLegacyPayload,
      visibleMetrics,
      noInvalidPlaceholders,
      valuesCompatibleWithEnvelope,
      expectedValues: metricData,
      cardChangedAfterAction,
      cardText: cardText.slice(0, 1200),
      consoleErrorCalls: consoleErrors.length,
      browserErrorCalls: browserErrors.length,
      browserErrors,
      actionError,
      exactlyOneCalculation,
      compliant,
    };

    window[engineName] = originalEngine;
    originalRenderers.forEach((renderer, name) => {
      window[name] = renderer;
    });
    console.error = originalConsoleError;
    window.removeEventListener('error', onBrowserError);
    window.removeEventListener('unhandledrejection', onUnhandledRejection);

    return report;
  }, { selectedDomain: domain, selectedFixture: fixture });
}

async function main() {
  let browser;
  let server;
  const reports = [];

  try {
    const staticServer = await startStaticServer();
    server = staticServer.server;
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const requestUrl = new URL(request.url());
      if (requestUrl.hostname === HOST) request.continue();
      else request.abort();
    });

    await page.goto(staticServer.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => (
      typeof window.calculateCablingBT === 'function'
      && typeof window.calculateCablingMT === 'function'
      && typeof window.renderCardBT === 'function'
      && typeof window.renderCardMT === 'function'
      && document.querySelector('#btn-bt')
      && document.querySelector('#btn-mt')
    ), { timeout: 15000 });

    for (const domain of ['BT', 'MT']) {
      try {
        reports.push(await runDomain(page, domain));
      } catch (error) {
        reports.push({
          case: `real-calculation-${domain.toLowerCase()}`,
          domain,
          harnessError: String(error?.stack || error),
          compliant: false,
        });
      }
    }

    reports.forEach((report) => {
      process.stdout.write(`OS049E2E_REPORT ${JSON.stringify(report)}\n`);
    });

    assert.equal(reports.length, 2, `O.S.049-E2E exige dois relatórios; obtidos: ${reports.length}.`);
    assert.deepEqual(
      reports.filter((report) => report.harnessError).map((report) => report.domain),
      [],
      'Falha de harness não constitui RED funcional O.S.049-E2E.'
    );
    const failures = reports.filter((report) => !report.compliant);
    assert.equal(
      failures.length,
      0,
      `A integração E2E real viola ${failures.length}/2 contratos: ${failures.map((report) => report.domain).join(', ')}`
    );
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
  }
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
