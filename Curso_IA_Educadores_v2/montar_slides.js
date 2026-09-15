/* Monta o deck intercalando os slides de conteúdo com os de atividade,
   segundo o atributo data-pos de cada slide de atividade. */
const fs = require('fs');
const path = require('path');
const D = __dirname;
const ler = f => fs.readFileSync(path.join(D, f), 'utf8');

// ---- separa um arquivo em slides individuais ----
function fatiar(txt) {
  const out = [];
  const re = /<div class="slide[^"]*"[^>]*>/g;
  let m, pos = [];
  while ((m = re.exec(txt))) pos.push(m.index);
  for (let k = 0; k < pos.length; k++) {
    const ini = pos[k];
    let prof = 0, fim = ini;
    const r2 = /<div\b|<\/div>/g; r2.lastIndex = ini;
    let x;
    while ((x = r2.exec(txt))) {
      if (x[0] === '</div>') { prof--; if (prof === 0) { fim = x.index + 6; break; } }
      else prof++;
    }
    out.push(txt.slice(ini, fim));
  }
  return out;
}

const conteudo = ['sl_enc1.html', 'sl_enc2.html', 'sl_enc3.html', 'sl_enc4.html']
  .flatMap(f => fatiar(ler(f)));

// `sl_ferramentas.html` entra junto com as atividades porque usa o mesmo
// mecanismo de posicionamento (data-pos): são slides que se encaixam
// entre os de conteúdo, não um encontro novo. Ocupa a faixa E1..E9,
// livre — sl_atividades já usa A, B, C e D.
const atividades = fatiar(ler('sl_atividades.html'))
  .concat(fatiar(ler('sl_ferramentas.html')));

const attr = (s, a) => { const m = s.match(new RegExp(a + '="([^"]*)"')); return m ? m[1] : ''; };

// ---- os 15 prompts do banco, lidos da apostila ----
// A apostila é a fonte única: o slide mostra só os títulos, e o texto
// completo vem daqui para o modal. Editar o capítulo 2.5 e remontar
// mantém os dois em dia sem copiar nada à mão.
function lerBancoDePrompts() {
  const txt = ler('parte2_cap2_prompts.html');
  const ini = txt.indexOf('2.5 Banco de 15');
  if (ini === -1) { console.log('  ⚠ capítulo 2.5 não encontrado — modal sem prompts'); return []; }
  const re = /<div class="etiqueta">([^<]+)<\/div>\s*<div class="prompt">([\s\S]*?)<\/div>/g;
  const out = [];
  let m;
  while ((m = re.exec(txt.slice(ini)))) {
    out.push({
      titulo: m[1].trim(),
      texto: m[2].replace(/<[^>]+>/g, '')
                 .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
                 .replace(/\r\n/g, '\n')   // colar não deve levar CR do Windows
                 .trim(),
    });
  }
  return out;
}
const BANCO = lerBancoDePrompts();

// As quatro IAs do curso, na ordem em que o Encontro 1 as apresenta.
// `q` é o parâmetro que leva o prompt já escrito na URL. Só o ChatGPT
// aceita isso hoje (chatgpt.com/?q=...): abre com o texto no campo,
// faltando só apertar Enter. Gemini, DeepSeek e NotebookLM ignoram
// qualquer parâmetro — neles o caminho é o botão Copiar + Ctrl+V, que
// é justamente o que o modal já faz ao abrir.
// Verificado em setembro de 2026; se algum dia as outras passarem a
// aceitar, basta acrescentar `q` aqui.
const IAS = [
  { id: 'gemini',   nome: 'Gemini',     url: 'https://gemini.google.com' },
  { id: 'chatgpt',  nome: 'ChatGPT',    url: 'https://chatgpt.com', q: 'q' },
  { id: 'deepseek', nome: 'DeepSeek',   url: 'https://chat.deepseek.com' },
  { id: 'notebook', nome: 'NotebookLM', url: 'https://notebooklm.google.com' },
];

// mapa: número original do slide de conteúdo -> índice no array
const idxPorNum = new Map();
conteudo.forEach((s, i) => idxPorNum.set(attr(s, 'data-n'), i));

