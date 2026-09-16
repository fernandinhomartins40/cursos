/* PDF da edição econômica — duas colunas, para a prefeitura imprimir
   uma via por professor. Mesmo conteúdo da apostila completa. */
const puppeteer = require('../IA Professores/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(120000);
  const abs = path.resolve(__dirname, 'Apostila_IA_Educadores_2026_ECONOMICA.html');
  const file = 'file:///' + abs.split(path.sep).join('/');
  // Se as fontes do Google demorarem, não abortamos.
  try {
    await page.goto(file, { waitUntil: 'networkidle0', timeout: 45000 });
  } catch (e) {
    console.log('  (rede lenta — seguindo com a página já carregada)');
    await page.goto(file, { waitUntil: 'domcontentloaded', timeout: 120000 });
  }
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.pdf({
    path: 'Apostila_IA_Educadores_2026_ECONOMICA.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  await browser.close();
  console.log('PDF da edição econômica OK');
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
