$files = Get-ChildItem -Path "." -Filter "*.html"
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Fix broken arrow encoding: â†' -> →
    $updated = $content.Replace("â†'", "→")
    
    # Fix month: April -> June
    $updated = $updated.Replace("3 spots left for April", "3 spots left for June")
    $updated = $updated.Replace("3 Spots Left For April", "3 Spots Left For June")
    $updated = $updated.Replace("3 SPOTS LEFT FOR APRIL", "3 SPOTS LEFT FOR JUNE")
    
    if ($content -ne $updated) {
        [System.IO.File]::WriteAllText($file.FullName, $updated, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
    }
}
Write-Host "Done."
