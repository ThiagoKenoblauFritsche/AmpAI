---
tags: [governanca, qa, ci, regressao]
versao: 1.0
status: ratificado
data: 2026-07-04
baseline_decisao: c2565332367abfbbadea7da849fc90fff3fdfffc
---

# Gate Consolidado de Regressão — Decisão Arquitetural

## 1. Propósito

Esta decisão institui a arquitetura permanente de regressão do AmpAI para novas features, correções, refatorações, adequações normativas, mudanças de segurança e evolução de infraestrutura.

O gate reduz regressões conhecidas e acumula proteção sobre comportamentos aprovados. Ele não promete software infalível nem substitui análise científica, revisão humana ou descoberta de cenários ainda desconhecidos. A meta canônica é **rastreabilidade integral dos contratos críticos conhecidos**, e não uma porcentagem isolada de linhas cobertas:

`RNC-C/requisito → BDD → SDD → teste → implementação → evidência CI → veredito QA → aceite CEO`

## 2. Autoridades e separação de poderes

- Governança define esta lei e sua taxonomia.
- CTO decompõe a implantação e cada evolução em O.S. isoladas; não atesta o próprio fluxo.
- QA é a autoridade técnica de classificação, promoção e veredito dos testes; não implementa a correção avaliada.
- GitHub Actions executa o gate reprodutível, mas não substitui o julgamento do QA.
- CodeRabbit permanece revisão complementar de PR.
- CEO é a única autoridade de merge e de alteração da proteção da branch.

Nenhuma IA pode remover, arquivar, reclassificar, enfraquecer ou ignorar um teste aprovado para liberar uma implementação própria.

## 3. Taxonomia canônica dos testes

| Classe | Uso | Integra o required gate? |
| --- | --- | --- |
| `stable` | contrato determinístico, aprovado, promovido e obrigatório | sim |
| `experimental` | RED novo, teste em desenvolvimento ou candidato ainda sem evidência de promoção | não |
| `flaky` | resultado comprovadamente não determinístico; permanece em quarentena com responsável e prazo | não; também não conta como GREEN |
| `archived` | evidência histórica preservada, substituída formalmente ou fora da execução corrente | não |
| `utility` | ferramenta auxiliar sem asserção de contrato | não |

O gate consome somente entradas explícitas do manifesto. É proibido descobrir testes obrigatórios por glob como `tests/*.js`.

## 4. Inventário ratificado na baseline

### 4.1 Suíte `stable` inicial

| Teste | Suíte | Contrato resumido |
| --- | --- | --- |
| `tests/core_curto_circuito.test.js` | core | 39 casos IEC 60909 e ZOMBIES; protocolo legado temporário |
| `tests/test_os047.js` | core | 8 contratos de envelopes, RFC 7807, warnings e pureza BT/MT |
| `tests/test_os040_restart.js` | browser | 9 sinais visuais de resultado |
| `tests/test_os042_restart.js` | browser | responsividade BT/MT em viewport mobile |
| `tests/test_os044_restart.js` | browser | 26 contratos de acessibilidade dinâmica |

O adaptador temporário de `core_curto_circuito.test.js` deve exigir exatamente 39 verdes, zero vermelhos, total 39 e `exit code` zero. Uma futura O.S. poderá migrá-lo para protocolo JSON sem reduzir cobertura.

### 4.2 Candidatos `experimental` pós-O.S. 050

| Teste | Contrato | Destino pretendido |
| --- | --- | --- |
| `tests/test_os049.js` | orquestração e apresentação de envelopes success/warning/error em PT/EN/ES; 14 relatórios | `stable` após promoção formal |
| `tests/test_os049_e2e.js` | cálculo real BT/MT do formulário ao resultado renderizado; 2 relatórios | `stable` após promoção formal |

Nos dois candidatos, `navigationErrors=[]` é requisito bloqueante. Enquanto não completarem repetibilidade e execução pós-merge, permanecem experimentais mesmo estando funcionalmente GREEN.

## 5. Ciclo de vida de um teste novo

1. QA cria o teste como `experimental` e demonstra RED pelo motivo esperado.
2. A Fábrica implementa o GREEN sem alterar o contrato do teste.
3. QA valida o teste novo e as regressões relacionadas.
4. PR A integra teste experimental e implementação, protegido pela suíte `stable` vigente.
5. Após o merge, o candidato executa em modo de observação sobre `main`.
6. QA reúne a evidência de promoção.
7. PR B altera somente a classificação e o registro de promoção.
8. Após o merge da PR B, o teste passa a integrar todos os gates futuros.

### Critérios mínimos de promoção

- arquivo versionado e vinculado à O.S./BDD/SDD;
- asserção principal comprovadamente exercida;
- quantidade e formato de relatórios explícitos;
- `exit code` confiável, sem converter falha em warning;
- isolamento de portas, perfis, arquivos e estado;
- preflight de infraestrutura separado do resultado funcional;
- três execuções consecutivas e independentes no mesmo commit;
- uma execução pós-merge na branch-alvo;
- artifacts publicados e íntegros;
- zero rerun automático;
- nenhuma pendência de falso-GREEN.

Três execuções são necessárias para testes browser de risco, mas não bastam sem os demais controles.

## 6. Arquitetura conceitual aprovada

A implementação deverá possuir, em caminhos finais definidos pelas O.S. do CTO:

