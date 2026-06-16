const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1280, height: 800 } });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Screenshot 1: Tela Inicial (BT)
    await page.screenshot({ path: path.join(__dirname, 'screenshot_bt.png'), fullPage: true });

    // Clicar no botão calcular BT
    await page.evaluate(() => {
      const btn = document.querySelector('#btn-bt');
      if(btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(__dirname, 'screenshot_bt_calc.png'), fullPage: true });

    // Screenshot 2: Tela MT
    await page.evaluate(() => {
      const btnMt = document.querySelector('[data-tab="mt"]') || document.querySelector('#btn-mt');
      if(btnMt) btnMt.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => {
      const btn = document.querySelector('#btn-mt');
      if(btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(__dirname, 'screenshot_mt_calc.png'), fullPage: true });

  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();
