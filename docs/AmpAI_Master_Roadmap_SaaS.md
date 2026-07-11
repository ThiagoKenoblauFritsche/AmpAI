---
tags:
  - planejamento/saas
  - ampai/business
  - ampai/arquitetura
versao: 7.1
status: ativo
---

# 🚀 Master Roadmap: Do Protótipo ao SaaS Profissional (AmpAI v7.1+)

Com base na governança v6.0 ("Air Gap Epistemológico") e nas ambições de expansão comercial, este documento mapeia as fases oficiais para transformarmos o AmpAI de uma ferramenta local em um **SaaS mundial, seguro, rentável e 100% automatizado**.

As fases abaixo devem ser executadas sequencialmente para garantir a integridade da arquitetura de entrega. CI, CD para staging e CD para produção são trilhas distintas: o foco atual é consolidar CI + PR + evidência antes de qualquer automação de deploy.

---

## 🐇 Fase 7: Governança v7.1 por Separação de Poderes (Fase Atual)
*Memória, legislação, execução, fábrica e tribunal operam em contextos isolados.*

*   [x] **RAG Federado:** `sync.ps1` mantém as fontes disponíveis ao NotebookLM.
*   [x] **Conselho e Executivo isolados:** @Conselho_de_Arquitetura_e_Governanca e @CTO operam em chats separados no ChatGPT Plus; o Conselho sucede a denominação histórica `@Arquiteto_Chefe_e_Governanca`.
*   [x] **Fábrica de Plataforma CI:** @Engenheiro_Plataforma_CI possui o escopo de workflows, executores, schemas, comandos e artifacts, sem escrever testes, decidir classificações ou emitir veredito.
*   [x] **CTO como Torre de Controle:** toda decisão, alteração, auditoria e incidente recebe registro, classificação `CHG-0` a `CHG-3`, O.S. proporcional e encerramento pós-merge conforme `docs/AmpAI_Classificacao_Mudancas.md`.
*   [x] **Estúdio 2 unificado em Claude:** @Engenheiro_Eletricista usa Claude Opus 4.8 com Extended Thinking para ciência/BDD sobre RNC-P/RNC-C Markdown; Backend usa Claude Opus 4.8 e Frontend usa Claude Sonnet 4.6 dentro de seus escopos.
*   [ ] **Curadoria RNC:** promover os RNC-P críticos de `docs/normas/` para RNC-C em `docs/engenharia/`, com equações, unidades, premissas, limites e regras QA auditáveis.
*   [x] **Tribunal independente:** Codex QA registra RED → GREEN e `exit code` em terminal isolado.
*   [x] **CI in-browser inicial:** GitHub Actions `qa-os040r.yml` executa `tests/test_os040_restart.js` na `Refat_Frontend` e publica artifact de evidência.
*   [x] **Arquitetura do Gate Consolidado ratificada:** taxonomia, suíte inicial, promoção em duas PRs, `regression-gate`, artifacts e separação entre falha funcional/infraestrutura definidas em `docs/AmpAI_Gate_Regressao.md`.
*   [x] **Gate Consolidado em shadow mode:** manifesto, schema, executor Node, comandos npm, matriz browser e agregador integrados em `main@dd83008`; GREEN pós-merge no run `28910574756`. Permanece informativo e não obrigatório.
*   [x] **Evidência padronizada do Gate v1:** artifacts individuais e consolidado processável implantados, com ambiente, comando, relatórios, categoria e `exit code`; validação longitudinal continua no período de observação. O escopo ampliado da INF-029 permanece pendente.
*   [ ] **Observação do shadow mode:** O.S. própria do CTO para sete dias mínimos, repetibilidade, novo ciclo PR→merge, comparação com workflows legados, auditoria dos artifacts e parecer QA, sem alterar branch protection.
*   [ ] **Required check para `main`:** após validação do shadow mode pelo QA, ativar `regression-gate` em todo PR e em `push` pós-merge, mantendo CodeRabbit complementar e merge exclusivo do CEO.
*   [ ] **Promoção pós-O.S. 050:** manter `test_os049.js` e `test_os049_e2e.js` como experimentais até três GREENs independentes no mesmo SHA, execução pós-merge, `navigationErrors=[]` e PR específica de promoção.
*   [ ] **Roteamento path-aware do Gate:** somente após observação e required check estabilizados, o CTO poderá emitir O.S. para Plataforma CI separar checks documentais `CHG-0` de regressão funcional, mantendo `regression-gate` agregado e proibindo skip escolhido pela PR.

