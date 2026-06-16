Feature: O.S. 033 - A11y (Contrastes Residuais em Variáveis Globais e Cards)

  Como usuário que depende de alto contraste
  Eu quero que os textos coloridos e os cards de resultado tenham cores com contraste maior que 4.5:1
  Para que eu possa ler os títulos e valores sem forçar a vista.

  Rules:
    - O arquivo `index.html` possui uma variável global `--accent` que define a cor primária. Ela deve ser alterada de `#f59e0b` para o tom acessível `#b45309`.
    - A classe `.result-card.primary` (que antes usava `background: var(--accent)`) deve passar a usar `background: var(--text-primary);` (que é um slate-900 / escuro). Isso garante que os textos brancos dentro dele tenham um contraste perfeito.
    - Isso também afeta a barra do logo e os ícones globais, garantindo consistência em toda a plataforma.

  Scenario: [Happy Path] Verificação de Variáveis CSS e Cards Principais
    Given que a página foi carregada
    When eu consulto as propriedades computadas do Root (html) e do Card Primário
    Then a variável `--accent` deve estar definida como `#b45309`
    And a cor de fundo do `.result-card.primary` deve corresponder a `var(--text-primary)` (ou equivalente em RGB `rgb(15, 23, 42)`).
