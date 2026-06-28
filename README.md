# ⚡ AmpAI — Motor de Engenharia Elétrica

SaaS de missão crítica para cálculos e memoriais de engenharia elétrica de baixa e média tensão, fundamentado em normas IEC.

## Arquitetura de engenharia

- **BDD:** o @Engenheiro_Eletricista especifica comportamento, premissas e limites físicos em `docs/features/`, consumindo RNC-P/RNC-C em Markdown e emitindo prova de cálculo contestável. RNC-P é fonte processada de consulta; RNC-C é base canônica curada para BDD/SDD/QA.
- **SDD:** o @CTO define contratos e Problem Details (RFC 7807) em `docs/api/`.
- **DDD:** o @Senior_Backend_Dev implementa somente motores matemáticos puros em `js/core_*.js`, retornando Result Pattern e sem DOM.
- **UI:** o @Senior_Frontend_Dev concentra DOM e Tailwind em `index.html` e `js/ui_render.js`.
- **TDD/CI:** o @Senior_QA_Security usa Codex em terminal isolado para produzir e executar ZOMBIES, registrar RED → GREEN e atestar o `exit code`. Quando a entrega exige navegador real ou reprodutibilidade externa, GitHub Actions é o braço de CI do Tribunal e deve publicar artifact de evidência.

## Matriz operacional v7.0

| Camada | Papel | Ambiente |
| --- | --- | --- |
| Memória | NotebookLM, RAG e estratégia | Google NotebookLM / `sync.ps1` |
| Legislativo | @Arquiteto_Chefe_e_Governanca | ChatGPT Plus (GPT-5.5) |
| Executivo | @CTO e @Negocios_e_Estrategia | ChatGPT Plus (GPT-5.5 / GPT-5.4) |
| Ciência | @Engenheiro_Eletricista | Claude Opus 4.8 (Extended Thinking) |
| Fábrica | @Senior_Backend_Dev e @Senior_Frontend_Dev | Claude Code Pro (Opus 4.8 / Sonnet 4.6) |
| Tribunal | @Senior_QA_Security | Codex CLI/API (GPT-5.5) |

Cada persona opera em chat/thread isolado. O CTO é o único emissor de Ordens de Serviço; Governança mantém as leis e não sofre a pressão da execução. O CEO é a única autoridade de merge.

## Gate obrigatório da `Refat_Frontend`

Enquanto a refatoração do frontend estiver ativa, a entrega só é elegível para `main` após este fluxo:

`Refat_Frontend → Pull Request → GitHub Actions CI → artifact de evidência → CodeRabbit complementar → validação QA/CEO → merge humano`

O CI atual é evidência de Tribunal, não CD. Deploy automático para staging e produção permanece fora do fluxo ativo até a consolidação de PR, artifacts e revisão independente.

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
