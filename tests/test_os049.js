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
  '.svg': 'image/svg+xml',
};

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${HOST}`);
    const relativePath = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
    const requestedPath = path.resolve(ROOT, `.${relativePath}`);

    if (requestedPath !== ROOT && !requestedPath.startsWith(`${ROOT}${path.sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    fs.readFile(requestedPath, (error, contents) => {
      if (error) {
        response.writeHead(error.code === 'ENOENT' ? 404 : 500).end(error.message);
        return;
      }

      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': MIME_TYPES[path.extname(requestedPath).toLowerCase()] || 'application/octet-stream',
      });
      response.end(contents);
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, HOST, () => {
      const address = server.address();
      resolve({
        server,
        url: `http://${HOST}:${address.port}/index.html`,
      });
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

const BT_INPUT = {
  Ib_A: 125,
  L_m: 30,
  V_V: 400,
  phases: 3,
  cosphi: 0.92,
  material: 'Cu',
  insulation: 'XLPE',
  method: 'C',
  ambient_C: 30,
  groupingCircuits: 1,
  neutral: 'carregado',
  harmonics: 0,
  maxDrop_pct: 4,
  Icn_kA: 10,
  Ik_A: 8000,
  t_s: 0.2,
  peMode: 'auto',
};

const MT_INPUT = {
  Ib_A: 80,
  L_m: 250,
  V_V: 13800,
  phases: 3,
  cosphi: 0.9,
  material: 'Cu',
  insulation: 'XLPE',
  method: 'F',
  ambient_C: 30,
  groupingCircuits: 1,
  maxDrop_pct: 3,
  Ik_A: 12500,
  t_s: 0.5,
};

const CASES = [
  {
    case: 'success-integration-bt',
    domain: 'BT',
    language: null,
    kind: 'success',
  },
  {
    case: 'success-integration-mt',
    domain: 'MT',
    language: null,
    kind: 'success',
  },
  ...['pt', 'en', 'es'].flatMap((language) => [
    {
      case: `warning-qa-bt-005-${language}`,
      domain: 'BT',
      language,
      kind: 'warning',
      code: 'QA-BT-005',
      params: { t_s: 6, recommendedMax_s: 5 },
      localeTokens: {
        pt: ['tempo', 'protecao', 'segundo'],
        en: ['time', 'protection', 'second'],
        es: ['tiempo', 'proteccion', 'segundo'],
      }[language],
      paramTokenGroups: [['6'], ['5']],
    },
    {
      case: `warning-qa-mt-011-${language}`,
      domain: 'MT',
      language,
      kind: 'warning',
      code: 'QA-MT-011',
      params: { Ib_A: 120000, referenceMax_A: 100000 },
      localeTokens: {
        pt: ['corrente', 'alta', 'improvavel'],
        en: ['current', 'high', 'unlikely'],
        es: ['corriente', 'alta', 'improbable'],
      }[language],
      paramTokenGroups: [['120000', '120.000', '120 000', '120 ka'], ['100000', '100.000', '100 000', '100 ka']],
    },
  ]),
  ...['pt', 'en', 'es'].flatMap((language) => [
    {
      case: `error-qa-bt-001-${language}`,
      domain: 'BT',
      language,
      kind: 'error',
      code: 'QA-BT-001',
      params: { Ib_A: 16, In_A: 10 },
      localeTokens: {
        pt: ['disjuntor', 'corrente', 'projeto'],
        en: ['breaker', 'current', 'design'],
        es: ['interruptor', 'corriente', 'diseno'],
      }[language],
      paramTokenGroups: [['16'], ['10']],
    },
    {
      case: `error-qa-mt-005-${language}`,
      domain: 'MT',
      language,
      kind: 'error',
      code: 'QA-MT-005',
      params: { Ib_A: 0 },
      localeTokens: {
        pt: ['corrente', 'projeto', 'positiva'],
        en: ['design', 'current', 'positive'],
        es: ['corriente', 'diseno', 'positiva'],
      }[language],
      paramTokenGroups: [['0']],
    },
  ]),
];

function makeEnvelope(testCase) {
  if (testCase.kind === 'error') {
    return {
      ok: false,
      data: null,
      warnings: [],
      error: {
        type: `https://ampai.dev/problems/${testCase.code.toLowerCase()}`,
        title: 'Engineering validation failed',
        status: 422,
        code: testCase.code,
        params: testCase.params,
        severity: 'error',
      },
    };
  }

  const data = {
    marker: `OS049_DATA_${testCase.domain}_${testCase.language || 'NONE'}`,
    input: testCase.domain === 'BT' ? BT_INPUT : MT_INPUT,
    section_mm2: testCase.domain === 'BT' ? 35 : 50,
  };

  const warnings = testCase.kind === 'warning'
    ? [{ code: testCase.code, params: testCase.params, severity: 'warning' }]
    : [];

  return { ok: true, data, warnings };
}

async function runCase(page, testCase) {
  const scenario = {
    ...testCase,
    envelope: makeEnvelope(testCase),
  };

  return page.evaluate(async (current) => {
    const waitForFrames = (count = 3) => new Promise((resolve) => {
      const next = () => {
        if (count-- <= 0) {
          resolve();
          return;
        }
        requestAnimationFrame(next);
      };
      next();
    });

    const normalize = (value) => String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const isVisible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && style.opacity !== '0'
        && (rect.width > 0 || rect.height > 0);
    };

    const domain = current.domain.toLowerCase();
    const engineName = current.domain === 'BT' ? 'calculateCablingBT' : 'calculateCablingMT';
    const button = document.querySelector(`#btn-${domain}`);
    const card = document.querySelector(`#card-${domain}`);
    const wrapper = document.querySelector(`#wrapper-${domain}`) || card?.parentElement;

    if (!button || !card || !wrapper || typeof window[engineName] !== 'function') {
      throw new Error(`Harness OS049 sem seletor/API para ${current.domain}`);
    }

    window._lastBTPayload = null;
    window._lastMTPayload = null;
    if (current.language && typeof window.setLanguage === 'function') {
      window.setLanguage(current.language);
      await waitForFrames();
    }

    const engineCalls = [];
    const renderCalls = [];
    const consoleWarn = [];
    const consoleError = [];
    let escapedDomainException = false;

    const originalEngine = window[engineName];
    const rendererNames = current.domain === 'BT'
      ? ['renderCardBT', 'renderCablingBTResults']
      : ['renderCardMT', 'renderCablingMTResults'];
    const originalRenderers = new Map(rendererNames.map((name) => [name, window[name]]));
    const originalWarn = console.warn;
    const originalError = console.error;

    const renderSpy = (payload) => {
      renderCalls.push(payload);
      if (payload === current.envelope.data) {
        card.innerHTML = `<output data-os049-rendered="${current.envelope.data.marker}">${current.envelope.data.marker}</output>`;
      }
    };

    card.innerHTML = current.kind === 'error'
      ? '<output data-os049-residual-result="true">98765</output>'
      : '';

    wrapper.querySelectorAll('.alert-banner, [role="alert"], [role="status"], [data-diagnostic-code], [data-warning-code], [data-error-code]')
      .forEach((element) => {
        element.classList.remove('active');
        if (element.matches('.alert-banner')) {
          const message = element.querySelector('[id$="-msg"], .alert-message, p');
          if (message) message.textContent = '';
        }
      });

    try {
      window[engineName] = (input) => {
        engineCalls.push(input);
        return current.envelope;
      };
      rendererNames.forEach((name) => {
        window[name] = renderSpy;
      });
      console.warn = (...args) => consoleWarn.push(args.map(String));
      console.error = (...args) => consoleError.push(args.map(String));

      try {
        button.click();
        await waitForFrames();
      } catch (error) {
        escapedDomainException = true;
        consoleError.push([String(error?.stack || error)]);
      }

      const diagnosticElements = Array.from(wrapper.querySelectorAll(
        '.alert-banner, .warning-banner, [role="alert"], [role="status"], [data-diagnostic-code], [data-warning-code], [data-error-code]'
      )).filter(isVisible);
      const diagnosticText = diagnosticElements.map((element) => element.textContent || '').join(' ').trim();
      const normalizedDiagnostic = normalize(diagnosticText);
      const localeTokenConsumed = current.kind === 'success'
        ? false
        : current.localeTokens.some((token) => normalizedDiagnostic.includes(normalize(token)));
      const paramsConsumed = current.kind === 'success'
        ? false
        : current.paramTokenGroups.every((group) => group.some((token) => normalizedDiagnostic.includes(normalize(token))));
      const codeVisible = current.kind === 'success'
        ? false
        : normalizedDiagnostic.includes(normalize(current.code));
      const diagnosticVisible = current.kind === 'success'
        ? false
        : diagnosticElements.length > 0 && diagnosticText.length > 0 && (localeTokenConsumed || codeVisible);
      const localizedMessage = current.kind === 'success'
        ? false
        : diagnosticVisible && localeTokenConsumed && paramsConsumed && !/^qa-(bt|mt)-\d+$/i.test(diagnosticText.trim());
      const dataRendered = Boolean(card.querySelector(`[data-os049-rendered="${current.envelope.data?.marker || ''}"]`));
      const envelopePassedToRenderer = renderCalls.some((payload) => payload === current.envelope);
      const dataPassedToRenderer = current.envelope.data !== null
        && renderCalls.some((payload) => payload === current.envelope.data);
      const residualNumericResult = Boolean(card.querySelector('[data-os049-residual-result="true"]'));
      const explicitInputProvided = engineCalls.length > 0
        && engineCalls.every((input) => input && typeof input === 'object' && !Array.isArray(input));
      const engineProvidedLocalizedText = JSON.stringify(current.envelope).includes('message')
        || JSON.stringify(current.envelope).includes('detail');

      let envelopeConsumed;
      if (current.kind === 'error') {
        envelopeConsumed = diagnosticVisible && renderCalls.length === 0 && !residualNumericResult;
      } else if (current.kind === 'warning') {
        envelopeConsumed = dataPassedToRenderer && !envelopePassedToRenderer && diagnosticVisible;
      } else {
        envelopeConsumed = dataPassedToRenderer && !envelopePassedToRenderer;
      }

      const baseCompliance = engineCalls.length === 1
        && explicitInputProvided
        && consoleWarn.length === 0
        && consoleError.length === 0
        && !escapedDomainException
        && !engineProvidedLocalizedText;

      let compliant;
      if (current.kind === 'success') {
        compliant = baseCompliance
          && envelopeConsumed
          && dataRendered
          && renderCalls.length === 1;
      } else if (current.kind === 'warning') {
        compliant = baseCompliance
          && current.envelope.ok === true
          && current.envelope.data !== null
          && envelopeConsumed
          && dataRendered
          && diagnosticVisible
          && localizedMessage
          && paramsConsumed;
      } else {
        compliant = baseCompliance
          && current.envelope.ok === false
          && current.envelope.data === null
          && envelopeConsumed
          && diagnosticVisible
          && localizedMessage
          && paramsConsumed
          && !residualNumericResult;
      }

      return {
        case: current.case,
        domain: current.domain,
        language: current.language,
        engineCallCount: engineCalls.length,
        explicitInputProvided,
        envelopeConsumed,
        dataRendered,
        diagnosticCode: current.code || null,
        diagnosticVisible,
        localizedMessage,
        consoleWarnCalls: consoleWarn.length,
        consoleErrorCalls: consoleError.length,
        renderCallCount: renderCalls.length,
        envelopePassedToRenderer,
        dataPassedToRenderer,
        paramsConsumed,
        engineProvidedLocalizedText,
        residualNumericResult,
        escapedDomainException,
        activeDocumentLanguage: document.documentElement.lang || null,
        compliant,
      };
    } finally {
      window[engineName] = originalEngine;
      originalRenderers.forEach((renderer, name) => {
        window[name] = renderer;
      });
      console.warn = originalWarn;
      console.error = originalError;
    }
  }, scenario);
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
      && typeof window.readBTInputsFromUI === 'function'
      && document.querySelector('#btn-bt')
      && document.querySelector('#btn-mt')
      && document.querySelector('#card-bt')
      && document.querySelector('#card-mt')
    ), { timeout: 15000 });

    for (const testCase of CASES) {
      const report = await runCase(page, testCase);
      reports.push(report);
      process.stdout.write(`OS049_REPORT ${JSON.stringify(report)}\n`);
    }

    assert.equal(reports.length, 14, 'A suíte O.S. 049 deve emitir exatamente 14 relatórios.');
    const nonCompliant = reports.filter((report) => !report.compliant);
    assert.equal(
      nonCompliant.length,
      0,
      `A UI viola ${nonCompliant.length}/14 contratos de integração: ${nonCompliant.map((report) => report.case).join(', ')}`
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
