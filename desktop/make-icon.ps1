# Draws the Scholarmate shield (same shapes as app\public\icon.svg) at several sizes and packs them into desktop\scholarmate.ico.
# Run from the repository root:  powershell -File desktop\make-icon.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
function Pt($x, $y) { New-Object System.Drawing.PointF ([single]$x), ([single]$y) }
$sizes = 16, 24, 32, 48, 64, 128, 256
$pngs = @()
foreach ($s in $sizes) {
  $bmp = New-Object System.Drawing.Bitmap $s, $s, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'; $g.Clear([System.Drawing.Color]::Transparent)
  $k = $s / 38.0; $ox = ($s - 32 * $k) / 2
  $g.TranslateTransform([single]$ox, 0); $g.ScaleTransform([single]$k, [single]$k)
  $shield = New-Object System.Drawing.Drawing2D.GraphicsPath
  $shield.AddLine((Pt 2 2), (Pt 30 2)); $shield.AddLine((Pt 30 2), (Pt 30 20))
  $shield.AddBezier((Pt 30 20), (Pt 30 28), (Pt 23 33), (Pt 16 36))
  $shield.AddBezier((Pt 16 36), (Pt 9 33), (Pt 2 28), (Pt 2 20)); $shield.CloseFigure()
  $g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0x1f, 0x3a, 0x5f))), $shield)
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 0xd9, 0xb4, 0x5a)), 1.6; $pen.LineJoin = 'Round'
  $g.DrawPath($pen, $shield)
  $rook = [System.Drawing.PointF[]]@((Pt 11 9), (Pt 13 9), (Pt 13 11), (Pt 15 11), (Pt 15 9), (Pt 17 9), (Pt 17 11), (Pt 19 11), (Pt 19 9), (Pt 21 9), (Pt 21 14), (Pt 19 15), (Pt 19 21), (Pt 22 24), (Pt 22 26), (Pt 10 26), (Pt 10 24), (Pt 13 21), (Pt 13 15), (Pt 11 14))
  $g.FillPolygon((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0xf6, 0xf1, 0xe4))), $rook)
  $book = New-Object System.Drawing.Drawing2D.GraphicsPath
  $book.AddBezier((Pt 7 29), (Pt 10 27), (Pt 13 27), (Pt 16 29)); $book.AddBezier((Pt 16 29), (Pt 19 27), (Pt 22 27), (Pt 25 29))
  $book.AddLine((Pt 25 29), (Pt 25 31)); $book.AddBezier((Pt 25 31), (Pt 22 29), (Pt 19 29), (Pt 16 31)); $book.AddBezier((Pt 16 31), (Pt 13 29), (Pt 10 29), (Pt 7 31)); $book.CloseFigure()
  $g.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 0xf0, 0x9a, 0x7b))), $book)
  $g.Dispose()
  $ms = New-Object System.IO.MemoryStream; $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); $pngs += , $ms.ToArray(); $bmp.Dispose()
}
# ICO container with PNG-compressed images (supported from Windows Vista)
$out = New-Object System.IO.MemoryStream; $w = New-Object System.IO.BinaryWriter $out
$w.Write([uint16]0); $w.Write([uint16]1); $w.Write([uint16]$sizes.Count)
$offset = 6 + 16 * $sizes.Count
for ($i = 0; $i -lt $sizes.Count; $i++) {
  $s = $sizes[$i]; $d = if ($s -ge 256) { 0 } else { $s }
  $w.Write([byte]$d); $w.Write([byte]$d); $w.Write([byte]0); $w.Write([byte]0); $w.Write([uint16]1); $w.Write([uint16]32)
  $w.Write([uint32]$pngs[$i].Length); $w.Write([uint32]$offset); $offset += $pngs[$i].Length
}
foreach ($p in $pngs) { $w.Write($p) }
$w.Flush(); [System.IO.File]::WriteAllBytes((Join-Path (Get-Location) 'desktop\scholarmate.ico'), $out.ToArray())
Get-Item desktop\scholarmate.ico | Select-Object Name, Length
