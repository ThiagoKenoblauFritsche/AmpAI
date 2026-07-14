---
tags: [governanca, operacao, cto, ceo, pos-merge, sincronizacao]
versao: 1.2
status: ratificado
data_decisao: 2026-07-13
baseline_decisao: 4caf528407f7bb1dc4572c9e13232527d597a6f3
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
Habitat/modelo: <provedor, ambiente isolado e modelo padrão/escalonado>
Qualificação da cadeira: NÃO APLICÁVEL | PENDENTE | APROVADA <evidência>
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

Para `@Engenheiro_Plataforma_CI` e `@Engenheiro_DevOps_SRE`, o envelope deve indicar projeto/worktree Antigravity exclusivo, Gemini 3.5 Flash padrão ou escalonamento explícito para Gemini 3.1 Pro High, e qualificação read-only/dry-run aprovada antes da primeira mutação. As duas cadeiras não compartilham projeto, thread, worktree ou credenciais. O.S. em andamento mantém executor, habitat e modelo originais até o encerramento.

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
Caminho local, quando aplicável: <caminho absoluto canônico>
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

Ausência dessa declaração bloqueia a recomendação de merge ao CEO. Quando o teste for local, o CTO deve fornecer o caminho absoluto canônico, o comando de inicialização quando necessário e o SHA imutável que o CEO está avaliando. O diretório principal fora da `main` ou com estado sujo nunca é ambiente válido de aceite.

## 5. Encerramento pós-merge

O merge não encerra sozinho uma mudança, mas também não deve ser confundido com a disponibilidade da cópia local do CEO. A mudança percorre dois marcos distintos:

| Marco | Requisitos | Efeito |
| --- | --- | --- |
| `MERGE_VALIDADO` | PR mergeada, merge SHA identificado e Gate/smoke remoto aplicável concluído | prova que a entrega entrou validamente em `origin/main` |
| `ENCERRAMENTO_OPERACIONAL` | `MERGE_VALIDADO` mais raiz local canônica, sincronização, hashes e inventário operacional regularizados | encerra a mudança no Registro Mestre e libera a cópia local para uso do CEO |

A ausência da sincronização local não desfaz o merge, não reabre um RNC-C já integrado e não constitui `FUNCTIONAL_FAILURE`. Ela produz `BLOQUEIO_OPERACIONAL` e impede apenas o `ENCERRAMENTO_OPERACIONAL` e qualquer teste local do CEO sobre uma cópia não comprovada.

### 5.1 Cadeia e raiz local canônicas

A cadeia canônica é:

`GitHub origin/main → AmpAI/ em main limpa → Google Drive/NotebookLM, quando aplicável`

O diretório principal `AmpAI/` é o único checkout local canônico. Ele deve permanecer em `main`, limpo e alinhado a `origin/main` ao final de cada encerramento. Não recebe branch de implementação. Toda O.S. mutável usa `tmp/worktrees/<ID>` ou outro worktree expressamente registrado pelo CTO.

Uma `main` mantida permanentemente em worktree secundário, inclusive `main-sync`, não é arquitetura aceita após a migração v7.3. Worktree temporário pode manipular `main` somente durante operação de recuperação autorizada e deve liberá-la ao final.

### 5.2 Checklist obrigatório

1. confirmar o SHA mergeado em `origin/main`;
2. registrar `MERGE_VALIDADO` após o Gate/smoke remoto aplicável;
3. verificar que o diretório principal `AmpAI/` está limpo e em `main`;
4. atualizar a `main` local exclusivamente por fast-forward;
5. confirmar `HEAD == main == origin/main == <merge SHA esperado>`;
6. auditar worktrees e branches relacionados à mudança;
7. executar o smoke local exigido pela classe, se houver;
8. executar `sync.ps1` somente quando a mudança afetar fontes do NotebookLM;
9. validar hashes dos documentos essenciais sincronizados;
10. registrar baselines, inventário, resultados, pendências e encerramento no Registro Mestre.

SDD ou outra atividade independente pode prosseguir em worktree isolado sobre `origin/main@<SHA>` explícito enquanto houver apenas `BLOQUEIO_OPERACIONAL` local. Isso não autoriza o CEO a testar uma raiz não comprovada nem permite declarar a mudança anterior encerrada operacionalmente.

### 5.3 Taxonomia fail-closed

A rotina deve parar e devolver evidência ao CTO se encontrar working tree suja, branch incorreta, `main` presa em outro worktree, divergência sem fast-forward, conflito, baseline diferente da esperada, conteúdo exclusivo não classificado, falha de rede/Git/sincronização, hash divergente ou Gate obrigatório inconclusivo.

| Resultado | Significado |
| --- | --- |
| `PASS` | todas as precondições e evidências operacionais foram satisfeitas |
| `BLOQUEIO_OPERACIONAL` | cópia local, worktree, sincronização ou evidência operacional não permite encerrar; não é falha funcional |
| `FUNCTIONAL_FAILURE` | reservado ao QA quando comportamento testado viola contrato |
| `INFRA_BLOCKED` / `CONFIG_ERROR` | seguem a taxonomia do Gate quando a falha pertence ao ambiente de teste ou à configuração do executor |

É proibido usar `git reset --hard`, descartar ou incorporar alteração local, resolver conflito automaticamente, alterar worktrees de agentes, remover referência por inferência ou declarar sucesso parcial como sincronização concluída.

### 5.4 Ciclo de vida de worktrees

Todo worktree deve possuir uma das classificações operacionais:

