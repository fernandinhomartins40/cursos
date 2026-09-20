/* Recomprime as ilustrações da apostila.
   As imagens geradas saem em PNG de ~2 MB cada, o que leva o PDF a 45 MB —
   inviável para mandar aos cursistas por e-mail ou WhatsApp. Aqui elas viram
   JPEG de qualidade alta, na largura que realmente aparece impressa.

   Usa o próprio Chrome (via puppeteer) porque o projeto não tem sharp nem
   outra biblioteca de imagem instalada.

   Os originais ficam preservados em imagens/_originais/. */
const fs = require('fs');
const path = require('path');
const puppeteer = require('../IA Professores/node_modules/puppeteer');

const D = path.join(__dirname, 'imagens');
const BKP = path.join(D, '_originais');

// A figura ocupa 52% da largura útil de uma A4 (~9 cm). A 300 DPI isso dá
// cerca de 1060 px — abaixo disso a impressão perde nitidez.
const LARGURA_MAX = 1100;
const QUALIDADE = 0.86;

(async () => {
  if (!fs.existsSync(BKP)) fs.mkdirSync(BKP);

  const arquivos = fs.readdirSync(D).filter(f => /\.png$/i.test(f));
  if (!arquivos.length) { console.log('nenhuma imagem encontrada'); return; }

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  let antes = 0, depois = 0, feitas = 0;

  for (const nome of arquivos) {
    const origem = path.join(D, nome);
    const tamOrig = fs.statSync(origem).size;

    // guarda o original uma única vez
    const guardado = path.join(BKP, nome);
    if (!fs.existsSync(guardado)) fs.copyFileSync(origem, guardado);

    const b64 = fs.readFileSync(origem).toString('base64');
    const saida = await page.evaluate(async (dados, larguraMax, q) => {
      const img = new Image();
      await new Promise((ok, erro) => {
        img.onload = ok; img.onerror = () => erro(new Error('imagem inválida'));
        img.src = 'data:image/png;base64,' + dados;
      });
      const escala = Math.min(1, larguraMax / img.width);
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * escala);
      c.height = Math.round(img.height * escala);
      const ctx = c.getContext('2d');
      // fundo branco: o JPEG não tem transparência
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      return { dados: c.toDataURL('image/jpeg', q).split(',')[1], w: c.width, h: c.height };
    }, b64, LARGURA_MAX, QUALIDADE);

    // o arquivo continua .png no nome para não mexer nas chamadas do
    // montador; o conteúdo é JPEG, e todo navegador o lê pelo cabeçalho.
    const buf = Buffer.from(saida.dados, 'base64');
    fs.writeFileSync(origem, buf);

    antes += tamOrig; depois += buf.length; feitas++;
    console.log('  ' + nome.padEnd(42) +
      (tamOrig / 1048576).toFixed(2) + ' MB → ' + (buf.length / 1048576).toFixed(2) + ' MB' +
      '  (' + saida.w + 'x' + saida.h + ')');
  }

  await browser.close();
  console.log();
  console.log(feitas + ' imagens · ' + (antes / 1048576).toFixed(1) + ' MB → ' +
    (depois / 1048576).toFixed(1) + ' MB  (−' +
    Math.round((1 - depois / antes) * 100) + '%)');
  console.log('originais preservados em imagens/_originais/');
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
