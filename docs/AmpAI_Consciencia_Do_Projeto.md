---
tags: [arquitetura/ia, ampai/consciencia]
versao: 7.3
status: ativo
---

# Arquivo de Consciência e Memória do Projeto AmpAI

## Propósito

AmpAI é um SaaS de engenharia elétrica IEC. Sua operação evita monólitos de contexto: a memória, a criação de regras, a orquestração, a implementação e o julgamento são poderes separados.

## Topologia canônica

1. **NotebookLM (Camada 0):** memória/RAG e brainstorming. Não escreve produção.
2. **@Conselho_de_Arquitetura_e_Governanca — GPT-5.5:** conselho independente. Mantém Manifesto, Workflow e documentação raiz; ratifica arquitetura e audita desvios. Não cria O.S. nem executa a Fábrica. Sucede a denominação histórica `@Arquiteto_Chefe_e_Governanca` sem reescrever selos anteriores.
3. **@CTO — GPT-5.5:** Executivo e Torre de Controle; toda mudança passa por seu Registro Mestre, classificação CHG-0 a CHG-3, roteamento explícito, declaração de teste do CEO, consolidação de evidências e encerramento/sincronização pós-merge.
4. **@Negocios_e_Estrategia — GPT-5.4:** produto, viabilidade e backlog.
5. **@Engenheiro_Eletricista — Claude Opus 4.8 (Extended Thinking):** BDD, classificação RNC-P/RNC-C, memorial, prova de cálculo contestável e limites físicos.
6. **@Senior_Backend_Dev — Claude Opus 4.8:** `js/core_*.js`, DDD e Result Pattern.
7. **@Senior_Frontend_Dev — Claude Sonnet 4.6:** `index.html` e `js/ui_render.js` com reatividade segura.
8. **@Engenheiro_Plataforma_CI — Google Antigravity / Gemini 3.5 Flash:** Fábrica de infraestrutura do Gate; workflows, executores, schemas, comandos e artifacts, sem escrever testes nem decidir classificações. Gemini 3.1 Pro High é escalonamento de diagnóstico/planejamento.
9. **@Senior_QA_Security — Codex/GPT-5.5 + GitHub Actions:** Tribunal de terminal isolado; ZOMBIES, mutation testing aplicável, artifacts de CI e evidências de execução.
10. **@Engenheiro_DevOps_SRE — Google Antigravity / Gemini 3.5 Flash:** operação fail-closed de repositório, sincronização, worktrees/branches, ambientes, IaC, deploy, observabilidade, backup e rollback; Gemini 3.1 Pro High é escalonamento, sem autoridade sobre produto, testes, leis, veredito ou merge.

## Leis operacionais

- Um chat por persona; nunca cruzar contextos.
- Tudo passa pelo CTO, mas nem tudo passa pela cadeia máxima. A intensidade da O.S. segue `docs/AmpAI_Classificacao_Mudancas.md`; o estado consolidado vive em `docs/AmpAI_Registro_Mudancas.md`.
- Quem implementa não julga a própria implementação. QA independente atesta RED, GREEN, classificação dos testes, regressões stable, artifact de CI quando aplicável e `exit code`.
- Plataforma CI materializa contratos do CTO e decisões explícitas do QA; não cria ou flexibiliza testes, não decide o manifesto e não emite veredito.
- Plataforma CI e DevOps/SRE operam em projetos, threads e worktrees separados no Antigravity, com escopo de projeto, aprovação interativa, sem acesso `Full machine`/`Unrestricted`, wildcard MCP, tarefa agendada ou créditos automáticos. O prompt operacional é em inglês e a devolutiva em pt-BR.
- Antes da primeira mutação após a migração, cada cadeira Google deve passar por qualificação AmpAI read-only/dry-run registrada pelo CTO. O.S. em andamento preserva o executor e a baseline originais até o encerramento.
- O código só nasce de BDD e SDD; erros seguem RFC 7807 e o core nunca toca o DOM.
- RNC-P é fonte normativa processada; RNC-C é fonte canônica curada. Um `.md` em `docs/normas/` não vira canônico automaticamente. RNC-C ratificado com `vigencia: EFETIVA_QUANDO_INTEGRADO_A_MAIN` torna-se efetivo pela presença do mesmo blob na `main`, sem PR operacional recursiva.
- `sync.ps1` mantém a base Docs as Code disponível ao NotebookLM.
- O CEO é o gatekeeper final de merge. O Gate Consolidado foi implantado em shadow mode em `main@dd83008` e obteve GREEN pós-merge no run `28910574756`; permanece informativo. Só protegerá obrigatoriamente `main` depois da O.S. de observação, parecer QA, O.S. futura de promoção e ativação explícita autorizada pelo CEO.
- Teste novo nasce experimental; somente promoção formal o torna stable. Falha de infraestrutura bloqueia, mas não constitui RED/GREEN funcional.
- CodeRabbit é revisor complementar, não autoridade final. CD staging e CD produção são fases futuras e separadas.
- O CEO define estratégia, produto, prioridade e merge. O CTO determina a rota operacional e recebe de volta cada artefato, parecer e resultado pós-merge.
- Toda O.S. declara responsável atual, retorno ao CTO, próximo destinatário e `TESTE DO CEO: SIM | NÃO | A DEFINIR APÓS QA`; o formato está em `docs/AmpAI_Protocolo_Operacional_CTO_CEO.md`.
- `MERGE_VALIDADO` não é `ENCERRAMENTO_OPERACIONAL`: `origin/main`, a raiz `AmpAI/` limpa em `main`, os worktrees e o Google Drive, quando aplicável, devem possuir estado explícito. Implementações nunca usam a raiz canônica.
- Atualizar precede criar. Documento novo exige classe, autoridade, consumidor e ciclo de vida; histórico não entra no contexto padrão.
- Dependências, caches, screenshots de execução, artifacts e configurações locais são regeneráveis e não pertencem à árvore versionada sem contrato explícito.

## Estado de infraestrutura

A fábrica de produto Claude, a fábrica operacional Antigravity e o Tribunal Codex operam nos ambientes locais/isolados disponíveis após a qualificação de cada cadeira. GitHub Actions já é infraestrutura ativa de CI para evidência reprodutível quando a O.S. exigir navegador real ou artifact externo. A Cloud Factory em VPS, Firecracker, Telegram e CD automático permanecem roadmap; documentos não podem assumir que já estejam provisionados.

## Cadeiras futuras e gatilhos de ativação

- **@Senior_Backend_SaaS:** antes de BaaS/Auth, com escopo de APIs de aplicação, persistência, sessões, banco e integrações, sem alterar motores IEC.
- **@Arquiteto_Seguranca_Privacidade:** antes de autenticação, dados pessoais ou pagamentos, com escopo consultivo de threat modeling, IAM, segredos e LGPD/GDPR; não implementa nem substitui QA.

Essas cadeiras estão planejadas e não possuem autorização operacional até ratificação própria.
