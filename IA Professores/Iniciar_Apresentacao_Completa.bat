@echo off
title IA para Educadores
set "HTML=%~dp0Apresentacao_Completa_Genspark_Style.html"
if not exist "%HTML%" (echo ERRO: arquivo nao encontrado & pause & exit /b)
rem Chrome
for %%P in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LocalAppData%\Google\Chrome\Application\chrome.exe"
) do (
  if exist %%~P (
    start "" %%~P --start-fullscreen "%HTML%"
    exit /b)
)
rem Edge
for %%P in (
  "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
  "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
) do (
  if exist %%~P (
    start "" %%~P --start-fullscreen "%HTML%"
    exit /b)
)
rem Padrao
start "" "%HTML%"
