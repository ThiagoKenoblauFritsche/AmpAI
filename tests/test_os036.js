const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 036 (Estética Fina e Consistência)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Validar botões, raios e espaçamentos
    const esteticaValid = await page.evaluate(() => {
      let ok = true;
      let msg = '';

      // 1. Verificar fonte herdada do botão (.tab-btn)
      const tabBtn = document.querySelector('.tab-btn');
      if (tabBtn) {
        const fontFamily = window.getComputedStyle(tabBtn).fontFamily.toLowerCase();
        if (fontFamily.includes('arial')) {
          ok = false;
          msg += 'Botões estão usando Arial. Precisam herdar a fonte principal (Inter). ';
        }
      }

      // 2. Verificar border-radius de btn-action
      const btnAction = document.querySelector('.btn-action');
      if (btnAction) {
        const borderRadius = window.getComputedStyle(btnAction).borderRadius;
        if (borderRadius !== '8px') {
          ok = false;
          msg += `A classe .btn-action tem border-radius de ${borderRadius}, mas devia ser 8px. `;
        }
      }

      // 3. Verificar margin-bottom do header
      const header = document.querySelector('header');
      if (header) {
        // 2.5rem equivale a 40px no Chrome Desktop (16px base)
        const marginBottom = window.getComputedStyle(header).marginBottom;
        if (marginBottom !== '40px') {
          ok = false;
          msg += `O margin-bottom do <header> é ${marginBottom}, mas devia ser 40px (2.5rem). `;
        }
      }

      return { ok, msg };
    });

    if (!esteticaValid.ok) {
      console.error(`❌ Falha: ${esteticaValid.msg}`);
      process.exit(1);
    }

    console.log('✅ Fontes dos botões uniformizadas com a base (Inter).');
    console.log('✅ Botões de ação com raio de 8px.');
    console.log('✅ Header com mais respiro (2.5rem).');
    console.log('TDD OS 036 concluído com sucesso: UI/UX Aesthetic Refinement validado!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
