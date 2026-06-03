# Atualiza o sync.ps1 para ler EXCLUSIVAMENTE o arquivo atualizado da raiz do projeto
@'
Write-Host "📥 [AmpAI] Puxando atualizações de engenharia da VPS (Hetzner)..." -ForegroundColor Cyan
git fetch origin main
git reset --hard origin/main

# Força o PowerShell a ler estritamente o arquivo recém-baixado da raiz do projeto (.\)
$sourceFile = ".\AmpAI_Contratos_E_Estrutura_De_Codigo.md"
$targetPath = "G:\Meu Drive\AmpAI_NotebookLM\AmpAI_Contratos_E_Estrutura_De_Codigo.txt"

if (Test-Path $sourceFile) {
    Write-Host "☁️ [AmpAI] Convertendo e injetando no canal visível do Google Drive (Formato .txt puro)..." -ForegroundColor Blue
    
    # Lê o markdown novo da raiz e grava como texto cru puro no Drive, forçando a atualização
    Get-Content -LiteralPath $sourceFile | Out-File -FilePath $targetPath -Encoding utf8 -Force
    
    Write-Host "✅ [AmpAI] Loop Semântico Concluído! O arquivo do Drive foi atualizado com sucesso." -ForegroundColor Green
} else {
    Write-Host "⚠️ [AmpAI] Arquivo de contratos não encontrado na raiz do projeto." -ForegroundColor Red
}
'@ | Out-File -FilePath sync.ps1 -Encoding utf8 -Force
