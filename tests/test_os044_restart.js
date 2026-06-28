/**
 * O.S. 044-R â€” Tribunal RED de acessibilidade dinÃ¢mica.
 *
 * Contrato saudÃ¡vel: todos os relatÃ³rios OS044R_REPORT devem ser conformes.
 * A baseline deve chegar Ã  coleta real no Chromium e falhar por violaÃ§Ãµes de
 * acessibilidade, nunca por erro de bootstrap, seletor ou sintaxe.
 */
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
      const filePath = path.resolve(ROOT, relativePath);
      const relativeToRoot = path.relative(ROOT, filePath);

      if (
        relativeToRoot.startsWith('..') ||
        path.isAbsolute(relativeToRoot) ||
        !fs.existsSync(filePath) ||
        fs.statSync(filePath).isDirectory()
      ) {
        response.writeHead(404).end('Not found');
        return;
      }

      const contentType = filePath.endsWith('.js')
        ? 'text/javascript; charset=utf-8'
        : filePath.endsWith('.css')
          ? 'text/css; charset=utf-8'
          : 'text/html; charset=utf-8';
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

async function inspectInvalidField(page, scenario) {
  const result = await page.evaluate(async ({ moduleName, card, inputSelector, invalidValue, validValue, trigger, bannerSelector }) => {
    const waitFrames = () => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
    const input = document.querySelector(inputSelector);
    const banner = document.querySelector(bannerSelector);

    if (typeof window.switchModule === 'function') window.switchModule(moduleName);
    if (card && typeof window.switchCablingCard === 'function') window.switchCablingCard(card);
    await waitFrames();

    if (!input) {
      return {
        exists: false,
        bannerExists: Boolean(banner),
        invalidState: null,
        correctedState: null
      };
    }

    const activate = () => {
      if (trigger.type === 'click') {
        document.querySelector(trigger.selector)?.click();
      } else if (trigger.type === 'function' && typeof window[trigger.name] === 'function') {
        window[trigger.name]();
      }
    };
    const snapshot = () => {
      const describedBy = input.getAttribute('aria-describedby');
      const descriptionIds = describedBy ? describedBy.trim().split(/\s+/).filter(Boolean) : [];
      return {
        ariaInvalid: input.getAttribute('aria-invalid'),
        ariaDescribedBy: describedBy,
        descriptionIds,
        descriptionTargetsExist: descriptionIds.length > 0 && descriptionIds.every((id) => Boolean(document.getElementById(id))),
        bannerActive: Boolean(banner?.classList.contains('active')),
        bannerText: banner?.textContent?.trim() || ''
      };
    };

    input.value = invalidValue;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    activate();
    await waitFrames();
    const invalidState = snapshot();

    input.value = validValue;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    activate();
    await waitFrames();
    const correctedState = snapshot();

    return {
      exists: true,
      bannerExists: Boolean(banner),
      invalidState,
      correctedState
    };
  }, scenario);

  const invalidIsExposed =
    result.invalidState?.bannerActive === true &&
    result.invalidState?.ariaInvalid === 'true' &&
    Boolean(result.invalidState?.ariaDescribedBy) &&
    result.invalidState?.descriptionTargetsExist === true;
  const correctionClearsAria =
    result.correctedState?.ariaInvalid === null &&
    result.correctedState?.ariaDescribedBy === null;

  return {
    criterion: 'invalid-field-state',
    selector: scenario.inputSelector,
    observed: {
      module: scenario.moduleName,
      bannerSelector: scenario.bannerSelector,
      ...result,
      invalidIsExposed,
      correctionClearsAria
    },
    compliant: result.exists === true && result.bannerExists === true && invalidIsExposed && correctionClearsAria
  };
}

