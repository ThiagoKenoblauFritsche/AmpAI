/**
 * O.S. CAB-BT-PARALLEL-001-UI-RED-EXP
 *
 * Suíte browser experimental para o laboratório visual de cabos BT em
 * paralelo. Usa página, motor e DOM reais. A instrumentação somente observa a
 * função pública e o envelope devolvido; nenhuma fórmula é reproduzida aqui.
 */
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const REPORT_PREFIX = 'CAB_BT_PARALLEL_UI_EXP_REPORT';
const SUMMARY_PREFIX = 'CAB_BT_PARALLEL_UI_EXP_SUMMARY';
const NOTICE = 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO';
const CASE_IDS = Array.from({ length: 15 }, (_, index) => `UI-${String(index + 1).padStart(2, '0')}`);

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const EXPECTED = {
  'UI-01': { panel: 'isolated', initialState: 'collapsed', productiveBTReplaced: false },
  'UI-02': { notice: NOTICE, visibleBeforeAndAfterSuccessAndFailure: true },
  'UI-03': { completeExample: true, provenance: 'ASSUMPTION_ONLY', conditionalDtos: true },
  'UI-04': { nParallelIndependentFromNCircuits: true, exactBranchRows: true },
  'UI-05': { realEngineCallsPerAction: 1, uiFormulaCopies: 0 },
  'UI-06': { order: ['notice', 'governance', 'numbers'], governanceBeforeNumbers: true },
  'UI-07': {
    directEnvelopePaths: [
      'data.loadSharing.branchCurrents',
      'data.loadSharing.mostLoadedBranchId',
      'data.loadSharing.tiedMostLoadedBranchIds',
      'data.loadSharing.deltaLoad',
      'data.loadSharing.deratingFactor',
      'data.loadSharing.equivalentImpedance_ohm',
      'data.capacityProxy',
      'data.voltageDrop',
      'data.faultAdiabatic',
    ],
  },
  'UI-08': { problemDetailsVisible: true, previousResultCleared: true, throw: false },
  'UI-09': { installableSelection: null, installableSection: null, discreteSelectionBlocked: true },
  'UI-10': { finalMemorialAction: false, iecConformityClaim: false },
  'UI-11': { languages: ['pt', 'en', 'es'], invariantTokensAndNotice: true },
  'UI-12': { viewportWidth: 1280, horizontalOverflow: false, truncation: false, overlap: false },
  'UI-13': { viewportWidth: 375, themes: ['light', 'dark'], horizontalOverflow: false, controlLoss: false },
  'UI-14': { keyboard: true, labels: true, aria: true, announcementRegions: true },
  'UI-15': { productiveBT: 'intact', memorialBT: 'intact', existingResults: 'intact' },
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
    server.listen(0, HOST, () => resolve({
      server,
      url: `http://${HOST}:${server.address().port}/index.html`,
    }));
  });
}

function closeServer(server) {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => server.close(() => resolve()));
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function inspectUiSources() {
  const files = ['index.html', 'js/ui_render.js'];
  const referencedLines = [];
  const scopedLines = [];
  for (const file of files) {
    const source = stripComments(fs.readFileSync(path.join(ROOT, file), 'utf8'));
    const lines = source.split(/\r?\n/);
    const indexes = [];
    lines.forEach((line, index) => {
      if (!/cab-bt-par-exp|calculateCablingBTParallelExperimental/.test(line)) return;
      indexes.push(index);
      referencedLines.push({ file, line: index + 1, source: line.trim() });
    });
    if (indexes.length > 0) {
      const first = Math.max(0, Math.min(...indexes) - 40);
      const last = Math.min(lines.length - 1, Math.max(...indexes) + 80);
      for (let index = first; index <= last; index += 1) {
        scopedLines.push({ file, line: index + 1, source: lines[index] });
      }
    }
  }
  const joined = scopedLines.map((entry) => entry.source).join('\n');
  const forbiddenFormulaPatterns = [
    /Math\.(?:hypot|sqrt)\s*\(/,
    /(?:deltaLoad|deltaFaultEffective|branchFaultCurrent|minimumSectionContinuous)\s*=/,
    /(?:equivalentImpedance|branchCurrents)\s*=\s*[^;]*(?:\/|\*)/,
  ];
  return {
    referencedLines,
    scannedScopeLines: scopedLines.length,
    forbiddenFormulaMatches: forbiddenFormulaPatterns
      .filter((pattern) => pattern.test(joined))
      .map((pattern) => String(pattern)),
  };
}

async function chromiumPreflight(puppeteer) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    return {
      command: "puppeteer.launch({ headless: 'new' })",
      attempts: 1,
      browserVersion: await browser.version(),
      executablePath: puppeteer.executablePath(),
      exitCode: 0,
    };
  } finally {
    if (browser) await browser.close();
  }
}

