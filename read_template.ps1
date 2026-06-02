$cwd = Get-Location
$templateFile = Get-ChildItem -Path $cwd -Filter "*c*c*c_20241105.docx" -Recurse | Select-Object -First 1

$tempDir = "$PSScriptRoot\temp"
if (!(Test-Path -Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
}

if ($templateFile) {
    Copy-Item -Path $templateFile.FullName -Destination "$tempDir\template.zip" -Force
    Expand-Archive -Path "$tempDir\template.zip" -DestinationPath "$tempDir\extracted_template" -Force -ErrorAction SilentlyContinue
    if (Test-Path -Path "$tempDir\extracted_template\word\document.xml") {
        [xml]$xml = Get-Content "$tempDir\extracted_template\word\document.xml"
        $xml.document.body.InnerText | Out-File "$tempDir\template_text.txt" -Encoding utf8
    } else {
        Write-Error "Khong tim thay file document.xml trong file template trich xuat."
    }
} else {
    Write-Error "Khong tim thay file template (.docx) trong thu muc."
}
