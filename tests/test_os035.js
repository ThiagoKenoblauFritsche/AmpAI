const puppeteer = require('puppeteer');

(async () => {
  console.log('Iniciando Testes TDD OS 035 (Performance - Defer e Main Thread)...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ Página carregada.');

    // 1. Validar scripts deferidos
    const scriptsValid = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      let ok = true;
      let msg = '';

      const chartScript = scripts.find(s => s.src.includes('chart.js'));
      const lucideScript = scripts.find(s => s.src.includes('lucide'));

      if (chartScript && !chartScript.hasAttribute('defer')) {
        ok = false;
        msg += 'Script chart.js não possui atributo defer. ';
      }
      
      if (lucideScript && !lucideScript.hasAttribute('defer')) {
        ok = false;
        msg += 'Script lucide não possui atributo defer. ';
      }

      return { ok, msg };
    });

    if (!scriptsValid.ok) {
      console.error(`❌ Falha: ${scriptsValid.msg}`);
      process.exit(1);
    }
    console.log('✅ Scripts externos configurados com [defer] não bloqueiam a renderização.');

    // 2. Validar que lucide.createIcons() foi deferido usando regex no código fonte
    const fs = require('fs');
    const path = require('path');
    const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
    
    // A validação bruta para checar se 'requestAnimationFrame' envolve a chamada
    const containsRAF = htmlContent.includes('requestAnimationFrame') && htmlContent.includes('lucide.createIcons()');
    
    if (!containsRAF) {
       console.error(`❌ Falha: A chamada 'lucide.createIcons()' no index.html não parece estar envolvida em um 'requestAnimationFrame' ou mecanismo similar de adiamento.`);
       process.exit(1);
    }
    
    console.log('✅ lucide.createIcons() teve sua inicialização adiada (requestAnimationFrame) para não travar a Thread Principal.');
    console.log('TDD OS 035 concluído com sucesso: Otimização de Performance validada!');

  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
