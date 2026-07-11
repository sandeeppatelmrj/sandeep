$content = Get-Content ".\js\projects-data.js" -Raw
$start = $content.IndexOf("const DEFAULT_PROJECTS = ") + 25
$end = $content.IndexOf("];", $start) + 1
$json = $content.Substring($start, $end - $start)
try {
    $data = $json | ConvertFrom-Json
    $data | Select-Object -Property id, title | Format-Table -AutoSize
} catch {
    Write-Host "Error parsing JSON:" $_
}
