const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 006 (Foco e Reatividade)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Ativar o módulo Cabling e garantir que a aba BT está visível
    await page.evaluate(() => {
      if (typeof window.switchModule === 'function') window.switchModule('cabling');
    });
    await new Promise(r => setTimeout(r, 200)); // aguardar render inicial

    // Focar no campo bt-ib e simular digitação lenta
    await page.focus('#bt-ib');
    
    // Limpar o campo e digitar um valor
    await page.evaluate(() => document.querySelector('#bt-ib').value = '');
    
    // Digita '2', aguarda o debounce, depois '5'
    await page.keyboard.type('2', { delay: 100 });
    
    // Esperar debounce genérico (300ms a 500ms)
    await new Promise(r => setTimeout(r, 600));

    // Verificar onde está o foco
    let activeId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
    
    if (activeId === 'bt-ib') {
      console.log('✅ PASS: Foco mantido no campo bt-ib após o primeiro trigger de cálculo.');
    } else {
      console.error(`❌ FAIL: Foco perdido! Elemento ativo atual: ${activeId}`);
      process.exit(1);
    }

    // Continuar digitando '5' para formar '25'
    await page.keyboard.type('5', { delay: 100 });
    await new Promise(r => setTimeout(r, 600));

    activeId = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
    if (activeId === 'bt-ib') {
      console.log('✅ PASS: Foco mantido após digitação continuada (Caminho Feliz respeitado).');
    } else {
      console.error(`❌ FAIL: Foco perdido na segunda digitação! Elemento ativo atual: ${activeId}`);
      process.exit(1);
    }

    const valor = await page.evaluate(() => document.querySelector('#bt-ib').value);
    if(valor === '25') {
       console.log('✅ PASS: Valor final inputado corretamente: 25.');
    } else {
       console.error(`❌ FAIL: Valor do input esperado 25, mas foi ${valor}`);
       process.exit(1);
    }

    console.log('TDD OS 006 (Preservação de Foco) concluído com sucesso!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