- manifesto JSON declarativo, conceitualmente `qa/test-manifest.json`;
- JSON Schema, conceitualmente `qa/test-manifest.schema.json`;
- registros de promoção, conceitualmente `qa/promotions/`;
- executor Node único, sem comandos shell arbitrários no manifesto;
- workflow de regressão para PR e pós-merge;
- job agregador com required check estável chamado `regression-gate`.

Comandos canônicos pretendidos:

```text
npm run test:core
npm run test:browser
npm run test:regression
```

Os scripts npm serão aliases finos para o mesmo executor; lógica de classificação não deve ser duplicada no `package.json` ou no YAML.

### Jobs mínimos

1. `manifest-validation`: valida schema, semântica, arquivos, IDs e contratos.
2. `core`: executa os testes core estáveis sequencialmente.
3. `browser`: matriz paralela, um teste por runner isolado, com `fail-fast: false`.
4. `regression-gate`: executa com `always()`, baixa todas as evidências, verifica completude, publica o consolidado e retorna sucesso somente quando tudo for `PASS`.

O paralelismo browser é permitido entre jobs isolados. Não há autorização genérica para abrir vários navegadores no mesmo runner ou processo.

## 7. Eventos e proteção de branch

O gate consolidado deve executar:

- em todo `pull_request` destinado a `main`, inclusive documental na v1;
- em `push` para `main`, para validar o commit efetivamente integrado;
- manualmente, quando autorizado, para diagnóstico e promoção.

Na v1 não haverá exceção por caminhos. Essa política poderá ser reavaliada após 30 execuções completas, desde que o status agregado continue sempre emitido.

O required check `regression-gate` só poderá ser ativado depois de:

1. manifesto, schema e executor validados;
2. três execuções equivalentes no mesmo commit;
3. pelo menos um PR completo;
4. uma execução pós-merge em `main`;
5. comparação com os workflows anteriores;
6. veredito favorável do QA;
7. autorização explícita do CEO.

## 8. Taxonomia de resultados

| Resultado | Definição | Efeito |
| --- | --- | --- |
| `PASS` | configuração, dependências e preflight aprovados; contrato exercido; relatórios completos; conformidade e `exit code` zero | elegível para veredito QA |
| `FUNCTIONAL_FAILURE` | ambiente funcional e contrato exercido, mas uma ou mais asserções não conformes | bloqueia; RED funcional |
| `INFRA_BLOCKED` | dependência, Chromium, sandbox, runner, servidor ou bootstrap falhou antes do contrato | bloqueia; não é RED/GREEN funcional |
| `CONFIG_ERROR` | manifesto/comando inválido, teste ausente, relatório incompleto ou zero sem prova da asserção | bloqueia; nunca é PASS |

Precedência: `CONFIG_ERROR → INFRA_BLOCKED → FUNCTIONAL_FAILURE → PASS`.

O `exit code` bruto é evidência, não classificador suficiente. O executor deve registrar estágios explícitos, incluindo configuração validada, dependências prontas, preflight aprovado, teste iniciado, asserção exercida e relatórios validados.

## 9. Evidência e artifacts

Cada execução deve registrar:

- commit SHA, branch, PR e estado limpo/sujo;
- SO, runner, Node, npm, Puppeteer e Chromium;
- hash do lockfile;
- manifesto e lista ordenada dos testes;
- comando, diretório, início, término e duração;
- preflight e `exit code` separados;
- stdout e stderr completos;
- relatórios esperados e observados;
- classificação por teste e consolidada;
- artifacts secundários com hash e vínculo ao cenário.

Artifacts individuais terão retenção inicial de 30 dias. O artifact consolidado terá retenção de 90 dias. Falhas após `push` em `main` abrem incidente, congelam novos merges e retornam ao QA/CTO; correção ou reversão depende do CEO.

## 10. Limites operacionais iniciais

- core: até 60 segundos por teste;
- browser: até 120 segundos por teste, excluída a instalação controlada de dependências;
- workflow consolidado: teto inicial de 10 minutos;
- execução esperada da suíte inicial: aproximadamente 2–4 minutos com browser paralelo.

Timeout anterior ao exercício do contrato é normalmente `INFRA_BLOCKED`; somente evidência funcional completa pode convertê-lo em `FUNCTIONAL_FAILURE`.

## 11. Arquivamento, substituição e remoção

Um teste aprovado só pode sair do gate com:

1. justificativa técnica;
2. parecer independente do QA;
3. vínculo à O.S. e ao contrato;
4. substituto explícito, quando aplicável;
5. equivalência de cobertura demonstrada ou retirada formal do requisito;
6. PR normal e autorização de merge do CEO.

Arquivamento retira o teste do manifesto executável, mas preserva arquivo, decisão, data, substituto e evidência RED→GREEN. Remoção física exige política de retenção específica e nunca pode ser automática.

## 12. Migração dos workflows existentes

- `qa-visual.yml` permanece temporariamente como diagnóstico manual e deverá futuramente aceitar IDs do manifesto, não caminhos arbitrários.
- `qa-os040r.yml` permanece durante a comparação de evidências.
- O novo gate nasce em modo informativo, paralelo aos workflows atuais.
- O workflow dedicado só poderá ser aposentado após três execuções equivalentes, um PR, uma execução pós-merge e aceite do QA.
- Históricos e artifacts anteriores não serão apagados para simular uma migração limpa.

## 13. Estado da decisão

Esta arquitetura está ratificada. A infraestrutura executável ainda não está implementada. Cabe ao CTO decompor manifesto, schema, executor, CI em shadow mode, validação, promoção e ativação do required check em O.S. específicas.

