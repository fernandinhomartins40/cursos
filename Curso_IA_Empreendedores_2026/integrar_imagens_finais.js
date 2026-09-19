const fs = require('fs');
const path = require('path');
const D = __dirname;
const images = [
  ['01_equipe_digital.png', 'IA como equipe de apoio'],
  ['02_formula_cofre.png', 'Prompt C.O.F.R.E.'],
  ['03_dois_canais.png', 'Ferramentas: escolha pelo trabalho'],
  ['04_rotina_administrativa.png', 'Assistente administrativo'],
  ['05_marketing_calendario.png', 'Marketing prático'],
  ['06_vendas_proposta.png', 'Vendas consultivas'],
  ['07_atendimento_cliente.png', 'Atendimento consistente'],
  ['08_pesquisa_mercado.png', 'Pesquisa com evidências'],
  ['09_automacao_fluxo.png', 'Decisão e produtividade'],
  ['10_dados_seguros.png', 'Dados seguros e responsabilidade'],
  ['11_plano_30_dias.png', 'Plano de IA da empresa']
];
const cases = [
  ['caso_loja_roupas.png', 'Caso: loja de roupas'],
  ['caso_salao.png', 'Caso: salão de beleza'],
  ['caso_imobiliaria.png', 'Caso: imobiliária'],
  ['caso_restaurante.png', 'Caso: restaurante']
];
const css = '<style id="imagens-integradas">.capa-com-foto{background-image:linear-gradient(150deg,rgba(238,240,254,.92),rgba(246,244,255,.82),rgba(255,248,240,.84)),url("imagens/capa_empreendedores_ia.png")!important;background-position:center!important;background-size:cover!important}.imagem-caso{width:100%;max-height:145mm;object-fit:cover;border-radius:10px;margin:12px 0 4px}.imagem-conceito{float:right;width:34%;max-height:235px;object-fit:cover;border-radius:14px;margin:0 0 14px 20px;box-shadow:0 7px 20px rgba(15,23,42,.12)}@media print{.imagem-conceito{max-height:205px}}</style>';

function updateBook(file, isKit) {
  const f = path.join(D, file);
  let html = fs.readFileSync(f, 'utf8');
  if (html.includes('id="imagens-integradas"')) return;
  html = html.replace('</head>', css + '</head>');
  html = html.replace('class="capa"', 'class="capa capa-com-foto"');
  if (!isKit) {
    let n = 0;
    html = html.replace(/(<div class="caso">[\s\S]*?<div class="cena">[\s\S]*?<\/div>)/g, m => {
      const image = cases[n++ % cases.length];
      return m + '<img class="imagem-caso" src="imagens/' + image[0] + '" alt="' + image[1] + '">';
    });
  }
  fs.writeFileSync(f, html, 'utf8');
}

updateBook('Apostila_IA_para_Empreendedores_2026.html', false);
updateBook('Kit_IA_para_Empreendedores.html', true);

const deckFile = path.join(D, 'Slides_IA_para_Empreendedores_2026.html');
let deck = fs.readFileSync(deckFile, 'utf8');
if (!deck.includes('id="imagens-integradas"')) {
  deck = deck.replace('</head>', css + '</head>');
  for (const [file, title] of images) {
    const anchor = '<h1 class="st">' + title + '</h1><div class="corpo alto">';
    const image = '<img class="imagem-conceito" src="imagens/' + file + '" alt="' + title + '">';
    if (deck.includes(anchor)) deck = deck.replace(anchor, anchor + image);
  }
  fs.writeFileSync(deckFile, deck, 'utf8');
}
console.log('Imagens integradas na apostila, no kit e nos slides conceituais.');
