---
tags: [operacao, mudancas, cto, rastreabilidade]
versao: 1.1
status: ativo_apos_integracao
responsavel: "@CTO"
---

# Registro Mestre de Mudanças

## Finalidade

Este registro fornece ao `@CTO` a visão consolidada de toda decisão, alteração, incidente e O.S. do AmpAI. O schema é definido pela Governança; inclusão, atualização de estado e encerramento pertencem ao CTO.

O registro não substitui BDD, SDD, teste, artifact, PR ou histórico Git. Ele aponta para essas evidências.

O Painel de Controle é uma projeção executiva deste registro. Não deve manter estados concorrentes ou divergentes.

## Estados

`intake → classificada → especificacao → RED → implementacao → QA → PR → aceite_ceo → mergeada → pos_merge → sincronizacao → encerrada`

Estados não aplicáveis à classe podem ser omitidos, desde que a justificativa esteja registrada.

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
| Baseline/sincronização | SHA remoto, SHA local e estado do Drive quando aplicável |
| Pendência | próxima ação ou `nenhuma` |
| Encerramento | data e resultado final |

## Registro inicial da Governança v7.1

A linha histórica abaixo conserva o schema vigente quando foi criada. Novas entradas e atualizações materiais devem usar também os campos adicionados na versão 1.1.

| ID | Classe | Origem | Domínio | Objetivo | Responsável | Estado | Evidência | Pendência | Encerramento |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GOV-TOPOLOGIA-V71` | `CHG-3` institucional | CEO + Conselho | governança/docs | instituir Conselho, Plataforma CI, cadeiras futuras e O.S. proporcionais com intake universal do CTO | @Conselho_de_Arquitetura_e_Governanca | `classificada` | decisão de 2026-07-11; branch `codex/governanca-topologia-v71`; baseline `b104ae3c` | CTO registrar ciência, avaliar impacto e acompanhar PR/merge | pendente |

## Regra contra recursão

A atualização de estado desta tabela, o fast-forward seguro da `main` local e a sincronização documental prevista no encerramento fazem parte da mudança original e não criam nova O.S. Alteração do schema, das classes, das autoridades ou da automação operacional é uma nova mudança classificada pelo CTO; mudança de lei permanece `CHG-3` de Governança.
