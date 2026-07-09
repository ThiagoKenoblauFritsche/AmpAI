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

async function collectReport(page, url) {
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ampai-theme', 'light');
    localStorage.setItem('ampai-lang', 'en');
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => (
    document.querySelector('#theme-toggle')
    && document.querySelector('#theme-icon')
    && document.documentElement.hasAttribute('data-theme')
  ), { timeout: 15000 });

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
    const observedState = `${ariaLabel || ''} ${title || ''} ${iconDataLucide || ''} ${svgClass || ''} ${buttonText || ''}`.toLowerCase();
    const representsDarkAction = /moon|lua|dark|escuro/.test(observedState);
    const representsLightAction = /sun|sol|light|claro/.test(observedState);

    return {
      case: 'theme-toggle-light-mode-icon',
      theme,
      contract: 'light theme toggle must indicate future action: switch to dark theme / moon',
      observed: {
        selector: '#theme-toggle #theme-icon',
        ariaLabel,
        title,
        iconDataLucide,
        svgClass,
        buttonText,
        htmlHasDataTheme: htmlHasLightTheme,
        representsDarkAction,
        representsLightAction,
      },
      compliant: theme === 'light' && representsDarkAction && !representsLightAction,
    };
  });
}

async function main() {
  let browser;
  let server;

  try {
    const staticServer = await startStaticServer();
    server = staticServer.server;
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const report = await collectReport(page, staticServer.url);

    console.log(`VIS003_REPORT ${JSON.stringify(report)}`);
    assert.equal(report.compliant, true, `VIS-003: botão em tema claro deve indicar lua/dark/moon, não sol/light/sun. Observado: ${JSON.stringify(report)}`);
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
});
