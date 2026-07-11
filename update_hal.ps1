$ErrorActionPreference = "Stop"

try {
    $jsonFile = ".\js\projects-data.js"
    $content = Get-Content $jsonFile -Raw

    $startIdx = $content.IndexOf("const DEFAULT_PROJECTS = ") + 25
    $endIdx = $content.IndexOf("];", $startIdx) + 1

    $jsonStr = $content.Substring($startIdx, $endIdx - $startIdx)
    $projects = $jsonStr | ConvertFrom-Json

    foreach ($p in $projects) {
        if ($p.id -eq "hal-museum") {
            $p.subtitle = "Museum & Experience Design"
            $p.order = 2
            $p.tags = "museum, interaction, visual-layout, spatial, experience, exhibition"
            
            if (-not $p.PSObject.Properties.Match('shortDescription')) { $p | Add-Member -MemberType NoteProperty -Name 'shortDescription' -Value '' }
            if (-not $p.PSObject.Properties.Match('about')) { $p | Add-Member -MemberType NoteProperty -Name 'about' -Value '' }
            if (-not $p.PSObject.Properties.Match('approach')) { $p | Add-Member -MemberType NoteProperty -Name 'approach' -Value '' }
            if (-not $p.PSObject.Properties.Match('conclusion')) { $p | Add-Member -MemberType NoteProperty -Name 'conclusion' -Value '' }
            if (-not $p.PSObject.Properties.Match('roles')) { $p | Add-Member -MemberType NoteProperty -Name 'roles' -Value @() }

            $p.shortDescription = "Interactive exhibition experience design celebrating aviation heritage and technology integration."
            $p.about = "The HAL Heritage Museum project aimed to display historic aviation milestones in a modern, interactive museum environment. We needed to create visitor flow models and conceptual layouts that respect historical accuracy while engaging next-gen visitors."
            $p.approach = "Leveraged layout precision and generative AI for pre-visualization of exhibition halls. Created structured graphic boards, interactive touch interfaces, and spatial visual flow charts."
            $p.conclusion = "Designed and planned multiple exhibition bays with immersive visual narratives, leading to a highly praised visitor layout approved by heritage curators."
            $p.roles = @("Museum Experience Designer", "Lead Layout Artist", "Exhibition Planner")
            
            $p.isFeatured = $true
            $p.title = "HAL Heritage Museum"
            $p.ctaLabel = "View Case Study"
        }
    }

    $newJsonStr = $projects | ConvertTo-Json -Depth 10
    $newContent = $content.Substring(0, $startIdx) + $newJsonStr + $content.Substring($endIdx)

    $newContent | Set-Content $jsonFile -Encoding UTF8
    Write-Host "Updated HAL Museum properly"
} catch {
    Write-Host "Error: $_"
}
