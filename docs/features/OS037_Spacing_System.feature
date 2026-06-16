Feature: O.S. 037 - Sistema de Design de Espaçamento e Grid

  Como usuário da aplicação SaaS AmpAI
  Eu quero que os blocos de conteúdo e o cabeçalho possuam um alinhamento e espaçamento rigorosamente matemáticos e previsíveis
  Para que o layout seja visualmente relaxante, consistente e transmita nível corporativo (Premium).

  Rules:
    - Novas variáveis baseadas em múltiplos de 8px devem existir em `:root`: `--spacing-sm: 8px`, `--spacing-md: 16px`, `--spacing-lg: 24px`, `--spacing-xl: 32px`, `--container-padding: 32px`.
    - O padding geral da aplicação (`.app-container`) deve ser unificado em `padding: var(--spacing-lg) var(--container-padding);` (24px 32px).
    - O espaçamento principal do grid (`.main-layout gap`) e da borda inferior do cabeçalho (`header margin-bottom`) deve ser igualado a `var(--spacing-lg)` (24px) para cadência visual unificada.
    - O espaçamento interno dos painéis como a barra lateral (`.nav-sidebar`) e os cards internos (`.tab-content-card`) deve usar também `padding: var(--spacing-lg)`.

  Scenario: [Happy Path] Padronização Rigorosa do Grid e Espaçamentos
    Given que a página foi carregada
    When eu consulto as propriedades CSS computadas de padding e margin
    Then o `.app-container`, `.nav-sidebar` e `.tab-content-card` devem apresentar métricas padronizadas derivadas das variáveis CSS.
    And o `gap` do container principal deve ser 24px consistentes.
