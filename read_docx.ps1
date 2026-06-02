$cwd = Get-Location
# Tim file docx cua hop dong doi tac can ra soat (loai tru cac file template va thu muc giai nen)
$inputFile = Get-ChildItem -Path $cwd -Filter "*.docx" -Recurse | Where-Object { $_.Name -notlike "*20241105*" -and $_.FullName -notlike "*extracted*" -and $_.FullName -notlike "*\temp\*" -and $_.FullName -notlike "*standard_templates*" -and $_.FullName -notlike "*webapp*" } | Select-Object -First 1

$tempDir = "$PSScriptRoot\temp"
if (!(Test-Path -Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
}

if ($inputFile) {
    Copy-Item -Path $inputFile.FullName -Destination "$tempDir\contract.zip" -Force
    Expand-Archive -Path "$tempDir\contract.zip" -DestinationPath "$tempDir\extracted_docx" -Force -ErrorAction SilentlyContinue
    if (Test-Path -Path "$tempDir\extracted_docx\word\document.xml") {
        [xml]$xml = Get-Content -Raw -Encoding utf8 "$tempDir\extracted_docx\word\document.xml"
        $xml.document.body.p | ForEach-Object { $_.InnerText } | Out-File "$tempDir\plain_text.txt" -Encoding utf8
    } else {
        Write-Error "Khong tim thay file document.xml trong file hop dong trich xuat."
    }
} else {
    Write-Error "Khong tim thay file hop dong can quet (.docx) trong thu muc."
}
