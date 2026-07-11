---
tags: [governanca, operacao, risco, mudancas]
versao: 1.0
status: ratificado
data_decisao: 2026-07-11
baseline_decisao: b104ae3c9f0e8a07e84b8879fa6ea0c8973346c6
autoridade: CEO + @Conselho_de_Arquitetura_e_Governanca
---

# Classificação de Mudanças e O.S. Proporcionais

## 1. Princípio

Toda alteração, decisão, incidente, auditoria ou O.S. passa obrigatoriamente pelo `@CTO`, que atua como Torre de Controle e mantém consciência do estado do projeto. Centralização da informação não significa aplicar a cadeia máxima a toda mudança.

> A intensidade do processo é proporcional ao risco e ao impacto, não à quantidade de linhas alteradas.

Uma linha de fórmula IEC pode ser crítica; uma grande reorganização editorial pode não alterar comportamento. O CTO registra, classifica, roteia e encerra. Ele não executa a Fábrica, não altera leis, não substitui o veredito do QA e não realiza merge.

## 2. Intake universal do CTO

Entradas vindas do CEO, Conselho, Negócios, QA, CodeRabbit, auditorias, Ciência, Fábrica, Plataforma ou incidentes retornam ao CTO antes de qualquer nova ação. O CTO deve produzir:

1. identificador único;
2. origem e objetivo;
3. classe `CHG-0`, `CHG-1`, `CHG-2` ou `CHG-3`;
4. domínio afetado;
5. persona destinatária;
6. arquivos permitidos e proibidos;
7. testes, evidências e artifacts exigidos;
8. condição de retorno e encerramento.

Decisões do Conselho e vereditos do QA não dependem de aprovação técnica do CTO. Eles passam pelo CTO para registro, análise de impacto e decomposição operacional.

## 3. Classes canônicas

| Classe | O.S. | Uso | Controles mínimos |
| --- | --- | --- | --- |
| `CHG-0` | Expressa | mudança não comportamental e reversível | registro CTO, escopo fechado, verificação documental/técnica, PR, CEO |
| `CHG-1` | Adaptativa | mudança executável de baixo risco que preserva contrato | registro CTO, implementador, teste direcionado, regressão stable para código, QA proporcional, PR, CEO |
| `CHG-2` | Padrão | criação ou alteração de comportamento | SDD/critério, QA RED experimental, GREEN da Fábrica, QA independente, regressão, PR, CEO |
| `CHG-3` | Crítica | ciência, segurança, dados, plataforma, infraestrutura ou arquitetura de alto impacto | cadeia completa dos especialistas relevantes, rollback/observação quando aplicável, QA e CEO |

### 3.1 CHG-0 — O.S. Expressa

Exemplos: ortografia, formatação, link, metadado, imagem institucional ou reorganização documental sem alterar lei, contrato, requisito ou comportamento.

Não pode ser `CHG-0` qualquer mudança que altere:

- `js/**`, `tests/**`, `.github/workflows/**`, `qa/**` ou comandos executáveis;
- BDD, SDD, RNC-C, fórmula, limite físico ou regra de QA;
- lei de Governança, responsabilidade ou autoridade;
- autenticação, dados, dependência, segredo, ambiente ou proteção de branch.

O.S. Expressa não exige BDD, novo RED, QA funcional ou regressão da aplicação. Documentação pura recebe verificação de Markdown, links, estrutura e diff.

### 3.2 CHG-1 — O.S. Adaptativa

Exemplos: CSS sem mudança de interação, refatoração coberta, otimização preservando contrato, melhoria de log ou dependência exclusivamente de desenvolvimento após análise de risco.

Não se cria RED artificial quando o comportamento permanece igual e já possui cobertura adequada. Se a cobertura for insuficiente, o QA cria teste de caracterização antes da refatoração. Todo PR com código executável preserva a suíte `stable` completa.

### 3.3 CHG-2 — O.S. Padrão

Exemplos: novo campo, nova validação, correção funcional, mudança de interação, contrato JSON, apresentação de warning/error ou novo comportamento de UI.

