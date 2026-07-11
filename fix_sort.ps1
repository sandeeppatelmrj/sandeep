$json = Get-Content 'js/projects-data.js' -Raw -Encoding UTF8
$startIdx = $json.IndexOf('const DEFAULT_PROJECTS = ') + 25
$endIdx = $json.IndexOf('];', $startIdx) + 1
$projectsJson = $json.Substring($startIdx, $endIdx - $startIdx)
$projects = $projectsJson | ConvertFrom-Json

foreach ($p in $projects) {
    if ($p.id -eq 'coffee-india') {
        $p.images = $p.images | Sort-Object { 
            $name = [System.IO.Path]::GetFileNameWithoutExtension($_)
            if ($name -match '^(\d+)') {
                [int]$matches[1]
            } else {
                999999
            }
        }, { $_ }
    }
}

$newJson = $projects | ConvertTo-Json -Depth 10
$json = $json.Substring(0, $startIdx) + $newJson + $json.Substring($endIdx)
$json = $json -replace 'sandeep_projects_v\d+', 'sandeep_projects_v36'
Set-Content 'js/projects-data.js' $json -Encoding UTF8
Write-Host "Fixed sorting for coffee-india"
