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

## Encerramento e intakes sob Governança v7.3

| ID | Classe | Origem | Domínio | Objetivo | Responsável | Próximo destinatário | Estado | Teste CEO | Ação CEO | Evidência | Baseline/sincronização | Pendência | Encerramento |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GOV-ENCERRAMENTO-CANONICO-V73` | `CHG-3` institucional/operacional | CEO + Conselho + CTO | governança/docs/operação | separar `MERGE_VALIDADO` de `ENCERRAMENTO_OPERACIONAL`, tornar `AmpAI/` a raiz local canônica e eliminar canonização científica recursiva | `@CTO` | nenhum | `encerrada` | não | merge e autorizações concluídos | PR [#35](https://github.com/ThiagoKenoblauFritsche/AmpAI/pull/35); merge `7d8af92e7978e963edebd2c04e305a2e6cac910a`; Gate pós-merge [#29299322595](https://github.com/ThiagoKenoblauFritsche/AmpAI/actions/runs/29299322595) `SUCCESS`; `GOV-ENCERRAMENTO-CANONICO-V73-OPS-02` `PASS`; manifesto externo da quarentena SHA-256 `EF622E39DC08D19418B43326AFAAC658127D91E92576D82278E42BDD732EC988` | `HEAD == main == origin/main == 7d8af92e7978e963edebd2c04e305a2e6cac910a`; raiz limpa; Drive `18/18 MATCH`; `main-sync` removido; três documentos M22 antigos preservados; 36 worktrees remanescentes preservados | nenhuma nesta mudança; limpeza dos worktrees e `GOV-AUTOPROCEED-001` seguem como intakes independentes; CTO liberado exclusivamente para o SDD M22 | 2026-07-13 — `MERGE_VALIDADO` e `ENCERRAMENTO_OPERACIONAL` aprovados |
| `GOV-AUTOPROCEED-001` | `CHG-3` institucional/segurança/plataforma | auditoria CTO da OPS-02 | governança/segurança/CI/operação | impedir que aprovação automática de artifact ultrapasse hold explícito ou autorização formal de mutação | `@CTO` | `@Conselho_de_Arquitetura_e_Governanca` | `intake` | não | decisão futura | achado operacional transferido da `GOV-ENCERRAMENTO-CANONICO-V73-OPS-02`; requisitos mínimos: autorização formal do CTO antes de mutações `CHG-2`/`CHG-3`, manifesto externo para hashes, proibição de autorreferência de hash e declaração explícita do domínio de bytes/normalização | baseline de origem `7d8af92e7978e963edebd2c04e305a2e6cac910a`; nenhuma alteração de Gate ou automação autorizada | CTO consolidar evidência e devolver consulta institucional; implementação permanece bloqueada | pendente |
| `OPS-WORKTREE-CLEANUP-V73` | `CHG-3` operacional | auditoria CTO da OPS-02 | infraestrutura/repositório | classificar e tratar os 36 worktrees preservados sem perda de conteúdo exclusivo | `@CTO` | `@Engenheiro_DevOps_SRE` após autorização do CEO | `intake` | não | decisão futura | OPS-02 confirmou preservação dos 36 worktrees e ausência de perda identificada; nenhuma elegibilidade implica autorização automática | raiz canônica `main@7d8af92e7978e963edebd2c04e305a2e6cac910a`; Drive sincronizado | inventário nominal, classificação, allowlist e autorização do CEO antes de qualquer remoção; `--force` proibido sem decisão específica | pendente |

### Evidência externa da OPS-02

A quarentena permanece fora do Git e do Google Drive em `C:/Users/ACER/Desktop/Programing/Quarentena_AmpAI/GOV-ENCERRAMENTO-CANONICO-V73-OPS-02/`. O hash do `manifest.json` foi calculado externamente e registrado na linha de encerramento; o manifesto não registra o próprio hash.

| Artefato preservado | SHA-256 da quarentena | SHA-256 canônico UTF-8/LF |
| --- | --- | --- |
| `INC002_M22_BDD.feature` | `D8D1285C710C88E354EC8E6F173B25A73CD3D7159B1A5337BDC9A03AA7B1551B` | `A6D69730C9233BE5F8B95430CAD5DCB90CEF23498D56B91E6FDE8F1C36BBE3A7` |
| `INC002_M22_Memorial.md` | `65ABC893113E07D09D0EBA87D9D48052464245866399F412F8F70A1399C0B191` | `D55963EA3661A1E7D143F943ECAB4A8E007902834682843FB95D2DB54A0A6231` |
| `RNC-C_CANDIDATO_INC002_M22.md` → `RNC-C_INC002_M22.md` | `89F63DCAD95DCF1DA79D99688A61FAAC611046C1BADCC53B5558CD02B8101289` | `A783FB9AB9D4EB20751D53D51040F2B3E54F9F0755C84AEE4F204F821FF09D9E` |

Os hashes canônicos acima correspondem ao blob UTF-8 com finais de linha LF. O checkout Windows usa CRLF e, por isso, possui hash físico diferente sem mudança de conteúdo. Todo manifesto futuro deve declarar o domínio exato do hash para evitar falso `MISMATCH`.

### Liberação transferida do M22

O `@CTO` está liberado para iniciar exclusivamente o SDD técnico do M22 sobre `main@7d8af92e7978e963edebd2c04e305a2e6cac910a`. Esta liberação não autoriza QA RED, Backend, alteração do motor, teste, manifesto ou Gate; essas etapas continuam dependentes do SDD e de O.S. posteriores.

## Regra contra recursão

A atualização de estado desta tabela, o fast-forward seguro da raiz local e a sincronização documental prevista no encerramento fazem parte da mudança original e não criam nova O.S. Documento científico ratificado com `vigencia: EFETIVA_QUANDO_INTEGRADO_A_MAIN` torna-se canônico pela integração; PR, merge SHA e Gate são registrados aqui sem reabrir o documento científico. Uma PR `CHG-0` que apenas materialize este registro não recebe nova atualização para registrar o próprio merge: sua presença em `main` e o histórico Git comprovam a integração. Alteração do schema, das classes, das autoridades ou da automação operacional é uma nova mudança classificada pelo CTO; mudança de lei permanece `CHG-3` de Governança.
