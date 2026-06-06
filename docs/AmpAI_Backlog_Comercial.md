---
tags:
  - gestao/backlog
  - ampai/business
versao: 4.2
status: em-andamento
---

## 📈 Backlog de Feedbacks e O.S. Comerciais

- [x] **O.S. #001** | `[MÉDIA]` Mitigação de infinito térmico e tratamento de divisões por zero com guardas lógicas no módulo de cabos BT.
- [ ] **O.S. #002** | `[BAIXA]` Implementação de Tooltips informativos em Tailwind CSS para os Métodos de Instalação IEC.
- [ ] **O.S. #003** | `[CRÍTICA]` Bug #01: Desconexão de dados e lógica de convergência no Módulo de Média Tensão (MT).
	- *Cenário:* Os KPIs superiores calculam curto-circuito de tela (35mm²), mas as abas inferiores e o memorial congelam exibindo lógica antiga de BT (S1=95mm²).
	- *Ação Futura:* Refatorar o motor de renderização reativa em `js/ui_render.js` para ler e integrar os outputs matemáticos gerados pelo módulo isolado `js/core_cabos_mt.js`.
- [ ] **O.S. #004** | `[ALTA]` Bug #02: Badge Normativo do Header Estático/Hardcoded na Interface SPA.
- [ ] **O.S. #005** | `[ALTA]` Bug #03: Inconsistência Física e Falta de Reatividade nos Inputs de Tensão ($U_{LL}$ / $U_{LN}$).
- [ ] **O.S. #006** | `[ALTA]` Bug #04: Loops de Feedback nos Inputs e Perda de Foco durante a Digitação.
- [ ] **O.S. #007** | `[MÉDIA]` Feature: Redesenho do Header e Elevação da Identidade Visual da Norma.
- [ ] **O.S. #008** | `[MÉDIA]` Feature: Reestruturação do Seletor de Idiomas para o Header Global.
- [x] **O.S. #009** | `[CRÍTICA]` Recuperação do Módulo de Baixa Tensão (BT) com TDD. (Cálculo reconstruído do zero, isolado em js/core_cabos_bt.js e aprovado com matriz de Alumínio e trava de desigualdade In < Ib).
- [x] **O.S. #010 a #014** | `[ALTA]` Retrofit TDD e Refinamento Físico de MT/BT. (Motores blindados com runMathTests e runUITests. Módulo MT expandido para abranger matrizes dielétricas de 13.8kV, 24kV e 34.5kV).