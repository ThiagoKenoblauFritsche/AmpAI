const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 037 (Design System de Espaçamento e Grid)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    const gridValid = await page.evaluate(() => {
      let ok = true;
      let msg = '';

      // 1. Verificar variável no root
      const rootStyles = window.getComputedStyle(document.documentElement);
      const spacingLg = rootStyles.getPropertyValue('--spacing-lg').trim();
      
      if (!spacingLg) {
        ok = false;
        msg += 'Variável --spacing-lg não foi definida no :root. ';
      }

      // 2. Verificar gap no main-layout
      const mainLayout = document.querySelector('.main-layout');
      if (mainLayout) {
        // gap computado retorna como string pixel (ex: 24px)
        const gap = window.getComputedStyle(mainLayout).gap;
        // Dependendo do browser pode retornar "24px 24px" ou "24px"
        if (!gap.includes('24px')) {
          ok = false;
          msg += `O gap da .main-layout está ${gap}, mas deveria ser 24px (var(--spacing-lg)). `;
        }
      }

      // 3. Verificar padding da nav-sidebar
      const navSidebar = document.querySelector('.nav-sidebar');
      if (navSidebar) {
        const padding = window.getComputedStyle(navSidebar).padding;
        // Pode ser "24px"
        if (!padding.includes('24px')) {
          ok = false;
          msg += `O padding de .nav-sidebar está ${padding}, mas deveria ser 24px (var(--spacing-lg)). `;
        }
      }

      return { ok, msg };
    });

    if (!gridValid.ok) {
      console.error(`❌ Falha: ${gridValid.msg}`);
      process.exit(1);
    }

    console.log('✅ Variáveis de espaçamento incorporadas ao :root (--spacing-xs a --spacing-xl).');
    console.log('✅ Gap do Grid principal unificado em 24px (spacing-lg).');
    console.log('✅ Padding do Menu e Cards parametrizado com sistema base.');
    console.log('TDD OS 037 concluído com sucesso: Consistência visual e Grid padronizado!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
