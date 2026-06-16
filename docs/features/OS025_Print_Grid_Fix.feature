Feature: O.S. 025 - Layout de Impressão Retrato (Aproveitamento Total)

  Como engenheiro eletricista
  Eu quero que o memorial de cálculo (PDF) ocupe a largura inteira da folha A4 em retrato
  Para não desperdiçar o espaço deixado pelo painel lateral que foi ocultado.

  Rules:
    - O wrapper do Cabling BT/MT (o container que possui `grid-template-columns: 320px 1fr`) mantém a coluna de 320px alocada mesmo quando o `<aside>` está invisível (`display: none`).
    - Para corrigir, devemos adicionar uma classe identificadora (ex: `.cabling-grid`) a esses containers ou aplicar um seletor CSS no `@media print` que force esses grids a operar com `grid-template-columns: 1fr !important` ou `display: block !important`.
    - Isso fará com que os cards de resultado se expandam totalmente para a esquerda.

  Scenario: [Happy Path] Impressão em Largura Total
    Given que eu solicito a impressão da página de resultados
    When o navegador processa o CSS de impressão
    Then o container que divide o layout em `320px 1fr` passa a adotar `1fr` ou `block`, permitindo que os blocos matemáticos utilizem toda a folha.
