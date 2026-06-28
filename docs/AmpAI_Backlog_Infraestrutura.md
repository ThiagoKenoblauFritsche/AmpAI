---
tags:
  - infraestrutura/vps
  - devops/backlog
  - ampai/core
versao: 7
status: ativo
---

# 📈 Backlog de Infraestrutura — Implementação v7.0

> [!todo] **Diretriz de Execução (State Lock)**
> As Fases de 1 a 5 estabeleceram a fundação do repositório. A Fase 6 (VPS/Telegram) permanece no roadmap futuro. **O foco oficial é a FASE 7:** separação de poderes, fábrica Claude especializada e Tribunal Codex com evidência RED→GREEN, `exit code`, artifact de CI quando aplicável e PR obrigatório antes de `main`. CodeRabbit é revisão complementar de PR, não o veredito. CD para staging e CD para produção são fases futuras e separadas.

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

### 📲 FASE 4: Gateway do Telegram e Automação do Hermes Agent (CONCLUÍDA)
- [x] **O.S. #INF-012** | `[ALTA]` Criação do Bot Oficial no Telegram via @BotFather e captura do HTTP API Token.
- [x] **O.S. #INF-013** | `[CRÍTICA]` Atualização do arquivo .github/AGENTS.md e injeção do gateway de comunicação móvel no Hermes. **(STATUS: CONCLUÍDA)**
- [x] **O.S. #INF-014** | `[CRÍTICA]` Programação do Gatilho `RUN_PRO_ANTIGRAVITY:` amarrado ao comando de terminal agy logado na conta PRO.

___

### 🛡️ FASE 5: CI e Muralha de Testes (TDD Rígido)
- [ ] **O.S. #INF-015** | `[ALTA]` Implementação de Linters Automáticos na VPS (validação sintática pré-commit do JS modularizado).
- [x] **O.S. #INF-016** | `[CRÍTICA]` Implementação de testes unitários automatizados in-browser (Muralha TDD Full-Stack para MT, BT e UI).
- [ ] **O.S. #INF-017** | `[ALTA]` Configuração de Pre-commit/Pre-PR Hooks para bloquear entrega candidata em caso de falhas nos testes ou linters.
- [x] **O.S. #015-ANTI-HAPPY-PATH** | `[ALTA]` Diretrizes de agentes refatoradas com regras de testes de estresse (Edge Cases) e gravação obrigatória de Skills na pasta `~/.hermes/skills/ampai/`.
- [x] **O.S. #INF-018** | `[MÉDIA]` Configuração do Plugin Obsidian Git no ambiente mobile. Fluxo autônomo entre Celular -> GitHub estabelecido para edição de arquitetura na rua.

___

### 🪐 FASE 6: Implantação do Air Gap Epistemológico (CONCLUÍDA/MOVIDA PARA ROADMAP)
- [x] **O.S. #INF-019** | `[MIGRADA]` **Segregação:** Movido para o Roadmap de expansão futura (VPS/Telegram).
- [x] **O.S. #INF-020** | `[SUBSTITUÍDA]` O CodeRabbit deixou de ser autoridade de veredito; permanece como revisão complementar de PR.
- [x] **O.S. #INF-021** | `[ATUALIZADA]` Calibração **RED→GREEN** e evidência de execução atribuídas ao @Senior_QA_Security via Codex.

___

### 🐇 FASE 7: Governança v7.0 (Separação de Poderes e Tribunal Codex) (ATIVA)
- [x] **O.S. #INF-022** | `[ATUALIZADA]` CodeRabbit configurado como revisão complementar no GitHub.
- [x] **O.S. #INF-023** | `[ATUALIZADA]` Estúdio 2 local unificado: Claude Opus 4.8 para ciência normativa/BDD e Backend; Claude Sonnet 4.6 para Frontend. O @Engenheiro_Eletricista consome RNC-P/RNC-C em Markdown, não PDFs massivos.
- [x] **O.S. #INF-026** | `[CRÍTICA]` Tribunal migrado para @Senior_QA_Security no Codex, com execução isolada e evidência de `exit code`.
- [x] **O.S. #INF-024** | `[ALTA]` Implementação da estratégia de Injeção RAG Federada (Docs as Code) dispensando a necessidade de Pinecone/Vector DB.
- [ ] **O.S. #INF-025** | `[ALTA]` Validação física em CI com o Node.js rodando o `tests/core_curto_circuito.test.js` no GitHub Actions.
- [x] **O.S. #INF-027** | `[CRÍTICA]` GitHub Actions QA in-browser implantado para a `Refat_Frontend`: workflow `.github/workflows/qa-os040r.yml` executa `tests/test_os040_restart.js`, configura Chromium/Puppeteer, captura `exit code` e publica o artifact `os040r-evidence`.
- [ ] **O.S. #INF-028** | `[CRÍTICA]` Formalizar o gate de PR da `Refat_Frontend`: abrir Pull Request para `main`, exigir GitHub Actions verde, artifact anexado, CodeRabbit complementar e validação final do @Senior_QA_Security antes do aceite do CEO.
- [ ] **O.S. #INF-029** | `[ALTA]` Padronizar artifacts de QA/CI: todo workflow de Tribunal deve publicar arquivo de evidência com comando, ambiente, logs relevantes, resultado, `exit code` e referência à O.S.
- [ ] **O.S. #INF-032** | `[ALTA]` Padronizar taxonomia RNC: classificar arquivos de `docs/normas/` como RNC-P, promover regras críticas para RNC-C em `docs/engenharia/` e impedir uso de RNC-P como base direta de implementação sem prova de cálculo contestável.

___

### 🚦 FASE 8: CD Staging (FUTURO — NÃO ATIVO)
- [ ] **O.S. #INF-030** | `[ALTA]` Criar deploy automático para ambiente de staging somente após estabilização de CI + PR + CodeRabbit + artifacts.

___

### 🚀 FASE 9: CD Produção (FUTURO — NÃO ATIVO)
- [ ] **O.S. #INF-031** | `[CRÍTICA]` Avaliar CD para produção apenas depois de staging validado, contratos de erro estabilizados, testes visuais in-browser maduros e aprovação explícita do CEO.
