@echo off
title Apresentacao - IA para Educadores 2026
setlocal

set "HTML=%~dp0Slides_IA_Educadores_2026.html"

if not exist "%HTML%" (
    echo.
    echo  ERRO: Slides_IA_Educadores_2026.html nao encontrado.
    echo  Este atalho precisa estar na mesma pasta do arquivo de slides.
    echo.
    pause
    exit /b 1
)

echo.
echo  ============================================
echo     IA PARA EDUCADORES - FORMACAO 40 HORAS
echo     Apresentacao 2026
echo  ============================================
echo.
echo  CONTROLES:
echo    Seta direita / Espaco . . . proximo slide
echo    Seta esquerda . . . . . . . slide anterior
echo    G . . . . . . . . . . . . . miniaturas (visao geral)
echo    F . . . . . . . . . . . . . tela cheia
echo    Home / End  . . . . . . . . primeiro / ultimo
echo    Esc . . . . . . . . . . . . fecha as miniaturas
echo.
echo  Abrindo em tela cheia...
echo.

rem Chrome tem prioridade: --start-fullscreen esconde a barra de enderecos,
rem que e o que faz a apresentacao parecer um aplicativo e nao uma aba.
for %%P in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LocalAppData%\Google\Chrome\Application\chrome.exe"
) do (
  if exist %%~P (
    start "" %%~P --start-fullscreen --new-window "%HTML%"
    goto :fim
  )
)

rem Edge: presente em toda instalacao do Windows, serve de plano B.
for %%P in (
  "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
  "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
) do (
  if exist %%~P (
    start "" %%~P --start-fullscreen --new-window "%HTML%"
    goto :fim
  )
)

rem Ultimo recurso: navegador padrao. Abre em aba normal;
rem a tecla F coloca em tela cheia.
echo  Chrome e Edge nao encontrados - abrindo no navegador padrao.
echo  Pressione F para tela cheia.
start "" "%HTML%"

:fim
timeout /t 4 >nul
endlocal
