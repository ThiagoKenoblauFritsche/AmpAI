Feature: O.S. 007 e 008 - Redesenho do Header Global e Seletor de Idiomas

  Como usuário corporativo do AmpAI
  Eu quero um Header moderno e elegante que contenha um seletor de idiomas interativo e claro
  Para que a aplicação transmita o peso visual das normas internacionais e permita fácil troca (i18n).

  Rules:
    - O `<header>` atual deve ser reestruturado para ser mais "Premium" (cores, flexbox estruturado, ícones).
    - O badge da norma dinâmica (já feito na OS 004) deve ser preservado.
    - O Header deve conter botões ou um dropdown de seletor de idiomas (Mínimo: PT e EN).
    - Os botões de idioma devem invocar a função `setLanguage(lang)` e mudar seu estado visual (ativo/inativo).

  Scenario: [Happy Path] Renderização do Novo Header e Troca de Idiomas
    Given que a página foi carregada
    When eu olhar para o header global
    Then eu devo visualizar controles de idioma (como botões com flags ou texto PT / EN)
    And o botão correspondente à linguagem atual (`pt` por padrão) deve possuir a classe `.active` (ou estilo indicativo)
    When eu clico no botão "EN"
    Then a função de mudança de idioma deve ser engatilhada
    And a UI deve refletir que "EN" agora é o idioma ativo
