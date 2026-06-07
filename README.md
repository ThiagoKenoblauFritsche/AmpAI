# ⚡ AmpAI — Mapeamento Técnico de Engenharia Elétrica

SaaS inovador focado em automação de cálculos e memoriais de engenharia elétrica (Baixa e Média Tensão) sob as normas internacionais IEC.

## 🛠️ Stack Tecnológica e Arquitetura (v5.0)
- **Frontend / Interface:** Single Page Application (SPA) pura em HTML5, Tailwind CSS e Chart.js (`index.html`).
- **Motor Matemático (Backend Lógico):** JavaScript Puro isolado (`js/core_cabos_mt.js` e `js/core_cabos_bt.js`), retornando estritamente contratos JSON.
- **Motor de UI / Reatividade:** Manipulação segura do DOM (`js/ui_render.js`).
- **Qualidade (QA):** Muralha TDD in-browser obrigatória para deploy (Calibração Red -> Green local).
- **Infraestrutura de IA:** Antigravity CLI rodando em modo Headless autenticada via Google AI Pro.

## 🔄 Canal de Sincronização Móvel
O projeto opera com o protocolo Loop Semântico Infinito v5.0, alimentando a base RAG do Google NotebookLM via script `sync.ps1`.
