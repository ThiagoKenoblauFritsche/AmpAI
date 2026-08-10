/**
 * CAB-BT-PARALLEL-004 — RED visual experimental da apresentação mínima por seção.
 *
 * Exercita Chromium, página, DOM, eventos e enumerador reais. O teste apenas observa
 * inputs/envelopes e a árvore renderizada; não substitui motor, renderer ou resultado.
 */
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');

const ROOT = path.resolve(__dirname, '..');
const HOST = '127.0.0.1';
const REPORT_PREFIX = 'CAB_BT_PARALLEL_MINIMUM_PER_SECTION_UI_EXP_REPORT';
const SUMMARY_PREFIX = 'CAB_BT_PARALLEL_MINIMUM_PER_SECTION_UI_EXP_SUMMARY';
const CATEGORY = 'minimum_per_section_ui_experimental';
const EXPECTED_CORE_SHA256_LF = 'E46168DB765C12452FD2B8B9CC62479D58BBAC11B728DFDD8E04802D8DA6DC1C';
const EXPECTED_CORE_BLOB = '4f0295127df7388ab326abd1aeb342f03124e80a';
const CORE_PATH = path.join(ROOT, 'js', 'core_cabos_bt_parallel_selection_experimental.js');
const CASE_COUNTS = [1, 1, 6, 4, 4, 2, 6, 33, 6, 6, 2, 3, 5, 4, 4];
const IDS = CASE_COUNTS.map((_count, index) => `MPS-UI-${String(index + 1).padStart(2, '0')}`);
const EXPECTED_CASES = CASE_COUNTS.reduce((sum, count) => sum + count, 0);
const POLICY = {
  mode: 'MINIMUM_PASSING_PER_SECTION',
  confirmed: true,
  provenance: 'CEO_APPROVED_PRESENTATION_POLICY',
};
const SECTIONS = [95, 120, 150, 185, 240, 300];
const DEFAULT_MINIMUMS = ['10x95', '8x120', '7x150', '6x185', '6x240', '5x300'];
const REDUCED_MINIMUMS = ['7x150', '6x185', '6x240', '5x300'];
const OBJECTIVE_ORDERS = {
  NONE: ['5x300', '6x185', '6x240', '7x150', '8x120', '10x95'],
  MIN_PARALLEL_COUNT: ['5x300', '6x240', '6x185', '7x150', '8x120', '10x95'],
  MIN_TOTAL_COPPER: ['10x95', '8x120', '7x150', '6x185', '6x240', '5x300'],
  MAX_MINIMUM_MARGIN: ['6x240', '5x300', '10x95', '7x150', '8x120', '6x185'],
};
const LANGUAGES = ['pt', 'en', 'es'];
const TRANSLATIONS = {
  warning: {
    pt: 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO.',
    en: 'PRELIMINARY — DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION.',
    es: 'PRELIMINAR — NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN.',
  },
  installation: {
    pt: 'Instalação autorizada: NÃO', en: 'Installation authorized: NO', es: 'Instalación autorizada: NO',
  },
  production: {
    pt: 'Estado de produção: BLOQUEADO', en: 'Production state: BLOCKED', es: 'Estado de producción: BLOQUEADO',
  },
  source: {
    pt: 'Fonte primária IEC integral: AUSENTE — sem conformidade IEC',
    en: 'Full primary IEC source: ABSENT — no IEC conformity',
    es: 'Fuente primaria IEC íntegra: AUSENTE — sin conformidad IEC',
  },
  assumptions: {
    pt: 'Hipóteses (ASSUMPTION_ONLY)', en: 'Assumptions (ASSUMPTION_ONLY)', es: 'Hipótesis (ASSUMPTION_ONLY)',
  },
  blockers: { pt: 'Bloqueadores', en: 'Blockers', es: 'Bloqueadores' },
  confirmedInputs: { pt: 'Entradas confirmadas', en: 'Confirmed inputs', es: 'Entradas confirmadas' },
  heading: {
    pt: 'Menor quantidade que atende por seção no intervalo avaliado',
    en: 'Smallest quantity meeting the criteria per section within the evaluated range',
    es: 'Menor cantidad que cumple por sección en el intervalo evaluado',
  },
  criteria: {
    pt: 'Critérios: ampacidade, queda de tensão, curto-circuito',
    en: 'Criteria: ampacity, voltage drop, short-circuit',
    es: 'Criterios: ampacidad, caída de tensión, cortocircuito',
  },
  absence: {
    pt: (section, maximum) => `Nenhuma alternativa da seção ${section} atende dentro do intervalo avaliado de 1 até ${maximum} cabos por fase.`,
    en: (section, maximum) => `No alternative for section ${section} meets the criteria within the evaluated range of 1 to ${maximum} conductors per phase.`,
    es: (section, maximum) => `Ninguna alternativa de la sección ${section} cumple dentro del intervalo evaluado de 1 a ${maximum} conductores por fase.`,
  },
  printLabel: {
    pt: 'Impressão preliminar — não é memorial final',
    en: 'Preliminary print — not a final report',
    es: 'Impresión preliminar — no es memoria final',
  },
};
const FORBIDDEN = {
  pt: [
    'NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO', 'Instalação autorizada: NÃO',
    'Estado de produção: BLOQUEADO', 'queda de tensão', 'cabos por fase', 'não é memorial final',
  ],
  en: [
    'DO NOT USE FOR DESIGN, PURCHASE OR INSTALLATION', 'Installation authorized: NO',
    'Production state: BLOCKED', 'voltage drop', 'conductors per phase', 'not a final report',
  ],
  es: [
    'NO UTILIZAR PARA PROYECTO, COMPRA O INSTALACIÓN', 'Instalación autorizada: NO',
    'Estado de producción: BLOQUEADO', 'caída de tensión', 'conductores por fase', 'no es memoria final',
  ],
};
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml',
};

