---
tags:
  - gestao/backlog
  - ampai/business
versao: 5
status: em-andamento
---

## 📈 Backlog de Feedbacks e O.S. Comerciais

- [x] **O.S. #001** | `[MÉDIA]` Mitigação de infinito térmico e tratamento de divisões por zero com guardas lógicas no módulo de cabos BT.
- [ ] **O.S. #002** | `[BAIXA]` Implementação de Tooltips informativos em Tailwind CSS para os Métodos de Instalação IEC.
- [x] **O.S. #003** | `[CRÍTICA]` Bug #01: Desconexão de dados e lógica de convergência no Módulo de Média Tensão (MT).
	- *Cenário:* Os KPIs superiores calculam curto-circuito de tela (35mm²), mas as abas inferiores e o memorial congelam exibindo lógica antiga de BT (S1=95mm²).
	- *Ação Futura:* Refatorar o motor de renderização reativa em `js/ui_render.js` para ler e integrar os outputs matemáticos gerados pelo módulo isolado `js/core_cabos_mt.js`.
- [x] **O.S. #004** | `[ALTA]` Bug #02: Badge Normativo do Header Estático/Hardcoded na Interface SPA.
- [x] **O.S. #005** | `[ALTA]` Bug #03: Inconsistência Física e Falta de Reatividade nos Inputs de Tensão ($U_{LL}$ / $U_{LN}$).
- [ ] **O.S. #006** | `[ALTA]` Bug #04: Loops de Feedback nos Inputs e Perda de Foco durante a Digitação.
- [ ] **O.S. #007** | `[MÉDIA]` Feature: Redesenho do Header e Elevação da Identidade Visual da Norma.
- [ ] **O.S. #008** | `[MÉDIA]` Feature: Reestruturação do Seletor de Idiomas para o Header Global.
- [x] **O.S. #009-HOTFIX** | `[CRÍTICA]` Resolução F12: Trava física Anti-Happy Path ($I_b \le I_n$), reatividade e correção de UX/caminhos relativos.
- [x] **O.S. #010** | `[ALTA]` Refinamento de Acessibilidade (A11y): Correção de forms, contrastes CSS e validações nativas.
- [x] **O.S. #011** | `[ALTA]` Depreciação do cálculo em tempo real e fix do State Binding nos seletores (Submissão Intencional).
- [ ] **O.S. #012** | `[ALTA]` Feature: Memorial de Cálculo Exportável para Baixa Tensão (BT). (Implementar geração de relatório dinâmico e exportável seguindo os moldes do módulo de curto-circuito).
- [ ] **O.S. #013** | `[ALTA]` Feature: Memorial de Cálculo Exportável para Média Tensão (MT). (Replicar a lógica de exportação e geração de relatório dinâmico para os resultados da IEC 60502-2).
- [x] **O.S. #014** | `[CRÍTICA]` Correção de Bugs e Estabilização do Módulo de Média Tensão (MT). (Revisar motor físico e resolver bugs pendentes de dimensionamento identificados durante os testes).
- [ ] **O.S. #015** | `[MÉDIA]` Refatoração UI/UX Global: Padronização Visual e Construtiva. (Compatibilizar as premissas de frontend, componentes, cards e paleta de cores para que os módulos de BT, MT e Curto-Circuito tenham a mesma identidade e comportamento).
- [ ] **O.S. #016** | `[MÉDIA]` Correção Visual: Padronizar a cor de fundo divergente no componente da Tela Metálica para que herde o estado e a paleta do ecossistema global.
- [ ] **O.S. #017** | `[ALTA]` Internacionalização Semântica (i18n): Aplicar tradução profunda mapeando os textos e strings internas geradas pelo motor de UI, não limitando a tradução apenas aos cabeçalhos da casca visual.