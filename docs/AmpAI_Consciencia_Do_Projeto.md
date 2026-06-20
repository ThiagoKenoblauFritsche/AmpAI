---
tags:
  - arquitetura/ia
  - ampai/consciencia
versao: 7
status: ativo
---

# 🛸 Arquivo de Consciência e Memória do Projeto AmpAI (v7.0)

## 📋 1. Propósito do Ecossistema
Este arquivo é o DNA técnico do AmpAI, projetado para blindar o contexto e a memória dos copilotos de IA contra amnésia de chat. O AmpAI é um SaaS inovador focado em automação de cálculos e memoriais de engenharia elétrica (Baixa e Média Tensão) sob as normas internacionais **IEC**. O projeto adota a metolodogia Lean, eliminando lixos e overlaps documentais.

## 📁 2. Arquitetura Física e Estrutura de Arquivos (v7.0) 

O software opera sob o framework de Engenharia **BDD + SDD + DDD + TDD**:
- `docs/features/`: Especificações BDD (Gherkin) escritas pelo @Engenheiro_Eletricista.
- `docs/api/`: Contratos de API SDD (OpenAPI/RFC 7807) ditados pelo @CTO.
- `js/core_*.js`: Motores matemáticos puros (DDD) gerenciados pelo @Senior_Backend_Dev, retornando apenas JSON (Result Pattern). NUNCA tocam no DOM.
- `js/ui_render.js`: Motor de reatividade do DOM e UI gerenciado pelo @Senior_Frontend_Dev, blindado com Null Pointer Mitigation.
- `sync.ps1`: Script PowerShell de automação trilateral nativo (Docs as Code).

## 🖥️ 3. Infraestrutura e Governança (SaaS)
O projeto superou o desenvolvimento monolítico e agora opera na topologia em duas fases:
1. **Fase 1 (Atual - Local/Nuvem):** Claude Code CLI atua como a Fábrica local escrevendo código. O CodeRabbit atua na Nuvem do GitHub como o Tribunal/Gatekeeper validando PRs.
2. **Fase 2 (Roadmap - Headless VPS):** A operação do Claude Code será movida para uma VPS isolada (Cloud Factory) sendo comandada remotamente via Telegram pelo humano.
3. **Plano Semântico:** Google NotebookLM e Google Drive.

## 🔄 4. O Fluxo Docs As Code (`./sync.ps1`)
Todo o sistema de "Obsidian" foi oficialmente APOSENTADO para evitar overhead.
Agora operamos no fluxo **Docs as Code**. O engenheiro escreve o `.md` direto na pasta `docs/`. O script `sync.ps1` lê a pasta `docs/`, converte para `.txt` e injeta no Google Drive (NotebookLM), e por fim empurra para o GitHub.

## 📈 5. Estado Atual do Backlog Macro
- **Fase 1 a 6 (Fundação, Motores BT/MT, Air Gap v6):** 100% Concluídas ou migrado para o roadmap.
- **Fase 7 (Claude CLI Local + CodeRabbit CI/CD):** PRÓXIMO PASSO ATIVO.
- **Fase 8 (Expansão Headless VPS/Telegram):** Em planejamento comercial.
- **Fase 9 e 10 (SaaS Multi-Tenant e Stripe):** Em planejamento comercial.

--------------------------------------------------------------------------------

## 📋6. PROTOCOLO OFICIAL DE EXECUÇÃO E ZOMBIES TDD

> [!important] **Diretriz de Ouro: Air Gap Epistemológico**
> Quem escreve o código NUNCA avalia o próprio código.

1. **Ataque Baseado em Risco:** A esteira de desenvolvimento DEVE priorizar bugs `[CRÍTICOS]` antes de lançar novas features.
2. **Testes ZOMBIES:** Todo código escrito na Cloud Factory (VPS-A) DEVE vir acompanhado de testes de interface, fronteiras e exceções (RFC 7807).
3. **Docs as Code:** O fechamento de qualquer Ordem de Serviço (O.S.) inclui rodar o `.\sync.ps1` localmente para alimentar o NotebookLM com o estado de sucesso.
4. **Acionamento da Fábrica:** Para respeitar o limite de ambiente, o Tribunal (Antigravity) NUNCA tentará executar a CLI do Claude diretamente via terminal background. O padrão oficial é **entregar ao usuário final o prompt exato formatado (`claude -p "..."`)** com todo o contexto e direcionamento do BDD, para que o usuário execute a "Fábrica" manualmente no seu próprio ambiente (PC).