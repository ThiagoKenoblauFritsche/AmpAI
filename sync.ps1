$ErrorActionPreference = "Stop"

$Source = $PSScriptRoot
$Destination = "G:\Meu Drive\AmpAI_NotebookLM"
$TempStaging = Join-Path $Source ".sync_temp"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   Iniciando Sincronizacao AmpAI -> NotebookLM       " -ForegroundColor Cyan
Write-Host "   (Modo de Conversão Automática para .TXT)          " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Cria a pasta temporária de Staging (invisível pro Git)
if (!(Test-Path $TempStaging)) {
    New-Item -ItemType Directory -Path $TempStaging | Out-Null
}

$FoldersToSync = @("docs", ".github", "js")

Write-Host "[1/3] Clonando arquivos originais para o Staging..." -ForegroundColor Yellow
foreach ($folder in $FoldersToSync) {
    $SourceFolder = Join-Path $Source $folder
    $TempFolder = Join-Path $TempStaging $folder
    
    if (Test-Path $SourceFolder) {
        # O Robocopy copia o arquivo mantendo a data original de modificação (CRUCIAL para a nuvem não fazer re-upload inútil)
        $robocopyArgs = @($SourceFolder, $TempFolder, "/MIR", "/R:0", "/W:0", "/NP", "/NDL", "/NFL", "/NJH", "/NJS")
        & robocopy $robocopyArgs | Out-Null
    }
}

# Arquivos da Raiz (.md)
$robocopyArgsRoot = @($Source, $TempStaging, "*.md", "/R:0", "/W:0", "/NP", "/NDL", "/NFL", "/NJH", "/NJS")
& robocopy $robocopyArgsRoot | Out-Null


Write-Host "[2/3] Convertendo extensoes para .TXT (Exigencia NotebookLM)..." -ForegroundColor Yellow
# Procura todos os arquivos na pasta temporária que NÃO são .txt e renomeia.
# O Rename-Item no Windows preserva a data original do arquivo.
Get-ChildItem -Path $TempStaging -Recurse -File | Where-Object { $_.Extension -ne ".txt" } | ForEach-Object {
    $newName = [io.path]::ChangeExtension($_.Name, ".txt")
    $newPath = Join-Path $_.DirectoryName $newName
    if (Test-Path -LiteralPath $newPath) {
        Remove-Item -LiteralPath $newPath -Force
    }
    Rename-Item -Path $_.FullName -NewName $newName -Force
}


Write-Host "[3/3] Sincronizando Staging (.txt) com o Google Drive..." -ForegroundColor Yellow
if (!(Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination | Out-Null
}

# Agora fazemos o espelhamento oficial pro Drive. Como as datas de modificação foram mantidas, 
# o Robocopy SÓ vai fazer upload pro Google Drive daquilo que você realmente alterou no código!
$robocopyArgsFinal = @($TempStaging, $Destination, "/MIR", "/R:0", "/W:0", "/NP", "/NDL", "/NFL", "/NJH", "/NJS")
& robocopy $robocopyArgsFinal | Out-Null


Write-Host "=====================================================" -ForegroundColor Green
Write-Host " Sincronizacao concluida com sucesso!" -ForegroundColor Green
Write-Host " Todos os arquivos foram injetados no Drive como .TXT" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
