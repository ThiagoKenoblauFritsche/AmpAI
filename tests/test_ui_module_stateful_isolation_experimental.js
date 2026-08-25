/**
 * AMP-UI-MODULE-LAYOUT-002 — RED visual experimental de isolamento stateful.
 *
 * Exercita a página, o Chromium e as funções produtivas reais. O harness não
 * substitui switchModule/switchCablingCard, não altera o DOM produtivo e não
 * recalcula qualquer resultado de engenharia.
 */
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const REPORT_PREFIX = 'AMP_UI_MODULE_STATEFUL_ISOLATION_EXP_REPORT';
const SUMMARY_PREFIX = 'AMP_UI_MODULE_STATEFUL_ISOLATION_EXP_SUMMARY';
const CATEGORY = 'ui_module_stateful_isolation_experimental';
const IDS = Array.from({ length: 12 }, (_unused, index) => `UMSI-${String(index + 1).padStart(2, '0')}`);
const VIEWPORTS = [
  [1920, 1080], [1366, 768], [1024, 768], [768, 1024], [390, 844], [375, 812],
].map(([width, height]) => ({ width, height, deviceScaleFactor: 1 }));
const THEMES = ['light', 'dark'];
const LANGUAGES = ['pt', 'en', 'es'];
const STORAGE_KEYS = ['ampai-active-module', 'ampai-active-cabling-card', 'ampai-theme', 'ampai-lang'];
const EXPECTED_REPORTS = 12;
const EXPECTED_CASES = 30;
const CASE_DISTRIBUTION = Object.freeze({
  'UMSI-01': 1,
  'UMSI-02': 1,
  'UMSI-03': 1,
  'UMSI-04': 1,
  'UMSI-05': 16,
  'UMSI-06': 1,
  'UMSI-07': 1,
  'UMSI-08': 1,
  'UMSI-09': 1,
  'UMSI-10': 1,
  'UMSI-11': 4,
  'UMSI-12': 1,
});
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const EVIDENCE_DIR = path.resolve(process.env.AMP_UI_MODULE_STATEFUL_EVIDENCE_DIR || path.join(
  os.tmpdir(),
  'AmpAI-QA',
  'AMP-UI-MODULE-LAYOUT-002-QA-RED-STATEFUL-MODULE-ISOLATION-R1',
  `${process.pid}-${Date.now()}`,
));

function serializeError(error) {
  return {
    name: error?.name || 'Error',
    message: String(error?.message || error),
    stack: String(error?.stack || ''),
  };
}

function sha256Buffer(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function sha256File(filePath) {
  return sha256Buffer(fs.readFileSync(filePath));
}

function ensureExternalEvidenceDirectory() {
  const relative = path.relative(ROOT, EVIDENCE_DIR);
  if (!relative.startsWith('..') && !path.isAbsolute(relative)) {
    throw new Error(`Diretório de evidência deve permanecer fora do repositório: ${EVIDENCE_DIR}`);
  }
  fs.mkdirSync(path.join(EVIDENCE_DIR, 'screenshots'), { recursive: true });
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
    server.listen(0, HOST, () => resolve({ server, url: `http://${HOST}:${server.address().port}/index.html` }));
  });
}

function closeServer(server) {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => server.close(resolve));
}

async function chromiumPreflight(puppeteer) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new', timeout: 30000 });
    const page = await browser.newPage();
    await page.goto('data:text/html,<title>UMSI preflight</title><main>ok</main>', { waitUntil: 'load' });
    const exercised = await page.evaluate(() => document.querySelector('main')?.textContent === 'ok');
    if (!exercised) throw new Error('Chromium não executou a assertion do preflight UMSI.');
    return { exitCode: 0, browserVersion: await browser.version() };
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

async function waitForRuntime(page) {
  await page.waitForFunction(() => document.readyState !== 'loading'
    && typeof window.switchModule === 'function'
    && typeof window.switchCablingCard === 'function', { timeout: 15000 });
  await page.evaluate(() => new Promise((resolve) => {
    let frames = 14;
    const next = () => (frames-- <= 0 ? setTimeout(resolve, 700) : requestAnimationFrame(next));
    requestAnimationFrame(next);
  }));
}

async function runtimeFacts(page) {
  const facts = await page.evaluate(() => ({
    url: location.href,
    readyState: document.readyState,
    switchModuleType: typeof window.switchModule,
    switchCablingCardType: typeof window.switchCablingCard,
    calculateBTType: typeof window.calculateCablingBT,
    calculateMTType: typeof window.calculateCablingMT,
    switchModuleSource: typeof window.switchModule === 'function'
      ? Function.prototype.toString.call(window.switchModule) : null,
    switchCablingCardSource: typeof window.switchCablingCard === 'function'
      ? Function.prototype.toString.call(window.switchCablingCard) : null,
    pageRootPresent: Boolean(document.querySelector('.main-layout')),
  }));
  return {
    ...facts,
    switchModuleSha256: facts.switchModuleSource ? sha256Buffer(facts.switchModuleSource) : null,
    switchCablingCardSha256: facts.switchCablingCardSource ? sha256Buffer(facts.switchCablingCardSource) : null,
  };
}

