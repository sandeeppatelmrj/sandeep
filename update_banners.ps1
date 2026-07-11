$pData = Get-Content 'js/projects-data.js' -Raw -Encoding UTF8
$startIdx = $pData.IndexOf('const DEFAULT_PROJECTS = ') + 25
$endIdx = $pData.IndexOf('];', $startIdx) + 1
$projects = $pData.Substring($startIdx, $endIdx - $startIdx) | ConvertFrom-Json

foreach ($p in $projects) {
    if ($p.id -eq 'shree-jugal-kishore-jewellers') {
        $p.bannerImage = "assets/projects/shree-jugal-kishore-jewellers/card ke liye use karna ese.jpg"
        $p.videoUrl = "assets/projects/shree-jugal-kishore-jewellers/banner.jpg"
    }
    elseif ($p.id -eq 'ravidas-museum') {
        $p.bannerImage = "assets/projects/ravidas-museum/banner image.png"
    }
    elseif ($p.id -eq 'all-work') {
        $p.bannerImage = "assets/projects/all-work/card ke liye use karna.jpg"
        $p.videoUrl = "assets/projects/all-work/banner.jpg"
    }
    elseif ($p.id -eq 'coffee-india') {
        $p.bannerImage = "assets/projects/coffee-india/banner.png"
        $p.videoUrl = "assets/projects/coffee-india/BANNEr.mp4"
    }
    elseif ($p.id -eq 'dettol') {
        $p.bannerImage = "assets/projects/dettol/card ke liye use karlo.gif"
        $p.videoUrl = "assets/projects/dettol/banner.gif"
    }
    elseif ($p.id -eq 'goldee-masale') {
        $p.title = "Goldiee Masale"
    }
}

$newJsonStr = $projects | ConvertTo-Json -Depth 10
$pData = $pData.Substring(0, $startIdx) + $newJsonStr + $pData.Substring($endIdx)
$pData = $pData -replace 'sandeep_projects_v\d+', 'sandeep_projects_v17'
Set-Content 'js/projects-data.js' $pData -Encoding UTF8

$cms = Get-Content 'js/cms-core.js' -Raw -Encoding UTF8
$cms = $cms -replace 'sandeep_projects_v\d+', 'sandeep_projects_v17'
Set-Content 'js/cms-core.js' $cms -Encoding UTF8

$htmls = Get-ChildItem -Filter '*.html'
foreach ($h in $htmls) {
    $hc = Get-Content $h.FullName -Raw -Encoding UTF8
    $hc = $hc -replace 'projects-data\.js\?v=\d+', 'projects-data.js?v=17'
    Set-Content $h.FullName $hc -Encoding UTF8
}
Write-Host "Updated projects-data.js and bumped version to v17"
