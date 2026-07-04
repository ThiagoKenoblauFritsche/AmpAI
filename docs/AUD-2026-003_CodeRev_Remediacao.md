---
tags:
  - auditoria/qualidade
  - seguranca
  - governanca
status: em-execucao
data: 2026-07-03
origem: CodeRev
baseline: 6.4/10
---

# AUD-2026-003 — Avaliação e Plano de Remediação CodeRev

## 1. Decisão executiva

A nota global de **6,4/10** é coerente como indicador de triagem, mas os achados não devem ser executados mecanicamente. Os dois alertas críticos foram confirmados. Parte dos alertas moderados mistura riscos reais, dívida arquitetural, evidências TDD deliberadamente preservadas e falsos positivos de análise estática.

Meta para a próxima auditoria: **nota global mínima de 8,5**, sem reduzir rastreabilidade, apagar evidência de QA ou configurar exclusões apenas para elevar a pontuação.

## 2. Contenção crítica executada em 2026-07-03

| Controle | Estado | Evidência |
|---|---|---|
| Remover PAT e senha do documento rastreado | Concluído no working tree | `docs/AmpAI_VPS_Cloud_Factory.md` agora referencia o cofre de segredos |
| Remover o runner do diretório do projeto | Concluído | movido para `C:\Users\ACER\actions-runner-AmpAI`; nenhum processo, serviço ou tarefa agendada estava ativo |
| Impedir versionamento de artefatos sensíveis locais | Concluído | `.gitignore` cobre `actions-runner/`, `.coderev/`, `.coderev-trash/`, `.vs/` e `tmp/` |
| Eliminar a cópia do relatório que repetia os segredos | Concluído | `.coderev/report.md` removido; o resultado estruturado mascarado permanece local |
| Revogar o GitHub PAT exposto | **Ação externa pendente** | revogação deve ocorrer em `github.com/settings/tokens` pelo titular da conta |
| Rotacionar a senha inicial da VPS | **Ação externa pendente** | alterar no provedor/servidor e armazenar apenas no cofre aprovado |
| Expurgar os segredos do histórico Git | **Mudança coordenada pendente** | o conteúdo alcançou `main`, `Refat_Frontend` e branches remotas; exige janela de manutenção e force-push controlado |

> [!danger] Critério de incidente
> Até a revogação do PAT e a rotação da senha, as credenciais devem ser consideradas comprometidas. Remover o texto do branch atual não invalida cópias existentes nem limpa o histórico remoto.

## 3. Validação dos demais achados

| Grupo | Parecer de Governança | Tratamento |
|---|---|---|
| `renderIccPills` usa `innerHTML` com chave/valor variáveis | Risco real de XSS estrutural, embora a origem atual seja interna | corrigir com teste RED e escape no ponto de renderização |
| `innerHTML` dos KPIs de curto-circuito | Falso positivo de severidade moderada: os valores passam por formatação numérica e o sufixo é estático | documentar e preferir DOM seguro em refatoração futura; não interrompe entrega |
| `container.innerHTML = renderFunction(payload)` | Risco arquitetural dependente dos templates chamados | inventariar fontes e adicionar contrato de sanitização antes de alterar |
| Testes `test_os040/042/044.js` versus versões `_restart` | Não há prova de que sejam lixo: os cabeçalhos registram contratos TDD e reinícios de Tribunal distintos | não deletar; classificar como ativo, evidência histórica ou supersedido com decisão do QA/CTO |
| Screenshots byte-idênticos | Achado válido para investigação; pode indicar captura do mesmo estado ou fixture desatualizada | reproduzir a captura e atrelar cada imagem ao teste/estado que a gerou |
| Duplicação entre documentação de engenharia e motor JS | Em grande parte intencional: documento arquitetural contém exemplos auditáveis da implementação | excluir blocos documentais da métrica somente após registrar a justificativa; não transformar documentação em dependência executável |
| Boilerplate Puppeteer duplicado | Dívida real de manutenção | extrair helper após estabilizar contratos dos testes em andamento |
| `ui_render.js` com mais de 1.000 linhas e múltiplas responsabilidades | Dívida arquitetural real | decomposição incremental protegida por testes de caracterização |
| `injectWithRetry` por polling e globais em `window` | Riscos reais de lifecycle e colisão de estado | remover por etapas, sem refatoração ampla simultânea |
| Estruturas diferentes para agrupamento BT e MT | O relatório não demonstrou equivalência normativa entre os domínios | Engenheiro Eletricista deve validar antes de qualquer unificação; não tratar diferença como “acidente” sem prova física |

## 4. Plano de ação governado

Este plano é uma entrada de Governança. O CTO deve decompor cada pacote aprovado em O.S. com SDD/BDD, responsável, branch e evidência RED→GREEN. Nenhum item abaixo autoriza implementação direta em `main`.

### P0 — Encerrar o incidente de credenciais

