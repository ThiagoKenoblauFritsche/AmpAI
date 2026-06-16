const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 029 (Premium Inputs e Segmented Controls)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Validar CSS dos formulários
    const isValid = await page.evaluate(() => {
      // 1. Verificar .form-control margin-bottom
      const formControl = document.querySelector('.form-control');
      if (!formControl) return { ok: false, msg: 'Nenhum .form-control encontrado.' };
      const fcStyle = window.getComputedStyle(formControl);
      // 1.25rem costuma ser 20px no Chromium (16px base)
      if (fcStyle.marginBottom !== '20px') {
          return { ok: false, msg: `.form-control não tem 1.25rem de gap (atual: ${fcStyle.marginBottom})` };
      }

      // 2. Verificar label font-weight
      const label = document.querySelector('label');
      if (!label) return { ok: false, msg: 'Nenhum label encontrado.' };
      const lblStyle = window.getComputedStyle(label);
      if (lblStyle.fontWeight !== '500') {
          return { ok: false, msg: `label não possui font-weight 500 (atual: ${lblStyle.fontWeight})` };
      }

      // 3. Verificar border-radius do input
      const input = document.querySelector('input[type="number"]');
      if (!input) return { ok: false, msg: 'Nenhum input type=number encontrado.' };
      const inStyle = window.getComputedStyle(input);
      if (inStyle.borderBottomLeftRadius !== '8px') {
          return { ok: false, msg: `input não possui border-radius 8px (atual: ${inStyle.borderBottomLeftRadius})` };
      }

      // 4. Verificar segmented control
      const toggleGroup = document.querySelector('.toggle-btn-group');
      if (!toggleGroup) return { ok: false, msg: 'Nenhum .toggle-btn-group encontrado.' };
      const groupStyle = window.getComputedStyle(toggleGroup);
      if (groupStyle.borderBottomLeftRadius !== '8px') {
          return { ok: false, msg: `.toggle-btn-group não possui border-radius 8px (atual: ${groupStyle.borderBottomLeftRadius})` };
      }

      return { ok: true };
    });

    if (!isValid.ok) {
      console.error(`❌ Falha: ${isValid.msg}`);
      process.exit(1);
    }

    console.log(`✅ Formulários e Controles passaram pelas diretrizes Premium (Gaps e Border Radius ajustados).`);
    console.log('TDD OS 029 concluído com sucesso: Inputs aprovados!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
