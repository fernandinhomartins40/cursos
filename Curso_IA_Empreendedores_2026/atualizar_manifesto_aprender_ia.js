const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'conteudo_aprender_ia.json');
function corrigir(v) {
  if (typeof v === 'string') return /Ã|Â|â/.test(v) ? Buffer.from(v, 'latin1').toString('utf8') : v;
  if (Array.isArray(v)) return v.map(corrigir);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, corrigir(x)]));
  return v;
}
const data = corrigir(JSON.parse(fs.readFileSync(file, 'utf8')));
data.schema_version = '1.1';
data.course.subtitle = 'Uma formação prática para criar, organizar, pesquisar, analisar e automatizar com IA de forma responsável.';
data.course.audience = ['MEIs', 'autônomos', 'pequenos negócios'];
data.course.curricular_note = '4 encontros de 2h + 32h de aplicação guiada; cada módulo inclui ferramenta, prática, evidência e revisão humana.';
const ext = {
  e1_tempo: [
    ['FERRAMENTA', 'ChatGPT: conversa rápida versus trabalho estruturado', 15, 'Entenda quando pedir um rascunho e quando conduzir um projeto com etapas.'],
    ['LABORATORIO', 'ChatGPT Work: plano semanal com arquivos permitidos', 40, 'Monte um plano de 7 dias a partir de notas não sensíveis.', null, ['plano com tarefa', 'responsável', 'prazo', 'lacunas marcadas [CONFIRMAR]']],
    ['PROMPT', 'Auditoria de dados e decisões humanas', 25, 'Revise um plano antes de usá-lo.', 'Revise este plano como gestor. Indique fatos confirmados, suposições, dados proibidos, aprovação humana necessária e próximo passo. Não transforme incertezas em fatos. Plano: [COLE AQUI].'],
    ['CACA_ERRO', 'Conta conectada não significa acesso sem limite', 25, 'Identifique dados, permissões e decisões que não devem ser delegadas.'],
    ['CHECKPOINT', 'Biblioteca de prompts e regra de segurança', 60, 'Conclua o módulo com prática repetível.', null, ['5 prompts salvos', 'dados permitidos e proibidos', 'responsável pela revisão', 'uma tarefa não delegável']]
  ],
  e2_marketing: [
    ['FERRAMENTA', 'Briefing visual para imagem profissional', 15, 'Aprenda a descrever pessoa, ambiente, objetivo, formato, marca e limites.'],
    ['PROMPT', 'ChatGPT Images: imagem comercial com pessoa real', 30, 'Crie uma imagem baseada em briefing.', 'Crie uma fotografia publicitária realista para [NEGÓCIO]. Público: [PÚBLICO]. Objetivo: [AÇÃO]. Cena: [AMBIENTE]. Produto/serviço: [ITEM]. Formato: [1:1/4:5/9:16]. Não invente preço, logotipo ou texto longo; mantenha área limpa para texto.'],
    ['DESAFIO', 'Edição de imagem: preserve o que importa', 35, 'Edite cenário, formato ou detalhe sem perder produto, pessoa autorizada ou identidade.', null, ['imagem inicial', 'edição solicitada', 'versão aprovada', 'checagem de direitos']],
    ['LABORATORIO', 'Vídeo curto: roteiro antes da geração', 40, 'Crie um briefing de vídeo de 8 segundos; use Gemini/Veo apenas se a conta tiver acesso.', null, ['objetivo', 'cenas', 'câmera', 'som ou fala', 'CTA', 'revisão de rosto e voz']],
    ['CACA_ERRO', 'Direitos de imagem, promessa e texto na arte', 25, 'Encontre os riscos de publicar conteúdo criado por IA.'],
    ['CHECKPOINT', 'Kit de campanha de 7 dias', 60, 'Entregue imagens, roteiro e calendário revisados.', null, ['3 imagens', '1 roteiro de vídeo', 'legendas', 'CTA', 'checklist de aprovação']]
  ],
  e3_vendas: [
    ['FERRAMENTA', 'Gemini no Docs: procedimento e documento comercial', 20, 'Use somente se o plano Google AI ou Workspace for elegível; caso contrário, pratique o mesmo briefing em editor comum.'],
    ['LABORATORIO', 'Gemini no Sheets: perguntar sobre dados sem adivinhar', 40, 'Delimite aba, intervalo, pergunta e prévia antes de aplicar uma ação.', null, ['pergunta de análise', 'intervalo definido', 'prévia conferida', 'indicador criado']],
    ['PROMPT', 'Resumo e análise de planilha', 25, 'Produza uma leitura inicial sem alterar dados.', 'Analise a tabela [INTERVALO]. Mostre total, tendência, três categorias mais frequentes, itens de atenção e gráfico recomendado. Explique quais conclusões não são possíveis apenas com estes dados. Não altere nada antes de eu aprovar.'],
    ['FERRAMENTA', 'NotebookLM: perguntas ancoradas nas fontes', 25, 'Monte uma base com PDFs, Docs, sites ou vídeos autorizados e abra as citações antes de decidir.'],
    ['DESAFIO', 'FAQ verificável da empresa', 40, 'Crie perguntas frequentes com fonte, data ou link para conferência.', null, ['fontes selecionadas', '5 perguntas', 'citações abertas', 'lacunas registradas']],
    ['CHECKPOINT', 'Documento, painel e base de conhecimento', 60, 'Entregue materiais que a equipe consegue usar e revisar.', null, ['procedimento no Docs', 'planilha com indicador', 'NotebookLM', 'FAQ com fonte']]
  ],
  e4_implantacao: [
    ['TEORIA', 'Agente em linguagem simples', 20, 'Agente é uma missão com entrada, fontes permitidas, passos, limites e entrega revisável — não uma autonomia sem controle.'],
    ['LABORATORIO', 'Delegar um trabalho entre arquivos (Claude)', 30, 'Demonstração condicionada à disponibilidade; a prática principal é escrever a missão e o checklist de revisão.'],
    ['PROMPT', 'Desenho de agente com limites', 30, 'Crie um agente de baixo risco.', 'Desenhe um agente para [PROCESSO]. Informe missão, entrada permitida, fontes autorizadas, etapas, saída, responsável humano, exceções, dados proibidos, métrica, critério de parada e plano de reversão.'],
    ['FERRAMENTA', 'Make: gatilho, filtro, ação, registro e alerta', 25, 'Construa automação visual de baixo risco; comece com rascunho e revisão humana.'],
    ['LABORATORIO', 'Google Forms + Sheets + Docs + Gmail / Apps Script', 40, 'Projete uma automação acessível para pedido, lead, agenda, feedback ou pós-venda.', null, ['gatilho', 'filtro', 'registro', 'alerta', 'exceção', 'responsável']],
    ['CACA_ERRO', 'Automação não decide exceção', 25, 'Identifique os pontos que devem parar e chamar uma pessoa.'],
    ['CHECKPOINT', 'Piloto seguro e plano de 30 dias', 70, 'Publique somente uma automação reversível, com medida e plano de desligamento.', null, ['mapa antes/depois', 'teste com dados fictícios', 'métrica', 'alerta de erro', 'responsável', 'plano de reversão']]
  ]
};
for (const module of data.modules) {
  // Mantém a geração idempotente quando o .bat é executado novamente.
  module.lessons = module.lessons.filter(lesson => !/_x\d+$/.test(lesson.id));
  const additions = ext[module.id] || [];
  for (const [type, title, xp, instruction, template, evidence] of additions) {
    const index = module.lessons.length + 1;
    const lesson = {id: module.id + '_x' + String(index).padStart(2, '0'), type, title, xp};
    if (instruction) lesson.instruction = instruction;
    if (template) lesson.template = template;
    if (evidence) lesson.evidence = evidence;
    module.lessons.push(lesson);
  }
  module.application_extension_hours = 8;
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({schema:data.schema_version, modules:data.modules.length, lessons:data.modules.reduce((n,m)=>n+m.lessons.length,0)}));
