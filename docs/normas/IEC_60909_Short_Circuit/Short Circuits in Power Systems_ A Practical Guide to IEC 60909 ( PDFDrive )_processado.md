# Short Circuits in Power Systems — A Practical Guide to IEC 60909

> **Ismail Kasikci.** Wiley-VCH Verlag GmbH, Weinheim, Germany, 2002. ISBN 3-527-30482-7.
> Secondary reference (textbook) aligned with IEC 60909. This cleaned text removes the per-page "Página" extraction markers, running headers/footers (chapter title + page number), publisher front-matter boilerplate, the Portuguese cover-image description and the blank-page descriptions. Spurious `## ` prefixes that had been attached to equation delimiters ($$), \tag macros, table rows and blockquotes were stripped so that mathematics and tables render correctly. Technical wording is preserved verbatim.

## Foreword
This book is the result of many years of professional activity in the area of power supply, teaching
at the VDE, as well as at the Technical academy in Esslingen and at the Master Trade School in
Heidelberg. Every planner of electrical systems is obligated today to calculate the single-pole or
three-pole short circuit current before and after the project management phase. IEC 60 909 is
internationally recognized and used. This standard will be discussed in the present book on the
basis of fundamental principles and technical references, thus permitting a summary of the
standard in the *simplest* and *most understandable* way possible. The rapid development in all
areas of technology is also reflected in the improvement and elaboration of the regulations, in
particular in regard to IEC 60 909. Every system installed must not only be suitable for normal
operation, but must also be designed in consideration of fault conditions and must remain
undamaged following operation under normal conditions and also following a fault condition.
Electrical systems must therefore be designed so that neither persons nor equipment are
endangered. The dimensioning, cost effectiveness and safety of these systems depends to a great
extent on being able to control short circuit currents. With increasing power of the installation, the

importance of calculating short circuit currents has also increased accordingly. Short circuit current
calculation is a prerequisite for the correct dimensioning of operational electrical equipment,
controlling protective measures and stability against short circuits in the selection of equipment.
Solutions to the problems of selectivity, back-up protection, protective equipment and voltage
drops in electrical systems will not be dealt with in this book. The reduction
Part 5 gives an overview of the network types for low and medium voltage.
Part 6 describes the systems (network types) in the low voltage network IEC 60 354 Part 30 with
the cut-off conditions.
Part 7 illustrates the types of neutral point treatment in three-phase networks.
Part 8 discusses the impedances of three-phase operational equipment along with relevant data,
tables, diagrams and characteristic curves.
Part 9 presents the impedance corrections for generators, power substation transformers and
distribution transformers.
Part 10 is concerned with the method of symmetrical components. With the exception of the
three-pole short circuit current, all other fault currents are unsymmetrical. The calculation of these
currents is not possible in the positive-sequence system. The method of symmetrical components
is therefore described here.
Part 11 is devoted to the calculation of short circuit types.
Part 12 discusses the contribution of high and low voltage motors to the short circuit current.
Part 13 deals with the subject of mechanical and thermal stresses in operational equipment as the
result of short circuit currents.
Part 14 gives an overview of the design values for short circuit current strength.
Part 15 is devoted to the most important overcurrent protection devices, with time-current
characteristics.
Part 16 gives a brief overview of the procedure for calculating short circuit currents in DC systems.
Part 17 gives a list of programs for the calculation of short circuit currents.
Part 18 represents a large number of examples taken from practice which enhance the
understanding of the theoretical foundations. A large number of diagrams and tables required for
calculation simplify the application of the IEC 60 909 standard as well as the calculation of short
circuit currents and therefore shorten the time necessary to carry out the planning of electrical
systems.

In the appendices two software programs are introduced to carry out simplified short circuit
calculations (appended to this book as a CD ROM).
I am especially indebted to Professor B. Müller of the University of Applied Sciences for Technique
and Economics Berlin for critically reviewing the manuscript and for valuable suggestions.
I also wish to thank Siemens AG for their friendly support in the compilation of data and diagrams
for switchgear, as well as for permission to include the program KUBS plus, developed by Siemens
as an aid in the calculation of short circuit currents and in the selection of circuit breakers, and
Elektra Soft for the calculation tools for electrical engineering, with this book.
At this point I would also like to express my gratitude to all those colleagues who supported me
with their ideas, criticism, suggestions and corrections. My heartiest appreciation is due to Eva E.
Wille, Anette Eckerle, Maike Petersen, Hans-Jochen Schnitt and Michael Baer for their excellent
cooperation and their support in the publication of this book. Furthermore, I welcome every
suggestion, criticism and idea regarding the use of this book from those who read the book.
Finally, without the support of my wife this book could never have been written. In recognition of
all the weekends and evenings I sat at the computer, I dedicate this book to my family.
*Ismail Kasikci*
# Contents
**Foreword** *V*
**Symbols and Indices** *XIII*
| **1** | **Terms and Definitions** *1* |
|---|---|
| 1.1 | Time behavior of the short circuit current *3* |
| 1.2 | Short circuit path in the positive-sequence system *4* |
| 1.3 | Classification of short circuit types *5* |
| 1.4 | Methods of short circuit calculation *7* |
| 1.4.1 | Equivalent voltage source *7* |
| 1.4.2 | Superposition method *9* |
| 1.4.3 | Transient calculation *10* |
| 1.5 | Calculating with reference variables *10* |

| **2** | **General Information About IEC 60 909** *11* |
|---|---|
| **3** | **The Significance of IEC 60 909** *13* |
|---|---|
| **4** | **Supply Networks** *17* |
|---|---|
| 4.1 | Calculation variables for supply networks *17* |
| 4.2 | Lines supplied from a single source *17* |
| 4.3 | Radial networks *18* |
| 4.4 | Ring networks *18* |
| 4.5 | Meshed networks *19* |
| **5** | **Network Types for the Calculation of Short Circuit Currents** *21* |
|---|---|
| 5.1 | Low voltage network types *21* |
| 5.2 | Medium voltage network types *23* |
| **6** | **Systems up to 1 kV** *29* |
|---|---|
| 6.1 | TN systems *29* |
| 6.2 | Calculation of fault currents *31* |
| 6.3 | TT systems *34* |
x | *Contents*
6.4 IT systems *35*
6.5 Transformation of the network types described to equivalent circuit diagrams *36*
**7** **Neutral Point Treatment in Three-phase Networks** *39*
7.1 Networks with isolated free neutral point *42*
7.2 Networks with grounding compensation *43*
7.3 Networks with low impedance neutral point treatment *44*
**8** **Impedances of Three-phase Operational Equipment** *47*
8.1 Network feed-ins *47*
8.2 Synchronous machines *49*
## 8.3 Transformers *51*
8.3.1 Short circuit current on the secondary side *52*
8.3.2 Voltage regulating transformers *57*
8.4 Cables and overhead lines *58*
8.5 Short circuit current limiting *70*
8.6 Asynchronous machines *71*
8.7 Consideration of capacitors and non-rotating loads *72*
8.8 Consideration of static converters *73*

**9** **Impedance Corrections** *75*
9.1 Correction factor K$_\text{G}$ for generators *76*
9.2 Correction factor K$_\text{KW}$ for power plant block *77*
9.3 Correction factor K$_\text{T}$ for transformers with two and three windings *79*
**10** **The Method of Symmetrical Components** *81*
10.1 Symmetrical components *82*
10.2 Impedances of symmetrical components *85*
**11** **Calculation of Short Circuit Currents** *91*
11.1 Three-pole short circuits *91*
11.2 Two-pole short circuits with contact to ground *93*
11.3 Two-pole short circuit without contact to ground *93*
11.4 Single-pole short circuits to ground *94*
11.5 Peak short circuit current $i_p$ *97*
11.6 Symmetrical breaking current $I_a$ *99*
11.7 Steady state short circuit current $I_k$ *102*
**12** **Motors in three-phase Networks** *105*
12.1 Short circuits at the terminals of asynchronous motors *105*
12.2 Motor groups supplied from transformers with two windings *107*
12.3: Motor groups supplied from transformers with different nominal voltages *107*
**13** **Mechanical and Thermal Short Circuit Strength** *111*
13.1 Mechanical short circuit current strength *111*
13.2 Thermal short circuit current strength *112*
13.3 Limitation of short circuit currents *120*
**14** **Calculations for Short Circuit Strength** *127*
14.1 Short circuit strength for medium voltage switchgear *127*
14.2 Short circuit strength for low voltage switchgear *128*
**15** **Equipment for Overcurrent Protection** *131*
**16** **Short Circuit Currents in DC Systems** *143*
16.1 Resistances of line sections *145*
16.2 Current converters *146*
## 16.3 Batteries *147*
## 16.4 Capacitors *148*
16.5 DC motors *149*
**17** **Programs for the Calculation of Short Circuit Currents** *151*

**18** **Examples: Calculation of Short Circuit Currents** *153*
18.1 Example 1: Radial network *153*
18.2 Example 2: Proof of protective measures *155*
18.3 Example 3: Connection box to service panel *158*
18.4 Example 4: Transformers in parallel *159*
18.5 Example 5: Connection of a motor *160*
18.6 Example 6: Calculation for a load circuit *162*
18.7 Example 7: Calculation for an industrial system *164*
18.8 Example 8: Calculation of three-pole short circuit current and peak short circuit current *166*
18.9 Example 9: Meshed network *168*
18.10 Example 10: Supply to a factory *171*
18.11 Example 11: Calculation with impedance corrections *172*
18.12 Example 12: Connection of a transformer through an external network and a generator
*176*
18.13 Example 13: Motors in parallel and their contributions to the short circuit current *177*
18.14 Example 14: Proof of the stability of low voltage systems *180*
18.15 Example 15: Proof of the stability of medium and high voltage systems *182*
18.16 Example 16: Calculation for short circuit currents with impedance corrections *193*
18.17 Example 17: Calculation with per-unit magnitudes *195*
**Appendices**
**Calculation Tools for Electrical Engineering** *197*
**1** The Elaplan program *199*
**2** The KUBS plus Program *251*
**Index** *261*
# Symbols and Indices
| Symbol | Definition |
|---|---|
| $A$ | Initial value of DC aperiodic component |
| $A$ | Cross-section of conductor |
| $a$ | Center-to-center distance between conductors |
| $\underline{a}, \underline{a}^2$ | Rotational operators |
| $b$ | Width of rectangular conductor |
| $c$ | Voltage factor |
| $C$ | Capacitance |
| $E$ | Internal voltage of voltage source; source voltage |
| $E_B$ | No-load voltage of battery |
| $E''$ | Subtransient voltage of synchronous machine |

| $f$ | Frequency |
| $h$ | Height of conductor |
| $L'$ | Distributed inductance |
| $I_a$ | Cut-off current |
| $I_{an}$ | Starting current |
| $I_b$ | Operating current |
| $I_k$ | Steady state short circuit current |
| $I_k''$ | Initial symmetrical short circuit current |
| $I_{k1}''$ | Single-pole short circuit current |
| $I_{k2}''$ | Two-pole short circuit current |
| $I_{k3}''$ | Three-pole short circuit current |
| $I_{k2E}''$ | Two-pole short circuit with contact to ground |
| $I_{kEE}''$ | Double ground fault |
| $I_{ma}$ | Rated short circuit making current |
| $I_n$ | Nominal current of protective equipment |
| $i_p$ | Peak short circuit current |
| $I_r$ | Rated current |
| $I_{rM}$ | Magnetic setting current |
| $I_{sc}$ | Rated short circuit breaking current |
| $I_{cm}$ | Rated short circuit making current |
| $I_{cu}$ | Rated short circuit breaking current |
| $I_{th}$ | Rated short-time current |
| $K$ | Correction factor |
| Symbol | Description |
|---|---|
| $L_B$ | Inductance of battery |
| $L_{BBr}$ | Total inductance of battery |
| $L_{BL}$ | Inductance of a battery conductor |
| $L_C$ | Inductance of capacitor |
| $L_{CBr}$ | Total inductance of capacitor |
| $L_{CL}$ | Inductance of a capacitor conductor |
| $L_{CY}$ | Inductance of coupling branch for capacitor |
| $L_{DL}$ | Inductance of conductor in converter arm |
| $L_M$ | Inductance of DC motor |
| $L_{MBr}$ | Total inductance of DC motor |
| $L_{ML}$ | Inductance of a DC motor conductor |
| $L_s$ | Inductance of saturated choke coil |
| $L_Y$ | Inductance of coupling branch |
| $m$ | Decaying DC aperiodic component |
| $M_r$ | Rated-load torque of motor |
| $n$ | Decaying AC component |

| $p$ | Pole-pair of asynchronous motor |
| $p$ | Ratio $I_k/I_p$ |
| $P$ | Effective power |
| $P_{krT}$ | Transformer winding losses |
| $P_T$ | Transformation ratio of transformer |
| $Q$ | Idle power |
| $r$ | Resistance, conductor radius, absolute or relative value |
| $R$ | Resistance |
| $R_l$ | Resistance of conductor |
| $R'$ | Resistance per unit length |
| $R_{BL}$ | Resistance of battery conductor |
| $R_s$ | Resistance of saturated choke coil |
| $R_Y$ | Resistance of coupling branch |
| $R_{BY}$ | Resistance of battery coupling branch |
| $R_C$ | Resistance of capacitor |
| $R_{CBr}$ | Total resistance of capacitor |
| $R_{CL}$ | Resistance of a capacitor conductor |
| $R_{DL}$ | Resistance of conductor in converter arm |
| $R_M$ | Resistance of DC motor |
| $R_{ML}$ | Resistance of DC motor conductor |
| $R_{MY}$ | Resistance of DC motor coupling branch |
| $S$ | Apparent power, cross-section |
| $S_k''$ | Initial symmetrical short circuit power |
| $t$ | Time |
| $T_k$ | Duration of short circuit |
| $t_p$ | Time until onset of peak short circuit current |
| $U_{NB}$ | Nominal voltage of battery |
| $U_{rM}$ | Rated voltage of DC motor |
| $u_{Rr}$ | Rated value for resistive voltage drop in % |
*Symbols and Indices* **| XV**
$u_{kr}$ - Rated value for short circuit voltage in %
$\underline{Z}_k$ - Short circuit impedance of network
$X$ - Reactance
$x''_d$ - Subtransient reactance of synchronous motor
$Z$ - Impedance
$Z_1$ - Positive-sequence impedance
$Z_2$ - Negative-sequence impedance

$Z_0$ - Zero-sequence impedance
$\varphi$ - Phase angle
$\varepsilon$ - Coefficient of grounding
$\mu$ - Factor for calculation of symmetrical breaking current
$\lambda$ - Factor for calculation of steady state short circuit current
$\mu_0$ - Absolute permeability in vacuum
$\kappa$ - Withstand ratio
$\eta$ - Efficiency of AC motor
$\rho$ - Specific resistance
$\delta$ - Decay coefficient, ground fault factor
**Ψ** - Angular velocity
**Indices**
$a$ - Cut-off
$A, B, C$ - Description of position, e.g. bus bar
$B$ - Battery
$B_r$ - Battery branch
$a.c. : AC$ - AC current
$AMZ$ - Maximum current-dependent time relay
$ASM$ - Asynchronous machine
$C$ - Capacitor
$D$ - Converter
$d.c. : DC$ - DC current
$E$ - Ground
$F$ - Short circuit position

$G$ - Generator
$HV$ - High voltage
$i$ - Internal
$K$ - Cable
$k$ - Short circuit
$k1$ - Single-pole short circuit current
$k2$ - Two-pole short circuit current
$k2E$ - Two-pole short circuit with contact to ground
$k3$ - Three-pole short circuit current
$kEE$ - Double ground fault
| Symbol | Description |
|---|---|
| $l$ | Length |
| $L$ | Conductor |
| $L_1, L_2, L_3$ | External conductor |
| $LV$ | Low voltage |
| $M$ | Motor |
| *max* | Maximum |
| *min* | Minimum |
| $MV$ | Medium voltage |
| $n$ | Nominal value |
| $N$ | Neutral conductor, network |
| $OPE$ | Overcurrent protective equipment |
| $OV$ | Overvoltage |
| $pS$ | Limiting dynamic value |
| $PE$ | Protective ground conductor |
| $Q$ | Network connection point |
| $r$ | Rated value |
| $S$ | Smoothing choke |
| $SP$ | Connection box to on-site power |
| $T$ | Transformer |
| $UMZ$ | Maximum current-independent time relay |
| $UV$ | Undervoltage |
| *1* | Component of positive-phase system |
| *2* | Component of negative-phase system |

| *0* | Component of zero-phase system |
**Secondary symbols, upper right, left**
| Symbol | Description |
|---|---|
| $''$ | Subtransient value |
| $'$ | Transient value |
| $'$ | Resistance or reactance per unit length |
| $*$ | Relative magnitude |
# 1
# Terms and Definitions
The following terms and definitions correspond largely to those defined in IEC 60 909. Refer to this
standard for all terms not used in this book.
The terms short circuit and ground fault describe faults in the isolation of operational equipment
which occur when live parts are shunted out as a result.
- Causes:
- Overtemperatures due to excessively high overcurrents.
- Disruptive discharges due to overvoltages.
- Arcing due to moisture together with impure air, especially on insulators.
- Effects:
- Interruption of power supply.
- Destruction of system components.
- Development of unacceptable mechanical and thermal stresses in electrical operational
equipment.
- Short circuit:
According to IEC 60 909, a short circuit is the accidental or intentional conductive connection
through a relatively low resistance or impedance between two or more points of a circuit which are
normally at different potentials.
- Short circuit current:
According to IEC 60 909, a short circuit current results from a short circuit in an electrical network.
It is necessary to differentiate here between the short circuit current at the position of the short
circuit and the transferred short circuit currents in the network branches.
- Initial symmetrical short circuit current:
This is the effective value of the symmetrical short circuit current at the moment at which the short
circuit arises, when the short circuit impedance has its value from the time zero.
- Initial symmetrical short circuit apparent power:
The short circuit power represents a fictitious parameter. During the planning of networks, the
short circuit power is a suitable characteristic number.

- Peak short circuit current:
The largest possible momentary value of the short circuit occurring.
- Steady state short circuit current:
Effective value of the initial symmetrical short circuit current remaining after the decay of all
transient phenomena.
- DC aperiodic component:
Average value of the upper and lower envelope curve of the short circuit current, which slowly
decays to zero.
- Symmetrical breaking current:
Effective value of the short circuit current which flows through the contact switch at the time of the
first contact separation.
- Equivalent voltage source:
The voltage at the position of the short circuit, which is transferred to the positive-sequence
system as the only effective voltage and is used for the calculation of the short circuit currents.
- Superposition method:
The superposition method considers the previous load of the network before the occurrence of the
short circuit. It is necessary to know the load flow and the setting of the transformer step switch.
- Voltage factor:
Ratio between the equivalent voltage source and the network voltage $U_n$, divided by
$\sqrt{3}$.
- Equivalent electrical circuit:
Model for the description of the network by an equivalent circuit.
- Far-from-generator short circuit:
The value of the symmetrical AC periodic component remains essentially constant.
- Near-to-generator short circuit:
The value of the symmetrical AC periodic component does not remain constant. The synchronous
machine first delivers an initial symmetrical short circuit current which is larger than twice the
rated current of the synchronous machine.
- Positive-sequence short circuit impedance:
The impedance of the positive-sequence system as seen from the position of the short circuit.
- Negative-sequence short circuit impedance:
The impedance of the negative-sequence system as seen from the position of the short circuit.
- Zero-sequence short circuit impedance:
The impedance of the
**1.1**
**Time behavior of the short circuit current**
Figure 1.1 shows the time behavior of the short circuit current for the occurrence of
far-from-generator and near-to-generator short circuits.

> **Fig. 1.1 - Time behavior of the short circuit current [1], [35]**
>
> Two waveform plots (a and b) illustrating the short circuit current as a function of time, each
displaying a damped oscillatory waveform with the following features:
>
> **Plot a) - Far-from-generator short circuit:**
> - The vertical axis is labeled "Current" and the horizontal axis is labeled "Time (t)".
> - The waveform starts with a large initial peak amplitude of $2\sqrt{2}\, I_k''$ and oscillates
sinusoidally.
> - An upper envelope curve (dashed) starts at $2\sqrt{2}\, I_k''$ and remains approximately
constant (flat), converging to a steady-state amplitude of $2\sqrt{2}\, I_k = 2\sqrt{2}\, I_k''$ at the
right side.
> - A lower envelope curve (dashed) mirrors the upper envelope symmetrically below the time axis.
> - The peak short circuit current $i_p$ is indicated at the first peak.
> - The decaying DC aperiodic component $i_{DC}$ is shown as a decaying curve riding between the
oscillations and the upper envelope.
> - The initial value of the DC aperiodic component is labeled $A$.
> - Since this is a far-from-generator fault, the envelope amplitude remains essentially constant
throughout, meaning the AC component does not decay.
>
> **Plot b) - Near-to-generator short circuit:**
> - The vertical axis is labeled "Current" and the horizontal axis is labeled "Time (t)".
> - The waveform also starts with a large initial peak amplitude of $2\sqrt{2}\, I_k''$.
> - The upper envelope curve (dashed) starts at $2\sqrt{2}\, I_k''$ and decays over time, converging
to a lower steady-state value of $2\sqrt{2}\, I_k$ (where $I_k < I_k''$), indicating decay of the AC
component due to subtransient and transient behavior of synchronous machines.
> - A lower envelope curve (dashed) mirrors the upper envelope symmetrically below the time axis,
also decaying.
> - The peak short circuit current $i_p$, the DC component $i_{DC}$, and its initial value $A$ are
indicated similarly to plot a).
> - The overall envelope decays significantly, reflecting the influence of subtransient and transient
reactances of nearby generators.
**Fig. 1.1:** Time behavior of the short circuit current [1], [35]
a) far-from-generator short circuit, b) near-to-generator short circuit
- $I_k''$: Initial symmetrical short circuit current
- $i_p$: Peak short circuit current
- $i_{DC}$: Decaying DC aperiodic component
- $A$: Initial value of DC aperiodic component
The DC aperiodic component depends on the point in time at which the short circuit occurs. For a
near-to-generator short circuit, the subtransient and the transient behavior of the synchronous
machines is important. Following the decay of all transient phenomena, the steady state sets in.

## 1.2
**Short circuit path in the positive-sequence system**
For the same external conductor voltages, a three-pole short circuit allows three currents of the
same magnitude to develop between the three conductors. It is therefore only necessary to
consider one conductor in further calculations. Depending on the distance from the position of the
short circuit from the generator, here it is necessary to consider near-to-generator and
far-from-generator short circuits separately. For far-from-generator and near-to-generator short
circuits, the short circuit path can be represented by a mesh diagram with AC voltage source,
reactances X and resistances R (Figure 1.2). Here, X and R replace all components such as cables,
conductors, transformers, generators and motors.
> **[Figure description - Fig. 1.2: Equivalent circuit of the short circuit current path in the
positive-sequence system]**
> The diagram shows a series RLC-type equivalent circuit representing the short circuit current path
in the positive-sequence system. On the left side, an AC voltage source is shown with the
instantaneous voltage $u = \sqrt{2}\, U \sin\omega t$. In series with this source, there are two
elements along the top branch: a resistance $R_k$ (represented as a rectangular box) and a
reactance $X_k$ (represented as an inductor/coil symbol). A node between these series elements
and the load branch is labeled with current $i_k$ (flowing downward through a switch/closing
contact S). On the right side of the circuit, there is a parallel load branch consisting of a resistance
$R$ (rectangular box) in series with a reactance $X$ (coil symbol), through which a current $i_b$
flows. The circuit forms a closed loop, representing the Thevenin equivalent of the network seen
from the fault point.
**Fig. 1.2:** Equivalent circuit of the short circuit current path in the positive-sequence system
The following differential equation can be used to describe the short circuit process:
$$i_k \cdot R_k + L_k \frac{di_k}{dt} = \hat{u} \cdot sin(\omega t + \psi), \tag{1.1}$$
where $\psi$ is the phase angle at the point in time of the short circuit. This assumes that the
current before S closes (short circuit) is zero. The inhomogeneous first order differential equation
can be solved by determining the homogeneous solution $i_k$ and a particular solution $i''_k$.
$$i_k = i''_{k\sim} + i_{k-} \tag{1.2}$$
The homogeneous solution, with the time constant $\tau_g$ = L/R, solution yields:
$$i_k = \frac{-\hat{u}}{\sqrt{(R^2 + X^2)}}\, e^{\frac{t}{\tau_g}} \sin(\psi - \varphi_k). \tag{1.3}$$
1.3 Classification of short circuit types **5**
For the particular solution, we obtain:

$$i_k'' = \frac{-\hat{u}}{\sqrt{(R^2 + X^2)}} \sin(\omega t + \psi - \varphi_k). \tag{1.4}$$
The total short circuit current is composed of both components:
$$i_k = \frac{-\hat{u}}{\sqrt{(R^2 + X^2)}} \left[ \sin(\omega t + \psi - \varphi_k) - e^{\frac{t}{T_g}}
\sin(\psi - \varphi_k) \right]. \tag{1.5}$$
The phase angle of the short circuit current (short circuit angle) is then, in accordance with the
above equation,
$$\varphi_k = \psi - \nu = \arctan \frac{X}{R}. \tag{1.6}$$
For the far-from-generator short circuit, the short circuit current is therefore made up of a constant
AC periodic component and the decaying DC aperiodic component. From the simplified
calculations, we can now reach the following conclusions:
- The short circuit current always has a decaying DC aperiodic component in addition to the
stationary AC periodic component.
- The magnitude of the short circuit current depends on the operating angle of the current. It
reaches a maximum at $\gamma = 90°$ (purely inductive load). This case serves as the basis for
further calculations.
- The short circuit current is always inductive.
## 1.3
**Classification of short circuit types**
For a three-pole short circuit, three voltages at the position of the short circuit are zero. The
conductors are loaded symmetrically. It is therefore sufficient to calculate only in the
positive-sequence system. The two-pole short circuit current is less than that of the three-pole
short circuit, but larger close to synchronous machines. The single-pole short circuit current occurs
most frequently in low voltage networks with solid grounding. The double ground connection
occurs in networks with a free neutral point or with a ground fault neutralizer grounded system.
For the calculation of short circuit currents, it is necessary to differentiate between the
far-from-generator and the near-to-generator cases.
- Far-from-generator short circuit
When double the rated current is not exceeded in any machine, we speak of a far-from-generator
short circuit.
$$I_k'' < 2 \cdot I_{rG} \tag{1.7}$$
or also when
$$I_k'' = I_a = I_k. \tag{1.8}$$

- Near-to-generator short circuit
When the value of the initial symmetrical short circuit current $I''_k$ exceeds double the rated
current in at least one synchronous or asynchronous machine at the time at which the short circuit
occurs, we speak of a near-to-generator short circuit.
$$I''_k > 2 \cdot I_{rG} \tag{1.9}$$
or also when
$$I''_k > I_a > I_k. \tag{1.10}$$
Figure 1.3 schematically illustrates the most important types of short circuits in three-phase
networks.
> **[FIGURE DESCRIPTION - Fig. 1.3: Types of faults]**
>
> The figure contains two diagrams illustrating various types of short-circuit faults in three-phase
networks:
>
> **Upper diagram (cases a, b, c, d):**
> A three-phase system is shown with a MV/LV transformer on the left (medium voltage to low
voltage), connected to five conductors: L1, L2, L3, N, and PE. A ground resistance $R_B$ is shown at
the bottom left. Four fault scenarios are depicted:
> - **a) Three-pole short circuit ($I''_{k3}$):** All three phase conductors L1, L2, L3 are connected
together (bolted three-phase fault).
> - **b) Two-pole short circuit ($I''_{k2}$):** Two phase conductors (e.g., L1 and L2) are connected
together without contact to ground.
> - **c) Single-pole short circuit between conductors L2-N ($I''_{k1}$):** One phase conductor is
connected to the neutral conductor N.
> - **d) Single-pole short circuit between L1-PE ($I''_{k1min}$, $I_F$, $I_a$):** One phase
conductor is connected to the protective earth conductor PE.
>
> **Lower diagram (cases e, f, g):**
> Three additional fault scenarios involving ground connections are shown across conductors L1,
L2, L3, with a notation "Distance > 0" indicating faults at different physical locations:
> - **e) Two-pole short circuit with contact to ground ($I''_{k2EL1}$, $I''_{k2EL2}$, $I''_{kE2E}$):**
A two-pole fault where both faulted phases also have contact to ground at different points.
> - **f) Double ground connection ($I''_{kEE}$):** Two separate single-phase-to-ground faults
occurring simultaneously at different locations on two different phases.
> - **g) Single-pole short circuit to ground ($I''_{k1}$, $I''_{kEE}$):** A single conductor faulted to
ground.
>
> All fault currents are labeled with their respective symbols at the fault points, with arrows
indicating the direction of fault current flow toward ground or between conductors.
**Fig. 1.3:** Types of faults
a) three-pole short circuit, b) two-pole short circuit without contact to ground, c) single-pole short

circuit between conductors L2-N, d) single-pole short circuit between L1-PE, e) two-pole short
circuit with contact to ground, f) double ground connection, g) single-pole short circuit to ground
- Three-pole short circuits:
- Connection of all conductors with or without simultaneous contact to ground
- Symmetrical loading of the three external conductors
- Calculation only according to single pole.
- Two-pole short circuits:
- Unsymmetrical loading
- All voltages non-zero
- Coupling between external conductors
- For a near-to-generator short circuit $I''_{k2} > I''_{k3}$.
- Single-pole short circuits:
- Very frequent occurrence in low voltage networks.
- Two-pole short circuits:
- In networks with free neutral point or with ground fault neutralizer grounded system $I''_{kEE} <
I''_{k2E}$
- The leakage current flowing to ground is a capacitive ground fault current and is called $I_C$
- With a ground fault neutralizer grounded system a residual ground fault current $I_{Rest}$ occurs
- $I_C$ and $I_{Rest}$ are special cases of $I''_{k1}$.
**1.4**
**Methods of short circuit calculation**
The short circuit currents in three-phase systems can be determined by three different
calculational procedures:
- Calculating with the equivalent voltage source $\frac{c \cdot U_n}{\sqrt{3}}$ at the fault location
- Superposition method for a defined load flow case
- Transient calculation.
## 1.4.1
**Equivalent voltage source**
The equivalent voltage source will be introduced here as the only effective voltage of the
generators or network inputs for the calculation of short circuit currents. The internal voltages of
generators or network inputs are short circuited, and at the position of the short circuit (fault
position) the value ( is used as the only effective voltage (Figure 1.4).
- The voltage factor c [5] considers (Table 1.1):
- The different voltage values, depending on time and position

- The step changes of the transformer switch
- That the loads and capacitances in the calculation of the equivalent voltage source can be
neglected
- The subtransient behavior of generators and motors
This method assumes the following conditions:
- The passive loads and conductor capacitances can be neglected
- The step setting of the transformers do not have to be considered
- The excitation of the generators do not have to be considered
- The time and position dependence of the previous load (loading state) of the network does not
have to be considered
> **Fig. 1.4:** Network circuit with equivalent voltage source - a) three-phase network, b)
equivalent circuit in positive-sequence system
>
> **Diagram description:**
>
> **a) Three-phase network (top diagram):**
> A single-line diagram showing a power network from left to right. On the far left is a hatched box
(representing an infinite busbar or grid supply), connected via a busbar labeled **Q** (with
parameters $S''_{kQ}$ and $U_{nQ}$ annotated below). A transformer **T** (with turns ratio $t_r
: 1$) connects the medium voltage (MV) side to the low voltage (LV) side. To the right of the
transformer is a line section **L** (represented by three diagonal slashes indicating a line). At the
far right end is indicated a **Fault position** (shown with an arrow and a ground fault symbol).
>
> **b) Equivalent circuit in positive-sequence system (bottom diagram):**
> A series circuit from node **01** (ground reference) through the following impedance elements,
left to right:
> - $X_{Qt}$ (inductive reactance, shown as inductor symbol)
> - $R_{Qt}$ (resistance, shown as resistor symbol)
> - $X_T$ (transformer reactance, inductor symbol)
> - $R_T$ (transformer resistance, resistor symbol)
> - $X_L$ (line reactance, inductor symbol)
> - $R_L$ (line resistance, resistor symbol)
> - Fault point **F**
>
> At the fault point **F**, an equivalent voltage source is connected between **F** and the
reference node **01**, with voltage $\dfrac{c \, U_n}{\sqrt{3}}$. The short-circuit current $I''_k$
flows downward into the fault node.

**Table 1.1:** Voltage factor c according to E DIN IEC 73/89/CDV (VDE 0102, Part 100):1997-08
| Network voltage $U_n$ | Voltage factor c for calculation of - the largest short circuit current$^1$
$c_{max}$ | the smallest short circuit current $c_{min}$ |
|---|---|---|
| Low voltage 100 V to 1000 V | $1.05^2$ | 0.95 |
| (IEC 38, Table 1) | $1.10^3$ | |
| Medium voltage > 1 kV to 35 kV | 1.10 | 1.00 |
| High voltage > 35 kV | 1.10 | 1.00 |
1) $c_{max} \cdot U_n$ must not exceed the highest voltage $U_m$ for operational equipment in
the network
2) for low voltage networks with a tolerance of +6 %
3) for low voltage networks with a tolerance of +10 %
## 1.4.2
**Superposition method**
The superposition method is an exact method for the calculation of the short circuit currents. The
method consists of three steps. The voltage ratios and the loading condition of the network must
be known before the occurrence of the short circuit. In the first step the currents, voltages and the
internal voltages for steady-state operation before onset of the short circuit are calculated (Figure
1.5b). The calculation considers the impedances, power supply feeders and node loads of the
active elements. In the second step the voltage applied to the fault location before the occurrence
of the short circuit and the current distribution at the fault location are determined with a negative
sign (Figure 1.5c). This voltage source is the only voltage source in the network. The internal
voltages are short-circuited. In the third step both conditions are superimposed. We then obtain
zero voltage at the fault location. The superposition of the currents also leads to the value zero.
The disadvantage of this method is that the steady-state condition must be specified. The data for
the network (effective and reactive power, node voltages and the step settings of the
transformers) are often difficult to determine. The question also arises, which operating state leads
to the greatest short circuit current. Figure 1.5 illustrates the procedure for the superposition
method.
> **Fig. 1.5 - Principle of the superposition method (three-part circuit diagram):**
>
> **a) Undisturbed (pre-fault) operation:** The circuit shows two synchronous generators (or
voltage sources) with internal subtransient reactances $\underline{X}''_{d1}$ and
$\underline{X}''_{d2}$ (represented as inductors in series with AC voltage sources
$\underline{E}'_1$ and $\underline{E}'_2$) connected to a "Power network" block. The network
feeds a line that runs to a fault location F (indicated by a switch/fault symbol), through which a
short-circuit current $\underline{I}''_k$ flows. The overall circuit is labeled as equal to the
superposition of cases b) and c).
>
> **b) Pre-fault steady-state load flow (first step):** Two power injections $P_1 + jQ_1$ and $P_2

+ jQ_2$ are fed into the "Power network" block. At the fault location F (open-circuited, no fault
yet), the pre-fault operating voltage $\underline{U}^b_F$ appears between the fault node and
ground. This sub-circuit contributes the "+ $\underline{U}^b_F$" term.
>
> **c) Superposition correction circuit (second step):** The two generators are represented again
with their subtransient reactances $\underline{X}''_d$ (two inductors), with their internal EMFs
short-circuited (replaced by short circuits). At the fault location F, a voltage source equal to
$\underline{U}^b_F$ is applied with reversed polarity (negative sign), injecting the correction
current back into the network. The combination of b) and c) yields zero net voltage at F and gives
the total short-circuit current $\underline{I}''_k$.
**Fig. 1.5:** Principle of the superposition method
a) undisturbed operation, b) operating voltage at the fault location, c) superposition of a) and b)
## 1.4.3
**Transient calculation**
With the transient method the individual operating equipment and, as a result, the entire network
are represented by a system of differential equations. The calculation is very tedious. The method
with the equivalent voltage source is a simplification relative to the other methods. Since 1988, it
has been standardized internationally in IEC 60 909. The calculation is independent of a current
operational state. In this book, we will therefore deal with and discuss the method with the
equivalent voltage source.
## 1.5
**Calculating with reference variables**
There are several methods for performing short circuit calculations with absolute and reference
impedance values. A few are summarized here and examples are calculated for comparison. To
define the relative values, there are two possible reference variables.
For the characterization of electrotechnical relationships we require the four parameters:
- Voltage U in V
- Current I in A
- Impedance Z in Ω
- Apparent power S in VA.
Three methods can be used to calculate the short circuit current:
- The Ohm system: Units: *kV, kA, V, MVA*
- The *pu* system:
This method is used predominantly for electrical machines; all four parameters *u*, *i*, *z* and

*s* are given as per unit (unit = 1). The reference value is 100 MVA. The two reference variables for
this system are $U_B$ and $S_B$.
Example: The reactances of a synchronous machine $X_d$, $X'_d$, $X''_d$ are given in *pu* or in
% *pu*, multiplied by 100 %.
- The %/MVA system:
This system is especially well suited for the fast determination of short circuit impedances. As
formal unit only the % symbol is added.
# 2
# General Information About IEC 60 909
IEC 60 909 includes a standard procedure for the calculation of short circuit currents in low and
high voltage networks up to 380 kV at 50 Hz or 60 Hz [1]. The purpose of this procedure is to define
a brief, general and easy to handle calculation procedure, which is intended to lead with sufficient
accuracy to results on the safe side. For this purpose, we calculate with an equivalent voltage
source at the position of the short circuit. It is also possible to use the superposition method here.
A complete calculation of the time behavior for far-from-generator and near-to-generator short
circuits is not required here. In most cases, it is sufficient to calculate the three-pole and the
single-pole short circuit currents, assuming that for the duration of the short circuit no change
takes place in the type of short circuit, the step switch of the variable-ratio transformers is set to
the principal tapping and arc resistances can be neglected.
The short circuit currents and short circuit impedances can always be determined by the following
methods:
- Calculation by hand
- Calculation using a PC
- Using field tests
- Measurements on network models.
The short circuit currents and short circuit impedances can be measured in low voltage networks
with measuring instruments directly at the assumed position of the short circuit.
For the dimensioning and the choice of operational equipment and overcurrent protective
equipment, the calculation of short circuit currents in three-phase networks is of great importance,
since the electrical systems must be designed not only for the normal operating state but also to
withstand fault situations.
IEC 60 909 describes the basis for calculation, which consists of three parts:
- Main part I: Networks with short circuit currents without decaying AC periodic component
(far-from-generator short circuits).
- Main part II: Networks with short circuit currents with decaying AC periodic component
(near-to-generator short circuits).

- Main part III: Double ground connection, Transferred short circuit currents via ground.
Summary of IEC 60 909
- Restructuring of calculations.
- The supplementary pages with examples and conversion factors supplement the theoretical part.
- The high and low voltage networks are treated in the same way.
- The rules for calculating the smallest and largest short circuits are equally valid for high and low
voltage networks.
- The corrections to the impedances of generators and power plant blocks do not depend on the
time behavior of the short circuit current.
- In low voltage networks a temperature rise of 20 °C to 80 °C is assumed for the single-pole short
circuit. This increases the resistance of the cable or conductor by a factor of 1.24.
- The indices for symmetrical components (0,1,2) are internationally standardized.
- The short circuit currents are determined with the equivalent voltage source method, in
accordance with IEC 60 909. For this, the internal voltages in the network are short circuited. The
only effective voltage at the position of the short circuit is then $\dfrac{c \cdot U_n}{\sqrt{3}}$,
where c is the voltage factor.
- The superposition method is the more accurate method. However, this requires knowing the
network conditions before the occurrence of the short circuit.
The draft standard IEC 73/89/CDV:1997-08 is structured as follows:
- Main part 1: describes the scope of application and the terms used.
- Main part 2: explains the properties of short circuit currents and the conditions which must be
satisfied for calculation with the equivalent voltage source method.
- Main part 3: deals with the short circuit impedances of generators, power transformers and
power plant blocks.
- Main part 4: describes the calculation of the individual short circuit currents for
far-from-generator and near-to-generator short circuits.
# 3
# The Significance of IEC 60 909
The short circuit is an undesired network operating state. This state can cause overloading of the
operational equipment (transformers, transmission lines, cables, generators) as well as damage to
the insulation. The transition from normal operation to operation under fault conditions takes
place through electromagnetic and electromechanical transient phenomena, which influence the
magnitude and temporal behavior of the short circuit currents. These processes depend on the
current sources, the position of the short circuit, the time from the onset of the short circuit until it
decays, etc.

The most common type of short circuit is the "dead" short circuit, i.e. the impedance at the faulty
location is negligibly small. Short circuit currents are as a rule much larger than load currents. The
thermal and dynamic stresses resulting from these short circuits can destroy the operational
equipment and endanger persons. During the planning and project management of electrical
systems, the smallest short circuit current $I''_{k1min}$ must therefore be determined and taken
into account for configuring the overcurrent protection equipment, and the largest short circuit
current $I''_{k3max}$ for dimensioning the operational equipment. Only in this way can electrical
systems be correctly dimensioned and protected, allowing their safe and economic operation.
Otherwise, unpleasant consequences can be expected. A few of these are listed here:
- impairment of safety and reliability of the power supply,
- interruption of the power supply,
- destruction of system components,
- emergence of mechanical and thermal stresses in the operational electrical equipment,
- emergence of overvoltages.
Until 1962, VDE 0670 switchgear regulations were the standard for short circuit calculations. VDE
0102 was released in 1971 and revised in 1975, so that in Germany the calculations for low and
high voltage networks were made uniform. In the meantime, further developments in electrical
power systems have taken place and various software has appeared on the market. In order to
meet the requirements and developments, in 1985 both parts, Calculation of Three-phase
Networks in accordance with DIN VDE 0102, were extended to include the newly summarized
information about operational equipment.
In 1988, on the basis of this draft version the IEC publication "Short Circuit Current Calculation in
three-Phase ac Systems" appeared. In 1990, the present standard IEC 60 909 "Calculation of Short
Circuit Currents in Three-phase Networks" was released.
The method of symmetrical components is used for symmetrical and asymmetrical short circuits.
The capacitances of conductors and shunt admittances of passive loads are neglected here. With
this method, motors are treated as generators in high voltage networks and are neglected in low
voltage networks. For a double ground connection, only the voltage of the short circuit current
source is used as the effective voltage.
For the assessment of electrical systems, such as breaking conditions, protective measures,
thermal and mechanical short circuit strengths, selectivity and voltage drop, etc. comprehensive
calculations are performed.
For the calculation of short circuits, the following are important:
- power draw and documentation of result,
- short circuit currents,
- transferred short circuit currents,
- impedance protection, maximum current-dependent and current-independent time relays,

- examination of breaking conditions,
- proof of stability of switchgear, switching devices, cables and conductors against short circuits.
Figure 3.1 makes clear the importance and the range of applicability of short circuit current
calculations and additional calculations relating to other regulations.
In medium voltage networks, the type of the smallest fault current which must be considered
depends on the type of neutral point design. This is decisive for the type of network protection
required.
> **Fig. 3.1:** Range of applicability of short circuit calculations [1, 16, 17, 35]
**Description of Figure 3.1:**
The figure is a hierarchical flowchart illustrating the range of applicability of short circuit
calculations. The central quantity is the **initial symmetrical short-circuit current** $I''_k$, from
which all other quantities and applications branch out. The structure is described as follows:
**Central Node:**
- $\mathbf{I''_k}$ (bold, central box)
**Branches from $I''_k$:**
- **Peak short-circuit current** (left-center branch):
- $i_p = \kappa \sqrt{2}\, I''_k$
- Leads to:
- **Dynamic stress of operational equipment**: $F \sim i_p^2$
- $I_{cm}$ → **Rated short circuit making capacity**
- $i_p$ (feeds back into dynamic stress)
- **Correction factors** $\mu, q$ (center branch, upward):
- $I_{aG} = \mu\, I''_{kG}$
- $I_{aM} = \mu\, q\, I''_{kM}$
- Connects to **Selection of overvoltage protection equipment**, which leads to:
- **Rated short circuit breaking capacity of overvoltage protection equipment**
- **Factor** $\lambda_{\min},\, \lambda_{\max}$ (center-right branch):
- $I_{kG} = \lambda\, I''_{rG}$
- **Thermic stress of operational equipment** (right branch):
- $I_{th} = I''_k \sqrt{m + n}$
- $m = f(\kappa,\, T_k)$
- $n = f(I''_k / I_k,\, T_k)$

- **Various short-circuit current types** (lower-center branch):
- $I''_{k3},\, I''_{k2},\, I''_{k1}$
- $I''_{kEE},\, I''_{2E}$
- Leads to:
- $I''_{k1} > I_a$ → **Protection by cut-off**
- **Residual currents** (lower-left branch):
- $I_{CE}$, $I_{Rest}$
- Leads to: **Neutral point selection in three-phase networks**
- **Other applications** (lower-right branch from $I''_{k3}, I''_{k2}, I''_{k1}$):
- Touch voltage and step voltage
- Selection of arrester
- Inductive coupling
- Transient and power-frequency overvoltage
# 4
# Supply Networks
Electrical supply networks such as can be found in practice will be briefly explained here.
## 4.1
**Calculation variables for supply networks**
- Short circuit currents in accordance with IEC 60 909
- Ground loop impedance
- Peak short circuit current
- Initial symmetrical short circuit power
- Load flow
- Load distribution for the network
## 4.2
**Lines supplied from a single source**
A feed-in supplies any number of distributed loads along the line (Example: bus distributor), Figure
## 4.1.
> **[Fig. 4.1 - Diagram: Line supplied from a single source]**
>
> The diagram shows a single-line schematic of a radial electrical supply network fed from a single
source. From left to right, the components are:
> - **Power feeding (Q):** Represented by a hatched/cross-hatched square symbol, indicating the
external grid or supply point (network feeder).

> - A connection node (bullet point) linking the feeder to the transformer.
> - **Transformer (T):** Depicted by two circles (primary and secondary windings) with a triangle
symbol on the primary side (delta winding) and a star/wye symbol on the secondary side, with the
neutral point grounded (earth symbol below).
> - A second connection node on the secondary side of the transformer.
> - **Bus bar:** A horizontal line extending to the right from the transformer secondary,
representing the main distribution bus bar.
> - **Outgoing circuits:** Three downward-pointing arrows connected to the bus bar, representing
multiple load branches or outgoing feeder circuits distributed along the bus bar.
>
> The overall topology illustrates a simple radial (single-source) distribution network where power
flows from the feeding point through the transformer to the bus bar, and then distributes to
several outgoing circuits (loads).
**Fig. 4.1:** Line supplied from a single source
**18** | *4 Supply Networks*
Characteristics of this input:
- No security of supply
- High network losses
**4.3**
**Radial networks**
A feed-in supplies a large number of branched lines (Example: industrial network), Figure 4.2.
> **[Fig. 4.2 - Radial Network Diagram]**
> The diagram illustrates a radial network topology. On the left side, there is a grid supply
connection represented by a hatched/cross-hatched box (utility infeed), labeled **Q** (circuit
breaker/disconnector). This connects via a busbar to a transformer **T**, which is depicted with
delta ( ) and star (Y) winding symbols and a grounded neutral on the secondary side. The
transformer secondary feeds a main horizontal busbar. From this busbar, a vertical distribution line
branches upward and downward: the upper branch connects to a three-phase motor **M1**
(symbol: circle with "M" and "3~"), and the lower branch connects to another three-phase motor
**M2** (symbol: circle with "M" and "3~"). The topology is strictly radial - a single feed-in point
(the transformer) supplies all loads through branching lines, with no alternative supply paths.
**Fig. 4.2:** Radial network
Characteristics of this input:

- Advantages
- Very clearly arranged
- Simple network protection
- Easily calculated
- Disadvantages
- Single source supply
- Low security of supply
- Poor voltage stabilization
**4.4**
**Ring networks**
The ring network is usually fed from two sources (Example: industrial network), Figure 4.3.
**Fig. 4.3:** Ring network
Characteristics of this input
- Advantages
- Increased voltage security
- Better load balancing
- Better voltage stability
- Disadvantages
- Network protection difficult
## 4.5
## Meshed networks

The supply of each load is ensured by the linking of several supply lines and in part by several
feed-ins. The failure of one line or one feed-in can normally be compensated by the remaining part
of the network (Example: computer centers, chemical industry), Figure 4.4.
**Fig. 4.4:** Meshed network
Characteristics of this input:
- Advantages
- High security of supply
- Good voltage stability
**20** | *4 Supply Networks*
- Good load balancing
- Low network losses
- Disadvantages
## 1. Selectivity
- Impedance protection
- High short circuit currents
- Extensive short circuit and load flow calculations
# 5
# Network Types for the Calculation of Short Circuit Currents
## 5.1
### Low voltage network types
In this section other types of networks are shown which are sometimes encountered in practice
and in which the short circuit currents are fed from different sources. The most frequently found
network types in the public and the industrial sectors are radial networks. For these networks the

calculation of short circuit currents is very simple. The medium and low voltage side can be
configured arbitrarily, according to the requirements for supplying power (Figure 5.1).
> **Fig. 5.1 - Diagram Description:**
> The figure shows three simple radial network configurations with different centers of load
distribution. At the top, a "Power feeding" label indicates the supply origin, connected to a busbar
via a switch Q (represented by a crossed-box symbol). From the busbar, three separate radial
feeders branch out:
>
> - **Left feeder:** A high-voltage busbar feeds a transformer T (represented by a circle with a
cross), which steps down to a low-voltage busbar. From the low-voltage busbar, multiple outgoing
circuits are distributed through "Cable or line" segments going downward.
>
> - **Center feeder:** Similarly structured - a high-voltage busbar connected to a transformer T,
stepping down to a low-voltage busbar, with outgoing circuits distributed through "Cable or line"
segments.
>
> - **Right feeder:** A simplified configuration showing only a transformer T connected directly,
feeding outgoing circuits without explicitly labeled cable/line segments.
>
> At the bottom, the label "Outgoing circuits" indicates the load side of all three feeders. The
diagram illustrates typical radial distribution topologies where each transformer independently
supplies its load group.
In industrial networks, power supply to the systems must not fail. In the event of a malfunction,
switchover can take place from another transformer (Figure 5.2).
Radial networks with redundant inputs have a higher security of supply and a high voltage quality
(Figure 5.3). The transformers can be loaded uniformly.
The meshed network with different inputs is the most widely used network type for electrical
distribution in industry (Figure 5.4). The disadvantages of such networks are high costs of
investment and an arrangement which is difficult to oversee.
> **[Fig. 5.2 - Circuit Diagram: Simple radial networks with individual load circuits]**
> The diagram illustrates two parallel simple radial network branches, each fed from a common
"Power feeding" bus at the top. Each branch consists of:
> - A high-voltage bus connected to a transformer (T) with delta-wye (Δ/Y) configuration, stepping
down to low voltage.
> - A low-voltage bus feeding into low voltage distribution panels (represented by rectangular
switch/fuse symbols).
> - From each distribution panel, multiple load circuits branch downward (indicated by arrows
pointing down), representing individual load connections.
> - The two branches are interconnected at the low-voltage distribution panel level via a

normally-open tie switch (shown as a dashed line with a switch symbol in the middle), allowing for
sectionalizing but normally operated as separate radial feeders.
> Labels present: "Power feeding" (top bus), "High voltage" (above transformers), "Low voltage"
(below transformers), "Low voltage distribution panels" (at panel level), "Load circuits" (at bottom).
**Fig. 5.2:** Simple radial networks with individual load circuits
> **[Fig. 5.3 - Circuit Diagram: Simple radial networks with redundant inputs]**
> The diagram shows a more complex radial network topology with redundant (backup) supply
inputs. Key features include:
> - Three transformer sources (depicted as double-circle transformer symbols) positioned at the
top-left, top-center, and mid-right of the diagram, each connected to their respective bus sections
via vertical feeder lines.
> - Multiple low-voltage bus sections (horizontal lines) at two distinct levels, interconnected by
normally-open tie switches (rectangular switch symbols shown as open contacts), forming a
secondary selective or loop arrangement.
> - Distribution panels (rectangular symbols) are connected at various bus junction points, feeding
downward load branches (arrows pointing down and upward arrows indicating bidirectional or
return paths).
> - A third transformer source is connected at the mid-right level, providing an additional
redundant input to the lower bus section.
> - The network is arranged so that any single bus section can be fed from at least two sources via
the tie switches, ensuring redundancy and improving supply reliability.
> - At the bottom-left, a transformer (double-circle symbol) is connected feeding upward into the
lower bus, further illustrating the redundant input concept.
> The overall topology represents a simple radial network enhanced with redundant inputs for
improved fault tolerance, where tie switches are normally open and can be closed upon loss of a
primary feed.
**Fig. 5.3:** Simple radial networks with redundant inputs
> **[DIAGRAM - Fig. 5.4]**
> A schematic diagram of a meshed medium-voltage network with different power feeding inputs
and network nodes protected by fuses. The diagram shows a grid-like (meshed) topology with
multiple interconnected buses forming a rectangular lattice. Power is fed from two points: one at
the top (labeled "Power feeding" with an arrow pointing right into the top bus) and one at the
bottom-left (labeled "Power feeding" with an arrow pointing right, connected through a
transformer symbol - two circles representing a two-winding transformer). Within the mesh, two
transformer nodes are visible: one labeled "LV/MV" (low voltage to medium voltage step-up
transformer, represented by a circle with ground symbol) and one labeled "MV/LV" (medium
voltage to low voltage step-down transformer). At the intersection where power enters the top, a
fuse element (shown as a rectangular fuse symbol) is placed in series on the bus. Diagonal lines
with arrowheads on the mesh segments indicate the direction of power flow throughout the

network. The overall structure illustrates a meshed distribution network where multiple paths exist
between nodes, providing redundancy and supply security.
**Fig. 5.4:** Meshed network with different inputs, network nodes with fuses
## 5.2
## Medium voltage network types
For optimum design of medium voltage systems the following points, which are not explained in
further detail, are of great importance:
- Network losses
- Complexity of maintenance
- Investment costs
- Power requirement coverage
- Security of supply
- Ease of operation
- Environmental compatibility.
Figure 5.5 illustrates an industrial load center network which supplies individual large scale loads
and Figure 5.6 a ring network, in which the supply of power is ensured.
The following Figures 5.5 to 5.8 depict medium voltage network types with different possible
structures. The network with open rings (Figure 5.5a) is connected through circuit breakers to the
bus bar. The ring can be opened and closed by the load switch disconnector. The network with
remote station (Figure 5.5b and 5.5c) with network supporting structure is connected through
several input cables to the bus bar of the transformer substation. An industrial area can also be
supplied from several transformer stations (Figure 5.8). The short circuit current can also be fed
from different sources, as Figures 5.9 and 5.10 show.
> **[DIAGRAM - Fig. 5.5: Industrial load center network]**
>
> Single-line diagram of an industrial load center network. At the top, a high-voltage busbar labeled
"High voltage distribution fields" connects multiple incoming feeders (represented by
disconnectors and circuit breakers with current transformers). On the left side, several power plant
inputs are shown feeding into the high-voltage bus via upward-pointing arrows. A bus coupler
(normally open switch) connects the left and right sections of the high-voltage bus. From the
high-voltage bus, two groups of cables feed downward into transformer stations. Each transformer
station (left group: two stations; right group: two stations) contains a transformer (shown as two
coupled circles), a circuit breaker, disconnectors, and a low-voltage busbar with outgoing feeders.
The topology represents a radial (load center) configuration where the high-voltage bus supplies
transformer stations directly, without ring interconnection at the low-voltage level.

**Fig. 5.5:** Industrial load center network
> **[DIAGRAM - Fig. 5.6: Industrial ring network]**
>
> Single-line diagram of an industrial ring network. Similar to Fig. 5.5, the top section shows a
high-voltage busbar ("High voltage distribution fields") with multiple incoming feeders
(disconnectors, circuit breakers, and current transformers) and power plant inputs feeding into the
bus from the left via upward arrows. A bus coupler (normally open) connects left and right bus
sections. From the high-voltage bus, feeders run downward to transformer stations arranged in
two groups (left and right). Each transformer station contains a transformer, circuit breakers,
disconnectors, and low-voltage busbars with outgoing feeders. The key distinction from the load
center network is that the low-voltage busbars of adjacent transformer stations are interconnected
via cable links with normally open switches, forming a ring (loop) topology. This ring
interconnection at the secondary (low-voltage) side provides redundancy and allows supply
restoration in case of a cable or transformer fault, characteristic of an industrial ring network
configuration.
**Fig. 5.6:** Industrial ring network
> **[DIAGRAM - Fig. 5.7: Three single-line electrical network topology diagrams illustrating medium
voltage distribution configurations:]**
>
> **a) Ring network:** A single high-voltage busbar (shown at top with transformer symbol) feeds
a vertical main bus. From this bus, two horizontal feeders extend to the left and two to the right,
each feeder containing a transformer (represented by two interlocked circles) and
disconnect/switching symbols (line breaks and arrows indicating bidirectional power flow). The
arrangement forms a closed-loop (ring) topology, allowing power to be fed from two directions to
each load point.
>
> **b) Network with remote station:** Similar to (a), a busbar fed from a transformer at top
supplies feeders to the left and right. The right-side feeders connect to a remote substation busbar
(shown with a vertical line and a break/disconnector symbol at the bottom), indicating an
open-point or tie-point with a remote station. Arrows on feeders indicate the direction of power
flow in normal operation.
>
> **c) Network supporting structure:** A transformer at the top feeds a main bus. On the left side,
two transformers supply feeders; in the center, a coupling point labeled **A** (with a circle and
cross symbol, indicating a bus-coupler or normally-open switching point) connects the left and right
sections of the bus. On the right, two more transformer feeders are present. The **Detail A** inset
shows a close-up of the coupling point: a transformer symbol followed by a fused
disconnector/load-break switch symbol (depicted as parallel diagonal lines with a dot), indicating a

fused coupling switch between the two bus sections.
**Fig. 5.7:** a) ring network, b) network with remote station, c) network supporting structure
> **[DIAGRAM - Fig. 5.8: A comprehensive set of single-line diagrams illustrating various network
configurations for medium voltage systems, arranged in a grid of approximately 12 sub-diagrams
across three rows:]**
>
> **Top row (4 sub-diagrams):** The leftmost diagram shows a 110 kV / 20 or 10 kV
high-voltage/medium-voltage transformer substation. The HV side has a disconnector and a circuit
breaker; the MV side has a busbar with multiple outgoing feeders equipped with circuit breakers,
disconnectors, and three-phase load indicators ($\phi 3$). The remaining three sub-diagrams in the
top row show progressively simpler secondary substations (ring main units or compact substations)
each connected to the MV feeder, with two incoming cable connections, a transformer outgoing
feeder, and a three-phase LV outgoing indication ($\phi 3$).
>
> **Middle row (two groups):** The left group shows a secondary feeding substation with a
transformer (two windings symbol) supplying a local MV busbar, which in turn feeds further
downstream substations-each with incoming/outgoing switching devices and $\phi 3$ LV feeders.
The right group shows a similar arrangement but with a different topology, featuring open-ring or
interconnected bus structures with bus couplers, demonstrating how the MV network can be
sectionalized and re-fed from two sources, each sub-station having ring main switches and a
transformer feeder.
>
> **Bottom row (two groups):** The left group illustrates a radial or open-ring MV network fed
from a transformer substation at bottom-left; multiple intermediate switching substations are
chained in series along the MV cable, with each node having incoming/outgoing feeders and $\phi
3$ load outlets, terminating in a normally-open point (open ring). The right group shows a simpler
two-node configuration with two substations (each containing a disconnector and a transformer
feeder) connected by a cable section, representing a basic interconnected or tie-line arrangement.
>
> All sub-diagrams use standard IEC single-line notation: double circles for power transformers,
T-shaped symbols for circuit breakers, diagonal slash symbols for disconnectors/isolators, and
$\phi 3$ to denote three-phase LV outgoing connections.
**Fig. 5.8:** Network configuration for medium voltage systems
> **Diagram Description - Fig. 5.9: Short circuit with simple inputs**
>
> The figure shows three separate single-line diagram configurations illustrating short circuit
scenarios with simple (single) inputs feeding a common low-voltage bus through transformers.
Each configuration is described below:

>
> **Top configuration (Parallel network infeed via two transformers from a high-voltage grid):**
> Two network infeeds (both labeled **Q**, represented by crossed-box symbols indicating an
external network/grid connection) are connected on the high-voltage side. Each feeds into its own
transformer:
> - Upper branch: Transformer **T1** (high voltage → low voltage)
> - Lower branch: Transformer **T2** (high voltage → low voltage)
>
> Both transformer low-voltage outputs connect to a common busbar. A **fault location** symbol
(zigzag/lightning arrow) is indicated to the right of the common low-voltage bus, representing the
point of short circuit.
>
> **Middle configuration (Mixed infeed: network and generator via two transformers):**
> - Upper branch: Network infeed **Q** (crossed-box symbol) feeding through transformer
**T1** (high voltage → low voltage).
> - Lower branch: A three-phase synchronous generator **G** (labeled **3~**, circle symbol)
feeding through transformer **T2** into the low-voltage bus.
>
> Both outputs connect to a common busbar with a **fault location** indicated to the right.
>
> **Bottom configuration (Passive network: two transformers from high-voltage side, no active
infeed symbol):**
> Two transformers, **T1** (upper) and **T2** (lower), are connected on the high-voltage side to
a common high-voltage bus (no explicit active source symbol - representing an infinite or passive
bus). Their low-voltage outputs feed into a common low-voltage busbar. The **fault location**
symbol is connected to the right side of the low-voltage bus via a horizontal line, indicating a
remote or downstream fault point.
**Fig. 5.9:** Short circuit with simple inputs
> **[DIAGRAM DESCRIPTION - Fig. 5.10: Short circuit with several simple inputs]**
>
> The figure presents three separate single-line (single-phase representation) electrical network
diagrams, each illustrating different configurations of power sources feeding a common busbar,
with fault locations indicated on the low-voltage side. The diagrams are stacked vertically and
described as follows:
>
> **Top diagram (two high-voltage network infeed sources via transformers):**
> - Two high-voltage network infeeds, each represented by a crossed-box symbol (Q), connected
through circuit breakers/disconnectors.
> - Each infeed feeds a transformer: T1 (top) and T2 (bottom).
> - The high-voltage sides connect to the "High voltage" bus; the low-voltage sides connect to the

"Low voltage" bus.
> - Two fault locations are indicated on the low-voltage bus, shown by diagonal arrow symbols
(representing fault/short-circuit points) on two separate feeder branches emanating from the
low-voltage busbar.
>
> **Middle diagram (one high-voltage network infeed + one local generator):**
> - One high-voltage network infeed (crossed-box symbol, Q) connected through a disconnector to
transformer T1 (High voltage to Low voltage).
> - One local three-phase generator (G, 3~) connected to transformer T2.
> - Both T1 and T2 feed a common low-voltage busbar.
> - A single fault location is indicated on the low-voltage bus by a diagonal arrow symbol.
>
> **Bottom diagram (multiple high-voltage network infeeds via three transformers, no switching
symbols shown):**
> - Three transformers T1, T2, and T3, each connected from a high-voltage bus (labeled "High
voltage") to a common low-voltage bus (labeled "Low voltage").
> - No explicit switching/breaker symbols on the high-voltage side (simple line connections).
> - Two fault locations are indicated on the low-voltage bus between T1-T2 and T2-T3 feeder
branches, shown by diagonal arrow symbols.
>
> All fault locations are depicted using the standard IEC symbol for a short-circuit fault (a diagonal
line with an arrowhead), indicating points where short-circuit current analysis is to be performed.
The diagrams collectively illustrate how multiple simple infeed sources (network infeeds and/or
generators) contribute to the short-circuit current at a fault point on a medium/low voltage
network.
**Fig. 5.10:** Short circuit with several simple inputs
# 6
# Systems up to 1 kV
Systems are classified according to the type of ground connection of the power source (input type)
and the type of exposed conductive parts of the electrical system (IEC 60 364 part 41). In this
chapter, the three different types of systems and protective measures are briefly described.
## 6.1
## TN systems
According to IEC 364 the TN system is preferred in the area of public low voltage networks and also
in the industrial sector. In TN systems, the grounding of the operational equipment is implemented
by connection to the PEN conductor or for small cross-sections to the protective ground conductor
(PE) (Figure 6.1).

> **[DIAGRAM - Fig. 6.1: Circuitry of the TN-C-S system]**
>
> The diagram illustrates the wiring topology of a TN-C-S low-voltage distribution system. On the
left side, a **Service panel** is shown containing a three-phase energy meter (kWh meter)
connected to three live conductors (L1, L2, L3), a neutral conductor (N), and a combined protective
earth/neutral conductor (PEN). The PEN conductor is bonded to a **Main grounding terminal**,
which is connected to earth via ground electrodes (earth rods/plates). From the main grounding
terminal, equipotential bonding connections run to **metal pipes** and other structural metallic
elements.
>
> From the service panel, the system transitions from TN-C (using PEN) to TN-S (separate N and PE
conductors), distributing power through the installation. The distribution section includes:
> - **Fuses** on the L1, L2, L3 and N conductors at an intermediate distribution point.
> - **Si** - isolating switches/circuit isolators shown in the mid-section of the panel.
> - **RCD** (Residual Current Device) with a rated residual operating current $I_{\Delta n} = 0{,}3\
\text{A}$, providing additional fault protection.
> - **LS** - Circuit breaker (Leitungsschutzschalter), labeled as such in the legend.
> - **Miniature circuit breaker** at the final circuit level (shown at the bottom right), protecting
individual branch circuits.
>
> The PE conductor runs separately from the point of PEN separation onwards, providing protective
earthing to the connected equipment. The diagram shows the characteristic split of the PEN
conductor into separate PE and N conductors, which defines the TN-C-S configuration.
**Fig. 6.1:** Circuitry of the TN-C-S system, LS = Circuit breaker
Description of the system:
1st letter: describes the grounding conditions of the power source
T: direct grounding of a point
2nd letter: describes the grounding conditions of the exposed conductive parts of the electrical
system
N: direct connection of exposed conductive parts through PEN or PE to system grounding,
continuing in TN system
S: neutral conductor (N) and protective ground conductor (PE), as separate and separated
conductors
C: neutral conductor and protective ground conductor combined in a single conductor (PEN)
Permissible overcurrent protective equipment:
- Fuses
- Line-protection circuit breakers
- Circuit breakers
- RCDs (Residual Current Protective Devices)

The following conditions must be satisfied for the ground loop impedance:
$$Z_s \leq \frac{U_0}{I_a} \,. \tag{6.1}$$
where:
$Z_S$ is the ground loop impedance
$U_O$ is the conductor-to-ground voltage and
$I_a$ is the breaking current of the overcurrent protective equipment
The ground loop impedance (loop resistance) of the TN system is required in order to calculate the
minimum required fault current at the position of the short circuit (Figure 6.2).
> **Diagram description - Fig. 6.2: Ground loop impedance**
>
> The figure shows a single-line schematic of a TN-C-S electrical distribution system illustrating the
concept of ground loop impedance. On the left side, a Medium Voltage (MV) transformer with
three windings feeds into a Low Voltage (LV) distribution board. The transformer's neutral point is
directly grounded at the transformer station (indicated by a ground symbol labeled "Grounding of
transformer station"). From the LV side, four conductors are distributed: three phase conductors
(L1, L2, L3) running along the top, and a combined PEN conductor running below them on the
source side (TN-C portion). At a distribution point, the PEN conductor splits into a separate Neutral
conductor (N) and a Protective Earth conductor (PE), forming the TN-S portion of the system. A
load (represented by a box with two terminals) is connected between a phase conductor and the
PE conductor. A fault is shown occurring at the "Fault location," represented by a closing
switch/contact symbol between the phase and the enclosure/PE conductor. The current path of
the fault loop is highlighted with arrows, showing that fault current flows from the transformer,
along the phase conductor to the fault location, and returns via the PE/PEN conductor back to the
transformer neutral - this closed path constitutes the "Fault loop," as labeled in the diagram. The
impedance of this loop ($Z_s$) determines whether the overcurrent protective device will operate
within the required disconnection time.
**Fig.** 6.2: Ground loop impedance
## 6.2
## Calculation of fault currents
This section presents and explains simple fundamental considerations for the calculation of the
fault current.
In TN systems, the fault current is calculated in order to ensure protection in case of indirect
contact and to guarantee that the protective equipment switches off within the specified time.
Figure 6.3 gives an overwiew of the calculations carried out here.
> **Fig. 6.3 - Overview of the power supply (single-line diagram)**
>

> The diagram shows a power supply chain from a high-voltage network to a low-voltage load
point. On the left, a three-phase generator (labeled G, 3~) feeds into the high-voltage side. A
transformer T steps down from high voltage to low voltage (indicated by the delta-star symbol with
earth on the low-voltage neutral). The circuit is divided into the following impedance segments
along the top conductor:
> - $Z_Q$: impedance of the upstream high-voltage network (upstream from the power
source/transformer)
> - $Z_T$: impedance of the transformer T
> - $Z_U$: impedance of the cable or line connecting the transformer to the load point
>
> The current $I_a$ flows through the cable or line. At the far right end of the line, the minimum
single-phase short-circuit current $I''_{k1min}$ is indicated at the fault location.
>
> The return path (PE/neutral conductor) closes through $Z_S$ (the total loop impedance), shown
as an arrow returning along the bottom of the diagram back to the source. The high-voltage side is
connected to a grid symbol (busbar with cross-hatching) on the far left.
**Fig. 6.3:** Overview of the power supply
The impedance upstream from the power source is given by:
$$Z_Q = \sqrt{R_Q^2 + X_Q^2} \tag{6.2}$$
and with the short circuit power of the high voltage network:
$$Z_Q = \frac{c U_n^2}{S''_{kQ}} \tag{6.3}$$
If exact data are not available for the reactance and resistance, we can then use the following
values [11]:
$$R_Q = 0.100 \cdot X_Q \tag{6.4}$$
$$X_Q = 0.995 \cdot Z_Q \tag{6.5}$$
Impedance of the transformer:
$$Z_T = \frac{(U_n)^2}{S_{rT}} \cdot \frac{u_{kr}\%}{100} \tag{6.6}$$
If exact data are not available for the reactance and resistance, we can then use the following
values [11]:
$$R_T = 0.31 \cdot Z_T \tag{6.7}$$
$$X_T = 0.95 \cdot Z_T \tag{6.8}$$

$$Z_T = \sqrt{R_T^2 + X_T^2} \tag{6.9}$$
Impedance of the power source:
$$Z_S = Z_Q + Z_T \tag{6.10}$$
**System power supplied from generators:**
Transient reactance of generator:
$$X'_d = \frac{U_n^2}{S_{rG}} \cdot \frac{x'_d}{100} \tag{6.11}$$
Zero-sequence reactance
$$X_0 = \frac{U_n^2}{S_{rG}} \cdot \frac{x_0}{100} \tag{6.12}$$
If exact data are not available for the reactance and resistance, we can then use the following
values [11]:
$$X'_d = 30\% \cdot x'_d \tag{6.13}$$
$$X'_d = 6\% \cdot x_0 \tag{6.14}$$
Calculation of the fault current $I''_{k1min}$ (external conductor - protective ground conductor):
In accordance with IEC 60 364, protection for indirect contact is ensured if the following equation is
satisfied:
$$I''_{k1min} = \frac{\sqrt{3} \cdot c_{min} \cdot U_n}{3 \cdot \sqrt{\left(2 \cdot l \cdot R'_L +
R_v\right)^2 + \left(2 \cdot l \cdot X'_L + X_v\right)^2}} \tag{6.15}$$
For cables and conductors with reduced PEN or protective ground conductor cross-sections,
equation 6.15 can be used provided that we substitute
$$R'_L = \frac{R'_{L1} + R'_{L2}}{2} \tag{6.16}.$$
This protective measure requires coordinating the type of ground connection and the
characteristics of the protective ground conductors and protective equipment. An immediate and
automatic cut-off of the faulty circuit is ensured when the following condition is met:
$$I''_{k1min} \geq Ia \tag{6.17}$$
Calculation of the resistance at a temperature of 80 °C in accordance with IEC 60 909 for a
minimum single-pole short circuit current:

$$R_{L80°} = R_{L20°} \cdot \left[1 + 0.004 \frac{1}{°C} \left(\theta_e - 20 \text{ °C}\right)\right]
\tag{6.18}$$
The meanings of the symbols are:
| Symbol | Meaning |
|---|---|
| $c$ | Voltage factor |
| $S''_{kQ}$ | Short circuit power of the high voltage network |
| $X_Q$ | Reactance upstream from power source |
| $X_T$ | Reactance of power source |
| $Z_Q$ | Impedance upstream from power source |
| $R_Q$ | Resistance upstream from power source |
| $R_T$ | Resistance of power source |
| $Z_T$ | Impedance of power source |
| $I''_{k1min}$ | Smallest single-pole short circuit current |
| $I_a$ | Breaking current of overcurrent protective equipment |
| $l$ | Length of conductor (half the loop length) |
| $R'_L$ | Resistance per unit length of cable or conductor |
| $X'_L$ | Reactance per unit length of cable or conductor |
| $R_v$ | Ground loop resistance of main network |
| $X_v$ | Ground loop reactance of main network |
| $R'_{L1}$ | Resistance per unit length of external conductor |
| $R'_{L2}$ | Resistance per unit length of PEN or protective ground conductor |
| $Z_S$ | Sum of impedances of network feed-ins and power source |
## 6.3 TT systems
In TT systems the neutral conductor does not serve a protective ground conductor function. The
connection of the operational equipment take place through the protective ground conductor to a
common grounding system (Figure 6.4). TT systems are of no importance in the industrial sector.
> **[DIAGRAM - Fig. 6.4: Circuitry of the TT system]**
> The diagram illustrates the circuitry of a TT (Terra-Terra) electrical distribution system. The
schematic shows:
> - A three-phase supply with four conductors labeled L1, L2, L3, N (Neutral), and PE (Protective
Earth), originating from a transformer (represented by inductors on the left side).
> - A kWh energy meter connected to the supply lines.
> - A Main ground terminal block connected to earth via grounding electrodes (shown as ground
symbols), also bonded to a metal pipe.
> - Two RCD (Residual Current Device) stages:
> - First RCD with rated residual current $I_{\Delta n} = 0.5\,\text{A}$, protecting a group of loads
(represented as rectangular load symbols connected between phase and neutral/PE).
> - Second RCD with rated residual current $I_{\Delta n} \leq 30\,\text{mA}$, protecting a final

circuit with a Line Switch (LS) and a single load (e.g., a lamp or appliance).
> - The PE conductor runs separately from the neutral and connects exposed conductive parts
directly and independently to their own earth electrodes (separate from the power source earth),
consistent with the TT system topology.
> - The metal pipe is also bonded to the main ground terminal for equipotential bonding purposes.
**Fig. 6.4:** Circuitry of the TT system
Description of system:
1st letter: describes the grounding conditions of the power source
T: direct grounding of a point
2nd letter: describes the grounding conditions of the exposed conductive parts of the electrical
system
T: exposed conductive parts, grounded directly and independently of power source
- Permissible overcurrent protective equipment:
- RCDs (Residual Current Protective Devices)
- Line-protection circuit breakers, e.g. with A, B, C and D characteristic
- Circuit breakers
- Fuses
The following condition must be satisfied for the ground resistance of the exposed conductive
parts:
$$R_A \leq \frac{U_L}{I_{\Delta n}}, \tag{6.19}$$
$$R_A \leq \frac{U_L}{I_a},\tag{6.20}$$
where:
$R_A$ &emsp; is the sum of the resistances of the ground electrode and the protective ground
conductor
$U_L$ &emsp; is the touch voltage and
$I_{\Delta n}$ &emsp; is the rated differential current of the RCD
**6.4**
**IT systems**
The power source for IT systems is isolated. Its application is primarily in the industrial sector and in
the operation rooms of hospitals (Figure 6.5).

> **[Figure 6.5 - Circuit diagram of an IT system]**
> The diagram shows a three-phase IT power system. On the left side, there is an isolated power
source (transformer with no direct connection to earth/ground, represented by an isolation
symbol). Three phase lines (L1, L2, L3) extend horizontally to the right from the source. A PE
(Protective Earth) conductor runs along the bottom of the diagram and is connected to the
equipment enclosure/frame. The equipment is grounded independently via a ground electrode
(shown as a grounding symbol at the bottom). The label "Grounding of the equipment" indicates
the local earth connection of the equipment chassis. No neutral conductor (N) is shown, consistent
with IT system topology where the source neutral is either isolated or connected to earth through a
high impedance.
**Fig. 6.5:** Circuitry of the IT system
Description of system:
1st letter: &emsp; describes the grounding conditions of the power source
I: &emsp;&emsp;&emsp; isolation of active parts from ground or connection of active parts to
ground through an impedance (indirect grounding)
2nd letter: &emsp; describes the grounding conditions of the exposed conductive parts of the
electrical system
T: &emsp;&emsp;&emsp; exposed conductive parts, grounded directly and independently of
power source
&emsp; The protection for indirect contact is implemented by messages generated in the isolation
monitoring, with equipotential bonding or cut-off in addition in the case of a double fault.
- Permissible overcurrent protective equipment:
- Insulation monitoring
- RCDs (Residual Current Protective Devices)
- Line-protection circuit breakers
- Circuit breakers
- Fuses.
The ground resistance of the exposed conductive parts must be sufficiently low to allow the
following condition to be satisfied:
$$R_E \leq \frac{U_L}{I_d}\,. \tag{6.21}$$
where:
$R_E$ &emsp; is the grounding resistance
$U_L$ &emsp; is the touch voltage and

$I_d$ &emsp; is the leakage current
**6.5**
**Transformation of the network types described to equivalent circuit diagrams**
There are many possible arrangements of networks. In order to calculate the total impedance at
the position of the short circuit, the network topologies in multiple and meshed networks are
simplified and transformed in a star-delta or delta-star transformation (Figure 6.6).
With this approach, the network is reduced to a network with simple inputs. The entire short circuit
path is represented by resistances and reactances and the impedance at the position of the short
circuit calculated from these. The following relationships then apply:
The impedance is generally:
$$\underline{Z} = R + j\ X. \tag{6.22}$$
The magnitude of the impedance is:
$$Z = \sqrt{R^2 + X^2}\,. \tag{6.23}$$
Series circuit (Figure 6.6a):
$$\underline{Z}_G = \underline{Z}_1 + \underline{Z}_2\,. \tag{6.24}$$
Parallel circuit (Figure 6.6b):
$$\underline{Z}_G = \frac{\underline{Z}_1 \cdot \underline{Z}_2}{\underline{Z}_1 +
\underline{Z}_2}\,. \tag{6.25}$$
Delta-star transformation (Figure 6.6c):
$$\underline{Z}_1 = \frac{\underline{Z}_a \cdot \underline{Z}_c}{\underline{Z}_a + \underline{Z}_b
+ \underline{Z}_c}\,, \tag{6.26}$$
$$\underline{Z}_2 = \frac{\underline{Z}_a \cdot \underline{Z}_b}{\underline{Z}_a +
\underline{Z}_b + \underline{Z}_c},$$
$$\underline{Z}_3 = \frac{\underline{Z}_b \cdot \underline{Z}_c}{\underline{Z}_a + \underline{Z}_b
+ \underline{Z}_c}.$$
Star-delta transformation (Figure 6.6d):

$$\underline{Z}_a = \frac{\underline{Z}_1 \cdot \underline{Z}_2 + \underline{Z}_1 \cdot
\underline{Z}_3 + \underline{Z}_2 \cdot \underline{Z}_3}{\underline{Z}_3}, \tag{6.27}$$
$$\underline{Z}_b = \frac{\underline{Z}_1 \cdot \underline{Z}_2 + \underline{Z}_1 \cdot
\underline{Z}_3 + \underline{Z}_2 \cdot \underline{Z}_3}{\underline{Z}_1},$$
$$\underline{Z}_c = \frac{\underline{Z}_1 \cdot \underline{Z}_2 + \underline{Z}_1 \cdot
\underline{Z}_3 + \underline{Z}_2 \cdot \underline{Z}_3}{\underline{Z}_2}.$$
> **Diagram - Figure 6.6: Network transformations**
>
> **a) Series connection:** Two impedances $Z_1$ and $Z_2$ connected in series between two
terminals (nodes), represented as two impedance elements placed one after the other along a
single line.
>
> **b) Parallel connection:** Two impedances $Z_1$ and $Z_2$ connected in parallel between two
terminals (nodes), represented as two impedance elements placed in two parallel branches within
a box-like structure.
>
> **c) Delta-to-star (Δ→Y) transformation:** On the left side, a delta (triangle) network with three
impedances $Z_a$, $Z_b$, and $Z_c$ connected between three external nodes (vertices of the
triangle). An arrow indicates transformation to the right side, where an equivalent star (Y) network
is shown with three impedances $Z_1$, $Z_2$, and $Z_3$ connected from a common central node
to the three external terminals.
>
> **d) Star-to-delta (Y→Δ) transformation:** On the left side, a star (Y) network with three
impedances $Z_1$, $Z_2$, and $Z_3$ connected from a common central node to three external
terminals. An arrow indicates transformation to the right side, where an equivalent delta (triangle)
network is shown with three impedances $Z_a$, $Z_b$, and $Z_c$ connected between the three
external nodes.
**Fig. 6.6:** Network transformations
A página está em branco, sem conteúdo visível para transcrever.
# 7
# Neutral Point Treatment in Three-phase Networks
The main faults are the single-pole short circuit and the short circuit to ground. The short circuit to
ground is a conductive connection between a point in the network belonging to the operational
circuit and ground. Between 80 and 90 % of all faults in grounded networks are short circuits to
ground. If the short circuit currents are identical in all three conductors with a three-pole short
circuit, the fault is then symmetrical. In all other cases, the fault currents in the three conductors
are different and these faults are then asymmetrical. In addition, in three-phase networks various
so-called transverse faults are possible. Along with these transverse faults, line interruptions can

also occur. This results in longitudinal faults, which are however of no importance for short circuit
current calculations. For ground faults and short circuits to ground, the magnitude of the short
circuit current depends primarily on how the neutral point of the network is connected to ground.
The short circuit currents are determined by the voltage sources present in the network
(generators and motors) and by the network impedances. The requirement of an optimum and
inexpensive network can lead to different neutral point treatments. The expense for grounding
systems, network protection, network design, operating mode and size of the network is the
determining factor in the choice of neutral point treatment. The neutral point treatment also
affects the following parameters:
- Touch, step and grounding electrode voltages
- Single-pole short circuit currents
- Voltage stress
For the construction and operation of electrical systems, a knowledge of the grounding measures is
indispensable. The most
magnitude of the permissible touch voltage depends on the duration of the fault and is given in
Table C.3 of HD 637 S1. If the ground potential rise remains below 150 V, the condition is satisfied
and no further measures are required. Otherwise, additional measures must be undertaken. For a
fault with contact to ground, the type of neutral point grounding determines the magnitude of the
line-to-ground voltage and the magnitude of the currents flowing to ground. This section will
briefly discuss the principles of grounding systems and then deal with the different methods of
neutral point grounding in high voltage networks.
The project planner has to determine and observe the following parameters for the dimensioning
of grounding systems:
- Magnitude of the fault current (this parameter depends on the neutral point grounding of the
high voltage network. See Table 7.1).
- Duration of the fault (this parameter depends on the neutral point grounding of the high voltage
network).
- Characteristics of ground (measurement of the ground resistivity).
- Ground resistance.
- Correct choice and dimensioning of materials.
The design of grounding systems must satisfy four requirements:
- The mechanical strength and resistance to corrosion of the grounding electrode and protective
conductor, as well as their connections, must be ensured. These determine the minimum
dimensions for the grounding electrodes.
- The greatest fault current must be calculated and held under control from the thermal point of
view.
- Damage to objects and operational equipment (especially information technology) must be

avoided.
- The safety of persons with respect to voltages on grounding systems (touch voltages, parasitic
voltages) which occur at the time of the greatest ground fault current must be ensured.
The ground potential rises and touch voltages of a grounding system can be calculated from known
data. The fault current frequently divides in the system. For the calculation of the grounding
system parameters, it is necessary to consider all grounding electrodes and other grounding
systems. In accordance with HD 637 S1, for step voltages it is not necessary to define permissible
values. When a system satisfies the requirements with regard to the touch voltages, then no
dangerous step voltages can occur.
**Table 7.1:** Decisive currents for the dimensioning of grounding systems
| Type of high voltage network | | | Decisive for thermal loading | | Decisive for ground potential
rise and touch voltage |
|---|---|---|---|---|---|
| | | | Ground electrodes | Ground conductor | |
| Networks with isolated neutral point | | | - | $I''_{\text{kEE}}$ | $I_E = r \cdot I_C$ |
| Networks with ground-fault-neutralizer-grounded system | In systems with
ground-fault-neutralizer-grounded system | | - | $I''_{\text{kEE}}$ | $I_E = r \cdot \sqrt{I_L^2 +
I_{\text{Res}}^2}$ |
| | In systems without ground-fault-neutralizer-grounded system | | | | $I_E = r \cdot
I_{\text{Res}}$ |
| Networks with low resistance neutral point grounding | | | $I''_{\text{k1}}$ | $I''_{\text{k1}}$ |
$I_E$ |
| Networks with ground-fault-neutralizer-grounded and temporary low resistance neutral point
grounding | In systems in which temporary grounding takes place | | $I''_{\text{k1}}$ |
$I''_{\text{k1}}$ | $I_E$ |
| | In all other systems | With ground fault coil | - | $I''_{\text{kEE}}$ | $I_E = r \cdot \sqrt{I_L^2 +
I_{\text{Res}}^2}$ |
| | | Without ground fault coil | | | $I_E = r \cdot I_{\text{Res}}$ |
- $I_C$ &nbsp;&nbsp;&nbsp; Calculated or measured capacitive ground fault current.
- $I_{\text{Res}}$ &nbsp;&nbsp;&nbsp; Residual ground fault current. When the exact value is not
known, you can assume 10 % of $I_C$.
- $I_L$ &nbsp;&nbsp;&nbsp; Sum of the rated currents of parallel ground fault coils for the system
under discussion.
- $I''_{\text{k1}}$ &nbsp;&nbsp;&nbsp; Initial symmetrical short circuit current for a single-pole
ground fault, calculated in accordance with IEC 60909.
- $I''_{\text{kEE}}$ &nbsp;&nbsp;&nbsp; Double-line-to-ground fault, calculated in accordance with
IEC 60909 or HD533 (for $I''_{\text{kEE}}$ 85 % of the three-pole initial symmetrical short circuit
current can be used as the greatest value.
- $I_E$ &nbsp;&nbsp;&nbsp; Grounding current.
- r &nbsp;&nbsp;&nbsp; Reduction factor.

assume a part of the ground fault current from the particular circuit. This effect gives rise to the
effective relieving of a high voltage grounding system affected by a ground fault. The extent of this
relief is described by the reduction factor.
The reduction factor $r$ for an overhead ground wire in a three-phase current conductor is:
$$r = \frac{I_E}{3\,I_0} = \frac{3\,I_0 - I_{FW}}{3\,I_0}$$
The ground potential rise is
$$\underline{U}_E = \underline{Z}_E \cdot \underline{I}_E$$
In the event of a fault, the ground potential rise is
$$\underline{I}_E = r \cdot \sum 3 \cdot \underline{I}_0$$
The meanings of the symbols are:
| Symbol | Description |
|---|---|
| $I_{EW}$: | Current in the overhead ground ground wire in A |
| $U_E$ : | Ground potential rise in V |
| $I_E$ : | Grounding current in A |
| $3I_0$ : | Sum of the zero-sequence currents in A |
| $Z_E$ : | Grounding impedance in $\Omega$ |
We can differentiate between three types of neutral point treatment:
**7.1**
**Networks with isolated free neutral point**
The short circuit current to ground flows through the capacitances to ground $C_E$ of the
uninterrupted conductors (Figure 7.1). The short circuit currents to ground are small in this case
and in small networks are usually self-quenching, although large transient overvoltages can occur.
The potential of the neutral point relative to ground is determined by the capacitances $C_E$. The
short circuit current to ground $I_{CE}$ at the position of the short circuit is given by:
$$I_{CE} = 3 \cdot w \cdot C_E \frac{c \cdot U_n}{\sqrt{3}}\,. \tag{7.1}$$
The short circuit current to ground increases with the length of the conductor, so that the
operation of this type of network is restricted to smaller networks (up to 30 kV). The limiting value
of the short circuit current to ground is around 35 A, since otherwise the arcing is no longer
self-quenching.

7.2 Networks with grounding compensation **43**
> **Fig. 7.1:** Isolated network
[DIAGRAM - Fig. 7.1: Single-line schematic of an isolated network. On the left, a generator/source
block (Q) feeds a three-phase transformer (T) with three windings labeled W, V, U on the primary
side and w, v, u on the secondary side (transformer ratio t_r). The secondary neutral point N is
floating (not connected to ground). Three overhead line/cable feeders extend to the right, labeled
L3 (top), L2 (middle), and L1 (bottom). Along the lines, three shunt capacitances C_E are connected
between each phase and ground (earth, represented by the hatched symbol). At the far right end
of line L1, a ground fault is indicated (F), with the resulting capacitive earth-fault current I_CE
flowing from the fault point back through the ground to the distributed capacitances. No
intentional neutral grounding is present.]
**7.2**
**Networks with grounding compensation**
> **Fig. 7.2:** Ground fault neutralizer grounded system
[DIAGRAM - Fig. 7.2: Single-line schematic of a ground fault neutralizer (Petersen coil / resonant
grounded) network. Layout is identical to Fig. 7.1, with the same source Q, transformer T (windings
W/V/U and w/v/u, ratio t_r), three feeders L3, L2, L1, and distributed shunt capacitances C_E
between phases and ground. The key difference is at the neutral point N: a ground fault neutralizer
inductance coil L_D (Petersen coil) is connected between neutral N and earth. The inductive
current through L_D is labeled I_L (flowing upward from ground into N), and the
compensating/partial inductive current through the coil is labeled I_ESp. At the far right, a ground
fault at F on line L1 causes the residual fault current I_Last = I_C to flow at the fault location. The
total capacitive current I_C circulates through the ground back toward the transformer, while I_L
(the coil current) opposes it. The compensation condition I_C = I_L is achieved by tuning L_D to the
total network capacitance to ground.]
A network with grounding compensation is present when the neutral point is grounded through
ground fault coils in such a way that their inductance is matched to the capacitance to ground
(Figure 7.2). For the matching condition $I_C = I_L$:
$$I_C = 3 \cdot w \cdot C_E \frac{c \cdot U_n}{\sqrt{3}}, \text{ und } I_L = \frac{c \cdot
U_n}{\sqrt{3} \cdot w \cdot L} \tag{7.2}$$
Here, we refer to the ground fault current $I_F$ as the unbalanced residual current. The capacitive
short circuit to ground $I_C$ is compensated by the inductive coil current $I_L$ of the ground fault
quenching coils apart from a residual current. If the short circuit current to ground exceeds 35 A,

the network must be operated with grounding compensation. The residual current should not
exceed 60 A for medium voltage networks and 130 A for high voltage networks, in order to ensure
the self-quenching of the arcing and to keep the thermal stress under control. If this is not the case,
low impedance neutral point grounding must be used. Here too, overvoltages occur as for
networks with an isolated free neutral point.
**7.3**
**Networks with low impedance neutral point treatment**
In accordance with HD 63751, a network with low impedance neutral point grounding (Figure 7.3)
is present only when the neutral point of one or more transformers is directly grounded and the
network protection is designed so that in the event of a short circuit to ground at any arbitrary fault
position automatic cut-off must take place (protection by cut-off).
> **Figure 7.3 - Low-resistance grounded network (circuit diagram description):**
> The diagram shows a three-phase network with low-resistance neutral point grounding. On the
left side, there is a busbar/source Q connected to a transformer T with three windings labeled W
(top), V (middle), and U (bottom), and a transformation ratio indicated by $t_r$. The transformer
secondary neutral point N is directly connected to ground (earth). From the transformer, three
overhead lines or cables extend to the right, labeled L3 (top), L2 (middle), and L1 (bottom),
corresponding to phases w, v, and u respectively. Along the line, three capacitances $C_E$ are
shown connected between each phase and ground, representing the line-to-earth distributed
capacitances. At the far right end, a fault point F is indicated on phase L1, with a single-pole short
circuit current $I''_{k1}$ flowing to ground. The ground return path is shown at the bottom of the
diagram via the earth conductor (hatched ground symbol spanning the full width).
**Fig. 7.3:** Low-resistance grounded network
The fault to ground is described as a short circuit to ground and the fault current as short circuit
current to ground or single-pole short circuit current. The short circuit currents to ground are
however limited by the neutral point impedance ($Z_S = 20 \cdots 60\ \Omega$) to values below 5
kA. The ground fault factor $\delta = \frac{U_{LE}}{U/\sqrt{3}}$ will be introduced here to describe
the voltage conditions for the neutral point treatment, where $U_{LE}$ is the conductor-to-ground
voltage for a fault and U the operating voltage before the fault occurs. For a single-pole short
circuit current, then:
$$
I''_{k1} = \frac{\sqrt{3} \cdot c_{min} \cdot U_n}{Z_1 + Z_2 + Z_0}.
\tag{7.3}
$$

Table 7.2 gives an overview of neutral point arrangement on fault behavior in three-phase
high-voltage networks.
**Table 7.2: Arrangement of neutral point**
| Arrangement of neutral point (only one-phase shown) | Isolated | With arc suppression coil |
Current limiting | Low resistance ground |
|---|---|---|---|---|
| | *[Circuit diagram: Single-phase representation showing a transformer winding connected to
ground capacitance $C_E$, with dashed ground line - isolated neutral point configuration.]* |
*[Circuit diagram: Single-phase representation showing a transformer winding connected to a Coil
(arc suppression/Petersen coil) in parallel with ground capacitance $C_E$, with dashed ground
line.]* | *[Circuit diagram: Single-phase representation showing a transformer winding connected
to R or X in series, in parallel with ground capacitance $C_E$, with dashed ground line - current
limiting neutral point.]* | *[Circuit diagram: Single-phase representation showing a transformer
winding connected directly to ground through a low-resistance path, with ground capacitance
$C_E$ and dashed ground line.]* |
| Examples of use | Power plant auxiliaries | Overhead line | Cable network | High voltage |
| Fault current | $I_E < 40\ \text{A}$ | $I_\text{Rest} < 60\text{-}120\ \text{A}$ | e.g. $I''_{k1} = 2\
\text{kA}$ | high |
| Fault duration | $t > 2\ \text{h}$ | $t < 2\text{-}3\ \text{h}$ | $t \leq 1\text{-}3\ \text{s}$ | $t \leq
## 1\text{-}3\ \text{s}$ |
| Ground fault factor $\delta = U_{LE}/(U_{LL}/\sqrt{3})$ | $\delta \sim \sqrt{3}$ | $\delta \sim
\sqrt{3}$ | $\delta \sim 1.4\text{-}1.8$ | $\delta \leq 1.4$ |
| Over-voltage | $k \sim 2.5$ | $k \sim 3.0$ | $k < 2.5$ | $k < 2.5$ |
| Voltage rise | yes | yes | no | no |
| Ground fault arc | self-quenching up to several A | self-quenching | usually sustained | sustained
|
| Detection of fault | location by disconnection | location by disconnection | selective
disconnection | short circuit protection |
| **Where** | | | | |
| $\delta$: Ground fault factor | | $I''_{kEE}$: Double ground fault | | |
| $U_{LE}$: Conductor - ground voltage at fault occurrence | | $I''_{kEE}$: Two phase to ground
fault | | |
| $U_{LL}$: Operating voltage before fault occurrence | | $I''_{kEE}$: Phase to ground fault | | |
| $I_E\ $: Ground fault current | | | | |
| $I_\text{Rest}$: Residual current | | | | |
| $C_E\ $: Ground capacitance | | | | |
Table 7.3 shows an overview of application of neutral point arrangements.
**Table 7.3:** Application of neutral point arrangements

| **Neutral point selection** | **Ground fault factor $\delta$** | **Application** | **Results** |
|---|---|---|---|
| Direct grounding | $\leq 1.4$ | in low voltage power systems < 1 kV | short circuit protection
selective disconnection |
| | | in high voltage power systems > 110 kV | saving of insulation |
| Low resistance ground | 0.87 to 1.4 | medium voltage power systems for cable networks 10-30
kV | short circuit protection selective disconnection |
| With arc suppression coil | $> 1.4$ | overhead and cable networks up to 110 kV | location by
disconnection |
| Short circuited with suppression coil | first $> 1.4$ after short grounding $< 1.4$ | cable network
10-110 kV | first location by disconnection then disconnection |
# 8
# Impedances of Three-phase Operational Equipment
For the calculation of short circuit currents it is necessary to know conductor-specific equivalent
data and impedances of electrical operational equipment, which are usually given by the respective
manufacturer.
The calculation of short circuit currents is based on the use of equivalent circuits for the
operational equipment. In principle, the equivalent resistances and reactances must be determined
for all equipment. The impedances of generators, network transformers and power plant blocks
should take account of the impedance corrections for calculating the short circuit currents. For
generators, transformers and choke coils, the impedances and reactances are given in the *p.u.* or
in the %/*MVA* system. Cables and lines are however assigned Ohm/km values.
The impedances of operational equipment are described in detail in the following:
## 8.1
## Network feed-ins
> **[Fig. 8.1 - Network feed-in and equivalent circuit]**
>
> The figure shows two diagrams representing a network feed-in:
>
> **Top diagram (Single-line schematic):** A network source block labeled "Network Q"
(represented by a crossed-box symbol indicating an external network) is connected via a
three-phase line (shown with triple slash marks indicating a transformer or line section) to a busbar
point labeled "Q". The nominal voltage at the connection point is labeled $U_{nQ}$, and the initial
symmetrical short circuit power at that node is labeled $S''_{kQ}$.
>
> **Bottom diagram (Equivalent circuit):** The equivalent circuit of the network feed-in is shown
as a series connection of a resistance $R_Q$ and a reactance $X_Q$, connected between two
network terminals (represented by circle-cross symbols, i.e., ground/network reference symbols).
The output terminal is labeled "Q". This series R-X circuit models the Thevenin impedance of the
external network as seen from the point of connection Q.

**Fig. 8.1:** Network feed-in and equivalent circuit
The input is from a network, usually designated "Q" for source and not from a generator (Figure
8.1). The calculation of this network is performed with the initial symmetrical short circuit power
$S''_{kQ}$ or the initial symmetrical short circuit current $I''_{kQ}$ at the interface S.
The internal impedance of a high or medium voltage network can then be determined according
to:
$$
\underline{Z}_Q = R_Q + j\ X_Q,
$$
$$
Z_Q = \frac{c \cdot U_{nQ}}{\sqrt{3}\ I''_{kQ}},
$$
$$
Z_Q = \frac{c \cdot U_{nQ}^2}{S''_{kQ}}.
\tag{8.1}
$$
If the short circuit is fed through transformers, it is possible to further extend the above
relationships:
$$
Z_{Qt} = \frac{c \cdot U_{nQ}}{\sqrt{3} \cdot I''_{kQ}} \cdot \frac{1}{\ddot{u}_r^2},
$$
$$
Z_{Qt} = \frac{c \cdot U_{nQ}^2}{S''_{kQ}} \cdot \frac{1}{\ddot{u}_r^2},
\tag{8.2}
$$
$$
I''_{kQ} = \frac{c \cdot U_{nQt}}{\sqrt{3} \cdot Z_{Qt}}.
\tag{8.3}
$$
It is sufficient to calculate only with reactances in high voltage networks with a voltage of greater
than 35 kV, i.e. $Z = 0 + jX_Q$. In all other cases, the calculation proceeds as follows:
$$
X_Q = 0.995 \cdot Z_Q,
$$

$$
R_Q = 0.1 \cdot X_Q,
$$
$$
S''_{kQ} = \sqrt{3} \cdot U_{nQ} \cdot I''_{kQ}.
\tag{8.4}
$$
The meanings of the symbols are:
| Symbol | Description |
|---|---|
| $U_{nQ}$ | Nominal voltage of the network at the interface Q |
| $S''_{kQ}$ | Initial symmetrical short circuit power |
| $I''_{kQ}$ | Initial symmetrical short circuit current |
| $c$ | Voltage factor |
| $\ddot{u}$ | Rated value of transformation ratio for transformer with step switch set to principal
tapping |
| $Z_Q$ | Positive-sequence impedance of short circuit |
| $Z_{Qt}$ | Positive-sequence impedance relative to low voltage side of transformer |
| $R_Q$ | Resistance of power supply feeder |
| $X_Q$ | Reactance of power supply feeder |
## 8.2 Synchronous machines
Figure 8.2 illustrates the equivalent circuit for a synchronous machine. For a three-pole terminal
short circuit, only the two inductive reactances $X_h$ and $X_s$ occur. The magnitude of the short
circuit current therefore depends only on these reactances. Initially, the large peak short circuit
current occurs, which then decays to the steady state short circuit current. The DC aperiodic
component occurs here unchanged and decays in accordance with the decay constant. The
changed magnetic fields in different rotors induce voltages which in turn affect the stators. The
currents in the damper winding decay very quickly, because the equivalent resistances are very
large. We refer to these processes as subtransient (transpired quickly).
> **Fig. 8.2 - Synchronous machine and equivalent circuit**
>
> The figure shows two diagrams:
>
> **Top diagram:** A schematic symbol of a three-phase synchronous machine (SM, labeled with
"3" and a sine wave inside a circle), connected via a line with three diagonal slash marks (indicating
a three-phase connection) to an open terminal on the right. This represents the physical machine
connected to a bus or terminal point.
>
> **Bottom diagram:** The equivalent circuit of the synchronous machine. On the left side, a
three-phase voltage source (circle with "3" and a sine wave) represents the internal generated

voltage $U_p$, with an arrow pointing downward indicating its reference direction. In series with
this source are two passive elements: a resistor $R_G$ and an inductive reactance $X_G$
(represented as an inductor symbol). The series combination connects to two output terminals on
the right, across which the terminal voltage $U_k$ is indicated with a downward arrow. The circuit
forms a single-phase equivalent of the three-phase synchronous generator, showing the internal
EMF, armature resistance, and synchronous reactance in series, delivering voltage to the
short-circuit terminals.
**Fig. 8.2:** Synchronous machine and equivalent circuit
The initial symmetrical short circuit current is determined from the initial reactance:
$$I_k'' = \frac{U_{qE}}{X_d''}.$$
## (8.5)
The currents in the field winding decay slower due to the small resistance. We refer to this process
as transient (temporary) and determine this from the transient reactance:
$$I_k'' = \frac{U_{qE}}{X_d'},$$
## (8.6)
Finally, the continuous component resulting from the reactance of the main field is given here:
$$I_k = \frac{U_{qE}}{X_d''}.$$
## (8.7)
The initial reactance $X_d''$ of a synchronous machine determines the magnitude of the initial
symmetrical short circuit current.
For low voltage generators:
$$\underline{Z}_G = R_G + j \ X_d'',$$
## (8.8)
$$R_G = 0.12 \cdot X_d''.$$
## (8.9)
For high voltage generators $U_{RG} > 1$ kV:
For $S_{rG} \geq 100 \cdot$ MV A:
$$R_G = 0.05 \cdot j \ X_d''$$
## (8.10)
For $S_{rG} < 100 \cdot$ MV A:

$$R_G = 0.7 \cdot j \ X_d''. \quad \text{(8.11)}$$
The meanings of the symbols are:
| Symbol | Description |
|---|---|
| $X_d''$ | Initial reactance |
| $X_d'$ | Transient reactance |
| $X_d$ | Synchronous reactance |
| $X_0$ | Zero-sequence reactance |
| $Z_G$ | Impedance of generator |
| $S_{rG}$ | Rated power of generator |
| $R_G$ | Resistance of generator |
| $U_{rG}$ | Rated voltage of generator |
Table 8.1 below gives various values for the calculation of reactances.
**Table 8.1:** Relative characteristic values of synchronous generators
| **Machine type** | **Turbogenerator** | **Salient pole with damper winding** | **Salient
pole without damper winding** |
|---|---|---|---|
| Synchronous reactance ($x_d$) | 110 % to 280 % | 70 % to 170 % | 70 % to 170 % |
| Transient reactance ($x_d'$) | 14 % to 35 % | 20 % to 45 % | 20 % to 40 % |
| Initial reactance ($x_d''$) | 9 % to 22 % | 12 % to 30 % | 20 to 40 % |
| Zero-sequence reactance ($x_0$) | 3 % to 10 % | 5 % to 20 % | 5 % to 25 % |
*8.3 Transformers* **51**
## 8.3 Transformers
At this point, it is useful to explain the transformer and its equivalent circuit for the case of a short
circuit (Fig. 8.3).
> **Fig. 8.3: Transformer and equivalent circuit**
>
> The figure shows two representations of a transformer:
>
> **Top diagram (symbolic schematic):** A single-phase transformer labeled **T** is shown with
its primary side (HV - High Voltage) on the left and secondary side (LV - Low Voltage) on the right.
The primary winding is connected via terminals (open circles) with slash marks indicating the HV
connection. The transformer core and two coupled windings are depicted symbolically in the
center. The secondary side similarly terminates in an open-circuit terminal (LV side).
>
> **Bottom diagram (equivalent circuit):** The transformer is represented by its simplified series
equivalent circuit, consisting of:

> - A resistance $R_T$ (transformer winding resistance) in series with
> - A reactance $X_T$ (transformer leakage reactance),
> connected between the input terminal (left open circle) and the output terminal (right open
circle). This equivalent circuit referred to one side (typically the primary/HV side) models the
short-circuit behavior of the transformer.
The short circuit voltage $U_k$ is the primary voltage at which a transformer with short-circuited
secondary winding already takes up its primary rated current. $U_k$ is usually expressed as a
relative short circuit voltage in percent of the primary voltage. It is a measure for the loading of the
voltage change occurring. The following condition applies:
$$u_k = \frac{U_k \cdot 100\%}{U_{nHV}}, \tag{8.12}$$
When a short circuit occurs during operation of a transformer on the secondary side the peak short
circuit current $i_p$ first flows, which then gradually decays to the steady state short circuit
current. The magnitude of $i_p$ depends on the momentary value of the voltage and the magnetic
state of the iron core. The value of the steady state short circuit current $I_k$ depends on the short
circuit voltage $U_k$ and the internal resistance Z.
$$I_{kd} = \frac{U_{nHV}}{Z}, \tag{8.13}$$
$$Z = \frac{U_k}{I_{nLV}}, \tag{8.14}$$
$$U_{nHV} = \frac{U_k \cdot 100\%}{u_k}, \tag{8.15}$$
$$I_k = \frac{I_{nLV} \cdot 100\%}{u_k}. \tag{8.16}$$
## 8.3.1
### Short circuit current on the secondary side
The equivalent circuit of the positive-sequence, negative-sequence and zero-sequence system is
given by the number and the circuitry of the windings. The negative-sequence impedance is, due to
the phase angle, identical with the positive-sequence impedance. The positive-sequence
impedance of the transformer is calculated as follows:
$$Z_T = \frac{u_{kr}}{100\%} \cdot \frac{U_{rT}^2}{S_{rT}},\tag{8.17}$$
$$R_T = \frac{U_{Rr}}{100\%} \cdot \frac{U_{rT}^2}{S_{rT}} = \frac{P_{krT}}{3 \cdot
I_{rT}^2},\tag{8.18}$$
$$X_T = \sqrt{Z_T^2 - R_t^2}.\tag{8.19}$$
For low voltage transformers, the equivalent resistances and the inductive reactances in the
zero-sequence and positive-sequence systems are (Figure 8.4):

for the connection symbol Dyn5:
$$Z_{2T} = Z_{1T} \tag{8.20}$$
$$R_{0T} = R_T \tag{8.21}$$
$$X_{0T} = 0.95 \cdot X_T \tag{8.22}$$
for the connection symbols Dzn0 and Yzn11:
$$R_{0T} = 0.4 \cdot R_T \tag{8.23}$$
$$X_{0T} = 0.1 \cdot X_T \tag{8.24}$$
for the connection symbol YYn6:
$$R_{0T} = R_T \tag{8.25}$$
$$X_{0T} = 7 \cdots 100\ X_T \tag{8.26}$$
Transformers with three windings are employed in auxiliary service for the internal requirements
of power stations, in the industrial sector or as network transformers. The short circuit impedances
of transformers with three windings in the positive-sequence system can be calculated as follows,
in accordance with Figure 8.5:
*8.3 Transformers* **53**
> **[DIAGRAM: Fig. 8.4 - Equivalent resistances and reactances in the zero-sequence and
positive-sequence system for low voltage transformers]**
>
> The figure contains four sets of transformer diagrams, each corresponding to a different winding
vector group configuration. Each set shows the physical winding arrangement (left) and the
equivalent zero-sequence circuit (right).
>
> **1. Dyn5**
> - Left: Three-phase transformer with primary windings on phases T, S, R connected in delta (Δ),
with excitation impedance $Z_E$ and circulating current $I_F$ shown in the delta loop.
> - Right: Zero-sequence equivalent circuit showing series impedance $Z_{1T}$ on the primary side,
$Z_{2T}$ on the secondary side, and a shunt branch to ground labeled $Z_0 + 3\,\underline{Z}_E$.
The secondary (star with neutral) allows zero-sequence current to flow.
>
> **2. Dzn0**
> - Left: Three-phase transformer with primary windings on phases T, S, R in a zigzag-delta
arrangement; arrows indicate current direction through the windings.
> - Right: Zero-sequence equivalent circuit showing phases T, S, R with interconnected windings
(zigzag secondary) and fault current $I_F$ flowing to ground through the neutral.
>

> **3. Yzn11**
> - Left: Three-phase transformer with primary windings on phases T, S, R in star (Y) connection;
arrows indicate current direction.
> - Right: Zero-sequence equivalent circuit showing phases T, S, R with zigzag secondary windings
(zn), fault current $I_F$ flowing to ground through the neutral connection.
>
> **4. Yyn6**
> - Left: Three-phase transformer with primary windings on phases T, S, R in star (Y) connection; the
primary neutral is connected to a closed delta tertiary (shown as an oval with arrow indicating
circulating current).
> - Right: Zero-sequence equivalent circuit showing phases T (L3), S (L2), R (L1) on the secondary
star-with-neutral side, with excitation impedance $Z_E$ and fault current $I_F$ in the circulating
loop formed by the delta tertiary winding.
**Fig. 8.4:** Equivalent resistances and reactances in the zero-sequence and positive-sequence
system for low voltage transformers
**Fig. 8.5:** a) Circuit diagram for transformer with three windings and b) equivalent circuit
with side C open:
$$Z_{AB} = \frac{u_{krAB}}{100\%} \frac{U_{rTA}^2}{S_{rTAB}},\tag{8.27}$$
with side B open:

$$Z_{AC} = \frac{u_{krAC}}{100\%} \frac{U_{rTA}^2}{S_{rTAC}},\tag{8.28}$$
with side A open:
$$Z_{BC} = \frac{u_{krBC}}{100\%} \frac{U_{rTA}^2}{S_{rTBC}}.\tag{8.29}$$
*8.3 Transformers* **55**
With the positive-sequence short circuit impedances, it follows that:
$$Z_A = \frac{1}{2} \cdot (Z_{AB} + Z_{AC} - Z_{BC}), \tag{8.30}$$
$$Z_B = \frac{1}{2} \cdot (Z_{BC} + Z_{AB} - Z_{AC}), \tag{8.31}$$
$$Z_C = \frac{1}{2} \cdot (Z_{AC} + Z_{BC} - Z_{AB}). \tag{8.32}$$
The meanings of the symbols are:
| Symbol | Description |
|---|---|
| $U_{rT}$ | Rated voltage of transformer on higher or lower voltage side |
| $I_{rT}$ | Rated current of transformer on higher or lower voltage side |
| $U_{nHV}$ | Nominal voltage on higher voltage side |
| $I_{nLV}$ | Nominal voltage on lower voltage side |
| $U_k$ | Short circuit voltage |
| $S_{rT}$ | Rated apparent power of transformer |
| $P_{krT}$ | Total winding losses of transformer at rated current |
| $u_{kr}$ | Rated value of short circuit voltage in % |
| $u_{Br}$ | Rated value of resistive voltage drop in % |
| $R_{0T}$ | Zero-phase equivalent resistance of transformer |
| $R_T$ | Equivalent resistance of transformer |
| $X_{0T}$ | Inductive zero-sequence resistance of transformer |
| $X_T$ | Inductive resistance of transformer. |
The equivalent resistances and reactances of transformers can also be taken from Figure 8.6.
> **Fig. 8.6 - Equivalent resistances and reactances of transformers for low and medium voltage
networks [19]**
>
> **Description:** Log-log graph plotting the equivalent transformer reactance $X_T$ (solid lines)
and transformer resistance $R_T$ (dashed line) in milliohms (mΩ) on the vertical axis, against the
rated transformer apparent power $S_{rT}$ in kVA on the horizontal axis.
>
> - **Vertical axis (Y):** Impedance values in mΩ, ranging from 0.35 mΩ to 200 mΩ, with a

logarithmic scale. The left side also shows the ratio $\dfrac{R}{X}$ with an upward arrow indicating
increasing values.
>
> - **Horizontal axis (X):** Rated transformer power $S_{rT}$ in kVA, with values: 125, 160, 200,
250, 320, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 3200 kVA (logarithmic scale).
>
> - **Curves for $X_T$ (solid lines):** Multiple parallel diagonal lines, each corresponding to a
different short-circuit voltage percentage $u_{kr}$, labeled as:
> - $u_{kr} = 10\%$
> - $8\%$
> - $6\%$
> - $5\%$
> - $4\%$
> - $3\%$
>
> All lines have a negative slope (reactance decreases as rated power increases), consistent with
the relation $X_T = \dfrac{u_{kr}}{100} \cdot \dfrac{U_{rT}^2}{S_{rT}}$.
>
> - **Curve for $R_T$ (dashed line):** A single dashed diagonal line representing the transformer
resistance, also decreasing with increasing $S_{rT}$, and falling well below the $X_T$ curves,
indicating that transformer reactance dominates over resistance especially at higher power ratings.
>
> - **Legend (top right):**
> - $X_T$: Transformer reactance (solid line)
> - $R_T$: Transformer resistance (dashed line)
**Fig. 8.6:** Equivalent resistances and reactances of transformers for low and medium voltage
networks [19]
## 8.3.2
**Voltage regulating transformers**
For the compensation of voltage fluctuations in networks, the windings of transformers are
provided with a tap so that the transformation ratios can be adjusted in order to keep the voltage
for certain sections constant. Voltage regulating transformers can be divided into two groups:
controllable power transformers and series regulating transformers. Controllable transformers
have several taps on the voltage side to be regulated, with which the transformation ratio can be
increased or decreased in the same proportions, usually in steps of one or two percent. This is also
known as in-phase voltage control, since only the magnitude of the voltage is regulated. Voltage
regulation takes place step-wise with a switching device which can be described as a stepping
switch or stepping switch device. Switchover between the steps must take place under load, since
load-dependnet voltage fluctuations are regulated during operation. The transformation ratio of
the transformers is determined from the rated voltages. With stepping switches it is possible to
match the transformation ratio to the load. The transformation ratio can be calculated, taking into
account the step setting:

$$t = (1 + p_T) \cdot t_r$$
where, for $t_r$:
$$t_r = \frac{U_{rTHV}}{U_{rTLV}}$$
Regulating transformers are used, in addition to maintaining constant voltage levels, for controlling
the load flow. They too can be switched under load. These can be divided into quadrature control
transformers and phase-angle control transformers. For quadrature control transformers, an
additional voltage is generated which is phase shifted by 90° from the voltage of a conductor. The
additional voltage is added to the side on which the voltage is regulated. Phase-angle control
transformers are a combination of quadrature control transformers and in-phase control
transformers. Stepping regulators are implemented via power electronics components, which are
fast and require
**Table 8.2:** Characteristic values of high voltage transformers
| **Rated voltage $U_r$ (kV)** | **Rated power $S_{rT}$ (MVA)** | **Short circuit voltage
$u_{kr}$ (%)** | **Impedance losses $P_{krT}$ (%)** | **No-load losses $P_{0rT}$ (%)** |
**No-load current $i_{0rT}$ (%)** |
|---|---|---|---|---|---|
| $\leq 30$ | 2-4 | 6 | 0.9-0.8 | 0.17-0.14 | 1.3-1.1 |
| | 5-10 | 7 | 0.8-0.7 | 0.13-0.11 | 1.0-0.8 |
| | 12.5-40 | 10 | 0.6-0.4 | 0.08-0.06 | 0.8-0.5 |
| $30 < U_{\text{rTHV}} \leq 110$ | 6.3-10 | 10 | 0.9-0.8 | 0.18-0.14 | 0.9-0.8 |
| | 12.5-40 | 12 | 0.8-0.5 | 0.10-0.07 | 0.8-0.5 |
| | 50, 60 | 13 | 0.4 | 0.06 | 0.5-0.05 |
| | 80 | 14 | 0.5 | 0.05 | 0.45-0.05 |
| 110 | 100-350 | 12-16 | 0.31-0.19 | 0.05-0.03 | 0.45-0.05 |
| $110 < U_{\text{rTHV}} \leq 220$ | 100-1000 | 10-20 | 0.32-0.19 | 0.065-0.035 | 0.47-0.04 |
| $220 < U_{\text{rTHV}} \leq 380$ | 100-1000 | 11-20 | 0.4-0.2 | 0.07-0.04 | 0.48-0.04 |
**8.4**
**Cables and overhead lines**
The short circuit impedances for low voltage networks can be taken from the tables of IEC 60 909
that the cross-section is known.
> **Fig. 8.7 - Cables and lines in the positive-sequence system**
>
> The figure shows three schematic representations of electrical lines between terminals A and B:
>

> 1. **Cable** - A single-line diagram showing a cable between nodes A and B, represented by a
horizontal line with a triple-slash symbol (///) in the middle, indicating a cable element.
>
> 2. **Overhead line or cable** - A single-line diagram similar to the first, between nodes A and B,
also with a triple-slash symbol (///) but labeled as an overhead line or cable.
>
> 3. **Equivalent circuit** - A single-line diagram between nodes A and B showing the
lumped-parameter equivalent model of the line, with a series resistance $R_L$ (represented as a
rectangle/box) followed by a series reactance $X_L$ (represented as a coil/inductor symbol),
modeling the resistive and inductive components of the cable or overhead line.
For cables and line (Figures 8.7 and 8.8), we can then calculate the determining values as follows:
$$\underline{Z}_L = R_L + j X_L, \tag{8.33}$$
$$R_L = l \cdot R'_L, \tag{8.34}$$
$$X_L = l \cdot X'_L. \tag{8.35}$$
Length-specific values for overhead lines:
Resistance in Ω/km:
$$R_L = \frac{l}{\kappa \cdot S},\tag{8.36}$$
The zero-sequence resistances of lines can be calculated from:
$$R_{0L} = \frac{R_{0L}}{R_L} \cdot R_L,\tag{8.37}$$
$$X_{0L} = \frac{R_{0L}}{R_L} \cdot X_L.\tag{8.38}$$
> **Figure 8.8a - Equivalent circuit of an overhead line (π-model):**
> A single-phase equivalent circuit of an overhead line using the nominal-π model. The series
branch contains the line resistance $R_L$ (represented as a resistor) and the line reactance $X_L$
(represented as an inductor), connected in series along the top conductor. At both the sending and
receiving ends, shunt branches are connected between the top conductor and the return (bottom)
conductor. Each shunt branch consists of the insulation/leakage resistance $R_a$ in parallel with
half the line's total capacitance $C_b/2$. This symmetric π-arrangement splits the total shunt
capacitance equally between both ends of the line.
> **Figure 8.8b - 4x conductor bundle line cross-section:**
> A circular arrangement of four sub-conductors forming a bundle conductor. The four
sub-conductors are equally spaced around a circle of radius $r_T$, with the bundle spacing
(centre-to-centre distance between adjacent sub-conductors) denoted $a_T$. The overall bundle
diameter and sub-conductor spacing $a_T$ are indicated by arrows in both horizontal and vertical

directions.
> **Figure 8.8c - 2x conductor bundle line cross-section:**
> A simplified cross-section showing two sub-conductors side by side, separated by a
centre-to-centre distance $a_T$, representing a 2x conductor bundle configuration.
> **Figure 8.8d - Mast (tower) diagram for a double-circuit overhead line:**
> A schematic elevation view of a transmission tower (mast) showing the arrangement of
conductors on both sides of the tower. On the left side, conductors are numbered 1, 2, 3 (from left
to right toward the tower centre); on the right side, the mirrored conductors are labelled 3′, 2′, 1′.
A ground wire (earth wire) is shown at the apex of the tower. The horizontal distances between
conductors are indicated: $d_{12}$ (between conductors 1 and 2), $d_{23}$ (between conductors
2 and 3), and $d_{13}$ (the total distance between conductors 1 and 3). The ground level is
represented by a hatching line at the base.
**Fig. 8.8:** Basis of calculation for overhead lines a) equivalent circuit of an overhead line, b) 4x
conductor bundle line, c) 2x conductor bundle line, d) mast diagram
Inductive load reactance in **Ω**/km:
$$X_L = \omega \cdot L_b = \frac{\omega \cdot \mu_0}{2 \cdot \pi} \left( \ln \frac{d}{r} + \frac{l}{4
\cdot n} \right). \tag{8.39}$$
Double line:
$$X_L = \omega \cdot L_b = \frac{\omega \cdot \mu_0}{2 \cdot \pi} \left( \ln \frac{d \cdot d'}{r_e
\cdot d''} + \frac{l}{4 \cdot n} \right). \tag{8.40}$$
## Permeability:
$$\mu_0 = 4 \cdot \pi \cdot 10^{-4} \, Vs/(A \cdot m). \tag{8.41}$$
Equivalent radius:
$$r_e = \sqrt[n]{n \cdot r \cdot R^{n-1}}. \tag{8.42}$$
Average geometrical distance between conductors:
$$d = \sqrt[3]{d_{12} \cdot d_{23} \cdot d_{31}}, \tag{8.43}$$
$$d' = \sqrt[3]{d'_{12} \cdot d'_{23} \cdot d'_{31}}, \tag{8.44}$$
$$d'' = \sqrt[3]{d''_{11} \cdot d''_{22} \cdot d''_{33}}. \tag{8.45}$$
Equivalent capacitive reactance in **Ω**/km:

$$C_b = \frac{2 \cdot \pi \cdot \varepsilon_0}{\ln \frac{d \cdot d'}{r \cdot d''}}, \tag{8.46}$$
$$X_b = \frac{1}{\omega \cdot C_B} \tag{8.47}$$
The meanings of the symbols are:
- $a_T$ &nbsp;&nbsp; Distance of conductor elements
- $C_b$ &nbsp;&nbsp; Load capacitance
- $d$ &nbsp;&nbsp;&nbsp;&nbsp; Average geometrical distance between three conductors or
between center points of conductor bundles
- $L_b$ &nbsp;&nbsp; Load inductance
- $n$ &nbsp;&nbsp;&nbsp;&nbsp; Number of conductor elements
- $r$ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Conductor radius
- $r_e$ &nbsp;&nbsp;&nbsp; Equivalent radius
- $R$ &nbsp;&nbsp;&nbsp;&nbsp; Radius of conductor element
- $R_L$ &nbsp;&nbsp; Effective resistance of a conductor
- $S$ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cross-section
- $X_L$ &nbsp;&nbsp; Inductive load reactance
- $\mu_0$ &nbsp;&nbsp;&nbsp; Permeability.
The impedance values for overhead lines, cables and conductors are generally available from the
respective manufacturers. If no information is available, the following tables 8.2 to 8.18 can be
used.
**Table 8.3:** Impedances for PVC-insulated three-phase NYY cables [20]
| Cross-section of conductor *S* | $3\frac{1}{2}$ and $4\frac{1}{2}$-Conductive cable |
4/5-Conductive cable | 1-Conductive cable with PE, separated | 1-Conductive cable with PE,
bundled |
|---|---|---|---|---|
| | | **Cu conductor** | | |
| $mm^2$ | $m\Omega/m$ | $m\Omega/m$ | $m\Omega/m$ | $m\Omega/m$ |
| 0.5 | - | 107.2 | - | - |
| 0.75 | - | 71.5 | - | - |
| 1 | - | 53.6 | - | - |
| 1.5 | - | 35.7 | - | - |
| 2.5 | - | 21.44 | - | - |
| 4 | - | 13.4 | - | - |
| 6 | - | 8.93 | - | - |
| 10 | - | 5.36 | - | - |
| 16 | - | 3.35 | - | - |

| 25 | 3.11 | 2.15 | 3.13 | 3.12 |
| 35 | 2.23 | 1.54 | 2.25 | 2.24 |
| 50 | 1.56 | 1.08 | 1.60 | 1.59 |
| 70 | 1.12 | 0.78 | 1.17 | 1.16 |
| 95 | 0.84 | 0.59 | 0.89 | 0.88 |
| 120 | 0.67 | 0.47 | 0.74 | 0.72 |
| 150 | 0.55 | 0.39 | 0.63 | 0.61 |
| 185 | 0.45 | 0.33 | 0.56 | 0.53 |
| 240 | 0.37 | 0.27 | 0.49 | 0.46 |
| 300 | 0.31 | 0.24 | 0.45 | 0.42 |
| | | **Al-Leiter = Al conductor** | | |
| 16 | - | 5.70 | - | - |
| 25 | - | 3.64 | - | - |
| 35 | - | 2.60 | - | - |
| 50 | - | 1.83 | - | - |
| 70 | - | 1.31 | - | - |
| 95 | - | 0.97 | - | - |
| 120 | - | 0.77 | - | - |
| 150 | 0.90 | 0.63 | 0.96 | 0.94 |
| 185 | 0.74 | 0.52 | 0.80 | 0.79 |
| 240 | 0.58 | - | 0.66 | 0.64 |
| 300 | - | - | 0.57 | 0.55 |
**Table 8.4:** Resistance values for PVC-insulated four-conductor and five-conductor cables with
Cu conductor at 55 °C conductor temperature [20]
| **Cross-section of conductor** $S$ $mm^2$ | **Resistance** $r$ $m\Omega/m$ |
**Reactance** $x$ $m\Omega/m$ | **Impedance** $z$ $m\Omega/m$ |
|---|---|---|---|
| $4 \times 0.5$ | 81.90 | 0.23 | 81.90 |
| $4 \times 0.75$ | 55.74 | 0.23 | 55.74 |
| $4 \times 1$ | 41.18 | 0.23 | 41.18 |
| $4 \times 1.5$ | 27.53 | 0.23 | 27.53 |
| $4 \times 2.5$ | 16.86 | 0.22 | 16.96 |
| $4 \times 4$ | 10.49 | 0.21 | 10.49 |
| $4 \times 6$ | 7.01 | 0.20 | 7.01 |
| $4 \times 10$ | 4.16 | 0.19 | 4.16 |
| $4 \times 16$ | 2.62 | 0.18 | 2.63 |
| $4 \times 25$ | 1.654 | 0.176 | 1.663 |
| $4 \times 35$ | 1.192 | 0.160 | 1.203 |
| $4 \times 50$ | 0.880 | 0.159 | 0.894 |
| $4 \times 70$ | 0.610 | 0.155 | 0.629 |

| $4 \times 95$ | 0.440 | 0.154 | 0.466 |
| $4 \times 120$ | 0.348 | 0.151 | 0.379 |
| $4 \times 150$ | 0.282 | 0.151 | 0.320 |
| $4 \times 185$ | 0.226 | 0.151 | 0.272 |
| $4 \times 240$ | 0.172 | 0.149 | 0.228 |
| $4 \times 300$ | 0.136 | 0.149 | 0.202 |
For PVC-insulated cables with aluminum conductors,
multiply the resistance value R′ by the factor 1.7.
**Table 8.5:** Resistance values for PVC-insulated $3\frac{1}{2}$ and $4\frac{1}{2}$ conductor
three-phase cables with Cu conductors at 55 °C conductor temperature [20]
| **Cross-section of conductor** $S$ $mm^2$ | **Resistance** $r$ $m\Omega/m$ |
**Reactance** $x$ $m\Omega/m$ | **Impedance** $z$ $m\Omega/m$ |
|---|---|---|---|
| $3 \times 25/16$ | 2.135 | 0.182 | 2.143 |
| $3 \times 35/16$ | 1.904 | 0.183 | 1.913 |
| $3 \times 50/25$ | 1.267 | 0.179 | 1.279 |
| $3 \times 70/35$ | 0.901 | 0.174 | 0.918 |
| $3 \times 95/50$ | 0.660 | 0.168 | 0.681 |
| $3 \times 120/70$ | 0.479 | 0.160 | 0.505 |
| $3 \times 150/70$ | 0.446 | 0.167 | 0.476 |
| $3 \times 185/95$ | 0.333 | 0.163 | 0.371 |
| $3 \times 240/120$ | 0.260 | 0.164 | 0.307 |
| $3 \times 300/150$ | 0.209 | 0.162 | 0.264 |
For PVC-insulated cables with aluminum conductors,
multiply the resistance value R′ by the factor 1.7.
**Table 8.6:** Resistance values for PVC-insulated single-conductor three-phase cables with PE or
PEN, next to each other, with Cu conductors at 55 °C conductor temperature [20]
| **Cross-section of conductor** $S$ $mm^2$ | **Resistance** $r$ $m\Omega/m$ |
**Reactance** $x$ $m\Omega/m$ | **Impedance** $z$ $m\Omega/m$ |
|---|---|---|---|
| $1 \times 25/16$ | 2.1350 | 0.390 | 2.170 |
| $1 \times 35/16$ | 1.904 | 0.377 | 1.941 |
| $1 \times 50/25$ | 1.267 | 0.373 | 1.321 |
| $1 \times 70/35$ | 0.901 | 0.366 | 0.973 |
| $1 \times 95/50$ | 0.660 | 0.333 | 0.739 |
| $1 \times 120/70$ | 0.479 | 0.330 | 0.582 |
| $1 \times 150/70$ | 0.446 | 0.327 | 0.553 |

| $1 \times 185/95$ | 0.333 | 0.326 | 0.466 |
| $1 \times 240/120$ | 0.260 | 0.320 | 0.412 |
| $1 \times 300/150$ | 0.209 | 0.328 | 0.381 |
For PVC-insulated cables with aluminum conductors,
multiply the resistance value R′ by the factor 1.7.
**Table 8.7:** Resistance values for PVC-insulated single-conductor three-phase cables with PE or
PEN, at distance *d* from each other, with Cu conductors at 55 °C conductor temperature [20]
| **Cross-section of conductor** $S$ $mm^2$ | **Resistance** $r$ $m\Omega/m$ |
**Reactance** $x$ $m\Omega/m$ | **Impedance** $z$ $m\Omega/m$ |
|---|---|---|---|
| $1 \times 25/16$ | 2.135 | 0.390 | 2.170 |
| $1 \times 35/16$ | 1.904 | 0.377 | 1.941 |
| $1 \times 50/25$ | 1.267 | 0.373 | 1.321 |
| $1 \times 70/35$ | 0.901 | 0.366 | 0.973 |
| $1 \times 95/50$ | 0.660 | 0.362 | 0.753 |
| $1 \times 120/70$ | 0.479 | 0.359 | 0.599 |
| $1 \times 150/70$ | 0.446 | 0.356 | 0.571 |
| $1 \times 185/95$ | 0.333 | 0.354 | 0.486 |
| $1 \times 240/120$ | 0.260 | 0.349 | 0.435 |
| $1 \times 300/150$ | 0.209 | 0.347 | 0.405 |
For PVC-insulated cables with aluminum conductors,
multiply the resistance value R′ by the factor 1.7.
**Table 8.8:** Resistance values at 80 °C for Cu cables and conductors [24]
| **Cross-section of conductor S in mm²** | **Copper Resistance r mΩ/km** | **Copper
Reactance x mΩ/km** | **Copper Impedance z mΩ/km** | **Aluminum Resistance r mΩ/km** |
**Aluminum Reactance x mΩ/km** | **Aluminum Impedance z mΩ/km** |
|---|---|---|---|---|---|---|
| $4 \times 1.5$ | 15 | 0.115 | 15 | - | - | - |
| $4 \times 2.5$ | 9.02 | 0.110 | 9.02 | - | - | - |
| $4 \times 4$ | 5.654 | 0.106 | 5.654 | - | - | - |
| $4 \times 6$ | 3.757 | 0.100 | 3.758 | - | - | - |
| $4 \times 10$ | 2.244 | 0.094 | 2.264 | - | - | - |
| $4 \times 16$ | 1.413 | 0.090 | 1.415 | - | - | - |
| $4 \times 25$ | 0.895 | 0.086 | 0.899 | 1.68 | 0.086 | 1.682 |
| $4 \times 35$ | 0.649 | 0.083 | 0.654 | 1.226 | 0.083 | 1.228 |
| $4 \times 50$ | 0.479 | 0.083 | 0.486 | 0.794 | 0.083 | 0.798 |
| $4 \times 70$ | 0.332 | 0.082 | 0.341 | 0.551 | 0.082 | 0.557 |

| $4 \times 95$ | 0.239 | 0.082 | 0.252 | 0.396 | 0.082 | 0.404 |
| $4 \times 120$ | 0.192 | 0.080 | 0.208 | 0.316 | 0.080 | 0.325 |
| $4 \times 150$ | 0.153 | 0.080 | 0.172 | 0.257 | 0.080 | 0.270 |
| $4 \times 185$ | 0.122 | 0.080 | 0.146 | 0.203 | 0.080 | 0.221 |
| $4 \times 240$ | 0.093 | 0.079 | 0.122 | 0.155 | 0.079 | 0.173 |
| $4 \times 300$ | 0.074 | 0.079 | 0.108 | 0.124 | 0.079 | 0.147 |
**Table 8.9:** Resistance values at 20 °C for Cu cables and conductors [24]
| **Cross-section of conductor S in mm²** | **Copper Resistance r mΩ/km** | **Copper
Reactance x mΩ/km** | **Copper Impedance z mΩ/km** | **Aluminum Resistance r mΩ/km** |
**Aluminum Reactance x mΩ/km** | **Aluminum Impedance z mΩ/km** |
|---|---|---|---|---|---|---|
| $4 \times 1.5$ | 12.1 | 0.114 | 12.1 | - | - | - |
| $4 \times 2.5$ | 7.28 | 0.110 | 7.28 | - | - | - |
| $4 \times 4$ | 4.56 | 0.106 | 4.56 | - | - | - |
| $4 \times 6$ | 3.03 | 0.100 | 3.03 | - | - | - |
| $4 \times 10$ | 1.81 | 0.0945 | 1.812 | - | - | - |
| $4 \times 16$ | 1.14 | 0.0895 | 1.143 | - | - | - |
| $4 \times 25$ | 0.722 | 0.0879 | 0.729 | 1.20 | 0.088 | 1.203 |
| $4 \times 35$ | 0.524 | 0.0851 | 0.530 | 0.876 | 0.086 | 0.880 |
| $4 \times 50$ | 0.387 | 0.0848 | 0.396 | 0.641 | 0.084 | 0.646 |
| $4 \times 70$ | 0.268 | 0.0819 | 0.280 | 0.443 | 0.082 | 0.450 |
| $4 \times 95$ | 0.193 | 0.0819 | 0.209 | 0.320 | 0.082 | 0.330 |
| $4 \times 120$ | 0.155 | 0.0804 | 0.174 | 0.253 | 0.080 | 0.265 |
| $4 \times 150$ | 0.124 | 0.0804 | 0.147 | 0.206 | 0.080 | 0.220 |
| $4 \times 185$ | 0.0991 | 0.0804 | 0.127 | 0.164 | 0.080 | 0.182 |
| $4 \times 240$ | 0.0754 | 0.0797 | 0.109 | 0.125 | 0.079 | 0.147 |
| $4 \times 300$ | 0.0601 | 0.0797 | 0.998 | 0.100 | 0.079 | 0.127 |
**Table 8.10:** Resistances per unit length *r* in positive-sequence system for overland line
conductors manufactured in accordance with DIN 48 201 and $f = 50\ Hz$ at 20 °C [7]
| Cross-section of conductor S in mm² | Nominal cross-section S in mm² | Copper r in Ω/km |
Aluminum r in Ω/km |
|---|---|---|---|
| 10 | 10 | 1.804 | 2.855 |
| 16 | 15.9 | 1.134 | 1.795 |
| 25 | 24.2 | 0.745 | 1.18 |
| 35 | 34.4 | 0.524 | 0.83 |
| 50 | 49.5 | 0.364 | 0.577 |
| 70 | 65.8 | 0.276 | 0.436 |

| 95 | 93.2 | 0.195 | 0.308 |
| 120 | 117 | 0.155 | 0.246 |
**Table 8.11:** Inductive reactances per unit length *x* in $\Omega/km$ in positive-sequence
system for overland line conductors at $f = 50\ Hz$ [7]
| Cross-section of conductor S in mm² | Average distance d between conductors in cm | | | | | |
|---|---|---|---|---|---|---|
| | **50** | **60** | **70** | **80** | **90** | **100** |
| 10 | 0.37 | 0.38 | 0.40 | 0.40 | 0.41 | 0.42 |
| 16 | 0.36 | 0.37 | 0.38 | 0.38 | 0.40 | 0.40 |
| 25 | 0.34 | 0.35 | 0.37 | 0.37 | 0.38 | 0.39 |
| 35 | 0.33 | 0.33 | 0.35 | 0.36 | 0.37 | 0.38 |
| 50 | 0.32 | 0.32 | 0.34 | 0.35 | 0.36 | 0.37 |
| 70 | 0.31 | 0.32 | 0.33 | 0.34 | 0.35 | 0.35 |
| 95 | 0.29 | 0.31 | 0.32 | 0.33 | 0.34 | 0.34 |
| 120 | 0.29 | 0.30 | 0.31 | 0.32 | 0.33 | 0.34 |
**Table 8.12:** Quotients of effective resistances and inductive reactances in the zero-sequence
and positive-sequence systems for NAYY and NYY cables as a function of the ground return system
at $f = 50\ Hz$ [7]
| *S* in mm² | | $\dfrac{R_{OL}}{R_L}$ | | | | $\dfrac{X_{OL}}{X_L}$ | | |
|---|---|---|---|---|---|---|---|---|
| | **Copper** | | **Aluminum** | | **Copper** | | **Aluminum** | |
| | *a* | *c* | *a* | *c* | *a* | *c* | *a* | *c* |
| $4 \times 1.5$ | 4.0 | 1.03 | - | - | 3.99 | 21.28 | - | - |
| $4 \times 2.5$ | 4.0 | 1.05 | - | - | 4.01 | 21.62 | - | - |
| $4 \times 4$ | 4.0 | 1.11 | - | - | 3.98 | 21.36 | - | - |
| $4 \times 6$ | 4.0 | 1.21 | - | - | 4.03 | 21.62 | - | - |
| $4 \times 10$ | 4.0 | 1.47 | - | - | 4.02 | 20.22 | - | - |
| $4 \times 16$ | 4.0 | 1.86 | - | - | 3.98 | 17.09 | - | - |
| $4 \times 25$ | 4.0 | 1.35 | - | - | 4.13 | 12.97 | - | - |
| $4 \times 35$ | 4.0 | 2.71 | 4.0 | 2.12 | 3.78 | 10.02 | 4.13 | 15.47 |
| $4 \times 50$ | 4.0 | 2.95 | 4.0 | 2.48 | 3.76 | 7.61 | 3.76 | 11.99 |
| $4 \times 70$ | 4.0 | 3.18 | 4.0 | 2.84 | 3.66 | 5.68 | 3.66 | 8.63 |
| $4 \times 95$ | 4.0 | 3.29 | 4.0 | 3.07 | 3.65 | 4.63 | 3.65 | 6.51 |
| $4 \times 120$ | 4.0 | 3.35 | 4.0 | 3.19 | 3.65 | 4.21 | 3.65 | 5.53 |
| $4 \times 150$ | 4.0 | 3.38 | 4.0 | 3.26 | 3.65 | 3.94 | 3.65 | 4.86 |
| $4 \times 185$ | 4.0 | 3.41 | 4.0 | 3.32 | 3.65 | 3.74 | 3.65 | 4.35 |
| $4 \times 240$ | 4.0 | 3.42 | - | - | 3.67 | 3.62 | - | - |
| $4 \times 300$ | 4.0 | 3.44 | - | - | 3.66 | 3.52 | - | - |

a Ground return system through fourth conductor
c Ground return system through fourth conductor and ground
**Table 8.13:** Resistances $r$ per unit length of conductors for copper conductors
| *Cross-section of conductor* $S$ in mm² | *20 °C* Ω/km | *30 °C* Ω/km |
|---|---|---|
| 1.5 | 12.1 | 12.57 |
| 2.5 | 7.41 | 7.56 |
| 4 | 4.61 | 4.73 |
| 6 | 3.08 | 3.15 |
| 10 | 1.83 | 1.88 |
| 16 | 1.15 | 1.18 |
| 25 | 0.727 | 0.75 |
| 35 | 0.524 | 0.54 |
| 50 | 0.387 | 0.40 |
| 70 | 0.268 | 0.28 |
| 95 | 0.193 | 0.20 |
| 120 | 0.153 | 0.16 |
| 150 | 0.124 | 0.13 |
| 185 | 0.0991 | 0.10 |
**Table 8.14:** Impedance *z* for main outgoing and return lines of power supply companies
| *Impedance* | |
|---|---|
| **Cross-section of conductor (NYM or NYY) S in mm²** | **z m Ω/m** |
| 1.5 | 0.03001 |
| 2.5 | 0.01838 |
| 4 | 0.01131 |
| 6 | 0.00752 |
| 10 | 0.00449 |
| 16 | 0.00284 |
| 25 | 0.00180 |
| 35 | 0.00131 |
| 50 | 0.00098 |
| 70 | 0.00069 |
| 95 | 0.00052 |
**Table 8.15:** Resistances of conductors in XLPE-insulated cables (6 to 30 kV) at 20 °C [26]
| **Cross-section of conductor S in mm²** | **Copper conductor Ω/km** | **Aluminum
conductor Ω/km** |

|---|---|---|
| 25 | 0.727 | 1.20 |
| 35 | 0.524 | 0.868 |
| 50 | 0.387 | 0.641 |
| 70 | 0.268 | 0.443 |
| 95 | 0.193 | 0.320 |
| 120 | 0.153 | 0.253 |
| 150 | 0.124 | 0.206 |
| 185 | 0.0991 | 0.164 |
| 240 | 0.0754 | 0.125 |
| 300 | 0.0601 | 0.100 |
| 400 | 0.0470 | 0.0778 |
| 500 | 0.0366 | 0.0605 |
**Table 8.16:** Resistances per unit length of XLPE-insulated copper cables (6 to 20 kV) for *f* =
50 *Hz* [26]
| *Cross-section of conductor S in mm²* | *6/10 kV* | | *12/20 kV* | |
|---|---|---|---|---|
| | *single-conductors on top of each other* | *single-conductors next to each other* |
*single-conductors on top of each other* | *single-conductors next to each other* |
| 35 | 0.671 | 0.673 | 0.671 | 0.672 |
| 50 | 0.497 | 0.498 | 0.496 | 0.498 |
| 70 | 0.345 | 0.346 | 0.345 | 0.346 |
| 95 | 0.249 | 0.251 | 0.249 | 0.250 |
| 120 | 0.198 | 0.200 | 0.198 | 0.200 |
| 150 | 0.163 | 0.165 | 0.163 | 0.165 |
| 185 | 0.132 | 0.134 | 0.131 | 0.133 |
| 240 | 0.102 | 0.104 | 0.101 | 0.103 |
| 300 | 0.082 | 0.085 | 0.082 | 0.084 |
| 400 | 0.068 | 0.071 | 0.067 | 0.070 |
| 500 | 0.055 | 0.058 | 0.055 | 0.058 |
**Table 8.17:** Inductances of XLPE-insulated copper cables (6 to 30 kV) for *f* = 50 *Hz* [26]
| *Cross-section of conductor S in mm²* | *6/10 kV* | | *12/20 kV* | | *18/30 kV* | |
|---|---|---|---|---|---|---|
| | *mh/km* | *mh/km* | *mh/km* | *mh/km* | *mh/km* | *mh/km* |
| 35 | 0.45 | 0.76 | 0.48 | 0.76 | - | - |
| 50 | 0.42 | 0.73 | 0.45 | 0.74 | 0.48 | 0.75 |
| 70 | 0.39 | 0.70 | 0.43 | 0.70 | 0.45 | 0.71 |
| 95 | 0.38 | 0.67 | 0.41 | 0.68 | 0.43 | 0.68 |

| 120 | 0.36 | 0.65 | 0.39 | 0.65 | 0.42 | 0.66 |
| 150 | 0.35 | 0.63 | 0.38 | 0.63 | 0.41 | 0.64 |
| 185 | 0.34 | 0.61 | 0.36 | 0.62 | 0.39 | 0.63 |
| 240 | 0.32 | 0.59 | 0.35 | 0.59 | 0.37 | 0.60 |
| 300 | 0.31 | 0.57 | 0.33 | 0.58 | 0.36 | 0.59 |
| 400 | 0.30 | 0.55 | 0.33 | 0.55 | 0.34 | 0.56 |
| 500 | 0.29 | 0.53 | 0.31 | 0.53 | 0.33 | 0.54 |
**Table 8.18:** Effective capacitances of XLPE-insulated copper cables [26]
| **Nominal voltage** | **6/10 kV** | **12/20 kV** | **18/30 kV** |
|---|---|---|---|
| **Cross-section of conductor S in mm²** | **μF/km** | **μF/km** | **μF/km** |
| 35 | 0.22 | 0.16 | - |
| 50 | 0.25 | 0.18 | 0.14 |
| 70 | 0.28 | 0.20 | 0.15 |
| 95 | 0.31 | 0.22 | 0.17 |
| 120 | 0.34 | 0.23 | 0.18 |
| 150 | 0.37 | 0.25 | 0.19 |
| 185 | 0.40 | 0.27 | 0.20 |
| 240 | 0.44 | 0.30 | 0.22 |
| 300 | 0.48 | 0.32 | 0.24 |
| 400 | 0.55 | 0.36 | 0.27 |
| 500 | 0.60 | 0.40 | 0.29 |
**Table 8.19:** Ground fault currents of XLPE-insulated copper cables [26]
| **Nominal voltage** | **6/10 kV** | **12/20 kV** | **18/30 kV** |
|---|---|---|---|
| **Cross-section of conductor S in mm²** | **A/km** | **AF/km** | **A/km** |
| 35 | 1.2 | 1.7 | - |
| 50 | 1.4 | 1.9 | 2.3 |
| 70 | 1.5 | 2.1 | 2.5 |
| 95 | 1.7 | 2.4 | 2.7 |
| 120 | 1.9 | 2.6 | 2.9 |
| 150 | 2.0 | 2.7 | 3.1 |
| 185 | 2.2 | 3.0 | 3.3 |
| 240 | 2.4 | 3.3 | 3.7 |
| 300 | 2.6 | 3.5 | 4.0 |
| 400 | 3.0 | 4.0 | 4.4 |
| 500 | 3.3 | 4.3 | 4.8 |

**8.5**
**Short circuit current limiting**
The short circuit current limiting choke coils (Figure 8.9) are used to limit the current flowing as a
result of a fault condition in series systems with insufficient stability against short circuits. They are
used in order to reduce the breaking capacity of the circuit breakers to a permissible value.
The following conditions apply here:
$$X_R = \frac{u_{kR}}{100\%} \cdot \frac{U_n}{\sqrt{3} \cdot I_{rR}},\tag{8.48}$$
$$R_R \ll X_R.\tag{8.49}$$
> **[Figure Description - Fig. 8.9: Short circuit current limiting choke coil and equivalent circuit]**
>
> The figure contains two circuit diagrams stacked vertically:
>
> **Top diagram (Physical representation of choke coil):**
> A single-line circuit showing two terminal nodes (circles) connected in series. Between the
terminals, there is a series combination of: a resistive element represented by diagonal hash marks
(///), followed by an iron-core inductor symbol (a curved coil over a set of parallel lines indicating a
magnetic core). The component is labeled "Choke coil" below the diagram.
>
> **Bottom diagram (Equivalent circuit of choke coil):**
> A single-line equivalent circuit showing two terminal nodes (circles) connected in series. Between
the terminals, there are two series elements:
> - A resistor labeled $R_R$ (drawn as a rectangular box)
> - An inductor/reactance labeled $X_R$ (drawn as a coiled/wave symbol)
>
> Together these represent the simplified electrical equivalent model of the choke coil, with $R_R$
being the resistance and $X_R$ the reactance of the coil.
**Fig. 8.9:** Short circuit current limiting choke coil and equivalent circuit
The meanings of the symbols are:
$X_R$ - Reactance of choke coil
$U_n$ - Nominal power line voltage
$R_R$ - Resistance of choke coil
$u_{kR}$ - Rated voltage drop of choke coil (given on nameplate)
$I_{rR}$ - Rated current of choke coil (given on nameplate)

**8.6**
**Asynchronous machines**
Asynchronous motors (Fig. 8.10) have filed conditions similar to those of synchronous motors
following a short circuit across the terminal.
The equivalent circuit consists of an internal voltage source and an impedance. The value of this
impedance can be calculated as follows:
$$Z_M = \frac{1}{I_{an}/I_{rM}} \cdot \frac{U_{rM}}{\sqrt{3} \cdot I_{rM}} = \frac{1}{I_{an}/I_{rM}}
\cdot \frac{U_{rM}^2}{S_{rM}},\tag{8.50}$$
$$S_r M = \frac{P_{rM}}{\eta_r \cdot \cos \varphi_r} \tag{8.51}$$
> **Fig. 8.10 - Asynchronous machine and its equivalent circuit**
>
> The figure shows two diagrams:
>
> **Top diagram:** A symbolic representation of a three-phase asynchronous machine (ASM). On
the left, a circle labeled "ASM" with "3~" inside (indicating a three-phase AC machine) is connected
via a line with three diagonal slashes (representing a three-phase cable or bus) to an open terminal
on the right.
>
> **Bottom diagram:** The per-phase equivalent circuit of the asynchronous motor. From the left
terminal, a series branch contains a resistance $R_M$ (represented as a rectangle) followed by a
reactance $X_M$ (represented as an inductor/coil symbol). This series branch connects to a
voltage source on the right side, labeled $\dfrac{c \cdot U_n}{\sqrt{3}}$, with the arrow pointing
downward, representing the equivalent voltage source of the network. The bottom rail connects
back to the left terminal, completing the single-phase equivalent circuit loop.
**Fig. 8.10:** Asynchronous machine and equivalent circuit
The meanings of the symbols are:
| Symbol | Description |
|---|---|
| $Z_M$ | Impedance of motor |
| $U_{rM}$ | Rated voltage of motor |
| $I_{rM}$ | Rated current of motor |
| $S_{rM}$ | Rated apparent power of motor |
| $P_{rM}$ | Rated effective power of motor |
| $I_{an}/I_{rM}$ | Ratio of locked-rotor current to rated current of motor. |

**8.7**
**Consideration of capacitors and non-rotating loads**
The short circuit currents are determined with the aid of the equivalent voltage source. Not
considered here are the load flow before the occurrence of the short circuit, the capacitances of
the conductors, the passive loads, the position of the step switch of transformers and the state of
the exciter of the generators. Independently of the point in time at which the short circuit occurs,
the discharge current of the parallel capacitors can be neglected for the calculation of $i_p$. The
influence of the series capacitors can also be neglected if these are provided with voltage limiting
systems connected in parallel, which respond in the event of a short circuit.
## 8.8
**Consideration of static converters**
For the calculation of short circuit currents static converters are treated similarly to asynchronous
motors. Reversing mechanisms supplied from a static converter contribute only to the initial
symmetrical short circuit current and the peak short circuit current.
# 9
# Impedance Corrections
The magnitude of the short circuit currents in a network depends primarily on the design of the
network, the generators or power station blocks and the motors operating and secondarily on the
operating state of the network before occurence of the short circuit. It is therefore difficult to find
the loading state which leads to either the greatest or the smallest short circuit current at the
different fault locations of the network. IEC 60 909 consequently recommends the method of
calculation with the equivalent voltage source $c \cdot U_n / \sqrt{3}$ at the fault location.
Investigations have shown that the voltage factor $c$ is no longer sufficient for calculating the
maximum short circuit current when the sub-transient behavior of the generators, power station
blocks with or without step switches and network transformers is considered. The factor $c$ in
Table 1.1 shows that on the average the highest voltage in a normal network does not deviate by
more than about +5 % for low voltage an +10 % for higt voltage from the network voltage
$\text{U}_\text{n}$. In a common network with 50 or 60 Hz the highest and lowest voltage do not
differ by more than ±10 % from the network voltage. In the North American countries, the highest
voltage differs by no more than +5 % and the lowest voltage -10 % from the network voltage [1].
The conditions of Section 1.4.1 apply only when the voltage differences in a network are less than
10 %. Special conditions can occur for generators and power station blocks with high values of
$x''_d$, $u_k$, causing voltage drops of more than +10 %. For this reason the introduction of
impedance correction factors is necessary, above all in order to obtain reliable values for the
determination of the greatest short circiut current.

For the dimensioning of electrical operational equipment the calculation of the greatest short
circuit current and the greatest partial short circuit current is necessary. In this section we will
discuss the required correction factors.
For the calculation of the largest short circuit current and the transferred short circuit current it is
necessary to make corrections to the generator impedances ($K_G$) and the power plant block
impedances ($K_{KW}$) in addition to the factor $c_{max}$, especially when the subtransient
reactances $x''_d$ of the generators are large and the transformation ratio of the block
transformers differs from the network voltages during operation on both sides of the transformer
[1]. The calculation of the smallest short circuit current requires special considerations, such as:
**76** | *9 Impedance Corrections*
- the smallest power supplied for thermal power stations
- the largest reactive power of machine units for pumping power stations
- special equipment for limiting the load angle
- Loading state of power station units during low-load periods.
**9.1**
**Correction factor *K*_G for generators**
The impedance correction factor $K_G$ is applied to the impedance of generators connected
directly to the network (Figure 9.1).
> **[Figure 9.1 - Top diagram]:** Single-line schematic showing a three-phase generator (labeled
"3 G" with a circle symbol) connected directly to the network via a bus. A fault location is indicated
at the right end of the bus by a diagonal arrow/slash symbol.
>
> **[Figure 9.1 - Bottom diagram (Equivalent Circuit)]:** The equivalent circuit of the generator
shows:
> - A series branch consisting of a resistance $K_G R_G$ (rectangle symbol) and a reactance $K_G
X_G$ (inductor/coil symbol) connected in series.
> - At the right end, an AC voltage source (circle with sine wave) representing the internal EMF
equal to $\dfrac{c \cdot U_n}{\sqrt{3}}$.
> - The short-circuit current $\underline{I}''_k$ flows downward from the junction point to the
reference node labeled "01".
> - The overall circuit represents the Thevenin equivalent of the generator as seen from the fault
point, with corrected impedance elements.
**Fig. 9.1:** Connection and equivalent circuit of a generator
$K_G$ is derived from the overexcited generator, taking account of the subtransient reactance
$X''_d$ and subtransient internal voltage $\underline{E}''$ [1]. The impedance of the generator in
the positive-phase system is:

$$\underline{Z}_G = R_G + jX''_d, \tag{9.1}$$
$$\underline{Z}_{(GK)} = K_G \cdot \underline{Z}_G = K_G(R_G + jX''_d), \tag{9.2}$$
With the correction factor:
$$K_G = \frac{U_n}{U_{rG}} \cdot \frac{c_{max}}{(1 + x''_d \cdot \sin\varphi_{rG})}. \tag{9.3}$$
9.2 Correction factor K_KW for power plant block **77**
In accordance with IEC 60 909, for three-pole short circuit currents with direct connection to the
network:
$$I_k'' = \frac{c \cdot U_n}{\sqrt{3} \cdot |R_G + jk\, X_d''| \cdot K_G}.$$
## (9.4)
Substituting the correction factor in the above equation then yields:
$$I_k'' = \frac{c}{c_{max}} \cdot \frac{U_{rG}}{\sqrt{3} \cdot |R_G + jk\, X_d''|} \cdot (1 + x_d''
\cdot \sin\varphi_{rG}).$$
## (9.5)
For salient-pole machines with different values for $X_d''$ and $X_q''$, we introduce:
$$X_{(2)G} = \frac{1}{2}(X_d'' + X_q''),$$
## (9.6)
$$Z_{(0)G} = K_G(R_{(0)G} + jk\, X_{(0)G}).$$
## (9.7)
The meanings of the symbols are:
| Symbol | Meaning |
|---|---|
| $c_{max}$ | Voltage factor |
| $U_n$ | Nominal voltage of network |
| $U_{rG}$ | Rated voltage of generator |
| $Z_{GK}$ | Corrected impedance of generator |
| $Z_G$ | Impedance of generator |
| $x_d''$ | Subtransient reactance of generator |
| $\varphi_{rG}$ | Phase angle between $U_{rG}/\sqrt{3}$ and $I_{rG}$. |

**9.2**
**Correction factor *K*_KW for power plant block**
For the determination of the impedance correction factor $K_{KW}$ as in Figure 9.2, the following
considerations are necessary [1].
- Whether the block transformer is equipped with a step switch or with a higher transformation
ratio
- Whether the rated voltages of the generator and the low voltage side of the block transformer are
different
- Whether the rated apparent powers of the generator and transformer are also different.
**78** | *9 Impedance Corrections*
> **Diagram Description:**
> The figure shows a single-line electrical diagram for impedance correction of a block transformer
configuration. On the left, the "Network input" feeds into a busbar at node Q, characterized by
maximum short-circuit apparent power $S''_{kQmax}$ and minimum impedance
$\underline{Z}_{Qmin}$, with nominal voltage $U_{nQ}$. A transformer (shown with star-delta
symbol, Y-Δ winding) connects the network to the generator side. On the right side, a three-phase
synchronous generator G (3~) with rated voltage $U_{rG}$ is connected. Short-circuit currents
$I''_{kT}$ (at transformer output) and $I''_{kG}$ (at generator terminals) are indicated with arrows
at fault point F1. Below the generator, an Auxiliary Transformer (AT) is connected via another fault
point F1, feeding a low-voltage bus at nominal voltage $U_{nA}$, with short-circuit current
$I''_{kAT}$ indicated.
**Fig. 9.2:** Impedance correction for block transformer
The voltage control is implemented either on the high voltage side of the transformer or via the
inherent voltage regulation of the generator. Here, it is necessary to distinguish between a
transformer with and without step switching.
Block transformer with step switch:
$$\underline{Z}_{KW} = K_{MS} \cdot (t_r^2 \cdot \underline{Z}_G + \underline{Z}_{THV}),
\tag{9.8}$$
$$K_{with} = \frac{U_{nQ}^2}{U_{rG}^2} \cdot \frac{1}{t_r^2} \cdot \frac{c_{max}}{1 + |x_d'' - x_T|
\cdot \sin\varphi_{rG}}. \tag{9.9}$$
Block transformer without step switch:
$$\underline{Z}_{KW} = K_{HV} \cdot (t_r^2 \cdot \underline{Z}_G + \underline{Z}_{THV}),
\tag{9.10}$$
$$K_{without} = \frac{U_{nQ}}{U_{rG}} \cdot \frac{1}{1+p_G} \cdot \frac{1}{t_r} \cdot (1+p_T)
\cdot \frac{c_{max}}{1 + x_d'' \cdot \sin\varphi_{rG}}. \tag{9.11}$$

**9.3**
**Correction factor *K*_T for transformers with two and three windings**
The correction factor $K_T$ for transformers with two and three windings in accordance with IEC
73/89/CDV can be calculated as follows.
For transformers with two windings, with or without step switching:
$$\underline{Z}_T = R_T + j\, X_T \tag{9.12}$$
$$\underline{Z}_{TK} = K_T \cdot \underline{Z}_T \tag{9.13}$$
$$K_T = 0.95\, \frac{c_{max}}{1 + 0.6\, x_T} \tag{9.14}$$
$$x_T = \frac{X_T}{(U_{rT}^2 / S_{rT})} \tag{9.15}$$
For transformers with three windings, with or without step switching:
$$K_{TAB} = 0.95 \cdot \frac{c_{max}}{1 + 0.6\, x_{TAB}} \tag{9.16}$$
$$K_{TAC} = 0.95 \cdot \frac{c_{max}}{1 + 0.6\, x_{TAC}} \tag{9.17}$$
$$K_{TBC} = 0.95 \cdot \frac{c_{max}}{1 + 0.6\, x_{TBC}} \tag{9.18}$$
The meanings of the symbols are:
| Symbol | Meaning |
|---|---|
| $Z_{KW}$ | Corrected impedance of power plant block for high voltage side |
| $Z_G$ | Impedance of generator |
| $\underline{Z}_{THV}$ | Impedance of block transformer for high voltage side |
| $t_r$ | Rated value of transformation ratio for transformer with step switch set to principal
tapping |
| $\underline{Z}_{T,KW}$ | Corrected impedance of block transformer |
| $\underline{Z}_{G,KW}$ | Corrected impedance of generator |
| $1 + p_T$ | This value is introduced when the block transformer has tappings and is used
continuously. Otherwise $1 + p_T = 1$ |
| $K_{with}$ | Correction factor with step switch |
| $K_{without}$ | Correction factor without step switch |
| $x_T$ | Relative reactance of transformer. |
**80** *9 Impedance Corrections*
Table 9.1 shows a summary of impedance corrections.
**Table 9.1** Impedance corrections

| *Appliances* | *Impedance* | *Corrections* |
|---|---|---|
| Generator | $\underline{Z}_{GK} = \underline{Z}_G \cdot K_G$ | $K_G = \dfrac{U_n}{U_{rG}}
\cdot \dfrac{c_{\max}}{1 + x_d''\sin\varphi_{rG}}$ |
| Transformer | $\underline{Z}_{TK} = \underline{Z}_T \cdot K_T$ | $K_T = \dfrac{U_n}{U_{rT}}
\cdot \dfrac{c_{\max}}{1 + x_T\!\left(I_T^b/I_{rT}\right)\!\sin\varphi_T^b}$ |
| | | $K_T = 0.95 \cdot \dfrac{c_{\max}}{1+0.6x_T}$ |
| Power plant with tapping change (*TC*) | $\underline{Z}_S = K_{STC} \cdot \left(t_r^2
\underline{Z}_G + \underline{Z}_{THV}\right)$ | $K_{STC} = \dfrac{U_{nQ}^2}{U_{rG}^2} \cdot
\dfrac{U_{sTLV}^2}{U_{rTHV}^2} \cdot \dfrac{c_{\max}}{1 + \lvert x_d'' - x_T \rvert
\sin\varphi_{rG}}$ |
| Power plant without tapping change (*WTC*) | $\underline{Z}_S = K_{SWTC}\!\left(t_r^2
\underline{Z}_G + \underline{Z}_{THV}\right)$ | $K_{SWTC} = \dfrac{U_{nQ}}{U_{rG}(1+p_G)} \cdot
\dfrac{U_{rTLV}}{U_{rTHV}} \dfrac{(1\pm p_T)c_{\max}}{1 + x_d''\sin\varphi_{rG}}$ |
# 10
# The Method of Symmetrical Components
The method of symmetrical components is used for the calculation of asymmetrical faults. This
section discusses the fundamentals of this method. A characteristic rotational operator is a
complex number with the magnitude 1. Multiplication with a rotational operator therefore
describes the rotation of an arbitrary phasor without changing its magnitude. From the set of
complex numbers we know the rotational operator $j = \sqrt{-1}$, which gives rise to a rotation by
90°. Accordingly, $j^2 = -1$ then gives rise to a rotation by 180° and $j^4$ brings the phasor back to
its original position. In three-phase systems the phase angles $\varphi = 120°$ and 240° are of
special importance.
Figure 10.1 shows a symmetrical system, which consists of three unit phasors separated by angles
of 120°.
> **Fig. 10.1 - Phasor diagram for the positive-sequence, negative-sequence and zero-sequence
systems.**
>
> The diagram shows a unit circle in the complex plane (Re-Im axes). Three unit phasors are drawn
from the origin, each separated by 120°:
> - Phasor $\underline{a}$: pointing to the upper-left quadrant, at 120° from the positive real axis.
> - Phasor $\underline{a}^2$: pointing to the lower-left quadrant, at 240° (or −120°) from the
positive real axis.
> - Phasor $\underline{a}^3$: pointing along the positive real axis (Re), at 0° (equivalent to 1).
>
> Each consecutive phasor is separated by 120°, as indicated by the angle labels $120^0$ between
each pair of adjacent phasors. The imaginary axis (Im) is vertical and the real axis (Re) is horizontal.
**Fig. 10.1:** Phasor diagram for the positive-sequence, negative-sequence and zero-sequence
systems

The rotational operator for $\varphi = 120°$ is designated $\underline{a}$ and accordingly that for
240° is designated $\underline{a}^2$, so that:
$$\underline{a} = e^{j120} = e^{j\frac{2\pi}{3}} = \frac{1}{2}(1 - j\sqrt{3}) \tag{10.1}$$
$$\underline{a}^2 = e^{j240} = e^{j\frac{4\pi}{3}} = \frac{1}{2}(1 - j\sqrt{3}) \tag{10.2}$$
$$\underline{a}^3 = 1 \tag{10.3}$$
As can be seen easily from the above equations, their sum is equal to zero:
$$1 + \underline{a} + \underline{a}^2 = 0 \tag{10.4}$$
With the rotational operators $\underline{a}$ and $\underline{a}^2$ the symmetrical three-phase
system belongs to the set of complex numbers.
$$\underline{U}_R = U_R, \tag{10.5}$$
$$\underline{U}_S = a^2 \cdot U_R, \tag{10.6}$$
$$\underline{U}_T = \underline{a} \cdot U_R. \tag{10.7}$$
For the voltages in the external conductors:
$$\underline{U}_{RS} = \underline{U}_R - \underline{U}_S = \sqrt{3} \cdot U_R \cdot e^{j30}
\tag{10.8}$$
$$\underline{U}_{ST} = \underline{U}_S - \underline{U}_T = \sqrt{3} \cdot U_R \cdot e^{j270}
\tag{10.9}$$
$$\underline{U}_{TR} = \underline{U}_T - \underline{U}_R = \sqrt{3} \cdot U_R \cdot e^{j150}
\tag{10.10}$$
**10.1**
**Symmetrical components**
Symmetrical faults are calculated from the equivalent circuit in the positive-sequence system. The
network is thereby reduced to a single conductor and drawn as a single-phase system. Three-pole
short circuits load the network symmetrically. For other types of short circuits, it is no longer
possible to use the positive-sequence system because the network is loaded asymmetrically. It is
here that the method of symmetrical components is well suited. For each conductor of a
three-phase system, the corresponding equations (currents or voltages in the conductors) are
written. Asymmetrical operation can be the result of network loading, a short circuit to ground, line
interruptions or switching mechanisms.

The voltages and currents at the position of the short circuit are determined by the geometrical
addition of the symmetrical component currents and voltages.
With this method, the three-phase network is resolved into three independent single-phase
systems, namely the positive-sequence, negative-sequence and zero-sequence systems.
The impedances of these three systems can then be given for individual operational systems at a
fault position.
According to the position of the fault, unequal currents can arise in the conductors. The equivalent
single-phase circuit can then no longer be used. The transformation of the original R (L1),S (L2),T
(L3) to a symmetrical image space with the coordinates 1,2,0 is therefore necessary (method of
symmetrical components).
The use of symmetrical components is illustrated in Figure 10.2. The procedure which the method
entails will now be discussed in detail [16, 18].
> **[DIAGRAM - Fig. 10.2, upper part: Three-phase network schematic]**
> A single-line diagram of a three-phase network is shown. From left to right: a transformer symbol
(grid/source side, represented by a hatched box) connects through bus Q to a transformer block
labeled T (with High voltage on the left side and Low voltage on the right side), then to bus A, and
finally to a fault location indicated by an open-switch/fault symbol on the right. Below this
single-line diagram, a phasor decomposition is illustrated showing that the asymmetrical current
system in RST space (with phasors $I_{1R}$, $J_{1S}$, $J_{1T}$ forming an unbalanced three-phase
star) is equal to the sum of three symmetrical component systems:
> - **Positive-sequence system** (balanced, direct-sequence): phasors $I_{1R}$, $J_{1S}$,
$J_{2S}$ (120° apart, positive rotation).
> - **Negative-sequence system** (balanced, inverse-sequence): phasors $I_{2R}$, $J_{2S}$,
$J_{2T}$ (120° apart, negative rotation).
> - **Zero-sequence system** (all in phase): phasors $I_{0R}$, $I_{0S}$, $I_{0T}$ (all pointing in the
same direction).
> The decomposition is shown symbolically as: asymmetrical = positive-sequence +
negative-sequence + zero-sequence.
> **[DIAGRAM - Fig. 10.2, lower part: Phasor diagram of symmetrical components]**
> A detailed phasor diagram is shown with all component phasors drawn from a common origin.
The diagram illustrates how the phase currents $I_R$, $I_S$, and $I_T$ in RST space are each
obtained by the vector addition of their respective symmetrical components:
> - $I_R = I_{1R} + I_{2R} + I_{0R}$
> - $I_S = I_{1S} + I_{2S} + I_{0S}$
> - $I_T = I_{1T} + I_{2T} + I_{0T}$
> Each resultant phasor ($I_R$, $I_S$, $I_T$) and all individual component phasors ($I_{1R}$,
$I_{2R}$, $I_{0R}$, $I_{1S}$, $I_{2S}$, $I_{0S}$, $I_{1T}$, $I_{2T}$, $I_{0T}$) are depicted with
arrows radiating from the common center point, clearly showing the vector summation

relationships.
**Fig. 10.2** Schematic of a three-phase network and relationship between components of
positive-sequence, negative-sequence and zero-sequence systems:
Steps in calculation:
- Draw the three-phase network with asymmetrical fault in RST space.
- Summarize the fault conditions.
- Draw the equivalent single-phase circuit in 120° space.
- Calculate the currents and voltages in image space.
- Calculate the asymmetrical fault currents in the original space.
$$\underline{I}_R = \underline{I}_{1R} + \underline{I}_{2R} + \underline{I}_{0R}, \tag{10.11}$$
$$\underline{I}_S = \underline{I}_{1S} + \underline{I}_{2S} + \underline{I}_{0S},$$
$$\underline{I}_T = \underline{I}_{1T} + \underline{I}_{2T} + \underline{I}_{0T},$$
$$\underline{I}_{0R} = \underline{I}_{0S} + \underline{I}_{0T} + \underline{I}_0. \tag{10.12}$$
Calculations in 120° space:
$$\underline{I}_{1S} = \underline{I}_{1R} \cdot \underline{a}^2, \tag{10.13}$$
$$\underline{I}_{1T} = \underline{I}_{1R} \cdot \underline{a},$$
$$\underline{I}_{2S} = \underline{I}_{2R} \cdot \underline{a},$$
$$\underline{I}_{2T} = \underline{I}_{2T} \cdot \underline{a}^2,$$
$$\underline{I}_{0R} = \underline{I}_{0S} \cdot \underline{I}_{0T}.$$
Fault currents in the original space:
$$\underline{I}_R = \underline{I}_{1R} + \underline{I}_{2R} + \underline{I}_{0R}, \tag{10.14}$$
$$\underline{I}_S = \underline{I}_{1R} \cdot \underline{a}^2 + \underline{I}_{2R} \cdot
\underline{a} + \underline{I}_{0R},$$
$$\underline{I}_T = \underline{I}_{1T} \cdot \underline{a} + \underline{I}_{2R} \cdot
\underline{a}^2 + \underline{I}_{0R}. \tag{10.15}$$

In matrix notation, we then have:
$$\begin{bmatrix} \underline{I}_R \\ \underline{I}_S \\ \underline{I}_T \end{bmatrix} = \frac{1}{3}
\cdot \begin{bmatrix} 1 & 1 & 1 \\ \underline{a}^2 & \underline{a} & 1 \\ \underline{a} &
\underline{a}^2 & 1 \end{bmatrix} \cdot \begin{bmatrix} \underline{I}_{1R} \\ \underline{I}_{2R} \\
\underline{I}_{0R} \end{bmatrix}. \tag{10.16}$$
Inverse transformation from the image space to the original space:
$$I_{RST} = T \cdot I_{120} \tag{10.17}$$
With this transformation we can transform the unknown current components with the matrix T to
the actual currents in the components:
$$
\underline{I}_{1R} = \frac{1}{3} \cdot (\underline{I}_R + \underline{I}_S \cdot \underline{a} +
\underline{I}_T + \cdot \underline{a}^2), \tag{10.18}
$$
$$
\underline{I}_{2R} = \frac{1}{3} \cdot (\underline{I}_R + \underline{I}_S \cdot \underline{a}^2 +
\underline{I}_T + \cdot \underline{a}),
$$
$$
\underline{I}_{0R} = \frac{1}{3} \cdot (\underline{I}_R + \underline{I}_S + \underline{I}_T).
\tag{10.19}
$$
In matrix notation, this yields:
$$
\begin{bmatrix} I_{1R} \\ I_{2R} \\ I_{0R} \end{bmatrix} = \frac{1}{3} \cdot \begin{bmatrix}
\underline{1} & \underline{a} & \underline{a}^2 \\ \underline{1} & \underline{a}^2 & \underline{a}
\\ 1 & 1 & 1 \end{bmatrix} \cdot \begin{bmatrix} I_R \\ I_S \\ I_T \end{bmatrix}.
$$
## (10.20)
$$
I_{120} = S \cdot I_{RST} \tag{10.21}
$$
We are now in a position to calculate the asymmetrical currents and voltages, where:

$$
## S = T^{-1}.\tag{10.22}
$$
**10.2 Impedances of symmetrical components**
Only three-phase short circuits load the network symmetrically. Here it is sufficient to calculate
with the "positive-sequence system". In all other cases it is necessary to use the method of
symmetrical components in order to consider the negative-sequence and zero-sequence systems
as well.
The method of symmetrical components is based on the principle of superposition. The
determination of the voltage and current components requires equivalent single-phase circuits,
which during symmetrical operation of the network are fully decoupled from each other.
The three impedances of the component systems are summarized here briefly (Figure 10.3).
> **Fig. 10.3 - Equivalent circuits for positive-sequence, negative-sequence, and zero-sequence
systems**
>
> The figure shows three separate single-phase equivalent circuits side by side, each representing
one sequence network:
>
> - **Left circuit (Positive-sequence):** A three-phase voltage source (labeled 3~) drives current
$I_1$ through series impedance $Z_1$. The terminal voltage across the load port is $U_1$. The
source symbol indicates a symmetrical positive-sequence (direct-sequence) three-phase generator.
>
> - **Middle circuit (Negative-sequence):** A three-phase voltage source (labeled 3~) drives
current $I_2$ through series impedance $Z_2$. The terminal voltage is $U_2$. This network
represents the negative-sequence (inverse-sequence) system.
>
> - **Right circuit (Zero-sequence):** A single-phase voltage source (labeled 1~) drives a current
labeled $3I_0$ through series impedance $Z_0$. The terminal voltage is $U_0$. The factor of 3 on
the current reflects the fact that all three zero-sequence currents are equal and in phase, summing
in the neutral/return conductor.
- Positive-phase impedance $Z_1$ (index m or 1)
A symmetrical positive-sequence system with normal phase angle is present.
The equivalent circuit and the data for the operational equipment are identical with the data for
the equivalent single-phase circuit for the calculation of the three-pole short circuit.
- Negative-sequence impedance $Z_2$ (index i or 2)

A symmetrical negative-sequence system is present.
The negative-sequence impedance is the same as the positive-sequence impedance for operational
equipment without load. The impedances are different when the machines are operating.
- Negative-sequence impedance $Z_0$ (index 0)
A system consisting of three currents of equal value and having the same phase angle is present if
we take the three main conductors connected in parallel for the outgoing line and a fourth
conductor as a common return line and apply an AC voltage. Three times the zero-sequence
current flows in this return line.
The circuitry of the neutral point is considered in the zero-sequence impedance as follows:
- not grounded
- grounded through a ground fault neutralizer coil
- grounded through resistances or reactance
- direct grounding.
Under the assumption that the symmetrical components for current and voltage are physically real
values, then they must be related through general physical laws. It must then be possible to assign
an impedance to each of the three component systems according to Ohm's law.
Positive-sequence impedance:
$$\underline{Z}_{(1)} = \frac{\underline{U}_{(1)}}{\underline{I}_{(1)}}, \tag{10.23}$$
Negative-sequence impedance:
$$\underline{Z}_{(2)} = \frac{\underline{U}_{(2)}}{\underline{I}_{(2)}}\,, \tag{10.24}$$
Zero-sequence impedance:
$$\underline{Z}_{(0)} = \frac{\underline{U}_{(0)}}{\underline{I}_{(0)}}\,. \tag{10.25}$$
Furthermore, it is possible to define equivalent circuits for the three component systems. The
positive-sequence, negative-sequence and zero-sequence impedances can be determined by
measurements by applying the positive-sequence, negative-sequence and zero-sequence voltages
to the circuit to be measured, measuring the current and then calculating the impedance from
Ohm's law. The positive-sequence impedance is identical with the impedance of a conductor in the
three-phase system and is therefore the same as the impedance of an equivalent single-phase
circuit in symmetrical operation. It is the sum total of the impedances in the conductor from the
overland lines, machines and other components.

The negative-sequence impedance is determined as for the positive-sequence impedance, but with
a negative-sequence system voltage. As can be seen from the measurement circuit in Figure 10.4,
the negative-sequence impedance must be the same as the positive-sequence impedance for all
passive operational equipment such as overhead lines, cables and transformers. For rotating
machines, on the other hand, the negative-sequence impedance can be smaller than the
positive-sequence impedance.
The zero-sequence impedance is, by definition (no phase shift of the individual components),
measured single-phase and the three conductors are connected in parallel.
For imaging a symmetrical three-phase network the positive-sequence, negative-sequence and
zero-sequence systems must be linked. The procedure is described in detail in the following
sections. Linking requires knowledge of the source voltage. In three-phase networks, the source
voltage is generated symmetrically with synchronous generators. For this reason, the source
voltage appears only in the positive-sequence system and is set to the value $\dfrac{c \cdot
U_n}{\sqrt{3}}$ for the calculations.
> **Figure Description - Fig. 10.4: Measuring circuits for determining the positive-sequence,
negative-sequence and zero-sequence impedances**
>
> The figure shows three separate measuring circuit diagrams, each used to determine one of the
three sequence impedances of a power system component:
>
> **Top circuit - Positive-sequence impedance:**
> A three-phase generator (G, 3~) is connected via three lines L₁, L₂, and L₃ to a block labeled
"Operational equipment." The positive-sequence current $I_1$ flows through the lines, and the
positive-sequence voltage $U_1$ is indicated at the generator terminals. The output of the
operational equipment connects to a two-terminal port representing the **positive-sequence
impedance** (shown with an open-circuit symbol and a filled dot indicating the measurement
terminal).
>
> **Middle circuit - Negative-sequence impedance:**
> An identical configuration is shown with a three-phase generator (G, 3~) connected via L₁, L₂, L₃ to
"Operational equipment." Here, the negative-sequence current $I_2$ flows and the
negative-sequence voltage $U_2$ is applied. The output port represents the **negative-sequence
impedance**.
>
> **Bottom circuit - Zero-sequence impedance:**
> In this circuit, the same current $I_0$ flows in all three lines L₁, L₂, and L₃ simultaneously
(zero-sequence condition), with the generator (G, 3~) connected at the bottom and the
zero-sequence voltage $U_0$ indicated. The three equal currents $I_0$ sum at the return path,
producing a total return current of $3I_0$ through the neutral/ground path. The output port
represents the **zero-sequence impedance** (labeled "Zero-sequence equipment").

**Fig. 10.4:** Measuring circuits for determining the positive-sequence, negative-sequence and
zero-sequence impedances
All three equivalent circuit components are connected to the fault position and for each type of
fault there is a different connection (Figure 10.5).
**Fig. 10.5:** Schematic of the equivalent circuit components

# 11
# Calculation of Short Circuit Currents
In IEC 60 909 the different types of short circuits are clearly defined. This chapter deals with the
short circuit currents and sets up the equations required to determine these currents. For the
calculation RST components are used instead of L1-L2-L3, for reasons of simplification.
## 11.1
**Three-pole short circuits**
> **[Fig. 11.1 - Equivalent circuit diagram for a three-pole short circuit with equivalent voltage
source at the position of fault]**
>
> The diagram shows a single-line equivalent circuit consisting of the following elements from left
to right:
> - **Q**: A network feeder (represented by a hatched/crossed box symbol), connected to the
busbar on the left.
> - **T**: A transformer (represented by two coupled circles), connecting the high-voltage side (Q)
to the low-voltage distribution bus.
> - Three horizontal bus lines labeled **L1**, **L2**, and **L3**, with a neutral point **N**
connected to ground (earth symbol via zigzag/ground symbol).
> - A fault point labeled **01** where a three-pole short circuit occurs, indicated by the fault
current $I''_{k3}$ flowing downward at the transformer secondary bus.
> - To the right of the fault point, an impedance $Z_1$ is shown in series with the line current
$I_1$.
> - At the far right, an equivalent voltage source is shown as $\dfrac{cU_n}{\sqrt{3}}$, representing
the equivalent voltage source (per IEC 60 909) at the fault location, where $c$ is the voltage factor
and $U_n$ is the nominal system voltage.
**Fig. 11.1:** Equivalent circuit for a three-pole short circuit with equivalent voltage source at
position of fault
For the dimensioning of electrical systems it is necessary to consider three-pole short circuits in
order to guarantee the mechanical and thermal stability of the systems and the rated making and
breaking capabilities of the overcurrent protection equipment.
- The requirements for calculating the largest three-pole short circuit current are:
- The temperature of the conductor is 20 °C
- The network circuitry is mostly responsible for this current
- The network feeder deliver the maximum short circuit power
- The voltage factor is chosen in accordance with IEC 60 909.

The three-pole short circuit is a symmetrical fault. The following fault conditions apply for the
equivalent circuit shown in Figure 11.1:
$$U_R = U_S = U_T = 0, \tag{11.1}$$
$$I_R + I_S + I_T = 0, \tag{11.2}$$
It then follows that:
$$\begin{bmatrix} \underline{U}_0 \\ \underline{U}_1 \\ \underline{U}_2 \end{bmatrix} =
\frac{1}{3} \cdot \begin{bmatrix} 1 & 1 & 1 \\ \underline{1} & \underline{a} & \underline{a}^2 \\
\underline{1} & \underline{a}^2 & \underline{a} \end{bmatrix} \cdot \begin{bmatrix}
\underline{U}_R \\ \underline{U}_S \\ \underline{U}_T \end{bmatrix}, \tag{11.3}$$
$$\underline{U}_0 = \underline{U}_1 = \underline{U}_2 = 0, \tag{11.4}$$
$$\begin{bmatrix} \underline{I}_0 \\ \underline{I}_1 \\ \underline{I}_2 \end{bmatrix} = \frac{1}{3}
\cdot \begin{bmatrix} 1 & 1 & 1 \\ \underline{1} & \underline{a} & \underline{a}^2 \\ \underline{1}
& \underline{a}^2 & \underline{a} \end{bmatrix} \cdot \begin{bmatrix} \underline{I}_R \\
\underline{I}_S \\ \underline{I}_T \end{bmatrix}, \tag{11.5}$$
For three-pole short circuits:
$$\underline{I}''_{k3} = \frac{c \cdot U_n}{\sqrt{3} \cdot \underline{Z}_1} \tag{11.6}$$
whereby for $\underline{Z}_1$:
$$Z_1 = \sqrt{(R_{1Q} + R_{1T} + R_{1L})^2 + (X_{1Q} + X_{1T} + X_{1L})^2}, \tag{11.7}$$
Or with the impedances of the individual operational equipment:
$$\underline{Z}_1 = \underline{Z}_{1Q} + \underline{Z}_{1T} + \underline{Z}_{1L}. \tag{11.8}$$
## 11.2 Two-pole short circuits with contact to ground
> **Fig. 11.2** - Equivalent circuit of a two-pole short circuit with contact to ground.
>
> The diagram shows a power system schematic with two sections: a left-hand single-line diagram
and a right-hand sequence network. On the left, a busbar Q feeds through a transformer T into
three-phase lines L1, L2, L3 at node 01, with two fault currents indicated: $I''_{k2E}$ (flowing
through the neutral/ground path via the transformer tank symbol) and $I''_{kE2E}$ (flowing into
the earth/ground). On the right, the sequence network is shown in three levels corresponding to
positive-sequence (01), negative-sequence (02), and zero-sequence (00) networks. Each sequence

network contains an impedance ($Z_1$, $Z_2$, $Z_0$), a current ($I_1$, $I_2$, $I_0$), and a
voltage ($\underline{U}_1$, $\underline{U}_2$, $\underline{U}_0$). The positive-sequence
network includes a voltage source $\frac{cU_n}{\sqrt{3}}$. The three sequence networks are
interconnected in series to represent the two-pole short circuit with earth contact boundary
conditions.
This represents the general case of a two-pole short circuit. As can be seen from Figure 11.2, for
the two-pole short circuit the following boundary conditions apply:
$$\underline{I}_R = 0, \quad \underline{I}_S = \underline{I}_T, \quad \underline{I}_{kE2E} =
\underline{I}_S + \underline{I}_T, \quad \underline{U}_S = \underline{U}_T = 0.$$
$$I''_{kE2E} = \frac{\sqrt{3} \cdot c \cdot U_n}{|\underline{Z}_1 + 2\underline{Z}_0|} \tag{11.9}$$
## 11.3 Two-pole short circuit without contact to ground
> **Fig. 11.3** - Equivalent circuit of a two-pole short circuit without contact to ground.
>
> The diagram shows a power system schematic with two sections: a left-hand single-line diagram
and a right-hand sequence network. On the left, a busbar Q feeds through a transformer T into
three-phase lines L1, L2, L3 at node 01, with a fault current $I'_{k2}$ indicated flowing through the
neutral path (no earth/ground connection, distinguished from Fig. 11.2 by the absence of the
ground fault path). On the right, only two sequence networks are shown: positive-sequence (01)
with impedance $Z_1$, current $I_1$, voltage $\underline{U}_1$, and voltage source
$\frac{cU_n}{\sqrt{3}}$; and negative-sequence (02) with impedance $Z_2$, current $I_2$, and
voltage $\underline{U}_2$. The constraint $I_1 = -I_2$ is indicated, and the two sequence
networks are connected in series. There is no zero-sequence network, reflecting the absence of
ground contact.
According to Figure 11.3, a two-pole fault without contact to ground should occur between the two
conductors.
For the equations giving the currents:
$$\underline{I}_S = -\underline{I}_T, \quad I_R = 0$$
The zero-sequence system current is zero, because no current flows through ground, i.e. $I_0 = 0$,
$U_0 = 0$.
For a two-pole short circuit current, this results in:
$$I''_{k2} = \frac{c \cdot U_n}{|\underline{Z}_1 + \underline{Z}_2|} \tag{11.10}$$

$$I''_{k2} = \frac{\sqrt{3}}{2} I''_{k3} \tag{11.11}$$
The voltage system for a two-pole short circuit shifts in such a way that the voltage on the third,
fault-free conductor, in this case $U_R$, remains unchanged.
Two-pole short circuit currents without contact to ground can be larger with powerful
asynchronous motors than for three-pole short circuits.
**11.4**
**Single-pole short circuits to ground**
> **Fig. 11.4** - Equivalent circuit of single-pole short circuit to ground.
>
> The figure shows two parts:
>
> **Left side (physical diagram):** A three-phase network with a busbar source block (Q)
connected through a transformer (T) with a neutral point grounded (N). Three-phase conductors
L1, L2, L3 are shown leaving the transformer. A fault current $I''_{k1}$ flows through the neutral
grounding path into the earth (represented by ground symbols beneath the transformer neutral).
>
> **Right side (sequence network equivalent circuit):** Three sequence networks are connected in
series between nodes:
> - **Positive-sequence network (1):** Impedance $\underline{Z}_1$ in series with current $I_1$,
voltage $\underline{U}_1$ across the network. Connected between nodes 01 and the top. A
voltage source $\dfrac{cU_n}{\sqrt{3}}$ is present on the right side.
> - **Negative-sequence network (2):** Impedance $\underline{Z}_2$ in series with current $I_2$,
voltage $\underline{U}_2$ across the network. Connected between nodes 01 and 02.
> - **Zero-sequence network (0):** Impedance $\underline{Z}_0$ in series with current $I_0$,
voltage $\underline{U}_0$ across the network. Connected between nodes 02 and 00.
>
> The three networks are connected in series, with the relationship on the right side indicating:
> $$\frac{1}{3} I''_{k1} = I_0 = I_1 =$$
>
> This series connection of positive-, negative-, and zero-sequence networks is the standard
symmetrical components representation used to analyze a single-line-to-ground fault.
**Fig. 11.4:** Equivalent circuit of single-pole short circuit to ground
The single-pole short circuit current occurs frequently in electrical networks. Its calculation is
necessary in order to ensure

- The maximum conductor lengths (IEC 60 364 Part 52)
- Protection against indirect contact (IEC 60 364 Part 41)
- Protection against thermal stress (IEC 60 364 Part 43)
Calculating the smallest short circuit current requires that:
- The voltage factor used is taken from IEC 60 909
- Motors can be neglected
- In low voltage networks the temperature of the conductors is set to 80 °C
- Setting up the network so that the smallest $I''_{k1min}$ flows.
For the component systems shown in Figure 4, we can then use the values:
$\underline{I}_S = \underline{I}_T = 0, \quad \underline{I}''_{k1} = \underline{I}_R, \underline{U}_R
## = 0.$
Since the currents in the positive-sequence, negative-sequence and zero-sequence systems are
identical, this means that the three systems must be connected in series. For the current, then:
$$3 \cdot \underline{I}_0 = \underline{I}_R + \underline{I}_S + \underline{I}_T \tag{11.12}$$
$$\underline{I}_{1R} = \underline{I}_{2R} = \underline{I}_0 \tag{11.13}$$
$$\underline{I}_R = \underline{I}_{1R} + \underline{I}_{2R} + \underline{I}_{0R} = 3 \cdot
\underline{I}_{1R} \tag{11.14}$$
$$\underline{I}_{1R} = \frac{E''}{\underline{Z}_1 + \underline{Z}_2 + \underline{Z}_0} \tag{11.15}$$
$$\underline{I}_R = \frac{3 \cdot E''}{\underline{Z}_1 + \underline{Z}_2 + \underline{Z}_0}
\tag{11.16}$$
Using the relationship
$$E'' = \frac{3 \cdot U_n}{\sqrt{3}} \tag{11.17}$$
it follows for a single-pole short circuit under the condition $Z_1 = Z_2$ that
$$I''_{k1min} = \frac{\sqrt{3} \cdot c_{min} \cdot U_n}{|2\underline{Z}_1 + \underline{Z}_0|}
\tag{11.18}$$
For the loop impedance of the short circuit:
$$I''_{k1min} = \frac{c_{min} \cdot U_n}{\sqrt{3} \cdot Z_s} \tag{11.19}$$
Equating the right sides of equations 11.18 and 11.19 yields:
$$Z_s = \frac{2Z_1 + Z_0}{3} \tag{11.20}$$
According to IEC 60 909,

$$I''_{k1min} = \frac{\sqrt{3} \cdot c_{min} \cdot U_n}{\sqrt{\left(2R_{1Q} + 2R_{1T} + 2R_{1L} +
R_{0T} + R_{0L}\right)^2 + \left(2X_{1Q} + 2X_{1T} + 2X_{1L} + X_{0T} + X_{0L}\right)^2}}
\tag{11.20}$$
Equations 11.18, 11.19 and 11.21 are identical and give the same result for the calculation of
$I''_{k1min}$.
For asymmetrical short circuits, the largest short circuit current can be determined with the aid of
Figure 11.5 and depends on the network design. The double ground fault $I''_{kEE}$ is not included
in this figure, because it leads to smaller short circuits than the two-pole short circuit. The ranges of
the different types of short circuits according to the neutral point treatment are indicated in this
diagram. The phase angles of the impedances $\underline{Z}_1$, $\underline{Z}_2$ and
$\underline{Z}_0$ in this figure must not differ by more than 15°.
The symbols in Figure 11.5 have the meanings:
- *k2* &nbsp; Two-pole short circuit current
- *k3* &nbsp; Three-pole short circuit current
- *k2E* &nbsp; Two-pole short circuit current without contact to ground
- *k1* &nbsp; Single-pole ground fault current
- *δ* &nbsp; Ground fault factor
- $a = \dfrac{\text{Short circuit current for asymmetrical short circuit}}{\text{Short circuit current
for three-pole short circuit}}$
> **[Graph/Diagram Description]:**
> Figure 11.5 is a nomogram used to determine the largest short circuit currents for asymmetrical
short circuits. The horizontal axis represents the ratio $Z_2/Z_1$ (ranging from 0 to 1.0), and the
vertical axis represents the ratio $Z_2/Z_0$ (ranging from 0 to 1.2). The graph contains several
families of curves:
> - Diagonal lines labeled with the parameter $a$ (values: $a = 2.0$, $1.6$, $1.4$, $1.3$, $1.2$,
$1.1$, $1.05$, $1.0$) representing iso-lines of the fault current magnitude factor.
> - Regions labeled **k1**, **k2E**, **k2**, **k3** indicating different fault types (single-phase,
double-phase-to-earth, double-phase, three-phase).
> - A right-side vertical scale for $\delta_1$ (ranging from 1 to 1.73 = $\sqrt{3}$), with annotations:
> - $\delta \leq 1.4$: Networks with low-resistance neutral point grounding
> - $\delta > 1.4$: Networks with isolated neutral point or earth fault neutralizer grounded system
> - Bottom annotations: "Steady state short circuit current", "Terminal short circuit of generator",
"Network short circuit far from generator", "Initial symmetrical short circuit current"
**Fig. 11.5:** Largest short circuit currents for asymmetrical short circuits [1, 6]

## 11.5
## Peak short circuit current $i_p$
The initial short circuit current $I_k''$ and the withstand ratio $\kappa$ determine the peak short
circuit current $i_p$. The factor $\kappa$ depends on the ratio $R/X$ of the short circuit path and
takes account of the decay of the DC aperiodic component in the short circuit. the peak value $i_p$
occurs during the period immediately following the occurrence of the short circuit (transient
period). If the ratio $R/X$ is known, the factor $\kappa$ can be read from the curves in Figure 11.6.
> **Fig. 11.6** - Two graphs showing the factor $\kappa$ for calculating the peak short circuit
current $i_p$.
>
> **Top graph:** Plots $\kappa$ (y-axis, ranging from 1.0 to 2.0) versus $R/X$ (x-axis, ranging from
0 to 1.2). The curve is monotonically decreasing: as $R/X$ increases from 0 to 1.2, $\kappa$
decreases from approximately 2.0 down to about 1.0. The curve has a smooth hyperbolic-like
decay shape.
>
> **Bottom graph:** Plots $\kappa$ (y-axis) versus $X/R$ (x-axis, logarithmic scale ranging from 0
to 200, with markings at 0, 1, 2, 5, 10, 20, 50, 100, 200). The curve is monotonically increasing: as
$X/R$ increases, $\kappa$ rises from approximately 1.0 (at low $X/R$) toward approximately 2.0
(at high $X/R$). This is the inverse representation of the top graph.
**Fig. 11.6:** Factor $\kappa$ for calculating the peak short circuit current $i_p$ [1]
The peak short circuit current calculated determines the dynamic loading of electrical systems.
The peak short circuit current can be calculated in unmeshed networks from the equation:
$$i_p = \kappa \cdot \sqrt{2} I_k''. \tag{11.22}$$
Standard values:
$\kappa < 1.4$: in public networks
$\kappa \leq 1.8 \cdots 2.04$: immediately downstream from transformer feeder
$\kappa$ can also be calculated from the following equation:
$$\kappa = 1.02 + 0.98 \cdot e^{-3\frac{R}{X}}. \tag{11.23}$$
The peak short circuit current $i_p$ can be calculated in all networks using the basic equation $i_p
= \kappa\sqrt{2}I_k''$. With the three following procedures it is possible to determine the factor
$\kappa$ in meshed networks [4].
- Procedure A ($\kappa = \kappa_a$):
$\kappa$ is determined from the smallest $R/X$ ratio of all branches in the network. In low voltage
networks, $\kappa \leq 1.8$.

11.6 *Symmetrical breaking current $I_a$* **99**
- Procedure B ($\kappa = 1.15\kappa_b$):
$\kappa$ is determined from the *R/X* ratio of the short circuit impedance at the position F of the
short circuit and multiplied by a safety factor of 1.15 in order to take account of different *R/X*
ratios in parallel branches.
- For low voltage networks: $\kappa \leq 1.8$.
- For medium and high voltage networks: $\kappa \leq 2.0$.
- Procedure C ($\kappa = \kappa_c$):
With procedure C, $\kappa$ is determined with an equivalent frequency, as below:
- Calculation of reactances for all network branches *i* for the equivalent frequency $f_c$ in the
positive-sequence system:
$$X_{ic} = \frac{f_c}{f} X_i.$$
*f*: nominal frequency - 50 Hz, 60 Hz
$f_c$: equivalent frequency - 20 Hz, 24 Hz.
- Calculation of equivalent impedance at the position of the short circuit from the resistances
$R_i$ and the reactances $X_i$ of the network branches in the positive-sequence system:
$$\underline{Z}_c = R_c + j\ X_c.$$
- Determination of the factor $\kappa_c$ from the ratio:
$$\frac{R}{X} = \frac{f_c}{f} \frac{R_c}{X_c}.$$
## 11.6
## Symmetrical breaking current $I_a$
The symmetrical breaking current is the effective value of the short circuit current $I_k''(t)$, which
flows through the switch at the time of the first contact separation and is used for
near-to-generator short circuit feeder. For far-from-generator short circuits, the breaking currents
are identical with the initial short circuit currents:
$$I_a = \mu \cdot I_k''. \tag{11.24}$$
### Synchronous machines
$$I_a = \mu I_{kG}'' \tag{11.25}$$

$I_a$ depends on the duration of the short circuit and the installation position of the switchgear at
the position of the short circuit. $\mu$ characterizes the decay behavior of the short circuit current
and is a function of the variables $I_{kG}''/I_{rG}''$ and $t_{min}$ (Figure 11.7).
> **Figure description:** Graph of factor $\mu$ versus $I''_{kG}/I_{kG}$ or $I''_{kM}/I_{kM}$,
used for calculating the symmetrical breaking current $I_a$. The vertical axis represents $\mu$
ranging from 0.6 to 1.0. The horizontal axis ranges from 0 to 9, representing the ratio
$I''_{kG}/I_{kG}$ oder $I''_{kM}/I_{kM}$. Four curves are shown, each corresponding to a different
minimum switching delay $t_{min}$: 0.02 s (top curve, highest $\mu$ values), 0.05 s, 0.1 s, and
$\geq 0.25$ s (bottom curve, lowest $\mu$ values). The left portion of the x-axis (0-2) is labeled
"Far-from-generator short circuit," and the region from approximately 2-9 is labeled
"Near-to-generator short circuit." All curves begin near $\mu = 1.0$ at low ratios and decrease as
the ratio increases, asymptotically approaching values between approximately 0.6 and 0.9
depending on $t_{min}$.
**Fig. 11.7:** Factor $\mu$ for calculating the symmetrical breaking current $I_a$ [1]
The factor $\mu$ can be taken from Fig. 11.7 or from the following equations.
$$\mu = 0.84 + 0.26\ e^{-0.26\ I''_{kG}/I_{rG}} \quad for \quad t_{\min} = 0.02\ s$$
$$\mu = 0.71 + 0.51\ e^{-0.30\ I''_{kG}/I_{rG}} \quad for \quad t_{\min} = 0.05\ s$$
$$\mu = 0.62 + 0.72\ e^{-0.32\ I''_{kG}/I_{rG}} \quad for \quad t_{\min} = 0.10\ s$$
$$\mu = 0.56 + 0.94\ e^{-0.38\ I''_{kG}/I_{rG}} \quad for \quad t_{\min} = 0.25\ s$$
$$\mu_{\max} = 1$$
When $I_a = I''_k$, then $\mu = 1$, i.e. a far-from-generator short circuit is present, if for each
synchronous machine the following condition is satisfied:
$$\frac{I''_{k3}}{I_{rG}} \leq 2. \tag{11.26}$$
For $I_a < I''_k$, i.e. a near-to-generator short circuit:
$$\frac{I''_{k3}}{I_{rG}} \geq 2. \tag{11.27}$$
In practice:
The minimum switching delay is 0.1 s.
11.6 Symmetrical breaking current $I_a$ **101**
**Asynchronous machines**

$$I_a = \mu \cdot q \cdot I''_{kM}. \tag{11.28}$$
The factor q depends on the power per pole pair.
**Networks**
$$I_{aQ} = I''_{kQ}. \tag{11.29}$$
**More exact procedure for calculation of symmetrical breaking current in meshed networks [1]**
$$\underline{I}_a = \underline{I}''_k - \sum_i \frac{\Delta \underline{U}''_{Gi}}{\dfrac{c \cdot
U_n}{\sqrt{3}}} (1 - \mu_i) \cdot \underline{I}''_{kGi} - \sum_i \frac{\Delta
\underline{U}''_{Mj}}{\dfrac{c \cdot U_n}{\sqrt{3}}} (1 - \mu_j \cdot q_j) \cdot \underline{I}''_{kMj}
\tag{11.30}$$
## With:
$$\Delta \underline{U}''_{Gi} = j X''_{di} \cdot \underline{I}''_{kGi} \tag{11.31}$$
$$\Delta \underline{U}''_{Mj} = j X''_{Mj} \cdot \underline{I}''_{kMj} \tag{11.32}$$
Figure 11.8 shows the dependence of the factor q on the effective power per pole pair of the motor
and the minimum switching delay $t_{min}$. For the equations used in calculating q, see IEC 60
## 909.
> **Graph Description - Fig. 11.8:** A log-linear chart plotting the factor **q** (vertical axis, linear
scale from 0 to 1.0) against the **effective power per pole pair of the motor** (horizontal axis,
logarithmic scale from 0.01 MW to 10 MW, labeled *m*). Four curves are shown, each
corresponding to a different **minimum switching delay $t_{min}$**:
> - $t_{min} = 0.02\ \text{s}$ (uppermost curve, highest q values)
> - $t_{min} = 0.05\ \text{s}$
> - $t_{min} = 0.1\ \text{s}$
> - $t_{min} \geq 0.25\ \text{s}$ (lowermost curve, lowest q values)
>
> All curves are monotonically increasing with power per pole pair. At low power per pole pair (0.01
MW), q values start near 0.1-0.6 depending on the delay, and approach values near 0.6-1.0 at 10
MW. The vertical axis is labeled **q** with an upward arrow.
**Fig. 11.8:** Factor q for calculation of the symmetrical breaking current for asynchronous
machines [1]
The factor q applies to induction motors and takes account of the rapid decay of the motor short
circuit owing to the absence of an excitation field. It can be taken from Fig. 11.8 or from the
following equations.

$q = 1.03 + 0.12 \ \ln \ m \quad for \ \ t_{\min} = 0.02 \ s$
$q = 0.79 + 0.12 \ \ln \ m \quad for \ \ t_{\min} = 0.05 \ s$
$q = 0.57 + 0.12 \ \ln \ m \quad for \ \ t_{\min} = 0.10 \ s$
$q = 0.26 + 0.12 \ \ln \ m \quad for \ \ t_{\min} = 0.25 \ s$
$q_{max} = 1$
The meanings of the symbols are:
| Symbol | Description |
|---|---|
| $i$ | Generator |
| $j$ | Motor |
| $\Delta U''_{Gi}$ | Initial voltage difference at connection to synchronous machine $i$ |
| $\Delta U''_{Mj}$ | Initial voltage difference at connection to asynchronous machine $j$ |
| $\dfrac{c \ U_n}{\sqrt{3}}$ | Equivalent voltage source at position of short circuit |
| $I_a \ I''_k$ | Symmetrical breaking current, initial symmetrical short circuit current considering
all network inputs, synchronous machines and asynchronous machines |
| $I''_{kGi}$ | Initial symmetrical short circuit current of synchronous machine |
| $I''_{kMj}$ | Initial symmetrical short circuit current of asynchronous machine |
| $\mu_j$ | Factor $j$ for asynchronous machines |
| $\mu_i$ | Factor $i$ for synchronous machines |
| $q_i$ | Factor $j$ for asynchronous machines |
**11.7**
**Steady state short circuit current $I_k$**
The steady state short circuit current is the effective value of the short circuit current $I''_k$
remaining after the decay of all transient processes. It depends strongly on the excitation current,
excitation system and saturation of the synchronous machine:
For near-to-generator short circuits: $I_k < I''_k$.
For far-from-generator short circuits: $I_k = I''_k = I_a$.
The following relationships show a dependence on the fault position:
$$I_k = \lambda I_{rG}, \tag{11.33}$$
$$I_k = I''_{k2},$$
$$I_k = \lambda \cdot \sqrt{3} \cdot I_{rG}. \tag{11.34}$$
*11.7 Steady state short circuit current $I_k$* | **103**

The factor $\lambda$ depends on $I''_{kG}/I_{rG}$, the excitation and the type of synchronous
machine.
For the steady state short circuit current, we distinguish between:
- $I_{kmax} = \lambda_{max} \cdot I_{rG}$ (maximum excitation) and
- $I_{kmin} = \lambda_{min} \cdot I_{rG}$ (constant unregulated excitation).
The upper and lower limits of $\lambda$ can be taken from Figure 11.9. It should also be pointed
out that the $\lambda$ curves depend on the ratio of the maximum excitation voltage to the
excitation voltage under normal load conditions (Series 1 and 2).
The following statements can be made for Series 1 and 2 [1]:
Series 1: The largest possible excitation voltage is 1.3 times the rated excitation voltage for the
rated apparent power factor for turbo-generators or 1.6 times the rated excitation voltage for
salient pole generators.
Series 2: The largest possible excitation voltage is 1.6 times the rated excitation voltage for the
rated apparent power factor for turbo-generators or 1.3 times the rated excitation voltage for
salient pole generators.
> **Figure 11.9 - Description:**
> Four family-of-curves graphs arranged in a 2×2 grid (rows labeled **a)** and **b)**, columns
labeled **Series 1** and **Series 2**), showing the factors $\lambda_{min}$ and
$\lambda_{max}$ used for calculating the steady-state short circuit current $I_k$ of synchronous
generators.
>
> - **Horizontal axis (all graphs):** $I''_{kG}/I_{rG}$ - ratio of subtransient short circuit current to
rated generator current, ranging from 0 to 9.
> - **Vertical axis (all graphs):** $\lambda$ - the steady-state short circuit factor.
>
> **Row a) - Turbo-generators (salient-pole, $x_d$ saturated):**
> - Left graph (Series 1, $U_{fmax}/U_{fr} = 1.3$): $\lambda$ ranges approximately 0 to 2.8.
Multiple $\lambda_{max}$ curves are shown labeled 1.2, 1.4, 1.6, 1.8, 2.0, 2.2 (corresponding to
different $x_d$ saturation levels). A single $\lambda_{min}$ curve is shown at lower values.
> - Right graph (Series 2, $U_{fmax}/U_{fr} = 1.6$): $\lambda$ ranges approximately 0 to a similar
upper bound. $\lambda_{max}$ curves labeled 1.2, 1.4, 1.6, 1.8, 2.0, 2.2. A $\lambda_{min}$ curve
shown.
>
> **Row b) - Salient pole generators ($x_d$ saturated):**
> - Left graph (Series 1, $U_{fmax}/U_{fr} = 1.6$): $\lambda$ ranges approximately 0 to 5.5.
$\lambda_{max}$ curves labeled 0.6, 0.8, 1.0, 1.2, 1.7, 2.0. A $\lambda_{min}$ curve at lower
values.
> - Right graph (Series 2, $U_{fmax}/U_{fr} = 2.0$): $\lambda$ ranges approximately 0 to similar
upper bound. $\lambda_{max}$ curves labeled 0.6, 0.8, 1.0, 1.2, 1.7, 2.0. A $\lambda_{min}$ curve
shown.

>
> All curves are monotonically increasing with $I''_{kG}/I_{rG}$, with $\lambda_{max}$ curves
fanning out above $\lambda_{min}$. The parameter labeling the $\lambda_{max}$ curves
corresponds to the saturated synchronous reactance $x_d$ (in per unit).
**Fig. 11.9:** Factors $\lambda_{min}$ and $\lambda_{max}$ for calculating the steady state
short circuit current $I_k$ [1]
# 12
# Motors in DS Networks
Asynchronous motors are used mostly in industry and for the internal consumption of power
stations. For a short circuit, these deliver a part of the initial short circuit current, peak short circuit
current, symmetrical breaking current and, for single-pole faults, of the steady state short circuit
current as well. The peak short circuit part of the asynchronous motors must be considered. For
the calculation of squirrel-cage motors and wound rotor motors there is no difference, since the
starting resistors of wound rotor motors are short-circuited during operation. In the following
cases, asynchronous motors can be neglected for the calculation of short circuit currents [1]:
- Asynchronous motors in public low voltage networks
- Contributions of asynchronous motors or motor groups which are less than 5 % of the initial
symmetrical short circuit current without motors
- Asynchronous motors which due to interlocking or type of process control cannot operate at the
same time
- Groups of low voltage asynchronous motors which can be combined through their connection
cables to an equivalent motor with $\dfrac{I_{an}}{I_{rM}} = 5$ and $\dfrac{R_M}{X_M} = 0.42$
- Asynchronous motors can be neglected for single-pole short circuits.
Various connection variants for asynchronous motors in industrial networks will be discussed in the
following.
**12.1**
**Short circuits at the terminals of asynchronous motors**
The contribution of an asynchronous machine (Figure 12.1) can, in accordance with IEC 60 909, be
neglected provided that:
$$I''_{kM} \leq 0.05 \cdot I''_{kQ}, \tag{12.1}$$

$$I''_{kM} = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_M} = \frac{I_{an}}{I_{rM}} \frac{c \cdot
U_n}{U^2_{rM}} \cdot I_{rM}. \tag{12.2}$$
The impedance $Z_M$ of an asynchronous machine in the positive-sequence and
negative-sequence systems is calculated from the relationships:
$$Z_M = \frac{1}{\dfrac{I_{an}}{I_{rM}}} \cdot \frac{U_{rM}}{\sqrt{3} \cdot I_{rM}} =
\frac{1}{\dfrac{I_{an}}{I_{rM}}} \frac{U_{rM}^2}{S_{rM}}, \tag{12.3}$$
$$Z_M = \frac{\eta_{rM} \cdot \cos\varphi_{rM}}{\dfrac{I_{an}}{I_{rM}}} \frac{U_{rM}}{P_{rM}}.
\tag{12.4}$$
> **Fig. 12.1 - Short circuit at the terminals of an asynchronous motor**
>
> The diagram shows a three-phase electrical circuit representing a short-circuit fault at the
terminals of an asynchronous motor (labeled M, 3~). The circuit includes:
> - Three-phase bus bars (L1, L2, L3) connected to a busbar node Q on the right side.
> - A short-circuit current $I_k''$ flowing from the network/grid side (indicated by a
hatched/cross-hatched transformer symbol at the top).
> - An initial symmetrical short-circuit current $I_{kQ}''$ and nominal voltage $U_n$ indicated at
node Q.
> - A three-phase asynchronous motor M (3~) connected via three-phase cables with terminals U,
V, W and a protective earth (PE) connection.
> - Motor rated power $P_{rM}$ indicated at the motor terminal.
> - Motor contribution to the short-circuit current $I_{rM}''$ shown flowing from the motor toward
the fault point.
> - A circuit breaker/contactor (represented by contact symbols) and overload relay (thermal relay
symbols I>/I>/I>) in the motor branch.
> - The fault point is at the motor terminals, with both the network and the motor contributing
short-circuit currents.
Motor groups (Equation 12.1) can be neglected with the assumptions $I_{an}/I_{rM} = 5$ and $c
\cdot U_n/U_{rM} \approx 1$:
$$\sum I_{rM} \leq 0.01 I_k''. \tag{12.5}$$
The reactances and resistances can be calculated from the following equations [5]:
For medium voltages with effective power $P_{rM}$ per pole pair ≥ 1 MW:
$$\frac{R_M}{X_m} = 0.10 \text{ mit } X_M = 0.995 \cdot Z_M \tag{12.6}$$
For medium voltage motors with effective power $P_{rM}$ per pole pair < 1 MW:
$$\frac{R_M}{X_m} = 0.15 \text{ mit } X_M = 0.989 \cdot Z_M \tag{12.7}$$

For low voltage motors, including motor connection cable:
$$\frac{R_M}{X_m} = 0.42 \text{ mit } X_M = 0.922 \cdot Z_M \tag{12.8}$$
## 12.2
### Motor groups supplied from transformers with two windings
High voltage and low voltage motors which supply short circuit currents to the short-circuit
location Q (Figure 12.2) can be neglected provided that:
> **Fig. 12.2 - Circuit diagram: Motor groups supplied from transformers with two windings**
>
> The diagram shows a medium-voltage/low-voltage distribution system with a short-circuit point
Q at the top busbar. From the top busbar, a current $I''_{kQ}$ flows into the fault. Below the
busbar, a two-winding transformer is depicted with parameters: rated apparent power $S_{rT}$,
short-circuit voltage $u_k\%$, and nominal voltage $U_n$. The transformer feeds a low-voltage
busbar (L1, L2, L3). Connected to this low-voltage busbar are two groups of three-phase
asynchronous motors (M, 3~), each with rated mechanical power $P_{rM}$. Each motor group is
connected through a motor starter (contactor with overload relay, represented by the dashed box
with overcurrent relays $I>, I>, I>$). The motor contribution current to the short-circuit point is
labeled $I''_{kM}$. The diagram illustrates the scenario where motor back-feeding into the fault at
Q must be assessed against the neglect criterion.
$$\frac{\sum P_{rM}}{\sum S_{rT}} \leq \frac{0.8}{\left|\frac{c \cdot 100 \sum S_{rT}}{S''_{kQ}} -
## 0.3\right|}$$
## (12.9)
When this condition is satisfied, asynchronous motors contribute less than 5 % to the short circuit
current without motors.
For equation 12.9: $I_{an}/I_{rM} = 5$, $\cos\varphi \cdot \eta_{\sigma} = 0.8$ and $u_{kr} =
## 6\,\%$.
## 12.3:
### Motor groups supplied from transformers with different nominal voltages
High voltage and low voltage motors supplied from transformers with different nominal voltages
must be considered (Figure 12.3).
$$\sum I''_{kM} = I''_{kM1} + I''_{kM2} + I''_{kMn},$$
## (12.10)

> **Fig. 12.3: Motor groups supplied from transformers with different nominal voltages**
>
> The diagram illustrates a multi-voltage industrial power distribution system feeding several
groups of three-phase motors. At the top, a 10 kV busbar (three-phase, L1/L2/L3) is fed through a
circuit breaker Q with an associated short-circuit current $I''_{kQ}$. From the 10 kV bus, two
step-down transformers are shown:
>
> - **First transformer** (rated power $S_{rT}$, short-circuit voltage $u_k\%$): steps down from
10 kV to **690 V**. The 690 V busbar feeds a group of three-phase motors ($M_{3\sim}$, rated
power $P_{rM}$) through fuses, contactors, and overload relays, connected via terminals U, V, W,
and PE.
>
> - **Second transformer** (rated power $S_{rT}$): steps down from 10 kV to **400 V**. The 400
V busbar (L1/L2/L3) feeds multiple groups of three-phase motors: motors with rated powers
$P_{rM1}$, $P_{rM2}$, ..., $P_{rMn}$ at the 690 V level, and motors with rated powers $P_{rM3}$,
..., $P_{rMn}$ at the 400 V level. Each motor branch includes protective devices (fuses, circuit
breakers, contactors, overload relays) and is connected through terminals U, V, W, and PE.
>
> Lightning surge arresters are shown connected to the busbars at various voltage levels. The
system represents a typical industrial distribution network with motor loads supplied at different
voltage levels from a common medium-voltage (10 kV) source.
$$\sum S_{rT} = S_{rT1} + S_{rT2} + \cdots S_{rTn}, \tag{12.11}$$
$$\sum P_{rM} = P_{rM1} + P_{rM2} + \cdots P_{rMn}, \tag{12.12}$$
$$\frac{\sum R_{rM}}{\sum S_{rT}} \leq \frac{\cos\varphi_r \cdot
\eta_r}{\left|\frac{I_{an}}{I_{rM}}\left(\frac{c \cdot \sum S_{rT}}{0.05 \cdot S''_{kQ}} -
\frac{u_{kr}}{100\%}\right)\right|}. \tag{12.13}$$
Equation 12.13 is true only when the conditions of Section 12.2 no longer apply.
The meanings of the symbols are:
| Symbol | Description |
|--------|-------------|
| $I_{an}$ | Locked-rotor current of motor |
| $I_k''$ | Initial symmetrical short circuit current without influence of motors |
| $S_{kQ}''$ | Initial symmetrical short circuit power without influence of motors |
| $\sum I_{rM}$ | Sum of rated currents of motors |
| $U_{rM}$ | Rated voltage of motor |
| $I_{rM}$ | Rated current of motor |
| $I_{an}/I_{rM}$ | Ratio of locked-rotor current to rated current for motor |

| $\sum P_{rM}$ | Sum of rated effective powers of motors |
| $\sum S_{rM}$ | Sum of rated apparent powers of transformers is between 4 and 8 |
| $R_M/X_M$ | : 0.42 (when motor power is neglected) |
| $Z_M$ | Short circuit reactance |
Table 12.1 shows a summary of short circuits at the terminals of induction motors.
**Table 12.1** Calculation of short circuits at the terminals of motors
| *Short circuit type* | *Three-phase short circuit* | *Two-phase short circuit* |
|---|---|---|
| Initial symmetrical short circuit | $I''_{k3M} = \dfrac{c \, U_n}{\sqrt{3} Z_M}$ | $I''_{k2M} =
\dfrac{\sqrt{3}}{2} I''_{k3M}$ |
| Maximum asymmetrical short circuit current | $i_{p3M} = \kappa_M \sqrt{2} I''_{k3M}$ |
$i_{p2M} = \dfrac{\sqrt{3}}{2} \, i_{p3M}$ |
| Symmetrical breaking current | $I_{b3M} = \mu \, q I''_{k3M}$ | $I_{b2M} \approx
\dfrac{\sqrt{3}}{2} I''_{k3M}$ |
| Steady-state short circuit current | $I_{k3M} \approx 0$ | $I_{k2M} \approx \dfrac{1}{2}
I''_{k3M}$ |
# 13
# Mechanical and Thermal Short Circuit Strength
The dimensioning of electrical power installations with respect to stability against mechanical and
thermal stresses is described exactly in EN 60 865-1 [8]. The present chapter gives a brief account
of this information.
Electrical systems are subjected to mechanical and thermal stresses as a result of short circuits.
Bus bars, switchgear and contactors can be destroyed. Due to the evolution of heat the operational
equipment and the insulation of conductors and cables are affected. Furthermore, the potential
hazards for and injuries to the operating personnel must be considered.
In order to keep short-circuits under control, these systems must be designed and dimensioned so
that the operational equipment is able to withstand short circuit conditions.
Here, the construction of the system components and the short circuit current strength are
especially important. The short circuit strength is the sum total of all considerations for the
prevention of and control over the mechanical consequences of short circuit currents and of the
Joule heating which results.

The amount of heat generated over the duration of the short circuit must not exceed the
permissible values for cables, conductors and operational equipment.
## 13.1
### Mechanical short circuit current strength
Collecting bars, parallel conductors, switchgear and fuses must be able to withstand the short
circuit and the resulting peak short circuit current occurring.
As a result of the magnetic field generated, parallel conductors separated by a distance they attract
each other when their currents flow in the same direction and repel each other when their currents
flow in opposite directions, whereby these forces are distributed uniformly over the length of the
conductors l.
The manufacturers of operational equipment test their products for normal load
- Circuit breakers
The rated short circuit making and breaking capacities are normally given by the manufacturer for
the better assessment of short circuit strength. These specified numerical values must be larger
than the calculated short circuit value of the short circuit current at the location of the fault.
The contacts and mechanical parts must be able to withstand the short circuit current. The circuit
breakers are provided for breaking overload and short circuit currents, for which numerical values
can be set accordingly. EN 60 947 (IEC 947) describes the characteristics of low voltage switches
and IEC 282-1, IEC 17A the characteristics of high voltage switches.
- Fuses
Fusible links are the oldest forms of protective equipment and are of great importance in certain
cases. The principle of these protective devices is based on a rupture joint, e.g. a piece of wire,
which melts with the application of a certain amount of heat given by $\int i^2 \, dt$. The type of
time-current characteristic (function class) and the construction determine the locations for use.
They are often used as backup protection or as the main protection in a system. The new version of
IEC 269-1 describes the regulations for all fuse types.
- Disconnectors, load interrupter switches and load-break switches
In the low voltage range load interrupters are mostly used as disconnect switches for the load
circuits which break only operating currents, that is currents under normal load, with an inductive
power factor of 0.7. These switches are not able to break short circuit currents and are therefore
used together with fuses. By contrast with load interrupter switches load-break switches, which
produce a visible isolating distance, are used in the medium voltage range.

**13.2**
**Thermal short circuit current strength**
The operational equipment (busbars, insulators, wires or cables) must be protected against the
effects of short circuit currents), i.e. the systems must be short circuit proof. The effect of forces
acting on conductors with current flowing is of great interest here. Figure 13.1 depicts the effects
of forces acting on busbars and parallel conductors.
> **[Fig. 13.1 - Diagram Description]:** The figure shows two diagrams illustrating the mechanical
forces acting on current-carrying conductors during short circuit conditions.
>
> **Left diagram:** Three parallel busbars labeled L1, L2, and L3 are arranged horizontally with
spacing $a$ between them. The busbars have a span length $l$ indicated by arrows. A downward
force $F$ is shown acting on the lowest busbar (L3), indicating the net electromagnetic force
resulting from the interaction of currents in adjacent conductors during a short circuit event.
>
> **Right diagram:** Two parallel conductors carry currents $i_1$ and $i_2$ respectively,
separated by a distance $d$. Each conductor has a length $l$. The magnetic flux densities produced
by each conductor are labeled $B_1$ and $B_2$. The forces $F$ acting on each conductor are
shown with arrows pointing in opposite directions (repulsion when currents flow in opposite
directions, or attraction when in the same direction). One conductor is shown in cross-section (with
an   symbol indicating current going into the page) and the other with a dot (current coming out of
the page), illustrating the repulsive force scenario between anti-parallel currents.
**Fig. 13.1:** Effects of forces acting on busbars and parallel conductors
13.2 Thermal short circuit current strength **113**
In the magnetic field a force acts on the conductors while current is flowing. This force depends on
the flux density *B*, the current intensity *I* and the length *l* of the conductor. Two parallel
conductors in which current is flowing attract each other when the currents are flowing in the
same direction and repel each other when the currents are flowing in opposite directions.
$$F = B \cdot l \cdot I$$
This force is greatest for a double-pole short circuit without contact to ground and for a three-pole
short circuit. The maximum force occurring between two conductors is proportional to the square
of the current, i.e. F ~ $i^2$. The greatest force acting on the conductors is calculated from the
equation. For the current, the effective peak short circuit current $i_p$ is used.
It will be obtained:
$$F_M = \frac{\mu_0}{2\pi} i_p^2 \frac{l}{a_m}$$
or with the constant evaluated
$$F_M = 0.2 \; i_{p2}^2 \; \frac{l}{a_m} \; or \quad F_H = 0.17 \; i_{p3}^2 \; \frac{l}{a_m}$$

The force between neighboring conductor elements is
$$F_M = \frac{\mu_0}{2\pi} \left(\frac{i_p}{n}\right)^2 \frac{l_s}{a_s}$$
The meanings of the symbols are:
$F_M$ &nbsp; Force for the main conductor in N
$B$ &nbsp; Magnetic induction in T
$i$ &nbsp; Peak short circuit current in kA
$l$ &nbsp; Greatest support spacing in cm
$a_m$ &nbsp; Effective main conductor spacing in cm
$\mu_0$ &nbsp; Permeability constant iabilitätskonstante ($4\pi \; 10^{-7} \; Vs/Am$)
$n$ &nbsp; Number of conductors
$l_s$ &nbsp; Greatest center-to-center distance between two neighboring conductor elements in
cm
$a_s$ &nbsp; Effective spacing between conductor elements in cm
The forces between the conductor elements in which a short circuit current flows depend on the
geometrical arrangement and the profile of the conductors. This is why effective spacings have
been introduced in the equation (EN 61660-1).
The effective spacing am is determined from:
$$a_m = \frac{a}{k_{12}}$$
The correction factor $\text{k}_{12}$ is given in the Figure 13.2.
> **[Figure Description - Fig. 13.2]**
> The graph shows the correction factor $k_{1s}$ (vertical axis, ranging from approximately 0.2 to
1.4) as a function of the ratio $a_{1s}/d$ (horizontal axis, ranging from 1 to 300, plotted on a
logarithmic scale). Multiple curves are plotted, each corresponding to different values of the ratio
$b/d$ (or related geometric parameters of the conductor cross-section). The upper-left region of
the graph contains curves labeled "0,01 bis 0,2 b/d" and individual curves for values 0.5, 1, 2, 5, 10,
15, 20, 30, 40, 50, 60, 80, and 100. An inset diagram in the upper right shows the cross-sectional
geometry of rectangular (flat) conductors arranged in a row, with dimensions $d$ (width), $a_{12}$
(center-to-center spacing between conductors 1 and 2), $a_{13}$ (spacing between conductors 1
and 3), and $a_{1s}$ (spacing to a general conductor $s$). The curves illustrate how $k_{1s}$
decreases from values above 1.0 for small $a_{1s}/d$ ratios and asymptotically approaches 1.0 for
large spacings, with the behavior depending on the conductor aspect ratio $b/d$.
**Fig. 13.2:** Correction factor $k_{12}$ for the determination of the effective conductor spacing
am
As the diagram shows, the force is reduced because $k_{12}$<1 for permanently installed flat
(b/d>1). On the other hand, the effect of the force increases slightly because $k_{12}$>1 for

neighboring bars.
The force leads to bending stress in rigid conductors, to tensile stress and deflection in conducting
cables and to transverse loading, compressive loading or tensile loading of the support points. The
conductors can be clamped, supported or a combination of both and have several support points.
The short circuit loading of the busbars with respect to bending is calculated according to the laws
of rigidity, so that:
$$M = \frac{F_M \cdot l}{8}$$
The meanings of the symbols are:
$F_M$ &nbsp;&nbsp; Force due to the short circuit current in N
$M$ &nbsp;&nbsp; Bending moment in Ncm
$l$ &nbsp;&nbsp; Support spacing in cm
The bending stress can then be determined using the moment of resistance, i.e.
$$\sigma_H = \frac{\nu_a \cdot \beta \cdot M}{W}$$
The bending stress $\sigma$ must always be less than the permissible bending stress
$\sigma_{per}$.
$$\sigma_H \leq \sigma_{per}$$
The bending stress for several conductor elements can be calculated from
$$\sigma_M = \frac{\nu_a \cdot \beta \cdot M}{W_T}$$
The permissible total bending stress of the main ($\sigma_M$) conductor and the conductor
elements ($\sigma_T$) is then
$$\sigma_G = \sigma_M + \sigma_T$$
The dynamic force acting at each support point of the rigid conductors is calculated from
$$F_d = V_F \; V_r \; \alpha \; F$$
For dc systems:
$$V_F \; V_r = 2$$
Für one-phase ac systems:
$$V_F \; V_r \leq 2$$

For three-phase systems:
$$V_F \; V_r \leq 2.7$$
The meanings of the symbols are:
- $\sigma$ &emsp; Bending stress in N/cm²
- $\nu$ &emsp; Frequency factor (Table 13.2)
- $\beta$ &emsp; Factor for loading of the main conductor (Table 13.2)
- $\alpha$ &emsp; Depends on type and number of support points (Table 13.2)
- $M$ &emsp; Bending moment in Ncm
- $W$ &emsp; Moment of resistance in cm⁴
The moments of resistance and moments of inertia of different tubular profiles can be taken from
## Table 13.1.
# 116 | *13 Mechanical and Thermal Short Circuit Strength*
**Table 13.1:** Moments of resistance and moments of inertia
| **Representation** | **Moment of resistance in cm$^4$** | **Moment of inertia in m$^3$** |
|---|---|---|
| *Rectangular cross-section: a rectangle of width b and height h, with b indicated on top and h on
the side* | $I = \dfrac{b \cdot h^3}{12}$ | $W = \dfrac{b \cdot h^2}{6}$ |
| *Solid circular cross-section: a filled circle of diameter d* | $I = \dfrac{\pi \cdot d^4}{64}$ | $W =
\dfrac{\pi \cdot d^3}{32}$ |
| *Hollow circular cross-section (tube): an annular section with inner diameter d and outer
diameter D* | $I = \dfrac{\pi}{64}\left(D^4 - d^4\right)$ | $W = \dfrac{\pi}{32}\dfrac{\left(D^4 -
d^4\right)}{D}$ |
**Table 13.2:** Factors $\alpha$ and $\beta$ for different support point arrangements
| **Type of support** | **Type of attachment** | **Diagram** | **Factor $\alpha$** | **Factor
$\beta$** | **Factor $\nu$** |
|---|---|---|---|---|---|
| Single-field support | A and B supported | *Simply supported beam: pin supports at both ends A
and B, with reaction forces $F_A$ (upward at left) and $F_B$ (upward at right)* | A: 0.5 B: 0.5 | 1.0
| 1.57 |
| | A clamped B supported | *Propped cantilever beam: fixed (clamped) support at end A (left), pin
support at end B (right), with reaction forces $F_A$ (upward at left) and $F_B$ (upward at right)* |
## A: 0.625 B: 0.375 | 0.73 | 2.45 |
| | A and B clamped | *Fixed-fixed beam: clamped supports at both ends A and B, with reaction
forces $F_A$ (upward at left) and $F_B$ (upward at right)* | A: 0.5 B: 0.5 | 0.5 | 3.56 |
| Multi-field support with uniform support spacing | 2 fields | *Two-span continuous beam: pin

support at left end A, intermediate pin support B, and right end support A, with reaction forces
$F_A$, $F_B$, $F_A$ (upward)* | A: 0.375 B: 1.25 | 0.73 | 2.45 |
| | 3 or more fields | *Multi-span continuous beam: pin supports at outer ends A and intermediate
supports B, with reaction forces $F_A$, $F_B$, $F_B$, $F_A$ (upward) shown at four support
points* | A: 0.4 B: 1.1 | 0.73 | 3.56 |
13.2 Thermal short circuit current strength **117**
The busbar arrangement must be checked for mechanical resonance. The natural mechanical
oscillating frequency must not be close to the simple, double or triple network frequency, since this
would lead to damage as a result of resonance. For the natural mechanical oscillating frequency,
then:
$$f_0 = 112 \cdot \sqrt{\frac{E \cdot I}{G \cdot l^4}}$$
The meanings of the symbols are:
$f_0$ &nbsp;&nbsp;&nbsp; Natural oscillating frequency in s-1
$E$ &nbsp;&nbsp;&nbsp;&nbsp; Modulus of elasticity of the busbar material
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; for Cu: $1.1 \cdot 10^6$ kg/cm²,
for Al: $0.65 \cdot 10^6$ kg/cm²
$I$ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Moment of inertia in cm⁴ [Table 13.1]
$G$ &nbsp;&nbsp;&nbsp;&nbsp; Weight of bar in kg/cm
Switches, conductors and transformers must as a result of short circuit currents be dimensioned
with regard to thermal effects as well. It must be checked whether the thermal equilibrium
short-time withstand current $I_{th}$ is correctly determined. The magnitude and the behavior in
time of the short circuit current determines the effective short-time withstand current, the
effective value of which produces the same quantity of heat as the changing short circuit current
during the duration of the short circuit $T_K$ in its DC aperiodic and AC periodic current
components. The thermal short circuit current can be calculated from the effective value of the
initial symmetrical short circuit current and the *m* and *n* factors (Figure 13.3).
## Here:
$$I_{th} = I_k'' \cdot \sqrt{m+n}. \tag{13.1}$$
We can also determine the factor *m* using the relationship:
$$m = \frac{1}{2\,f\,t_k \ln\,(\kappa - 1)}[e^{4\,f\,T_k \ln(\kappa-1)} - 1]. \tag{13.2}$$
The factor *m* takes account of the thermal effect of the DC aperiodic component for three-phase
and polyphase currents and the factor *n* the thermal effect of the AC periodic component for a
three-pole short circuit. Electrical operational equipment is dimensioned according to either the
permissible short-time withstand current $I_{th}$ or the permissible duration of the short circuit
$T_K$.

> **Fig. 13.3** - Two-panel chart showing the factors $m$ and $n$ used in thermal short circuit
strength calculations, as a function of short circuit duration $T_k$ (horizontal axis, ranging from
0.01 s to 10 s on a logarithmic scale).
>
> **Panel a)** shows factor $m$ (vertical axis, 0 to 2.0) with a family of curves parameterized by
the peak factor $\kappa$, taking values: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, and 1.95. Each
curve decreases as $T_k$ increases. Higher values of $\kappa$ correspond to higher values of $m$
for a given $T_k$.
>
> **Panel b)** shows factor $n$ (vertical axis, 0 to 1.0) with a family of curves parameterized by
the ratio $I_k''/I_k$, taking values: 1, 1.25, 1.5, 2, 2.5, 3.3, 4, 5, and 6. Each curve decreases as
$T_k$ increases. Lower values of $I_k''/I_k$ correspond to higher values of $n$ for a given $T_k$.
**Fig. 13.3:** The factors $m$ and $n$ [1]
The duration of the short circuit and the short-time withstand current are given by the
manufacturers of protective equipment.
$$I_{th} \leq I_{thz}. \tag{13.3}$$
In accordance with IEC 76-1 $I_{th}$ must not exceed 25 times the nominal current for longer than
three seconds with short circuit current limiting reactors. With current transformers, this value is
given on the nameplate. Here:
$$I_{th} \leq \sqrt{\frac{I_{kn}}{(T_K + 0.05s}}}. \tag{13.4}$$
For short circuit durations:
$$T_K \geq 0.1s, \tag{13.5}$$
the following relationship holds true:
$$I_a = I_k''. \tag{13.6}$$
13.2 Thermal short circuit current strength **119**
If the peak short circuit current $i_p$ is not known and the initial symmetrical short circuit current
$I_k''$ is given, we can then calculate using the withstand ratio $\kappa = 1.8$.
The thermal equivalent short circuit current density $S_{th}$ must be smaller than the rated short
time current density $S_{thr}$. The following equation must be satisfied:
$$S_{th} \leq S_{thr} \cdot \frac{1}{\eta} \cdot \sqrt{\frac{T_{kr}}{T_k}}$$

The factor $\eta$ takes account of heat transfer for the insulation. The rated short time current
density $S_{thr}$ can be taken from Fig 13.4. The initial temperature $\nu$b of a conductor is the
maximum permissible continuous operating temperature. The ultimate temperature $\nu$e is the
maximum permissible temperature under short circuit conditions for plastic insulated cables.
> **Figure 13.4a - Graph description:**
> Graph (a) shows the rated short time current density $S_{thr}$ (in A/mm²) on the vertical axis
(ranging from 0 to 200 A/mm²) versus the initial conductor temperature $\vartheta_b$ (in °C) on
the horizontal axis (ranging from 20 to 130 °C), for **copper and steel** conductors (solid-line
curves), valid for $T_{kr} = 1$ s.
> Multiple curves are plotted, each corresponding to a different maximum permissible short circuit
temperature $\vartheta_e$, with values labeled on the right side of each curve: 120°C, 140°C,
160°C, 180°C, 200°C, 250°C, and 300°C. Additional labels on the lower-left region of the graph also
indicate $\vartheta_e = 300°C$, 250°C, and 200°C for the lower set of curves.
> As the initial temperature $\vartheta_b$ increases, the rated short time current density $S_{thr}$
decreases for each curve. Higher permissible short circuit temperatures $\vartheta_e$ correspond
to higher allowable $S_{thr}$ values.
> **Figure 13.4b - Graph description:**
> Graph (b) shows the rated short time current density $S_{thr}$ (in A/mm²) on the vertical axis
(ranging from 0 to 200 A/mm²) versus the initial conductor temperature $\vartheta_b$ (in °C) on
the horizontal axis (ranging from 20 to 130 °C), for **Aluminium (Aldrey and Al/St)** conductors
(broken-line curves), valid for $T_{kr} = 1$ s.
> Multiple broken-line curves are plotted, each corresponding to a different maximum permissible
short circuit temperature $\vartheta_e$, with values labeled on the right side: 120°C, 140°C, 160°C,
180°C, 200°C, 250°C, and 300°C.
> The trend is similar to graph (a): $S_{thr}$ decreases with increasing initial temperature
$\vartheta_b$, and higher $\vartheta_e$ values yield higher permissible current densities. The
absolute values of $S_{thr}$ are lower than those for copper and steel in graph (a), reflecting
aluminium's lower thermal and electrical conductivity.
**Fig. 13.4:** Rated short time current density $S_{thr}$ for $T_{kr} = 1$ s
a) for copper and steel (solid-line curves), b) for Aluminium (broken-line curves) Aldrey and Al/St.
## 13.3
### Limitation of short circuit currents
It is necessary to control both the minimum and the maximum short circuit currents in low voltage
systems without impairing the selectivity. Investigations have shown that the three-pole short
circuit currents are less than 9 kA, with an average value of 2.8 kA [34]. However, this value only
applies for low voltage networks. In low voltage networks the single-pole short circuits are
generally less than 1 kA. In order to limit the short circuit currents (Figure 13.5) special measures
are possible in individual systems according to the various operational equipment.

Fuses are unsuitable for smaller short circuit currents. This is why many power supply companies
prescribe line-protection circuit breakers in house installations. The short circuit current limitation
in high and medium voltage networks can be achieved through economical (e.g. the choice of
nominal network voltage or division of the network into individual groups) and technical (e.g. the
use of $i_p$ limiters and fuses).
> **Figure Description - Fig. 13.5: Current limitation through circuit breaker**
>
> Two side-by-side time-domain waveform diagrams (a and b) illustrating voltage and current
behavior during a short circuit event, with the horizontal axis representing time $t$ in milliseconds
(marked at 10 ms and 20 ms) and the vertical axis representing magnitude ($U$ for voltage,
dimensionless for current).
>
> **a) High power current limitation through circuit breaker:**
> The voltage waveform shows a half-sinusoidal rise to a peak value $U_B$ (the breaking voltage,
shown as a dotted curve), which exceeds the nominal voltage $U_N$ (shown as a solid reference
line). Below the time axis, the current waveform shows a large peak corresponding to $I_k$ (the
prospective short circuit current, dotted), with $I''_k$ (the initial symmetrical short circuit current)
also indicated. The circuit breaker interrupts the current early (within the first half-cycle, before 10
ms), significantly limiting the peak current - demonstrating high current-limiting capability.
>
> **b) Line-protection circuit breaker with neutral point quencher, without definite current
limitation:**
> The voltage waveform again shows $U_N$ as a reference, with $U_B$ now being a lower peak
(dotted), remaining below $U_N$. The current waveform shows the short circuit current $I_k$ and
$I''_k$ (dotted), but in this case the circuit breaker does not interrupt within the first half-cycle; the
current waveform continues past 10 ms before interruption, indicating no definite (strong) current
limitation. The breaking occurs later, closer to a natural current zero crossing.
**Fig. 13.5:** Current limitation through circuit breaker
a) high power current limitation through circuit breaker,
b) line-protection circuit breaker with neutral point quencher,
without definite current limitation
Figures 13.6, 13.7, 13.8, 13.9, 13.10 and 13.11 illustrate the short circuit carrying capacity of
different cables as a function of the break time.
**Fig. 13.6:** Thermally permissible short circuit current from paper-insulated cables at 1-10 kV
## [26]
> **Graph Description - Fig. 13.7:**
>
> A log-log chart showing the **thermally permissible short circuit current** ($I_k$ in kA, vertical
axis) as a function of **short circuit duration** ($t$ in seconds, horizontal axis) for paper-insulated
cables rated at 12/20 kV [26].
>
> **Axes:**
> - Vertical axis ($I_k$ [kA]): ranges from 1 kA to 100 kA on a logarithmic scale, with gridlines at
values: 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100.
> - Horizontal axis ($t$ [sec]): ranges from 0.1 s to 5 s on a logarithmic scale, with gridlines at: 0.1,
## 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 3, 4, 5.
>
> **Curves:**
> Two families of diagonal curves (each with negative slope, consistent with the inverse
relationship $I_k \propto 1/\sqrt{t}$) are plotted:
> - **Solid lines**: Copper (Cu) conductors
> - **Dashed lines**: Aluminium (Al) conductors
>
> Each pair of curves (one Cu solid, one Al dashed) corresponds to a specific conductor
cross-sectional area in mm², labeled on the right-hand side of the chart. The conductor
cross-sections listed (in mm²) are, from top to bottom:
>
> | Cu [mm²] | Al [mm²] |
> |----------|----------|
> | 300 | 240 |
> | 185 | - |
> | 240 | - |
> | 150 | - |
> | 185 | - |
> | 120 | - |
> | 95 | - |
> | 70 | - |
> | 120 | - |
> | 95 | - |
> | 50 | - |
> | 70 | - |
> | 35 | - |

> | 50 | - |
> | 25 | - |
> | 35 | - |
>
> The right-hand axis shows paired values for Cu (solid) and Al (dashed) cross-sections: 240,
300/185, 240/150, 185/120, 150/95, 120/70, 95, 50/70, 35/50, 25/35 mm².
>
> **Physical interpretation:** As short circuit duration $t$ increases, the permissible short circuit
current $I_k$ decreases, following the thermal limit relationship:
> $$I_k = A \cdot \frac{k}{\sqrt{t}}$$
> where $A$ is the conductor cross-sectional area [mm²] and $k$ is a material-dependent constant.
Copper conductors (solid lines) allow higher permissible currents than aluminium (dashed lines) for
the same cross-section due to copper's superior thermal and electrical conductivity.
**Fig. 13.7:** Thermally permissible short circuit current from paper-insulated cables at 12/20 kV
## [26]
*13.3 Limitation of short circuit currents* | **123**
> **Fig. 13.8** - Log-log chart: Thermally permissible short-circuit current $I_1$ [kA] vs. fault
duration $t$ [sec] for paper-insulated cables at 18/30 kV, for both Copper (Cu, solid lines) and
Aluminium (Al, dashed lines) conductors, across a range of cross-sectional areas $A$ [mm²].
**Description of the graph:**
The chart is a double-logarithmic (log-log) plot used in power cable engineering to determine the
maximum thermally permissible short-circuit current for paper-insulated cables rated at 18/30 kV.
- **Vertical axis (Y-axis):** Short-circuit current $I_1$ [kA], ranging from approximately 1 kA to 100
kA, on a logarithmic scale with labeled values: 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40,
## 50, 60, 70, 80, 90, 100.
- **Horizontal axis (X-axis):** Fault/short-circuit duration $t$ [sec], ranging from 0.1 s to 5 s, on a
logarithmic scale with labeled values: 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 3, 4, 5.
- **Diagonal lines:** Each line corresponds to a specific conductor cross-sectional area $A$ [mm²],
labeled on the right-hand side of the chart. Two families of lines are plotted:
- **Solid lines (-):** Copper (Cu) conductors
- **Dashed lines (- -):** Aluminium (Al) conductors
- **Cross-sectional areas labeled on the right axis (mm²):**
- Cu / Al pairs (approximately): 500/-, 400/-, 500/300, 400/-, 240/-, 300/185, 240/150, 120/185,
## 150/95, 120/-, 70/-, 95/-, 50/-, 70/-, 35/50, 25/35

More precisely, the right-side labels from top to bottom read:
500, 400, 500/300, 400, 240, 300/185, 240/150, 120/185, 150/95, 120, 70, 95, 50, 70, 35/50, 25/35
- **Physical interpretation:** As fault duration $t$ increases, the permissible short-circuit current
$I_1$ decreases (inverse relationship). Larger conductor cross-sections allow higher short-circuit
currents for the same duration. Copper conductors (for a given cross-section) permit higher
short-circuit currents than Aluminium conductors, as copper has better thermal and electrical
properties.
- **Legend (inset in the chart):**
- $\text{--}$ Cu
- $\text{- -}$ Al
**Fig. 13.8:** Thermally permissible short circuit current from paper-insulated cables at 18/30 kV
## [26]
**124** | 13 Mechanical and Thermal Short Circuit Strength
> **Graph Description:**
>
> **Fig. 13.9** is a log-log chart showing the **thermally permissible short circuit current**
($I_{th}$ in kA, vertical axis) as a function of **short circuit duration** ($t$ in seconds, horizontal
axis) for PVC-insulated cables rated at 1-10 kV [26].
>
> **Axes:**
> - **Vertical axis (left):** Short circuit current $I_{th}$ [kA], ranging from 1 kA to 100 kA on a
logarithmic scale.
> - **Horizontal axis (bottom):** Short circuit duration $t$ [sec], ranging from 0.1 s to 5 s on a
logarithmic scale, with major gridlines at 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5
seconds.
> - **Right axis:** Conductor cross-sectional area $A$ [mm²], with labeled values ranging from 25
mm² (bottom) to 500 mm² (top).
>
> **Curves:**
> The chart contains a family of parallel diagonal lines (running from upper-left to lower-right),
each corresponding to a specific conductor cross-sectional area. Two sets of curves are shown for
each cross-section:
> - **Solid lines (--):** Copper (Cu) conductors
> - **Dashed lines (- - -):** Aluminium (Al) conductors
>
> The conductor cross-sections labeled on the right axis are (from bottom to top):
> 25, 25/35, 35/50, 50/70, 70, 95/120, 95, 120/150, 120, 150/185, 150, 185/240, 185, 240/300,
240, 300/400, 300/185, 400/500, 500 mm²
> (paired values indicate Cu/Al correspondence at the same current-time curve)
>

> **Physical Interpretation:**
> Each curve represents the relationship $I_{th} = k \cdot A / \sqrt{t}$, where $k$ is a
material-dependent constant (higher for Cu than for Al). For a given cable cross-section and fault
duration $t$, one can read directly the maximum permissible short circuit current that the
conductor can withstand without exceeding its thermal limit (PVC insulation maximum
temperature). The parallel, straight lines on the log-log plot confirm the inverse square-root
relationship between current and time.
**Fig. 13.9:** Thermally permissible short circuit current from PVC-insulated cables at 1-10 kV [26]
**Fig. 13.10:** Thermally permissible short circuit current from XLPE-insulated cables [26]
> **[Graph - Fig. 13.11: Thermally permissible short circuit current of Cu screening]**
>
> The graph is a log-log (or semi-log) chart showing the **thermally permissible short circuit
current** $I_t$ (in kA, on the vertical axis, ranging from 1 to 50 kA) as a function of **short circuit
duration** $t$ (in seconds, on the horizontal axis, ranging from 0.1 to 5 s), for copper (Cu)
screening conductors of different cross-sectional areas $A$ (in mm²).
>
> **Axes:**
> - **Y-axis (left):** $I_t$ [kA] - logarithmic scale with values: 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 15,
## 20, 25, 30, 40, 50
> - **X-axis (bottom):** $t$ [sec] - logarithmic scale with values: 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5,
## 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 2.5, 3, 4, 5
> - **Y-axis (right):** $A$ [mm²] - indicating the cross-sectional area of the Cu screening, with
marked values at: 16, 25, and 35 mm²
>
> **Content:**
> Three diagonal straight lines (with negative slope) are plotted, each corresponding to a specific
cross-sectional area of the copper screening:
> - **A = 35 mm²** - uppermost line (highest permissible current for a given duration)
> - **A = 25 mm²** - middle line

> - **A = 16 mm²** - lowest line
>
> Each line represents the inverse relationship between permissible short circuit current and fault
duration: as fault duration increases, the thermally permissible current decreases. The lines follow
the general relationship $I_t \propto A / \sqrt{t}$, consistent with the thermal short circuit
withstand capability formula for conductors.
>
> **Source:** [26]
**Fig. 13.11:** Thermally permissible short circuit current of Cu screening [26]
# 14
# Calculations for Short Circuit Strength
To determine the short circuit strength for switchgear and control gear, the magnitude of the
prospective short circuit current is decisive. The choice of switchgear follows from:
- the short circuit strength and
- the rated breaking capacity.
## 14.1
### Short circuit strength for medium voltage switchgear
The following selection criteria are important for the short circuit strength of medium voltage
switchgear (HD 637 51):
- The rated short circuit breaking current $I_{sc}$: this is the effective value of the breaking current
at the terminals of the switchgear. The following condition must hold true:
$$I_{sc} \geq I_k''. \tag{14.1}$$
Standardized values for middle voltage systems are:
8 kA, 12.5 kA, 16 kA, 20 kA, 25 kA, 31.5 kA, 40 kA, 50 kA and 63 kA.
- The rated short circuit making current $I_{ma}$: this is the peak value of the making current for a
short circuit at the terminals of the switchgear. The following condition must apply for circuit
breakers, load (break) switches and grounding switches of medium voltage switchgear:
$$I_{ma} \geq i_p. \tag{14.2}$$
Standardized values for medium voltage systems are:
20 kA, 25 kA, 31.5 kA, 40 kA, 50 kA, 63 kA, 80 kA, 100 kA, 125 kA and 160 kA.
- The rated short-time current $I_{th}$: this is the effective value of the short circuit current which
the switchgear can carry in the closed state during the rated

short circuit duration $t_{th}$ under the specified conditions for use and operation.
- The thermal short circuit capacity $I_{thz}$:
$$I_{thz} \geq I_{thm} \tag{14.3}$$
$$I_{thz} = I_{th}\sqrt{\frac{t_{th}}{t_k}} \tag{14.4}$$
The symbols have the meanings:
$I_{sc}$ &nbsp;&nbsp; Rated short circuit breaking current
$I_k''$ &nbsp;&nbsp; Initial symmetrical short circuit current
$I_{thz}$ &nbsp;&nbsp; Thermal short circuit carrying capacity
$I_{thm}$ &nbsp;&nbsp; Thermal equivalent short circuit current
$I_{ma}$ &nbsp;&nbsp; Rated short circuit making current
$i_p$ &nbsp;&nbsp; Peak short circuit current
$I_{th}$ &nbsp;&nbsp; Rated short-time current
$t_{th}$ &nbsp;&nbsp; Rated short circuit duration (1s and 3s)
$i_k$ &nbsp;&nbsp; Maximum short circuit duration
**14.2**
**Short circuit strength for low voltage switchgear**
The following selection criteria must be considered for the short circuit strength of low voltage
systems (IEC EN 60 947):
- The rated ultimate short circuit breaking current (breaking capacity) $I_{cn}$: this is the largest
current which switchgear can break without incurring damage. It is given as an effective value.
Standardized values for low voltage switchgear are: 18 kA, 25 kA, 40 kA, 70 kA and 100kA.
$$I_{cn} \geq I_k''. \tag{14.5}$$
- The rated short circuit making current (making capacity) $I_{cm}$: this is the largest current which
switchgear can make without incurring damage. It is given as a peak value. The power factor cosf of
the short circuit path depends primarily on the reactance of the input transformer. The greater its
power, the smaller is the power factor. For this relationship, IEC 947-2 gives a minimum value for
circuit breakers:
$$I_{cm} = nI_{cn} = \kappa\sqrt{2}I_{cn}. \tag{14.6}$$
According to type, the circuit breakers must be able to interrupt the following short circuit and
operating currents:

- Circuit breakers with cos$\varphi$ ≥ 0.1: short circuit currents
- Circuit breakers with cos$\varphi$ ≥ 0.7: load currents
- Circuit breakers with cos$\varphi$ < 0.1: operating currents
- The rated short-time withstand current $I_{cw}$: this is the permissible effective value of the AC
periodic component of the uninfluenced short circuit current which the switchgear can carry for a
certain length of time without noticeable effect (e.g. due to excessive evolution of heat), e.g. from
0.05 s to 1 s.
In accordance with IEC 60 947, circuit breakers are tested with two currents for breaking the short
circuit current.
The $I_{cu}$ test sequence is 0-t-C0
The $I_{cs}$ test sequence is 0-t-C0-t-C0
The current $I_{cs}$ represents the more severe condition for the circuit breakers, because
switching takes place one additional time and is stipulated as 25%, 50%, 75% and 100% of $I_{cu}$
in order to distinguish the function of the switch following a short circuit break.
The symbols have the meanings:
$I_{cu}$ &nbsp;&nbsp; Rated short circuit breaking current
$I''_k$ &nbsp;&nbsp; Initial symmetrical short circuit current
$I_{cm}$ &nbsp;&nbsp; Rated short circuit making current
$i_p$ &nbsp;&nbsp; Peak short circuit current
# 15
# Equipment for Overcurrent Protection
The time-current characteristics of limit switch fuses (Figures 15.1 and 15.2) are plotted in
logarithmic scale as a function of current. At higher short circuit currents, they break faster so that
the peak short circuit current $i_p$ can no longer occur. The cut-off current is reached during the
break process and can be taken from Figure 15.3. The effective current limitation and the very high
breaking capacity are the good features of these fuses. The cut-off energy or $I^2t$ values of the
fuses are decisive for the selectivity, which is normally guaranteed to be 1.6 times the rated current

(better is 2 times). The high voltage - high power fuses (HH fuses) protect equipment and system
components from the dynamic and thermal effects of short circuit currents. The HH fuses are used
in distribution transformers, high voltage motors, capacitors and middle voltage transformers. The
combination of these fuses with load break switches, load switches and vacuum protectors is
possible. Figures 15.4 and 15.5 show the time-current characteristics and Figure 15.6 the cut-off
characteristics. The miniature circuit breakers according to IEC 898 (Figure 15.7) are used in house
installations and systems against overloading and short circuits. Internationally, the characteristics
B, C and D are standardized. The function values in the overload region are the same for all
miniature circuit breakers, but in the range of short circuits the breaking current is a multiple of the
rated current for the breaker. The assessment of capacity is according to the following criteria:
- Rated breaking capacity 3 kA, 6 kA, 10 kA or 25 kA
- Short circuit stress and selectivity
- Limiting class 1, 2 or 3
- Backup protection.
The characteristics of circuit breakers (Figures 15.8 and 15.9) are derived from IEC 947 and are valid
for the cold state with a three-phase load for which in accordance with IEC 60 898 the deviation
from the release time from three times the current setting may be a maximum of $\pm\, 3\,\%$. In
the warm operational state the release times of the thermal tripping devices are reduced by about
25 %. The circuit breakers are compact circuit breakers up to 63 A and function according to the
principle of current limitation. These devices are used for breaking and protecting motors, cables
and conductors, as well as other operational equipment with undelayed overcurrent tripping
devices and current-dependent overload tripping devices.
The thermal tripping device *a* is set to the rated current of the motor to be protected and the
magnetic tripping device *n* to twelve times the current.
For the protection of control transformers, 19 times the current is set. The dependence of the
rated short circuit breaking capacity $I_{cu}$ and the rated service short circuit breaking capacity
$I_{cn}$ on the rated current $I_r$ and the rated normal current $I_r$ is taken from the respective
manufacturer. Whether backup fuses are required must be calculated from the prospective
three-pole short circuit current. The circuit breakers which protect the motors, cables and
conductors, transformers and other system components satisfy the increased requirements for
overloading and short circuit current protection up to 6000 A. They are climatically stable and
suitable for operation in closed rooms in which no extreme operating conditions (e.g. dust, caustic
vapors or aggressive gases) are present. Otherwise, metal enclosing is required.
Protective functions and setting possibilities:
- Current-dependent delayed overload tripping
The current setting $I_e$ can be set to between 0.5 and 1 times the rated switchgear current $I_n$
in four steps.
- Short-time delay release of short circuit

The pickup value $I_d$ can be set in seven steps between two and eight times the value of $I_r$.
The delay time can be selected between 0 and 500 ms and in some cases higher. This allows a time
selectivity.
- Undelayed release of short circuit
The pickup value $I_i$ for an undelayed short circuit release is set to 15 kA or to 20 kA.
- Ground fault tripping
The ground fault tripping device senses fault currents which flow to ground and can cause fires in
the system. The adjustable delay time allows the use of several switching steps sequentially.
Circuit breakers are used as:
- Input and branch circuit breakers in three-phase distribution systems
- Main circuit breakers for machining and processing systems in accordance with IEC 204-1
- Emergency Off circuit breakers in accordance with IEC 204-1 with undervoltage release and in
conjunction with an Emergency Off control station
- Switching devices and protective equipment for motors, transformers, generators and capacitors
- Meshed network circuit breakers in meshed low voltage networks with several high voltage
inputs
- Ground fault protection
**Fig.15.1:** Time-current characteristics of limit switch fuses in accordance with IEC 269-1 [31]
> **Description of the graph:**
>
> This is a log-log chart showing the **time-current characteristics of limit switch (NH) fuses** in
accordance with IEC 269-1. The chart is rotated 90° counterclockwise in the original document.
>
> **Axes:**
> - **Horizontal axis (X):** Virtual pre-arcing time $t_{vs}$ (in seconds), ranging from
approximately $4 \times 10^{-3}$ s to $10^4$ s, plotted on a logarithmic scale.
> - **Vertical axis (Y):** Prospective short circuit current $I_p$ (in amperes, A), ranging from
approximately $10^1$ A to $10^5$ A, plotted on a logarithmic scale.
> - **Top axis:** Cut-off time $t_a$ (in seconds), with values indicated at approximately 0.1, 0.2,
0.4, 1, 2, 5 s.
>
> **Curves:**
> The chart contains two families of curves:
>
> 1. **Left-side family of curves (melting/pre-arcing characteristics):** Each curve corresponds to a
specific fuse rated current (in amperes). The fuse ratings labeled include: **2, 4, 6, 9, 10, 16, 25, 35,
50, 63, 70, 80, 95, 100, 120, 125, 150, 160, 185, 200, 240, 250, 315, 500, 800, 1250** A (reading
from the labels visible on the curves). These curves rise steeply from left to right, indicating that
higher currents result in shorter pre-arcing times.
>

> 2. **Right-side family of curves (cut-off current characteristics):** These curves show the
relationship between the prospective short circuit current $I_p$ and the actual cut-off current
$I_s$, for the same fuse ratings as above.
>
> **Shaded region:**
> A shaded (hatched) area is indicated on the chart labeled **"Areas of application of critical load
curve for conductors"**, marking the zone where the fuse characteristics intersect with the
thermal withstand limits of the protected conductors.
>
> **Purpose:**
> This chart is used in electrical engineering to select appropriate fuse ratings for short-circuit
protection of cables and conductors, allowing engineers to determine pre-arcing times, cut-off
times, and cut-off currents for a given prospective fault current, and to verify coordination with
conductor thermal limits.
> **[FIGURE DESCRIPTION - Fig. 15.2]**
>
> **Type:** Log-log time-current characteristic chart for limit switch fuses.
>
> **Title/Caption:** Time-current characteristics of limit switch fuses in accordance with IEC 269-1
[31] 1) small test current 2) large test current.
>
> **Axes:**
> - **Horizontal axis (X-axis):** Prospective current $I_p$ (in amperes, A), ranging from $4 \times
10^{-3}$ A on the right to $10^5$ A on the left (the axis is oriented right-to-left in the original, with
values increasing to the right in physical terms). Scale markings: $4 \cdot 10^{-3}$, $10^{-2}$,
$10^{-1}$, $10^{0}$, $10^{1}$, $10^{2}$, $10^{3}$, $10^{4}$, $10^{5}$ A, with intermediate
subdivisions at 2 and 5.
> - **Vertical axis (Y-axis, right side):** Prospective peak current $I_p$ (in amperes, A), ranging
from $10^1$ to $10^5$ A, with subdivisions at 2 and 5.
> - **Vertical axis (left side):** Time $t_s$ (in seconds), ranging from $10^{-3}$ s to $10^4$ s,
decreasing upward.
>
> **Content:**
> The chart displays a family of time-current curves for fuses of various rated current values. Two
groups of curves are shown, corresponding to:
> 1. **Small test current** (lower boundary curves, labeled "1")
> 2. **Large test current** (upper boundary curves, labeled "2")
>
> Each pair of curves (upper and lower tolerance band) is associated with a specific fuse rated
current. The rated current values visible on the curves include (in mm² cross-section labeling on the
left set and ampere ratings on the right set):

>
> - Left group (conductor cross-sections in mm²): **1, 2, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120,
150, 185, 240 mm²**
> - Right group (fuse rated currents in amperes): **4, 10, 20, 35, 63, 100, 160, 250, 400, 630, 1000
## A**
>
> **Shaded Region:**
> A shaded (hatched) area in the lower-right portion of the chart is labeled:
> - "Areas of application of critical load curve"
> - "for conductors"
>
> This region indicates the zone where the fuse time-current characteristics overlap with the critical
thermal withstand curves of the conductors they are intended to protect.
>
> **General Description:**
> The curves follow a typical inverse time-current relationship on a log-log scale, with operating
time decreasing steeply as prospective current increases. The chart is used to select appropriate
fuses for conductor protection by ensuring the fuse characteristic lies below (faster operation than)
the conductor's critical load curve across the relevant current range.
**Fig. 15.2:** Time-current characteristics of limit switch fuses in accordance with IEC 269-1 [31] 1)
small test current 2) large test current
**Fig.15.3:** Cut-off current of limit switch fuses [32]
> **Description of the graph:**
>
> This is a log-log (double logarithmic) graph used in electrical engineering to determine the
**cut-off current** ($I_d$) of high-speed (current-limiting) fuse links as a function of the
**prospective short-circuit current** ($i_P$).
>
> **Axes:**
> - **Vertical axis (Y-axis):** Cut-off current $I_d$, ranging from $10^1$ to approximately $3
\times 10^8$ (in Amperes), plotted on a logarithmic scale. The axis is labeled "$I_d$" with an
upward arrow indicating increasing values.
> - **Horizontal axis (X-axis):** Prospective short-circuit current $i_P$, ranging from $10^1$ to
$10^5$ (in Amperes), plotted on a logarithmic scale. The axis is labeled "Prospective short circuit
current $\longrightarrow$ $i_P$".
>
> **Curves:**
> Multiple diagonal straight lines are drawn across the graph, each corresponding to a different
**fuse link rating (current rating in Amperes)**. The fuse link ratings are labeled on the right-hand
side of the graph and include the following values (from top to bottom):
>

> - ① 1000
> - ② 630
> - 425, 355, 300, 224, 160
> - 100
> - 63
> - 40, 32
> - 20
> - 10
> - 6
> - 4
> - 2
>
> The right side also shows a vertical arrow labeled "Fuse link" with an upward direction, indicating
increasing fuse link current ratings toward the top curves.
>
> **Interpretation:**
> Each curve allows the user to determine the **actual peak cut-off current** ($I_d$) that a
specific fuse will permit to flow, given the **prospective (available) short-circuit current** ($i_P$)
in the circuit. Since these are current-limiting fuses, $I_d$ is always significantly lower than $i_P$,
demonstrating the current-limiting effect. Higher-rated fuse links allow proportionally higher
cut-off currents. All curves follow an approximately linear relationship on the log-log scale,
indicating a power-law relationship between $I_d$ and $i_P$.
> **Graph Description - Fig. 15.4: Time-current characteristics of HH fuses (IEC 282, Part 402)**
>
> The figure is a log-log (double-logarithmic) graph showing the **pre-arcing time** (vertical axis,
in seconds) versus the **steady-state symmetrical short-circuit current (effective value)**
(horizontal axis, in amperes) for a family of HH (high-rupturing-capacity, high-voltage) fuses rated
according to IEC 282, Part 402.
>
> **Axes:**
> - **Vertical axis (Y):** Pre-arcing time, ranging from $10^{-2}$ s to $10^4$ s, with intermediate
divisions at $10^{-1}$, $10^0$ (1 s), $10^1$, $10^2$, $10^3$ s. Subdivisions of 2 and 5 are marked
within each decade.
> - **Horizontal axis (X):** Steady-state symmetrical short-circuit current (effective value), ranging
from $10^1$ A to beyond $10^4$ A, with subdivisions at 2 and 5 within each decade.
>
> **Curves:**
> Multiple characteristic curves are plotted, each corresponding to a specific fuse current rating.
The rated currents labeled at the top of the graph (along the upper border) are:
> - **6 A, 10 A, 16 A, 25 A, 40 A, 63 A, 100 A, 160 A, 250 A, 2×160 A, 2×250 A**
>

> Each curve is steeply falling (inverse-time characteristic): as the short-circuit current increases,
the pre-arcing time decreases sharply. The curves are approximately parallel and shift to the right
as the fuse rating increases. At high currents (above approximately $10^3$ A), the curves flatten
slightly before dropping steeply, indicating the current-limiting region of the HH fuses. The family
of curves collectively illustrates the selectivity and grading characteristics achievable with this
series of fuses.
**Fig.15.4:** Time-current characteristics of HH fuses in accordance with IEC 282, Part 402 [31]
> **Fig. 15.5** - Time-current characteristics of HH fuses in accordance with IEC 282, Part 402 [31]
**Description of the graph:**
This is a **log-log plot** showing the **time-current (pre-arcing) characteristics of HH (High
rupturing capacity, High voltage) fuses**, as specified by IEC 282, Part 402.
- **Vertical axis (Y-axis):** Pre-arcing time, ranging from $10^{-2}$ s to $10^{4}$ s (logarithmic
scale), with intermediate subdivisions at $2$ and $5$ for each decade.
- **Horizontal axis (X-axis):** Steady-state symmetrical short-circuit current (effective value),
ranging from $10^{1}$ A to $10^{4}$ A (logarithmic scale), also with subdivisions.
**Curves shown:**
Six sets of paired curves (minimum and maximum pre-arcing time boundaries, forming bands) are
plotted, each corresponding to a rated fuse current. The fuse ratings labeled on the graph are:
- **20 A**
- **32 A**
- **50 A**
- **63 A** (labeled as 60 A)
- **125 A**
- **200 A**
Each fuse rating is represented by a **pair of curves** (dashed lines forming a band), indicating
the tolerance band between the minimum and maximum pre-arcing times for that rating. The
curves have a steep, nearly vertical descent characteristic typical of HH fuses, showing that as the
fault current increases significantly above the rated current, the pre-arcing time drops sharply -
from hundreds or thousands of seconds at small overcurrents to milliseconds ($10^{-2}$ s) at high
short-circuit currents.
The overall shape of the characteristic is typical of **current-limiting fuse behavior**: very long
operating times for small overcurrents, transitioning to extremely fast operation (current-limiting
regime) for large prospective short-circuit currents.

> **[GRAPH DESCRIPTION - Fig. 15.6: Peak Let-Through Current Chart for HH Fuses (IEC 282, Part
## 402)]**
>
> This is a log-log chart used to determine the **peak let-through (cut-off) current** of HH (High
Rupturing Capacity) fuses as a function of the **initial symmetrical short-circuit current**
(prospective short-circuit current, effective/RMS value).
>
> **Axes:**
> - **X-axis (horizontal):** Initial symmetrical short circuit current (effective value) $I''_k$, ranging
from approximately $5 \times 10^1$ A to $10^5$ A (i.e., ~50 A to 100 kA), on a logarithmic scale. A
reference marker at **40 kA** is indicated near the lower-right area of the graph.
> - **Y-axis (vertical):** Cut-off current (peak let-through current) in amperes (A), ranging from
approximately $10^1$ A to $10^5$ A, on a logarithmic scale.
>
> **Reference Line:**
> A diagonal reference curve labeled **"Uninfluenced peak short circuit current with largest DC
aperiodic component ($\cos\theta = 0.15$)"** runs across the upper portion of the chart. This
represents the unmitigated prospective peak current (worst case, with maximum DC offset at
$\cos\theta = 0.15$), serving as an upper boundary.
>
> **Fuse Link Curves:**
> Multiple curves are plotted, each corresponding to a specific **fuse link rating** (labeled on the
right side of the chart under the heading "Fuse link"). The fuse ratings shown are:
> - 2×250 A, 2×160 A
> - 250 A, 200 A, 160 A
> - 125 A
> - 100 A, 80 A, 63 A
> - 50 A, 40 A
> - 32 A
> - 25 A
> - 20 A, 16 A
> - 10 A
> - 6 A
>
> Each curve rises from lower-left to upper-right. For higher prospective fault currents, the fuse
cuts off at a peak current significantly lower than the uninfluenced peak, demonstrating the
**current-limiting effect** of HH fuses.
>
> **Example indicated on the chart:**
> A dashed horizontal line at **7.5 kA** on the Y-axis intersects the **40 A fuse link curve** at an
$I''_k$ of **40 kA**, illustrating that a 40 kA prospective short-circuit current is limited to a peak
cut-off current of 7.5 kA by a 40 A fuse link.
**Fig.15.6:** Peak let-through current chart for HH fuses in accordance with IEC 282, Part 402 [31]
(Example: 40 kA initial symmetrical short circuit current is limited to 7.5 kA using a fuse link of 40 A)

> **Fig. 15.7** - Two log-log time-current characteristic charts for miniature circuit breakers
(MCBs) at 30 °C, reproduced from reference [28].
>
> **Left chart - Tripping characteristics B (by 30°C):**
> - Horizontal axis: $I_\text{eff}$ (effective current) from 4 A to 1000 A, logarithmic scale.
> - Vertical axis: tripping time $t$ from approximately 4 ms up to 2 h, logarithmic scale with units
marked in hours (h), seconds (s implied by unlabelled decades), and milliseconds (ms).
> - A family of curves is shown for rated currents: **6, 10, 13, 16, 20, 25, 32, 40 A** (labelled at the
top of the chart).
> - Each curve exhibits the typical MCB shape: a long thermal (overload) region where tripping time
decreases steeply with increasing current, transitioning to a near-vertical electromagnetic
(instantaneous) tripping region at higher currents (approximately 3-5 × $I_n$ for type B).
>
> **Right chart - Tripping characteristics C (by 30°C):**
> - Axes identical to the left chart ($I_\text{eff}$ vs. $t$), with time units explicitly labelled:
**min** (minutes), **s** (seconds), **ms** (milliseconds).
> - Same family of rated currents: **6, 10, 13, 16, 20, 25, 32, 40 A**.
> - The instantaneous tripping threshold is shifted to higher multiples of $I_n$ compared to type B
(approximately 5-10 × $I_n$ for type C), so the near-vertical portions of the curves appear further
to the right on the current axis.
**Fig.15.7:** Time-current characteristics of miniature circuit breakers [28]
Cut-off currents of miniature circuit breakers:
For the overloading range:
A: $I_a = 1.45 \cdot I_n$ &nbsp;&nbsp;&nbsp; B: $I_a = 1.45 \cdot I_n$ &nbsp;&nbsp; C: $I_a =
1.45 \cdot I_n$ &nbsp;&nbsp; D: $I_a = 1.45 \cdot I_n$
For the short-circuit range:
A: $I_a = 3 \cdot I_n$ &nbsp;&nbsp;&nbsp; B: $I_a = 5 \cdot I_n$ &nbsp;&nbsp; C: $I_a = 10 \cdot
I_n$ &nbsp;&nbsp;&nbsp;&nbsp; D: $I_a = 20 \cdot I_n$
**a)**
> **[FIGURE DESCRIPTION - Fig. 15.8a]**
>
> Log-log graph showing the **time-current characteristics of circuit breakers for motor protection
with electronic tripping**, labeled as tripping characteristics **"an"**.
>
> - **X-axis (horizontal):** Current expressed as a multiple of the rated current $I_r$, ranging from
$1\,\hat{I}_r$ to $150 \times I_r$, with scale markings at: 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40,
60, 100, 150 × $I_r$.
> - **Y-axis (vertical):** Opening time (tripping time), with dual scale:

> - Left scale: minutes (60 min down to 1 min) and fractions of seconds
> - Right scale: seconds (s), ranging from 2000 s down to 0.005 s, with major gridlines at: 2000,
1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005 s.
>
> **Curve features:**
> - A single continuous time-current curve (labeled **"a"** in the overload region and **"n"** in
the instantaneous/short-circuit region) that starts at the upper left (long tripping times at currents
just above $I_r$) and sweeps steeply downward to the lower right (very short tripping times at high
multiples of $I_r$).
> - In the overload region (approx. 1-12 × $I_r$), the curve shows **inverse-time** behavior
following a thermal model.
> - Multiple vertical lines mark the **setting steps for the instantaneous pickup current $I_i$**,
labeled sequentially as: $2\times$, $3\times$, $4\times$, $5\times$, $6\times$, $7\times$,
$8\times$, $10\times$, $12\times$ (multiples of $I_r$). These vertical steps represent adjustable
instantaneous trip thresholds.
> - A horizontal dashed reference line at $T_c = 10\,\text{s}$ is indicated, representing the motor
thermal time constant setting.
> - Below the instantaneous threshold, the tripping time drops abruptly to approximately 0.05-0.02
s (50-20 ms), representing the electromagnetic/instantaneous trip region.
> - The curve at high currents (above ~15 × $I_r$) flattens to a near-constant minimum opening
time of approximately 0.02-0.05 s, reflecting the fixed mechanical/electronic response time of the
circuit breaker.
**Fig. 15.8:** Time-current characteristics of circuit breakers for motor protection with electronic
tripping [28]
**141**
**Fig. 15.9:** Time-current characteristics of circuit breakers up to 6300 A [28]
The meanings of the symbols are:
- $I_n$ &nbsp;&nbsp; Nominal current
- $I_r$ &nbsp;&nbsp; Rated current
- $I_e$ &nbsp;&nbsp; Current setting
- $I_d$ &nbsp;&nbsp; Threshold current
- $t_d$ &nbsp;&nbsp; Delay time
- $z$ &nbsp;&nbsp; Short-time delay release
- $n$ &nbsp;&nbsp; Undelayed electromagnetic tripping device
- $a$ &nbsp;&nbsp; Current-dependent delayed overload tripping device
- $t_{vs}$ &nbsp;&nbsp; Virtual prearcing time
- $I_c$ &nbsp;&nbsp; Maximum cut-off current
- $I^2_{ts}$ &nbsp;&nbsp; $I^2 t$ value of fuse
- $I^2_{ta}$ &nbsp;&nbsp; $I^2 t$ break value
- $I_{cn}$ &nbsp;&nbsp; Rated short circuit breaking capacity
- 1 &nbsp;&nbsp; Peak short circuit current without DC aperiodic component
- 2 &nbsp;&nbsp; Peak short circuit current with largest DC aperiodic component
- $I_{eff}$ &nbsp;&nbsp; Effective value of uninfluenced short circuit current
# 16

**Short Circuit Currents in DC Systems**
The most important power generator is the three-phase synchronous generator. Consequently,
short circuit currents in electrical networks are supplied from the generator feed-ins. In power
stations and in industry DC systems such as DC motors, permanently installed lead batteries,
smoothing capacitors and converter arms are frequently found. The short circuit current
calculation for these systems is described in IEC 61 660-1 and will be discussed briefly here. This
standard contains a method for the calculation of short circuit currents in these systems [10].
However, it is also possible to use another method.
The short circuit currents, pure resistances and inductances can be measured or obtained from
model experiments. In DC systems it is also necessary to distinguish between short circuit currents
of different magnitudes:
- The smallest short circuit current is used as the basis for the selection of overcurrent protection
equipment. For the calculation of the smallest short circuit currents we must consider under which
circuit and operating conditions the smallest short circuit current flows:
- The resistances of the conductors must be considered in relation to the maximum operating
temperature
- The transition resistances must be considered
- The short circuit current of the current converter is the rated value of the current limiting
- The batteries are discharged by up to the discharge voltage of 1.8 V/cell, unless otherwise
specified by the respective manufacturer
- Diodes used to decouple power supply units must be considered
- The largest short circuit current serves to dimension the electrical operational equipment. For
the calculation of the largest short circuit currents we must consider under which circuit and
operating conditions the largest short circuit current flows:
- The resistances of the conductors must be considered in relation to a temperature of 20 °C
- The transition resistances of the bus bars can be neglected
- The regulation for limiting the current converter current is not functioning
- The batteries are fully charged
Figure 16.1 illustrates typical short circuit currents for different sources. Figure 16.2 shows the
standardized approximation functions for all current paths. Figure 16.3 represents a DC system
with four sources.
> **[Fig. 16.1 - Four time-domain plots showing typical short circuit current waveforms for
different DC sources:]**
>

> - **Top-left (Current Converter):** Shows current $i_D$ vs. time $t$, with peak current $i_{pD}$
occurring at time $t_{pD}$. Two curves are shown: one for a current converter *without smoothing
choke coil* (exhibiting an oscillatory/rippled waveform that settles to a quasi-steady-state level
$I_{kD}$) and one *with smoothing coil* (a smoother rising curve settling to a lower steady-state
value $I_{kD}$).
>
> - **Top-right (Battery):** Shows current $i_B$ vs. time $t$, with peak $i_{pB}$ at time $t_{pB}$.
The waveform rises sharply to the peak and then decays slowly toward the steady-state short
circuit current $-I_{kB}$, indicating the battery's internal impedance behavior.
>
> - **Bottom-left (Capacitor):** Shows current $i_C$ vs. time $t$, with a very sharp, high peak
$i_{pC}$ at time $t_{pC}$, followed by a rapid exponential decay toward zero, characteristic of
capacitor discharge.
>
> - **Bottom-right (Motor):** Shows current $i_M$ vs. time $t$, with peak $i_{pM}$ at time
$t_{pM}$. Two curves are shown: one *without stray torque* (rises to peak and decays to
steady-state $I_{kM}$) and one *with stray torque* (rises more gradually to a lower peak and
decays faster, indicating the braking effect of stray torque on the motor's back-EMF contribution).
**Fig. 16.1:** Typical paths for short circuit currents [10]
> **[Fig. 16.2 - A single time-domain plot showing the standardized approximation functions for DC
short circuit currents:]**
>
> The graph plots current $i$ vs. time $t$ (with origin at $0$), and defines two piecewise
approximation curves:
>
> - **$i_1(t)$**: The rising portion of the waveform from $t = 0$ to $t = t_p$. It rises with a time
constant $\tau_1$ (shown as a horizontal bracket near the peak region) toward the peak current
$i_p$. The dotted horizontal line at $i_p$ represents the peak level.
>
> - **$i_2(t)$**: The decaying portion from $t = t_p$ onward. It decays exponentially with time
constant $\tau_2$ (shown as a horizontal bracket in the decay region) from the peak $i_p$ down
toward the steady-state short circuit current $I_k$ (shown as a dashed horizontal line at a lower
level), which persists until the end of the short circuit duration $T_k$.
>
> Key labeled points on the time axis: $0$, $t_p$ (time to peak), and $T_k$ (total short circuit
duration).
**Fig. 16.2:** Standardized approximation functions [10]

> **[Figure 16.3 - Equivalent Circuit Diagram Description]**
>
> The diagram shows a comprehensive equivalent circuit for the calculation of short circuit currents
in a DC power system (per IEC 61 660-1). The circuit is organized into several parallel current source
paths feeding into a common conductor/load section (with components $R_Y$, $L_Y$, and fuses F1
and F2).
>
> **Top path - Current converter with inductive smoothing, transformer and network:**
> Starting from a three-phase network (represented by a hatched source with $R_Q$, $X_Q$),
through a bus bar (Q), a power cable ($R_p$, $X_p$), a transformer ($R_T$, $X_T$), a choke
($R_R$, $X_R$), and a three-phase bridge rectifier. The network impedance is expressed as $Z_N =
R_N + jX_N$. After rectification, a smoothing choke coil section follows with $R_{SB}$, $L_{SB}$,
diode $S_D$, and conductor elements $R_{DL}$, $L_{DL}$, with current $i_D$.
>
> **Second path - Lead battery:**
> Contains a battery EMF source $E_B$, internal resistance $R_B$, inductance $L_B$, current
$i_B$, switch $S_B$, and conductor elements $R_{BL}$, $L_{BL}$.
>
> **Third path - Capacitor:**
> Contains a capacitor with EMF source $E_C$, resistance $R_C$, current $i_C$, switch $S_C$, and
conductor elements $R_{CL}$, $L_{CL}$.
>
> **Bottom path - Motor:**
> Divided into three sub-sections: Excitation (current source $E_F$, current $i_F$, resistance
$R_F$, inductance $L_F$), Mass inertial (rotational mass $M_M$ with speed $n$, load torque
$M_L$), and Armature (EMF source $E_M$, resistance $R_M$, inductance $L_M$, current $i_M$,
switch $S_M$, conductor elements $R_{ML}$, $L_{ML}$).
>
> All paths converge at the right side through the common rail with $R_Y$, $L_Y$, and protective
fuses F1 and F2.
**Fig. 16.3:** Equivalent circuit for the calculation of short circuit currents [10]
The calculation procedure for this circuit (Figure 16.3) will now be briefly explained in the following
section (see IEC 61 660-1 for more detailed information).
**16.1**
**Resistances of line sections**
The pure resistance per unit length is:
$$R' = \frac{2 \cdot \rho}{S}. \tag{16.1}$$

The touch resistance of screw connections for the smallest short circuit current is:
$$R = \frac{14 \cdot \rho \cdot d}{S}.$$
## (16.2)
where:
- $S$: Cross-section in mm²
- $R'$: Resistance per unit length in Ω/m
- $\rho$: Resistivity in Ω · mm²/m
- $d$: Width of rectangular conductor.
The inductance per unit length of the individual cables is calculated from:
$$L' = \frac{\mu_0}{\pi} \left( \ln \frac{a}{r} + \frac{1}{4} \right).$$
## (16.3)
The inductance per unit length of bus bars is calculated, for a > b, from:
$$L' = \frac{\mu_0}{\pi} \left( \frac{3}{2} + \ln \frac{a}{b+h} \right),$$
## (16.4)
where:
- $\mu_0$: $4\pi \cdot 10^{-7}$ H/m permeability
- $a$: Average distance between conductors in m
- $L'$: Inductance per unit length in H/m.
> **Fig. 16.4 - Equivalent circuit of a converter arm [10]**
>
> The diagram shows an equivalent circuit divided into two sections: the **AC side** (left) and the
**DC side** (right).
>
> On the **AC side**, there is an AC voltage source labeled $\frac{c \cdot U_n}{\sqrt{3}}$
connected in series with a network impedance $Z_N$ (represented as an inductor/impedance
symbol).
>
> A diode (or thyristor) rectifier bridge symbol is shown at the interface between the AC and DC
sides.
>
> On the **DC side**, there is a series combination of:
> - A resistance $R_{\text{DBr}}$
> - An inductance $L_{\text{DBr}}$
> - A current $i_D$ flowing toward terminal point $F$
>

> The circuit terminates at two output terminals (labeled $F$ and the return path), representing
the DC output of the converter arm.
**Fig. 16.4:** Equivalent circuit of a converter arm [10]
**16.2**
**Current converters**
The network impedances for the determination of the smallest short circuit current can be taken
from Chapter 8. The resistance and the inductance of the current converter are (Figure 16.4):
$$R_{DBr} = R_S + R_{DL} + R_Y,$$
## (16.5)
*16.3 Batteries* **147**
$$L_{DBr} = L_S + L_{DL} + L_Y, \tag{16.6}$$
where:
$R_S, L_S$: Resistance and inductance of saturated choke coil
$R_Y, L_Y$: Resistance and inductance of coupling branch
$R_{DL}, L_{DL}$: Resistance and inductance of conductor in current converter
The peak short circuit current is:
$$i_{pD} = \kappa \cdot I_{kD} \text{ with } \kappa = f\left[\frac{R_N}{X_N}\left(1 + \frac{2}{3}
\cdot \frac{R_{DBr}}{R_N}\right); \frac{L_D Br}{L_N}\right]. \tag{16.7}$$
The steady state short circuit current is:
$$I_{kD} = \lambda_D \cdot \frac{1}{\sqrt{3}} \cdot \frac{\sqrt{2} \cdot c \cdot U_n}{Z_N} \text{
with } \lambda_D = f\left[\frac{R_N}{X_N}; \frac{R_{DBr}}{R_N}\right]. \tag{16.8}$$
**16.3**
**Batteries**
The simplified equivalent circuit of a permanently installed lead battery for the short circuit current
is shown in Figure 16.5.
For the nominal voltage $U_{nb}$ of a battery:

$$U_{nB} = 2.0 \, V/cell. \tag{16.9}$$
> **Figure 16.5 - Equivalent circuit of a battery:**
>
> The circuit diagram represents a simplified DC equivalent circuit of a lead-acid battery used for
short circuit current analysis. It consists of:
> - A DC voltage source $E_B$ (no-load voltage of the battery), represented on the left side with
polarity indicated (current flowing downward into the negative terminal).
> - A series resistor $R_{BBr}$ (internal resistance of the battery branch), connected in series with
the voltage source.
> - A series inductor $L_{BBr}$ (inductance of the battery branch), connected after the resistor.
> - A current arrow $i_B$ indicating the direction of the short circuit current flowing through the
branch toward the fault point.
> - A fault point labeled **F** on the right side, connected via a closing switch/fault link to the
return conductor, completing the circuit loop back to the negative terminal of the battery.
**Fig. 16.5:** Equivalent circuit of a battery [10]
No-load voltage of the charged battery:
$$E_B = 1.05 \cdot U_{nB}, \tag{16.10}$$
No-load voltage of the uncharged battery:
$$E_B = 0.9 \cdot U_{nB}. \tag{16.11}$$
Resistance of the battery:
$$R_{BBr} = 0.9 \cdot R_B + R_{BL} + R_Y. \tag{16.12}$$
Inductances of the battery
$$L_{BBr} = L_B + L_{BL} + L_Y. \tag{16.13}$$
Peak short circuit current of the battery:
$$I_{pB} = \frac{E_B}{R_{BBr}}. \tag{16.14}$$
Steady state short circuit current of the battery:
$$I_{kB} = 0.95 \cdot \frac{E_B}{R_{BBr} + 0.1 \cdot R_B}. \tag{16.15}$$
where:
| Symbol | Description |
|---|---|

| $E_B$: | No-load voltage of the battery |
| $L_B$: | Inductance of the battery |
| $L_{BBr}$: | Total inductance of the battery |
| $R_{BL}$: | Resistance of a battery conductor |
| $L_{BL}$: | Inductance of a battery conductor |
| $R_{BY}$: | Resistance of battery coupling branch |
| $L_Y$: | Inductance of battery coupling branch |
| $R_B$: | Resistance of the battery |
| $R_{BBr}$: | Total resistance of the battery |
| $U_{nB}$: | Nominal voltage of the battery. |
**16.4**
**Capacitors**
The equivalent circuit and the short circuit parameters of a capacitor are shown in Figure 16.6.
> **[Figure 16.6 - Equivalent circuit of a capacitor]**
> The diagram shows a series RLC equivalent circuit for a capacitor used in DC short circuit analysis.
On the left side, a voltage source $U_C$ (representing the initial voltage across the capacitor) is
connected in series with a resistor $R_{CBr}$ and an inductor $L_{CBr}$, forming a closed loop. The
current $i_C$ flows through the series branch toward a fault point F on the right side. The fault
terminals are shown as two open-circuit nodes (labeled F at the top right and at the bottom right),
representing the short circuit location. The circuit models the discharge behavior of the capacitor
during a short circuit event, where $R_{CBr}$ is the total branch resistance and $L_{CBr}$ is the
total branch inductance of the capacitor circuit.
**Fig. 16.6:** Equivalent circuit of a capacitor [10]
## Here:
$$R_{CBr} = R_C + R_{CL} + R_Y, \tag{16.16}$$
$$L_{CBr} = L_C + L_{CL} + L_Y. \tag{16.17}$$
Peak short circuit current of the capacitor:
$$i_{pC} = \kappa_C \cdot \frac{E_C}{R_{CBr}} \quad \text{with} \quad R_C = f\left[\frac{2 \cdot
L_{CB}}{R_{CB}}; \frac{1}{\sqrt{L_{CE} \cdot C}}\right] \tag{16.18} \text{ mit = with}$$
For $L_{CBr} = 0$, $RC = 1$ and $I_{kC} = 0$, where:

$E_C$: Voltage of capacitor before occurrence of short circuit
$L_C$: Inductance of capacitor
$L_{CBr}$: Total inductance of capacitor
$R_{CL}$: Resistance of a capacitor conductor
$L_{CL}$: Inductance of a capacitor conductor
$R_{CY}$: Resistance of coupling branch for capacitor
$L_{CY}$: Inductance of coupling branch for capacitor
$R_C$: Resistance of capacitor
$R_{CBr}$: Total resistance of capacitor.
**16.5**
**DC motors**
The equivalent circuit of an externally excited DC motor is shown in Figure 16.7.
> **Figure 16.7 - Equivalent circuit of an externally excited DC motor:**
> The circuit consists of two separate loops. The left loop (field/excitation circuit) contains a current
source $i_F$ in series with a resistor $R_F$ and an inductor $L_F$, connected to a voltage source
$E_F$. The right loop (armature circuit) contains a mechanical coupling element representing the
motor (labeled with $M_M$, $M_L$, $n$, and a back-EMF source $E_M$), in series with a resistor
$R_{MBr}$, an inductor $L_{MBr}$, and current $i_M$, with terminals labeled F (field connection).
The two circuits are magnetically coupled through the motor symbol indicating the rotating
machine with speed $n$, motor torque $M_M$, and load torque $M_L$.
**Fig. 16.7:** Equivalent circuit of externally excited DC motor [10]
For the resistances and inductances, the following hold true:
$$R_{MBr} = R_M + R_{ML} + R_Y, \tag{16.19}$$
$$L_{MBr} = L_M + L_{ML} + L_Y, \tag{16.20}$$
$$\tau_M = \frac{L_{MBr}}{R_{MBr}}.\tag{16.21}$$
DC motors can be neglected when:
$$\sum I_{rM} < 0.01 \cdot I_{kD}.\tag{16.22}$$
Peak short circuit current of the DC motor:
$$i_{pM} = \kappa_M \cdot \frac{U_{rM} - I_{rM} \cdot R_M}{R_{MBr}}.\tag{16.23}$$
Steady state short circuit current of the DC motor:

$$I_{kM} = \frac{L_F}{I_{OF}} \cdot \frac{U_{rM} - I_{rM} \cdot R_M}{R_{MBr}},\tag{16.24}$$
where:
| Symbol | Description |
|---|---|
| $L_M$: | Inductance of DC motor |
| $L_{MBr}$: | Total inductance of DC motor |
| $R_{ML}$: | Resistance of DC motor conductor |
| $L_{ML}$: | Inductance of DC motor conductor |
| $R_{MY}$: | Resistance of coupling branch for DC motor |
| $L_Y$: | Inductance of coupling branch for DC motor |
| $R_M$: | Resistance of DC motor |
| $U_{rM}$: | Rated voltage of DC motor |
| $R_{MBr}$: | Total resistance of DC motor. |
# 17
# Programs for the Calculation of Short Circuit Currents
The calculation of short circuit currents in electrical systems is hardly possible without the support
of computer programs. Furthermore, there are voluminous regulations which must be fulfilled. The
following list gives a number of programs used for these calculations. The list makes no claim to
being complete.
- DIgSILENT: Electro-technical calculations, Fichtner GmbH,
## Telephone: ++49-(0)711-8995-658
- Integral: Interactive Graphics network planning system.
FGH e.V., Mannheim, Telephone: ++49-(0)621-8047-143
- Sincal: Siemens Network Calculation, Siemens GmbH,
## Telephone: ++49-(0)9131-734165
- CAE-N: Short circuit and load flow calculation in low voltage meshed and radial networks,
## Klöckner Elektrik, Telephone: ++49-(0)228-602-1040
- Neplan (CALPOS): ABB Mannheim, Telephone: ++49-(0)621-386-2786
- Hannappel: Electrical calculations, Telephone: ++49-(0)611-950800
- LUKAS: Load Flow and Short Circuit calculation, Telephone: ++49-(0)681-302-3979
- PAN: Program system for network planning, AEG, Telephone: ++49-(0)6103-3908-660
- eNetz and KASILA: Calculations for electrical power, Telephone: ++49-(0)641-81852

- ElektraSoft, CAE/CAD Tools for calculations of power systems, Telephone: ++49-(0)69-66
563-600, www.elaplan.com
- SIMARIS deDESIGN, Siemens Network Calculation, Siemens GmbH,
Telephone: ++49-(0)7000-746 2747, www.siemens.de/simaris
# 18
# Examples: Calculation of Short Circuit Currents
This Chapter presents a large number of examples taken from practice, worked by hand through
the corresponding equations and also an example calculated with KUBS plus. For a low voltage
network, a TN-C or a TN-S system is assumed.
## 18.1
### Example 1: Radial network
Given a 400 V network, as shown in Figure 19.1.
- Calculate the resistances and reactances.
- Calculate the single-pole and three-pole short circuit currents for the circuit with r.c.d.-operated
circuit breaker.
> **Fig. 18.1 - Network representation diagram (Radial network):**
> The diagram shows a radial low-voltage distribution network fed from a 20/0.4 kV, 50 Hz, 630
kVA transformer (delta-star connection) connected to an upstream network represented by
$S''_{kQ}$. The network topology is as follows:
>
> - **Transformer**: 20/0.4 kV, 50 Hz, 630 kVA, with delta primary and star secondary winding
symbol shown.
> - **Main Distribution Panel**: Connected to the transformer secondary via busbar. Contains
fault point **F1** at the busbar level.
> - **Cable 1**: 3×120/70 qmm, length l = 85 m, connecting the Main Distribution Panel to the
## Subdistribution Panel.
> - **Subdistribution Panel**: Contains fault point **F2** at the busbar.
> - **Cable NYM-J (upper branch)**: 5×2.5 qmm, length l = 25 m, connecting the Subdistribution
Panel to fault point **F3** (upper circuit, with an r.c.d.-operated circuit breaker shown upstream
of F3).
> - **Cable NYM-J (lower branch)**: 5×2.5 qmm, length l = 25 m, connecting the Subdistribution
Panel to fault point **F3** (lower circuit, with an r.c.d.-operated circuit breaker shown).
> - **Cable 2**: 3×120/70 qmm, length l = 85 m, shown as a second parallel feeder path also
connecting to F2.
> - Circuit breakers (indicated by switch symbols) are placed at the Main Distribution Panel output

(F1), at the Subdistribution Panel input (F2), and before each F3 terminal.
> - Fault points F1, F2, and F3 are marked along the single-line diagram at the respective
busbars/end points.
**Fig. 18.1:** Example 1: Network representation
Smallest short circuit current:
Resistances and reactances of transformer (Fig. 8.6):
$$R_T \quad = \quad 3.5\, m\Omega \qquad X_T = 13\, m\Omega$$
Resistances and reactances of cable:
$$R_{K_{L1}} \quad = \quad 1.24 \cdot \frac{l}{\kappa \cdot S}$$
$$R_{K_{L1}} = 1.24 \cdot \frac{85\text{m}}{56\frac{\text{m}}{\Omega\text{mm}^2} \cdot
120\text{mm}^2} = 15.68m\Omega$$
$$R_{K_{PEN}} = 1.24 \cdot \frac{85\text{m}}{56\frac{\text{m}}{\Omega\text{mm}^2} \cdot
70\text{mm}^2} = 26.68m\Omega$$
$$X_{k_{L1}} = x'_{k_{L1}} \cdot l = 0.08\frac{m\Omega}{m} \cdot 85\text{m} = 6.8m\Omega$$
$$X_{k_{PEN}} = x'_{k_{PE}} \cdot l = 0.08\frac{m\Omega}{m} \cdot 85\text{m} = 6.8m\Omega$$
Resistances and reactances of conductor:
$$R_{K_{L1}} = 1.24 \cdot \frac{l}{\kappa \cdot S_{L1}} = 1.24 \cdot
\frac{25\text{m}}{56\frac{\text{m}}{\Omega\text{mm}^2} \cdot 2.5\text{mm}^2} =
221.4m\Omega$$
$$R_{K_{PE}} = 1.24 \cdot \frac{l}{\kappa \cdot S_{PE}} = 1.24 \cdot
\frac{25\text{m}}{56\frac{\text{m}}{\Omega\text{mm}^2} \cdot 2.5\text{mm}^2} =
221.4m\Omega$$
$$X_{k_{L1}} = x'_{k_{L1}} \cdot l = 0.08\frac{m\Omega}{m} \cdot 25\text{m} = 2m\Omega$$
$$X_{k_{PE}} = x'_{k_{PE}} \cdot l = 0.08\frac{m\Omega}{m} \cdot 25\text{m} = 2m\Omega$$
Sum of resistances and reactances:
$$\sum R = 488.86m\Omega \qquad \sum X = 30.6m\Omega$$
Calculation of short circuit impedance:
$$z_k = \sqrt{r^2 + X^2} = 489.8m\Omega$$

$$I''_{k1} = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_k} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot
489.8m\Omega} = 448A$$
**Three-pole short circuit current:**
Resistances and reactances of transformer:
$$R_T \ = \ 3.5 \ \text{m}\Omega \qquad X_T = 13 \ \text{m}\Omega$$
Resistances and reactances of cable:
$$R_k \ = \ \frac{l}{\kappa \cdot S} m\Omega =
\frac{85\text{m}}{56\frac{\text{m}}{\Omega\text{mm}^2} \cdot 120\text{mm}^2} =
12.65m\Omega$$
$$X_k \ = \ x'_i l = 0.08\frac{m\Omega}{m} \cdot 85m = 6.8m\Omega$$
Resistances and reactances of conductor:
$R_L \;= 178.6 m\Omega$
$X_L \;= 2 m\Omega$
$\Sigma R \;= 204.25 m\Omega$
$\Sigma X \;= 21.8 m\Omega$
$$Z_k \;= \sqrt{(R_k^2 + X_k^2)} = \sqrt{(204.25^2 + 21.8^2)}\, m\Omega = 205.4 m\Omega$$
$$I_{k3}'' = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_k} = \frac{1 \cdot 400V}{\sqrt{3} \cdot 205.4
m\Omega} = 1.068 kA$$
**18.2**
**Example 2: Proof of protective measures**
Given a 230/400 V network, as shown in Figure 19.2, with a source impedance of 0.3 Ω the
protective measures must be proven.
- Calculate the resistances and reactances of the network at the fault locations.
- Calculate the single-pole short circuit current.
- Are the cut-off conditions fulfilled?
> **Diagram Description - Fig. 18.2: Example 2: Calculation with source impedance**
>
> The diagram shows a low-voltage electrical distribution network at 400/230 V, 50 Hz, fed by a

power feed cable NYCWY 4×120 qmm with a supply impedance of 0.3 Ω.
>
> - **F1**: First fault location, downstream of the NH00 80 A fuse, connected via NYM-J 4×25 qmm
cable, l = 15 m.
> - **F2**: Second fault location after fuse F2, leading to the main distribution panel.
> - **Main distribution panel**: Fed through a DO2/63 A breaker (3-pole), then a 25 A breaker
feeding a 4×16 qmm cable, l = 22 m.
> - **F3**: Fault location at the subdistribution panel, downstream of the 25 A breaker.
> - **Subdistribution panel** branches into two paths:
> - **Upper path**: C 16A circuit breaker → Cable 5×2.5 qmm, l = 12 m → Motor connection 2.2
kW → **F5**
> - **Lower path**: B 10A circuit breaker → Cable 3×2.5 qmm, l = 18 m → Receptacle → **F4**
**Fig. 18.2:** Example 2: Calculation with source impedance
**Calculation of impedances for supply conductors**
Conductor NYM-J 4 × 25 mm², l = 15 m
$$R \;= 1.24 \cdot \frac{2 \cdot l}{\kappa \cdot S}$$
$$R \;= 1.24 \; \frac{2 \cdot 15m}{56\,\dfrac{m}{\Omega mm^2} \cdot 25\,mm^2} =
0.0265\,\Omega$$
$$X \;=\; x' \cdot 2 \cdot l \approx 0.08\,\frac{m\Omega}{m} \cdot 2 \cdot 15m =
0.0024\,\Omega$$
$$Z_1 \;=\; \sqrt{R^2 + X^2} = \sqrt{0.0265^2 + 0.00024^2}\,\Omega = 0.0266\,\Omega$$
Conductor NYM-J $4 \times 16\ \text{mm}^2$, l = 22 m
$$R \;=\; 1.24 \cdot \frac{2 \cdot l}{\kappa \cdot S}$$
$$R \;=\; 1.24 \cdot \frac{2 \cdot 22m}{56\frac{m}{\Omega mm^2} \cdot 16mm^2} =
0.0608\,\Omega$$
$$X \;=\; x' \cdot 2 \cdot l \approx 0.08\,\frac{m\Omega}{m} \cdot 2 \cdot 22m =
0.00352\,\Omega$$
$$Z_2 \;=\; \sqrt{R^2 + X^2} = \sqrt{0.0608^2 + 0.00352^2}\,\Omega = 0.0609\,\Omega$$
Conductors for outlet NYM-J $3 \times 2.5\ \text{mm}^2$, l = 18 m

$$R \;=\; 1.24 \cdot \frac{2 \cdot}{\kappa \cdot S} = 1.24 \cdot \frac{2 \cdot
18m}{56\frac{m}{\Omega mm^2} \cdot 2.5mm^2} = 0.318\,\Omega$$
$$X \;=\; x' \cdot 2 \cdot l \approx 0.08\,\frac{m\Omega}{m} \cdot 2 \cdot 18m =
0.00288\,\Omega$$
$$Z_3 \;=\; \sqrt{R^2 + X^2} = \sqrt{0.318^2 + 0.00288^2} = 0.319\,\Omega$$
Conductors for motor, l = 12 m
$$R \;=\; 1.24 \cdot \frac{2 \cdot l}{\kappa \cdot S} = 1.24 \cdot \frac{2 \cdot
12m}{56\frac{m}{\Omega mm^2} \cdot 2.5mm^2} = 0.212\,\Omega$$
$$X \;=\; x' \cdot 2 \cdot l \approx 0.08\,\frac{m\Omega}{m} \cdot 2 \cdot 12m =
0.00192\,\Omega$$
$$Z_4 \;=\; \sqrt{R^2 + X^2} = \sqrt{0.212^2 + 0.00192^2}\,\Omega = 0.212\,\Omega$$
**Impedance at fault location F1**
with $Z_V = 0.3\ \Omega$
Single-pole short circuit current:
$$I''_{k1} \;=\; \frac{c \cdot U_1}{\sqrt{3} \cdot Z_V} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot
0.3\,\Omega} = 731.3A$$
**Impedance at fault location F2:**
$$Z_A \;=\; Z_V + Z_1 = 0.3\,\Omega + 0.0266\,\Omega = 0.3266\,\Omega$$
$$I''_{k1} \;=\; \frac{0.95 \cdot 400V}{\sqrt{3} \cdot 0.3266\,\Omega} = 671.7A$$
**Impedance at fault location F3:**
$$Z_B \;=\; Z_A + Z_2 = 0.3266\,\Omega + 0.0609\,\Omega = 0.3875\,\Omega$$
$$I''_{k1} \;=\; \frac{0.95 \cdot 400V}{\sqrt{3} \cdot 0.3875\,\Omega} = 566.17A$$
**Impedance at outlet F4:**
$$Z_C = Z_B + Z_3 = 0.3875\Omega + 0.318\Omega = 0.7055\Omega$$
$$I''_{k1} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot 0.7055\Omega} = 310.97A$$
**Impedance at motor F5:**
$$Z = Z_B + Z_4 = 0.3875\Omega + 0.212\Omega = 0.5995\Omega$$

$$I''_{k1} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot 0.5995\Omega} = 365.96A$$
Protection by cut-off is the most important condition for satisfying the protective measures up to
1000 V. In accordance with IEC 60 364, Part 41 the faults must be protected by cut-off within 0.4
seconds for portable equipment of Protection Class I and in 5 seconds for permanently installed
operational equipment. The cut-off currents of fuses and power breakers can be found in tables or
diagrams (see IEC 60 364, Part 43 and Part 61).
In this example the cut-off currents $I_a$ have the values:
B16A $\quad$ $I_a = 5 \cdot I_n = 5 \cdot 16\text{A} = 80\text{A}$
C16A $\quad$ $I_a = 10 \cdot I_n = 10 \cdot 16\text{A} = 160\text{A}$
$\dfrac{\text{D02}}{\text{63A}}$ $\quad$ $I_{a_{(0.4s)}} = 600\text{A}$
$\quad\quad\quad\quad$ $I_{a_{(5s)}} = 310\text{A}$
$\dfrac{\text{NH00}}{\text{80A}}$ $\quad$ $I_{a_{(0.4s)}} = 800\text{A}$
$\quad\quad\quad\quad$ $I_{a_{(5s)}} = 450\text{A}$
The condition $I''_{k1min} > I_a$
must always hold true.
**Table 19.1:** Summary of results
| **Fault location** | $I''_{k1min}$ | $I_a$ |
|---|---|---|
| F1 | 731.3A | 450A |
| F2 | 671.7A | 450A |
| F3 | 566.17A | 310A |
| F4 outlet | 310.97A | 80A |
| F5 motor | 365.96 | 160A |
Table 19.1 shows that the cut-off condition is satisfied.
## 18.3
**Example 3: Connection box to service panel**
A power plant network as in Figure 19.3 supplies an on-site connection box. The single-pole short
circuit current is 575 A.
- Calculate the resistances and reactances.
- Calculate the single-pole short circuit current at the outlet and at the light.
- Is protection by cut-off guaranteed?

> **Fig. 18.3 - Diagram Description:**
> The diagram shows a single-line electrical distribution schematic for a power plant network with a
service panel. On the left, a **Power supply company** feeds into a **Service panel** containing
an NH00 fuse rated at 80 A, with a noted single-pole short circuit current of 575 A. From the service
panel, a **Cable 4×35 qmm, l=12 m** runs to a **Subdistribution panel**. From the
subdistribution panel, two branches are shown:
> - **Upper branch:** Protected by a **B 16A** circuit breaker, feeding through a **Cable 3×2.5
qmm, l=35 m** to a **Receptacle**.
> - **Lower branch:** Protected by a **B 10A** circuit breaker, feeding through a **Cable 3×1.5
qmm, l=15 m** to a **Light**.
>
> The diagram illustrates the topology used to calculate short circuit currents at the subdistribution
panel, receptacle, and light fixture.
The impedance of the connection box is:
$$Z \quad = \frac{c \cdot U_n}{\sqrt{3} \cdot I''_{k1}} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot 575A}
= 381.6\,m\Omega$$
$$Z_{l1} \quad = 2 \cdot z \cdot l_1 = 2 \cdot 0.654\,\Omega/km \cdot 0.012\,km =
15.7\,m\Omega$$
The total impedance of the sub-distributor is:
$$Z_k \quad = Z + Z_{l1} = 397.3\,m\Omega$$
The single-pole short circuit current is:
$$I''_{k1} \quad = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_k} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot
397.3\,\Omega} = 542A$$
For the short circuit at the outlet:
$$z' \quad = 2 \cdot z \cdot l_2 = 2 \cdot 9.02\,\Omega/km \cdot 0.035\,km + 0.3973\,\Omega =
1.0287\,\Omega$$
$$I''_{k1} \quad = 213.27A$$
The cut-off current of a 16 A circuit breaker is 80 A. Since the single-pole short circuit current is
greater than the cut-off current, the cut-off condition is satisfied.
Short circuit on light:
$$z' \quad = 2 \cdot z \cdot l_3 = 2 \cdot 15\Omega/km \cdot 0.015km + 0.3973\Omega =
0.8473\Omega$$

$$I''_{k1} \quad = 258.9A$$
The cut-off current of a 10 A circuit breaker is 50 A. The cut-off condition is therefore again
satisfied.
**18.4**
**Example 4: Transformers in parallel**
Two transformers are connected in parallel, as shown in Figure 19.4.
- Draw the equivalent circuit.
- Calculate the resistances and reactances.
- Calculate the three-pole short circuit current.
> **Figure Description (Fig. 18.4): Example 4 - Transformers in parallel**
>
> The diagram shows a single-line electrical network with two transformers (T1 and T2) connected
in parallel on a 20 kV medium-voltage busbar fed from a network input through a
disconnector/switch Q.
>
> - **T1**: Delta-star (Δ/Y) transformer, rated 630 kVA, connected between the 20 kV busbar and
a 400 V low-voltage busbar.
> - **T2**: Delta-star (Δ/Y) transformer, rated 400 kVA, connected in parallel with T1 between the
same 20 kV and 400 V busbars.
> - Both transformers feed into a common 400 V low-voltage rail.
> - From the 400 V busbar, a cable of type **NYY-J, 2×4×185 qmm, length l = 50 m** connects to a
circuit breaker/fuse **F1** at 400 V.
> - The network input on the left side feeds the 20 kV busbar through switch **Q**.
> - The circuit is a radial distribution topology with parallel transformer supply for redundancy and
increased capacity.
**Fig. 18.4:** Example 4: Transformers in parallel
**Total transformer power:**
$$\Sigma S_{rT} \quad = \quad 630\,kVA + 400\,kVA = 1030\,kVA$$
$$u_{R_m} \quad = \quad \frac{u_{R1} + u_{R2}}{2} = 1.125\%$$
> **Fig. 18.5 - Equivalent Circuit Diagrams for Parallel Transformers with Cables**
>

> The figure shows three equivalent circuit diagrams representing the step-by-step reduction of a
power system with two parallel transformers and two parallel cable sets feeding a fault point (short
circuit location $I''_{k3}$).
>
> **Top-left circuit:** Two transformers in parallel, each represented by their series impedance
branches ($R_{T1}, X_{T1}$ and $R_{T2}, X_{T2}$), followed by two parallel cable branches
($R_{K1}, X_{K1}$ and $R_{K2}, X_{K2}$). A voltage source $c \cdot U_n / \sqrt{3}$ drives the
circuit, with the short circuit current $I''_{k3}$ at the fault node (bus 01).
>
> **Top-right circuit:** Simplified equivalent with the two transformer branches and two cable
branches each combined into a single equivalent series impedance $\Sigma R$ and $\Sigma X$, still
driven by $c \cdot U_n / \sqrt{3}$ and terminating at the fault node (bus 01) with current
$I''_{k3}$.
>
> **Bottom circuit:** Further reduced single equivalent circuit with combined impedances
$R_{T1+T2}$, $X_{T1+T2}$, $R_{K1+K2}$, $X_{K1+K2}$ in series, driven by $c \cdot U_n / \sqrt{3}$,
with short circuit current $I''_{k3}$ at bus 01.
**Fig. 18.5:** Equivalent circuit
$$
Z_T = \frac{u_{Rm}}{100\%} \frac{U_{nT}^2}{S_{rT}} = \frac{5\%}{100\%}
\frac{(400\,\text{V})^2}{1030\,\text{kVA}} = 7.77\,m\Omega
$$
$$
R_T = \frac{u_{Rm}}{100\%} \frac{U_{nT}^2}{S_{rT}} = \frac{1.125}{100\%}
\frac{(400\,\text{V})^2}{1030\,\text{kVA}} = 1.75\,m\Omega
$$
$$
X_T = \sqrt{Z_T^2 - R_T^2} = 7.57\,m\Omega
$$
**Cables:**
$$
R_L = \frac{l}{\kappa \cdot S \cdot n} = \frac{50\,m}{56\,\frac{m}{\Omega \cdot mm^2} \cdot
185\,mm^2 \cdot 2} = 2.4\,m\Omega
$$
$$
X_L = x'_L \cdot \frac{l}{n} = 0.08\,m\Omega \cdot \frac{50\,m}{2} = 2\,m\Omega
$$

$$
Z_k = \sqrt{R_k^2 + X_k^2} = \sqrt{4.15^2 + 9.57^2}\,m\Omega = 10.43\,m\Omega
$$
$$
I''_{k3} = \frac{c \cdot U_{nT}}{\sqrt{3} \cdot Z_k} = \frac{1.0 \cdot 400\,\text{V}}{\sqrt{3} \cdot
10.43\,m\Omega} = 22.14\,kA
$$
**18.5**
**Example 5: Connection of a motor**
A transformer as shown in Figure 19.6 supplies a motor through an overhead line, cables and
conductors.
- Calculate the resistances and reactances.
- Calculate the single-pole short circuit current.
> **[Fig. 18.6 - Single-line electrical distribution diagram showing the connection of a motor
through multiple stages:]**
> The diagram represents a low-voltage distribution network starting from a transformer (20/0.4
kV, 50 Hz, 630 kVA) with a known short-circuit apparent power $S''_{kQ}$. From the transformer's
low voltage main distribution panel, the network extends through the following sections in series:
> 1. **Overhead line**: 4×50 qmm conductors, length l = 50 m, connected to a Main distribution
panel.
> 2. **Cable NYY**: 3×35/16 qmm, length l:50 m, connected to a Subdistribution panel.
> 3. **Cable NYM.J**: 4×16 qmm, length l:35 m, connected to the Fault location, where a
three-phase motor (M, 3~) is connected.
> Switching/disconnection points (represented by X symbols) are shown between each section.
**Fig. 18.6:** Example 5: Connection of a motor
**Transformer:**
$$Z_T = 15.238\, m\Omega$$
$$R_T = 2.8\, m\Omega$$
$$X_T = 15\, m\Omega$$
**Overhead line:**

$$R_{L1} = 1.24 \cdot \frac{l}{\kappa \cdot S}$$
$$R_{L1} = 1.24 \cdot \frac{50m}{56\frac{m}{\Omega \cdot mm^2} \cdot 50mm^2} = 22.1\,
m\Omega$$
$$R_{PEN} = 0.2\, m\Omega$$
$$X_{L1} = x' \cdot l = 0.33\,\frac{\Omega}{km} \cdot 50m = 16.5\, m\Omega$$
$$X_{PEN} = 16.5\, m\Omega$$
**Cables:**
$$R_{L2} = 1.24 \cdot \frac{50m}{56\frac{m}{\Omega \cdot mm^2} \cdot 35mm^2} = 31.6\,
m\Omega$$
$$R_{PEN} = 1.24 \cdot \frac{50m}{56\frac{m}{\Omega \cdot mm^2} \cdot 16mm^2} = 69.2\,
m\Omega$$
$$X_{L2} = x' \cdot l = 0.08\,\frac{\Omega}{km} \cdot 50m = 4\, m\Omega$$
$$X_{PEN} = 4\, m\Omega$$
**Conductors:**
$$R_{L3} = 1.24 \cdot \frac{35m}{56\frac{m}{\Omega \cdot mm^2} \cdot 16mm^2} = 48.4\,
m\Omega$$
$$R_{PEN} = 1.24 \cdot \frac{35m}{56\frac{m}{\Omega \cdot mm^2} \cdot 16mm^2} = 48.4\,
m\Omega$$
$$X_{L3} = x' \cdot l = 0.08 \frac{\Omega}{km} \cdot 35m = 2.8m\Omega$$
$$X_{PEN} = 2.8m\Omega$$
$$\Sigma R = 222.7m\Omega$$
$$\Sigma X = 61.6m\Omega$$
$$Z_k = \sqrt{R_k^2 + X_k^2} = \sqrt{227.7^2 + 61.6^2} \, m\Omega = 231.06m\Omega$$
$$I''_{k1} = \frac{c \cdot U_{nT}}{\sqrt{3} \cdot Z_k} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot
231.06m\Omega} = 949.5kA$$

## 18.6
### Example 6: Calculation for a load circuit
A grounding cable is connected to a transformer (Figure 19.7). The data for the cable are: $r' =
0.482\Omega/\text{km}$, $x' = 0.083\Omega/\text{km}$, $\dfrac{R_{0L}}{R_L} = 4$ and
$\dfrac{X_{0L}}{X_L} = 3.76$.
- Calculate the resistances and reactances.
- Calculate the three-pole and single-pole short circuit currents.
> **Figure 18.7 - Single-line diagram: Example 6 - Calculation for a load circuit**
>
> The diagram shows a radial low-voltage network starting from a busbar Q connected to an
infinite network source represented by $S''_{kQ} = 250\,\text{MVA}$. From Q, the circuit feeds
through a transformer T rated **630 kVA, 20/0.4 kV, 50 Hz, Dyn5**. On the low-voltage side (400
V), the transformer connects to a **Main distribution panel** (point A). From the main distribution
panel, a **cable** (4×50 mm², l = 250 m) extends to the right, terminating at a **Fault location**
(marked with a filled circle). The fault location represents where the short circuit occurs. The bus
points Q, T, and A are labeled along the single-line path, and the cable section is clearly separated
from the transformer/busbar section.
**Calculation of $I''_{k3}$:**
$$Z_{QT} = \frac{c \cdot U_n^2}{S''_{kQ}} = \frac{1.1 \cdot (0.4kV)^2}{250MVA} =
0.704m\Omega$$
$$X_{QT} = 0.995 \cdot Z_{Qt} = 0.7m\Omega$$
$$R_{QT} = 0.1 \cdot X_{Qt} = 0.07m\Omega$$
$$R_T = \frac{u_R}{100\%} \cdot \frac{U_n^2}{S_{rT}} = \frac{1.1 \cdot \%}{100\%} \cdot
\frac{(400V)^2}{630kVA} = 2.8m\Omega$$
$$Z_T = \frac{u_k \cdot U_n^2}{100\% \cdot S_{rT}} = \frac{6 \cdot \%}{100\%} \cdot
\frac{(400V)^2}{630kVA} = 15.2m\Omega$$
$$X_T = \sqrt{Z^2 - R_T^2} = \sqrt{15.2^2 - 2.8^2} \, m\Omega = 14.9 m\Omega$$
$$R_{0T} = R_T = 2.8 m\Omega$$
$$X_{0T} = 0.995 \cdot X_T = 0.995 \cdot 14.9 m\Omega = 14.83 m\Omega$$
$$R_l = R' \cdot l = 0.482\Omega/km \cdot 0.25km = 120.5 m\Omega$$

$$X_l = X' \cdot l = 0.083\Omega/km \cdot 0.25km = 20.75 m\Omega$$
$$R_{0l} = 4 \cdot R_l = 482 m\Omega$$
$$X_{0l} = 3.76 \cdot X_l = 78.02 m\Omega$$
$$R_k = (R_{Qt} + R_T + R_l) = 123.4 m\Omega$$
$$X_k = (X_{Qt} + X_T + X_l) = 36.35 m\Omega$$
$$Z_k = \sqrt{R_k^2 + X_k^2} = \sqrt{123.4^2 + 36.35^2} \, m\Omega = 128.6 m\Omega$$
$$I''_{k3} = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_k} = 1.80 kA$$
**Calculation of $I''_{k1}$ (Figure 19.8):**
> **Fig. 18.8 - Equivalent circuit for $I''_{k1}$**
>
> The figure shows two equivalent circuit diagrams used to calculate the initial symmetrical
short-circuit current $I''_{k1}$ for a single-phase-to-earth fault.
>
> **Top diagram - Positive-sequence system:**
> A series circuit is shown with two impedance elements in series along the top branch:
> - First element: $2{,}8 + j14{,}9$ (representing the transformer positive-sequence impedance in
mΩ)
> - Second element: $120 + j20{,}75$ (representing the line positive-sequence impedance in mΩ)
>
> A shunt element on the left side of value $0{,}07 + j0{,}7$ is connected to ground node **01**.
On the right side, a shunt impedance $Z_1 = 123{,}4 + j36{,}35$ is connected to ground,
representing the total positive-sequence impedance at the fault point.
>
> **Bottom diagram - Zero-sequence system:**
> A series circuit is shown with two impedance elements along the top branch:
> - First element: $2{,}8 + j14{,}83$ (transformer zero-sequence impedance in mΩ)
> - Second element: $482 + j78{,}02$ (line zero-sequence impedance in mΩ)
>
> The left side connects to ground node **00**. On the right side, a shunt impedance $Z_0 =
484{,}8 + j92{,}85$ is connected to ground, representing the total zero-sequence impedance at the
fault point.
>
> Both circuits together (positive-sequence and zero-sequence) are used in the symmetrical
component method to determine the single-phase short-circuit current $I''_{k1}$.
**Fig. 18.8:** Equivalent circuit for $I''_{k1}$

$$2\underline{Z}_1 + \underline{Z}_0 = 2 \cdot (123.4 + j36.35)m\Omega + (484.8 +
j92.85)m\Omega$$
$$2\underline{Z}_1 + \underline{Z}_0 = (731.6 + j165.6)m\Omega = 750.1m\Omega$$
$$I''_{k1} = \frac{\sqrt{3} \cdot c \cdot U_n}{|2 \cdot Z_1 + Z_0|} = \frac{\sqrt{3} \cdot 0.95 \cdot
400V}{750.1m\Omega} = 877A$$
**Simplified method for calculating the single-pole short circuit current (Table 8.7):**
Transformer impedance:
$$Z_T \ = \ \frac{u_k}{100\%} \frac{U_n^2}{S_{rT}} = \frac{6 \cdot \% \cdot (400V)^2}{100\% \cdot
630kVA} = 0.015\Omega$$
Line impedance (outgoing and return lines):
$$Z_l \ = \ 2 \cdot z' \cdot l = 2 \cdot 0.486\Omega/km \cdot 0.250km = 0.243\Omega$$
Total impedance:
$$Z_{tof} = \ Z_T + Z_L = 0.258\Omega$$
Single-pole short circuit current:
$$I''_{k1} \ = \ \frac{c \cdot U_n}{\sqrt{3} \cdot Z_{tof}} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot
0.258\Omega} = 850.36A$$
The result is nearly the same by both methods.
**18.7**
**Example 7: Calculation for an industrial system**
A transformer as shown In Figure 19.9 supplies the main distributor of an industrial system.
- Calculate the resistances and reactances.
- Calculate the three-pole short current at the main distributor.
- Calculate the single-pole short circuit current at the outlet and at the light switch.
> **Fig. 18.9:** Example 7: Network diagram
>
> *Diagram description:* Single-line network diagram of an industrial low-voltage power system.
On the left, a grid connection point labeled $S''_{kQ}$ = 250 MVA feeds through a disconnector (Q)

into a transformer T (630 kVA, Dyn5, 20/0.4 kV, 50 Hz). The transformer secondary connects to a
Low Voltage Main Distribution Panel (point A). From the panel, a cable of 4×50 qmm, L1 = 250 m
runs to an intermediate busbar. From that busbar, two parallel branches extend: one cable of 5×2.5
qmm, L2 = 35 m feeds a Receptacle, and another cable of 5×2.5 qmm, L3 = 35 m feeds a Light load.
Each branch terminates with a circuit breaker/fuse symbol and load point (filled circle).
**Determination of individual impedances:**
$$Z_{Qt} = \frac{c \cdot U_n^2}{S''_{kQ}} = \frac{1.1 \cdot (400\,V)^2}{250\,MVA} =
0.704\,m\Omega$$
$$X_{Qt} = 0.995 \cdot Z_{Qt} = 0.7\,m\Omega$$
$$R_{Qt} = 0.1 \cdot X_{Qt} = 0.07\,m\Omega$$
$$Z_T = \frac{u_k \cdot U_n^2}{100\% \cdot S_{rT}} = \frac{6\% \cdot (400\,V)^2}{630\,kVA} =
15.24\,m\Omega$$
$$Z_{L1} = 2 \cdot z \cdot l_1 = 2 \cdot 0.486\,\Omega/km \cdot 0.25\,km = 243\,m\Omega$$
$$Z_{L2} = 2 \cdot z \cdot l_2 = 2 \cdot 9.02\,\Omega/km \cdot 0.035\,km = 631.4\,m\Omega$$
$$Z_{L3} = 2 \cdot z \cdot l_2 = 2 \cdot 15\,\Omega/km \cdot 0.015\,km = 450\,m\Omega$$
$I''_{k1}$ at main distributor:
$$Z_{L1} \quad = \quad 2 \cdot z \cdot l_1 = 2 \cdot 0.396\,\Omega/km \cdot 0.25\,km =
99\,m\Omega$$
$$Z_{HV} \quad = \quad Z_{Qt} + Z_T + Z_{l1} = 115\,m\Omega$$
$$I''_{k1} \quad = \quad \frac{c \cdot U_n}{\sqrt{3} \cdot Z_{HV}} = \frac{0.95 \cdot
400\,V}{\sqrt{3} \cdot 115\,m\Omega} = 1.9\,kA$$
$I''_{k1}$ at outlet:
$$Z_{out} \quad = \quad Z_{Qt} + Z_T + Z_{l1} + Z_{l2} = 890.344\,m\Omega$$
$$I''_{k1} \quad = \quad \frac{c \cdot U_n}{\sqrt{3} \cdot Z_{out}} = \frac{0.95 \cdot
400\,V}{\sqrt{3} \cdot 890.344\,m\Omega} = 246.4\,A$$
$I''_{k1}$ at light switch:
$$Z_{li} = Z_{Qt} + Z_T + Z_{l1} + Z_{l2} = 708.944 m\Omega$$

$$I''_{k1} = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_{Li}} = \frac{0.95 \cdot 400V}{\sqrt{3} \cdot 708.944
m\Omega} = 309.46A$$
**18.8**
**Example 8: Calculation of three-pole short circuit current and peak short circuit current**
Given the network of Figure 19.10
- Calculate the resistances and reactances.
- Calculate the three-pole short circuit currents and the peak short circuit currents at the fault
locations.
> **Diagram Description - Fig. 18.10: Example 8: Network diagram**
>
> The diagram shows a low-voltage power distribution network. On the far left is a medium-voltage
source labeled $S''_{kQ}$ = 500 MVA (represented by a grid/network symbol). This feeds into a
Transformer (630 kVA, Dyn5, 20/0.4 kV, 50 Hz) through bus points Q, T, and A. From point A, a
Cable NYY-J 4×185 qmm, l=45 m runs to the right toward a Low Voltage Main Distribution Panel.
From that panel, two branches extend to the right: the upper branch uses Cable 3×50/35 qmm,
l=100 m leading to a fault location (indicated by a lightning/fault symbol with a bullet point). The
lower branch uses Cable 3×35/16 qmm, l=30 m leading to a Main Distribution Panel node, from
which another fault location is indicated (lightning/fault symbol with a bullet point). Each fault
location is marked with a short-circuit symbol (arrow to ground).
**Fig. 18.10:** Example 8: Network diagram
**Medium voltage:**
$$Z_{Qt} = \frac{1.1 \cdot U_{nT}^2}{S''_Q} = \frac{1.1 \cdot (400V)^2}{500MVA} = 0.352
m\Omega$$
$$R_Q = 0.1 \cdot X_Q = 0.1 \cdot 0.35 = 0.0352 m\Omega$$
**Transformer:**
$$u_x = \sqrt{u_k^2 - u_R^2} = 5.9\%$$
$$R_T = \frac{u_{Rr} \cdot U_{nT}^2}{100\% \cdot S_{rT}} = 2.8 m\Omega$$
$$X_T = \frac{u_{xr} \cdot U_{nT}^2}{100\% \cdot S_{rT}} = 15 m\Omega$$
18.8 Example 8: Calculation of three-pole short circuit current and peak short circuit current
**167**
**Supply cables:**

$R'_1 \ = 0.101\Omega/km$
$X'_1 \ = 0.08\Omega/km$
$R_{l1} \ = r' \cdot l = 4.545 m\Omega$
$X_{l1} \ = x' \cdot l = 3.6 m\Omega$
**Main low voltage distributor (three-pole short circuit):**
$$\underline{Z}_k \ = R_{Qt} + R_T + R_{l1} + j(X_{Qt} + X_T + X_{l1})$$
$$\underline{Z}_k \ = (0.0352 + 2.8 + 4.545)m\Omega + j(0.352 + 15 + 3.6)m\Omega$$
$$\underline{Z}_k \ = (7.38 + j18.952)m\Omega$$
$$Z_k \ = \sqrt{7.38^2 + 18.952^2}\, m\Omega = 20.34\, m\Omega$$
$$I''_{k3} \ = \frac{c \cdot U_{nT}}{\sqrt{3} \cdot Z_k} = \frac{400V}{\sqrt{3} \cdot 20.34\,
m\Omega} = 11.35\, kA$$
$$\frac{R_k}{X_k} \ = \frac{7.38\, m\Omega}{18.952\, m\Omega} = 0.389 \text{ from Fig. 11.6 we
get } \kappa = 1.32$$
$$i_p \ = \kappa \cdot \sqrt{2} \cdot I''_{k3} = 1.32 \cdot \sqrt{2} \cdot 11.35\, kA = 21.26\, kA$$
**Supply lines (cables and lines):**
$R_{l2} \ = r \cdot l = 35.71\, m\Omega$
$X_{l2} \ = x \cdot l = 0.08\Omega/km \cdot 0.100\, km = 8\, m\Omega$
$Z_k \ = \sqrt{35.71^2 + 8^2}\, m\Omega = 36.6\, m\Omega$
**Sub-distribution I (three-pole short circuit):**
$$Z_k \ = (20.34 + 36.6)m\Omega = 57\, m\Omega$$
$$I''_{k3} \ = \frac{c \cdot U_{nT}}{\sqrt{3} \cdot Z_k}$$
$$I''_{k3} \ = \frac{400V}{\sqrt{3} \cdot 57\, m\Omega} = 4.05\, kA$$
$$i_p \ = \kappa \cdot \sqrt{2} \cdot I''_{k3} = 5.88\, kA$$
**Sub-distribution II (three-pole short circuit):**
$$R_{l3} = \frac{l}{\kappa \cdot S}$$

$$R_{l3} = \frac{30m}{56\frac{m}{\Omega mm^2} \cdot 35mm^2} = 15.3 m\Omega$$
$$X_{l3} = x \cdot l = 0.08\Omega/km \cdot 30m = 2.4 m\Omega$$
$$Z_k = R_{Qt} + R_T + R_{l1} + R_{l3} + j(X_{Qt} + X_T + X_{l1} + X_{l3})$$
$$= (22.68 + j21.352)m\Omega$$
$$Z_k = \sqrt{R^2 + X^2} = 31.15 m\Omega$$
$$I''_{k3} = \frac{c \cdot U_{nT}}{\sqrt{3} \cdot Z_k}$$
$$I''_{k3} = \frac{1.0 \cdot 400V}{\sqrt{3} \cdot 31.15 m\Omega} = 7.4 kA$$
$$i_p = \kappa \cdot \sqrt{2} \cdot I''_{k3} = 11.1 kA$$
**18.9**
**Example 9: Meshed network**
Given a meshed network as shown in Figure 19.11
- Calculate the impedances.
- Carry out the network transformations.
- Calculate the three-pole short circuit currents and the peak short circuit currents at the fault
location F.
> **[Fig. 18.11 - Meshed Network Diagram]**
>
> The figure shows a meshed high-voltage network with the following topology and components:
>
> - **Busbar/Node F** (top): The fault location, labeled $\dot{I}_\gamma F$, connected via a 220
kV overhead line.
> - **Busbar/Node E** (left): Connected to node A via a 10 km line, and to node F via a 20 km
overhead line. Also connected to node D via a 45 km line.
> - **Busbar/Node A** (center): Connected to node E (10 km), and to node B via a 50 kV
transformer. Node A is at the 50 kV voltage level.
> - **Transformer at A**: Rated power $S_{rT} = 160$ MVA, short-circuit voltage $u_{kr} = 12\%$,
transforming from 220 kV down to 50 kV.
> - **Infinite busbar** (top center): Represented by $S''_{k0} \to \infty$, connected at 220 kV via a
20 km line to node F and via a 30 km line toward node B/F area.
> - **Busbar/Node B** (right): Connected to node F via a 30 km line, to node C via a 15 km line,
and to node A via an 18 km line.
> - **Busbar/Node C** (bottom center-right): Connected to node B (15 km) and to node D (15 km).
> - **Busbar/Node D** (bottom left): Connected to node C (25 km - shown as 15 km + additional
segment), and to node E (45 km) and via a 13 km line.

> - All overhead line distances are labeled in km. The network operates at **220 kV** on the
high-voltage side and **50 kV** on the transformed side.
**Fig. 18.11:** Example 9: Meshed network
18.9 Example 9: Meshed network **169**
The following data are given:
with $S_{rT} = 160$ MVA, $u_k = 12\%$, $U_n = 50$ kV and $Z = 0.5\Omega$/km for all lines
**The impedance of the transformer is:**
$$Z_T \ = \ \frac{u_k \cdot U_n^2}{100 \cdot S_{rT}} = \frac{12\% \cdot (50kV)^2}{100\% \cdot
160MVA} = 1.875\Omega$$
**The impedances of the individual conductors:**
$Z_{AE} = \ 10km \ \cdot \ 0.5 \ \dfrac{\Omega}{km} = 5\Omega$
$Z_{AD} = \ 15km \ \cdot \ 0.5 \ \dfrac{\Omega}{km} = 7.5\Omega$
$Z_{AB} = \ 18km \ \cdot \ 0.5 \ \dfrac{\Omega}{km} = 9\Omega$
$Z_{ED} = \ 45km \ \cdot \ 0.5 \ \dfrac{\Omega}{km} = 22.5\Omega$
$Z_{EF} = \ 20km \ \cdot \ 0.5 \ \dfrac{\Omega}{km} = 10\Omega$
$Z_{BD} = \ 40km \ \cdot \ 0.5 \ \dfrac{\Omega}{km} = 20\Omega$
$Z_{BF} = \ 20km \ \cdot \ 0.5 \ \dfrac{\Omega}{km} = 10\Omega$
**Transformation of the delta star impedances (Figure 17.17b):**
$$Z_{AG} = \frac{Z_{AE} \cdot Z_{AD}}{Z_{AD}+Z_{AE}+Z_{ED}} = \frac{5 \cdot 7.5}{7.5+5+22.5} =
1.07\Omega$$
$$Z_{EG} = \frac{Z_{AE} \cdot Z_{ED}}{Z_{AD}+Z_{AE}+Z_{ED}} = \frac{5 \cdot 22.5}{7.5+5+22.5} =
3.21\Omega$$
$$Z_{DG} = \frac{Z \cdot Z}{Z_{AD}+Z_{AE}+Z_{ED}} = \frac{22.5 \cdot 7.5}{7.5+5+22.5} =
4.82\Omega$$
**Addition of series impedances (Figure 17.17c):**
$$Z_{EG} + Z_{EF} \quad = \quad Z_{GEF} = 13.21\Omega$$
$$Z_{DG} + Z_{BD} \quad = \quad Z_{GDB} = 24.82\Omega$$

**Transformation of the delta star impedances (Figure 17.17d):**
$$Z_{AH} = \frac{Z_{AB} \cdot Z_{AG}}{Z_{AB}+Z_{AG}+Z_{GDB}} = \frac{9 \cdot
1.07}{9+1.07+24.82} = 0.276\Omega$$
$$Z_{BH} = \frac{Z_{AB} \cdot Z_{GDB}}{Z_{AB}+Z_{AG}+Z_{GDB}} = \frac{9 \cdot
24.82}{9+1.07+29.82} = 6.397\Omega$$
$$Z_{GH} \quad = \ \frac{Z_{AG} \cdot Z_{GDB}}{Z_{AB}+Z_{AG}+Z_{GDB}} = \frac{1.07 \cdot
29.8}{9+1.07+24.82} = 0.76\Omega$$
> **Fig. 18.12:** Delta star transformations - A series of seven circuit diagrams (a) through (g)
illustrating successive delta-to-star (Δ→Y) network transformations applied to a multi-node
impedance network. Each sub-figure shows intermediate steps of simplification:
> - **(a)** Original network with nodes A, B, D, E, F and transformer impedance $Z_T$ at the top.
> - **(b)** First delta-star transformation applied at nodes E, D, B forming a star at node D.
> - **(c)** Network redrawn with nodes A, B, D, E, F, G after further reduction; $Z_T$ remains at
top node A.
> - **(d)** Additional delta-star transformation introduces node H between G and B, with node F
at the bottom.
> - **(e)** Further simplified network showing nodes A, H, G, B, F with $Z_T$ at top.
> - **(f)** Network with two parallel branches between nodes A, H, F and $Z_T$, showing nodes H
and F explicitly.
> - **(g)** Final reduced network: a single series chain from $Z_T$ (top) through $Z_G$ to node F
with ground symbol, representing the total equivalent impedance seen from the fault point.
**Addition of series impedances (Figure 17.17e):**
$$Z_{GH} + Z_{GEF} = Z_{HGF} = 0.76\Omega + 13.21\Omega = 13.97\Omega$$
$$Z_{BH} + Z_{BF} = Z_{HBF} = 6.7\Omega + 10\Omega = 16.4\Omega$$
**Calculation of parallel impedances (Figure 17.17f):**
$$Z_{HF} = \frac{Z_{HGF} \cdot Z_{HBF}}{Z_{HGF} + Z_{HBF}} = 7.54\Omega$$
**Sum of all impedances (Figure 17.17g):**
$$Z_k = Z_T + Z_{AH} + Z_{HF} = 9.69\Omega$$
$$I''_{k3} = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_k} = \frac{1.1 \cdot 50kV}{\sqrt{3} \cdot
9.69\Omega} = 3.26kA$$

$$S''_{k3} = \frac{c \cdot U_n^2}{Z_k} = \frac{1.1 \cdot (50kV)^2}{9.69\Omega} = 282.5MVA$$
$$i_p = 1.8 \cdot \sqrt{2} \cdot I''_{k3} = 1.8 \cdot \sqrt{2} \cdot 3.26kA = 8.29kA$$
## 18.10
**Example 10: Supply to a factory**
A factory is supplied from an overhead line and cables with two transformers, as shown in Figure
## 19.13.
- Calculate the impedances at the fault locations.
- Calculate $I''_{k3}$ at the fault locations.
> **Figure 18.13 - Supply to a factory**
>
> The diagram shows a medium-voltage/low-voltage electrical supply network for a factory. On the
left, a network input of **500 MVA** feeds a busbar at **20 kV** through a network connection
point Q (represented by a cross/grid symbol). From the 20 kV busbar, transformer **T1** (2000
kVA) steps down to a **400/230 V, 50 Hz** low-voltage busbar. A second transformer **T2** is
connected in parallel from the 20 kV busbar to the same LV busbar. **Fault location A** is marked
on the LV busbar between the transformers and the outgoing feeders. From the LV busbar, two
outgoing feeders are shown:
> - An **overhead line** (Al/St, 95/55 qmm, l = 350 m, r = 0.299 Ω/km), leading to **Fault location
C** on the right.
> - A **cable NYY-J** (4×4×185 qmm, l = 750 m, r = 0.0101 Ω/km, x = 0.080 Ω/km), connecting to
**Fault location B** at an intermediate point and continuing to **Fault location C**.
Impedances at the fault locations:
$$Z_{Qt} = \frac{c \cdot U_{nQ}^2}{S''_{kQ}} = \frac{1.1 \cdot (0.4kV)^2}{500MVA} =
0.352m\Omega$$
$$X_{Qt} = 0.995 \cdot Z_{Qt} = 0.995 \cdot 0.352m\Omega = 0.35m\Omega$$
$$R_{Qt} = 0.1 \cdot X_{Qt} = 0.1 \cdot 0.35m\Omega = 0.035m\Omega$$
$$Z_T = \frac{u_{kr}}{100 \cdot \%} \cdot \frac{U_{rT}^2}{\sum S_{rT}} = \frac{6\%}{100\%} \cdot
\frac{(400V)^2}{4MVA} = 2.4m\Omega$$
$$R_T = \frac{u_{Rr}}{100\%} \cdot \frac{U_{rT}^2}{S_{rT}} = \frac{1.05\%}{100\%} \cdot
\frac{(400V)^2}{4MVA} = 0.42m\Omega$$
$$X_T = \sqrt{Z_T^2 - R_T^2}$$
$$X_T = \sqrt{2.4^2 - 0.42^2}\, m\Omega = 2.363m\Omega$$
Overhead line:

$$R_F = r' \cdot l = 0.299\Omega/km \cdot 0.350km = 104.7m\Omega$$
$$X_F = x' \cdot l = 0.075\Omega/km \cdot 0.350km = 26.3m\Omega$$
$$Z_F = \sqrt{R^2 + X^2} = \sqrt{104.7^2 + 26.3^2}\, m\Omega = 107.95m\Omega$$
## Cables:
$$R_k = r' \cdot \frac{l}{n} = 0.101\,\Omega/km \cdot \frac{0.750\,km}{4} = 18.94\,m\Omega$$
$$X_k = x' \cdot \frac{l}{n} = 0.080\,\Omega/km \cdot \frac{0.750\,km}{4} = 15\,m\Omega$$
$$Z_k = \sqrt{R^2 + X^2} = \sqrt{18.94^2 + 15^2}\,m\Omega$$
$$Z_k = 24.16\,m\Omega$$
$$Z_{kA} = Z_{QT} + Z_T = 2.75\,m\Omega$$
Short circuit at position A:
$$I''_{k3} = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_{kA}} = \frac{1.0 \cdot 400\,V}{\sqrt{3} \cdot
2.75\,m\Omega} = 83.98\,kA$$
Three-pole short circuit at position B:
$$Z_{kB} = Z_{kA} + Z_F = 2.75\,m\Omega + 107.95\,m\Omega = 110.7\,m\Omega$$
$$I''_{k3} = \frac{1.0 \cdot 400\,V}{\sqrt{3} \cdot 110.7\,m\Omega} = 2.09\,kA$$
Short circuit at position C:
$$Z_{kC} = Z_{kB} + Z_K = 110.7\,m\Omega + 24.16\,m\Omega = 134.86\,m\Omega$$
$$I''_{k3} = \frac{1.0 \cdot 400\,V}{\sqrt{3} \cdot 134.86\,m\Omega} = 1.71\,kA$$
**18.11**
**Example 11: Calculation with impedance corrections**
Given the network diagram shown in Figure 19.14
- Calculate the impedances at the fault locations.
- Calculate the impedance corrections.
- Calculate the transferred short circuit currents.
- Calculate $I''_{k3}$, $i_{p3}$ and $I_a$.

> **Fig. 18.14** - Single-line electrical network diagram showing:
> - A generator **G** connected at 20 kV busbar via a medium-voltage cable **K1** (NYCWY
3×185 qmm, l = 8.5 km)
> - An external network feed-in point **Q** (500 MVA short-circuit power) also connected to the
20 kV busbar
> - A transformer **T** (400/230 V, Dyn5 connection) stepping down to the low-voltage busbar
> - **Fault location F1** indicated at the LV side of the transformer (400/230 V bus)
> - A low-voltage cable **K2** (NYY 4×300 qmm, l = 85 m) connecting to a second **Fault location
F2** downstream
> - The diagram represents a radial network with two fault points for short-circuit current
calculation with impedance corrections
**Fig. 18.14:** Calculation with impedance corrections
The following data are known:
## Transformer:
$S_{rT} = 1000\,kVA$, connection symbol: Dyn5, $u_{krT} = 6\%$, $u_{RrT} = 1.05\%$
## Generator:
$S_{rG} = 600\,kVA,\, UrG = 0.4\,kV,\, \cos\varphi_{rG} = 0.8,\, x''_d = 12\%,\, x''_{(0)G} = 8\%$
## Cable K1:
$r' = 0.105\,\Omega/km,\, x' = 0.072\,\Omega/km$
## Cable K2:
$r' = 0.066\,\Omega/km,\, x' = 0.079\,\Omega/km,\, \dfrac{R_{0L}}{R_L} = 4,\, \dfrac{X_{0L}}{X_L} =
## 3.66.$
Impedances of the network feed-in:
$$\underline{Z}_Q = \frac{1.1 \cdot U^2_n}{S''_{kQ}} = \frac{1.1 \cdot (20\,kV)^2}{500\,MVA} =
0.88\,\Omega$$
$$\underline{Z}_Q = \sqrt{R^2_Q + X^2_Q}$$
$$X_Q = \frac{\underline{Z}_Q}{1.005} = \frac{0.88\,\Omega}{1.005} = 0.8756\,\Omega$$
$$R_Q = 0.1 \cdot 0.8756\,\Omega = 0.08756\,\Omega$$
$$\underline{Z}_Q = (0.08756 + j0.8756)\,\Omega$$
Impedances of the supply cable:
$$\underline{Z}_{K1} = l \cdot (r' + jx') = 8.5\,km(0.105 + j0.072)\,\Omega/km = (08925 +
j0.612)\,\Omega$$
$$\underline{Z}_{G1} = \underline{Z}_Q + \underline{Z}_K = (0.98 + j1.4876)\,\Omega$$

$$\underline{Z} \quad = \underline{Z}_{G1}\left(\frac{U_{rTLV}}{U_{rTHV}}\right)^2 = (0.98 +
j1.4876)\left(\frac{0.4\text{kV}}{20\text{kV}}\right)^2$$
$$= (0.000392 + j0.000595)\Omega$$
$$u_{xrT} \quad = \sqrt{u_{KrT}^2 - u_{RrT}^2} = \sqrt{(6^2 - 1.05^2)\%} = 5.9\%$$
$$R_T \quad = \frac{u_{RrT}}{100\%} \frac{U_{rTLV}^2}{S_{rT}} = \frac{1.05\%}{100\%}
\frac{(0.4\text{kV})^2}{1000\text{kVA}} = 0.00168\Omega$$
$$X_T \quad = \frac{u_{XrT}}{100\%} \frac{U_{rTLV}^2}{S_{rT}} = \frac{5.9\%}{100\%}
\frac{(0.4\text{kV})^2}{1000\text{kVA}} = 0.00944\Omega$$
$$\underline{Z}_T \quad = (0.00168 + j0.00944)\Omega$$
$$\underline{Z}_G \quad = \underline{Z} + \underline{Z}_T = (0.002072 + j0.01)\Omega$$
$$Z_G \quad = 0.01\Omega$$
$$X_{Gen} \quad = X_d'' = \frac{x_d'' \cdot U_{rG}^2}{100\% \cdot S_{rG}} = \frac{12\%}{100\%}
\frac{(0.4\text{kV})^2}{600\text{kVA}} = 0.032\Omega$$
$$R_{Gen} \quad = 0.15 \cdot X_d'' = 0.15 \cdot 0.032\Omega = 0.0048\Omega$$
Correction for generator impedance:
$$K_G \quad = \frac{U_n}{U_{rG}} \cdot \frac{c_{max}}{1 + X_d'' \cdot \sin\varphi_{rG}} =
\frac{0.4kV}{0.4kV} \frac{1}{1 + 0.12 \cdot 0.6} = 0.93$$
$$\underline{Z}_{GK} \quad = K_G \cdot \underline{Z}_G = 0.93 \cdot (0.048 + j0.0298)\Omega$$
$$Z_{GK} \quad = \sqrt{0.0445^2 + 0.0298^2}\,\Omega = 0.0536\Omega$$
**Calculation of initial symmetrical short circuit current:**
Contribution of network feed-in:
$$I_{k3}'' \quad = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_G} = \frac{1.0 \cdot 0.4\text{kV}}{\sqrt{3}
\cdot 0.01\Omega} = 23.09\text{kA}$$
Contribution of generator:
$$I_3'' \quad = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_{Gen}} = \frac{1.0 \cdot 0.4\text{kV}}{\sqrt{3}
\cdot 0.0536\Omega} = 4.31\text{kA}$$
Sum of transferred short circuit currents:

$$\sum I_{k3}'' = I_{k3Net}'' + I_{k3Gen}'' = 27.4\text{kA}$$
**Calculation of peak short circuit currents:**
Contribution of network feed-in:
$$i_{p3Net} = \kappa \cdot \sqrt{2} \cdot I''_{k3}$$
$$\frac{R}{X} = \frac{0.002072}{0.01} = 0.2 \; \kappa = 1.58$$
$$i_{p3Net} = 1.58 \cdot \sqrt{2} \cdot 23.09kA = 51.59kA$$
Contribution of generator:
$$i_{p3Gen} = \kappa \cdot \sqrt{2} \cdot I''_{k3Gen}$$
$$\frac{R}{X} = 0.15 \longrightarrow \kappa = 1.03$$
$$i_{p3Net} = 1.03 \cdot \sqrt{2} \cdot 4.31kA = 10.36kA$$
Sum of transferred short circuit currents:
$$\sum i_{p3} = i_{p3Net} + i_{p3Gen} = 61.95kA$$
**Calculation of symmetrical cut-off current:**
Contribution of network feed-in:
$$I_{aNet} = I''_{k3Net} = 23.09kA \quad \text{(far from generator)}$$
Contribution of generator:
$$I_{aGen} = \mu \cdot I''_{k3Gen} = 0.755 \cdot 4.31kA = 3.25kA$$
$$I_{rG} = \frac{S_{rG}}{\sqrt{3} \cdot U_{rG}} = \frac{600kVA}{\sqrt{3} \cdot 0.4kV} = 866A$$
$$\frac{I''_{k3Gen}}{I_{rG}} = \frac{4.31kA}{0.866kA} = 4.98$$
## Sum:
$$\sum I_a = I_{a3Net} + I_{a3Gen} = 26.34kA$$
Total impedance at fault location F1:
$$\underline{Z}_p = \frac{Z_G \cdot Z_{GK}}{Z_G + Z_{GK}} = \frac{(0.00207 + j0.01) \cdot (0.0445 +
j0.0298)}{(0.00207 + j0.01) + (0.0445 + j0.0298)}\,\Omega$$
$$= \frac{-0.000206 + j0.000507}{0.0466 + j0.0398}\,\Omega$$

$$= 0.00282 + j0.00847\Omega$$
$$Z_G = \sqrt{0.00282^2 + 0.00847^2}\,\Omega = 0.00893\Omega$$
**Impedances of cable K2:**
$$\underline{Z}_{k2} = l(r' + jx') = 0.085km \cdot (0.066 + j0.079)\Omega/km$$
$$= (0.00561 + j0.006715)\Omega$$
$$\underline{Z}_k = \underline{Z}_p + \underline{Z}_{k2}$$
$$= (0.00282 + j0.00847)\Omega + (0.00561 + j0.006715)\Omega$$
$$= (0.00843 + j0.0152)\Omega$$
$$\underline{Z}_k = \sqrt{(0.00843 + 0.0152)^2}\,\Omega = 0.0174\Omega$$
The initial symmetrical short circuit current is then:
$$I''_{k3} = \frac{c \cdot U_n}{\sqrt{3} \cdot \underline{Z}_k} = \frac{0.4kV}{\sqrt{3} \cdot
0.0174\Omega} = 13.3kA$$
**18.12**
**Example 12: Connection of a transformer through an external network and a generator**
A transformer is connected through an external network and a generator as shown in Figure 19.15.
- Calculate the impedances at the fault location
- Calculate $I''_{k3}$, $I''_{k2E}$, $I''_{k2}$ and $I''_{k1}$ at the fault location.
- Which is the largest current?
> **Figure 18.15 - Circuit Diagram Description:**
> The diagram shows a single-line representation of a power system. On the left side, a network
input with a short circuit power of 500 MVA is connected to a busbar (represented by a grid/hatch
symbol). From this busbar, two parallel paths feed into a 110 kV bus on the right side where the
fault location is indicated with a diagonal slash symbol. The upper path goes through a 125 MVA
transformer (delta-star symbol with grounded star point). The lower path connects a generator G
(rated 125 MVA, three-phase, shown with the standard generator symbol) directly to the same
busbar. The fault location is on the 110 kV side of the transformer. The transformer has its
secondary (star) side solidly grounded.
**Fig. 18.15:** Example 12: Connection of a transformer through an external network and a
generator
## Generator:

$$X''_d = x''_d \cdot \frac{(1.05 \cdot U_n)^2}{S_{rG}} = 0.12 \cdot \frac{(1.05 \cdot
110kV)^2}{500MVA} = 12.8\Omega$$
18.13 Example 13: Motors in parallel and their contributions to the short circuit current **177**
## Network:
$$Z_{Qt} = \frac{1.1 \cdot U_n^2}{S_{kQ}''} = \frac{1.1 \cdot (110kV)^2}{125\,MVA} =
26.62\Omega$$
## Transformer:
$$Z_T = \frac{u_R}{100\%} \cdot \frac{U_n^2}{s_{rT}} = 0.15 \cdot \frac{(110kV)^2}{125\,MVA} =
14.52\Omega$$
Parallel impedance:
$$Z_p = \frac{Z_{Gt} \cdot Z_{Qt}}{Z_{Gt} + Z_{Qt}} = \frac{(12.8 \cdot 26.62)\Omega}{(12.8 +
26.62)\Omega} = 8.64\Omega$$
Three-pole current:
$$I_{k3}'' = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_G} = \frac{1.1 \cdot 110kV}{\sqrt{3} \cdot
23.16\Omega} = 3kA$$
Single-pole short circuit current:
$$I_{k1}'' = \frac{\sqrt{3} \cdot c \cdot U_n}{Z_1 + Z_2 + Z_0}$$
Positive-sequence system: $Z_1 = 23.16\Omega$
Negative-sequence system: $Z_2 = Z_1$
Zero-sequence system: $R_0 = 0, X_0 = 0.75 \cdot X_1 = 0.75 \cdot 14.52\Omega = 10.89\Omega$
$$I_{k1}'' = \frac{\sqrt{3} \cdot 1.1 \cdot 110kV}{|2 \cdot 23.16\Omega + 10.89\Omega|} =
3.66kA$$
Two-pole short circuit current with contact to ground:
$$I_{k2E}'' = \frac{\sqrt{3} \cdot c \cdot U_n}{\left|Z_0 + Z_1 + Z_0 \cdot \frac{Z_1}{Z_2}\right|} =
\frac{\sqrt{3} \cdot 1.1 \cdot 110kV}{\left|10.89 + 23.16 + 10.89 \cdot
\frac{23.16}{23.16}\right|\Omega} = 4.66kA$$
Two-pole short circuit current without contact to ground:
$$I_{k2}'' = \frac{c \cdot U_n}{Z_1 + Z_2} = \frac{c \cdot U_n}{2 \cdot Z_1} = \frac{\sqrt{3}}{2} \cdot
I_{k3}'' = 3.67kA$$
The two-pole short circuit current with contact to ground is the largest.

**18.13**
**Example 13: Motors in parallel and their contributions to the short circuit current**
In a 20/6 kV network as in Figure 19.16 there are four motors connected, with the following data:
## Transformer:
$S_{rT} = 25$ MVA, $u_{krT} = 13\%$, 20/6.3 kV.
Motors 1 and 2:
$2\text{x}P_{rm} = 2.3 \text{ MW}, U_{rG} = 6 \text{ kV}, \cos\varphi_{rG} = 0.86,$
$\text{p} = 2, I_a/I_{rm} = 5, \eta = 0.97.$
Motors 3 and 4:
$2\text{x}P_{rm} = 0.36 \text{ MW}, U_{rG} = 6 \text{ kV}, \cos\varphi_{rG} = 0.87,$
$\text{p} = 1, I_a/I_{rm} = 5.5, \eta = 0.98.$
- Calculate the reactances.
- Calculate the currents at the motors.
- Calculate the cut-off currents at the motors.
> **Diagram description:** Single-line electrical network diagram illustrating Example 13 -
Influence of motors on short-circuit current. The diagram shows a network input bus at 20 kV with
a short-circuit power of 2000 MVA, connected to a busbar through a network feeder switch (Q)
represented by a crossed-box symbol. From the 20 kV busbar, a transformer T (25 MVA, rated
voltage 20/6.3 kV, short-circuit voltage $u_{krT} = 13\%$) steps down the voltage to a 6 kV busbar.
A fault location (indicated by an arrow symbol) is marked on the 6 kV busbar. Two motor groups
are connected to the 6 kV busbar: Motor 3+4 connected directly at the fault bus level (upper right),
and Motor 1+2 connected at the bottom of the 6 kV bus. The fault is applied at the 6 kV busbar.
**Fig. 18.16:** Example 13: Influence of motors on the current
Network input:
$$Z_{Qt} = \frac{c \cdot U_{nQ}^2}{S_{kQ}''} \cdot \frac{1}{t^2} = \frac{1.1 \cdot
(20kV)^2}{1000\,MVA} \cdot \frac{(6.3kV)^2}{(20kV)^2} = 0.044\,\Omega$$
## Transformer:
$$Z_T = \frac{u_{krT}}{100\%} \cdot \frac{U_{rTUS}^2}{S_{rT}} = \frac{13\%}{100\%} \cdot
\frac{(6.3kV)^2}{25\,MVA} = 0.206\,\Omega$$
## Impedance:
$$Z_k = Z_{Qt} + Z_T = 0.25\,\Omega$$

Initial current without motors:
$$I_{k3}'' = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_k} = \frac{1.1 \cdot 6kV}{\sqrt{3} \cdot
0.25\,\Omega}$$
Impedances for the asynchronous machines:
$$Z_{m1} = \frac{1}{2} \cdot \frac{\eta \cdot \cos\varphi}{I_{an}/I_{rm}} \cdot
\frac{U_{rm}^2}{P_{rm}} = \frac{1}{2} \cdot \frac{0.86 \cdot 0.97}{5} \cdot
\frac{(6kV)^2}{2.3\,MVA} = 1.305\,\Omega$$
$$Z_{m2} = \frac{1}{2} \cdot \frac{\eta \cdot \cos\varphi}{I_{an}/I_{rm}} \cdot
\frac{U_{rm}^2}{P_{rm}} = \frac{1}{2} \cdot \frac{0.87 \cdot 0.98}{5.5} \cdot
\frac{(6kV)^2}{0.36\,MVA} = 7.75\,\Omega$$
Transferred currents:
$$I''_{km1} = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_{m1}} = \frac{1.1 \cdot 6kV}{\sqrt{3} \cdot
1.305\Omega} = 2.92kA$$
$$I''_{km2} = \frac{c \cdot U_n}{\sqrt{3} \cdot Z_{m2}} = \frac{1.1 \cdot 6kV}{\sqrt{3} \cdot
7.75\Omega} = 0.492kA$$
Initial symmetrical short circuit current with influence of motors at the position:
$$\sum I''_k \quad = \quad I''_{k\cdot} \text{(without motors)} + I''_{km1} + I''_{km2}$$
$$= \quad 15.24kA \ + \ 2.92kA \ + \ 0.492kA = 18.65kA$$
Short circuit power:
$$S''_k \quad = \quad \sqrt{3} \ \cdot \ U_n \ \cdot \ I''_k = \sqrt{3} \ \cdot \ 6kV \ \cdot \ 18.65kA
## = 193.8MVA$$
Calculation of $\mu$ factors, with t = 0.1 s:
$$I_{rm1} = \frac{S_{rm1}}{\sqrt{3} \cdot U_{rm1}} = 0.221kA$$
$$I_{rm2} = \frac{S_{rm2}}{\sqrt{3} \cdot U_{rm2}} = 0.035kA$$
$$\frac{I''_{km1}}{I_{rm1}} = \frac{2.92kA}{0.221kA} = 11.2 \longrightarrow \mu = 0.64$$
$$\frac{I''_{km2}}{I_{rm2}} = \frac{0.492kA}{0.035kA} = 12.1 \longrightarrow \mu = 0.634$$
Calculation of q factors:

$$\frac{\text{Motor power}}{\text{pole pair number}} = \frac{2.3MVA}{2} = 1.15 \longrightarrow q
## = 0.587$$
$$\frac{\text{Motor power}}{\text{pole pair number}} = \frac{0.36MVA}{1} = 0.36 \longrightarrow
q = 0.447$$
Cut-off current of motors:
$$I_{am1} \quad = \quad \mu \cdot q \cdot I''_{km1} = 0.64 \ \cdot \ 0.587 \ \cdot \ 2.92kA =
1.0997kA$$
$$I_{am2} \quad = \quad \mu \cdot q \cdot I''_{km2} = 0.634 \ \cdot \ 0.447 \ \cdot \ 0.492kA =
0.139kA$$
$$\sum I_a \quad = \quad 16.4kA$$
## 18.14
### Example 14: Proof of the stability of low voltage systems
For the selection and project management of electrical systems it is necessary to check the short
current strength of the operational equipment against the mechanical and thermal stresses
resulting from short circuits. This assumes the knowledge required for calculating short circuit
currents. In this section the short circuit currents are calculated and the operational equipment is
dimensioned. After calculating the required short circuit currents, it must be assessed whether
protection during indirect contact and stability against short circuits is ensured.
Tables 19.2 to 19.5 summarize the calculated short circuit currents for Example 1 of this chapter.
**Table 19.2:** Summary of results for $I''_{k1min}$ at sub-distributor
| *Operational equipment* | *R* in mΩ (120 mm²) | $R_{PE}$ in mΩ (70 mm²) | *X* in mΩ |
$X_{PE}$ in mΩ |
|---|---|---|---|---|
| Primary network | - | - | - | - |
| Transformer | 3.5 | | 13 | |
| Cable | 15.68 | 26.88 | 6.8 | 6.8 |
| | Total resistance = 46.06mΩ | | Total reactance = 26.6 mΩ | |
Short circuit impedance is 53.18 mΩ
Short circuit current $I''_{k1min}$ = 4.12kA
**Table 19.3:** Summary of results for $I''_{k1min}$ at load

| *Operational equipment* | *R* in mΩ (120 mm²) | $R_{PE}$ in mΩ (70 mm²) | *X* in mΩ |
$X_{PE}$ in mΩ |
|---|---|---|---|---|
| Primary network | - | | - | - |
| Transformer | 3.5 | | 13 | |
| Cable | 15.68 | 26.88 | 6.8 | 6.8 |
| Conductor | 221.4 | 221.4 | 2 | 2 |
| Sum of resistances | 239.78 | 248.28 | 23.8 | 8.8 |
| | Total resistance = 488.86mΩ | | Total reactance = 30.6 mΩ | |
Short circuit impedance is 489.8 mΩ
Short circuit current $I''_{k1min}$ = 448A
18.14 Example 14: Proof of the stability of low voltage systems **181**
**Table 19.4:** Summary of results for $I''_{k3min}$ at distributor
| *Operational equipment* | *R in mΩ* | *X in mΩ* |
|---|---|---|
| Primary network | - | |
| Transformer | 3.5 | 13 |
| Cable | 12.65 | 6.8 |
| Total | 16.15mΩ | 19.8mΩ |
Short circuit impedance is 25.55mΩ
Short circuit current $I''_{k3} = 9.14\text{kA}$
**Table 19.5:** Summary of results for $I''_{k3min}$ at load
| *Operational equipment* | *R in mΩ* | *X in mΩ* |
|---|---|---|
| Primary network | - | |
| Transformer | 3.5 | 13 |
| Cable | 12.65 | 6.8 |
| Total | 178.6mΩ | 2 |
Short circuit impedance is 204.25mΩ
Short circuit current $I''_{k3} = 1.068\text{kA}$
**Determination of the peak short circuit current:**
$$\kappa \quad = 1.02 + 0.98 \cdot e^{-3\frac{R}{X}}$$
$$\kappa \quad = 1.02 + 0.98 \cdot e^{-3\frac{15.35}{21.8} = 1.138}$$

$$i_p \quad = \kappa \cdot \sqrt{2} \cdot I''_{k3} = 1.138 \cdot \sqrt{2} \cdot 9.14kA = 14.7kA$$
**Determination of the thermal equivalent short circuit current:**
$$I_{thm} = I''_k \cdot \sqrt{m + n}$$
For far-from-generator short circuits we set n = 1.
$$m \quad = \frac{1}{2 \cdot f \cdot t_k \cdot ln(\kappa - 1)} \left[ e^{4 \cdot f \cdot t_k \cdot
ln(\kappa - 1)} - 1 \right]$$
$$m \quad = \frac{1}{2 \cdot 50Hz \cdot 0.9s \cdot ln(1.138 - 1)} \left[ e^{4 \cdot 50Hz \cdot 1s
\cdot ln(1.138 - 1)} - 1 \right] = 0.005$$
so that the thermal equivalent short circuit current is then:
$$I_{thm} = 9.14kA \cdot \sqrt{0.005 + 1} = 9.16kA$$
Thermal short circuit strength of sub-distributor:
$$I_{thz} = 12.5kA \cdot \sqrt{\frac{s}{0.9s}} = 17.17kA$$
Thermal short circuit strength of main distributor:
$$I_{thz} = 20kA \cdot \sqrt{\frac{s}{0.9s}} = 21.8kA$$
for $t_{th} = 1s$ and $t_k = 0.9s$.
The stability of the main and sub distributors against short circuits is ensured by means of the
following stress parameters (Table 19.6):
**Table 19.6:** Checking the short circuit strength
| *400 V side* | *Short circuit current calculation* | | | *Required short circuit current strength* |
| | |
|---|---|---|---|---|---|---|---|
| | $I''_{k3}$ | $i_p$ | $I_{thm}$ | $I_{sc}$ | $I_{ma}$ | $I_{th}$ | $I_{thz}$ |
| Main distribution | 17.15kA | 33.95kA | | 20kA | 40kA | | 21.08kA |
| Sub-distribution | 8.58kA | 13.8kA | | 12.5kA | 20kA | 8.6kA | 17.17kA |
| Load | 1kA | | | 6kA | 6kA | | |
**18.15**
**Example 15: Proof of the stability of medium and high voltage systems**

The basic network design is shown in single-phase representation with fault locations and with a
110 kV network input, supply lines, transformers and bus bars (Figure 19.17). Figure 19.18 gives the
single-phase equivalent circuit, consisting of resistances and reactances, required for the
calculation.
The short circuit impedance of the network relative to the 110 kV side is:
$$Z_Q = \frac{c(U_{rQ})^2}{S''_{kQ}} = \frac{1.1(110kV)^2}{5000MVA} = 2.662\Omega$$
$$X_Q = Z_Q = 2.662\Omega$$
The impedance is converted using the square of the transformation ratio $t^2_{max}$ to give the
value relative to the 20 kV side:
$$Z_{Qt} = 2.662\Omega \cdot \frac{1}{t^2_{max}} = 72.1m\Omega$$
$$X_{Qt} = 72.1m\Omega$$
**Fig. 18.17:** Network design - single-phase representation with network input and transformers
**Fig. 18.18:** Imaging of operational equipment with equivalent circuit
Checking for far from generator short circuits:
In accordance with IEC 60909:
$$X_{TSV} \geq 2X_{Qt} = 1.265\,\Omega \geq 2 \cdot 71.74\,m\Omega$$
The requirement is therefore satisfied.
**Calculation of positive-sequence short circuit impedances for the transformer:**
The following data cab be taken from the nameplate of the transformer:
11,000 V ± 16 % in 13 steps (27 settings), 21 kV, 31.5/110 kV.
Maximum setting (step 1):
$Z_k = 68.8\Omega$, $I_{TpV} = 124.5/181A$, $U_{TpV} = 127.6kV$
Middle setting (step 14m):
$Z_k = 46.7\Omega$, $I_{TpV} = 165.3/209.9A$, $U_{TpV} = 110kV$
Minimum setting (step 27):
$Z_k = 30.7\Omega$, $I_{TpV} = 196.8/249.9A$, $U_{TpV} = 92.4kV$
Here, it is necessary to clarify whether, in accordance with DIN VDE 0102, the calculation can be
performed only with the middle position. The following relationship holds true:
$$U_{TpV} \quad = \quad U_{nTpV}(1 \pm p_T)$$
$p_T$ is obtained from the relationship:
$$p_T \quad = \quad 0.16 > 0.05$$
The step incrementation must be chosen so that the largest short circuit current occurs. The
transformation ratio is:
$$t_{max} = \frac{U_{TpV}}{U_{TSV}} = \frac{127.6kV}{21kV} = 6.08$$
The transformer resistance is found from:
$$R_T \quad = \quad \frac{P_{krT}}{3I_{rTpV}^2} = \frac{136kW}{3 \cdot (209.9A)^2} =
1.03\Omega$$
The impedances are converted to the values relative to the 20 kV side:

$$Z_T \quad = \quad X_T = 46.7\Omega \cdot \frac{1}{t_{max}^2} = 1.265\Omega$$
$$R_T \quad = \quad 1.03\Omega \cdot \frac{1}{t_{max}^2} = 27.84m\Omega$$
Calculation of cable impedances:
The following cable data [29] is given: N2XS(F)2Y 1x300 Rm/25, 12/20 kV:
from the resistance per unit length of the cable, we can calculate the resistance of the cable:
$R' = 0.0601\Omega/km \cdot 30m \cdot \dfrac{km}{1000m} = 1.8m\Omega$ and with the
inductance per unit length of cable $L' = 0.347mH/km$ we can calculate the inductance of the
cable:
$X' = 2\pi \cdot 50Hz \cdot 0.347mH/km = 109m\Omega/km \cdot 30m = 3.27m\Omega$.
Overland lines:
The overland lines are of type Al/St 537/53 mm². Due to the large cross-section, the resistances
expected cab be neglected.
**Calculation of short circuit currents for different fault locations:**
For the dimensioning of operational equipment the short circuit currents are calculated according
to Figure 19.19. First, a three-pole short circuit with simple input through parallel current paths is
calculated.
> **Fig. 18.19** - Equivalent circuit in the positive-sequence system at fault location F1
>
> The diagram shows an equivalent circuit in the positive-sequence system. From left to right, a
series path contains a resistor $R_Q$ followed by an inductor $X_Q$. This series branch connects
to a parallel branch on the right side, which contains an AC voltage source (generator symbol) with
voltage $\dfrac{c \cdot U_n}{\sqrt{3}}$. The short circuit current $I''_{k3}$ flows downward
through the fault point, closing the loop back to the left terminal. The circuit represents the
Thevenin equivalent seen from fault location F1, used to calculate the initial symmetrical short
circuit current.
The data for the resistance values in the short circuit current path are:
$Z_Q \quad$ 2.662Ω
$X_Q \quad$ 2.662Ω
$R_Q \quad$ 0
The calculation of the initial symmetrical short circuit current results from:
$$I''_k \;=\; \frac{c(U_{rQ})}{\sqrt{3}\,Z_k} = \frac{1.1 \cdot 110\,kV}{\sqrt{3} \cdot 2.662\,\Omega}
= 26.24\,kA$$
$$I''_k \;=\; I_k = I_a = 26.24\,kA$$

$$\frac{R_k}{X_k} \;=\; \frac{R_Q}{X_Q} = \frac{0}{2.662} = 0$$
$\kappa$ is obtained from the relationship:
$$\kappa \;=\; 1.02 + 0.98e^{0} = 2$$
We can then determine the peak short circuit current with.
$$i_p \;=\; 2 \cdot \sqrt{2} \cdot 26.24\,kA = 74.23\,kA$$
**Three-pole short circuit on transformer bus bar**
> **Fig. 18.20:** Equivalent circuit diagram description:
>
> The figure shows an equivalent circuit in the positive-sequence system at fault location F2. The
circuit consists of:
> - A network feed-in branch (left side) with series impedance elements $R_Q$ and $X_Q$.
> - Two parallel branches connected to the bus bar:
> - **Branch 1 (top):** Series elements $R_{T1}$ and $X_{T1}$ (transformer 1 impedance).
> - **Branch 2 (bottom):** Series elements $R_{T2}$, $X_{T2}$, $R_{K2/3}$, $X_{K2/3}$,
$R_{K1/3}$, $X_{K1/3}$ (transformer 2 impedance followed by cable impedances divided by 3).
> - At the right end of Branch 2, a voltage source $\frac{c \cdot U_n}{\sqrt{3}}$ is connected to
ground, with the short-circuit current $I''_{k3}$ indicated flowing downward into the fault point F2.
**Fig. 18.20:** Equivalent circuit in the positive-sequence system at fault location F2
The three-pole short circuit on the transformer bus bar (Figure 19.20) is made up of the transferred
short circuit currents, which can be calculated as in the following.
The data for the operational equipment in the short circuit current path are (the same values are
used for transformers and cables):
| Network feed-in | | Transformer | | Cable | |
|---|---|---|---|---|---|
| $Z_Q$ | $2.662\,\Omega$ | $Z_T$ | $1265\,m\Omega$ | $X_K/3$ | $1.09\,m\Omega$ |
| $X_Q$ | $2.662\,\Omega$ | $X_T$ | $1265\,m\Omega$ | $R_K/3$ | $0.601\,m\Omega$ |
| $R_Q$ | $0$ | $R_T$ | $27.87\,m\Omega$ | $X_K/3$ | |
## Branch 1:
$$\frac{R_k}{X_k} = \frac{27.87\,m\Omega}{1265\,m\Omega} = 0.02203$$
$$R_k = 0.02203 \cdot X_k < 0.3X_{k1}$$
Here we can neglect $R_k$.

## Branch 2:
$$\frac{R_k}{X_k} = \frac{27.87\,m\Omega + 0.601\,m\Omega +
0.601\,m\Omega}{1265\,m\Omega + 1.09\,m\Omega + 1.09\,m\Omega} = 0.02294$$
$$R_k = 0.02294 \cdot X_k < 0.3X_k$$
Here again we can neglect $R_k$. For the calculation of the initial symmetrical short circuit current
we use the reactances.
Short circuit reactance:
$$X_k = X_{Qt} + \frac{X_{T1}\left(X_{T2} + \frac{X_{k1}}{3} + \frac{X_{k2}}{3}\right)}{X_{T1} +
\left(X_{T2} + \frac{X_{k1}}{3} + \frac{X_{k2}}{3}\right)}$$
18.15 Example 15: Proof of the stability of medium and high voltage systems **187**
$$X_k = 72.1m\Omega + \frac{1265m\Omega \cdot (1265m\Omega + 1.09m\Omega +
1.09m\Omega)}{1265m\Omega + (1265m\Omega + 1.09m\Omega + 1.09m\Omega)}$$
$$= 705.1m\Omega$$
The initial symmetrical short circuit current is then:
$$I_k'' = \frac{cU_{nTSV}}{\sqrt{3}Z_k} = \frac{1.1 \cdot 20kV}{\sqrt{3} \cdot 705.1m\Omega} =
18.014kA$$
$$I_k'' = I_k = I_a = 18.014kA$$
The fictitious magnitude of the initial symmetrical short circuit current is:
$$S_k'' = \sqrt{3} \cdot 20kA \cdot 18.014kA = 624MVA$$
**Calculation of the transferred short circuit currents:**
$$\frac{I''_{k-branch2}}{I''_{k-branch1}} = \frac{X_T}{X_T + X_k/3 + X_k/3} = \frac{X_T}{X_T + 2/3
\cdot X_k} = \frac{1}{1 + 2/3 \cdot \frac{X_K}{X_T}}$$
$$I''_{k-branch2} = I''_{k-branch1} \cdot \frac{1}{1 + 2/3 \cdot \frac{X_K}{X_T}}$$
The initial symmetrical short circuit current results from the parallel current branches as follows:
$$I_k'' = I''_{k-branch1} + I''_{k-branch2} + \cdots + I''_{k-branchn}$$
The same conditions therefore apply as for the peak short circuit, cut-off and steady state short
circuit currents. We can then determine the transferred short circuit current for the first branch by
rewriting the equations:

$$I''_{k-branch1} = I_k'' \cdot \left[\frac{1}{1 + \frac{1}{1 + \frac{2}{3} \cdot
\frac{X_K}{X_T}}}\right]$$
$$I''_{k-branch1} = 18.014kA \cdot \left[\frac{1}{1 + \frac{1}{1 + \frac{2}{3} \cdot
\frac{1.09m\Omega}{1265m\Omega}}}\right] = 9.0095kA$$
For branch 2:
$$I''_{k-branch2} = I_k'' - I''_{k-branch1} = 18.014kA - 9.015kA = 8.999kA$$
**Determination of the peak short circuit current for branch 1:**
$$\kappa 1 = 1.02 + 0.98 \cdot e^{-3\frac{R}{X}} = 1.02 + 0.98 \cdot e^{-3 \cdot 0.02203} = 1.937$$
$$i_{p-branch1} = 1.937 \cdot \sqrt{2} \cdot I''_{k-branch1} = 1.937 \cdot \sqrt{2} \cdot 9.015kA =
24.7kA$$
**Determination of the peak short circuit current for branch 2:**
$$\kappa2 = 1.02 + 0.98 \cdot e^{-3\frac{R}{X}} = 1.02 + 0.98 \cdot e^{-3 \cdot 0.02294} = 1.935$$
$$i_{p-branch1} = 1.935 \cdot \sqrt{2} \cdot I''_{k-branch1} = 1.937 \cdot \sqrt{2} \cdot 8.999kA =
24.6kA$$
The total peak short circuit current is the sum of the currents in branches 1 and 2:
$$i_p = i_{p-branch1} + i_{p-branch2} = 49.32kA$$
Here it must be noted that the transferred short circuit current per cable branch is only one third of
the calculated current.
**Three-pole short circuit on the 20 kV bus bar:**
> **Diagram description - Fig. 18.21:** Equivalent circuit in the positive-sequence system at fault
location F3. The circuit is a ladder/parallel network represented as follows: On the left side, a series
branch contains the network source impedance composed of $R_{Qt}$ and $X_{Qt}$ in series.
From this source, two parallel feeder branches extend to the right: the upper branch contains
$R_{F1}$, $X_{F1}$ (feeder 1 cable), followed by $R_{T1}$, $X_{T1}$ (transformer T1), followed by
$R_{K1/3}$, $X_{K1/3}$ (cable K1 divided by 3). The lower branch contains $R_{F2}$, $X_{F2}$
(feeder 2 cable), followed by $R_{T2}$, $X_{T2}$ (transformer T2), followed by $R_{K2/3}$,
$X_{K2/3}$ (cable K2 divided by 3). Both branches merge at the right-hand side at the fault bus
(fault location F3), where the voltage source $\frac{c \cdot U_h}{\sqrt{3}}$ is connected, with the
short-circuit current $I''_{k3}$ indicated flowing downward.
**Fig. 18.21:** Equivalent circuit in the positive-sequence system at fault location F3

Only the reactances are used here.
$$X_k \;=\; X_{Qt} + \frac{\left(X_{T1} + \dfrac{X_{k1}}{3}\right)\!\left(X_{T2} +
\dfrac{X_{k2}}{3}\right)}{X_{T1} + \dfrac{X_{k1}}{3} + X_{T2} + \dfrac{X_{k2}}{3}}$$
$$X_k \;=\; 72.1m\Omega \;+\; \frac{(1265m\Omega + 1.09m\Omega)\cdot(1265m\Omega +
1.09m\Omega)}{(1265m\Omega + 1.09m\Omega) + (1265m\Omega + 1.09m\Omega)}$$
$$= 705.1m\Omega$$
$$I''_k \;=\; \frac{cU_{nTLV}}{\sqrt{3}\,Z_k} = \frac{1.1 \cdot 20kV}{\sqrt{3} \cdot 705.1m\Omega}
= 18.014kA$$
$$I''_k \;=\; I_k = I_a = 18.014kA$$
The fictitious magnitude of the initial symmetrical short circuit current is:
$$S''_k \;=\; \sqrt{3} \cdot 20kA \cdot 18.014kA = 624MVA$$
For the peak short circuit current:
$$\frac{R_k}{X_k} = \frac{14.24 m\Omega}{705.1 m\Omega} = 0.02019$$
$$\kappa = 1.02 + 0.98e^{-3 \cdot 0.02019} = 1.94$$
$$I_p = 1.94 \cdot \sqrt{2} \cdot 18.04 kA = 49.5 kA$$
**Stability of operational equipment against short circuits:**
For the short circuit strength of operational equipment we must calculate the dynamic ($i_p$) and
thermal ($I_{th}$) stresses.
For far-from-generator short circuits:
$$\frac{I_k''}{I_k} = 1 \text{ and therefore } n = 1.$$
In accordance with DIN VDE 0102 we obtain for the thermal effect of the DC aperiodic component
m:
$$m = \frac{1}{2 f \, T_k \, ln(\kappa - 1)} \left[ e^{4 f \, T_k \, ln(\kappa - 1)} - 1 \right]$$
For fault location F3 we calculate m with $T_k = 1s$:
$$m = \frac{1}{2 \cdot 50Hz \cdot 1s \cdot ln(1.94-1)} \left[ e^{4 \cdot 50Hz \cdot T_k \cdot
ln(1.94-1)} - 1 \right] = 0.162$$
This yields the thermal short-time current:

$$I_{th} = I_k'' \sqrt{m+1} = 18kA \cdot \sqrt{0.162 + 1} = 19.4 kA$$
For fault location F1 we calculate m with $T_k = 1s$:
$$I_{th} = I_k'' \sqrt{m+1} = 27kA \cdot \sqrt{0.195 + 1} = 29.5 kA$$
**Dimensioning the operational equipment:**
The calculations (Table 19.7) are summarized in this section in order to make these available for
dimensioning. For the dimensioning, the following operating conditions are assumed (Table 19.8).
The standard value of the network frequency is 50 Hz. The rated short circuit duration $T_k$ is
assumed to be 1 second. The protection technology must be designed and set up in accordance
with this. The dimensioning of the circuit breaker is taken from IEC 282 (Table 19.9). The rated
short circuit making current of the circuit breaker must be 2.5 times as large as the effective value
of the rated short circuit breaking current. If the peak short circuit current above 2.5 times this
value, the rated making current must have at least the value of the peak short circuit current.
Table 19.10 gives the rated currents of load interrupter switches. The rated steady state current of
the load interrupter switch is dimensioned according to the steady state operating current.
The dimensioning of the disconnect switch and the grounding switch follows from IEC 282 (Table
## 19.11).
**Table 19.7:** Current carrying capacities for the 110/20 kV level
| *Rated voltage* | *Rated steady state current* | *Initial symmetrical short circuit current* |
*Steady state short circuit current* | *Peak short circuit current* | *Thermal short-time current* |
|---|---|---|---|---|---|
| $U_r$ | $I_r$ | $I_k''$ | $I_k$ | $i_p$ | $I_{th}$ |
| **kV** | **A** | **kA** | **kA** | **kA** | **kA** |
| 123 | 420 | 27 | 27 | 75 | 30 |
| 24 | 2200 | 18 | 18 | 50 | 20 |
**Table 19.8:** Rated voltages for the 110 kV/20 kV level
| *Highest voltage for operational equipment* | *Rated short duration AC voltage* | *Rated
lightning impulse voltage* |
|---|---|---|
| $U_m$ | $U_{rW}$ | $U_{rB}$ |
| **kV** | **kV** | **kV** |
| 24 | 50 | 95 |
| 123 | 230 | 550 |
**Table 19.9:** Selection values and rated values for load interrupter switches in accordance with
## IEC 282

| *Rated voltage* | *Rated short circuit breaking current* | *Rated operating current A* | | | |
|---|---|---|---|---|---|
| **kV** | **kA** | **800** | **1250** | **1600** | **2000** |
| 123 | 12.5 | x | x | | |
| | 20 | | x | x | x |
| | 25 | | x | x | x |
| | **40** | | | x | |
**Table 19.10:** Selection values and rated values for load interrupter switches in accordance
with IEC 282
| *Rated steady state current* | *Rated short-time current* | *Rated peak current* |
|---|---|---|
| **A** | **kA** | **kA** |
| 630 | 31.5 | 78.75 |
**Table 19.11:** Selection values and rated values for disconnect switches and grounding switches
in accordance with IEC 282
| **Rated voltage kV** | **Rated initial symmetrical short circuit current kA** | **Rated peak
short circuit current** | **Rated steady state current A** | | | |
|---|---|---|---|---|---|---|
| | | | **800** | **1250** | **1600** | **2000** |
| 123 | 12.5 | 32 | x | x | | |
| | 20 | 50 | | x | x | x |
| | 25 | 63 | | x | x | x |
| | **40** | **100** | | | x | x |
#### Dimensioning of the overvoltage surge arrester:
The dimensioning of the overvoltage surge arrester is accomplished with the help of IEC 99-1. The
use of a silicon carbide surge arrester is preferred in ground fault neutralizer grounded systems and
is connected for the transformer between the conductors and ground. The required quenching
voltage and its rated discharge current must be considered during dimensioning. With the load
rejection factor $\delta_L = 1.1$ the quenching voltage is:
$$U_L \geq \delta_L \delta \frac{U_m}{\sqrt{3}} = 1.1 \cdot \sqrt{3} \cdot \frac{123kV}{\sqrt{3}} =
135.3kV.$$
In accordance with IEC 99-1 the quenching voltage $138kV$ is chosen. For the choice of arresters
according to the rated discharge current, for networks with above $60kV$ a $10kA$ arrester is
recommended. The stability against short circuits must be dimensioned so that the short circuit
strength remains ensured at currents higher than the expected initial symmetrical short circuit
current.

#### Dimensioning the current inverter:
The dimensioning of the current inverter follows from the short circuit current to be expected, in
order to ensure that the transformer does not become quickly saturated and the protection relays
are no longer able to correctly sense the short circuit current. The standard values in accordance
with IEC 44-1 are: 10, 15, 20, 30, 50, 75 and their decimal multiples or divisions. Here the standard
value 30 is chosen.
#### Dimensioning the voltage transformer:
The standard values are given in IEC 44-2. The information applies to inductive and capacitive
transformers. The rated network voltage is the essential parameter for dimensioning. For
conductor-conductor voltage transformers, 110 kV and a conductor-ground voltage transformer
$\dfrac{110kV}{\sqrt{3}}$ must be selected. The rated voltage factors are taken from IEC 44-2.
Dimensioning the 20 kV switchgear:
- Dimensioning the supply line:
- For the dimensioning of the conductors the three-pole short circuit is used as the basis.
- For the loading of the shielding the neutral point connection and the asymmetrical short circuit
currents are of greatest importance. The maximum short circuit current is calculated as the double
ground fault.
- Dimensioning the circuit breakers:
The electrical data for the circuit breakers from the manufacturers' catalogs are compared with the
data measured (Table 19.12).
**Table 19.12:** Dimensioning the circuit breakers
| | **Values from data sheet kA** | **Measured values kA** |
|---|---|---|
| Rated short-duration power frequency withstand voltage | 50 | 50 |
| Rated lightning impulse withstand voltage | 125 | 125 |
| Rated short circuit breaking voltage | 25 | 18 |
| Rated short-time current 1s | 25 | - |
| Thermal short-time current 1s | - | 18 |
| Rated short circuit make current | 63 | - |
| Rated short-time current | 25 | - |
| Rated current of bus bar | 2500 A | 2200 A |
| Rated current of branches | 2000 A | - |
| Rated peak current | - | 50 |
At this point an example will be given for the dimensioning of the circuit breakers (Table 19.13) at
different connection points to the bus bar (Figure 19.22).

**Table 19.13:** Dimensioning the circuit breakers
| | **Input field kA** | **Coupling field kA** | **Load field kA** |
|---|---|---|---|
| Rated current of transformer is 1000 A | | | |
| Rated current of vacuum circuit breaker 1250 A | | | |
| Rated short-duration power frequency withstand voltage | 50 | 50 | 50 |
| Rated lightning impulse withstand voltage | 125 | 125 | 125 |
| Rated short circuit breaking voltage | 16 | 20 | 20 |
| Rated duration of short circuit | 3s | 3s | 3s |
| Rated short circuit make current | 40 | 50 | 40 |
| Rated current | 1250 A | 2000 A | 1250 A |
The dimensioning parameters are the:
- rated short circuit breaking capacity
- rated operating current and
- short circuit current determined by measurement
> **Fig. 18.22:** Dimensioning the circuit breakers
> 1) input field 2) load field 3) coupling field
## 18.16
**Example 16: Calculation for short circuit currents with impedance corrections**
Given a 220 $kV$ network with the data for the operational equipment as in Figure 19.23

Calculate the short circuit currents and the impedance corrections.
> **Diagram description:** Single-line electrical network diagram showing a 220 kV busbar at
point Q connected to a network input with short circuit power of 8000 GVA. From the 220 kV bus, a
step-down block transformer rated 250 GVA, 240/21 kV (labeled T) feeds a 21 kV bus. A fault
location is indicated on the 220 kV side (at Q) and another fault location is marked on the 21 kV bus
at point A. A synchronous generator rated 250 MVA, 21 kV is connected to the 21 kV bus via a
circuit breaker. The diagram illustrates the system configuration used for Example 16: calculation
of short circuit currents with impedance corrections.
**Fig. 18.23:** Example 16: Calculation of short circuit currents with impedance corrections
## Network:
$$Z_Q \ = \ \frac{c \cdot U_{nQ}^2}{S_{kQ}''} = \frac{1.1 \cdot (220\,kV)^2}{8000\,MVA} =
6.65\,\Omega$$
## Generator:
$$Z_G \ = \ \frac{x_d'' \cdot U_{rG}^2}{100\% \cdot S_{rG}} = \frac{17 \cdot (21\,kV)^2}{250\,MVA}
= 0.30\,\Omega$$
Correction factor:
$$K_{G,KW} \ = \ \frac{c}{1 + x_d'' \cdot \sin\varphi_{rG}} = \frac{1.1}{1 + 0.17 \cdot 0.63} =
## 0.994$$
Corrected generator impedance:
$$Z_{G,KW} \ = \ K_{G,KW} \cdot Z_G = 0.994 \cdot 0.30\,\Omega = 0.298\,\Omega$$
Block transformer:
$$Z_{THV} \ = \ \frac{u_{kr}}{100\%} \frac{U_{rTHV}^2}{S_{rT}}$$
$$Z_{THV} \ = \ \frac{15\%}{100\%} \frac{(240\,kV)^2}{250\,MVA} = 34.56\,\Omega$$
$$Z_{TLV} \ = \ \frac{u_{kr}}{100\%} \frac{U_{rTLV}^2}{S_{rT}}$$
$$Z_{TLV} \ = \ \frac{15\%}{100\%} \frac{(21\,kV)^2}{250\,MVA} = 0.26\,\Omega$$
$$Z_{T,KW} \ = \ c \cdot Z_{TLV} = 1.1 \cdot 0.26\,\Omega = 0.286\,\Omega$$
Calculation of currents in Q:
$$I_k'' \ = \ I_{kQ}'' + I_{kKW}''$$

$$I_{kQ}'' \ = \ \frac{c \cdot U_{nQ}}{\sqrt{3} \cdot Z_Q} = \frac{1.1 \cdot 220\,kV}{\sqrt{3} \cdot
6.65\,\Omega} = 21\,kA$$
$$Z_{KW} = K_{KW} \cdot (t_r^2 \cdot Z_G + Z_{THV})$$
$$K_{KW} = \left(\frac{t_f}{t_r}\right)^2 \cdot \frac{c}{1 + (x_d'' - x_T) \cdot \sin\varphi_{rG}}$$
$$K_{KW} = \left(\frac{220kV}{21kV}\right)^2 \left(\frac{21kV}{240kV}\right)^2 \cdot \frac{1.1}{1 +
## (0.17 - 0.15) \cdot 0.63} = 0.913$$
$$Z_{KW} = 0.913 \cdot \left[\left(\frac{240kV}{21kV}\right)^2 \cdot 0.30 + 34.56\Omega\right] =
67.32\Omega$$
$$I''_{kKW} == \frac{1.1 \cdot 220kV}{\sqrt{3} \cdot 67.32\Omega} = 2.07kA$$
$$I''_k == 21kA + 2.07kA = 23.07kA$$
Calculation of currents in A:
$$I''_k = I''_{kG} + I''_{kT}$$
$$I''_{kG} = \frac{c \cdot U_{rG}}{\sqrt{3} \cdot Z_{G,KW}} = \frac{1.1 \cdot 21kV}{\sqrt{3} \cdot
0.298\Omega} = 44.75kA$$
$$I''_{kT} = \frac{c \cdot U_{rG}}{\sqrt{3} \cdot (Z_{T,KW} + \frac{1}{t_f^2} \cdot Z_Q}$$
$$I''_{kT} = \frac{1.1 \cdot 21kV}{\sqrt{3} \cdot \left(0.286\Omega +
\left(\frac{21kV}{220kV}\right)^2 \cdot 6.65\Omega\right)} = 38.48kA$$
$$I''_k = 44.75kA + 38.48kA = 83.23kA$$
**18.17**
**Example 17: Calculation with per-unit magnitudes**
Given $U_B = 6kV$, $U_B = 20kV$, $S_B = 100MVA$
Calculate Example 13 using per-unit magnitudes.
$$^*U = \frac{U}{U_B}$$
$$^*I = \frac{I \cdot U_B}{S_B}$$
$$^*Z = \frac{Z \cdot S_B}{U_B^2}$$
$$^*S = \frac{S}{S_B}$$

Transformation ratio of transformer as per-unit magnitude:
$$^*t_r = \frac{U_{rTHV}}{U_{rTLV}} \cdot \frac{U_{B,6kV}}{U_{B,20kV}} = \frac{20kV}{6.3kV} \cdot
\frac{6kV}{20kV} = 0.9524$$
Network feed-in:
$${}^{*}Z_{Qt} = \frac{c \cdot {}^{*}U_{nQ}^{2}}{{}^{*}S_{kQ}''} \cdot \frac{1}{{}^{*}\dot{u}_{r}^{2}}
= \frac{1.1 \cdot (1 \cdot pu)^{2}}{10\,pu} \cdot \frac{1}{0.9524^{2}} = 0.1212\,pu$$
## Transformer:
$${}^{*}Z_{T} = \frac{u_{krT}}{100\%} \cdot \frac{U_{rTLV}^{2}}{S_{rT}} \cdot
\frac{S_{B}}{U_{B,\cdot 6kV}^{2}} = \frac{13\%}{10\%} \cdot \frac{(6.3\,kV)^{2}}{25\,MVA} \cdot
\frac{100\,MVA}{(6\,kV)^{2}} = 0.5733\,pu$$
## Impedance:
$${}^{*}Z_{k} = {}^{*}Z_{Qt} + {}^{*}Z_{T} = 0.6883\,pu$$
${}^{*}I_{k}''$ without motors:
$${}^{*}I_{k}'' = \frac{c \cdot {}^{*}U_{n}}{\sqrt{3} \cdot {}^{*}Z_{k}} = \frac{1.1 \cdot
## 1\,pu}{\sqrt{3} \cdot 0.6883\,pu} = 0.923\,pu$$
Current in kA:
$$I_{k}'' = {}^{*}I_{k} \cdot \frac{S_{B}}{U_{B,\cdot 6kV}} = 0.923\,pu \cdot \frac{100\,MVA}{6\,kV}
= 15.38\,kA$$
Impedances of motors:
$${}^{*}Z_{m1} = \frac{1}{2} \frac{\eta \cdot \cos\varphi}{I_{an}/I_{rm}} \cdot
\frac{U_{rm}^{2}}{U_{B,\cdot 6kV}^{2}} = \frac{1}{2} \frac{\eta \cdot \cos\varphi}{I_{an}/I_{rm}}
\cdot \frac{S_{B}}{P_{rm}}$$
$$= \frac{1}{2} \cdot \frac{0.86 \cdot 0.97}{5} \cdot \frac{100\,MVA}{2.3\,MVA} = 3.63\,pu$$
$${}^{*}Z_{m2} = \frac{1}{2} \cdot \frac{0.87 \cdot 0.98}{5.5} \cdot \frac{100\,MVA}{0.36\,MVA} =
## 21.5\,pu$$
Transferred currents:
$${}^{*}I_{km1}'' = \frac{c \cdot {}^{*}U_{n}}{\sqrt{3} \cdot {}^{*}Z_{m1}} = \frac{1.1 \cdot
## 1\,pu}{\sqrt{3} \cdot 3.63\,pu} = 0.175\,pu$$

$$I_{km1}'' = 292\,kA$$
$${}^{*}I_{km1}'' = 0.0295\,pu$$
$$I_{km1}'' = 0.492\,kA$$
The results are identical with both methods.
**Appendices**
**Calculation Tools for Electrical Engineering**
# 1 The Elaplan Program
**Power Networks**
With this *Elaplan*-Modul you are able to calculate electrical power networks according DIN VDE
0102 and report them graphically. After doing the corresponding short-circuit calculation the
recorded Network Graphic allows you to show the results of any symmetrical and unsymmetrical
fault as well as data of the containing elements. In order to review the security in operation of the
network you can check the selectivity and calculate the load flow.
### **Introduction**
#### *Login*
After installation of the software you get entry to the *Elaplan* user platform with the user-ID as
follows:
Name: **SYSTEM**
Password: **PASS**
Please note, that there is a difference in use of capitals and small letters at the input.
After selection of the user name you have to change into the input area 'Password' by pressing TAB
or by using the mouse. You log on by pressing OK or Enter. The window 'Module Selection' will be
shown.
## Frankfurt*]
### *Elaplan-B Users, Projects*
#### **Add a Project**
You are in the Module Selection of *Elaplan*. Please click onto the Module '*Elaplan-B: Usesr,
Projects*' and then onto the icon 'Project Administration'. With the input area 'Add project' you
can create the new project. By pressing OK the project will be saved to your hard disk.
The sub-directory in `\\Elaplan\pro\` has the name of the field 'Project:'.
Subsequently you can leave the module '*Elaplan-B*', open the desired module, e.g. '*Elaplan-4:
Power Networks*' and select the added project.
In the 'Project Administration' you can also copy and delete projects, change their description etc.
There is the possibility to protect a project from unauthorised access and the definition of
co-owners of the project, too. Besides common data of a project can be put in.
Do you wish to make changes of the user name described before (user-ID), you have to do this in
the program 'User Administration'. Here you can add and change users with the corresponding
access rights.
Names and access rights of **standard users** are defined as follows:
**200** *Appendices*
| Name | Password | Access right |
|---|---|---|
| *Elaplan* | PASS | user |
| Daten | PASS | basic data administrator + user |
| System | PASS | basic data administrator + user + user administrator |
You can change the password of a user, too.
With this software several sample-projects of the module are delivered. You can copy them, use
them as an example for your first steps with the program module *Elaplan-4: Power Networks*
and create some listings, typical for output.

## Program Selection Power Networks
In the Module Selection (shown above) double click on the *Elaplan-4* icon. You open the
*Elaplan-4* Program Selection, where you can choose the desired program by double click. Now
the project you have create in the module 'Users, projects' will be shown for selection.
## Network Graphic
With the program '**Network Graphic**' all elements of the network will be recorded. The chosen
arrangement of the elements and their connections will be provided for the output on screen,
printer or plotter. By means of the available element symbols this method makes the design of the
network graphic simple and easy to survey. Simultaneously the single elements will be connected
with the nodes and the busbars of the network.
Graphic recording will be controlled with the menu bar. Additionally the function of the menus
́Edit ́,  ́Element ́and  ́ ́ can be selected by means of symbol bars.
In the status bar of  ́Network Graphic ́ you can see the current position of the mouse in the graphic
window. You can change the defaults for position indication in  ́Extras/Options ́ at the register
́General Options ́.
### **Element**
In the menu item '**Element**' all types of elements are shown, which can be used in the network
graphic.
Follwing types of elements are available: Net feeder, synchronous generator, asynchronouos
generator, two winding transformer, three winding transformer, synchronous motor,
asynchronous motor, directcurrent drive, cables/wires, cables/wires with load, load, capacity
battery, RLC-element, impedance coil, shunt impedance, earth busbar and busbar/node. For
protective devices you can choose between HV/LV-fuse, line protection switch, circuit breaker, fuse
switch-disconnector and D/D0-fuse. For connecting the single element you can use  ́Connecting ́ or
́Multiple Connecting ́.

With these elements you can design and output your network graphic.
## Appendices **201**
> **[Screenshot of Elaplan - Power Networks - MUSTER4 software interface]**
> The image shows the Elaplan power network simulation software with a graphical network
editor. On the left side, a menu is expanded showing element categories including: Net Feeder,
Synchronous Generator, Asynchronous Generator, Two Winding Transformer, Three Winding
Transformer, Synchronous Motor, Asynchronous Motor, Directcurrent Drive, Cables/Wires,
Cables/Wires with Load, Load, Capacity Battery, RLC-Element, Impedance Coil, Shunt Impedance,
Earthbusbar, Connecting, Multiple Connecting, Busbar/Node, and Protective Device/Switch
(highlighted in blue), which expands to show: Circuit Breaker, HV/LV-Fuse, Fuse
Switch-Disconnector, D-/DO-Fuse, Line-protection Switch, Switch. The main canvas area displays a
power network diagram with various electrical components including transformers, busbars,
generators, and connection lines arranged in a schematic layout.
*Elements*
The chosen type of element can be selected by clicking the icon in the symbol bar or with help of
the menu.
With the mouse you can move the element at any position and confirm the position with the left
mouse button.
The shown type of element nearby the mouse position indicator is a little help for the positioning
of the element. After a click on the left mouse button the element will be inserted at that position
it currently is - next to that grid unit which is the nearest by.
> **[Icon: Two busbars with a transformer connection symbol]**
If you want to connect **transformers** to **earth busbars** the earth busbars must be
positioned in the network graphic, but they don ́t need any **connection** to the network.
Connection to the transformers will be made at the input of the network data. This method avoids
confusing connection lines in the network graphic, if a lot of transformers will be connected to an
earth busbar.
> **[Icon: Switch symbol on a diagonal line]**
In the network graphic a **switch** kann be set in order to switch on or off parts of network or
parts of a project.
**Protective devices**, **switches** and **busbars** will be positioned in the network graphic
just like other elements. But their both connecting points must not end at **impedanceless
connections**.
> **[Icon: Multiple connecting symbol showing branching connections]**

With the menu item  ́Multiple Connecting ́ you have a tool to connect various elements to a
common busbar quick and easy. After activating of the symbol you click the common busbar at
first. Subsequently you click the connecting points of the single elements one after another. This
function ends with a double click at the last connecting point.
Die connection lines from the busbar to the connecting points of the chosen elements will be
drawn from the program.
> **[Icon: Single connecting symbol with an L-shaped connector]**
With the menu item  ́**Connecting** ́ you have the possibility to connect or to lengthen the
connection of elements at busbars.
By clicking the right mouse button the object will be rotated. Every mouse click rotates the object
on 90°
**202** *Appendices*
*Edit*
In the menu item '**Edit**' you can copy, move, delete, mark/switch und rotate the elements
contained in the network graphics.
Besides you can show the element data and input the designation of the elements.
negative.
After confirming with the  ́OK ́-button the network graphic will be moved according the input
values (in grid units).
With the menu item '**Move All ...**' not only the elements of a network graphic will be moved,
but the free drawing objects as well as the textes (all based on the entered grid values), too.
The function '**Rotate**' turns single-pole elements on 90°. The direction is according the arrow
in the symbol.
With the menu item '**Mark/Switch**' and a double click on the switch symbol in your network
graphic the switch will be operated (on/off). With this function you can mark single elements or
busbars also.

The menu item '**Remove Marking**' deactivates all elements and busbars marked in the
network graphic.
With the function '**Show connections**' you can get an overview in larger networks, which
connections and elements belong to a busbar.
They will be marked red in the network graphic.
With the function '**Partnet switching** ́ you can switch protective devices, which are placed in
the network graphic. Besides you can use this function to operate switches for the selection of part
networks. This symbol corresponds with the menu item 'Partnet switching'.
After inserting new elements in the network graphics you must designate them. Therefore you
have to select the menu item '**Designate Elements** ́. Click on the relevant element and input
the element designation. Maximum length
**204** *Appendices*
With the menu item  ́**Element Data** ́ the related technical data of the elements can be shown
on the screen and recorded. Please find more information in the chapter  ́**Aquisition of Technical
## Data** ́.
You get a message when you click on an element, which has no technical data related. If you save
the network graphic, now the technical data for the new added element will be shown also. For
example:
> **[Image/Screenshot: Dialog box titled "Load (Consumer)" - A technical data entry form with the
following sections and fields:**
>
> - **Element section:** Designation field showing "Last06.1" (dropdown), Consideration field
showing "not considered" (dropdown)
> - **Node section:** Designation: U_n; Input: LEI06; Value: 0.4 kV
> - **Technical Data section:** Archive: "Heizung, Klima, Lüftung" (dropdown); Designation:
WSP757 (dropdown); Group: "AEG Heizgeräte und Wärmspeicher | 400V / 50" (dropdown);
Description: "Wärmespeicher, 8h Aufheizung, 7.5kW"
> - **Parameters:** $U_r$: 0.4 kV; $S_r$: 0.0075 MVA; Cos Phi: 1
> - **Earth at neutral point:** yes / no (radio buttons, "no" selected)
> - **Voltage-related section:** Real part: 100%; Apparent part: 100%
> - Buttons: OK, Cancel, Apply, Help]
*Technical Data: Load*
With the function '**Basic drawing label**' you can input data for modification remarks and name
as well as date, company and the drawing number. When printing the network graphic these data
will be shown in the drawing label.

> **[Image/Screenshot: Dialog box titled "Basic drawing label (DIN 6771)" - A form layout
consistent with DIN 6771 drawing label standard, containing the following sections:**
>
> - **Field of application** (left panel, empty)
> - **Allow deviation / Surface** section with: Measures, Weight, Material fields
> - **Modification remark** table with columns: Ind., Changes, Date, Name (multiple empty rows)
> - **User section:** Date, Name fields; Drawn: 10. 2.2000; Checked, Norm fields
> - **Company section:** checkbox "[SoftLogo.BMP]?"; Oberfinanzdirektion; Source field
> - **Designation section:** Title 1: "net survey"; Title 2: "..."; Project: "Polizeiinspektion Lübeck"
> - **Drawing number** field; Sheet: 1 of 1
> - Repl. fields
> - Buttons: OK, Cancel, Apply, Help]
The menu item '**AutoText**' offeres you the possibility to designate your elements supported by
*Elaplan*. As default values *Elaplan* uses the standard values for the elements defined in
'/Options'. *Elaplan* assigns the designations to the single elements in the modes 'Total
automatically' or 'Half automatically' according to users intention.
*Draw*
Under the menu item '**Draw'** you are able to position free drawing objects in your network
graphic. They are not in relation to the elements and can be put at the worksheet in order to
denominate e.g. orientation points (buildings, streets etc.). *Elaplan* always fits them in the
network drawing gridded according the so-called units. It is not possible to show these grid lines.

Therefore 'Text', 'Line', 'Bend', 'Circle', 'Ellipse' and 'Rectangle' are available. After positioning these
free drawing objects in the network graphic they cannot be moved on the worksheet.
## Mark
> - A toolbar at the top with various drawing and editing tool icons
> - The main workspace showing a power network diagram with multiple electrical elements
(transformers, generators, buses, lines) interconnected in a schematic layout
> - A status bar at the bottom showing "Mouse-position: 128, 32 [Units]"]
*Menu item 'Draw'*
With the menu item '**Zoom**' you can zoom a window in order to display a detail of the network
graphic enlarged.
If you gave the elements their technical data previously or you did short-circuit or load flow
calculations before you are able to report the network graphic with the acquisition or result data at
the elements and busbars.
The menu item '**Grid**' shows the grid dots on the screen where the elements are aligned. If you
want to switch on the display of the grid for an existing project, you have to actualise the display of
the graphic by pressing the function key 'F5'.
With the menu item '**Result-/Acquisition Data ...**' of 'View' you can select what kind of data
should be shown.
| **Result-/Acquisition data** | **?** **×** |
|---|---|
| Data | Short-cicuit |

| ○ of Data Acquis. | ○ Short-circuit at a fixed node |
| ○ of Load flow calculation | ○ Short-circuit at all nodes ... |
|   No data displayed | |
| OK Cancel Apply Help | |
*Selection of report modus*
**208** *Appendices*
You can select of following data: acquisition data, results of short-circuit calculation at all nodes
(according **Takahashi**) or at a fixed node (according **Gauß**) or results of load flow
calculation. Selection is only possible for items data were calculated for.
A further selection of individual types of short-circuits is possible. Only already calculated types of
short-circuits can be seleceted.
#### *Extras*
In the menu item 'Extras' all settings can be done necessary for displaying and printing the network
graphics.
> **[Screenshot: Elaplan - Power Networks - MUSTER4 application window showing the "Extras"
menu expanded. The menu displays the following items: Export (with submenu arrow),
Network-Conditions..., Load Flow-Conditions..., a separator, Advise (checked), Options... Ctrl+O. In
the background, the network graphic canvas is visible showing a power network diagram with
multiple bus bars, transformers, generators, and load nodes connected by transmission lines. The
diagram includes various labeled components typical of a medium-voltage power distribution
network schematic drawn in the Elaplan software environment.]**
*Extras*
The sub item '**Convert ...**' you only should use if you want to open a network graphic, made
with a former version than 3.1x, with the actual *Elaplan* version the first time.

In this case a dialog window appears on the screen with the message that you want to open a
network graphic made in a former *Elaplan* version and you have to convert it into the actual
version at first. This message must be confirmed.
> **[Screenshot: Dialog box titled "Old Graphic version" with a warning icon (yellow triangle with
exclamation mark) on the left. The message reads: "The formation of graphic file has changed:
GRNDE V0.04". Below the message is an "OK" button.]**
*Old version of network graphic*
> **[Icon: Yellow warning triangle with a black exclamation mark]** &nbsp;&nbsp;&nbsp; This
command you should only use, if you have opened a network graphic made in a former *Elaplan*
version and the program references you to select the item 'Extras/Convert ...' at the start.
With the sub item '**Export**' you are able to export your network graphic to another graphic
software, which can read a Windows-Meta-File. WMF-export is optimized for the software
AutoCAD 14, AutoCAD LT 97 and CorelDRAW 7. This option uses the default settings in the item
'Extras/Options' register card 'WMF-Output' for generating the Windows-Meta-File. The Windows
dialog 'Save As' opens now.
> **[Screenshot: Windows "Speichern unter" (Save As) dialog box]**
> The dialog shows a file save window with:
> - "Speichern in:" (Save in) field showing "User4"
> - Toolbar icons for navigation (back, up, new folder, list/details view)
> - Empty file browser area
> - "Dateiname:" (Filename) field: `grnde.wmf`
> - "Dateityp:" (File type) dropdown: `Windows Metafile (*.wmf)`
> - Buttons: "Speichern" (Save) and "Abbrechen" (Cancel)
*Save as*
After selecting the path and touching the button 'Save As' the WMF-file will be written with the
name you have chosen. WMF-file of the network graphic will be performed without drawing label,
legend and frame.
With the menu item '**Network-Conditions ...**' you can change the periphere conditions for the
short-circuit calculation. So you can intervene in the program and influence the result. The
calculation method for the short-circuit peak current i_p is selected by means of the corresponding
buttons.
> **[Screenshot: "Network-conditions" dialog box]**
> The dialog contains the following input areas:
>
> - **Network frequency:** `50` (50 Hz) | Standard values button

> - **Minimum switching time lag:** `0.05` (0.05) | Standard values button
>
> **I*k section:**
>
> | Parameter | max. | (default) | min. | (default) |
> |---|---|---|---|---|
> | Factor c [ U_n > 1kV ] | 1.1 | (1.1) | 1 | (1.0) |
> | Factor c [ U_n < 1kV ] | 1.05 | (1.05) | 1 | (1.0) |
> | Factor c [ U_n = 0.4 kV ] | 1 | (1.0) | 0.95 | (0.95) |
> | Conductor temperature | 20 | (20 °C) | 80 | (80 °C) |
>
> **I_p section:**
> - Calculation method (radio buttons):
> - ● Spare frequency method
> - ○ Methode of R/X relation at fault location
>
> | Parameter | U_n > 1kV | | U_n < 1kV | |
> |---|---|---|---|---|
> | max. max. (SF * Kappa): | 2 | (2.0) | 2 | (1.8 intermeshed / 2.0 not) |
> | Safety-factor (SF): | 1.15 | (1.15 intermeshed / 1.0 not) | 1.15 | (1.15 intermeshed / 1.0 not) |
>
> Bottom buttons: **OK** | **Cancel** | **Apply** | **Help**
*Network conditions*
The input areas are previously occupied with the standard values according VDE. On the right side
of the input area the standard values are shown fixed once again. Meaning and effect of the single
area will be described below.
The frequency of the network is used for the calculation of the impedance of the elements.
For calculation of the **breaking current I**<sub>**a**</sub> the **minimum switching time
lag** is essential. This is the minimum period from start of the short-circuit until the first
separation of a pole of the circuit breaker.
For calculation of the short-circuit peak current in intermeshed networks the factor Kappa is
needed. For determination of factor Kappa VDE gives different types of calculation. Default is type
C; input a 0 in the area 'I_p calculation type' you will use calculation type B according VDE 0102.
Type B: ratio R/X at the short-circuit location factor Kappa = Kappa B * saftey margin (value for
## FACT)
Kappa B = value from the diagram acc. VDE 0102 for the ratio R/X.
The value for the saftey margin depends on the voltage level and must be recorded in the area
'value for FACT'.

For the product FACT * Kappa B in the input area 'max. value for FACT * KAPPA' the upper level acc.
VDE will be determined.
Input of 1 in the area 'I_p calculation type' the program selects calculation type C acc. VDE 0102
## (default).
Type C: Equivalent frequency calculation type factor Kappa = Kappa C
Kappa C = value from the diagram acc. VDE 0102 for the ratio R/X
$R/X = (R_c / X_c)^* (f_c / f)$
This calculation type C is permitted for calculation of a short-circuit in intermeshed networks.
Calculation Type B is used for calculation of a short-circuit in radial networks.
The factor c for voltage (factor c) determines the ratio of the voltage of the equivalent voltage
source (equivalent generator) to the rated voltage divided by $\sqrt{3}$ ($U\_n / \sqrt{3}$). VDE
0102 states different factors for different voltage levels. For every voltage level an input area is
available.
In order to get the most critical results for the maximum and minimum subtransient short-circuit
currents I"kmax and I"kmin they are calculated at different temperatures of the conductor. I"kmax
occurs at the minimum resistance of the conductor. The minimum subtransient short-circuit
current I"kmin happens when in the moment of the short-circuit the conductor has already
reached its maximum admissible temperature.
With the menu item '**Load Flow-Conditions ...**' the parameters for a load flow calculation can
be set, described as follows:
The network, a load flow calculation should be done for, must be recorded graphically at first. Via
network graphic the element designations as well as the input and output nodes are determined.
Then the technical data of the network elements must be recorded by means of the menu item
'Edit' / 'Element Data'. Please note, that during first input the data for short-circuit calculation must
be recorded also.
Before starting the calculation program you can set up the parameters for the computation by
means of the program 'Input of Load Flow Requirements'.
With the area **'Limit of accuracy'** and **'Limit of iteration'** you can set the break-off criteria
for the load flow calculation.
> **[Screenshot: Load flow-conditions dialog window]**
> A dialog box titled "Load flow-conditions" with a question mark and close (X) button in the title
bar. It contains:
> - A button labeled "Standard values" with text to its right: "Standard values = {0.5 / 75}"
> - A field labeled "Limit of accuracy:" with an input box showing "0.5" and unit "MVA"

> - A field labeled "Limit of iteration:" with an input box showing "75"
> - Four buttons at the bottom: "OK", "Cancel", "Apply", and "Help"
*Load flow-conditions*
With every step of iteration the load flow calculation program checks the computed deviations of
power in accordance to the calculation step before at all nodes. If the deviation of power at every
node is less than the required accuracy, the computation will be stopped. Otherwise the program
continues computation until the maximum number of steps (limit of iteration) is reached. In this
case the load flow calculation programs lists an error protocol. The required limit of accuracy is not
yet reached. For further information please refer to Section 'Report Load Flow Calculation' / Load
## Flow Statistic.
The standard values are deduced from the experience, when the load flow calculation of a
medium-voltage network, which elements are recorded correctly, converges. For pure low-voltage
networks the limit of accuracy must be selected smaller; an approximate value is 10 % of the sum
of all consumers (loads) in the network.
The menu item '**Advise**' turns on or off the display of a window, which warns you from the
superposition of several elements. If this advise-function is turned off you will get an acoustic signal
indeed but there is no advice for superpositioning elements by means of a dialog window.
The menu item '**Options...**' opens a dialog window with 5 register cards: 'Views', 'Print',
'WMF-Output', 'Autotext' and 'General Options'.
Panels with grey background color are display panels with default values of the program and
cannot be edited.
The register cards 'Views', 'Print' and 'WMF-Output' modify the various kinds of output.
'Views' controls the display on the screen, 'Print' controls the print output including print preview,
'WMF-Output' controls the generation of WMF-files.
## Identical
**212** *Appendices*
> **[Screenshot: Option Dialog Box - "Views" Register Card]**
>
> A Windows-style dialog box titled **"Option"** with tabs: View | Print | WMF | Autotext |
## General Options.
>
> The **View** tab is active, displaying the following sections:
>
> **General**
> - Text size of:
> - Element: 7 | Results: 6 | Height to width: 0.5

> - Grid distance: 32 [units]
>
> **Busbar**
> - Distance to designation: 2 [units]
> - Lengthen of ends: 5 [units]
> - Max. allowed numbers: 800 Node
>
> **Linewidth**
> - Busbar: 4
> - Wire/Cable: 2
> - Connection: 1
> - Others: 1
>
> Buttons at bottom: OK | Cancel | Help
*Register card 'Views'*
In the register card '**Views**' the area 'General' / 'Text size of' shows you the text size of element
designations and result data. The values cannot be changed. The relation between heights to width
you can change has an effect on the display of designation of elements and result data.
*Elaplan* will subdivide the grid distance in further equidistant sections. The number of units per
grid distance, here 32, defines the length of a section. The elements can be positioned on these
grid points only. Free drawing objects can be positioned between these raster points also. The
number of units per grid distance cannot be changed. The distance of grid points can be changed in
the menu 'Project/Worksheet Setup ...' in the panel '**Millimeter per grid**'.
In the area 'busbar' the horizontal distance of the designation to the busbar can be changed.
You can determine the lengthening of the ends of a busbar (input in units). Only positive numbers
are allowed. With this function you can change the image of the busbar on the screen. A
lengthening of the ends of a busbar of 8 units means a lengthening of ¼ grid distance.
In addition the number of busbars / nodes you can place into the network graphic is displayed. This
is a default value from the program and cannot be changed.
> **  ** If you are interested in the number of nodes you have placed in your network graphic
open the menu 'Project/Project...'; here you can see the number of nodes and elements in the
network graphic.
In the area 'Linewidth' you can set the line width of different elements in the network graphic.
On the register card '**Print**' you have the possibilty to influence the image of the output on a
printer or plotter and the print

> **[Screenshot: Option dialog box - Print tab]**
> A dialog window titled "Option" with tabs: View, Print, WMF, Autotext, General Options. The
"Print" tab is active and contains two main sections:
> - **Element** section with a **Linewidth** sub-section containing fields: Busbar: 8, Wire/Cable:
## 2, Connection: 0, Others: 0
> - **Legend** section with a Scaling factor field: 100
> - **Language** section with radio buttons: German, French (unselected), English (selected),
## Spain (unselected)
> - **Adjusted characters** section listing: Network - Arial, Drawing - Arial, Legend - Arial
> - Buttons at the bottom: OK, Cancel, Help
*Print*
Besides the line width of different elements you can set the language for the output of the network
graphic on a printer or plotter also. The selection of the language has influence to the terms in
legend and basic drawing label used by *Elaplan*.
In addition you can set the scaling factor for the legend. The font for the output of the network
graphic, drawing label und legend is set at 'Arial' by the program. It cannot be changed
On the register card '**WMF'** settings will be done for the output in a WMF-file. You can set the
line width of different elements and the color for the display of elements and busbars. The default
font for the generation of a WMF-file is '**Arial**' set by the program and cannot be changed.
> **[Screenshot: Option dialog box - WMF tab]**
> A dialog window titled "Option" with tabs: View, Print, WMF, Autotext, General Options. The
"WMF" tab is active and contains:
> - **Element** section with columns **Linewidth** and **Color**:
> - Busbar: 4, color swatch (black)
> - Wire/Cable: 2, color swatch (black)
> - Connection: 1, color swatch (black)
> - Others: 1, color swatch (black)
> - **Adjusted characters** section: Lettering - Arial
> - Buttons at the bottom: OK, Cancel, Help
*WMF*
In the area 'Linewidth' the input of positive numbers between 1 and 100 is allowed only. Clicking on
one of the color symbols opens the dialog window 'Color'. You can select the color and confirm
with the button 'OK'. Subsequently the element symbol will be displayed in the chosen color.
# 214 | *Appendices*
By means of the register card '**Autotext**' you can determine your favourite designation for
single elements the program will use if the menu item 'Edit/AutoText...' is set.

## Options.
> The active tab is "Autotext". A section labeled "Details for automatic designation" contains a grid
with two groups of fields, each with columns "Prefix" and "Start":
>
> | Label | Prefix | Start | Label | Prefix | Start |
> |---|---|---|---|---|---|
> | Net feeder: | NT | 1 | Busbar: | SS | 1 |
> | Generator: | GN | 1 | Wire/Cable: | LT | 1 |
> | Motor: | MO | 1 | Cable with Load: | LL | 1 |
> | Trafo 2-Wind.: | TZ | 1 | RLC-element: | RC | 1 |
> | Trafo 3-Wind.: | TD | 1 | Shunt impedance: | QI | 1 |
> | Earthbusbar.: | ER | 1 | Condensator.: | KO | 1 |
> | Load: | LA | 1 | Protect. Device: | SO | 1 |
> | Impedance Coil: | DR | 1 | Switch: | SA | 1 |
>
> At the bottom: OK | Cancel | Help buttons.
*Autotex*
The setting consists of two parts:
The first part, the so-called prefix, is a body text with a maximum length of 4 symbols. You can use
less than 4 symbols also.
The second part is a numeric array with a maximum length of 4 digits. All numbers the program
generates have a fixed length of 4 digits; the program fills up with leading zeros automatically. Only
positive numbers are allowed.
With these settings the program generates the complete designation of new elements inserted in
the network graphic if the menu item 'Edit/AutoText...' is active, e.g. 'NT0001' for the first net
feeder.
In the register card '**General Options'** you can set the type of view of the mouse position in the
'Status bar': Select between millimeters, grid and units.
## Options.
> The active tab is "General Options". The dialog contains the following sections:
>
> **Mouse position** - "View in:" with radio buttons: Millimeter, Grid, Units (Units selected)
> Checkbox: "View of mouse-click area"
>
> **Support - output** - Radio buttons: Off (selected), File Net.TRC
>

> **Zoom** - Steps minim.: 0 / Steps maxim.: 10
>
> **Dialog language** - Radio buttons: German, French, English (selected), Spain
>
> **Toolbar-size** - Radio buttons: small [16x15], middle [24x22] (selected), big [32x31]
>
> At the bottom: Ok | Cancel | Help buttons.
*General Options*
In addition you have the possibility to view the **mouseclick area**; this is the area the element
can be activated with the mouse. Every element is surrounded with a blue quadrangle symbolizing
the mouseclick area.
In the area 'Zoom' the maximum number of zoom steps is viewed for both directions ('Zoom In' and
'Zoom Out'). They are set by the program and are not subject to change.
In the area 'Support - output' there are options for the kind of support by phone. They are not
subject to change.
In the area 'Dialog language' you can select the language of the user surface. At the moment you
can choose between German and English; French and Spanish is available at a later time. For
activation the adjusted language you have to restart the program.
In the area 'Toolbar-size' the size of the toolbars is displayed in a dimmed mode only, because it
cannot be changed.
In the area 'Support - output' you can select to create the file 'Net.TRC'. It can help the support in
any case of program errors.
***Window***
In the sub menu item '**New Window**' you can open your network graphic as a copy in a further
window. You can insert new elements in all windows.
> **[Screenshot description: A screenshot of the Elaplan - [Power Networks - MUSTER4]
application window is shown. The Window menu is open and displays the following options: "New
Window" (F4), "Cascade" (Shift+F4), "Tile Horizontally" (Shift+F5), "Tile Vertically" (Shift+F6), and
"Arrange Icons". Below the menu, the main workspace shows a power network diagram
(MUSTER4) with various electrical elements including generators, transformers, busbars, and
interconnecting lines arranged in a single-line diagram format. The status bar at the bottom shows
"Mouse-position: 256, 0 [Units]".]**
*Window*

> **  ** The use of more windows is usefull when results of load flow calculation, short-circuit
calculation and/or acquisition data should be shown on the screen simultaneously. You can set the
selection what kind of report should be shown with the menu item 'View / Result-/Acquisition Data
...' for each active window.
Additionally you can arrange your windows in the manner 'Cascade', 'Tile Horizontally' or 'Tile
Vertically'. With the command 'Arrange Icons' you can rearrange the minimized windows on the
screen.
***Project***
In the sub menu item '**Project...**' you can see the path where your project is saved. Besides the
number of elements and nodes used in your network graphic is viewed.
**216** *Appendices*
Here all objects (elements and free drawing objects) are shown recorded within the graphic area. If
it is not possible to display all recorded elements in the printing area, you are able to scale the
content of the network graphic area. The part of the network graphic to print will always be built
up from the upper left corner (point 'Z' in the graphic). Simultaneously the X- and the Y-axis of the
network graphic will be scaled also in order to avoid distortion.
The sub menu item '**Worksheet Setup ...**' opens a dialog with the possibility to set size and
orientation of the worksheet as well as the grid size.
> **Screenshot: A dialog box titled 'Worksheet Size' with a close button [?][X]. It contains a
'Sheetsize' section with radio buttons for: DIN A4 (selected), DIN A3, DIN A2, DIN A1, DIN A0, and 2
x A0. To the right of the radio buttons is a 'User defined' radio button option, along with input
fields: Height: 210 mm and Width: 297 mm. Below are two orientation radio buttons: Portrait

(unselected) and Landscape (selected). A 'Gridsize' section shows a field labeled 'Millimeter per
grid:' with a value of 6 mm. At the bottom are three buttons: OK, Cancel, and Help.**
*Worksheet Setup*
The worksheet size is selectable from the defined DIN-sizes or free of choice. You can scroll within
the defined worksheet size only. The elements will be arranged on grid points always. The distance
of grid points is definable in the area 'Gridsize' by the user (in millimeters). Since elements will be
saved because of the grid points the display and print of elements can be changed afterwards by
variation of the grid size. Depending on the chosen grid size it is possible that elements will be
positioned one upon the other (very low grid size) or outside of the worksheet. The change of the
grid size has influence on the print output and the print preview of the network graphic; it has no
effect for the display on the screen.
With the sub menu item '**Print ...**' you can output the network graphic to a plotter or printer.
The print dialog opens. After pressing the button 'OK' your network graphic is given out to the
selected plotter or printer. Default is the standard printer of the system settings.
With the sub menu item '**Printer Setup ...**' the standard Windows dialog opens for the setup of
the printer. Here you can select and setup another printer.
With the sub menu item '**Exit**' you leave the module 'Network Graphic'. You will be asked
whether the network graphic should be saved, data of the network graphic should be exported or
the topology should be checked. These items can be selected by a click onto the relevant control
element
**218** *Appendices*
## Graphic'
## Acquisition of Technical Data
Display and input of technical element data as well as of protective devices occurs in the program
module 'Network Graphic' by means of the icon in the symbol bar or the menu item 'Edit / Element
Data'. The dialog windows will be described afterwards.

#### *Net Feeder*
Select the menu item 'Element Data' or the corresponding icon and click to the net feeder placed
and designated in your network graphic before.
**220** *Appendices*
> **Image/Dialog Description:** Screenshot of a software dialog box titled **"Net Feeder"** used
for short-circuit and load flow calculation in electrical network simulation (Elaplan). The dialog
contains the following sections:
>
> - **Element:** Designation field showing "N01" (dropdown), Consideration: "general
considered" (dropdown)
> - **Node:** Designation: U_n, Output: SS1, value: 110 kV
> - **Technical Data:** U_n: 110 kV; Recording Type with two options: **Power** (selected) and
**Impedance**
> - Power: S"k: maximal = 1000, minimal = 1000 MVA
> - Impedance: R_(1): maximal = 1.3243, minimal = 1.3243 Ohm; X_(1): maximal = 13.243, minimal
## = 13.243 Ohm
> - **Only in case of deviation from VDE standard values:**
> - R_(1)/X_(1): 10 / 10 %
> - R_(0)/X_(0): 10 / 10 %
> - X_(0)/X_(1): 999999 / 999999 %
> - **Load flow:** Record checkbox checked; Residual part of power for:
> - Real power in netw.: 100 / 100 %; U_KL: 110 kV
> - Reactive power p. node: 100 / 100 %; P_n: 5 MW
> - Buttons: OK, Cancel, Apply, Help
*Net feeder for short-circuit and load flow calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. Context help with connections to the online-help is not yet available.
The element designation is given from the system. With the selection area 'Consideration' you can
choose for which kind of calculations the element should be considered. Following selections are
possible:
- not considered
- general considered
- considered only for I"kmin
- considered only for I"kmax.
The rated voltage on the output of the node (U_n) must be defined. It will be given for every
further element connected to this node. Elements connected to the node of the net feeder must
have the same rated voltage (U_n). This is the voltage which the subtransient short-circuit power
S"k delivered from the network at rated voltage refers to.

The input of minimum and maximum value has influence on the short-circuit calculation. The
maximum values are for calculation of I"kmax and the minimum values for calculation of I"kmin.
After acquisition of rated voltage and subtransient short-circuit power the resistance and reactance
in the positive sequence system $[R\_(1)$ and $X\_(1)]$ will be calculated. You are able to input
the values for $R\_(1)$ and $X\_(1)$ also and the program calculates the subtransient short-circuit
power S"k.
The input of the ratio of the impedances is necessary only in case of deviation from VDE standard
values. Otherwise the program calculates with a value of 10 % for the ratios R/X in the positive and
the zero sequence system. As default setting *Elaplan* assumes a network with no earthing.
If the network has impedance earthing the ratio of the reactances X in zero to X in positive
sequence system must be acquired.
At net feeders always P
# Synchronous Machine
Select the menu item 'Element Data' or the corresponding icon and click to the synchronous
machine placed and designated in your network graphic before.
> **[Screenshot: Synchronous Machine Dialog Window]**
>
> A dialog box titled **"Synchronous Machine"** with the following sections and fields:
>
> **Element:**
> - Designation: `G01` (dropdown)
> - Consideration: `general considered` (dropdown)
>
> **Node:**
> - Designation: `U_n`
> - Output: `SS0001` | `0.1` kV
>
> **Technical Data:**
> - Archive: `SIEMENS - Lieferprogramm 1992` (dropdown)
> - Group: `Bemessungsspannung 450/260 V | Frequenz 60 H` (dropdown)
> - Designation: `1FC6 296-4LA8., 1800 1/min` (dropdown)
> - $U_r$: `0.45` kV
> - $S_r$: `0.24` MVA
> - Neg. sequence $x_{(2)}$: Running as a generator
> - Engine type: Turbin-driven
>
> **Impedances / Reactances:**

> - Synch. reac. saturated $x_d$: `430` %
> - $R_G / X''d$: `0` %
> - Subtr. longitud. reac. $x''_d$: `9.4` %
> - Counter-reactance $x_{(2)}$: `27.1` %
> - Zero sequence imp. $x_{(0)}$: `3.9` %
>
> **Load flow:**
> -   Record | Residual part of power for:
> - Total | $U_{KL}$: `1` kV
> - ○ PV | Real power in netw.: `100` % | $P_r$: `0.2` MW
> - ● PQ | Reactive power p. node: `0` % | Cos Phi: `0.9`
>
> Buttons: **OK | Cancel | Apply | Help**
*Synchronous machine for short-circuit and load flow calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section **net feeder.**
For load flow calculations only the values for the maximum case of operation are considered. In
other words: In the area 'Consideration' the selection 'considered only for I"kmin' gives the same
result as the selection of 'not considered'.
The mode of operation shows whether the synchronous machine operates as motor or generator
because the same dialog window will be used for a synchronous motor also.
The rated output voltage of the node U_n is necessary for calculation of short-circuit current and
must be defined. For all elements connected to this node also this value is valid and will be given in
the relevant input dialog. It can be changed max. +/- 20% of the node voltage.
The input of the element data of the synchronous machine is possible manual or with the selection
'Archive / Group' from a root database. In case of manual input take care that the rated voltage U_r
deviates max. 20% of the output voltage of the node. The input of the engine type has influence to
the default values of the machine reactances.
The saturated synchronous reactance is the reciprocal value of the saturated no-load/short-circuit
ratio. The default values of the ratio R to X for short-circuit depend on U_r and S_r and are different
for high voltage and low voltage machines. For detailed information please refer to the booklet
'Networks'. The subtransient reactance x"d is the effective reactance of the machine at the
moment of short-circuit. If there is no input for the negative sequence reactance x_2 *Elaplan* sets
x_2 equal to x"d. The zero sequence reactance has a default value also defined by the program and
is subject to change. It will be assumed that the housing of the generator is solid earthed.

For load flow calculation the synchronous machine can be defined as PV-node element (input of
feeding real power P_r and terminal voltage U_KL) or as PQ-node element (input of feeding real
power P_r and power factor Cos Phi, no input of terminal voltage U_KL). You have to select the
relevant element within the item 'Record' at input area 'Load flow'. The input area will allow you
the input of the relevant data according your selection.
## PV-Generators
Input are real power P and terminal voltage $U_{KL}$, reactive power and phase angle of the
voltage $\varphi$ will be calculated. Parallel PV-generators (and net feeders) must have same
terminal voltage. Since *Elaplan* in its calaculation comprehends parallel generators to a
equivalent generator the total feeding reactive power of the node will be split to single generators
and net feeders after finishing calculation.
This happens with the input area 'Reactive power per node'. The sum of the single reactive power
must be 100 % for every input net feeder.
## Example:
One generator at the node: Reactive power per node = 100 %.
Several generators at one node: Reactive power per node must be split to the single generators,
e.g. according the ratio of the feeding real power. This is equal to an identical power factor per
machine. A splitting according the rated power of the machines gives an identical utiliziation of the
machines. According the need of operation other types of splittings are possible also.
#### **PQ-Generators**
Input are real power P and power factor cos φ, terminal voltage $U_{KL}$ will be calculated with
scalar value and phase angle of the voltage.
The PQ-generator will not be considered at the division of the residual power. The program sets
the acquired residual part of power to zero. You have the possibility to split the residual part of the
power manually. Otherwise the feeding power at the slack node takes the residual power. In this
case the program gives a message on the screen.
> PQ- and PV-generators at one node can cause physical problems. A solution for the load flow
calculation is not possible in any case.
> Elements not active in the calculation must not be considered at the division of the residual
power.
### *Two Winding Transformer*

Select the menu item 'Element Data' or the corresponding icon and click to the two windig
transformer placed and designated in your network graphic before.
> **[Screenshot description: A dialog window titled "Two winding Transformer" with the following
sections and fields:**
> - **Element section:** Designation field showing "TD02" with a dropdown; Consideration
dropdown set to "general considered"
> - **Node section:** Designation "U_n:"; Input: SS3, value 12 kV; Output: SS4, value 0.4 kV
> - **Technical Data section:** Archive dropdown showing "AEG Transformatoren"; Group
dropdown showing "Geb-Gießharztransformatoren | 200 bis 2500 kVA"; Designation dropdown
showing "TG 5341 M"; Description text: "Geb-Gießharztrafo, Ausführung M"
> - **General data tab / Earth tab:** Switching type: "Dyn5 m. herausget. Sternpkt. 150°"
> - **Parameters:** V_r Input: 12 kV; U_r Output: 0.4 kV; S_r: 0.2 MVA; Phase rotation: 150 Deg.
> - **Staging at input:** Staging-range: 0 %; Angle: 0 Deg.; Max. staging: 0; Adjusted staging: 0
> - **Losses:** P_kr: 2.6 kW; u_kr: 6 %
> - **Earth checkbox** is checked
> - **Buttons:** Ok, Cancel, Apply, Help]**
*Two winding transformer p. 1/2 for short-circuit and load flow calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section ***net feeder.***
For load flow calculations only the values for the maximum case of operation are considered. Other
selections have the same meaning just like 'not considered' and 'general considered'.
Input and output voltage of the node will be taken for the calculation of the short-circuit current
and therefore they must be recorded. Are there any definitions of voltages for those nodes made
before they will be shown as default values. A change of them has influence to all elements
connected to this node.
By means of the root database you have a quick access to the desired two winding transformer.
Please input the relevant numbers at the area 'Archive' and 'Group'.
If you have seleceted a transformer type all relevant data of the transformer just like vector group,
rated voltages, rated power, phase rotation, losses of the windings and impedance voltage u_kr
will be shown and are not subject to change.
If you want to record the data manually input 0 at 'Archive'. With the vector group the phase
rotation between high and low voltage winding is determined. Simultaneously the possibility of
earthing is set.
With the register card 'Earth' you can input data for earthing..

The kind of earthing is given with the recorded data. This determines the flow of the input in the
shown dialog.
> **[Screenshot: Two winding Transformer dialog box (p. 2/2)]**
>
> The dialog box is titled "Two winding Transformer" and contains the following sections:
>
> **Element:**
> - Designation: TD02 (dropdown)
> - Consideration: general considered (dropdown)
>
> **Node:**
> - Designation: U_n
> - Input: SS3 | 12 kV
> - Output: SS4 | 0.4 kV
>
> **Technical Data:**
> - Archive: AEG Transformatoren (dropdown) | Group: Geti-Gießharztransformatoren | 200 bis
2500 kVA (dropdown)
> - Designation: TG 5341 M (dropdown) | Geti-Gießharztrafo, Ausführung M
>
> **General data tab / Earth tab selected:**
> - Earthing type: Only Output | Calculation values button
>
> **Input at earthbusbar:**
> - R_L(0) Idling: [blank] Ohm
> - X_L(0) Idling: [blank] Ohm
> - R_E Earth-imp.: [blank] Ohm
> - X_E Earth-imp.: [blank] Ohm
> - I_E Earth. nom.: [blank] kA
>
> **Output at earthbusbar:**
> - R_L(0) Idling: 0.0104 Ohm
> - X_L(0) Idling: 0.04452 Ohm
> - R_E Earth-imp.: 0 Ohm
> - X_E Earth-imp.: 1e-005 Ohm
> - I_E Earth. nom.: 0 kA
>
> **Only by earthing of in- and output:**
> - R_k12: [blank] Ohm
> - X_k12: [blank] Ohm
>
> Buttons at bottom: Ok | Cancel | Apply | Help
*Two winding transformer p. 2/2 for short-circuit and load flow calculation*

If you want to connect the two winding transformer to an earth busbar note the sign. This sign (A
to Z) you have to relate to a designated earth busbar in the network graphic when recording their
element data. Additionally the earthing impedance X_E must be determined.
Transformators are elements, which can compensate voltage deviations in the network caused by
load variations. This is the reason why a variable voltage ratio of the transformer is realized,
typically on its high voltage side. The voltage can be varied in small steps by means of on-load or
off-load tap changers.
The vector group of transformers will not be considered for load flow calculations basically because
all transformers between voltage levels must have the same vector group.
Two winding transformers are built as transformers with in-phase and phase-angle regulation. It is
assumed that high-voltage side (side 1) is regulated only.
With input of the staging range $\Delta$U on the input side and the phase angle $\varphi$ of this
voltage referring to the input voltage every voltage ration can be adjusted.
The voltage ratio is defined by:
$$X = U_{\text{rt\_output}} / U_{\text{rt\_input}} * (1 + \Delta U * \cos \varphi + j \left(\Delta U *
\sin \varphi\right))$$
*Elaplan* will use this formula if no number of steps is acquired. If there is recorded a value for the
maximum adjustable number of steps m Elaplan interprets $\Delta$U as staging range +/-
$\Delta$U (in both directions). $\Delta$U must be given in % of input voltage. If positive and
negative staging ranges are different referring to the main tap position the larger value must be
given.
**224** *Appendices*
The maximum number of steps m will be counted from the main step position. From the adjusted
tap position +/- n the actual voltage ratio will be calculated
$\Delta U = \Delta U * (+/- n) / m$
for further use in the formula for ü.
## Example:
The transformer has a maximum number of steps in the positive staging range of 5 steps and in the
negative range of 10 steps. The total staging range is 20 %.
In order to increase the voltage on the output side the number of windings must be decreased on
input side. A negative number of steps must be adjusted.

The adjusted staging of -10 gives a maximum increase of voltage on the low voltage side of the
transformer.
Vice versa an increase of the number of windings on the input side enlarges the voltage ratio and
decreases the voltage on the output side.
### **Three Winding Transformer**
Select the menu item 'Element Data' or the corresponding icon and click to the three windig
transformer placed and designated in your network graphic before.
> **[Diagram: Screenshot of a software dialog box titled "Three winding Transformer - new -" with
a question mark/help icon in the top right corner. The dialog is organized into several sections:**
>
> - **Element section:** Contains a "Designation" field showing "TD_9268" with a dropdown
arrow.
> - **Consideration section:** Dropdown set to "general considered".
> - **Node section:** Contains a "Designation" label with "U_n:" header, and three rows: Input 1
(SS2, 12 kV), Output 2 (SS3, 12 kV), Output 3 (SS__2963, 0 kV).
> - **Technical Data section** with two tabs: "General data" (active) and "Earth":
> - Rated voltages: U_r(1): 0 kV, U_r(2): 0 kV, U_r(3): 0 kV
> - Phase rotation: Phase rot. V(2-1): 0 Deg., Phase rot. V(3-2): 0 Deg.
> - Rated apparent powers: S_r(1): 0 MVA, S_r(2): 0 MVA, S_r(3): 0 MVA
> - Short-circuit losses: P_kr(1-2): 0 kW, P_kr(2-3): 0 kW, P_kr(3-1): 0 kW
> - Short-circuit voltages: u_kr(1-2): 0 %, u_kr(2-3): 0 %, u_kr(3-1): 0 %
> - **Staging at input subsection:** Staging range: 0 %, Max. staging: 0, Adjusted staging: 0
> - Earth checkbox (unchecked)
> - **Bottom buttons:** OK, Cancel, Apply, Help**
*Three winding transformer p. 1/2 for short-circuit and load flow calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section ***net feeder.***
For load flow calculations only the values for the maximum case of operation are considered. This
is why the selection 'considered only for I"kmin' is interpreted as not considered.
Input and output voltage of the node will be taken for the calculation of the short-circuit current
and therefore they must be recorded. Are there any definitions of voltages for those nodes made
before they will be shown as default values. A change of them has influence to all elements
connected to this node.
Since three winding transformers are a special design the manufacturer has to deliver detailed
information of rated voltages, phase rotations, rated power, losses of windings and impedance
voltages.

Transformators are elements, which can compensate voltage deviations in the network caused by
load variations. This is the reason why a variable voltage ratio of the transformer is realized,
typically on its high voltage side. The voltage can be varied in small steps by means of on-load or
off-load tap changers.
Three windings transformers can be built with in-phase regulation in every winding. This occurs
with input of the additional voltage or the maximum number of steps m and the adjusted staging
+/- n.
> **[Screenshot: Three Winding Transformer dialog box - new entry]**
>
> A software dialog window titled "Three winding Transformer - new -" is shown. It contains the
following sections:
>
> **Element:**
> - Designation: TD__9268 (dropdown)
>
> **Consideration:**
> - general considered (dropdown)
>
> **Node:**
> - Designation: U_n:
> - Input 1: SS2 - 12 kV
> - Output 2: SS3 - 12 kV
> - Output 3: SS__2963 - 0 kV
>
> **Technical Data tabs:** General data | Earth
>
> - Earthing type: Input 1 earthed (dropdown) | [Calculation values button]
>
> **Transf.-side columns: Input 1 | Output 2 | Output 3**
> - at earthbusbar: (dropdowns) - A-Z
> - R_L(0) Idling: 0 | 0 | 0 - Ohm
> - X_L(0) Idling: 0 | 0 | 0 - Ohm
> - R_E Earth-imp.: 0 | 0 | 0 - Ohm
> - X_E Earth-imp.: 0 | 0 | 0 - Ohm
> - I_E Earth. nom.: 0 | 0 | 0 - kA
>
> *only if earthed from two sides:*
>
> **Transf.-side: 1-2 | 2-3 | 3-1**
> - R_k(0): 0 | 0 | 0 - Ohm
> - X_k(0): 0 | 0 | 0 - Ohm

>
> Buttons: OK | Cancel | Apply | Help
*Three winding transformer p. 2/2 for short-circuit calculation*
If the transformer is earthed, you are able to set the kind of earthing by means of the register card
'Earth'. The flow of input is determined by the kind of earthing.
With the button 'Calculation values' required data for earthing are calculated for the short-circuit
computation.
*Cables / Wires and Cables / Wires with Load*
Select the menu item 'Element Data' or the corresponding icon and click to cables / wires placed
and designated in your network graphic before.
> **[Screenshot: Cables / Wires with load dialog box]**
>
> A software dialog window titled "Cables / Wires with load" is shown. It contains the following
sections:
>
> **Element:**
> - Designation: L05 (dropdown)
>
> **Consideration:**
> - not considered (dropdown)
>
> **Node:**
> - Designation: U_n:
> - Input: SS5 - 0.4 kV
> - Output: LEI05 - 0.4 kV
>
> **Technical Data:**
> - U_B: 0.4 kV
>
> | | Length [km] | Type | Cross-section | U_r [kV] | remove |
> |---|---|---|---|---|---|
> | Distance 1: | 0.019 | NYY | 4x120 | 1 |   |
> | Distance 2: | 0 | | | |   |
> | Distance 3: | 0 | | | |   |
> | Distance 4: | 0 | | | |   |
>
> | | Load at [km] | U_r [kV] | S_r [MVA] | Cos Phi: | Earth: |
> |---|---|---|---|---|---|
> | 1: | 0.005 | 0.4 | 0.1 | 0.9 |   |
> | 2: | 0 | 0 | 0 | 0 |   |

> | 3: | 0 | 0 | 0 | 0 |   |
> | 4: | 0 | 0 | 0 | 0 |   |
> | 5: | 0 | 0 | 0 | 0 |   |
> | 6: | 0 | 0 | 0 | 0 |   |
> | 7: | 0 | 0 | 0 | 0 |   |
> | 8: | 0 | 0 | 0 | 0 |   |
>
> Buttons: OK | Cancel | Apply | Help
*Cables / Wires with load for short-circuit and load flow calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section **net feeder.**
For load flow calculations only the values for the maximum case of operation are considered. Other
selections have the same meaning just like 'not considered' and 'general considered'.
Input and output voltage of the node will be taken for the calculation of the short-circuit current
and therefore they must be recorded. Are there any definitions of voltages for those nodes made
before they will be shown as default values. A change of them has influence to all elements
connected to this node.
Between input node and output node the cable can consist of maximum four partial distances with
different types of cables. Short circuit point is not assumed between two partial distances but on
the nodes only.
By means of the cable designation in the root database the definition of cable type and
cross-section gets easier. The rated voltage U_n determines the voltage level the cable should be
lain.
The acquisition of loads between partial distances considers the loads according their connection
points. The cable with loads between partial distances is modelled as 'π'-equivalent. The loads will
be converted into impedances with the rated voltage as reference value.
With successive star-delta-transformation the loads will be shifted to the end nodes. This
transformation reduces the number of nodes in the network and accelerates the load flow
calculation especially in medium and low voltage networks.
Maximum eight loads can be connected to a cable, which can consist of four partial distances. The
definition of a load covers

> **[Screenshot: Asynchronous Machine dialog box]**
>
> A software dialog window titled "Asynchronous Machine" with the following sections and fields:
>
> - **Element** section: Designation field showing "ASM1" (dropdown)
> - **Consideration** section: dropdown set to "general considered"
> - **Node** section: Designation: (blank), Input: SS3; U_n: 12 kV
> - **Technical Data** section:
> - Archive: "Manual" (dropdown)
> - Group: (blank dropdown)
> - Designation: (blank dropdown)
> - Operating type: Running as a motor
> - U_r: 12 kV
> - Pair of poles: 1
> - P_r (Output power): 5 MW
> - Cos Phi: 0.8
> - ETA (efficiency): 0.9
> - Ia / I_r: 6
> - **Impedance-relation** section:
> - R_{(1)} / X_{(1)}: 10 %
> - X_{(2)} / X_{(1)}: 0 %
> - Buttons: OK, Cancel, Apply, Help
*Asynchronous machine for short-cicuit calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section **net feeder.**
The operating type shows whether the machine is in motor or in generator operation.
Input voltage of the node will be taken for the calculation of the short-circuit current and therefore
it must be recorded. Is there any definition of voltage for this node made before it will be shown as
default value. A change of it has influence to all elements connected to this node.
For load flow calculations asynchronous machines have no influence.
By means of the root database you have a quick access to the desired asynchronous machine.
Please input the relevant numbers at the area 'Archive' and 'Group'.
When selected a type of machine all relevant data of the machine will be shown and are not
subject to change.
If you want to record the data manually input 0 at 'Archive'.
In case of a short-circuit asynchronous machines contribute to the delivery of short-circuit energy
especially they have large rated power.

U_r is the rated voltage the asynchronous machine delivers its output rated power P_r.
For determination of impedances efficieny, power factor, ratio of starting current to rated current
and the number of pole pairs is important.
If there is no input at the ratio of R to X in the positive sequence system as well as X in the negative
sequence system to X in the positive sequence system the program calculates with standard values.
**RLC-Element**
Select the menu item 'Element Data' or the corresponding icon and click to the RLC-element placed
and designated in your network graphic before.
> **RLC-Element - new -** dialog window screenshot description:
>
> A software dialog box titled "RLC-Element - new -" with the following sections and fields:
> - **Element** section: Designation field showing "RC_3955" with a dropdown.
> - **Consideration** section: dropdown set to "general considered".
> - **Node** section: Designation (U_n:), Input: SS2 with value 12 kV, Output: SS3 with value 12
kV.
> - **Technical Data** section: U_r: 12 kV; I_r: 0 kA.
> - **Positive sequence system**: R_{1} Real: 0 Ohm; X_{1} App.: 0 Ohm; C_Operat.: 0 μF.
> - **Zero sequence system**: R_{0} Real: 0 Ohm; X_{0} App.: 0 Ohm; C_Earth: 0 μF.
> - Buttons: OK, Cancel, Apply, Help.
*RLC-element for short-circuit and load flow calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section **net feeder.**
For load flow calculations only the values for the maximum case of operation are considered. Other
selections have the same meaning just like 'not considered' and 'general considered'.
Input and output voltage of the node will be taken for the calculation of the short-circuit current as
well as for the load flow calculation and therefore they must be recorded. Are there any definitions
of voltages for those nodes made before they will be shown as default values. A change of them
has influence to all elements connected to this node.
Besides data for rated voltage and rated current for the RLC-element the resistances and
reactances for positive and negative sequence system must be recorded.

Data of the zero sequence system are required for calculation of unsymmetrical short-circuits; data
of the positive sequence system are needed for calculation of symmetrical short-circuits.
Informations of capacitances are needed in order to consider the shunt impedance of the
RLC-element in laod flow calculations.
RLC-elements are always used when elements in the network cannot be defined by means of
standard elements, e.g. capacitors, switches or arbitrary complex impedances.
The RLC-element is realized as equivalent 'π'-network.
### **Impedance Coil**
Select the menu item 'Element Data' or the corresponding icon and click to the impedance coil
placed and designated in your network graphic before.
> **Impedance Coil - new -** dialog window screenshot description:
>
> A software dialog box titled "Impedance Coil - new -" with the following sections and fields:
> - **Element** section: Designation field showing "DR_3939" with a dropdown.
> - **Consideration** section: dropdown set to "general considered".
> - **Node** section: Designation (U_n:), Input: SS2 with value 12 kV, Output: SS3 with value 12
kV.
> - **Technical Data** section: U_r: 12 kV; I_r: 0 kA; P_kr: 0 kW; u_kr: 0 %.
> - Buttons: OK, Cancel, Apply, Help.
*Impedance Coil*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section **net feeder.**
Input and output voltage of the node will be taken for the calculation of the short-circuit current
and therefore they must be recorded. Are there any definitions of voltages for those nodes made
before they will be shown as default values. A change of them has influence to all elements
connected to this node.
By means of the root database you have a quick access to the desired impedance coil. Please input
the relevant numbers at the area 'Archive' and 'Group'.

When selected a type of impedance coil all relevant data of the impedance coil will be shown and
are not subject to change.
**Earth Busbar**
Select the menu item 'Element Data' or the corresponding icon and click to the earth busbar placed
and designated in your network graphic before.
**Load (Consumer)**
Select the menu item 'Element Data' or the corresponding icon and click to the load (consumer)
placed and designated in your network graphic before. Loads are non-motive consumers and will
be considered for load flow calculations only because they have no influence on the magnitude of
the short-circuit current.
### **Shunt Impedance**
Select the menu item 'Element Data' or the corresponding icon and click to the shunt impedance
placed and designated in your network graphic before.

> **[Dialog Box: Shunt Impedance - new -]**
>
> A software dialog window titled "Shunt Impedance - new -" with a help (?) and close (X) button.
The dialog is divided into the following sections:
>
> - **Element section:** Designation field showing "QI 3711" with a dropdown selector.
> - **Consideration section:** Dropdown set to "general considered".
> - **Node section:**
> - Designation: U_n
> - Input: SS5 | value field: 0.4 | unit: kV
> - **Technical Data section:**
> - U_r: 0.4 kV
> - I_r: 0 kA
> - **Positive sequence system:**
> - R_(1) Real.: 0 Ohm
> - X_(1) inductive: 0 Ohm
> - X_(1) capacitiv: 0 Ohm
> - **Zero sequence system:**
> - R_(0) Real.: 0 Ohm
> - X_(0) inductive: 0 Ohm
> - X_(0) capacitiv: 0 Ohm
>
> Buttons at the bottom: **OK**, **Cancel**, **Apply**, **Help**
*Shunt Impedance for short-circuit and load flow calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section **net feeder.**
For load flow calculations only the values for the maximum case of operation are considered. Other
selections have the same meaning just like 'not considered' and 'general considered'.
Input voltage of the node will be taken for the calculation of the short-circuit current as well as for
the load flow calulation and therefore it must be recorded. Is there any definition of voltage for this
node made before it will be shown as default value. A change of it has influence to all elements
connected to this node.
Besides data for rated voltage and rated current for the shunt impedance resistances and
reactances for positive and zero sequence system must be recorded.
### **Capacity Battery**
Select the menu item 'Element Data' or the corresponding icon and click to the capacity battery
placed and designated in your network graphic before.

> **[Dialog Box: Capacity battery - new -]**
> A software dialog box titled "Capacity battery - new -" containing the following fields:
> - **Element** section: Designation field showing "KO_2299" with a dropdown; Consideration
field showing "general considered" with a dropdown.
> - **Node** section: Designation: (empty); Input: SS5; U_n: 0.4 kV.
> - **Technical Data** section: U_r: 0.4 kV; I_r: 0 kA.
> - **Positive sequence system**: R_(1) Real.: 0 Ohm; X_(1) capacitiv: 0 Ohm.
> - **Zero sequence system**: R_(0) Real.: 0 Ohm; X_(0) capacitiv: 0 Ohm.
> - Buttons: OK, Cancel, Apply, Help.
*Capacity Battery for short-circuit and load flow calculation*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and
'Consideration' please refer to explanations in Section **net feeder.**
For load flow calculations only the values for the maximum case of operation are considered. Other
selections have the same meaning just like 'not considered' and 'general considered'.
Input voltage of the node will be taken for the calculation of the short-circuit current as well as for
the load flow calulation and therefore it must be recorded. Is there any definition of voltage for this
node made before it will be shown as default value. A change of it has influence to all elements
connected to this node.
Besides data for rated voltage and rated current for the capacity battery resistances and reactances
for positive and zero sequence system must be recorded.
**Direct Current Drive**
Select the menu item 'Element Data' or the corresponding icon and click to the direct current drive
placed and designated in your network graphic before.
> **[Dialog Box: Directcurrent Drive - new -]**
> A software dialog box titled "Directcurrent Drive - new -" containing the following fields:
> - **Element** section: Designation field showing "GM_1068" with a dropdown; Consideration
field showing "general considered" with a dropdown.
> - **Node** section: Designation: (empty); Input: SS3; U_n: 12 kV.
> - **Technical Data** section: U_r: 12 kV; S_r: 0 MVA; Cos Phi: 0; Ia / I_r: 3.
> - **Impedance relation**: R_(1) / X_(1): 10 %.
> - Buttons: OK, Cancel, Apply, Help.
*Direct Current Drive*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. For detailed information to the area 'Element designation' and

'Consideration' please refer to explanations in Section **net feeder.**
For load flow calculations only the values for the maximum case of operation are considered. Other
selections have the same meaning just like 'not considered' and 'general considered'.
Input voltage of the node will be taken for the calculation of the short-circuit current as well as for
the load flow calulation and therefore it must be recorded. Is there any definition of voltage for this
node made before it will be shown as default value. A change of it has influence to all elements
connected to this node.
In case of a short-circuit direct durrent drives contribute to the delivery of short-circuit energy
especially they have large rated power.
U_r is the rated voltage the direct current drive consumes its rated power S_r.
For determination of impedances power factor and ratio of starting current to rated current is
important.
If there is no input at the ratio of R to X in the positive sequence system as well as X in the negative
sequence system to X in the positive sequence system the program calculates with standard values.
*Circuit Breaker*
Activate the icon 'Show \ Enter Technical Data' and click onto the circuit breaker in the network
graphic, which was placed and denominated in the network graphic before.
> **[Image: Screenshot of a "Circuit Breaker" configuration dialog window. The dialog contains the
following sections and fields:**
>
> - **Element section:** Designation field showing "S01" with a dropdown, a switching condition
checkbox (checked) with a circuit breaker symbol icon.
> - **Node section:** Designation: U_n, Input: SS4, value 0.4 kV.
> - **Technical Data section:**
> - Archive: "Sammlung SO's ab 03/97 AEG,ABB,KM,SIEMENS" dropdown; Rated current: 800 A
dropdown.
> - Designation: CB-ME-H, AEG dropdown.
> - **Setting of characteristic range:**
> - Selection of range: 1 dropdown
> - Bimetal-release: 800.00 A dropdown
> - Short-circuit-release: 1200.00 A dropdown
> - Time-delay: 0 ms
> - **Selected range:**
> - Bimetal-release: 480.00 A --- 800.00 A
> - Short-circuit-release: 1200.00 A --- 2400.00 A

> - **Buttons:** OK, Cancel, Apply, Help]
*Circuit breaker*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. Context help with connections to the online-help is not yet available.
Regarding the area 'Designation' please refer to explanations of section **Net feeder**.
With the check box 'Switching Condition' you can turn on or off the circuit breaker. It displays its
status, too.
The default value of the nominal input voltage U_n of the node, where the circuit breaker is
connected, is shown or can be defined here.
The technical data will be taken from the protective device data base and set to the smallest type
of protective device, which is available, at first. A change of the technical data is possible with a
selection from the data base (Archive and Designation). Technical data for circuit breakers are
required as follows: Rated current, selection of range, bimetal- and short-circuit release and a
time-delay, if applicable.
*Fuse Switch-disconnector*
Activate the icon 'Show \ Enter Technical Data' and click onto the fuse switch-disconnector in the
network graphic, which was placed and denominated in the network graphic before.
> **[Image: Screenshot of a "Sicherungs-Lasttrenner" (Fuse Switch-Disconnector) configuration
dialog window in German. The dialog contains the following sections and fields:**
>
> - **Element (Element) section:** Bezeichnung (Designation): SD0001 dropdown; Schaltzustand
(Switching condition): checkbox checked, with switch symbol icon.
> - **Knoten (Node) section:** Bezeichnung (Designation): U_n, Eingang (Input): SS5, value 0.4 kV.
> - **Technische Daten (Technical Data) section:**
> - Archiv (Archive): "Sammlung SO's ab 03/97 AEG,ABB,KM,SIEMENS" dropdown; Nennstrom
(Rated current): 6 A dropdown.
> - Bezeichnung (Designation): NH-La-00, AEG dropdown.
> - **Buttons:** OK, Abbrechen (Cancel), Übergehen (Apply), Hilfe (Help)]
*Fuse Switch-Disconnector*
With the function '?' for 'Direct help' you get detailed information to every input- or
selection-/display area. Context help with connections to the online-help is not yet available.
Regarding the area 'Designation' please refer to explanations of section **Net feeder**.

With the check box 'Switching Condition' you can turn on or off the fuse switch-disconnector. It
displays its status, too.
The default value of the nominal input voltage U_n of the node, where the circuit breaker is
connected, is shown or can be defined here.
The technical data will be taken from the protective device data base and set to the smallest type
of protective device, which is available, at first. A change of the technical data is possible with a
selection from the data base (Archive and Designation). Technical data for circuit breakers are
required as follows: For fuse switchdisconnectors, fuses and line-protection switches only the input
of the rated current is necessary.
The input dialogue for the technical data of the remaining types of protective devices stated above
is identical to that of the fuse switch-disconnector.
**Independent (Definite) Time Overcurrent Protection**
For the calculation of medium-voltage networks the independent (definite) time overcurrent
protection was added to the protective device data base and integrated into the computation.
In the protective device data base the independent (definite) time overcurrent protection is
modelled as circuit breaker. The characteristic of the bimetal release, which is necessary for
computation but does not exist in this case, is acquired in the data base simultaenously to the
short-circuit release. This requires at the input, that the settings for the bimetal release and the
short-circuit release are set to the same value in order to ensure a switch-off from
**234** *Appendices*
> Every change of these system data has only effect in the current project. At every new project
you will find the unchanged system data again.
If you want to use the extended system cable data for further projects you have to use that project
where the system cable data were changed or extended as basic project. From this basic project
new projects will be generated by copying.
You can define a new cable by pushing the button 'New'. Cable designation as well as cross section
describes the cable type. If a required cable type is already defined in the common root data base
for cables its cable data can be taken from there for short-circuit and load flow calculations.
With the area 'Archive' and 'Cable type' you can select the relevant cable. Data for 'Details',
'Cross-section' und 'Return' are selectable also. Existing technical cable data of the selected cable,
which will be needed for the calculations, will be shown in the relevant area. If the required cable
doesn ́t exist you have to record its data manually. Therefore you have to transfer the necessary
data into the relevant area (rated voltage, rated current, reactances and capacities for the positive
and zero sequence system from the leaflet of the cable manufacturer). If a cable should be
operated at a higher voltage you can record U_m in the area for U_r (e.g. in a three-phase system a
30kV cable can be operated up to max. U\_m = 36 kV).

Cable data for short-circuit calculations will be saved with the current project because further cable
data are needed i.e. capacity of operation and earth capacity. They both can vary for different
projects.
For load flow calculations the capacity of operation of the cable must be recorded in the positive
sequence system.
**Report Acquisition
# Short-Circuit
Elements installed in electrical switchgear are designed and selected according the VDE
regulations. Besides the continuous load all stresses and consequences in any cases of short-circuit
must be considered. Since short-circuit currents can reach a multiple of the rated current high
thermical and mechanical stress is expected. Inadmissible voltages arising possibly can cause
damaging of elements and endangering of persons. This is why the expected stresses in case of a
short-circuit must be evaluated for safety reasons. Therefore the knowledge of the short-circuit
currents in the network is needed.
The module *Elaplan-4* uses two different kinds of mathematical algorithms. For short-circuit at
one node the method according **Gauß (short-circuit location at one node)** is used for the
calculation of the fault current at the short-circuit location and the partial short-circuit currents in
the complete network. The method according **Takahashi (short-circuit location at all nodes)**
considers the location of the short-circuit at every node of the network one after the other. This
method calculates the total short-circuit current at all nodes of the network as well as the partial
short-circuit currents flowing in the direction of the fault location immediately.
## Initial Short-circuit Current I''$_k$
For the three-phase short-circuit only the impedances of the positive sequence network will be
used. The calculation occurs according the method of the **equivalent voltage source** where the
one and only voltage source is effective at the fault location.
It is a precondition for using the method of the equivalent voltage source at the fault location that
shunt impedances of lines and transformers as well as loads must not be considered.
That means:
- No-load losses and magnetizing
#### **Breaking current I**<sub>a</sub>
The breaking current at the fault location consists of the partial breaking currents of synchronous
generators, net feeders and asynchronous motors. The fading away to the breaking current is

considered by the factor μ.
$$I_a = \mu * I''_k$$
The factor μ depends on the **min. switching time lag** t<sub>min</sub> and the ratio
## I"<sub>k\_generator</sub>/ I<sub>r\_generator</sub>.
#### **Continuous short-circuit current I<sub>k</sub>**
The value of the continuous short-circuit current depends on saturation effects and on the
variation of the switching situation in the network. In practice both items are not known. VDE 0102
states a method of calculation which delivers a sufficient result for the maximum and minimum
continuous short-circuit current for that case where a generator or a synchronous machine feeds
the short-circuit. The calculation of the minimum and maximum continuous short-circuit current
happens according the λ<sub>min</sub>- and λ<sub>max</sub>-curves. They depend on the ratio
I"k_generator / Ir_generator and x<sub>d, saturated</sub>.
x<sub>d, saturated</sub> is the reciprocal value of the saturated no-load/short-circuit ratio.
$$I_k = \lambda * I''_k$$
After acquisition of the network graphic the single elements get related to their technical data.
After executed shortcircuit calculation you can output the results on screen or printer.
> Besides network data for the short-circuit calculation the data for load flow calculation can be
acquired also. For description of the relevant dialog windows and input area refer to Section 'Load
## Flow'.
**Calculate Short Circuit**
When you have related technical data to all elements in the network graphic you can start
calculation of short-circuit currents.
## Report Short Circuit at all Nodes
When calculating the short-circuit currents at all nodes (according **Takahashi**-algorithm) you
can put them out on screen or printer.
> **[Screenshot: Report Short Circuit at all Nodes - Elaplan software interface]**
> *Description: A software window titled "Report short circuit location at all nodes - Elaplan" is
shown. The interface contains a menu bar with options: Edit, Branch oriented, Node oriented, F1
Info. On the left side, a tree/list panel displays several entries with icons, including items labeled
I'k1min, I'k2min, I'k3min, and associated sub-entries with current values (e.g., I'k1min, I'k2min,
pOCEmax, etc.). The main area of the window is a large gray workspace panel.*
*Report Short Circuit at all Nodes*
The results of the calculation can be shown completely (branch oriented) or for chosen short-circuit
locations (node oriented).
The presentation of a result with a '\*' in the output lists means that this results exceeded the
maximum presentable value (e.g. 9999 Ω). This presentation is permissible because larger values
don't affect the total result and its evaluation.
Typicals for different output listings, e.g. for the report of calculation of a minimum single-phase
short-circuit, for the report of calculation of a maximum three-phase short-circuit etc., can be
made by means of sample-projects, which are scope of the software delivery. With the function
'Copy Sample-Project' in the module *Elaplan-B* you can select one of the sample-projects and
add it as an actual project. You can print or display the different kinds of output listings and
illustrate yourself their differences and uses.
The diagram below shows the meaning of the angle of the current θ at branch oriented
short-circuit currents calculated according the Takahashi algorithm (short circuit at all nodes):
> **[Diagram: Complex plane phasor diagram illustrating the angle convention for branch-oriented
short-circuit currents]**
> *Description: A 2D complex plane diagram with the horizontal axis labeled "Re" (real part) and
the vertical axis labeled "Im" (imaginary part). Three current phasors are shown originating from
the origin: phasor $I_1$ lies along a small positive angle $\theta_1$ with respect to the real axis;
phasor $I_2$ lies at a larger angle $\theta_2$ above $I_1$; and phasor $I_g$ (dashed line) lies at
the largest angle, representing the vector sum of $I_1$ and $I_2$. The angles $\theta_1$ and
$\theta_2$ are marked at the origin between the respective phasors and the real axis.*
$I_g = I_1 + I_2$
$I_1 = (I_1) * (\cos \varphi_1 - j \sin \varphi_1)$
$I_2 = (I_2) * (\cos \varphi_2 - j \sin \varphi_2)$

## Report Short Circuit at a Fixed Node
When calculating the short-circuit currents at a fixed node (according **Gauß**-algorithm) you
can put them out on screen or printer.
> **[Screenshot: Report Short Circuit at all Nodes - Elaplan software window]**
> The window titled "Report Short Circuit at all Nodes" in the Elaplan application is shown. It
contains a menu bar with options: Edit, Branch oriented, Node oriented, Double earth fault, F1
Info. On the left panel, a tree-like list is visible showing branch-oriented short-circuit report entries
including items labeled with Ik1min, Ik2min, Ik2Emin, Ik3min in one group, and Ik1dmax, Ik3max,
Ik2dmax, Ik1dkpmax in another group. The main area of the window is a large grey panel (empty
results area).
*Report Short Circuit at a fixed Node*
The results of the calculation can be shown completely (branch oriented) or for chosen short-circuit
locations (node oriented).
The presentation of a result with a '\*' in the output lists means that this results exceeded the
maximum presentable value (e.g. 9999 Ω). This presentation is permissible because larger values
don't affect the total result and its evaluation.
Typicals for different output listings, e.g. for the report of calculation of the maximum three-phase
short-circuit current at a fixed node etc., can be made by means of sample-projects, which are
scope of the software delivery. With the function 'Copy Sample-Project' in the module *Elaplan-B*
you can select one of the sample-projects and add it as an actual project. You can print or display
the different kinds of output listings and illustrate yourself their differences and uses.
The diagram below shows the meaning of the angle of the current $\vartheta$ at branch oriented
short-circuit currents for a fixed node:
> **[Diagram: Line segment diagram showing branch-oriented current directions between
nodes]**
> A horizontal line represents a network path through three line segments: LEIT.1, LEIT.2, and
LEIT.3, with nodes labeled 1 and 2 (shown as filled dots). Four current arrows are shown:
> - $I_1$: arrow pointing right at the start (before node 1), associated with line LEIT.1
> - $I_{2a}$: arrow pointing right just after node 1, associated with the beginning of LEIT.2
> - $I_{2e}$: arrow pointing right just before node 2, associated with the end of LEIT.2
> - $I_3$: arrow pointing right after node 2, associated with the beginning of LEIT.3
$I_1$ &emsp; Current at the end of line LEIT.1 (node 1)
$I_{2a}$ &emsp; Current at the beginning of line LEIT.2 (node 1)

$I_{2e}$ &emsp; Current at the end of line LEIT.2 (node 2)
$I_3$ &emsp; Current at the beginning of line LEIT.3 (node 2)
> **[Diagram: Two phasor diagrams showing the angle θ of short-circuit currents at Node 1 and
## Node 2]**
>
> **Node 1 (left diagram):** A complex plane with Im (imaginary) axis pointing upward and Re
(real) axis pointing right. A phasor labeled $I_{2a}$ is drawn pointing downward and to the left
(into the third quadrant), with the angle $\vartheta$ shown between the negative imaginary
direction and the phasor. The angle $\vartheta$ is measured from the Re axis toward the phasor in
the lower half-plane.
>
> **Node 2 (right diagram):** A complex plane with Im axis pointing upward and Re axis pointing
right. A phasor labeled $I_{2e}$ is drawn pointing upward and to the left (into the second
quadrant), with the angle $\vartheta$ shown between the phasor and the positive Re axis in the
upper half-plane.
$$\vartheta \ = \ \arctan\left(\frac{I_{\text{Im}}}{I_{\text{Re}}}\right) \qquad\qquad \vartheta' \ = \
\arctan\left(\frac{I_{\text{Im}}}{I_{\text{Re}}}\right) * \ (-1)$$
θ clockwise:
negative value
→ Assumed direction of current flow: out from element into node
θ 'counter-clockwise:
positive value
→ Assumed direction of current flow: into element out from node
The 1st Kirchhoff's law (node theorem) is effective: Σ I = 0 at one node.
## Node 1: Node 2:
$I_1 - I_{2a} = 0$ $I_{2c} - I_3 = 0$
$I_1 = I_{2a}$ $I_{2c} = I_3$
Rule of sign:
Current, which flows into an element, has an angle with negative value.

## Load Flow
The load flow calculation program is used for determination of the voltages at all nodes of the
network (scalar value and phase angle), the load flows and the losses in the elements of the
network.
A **load flow calculation** requires that the consumption of all loads in the network is well known
by means of measurements or estimates. Additionally the voltage and the real power at feeders
from prior networks or power plants must be known.
Feeders and generators must power the consumption of the loads and the losses in the network
caused by the load flow in the network.
For balancing the total load in the network one generator, the so-called slack generator, must feed
the difference power to the assumed feeding powers (residual power). The slack generator is
situated at the reference node, the so-called slack node. The slack node has a phase angle of 0 deg
by definition and is determined as the node of that net feeder, which was put in at first. If there is
no net feeder the node of that generator, which was put in at first, is choosen. The residual power
can be split to various arbitrary feeders also. The sum of the split residual power must be 100 % in
any case.
The assumed direction of the power flow is defined in the load reference arrow system: Real power
and inductive reactive power (lag) flowing into an element will have positive value. The load
reference arrow system will be used for the output of the results of generators and net feeders
also.
At an overexcited generator that feeds real power and inductive reactive power (lag) into the
network the real and reactive component
The slack node can deliver the residual power of the network. But this is not a requirement. It is
also possible to state the real power P, which is fed at the slack node, and to split the residual
power to several generators at other nodes. The percentage of the residual power, delivered by
the single generators, can be set for every generator. *Elaplan* determines the slack node
according the rule as follows:
The node of that net feeder, which was put in at first, is selected as the slack node. If there is no net
feeder the node of that generator, which was put in at first, is choosen.
## Calculate Load Flow
The load flow program makes possible the calculation of the distribution of real and reactive power
flows, the losses in the network elements as well as in the whole network and the voltage at all
nodes.
In many cases it is not possible to find a solution of the load flow calculation for the given
conditions. In such case an error protocol will be given which indicates that the iteration was

cancelled. The user has to detect the physical incompabitlities in the given data systematically.
Possibilities are as follows:
**1.** Reducing of loads in the network
until a solution is possible (motors, loads, cables with load).
**2.** Changing of constant loads into impedance loads**.**
For larger loads the real part Ap and the reactive part Aq for real and reactive power should be set
to 100 %. This is equal to pure impedance loads. Afterwards a new load flow calculation has to be
made. If this calculation converges, the loads, which are too large, probably are situated at those
nodes with the smallest voltages.
**3.** Changing of PV- into PQ-nodes
This change is only possible for generators but not for net feeders. If necessary the net
The result of a load flow calculation consists of three parts:
- **Change of voltage per node**
Output of voltage at all nodes.
- **Load flow per element**
Output of the current in all branches of the network, the loading and the flow of real and reactive
power for every element.
- **Load flow statistic**
Output of those nodes with the highest and lowest voltage. For every kind of network element the
generated and consumed real and reactive power will be balanced.
In order to ensure that a practical solution was computed you should check the listings of results
refering to criteria as follows:
Typicals for different output listings, e.g. for the change of voltage per node etc., can be made by
means of sample-projects, which are scope of the software delivery. With the function 'Copy
Sample-Project' in the module *Elaplan-B* you can select one of the sample-projects and add it as
an actual project. You can print or display the different kinds of output listings and illustrate
yourself their differences and uses.
Normally the angle of voltage has a value between -20° and 0°.
The slack-voltage U<sub>Slack</sub> is located at the real axis by definition (in the example the
adequate node is SS1: angle θ = 0°).

In the listings the voltages at all other nodes are shown as scalar value of the node voltage and with
an angle between the voltage of the slack-node (real axis) and the relevant node voltage:
$$\tan\vartheta = \frac{U_{\text{IM}}}{U_{\text{RE}}} \qquad \vartheta =
\arctan\left(\frac{U_{\text{IM}}}{U_{\text{RE}}}\right) \qquad \left|U\right| =
\sqrt{U_{\text{RE}}^2 + U_{\text{IM}}^2}$$
For cables / wires the loading in [%] is the ratio of operating current to rated current (rated current
without consideration of reducing factors for accumulation and laying according VDE 298). For all
other elements the loading is computed as the ratio of operating apparent power to rated
apparent power. The operating apparent power is calculated according the formula
$S_{\text{operating}} = \sqrt{3} * U_{\text{operating}} * I_{\text{operating}}$.
Typicals for different output listings, e.g. for the load flow per element etc., can be made by means
of sample-projects, which are scope of the software delivery. With the function 'Copy
Sample-Project' in the module *Elaplan-B* you can select one of the sample-projects and add it as
an actual project. You can print or display the different kinds of output listings and illustrate
yourself their differences and uses.
Please note at all feeders, that the expected values for generators and net feeders will appear. You
should check whether the power would be transported through the network (note the sign in the
listings). Series losses ($P_{\text{SER}}$, $Q_{\text{SER}}$) between nodes of the network are
caused by the voltage drop, which occurs at the series impedance of the element. Transmission
lines are modelled as series impedances. Shunt losses ($P_{\text{SHUNT}}$, $Q_{\text{SHUNT}}$)
result from the voltage drop between a node and earth. Loads are pure shunt impedances.
Transmission lines with loads are modelled as $\pi$-equivalent. The sum of series losses and shunt
losses makes the **total losses** ($P_{\text{INT}}$, $Q_{\text{INT}}$) of the elements between
two nodes of the network.
**Calculation of the losses:**
> **Circuit Diagram Description:**
> The diagram shows a π-equivalent two-port transmission line model connecting node 1 (left) and
node 2 (right). At node 1, power flows $P_1$, $Q_1$ enter from the left via current $I_1$. At node
2, power flows $P_2$, $Q_2$ exit to the right via current $I_2$. The series branch between the two
nodes is represented by the admittance $Y_{12}$ (series admittance of the line). At node 1, a shunt
admittance $Y_{11}$ is connected between the node and earth (ground). At node 2, a shunt
admittance $Y_{22}$ is connected between the node and earth (ground). Node voltages $U_1$
(left) and $U_2$ (right) are indicated with downward arrows to ground. This π-equivalent circuit
models the transmission line with half of the total shunt capacitance/admittance placed at each
end, and the series impedance (represented as $Y_{12}$) in the middle branch.
$P_{\text{INT}}$ = $P_1 - P_2$ $\qquad Q_{\text{INT}}$ = $Q_1 - Q_2$

$S$ = $U * I^*$
$S_{\text{SHUNT}}$ = $(U_1)^2 * Y^*_{11} + (U_2)^2 * Y^*_{22}$
$P_{\text{SHUNT}}$ = $(U_1)^2 [\text{Re}(Y_{11}) + \text{Re}(Y_{22})]$
$Q_{\text{SHUNT}}$ = $-(U_2)^2 [\text{Im}(Y_{11}) + \text{Im}(Y_{22})]$
$P_{\text{SER}}$ = $P_{\text{INT}} - P_{\text{SHUNT}}$
$Q_{\text{SER}}$ = $Q_{\text{INT}} - Q_{\text{SHUNT}}$
The loading in % specifies the ratio of operating current to rated current.
Typicals for different output listings, e.g. for the load flow statistic etc., can be made by means of
sample-projects, which are scope of the software delivery. With the function 'Copy Sample-Project'
in the module *Elaplan-B* you can select one of the sample-projects and add it as an actual
project. You can print or display the different kinds of output listings and illustrate yourself their
differences and uses.
The load flow statistic is needed for verification of the accuracy of the calculation. If the sum of the
real power is not zero, the user must criticize whether the accuracy of the calculation is sufficient
enough. The user has to decide how many percent deviation in power related to the feeding power
is allowed.
If the deviation is too high, the limit of accuracy must be reduced. If the iteration will be cancelled,
the maximum number of iteration cycles must be increased. The load flow calculation will be
stopped, if the deviation in power at every node between the calculation steps n-1 and n is less
than the limit of accuracy. But it doesn't mean, that this is the real solution. It is possible, that the
calculation step n is far away from the real solution, although the deviation in power from
calculation step n-1 to n is less than the limit of accuracy.
## Selectivity
Protective devices in networks protect electrical elements against undue strain because of
short-circuit and overload.
Electrical elements are net feeders, transformers, lines, busbars, switchgear, loads and consumer
etc.
If there are any fault conditions failure should be limited to that element it concerns. If this comes
true

*Elaplan* calculates the relevant short-circuit currents at the location of the protective devices and
compares their tripping characteristics resp. their heat losses due to current (I²t-values) with each
other.
**Selectivity by current in case of approximately equal-sized short-circuit current levels at location
of protective devices**
If in the distribution network the length of lines between upstream and downstream protective
device are only small, the maximum short-circuit currents at the location of upstream and
downstream protective device are not different enough because of the less attenuation. In this
case a complete selectivity of the upstream protective device cannot be reached without time
delay of its high-set element.
For determination of selectivity *Elaplan* compares the tripping characteristics. In the field of the
overcurrent trip positive selectivity is usually given because of the high operating times. In the field
of the short-circuit trip positive selectivity only occurs, when the short-circuit current behind the
downstream protective device is smaller than the tripping current of the high-set element of the
upstream protective device. This current indicates the limit of selectivity.
**Selectivity by time**
Positive selectivity is obtained if the total clearing time of the downstream protective device is
shorter than the minimum command time of the upstream protective device. The total clearing
time of a protective device consists of following times, shown at the example of a circuit-breaker:
| | | |
|---|---|---|
| high-set element, | | appr. 5 ms |
| (minimum command time = time between begin of the fault | | |
| and the releasing of the spring energy store; | | |
| breaking process cannot be interrupted after forwarding of the command) | | |
| + | release of the locked spring energy store | appr. 5 ms |
| | -------------------------------------------- | |
| =
## Delete.]
*Short-circuit location*
Every short-circuit location, where a short-circuit shall be assumed for the check of selectivity, gets
a free definable designation of the SC location.
The short-circuit can occur at a busbar or at an element. The short-circuit location for short-circuit
at an element is determined unique by input of the node (busbar) and the designation of the
element.
The location of a short-circuit at a busbar is determined by input of the node.
## Example:
**246** *Appendices*
### *Data Acquisition: Sequence of Nominal Release*
The definition of a desired sequence is meaningful, if only a part of protective devices, e.g. a single
branch, shall be considered.
In intermeshed networks the desired sequence of release can be different according to the fault
location. In this case the definition of a sequence of release is meaningful also.
## Delete.]
*Sequence of nominal release*
The assumed short-circuit location is assigned to the stated check number. Starting with this
short-circuit location you arrange the protective devices in that sequence they shall release. The
protective device stated in the field 'PD-nominal release 1' shall release at first and that one stated
in field 10 at last.
In the program you can select, whether you want to check all protective devices or the protective
devices according sequence.
# Calculation of Selectivity
Before starting the calculation of selectivity some conditions can be defined, which influence the
way of calculation. The choices and their consequences will be described in this section.
> **[Screenshot description: A software dialog window titled "Calculation of selectivity - Elaplan®".
The window contains the following interface elements:**
> - **Menu bar with: Edit, (options), F1 Info**
> - **A highlighted green section labeled "Check of selectivity" containing:**
> - All protective devices = 1
> - PD according sequence = 2
> - Determin. of breaking time = 3
> - A numeric input field showing value **1**
> - **To the right, two options:**
> - To show results (Y/N) - with input field showing **J**

> - Stop after each branch(Y/N) - with input field showing **J**
> - **A second highlighted green section labeled "Num. of protective devices per branch"** with
an input field showing value **10**
> - **Bottom buttons: F1 Help | F2 Apply | F3 Quit**]
*Calculation of selectivity*
With selecting „1" in the first input area you specify, that a check of selectivity will be done for all
recorded protective devices.
In this mode of calculation the program determines all branches of the network with protective
devices and the nominal sequence of release related to the respective short-circuit location. That
protective device, which is nearby the short-circuit location, gets rank 1 (highest rank), the next
gets rank 2 etc. This procedure will be repeated in every branch up to the end node (net feeder,
asynchronous motor, generator or end of lines). For checking selectivity the number of protective
devices, located one behind the other in a branch of the network, can be limited.
With selecting „2" in the first input area you specify, that only those protective devices should be
calculated, which were selected in the program 'Sequence of nominal release'. You can limit the
number of protective devices, located one behind the other in a branch of the network, in this
mode also. If a branch of a network was defined with e.g. 6 protective devices and the calculation
was limited to 3 protective devices, only those 3 protective devices with the highest rank will be
considered.
With selecting „3" in the first input area you specify, that only the tripping times of the defined
protective devices will be calculated. The program will not check the selectivity. This mode is
meaningful in intermeshed networks, since sometimes a positive selectivity is not possible.
The results of every check can be shown on the screen during calculation. Input a "Y" in the area
'To show results'.
If you select a stop after the calculation of each branch, the computation will be halted and the
results keep displayed on the screen. The computation will be continued with the Enter key.
The program determines the minimum and
**248** *Appendices*
## (legend).
## List of Abbrevations and Symbols
| Symbol | Description |
|---|---|
| cos φ | Power factor |
| C_Operat. [μF] | Operating capacity [Microfarad] |
| C_Earth [mF] | Capacity to earth [Microfarad] |
| ETA | Efficiency |
| f [Hz] | Frequency [Hertz] |
| $f_C$ [Hz] | Equivalent frequency [Hertz] |
| Fakt$_1$ | Safety margin for the calculation of the short-circuit peak current (high-voltage) |
| Fakt$_2$ | Safety margin for the calculation of the short-circuit peak current (low-voltage) |
| Faktor c | Factor for voltage |
| $i_p$ [A] | short-circuit peak current [Ampere] |
| I²t-Wert [A²s] | heat losses due to current (I²t-values) [Ampere² second] |
| $I_a$ [A] | Breaking current [Ampere] |
$I_{an}$ [A] - Motor starting current [Ampere]
$I_{bi}$ [A] - Setting rangeof overload release [Ampere]
$I_e$ [A] - Setting current of overload release [Ampere]
$I_E$ [A] - Earth fault current [Ampere]
$I_k$ [A] - Continuous short-circuit current [Ampere]

$I_{ks}$ [A] - Setting range of high-set element [Ampere]
$I''_k$ [A] - Sub-transient short-circuit current [Ampere]
$I''_{k1\text{max}}$ [A] - Maximum 1-phase sub-transient short-circuit current [Ampere]
$I''_{k1\text{min}}$ [A] - Minimum 1-phase sub-transient short-circuit current [Ampere]
$I''_{k2e\text{max}}$ [A] - Maximum 2-phase sub-transient short-circuit current with ground touch
[Ampere]
$I''_{k2e\text{min}}$ [A] - Minimum 2-phase sub-transient short-circuit current with ground touch
[Ampere]
$I''_{k2\text{max}}$ [A] - Maximum 2-phase sub-transient short-circuit current [Ampere]
$I''_{k2\text{min}}$ [A] - Minimum 2-phase sub-transient short-circuit current [Ampere]
$I''_{k3\text{max}}$ [A] - Maximum 3-phase sub-transient short-circuit current [Ampere]
$I''_{k3\text{min}}$ [A] - Minimum 3-phase sub-transient short-circuit current [Ampere]
$I''_{k\text{max}}$ [A] - Maximum sub-transient short-circuit current [Ampere]
$I''_{k\text{min}}$ [A] - Minimum sub-transient short-circuit current [Ampere]
$I''_{k\_\text{generator}}$ [A] - Sub-transient short-circuit current of a generator [Ampere]
$I_m$ [A] - Setting current of the high-set element [Ampere]
$I_n$ [Ampere] - Nominal current [Ampere]
$I_r$ [A] - Rated current [Ampere]
$I_{rM}$ [A] - Rated current of a motor [Ampere]
$I_{r\_\text{generator}}$ [A] - Rated current of a generator [Ampere]
$I_S$ [A] - short-circuit peak current [Ampere]
$\ae$ - Factor for calculation of short-circuit peak current
$\lambda_{\text{max}}$ - Factor for calculation of maximum continuous short-circuit current
$\lambda_{\text{min}}$ - Factor for calculation of minimum continuous short-circuit current
$\mu$ - Factor for calculation of breaking current
$P_{krT}$ [W] - Load losses [Watt]
$P_n$ [W] - Nominal power [Watt]
$P_{rG}$ [W] - Rated power of a generator [Watt]
$P_{rM}$ [W] - Rated power of a motor [Watt]
$R$ [$\Omega$] - Ohmic resistance [Ohm]
$R_{(0)}$ [$\Omega$] - Ohmic resistance in the zero sequence system [Ohm]
$R_{(1)}$ [$\Omega$] - Ohmic resistance in the positive sequence system [Ohm]
$R_C$ [$\Omega$] - Ohmic resistance at equivalent frequency [Ohm]
$R_E$ [$\Omega$] - Ohmic resistance of earthing [Ohm]
$R_G$ [$\Omega$] - Ohmic series resistance [Ohm]
$R_{k(0)}$ [$\Omega$] - Ohmic short-circuit zero sequence impedance at earthing of one side
[Ohm]

$R_{k12}$ [$\Omega$] - Ohmic short-circuit zero sequence impedance at earthing of both sides
[Ohm]
$R_{k21}$ [$\Omega$] - Ohmic short-circuit zero sequence impedance at earthing of both sides
[Ohm]
$R_{L(0)}$ [$\Omega$] - Ohmic no-load zero sequence impedance [Ohm]
$S''_k$ [VA] - Sub-transient short-circuit power [Voltampere]
$S_r$ [VA] - Rated power [Voltampere]
$S_{rG}$ [VA] - Rated power of a generator [Voltampere]
$S_{rT}$ [VA] - Rated power of a transformer [Voltampere]
$t_a$ [s] - tripping time [Seconds]
$t_{\text{min}}$ [s] - minimum switching time lag [Seconds]
$t_v$ [s] - Time delay [Seconds]
$u_{kr}$ [%] - Impedance voltage [Percent]
$U_{KL}$ [V] - Terminal voltage [Volt]
$U_n$ [V] - Nominal voltage [Volt]
$U_{n\,\text{KnotenAusg.}}$ [V] - Nominal voltage at output node [Volt]
$U_{n\,\text{KnotenEing.}}$ [V] - Nominal voltage at input node [Volt]
**250** *Appendices*
$U_r$ [V] - Rated Voltage [Volt]
$U_{rG}$ [V] - Rated Voltage of a generator [Volt]
$U_{rM}$ [V] - Rated Voltage of a motor [Volt]
$U_{rT}$ [V] - Rated Voltage of a transformer Volt
$x_{(0)}$ [%] - Reactance in the zero sequence system [Percent]
$x_{(2)}$ [%] - Reactance in the negative sequence system [Percent]
$x''_d$ [%] - Sub-transient reactance in direct axis [Percent]
$x_d$ [%] - Generator reactance in driect axis, saturated [Percent]
$x_{d\_gesättigt}$ [%] - Reciprocal value of the saturated no-load/short-circuit ratio [Percent]
$X$ [$\Omega$] - Reactance [Ohm]
$X_{(0)}$ [$\Omega$] - Reactance in the zero sequence system [Ohm]
$X_{(1)}$ [$\Omega$] - Reactance in the positive sequence system [Ohm]
$X_{(2)}$ [$\Omega$] - Reactance in the negative sequence system [Ohm]
$X_C$ [$\Omega$] - Reactance at eqivalent frequency [Ohm]
$X''_d$ [$\Omega$] - Generator sub-transient reactance in direct axis [Ohm]
$X_E$ [$\Omega$] - Reactance of earthing [Ohm]
$X_{k(0)}$ [$\Omega$] - Short-circuit zero sequence reactance at earthing of one side [Ohm]
$X_{k12}$ [$\Omega$] - Short-circuit zero sequence reactance at earthing of both sides [Ohm]
$X_{k21}$ [$\Omega$] - Short-circuit zero sequence reactance at earthing of both sides [Ohm]
$X_{L(0)}$ [$\Omega$] - No-load zero sequence reactance at earthing of one side Ohm]

# 2
# The KUBS plus Program
The KUBS plus program is suited for the calculation of three-pole, single-pole and peak short circuit
currents in low voltage radial networks. It can determine the backup protection, the selectivity and
the voltage drop, and the permissible current loading of cables and conductors, as well as
dimension circuit breakers. The program can process up to 250 outgoing electric circuits in any
arbitrary arrangement of radial networks. In each outgoing electric circuit it is possible to choose
the types of conductor (cables, bus bars and overland lines) and the conductor material (copper
and aluminum). The high voltage can assume values of up to 100 kV. The characteristic data for
transformers can be entered as user values or the values for standard transformers can be used.
The program can also calculate with several (up to 10) transformers connected to a bus bar. The
input data (transformer, medium voltage network or known $I''_{1kmin}$ as well as rated currents
for the individual outgoing electric circuits are entered. The program selects the cross-section and
calculates the impedances of this cross-section as well as the short circuit currents.
The program divides the network calculation (Figure 1) into network network feeder and network
distribution. To the network feeder belong several transformers or defined input positions.
Immediately thereafter follow a cable connection and then a circuit breaker with its cable or bus
bar connection. The common input position is represented as a bus bar and has no impedance.
**Installation/system requirements**
System requirements
## Hardware:
- IBM-compatible PC AT 80486 with 8 MByte RAM or higher
- VGA graphics card
- CD-ROM drive
- Minimum 3 MByte available hard disk storage
- Printer: HP Laserjet or similar type, HP Deskjet or similar type, Kyocera laser printer or compatible
Note: The program does **not** support mouse control.
System software: Windows 95 or higher, Windows NT 4.0
Installation under Windows
- Start Windows
- Insert CD-ROM in drive
Network power supply
> **[Diagram Description: Single-line electrical network diagram titled "Network power supply"
illustrating the design of a power distribution network and its calculation procedure. The diagram

shows the following hierarchy from top to bottom:**
>
> - **High Voltage Level:** Three network infeed points, each represented by a transformer
symbol (T) fed from a high-voltage grid source labeled $S_{kQ}$ (short-circuit power of the supply
network), shown as hatched box symbols. Each transformer is characterized by its rated apparent
power $S_{rT}$ and short-circuit voltage $u_{kr}$. Additionally, on the far right, a three-phase
generator (labeled $3^G$) with rated voltage $U_{rG}$ is connected at the high-voltage level.
>
> - **Low Voltage Level:** The secondary sides of the transformers step down to the low voltage
level, separated by a dashed boundary line indicating the HV/LV interface.
>
> - **Main Distribution Panel:** A main busbar connects the outputs of the three transformers and
the generator. Each connection point is labeled with nominal voltage $U_n$. Circuit breakers
(indicated by ×) are shown on each feeder.
>
> - **Subdistribution Panel (first level):** Fed from the main distribution panel via circuit breakers,
a first subdistribution busbar distributes power to further branches.
>
> - **Subdistribution Panel (second level):** A second-level subdistribution panel is fed from the
first, again through circuit-breaker-protected feeders.
>
> - **Distributions (final level):** Multiple final distribution circuits (six shown) are fed from the
second subdistribution panel through individual circuit breakers, with arrows indicating
loads/consumers at the end of each branch.
>
> The diagram represents a radial/meshed low-voltage distribution network topology used for
short-circuit and load-flow calculations in the KUBS plus software.]
**Fig. 1:** Design of a network and calculation procedure
- Call File Manager and start the required file WININST.EXE from CD-ROM
- The required hard disk memory capacity is shown and the directories
## C:\KUBSPLUS
and
## C:\KUBSPLUS\FILES
are generated. Confirm all following windows with < OK >.
- Important: For installing under Windows 95, after unpacking the files (Decompressing Archive)
you must close the window in which unpacking takes place
- The Kubs Setup program is started from the installation program. You can then start KUBS plus.
**Setup**

The Setup is called automatically following installation. It can also be called from the main menu of
KUBS plus. The dialog language for the Setup program is English. With the Setup, presettings are
defined; in the Setup program the dialog language for the main program in KUBS plus can be
selected:
A selection menu showing the available printer drivers is displayed on the monitor screen. Select
your printer or a similar one.
*Note*: Most printers have the possibility to select an emulation. This makes it possible to emulate
a printer which can be operated with one of the printer drivers offered.
KUBS plus could, for example, determine a conductor of 3x240 mm$^2$ for a current of 20 A. In
practice, this of course makes little sense, because the conductor - while it would be adequately
dimensioned - would presumably be too expensive. In order to prevent this, in the Setup program
there is the possibility to enter two overdimensioning factors: "Minumum and Maximum". For each
current which you will enter later, KUBS plus then determines only conductors for which the
permissible current lies within the limits defined by "Minimum and Maximum".
*Attention:* A tolerance results in very few (or no) selection possibilities; a large tolerance could
lead to a very large selection list.
The check of the contact voltage can be switched on or off.
**Using KUBS plus**
To start the program from the MS-DOS level type in *KUBS*. To start from Windows, double click
on the icon. To start from the Windows file manager, double click on *Kubsplus.pif*.
The following regulations are included
> **[Flowchart - Overview of the Main Menu of the KUBS plus Program]**
>
> The diagram is a hierarchical flowchart depicting the navigation structure of the KUBS plus
software's Main Menu. The chart has the following structure:
>
> **Top Level:**
> - Two shaded boxes at the top: **Main menu** (left) and **End** (right), connected
bidirectionally via the **Setup** branch.
>
> **Second Level (branches from Main menu):**
> 1. **Start new project**
> 2. **Read project**
> 3. **$I_Z$ calculation**
> 4. **Setup**

>
> **Branch 1 - Start new project:**
> - → **Power feed with transformers**
> - → **Data for:**
> - Medium voltage
> - Low voltage
> - Transformers
> - → **1st electric circuit without switches** ← (feedback loop from "2nd electric circuit", labeled
*via transformer*)
> - → **2nd electric circuit - switches obligatory** (with loop back to 1st electric circuit via
transformer)
> - → **Common power input point**
>
> **Branch 2 - Read project:**
> - → **Power feed with known short circuit**
> - → **Data for short circuit current**
> - → (merges into) **1st electric circuit without switches**
>
> **Branch 3 - $I_Z$ calculation:**
> - → **Cable cross section**
> - → **Result - Back to the main menu**
>
> **Branch 4 - Setup:**
> - → **Dialog language**
> - → **Printer driver**
> - → **Reserve overdimensioning**
> - → **Consideration of touch voltage**
> - → **Back to main menu** → (returns to **End**)
**Fig. 2:** Overview of the Main menu
> **[Diagram: Hierarchical flowchart titled "Overview of the Project menu" - Fig. 3]**
>
> The diagram is a top-down hierarchical menu structure flowchart for the KUBS plus software. At
the top level, there are two root nodes: **"Project menu"** (left) and **"Close main menu"**
(right), connected by a bidirectional vertical arrow on the right side.
>
> From **"Project menu"**, five sub-menu branches descend:
> - **Further** → leads to: **"Distribution (with and without) breaker, back to the main menu"**
> - **Branch** (no further sub-items shown)
> - **Correction** → leads to: **"- Go to / - Page / Back to the main menu"**
> - **Display** → leads to two options: **"Screen / Back to the main menu"** and **"Printer /

Back to the main menu"**
> - **Output** → leads to two sub-items: **"Input data"** and **"Network data"**
>
> From **"Store / Back to the main menu"** (connected to "Close main menu") no further
branches are shown.
>
> From **"Input data"** and **"Network data"**, a further level branches into:
> - **Transformer**
> - **Conductor**
> - **Change** → leads to: **"Pass through following electrical circuits for checking / Back to the
main menu"**
> - **Insert** (with sub-options: - before / - after)
> - **Delete**
**Fig. 3:** Overview of the Project menu
**Calculating Example 7 with KUBS plus**
Example 7 was worked out with the KUBS plus program (Figure 4) and with a pocket calculator and
the results compared. The results of the two procedures are in full agreement. The following
remarks are relevant here:
- Manual calculation (with pocket calculator)
- The impedances of the circuit (outgoing and return lines) are added under operational conditions
- The zero-sequence impedances of the cable and the conductor are not considered here
- The zero-sequence impedance of the transformer is also not considered
- Calculation with KUBS plus
- The impedances are added vectorially
- The zero-sequence impedances of the cable, conductor and transformer are taken into account
*General project data:*
Network form: TN-C-S system
N distributed?: yes
$U_L$ for: 50 V
## Voltage: 400 V
*Medium voltage network:*

Voltage: 20.0 kV
Short-circuit power: 250 MVA
## Frequency: 50 Hz
R: 0.0070 $m\Omega$
X: 0.070 $m\Omega$
*Feed-in to low voltage network: Transformer:*
Power: 630 kVA
Nominal current: 909 A
$u_z$: 6 %
$u_r$: 1.10 %
Short circuit losses: 7 kW
$u_x$: 5.90 %
Connection symbol: Dy
R: 2.7937 $m\Omega$
X: 14.9898 $m\Omega$
*Transformer 1:*
Transformer terminals → Protection equipment
**Branch a: Branch A → (1,1)**
| | | | |
|---|---|---|---|
| I | : 100 A | $I_{kmax1p}$ | : 14.54 kA |
| $I_z$ | : 129 A | $I_{kmin1p}$ | : 12.33 kA |
| Breaker | : None | $I_{k3p}$ | : 14.24 kA |
| | : | $i_p$ | : 30.41 kA |
| $\cos\varphi$ | : 0.90 | | |
| du | : 0.04% | R: 0.79m$\Omega$ &nbsp;&nbsp; X: 0.12m$\Omega$ | |
| dutot | : 0.04% | $R_i$: 0.79m$\Omega$ &nbsp;&nbsp; $X_i$: 0.12m$\Omega$ | |
**Bus bars**
| | | | |
|---|---|---|---|
| Material | : Cu | Ambient temperature | : 25 °C |
| Treatment | : Blank | Temperature of conductor | : 65 °C |
Main conductor : $3 \times 1 \times 12 \times 2 \ mm^2$
PE : $1 \times 12 \times 2 \ mm^2$
N cross-section : $1 \times 12 \times 2 \ mm^2$
Length [m] : 1.00 m

*Protection equipment → Starting point of network*
**Branch 1A: Branch 1A → (1,3)**
| | | | |
|---|---|---|---|
| $I$ | : 100 A | $I_{kmax1p}$ | : 2.17 kA |
| $I_z$ | : 100 A | $I_{kmin1p}$ | : 0.88 kA |
| *Breaker* | : 3VF32116DS7 | $I_{k3p}$ | : 2.17 kA |
| | : | $i_p$ | : 3.13 kA |
| $cos\ \varphi$ | : 0.90 | | |
| *du* | : 4.68% | R: 96.50 m$\Omega$ &nbsp; X: 20.75 m$\Omega$ | |
| *dutot* | : 4.72% | $R_t$: 97.29 m$\Omega$ &nbsp; $X_t$: 20.87 m$\Omega$ | |
| *Cables* | : | | |
| *Material* | : Cu | *Ambient temperature* | : 25 °C |
| *Insulation* | : PV | *Type* | : multi-strand |
| *Armouring* | : without | *Number of cable systems* | : 1 |
| *Installation* | : C | | : |
| *Cable type* | : NYY | $I_r$ | : 100-160 A |
| *Main conductor* | : $3 \times 1 \times 150 \ mm^2$ | | |
| PE | : $1 \times 50 \ mm^2$ | $I_i$ | : 150-2400 A |
| *N cross-section* | : $1 \times 50 \ mm^2$ | $I_{cu}$ (400V) | : 70 kA |
| *Length [m]* | : 250.00 m | | |
| | | *Sel. (i)* | |
| | | *Sel. (t)* | |
| | | *Backup* | not required |
| | | *Correction factor* | |
**Remarks**
*Branch in order*
*Network data:*
**Branch2: Branch 2A → (1,5)**
| | | | |
|---|---|---|---|
| $I$ | : 16 A | $I_{kmax1p}$ | : 0.33 kA |
| $I_z$ | : 24 A | | : |
| *Breaker* | : | $I_{k3p}$ | : 14.24 kA |
| $cos\varphi$ | : 0.90 | | : |
| *du* | : 1.83% | R: 255.36 m$\Omega$ &nbsp; X: 3.74 m$\Omega$ | |
| *dutot* | : 6.54% | $R_t$: 355.44 m$\Omega$ &nbsp; $X_t$: 39.59 m$\Omega$ | |
| *Cables* | : | | |
| *Material* | : Cu | *Ambient temperature* | : 25 °C |
| *Insulation* | : PV | *Type* | : multi-strand |
| *Armouring* | : without | *Number of cable systems* | : 1 |

*Installation* : B $\qquad\qquad$ $I_r$ :
*Cable type* : NYM
*Main conductor* : $1 \times 1 \times 2.5 \ mm^2$ $\qquad\qquad$ $I_r$ : *0 A*
*PE* : $1 \times 2.5 \ mm^2$
*N cross-section* : $1 \times 2.5 \ mm^2$ $\qquad\qquad$ $I_{cu}$ *(400 V)* :
*Length [m]* : 35.00 m
$\qquad\qquad\qquad\qquad\qquad$ *Sel. (i)* $\qquad$ *Sel. (t)*
$\qquad\qquad\qquad\qquad\qquad$ *Backup* $\qquad$ not required
$\qquad\qquad\qquad\qquad\qquad$ *Correction factor* $\quad$ 1.00
**Remarks**
Branch in order
**Branch 3A: Branch 3A → (2,5)**
*I* : 7 A $\qquad\qquad\qquad$ $I_{kmax1p}$ : 0.41 kA
*$I_z$* : 17 A $\qquad\qquad\qquad$ $I_{kmin1p}$ : 0.31 kA
*Breaker* : $\qquad\qquad\qquad\qquad$ :
*cos φ* : 0.90 $\qquad\qquad\qquad\qquad$ :
*du* : 0.57% $\qquad\qquad$ R: $182.40 m\Omega$ X: $1.60 m\Omega$
*dutot* : 5.29% $\qquad\qquad$ $R_i$: $282.48 m\Omega$ $X_i$: $37.45 m\Omega$
*bf cables* :
*Material* : Cu $\qquad\qquad$ *Ambient temperature* : 30 °C
*Insulation* : PV $\qquad\qquad$ *Type* : Multi-strand
*Armouring* : without $\qquad$ *Number of cable systems* : 1
*Installation* : C $\qquad\qquad\qquad\qquad$ :
*Cable type* : NYM $\qquad\qquad$ $I_r$ :
*Main conductor* : $1 \times 1 \times 1.5 \ mm^2$
*PE* : $1 \times 1.5 \ mm^2$ $\qquad\qquad$ $I_i$
*N cross-section* : $1 \times 1.5 \ mm^2$ $\qquad$ $I_{cu}$ *(400 V)*
*Length [m]* : 15.00 m
$\qquad\qquad\qquad\qquad\qquad$ *Sel. (i) Sel. (t)*
$\qquad\qquad\qquad\qquad\qquad$ *Backup* $\qquad$ not required
$\qquad\qquad\qquad\qquad\qquad$ *Correction factor* $\quad$ 1.00
**Remarks**
Branch in order

> - Ikmax: 0.4 kA
> - Ikmin: 0.3 kA
> - Ik3p: 0.0 kA
> - Terminates at node **3**
**Fig. 4:** Diagram of example and results
## Preparations for the short circuit current calculation
- Program (e.g. KUBS plus)
- Form sheets
- System forms in low voltage range in accordance with IEC 60 364, Part 30
- Purpose of calculating short circuit currents:
- Breaking conditions
- Selecting bus bars
- Breaking capacity of overcurrent protection equipment
- Settings for overcurrent protection equipment
- Network conditions:
- High voltage and low voltage motors
- Block or distribution transformers
- External inputs ($S''_{kQ}$)
- Special properties of network and operational equipment:
- Asynchronous motors
- Transformers
- Types of short circuit currents:
- Largest short circuit current
- Smallest short circuit current
- Peak short circuit current
- Two-pole short circuit current with or without contact to ground
- Double ground fault
- Required short circuit currents:
- Largest short circuit current
- Smallest short circuit current

- Required component systems:
- Positive-sequence impedance
- Negative-sequence impedance
- Zero-sequence impedance
- Voltage sources:
- Network power feeder
- Motor feeder
- Generator feed-ins
- Network type:
- Short circuit with simple input
- Short circuit with several simple inputs
- Short circuit in meshed network
- Method of calculation to be used:
- Equivalent voltage source
# Index
***a***
asynchronous machine 71, 101, 105
impedance 106
***b***
batteries 147
breaking current 127
***c***
cables and overhead lines 58
calculation tools 197
capacitors 148
circuit breakers 112, 132
computer programs 151
current converters 146
current limiting 70
cut-off energy 131
***d***
DC aperiodic component 2, 3, 49
DC motors 149
DC systems 143
disconnectors 112

***e***
equivalent circuit diagrams 36
equivalent electrical circuit 2
equivalent voltage source 2, 7
***f***
fault currents, calculation 31
fuses 112
***g***
ground fault tripping 132
ground loop impedance 30
***h***
HH fuses 131
***i***
## IEC 60 909 11, 12
impedance corrections 75, 193
generators 76
power plant block 77
transformers 79
impedances
asynchronous machines 71
capacitors 72
network feed-ins 47
non-rotating loads 72
static converters 73
synchronous machines 49
transformers 51
insulation, heat transfer 119
***l***
load-break switches 112
load interrupter switches 112
***m***
making current 127
mesh diagram 4
meshed networks 19
***n***
networks
grounding compensation 43
isolated free neutral point 42
low impedance neutral point 44
network types 21

low voltage 21
medium voltage 23
neutral conductor 30
neutral point, arrangement 45
neutral point treatment 39
***o***
operational equipment 189
**262** *Index*
overcurrent protection 131
overcurrent protective equipment 34
overloading 131
overload tripping 132
*p*
PEN conductor 29
power generator 143
protective functions 132
protective ground conductor 30
*r*
radial networks 18, 153
## RCD 34
reference variables 10
ring networks 18
*s*
short circuit 1, 91
&nbsp;&nbsp;&nbsp;&nbsp;asynchronous motors 105
## &nbsp;&nbsp;&nbsp;&nbsp;calculation 7, 127
## &nbsp;&nbsp;&nbsp;&nbsp;far-from-generator 5
## &nbsp;&nbsp;&nbsp;&nbsp;impedance 2
&nbsp;&nbsp;&nbsp;&nbsp;low voltage switchgear 128
## &nbsp;&nbsp;&nbsp;&nbsp;mechanical 111
## &nbsp;&nbsp;&nbsp;&nbsp;near-to-generator 2, 3, 6
&nbsp;&nbsp;&nbsp;&nbsp;negative-sequence impedance 2
&nbsp;&nbsp;&nbsp;&nbsp;positive-sequence impedance 2
&nbsp;&nbsp;&nbsp;&nbsp;positive-sequence system 4
## &nbsp;&nbsp;&nbsp;&nbsp;single-pole 6, 7, 94
&nbsp;&nbsp;&nbsp;&nbsp;symmetrical breaking current 99

## &nbsp;&nbsp;&nbsp;&nbsp;thermal 111, 112
&nbsp;&nbsp;&nbsp;&nbsp;three-phase networks 6
## &nbsp;&nbsp;&nbsp;&nbsp;three-pole 4, 6, 7, 91
## &nbsp;&nbsp;&nbsp;&nbsp;two-pole 6, 7, 93
## &nbsp;&nbsp;&nbsp;&nbsp;types 5
&nbsp;&nbsp;&nbsp;&nbsp;zero-sequence impedance 2
short circuit current 1
## &nbsp;&nbsp;&nbsp;&nbsp;calculation 21, 151, 153
initial symmetrical 1, 3
limitation 120
peak 2, 3, 97
self-quenching 42
steady state 2, 102
symmetrical breaking current 2
time behavior 3
short-time current 127
short-time delay release 132
single source 17
software programs
&nbsp;&nbsp;&nbsp;&nbsp;Elaplan 199
&nbsp;&nbsp;&nbsp;&nbsp;KUBS plus 251
steady-state condition 9
step voltages 40
superposition method 2, 9
supply networks 17
surge arrester 191
symmetrical components 81, 82
## &nbsp;&nbsp;&nbsp;&nbsp;impedances 85
synchronous machines 49, 99
systems
&nbsp;&nbsp;&nbsp;&nbsp;IT 35
&nbsp;&nbsp;&nbsp;&nbsp;TN 29
&nbsp;&nbsp;&nbsp;&nbsp;TT 34
*t*
three-phase networks 39
three-phase synchronous generator 143
touch voltage 39
transformation ratio 57
transient method 10
*u*

undelayed release 132
*v*
voltage factor 2, 8
voltage regulating transformers 57