async function setFixtureStorage(page, values) {
  await page.evaluate(({ keys, nextValues }) => {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(nextValues, key) && nextValues[key] !== null) {
        localStorage.setItem(key, String(nextValues[key]));
      } else if (Object.prototype.hasOwnProperty.call(nextValues, key)) {
        localStorage.removeItem(key);
      }
    }
  }, { keys: STORAGE_KEYS, nextValues: values });
}

async function readStorage(page) {
  return page.evaluate((keys) => Object.fromEntries(keys.map((key) => [key, {
    exists: Object.prototype.hasOwnProperty.call(localStorage, key),
    value: localStorage.getItem(key),
  }])), STORAGE_KEYS);
}

async function prepareCleanReload(page, viewport, theme, language) {
  await page.setViewport(viewport);
  await setFixtureStorage(page, {
    'ampai-active-module': null,
    'ampai-active-cabling-card': null,
    'ampai-theme': theme,
    'ampai-lang': language,
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForRuntime(page);
  await page.evaluate(() => scrollTo(0, 0));
}

async function invokeRealState(page, state) {
  await page.evaluate((nextState) => {
    if (typeof window.switchModule !== 'function') throw new Error('switchModule produtivo indisponível.');
    if (typeof window.switchCablingCard !== 'function') throw new Error('switchCablingCard produtivo indisponível.');
    if (nextState === 'cabling-bt') {
      window.switchModule('cabling');
      window.switchCablingCard('bt');
    } else if (nextState === 'cabling-mt') {
      window.switchModule('cabling');
      window.switchCablingCard('mt');
    } else {
      window.switchModule(nextState);
    }
  }, state);
  await waitForRuntime(page);
}

async function reloadPersistedMT(page) {
  await setFixtureStorage(page, {
    'ampai-active-module': 'cabling',
    'ampai-active-cabling-card': 'mt',
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForRuntime(page);
}

async function auditBrowserState(page, expectedState, context) {
  return page.evaluate(({ state, auditContext, storageKeys }) => {
    const round = (value) => Number(Number(value || 0).toFixed(3));
    const finiteRect = (rect) => rect && ['top', 'right', 'bottom', 'left', 'width', 'height']
      .every((key) => Number.isFinite(rect[key]));
    const rectOf = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        top: round(rect.top), right: round(rect.right), bottom: round(rect.bottom), left: round(rect.left),
        width: round(rect.width), height: round(rect.height), x: round(rect.x), y: round(rect.y),
      };
    };
    const styleOf = (element) => {
      if (!element) return null;
      const style = getComputedStyle(element);
      return { display: style.display, visibility: style.visibility, opacity: style.opacity };
    };
    const isRendered = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0.001
        && element.getClientRects().length > 0 && rect.width > 0.5 && rect.height > 0.5;
    };
    const focusableSelector = 'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
    const renderedFocusable = (root) => Array.from(root?.querySelectorAll(focusableSelector) || []).filter(isRendered);
    const stateOf = (selector) => {
      const element = document.querySelector(selector);
      const rect = rectOf(element);
      return {
        selector,
        exists: Boolean(element),
        style: styleOf(element),
        clientRects: element?.getClientRects().length || 0,
        rect,
        rendered: isRendered(element),
        renderedFocusableControls: renderedFocusable(element).length,
      };
    };
    const intersection = (left, right) => {
      if (!left || !right) return { width: 0, height: 0, area: 0 };
      const width = Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left));
      const height = Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));
      return { width: round(width), height: round(height), area: round(width * height) };
    };
    const elements = {
      layout: document.querySelector('.main-layout'),
      nav: document.querySelector('.nav-sidebar'),
      sidebar: document.querySelector('aside.sidebar'),
      dashboard: document.querySelector('main.dashboard'),
      cabling: document.querySelector('#module-cabling'),
      wrapperBT: document.querySelector('#wrapper-bt'),
      wrapperMT: document.querySelector('#wrapper-mt'),
      mtParams: document.querySelector('#mt-params'),
      cardMT: document.querySelector('#card-mt'),
      impedances: document.querySelector('#module-impedances'),
    };
    const states = {
      sidebar: stateOf('aside.sidebar'),
      dashboard: stateOf('main.dashboard'),
      cabling: stateOf('#module-cabling'),
      wrapperBT: stateOf('#wrapper-bt'),
      wrapperMT: stateOf('#wrapper-mt'),
      mtParams: stateOf('#mt-params'),
      cardMT: stateOf('#card-mt'),
      impedances: stateOf('#module-impedances'),
      mtInputs: {
        selector: '[data-input-mt]',
        total: document.querySelectorAll('[data-input-mt]').length,
        rendered: Array.from(document.querySelectorAll('[data-input-mt]')).filter(isRendered).length,
      },
    };
    const expectation = {
      'cabling-bt': { active: ['cabling', 'wrapperBT'], inactive: ['wrapperMT', 'impedances', 'sidebar', 'dashboard'] },
      'cabling-mt': { active: ['cabling', 'wrapperMT', 'mtParams', 'cardMT'], inactive: ['wrapperBT', 'impedances', 'sidebar', 'dashboard'] },
      impedances: { active: ['impedances'], inactive: ['cabling', 'wrapperBT', 'wrapperMT', 'mtParams', 'cardMT', 'sidebar', 'dashboard'] },
      shortcircuit: { active: ['sidebar', 'dashboard'], inactive: ['cabling', 'wrapperBT', 'wrapperMT', 'impedances'] },
    }[state];
    const geometryPolicy = {
      'cabling-bt': { requiresHeaderContinuity: true },
      'cabling-mt': { requiresHeaderContinuity: true },
      impedances: { requiresHeaderContinuity: true },
      shortcircuit: { requiresHeaderContinuity: false },
    }[state];
    const activeConfig = {
      'cabling-bt': {
        root: elements.cabling,
        header: document.querySelector('#module-cabling > div:first-child'),
        functional: document.querySelector('#wrapper-bt .cabling-grid'),
      },
      'cabling-mt': {
        root: elements.cabling,
        header: document.querySelector('#module-cabling > div:first-child'),
        functional: document.querySelector('#wrapper-mt .cabling-grid'),
      },
      impedances: {
        root: elements.impedances,
        header: document.querySelector('#module-impedances > div > div:first-child'),
        functional: document.querySelector('#module-impedances .icc-panel'),
      },
      shortcircuit: {
        root: elements.dashboard,
        header: null,
        functional: null,
      },
    }[state];
    const activeRoots = state === 'shortcircuit'
      ? [elements.sidebar, elements.dashboard]
      : [activeConfig.root];
    const rootRect = rectOf(activeConfig.root);
    const sidebarRect = rectOf(elements.sidebar);
    const dashboardRect = rectOf(elements.dashboard);
    const headerRect = geometryPolicy.requiresHeaderContinuity ? rectOf(activeConfig.header) : null;
    const firstFunctionalRect = geometryPolicy.requiresHeaderContinuity ? rectOf(activeConfig.functional) : null;
    const navRect = rectOf(elements.nav);
    const layoutRect = rectOf(elements.layout);
    const activeControls = activeRoots.flatMap((root) => renderedFocusable(root));
    const activeRects = state === 'shortcircuit' ? [sidebarRect, dashboardRect] : [rootRect];
    const navControlOverlaps = activeControls.map((control) => ({
      id: control.id || null,
      rect: rectOf(control),
      intersection: intersection(navRect, rectOf(control)),
    })).filter((item) => item.intersection.area > 0.5);
    const controlsOutsideRoot = activeControls.map((control) => {
      const controlRect = rectOf(control);
      const container = activeRoots.find((root) => root?.contains(control));
      const containerRect = rectOf(container);
      return { id: control.id || null, rect: controlRect, containerRect };
    }).filter((item) => item.rect && item.containerRect
      && (item.rect.left < item.containerRect.left - 1 || item.rect.right > item.containerRect.right + 1));
    const gapPx = geometryPolicy.requiresHeaderContinuity && headerRect && firstFunctionalRect
      ? round(firstFunctionalRect.top - headerRect.bottom)
      : null;
    const activeWithinViewportWidth = activeRects.every((rect) => rect
      && rect.left >= -1 && rect.right <= innerWidth + 1);
    const firstFunctionalInFirstViewport = geometryPolicy.requiresHeaderContinuity
      ? firstFunctionalRect && firstFunctionalRect.top < innerHeight && firstFunctionalRect.bottom > 0
      : null;
    const headerVisible = geometryPolicy.requiresHeaderContinuity
      ? headerRect && headerRect.top < innerHeight && headerRect.bottom > 0
      : null;
    const navActiveIntersections = activeRects.map((rect) => intersection(navRect, rect));
    const activeAndInactive = [...expectation.active, ...expectation.inactive];
    const stateKeysValid = new Set(activeAndInactive).size === activeAndInactive.length;
    const issues = [];
    if (!stateKeysValid) issues.push('HARNESS_STATE_EXPECTATION_INVALID');
    for (const key of expectation.active) if (!states[key]?.rendered) issues.push(`ACTIVE_${key.toUpperCase()}_NOT_RENDERED`);
    for (const key of expectation.inactive) {
      const item = states[key];
      if (item?.rendered || item?.clientRects > 0 || item?.renderedFocusableControls > 0) {
        issues.push(`INACTIVE_${key.toUpperCase()}_RENDERED`);
      }
    }
    if (state === 'impedances' && states.mtInputs.rendered !== 0) issues.push('INACTIVE_MT_CONTROLS_RENDERED');
    if (!activeRects.every(finiteRect)) issues.push('ACTIVE_RECTS_NON_FINITE');
    if (geometryPolicy.requiresHeaderContinuity) {
      if (!finiteRect(headerRect) || !finiteRect(firstFunctionalRect)) issues.push('ACTIVE_RECTS_NON_FINITE');
      if (!headerVisible) issues.push('ACTIVE_HEADER_OUTSIDE_VIEWPORT');
      if (!firstFunctionalInFirstViewport) issues.push('FIRST_FUNCTIONAL_BELOW_FIRST_VIEWPORT');
      if (gapPx === null || gapPx < -1 || gapPx > 64) issues.push('ANOMALOUS_HEADER_FUNCTIONAL_GAP');
    }
    if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) issues.push('DOCUMENT_HORIZONTAL_OVERFLOW');
    if (!activeWithinViewportWidth) issues.push('ACTIVE_MODULE_OUTSIDE_VIEWPORT_WIDTH');
    if (navActiveIntersections.some((item) => item.area > 0.5)) issues.push('NAV_OVERLAPS_ACTIVE_MODULE');
    if (navControlOverlaps.length) issues.push('NAV_OVERLAPS_ACTIVE_CONTROL');
    if (controlsOutsideRoot.length) issues.push('ACTIVE_CONTROL_OUTSIDE_CONTAINER');
    if (innerWidth > 1024 && layoutRect
      && activeRects.some((rect) => rect && rect.top - layoutRect.top > 64)) {
      issues.push('ACTIVE_MODULE_LATE_GRID_ROW');
    }
    const shortcircuitMobileFlow = state === 'shortcircuit' && innerWidth <= 1024;
    if (shortcircuitMobileFlow) {
      const navSidebarIntersection = intersection(navRect, sidebarRect);
      const sidebarDashboardIntersection = intersection(sidebarRect, dashboardRect);
      const documentScrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body?.scrollHeight || 0,
      );
      if (!finiteRect(navRect) || !finiteRect(sidebarRect) || !finiteRect(dashboardRect)) {
        issues.push('SHORTCIRCUIT_FLOW_RECTS_NON_FINITE');
      } else {
        if (navRect.bottom > sidebarRect.top + 1) issues.push('SHORTCIRCUIT_NAV_SIDEBAR_ORDER_INVALID');
        if (sidebarRect.bottom > dashboardRect.top + 1) issues.push('SHORTCIRCUIT_SIDEBAR_DASHBOARD_ORDER_INVALID');
        if (navSidebarIntersection.area > 0.5 || sidebarDashboardIntersection.area > 0.5) {
          issues.push('SHORTCIRCUIT_VERTICAL_FLOW_OVERLAP');
        }
        if (dashboardRect.bottom > documentScrollHeight + 1) issues.push('SHORTCIRCUIT_DASHBOARD_UNREACHABLE');
      }
    }
    const expectedTheme = auditContext.theme;
    const actualTheme = document.documentElement.hasAttribute('data-theme') ? 'light' : 'dark';
    const actualLanguage = (document.documentElement.lang || '').toLowerCase();
    const languageMatches = auditContext.language === 'pt' ? actualLanguage.startsWith('pt') : actualLanguage === auditContext.language;
    if (actualTheme !== expectedTheme) issues.push('THEME_STATE_MISMATCH');
    if (!languageMatches) issues.push('LANGUAGE_STATE_MISMATCH');
    const activeText = activeRoots.map((root) => root?.innerText || '').join('\n');
    const invalidTokens = ['undefined', 'NaN'].filter((token) => activeText.includes(token));
    if (invalidTokens.length) issues.push('INVALID_ACTIVE_TOKEN');
    return {
      context: auditContext,
      expectedState: state,
      active: expectation.active,
      inactive: expectation.inactive,
      geometryPolicy: {
        requiresHeaderContinuity: geometryPolicy.requiresHeaderContinuity,
        shortcircuitMobileFlow,
      },
      states,
      geometry: {
        viewport: { width: innerWidth, height: innerHeight },
        scroll: { x: round(scrollX), y: round(scrollY) },
        layoutRect,
        navRect,
        activeRect: rootRect,
        sidebarRect,
        dashboardRect,
        headerRect,
        firstFunctionalRect,
        headerToFunctionalGapPx: gapPx,
        navActiveIntersection: intersection(navRect, rootRect),
        navActiveIntersections,
        gridTemplateColumns: elements.layout ? getComputedStyle(elements.layout).gridTemplateColumns : null,
        activeGridColumnStart: activeConfig.root ? getComputedStyle(activeConfig.root).gridColumnStart : null,
        activeGridColumnEnd: activeConfig.root ? getComputedStyle(activeConfig.root).gridColumnEnd : null,
        documentScrollWidth: document.documentElement.scrollWidth,
        documentClientWidth: document.documentElement.clientWidth,
      },
      controls: {
        activeRendered: activeControls.length,
        navOverlaps: navControlOverlaps,
        outsideContainer: controlsOutsideRoot,
        inactiveRenderedFocusable: expectation.inactive.reduce((sum, key) => sum + (states[key]?.renderedFocusableControls || 0), 0),
      },
      preferences: { expectedTheme, actualTheme, expectedLanguage: auditContext.language, actualLanguage },
      storage: Object.fromEntries(storageKeys.map((key) => [key, {
        exists: Object.prototype.hasOwnProperty.call(localStorage, key),
        value: localStorage.getItem(key),
      }])),
      invalidTokens,
      issues: Array.from(new Set(issues)),
      compliant: issues.length === 0,
    };
  }, { state: expectedState, auditContext: context, storageKeys: STORAGE_KEYS });
}

