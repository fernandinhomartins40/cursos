/* Monta a apostila completa integrando:
   - os capítulos originais (partes já escritas)
   - as atividades novas (casos, duelos, caça ao erro, celular, desafios)
   - as imagens (só entram se o arquivo não for placeholder em branco)
   - os destacáveis
*/
const fs = require('fs');
const path = require('path');
const D = __dirname;

const ler = f => fs.readFileSync(path.join(D, f), 'utf8');

// ---- blocos de atividade, recortados por id ----
const atividades = ler('bloco_casos_e_duelos.html') + ler('bloco_casos_extras.html');
function bloco(id) {
  // captura <div class="..." id="ID"> ... até o </div> que fecha esse div
  const marca = `id="${id}"`;
  const i = atividades.indexOf(marca);
  if (i === -1) throw new Error('bloco não encontrado: ' + id);
  const ini = atividades.lastIndexOf('<div', i);
  let prof = 0, j = ini;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = ini;
  let m;
  while ((m = re.exec(atividades))) {
    if (m[0] === '</div>') { prof--; if (prof === 0) { j = m.index + 6; break; } }
    else prof++;
  }
  return atividades.slice(ini, j);
}

// ---- imagens: só inclui se NÃO for placeholder ----
const PLACEHOLDER_MAX = 60000; // bytes; placeholders em branco são bem menores
function img(arquivo, legenda, classe) {
  const p = path.join(D, 'imagens', arquivo);
  if (!fs.existsSync(p)) return '';
  if (fs.statSync(p).size < PLACEHOLDER_MAX) return ''; // ainda é o branco → omite
  return `<div class="figura-img ${classe || ''}">
  <img src="imagens/${arquivo}" alt="${legenda}">
  <div class="legenda">${legenda}</div>
</div>`;
}


// substitui a N-ésima oficina (1-based) de um texto pelo conteúdo dado
function trocaOficina(txt, n, novo){
  const re = /<div class="oficina">[\s\S]*?<\/div>\s*<\/div>|<div class="oficina">[\s\S]*?<\/div>/g;
  let m, i = 0, achados = [];
  while ((m = re.exec(txt))) { achados.push([m.index, m.index + m[0].length]); }
  if (achados.length < n) return txt;
  const [a, b] = achados[n - 1];
  return txt.slice(0, a) + novo + txt.slice(b);
}

// ---- montagem ----
let html = ler('parte1_abertura_encontro1.html');

// Encontro 1
html = html.replace('<h2>1.1 O que é Inteligência Artificial?</h2>',
  bloco('aq1') + '\n<h2>1.1 O que é Inteligência Artificial?</h2>');
html = html.replace('<h2>1.2 Tipos de IA que nos interessam</h2>',
  img('01_whatsapp_teclado_previsao.png', 'A IA prevê a próxima palavra, como o teclado do celular.', 'metade') +
  '\n<h2>1.2 Tipos de IA que nos interessam</h2>');
html = html.replace('<h2>1.5 Passo a Passo: Seu Primeiro Acesso</h2>',
  img('03_dois_barcos_estrategia.png', 'A Regra dos Dois Barcos: nunca dependa de uma ferramenta só.', 'metade') +
  '\n<h2>1.5 Passo a Passo: Seu Primeiro Acesso</h2>');
// substitui a oficina antiga pelo teste no celular + caça ao erro
html = html.replace(/<div class="oficina">[\s\S]*?<\/div>\s*$/,
  bloco('cel1') + '\n' + bloco('caca1'));

let p2 = ler('parte2_cap2_prompts.html');
p2 = p2.replace('<h2>2.3 Prompt Ruim vs. Prompt Bom (Exemplo Real)</h2>',
  img('02_formula_ptcf_esquema.png', 'A fórmula P.T.C.F., estrutura recomendada para prompts pedagógicos.', 'metade') +
  '\n<h2>2.3 Prompt Ruim vs. Prompt Bom (Exemplo Real)</h2>');
// duelo 1 entra logo após a seção 2.3
p2 = p2.replace('<h2>2.4 Técnicas Avançadas de Prompt</h2>',
  bloco('duelo1') + '\n<h2>2.4 Técnicas Avançadas de Prompt</h2>');
p2 = p2.replace('<h2>2.5 Banco de 15 Prompts Prontos para o Professor</h2>',
  bloco('caso5') + '\n<h2>2.5 Banco de 15 Prompts Prontos para o Professor</h2>');
