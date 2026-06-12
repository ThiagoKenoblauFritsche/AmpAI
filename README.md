# ⚡ AmpAI — Mapeamento Técnico de Engenharia Elétrica

SaaS inovador focado em automação de cálculos e memoriais de engenharia elétrica (Baixa e Média Tensão) sob as normas internacionais IEC.

## 🛠️ Stack Tecnológica e Arquitetura (v6.0 - Topologia Híbrida)
- **Frontend / Interface:** Single Page Application (SPA) pura em HTML5 e Tailwind CSS (`index.html`). Otimizada com `@media print` para exportação de memoriais corporativos.
- **Motor Matemático (Backend Lógico):** JavaScript Puro isolado e estéril (`js/core_cabos_mt.js` e `js/core_cabos_bt.js`). **Proibida qualquer leitura/escrita de DOM.** Retornam estritamente contratos JSON tipados com precisão decimal fixa da IEC.
- **Motor de UI / Reatividade:** Manipulação segura do DOM centralizada em `js/ui_render.js` com rigoroso *Null Pointer Mitigation* (`if (el)`).
- **Topologia de Execução (Air Gap Epistemológico):** 
  - **Fábrica Local:** Escreve código e valida física no SI.
  - **Tribunal na Nuvem (Antigravity VPS):** Executa o TDD de forma hermética. A máquina local nunca audita seu próprio código.

## 🔄 Canal de Sincronização Móvel
O projeto opera com o protocolo Loop Semântico Infinito v6.0, alimentando a base RAG do Google NotebookLM via script `sync.ps1`.
