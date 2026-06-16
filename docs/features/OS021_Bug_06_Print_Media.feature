Feature: O.S. 021 - Limpeza do Layout de Impressão (Print Media)

  Como usuário corporativo do AmpAI
  Eu quero imprimir a página atual contendo os resultados e memoriais
  Para que eu possa anexar a documentação física ao meu projeto sem poluição visual.

  Rules:
    - O Header global (`header`) deve ser ocultado na impressão.
    - A barra lateral de navegação (`.nav-sidebar`, `.sidebar`) deve ser ocultada.
    - A área principal do aplicativo (`.main-layout` ou `.main-content`) deve ocupar 100% da largura útil do papel (comportamento de bloco, removendo grids que quebram a impressão).
    - Efeitos decorativos de sombra (`box-shadow`) em cartões (`.result-card`, `.tab-content-card`, `.accordion-item`) devem ser removidos ou minimizados para não gastar tinta desnecessariamente e garantir a leitura formal.

  Scenario: [Happy Path] Impressão de um Memorial Limpo
    Given que a tela atual exibe os resultados de um cálculo
    When eu aciono o atalho de impressão do navegador (Ctrl+P)
    Then a folha gerada contém apenas o conteúdo principal do módulo ativo
    And o Header e a Sidebar não ocupam espaço na folha de impressão
