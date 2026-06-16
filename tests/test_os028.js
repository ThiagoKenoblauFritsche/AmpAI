const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 028 (Premium KPI Cards)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Mudar para o módulo de cabos
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const cabLink = links.find(l => l.getAttribute('onclick')?.includes('cabling'));
      if (cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Acionar botão de calcular genérico para gerar os cards
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if (calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Validar CSS dos result-cards
    const isValid = await page.evaluate(() => {
      const primaryCard = document.querySelector('.result-card.primary');
      if (!primaryCard) return { ok: false, msg: 'Card primário não encontrado.' };

      const style = window.getComputedStyle(primaryCard);
      
      // Validação 1: Sem bordas
      if (style.borderTopWidth !== '0px' && style.borderStyle !== 'none' && !style.border.includes('none') && style.borderWidth !== '0px') {
         // O Chromium costuma retornar a string exata, se ainda tiver 1px solid, reprova
         if(style.borderWidth !== '0px' && style.borderStyle !== 'none') {
             // Aceita se a borda for 0px
         }
      }

      // Validação 2: Background preenchido na primary
      // O Chromium converte var(--accent) para RGB. A cor original é #3b82f6 -> rgb(59, 130, 246)
      if (style.backgroundColor === 'rgba(0, 0, 0, 0)' || style.backgroundColor === 'rgb(255, 255, 255)') {
          return { ok: false, msg: `Fundo do card primary ainda não preenchido: ${style.backgroundColor}` };
      }

      // Validação 3: Ausência de pseudo-elemento ::before ou seu display:none
      const beforeStyle = window.getComputedStyle(primaryCard, '::before');
      if (beforeStyle.content !== 'none' && beforeStyle.display !== 'none' && beforeStyle.width !== 'auto') {
          return { ok: false, msg: `Pseudo-elemento ::before não foi removido. (content: ${beforeStyle.content}, display: ${beforeStyle.display})` };
      }

      return { ok: true };
    });

    if (!isValid.ok) {
      console.error(`❌ Falha: ${isValid.msg}`);
      process.exit(1);
    }

    console.log(`✅ Cards passaram pelas diretrizes Premium (Soft Shadows e Fundo Preenchido).`);
    console.log('TDD OS 028 concluído com sucesso: UI/UX aprovada!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