async function preparePage(browser, url) {
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const blockedExternalRequests = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(serializeError(error)));
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const requestUrl = new URL(request.url());
    if (requestUrl.hostname === HOST || requestUrl.protocol === 'data:') {
      request.continue();
      return;
    }
    blockedExternalRequests.push(request.url());
    request.abort();
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => (
    typeof window.switchModule === 'function'
    && typeof window.switchCablingCard === 'function'
    && typeof window.calculateCablingBT === 'function'
    && typeof window.renderCardBT === 'function'
    && typeof window.setLanguage === 'function'
    && document.querySelector('#btn-bt')
    && document.querySelector('#card-bt')
  ), { timeout: 15000 });

  consoleErrors.length = 0;
  pageErrors.length = 0;
  return { page, consoleErrors, pageErrors, blockedExternalRequests };
}

async function exerciseUi(page) {
  return page.evaluate(async ({ notice }) => {
    const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const frames = (count) => new Promise((resolve) => {
      const next = () => {
        if (count-- <= 0) return resolve();
        requestAnimationFrame(next);
      };
      requestAnimationFrame(next);
    });
    const normalize = (value) => String(value ?? '')
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
        && rect.width > 0
        && rect.height > 0;
    };
    const accessibleName = (control) => {
      if (!control) return '';
      const labelledBy = control.getAttribute('aria-labelledby');
      const byAria = labelledBy
        ? labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.innerText || '').join(' ')
        : '';
      const byFor = control.id
        ? document.querySelector(`label[for="${CSS.escape(control.id)}"]`)?.innerText || ''
        : '';
      return [control.getAttribute('aria-label'), byAria, byFor, control.closest('label')?.innerText]
        .filter(Boolean)
        .join(' ')
        .trim();
    };
    const findControl = (tokens) => {
      const form = document.querySelector('#cab-bt-par-exp-form');
      if (!form) return null;
      const expectedTokens = tokens.map(normalize);
      return Array.from(form.querySelectorAll('input,select,textarea')).find((control) => {
        const semantic = normalize([
          accessibleName(control),
          control.name,
          control.id,
          control.getAttribute('data-field-path'),
        ].filter(Boolean).join(' '));
        return expectedTokens.some((token) => semantic.includes(token));
      }) || null;
    };
    const setControl = (control, value) => {
      if (!control) return false;
      control.value = String(value);
      control.dispatchEvent(new Event('input', { bubbles: true }));
      control.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
    const snapshotProductive = () => {
      const inputIds = [
        'bt-method', 'bt-phases', 'bt-ib', 'bt-in', 'bt-ull', 'bt-length', 'bt-cosphi',
        'bt-du-max', 'bt-tamb', 'bt-ncirc', 'bt-icc', 'bt-tprot',
      ];
      return {
        engineIdentity: window.calculateCablingBT,
        inputValues: Object.fromEntries(inputIds.map((id) => [id, document.getElementById(id)?.value ?? null])),
        payload: JSON.stringify(window._lastBTPayload ?? null),
        resultPresent: Boolean(document.querySelector('#tab-results-bt')),
        resultText: document.querySelector('#tab-results-bt')?.innerText || '',
        memorialPresent: Boolean(document.querySelector('#cb-mem-bt-container')),
      };
    };
    const panelSnapshot = () => {
      const panel = document.querySelector('#cab-bt-par-exp-panel');
      const toggle = document.querySelector('#cab-bt-par-exp-toggle');
      const form = document.querySelector('#cab-bt-par-exp-form');
      const result = document.querySelector('#cab-bt-par-exp-result');
      const error = document.querySelector('#cab-bt-par-exp-error');
      const governance = document.querySelector('#cab-bt-par-exp-governance');
      const numbers = document.querySelector('#cab-bt-par-exp-numbers');
      const noticeElement = document.querySelector('#cab-bt-par-exp-notice');
      return {
        panelExists: Boolean(panel),
        panelVisible: isVisible(panel),
        panelText: panel?.innerText || '',
        panelInsideProductiveMemorial: Boolean(panel && document.querySelector('#cb-mem-bt-container')?.contains(panel)),
        toggleExists: Boolean(toggle),
        toggleExpanded: toggle?.getAttribute('aria-expanded') ?? null,
        toggleControls: toggle?.getAttribute('aria-controls') ?? null,
        formExists: Boolean(form),
        calculateExists: Boolean(document.querySelector('#cab-bt-par-exp-calculate')),
        noticeExists: Boolean(noticeElement),
        noticeVisible: isVisible(noticeElement),
        noticeText: noticeElement?.innerText.trim() || '',
        resultExists: Boolean(result),
        resultVisible: isVisible(result),
        resultText: result?.innerText || '',
        errorExists: Boolean(error),
        errorVisible: isVisible(error),
        errorText: error?.innerText || '',
        governanceExists: Boolean(governance),
        governanceVisible: isVisible(governance),
        governanceText: governance?.innerText || '',
        numbersExists: Boolean(numbers),
        numbersVisible: isVisible(numbers),
        numbersText: numbers?.innerText || '',
        governanceBeforeNumbers: Boolean(governance && numbers
          && (governance.compareDocumentPosition(numbers) & Node.DOCUMENT_POSITION_FOLLOWING)),
        noticeBeforeGovernance: Boolean(noticeElement && governance
          && (noticeElement.compareDocumentPosition(governance) & Node.DOCUMENT_POSITION_FOLLOWING)),
      };
    };
    const branchCount = () => {
      const container = document.querySelector('#cab-bt-par-exp-branches');
      if (!container) return 0;
      const semanticRows = container.querySelectorAll('[data-branch-id],[data-branch-index],fieldset,.branch-row,.cab-bt-par-exp-branch');
      if (semanticRows.length > 0) return semanticRows.length;
      const ids = Array.from((container.innerText || '').matchAll(/\bP([1-9]\d*)\b/g)).map((match) => match[1]);
      if (ids.length > 0) return new Set(ids).size;
      return Array.from(container.children).filter(isVisible).length;
    };
    const clickLaboratory = async () => {
      const button = document.querySelector('#cab-bt-par-exp-calculate');
      const before = window.__qaParExpCalls?.length || 0;
      if (button) button.click();
      await frames(8);
      await wait(100);
      const after = window.__qaParExpCalls?.length || 0;
      return {
        callDelta: after - before,
        call: after > before ? window.__qaParExpCalls[after - 1] : null,
      };
    };

    window.setLanguage('pt');
    window.switchModule('cabling');
    window.switchCablingCard('bt');
    await frames(4);

    const productiveFixture = {
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
    Object.entries(productiveFixture).forEach(([id, value]) => {
      const control = document.getElementById(id);
      if (!control) return;
      control.value = value;
      control.dispatchEvent(new Event('input', { bubbles: true }));
      control.dispatchEvent(new Event('change', { bubbles: true }));
    });
    window.AmpAI_State = window.AmpAI_State || {};
    Object.assign(window.AmpAI_State, { btCond: 'Cu', btIns: 'XLPE' });
    document.querySelector('#btn-bt')?.click();
    await frames(12);
    await wait(150);
    const productiveBefore = snapshotProductive();

    const originalExperimentalEngine = window.calculateCablingBTParallelExperimental;
    window.__qaParExpCalls = [];
    if (typeof originalExperimentalEngine === 'function') {
      window.calculateCablingBTParallelExperimental = function observedExperimentalEngine(input) {
        const inputSnapshot = JSON.parse(JSON.stringify(input));
        const result = originalExperimentalEngine.apply(this, arguments);
        window.__qaParExpCalls.push({ input: inputSnapshot, result: JSON.parse(JSON.stringify(result)) });
        return result;
      };
    }

    const initial = panelSnapshot();
    document.querySelector('#cab-bt-par-exp-toggle')?.click();
    await frames(4);
    const opened = panelSnapshot();

    const nParallelControl = findControl(['nparallel', 'ramos em paralelo', 'parallel branches', 'ramas en paralelo']);
    const nCircuitsControl = findControl(['ncircuits', 'circuitos agrupados', 'grouped circuits']);
    const nCircuitsBefore = nCircuitsControl?.value ?? null;
    const changedParallel = setControl(nParallelControl, 4);
    await frames(4);
    const branchesAtFour = branchCount();
    const nCircuitsAfter = findControl(['ncircuits', 'circuitos agrupados', 'grouped circuits'])?.value ?? null;
    setControl(findControl(['nparallel', 'ramos em paralelo', 'parallel branches', 'ramas en paralelo']), 3);
    await frames(4);
    const branchesRestored = branchCount();

    const explicitMode = findControl(['fault.imbalance.mode', 'modo de desbalanco', 'imbalance mode', 'modo de desequilibrio']);
    setControl(explicitMode, 'EXPLICIT_ASSUMPTION');
    await frames(2);
    const successAction = await clickLaboratory();
    const afterSuccess = panelSnapshot();

    const languageSnapshots = [];
    for (const language of ['pt', 'en', 'es']) {
      window.setLanguage(language);
      await frames(5);
      await wait(50);
      languageSnapshots.push({
        language,
        calculateLabel: document.querySelector('#cab-bt-par-exp-calculate')?.innerText.trim() || '',
        panelText: document.querySelector('#cab-bt-par-exp-panel')?.innerText || '',
        noticeText: document.querySelector('#cab-bt-par-exp-notice')?.innerText.trim() || '',
      });
    }
    window.setLanguage('pt');
    await frames(5);

    setControl(findControl(['fault.imbalance.mode', 'modo de desbalanco', 'imbalance mode', 'modo de desequilibrio']), 'CONSERVATIVE_SINGLE_BRANCH');
    await frames(2);
    const conservativeAction = await clickLaboratory();

    setControl(findControl(['fault.imbalance.mode', 'modo de desbalanco', 'imbalance mode', 'modo de desequilibrio']), 'BLOCK');
    await frames(2);
    const blockAction = await clickLaboratory();
    const afterFailure = panelSnapshot();

    const form = document.querySelector('#cab-bt-par-exp-form');
    const controls = form ? Array.from(form.querySelectorAll('input,select,textarea,button')) : [];
    const labelledControls = controls.filter((control) => (
      control.tagName === 'BUTTON' || accessibleName(control).length > 0
    ));
    const toggle = document.querySelector('#cab-bt-par-exp-toggle');
    const panel = document.querySelector('#cab-bt-par-exp-panel');
    const errorRegion = document.querySelector('#cab-bt-par-exp-error');
    const resultRegion = document.querySelector('#cab-bt-par-exp-result');
    const prohibitedText = normalize(panel?.innerText || '');
    const prohibitedActions = panel ? Array.from(panel.querySelectorAll('button,a')).filter((element) => {
      const text = normalize(element.innerText || element.getAttribute('aria-label') || '');
      return /(export.*memorial|memorial final|final memorial|projeto|project|compra|purchase|instalacao|installation|conforme iec|pass_iec|compliant)/.test(text);
    }).map((element) => element.innerText.trim()) : [];

    const productiveAfter = snapshotProductive();
    const productive = {
      engineUnchanged: productiveBefore.engineIdentity === productiveAfter.engineIdentity,
      inputsUnchanged: JSON.stringify(productiveBefore.inputValues) === JSON.stringify(productiveAfter.inputValues),
      payloadUnchanged: productiveBefore.payload === productiveAfter.payload,
      resultExistedBefore: productiveBefore.resultPresent && productiveBefore.resultText.trim().length > 0,
      resultExistsAfter: productiveAfter.resultPresent && productiveAfter.resultText.trim().length > 0,
      memorialExistedBefore: productiveBefore.memorialPresent,
      memorialExistsAfter: productiveAfter.memorialPresent,
      panelOutsideProductiveMemorial: !document.querySelector('#cb-mem-bt-container')?.contains(panel),
    };

    return {
      pageReady: true,
      experimentalEngineAvailable: typeof originalExperimentalEngine === 'function',
      initial,
      opened,
      parallelIndependence: {
        controlFound: Boolean(nParallelControl && nCircuitsControl),
        changedParallel,
        branchesAtFour,
        branchesRestored,
        nCircuitsBefore,
        nCircuitsAfter,
      },
      successAction,
      afterSuccess,
      conservativeAction,
      blockAction,
      afterFailure,
      languageSnapshots,
      accessibility: {
        formControls: controls.length,
        labelledControls: labelledControls.length,
        allControlsLabelled: controls.length > 0 && controls.length === labelledControls.length,
        toggleAria: Boolean(toggle
          && toggle.getAttribute('aria-controls') === 'cab-bt-par-exp-panel'
          && ['true', 'false'].includes(toggle.getAttribute('aria-expanded'))),
        panelRegion: Boolean(panel && ['region', 'group'].includes(panel.getAttribute('role'))),
        errorAlert: errorRegion?.getAttribute('role') === 'alert',
        resultLive: Boolean(resultRegion
          && (resultRegion.getAttribute('aria-live') === 'polite'
            || resultRegion.getAttribute('role') === 'status')),
      },
      prohibited: {
        actions: prohibitedActions,
        conformityText: /(?:conforme iec|pass_iec|\bcompliant\b)/.test(prohibitedText),
      },
      productive,
      noticeExpected: notice,
    };
  }, { notice: NOTICE });
}

