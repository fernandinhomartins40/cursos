# Curso de IA para Empreendedores

Projeto completo de capacitação profissional em IA aplicada a pequenos negócios brasileiros, edição 2026.

## Entregas geradas

- `Apostila_IA_para_Empreendedores_2026.html` e PDF: caderno de trabalho, com 12 módulos, práticas, casos, prompts e projeto final.
- `Slides_IA_para_Empreendedores_2026.html` e PDF: deck de 8 aulas, pronto para facilitação.
- `Kit_IA_para_Empreendedores.html` e PDF: diagnóstico, mapa de oportunidades, biblioteca de prompts, segurança e plano de 30 dias.
- `ARQUITETURA_DO_CURSO.md`: desenho pedagógico e operacional.
- `PESQUISA_E_FERRAMENTAS_2026.md`: fontes, critérios e limites das ferramentas.
- `MANUAL_DO_INSTRUTOR.md`: roteiro de facilitação, avaliação e contingências.
- `MODELO_DE_CERTIFICADO.html`: certificado editável, em A4 paisagem.

## Como gerar

Instale Puppeteer onde desejar executar e rode:

```bash
npm install puppeteer
node reconstruir_curso_completo.js
node adicionar_interatividade_slides.js
node adicionar_recursos_avancados.js
node gerar_prompts_imagens_pdf.js
node gerar_pdfs.js
```

Os PDFs são gravados em `output/pdf/`. Abra o HTML dos slides pelo `Iniciar_Apresentacao.vbs` ou `.bat`: setas, espaço, G e F controlam a navegação; desafios trazem cronômetro e a biblioteca oferece cópia e abertura nas IAs.
