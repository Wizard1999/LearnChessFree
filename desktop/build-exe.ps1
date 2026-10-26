# Builds desktop\ChessSchool.exe: the web app (app\dist) packed inside one small Windows program. Needs Node (for the web build) and the
# C# compiler that ships with Windows. Run from the repository root:  powershell -File desktop\build-exe.ps1
$ErrorActionPreference = 'Stop'
Push-Location app; npm run build; Pop-Location
if (Test-Path desktop\site.zip) { Remove-Item desktop\site.zip }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory((Resolve-Path app\dist), (Join-Path (Resolve-Path desktop) 'site.zip'), [System.IO.Compression.CompressionLevel]::Optimal, $false)
$csc = "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
& $csc /nologo /target:winexe /out:desktop\ChessSchool.exe /resource:desktop\site.zip,site.zip /reference:System.Windows.Forms.dll /reference:System.Drawing.dll /reference:System.IO.Compression.dll /reference:System.IO.Compression.FileSystem.dll desktop\Launcher.cs
Remove-Item desktop\site.zip
Get-Item desktop\ChessSchool.exe | Select-Object Name, Length
