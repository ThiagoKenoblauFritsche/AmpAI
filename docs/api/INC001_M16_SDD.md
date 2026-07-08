---
tags: [sdd, iec60909, m16, inc-001, result-pattern, rfc7807]
versao: 1.0
status: candidato_pre_red
baseline: bf0d592a215353d3f5382ed4f7234d85340bbb18
---

# SDD — INC-001 / Motor M16

## 1. Escopo

Este contrato especifica exclusivamente o cálculo da corrente inicial simétrica
trifásica M16, sem alterar UI, workflows, manifesto do gate ou classificação de
testes.

Fonte científica:

- `docs/engenharia/INC001_M16_BDD.feature`;
- `docs/engenharia/INC001_M16_Memorial.md`;
- `docs/engenharia/RNC-C_Fundacao_M00_M04_M15.md`, §9.3;
- IEC 60909-0:2016, §7.2.1, Fórmula (33), com a ressalva de proveniência
  registrada no memorial.

M16 permanece `implementado_sem_validacao` até o ciclo RED → GREEN e o
veredito independente do QA.

## 2. Interface pública preservada

```js
CurtoCircuitoIEC60909.calcularCorrenteInicialSimetrica(Un, Zk, c)
```

Entradas posicionais:

| Parâmetro | Tipo | Unidade/precondição | Domínio |
| --- | --- | --- | --- |
| `Un` | `number` finito | V, tensão nominal linha-linha do sistema | `Un > 0` |
| `Zk` | `number` finito | Ω, módulo da impedância equivalente | `Zk > 0` |
| `c` | `number` finito | adimensional | `{0.90, 0.95, 1.00, 1.05, 1.10}` |

As unidades são precondições. Números crus não permitem detectar se o chamador
forneceu Ω ou mΩ. Conversões devem ocorrer antes da chamada; DTO tipado não faz
parte deste incremento.

## 3. Fórmula

\[
I_k''=\frac{cU_n}{\sqrt{3}|Z_k|}
\]

O motor recebe V e Ω, calcula A e também expõe kA. Não pode acessar DOM,
renderizador, rede, filesystem ou console.

## 4. Result Pattern

### 4.1 Sucesso

```json
{
  "isSuccess": true,
  "value": {
    "simbolo": "Ik''",
    "descricao": "Corrente de Curto-Circuito Inicial Simétrica",
    "valor_amperes": 14122.7206,
    "valor_kiloamperes": 14.1227206,
    "equacao_latex": "I_k'' = \\frac{c \\cdot U_n}{\\sqrt{3} \\cdot Z_k}",
    "parametros_utilizados": {
      "Un": 400,
      "Zk": 0.01717,
      "c": 1.05
    }
  },
  "error": null
}
```

Os valores ilustrativos acima são aproximados. O teste deve comparar os campos
numéricos com tolerância relativa máxima de `0.01%`, nunca por igualdade textual
do número arredondado.

### 4.2 Falha

```json
{
  "isSuccess": false,
  "value": null,
  "error": {
    "type": "https://ampai.dev/problems/IEC60909-M16-001",
    "title": "IEC60909-M16-001",
    "status": 422,
    "code": "IEC60909-M16-001",
    "params": {
      "field": "Un",
      "reason": "not_finite"
    },
    "severity": "error"
  }
}
```

`error` segue Problem Details (RFC 7807) com extensões `code`, `params` e
`severity`. Não contém texto localizado. O motor retorna falha; não lança
exceção.

## 5. Códigos determinísticos

| Código | Condição | `params` mínimo |
| --- | --- | --- |
| `IEC60909-M16-001` | argumento ausente, tipo não numérico, `NaN` ou ±`Infinity` | `{ field, reason: "not_finite" }` |
| `IEC60909-M16-002` | `Un <= 0` | `{ field: "Un", reason: "non_positive" }` |
| `IEC60909-M16-003` | `Zk <= 0` | `{ field: "Zk", reason: "non_positive" }` |
| `IEC60909-M16-004` | `c` finito, mas fora do conjunto discreto permitido | `{ field: "c", reason: "not_in_allowed_set", allowed: [0.9,0.95,1,1.05,1.1] }` |

Ordem de validação: `Un`, `Zk`, `c`; primeiro estrutura/finitude, depois
positividade e finalmente conjunto normativo de `c`.

## 6. Casos científicos obrigatórios

| Caso | Resultado |
| --- | --- |
| TC-M16-01 | sucesso; `14.1227206 kA` ± `0.01%` |
| TC-M16-02 e 02b | `IEC60909-M16-002` |
| TC-M16-03 e 03b | `IEC60909-M16-003` |
| TC-M16-04 | `IEC60909-M16-004` |
| TC-M16-05 | sucesso; `13.2281135 kA` ± `0.01%` |
| TC-M16-06 | `IEC60909-M16-004` |
| TC-M16-07 | `IEC60909-M16-004` |
| 15 exemplos estruturais | `IEC60909-M16-001`, apontando o campo inválido |

## 7. Requisitos não funcionais

- função determinística e síncrona;
- zero DOM e zero renderização;
- zero `throw` para entradas de domínio;
- zero `console.warn` e `console.error`;
- sem arredondamento interno da corrente;
- preservar a exportação Node `CurtoCircuitoIEC60909` e a exposição browser
  existente;
- preservar os 39 testes `stable` atuais.

## 8. Estratégia TDD e classificação

O QA deverá criar um único teste novo, inicialmente `experimental`, com
relatórios JSON processáveis e exit code confiável. O RED precisa demonstrar
que pelo menos TC-M16-06, TC-M16-07 e entradas não finitas não cumprem este
contrato na baseline.

O teste novo não entra no manifesto `stable` nesta fase. A regressão obrigatória
é `tests/core_curto_circuito.test.js`, exatamente 39/39, além dos demais testes
stable executados pelo Gate Consolidado quando houver PR.

## 9. Taxonomia de execução

- `FUNCTIONAL_FAILURE`: motor executado e contrato M16 não conforme;
- `INFRA_BLOCKED`: runtime/dependência falhou antes do contrato;
- `CONFIG_ERROR`: teste ausente, relatório incompleto ou asserção não exercida;
- `PASS`: todos os relatórios completos, conformes e exit code zero.

## 10. Fora do escopo

- UI e conversão de unidades;
- DTO tipado;
- M17 e motores dependentes;
- alteração do Gate Consolidado ou branch protection;
- promoção do teste para `stable`;
- aposentadoria de workflows legados.
