Feature: O.S. 035 - Performance (FCP/LCP e Main Thread)

  Como usuário com conexão de internet instável
  Eu quero que a interface do AmpAI renderize quase instantaneamente (baixo FCP)
  Para que eu possa ver a estrutura da aplicação enquanto os scripts mais pesados carregam em segundo plano.

  Rules:
    - O arquivo `index.html` importa as bibliotecas `chart.js` e `lucide@latest`. Essas tags `<script>` na seção `<head>` devem conter a propriedade `defer` para não bloquear a renderização.
    - A função `lucide.createIcons()` consome processamento sincrono no carregamento. Ela deve ser encapsulada dentro de um `requestAnimationFrame(() => { lucide.createIcons(); });` para empurrá-la para o próximo frame de renderização, liberando a Main Thread.

  Scenario: [Happy Path] Verificação de Scripts com Defer e Inicialização Assíncrona
    Given que a página foi carregada
    When eu consulto as tags `<script>` no DOM
    Then as bibliotecas externas (chart.js e lucide) possuem o atributo `defer`
    And a chamada `lucide.createIcons()` está protegida por `requestAnimationFrame`.
