const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 016 (Correção Visual da Tela Metálica)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Simular cálculo de MT para garantir que a Tela Metálica renderize
    await page.evaluate(() => {
      const btnMt = document.querySelector('[data-tab="mt"]') || document.querySelector('#btn-mt');
      if(btnMt) btnMt.click();
    });
    // Garantir que clicou no calcular MT
    await page.evaluate(() => document.querySelector('#btn-mt').click());
    await new Promise(r => setTimeout(r, 600));

    // Verificar se o background divergente foi removido
    const cardMT_HTML = await page.$eval('#card-mt', el => el.innerHTML);
    
    // O texto 'linear-gradient' não deve existir no card
    if (cardMT_HTML.includes('linear-gradient')) {
      console.error('❌ Falha: A cor de fundo divergente (linear-gradient) ainda existe no Card da Tela Metálica!');
      process.exit(1);
    } else {
      console.log('✅ Background hardcoded divergente (linear-gradient) foi removido.');
    }

    // Verificar se existe um result-card com título "Tela Metálica"
    if (cardMT_HTML.includes('Tela Metálica')) {
      console.log('✅ Card da Tela Metálica está sendo renderizado corretamente sem a sujeira inline.');
    } else {
      console.error('❌ Falha: Card da Tela Metálica não foi encontrado no layout.');
      process.exit(1);
    }

    console.log('TDD OS 016 concluído com sucesso: Padronização de Cor Aprovada!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
