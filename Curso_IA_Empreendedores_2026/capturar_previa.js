const puppeteer = require('../IA Professores/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');
const D = __dirname, O = path.join(D,'tmp','pdfs');
fs.mkdirSync(O,{recursive:true});
async function shot(browser,file,index,name,viewport){
  const p=await browser.newPage(); await p.setViewport(viewport);
  await p.goto('file:///'+path.join(D,file).replace(/\\/g,'/'),{waitUntil:'networkidle0',timeout:90000}).catch(()=>{});
  const el=(await p.$$('section'))[index];
  // O deck interativo oculta slides inativos; a prévia força apenas o alvo visível.
  await p.evaluate((i)=>{const all=document.querySelectorAll('section');all.forEach((x,n)=>{if(n===i){x.style.setProperty('display','block','important');x.style.setProperty('visibility','visible','important');}})},index);
  await el.screenshot({path:path.join(O,name)}); await p.close();
}
(async()=>{const b=await puppeteer.launch({headless:'new',args:['--no-sandbox']});
 await shot(b,'Apostila_IA_para_Empreendedores_2026.html',0,'apostila-capa.png',{width:1000,height:1400});
 await shot(b,'Apostila_IA_para_Empreendedores_2026.html',15,'apostila-projeto.png',{width:1000,height:1400});
 await shot(b,'Kit_IA_para_Empreendedores.html',2,'kit-mapa.png',{width:1000,height:1400});
 await shot(b,'Slides_IA_para_Empreendedores_2026.html',1,'slide-modulo.png',{width:1280,height:720});
 await shot(b,'Slides_IA_para_Empreendedores_2026.html',27,'slide-projeto.png',{width:1280,height:720});
 await shot(b,'Slides_IA_para_Empreendedores_2026.html',74,'slide-caso-premium.png',{width:1280,height:720});
 await b.close();})();
