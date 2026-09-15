const puppeteer = require('../IA Professores/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const abs = path.resolve(__dirname, 'Apostila_IA_Educadores_2026.html');
  const file = 'file:///' + abs.split(path.sep).join('/');
  page.setDefaultNavigationTimeout(120000);
  // Se as fontes do Google demorarem, não abortamos: seguimos com o DOM
  // pronto e damos um tempo extra para a fonte assentar.
  try {
    await page.goto(file, { waitUntil: 'networkidle0', timeout: 45000 });
  } catch (e) {
    console.log('  (rede lenta — seguindo com a página já carregada)');
    await page.goto(file, { waitUntil: 'domcontentloaded', timeout: 120000 });
  }
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.pdf({
    path: 'Apostila_IA_Educadores_2026.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '20mm', left: '16mm', right: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%;font-size:8pt;color:#94A3B8;font-family:sans-serif;padding:0 16mm;display:flex;justify-content:space-between;"><span>IA para Educadores &middot; Forma&ccedil;&atilde;o 40h</span><span class="pageNumber"></span></div>'
  });
  await browser.close();
  console.log('PDF OK');
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
