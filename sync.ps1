@'
Write-Host "[AmpAI] Puxando atualizacoes de engenharia do GitHub..." -ForegroundColor Cyan
git fetch origin main
git reset --hard origin/main

# =========================================================================
# 0. Definição de Rotas Base
# =========================================================================
# Ajuste aqui caso a letra do seu Google Drive mude no futuro
$targetFolder = "G:\Meu Drive\AmpAI_NotebookLM"

# =========================================================================
# 1. Fluxo Automático do Mapa de Contratos
# =========================================================================
$sourceContratos = ".\AmpAI_Contratos_E_Estrutura_De_Codigo.txt"
$destContratos = Join-Path -Path $targetFolder -ChildPath "AmpAI_Contratos_E_Estrutura_De_Codigo.txt"

if (Test-Path $sourceContratos) {
    Write-Host "[AmpAI] Sincronizando Mapa de Contratos no Google Drive..." -ForegroundColor Blue
    Get-Content -LiteralPath $sourceContratos | Out-File -FilePath $destContratos -Encoding utf8 -Force
}

# =========================================================================
# 2. Fluxo Automático do README.md para o NotebookLM
# =========================================================================
$sourceReadme = ".\README.md"
$destReadme = Join-Path -Path $targetFolder -ChildPath "README.txt"

if (Test-Path $sourceReadme) {
    Write-Host "[AmpAI] Convertendo e exportando README.md para o Google Drive..." -ForegroundColor Yellow
    Get-Content -LiteralPath $sourceReadme | Out-File -FilePath $destReadme -Encoding utf8 -Force
}

# =========================================================================
# 3. Fluxo Automático: Matriz de Governança e Mentes dos Agentes
# =========================================================================
$agentsFolder = ".\.github\workflows"

# Lista dos arquivos da esteira v4.2
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
        # Converte a extensão .md para .txt no destino, mantendo os que já são .txt
        $destName = $file.Replace(".md", ".txt")
        $destPath = Join-Path -Path $targetFolder -ChildPath $destName
        
        # Copia forçando o Encoding UTF-8 para não quebrar acentuação no NotebookLM
        Get-Content -LiteralPath $sourcePath | Out-File -FilePath $destPath -Encoding utf8 -Force
        Write-Host " -> Espelhado com sucesso: $destName" -ForegroundColor DarkGray
    } else {
        Write-Host " [Aviso] Arquivo não encontrado: $sourcePath" -ForegroundColor Yellow
    }
}

Write-Host "[AmpAI] Loop Semantico Trilateral Concluido! Ecossistema 100/100 atualizado." -ForegroundColor Green
'@ | Out-File -FilePath sync.ps1 -Encoding utf8 -Force