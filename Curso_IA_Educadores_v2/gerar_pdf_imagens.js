/* Gera o PDF "Prompts_das_Imagens.pdf": uma página por imagem, com o
   prompt pronto para copiar, o nome exato do arquivo e a pasta de destino.
   Os prompts saem do GUIA_DE_IMAGENS.md — este script não inventa texto,
   só reformata para impressão, embutindo o estilo padrão onde o guia
   escrevia "[+ estilo padrão]". */
const fs = require('fs');
const path = require('path');
const puppeteer = require('../IA Professores/node_modules/puppeteer');

const D = __dirname;
const guia = fs.readFileSync(path.join(D, 'GUIA_DE_IMAGENS.md'), 'utf8');

// As que valem a pena gerar primeiro: a capa, mais as 11 que o
// montar_apostila.js realmente insere. As demais têm prompt no guia mas
// hoje não aparecem em lugar nenhum do material.
// A capa não passa por img() — ela é arte de apoio da apostila e dos
// slides —, mas é a imagem mais visível de todas, então entra aqui.
const USADAS = new Set([
  'capa_professores_ia.png',
  '01_whatsapp_teclado_previsao.png',
  '02_formula_ptcf_esquema.png',
  '03_dois_barcos_estrategia.png',
  '06_organizacao_rotina_professor.png',
  '08_bncc_codigo_explicado.png',
  '09_notebooklm_documentos.png',
  '12_inclusao_escolar_sala.png',
  '15_canva_educacao_design.png',
  '17_seguranca_lgpd_escola.png',
  '19_projeto_intervencao_final.png',
  '20_professor_insubstituivel.png',
]);

const ESTILO = `Estilo: ilustração digital moderna e acolhedora, cores vibrantes com
predominância de roxo/índigo (#4F46E5) e laranja (#F97316), traço limpo
tipo flat design com leve profundidade, ambiente de escola pública
brasileira, pessoas diversas (diferentes tons de pele, idades e gêneros),
expressões positivas e acolhedoras, fundo claro, sem texto na imagem,
alta qualidade, proporção quadrada 1:1.`;

// onde cada imagem aparece, lido da tabela rápida do guia
const onde = {};
for (const m of guia.matchAll(/^\| *[0-9C]+ *\| *`([^`]+)` *\| *([^|]+?) *\| *([^|]+?) *\|$/gm)) {
  onde[m[1]] = { local: m[2], formato: m[3] };
}

// um bloco por imagem
const cab = [...guia.matchAll(/^## (\S+) · `([^`]+)`(.*)$/gm)];
const fimPrompts = guia.indexOf('## Depois de gerar');
const itens = cab.map((m, i) => {
  const fim = i + 1 < cab.length ? cab[i + 1].index : fimPrompts;
  const corpo = guia.slice(m.index, fim);
  const cb = corpo.match(/```\n([\s\S]*?)```/);
  let prompt = cb ? cb[1].trim() : '';
  prompt = prompt.replace(/\[\+ estilo padrão\]/g, ESTILO);
  const arq = m[2];
  return {
    num: m[1],
    arq,
    larga: /LARGA|1280/.test(m[3]),
    prompt,
    local: (onde[arq] || {}).local || '—',
    formato: (onde[arq] || {}).formato || '1024×1024',
    usada: USADAS.has(arq),
  };
});

const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const paginas = itens.map(it => `
<section class="pg${it.usada ? ' usada' : ''}">
  <div class="topo">
    <span class="num">${esc(it.num)}</span>
    ${it.usada
      ? `<span class="tag tag-sim">${it.arq === 'capa_professores_ia.png'
          ? 'Capa do material' : 'Aparece na apostila'}</span>`
      : '<span class="tag tag-nao">Extra — hoje não é usada</span>'}
  </div>

  <h2>${esc(it.arq)}</h2>
  <p class="meta">${esc(it.local)} · ${esc(it.formato)}</p>

  <div class="rot">Prompt — copie tudo o que está dentro da moldura</div>
  <pre class="prompt">${esc(it.prompt)}</pre>

  <div class="salvar">
    <div class="rot2">Depois de gerar, salve assim:</div>
    <table>
      <tr><td class="k">Nome do arquivo</td><td class="v"><code>${esc(it.arq)}</code></td></tr>
      <tr><td class="k">Pasta de destino</td><td class="v"><code>Curso_IA_Educadores_v2\\imagens\\</code></td></tr>
      <tr><td class="k">Formato</td><td class="v">PNG · ${esc(it.formato)}</td></tr>
    </table>
    <p class="obs">Já existe um arquivo em branco com esse nome na pasta — <strong>substitua</strong> mantendo o nome exato.</p>
  </div>
</section>`).join('\n');

const usadas = itens.filter(i => i.usada);
const extras = itens.filter(i => !i.usada);

const linhas = arr => arr.map(i =>
  `<tr><td>${esc(i.num)}</td><td><code>${esc(i.arq)}</code></td><td>${esc(i.local)}</td></tr>`).join('');

