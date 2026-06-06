Write-Host "[AmpAI] Puxando atualizacoes do GitHub (VPS/Rua)..." -ForegroundColor Cyan
git fetch origin main
git reset --hard origin/main

# =========================================================================
# 0. Definição de Rotas Base
# =========================================================================
$targetFolder = "G:\Meu Drive\AmpAI_NotebookLM"
# Caminho EXATO da sua subpasta dedicada ao projeto no Obsidian
$obsidianAmpAIFolder = "C:\Users\ACER\Desktop\Thiago_2.0\03-Trabalho\200 Projetos Ativos\Principais\AmpAI"

# =========================================================================
# 1. Fluxo Automático do Mapa de Contratos e README
# =========================================================================
$sourceContratos = ".\AmpAI_Contratos_E_Estrutura_De_Codigo.txt"
if (Test-Path $sourceContratos) {
    Copy-Item -Path $sourceContratos -Destination (Join-Path $targetFolder "AmpAI_Contratos_E_Estrutura_De_Codigo.txt") -Force
}

$sourceReadme = ".\README.md"
if (Test-Path $sourceReadme) {
    Copy-Item -Path $sourceReadme -Destination (Join-Path $targetFolder "README.txt") -Force
}

# =========================================================================
# 2. Fluxo Automático: Matriz de Governança (Agentes)
# =========================================================================
$filesToSync = @("AGENTS.md", ".CEO.txt", ".CTO.txt", ".Engenheiro Eletricista.txt", ".Hermes Executive Dev.txt", ".Senior QA-Security.txt")
foreach ($file in $filesToSync) {
    $sourcePath = Join-Path -Path ".\.github\workflows" -ChildPath $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path -Path $targetFolder -ChildPath $file.Replace(".md", ".txt")
        # Cópia binária preserva UTF-8 integralmente
        Copy-Item -Path $sourcePath -Destination $destPath -Force 
    }
}

# =========================================================================
# 3. NOVO: Fluxo Inverso - Varredura Automática do Obsidian -> Git -> Drive
# =========================================================================
Write-Host "[AmpAI] Lendo subpasta do Obsidian (Varredura Automatica)..." -ForegroundColor Cyan

if (!(Test-Path ".\docs")) { New-Item -ItemType Directory -Path ".\docs" | Out-Null }

if (Test-Path $obsidianAmpAIFolder) {
    # Lê automaticamente TODOS os arquivos .md que existirem dentro dessa subpasta
    $obsidianFiles = Get-ChildItem -Path $obsidianAmpAIFolder -Filter "*.md" -File -Recurse

    foreach ($file in $obsidianFiles) {
        $sourceDoc = $file.FullName
        $docName = $file.Name
        
        # A) Copia para a pasta docs/ local para fazer o backup no Git
        Copy-Item -Path $sourceDoc -Destination (Join-Path ".\docs" $docName) -Force
        
        # B) Converte para .txt via cópia binária e manda pro Google Drive
        $driveDest = Join-Path $targetFolder $docName.Replace(".md", ".txt")
        Copy-Item -Path $sourceDoc -Destination $driveDest -Force
        
        Write-Host " -> Espelhado com sucesso: $docName" -ForegroundColor DarkGray
    }
}
else {
    Write-Host " [Aviso] Pasta do Obsidian não encontrada: $obsidianAmpAIFolder" -ForegroundColor Yellow
}

# =========================================================================
# 4. Auto-Commit para o GitHub (A Fonte da Verdade)
# =========================================================================
Write-Host "[AmpAI] Salvando documentacao humana na nuvem (GitHub)..." -ForegroundColor Magenta
git add .\docs\*
git commit -m "docs: atualizacao automatica da pasta AmpAI do Obsidian via sync.ps1"
git push origin main

Write-Host "[AmpAI] Loop Semantico Trilateral Concluido! Ecossistema 100/100." -ForegroundColor Green
