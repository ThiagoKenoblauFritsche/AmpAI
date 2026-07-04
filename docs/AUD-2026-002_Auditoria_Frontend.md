---
tags:
  - auditoria/frontend
  - governanca/ia
status: concluido
persona: Senior_Frontend_Dev
data: 2026-06-22
escopo: index.html, js/ui_render.js (leitura), js/core_*.js (leitura, contrato de dados)
metodologia: 4 auditorias estáticas paralelas (cobertura 100% das 3432 linhas de index.html + 1224 linhas de ui_render.js) + verificação ao vivo via browser real (servidor local porta 8087)
---

# AUD-2026-002 — Auditoria de Frontend (UX/UI, Acessibilidade, Bugs)

## 0. Notas do Projeto (0-100)

> Critério: nota reflete o estado **atual confirmado** (leitura de código + verificação ao vivo), não o potencial da arquitetura. Penaliza mais pesado achados CRÍTICO/ALTO confirmados ao vivo do que achados estáticos não verificados em runtime.

| Categoria | Nota | Justificativa resumida |
|---|---|---|
| Funcionalidade e Wiring | **72/100** | 100% dos `data-action` cobertos, nenhum botão morto, cálculos corretos e sem XSS — mas duplo-disparo de cálculo (§2.5) e campos do painel Cabo inacessíveis via UI (§2.7). |
| Consistência Visual / Design System | **58/100** | Sistema de variáveis CSS e tipografia coerentes na base, mas o sinal visual de status (`success/danger/info`) está **ausente em 3 módulos** (§2.1) — a falha mais cara da categoria. |
| Responsividade | **42/100** | Quebra confirmada e mensurada no fluxo principal (Cabos) em mobile (§2.2); grids do ICC e sidebar sticky também sem tratamento abaixo de certas larguras. |
| Acessibilidade (WCAG 2.1 AA) | **48/100** | Labels e semântica de formulário corretos, mas os padrões dinâmicos que mais importam para leitor de tela — `aria-live` em erros, `aria-expanded` em acordeões — estão ausentes em 100% dos casos verificados (§2.3), e o contraste do tema claro falha AA (medido ao vivo). |
| Internacionalização (i18n) | **58/100** | Dois dicionários pt/en/es cobrem a maior parte da UI estática, mas falham exatamente no momento mais crítico: mensagens de erro de validação (§2.5/2.6), confirmado ao vivo vazando português com UI em inglês. |
| Confiabilidade da Comunicação de Engenharia | **38/100** | 0 de 11 avisos de engenharia conhecidos (`console.warn` BT + `_warnings` MT) chegam à interface (§2.5/2.6) — para uma ferramenta cujo valor central é confiabilidade normativa, isso é a lacuna mais séria do conjunto. |
| Arquitetura e Manutenibilidade | **52/100** | Boas práticas reais (delegação de eventos, null-guards, Result Pattern parcial, hidratação via localStorage) coexistem com uma violação de governança concreta: motor de Curto-Circuito duplicado e divergente do `core_curto_circuito.js` (§2.4). |

### Nota Geral do Projeto (Frontend): **58/100**

Não é uma média aritmética simples — pondera o fato de que os dois achados CRÍTICOS atingem múltiplos módulos simultaneamente, e de que o padrão recorrente "o motor calcula certo, a UI não conta ao usuário" aparece em pelo menos 3 categorias distintas (Visual, i18n, Confiabilidade de Engenharia). Leitura: **MVP funcional com lacunas reais e específicas, não um produto quebrado** — os dois CRÍTICOS têm correção de baixo esforço (CSS puro / media query), o que torna a nota geral recuperável rapidamente sem tocar em lógica de cálculo.

---

## 1. Sumário Executivo

Auditoria não-intrusiva (somente leitura) do frontend do AmpAI — SPA estática em `index.html` (3432 linhas) + `js/ui_render.js` (camada DOM) + 3 motores de cálculo puro (`js/core_cabos_bt.js`, `js/core_cabos_mt.js`, `js/core_curto_circuito.js`). Cobertura: 100% do código-fonte do frontend, lido integralmente por 4 auditorias estáticas independentes (Acessibilidade/Responsividade, Wiring Funcional, Design System Visual, Bugs/Contratos de Dados), complementadas por verificação ao vivo em navegador real (servidor local, screenshots, inspeção de estilos computados, medição de overflow, simulação de erro de validação).

**31 achados classificados:**

| Severidade | Qtd. | Significado |
|---|---|---|
| 🔴 CRÍTICO | 2 | Quebra visível e reproduzível para o usuário final, afeta múltiplos módulos |
| 🟠 ALTO | 8 | Risco real de comunicação/segurança de engenharia ou exclusão de usuários (a11y/i18n) |
| 🟡 MÉDIO | 12 | Inconsistência funcional/manutenibilidade sem quebra visível imediata |
| 🟢 BAIXO | 9 | Cosmético, documental ou risco residual de manutenção |

