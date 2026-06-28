# Fix heading order - h4 card titles that skip h3 level
# These are service cards and industry cards under h2 section headings

$files = Get-ChildItem -Path "." -Filter "*.html" | Where-Object {
    $_.Name -ne "og-image.html" -and $_.Name -ne "googlebab015a98012d39d.html"
}

$fixCount = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # Fix service cards: h4 text-[22px] -> h3 (same classes, just correct element)
    $content = $content.Replace(
        '<h4 class="text-[22px] font-body font-semibold text-luxury-black">',
        '<h3 class="text-[22px] font-body font-semibold text-luxury-black">'
    )
    $content = $content.Replace(
        '</h4>',
        '</h3>'
    )

    # Fix industry cards: h4 text-lg -> h3
    $content = $content.Replace(
        '<h4 class="text-lg font-body font-semibold mb-4 text-luxury-black">',
        '<h3 class="text-lg font-body font-semibold mb-4 text-luxury-black">'
    )

    # Fix any other h4 variants in card grids
    $content = $content.Replace(
        '<h4 class="text-xl font-body font-semibold text-luxury-black">',
        '<h3 class="text-xl font-body font-semibold text-luxury-black">'
    )
    $content = $content.Replace(
        '<h4 class="text-lg font-semibold text-luxury-black mb-2">',
        '<h3 class="text-lg font-semibold text-luxury-black mb-2">'
    )
    $content = $content.Replace(
        '<h4 class="font-semibold text-luxury-black mb-2">',
        '<h3 class="font-semibold text-luxury-black mb-2">'
    )
    $content = $content.Replace(
        '<h4 class="text-xl font-semibold text-luxury-black mb-3">',
        '<h3 class="text-xl font-semibold text-luxury-black mb-3">'
    )
    $content = $content.Replace(
        '<h4 class="font-heading text-xl font-semibold mb-2">',
        '<h3 class="font-heading text-xl font-semibold mb-2">'
    )

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
        $fixCount++
    }
}
Write-Host "`nTotal files fixed: $fixCount"