const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Prompts das Imagens — IA para Educadores 2026</title>
<style>
  @page { size: A4; margin: 14mm 15mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", system-ui, sans-serif; color: #1e2334; margin: 0;
         font-size: 10.5pt; line-height: 1.5; }
  code { font-family: Consolas, "Courier New", monospace; }

  .capa { height: 247mm; display: flex; flex-direction: column; justify-content: center;
          page-break-after: always; }
  .capa h1 { font-size: 30pt; line-height: 1.15; margin: 0 0 6mm; color: #4F46E5; }
  .capa .sub { font-size: 13pt; color: #475069; margin-bottom: 12mm; }
  .passos { background: #f4f5fb; border-left: 4px solid #4F46E5; padding: 6mm 7mm; border-radius: 0 6px 6px 0; }
  .passos h3 { margin: 0 0 3mm; font-size: 12pt; }
  .passos ol { margin: 0; padding-left: 5mm; }
  .passos li { margin-bottom: 2mm; }

  .idx { page-break-after: always; }
  .idx h2 { color: #4F46E5; font-size: 16pt; margin: 0 0 2mm; }
  .idx p.leg { color: #5a6280; margin: 0 0 5mm; font-size: 10pt; }
  .idx table { width: 100%; border-collapse: collapse; margin-bottom: 8mm; font-size: 9.5pt; }
  .idx th { text-align: left; background: #4F46E5; color: #fff; padding: 2mm 3mm; font-size: 9pt; }
  .idx td { padding: 1.8mm 3mm; border-bottom: 1px solid #e3e5ef; }
  .idx code { font-size: 9pt; }

  .pg { page-break-after: always; padding-top: 2mm; }
  .topo { display: flex; align-items: center; gap: 4mm; margin-bottom: 3mm; }
  .num { background: #4F46E5; color: #fff; font-weight: 700; font-size: 11pt;
         padding: 1.5mm 4mm; border-radius: 20px; }
  .tag { font-size: 8.5pt; font-weight: 600; padding: 1.2mm 3.5mm; border-radius: 20px; }
  .tag-sim { background: #e6f7ee; color: #0a7d45; }
  .tag-nao { background: #fdf0e6; color: #b45309; }

  .pg h2 { font-family: Consolas, monospace; font-size: 15pt; margin: 0 0 1mm; color: #1e2334; word-break: break-all; }
  .meta { color: #5a6280; margin: 0 0 6mm; font-size: 10pt; }

  .rot { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
         color: #4F46E5; margin-bottom: 2mm; }
  .prompt { background: #fbfbfe; border: 2px solid #4F46E5; border-radius: 6px;
            padding: 5mm 6mm; white-space: pre-wrap; font-family: Consolas, monospace;
            font-size: 9.5pt; line-height: 1.55; margin: 0 0 7mm; }

  .salvar { background: #f7f8fc; border-radius: 6px; padding: 5mm 6mm; }
  .rot2 { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
          color: #F97316; margin-bottom: 3mm; }
  .salvar table { width: 100%; border-collapse: collapse; }
  .salvar td { padding: 1.8mm 0; border-bottom: 1px solid #e6e8f0; vertical-align: top; }
  .salvar tr:last-child td { border-bottom: none; }
  .k { color: #5a6280; width: 38mm; font-size: 9.5pt; }
  .v code { background: #fff; border: 1px solid #dcdfea; border-radius: 3px; padding: .8mm 2mm; font-size: 9.5pt; }
  .obs { margin: 3mm 0 0; font-size: 9pt; color: #5a6280; }
</style></head><body>

<div class="capa">
  <h1>Prompts das Imagens<br>IA para Educadores 2026</h1>
  <p class="sub">Uma página por ilustração, com o prompt pronto para copiar,<br>
     o nome exato do arquivo e a pasta onde salvar.</p>
  <div class="passos">
    <h3>Como usar</h3>
    <ol>
      <li>Abra a página da imagem que quer gerar.</li>
      <li>Copie <strong>todo</strong> o texto da moldura roxa.</li>
      <li>Cole em um gerador de imagens (Gemini, Canva IA, Bing Image Creator, Leonardo).</li>
      <li>Baixe o resultado em PNG.</li>
      <li>Renomeie com o <strong>nome exato</strong> indicado na página.</li>
      <li>Salve em <code>Curso_IA_Educadores_v2\\imagens\\</code>, substituindo o arquivo em branco.</li>
      <li>Quando terminar, me avise: eu regenero a apostila com as imagens no lugar.</li>
    </ol>
  </div>
</div>

<div class="idx">
  <h2>Prioridade 1 — as ${usadas.length} que o material usa</h2>
  <p class="leg">A capa (00) e as ${usadas.length - 1} figuras que a apostila insere no corpo do texto.
     Se for gerar só algumas, gere estas.</p>
  <table>
    <tr><th>#</th><th>Arquivo</th><th>Onde aparece</th></tr>
    ${linhas(usadas)}
  </table>

  <h2>Prioridade 2 — as ${extras.length} extras</h2>
  <p class="leg">Têm prompt pronto, mas hoje não são inseridas em nenhum ponto da apostila nem dos slides.
     Só valem a pena se quisermos ampliar o material com mais figuras — nesse caso, me avise que eu
     acrescento as chamadas no montador.</p>
  <table>
    <tr><th>#</th><th>Arquivo</th><th>Onde apareceria</th></tr>
    ${linhas(extras)}
  </table>
</div>

${paginas}
</body></html>`;

const saidaHtml = path.join(D, '.prompts_imagens.html');
fs.writeFileSync(saidaHtml, html, 'utf8');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file:///' + saidaHtml.split(path.sep).join('/'), { waitUntil: 'networkidle0' });
  await page.pdf({
    path: path.join(D, 'Prompts_das_Imagens.pdf'),
    format: 'A4', printBackground: true,
  });
  await browser.close();
  fs.unlinkSync(saidaHtml);
  console.log('Prompts_das_Imagens.pdf OK —', itens.length, 'imagens (', usadas.length, 'usadas +', extras.length, 'extras )');
})().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