async function captureLayout(page, width, theme) {
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  return page.evaluate(async ({ selectedTheme }) => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const panel = document.querySelector('#cab-bt-par-exp-panel');
    const notice = document.querySelector('#cab-bt-par-exp-notice');
    const card = document.querySelector('#card-bt');
    const panelRect = panel?.getBoundingClientRect() || null;
    const cardRect = card?.getBoundingClientRect() || null;
    const controls = panel ? Array.from(panel.querySelectorAll('input,select,textarea,button')).filter(visible) : [];
    const clippedControls = controls.filter((control) => {
      const rect = control.getBoundingClientRect();
      return rect.left < -1 || rect.right > innerWidth + 1 || rect.width <= 0 || rect.height <= 0;
    }).map((control) => control.id || control.name || control.tagName);
    const overlaps = [];
    for (let left = 0; left < controls.length; left += 1) {
      const a = controls[left].getBoundingClientRect();
      for (let right = left + 1; right < controls.length; right += 1) {
        const b = controls[right].getBoundingClientRect();
        const area = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
          * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        if (area > 4) overlaps.push([left, right]);
      }
    }
    return {
      width: innerWidth,
      theme: selectedTheme,
      panelExists: Boolean(panel),
      panelVisible: visible(panel),
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      panelOutsideViewport: Boolean(panelRect && (panelRect.left < -1 || panelRect.right > innerWidth + 1)),
      panelOutsideCard: Boolean(panelRect && cardRect
        && (panelRect.left < cardRect.left - 1 || panelRect.right > cardRect.right + 1)),
      noticeTruncated: Boolean(notice && (notice.scrollWidth > notice.clientWidth + 1 || notice.scrollHeight > notice.clientHeight + 1)),
      clippedControls,
      overlaps,
      controlCount: controls.length,
      foreground: panel ? getComputedStyle(panel).color : null,
      background: panel ? getComputedStyle(panel).backgroundColor : null,
    };
  }, { selectedTheme: theme });
}

