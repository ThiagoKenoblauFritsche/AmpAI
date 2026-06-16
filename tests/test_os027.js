const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 027 (Botão PDF BT i18n)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Mudar idioma para Inglês
    await page.evaluate(() => {
      const enBtn = document.querySelector('.lang-btn[onclick*="en"]');
      if (enBtn) enBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    console.log('✅ Idioma alterado para EN.');

    // Mudar para o módulo de cabos (BT é o padrão)
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const cabLink = links.find(l => l.getAttribute('onclick')?.includes('cabling'));
      if (cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Acionar cálculo para gerar o botão do memorial BT
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if (calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Validar o texto do botão de exportação BT
    const btnText = await page.evaluate(() => {
      const btn = document.querySelector('#btn-export-memorial-bt');
      return btn ? btn.textContent.trim() : null;
    });

    if (!btnText) {
      console.error('❌ Falha: Botão "btn-export-memorial-bt" não encontrado no DOM do BT.');
      process.exit(1);
    }

    if (btnText.includes('Imprimir Memorial Técnico')) {
      console.error(`❌ Falha: O texto do botão BT continua em Português hardcoded ("${btnText}") mesmo após a troca de idioma. Falha no i18n.`);
      process.exit(1);
    }

    console.log(`✅ Texto do botão validado: "${btnText}" (Hardcode PT removido com sucesso).`);
    console.log('TDD OS 027 concluído com sucesso: i18n aprovado para o botão BT!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
