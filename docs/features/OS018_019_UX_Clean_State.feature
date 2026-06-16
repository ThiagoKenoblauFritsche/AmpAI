Feature: O.S. 018 e 019 - Limpeza Visual e Dynamic State Binding

  Como usuário que interage com os módulos de cálculo do AmpAI
  Eu quero que as informações da Header mudem de acordo com a aba (módulo) que eu selecionei, e eu não quero ver controles redundantes na tela
  Para ter um contexto limpo e confiável sobre o que estou calculando.

  Rules:
    - O seletor de idiomas duplicado na Sidebar (`.lang-selector` dentro da navegação) deve ser removido completamente, pois já existe um seletor premium no Header Global.
    - A badge da norma na Header (`.norm-badge`) e seu texto descritivo (`data-i18n="header.method"`) devem mudar dinamicamente conforme o módulo ativo.
    - Se a aba ativa for "Curto-Circuito", a norma deve ser `IEC 60909-0` e o texto `Método das Impedâncias Percentuais`.
    - Se a aba ativa for "Dimensionamento de Cabos" (BT ou MT), a norma deve ser `IEC 60364 / 60502` e o texto `Capacidade de Condução e Limites`.

  Scenario: [Happy Path] Badge acompanha a aba ativa e seletor foi removido
    Given que eu navego entre "Dimensionamento de Cabos" e "Curto-Circuito"
    When eu olho para o Header
    Then o badge e o texto mudam acompanhando o módulo correspondente
    And o antigo seletor de idiomas da Sidebar não existe mais no DOM
