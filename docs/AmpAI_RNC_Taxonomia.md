---
tags: [governanca, normas, rnc]
versao: 1.1
status: ativo
data_decisao: 2026-07-13
baseline_decisao: 4caf528407f7bb1dc4572c9e13232527d597a6f3
autoridade: CEO + @Conselho_de_Arquitetura_e_Governanca
---

# Taxonomia RNC — Registro Normativo Computável

## Propósito

Evitar que qualquer Markdown extraído de norma, livro ou guia técnico seja tratado automaticamente como regra canônica de produção. O RNC reduz alucinação quando sua origem, nível de curadoria e precedência estão explícitos.

## Classes oficiais

| Classe | Nome | Uso permitido | Exemplo típico |
| --- | --- | --- | --- |
| RNC-P | Registro Normativo Computável Processado | Consulta, comparação técnica, extração preliminar de fórmulas e identificação de lacunas | Markdown em `docs/normas/` extraído ou limpo de PDF, norma, livro ou guia |
| RNC-C | Registro Normativo Computável Canônico | Base direta para BDD, SDD, QA, implementação e prova de cálculo contestável | Documento curado em `docs/engenharia/` com fonte, escopo, equações, unidades, premissas, limites e regras QA |

## Critérios mínimos para RNC-C

Um documento só pode ser tratado como RNC-C quando declarar:

1. fonte normativa primária e/ou referência secundária usada;
2. edição, ano, escopo e limitações de aplicação;
3. equações em LaTeX revisadas;
4. unidades SI e checagem dimensional;
5. premissas adotadas e premissas proibidas;
6. limites físicos de entrada e saída;
7. condições de bloqueio e avisos de engenharia;
8. rastreabilidade para seção, tabela, equação ou anexo de origem quando disponível;
9. critérios de QA/BDD associados.

## Estado científico e vigência

Todo novo RNC-C ratificado deve separar a decisão científica de sua integração operacional:

```yaml
status_cientifico: RATIFICADO
vigencia: EFETIVA_QUANDO_INTEGRADO_A_MAIN
estado_do_motor: <estado real da capacidade>
```

`RATIFICADO` significa que o conteúdo científico passou pela autoridade competente. `EFETIVA_QUANDO_INTEGRADO_A_MAIN` significa que o mesmo blob se torna canônico objetivamente quando ingressa na branch `main`; não é necessária segunda PR para substituir a vigência por `CANÔNICO`.

O documento científico permanente não deve registrar:

- merge SHA ou Gate que ainda não existiam na sua produção;
- afirmações temporárias como “sem commit, push ou PR”;
- caminho ou estado do worktree usado para elaborá-lo;
- sincronização futura do Google Drive.

PR, merge SHA, Gate pós-merge, sincronização e encerramento pertencem ao GitHub e ao `docs/AmpAI_Registro_Mudancas.md`. A presença do documento ratificado em `main` é a prova objetiva de vigência; o Registro Mestre preserva como ele chegou lá.

Nova PR sobre o RNC-C só é necessária quando houver mudança real de fórmula, premissa, fonte, escopo, rastreabilidade, prova, condição científica ou estado do motor. Documentos históricos que já usam `vigencia: CANÔNICO` continuam válidos e não precisam ser reescritos.

## Regras de precedência

1. Norma primária e RNC-C prevalecem sobre RNC-P.
2. RNC-P prevalece sobre memória solta de agente, mas não autoriza implementação direta.
3. Livro, guia prático ou exemplo didático é referência secundária; não substitui norma primária.
4. Em conflito entre fontes, o @Engenheiro_Eletricista deve declarar o conflito e devolver a decisão ao CTO/Governança.

## Regra anti-alucinação

O @Engenheiro_Eletricista deve classificar toda fonte usada como `norma primária`, `RNC-P`, `RNC-C` ou `referência secundária` antes de deduzir regra física. Se a regra vier apenas de RNC-P, a saída deve recomendar promoção para RNC-C antes de implementação.