async function captureScreenshot(page, caseIdValue, stage, fullPage = false) {
  const fileName = `${caseIdValue}-${stage}${fullPage ? '-full' : ''}.png`.replace(/[^a-zA-Z0-9_.-]+/g, '_');
  const filePath = path.join(EVIDENCE_DIR, 'screenshots', fileName);
  await page.screenshot({ path: filePath, fullPage });
  return {
    stage,
    fullPage,
    path: filePath,
    bytes: fs.statSync(filePath).size,
    sha256: sha256File(filePath),
  };
}

function makeCaseId(reportId, index) {
  return `${reportId}-CASE-${String(index).padStart(3, '0')}`;
}

function scenarioCase(reportId, index, spec, record) {
  const audits = record.audits || [];
  const assertionExercised = audits.length === 3
    && audits.every((item) => item.audit && typeof item.audit.compliant === 'boolean');
  const issues = Array.from(new Set(audits.flatMap((item) => item.audit?.issues || []))).sort();
  return {
    caseId: makeCaseId(reportId, index),
    sequence: spec.id,
    assertionExercised,
    compliant: assertionExercised && issues.length === 0,
    expected: {
      viewport: spec.viewport,
      theme: spec.theme,
      language: spec.language,
      sourceState: spec.sourceState,
      targetState: spec.targetState,
      pageReal: true,
      originalFunctions: true,
      exclusiveRendering: true,
      maximumHeaderFunctionalGapPx: 64,
      firstFunctionalInsideFirstViewport: true,
      noHorizontalOverflow: true,
      noNavOverlap: true,
    },
    observed: {
      audits,
      issueCodes: issues,
      storageAfterTarget: record.storageAfterTarget,
    },
    screenshots: record.screenshots || [],
  };
}

