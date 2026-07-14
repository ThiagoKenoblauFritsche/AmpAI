/**
 * O.S. CAB-BT-CRITERIA-001-RED — suíte browser experimental.
 *
 * Exercita formulário, botão, motor e renderer BT reais. A instrumentação
 * somente observa chamadas e envelopes; nenhum resultado é substituído e
 * nenhuma fórmula de dimensionamento é reproduzida neste teste.
 */
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const REPORT_PREFIX = 'CAB_BT_CRITERIA_001_REPORT';
const SUMMARY_PREFIX = 'CAB_BT_CRITERIA_001_SUMMARY';
const CASE_IDS = [
  'bt-criteria-table-visible-and-ordered',
  'bt-criteria-values-match-engine-envelope',
  'bt-single-dominant-status',
  'bt-multiple-dominant-status',
  'bt-criteria-i18n-pt-en-es',
  'bt-print-memorial-contains-inputs-and-criteria',
];

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const FIXTURES = {
  standard: {
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
  },
  singleDominant: {
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
      'bt-icc': '1',
      'bt-tprot': '0.2',
    },
    state: { btCond: 'Cu', btIns: 'XLPE' },
    expectedDominant: 'AMPACIDADE',
  },
  multipleDominant: {
    values: {
      'bt-method': 'C',
      'bt-phases': '3',
      'bt-ib': '10',
      'bt-in': '16',
      'bt-ull': '380',
      'bt-length': '5',
      'bt-cosphi': '0.92',
      'bt-du-max': '3',
      'bt-tamb': '30',
      'bt-ncirc': '1',
      'bt-icc': '0.5',
      'bt-tprot': '0.05',
    },
    state: { btCond: 'Cu', btIns: 'XLPE' },
    expectedDominant: 'AMPACIDADE + QUEDA DE TENSÃO + CURTO-CIRCUITO',
  },
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

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/₁/g, '1')
    .replace(/₂/g, '2')
    .replace(/₃/g, '3')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function numberAppears(text, value) {
  if (!Number.isFinite(value)) return false;
  const normalizedText = normalize(text).replace(/,/g, '.');
  const candidates = new Set([
    String(value),
    value.toFixed(0),
    value.toFixed(1),
    value.toFixed(2),
    value.toFixed(3),
    value.toFixed(4),
  ]);
  return [...candidates].some((candidate) => normalizedText.includes(candidate));
}

function findRow(snapshot, criterion) {
  return snapshot?.criteriaTable?.rows.find((row) => {
    const firstCell = normalize(row.cells[0]);
    return firstCell.includes(`s${criterion}`);
  }) || null;
}

function findFinalRow(snapshot) {
  return snapshot?.criteriaTable?.rows.find((row) => normalize(row.cells[0]).includes('final')) || null;
}

function dominantKeys(dominant) {
  const text = normalize(dominant);
  return [
    ['1', 'ampacidade'],
    ['2', 'queda de tensao'],
    ['3', 'curto-circuito'],
  ].filter(([, label]) => text.includes(label)).map(([key]) => key);
}

function statusEvidence(snapshot) {
  const data = snapshot.envelopeData || {};
  const expectedDominants = dominantKeys(data.dominant);
  const rows = ['1', '2', '3'].map((key) => {
    const row = findRow(snapshot, key);
    const status = row?.cells[2] || '';
    const normalizedStatus = normalize(status);
    const expectedDominant = expectedDominants.includes(key);
    const correct = expectedDominant
      ? status.includes('★') && /\b(dominante|dominant)\b/.test(normalizedStatus)
      : status.includes('✓') && /\bok\b/.test(normalizedStatus);
    return { criterion: `S${key}`, status, expectedDominant, correct };
  });
  return {
    observedDominant: data.dominant,
    expectedDominants,
    rows,
    allRowsPresent: rows.every((row) => row.status.length > 0),
    incorrectStatuses: rows.filter((row) => !row.correct).length,
  };
}

