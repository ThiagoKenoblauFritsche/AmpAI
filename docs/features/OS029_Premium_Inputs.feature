Feature: O.S. 029 - UX Polish (Inputs e Formulários)

  Como designer e engenheiro de produto
  Eu quero que os inputs e controles tenham estilo Premium com mais respiro e anéis de foco
  Para garantir que a inserção de dados seja menos densa, mais moderna e esteticamente agradável (semelhante ao iOS ou Vercel).

  Rules:
    - Espaçamento: A classe `.form-control` deve aumentar seu `margin-bottom` para `1.25rem`.
    - Tipografia: Os `label`s devem usar `font-weight: 500;` (mais leve e limpo).
    - Inputs: `input[type="number"]` e `select` devem usar `border-radius: 8px`.
    - Focus Rings: Ao focar (`:focus`), os inputs/selects devem ganhar um `box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);` e `border-color: var(--info);`.
    - Segmented Controls: 
      - `.toggle-btn-group` com `border-radius: 8px; padding: 4px;`
      - `.toggle-btn` com `border-radius: 6px; font-weight: 500;` e `border: 1px solid transparent;` (para não pular o tamanho)
      - `.toggle-btn.active` com `box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-color: var(--border);`

  Scenario: [Happy Path] Renderização dos Inputs Premium
    Given que a página foi carregada
    When eu visualizo a Sidebar de Parâmetros
    Then os inputs possuem bordas arredondadas (8px) e os gaps verticais são maiores (1.25rem)
    And o Toggle de material (Cu/Al) se assemelha a um Segmented Control do iOS.
