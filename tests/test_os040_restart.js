/**
 * O.S. 040-R — QA RED: variantes visuais na baseline restaurada.
 * Executar somente após o preflight Chromium ter passado em runner autorizado.
 */
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');

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

      response.writeHead(200, {
        'Content-Type': filePath.endsWith('.js') ? 'text/javascript' : filePath.endsWith('.css') ? 'text/css' : 'text/html'
      });
      fs.createReadStream(filePath).pipe(response);
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const closeServer = (server) => new Promise((resolve) => server.close(resolve));

(async () => {
  let server;
  let browser;

  try {
    console.log('O.S. 040-R — iniciando prova de estilos computados.');
    server = await startStaticServer();
    const { port } = server.address();
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'domcontentloaded' });
    await Promise.all([
      page.waitForSelector('.dashboard'),
      page.waitForSelector('#card-bt'),
      page.waitForSelector('#card-mt')
    ]);

    const reports = await page.evaluate(() => {
      const contexts = [
        { module: 'Curto-Circuito', scope: '.dashboard' },
        { module: 'BT', scope: '#card-bt' },
        { module: 'MT', scope: '#card-mt' }
      ];
      const variants = ['success', 'danger', 'info'];

      const snapshot = (element) => {
        const style = window.getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          borderColor: style.borderTopColor,
          borderStyle: style.borderTopStyle,
          borderWidth: style.borderTopWidth,
          color: style.color
        };
      };

      const hasOwnVisualSignal = (neutral, variant) =>
        neutral.backgroundColor !== variant.backgroundColor ||
        neutral.borderColor !== variant.borderColor ||
        neutral.borderStyle !== variant.borderStyle ||
        neutral.borderWidth !== variant.borderWidth ||
        neutral.color !== variant.color;

      return contexts.flatMap(({ module, scope }) => {
        const container = document.querySelector(scope);
        if (!container) return [{ module, selector: scope, error: 'Contexto não encontrado.' }];

        const fixture = document.createElement('section');
        fixture.setAttribute('data-os040r-fixture', module);
        fixture.style.cssText = 'position:absolute;left:-10000px;display:grid;';
        fixture.innerHTML = [
          '<div class="result-card" data-variant="neutral">Neutro</div>',
          ...variants.map((variant) => `<div class="result-card ${variant}" data-variant="${variant}">${variant}</div>`)
        ].join('');
        container.appendChild(fixture);

        const neutralSnapshot = snapshot(fixture.querySelector('[data-variant="neutral"]'));
        const contextReports = variants.map((variant) => {
          const variantSnapshot = snapshot(fixture.querySelector(`[data-variant="${variant}"]`));
          return {
            module,
            selector: `.result-card.${variant}`,
            neutralSnapshot,
            variantSnapshot,
            hasOwnVisualSignal: hasOwnVisualSignal(neutralSnapshot, variantSnapshot)
          };
        });
        fixture.remove();
        return contextReports;
      });
    });

    assert.equal(reports.length, 9, `O.S. 040-R requer nove relatórios; obtidos: ${reports.length}.`);
    reports.forEach((report) => console.log(`OS040R_REPORT ${JSON.stringify(report)}`));

    const failures = reports.filter((report) => report.error || report.hasOwnVisualSignal !== true);
    assert.equal(
      failures.length,
      0,
      `O.S. 040-R: cada variante deve diferir do cartão neutro por fundo, borda ou texto. Falhas: ${JSON.stringify(failures)}`
    );
    console.log('GREEN: as nove variantes apresentam sinal visual próprio.');
  } catch (error) {
    console.error(`FAIL (RED esperado): ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
  }
})();