async function executeScenario(page, reportId, index, spec) {
  const caseIdValue = makeCaseId(reportId, index);
  await prepareCleanReload(page, spec.viewport, spec.theme, spec.language);
  if (spec.sourceSetup === 'cabling-bt' || spec.sourceSetup === 'cabling-mt' || spec.sourceSetup === 'impedances') {
    await invokeRealState(page, spec.sourceSetup);
  } else if (spec.sourceSetup === 'persisted-cabling-mt') {
    await reloadPersistedMT(page);
  }
  await page.evaluate(() => scrollTo(0, 0));
  const screenshots = [await captureScreenshot(page, caseIdValue, 'before')];
  const before = await auditBrowserState(page, spec.sourceState, { ...spec, stage: 'before' });

  if (spec.targetAction === 'reload-persisted-mt') await reloadPersistedMT(page);
  else await invokeRealState(page, spec.targetState);

  const after = await auditBrowserState(page, spec.targetState, { ...spec, stage: 'after-stabilization' });
  screenshots.push(await captureScreenshot(page, caseIdValue, 'after-stabilization'));
  await page.evaluate(() => scrollTo(0, 0));
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const afterTop = await auditBrowserState(page, spec.targetState, { ...spec, stage: 'after-scroll-top' });
  screenshots.push(await captureScreenshot(page, caseIdValue, 'after-scroll-top'));
  if (![before, after, afterTop].every((item) => item.compliant)) {
    screenshots.push(await captureScreenshot(page, caseIdValue, 'divergence', true));
  }
  const record = {
    spec,
    audits: [
      { stage: 'before', state: spec.sourceState, audit: before },
      { stage: 'after-stabilization', state: spec.targetState, audit: after },
      { stage: 'after-scroll-top', state: spec.targetState, audit: afterTop },
    ],
    screenshots,
    storageAfterTarget: await readStorage(page),
  };
  return { record, case: scenarioCase(reportId, index, spec, record) };
}

