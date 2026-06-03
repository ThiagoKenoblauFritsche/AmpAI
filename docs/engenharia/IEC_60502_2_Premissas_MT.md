# ⚡ ESPECIFICAÇÃO TÉCNICA: Dimensionamento de Cabos de Média Tensão (MT)
## Premissas Físico-Matemáticas — IEC 60502-2 (6 kV a 30 kV)

> **Módulo:** Dimensionamento de Cabos MT — AmpAI  
> **Revisão:** 1.0  
> **Data:** 2026-05-28  
> **Autor:** Engenheiro Eletricista Sênior (Copiloto Científico)  
> **Classificação:** Documento de Engenharia — Base de Conhecimento Interna

---

## Sumário

1. [Embasamento Normativo e Limites Térmicos](#1-embasamento-normativo-e-limites-térmicos)
2. [Memorial de Cálculo e Equações (LaTeX)](#2-memorial-de-cálculo-e-equações-latex)
3. [Regras de Consistência Física (QA)](#3-regras-de-consistência-física-qa)

---

## 1. Embasamento Normativo e Limites Térmicos

### 1.1 Escopo Normativo

| Norma | Escopo no Módulo MT |
|:---|:---|
| **IEC 60502-2** | Cabos de energia com isolação extrudada para tensões nominais de 6 kV (Um = 7,2 kV) a 30 kV (Um = 36 kV). Define construção, ensaios e requisitos de materiais. |
| **IEC 60986** | Limites de temperatura do condutor em curto-circuito para cabos de energia (referenciada pela IEC 60502-2). |
| **IEC 60949** | Cálculo de correntes de curto-circuito termicamente admissíveis, considerando efeitos adiabáticos e não-adiabáticos. Fornece as constantes de material ($K$, $\beta$). |
| **IEC 60287** (partes 1, 2 e 3) | Cálculo da capacidade de condução de corrente em regime permanente. Define a metodologia analítica para resistência térmica do solo, profundidade, agrupamento e temperatura ambiente. |
| **IEC 60228** | Condutores de cabos isolados — classes de flexibilidade e seções nominais padronizadas. |

> [!IMPORTANT]
> A IEC 60502-2 **não cobre** cabos para tensões acima de 30 kV (Um > 36 kV). Para tensões superiores, aplica-se a IEC 60840 (30 kV – 150 kV) ou a IEC 62067 (> 150 kV).

---

### 1.2 Limites Térmicos do Condutor

Os limites térmicos são definidos pela natureza do material de isolação e pelo regime de operação. Para as isolações aplicáveis em MT (XLPE e EPR), os limites são **idênticos** conforme IEC 60502-2 e IEC 60986:

#### Tabela 1 — Temperaturas Máximas do Condutor (IEC 60502-2 / IEC 60986)

| Condição de Operação | Isolação XLPE | Isolação EPR |
|:---|:---:|:---:|
| **Regime permanente** (operação contínua) | $90\,°\text{C}$ | $90\,°\text{C}$ |
| **Sobrecarga de emergência** (duração limitada) | $130\,°\text{C}$ | $130\,°\text{C}$ |
| **Curto-circuito** (duração $\leq 5\,\text{s}$) | $250\,°\text{C}$ | $250\,°\text{C}$ |

> [!NOTE]
> A temperatura de $250\,°\text{C}$ é o limite **do condutor** durante curto-circuito, determinado pela degradação térmica da isolação XLPE/EPR adjacente. O cobre em si funde a $\approx 1085\,°\text{C}$ e o alumínio a $\approx 660\,°\text{C}$, mas esses limites metalúrgicos são irrelevantes — o fator limitante é sempre a integridade dielétrica da isolação.

---

### 1.3 Limites Térmicos da Blindagem Metálica (Tela de Cobre)

A blindagem metálica (tela/screen) em cabos MT opera sob restrições térmicas impostas **pelo material da capa externa (sheath)** que a envolve, e não pelo metal da tela em si. Os limites são:

#### Tabela 2 — Temperaturas Máximas da Blindagem/Tela Metálica

| Material da Capa Externa | Temp. Inicial ($\theta_i$) — Regime | Temp. Final ($\theta_f$) — Curto-circuito |
|:---|:---:|:---:|
| **PVC** | $70\,°\text{C}$ | $160\,°\text{C}$ |
| **PE (MDPE/HDPE)** | $70\,°\text{C}$ | $250\,°\text{C}$ ¹ |
| **LSZH (Low Smoke Zero Halogen)** | $70\,°\text{C}$ | $200\,°\text{C}$ |

> ¹ Valores típicos de projeto. Consultar sempre a ficha técnica do fabricante para a formulação específica de PE utilizada.

> [!WARNING]
> A temperatura da blindagem durante curto-circuito **nunca** deve ser confundida com a do condutor principal. São componentes com temperaturas iniciais e finais **distintas**, o que resulta em constantes $k$ diferentes para cada cálculo adiabático.

---

### 1.4 Tensões Nominais Padronizadas (IEC 60502-2)

A norma define os cabos pela designação $U_0/U\,(U_m)$, onde:

- $U_0$ = tensão entre condutor e tela/terra (kV)
- $U$ = tensão entre fases (kV)  
- $U_m$ = tensão máxima do sistema (kV)

#### Tabela 3 — Tensões Nominais Cobertas pela IEC 60502-2

| $U_0/U\,(U_m)$ | Aplicação Típica |
|:---|:---|
| $3{,}6/6\,(7{,}2)\,\text{kV}$ | Distribuição industrial, alimentadores secundários |
| $6/10\,(12)\,\text{kV}$ | Redes de distribuição urbana |
| $8{,}7/15\,(17{,}5)\,\text{kV}$ | Alimentadores primários de distribuição |
| $12/20\,(24)\,\text{kV}$ | Redes de distribuição e subtransmissão |
| $18/30\,(36)\,\text{kV}$ | Subtransmissão, alimentadores de subestações |

> [!IMPORTANT]
> A seleção da classe de tensão ($U_0/U$) depende diretamente do **método de aterramento do sistema**. Sistemas com neutro isolado ou aterrado por impedância podem exigir cabos com classe de isolação superior (categoria B ou C da IEC 60502-2) em relação a sistemas solidamente aterrados (categoria A).

---

## 2. Memorial de Cálculo e Equações (LaTeX)

### 2.1 Critério de Curto-Circuito Adiabático — Condutor Principal

#### 2.1.1 Equação Fundamental

A equação adiabática estabelece que, para durações de curto-circuito $t \leq 5\,\text{s}$, **toda** a energia térmica ($I^2 t$) é absorvida pelo condutor sem dissipação para o meio:

$$I^2 t = k^2 S^2$$

Onde:
- $I$ — corrente de curto-circuito simétrica eficaz (RMS), em $[\text{A}]$
- $t$ — duração do curto-circuito, em $[\text{s}]$
- $k$ — constante do material (depende do condutor + isolação), em $[\text{A}\cdot\text{s}^{1/2}/\text{mm}^2]$
- $S$ — seção transversal nominal do condutor, em $[\text{mm}^2]$

#### 2.1.2 Isolando a Seção Mínima do Condutor

Para verificar se uma seção $S$ suporta a corrente de curto-circuito $I_{cc}$ durante o tempo $t$, reorganiza-se:

$$\boxed{S_{\min} = \frac{I_{cc} \sqrt{t}}{k}}$$

#### 2.1.3 Derivação Rigorosa da Constante $k$

A constante $k$ não é um valor empírico — ela é derivada das propriedades termofísicas do material condutor conforme IEC 60949:

$$k = K \cdot \sqrt{\ln\!\left(\frac{\beta + \theta_f}{\beta + \theta_i}\right)}$$

Onde:
- $K$ — constante de material (que encapsula calor específico volumétrico e resistividade), em $[\text{A}\cdot\text{s}^{1/2}/\text{mm}^2]$
- $\beta$ — inverso do coeficiente de temperatura da resistividade a $0\,°\text{C}$, em $[°\text{C}]$
- $\theta_i$ — temperatura inicial do condutor (= temperatura máxima em regime), em $[°\text{C}]$
- $\theta_f$ — temperatura final máxima permitida em curto-circuito, em $[°\text{C}]$

A expressão completa de $K$ é:

$$K = \sqrt{\frac{Q_c \cdot (\beta + 20)}{\rho_{20}}}$$

Onde:
- $Q_c$ — calor específico volumétrico do material, em $[\text{J}/(\text{K}\cdot\text{mm}^3)]$
- $\rho_{20}$ — resistividade elétrica a $20\,°\text{C}$, em $[\Omega\cdot\text{mm}]$

#### Tabela 4 — Constantes de Material (IEC 60949)

| Material | $K\;[\text{A}\cdot\text{s}^{1/2}/\text{mm}^2]$ | $\beta\;[°\text{C}]$ | $Q_c\;[\text{J}/(\text{K}\cdot\text{mm}^3)]$ | $\rho_{20}\;[\Omega\cdot\text{mm}]$ |
|:---|:---:|:---:|:---:|:---:|
| **Cobre (Cu)** | $226$ | $234{,}5$ | $3{,}45 \times 10^{-3}$ | $17{,}241 \times 10^{-6}$ |
| **Alumínio (Al)** | $148$ | $228$ | $2{,}50 \times 10^{-3}$ | $28{,}264 \times 10^{-6}$ |
| **Chumbo (Pb)** | $41$ | $230$ | $1{,}45 \times 10^{-3}$ | $214{,}0 \times 10^{-6}$ |
| **Aço (Fe)** | $78$ | $202$ | $3{,}80 \times 10^{-3}$ | $138{,}0 \times 10^{-6}$ |

#### 2.1.4 Valores Pré-Calculados de $k$ para Condutor Principal (XLPE/EPR)

Aplicando $\theta_i = 90\,°\text{C}$ e $\theta_f = 250\,°\text{C}$:

| Condutor | $k\;[\text{A}\cdot\text{s}^{1/2}/\text{mm}^2]$ |
|:---|:---:|
| **Cobre (Cu)** | $143$ |
| **Alumínio (Al)** | $94$ |

**Exemplo de verificação (Cobre):**

$$k_{\text{Cu}} = 226 \cdot \sqrt{\ln\!\left(\frac{234{,}5 + 250}{234{,}5 + 90}\right)} = 226 \cdot \sqrt{\ln\!\left(\frac{484{,}5}{324{,}5}\right)} = 226 \cdot \sqrt{\ln(1{,}493)}$$

$$k_{\text{Cu}} = 226 \cdot \sqrt{0{,}4001} = 226 \times 0{,}6326 \approx 143\;\text{A}\cdot\text{s}^{1/2}/\text{mm}^2 \;\checkmark$$

---

### 2.2 Critério de Curto-Circuito Adiabático — Blindagem Metálica (Tela de Cobre)

#### 2.2.1 Equação para Dimensionamento da Tela

A mesma equação adiabática aplica-se à blindagem, porém com **temperaturas iniciais e finais diferentes**:

$$\boxed{S_{\text{tela},\min} = \frac{I_{\text{falta}} \sqrt{t}}{k_{\text{tela}}}}$$

Onde $I_{\text{falta}}$ é a corrente de falta à terra que circula pela tela metálica.

#### 2.2.2 Constante $k$ para a Tela de Cobre

Para a tela de cobre, as temperaturas dependem da capa externa:

$$k_{\text{tela}} = 226 \cdot \sqrt{\ln\!\left(\frac{234{,}5 + \theta_{f,\text{capa}}}{234{,}5 + \theta_{i,\text{capa}}}\right)}$$

#### Tabela 5 — Valores de $k_{\text{tela}}$ para Tela de Cobre por Tipo de Capa

| Capa Externa | $\theta_i\;[°\text{C}]$ | $\theta_f\;[°\text{C}]$ | $k_{\text{tela}}\;[\text{A}\cdot\text{s}^{1/2}/\text{mm}^2]$ |
|:---|:---:|:---:|:---:|
| **PVC** | $70$ | $160$ | $115$ |
| **PE (MDPE)** | $70$ | $250$ | $143$ |
| **LSZH** | $70$ | $200$ | $128$ |

**Exemplo de cálculo (PVC):**

$$k_{\text{tela,PVC}} = 226 \cdot \sqrt{\ln\!\left(\frac{234{,}5 + 160}{234{,}5 + 70}\right)} = 226 \cdot \sqrt{\ln\!\left(\frac{394{,}5}{304{,}5}\right)} = 226 \cdot \sqrt{\ln(1{,}296)}$$

$$k_{\text{tela,PVC}} = 226 \cdot \sqrt{0{,}2593} = 226 \times 0{,}5092 \approx 115\;\text{A}\cdot\text{s}^{1/2}/\text{mm}^2$$

---

### 2.3 Impacto do Método de Aterramento no Tempo de Falta ($t$)

O método de aterramento do neutro do sistema de MT determina diretamente:
1. A **magnitude** da corrente de falta à terra ($I_{\text{falta}}$);
2. O **tempo de eliminação** da falta ($t$);
3. Portanto, a **energia térmica** $I^2 t$ imposta à tela metálica.

#### Tabela 6 — Aterramento do Sistema vs. Parâmetros de Falta

| Método de Aterramento | Magnitude da Falta $I_{\text{falta}}$ | Tempo de Eliminação $t$ Típico | Impacto na Tela |
|:---|:---|:---|:---|
| **Solidamente aterrado** | Elevada (kA) — limitada apenas pela impedância do sistema | $0{,}1\,\text{s}$ a $1{,}0\,\text{s}$ (proteção rápida) | $I^2 t$ **alto** — exige telas de seção robusta |
| **Aterrado por resistor (NGR)** | Limitada pelo resistor (tipicamente $200$–$800\,\text{A}$) | $0{,}5\,\text{s}$ a $10\,\text{s}$ (pode ser temporizada) | $I^2 t$ **moderado** — corrente baixa compensa tempo maior |
| **Neutro isolado** | Muito baixa (apenas correntes capacitivas, tipicamente $< 50\,\text{A}$) | Pode operar com a falta por **horas** se não detectada | $I^2 t$ potencialmente **alto** se houver dupla falta à terra |

> [!CAUTION]
> Em sistemas com **neutro isolado**, a primeira falta à terra pode não ser eliminada automaticamente. Se uma segunda falta ocorrer em outra fase antes da eliminação manual, a corrente resultante será uma falta **fase-fase através da terra**, com magnitude comparável à de um curto-circuito bifásico. Para esses sistemas:
> - O tempo $t$ deve considerar o **pior cenário operacional** (tempo de detecção + alarme + ação manual);
> - A tela deve ser dimensionada para suportar a corrente de dupla falta durante $t$ prolongado;
> - Recomenda-se adotar $t \geq 1{,}0\,\text{s}$ para cálculo conservativo.

#### 2.3.1 Diretrizes Práticas para $t$

| Cenário de Proteção | Tempo $t$ Recomendado para Cálculo |
|:---|:---:|
| Proteção diferencial (87) ou distância (21) | $0{,}1\,\text{s}$ a $0{,}3\,\text{s}$ |
| Sobrecorrente temporizada (51/51N) | $0{,}5\,\text{s}$ a $1{,}0\,\text{s}$ |
| Relé de terra restrito + NGR | $1{,}0\,\text{s}$ a $3{,}0\,\text{s}$ |
| Neutro isolado (primeira falta mantida) | $1{,}0\,\text{s}$ a $5{,}0\,\text{s}$ ¹ |

> ¹ O valor de $t$ deve ser acordado com a concessionária ou operador da rede. A IEC 60949 limita a validade da aproximação adiabática a $t \leq 5\,\text{s}$.

---

### 2.4 Fatores de Correção para Capacidade de Condução (IEC 60287)

A capacidade de condução em regime permanente ($I_z$) obtida de tabelas padronizadas refere-se a condições de referência específicas. Para instalações reais, aplica-se:

$$\boxed{I_{\text{admissível}} = I_z \cdot f_{\text{solo}} \cdot f_{\text{prof}} \cdot f_{\text{agrup}} \cdot f_{\text{temp}}}$$

Onde cada fator $f$ é $\leq 1{,}0$ (derating) ou $\geq 1{,}0$ (uprating) conforme a condição real.

---

#### 2.4.1 Fator de Correção — Resistividade Térmica do Solo ($f_{\text{solo}}$)

A resistividade térmica do solo ($\rho_{\text{solo}}$, em $\text{K}\cdot\text{m/W}$) é o parâmetro ambiental de **maior impacto** na ampacidade de cabos enterrados.

**Condição de referência padrão:** $\rho_{\text{ref}} = 1{,}0\;\text{K}\cdot\text{m/W}$ (solo úmido, argiloso)

#### Tabela 7 — Resistividade Térmica de Solos Típicos

| Tipo de Solo | $\rho_{\text{solo}}\;[\text{K}\cdot\text{m/W}]$ | Fator $f_{\text{solo}}$ Aproximado ¹ |
|:---|:---:|:---:|
| Solo muito úmido, saturado | $0{,}5$ – $0{,}7$ | $1{,}10$ – $1{,}20$ |
| Solo argiloso úmido | $0{,}7$ – $1{,}0$ | $1{,}00$ – $1{,}10$ |
| Solo arenoso seco | $1{,}0$ – $1{,}5$ | $0{,}85$ – $1{,}00$ |
| Solo muito seco / aterro | $1{,}5$ – $2{,}5$ | $0{,}70$ – $0{,}85$ |
| Rocha seca / concreto seco | $2{,}5$ – $3{,}5$ | $0{,}55$ – $0{,}70$ |

> ¹ Valores aproximados para orientação. O cálculo exato deve seguir a metodologia de IEC 60287-2-1, que resolve analiticamente a resistência térmica externa $T_4$ em função de $\rho_{\text{solo}}$, diâmetro do cabo e profundidade.

> [!TIP]
> Se a resistividade do solo não for conhecida por medição in-situ, adotar $\rho_{\text{solo}} = 1{,}5\;\text{K}\cdot\text{m/W}$ como valor conservativo para regiões tropicais com solo misto é prática comum de engenharia.

---

#### 2.4.2 Fator de Correção — Profundidade de Instalação ($f_{\text{prof}}$)

A profundidade de instalação ($D$, em metros, medida do centro do cabo à superfície) afeta a resistência térmica externa. Quanto mais profundo, menor a dissipação de calor.

**Condição de referência padrão:** $D_{\text{ref}} = 0{,}80\;\text{m}$ (típico para MT)

#### Tabela 8 — Fator de Profundidade (Cabo Unipolar em Trifólio)

| Profundidade $D\;[\text{m}]$ | $f_{\text{prof}}$ Aproximado |
|:---:|:---:|
| $0{,}50$ | $1{,}04$ |
| $0{,}60$ | $1{,}02$ |
| $0{,}80$ (ref.) | $1{,}00$ |
| $1{,}00$ | $0{,}98$ |
| $1{,}20$ | $0{,}96$ |
| $1{,}50$ | $0{,}93$ |
| $2{,}00$ | $0{,}89$ |

> [!NOTE]
> Para cálculo exato, a resistência térmica externa $T_4$ segundo IEC 60287-2-1 para um cabo diretamente enterrado é:
> $$T_4 = \frac{\rho_{\text{solo}}}{2\pi} \ln\!\left(\frac{2D}{D_e}\right)$$
> onde $D_e$ é o diâmetro externo do cabo. Esta fórmula demonstra a relação logarítmica entre profundidade e resistência térmica.

---

#### 2.4.3 Fator de Correção — Agrupamento de Circuitos ($f_{\text{agrup}}$)

Quando múltiplos circuitos compartilham a mesma vala, ocorre aquecimento mútuo. O fator de agrupamento depende de:

- **Número de circuitos**
- **Formação** (trifólio vs. plano)
- **Espaçamento** entre circuitos

##### Formação em Trifólio (Trefoil)

```
      ●
     / \
    ●───●
```

- Três cabos unipolares em triângulo equilátero (tocando ou com espaçamento)
- **Vantagem:** Simetria elétrica perfeita → cancela correntes induzidas na blindagem → elimina perdas por correntes circulantes
- **Desvantagem:** Pior dissipação térmica (centro do trifólio acumula calor)

##### Formação em Plano (Flat)

```
    ●───●───●
```

- Três cabos unipolares lado a lado, horizontalmente
- **Vantagem:** Melhor dissipação térmica individual (mais superfície exposta ao solo)
- **Desvantagem:** Assimetria de impedância → exige transposição de fases → induz correntes na blindagem

#### Tabela 9 — Fatores de Agrupamento para Cabos MT Diretamente Enterrados

| Nº de Circuitos | Trifólio (tocando) | Plano (tocando) | Plano (1 diâmetro de espaçamento) |
|:---:|:---:|:---:|:---:|
| $1$ | $1{,}00$ | $1{,}00$ | $1{,}00$ |
| $2$ | $0{,}80$ | $0{,}78$ | $0{,}82$ |
| $3$ | $0{,}70$ | $0{,}67$ | $0{,}72$ |
| $4$ | $0{,}63$ | $0{,}61$ | $0{,}66$ |
| $6$ | $0{,}55$ | $0{,}53$ | $0{,}59$ |

> [!IMPORTANT]
> Estes valores são orientativos. O cálculo preciso de agrupamento segundo IEC 60287 exige a resolução do campo térmico considerando as distâncias exatas entre centros dos cabos e suas imagens térmicas. Para mais de 3 circuitos ou geometrias não-padronizadas, recomenda-se o cálculo numérico via método dos elementos finitos (FEM).

---

#### 2.4.4 Fator de Correção — Temperatura Ambiente do Solo ($f_{\text{temp}}$)

A capacidade de condução é inversamente proporcional à temperatura ambiente do solo ($\theta_a$).

**Condição de referência padrão:** $\theta_{a,\text{ref}} = 20\,°\text{C}$

A correção é calculada por:

$$f_{\text{temp}} = \sqrt{\frac{\theta_{\max} - \theta_a}{\theta_{\max} - \theta_{a,\text{ref}}}}$$

Onde $\theta_{\max}$ é a temperatura máxima do condutor em regime ($90\,°\text{C}$ para XLPE/EPR).

#### Tabela 10 — Fator de Temperatura Ambiente do Solo (XLPE/EPR, $\theta_{\max} = 90\,°\text{C}$)

| $\theta_a\;[°\text{C}]$ | $f_{\text{temp}}$ |
|:---:|:---:|
| $10$ | $1{,}07$ |
| $15$ | $1{,}04$ |
| $20$ (ref.) | $1{,}00$ |
| $25$ | $0{,}96$ |
| $30$ | $0{,}93$ |
| $35$ | $0{,}89$ |
| $40$ | $0{,}85$ |
| $45$ | $0{,}80$ |

---

### 2.5 Exemplo Completo — Verificação de Seção do Condutor e Tela

#### Dados do Problema

| Parâmetro | Valor |
|:---|:---|
| Tensão nominal do sistema | $12/20\,(24)\;\text{kV}$ |
| Isolação do cabo | XLPE |
| Material do condutor | Cobre (Cu) |
| Corrente de curto-circuito no barramento | $I_{cc} = 16\;\text{kA}$ |
| Tempo de eliminação da falta (condutor) | $t = 1{,}0\;\text{s}$ |
| Material da tela | Cobre |
| Capa externa | PVC |
| Corrente de falta à terra (via tela) | $I_{\text{falta}} = 5{,}0\;\text{kA}$ |
| Tempo de eliminação da falta (tela) | $t_{\text{tela}} = 1{,}0\;\text{s}$ |

#### Resolução — Condutor

$$S_{\min} = \frac{I_{cc} \sqrt{t}}{k_{\text{Cu}}} = \frac{16\,000 \times \sqrt{1{,}0}}{143} = \frac{16\,000}{143} \approx 111{,}9\;\text{mm}^2$$

**→ Seção comercial mínima (IEC 60228):** $120\;\text{mm}^2$

#### Resolução — Tela Metálica

$$S_{\text{tela},\min} = \frac{I_{\text{falta}} \sqrt{t_{\text{tela}}}}{k_{\text{tela,PVC}}} = \frac{5\,000 \times \sqrt{1{,}0}}{115} = \frac{5\,000}{115} \approx 43{,}5\;\text{mm}^2$$

**→ Seção mínima da tela de cobre:** $\approx 44\;\text{mm}^2$ (selecionar tela com seção $\geq 50\;\text{mm}^2$ em projeto)

---

## 3. Regras de Consistência Física (QA)

As regras abaixo devem ser implementadas como **validações de pré-processamento** no módulo de cálculo. Qualquer input que viole essas regras deve ser bloqueado com mensagem de erro descritiva antes de qualquer computação.

### 3.1 Validação de Tensão e Isolação

| Regra | Condição de Bloqueio | Mensagem de Erro |
|:---|:---|:---|
| **QA-MT-001** | $U_0 < 3{,}6\;\text{kV}$ | `ERRO: Tensão U₀ inferior a 3,6 kV. Módulo de MT não aplicável — utilize o módulo de BT.` |
| **QA-MT-002** | $U_0 > 18\;\text{kV}$ (ou $U_m > 36\;\text{kV}$) | `ERRO: Tensão U₀ superior a 18 kV (Um > 36 kV). IEC 60502-2 não aplicável — consulte IEC 60840.` |
| **QA-MT-003** | Isolação PVC selecionada para $U_0 > 6\;\text{kV}$ | `ERRO: Isolação PVC não é aplicável em MT acima de 6 kV conforme IEC 60502-2. Utilize XLPE ou EPR.` |
| **QA-MT-004** | $U_0/U$ não corresponde a nenhuma classe da Tabela 3 | `ERRO: Combinação U₀/U não padronizada pela IEC 60502-2. Verifique a tensão nominal do sistema.` |

---

### 3.2 Validação de Parâmetros de Curto-Circuito

| Regra | Condição de Bloqueio | Mensagem de Erro |
|:---|:---|:---|
| **QA-MT-010** | $I_{cc} \leq 0\;\text{A}$ | `ERRO: Corrente de curto-circuito deve ser estritamente positiva.` |
| **QA-MT-011** | $I_{cc} > 100\;\text{kA}$ | `AVISO CRÍTICO: Corrente de curto-circuito superior a 100 kA é fisicamente improvável em redes de MT (6–30 kV). Verifique o valor informado.` |
| **QA-MT-012** | $t \leq 0\;\text{s}$ | `ERRO: Tempo de curto-circuito deve ser estritamente positivo.` |
| **QA-MT-013** | $t > 5{,}0\;\text{s}$ | `AVISO: Tempo de curto-circuito superior a 5 s invalida a aproximação adiabática (IEC 60949). Resultados podem ser não-conservativos.` |
| **QA-MT-014** | $t < 0{,}01\;\text{s}$ | `AVISO: Tempo de curto-circuito inferior a 10 ms é incomum. Verifique a coordenação da proteção.` |
| **QA-MT-015** | $I_{\text{falta}} > I_{cc}$ | `ERRO: Corrente de falta na tela não pode exceder a corrente de curto-circuito do sistema.` |

---

### 3.3 Validação de Parâmetros Térmicos e Ambientais

| Regra | Condição de Bloqueio | Mensagem de Erro |
|:---|:---|:---|
| **QA-MT-020** | $\theta_a < -20\,°\text{C}$ | `AVISO: Temperatura ambiente do solo inferior a -20°C é incomum. Verifique as condições climáticas locais.` |
| **QA-MT-021** | $\theta_a \geq \theta_{\max}$ (i.e., $\theta_a \geq 90\,°\text{C}$ para XLPE) | `ERRO: Temperatura ambiente do solo ≥ temperatura máxima do condutor. Dissipação de calor impossível.` |
| **QA-MT-022** | $\rho_{\text{solo}} \leq 0$ | `ERRO: Resistividade térmica do solo deve ser estritamente positiva.` |
| **QA-MT-023** | $\rho_{\text{solo}} > 5{,}0\;\text{K}\cdot\text{m/W}$ | `AVISO CRÍTICO: Resistividade do solo > 5,0 K·m/W é extremamente alta (solo completamente desidratado ou rocha maciça). Considere tratamento do solo ou rota alternativa.` |
| **QA-MT-024** | $D < 0{,}30\;\text{m}$ | `ERRO: Profundidade de instalação inferior a 0,30 m viola requisitos mínimos de proteção mecânica para cabos MT.` |
| **QA-MT-025** | $D > 5{,}0\;\text{m}$ | `AVISO: Profundidade de instalação superior a 5,0 m é incomum para cabos MT. Verifique se não se trata de túnel ou galeria técnica.` |

---

### 3.4 Validação de Geometria e Seção

| Regra | Condição de Bloqueio | Mensagem de Erro |
|:---|:---|:---|
| **QA-MT-030** | $S < 10\;\text{mm}^2$ | `ERRO: Seção do condutor inferior a 10 mm² não é padronizada para cabos MT (IEC 60228).` |
| **QA-MT-031** | $S > 1\,200\;\text{mm}^2$ | `AVISO: Seção superior a 1200 mm² excede as seções padronizadas pela IEC 60502-2. Verifique se o cabo está disponível comercialmente.` |
| **QA-MT-032** | $S_{\text{tela}} < 6\;\text{mm}^2$ | `ERRO: Seção da tela metálica inferior a 6 mm² é insuficiente para suportar correntes de falta em MT.` |
| **QA-MT-033** | $S_{\text{tela}} > S_{\text{condutor}}$ | `AVISO: Seção da tela metálica superior à do condutor principal é incomum. Verifique os dados de entrada.` |
| **QA-MT-034** | Número de circuitos $\leq 0$ | `ERRO: Número de circuitos deve ser ≥ 1.` |
| **QA-MT-035** | Número de circuitos $> 20$ | `AVISO: Agrupamento de mais de 20 circuitos exige análise térmica detalhada (FEM). Fatores tabelados podem ser imprecisos.` |
| **QA-MT-036** | Comprimento do circuito $\leq 0\;\text{m}$ | `ERRO: Comprimento do circuito deve ser estritamente positivo.` |
| **QA-MT-037** | Comprimento do circuito $> 50\,000\;\text{m}$ | `AVISO: Comprimento > 50 km é atípico para redes MT. Considere a necessidade de compensação reativa e análise de queda de tensão detalhada.` |

---

### 3.5 Validação de Consistência Cruzada

| Regra | Condição de Bloqueio | Mensagem de Erro |
|:---|:---|:---|
| **QA-MT-040** | $S_{\min} > 1\,200\;\text{mm}^2$ (resultado calculado) | `AVISO CRÍTICO: A seção mínima calculada excede 1200 mm². Considere: (a) limitar Icc na fonte, (b) reduzir t via proteção mais rápida, (c) utilizar cabos em paralelo.` |
| **QA-MT-041** | $I_{\text{admissível}}$ calculada $< I_b$ (corrente de projeto) | `ERRO: Capacidade de condução corrigida é inferior à corrente de projeto. Necessário: (a) aumentar a seção, (b) melhorar condições de instalação, (c) reduzir carga.` |
| **QA-MT-042** | $f_{\text{solo}} \times f_{\text{prof}} \times f_{\text{agrup}} \times f_{\text{temp}} < 0{,}30$ | `AVISO CRÍTICO: Fator de correção combinado < 0,30 indica condições de instalação extremamente desfavoráveis. Resultados podem ser impraticáveis — reconsidere a rota ou método de instalação.` |
| **QA-MT-043** | Classe de tensão do cabo < tensão nominal do sistema | `ERRO: A classe de isolação do cabo é inferior à tensão nominal do sistema. Risco de ruptura dielétrica.` |

---

## Referências Normativas

1. **IEC 60502-2:2014** — Power cables with extruded insulation and their accessories for rated voltages from 1 kV (Um = 1,2 kV) up to 30 kV (Um = 36 kV) — Part 2: Cables for rated voltages from 6 kV (Um = 7,2 kV) up to 30 kV (Um = 36 kV).
2. **IEC 60986:2000** — Short-circuit temperature limits of electric cables with rated voltages from 6 kV (Um = 7,2 kV) to 30 kV (Um = 36 kV).
3. **IEC 60949:1988** — Calculation of thermally permissible short-circuit currents, taking into account non-adiabatic heating effects.
4. **IEC 60287-1-1:2023** — Electric cables — Calculation of the current rating — Part 1-1: Current rating equations (100% load factor) and calculation of losses — General.
5. **IEC 60287-2-1:2023** — Electric cables — Calculation of the current rating — Part 2-1: Thermal resistance — Calculation of thermal resistance.
6. **IEC 60228:2004** — Conductors of insulated cables.
7. **IEC 61936-1:2021** — Power installations exceeding 1 kV AC — Part 1: Common rules.

---

> **Nota Final:** Este documento constitui a base de conhecimento técnica para o módulo de Dimensionamento de Cabos de Média Tensão do AmpAI. As equações, limites e validações aqui descritas devem ser implementadas literalmente no runtime de cálculo. Qualquer desvio ou simplificação deve ser documentado e aprovado pelo Engenheiro Eletricista Sênior.
