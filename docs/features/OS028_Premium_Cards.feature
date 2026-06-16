Feature: O.S. 028 - UX Polish (Cards de KPI)

  Como designer e engenheiro de produto
  Eu quero que os cards de KPI (resultados numéricos) tenham um visual Premium
  Para que a aplicação passe maior credibilidade, utilizando princípios modernos como Soft Shadows e preenchimento de contraste.

  Rules:
    - Remover as bordas chapadas `border: 1px solid var(--border)` da classe `.result-card` no `index.html`.
    - Atualizar a sombra para um aspecto *Soft Shadow* moderno: `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);`
    - Remover o pseudo-elemento superior `::before` que desenhava uma linha colorida no topo.
    - Fazer com que o Card Primário (resultado final) seja totalmente preenchido. A regra `.result-card.primary` deve aplicar `background: var(--accent); color: white;` e a fonte interna `.result-title` e `.result-value` devem herdar a cor branca (ou forçar `color: white;`).

  Scenario: [Happy Path] Renderização dos Cards Premium
    Given que a página foi carregada
    When eu visualizo os resultados gerados no Cabling
    Then os cards não possuem bordas 1px sólidas e nem pseudo-elemento ::before
    And o card "primary" possui fundo preenchido na cor de destaque com textos em branco.
