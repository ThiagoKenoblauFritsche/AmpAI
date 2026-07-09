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

async function waitForApp(page) {
  await page.goto(page.__vis001Url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => (
    document.querySelector('#theme-toggle')
    && document.querySelector('#theme-icon')
    && typeof window.setLanguage === 'function'
    && typeof window.switchModule === 'function'
    && typeof window.switchCablingCard === 'function'
    && typeof window.calculateCablingMT === 'function'
    && typeof window.renderCardMT === 'function'
    && document.querySelector('#btn-mt')
  ), { timeout: 15000 });
}

async function prepareApp(page, { theme = 'dark', language = 'en' } = {}) {
  await page.goto(page.__vis001Url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(({ nextTheme, nextLanguage }) => {
    localStorage.setItem('ampai-theme', nextTheme);
    localStorage.setItem('ampai-lang', nextLanguage);
  }, { nextTheme: theme, nextLanguage: language });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => (
    document.querySelector('#theme-toggle')
    && document.querySelector('#theme-icon')
    && typeof window.setLanguage === 'function'
    && typeof window.switchModule === 'function'
    && typeof window.switchCablingCard === 'function'
    && typeof window.calculateCablingMT === 'function'
    && typeof window.renderCardMT === 'function'
    && document.querySelector('#btn-mt')
  ), { timeout: 15000 });
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

async function collectThemeReport(page) {
  await prepareApp(page, { theme: 'dark', language: 'en' });
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-theme'), { timeout: 10000 });

  return page.evaluate(() => {
    const button = document.querySelector('#theme-toggle');
    const icon = document.querySelector('#theme-icon');
    const svg = button ? button.querySelector('svg') : null;
    const ariaLabel = button ? button.getAttribute('aria-label') : null;
    const title = button ? button.getAttribute('title') : null;
    const iconDataLucide = icon ? icon.getAttribute('data-lucide') : null;
    const svgClass = svg ? svg.getAttribute('class') : null;
    const buttonText = button ? button.textContent : null;
    const htmlHasLightTheme = document.documentElement.hasAttribute('data-theme');
    const theme = htmlHasLightTheme ? 'light' : 'dark';
    const accessibleState = `${ariaLabel || ''} ${title || ''} ${iconDataLucide || ''} ${svgClass || ''} ${buttonText || ''}`.toLowerCase();
    const representsLightAction = /sun|sol|light|claro/.test(accessibleState);
    const representsDarkAction = /moon|lua|dark|escuro/.test(accessibleState);
    const compliant = theme === 'dark' && representsLightAction && !representsDarkAction;

    return {
      case: 'theme-toggle-dark-mode-icon',
      contract: 'dark theme toggle must indicate future action: switch to light theme / sun',
      observed: {
        theme,
        htmlHasDataTheme: htmlHasLightTheme,
        selector: '#theme-toggle #theme-icon',
        ariaLabel,
        title,
        iconDataLucide,
        svgClass,
        buttonText,
        representsLightAction,
        representsDarkAction,
      },
      compliant,
    };
  });
}

async function collectCriteriaTranslationReport(page) {
  await prepareApp(page, { theme: 'dark', language: 'en' });

  return page.evaluate(async () => {
    const waitFrames = (count) => new Promise((resolve) => {
      const step = () => {
        count -= 1;
        if (count <= 0) return resolve();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });

    const setInputValue = (id, value) => {
      const element = document.getElementById(id);
      if (!element) throw new Error(`Campo ausente: #${id}`);
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const report = {
      case: 'criteria-status-english-translation',
      contract: 'English UI must not render Portuguese criteria status text "Dominante"',
      observed: {
        languageBefore: document.documentElement.lang,
        navigationStrategy: [],
        calculationClicked: false,
        tableFound: false,
        criteriaTitleText: null,
        statusTexts: [],
        portugueseDominanteVisible: false,
        englishDominantVisible: false,
        cardTextSample: null,
        errors: [],
      },
      compliant: false,
    };

    try {
      window.setLanguage('en');
      report.observed.navigationStrategy.push('window.setLanguage("en")');
      await waitFrames(4);

      window.switchModule('cabling');
      report.observed.navigationStrategy.push('window.switchModule("cabling")');
      await waitFrames(4);

      window.switchCablingCard('mt');
      report.observed.navigationStrategy.push('window.switchCablingCard("mt")');
      await waitFrames(8);

      const fixtureValues = {
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
        'mt-tscreen': '1.0',
        'mt-tamb': '20',
        'mt-depth': '0.8',
        'mt-rho-soil': '1.0',
        'mt-ncirc': '1',
      };
      Object.entries(fixtureValues).forEach(([id, value]) => setInputValue(id, value));
      window.AmpAI_State = window.AmpAI_State || {};
      Object.assign(window.AmpAI_State, { mtCond: 'Cu', mtIns: 'XLPE' });
      await waitFrames(4);

      const button = document.querySelector('#btn-mt');
      if (!button) throw new Error('Botão #btn-mt ausente.');
      button.click();
      report.observed.calculationClicked = true;
      await waitFrames(16);

      const card = document.querySelector('#card-mt');
      const tables = Array.from(document.querySelectorAll('#card-mt table'));
      const criteriaTable = tables.find((table) => /criteria verification/i.test(table.innerText));
      report.observed.languageAfter = document.documentElement.lang;
      report.observed.cardTextSample = card ? card.innerText.slice(0, 1600) : null;
      report.observed.tableFound = Boolean(criteriaTable);

      if (!criteriaTable) {
        throw new Error('Tabela "Criteria Verification" não encontrada em #card-mt.');
      }

      const titleNode = criteriaTable.closest('div')?.querySelector('div');
      report.observed.criteriaTitleText = titleNode ? titleNode.textContent.trim() : null;
      report.observed.statusTexts = Array.from(criteriaTable.querySelectorAll('tbody tr td:last-child'))
        .map((cell) => cell.innerText.trim())
        .filter(Boolean);
      report.observed.portugueseDominanteVisible = report.observed.statusTexts.some((text) => /\bDominante\b/.test(text));
      report.observed.englishDominantVisible = report.observed.statusTexts.some((text) => /\bDominant\b/.test(text));
      report.compliant = report.observed.tableFound
        && !report.observed.portugueseDominanteVisible
        && report.observed.englishDominantVisible;
    } catch (error) {
      report.observed.errors.push({
        name: error && error.name ? error.name : 'Error',
        message: error && error.message ? error.message : String(error),
      });
    }

    return report;
  });
}

async function main() {
  let browser;
  let server;
  const reports = [];

  try {
    const staticServer = await startStaticServer();
    server = staticServer.server;
    browser = await puppeteer.launch({ headless: 'new' });

    const themePage = await browser.newPage();
    themePage.__vis001Url = staticServer.url;
    reports.push(await collectThemeReport(themePage));

    const criteriaPage = await browser.newPage();
    criteriaPage.__vis001Url = staticServer.url;
    reports.push(await collectCriteriaTranslationReport(criteriaPage));

    assert.equal(reports.length, 2, `VIS-001 deve emitir exatamente 2 relatórios; emitiu ${reports.length}.`);
    for (const report of reports) {
      console.log(`VIS001_REPORT ${JSON.stringify(report)}`);
    }

    const failures = reports.filter((report) => report.compliant !== true);
    assert.equal(
      failures.length,
      0,
      `VIS-001 encontrou ${failures.length}/2 violações visuais/i18n: ${failures.map((report) => report.case).join(', ')}`,
    );
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