async function inspectKeyboardFocus(page, theme, view) {
  await page.evaluate(async ({ selectedTheme, selectedView }) => {
    const root = document.documentElement;
    if (selectedTheme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    localStorage.setItem('ampai-theme', selectedTheme);

    if (typeof window.switchModule === 'function') window.switchModule(selectedView.moduleName);
    if (selectedView.card && typeof window.switchCablingCard === 'function') {
      window.switchCablingCard(selectedView.card);
    }
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const focusableSelector = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const candidates = [...document.querySelectorAll(focusableSelector)].filter((element) => {
      const style = getComputedStyle(element);
      return !element.disabled &&
        element.getClientRects().length > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden';
    });
    candidates.forEach((element, index) => element.setAttribute('data-os044r-focus-id', `${selectedView.name}-${index}`));
    document.body.setAttribute('tabindex', '-1');
    document.body.focus();
  }, { selectedTheme: theme, selectedView: view });

  const expected = await page.evaluate(() => [...document.querySelectorAll('[data-os044r-focus-id]')]
    .filter((element) => element.getClientRects().length > 0 && !element.disabled)
    .map((element) => ({
      focusId: element.getAttribute('data-os044r-focus-id'),
      selector: element.id ? `#${element.id}` : `${element.tagName.toLowerCase()}[data-os044r-focus-id="${element.getAttribute('data-os044r-focus-id')}"]`
    })));

  const observedById = new Map();
  const maximumTabs = expected.length * 2 + 8;

  for (let index = 0; index < maximumTabs && observedById.size < expected.length; index += 1) {
    await page.evaluate(() => {
      window.__os044rPreviousActiveElement = document.activeElement;
    });
    await page.keyboard.press('Tab');
    await page.waitForFunction(
      () => document.activeElement !== window.__os044rPreviousActiveElement,
      { polling: 'raf', timeout: 5000 }
    );
    const snapshot = await page.evaluate(() => {
      const element = document.activeElement;
      const focusId = element?.getAttribute?.('data-os044r-focus-id');
      if (!focusId) return null;

      const parseColor = (value) => {
        const match = value?.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);
        return match ? [Number(match[1]), Number(match[2]), Number(match[3]), match[4] === undefined ? 1 : Number(match[4])] : null;
      };
      const composite = (foreground, background) => {
        if (!foreground || !background) return null;
        const alpha = foreground[3];
        return [
          foreground[0] * alpha + background[0] * (1 - alpha),
          foreground[1] * alpha + background[1] * (1 - alpha),
          foreground[2] * alpha + background[2] * (1 - alpha),
          1
        ];
      };
      const luminance = (color) => {
        if (!color) return null;
        const channels = color.slice(0, 3).map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.04045 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
        });
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
      };
      const contrastRatio = (first, second) => {
        const firstLuminance = luminance(first);
        const secondLuminance = luminance(second);
        if (firstLuminance === null || secondLuminance === null) return null;
        const lighter = Math.max(firstLuminance, secondLuminance);
        const darker = Math.min(firstLuminance, secondLuminance);
        return (lighter + 0.05) / (darker + 0.05);
      };
      const effectiveBackground = (start) => {
        let current = start;
        while (current) {
          const color = parseColor(getComputedStyle(current).backgroundColor);
          if (color && color[3] > 0) return color;
          current = current.parentElement;
        }
        return [255, 255, 255, 1];
      };
      const parseShadowRing = (boxShadow) => {
        if (!boxShadow || boxShadow === 'none' || boxShadow.includes('inset')) return null;
        const colorText = boxShadow.match(/rgba?\([^)]+\)/i)?.[0] || null;
        const lengths = boxShadow.replace(colorText || '', '').match(/-?[\d.]+px/g)
          ?.map((value) => Number.parseFloat(value)) || [];
        if (lengths.length < 3 || !colorText) return null;
        return {
          color: parseColor(colorText),
          colorText,
          thickness: Math.max(0, lengths.length >= 4 ? lengths[3] : lengths[2])
        };
      };

      const style = getComputedStyle(element);
      const background = effectiveBackground(element.parentElement);
      const outlineColor = parseColor(style.outlineColor);
      const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
      const outlineVisible = style.outlineStyle !== 'none' && outlineWidth > 0 && outlineColor?.[3] > 0;
      const shadowRing = parseShadowRing(style.boxShadow);
      const shadowVisible = Boolean(shadowRing && shadowRing.thickness > 0 && shadowRing.color?.[3] > 0);
      const useOutline = outlineVisible && (!shadowVisible || outlineWidth >= shadowRing.thickness);
      const indicatorColor = useOutline ? outlineColor : shadowRing?.color || null;
      const indicatorThickness = useOutline ? outlineWidth : shadowRing?.thickness || 0;
      const compositedIndicator = indicatorColor ? composite(indicatorColor, background) : null;
      const contrast = contrastRatio(compositedIndicator, background);
      const visible = outlineVisible || shadowVisible;

      return {
        focusId,
        selector: element.id ? `#${element.id}` : element.tagName.toLowerCase(),
        outlineStyle: style.outlineStyle,
        outlineWidth,
        outlineColor: style.outlineColor,
        boxShadow: style.boxShadow,
        indicator: useOutline ? 'outline' : shadowVisible ? 'box-shadow' : 'none',
        indicatorThickness,
        contrast: contrast === null ? null : Number(contrast.toFixed(3)),
        visible,
        compliant: visible && indicatorThickness >= 2 && contrast !== null && contrast >= 3
      };
    });
    if (snapshot && !observedById.has(snapshot.focusId)) observedById.set(snapshot.focusId, snapshot);
  }

  const missing = expected.filter(({ focusId }) => !observedById.has(focusId));
  const observed = [...observedById.values()];
  const failures = observed.filter((item) => !item.compliant);

  return {
    criterion: 'keyboard-focus-indicator',
    selector: `${view.name}:visible-interactive-controls`,
    observed: {
      theme,
      navigation: 'Tab',
      expectedCount: expected.length,
      reachedCount: observed.length,
      missing,
      failures
    },
    compliant: expected.length > 0 && missing.length === 0 && failures.length === 0
  };
}

