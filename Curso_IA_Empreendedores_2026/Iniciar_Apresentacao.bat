@echo off
title Apresentacao - IA para Empreendedores 2026
set "HTML=%~dp0Slides_IA_para_Empreendedores_2026.html"
if not exist "%HTML%" (echo Arquivo de slides nao encontrado.& pause & exit /b 1)
for %%P in ("%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe") do if exist %%~P (start "" %%~P --start-fullscreen --new-window "%HTML%" & exit /b)
start "" "%HTML%"
