const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 018 e 019 (UX Cleanup e Header Binding)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Verificar remoção do seletor antigo
    const oldSelector = await page.$('.nav-sidebar .lang-selector');
    if (oldSelector) {
      console.error('❌ Falha: O seletor de idiomas antigo na Sidebar ainda existe no DOM.');
      process.exit(1);
    } else {
      console.log('✅ Seletor antigo da Sidebar foi removido.');
    }

    // 2. Verificar State Binding do Header
    // Por padrão o sistema inicia em "Curto-Circuito" (pela ordem do nav ou state default).
    // Ou pode estar em "Dimensionamento de Cabos". Vamos checar forçando o clique nas navs.
    
    // Teste Aba Dimensionamento (Cabling)
    await page.evaluate(() => {
      // Procurar link da sidebar que aponta para switchModule('cabling')
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const cabLink = links.find(l => l.textContent.includes('Dimensionamento') || l.getAttribute('onclick')?.includes('cabling'));
      if(cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 300));
    
    let headerText = await page.$eval('header', el => el.innerText);
    if (headerText.includes('60364') || headerText.includes('60502') || headerText.includes('Capacidade')) {
      console.log('✅ Header atualizou corretamente para o módulo de Dimensionamento.');
    } else {
      console.error('❌ Falha: A badge normativa não mudou para IEC 60364/60502 no módulo de Dimensionamento.');
      console.error('Texto atual do Header:', headerText);
      process.exit(1);
    }

    // Teste Aba Curto Circuito
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const scLink = links.find(l => l.textContent.includes('Curto-Circuito') || l.getAttribute('onclick')?.includes('shortcircuit'));
      if(scLink) scLink.click();
    });
    await new Promise(r => setTimeout(r, 300));

    headerText = await page.$eval('header', el => el.innerText);
    if (headerText.includes('60909') && headerText.includes('Impedâncias')) {
      console.log('✅ Header atualizou corretamente para o módulo de Curto-Circuito.');
    } else {
      console.error('❌ Falha: A badge normativa não voltou para IEC 60909-0 no módulo de Curto-Circuito.');
      process.exit(1);
    }

    console.log('TDD OS 018 e 019 concluído com sucesso: UX Clean e State Bound aprovados!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
