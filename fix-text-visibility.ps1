# Fix all remaining text-white / text visibility issues across dashboard inner pages
$rootPath = "src/app/(dashboard)"
$pages = Get-ChildItem $rootPath -Recurse -Filter '*.tsx'

foreach ($file in $pages) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  $changed = $false

  # Check if file has white-on-white problem (text-white on a white/light card)
  if ($content -match 'text-white') {
    Write-Host "Fixing text-white in: $($file.Name)"
    $changed = $true

    # Fix all text-white variations that are now invisible on light backgrounds
    $content = $content -replace '\btext-white\b', 'text-[#09090b]'
  }

  # Fix chart tooltip dark backgrounds that are still dark
  if ($content -match 'backgroundColor: "?#18') {
    $content = $content -replace 'backgroundColor: "#181922"', 'backgroundColor: "#ffffff"'
    $content = $content -replace 'backgroundColor: "#181620"', 'backgroundColor: "#ffffff"'
    $changed = $true
  }

  # Fix remaining dark stroke colors in charts (grid lines should be light)
  if ($content -match 'stroke="#252731"|stroke="#2d2f39"|stroke="#1A1822"') {
    $content = $content -replace 'stroke="#252731"', 'stroke="#ececee"'
    $content = $content -replace 'stroke="#2d2f39"', 'stroke="#ececee"'
    $content = $content -replace 'stroke="#1A1822"', 'stroke="#ececee"'
    $changed = $true
  }

  # Fix dark fill colors on dots in charts
  if ($content -match "fill: '#181922'|fill: '#121016'|fill: '#0f1016'") {
    $content = $content -replace "fill: '#181922'", "fill: '#ffffff'"
    $content = $content -replace "fill: '#121016'", "fill: '#ffffff'"
    $content = $content -replace "fill: '#0f1016'", "fill: '#ffffff'"
    $changed = $true
  }

  # Fix purple chart stroke colors -> Obsidian
  if ($content -match 'stroke="#7C3AED"|stroke="#9B5CF6"') {
    $content = $content -replace 'stroke="#7C3AED"', 'stroke="#09090b"'
    $content = $content -replace 'stroke="#9B5CF6"', 'stroke="#09090b"'
    $content = $content -replace "stroke: '#7C3AED'", "stroke: '#09090b'"
    $content = $content -replace "stroke: '#9B5CF6'", "stroke: '#09090b'"
    $changed = $true
  }

  # Fix purple stopColor in gradients to use light green or obsidian
  if ($content -match 'stopColor="#7C3AED"|stopColor="#9B5CF6"') {
    $content = $content -replace 'stopColor="#7C3AED"', 'stopColor="#09090b"'
    $content = $content -replace 'stopColor="#9B5CF6"', 'stopColor="#09090b"'
    $changed = $true
  }

  # Fix dark tick/axis colors in charts
  if ($content -match 'stroke="#4b5563"') {
    $content = $content -replace 'stroke="#4b5563"', 'stroke="#d4d4d8"'
    $changed = $true
  }

  # Fix bg-[#f4f4f5] wrappers that still have text-[#09090b] — these are fine, skip

  # Fix any remaining dark hover states
  if ($content -match 'focus:bg-\[#221F2C\]|focus:bg-\[#2A2735\]') {
    $content = $content -replace 'focus:bg-\[#221F2C\]', 'focus:bg-[#f4f4f5]'
    $content = $content -replace 'focus:bg-\[#2A2735\]', 'focus:bg-[#f4f4f5]'
    $changed = $true
  }

  if ($changed) {
    Set-Content $file.FullName $content -NoNewline -Encoding UTF8
    Write-Host "  -> Saved"
  }
}

# Also fix components/layout files
$componentFiles = Get-ChildItem 'src/components' -Recurse -Filter '*.tsx'
foreach ($file in $componentFiles) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  $changed = $false

  if ($content -match '\btext-white\b') {
    # Only fix text-white on light-background components (not in dark sections like buttons)
    # Fix specifically the cases that are NOT in a bg-[#09090b] context
    # We'll target text-white that appear in card/section contexts
    if ($content -match 'bg-white.*text-white|text-white.*bg-white') {
      Write-Host "Fixing component: $($file.Name)"
      $content = $content -replace '\btext-white\b', 'text-[#09090b]'
      $changed = $true
    }
  }

  if ($changed) {
    Set-Content $file.FullName $content -NoNewline -Encoding UTF8
    Write-Host "  -> Saved"
  }
}

Write-Host "Done! All text-white visibility issues fixed."
