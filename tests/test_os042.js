/**
 * O.S. 042 — TDD RED: responsividade e wiring funcional.
 *
 * Executa em Chromium real. Não modifica arquivos de produção: toda
 * instrumentação de chamadas acontece somente no contexto efêmero da página.
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  let server;
  let browser;

  try {
    console.log('O.S. 042 — iniciando validação RED de responsividade e wiring.');
    server = await startStaticServer();
    const { port } = server.address();
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof window.switchModule === 'function' && typeof window.switchCablingCard === 'function');

    const failures = [];
    const addFailure = (criterion, details) => failures.push({ criterion, details });

    // 375 × 812 — BT e MT não podem criar overflow horizontal.
    for (const card of ['bt', 'mt']) {
      const viewportReport = await page.evaluate((activeCard) => {
        window.switchModule('cabling');
        window.switchCablingCard(activeCard);
        const wrapper = document.getElementById(`wrapper-${activeCard}`);
        const grid = wrapper && wrapper.querySelector('.cabling-grid');
        return {
          module: activeCard.toUpperCase(),
          viewport: { width: window.innerWidth, height: window.innerHeight },
          documentScrollWidth: document.documentElement.scrollWidth,
          wrapperScrollWidth: wrapper && wrapper.scrollWidth,
          wrapperClientWidth: wrapper && wrapper.clientWidth,
          gridScrollWidth: grid && grid.scrollWidth,
          gridClientWidth: grid && grid.clientWidth
        };
      }, card);
      console.log(`RESPONSIVIDADE ${viewportReport.module}: ${JSON.stringify(viewportReport)}`);
      if (viewportReport.documentScrollWidth > viewportReport.viewport.width ||
          viewportReport.wrapperScrollWidth > viewportReport.viewport.width ||
          viewportReport.gridScrollWidth > viewportReport.viewport.width) {
        addFailure(`375x812: Cabos ${viewportReport.module} não pode exceder a largura do viewport`, viewportReport);
      }
    }

    // < 900 px — cada grade que agrupa painéis ICC deve ter uma única coluna
    // efetiva e não pode exceder a largura disponível.
    await page.setViewport({ width: 899, height: 812, isMobile: true });
    const iccReports = await page.evaluate(() => {
      window.switchModule('impedances');
      const groups = [...new Set([...document.querySelectorAll('.icc-panel')]
        .map((panel) => panel.parentElement)
        .filter((parent) => parent && parent.querySelectorAll(':scope > .icc-panel').length > 1))];
      return groups.map((group, index) => {
        const style = window.getComputedStyle(group);
        return {
          group: index + 1,
          panels: group.querySelectorAll(':scope > .icc-panel').length,
          display: style.display,
          gridTemplateColumns: style.gridTemplateColumns,
          scrollWidth: group.scrollWidth,
          clientWidth: group.clientWidth,
          viewportWidth: window.innerWidth
        };
      });
    });
    iccReports.forEach((report) => console.log(`ICC <900: ${JSON.stringify(report)}`));
    for (const report of iccReports) {
      const columns = report.gridTemplateColumns.trim().split(/\s+/).filter(Boolean);
      if (report.display !== 'grid' || columns.length !== 1 || report.scrollWidth > report.clientWidth || report.clientWidth > report.viewportWidth) {
        addFailure('ICC <900 deve empilhar painéis em uma coluna sem compressão ou overflow', report);
      }
    }

    // Wiring do regime mínimo/máximo para os parâmetros térmicos do cabo ICC.
    const regimeReport = await page.evaluate(() => {
      const regime = document.getElementById('icc-regime-cabo');
      const ids = ['icc-campo-thetaE', 'icc-campo-alpha', 'icc-campo-thetaMax'];
      const visibility = () => Object.fromEntries(ids.map((id) => {
        const element = document.getElementById(id);
        const style = window.getComputedStyle(element);
        return [id, { display: style.display, visible: style.display !== 'none' && style.visibility !== 'hidden' }];
      }));
      regime.value = 'minima';
      regime.dispatchEvent(new Event('change', { bubbles: true }));
      const minimum = visibility();
      regime.value = 'maxima';
      regime.dispatchEvent(new Event('change', { bubbles: true }));
      const maximum = visibility();
      return { selector: '#icc-regime-cabo', minimum, maximum };
    });
    console.log(`REGIME ICC: ${JSON.stringify(regimeReport)}`);
    const allVisibleInMinimum = Object.values(regimeReport.minimum).every((field) => field.visible);
    const allHiddenInMaximum = Object.values(regimeReport.maximum).every((field) => !field.visible);
    if (!allVisibleInMinimum || !allHiddenInMaximum) {
      addFailure('Regime mínimo deve exibir thetaE, alpha e thetaMax; máximo deve ocultá-los', regimeReport);
    }

    // Uma ação do usuário deve disparar exatamente um cálculo do respectivo motor.
    await page.setViewport({ width: 1280, height: 800, isMobile: false });
    await page.evaluate(() => {
      window.switchModule('cabling');
      window.switchCablingCard('bt');
      window.__os042BtCalls = 0;
      window.__os042OriginalBt = window.calculateCablingBT;
      window.calculateCablingBT = function(...args) {
        window.__os042BtCalls += 1;
        return window.__os042OriginalBt.apply(this, args);
      };
    });
    await page.click('#btn-bt');
    await delay(100);
    const btCalls = await page.evaluate(() => window.__os042BtCalls);
    console.log(`WIRING BT: botão #btn-bt executou calculateCablingBT ${btCalls} vez(es).`);
    if (btCalls !== 1) addFailure('Um clique em “Calcular BT” deve gerar uma única execução', { selector: '#btn-bt', calls: btCalls });

    await page.evaluate(() => {
      window.switchCablingCard('mt');
      window.__os042MtCalls = 0;
      window.__os042OriginalMt = window.calculateCablingMT;
      window.calculateCablingMT = function(...args) {
        window.__os042MtCalls += 1;
        return window.__os042OriginalMt.apply(this, args);
      };
    });
    await page.click('#btn-mt');
    await delay(100);
    const mtCalls = await page.evaluate(() => window.__os042MtCalls);
    console.log(`WIRING MT: botão #btn-mt executou calculateCablingMT ${mtCalls} vez(es).`);
    if (mtCalls !== 1) addFailure('Um clique em “Calcular MT” deve gerar uma única execução', { selector: '#btn-mt', calls: mtCalls });

    // Registro objetivo da política sticky/scroll em mobile (não é inferência visual).
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    const stickyReport = await page.evaluate(() => {
      const read = (selector) => {
        const element = document.querySelector(selector);
        const style = element && window.getComputedStyle(element);
        return {
          selector,
          found: Boolean(element),
          position: style && style.position,
          top: style && style.top,
          height: style && style.height,
          maxHeight: style && style.maxHeight,
          overflowY: style && style.overflowY
        };
      };
      return { viewport: `${window.innerWidth}x${window.innerHeight}`, navSidebar: read('.nav-sidebar'), sidebar: read('aside.sidebar') };
    });
    console.log(`STICKY/SCROLL MOBILE: ${JSON.stringify(stickyReport)}`);

    assert.equal(failures.length, 0, `O.S. 042: critérios responsivos/wiring violados: ${JSON.stringify(failures)}`);
    console.log('GREEN: responsividade e wiring atendem todos os critérios da O.S. 042.');
  } catch (error) {
    console.error(`FAIL (RED esperado): ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
  }
})();