function valueEvidence(snapshot) {
  const data = snapshot.envelopeData || {};
  const s1 = findRow(snapshot, '1');
  const s2 = findRow(snapshot, '2');
  const s3 = findRow(snapshot, '3');
  const finalRow = findFinalRow(snapshot);
  const tableText = snapshot.criteriaTable?.text || '';
  const realDropRow = snapshot.criteriaTable?.rows.find((row) => {
    const label = normalize(row.cells[0]);
    return label.includes('real') && /(queda|drop|caida)/.test(label);
  }) || null;
  const factorsRow = snapshot.criteriaTable?.rows.find((row) => {
    const text = normalize(row.text);
    return text.includes('fct') && text.includes('fca');
  }) || null;

  const checks = {
    s1: Boolean(s1 && numberAppears(s1.text, data.S1)),
    s2Discrete: Boolean(s2 && numberAppears(s2.text, data.S2)),
    s2Continuous: Boolean(s2 && numberAppears(s2.text, data.S2_cont)),
    s3Discrete: Boolean(s3 && numberAppears(s3.text, data.S3)),
    s3Continuous: Boolean(s3 && numberAppears(s3.text, data.S3_cont)),
    finalSection: Boolean(finalRow && numberAppears(finalRow.text, data.sFinal)),
    fct: Boolean(factorsRow && numberAppears(factorsRow.text, data.FCT)),
    fca: Boolean(factorsRow && numberAppears(factorsRow.text, data.FCA)),
    actualVoltageDrop: Boolean(realDropRow && numberAppears(realDropRow.text, data.duPct_final)),
    dominantPresent: dominantKeys(data.dominant).length > 0
      && /\b(dominante|dominant)\b/.test(normalize(tableText)),
  };

  return {
    checks,
    allValuesMatch: Object.values(checks).every(Boolean),
    observed: {
      S1: data.S1,
      S2: data.S2,
      S2_cont: data.S2_cont,
      S3: data.S3,
      S3_cont: data.S3_cont,
      sFinal: data.sFinal,
      dominant: data.dominant,
      FCT: data.FCT,
      FCA: data.FCA,
      duPct_final: data.duPct_final,
    },
  };
}

function commonChecks(snapshot) {
  return {
    realPage: snapshot.pageReady === true,
    realEngineExactlyOnce: snapshot.engineCallCount === 1,
    realRendererExactlyOnce: snapshot.rendererCallCount === 1,
    successfulEnvelope: snapshot.envelopeOk === true,
    envelopeDataDeliveredToRenderer: snapshot.dataDeliveredToRenderer === true,
    validCapturedInput: snapshot.capturedInputValid === true,
    noInvalidTokens: snapshot.invalidTokens.length === 0,
    noConsoleErrors: snapshot.consoleErrors.length === 0,
    noPageErrors: snapshot.pageErrors.length === 0,
  };
}

function runtimeErrors(snapshot) {
  return {
    consoleErrors: snapshot.consoleErrors,
    pageErrors: snapshot.pageErrors,
  };
}

function allTrue(object) {
  return Object.values(object).every(Boolean);
}

async function preparePage(browser, url) {
  const page = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(serializeError(error)));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => (
    typeof window.calculateCablingBT === 'function'
    && typeof window.renderCardBT === 'function'
    && typeof window.switchModule === 'function'
    && typeof window.switchCablingCard === 'function'
    && typeof window.setLanguage === 'function'
    && document.querySelector('#btn-bt')
    && document.querySelector('#card-bt')
  ), { timeout: 15000 });
  return { page, consoleErrors, pageErrors };
}

