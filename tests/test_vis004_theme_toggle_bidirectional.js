'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
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

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

async function loadWithTheme(page, url, theme) {
  await page.evaluateOnNewDocument((requestedTheme) => {
    localStorage.setItem('ampai-theme', requestedTheme);
    localStorage.setItem('ampai-lang', 'en');
  }, theme);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction((expectedTheme) => {
    const root = document.documentElement;
    const button = document.querySelector('#theme-toggle');
    const icon = document.querySelector('#theme-icon');
    if (!button || !icon) return false;
    const isLight = root.hasAttribute('data-theme');
    return expectedTheme === 'light' ? isLight : !isLight;
  }, { timeout: 15000 }, theme);
  await page.waitForFunction(() => {
    const icon = document.querySelector('#theme-icon');
    const svg = document.querySelector('#theme-toggle svg');
    return Boolean(icon && icon.getAttribute('data-lucide') && svg && svg.getAttribute('class'));
  }, { timeout: 15000 });
}

async function evaluateTheme(page, expected) {
  const observed = await page.evaluate(() => {
    const root = document.documentElement;
    const button = document.querySelector('#theme-toggle');
    const icon = document.querySelector('#theme-icon');
    const svg = button ? button.querySelector('svg') : null;
    const rootStyle = getComputedStyle(root);
    const buttonStyle = button ? getComputedStyle(button) : null;
    const htmlClass = root.getAttribute('class');
    const dataTheme = root.getAttribute('data-theme');
    const ariaLabel = button ? button.getAttribute('aria-label') : null;
    const title = button ? button.getAttribute('title') : null;
    const iconDataLucide = icon ? icon.getAttribute('data-lucide') : null;
    const svgClass = svg ? svg.getAttribute('class') : null;
    const svgOuterHTML = svg ? svg.outerHTML : null;
    const buttonText = button ? button.textContent : null;
    const stateText = `${ariaLabel || ''} ${title || ''} ${iconDataLucide || ''} ${svgClass || ''} ${buttonText || ''}`.toLowerCase();

    return {
      dataTheme,
      htmlClass,
      hasLightDataTheme: root.hasAttribute('data-theme'),
      ariaLabel,
      title,
      iconDataLucide,
      svgClass,
      buttonText,
      svgOuterHTML,
      representsSunOrLight: /sun|sol|light|claro/.test(stateText),
      representsMoonOrDark: /moon|lua|dark|escuro/.test(stateText),
      computed: {
        rootBackground: rootStyle.getPropertyValue('--bg-primary').trim(),
        rootText: rootStyle.getPropertyValue('--text-primary').trim(),
        buttonColor: buttonStyle ? buttonStyle.color : null,
        buttonBackground: buttonStyle ? buttonStyle.backgroundColor : null,
      },
    };
  });

  const screenshot = await page.screenshot({
    encoding: 'base64',
    clip: { x: 0, y: 0, width: 260, height: 140 },
  });

  const report = {
    case: expected.case,
    theme: expected.theme,
    expected: {
      currentTheme: expected.theme,
      futureAction: expected.futureAction,
      mustRepresent: expected.mustRepresent,
      mustNotRepresent: expected.mustNotRepresent,
    },
    observed: {
      selector: '#theme-toggle #theme-icon',
      dataTheme: observed.dataTheme,
      htmlClass: observed.htmlClass,
      hasLightDataTheme: observed.hasLightDataTheme,
      ariaLabel: observed.ariaLabel,
      title: observed.title,
      iconDataLucide: observed.iconDataLucide,
      svgClass: observed.svgClass,
      buttonText: observed.buttonText,
      representsSunOrLight: observed.representsSunOrLight,
      representsMoonOrDark: observed.representsMoonOrDark,
      computed: observed.computed,
      svgHash: sha256(observed.svgOuterHTML || ''),
      screenshotHash: sha256(screenshot),
    },
    compliant: false,
  };

  const currentThemeMatches = expected.theme === 'light'
    ? observed.hasLightDataTheme === true
    : observed.hasLightDataTheme === false;

  if (expected.mustRepresent === 'sun') {
    report.compliant = currentThemeMatches
      && observed.representsSunOrLight === true
      && observed.representsMoonOrDark === false
      && observed.iconDataLucide === 'sun';
  } else {
    report.compliant = currentThemeMatches
      && observed.representsMoonOrDark === true
      && observed.representsSunOrLight === false
      && observed.iconDataLucide === 'moon';
  }

  return report;
}

async function main() {
  let browser;
  let server;
  const reports = [];

  try {
    const staticServer = await startStaticServer();
    server = staticServer.server;
    browser = await puppeteer.launch({ headless: 'new' });

    const cases = [
      {
        case: 'dark-theme-toggle-shows-sun',
        theme: 'dark',
        futureAction: 'Switch to light theme',
        mustRepresent: 'sun',
        mustNotRepresent: 'moon',
      },
      {
        case: 'light-theme-toggle-shows-moon',
        theme: 'light',
        futureAction: 'Switch to dark theme',
        mustRepresent: 'moon',
        mustNotRepresent: 'sun',
      },
    ];

    for (const testCase of cases) {
      const page = await browser.newPage();
      await loadWithTheme(page, staticServer.url, testCase.theme);
      reports.push(await evaluateTheme(page, testCase));
      await page.close();
    }

    assert.equal(reports.length, 2, `VIS-004 deve emitir exatamente 2 relatórios; emitiu ${reports.length}.`);
    reports.forEach((report) => {
      console.log(`VIS004_REPORT ${JSON.stringify(report)}`);
    });

    const failures = reports.filter((report) => report.compliant !== true);
    assert.equal(
      failures.length,
      0,
      `VIS-004 encontrou ${failures.length}/2 violações bidirecionais do botão de tema: ${failures.map((report) => report.case).join(', ')}`,
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
