---
tags: [governanca, onboarding, ceo]
versao: 7.3
status: ativo
classe_documental: canonical
responsavel: "@CTO"
canonical_for: onboarding_executivo
review_trigger: mudanca_de_topologia_ou_fluxo_executivo
---

# Manual de Onboarding Executivo — AmpAI v7.3

O CEO dirige estratégia, produto, prioridade e é a autoridade exclusiva de merge. Não precisa escrever código, decidir rotas operacionais ou redigir prompts de fábrica.

## Onde cada trabalho ocorre

| Ambiente | Uso | Personas |
| --- | --- | --- |
| NotebookLM | Contexto, fontes, normas e brainstorming | Camada 0 — sem produção |
| ChatGPT Plus | Conselho, O.S. e negócio em abas independentes | @Conselho_de_Arquitetura_e_Governanca, @CTO, @Negocios_e_Estrategia |
| Claude Code Pro | Ciência e implementação do produto em contextos separados | @Engenheiro_Eletricista, @Senior_Backend_Dev, @Senior_Frontend_Dev |
| Google AI Pro / Antigravity | Plataforma CI e operação DevOps/SRE em projetos/worktrees separados | @Engenheiro_Plataforma_CI, @Engenheiro_DevOps_SRE |
| Codex CLI/API + GitHub Actions | Tribunal: testes locais, CI reprodutível e artifacts de evidência | @Senior_QA_Security |

## Regra de isolamento

Abra uma aba limpa por persona e cole o respectivo arquivo em `.github/chat_contexts/`. Não leve contexto não solicitado entre cadeiras. O Conselho não cria O.S.; somente o CTO as emite. `@Conselho_de_Arquitetura_e_Governanca` sucede o nome histórico `@Arquiteto_Chefe_e_Governanca`.

## Fluxo executivo

1. Use NotebookLM e/ou Negócios para amadurecer uma meta.
2. Quando a meta alterar leis, arquitetura ou documentação canônica, leve-a primeiro ao Conselho de Arquitetura e Governança.
3. Leve toda meta, decisão ou nova evidência ao CTO. Ele registra, classifica de CHG-0 a CHG-3, escolhe a rota e devolve O.S. proporcional por especialista.
4. Transporte os artefatos entre as abas indicadas pela O.S.: ciência/BDD baseada em RNC-P/RNC-C Markdown, prova de cálculo contestável, RED de QA, implementação GREEN e UI quando aplicável.
   - RNC-P é consulta processada; RNC-C é base canônica curada. Regra vinda apenas de RNC-P deve ser promovida antes de virar implementação.
5. QA/Codex executa o teste experimental e as regressões estáveis aplicáveis, separa falha funcional de infraestrutura e entrega comandos, relatórios, ambiente e `exit code`.
6. Teste novo não vira proteção permanente no primeiro GREEN. Ele segue promoção em duas PRs conforme `docs/AmpAI_Gate_Regressao.md`.
7. Durante a implantação, preserve os workflows oficiais e valide o novo gate em shadow mode. Depois de ativado, todo PR para `main` deverá concluir o required check `regression-gate` e publicar artifact consolidado.
8. QA valida o artifact de CI. CodeRabbit comenta de forma complementar. Só depois você decide o aceite e faz o merge humano.

Quando uma O.S. alterar workflows, executores, schemas, comandos, manifesto ou artifacts, envie-a ao @Engenheiro_Plataforma_CI. Ele não pode escrever testes, decidir classificações ou julgar a própria implementação; a candidata retorna obrigatoriamente ao QA.

Quando uma O.S. envolver higiene do repositório, sincronização, worktrees/branches ou ambientes, envie-a ao @Engenheiro_DevOps_SRE. Ele começa por inventário e dry-run, não descarta estado local e devolve a candidata ao CTO. A classificação de testes continua com QA; documentos canônicos continuam com o Conselho.

Para Plataforma CI e DevOps/SRE, abra projetos Antigravity separados, mantenha permissões restritas ao projeto e aprovação interativa ativa. Use Gemini 3.5 Flash como padrão; Gemini 3.1 Pro High somente quando o CTO registrar escalonamento por complexidade. Antes da primeira mutação, execute a qualificação read-only/dry-run da cadeira. Nunca troque o executor de uma O.S. em andamento.

Todo resultado volta ao CTO. Você recebe dele um resumo executivo com classe, risco, pareceres, testes, PR/SHA e recomendação. Se houver teste manual, o CTO deve fornecer SHA, caminho/URL, comando e cenários; se não houver, deve declarar `TESTE DO CEO: NÃO NECESSÁRIO`. Após o merge, devolva o resultado ao CTO: primeiro ele registra `MERGE_VALIDADO`; depois o DevOps/SRE regulariza a raiz, o Drive e os worktrees para `ENCERRAMENTO_OPERACIONAL`.

O diretório principal `AmpAI/` é sua cópia local canônica e deve ficar sempre em `main`, limpa e alinhada a `origin/main`. Não teste o produto nessa pasta se o CTO indicar `BLOQUEIO_OPERACIONAL`. Implementações pertencem a `tmp/worktrees/<ID>`; uma `main` permanente em `main-sync` ou outro worktree secundário não é o desenho vigente.

Se o alinhamento local, o Gate pós-merge, a sincronização ou um hash falhar, não descarte arquivos nem tente “forçar” a atualização. O merge remoto permanece identificado, mas o encerramento operacional fica bloqueado. Encaminhe a evidência ao CTO; o DevOps/SRE executa inventário e dry-run, e somente o CEO autoriza a remoção nominal de worktrees ou branches.

RNC-C ratificado com `vigencia: EFETIVA_QUANDO_INTEGRADO_A_MAIN` torna-se canônico quando entra na `main`. Você não precisa aprovar uma segunda PR apenas para trocar o texto de vigência; PR, SHA, Gate e sincronização ficam no Registro Mestre.

CodeRabbit pode acrescentar comentários à PR, mas não substitui o veredito de QA/Codex, o artifact de CI nem sua decisão de merge. CD staging e CD produção não fazem parte do fluxo ativo.

O @Engenheiro_DevOps_SRE está ativo sob O.S. do CTO. As cadeiras @Senior_Backend_SaaS e @Arquiteto_Seguranca_Privacidade permanecem planejadas e inativas até ratificação específica.
