$content = Get-Content ".\js\projects-data.js" -Raw
$start = $content.IndexOf("const DEFAULT_PROJECTS = ") + 25
$end = $content.IndexOf("];", $start) + 1
$json = $content.Substring($start, $end - $start)
$data = $json | ConvertFrom-Json
$data | Where-Object { $_.isFeatured -eq $true } | Select-Object id, title
