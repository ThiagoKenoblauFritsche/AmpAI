/**
 * O.S. 044 — TDD RED: acessibilidade dinâmica.
 * A instrumentação e as interações abaixo ocorrem apenas no Chromium de teste.
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

const closeServer = (server) => new Promise((resolve) => server.close(resolve));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  let server;
  let browser;
  try {
    console.log('O.S. 044 — iniciando validação RED de acessibilidade dinâmica.');
    server = await startStaticServer();
    const { port } = server.address();
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof window.switchModule === 'function' && typeof window.switchCablingCard === 'function');

    const failures = [];
    const fail = (criterion, details) => failures.push({ criterion, details });

    const banners = await page.evaluate(() => [...document.querySelectorAll('.alert-banner')].map((banner) => ({
      selector: banner.id ? `#${banner.id}` : '.alert-banner',
      role: banner.getAttribute('role'),
      ariaLive: banner.getAttribute('aria-live')
    })));
    console.log(`BANNERS: ${JSON.stringify(banners)}`);
    const invalidBanners = banners.filter((banner) => banner.role !== 'alert' || banner.ariaLive !== 'assertive');
    if (invalidBanners.length) fail('Todo banner de erro deve possuir role="alert" e aria-live="assertive"', invalidBanners);

    // Gera os acordeões BT/MT e verifica o contrato ARIA antes e após o clique.
    await page.evaluate(() => {
      window.switchModule('cabling');
      window.switchCablingCard('bt');
    });
    await delay(100);
    const accordionReports = await page.evaluate(() => [...document.querySelectorAll('.accordion-header')]
      .map((header, index) => ({
        index,
        selector: header.id ? `#${header.id}` : `.accordion-header[${index}]`,
        ariaControls: header.getAttribute('aria-controls'),
        ariaExpanded: header.getAttribute('aria-expanded'),
        visible: header.getClientRects().length > 0 && getComputedStyle(header).display !== 'none'
      })));
    const accordionHandles = await page.$$('.accordion-header');
    for (const report of accordionReports) {
      const { index, selector } = report;
      const before = { ariaControls: report.ariaControls, ariaExpanded: report.ariaExpanded };
      if (!before.ariaControls || !['true', 'false'].includes(before.ariaExpanded)) {
        fail('Acordeão deve declarar aria-controls e aria-expanded inicial', { selector, ...before });
        continue;
      }
      const controlsExists = await page.$(`#${before.ariaControls}`);
      if (!controlsExists) {
        fail('aria-controls do acordeão deve referenciar conteúdo existente', { selector, ...before });
        continue;
      }
      if (!report.visible) continue;
      await accordionHandles[index].click();
      const after = await accordionHandles[index].evaluate((header) => ({ ariaExpanded: header.getAttribute('aria-expanded') }));
      console.log(`ACORDEÃO ${selector}: antes=${JSON.stringify(before)} depois=${JSON.stringify(after)}`);
      if (after.ariaExpanded === before.ariaExpanded) {
        fail('Clique no acordeão deve alternar aria-expanded', { selector, before, after });
      }
    }

    // Erro físico BT: atributo deve nascer no erro e desaparecer após correção.
    await page.$eval('#bt-length', (input) => { input.value = '0'; input.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.click('#btn-bt');
    await delay(80);
    const invalidState = await page.$eval('#bt-length', (input) => ({
      ariaInvalid: input.getAttribute('aria-invalid'),
      ariaDescribedBy: input.getAttribute('aria-describedby')
    }));
    await page.$eval('#bt-length', (input) => { input.value = '50'; input.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.click('#btn-bt');
    await delay(80);
    const correctedState = await page.$eval('#bt-length', (input) => ({
      ariaInvalid: input.getAttribute('aria-invalid'),
      ariaDescribedBy: input.getAttribute('aria-describedby')
    }));
    console.log(`CAMPO INVÁLIDO #bt-length: erro=${JSON.stringify(invalidState)} corrigido=${JSON.stringify(correctedState)}`);
    if (invalidState.ariaInvalid !== 'true' || !invalidState.ariaDescribedBy) {
      fail('Campo inválido deve receber aria-invalid="true" e aria-describedby', { selector: '#bt-length', invalidState });
    }
    if (correctedState.ariaInvalid !== null || correctedState.ariaDescribedBy !== null) {
      fail('Campo corrigido deve remover aria-invalid e aria-describedby', { selector: '#bt-length', correctedState });
    }

    // Indicador de foco: 2 px mínimo e contraste >= 3:1 contra o fundo efetivo.
    const focusReports = await page.evaluate(() => {
      const toRgb = (color) => {
        const match = color && color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return match ? match.slice(1, 4).map(Number) : null;
      };
      const luminance = ([r, g, b]) => [r, g, b].map((value) => {
        const normalized = value / 255;
        return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
      }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      const contrast = (a, b) => {
        if (!a || !b) return null;
        const [la, lb] = [luminance(a), luminance(b)].sort((x, y) => y - x);
        return (la + 0.05) / (lb + 0.05);
      };
      const background = (element) => {
        let current = element;
        while (current) {
          const rgb = toRgb(getComputedStyle(current).backgroundColor);
          if (rgb) return rgb;
          current = current.parentElement;
        }
        return toRgb(getComputedStyle(document.body).backgroundColor);
      };
      const controls = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.disabled && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
      return controls.map((element) => {
        element.focus();
        const style = getComputedStyle(element);
        const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
        const outlineColor = toRgb(style.outlineColor);
        return {
          selector: element.id ? `#${element.id}` : element.tagName.toLowerCase(),
          outlineStyle: style.outlineStyle,
          outlineWidth,
          outlineColor: style.outlineColor,
          contrast: contrast(outlineColor, background(element))
        };
      });
    });
    console.log(`FOCO: ${JSON.stringify(focusReports)}`);
    const insufficientFocus = focusReports.filter((report) => report.outlineStyle === 'none' || report.outlineWidth < 2 || report.contrast === null || report.contrast < 3);
    if (insufficientFocus.length) fail('Todo controle interativo deve apresentar foco visível com contraste >= 3:1', insufficientFocus);

    // Há exatamente um main efetivamente ativo em cada módulo navegável.
    const activeMainReports = [];
    for (const moduleName of ['shortcircuit', 'cabling', 'impedances']) {
      const report = await page.evaluate((module) => {
        window.switchModule(module);
        const active = [...document.querySelectorAll('main')].filter((element) => {
          const style = getComputedStyle(element);
          return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
        }).map((element) => ({ id: element.id || null, className: element.className || null }));
        return { module, active };
      }, moduleName);
      activeMainReports.push(report);
      if (report.active.length !== 1) fail('A estrutura deve possuir somente um elemento <main> ativo', report);
    }
    console.log(`MAIN ATIVO: ${JSON.stringify(activeMainReports)}`);

    // Tema: o nome acessível deve ser traduzido e descrever a próxima ação.
    const themeReport = await page.evaluate(() => {
      const button = document.getElementById('theme-toggle');
      const label = () => button.getAttribute('aria-label') || button.getAttribute('title') || '';
      if (typeof window.setLanguage === 'function') window.setLanguage('pt');
      const pt = label();
      button.click();
      const ptAfterToggle = label();
      if (typeof window.setLanguage === 'function') window.setLanguage('en');
      const en = label();
      return { pt, ptAfterToggle, en, theme: document.documentElement.getAttribute('data-theme') || 'dark' };
    });
    console.log(`TEMA/I18N: ${JSON.stringify(themeReport)}`);
    const vagueToggle = /alternar|toggle/i;
    if (!themeReport.pt || !themeReport.en || themeReport.pt === themeReport.en || vagueToggle.test(themeReport.pt) || vagueToggle.test(themeReport.ptAfterToggle)) {
      fail('O rótulo do seletor de tema deve ser i18n e informar a próxima ação, não apenas “alternar”', themeReport);
    }

    assert.equal(failures.length, 0, `O.S. 044: violações de acessibilidade: ${JSON.stringify(failures)}`);
    console.log('GREEN: todos os critérios de acessibilidade dinâmica foram atendidos.');
  } catch (error) {
    console.error(`FAIL (RED esperado): ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
  }
})();
