Feature: O.S. 015 - Padronização UI/UX Global

  Como usuário que navega entre Baixa Tensão, Média Tensão e Curto-Circuito
  Eu quero que todos os componentes (Cards, Accordions, Grids de Resultado) tenham a mesma sintaxe construtiva (classes CSS e layout)
  Para que a experiência seja consistente e coesa.

  Rules:
    - O container de resultados (Memorial e Cards) da aba BT e MT devem possuir os mesmos padrões de classes CSS (ex: `.result-card`, `.results-grid`, `.memorial-step`).
    - O espaçamento e bordas (CSS variables) devem ser aplicados igualmente.
    - Se a BT usa `.math-line` e `.step-title`, a MT e o Curto-Circuito também devem usar exatamente as mesmas classes ao invés de estilos inline ou divs aninhadas de forma diferente.

  Scenario: [Happy Path] Classes idênticas nos resultados de BT e MT
    Given que eu processo os cálculos tanto de BT quanto de MT
    When eu examinar a injeção de DOM feita pelo ui_render.js
    Then eu devo encontrar a classe estrutural "results-grid" em ambos
    And os elementos de memorial de ambos devem usar a estrutura "accordion-item" de maneira idêntica
    And a paleta visual (bordas e backgounds) devem advir de classes globais e não de styles inline (ex: `style="padding:1rem;"` removidos em prol de classes do design system)

  Scenario: [ZOMBIES - Boundary] Cards sem dados não devem quebrar o Grid
    Given que um Grid de resultado genérico é injetado sem informações extras
    When a classe de layout grid tenta alinhar os elementos vazios
    Then o tamanho mínimo e o comportamento flexível da classe devem manter o layout integro sem achatamento
