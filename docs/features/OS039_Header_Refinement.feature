Feature: O.S. 039 - Refinamento do Branding no Cabeçalho

  Como usuário da plataforma AmpAI
  Eu quero que o novo logotipo venha acompanhado do nome da plataforma e do subtítulo de forma harmônica
  Para que o cabeçalho transmita um tom corporativo completo (Imagem + Tipografia).

  Rules:
    - O conteúdo dentro de `<div class="header-title">` deve se tornar um container `flex` alinhado ao centro.
    - O logo `img/logo.png` deve ser mantido, mas com dimensões refinadas (ex: `height: 48px; border-radius: 8px; box-shadow: var(--card-shadow); object-fit: cover;`).
    - Ao lado do logo, deve haver uma `<div>` contendo o `<h1>` "AmpAI" e a tag `<p>` "Assistente de Engenharia Elétrica".

  Scenario: [Happy Path] Cabeçalho com Logo e Tipografia Combinados
    Given que a página foi carregada
    When eu consulto a estrutura do `.header-title`
    Then deve existir uma tag `<img>` referenciando o logotipo
    And deve existir um `<h1>` com o texto "AmpAI"
    And deve existir uma tag com o texto "Assistente de Engenharia Elétrica".
