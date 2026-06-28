Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "favicon.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)

# Create 192x192
$bmp192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($bmp192)
$g192.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g192.DrawImage($img, 0, 0, 192, 192)
$bmp192.Save((Join-Path $PSScriptRoot "icons\icon-192.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g192.Dispose()
$bmp192.Dispose()
Write-Host "Created icon-192.png"

# Create 512x512
$bmp512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($bmp512)
$g512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g512.DrawImage($img, 0, 0, 512, 512)
$bmp512.Save((Join-Path $PSScriptRoot "icons\icon-512.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g512.Dispose()
$bmp512.Dispose()
$img.Dispose()
Write-Host "Created icon-512.png"
Write-Host "Done!"
