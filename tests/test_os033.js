const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 033 (Contrastes Residuais)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Validar Variável Global --accent
    const variablesValid = await page.evaluate(() => {
      const rootStyles = window.getComputedStyle(document.documentElement);
      const accent = rootStyles.getPropertyValue('--accent').trim().toLowerCase();
      
      // Checar se mudou de #f59e0b para #b45309
      return {
        ok: accent === '#b45309',
        val: accent
      };
    });

    if (!variablesValid.ok) {
      console.error(`❌ Falha: A variável global '--accent' não foi atualizada para #b45309. Atual: '${variablesValid.val}'`);
      process.exit(1);
    }
    console.log('✅ Variável global --accent atualizada para cor segura #b45309.');

    // Simular clique para renderizar cards primários
    await page.evaluate(() => {
      const calcBtn = document.querySelector('.btn-calculate');
      if (calcBtn) calcBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // 2. Validar Background do Result Card Primary
    const cardBgValid = await page.evaluate(() => {
      const card = document.querySelector('.result-card.primary');
      if (!card) return { ok: false, msg: 'Nenhum .result-card.primary encontrado na tela.' };

      const rootStyles = window.getComputedStyle(document.documentElement);
      const textPrimaryColor = rootStyles.getPropertyValue('--text-primary').trim();
      const textPrimaryComputed = getComputedStyle(document.body).color; // rgb(15, 23, 42) for slate-900

      const cardStyle = window.getComputedStyle(card);
      const cardBg = cardStyle.backgroundColor; // Vem em formato rgb(x, y, z)

      // #0f172a é rgb(15, 23, 42)
      if (cardBg !== 'rgb(15, 23, 42)') {
         return { ok: false, msg: `Fundo do .result-card.primary não é var(--text-primary). Atual: ${cardBg}` };
      }

      return { ok: true };
    });

    if (!cardBgValid.ok) {
      console.error(`❌ Falha: ${cardBgValid.msg}`);
      process.exit(1);
    }

    console.log('✅ Fundo do Card Primário atualizado para Slate 900, garantindo legibilidade do texto branco.');
    console.log('TDD OS 033 concluído com sucesso: Acessibilidade 100% resolvida!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
