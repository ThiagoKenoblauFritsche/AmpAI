# Epic: Admin Dashboard (Torre de Controle)
**Status:** Backlog (Aguardando Implementação)
**Contexto:** Conforme nossa estratégia Lean e visão SaS, esta interface é restrita aos administradores (sócios) do AmpAI. Ela foca estritamente na "Inteligência do Produto" (Custos de IA, Auditoria de Agentes e Feedbacks), delegando faturamento e logs de infraestrutura pesada para ferramentas externas (Stripe e Sentry).

## Cenários BDD (Behavior-Driven Development)

```gherkin
Feature: Torre de Controle Admin
  Como um CEO/Administrador do AmpAI
  Eu quero visualizar métricas de custo de IA, auditoria de relatórios e feedbacks
  Para que eu possa gerir a margem de lucro e a operação dos Agentes de IA

  Scenario: Acesso Restrito Baseado em Roles
    Given que eu sou um usuário autenticado no AmpAI
    When eu tento acessar a rota "/admin"
    Then o sistema deve verificar minhas permissões de administrador
    And se eu não for admin, devo ser redirecionado para a home com status "Acesso Negado"

  Scenario: Visualização de Margem de Lucro Computacional (SaS)
    Given que estou autenticado no Admin Dashboard
    When eu visualizo o painel de "Métricas de IA"
    Then eu devo ver o volume de tokens consumidos nas APIs de LLM
    And o sistema deve exibir um comparativo de "Custo de API vs Lucro" por projeto gerado

  Scenario: Auditoria de Projetos e Engenharia Autônoma
    Given que estou autenticado no Admin Dashboard
    When eu clico na aba "Auditoria de Agentes"
    Then eu devo ver uma lista em tempo real dos Memoriais Descritivos (ex: IEC 60909) gerados pela IA
    And devo ver o status de conformidade de cada relatório entregue aos clientes

  Scenario: Ouvidoria e Monitoramento de Features
    Given que estou autenticado no Admin Dashboard
    When eu navego para a seção de "Ouvidoria"
    Then eu devo visualizar todos os feedbacks submetidos pelos usuários
    And devo conseguir priorizar quais features os usuários mais estão pedindo
```
