Feature: O.S. 034 - A11y (Contraste de Textos Secundários no Card Primário)

  Como usuário com baixa visão
  Eu quero que as descrições e unidades no card de resultado principal tenham um contraste legível
  Para que eu consiga entender do que se trata o valor em destaque sem forçar a visão.

  Rules:
    - O fundo do Card Primário agora é escuro (`#0f172a`), mas os textos `.result-desc` e `.result-unit` continuam usando a cor antiga (`#64748b` ou `--text-secondary`), gerando baixo contraste (3.75:1).
    - No arquivo `index.html`, devemos adicionar regras CSS específicas para que `.result-desc` e `.result-unit` que estejam DENTRO de um `.result-card.primary` utilizem uma cor mais clara (ex: `#cbd5e1` - slate-300 ou `#94a3b8` - slate-400).

  Scenario: [Happy Path] Verificação de Contraste em Descrições e Unidades
    Given que a página foi carregada
    When eu consulto a cor computada do `.result-desc` dentro do `.result-card.primary`
    Then a cor computada não pode ser o cinza médio escuro original, e sim um tom claro de cinza/branco.
