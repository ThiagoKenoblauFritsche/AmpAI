Feature: O.S. 017 - Internacionalização Semântica (i18n)

  Como usuário internacional do AmpAI
  Eu quero poder trocar o idioma da aplicação e ver a tradução ser aplicada profundamente
  Para que as labels dos inputs, placeholders, alertas e, PRINCIPALMENTE, os passos do Memorial de Cálculo reflitam o idioma selecionado.

  Rules:
    - O dicionário deve suportar pelo menos "pt" (Português) e "en" (Inglês) para os termos chaves gerados dentro do motor (como "Resultado Final", "Memorial de Cálculo Completo", "Fatores de Correção", "Seção Adotada", "Ampacidade").
    - A função de alteração de idioma deve re-renderizar as telas ativas (injetando novamente o DOM com o dicionário do idioma escolhido).
    - Não hardcodar os textos de título e passos dentro das strings dos literals de javascript (ui_render.js), use um objeto de dicionário de tradução e uma função `t('chave')`.

  Scenario: [Happy Path] Mudança Global de Idioma
    Given que a aplicação possui um seletor de idiomas
    And o idioma atual é "pt"
    When eu altero o idioma para "en"
    Then a interface é re-renderizada automaticamente
    And textos antes como "Memorial de Cálculo Completo" agora são exibidos como "Complete Calculation Memorial" (ou equivalente inglês)

  Scenario: [ZOMBIES - Missing Key Fallback] Tratamento de chave inexistente
    Given que eu solicito o idioma "en"
    When o sistema não encontrar a chave de tradução solicitada (ex: `t('some_new_feature')`)
    Then ele deve usar o idioma "pt" como fallback em vez de quebrar ou exibir undefined
