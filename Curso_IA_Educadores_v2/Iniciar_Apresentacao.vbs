' ============================================================
'  IA para Educadores 2026 - iniciar apresentacao
'
'  Faz o mesmo que o .bat, mas SEM piscar a janela preta do
'  terminal: em sala, com o projetor ligado, o flash do console
'  aparece na tela para todo mundo. Por isso os dois arquivos
'  existem - o .vbs e o que se usa na apresentacao de verdade.
'
'  Clique duplo abre o deck em tela cheia no Chrome; se nao
'  houver Chrome, tenta o Edge; se nao houver nenhum dos dois,
'  abre no navegador padrao (e ai basta apertar F).
' ============================================================

Option Explicit

Dim oShell, oFSO, sDir, sHTML
Dim sChromeProg, sChromeX86, sChromeLocal, sEdgeProg, sEdgeX86

Set oShell = CreateObject("WScript.Shell")
Set oFSO = CreateObject("Scripting.FileSystemObject")

sDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
sHTML = sDir & "Slides_IA_Educadores_2026.html"

If Not oFSO.FileExists(sHTML) Then
  MsgBox "Slides_IA_Educadores_2026.html nao encontrado." & vbCrLf & vbCrLf & _
         "Este atalho precisa estar na mesma pasta do arquivo de slides.", _
         vbExclamation, "IA para Educadores"
  WScript.Quit 1
End If

sChromeProg  = oShell.ExpandEnvironmentStrings("%ProgramFiles%\Google\Chrome\Application\chrome.exe")
sChromeX86   = oShell.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe")
sChromeLocal = oShell.ExpandEnvironmentStrings("%LocalAppData%\Google\Chrome\Application\chrome.exe")
sEdgeProg    = oShell.ExpandEnvironmentStrings("%ProgramFiles%\Microsoft\Edge\Application\msedge.exe")
sEdgeX86     = oShell.ExpandEnvironmentStrings("%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe")

If oFSO.FileExists(sChromeProg) Then
  Abrir sChromeProg, sHTML
ElseIf oFSO.FileExists(sChromeX86) Then
  Abrir sChromeX86, sHTML
ElseIf oFSO.FileExists(sChromeLocal) Then
  Abrir sChromeLocal, sHTML
ElseIf oFSO.FileExists(sEdgeProg) Then
  Abrir sEdgeProg, sHTML
ElseIf oFSO.FileExists(sEdgeX86) Then
  Abrir sEdgeX86, sHTML
Else
  ' Navegador padrao: abre em aba normal, com barra de enderecos.
  oShell.Run """" & sHTML & """", 1, False
End If

Sub Abrir(sNavegador, sArquivo)
  oShell.Run """" & sNavegador & """ --start-fullscreen --new-window """ & sArquivo & """", 1, False
End Sub
