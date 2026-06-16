const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 030 (Badge e Tabelas Premium)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Verificar Badge na tela inicial (Curto-Circuito)
    let badgeText = await page.evaluate(() => {
      const badge = document.querySelector('.norm-badge');
      return badge ? badge.textContent.trim() : null;
    });

    if (badgeText !== 'IEC 60909-0') {
      console.error(`❌ Falha: Badge não está mostrando 'IEC 60909-0' na página inicial (Curto-Circuito). Está: '${badgeText}'`);
      process.exit(1);
    }
    console.log('✅ Badge correto na página inicial.');

    // 2. Mudar para o módulo de cabos
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link, .nav-item'));
      const cabLink = links.find(l => l.getAttribute('onclick')?.includes('cabling'));
      if (cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Verificar se o Badge atualizou para Cabos
    badgeText = await page.evaluate(() => {
      const badge = document.querySelector('.norm-badge');
      return badge ? badge.textContent.trim() : null;
    });

    if (!badgeText || !badgeText.includes('60502') && !badgeText.includes('60364')) {
      console.error(`❌ Falha: Badge não foi atualizado para as normas de Cabos ao trocar de aba. Continuou: '${badgeText}'`);
      process.exit(1);
    }
    console.log(`✅ Badge atualizado dinamicamente para: '${badgeText}'`);

    // 3. Acionar cálculo genérico para renderizar tabelas
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if (calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // 4. Validar Estilo das Tabelas (th)
    const isTableValid = await page.evaluate(() => {
      const thFirst = document.querySelector('.table-results th:first-child');
      const thLast = document.querySelector('.table-results th:last-child');
      
      if (!thFirst || !thLast) return { ok: false, msg: 'Tabelas ou th não encontrados.' };

      const styleFirst = window.getComputedStyle(thFirst);
      const styleLast = window.getComputedStyle(thLast);

      // letter-spacing costuma ser convertido para px, ex: 0.05em = ~0.6px ou mais
      if (styleFirst.letterSpacing === 'normal' || styleFirst.letterSpacing === '0px') {
        return { ok: false, msg: `th não possui letter-spacing configurado (atual: ${styleFirst.letterSpacing}).` };
      }

      if (styleFirst.borderTopLeftRadius !== '8px') {
        return { ok: false, msg: `th:first-child não possui border-top-left-radius 8px (atual: ${styleFirst.borderTopLeftRadius}).` };
      }

      if (styleLast.borderTopRightRadius !== '8px') {
        return { ok: false, msg: `th:last-child não possui border-top-right-radius 8px (atual: ${styleLast.borderTopRightRadius}).` };
      }

      return { ok: true };
    });

    if (!isTableValid.ok) {
      console.error(`❌ Falha: ${isTableValid.msg}`);
      process.exit(1);
    }

    console.log('✅ Estilos da Tabela (Rounded Corners e Letter-Spacing) aplicados perfeitamente.');
    console.log('TDD OS 030 concluído com sucesso: UI Polish 100% aprovado!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
