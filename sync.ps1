Write-Host "📥 [AmpAI] Puxando atualizações de engenharia da VPS (Hetzner)..." -ForegroundColor Cyan
git fetch origin main
git reset --hard origin/main

if (Test-Path "AmpAI_Contratos_E_Estrutura_De_Codigo.md") {
    Write-Host "☁️ [AmpAI] Atualizando canal exclusivo do Google Drive (Formato .txt)..." -ForegroundColor Blue
    # O script agora ignora o Obsidian e joga o arquivo estritamente no disco virtual G: do Drive
    Copy-Item -Path "AmpAI_Contratos_E_Estrutura_De_Codigo.md" -Destination "G:\Meu Drive\AmpAI_Contratos_E_Estrutura_De_Codigo.txt" -Force
    Write-Host "✅ [AmpAI] Loop Semântico Concluído! NotebookLM atualizado no piloto automático." -ForegroundColor Green
} else {
    Write-Host "⚠️ [AmpAI] Arquivo de contratos não encontrado." -ForegroundColor Red
}
