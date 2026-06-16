Feature: O.S. 020 - Persistência do Idioma no Módulo de Cabos

  Como usuário internacional do AmpAI
  Eu quero que o idioma selecionado permaneça ativo ao trocar de abas (módulos)
  Para que eu não precise traduzir a página manualmente a cada clique.

  Rules:
    - O idioma Espanhol (ES) deve estar disponível no seletor global do Header.
    - O módulo de Dimensionamento de Cabos (BT e MT) deve respeitar o idioma globalmente ativo (`document.documentElement.lang`).
    - Todos os textos estáticos do módulo de cabos (ex: "Dimensionamento de Cabos", "Parâmetros BT") devem usar o atributo `data-i18n` para tradução nativa da interface.
    - O gerador dinâmico de HTML (`renderCardMT`) deve extrair as traduções do dicionário em tempo real usando `_tbt('chave')`.

  Scenario: [Happy Path] Alternância de Módulos Preserva o Idioma
    Given que eu seleciono o idioma "Espanhol (ES)" no Header
    When eu clico na aba "Dimensionamento de Cabos"
    Then a página renderiza o card "Dimensionamento de Cabos" traduzido para o Espanhol
    And os passos do Memorial de Média Tensão também aparecem em Espanhol

  Scenario: [Caminho Triste] Fallback seguro para chaves ausentes
    Given que o módulo tente renderizar uma chave não traduzida em Espanhol
    When eu troco para o idioma ES
    Then o sistema deve manter a estrutura HTML sem quebrar, retornando fallback para EN ou a própria chave visualmente
