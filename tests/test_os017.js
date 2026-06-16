const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 017 (i18n Semântico)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Ativar módulo cabling e garantir que a aba BT está visível
    await page.evaluate(() => {
      if (typeof window.switchModule === 'function') window.switchModule('cabling');
    });
    await new Promise(r => setTimeout(r, 200)); // aguardar render inicial

    // Disparar o cálculo da BT
    await page.evaluate(() => {
      document.querySelector('#btn-bt').click();
    });

    await new Promise(r => setTimeout(r, 600)); // aguardar renderização

    // Checar se o memorial está em português (padrão)
    let cardHTML = await page.$eval('#card-bt', el => el.innerHTML);
    if (cardHTML.includes('Memorial de Cálculo Completo')) {
      console.log('✅ PT-BR padrão detectado: "Memorial de Cálculo Completo" presente.');
    } else {
      console.error('❌ Falha: Texto em PT-BR não detectado no estado inicial!');
      process.exit(1);
    }

    // Agora, simular a troca de idioma. Pode ser invocando a função global `window.setLang('en')` ou similar
    // Como a Fábrica vai criar a arquitetura, vamos tentar disparar um evento global que ela deve implementar ou expor uma função:
    await page.evaluate(() => {
      if(typeof window.setLanguage === 'function') {
        window.setLanguage('en');
      } else {
        // Fallback: tentar clicar num botão se a UI de idiomas existir
        const btnEn = document.querySelector('#lang-en');
        if(btnEn) btnEn.click();
        else throw new Error("Mecanismo de troca de idioma não encontrado (sem window.setLanguage ou #lang-en)");
      }
    });

    await new Promise(r => setTimeout(r, 600)); // Aguardar possível re-render

    // Checar se a tradução ocorreu no DOM
    cardHTML = await page.$eval('#card-bt', el => el.innerHTML);
    if (!cardHTML.includes('Memorial de Cálculo Completo') && (cardHTML.includes('Calculation Memorial') || cardHTML.includes('Calculation'))) {
      console.log('✅ Idioma trocado com sucesso para Inglês no DOM injetado!');
    } else {
      console.error('❌ Falha: O idioma não foi alterado na re-renderização do motor UI.');
      console.error('Snapshot Parcial:', cardHTML.substring(0, 200));
      process.exit(1);
    }

    console.log('TDD OS 017 (Internacionalização) concluído com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