// caso 1 + desafio 1 + saída substituem a oficina antiga do fim
p2 = p2.replace(/<div class="oficina">[\s\S]*?<\/div>\s*<div class="dica">/,
  bloco('caso1') + '\n' + bloco('des1') + '\n' + bloco('saida1') + '\n<div class="dica">');

let p3 = ler('parte3_encontro2.html');
p3 = p3.replace('<h2>3.1 Organizando a Semana de Trabalho</h2>',
  bloco('aq2') + '\n<h2>3.1 Organizando a Semana de Trabalho</h2>');
p3 = p3.replace('<h2>3.2 Escrevendo E-mails e Comunicados</h2>',
  img('06_organizacao_rotina_professor.png', 'A IA como assistente na organização do tempo extraclasse.', 'metade') +
  '\n<h2>3.2 Escrevendo E-mails e Comunicados</h2>');
p3 = p3.replace('<h2>3.4 Atas de Reunião Pedagógica</h2>',
  bloco('caso2') + '\n' + bloco('duelo2') + '\n<h2>3.4 Atas de Reunião Pedagógica</h2>');
p3 = p3.replace(/<div class="oficina">[\s\S]*?<\/div>\s*<!-- =+ CAPÍTULO 4/,
  bloco('des2') + '\n<!-- CAPÍTULO 4');
p3 = p3.replace('<h2>4.2 Sequências Didáticas</h2>',
  bloco('caca2') + '\n' + img('08_bncc_codigo_explicado.png', 'Cada código da BNCC diz etapa, ano, componente e habilidade.', 'metade') +
  '\n<h2>4.2 Sequências Didáticas</h2>');
p3 = p3.replace('<h2>4.3 Projetos Interdisciplinares</h2>',
  bloco('caso6') + bloco('duelo7') + '<h2>4.3 Projetos Interdisciplinares</h2>');
p3 = p3.replace('<h2>5.2 Outras formas de lidar com documentos</h2>',
  img('09_notebooklm_documentos.png', 'O NotebookLM localiza a informação exata dentro de documentos longos.', 'metade') +
  '\n<h2>5.2 Outras formas de lidar com documentos</h2>');
p3 = p3.replace(/<div class="oficina">[\s\S]*?<\/div>\s*$/,
  bloco('cel2') + '\n' + bloco('saida2'));

let p4 = ler('parte4_encontro3.html');
p4 = p4.replace('<h2>6.1 Textos de Leitura Personalizados</h2>',
  bloco('aq3') + '\n<h2>6.1 Textos de Leitura Personalizados</h2>');
p4 = p4.replace('<h2>6.2 Listas de Exercícios com Gabarito</h2>',
  bloco('duelo3') + '\n<h2>6.2 Listas de Exercícios com Gabarito</h2>');
p4 = p4.replace('<h2>7.1 Adaptação para TDAH</h2>',
  img('12_inclusao_escolar_sala.png', 'A IA permite adaptar materiais para cada necessidade, em minutos.', 'metade') +
  '\n<h2>7.1 Adaptação para TDAH</h2>');
p4 = p4.replace('<h2>7.4 Alunos com Altas Habilidades</h2>',
  bloco('caca3') + '\n<h2>7.4 Alunos com Altas Habilidades</h2>');
p4 = p4.replace('<h2>7.5 Diferenciação Pedagógica: a mesma aula em 3 níveis</h2>',
  bloco('caso3') + '\n<h2>7.5 Diferenciação Pedagógica: a mesma aula em 3 níveis</h2>');
p4 = p4.replace('<h2>8.1 Canva para Educação: Pro gratuito para docentes</h2>',
  bloco('des3') + '\n' + bloco('cel3') +
  '\n<h2>8.1 Canva para Educação: Pro gratuito para docentes</h2>');
p4 = p4.replace('<h2>6.6 Plataformas prontas para professores</h2>',
  bloco('duelo6') + '<h2>6.6 Plataformas prontas para professores</h2>');
p4 = p4.replace('<h2>8.2 Cartazes, Infográficos e Murais</h2>',
  img('15_canva_educacao_design.png', 'O Canva para Educação gera apresentações e cartazes prontos.', 'metade') +
  '\n<h2>8.2 Cartazes, Infográficos e Murais</h2>');
// remove as oficinas antigas de trás para frente, para não invalidar índices
p4 = p4.replace('<h2>6.5 Material de Reforço Escolar</h2>', bloco('caso7') + '<h2>6.5 Material de Reforço Escolar</h2>');
p4 = trocaOficina(p4, 3, bloco('saida3'));
p4 = trocaOficina(p4, 2, '');
p4 = trocaOficina(p4, 1, '');
if (p4.indexOf('id="caca3"') === -1) {
  p4 = p4.replace('<h2>7.4 Alunos com Altas Habilidades</h2>',
    bloco('caca3') + '\n<h2>7.4 Alunos com Altas Habilidades</h2>');
}

