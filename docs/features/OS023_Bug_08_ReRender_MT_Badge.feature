Feature: O.S. 023 - Re-renderização do Módulo MT e Badge Dinâmico

  Como usuário corporativo
  Eu quero que o módulo de Cabos MT traduza instantaneamente ao trocar o idioma global
  E que a badge do cabeçalho traduza corretamente o nome do método (Curto-Circuito vs Cabos).

  Rules:
    - O wrapper `setLanguage` no `ui_render.js` deve disparar a re-renderização tanto do card BT (`renderCardBT`) quanto do card MT (`renderCardMT`), caso existam payloads na memória (`_lastBTPayload` e `_lastMTPayload`).
    - Na função `switchModule`, o texto do span `[data-i18n="header.method"]` não deve ser sobrescrito com strings fixas em português.
    - Em vez disso, `switchModule` deve usar as chaves do dicionário `_tbt()` ou `i18nDictionary` (ex: `window.i18nDictionary[lang]['header.method.cabling']`), ou apenas trocar a chave do atributo `data-i18n` e invocar a tradução da página.

  Scenario: [Happy Path] Troca de idioma refletindo no card MT
    Given que eu gerei um cálculo de Média Tensão (MT)
    When eu altero o idioma de EN para ES
    Then o Card de Média Tensão deve ser re-renderizado instantaneamente exibindo os textos em Espanhol

  Scenario: [Happy Path] Badge Header Respeita o Idioma
    Given que estou com o idioma ES ativo
    When eu troco para o módulo de Cabos
    Then a descrição no header deve ser "Capacidad de Conducción" e não "Método de las Impedancias" ou textos em português
