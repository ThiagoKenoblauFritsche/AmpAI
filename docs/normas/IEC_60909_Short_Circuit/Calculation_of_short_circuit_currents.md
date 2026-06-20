# Cahier Technique no. 158 — Calculation of short-circuit currents

> **Schneider Electric — Collection Technique (ECT 158), updated September 2005.**
> Authors: Benoît de Metz-Noblat, Frédéric Dumas, Christophe Poulain (Schneider Electric, Electrical Networks competency group).
>
> Secondary reference aligned with **IEC 60909**. This cleaned text removes repetitive page footers, page-break markers and broken image placeholders, and trims publisher front-matter (marketing/disclaimer). Technical wording is preserved verbatim.

## Lexicon

**Abbreviations**

| | |
|---|---|
| BC | Breaking capacity. |
| MLVS | Main low voltage switchboard. |

**Symbols**

| | |
|---|---|
| A | Cross-sectional area of conductors. |
| α | Angle between the initiation of the fault and zero voltage. |
| c | Voltage factor. |
| cos φ | Power factor (in the absence of harmonics). |
| e | Instantaneous electromotive force. |
| E | Electromotive force (rms value). |
| φ | Phase angle (current with respect to voltage). |
| i | Instantaneous current. |
| i<sub>ac</sub> | Alternating sinusoidal component of the instantaneous current. |
| i<sub>dc</sub> | Aperiodic component of the instantaneous current. |
| i<sub>p</sub> | Maximum current (first peak of the fault current). |
| I | Current (rms value). |
| I<sub>b</sub> | Short-circuit breaking current (IEC 60909). |
| I<sub>k</sub> | Steady-state short-circuit current (IEC 60909). |
| I<sub>k</sub>" | Initial symmetrical short-circuit current (IEC 60909). |
| Ir | Rated current of a generator. |
| Is | Design current. |
| Isc | Steady-state short-circuit current (Isc3 = three-phase, Isc2 = phase-to-phase, etc.). |
| λ | Factor depending on the saturation inductance of a generator. |
| k | Correction factor (NF C 15-105). |
| K | Correction factor for impedance (IEC 60909). |
| κ | Factor for calculation of the peak short-circuit current. |
| Ra | Equivalent resistance of the upstream network. |
| R<sub>L</sub> | Line resistance per unit length. |
| Sn | Transformer kVA rating. |
| Scc | Short-circuit power. |
| t<sub>min</sub> | Minimum dead time for short-circuit development, often equal to the time delay of a circuit breaker. |
| u | Instantaneous voltage. |
| u<sub>sc</sub> | Transformer short-circuit voltage in %. |
| U | Network phase-to-phase voltage with no load. |
| Un | Network nominal voltage with load. |
| x | Reactance, in %, of rotating machines. |
| Xa | Equivalent reactance of the upstream network. |
| X<sub>L</sub> | Line reactance per unit length. |
| X<sub>subt</sub> | Subtransient reactance of a generator. |
| Z<sub>(1)</sub> | Positive-sequence impedance - of a network or an element. |
| Z<sub>(2)</sub> | Negative-sequence impedance - of a network or an element. |
| Z<sub>(0)</sub> | Zero-sequence impedance - of a network or an element. |
| Z<sub>L</sub> | Line impedance. |
| Zsc | Network upstream impedance for a three-phase fault. |
| Zup | Equivalent impedance of the upstream network. |

**Subscripts**

| | |
|---|---|
| G | Generator. |
| k or k3 | 3-phase short circuit. |
| k1 | Phase-to-earth or phase-to-neutral short circuit. |
| k2 | Phase-to-phase short circuit. |
| k2E / kE2E | Phase-to-phase-to-earth short circuit. |
| S | Generator set with on-load tap changer. |
| SO | Generator set without on-load tap changer. |
| T | Transformer. |

# Calculation of short-circuit currents

In view of sizing an electrical installation and the required equipment, as well as determining the means required for the protection of life and property, short-circuit currents must be calculated for every point in the network.

This "Cahier Technique" reviews the calculation methods for short-circuit currents as laid down by standards such as IEC 60909. It is intended for radial and meshed low-voltage (LV) and high-voltage (HV) circuits.

The aim is to provide a further understanding of the calculation methods, essential when determining short-circuit currents, even when computerised methods are employed.

## Summary

| | | |
|---|---|---|
| **1 Introduction** | | **p. 4** |
| | 1.1 The main types of short-circuits | p. 5 |
| | 1.2 Development of the short-circuit current | p. 7 |
| | 1.3 Standardised Isc calculations | p. 10 |
| | 1.4 Methods presented in this document | p. 11 |
| | 1.5 Basic assumptions | p. 11 |
| **2 Calculation of Isc by the impedance method** | 2.1 Isc depending on the different types of short-circuit | **p. 12** |
| | 2.2 Determining the various short-circuit impedances | p. 13 |
| | 2.3 Relationships between impedances at the different voltage levels in an installation | p. 18 |
| | 2.4 Calculation example | p. 19 |
| **3 Calculation of Isc values in a radial network using symmetrical components** | 3.1 Advantages of this method | **p. 23** |
| | 3.2 Symmetrical components | p. 23 |
| | 3.3 Calculation as defined by IEC 60909 | p. 24 |
| | 3.4 Equations for the various currents | p. 27 |
| | 3.5 Examples of short-circuit current calculations | p. 28 |
| **4 Conclusion** | | **p. 32** |
| **Bibliography** | | **p. 32** |

# 1 Introduction

Electrical installations almost always require protection against short-circuits wherever there is an electrical discontinuity. This most often corresponds to points where there is a change in conductor cross-section. The short-circuit current must be calculated at each level in the installation in view of determining the characteristics of the equipment required to withstand or break the fault current.

The flow chart in **Figure 1** indicates the procedure for determining the various short-circuit currents and the resulting parameters for the different protection devices of a low-voltage installation.

In order to correctly select and adjust the protection devices, the graphs in **Figures 2, 3** and **4** are used. Two values of the short-circuit current must be evaluated:

■ The maximum short-circuit current, used to determine

□ The breaking capacity of the circuit breakers

□ The making capacity of the circuit breakers

□ The electrodynamic withstand capacity of the wiring system and switchgear

The maximum short-circuit current corresponds to a short-circuit in the immediate vicinity of the downstream terminals of the protection device. It must be calculated accurately and used with a safety margin.

■ The minimum short-circuit current, essential when selecting the time-current curve for circuit breakers and fuses, in particular when

*Fig. 1 : Short-circuit (Isc) calculation procedure when designing a low-voltage electrical installation (ST = short time; Inst. = instantaneous)*

- Cables are long and/or the source impedance is relatively high (generators, UPSs)
- Protection of life depends on circuit breaker or fuse operation, essentially the case for TN and IT electrical systems

Note that the minimum short-circuit current corresponds to a short-circuit at the end of the protected line, generally phase-to-earth for LV and phase-to-phase for HV (neutral not distributed), under the least severe operating conditions (fault at the end of a feeder and not just downstream from a protection device, one transformer in service when two can be connected, etc.).

Note also that whatever the case, for whatever type of short-circuit current (minimum or maximum), the protection device must clear the short-circuit within a time $t_c$ that is compatible with the thermal stresses that can be withstood by the protected cable:

$$\int i^2 \, dt \leqslant k^2 A^2 \text{ (see Fig. 2, 3, and 4)}$$

*Fig. 2 : The $I^2t$ characteristics of a conductor depending on the ambient temperature (1 and 2 represent the rms value of the current in the conductor at different temperatures $\theta_1$ and $\theta_2$, with $\theta_1 > \theta_2$; $I_z$ being the limit of the permissible current under steady-state conditions).*

where A is the cross-sectional area of the conductors and k is a constant calculated on the basis of different correction factors for the cable installation method, contiguous circuits, etc. Further practical information may be found in the "Electrical Installation Guide" published by Schneider Electric (see the bibliography).

*Fig. 3 : Circuit protection using a circuit breaker.*

*Fig. 4 : Circuit protection using an aM fuse.*

# 1.1 The main types of short-circuits

Various types of short-circuits can occur in electrical installations.

**Characteristics of short-circuits**

The primary characteristics are:

- Duration (self-extinguishing, transient and steady-state)

- Origin
- Mechanical (break in a conductor, accidental electrical contact between two conductors via a foreign conducting body such as a tool or an animal)
- Internal or atmospheric overvoltages

■ Insulation breakdown due to heat, humidity or a corrosive environment
■ Location (inside or outside a machine or an electrical switchboard)

Short-circuits can be:

■ Phase-to-earth (80% of faults)
■ Phase-to-phase (15% of faults). This type of fault often degenerates into a three phase fault
■ Three-phase (only 5% of initial faults)

These different short-circuit currents are presented in **Figure 5**.

## Consequences of short-circuits

The consequences are variable depending on the type and the duration of the fault, the point in the installation where the fault occurs and the short-circuit power. Consequences include:

■ At the fault location, the presence of electrical arcs, resulting in
□ Damage to insulation
□ Welding of conductors

□ Fire and danger to life

■ On the faulty circuit
□ Electrodynamic forces, resulting in
- Deformation of the busbars
- Disconnection of cables

□ Excessive temperature rise due to an increase in Joule losses, with the risk of damage to insulation

■ On other circuits in the network or in near-by networks
□ Voltage dips during the time required to clear the fault, ranging from a few milliseconds to a few hundred milliseconds
□ Shutdown of a part of the network, the extent of that part depending on the design of the network and the discrimination levels offered by the protection devices
□ Dynamic instability and/or the loss of machine synchronisation
□ Disturbances in control / monitoring circuits
□ etc.

**a)** Three-phase short-circuit

**b)** Phase-to-phase short-circuit clear of earth

**c)** Phase-to-phase-to-earth short-circuit

**d)** Phase-to-earth short-circuit

← Short-circuit current,
←| Partial short-circuit currents in conductors and earth.

*Fig. 5 : Different types of short-circuits and their currents. The direction of current is chosen arbitrarily (See IEC 60909).*

# 1.2 Development of the short-circuit current

A simplified network comprises a source of constant AC power, a switch, an impedance Zsc that represents all the impedances upstream of the switch, and a load impedance Zs (see **Fig. 6**).

In a real network, the source impedance is made up of everything upstream of the short-circuit including the various networks with different voltages (HV, LV) and the series-connected wiring systems with different cross-sectional areas (A) and lengths.

In Figure 6, when the switch is closed and no fault is present, the design current Is flows through the network.

When a fault occurs between A and B, the negligible impedance between these points results in a very high short-circuit current Isc that is limited only by impedance Zsc.

The current Isc develops under transient conditions depending on the reactances X and the resistances R that make up impedance Zsc:

$$Zsc = \sqrt{R^{2} + X^{2}}$$

In power distribution networks, reactance $X = L\varphi$ is normally much greater than resistance R and

*Fig. 6 : Simplified network diagram.*

the R / X ratio is between 0.1 and 0.3. The ratio is virtually equals $\cos \varphi$ for low values:

$$\cos \varphi = \frac{R}{\sqrt{R^{2} + X^{2}}}$$

However, the transient conditions prevailing while the short-circuit current develops differ depending on the distance between the fault location and the generator. This distance is not necessarily physical, but means that the generator impedances are less than the impedance of the elements between the generator and the fault location.

**Fault far from the generator**

This is the most frequent situation. The transient conditions are those resulting from the application of a voltage to a reactor-resistance circuit. This voltage is:

$$e = E\sqrt{2} \sin(\omega t + \alpha)$$

Current i is then the sum of the two components:

$$i = i_{ac} + i_{dc}$$

■ The first ($i_{ac}$) is alternating and sinusoidal

$$i_{ac} = I\sqrt{2} \sin(\omega t + \alpha - \varphi)$$

where $I = \dfrac{E}{Zsc}$,

$\alpha =$ angle characterising the difference between the initiation of the fault and zero voltage.

■ The second ($i_{dc}$) is an aperiodic component

$$i_{dc} = -I\sqrt{2} \sin(\alpha - \varphi)\, e^{-\frac{R}{L}t}$$

