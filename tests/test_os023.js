const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 023 (Re-renderização MT e Badge i18n)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Trocar para Módulo Cabling
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const cabLink = links.find(l => l.getAttribute('onclick')?.includes('cabling'));
      if(cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 2. Acionar Calcular para gerar _lastMTPayload
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if(calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // 3. Mudar idioma global para ES
    await page.evaluate(() => {
      const btn = document.querySelector('[data-lang="es"]') || document.querySelector('#header-lang-es');
      if(btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 4. Checar Badge
    const badgeText = await page.evaluate(() => {
      const methodSpan = document.querySelector('[data-i18n="header.method"]') || document.querySelector('[data-i18n="header.cabling.method"]');
      return methodSpan ? methodSpan.textContent : '';
    });

    if (badgeText.includes('Impedancias') || badgeText.includes('Condução') || badgeText.includes('Método')) {
      console.error(`❌ Falha: Badge text incorreto para ES no módulo cabling. Encontrado: "${badgeText}".`);
      process.exit(1);
    } else {
      console.log('✅ Badge text alterado com sucesso via sistema i18n dinâmico.');
    }

    // 5. Checar Card MT se está em Espanhol
    const mtHTML = await page.evaluate(() => {
      const mtCard = document.querySelector('#card-mt');
      return mtCard ? mtCard.innerHTML : '';
    });

    if (!mtHTML.includes('Sección Adoptada') && !mtHTML.includes('SECCIÓN ADOPTADA')) {
      console.error('❌ Falha: Card MT não foi re-renderizado para ES (Textos presos no EN ou PT). Falha no setLanguage.');
      process.exit(1);
    } else {
      console.log('✅ Card MT re-renderizado instantaneamente no setLanguage.');
    }

    console.log('TDD OS 023 concluído com sucesso: Badge dinâmico e MT render testados!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
