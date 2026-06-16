Feature: O.S. 022 - Interatividade do Botão do Memorial MT

  Como engenheiro eletricista
  Eu quero poder clicar no botão "Memorial de Cálculo Completo (Norma IEC 60502-2)" do painel de Média Tensão
  Para que eu possa expandir e visualizar o passo a passo do cálculo adiabático.

  Rules:
    - O botão do memorial de MT deve responder ao clique do usuário.
    - O Event Delegation do `ui_render.js` (ou o listener correspondente) deve capturar o clique, mesmo se o ícone interno do Lucide for o alvo do evento.
    - Ao clicar, o contêiner do memorial de MT (`#cb-mem-mt-container` ou equivalente da classe `.memorial-step`) deve alternar sua visibilidade (expandir/recolher).
    - Não deve haver erros no console bloqueando o script durante o clique.

  Scenario: [Happy Path] Expansão do Memorial
    Given que eu estou no módulo de Cabos e gerei um cálculo de Média Tensão
    When eu clico no botão de Memorial de Cálculo de MT
    Then a área de conteúdo do memorial se expande, revelando as fórmulas em LaTeX