function serializeError(error) {
  return { name: error?.name || 'Error', message: String(error?.message || error), stack: String(error?.stack || '') };
}

function sha256Lf(contents) {
  return crypto.createHash('sha256').update(contents.toString('utf8').replace(/\r\n/g, '\n')).digest('hex').toUpperCase();
}

function gitBlobOid(contents) {
  const lf = Buffer.from(contents.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  return crypto.createHash('sha1').update(Buffer.from(`blob ${lf.length}\0`)).update(lf).digest('hex');
}

function deepClone(value) {
  if (value === undefined) return null;
  return JSON.parse(JSON.stringify(value));
}

function reportId(number) {
  return `MPS-UI-${String(number).padStart(2, '0')}`;
}

function caseId(number, index) {
  return `${reportId(number)}-CASE-${String(index).padStart(2, '0')}`;
}

function closedKeys(value, keys) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && isDeepStrictEqual(Object.keys(value), keys);
}

function removeDiacritics(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

function makeSpec(number, index, inputFactory, verify) {
  return { reportId: reportId(number), caseId: caseId(number, index), inputFactory, verify };
}

function makeSpecs() {
  const specs = [];
  specs.push(makeSpec(1, 1, () => ({ present: true, visible: true, enabled: true, value: '10', min: '1', max: '10', step: '1', dtoMaxParallelCount: 10, userCanReduce: true, emptyDoesNotRecoverTen: true, navigationContract: { switchModuleCalls: 1, restored: true } }),
    (s, expected) => {
      const controlObserved = { ...s.initialControl, dtoMaxParallelCount: s.objectiveRuns.NONE.input?.maxParallelCount ?? null, userCanReduce: s.reducedRun.input?.maxParallelCount === 7, emptyDoesNotRecoverTen: s.invalidRuns.empty.engineCalls === 0 };
      const expectedControls = { ...expected };
      delete expectedControls.navigationContract;
      return {
        observed: { ...controlObserved, navigation: s.navigation },
        compliant: isDeepStrictEqual(controlObserved, expectedControls)
          && s.navigation?.switchModuleCalls === expected.navigationContract.switchModuleCalls
          && s.navigation?.restored === expected.navigationContract.restored,
      };
    }));
  specs.push(makeSpec(2, 1, () => ({ presentationPolicy: POLICY, engineCalls: 1, realEngine: true, coreSha256Lf: EXPECTED_CORE_SHA256_LF }),
    (s, expected) => { const run = s.objectiveRuns.NONE; const observed = { presentationPolicy: run.input?.presentationPolicy ?? null, engineCalls: run.engineCalls, realEngine: s.engineAvailable, coreSha256Lf: s.coreSha256Lf }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; }));

  SECTIONS.forEach((section, offset) => specs.push(makeSpec(3, offset + 1,
    () => ({ section_mm2: section, candidateId: DEFAULT_MINIMUMS[offset], visibleCandidateIds: DEFAULT_MINIMUMS, rawCount: 60, validRawCount: 24, filteredCount: 6 }),
    (s, expected) => { const run = s.objectiveRuns.MIN_TOTAL_COPPER; const item = run.envelope?.data?.presentationProjection?.minimumPassingBySection?.[offset] ?? null; const observed = { section_mm2: item?.section_mm2 ?? null, candidateId: item?.candidateId ?? null, visibleCandidateIds: run.cardIds, rawCount: run.envelope?.data?.presentationProjection?.rawCount ?? null, validRawCount: run.envelope?.data?.presentationProjection?.validRawCount ?? null, filteredCount: run.envelope?.data?.presentationProjection?.filteredCount ?? null }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  Object.entries(OBJECTIVE_ORDERS).forEach(([objective, order], offset) => specs.push(makeSpec(4, offset + 1,
    () => ({ objective, presentationOrder: order, visibleCandidateIds: order, engineCalls: 1, installableSelection: null, installationAuthorized: false, productionAllowed: false }),
    (s, expected) => { const run = s.objectiveRuns[objective]; const observed = { objective, presentationOrder: run.envelope?.data?.presentationOrder?.map((item) => item.candidateId) ?? null, visibleCandidateIds: run.cardIds, engineCalls: run.engineCalls, installableSelection: run.envelope?.data?.installableSelection, installationAuthorized: run.envelope?.data?.installationAuthorized, productionAllowed: run.envelope?.productionAllowed }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  REDUCED_MINIMUMS.forEach((candidateId, offset) => specs.push(makeSpec(5, offset + 1,
    () => ({ candidateId, visible: true, visibleCandidateIds: REDUCED_MINIMUMS, dtoMaxParallelCount: 7, rawCount: 42, filteredCount: 4 }),
    (s, expected) => { const run = s.reducedRun; const observed = { candidateId, visible: run.cardIds.includes(candidateId), visibleCandidateIds: run.cardIds, dtoMaxParallelCount: run.input?.maxParallelCount ?? null, rawCount: run.envelope?.data?.presentationProjection?.rawCount ?? null, filteredCount: run.envelope?.data?.presentationProjection?.filteredCount ?? null }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  ['6x300', '7x300'].forEach((candidateId, offset) => specs.push(makeSpec(6, offset + 1,
    () => ({ candidateId, visibleInCards: false, presentInRawEnvelope: true, presentInHiddenCandidateIds: true }),
    (s, expected) => { const data = s.reducedRun.envelope?.data; const observed = { candidateId, visibleInCards: s.reducedRun.cardIds.includes(candidateId), presentInRawEnvelope: (data?.candidateAlternatives || []).some((item) => item.candidateId === candidateId), presentInHiddenCandidateIds: (data?.presentationProjection?.hiddenCandidateIds || []).includes(candidateId) }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  LANGUAGES.forEach((language, languageOffset) => [95, 120].forEach((section, sectionOffset) => specs.push(makeSpec(7, languageOffset * 2 + sectionOffset + 1,
    () => ({ language, htmlLang: language, section_mm2: section, maximum: 7, text: TRANSLATIONS.absence[language](section, 7), exactTextPresent: true }),
    (s, expected) => { const locale = s.locales[language]; const observed = { language, htmlLang: locale.htmlLang, section_mm2: section, maximum: 7, text: expected.text, exactTextPresent: locale.exactTexts.includes(expected.text) }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; }))));

  const translationGroups = ['warning', 'installation', 'production', 'source', 'assumptions', 'blockers', 'confirmedInputs', 'heading', 'criteria', 'absence', 'printLabel'];
  LANGUAGES.forEach((language, languageOffset) => translationGroups.forEach((group, groupOffset) => specs.push(makeSpec(8, languageOffset * 11 + groupOffset + 1,
    () => ({ language, group, exactUtf8: group === 'absence' ? TRANSLATIONS.absence[language](95, 7) : TRANSLATIONS[group][language], presentByExactEquality: true }),
    (s, expected) => { const locale = s.locales[language]; const actual = group === 'warning' ? locale.notice : locale.exactTexts.find((value) => value === expected.exactUtf8) ?? null; const observed = { language, group, exactUtf8: actual, presentByExactEquality: actual === expected.exactUtf8 }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; }))));

  const wrongLanguageRelations = [
    ['pt', 'en'], ['pt', 'es'], ['en', 'pt'], ['en', 'es'], ['es', 'pt'], ['es', 'en'],
  ];
  wrongLanguageRelations.forEach(([active, wrong], offset) => specs.push(makeSpec(9, offset + 1,
    () => ({ activeLanguage: active, wrongLanguage: wrong, forbiddenExpressions: FORBIDDEN[wrong], matchedExpressions: [] }),
    (s, expected) => { const text = s.locales[active].regionText; const observed = { activeLanguage: active, wrongLanguage: wrong, forbiddenExpressions: FORBIDDEN[wrong], matchedExpressions: FORBIDDEN[wrong].filter((expression) => text.includes(expression)) }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  const mps10 = [
    { name: 'spanish-blockers-cognate', expected: TRANSLATIONS.blockers.es },
    { name: 'spanish-confirmed-inputs-cognate', expected: TRANSLATIONS.confirmedInputs.es },
    { name: 'spanish-preliminary-cognate', expected: TRANSLATIONS.warning.es },
    { name: 'accent-removal-rejected', expected: TRANSLATIONS.warning.es },
    { name: 'partial-translation-rejected', expected: TRANSLATIONS.source.es },
    { name: 'nfd-remains-distinct', expected: TRANSLATIONS.criteria.es },
  ];
  mps10.forEach((definition, offset) => specs.push(makeSpec(10, offset + 1,
    () => ({ language: 'es', name: definition.name, exactUtf8: definition.expected, exactTextPresent: true, transformedValueRejected: offset < 3 ? true : true }),
    (s, expected) => { const locale = s.locales.es; const actual = expected.name === 'spanish-preliminary-cognate' || expected.name === 'accent-removal-rejected' ? locale.notice : locale.exactTexts.find((value) => value === expected.exactUtf8) ?? null; let transformedValueRejected = true; if (expected.name === 'accent-removal-rejected') transformedValueRejected = actual !== removeDiacritics(expected.exactUtf8); if (expected.name === 'partial-translation-rejected') transformedValueRejected = actual !== expected.exactUtf8.slice(0, Math.floor(expected.exactUtf8.length / 2)); if (expected.name === 'nfd-remains-distinct') transformedValueRejected = actual !== expected.exactUtf8.normalize('NFD'); const observed = { language: 'es', name: expected.name, exactUtf8: actual, exactTextPresent: actual === expected.exactUtf8, transformedValueRejected }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  ['en', 'es'].forEach((language, offset) => specs.push(makeSpec(11, offset + 1,
    () => ({ language, htmlLang: language, permanentPath: '#cbpsx-notice.textContent', projectedPath: '[data-cab-bt-parallel-display-notice].textContent', permanentValue: TRANSLATIONS.warning[language], projectedValue: TRANSLATIONS.warning[language], forbiddenPortuguese: FORBIDDEN.pt, matchedPortuguese: [], bothVisible: true }),
    (s, expected) => { const locale = s.locales[language]; const combined = `${locale.notice}\n${locale.projectedNotice}`; const observed = { language, htmlLang: locale.htmlLang, permanentPath: '#cbpsx-notice.textContent', projectedPath: '[data-cab-bt-parallel-display-notice].textContent', permanentValue: locale.notice, projectedValue: locale.projectedNotice, forbiddenPortuguese: FORBIDDEN.pt, matchedPortuguese: FORBIDDEN.pt.filter((expression) => combined.includes(expression)), bothVisible: locale.noticeVisible && locale.projectedNoticeVisible }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  LANGUAGES.forEach((language, offset) => specs.push(makeSpec(12, offset + 1,
    () => ({ language, visibleInPrint: true, candidateIds: REDUCED_MINIMUMS, absenceTexts: [TRANSLATIONS.absence[language](95, 7), TRANSLATIONS.absence[language](120, 7)], warning: TRANSLATIONS.warning[language], installation: TRANSLATIONS.installation[language], printLabel: TRANSLATIONS.printLabel[language], hiddenCandidateIdsAbsent: true }),
    (s, expected) => { const item = s.prints[language]; const observed = { language, visibleInPrint: item.visible, candidateIds: item.cardIds, absenceTexts: expected.absenceTexts.filter((value) => item.exactTexts.includes(value)), warning: item.notice, installation: item.exactTexts.find((value) => value === expected.installation) ?? null, printLabel: item.exactTexts.find((value) => value === expected.printLabel) ?? null, hiddenCandidateIdsAbsent: ['6x300', '7x300', '8x300', '9x300', '10x300'].every((id) => !item.cardIds.includes(id)) }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  const invalidInputs = [['empty', ''], ['fraction', '1.5'], ['zero', '0'], ['negative', '-1'], ['aboveMaximum', '11']];
  invalidInputs.forEach(([name, raw], offset) => specs.push(makeSpec(13, offset + 1,
    () => ({ name, raw, engineCalls: 0, cardIds: [], uiFailureSeparated: true }),
    (s, expected) => { const run = s.invalidRuns[name]; const observed = { name, raw, engineCalls: run.engineCalls, cardIds: run.cardIds, uiFailureSeparated: run.uiFailure === null || (run.uiFailure && !Object.prototype.hasOwnProperty.call(run.uiFailure, 'code')) }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; })));

  specs.push(makeSpec(14, 1, () => ({ theme: 'light', viewportWidth: 375, noHorizontalOverflow: true, catalogVisible: true }), (s, expected) => ({ observed: s.responsive.light, compliant: isDeepStrictEqual(s.responsive.light, expected) })));
  specs.push(makeSpec(14, 2, () => ({ theme: 'dark', viewportWidth: 375, noHorizontalOverflow: true, catalogVisible: true }), (s, expected) => ({ observed: s.responsive.dark, compliant: isDeepStrictEqual(s.responsive.dark, expected) })));
  specs.push(makeSpec(14, 3, () => ({ landmark: true, labelsAssociated: true, confirmationsOutsideAdvanced: true, detailsInitiallyClosed: true }), (s, expected) => ({ observed: s.accessibility.structure, compliant: isDeepStrictEqual(s.accessibility.structure, expected) })));
  specs.push(makeSpec(14, 4, () => ({ maxControlReachedByTab: true, visibleFocusIndicator: true, inlineHandlers: [] }), (s, expected) => ({ observed: s.accessibility.keyboard, compliant: isDeepStrictEqual(s.accessibility.keyboard, expected) })));

  specs.push(makeSpec(15, 1, () => ({ productionAllowed: false, installableSelection: null, installationAuthorized: false, primarySourceComplete: false, iecConformity: false }),
    (s, expected) => { const envelope = s.reducedRun.envelope; const observed = { productionAllowed: envelope?.productionAllowed, installableSelection: envelope?.data?.installableSelection, installationAuthorized: envelope?.data?.installationAuthorized, primarySourceComplete: envelope?.sourceStatus?.primarySourceComplete, iecConformity: envelope?.sourceStatus?.iecConformity }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; }));
  specs.push(makeSpec(15, 2, () => ({ requiredBlockerCodes: ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'], missingBlockerCodes: [], codesVisibleVerbatim: true }),
    (s, expected) => { const codes = (s.reducedRun.envelope?.blockers || []).map((item) => item.code); const text = s.reducedRun.regionText; const observed = { requiredBlockerCodes: expected.requiredBlockerCodes, missingBlockerCodes: expected.requiredBlockerCodes.filter((code) => !codes.includes(code)), codesVisibleVerbatim: expected.requiredBlockerCodes.every((code) => text.includes(code)) }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; }));
  specs.push(makeSpec(15, 3, () => ({ forbiddenInstallableVocabulary: [], uiFailure: null, syntheticDomainCode: false }),
    (s, expected) => { const normalized = removeDiacritics(s.reducedRun.regionText).toLowerCase(); const forbidden = ['recomendado', 'selecionado', 'otimo para instalacao', 'dimensionamento final'].filter((term) => normalized.includes(term)); const failure = s.reducedRun.uiFailure; const observed = { forbiddenInstallableVocabulary: forbidden, uiFailure: failure, syntheticDomainCode: Boolean(failure && Object.prototype.hasOwnProperty.call(failure, 'code')) }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; }));
  specs.push(makeSpec(15, 4, () => ({ finalMemorialClaim: false, positiveIecConformityClaim: false, displayNoticePreserved: 'PRELIMINAR — NÃO UTILIZAR PARA PROJETO, COMPRA OU INSTALAÇÃO' }),
    (s, expected) => { const text = s.reducedRun.regionText; const normalized = removeDiacritics(text).toLowerCase(); const observed = { finalMemorialClaim: /memorial final|final report/.test(normalized) && !/nao e memorial final|not a final report|no es memoria final/.test(normalized), positiveIecConformityClaim: /conforme (?:a )?iec|iec compliant|conformidad iec declarada/.test(normalized), displayNoticePreserved: s.reducedRun.envelope?.displayNotice ?? null }; return { observed, compliant: isDeepStrictEqual(observed, expected) }; }));
  return specs;
}

function validateHarnessConfiguration(specs) {
  const source = fs.readFileSync(__filename, 'utf8');
  const coreBytes = fs.readFileSync(CORE_PATH);
  if (sha256Lf(coreBytes) !== EXPECTED_CORE_SHA256_LF) throw new Error('Core L1–L3 diverge do SHA-256 LF vinculante.');
  if (gitBlobOid(coreBytes) !== EXPECTED_CORE_BLOB) throw new Error('Core L1–L3 diverge do blob Git vinculante.');
  if (EXPECTED_CASES !== 87 || specs.length !== 87) throw new Error(`Matriz inválida: ${specs.length}/87 casos.`);
  const expectedIds = CASE_COUNTS.flatMap((count, reportOffset) => Array.from({ length: count }, (_unused, caseOffset) => caseId(reportOffset + 1, caseOffset + 1)));
  if (!isDeepStrictEqual(specs.map((item) => item.caseId), expectedIds)) throw new Error('caseIds ausentes, extras ou fora da ordem nominal.');
  if (new Set(specs.map((item) => item.caseId)).size !== 87) throw new Error('caseId duplicado.');
  if (specs.some((item) => typeof item.inputFactory !== 'function' || typeof item.verify !== 'function')) throw new Error('Caso sem inputFactory ou verificador funcional.');
  const forbiddenHelpers = [`recursively${'Contains'}`, `recursively${'ContainsAll'}`];
  if (forbiddenHelpers.some((name) => source.includes(name))) throw new Error('Helper recursivo permissivo proibido.');
  const forbiddenMarkers = [`TO${'DO'}`, `PLACE${'HOLDER'}`, `AUTO${'APPROVE'}`];
  if (forbiddenMarkers.some((marker) => source.includes(marker))) throw new Error('Placeholder proibido no oráculo.');
}

async function chromiumPreflight(puppeteer) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    return { attempts: 1, executablePath: puppeteer.executablePath(), browserVersion: await browser.version(), exitCode: 0 };
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

async function executeVisualScenario(puppeteer) {
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
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(serializeError(error)));
    await page.goto(staticServer.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => document.readyState !== 'loading' && window.__parselEnginesReady === true && typeof window.parSelCalculate === 'function', { timeout: 15000 });
    counterCleanup = await attachSelectionEngineCounter(page);

    const snapshot = await page.evaluate(async ({ policy, objectives, languages, translations, forbidden, coreSha }) => {
      const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
      const frames = (count = 8) => new Promise((resolve) => {
        const next = () => (count-- <= 0 ? resolve() : requestAnimationFrame(next));
        requestAnimationFrame(next);
      });
      const copy = (value) => { try { return JSON.parse(JSON.stringify(value)); } catch (_error) { return null; } };
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const set = (element, value) => {
        if (!element) return false;
        if (element.type === 'checkbox') element.checked = Boolean(value);
        else element.value = String(value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      };
      const storageKey = 'ampai-active-module';
      const navigation = {
        key: storageKey,
        before: {
          exists: Object.prototype.hasOwnProperty.call(localStorage, storageKey),
          value: localStorage.getItem(storageKey),
        },
        after: null,
        restored: false,
        switchModuleCalls: 0,
      };
      if (typeof window.switchModule !== 'function') throw new Error('switchModule produtivo indisponível.');
      try {
        window.switchModule('cabling');
        navigation.switchModuleCalls += 1;
        await frames(10);
        await wait(80);

      const region = document.querySelector('#cab-bt-parallel-selection-experimental');
      const control = document.querySelector('#bt-parallel-selection-maxparallel');
      const action = document.querySelector('#cbpsx-calculate');
      const objectiveControl = document.querySelector('#bt-parallel-selection-objective');
      const currentControl = document.querySelector('#bt-parallel-selection-current');
      const voltageControl = document.querySelector('#bt-parallel-selection-voltage');
      const dropControl = document.querySelector('#bt-parallel-selection-drop');
      const catalogConfirmation = document.querySelector('#bt-parallel-selection-catalog-confirmed');
      const hypothesisConfirmation = document.querySelector('#bt-parallel-selection-hypothesis-confirmed');
      const details = region?.querySelector('details[data-advanced]') || null;
      const initialControl = {
        present: Boolean(control), visible: visible(control), enabled: Boolean(control && !control.disabled),
        value: control?.value ?? null, min: control?.getAttribute('min') ?? null,
        max: control?.getAttribute('max') ?? null, step: control?.getAttribute('step') ?? null,
      };
      const initialDetailsClosed = details?.open === false;
      set(currentControl, 1800); set(voltageControl, 400); set(dropControl, 3);
      set(catalogConfirmation, true); set(hypothesisConfirmation, true);

      const originalEngine = window.enumerateCablingBTParallelAlternativesExperimental;
      const observedRuns = [];
      const exactTexts = () => Array.from(region?.querySelectorAll('*') || [])
        .filter((element) => visible(element) && element.childElementCount === 0 && element.textContent.trim())
        .map((element) => element.textContent.trim());
      const collect = (engineCalls) => {
        const run = {
          engineCalls,
          input: copy(window._parSelLast?.input ?? null),
          envelope: copy(window._parSelLast?.envelope ?? null),
          cardIds: Array.from(region?.querySelectorAll('.cbpsx-alt[data-candidate-id]') || []).map((element) => element.getAttribute('data-candidate-id')),
          regionText: region?.innerText || '',
          exactTexts: exactTexts(),
          uiFailure: copy(window._parSelLast?.uiFailure ?? null),
        };
        observedRuns.push(copy(run));
        return run;
      };
      const calculate = async (objective, maximum) => {
        set(objectiveControl, objective); set(control, maximum);
        const before = await window.__qaReadSelectionEngineCallCount();
        action?.click(); await frames(10); await wait(100);
        const after = await window.__qaReadSelectionEngineCallCount();
        return collect(after - before);
      };

      const objectiveRuns = {};
      for (const objective of Object.keys(objectives)) objectiveRuns[objective] = await calculate(objective, 10);
      const reducedRun = await calculate('MIN_TOTAL_COPPER', 7);

      const locales = {};
      for (const language of languages) {
        const before = await window.__qaReadSelectionEngineCallCount();
        window.setLanguage(language);
        await frames(8); await wait(80);
        const after = await window.__qaReadSelectionEngineCallCount();
        const projected = document.querySelector('[data-cab-bt-parallel-display-notice]');
        const permanent = document.querySelector('#cbpsx-notice');
        locales[language] = {
          htmlLang: document.documentElement.lang,
          regionText: region?.innerText || '',
          exactTexts: exactTexts(),
          notice: permanent?.textContent.trim() ?? null,
          projectedNotice: projected?.textContent.trim() ?? null,
          noticeVisible: visible(permanent),
          projectedNoticeVisible: visible(projected),
          engineCalls: after - before,
          closedForbiddenLists: copy(forbidden),
          translationKeys: Object.keys(translations),
        };
      }

      const invalidRuns = {};
      for (const [name, raw] of [['empty', ''], ['fraction', '1.5'], ['zero', '0'], ['negative', '-1'], ['aboveMaximum', '11']]) {
        set(control, raw);
        const before = await window.__qaReadSelectionEngineCallCount();
        action?.click(); await frames(6); await wait(60);
        const after = await window.__qaReadSelectionEngineCallCount();
        invalidRuns[name] = collect(after - before);
      }
      const restoredRun = await calculate('MIN_TOTAL_COPPER', 7);

      const controls = Array.from(region?.querySelectorAll('input,select,textarea,button,[tabindex]') || []);
      const labelsAssociated = controls.filter((item) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(item.tagName)).every((item) => (
        Boolean(item.getAttribute('aria-label') || item.getAttribute('aria-labelledby'))
        || Boolean(item.id && region.querySelector(`label[for="${CSS.escape(item.id)}"]`)) || item.closest('label') !== null
      ));
      const inlineHandlers = Array.from(region?.querySelectorAll('*') || []).flatMap((element) => Array.from(element.attributes)
        .filter((attribute) => /^on/i.test(attribute.name)).map((attribute) => `${element.tagName}:${attribute.name}`));
      const structure = {
        landmark: Boolean(region && region.matches('section[role="region"]')),
        labelsAssociated,
        confirmationsOutsideAdvanced: Boolean(details && catalogConfirmation && hypothesisConfirmation
          && !details.contains(catalogConfirmation) && !details.contains(hypothesisConfirmation)),
        detailsInitiallyClosed: initialDetailsClosed,
      };
      return {
        pageLoaded: true,
        engineAvailable: typeof originalEngine === 'function',
        coreSha256Lf: coreSha,
        initialControl, objectiveRuns, reducedRun, restoredRun, locales, invalidRuns,
        structure, inlineHandlers, navigation,
        allCalls: observedRuns,
      };
      } finally {
        if (navigation.before.exists) localStorage.setItem(storageKey, navigation.before.value);
        else localStorage.removeItem(storageKey);
        navigation.after = {
          exists: Object.prototype.hasOwnProperty.call(localStorage, storageKey),
          value: localStorage.getItem(storageKey),
        };
        navigation.restored = navigation.after.exists === navigation.before.exists
          && navigation.after.value === navigation.before.value;
      }
    }, { policy: POLICY, objectives: OBJECTIVE_ORDERS, languages: LANGUAGES, translations: TRANSLATIONS, forbidden: FORBIDDEN, coreSha: EXPECTED_CORE_SHA256_LF });

    const prints = {};
    for (const language of LANGUAGES) {
      await page.evaluate(async (lang) => {
        window.setLanguage(lang);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, language);
      await page.emulateMediaType('print');
      prints[language] = await page.evaluate(() => {
        const region = document.querySelector('#cab-bt-parallel-selection-experimental');
        const permanent = document.querySelector('#cbpsx-notice');
        const visible = (element) => Boolean(element && getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden');
        return {
          visible: visible(region),
          cardIds: Array.from(region?.querySelectorAll('.cbpsx-alt[data-candidate-id]') || []).map((element) => element.getAttribute('data-candidate-id')),
          exactTexts: Array.from(region?.querySelectorAll('*') || []).filter((element) => element.childElementCount === 0 && element.textContent.trim()).map((element) => element.textContent.trim()),
          notice: permanent?.textContent.trim() ?? null,
        };
      });
      await page.emulateMediaType('screen');
    }

    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
    const responsive = {};
    for (const theme of ['light', 'dark']) {
      responsive[theme] = await page.evaluate((activeTheme) => {
        if (activeTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        const region = document.querySelector('#cab-bt-parallel-selection-experimental');
        const catalog = document.querySelector('#cbpsx-catalog');
        const rect = region?.getBoundingClientRect();
        return {
          theme: activeTheme,
          viewportWidth: innerWidth,
          noHorizontalOverflow: Boolean(region && document.documentElement.scrollWidth === document.documentElement.clientWidth
            && rect.left >= -1 && rect.right <= innerWidth + 1 && region.scrollWidth <= region.clientWidth + 1),
          catalogVisible: Boolean(catalog && getComputedStyle(catalog).display !== 'none' && catalog.getBoundingClientRect().height > 0),
        };
      }, theme);
    }

    await page.evaluate(() => { document.body.setAttribute('tabindex', '-1'); document.body.focus(); });
    let maxControlReachedByTab = false;
    for (let index = 0; index < 90; index += 1) {
      await page.keyboard.press('Tab');
      const activeId = await page.evaluate(() => document.activeElement?.id || '');
      if (activeId === 'bt-parallel-selection-maxparallel') { maxControlReachedByTab = true; break; }
    }
    const focusState = await page.evaluate(() => {
      const element = document.querySelector('#bt-parallel-selection-maxparallel');
      const style = element ? getComputedStyle(element) : null;
      return Boolean(element && document.activeElement === element && style
        && (style.outlineStyle !== 'none' || style.boxShadow !== 'none'));
    });

    return {
      ...snapshot,
      prints,
      responsive,
      accessibility: {
        structure: snapshot.structure,
        keyboard: { maxControlReachedByTab, visibleFocusIndicator: focusState, inlineHandlers: snapshot.inlineHandlers },
      },
      consoleErrors: consoleErrors.slice(),
      pageErrors: pageErrors.slice(),
      invalidTokens: ['undefined', 'NaN', '--'].filter((token) => Object.values(snapshot.locales).some((locale) => locale.regionText.includes(token))),
      browserVersion: await browser.version(),
    };
  } finally {
    if (counterCleanup) await counterCleanup().catch(() => {});
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    await closeServer(server);
  }
}

function evaluateCases(specs, snapshot) {
  const telemetryOk = snapshot.pageLoaded === true && snapshot.engineAvailable === true
    && snapshot.consoleErrors.length === 0 && snapshot.pageErrors.length === 0 && snapshot.invalidTokens.length === 0;
  return specs.map((spec) => {
    const expected = spec.inputFactory();
    const verification = spec.verify(snapshot, expected);
    return {
      caseId: spec.caseId,
      expected,
      observed: verification.observed,
      assertionExercised: true,
      compliant: verification.compliant === true && telemetryOk,
    };
  });
}

function buildReports(cases, telemetry) {
  return IDS.map((id, index) => {
    const reportCases = cases.filter((item) => item.caseId.startsWith(`${id}-CASE-`));
    const compliant = reportCases.length === CASE_COUNTS[index] && reportCases.every((item) => item.compliant);
    return {
      id,
      category: CATEGORY,
      classification: compliant ? 'PASS' : 'FUNCTIONAL_FAILURE',
      compliant,
      assertionExercised: reportCases.length === CASE_COUNTS[index] && reportCases.every((item) => item.assertionExercised),
      expected: { caseIds: Array.from({ length: CASE_COUNTS[index] }, (_unused, offset) => caseId(index + 1, offset + 1)) },
      observed: { cases: reportCases },
      telemetry,
      issues: reportCases.filter((item) => !item.compliant).map((item) => item.caseId),
    };
  });
}

function blockedReports(error) {
  return IDS.map((id, index) => ({
    id, category: CATEGORY, classification: 'INFRA_BLOCKED', compliant: false, assertionExercised: false,
    expected: { caseIds: Array.from({ length: CASE_COUNTS[index] }, (_unused, offset) => caseId(index + 1, offset + 1)) },
    observed: { cases: [] }, telemetry: { pageLoaded: false, consoleErrors: [], pageErrors: [], invalidTokens: [] },
    issues: [`chromium_preflight_failed:${String(error?.message || error)}`],
  }));
}

function validateProtocol(reports, classification) {
  const reportKeys = ['id', 'category', 'classification', 'compliant', 'assertionExercised', 'expected', 'observed', 'telemetry', 'issues'];
  const caseKeys = ['caseId', 'expected', 'observed', 'assertionExercised', 'compliant'];
  const telemetryKeys = ['pageLoaded', 'consoleErrors', 'pageErrors', 'invalidTokens'];
  if (reports.length !== 15 || !isDeepStrictEqual(reports.map((item) => item.id), IDS)) return false;
  if (new Set(reports.map((item) => item.id)).size !== 15) return false;
  if (reports.some((report) => !closedKeys(report, reportKeys) || !closedKeys(report.observed, ['cases'])
    || !closedKeys(report.telemetry, telemetryKeys) || !Array.isArray(report.issues))) return false;
  const cases = reports.flatMap((report) => report.observed.cases);
  if (classification === 'INFRA_BLOCKED') return cases.length === 0 && reports.every((report) => !report.assertionExercised);
  return cases.length === 87 && new Set(cases.map((item) => item.caseId)).size === 87
    && cases.every((item) => closedKeys(item, caseKeys) && item.assertionExercised === true)
    && reports.every((report) => report.assertionExercised === true);
}

function emit(reports, summary) {
  reports.forEach((report) => process.stdout.write(`${REPORT_PREFIX} ${JSON.stringify(report)}\n`));
  process.stdout.write(`${SUMMARY_PREFIX} ${JSON.stringify(summary)}\n`);
}

function factualSummary(classification, reports, preflightExitCode, preflightError, functionalError) {
  const cases = reports.flatMap((report) => report.observed?.cases || []);
  const compliant = reports.filter((report) => report.compliant).length;
  const processExitCode = { PASS: 0, FUNCTIONAL_FAILURE: 1, INFRA_BLOCKED: 2, CONFIG_ERROR: 3 }[classification];
  return {
    classification,
    reports: reports.length,
    expectedReports: 15,
    cases: cases.length,
    expectedCases: 87,
    compliant,
    nonCompliant: reports.length - compliant,
    assertionsExercised: reports.filter((report) => report.assertionExercised).length,
    caseAssertionsExercised: cases.filter((item) => item.assertionExercised).length,
    processExitCode,
    preflightExitCode,
    preflightError: preflightError ? serializeError(preflightError) : null,
    functionalError: functionalError ? serializeError(functionalError) : null,
  };
}

async function main() {
  const specs = makeSpecs();
  try {
    validateHarnessConfiguration(specs);
  } catch (error) {
    const summary = factualSummary('CONFIG_ERROR', [], 0, null, error);
    emit([], summary);
    process.exitCode = 3;
    return;
  }

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (error) {
    const summary = factualSummary('CONFIG_ERROR', [], 0, null, error);
    emit([], summary);
    process.exitCode = 3;
    return;
  }

  let preflight;
  try {
    preflight = await chromiumPreflight(puppeteer);
  } catch (error) {
    const reports = blockedReports(error);
    const classification = validateProtocol(reports, 'INFRA_BLOCKED') ? 'INFRA_BLOCKED' : 'CONFIG_ERROR';
    const summary = factualSummary(classification, reports, 2, error, null);
    emit(reports, summary);
    process.exitCode = summary.processExitCode;
    return;
  }

  try {
    const snapshot = await executeVisualScenario(puppeteer);
    if (snapshot.navigation?.switchModuleCalls !== 1 || snapshot.navigation?.restored !== true) {
      throw new Error(`Falha transacional de navegação: ${JSON.stringify(snapshot.navigation || null)}`);
    }
    const cases = evaluateCases(specs, snapshot);
    let reports = buildReports(cases, {
      pageLoaded: snapshot.pageLoaded,
      consoleErrors: snapshot.consoleErrors,
      pageErrors: snapshot.pageErrors,
      invalidTokens: snapshot.invalidTokens,
    });
    let classification = reports.every((report) => report.compliant) ? 'PASS' : 'FUNCTIONAL_FAILURE';
    if (!validateProtocol(reports, classification)) {
      classification = 'CONFIG_ERROR';
      reports = [];
    }
    const summary = factualSummary(classification, reports, preflight.exitCode, null,
      classification === 'CONFIG_ERROR' ? new Error('Protocolo visual incompleto ou inválido.') : null);
    emit(reports, summary);
    process.exitCode = summary.processExitCode;
  } catch (error) {
    const summary = factualSummary('CONFIG_ERROR', [], preflight.exitCode, null, error);
    emit([], summary);
    process.exitCode = 3;
  }
}

if (require.main === module) {
  main().catch((error) => {
    const summary = factualSummary('CONFIG_ERROR', [], 0, null, error);
    emit([], summary);
    process.exitCode = 3;
  });
}

module.exports = { makeSpecs, validateHarnessConfiguration };
