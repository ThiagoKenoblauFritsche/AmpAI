# Atualiza o sync.ps1 para exportar tanto o mapa de contratos quanto o README para o Google Drive
@'
Write-Host "[AmpAI] Puxando atualizacoes de engenharia da VPS (Hetzner)..." -ForegroundColor Cyan
git fetch origin main
git reset --hard origin/main

# Definição de Rotas de Origem e Destino
$sourceContratos = ".\AmpAI_Contratos_E_Estrutura_De_Codigo.md"
$sourceReadme = ".\README.md"
$targetFolder = "G:\Meu Drive\AmpAI_NotebookLM\"

# 1. Fluxo Automático do Mapa de Contratos
if (Test-Path $sourceContratos) {
    Write-Host "[AmpAI] Sincronizando Mapa de Contratos no Google Drive..." -ForegroundColor Blue
    Get-Content -LiteralPath $sourceContratos | Out-File -FilePath "${targetFolder}AmpAI_Contratos_E_Estrutura_De_Codigo.txt" -Encoding utf8 -Force
}

# 2. Novo Fluxo Automático do README.md para o NotebookLM
if (Test-Path $sourceReadme) {
    Write-Host "[AmpAI] Convertendo e exportando README.md para o Google Drive..." -ForegroundColor Yellow
    Get-Content -LiteralPath $sourceReadme | Out-File -FilePath "${targetFolder}README.txt" -Encoding utf8 -Force
}

Write-Host "[AmpAI] Loop Semantico Trilateral Concluido! Ecossistema 100/100 atualizado." -ForegroundColor Green
'@ | Out-File -FilePath sync.ps1 -Encoding utf8 -Force
