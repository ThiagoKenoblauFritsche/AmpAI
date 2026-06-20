---
tags:
  - planejamento/saas
  - ampai/business
  - ampai/arquitetura
versao: 7.0
status: ativo
---

# 🚀 Master Roadmap: Do Protótipo ao SaaS Profissional (AmpAI v7.0+)

Com base na governança v6.0 ("Air Gap Epistemológico") e nas ambições de expansão comercial, este documento mapeia as fases oficiais para transformarmos o AmpAI de uma ferramenta local em um **SaaS mundial, seguro, rentável e 100% automatizado**.

As fases abaixo devem ser executadas sequencialmente para garantir a integridade da arquitetura CI/CD.

---

## 🏗️ Fase 7: Topologia de Produção e CI/CD Dual-Server (Fase Atual)
*Colocação da aplicação na internet com segurança de nível militar através da segregação de ambientes (Fábrica vs Tribunal).*

*   [ ] **Alocação da Segunda VPS (VPS-A - Fábrica):** Provisionar nova VPS Hetzner de €5 (ambiente sujo) dedicada apenas a rodar o Claude Code via comandos móveis.
*   [ ] **Implementação do CI/CD Isolado:** O Claude Code envia código para branches secundárias no GitHub. A VPS-B (Tribunal) intercepta o webhook, audita via TDD, e só então consolida na branch `main`.
*   [ ] **Hospedagem Web Segura (VPS-B - Produção):** Instalação do Nginx na máquina do Tribunal para servir a branch `main` limpa e aprovada para a web.
*   [ ] **Muralha da Cloudflare:** Configuração de domínio próprio apontando para a Cloudflare (Proxy reverso, mitigação DDoS e certificados HTTPS grátis).
*   [ ] **Limpeza de Backlog (O.S. INF-015/017):** Implementação final de pre-commit hooks e linters sintáticos automáticos.

---

## 💅 Fase 8: Consolidação do Produto e UX Global
*Elevação do padrão visual e funcional para níveis corporativos "Look & Feel" antes da cobrança.*

*   [x] **(O.S. 015) Refatoração UI/UX Global:** Padronização estética profunda. Transição para um formato Dashboard, harmonização dos módulos BT/MT/Curto-circuito usando a mesma paleta de cores e tipografia (Tailwind CSS).
*   [x] **(O.S. 013) Memorial Exportável de Média Tensão:** Replicar a engine de geração e exportação de PDF corporativo que já existe em curto-circuito.
*   [x] **(O.S. 017) Internacionalização Semântica (i18n):** Estruturação do aplicativo em dicionários JSON dinâmicos (EN/PT/ES) para viabilizar as vendas fora do Brasil.

---

## 🔐 Fase 9: Backend as a Service (BaaS) & Nuvem de Projetos
*Transição de Single Page Application "Stateless" para um sistema "Stateful" seguro sem a necessidade de gerenciar bancos de dados complexos localmente.*

*   [ ] **BaaS Integration (Supabase / Firebase):** Conexão das APIs do frontend direto com os clusters NoSQL/Postgres das provedoras. Nenhuma senha trafegará em texto nas nossas VPSs.
*   [ ] **Sistema de Contas (Auth):** Construção das telas e fluxos lógicos de "Sign In", "Sign Up", "Esqueci minha senha" e Login Social (Google/GitHub).
*   [ ] **Salvamento de Estado (Session Persistence):** Criação de rotinas para os engenheiros salvarem painéis de cálculos como "Projetos" e poderem resgatá-los futuramente vinculados ao seu ID de usuário.

---

## 💸 Fase 10: Monetização, Paywall e Administração
*Geração de faturamento automático via funil de assinatura ou tokens.*

*   [ ] **Integração de Pagamentos (Stripe API):** Modelagem de assinaturas mensais (Licença Pro) ou venda de pacotes de Tokens (Pay-as-you-go).
*   [ ] **Engenharia de Paywall:** Desenvolver bloqueadores de recursos. Usuários *Free/Guests* possuem limitação de uso diário ou bloqueio do botão "Exportar Memorial". Usuários *Pro* possuem acesso liberado após check do webhook da Stripe.
*   [ ] **CEO Dashboard:** Interface administrativa privada contendo métricas chaves de SaaS, como MRR (Faturamento Mensal Recorrente), Churn e Total de Contas Ativas.
