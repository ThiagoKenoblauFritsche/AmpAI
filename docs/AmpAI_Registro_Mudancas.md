---
tags: [operacao, mudancas, cto, rastreabilidade]
versao: 1.0
status: ativo_apos_integracao
responsavel: "@CTO"
---

# Registro Mestre de Mudanças

## Finalidade

Este registro fornece ao `@CTO` a visão consolidada de toda decisão, alteração, incidente e O.S. do AmpAI. O schema é definido pela Governança; inclusão, atualização de estado e encerramento pertencem ao CTO.

O registro não substitui BDD, SDD, teste, artifact, PR ou histórico Git. Ele aponta para essas evidências.

## Estados

`intake → classificada → especificacao → RED → implementacao → QA → PR → mergeada → pos_merge → encerrada`

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
| Estado | estado corrente |
| Evidência | BDD/SDD, comando, artifact, parecer, PR ou SHA |
| Pendência | próxima ação ou `nenhuma` |
| Encerramento | data e resultado final |

## Registro inicial da Governança v7.1

| ID | Classe | Origem | Domínio | Objetivo | Responsável | Estado | Evidência | Pendência | Encerramento |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GOV-TOPOLOGIA-V71` | `CHG-3` institucional | CEO + Conselho | governança/docs | instituir Conselho, Plataforma CI, cadeiras futuras e O.S. proporcionais com intake universal do CTO | @Conselho_de_Arquitetura_e_Governanca | `classificada` | decisão de 2026-07-11; branch `codex/governanca-topologia-v71`; baseline `b104ae3c` | CTO registrar ciência, avaliar impacto e acompanhar PR/merge | pendente |

## Regra contra recursão

A atualização de estado desta tabela faz parte do encerramento da mudança original e não cria uma nova O.S. Alteração do schema, das classes ou das autoridades é uma nova mudança `CHG-3` de Governança.
