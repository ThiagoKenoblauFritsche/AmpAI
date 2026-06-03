# ⚡ AmpAI — Mapeamento Técnico de Engenharia Elétrica

SaaS inovador focado em automação de cálculos e memoriais de engenharia elétrica (Baixa e Média Tensão) sob as normas internacionais IEC.

## 🛠️ Stack Tecnológica e Arquitetura (v4.2)
- **Frontend / Interface:** Single Page Application (SPA) pura em HTML5, Tailwind CSS e Chart.js (`index.html`).
- **Motor Matemático Isolado:** JavaScript Puro (`js/core_cabos_mt.js`) sob a norma IEC 60502-2.
- **Motor de UI / Reatividade:** Manipulação direta do DOM (`js/ui_render.js`).
- **Infraestrutura de IA:** Antigravity CLI Oficial da Google rodando em modo Headless autenticada via cota **Google AI Pro**.

## 🔄 Canal de Sincronização Móvel
O projeto opera com o protocolo Loop Semântico Infinito v4.2, alimentando a base de conhecimento RAG do Google NotebookLM através de um canal exclusivo de Auto-Sync de arquivos de texto (.txt) hospedados no Meu Drive.
