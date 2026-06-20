# Especificação de Engenharia: Impedâncias Equivalentes (IEC 60909-0)

## 1. Cenários BDD (Gherkin)

```gherkin
Feature: Cálculo de Impedâncias Equivalentes segundo IEC 60909-0
  Como Engenheiro Eletricista Sênior
  Quero calcular rigorosamente a impedância (Z, R, X) de geradores, transformadores e cabos
  Para garantir precisão absoluta nas simulações de curto-circuito

  Scenario: Caminho Feliz - Impedância Equivalente de Transformador
    Given os dados nominais de um transformador de rede
    When os valores inseridos forem "UrT = 13800 V", "SrT = 1000000 VA", "ukr = 5 %", "uRr = 1 %" e "cmax = 1.05"
    Then a impedância original ZT deve ser calculada com as equações 7 a 9
    And o fator de correção KT da equação 12a deve ser aplicado
    And o sistema deve retornar os valores de resistência e reatância corrigidos (R_TK, X_TK)

  Scenario: Caminho Feliz - Impedância Equivalente de Gerador Síncrono
    Given os dados nominais de um gerador síncrono
    When os valores inseridos forem "UrG = 13800 V", "Un = 13800 V", "SrG = 50000000 VA", "Xd_sec = 0.5 ohm", "cos(phi) = 0.8" e "cmax = 1.05"
    Then a impedância subtransitória corrigida Z_GK deve ser calculada usando a equação 17
    And o fator de correção KG da equação 18 deve ser aplicado
    And a resistência fictícia R_Gf apropriada deve ser deduzida em função de SrG e UrG

  Scenario: Caminho Feliz - Impedância de Cabos e Linhas
    Given os parâmetros construtivos de uma linha de cobre
    When os valores inseridos forem "L = 100 m", "qn = 25 mm²", "f = 60 Hz", "d = 0.5 m" e "r = 0.005 m"
    Then a resistência R_L e reatância X_L devem ser calculadas usando as equações 14 e 15
    And a resistividade do cobre (1/54 ohm.mm²/m) deve ser empregada no cálculo

  Scenario Outline: Caminho Triste - Bloqueio de Absurdos Físicos (Transformadores)
    Given uma entrada de dados para o modelo do Transformador
    When o parâmetro "<parametro>" assumir o valor <valor>
    Then o sistema deve abortar o cálculo e exibir mensagem de erro "Violação de limite físico"

    Examples:
      | parametro | valor |
      | SrT       | 0     |
      | UrT       | -500  |
      | ukr       | 0     |
      | cmax      | 0     |

  Scenario Outline: Caminho Triste - Bloqueio de Absurdos Físicos (Geradores e Cabos)
    Given uma entrada de dados para o modelo de Geradores ou Cabos
    When o parâmetro "<parametro>" assumir o valor <valor>
    Then o sistema deve abortar o cálculo e exibir mensagem de erro "Violação de limite físico"

    Examples:
      | parametro | valor  |
      | Xd_sec    | -10    |
      | qn        | 0      |
      | L         | -50    |
      | cos_phi   | 1.5    |
```

## 2. Premissas e Normas Aplicadas

- **IEC 60909-0:2001** (Short-circuit currents in three-phase a.c. systems - Part 0: Calculation of currents). Equações referenciadas da Seção 3.
- **Sistema Internacional OBRIGATÓRIO:** Tensões em Volts (V), potências em Volt-Ampère (VA), distâncias em metros (m), seções de condutores em mm².
- **Fatores de Correção (KG e KT):** É estritamente mandatória a aplicação dos fatores $K_G$ para geradores e $K_T$ para transformadores de rede nas simulações de fonte de tensão equivalente (conforme item 3.1 da norma).
- **Resistividade Condutora:** Para temperatura de 20 °C, utiliza-se Cobre: $\rho = 1/54 \approx 0{,}018518\, \Omega\cdot\text{mm}^2/\text{m}$ ou Alumínio: $\rho = 1/34 \approx 0{,}029411\, \Omega\cdot\text{mm}^2/\text{m}$.
- **Resistência Fictícia do Gerador ($R_{Gf}$):** Adotada exclusivamente para fins de decaimento aperiódico / determinação da corrente de pico $i_p$ devido à pequenez da resistência estatórica em grandes máquinas.

## 3. Memorial de Cálculo

### 3.1. Transformadores de Rede (Dois Enrolamentos)
A impedância total de curto-circuito referida aos terminais ($\underline{Z}_T = R_T + \mathrm{j}X_T$) é dada por:

$$ Z_T = \frac{u_{kr}}{100\,\%} \cdot \frac{U_{rT}^{2}}{S_{rT}} $$

