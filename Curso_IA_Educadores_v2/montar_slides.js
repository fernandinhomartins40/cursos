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

function ir(n){
  cur = Math.max(0, Math.min(slides.length-1, n));
  // sair de um slide de atividade zera o relógio dele
  cronos.forEach(c => { if (c.sl.closest('.slide') !== slides[cur]) c.zerar(); });
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
ir(0);
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