**Achado mais importante:** o sistema de cores de status dos cartões de resultado (`.result-card.success/.danger/.info`) **nunca foi implementado no CSS** — confirmado ao vivo via inspeção de estilo computado. Isso afeta os 3 módulos de cálculo (Curto-Circuito, BT, MT): nenhum cartão de resultado consegue sinalizar visualmente "dentro do limite" vs. "fora do limite" por cor — o único cartão que se destaca visualmente é o de seção/corrente nominal (`.primary`, laranja). Em uma ferramenta de dimensionamento elétrico, esse é o sinal visual primário de segurança, e ele está ausente silenciosamente.

**Segundo achado mais importante:** o módulo de Dimensionamento de Cabos **quebra completamente em viewport mobile** (confirmado: 852px de largura de conteúdo em uma tela de 375px — 127% de overflow horizontal), com o cabeçalho sobrepondo o badge da norma e a coluna de resultados cortada fora da tela.

Também identificado um item de **dívida arquitetural relevante**: o dashboard principal de Curto-Circuito não usa o motor `core_curto_circuito.js` (Result Pattern, já testado) — ele tem sua **própria implementação de cálculo, ~1100 linhas, embutida inline dentro de `index.html`**, com seu próprio sistema de i18n, tema e gráficos. Isso contraria diretamente a separação Motor-puro/UI documentada no `AmpAI_Engineering_Manifesto.md` e cria risco de duas fontes de verdade para a mesma física (IEC 60909).

---

## 2. Análise Detalhada por Módulo

### 2.1 Global / Design System (CSS)

- **Módulo:** Global — Cartões de Resultado (KPI Cards)
- **Componente:** `.result-card.danger`, `.result-card.success`, `.result-card.info`
- **Severidade:** 🔴 CRÍTICO
- **Localização:** Uso em `index.html:1423,1431,1439` (Curto-Circuito) e geração dinâmica em `js/ui_render.js` (BT: linhas 674/682/690; MT: linhas 870/875/880/885). Definição CSS existente apenas para `.result-card.primary` (`index.html:516-521`).
- **Problema:** As classes `.danger`, `.success` e `.info` não têm nenhuma regra CSS correspondente. Confirmado ao vivo: `.result-card.success` renderiza com `background-color: rgb(22,26,32)` — exatamente o `--bg-secondary` neutro, idêntico ao card sem variante nenhuma.
- **Impacto:** Os cartões de Corrente de Curto Trifásico/Bifásico/Monofásico (Curto-Circuito), Ampacidade/Queda de Tensão/Curto-Circuito (BT) e Ampacidade/Queda de Tensão/Temperatura/Tela (MT) nunca mudam de cor mesmo quando o motor sinaliza falha (`danger`) ou sucesso (`success`). O usuário perde o principal sinal visual de "está dentro da norma ou não" em uma ferramenta cujo propósito é justamente essa verificação.
- **Recomendação:** Implementar `.result-card.danger/.success/.info` no CSS espelhando `.result-card.primary` (fundo + texto usando `var(--danger)`, `var(--success)`, `var(--info)`).

