const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 038 (Branding e Reposicionamento do Logo)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    const brandingValid = await page.evaluate(() => {
      let ok = true;
      let msg = '';

      // 1. Verificar se o logo na sidebar foi removido
      const sidebar = document.querySelector('.nav-sidebar');
      if (sidebar) {
        // O logo antigo usava um svg com fill="#b45309" ou uma div com "logo-icon"
        const oldLogoText = sidebar.textContent.includes('AmpAI');
        const oldLogoIcon = sidebar.querySelector('svg');
        if (oldLogoText && oldLogoIcon) {
           ok = false;
           msg += 'O logo provisório ainda existe dentro da .nav-sidebar. ';
        }
      }

      // 2. Verificar se o header agora tem a tag img
      const headerTitle = document.querySelector('.header-title');
      if (headerTitle) {
        const img = headerTitle.querySelector('img');
        if (!img) {
          ok = false;
          msg += 'A tag <img> com o novo logo não foi encontrada em .header-title. ';
        } else if (!img.src.includes('img/logo.png')) {
          ok = false;
          msg += 'A tag <img> não está apontando para img/logo.png. ';
        }

        const h1 = headerTitle.querySelector('h1');
        if (h1 && h1.textContent.includes('Assistente de Engenharia Elétrica')) {
          ok = false;
          msg += 'O texto genérico antigo (Assistente de Engenharia...) ainda está presente. ';
        }
      }

      return { ok, msg };
    });

    if (!brandingValid.ok) {
      console.error(`❌ Falha: ${brandingValid.msg}`);
      process.exit(1);
    }

    console.log('✅ Logo antigo foi erradicado da barra lateral.');
    console.log('✅ Novo logotipo em img/logo.png assumiu a posição master no Cabeçalho.');
    console.log('TDD OS 038 concluído com sucesso: Rebranding ativado!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
