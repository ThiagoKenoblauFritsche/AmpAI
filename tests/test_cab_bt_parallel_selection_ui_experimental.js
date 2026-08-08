/**
 * O.S. CAB-BT-PARALLEL-002-QA-RED-UI-EXP
 *
 * RED visual experimental da interface prática de seleção paralela BT.
 * Abre a página real, observa apenas motores/envelopes reais e nunca cria UI,
 * substitui resultado ou reproduz fórmulas científicas.
 */
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const REPORT_PREFIX = 'CAB_BT_PARALLEL_SELECTION_UI_EXP_REPORT';
const SUMMARY_PREFIX = 'CAB_BT_PARALLEL_SELECTION_UI_EXP_SUMMARY';
const CATEGORY = 'visual_experimental';
const NOTICE = 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.';
const SELECTION_MODULE = path.join(ROOT, 'js', 'core_cabos_bt_parallel_selection_experimental.js');
const SELECTION_EXPORT = 'enumerateCablingBTParallelAlternativesExperimental';
const IDS = Array.from({ length: 15 }, (_unused, index) => `UI-${String(index + 1).padStart(2, '0')}`);
const OBJECTIVE_TOPS = {
  NONE: '2x185',
  MIN_PARALLEL_COUNT: '2x300',
  MIN_TOTAL_COPPER: '3x120',
  MAX_MINIMUM_MARGIN: '4x300',
};
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

const CONTRACTS = {
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

function resultReport(id, checks, observed) {
  const compliant = allTrue(checks);
  return {
    id,
    category: CATEGORY,
    classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
    compliant,
    assertionExercised: true,
    expected: CONTRACTS[id],
    observed: { checks, ...observed },
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
  }));
}

function protocolValid(reports) {
  return reports.length === IDS.length
    && new Set(reports.map((report) => report.id)).size === IDS.length
    && JSON.stringify(reports.map((report) => report.id)) === JSON.stringify(IDS)
    && reports.every((report) => report.category === CATEGORY
      && ['PASS', 'FUNCTIONAL_FAILURE', 'INFRA_BLOCKED', 'CONFIG_ERROR'].includes(report.classification)
      && typeof report.compliant === 'boolean'
      && typeof report.assertionExercised === 'boolean'
      && report.expected && typeof report.expected === 'object'
      && report.observed && typeof report.observed === 'object');
}

function classify(reports, preflightBlocked) {
  if (preflightBlocked) return 'INFRA_BLOCKED';
  if (!protocolValid(reports) || reports.some((report) => report.assertionExercised !== true)) return 'CONFIG_ERROR';
  return reports.every((report) => report.compliant) ? 'PASS' : 'FUNCTIONAL_FAILURE';
}

