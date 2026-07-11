$allProjDir = 'all project'
$destAssetsDir = 'assets/projects'

$newProjects = @()
$dirs = Get-ChildItem $allProjDir -Directory

foreach ($d in $dirs) {
    $slug = $d.Name.ToLower() -replace '[^a-z0-9]+', '-' -replace '^-|-$', ''
    $dest = Join-Path $destAssetsDir $slug
    
    if (-not (Test-Path $dest)) {
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
    }
    
    $files = Get-ChildItem $d.FullName
    $images = @()
    $bannerImage = ''
    $videoUrl = ''
    
    foreach ($f in $files) {
        $srcPath = $f.FullName
        $destPath = Join-Path $dest $f.Name
        Copy-Item $srcPath -Destination $destPath -Force
        
        $urlPath = "assets/projects/$slug/$($f.Name)"
        
        if ($f.Name -match '(?i)^banner\.mp4$') {
            $videoUrl = $urlPath
        } elseif ($f.Name -match '(?i)^banner\.(jpg|png)$') {
            $bannerImage = $urlPath
        } elseif ($f.Name -match '(?i)\.(jpg|jpeg|png|mp4)$') {
            $images += $urlPath
        }
    }
    
    $projObj = @{
        id = $slug
        title = $d.Name
        subtitle = "Project Update"
        tags = "design, architecture, art"
        ctaLabel = "View Project"
        ctaHref = "project-detail.html?id=$slug"
        bannerImage = $bannerImage
        videoUrl = $videoUrl
        images = $images
        isFeatured = $false
        order = 10
    }
    $newProjects += $projObj
}

$pData = Get-Content 'js/projects-data.js' -Raw -Encoding UTF8
$startIdx = $pData.IndexOf('const DEFAULT_PROJECTS = ') + 25
$endIdx = $pData.IndexOf('];', $startIdx) + 1
$oldProjects = $pData.Substring($startIdx, $endIdx - $startIdx) | ConvertFrom-Json

foreach ($np in $newProjects) {
    $old = $oldProjects | Where-Object { $_.id -eq $np.id -or $_.title -eq $np.title } | Select-Object -First 1
    if ($old) {
        $np.title = $old.title
        if ($old.subtitle) { $np.subtitle = $old.subtitle }
        if ($old.tags) { $np.tags = $old.tags }
        if ($old.shortDescription) { $np.shortDescription = $old.shortDescription }
        if ($old.about) { $np.about = $old.about }
        if ($old.roles) { $np.roles = $old.roles }
        if ($old.isFeatured) { $np.isFeatured = $old.isFeatured }
        if ($old.order) { $np.order = $old.order }
        
        if ($np.bannerImage -eq '' -and $old.bannerImage) { $np.bannerImage = $old.bannerImage }
        if ($np.videoUrl -eq '' -and $old.videoUrl) { $np.videoUrl = $old.videoUrl }
    }
}

$newJsonStr = $newProjects | ConvertTo-Json -Depth 10
$pData = $pData.Substring(0, $startIdx) + $newJsonStr + $pData.Substring($endIdx)
$pData = $pData -replace 'sandeep_projects_v\d+', 'sandeep_projects_v16'
Set-Content 'js/projects-data.js' $pData -Encoding UTF8

$cms = Get-Content 'js/cms-core.js' -Raw -Encoding UTF8
$cms = $cms -replace 'sandeep_projects_v\d+', 'sandeep_projects_v16'
Set-Content 'js/cms-core.js' $cms -Encoding UTF8

$htmls = Get-ChildItem -Filter '*.html'
foreach ($h in $htmls) {
    $hc = Get-Content $h.FullName -Raw -Encoding UTF8
    $hc = $hc -replace 'projects-data\.js\?v=\d+', 'projects-data.js?v=16'
    Set-Content $h.FullName $hc -Encoding UTF8
}

$galFiles = Get-ChildItem 'GALLERY IMAGES' | Where-Object { $_.Name -match '(?i)\.(jpg|jpeg|png|webp)$' }
$galPhotos = @()
foreach ($gf in $galFiles) {
    $galPhotos += @{
        title = $gf.BaseName
        url = "GALLERY IMAGES/$([uri]::EscapeDataString($gf.Name))"
    }
}

$gHtml = Get-Content 'gallery.html' -Raw -Encoding UTF8
$gStart = $gHtml.IndexOf('const GALLERY_PHOTOS = [')
$gEnd = $gHtml.IndexOf('];', $gStart) + 2
$newGStr = 'const GALLERY_PHOTOS = ' + ($galPhotos | ConvertTo-Json -Depth 10) + ';'
$gHtml = $gHtml.Substring(0, $gStart) + $newGStr + $gHtml.Substring($gEnd)
Set-Content 'gallery.html' $gHtml -Encoding UTF8

Write-Host "Update completed successfully"
