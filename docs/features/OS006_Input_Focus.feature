Feature: O.S. 006 - Reatividade e Preservação de Foco no Input

  Como engenheiro eletricista que utiliza o AmpAI
  Eu quero que o sistema calcule automaticamente enquanto eu digito os valores (debounce)
  Para que eu consiga ver a resposta sem precisar clicar em "calcular", MAS eu também não quero perder o foco do teclado no meu input durante a re-renderização.

  Rules:
    - O binding de eventos deve considerar "input" ou "keyup" para reatividade.
    - Se a engine recriar componentes do DOM, o foco deve ser re-aplicado ao ID que estava com foco, OU a arquitetura deve mudar para atualizar apenas o `innerHTML` ou `value` das seções filhas, sem fazer rebuild do DOM inteiro (Accordion).
    - Evitar "Loop Infinito": quando um script altera o valor do input, não deve re-disparar o evento `input` caso o valor seja o mesmo, impedindo um feedback loop que congela a tela.

  Scenario: [Happy Path] Reatividade com Foco Mantido na Baixa Tensão
    Given que estou na aba de Baixa Tensão (BT)
    When eu clico no input "bt-length" e digito o valor "25"
    Then o cálculo é processado automaticamente e o painel de resultados se atualiza
    And o meu cursor do teclado continua no campo "bt-length" após a renderização
    And eu posso digitar "0" para formar "250" sem interrupção

  Scenario: [ZOMBIES - Boundaries] Prevenção de Loops no Estado
    Given que um valor inicial no input "mt-icc" é "12.5"
    When o sistema tenta auto-corrigir o valor para o mínimo aceitável
    Then o evento não deve disparar em ciclo infinito
    And o navegador deve permanecer responsivo

  Scenario: [ZOMBIES - Exception] Digitação rápida em sequência
    Given que a função debounce está ativa em 300ms
    When eu digito "1" e depois "2" e "3" no campo "bt-ib" rapidamente
    Then o cálculo só é rodado 1 vez após a pausa da digitação (debounce respeitado)
    And o input "bt-ib" nunca perde o cursor no meio do processo
