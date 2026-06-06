---
tags:
  - infraestrutura/vps
  - devops/backlog
  - ampai/core
versao: 4.2
status: em-andamento
---
---
tags:
  - infraestrutura/vps
  - devops/backlog
versao: 4.2
status: em-andamento
---

# 📈 Backlog de Infraestrutura — Implementação v4.2

> [!todo] **Diretriz de Execução (State Lock)**
> A Fase 3 foi liquidada com sucesso através do canal de Auto-Sync estruturado no formato `.txt` direto no G:\Meu Drive\AmpAI_NotebookLM\ . O foco da esteira avança agora obrigatoriamente para a Fase 4 (Gatilho Móvel).

---

### 🖥️ FASE 1: Fundação do Servidor e Código Modular (CONCLUÍDA)
- [x] **O.S. #INF-001** | `[MÉDIA]` Provisionamento da instância VPS Hetzner CX23 com Ubuntu Linux e IP IPv4 Dedicado.
- [x] **O.S. #INF-002** | `[CRÍTICA]` Instalação do motor do Docker Engine para isolamento de Sandboxes na nuvem.
- [x] **O.S. #INF-003** | `[MÉDIA]` Instalação do ambiente JavaScript NodeJS (v22) e configuração do Git na VPS.
- [x] **O.S. #INF-004** | `[ALTA]` Geração do GitHub Personal Access Token (PAT) clássico e clonagem bem-sucedida do repositório privado na pasta `/app/ampai`.
- [x] **O.S. #INF-005** | `[CRÍTICA]` Execução do fatiamento e modularização do `index.html` monolítico para a estrutura em subarquivos (`js/core_cabos_mt.js` e `js/ui_render.js`) sem perdas.

---

### 🛸 FASE 2: Autenticação do Antigravity CLI na VPS (CONCLUÍDA)
- [x] **O.S. #INF-006** | `[CRÍTICA]` Instalação oficial do Antigravity CLI via repositório `.google` em modo nativo no Ubuntu Linux.
- [x] **O.S. #INF-007** | `[CRÍTICA]` Autenticação de Licença e Vinculação de Conta Google AI Pro (`thiagokenoblaufritsche@gmail.com`) ativa na nuvem.
- [x] **O.S. #INF-008** | `[ALTA]` Configuração da sincronização e validação das permissões automáticas (`settings.json`) para comandos CLI de plano de fundo no terminal.

---

### 🧠 FASE 3: O Loop Semântico de Contexto Infinito (CONCLUÍDA)
- [x] **O.S. #INF-009** | `[MÉDIA]` Configuração do aplicativo Google Drive para Computador no Windows para espelhar a pasta do cofre (`Thiago_2.0`).
- [x] **O.S. #INF-010** | `[ALTA]` Criação do Caderno de Engenharia Dedicado dentro do Google NotebookLM lendo do Drive.
- [x] **O.S. #INF-011** | `[MÉDIA]` Teste de Estresse de Leitura Semântica com o Copiloto Gratuito via mapeamento do arquivo `.txt` no Meu Drive.

---

### 📲 FASE 4: Gateway do Telegram e Automação do Hermes Agent (PRÓXIMO PASSO ATIVO)
- [x] **O.S. #INF-012** | [ALTA] Criação do Bot Oficial no Telegram via @BotFather e captura do HTTP API Token.
- [x] **O.S. #INF-013** | [CRÍTICA] Atualização do arquivo .github/AGENTS.md e injeção do gateway de comunicação móvel no Hermes. **(STATUS: CONCLUÍDA)**
- [x] **O.S. #INF-014** | [CRÍTICA] Programação do Gatilho `RUN_PRO_ANTIGRAVITY:` amarrado ao comando de terminal agy logado na conta PRO.

___

### 🛡️ FASE 5: CI/CD e Muralha de Testes (TDD Rígido)
- [ ] **O.S. #INF-015** | `[ALTA]` Implementação de Linters Automáticos na VPS (validação sintática pré-commit do JS modularizado).
- [x] **O.S. #INF-016** | `[CRÍTICA]` Implementação de testes unitários automatizados in-browser (Muralha TDD Full-Stack para MT, BT e UI).
- [ ] **O.S. #INF-017** | `[ALTA]` Configuração de Pre-commit Hooks para bloqueio de merge em caso de falhas nos testes ou linters.
- [x] **O.S. #015-ANTI-HAPPY-PATH** | `[ALTA]` Diretrizes de agentes refatoradas com regras de testes de estresse (Edge Cases) e gravação obrigatória de Skills na pasta `~/.hermes/skills/ampai/`.