let p5 = ler('parte5_encontro4.html');
p5 = p5.replace('<h2>9.1 Provas Inéditas</h2>', bloco('aq4') + '\n<h2>9.1 Provas Inéditas</h2>');
p5 = p5.replace('<h2>9.2 Diferentes Tipos de Avaliação</h2>',
  bloco('des4') + '\n<h2>9.2 Diferentes Tipos de Avaliação</h2>');
p5 = p5.replace('<h2>9.3 Rubricas de Avaliação</h2>',
  bloco('duelo5') + '\n<h2>9.3 Rubricas de Avaliação</h2>');
p5 = p5.replace('<h2>9.4 Feedback Construtivo para os Alunos</h2>',
  bloco('caca4') + '\n<h2>9.4 Feedback Construtivo para os Alunos</h2>');
p5 = p5.replace('<h2>9.5 Combatendo a "cola" com IA</h2>',
  bloco('duelo8') + '\n' + bloco('caso8') + '\n<h2>9.5 Combatendo a "cola" com IA</h2>');
p5 = p5.replace(/<div class="oficina">[\s\S]*?<\/div>\s*<!-- =+ CAPÍTULO 10/,
  bloco('duelo4') + '\n<!-- CAPÍTULO 10');
p5 = p5.replace('<h2>10.3 Onde ficam os seus dados</h2>',
  img('17_seguranca_lgpd_escola.png', 'Proteger os dados dos alunos é obrigação legal e ética.', 'metade') +
  '\n' + bloco('caso4') + '\n<h2>10.3 Onde ficam os seus dados</h2>');
p5 = p5.replace(/<div class="oficina">[\s\S]*?<\/div>\s*<!-- =+ CAPÍTULO 11/,
  bloco('cel4') + '\n<!-- CAPÍTULO 11');
p5 = p5.replace('<h2>11.2 Ideias de Projetos</h2>',
  img('19_projeto_intervencao_final.png', 'O Projeto de Intervenção aplicado na realidade da sua escola.', 'metade') +
  '\n<h2>11.2 Ideias de Projetos</h2>');
p5 = p5.replace('<div class="encerramento">', bloco('saida4') + '\n' +
  bloco('diario') + '\n' + bloco('autoaval') + '\n' +
  img('20_professor_insubstituivel.png', 'A tecnologia amplia o alcance; o vínculo humano é insubstituível.', 'metade') +
  '\n<div class="encerramento">');

const p6 = ler('parte6_anexos.html');
const dest = ler('bloco_destacaveis.html');

// Capítulos 1.7 a 1.9: as fichas das quatro ferramentas e a criação de
// contas. Entram no fim do Encontro 1, DEPOIS da oficina dos dois barcos
// — é lá que o cursista precisa das contas prontas. Não renumeramos nada:
// as substituições acima ancoram em títulos literais, e mexer na
// numeração dos capítulos quebraria a montagem inteira.
const ferramentas = ler('bloco_ferramentas.html');
html = html + '\n' + ferramentas;

// Capítulo 13 (Formação Avançada) e Anexo D (glossário de 51 verbetes):
// conteúdo que nasceu na plataforma e não existia no impresso.
const avancado = ler('bloco_avancado.html');

const head = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Inteligência Artificial para Educadores — Apostila Completa</title>
<link rel="stylesheet" href="estilo.css">
<link rel="stylesheet" href="componentes_novos.css">
<link rel="stylesheet" href="componentes_ferramentas.css">
</head>
<body>
`;

const final = head + [html, p2, p3, p4, p5, p6, avancado, dest].join('\n') + '\n</body></html>';
fs.writeFileSync(path.join(D, 'Apostila_IA_Educadores_2026.html'), final, 'utf8');

const cont = (re) => (final.match(re) || []).length;
console.log('Apostila montada.');
console.log('  estudos de caso :', cont(/class="caso"/g));
console.log('  duelos          :', cont(/class="duelo"/g));
console.log('  caça ao erro    :', cont(/class="caca"/g));
console.log('  testes celular  :', cont(/class="celular"/g));
console.log('  desafios        :', cont(/class="desafio"/g));
console.log('  aquecimentos    :', cont(/class="aquecimento"/g));
console.log('  saídas          :', cont(/class="saida"/g));
console.log('  destacáveis     :', cont(/class="destacavel/g));
console.log('  imagens ativas  :', cont(/class="figura-img/g));
