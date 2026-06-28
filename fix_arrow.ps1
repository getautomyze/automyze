$files = Get-ChildItem -Path "." -Filter "*.html"
$fixCount = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Strategy: find lines with "Request AI Audit" and clean up everything after it
    # Replace the messy version with a clean version using a simple contains check
    $oldStr1 = "Request AI Audit &#8594;"
    $arrow = [char]0x2192  # Unicode RIGHT ARROW
    $newStr = "Request AI Audit " + $arrow
    
    $newContent = $content
    
    # First remove the double-encoded mess (&#8594; + leftover garbage)
    # The leftover garbage after &#8594; is the broken UTF8 sequence for arrow
    # We'll replace everything: just find "Request AI Audit" lines and normalize
    $lines = $newContent -split "`r`n"
    $changed = $false
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "Request AI Audit") {
            $cleanLine = $lines[$i] -replace "Request AI Audit.*$", ("Request AI Audit " + $arrow)
            if ($cleanLine -ne $lines[$i]) {
                $lines[$i] = $cleanLine
                $changed = $true
            }
        }
    }
    
    if ($changed) {
        $newContent = $lines -join "`r`n"
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
        $fixCount++
    }
}
Write-Host "Total fixed: $fixCount files"
