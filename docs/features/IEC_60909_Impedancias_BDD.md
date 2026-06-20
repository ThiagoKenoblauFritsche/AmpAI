# Especificação de Engenharia — Impedância Equivalente de Curto-Circuito (Zk, Rk, Xk)

> **Autor:** Engenheiro Eletricista Sênior (Copiloto Científico AmpAI) · Governança v7.0 (TDD Purista / Docs as Code)
> **Escopo:** Regras físicas e cenários BDD para o cálculo da impedância equivalente de curto-circuito de **geradores, transformadores e cabos/linhas**, e sua agregação no ponto de falta F.
> **Fonte normativa primária:** `docs/normas/IEC_60909_Short_Circuit/IEC 60909-0-2016.md` (edição vigente). Gabaritos numéricos validados contra `Calculation_of_short_circuit_currents.md` (Cahier Technique Schneider n° 158).

---

## 1. Premissas e Normas Aplicadas

**Normas:**
- **IEC 60909-0:2016**, *Short-circuit currents in three-phase a.c. systems — Part 0: Calculation of currents* — Cláusula 5.3.1 (Tabela 1, fator de tensão $c$); 6.2 (rede de alimentação); 6.3.1 e 6.3.3 (transformadores e $K_T$); 6.4 (linhas e cabos); 6.6.1 (geradores síncronos e $K_G$); 2 (Fórmula 32, correção de resistência por temperatura).
- **IEC 60038:2009** — tensões nominais padronizadas (base da Tabela 1).
- **IEC TR 60909-2** — dados de equipamentos (quando a placa não fornece $R/X$, $Z_{(0)}$).

**Premissas (declaradas por ausência de dado):**
- Sistema trifásico CA, frequência nominal $f \in \{50;\,60\}\ \text{Hz}$.
- Método da **fonte de tensão equivalente** $c \cdot U_n / \sqrt{3}$ no ponto de falta (IEC 60909-0:2016, 5.3.1).
- Para **corrente máxima**: $c_{\max}$ (Tabela 1) e resistências a $20\,°\text{C}$. Para **corrente mínima**: $c_{\min}$, $K_G = K_S = K_T = 1$ e resistências corrigidas pela temperatura (Fórmula 32).
- Sequência direta = inversa para equipamentos estáticos: $\underline{Z}_{(2)} = \underline{Z}_{(1)}$ (6.1).
- Onde $R_Q$ for desconhecida em rede AT: $R_Q = 0{,}1\,X_Q$, com $X_Q = 0{,}995\,Z_Q$ (6.2).

**Tabela 1 — Fator de tensão $c$ (IEC 60909-0:2016, 5.3.1):**

| Tensão nominal $U_n$ | $c_{\max}$ | $c_{\min}$ |
|---|---|---|
| BT 100 V–1000 V (tol. ±6 %) | 1,05 | 0,95 |
| BT 100 V–1000 V (tol. ±10 %) | 1,10 | 0,90 |
| AT >1 kV–230 kV | 1,10 | 1,00 |
| AT >230 kV (até $U_m = 420$ kV) | 1,10 | 1,00 |

> Restrição dielétrica: $c_{\max} \cdot U_n$ **não deve exceder** a tensão máxima do equipamento $U_m$.

---

## 2. Memorial de Cálculo

### 2.1 Rede de alimentação (Network feeder) — IEC 60909-0:2016, 6.2

$$ \underline{Z}_Q = \frac{c \cdot U_{nQ}}{\sqrt{3} \cdot I_{kQ}''} \tag{4} $$

Referida ao lado BT de um transformador de razão $t_r = U_{rTHV}/U_{rTLV}$:

$$ \underline{Z}_{Qt} = \frac{c \cdot U_{nQ}}{\sqrt{3} \cdot I_{kQ}''} \cdot \frac{1}{t_r^{2}} \tag{6} $$

**Substituição** (gabarito CT-158, Problema 1): $c = 1{,}10$, $U_{nQ} = 20\,000\ \text{V}$, $I_{kQ}'' = 10\,000\ \text{A}$, $t_r = 20\,000/410 = 48{,}78$:

