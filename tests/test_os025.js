const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 025 (Correção de Grid no Print)...');
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

    // Emular mídia de impressão
    await page.emulateMediaType('print');
    console.log('✅ Emulando modo de impressão (print).');

    // Verificar o container do wrapper BT
    const gridColumnsBT = await page.evaluate(() => {
      // O container é a primeira div filha de #wrapper-bt
      const wrapperBT = document.querySelector('#wrapper-bt > div');
      if (!wrapperBT) return null;
      return window.getComputedStyle(wrapperBT).gridTemplateColumns;
    });

    if (!gridColumnsBT) {
      console.error('❌ Falha: Container grid do BT não encontrado.');
      process.exit(1);
    }

    // Se estiver em modo de impressão, não deve ter uma coluna fixa de 320px
    // Pode ser "none" se for display block, ou "1fr" etc. Mas não "320px ..."
    if (gridColumnsBT.includes('320px')) {
      console.error(`❌ Falha: O grid column ainda aloca 320px vazios na impressão (${gridColumnsBT}). O PDF continuará espremido.`);
      process.exit(1);
    }

    console.log('✅ O Grid do Cabling colapsou corretamente na impressão (Sem a coluna de 320px).');
    console.log('TDD OS 025 concluído com sucesso: Largura total da folha aprovada!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
