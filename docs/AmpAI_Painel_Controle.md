---
tags:
  - gestao/painel
  - ampai/governança
versao: 5
status: ativo
---

# ⚡ AmpAI — Painel de Controle e Governança

> [!info] **Definição do Sistema**
> Central de comando, rastreabilidade e histórico do ecossistema AmpAI. Este arquivo atua como o elo de ligação entre os requisitos de engenharia, a infraestrutura de agentes e o código em produção.

---

## 👥 1. Infraestrutura e Governança de IA
- **Configuração de Orquestração:** Repositório Git (`github/`)
- **Motor de Runtime / Automação:** `Antigravity CLI (agy)` rodando nativo na VPS Hetzner.
- **Licença Operacional:** Google AI Pro (`thiagokenoblaufritsche@gmail.com`).

### 🏢 Diretoria de Agentes Ativa (Workspace Antigravity v5.0)
- **@CEO:** `Gemini 3.1 Pro (High)` (Gatekeeper comercial e aprovação final).
- **@CTO:** `Claude Sonnet 4.6 (Thinking)` (Arquiteto de Software e Contratos JSON).
- **@Engenheiro_Eletricista:** `Claude Opus 4.6 (Thinking)` (Rigor Científico IEC).
- **@Hermes_Executive_Dev:** `Claude Sonnet 4.6 (Thinking)` (Mestre de Obras e Gateway Móvel. Não escreve código).
- **@Senior_Backend_Dev:** `Claude Sonnet 4.6 (Thinking)` (Lógica pesada e matemática. Zero manipulação de DOM).
- **@Senior_Frontend_Dev:** `Claude Sonnet 4.6 (Thinking)` (Reatividade segura e arquitetura visual).
- **@Senior_QA_Security:** `Claude Opus 4.6 (Thinking)` (Muralha TDD Física In-Browser).

---

## 🗃️ 2. Base de Conhecimento (Motores de Engenharia)
Habilidades analíticas e critérios de dimensionamento extraídos e consolidados no ecossistema:

*   **Motor de Curto-Circuito (IEC 60909):** Decomposição de matrizes de impedância de sequência.
*   **Motor de Cabos BT (IEC 60364-5-52):** Condução térmica e fatores de correção por agrupamento.

---

## 🛠️ 3. Status dos Módulos da Plataforma

### 🟢 Operacionais e Modularizados
- [x] **Módulo 1: Curto-Circuito Trifásico Simétrico** 
	- *Norma:* IEC 60909-0
	- *Escopo:* Decomposição de sequência zero por Vector Group ($\text{Dyn11}$, $\text{Yzn5}$, $\text{Ynyn}$). Gráfico de sensibilidade via Chart.js.
- [x] **Módulo 2: Dimensionamento de Cabos BT**
	- *Norma:* IEC 60364-5-52
	- *Escopo:* Matriz de 224 valores, Fatores FCA e FCT. Convergência por critério dominante. Proteção XSS via utilitário `sanitize()`.
- [x] **Módulo 3: Dimensionamento de Cabos MT**
	- *Norma:* IEC 60502-2 (6 kV a 30 kV)
	- *Escopo:* Critério de Curto-Circuito Adiabático para condutor e blindagem de cobre (tela metálica). Isolamento completo de escopo (O.S. #INF-005).
 - [x] **O.S. #003 (Bug #01):** Correção da reatividade da UI nas abas inferiores do módulo de Média Tensão.

### 🟡 Em Desenvolvimento (Sprint Ativa - Correção de Bug)


### 🔴 Backlog (Próximas Etapas)
- [ ] **Módulo 4: Derating por Altitude** (Correções térmicas e dielétricas acima de 1000m).
- [ ] **Módulo 5: Ocupação de Calhas e Eletrodutos** (Taxa de preenchimento físico com base na IEC 60364-5-52 Tabelas 52).
- [ ] **Módulo 6: Tradução e Localização Internacional** (Ativação do `.lang-switcher` para PT-BR, EN, ES nos memoriais A4).

---

## 📂 4. Documentação e Estrutura Física Remota (VPS)
- **Especificação Geral:** Arquivo `README.md` na raiz do repositório Git.
- **Interface Gráfica (SPA):** `index.html` (Estrutura visual limpa na raiz).
- **Lógica Matemática Isolada:** `js/core_cabos_mt.js` (Física pura).
- **Renderização e UI:** `js/ui_render.js` (Manipulação reativa do DOM).
