Feature: O.S. 036 - UX Polish (Estética Fina e Consistência)

  Como usuário que valoriza um design Premium (SaaS)
  Eu quero que as fontes dos botões, seus raios de borda e o espaçamento principal da tela sejam consistentes
  Para transmitir maior confiança e hierarquia nas ações do sistema.

  Rules:
    - O arquivo `index.html` deve forçar a herança da fonte nos botões para que usem 'Inter' em vez da fonte fallback do navegador (ex: Arial). Isso pode ser feito adicionando `button { font-family: inherit; }` no CSS global.
    - Os botões de ação principal (`.btn-action`) devem possuir `border-radius: 8px` para se destacarem dos demais botões menores (que têm 4 ou 6px).
    - O `<header>` deve ter seu `margin-bottom` aumentado de `1.5rem` para `2.5rem` para criar um respiro visual (white space) adequado entre o topo e o painel principal.

  Scenario: [Happy Path] Validação de Fontes, Bordas e Margens
    Given que a página foi carregada
    When eu consulto a tipografia de um botão, o border-radius de uma ação principal e a margem do cabeçalho
    Then a fonte computada do botão não deve ser 'Arial', mas sim herdar a família base
    And a classe `.btn-action` deve estar usando border-radius de 8px
    And o `<header>` deve ter `margin-bottom` correspondente a 2.5rem.
