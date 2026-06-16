const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 020 (Persistência de Idioma no Cabling)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Alternar para o idioma Espanhol (ES)
    await page.evaluate(() => {
      const btn = document.querySelector('#header-lang-es') || document.querySelector('[data-lang="es"]');
      if(btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    
    let currentLang = await page.evaluate(() => document.documentElement.lang);
    if(currentLang !== 'es') {
      console.error('❌ Falha: O idioma global não mudou para ES.');
      process.exit(1);
    }
    console.log('✅ Idioma global setado para ES.');

    // 2. Trocar para o módulo de Cabos (Cabling)
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const cabLink = links.find(l => l.getAttribute('onclick')?.includes('cabling'));
      if(cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 3. Verificar persistência no card MT
    let mtHTML = await page.evaluate(() => {
      const mtCard = document.querySelector('#mt-params');
      return mtCard ? mtCard.innerHTML : '';
    });

    if (mtHTML.includes('Passo 1') || mtHTML.includes('Dimensionamento')) {
      console.error('❌ Falha: O módulo de cabos renderizou com textos em português (hardcoded) em vez de Espanhol.');
      process.exit(1);
    } else {
      console.log('✅ Textos estáticos não estão vazando em português (Tradução/State Binding aplicados).');
    }

    console.log('TDD OS 020 concluído com sucesso: Persistência de idioma aprovada!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