// monta a lista final
let deck = conteudo.slice();
// insere de trás para frente para não invalidar índices
const inserir = [];
for (const at of atividades) {
  const pos = attr(at, 'data-pos');
  const enc = attr(at, 'data-enc');
  if (pos.startsWith('apos:')) {
    const alvo = pos.slice(5);
    inserir.push({ at, alvo });
  } else if (pos === 'fim') {
    inserir.push({ at, alvo: 'FIM_ENC' + enc });
  }
}

// marcadores de fim de encontro = último slide de conteúdo de cada encontro
const fimEnc = { 1: '15', 2: '28', 3: '40', 4: '52' };

function inserirDepois(lista, alvoN, novo) {
  const i = lista.findIndex(s => attr(s, 'data-n') === alvoN);
  if (i === -1) return false;
  lista.splice(i + 1, 0, novo);
  return true;
}

// primeiro os que dependem de slides de conteúdo, depois os encadeados
const pendentes = [...inserir];
let voltas = 0;
while (pendentes.length && voltas < 12) {
  for (let k = pendentes.length - 1; k >= 0; k--) {
    const { at, alvo } = pendentes[k];
    const alvoReal = alvo.startsWith('FIM_ENC') ? fimEnc[alvo.slice(7)] : alvo;
    if (inserirDepois(deck, alvoReal, at)) pendentes.splice(k, 1);
  }
  voltas++;
}
if (pendentes.length) console.log('  ⚠ não inseridos:', pendentes.map(p => attr(p.at, 'data-n')));

// ---- liga os cards do banco de prompts ao modal ----
// O slide lista os 15 títulos; aqui cada card ganha o índice do prompt
// correspondente, na ordem em que aparecem. Feito na montagem para não
// repetir data-prompt="N" quinze vezes no HTML à mão.
let ligados = 0;
deck = deck.map(s => {
  if (!/Banco de 15 prompts/.test(s)) return s;
  let i = 0;
  return s.replace(/<div class="card"( style="[^"]*")?>/g, (m, st) => {
    const idx = i++;
    if (idx >= BANCO.length) return m;
    ligados++;
    return `<div class="card abrivel"${st || ''} data-prompt="${idx}">`;
  });
});

// ---- barra de atalhos das IAs nos slides de ferramentas ----
// Entra nos slides que apresentam cada ferramenta, para abrir a IA e
// demonstrar ao vivo sem sair da apresentação.
const botaoIA = ia => `<a class="ia-btn ${ia.id}" href="${ia.url}" target="_blank" rel="noopener">` +
                      `<span class="pt"></span>${ia.nome}</a>`;
const barra = (rot, ias) =>
  `<div class="ia-barra"><span class="rot">${rot}</span>` +
  `<div class="ia-btns">${ias.map(botaoIA).join('')}</div></div>`;

// A ficha de cada ferramenta leva só o botão dela; os slides de visão
// geral e de criação de contas levam as quatro.
const porTitulo = [
  [/^ChatGPT/i,    ['chatgpt']],
  [/^Gemini/i,     ['gemini']],
  [/^DeepSeek/i,   ['deepseek']],
  [/^NotebookLM/i, ['notebook']],
  [/quatro ferramentas do curso/i, null],   // null = todas
  [/checklist/i,                   null],
];
// O slide "criando as contas" fica de fora: cada passo dele já traz a URL
// da ferramenta, e recebe o link direto no próprio cartão (abaixo).
// ---- checklists clicáveis ----
// Todo "☐" escrito no slide vira um checkbox de verdade: marcar é um
// gesto visual em sala ("já fez isso?"), sem guardar estado.
// Três formatos aparecem no material e todos são cobertos aqui:
//   .it            → um item por linha (slides de saída)
//   <h4>           → dois por linha (checklist das contas)
//   <p> com <br>   → lista corrida (Projeto de Intervenção)
let caixas = 0;
// 1) os itens de saída, que viram linha inteira clicável
deck = deck.map(s =>
  s.replace(/<div class="it"([^>]*)>☐\s*([\s\S]*?)<\/div>/g, (m, attrs, txt) => {
    caixas++;
    return `<div class="it marcavel"${attrs}><span class="bx"></span><span class="tx">${txt}</span></div>`;
  })
);
// 2) os demais: o ☐ e o texto até o fim do trecho (<br> ou fim da tag)
deck = deck.map(s =>
  s.replace(/☐\s*([^<]+?)(?=\s*(?:<br\s*\/?>|<\/|&nbsp;|☐))/g, (m, txt) => {
    caixas++;
    return `<span class="chk"><span class="bx"></span><span class="tx">${txt.trim()}</span></span>`;
  })
);