$$ Z_Q = \frac{1{,}10 \cdot 20\,000}{\sqrt{3} \cdot 10\,000} = 1{,}270\ \Omega \;\Rightarrow\; Z_{Qt} = \frac{1{,}270}{48{,}78^{2}} = 0{,}534\ \text{m}\Omega $$

$$ X_{Qt} = 0{,}995 \cdot Z_{Qt} = 0{,}531\ \text{m}\Omega; \quad R_{Qt} = 0{,}1 \cdot X_{Qt} = 0{,}0531\ \text{m}\Omega $$

### 2.2 Transformador de dois enrolamentos — IEC 60909-0:2016, 6.3.1 e 6.3.3

$$ Z_T = \frac{u_{kr}}{100\%} \cdot \frac{U_{rT}^{2}}{S_{rT}} \tag{7} \qquad R_T = \frac{u_{Rr}}{100\%} \cdot \frac{U_{rT}^{2}}{S_{rT}} = \frac{P_{krT}}{3 \cdot I_{rT}^{2}} \tag{8} \qquad X_T = \sqrt{Z_T^{2} - R_T^{2}} \tag{9} $$

$$ K_T = 0{,}95 \cdot \frac{c_{\max}}{1 + 0{,}6 \cdot x_T}, \quad x_T = \frac{X_T}{U_{rT}^{2}/S_{rT}}, \quad \underline{Z}_{TK} = K_T \cdot \underline{Z}_T \tag{12a} $$

**Substituição** (gabarito CT-158, Problema 1): $S_{rT} = 400\ \text{kVA}$, $U_{rTLV} = 410\ \text{V}$, $u_{kr} = 4\%$, $P_{krT} = 4\,600\ \text{W}$, $c_{\max} = 1{,}05$:

$$ Z_T = \frac{4}{100} \cdot \frac{410^{2}}{400\,000} = 16{,}81\ \text{m}\Omega; \quad R_T = \frac{4\,600 \cdot 410^{2}}{(400\,000)^{2}} = 4{,}83\ \text{m}\Omega; \quad X_T = \sqrt{16{,}81^{2} - 4{,}83^{2}} = 16{,}10\ \text{m}\Omega $$

$$ x_T = \frac{16{,}10 \times 10^{-3}}{410^{2}/400\,000} = 0{,}0383; \quad K_T = 0{,}95 \cdot \frac{1{,}05}{1 + 0{,}6 \cdot 0{,}0383} = 0{,}975; \quad \underline{Z}_{TK} = (4{,}71 + \mathrm{j}\,15{,}70)\ \text{m}\Omega $$

> **Limite físico-matemático:** a Fórmula (9) exige $R_T \le Z_T$ (equivalente a $u_{Rr} \le u_{kr}$). Caso contrário, $X_T = \sqrt{\text{negativo}}$ é **imaginário** → entrada fisicamente impossível.
> **Regra de aplicação:** $K_T$ aplica-se **somente** a transformadores de rede e **somente** no cálculo de corrente máxima. Para transformadores de grupo gerador, usar $K_S$/$K_{SO}$ (6.7), **nunca** $K_T$.

### 2.3 Gerador síncrono — IEC 60909-0:2016, 6.6.1

$$ \underline{Z}_{GK} = K_G \cdot \underline{Z}_G = K_G \cdot \left(R_G + \mathrm{j}\,X_d''\right) \tag{17} \qquad K_G = \frac{U_n}{U_{rG}} \cdot \frac{c_{\max}}{1 + x_d'' \cdot \sqrt{1 - \cos^{2}\varphi_{rG}}} \tag{18} $$

com $x_d'' = X_d'' / Z_{rG}$ e $Z_{rG} = U_{rG}^{2} / S_{rG}$.

**Substituição** (dados CT-158, Problema 2 — gerador $21\ \text{kV}$, $250\ \text{MVA}$, $x_d'' = 0{,}17$, $\cos\varphi_{rG} = 0{,}78$, alimentação direta $U_n = U_{rG}$, $c_{\max} = 1{,}10$):

