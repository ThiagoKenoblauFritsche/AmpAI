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
> As Fases de 1 a 5 estabeleceram a fundação do repositório. A Fase 6 (VPS/Telegram) permanece no roadmap futuro. **O foco oficial é a FASE 7:** separação de poderes, fábrica Claude especializada, Tribunal Codex e implantação do Gate Consolidado ratificado em `docs/AmpAI_Gate_Regressao.md`. CodeRabbit é revisão complementar, QA mantém o veredito, CEO mantém o merge e CD permanece separado.

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
- [x] **O.S. #INF-025** | `[ALTA]` `tests/core_curto_circuito.test.js` e `tests/test_os047.js` integrados ao job core do Gate Consolidado, com adaptador legado exigindo 39/39 e protocolo processável.
- [x] **O.S. #INF-027** | `[CRÍTICA]` GitHub Actions QA in-browser implantado para a `Refat_Frontend`: workflow `.github/workflows/qa-os040r.yml` executa `tests/test_os040_restart.js`, configura Chromium/Puppeteer, captura `exit code` e publica o artifact `os040r-evidence`.
- [x] **O.S. #INF-028** | `[CRÍTICA]` Gate Consolidado v1 implantado em shadow mode por INF-028-A/B/C e integrado pela PR #17. GREEN pós-merge em `main@dd83008`; run `28910574756` com manifest, core, três browsers, agregador e artifacts verdes. **Não é required check.**
- [ ] **O.S. #INF-029** | `[ALTA]` Padronizar artifacts individuais e consolidado: ambiente, lockfile, comando, preflight, relatórios, categoria `PASS/FUNCTIONAL_FAILURE/INFRA_BLOCKED/CONFIG_ERROR`, `exit code`, hashes e referência à O.S.
- [ ] **O.S. #INF-032** | `[ALTA]` Padronizar taxonomia RNC: classificar arquivos de `docs/normas/` como RNC-P, promover regras críticas para RNC-C em `docs/engenharia/` e impedir uso de RNC-P como base direta de implementação sem prova de cálculo contestável.

#### Intake ratificado: Gate Consolidado v1 — não constitui O.S.

> Cabe ao CTO decompor os pacotes abaixo em O.S. técnicas isoladas. Governança não autoriza implementação direta por esta lista.

- [x] **GATE-GOV** | Arquitetura, taxonomia, suíte inicial, retenção, limites e promoção ratificados.
- [x] **GATE-MANIFEST** | Manifesto JSON, schema, registros de classificação e validação semântica implantados pela INF-028-A.
- [x] **GATE-EXECUTOR** | Executor Node único e comandos `test:core`, `test:browser`, `test:regression` implantados pela INF-028-B.
- [x] **GATE-CI-SHADOW** | Jobs core/browser paralelos, agregador e artifacts implantados pela INF-028-C; GREEN pós-merge em `dd83008`.
- [ ] **GATE-OBSERVATION** | Intake para **O.S. própria do CTO**: mínimo de sete dias, três execuções independentes no mesmo SHA, novo ciclo PR→merge→push, comparação legada, auditoria de artifacts e parecer QA. Evidência apenas; proibido alterar branch protection.
- [ ] **GATE-REQUIRED** | **O.S. futura e separada**, bloqueada até aceite da observação. Ativação manual do required check somente após veredito QA e autorização explícita do CEO; nenhuma ativação automática.
- [ ] **GATE-PROMOTION-049** | Promover os dois testes O.S. 049/050 somente após `navigationErrors=[]` e toda a evidência exigida.

___

### 🚦 FASE 8: CD Staging (FUTURO — NÃO ATIVO)
- [ ] **O.S. #INF-030** | `[ALTA]` Criar deploy automático para ambiente de staging somente após estabilização de CI + PR + CodeRabbit + artifacts.

___

### 🚀 FASE 9: CD Produção (FUTURO — NÃO ATIVO)
- [ ] **O.S. #INF-031** | `[CRÍTICA]` Avaliar CD para produção apenas depois de staging validado, contratos de erro estabilizados, testes visuais in-browser maduros e aprovação explícita do CEO.

___

### 🔐 INTAKE DE GOVERNANÇA: AUD-2026-003 / CodeRev

> [!warning] **Não constitui O.S.**
> A Governança validou os achados e publicou o plano em `docs/AUD-2026-003_CodeRev_Remediacao.md`. Cabe ao CTO decompor os pacotes `CRV-P0` a `CRV-P4` em O.S. isoladas, respeitando RED→GREEN, Tribunal independente, PR obrigatório e autorização de merge pelo CEO.

- [ ] **CRV-P0** | Encerrar incidente de credenciais: revogação, rotação, limpeza coordenada do histórico e detector de segredos no gate de PR.
- [ ] **CRV-P1** | Corrigir XSS estrutural comprovado e estabelecer comandos oficiais de teste/auditoria.
- [ ] **CRV-P2** | Classificar testes e artifacts antes de qualquer exclusão; corrigir capturas duplicadas e extrair setup compartilhado.
- [ ] **CRV-P3** | Decompor `ui_render.js`, eliminar polling de lifecycle e reduzir globais em entregas incrementais.
- [ ] **CRV-P4** | Validar cientificamente diferenças BT/MT e formalizar limitações MVP antes de alterar motores.