| Estado | Definição |
| --- | --- |
| `ATIVO` | vinculado a O.S., PR, correção ou janela de observação em curso |
| `PRESERVADO_COM_JUSTIFICATIVA` | retido com responsável, motivo e prazo explícitos |
| `ELEGIVEL_PARA_REMOCAO` | limpo, integrado/encerrado e sem conteúdo ou commit exclusivo |
| `BLOQUEADO_POR_CONTEUDO_EXCLUSIVO` | contém arquivo, commit ou evidência ainda não preservado ou decidido |

Regras de retenção:

- worktree limpo e encerrado torna-se elegível imediatamente e deve ser tratado em até 72 horas;
- preservação justificada dura 14 dias, renovável uma vez; prazo superior a 30 dias exige exceção registrada pelo CTO e aprovada pelo CEO;
- conteúdo exclusivo deve ser auditado e encaminhado em até 7 dias;
- worktree de observação permanece `ATIVO` até o encerramento formal da janela;
- worktree não é backup permanente nem fonte canônica.

Elegibilidade não é autorização de exclusão. O DevOps/SRE remove somente itens identificados nominalmente em autorização do CEO, individual ou em lote auditado. `--force`, worktree externo, árvore suja, untracked, commit não integrado ou conteúdo de evidência exigem decisão específica; não entram em autorização rotineira.

### 5.5 Quarentena de conteúdo exclusivo

Arquivo untracked, modificação local ou evidência exclusiva nunca é apagado para liberar uma branch. O DevOps/SRE deve:

1. comparar conteúdo e hash com a fonte canônica;
2. classificar como redundante, divergente, exclusivo, evidência ou possível segredo;
3. copiar o conteúdo que precise ser preservado para `../AmpAI-Quarantine/<data>/<worktree-id>/`, fora do repositório e fora do espelho do NotebookLM;
4. registrar caminho original, data, O.S./responsável, SHA-256 e decisão pendente;
5. confirmar a cópia antes de solicitar qualquer remoção.

Segredo ou credencial não pode ser copiado para o Google Drive nem reproduzido em relatório comum: aciona o protocolo de incidente, rotação e armazenamento restrito.

### 5.6 Estrutura física

```text
AmpAI/                        → checkout local canônico, sempre main limpa
tmp/worktrees/<mudança>/      → branches isoladas e temporárias dos agentes
../AmpAI-Quarantine/          → preservação temporária fora do Git e do Drive
AmpAI - Negócio/              → estudos ainda não canônicos
Google Drive/                 → espelho de consulta do NotebookLM
```

Migrar o estado anterior para essa estrutura exige ação operacional própria. A correção começa por inventário/dry-run e não autoriza apagar, mover ou trocar branches automaticamente.

### 5.7 Rotina preautorizada e automação

Fast-forward seguro de uma raiz limpa e sincronização documental sem transformação são rotina `CHG-0` vinculada à mudança original. Herdam PR e SHA e não criam O.S., commit ou PR recursivos por execução.

Alterar script, hook, tarefa agendada, credencial, caminho, workflow, retenção, quarentena ou regra de remoção é mudança separada, classificada pelo CTO. A automação futura deve iniciar em dry-run, receber o SHA esperado, produzir relatório humano e JSON e falhar fechada. Ela não pode remover worktrees, resolver conflitos, usar força, descartar estado ou modificar documento para registrar o próprio encerramento.

### 5.8 Canonização científica sem PR recursiva

Documento científico ratificado usa `status_cientifico: RATIFICADO` e `vigencia: EFETIVA_QUANDO_INTEGRADO_A_MAIN`. Sua presença na `main` torna a vigência efetiva sem segunda alteração textual. O documento não registra SHA futuro, Gate futuro, ausência temporária de commit/PR nem estado do worktree de produção.

PR, merge SHA, Gate pós-merge, sincronização e encerramento pertencem ao Registro Mestre e ao GitHub. Nova PR científica só é exigida por correção real de fórmula, premissa, escopo, fonte, rastreabilidade ou estado do motor. Documentos históricos já encerrados com `vigencia: CANÔNICO` permanecem válidos e não são reescritos.

A taxonomia completa está em `docs/AmpAI_RNC_Taxonomia.md`.

## 6. Painel executivo mínimo

O CTO deve manter uma visão executiva com:

| Campo | Significado |
| --- | --- |
| baseline canônica | SHA atual da `origin/main` |
| baseline local | SHA do diretório principal `AmpAI/` em `main` |
| marco remoto | pendente ou `MERGE_VALIDADO` |
| marco operacional | pendente, `BLOQUEIO_OPERACIONAL` ou `ENCERRAMENTO_OPERACIONAL` |
| sincronização Drive | não aplicável, pendente, válida ou falhou |
| worktrees | ativos, preservados, elegíveis e bloqueados por conteúdo exclusivo |
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
- `MERGE_VALIDADO` estiver registrado;
- o diretório principal `AmpAI/` estiver em `main`, limpo e alinhado ao SHA remoto;
- o Google Drive estiver sincronizado quando os documentos afetarem o NotebookLM;
- os worktrees da mudança estiverem classificados, sem conteúdo exclusivo ignorado;
- a próxima ação estiver como `nenhuma` ou vinculada a nova mudança registrada.

Exceção formal pode permitir que trabalho independente prossiga em baseline remota explícita, mas não converte bloqueio em sucesso: mantém `BLOQUEIO_OPERACIONAL`, não libera teste local do CEO e não autoriza o estado `encerrada`. Esse estado só é atribuído depois de `ENCERRAMENTO_OPERACIONAL`.
