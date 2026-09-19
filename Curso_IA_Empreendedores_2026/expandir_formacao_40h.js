const fs = require('fs');
const path = require('path');

const raiz = __dirname;
const apostila = path.join(raiz, 'Apostila_IA_para_Empreendedores_2026.html');
const slides = path.join(raiz, 'Slides_IA_para_Empreendedores_2026.html');
const kit = path.join(raiz, 'Kit_IA_para_Empreendedores.html');

// Os arquivos-base são UTF-8. Não aplique conversão heurística aqui: ela
// confunde acentos válidos do português com texto corrompido.
function corrigirCodificacao(texto) { return texto; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function linhas(qtd) { return '<div class="linhas">' + Array.from({ length: qtd || 5 }, () => '<div class="lin"></div>').join('') + '</div>'; }

const modulos = [
  {
    n: 1, nome: 'Fundamentos, prompts e rotina segura',
    produto: 'Mapa de tarefas + prompt C.O.F.R.E. + protocolo de revisão',
    resultado: 'Selecionar uma tarefa repetitiva, produzir uma primeira versão útil e estabelecer o que continua sob decisão humana.',
    horas: [
      ['1h', 'Diagnóstico da rotina', 'Liste 15 tarefas da semana, agrupe por tipo e marque frequência, tempo e risco.'],
      ['1h30', 'Escolha com critério', 'Pontue três tarefas: repetição, impacto, risco e possibilidade de revisão humana.'],
      ['2h', 'Laboratório de prompts', 'Crie três versões C.O.F.R.E. para a tarefa escolhida e compare as saídas.'],
      ['1h30', 'Teste controlado', 'Execute a tarefa em um dia real sem inserir dados pessoais, financeiros ou sensíveis.'],
      ['1h', 'Revisão de qualidade', 'Cheque fatos, tom, campos pendentes e decisões que exigem pessoa responsável.'],
      ['1h', 'Registro de aprendizagem', 'Meça tempo antes/depois, correções e limite de uso; salve o prompt aprovado.']
    ],
    criterio: ['Tarefa delimitada e de baixo risco', 'Prompt contém contexto, objetivo, formato, restrições e exemplo', 'Há checklist de fatos, dados e promessa', 'O participante registra uma melhoria e uma limitação'],
    prompts: [
      ['Mapa de tarefas', 'Atue como analista de processos de uma pequena empresa. Organize estas tarefas: [LISTA]. Para cada uma, informe frequência, tempo estimado, risco de erro, dado que não pode ser compartilhado e se a IA pode rascunhar, organizar ou não deve participar. Não invente informações.'],
      ['Prompt C.O.F.R.E.', 'Contexto: [NEGÓCIO E PÚBLICO]. Objetivo: [RESULTADO]. Formato: [TABELA, MENSAGEM OU CHECKLIST]. Restrições: use apenas [DADOS CONFIRMADOS], deixe [CONFIRMAR] onde faltar informação e não faça promessas. Exemplo de tom: [EXEMPLO]. Tarefa: [TAREFA]. Antes de responder, liste o que precisa de revisão humana.'],
      ['Revisor crítico', 'Revise o rascunho abaixo para uso em [CANAL]. Aponte em uma tabela: afirmação, evidência disponível, risco se estiver errada e ação necessária. Preserve [CAMPOS PENDENTES]. Rascunho: [COLE AQUI].']
    ],
    erros: ['Copiar uma resposta sem ler até o fim.', 'Enviar dados de cliente para uma conta ou ferramenta não aprovada.', 'Trocar [CONFIRMAR] por uma informação inventada.', 'Delegar preço, prazo, exceção ou decisão sensível para a IA.'],
    evidencia: 'Captura do prompt aprovado, duas versões comparadas, checklist preenchido e registro de tempo.',
    caso: 'Uma loja recebe diariamente perguntas iguais sobre produto, troca e prazo. O dono quer responder mais rápido, mas não quer errar estoque nem regra de devolução.'
  },
  {
    n: 2, nome: 'Operação, marketing e calendário de conteúdo',
    produto: 'Procedimento simples + calendário de 7 dias + banco de conteúdos aprovados',
    resultado: 'Organizar uma rotina real, transformar conhecimento da empresa em conteúdo e publicar somente o que está confirmado.',
    horas: [
      ['1h', 'Raio-X operacional', 'Reúna notas, áudios e planilhas sem dados sensíveis; identifique uma rotina que perde informação.'],
      ['1h30', 'Procedimento em uma página', 'Converta a rotina em passos, responsável, entrada, saída e exceção.'],
      ['2h', 'Banco de pauta', 'Liste dúvidas, bastidores, provas autorizadas, objeções e convites possíveis.'],
      ['1h30', 'Calendário de 7 dias', 'Defina objetivo, canal, formato, CTA e informação a confirmar para cada publicação.'],
      ['1h', 'Produção e adaptação', 'Crie uma peça em dois formatos sem alterar a verdade da oferta.'],
      ['1h', 'Revisão e publicação', 'Use a régua de marca, autorização e capacidade operacional antes de agendar.']
    ],
    criterio: ['Rotina tem responsável, entrada, saída e exceção', 'Cada conteúdo tem objetivo e CTA coerente', 'Oferta, agenda, preço e depoimentos foram confirmados', 'Há um banco reutilizável e não apenas posts isolados'],
    prompts: [
      ['Procedimento operacional', 'Transforme estas notas em um procedimento de uma página para [ROTINA]. Entregue: objetivo, gatilho de início, passos numerados, responsável, evidência de conclusão e exceções que devem ir para [PESSOA/FUNÇÃO]. Não crie regras que não aparecem nas notas: [NOTAS].'],
      ['Calendário de conteúdo', 'Crie um calendário de 7 dias para [NEGÓCIO]. Objetivo da semana: [OBJETIVO]. Público: [PÚBLICO]. Canais: [CANAIS]. Para cada dia, entregue formato, ideia, prova necessária, CTA e campo [CONFIRMAR]. Não invente desconto, agenda, resultado ou depoimento.'],
      ['Adaptação por canal', 'Adapte este conteúdo aprovado para [WHATSAPP/INSTAGRAM/E-MAIL]. Mantenha os fatos exatamente iguais, use tom [TOM], limite a [NÚMERO] caracteres e destaque qualquer dado que precise de confirmação antes de publicar: [CONTEÚDO].']
    ],
    erros: ['Publicar antes de confirmar agenda, preço ou estoque.', 'Usar foto, depoimento ou antes/depois sem autorização.', 'Produzir volume sem objetivo ou próxima ação.', 'Confundir linguagem de marca com frases genéricas da IA.'],
    evidencia: 'Procedimento de uma página, calendário preenchido, duas adaptações por canal e checklist de aprovação.',
    caso: 'Um salão tem horários vazios no meio da semana. A equipe só posta quando sobra tempo e não pode prometer resultado de procedimento nem fazer descontos em todos os serviços.'
  },
  {
    n: 3, nome: 'Vendas, atendimento e pesquisa com evidências',
    produto: 'Roteiro de diagnóstico + respostas-modelo + mapa de pesquisa com fontes',
    resultado: 'Criar conversas consistentes, distinguir resposta padrão de decisão humana e pesquisar sem tratar a IA como fonte final.',
    horas: [
      ['1h', 'Mapa da jornada', 'Desenhe o caminho de um contato: entrada, diagnóstico, proposta, decisão, pós-venda e perda.'],
      ['1h30', 'Perguntas de diagnóstico', 'Construa perguntas abertas que revelam necessidade, urgência, critério e próximo passo.'],
      ['2h', 'Biblioteca de respostas', 'Rascunhe respostas para dúvidas frequentes e indique quando escalar para uma pessoa.'],
      ['1h30', 'Proposta-base', 'Organize escopo, entregas, cronograma, investimento confirmado, exclusões e responsabilidades.'],
      ['1h', 'Pesquisa verificável', 'Use a IA para hipóteses; confirme em fontes primárias e registre data e link.'],
      ['1h', 'Simulação e melhoria', 'Teste o fluxo com um colega, registre objeções e refine uma resposta.']
    ],
    criterio: ['Diagnóstico precede proposta ou preço', 'Macros de atendimento têm tom, limite e escalonamento', 'Toda informação externa relevante possui fonte e data', 'A proposta deixa lacunas visíveis como [CONFIRMAR]'],
    prompts: [
      ['Perguntas de diagnóstico', 'Você é consultor de vendas de [NEGÓCIO]. Crie 8 perguntas abertas para entender necessidade, prioridade, prazo, critério de decisão e próximo passo de [PÚBLICO]. Não presuma orçamento nem dados pessoais. Depois classifique cada pergunta por objetivo.'],
      ['Respostas-modelo', 'Escreva três respostas para a dúvida [DÚVIDA] no canal [CANAL], com tom [TOM]. Use apenas estas regras confirmadas: [REGRAS]. Inclua uma versão curta, uma acolhedora e uma que encaminha para uma pessoa. Marque dados variáveis como [CONFIRMAR].'],
      ['Mapa de pesquisa', 'Para investigar [PERGUNTA DE NEGÓCIO], proponha hipóteses, palavras-chave, fontes primárias desejáveis, data de corte e uma tabela para registrar: afirmação, fonte, data, grau de confiança e decisão que ela pode apoiar. Não apresente suposições como fatos.']
    ],
    erros: ['Prometer disponibilidade sem consultar o sistema.', 'Responder reclamação grave com texto automático.', 'Usar dado de mercado sem fonte, data ou contexto.', 'Enviar proposta com escopo, valor ou prazo não validados.'],
    evidencia: 'Jornada desenhada, cinco perguntas de diagnóstico, três macros e tabela de fontes preenchida.',
    caso: 'Uma imobiliária recebe leads em canais diferentes. A equipe responde rápido, mas não registra estágio, preferência ou motivo de perda; alguns imóveis mudam de disponibilidade durante o dia.'
  },
  {
    n: 4, nome: 'Produtividade, automação e plano de 30 dias',
    produto: 'Piloto de baixo risco + painel de acompanhamento + plano de implantação de 30 dias',
    resultado: 'Implantar uma melhoria pequena, mensurável e reversível, com responsável, métrica, regra de segurança e plano de ajuste.',
    horas: [
      ['1h', 'Inventário de decisões', 'Separe tarefas de rascunho, triagem, decisão e exceção; defina qual não será automatizada.'],
      ['1h30', 'Desenho do piloto', 'Escolha um fluxo de baixo risco com entrada, processamento, revisão humana, saída e reversão.'],
      ['2h', 'Configuração assistida', 'Monte modelo de documento, checklist e padrão de nome; teste com dados fictícios.'],
      ['1h30', 'Indicadores simples', 'Registre tempo, retrabalho, qualidade, volume e incidentes antes/depois.'],
      ['1h', 'Governança mínima', 'Defina conta aprovada, permissões, dados proibidos, responsável e canal de incidente.'],
      ['1h', 'Plano de 30 dias', 'Planeje semanas 1, 2, 3 e 4 com evidência esperada, reunião de revisão e decisão de continuar, ajustar ou parar.']
    ],
    criterio: ['Piloto é reversível e não envolve decisão crítica automática', 'Há responsável e ponto de revisão humana', 'Indicador tem linha de base e período de observação', 'O plano prevê parar ou ajustar diante de erro'],
    prompts: [
      ['Desenho do piloto', 'Ajude a desenhar um piloto de IA para [TAREFA]. Produza uma tabela com entrada permitida, processamento, revisão humana, saída, responsável, risco, métrica, critério de parada e plano de reversão. Não proponha automação de decisão financeira, jurídica, de contratação ou de exceção sem validação humana.'],
      ['Painel semanal', 'Organize este registro semanal de [PILOTO] em um painel simples com: volume, tempo antes, tempo depois, correções, incidentes, dúvidas recorrentes e decisão da semana. Explique quais números são insuficientes para concluir sucesso: [REGISTROS].'],
      ['Plano de 30 dias', 'Crie um plano de implantação de 30 dias para [PILOTO]. Divida por semanas e informe objetivo, atividade, responsável, evidência, indicador e reunião de revisão. Preserve esta regra: [REGRA DE SEGURANÇA]. Inclua uma decisão explícita: continuar, ajustar ou interromper.']
    ],
    erros: ['Automatizar uma exceção antes de estabilizar o processo.', 'Medir apenas volume e ignorar qualidade ou retrabalho.', 'Dar acesso a dados além do necessário.', 'Tratar um teste curto como prova definitiva de retorno.'],
    evidencia: 'Desenho do piloto, registro de linha de base, checklist de segurança e plano de 30 dias.',
    caso: 'Um restaurante anota pedidos e reclamações em canais diferentes. O gestor quer consolidar o dia, mas não pode deixar uma reclamação séria ou um pedido especial sem atenção humana.'
  }
];

function paginaApostila(m) {
  const roteiro = m.horas.map((h, i) => '<tr><td><b>Bloco ' + (i + 1) + '</b><br>' + h[0] + '</td><td><b>' + h[1] + '</b><br>' + h[2] + '</td><td>Registro no caderno</td></tr>').join('');
  const prompts = m.prompts.map((p, i) => '<div class="etiqueta">PROMPT ' + (i + 1) + '</div><div class="prompt">' + esc(p[1]) + '</div>').join('');
  const erros = m.erros.map((e, i) => (i + 1) + '. ' + e).join('<br>');
  const criterios = m.criterio.map(c => '<div class="ficha-check">☐ ' + c + '</div>').join('');
  return '' +
  '<div class="quebra"><div class="faixa-encontro">TRILHA COMPLEMENTAR ' + m.n + ' · 8 HORAS</div><h1 class="cap">' + m.nome + '</h1><p class="abertura">Esta trilha transforma o encontro ao vivo em aplicação guiada. Carga horária do módulo: 2h ao vivo + 8h de prática orientada.</p><div class="traduzindo"><div class="t">Produto de aplicação</div><p>' + m.produto + '</p></div><div class="atencao"><div class="t">Resultado esperado</div><p>' + m.resultado + '</p></div></div>' +
  '<div class="quebra"><h2>Roteiro de aplicação: 8 horas com evidências</h2><table><thead><tr><th>Tempo</th><th>Atividade prática</th><th>Evidência</th></tr></thead><tbody>' + roteiro + '</tbody></table><div class="dica"><div class="t">Ritmo recomendado</div><p>Faça dois blocos por vez. Ao final de cada bloco, salve a evidência em uma pasta do projeto e anote o que precisou de revisão humana.</p></div></div>' +
  '<div class="quebra"><h2>Laboratório guiado: do problema ao primeiro teste</h2><div class="caso"><div class="cabeca"><span class="selo-caso">CENÁRIO</span><span class="titulo-caso">Caso de aplicação</span><span class="tempo">20 min</span></div><div class="cena">' + m.caso + '</div><div class="pergunta">Qual é a menor melhoria possível para testar em uma semana? Defina entrada, responsável, saída e uma exceção que precisa de pessoa.</div>' + linhas(6) + '</div><div class="desafio"><div class="cabeca"><span class="cronometro">⏱ 15:00</span><span class="titulo-des">Decisão de escopo</span></div><ol><li>Escreva o problema em uma frase.</li><li>Delimite o resultado observável.</li><li>Liste o que não entra no teste.</li><li>Defina quem revisa antes de usar.</li></ol></div></div>' +
  '<div class="quebra"><h2>Prompts de aplicação do módulo</h2><p>Troque apenas os campos entre colchetes. Não cole dados pessoais, financeiros, médicos, estratégicos ou de clientes quando não houver autorização e ferramenta aprovada.</p>' + prompts + '</div>' +
  '<div class="quebra"><h2>Caça ao erro: qualidade antes de velocidade</h2><div class="caca"><div class="cabeca"><span class="selo-caca">CAÇA AO ERRO</span><span class="titulo-caca">Encontre o risco e proponha a correção</span><span class="tempo">10 min</span></div><div class="resposta-ia">' + erros + '</div><p class="instrucao">Para cada item, escreva: o que pode dar errado, como reduzir o risco e quem deve aprovar.</p>' + linhas(6) + '<div class="gabarito-formador"><div class="t">Critério de correção</div><p>Uma resposta madura não é "usar ou não usar IA". Ela identifica dado, impacto, responsável e uma forma de testar sem comprometer cliente, caixa ou reputação.</p></div></div></div>' +
  '<div class="quebra"><h2>Ficha de evidência e revisão</h2><div class="destacavel"><div class="dest-marca">ENTREGÁVEL · MÓDULO ' + m.n + '</div><div class="dest-corpo"><div class="dest-titulo">Evidência mínima para concluir a trilha</div><div class="dest-sub">Guarde os arquivos, a versão aprovada e a anotação de aprendizagem.</div>' + criterios + '<div class="ficha-check">☐ Evidência enviada: ' + m.evidencia + '</div></div></div><h3>Meu registro</h3><p><b>O que melhorou?</b></p>' + linhas(3) + '<p><b>O que ainda não pode ser delegado?</b></p>' + linhas(3) + '</div>' +
  '<div class="quebra"><h2>Rubrica de autoavaliação</h2><table><thead><tr><th>Critério</th><th>Inicial</th><th>Em desenvolvimento</th><th>Aplicável</th></tr></thead><tbody><tr><td>Contexto</td><td>Pedido genérico</td><td>Inclui parte do cenário</td><td>Delimita público, objetivo e dados</td></tr><tr><td>Revisão</td><td>Copia sem checar</td><td>Corrige linguagem</td><td>Confere fatos, dados e consequências</td></tr><tr><td>Evidência</td><td>Não registra</td><td>Guarda uma saída</td><td>Compara versões, tempo e resultado</td></tr><tr><td>Segurança</td><td>Não distingue riscos</td><td>Evita alguns dados</td><td>Define limite, responsável e escalonamento</td></tr></tbody></table><div class="saida"><div class="t">Fechamento da trilha</div><div class="item">☐ Produto: <strong>' + m.produto + '</strong></div><div class="item">☐ Próxima revisão agendada</div><div class="item">☐ Decisão registrada: continuar, ajustar ou parar</div></div></div>' +
  '<div class="quebra"><h2>Ficha 1: dados de entrada e limites</h2><p>Antes de abrir qualquer ferramenta, preencha o que é necessário para esta aplicação. O objetivo é reduzir suposições e impedir que dados inadequados entrem no teste.</p><table><thead><tr><th>Campo</th><th>Minha resposta</th><th>Posso usar?</th></tr></thead><tbody><tr><td>Objetivo de negócio</td><td></td><td>☐ sim ☐ revisar</td></tr><tr><td>Dados confirmados</td><td></td><td>☐ sim ☐ revisar</td></tr><tr><td>Dados proibidos / sensíveis</td><td></td><td>☐ não inserir</td></tr><tr><td>Responsável pela aprovação</td><td></td><td>☐ definido</td></tr><tr><td>Canal ou ferramenta aprovada</td><td></td><td>☐ definido</td></tr></tbody></table><div class="atencao"><div class="t">Regra de proteção</div><p>Se não for necessário para a tarefa, não entre no prompt. Se a informação puder identificar uma pessoa, confirmar autorização e ambiente aprovado é parte da atividade.</p></div></div>' +
  '<div class="quebra"><h2>Ficha 2: comparação de versões</h2><p>Não avalie a IA pelo entusiasmo com a primeira saída. Compare uma versão inicial e uma versão revisada pelo efeito real no negócio.</p><table><thead><tr><th>Ponto de comparação</th><th>Versão inicial</th><th>Versão revisada</th></tr></thead><tbody><tr><td>Clareza para quem usa</td><td></td><td></td></tr><tr><td>Fatos e dados confirmados</td><td></td><td></td></tr><tr><td>Tom e adequação ao canal</td><td></td><td></td></tr><tr><td>Tempo para concluir</td><td></td><td></td></tr><tr><td>Risco ou pendência encontrada</td><td></td><td></td></tr></tbody></table><div class="dica"><div class="t">Decisão baseada em evidência</div><p>Se a versão revisada não reduz retrabalho, não aumenta clareza ou cria risco novo, o melhor resultado do teste pode ser não adotar aquela aplicação.</p></div></div>' +
  '<div class="quebra"><h2>Ficha 3: simulação de caso</h2><div class="duelo"><div class="cabeca"><span class="selo-duelo">DECIDA</span><span class="titulo-duelo">Automatizar, assistir ou manter humano?</span><span class="tempo">12 min</span></div><div class="rodada"><div class="rot ruim">Caminho precipitado</div><div class="resultado">A IA recebe qualquer entrada, produz uma saída e ela é enviada sem checagem para ganhar velocidade.</div></div><div class="rodada"><div class="rot bom">Caminho responsável</div><div class="resultado">Entrada delimitada, rascunho revisado, exceções encaminhadas, evidência registrada e possibilidade de parar o piloto.</div></div><div class="sua-vez"><div class="t">Aplique ao módulo ' + m.n + '</div>Em qual etapa de <strong>' + m.nome + '</strong> a IA pode apoiar? Qual etapa precisa continuar humana? Justifique com impacto e risco.' + linhas(5) + '</div></div></div>' +
  '<div class="quebra"><h2>Ficha 4: acompanhamento semanal</h2><table><thead><tr><th>Dia</th><th>Teste realizado</th><th>Correção necessária</th><th>Próximo passo</th></tr></thead><tbody><tr><td>Segunda</td><td></td><td></td><td></td></tr><tr><td>Terça</td><td></td><td></td><td></td></tr><tr><td>Quarta</td><td></td><td></td><td></td></tr><tr><td>Quinta</td><td></td><td></td><td></td></tr><tr><td>Sexta</td><td></td><td></td><td></td></tr></tbody></table><div class="celular"><div class="cabeca"><span class="selo-cel">NO CELULAR</span><span class="titulo-cel">Registro mínimo de 2 minutos</span><span class="tempo">diário</span></div><ol><li>Fotografe ou salve a evidência sem dados sensíveis.</li><li>Anote o tempo gasto e uma correção.</li><li>Marque se a saída foi usada, ajustada ou descartada.</li><li>Leve uma dúvida concreta para o próximo encontro.</li></ol></div></div>' +
  '<div class="quebra"><h2>Ficha 5: conversa de revisão com a equipe</h2><p>Use esta pauta após concluir a prática. A reunião não serve para celebrar ferramenta; serve para decidir se o processo ficou mais confiável.</p><div class="oficina"><div class="t">Pauta de 20 minutos</div><ol><li>Qual resultado observável obtivemos?</li><li>Que correção se repetiu?</li><li>Que dado, decisão ou exceção continua humana?</li><li>O que muda no processo antes do próximo teste?</li><li>Continuamos, ajustamos ou interrompemos?</li></ol></div><p><b>Decisão da equipe e responsável:</b></p>' + linhas(5) + '</div>' +
  '<div class="quebra"><h2>Ficha 6: auditoria do prompt aprovado</h2><p>Use esta folha antes de transformar um prompt em modelo da equipe. O objetivo é que outra pessoa consiga revisar e repetir o processo sem adivinhar contexto.</p><table><thead><tr><th>Elemento</th><th>Está explícito?</th><th>Melhoria necessária</th></tr></thead><tbody><tr><td>Contexto e público</td><td>☐ sim ☐ não</td><td></td></tr><tr><td>Objetivo observável</td><td>☐ sim ☐ não</td><td></td></tr><tr><td>Formato de saída</td><td>☐ sim ☐ não</td><td></td></tr><tr><td>Restrições e campos pendentes</td><td>☐ sim ☐ não</td><td></td></tr><tr><td>Revisão humana e exceções</td><td>☐ sim ☐ não</td><td></td></tr><tr><td>Versão, data e responsável</td><td>☐ sim ☐ não</td><td></td></tr></tbody></table><div class="traduzindo"><div class="t">Padrão de equipe</div><p>Nomeie o arquivo com data e finalidade: por exemplo, [MÓDULO ' + m.n + ']_[TAREFA]_[AAAA-MM-DD]. Assim a equipe sabe qual versão foi validada.</p></div></div>' +
  '<div class="quebra"><h2>Ficha 7: transferência para a próxima semana</h2><p>A aplicação só vira aprendizagem quando é transferida para uma situação real. Defina agora como este módulo conversa com o próximo.</p><div class="desafio"><div class="cabeca"><span class="cronometro">⏱ 10:00</span><span class="titulo-des">Plano de transferência</span></div><ol><li>Qual entrega deste módulo será usada na próxima semana?</li><li>Quem precisa saber que ela existe?</li><li>Que indicador mostrará se foi útil?</li><li>Qual exceção será observada de perto?</li><li>Qual pergunta você levará para o próximo encontro?</li></ol></div><p><b>Meu compromisso de aplicação:</b></p>' + linhas(6) + '<div class="saida"><div class="t">Passagem para o próximo módulo</div><div class="item">☐ Entrega revisada e salva</div><div class="item">☐ Responsável informado</div><div class="item">☐ Dúvida real registrada para a próxima aula</div></div></div>';
}

function slide(m, titulo, corpo) {
  return '<div class="slide" data-title="Trilha ' + m.n + ' · ' + esc(titulo) + '"><div class="topo"></div><div class="badge">TRILHA ' + m.n + ' · 8H</div><h1 class="st">' + esc(titulo) + '</h1><div class="corpo alto">' + corpo + '</div></div>';
}
function slidesModulo(m) {
  const roteiro = m.horas.map((h, i) => '<li><b>' + h[0] + ' · ' + esc(h[1]) + ':</b> ' + esc(h[2]) + '</li>').join('');
  const criterios = m.criterio.map(c => '<div class="it marcavel">☐ ' + esc(c) + '</div>').join('');
  const p = m.prompts;
  return '' +
  '<div class="slide" data-title="Trilha ' + m.n + '"><div class="divisor"><div class="num">TRILHA ' + m.n + ' · 8H</div><h2>' + esc(m.nome) + '</h2><p>Do encontro ao vivo para uma aplicação com evidência. Produto: ' + esc(m.produto) + '.</p></div></div>' +
  slide(m, 'O que as 8 horas constroem', '<div class="traduzindo"><div class="t">Resultado esperado</div><p>' + esc(m.resultado) + '</p></div><div class="atencao"><div class="t">Regra de qualidade</div><p>Uma boa entrega não é a primeira resposta da IA; é a resposta revisada, contextualizada e aplicada com responsabilidade.</p></div>') +
  slide(m, 'Roteiro de prática orientada', '<div class="oficina"><div class="t">Seis blocos, uma evidência por bloco</div><ol>' + roteiro + '</ol></div>') +
  slide(m, 'Escolha um problema pequeno e real', '<div class="traduzindo"><div class="t">Pergunta de partida</div><p>Qual tarefa recorrente consome tempo, tem insumo organizado e pode ser revisada por uma pessoa antes de gerar consequência?</p></div><div class="atencao"><div class="t">Evite no primeiro piloto</div><p>Decisão de crédito, preço final, contratação, questão jurídica, saúde, exceção de cliente ou uso de dados sem autorização.</p></div>') +
  slide(m, 'Laboratório: contexto e restrições', '<div class="etiqueta">PROMPT PARA ADAPTAR</div><div class="prompt">' + esc(p[0][1]) + '</div><button class="abrir-prompt" data-prompt="' + esc(p[0][1]).replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">Copiar e abrir IA</button>') +
  slide(m, 'Laboratório: primeira versão útil', '<div class="etiqueta">PROMPT PARA ADAPTAR</div><div class="prompt">' + esc(p[1][1]) + '</div><button class="abrir-prompt" data-prompt="' + esc(p[1][1]).replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">Copiar e abrir IA</button>') +
  slide(m, 'Laboratório: revisão crítica', '<div class="etiqueta">PROMPT PARA ADAPTAR</div><div class="prompt">' + esc(p[2][1]) + '</div><button class="abrir-prompt" data-prompt="' + esc(p[2][1]).replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">Copiar e abrir IA</button>') +
  '<div class="slide" data-title="Caça ao erro · trilha ' + m.n + '"><div class="sl-caca"><div class="badge amarelo">CAÇA AO ERRO · 10 MIN</div><h1 class="st">Onde está o risco?</h1><div class="resp">' + m.erros.map((e, i) => (i + 1) + '. ' + esc(e)).join('<br>') + '</div><p class="desafio-txt">Em dupla, classifique: corrigir agora, confirmar em fonte ou escalar para uma pessoa.</p></div></div>' +
  slide(m, 'Evidências que provam aprendizagem', '<div class="oficina"><div class="t">Pasta do projeto</div><p>' + esc(m.evidencia) + '</p><ol><li>Versão inicial.</li><li>Versão revisada.</li><li>Checklist de segurança.</li><li>Registro de tempo, correção e aprendizado.</li></ol></div>') +
  slide(m, 'Rubrica: você está pronto para aplicar?', '<div class="sl-saida"><h2>Marque antes de avançar</h2>' + criterios + '<div class="it marcavel">☐ Sei o que a IA não deve decidir.</div></div>') +
  '<div class="slide" data-title="Desafio de aplicação · trilha ' + m.n + '"><div class="sl-crono"><div class="num" data-seconds="900">15:00</div><h2>Defina seu próximo experimento</h2><p>Escreva o problema, a entrega, o responsável pela revisão, a métrica e o critério de parada.</p><div class="crono-btns"><button class="start">▶ Iniciar</button><button class="reset sec">↺ Zerar</button></div><p class="crono-dica">Espaço inicia ou pausa · Z zera</p></div></div>' +
  '<div class="slide" data-title="Saída da trilha ' + m.n + '"><div class="sl-saida"><h2>Antes de encerrar a trilha</h2><div class="it marcavel">☐ ' + esc(m.produto) + '</div><div class="it marcavel">☐ Evidência salva</div><div class="it marcavel">☐ Revisão agendada</div><div class="it marcavel">☐ Decisão: continuar, ajustar ou interromper</div></div></div>';
}

let ap = corrigirCodificacao(fs.readFileSync(apostila, 'utf8'));
let sl = corrigirCodificacao(fs.readFileSync(slides, 'utf8'));
let ki = corrigirCodificacao(fs.readFileSync(kit, 'utf8'));

const blocoAp = '<div id="formacao-40h"><div class="quebra"><div class="faixa-encontro">FORMAÇÃO COMPLEMENTAR · 32 HORAS</div><h1 class="cap">Caderno de aplicação: as 40 horas materializadas</h1><p class="abertura">A formação combina 4 encontros de 2 horas (8h ao vivo) e quatro trilhas de aplicação de 8 horas (32h). Cada trilha produz uma entrega que pode ser usada no negócio.</p><table><thead><tr><th>Módulo</th><th>Ao vivo</th><th>Prática guiada</th><th>Entrega</th></tr></thead><tbody>' + modulos.map(m => '<tr><td>Encontro ' + m.n + '</td><td>2h</td><td>8h</td><td>' + m.produto + '</td></tr>').join('') + '</tbody></table><div class="saida"><div class="t">Carga horária total</div><div class="item">☐ 8 horas de encontros ao vivo</div><div class="item">☐ 32 horas de aplicação orientada com evidências</div><div class="item">☐ 40 horas de formação completa</div></div></div>' + modulos.map(paginaApostila).join('') + '</div>';
const blocoSl = '<div id="formacao-40h-slides">' + modulos.map(slidesModulo).join('') + '</div>';

if (!ap.includes('id="formacao-40h"')) ap = ap.replace('</body>', blocoAp + '</body>');
if (!sl.includes('id="formacao-40h-slides"')) sl = sl.replace('<div class="controls">', blocoSl + '<div class="controls">');

// O kit recebe uma orientação objetiva para que a carga complementar também
// esteja visível no material de implementação.
if (!ki.includes('FORMAÇÃO COMPLEMENTAR · 32 HORAS')) {
  const kitBloco = '<div class="quebra"><div class="faixa-encontro">FORMAÇÃO COMPLEMENTAR · 32 HORAS</div><h1 class="cap">Plano de acompanhamento das trilhas</h1><p class="abertura">Use uma revisão semanal de 20 minutos para conferir evidências, qualidade e próximos ajustes.</p><table><thead><tr><th>Semana</th><th>Foco</th><th>Entregável</th><th>Revisão</th></tr></thead><tbody>' + modulos.map(m => '<tr><td>Semana ' + m.n + '</td><td>' + m.nome + '</td><td>' + m.produto + '</td><td>Responsável + evidência</td></tr>').join('') + '</tbody></table><div class="destacavel"><div class="dest-marca">REGRA DO ACOMPANHAMENTO</div><div class="dest-corpo"><div class="dest-titulo">Não avance sem evidência</div><div class="dest-sub">Cada semana termina com uma entrega revisada, um limite registrado e uma decisão de continuidade.</div></div></div></div>';
  ki = ki.replace('</body>', kitBloco + '</body>');
}

fs.writeFileSync(apostila, ap, 'utf8');
fs.writeFileSync(slides, sl, 'utf8');
fs.writeFileSync(kit, ki, 'utf8');
console.log(JSON.stringify({ trilhas: modulos.length, horasAoVivo: 8, horasAplicacao: 32, horasTotal: 40, paginasPlanejadas: 1 + modulos.length * 13, slidesAdicionados: modulos.length * 12 }));
