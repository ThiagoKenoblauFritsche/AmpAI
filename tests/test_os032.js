const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 032 (Formulários Acessíveis e Leitores de Tela)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // Validar se todos os inputs e selects possuem label vinculada com o atributo `for`
    const formsA11y = await page.evaluate(() => {
      // Pega todos os inputs numéricos e selects visíveis na página
      const controls = Array.from(document.querySelectorAll('input[type="number"], select'));
      let errors = [];

      for (let el of controls) {
        // Ignorar se não tiver ID (se não tiver ID, é outro problema, mas assumimos que o Dev vai por ID também se não tiver)
        if (!el.id) {
          errors.push(`Elemento <${el.tagName.toLowerCase()}> (name/class=${el.name || el.className}) não possui atributo 'id'.`);
          continue;
        }

        // Buscar um label que tenha 'for' apontando para esse ID
        const label = document.querySelector(`label[for="${el.id}"]`);
        
        if (!label) {
          errors.push(`O input id="${el.id}" não possui uma tag <label for="${el.id}"> correspondente.`);
        }
      }

      return {
        ok: errors.length === 0,
        errors: errors
      };
    });

    if (!formsA11y.ok) {
      console.error(`❌ Falhas de Acessibilidade Encontradas (${formsA11y.errors.length} erros):`);
      formsA11y.errors.forEach((err, i) => console.error(`  ${i+1}. ${err}`));
      process.exit(1);
    }

    console.log('✅ Todos os campos do formulário possuem <label> corretamente vinculada via atributo "for".');
    console.log('TDD OS 032 concluído com sucesso: Leitores de tela (A11y) aprovados!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
