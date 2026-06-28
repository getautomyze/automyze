$replacements = @{
    "â†’" = "→"
    "ðŸ“ " = "📍"
    "Â·" = "·"
    "â€”" = "—"
    "â€“" = "–"
    "â€¢" = "•"
    "â• " = "═"
    "â€™" = "’"
    "â€œ" = "“"
    "â€" = "”"
    "April" = "June"
}

$files = Get-ChildItem -Path $PSScriptRoot -Filter "*.html"

foreach ($file in $files) {
    # Read as UTF-8
    $content = Get-Content $file.FullName -Encoding UTF8 -Raw
    
    $changed = $false
    foreach ($key in $replacements.Keys) {
        if ($content -match [regex]::Escape($key)) {
            $content = $content -replace [regex]::Escape($key), $replacements[$key]
            $changed = $true
        }
    }
    
    if ($changed) {
        # Save as UTF-8 without BOM, standard for web
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        Write-Host "Fixed: $($file.Name)"
    }
}
Write-Host "Done fixing encodings."
