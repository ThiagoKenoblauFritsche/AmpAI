---
tags: [governanca, operacao, cto, ceo, pos-merge, sincronizacao]
versao: 1.1
status: ratificado
data_decisao: 2026-07-13
baseline_decisao: d8dce04f45bb0ed2c82e7bab5877fc056f924c89
autoridade: CEO + @Conselho_de_Arquitetura_e_Governanca
---

# Protocolo Operacional CTO–CEO

## 1. Finalidade

Este protocolo elimina três ambiguidades: qual persona recebe cada O.S.; quando o CEO deve testar o produto; e quando uma mudança mergeada está realmente encerrada e sincronizada.

O `@CTO` continua sendo a Torre de Controle. O CEO define estratégia, produto, prioridade, aceite humano quando aplicável e merge; não precisa escolher agentes, reconstruir rotas entre chats ou acompanhar tarefas técnicas intermediárias.

## 2. Envelope obrigatório de roteamento

Toda O.S. deve declarar no cabeçalho:

```text
O.S.: <identificador>
Classe: CHG-0 | CHG-1 | CHG-2 | CHG-3
Domínio: <domínio>
Responsável executor: <persona>
Consultados: <personas ou nenhum>
Autoridade do veredito: <persona ou não aplicável>
Autoridade de merge: CEO
Baseline obrigatória: <branch@SHA>
Estado atual: <estado>
Próximo destinatário: @CTO
Teste manual do CEO: SIM | NÃO | A DEFINIR APÓS QA
Bloqueia o merge: SIM | NÃO
```

Toda O.S. deve terminar com:

```text
HANDOFF OBRIGATÓRIO:
Ao concluir, devolva o resultado ao @CTO com arquivos, comandos, exit codes,
artifacts, riscos e pendências. Não encaminhe diretamente a outra persona.
O @CTO registrará a evidência e emitirá o próximo encaminhamento.
```

O executor não escolhe o agente seguinte. Parecer do Conselho, veredito do QA, comentário do CodeRabbit, falha de CI e entrega da Fábrica retornam ao CTO antes de nova ação.

## 3. Roteamento por domínio

| Natureza da entrega | Executor ou autoridade principal |
| --- | --- |
| leis, metodologia, topologia e arquitetura institucional | `@Conselho_de_Arquitetura_e_Governanca` |
| registro, classificação, SDD, decomposição e encaminhamento | `@CTO` |
| regras elétricas, RNC-C, BDD e memorial científico | `@Engenheiro_Eletricista` |
| RED, evidência e veredito independente | `@Senior_QA_Security` |
| motores `js/core_*.js` | `@Senior_Backend_Dev` |
| interface e renderização | `@Senior_Frontend_Dev` |
| workflows, manifestos, executores e artifacts de CI | `@Engenheiro_Plataforma_CI` |
| higiene do repositório, ambientes, sincronização operacional, deploy e observabilidade | `@Engenheiro_DevOps_SRE` |
| produto, prioridade, aceite de experiência e merge | CEO |

O `@Engenheiro_DevOps_SRE` opera somente por O.S. do CTO. Sincronização pós-merge estritamente preautorizada pode ser executada como rotina vinculada à mudança original; saneamento, alteração de script, remoção de referência, deploy e automação persistente exigem escopo próprio. Nenhuma autorização inclui resolver conflitos por descarte, sobrescrever estado local, executar `reset --hard` ou fazer merge.

## 4. Aceite manual do CEO

### 4.1 Momento

Quando exigido, o aceite ocorre sobre candidata imutável, depois do QA e dos checks aplicáveis, antes do merge:

`QA GREEN → PR/SHA imutável → CI/artifacts → aceite manual do CEO → merge humano`

Smoke pós-merge ou futuro teste em staging complementa o aceite; não o substitui.

### 4.2 Matriz decisória

| Mudança | Teste manual do CEO |
| --- | --- |
| documentação interna sem impacto de produto | não |
| governança sem impacto visual | não |
| testes, CI, scripts ou refatoração sem mudança observável | normalmente não |
| correção visual focalizada | sim, cenário focalizado |
| mudança de fluxo, interação ou conteúdo percebido pelo usuário | sim |
| nova funcionalidade ou regra de negócio percebida | sim |
| lançamento, mudança crítica ou deploy de produto | sim, aceite formal |
| infraestrutura sem efeito visível | não; evidência técnica substitutiva |

A classe CHG informa a intensidade do processo, mas não decide sozinha o aceite. O critério determinante é a existência de comportamento de produto que demande julgamento humano.

### 4.3 Envelope de aceite

Quando obrigatório, o CTO entrega:

