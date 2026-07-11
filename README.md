# ⚡ AmpAI — Motor de Engenharia Elétrica

SaaS de missão crítica para cálculos e memoriais de engenharia elétrica de baixa e média tensão, fundamentado em normas IEC.

## Arquitetura de engenharia

- **BDD:** o @Engenheiro_Eletricista especifica comportamento, premissas e limites físicos em `docs/features/`, consumindo RNC-P/RNC-C em Markdown e emitindo prova de cálculo contestável. RNC-P é fonte processada de consulta; RNC-C é base canônica curada para BDD/SDD/QA.
- **SDD:** o @CTO define contratos e Problem Details (RFC 7807) em `docs/api/`.
- **DDD:** o @Senior_Backend_Dev implementa somente motores matemáticos puros em `js/core_*.js`, retornando Result Pattern e sem DOM.
- **UI:** o @Senior_Frontend_Dev concentra DOM e Tailwind em `index.html` e `js/ui_render.js`.
- **TDD/CI:** o @Senior_QA_Security usa Codex em terminal isolado para produzir e executar ZOMBIES, registrar RED → GREEN e atestar o `exit code`. Quando a entrega exige navegador real ou reprodutibilidade externa, GitHub Actions é o braço de CI do Tribunal e deve publicar artifact de evidência.
- **Regressão cumulativa:** a arquitetura ratificada separa testes `stable`, `experimental`, `flaky`, `archived` e `utility`. Quando ativado após shadow mode, `regression-gate` executará toda a suíte stable em cada PR para `main`.

## Matriz operacional v7.1

| Camada | Papel | Ambiente |
| --- | --- | --- |
| Memória | NotebookLM, RAG e estratégia | Google NotebookLM / `sync.ps1` |
| Conselho independente | @Conselho_de_Arquitetura_e_Governanca | ChatGPT Plus (GPT-5.5) |
| Executivo | @CTO e @Negocios_e_Estrategia | ChatGPT Plus (GPT-5.5 / GPT-5.4) |
| Ciência | @Engenheiro_Eletricista | Claude Opus 4.8 (Extended Thinking) |
| Fábrica | @Senior_Backend_Dev, @Senior_Frontend_Dev e @Engenheiro_Plataforma_CI | Claude Code Pro (Opus 4.8 / Sonnet 4.6) |
| Tribunal | @Senior_QA_Security | Codex CLI/API (GPT-5.5) |

Cada persona opera em chat/thread isolado. Toda decisão, alteração, auditoria ou incidente passa pelo CTO, que registra, classifica de `CHG-0` a `CHG-3`, roteia e encerra. O Conselho mantém as leis; QA mantém o veredito; o CEO concentra estratégia, produto, prioridade e merge.

## Gate de regressão para `main`

A arquitetura permanente de entrega é:

`branch de trabalho → Pull Request → regression-gate → artifact consolidado → CodeRabbit complementar → validação QA/CEO → merge humano`

O novo gate ainda passará por implantação e shadow mode; até sua ativação, os workflows vigentes permanecem oficiais. Testes novos começam como experimentais e só protegem PRs futuros depois da promoção formal. A decisão completa está em `docs/AmpAI_Gate_Regressao.md`.

O CI é evidência de Tribunal, não CD. Deploy automático para staging e produção permanece fora do fluxo ativo até a consolidação de PR, artifacts e revisão independente.

## Mudanças proporcionais

O AmpAI usa quatro classes: `CHG-0 Expressa`, `CHG-1 Adaptativa`, `CHG-2 Padrão` e `CHG-3 Crítica`. Tudo passa pela Torre de Controle do CTO, mas somente mudanças comportamentais ou críticas percorrem RED→GREEN completo. Código executável preserva a suíte `stable`; documentação editorial recebe checks documentais. Política em `docs/AmpAI_Classificacao_Mudancas.md` e estado em `docs/AmpAI_Registro_Mudancas.md`.

### Gate local de regressão

A suíte obrigatória é definida explicitamente em `qa/test-manifest.json`.

```bash
npm run test:core
npm run test:browser
npm run test:regression
```

Somente testes classificados como `stable` integram esses comandos. Testes experimentais exigem promoção formal antes de bloquear PR.

O workflow `.github/workflows/regression-gate-shadow.yml` executa este mesmo gate no GitHub Actions em **shadow mode**: é informativo, **ainda não é required check** e não altera a proteção de `main`. Pode ficar vermelho — isso é evidência válida. Os workflows atuais (`qa-visual.yml`, `qa-os040r.yml`) permanecem oficiais até a promoção formal. Contrato em `docs/api/INF028_CI_Shadow_SDD.md`.

## Docs as Code

As fontes canônicas vivem em `docs/`. O `sync.ps1` as transforma para consulta no Google Drive/NotebookLM. A documentação e a evidência de teste fazem parte da entrega, não são pós-processamento opcional.

## Registro Normativo Computável

O AmpAI usa dois níveis de RNC:

- **RNC-P (Processado):** Markdown extraído, limpo ou convertido de normas, guias e livros técnicos. Pode ser usado como fonte de consulta, sempre com identificação da origem.
- **RNC-C (Canônico):** documento curado pelo AmpAI, com escopo, fonte, equações revisadas, unidades SI, premissas, limites físicos, rastreabilidade e regras de QA. Pode ser usado como base direta para BDD, SDD, testes e implementação.

Um `.md` dentro de `docs/normas/` não é automaticamente canônico. Se houver conflito, norma primária e RNC-C prevalecem sobre guia secundário ou RNC-P.

Definição completa: `docs/AmpAI_RNC_Taxonomia.md`.

## Evolução de infraestrutura

O fluxo atual usa ambientes locais, terminais isolados e GitHub Actions para CI reprodutível quando necessário. A execução do Tribunal em VPS com sandbox/Firecracker é uma expansão planejada; não deve ser tratada como infraestrutura já disponível. CodeRabbit pode revisar PRs de modo complementar, mas não substitui QA/Codex nem a aprovação humana. CD para staging e CD para produção são fases futuras e separadas.

As cadeiras `@Engenheiro_DevOps_SRE`, `@Senior_Backend_SaaS` e `@Arquiteto_Seguranca_Privacidade` estão planejadas, mas inativas. Elas só poderão receber O.S. após ratificação própria nas fases de staging, BaaS/Auth e tratamento de dados pessoais/pagamentos, respectivamente.