- **Módulo:** Global — Temas e Contraste
- **Componente:** `--accent` (#FF6B00) no tema claro
- **Severidade:** 🟠 ALTO
- **Localização:** `index.html:24` (`--accent` no `:root`), bloco `:root[data-theme="light"]` (`index.html:46-54`, não redefine `--accent`); uso direto em `<span style="color:var(--accent)">AI</span>` no logo (`index.html:~1126`).
- **Problema:** Confirmado ao vivo via estilo computado + cálculo de luminância relativa (WCAG): `#FF6B00` sobre fundo branco (`#FFFFFF`, tema claro) produz razão de contraste **≈ 2,86:1**. O mínimo WCAG AA é 4,5:1 para texto normal e 3:1 para texto grande/ícones — este valor não atinge nenhum dos dois.
- **Impacto:** No tema claro, o "AI" do logo e qualquer outro texto/ícone usando `var(--accent)` diretamente fica com legibilidade comprometida para usuários com baixa visão.
- **Recomendação:** Definir uma variante mais escura de `--accent` (ex.: próxima de `#b45309`, já usada em decisões de design anteriores do projeto) dentro do bloco `[data-theme="light"]`.

- **Módulo:** Global — Documentação vs. Stack Real
- **Componente:** README.md vs. `index.html`
- **Severidade:** 🟡 MÉDIO
- **Localização:** `README.md:8` ("HTML5 e Tailwind CSS"); `index.html` `<head>` (linhas 4-19).
- **Problema:** Não há nenhuma referência a Tailwind no projeto — sem CDN, sem build, sem classes utilitárias. Todo o layout é um design system CSS customizado (BEM-like) em um único bloco `<style>` (linhas 20-1116).
- **Impacto:** Onboarding de novos desenvolvedores (humanos ou IA) baseado no README leva a busca infrutífera por configuração Tailwind.
- **Recomendação:** Atualizar o README para refletir o stack real.

- **Módulo:** Global — Cores Hardcoded
- **Componente:** Accent bars dos painéis ICC; configuração do Chart.js
- **Severidade:** 🟡 MÉDIO
- **Localização:** `index.html:1976,2079,2209` (hex idênticos a `var(--info)/--success/--danger` escritos como literais); `index.html:2021,2141` (`#f59e0b`, `#8b5cf6` sem variável correspondente); `index.html:~3333-3381` (paleta cinza-azulada do Chart.js, alheia à paleta laranja/escura do resto do app).
- **Problema:** Drift de paleta — mudanças futuras em `--danger`/`--success`/`--info` não propagam para esses pontos.
- **Impacto:** Inconsistência visual silenciosa em manutenções futuras.
- **Recomendação:** Substituir por `var(--...)`; avaliar criar `--warning`/`--accent-purple` para as cores sem variável.

- **Módulo:** Global — Estilo Inline
- **Componente:** Atributos `style="..."` no corpo do HTML
- **Severidade:** 🟡 MÉDIO
- **Localização:** 108 ocorrências totais; concentradas nos módulos Cabling (`index.html:1742-1951`) e Impedâncias (`index.html:1957-2266`), em contraste com o módulo Curto-Circuito, majoritariamente baseado em classes.
- **Problema:** Módulos mais novos (Cabling, ICC) não reaproveitaram os padrões de classe já estabelecidos.
- **Impacto:** Mudanças de design consistentes (ex. tamanho de todos os títulos de módulo) exigem editar dezenas de ocorrências individuais.
- **Recomendação:** Extrair padrões repetidos (cabeçalho de módulo h2+p, badges de accent) para classes reutilizáveis.

- **Módulo:** Global — Espaçamento e Tipografia
- **Componente:** Variáveis `--spacing-*`; escala de `font-size`/`font-weight`
- **Severidade:** 🟢 BAIXO
- **Localização:** `index.html:38-42` (variáveis subutilizadas); ~25 valores distintos de `font-size`; `font-weight: 750` não-padrão (mas repetido consistentemente em 5 pontos: títulos de seção/headers de accordion).
- **Problema:** Maioria dos valores respeita um grid implícito de 4px, mas raramente usa as variáveis nomeadas; `750` é não-convencional embora pareça intencional.
- **Impacto:** Baixo risco visual; oportunidade de padronização perdida.
- **Recomendação:** Migrar progressivamente para `var(--spacing-*)`; documentar `750` como peso de marca intencional.

- **Módulo:** Global — CSS Morto (suspeita)
- **Componente:** `.preset-grid`, `.chart-card`
- **Severidade:** 🟢 BAIXO
- **Localização:** `index.html:945,949` (citadas apenas dentro do bloco `@media print`).
- **Problema:** Nenhum uso real encontrado em nenhum elemento do corpo do documento.
- **Impacto:** Ruído documental no CSS, sem efeito funcional.
- **Recomendação:** Confirmar se são vestígios de versão anterior e remover.

### 2.2 Responsividade

- **Módulo:** Cabos (BT/MT) — `.cabling-grid`
- **Severidade:** 🔴 CRÍTICO
- **Localização:** `index.html:1760,1843` (`style="display:grid; grid-template-columns:320px 1fr;"`, sem media query em tela — só existe override para `@media print`, linha 936-938).
- **Problema:** Confirmado ao vivo em viewport 375×812 (preset mobile): `document.documentElement.scrollWidth = 852px` contra `clientWidth = 375px` — **127% de overflow horizontal**. Screenshot mostra o cabeçalho/logo sobrepondo o badge de norma e a coluna de resultados cortada fora da tela.
- **Impacto:** O módulo de dimensionamento de cabos — provavelmente o fluxo mais usado do produto — é inutilizável em smartphone.
- **Recomendação:** Adicionar `@media (max-width: 900px) { .cabling-grid { grid-template-columns: 1fr; } }` fora do escopo de impressão.

- **Módulo:** Layout Principal
- **Componente:** `.main-layout`, `.nav-sidebar`, `.sidebar` (sticky)
- **Severidade:** 🟡 MÉDIO
- **Localização:** `index.html:190-196` (grid `280px 360px 1fr`), media queries em 1200px/1024px (linhas 214-224); `.sidebar` com `position:sticky` + `max-height:calc(100vh-3rem)` (linha 335-336) mesmo após o colapso para coluna única.
- **Problema:** Abaixo de 1024px o grid colapsa para 1 coluna (correto), mas duas áreas (`nav-sidebar` e `sidebar`) mantêm `position:sticky`+scroll interno competindo por espaço vertical no fluxo empilhado.
- **Impacto:** Comportamento de rolagem pouco ergonômico em tablets/mobile (não confirmado visualmente com 100% de certeza — depende de renderização real).
- **Recomendação:** Remover `sticky`/`max-height` dessas áreas abaixo de um breakpoint mobile dedicado.

- **Módulo:** Impedâncias (ICC)
- **Componente:** Grid 2×2 dos painéis Rede/Trafo/Gerador/Cabo
- **Severidade:** 🟡 MÉDIO
- **Localização:** `index.html:1971` (`grid-template-columns:1fr 1fr`, sem media query própria; o grid *interno* de cada painel já colapsa corretamente em 900px via `.icc-form-grid`, linha 1085-1086).
- **Problema:** Usa unidades fluidas (risco menor que px fixo), mas ainda assim comprime 2 painéis lado a lado antes do colapso interno.
- **Impacto:** Usabilidade degradada (não quebra) em smartphones.
- **Recomendação:** Adicionar media query análoga à de `.icc-form-grid` para o grid externo dos painéis.

- **Módulo:** Layout — Estabilidade após resize de viewport
- **Severidade:** 🟢 BAIXO (observação, não totalmente diagnosticada)
- **Localização:** `.nav-sidebar` / `.main-layout` (grid-template-columns).
- **Problema:** Ao simular uma sequência de resize (mobile → desktop) durante a auditoria ao vivo, o `.nav-sidebar` ficou momentaneamente com `width: 49.6px` (altura íntegra de 148px) e o grid do `.main-layout` ficou em apenas 2 colunas (`49.6px 733.575px`) em vez do esperado para a largura intermediária. Não isolei uma causa raiz determinística nem confirmei se é um problema do app ou uma particularidade do ambiente de preview usado nesta auditoria.
- **Impacto:** Risco potencial de o layout não se recuperar corretamente após mudanças de viewport (rotação de tablet, redimensionar janela) — recomenda-se confirmação manual em navegador real antes de descartar.
- **Recomendação:** Testar manualmente redimensionamento de janela/rotação de dispositivo; se reproduzível, investigar se algo depende de uma leitura de `window.innerWidth` feita uma única vez (sem listener de `resize`).

### 2.3 Acessibilidade (WCAG 2.1 AA)

- **Módulo:** Global — Banners de Erro
- **Componente:** `#alert-error`, `#bt-alert-error`, `#mt-alert-error`, `#icc-alert-*`
- **Severidade:** 🟠 ALTO
- **Localização:** `index.html:1201,1764,1848,1981,2026,2084,2146,2215`.
- **Problema:** Nenhum desses banners tem `role="alert"`/`aria-live`. **Confirmado ao vivo**: após disparar um erro real (`In < Ib` no formulário BT), `bt-alert-error` ficou com `aria-live: null, role: null` mesmo após `classList.add('active')`. Em contraste, `#icc-toaster` já tem `role="alert" aria-live="assertive"` corretamente desde o HTML estático.
- **Impacto:** Usuários de leitor de tela não são avisados automaticamente de erros de validação física dos parâmetros — precisam navegar manualmente até o banner para descobri-los.
- **Recomendação:** Adicionar `role="alert" aria-live="assertive"` a todos os `.alert-banner`, replicando o padrão já correto do `icc-toaster`.

- **Módulo:** Global — Acordeões (Memoriais de Cálculo)
- **Componente:** `.accordion-header` (estático e gerado via `toggle-memorial-bt`/`-mt`)
- **Severidade:** 🟠 ALTO
- **Localização:** `index.html:1613` (`toggleAccordion()`); `js/ui_render.js:774,781,910,917` (BT/MT, handlers em `ui_render.js:563-610`).
- **Problema:** Nenhum botão de accordion seta `aria-expanded`/`aria-controls`, em nenhum dos dois mecanismos (função inline `toggleAccordion()` ou handlers `data-action`).
- **Impacto:** Leitor de tela anuncia apenas "botão", sem indicar que controla uma região expansível nem seu estado — viola WCAG 4.1.2.
- **Recomendação:** Adicionar `aria-expanded`/`aria-controls` estáticos e atualizá-los dinamicamente em ambos os mecanismos.

- **Módulo:** Cabos/ICC — Formulários
- **Componente:** Inputs com erro de validação
- **Severidade:** 🟡 MÉDIO
- **Localização:** `js/ui_render.js:1010-1022` (`showIccError`, adiciona `icc-input-error` sem `aria-invalid`); formulários BT/MT sem `aria-describedby` ligando input ↔ mensagem de erro.
- **Problema:** Estado de erro é só visual (borda vermelha via CSS), sem equivalente programático.
- **Impacto:** Usuário de leitor de tela em foco no campo inválido não é informado do erro.
- **Recomendação:** Definir `aria-invalid="true"`/`aria-describedby` ao marcar erro; remover ao limpar.

- **Módulo:** Global — Estrutura Semântica
- **Componente:** `<main>` duplicado
- **Severidade:** 🟢 BAIXO
- **Localização:** `index.html:1412` (`main.dashboard`), `1833` (`#card-bt`), `1940` (`#card-mt`).
- **Problema:** Três elementos `<main>` no documento (alternados via JS, nunca confirmados como simultâneos).
- **Impacto:** Risco de ambiguidade para o comando de navegação "ir para conteúdo principal".
- **Recomendação:** Usar um único `<main>` envolvendo a área de conteúdo; `card-bt`/`card-mt` como `<section>`.

- **Módulo:** Global — Foco por Teclado
- **Componente:** Estados `:focus-visible`
- **Severidade:** 🟡 MÉDIO
- **Localização:** `index.html:397-403` (`:focus` customizado existe só para `input[type=number]` e `select`).
- **Problema:** Nenhum `:focus-visible` customizado para botões, links de nav, toggles, checkboxes — dependem do outline nativo do browser, que pode ter contraste insuficiente sobre fundos coloridos (`.btn-accent`, `.nav-item.active`).
- **Impacto:** Indicador de foco potencialmente de baixo contraste em elementos-chave.
- **Recomendação:** `:focus-visible` explícito e consistente em todo elemento interativo clicável.

- **Módulo:** Global — Tema (botão alternar)
- **Componente:** `#theme-toggle`
- **Severidade:** 🟢 BAIXO
- **Localização:** `index.html:1151-1153`.
- **Problema:** `aria-label="Alternar Tema"` estático, fixo em português, nunca atualizado para refletir o próximo estado, e não conectado ao sistema i18n (que já suporta `data-i18n-title`).
- **Impacto:** Usuários em EN/ES ouvem rótulo em português; nenhum idioma comunica a ação real do botão.
- **Recomendação:** Conectar a `data-i18n-title`; tornar dinâmico ("Switch to light/dark mode").

- **Módulo:** Acessibilidade — Verificações Positivas
- **Severidade:** 🟢 BAIXO (sem problema — registrado para evidenciar rigor da auditoria)
- **Achados confirmados corretos:** associação `<label for="">`/`id` correta em praticamente 100% dos inputs (incl. campos customizados R0/R1, X0/X1); nenhum `<div>`/`<span>` clicável fora do padrão `<button>`/`<a>`/`data-action`; checkboxes ICC usam `disabled` nativo corretamente (não simulado via CSS); requisito histórico da OS024 (memorial BT sem strings fixas, só placeholders `{cond}`/`{ins}`/`{duMax}`/`{t_s}`) continua cumprido.

### 2.4 Curto-Circuito (Dashboard Principal — IEC 60909)

- **Módulo:** Curto-Circuito — Arquitetura
- **Componente:** Motor de cálculo do dashboard principal
- **Severidade:** 🟠 ALTO
- **Localização:** `index.html:2319-3426` (bloco `<script>` inline, ~1100 linhas: dicionário i18n completo, `calculate()`, `setGridInputMode()`, `switchTab()`, `toggleAccordion()`, `applyTheme()`, `renderChart()` via Chart.js, hidratação de módulo); vs. `js/core_curto_circuito.js` (motor "puro", Result Pattern, usado apenas pelos 5 sub-formulários do módulo Impedâncias).
- **Problema:** O dashboard principal de Curto-Circuito (com Grupo de Ligação/sequência zero, RN/XN, diagrama unifilar, curvas analíticas) **não usa `core_curto_circuito.js`** — tem sua própria implementação completa embutida em `index.html`, com seu próprio dicionário i18n (`i18nDictionary`, paralelo ao `_btI18n` de `ui_render.js`) e seu próprio sistema de eventos (`onclick` inline, não `data-action`). Isso contraria a separação Motor-puro (`core_*.js`) / UI documentada como "inegociável" no `AmpAI_Engineering_Manifesto.md`.
- **Impacto:** Duas implementações independentes da física de curto-circuito IEC 60909 no mesmo projeto — risco de divergência de resultados entre o dashboard principal e o módulo Impedâncias caso uma seja corrigida/atualizada sem a outra, e ausência de cobertura de teste unificada (a suíte `tests/test_os0XX.js` não foi auditada quanto a cobrir esta lógica inline).
- **Recomendação:** Decisão explícita de produto/arquitetura: (a) migrar a lógica inline para `core_curto_circuito.js` e o dashboard para consumi-la, unificando a fonte de verdade; ou (b) documentar formalmente por que as duas implementações coexistem e quando cada uma se aplica.

- **Módulo:** Curto-Circuito — Estado Inicial
- **Severidade:** 🟡 MÉDIO
- **Localização:** `calculate()` não é chamado no `DOMContentLoaded` do dashboard principal.
- **Problema:** **Confirmado ao vivo**: com a sidebar já preenchida com valores padrão plausíveis (Scc=500MVA, SnT=1500kVA, UnT=380V), os 4 KPIs (In, Ik3, Ik2, Ik1) permanecem em "--" até a primeira interação do usuário (calculate() só dispara via `oninput`/`onchange`).
- **Impacto:** Pode ser lido como "a calculadora não funciona" por um usuário novo antes de tocar em qualquer campo.
- **Recomendação:** Disparar `calculate()` uma vez no carregamento do módulo, já que os defaults são valores válidos.

- **Módulo:** Curto-Circuito — Navegação e Controles
- **Componente:** `onclick` inline (nav principal, idioma, tabs, accordion, modo Scc/Icc)
- **Severidade:** 🟡 MÉDIO
- **Localização:** 14 ocorrências de `onclick=` no documento, todas concentradas no header/nav global e no módulo Curto-Circuito (`index.html:1137-1227,1450-1458,1613,1728`); zero ocorrências dentro de `#module-cabling`/`#module-impedances`, que usam exclusivamente `data-action`.
- **Problema:** Dois padrões de wiring de evento coexistem: `onclick` inline direto (legado, shortcircuit+nav) vs. delegação central via `data-action` (Cabling/Impedances, documentada como arquitetura oficial no topo de `ui_render.js`).
- **Impacto:** Sem quebra funcional, mas dívida arquitetural — quem só conhece o padrão documentado pode não perceber que a navegação principal usa outro mecanismo.
- **Recomendação:** Documentar a divergência explicitamente, ou migrar gradualmente para `data-action`.

### 2.5 Cabos — Baixa Tensão (BT)

- **Módulo:** Cabos BT
- **Componente:** Botões `#btn-bt`/`#btn-mt` dentro de `<form>`
- **Severidade:** 🟡 MÉDIO
- **Localização:** `index.html:1828` (`<button id="btn-bt" data-action="calc-bt">` sem `type` dentro de `<form id="form-bt">`, idem `index.html:1935` para MT.
- **Problema:** Sem `type="button"` explícito, o botão assume `type="submit"` por default HTML. Como `js/ui_render.js` registra DOIS listeners independentes para o mesmo clique — delegação `click` em `[data-action]` (linhas 478-509) **e** `submit` no formulário (linhas 441-462) — um único clique dispara o cálculo e a renderização **duas vezes** em sequência síncrona. O lock anti-loop (`window.isRendering`, liberado só após 100ms via `setTimeout`) não impede a segunda chamada da função de cálculo, apenas pode descartar silenciosamente a segunda escrita no DOM.
- **Impacto:** Trabalho redundante a cada clique (função pura/idempotente, então o resultado final visível é o mesmo, mas o cálculo roda em dobro).
- **Recomendação:** Adicionar `type="button"` explícito em `#btn-bt`/`#btn-mt`, já que a delegação `data-action` já cobre o clique.

- **Módulo:** Cabos BT
- **Componente:** Mensagens de erro de validação (`[QA-BT-001]` etc.)
- **Severidade:** 🟠 ALTO
- **Localização:** `js/core_cabos_bt.js:82-90,124` (`throw new Error(...)`, todas em português); consumidas em `js/ui_render.js:455,494` via `err.message`.
- **Problema:** **Confirmado ao vivo**: com a UI em inglês (EN ativo) e um valor inválido (`In=50 < Ib=100`), o banner de erro exibiu **"[QA-BT-001] O Disjuntor/Fusível (In = 50A) não pode ser menor que a Corrente de Projeto (Ib = 100A)."** — 100% em português, ignorando completamente os dois sistemas de i18n existentes no projeto (`i18nDictionary` em `index.html` e `_btI18n` em `ui_render.js`), pois os motores (`core_cabos_bt.js`/`core_cabos_mt.js`) lançam strings literais fixas.
- **Impacto:** Qualquer violação de validação física/normativa nos formulários de cabos quebra a experiência de internacionalização por completo para usuários EN/ES — justamente no momento em que o usuário mais precisa entender a mensagem (um erro bloqueante).
- **Recomendação:** Mover as mensagens para chaves i18n resolvidas na camada de UI (motor lança código de erro + parâmetros; `ui_render.js` resolve o texto via `_tbt`/dicionário), mantendo os motores livres de DOM.

- **Módulo:** Cabos BT
- **Componente:** `console.warn` não-fatal (`QA-BT-005`, `QA-BT-011`)
- **Severidade:** 🟠 ALTO
- **Localização:** `js/core_cabos_bt.js:87` (tempo de proteção > 5s invalida hipótese adiabática), `:104` (fator de agrupamento aproximado para método enterrado).
- **Problema:** Avisos de engenharia genuínos ficam só no console do navegador — nenhuma renderização equivalente em `ui_render.js`/`index.html`.
- **Impacto:** Engenheiro pode operar sob hipótese adiabática invalidada sem nunca saber, pois o aviso nunca chega à tela.
- **Recomendação:** Expor como banner de aviso não-bloqueante (visualmente distinto do banner de erro fatal).

- **Módulo:** Cabos BT
- **Componente:** Card inicial `#card-bt`
- **Severidade:** 🟢 BAIXO
- **Localização:** `index.html:1833-1835`.
- **Problema:** Completamente vazio no HTML estático (só comentário indicando injeção dinâmica) — diferente do card MT, que tem KPI placeholder pré-renderizado.
- **Impacto:** Janela mínima de inconsistência estrutural entre os dois fluxos (mitigada por `min-height:420px` reservado via CSS, que evita CLS).
- **Recomendação:** Uniformizar — ambos com ou sem placeholder estático.

### 2.6 Cabos — Média Tensão (MT)

- **Módulo:** Cabos MT
- **Componente:** Array `input._warnings`
- **Severidade:** 🟠 ALTO
- **Localização:** `js/core_cabos_mt.js:194` (declaração) e 9 pontos de `.push(...)` (linhas 216,218,219,224,229,231,234,236,317,356 — ex.: Icc>100kA fisicamente improvável, t>5s invalida hipótese adiabática IEC 60949, seção da tela > condutor principal, fator combinado <0,30).
- **Problema:** Confirmado: nem `js/ui_render.js` nem `index.html` leem ou renderizam `_warnings` em nenhum ponto — busca recursiva no projeto só encontra a string em documentação.
- **Impacto:** Avisos de engenharia sobre condições de instalação atípicas/extremas — computados explicitamente pelo motor MT — nunca chegam ao usuário. O resultado numérico aparenta normalidade mesmo em cenários que o próprio backend sinalizou como fisicamente extremos.
- **Recomendação:** Em `renderCardMT`, iterar `data.input._warnings` e renderizar como banner de aviso não-bloqueante.

- **Módulo:** Cabos MT
- **Componente:** Placeholder estático do `#card-mt`
- **Severidade:** 🟡 MÉDIO
- **Localização:** `index.html:1943` ("Seção Adotada", PT hardcoded sem `data-i18n`), `:1945` (`#mt-val-dominant`, "Dominante: --" idem).
- **Problema:** Textos fixos em português, divergindo do padrão `_tbt('mt.kpi.section')`/`_tbt('mt.kpi.dominant')` usado no template gerado dinamicamente. Adicionalmente, a pré-chamada automática de `calculateCablingMT()` ao entrar no módulo (`ui_render.js:358-362`) está num `try{...}catch(e){}` **vazio** — se falhar, o placeholder em português permanece indefinidamente.
- **Impacto:** Em sessão com idioma EN/ES, há uma janela (normalmente curta) com texto em português; se a pré-chamada falhar silenciosamente, a janela se torna permanente.
- **Recomendação:** Adicionar `data-i18n` aos dois textos; ao menos logar o erro do catch vazio para diagnóstico.

### 2.7 Impedâncias (ICC — IEC 60909, sub-calculadoras)

- **Módulo:** Impedâncias — Painel Cabo (Zl)
- **Componente:** Campos condicionais `icc-campo-thetaE`/`-alpha`/`-thetaMax`
- **Severidade:** 🟠 ALTO
- **Localização:** `index.html:2181-2192` (`style="display:none"`, dependem do select `#icc-regime-cabo`).
- **Problema:** Nenhum listener de `change` em `icc-regime-cabo` (em `ui_render.js` ou nas 14 ocorrências de `onclick`/`onchange` do documento) alterna a visibilidade desses 3 campos. `calcIccCabo()` lê os 3 valores incondicionalmente.
- **Impacto:** Ao selecionar o regime "Mínima (corrige por θe)", o usuário não tem como preencher `thetaE`/`alpha`/`thetaMax` pela UI — o cálculo usa silenciosamente os defaults do HTML (`70`, `0.00393`, `90`), nunca os valores reais do caso.
- **Recomendação:** Adicionar listener de `change` em `#icc-regime-cabo` que exiba/oculte os 3 campos condicionalmente.

- **Módulo:** Impedâncias — Consistência dos 5 fluxos
- **Severidade:** 🟢 BAIXO (verificação positiva)
- **Localização:** `index.html:1974-2263`.
- **Problema:** Nenhum. Os 5 painéis (Rede/Trafo/Gerador/Cabo/Agregar) seguem estrutura idêntica (`.icc-panel-header`, `.alert-banner`, `.icc-form-grid`, `.btn-icc-calc`, `.icc-result-block`); todos os 20 `data-action` usados batem exatamente com os 20 `case` do switch em `ui_render.js`. Nenhum botão morto encontrado.
- **Recomendação:** Nenhuma ação necessária.

### 2.8 Navegação Global

- **Módulo:** Navegação — "Derating por Altitude"
- **Severidade:** 🟢 BAIXO
- **Localização:** `index.html:1184-1190`.
- **Problema:** Não é um bug — é um placeholder intencional "Coming Soon/Locked" (classe `.locked`, ícone de cadeado, `title`/i18n próprios). Único nit: `href="#"` sem `return false`, então um clique acidental altera o hash da URL para `#` (inofensivo, mas inconsistente com os outros 3 itens de nav que usam `return false`).
- **Recomendação:** Adicionar `onclick="return false;"` por consistência; nenhuma urgência.

---

## 3. Top 5 Recomendações Prioritárias

1. **Implementar as classes de cor `.result-card.danger/.success/.info` no CSS.** Esforço baixíssimo (regras CSS, espelhando `.primary` já existente), impacto altíssimo: restaura o sinal visual de segurança em todo o app (Curto-Circuito, BT e MT simultaneamente).
2. **Corrigir a quebra de layout mobile do módulo Cabos** (`grid-template-columns` fixo sem media query) e revisar os demais grids inline (painéis ICC) com a mesma lógica. Torna o fluxo provavelmente mais usado do produto utilizável em smartphone.
3. **Decidir e resolver a duplicação do motor de Curto-Circuito** (lógica inline em `index.html` vs. `core_curto_circuito.js`). Não é urgente para o usuário hoje, mas é o item de maior risco de longo prazo: divergência física silenciosa entre dois "motores de verdade" da mesma norma IEC 60909.
4. **Expor os avisos de engenharia hoje presos no console/`_warnings`** (BT: `QA-BT-005`/`QA-BT-011`; MT: 9 códigos em `_warnings`). Ferramenta de engenharia elétrica não deveria esconder do usuário sinais de "condição atípica/extrema" que o próprio motor já calculou.
5. **Pacote de i18n + acessibilidade nos caminhos de erro**: traduzir as mensagens `[QA-BT-*]`/`[QA-MT-*]` (hoje 100% em português independente do idioma ativo — confirmado ao vivo) e adicionar `role="alert" aria-live`/`aria-expanded` nos pontos já mapeados. Esforço moderado, cobre tanto usuários internacionais quanto usuários de leitor de tela.

---

## 4. Conclusão e Próximos Passos

O AmpAI tem uma base de engenharia backend rigorosa (Result Pattern parcialmente adotado, validação fail-fast extensa com códigos de erro rastreáveis, suíte de testes Gherkin+Puppeteer real e pareada por O.S.) e um histórico de correções incrementais de UI/UX/acessibilidade bem documentado (OS021 a OS039). A auditoria, no entanto, expõe um **gap consistente entre o rigor do backend e a camada de comunicação ao usuário**: avisos de engenharia computados nunca chegam à tela (BT e MT), mensagens de erro vazam português independente do idioma, e o sinal visual primário de conformidade (cores de status) está ausente havia tempo suficiente para passar por múltiplas O.S. de "Premium Cards"/"Estética Fina" sem ser percebido — sugerindo que esse gap específico não está coberto pela suíte de testes automatizados atual (os testes parecem validar valores numéricos/strings, não classes CSS de variante de cor).

Os dois achados críticos (cores de status ausentes; mobile quebrado no módulo Cabos) são, não por coincidência, de **baixo esforço de correção** — recomenda-se resolvê-los primeiro, antes do pacote arquitetural maior (item 3 do Top 5).

**Próximos passos sugeridos:**
- Corrigir os 2 achados CRÍTICOS (CSS puro, sem risco de regressão em lógica de cálculo).
- Abrir uma O.S. dedicada para decidir o destino do motor de curto-circuito inline (item 3) — decisão arquitetural, não correção mecânica.
- Adicionar ao TDD existente um teste que verifique que toda classe de variante usada em templates (`grep` por `result-card \w+` em `ui_render.js`/`index.html`) tem uma regra CSS correspondente — evita recorrência do achado crítico #1.
- Adicionar um caso de teste Gherkin explícito para "mensagem de erro de validação respeita o idioma ativo" — hoje nenhuma O.S. parece cobrir esse cenário.

---

*Auditoria realizada por leitura integral de código-fonte (4 frentes paralelas) + verificação ao vivo em navegador (servidor local `http-server` porta 8087): screenshots, inspeção de estilo computado, medição de overflow de viewport, e simulação de erro de validação real. Nenhuma linha de código foi alterada.*
