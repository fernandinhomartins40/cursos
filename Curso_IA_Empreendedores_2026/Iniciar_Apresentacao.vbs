Option Explicit
Dim sh,fso,d,h,browsers,b
Set sh=CreateObject("WScript.Shell"): Set fso=CreateObject("Scripting.FileSystemObject")
d=Left(WScript.ScriptFullName,InStrRev(WScript.ScriptFullName,"\")): h=d & "Slides_IA_para_Empreendedores_2026.html"
If Not fso.FileExists(h) Then MsgBox "Slides_IA_para_Empreendedores_2026.html nao encontrado.",48,"IA para Empreendedores": WScript.Quit 1
browsers=Array("%ProgramFiles%\Google\Chrome\Application\chrome.exe","%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe","%ProgramFiles%\Microsoft\Edge\Application\msedge.exe","%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe")
For Each b In browsers
 b=sh.ExpandEnvironmentStrings(b)
 If fso.FileExists(b) Then sh.Run """" & b & """ --start-fullscreen --new-window """ & h & """",1,False: WScript.Quit 0
Next
sh.Run """" & h & """",1,False
