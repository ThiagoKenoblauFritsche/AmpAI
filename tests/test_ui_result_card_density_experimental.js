/**
 * AMP-UI-MODULE-LAYOUT-003 — RED visual experimental de densidade dos cards.
 *
 * Exercita a página HTTP, o Chromium, os motores, os renderers e as funções
 * públicas reais. Não substitui, envolve ou recalcula qualquer resultado.
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
const REPORT_PREFIX = 'AMP_UI_RESULT_CARD_DENSITY_EXP_REPORT';
const SUMMARY_PREFIX = 'AMP_UI_RESULT_CARD_DENSITY_EXP_SUMMARY';
const CATEGORY = 'ui_result_card_density_experimental';
const IDS = Array.from({ length: 10 }, (_unused, index) => `RCD-${String(index + 1).padStart(2, '0')}`);
const EXPECTED_REPORTS = 10;
const EXPECTED_CASES = 30;
const CASE_DISTRIBUTION = Object.freeze(Object.fromEntries(IDS.map((id) => [id, 3])));
const VIEWPORTS = Object.freeze([
  [1920, 1080], [1600, 900], [1366, 768], [768, 1024], [390, 844], [375, 812],
].map(([width, height]) => ({ width, height, deviceScaleFactor: 1 })));
const MODULES = Object.freeze(['bt', 'mt']);
const THEMES = Object.freeze(['light', 'dark']);
const LANGUAGES = Object.freeze(['pt', 'en', 'es']);
const STORAGE_KEYS = Object.freeze([
  'ampai-active-module', 'ampai-active-cabling-card', 'ampai-theme', 'ampai-lang', 'sidebarCollapsed',
]);
const MIME_TYPES = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
});
const EVIDENCE_DIR = path.resolve(process.env.AMP_UI_RESULT_CARD_DENSITY_EVIDENCE_DIR || path.join(
  os.tmpdir(),
  'AmpAI-QA',
  'AMP-UI-MODULE-LAYOUT-003-QA-RED-RESULT-CARD-DENSITY-R1',
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
    await page.goto('data:text/html,<title>RCD preflight</title><main>ok</main>', { waitUntil: 'load' });
    const exercised = await page.evaluate(() => document.querySelector('main')?.textContent === 'ok');
    if (!exercised) throw new Error('Chromium não executou a assertion do preflight RCD.');
    return { exitCode: 0, browserVersion: await browser.version() };
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

async function waitForRuntime(page) {
  await page.waitForFunction(() => document.readyState !== 'loading'
    && typeof window.switchModule === 'function'
    && typeof window.switchCablingCard === 'function'
    && typeof window.calculateCablingBT === 'function'
    && typeof window.calculateCablingMT === 'function'
    && typeof window.renderCardBT === 'function'
    && typeof window.renderCardMT === 'function'
    && typeof window.setLanguage === 'function', { timeout: 15000 });
}

async function settle(page, milliseconds = 460) {
  await page.evaluate((delay) => new Promise((resolve) => {
    let frames = 14;
    const next = () => (frames-- <= 0 ? setTimeout(resolve, delay) : requestAnimationFrame(next));
    requestAnimationFrame(next);
  }), milliseconds);
}

async function runtimeFacts(page) {
  const facts = await page.evaluate(() => {
    const source = (value) => (typeof value === 'function' ? Function.prototype.toString.call(value) : null);
    return {
      url: location.href,
      readyState: document.readyState,
      mainLayoutPresent: Boolean(document.querySelector('.main-layout')),
      switchModuleType: typeof window.switchModule,
      switchCablingCardType: typeof window.switchCablingCard,
      calculateBTType: typeof window.calculateCablingBT,
      calculateMTType: typeof window.calculateCablingMT,
      renderBTType: typeof window.renderCardBT,
      renderMTType: typeof window.renderCardMT,
      readBTType: typeof window.readBTInputsFromUI,
      readMTType: typeof window.readMTInputsFromUI,
      sources: {
        switchModule: source(window.switchModule),
        switchCablingCard: source(window.switchCablingCard),
        calculateBT: source(window.calculateCablingBT),
        calculateMT: source(window.calculateCablingMT),
        renderBT: source(window.renderCardBT),
        renderMT: source(window.renderCardMT),
      },
    };
  });
  return {
    ...facts,
    sourceHashes: Object.fromEntries(Object.entries(facts.sources).map(([key, value]) => [
      key, value ? sha256Buffer(value) : null,
    ])),
  };
}

function matrixSpecs() {
  const specs = [];
  for (const viewport of VIEWPORTS) {
    for (const moduleName of MODULES) {
      for (const theme of THEMES) {
        specs.push({
          id: `matrix-${viewport.width}x${viewport.height}-${moduleName}-${theme}-pt`,
          viewport,
          module: moduleName,
          theme,
          language: 'pt',
          matrix: 'viewport-module-theme',
        });
      }
    }
  }
  for (const language of LANGUAGES) {
    for (const moduleName of MODULES) {
      specs.push({
        id: `locale-1600x900-${moduleName}-light-${language}`,
        viewport: { width: 1600, height: 900, deviceScaleFactor: 1 },
        module: moduleName,
        theme: 'light',
        language,
        matrix: 'locale-focal',
      });
    }
  }
  return specs;
}

async function setProductiveState(page, spec) {
  await page.setViewport(spec.viewport);
  await page.evaluate(async (state) => {
    const frames = (count) => new Promise((resolve) => {
      const next = () => (count-- <= 0 ? resolve() : requestAnimationFrame(next));
      requestAnimationFrame(next);
    });
    if (typeof window.setLanguage !== 'function') throw new Error('setLanguage produtivo indisponível.');
    if (typeof window.switchModule !== 'function') throw new Error('switchModule produtivo indisponível.');
    if (typeof window.switchCablingCard !== 'function') throw new Error('switchCablingCard produtivo indisponível.');
    window.setLanguage(state.language);
    const lightNow = document.documentElement.hasAttribute('data-theme');
    if ((state.theme === 'light') !== lightNow) {
      const toggle = document.querySelector('#theme-toggle');
      if (!toggle) throw new Error('Controle produtivo de tema ausente.');
      toggle.click();
    }
    window.switchModule('cabling');
    window.switchCablingCard(state.module);
    await frames(12);
    const calculateButton = document.querySelector(state.module === 'bt' ? '#btn-bt' : '#btn-mt');
    if (!calculateButton) throw new Error(`Botão produtivo de cálculo ${state.module.toUpperCase()} ausente.`);
    calculateButton.click();
    await frames(18);
  }, spec);
  await settle(page, spec.module === 'mt' ? 700 : 420);
  await page.waitForFunction((moduleName) => {
    const root = document.querySelector(moduleName === 'bt' ? '#card-bt' : '#card-mt');
    const grid = root?.querySelector('.results-grid');
    return Boolean(grid && grid.querySelectorAll('.result-card').length >= 3
      && window.isRendering !== true && !window._pendingInject);
  }, { timeout: 15000 }, spec.module);
  await page.evaluate(() => scrollTo(0, 0));
  await settle(page, 80);
}

async function auditResultGrid(page, spec) {
  return page.evaluate((state) => {
    const round = (value) => Number(Number(value || 0).toFixed(3));
    const rectOf = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        left: round(rect.left), top: round(rect.top), right: round(rect.right), bottom: round(rect.bottom),
        width: round(rect.width), height: round(rect.height),
        absoluteTop: round(rect.top + scrollY), absoluteBottom: round(rect.bottom + scrollY),
      };
    };
    const rendered = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > 0.001
        && element.getClientRects().length > 0 && rect.width > 0.5 && rect.height > 0.5;
    };
    const intersectionArea = (left, right) => {
      if (!left || !right) return 0;
      const width = Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left));
      const height = Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));
      return round(width * height);
    };
    const uniquePositions = (values, tolerance = 3) => values.reduce((result, value) => {
      if (!result.some((existing) => Math.abs(existing - value) <= tolerance)) result.push(value);
      return result;
    }, []);
    const normalizeNumericText = (value) => String(value || '')
      .replace(/(\d),(\d)/g, '$1.$2')
      .replace(/\s+/g, ' ')
      .trim();
    const moduleRoot = document.querySelector('#module-cabling');
    const wrapper = document.querySelector(state.module === 'bt' ? '#wrapper-bt' : '#wrapper-mt');
    const inactiveWrapper = document.querySelector(state.module === 'bt' ? '#wrapper-mt' : '#wrapper-bt');
    const resultRoot = document.querySelector(state.module === 'bt' ? '#card-bt' : '#card-mt');
    const formRoot = wrapper?.querySelector('aside');
    const grid = resultRoot?.querySelector('.results-grid');
    const cards = Array.from(grid?.querySelectorAll(':scope > .result-card') || []);
    const header = document.querySelector('#module-cabling > div:first-child');
    const nav = document.querySelector('.nav-sidebar');
    const sidebar = document.querySelector('aside.sidebar');
    const gridRect = rectOf(grid);
    const headerRect = rectOf(header);
    const containerRect = rectOf(resultRoot);
    const formRect = rectOf(formRoot);
    const navRect = rectOf(nav);
    const sidebarRect = rectOf(sidebar);
    const cardFacts = cards.map((card, index) => {
      const rect = rectOf(card);
      const style = getComputedStyle(card);
      const title = card.querySelector('.result-title');
      const value = card.querySelector('.result-value');
      const unit = card.querySelector('.result-unit');
      const description = card.querySelector('.result-desc');
      const textElements = [title, value, unit, description].filter(Boolean);
      const textClipping = textElements.map((element) => {
        const elementStyle = getComputedStyle(element);
        const elementRect = rectOf(element);
        return {
          tag: element.className || element.tagName.toLowerCase(),
          text: element.textContent.trim(),
          rect: elementRect,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
          overflowX: elementStyle.overflowX,
          overflowY: elementStyle.overflowY,
          textOverflow: elementStyle.textOverflow,
          clippedHorizontally: element.scrollWidth > element.clientWidth + 1,
          hiddenOrEllipsized: ['hidden', 'clip'].includes(elementStyle.overflowX)
            || elementStyle.textOverflow === 'ellipsis',
        };
      });
      return {
        index,
        rect,
        rendered: rendered(card),
        classes: Array.from(card.classList).sort(),
        position: style.position,
        backgroundColor: style.backgroundColor,
        borderTopColor: style.borderTopColor,
        scrollWidth: card.scrollWidth,
        clientWidth: card.clientWidth,
        scrollHeight: card.scrollHeight,
        clientHeight: card.clientHeight,
        title: title?.textContent.trim() || '',
        value: value?.textContent.trim() || '',
        normalizedValue: normalizeNumericText(value?.textContent),
        unit: unit?.textContent.trim() || '',
        description: description?.textContent.trim() || '',
        textClipping,
      };
    });
    const lefts = uniquePositions(cardFacts.map((card) => card.rect?.left).filter(Number.isFinite)).sort((a, b) => a - b);
    const tops = uniquePositions(cardFacts.map((card) => card.rect?.top).filter(Number.isFinite)).sort((a, b) => a - b);
    const firstTop = tops[0] ?? null;
    const firstRow = cardFacts.filter((card) => firstTop !== null && Math.abs(card.rect.top - firstTop) <= 4)
      .sort((left, right) => left.rect.left - right.rect.left);
    const horizontalGaps = firstRow.slice(1).map((card, index) => round(card.rect.left - firstRow[index].rect.right));
    const rowHeights = tops.map((top) => Math.max(...cardFacts.filter((card) => Math.abs(card.rect.top - top) <= 4)
      .map((card) => card.rect.height)));
    const verticalGaps = tops.slice(1).map((top, index) => round(top - tops[index] - rowHeights[index]));
    const allGaps = [...horizontalGaps, ...verticalGaps].filter(Number.isFinite);
    const maxGapDeviation = allGaps.length > 1 ? round(Math.max(...allGaps) - Math.min(...allGaps)) : 0;
    const ratios = cardFacts.map((card) => gridRect?.width > 0 ? round(card.rect.width / gridRect.width) : null);
    const maxWidthRatio = ratios.filter(Number.isFinite).length ? Math.max(...ratios.filter(Number.isFinite)) : null;
    const cardOverlaps = [];
    for (let leftIndex = 0; leftIndex < cardFacts.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < cardFacts.length; rightIndex += 1) {
        const area = intersectionArea(cardFacts[leftIndex].rect, cardFacts[rightIndex].rect);
        if (area > 1) cardOverlaps.push({ leftIndex, rightIndex, area });
      }
    }
    const externalOverlaps = cardFacts.flatMap((card) => [
      ['nav', navRect], ['sidebar', sidebarRect], ['form', formRect],
    ].map(([target, rect]) => ({ cardIndex: card.index, target, area: intersectionArea(card.rect, rect) })))
      .filter((item) => item.area > 1);
    const textClipping = cardFacts.flatMap((card) => card.textClipping.map((item) => ({ cardIndex: card.index, ...item })))
      .filter((item) => item.clippedHorizontally || item.hiddenOrEllipsized);
    const invalidTokens = cardFacts.flatMap((card) => [card.title, card.value, card.unit, card.description])
      .filter((value) => /\b(?:undefined|nan)\b/i.test(value));
    const mobile = state.viewport.width <= 768;
    const wide = state.viewport.width >= 1600;
    const intermediate = state.viewport.width === 1366;
    const documentMetrics = {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
    };
    const themeIsLight = document.documentElement.hasAttribute('data-theme');
    const activeLanguage = localStorage.getItem('ampai-lang');
    const checks = {
      realPageAndGrid: Boolean(moduleRoot && wrapper && resultRoot && grid && rendered(grid)),
      realCalculationRendered: cards.length >= 3 && cardFacts.every((card) => card.rendered),
      wideFirstRowAtLeastThree: !wide || firstRow.length >= 3,
      wideAtLeastThreeHorizontalPositions: !wide || lefts.length >= 3,
      wideMaximumCardRatio: !wide || (maxWidthRatio !== null && maxWidthRatio <= 0.45),
      wideNotAllFullWidth: !wide || !ratios.every((ratio) => ratio !== null && ratio >= 0.9),
      intermediateAtLeastTwoColumns: !intermediate || lefts.length >= 2,
      intermediateMaximumCardRatio: !intermediate || (maxWidthRatio !== null && maxWidthRatio <= 0.60),
      regularAlignmentAndGaps: maxGapDeviation <= 4,
      contentComplete: cardFacts.every((card) => card.title && card.value && card.unit && card.description),
      noTextClipping: textClipping.length === 0,
      noCardOverflow: cardFacts.every((card) => card.scrollWidth <= card.clientWidth + 1),
      noDocumentHorizontalOverflow: documentMetrics.scrollWidth <= documentMetrics.clientWidth + 1,
      noCardOverlap: cardOverlaps.length === 0,
      noExternalOverlap: externalOverlaps.length === 0,
      firstResultsNearHeader: Boolean(gridRect && headerRect && gridRect.top >= headerRect.bottom - 1
        && gridRect.top - headerRect.bottom <= 64 && gridRect.top < innerHeight),
      mobileContained: !mobile || cardFacts.every((card) => Boolean(containerRect
        && card.rect.left >= containerRect.left - 1 && card.rect.right <= containerRect.right + 1)),
      normalScrollReachability: cardFacts.every((card) => card.position !== 'fixed'
        && card.rect.absoluteTop >= (gridRect?.absoluteTop || 0) - 1
        && card.rect.absoluteBottom <= documentMetrics.scrollHeight + 1),
      languageApplied: activeLanguage === state.language,
      themeApplied: (state.theme === 'light') === themeIsLight,
      activeModuleIsolated: rendered(wrapper) && !rendered(inactiveWrapper),
      semanticCardCount: cards.length === (state.module === 'bt' ? 4 : 5),
      zeroInvalidTokens: invalidTokens.length === 0,
    };
    return {
      spec: state,
      checks,
      geometry: {
        viewport: { width: innerWidth, height: innerHeight },
        gridRect,
        containerRect,
        headerRect,
        formRect,
        gridTemplateColumns: grid ? getComputedStyle(grid).gridTemplateColumns : null,
        gridColumnGap: grid ? getComputedStyle(grid).columnGap : null,
        gridRowGap: grid ? getComputedStyle(grid).rowGap : null,
        columns: lefts.length,
        horizontalPositions: lefts,
        rowPositions: tops,
        firstRowCards: firstRow.length,
        cardWidthRatios: ratios,
        maxWidthRatio,
        horizontalGaps,
        verticalGaps,
        maxGapDeviation,
        documentMetrics,
      },
      cards: cardFacts,
      semantic: cardFacts.map((card) => ({
        index: card.index,
        classes: card.classes,
        normalizedValue: card.normalizedValue,
        unit: card.unit,
      })),
      diagnostics: { cardOverlaps, externalOverlaps, textClipping, invalidTokens },
    };
  }, spec);
}

async function captureScreenshot(page, sampleId, stage, fullPage) {
  const fileName = `${sampleId}-${stage}${fullPage ? '-full' : '-focal'}.png`.replace(/[^a-zA-Z0-9_.-]+/g, '_');
  const filePath = path.join(EVIDENCE_DIR, 'screenshots', fileName);
  await page.screenshot({ path: filePath, fullPage });
  return { stage, fullPage, path: filePath, bytes: fs.statSync(filePath).size, sha256: sha256File(filePath) };
}

async function executeSample(page, spec) {
  await setProductiveState(page, spec);
  const audit = await auditResultGrid(page, spec);
  const screenshots = [
    await captureScreenshot(page, spec.id, 'result-cards', false),
    await captureScreenshot(page, spec.id, 'document', true),
  ];
  return { ...spec, audit, screenshots };
}

async function auditPrintAndFocus(page) {
  const modules = [];
  for (const moduleName of MODULES) {
    const spec = {
      id: `preservation-${moduleName}`,
      viewport: { width: 1600, height: 900, deviceScaleFactor: 1 },
      module: moduleName,
      theme: 'light',
      language: 'pt',
    };
    await setProductiveState(page, spec);
    const screen = await page.evaluate((name) => {
      const root = document.querySelector(name === 'bt' ? '#card-bt' : '#card-mt');
      const ids = name === 'bt'
        ? ['btn-memorial-bt', 'btn-export-memorial-bt']
        : ['btn-memorial-mt', 'btn-export-memorial-mt'];
      const memorial = document.getElementById(ids[0]);
      if (memorial?.getAttribute('aria-expanded') !== 'true') memorial?.click();
      const controls = ids.map((id) => {
        const element = document.getElementById(id);
        element?.focus();
        return {
          id,
          exists: Boolean(element),
          disabled: Boolean(element?.disabled),
          tabindex: element?.getAttribute('tabindex'),
          focused: document.activeElement === element,
        };
      });
      return {
        cardCount: root?.querySelectorAll('.results-grid > .result-card').length || 0,
        controls,
        printButtonPresent: controls.some((control) => control.id.includes('export') && control.exists),
      };
    }, moduleName);
    await page.emulateMediaType('print');
    const print = await page.evaluate((name) => {
      const root = document.querySelector(name === 'bt' ? '#card-bt' : '#card-mt');
      const cards = Array.from(root?.querySelectorAll('.results-grid > .result-card') || []);
      return {
        cardCount: cards.length,
        renderedCards: cards.filter((card) => {
          const style = getComputedStyle(card);
          const rect = card.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        }).length,
        texts: cards.map((card) => card.innerText.trim()),
      };
    }, moduleName);
    await page.emulateMediaType('screen');
    modules.push({ module: moduleName, screen, print });
  }
  return modules;
}

function semanticKey(sample) {
  return JSON.stringify(sample.audit.semantic);
}

function annotateSemanticStability(samples) {
  const reference = Object.fromEntries(MODULES.map((moduleName) => {
    const sample = samples.find((item) => item.module === moduleName && item.language === 'pt' && item.theme === 'light');
    return [moduleName, sample ? semanticKey(sample) : null];
  }));
  for (const sample of samples) {
    sample.audit.checks.semanticOrderValuesUnitsStable = reference[sample.module] !== null
      && semanticKey(sample) === reference[sample.module];
  }
  return reference;
}

function makeCaseId(reportId, index) {
  return `${reportId}-CASE-${String(index).padStart(2, '0')}`;
}

function sampleCase(reportId, index, sequence, samples, requiredChecks, expected = {}) {
  const selected = samples.filter((sample) => sample.selected === true);
  const assertionExercised = selected.length > 0
    && requiredChecks.length > 0
    && selected.every((sample) => requiredChecks.every((key) => typeof sample.audit.checks[key] === 'boolean'));
  const failures = selected.flatMap((sample) => requiredChecks
    .filter((key) => sample.audit.checks[key] !== true)
    .map((key) => ({ sampleId: sample.id, check: key, observed: sample.audit.checks[key], geometry: sample.audit.geometry })));
  return {
    caseId: makeCaseId(reportId, index),
    sequence,
    assertionExercised,
    compliant: assertionExercised && failures.length === 0,
    expected: {
      samples: selected.map((sample) => sample.id),
      requiredChecks,
      allChecksTrue: true,
      ...expected,
    },
    observed: {
      samples: selected.map((sample) => ({
        id: sample.id,
        checks: Object.fromEntries(requiredChecks.map((key) => [key, sample.audit.checks[key]])),
        geometry: sample.audit.geometry,
        cards: sample.audit.cards,
        diagnostics: sample.audit.diagnostics,
      })),
      failures,
    },
    screenshots: selected.flatMap((sample) => sample.screenshots),
  };
}

function directCase(reportId, index, sequence, checks, expected, observed, screenshots = []) {
  const assertionExercised = Object.keys(checks).length > 0 && Object.values(checks).every((value) => typeof value === 'boolean');
  return {
    caseId: makeCaseId(reportId, index),
    sequence,
    assertionExercised,
    compliant: assertionExercised && Object.values(checks).every(Boolean),
    expected,
    observed: { checks, ...observed },
    screenshots,
  };
}

function select(samples, predicate) {
  return samples.map((sample) => ({ ...sample, selected: predicate(sample) }));
}

function buildCases(snapshot) {
  const { samples, printFocus, runtimeBefore, runtimeAfter, restoration, consoleErrors, pageErrors } = snapshot;
  const casesById = Object.fromEntries(IDS.map((id) => [id, []]));
  const densityWide = [
    'realPageAndGrid', 'realCalculationRendered', 'wideFirstRowAtLeastThree',
    'wideAtLeastThreeHorizontalPositions', 'wideMaximumCardRatio', 'wideNotAllFullWidth',
  ];
  const densityIntermediate = [
    'realPageAndGrid', 'realCalculationRendered', 'intermediateAtLeastTwoColumns',
    'intermediateMaximumCardRatio', 'noDocumentHorizontalOverflow', 'firstResultsNearHeader',
  ];
  const regularity = ['regularAlignmentAndGaps', 'noCardOverlap', 'noExternalOverlap', 'contentComplete', 'noTextClipping'];
  const mobile = [
    'realPageAndGrid', 'realCalculationRendered', 'mobileContained', 'noDocumentHorizontalOverflow',
    'noCardOverflow', 'noTextClipping', 'noCardOverlap', 'noExternalOverlap', 'normalScrollReachability',
  ];
  const locale = [
    'languageApplied', 'themeApplied', 'contentComplete', 'zeroInvalidTokens',
    'semanticCardCount', 'semanticOrderValuesUnitsStable', 'noTextClipping',
  ];

  casesById['RCD-01'].push(
    sampleCase('RCD-01', 1, 'bt-1920-wide-density', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.module === 'bt' && s.viewport.width === 1920), densityWide, { minimumFirstRowCards: 3, maximumCardRatio: 0.45 }),
    sampleCase('RCD-01', 2, 'bt-1600-wide-density', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.module === 'bt' && s.viewport.width === 1600), densityWide, { minimumFirstRowCards: 3, maximumCardRatio: 0.45 }),
    sampleCase('RCD-01', 3, 'bt-wide-content-integrity', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.module === 'bt' && s.viewport.width >= 1600), regularity),
  );
  casesById['RCD-02'].push(
    sampleCase('RCD-02', 1, 'mt-1920-wide-density', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.module === 'mt' && s.viewport.width === 1920), densityWide, { minimumFirstRowCards: 3, maximumCardRatio: 0.45 }),
    sampleCase('RCD-02', 2, 'mt-1600-wide-density', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.module === 'mt' && s.viewport.width === 1600), densityWide, { minimumFirstRowCards: 3, maximumCardRatio: 0.45 }),
    sampleCase('RCD-02', 3, 'mt-wide-content-integrity', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.module === 'mt' && s.viewport.width >= 1600), regularity),
  );
  casesById['RCD-03'].push(
    sampleCase('RCD-03', 1, 'bt-1366-density', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.module === 'bt' && s.viewport.width === 1366), densityIntermediate, { minimumColumns: 2, maximumCardRatio: 0.60 }),
    sampleCase('RCD-03', 2, 'mt-1366-density', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.module === 'mt' && s.viewport.width === 1366), densityIntermediate, { minimumColumns: 2, maximumCardRatio: 0.60 }),
    sampleCase('RCD-03', 3, 'combined-1366-overflow-and-proximity', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width === 1366), [...densityIntermediate, 'noTextClipping', 'noExternalOverlap']),
  );
  casesById['RCD-04'].push(
    sampleCase('RCD-04', 1, 'wide-maximum-card-proportion', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width >= 1600), ['wideMaximumCardRatio'], { maximumCardRatio: 0.45 }),
    sampleCase('RCD-04', 2, 'intermediate-maximum-card-proportion', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width === 1366), ['intermediateMaximumCardRatio'], { maximumCardRatio: 0.60 }),
    sampleCase('RCD-04', 3, 'wide-never-integrally-full-width', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width >= 1600), ['wideNotAllFullWidth', 'wideAtLeastThreeHorizontalPositions']),
  );
  casesById['RCD-05'].push(
    sampleCase('RCD-05', 1, 'wide-regular-columns-and-gaps', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width >= 1600), regularity),
    sampleCase('RCD-05', 2, 'intermediate-regular-columns-and-gaps', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width === 1366), regularity),
    sampleCase('RCD-05', 3, 'desktop-alignment-all-modules-themes', select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width >= 1366), [...regularity, 'noDocumentHorizontalOverflow']),
  );
  for (const [reportId, width] of [['RCD-06', 768], ['RCD-07', 390], ['RCD-08', 375]]) {
    casesById[reportId].push(
      sampleCase(reportId, 1, `${width}-bt-contained`, select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width === width && s.module === 'bt'), mobile),
      sampleCase(reportId, 2, `${width}-mt-contained`, select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width === width && s.module === 'mt'), mobile),
      sampleCase(reportId, 3, `${width}-combined-themes-scroll`, select(samples, (s) => s.matrix === 'viewport-module-theme' && s.viewport.width === width), [...mobile, 'activeModuleIsolated']),
    );
  }
  for (const [index, language] of LANGUAGES.entries()) {
    casesById['RCD-09'].push(sampleCase(
      'RCD-09', index + 1, `locale-${language}-both-modules`,
      select(samples, (s) => s.viewport.width === 1600 && s.language === language),
      locale,
      { language, modules: MODULES, themesPreserved: true },
    ));
  }

  const printChecks = Object.fromEntries(printFocus.flatMap((item) => [
    [`${item.module}PrintCountPreserved`, item.print.cardCount === item.screen.cardCount && item.print.renderedCards === item.screen.cardCount],
    [`${item.module}PrintContentPreserved`, item.print.texts.length === item.screen.cardCount && item.print.texts.every(Boolean)],
  ]));
  const focusChecks = Object.fromEntries(printFocus.flatMap((item) => [
    [`${item.module}ControlsPresent`, item.screen.controls.every((control) => control.exists && !control.disabled && control.tabindex !== '-1')],
    [`${item.module}ControlsFocusable`, item.screen.controls.every((control) => control.focused)],
  ]));
  const sourcesStable = runtimeBefore && runtimeAfter
    && isDeepStrictEqual(runtimeBefore.sourceHashes, runtimeAfter.sourceHashes);
  casesById['RCD-10'].push(
    sampleCase('RCD-10', 1, 'semantic-order-values-units-and-isolation', select(samples, () => true), [
      'semanticCardCount', 'semanticOrderValuesUnitsStable', 'activeModuleIsolated', 'zeroInvalidTokens',
    ]),
    directCase('RCD-10', 2, 'print-and-keyboard-controls', { ...printChecks, ...focusChecks }, {
      printCardCountAndContentPreserved: true,
      memorialAndExportControlsPresentEnabledFocusable: true,
    }, { modules: printFocus }),
    directCase('RCD-10', 3, 'runtime-telemetry-and-storage-restoration', {
      productiveFunctionSourcesStable: Boolean(sourcesStable),
      storageRestorationAttempted: restoration.attempted === true,
      storageRestoredExactly: restoration.compliant === true,
      zeroConsoleErrors: consoleErrors.length === 0,
      zeroPageErrors: pageErrors.length === 0,
    }, {
      productiveFunctionSourcesStable: true,
      localStorageRestoredWithPresence: true,
      consoleErrors: [],
      pageErrors: [],
    }, { runtimeBefore, runtimeAfter, restoration, consoleErrors, pageErrors }),
  );
  return casesById;
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
  const samples = [];
  let printFocus = [];
  let runtimeBefore = null;
  let runtimeAfter = null;
  let semanticReference = null;
  try {
    server = await startStaticServer();
    browser = await puppeteer.launch({ headless: 'new', timeout: 30000 });
    page = await browser.newPage();
    await page.evaluateOnNewDocument((keys) => {
      window.__rcdPreBootStorage = Object.fromEntries(keys.map((key) => [key, {
        exists: Object.prototype.hasOwnProperty.call(localStorage, key),
        value: localStorage.getItem(key),
      }]));
    }, STORAGE_KEYS);
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(serializeError(error)));
    page.on('requestfailed', (request) => requestFailures.push({
      url: request.url(), errorText: request.failure()?.errorText || null,
    }));
    await page.goto(server.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await waitForRuntime(page);
    await settle(page, 700);
    originalStorage = await page.evaluate(() => window.__rcdPreBootStorage);
    runtimeBefore = await runtimeFacts(page);
    for (const spec of matrixSpecs()) samples.push(await executeSample(page, spec));
    semanticReference = annotateSemanticStability(samples);
    printFocus = await auditPrintAndFocus(page);
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
      }
    }
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    await closeServer(server?.server);
  }
  return {
    samples, printFocus, runtimeBefore, runtimeAfter, semanticReference,
    restoration, consoleErrors, pageErrors, requestFailures,
  };
}

function buildReports(snapshot) {
  const casesById = buildCases(snapshot);
  return IDS.map((id) => {
    const cases = casesById[id] || [];
    const assertionExercised = cases.length === CASE_DISTRIBUTION[id]
      && cases.every((item) => item.assertionExercised === true);
    const compliant = assertionExercised && cases.every((item) => item.compliant === true);
    const failures = cases.filter((item) => !item.compliant);
    return {
      id,
      category: CATEGORY,
      classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
      compliant,
      assertionExercised,
      expected: { cases: 3, allCasesConform: true },
      observed: {
        cases: cases.length,
        conformingCases: cases.length - failures.length,
        nonConformingCases: failures.length,
        failingCaseIds: failures.map((item) => item.caseId),
      },
      cases,
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
    expected: { cases: CASE_DISTRIBUTION[id], allCasesConform: true },
    observed: {
      cases: 0,
      conformingCases: 0,
      nonConformingCases: 0,
      failingCaseIds: [],
      reason: classification === 'INFRA_BLOCKED' ? 'chromium_preflight_failed' : 'harness_or_protocol_error',
      error: serializeError(error),
    },
    cases: [],
  }));
}

function validateProtocol(reports, classification) {
  const reportKeys = ['id', 'category', 'classification', 'compliant', 'assertionExercised', 'expected', 'observed', 'cases'];
  const caseKeys = ['caseId', 'sequence', 'assertionExercised', 'compliant', 'expected', 'observed', 'screenshots'];
  if (reports.length !== EXPECTED_REPORTS || !isDeepStrictEqual(reports.map((report) => report.id), IDS)) return false;
  if (new Set(reports.map((report) => report.id)).size !== EXPECTED_REPORTS) return false;
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
    storageRestored: reports.find((report) => report.id === 'RCD-10')?.cases?.[2]
      ?.observed?.checks?.storageRestoredExactly ?? null,
    evidence,
    functionalError: functionalError ? serializeError(functionalError) : null,
  };
}

function writeEvidence(snapshot, summary, preflight) {
  const samplesPath = path.join(EVIDENCE_DIR, 'result-card-density-samples.json');
  const storagePath = path.join(EVIDENCE_DIR, 'local-storage-lifecycle.json');
  const environmentPath = path.join(EVIDENCE_DIR, 'environment.json');
  const summaryPath = path.join(EVIDENCE_DIR, 'summary.json');
  fs.writeFileSync(samplesPath, `${JSON.stringify({
    samples: snapshot.samples,
    printFocus: snapshot.printFocus,
    runtimeBefore: snapshot.runtimeBefore,
    runtimeAfter: snapshot.runtimeAfter,
    semanticReference: snapshot.semanticReference,
  }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(storagePath, `${JSON.stringify(snapshot.restoration, null, 2)}\n`, 'utf8');
  fs.writeFileSync(environmentPath, `${JSON.stringify({
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    chromium: preflight?.browserVersion || null,
    root: ROOT,
    evidenceDirectory: EVIDENCE_DIR,
    matrix: { viewports: VIEWPORTS, modules: MODULES, themes: THEMES, languages: LANGUAGES },
  }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  const describe = (filePath) => ({ path: filePath, bytes: fs.statSync(filePath).size, sha256: sha256File(filePath) });
  return {
    evidenceDirectory: EVIDENCE_DIR,
    samples: describe(samplesPath),
    storage: describe(storagePath),
    environment: describe(environmentPath),
    summary: { path: summaryPath, selfHashEmbedded: false },
    screenshots: snapshot.samples.flatMap((sample) => sample.screenshots),
  };
}

function emit(reports, summary) {
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify(summary)}\n`);
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
      reports = blockedReports('CONFIG_ERROR', new Error('Protocolo RCD incompleto, duplicado ou inválido.'));
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

main().catch((error) => {
  const reports = blockedReports('CONFIG_ERROR', error);
  const summary = makeSummary('CONFIG_ERROR', reports, null, { evidenceDirectory: EVIDENCE_DIR }, error);
  emit(reports, summary);
  process.exitCode = 3;
});
