---
tags:
  - gestao/painel
  - ampai/governança
versao: 6
status: ativo
---

# ⚡ AmpAI — Painel de Controle e Governança

> [!info] **Definição do Sistema**
> Central de comando, rastreabilidade e histórico do ecossistema AmpAI. Este arquivo atua como o elo de ligação entre os requisitos de engenharia, a infraestrutura de agentes e o código em produção.

---

## 👥 1. Infraestrutura e Governança de IA (v7.0)
- **Configuração de Orquestração:** Repositório Git (`github/`) e Manifesto de Engenharia (`docs/AmpAI_Engineering_Manifesto.md`).
- **Motor de Runtime / Automação:** `Antigravity CLI (agy)` rodando nativo na VPS Hetzner e `Claude Code` na Cloud Factory.
- **Licença Operacional:** Google AI Pro e Anthropic Pro.

### 🏢 **Diretoria de Agentes (Topologia Híbrida SaaS)**
- **@CEO:** `Gemini 3.1 Pro (High)` (Gatekeeper comercial e aprovação final).
- **@CTO:** `Claude Sonnet 4.6 (Thinking)` (Arquiteto de Software SDD).
- **@Engenheiro_Eletricista:** `Claude Opus 4.6 (Thinking)` (Rigor Científico BDD/Gherkin).
- **@Hermes_Executive_Dev:** `Claude Sonnet 4.6 (Thinking)` (Gateway Móvel. Não escreve código).
- **@Senior_Backend_Dev:** `Claude Sonnet 4.6 (Thinking)` (DDD puro e Result Pattern).
- **@Senior_Frontend_Dev:** `Claude Sonnet 4.6 (Thinking)` (Reatividade segura e arquitetura visual).
- **@Senior_QA_Security:** `Claude Opus 4.6 (Thinking)` (Muralha TDD Física ZOMBIES).

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
- [ ] **Fase 7:** Separação de CI/CD e Nginx (Fábrica vs Tribunal).
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
