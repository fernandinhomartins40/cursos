const fs=require('fs'),path=require('path'),D=__dirname,f=path.join(D,'PROMPTS_DE_IMAGENS_COMPLETOS.md');
let s=fs.readFileSync(f,'utf8');
s=s.replace('**Camada tecnológica permitida:** sobrepor apenas elementos sutis de interface em néon branco quente, âmbar e índigo: ícones simples, círculos translúcidos, cartões sem texto e linhas finas conectando ações. Esses elementos ficam ao redor da pessoa, nunca cobrindo rosto, mãos ou objetos importantes. Eles devem parecer uma sobreposição gráfica elegante em uma fotografia real, não um mundo 3D.','**Camada tecnológica e didática obrigatória:** sobrepor elementos sutis de interface em néon branco quente, âmbar e índigo: ícones simples, círculos translúcidos, cartões, fluxos e linhas finas conectando ações. Os cartões podem trazer rótulos curtos, grandes e perfeitamente legíveis em português. Esses elementos ficam ao redor da pessoa, nunca cobrindo rosto, mãos ou objetos importantes. Eles devem parecer uma sobreposição gráfica elegante em uma fotografia real, não um mundo 3D.');
s=s.replace('**Não usar:** pessoa ilustrada, pessoa em cartoon, anime, pele plástica, cenário inteiro em 3D, robô personagem, interface dominante, texto legível, números legíveis, logotipos, marcas ou marcas-d’água.','**Não usar:** pessoa ilustrada, pessoa em cartoon, anime, pele plástica, cenário inteiro em 3D, robô personagem, interface dominante, parágrafos longos, texto pequeno, números críticos, logotipos, marcas ou marcas-d’água.');
const labels={
'capa_empreendedores_ia.png':'Inclua, ao redor do notebook, quatro ícones em néon suave com rótulos grandes e legíveis: “Marketing”, “Vendas”, “Atendimento” e “Agenda”.',
'01_equipe_digital.png':'Em cada ícone em néon, inclua rótulos grandes e legíveis: “Marketing”, “Agenda”, “Atendimento”, “Vendas” e “Análise”.',
'02_formula_cofre.png':'Os cinco cartões devem ter uma palavra grande e legível em cada um: “Contexto”, “Objetivo”, “Formato”, “Restrições” e “Exemplo”.',
'03_dois_canais.png':'Rotule o cartão junto ao celular como “Conversa” e o cartão junto ao notebook como “Documento”; uma linha de néon conecta os dois.',
'04_rotina_administrativa.png':'Os três cartões de néon devem ter rótulos grandes: “Pendências”, “Organizar” e “Confirmar”.',
'05_marketing_calendario.png':'Os ícones de néon devem trazer rótulos grandes e claros: “Calendário”, “Conteúdo” e “Mensagem”.',
'06_vendas_proposta.png':'A sobreposição deve exibir três cartões curtos e legíveis: “Diagnóstico”, “Proposta” e “Próximo passo”.',
'07_atendimento_cliente.png':'Os ícones de néon ao redor da tela devem ter os rótulos: “Mensagem”, “Prazo” e “Atendimento”.',
'08_pesquisa_mercado.png':'A sobreposição de néon deve trazer três rótulos curtos e legíveis: “Pesquisar”, “Comparar” e “Confirmar”.',
'09_automacao_fluxo.png':'Os três cartões translúcidos devem ser rotulados, nesta ordem: “Entrada”, “Revisão humana” e “Saída”.',
'10_dados_seguros.png':'O pequeno cartão de néon junto à pasta deve trazer o rótulo grande e legível “Dados protegidos”.',
'11_plano_30_dias.png':'Os quatro cartões do mural devem trazer rótulos grandes e legíveis: “Semana 1”, “Semana 2”, “Semana 3” e “Semana 4”.',
'caso_loja_roupas.png':'Os ícones de néon no fundo devem ter rótulos curtos: “Mensagem”, “Estoque” e “Agenda”.',
'caso_salao.png':'Os ícones de néon devem trazer rótulos curtos e legíveis: “Agenda”, “Clientes” e “Avaliações”.',
'caso_imobiliaria.png':'Os cartões de néon devem trazer rótulos curtos: “Lead”, “Visita” e “Proposta”.',
'caso_restaurante.png':'Os ícones de néon acima do balcão devem ter rótulos curtos: “Pedido”, “Tempo” e “Confirmação”.'
};
for(const [file,extra] of Object.entries(labels)){
 const marker='### '+file+'\n\n';
 const start=s.indexOf(marker);if(start<0)throw new Error('Prompt não encontrado: '+file);
 const end=s.indexOf('\n### ',start+marker.length);
 const pos=end<0?s.length:end;
 s=s.slice(0,pos)+'\n\n**Texto didático obrigatório:** '+extra+s.slice(pos);
}
fs.writeFileSync(f,s,'utf8');
console.log('Prompts atualizados com ícones e rótulos didáticos controlados.');
