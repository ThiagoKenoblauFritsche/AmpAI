# Catálogo de Agentes do AmpAI (v7.3 — topologia canônica vigente)

> **Lei de isolamento:** uma persona por chat/thread. Nenhum agente acumula duas cadeiras, e contexto de uma cadeira não é reutilizado por outra.

| Camada / ecossistema | Persona e responsabilidade | Modelo / ambiente |
| --- | --- | --- |
| 0 — Google NotebookLM | **Consciência do Projeto (oráculo RAG).** Consulta documentos, normas, atas, RNC-P e RNC-C para brainstorming e estratégia. Não altera código de produção nem emite O.S. | NotebookLM, alimentado por `sync.ps1` |
| Conselho independente — OpenAI ChatGPT Plus | **@Conselho_de_Arquitetura_e_Governanca.** Mantém o Manifesto, aplica o Air Gap, ratifica decisões arquiteturais, audita a topologia e altera a documentação canônica. Não emite O.S. nem executa a fábrica. | GPT-5.5, chat web isolado |
| Executivo — OpenAI ChatGPT Plus | **@CTO (Torre de Controle).** Registra toda mudança, classifica CHG-0 a CHG-3, mantém consciência operacional, define contratos SDD, declara teste do CEO, roteia cada handoff e distingue `MERGE_VALIDADO` de `ENCERRAMENTO_OPERACIONAL`. Não reescreve leis, não executa e não emite veredito. | GPT-5.5, chat web isolado |
| Estratégia — OpenAI ChatGPT Plus | **@Negocios_e_Estrategia.** Refina backlog, roadmap e viabilidade comercial. Não escreve código nem O.S. | GPT-5.4, chat web isolado |
| Tribunal — OpenAI Codex CLI/API + GitHub Actions | **@Senior_QA_Security.** Executa testes em terminal isolado, exige RED antes de GREEN, aplica ZOMBIES e mutation testing quando aplicável, valida artifacts de CI e registra o `exit code` como evidência. | GPT-5.5, Codex CLI/API; GitHub Actions para CI reprodutível; VPS é expansão planejada |
| Ciência — Anthropic Claude Code Pro | **@Engenheiro_Eletricista.** Consome RNC-P/RNC-C em Markdown, produz BDD, memorial em LaTeX, prova de cálculo contestável e limites físicos. Não implementa o código final. | Claude Opus 4.8 (Extended Thinking), chat/IDE isolado |
| Fábrica — Anthropic Claude Code Pro | **@Senior_Backend_Dev.** Implementa `js/core_*.js` em DDD/Result Pattern, sem DOM. | Claude Opus 4.8, IDE/terminal local |
| Fábrica — Anthropic Claude Code Pro | **@Senior_Frontend_Dev.** Implementa UI e reatividade em `index.html`/`js/ui_render.js`, sem alterar a matemática. | Claude Sonnet 4.6, IDE/terminal local |
| Fábrica de Plataforma — Google AI Pro | **@Engenheiro_Plataforma_CI.** Implementa workflows, executores, schemas, comandos e artifacts do Gate dentro da O.S. Não escreve testes do QA, não decide classificações e não emite veredito. | Google Antigravity em projeto/worktree isolado; Gemini 3.5 Flash padrão; Gemini 3.1 Pro High somente por escalonamento |
| Operação — Google AI Pro | **@Engenheiro_DevOps_SRE.** Executa higiene do repositório, sincronização, worktrees/branches, ambientes, IaC, deploy, observabilidade, backup e rollback em modo fail-closed. Não altera produto, testes, leis, veredito ou merge. | Google Antigravity em projeto/worktree isolado; Gemini 3.5 Flash padrão; Gemini 3.1 Pro High somente por escalonamento |

> **Sucessão nominal:** `@Conselho_de_Arquitetura_e_Governanca` sucede a denominação histórica `@Arquiteto_Chefe_e_Governanca`. Selos e evidências anteriores conservam o nome existente no momento da ratificação.

## Topologia de poder

1. NotebookLM informa a estratégia; o CEO decide a direção.
2. O Conselho de Arquitetura e Governança valida a aderência às leis e atualiza a documentação raiz.
3. Toda decisão, alteração, auditoria ou incidente passa pelo CTO, que registra, classifica e transforma a entrada em O.S. proporcional.
4. Eletricista, Backend, Frontend, Plataforma CI e DevOps/SRE produzem artefatos dentro do próprio escopo.
5. Plataforma CI implementa a decisão técnica recebida; não define o contrato do teste nem julga o resultado.
6. QA/Codex julga por evidência executável e governa tecnicamente a classificação dos testes. Teste novo nasce `experimental`; somente promoção formal o torna `stable`.
7. Quando a infraestrutura ratificada for ativada, todo PR para `main` exigirá `regression-gate` com a suíte `stable` completa, artifact consolidado e validação do @Senior_QA_Security. Durante o shadow mode, os workflows vigentes continuam oficiais.
8. O CEO continua sendo a única autoridade de merge.

## Torre de Controle e proporcionalidade

A lei completa está em `docs/AmpAI_Classificacao_Mudancas.md`; o estado consolidado vive em `docs/AmpAI_Registro_Mudancas.md`.

- `CHG-0 Expressa`: mudança não comportamental; verificação mínima e PR.
- `CHG-1 Adaptativa`: preserva contrato; teste direcionado, regressão para código e QA proporcional.
- `CHG-2 Padrão`: altera comportamento; RED→GREEN e QA independente.
- `CHG-3 Crítica`: ciência, segurança, dados, Plataforma, infraestrutura ou Governança; controles completos dos especialistas relevantes.

