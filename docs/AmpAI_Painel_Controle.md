---
tags: [gestao/painel, ampai/governanca]
versao: 7.2
status: ativo
---

# ⚡ AmpAI — Painel de Controle e Governança

## Topologia canônica vigente

| Poder | Persona | Responsabilidade | Modelo / habitat |
| --- | --- | --- | --- |
| Memória | NotebookLM | RAG, normas, atas e brainstorming; sem produção | NotebookLM / `sync.ps1` |
| Conselho independente | @Conselho_de_Arquitetura_e_Governanca | Manifesto, arquitetura, ratificação, auditoria e documentos raiz; sem O.S. | GPT-5.5 / ChatGPT Plus isolado |
| Executivo / Torre de Controle | @CTO | Registro Mestre, classificação CHG-0 a CHG-3, roadmap, SDD, roteamento, O.S. e encerramento | GPT-5.5 / ChatGPT Plus isolado |
| Estratégia | @Negocios_e_Estrategia | Produto, viabilidade e backlog comercial | GPT-5.4 / ChatGPT Plus isolado |
| Ciência | @Engenheiro_Eletricista | RNC-P/RNC-C, IEC, BDD, memorial, prova de cálculo contestável e limites físicos | Claude Opus 4.8 Extended Thinking / Claude Code Pro isolado |
| Fábrica | @Senior_Backend_Dev | DDD e `js/core_*.js`; zero DOM | Claude Opus 4.8 / Claude Code local |
| Fábrica | @Senior_Frontend_Dev | `index.html`, Tailwind e `js/ui_render.js` | Claude Sonnet 4.6 / Claude Code local |
| Fábrica de Plataforma | @Engenheiro_Plataforma_CI | workflows, executores, schemas, comandos e artifacts; sem testes ou veredito | Claude Opus 4.8 / Claude Code local |
| Operação | @Engenheiro_DevOps_SRE | higiene do repositório, sincronização, worktrees/branches, ambientes, IaC, deploy, observabilidade, backup e rollback | Claude Opus 4.8 / terminal/worktree isolado |
| Tribunal | @Senior_QA_Security | RED/GREEN, ZOMBIES, mutation testing, artifacts CI e evidências | GPT-5.5 / Codex em terminal isolado + GitHub Actions CI |

**Regra:** uma persona por chat/thread. Toda entrada passa pelo CTO; o CEO aprova direção e merge; o Conselho não emite O.S. e não executa a fábrica. A denominação histórica `@Arquiteto_Chefe_e_Governanca` permanece apenas em selos anteriores à v7.1.

## Fluxo de controle

`origem/CEO/Conselho/QA → CTO (registro + CHG-0 a CHG-3) → especialista atual → CTO (novo encaminhamento) → PR/gates → CEO (aceite quando aplicável + merge) → pós-merge/sincronização → CTO (encerramento)`

Toda O.S. declara responsável atual, próximo destinatário, autoridade do veredito e `TESTE DO CEO: SIM | NÃO | A DEFINIR APÓS QA`. Todo resultado retorna ao CTO; o executor não escolhe a próxima persona. O protocolo canônico está em `docs/AmpAI_Protocolo_Operacional_CTO_CEO.md`.

Uma entrega elegível para PR possui BDD/SDD aplicável, teste RED registrado, implementação GREEN, regressões relacionadas preservadas, `exit code` bem-sucedido e documentação atualizada. O Gate Consolidado v1 está ratificado, mas deve passar por shadow mode antes de se tornar required check. Depois de ativado, todo PR para `main` executará a suíte `stable` completa e publicará artifact consolidado validado pelo QA.

CI é parte oficial do Tribunal QA. CD staging e CD produção permanecem fases futuras; não devem ser tratados como fluxo ativo.

O fluxo completo RED→GREEN é obrigatório para `CHG-2`/`CHG-3` comportamental. `CHG-0` usa verificação documental; `CHG-1` usa validação direcionada e regressão quando houver código. Código executável sempre preserva a suíte `stable`. Detalhes em `docs/AmpAI_Classificacao_Mudancas.md`.

## Estrutura física

- BDD: `docs/features/`
- SDD: `docs/api/`
- RNC-P: `docs/normas/` quando o Markdown for extraído/limpo de norma, livro ou guia técnico
- RNC-C: `docs/engenharia/` ou documento explicitamente curado com fonte, escopo, equações, unidades, premissas, limites e regras QA
- Core matemático: `js/core_*.js`
- UI: `js/ui_render.js`
- Testes e evidências: `tests/`
- Lei do gate cumulativo: `docs/AmpAI_Gate_Regressao.md`
- Controle futuro do gate: `qa/` (manifesto, schema e promoções, após implementação por O.S.)
- Registro operacional do CTO: `docs/AmpAI_Registro_Mudancas.md`
- Protocolo de roteamento, aceite e sincronização: `docs/AmpAI_Protocolo_Operacional_CTO_CEO.md`
- Política de ciclo de vida e contexto mínimo: seção 5 de `docs/AmpAI_Engineering_Manifesto.md`
- CI de Tribunal: `.github/workflows/`
- Governança: `docs/AmpAI_Engineering_Manifesto.md`, `docs/AmpAI_OS_Workflow.md` e `.github/workflows/AGENTS.md`

## Cadeiras planejadas, ainda inativas

| Gatilho | Persona futura | Escopo previsto |
| --- | --- | --- |
| Antes de BaaS/Auth | @Senior_Backend_SaaS | APIs de aplicação, persistência, sessões, banco e integrações |
| Antes de Auth/PII/Stripe | @Arquiteto_Seguranca_Privacidade | threat modeling, IAM, segredos e LGPD/GDPR |

Planejamento não concede permissão: cada cadeira exige ratificação documental própria antes de receber O.S. ou credenciais.

## Visão executiva mínima

O CEO deve receber do CTO uma visão única, derivada do Registro Mestre, contendo:

| Mudança/O.S. | Estado | Responsável atual | Próximo destinatário | Bloqueio | Teste CEO | Ação CEO | PR/artifact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<ID>` | `<estado>` | `<persona>` | `<persona>` | `nenhum` ou condição | `sim/não/a definir` | `nenhuma/decisão/aceite/merge` | `<evidência>` |

O cabeçalho do painel deve informar também a baseline canônica da `origin/main`, a baseline da `main` local designada e o estado da sincronização do Google Drive. O painel não substitui o Registro Mestre e não pode divergir dele.

## Densidade documental

O Painel aponta para as fontes canônicas; não replica integralmente suas leis. Documentos usam as classes `canonical`, `active`, `source` e `historical`. Conteúdo histórico e configurações locais ficam fora do contexto padrão. O CTO deve exigir justificativa antes de criar novo arquivo e registrar qual fonte ele substitui ou complementa.
