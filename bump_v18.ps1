$pData = Get-Content 'js/projects-data.js' -Raw -Encoding UTF8
$pData = $pData -replace 'sandeep_projects_v17', 'sandeep_projects_v18'
Set-Content 'js/projects-data.js' $pData -Encoding UTF8

$cms = Get-Content 'js/cms-core.js' -Raw -Encoding UTF8
$cms = $cms -replace 'sandeep_projects_v17', 'sandeep_projects_v18'
Set-Content 'js/cms-core.js' $cms -Encoding UTF8

$htmls = Get-ChildItem -Filter '*.html'
foreach ($h in $htmls) {
    $hc = Get-Content $h.FullName -Raw -Encoding UTF8
    $hc = $hc -replace 'projects-data\.js\?v=17', 'projects-data.js?v=18'
    Set-Content $h.FullName $hc -Encoding UTF8
}
Write-Host "Bumped version to v18"