Exige teste novo `experimental`, RED pelo motivo esperado, implementação GREEN independente e regressão `stable`. Ciência, Conselho e Plataforma só entram quando o domínio exigir.

### 3.4 CHG-3 — O.S. Crítica

Gatilhos automáticos:

- fórmula IEC, RNC-C, premissa normativa ou limite físico;
- autenticação, autorização, dados pessoais, pagamentos ou segredos;
- banco, migração, API externa ou dependência de produção de alto impacto;
- Gate, workflow, manifesto, executor, artifact ou branch protection;
- VPS, IaC, staging, produção, deploy, backup ou rollback;
- lei de Governança, topologia de agentes ou mudança arquitetural ampla.

`CHG-3` convoca todos os controles relevantes, não todas as personas. CI não chama o Eletricista sem impacto científico; fórmula IEC não chama DevOps sem impacto de ambiente.

## 4. Matriz de testes

| Tipo de mudança | Novo RED | Regressão `stable` | QA independente | Observação/rollback |
| --- | --- | --- | --- | --- |
| documentação editorial pura | não | não aplicável | não funcional | não |
| refatoração coberta | não artificial; caracterização se houver lacuna | sim | proporcional | conforme risco |
| comportamento novo/corrigido | sim | sim | sim | quando aplicável |
| ciência/RNC-C | sim após BDD/SDD | sim | sim | conforme impacto |
| Gate/CI | contrato RED ou `CONFIG_ERROR` esperado | sim e meta-validação | sim | shadow/rollback quando aplicável |
| segurança/dados/infraestrutura | sim ou prova de controle equivalente | sim | sim | obrigatório quando aplicável |

Durante o shadow mode atual, o workflow existente pode executar a suíte completa também em PR documental. Isso é uma característica transitória da implementação, não obrigação metodológica de submeter documentação pura a QA funcional. Qualquer otimização por caminhos exige O.S. própria do CTO para Plataforma CI, validação independente e preservação do agregador `regression-gate`.

## 5. Classificação, elevação e redução

- CTO faz a classificação inicial e registra a justificativa.
- Qualquer participante pode elevar a classe ao encontrar risco adicional.
- O implementador não pode reduzir a classe da própria entrega.
- Redução após objeção do QA exige concordância técnica do QA; redução de tema arquitetural exige o Conselho.
- Dúvida não resolvida usa a classe superior.
- Tamanho do diff nunca é justificativa suficiente para reduzir controle.

## 6. Fluxo de retorno e encerramento

Todo artefato retorna ao CTO. Antes de recomendar PR ao CEO, o CTO consolida:

- classe e domínio;
- arquivos alterados;
- pareceres e vereditos preservados;
- testes, comandos, artifacts e `exit code`;
- riscos, rollback e pendências;
- PR e SHA candidatos.

Após o merge, o resultado e a execução pós-merge retornam ao CTO. A mudança só é encerrada quando o Registro Mestre contiver estado final e evidência suficiente para a classe.

## 7. Fluxo emergencial

Emergência comprime a sequência; não elimina evidência. O CEO declara o incidente, o CTO registra e classifica, o especialista aplica a menor correção, o QA valida o controle crítico e a regressão ocorre antes do merge sempre que tecnicamente possível. Qualquer controle postergado recebe prazo e revisão pós-incidente obrigatória. Produção e rollback continuam sob autoridade humana.

## 8. Invariantes

1. Tudo passa pelo CTO; nem tudo passa pela cadeia máxima.
2. Nenhum trabalho começa sem classe, responsável e escopo.
3. Código executável preserva a suíte `stable` completa.
4. Comportamento novo ou corrigido exige RED antes de GREEN.
5. Refatoração coberta não exige RED artificial.
6. Quem implementa não julga a própria entrega.
7. Conselho mantém leis; QA mantém veredito; CEO mantém merge.
8. Nenhuma IA flexibiliza teste para adequar a mudança à classe escolhida.