| ID | Ação | Responsável | Critério de aceite |
|---|---|---|---|
| CRV-P0-01 | Revogar o PAT exposto e emitir credencial de menor privilégio somente se ainda necessária | CEO/titular GitHub | token antigo rejeitado; novo segredo armazenado fora do Git |
| CRV-P0-02 | Rotacionar a senha da VPS e revisar autenticação SSH | CEO/Infra | senha antiga inválida; acesso validado; preferência por chave SSH |
| CRV-P0-03 | Reescrever todas as referências afetadas com `git filter-repo`, forçar atualização remota coordenada e orientar reclone | CTO + CEO | scanner de histórico sem ocorrência; branches protegidas restauradas; colaboradores notificados |
| CRV-P0-04 | Implantar detecção de segredos em pre-PR/CI | CTO + QA | fixture sintética é bloqueada; código limpo passa; artifact registra comando e exit code |

### P1 — Segurança da renderização e baseline executável

| ID | Ação | Critério de aceite |
|---|---|---|
| CRV-P1-01 | Criar teste RED de XSS para chave e valor de `renderIccPills`; corrigir com `textContent`/construção DOM ou escape central auditado | payload com tags/event handlers aparece como texto e não cria nó executável |
| CRV-P1-02 | Inventariar todos os sinks `innerHTML`, classificando fonte como estática, numérica, interna tipada ou não confiável | matriz anexada à O.S.; zero sink variável sem controle explícito |
| CRV-P1-03 | Definir comandos oficiais em `package.json` para testes e auditorias | `npm test` deixa de ser placeholder e retorna exit code confiável |
| CRV-P1-04 | Executar CodeRev e verificação de segredos no gate de PR | falha impede aceite da PR; relatório não contém o segredo detectado em texto integral |

### P2 — Higiene de testes e artefatos

| ID | Ação | Critério de aceite |
|---|---|---|
| CRV-P2-01 | Criar inventário dos testes por O.S., estado e substituição formal | todo teste tem status `ativo`, `histórico` ou `supersedido` e referência de decisão |
| CRV-P2-02 | Reproduzir screenshots e corrigir captura/nomes quando estados distintos gerarem bytes idênticos | hash distinto quando o estado visual deve divergir; duplicidade intencional documentada |
| CRV-P2-03 | Extrair setup Puppeteer compartilhado sem alterar asserções | todas as suítes selecionadas mantêm resultado e exit code anterior |
| CRV-P2-04 | Definir política de retenção para screenshots, logs e artifacts | somente fixtures necessárias ficam no Git; evidência efêmera fica no artifact da CI |

### P3 — Redução incremental da dívida arquitetural

| ID | Ação | Critério de aceite |
|---|---|---|
| CRV-P3-01 | Dividir `ui_render.js` por domínio, começando por ICC | testes de caracterização verdes; API pública explicitamente definida |
| CRV-P3-02 | Substituir polling de `injectWithRetry` por lifecycle determinístico | zero retry temporal para aguardar DOM; teste cobre montagem tardia/falha explícita |
| CRV-P3-03 | Encapsular globais sob namespace/módulo controlado | lista de globais reduzida e contrato de compatibilidade testado |
| CRV-P3-04 | Resolver duplicações executáveis reais em UI e testes | redução de clones sem remover exemplos normativos ou legibilidade |

### P4 — Consistência científica e manutenção

| ID | Ação | Critério de aceite |
|---|---|---|
| CRV-P4-01 | Submeter diferenças BT/MT ao Engenheiro Eletricista | Prova de Cálculo Contestável confirma se estruturas podem ou não convergir |
| CRV-P4-02 | Converter marcadores `MVP` em limitações rastreadas | cada limitação tem decisão, risco, referência normativa e destino no backlog |
| CRV-P4-03 | Configurar escopo do detector de clones com justificativas | documentação/exemplos excluídos apenas quando não forem código executável; baseline registrada |

## 5. Ordem e gates

1. P0 deve encerrar antes de qualquer publicação externa do branch.
2. P1 precede refatorações de arquitetura porque estabelece o baseline de segurança e comandos reproduzíveis.
3. P2 pode avançar em paralelo somente em branches/O.S. isoladas.
4. P3 deve ser entregue em fatias pequenas; uma migração total de `ui_render.js` não será aceita.
5. P4 depende de validação científica e não pode ser decidida por métrica de duplicação.

## 6. Indicadores para a próxima auditoria

- zero segredo no working tree, artifacts e histórico reescrito;
- zero ferramenta com credenciais instalada dentro do repositório;
- zero sink variável de HTML sem teste e controle explícito;
- 100% dos testes classificados e sem exclusão baseada apenas no nome;
- `npm test` e auditoria de segurança com exit code confiável;
- redução de duplicação executável sem penalizar documentação normativa;
- nota alvo: Organização ≥ 8,5; Segurança ≥ 8,5; Código Morto = 10,0; Global ≥ 8,5.
