param (
    [string]$SourceFolder = ".\assets\projects",
    [string]$DestFolder = ".\assets\projects_optimized",
    [int]$MaxWidth = 1920,
    [long]$Quality = 75
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -Path $DestFolder)) {
    New-Item -ItemType Directory -Path $DestFolder | Out-Null
}

$files = Get-ChildItem -Path $SourceFolder -Recurse -Include *.jpg,*.jpeg,*.png

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

$totalFiles = $files.Count
$current = 0
$savedBytes = 0

foreach ($file in $files) {
    $current++
    
    $relativePath = $file.FullName.Substring((Get-Item $SourceFolder).FullName.Length + 1)
    $destFilePath = Join-Path $DestFolder $relativePath
    $destDir = Split-Path $destFilePath -Parent
    
    if (-not (Test-Path -Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir | Out-Null
    }

    Write-Host "[$current/$totalFiles] Processing: $relativePath"
    
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        $newWidth = $img.Width
        $newHeight = $img.Height
        
        if ($img.Width -gt $MaxWidth) {
            $newWidth = $MaxWidth
            $newHeight = [math]::Round(($MaxWidth / $img.Width) * $img.Height)
        }
        
        $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $bmp.SetResolution($img.HorizontalResolution, $img.VerticalResolution)
        
        $graphics = [System.Drawing.Graphics]::FromImage($bmp)
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        
        # Fill background with white in case of transparent PNG being saved as JPG (though we save PNG as PNG, but just safe)
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
        
        if ($file.Extension.ToLower() -eq ".png") {
            $bmp.Save($destFilePath, [System.Drawing.Imaging.ImageFormat]::Png)
        } else {
            $bmp.Save($destFilePath, $jpegCodec, $encoderParams)
        }
        
        $graphics.Dispose()
        $bmp.Dispose()
        $img.Dispose()
        
        $oldSize = $file.Length
        $newSize = (Get-Item $destFilePath).Length
        $savedBytes += ($oldSize - $newSize)
    } catch {
        Write-Host "   -> Error processing $($file.Name): $_" -ForegroundColor Red
        Copy-Item $file.FullName -Destination $destFilePath -Force
    }
}

# Copy over other non-image files (like .mp4 videos)
Write-Host "Copying videos and other files..."
$otherFiles = Get-ChildItem -Path $SourceFolder -Recurse -Exclude *.jpg,*.jpeg,*.png
foreach ($file in $otherFiles) {
    if (-not $file.PSIsContainer) {
        $relativePath = $file.FullName.Substring((Get-Item $SourceFolder).FullName.Length + 1)
        $destFilePath = Join-Path $DestFolder $relativePath
        $destDir = Split-Path $destFilePath -Parent
        if (-not (Test-Path -Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }
        Copy-Item $file.FullName -Destination $destFilePath -Force
    }
}

Write-Host "Done! Saved a total of $([math]::Round($savedBytes/1MB, 2)) MB." -ForegroundColor Green

Write-Host "Swapping folders..."
Rename-Item -Path $SourceFolder -NewName "projects_heavy_backup"
Rename-Item -Path $DestFolder -NewName "projects"
Write-Host "All finished successfully!"