A componente resistiva é extraída do percentual resistivo $u_{Rr}$ ou perdas em curto $P_{krT}$:

$$ R_T = \frac{u_{Rr}}{100\,\%} \cdot \frac{U_{rT}^{2}}{S_{rT}} = \frac{P_{krT}}{3\, I_{rT}^{2}} $$

Logo, a reatância é:

$$ X_T = \sqrt{Z_T^{2} - R_T^{2}} $$

**Correção da Impedância ($K_T$)**
Para conexão de redes com diferentes níveis de tensão, aplica-se o fator $K_T$:

$$ K_T = 0{,}95 \cdot \frac{c_{max}}{1 + 0{,}6\, x_T} $$

onde $x_T$ é a reatância relativa em p.u. ($x_T = X_T / (U_{rT}^2/S_{rT})$). O valor final para a simulação será:

$$ \underline{Z}_{TK} = K_T \underline{Z}_T = K_T R_T + \mathrm{j} (K_T X_T) $$

### 3.2. Geradores Síncronos
A fonte de tensão equivalente substitui a tensão subtransitória e requer correção das impedâncias intrínsecas:

$$ K_G = \frac{U_n}{U_{rG}} \cdot \frac{c_{max}}{1 + x_d'' \sin\varphi_{rG}} $$

onde $x_d'' = X_d'' / (U_{rG}^2/S_{rG})$ representa a reatância subtransitória relativa.
A impedância corrigida ($\underline{Z}_{GK}$) torna-se:

$$ \underline{Z}_{GK} = K_G\, \underline{Z}_G = K_G\left(R_{Gf} + \mathrm{j} X_d''\right) $$

**Regras de Resistência Fictícia ($R_{Gf}$)** (Conforme IEC 60909-0 item 3.6.1):
- Se $U_{rG} > 1000\,\text{V}$ e $S_{rG} \ge 100\,\text{MVA}$:  $R_{Gf} = 0{,}05\, X_d''$
- Se $U_{rG} > 1000\,\text{V}$ e $S_{rG} < 100\,\text{MVA}$:  $R_{Gf} = 0{,}07\, X_d''$
- Se $U_{rG} \le 1000\,\text{V}$:  $R_{Gf} = 0{,}15\, X_d''$

### 3.3. Cabos e Linhas Aéreas
As componentes ôhmicas ($R_L'$) e indutivas ($X_L'$) em $\Omega/\text{m}$ são:

$$ R_L' = \frac{\rho}{q_n} $$

$$ X_L' = 2\pi f \frac{\mu_0}{2\pi}\left(\frac{1}{4n} + \ln\frac{d}{r}\right) = f\mu_0\left(\frac{1}{4n} + \ln\frac{d}{r}\right) $$

Sendo $\mu_0 = 4\pi \times 10^{-7}\,\text{H/m}$ e $n$ o número de condutores por fase. 
A impedância final total sobre um vão de comprimento $L$:

$$ R_L = R_L' \cdot L $$
$$ X_L = X_L' \cdot L $$

## 4. Parâmetros Físicos Restritivos

O sistema deverá rejeitar e bloquear o avanço matemático caso as variáveis de entrada violem os limites abaixo:

| Parâmetro | Unidade | Mínimo | Máximo | Regra de Bloqueio |
|-----------|---------|--------|--------|-------------------|
| **SrT, SrG** | VA | 0 (exclusivo) | 3e9 (3000 MVA) | Bloquear se ≤ 0 |
| **UrT, UrG** | V | 0 (exclusivo) | 1e6 (1 MV) | Bloquear se ≤ 0 |
| **ukr** | % | 0 (exclusivo) | 30 | Bloquear se ≤ 0 |
| **uRr** | % | 0 (exclusivo) | 15 | Bloquear se ≤ 0 ou > ukr |
| **cmax** | — | 1.00 | 1.10 | Bloquear fora da faixa |
| **Un** | V | 0 (exclusivo) | 1e6 (1 MV) | Bloquear se ≤ 0 |
| **Xd_sec** ($X_d''$) | $\Omega$ | 0 (exclusivo) | 5000 | Bloquear se ≤ 0 |
| **cos φ** | — | 0 | 1 | Bloquear fora de [0, 1] |
| **L** | m | 0 (exclusivo) | 1e6 | Bloquear se ≤ 0 |
| **qn** | mm² | 0 (exclusivo) | 3000 | Bloquear se ≤ 0 |
| **d** | m | 0 (exclusivo) | 20 | Bloquear se ≤ 0 |
| **r** | m | 0 (exclusivo) | 0.5 | Bloquear se ≤ 0 ou r ≥ d |
| **f** | Hz | 50 | 60 | Bloquear fora do conjunto {50, 60} |
