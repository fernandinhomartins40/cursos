# Curso: Inteligência Artificial para Educadores

Material didático completo de formação em IA para professores da rede pública de ensino.

**40 horas certificadas** · 4 encontros presenciais de 2h (8h) + 32h de aplicação e Projeto de Intervenção

---

## O que há neste repositório

### 📘 `Curso_IA_Educadores_v2/` — versão atual (2026)

| Arquivo | Descrição |
|---|---|
| `Apostila_IA_Educadores_2026.pdf` | **108 páginas** · 13 capítulos + 4 anexos + destacáveis |
| `Slides_IA_Educadores_2026.pdf` | **96 slides** em 16:9, prontos para projetar |
| `Slides_IA_Educadores_2026.html` | Apresentação interativa (navegação por teclado, miniaturas, tela cheia) |
| `Iniciar_Apresentacao.vbs` | **Clique duplo → apresentação em tela cheia.** Sem barra do navegador, sem janela de terminal |
| `Iniciar_Apresentacao.bat` | O mesmo, com console mostrando os atalhos de teclado |
| `Ementa_Atualizada_2026.md` | Ementa oficial com a metodologia dos 4 encontros |
| `PLANO_REESTRUTURACAO_CURSO.md` | Diagnóstico e plano que originou esta versão |
| `Prompts_das_Imagens.pdf` | **Um prompt por página**, com nome do arquivo e pasta de destino — para imprimir ou abrir ao lado do gerador |
| `GUIA_DE_IMAGENS.md` | A mesma coisa em Markdown, com a tabela de referência |

### 📗 `_ORIGINAL_v1_PROTEGIDO/` — versão original preservada

A apostila de 46 páginas que serviu de base, mantida intacta como referência de linguagem e identidade visual.

### 📙 `IA Professores/` — arquivos históricos

Versões anteriores e materiais de trabalho.

---

## Estrutura pedagógica

| Encontro | Capítulos | Foco |
|---|---|---|
| **1** | 1 e 2 | Fundamentos da IA e a fórmula P.T.C.F. |
| **2** | 3, 4 e 5 | Rotina, planejamento, BNCC e documentos longos |
| **3** | 6, 7 e 8 | Materiais, inclusão (DUA) e recursos visuais |
| **4** | 9, 10 e 11 | Avaliação, ética/LGPD e Projeto de Intervenção |
| **Consulta** | 12 + Anexos A, B e C | Emergências, prompts por disciplina, limites das ferramentas |

### Metodologia: a Regra dos 7 minutos

Nenhum bloco expositivo passa de 7 minutos sem atividade prática. O material contém:

- **8 estudos de caso** com situação real e solução comentada
- **8 duelos de prompt** (ruim → bom → o que muda)
- **4 caça ao erro** com gabarito do formador
- **4 testes no celular** (dispensam laboratório)
- **4 desafios cronometrados**
- **6 destacáveis** para imprimir e levar

---

## Como regenerar os PDFs

Os PDFs são construídos a partir dos arquivos HTML/CSS versionados aqui.

```bash
cd Curso_IA_Educadores_v2

# instalar dependências (usa o Puppeteer de "IA Professores/")
cd "../IA Professores" && npm install && cd "../Curso_IA_Educadores_v2"

# apostila
node montar_apostila.js && node gerar_pdf.js

# slides
node montar_slides.js && node gerar_slides_pdf.js
```

### Imagens

A pasta `imagens/` contém **25 arquivos em branco** com os nomes finais.
Para inserir as ilustrações reais:

1. Abra `Prompts_das_Imagens.pdf` e copie o prompt da página da imagem
2. Cole em um gerador (Gemini, Canva IA, Bing Image Creator, Leonardo) e baixe o PNG
3. Salve com o **nome exato** indicado, na pasta `imagens/`, substituindo o arquivo em branco
4. Rode os montadores novamente

O PDF separa as **12 prioritárias** (a capa + as 11 que a apostila realmente insere) das 13 extras, que têm prompt pronto mas hoje não aparecem em nenhum ponto do material.

Os montadores detectam automaticamente quais imagens já foram substituídas — as que ainda estiverem em branco são simplesmente omitidas do PDF.

---

## Identidade visual

| Token | Cor | Uso |
|---|---|---|
| `--indigo` | `#4F46E5` | Títulos de capítulo, elementos principais |
| `--laranja` | `#F97316` | Ícones, destaques, oficinas |
| `--verde` | `#10B981` | Quadros "Traduzindo" |
| `--vermelho` | `#EF4444` | Quadros "Atenção", LGPD |
| `--amarelo` | `#EAB308` | Quadros "Dica" |

**Tipografia:** Montserrat (títulos) · Nunito Sans (texto) · JetBrains Mono (prompts)

---

## Ferramentas abordadas

Todas verificadas em **setembro de 2026**, com os limites reais documentados no Anexo B.

🟢 Gratuito sem pegadinha · 🟡 Gratuito com cota · 🔴 Créditos finitos

| Ferramenta | Situação |
|---|---|
| DeepSeek | 🟢 Chat sem limite de mensagens |
| Google Gemini | 🟢 Gratuito com conta Google |
| Qwen | 🟢 Chat gratuito |
| Canva para Educação | 🟢 Pro gratuito para docentes verificados |
| NotebookLM | 🟡 ~50 perguntas/dia |
| ChatGPT | 🟡 Troca para modelo mais fraco após uso intenso |
| MagicSchool AI | 🟡 80+ ferramentas, exportação limitada |
| Diffit | 🟡 Não exporta para Docs no plano gratuito |
| Curipod | 🟡 2 sessões ao vivo por semana |
| Gamma | 🔴 400 créditos iniciais |

---

## Licença e uso

Material desenvolvido para formação de professores da rede pública.