(async () => {
  let server;
  let browser;
  const reports = [];

  try {
    console.log('O.S. 044-R â€” iniciando Tribunal RED de acessibilidade dinÃ¢mica.');
    server = await startStaticServer();
    const { port } = server.address();
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.dashboard', { timeout: 10000 });
    await page.waitForFunction(
      () => typeof window.switchModule === 'function' && typeof window.switchCablingCard === 'function',
      { timeout: 10000 }
    );

    const bannerReports = await page.evaluate(() => [...document.querySelectorAll('.alert-banner')].map((banner, index) => {
      const selector = banner.id ? `#${banner.id}` : `.alert-banner:nth-of-type(${index + 1})`;
      const observed = {
        role: banner.getAttribute('role'),
        ariaLive: banner.getAttribute('aria-live')
      };
      return {
        criterion: 'alert-semantics',
        selector,
        observed,
        compliant: observed.role === 'alert' && observed.ariaLive === 'assertive'
      };
    }));
    reports.push(...bannerReports);
    if (bannerReports.length === 0) {
      reports.push({
        criterion: 'alert-semantics',
        selector: '.alert-banner',
        observed: { count: 0 },
        compliant: false
      });
    }

    await page.evaluate(() => {
      window.switchModule('cabling');
      window.switchCablingCard('bt');
    });
    await page.waitForSelector('#btn-memorial-bt', { timeout: 10000 });
    await delay(200);
    await page.evaluate(() => window.switchCablingCard('mt'));
    await page.waitForSelector('#btn-memorial-mt', { timeout: 10000 });

    const accordionTargets = [
      { context: 'shortcircuit-static', selector: '.dashboard .accordion-header' },
      { context: 'bt-generated', selector: '#btn-memorial-bt' },
      { context: 'mt-generated', selector: '#btn-memorial-mt' }
    ];
    for (const target of accordionTargets) {
      const accordionReport = await page.evaluate(async ({ context, selector }) => {
        const header = document.querySelector(selector);
        if (!header) {
          return {
            criterion: 'accordion-state',
            selector,
            observed: { context, exists: false },
            compliant: false
          };
        }
        const before = {
          ariaControls: header.getAttribute('aria-controls'),
          ariaExpanded: header.getAttribute('aria-expanded')
        };
        const controlledElementExists = Boolean(before.ariaControls && document.getElementById(before.ariaControls));
        header.click();
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const after = {
          ariaControls: header.getAttribute('aria-controls'),
          ariaExpanded: header.getAttribute('aria-expanded')
        };
        const validBefore = ['true', 'false'].includes(before.ariaExpanded);
        const toggled = validBefore && after.ariaExpanded === String(before.ariaExpanded !== 'true');
        return {
          criterion: 'accordion-state',
          selector,
          observed: { context, exists: true, before, after, controlledElementExists, toggled },
          compliant: Boolean(before.ariaControls) && controlledElementExists && validBefore && toggled
        };
      }, target);
      reports.push(accordionReport);
    }

    const invalidScenarios = [
      {
        moduleName: 'cabling',
        card: 'bt',
        inputSelector: '#bt-length',
        invalidValue: '0',
        validValue: '50',
        trigger: { type: 'click', selector: '#btn-bt' },
        bannerSelector: '#bt-alert-error'
      },
      {
        moduleName: 'cabling',
        card: 'mt',
        inputSelector: '#mt-length',
        invalidValue: '0',
        validValue: '150',
        trigger: { type: 'click', selector: '#btn-mt' },
        bannerSelector: '#mt-alert-error'
      },
      {
        moduleName: 'impedances',
        card: null,
        inputSelector: '#icc-unq',
        invalidValue: '0',
        validValue: '13800',
        trigger: { type: 'function', name: 'calcIccRede' },
        bannerSelector: '#icc-alert-rede'
      }
    ];
    for (const scenario of invalidScenarios) {
      reports.push(await inspectInvalidField(page, scenario));
    }

    const views = [
      { name: 'shortcircuit', moduleName: 'shortcircuit', card: null },
      { name: 'cabling-bt', moduleName: 'cabling', card: 'bt' },
      { name: 'cabling-mt', moduleName: 'cabling', card: 'mt' },
      { name: 'impedances', moduleName: 'impedances', card: null }
    ];
    for (const theme of ['dark', 'light']) {
      for (const view of views) {
        reports.push(await inspectKeyboardFocus(page, theme, view));
      }
    }

    const mainReport = await page.evaluate(() => {
      const elements = [...document.querySelectorAll('main')].map((element) => ({
        selector: element.id ? `#${element.id}` : `main.${[...element.classList].join('.')}`,
        visible: element.getClientRects().length > 0 && getComputedStyle(element).display !== 'none'
      }));
      return {
        criterion: 'single-main-landmark',
        selector: 'main',
        observed: { count: elements.length, elements },
        compliant: elements.length === 1
      };
    });
    reports.push(mainReport);

    const themeReports = await page.evaluate(async () => {
      const definitions = {
        pt: { action: /(alternar|mudar|trocar)/i, light: /clar[oa]/i, dark: /escur[oa]/i },
        en: { action: /(switch|change|toggle)/i, light: /light/i, dark: /dark/i },
        es: { action: /(cambiar|alternar)/i, light: /clar[oa]/i, dark: /oscur[oa]/i }
      };
      const root = document.documentElement;
      const button = document.getElementById('theme-toggle');
      const waitFrames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const snapshot = () => ({
        ariaLabel: button?.getAttribute('aria-label') || null,
        title: button?.getAttribute('title') || null,
        accessibleLabel: button?.getAttribute('aria-label') || button?.getAttribute('title') || '',
        theme: root.hasAttribute('data-theme') ? 'light' : 'dark'
      });
      const results = [];

      for (const [language, patterns] of Object.entries(definitions)) {
        if (typeof window.setLanguage === 'function') window.setLanguage(language);
        root.removeAttribute('data-theme');
        localStorage.setItem('ampai-theme', 'dark');
        await waitFrames();
        const before = snapshot();
        button?.click();
        await waitFrames();
        const after = snapshot();
        const beforeDescribesNextAction = patterns.action.test(before.accessibleLabel) && patterns.light.test(before.accessibleLabel);
        const afterDescribesNextAction = patterns.action.test(after.accessibleLabel) && patterns.dark.test(after.accessibleLabel);
        const changed = before.accessibleLabel !== after.accessibleLabel;
        results.push({
          criterion: 'theme-toggle-i18n-next-action',
          selector: '#theme-toggle',
          observed: { language, before, after, beforeDescribesNextAction, afterDescribesNextAction, changed },
          compliant: Boolean(button) && beforeDescribesNextAction && afterDescribesNextAction && changed
        });
      }
      return results;
    });
    reports.push(...themeReports);

    reports.forEach((report) => console.log(`OS044R_REPORT ${JSON.stringify(report)}`));

    const requiredCriteria = [
      'alert-semantics',
      'accordion-state',
      'invalid-field-state',
      'keyboard-focus-indicator',
      'single-main-landmark',
      'theme-toggle-i18n-next-action'
    ];
    const missingCriteria = requiredCriteria.filter((criterion) => !reports.some((report) => report.criterion === criterion));
    assert.deepEqual(missingCriteria, [], `CritÃ©rios sem relatÃ³rio: ${missingCriteria.join(', ')}`);

    const failures = reports.filter((report) => report.compliant !== true);
    assert.equal(
      failures.length,
      0,
      `Contrato de acessibilidade violado em ${failures.length} de ${reports.length} relatÃ³rios. ` +
        `Falhas: ${JSON.stringify(failures.map(({ criterion, selector }) => ({ criterion, selector })))}`
    );
    console.log(`GREEN: ${reports.length} relatÃ³rios de acessibilidade conformes.`);
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) await closeServer(server);
  }
})();