async function exerciseKeyboard(page) {
  const exists = await page.$('#cab-bt-par-exp-toggle');
  if (!exists) return { toggleExists: false, collapsedByKeyboard: false, openedByKeyboard: false };
  await page.focus('#cab-bt-par-exp-toggle');
  await page.keyboard.press('Enter');
  await new Promise((resolve) => setTimeout(resolve, 50));
  const collapsedByKeyboard = await page.$eval('#cab-bt-par-exp-toggle', (element) => element.getAttribute('aria-expanded') === 'false');
  await page.keyboard.press('Enter');
  await new Promise((resolve) => setTimeout(resolve, 50));
  const openedByKeyboard = await page.$eval('#cab-bt-par-exp-toggle', (element) => element.getAttribute('aria-expanded') === 'true');
  return { toggleExists: true, collapsedByKeyboard, openedByKeyboard };
}

async function runBrowserScenario(puppeteer) {
  let browser;
  let server;
  let context;
  try {
    const staticServer = await startStaticServer();
    server = staticServer.server;
    browser = await puppeteer.launch({ headless: 'new' });
    context = await preparePage(browser, staticServer.url);
    const snapshot = await exerciseUi(context.page);
    snapshot.layouts = {
      desktopLight: await captureLayout(context.page, 1280, 'light'),
      mobileLight: await captureLayout(context.page, 375, 'light'),
      mobileDark: await captureLayout(context.page, 375, 'dark'),
    };
    snapshot.keyboard = await exerciseKeyboard(context.page);
    snapshot.consoleErrors = context.consoleErrors;
    snapshot.pageErrors = context.pageErrors;
    snapshot.blockedExternalRequests = context.blockedExternalRequests;
    return snapshot;
  } finally {
    if (context?.page) await context.page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    await closeServer(server);
  }
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function numberAppears(text, value) {
  if (!Number.isFinite(value)) return false;
  const haystack = normalize(text).replace(/,/g, '.');
  const candidates = new Set([
    String(value),
    value.toFixed(0),
    value.toFixed(1),
    value.toFixed(2),
    value.toFixed(3),
    value.toFixed(4),
    value.toFixed(6),
  ]);
  return [...candidates].some((candidate) => haystack.includes(candidate));
}

function scalarAppears(text, value) {
  if (typeof value === 'number') return numberAppears(text, value);
  if (value === null) return /\bnull\b/i.test(text);
  return normalize(text).includes(normalize(String(value)));
}

function objectLeaves(value, pathPrefix) {
  if (value === null || typeof value !== 'object') return [{ path: pathPrefix, value }];
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => objectLeaves(entry, `${pathPrefix}[${index}]`));
  }
  return Object.entries(value).flatMap(([key, entry]) => objectLeaves(entry, `${pathPrefix}.${key}`));
}

