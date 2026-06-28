---
tags: [gestao/painel, ampai/governanca]
versao: 7.0
status: ativo
---

# ⚡ AmpAI — Painel de Controle e Governança

## Matriz definitiva de agentes

| Poder | Persona | Responsabilidade | Modelo / habitat |
| --- | --- | --- | --- |
| Memória | NotebookLM | RAG, normas, atas e brainstorming; sem produção | NotebookLM / `sync.ps1` |
| Legislativo/Judiciário | @Arquiteto_Chefe_e_Governanca | Manifesto, arquitetura, auditoria e documentos raiz; sem O.S. | GPT-5.5 / ChatGPT Plus isolado |
| Executivo | @CTO | Roadmap, backlog, SDD e O.S. | GPT-5.5 / ChatGPT Plus isolado |
| Estratégia | @Negocios_e_Estrategia | Produto, viabilidade e backlog comercial | GPT-5.4 / ChatGPT Plus isolado |
| Ciência | @Engenheiro_Eletricista | RNC-P/RNC-C, IEC, BDD, memorial, prova de cálculo contestável e limites físicos | Claude Opus 4.8 Extended Thinking / Claude Code Pro isolado |
| Fábrica | @Senior_Backend_Dev | DDD e `js/core_*.js`; zero DOM | Claude Opus 4.8 / Claude Code local |
| Fábrica | @Senior_Frontend_Dev | `index.html`, Tailwind e `js/ui_render.js` | Claude Sonnet 4.6 / Claude Code local |
| Tribunal | @Senior_QA_Security | RED/GREEN, ZOMBIES, mutation testing, artifacts CI e evidências | GPT-5.5 / Codex em terminal isolado + GitHub Actions CI |

**Regra:** uma persona por chat/thread. O CEO aprova direção e merge; o CTO emite O.S.; Governança não emite O.S. e não executa a fábrica.

## Fluxo de controle

`NotebookLM/CEO → Governança (quando houver impacto nas leis) → CTO → especialista → QA/Codex → PR → GitHub Actions CI → CodeRabbit complementar → CEO (merge)`

Uma entrega elegível para PR possui BDD/SDD aplicável, teste RED registrado, implementação GREEN, `exit code` bem-sucedido e documentação atualizada. Para a `Refat_Frontend`, a entrega só é elegível para `main` após PR, GitHub Actions verde, artifact de evidência validado pelo QA e revisão complementar do CodeRabbit quando habilitado.

CI é parte oficial do Tribunal QA. CD staging e CD produção permanecem fases futuras; não devem ser tratados como fluxo ativo.

## Estrutura física

- BDD: `docs/features/`
- SDD: `docs/api/`
- RNC-P: `docs/normas/` quando o Markdown for extraído/limpo de norma, livro ou guia técnico
- RNC-C: `docs/engenharia/` ou documento explicitamente curado com fonte, escopo, equações, unidades, premissas, limites e regras QA
- Core matemático: `js/core_*.js`
- UI: `js/ui_render.js`
- Testes e evidências: `tests/`
- CI de Tribunal: `.github/workflows/`
- Governança: `docs/AmpAI_Engineering_Manifesto.md`, `docs/AmpAI_OS_Workflow.md` e `.github/workflows/AGENTS.md`
