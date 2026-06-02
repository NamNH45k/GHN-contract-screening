Add-Type -AssemblyName System.IO.Compression.FileSystem

$tempDir = "$PSScriptRoot\temp"
$standardTemplatesDir = Join-Path $PSScriptRoot "webapp\standard_templates"

if (!(Test-Path -Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
}

Write-Host "Scanning standard templates in $standardTemplatesDir ..."
$subdirs = Get-ChildItem -LiteralPath $standardTemplatesDir -Directory

foreach ($dir in $subdirs) {
    $dirName = $dir.Name.ToLower()
    Write-Host "Checking directory: $dirName"
    
    # 1. Hợp đồng khách hàng (matches "khách hàng" -> kh and h)
    if ($dirName -like "*kh*h*") {
        $files = Get-ChildItem -LiteralPath $dir.FullName -Filter "*.docx" -Recurse
        foreach ($file in $files) {
            $fullName = $file.FullName.ToLower()
            $name = $file.Name.ToLower()
            
            if ($fullName -like "*b2b*") {
                $key = "finetoday"
            }
            elseif ($fullName -like "*non-ecom*" -or $fullName -like "*non_ecom*") {
                $key = "non_ecom"
            }
            elseif ($fullName -like "*sme*" -and $name -like "*03*") {
                $key = "khach_hang"
            }
            else {
                $key = $null
            }
            
            if ($key) {
                $outputPath = Join-Path $tempDir "$key.txt"
                Write-Host "Extracting $key from $($file.FullName) ..."
                $archive = [System.IO.Compression.ZipFile]::OpenRead($file.FullName)
                $entry = $archive.GetEntry("word/document.xml")
                if ($entry) {
                    $stream = $entry.Open()
                    $reader = New-Object System.IO.StreamReader($stream)
                    $xmlText = $reader.ReadToEnd()
                    $reader.Close()
                    $stream.Close()
                    [xml]$xml = $xmlText
                    $xml.document.body.p | ForEach-Object { $_.InnerText } | Out-File $outputPath -Encoding utf8
                    Write-Host "Successfully extracted to $outputPath"
                }
                $archive.Dispose()
            }
        }
    }
    
    # 2. Hợp đồng thuê KTC KCT (matches "ktc" or "kct")
    elseif ($dirName -like "*ktc*" -or $dirName -like "*kct*") {
        $file = Get-ChildItem -LiteralPath $dir.FullName -Filter "*.docx" -Recurse | Where-Object { $_.Name -like "*có cọc*" -or $_.Name -like "*co c*" -or $_.Name -like "*c_c*" } | Select-Object -First 1
        if (!$file) {
            $file = Get-ChildItem -LiteralPath $dir.FullName -Filter "*.docx" -Recurse | Select-Object -First 1
        }
        if ($file) {
            $outputPath = Join-Path $tempDir "ktc.txt"
            Write-Host "Extracting ktc from $($file.FullName) ..."
            $archive = [System.IO.Compression.ZipFile]::OpenRead($file.FullName)
            $entry = $archive.GetEntry("word/document.xml")
            if ($entry) {
                $stream = $entry.Open()
                $reader = New-Object System.IO.StreamReader($stream)
                $xmlText = $reader.ReadToEnd()
                $reader.Close()
                $stream.Close()
                [xml]$xml = $xmlText
                $xml.document.body.p | ForEach-Object { $_.InnerText } | Out-File $outputPath -Encoding utf8
                Write-Host "Successfully extracted to $outputPath"
            }
            $archive.Dispose()
        }
    }
    
    # 3. Hợp đồng thuê kho bưu cục (matches "kho")
    elseif ($dirName -like "*kho*") {
        $file = Get-ChildItem -LiteralPath $dir.FullName -Filter "*.docx" -Recurse | Where-Object { $_.Name -like "*có cọc*" -or $_.Name -like "*co c*" -or $_.Name -like "*20241105*" } | Select-Object -First 1
        if (!$file) {
            $file = Get-ChildItem -LiteralPath $dir.FullName -Filter "*.docx" -Recurse | Select-Object -First 1
        }
        if ($file) {
            $outputPath = Join-Path $tempDir "buu_cuc.txt"
            Write-Host "Extracting buu_cuc from $($file.FullName) ..."
            $archive = [System.IO.Compression.ZipFile]::OpenRead($file.FullName)
            $entry = $archive.GetEntry("word/document.xml")
            if ($entry) {
                $stream = $entry.Open()
                $reader = New-Object System.IO.StreamReader($stream)
                $xmlText = $reader.ReadToEnd()
                $reader.Close()
                $stream.Close()
                [xml]$xml = $xmlText
                $xml.document.body.p | ForEach-Object { $_.InnerText } | Out-File $outputPath -Encoding utf8
                Write-Host "Successfully extracted to $outputPath"
            }
            $archive.Dispose()
        }
    }
    
    # 4. Hợp đồng thuê tải (matches "t" and "i" -> "tải")
    elseif ($dirName -like "*t*i*") {
        $file = Get-ChildItem -LiteralPath $dir.FullName -Filter "*.docx" -Recurse | Select-Object -First 1
        if ($file) {
            $outputPath = Join-Path $tempDir "tai.txt"
            Write-Host "Extracting tai from $($file.FullName) ..."
            $archive = [System.IO.Compression.ZipFile]::OpenRead($file.FullName)
            $entry = $archive.GetEntry("word/document.xml")
            if ($entry) {
                $stream = $entry.Open()
                $reader = New-Object System.IO.StreamReader($stream)
                $xmlText = $reader.ReadToEnd()
                $reader.Close()
                $stream.Close()
                [xml]$xml = $xmlText
                $xml.document.body.p | ForEach-Object { $_.InnerText } | Out-File $outputPath -Encoding utf8
                Write-Host "Successfully extracted to $outputPath"
            }
            $archive.Dispose()
        }
    }
}
