/**
 * O.S. 040 — TDD RED: sinal visual das variantes de resultado.
 *
 * Este teste não altera a aplicação. Ele renderiza, em Chromium real, cartões
 * neutros e variantes dentro dos três contextos de resultado e exige que cada
 * variante tenha ao menos um sinal visual computado diferente do neutro.
 */
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
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

      const contentType = filePath.endsWith('.js') ? 'text/javascript' : filePath.endsWith('.css') ? 'text/css' : 'text/html';
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
  let profileDir;
  let cacheDir;
  let chromiumVersion = 'não retornada (browser não inicializado)';
  let bootstrapStage = 'inicialização';

  try {
    console.log('O.S. 040 — iniciando validação RED de variantes visuais em Chromium.');
    console.log(`AMBIENTE: node=${process.version} puppeteer=${require('puppeteer/package.json').version}`);
    bootstrapStage = 'perfil temporário';
    profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ampai-os040-'));
    cacheDir = path.join(profileDir, 'disk-cache');
    fs.mkdirSync(cacheDir);
    const executablePath = await puppeteer.executablePath();
    console.log(`CHROMIUM: executablePath=${executablePath}`);
    console.log(`CHROMIUM: userDataDir=${profileDir}`);
    console.log(`CHROMIUM: diskCacheDir=${cacheDir}`);
    bootstrapStage = 'startStaticServer';
    server = await startStaticServer();
    const { port } = server.address();
    console.log(`BOOTSTRAP antes de puppeteer.launch: http://127.0.0.1:${port}`);
    bootstrapStage = 'puppeteer.launch';
    browser = await puppeteer.launch({
      headless: 'new',
      dumpio: true,
      timeout: 30000,
      userDataDir: profileDir,
      args: [
        '--use-angle=swiftshader',
        '--use-gl=angle',
        '--disable-features=Vulkan',
        '--disable-gpu-shader-disk-cache',
        `--disk-cache-dir=${cacheDir}`
      ]
    });
    console.log('BOOTSTRAP após puppeteer.launch');
    console.log('BOOTSTRAP antes de browser.newPage');
    chromiumVersion = await browser.version();
    console.log(`CHROMIUM: browser.version=${chromiumVersion}`);
    bootstrapStage = 'browser.newPage';
    const page = await browser.newPage();
    console.log('BOOTSTRAP após browser.newPage');
    // O critério é CSS computado; aguardar rede ociosa torna a prova dependente
    // de recursos externos que não participam da renderização dos cartões.
    console.log(`BOOTSTRAP antes de page.goto: http://127.0.0.1:${port}`);
    bootstrapStage = 'page.goto';
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'domcontentloaded' });
    console.log('BOOTSTRAP após page.goto');
    for (const selector of ['.dashboard', '#card-bt', '#card-mt']) {
      console.log(`BOOTSTRAP antes de page.waitForSelector: ${selector}`);
      bootstrapStage = `page.waitForSelector(${selector})`;
      await page.waitForSelector(selector, { visible: false });
      console.log(`BOOTSTRAP após page.waitForSelector: ${selector}`);
    }

    console.log('BOOTSTRAP antes de page.evaluate');
    bootstrapStage = 'page.evaluate';
    const reports = await page.evaluate(() => {
      const contexts = [
        { module: 'Curto-Circuito', scope: '.dashboard' },
        { module: 'BT', scope: '#card-bt' },
        { module: 'MT', scope: '#card-mt' }
      ];
      const variants = ['success', 'danger', 'info'];

      const styleSnapshot = (element) => {
        const style = window.getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          borderTopColor: style.borderTopColor,
          borderTopStyle: style.borderTopStyle,
          borderTopWidth: style.borderTopWidth,
          color: style.color
        };
      };

      const differsVisually = (neutral, variant) =>
        neutral.backgroundColor !== variant.backgroundColor ||
        neutral.borderTopColor !== variant.borderTopColor ||
        neutral.borderTopStyle !== variant.borderTopStyle ||
        neutral.borderTopWidth !== variant.borderTopWidth ||
        neutral.color !== variant.color;

      return contexts.flatMap(({ module, scope }) => {
        const container = document.querySelector(scope);
        if (!container) {
          return [{ module, selector: scope, error: `Escopo ${scope} não encontrado.` }];
        }

        const fixture = document.createElement('section');
        fixture.setAttribute('data-os040-fixture', module);
        fixture.style.cssText = 'position:absolute;left:-10000px;top:auto;display:grid;';
        fixture.innerHTML = [
          '<div class="result-card" data-os040="neutral">Neutro</div>',
          ...variants.map((variant) => `<div class="result-card ${variant}" data-os040="${variant}">${variant}</div>`)
        ].join('');
        container.appendChild(fixture);

        const neutral = styleSnapshot(fixture.querySelector('[data-os040="neutral"]'));
        const moduleReports = variants.map((variant) => {
          const selector = `.result-card.${variant}`;
          const computed = styleSnapshot(fixture.querySelector(`[data-os040="${variant}"]`));
          return {
            module,
            selector,
            neutralSnapshot: neutral,
            variantSnapshot: computed,
            hasOwnVisualSignal: differsVisually(neutral, computed)
          };
        });
        fixture.remove();
        return moduleReports;
      });
    });
    console.log('BOOTSTRAP após page.evaluate');

    for (const report of reports) {
      console.log(`OS040_REPORT ${JSON.stringify(report)}`);
    }

    const failed = reports.filter((report) => report.error || report.hasOwnVisualSignal !== true);
    assert.equal(
      failed.length,
      0,
      `O.S. 040: cada .result-card.success, .result-card.danger e .result-card.info deve diferir do card neutro por fundo, borda ou cor de texto. Falhas: ${JSON.stringify(failed)}`
    );

    console.log('GREEN: todas as variantes possuem sinal visual próprio.');
  } catch (error) {
    console.error(`FAIL (RED esperado): estágio=${bootstrapStage}; mensagem=${error.message}`);
    console.error(`CHROMIUM: browser.version=${chromiumVersion}`);
    console.error(error.stack || error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
    if (profileDir) fs.rmSync(profileDir, { recursive: true, force: true });
  }
})();
