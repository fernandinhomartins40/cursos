const puppeteer = require('../IA Professores/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');
const D = __dirname;
const out = path.join(D, 'output', 'pdf');
fs.mkdirSync(out, {recursive:true});
(async () => {
  const browser = await puppeteer.launch({headless:'new', args:['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto('file:///' + path.join(D, 'Slides_IA_para_Empreendedores_2026.html').replace(/\\/g, '/'), {waitUntil:'networkidle0', timeout:90000});
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({path:path.join(out, 'Slides_IA_para_Empreendedores_2026.pdf'), width:'1280px', height:'720px', printBackground:true, margin:{top:0,bottom:0,left:0,right:0}});
  await browser.close();
  console.log('PDF de slides concluído.');
})().catch(e => { console.error(e); process.exit(1); });