function projectionEvidence(result, numbersText) {
  if (!result?.ok || !result.data) return { paths: {}, allProjected: false };
  const valuesByPath = {
    'data.loadSharing.branchCurrents': result.data.loadSharing?.branchCurrents,
    'data.loadSharing.mostLoadedBranchId': result.data.loadSharing?.mostLoadedBranchId,
    'data.loadSharing.tiedMostLoadedBranchIds': result.data.loadSharing?.tiedMostLoadedBranchIds,
    'data.loadSharing.deltaLoad': result.data.loadSharing?.deltaLoad,
    'data.loadSharing.deratingFactor': result.data.loadSharing?.deratingFactor,
    'data.loadSharing.equivalentImpedance_ohm': result.data.loadSharing?.equivalentImpedance_ohm,
    'data.capacityProxy': result.data.capacityProxy,
    'data.voltageDrop': result.data.voltageDrop,
    'data.faultAdiabatic': result.data.faultAdiabatic,
  };
  const paths = {};
  for (const [pathName, value] of Object.entries(valuesByPath)) {
    const leaves = objectLeaves(value, pathName);
    paths[pathName] = {
      leaves: leaves.length,
      missing: leaves.filter((leaf) => !scalarAppears(numbersText, leaf.value)).map((leaf) => leaf.path),
    };
  }
  return { paths, allProjected: Object.values(paths).every((entry) => entry.missing.length === 0) };
}

function exactDefaultInput(input) {
  if (!input) return false;
  const expected = {
    contractVersion: 'CAB-BT-PARALLEL-EXP-1',
    totalLoadCurrent_A: 900,
    powerFactor: 0.9,
    nParallel: 3,
    nCircuits: 1,
    geometry: { status: 'NOT_PROVIDED', description: null },
    branches: [
      { id: 'P1', impedance_ohm: { re: 0.02, im: 0.03 }, provenance: 'ASSUMPTION_ONLY' },
      { id: 'P2', impedance_ohm: { re: 0.02, im: 0.024 }, provenance: 'ASSUMPTION_ONLY' },
      { id: 'P3', impedance_ohm: { re: 0.02, im: 0.018 }, provenance: 'ASSUMPTION_ONLY' },
    ],
    capacityProxy: {
      groupingFactor: { value: 0.7, provenance: 'ASSUMPTION_ONLY' },
      tabulatedAmpacityPerConductor_A: { value: 344, provenance: 'ASSUMPTION_ONLY' },
    },
    fault: {
      totalFaultCurrent_A: 20000,
      clearingTime_s: 0.2,
      adiabaticK_A_sqrt_s_per_mm2: { value: 115, provenance: 'ASSUMPTION_ONLY' },
      imbalance: { mode: 'EXPLICIT_ASSUMPTION', deltaFault: 1.1, provenance: 'ASSUMPTION_ONLY' },
    },
  };
  return isDeepStrictEqual(input, expected);
}