$$ Z_{rG} = \frac{21\,000^{2}}{250 \times 10^{6}} = 1{,}764\ \Omega; \quad X_d'' = 0{,}17 \cdot 1{,}764 = 0{,}2999\ \Omega $$

$$ \sqrt{1 - 0{,}78^{2}} = 0{,}6258; \quad K_G = 1 \cdot \frac{1{,}10}{1 + 0{,}17 \cdot 0{,}6258} = 0{,}994; \quad \underline{Z}_{GK} = 0{,}994 \cdot (R_G + \mathrm{j}\,0{,}2999)\ \Omega $$

> **Corrente mínima:** usar $K_G = 1$ (6.6.1). A resistência fictícia $R_{Gf}$ (0,05/0,07/0,15·$X_d''$) serve **apenas** ao cálculo do pico $i_p$, não a $\underline{Z}_{GK}$.

### 2.4 Linha aérea / cabo — IEC 60909-0:2016, 6.4 e Fórmula (32)

$$ \underline{Z}_L = R_L + \mathrm{j}\,X_L = (r' \cdot l) + \mathrm{j}\,(x' \cdot l) \qquad R_L' = \frac{\rho}{q_n} \tag{14} $$

Resistividades a $20\,°\text{C}$: Cu $\rho = \tfrac{1}{54}$; Al $\rho = \tfrac{1}{34}$; liga de Al $\rho = \tfrac{1}{31}\ \Omega\,\text{mm}^2/\text{m}$. Correção por temperatura (corrente mínima):

$$ R_L = \left[1 + \alpha \cdot (\theta_e - 20\,°\text{C})\right] \cdot R_{L20}, \quad \alpha = 0{,}004/\text{K} \tag{32} $$

