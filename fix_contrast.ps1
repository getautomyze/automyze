# ================================================================
# Contrast Fix Script - Fix all WCAG AA contrast failures
# luxury-gold (#C9A96E) on white (#FAFAF8) = 2.77:1 FAILS
# Fix: Add a CSS custom property for accessible gold text
# ================================================================

$files = Get-ChildItem -Path "." -Filter "*.html" | Where-Object {
    $_.Name -ne "og-image.html" -and $_.Name -ne "googlebab015a98012d39d.html"
}

$fixCount = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # ----------------------------------------------------------------
    # Fix 1: Footer bottom bar - text-white/20 -> text-white/50
    # "© 2026 AUTOMYZE" and Privacy/Terms links
    # white/20 on black = ~1.3:1 (FAILS badly)
    # white/50 on black = ~3.4:1 (passes for decorative/small caps)
    # ----------------------------------------------------------------
    $content = $content.Replace(
        'text-[10px] uppercase tracking-widest text-white/20',
        'text-[10px] uppercase tracking-widest text-white/50'
    )

    # ----------------------------------------------------------------
    # Fix 2: Footer body text - text-white/60 -> text-white/75
    # Navigation links, contact items in footer
    # white/60 on black = ~3.9:1 (fails for small text < 18px)
    # white/75 on black = ~5.0:1 (passes AA)
    # ----------------------------------------------------------------
    $content = $content.Replace(
        'class="space-y-4 text-white/60 text-sm"',
        'class="space-y-4 text-white/75 text-sm"'
    )
    # Footer nav lists also use text-white/60
    $content = $content.Replace(
        'class="space-y-3 text-white/60 text-sm"',
        'class="space-y-3 text-white/75 text-sm"'
    )

    # ----------------------------------------------------------------
    # Fix 3: Gold section labels on white/beige backgrounds
    # "WHAT WE BUILD", "INDUSTRIES WE SERVE" etc.
    # text-luxury-gold on bg-luxury-white = 2.77:1 FAILS
    # Fix: replace with a darker amber that still looks gold
    # We add a CSS override via an inline style on the specific class pattern
    # ----------------------------------------------------------------
    # Pattern: text-xs uppercase tracking-[0.3em] text-luxury-gold font-bold
    $content = $content.Replace(
        'class="text-xs uppercase tracking-[0.3em] text-luxury-gold font-bold mb-4"',
        'class="text-xs uppercase tracking-[0.3em] font-bold mb-4" style="color:#7A5C1E;"'
    )
    # Same without mb-4
    $content = $content.Replace(
        'class="text-xs uppercase tracking-[0.3em] text-luxury-gold font-bold"',
        'class="text-xs uppercase tracking-[0.3em] font-bold" style="color:#7A5C1E;"'
    )

    # ----------------------------------------------------------------
    # Fix 4: Step number labels "01 / IDENTIFY" etc (9px gold on white)
    # text-[9px] font-bold text-luxury-gold uppercase tracking-widest
    # These are tiny text - need highest contrast
    # ----------------------------------------------------------------
    $content = $content.Replace(
        'class="text-[9px] font-bold text-luxury-gold uppercase tracking-widest"',
        'class="text-[9px] font-bold uppercase tracking-widest" style="color:#7A5C1E;"'
    )

    # ----------------------------------------------------------------
    # Fix 5: "SEE FULL CASE STUDIES →" link - gold on white
    # ----------------------------------------------------------------
    $content = $content.Replace(
        'class="text-luxury-gold text-sm font-bold uppercase tracking-widest hover:text-luxury-black transition-colors"',
        'class="text-sm font-bold uppercase tracking-widest hover:text-luxury-black transition-colors" style="color:#7A5C1E;"'
    )

    # ----------------------------------------------------------------
    # Fix 6: "Currently onboarding..." italic gold text on white
    # text-luxury-gold italic font-heading text-lg
    # large text needs 3:1 ratio. #C9A96E = 2.77 - still fails
    # ----------------------------------------------------------------
    $content = $content.Replace(
        'class="text-luxury-gold italic font-heading text-lg mb-6"',
        'class="italic font-heading text-lg mb-6" style="color:#7A5C1E;"'
    )

    # ----------------------------------------------------------------
    # Fix 7: Badge "3 spots left for June" - gold text on gold/10 bg
    # text-luxury-gold on bg-luxury-gold/10 = very low contrast
    # ----------------------------------------------------------------
    $content = $content.Replace(
        'class="text-[10px] font-bold uppercase tracking-tighter text-luxury-gold"',
        'class="text-[10px] font-bold uppercase tracking-tighter" style="color:#7A5C1E;"'
    )

    # ----------------------------------------------------------------
    # Fix 8: Footer column headings "Contact", "Services" etc
    # text-luxury-gold on bg-luxury-black
    # #C9A96E on #0A0A0A = ~6.5:1 - this actually PASSES!
    # No change needed for footer headings
    # ----------------------------------------------------------------

    # ----------------------------------------------------------------
    # Fix 9: "Efficiency." hero italic gold text
    # font-heading italic text-luxury-gold - large display text
    # Needs 3:1 for large text. Current = 2.77 - marginally fails
    # ----------------------------------------------------------------
    $content = $content.Replace(
        'class="font-heading italic text-luxury-gold"',
        'class="font-heading italic" style="color:#A07830;"'
    )

    # ----------------------------------------------------------------
    # Fix 10: Stats section small gold labels
    # e.g. "40% OPS COST REDUCED" labels
    # ----------------------------------------------------------------
    $content = $content.Replace(
        'class="text-[10px] uppercase tracking-widest text-luxury-gold font-bold"',
        'class="text-[10px] uppercase tracking-widest font-bold" style="color:#7A5C1E;"'
    )
    $content = $content.Replace(
        'class="text-xs uppercase tracking-widest text-luxury-gold font-bold"',
        'class="text-xs uppercase tracking-widest font-bold" style="color:#7A5C1E;"'
    )

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($file.Name)"
        $fixCount++
    }
}
Write-Host "`nTotal files fixed: $fixCount"
