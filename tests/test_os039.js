const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 039 (Refinamento do Branding no Cabeçalho)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    const headerValid = await page.evaluate(() => {
      let ok = true;
      let msg = '';

      const headerTitle = document.querySelector('.header-title');
      if (!headerTitle) {
        return { ok: false, msg: 'Elemento .header-title não encontrado.' };
      }

      // Verifica se existe o layout flex
      const display = window.getComputedStyle(headerTitle).display;
      if (display !== 'flex') {
        ok = false;
        msg += '.header-title não é um flex container. ';
      }

      // Verifica imagem
      const img = headerTitle.querySelector('img');
      if (!img || !img.src.includes('img/logo.png')) {
        ok = false;
        msg += 'Imagem do logo não encontrada dentro de .header-title. ';
      }

      // Verifica H1 "AmpAI"
      const h1 = headerTitle.querySelector('h1');
      if (!h1 || !h1.textContent.includes('AmpAI')) {
        ok = false;
        msg += 'Título "AmpAI" não encontrado no h1 do header. ';
      }

      // Verifica subtítulo
      const p = headerTitle.querySelector('p');
      if (!p || !p.textContent.includes('Assistente de Engenharia Elétrica')) {
        ok = false;
        msg += 'Subtítulo "Assistente de Engenharia Elétrica" não encontrado. ';
      }

      return { ok, msg };
    });

    if (!headerValid.ok) {
      console.error(`❌ Falha: ${headerValid.msg}`);
      process.exit(1);
    }

    console.log('✅ O cabeçalho possui Layout Flex com a Imagem.');
    console.log('✅ O título H1 principal exibe "AmpAI".');
    console.log('✅ O subtítulo descritivo está posicionado corretamente.');
    console.log('TDD OS 039 concluído com sucesso: Branding e tipografia harmônicos!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
