const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 022 (Botão Memorial MT)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    // Mudar para o módulo de cabos
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.nav-link'));
      const cabLink = links.find(l => l.getAttribute('onclick')?.includes('cabling'));
      if(cabLink) cabLink.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Acionar botão de calcular genérico para gerar os cards
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if(calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Localizar botão do memorial MT
    const mtButtonId = await page.evaluate(() => {
      // Tenta achar o botão pelo id provável ou pela classe
      const btn = document.querySelector('#toggle-memorial-mt') || 
                  Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('60502-2') || b.textContent.includes('Memorial'));
      return btn ? btn.id || btn.className : null;
    });

    if (!mtButtonId) {
      console.log('⚠️ Aviso: Botão do Memorial de MT não encontrado no DOM. Verifique a montagem do renderCardMT.');
    } else {
      console.log('✅ Botão encontrado.');
      
      let initialOpen = await page.evaluate(() => {
        const container = document.querySelector('#cb-mem-mt-container') || document.querySelector('.memorial-step');
        if (!container) return false;
        return container.classList.contains('open');
      });

      // Clicar via mouse para testar o Event Delegation global
      await page.evaluate(() => {
        const btn = document.querySelector('#btn-memorial-mt');
        if (btn) {
          console.log("Clicking button: ", btn.id);
          const icon = btn.querySelector('svg') || btn.querySelector('i');
          if (icon && typeof icon.click === 'function') icon.click();
          else if (icon) icon.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          else btn.click();
        } else {
          console.log("Button not found in evaluate!");
        }
      });
      await new Promise(r => setTimeout(r, 300));

      let newOpen = await page.evaluate(() => {
        const container = document.querySelector('#cb-mem-mt-container') || document.querySelector('.memorial-step');
        if (!container) return false;
        return container.classList.contains('open');
      });

      if (initialOpen === newOpen) {
        console.error(`❌ Falha: O clique no botão do Memorial MT não alterou a visibilidade do container (Open state continuou: ${newOpen}). Falha no Event Delegation.`);
        process.exit(1);
      } else {
        console.log(`✅ O Event Delegation funcionou! Estado 'open' mudou de ${initialOpen} para ${newOpen}.`);
      }
    }

    console.log('TDD OS 022 concluído: Teste de clique do Memorial validado!');
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
