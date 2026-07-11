$root = $PSScriptRoot
$port = 3333
$url  = "http://localhost:$port/"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host ""
Write-Host "  =============================="
Write-Host "  Server running at: $url"
Write-Host "  Open your browser and go to:"
Write-Host "  http://localhost:$port"
Write-Host "  Press Ctrl+C to stop."
Write-Host "  =============================="
Write-Host ""

Start-Process $url

while ($listener.IsListening) {
    try {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $res  = $ctx.Response

        $localPath = $req.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }

        $filePath = $root + $localPath.Replace("/", "\")

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext   = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime  = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                ".json" { "application/json" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                ".woff" { "font/woff" }
                ".woff2"{ "font/woff2" }
                ".pdf"  { "application/pdf" }
                default { "application/octet-stream" }
            }
            $res.ContentType      = $mime
            $res.ContentLength64  = $bytes.Length
            $res.StatusCode       = 200
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $notFoundPath = $root + "\404.html"
            if (Test-Path $notFoundPath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($notFoundPath)
                $res.ContentType      = "text/html; charset=utf-8"
                $res.ContentLength64  = $bytes.Length
                $res.StatusCode       = 404
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $msg   = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
                $res.StatusCode       = 404
                $res.ContentType      = "text/plain"
                $res.ContentLength64  = $msg.Length
                $res.OutputStream.Write($msg, 0, $msg.Length)
            }
        }

        $res.OutputStream.Close()
    } catch {
        # silently continue on client disconnect errors
    }
}
