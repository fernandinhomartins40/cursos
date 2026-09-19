# Mapeamento para o Aprender IA

## Fonte de verdade

[conteudo_aprender_ia.json](conteudo_aprender_ia.json) é o manifesto UTF-8 importável. A apostila, os slides e o kit são saídas editoriais; a aplicação deve usar o manifesto para módulos, lições, XP, prompts, cronômetros e checkpoints.

## Formação implementada

| Módulo | Encontro ao vivo | Aplicação guiada | Ferramentas | Produto |
|---|---:|---:|---|---|
| 1 | 2h | 8h | ChatGPT e Work | Biblioteca de prompts e plano semanal revisado |
| 2 | 2h | 8h | ChatGPT Images, Gemini/Veo quando disponível | Kit de campanha visual e roteiro de vídeo |
| 3 | 2h | 8h | Gemini Docs, Sheets e NotebookLM | Procedimento, painel e base de conhecimento |
| 4 | 2h | 8h | Agentes, Claude Cowork, Make e Apps Script | Piloto de automação e plano de 30 dias |

Total: 8 horas ao vivo + 32 horas de aplicação orientada = 40 horas.

## Contrato de importação

| Campo | Uso na aplicação |
|---|---|
| `course.slug` | Identificador estável do curso |
| `course.visual_tokens` | Tema visual da experiência |
| `modules[].id` e `order` | Sequência de módulos |
| `duration_minutes` | Duração do encontro ao vivo |
| `application_extension_hours` | Horas guiadas fora do encontro |
| `product` | Entrega do módulo |
| `lessons[].type` | Componente interativo |
| `xp` | Recompensa pela conclusão |
| `template` | Prompt copiável e preenchível |
| `evidence` | Itens exigidos no checkpoint |

## Componentes por tipo

- `WARMUP`: reflexão curta sobre a rotina atual.
- `TEORIA`: explicação simples, exemplo e confirmação de conclusão.
- `FERRAMENTA`: tela guiada de acesso, condição de uso e limite da ferramenta.
- `PROMPT`: campos entre colchetes, copiar, abrir ferramenta externa e registrar revisão.
- `LABORATORIO`: roteiro em etapas com evidência obrigatória.
- `DUELO`: comparação entre pedido fraco e pedido contextualizado.
- `CACA_ERRO`: identificação de risco, correção e encaminhamento humano.
- `CASO`: decisão em cenário de negócio e solução comentada.
- `DESAFIO`: cronômetro, upload/link ou resposta do participante.
- `CHECKPOINT`: checklist de evidências e validação do produto de saída.

## Segurança de produto

- Mostrar alerta antes de colar CPF, telefone, e-mail, credencial, informação médica, financeira ou de cliente.
- Nunca enviar automaticamente a um cliente uma saída produzida por ferramenta de IA.
- Antes de conectar apps, informar qual conta, quais permissões e como desligar o fluxo.
- Em Sheets e automações, oferecer prévia e confirmação humana antes de alterar, enviar ou publicar.
- Após cada prática, pedir a reflexão: “o que você revisou antes de usar?”
