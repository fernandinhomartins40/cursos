Set oShell = CreateObject("WScript.Shell")
Dim sDir, sHTML, sChrome, sEdge, sChromeLocal
sDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
sHTML = sDir & "Apresentacao_Completa_Genspark_Style.html"
sChrome = oShell.ExpandEnvironmentStrings("%ProgramFiles%\Google\Chrome\Application\chrome.exe")
sChromeLocal = oShell.ExpandEnvironmentStrings("%LocalAppData%\Google\Chrome\Application\chrome.exe")
sEdge = oShell.ExpandEnvironmentStrings("%ProgramFiles%\Microsoft\Edge\Application\msedge.exe")
Set oFSO = CreateObject("Scripting.FileSystemObject")
If oFSO.FileExists(sChrome) Then
  oShell.Run """" & sChrome & """ --start-fullscreen """ & sHTML & """", 1, False
ElseIf oFSO.FileExists(sChromeLocal) Then
  oShell.Run """" & sChromeLocal & """ --start-fullscreen """ & sHTML & """", 1, False
ElseIf oFSO.FileExists(sEdge) Then
  oShell.Run """" & sEdge & """ --start-fullscreen """ & sHTML & """", 1, False
Else
  oShell.Run """" & sHTML & """", 1, False
End If
