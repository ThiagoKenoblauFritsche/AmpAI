const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 024 (Print Aside e Subtextos BT)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Ir para Cabling
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const cabLink = links.find(l => l.getAttribute('onclick')?.includes('cabling'));
      if(cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 2. Acionar Calcular para gerar o card BT e seu memorial
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if(calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // 3. Teste Print Media
    await page.emulateMediaType('print');
    console.log('✅ Emulando modo de impressão (print).');

    const asideDisplay = await page.evaluate(() => {
      const asideBT = document.querySelector('#wrapper-bt aside');
      if (!asideBT) return 'none';
      return window.getComputedStyle(asideBT).display;
    });

    if (asideDisplay !== 'none') {
      console.error(`❌ Falha: A tag <aside> do módulo BT não está oculta na impressão (display: ${asideDisplay}). O PDF vai sair poluído.`);
      process.exit(1);
    } else {
      console.log('✅ Painel lateral (aside) do Cabling ocultado com sucesso na impressão.');
    }

    // Retornar à tela para testar o idioma
    await page.emulateMediaType('screen');

    // 4. Mudar idioma para EN
    await page.evaluate(() => {
      const btn = document.querySelector('[data-lang="en"]') || document.querySelector('#header-lang-en');
      if(btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 5. Verificar textos hardcoded em PT no memorial BT
    const memText = await page.evaluate(() => {
      const container = document.querySelector('#cb-mem-bt-container');
      return container ? container.textContent : '';
    });

    if (memText.includes('Cálculo dos fatores de correção') || 
        memText.includes('Calculada com base') || 
        memText.includes('Determinação da secção mínima')) {
      console.error('❌ Falha: Subtextos com templates literais ainda estão em Português no idioma EN.');
      process.exit(1);
    } else {
      console.log('✅ Subtextos dinâmicos do memorial foram internacionalizados com sucesso.');
    }

    console.log('TDD OS 024 concluído com sucesso: PDF limpo e subtextos traduzidos!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
