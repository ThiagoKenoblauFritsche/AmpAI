---
tags:
  - gestao/painel
  - ampai/governança
versao: 7
status: ativo
---

# ⚡ AmpAI — Painel de Controle e Governança

> [!info] **Definição do Sistema**
> Central de comando, rastreabilidade e histórico do ecossistema AmpAI. Este arquivo atua como o elo de ligação entre os requisitos de engenharia, a infraestrutura de agentes e o código em produção.

---

## 👥 1. Infraestrutura e Governança de IA (v7.0)
- **Configuração de Orquestração:** Repositório Git (`github/`) e Manifesto de Engenharia (`docs/AmpAI_Engineering_Manifesto.md`).
- **Motor de Runtime / Automação:** `Antigravity` (Planejamento) e `Claude Code Pro IDE` (Execução).
- **Licença Operacional:** Anthropic Pro e Google AI Pro.

### 🏢 **Diretoria de Agentes (Isolamento de Contexto)**
*Regra Operacional: 1 Persona = 1 Chat Exclusivo. Nunca misture contextos.*

**🎨 Estúdio 1: Arquitetura & Design (Antigravity)**
- **@CTO:** `Gemini 3.1 Pro (High)` (Chat próprio: Geração de O.S. e SDD).
- **@Senior_Frontend_Dev:** `Claude Sonnet 4.6` (Chat próprio: Reatividade e UX Visual).

**🛠️ Estúdio 2: Chão de Fábrica TDD (Claude Code Pro IDE)**
- **@Engenheiro_Eletricista:** `Claude Opus 4.8` (Chat próprio: Fórmulas rigorosas BDD/Gherkin).
- **@Senior_Backend_Dev:** `Claude Sonnet 4.6` (Chat próprio: DDD puro e Result Pattern).
- **@Senior_QA_Security:** `Claude Opus 4.8` (Chat próprio: Muralha TDD Física ZOMBIES).

**☁️ Gatekeepers (Humanos/Nuvem)**
- **@CEO:** Humano (Você). Autoridade máxima para aprovação de PRs e operação de multi-chats.
- **@CodeRabbit:** IA na Nuvem (Auditor CI/CD final de Pull Requests).

---

## 🗃️ 2. Base de Conhecimento (Motores de Engenharia)
Habilidades analíticas e critérios de dimensionamento extraídos e consolidados no ecossistema:

*   **Motor de Curto-Circuito (IEC 60909):** Decomposição de matrizes de impedância de sequência.
*   **Motor de Cabos BT (IEC 60364-5-52):** Condução térmica e fatores de correção por agrupamento.
*   **Motor de Cabos MT (IEC 60502-2):** Curto-Circuito Adiabático para condutor e blindagem.

---

## 🛠️ 3. Status dos Módulos da Plataforma

### 🟢 Operacionais e Modularizados
- [x] **Módulo 1: Curto-Circuito Trifásico Simétrico** 
- [x] **Módulo 2: Dimensionamento de Cabos BT**
- [x] **Módulo 3: Dimensionamento de Cabos MT**
- [x] **O.S. #003 (Bug #01):** Correção da reatividade da UI nas abas inferiores do módulo de Média Tensão.

### 🟡 Em Desenvolvimento (Sprint Ativa SaaS v7.0)
- [ ] **Fase 7:** CI/CD Local com CodeRabbit e Claude Code.
- [ ] **Fase 8:** Criação dos Cenários Gherkin e SDD/OpenAPI para todos os módulos existentes.

### 🔴 Backlog (Próximas Etapas Comerciais)
- [ ] **Fase 9:** Login de Usuários, Supabase e Gestão Multi-Tenant.
- [ ] **Fase 10:** Sistema de Cobrança por Token (Stripe/Tokenomics).

---

## 📂 4. Documentação e Estrutura Física
- **Manifesto de Engenharia:** `docs/AmpAI_Engineering_Manifesto.md`
- **Master Roadmap:** `docs/AmpAI_Master_Roadmap_SaaS.md`
- **Especificações BDD:** `docs/features/`
- **Contratos de API (SDD):** `docs/api/`
- **Lógica Matemática Isolada:** `js/core_cabos_mt.js` (Física pura).
- **Renderização e UI:** `js/ui_render.js` (Manipulação reativa do DOM).
