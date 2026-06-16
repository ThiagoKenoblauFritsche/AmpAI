const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 026 (Botão PDF MT)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Mudar para o módulo de cabos
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const cabLink = links.find(l => l.getAttribute('onclick')?.includes('cabling'));
      if(cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Acionar botão de calcular genérico para gerar os cards
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if(calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Verificar se o botão de exportar existe
    const hasButton = await page.evaluate(() => {
      return !!document.querySelector('#btn-export-memorial-mt');
    });

    if (!hasButton) {
      console.error('❌ Falha: Botão "Exportar PDF" não encontrado no memorial MT.');
      process.exit(1);
    }

    console.log('✅ Botão "Exportar PDF" encontrado no memorial MT.');

    // Interceptar a chamada de impressão para validar que o botão funciona
    await page.evaluate(() => {
      window.printCalled = false;
      window.print = () => { window.printCalled = true; };
    });

    // Clicar no botão
    await page.evaluate(() => {
      const btn = document.querySelector('#btn-export-memorial-mt');
      if (btn) btn.click();
    });
    
    // O evento de exportar pdf tem um setTimeout de 100ms
    await new Promise(r => setTimeout(r, 300));

    const wasPrintCalled = await page.evaluate(() => {
      return window.printCalled;
    });

    if (!wasPrintCalled) {
      console.error('❌ Falha: O clique no botão não chamou window.print(). Ação export-memorial-mt pode estar quebrada.');
      process.exit(1);
    }

    console.log('✅ Clique no botão disparou a impressão com sucesso.');
    console.log('TDD OS 026 concluído com sucesso: Botão de PDF do MT aprovado!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
