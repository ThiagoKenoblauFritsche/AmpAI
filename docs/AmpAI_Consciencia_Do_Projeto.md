---
tags:
  - arquitetura/ia
  - ampai/consciencia
versao: 4.2
status: ativo
---

# 🛸 Arquivo de Consciência e Memória do Projeto AmpAI

## 📋 1. Propósito do Ecossistema
Este arquivo é o DNA técnico do AmpAI, projetado para blindar o contexto e a memória dos copilotos de IA contra amnésia de chat. O AmpAI é um SaaS inovador focado em automação de cálculos e memoriais de engenharia elétrica (Baixa e Média Tensão) sob as normas internacionais **IEC**.

## 📁 2. Arquitetura Física e Estrutura de Arquivos (v4.2)
O software foi cirurgicamente modularizado (O.S. #INF-005) para mitigar a degradação de contexto. O monolito de 172 KB foi quebrado em:
- `index.html`: Casca visual e interface principal do usuário (SPA).
- `js/core_cabos_mt.js`: Motor matemático puro e isolado (43 heurísticas de validação IEC 60502-2).
- `js/ui_render.js`: Motor de renderização reativa do DOM e gráficos (Chart.js), tolerante a falhas com try/catch.
- `sync.ps1`: Script PowerShell local do Windows para automação trilateral.

## 🖥️ 3. Infraestrutura e Governança de Ambientes
O projeto opera em um triângulo de sincronização perfeito:
1. **Ambiente de Produção (VPS Hetzner):** Instância Linux Ubuntu 24.04 LTS localizada na Alemanha (`178.105.252.252`). Possui o repositório clonado em `/app/ampai` e a **Antigravity CLI da Google** instalada e autenticada sob a licença **PRO** (`thiagokenoblaufritsche@gmail.com`).
2. **Ambiente Central (GitHub Private):** Repositório seguro que serve de ponte inteligente de sincronização de código.
3. **Ambiente do PC Local (IDE Antigravity & Obsidian):** Pasta de desenvolvimento conectada ao Git. O cofre do Obsidian (`Thiago_2.0`) está estruturado de forma visível e limpa em subpastas numéricas.

## 🔄 4. O Script de Sincronização Unificada (`./sync.ps1`)
Para trazer as alterações de código da VPS para o computador do Thiago com esforço zero e alimentar a IA de forma invisível, o script PowerShell local executa:
```powershell
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
        # Converte a extensão para .txt no destino para leitura RAG
        $destName = $file.Replace(".md", ".txt")
        $destPath = Join-Path -Path $targetFolder -ChildPath $destName
        
        # Cópia binária pura (Copy-Item) preserva 100% da acentuação UTF-8
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host " -> Espelhado com sucesso: $destName" -ForegroundColor DarkGray
    } else {
        Write-Host " [Aviso] Arquivo não encontrado: $sourcePath" -ForegroundColor Yellow
    }
}

Write-Host "[AmpAI] Loop Semantico Trilateral Concluido! Ecossistema 100/100 atualizado." -ForegroundColor Green
```

## 📈 5. Estado Atual do Backlog Macro
- **Fase 1 (Fundação e Modularização):** 100% Concluída.
- **Fase 2 (Instalação e Autenticação CLI PRO na VPS):** 100% Concluída.
- **Fase 3 (Sincronização e Contexto Técnico RAG):** 100% Concluída (NotebookLM indexado via auto-sync do arquivo `.txt` no Meu Drive).
- **Fase 4 (Gateway Móvel do Telegram):** PRÓXIMO PASSO ATIVO (Iniciando na O.S. #INF-012 via `@BotFather`).
