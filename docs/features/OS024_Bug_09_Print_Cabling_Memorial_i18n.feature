Feature: O.S. 024 - Refinamento de Impressão e Subtextos BT

  Como Engenheiro projetista
  Eu quero que o relatório em PDF do dimensionamento de cabos omita o painel lateral de entradas
  E que todos os subtextos do memorial BT acompanhem perfeitamente o idioma global

  Rules:
    - No modo de impressão (`@media print`), a tag `<aside>` que contém o painel esquerdo de entradas (dentro de `#wrapper-bt` e `#wrapper-mt`) deve receber `display: none !important`.
    - O conteúdo impresso deve ocupar 100% do layout para aproveitar a folha.
    - No arquivo `ui_render.js`, os parágrafos dinâmicos (`<p>`) localizados logo abaixo dos cabeçalhos dos passos do memorial BT não podem conter strings fixas em português ("Cálculo dos fatores...", "Calculada com base...", "Determinação da secção...").
    - A Fábrica deve criar chaves para esses textos no dicionário `_btI18n`, usar placeholders (ex: `{cond}`, `{ins}`, `{duMax}`, `{t_s}`) e preenchê-los dinamicamente no momento da renderização com `.replace()`.

  Scenario: [Happy Path] Impressão Focada nos Resultados
    Given que eu solicito a impressão da tela (Ctrl+P) no módulo de Cabos
    When a página formata o layout para o PDF
    Then o painel de parâmetros (`<aside>`) desaparece
    And apenas o card de resultados principais e o memorial completo são desenhados na página

  Scenario: [Happy Path] Subtextos Dinâmicos do Memorial BT
    Given que a linguagem global está configurada para Inglês (EN)
    When eu renderizo o memorial da Baixa Tensão (BT)
    Then a descrição do passo de ampacidade deve ler "Calculation of correction factors and corrected current for the..." ao invés de "Cálculo dos fatores..."
