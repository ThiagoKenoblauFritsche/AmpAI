Feature: O.S. 030 - UX Polish (Tabelas e Badge do Header)

  Como engenheiro eletricista e usuário da ferramenta
  Eu quero que o badge da norma no cabeçalho acompanhe o módulo atual
  E que os cabeçalhos das tabelas possuam um estilo moderno e arredondado
  Para que a interface seja consistente e esteticamente agradável.

  Rules:
    - O Header Badge (`.norm-badge`) deve exibir "IEC 60364 / 60502" quando no módulo Cabling, e "IEC 60909-0" no módulo Short-Circuit.
    - O cabeçalho das tabelas (`th`) deve possuir tipografia premium: `letter-spacing: 0.05em`.
    - A linha do cabeçalho da tabela deve ter os cantos superiores arredondados. Como é um `th`, devemos aplicar `border-top-left-radius: 8px` no `th:first-child` e `border-top-right-radius: 8px` no `th:last-child`.

  Scenario: [Happy Path] Renderização da Tabela e Badge
    Given que a página foi carregada
    When eu clico no módulo de Cabling
    Then o badge no topo muda para "IEC 60364 / 60502"
    And as tabelas de resultado (`.table-results th`) possuem cantos superiores arredondados e espaçamento de letras ajustado.
