const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 007 e 008 (Redesenho do Header e Seletor de Idiomas)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Procurar por botões de idioma no header
    const langButtons = await page.$$eval('header button[data-lang], header .lang-selector button', btns => btns.map(b => b.textContent.trim().toUpperCase()));
    
    if (langButtons.length < 2) {
      console.error('❌ Falha: O Header não possui os controles de seletor de idiomas (Mínimo PT e EN).');
      process.exit(1);
    } else {
      console.log('✅ Seletor de idiomas encontrado no Header: ' + langButtons.join(', '));
    }

    // Clicar no botão de inglês
    await page.evaluate(() => {
      const btnEn = Array.from(document.querySelectorAll('header button, .lang-selector button')).find(b => b.textContent.toLowerCase().includes('en') || b.getAttribute('data-lang') === 'en');
      if(btnEn) btnEn.click();
    });

    await new Promise(r => setTimeout(r, 300)); // Aguardar debounce e re-render

    // Checar se o idioma ativo global mudou (window.currentLang === 'en' ou html[lang='en'])
    const htmlLang = await page.$eval('html', el => el.getAttribute('lang'));
    if (htmlLang === 'en') {
      console.log('✅ Clicar no seletor do Header mudou o documento para Inglês com sucesso!');
    } else {
      console.error('❌ Falha: O evento de clique no seletor de idiomas não refletiu no DOM (html[lang="en"]).');
      process.exit(1);
    }

    console.log('TDD OS 007 e 008 concluído com sucesso: Header Premium Aprovado!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
