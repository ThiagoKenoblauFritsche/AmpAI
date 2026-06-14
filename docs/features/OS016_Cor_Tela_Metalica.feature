Feature: O.S. 016 - Correção Visual da Tela Metálica

  Como engenheiro analítico do AmpAI
  Eu quero que o Card da Tela Metálica (KPI 5 da MT) possua o mesmo padrão de cor do restante da aplicação
  Para que o dashboard tenha uma interface coesa (Dark/Light mode compatível) sem quebras visuais abruptas.

  Rules:
    - O Card da Tela Metálica não pode possuir background dark fixo (`linear-gradient(135deg,#1e293b,#334155)`).
    - Ele deve usar as classes normais do design system (como `result-card primary` ou `info` ou `success` dependendo da hierarquia).
    - As fontes dentro desse card (`color:#f1f5f9`) também não podem ser hardcoded, devem herdar o CSS das variáveis do tema (ex: `var(--text-primary)`).

  Scenario: [Happy Path] Tela Metálica renderiza com cor fluida
    Given que eu processo um cálculo de Média Tensão
    When o sistema renderizar o card KPI da Tela Metálica
    Then ele não deve conter `style="background:linear-gradient..."`
    And ele deve renderizar as informações perfeitamente usando as cores do tema

  Scenario: [ZOMBIES - Boundary] Dark Mode
    Given que a paleta do sistema mude de cores globais
    When a Tela Metálica for exibida
    Then ela herdará o background correspondente sem ficar ilegível
