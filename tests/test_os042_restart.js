/**
 * O.S. 042-R — QA RED: responsividade mobile do módulo Cabos.
 *
 * Contrato saudável: em viewport mobile, o documento não deve ter overflow
 * horizontal. Na baseline com quebra, a suíte deve coletar métricas reais no
 * Chromium, imprimir exatamente um OS042R_REPORT e falhar com exit code 1.
 */
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const VIEWPORT = {
  width: 375,
  height: 812,
  deviceScaleFactor: 1,
  isMobile: true
};

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
      const filePath = path.resolve(ROOT, relativePath);

      if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        response.writeHead(404).end('Not found');
        return;
      }

      const contentType = filePath.endsWith('.js')
        ? 'text/javascript'
        : filePath.endsWith('.css')
          ? 'text/css'
          : 'text/html';
      response.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(response);
    });

    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

(async () => {
  let server;
  let browser;

  try {
    console.log('O.S. 042-R — iniciando prova RED de responsividade mobile do módulo Cabos.');
    server = await startStaticServer();
    const { port } = server.address();

    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.dashboard', { timeout: 10000 });
    await page.waitForFunction(() => typeof window.switchModule === 'function', { timeout: 10000 });

    const report = await page.evaluate(async (viewport) => {
      const waitFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
      let navigationStrategy = 'unresolved';

      if (typeof window.switchModule === 'function') {
        window.switchModule('cabling');
        navigationStrategy = 'window.switchModule("cabling")';
      } else {
        const nav = document.querySelector('#nav-cabling');
        if (nav) {
          nav.click();
          navigationStrategy = 'click #nav-cabling';
        }
      }

      await waitFrame();
      await waitFrame();

      const moduleCabling = document.querySelector('#module-cabling');
      const cardStates = ['bt', 'mt'];
      const documentMetricSamples = [];
      const elements = [];

      const measureDocument = (activeCard) => ({
        activeCard,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      });

      const measureElement = (selector, activeCard) => {
        const element = document.querySelector(selector);
        if (!element) {
          return {
            selector,
            activeCard,
            exists: false,
            boundingClientRect: null,
            viewportWidth: window.innerWidth,
            overflowsRight: false,
            overflowsLeft: false
          };
        }

        const rect = element.getBoundingClientRect();
        const boundingClientRect = {
          left: Number(rect.left.toFixed(3)),
          right: Number(rect.right.toFixed(3)),
          width: Number(rect.width.toFixed(3))
        };
        return {
          selector,
          activeCard,
          exists: true,
          boundingClientRect,
          viewportWidth: window.innerWidth,
          overflowsRight: rect.right > window.innerWidth + 0.5,
          overflowsLeft: rect.left < -0.5
        };
      };

      for (const activeCard of cardStates) {
        if (typeof window.switchCablingCard === 'function') {
          window.switchCablingCard(activeCard);
          await waitFrame();
          await waitFrame();
        }

        documentMetricSamples.push(measureDocument(activeCard));
        elements.push(measureElement('#module-cabling', activeCard));
        elements.push(measureElement(`#card-${activeCard}`, activeCard));
      }

      const documentMetrics = documentMetricSamples.reduce((worst, sample) => (
        sample.scrollWidth > worst.scrollWidth ? sample : worst
      ), documentMetricSamples[0]);

      return {
        viewport: {
          width: viewport.width,
          height: viewport.height
        },
        documentMetrics,
        documentMetricSamples,
        navigationStrategy,
        moduleVisible: Boolean(moduleCabling && getComputedStyle(moduleCabling).display !== 'none'),
        elements
      };
    }, VIEWPORT);

    console.log(`OS042R_REPORT ${JSON.stringify(report)}`);

    assert.equal(
      report.moduleVisible,
      true,
      `O módulo Cabos deveria estar visível antes da medição. Relatório: ${JSON.stringify(report)}`
    );
    assert.equal(
      report.documentMetrics.hasHorizontalOverflow,
      false,
      `Viewport 375x812 não pode ter overflow horizontal no módulo Cabos. ` +
        `scrollWidth=${report.documentMetrics.scrollWidth}, clientWidth=${report.documentMetrics.clientWidth}.`
    );

    console.log('GREEN: módulo Cabos sem overflow horizontal em viewport mobile.');
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
  }
})();
