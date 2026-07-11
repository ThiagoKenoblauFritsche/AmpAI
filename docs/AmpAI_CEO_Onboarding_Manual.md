# Manual de Onboarding Executivo — AmpAI v7.1

O CEO dirige estratégia, produto, prioridade e é a autoridade exclusiva de merge. Não precisa escrever código, decidir rotas operacionais ou redigir prompts de fábrica.

## Onde cada trabalho ocorre

| Ambiente | Uso | Personas |
| --- | --- | --- |
| NotebookLM | Contexto, fontes, normas e brainstorming | Camada 0 — sem produção |
| ChatGPT Plus | Conselho, O.S. e negócio em abas independentes | @Conselho_de_Arquitetura_e_Governanca, @CTO, @Negocios_e_Estrategia |
| Claude Code Pro | Ciência normativa, implementação local e Fábrica de Plataforma | @Engenheiro_Eletricista, @Senior_Backend_Dev, @Senior_Frontend_Dev, @Engenheiro_Plataforma_CI |
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

Todo resultado volta ao CTO. Você recebe dele um resumo executivo com classe, risco, pareceres, testes, PR/SHA e recomendação. Após o merge, devolva o resultado ao CTO para encerramento no Registro Mestre.

Se um `push` pós-merge em `main` falhar, congele novos merges, peça classificação ao QA e proposta de correção/reversão ao CTO. Somente o CEO decide o tratamento.

CodeRabbit pode acrescentar comentários à PR, mas não substitui o veredito de QA/Codex, o artifact de CI nem sua decisão de merge. CD staging e CD produção não fazem parte do fluxo ativo.

As cadeiras @Engenheiro_DevOps_SRE, @Senior_Backend_SaaS e @Arquiteto_Seguranca_Privacidade permanecem planejadas e inativas até ratificação específica nas fases correspondentes.
