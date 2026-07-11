param (
    [string]$SourceFolder = ".\assets\projects",
    [long]$Quality = 75
)

Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path $SourceFolder -Recurse -Include *.png

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

$totalFiles = $files.Count
$current = 0
$savedBytes = 0

foreach ($file in $files) {
    $current++
    
    $destFilePath = [System.IO.Path]::ChangeExtension($file.FullName, ".jpg")
    Write-Host "[$current/$totalFiles] Converting: $($file.Name)"
    
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
        $bmp.SetResolution($img.HorizontalResolution, $img.VerticalResolution)
        
        $graphics = [System.Drawing.Graphics]::FromImage($bmp)
        
        # Fill background with white to avoid black transparency
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.DrawImage($img, 0, 0, $img.Width, $img.Height)
        
        $bmp.Save($destFilePath, $jpegCodec, $encoderParams)
        
        $graphics.Dispose()
        $bmp.Dispose()
        $img.Dispose()
        
        $oldSize = $file.Length
        $newSize = (Get-Item $destFilePath).Length
        $savedBytes += ($oldSize - $newSize)
        
        # Delete original PNG
        Remove-Item $file.FullName -Force
    } catch {
        Write-Host "   -> Error processing $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host "Done converting! Saved an additional $([math]::Round($savedBytes/1MB, 2)) MB." -ForegroundColor Green

# Update projects-data.js
Write-Host "Updating projects-data.js to replace .png with .jpg..."
$jsonPath = ".\js\projects-data.js"
$content = Get-Content $jsonPath -Raw
$content = $content -ireplace '\.png"', '.jpg"'
$content = $content -ireplace '\.png\?', '.jpg?'
Set-Content -Path $jsonPath -Value $content -Encoding UTF8
Write-Host "Database updated successfully!"
