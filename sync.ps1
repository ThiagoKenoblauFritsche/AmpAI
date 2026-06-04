Write-Host "[AmpAI] Puxando atualizacoes de engenharia do GitHub..." -ForegroundColor Cyan
git fetch origin main
git reset --hard origin/main

# =========================================================================
# 0. Definição de Rotas Base
# =========================================================================
$targetFolder = "G:\Meu Drive\AmpAI_NotebookLM"

# =========================================================================
# 1. Fluxo Automático do Mapa de Contratos
# =========================================================================
$sourceContratos = ".\AmpAI_Contratos_E_Estrutura_De_Codigo.txt"
$destContratos = Join-Path -Path $targetFolder -ChildPath "AmpAI_Contratos_E_Estrutura_De_Codigo.txt"

if (Test-Path $sourceContratos) {
    Write-Host "[AmpAI] Sincronizando Mapa de Contratos no Google Drive..." -ForegroundColor Blue
    Copy-Item -Path $sourceContratos -Destination $destContratos -Force
}

# =========================================================================
# 2. Fluxo Automático do README.md para o NotebookLM
# =========================================================================
$sourceReadme = ".\README.md"
$destReadme = Join-Path -Path $targetFolder -ChildPath "README.txt"

if (Test-Path $sourceReadme) {
    Write-Host "[AmpAI] Convertendo e exportando README.md para o Google Drive..." -ForegroundColor Yellow
    Copy-Item -Path $sourceReadme -Destination $destReadme -Force
}

# =========================================================================
# 3. Fluxo Automático: Matriz de Governança e Mentes dos Agentes
# =========================================================================
$agentsFolder = ".\.github\workflows"

$filesToSync = @(
    "AGENTS.md", 
    ".CEO.txt", 
    ".CTO.txt", 
    ".Engenheiro Eletricista.txt", 
    ".Hermes Executive Dev.txt", 
    ".Senior QA-Security.txt"
)

Write-Host "[AmpAI] Sincronizando Matriz de Governanca Multi-Agentes para o Google Drive..." -ForegroundColor Magenta

foreach ($file in $filesToSync) {
    $sourcePath = Join-Path -Path $agentsFolder -ChildPath $file
    
    if (Test-Path $sourcePath) {
        $destName = $file.Replace(".md", ".txt")
        $destPath = Join-Path -Path $targetFolder -ChildPath $destName
        
        # A MÁGICA: Usar Copy-Item faz uma cópia bruta (byte-for-byte), preservando 100% da acentuação.
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host " -> Espelhado com sucesso: $destName" -ForegroundColor DarkGray
    } else {
        Write-Host " [Aviso] Arquivo não encontrado: $sourcePath" -ForegroundColor Yellow
    }
}

Write-Host "[AmpAI] Loop Semantico Trilateral Concluido! Ecossistema 100/100 atualizado." -ForegroundColor Green
