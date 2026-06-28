# Fix all HTML files:
# 1. Add rel="preload" for CSS before the blocking stylesheet link
# 2. Add preconnect for cloudflare-static 
# 3. Fix double-nested noscript tags on font links
# 4. Add will-change to animate-ping span

$files = Get-ChildItem -Path "." -Filter "*.html" | Where-Object { $_.Name -ne "og-image.html" -and $_.Name -ne "googlebab015a98012d39d.html" }

$fixCount = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # Fix 1: Add preload hint for CSS (before the blocking link tag)
    $cssLink = '<link rel="stylesheet" href="/css/styles.css"/>'
    $cssPreload = '<link rel="preload" href="/css/styles.css" as="style"/>' + "`r`n" + $cssLink
    $content = $content.Replace($cssLink, $cssPreload)

    # Fix 2: Add cloudflare-static preconnect (after fonts preconnect)
    $fontsPreconnect = '<link href="https://fonts.googleapis.com" rel="preconnect"/>'
    $withCloudflare = $fontsPreconnect + "`r`n" + '<link rel="preconnect" href="https://static.cloudflareinsights.com" crossorigin/>'
    if ($content -notmatch "cloudflareinsights") {
        $content = $content.Replace($fontsPreconnect, $withCloudflare)
    }

    # Fix 3: Fix double-nested noscript issue in font links
    # Pattern: <noscript><link ... media="print" onload="..."/><noscript><link .../></noscript></noscript>
    # Should be: <noscript><link rel="stylesheet" href="..."/></noscript>
    
    # Fix the Material Symbols double noscript
    $badNoscript1 = '<noscript><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" media="print" onload="this.media=''all''"/><noscript><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/></noscript></noscript>'
    $goodNoscript1 = '<noscript><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/></noscript>'
    $content = $content.Replace($badNoscript1, $goodNoscript1)

    # Fix 4: Add will-change to animate-ping span for composited animation
    $pingSpan = '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>'
    $pingSpanFixed = '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75" style="will-change:transform,opacity;"></span>'
    $content = $content.Replace($pingSpan, $pingSpanFixed)

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
        $fixCount++
    }
}
Write-Host "`nTotal files fixed: $fixCount"
