Feature: O.S. 038 - Atualização e Reposicionamento do Logotipo (Branding)

  Como usuário corporativo
  Eu quero que o software exiba o novo Logotipo oficial (AmpAI) no cabeçalho superior esquerdo
  Para que a identidade visual ("Ecossistema SaaS / Engenharia Elétrica Avançada") seja o primeiro impacto, no lugar de um título genérico.

  Rules:
    - A div interna com o título genérico (`<h1 data-i18n="header.title">` e a tag `<p>`) dentro de `<header> .header-title` no `index.html` deve ser substituída por uma tag `<img>` referenciando `img/logo.png`.
    - A tag de imagem deve ter estilo para limitar sua altura (ex: `height: 50px; object-fit: contain;`) para não quebrar o layout.
    - O bloco antigo do logo que estava dentro da barra lateral (`.nav-sidebar`), incluindo o ícone SVG provisório e o texto "AmpAI", deve ser inteiramente removido do HTML.

  Scenario: [Happy Path] Validação de Presença e Posição do Novo Logo
    Given que a página foi carregada
    When eu consulto a estrutura do Cabeçalho e da Barra Lateral
    Then a tag de imagem "img/logo.png" deve existir dentro do `.header-title`
    And a tag `<h1>` com texto genérico "Assistente de Engenharia Elétrica" não deve mais existir no cabeçalho
    And o SVG provisório do AmpAI não deve existir dentro da `.nav-sidebar`.
