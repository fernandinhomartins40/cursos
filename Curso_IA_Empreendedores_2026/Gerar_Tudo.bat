@echo off
setlocal
cd /d "%~dp0"
echo Reconstruindo no padrao visual e funcional de Educadores...
node adotar_template_educadores.js || goto :erro
node expandir_formacao_40h.js || goto :erro
node integrar_ferramentas_aplicadas_2026.js || goto :erro
node atualizar_manifesto_aprender_ia.js || goto :erro
node integrar_imagens_finais.js || goto :erro
node gerar_prompts_imagens_pdf.js || goto :erro
node gerar_pdfs.js || goto :erro
node gerar_edicao_economica.js || goto :erro
echo.
echo Materiais atualizados com sucesso.
pause
exit /b 0
:erro
echo.
echo Houve um erro. Confirme se as dependencias foram instaladas.
pause
exit /b 1
