const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 015 (Padronização UI/UX)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Simular cálculo de BT
    await page.evaluate(() => {
      const btnBt = document.querySelector('[data-tab="bt"]');
      if(btnBt) btnBt.click();
      document.querySelector('#btn-bt').click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Verificar padronização no BT
    const cardBT_HTML = await page.$eval('#card-bt', el => el.innerHTML);
    if (cardBT_HTML.includes('class="memorial-step"') && cardBT_HTML.includes('class="math-block"')) {
      console.log('✅ BT segue a sintaxe de componentes padronizada (.memorial-step, .math-block).');
    } else {
      console.error('❌ Falha: O Card BT não está usando as classes de design system padronizadas!');
      process.exit(1);
    }

    // 2. Simular cálculo de MT
    await page.evaluate(() => {
      const btnMt = document.querySelector('[data-tab="mt"]') || document.querySelector('#btn-mt');
      if(btnMt) btnMt.click();
    });
    // Garantir que clicou no calcular MT
    await page.evaluate(() => document.querySelector('#btn-mt').click());
    await new Promise(r => setTimeout(r, 600));

    // Verificar padronização no MT
    const cardMT_HTML = await page.$eval('#card-mt', el => el.innerHTML);
    if (cardMT_HTML.includes('class="memorial-step"') && cardMT_HTML.includes('class="math-block"')) {
      console.log('✅ MT segue a sintaxe de componentes padronizada (.memorial-step, .math-block).');
    } else {
      console.error('❌ Falha: O Card MT não está usando as classes de design system padronizadas!');
      process.exit(1);
    }

    console.log('TDD OS 015 concluído com sucesso: Coesão Visual Aprovada!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