// ---- todo prompt visível ganha um botão "abrir na IA" ----
// Não só os do banco: qualquer .prompt no deck. O texto vai embutido
// no elemento (data-prompt-txt) e o script do deck monta os links.
// Exceção: prompts marcados como exemplo ruim (etiqueta vermelha ou ❌)
// ficam de fora — abrir aquilo na IA ensinaria o contrário do slide.
let promptsAbriveis = 0, promptsIgnorados = 0;
deck = deck.map(s => {
  // a etiqueta imediatamente anterior diz se o prompt é bom ou ruim
  return s.replace(
    /(<div class="etiqueta([^"]*)"[^>]*>([\s\S]*?)<\/div>\s*)?<div class="prompt([^"]*)"([^>]*)>([\s\S]*?)<\/div>/g,
    (m, etqAll, etqCls, etqTxt, prCls, prAttrs, corpo) => {
      const ruim = /vermelha/.test(etqCls || '') || /❌/.test(etqTxt || '');
      const texto = corpo.replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        .replace(/\r\n/g, '\n').trim();
      // prompts muito curtos são ilustrativos ("Crie uma atividade."),
      // não valem um botão
      if (ruim || texto.length < 40) { promptsIgnorados++; return m; }
      promptsAbriveis++;
      const abre = `<div class="prompt-acoes" data-prompt-txt="${
        texto.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}"></div>`;
      return (etqAll || '') +
        `<div class="prompt${prCls}"${prAttrs}>${corpo}</div>` + abre;
    });
});
// Cada barra de ações acrescenta uma linha ao slide. `com-acoes` reduz
// o .corpo na proporção, senão o conteúdo abaixo do prompt desce e
// some atrás da barra de controles do deck.
deck = deck.map(s => /prompt-acoes/.test(s)
  ? s.replace(/<div class="slide/, '<div class="slide com-acoes')
  : s);

// Onde o slide já escreve a URL da ferramenta (ex.: "gemini.google.com"),
// ela vira link clicável — é mais direto que uma barra extra no rodapé.
let urlsLigadas = 0;
deck = deck.map(s =>
  s.replace(/<span class="mono">((?:chatgpt\.com|gemini\.google\.com|chat\.deepseek\.com|notebooklm\.google\.com))<\/span>/g,
    (m, dom) => {
      urlsLigadas++;
      return `<a class="mono url-ia" href="https://${dom}" target="_blank" rel="noopener">${dom}</a>`;
    })
);

let comBarra = 0;
deck = deck.map(s => {
  const titulo = attr(s, 'data-title');
  if (!titulo) return s;
  const regra = porTitulo.find(([re]) => re.test(titulo));
  if (!regra) return s;
  // Se o slide já tem um prompt com seus próprios botões, a barra fixa
  // do rodapé vira repetição — e pior, disputa o mesmo espaço. A barra
  // do prompt é melhor: leva o texto junto.
  if (/prompt-acoes/.test(s)) return s;
  const ias = regra[1] ? IAS.filter(i => regra[1].includes(i.id)) : IAS;
  const rot = regra[1] ? 'Abrir e demonstrar' : 'Abrir agora';
  comBarra++;
  // `com-ia` encolhe o .corpo para abrir espaço à barra (ver slides_base.css)
  return s.replace(/<div class="slide/, '<div class="slide com-ia')
          .replace(/<\/div>\s*$/, barra(rot, ias) + '\n</div>');
});

// renumera
deck = deck.map((s, i) => s.replace(/data-n="[^"]*"/, `data-n="${i + 1}"`));
// garante que só o primeiro tem .active
deck = deck.map((s, i) => i === 0
  ? s.replace('class="slide"', 'class="slide active"')
  : s.replace('class="slide active"', 'class="slide"'));

const head = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>IA para Educadores — Slides da Formação</title>
<link rel="stylesheet" href="slides_base.css">
</head>
<body>
<div class="progress-bar" id="bar"></div>
<div class="deck-outer"><div class="deck-wrapper" id="deck">
`;

const foot = `
</div></div>
<div class="controls">
  <button class="ctrl" id="first" title="Primeiro (Home)">⇤</button>
  <button class="ctrl" id="prev" title="Anterior (←)">‹</button>
  <span class="slide-counter" id="counter">1 / 1</span>
  <button class="ctrl" id="next" title="Próximo (→)">›</button>
  <button class="ctrl" id="last" title="Último (End)">⇥</button>
  <span class="sep"></span>
  <button class="ctrl" id="grid" title="Miniaturas (G)">▦</button>
  <button class="ctrl" id="full" title="Tela cheia (F)">⛶</button>
</div>
<div id="thumb-overlay"><div id="thumb-close">✕ fechar (Esc)</div><div id="thumb-grid"></div></div>
<div id="prompt-modal">
  <div class="cx">
    <div class="cab">
      <h3 id="pm-titulo">Prompt</h3>
      <button class="fechar" id="pm-fechar" title="Fechar (Esc)">✕</button>
    </div>
    <div class="corpo-m"><pre class="txt" id="pm-texto"></pre></div>
    <div class="pe">
      <div class="lin">
        <button class="copiar" id="pm-copiar">📋 Copiar prompt</button>
        <span class="rot-m">Abrir em</span>
        <div class="ia-btns" id="pm-ias"></div>
      </div>
      <p class="aviso"><strong>ChatGPT</strong> abre com o prompt já escrito — é só apertar Enter.
         Nas outras três, o prompt já está copiado: cole com <strong>Ctrl+V</strong>.</p>
    </div>
  </div>
</div>
<script>
const slides = Array.from(document.querySelectorAll('.slide'));
let cur = 0;
function escalar(){
  const d = document.getElementById('deck');
  const s = Math.min(window.innerWidth/1280, (window.innerHeight-62)/720);
  d.style.transform = 'scale(' + s + ')';
}
window.addEventListener('resize', escalar); escalar();

/* ---- cronômetros das atividades ----
   Cada .sl-crono ganha Iniciar / Pausar / Zerar. O tempo inicial é o que
   já estava escrito no slide (ex.: "5:00"), então mudar a duração é mudar
   o HTML — o script não guarda durações próprias. */
const cronos = [];
document.querySelectorAll('.sl-crono').forEach(sl => {
  const num = sl.querySelector('.num');
  if (!num) return;
  const m = (num.textContent || '').trim().match(/^(\\d+):(\\d{2})$/);
  if (!m) return;                       // slide sem tempo no formato m:ss
  const total = (+m[1]) * 60 + (+m[2]);

  const btns = document.createElement('div');
  btns.className = 'crono-btns';
  const bIni = document.createElement('button'); bIni.textContent = '▶ Iniciar';
  const bZer = document.createElement('button'); bZer.textContent = '↺ Zerar';
  bZer.className = 'sec';
  btns.append(bIni, bZer);
  const dica = document.createElement('div');
  dica.className = 'crono-dica';
  dica.textContent = 'Barra de espaço inicia e pausa · Z zera';
  // depois do tempo e do título, antes do enunciado
  const alvo = sl.querySelector('h2') || num;
  alvo.after(btns, dica);

  const c = { sl, num, total, resta: total, id: null, rodando: false };

  function pinta(){
    const mm = Math.floor(c.resta / 60), ss = c.resta % 60;
    c.num.textContent = mm + ':' + String(ss).padStart(2, '0');
    c.num.classList.toggle('acabou', c.resta === 0);
  }
  function parar(){
    clearInterval(c.id); c.id = null; c.rodando = false; bIni.textContent = '▶ Iniciar';
  }
  c.zerar = function(){
    parar(); c.resta = c.total; c.sl.classList.remove('tocando'); pinta();
  };
  c.alternar = function(){
    if (c.rodando) { parar(); bIni.textContent = '▶ Continuar'; return; }
    if (c.resta === 0) c.zerar();
    c.rodando = true; bIni.textContent = '⏸ Pausar';
    c.sl.classList.remove('tocando');
    c.id = setInterval(() => {
      c.resta--; pinta();
      if (c.resta <= 0) { parar(); c.sl.classList.add('tocando'); }
    }, 1000);
  };

  bIni.onclick = c.alternar;
  bZer.onclick = c.zerar;
  cronos.push(c);
});
// o cronômetro do slide atual, se houver
const cronoAtivo = () => cronos.find(c => c.sl.closest('.slide') === slides[cur]);

/* ---- modal dos prompts ----
   Os textos vêm da apostila, embutidos na montagem. Abrir um card copia
   o prompt e oferece as quatro IAs: o apresentador clica, cola e mostra
   a resposta ao vivo. */
const PROMPTS = ${JSON.stringify(BANCO)};
const LISTA_IAS = ${JSON.stringify(IAS)};
const modal = document.getElementById('prompt-modal');
const pmTitulo = document.getElementById('pm-titulo');
const pmTexto = document.getElementById('pm-texto');
const pmCopiar = document.getElementById('pm-copiar');
const pmIas = document.getElementById('pm-ias');

// Os botões do modal são recriados a cada abertura, porque o link de
// quem aceita prompt na URL muda conforme o prompt escolhido.
const botoesIA = LISTA_IAS.map(ia => {
  const a = document.createElement('a');
  a.className = 'ia-btn ' + ia.id;
  a.target = '_blank'; a.rel = 'noopener';
  a.innerHTML = '<span class="pt"></span>' + ia.nome +
    (ia.q ? '<span class="ja">já com o texto</span>' : '');
  a.title = ia.q
    ? 'Abre o ' + ia.nome + ' com o prompt já escrito — é só apertar Enter'
    : 'Abre o ' + ia.nome + '. O prompt já está copiado: cole com Ctrl+V';
  pmIas.appendChild(a);
  return { ia, a };
});
// Atualiza o href de cada botão para o prompt que está aberto.
function apontarBotoes(texto){
  botoesIA.forEach(({ ia, a }) => {
    a.href = ia.q ? ia.url + '/?' + ia.q + '=' + encodeURIComponent(texto) : ia.url;
  });
}

function copiar(txt, btn){
  const feito = () => {
    const antes = btn.textContent;
    btn.textContent = '✓ Copiado!'; btn.classList.add('ok');
    setTimeout(() => { btn.textContent = antes; btn.classList.remove('ok'); }, 1800);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(txt).then(feito).catch(() => fallback(txt, feito));
  } else fallback(txt, feito);
}
// file:// não é contexto seguro em todo navegador — daí o plano B.
function fallback(txt, feito){
  const ta = document.createElement('textarea');
  ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); feito(); } catch(e) {}
  document.body.removeChild(ta);
}

/* Cada prompt do deck ganha os mesmos atalhos do modal: copiar e abrir
   nas IAs, com o texto já na URL onde a ferramenta aceita. */
document.querySelectorAll('.prompt-acoes').forEach(cx => {
  const texto = cx.dataset.promptTxt || '';
  if (!texto) return;
  const bt = document.createElement('button');
  bt.className = 'copiar-mini';
  bt.textContent = '📋 Copiar';
  bt.onclick = () => copiar(texto, bt);
  cx.appendChild(bt);
  LISTA_IAS.forEach(ia => {
    const a = document.createElement('a');
    a.className = 'ia-btn mini ' + ia.id;
    a.target = '_blank'; a.rel = 'noopener';
    a.href = ia.q ? ia.url + '/?' + ia.q + '=' + encodeURIComponent(texto) : ia.url;
    a.innerHTML = '<span class="pt"></span>' + ia.nome;
    a.title = ia.q
      ? 'Abre o ' + ia.nome + ' com este prompt já escrito'
      : 'Abre o ' + ia.nome + ' — copie antes com o botão ao lado';
    cx.appendChild(a);
  });
});

function abrirModal(i){
  const p = PROMPTS[i];
  if (!p) return;
  pmTitulo.textContent = p.titulo;
  pmTexto.textContent = p.texto;
  pmCopiar.onclick = () => copiar(p.texto, pmCopiar);
  apontarBotoes(p.texto);
  modal.classList.add('aberto');
  copiar(p.texto, pmCopiar);   // já copia ao abrir: um clique a menos em sala
}
function fecharModal(){ modal.classList.remove('aberto'); }

document.addEventListener('click', e => {
  const card = e.target.closest('.card.abrivel');
  if (card) { abrirModal(+card.dataset.prompt); return; }
  // checklist: marcar e desmarcar, só efeito visual
  const item = e.target.closest('.sl-saida .it.marcavel, .chk');
  if (item) { item.classList.toggle('feito'); return; }
  if (e.target === modal) fecharModal();       // clique fora fecha
});
document.getElementById('pm-fechar').onclick = fecharModal;
const modalAberto = () => modal.classList.contains('aberto');

function ir(n){
  cur = Math.max(0, Math.min(slides.length-1, n));
  // sair de um slide de atividade zera o relógio dele
  cronos.forEach(c => { if (c.sl.closest('.slide') !== slides[cur]) c.zerar(); });
  // e desmarca o checklist, para a próxima turma começar limpo
  slides.forEach((s,i) => { if (i !== cur)
    s.querySelectorAll('.feito').forEach(it => it.classList.remove('feito')); });
  slides.forEach((s,i)=>s.classList.toggle('active', i===cur));
  document.getElementById('counter').textContent = (cur+1)+' / '+slides.length;
  document.getElementById('bar').style.width = ((cur+1)/slides.length*100)+'%';
  document.querySelectorAll('.thumb').forEach((t,i)=>t.classList.toggle('current', i===cur));
}
document.getElementById('next').onclick=()=>ir(cur+1);
document.getElementById('prev').onclick=()=>ir(cur-1);
document.getElementById('first').onclick=()=>ir(0);
document.getElementById('last').onclick=()=>ir(slides.length-1);
document.getElementById('full').onclick=()=>{
  if(!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
};
const overlay=document.getElementById('thumb-overlay'), grid=document.getElementById('thumb-grid');
slides.forEach((s,i)=>{
  const t=document.createElement('div'); t.className='thumb';
  t.innerHTML='<div class="thumb-num">'+(i+1)+'</div><div class="thumb-title">'+(s.dataset.title||'')+'</div>';
  t.onclick=()=>{ir(i); overlay.style.display='none';}; grid.appendChild(t);
});
document.getElementById('grid').onclick=()=>{overlay.style.display=overlay.style.display==='block'?'none':'block';};
document.getElementById('thumb-close').onclick=()=>overlay.style.display='none';
document.addEventListener('keydown', e=>{
  // com o prompt aberto, o teclado pertence ao modal
  if(modalAberto()){
    if(e.key==='Escape'){e.preventDefault();fecharModal();}
    return;
  }
  // num slide de cronômetro a barra controla o relógio, não a navegação:
  // é a tecla que a mão do apresentador já procura. Seta direita avança.
  const cr = cronoAtivo();
  if(cr && e.key===' '){e.preventDefault();cr.alternar();return;}
  if(cr && (e.key==='z'||e.key==='Z')){e.preventDefault();cr.zerar();return;}
  if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){e.preventDefault();ir(cur+1);}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();ir(cur-1);}
  else if(e.key==='Home')ir(0); else if(e.key==='End')ir(slides.length-1);
  else if(e.key==='g'||e.key==='G')document.getElementById('grid').click();
  else if(e.key==='f'||e.key==='F')document.getElementById('full').click();
  else if(e.key==='Escape')overlay.style.display='none';
});
/* A barra de controles fica discreta para não cobrir o rodapé dos
   slides cheios, e reaparece a cada navegação ou movimento do mouse. */
const barraCtrl = document.querySelector('.controls');
let sumirCtrl;
function piscarControles(){
  barraCtrl.classList.add('ativa');
  clearTimeout(sumirCtrl);
  sumirCtrl = setTimeout(() => barraCtrl.classList.remove('ativa'), 2500);
}
document.addEventListener('keydown', piscarControles);
document.addEventListener('mousemove', piscarControles);

ir(0);
piscarControles();
</script>
</body></html>`;

fs.writeFileSync(path.join(D, 'Slides_IA_Educadores_2026.html'), head + deck.join('\n') + foot, 'utf8');
const c = re => (deck.join('').match(re) || []).length;
console.log('Deck montado:', deck.length, 'slides');
console.log('  aquecimentos :', c(/class="sl-aquec"/g));
console.log('  casos        :', c(/class="sl-caso"/g));
console.log('  duelos       :', c(/class="sl-duelo"/g));
console.log('  caça ao erro :', c(/class="sl-caca"/g));
console.log('  cronômetros  :', c(/class="sl-crono"/g));
console.log('  saídas       :', c(/class="sl-saida"/g));
console.log('  prompts no modal :', BANCO.length, '· cards ligados:', ligados);
console.log('  atalhos de IA    :', comBarra, 'slides ·', urlsLigadas, 'URLs clicáveis');
console.log('  checkbox clicáveis:', caixas);
console.log('  prompts com botão :', promptsAbriveis, '· sem botão (ruins/curtos):', promptsIgnorados);
