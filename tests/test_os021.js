const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 021 (Layout de Impressão)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Simular o modo de impressão
    await page.emulateMediaType('print');
    console.log('✅ Media Type emulado para "print".');

    // Verificar se a barra lateral está oculta
    const sidebarDisplay = await page.evaluate(() => {
      const el = document.querySelector('.nav-sidebar') || document.querySelector('.sidebar');
      if (!el) return 'none'; // Se não existir, ótimo, não será impresso.
      return window.getComputedStyle(el).display;
    });

    if (sidebarDisplay !== 'none') {
      console.error(`❌ Falha: A Sidebar está visível no modo de impressão (display: ${sidebarDisplay}).`);
      process.exit(1);
    } else {
      console.log('✅ Sidebar oculta na impressão.');
    }

    // Verificar se o header está oculto
    const headerDisplay = await page.evaluate(() => {
      const el = document.querySelector('header');
      if (!el) return 'none';
      return window.getComputedStyle(el).display;
    });

    if (headerDisplay !== 'none') {
      console.error(`❌ Falha: O Header Global está visível no modo de impressão (display: ${headerDisplay}).`);
      process.exit(1);
    } else {
      console.log('✅ Header Global oculto na impressão.');
    }

    // Opcional: checar layout principal como bloco e sem box-shadow
    // Isso pode ser mais sutil dependendo do CSS.
    const mainLayoutCheck = await page.evaluate(() => {
      const el = document.querySelector('.main-layout') || document.querySelector('main');
      if (!el) return true;
      const display = window.getComputedStyle(el).display;
      return display === 'block';
    });

    if(!mainLayoutCheck) {
       console.log('⚠️ Aviso: .main-layout não está como block absoluto. Considere forçar display: block no @media print para evitar quebras de grid.');
    }

    console.log('TDD OS 021 concluído com sucesso: Print Media configurada!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
