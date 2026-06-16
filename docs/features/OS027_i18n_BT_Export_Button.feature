Feature: O.S. 027 - i18n do Botão de Exportar PDF (BT)

  Como usuário internacional
  Eu quero que o texto do botão de exportar o memorial BT obedeça ao idioma selecionado
  Para que não fiquem vestígios de texto fixo em português ("Imprimir Memorial Técnico") quando a interface estiver em inglês ou espanhol.

  Rules:
    - O texto hardcoded `<span>Imprimir Memorial Técnico</span>` na função `renderCardBT` deve ser substituído por `<span>${_tbt('memorial.exportPDF')}</span>`.
    - A chave `memorial.exportPDF` já existe no dicionário global `_btI18n` (inserida na O.S. 026).

  Scenario: [Happy Path] Renderização do Botão Traduzido
    Given que eu navego para o módulo de cabos BT em inglês
    When o memorial é renderizado no DOM
    Then o botão de exportar deve conter o texto correspondente do dicionário (ex: "Export PDF" em inglês, ou o valor da chave `memorial.exportPDF`) e não a string hardcoded "Imprimir Memorial Técnico".