function onlyMode(dto, expectedMode) {
  const imbalance = dto?.fault?.imbalance;
  return imbalance?.mode === expectedMode
    && Object.keys(imbalance).length === 1
    && !Object.prototype.hasOwnProperty.call(imbalance, 'deltaFault')
    && !Object.prototype.hasOwnProperty.call(imbalance, 'provenance');
}

function languageEvidence(snapshots) {
  const expectedLanguageTokens = {
    pt: ['laboratorio', 'experimental'],
    en: ['laboratory', 'experimental'],
    es: ['laboratorio', 'experimental'],
  };
  const entries = snapshots.map((snapshot) => {
    const text = normalize(snapshot.panelText);
    const tokens = ['MATHEMATICAL_ONLY', 'productionAllowed', 'ASSUMPTION_ONLY', 'B-01'];
    return {
      language: snapshot.language,
      localized: expectedLanguageTokens[snapshot.language].every((token) => text.includes(normalize(token))),
      noticeInvariant: snapshot.noticeText === NOTICE,
      tokensInvariant: tokens.every((token) => text.includes(normalize(token))),
      calculateLabel: snapshot.calculateLabel,
    };
  });
  return {
    entries,
    allLanguages: entries.length === 3 && ['pt', 'en', 'es'].every((language) => entries.some((entry) => entry.language === language)),
    allConform: entries.every((entry) => entry.localized && entry.noticeInvariant && entry.tokensInvariant),
    localizedLabels: new Set(entries.map((entry) => normalize(entry.calculateLabel))).size === 3,
  };
}

function invalidTokens(...texts) {
  const text = texts.map((entry) => String(entry || '')).join('\n');
  return ['undefined', 'NaN', '--'].filter((token) => {
    if (token === '--') return /(^|\s)--(?=\s|$)/m.test(text);
    return new RegExp(`(^|\\s)${token}(?=\\s|$)`, 'im').test(text);
  });
}

function makeReport(id, observed, compliant, common) {
  return {
    id,
    classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
    compliant,
    assertionExercised: true,
    expected: EXPECTED[id],
    observed: { ...observed, common },
  };
}

