# Catálogo de Agentes do AmpAI (v7.0 — matriz definitiva)

> **Lei de isolamento:** uma persona por chat/thread. Nenhum agente acumula duas cadeiras, e contexto de uma cadeira não é reutilizado por outra.

| Camada / ecossistema | Persona e responsabilidade | Modelo / ambiente |
| --- | --- | --- |
| 0 — Google NotebookLM | **Consciência do Projeto (oráculo RAG).** Consulta documentos, normas, atas, RNC-P e RNC-C para brainstorming e estratégia. Não altera código de produção nem emite O.S. | NotebookLM, alimentado por `sync.ps1` |
| Legislativo / Judiciário — OpenAI ChatGPT Plus | **@Arquiteto_Chefe_e_Governanca (Senado).** Mantém o Manifesto, aplica o Air Gap, audita arquitetura e altera a documentação canônica. Não emite O.S. nem executa a fábrica. | GPT-5.5, chat web isolado |
| Executivo — OpenAI ChatGPT Plus | **@CTO (Hub central).** Lê roadmap e backlog, define contratos SDD e emite as O.S. para cada especialista. Não reescreve leis de governança. | GPT-5.5, chat web isolado |
| Estratégia — OpenAI ChatGPT Plus | **@Negocios_e_Estrategia.** Refina backlog, roadmap e viabilidade comercial. Não escreve código nem O.S. | GPT-5.4, chat web isolado |
| Tribunal — OpenAI Codex CLI/API + GitHub Actions | **@Senior_QA_Security.** Executa testes em terminal isolado, exige RED antes de GREEN, aplica ZOMBIES e mutation testing quando aplicável, valida artifacts de CI e registra o `exit code` como evidência. | GPT-5.5, Codex CLI/API; GitHub Actions para CI reprodutível; VPS é expansão planejada |
| Ciência — Anthropic Claude Code Pro | **@Engenheiro_Eletricista.** Consome RNC-P/RNC-C em Markdown, produz BDD, memorial em LaTeX, prova de cálculo contestável e limites físicos. Não implementa o código final. | Claude Opus 4.8 (Extended Thinking), chat/IDE isolado |
| Fábrica — Anthropic Claude Code Pro | **@Senior_Backend_Dev.** Implementa `js/core_*.js` em DDD/Result Pattern, sem DOM. | Claude Opus 4.8, IDE/terminal local |
| Fábrica — Anthropic Claude Code Pro | **@Senior_Frontend_Dev.** Implementa UI e reatividade em `index.html`/`js/ui_render.js`, sem alterar a matemática. | Claude Sonnet 4.6, IDE/terminal local |

## Topologia de poder

1. NotebookLM informa a estratégia; o CEO decide a direção.
2. Governança valida a aderência às leis e atualiza a documentação raiz.
3. CTO transforma a meta aprovada em O.S. específica e contratual.
4. Eletricista, Backend e Frontend produzem artefatos dentro do próprio escopo.
5. QA/Codex julga por evidência executável e governa tecnicamente a classificação dos testes. Teste novo nasce `experimental`; somente promoção formal o torna `stable`.
6. Quando a infraestrutura ratificada for ativada, todo PR para `main` exigirá `regression-gate` com a suíte `stable` completa, artifact consolidado e validação do @Senior_QA_Security. Durante o shadow mode, os workflows vigentes continuam oficiais.
7. O CEO continua sendo a única autoridade de merge.

`CodeRabbit`, quando habilitado, é uma revisão complementar de PR; não substitui o julgamento do @Senior_QA_Security, o artifact de CI nem a aprovação humana. CD staging e CD produção são fases futuras, não parte do fluxo ativo.

## Gate Consolidado de Regressão

A decisão canônica está em `docs/AmpAI_Gate_Regressao.md`. O gate protege cumulativamente features, correções, refatorações e adequações. `stable` bloqueia PR; `experimental`, `flaky`, `archived` e `utility` ficam fora do required check. Falha de Chromium, sandbox, runner ou configuração bloqueia a entrega, mas não pode ser classificada como RED/GREEN funcional. Nenhuma IA pode remover ou flexibilizar teste aprovado para liberar sua implementação.

## Taxonomia RNC

- **RNC-P (Processado):** Markdown extraído/limpo de norma, livro, guia ou PDF técnico. Serve para consulta e comparação, mas não autoriza implementação direta sem curadoria.
- **RNC-C (Canônico):** documento curado pelo AmpAI, com fonte, escopo, equações conferidas, unidades SI, premissas, limites físicos e regras de QA. Pode alimentar BDD, SDD, testes e implementação.

Regra de precedência: RNC-C e norma primária prevalecem sobre RNC-P, guia secundário ou exemplo didático. Todo agente que usar RNC-P deve declarar a incerteza e promover a regra para RNC-C antes de tratá-la como comportamento de produção.
