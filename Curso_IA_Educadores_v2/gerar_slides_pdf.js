const puppeteer = require('../IA Professores/node_modules/puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  const abs = path.resolve(__dirname, 'Slides_IA_Educadores_2026.html');
  await page.goto('file:///' + abs.split(path.sep).join('/'), { waitUntil: 'networkidle0', timeout: 120000 });
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