function baseSpec(id, sourceSetup, sourceState, targetAction, targetState) {
  return {
    id,
    sourceSetup,
    sourceState,
    targetAction,
    targetState,
    viewport: { width: 1366, height: 768, deviceScaleFactor: 1 },
    theme: 'light',
    language: 'pt',
  };
}

function mandatoryMatrixSpecs() {
  const specs = [];
  for (const viewport of VIEWPORTS) {
    const languages = viewport.width === 1366 ? LANGUAGES : ['pt'];
    for (const theme of THEMES) {
      for (const language of languages) {
        specs.push({
          id: `mt-to-impedances-${viewport.width}x${viewport.height}-${theme}-${language}`,
          sourceSetup: 'cabling-mt',
          sourceState: 'cabling-mt',
          targetAction: 'impedances',
          targetState: 'impedances',
          viewport,
          theme,
          language,
        });
      }
    }
  }
  return specs;
}

function aggregateContinuityCase(reportId, index, state, records) {
  const samples = records.flatMap((record) => record.audits)
    .filter((sample) => sample.state === state && sample.stage !== 'before')
    .map((sample) => sample.audit);
  const assertionExercised = samples.length > 0;
  const issues = Array.from(new Set(samples.flatMap((sample) => sample.issues || []))).sort();
  return {
    caseId: makeCaseId(reportId, index),
    sequence: `aggregate-${state}`,
    assertionExercised,
    compliant: assertionExercised && issues.length === 0,
    expected: {
      state,
      allTargetSamplesConform: true,
      maximumHeaderFunctionalGapPx: 64,
      firstFunctionalInsideFirstViewport: true,
      finiteRects: true,
      noLateGridRow: true,
    },
    observed: {
      samples: samples.length,
      conforming: samples.filter((sample) => sample.compliant).length,
      nonConforming: samples.filter((sample) => !sample.compliant).length,
      issueCodes: issues,
      failingSamples: samples.filter((sample) => !sample.compliant).slice(0, 8),
    },
    screenshots: records.flatMap((record) => record.screenshots || [])
      .filter((item) => item.fullPage && records.some((record) => record.audits.some((sample) => sample.state === state))),
  };
}

