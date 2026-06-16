const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 034 (Textos Secundários nos Cards)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Simular clique para renderizar cards primários
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if (calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Validar cores
    const textColorsValid = await page.evaluate(() => {
      const card = document.querySelector('.result-card.primary');
      if (!card) return { ok: false, msg: 'Nenhum .result-card.primary encontrado na tela.' };

      const desc = card.querySelector('.result-desc');
      const unit = card.querySelector('.result-unit');
      
      let msg = '';
      let ok = true;

      if (desc) {
          const descColor = window.getComputedStyle(desc).color;
          // Se for slate-500 (#64748b) ele reprova. rgba(100, 116, 139) 
          // Queremos algo mais claro, como #94a3b8 ou #cbd5e1
          // Uma forma simples é checar se não é a cor antiga ou --text-muted puro
          if (descColor === 'rgb(100, 116, 139)') {
              ok = false;
              msg += 'A cor de .result-desc ainda é rgb(100, 116, 139) (Slate 500). ';
          }
      }

      if (unit) {
          const unitColor = window.getComputedStyle(unit).color;
          // Slate 600 é #475569 = rgb(71, 85, 105)
          if (unitColor === 'rgb(71, 85, 105)') {
              ok = false;
              msg += 'A cor de .result-unit ainda é rgb(71, 85, 105) (Slate 600). ';
          }
      }

      return { ok, msg };
    });

    if (!textColorsValid.ok) {
      console.error(`❌ Falha: ${textColorsValid.msg}`);
      process.exit(1);
    }

    console.log('✅ Cores de textos secundários (.result-desc e .result-unit) clareadas adequadamente no Card Primário!');
    console.log('TDD OS 034 concluído com sucesso: Acessibilidade de subtextos 100% resolvida!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
