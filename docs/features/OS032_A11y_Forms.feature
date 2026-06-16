Feature: O.S. 032 - A11y (Formulários Acessíveis e Leitores de Tela)

  Como engenheiro eletricista que utiliza leitor de tela
  Eu quero que todos os campos de entrada tenham um rótulo associado programaticamente
  Para que o meu leitor de tela (NVDA, VoiceOver) saiba anunciar o que deve ser digitado em cada campo.

  Rules:
    - O arquivo `index.html` contém diversas tags `<label>` logo acima das tags `<input>` ou `<select>`.
    - Toda tag `<label>` associada a um input deve possuir o atributo `for` contendo o `id` exato do `<input>` correspondente.
    - O desenvolvedor deve localizar todas as `<label>`s na barra lateral (Curto-Circuito e Cabos) e garantir que o atributo `for` exista.

  Scenario: [Happy Path] Verificação de Relacionamento Label-Input
    Given que a página foi carregada
    When um script varre todos os inputs e selects do tipo "form-control"
    Then o script deve conseguir rastrear um elemento `<label>` cujo `for` seja idêntico ao `id` do respectivo input.