async function runCalculation(browser, url, fixture, language) {
  const context = await preparePage(browser, url);
  const { page, consoleErrors, pageErrors } = context;
  try {
    // O carregamento bloqueia CDNs externas de forma deliberada. Somente erros
    // posteriores ao preflight pertencem à ação de cálculo sob julgamento.
    consoleErrors.length = 0;
    pageErrors.length = 0;
    const snapshot = await page.evaluate(async ({ selectedFixture, selectedLanguage }) => {
      const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const waitFrames = (count) => new Promise((resolve) => {
        const next = () => {
          if (count-- <= 0) return resolve();
          requestAnimationFrame(next);
        };
        requestAnimationFrame(next);
      });
      const normalized = (value) => String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/₁/g, '1')
        .replace(/₂/g, '2')
        .replace(/₃/g, '3')
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
      const serializeTable = (table) => {
        if (!table) return null;
        const headers = Array.from(table.querySelectorAll('thead th')).map((cell) => cell.innerText.trim());
        const rows = Array.from(table.querySelectorAll('tbody tr')).map((row) => {
          const cells = Array.from(row.querySelectorAll('th,td')).map((cell) => cell.innerText.trim());
          return { cells, text: cells.join(' | ') };
        });
        return {
          caption: table.querySelector('caption')?.innerText.trim() || '',
          headers,
          rows,
          text: table.innerText.trim(),
          visible: isVisible(table),
        };
      };

      window._lastBTPayload = null;
      window.setLanguage(selectedLanguage);
      window.switchModule('cabling');
      window.switchCablingCard('bt');
      await waitFrames(4);

      Object.entries(selectedFixture.values).forEach(([id, value]) => {
        const input = document.getElementById(id);
        if (!input) throw new Error(`CONFIG_ERROR: campo BT real ausente: #${id}`);
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      window.AmpAI_State = window.AmpAI_State || {};
      Object.assign(window.AmpAI_State, selectedFixture.state);

      const originalEngine = window.calculateCablingBT;
      const originalRenderer = window.renderCardBT;
      const engineCalls = [];
      const engineResults = [];
      const rendererCalls = [];

      window.calculateCablingBT = function observedRealEngine(input) {
        engineCalls.push(input);
        const result = originalEngine.apply(this, arguments);
        engineResults.push(result);
        return result;
      };
      window.renderCardBT = function observedRealRenderer(payload) {
        rendererCalls.push(payload);
        return originalRenderer.apply(this, arguments);
      };

      const button = document.querySelector('#btn-bt');
      button.click();
      await waitFrames(15);
      await wait(180);

      window.calculateCablingBT = originalEngine;
      window.renderCardBT = originalRenderer;

      const card = document.querySelector('#card-bt');
      const kpis = card.querySelector('.results-grid');
      const tables = Array.from(card.querySelectorAll('table'));
      const inputTable = tables.find((table) => {
        const text = normalized(table.innerText);
        return ['ib', 'in', 'icc', 'ull'].every((token) => text.includes(token))
          && table.querySelectorAll('thead th').length === 4;
      }) || null;
      const criteriaTable = tables.find((table) => {
        const text = normalized(table.innerText);
        return ['s1', 's2', 's3'].every((token) => text.includes(token))
          && table.querySelectorAll('thead th').length === 3;
      }) || null;
      const memorial = card.querySelector('#cb-mem-bt-container');
      const envelope = [...engineResults].reverse().find((entry) => entry && typeof entry === 'object') || null;
      const envelopeData = envelope?.ok === true ? envelope.data : null;
      const input = engineCalls[0] || null;
      const requiredInputKeys = [
        'method', 'phases', 'Ib_A', 'In_A', 'ULL_V', 'length_m', 'cosPhi',
        'duMax_pct', 'thetaAmb_C', 'nCircuits', 'Icc_A', 'tProt_s', 'conductor', 'insulation',
      ];
      const cardText = card.innerText || '';
      const invalidTokens = ['undefined', 'nan', '--'].filter((token) => {
        if (token === '--') return /(^|\s)--(?=\s|$)/.test(cardText);
        return new RegExp(`(^|\\s)${token}(?=\\s|$)`, 'i').test(cardText);
      });
      const criteriaAfterKpis = Boolean(kpis && criteriaTable
        && (kpis.compareDocumentPosition(criteriaTable) & Node.DOCUMENT_POSITION_FOLLOWING));
      const criteriaBeforeInputs = Boolean(criteriaTable && inputTable
        && (criteriaTable.compareDocumentPosition(inputTable) & Node.DOCUMENT_POSITION_FOLLOWING));

      return {
        pageReady: true,
        language: selectedLanguage,
        fixtureValues: selectedFixture.values,
        engineCallCount: engineCalls.length,
        rendererCallCount: rendererCalls.length,
        envelopeOk: Boolean(envelope?.ok === true && envelopeData),
        envelopeData,
        capturedInput: input,
        capturedInputValid: Boolean(input && requiredInputKeys.every((key) => key in input)),
        dataDeliveredToRenderer: Boolean(envelopeData && rendererCalls.includes(envelopeData)),
        invalidTokens,
        cardText: cardText.slice(0, 5000),
        kpisPresent: Boolean(kpis),
        inputTable: serializeTable(inputTable),
        criteriaTable: serializeTable(criteriaTable),
        tableCount: tables.length,
        criteriaAfterKpis,
        criteriaBeforeInputs,
        memorialPresent: Boolean(memorial),
        memorialText: memorial?.innerText || '',
        printableTreeText: cardText,
      };
    }, { selectedFixture: fixture, selectedLanguage: language });

    await new Promise((resolve) => setTimeout(resolve, 50));
    return { ...snapshot, consoleErrors, pageErrors };
  } finally {
    await page.close();
  }
}

function structureReport(snapshot) {
  const common = commonChecks(snapshot);
  const contract = {
    kpisPresent: snapshot.kpisPresent === true,
    criteriaTablePresent: Boolean(snapshot.criteriaTable),
    criteriaTableVisible: snapshot.criteriaTable?.visible === true,
    captionSemanticallyAssociated: Boolean(snapshot.criteriaTable?.caption),
    exactlyThreeColumns: snapshot.criteriaTable?.headers.length === 3,
    criteriaAfterKpis: snapshot.criteriaAfterKpis === true,
    criteriaBeforeInputTable: snapshot.criteriaBeforeInputs === true,
    inputTablePreserved: Boolean(snapshot.inputTable),
  };
  return {
    case: CASE_IDS[0],
    classification: allTrue(common) && allTrue(contract) ? 'PASS' : 'FUNCTIONAL_FAILURE',
    assertionExercised: snapshot.envelopeOk === true,
    common,
    contract,
    observed: {
      tableCount: snapshot.tableCount,
      criteriaCaption: snapshot.criteriaTable?.caption || null,
      criteriaHeaders: snapshot.criteriaTable?.headers || [],
      inputHeaders: snapshot.inputTable?.headers || [],
    },
    runtimeErrors: runtimeErrors(snapshot),
    compliant: allTrue(common) && allTrue(contract),
  };
}

function valuesReport(snapshot) {
  const common = commonChecks(snapshot);
  const values = valueEvidence(snapshot);
  const contract = {
    criteriaTablePresent: Boolean(snapshot.criteriaTable),
    engineEnvelopeComparedDirectly: values.allValuesMatch,
  };
  return {
    case: CASE_IDS[1],
    classification: allTrue(common) && allTrue(contract) ? 'PASS' : 'FUNCTIONAL_FAILURE',
    assertionExercised: snapshot.envelopeOk === true,
    common,
    contract,
    values,
    runtimeErrors: runtimeErrors(snapshot),
    compliant: allTrue(common) && allTrue(contract),
  };
}

function dominantReport(caseId, snapshot, expectedDominant, minimumDominants) {
  const common = commonChecks(snapshot);
  const statuses = statusEvidence(snapshot);
  const values = valueEvidence(snapshot);
  const contract = {
    deterministicDominantObserved: snapshot.envelopeData?.dominant === expectedDominant,
    expectedDominantCount: statuses.expectedDominants.length >= minimumDominants,
    allCriteriaRowsPresent: statuses.allRowsPresent,
    zeroIncorrectStatus: statuses.incorrectStatuses === 0,
    finalSectionMatchesEnvelope: values.checks.finalSection === true,
  };
  return {
    case: caseId,
    classification: allTrue(common) && allTrue(contract) ? 'PASS' : 'FUNCTIONAL_FAILURE',
    assertionExercised: snapshot.envelopeOk === true,
    common,
    contract,
    inputs: snapshot.capturedInput,
    statuses,
    envelopeCriteria: values.observed,
    runtimeErrors: runtimeErrors(snapshot),
    compliant: allTrue(common) && allTrue(contract),
  };
}

function localeEvidence(snapshot, language) {
  const table = snapshot.criteriaTable;
  const text = normalize(table?.text);
  const caption = normalize(table?.caption);
  const headers = (table?.headers || []).map(normalize);
  const expectations = {
    pt: {
      caption: ['criter', 'iec 60364-5-52', 'iec 60364-4-43'],
      headers: ['criterio', 'secao calculada', 'status'],
      body: ['ampacidade', 'queda de tensao', 'curto-circuito', 'dominante', 'ok', 'secao final', 'fct', 'fca', 'queda de tensao real'],
    },
    en: {
      caption: ['criter', 'iec 60364-5-52', 'iec 60364-4-43'],
      headers: ['criterion', 'calculated section', 'status'],
      body: ['ampacity', 'voltage drop', 'short-circuit', 'dominant', 'ok', 'final', 'fct', 'fca', 'actual voltage drop'],
    },
    es: {
      caption: ['criter', 'iec 60364-5-52', 'iec 60364-4-43'],
      headers: ['criterio', 'seccion calculada', 'estado'],
      body: ['amperaje', 'caida de tension', 'cortocircuito', 'dominante', 'ok', 'seccion final', 'fct', 'fca', 'caida de tension real'],
    },
  }[language];
  const portugueseLeakage = language === 'en'
    ? ['secao', 'queda de tensao', 'curto-circuito', 'ampacidade', 'fatores de correcao'].filter((token) => text.includes(token))
    : [];
  const captionChecks = expectations.caption.map((token) => ({ token, present: caption.includes(token) }));
  const headerChecks = expectations.headers.map((token, index) => ({
    token,
    observed: headers[index] || '',
    present: (headers[index] || '').includes(token),
  }));
  const bodyChecks = expectations.body.map((token) => ({ token, present: text.includes(token) }));
  return {
    language,
    caption: table?.caption || '',
    headers: table?.headers || [],
    captionChecks,
    headerChecks,
    bodyChecks,
    portugueseLeakage,
    compliant: Boolean(table)
      && captionChecks.every((check) => check.present)
      && headerChecks.every((check) => check.present)
      && bodyChecks.every((check) => check.present)
      && portugueseLeakage.length === 0,
  };
}

function i18nReport(snapshots) {
  const commonByLanguage = Object.fromEntries(Object.entries(snapshots).map(([language, snapshot]) => (
    [language, commonChecks(snapshot)]
  )));
  const locales = Object.fromEntries(Object.entries(snapshots).map(([language, snapshot]) => (
    [language, localeEvidence(snapshot, language)]
  )));
  const commonOk = Object.values(commonByLanguage).every(allTrue);
  const localesOk = Object.values(locales).every((entry) => entry.compliant);
  return {
    case: CASE_IDS[4],
    classification: commonOk && localesOk ? 'PASS' : 'FUNCTIONAL_FAILURE',
    assertionExercised: Object.values(snapshots).every((snapshot) => snapshot.envelopeOk === true),
    calculationsPerLanguage: Object.fromEntries(Object.entries(snapshots).map(([language, snapshot]) => (
      [language, snapshot.engineCallCount]
    ))),
    commonByLanguage,
    runtimeErrorsByLanguage: Object.fromEntries(Object.entries(snapshots).map(([language, snapshot]) => (
      [language, runtimeErrors(snapshot)]
    ))),
    locales,
    compliant: commonOk && localesOk,
  };
}

function printReport(snapshot) {
  const common = commonChecks(snapshot);
  const values = valueEvidence(snapshot);
  const printableText = normalize(snapshot.printableTreeText);
  const inputText = normalize(snapshot.inputTable?.text);
  const contract = {
    memorialTreePresent: snapshot.memorialPresent === true,
    inputTableInPrintableTree: Boolean(snapshot.inputTable),
    criteriaTableInPrintableTree: Boolean(snapshot.criteriaTable),
    tablesAreDistinct: Boolean(snapshot.inputTable && snapshot.criteriaTable),
    sameEnvelopeCriteriaValues: values.allValuesMatch,
    inputValuesPresent: ['100', '125', '10', '380', '50', '0.92'].every((value) => inputText.includes(value)),
    normativeTitle60364_5_52: printableText.includes('iec 60364-5-52'),
    normativeTitle60364_4_43: printableText.includes('iec 60364-4-43'),
  };
  return {
    case: CASE_IDS[5],
    classification: allTrue(common) && allTrue(contract) ? 'PASS' : 'FUNCTIONAL_FAILURE',
    assertionExercised: snapshot.envelopeOk === true,
    common,
    contract,
    criteriaCaption: snapshot.criteriaTable?.caption || null,
    memorialText: snapshot.memorialText.slice(0, 2000),
    values,
    runtimeErrors: runtimeErrors(snapshot),
    compliant: allTrue(common) && allTrue(contract),
  };
}

function configErrorReport(caseId, error) {
  return {
    case: caseId,
    classification: 'CONFIG_ERROR',
    assertionExercised: false,
    harnessError: serializeError(error),
    compliant: false,
  };
}

function infraBlockedReports(error) {
  return CASE_IDS.map((caseId) => ({
    case: caseId,
    classification: 'INFRA_BLOCKED',
    assertionExercised: false,
    preflightError: serializeError(error),
    compliant: false,
  }));
}

async function buildReports(browser, url) {
  const reports = [];
  const run = async (caseId, operation) => {
    try {
      reports.push(await operation());
    } catch (error) {
      reports.push(configErrorReport(caseId, error));
    }
  };

  await run(CASE_IDS[0], async () => structureReport(
    await runCalculation(browser, url, FIXTURES.standard, 'pt')
  ));
  await run(CASE_IDS[1], async () => valuesReport(
    await runCalculation(browser, url, FIXTURES.standard, 'pt')
  ));
  await run(CASE_IDS[2], async () => dominantReport(
    CASE_IDS[2],
    await runCalculation(browser, url, FIXTURES.singleDominant, 'pt'),
    FIXTURES.singleDominant.expectedDominant,
    1
  ));
  await run(CASE_IDS[3], async () => dominantReport(
    CASE_IDS[3],
    await runCalculation(browser, url, FIXTURES.multipleDominant, 'pt'),
    FIXTURES.multipleDominant.expectedDominant,
    2
  ));
  await run(CASE_IDS[4], async () => {
    const snapshots = {};
    for (const language of ['pt', 'en', 'es']) {
      snapshots[language] = await runCalculation(browser, url, FIXTURES.standard, language);
    }
    return i18nReport(snapshots);
  });
  await run(CASE_IDS[5], async () => printReport(
    await runCalculation(browser, url, FIXTURES.standard, 'pt')
  ));

  return reports;
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

function exitCodeFor(classification) {
  return {
    PASS: 0,
    FUNCTIONAL_FAILURE: 1,
    INFRA_BLOCKED: 2,
    CONFIG_ERROR: 3,
  }[classification] ?? 3;
}

async function main() {
  let puppeteer;
  let browser;
  let server;
  let reports = [];
  let preflightExitCode = 0;
  let preflightError = null;

  try {
    try {
      puppeteer = require('puppeteer');
      const staticServer = await startStaticServer();
      server = staticServer.server;
      browser = await puppeteer.launch({ headless: 'new' });

      const probe = await preparePage(browser, staticServer.url);
      await probe.page.close();
      if (probe.pageErrors.length > 0) {
        throw new Error(`Preflight com erros de página: ${JSON.stringify({
          pageErrors: probe.pageErrors,
        })}`);
      }

      reports = await buildReports(browser, staticServer.url);
    } catch (error) {
      preflightExitCode = 2;
      preflightError = error;
      reports = infraBlockedReports(error);
    }

    if (reports.length !== CASE_IDS.length) {
      const existing = new Set(reports.map((report) => report.case));
      for (const caseId of CASE_IDS) {
        if (!existing.has(caseId)) reports.push(configErrorReport(caseId, new Error('Relatório ausente.')));
      }
      reports = reports.slice(0, CASE_IDS.length);
    }

    reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));

    const classification = classify(reports, preflightExitCode);
    const processExitCode = exitCodeFor(classification);
    const compliant = reports.filter((report) => report.compliant).length;
    const nonCompliant = reports.length - compliant;
    const summary = {
      classification,
      reports: reports.length,
      compliant,
      nonCompliant,
      preflightExitCode,
      processExitCode,
      experimental: true,
      preflightError: preflightError ? serializeError(preflightError) : null,
    };
    process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify(summary)}\n`);
    process.exitCode = processExitCode;
  } finally {
    if (browser) await browser.close().catch(() => {});
    await closeServer(server);
  }
}

main().catch((error) => {
  const reports = infraBlockedReports(error);
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify({
    classification: 'INFRA_BLOCKED',
    reports: reports.length,
    compliant: 0,
    nonCompliant: reports.length,
    preflightExitCode: 2,
    processExitCode: 2,
    experimental: true,
    preflightError: serializeError(error),
  })}\n`);
  process.exitCode = 2;
});
