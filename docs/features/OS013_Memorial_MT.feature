Feature: Memorial de Cálculo Exportável para Média Tensão (MT)
  Como um Engenheiro Eletricista usuário do AmpAI
  Quero gerar um memorial de cálculo completo e exportável em PDF para redes de Média Tensão (IEC 60502-2)
  Para que eu possa anexá-lo como documentação técnica validada nos projetos executivos.

  # === CAMINHO FELIZ ===
  Scenario: Geração e Exportação de Memorial com Sucesso (Caminho Feliz)
    Given que estou no módulo de dimensionamento de "Média Tensão"
    And preencho as variáveis elétricas de entrada com valores válidos (Ib, Icc, ΔU%, etc.)
    When eu clico em "Calcular"
    And os critérios de Ampacidade, Queda de Tensão e Curto-Circuito são atendidos com sucesso
    Then a interface deve exibir a seção "Memorial de Cálculo IEC 60502-2"
    And as seções Passo 1 ao Passo 5 do memorial devem ser preenchidas com as memórias de cálculo em formato matemático (LaTeX format)
    When eu clico no botão "Imprimir Memorial Técnico"
    Then a função de impressão do navegador deve ser acionada exibindo o layout limpo (apenas os dados do memorial, ocultando barras laterais e controles)

  # === CAMINHOS TRISTES (ZOMBIES) ===
  
  Scenario: Tentativa de exportar memorial sem realizar o cálculo prévio (Missing Data)
    Given que acessei o módulo de "Média Tensão" com o formulário recém-carregado
    And nenhum cálculo foi efetuado ainda (estado limpo)
    When eu tento abrir o Accordion do Memorial ou aciono o evento de "export-memorial-mt"
    Then o sistema não deve permitir a abertura do modal/accordion
    And a impressão não deve ocorrer (ou se ocorrer, deve exibir um aviso de "Cálculo ainda não realizado")
  
  Scenario: Dimensionamento resulta em limite térmico de operação estourado (Boundary Failure)
    Given que preenchi os dados do projeto de MT
    And configurei correntes de projeto (Ib) muito próximas à capacidade máxima de condução, além de Fatores de Correção severos (FCT/FCA baixos)
    When eu realizo o cálculo
    And a temperatura de operação (thetaOp) calculada pelo núcleo DDD excede 95% do limite térmico do isolamento (thetaMax)
    Then o painel de resultados deve destacar a anomalia em cor vermelha (danger)
    And ao gerar o "Memorial de Cálculo IEC 60502-2", os Passos devem expor explicitamente que o limite foi violado
    And a impressão do PDF deve carregar os avisos de advertência técnica, impedindo a aprovação silenciosa

  Scenario: Curto-circuito extremo quebrando o limite da bitola máxima (Exception)
    Given que estou dimensionando um cabo de Média Tensão
    And informo uma corrente de curto-circuito (Icc_A) irrealmente alta (ex: 80 kA) e tempo longo (1.0s)
    When o sistema roda o núcleo do motor (core_cabos_mt.js)
    Then a bitola de curto-circuito (S3) requisitada ultrapassará os limites das tabelas IEC (S > 1000mm²)
    And o motor deve acionar o Result Pattern retornando estado de FALHA
    And o Memorial de Cálculo gerado para impressão deve cravar o veredito "FALHA DE DIMENSIONAMENTO: Curto-circuito excede a maior bitola tabelada pela norma"
