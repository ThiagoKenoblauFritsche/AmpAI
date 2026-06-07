---
tags:
  - arquitetura/ia
  - ampai/consciencia
versao: 5
status: ativo
---

# 🛸 Arquivo de Consciência e Memória do Projeto AmpAI

## 📋 1. Propósito do Ecossistema
Este arquivo é o DNA técnico do AmpAI, projetado para blindar o contexto e a memória dos copilotos de IA contra amnésia de chat. O AmpAI é um SaaS inovador focado em automação de cálculos e memoriais de engenharia elétrica (Baixa e Média Tensão) sob as normas internacionais **IEC**.

## 📁 2. Arquitetura Física e Estrutura de Arquivos (v5.0) 

O software superou a modularização inicial e agora opera sob a Governança v5.0 (Linha de Montagem Especializada). Os agentes possuem separação estrita de funções (SoC) com TDD in-browser obrigatório:
- `index.html`: Casca visual principal do usuário (SPA).
- `js/core_cabos_bt.js` e `js/core_cabos_mt.js`: Motores matemáticos puros, gerenciados pelo @Senior_Backend_Dev, retornando apenas JSON.
- `js/ui_render.js`: Motor de reatividade do DOM e UI, gerenciado pelo @Senior_Frontend_Dev, blindado com Null Pointer Mitigation.
- `sync.ps1`: Script PowerShell para automação trilateral.

## 🖥️ 3. Infraestrutura e Governança de Ambientes
O projeto opera em um triângulo de sincronização perfeito:
1. **Ambiente de Produção (VPS Hetzner):** Instância Linux Ubuntu 24.04 LTS localizada na Alemanha (`178.105.252.252`). Possui o repositório clonado em `/app/ampai` e a **Antigravity CLI da Google** instalada e autenticada sob a licença **PRO** (`thiagokenoblaufritsche@gmail.com`).
2. **Ambiente Central (GitHub Private):** Repositório seguro que serve de ponte inteligente de sincronização de código.
3. **Ambiente do PC Local (IDE Antigravity & Obsidian):** Pasta de desenvolvimento conectada ao Git. O cofre do Obsidian (`Thiago_2.0`) está estruturado de forma visível e limpa em subpastas numéricas.

## 🔄 4. O Script de Sincronização Unificada (`./sync.ps1`)
Para trazer as alterações de código da VPS para o computador do Thiago com esforço zero e alimentar a IA de forma invisível, o script PowerShell local executa:
```powershell
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

$filesToSync = @("AGENTS.md", ".CEO.txt", ".CTO.txt", ".Engenheiro Eletricista.txt", ".Hermes Executive Dev.txt", ".Senior QA-Security.txt", ".Senior_Backend_Dev.txt", ".Senior_Frontend_Dev.txt")

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
```

## 📈 5. Estado Atual do Backlog Macro
- **Fase 1 (Fundação e Modularização):** 100% Concluída.
- **Fase 2 (Instalação e Autenticação CLI PRO na VPS):** 100% Concluída.
- **Fase 3 (Sincronização e Contexto Técnico RAG):** 100% Concluída (NotebookLM indexado via auto-sync do arquivo `.txt` no Meu Drive).
- **Fase 4 (Gateway Móvel do Telegram):** PRÓXIMO PASSO ATIVO (Iniciando na O.S. #INF-012 via `@BotFather`).