async function executeVisualScenario(puppeteer) {
  let server;
  let browser;
  let page;
  let originalStorage = null;
  let restoration = { attempted: false, compliant: false, before: null, after: null, error: null };
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  const casesById = Object.fromEntries(IDS.map((id) => [id, []]));
  const records = [];
  let runtimeBefore = null;
  let runtimeAfter = null;
  try {
    server = await startStaticServer();
    browser = await puppeteer.launch({ headless: 'new', timeout: 30000 });
    page = await browser.newPage();
    await page.evaluateOnNewDocument((keys) => {
      window.__umsiPreBootStorage = Object.fromEntries(keys.map((key) => [key, {
        exists: Object.prototype.hasOwnProperty.call(localStorage, key),
        value: localStorage.getItem(key),
      }]));
    }, STORAGE_KEYS);
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(serializeError(error)));
    page.on('requestfailed', (request) => requestFailures.push({
      url: request.url(),
      errorText: request.failure()?.errorText || null,
    }));
    await page.goto(server.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForRuntime(page);
    originalStorage = await page.evaluate(() => window.__umsiPreBootStorage);
    runtimeBefore = await runtimeFacts(page);

    const runtimeChecks = {
      realHttpPage: runtimeBefore.url.startsWith(server.url),
      readyStateComplete: runtimeBefore.readyState === 'complete' || runtimeBefore.readyState === 'interactive',
      switchModuleOriginal: runtimeBefore.switchModuleType === 'function'
        && runtimeBefore.switchModuleSource.includes("localStorage.setItem('ampai-active-module'")
        && !runtimeBefore.switchModuleSource.includes('[native code]'),
      switchCablingCardOriginal: runtimeBefore.switchCablingCardType === 'function'
        && runtimeBefore.switchCablingCardSource.includes("localStorage.setItem('ampai-active-cabling-card'")
        && !runtimeBefore.switchCablingCardSource.includes('[native code]'),
      realEnginesAvailable: runtimeBefore.calculateBTType === 'function' && runtimeBefore.calculateMTType === 'function',
      realDomPresent: runtimeBefore.pageRootPresent === true,
      storageCapturedWithPresence: STORAGE_KEYS.every((key) => typeof originalStorage?.[key]?.exists === 'boolean'),
    };
    casesById['UMSI-01'].push({
      caseId: makeCaseId('UMSI-01', 1),
      sequence: 'runtime-and-original-functions',
      assertionExercised: Object.keys(runtimeChecks).length === 7,
      compliant: Object.values(runtimeChecks).every(Boolean),
      expected: { pageReal: true, originalFunctions: true, realEngines: true, storagePresenceCaptured: true },
      observed: { checks: runtimeChecks, runtimeBefore },
      screenshots: [],
    });

    const focal = [
      ['UMSI-02', baseSpec('clean-reload-to-cabling-bt', null, 'shortcircuit', 'cabling-bt', 'cabling-bt')],
      ['UMSI-03', baseSpec('clean-reload-to-cabling-mt', null, 'shortcircuit', 'cabling-mt', 'cabling-mt')],
      ['UMSI-04', baseSpec('cabling-bt-to-impedances', 'cabling-bt', 'cabling-bt', 'impedances', 'impedances')],
      ['UMSI-06', baseSpec('impedances-to-cabling-bt', 'impedances', 'impedances', 'cabling-bt', 'cabling-bt')],
      ['UMSI-07', baseSpec('impedances-to-cabling-mt', 'impedances', 'impedances', 'cabling-mt', 'cabling-mt')],
      ['UMSI-08', baseSpec('cabling-mt-to-shortcircuit', 'cabling-mt', 'cabling-mt', 'shortcircuit', 'shortcircuit')],
      ['UMSI-09', baseSpec('reload-with-persisted-cabling-mt', null, 'shortcircuit', 'reload-persisted-mt', 'cabling-mt')],
      ['UMSI-10', baseSpec('persisted-cabling-mt-to-impedances', 'persisted-cabling-mt', 'cabling-mt', 'impedances', 'impedances')],
    ];
    for (const [reportId, spec] of focal) {
      const result = await executeScenario(page, reportId, 1, spec);
      casesById[reportId].push(result.case);
      records.push(result.record);
    }

    const matrixSpecs = mandatoryMatrixSpecs();
    for (let index = 0; index < matrixSpecs.length; index += 1) {
      const result = await executeScenario(page, 'UMSI-05', index + 1, matrixSpecs[index]);
      casesById['UMSI-05'].push(result.case);
      records.push(result.record);
    }

    for (const [index, state] of ['cabling-bt', 'cabling-mt', 'impedances', 'shortcircuit'].entries()) {
      casesById['UMSI-11'].push(aggregateContinuityCase('UMSI-11', index + 1, state, records));
    }
    runtimeAfter = await runtimeFacts(page);
  } finally {
    if (page && originalStorage) {
      restoration = { attempted: true, compliant: false, before: originalStorage, after: null, error: null };
      try {
        restoration.after = await page.evaluate(({ keys, before }) => {
          for (const key of keys) {
            const state = before[key];
            if (state.exists) localStorage.setItem(key, state.value);
            else localStorage.removeItem(key);
          }
          return Object.fromEntries(keys.map((key) => [key, {
            exists: Object.prototype.hasOwnProperty.call(localStorage, key),
            value: localStorage.getItem(key),
          }]));
        }, { keys: STORAGE_KEYS, before: originalStorage });
        restoration.compliant = isDeepStrictEqual(restoration.after, originalStorage);
      } catch (error) {
        restoration.error = serializeError(error);
        restoration.compliant = false;
      }
    }
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    await closeServer(server?.server);
  }

  const sourceStable = runtimeBefore && runtimeAfter
    && runtimeBefore.switchModuleSha256 === runtimeAfter.switchModuleSha256
    && runtimeBefore.switchCablingCardSha256 === runtimeAfter.switchCablingCardSha256;
  const telemetryChecks = {
    originalFunctionSourcesStable: sourceStable,
    storageRestorationAttempted: restoration.attempted,
    storageRestoredExactly: restoration.compliant,
    consoleErrorsReconciled: Array.isArray(consoleErrors),
    pageErrorsReconciled: Array.isArray(pageErrors),
    zeroConsoleErrors: consoleErrors.length === 0,
    zeroPageErrors: pageErrors.length === 0,
  };
  casesById['UMSI-12'].push({
    caseId: makeCaseId('UMSI-12', 1),
    sequence: 'telemetry-and-storage-restoration',
    assertionExercised: Object.keys(telemetryChecks).length === 7,
    compliant: Object.values(telemetryChecks).every(Boolean),
    expected: {
      functionSourcesStable: true,
      localStorageRestoredWithPresence: true,
      consoleErrors: [],
      pageErrors: [],
    },
    observed: { checks: telemetryChecks, runtimeBefore, runtimeAfter, restoration, consoleErrors, pageErrors, requestFailures },
    screenshots: [],
  });
  return { casesById, records, runtimeBefore, runtimeAfter, restoration, consoleErrors, pageErrors, requestFailures };
}

