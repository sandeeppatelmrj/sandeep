Add-Type -AssemblyName System.Drawing

$files = Get-ChildItem -Path "assets\projects" -Recurse -Include *.jpg, *.jpeg

foreach ($f in $files) {
    try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        # Check if CMYK (Flags bit 5 is ColorSpaceCmyk = 32)
        $isCmyk = ($img.Flags -band 32) -eq 32
        if ($isCmyk) {
            Write-Host "Converting CMYK to RGB: $($f.FullName)"
            $tempPath = $f.FullName + ".tmp.jpg"
            $img.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            $img.Dispose()
            Move-Item -Path $tempPath -Destination $f.FullName -Force
        } else {
            $img.Dispose()
        }
    } catch {
        Write-Host "Error processing $($f.FullName): $($_.Exception.Message)"
    }
}
