# Força o script a rodar no contexto da raiz do projeto (uma pasta acima da pasta scripts)
Set-Location -Path (Join-Path $PSScriptRoot "..")

Write-Host "[AmpAI] Puxando atualizacoes do GitHub (VPS/Rua)..." -ForegroundColor Cyan
git pull origin main --rebase

# =========================================================================
# 0. Definição de Rotas Base
# =========================================================================
$targetFolder = "G:\Meu Drive\AmpAI_NotebookLM"

# =========================================================================
# 2. Fluxo Automático: Matriz de Governança (Agentes)
# =========================================================================
$filesToSync = @("AGENTS.md", ".CEO.txt", ".CTO.txt", ".Engenheiro Eletricista.txt", ".Hermes Executive Dev.txt", ".Senior QA-Security.txt", ".Senior_Backend_Dev.txt", ".Senior_Frontend_Dev.txt")
Write-Host "[AmpAI] Sincronizando Matriz de Governanca Multi-Agentes para o Google Drive..." -ForegroundColor Magenta

foreach ($file in $filesToSync) {
    $sourcePath = Join-Path -Path ".\.github\workflows" -ChildPath $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path -Path $targetFolder -ChildPath $file.Replace(".md", ".txt")
        # Cópia binária preserva UTF-8 integralmente [cite: 191]
        Copy-Item -Path $sourcePath -Destination $destPath -Force 
    }
}

# =========================================================================
# 3. Fluxo Docs as Code - Concatenação e Sincronização Local (docs) -> Drive
# =========================================================================
Write-Host "[AmpAI] Sincronizando documentacao local (Docs as Code) com Concatenacao Automatica..." -ForegroundColor Cyan

if (Test-Path ".\docs") {
    
    # 3.1. Arquivos da Raiz (Painel, Manifesto, etc.) copiam 1 para 1
    $rootDocs = Get-ChildItem -Path ".\docs" -Filter "*.md" -File
    foreach ($file in $rootDocs) {
        $driveDest = Join-Path $targetFolder $file.Name.Replace(".md", ".txt")
        Copy-Item -Path $file.FullName -Destination $driveDest -Force
        Write-Host " -> Espelhado (Direto): $($file.Name)" -ForegroundColor DarkGray
    }

    # 3.2. Concatenar BDD Features
    if (Test-Path ".\docs\features") {
        $featureFiles = Get-ChildItem -Path ".\docs\features" -Filter "*.md" -Recurse -File
        if ($featureFiles.Count -gt 0) {
            $destFile = Join-Path $targetFolder "AmpAI_BDD_Features_Compiladas.txt"
            Clear-Content -Path $destFile -ErrorAction SilentlyContinue
            foreach ($file in $featureFiles) {
                "`n`n=== ARQUIVO: $($file.Name) ===`n`n" | Out-File -FilePath $destFile -Append -Encoding UTF8
                Get-Content -Path $file.FullName -Raw | Out-File -FilePath $destFile -Append -Encoding UTF8
            }
            Write-Host " -> Espelhado (Concatenado): AmpAI_BDD_Features_Compiladas.txt ($($featureFiles.Count) arquivos)" -ForegroundColor Yellow
        }
    }

    # 3.3. Concatenar API (SDD)
    if (Test-Path ".\docs\api") {
        $apiFiles = Get-ChildItem -Path ".\docs\api" -Filter "*.md" -Recurse -File
        if ($apiFiles.Count -gt 0) {
            $destFile = Join-Path $targetFolder "AmpAI_SDD_API_Compilada.txt"
            Clear-Content -Path $destFile -ErrorAction SilentlyContinue
            foreach ($file in $apiFiles) {
                "`n`n=== ARQUIVO: $($file.Name) ===`n`n" | Out-File -FilePath $destFile -Append -Encoding UTF8
                Get-Content -Path $file.FullName -Raw | Out-File -FilePath $destFile -Append -Encoding UTF8
            }
            Write-Host " -> Espelhado (Concatenado): AmpAI_SDD_API_Compilada.txt ($($apiFiles.Count) arquivos)" -ForegroundColor Yellow
        }
    }

    # 3.4. Concatenar Normas por Subpasta
    if (Test-Path ".\docs\normas") {
        $normaFolders = Get-ChildItem -Path ".\docs\normas" -Directory
        foreach ($folder in $normaFolders) {
            $normaFiles = Get-ChildItem -Path $folder.FullName -Filter "*.md" -Recurse -File
            if ($normaFiles.Count -gt 0) {
                $compiladoName = "$($folder.Name)_Compilado_Full.txt"
                $destFile = Join-Path $targetFolder $compiladoName
                Clear-Content -Path $destFile -ErrorAction SilentlyContinue
                foreach ($file in $normaFiles) {
                    "`n`n=== ARQUIVO: $($file.Name) ===`n`n" | Out-File -FilePath $destFile -Append -Encoding UTF8
                    Get-Content -Path $file.FullName -Raw | Out-File -FilePath $destFile -Append -Encoding UTF8
                }
                Write-Host " -> Espelhado (Concatenado): $compiladoName ($($normaFiles.Count) arquivos)" -ForegroundColor Yellow
            }
        }
    }
}
else {
    Write-Host " [Aviso] Pasta local 'docs' não encontrada!" -ForegroundColor Yellow
}

# =========================================================================
# 4. Auto-Commit para o GitHub (A Fonte da Verdade)
# =========================================================================
Write-Host "[AmpAI] Salvando documentacao humana na nuvem (GitHub)..." -ForegroundColor Magenta
git add .\docs\*
git commit -m "docs: atualizacao automatica da pasta AmpAI do Obsidian via sync.ps1"
git push origin main

Write-Host "[AmpAI] Loop Semantico Trilateral Concluido! Ecossistema 100/100." -ForegroundColor Green
