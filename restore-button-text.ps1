# Restore text-white ONLY on dark-background elements (buttons, badges with dark fill)
# The fix-text-visibility.ps1 over-corrected by removing text-white from dark CTAs too

$allFiles = Get-ChildItem 'src' -Recurse -Filter '*.tsx'

foreach ($file in $allFiles) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  $changed = $false

  # Restore text-white on dark button CTAs (bg-[#09090b], bg-[#18181b])
  # Pattern: bg-[#09090b] ... text-[#09090b] -> should be text-white
  # We match the specific button className patterns
  
  # Dark filled primary buttons - restore white text
  $patterns = @(
    # bg-[#09090b] with text-[#09090b] should be bg-[#09090b] text-white
    'bg-\[#09090b\]([^"]*?)text-\[#09090b\]',
    'bg-\[#18181b\]([^"]*?)text-\[#09090b\]'
  )
  
  foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
      $content = $content -replace '(bg-\[#09090b\][^"]*?)text-\[#09090b\]', '${1}text-white'
      $content = $content -replace '(bg-\[#18181b\][^"]*?)text-\[#09090b\]', '${1}text-white'
      $changed = $true
    }
  }

  # Fix hover:bg-[#18181b] text context (export/download buttons)
  if ($content -match 'hover:bg-\[#18181b\].*text-\[#09090b\]') {
    $content = $content -replace '(hover:bg-\[#18181b\][^"]*?)text-\[#09090b\]', '${1}text-white'
    $changed = $true
  }

  if ($changed) {
    Write-Host "Restoring button text in: $($file.Name)"
    Set-Content $file.FullName $content -NoNewline -Encoding UTF8
    Write-Host "  -> Done"
  }
}

Write-Host "Button text restoration complete."
