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

## 🖥️ 3. Infraestrutura e Governança de Ambientes (v6.0)
O projeto superou o desenvolvimento unificado e agora opera numa tripartição de responsabilidades:
1. **Plano Semântico (Insights):** O Google NotebookLM atua como "memória de longo prazo". Faz RAG de contexto infinito sem cobrar tokens, ajudando no brainstorming comercial na rua. Tem zero autoridade de código.
2. **Plano de Produção Científica (PC Local):** O Claude Code Pro (Fable 5) atua na máquina do Thiago. Focado em codificar matemática complexa, aplicar mitigação de Null Pointer e construir as interfaces. Submetido estritamente ao Air Gap.
3. **Plano de Governança (VPS Hetzner):** A VPS Ubuntu na Alemanha rodando a Antigravity CLI. É o "Juiz Supremo". Intercepta os commits, compila na Sandbox, roda o TDD de forma hermética e dita o deploy em produção.

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

  
--------------------------------------------------------------------------------

## 📋6. PROTOCOLO OFICIAL DE EXECUÇÃO E FECHAMENTO DE CICLO (v5.1)

[!important] **Diretriz de Ouro: Sistemas Auto-Evolutivos e Prioridade** Este protocolo rege o fluxo de trabalho imutável do ecossistema AmpAI para garantir a segurança da infraestrutura, rastreabilidade documental e a evolução contínua da inteligência artificial.

#### 1. Regra de Priorização Estrita e Memória Evolutiva

- **Ataque Baseado em Risco:** A esteira de desenvolvimento DEVE sempre priorizar as Ordens de Serviço (O.S.) marcadas como `[CRÍTICA]`. Somente após a resolução das críticas, o sistema avança para as de prioridade `[ALTA]`, `[MÉDIA]` e `[BAIXA]`.
- **Registro Obrigatório de Skills (Vacina):** Sempre que uma O.S. `[CRÍTICA]` for resolvida com sucesso, é mandatório que o comando para os agentes exija a geração de um arquivo físico de _Skill_. O Hermes deve documentar a solução do problema e as regras de arquitetura adotadas, salvando estritamente no diretório `~/.hermes/skills/ampai/` [cite: 8]. Isso garante que a IA nunca mais cometa o mesmo erro [cite: 8].

#### 2. Protocolo de Fechamento de Ciclo Semântico (O Loop)

Após a entrega de código pelo Antigravity/Hermes, o fluxo de consolidação DEVE respeitar esta ordem imutável [cite: 479]:

1. **Validação Humana:** O utilizador testa a interface no navegador (`localhost`) para atestar o sucesso da funcionalidade e do TDD.
2. **Consolidação do Código (Git):** Execução do bloco exato de comandos no terminal (`git add`, `git commit` com semântica e `git push origin main`).
3. **Atualização Humana (Obsidian):** O utilizador marca a O.S. como concluída (`[x]`) no arquivo de backlog correspondente.
4. **O Gatilho de Sincronização:** O utilizador executa o script nativo `./sync.ps1` no PowerShell para forçar o espelhamento trilateral (Código -> Drive -> RAG) [cite: 19].
5. **Trava de Governança do Copiloto:** A Inteligência Artificial (NotebookLM) entra imediatamente em **STATUS: [AGUARDANDO DOCUMENTAÇÃO PARA AVALIAÇÃO]**.
6. **O Sinal Verde:** O utilizador responde com a palavra "Sincronizado" no chat.
7. **A Nova Missão:** Somente após o sinal verde, o Copiloto IA faz a varredura da arquitetura atualizada e sugere a próxima O.S. lógica baseada na Regra de Priorização.

#### 3. Avaliação Dinâmica e Atualização Integral do README.md
* **Gatilho Condicional:** Ao final de cada O.S., a IA Copiloto (NotebookLM) fará uma avaliação autônoma para determinar se as alterações impactaram o mapa da aplicação, a stack tecnológica, ou a lista de módulos ativos.
* **Ação:** Se a atualização for necessária, a IA não fornecerá mais "blocos soltos". Ela fornecerá o código Markdown **COMPLETO** do `README.md` em um único bloco de código para substituição integral (copy and paste). Se a O.S. for apenas um hotfix ou refatoração menor, a etapa do README será ignorada para evitar poluição documental.
--------------------------------------------------------------------------------