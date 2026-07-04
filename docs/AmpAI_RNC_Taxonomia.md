---
tags: [governanca, normas, rnc]
versao: 1.0
status: ativo
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

## Regras de precedência

1. Norma primária e RNC-C prevalecem sobre RNC-P.
2. RNC-P prevalece sobre memória solta de agente, mas não autoriza implementação direta.
3. Livro, guia prático ou exemplo didático é referência secundária; não substitui norma primária.
4. Em conflito entre fontes, o @Engenheiro_Eletricista deve declarar o conflito e devolver a decisão ao CTO/Governança.

## Regra anti-alucinação

O @Engenheiro_Eletricista deve classificar toda fonte usada como `norma primária`, `RNC-P`, `RNC-C` ou `referência secundária` antes de deduzir regra física. Se a regra vier apenas de RNC-P, a saída deve recomendar promoção para RNC-C antes de implementação.
