$root = $PSScriptRoot
$port = 3000

# Stop any existing TcpListener on port 3000
try {
    $existing = Get-Process -Id (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue
    if ($existing) {
        Stop-Process -Id $existing.Id -Force
        Start-Sleep -Seconds 1
    }
} catch {}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::IPv6Any, $port)
$listener.Server.DualMode = $true
$listener.Start()

$url = "http://localhost:$port/"
Write-Host ""
Write-Host "  =========================================="
Write-Host "  Server running at: $url"
Write-Host "  Open your browser and go to:"
Write-Host "  http://localhost:$port or http://127.0.0.1:$port"
Write-Host "  Press Ctrl+C in this window to stop."
Write-Host "  =========================================="
Write-Host ""

Start-Process $url

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream)
        
        # Read request line
        $requestLine = $reader.ReadLine()
        if ($null -ne $requestLine) {
            $parts = $requestLine.Split(" ")
            if ($parts.Length -ge 2) {
                $method = $parts[0]
                $urlPath = $parts[1]
                
                # Strip query parameters for local file path matching
                $fileUrl = $urlPath
                if ($fileUrl.Contains("?")) {
                    $fileUrl = $fileUrl.Split("?")[0]
                }
                
                if ($fileUrl -eq "/") { $fileUrl = "/index.html" }
                $filePath = $root + $fileUrl.Replace("/", "\")
                
                $writer = [System.IO.StreamWriter]::new($stream)
                $writer.AutoFlush = $true
                
                if (Test-Path $filePath -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $mime = switch ($ext) {
                        ".html"  { "text/html; charset=utf-8" }
                        ".css"   { "text/css; charset=utf-8" }
                        ".js"    { "application/javascript; charset=utf-8" }
                        ".json"  { "application/json" }
                        ".png"   { "image/png" }
                        ".jpg"   { "image/jpeg" }
                        ".jpeg"  { "image/jpeg" }
                        ".gif"   { "image/gif" }
                        ".svg"   { "image/svg+xml" }
                        ".ico"   { "image/x-icon" }
                        ".mp4"   { "video/mp4" }
                        ".webm"  { "video/webm" }
                        default  { "application/octet-stream" }
                    }
                    
                    $writer.WriteLine("HTTP/1.1 200 OK")
                    $writer.WriteLine("Content-Type: $mime")
                    $writer.WriteLine("Content-Length: $($bytes.Length)")
                    $writer.WriteLine("Connection: close")
                    $writer.WriteLine()
                    
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $notFoundPath = $root + "\404.html"
                    if (Test-Path $notFoundPath -PathType Leaf) {
                        $bytes404 = [System.IO.File]::ReadAllBytes($notFoundPath)
                        $writer.WriteLine("HTTP/1.1 404 Not Found")
                        $writer.WriteLine("Content-Type: text/html; charset=utf-8")
                        $writer.WriteLine("Content-Length: $($bytes404.Length)")
                        $writer.WriteLine("Connection: close")
                        $writer.WriteLine()
                        $stream.Write($bytes404, 0, $bytes404.Length)
                    } else {
                        $msg = "404 Not Found: $fileUrl"
                        $writer.WriteLine("HTTP/1.1 404 Not Found")
                        $writer.WriteLine("Content-Type: text/plain")
                        $writer.WriteLine("Content-Length: $($msg.Length)")
                        $writer.WriteLine("Connection: close")
                        $writer.WriteLine()
                        $writer.Write($msg)
                    }
                }
            }
        }
        $client.Close()
    } catch {
        # ignore connection exceptions
    }
}
