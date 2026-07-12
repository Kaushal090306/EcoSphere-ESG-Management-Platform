# Add dark: variants to ALL inner page content files
# Handles: bg-white, text-[#09090b], bg-[#f4f4f5], border-[#ececee], hover states, etc.

$files = Get-ChildItem 'src' -Recurse -Filter '*.tsx'

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  $original = $content
  
  # ─── BACKGROUNDS ────────────────────────────────────────────────────────────

  # bg-white → add dark:bg-[#18181b] (card surfaces)
  $content = $content -replace '\bbg-white\b(?! dark:)', 'bg-white dark:bg-[#18181b]'

  # bg-[#fafafa] → add dark:bg-[#18181b]
  $content = $content -replace '\bbg-\[#fafafa\]\b(?! dark:)', 'bg-[#fafafa] dark:bg-[#18181b]'

  # bg-[#f4f4f5] → add dark:bg-[#27272a] (muted / recessed)
  $content = $content -replace '\bbg-\[#f4f4f5\]\b(?! dark:)', 'bg-[#f4f4f5] dark:bg-[#27272a]'

  # ─── BORDERS ────────────────────────────────────────────────────────────────

  # border-[#ececee] → add dark:border-[#27272a]
  $content = $content -replace '\bborder-\[#ececee\]\b(?! dark:)', 'border-[#ececee] dark:border-[#27272a]'

  # ─── TEXT COLORS ─────────────────────────────────────────────────────────────

  # text-[#09090b] → add dark:text-[#fafafa]
  $content = $content -replace '\btext-\[#09090b\]\b(?! dark:)', 'text-[#09090b] dark:text-[#fafafa]'

  # text-[#18181b] → add dark:text-[#e4e4e7]
  $content = $content -replace '\btext-\[#18181b\]\b(?! dark:)', 'text-[#18181b] dark:text-[#e4e4e7]'

  # text-[#52525b] → add dark:text-[#a1a1aa]
  $content = $content -replace '\btext-\[#52525b\]\b(?! dark:)', 'text-[#52525b] dark:text-[#a1a1aa]'

  # ─── HOVER STATES ────────────────────────────────────────────────────────────

  # hover:bg-[#f4f4f5] → add dark:hover:bg-[#27272a]
  $content = $content -replace '\bhover:bg-\[#f4f4f5\]\b(?! dark:)', 'hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]'

  # hover:bg-white → add dark:hover:bg-[#27272a]
  $content = $content -replace '\bhover:bg-white\b(?! dark:)', 'hover:bg-white dark:hover:bg-[#27272a]'

  # hover:border-[#ececee] → add dark:hover:border-[#3f3f46]
  $content = $content -replace '\bhover:border-\[#ececee\]\b(?! dark:)', 'hover:border-[#ececee] dark:hover:border-[#3f3f46]'

  # hover:border-[#d4d4d8] → add dark:hover:border-[#3f3f46]
  $content = $content -replace '\bhover:border-\[#d4d4d8\]\b(?! dark:)', 'hover:border-[#d4d4d8] dark:hover:border-[#3f3f46]'

  # ─── SHADOW / FOCUS RING ─────────────────────────────────────────────────────

  # ring-white → add dark:ring-[#18181b]
  $content = $content -replace '\bring-white\b(?! dark:)', 'ring-white dark:ring-[#18181b]'

  # ─── CHART / RECHARTS inline styles ──────────────────────────────────────────
  # These can't easily be dark: via Tailwind, will leave as-is
  # (Recharts doesn't support dark: classes in JSX style props)

  if ($content -ne $original) {
    Write-Host "Patched: $($file.Name)"
    Set-Content $file.FullName $content -NoNewline -Encoding UTF8
  }
}

Write-Host "`nAll files patched with dark: variants!"
