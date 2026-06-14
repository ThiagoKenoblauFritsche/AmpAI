Feature: O.S. 002 - Tooltips informativos para os Métodos de Instalação IEC

  Como usuário que está configurando um cálculo elétrico
  Eu quero passar o mouse sobre as opções de Métodos de Instalação IEC
  Para ver uma dica visual (Tooltip) que explique o que cada método significa sem precisar sair da página.

  Rules:
    - Os selects ou labels dos "Métodos de Instalação" (ex: B1, E, F) devem possuir um atributo `data-tooltip="Mensagem explicativa"`.
    - Apesar do backlog citar "Tailwind CSS", a arquitetura do projeto prioriza Vanilla CSS. A implementação DEVE ser em puro CSS (usando `:hover`, `::before` e `::after`) ou JS simples, sem importar a biblioteca Tailwind.
    - O Tooltip deve aparecer próximo ao cursor ou acima do elemento, sem quebrar o layout da página.

  Scenario: [Happy Path] Exibição de Tooltip com hover
    Given que eu navego até a seção de Métodos de Instalação (Instalação IEC)
    When eu posiciono o mouse sobre o label ou ícone de informação de um método
    Then um pequeno balão (Tooltip) deve aparecer contendo o texto explicativo
    When eu removo o mouse do elemento
    Then o Tooltip deve desaparecer suavemente (transition/opacity)