function buildReports(snapshot) {
  return IDS.map((id) => {
    const cases = snapshot.casesById[id] || [];
    const expectedCases = CASE_DISTRIBUTION[id];
    const assertionExercised = cases.length === expectedCases
      && cases.every((item) => item.assertionExercised === true);
    const compliant = assertionExercised && cases.every((item) => item.compliant === true)
      && snapshot.consoleErrors.length === 0 && snapshot.pageErrors.length === 0
      && snapshot.restoration.compliant === true;
    const failures = cases.filter((item) => !item.compliant);
    return {
      id,
      category: CATEGORY,
      classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
      compliant,
      assertionExercised,
      expected: {
        cases: expectedCases,
        allCasesConform: true,
        originalProductiveFunctions: true,
        localStorageRestored: true,
        consoleErrors: [],
        pageErrors: [],
      },
      observed: {
        cases: cases.length,
        conformingCases: cases.length - failures.length,
        nonConformingCases: failures.length,
        issueCodes: Array.from(new Set(failures.flatMap((item) => item.observed?.issueCodes || []))).sort(),
      },
      cases,
      consoleErrors: snapshot.consoleErrors,
      pageErrors: snapshot.pageErrors,
    };
  });
}

function blockedReports(classification, error) {
  return IDS.map((id) => ({
    id,
    category: CATEGORY,
    classification,
    compliant: false,
    assertionExercised: false,
    expected: {
      cases: CASE_DISTRIBUTION[id],
      allCasesConform: true,
      originalProductiveFunctions: true,
      localStorageRestored: true,
      consoleErrors: [],
      pageErrors: [],
    },
    observed: {
      cases: 0,
      conformingCases: 0,
      nonConformingCases: 0,
      reason: classification === 'INFRA_BLOCKED' ? 'chromium_preflight_failed' : 'harness_or_protocol_error',
      error: serializeError(error),
      issueCodes: [],
    },
    cases: [],
    consoleErrors: [],
    pageErrors: [],
  }));
}

function validateProtocol(reports, classification) {
  const reportKeys = [
    'id', 'category', 'classification', 'compliant', 'assertionExercised',
    'expected', 'observed', 'cases', 'consoleErrors', 'pageErrors',
  ];
  const caseKeys = ['caseId', 'sequence', 'assertionExercised', 'compliant', 'expected', 'observed', 'screenshots'];
  if (reports.length !== EXPECTED_REPORTS || !isDeepStrictEqual(reports.map((item) => item.id), IDS)) return false;
  if (new Set(reports.map((item) => item.id)).size !== EXPECTED_REPORTS) return false;
  if (reports.some((report) => !isDeepStrictEqual(Object.keys(report), reportKeys))) return false;
  const cases = reports.flatMap((report) => report.cases);
  if (classification === 'INFRA_BLOCKED' || classification === 'CONFIG_ERROR') {
    return cases.length === 0 && reports.every((report) => report.assertionExercised === false);
  }
  return cases.length === EXPECTED_CASES
    && new Set(cases.map((item) => item.caseId)).size === EXPECTED_CASES
    && cases.every((item) => isDeepStrictEqual(Object.keys(item), caseKeys) && item.assertionExercised === true)
    && reports.every((report) => report.assertionExercised === true)
    && IDS.every((id) => reports.find((report) => report.id === id)?.cases.length === CASE_DISTRIBUTION[id]);
}

