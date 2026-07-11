$ErrorActionPreference = "Stop"

try {
    $jsonFile = ".\js\projects-data.js"
    $content = Get-Content $jsonFile -Raw

    $startIdx = $content.IndexOf("const DEFAULT_PROJECTS = ") + 25
    $endIdx = $content.IndexOf("];", $startIdx) + 1

    $jsonStr = $content.Substring($startIdx, $endIdx - $startIdx)
    $projects = $jsonStr | ConvertFrom-Json

    foreach ($p in $projects) {
        if ($p.id -eq "dinosaur-fossil-national-park") {
            $p.title = "Dinosaur Fossil National Park"
        }
    }

    $newJsonStr = $projects | ConvertTo-Json -Depth 10
    $newContent = $content.Substring(0, $startIdx) + $newJsonStr + $content.Substring($endIdx)

    $newContent | Set-Content $jsonFile -Encoding UTF8
    Write-Host "Updated Dinosaur Fossil properly"
} catch {
    Write-Host "Error: $_"
}
