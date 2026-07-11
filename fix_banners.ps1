$ErrorActionPreference = "Stop"
$jsonFile = ".\js\projects-data.js"
$content = Get-Content $jsonFile -Raw
$startIdx = $content.IndexOf("const DEFAULT_PROJECTS = ") + 25
$endIdx = $content.IndexOf("];", $startIdx) + 1
$jsonStr = $content.Substring($startIdx, $endIdx - $startIdx)
$projects = $jsonStr | ConvertFrom-Json

foreach ($p in $projects) {
    $folder = ".\assets\projects\$($p.id)"
    if (Test-Path $folder) {
        $files = Get-ChildItem -Path $folder -File
        $fileNames = $files | Select-Object -ExpandProperty Name
        
        # Find best banner
        $banner = $fileNames | Where-Object { $_ -match "^banner\.(png|jpg|jpeg|gif)$" -or $_ -eq "banner image.png" } | Select-Object -First 1
        if (-not $banner) {
            $banner = $fileNames | Where-Object { $_ -match "1\.(png|jpg|jpeg)$" } | Select-Object -First 1
        }
        if (-not $banner -and $fileNames.Count -gt 0) {
            $banner = $fileNames | Where-Object { $_ -match "\.(png|jpg|jpeg|gif)$" } | Select-Object -First 1
        }
        
        if ($banner) {
            $p.bannerImage = "assets/projects/$($p.id)/$banner"
        }
        
        # Ensure video is picked up
        $video = $fileNames | Where-Object { $_ -match "\.mp4$" } | Select-Object -First 1
        if ($video) {
            $p.videoUrl = "assets/projects/$($p.id)/$video"
        }
    }
}

$newJsonStr = $projects | ConvertTo-Json -Depth 10
$newContent = $content.Substring(0, $startIdx) + $newJsonStr + $content.Substring($endIdx)
$newContent | Set-Content $jsonFile -Encoding UTF8

# Bump localStorage version again so changes are picked up
$newContent = Get-Content $jsonFile -Raw
$newContent = $newContent -replace 'sandeep_projects_v17', 'sandeep_projects_v18'
$newContent | Set-Content $jsonFile -Encoding UTF8

Write-Host "Updated projects-data.js banners perfectly."