**Substituição** (cabo Cu $120\ \text{mm}^2$, $l = 100\ \text{m}$, $x' = 0{,}08\ \Omega/\text{km}$, corrente máxima a $20\,°\text{C}$):

$$ R_L = \frac{1/54}{120} \cdot 100 = 15{,}43\ \text{m}\Omega; \quad X_L = 0{,}08 \times 10^{-3} \cdot 100 = 8{,}0\ \text{m}\Omega; \quad |\underline{Z}_L| = \sqrt{15{,}43^{2} + 8{,}0^{2}} = 17{,}38\ \text{m}\Omega $$

### 2.5 Agregação no ponto de falta F (impedância de curto $\underline{Z}_k$)

$$ \underline{Z}_k = R_k + \mathrm{j}\,X_k = \sum_i R_i + \mathrm{j}\sum_i X_i \qquad |\underline{Z}_k| = \sqrt{R_k^{2} + X_k^{2}} $$

**Substituição** (TC002, série rede + trafo + cabo curto): $\underline{Z}_k = (5{,}18 + \mathrm{j}\,16{,}37)\ \text{m}\Omega \Rightarrow |\underline{Z}_k| = 17{,}17\ \text{m}\Omega$.

---

## 3. Cenários BDD (Gherkin)

```gherkin
# language: pt
# IEC 60909-0:2016 — Impedância equivalente de curto-circuito (Zk, Rk, Xk)
# Caminhos felizes = cálculos exatos (gabarito). Caminhos tristes = bloqueio de absurdos físicos.

Funcionalidade: Impedância da rede de alimentação (Zq) — IEC 60909-0:2016, 6.2

  Contexto:
    Dado que o fator de tensão "c" é obtido da Tabela 1 (IEC 60909-0:2016)

  Cenário: Caminho feliz — Zq a partir da corrente de curto fornecida pela concessionária
    Dado uma rede com tensao nominal Unq = 20000 V
    E uma corrente de curto inicial simetrica I''kq = 10000 A
    E o fator de tensao c = 1,10
    Quando eu calculo a impedancia equivalente da rede pela Formula (4)
    Entao Zq deve ser 1,270 Ohm com tolerancia de 0,5%
    E referida ao lado BT (tr = 48,78) Zqt deve ser 0,534 mOhm
    E na ausencia de Rq deve assumir Xq = 0,995*Zq e Rq = 0,1*Xq

  Cenário: Bloqueio físico — corrente de curto nula (divisão por zero)
    Dado uma rede com tensao nominal Unq = 20000 V
    E uma corrente de curto inicial simetrica I''kq = 0 A
    Quando eu tento calcular a impedancia da rede pela Formula (4)
    Entao o motor deve bloquear com o erro "I''kq deve ser estritamente positiva (> 0 A)"
    E nenhum valor de Zq deve ser retornado

  Cenário: Bloqueio físico — corrente de curto negativa
    Dado uma corrente de curto inicial simetrica I''kq = -5000 A
    Quando eu tento calcular a impedancia da rede
    Entao o motor deve bloquear com o erro "corrente fisicamente impossivel (< 0 A)"


Funcionalidade: Impedância de transformador de dois enrolamentos (Zt, Rt, Xt) — IEC 60909-0:2016, 6.3.1/6.3.3

  Cenário: Caminho feliz — Zt, Rt, Xt e fator de correção Kt
    Dado um transformador com Srt = 400 kVA
    E tensao do enrolamento de referencia Urt = 410 V
    E tensao de curto-circuito ukr = 4 %
    E perdas no cobre Pkrt = 4600 W
    E fator de tensao c_max = 1,05
    Quando eu calculo a impedancia do transformador pelas Formulas (7), (8) e (9)
    Entao Zt deve ser 16,81 mOhm
    E Rt deve ser 4,83 mOhm
    E Xt deve ser 16,10 mOhm
    E o fator de correcao Kt (Formula 12a) deve ser 0,975
    E a impedancia corrigida Ztk deve ser (4,71 + j15,70) mOhm

  Cenário: Bloqueio físico CRÍTICO — componente resistiva maior que a impedância (Xt imaginário)
    Dado um transformador com tensao de curto-circuito ukr = 4 %
    E uma componente resistiva uRr = 5 % (uRr > ukr)
    Quando eu tento calcular Xt = raiz(Zt^2 - Rt^2)
    Entao o radicando e negativo e o motor deve bloquear
    E o erro deve ser "uRr nao pode exceder ukr: Rt > Zt torna Xt imaginario (impossivel)"

  Cenário: Bloqueio físico — potência nominal nula (divisão por zero)
    Dado um transformador com Srt = 0 kVA
    Quando eu tento calcular Zt pela Formula (7)
    Entao o motor deve bloquear com o erro "Srt deve ser estritamente positiva (> 0)"

  Cenário: Bloqueio físico — tensão de curto-circuito não positiva
    Dado um transformador com ukr = 0 %
    Quando eu tento calcular Zt pela Formula (7)
    Entao o motor deve bloquear com o erro "ukr deve estar na faixa fisica (0 % < ukr <= 20 %)"

  Cenário: Bloqueio de governança — Kt indevido em trafo de grupo gerador
    Dado um transformador classificado como "transformador de grupo gerador"
    Quando o motor for aplicar o fator de correcao de impedancia
    Entao Kt NAO deve ser aplicado
    E o motor deve usar Ks ou Kso conforme 6.7 (evita dupla correcao)


Funcionalidade: Impedância de gerador síncrono (Zgk) — IEC 60909-0:2016, 6.6.1

  Cenário: Caminho feliz — impedância subtransitória corrigida e fator Kg
    Dado um gerador com Urg = 21000 V e Srg = 250 MVA
    E reatancia subtransitoria relativa x''d = 0,17
    E fator de potencia nominal cos_phi_rg = 0,78
    E alimentacao direta com Un = Urg e c_max = 1,10
    Quando eu calculo a impedancia pela Formula (17) e Kg pela Formula (18)
    Entao a impedancia nominal Zrg deve ser 1,764 Ohm
    E a reatancia subtransitoria X''d deve ser 0,2999 Ohm
    E o fator de correcao Kg deve ser 0,994

  Cenário: Corrente mínima — fator de correção neutralizado
    Dado um gerador com os mesmos dados nominais
    Quando eu calculo a impedancia para CORRENTE MINIMA
    Entao Kg deve ser igual a 1
    E nenhuma correcao c_max deve ser aplicada

  Esquema do Cenário: Bloqueio físico — fator de potência fora do intervalo [0; 1]
    Dado um gerador com fator de potencia nominal cos_phi_rg = <cos_phi>
    Quando eu tento calcular Kg pela Formula (18)
    Entao o motor deve bloquear com o erro "cos(phi) fora do intervalo fisico [0; 1]"

    Exemplos:
      | cos_phi |
      | 1,20    |
      | -0,30   |

  Cenário: Bloqueio físico — reatância subtransitória não positiva
    Dado um gerador com x''d = 0
    Quando eu tento calcular Kg pela Formula (18)
    Entao o motor deve bloquear com o erro "x''d deve ser estritamente positiva (> 0)"


Funcionalidade: Impedância de linha aérea / cabo (Zl) — IEC 60909-0:2016, 6.4

  Cenário: Caminho feliz — Zl a partir de resistividade e seção
    Dado um cabo de cobre com secao nominal qn = 120 mm2
    E comprimento L = 100 m
    E reatancia por unidade de comprimento x' = 0,08 Ohm/km
    E resistividade do cobre rho = 1/54 Ohm.mm2/m a 20 C
    Quando eu calculo a impedancia da linha pela Formula (14)
    Entao Rl deve ser 15,43 mOhm
    E Xl deve ser 8,00 mOhm
    E o modulo |Zl| deve ser 17,38 mOhm

  Cenário: Corrente mínima — correção da resistência pela temperatura
    Dado um cabo com resistencia a 20 C Rl20 = 15,43 mOhm
    E temperatura final do condutor theta_e = 90 C
    Quando eu calculo a resistencia pela Formula (32) com alpha = 0,004/K
    Entao Rl deve ser Rl20 * (1 + 0,004*(90 - 20)) = 19,75 mOhm

  Cenário: Bloqueio físico — seção do condutor nula (divisão por zero)
    Dado um cabo com secao nominal qn = 0 mm2
    Quando eu tento calcular R'l pela Formula (14)
    Entao o motor deve bloquear com o erro "qn deve ser estritamente positiva (> 0 mm2)"

  Cenário: Bloqueio físico — comprimento não positivo
    Dado um cabo com comprimento L = 0 m
    Quando eu tento calcular Zl
    Entao o motor deve bloquear com o erro "comprimento L deve ser > 0 m"


Funcionalidade: Agregação da impedância de curto Zk no ponto de falta F — IEC 60909-0:2016

  Cenário: Caminho feliz — soma série e módulo
    Dado a impedancia da rede Zqt = (0,053 + j0,531) mOhm
    E a impedancia corrigida do trafo Ztk = (4,71 + j15,70) mOhm
    E a impedancia do cabo curto Zl = (0,416 + j0,136) mOhm
    Quando eu somo as resistencias e as reatancias separadamente
    Entao Zk deve ser (5,18 + j16,37) mOhm
    E o modulo |Zk| = raiz(Rk^2 + Xk^2) deve ser 17,17 mOhm

  Cenário: Bloqueio dielétrico — tensão equivalente acima da suportada pelo equipamento
    Dado um ponto de falta com Un = 24000 V e c_max = 1,10
    E equipamento com tensao maxima Um = 24000 V
    Quando o motor avaliar c_max * Un contra Um
    Entao deve bloquear com o erro "c_max*Un (26,4 kV) excede Um (24 kV) — violacao dieletrica"
```

---

## 4. Parâmetros Físicos Restritivos (blindagem de inputs — Backend/QA)

### 4.1 Rede de alimentação (6.2)
| Parâmetro | Unidade | Mín. | Máx. | Regra de Bloqueio |
|---|---|---|---|---|
| $U_{nQ}$ | V | 0 (exclusivo) | 550 000 | Bloquear se $\le 0$ |
| $I_{kQ}''$ | A | 0 (exclusivo) | 200 000 | Bloquear se $\le 0$ (divisão por zero na Eq. 4) |
| $c$ | — | 0,90 | 1,10 | Bloquear fora da Tabela 1; bloquear se $c_{\max} U_n > U_m$ |
| $t_r$ | — | 1 | — | Bloquear se $< 1$ (posição principal do tap) |

### 4.2 Transformador (6.3.1 / 6.3.3)
| Parâmetro | Unidade | Mín. | Máx. | Regra de Bloqueio |
|---|---|---|---|---|
| $S_{rT}$ | VA | 0 (exclusivo) | 1×10⁹ | Bloquear se $\le 0$ (divisão por zero na Eq. 7) |
| $U_{rT}$ | V | 0 (exclusivo) | 550 000 | Bloquear se $\le 0$ |
| $u_{kr}$ | % | 0 (exclusivo) | 20 | Bloquear se $\le 0$; avisar fora de [3; 20] |
| $u_{Rr}$ | % | 0 | $u_{kr}$ | **Bloquear se $u_{Rr} > u_{kr}$** (torna $X_T$ imaginário, Eq. 9) |
| $P_{krT}$ | W | 0 (exclusivo) | — | Bloquear se $\le 0$ ou se implicar $R_T > Z_T$ |
| $K_T$ aplicável? | — | — | — | Bloquear aplicação em trafo de grupo gerador (usar $K_S$/$K_{SO}$) |

### 4.3 Gerador síncrono (6.6.1)
| Parâmetro | Unidade | Mín. | Máx. | Regra de Bloqueio |
|---|---|---|---|---|
| $U_{rG}$ | V | 0 (exclusivo) | 50 000 | Bloquear se $\le 0$ |
| $S_{rG}$ | VA | 0 (exclusivo) | 2×10⁹ | Bloquear se $\le 0$ (divisão por zero em $Z_{rG}$) |
| $x_d''$ | p.u. | 0 (exclusivo) | 1 | Bloquear se $\le 0$; avisar fora de [0,1; 0,4] |
| $\cos\varphi_{rG}$ | — | 0 | 1 | Bloquear fora de [0; 1] |
| $R_G$ | Ω | 0 | — | Bloquear se $< 0$ |
| $K_G$ (mín.) | — | 1 | 1 | Forçar $K_G = 1$ no cálculo de corrente mínima |

### 4.4 Linha / cabo (6.4 / Fórmula 32)
| Parâmetro | Unidade | Mín. | Máx. | Regra de Bloqueio |
|---|---|---|---|---|
| $q_n$ | mm² | 0 (exclusivo) | 2 000 | Bloquear se $\le 0$ (divisão por zero na Eq. 14) |
| $l$ (comprimento) | m | 0 (exclusivo) | 50 000 | Bloquear se $\le 0$ |
| $\rho$ | Ω·mm²/m | 0 (exclusivo) | — | Bloquear se $\le 0$; usar 1/54 (Cu), 1/34 (Al), 1/31 (liga) |
| $\theta_e$ | °C | −20 | $\theta_{máx}$ isolação | Bloquear se $\ge \theta_{máx}$ da isolação |
| $f$ | Hz | 50 | 60 | Bloquear se $\notin \{50; 60\}$ |

### 4.5 Agregação $\underline{Z}_k$
| Verificação | Regra de Bloqueio |
|---|---|
| Coerência de nível de tensão | Toda impedância deve ser referida ao mesmo nível (fator $t_r^2$) antes de somar |
| $\lvert \underline{Z}_k \rvert$ | Bloquear se $\to 0$ (curto franco sem impedância → $I_k'' \to \infty$, fisicamente impossível) |
| Dielétrico | Bloquear se $c_{\max} \cdot U_n > U_m$ |

---

*Especificação gerada conforme a persona Engenheiro Eletricista Sênior (AmpAI). Base normativa imutável para @CTO, @Senior_Backend_Dev e @Senior_QA_Security. Unidades em SI; equações em IEC 60909-0:2016.*
