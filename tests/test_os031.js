const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 031 (A11y - Contraste e Cores Seguras)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Validar cor do SVG do Logo (raio)
    const logoColor = await page.evaluate(() => {
      // O raio do logo está em um path com fill
      const svgPaths = Array.from(document.querySelectorAll('.nav-sidebar svg path'));
      // Achar o path que era laranja (f59e0b) ou que tenha o novo fill (b45309)
      const rayPath = svgPaths.find(p => p.getAttribute('fill') === '#b45309' || p.getAttribute('fill') === '#f59e0b');
      return rayPath ? rayPath.getAttribute('fill') : null;
    });

    if (logoColor !== '#b45309') {
      console.error(`❌ Falha: A cor do raio no logo AmpAI não foi atualizada para #b45309 (Atual: ${logoColor})`);
      process.exit(1);
    }
    console.log('✅ Logo AmpAI atualizado para a cor segura #b45309 (Amber 700).');

    // Validar menu desativado
    const menuLockedValid = await page.evaluate(() => {
      const lockedItem = document.querySelector('.nav-item.locked');
      if (!lockedItem) return { ok: false, msg: 'Item de menu desativado (.nav-item.locked) não encontrado.' };
      
      const style = window.getComputedStyle(lockedItem);
      if (parseFloat(style.opacity) < 1) {
        return { ok: false, msg: `Item desativado ainda possui opacity: ${style.opacity}. Deveria ser 1 para preservar o contraste.` };
      }
      
      return { ok: true };
    });

    if (!menuLockedValid.ok) {
      console.error(`❌ Falha: ${menuLockedValid.msg}`);
      process.exit(1);
    }

    console.log('✅ Itens de menu desativados estão com contraste seguro (opacity = 1).');
    console.log('TDD OS 031 concluído com sucesso: WCAG AA Contraste aprovado!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
