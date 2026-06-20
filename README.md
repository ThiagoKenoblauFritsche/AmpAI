# ⚡ AmpAI — Motor de Engenharia Elétrica

SaaS de missão crítica focado na automação rigorosa de cálculos e memoriais de engenharia elétrica (Baixa e Média Tensão) balizado inteiramente sob normas internacionais (IEC).

## 🛠️ Stack Tecnológica e Arquitetura (v7.0 - TDD Purista)
A arquitetura do projeto foi reformulada para garantir que a IA gere código livre de alucinações matemáticas.

- **Frontend / Interface:** Single Page Application (SPA) pura em HTML5 e Tailwind CSS (`index.html`). Otimizada com `@media print` para exportação de memoriais corporativos.
- **Motor Matemático (Backend Lógico):** JavaScript Puro isolado e estéril (`js/core_*.js`). **Proibida qualquer manipulação de DOM.** Os motores retornam estritamente o *Result Pattern* com precisão decimal fixa baseada na física real (IEC 60909, etc).
- **Motor de UI / Reatividade:** Manipulação segura do DOM centralizada em `js/ui_render.js` com rigoroso *Null Pointer Mitigation* (`if (el)`).
- **A Esteira CI/CD (As 7 Fases do TDD):** 
  - O código é gerado localmente pelo **Claude Code CLI**, que opera estritamente nas Fases BDD -> TDD Red -> TDD Green.
  - A Nuvem do GitHub hospeda o **CodeRabbit**, um auditor autônomo que varre os *Pull Requests* caçando divisões por zero ou violações físicas baseadas nas regras do `.coderabbit.yaml`.

## 🔄 RAG e Contexto (Docs as Code)
Nós utilizamos uma abordagem de **Injeção Federada**. Os manuais (como a IEC 60909) vivem localmente em `docs/normas/` em formato puro (Markdown). 
O humano estuda os dados via **Google NotebookLM**, que é sincronizado unidirecionalmente pelo script `sync.ps1`. A IA da engenharia (Claude) lê direto da máquina local, abolindo latência de rede e Bancos Vetoriais complexos.

## 🚀 ROADMAP: Fase 2 (Headless VPS)
No futuro (v8.0), o ambiente local do Claude Code será migrado para uma VPS Headless. A operação das Ordens de Serviço (OS) será interceptada remotamente pelo Telegram, permitindo comandar a fábrica de software de qualquer lugar via celular.
