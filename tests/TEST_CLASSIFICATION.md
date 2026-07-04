# Classificação provisória das suítes de teste

Este arquivo registra a triagem operacional vigente. Ele não substitui o futuro manifesto canônico do gate consolidado.

Decisão arquitetural: `docs/AmpAI_Gate_Regressao.md`.

## Suíte stable ratificada

- `core_curto_circuito.test.js`
- `test_os047.js`
- `test_os040_restart.js`
- `test_os042_restart.js`
- `test_os044_restart.js`

## Evidência histórica ou experimental fora do gate

| Arquivo | Classificação | Motivo |
| --- | --- | --- |
| `test_os040.js` | archived | Evidência histórica substituída por `test_os040_restart.js`. |
| `test_os042.js` | experimental | Preserva contratos adicionais ainda não integralmente substituídos. |
| `test_os044.js` | archived | Evidência histórica substituída por `test_os044_restart.js`. |
| `test_os049.js` | experimental | Contrato de componente relevante e GREEN, mas sem três execuções no mesmo SHA e sem execução pós-merge. Destino pretendido: `stable`. |
| `test_os049_e2e.js` | experimental | E2E real BT/MT relevante e GREEN, mas sem três execuções no mesmo SHA e sem execução pós-merge. Destino pretendido: `stable`. |
| `test_os002.js` a `test_os039.js` | experimental/quarantine | Exigem auditoria do controle de exit code antes de qualquer promoção. |
| `take_screenshots.js` | utility | Utilitário histórico; não é teste de gate. |

Nenhum executor deve usar `tests/*.js` como fonte automática do gate. Somente testes explicitamente classificados como stable em manifesto aprovado poderão bloquear PR.

Para os dois testes pós-O.S. 050, `navigationErrors=[]` é requisito bloqueante de promoção.