```text
[ACEITE MANUAL DO CEO]
Mudança: <ID>
Classe: <CHG>
Baseline candidata: <SHA>
PR: <URL>
TESTE DO CEO: OBRIGATÓRIO
Bloqueia o merge: SIM
Ambiente: <URL ou comando autorizado>
Cenários: <passos objetivos>
Resultado esperado: <resultado observável>
Fora do escopo manual: <itens já julgados pelo QA>
Resposta esperada: APROVADO | REPROVADO + observação
```

Quando não necessário:

```text
TESTE DO CEO: NÃO NECESSÁRIO
Motivo: <justificativa objetiva>
Evidência substitutiva: <QA/CI/diff/verificação>
Ação do CEO: decidir sobre o merge
```

Ausência dessa declaração bloqueia a recomendação de merge ao CEO.

## 5. Encerramento pós-merge

O merge não encerra sozinho uma mudança. A cadeia canônica é:

`GitHub origin/main → main local limpa → espelho Google Drive/NotebookLM, quando aplicável`

### 5.1 Checklist obrigatório

1. confirmar o SHA mergeado em `origin/main`;
2. verificar que a pasta local designada para `main` está limpa;
3. atualizar a `main` local exclusivamente por fast-forward;
4. confirmar `HEAD == origin/main`;
5. executar o smoke/gate pós-merge exigido pela classe;
6. executar `sync.ps1` quando a mudança afetar fontes do NotebookLM;
7. validar hashes dos documentos essenciais sincronizados;
8. registrar baseline, resultados, pendências e encerramento no Registro Mestre.

### 5.2 Fail-closed

A rotina deve parar e devolver evidência ao CTO se encontrar working tree suja, branch incorreta, divergência sem fast-forward, conflito, falha de rede/Git/sincronização, hash divergente ou gate obrigatório inconclusivo.

É proibido usar `git reset --hard`, descartar ou incorporar alteração local, resolver conflito automaticamente, alterar worktrees de agentes ou declarar sucesso parcial como sincronização concluída.

Worktree ou branch encerrada só pode ser removida individualmente depois de inventário, comprovação de estado limpo, identificação do SHA/PR, confirmação de merge ou decisão formal de abandono e ausência de trabalho exclusivo. A existência do commit no histórico não autoriza apagar uma working tree suja.

### 5.3 Estrutura local recomendada

```text
AmpAI/                        → espelho local limpo da main
tmp/worktrees/<mudança>/      → branches isoladas dos agentes
AmpAI - Negócio/              → estudos ainda não canônicos
Google Drive/                 → espelho de consulta do NotebookLM
```

O diretório principal `AmpAI/` não deve ser usado como branch de implementação. Migrar o estado atual para essa estrutura exige ação operacional própria, sem apagar ou mover worktrees automaticamente.

### 5.4 Rotina preautorizada

O sincronismo seguro, quando não altera conteúdo e satisfaz todas as precondições, é rotina `CHG-0` vinculada ao encerramento da mudança original. Herda o PR e o SHA da mudança encerrada; não exige O.S., registro ou PR próprios por execução.

Alterar script de sincronização, hook, tarefa agendada, credencial, caminho, workflow ou política de retenção é mudança separada, classificada pelo CTO antes da execução.

## 6. Painel executivo mínimo

O CTO deve manter uma visão executiva com:

| Campo | Significado |
| --- | --- |
| baseline canônica | SHA atual da `origin/main` |
| baseline local | SHA da `main` local designada |
| sincronização Drive | não aplicável, pendente, válida ou falhou |
| mudança/O.S. | identificador |
| estado | etapa corrente |
| responsável atual | quem possui a próxima ação |
| próximo destinatário | sempre definido pelo CTO |
| bloqueio | condição objetiva ou nenhum |
| teste do CEO | sim, não ou a definir após QA |
| ação do CEO | nenhuma, decisão, aceite ou merge |
| PR/artifact | evidência navegável |

O painel é projeção executiva do Registro Mestre, não uma segunda fonte de verdade.

## 7. Condição formal de encerramento

Uma mudança só recebe estado `encerrada` quando:

- o resultado técnico previsto para sua classe estiver registrado;
- o veredito independente aplicável estiver preservado;
- o CEO tiver realizado o aceite quando obrigatório;
- o merge humano estiver identificado por PR e SHA;
- a validação pós-merge aplicável estiver concluída;
- a `main` local designada estiver sincronizada ou houver exceção formal;
- o Google Drive estiver sincronizado quando os documentos afetarem o NotebookLM;
- a próxima ação estiver como `nenhuma` ou vinculada a nova mudança registrada.