function exitCodeFor(classification) {
  return { PASS: 0, FUNCTIONAL_FAILURE: 1, INFRA_BLOCKED: 2, CONFIG_ERROR: 3 }[classification] ?? 3;
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

async function executeVisualScenario(puppeteer, nodeCore) {
  let server;
  let browser;
  let page;
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
      if (typeof originalSelection === 'function') {
        window.enumerateCablingBTParallelAlternativesExperimental = function observedSelectionEngine(input) {
          const result = originalSelection.apply(this, arguments);
          engineCalls.push(safeJson(input));
          engineEnvelopes.push(safeJson(result));
          return result;
        };
      }

      const objectiveRuns = [];
      for (const objective of Object.keys(objectives)) {
        if (!region || !practical.objective || !practical.action) {
          objectiveRuns.push({ objective, attempted: false, expectedTop: objectives[objective], observedTop: null, regionText: '' });
          continue;
        }
        setControl(practical.objective, objective);
        const callsBefore = engineCalls.length;
        practical.action.click();
        await waitFrames(12);
        await wait(120);
        const latest = engineEnvelopes[engineEnvelopes.length - 1] || null;
        const regionText = findRegion().element?.innerText || '';
        const observedTop = latest?.data?.firstInPresentationOrder?.candidateId
          || latest?.data?.presentationOrder?.[0]?.candidateId || null;
        objectiveRuns.push({
          objective,
          attempted: true,
          newEngineCalls: engineCalls.length - callsBefore,
          expectedTop: objectives[objective],
          observedTop,
          topVisible: observedTop ? candidateVisible(regionText, observedTop) : false,
          installationAuthorized: latest?.data?.installationAuthorized,
          installableSelection: latest?.data?.installableSelection,
          productionAllowed: latest?.productionAllowed,
        });
      }

      if (typeof originalSelection === 'function') {
        window.enumerateCablingBTParallelAlternativesExperimental = originalSelection;
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

    const locales = {};
    for (const language of ['pt', 'en', 'es']) {
      locales[language] = await page.evaluate(async ({ language, selectors, notice }) => {
        if (typeof window.setLanguage === 'function') window.setLanguage(language);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const region = selectors.map((selector) => document.querySelector(selector)).find(Boolean)
          || Array.from(document.querySelectorAll('section,[role="region"],article,.card')).find((candidate) => {
            const text = (candidate.innerText || '').toLowerCase();
            return text.includes('preliminar') && /(alternativ|paralel)/.test(text) && /(instal|install)/.test(text);
          }) || null;
        const normalizedText = String(region?.innerText || '').normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
        const forbiddenPatterns = {
          pt: [
            ['recommended', /\brecomendad[oa]\b/],
            ['selected', /\bselecionad[oa]\b/],
            ['final_solution', /solucao final/],
            ['iec_conformity', /conforme iec/],
            ['productive_release', /liberad[oa] para (?:projeto|compra|instalacao)/],
          ],
          en: [
            ['recommended', /\brecommended\b/],
            ['selected', /\bselected\b/],
            ['final_solution', /final solution/],
            ['iec_conformity', /iec (?:compliant|conformant)/],
            ['productive_release', /(?:released|approved) for (?:design|purchase|installation)/],
          ],
          es: [
            ['recommended', /\brecomendad[oa]\b/],
            ['selected', /\bseleccionad[oa]\b/],
            ['final_solution', /solucion final/],
            ['iec_conformity', /conforme con iec/],
            ['productive_release', /(?:liberad[oa]|aprobad[oa]) para (?:proyecto|compra|instalacion)/],
          ],
        };
        const forbiddenVocabulary = (forbiddenPatterns[language] || [])
          .filter(([, pattern]) => pattern.test(normalizedText)).map(([term]) => term);
        return {
          language,
          htmlLang: document.documentElement.lang,
          regionPresent: Boolean(region),
          text: region?.innerText || '',
          noticeInvariant: Boolean(region && region.innerText.includes(notice)),
          forbiddenVocabulary,
        };
      }, { language, selectors: REGION_SELECTORS, notice: NOTICE });
    }

    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
    const mobileThemes = {};
    for (const theme of ['light', 'dark']) {
      mobileThemes[theme] = await page.evaluate(({ theme, selectors }) => {
        if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        const region = selectors.map((selector) => document.querySelector(selector)).find(Boolean) || null;
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
          clippedElements: clipped,
          noHorizontalOverflow: Boolean(region
            && document.documentElement.scrollWidth === document.documentElement.clientWidth
            && rect.left >= -1 && rect.right <= innerWidth + 1
            && region.scrollWidth <= region.clientWidth + 1 && clipped === 0),
        };
      }, { theme, selectors: REGION_SELECTORS });
    }

    await page.emulateMediaType('print');
    const printable = await page.evaluate(({ selectors }) => {
      const region = selectors.map((selector) => document.querySelector(selector)).find(Boolean) || null;
      const style = region ? getComputedStyle(region) : null;
      return {
        regionPresent: Boolean(region),
        visibleInPrint: Boolean(region && style.display !== 'none' && style.visibility !== 'hidden'),
        text: region?.innerText || '',
      };
    }, { selectors: REGION_SELECTORS });
    await page.emulateMediaType('screen');
    await new Promise((resolve) => setTimeout(resolve, 50));

    return {
      url: page.url(),
      browserVersion,
      api,
      nodeCore,
      desktop,
      locales,
      mobileThemes,
      printable,
      consoleErrors: consoleErrors.slice(),
      pageErrors: pageErrors.slice(),
      rawConsoleErrors: consoleErrors.slice(),
      rawPageErrors: pageErrors.slice(),
    };
  } finally {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    await closeServer(server);
  }
}