---

## 🏗️ Fase 8: CD Staging e Topologia Remota (ROADMAP VPS/TELEGRAM)
*Colocação da aplicação em ambiente de testes público/controlado, depois da consolidação de CI, PR e artifacts.*

*   [ ] **Ratificação de @Engenheiro_DevOps_SRE:** ativar a cadeira antes de conceder acesso a VPS, IaC, deploy, observabilidade, backup ou rollback. Planejamento atual não concede permissão.
*   [ ] **Alocação da VPS (Fábrica/Tribunal):** provisionar ambientes separados para Claude Code e Codex QA, sem cruzamento de permissões.
*   [ ] **Hospedagem Web Segura de Staging:** instalar Nginx em ambiente de entrega que sirva somente artefatos aprovados pelo PR/CI.
*   [ ] **Muralha da Cloudflare:** Configuração de domínio próprio apontando para a Cloudflare (Proxy reverso, mitigação DDoS e certificados HTTPS grátis).
*   [ ] **CD Produção bloqueado:** produção não recebe deploy automático nesta fase.

---

## 💅 Fase 9: Consolidação do Produto e UX Global
*Elevação do padrão visual e funcional para níveis corporativos "Look & Feel" antes da cobrança.*

*   [x] **(O.S. 015) Refatoração UI/UX Global:** Padronização estética profunda. Transição para um formato Dashboard, harmonização dos módulos BT/MT/Curto-circuito usando a mesma paleta de cores e tipografia (Tailwind CSS).
*   [x] **(O.S. 013) Memorial Exportável de Média Tensão:** Replicar a engine de geração e exportação de PDF corporativo que já existe em curto-circuito.
*   [x] **(O.S. 017) Internacionalização Semântica (i18n):** Estruturação do aplicativo em dicionários JSON dinâmicos (EN/PT/ES) para viabilizar as vendas fora do Brasil.

---

## 🔐 Fase 10: Backend as a Service (BaaS) & Nuvem de Projetos
*Transição de Single Page Application "Stateless" para um sistema "Stateful" seguro sem a necessidade de gerenciar bancos de dados complexos localmente.*

*   [ ] **Ratificação de @Senior_Backend_SaaS:** ativar a cadeira de APIs de aplicação, persistência, sessões, banco e integrações sem ampliar o escopo do Backend matemático.
*   [ ] **Ratificação de @Arquiteto_Seguranca_Privacidade:** concluir threat modeling, IAM, política de segredos e requisitos LGPD/GDPR antes de autenticação ou dados pessoais.
*   [ ] **BaaS Integration (Supabase / Firebase):** Conexão das APIs do frontend direto com os clusters NoSQL/Postgres das provedoras. Nenhuma senha trafegará em texto nas nossas VPSs.
*   [ ] **Sistema de Contas (Auth):** Construção das telas e fluxos lógicos de "Sign In", "Sign Up", "Esqueci minha senha" e Login Social (Google/GitHub).
*   [ ] **Salvamento de Estado (Session Persistence):** Criação de rotinas para os engenheiros salvarem painéis de cálculos como "Projetos" e poderem resgatá-los futuramente vinculados ao seu ID de usuário.

---

## 💸 Fase 11: Monetização, Paywall e Administração
*Geração de faturamento automático via funil de assinatura ou tokens.*

*   [ ] **Gate de segurança e privacidade:** nenhuma integração de pagamento, webhook ou dado financeiro avança sem parecer do @Arquiteto_Seguranca_Privacidade, testes independentes e aceite do CEO.
*   [ ] **Integração de Pagamentos (Stripe API):** Modelagem de assinaturas mensais (Licença Pro) ou venda de pacotes de Tokens (Pay-as-you-go).
*   [ ] **Engenharia de Paywall:** Desenvolver bloqueadores de recursos. Usuários *Free/Guests* possuem limitação de uso diário ou bloqueio do botão "Exportar Memorial". Usuários *Pro* possuem acesso liberado após check do webhook da Stripe.
*   [ ] **CEO Dashboard:** Interface administrativa privada contendo métricas chaves de SaaS, como MRR (Faturamento Mensal Recorrente), Churn e Total de Contas Ativas.
