$pages = Get-ChildItem 'src/app/(dashboard)' -Recurse -Filter '*.tsx' |
  Where-Object { $_.FullName -notmatch 'layout\.tsx' }

foreach ($file in $pages) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8

  # Skip files already light-themed
  if ($content -notmatch '#0f1016|#181922|bg-\[#0C0A0E\]|bg-\[#08070B\]|min-h-screen text-white') { continue }

  Write-Host "Patching: $($file.Name)"

  # Dark backgrounds -> light canvas
  $content = $content -replace 'bg-\[#0f1016\]', 'bg-[#f4f4f5]'
  $content = $content -replace 'bg-\[#08070B\]', 'bg-[#f4f4f5]'
  $content = $content -replace 'bg-\[#0C0A0E\]', 'bg-[#fafafa]'
  $content = $content -replace 'min-h-screen text-white', 'min-h-screen text-[#09090b]'
  $content = $content -replace 'text-white bg-\[#0f1016\]', 'text-[#09090b] bg-[#f4f4f5]'
  $content = $content -replace 'text-white bg-\[#08070B\]', 'text-[#09090b] bg-[#f4f4f5]'

  # Card surfaces
  $content = $content -replace 'bg-\[#181922\]', 'bg-white'
  $content = $content -replace 'bg-\[#121016\]', 'bg-white'
  $content = $content -replace 'bg-\[#1d1e27\]', 'bg-[#f4f4f5]'
  $content = $content -replace 'bg-\[#1C1A24\]', 'bg-[#f4f4f5]'
  $content = $content -replace 'bg-\[#181620\]', 'bg-[#fafafa]'

  # Dark borders -> Cloud hairline
  $content = $content -replace 'border-\[#2d2f39\]', 'border-[#ececee]'
  $content = $content -replace 'border-\[#2A2D38\]', 'border-[#ececee]'
  $content = $content -replace 'border-\[#1D1A27\]', 'border-[#ececee]'
  $content = $content -replace 'border-\[#221F2C\]', 'border-[#ececee]'
  $content = $content -replace 'border-\[#1A1822\]', 'border-[#ececee]'
  $content = $content -replace 'border-\[#2A2735\]', 'border-[#ececee]'

  # Text colors
  $content = $content -replace '\btext-\[#8e909a\]', 'text-[#71717a]'
  $content = $content -replace '\btext-gray-400\b', 'text-[#71717a]'
  $content = $content -replace '\btext-gray-300\b', 'text-[#52525b]'

  # Purple accents -> Obsidian
  $content = $content -replace 'bg-\[#7C3AED\]([^/])', 'bg-[#09090b]$1'
  $content = $content -replace 'hover:bg-\[#6D28D9\]', 'hover:bg-[#18181b]'
  $content = $content -replace 'bg-\[#9B5CF6\]([^/])', 'bg-[#09090b]$1'
  $content = $content -replace 'text-\[#9B5CF6\]', 'text-[#09090b]'
  $content = $content -replace 'text-\[#7C3AED\]', 'text-[#52525b]'

  # Hover backgrounds on dark cards
  $content = $content -replace 'hover:bg-\[#121016\]', 'hover:bg-[#f4f4f5]'
  $content = $content -replace 'hover:bg-\[#1A1722\]', 'hover:bg-[#f4f4f5]'
  $content = $content -replace 'hover:bg-\[#201E2A\]', 'hover:bg-[#f4f4f5]'

  # Chart/tooltip dark containers
  $content = $content -replace "backgroundColor: `"#121016`"", "backgroundColor: `"#ffffff`""
  $content = $content -replace "backgroundColor: `"#0f1016`"", "backgroundColor: `"#ffffff`""
  $content = $content -replace "border: `"1px solid #221F2C`"", "border: `"1px solid #ececee`""
  $content = $content -replace "border: `"1px solid #2d2f39`"", "border: `"1px solid #ececee`""
  $content = $content -replace "color: `"#ffffff`"", "color: `"#09090b`""

  # Focus/hover states
  $content = $content -replace 'focus:bg-\[#221F2C\]', 'focus:bg-[#f4f4f5]'
  $content = $content -replace 'focus:bg-\[#2A2735\]', 'focus:bg-[#f4f4f5]'

  # Rounded corners
  $content = $content -replace 'rounded-\[18px\]', 'rounded-[28px]'
  $content = $content -replace 'rounded-\[24px\]', 'rounded-[28px]'
  $content = $content -replace 'rounded-xl', 'rounded-[14px]'
  $content = $content -replace 'rounded-2xl', 'rounded-[20px]'

  Set-Content $file.FullName $content -NoNewline -Encoding UTF8
  Write-Host "  -> Done"
}

Write-Host "All inner pages patched successfully."
