/**
 * AMP-UI-MODULE-LAYOUT-001 — RED visual experimental de isolamento e geometria.
 *
 * Exercita Chromium, página, CSS, navegação, temas, idiomas, scroll e funções
 * produtivas reais. Não substitui motor, renderer, DOM ou regras de layout.
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
const REPORT_PREFIX = 'AMP_UI_MODULE_LAYOUT_EXP_REPORT';
const SUMMARY_PREFIX = 'AMP_UI_MODULE_LAYOUT_EXP_SUMMARY';
const CATEGORY = 'ui_module_layout_isolation_experimental';
const IDS = Array.from({ length: 12 }, (_unused, index) => `UMLI-${String(index + 1).padStart(2, '0')}`);
const VIEWPORTS = [
  [1920, 1080], [1440, 900], [1280, 800], [1200, 800], [1199, 800], [1024, 768],
  [1023, 768], [900, 800], [899, 800], [768, 1024], [390, 844], [375, 812],
].map(([width, height]) => ({ width, height, deviceScaleFactor: 1 }));
const SEQUENCES = [
  { id: 'A', states: [{ module: 'shortcircuit' }, { module: 'cabling', card: 'bt' }, { module: 'impedances' }] },
  { id: 'B', states: [{ module: 'shortcircuit' }, { module: 'cabling', card: 'mt' }, { module: 'impedances' }] },
  { id: 'C', states: [{ module: 'impedances' }, { module: 'cabling', card: 'bt' }, { module: 'shortcircuit' }] },
  { id: 'D', states: [{ module: 'cabling', card: 'mt' }, { module: 'shortcircuit' }, { module: 'cabling', card: 'mt' }] },
];
const SCROLL_MODES = ['start', 'middle', 'end'];
const STABILITY_VIEWPORTS = new Set(['1920x1080', '1200x800', '1023x768', '390x844']);
const LANGUAGES = ['pt', 'en', 'es'];
const THEMES = ['light', 'dark'];
const SIDEBAR_STATES = ['expanded', 'collapsed'];
const DOM_PATHS = [
  '.main-layout', '.nav-sidebar', 'aside.sidebar', 'main.dashboard', '#module-cabling',
  '#wrapper-bt', '#wrapper-mt', '#module-impedances', '#btn-bt', '#btn-mt', '#icc-unq',
];
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};
const EVIDENCE_DIR = path.resolve(process.env.AMP_UI_MODULE_LAYOUT_EVIDENCE_DIR
  || path.join(os.tmpdir(), 'AmpAI-QA', 'AMP-UI-MODULE-LAYOUT-001-QA-RED-R1'));

function serializeError(error) {
  return { name: error?.name || 'Error', message: String(error?.message || error), stack: String(error?.stack || '') };
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').toUpperCase();
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
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('data:text/html,<title>UMLI preflight</title><main>ok</main>', { waitUntil: 'load' });
    const ok = await page.evaluate(() => document.querySelector('main')?.textContent === 'ok');
    if (!ok) throw new Error('Chromium não executou a assertion do preflight.');
    return { exitCode: 0, browserVersion: await browser.version() };
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

async function installBrowserAuditor(page) {
  await page.evaluate(() => {
    const round = (value) => Number(Number(value || 0).toFixed(3));
    const rectOf = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        x: round(rect.x), y: round(rect.y), left: round(rect.left), top: round(rect.top),
        right: round(rect.right), bottom: round(rect.bottom), width: round(rect.width), height: round(rect.height),
      };
    };
    const rendered = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
        && rect.width > 0.5 && rect.height > 0.5;
    };
    const inViewport = (element) => {
      if (!rendered(element)) return false;
      const rect = element.getBoundingClientRect();
      return rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
    };
    const intersection = (left, right) => {
      if (!left || !right) return null;
      const width = Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left));
      const height = Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));
      return { width: round(width), height: round(height), area: round(width * height) };
    };
    const union = (rectangles) => {
      const list = rectangles.filter((rect) => rect && rect.width > 0 && rect.height > 0);
      if (!list.length) return null;
      const left = Math.min(...list.map((rect) => rect.left));
      const top = Math.min(...list.map((rect) => rect.top));
      const right = Math.max(...list.map((rect) => rect.right));
      const bottom = Math.max(...list.map((rect) => rect.bottom));
      return { x: round(left), y: round(top), left: round(left), top: round(top), right: round(right), bottom: round(bottom), width: round(right - left), height: round(bottom - top) };
    };
    const selectorOf = (element) => {
      if (!element) return null;
      if (element.id) return `#${CSS.escape(element.id)}`;
      const name = element.getAttribute('name');
      if (name) return `${element.tagName.toLowerCase()}[name="${CSS.escape(name)}"]`;
      const classes = Array.from(element.classList).slice(0, 2).map((item) => `.${CSS.escape(item)}`).join('');
      return `${element.tagName.toLowerCase()}${classes}`;
    };
    const frames = (count = 8) => new Promise((resolve) => {
      const next = () => (count-- <= 0 ? resolve() : requestAnimationFrame(next));
      requestAnimationFrame(next);
    });
    const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

    window.__umliSetState = async (state) => {
      if (typeof window.switchModule !== 'function') throw new Error('switchModule produtivo indisponível.');
      window.switchModule(state.module);
      if (state.module === 'cabling') {
        if (typeof window.switchCablingCard !== 'function') throw new Error('switchCablingCard produtivo indisponível.');
        window.switchCablingCard(state.card);
      }
      await frames(12);
      await wait(state.module === 'cabling' ? 460 : 120);
      await frames(6);
    };

    window.__umliSetPreferences = async ({ language, theme, sidebar }) => {
      if (typeof window.setLanguage !== 'function') throw new Error('setLanguage produtivo indisponível.');
      window.setLanguage(language);
      const themeIsLight = document.documentElement.hasAttribute('data-theme');
      if ((theme === 'light') !== themeIsLight) document.querySelector('#theme-toggle')?.click();
      const layout = document.querySelector('.main-layout');
      const collapsed = layout?.classList.contains('sidebar-collapsed') === true;
      if ((sidebar === 'collapsed') !== collapsed) {
        if (typeof window.toggleSidebar !== 'function') throw new Error('toggleSidebar produtivo indisponível.');
        window.toggleSidebar();
      }
      await frames(10);
      await wait(120);
    };

    window.__umliScroll = async (state, mode) => {
      const sidebar = document.querySelector('aside.sidebar');
      const dashboard = document.querySelector('main.dashboard');
      const primary = state.module === 'shortcircuit'
        ? union([rectOf(sidebar), rectOf(dashboard)])
        : rectOf(document.querySelector(state.module === 'cabling' ? '#module-cabling' : '#module-impedances'));
      const absoluteTop = (primary?.top || 0) + scrollY;
      const absoluteBottom = (primary?.bottom || innerHeight) + scrollY;
      let target = absoluteTop;
      if (mode === 'middle') target = absoluteTop + Math.max(0, (absoluteBottom - absoluteTop - innerHeight) / 2);
      if (mode === 'end') target = Math.max(absoluteTop, absoluteBottom - innerHeight * 0.85);
      scrollTo(0, Math.max(0, target));
      await frames(8);
      await wait(80);
    };

    window.__umliAudit = (state, context) => {
      const elements = {
        layout: document.querySelector('.main-layout'),
        nav: document.querySelector('.nav-sidebar'),
        sidebar: document.querySelector('aside.sidebar'),
        dashboard: document.querySelector('main.dashboard'),
        cabling: document.querySelector('#module-cabling'),
        wrapperBT: document.querySelector('#wrapper-bt'),
        wrapperMT: document.querySelector('#wrapper-mt'),
        impedances: document.querySelector('#module-impedances'),
      };
      const stateKey = state.module === 'cabling' ? `cabling-${state.card}` : state.module;
      const activeRoots = state.module === 'shortcircuit' ? [elements.sidebar, elements.dashboard]
        : state.module === 'cabling' ? [state.card === 'bt' ? elements.wrapperBT : elements.wrapperMT]
          : [elements.impedances];
      const inactiveRoots = state.module === 'shortcircuit' ? [elements.cabling, elements.impedances]
        : state.module === 'cabling' ? [elements.sidebar, elements.dashboard, elements.impedances, state.card === 'bt' ? elements.wrapperMT : elements.wrapperBT]
          : [elements.sidebar, elements.dashboard, elements.cabling];
      const requiredSelectors = stateKey === 'shortcircuit' ? ['#input-c', 'aside.sidebar .form-control', 'main.dashboard .result-card']
        : stateKey === 'cabling-bt' ? ['#btn-bt', '#bt-method', '#card-bt']
          : stateKey === 'cabling-mt' ? ['#btn-mt', '#mt-voltage', '#card-mt']
            : ['#icc-unq', '[data-action="calc-icc-rede"]', '.icc-panel'];
      const activeControls = activeRoots.flatMap((root) => Array.from(root?.querySelectorAll('input,select,textarea,button,[role="button"]') || []))
        .filter((element) => rendered(element));
      const cablingResultDensitySelector = '#card-bt .results-grid > .result-card,#card-mt .results-grid > .result-card';
      const activeCablingCard = state.module === 'cabling'
        ? document.querySelector(state.card === 'bt' ? '#card-bt' : '#card-mt')
        : null;
      const cablingResultDensityCards = Array.from(document.querySelectorAll(cablingResultDensitySelector))
        .filter((element) => rendered(element));
      const activeCablingResultDensityCards = cablingResultDensityCards
        .filter((element) => activeCablingCard?.contains(element));
      const isCablingResultDensityCard = (element) => {
        const resultsGrid = element?.parentElement;
        const cablingCard = resultsGrid?.closest('#card-bt,#card-mt');
        return element?.matches('.result-card') === true
          && resultsGrid?.matches('.results-grid') === true
          && element.matches(cablingResultDensitySelector)
          && cablingCard === activeCablingCard
          && elements.cabling?.contains(cablingCard) === true
          && activeRoots.some((root) => root?.contains(element))
          && rendered(element);
      };
      const delegatedCablingResultDensityCards = activeCablingResultDensityCards
        .filter((element) => isCablingResultDensityCard(element));
      const geometryTargets = Array.from(new Set([...activeControls, ...activeCablingResultDensityCards]));
      const visibleGeometryTargets = geometryTargets.filter((element) => inViewport(element));
      const navRect = rectOf(elements.nav);
      const navOverlaps = visibleGeometryTargets.map((element) => ({ selector: selectorOf(element), intersection: intersection(navRect, rectOf(element)) }))
        .filter((item) => item.intersection?.area > 0.5);
      const inactiveVisibleDescendants = inactiveRoots.flatMap((root) => Array.from(root?.querySelectorAll('*') || []))
        .filter((element) => inViewport(element)).map((element) => ({ selector: selectorOf(element), rect: rectOf(element) }));
      const activeBounds = union(activeRoots.map(rectOf));
      const outOfContainer = geometryTargets.filter((element) => {
        const rect = rectOf(element);
        const owner = activeRoots.find((root) => root?.contains(element));
        const bounds = rectOf(owner);
        if (activeCablingResultDensityCards.includes(element)) {
          const resultsGrid = element.parentElement;
          const cablingCard = resultsGrid?.closest('#card-bt,#card-mt');
          const containers = [resultsGrid, cablingCard, elements.cabling, owner];
          return !isCablingResultDensityCard(element) || containers.some((container) => {
            const containerRect = rectOf(container);
            return !container?.contains(element) || !containerRect || !rect
              || rect.left < containerRect.left - 1 || rect.right > containerRect.right + 1
              || rect.top < containerRect.top - 1 || rect.bottom > containerRect.bottom + 1;
          });
        }
        return !rect || !bounds || rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1;
      }).map((element) => ({ selector: selectorOf(element), rect: rectOf(element) }));
      const panels = Array.from(new Set([
        ...activeRoots.flatMap((root) => [root, ...Array.from(root?.querySelectorAll('.icc-panel,.cabling-grid > aside,#card-bt,#card-mt,.result-card') || [])]),
        ...activeCablingResultDensityCards,
      ])).filter((element) => rendered(element));
      const slivers = panels.filter((element) => {
        const rect = element.getBoundingClientRect();
        const delegatedToRcd = isCablingResultDensityCard(element);
        return (!delegatedToRcd && rect.width < Math.max(120, innerWidth * 0.18)) || rect.height < 32;
      }).map((element) => ({ selector: selectorOf(element), rect: rectOf(element) }));
      const required = requiredSelectors.map((selector) => {
        const element = document.querySelector(selector);
        return { selector, exists: Boolean(element), rendered: rendered(element), rect: rectOf(element) };
      });
      const clipped = geometryTargets.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > innerWidth + 1
          || element.scrollWidth > element.clientWidth + 1
          || (activeCablingResultDensityCards.includes(element) && element.scrollHeight > element.clientHeight + 1);
      }).map((element) => ({
        selector: selectorOf(element), rect: rectOf(element),
        scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
        scrollHeight: element.scrollHeight, clientHeight: element.clientHeight,
      }));
      const activeText = activeRoots.map((root) => root?.innerText || '').join('\n');
      const invalidTokens = ['undefined', 'NaN', '--'].filter((token) => activeText.includes(token));
      const modulesVisible = [
        (rendered(elements.sidebar) || rendered(elements.dashboard)) ? 'shortcircuit' : null,
        rendered(elements.cabling) ? 'cabling' : null,
        rendered(elements.impedances) ? 'impedances' : null,
      ].filter(Boolean);
      const issues = [];
      if (!activeBounds || activeBounds.width <= 0 || activeBounds.height <= 0) issues.push('ACTIVE_MODULE_RECT_INVALID');
      if (activeBounds && activeBounds.width < Math.max(140, innerWidth * 0.30)) issues.push('ACTIVE_MODULE_SLIVER');
      if (required.some((item) => !item.exists || !item.rendered)) issues.push('ACTIVE_FUNCTIONAL_CONTENT_MISSING');
      if (inactiveVisibleDescendants.length) issues.push('INACTIVE_DESCENDANTS_VISIBLE');
      if (navOverlaps.length) issues.push('NAV_CONTROL_OVERLAP');
      if (outOfContainer.length) issues.push('CONTROL_OUTSIDE_FUNCTIONAL_CONTAINER');
      if (slivers.length) issues.push('FUNCTIONAL_PANEL_SLIVER');
      if (clipped.length) issues.push('HORIZONTAL_CLIPPING');
      if (document.documentElement.scrollWidth > innerWidth + 1 || document.body.scrollWidth > innerWidth + 1) issues.push('DOCUMENT_HORIZONTAL_OVERFLOW');
      if (invalidTokens.length) issues.push('INVALID_VISIBLE_TOKEN');
      return {
        context, state: stateKey, viewport: {
          innerWidth, innerHeight, devicePixelRatio,
          visualViewportScale: window.visualViewport?.scale ?? null,
        },
        scroll: { mode: context.scrollMode, x: round(scrollX), y: round(scrollY) },
        document: {
          documentElementScrollWidth: document.documentElement.scrollWidth,
          documentElementClientWidth: document.documentElement.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
          bodyClientWidth: document.body.clientWidth,
          bodyOverflowX: getComputedStyle(document.body).overflowX,
        },
        gridTemplateColumns: getComputedStyle(elements.layout).gridTemplateColumns,
        display: {
          navSidebar: elements.nav ? getComputedStyle(elements.nav).display : null,
          shortCircuitSidebar: elements.sidebar ? getComputedStyle(elements.sidebar).display : null,
          shortCircuitDashboard: elements.dashboard ? getComputedStyle(elements.dashboard).display : null,
          moduleCabling: elements.cabling ? getComputedStyle(elements.cabling).display : null,
          wrapperBT: elements.wrapperBT ? getComputedStyle(elements.wrapperBT).display : null,
          wrapperMT: elements.wrapperMT ? getComputedStyle(elements.wrapperMT).display : null,
          moduleImpedances: elements.impedances ? getComputedStyle(elements.impedances).display : null,
        },
        rects: {
          navSidebar: navRect, shortCircuitSidebar: rectOf(elements.sidebar), shortCircuitDashboard: rectOf(elements.dashboard),
          moduleCabling: rectOf(elements.cabling), wrapperBT: rectOf(elements.wrapperBT), wrapperMT: rectOf(elements.wrapperMT),
          moduleImpedances: rectOf(elements.impedances), activeBounds,
        },
        moduleActive: stateKey,
        modulesVisible,
        requiredControls: required,
        activeControlCount: activeControls.length,
        visibleActiveControlCount: activeControls.filter((element) => inViewport(element)).length,
        cablingResultDensityDelegation: {
          selector: cablingResultDensitySelector,
          candidates: cablingResultDensityCards.map((element) => selectorOf(element)),
          activeCandidates: activeCablingResultDensityCards.map((element) => selectorOf(element)),
          delegated: delegatedCablingResultDensityCards.map((element) => selectorOf(element)),
        },
        inactiveVisibleDescendantCount: inactiveVisibleDescendants.length,
        inactiveVisibleDescendants: inactiveVisibleDescendants.slice(0, 40),
        navOverlaps: navOverlaps.slice(0, 40),
        outOfContainer: outOfContainer.slice(0, 40),
        slivers: slivers.slice(0, 40),
        clipped: clipped.slice(0, 40),
        invalidTokens,
        domPathsVerified: [
          '.main-layout', '.nav-sidebar', 'aside.sidebar', 'main.dashboard', '#module-cabling',
          '#wrapper-bt', '#wrapper-mt', '#module-impedances', '#btn-bt', '#btn-mt', '#icc-unq',
        ],
        issues: Array.from(new Set(issues)),
        compliant: issues.length === 0,
      };
    };
  });
}

async function captureFailureScreenshot(page, name) {
  const fileName = `${name.replace(/[^a-zA-Z0-9_-]+/g, '_')}.png`;
  const filePath = path.join(EVIDENCE_DIR, 'screenshots', fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

async function transitionSnapshots(page, state, context) {
  await page.evaluate((nextState) => window.__umliSetState(nextState), state);
  const snapshots = [];
  for (const scrollMode of SCROLL_MODES) {
    await page.evaluate(async ({ nextState, mode }) => window.__umliScroll(nextState, mode), { nextState: state, mode: scrollMode });
    snapshots.push(await page.evaluate(({ nextState, auditContext }) => window.__umliAudit(nextState, auditContext), {
      nextState: state, auditContext: { ...context, scrollMode },
    }));
  }
  return snapshots;
}

async function executeVisualScenario(puppeteer) {
  let server;
  let browser;
  let page;
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  const screenshots = [];
  const matrix = [];
  const stability = [];
  const repeated = [];
  let preferenceState = null;
  let preferencesRestored = false;
  try {
    server = await startStaticServer();
    browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(serializeError(error)));
    page.on('requestfailed', (request) => requestFailures.push({ url: request.url(), errorText: request.failure()?.errorText || null }));
    await page.goto(server.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => document.readyState !== 'loading'
      && typeof window.switchModule === 'function' && typeof window.switchCablingCard === 'function'
      && typeof window.setLanguage === 'function' && typeof window.toggleSidebar === 'function', { timeout: 15000 });
    await installBrowserAuditor(page);
    preferenceState = await page.evaluate(() => {
      const keys = ['ampai-active-module', 'ampai-active-cabling-card', 'ampai-lang', 'ampai-theme', 'sidebarCollapsed'];
      return {
        storage: Object.fromEntries(keys.map((key) => [key, {
          exists: Object.prototype.hasOwnProperty.call(localStorage, key), value: localStorage.getItem(key),
        }])),
        themeAttribute: document.documentElement.getAttribute('data-theme'),
        layoutCollapsed: document.querySelector('.main-layout')?.classList.contains('sidebar-collapsed') === true,
      };
    });

    for (const viewport of VIEWPORTS) {
      await page.setViewport(viewport);
      const viewportId = `${viewport.width}x${viewport.height}`;
      for (const sequence of SEQUENCES) {
        const record = { viewport, viewportId, sequenceId: sequence.id, snapshots: [], screenshotPaths: [] };
        for (let step = 0; step < sequence.states.length; step += 1) {
          const state = sequence.states[step];
          const samples = await transitionSnapshots(page, state, { kind: 'sequence', viewportId, sequenceId: sequence.id, step: step + 1 });
          record.snapshots.push(...samples);
        }
        if (record.snapshots.some((snapshot) => !snapshot.compliant)) {
          record.screenshotPaths.push(await captureFailureScreenshot(page, `matrix-${viewportId}-${sequence.id}`));
        }
        matrix.push(record);
      }

      if (STABILITY_VIEWPORTS.has(viewportId)) {
        const record = { viewport, viewportId, snapshots: [], screenshotPaths: [] };
        for (const language of LANGUAGES) {
          for (const theme of THEMES) {
            for (const sidebar of SIDEBAR_STATES) {
              await page.evaluate((preferences) => window.__umliSetPreferences(preferences), { language, theme, sidebar });
              const samples = await transitionSnapshots(page, { module: 'cabling', card: 'bt' }, {
                kind: 'stability', viewportId, language, theme, sidebar,
              });
              record.snapshots.push(...samples);
            }
          }
        }
        if (record.snapshots.some((snapshot) => !snapshot.compliant)) {
          record.screenshotPaths.push(await captureFailureScreenshot(page, `stability-${viewportId}`));
        }
        stability.push(record);
      }

      const repeatRecord = { viewport, viewportId, cycles: 3, snapshots: [], screenshotPaths: [] };
      for (let cycle = 1; cycle <= 3; cycle += 1) {
        for (let step = 0; step < SEQUENCES[3].states.length; step += 1) {
          const state = SEQUENCES[3].states[step];
          const samples = await transitionSnapshots(page, state, {
            kind: 'repeat', viewportId, sequenceId: 'D', cycle, step: step + 1,
          });
          repeatRecord.snapshots.push(...samples);
        }
      }
      if (repeatRecord.snapshots.some((snapshot) => !snapshot.compliant)) {
        repeatRecord.screenshotPaths.push(await captureFailureScreenshot(page, `repeat-${viewportId}-D`));
      }
      repeated.push(repeatRecord);
    }
  } finally {
    if (page && preferenceState) {
      try {
        preferencesRestored = await page.evaluate((before) => {
          for (const [key, state] of Object.entries(before.storage)) {
            if (state.exists) localStorage.setItem(key, state.value);
            else localStorage.removeItem(key);
          }
          if (before.themeAttribute === null) document.documentElement.removeAttribute('data-theme');
          else document.documentElement.setAttribute('data-theme', before.themeAttribute);
          document.querySelector('.main-layout')?.classList.toggle('sidebar-collapsed', before.layoutCollapsed);
          return Object.entries(before.storage).every(([key, state]) => (
            Object.prototype.hasOwnProperty.call(localStorage, key) === state.exists
            && localStorage.getItem(key) === state.value
          )) && document.documentElement.getAttribute('data-theme') === before.themeAttribute
            && document.querySelector('.main-layout')?.classList.contains('sidebar-collapsed') === before.layoutCollapsed;
        }, preferenceState);
      } catch (_error) {
        preferencesRestored = false;
      }
    }
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    await closeServer(server?.server);
  }
  screenshots.push(...matrix.flatMap((item) => item.screenshotPaths), ...stability.flatMap((item) => item.screenshotPaths), ...repeated.flatMap((item) => item.screenshotPaths));
  return { matrix, stability, repeated, consoleErrors, pageErrors, requestFailures, screenshots, preferencesRestored };
}

function caseId(reportNumber, index) {
  return `UMLI-${String(reportNumber).padStart(2, '0')}-CASE-${String(index).padStart(3, '0')}`;
}

function summarizeSnapshots(snapshots) {
  const failures = snapshots.filter((snapshot) => !snapshot.compliant);
  return {
    samples: snapshots.length,
    conformingSamples: snapshots.length - failures.length,
    nonConformingSamples: failures.length,
    issueCodes: Array.from(new Set(failures.flatMap((snapshot) => snapshot.issues))).sort(),
    failingSnapshots: failures.slice(0, 6),
  };
}

function makeCase(reportNumber, index, expected, records) {
  const snapshots = records.flatMap((record) => record.snapshots);
  const summary = summarizeSnapshots(snapshots);
  return {
    caseId: caseId(reportNumber, index),
    assertionExercised: snapshots.length > 0,
    compliant: snapshots.length > 0 && summary.nonConformingSamples === 0,
    expected,
    observed: {
      ...summary,
      viewports: Array.from(new Set(records.map((record) => record.viewportId))),
      screenshotPaths: Array.from(new Set(records.flatMap((record) => record.screenshotPaths))),
    },
  };
}

function moduleCases(reportNumber, matrix, state) {
  return VIEWPORTS.map((viewport, index) => {
    const viewportId = `${viewport.width}x${viewport.height}`;
    const source = matrix.filter((record) => record.viewportId === viewportId).map((record) => ({
      ...record,
      snapshots: record.snapshots.filter((snapshot) => snapshot.state === state),
    })).filter((record) => record.snapshots.length);
    return makeCase(reportNumber, index + 1, {
      viewport, moduleActive: state, exclusiveVisibleModule: true, functionalContentVisible: true,
      noOverlap: true, noClipping: true, noHorizontalOverflow: true,
    }, source);
  });
}

function viewportGroupCases(reportNumber, matrix, viewportIds) {
  return viewportIds.map((viewportId, index) => makeCase(reportNumber, index + 1, {
    viewportId, allSequences: ['A', 'B', 'C', 'D'], scrollModes: SCROLL_MODES,
    exclusiveModules: true, stableGeometry: true, noHorizontalOverflow: true,
  }, matrix.filter((record) => record.viewportId === viewportId)));
}

function buildCases(snapshot) {
  const allViewportIds = VIEWPORTS.map((item) => `${item.width}x${item.height}`);
  return {
    'UMLI-01': moduleCases(1, snapshot.matrix, 'shortcircuit'),
    'UMLI-02': moduleCases(2, snapshot.matrix, 'cabling-bt'),
    'UMLI-03': moduleCases(3, snapshot.matrix, 'cabling-mt'),
    'UMLI-04': moduleCases(4, snapshot.matrix, 'impedances'),
    'UMLI-05': allViewportIds.map((viewportId, index) => makeCase(5, index + 1, {
      viewportId, inactiveContainerDisplayNoneOrNoVisibleDescendant: true,
    }, snapshot.matrix.filter((record) => record.viewportId === viewportId).map((record) => ({
      ...record,
      snapshots: record.snapshots.map((item) => ({
        ...item,
        compliant: item.inactiveVisibleDescendantCount === 0,
        issues: item.inactiveVisibleDescendantCount === 0 ? [] : ['INACTIVE_DESCENDANTS_VISIBLE'],
      })),
    })))),
    'UMLI-06': viewportGroupCases(6, snapshot.matrix, ['1920x1080', '1440x900', '1280x800']),
    'UMLI-07': viewportGroupCases(7, snapshot.matrix, ['1200x800', '1199x800']),
    'UMLI-08': viewportGroupCases(8, snapshot.matrix, ['1024x768', '1023x768']),
    'UMLI-09': viewportGroupCases(9, snapshot.matrix, ['900x800', '899x800']),
    'UMLI-10': viewportGroupCases(10, snapshot.matrix, ['768x1024', '390x844', '375x812']),
    'UMLI-11': snapshot.stability.map((record, index) => makeCase(11, index + 1, {
      viewportId: record.viewportId, languages: LANGUAGES, themes: THEMES,
      sidebarStates: SIDEBAR_STATES, scrollModes: SCROLL_MODES, geometryInvariant: true,
    }, [record])),
    'UMLI-12': snapshot.repeated.map((record, index) => makeCase(12, index + 1, {
      viewportId: record.viewportId, sequence: 'D', cycles: 3,
      noResidualContent: true, noAccumulatedGeometryDrift: true,
    }, [record])),
  };
}

function buildReports(casesById, telemetry) {
  return IDS.map((id) => {
    const cases = casesById[id] || [];
    const assertionExercised = cases.length > 0 && cases.every((item) => item.assertionExercised);
    const compliant = assertionExercised && cases.every((item) => item.compliant)
      && telemetry.consoleErrors.length === 0 && telemetry.pageErrors.length === 0
      && telemetry.preferencesRestored === true;
    const failures = cases.filter((item) => !item.compliant);
    return {
      id,
      classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
      compliant,
      assertionExercised,
      expected: { category: CATEGORY, allCasesConform: true, consoleErrors: [], pageErrors: [], preferencesRestored: true },
      observed: {
        category: CATEGORY, cases: cases.length, conformingCases: cases.length - failures.length,
        nonConformingCases: failures.length, issueCodes: Array.from(new Set(failures.flatMap((item) => item.observed.issueCodes))).sort(),
      },
      cases,
      geometry: {
        nominal: true,
        sampledViewports: Array.from(new Set(cases.flatMap((item) => item.observed.viewports))),
        failingSamples: failures.reduce((sum, item) => sum + item.observed.nonConformingSamples, 0),
      },
      viewport: Array.from(new Set(cases.flatMap((item) => item.observed.viewports))),
      moduleActive: id === 'UMLI-01' ? 'shortcircuit' : id === 'UMLI-02' ? 'cabling-bt'
        : id === 'UMLI-03' ? 'cabling-mt' : id === 'UMLI-04' ? 'impedances' : 'multiple',
      modulesVisible: Array.from(new Set(cases.flatMap((item) => item.observed.failingSnapshots.flatMap((sample) => sample.modulesVisible || [])))),
      domPathsVerified: DOM_PATHS,
      consoleErrors: telemetry.consoleErrors,
      pageErrors: telemetry.pageErrors,
    };
  });
}

function blockedReports(classification, error) {
  return IDS.map((id) => ({
    id, classification, compliant: false, assertionExercised: false,
    expected: { category: CATEGORY, allCasesConform: true, consoleErrors: [], pageErrors: [], preferencesRestored: true },
    observed: { category: CATEGORY, reason: classification === 'INFRA_BLOCKED' ? 'chromium_preflight_failed' : 'harness_error', error: serializeError(error) },
    cases: [], geometry: { nominal: false, sampledViewports: [], failingSamples: 0 }, viewport: [],
    moduleActive: 'not_exercised', modulesVisible: [], domPathsVerified: DOM_PATHS, consoleErrors: [], pageErrors: [],
  }));
}

function validateProtocol(reports, classification) {
  const reportKeys = ['id', 'classification', 'compliant', 'assertionExercised', 'expected', 'observed', 'cases', 'geometry', 'viewport', 'moduleActive', 'modulesVisible', 'domPathsVerified', 'consoleErrors', 'pageErrors'];
  const caseKeys = ['caseId', 'assertionExercised', 'compliant', 'expected', 'observed'];
  if (reports.length !== 12 || !isDeepStrictEqual(reports.map((item) => item.id), IDS)) return false;
  if (new Set(reports.map((item) => item.id)).size !== 12) return false;
  if (reports.some((report) => !isDeepStrictEqual(Object.keys(report), reportKeys))) return false;
  const cases = reports.flatMap((report) => report.cases);
  if (classification === 'INFRA_BLOCKED' || classification === 'CONFIG_ERROR') {
    return cases.length === 0 && reports.every((report) => report.assertionExercised === false);
  }
  return cases.length > 0 && new Set(cases.map((item) => item.caseId)).size === cases.length
    && cases.every((item) => isDeepStrictEqual(Object.keys(item), caseKeys) && item.assertionExercised === true)
    && reports.every((report) => report.assertionExercised === true);
}

function makeSummary(classification, reports, preflight, evidence, functionalError = null) {
  const cases = reports.flatMap((report) => report.cases || []);
  const compliant = reports.filter((report) => report.compliant).length;
  return {
    classification,
    reports: reports.length,
    expectedReports: 12,
    cases: cases.length,
    uniqueCaseIds: new Set(cases.map((item) => item.caseId)).size,
    compliant,
    nonCompliant: reports.length - compliant,
    assertionsExercised: reports.filter((report) => report.assertionExercised).length,
    caseAssertionsExercised: cases.filter((item) => item.assertionExercised).length,
    preflightExitCode: preflight?.exitCode ?? (classification === 'INFRA_BLOCKED' ? 2 : 0),
    processExitCode: { PASS: 0, FUNCTIONAL_FAILURE: 1, INFRA_BLOCKED: 2, CONFIG_ERROR: 3 }[classification],
    evidence,
    functionalError: functionalError ? serializeError(functionalError) : null,
  };
}

function emit(reports, summary) {
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify(summary)}\n`);
}

function writeEvidence(snapshot, summary, preflight) {
  const geometryPath = path.join(EVIDENCE_DIR, 'geometry-by-viewport.json');
  const summaryPath = path.join(EVIDENCE_DIR, 'summary.json');
  const environmentPath = path.join(EVIDENCE_DIR, 'environment.json');
  fs.writeFileSync(geometryPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  fs.writeFileSync(environmentPath, `${JSON.stringify({
    node: process.version, platform: process.platform, arch: process.arch,
    chromium: preflight?.browserVersion || null, startedFrom: ROOT, evidenceDirectory: EVIDENCE_DIR,
  }, null, 2)}\n`, 'utf8');
  return {
    evidenceDirectory: EVIDENCE_DIR,
    geometry: { path: geometryPath, bytes: fs.statSync(geometryPath).size, sha256: sha256File(geometryPath) },
    summary: { path: summaryPath, selfHashEmbedded: false },
    environment: { path: environmentPath, bytes: fs.statSync(environmentPath).size, sha256: sha256File(environmentPath) },
    screenshots: snapshot.screenshots.map((filePath) => ({ path: filePath, bytes: fs.statSync(filePath).size, sha256: sha256File(filePath) })),
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
    const casesById = buildCases(snapshot);
    let reports = buildReports(casesById, {
      consoleErrors: snapshot.consoleErrors,
      pageErrors: snapshot.pageErrors,
      preferencesRestored: snapshot.preferencesRestored,
    });
    let classification = reports.every((report) => report.compliant) ? 'PASS' : 'FUNCTIONAL_FAILURE';
    if (!validateProtocol(reports, classification)) {
      classification = 'CONFIG_ERROR';
      reports = blockedReports('CONFIG_ERROR', new Error('Protocolo UMLI incompleto, duplicado ou inválido.'));
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

module.exports = { IDS, VIEWPORTS, SEQUENCES, validateProtocol };
