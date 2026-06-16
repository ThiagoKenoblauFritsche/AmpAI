const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando TDD para OS 13...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('Página carregada.');

    // Navegar para a aba de Média Tensão
    // No layout pode não ter [data-tab="mt"], vou apenas focar no form-mt
    // Se não estiver visível, podemos forçar clique no botão "btn-mt"
    
    // Acionar o botão de calcular MT
    await page.evaluate(() => {
      document.querySelector('#btn-mt').click();
    });
    console.log('Botão Calcular MT clicado via eval.');

    // Aguardar o DOM atualizar (injectWithRetry usa setTimeout)
    await new Promise(r => setTimeout(r, 1000));

    // Verificar se o card MT foi renderizado
    const cardHTML = await page.$eval('#card-mt', el => el.innerHTML);
    
    // Validar se o memorial está no HTML
    if (cardHTML.includes('Memorial de Cálculo Completo')) {
      console.log('✅ Memorial de Média Tensão renderizado no DOM.');
    } else {
      console.error('❌ Falha: Memorial de MT não encontrado no DOM!');
      process.exit(1);
    }

    // Validar os passos
    if (cardHTML.includes('S₁ — Ampacidade') && cardHTML.includes('S₂ — Queda de Tensão') && cardHTML.includes('S₃ — Curto Adiabático')) {
      console.log('✅ Passos S1, S2 e S3 estão presentes no Memorial MT.');
    } else {
      console.error('❌ Falha: Passos do cálculo não encontrados!');
      process.exit(1);
    }

    console.log('TDD OS 13 executado com sucesso (Caminho Feliz).');
  } catch (error) {
    console.error('Erro na execução do TDD:', error);
  } finally {
    await browser.close();
  }
})();
