---
tags: [operacao, mudancas, cto, rastreabilidade]
versao: 1.2
status: ativo_apos_integracao
responsavel: "@CTO"
---

# Registro Mestre de Mudanças

## Finalidade

Este registro fornece ao `@CTO` a visão consolidada de toda decisão, alteração, incidente e O.S. do AmpAI. O schema é definido pela Governança; inclusão, atualização de estado e encerramento pertencem ao CTO.

O registro não substitui BDD, SDD, teste, artifact, PR ou histórico Git. Ele aponta para essas evidências.

O Painel de Controle é uma projeção executiva deste registro. Não deve manter estados concorrentes ou divergentes.

## Estados

`intake → classificada → especificacao → RED → implementacao → QA → PR → aceite_ceo → mergeada → MERGE_VALIDADO → pos_merge → ENCERRAMENTO_OPERACIONAL → encerrada`

Estados não aplicáveis à classe podem ser omitidos, desde que a justificativa esteja registrada. `BLOQUEIO_OPERACIONAL` é estado transversal: preserva o `MERGE_VALIDADO`, registra a pendência local e impede `encerrada` até correção.

## Campos obrigatórios

| Campo | Descrição |
| --- | --- |
| ID | identificador único emitido pelo CTO |
| Classe | `CHG-0`, `CHG-1`, `CHG-2` ou `CHG-3` |
| Origem | CEO, Conselho, QA, auditoria, Negócios, agente ou incidente |
| Domínio | docs, governança, ciência, core, UI, QA, CI, segurança, dados ou infraestrutura |
| Objetivo | resultado verificável |
| Responsável | persona destinatária atual |
| Próximo destinatário | persona que receberá o próximo encaminhamento do CTO |
| Estado | estado corrente |
| Teste CEO | `sim`, `não` ou `a_definir_apos_QA` |
| Ação CEO | `nenhuma`, `decisão`, `aceite` ou `merge` |
| Evidência | BDD/SDD, comando, artifact, parecer, PR ou SHA |
| Baseline/sincronização | merge SHA remoto, SHA da raiz `AmpAI/` em `main` e estado do Drive quando aplicável |
| Marco remoto | pendente ou `MERGE_VALIDADO`, com PR, SHA e Gate/smoke aplicável |
| Marco operacional | pendente, `BLOQUEIO_OPERACIONAL` ou `ENCERRAMENTO_OPERACIONAL` |
| Worktrees | contagem/classificação e referência do inventário operacional |
| Pendência | próxima ação ou `nenhuma` |
| Encerramento | data e resultado final |

## Registro inicial da Governança v7.1

A linha histórica abaixo conserva o schema vigente quando foi criada. Novas entradas e atualizações materiais devem usar também os campos adicionados na versão 1.1.

| ID | Classe | Origem | Domínio | Objetivo | Responsável | Estado | Evidência | Pendência | Encerramento |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GOV-TOPOLOGIA-V71` | `CHG-3` institucional | CEO + Conselho | governança/docs | instituir Conselho, Plataforma CI, cadeiras futuras e O.S. proporcionais com intake universal do CTO | @Conselho_de_Arquitetura_e_Governanca | `classificada` | decisão de 2026-07-11; branch `codex/governanca-topologia-v71`; baseline `b104ae3c` | CTO registrar ciência, avaliar impacto e acompanhar PR/merge | pendente |

## Encerramentos sob Governança v7.2

| ID | Classe | Origem | Domínio | Objetivo | Responsável | Próximo destinatário | Estado | Teste CEO | Ação CEO | Evidência | Baseline/sincronização | Pendência | Encerramento |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GOV-ROTEAMENTO-MULTIPROVEDOR-V72` | `CHG-3` institucional | CEO + Conselho | governança/docs/operação | instituir contexto enxuto, roteamento multiprovedor e cadeira `@Engenheiro_DevOps_SRE` sob controle do CTO | `@CTO` | nenhum | `encerrada` | não | merge concluído | PR [#30](https://github.com/ThiagoKenoblauFritsche/AmpAI/pull/30); merge `b30ee49dd14c8e03d8022f79dea4f9dbfde61dcc`; shadow gate pós-merge [#29220731215](https://github.com/ThiagoKenoblauFritsche/AmpAI/actions/runs/29220731215) `SUCCESS`; CodeRabbit da PR `SUCCESS`; `OPS-MAIN-SYNC-001` `PASS` | `origin/main`, `main` local no worktree `tmp/worktrees/main-sync` e `HEAD` alinhados em `b30ee49dd14c8e03d8022f79dea4f9dbfde61dcc`; Google Drive/NotebookLM sincronizado; hashes essenciais `MATCH` | nenhuma; saneamento do diretório principal e dos worktrees permanece fora desta mudança | 2026-07-13 — encerrada com pós-merge, fast-forward local e sincronização documental comprovados |

> A linha v7.2 acima preserva a evidência histórica do mecanismo `main-sync`; não o autoriza como arquitetura permanente após a v7.3. Novos encerramentos devem usar a raiz `AmpAI/` como checkout canônico de `main`.

## Regra contra recursão

A atualização de estado desta tabela, o fast-forward seguro da raiz local e a sincronização documental prevista no encerramento fazem parte da mudança original e não criam nova O.S. Documento científico ratificado com `vigencia: EFETIVA_QUANDO_INTEGRADO_A_MAIN` torna-se canônico pela integração; PR, merge SHA e Gate são registrados aqui sem reabrir o documento científico. Alteração do schema, das classes, das autoridades ou da automação operacional é uma nova mudança classificada pelo CTO; mudança de lei permanece `CHG-3` de Governança.