function makeSummary(classification, reports, preflight, evidence, functionalError = null) {
  const cases = reports.flatMap((report) => report.cases || []);
  const compliant = reports.filter((report) => report.compliant).length;
  return {
    classification,
    reports: reports.length,
    expectedReports: EXPECTED_REPORTS,
    cases: cases.length,
    expectedCases: EXPECTED_CASES,
    uniqueCaseIds: new Set(cases.map((item) => item.caseId)).size,
    compliant,
    nonCompliant: reports.length - compliant,
    assertionsExercised: reports.filter((report) => report.assertionExercised).length,
    caseAssertionsExercised: cases.filter((item) => item.assertionExercised).length,
    preflightExitCode: preflight?.exitCode ?? (classification === 'INFRA_BLOCKED' ? 2 : 0),
    processExitCode: { PASS: 0, FUNCTIONAL_FAILURE: 1, INFRA_BLOCKED: 2, CONFIG_ERROR: 3 }[classification],
    storageRestored: reports.find((report) => report.id === 'UMSI-12')?.cases?.[0]?.observed?.checks?.storageRestoredExactly ?? null,
    evidence,
    functionalError: functionalError ? serializeError(functionalError) : null,
  };
}

function emit(reports, summary) {
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify(summary)}\n`);
}

function writeEvidence(snapshot, summary, preflight) {
  const casesPath = path.join(EVIDENCE_DIR, 'stateful-cases.json');
  const storagePath = path.join(EVIDENCE_DIR, 'local-storage-lifecycle.json');
  const environmentPath = path.join(EVIDENCE_DIR, 'environment.json');
  const summaryPath = path.join(EVIDENCE_DIR, 'summary.json');
  fs.writeFileSync(casesPath, `${JSON.stringify(snapshot.records, null, 2)}\n`, 'utf8');
  fs.writeFileSync(storagePath, `${JSON.stringify(snapshot.restoration, null, 2)}\n`, 'utf8');
  fs.writeFileSync(environmentPath, `${JSON.stringify({
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    chromium: preflight?.browserVersion || null,
    startedFrom: ROOT,
    evidenceDirectory: EVIDENCE_DIR,
  }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  const describe = (filePath) => ({ path: filePath, bytes: fs.statSync(filePath).size, sha256: sha256File(filePath) });
  const screenshots = snapshot.records.flatMap((record) => record.screenshots || []);
  return {
    evidenceDirectory: EVIDENCE_DIR,
    cases: describe(casesPath),
    storage: describe(storagePath),
    environment: describe(environmentPath),
    summary: { path: summaryPath, selfHashEmbedded: false },
    screenshots,
  };
}

async function main() {
  ensureExternalEvidenceDirectory();
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (error) {
    const reports = blockedReports('CONFIG_ERROR', error);
    const summary = makeSummary('CONFIG_ERROR', reports, null, { evidenceDirectory: EVIDENCE_DIR }, error);
    emit(reports, summary);
    process.exitCode = 3;
    return;
  }

  let preflight;
  try {
    preflight = await chromiumPreflight(puppeteer);
  } catch (error) {
    const reports = blockedReports('INFRA_BLOCKED', error);
    const classification = validateProtocol(reports, 'INFRA_BLOCKED') ? 'INFRA_BLOCKED' : 'CONFIG_ERROR';
    const summary = makeSummary(classification, reports, { exitCode: 2 }, { evidenceDirectory: EVIDENCE_DIR }, error);
    fs.writeFileSync(path.join(EVIDENCE_DIR, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    emit(reports, summary);
    process.exitCode = summary.processExitCode;
    return;
  }

  try {
    const snapshot = await executeVisualScenario(puppeteer);
    if (!snapshot.restoration.compliant) {
      throw new Error(`Falha de restauração de localStorage: ${JSON.stringify(snapshot.restoration)}`);
    }
    let reports = buildReports(snapshot);
    let classification = reports.every((report) => report.compliant) ? 'PASS' : 'FUNCTIONAL_FAILURE';
    if (!validateProtocol(reports, classification)) {
      classification = 'CONFIG_ERROR';
      reports = blockedReports('CONFIG_ERROR', new Error('Protocolo UMSI incompleto, duplicado ou inválido.'));
    }
    let summary = makeSummary(classification, reports, preflight, { evidenceDirectory: EVIDENCE_DIR });
    const evidence = writeEvidence(snapshot, summary, preflight);
    summary = { ...summary, evidence };
    fs.writeFileSync(path.join(EVIDENCE_DIR, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    emit(reports, summary);
    process.exitCode = summary.processExitCode;
  } catch (error) {
    const reports = blockedReports('CONFIG_ERROR', error);
    const summary = makeSummary('CONFIG_ERROR', reports, preflight, { evidenceDirectory: EVIDENCE_DIR }, error);
    fs.writeFileSync(path.join(EVIDENCE_DIR, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    emit(reports, summary);
    process.exitCode = 3;
  }
}

if (require.main === module) {
  main().catch((error) => {
    const reports = blockedReports('CONFIG_ERROR', error);
    const summary = makeSummary('CONFIG_ERROR', reports, null, { evidenceDirectory: EVIDENCE_DIR }, error);
    emit(reports, summary);
    process.exitCode = 3;
  });
}

module.exports = {
  IDS,
  VIEWPORTS,
  EXPECTED_CASES,
  CASE_DISTRIBUTION,
  validateProtocol,
};
