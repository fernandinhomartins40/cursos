const puppeteer = require('../IA Professores/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');
const D = __dirname;
const out = path.join(D, 'output', 'pdf');
fs.mkdirSync(out, { recursive: true });

async function make(browser, html, pdf, options) {
  const page = await browser.newPage();
  await page.goto('file:///' + path.join(D, html).replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 90000 }).catch(async () => {
    await page.goto('file:///' + path.join(D, html).replace(/\\/g, '/'), { waitUntil: 'domcontentloaded', timeout: 90000 });
  });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  let target=path.join(out,pdf);
  try { await page.pdf({ path:target, printBackground:true, ...options }); }
  catch (err) {
    if(err && err.code==='EBUSY') { target=path.join(out,pdf.replace(/\.pdf$/i,'_ATUALIZADO.pdf')); await page.pdf({ path:target, printBackground:true, ...options }); }
    else throw err;
  }
  await page.close();
  console.log('PDF:', path.basename(target));
}
(async()=>{
 const b=await puppeteer.launch({headless:'new',args:['--no-sandbox']});
 await make(b,'Apostila_IA_para_Empreendedores_2026.html','Apostila_IA_para_Empreendedores_2026.pdf',{format:'A4',margin:{top:0,bottom:0,left:0,right:0}});
 await make(b,'Kit_IA_para_Empreendedores.html','Kit_IA_para_Empreendedores.pdf',{format:'A4',margin:{top:0,bottom:0,left:0,right:0}});
 await make(b,'Slides_IA_para_Empreendedores_2026.html','Slides_IA_para_Empreendedores_2026.pdf',{width:'1280px',height:'720px',margin:{top:0,bottom:0,left:0,right:0}});
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
