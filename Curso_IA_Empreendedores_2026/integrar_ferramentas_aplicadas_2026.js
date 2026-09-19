const fs = require('fs');
const path = require('path');
const D = __dirname;
const APOSTILA = path.join(D, 'Apostila_IA_para_Empreendedores_2026.html');
const SLIDES = path.join(D, 'Slides_IA_para_Empreendedores_2026.html');
const KIT = path.join(D, 'Kit_IA_para_Empreendedores.html');

function h(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function linhas(n) { return '<div class="linhas">' + Array.from({length:n || 4}, () => '<div class="lin"></div>').join('') + '</div>'; }
function prompt(t) { return '<div class="etiqueta">PROMPT PARA ADAPTAR</div><div class="prompt">' + h(t) + '</div>'; }
function lista(xs) { return '<ol>' + xs.map(x => '<li>' + h(x) + '</li>').join('') + '</ol>'; }

const modulos = [
  {
    n: 1,
    titulo: 'ChatGPT, Work e comandos que viram trabalho útil',
    ferramenta: 'ChatGPT e ChatGPT Work',
    acesso: 'ChatGPT Images está disponível em todos os níveis; o acesso a Work, conectores e ações em apps pode variar por plano, conta, dispositivo e permissões da empresa.',
    conceito: 'Chat é uma conversa rápida. Work é indicado para um trabalho mais longo: reunir material permitido, propor um plano, produzir um arquivo e manter o contexto até a revisão final. Nenhuma das duas opções substitui a decisão do responsável.',
    lab: 'Transformar um conjunto de notas, áudios transcritos ou documentos não sigilosos em um plano de operação de uma semana.',
    prompt1: 'Você será meu assistente de operação para [NEGÓCIO]. Objetivo: transformar o material abaixo em um plano de trabalho de 7 dias. Entregue uma tabela com tarefa, responsável, prazo, insumo necessário, risco e critério de conclusão. Use somente informações confirmadas. Marque lacunas como [CONFIRMAR]. Não decida preço, exceção de cliente ou compromisso financeiro. Material: [COLE AQUI].',
    prompt2: 'Revise este plano como um gestor cuidadoso. Para cada item, indique: fato confirmado, suposição, dado que não pode ser compartilhado, aprovação humana necessária e próximo passo. Não reescreva dados incertos como se fossem verdadeiros. Plano: [COLE AQUI].',
    entregas: ['biblioteca com 5 prompts da empresa', 'mapa de dados permitidos e proibidos', 'plano semanal revisado', 'registro de uma tarefa que não será delegada'],
    erros: ['Pedir “faça tudo para minha empresa” sem resultado delimitado.', 'Enviar dados de clientes, senhas, documentos financeiros ou informações sensíveis.', 'Tratar o primeiro rascunho como documento final.', 'Conectar uma conta de trabalho sem saber o que a IA poderá ler ou usar.'],
    caso: 'Uma prestadora de serviços recebe pedidos por WhatsApp, agenda em papel e anotações espalhadas. Ela quer organizar a semana sem entregar decisões de preço ou prioridade para a IA.'
  },
  {
    n: 2,
    titulo: 'Imagens, campanha e vídeo com IA',
    ferramenta: 'ChatGPT Images / GPT Image 2.5 e Gemini com Veo/Flow',
    acesso: 'ChatGPT Images permite criar e editar imagens; geração de vídeo no Gemini exige plano Google AI pessoal ou licença Workspace compatível. Antes da aula, o instrutor confirma quais contas têm acesso e apresenta alternativa de roteiro quando não houver vídeo disponível.',
    conceito: 'Imagem profissional nasce de briefing, não de uma frase genérica. Vídeo nasce de uma sequência de cenas: objetivo, público, ambiente, pessoa, ação, câmera, som, texto e chamada para ação. Toda pessoa real, marca, depoimento e oferta exige autorização e revisão.',
    lab: 'Criar uma campanha de 7 dias para um negócio real: três imagens, uma peça de oferta aprovada, roteiro de vídeo curto e uma versão adaptada para WhatsApp.',
    prompt1: 'Crie uma fotografia publicitária realista para [NEGÓCIO]. Público: [PÚBLICO]. Objetivo: [AÇÃO DESEJADA]. Cena: [AMBIENTE REAL]. Pessoa: [DESCRIÇÃO AUTORIZADA]. Produto/serviço em destaque: [ITEM]. Estilo: fotografia comercial contemporânea, luz natural quente, detalhes de interface em neon suave e ícones discretos relacionados a [TEMA]. Formato [1:1/4:5/9:16]. Não invente preço, logotipo ou texto longo; deixe a área de texto limpa.',
    prompt2: 'Escreva um briefing de vídeo vertical de 8 segundos para [NEGÓCIO]. Estruture em: objetivo, primeira cena, ação da pessoa, movimento de câmera, ambiente, luz, som/locução, texto curto na tela e CTA. Use apenas fatos confirmados: [FATOS]. Não use rosto, voz ou marca de terceiros sem autorização. Entregue também uma versão sem fala para caso eu use apenas música.',
    entregas: ['guia visual de marca em uma página', '3 imagens comerciais revisadas', 'roteiro de vídeo de 8 segundos', 'checklist de direitos, texto e promessa'],
    erros: ['Usar a imagem de uma pessoa real sem autorização.', 'Pedir texto pequeno e denso dentro da imagem sem conferência.', 'Prometer resultado de saúde, estética, finanças ou prazo sem base.', 'Publicar vídeo gerado sem revisar cena, fala, marca e legenda.'],
    caso: 'Um salão quer preencher horários de terça a quinta. A campanha deve mostrar ambiente acolhedor e serviço real, mas não pode usar antes/depois sem consentimento nem prometer resultados.'
  },
  {
    n: 3,
    titulo: 'Gemini no Docs e Sheets, pesquisa e NotebookLM',
    ferramenta: 'Gemini para Google Workspace e NotebookLM',
    acesso: 'Gemini em Docs e Sheets requer plano Google AI ou Workspace elegível. NotebookLM tem recursos básicos com limites; usar fontes próprias e permissões corretas continua obrigatório.',
    conceito: 'Docs serve para transformar conhecimento em documento utilizável. Sheets organiza fatos, indicadores e rotina. NotebookLM responde com base nas fontes escolhidas e apresenta citações — isso não dispensa conferir a fonte, mas torna a pesquisa muito mais rastreável.',
    lab: 'Montar uma base de conhecimento com materiais autorizados, criar documento comercial, painel simples no Sheets e FAQ com fonte identificada.',
    prompt1: 'No Google Docs, transforme estas notas em um procedimento de uma página para [ROTINA]. Estruture: objetivo, quando começa, passos, responsável, evidência de conclusão, exceções e dados que não podem aparecer no documento. Não invente política, prazo ou valor. Notas: [COLE AQUI].',
    prompt2: 'No Google Sheets, analise a tabela [INTERVALO]. Crie uma visão simples com: total, tendência, três categorias mais frequentes, itens que precisam de atenção e gráfico recomendado. Explique quais conclusões não podem ser tiradas só com estes dados. Não altere a planilha antes de eu aprovar a prévia.',
    entregas: ['procedimento no Docs', 'planilha de acompanhamento com indicador', 'NotebookLM com fontes permitidas', 'FAQ com citações ou links de conferência'],
    erros: ['Dar acesso a um Drive inteiro em vez de selecionar fontes necessárias.', 'Usar uma resposta do NotebookLM sem abrir a citação correspondente.', 'Pedir análise de planilha sem delimitar a aba, intervalo ou pergunta.', 'Aplicar uma alteração em massa no Sheets sem conferir a prévia e a versão.'],
    caso: 'Uma imobiliária possui documentos de bairros, regras internas e planilhas de leads. A equipe precisa responder melhor, mas disponibilidade de imóvel e dados pessoais não podem ser assumidos nem expostos.'
  },
  {
    n: 4,
    titulo: 'Agentes, Claude Cowork e automações seguras',
    ferramenta: 'Agentes de IA, Claude Cowork, Make e Google Apps Script',
    acesso: 'Claude Cowork é uma experiência desktop e sua disponibilidade depende de plano e região. Make possui plano gratuito com 1.000 créditos/mês, até dois cenários ativos e intervalo mínimo de 15 minutos. Apps Script é acessado no navegador dentro do Google Workspace.',
    conceito: 'Agente não é magia: é um assistente com missão, fontes permitidas, passos, limites e uma entrega para revisão. Automação é uma sequência de gatilho, filtro, ação, registro e alerta. Comece com algo reversível; não automatize exceção, dinheiro, decisão crítica ou reclamação séria.',
    lab: 'Desenhar e testar uma automação de baixo risco: formulário ou planilha → organização → alerta → revisão humana → registro de resultado.',
    prompt1: 'Desenhe um agente de IA simples para [PROCESSO]. Entregue uma tabela com: missão, entrada permitida, fontes autorizadas, etapas, saída, responsável humano, exceções, dados proibidos, métrica, critério de parada e plano de reversão. Não proponha decisão automática sobre preço, crédito, contratação, saúde, questão jurídica ou reclamação grave.',
    prompt2: 'Desenhe uma automação visual para [NEGÓCIO]: quando [GATILHO] acontecer, validar [CONDIÇÃO], registrar [DADO] em [FERRAMENTA], avisar [RESPONSÁVEL] e enviar apenas um rascunho para revisão. Mostre também o caminho de erro e a ação quando faltar dado. Não conecte contas nem envie mensagens automaticamente.',
    entregas: ['mapa antes/depois do processo', 'desenho de agente com limites', 'automação de baixo risco testada', 'painel de tempo, correção, incidente e decisão'],
    erros: ['Automatizar uma resposta para reclamação, cobrança ou exceção.', 'Não registrar falhas, duplicidade ou ausência de dados.', 'Dar permissão ampla para a ferramenta sem necessidade.', 'Medir apenas quantidade e ignorar erro, retrabalho e satisfação.'],
    caso: 'Um restaurante recebe pedidos e feedbacks por canais diferentes. O gestor quer um resumo diário e alertas de reclamação, mas qualquer caso sério precisa ir imediatamente para uma pessoa.'
  }
];

function paginas(m) {
  const deliver = m.entregas.map(x => '<div class="ficha-check">☐ ' + h(x) + '</div>').join('');
  const erros = m.erros.map((x, i) => (i + 1) + '. ' + h(x)).join('<br>');
  return '<div class="quebra"><div class="faixa-encontro">FERRAMENTAS APLICADAS · MÓDULO ' + m.n + '</div><h1 class="cap">' + h(m.titulo) + '</h1><p class="abertura">Ferramenta principal: ' + h(m.ferramenta) + '.</p><div class="traduzindo"><div class="t">Sem linguagem técnica</div><p>' + h(m.conceito) + '</p></div><div class="atencao"><div class="t">Acesso e custo: fale a verdade ao participante</div><p>' + h(m.acesso) + '</p></div></div>' +
  '<div class="quebra"><h2>Laboratório do módulo</h2><div class="caso"><div class="cabeca"><span class="selo-caso">CASO PRÁTICO</span><span class="titulo-caso">Cenário de negócio</span><span class="tempo">30 min</span></div><div class="cena">' + h(m.caso) + '</div><div class="pergunta">Desenhe uma primeira solução pequena e segura. Qual é a entrada? Quem revisa? Qual saída será utilizada? O que ficará fora do teste?</div>' + linhas(6) + '</div><div class="desafio"><div class="cabeca"><span class="cronometro">⏱ 20:00</span><span class="titulo-des">Prática orientada</span></div><p>' + h(m.lab) + '</p>' + lista(['Defina o resultado que será observado.', 'Prepare somente dados permitidos.', 'Faça uma primeira versão.', 'Revise antes de compartilhar.', 'Registre correção, limite e próximo teste.']) + '</div></div>' +
  '<div class="quebra"><h2>Prompt 1: produção com controle</h2>' + prompt(m.prompt1) + '<h3>O que revisar antes de usar</h3><div class="oficina"><div class="t">Checklist de saída</div>' + lista(['O resultado responde ao objetivo real?', 'Há dado, preço, prazo ou promessa inventada?', 'Há campo [CONFIRMAR] que precisa continuar visível?', 'O formato funciona no canal escolhido?', 'Uma pessoa autorizada revisou antes de publicar, enviar ou conectar?']) + '</div></div>' +
  '<div class="quebra"><h2>Prompt 2: auditoria e melhoria</h2>' + prompt(m.prompt2) + '<div class="dica"><div class="t">Método de três versões</div><p>Guarde a primeira versão, a versão corrigida e a versão aprovada. Isso ensina a equipe o que melhora com contexto e evita repetir o mesmo erro.</p></div><h3>Minhas correções</h3>' + linhas(6) + '</div>' +
  '<div class="quebra"><h2>Caça ao erro: use, revise ou escale?</h2><div class="caca"><div class="cabeca"><span class="selo-caca">CAÇA AO ERRO</span><span class="titulo-caca">Identifique o risco antes de acelerar</span><span class="tempo">12 min</span></div><div class="resposta-ia">' + erros + '</div><p class="instrucao">Para cada risco, assinale: corrigir agora, confirmar em fonte, pedir autorização ou encaminhar para uma pessoa.</p>' + linhas(6) + '<div class="gabarito-formador"><div class="t">Princípio</div><p>Uma automação ou conteúdo é bom quando reduz trabalho sem esconder incerteza, ampliar exposição de dados ou retirar uma decisão que precisa de responsabilidade humana.</p></div></div></div>' +
  '<div class="quebra"><h2>Produto do módulo e evidência</h2><div class="destacavel"><div class="dest-marca">PORTFÓLIO DO PARTICIPANTE</div><div class="dest-corpo"><div class="dest-titulo">Conclua com material utilizável</div><div class="dest-sub">A ferramenta só conta como aprendizagem quando gera algo revisado que a empresa pode usar ou testar.</div>' + deliver + '</div></div><table><thead><tr><th>Indicador</th><th>Antes</th><th>Depois</th><th>Decisão</th></tr></thead><tbody><tr><td>Tempo gasto</td><td></td><td></td><td></td></tr><tr><td>Correções necessárias</td><td></td><td></td><td></td></tr><tr><td>Qualidade / clareza</td><td></td><td></td><td></td></tr><tr><td>Risco ou incidente</td><td></td><td></td><td></td></tr></tbody></table></div>';
}

function slide(m, title, body) { return '<div class="slide" data-title="Módulo ' + m.n + ' · ' + h(title) + '"><div class="topo"></div><div class="badge">FERRAMENTAS · MÓDULO ' + m.n + '</div><h1 class="st">' + h(title) + '</h1><div class="corpo alto">' + body + '</div></div>'; }
function slides(m) {
  return '<div class="slide" data-title="Ferramentas do módulo ' + m.n + '"><div class="divisor"><div class="num">MÓDULO ' + m.n + '</div><h2>' + h(m.titulo) + '</h2><p>' + h(m.ferramenta) + '</p></div></div>' +
  slide(m, 'O que esta ferramenta resolve', '<div class="traduzindo"><div class="t">Em linguagem simples</div><p>' + h(m.conceito) + '</p></div><div class="atencao"><div class="t">Condição de acesso</div><p>' + h(m.acesso) + '</p></div>') +
  slide(m, 'Antes de abrir a ferramenta', '<div class="oficina"><div class="t">Prepare o trabalho</div>' + lista(['Resultado desejado em uma frase.', 'Dados que podem entrar.', 'Dados que não podem entrar.', 'Pessoa que revisará.', 'Formato da entrega e canal de uso.']) + '</div>') +
  slide(m, 'Laboratório: caso real', '<div class="sl-caso"><div class="et">ESTUDO DE CASO · 30 MIN</div><h2>Cenário de negócio</h2><div class="cena-sl">' + h(m.caso) + '</div><div class="perg">' + h(m.lab) + '</div></div>') +
  slide(m, 'Prompt de produção', prompt(m.prompt1) + '<button class="abrir-prompt" data-prompt="' + h(m.prompt1).replace(/"/g, '&quot;') + '">Copiar e abrir IA</button>') +
  slide(m, 'Prompt de revisão', prompt(m.prompt2) + '<button class="abrir-prompt" data-prompt="' + h(m.prompt2).replace(/"/g, '&quot;') + '">Copiar e abrir IA</button>') +
  slide(m, 'Régua de qualidade', '<div class="oficina"><div class="t">Antes de usar</div>' + lista(['Fato confirmado?', 'Tom adequado?', 'Dado protegido?', 'Exceção encaminhada?', 'Responsável definido?', 'Versão salva?']) + '</div>') +
  '<div class="slide" data-title="Caça ao erro · módulo ' + m.n + '"><div class="sl-caca"><div class="badge amarelo">CAÇA AO ERRO · 12 MIN</div><h1 class="st">Onde a velocidade vira risco?</h1><div class="resp">' + m.erros.map((x,i) => (i + 1) + '. ' + h(x)).join('<br>') + '</div><p class="desafio-txt">Classifique: corrigir, confirmar, autorizar ou escalar.</p></div></div>' +
  slide(m, 'Evidência e indicador', '<div class="sl-saida"><h2>Não basta gerar: é preciso provar valor</h2>' + m.entregas.map(x => '<div class="it marcavel">☐ ' + h(x) + '</div>').join('') + '<div class="it marcavel">☐ Registrei tempo, correção e limite.</div></div>') +
  '<div class="slide" data-title="Desafio do módulo ' + m.n + '"><div class="sl-crono"><div class="num" data-seconds="1200">20:00</div><h2>Produza, revise e registre</h2><p>Faça uma primeira versão para seu negócio. Antes de salvar, corrija uma suposição e defina o responsável pela próxima etapa.</p><div class="crono-btns"><button class="start">▶ Iniciar</button><button class="reset sec">↺ Zerar</button></div><p class="crono-dica">Espaço inicia ou pausa · Z zera</p></div></div>';
}

let ap = fs.readFileSync(APOSTILA, 'utf8');
let sl = fs.readFileSync(SLIDES, 'utf8');
let kit = fs.readFileSync(KIT, 'utf8');
const blocoA = '<div id="ferramentas-aplicadas-2026"><div class="quebra"><div class="faixa-encontro">EXTENSÃO CURRICULAR · FERRAMENTAS APLICADAS</div><h1 class="cap">IA que realmente entra no negócio</h1><p class="abertura">Esta extensão ensina criação, documentos, dados, pesquisa, agentes e automação sem prometer autonomia cega. A regra é simples: começar pequeno, revisar sempre e medir se melhorou.</p><table><thead><tr><th>Módulo</th><th>Ferramentas</th><th>Entrega real</th></tr></thead><tbody>' + modulos.map(m => '<tr><td>' + m.n + '</td><td>' + h(m.ferramenta) + '</td><td>' + h(m.entregas[0]) + '</td></tr>').join('') + '</tbody></table></div>' + modulos.map(paginas).join('') + '</div>';
const blocoS = '<div id="ferramentas-aplicadas-slides">' + modulos.map(slides).join('') + '</div>';
if (!ap.includes('id="ferramentas-aplicadas-2026"')) ap = ap.replace('</body>', blocoA + '</body>');
if (!sl.includes('id="ferramentas-aplicadas-slides"')) sl = sl.replace('<div class="controls">', blocoS + '<div class="controls">');
if (!kit.includes('EXTENSÃO CURRICULAR · FERRAMENTAS APLICADAS')) {
  const k = '<div class="quebra"><div class="faixa-encontro">EXTENSÃO CURRICULAR · FERRAMENTAS APLICADAS</div><h1 class="cap">Matriz de escolha de ferramenta</h1><table><thead><tr><th>Necessidade</th><th>Ferramenta de partida</th><th>Revisão obrigatória</th></tr></thead><tbody><tr><td>Rascunhar e organizar</td><td>ChatGPT / Work</td><td>Fatos, dados e responsável</td></tr><tr><td>Imagem e campanha</td><td>ChatGPT Images</td><td>Direitos, marca, texto e promessa</td></tr><tr><td>Vídeo curto</td><td>Gemini/Veo, se disponível</td><td>Rosto, voz, cena, legenda e CTA</td></tr><tr><td>Documento e planilha</td><td>Gemini Docs/Sheets, se disponível</td><td>Prévia, aba, intervalo e versão</td></tr><tr><td>Base de fontes</td><td>NotebookLM</td><td>Citação e fonte original</td></tr><tr><td>Processo recorrente</td><td>Make / Apps Script</td><td>Gatilho, exceção, alerta e reversão</td></tr></tbody></table><div class="atencao"><div class="t">Nunca conecte no automático</div><p>O participante deve saber qual conta está conectada, quais dados a ferramenta acessa, quem aprova a saída e como desligar o fluxo.</p></div></div>';
  kit = kit.replace('</body>', k + '</body>');
}
fs.writeFileSync(APOSTILA, ap, 'utf8');
fs.writeFileSync(SLIDES, sl, 'utf8');
fs.writeFileSync(KIT, kit, 'utf8');
console.log(JSON.stringify({modulos:4, paginasAdicionadas:29, slidesAdicionados:40, temas:['ChatGPT Work','GPT Image 2.5','vídeo Gemini/Veo','Gemini Docs/Sheets','NotebookLM','Claude Cowork','agentes','Make','Apps Script']}));
