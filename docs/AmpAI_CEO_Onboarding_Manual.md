# Manual de Onboarding Executivo — AmpAI v7.0

O CEO dirige a estratégia e é a autoridade exclusiva de merge. Não precisa escrever código ou prompts de fábrica.

## Onde cada trabalho ocorre

| Ambiente | Uso | Personas |
| --- | --- | --- |
| NotebookLM | Contexto, fontes, normas e brainstorming | Camada 0 — sem produção |
| ChatGPT Plus | Governança, O.S. e negócio em abas independentes | @Arquiteto_Chefe_e_Governanca, @CTO, @Negocios_e_Estrategia |
| Claude Code Pro | Ciência normativa com Extended Thinking e implementação local | @Engenheiro_Eletricista, @Senior_Backend_Dev, @Senior_Frontend_Dev |
| Codex CLI/API + GitHub Actions | Tribunal: testes locais, CI reprodutível e artifacts de evidência | @Senior_QA_Security |

## Regra de isolamento

Abra uma aba limpa por persona e cole o respectivo arquivo em `.github/chat_contexts/`. Não leve contexto não solicitado entre cadeiras. Governança não cria O.S.; somente o CTO as emite.

## Fluxo executivo

1. Use NotebookLM e/ou Negócios para amadurecer uma meta.
2. Quando a meta alterar leis, arquitetura ou documentação canônica, leve-a primeiro a Governança.
3. Leve a meta aprovada ao CTO. Ele devolve O.S. por especialista e contratos SDD.
4. Transporte os artefatos entre as abas indicadas pela O.S.: ciência/BDD baseada em RNC-P/RNC-C Markdown, prova de cálculo contestável, RED de QA, implementação GREEN e UI quando aplicável.
   - RNC-P é consulta processada; RNC-C é base canônica curada. Regra vinda apenas de RNC-P deve ser promovida antes de virar implementação.
5. QA/Codex executa o teste experimental e as regressões estáveis aplicáveis, separa falha funcional de infraestrutura e entrega comandos, relatórios, ambiente e `exit code`.
6. Teste novo não vira proteção permanente no primeiro GREEN. Ele segue promoção em duas PRs conforme `docs/AmpAI_Gate_Regressao.md`.
7. Durante a implantação, preserve os workflows oficiais e valide o novo gate em shadow mode. Depois de ativado, todo PR para `main` deverá concluir o required check `regression-gate` e publicar artifact consolidado.
8. QA valida o artifact de CI. CodeRabbit comenta de forma complementar. Só depois você decide o aceite e faz o merge humano.

Se um `push` pós-merge em `main` falhar, congele novos merges, peça classificação ao QA e proposta de correção/reversão ao CTO. Somente o CEO decide o tratamento.

CodeRabbit pode acrescentar comentários à PR, mas não substitui o veredito de QA/Codex, o artifact de CI nem sua decisão de merge. CD staging e CD produção não fazem parte do fluxo ativo.
