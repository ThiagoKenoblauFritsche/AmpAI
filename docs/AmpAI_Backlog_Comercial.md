---
tags:
  - gestao/backlog
  - ampai/business
versao: 6
status: em-andamento
---

## 📈 Backlog de Feedbacks e O.S. Comerciais

- [x] **O.S. #001** | `[MÉDIA]` Mitigação de infinito térmico e tratamento de divisões por zero com guardas lógicas no módulo de cabos BT.
- [x] **O.S. #002** | `[BAIXA]` Implementação de Tooltips informativos em Tailwind CSS para os Métodos de Instalação IEC.
- [x] **O.S. #003** | `[CRÍTICA]` Bug #01: Desconexão de dados e lógica de convergência no Módulo de Média Tensão (MT).
	- *Cenário:* Os KPIs superiores calculam curto-circuito de tela (35mm²), mas as abas inferiores e o memorial congelam exibindo lógica antiga de BT (S1=95mm²).
	- *Ação Futura:* Refatorar o motor de renderização reativa em `js/ui_render.js` para ler e integrar os outputs matemáticos gerados pelo módulo isolado `js/core_cabos_mt.js`.
- [x] **O.S. #004** | `[ALTA]` Bug #02: Badge Normativo do Header Estático/Hardcoded na Interface SPA.
- [x] **O.S. #005** | `[ALTA]` Bug #03: Inconsistência Física e Falta de Reatividade nos Inputs de Tensão ($U_{LL}$ / $U_{LN}$).
- [x] **O.S. #006** | `[ALTA]` Bug #04: Loops de Feedback nos Inputs e Perda de Foco durante a Digitação.
- [x] **O.S. #007** | `[MÉDIA]` Feature: Redesenho do Header e Elevação da Identidade Visual da Norma.
- [x] **O.S. #008** | `[MÉDIA]` Feature: Reestruturação do Seletor de Idiomas para o Header Global.
- [x] **O.S. #009-HOTFIX** | `[CRÍTICA]` Resolução F12: Trava física Anti-Happy Path ($I_b \le I_n$), reatividade e correção de UX/caminhos relativos.
- [x] **O.S. #010** | `[ALTA]` Refinamento de Acessibilidade (A11y): Correção de forms, contrastes CSS e validações nativas.
- [x] **O.S. #011** | `[ALTA]` Depreciação do cálculo em tempo real e fix do State Binding nos seletores (Submissão Intencional).
- [x] **O.S. #012** | `[ALTA]` Feature: Memorial de Cálculo Exportável para Baixa Tensão (BT). (Implementar geração de relatório dinâmico e exportável seguindo os moldes do módulo de curto-circuito).
- [x] **O.S. #013** | `[ALTA]` Feature: Memorial de Cálculo Exportável para Média Tensão (MT). (Replicar a lógica de exportação e geração de relatório dinâmico para os resultados da IEC 60502-2).
- [x] **O.S. #014** | `[CRÍTICA]` Correção de Bugs e Estabilização do Módulo de Média Tensão (MT). (Revisar motor físico e resolver bugs pendentes de dimensionamento identificados durante os testes).
- [x] **O.S. #015** | `[MÉDIA]` Refatoração UI/UX Global: Padronização Visual e Construtiva. (Compatibilizar as premissas de frontend, componentes, cards e paleta de cores para que os módulos de BT, MT e Curto-Circuito tenham a mesma identidade e comportamento).
- [x] **O.S. #016** | `[MÉDIA]` Correção Visual: Padronizar a cor de fundo divergente no componente da Tela Metálica para que herde o estado e a paleta do ecossistema global.
- [x] **O.S. #017** | `[ALTA]` Internacionalização Semântica (i18n): Aplicar tradução profunda mapeando os textos e strings internas geradas pelo motor de UI, não limitando a tradução apenas aos cabeçalhos da casca visual.
- [x] **O.S. #018** | `[MÉDIA]` Feature: Limpeza Visual e Dynamic State Binding. Ocultar o seletor de idiomas duplicado na Sidebar e tornar a badge da norma e do método dinâmicos conforme o módulo ativo (Curto-Circuito vs Cabos).
- [x] **O.S. #019** | `[BAIXA]` Reservado conforme BDD (UX Clean State).
- [x] **O.S. #020** | `[MÉDIA]` Bug #05: Inconsistência de Estado do Idioma. Garantir persistência do estado do idioma ao alternar para o módulo de dimensionamento de cabos. Incluir idioma Espanhol (ES).
- [x] **O.S. #021** | `[BAIXA]` Bug #06: Layout de Impressão (Print Media). Aplicar `@media print` para ocultar o Header Global e a Sidebar de navegação.
- [x] **O.S. #022** | `[ALTA]` Bug #07: Interatividade do Botão do Memorial de MT. Conectar o botão ao Event Delegation global ou reavaliar o workflow do Lucide Icons.
- [x] **O.S. #023** | `[MÉDIA]` Bug #08: Re-renderização do MT no setLanguage e Badge Dinâmico Internacionalizado.
- [x] **O.S. #024** | `[MÉDIA]` Bug #09: Refinamento de Impressão e Subtextos BT. Limpeza da quebra de página de painéis sem classe e i18n de template literals no memorial.
- [x] **O.S. #025** | `[ALTA]` Bug #10: Layout de Impressão Espremido (Grid Columns). Ocultar as colunas vazias de 320px no `@media print` para que o memorial utilize a largura total da folha A4 em Retrato.
- [x] **O.S. #026** | `[BAIXA]` Melhoria UX: Botão de Exportar PDF no MT. Adicionar o botão de impressão nativa ao final do memorial de Média Tensão, igualando a interface da Baixa Tensão.
- [x] **O.S. #027** | `[BAIXA]` Bug #11: Botão do Memorial BT com Idioma Fixo. O botão de exportar o memorial BT está com o texto "Imprimir Memorial Técnico" hardcoded em PT, vazando ao alternar para EN ou ES.

---
### Epic: UI/UX Premium Polish
- [ ] **O.S. #028** | `[MÉDIA]` UX Polish: Redesign dos Cards de KPI (Soft Shadows, Sem Bordas Duras e Destaque Visual no Resultado Principal).
- [ ] **O.S. #029** | `[MÉDIA]` UX Polish: Estilização Premium de Inputs (Gap, Border Radius, Focus Rings e Segmented Controls).
- [ ] **O.S. #030** | `[BAIXA]` UX Polish: Correção do Badge Dinâmico no Header e Estilos de Tabela.