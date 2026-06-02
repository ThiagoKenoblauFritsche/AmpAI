Write-Host "📥 [AmpAI] Puxando atualizações de engenharia da VPS (Hetzner)..." -ForegroundColor Cyan
git fetch origin main
git reset --hard origin/main

if (Test-Path "AmpAI_Contratos_E_Estrutura_De_Codigo.md") {
    Write-Host "🔄 [AmpAI] Sincronizando Mapa de Contratos com o Obsidian..." -ForegroundColor Yellow
    Copy-Item -Path "AmpAI_Contratos_E_Estrutura_De_Codigo.md" -Destination "C:\Users\ACER\Desktop\Thiago_2.0\03-Trabalho\200 Projetos Ativos\Principais\AmpAI\03-Arquitetura de IA & Contexto\" -Force
    Write-Host "✅ [AmpAI] Loop Semântico Concluído! Google Drive e NotebookLM atualizados." -ForegroundColor Green
} else {
    Write-Host "⚠️ [AmpAI] Arquivo de contratos não encontrado na raiz." -ForegroundColor Red
}
