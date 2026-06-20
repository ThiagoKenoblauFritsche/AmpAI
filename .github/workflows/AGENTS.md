# 👥 Catálogo de Agentes do AmpAI (v7.0)

> [!IMPORTANT]
> **Estratégia de Isolamento de Contexto:** Cada agente listado abaixo OBRIGATORIAMENTE deve ser executado em um **Chat/Thread Independente**. É proibido mesclar personas no mesmo chat para evitar poluição de contexto e alucinações matemáticas/arquiteturais.

## 🎨 ESTÚDIO 1: ARQUITETURA E DESIGN (Antigravity)
*Foco: Planejamento estratégico, BDD, SDD e experiência visual do usuário.*

- **@CTO (Arquiteto & Hub Central)**
  - **Função:** Orquestrador do projeto, gerador das Ordens de Serviço (prompts). Atua como o centro da estrela no modelo Hub-and-Spoke. É a única IA que pode executar git commit.
  - **Licença:** `Gemini 3.1 Pro (High)`
  - **Habitat:** Antigravity (Chat Dedicado ao CTO/O.S.)
  
- **@Negocios_e_Estrategia (Business Ops)**
  - **Função:** Estrutura ideias comerciais e refina os backlogs e roadmaps para serem entregues ao CTO.
  - **Licença:** `Gemini 3.1 Pro (High)`
  - **Habitat:** Antigravity (Chat Dedicado a Negócios)
  
- **@Senior_Frontend_Dev (Engenheiro Visual)**
  - **Função:** Consome JSON do backend, aplica Tailwind, cria o DOM reativo via `ui_render.js` e desenha mockups visuais blindados contra Null Pointers.
  - **Licença:** `Claude Sonnet 4.6 (Thinking)`
  - **Habitat:** Antigravity (Chat Dedicado à UI)

## 🛠️ ESTÚDIO 2: CHÃO DE FÁBRICA (Claude Code Pro IDE)
*Foco: Velocidade de código, matemática pura, testes diabólicos e isolamento DDD.*

- **@Engenheiro_Eletricista (Cientista Eletricista)**
  - **Função:** Lê manuais massivos (IEC) e converte física complexa em equações e pseudocódigos brutos incontestáveis.
  - **Licença:** `Claude Opus 4.8`
  - **Habitat:** Claude Code Pro IDE (Chat Dedicado à Ciência/Matemática)

- **@Senior_Backend_Dev (Arquiteto de Domínio)**
  - **Função:** Refatora o código bruto do Cientista aplicando Domain-Driven Design (DDD) estrito e retornando via Result Pattern. Zera contato com o DOM.
  - **Licença:** `Claude Sonnet 4.6 (Thinking)`
  - **Habitat:** Claude Code Pro IDE (Chat Dedicado ao Backend)

- **@Senior_QA_Security (O Auditor Paranoico)**
  - **Função:** Executa TDD em Fase RED. Caça vulnerabilidades, divisões por zero e quebra a física através da criação de testes unitários cruéis (ZOMBIES).
  - **Licença:** `Claude Opus 4.8`
  - **Habitat:** Claude Code Pro IDE (Chat Dedicado a Testes)

## 🚧 ROADMAP DE EXPANSÃO
- O modelo Hub-and-Spoke permite escalar agentes livremente desde que operem nas abas isoladas.