function functionalReports(snapshot, sourceAudit) {
  const panelExists = snapshot.opened.panelExists;
  const successCall = snapshot.successAction.call;
  const successResult = successCall?.result || null;
  const projection = projectionEvidence(successResult, snapshot.afterSuccess.numbersText);
  const languages = languageEvidence(snapshot.languageSnapshots);
  const invalid = invalidTokens(
    snapshot.afterSuccess.panelText,
    snapshot.afterFailure.panelText,
  );
  const common = {
    realPage: snapshot.pageReady === true,
    panelExists,
    noConsoleErrors: snapshot.consoleErrors.length === 0,
    noPageErrors: snapshot.pageErrors.length === 0,
    noInvalidTokens: invalid.length === 0,
  };
  const commonPass = Object.values(common).every(Boolean);
  const reports = [];

  const initialCollapsed = snapshot.initial.panelExists
    && !snapshot.initial.panelVisible
    && snapshot.initial.toggleExpanded === 'false';
  reports.push(makeReport('UI-01', {
    initial: snapshot.initial,
    opened: snapshot.opened,
  }, commonPass && initialCollapsed && snapshot.opened.panelVisible
    && snapshot.opened.toggleExpanded === 'true'
    && !snapshot.opened.panelInsideProductiveMemorial, common));

  const notices = [snapshot.opened, snapshot.afterSuccess, snapshot.afterFailure];
  reports.push(makeReport('UI-02', {
    states: notices.map((state) => ({ visible: state.noticeVisible, text: state.noticeText })),
  }, commonPass && notices.every((state) => state.noticeVisible && state.noticeText === NOTICE), common));

  const explicitDto = successCall?.input;
  const conservativeDto = snapshot.conservativeAction.call?.input;
  const blockDto = snapshot.blockAction.call?.input;
  const conditionalDtos = Boolean(
    explicitDto?.fault?.imbalance?.mode === 'EXPLICIT_ASSUMPTION'
    && explicitDto.fault.imbalance.deltaFault === 1.1
    && explicitDto.fault.imbalance.provenance === 'ASSUMPTION_ONLY'
    && onlyMode(conservativeDto, 'CONSERVATIVE_SINGLE_BRANCH')
    && onlyMode(blockDto, 'BLOCK')
  );
  reports.push(makeReport('UI-03', {
    formExists: snapshot.opened.formExists,
    defaultInput: explicitDto || null,
    defaultInputExact: exactDefaultInput(explicitDto),
    conditionalDtos,
    conservativeImbalance: conservativeDto?.fault?.imbalance || null,
    blockImbalance: blockDto?.fault?.imbalance || null,
  }, commonPass && snapshot.opened.formExists && exactDefaultInput(explicitDto) && conditionalDtos, common));

  const parallel = snapshot.parallelIndependence;
  reports.push(makeReport('UI-04', parallel, commonPass
    && parallel.controlFound
    && parallel.changedParallel
    && parallel.branchesAtFour === 4
    && parallel.branchesRestored === 3
    && parallel.nCircuitsBefore === parallel.nCircuitsAfter, common));

  const actionCallCounts = [
    snapshot.successAction.callDelta,
    snapshot.conservativeAction.callDelta,
    snapshot.blockAction.callDelta,
  ];
  reports.push(makeReport('UI-05', {
    experimentalEngineAvailable: snapshot.experimentalEngineAvailable,
    actionCallCounts,
    sourceAudit,
  }, commonPass
    && snapshot.experimentalEngineAvailable
    && actionCallCounts.every((count) => count === 1)
    && sourceAudit.referencedLines.length > 0
    && sourceAudit.forbiddenFormulaMatches.length === 0, common));

  const governanceText = normalize(snapshot.afterSuccess.governanceText);
  const governanceRequired = [
    'MATHEMATICAL_ONLY', 'productionAllowed', 'false', 'ASSUMPTION_ONLY',
    'B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06',
  ].every((token) => governanceText.includes(normalize(token)));
  reports.push(makeReport('UI-06', {
    noticeBeforeGovernance: snapshot.afterSuccess.noticeBeforeGovernance,
    governanceBeforeNumbers: snapshot.afterSuccess.governanceBeforeNumbers,
    governanceVisible: snapshot.afterSuccess.governanceVisible,
    numbersVisible: snapshot.afterSuccess.numbersVisible,
    governanceRequired,
  }, commonPass && snapshot.afterSuccess.noticeBeforeGovernance
    && snapshot.afterSuccess.governanceBeforeNumbers
    && snapshot.afterSuccess.governanceVisible
    && snapshot.afterSuccess.numbersVisible
    && governanceRequired, common));

  reports.push(makeReport('UI-07', projection, commonPass
    && successResult?.ok === true
    && snapshot.afterSuccess.numbersVisible
    && projection.allProjected, common));

  const failure = snapshot.blockAction.call?.result;
  const errorText = normalize(snapshot.afterFailure.errorText);
  const problem = failure?.error;
  const paramsTokens = normalize(JSON.stringify(problem?.params || {}))
    .split(/[^a-z0-9_-]+/)
    .filter(Boolean);
  const paramsVisible = paramsTokens.length > 0
    ? paramsTokens.every((token) => errorText.includes(token))
    : /(?:\{\}|params|parametros|parameters)/.test(errorText);
  const problemVisible = Boolean(problem
    && [problem.code, problem.title, problem.status].every((value) => errorText.includes(normalize(value)))
    && paramsVisible);
  const previousResultCleared = !snapshot.afterFailure.resultVisible
    || snapshot.afterFailure.resultText.trim() === '';
  reports.push(makeReport('UI-08', {
    engineFailure: failure || null,
    errorVisible: snapshot.afterFailure.errorVisible,
    problemVisible,
    paramsVisible,
    previousResultCleared,
  }, commonPass && failure?.ok === false
    && problem?.code === 'FAULT_IMBALANCE_MISSING'
    && snapshot.afterFailure.errorVisible
    && problemVisible
    && previousResultCleared, common));

  const proxy = successResult?.data?.capacityProxy;
  const fault = successResult?.data?.faultAdiabatic;
  const successPanelText = normalize(snapshot.afterSuccess.panelText);
  const selectionBlockedVisible = /(selecao instalavel bloqueada|installable selection blocked|seleccion instalable bloqueada)/.test(successPanelText);
  reports.push(makeReport('UI-09', {
    installableSelection: proxy?.installableSelection,
    discreteSelectionBlocked: proxy?.discreteSelectionBlocked,
    installableSection: fault?.installableSection,
    selectionBlockedVisible,
  }, commonPass
    && proxy?.installableSelection === null
    && proxy?.discreteSelectionBlocked === true
    && fault?.installableSection === null
    && selectionBlockedVisible, common));

  reports.push(makeReport('UI-10', snapshot.prohibited, commonPass && panelExists
    && snapshot.prohibited.actions.length === 0
    && snapshot.prohibited.conformityText === false
    && !snapshot.opened.panelInsideProductiveMemorial, common));

  reports.push(makeReport('UI-11', languages, commonPass
    && languages.allLanguages
    && languages.allConform
    && languages.localizedLabels, common));

  const desktop = snapshot.layouts.desktopLight;
  reports.push(makeReport('UI-12', desktop, commonPass && desktop.panelVisible
    && !desktop.documentOverflow
    && !desktop.panelOutsideViewport
    && !desktop.panelOutsideCard
    && !desktop.noticeTruncated
    && desktop.clippedControls.length === 0
    && desktop.overlaps.length === 0, common));

  const mobile = [snapshot.layouts.mobileLight, snapshot.layouts.mobileDark];
  reports.push(makeReport('UI-13', { layouts: mobile }, commonPass && mobile.every((layout) => (
    layout.panelVisible
    && !layout.documentOverflow
    && !layout.panelOutsideViewport
    && !layout.panelOutsideCard
    && !layout.noticeTruncated
    && layout.clippedControls.length === 0
    && layout.controlCount > 0
    && layout.foreground !== layout.background
  )), common));

  const accessibility = snapshot.accessibility;
  reports.push(makeReport('UI-14', {
    ...accessibility,
    keyboard: snapshot.keyboard,
  }, commonPass
    && accessibility.allControlsLabelled
    && accessibility.toggleAria
    && accessibility.panelRegion
    && accessibility.errorAlert
    && accessibility.resultLive
    && snapshot.keyboard.collapsedByKeyboard
    && snapshot.keyboard.openedByKeyboard, common));

  const productive = snapshot.productive;
  reports.push(makeReport('UI-15', productive, commonPass
    && productive.engineUnchanged
    && productive.inputsUnchanged
    && productive.payloadUnchanged
    && productive.resultExistedBefore
    && productive.resultExistsAfter
    && productive.memorialExistedBefore
    && productive.memorialExistsAfter
    && productive.panelOutsideProductiveMemorial, common));

  return reports;
}