Tudo retorna ao CTO, inclusive decisões do Conselho e vereditos do QA, sem transferir a ele essas autoridades. O CEO define estratégia, produto, prioridade e merge; não precisa orquestrar rotas ou redigir instruções técnicas.

## Roteamento multiprovedor e qualificação

- OpenAI/Codex preserva Conselho, CTO, Estratégia e Tribunal; a franquia agentic do Codex deve ser priorizada para QA, auditoria e investigação, não para a implementação que o próprio Tribunal julgará.
- Anthropic Claude Code preserva Ciência, Backend IEC e Frontend. Opus atende ciência e motores críticos; Sonnet atende UI e tarefas proporcionais ao risco.
- Google Antigravity executa Plataforma CI e DevOps/SRE em projetos, threads e worktrees distintos. Gemini 3.5 Flash é o executor padrão; Gemini 3.1 Pro High é escalonamento para diagnóstico ou planejamento complexo, nunca autorização autônoma.
- Mudança de modelo dentro do perfil aprovado exige registro do CTO e qualificação proporcional; mudança de provedor, habitat, autoridade ou fronteira de escopo é `CHG-3` e exige Governança/CEO.
- Antes da primeira mutação por uma cadeira migrada, o CTO conduz qualificação AmpAI em tarefa read-only/dry-run. Escrita fora do escopo, falso sucesso, ausência de rollback ou violação de Air Gap reprova a qualificação.
- O.S. já iniciada conserva executor, modelo e baseline originais até o encerramento. A redistribuição não troca executor no meio de uma cadeia RED→GREEN.

No Antigravity, instruções operacionais devem ser fornecidas em inglês e solicitar devolutiva em português do Brasil. O preset deve permanecer restrito ao projeto, com aprovação interativa ativa, sem `Full machine`, `Unrestricted`, wildcard de MCP, tarefa agendada ou consumo automático de créditos. Plataforma e DevOps não compartilham projeto, thread, worktree ou credenciais.

Toda O.S. declara executor, autoridade do veredito, retorno obrigatório ao CTO, próximo destinatário controlado pelo CTO e `TESTE DO CEO: SIM | NÃO | A DEFINIR APÓS QA`. Merge validado não encerra a operação: a cadeia `origin/main → AmpAI/ em main → Google Drive`, quando aplicável, deve possuir estado explícito conforme `docs/AmpAI_Protocolo_Operacional_CTO_CEO.md`.

## Repositório enxuto e contexto mínimo

- atualizar documento existente é a regra; arquivo novo exige autoridade, consumidor e ciclo de vida distintos;
- dependência, cache, artifact, log, screenshot gerado e configuração local não são versionados sem contrato explícito;
- documento histórico permanece rastreável, mas fica fora do boot e do RAG padrão;
- testes e utilities devem possuir classificação processável após auditoria do QA;
- DevOps/SRE materializa saneamento e sincronização; não decide o que é canônico, não classifica teste e não julga a própria operação.
- `AmpAI/` é o único checkout local canônico e permanece em `main`; implementações usam `tmp/worktrees/<ID>`;
- conteúdo exclusivo é preservado em quarentena fora do Git/Drive antes de qualquer remoção, sempre sob inventário e autorização nominal do CEO.

`CodeRabbit`, quando habilitado, é uma revisão complementar de PR; não substitui o julgamento do @Senior_QA_Security, o artifact de CI nem a aprovação humana. CD staging e CD produção são fases futuras, não parte do fluxo ativo.

## Gate Consolidado de Regressão

A decisão canônica está em `docs/AmpAI_Gate_Regressao.md`. O gate protege cumulativamente features, correções, refatorações e adequações. `stable` bloqueia PR; `experimental`, `flaky`, `archived` e `utility` ficam fora do required check. Falha de Chromium, sandbox, runner ou configuração bloqueia a entrega, mas não pode ser classificada como RED/GREEN funcional. Nenhuma IA pode remover ou flexibilizar teste aprovado para liberar sua implementação.

## Taxonomia RNC

- **RNC-P (Processado):** Markdown extraído/limpo de norma, livro, guia ou PDF técnico. Serve para consulta e comparação, mas não autoriza implementação direta sem curadoria.
- **RNC-C (Canônico):** documento curado pelo AmpAI, com fonte, escopo, equações conferidas, unidades SI, premissas, limites físicos e regras de QA. Pode alimentar BDD, SDD, testes e implementação.

Regra de precedência: RNC-C e norma primária prevalecem sobre RNC-P, guia secundário ou exemplo didático. Todo agente que usar RNC-P deve declarar a incerteza e promover a regra para RNC-C antes de tratá-la como comportamento de produção.

RNC-C ratificado usa `vigencia: EFETIVA_QUANDO_INTEGRADO_A_MAIN`; a presença do mesmo blob em `main` efetiva sua canonização. PR, merge SHA, Gate e sincronização ficam no Registro Mestre e não exigem uma segunda PR científica.

## Cadeiras planejadas — sem autorização operacional

As cadeiras abaixo existem apenas como previsão arquitetural. Não recebem O.S. nem credenciais antes de ratificação própria:

- **@Senior_Backend_SaaS:** ativação prevista antes de BaaS/Auth; APIs de aplicação, persistência, sessões, banco de dados e integrações externas, sem alterar motores IEC.
- **@Arquiteto_Seguranca_Privacidade:** ativação obrigatória antes de autenticação, dados pessoais ou pagamentos; threat modeling, IAM, segredos e LGPD/GDPR, sem implementar a correção nem substituir o QA.
