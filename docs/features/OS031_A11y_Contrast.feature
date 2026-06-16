Feature: O.S. 031 - A11y (Contraste e Cores Seguras)

  Como usuário com baixa visão
  Eu quero que o logo e os menus desativados tenham contraste adequado com o fundo
  Para que eu consiga ler e identificar os elementos sem forçar a vista, cumprindo as normas WCAG AA (4.5:1).

  Rules:
    - O ícone (raio) do logo "AmpAI" no arquivo HTML possui a cor `#f59e0b` (Amber 500). Deve ser alterado para `#b45309` (Amber 700) para garantir o contraste seguro em fundo claro.
    - O texto do logo pode permanecer como está (preto e azul).
    - Os itens do menu lateral desativados (`.nav-item.locked`) possuem `opacity: 0.6` o que degrada o contraste do cinza. Deve ser alterado para remover `opacity: 0.6` e utilizar a cor segura `color: var(--text-muted);` no CSS.

  Scenario: [Happy Path] Verificação de Contraste WCAG AA
    Given que a página foi carregada
    When eu analiso o CSS do logo e do menu desativado
    Then a cor do raio do logo é `#b45309`
    And a classe `.nav-item.locked` não possui `opacity` menor que 1 e possui contraste legível.