function unavailableReports(classification, error) {
  return CASE_IDS.map((id) => ({
    id,
    classification,
    compliant: false,
    assertionExercised: false,
    expected: EXPECTED[id],
    observed: { reason: classification === 'INFRA_BLOCKED' ? 'chromium_or_page_preflight_failed' : 'harness_failed', error },
  }));
}

function validateReports(reports) {
  const ids = reports.map((report) => report.id);
  const requiredKeys = ['id', 'classification', 'compliant', 'assertionExercised', 'expected', 'observed'];
  return reports.length === 15
    && new Set(ids).size === 15
    && CASE_IDS.every((id, index) => ids[index] === id)
    && reports.every((report) => requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(report, key)))
    && reports.every((report) => ['PASS', 'FUNCTIONAL_FAILURE', 'INFRA_BLOCKED', 'CONFIG_ERROR'].includes(report.classification))
    && reports.every((report) => typeof report.compliant === 'boolean' && typeof report.assertionExercised === 'boolean');
}

function exitCodeFor(classification) {
  return { PASS: 0, FUNCTIONAL_FAILURE: 1, INFRA_BLOCKED: 2, CONFIG_ERROR: 3 }[classification];
}

function reconcile(reports, classification) {
  const compliant = reports.filter((report) => report.compliant).length;
  const assertionsExercised = reports.filter((report) => report.assertionExercised).length;
  return {
    classification,
    reports: reports.length,
    expectedReports: 15,
    compliant,
    nonCompliant: reports.length - compliant,
    assertionsExercised,
    processExitCode: exitCodeFor(classification),
  };
}

async function main() {
  let puppeteer;
  let preflight = null;
  let preflightError = null;
  let reports;

  try {
    puppeteer = require('puppeteer');
    preflight = await chromiumPreflight(puppeteer);
  } catch (error) {
    preflightError = error;
  }

  if (!preflight || preflight.exitCode !== 0) {
    reports = unavailableReports('INFRA_BLOCKED', serializeError(preflightError));
  } else {
    try {
      const snapshot = await runBrowserScenario(puppeteer);
      reports = functionalReports(snapshot, inspectUiSources());
    } catch (error) {
      reports = unavailableReports('CONFIG_ERROR', serializeError(error));
    }
  }

  let classification;
  if (!validateReports(reports)) {
    classification = 'CONFIG_ERROR';
  } else if (!preflight || preflight.exitCode !== 0) {
    classification = 'INFRA_BLOCKED';
  } else if (reports.some((report) => report.classification === 'CONFIG_ERROR')) {
    classification = 'CONFIG_ERROR';
  } else if (reports.every((report) => report.compliant)) {
    classification = 'PASS';
  } else {
    classification = 'FUNCTIONAL_FAILURE';
  }

  const summary = reconcile(reports, classification);
  const reportLines = reports.map((report) => `${REPORT_PREFIX} ${JSON.stringify(report)}`);
  const summaryLine = `${SUMMARY_PREFIX} ${JSON.stringify({
    ...summary,
    preflightExitCode: preflight?.exitCode ?? 2,
    preflight,
    preflightError: preflightError ? serializeError(preflightError) : null,
  })}`;
  const protocolValid = reportLines.length === 15
    && reportLines.every((line) => line.startsWith(`${REPORT_PREFIX} `))
    && summaryLine.startsWith(`${SUMMARY_PREFIX} `);

  if (!protocolValid) {
    summary.classification = 'CONFIG_ERROR';
    summary.processExitCode = 3;
  }

  reportLines.forEach((line) => process.stdout.write(`${line}\n`));
  process.stdout.write(`${summaryLine}\n`);
  process.exitCode = protocolValid ? summary.processExitCode : 3;
}

main().catch((error) => {
  const reports = unavailableReports('CONFIG_ERROR', serializeError(error));
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify({
    classification: 'CONFIG_ERROR',
    reports: 15,
    expectedReports: 15,
    compliant: 0,
    nonCompliant: 15,
    assertionsExercised: 0,
    processExitCode: 3,
    preflightExitCode: 0,
    preflight: null,
    preflightError: null,
  })}\n`);
  process.exitCode = 3;
});
