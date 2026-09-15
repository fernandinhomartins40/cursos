const puppeteer = require('../IA Professores/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  page.setDefaultNavigationTimeout(120000);
  const abs = path.resolve(__dirname, 'Slides_IA_Educadores_2026.html');
  const url = 'file:///' + abs.split(path.sep).join('/');
  // O deck carrega as fontes do Google. Se elas demorarem, não vale
  // abortar o PDF inteiro: seguimos com o DOM pronto e damos um tempo
  // extra para a fonte assentar.
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  } catch (e) {
    console.log('  (rede lenta — seguindo com a página já carregada)');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  }
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  await page.pdf({
    path: 'Slides_IA_Educadores_2026.pdf',
    width: '1280px',
    height: '720px',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  await browser.close();
  console.log('PDF dos slides OK');
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