Its initial value depends on $\alpha$ and its decay rate is proportional to R / L.

At the initiation of the short-circuit, i is equal to zero by definition (the design current Is is negligible), hence:

$$i = i_{ac} + i_{dc} = 0$$

**Figure 7** shows the graphical composition of i as the algebraic sum of its two components $i_{ac}$ and $i_{dc}$

*Fig. 7 : Graphical presentation and decomposition of a short-circuit current occuring far from the generator.*

**a)** Symmetrical

**b)** Asymmetrical

*Fig. 8 : Graphical presentation of the two extreme cases (symmetrical and asymmetrical) for a short-circuit current.*

The moment the fault occurs or the moment of closing, with respect to the network voltage, is characterised by its closing angle α (occurrence of the fault). The voltage can therefore be expressed as: $u = E\sqrt{2} \cdot \sin(\omega t + \alpha)$. The current therefore develops as follows:

$$i = \frac{E\sqrt{2}}{Z} \left[ \sin(\omega t + \alpha - \varphi) - \sin(\alpha - \varphi)\, e^{-\frac{R}{L}t} \right]$$

with its two components, one being alternating with a shift equal to φ with respect to the voltage and the second aperiodic and decaying to zero as $t$ tends to infinity. Hence the two extreme cases defined by:

■ $\alpha = \varphi = \pi/2$, said to be symmetrical (or balanced) (see **Fig. a**)

The fault current can be defined by: $i = \dfrac{E\sqrt{2}}{Z} \sin\omega t$ which, from the initiation, has the same shape as for steady state conditions with a peak value $E/Z$.

■ $\alpha = 0$, said to be asymmetrical (or unbalanced) (see **Fig. b**)

The fault current can be defined by:

$$i = \frac{E\sqrt{2}}{Z} \left[ \sin(\omega t - \varphi) + \sin\varphi\, e^{-\frac{R}{L}t} \right]$$

Its initial peak value $i_p$ therefore depends on φ on the $R/X \approx \cos\varphi$ ratio of the circuit.

**Figure 8** illustrates the two extreme cases for the development of a short-circuit current, presented, for the sake of simplicity, with a single-phase, alternating voltage.

The factor $e^{-\frac{R}{L}t}$ is inversely proportional to the aperiodic component damping, determined by the $R/L$ or $R/X$ ratios.

The value of $i_p$ must therefore be calculated to determine the making capacity of the required circuit breakers and to define the electrodynamic forces that the installation as a whole must be capable of withstanding.

Its value may be deduced from the rms value of the symmetrical short-circuit current Ia using the equation:

$i_p = \kappa \cdot \sqrt{2} \cdot \text{Ia}$, where the coefficient κ is indicated by the curve in **Figure 9**, as a function of the ratio $R/X$ or $R/L$, corresponding to the expression:

$$\kappa = 1.02 + 0.98\, e^{-3\frac{R}{X}}$$

## Fault near the generator

When the fault occurs in the immediate vicinity of the generator supplying the circuit, the variation in the impedance of the generator, in this case the dominant impedance, damps the short-circuit current.

The transient current-development conditions are in this case modified by the variation in the electromotive force resulting from the short-circuit.

For simplicity, the electromotive force is assumed to be constant and the internal reactance of the machine variable. The reactance develops in three stages:

■ **Subtransient** (the first 10 to 20 milliseconds of the fault)

■ **Transient** (up to 500 milliseconds)

■ **Steady-state** (or synchronous reactance)

*Fig. 9 : Variation of coefficient κ depending on R / X or R / L (see IEC 60909).*

Note that in the indicated order, the reactance acquires a higher value at each stage, i.e. the subtransient reactance is less than the transient reactance, itself less than the synchronous reactance. The successive effect of the three reactances leads to a gradual reduction in the short-circuit current which is the sum of four components *(see **Fig. 10** )*:

- The three alternating components (subtransient, transient and steady-state)
- The aperiodic component resulting from the development of the current in the circuit (inductive)

This short-circuit current i(t) is maximum for a closing angle corresponding to the zero-crossing of the voltage at the instant the fault occurs.

**Fig. 10** : Total short-circuit current *i*<sub>sc</sub> **(e)**, and contribution of its components:

**a)** subtransient reactance $= X''_d$

**b)** transient reactance $= X'_d$

**c)** synchronous reactance $= X_d$

**d)** aperiodic component.

*Note that the decrease in the generator reactance is faster than that of the aperiodic component. This is a rare situation that can cause saturation of the magnetic circuits and interruption problems because several periods occur before the current passes through zero.*

It is therefore given by the following expression:

$$
i(t) = E\sqrt{2} \left[ \left(\frac{1}{X_d''} - \frac{1}{X_d'}\right) e^{-t/T_d''} + \left(\frac{1}{X_d'} - \frac{1}{X_d}\right) e^{-t/T_d'} + \frac{1}{X_d} \right] \cos \omega t - \frac{E\sqrt{2}}{X_d''} e^{-t/T_a}
$$

Where:

E: Phase-to-neutral rms voltage across the generator terminals

$X_d''$: Subtransient reactance

$X_d'$: Transient reactance

$X_d$: Synchronous (steady-state) reactance

$T_d''$: Subtransient time constant

$T_d'$: Transient time constant

$T_a$: Aperiodic time constant

Practically speaking, information on the development of the short-circuit current is not essential:

- In a LV installation, due to the speed of the breaking devices, the value of the subtransient short-circuit current, denoted $I_k''$, and of the maximum asymmetrical peak amplitude $i_p$ is sufficient when determining the breaking capacities of the protection devices and the electrodynamic forces

- In LV power distribution and in HV applications, however, the transient short-circuit current is often used if breaking occurs before the steady-state stage, in which case it becomes useful to use the short-circuit breaking current, denoted Ib, which determines the breaking capacity of the time-delayed circuit breakers. Ib is the value of the short-circuit current at the moment interruption is effective, i.e. following a time t after the beginning of the short-circuit, where $t = t_{\min}$. Time $t_{\min}$ (minimum time delay) is the sum of the minimum operating time of a protection relay and the shortest opening time of the associated circuit breaker, i.e. the shortest time between the appearance of the short-circuit current and the initial separation of the pole contacts on the switching device.

**Figure 11** presents the various currents of the short-circuits defined above.

*Fig. 11 : short-circuit currents near a generator (schematic diagram).*

## 1.3 Standardised Isc calculations

The standards propose a number of methods.

- Application guide C 15-105, which supplements NF C 15-100 (Normes Françaises) (low-voltage AC installations), details three methods
- The "impedance" method, used to calculate fault currents at any point in an installation with a high degree of accuracy.

This method involves adding the various resistances and reactances of the fault loop separately, from (and including) the source to the given point, and then calculating the corresponding impedance. The Isc value is finally obtained by applying Ohm's law:

$$
\text{Isc} = \frac{\text{Un}}{\sqrt{3} \sum (Z)}.
$$

All the characteristics of the various elements in the fault loop must be known (sources and wiring systems).

- The "composition" method, which may be used when the characteristics of the power supply are not known. The upstream impedance of the given circuit is calculated on the basis of an estimate of the short-circuit current at its origin. Power factor cos φ ≈ R / X is assumed to be identical at the origin of the circuit and the fault location. In other words, it is assumed that the elementary impedances of two successive sections in the installation are sufficiently similar in their characteristics to justify the replacement of vectorial addition of the impedances by algebraic addition. This approximation may be used to calculate the value of the short-circuit current modulus with sufficient accuracy for the addition of a circuit.

❑ The "conventional" method, which can be used when the impedances or the Isc in the installation upstream of the given circuit are not known, to calculate the minimum short-circuit currents and the fault currents at the end of a line. It is based on the assumption that the voltage at the circuit origin is equal to 80% of the rated voltage of the installation during the short-circuit or the fault.
Conductor reactance is neglected for sizes under 150 mm². It is taken into account for large sizes by increasing the resistance 15% for 150 mm², 20% for 185 mm², 25% for 240 mm² and 30% for 300 mm².
This method is used essentially for final circuits with origins sufficiently far from the source. It is not applicable in installations supplied by a generator.

■ Standard IEC 60909 (VDE 0102) applies to all networks, radial or meshed, up to 550 kV.
This method, based on the Thevenin theorem, calculates an equivalent voltage source at the short-circuit location and then determines the corresponding short-circuit current. All network feeders as well as the synchronous and asynchronous machines are replaced in the calculation by their impedances (positive sequence, negative-sequence and zero-sequence).
All line capacitances and the parallel admittances of non-rotating loads, except those of the zero-sequence system, are neglected.

## 1.4 Methods presented in this document

In this "Cahier Technique" publication, two methods are presented for the calculation of short-circuit currents in radial networks:

■ The impedance method, reserved primarily for LV networks, was selected for its high degree of accuracy and its instructive value, given that virtually all characteristics of the circuit are taken into account

■ The IEC 60909 method, used primarily for HV networks, was selected for its accuracy and its analytical character. More technical in nature, it implements the symmetrical-component principle

## 1.5 Basic assumptions

To simplify the short-circuit calculations, a number of assumptions are required. These impose limits for which the calculations are valid but usually provide good approximations, facilitating comprehension of the physical phenomena and consequently the short-circuit current calculations. They nevertheless maintain a fully acceptable level of accuracy, "erring" systematically on the conservative side. The assumptions used in this document are as follows:

■ The given network is radial with nominal voltages ranging from LV to HV, but not exceeding 550 kV, the limit set by standard IEC 60909

■ The short-circuit current, during a three-phase short-circuit, is assumed to occur simultaneously on all three phases

■ During the short-circuit, the number of phases involved does not change, i.e. a three-phase fault remains three-phase and a phase-to-earth fault remains phase-to-earth

■ For the entire duration of the short-circuit, the voltages responsible for the flow of the current and the short-circuit impedance do not change significantly

■ Transformer regulators or tap-changers are assumed to be set to a main position (if the short-circuit occurs away far from the generator, the actual position of the transformer regulator or tap-changers does not need to be taken into account

■ Arc resistances are not taken into account

■ All line capacitances are neglected

■ Load currents are neglected

■ All zero-sequence impedances are taken into account

# 2 Calculation of Isc by the impedance method

## 2.1 Isc depending on the different types of short-circuit

**Three-phase short-circuit**

This fault involves all three phases. Short-circuit current Isc₃ is equal to:

$$\mathrm{Isc_3} = \frac{\mathrm{U} / \sqrt{3}}{\mathrm{Zcc}}$$

where U (phase-to-phase voltage) corresponds to the transformer no-load voltage which is 3 to 5% greater than the on-load voltage across the terminals. For example, in 390 V networks, the phase-to-phase voltage adopted is U = 410 V, and the phase-to-neutral voltage is

$$\mathrm{U} / \sqrt{3} = 237 \text{ V}.$$

Calculation of the short-circuit current therefore requires only calculation of Zsc, the impedance equal to all the impedances through which Isc flows from the generator to the location of the fault, i.e. the impedances of the power sources and the lines (see **Fig. 12**). This is, in fact, the "positive-sequence" impedance per phase:

$$\mathrm{Zsc} = \sqrt{\left(\sum R\right)^2 + \left(\sum X\right)^2} \text{ where}$$

$\sum R =$ the sum of series resistances,

$\sum X =$ the sum of series reactances.

It is generally considered that three-phase faults provoke the highest fault currents. The fault current in an equivalent diagram of a polyphase system is limited by only the impedance of one phase at the phase-to-neutral voltage of the network. Calculation of Isc₃ is therefore essential for selection of equipment (maximum current and electrodynamic withstand capability).

*Fig. 12 : The various short-circuit currents.*

# Phase-to-phase short-circuit clear of earth

This is a fault between two phases, supplied with a phase-to-phase voltage U. In this case, the short-circuit current Isc₂ is less than that of a three-phase fault:

$$
\text{Isc}_2 = \frac{U}{2 \ \text{Zsc}} = \frac{\sqrt{3}}{2} \ \text{Isc}_3 \approx 0.86 \ \text{Isc}_3
$$

For a fault occuring near rotating machines, the impedance of the machines is such that Isc₂ is close to Isc₃.

# Phase-to-neutral short-circuit clear of earth

This is a fault between one phase and the neutral, supplied with a phase-to-neutral voltage $V = U / \sqrt{3}$

The short-circuit current Isc₁ is:

$$
\text{Isc}_1 = \frac{U / \sqrt{3}}{\text{Zsc} + Z_{Ln}}
$$

In certain special cases of phase-to-neutral faults, the zero-sequence impedance of the source is less than Zsc (for example, at the terminals of a star-zigzag connected transformer or of a generator under subtransient conditions). In this case, the phase-to-neutral fault current may be greater than that of a three-phase fault.

# Phase-to-earth fault (one or two phases)

This type of fault brings the zero-sequence impedance Z₀ into play.

Except when rotating machines are involved (reduced zero-sequence impedance), the short-circuit current Isc₀ is less than that of a three phase fault.

Calculation of Isc₀ may be necessary, depending on the neutral system (system earthing arrangement), in view of defining the setting thresholds for the zero-sequence (HV) or earth-fault (LV) protection devices.

**Figure 12** shows the various short-circuit currents.

# 2.2 Determining the various short-circuit impedances

This method involves determining the short-circuit currents on the basis of the impedance represented by the "circuit" through which the short-circuit current flows. This impedance may be calculated after separately summing the various resistances and reactances in the fault loop, from (and including) the power source to the fault location.

(The circled numbers ⓧ may be used to come back to important information while reading the example at the end of this section.)

## Network impedances

■ Upstream network impedance

Generally speaking, points upstream of the power source are not taken into account. Available data on the upstream network is therefore limited to that supplied by the power distributor, i.e. only the short-circuit power Ssc in MVA.

The equivalent impedance of the upstream network is:

$$
\textcircled{1} \quad \text{Zup} = \frac{U^2}{\text{Ssc}}
$$

where U is the no-load phase-to-phase voltage of the network.

The upstream resistance and reactance may be deduced from Rup / Zup (for HV) by:

Rup / Zup ≈ 0.3 at 6 kV;

Rup / Zup ≈ 0.2 at 20 kV;

Rup / Zup ≈ 0.1 at 150 kV.

As, $\text{Xup} = \sqrt{\text{Za}^2 - \text{Ra}^2}$,

$$
\frac{\text{Xup}}{\text{Zup}} = \sqrt{1 - \left(\frac{\text{Rup}}{\text{Zup}}\right)^2}
$$

$\textcircled{2}$ Therefore, for 20 kV,

$$
\frac{\text{Xup}}{\text{Zup}} = \sqrt{1 - (0.2)^2} = 0.980
$$

Xup = 0.980 Zup at 20kV, hence the approximation $\text{Xup} \approx \text{Zup}$.

■ Internal transformer impedance

The impedance may be calculated on the basis of the short-circuit voltage usc expressed as a percentage:

$$
\textcircled{3} \quad Z_T = \frac{u_{sc}}{100} \frac{U^2}{Sn},
$$

U = no-load phase-to-phase voltage of the transformer;

Sn = transformer kVA rating;

$\dfrac{u_{sc}}{100}$ = voltage that must be applied to the primary winding of the transformer for the rated current to flow through the secondary winding, when the LV secondary terminals are short-circuited.

For public distribution MV / LV transformers, the values of usc have been set by the European Harmonisation document HD 428-1S1 issued in October 1992 (see **Fig. 13**).

| Rating (kVA) of the MV / LV transformer | ≤ 630 | 800 | 1,000 | 1,250 | 1,600 | 2,000 |
|---|---|---|---|---|---|---|
| Short-circuit voltage u_sc (%) | 4 | 4.5 | 5 | 5.5 | 6 | 7 |

*Fig. 13 : Standardised short-circuit voltage for public distribution transformers.*

Note that the accuracy of values has a direct influence on the calculation of Isc in that an error of x % for usc produces an equivalent error (x %) for $Z_{\mathrm{T}}$.

④ In general, $R_{\mathrm{T}} << X_{\mathrm{T}}$, in the order of 0.2 $X_{\mathrm{T}}$, and the internal transformer impedance may be considered comparable to reactance $X_{\mathrm{T}}$. For low power levels, however, calculation of $Z_{\mathrm{T}}$ is required because the ratio $R_{\mathrm{T}} / X_{\mathrm{T}}$ is higher. The resistance is calculated using the joule losses (W) in the windings:

$$
W = 3\ R_T\ \mathrm{In}^2 \Rightarrow R_T = \frac{W}{3\ \mathrm{In}^2}
$$

Notes:

⑤

☐ When n identically-rated transformers are connected in parallel, their internal impedance values, as well as the resistance and reactance values, must be divided by n

☐ Particular attention must be paid to special transformers, for example, the transformers for rectifier units have $U_{sc}$ values of up to 10 to 12% in order to limit short-circuit currents.

When the impedance upstream of the transformer and the transformer internal impedance are taken into account, the short-circuit current may be expressed as:

$$
\mathrm{Isc} = \frac{U}{\sqrt{3}\left(Zup + Z_T\right)}
$$

Initially, Zup and $Z_{\mathrm{T}}$ may be considered comparable to their respective reactances. The short-circuit impedance Zsc is therefore equal to the algebraic sum of the two.

The upstream network impedance may be neglected, in which case the new current value is:

$$
\mathrm{I'sc} = \frac{U}{\sqrt{3}\ Z_T}
$$

The relative error is:

$$
\frac{\Delta \mathrm{Isc}}{\mathrm{Isc}} = \frac{\mathrm{I'sc} - \mathrm{Isc}}{\mathrm{Isc}} = \frac{Zup}{Z_T} = \frac{\dfrac{U^2}{Ssc}}{\dfrac{u_{sc}}{100}\dfrac{U^2}{Sn}}
$$

$$
\text{i.e. : } \frac{\Delta \mathrm{Isc}}{\mathrm{Isc}} = \frac{100}{u_{sc}} \frac{Sn}{Ssc}
$$

**Figure 14** indicates the level of conservative error in the calculation of Isc, due to the fact that the upstream impedance is neglected. The figure demonstrates clearly that it is possible to neglect the upstream impedance for networks where the short-circuit power Ssc is much higher than the transformer kVA rating Sn. For example, when Ssc / Sn = 300, the error is approximately 5%.

■ **Line impedance**

The line impedance $Z_L$ depends on the resistance per unit length, the reactance per unit length and the length of the line.

☐ The resistance per unit length of overhead lines, cables and busbars is calculated as

$$
R_L = \frac{\rho}{A} \text{ where}
$$

S = cross-sectional area of the conductor; ρ = conductor resistivity, however the value used varies, depending on the calculated short-circuit current (minimum or maximum).

⑥ The table in **Figure 15** provides values for each of the above-mentioned cases.

Practically speaking, for LV and conductors with cross-sectional areas less than 150 mm², only the resistance is taken into account ($R_L < 0.15\ \mathrm{m}\Omega / \mathrm{m}$ when $A > 150\ \mathrm{mm}^2$).

☐ The reactance per unit length of overhead lines, cables and busbars may be calculated as

$$
X_L = L\ \omega = \left[15.7 + 144.44\ \mathrm{Log}\left(\frac{d}{r}\right)\right]
$$

*Fig. 14 : Resultant error in the calculation of the short-circuit current when the upstream network impedance Zup is neglected.*

expressed as mΩ / km for a single-phase or three-phase delta cable system, where (in mm): r = radius of the conducting cores; d = average distance between conductors. NB : Above, Log = decimal logarithm. For overhead lines, the reactance increases slightly in proportion to the distance between conductors (Log $\left(\dfrac{d}{t}\right)$), and therefore in proportion to the operating voltage.

⑦ the following average values are to be used: X = 0.3 Ω / km (LV lines); X = 0.4 Ω / km (MV or HV lines).

**Figure 16** shows the various reactance values for conductors in LV applications, depending on the wiring system (practical values drawn from French standards, also used in other European countries). The following average values are to be used:

- 0.08 mΩ / m for a three-phase cable (●), and, for HV applications, between 0.1 and 0.15 mΩ / m.

⑧ - 0.09 mΩ / m for touching, single-conductor cables (flat ●●● or triangular ●●●);

⑨ - 0.15 mΩ / m as a typical value for busbars (■■■■) and spaced, single-conductor cables (●●●●) ; For "sandwiched-phase" busbars (e.g. Canalis - Telemecanique), the reactance is considerably lower.

Notes :

□ The impedance of the short lines between the distribution point and the HV / LV transformer may be neglected. This assumption gives a conservative error concerning the short-circuit current. The error increases in proportion to the transformer rating

□ The cable capacitance with respect to the earth (common mode), which is 10 to 20 times greater than that between the lines, must be taken into account for earth faults. Generally speaking, the capacitance of a HV three-phase cable with a cross-sectional area of 120 mm² is in the order

| Rule | Resistivity (*) | Resistivity value (Ω mm²/m) | | Concerned conductors |
|---|---|---|---|---|
| | | Copper | Aluminium | |
| Max. short-circuit current | ρ₀ | 0.01851 | 0.02941 | PH-N |
| Min. short-circuit current | | | | |
| ■ With fuse | ρ₂ = 1,5 ρ₀ | 0.028 | 0.044 | PH-N |
| ■ With breaker | ρ₁ = 1,25 ρ₀ | 0.023 | 0.037 | PH-N (**) |
| Fault current for TN and IT systems | ρ₁ = 1,25 ρ₀ | 0,023 | 0,037 | PH-N PE-PEN |
| Voltage drop | ρ₁ = 1,25 ρ₀ | 0.023 | 0.037 | PH-N |
| Overcurrent for thermal-stress checks on protective conductors | ρ₁ = 1,25 ρ₀ | 0.023 | 0.037 | PH, PE and PEN |

(*) ρ₀ = resistivity of conductors at 20°C = 0.01851 Ω mm²/m for copper and 0.02941 Ω mm²/m for aluminium. (**) N, the cross-sectional area of the neutral conductor, is less than that of the phase conductor.

*Fig. 15 : Conductor resistivity ρ values to be taken into account depending on the calculated short-circuit current (minimum or maximum). See UTE C 15-105.*

| Wiring system | Busbars | Three-phase cable | Spaced single-core cables | Touching single core cables (triangle) | 3 touching cables (flat) | 3 «d» spaced cables (flat) d = 2r | d = 4r |
|---|---|---|---|---|---|---|---|
| Diagram | | | | | | | |
| Reactance per unit length, values recommended in UTE C 15-105 (mΩ/m) | | 0.08 | 0.13 | 0.08 | 0.09 | 0.13 | 0.13 |
| Average reactance per unit length values (mΩ/m) | 0.15 | 0.08 | 0.15 | 0.085 | 0.095 | 0.145 | 0.19 |
| Extreme reactance per unit length values (mΩ/m) | 0.12-0.18 | 0.06-0.1 | 0.1-0.2 | 0.08-0.09 | 0.09-0.1 | 0.14-0.15 | 0.18-0.20 |

*Fig. 16 : Cables reactance values depending on the wiring system.*

of $1\,\mu\mathrm{F}/\mathrm{km}$, however the capacitive current remains low, in the order of $5\,\mathrm{A}/\mathrm{km}$ at $20\,\mathrm{kV}$.

- The reactance or resistance of the lines may be neglected.

If one of the values, $R_L$ or $X_L$, is low with respect to the other, it may be neglected because the resulting error for impedance $Z_L$ is consequently very low. For example, if the ratio between $R_L$ and $X_L$ is 3, the error in $Z_L$ is 5.1%.

The curves for RL and XL (see **Fig. 17**) may be used to deduce the cable cross-sectional areas for which the impedance may be considered comparable to the resistance or to the reactance.

Examples :

- First case: Consider a three-phase cable, at 20°C, with **copper** conductors. Their reactance is $0.08\,\mathrm{m}\Omega/\mathrm{m}$. The $R_L$ and $X_L$ curves (see Fig. 17) indicate that impedance $Z_L$ approaches two asymptotes, $R_L$ for low cable cross-sectional areas and $X_L = 0.08\,\mathrm{m}\Omega/\mathrm{m}$ for high cable cross-sectional areas. For the low and high cable cross-sectional areas, the impedance $Z_L$ curve may be considered identical to the asymptotes.

The given cable impedance is therefore considered, with a margin of error less than 5.1%, comparable to:

- A resistance for cable cross-sectional areas less than $74\,\mathrm{mm}^2$

**Fig. 17** : Impedance $Z_L$ of a three-phase cable, at 20°C, with copper conductors.

- A reactance for cable cross-sectional areas greater than $660\,\mathrm{mm}^2$

- Second case: Consider a three-phase cable, at 20°C, with **aluminium** conductors. As above, the impedance $Z_L$ curve may be considered identical to the asymptotes, but for cable cross-sectional areas less than $120\,\mathrm{mm}^2$ and greater than $1{,}000\,\mathrm{mm}^2$ (curves not shown)

## Impedance of rotating machines.

**■ Synchronous generators**

The impedances of machines are generally expressed as a percentage, for example:

$$
\frac{x}{100} = \frac{\mathrm{In}}{\mathrm{Isc}} \quad \text{(where } x \text{ is the equivalent of the transformer } u_{\mathrm{sc}}\text{).}
$$

Consider:

① $Z = \dfrac{x}{100} \cdot \dfrac{U^2}{\mathrm{Sn}}$ where

$U =$ no-load phase-to-phase voltage of the generator,

$\mathrm{Sn} =$ generator VA rating.

⑪ What is more, given that the value of $R/X$ is low, in the order of 0.05 to 0.1 for MV and 0.1 to 0.2 for LV, impedance $Z$ may be considered comparable to reactance $X$. Values for $x$ are given in the table in **Figure 18** for turbogenerators with smooth rotors and for "hydraulic" generators with salient poles (low speeds).

In the table, it may seem surprising to see that the synchronous reactance for a short circuit exceeds 100% (at that point in time, Isc < In). However, the short-circuit current is essentially inductive and calls on all the reactive power that the field system, even over-excited, can supply, whereas the rated current essentially carries the active power supplied by the turbine (cos $\varphi$ from 0.8 to 1).

**■ Synchronous compensators and motors**

The reaction of these machines during a short circuit is similar to that of generators.

⑫ They produce a current in the network that depends on their reactance in % (see **Fig. 19**).

**■ Asynchronous motors**

When an asynchronous motor is cut from the network, it maintains a voltage across its terminals that disappears within a few hundredths of a second. When a short-circuit occurs across the terminals, the motor supplies a current that disappears even more rapidly, according to time constants in the order of:

| | **Subtransient reactance** | **Transient reactance** | **Synchronous reactance** |
|---|---|---|---|
| Turbo-generator | 10-20 | 15-25 | 150-230 |
| Salient-pole generators | 15-25 | 25-35 | 70-120 |

**Fig. 18** : Generator reactance values. in per unit.

20 ms for single-cage motors up to 100 kW

30 ms for double-cage motors and motors above 100 kW

30 to 100 ms for very large HV slipring motors (1,000 kW)

In the event of a short-circuit, an asynchronous motor is therefore a generator to which an impedance (subtransient only) of 20 to 25% is attributed.

Consequently, the large number of LV motors, with low individual outputs, present on industrial sites may be a source of difficulties in that it is not easy to foresee the average number of motors running that will contribute to the fault when a short-circuit occurs. Individual calculation of the reverse current for each motor, taking into account the line impedance, is therefore a tedious and futile task. Common practice, notably in the United States, is to take into account the combined contribution to the fault current of all the asynchronous LV motors in an installation.

⑬ They are therefore thought of as a unique source, capable of supplying to the busbars a current equal to I_start/Ir times the sum of the rated currents of all installed motors.

## Other impedances.

### Capacitors

A shunt capacitor bank located near the fault location will discharge, thus increasing the short-circuit current. This damped oscillatory discharge is characterised by a high initial peak value that is superposed on the initial peak of the short-circuit current, even though its frequency is far greater than that of the network.

Depending on the timing between the initiation of the fault and the voltage wave, two extreme cases must be considered:

- If the initiation of the fault coincides with zero voltage, the short-circuit discharge current is asymmetrical, with a maximum initial amplitude peak
- Conversely, if the initiation of the fault coincides with maximum voltage, the discharge current superposes itself on the initial peak of the fault current, which, because it is symmetrical, has a low value

It is therefore unlikely, except for very powerful capacitor banks, that superposition will result in an initial peak higher than the peak current of an asymmetrical fault.

It follows that when calculating the maximum short-circuit current, capacitor banks do not need to be taken into account.

However, they must nonetheless be considered when selecting the type of circuit breaker. During opening, capacitor banks significantly reduce the circuit frequency and thus affect current interruption.

### Switchgear

⑭ Certain devices (circuit breakers, contactors with blow-out coils, direct thermal relays, etc.) have an impedance that must be taken into account, for the calculation of Isc, when such a device is located upstream of the device intended to break the given short-circuit and remain closed (selective circuit breakers).

⑮ For LV circuit breakers, for example, a reactance value of 0.15 mΩ is typical, while the resistance is negligible.

For breaking devices, a distinction must be made depending on the speed of opening:

- Certain devices open very quickly and thus significantly reduce short-circuit currents. This is the case for fast-acting, limiting circuit breakers and the resultant level of electrodynamic forces and thermal stresses, for the part of the installation concerned, remains far below the theoretical maximum
- Other devices, such as time-delayed circuit breakers, do not offer this advantage

### Fault arc

The short-circuit current often flows through an arc at the fault location. The resistance of the arc is considerable and highly variable. The voltage drop over a fault arc can range from 100 to 300 V. For HV applications, this drop is negligible with respect to the network voltage and the arc has no effect on reducing the short-circuit current. For LV applications, however, the actual fault current when an arc occurs is limited to a much lower level than that calculated (bolted, solid fault), because the voltage is much lower.

⑯ For example, the arc resulting from a short-circuit between conductors or busbars may reduce the prospective short-circuit current by 20 to 50% and sometimes by even more than 50% for nominal voltages under 440 V. However, this phenomenon, highly favourable in the LV field and which occurs for 90% of faults, may not be taken into account when determining the breaking capacity because 10% of faults take place during closing of a device, producing a solid

| | **Subtransient reactance** | **Transient reactance** | **Synchronous reactance** |
|---|---|---|---|
| High-speed motors | 15 | 25 | 80 |
| Low-speed motors | 35 | 50 | 100 |
| Compensators | 25 | 40 | 160 |

*Fig. 19 : Synchronous compensator and motor reactance values, in per unit.*

fault without an arc. This phenomenon should, however, be taken into account for the calculation of the minimum short-circuit current.

■ Various impedances

Other elements may add non-negligible impedances. This is the case for harmonics filters and inductors used to limit the short-circuit current.

They must, of course, be included in calculations, as well as wound-primary type current transformers for which the impedance values vary depending on the rating and the type of construction.

## 2.3 Relationships between impedances at the different voltage levels in an installation

### Impedances as a function of the voltage

The short-circuit power Ssc at a given point in the network is defined by:

$$
Ssc = U \ I\sqrt{3} = \frac{U^2}{Zsc}
$$

This means of expressing the short-circuit power implies that Ssc is invariable at a given point in the network, whatever the voltage. And the equation

$$
Isc_3 = \frac{U}{\sqrt{3} \ Zsc} \text{ implies that all impedances}
$$

must be calculated with respect to the voltage at the fault location, which leads to certain complications that often produce errors in calculations for networks with two or more voltage levels. For example, the impedance of a HV line must be multiplied by the square of the reciprocal of the transformation ratio, when calculating a fault on the LV side of the transformer:

$$
\textcircled{17} \quad Z_{BT} = Z_{HT}\left(\frac{U_{BT}}{U_{HT}}\right)^2
$$

A simple means of avoiding these difficulties is the relative impedance method proposed by H. Rich.

### Calculation of the relative impedances

This is a calculation method used to establish a relationship between the impedances at the different voltage levels in an electrical installation.

This method proposes dividing the impedances (in ohms) by the square of the network line-to-line voltage (in volts) at the point where the impedances exist. The impedances therefore become relative $(Z_R)$.

■ For overhead lines and cables, the relative resistances and reactances are defined as:

$$
R_{CR} = \frac{R}{U^2} \text{ and } X_{CR} = \frac{X}{U^2} \text{ with } R \text{ and } X \text{ in ohms and } U \text{ in volts.}
$$

■ For transformers, the impedance is expressed on the basis of their short-circuit voltages $u_{sc}$ and their kVA rating Sn:

$$
Z_{TR} = \frac{1}{Sn} \ \frac{u_{sc}}{100}
$$

■ For rotating machines, the equation is identical, with $x$ representing the impedance expressed in %.

$$
Z_{MR} = \frac{1}{Sn} \ \frac{x}{100}
$$

■ For the system as a whole, after having calculated all the relative impedances, the short-circuit power may be expressed as:

$$
Ssc = \frac{1}{\sum Z_R} \text{ from which it is possible to deduce the fault current Isc at a point with a voltage } U:
$$

$$
Isc = \frac{Ssc}{\sqrt{3} \ U} = \frac{1}{\sqrt{3} \ U \ \sum Z_R}
$$

$\sum Z_R$ is the composed vector sum of all the impedances related to elements upstream of the fault. It is therefore the relative impedance of the upstream network as seen from a point at U voltage.

Hence, Ssc is the short-circuit power, in VA, at a point where voltage is U.

For example, if we consider the simplified diagram of **Figure 20** :

At point A, $Ssc = \dfrac{U_{LV}^2}{Z_T\left(\dfrac{U_{LV}}{U_{HV}}\right)^2 + Z_L}$

Hence, $Ssc = \dfrac{1}{\dfrac{Z_T}{U_{HV}^2} + \dfrac{Z_L}{U_{LV}^2}}$

*Fig. 20 : Calculating Ssc at point A.*

# 2.4 Calculation example (with the impedances of the power sources, the upstream network and the power supply transformers as well as those of the electrical lines)

## Problem

Consider a 20 kV network that supplies a HV / LV substation via a 2 km overhead line, and a 1 MVA generator that supplies in parallel the busbars of the same substation. Two 1,000 kVA parallel-connected transformers supply the LV busbars which in turn supply 20 outgoers to 20 motors, including the one supplying motor M. All motors are rated 50 kW, all connection cables are identical and all motors are running when the fault occurs.

The Isc₃ and i_p values must be calculated at the various fault locations indicated in the network diagram (see **Fig. 21**), that is:

- Point A on the HV busbars, with a negligible impedance
- Point B on the LV busbars, at a distance of 10 meters from the transformers
- Point C on the busbars of an LV subdistribution board
- Point D at the terminals of motor M

Then the reverse current of the motors must be calculated at C and B, then at D and A.

**Upstream network**
U1 = 20 kV
Ssc = 500 MVA

**Overhead line**
3 cables, 50 mm², copper
length = 2 km

**Generator**
1 MVA
x_subt = 15%

**2 transformers**
1,000 kVA
secondary winding 237/410 V
u_sc = 5%

**Main LV switchboard**
3 bars, 400 mm²/ph, copper
length = 10 m

**Cable 1**
3 single-core cables, 400 mm², aluminium, spaced, laid flat,
length = 80 m

**LV sub-distribution board**
neglecting the length of the busbars

**Cable 2**
3 single-core cables 35 mm², copper 3-phase,
length = 30 m

**Motor**
50 kW (efficiency = 0.9 ; cos φ = 0.8)
x = 25%

*Fig. 21 : Diagram for calculation of Isc₃ and i_p at points A, B, C and D.*

In this example, reactances X and resistances R are calculated with their respective voltages in the installation (see **Figure 22**). The relative impedance method is not used.

**Solution**

| Section | Calculation | | Results | |
|---|---|---|---|---|
| (the circled numbers ⓧ indicate where explanations may be found in the preceding text) | | | | |
| 20 kV↓ | | | **X (Ω)** | **R (Ω)** |
| **1**. upstream network | $Z_{up} = \left(20 \times 10^3\right)^2 / \ 500 \times 10^6$ | ① | | |
| | $X_{up} = 0.98 \ Z_{up}$ | ② | 0.78 | |
| | $R_{up} = 0.2 \ Z_{up} = 0.2 \ X_{up}$ | | | 0.15 |
| **2**. overhead line (50 mm²) | $Xc_o = 0.4 \times 2$ | ⑦ | 0.8 | |
| | $Rc_o = 0.018 \times \dfrac{2{,}000}{50}$ | ⑥ | | 0.72 |
| **3**. generator | $X_G = \dfrac{15}{100} \times \dfrac{\left(20 \times 10^3\right)^2}{10^6}$ | ⑩ | 60 | |
| | $R_G = 0.1 \ X_G$ | ⑪ | | 6 |
| 20 kV↑ | | | **X (mΩ)** | **R (mΩ)** |
| **Fault A** | | | | |
| **4**. transformers $Z_T$ on LV side | $Z_T = \dfrac{1}{2} \times \dfrac{5}{100} \times \dfrac{410^2}{10^6}$ | ③ ⑤ | | |
| | $X_T \approx Z_T$ | | 4.2 | |
| | $R_T = 0.2 \ X_T$ | ④ | | 0.84 |
| 410 V↓ | | | | |
| **5**. circuit-breaker | $X_{cb} = 0.15$ | ⑮ | 0.15 | |
| **6**. busbars (one 400 mm² bar per phase) | $X_B = 0.15 \times 10^{-3} \times 10$ | ⑨ | 1.5 | |
| | $R_B = 0.023 \times \dfrac{10}{400}$ | ⑥ | | 0.57 |
| **Fault B** | | | | |
| **7**. circuit-breaker | $X_{cb} = 0.15$ | | 0.15 | |
| **8**. cable 1 (one 400 mm² cable per phase) | $Xc_1 = 0.15 \times 10^{-3} \times 80$ | | 12 | |
| | $Rc_1 = 0.036 \times \dfrac{80}{400}$ | ⑥ | | 7.2 |
| **Fault C** | | | | |
| **9**. circuit-breaker | $X_{cb} = 0.15$ | | 0.15 | |
| **10**. cable 2 (35 mm²) | $Xc_2 = 0.09 \times 10^{-3} \times 30$ | ⑧ | 2.7 | |
| | $Rc_2 = 0.023 \times \dfrac{30}{35}$ | | | 19.3 |
| **Fault D** | | | | |
| **11**. motor 50 kW | $Xm = \dfrac{25}{100} \times \dfrac{410^2}{(50/0.9 \times 0.8) \cdot 10^3}$ | ⑫ | 605 | |
| | $Rm = 0.2 \ Xm$ | | | 121 |

*Fig. 22 : Impedance calculation.*

# I - Fault at A (HV busbars)

Elements concerned: 1, 2, 3.

The "network + overhead line" impedance is parallel to that of the generator, however the latter is much greater and may be neglected:

$$X_A = 0.78 + 0.8 \approx 1.58 \ \Omega$$

$$R_A = 0.15 + 0.72 \approx 0.87 \ \Omega$$

$$Z_A = \sqrt{R_A^2 + X_A^2} \approx 1.80 \ \Omega \text{ hence}$$

$$I_A = \frac{20 \times 10^3}{\sqrt{3} \times 1.80} \approx 6{,}415 \text{ A}$$

$I_A$ is the "steady-state Isc" and for the purposes of calculating the peak asymmetrical $I_{pA}$:

$\dfrac{R_A}{X_A} = 0.55$ hence $\kappa = 1.2$ on the curve in figure 9 and therefore $i_{pA}$ is equal to:

$$1.2 \times \sqrt{2} \times 6{,}415 = \textbf{10,887 A}.$$

# II - Fault at B (main LV switchboard busbars)

[Elements concerned: (1, 2, 3) + (4, 5, 6)]

The reactances X and resistances R calculated for the HV section must be recalculated for the LV network via multiplication by the square of the voltage ratio ⑰, i.e.:

$(410/20{,}000)^2 = 0.42 \times 10^{-3}$ hence

$$X_B = \left[(X_A \ 0.42) + 4.2 + 0.15 + 1.5\right] 10^{-3}$$

$$X_B = 6.51 \text{ m}\Omega \text{ and}$$

$$R_B = \left[(R_A \ 0.42) + 0.84 + 0.57\right] 10^{-3}$$

$$R_B = 1.77 \text{ m}\Omega$$

These calculations make clear, firstly, the low importance of the HV upstream reactance, with respect to the reactances of the two parallel transformers, and secondly, the non-negligible impedance of the 10 meter long, LV busbars.

$$Z_B = \sqrt{R_B^2 + X_B^2} = 6.75 \text{ m}\Omega$$

$$I_B = \frac{410}{\sqrt{3} \times 6.75 \times 10^{-3}} \approx 35{,}070 \text{ A}$$

$\dfrac{R_B}{X_B} = 0.27$ hence $\kappa = 1.46$ on the curve in figure 9 and therefore the peak $i_{pB}$ is equal to:

$$1.46 \times \sqrt{2} \times 35{,}070 \approx \textbf{72,400 A}.$$

What is more, if the fault arc is taken into account (see § ■ fault arc section ⑯), $I_B$ is reduced to a maximum value of 28,000 A and a minimum value of 17,500 A.

# III - Fault at C (busbars of LV sub-distribution board)

[Elements concerned: (1, 2, 3) + (4, 5, 6) + (7, 8)]

The reactances and the resistances of the circuit breaker and the cables must be added to $X_B$ and $R_B$.

$$X_C = (X_B + 0.15 + 12) \ 10^{-3} = 18.67 \text{ m}\Omega$$

and

$$R_C = (R_B + 7.2) \ 10^{-3} = 9.0 \text{ m}\Omega$$

These values make clear the importance of Isc limitation due to the cables.

$$Z_C = \sqrt{R_C^2 + X_C^2} = 20.7 \text{ m}\Omega$$

$$I_C = \frac{410}{\sqrt{3} \times 20.7 \times 10^{-3}} \approx 11{,}400 \text{ A}$$

$\dfrac{R_C}{X_C} = 0.48$ hence $\kappa = 1.25$ on the curve in figure 9 and therefore the peak $i_{pC}$ is equal to:

$$1.25 \times \sqrt{2} \times 11{,}400 \approx \textbf{20,200 A}$$

# IV - Fault at D (LV motor)

[Elements concerned: (1, 2, 3) + (4, 5, 6) + (7, 8) + (9, 10)]

The reactances and the resistances of the circuit breaker and the cables must be added to $X_C$ and $R_C$.

$$X_D = (X_C + 0.15 + 2.7) \ 10^{-3} = 21.52 \text{ m}\Omega$$

and

$$R_D = (R_C + 19.2) \ 10^{-3} = 28.2 \text{ m}\Omega$$

$$Z_D = \sqrt{R_D^2 + X_D^2} = 35.5 \text{ m}\Omega$$

$$I_D = \frac{410}{\sqrt{3} \times 35.5 \times 10^{-3}} \approx 6{,}700 \text{ A}$$

$\dfrac{R_D}{X_D} = 1.31$ hence $\kappa \approx 1.04$ on the curve in figure 9 and therefore the peak $i_{pD}$ is equal to:

$$1.04 \times \sqrt{2} \times 6{,}700 \approx \textbf{9,900 A}$$

As each level in the calculations makes clear, the impact of the circuit breakers is negligible compared to that of the other elements in the network.

# V - Reverse currents of the motors

It is often faster to simply consider the motors as independent generators, injecting into the fault a "reverse current" that is superimposed on the network fault current.

■ Fault at C

The current produced by the motor may be calculated on the basis of the "motor + cable" impedance:

$$X_M = (605 + 2.7) \times 10^{-3} \approx 608 \text{ m}\Omega$$

$$R_M = (121 + 19.3) \ 10^{-3} \approx 140 \text{ m}\Omega$$

$$Z_M = 624 \text{ m}\Omega \text{ hence}$$

$$I_M = \frac{410}{\sqrt{3} \times 624 \times 10^{-3}} \approx 379 \text{ A}$$

For the 20 motors

$$I_{MC} = 7{,}580 \text{ A}.$$

Instead of making the above calculations, it is possible (see ⑬) to estimate the current injected by all the motors as being equal to $(I_{\text{start}} / I_r)$ times their rated current (98 A), i.e. $(4.8 \times 98) \times 20 = 9{,}400$ A.

This estimate therefore provides conservative protection with respect to $I_{MC}$ : 7,580 A.

On the basis of R / X = 0.23 ⇒ κ = 1.51 and $i_{pMC} = 1.51 \times \sqrt{2} \times 7{,}580 =$ **16,200 A**

Consequently, the short-circuit current (subtransient) on the LV busbars increases from 11,400 A to 19,000 A and $i_{pC}$ from 20,200 A to 36,400 A.

## ■ Fault at D

The impedance to be taken into account is 1 / 19th of $Z_M$ (19 parallel motors), plus that of the cable.

$$
X_{MD} = \left(\frac{608}{19} + 2.7\right) 10^{-3} = 34.7 \text{ m}\Omega
$$

$$
R_{MD} = \left(\frac{140}{19} + 19.3\right) 10^{-3} \approx 26.7 \text{ m}\Omega
$$

$Z_{MD} = 43.8$ mΩ hence

$$
I_{MD} = \frac{410}{\sqrt{3} \times 43.8 \times 10^{-3}} = 5{,}400 \text{ A}
$$

giving a total at D of:

$6{,}700 + 5{,}400 = 12{,}100$ A rms, and $i_{pD} \approx$ **18,450 A**.

## ■ Fault at B

As for the fault at C, the current produced by the motor may be calculated on the basis of the "motor + cable" impedance:

$$
X_M = (605 + 2.7 + 12) \, 10^{-3} = 620 \text{ m}\Omega
$$

$$
R_M = (121 + 19.3 + 7.2) \, 10^{-3} \approx 147.5 \text{ m}\Omega
$$

$Z_M = 637$ mΩ hence

$$
I_M = \frac{410}{\sqrt{3} \times 637 \times 10^{-3}} \approx 372 \text{ A}
$$

For the 20 motors $\quad I_{MB} = 7{,}440$ A.

Again, it is possible to estimate the current injected by all the motors as being equal to 4.8 times their rated current (98 A), i.e. 9,400 A. The approximation again overestimates the real value of $I_{MB}$.

Using the fact that R / X = 0.24 = κ = 1.5, $i_{pMB} = 1.5 \times \sqrt{2} \times 7{,}440 =$ **15,800 A** .

Taking the motors into account, the short-circuit current (subtransient) on the main LV switchboard increases from 35,070 A to 42,510 A and the peak $i_{pB}$ from 72,400 A to **88,200 A**.

However, as mentioned above, if the fault arc is taken into account, $I_B$ is reduced between 21.3 to 34 kA.

## ■ Fault at A (HV side)

Rather than calculating the equivalent impedances, it is easier to estimate (conservatively) the reverse current of the motors at A by multiplying the value at B by the LV / HV transformation value ⑰, i.e.:

$$
7{,}440 \times \frac{410}{20 \times 10^{3}} = 152.5 \text{ A}
$$

This figure, compared to the 6,415 A calculated previously, is negligible.

## **Rough calculation of the fault at D**

This calculation makes use of all the approximations mentioned above (notably ⑮ and ⑯).

$$
\sum X = 4.2 + 1.5 + 12
$$

$$
\sum X = 17.7 \text{ m}\Omega = X'_D
$$

$$
\sum R = 7.2 + 19.3 = 26.5 \text{ m}\Omega = R'_D
$$

$$
Z'_D = \sqrt{R'^{2}_D + X'^{2}_D} \approx 31.9 \text{ m}\Omega
$$

$$
I_D = \frac{410}{\sqrt{3} \times 31.9 \times 10^{-3}} \approx 7{,}430 \text{ A}
$$

hence the peak $i^*_{pD}$ :

$$
\sqrt{2} \times 7{,}430 \approx \textbf{10,500 A}.
$$

To find the peak asymmetrical $i_{pD\text{total}}$, the above value must be increased by the contribution of the energised motors at the time of the fault A ⑬ i.e. 4.8 times their rated current of 98 A:

$$
10{,}500 + \left(4.8 \times 98 \times \sqrt{2} \times 20\right) = 23{,}800 \text{ A}
$$

Compared to the figure obtained by the full calculation (18,450 A), the approximate method allows a quick evaluation with an error remaining on the side of safety.

# 3 Calculation of Isc values in a radial network using symmetrical components

## 3.1 Advantages of this method

Calculation using symmetrical components is particularly useful when a three-phase network is unbalanced, because, due to magnetic phenomena, for example, the traditional "cyclical" impedances R and X are, normally speaking, no longer useable. This calculation method is also required when:

- A voltage and current system is not symmetrical (Fresnel vectors with different moduli and imbalances exceeding 120°). This is the case for phase-to-earth or phase-to-phase short-circuits with or without earth connection
- The network includes rotating machines and/or special transformers (Yyn connection, for example)

This method may be used for all types of radial distribution networks at all voltage levels.

## 3.2 Symmetrical components

Similar to the Leblanc theorem which states that a rectilinear alternating field with a sinusoidal amplitude is equivalent to two rotating fields turning in the opposite direction, the definition of symmetrical components is based on the equivalence between an unbalanced three-phase system and the sum of three balanced three-phase systems, namely the positive-sequence, negative-sequence and zero-sequence (see **Fig. 23**).

The superposition principle may then be used to calculate the fault currents.

In the description below, the system is defined using current $\overrightarrow{I1}$ as the rotation reference, where:

- $\overrightarrow{I1_{(1)}}$ is the positive-sequence component
- $\overrightarrow{I1_{(2)}}$ is the negative-sequence component
- $\overrightarrow{I1_{(0)}}$ is the zero-sequence component

and by using the following operator

$$
a = e^{j\frac{2\pi}{3}} = -\frac{1}{2} + j\frac{\sqrt{3}}{2} \text{ between } \overrightarrow{I1}, \overrightarrow{I2},
$$

and $\overrightarrow{I3}$.

This principle, applied to a current system, is confirmed by a graphical representation (see fig. 23). For example, the graphical addition of the vectors produces, for, the following result:

$$
\overrightarrow{I2} = a^2\,\overrightarrow{I1_{(1)}} + a\,\overrightarrow{I1_{(2)}} + \overrightarrow{I1_{(3)}}.
$$

**Currents** $\overrightarrow{I1}$ and $\overrightarrow{I3}$ may be expressed in the same manner, hence the system:

$$
\overrightarrow{I1} = \overrightarrow{I1_{(1)}} + a\,\overrightarrow{I1_{(2)}} + \overrightarrow{I1_{(0)}}
$$

$$
\overrightarrow{I2} = a^2\,\overrightarrow{I1_{(1)}} + a\,\overrightarrow{I1_{(2)}} + \overrightarrow{I1_{(0)}}
$$

$$
\overrightarrow{I3} = a\,\overrightarrow{I1_{(1)}} + a^2\,\overrightarrow{I1_{(2)}} + \overrightarrow{I1_{(0)}}.
$$

*Fig. 23 : Graphical construction of the sum of three balanced three-phase systems (positive-sequence, negative-sequence and zero-sequence).*

These symmetrical current components are related to the symmetrical voltage components by the corresponding impedances:

$$
Z_{(1)} = \frac{V_{(1)}}{I_{(1)}}, \ Z_{(2)} = \frac{V_{(2)}}{I_{(2)}} \text{ and } Z_{(0)} = \frac{V_{(0)}}{I_{(0)}}
$$

These impedances may be defined from the characteristics (supplied by the manufacturers) of the various elements in the given electrical network. Among these characteristics, we can note that $Z_{(2)} \approx Z_{(1)}$, except for rotating machines, whereas $Z_{(0)}$ varies depending on each element (see **Fig. 24**).

For further information on this subject, a detailed presentation of this method for calculating solid and impedance fault currents is contained in the "Cahier Technique" n° 18 (see the appended bibliography).

| Elements | $Z_{(0)}$ |
|---|---|
| **Transformer** (seen from secondary winding) | |
| No neutral | ∞ |
| Yyn or Zyn | free flux: ∞ / forced flux: 10 to 15 $X_{(1)}$ |
| Dyn or YNyn | $X_{(1)}$ |
| Dzn or Yzn | 0.1 to 0.2 $X_{(1)}$ |
| **Machine** | |
| Synchronous | ≈ 0.5 $Z_{(1)}$ |
| Asynchronous | ≈ 0 |
| **Line** | ≈ 3 $Z_{(1)}$ |

*Fig. 24 : Zero-sequence characteristic of the various elements in an electrical network.*

## 3.3 Calculation as defined by IEC 60909

Standard IEC 60909 defines and presents a method implementing symmetrical components, that may be used by engineers not specialised in the field.

The method is applicable to electrical networks with a nominal voltage of less than 550 kV and the standard explains the calculation of minimum and maximum short-circuit currents.

The former is required in view of calibrating overcurrent protection devices and the latter is used to determine the rated characteristics for the electrical equipment.

**Procedure**

**1**- Calculate the equivalent voltage at the fault location, equal to c Un / $\sqrt{3}$ where c is a voltage factor required in the calculation to account for:
- Voltage variations in space and in time
- Possible changes in transformer tappings
- Subtransient behaviour of generators and motors

Depending on the required calculations and the given voltage levels, the standardised voltage levels are indicated in **Figure 25**.

**2**- Determine and add up the equivalent positive-sequence, negative-sequence and zero-sequence impedances upstream of the fault location.

**3**- Calculate the initial short-circuit current using the symmetrical components. Practically speaking and depending on the type of fault, the equations required for the calculation of the Isc are indicated in the table in **Figure 26**.

**4**- Once the rms value of the initial short-circuit current ($I_k''$) is known, it is possible to calculate the other values:

$i_p$, peak value,

| Rated voltage Un | Voltage factor c for calculation of | |
|---|---|---|
| | Isc max. | Isc min. |
| **LV (100 to 1000 V)** | | |
| If tolerance + 6% | 1.05 | 0.95 |
| If tolerance + 10% | 1.1 | 0.95 |
| **MV and HV** | | |
| 1 to 550 kV | 1.1 | 1 |

*Fig. 25 : Values for voltage factor c (see IEC 60909).*

$I_b$, rms value of the symmetrical short-circuit breaking current,

$i_{dc}$, aperiodic component,

$I_k$, rms value of the steady-state short-circuit current.

**Effect of the distance separating the fault from the generator**

When using this method, two different possibilities must always be considered:

- The short-circuit is far from the generator, the situation in networks where the short-circuit currents do not have a damped, alternating component

This is generally the case in LV networks, except when high-power loads are supplied by special HV substations;

- The short-circuit is near the generator (see fig. 11), the situation in networks where the short-circuit currents do have a damped, alternating component. This generally occurs in HV systems, but may occur in LV systems when, for example, an emergency generator supplies priority outgoers.

| Type of short-circuit | I''k - General situation | Fault occurring far from rotating machines |
|---|---|---|
| Three-phase (any Ze) | $I''_{k3} = \dfrac{c\ Un}{\sqrt{3}\,\|Z_{(1)}\|}$ | $I''_{k3} = \dfrac{c\ Un}{\sqrt{3}\,\|Z_{(1)}\|}$ |
| | In both cases, the short-circuit current depends only on Z(1), which is generally replaced by Z_k the short-circuit impedance at the fault location, defined by $Z_k = \sqrt{R_k^2 + X_k^2}$ where: R_k is the sum of the resistances of one phase, connected in series; X_k is the sum of the reactances of one phase, connected in series. | |
| Phase-to-phase clear of earth (Ze = ∞) | $I''_{k2} = \dfrac{c\ Un}{\|Z_{(1)} + Z_{(2)}\|}$ | $I''_{k2} = \dfrac{c\ Un}{2\,\|Z_{(1)}\|}$ |
| Phase-to-earth | $I''_{k1} = \dfrac{c\ Un\sqrt{3}}{\|Z_{(1)} + Z_{(2)} + Z_{(0)}\|}$ | $I''_{k1} = \dfrac{c\ Un\sqrt{3}}{\|2\,Z_{(1)} + Z_{(0)}\|}$ |
| Phase-to-phase-to-earth (Zsc between phases = 0) (see fig. 5c) | $I''_{kE2E} = \dfrac{c\ Un\sqrt{3}\,\|Z_i\|}{\|Z_{(1)}\,Z_{(2)} + Z_{(2)}\,Z_{(0)} + Z_{(1)}\,Z_{(0)}\|}$ | $I''_{kE2E} = \dfrac{c\ Un\sqrt{3}}{\|Z_{(1)} + 2\,Z_{(0)}\|}$ |
| | $I''_{k2EL2} = \dfrac{c\ Un\,\|Z_{(0)} - a Z_{(2)}\|}{\|Z_{(1)}\,Z_{(2)} + Z_{(2)}\,Z_{(0)} + Z_{(1)}\,Z_{(0)}\|}$ | $I''_{k2EL2} = \dfrac{c\ Un\left\|\dfrac{Z_{(0)}}{Z_{(1)}} - a\right\|}{\|Z_{(1)} + 2\,Z_{(0)}\|}$ |
| | $I''_{k2EL3} = \dfrac{c\ Un\,\|Z_{(0)} - a^2 Z_{(2)}\|}{\|Z_{(1)}\,Z_{(2)} + Z_{(2)}\,Z_{(0)} + Z_{(1)}\,Z_{(0)}\|}$ | $I''_{k2EL3} = \dfrac{c\ Un\left\|\dfrac{Z_{(0)}}{Z_{(1)}} - a^2\right\|}{\|Z_{(1)} + 2\,Z_{(0)}\|}$ |
| **Symbol used in this table:** | ■ phase-to-phase rms voltage of the three-phase network = Un ■ modulus of the short-circuit current = I''k ■ symmetrical impedances = Z(1) , Z(2) , Z(0) | ■ short-circuit impedance = Zsc ■ earth impedance = Ze. |

*Fig. 26 : Short-circuit values depending on the impedances of the given network (see IEC 60909).*

The main differences between these two cases are:

■ For short-circuits far from the generator

□ The initial ($I''_k$), steady-state ($I_k$) and breaking ($I_b$) short-circuit currents are equal ($I''_k = I_k = I_b$)

□ The positive-sequence ($Z_{(1)}$) and negative sequence ($Z_{(2)}$) impedances are equal ($Z_{(1)} = Z_{(2)}$)

Note however that asynchronous motors may also add to a short-circuit, accounting for up to 30% of the network Isc for the first 30 milliseconds, in which case $I''_k = I_k = I_b$ no longer holds true.

**Conditions to consider when calculating the maximum and minimum short-circuit currents**

■ Calculation of the **maximum** short-circuit currents must take into account the following points

□ Application of the correct voltage factor c corresponding to calculation of the maximum short-circuit currents

□ Among the assumptions and approximations mentioned in this document, only those leading to a conservative error should be used

□ The resistances per unit length R_L of lines (overhead lines, cables, phase and neutral conductors) should be calculated for a temperature of 20 °C

■ Calculation of the minimum short-circuit currents requires

□ Applying the voltage factor c corresponding to the minimum permissible voltage on the network

□ Selecting the network configuration, and in some cases the minimum contribution from sources and network feeders, which result in the lowest short-circuit current at the fault location

□ Taking into account the impedance of the busbars, the current transformers, etc.

□ Considering resistances R_L at the highest foreseeable temperature

$$R_L = \left[1 + \frac{0.004}{°C}\,(\theta_e - 20\,°C)\right] \times R_{L20}$$

where $R_{L20}$ is the resistance at 20 °C; $\theta_e$ is the permissible temperature (°C) for the conductor at the end of the short-circuit.

The factor 0.004 / °C is valid for copper, aluminium and aluminium alloys.

# Impedance correction factors

Impedance-correction factors were included in IEC 60909 to meet requirements in terms of technical accuracy and simplicity when calculating short-circuit currents. The various factors, presented here, must be applied to the short-circuit impedances of certain elements in the distribution system.

■ Factor $K_T$ for distribution transformers with two or three windings

$$Z_{TK} = K_T Z_T$$

$$K_T = 0.95 \frac{c_{\max}}{1 + 0.6x_T}$$

where $x_T$ is the relative reactance of the transformer:

$$x_T = X_T \frac{S_{rT}}{U_{rT}^2}$$

and $c_{\max}$ is the voltage factor related to the nominal voltage of the network connected to the low-voltage side of the network transformer. The impedance correction factor must also be applied to the transformer negative-sequence and zero-sequence impedances when calculating unbalanced short-circuit currents. Impedances $Z_N$ between the transformer starpoints and earth must be introduced as $3Z_N$ in the zero-sequence system without a correction factor.

■ Factors $K_G$ and $K_S$ or $K_{SO}$ are introduced when calculating the short-circuit impedances of generators and power station units (with or without on-load tap-changers)

The subtransient impedance in the positive-sequence network must be calculated by:

$$Z_{GK} = K_G Z_G = K_G \left(R_G + jX_d''\right)$$

with $R_G$ representing the stator resistance of a synchronous machine and the correction factor

$$K_G = \frac{U_n}{U_{rG}} \cdot \frac{c_{\max}}{1 + x_d'' \sin \varphi_{rG}}$$

It is advised to use the following values for $R_{Gf}$ (fictitious resistance of the stator of a synchronous machine) when calculating the peak short-circuit current.

$R_{Gf} = 0.05 X_d''$ for generators with $U_{rG} > 1\,\text{kV}$ et $S_{rG} \geqslant 100\,\text{MVA}$

$R_{Gf} = 0.07 X_d''$ for generators with $U_{rG} > 1\,\text{kV}$ et $S_{rG} < 100\,\text{MVA}$

$R_{Gf} = 0.15 X_d''$ for generators with $U_{rG} \leqslant 1000\,\text{V}$

The impedance of a power station unit with an on-load tap-changer is calculated by:

$$Z_S = K_S \left(t_r^2 Z_G + Z_{THV}\right)$$

with the correction factor:

$$K_S = \frac{U_{nQ}^2}{U_{rG}^2} \cdot \frac{U_{rTLV}^2}{U_{rTHV}^2} \cdot \frac{c_{\max}}{1 + \left|x_d'' - x_T\right| \sin \varphi_{rG}}$$

and $t_r = \dfrac{U_{rTHV}}{U_{rTLV}}$

$Z_S$ is used to calculate the short-circuit current for a fault outside the power station unit with an on-load tap-changer.

The impedance of a power station unit without an on-load tap-changer is calculated by:

$$Z_{SO} = K_{SO} \left(t_r^2 Z_G + Z_{THV}\right)$$

with the correction factor:

$$K_{SO} = \frac{U_{nQ}}{U_{rG}\left(1 + p_G\right)} \cdot \frac{U_{rTLV}}{U_{rTHV}} \cdot \left(1 \pm p_T\right) \frac{c_{\max}}{1 + x_d'' \sin \varphi_{rG}}$$

$Z_{SO}$ is used to calculate the short-circuit current for a fault outside the power station unit without an on-load tap-changer.

■ Factors $K_{G,S}$, $K_{T,S}$ or $K_{G,SO}$, $K_{T,SO}$ are used when calculating the partial short-circuit currents for a short-circuit between the generator and the transformer (with or without an on-load tap-changer) of a power station unit

□ Power station units with an on-load tap-changer

$$I_{kG}'' = \frac{c\, U_{rG}}{\sqrt{3}\, K_{G,S} Z_G}$$

where:

$$K_{G,S} = \frac{c_{\max}}{1 + x_d'' \sin \varphi_{rG}}$$

$$K_{T,S} = \frac{c_{\max}}{1 - x_T \sin \varphi_{rG}}$$

□ Power station units without an on-load tap-changer

$$I_{kG}'' = \frac{c\, U_{rG}}{\sqrt{3}\, K_{G,SO} Z_G}$$

where:

$$K_{G,SO} = \frac{1}{1 + p_G} \cdot \frac{c_{\max}}{1 + x_d'' \sin \varphi_{rG}}$$

$$K_{T,SO} = \frac{1}{1 + p_G} \cdot \frac{c_{\max}}{1 - x_T \sin \varphi_{rG}}$$

# 3.4 Equations for the various currents

**Initial short-circuit current (I"k)**

The different initial short-circuit currents I"k are calculated using the equations in the table in figure 26.

**Peak short-circuit current i_p**

Peak value i_p of the short-circuit current In no meshed systems, the peak value ip of the short-circuit current may be calculated for all types of faults using the equation:

$$\mathrm{i_p} = \kappa \sqrt{2} \, \mathrm{I_k''} \text{ where}$$

$\mathrm{I_k''}$ = is the initial short-circuit current,

$\kappa$ = is a factor depending on the R / X and can be calculated approximately using the following equation (see fig.9) :

$$\kappa = 1.02 + 0.98 \, e^{-3\frac{\mathrm{R}}{\mathrm{X}}}$$

**Short-circuit breaking current I_b**

Calculation of the short-circuit breaking current I_b is required only when the fault is near the generator and protection is ensured by timedelayed circuit breakers. Note that this current is used to determine the breaking capacity of these circuit breakers.

This current may be calculated with a fair degree of accuracy using the following equation:

$$\mathrm{I_b} = \mu \cdot \mathrm{I_k''} \text{ where:}$$

where $\mu$ = is a factor defined by the minimum time delay $t_{\min}$ and the $\mathrm{I_k''} / \mathrm{Ir}$ ratio (see **Fig. 27**)

which expresses the influence of the subtransient and transient reactances, with Ir as the rated current of the generator.

**Steady-state short-circuit current I_k**

The amplitude of the steady-state short-circuit current I_k depends on generator saturation influences and calculation is therefore less accurate than for the initial symmetrical current I"k. The proposed calculation methods produce a sufficiently accurate estimate of the upper and lower limits, depending on whether the short-circuit is supplied by a generator or a synchronous machine.

■ The maximum steady-state short-circuit current, with the synchronous generator at its highest excitation, may be calculated by:

$$I_\mathrm{kmax} = \lambda_\mathrm{max} \, \mathrm{Ir}$$

■ The minimum steady-state short-circuit current is calculated under no-load, constant (minimum) excitation conditions for the synchronous generator and using the equation:

$$I_\mathrm{kmin} = \lambda_\mathrm{min} \, \mathrm{Ir}$$

$\lambda$ is a factor defined by the saturated synchronous reactance $X_\mathrm{d\,sat}$.

The $\lambda_\mathrm{max}$ and $\lambda_\mathrm{min}$ values are indicated on next the page in **Figure 28** for turbo-generators and in **Figure 29** for machines with salient poles (series 1 in IEC 60909).

*Fig. 27 : Factor μ used to calculate the short-circuit breaking current I_b (see IEC 60909).*

Fig. 28 : Factors $\lambda_{\max}$ and $\lambda_{\min}$ for turbo-generators (overexcitation = 1.3 as per IEC 60909).

Fig. 29 : Factors $\lambda_{\max}$ and $\lambda_{\min}$ for generators with salient poles (overexcitation = 1.6 as per IEC 60909).

# 3.5 Examples of short-circuit current calculations

## Problem 1. A transformer supplied by a network

A 20 kV network supplies a transformer T connected to a set of busbars by a cable L (see **Fig. 30**).

It is necessary to calculate, in compliance with IEC 60909, the initial short-circuit current $I_k''$ and the peak short-circuit current $i_p$ during a three-phase, then a phase-to-earth fault at point F1.

The following information is available:

- The impedance of the connection between the supply and transformer T may be neglected
- Cable L is made up of two parallel cables with three conductors each, where:
$l = 4\,\mathrm{m}$; $3 \times 185\,\mathrm{mm^2}$ Al
$Z_L = (0.208 + j0.068)\,\Omega/\mathrm{km}$
$R_{(0)L} = 4.23 R_L$; $X_{(0)L} = 1.21 X_L$
- The short-circuit at point F1 is assumed to be far from any generator

The following data apply to the transformer T (Dyn5):

$S_{rT} = 400\,\mathrm{kVA}$; $U_{rTHV} = 20\,\mathrm{kV}$; $U_{rTLV} = 410\,\mathrm{V}$; $U_{kr} = 4\%$; $P_{krT} = 4.6\,\mathrm{kW}$; $R_{(0)T} / R_T = 1.0$; $X_{(0)T} / X_T = 0.95$

Supply network: $U_{nQ} = 20\,\mathrm{kV}$; $I_{kQ}'' = 10\,\mathrm{kA}$

*Fig. 30*

## Solution:

- Three-phase fault at F1
- Impedance of the supply network (LV side)

$$
Z_{Qt} = \frac{c_Q U_{nQ}}{\sqrt{3}\, I_{kQ}''} \times \left(\frac{U_{rTLV}}{U_{rTHV}}\right)^2 = \frac{1.1 \times 20}{\sqrt{3} \times 10} \times \left(\frac{0.41}{20}\right)^2 = 0.534\,\mathrm{m\Omega}
$$

Failing other information, it is assumed that $\dfrac{R_Q}{X_Q} = 0.1$, hence:

$$X_{Qt} = 0.995 Z_{Qt} = 0.531 \text{ m}\Omega$$

$$R_{Qt} = 0.1 X_{Qt} = 0.053 \text{ m}\Omega$$

$$Z_{Qt} = (0.053 + j0.531) \text{ m}\Omega$$

■ Impedance of the transformer

$$Z_{TLV} = \frac{u_{kr}}{100} \times \frac{U_{rTLV}^{2}}{S_{rT}} = \frac{4}{100} \times \frac{(410)^2}{400 \times 10^3} = 16.81 \text{ m}\Omega$$

$$R_{TLV} = P_{krT} \frac{U_{rTLV}^{2}}{S_{rT}^{2}} = 4{,}600 \frac{(410)^2}{\left(400 \times 10^3\right)^2} = 4.83 \text{ m}\Omega$$

$$X_{TLV} = \sqrt{Z_{TLV}^{2} - R_{TLV}^{2}} = 16.10 \text{ m}\Omega$$

$$Z_{TLV} = (4.83 + j16.10) \text{ m}\Omega$$

$$x_{T} = X_{T} \frac{S_{rT}}{U_{rTLV}^{2}} = 16.10 \times \frac{400}{410^2} = 0.03831$$

The impedance correction factor can be calculated as:

$$K_{T} = 0.95 \frac{c_{\max}}{1 + 0.6 x_{T}} = 0.95 \frac{1.05}{1 + (0.6 \times 0.03831)} = 0.975$$

$$Z_{TK} = K_{T} Z_{TLV} = (4.71 + j15.70) \text{ m}\Omega$$

■ Impedance of the cable

$$Z_{L} = 0.5 \times (0.208 + j0.068) \times 4 \times 10^{-3} = (0.416 + j0.136) \text{ m}\Omega$$

■ Total impedance seen from point F1

$$Z_{k} = Z_{Qt} + Z_{TK} + Z_{L} = (5.18 + j16.37) \text{ m}\Omega$$

■ Calculation of $I_{k}^{''}$ and $i_p$ for a three-phase fault

$$I_{k}^{''} = \frac{c U_{n}}{\sqrt{3} Z_{k}} = \frac{1.05 \times 400}{\sqrt{3} \times 17.17} = \boxed{14.12 \text{ kA}}$$

$$\frac{R}{X} = \frac{R_{k}}{X_{k}} = \frac{5.18}{16.37} = 0.316$$

$$\kappa = 1.02 + 0.98\, e^{-3\frac{R}{X}} = 1.4$$

$$i_p = \kappa \sqrt{2} \times I_{k}^{''} = 1.4\sqrt{2} \times 14.12 = \boxed{27.96 \text{ kA}}$$

■ Phase-to-earth fault at F1

□ Determining the zero-sequence impedances

For transformer T (Dyn5 connection), the manufactures indicates:

$$R_{(0)T} = R_{T} \text{ and } X_{(0)T} = 0.95 X_{T}$$

with the impedance-correction factor $K_T$, the zero-sequence impedance is:

$$Z_{(0)TK} = K_{T}(R_{T} + j0.95 X_{T}) = (4.712 + j14.913) \text{ m}\Omega$$

For cable L:

$$Z_{(0)L} = (4.23 R_{L} + 1.21 X_{L}) = (1.76 + j0.165) \text{ m}\Omega$$

□ Calculation of $I_{k}^{''}$ and $i_p$ for a phase-to-earth fault

$$Z_{(1)} = Z_{(2)} = Z_{K} = (5.18 + j16.37) \text{ m}\Omega$$

$$Z_{(0)} = Z_{(0)TK} + Z_{(0)L} = (6.47 + j15.08) \text{ m}\Omega$$

$$Z_{(1)} + Z_{(2)} + Z_{(0)} = (16.83 + j47.82) \text{ m}\Omega$$

The initial phase-to-earth short-circuit current can be calculated using the equation below:

$$I_{k1}^{''} = \frac{c U_{n} \sqrt{3}}{\left| Z_{(1)} + Z_{(2)} + Z_{(0)} \right|} = \frac{1.05 \times 400\sqrt{3}}{50.70} = \boxed{14.35 \text{ kA}}$$

The peak short-circuit current $i_{p1}$ is calculated with the factor $\kappa$ obtained via the positive-sequence:

$$i_{p1} = \kappa \sqrt{2} \times I_{k1}^{''} = 1.4\sqrt{2} \times 14.35 = \boxed{28.41 \text{ kA}}$$

# Problem 2. A power station unit

A power station unit S comprises a generator G and a transformer T with an on-load tap-changer (see **Fig. 31**).

It is necessary to calculate, in compliance with IEC 60909, the initial short-circuit current $I''_k$ as well as the peak $i_p$ and steady-state $I_{kmax}$ short-circuit currents and the breaking short-circuit current $I_b$ during a three-phase fault:

- Outside the power station unit on the busbars at point F1
- Inside the power station unit at point F2

The following information is available:

- The impedance of the connection between generator G and transformer T may be neglected
- The voltage factor c is assumed to be 1.1
- The minimum dead time $t_{\min}$ for calculation of $I_b$ is 0.1 s
- Generator G is a cylindrical rotor generator (smooth poles)
- All loads connected to the busbars are passive

*Fig. 31*

# Solution:

- Three-phase fault at F1
- Impedance of the transformer

$$Z_{THV} = \frac{u_{kr}}{100} \times \frac{U^2_{rTHV}}{S_{rT}} = \frac{15}{100} \times \frac{240^2}{250} = 34.56 \ \Omega$$

$$R_{THV} = P_{krT} \frac{U^2_{rTHV}}{S^2_{rT}} = 0.52 \times \frac{240^2}{250^2} = 0.479 \ \Omega$$

$$X_{THV} = \sqrt{Z^2_{THV} - R^2_{THV}} = 34.557 \ \Omega$$

$$Z_{THV} = (0.479 + j34.557) \ \Omega$$

- Impedance of the generator

$$X''_d = \frac{x''_d}{100} \times \frac{U^2_{rG}}{S_{rG}} = \frac{17}{100} \times \frac{21^2}{250} = 0.2999 \ \Omega$$

$$Z_G = R_G + jX''_d = 0.0025 + j0.2999$$

$$|Z_G| = 0.2999 \ \Omega$$

$S_{rG} > 100 \ \text{MVA}$, therefore $R_{Gf} = 0.05 \ X''_d$, hence $Z_{Gf} = 0.015 + j0.2999$

$$K_S = \frac{U^2_{nQ}}{U^2_{rG}} \times \frac{U^2_{rTLV}}{U^2_{rTHV}} \times \frac{c_{\max}}{1 + |x''_d - x_T| \sin \varphi_{rG}} = \frac{220^2}{21^2} \times \frac{21^2}{240^2} \times \frac{1.1}{1 + |0.17 - 0.15| \times 0.6258} = 0.913$$

$$Z_S = K_S(t_r^2 Z_G + Z_{THV}) = 0.913\left(\left(\frac{240}{21}\right)^2 \times (0.0025 + j0.2999) + (0.479 + j34.557)\right)$$

$$Z_S = 0.735 + j67.313 \qquad (Z_{Sf} = 2.226 + j67.313 \text{ if we consider } Z_{Gf} \text{ (to calculate ip)})$$

$$I''_{kS} = \frac{cU_{nQ}}{\sqrt{3}Z_S} = \frac{1.1 \times 220}{\sqrt{3}(0.735 + j67.313)} = 0.023 - j2.075$$

$$\left|I''_{kS}\right| = 2.08 \ \text{kA}$$

Based on impedance $Z_{Sf}$, it is possible to calculate $R_{Sf} / X_{Sf} = 0.033$ and $\kappa_{S} = 1.908$

The peak short-circuit current $i_{pS}$ is calculated by:

$$i_{pS} = \kappa_{S} \sqrt{2} \times I_{kS}^{''}$$

$$i_{pS} = 1.908\sqrt{2} \times 2.08 = \textbf{5.61 kA}$$

The short-circuit breaking current $I_{bS}$ is calculated by:

$$I_{bS} = \mu \times I_{kS}^{''}$$

Factor $\mu$ is a function of ratio $I_{kG}^{''} / I_{rG}$ and the minimum dead time $t_{min}$.

Ratio $I_{kG}^{''} / I_{rG}$ is calculated by:

$$\frac{I_{kG}}{I_{rG}} = \frac{I_{kS}^{''}}{I_{rG}} \frac{U_{rTHV}}{U_{rTLV}} = \frac{2.08}{6.873} \cdot \frac{240}{21} = 3.46$$

According to figure 27 (curve at $t_{min} = 0.1$ s), $\mu \approx 0.85$, hence:

$$I_{bS} = 0.85 \times 2.08 = \textbf{1.77 kA}$$

The maximal steady-state short-circuit current $I_{kmax}$ is calculated by:

$$I_{kS} = \lambda_{max} \, I_{rG} \, \frac{U_{rTLV}}{U_{rTHV}} = 1.65 \times 6.873 \times \frac{21}{240} = \textbf{0.99 kA}$$

Factor $\lambda_{max} = 1.65$ is obtained in figure 28 for the ratio $I_{kG}^{''} / I_{rG} = 3.46$ and $x_{dsat} = 2.0$

■ **Three-phase fault at F2**

$$I_{kG}^{''} = \frac{c \, U_{rG}}{\sqrt{3} \, K_{G,S} Z_{G}}$$

where:

$$K_{G,S} = \frac{c_{max}}{1 + x_{d}^{'} \sin \varphi_{rG}} = \frac{1.1}{1 + (0.17 \times 0.626)} = 0.994$$

$$I_{kG}^{''} = \frac{c \, U_{rG}}{\sqrt{3} \, K_{G,S} Z_{G}} = \frac{1.1 \times 21}{\sqrt{3} \times 0.994 \times 0.2999} = \textbf{44.74 kA}$$

The peak short-circuit current $i_{pG}$ is calculated by:

$$i_{pG} = \kappa_{G} \sqrt{2} \times I_{kG}^{''}$$

Based on impedance $Z_{Gf}$, it is possible to calculate $R_{Gf} / X_{d}^{''} = 0.05$, hence $\kappa_{G} = 1.86$

$$i_{pG} = 1.86\sqrt{2} \times 44.74 = \textbf{117.69 kA}$$

The short-circuit breaking current $I_{bG}$ is calculated by:

$$I_{bG} = \mu \times I_{kG}^{''}$$

Factor $\mu$ is a function of ratio $I_{kG}^{''} / I_{rG}$ and the minimum dead time $t_{min}$.

Ratio $I_{kG}^{''} / I_{rG}$ is calculated by:

$$\frac{I_{kG}^{''}}{I_{rG}} = \frac{44.74}{6.873} = 6.51$$

According to figure 27 (curve at $t_{min} = 0.1$ s), $\mu \approx 0.71$, hence:

$$I_{bS} = 0.71 \times 44.74 = \textbf{31.77 kA}$$

The maximum steady-state short-circuit current $I_{kmax}$ is calculated by:

$$I_{kG} = \lambda_{max} \, I_{rG} = 1.75 \times 6.873 = \textbf{12.0 kA}$$

Factor $\lambda_{max} = 1.75$ is obtained in figure 28 for the ratio $I_{kG}^{''} / I_{rG} = 6.51$ and $x_{dsat} = 2.0$

# 4 Conclusion

Various methods for the calculation of short-circuit currents have been developed and subsequently included in standards and in this "Cahier Technique" publication as well.

A number of these methods were initially designed in such a way that short-circuit currents could be calculated by hand or using a small calculator. Over the years, the standards have been revised and the methods have often been modified to provide greater accuracy and a better representation of reality. However, in the process, they have become more complicated and time-consuming, as is demonstrated by the recent changes in IEC 60909, where hand calculations are possible only for the most simple cases.

With the development of ever more sophisticated computerised calculations, electrical-installation designers have developed software meeting their particular needs. Today, a number of software packages comply with the applicable standards, for example Ecodial, a program designed for low-voltage installations and marketed by Schneider Electric.

All computer programs designed to calculate short-circuit currents are predominantly concerned with:
- Determining the required breaking and making capacities of switchgear and the electro-mechanical withstand capabilities of equipment
- Determining the settings for protection relays and fuse ratings to ensure a high level of discrimination in the electrical network

Other software is used by experts specialising in electrical network design, for example to study the dynamic behaviour of electrical networks. Such computer programs can be used for precise simulations of electrical phenomena over time and their use is now spreading to include the entire electro-mechanical behaviour of networks and installations.

Remember, however, that all software, whatever its degree of sophistication, is only a tool. To ensure correct results, it should be used by qualified professionals who have acquired the relevant knowledge and experience.

# Bibliography

**Standards**

- EC 60909: Short-circuit currents in three-phase AC systems.
- □ Part 0: Calculation of currents.
- □ Part 1: Factors for the calculation of short-circuit currents.
- □ Part 2: Electrical equipment. Data for short-circuit current calculations.
- □ Part 3: Currents during two separate simultaneous single phase line-to-earth short circuits and partial short-circuit currents flowing through earth.
- □ Part 4: Examples for the calculation of short-circuit currents.
- NF C 15-100: Installations électriques à basse tension.
- C 15-105: Guide pratique. Détermination des sections de conducteurs et choix des dispositifs de protection.

**Schneider Electric Cahiers Techniques**

- Analysis of three-phase networks in disturbed operating conditions using symmetrical components, Cahier Technique no. 18 - B. DE METZ-NOBLAT.
- Neutral earthing in an industrial HV network. Cahier Technique no. 62 - F. SAUTRIAU.
- LV circuit-breaker breaking capacity. Cahier Technique no. 154 - R. MOREL.

**Other publications**

- Electrical Installation Guide
In English in accordance with IEC 60364: 2005 edition.
In French in accordance with NF C15-100: 2004 edition.
Published by Schneider Electric (Schneider Training Institute).
- Les réseaux d'énergie électrique (Part 2), R. PELISSIER. Published by Dunod.

**Schneider Electric** &emsp; Direction Scientifique et Technique, &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; DTP: Axess
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Service Communication Technique &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Transl.: Cabinet Harder - Grenoble - France
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; F-38050 Grenoble cedex 9 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Editor: Schneider Electric

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; E-mail : fr-tech-com@schneider-electric.com

11-05

© 2005 Schneider Electric
