Feature: O.S. 026 - Botão de Impressão do Memorial MT

  Como engenheiro eletricista
  Eu quero ter um botão "Exportar PDF" no final do memorial de Média Tensão
  Para que eu possa imprimir apenas a memória de cálculo de MT com facilidade, assim como existe na BT.

  Rules:
    - O botão `<button class="btn-action btn-secondary" id="btn-export-memorial-mt" data-action="export-memorial-mt">` deve ser adicionado no final do conteúdo do acordeão do MT em `ui_render.js`.
    - O botão deve utilizar os ícones Lucide (ícone `printer`).
    - O texto do botão deve ser internacionalizado via `_tbt('memorial.exportPDF')`.

  Scenario: [Happy Path] Exportar PDF no MT
    Given que eu expandi o memorial de Média Tensão
    When eu clico no botão "Exportar PDF" no fim do memorial
    Then a ação `export-memorial-mt` deve ser disparada
