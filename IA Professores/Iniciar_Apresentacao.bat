@echo off
title Apresentacao IA para Educadores
echo.
echo ============================================
echo    APRESENTACAO - IA PARA EDUCADORES
echo    Formacao Completa 40 Horas
echo ============================================
echo.
echo Abrindo apresentacao no navegador...
echo.
echo CONTROLES:
echo   Seta Direita / Espaco = Proximo slide
echo   Seta Esquerda         = Slide anterior
echo   F                     = Tela Cheia
echo   G                     = Visao Geral
echo   Home / End            = Primeiro / Ultimo
echo.

:: Try Chrome first (kiosk mode = fullscreen)
where chrome >nul 2>nul
if %errorlevel%==0 (
    start "" chrome --start-fullscreen "%~dp0Apresentacao_Slides_IA_Educadores.html"
    goto :end
)

:: Try Edge
where msedge >nul 2>nul
if %errorlevel%==0 (
    start "" msedge --start-fullscreen "%~dp0Apresentacao_Slides_IA_Educadores.html"
    goto :end
)

:: Fallback: default browser
start "" "%~dp0Apresentacao_Slides_IA_Educadores.html"

:end
echo Apresentacao iniciada! Pressione F para tela cheia.
timeout /t 5 >nul