function buildReports(snapshot) {
  const d = snapshot.desktop;
  const sectionCommon = {
    realPageLoaded: d.pageLoaded === true,
    sectionPresent: d.section.present === true,
    sectionVisible: d.section.visible === true,
    noConsoleErrors: snapshot.consoleErrors.length === 0,
    noPageErrors: snapshot.pageErrors.length === 0,
    noInvalidTokens: d.invalidTokens.length === 0,
  };
  const checks = (extra) => ({ ...sectionCommon, ...extra });
  const envelope = d.engine.latestEnvelope;
  const localeText = Object.fromEntries(Object.entries(snapshot.locales).map(([key, item]) => [key, normalize(item.text)]));
  const localeChecks = {
    pt: ['alternativ', 'ampacidade', 'queda', 'curto', 'instalacao autorizada'].every((token) => localeText.pt.includes(token)),
    en: ['alternative', 'ampacity', 'voltage drop', 'short-circuit', 'installation authorized'].every((token) => localeText.en.includes(token)),
    es: ['alternativ', 'ampacidad', 'caida de tension', 'cortocircuito', 'instalacion autorizada'].every((token) => localeText.es.includes(token)),
  };
  const localeLeakage = {
    en: ['ampacidade', 'queda de tensao', 'instalacao autorizada'].filter((token) => localeText.en.includes(token)),
    es: ['ampacity', 'voltage drop', 'installation authorized'].filter((token) => localeText.es.includes(token)),
    pt: ['ampacity', 'voltage drop', 'installation authorized'].filter((token) => localeText.pt.includes(token)),
  };
  const printText = normalize(snapshot.printable.text);
  const capturedInputsMatchFixture = d.engine.inputs.length > 0 && d.engine.inputs.every((input) => (
    input?.totalLoadCurrent_A === CEO_FIXTURE.totalLoadCurrent_A
    && input?.lineVoltage_V === CEO_FIXTURE.lineVoltage_V
    && input?.maximumVoltageDrop_percent === CEO_FIXTURE.maximumVoltageDrop_percent
  ));
  const allPracticalControlsVisibleAndEnabled = ['current', 'voltage', 'drop', 'objective', 'action']
    .every((name) => d.controls[name].present && d.controls[name].visible && d.controls[name].enabled);
  const confirmationsVisibleEnabledAndConfirmed = ['catalogConfirmation', 'hypothesisConfirmation']
    .every((name) => d.controls[name].present && d.controls[name].visible
      && d.controls[name].enabled && d.controls[name].confirmed);
  const forbiddenVocabularyByLocale = Object.fromEntries(Object.entries(snapshot.locales)
    .map(([language, locale]) => [language, locale.forbiddenVocabulary]));
  const reports = [
    resultReport('UI-01', checks({ isolated: d.section.isolated, productiveCalculationSucceeded: d.productive.envelopeOk, productiveResultUnchanged: d.productive.unchanged }), { section: d.section, productive: d.productive }),
    resultReport('UI-02', checks({ literalNoticeVisible: d.section.noticeVisible }), { notice: NOTICE, sectionText: d.section.text.slice(0, 1200) }),
    resultReport('UI-03', checks({ practicalControlsVisibleAndEnabled: allPracticalControlsVisibleAndEnabled, confirmationsVisibleEnabledAndConfirmed, capturedInputsMatchFixture, advancedSectionPresent: d.controls.advanced.present, advancedInitialCollapseValid: d.controls.advanced.initialCollapseValid, practicalBeforeAdvanced: d.controls.practicalBeforeAdvanced }), { fixture: CEO_FIXTURE, controls: d.controls, capturedInputs: d.engine.inputs }),
    resultReport('UI-04', checks({ confirmationsVisibleEnabledAndConfirmed, temperatureInCelsius: d.governance.temperatureVisible, noNormativePresentation: !d.governance.normativeLeak }), { controls: d.controls, governance: d.governance }),
    resultReport('UI-05', checks({ realNodeCoreAvailable: snapshot.nodeCore.available, realPageEngineAvailable: d.engine.functionAvailable, realEngineCalled: d.engine.callCount > 0, successfulRealEnvelope: envelope?.ok === true, humanCandidateCards: d.alternatives.cardsUseHumanForm }), { engine: d.engine, alternatives: d.alternatives }),
    resultReport('UI-06', checks({ desktopLanguageExplicitlyPt: d.language.compatible, ampacityVisible: d.alternatives.criteriaTokens.ampacity, voltageDropVisible: d.alternatives.criteriaTokens.voltageDrop, shortCircuitVisible: d.alternatives.criteriaTokens.shortCircuit, criteriaVisible: d.alternatives.criteriaVisible, realAlternativesObserved: d.alternatives.expectedCount > 0 }), { language: d.language, alternatives: d.alternatives }),
    resultReport('UI-07', checks({ dominantCriteriaFromEnvelopeVisible: d.alternatives.dominantVisible, dominantArraysPreserved: d.alternatives.dominantArrays.every((item) => Array.isArray(item.dominantCriteria)) }), { dominantArrays: d.alternatives.dominantArrays }),
    resultReport('UI-08', checks({ allObjectiveOptions: Object.keys(OBJECTIVE_TOPS).every((value) => d.controls.objectiveOptions.includes(value)), allRunsCalledRealEngine: d.objectiveRuns.every((run) => run.newEngineCalls > 0), engineTopsMatchFixture: d.objectiveRuns.every((run) => run.observedTop === run.expectedTop), topsVisible: d.objectiveRuns.every((run) => run.topVisible), neverAuthorizesInstallation: d.objectiveRuns.every((run) => run.installableSelection === null && run.installationAuthorized === false && run.productionAllowed === false) }), { objectiveRuns: d.objectiveRuns }),
    resultReport('UI-09', checks({ allAlternativesAccessible: d.alternatives.allAlternativeIdsVisible, frontierAccessible: d.alternatives.allFrontierIdsVisible, moreThanFirstExposed: d.alternatives.expectedCount > 1 }), { alternatives: d.alternatives }),
    resultReport('UI-10', checks({ explicitInstallationNo: d.governance.installationNo, installableSelectionNull: d.governance.installableSelection === null, installationAuthorizedFalse: d.governance.installationAuthorized === false, productionAllowedFalse: d.governance.productionAllowed === false }), { governance: d.governance }),
    resultReport('UI-11', checks({ ptFreeOfForbiddenVocabulary: forbiddenVocabularyByLocale.pt.length === 0, enFreeOfForbiddenVocabulary: forbiddenVocabularyByLocale.en.length === 0, esFreeOfForbiddenVocabulary: forbiddenVocabularyByLocale.es.length === 0 }), { forbiddenVocabularyByLocale }),
    resultReport('UI-12', checks({ ptTranslated: localeChecks.pt, enTranslated: localeChecks.en, esTranslated: localeChecks.es, noticeInvariant: Object.values(snapshot.locales).every((item) => item.noticeInvariant), zeroLeakage: Object.values(localeLeakage).every((items) => items.length === 0) }), { locales: snapshot.locales, localeChecks, localeLeakage }),
    resultReport('UI-13', checks({ landmark: d.accessibility.landmark, labelsAssociated: d.accessibility.labelsAssociated, keyboardReachable: d.accessibility.focusableCount > 0, visibleFocus: d.accessibility.focusVisible, noInlineHandlers: d.accessibility.inlineHandlers.length === 0 }), { accessibility: d.accessibility }),
    resultReport('UI-14', checks({ lightNoOverflow: snapshot.mobileThemes.light.noHorizontalOverflow, darkNoOverflow: snapshot.mobileThemes.dark.noHorizontalOverflow, width375: Object.values(snapshot.mobileThemes).every((item) => item.viewportWidth === 375) }), { mobileThemes: snapshot.mobileThemes }),
    resultReport('UI-15', checks({ visibleInPrint: snapshot.printable.visibleInPrint, notice: snapshot.printable.text.includes(NOTICE), confirmedInputs: /(confirmad|confirmed)/.test(printText), alternatives: /(alternativ)/.test(printText), criteria: /(ampacidade|ampacity|ampacidad)/.test(printText) && /(queda|voltage drop|caida)/.test(printText) && /(curto|short-circuit|cortocircuito)/.test(printText), dominant: /(dominant)/.test(printText), assumptionsAndBlockers: /(hipot|assumption|supuesto)/.test(printText) && /(bloque|block)/.test(printText), installationNo: /(instalacao autorizada|installation authorized|instalacion autorizada)\s*:\s*(nao|no)/.test(printText), noFinalMemorialOrIec: !/(memorial final|conforme iec|iec conformity|conformidad iec)/.test(printText) }), { printable: snapshot.printable }),
  ];
  return reports;
}

async function main() {
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
    preflight,
    preflightError: preflightError ? serializeError(preflightError) : null,
    functionalError: functionalError ? serializeError(functionalError) : null,
  };

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
    preflight: null,
    preflightError: null,
    functionalError: serializeError(error),
  })}\n`);
  process.exitCode = 3;
});
