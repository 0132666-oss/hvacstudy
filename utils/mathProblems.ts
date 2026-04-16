import { MathProblem, MathCategory, Difficulty, TriangleDiagram } from "@/types/math";

const HVAC_CONTEXTS = {
  lamp: "a lamp",
  heater: "a heater element",
  fan: "a fan motor",
  compressor: "a compressor",
  thermostat: "a thermostat circuit",
  condenser: "a condenser fan",
  evaporator: "an evaporator coil heater",
  solenoid: "a solenoid valve",
};

const VOLTAGES = [12, 24, 120, 240];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number, decimals = 1): number {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

function contextName(): string {
  return pick(Object.values(HVAC_CONTEXTS));
}

type ProblemGenerator = () => MathProblem;

// ── EASY: basic whole numbers, no unit conversion ──
const easyGenerators: ProblemGenerator[] = [
  // Ohm: find I (easy)
  () => {
    const V = pick(VOLTAGES);
    const R = pick([10, 20, 40, 50, 100]);
    const I = V / R;
    return {
      id: `e-ohm-i-${Date.now()}`, category: "ohm", difficulty: "easy",
      question: `A ${V}V supply is connected to ${contextName()} with ${R}Ω resistance. Calculate the current (I).`,
      answer: Number(I.toFixed(2)), tolerance: 0.05, unit: "A",
      formulaLabel: "I = V/R",
      hint: `Step 1: Identify — V = ${V}V, R = ${R}Ω, find I = ?\nStep 2: Formula — I = V ÷ R\nStep 3: Substitute — I = ${V} ÷ ${R}\nStep 4: Calculate — I = ${I.toFixed(2)} A`,
      explanation: `I = V ÷ R = ${V} ÷ ${R} = ${I.toFixed(2)} A`,
    };
  },
  // Ohm: find V (easy)
  () => {
    const I = pick([1, 2, 3, 5, 10]);
    const R = pick([10, 20, 50, 100]);
    const V = I * R;
    return {
      id: `e-ohm-v-${Date.now()}`, category: "ohm", difficulty: "easy",
      question: `A current of ${I}A flows through ${contextName()} with ${R}Ω resistance. Calculate the voltage (V).`,
      answer: V, tolerance: 0.5, unit: "V",
      formulaLabel: "V = IR",
      hint: `Step 1: Identify — I = ${I}A, R = ${R}Ω, find V = ?\nStep 2: Formula — V = I × R\nStep 3: Substitute — V = ${I} × ${R}\nStep 4: Calculate — V = ${V} V`,
      explanation: `V = I × R = ${I} × ${R} = ${V} V`,
    };
  },
  // Power: P = VI (easy)
  () => {
    const V = pick(VOLTAGES);
    const I = pick([1, 2, 5, 10]);
    const P = V * I;
    return {
      id: `e-pow-vi-${Date.now()}`, category: "power", difficulty: "easy",
      question: `${contextName()} runs on ${V}V and draws ${I}A. Calculate the power (P).`,
      answer: P, tolerance: 1, unit: "W",
      formulaLabel: "P = VI",
      hint: `Step 1: Identify — V = ${V}V, I = ${I}A, find P = ?\nStep 2: Formula — P = V × I\nStep 3: Substitute — P = ${V} × ${I}\nStep 4: Calculate — P = ${P} W`,
      explanation: `P = V × I = ${V} × ${I} = ${P} W`,
    };
  },
  // Efficiency (easy)
  () => {
    const Pin = pick([1000, 2000, 3000, 5000]);
    const eta = pick([50, 60, 75, 80, 90]);
    const Pout = Pin * (eta / 100);
    return {
      id: `e-eff-${Date.now()}`, category: "efficiency", difficulty: "easy",
      question: `${contextName()} has ${Pin}W input and ${eta}% efficiency. Calculate output power (Pout).`,
      answer: Pout, tolerance: 1, unit: "W",
      formulaLabel: "Pout = Pin × (η/100)",
      hint: `Step 1: Identify — Pin = ${Pin}W, η = ${eta}%, find Pout = ?\nStep 2: Formula — Pout = Pin × (η ÷ 100)\nStep 3: Convert — ${eta} ÷ 100 = ${(eta / 100).toFixed(2)}\nStep 4: Multiply — Pout = ${Pin} × ${(eta / 100).toFixed(2)} = ${Pout} W`,
      explanation: `Pout = ${Pin} × ${(eta / 100).toFixed(2)} = ${Pout} W`,
    };
  },
];

// ── MEDIUM: decimals, more formulas, basic trig ──
const mediumGenerators: ProblemGenerator[] = [
  // Ohm: find R
  () => {
    const V = pick(VOLTAGES);
    const I = rand(0.5, 10);
    const R = V / I;
    return {
      id: `m-ohm-r-${Date.now()}`, category: "ohm", difficulty: "medium",
      question: `${contextName()} operates at ${V}V and draws ${I}A. Calculate the resistance (R).`,
      answer: Number(R.toFixed(2)), tolerance: 0.5, unit: "Ω",
      formulaLabel: "R = V/I",
      hint: `Step 1: Identify — V = ${V}V, I = ${I}A, find R = ?\nStep 2: Formula — R = V ÷ I\nStep 3: Substitute — R = ${V} ÷ ${I}\nStep 4: Calculate — R = ${R.toFixed(2)} Ω`,
      explanation: `R = V ÷ I = ${V} ÷ ${I} = ${R.toFixed(2)} Ω`,
    };
  },
  // Power: P = I²R
  () => {
    const I = rand(1, 8);
    const R = rand(10, 50, 0);
    const Isq = I * I;
    const P = Isq * R;
    return {
      id: `m-pow-i2r-${Date.now()}`, category: "power", difficulty: "medium",
      question: `A current of ${I}A flows through ${contextName()} with ${R}Ω. Calculate the power (P) using P = I²R.`,
      answer: Number(P.toFixed(2)), tolerance: 1, unit: "W",
      formulaLabel: "P = I²R",
      hint: `Step 1: Identify — I = ${I}A, R = ${R}Ω, find P = ?\nStep 2: Formula — P = I² × R\nStep 3: Square — I² = ${I}² = ${Isq.toFixed(2)}\nStep 4: Multiply — P = ${Isq.toFixed(2)} × ${R} = ${P.toFixed(2)} W`,
      explanation: `P = I² × R = ${Isq.toFixed(2)} × ${R} = ${P.toFixed(2)} W`,
    };
  },
  // I = P/V
  () => {
    const V = pick(VOLTAGES);
    const P = rand(100, 3000, 0);
    const I = P / V;
    return {
      id: `m-pow-ipv-${Date.now()}`, category: "power", difficulty: "medium",
      question: `${contextName()} consumes ${P}W on a ${V}V supply. Calculate the current (I).`,
      answer: Number(I.toFixed(2)), tolerance: 0.05, unit: "A",
      formulaLabel: "I = P/V",
      hint: `Step 1: Identify — P = ${P}W, V = ${V}V, find I = ?\nStep 2: Formula — I = P ÷ V\nStep 3: Substitute — I = ${P} ÷ ${V}\nStep 4: Calculate — I = ${I.toFixed(2)} A`,
      explanation: `I = P ÷ V = ${P} ÷ ${V} = ${I.toFixed(2)} A`,
    };
  },
  // Efficiency: find η
  () => {
    const Pin = rand(500, 5000, 0);
    const Pout = rand(300, Pin - 50, 0);
    const eta = (Pout / Pin) * 100;
    return {
      id: `m-eff-eta-${Date.now()}`, category: "efficiency", difficulty: "medium",
      question: `${contextName()} has input ${Pin}W and output ${Pout}W. Calculate efficiency (η) in %.`,
      answer: Number(eta.toFixed(1)), tolerance: 0.5, unit: "%",
      formulaLabel: "η = (Pout/Pin) × 100%",
      hint: `Step 1: Identify — Pin = ${Pin}W, Pout = ${Pout}W, find η = ?\nStep 2: Formula — η = (Pout ÷ Pin) × 100\nStep 3: Divide — ${Pout} ÷ ${Pin} = ${(Pout / Pin).toFixed(4)}\nStep 4: Multiply — ${(Pout / Pin).toFixed(4)} × 100 = ${eta.toFixed(1)}%`,
      explanation: `η = (${Pout} ÷ ${Pin}) × 100 = ${eta.toFixed(1)}%`,
    };
  },
  // Trig: sin
  () => {
    const theta = rand(15, 75, 0);
    const c = rand(5, 20);
    const sinVal = Math.sin((theta * Math.PI) / 180);
    const a = c * sinVal;
    const triangle: TriangleDiagram = { sideC: c, angleTheta: theta, unknownSide: "a" };
    return {
      id: `m-trig-sin-${Date.now()}`, category: "trigonometry", difficulty: "medium",
      question: `Hypotenuse c = ${c}, angle θ = ${theta}°. Find the opposite side (a).`,
      answer: Number(a.toFixed(2)), tolerance: 0.1, unit: "",
      formulaLabel: "sin θ = a/c",
      hint: `Step 1: Identify — c = ${c}, θ = ${theta}°, find a = ?\nStep 2: Formula — a = c × sin θ\nStep 3: sin(${theta}°) = ${sinVal.toFixed(4)}\nStep 4: a = ${c} × ${sinVal.toFixed(4)} = ${a.toFixed(2)}`,
      explanation: `a = ${c} × sin(${theta}°) = ${a.toFixed(2)}`,
      triangle,
    };
  },
  // Trig: Pythagoras
  () => {
    const a = rand(3, 12);
    const b = rand(3, 12);
    const aSq = a * a; const bSq = b * b; const sum = aSq + bSq;
    const c = Math.sqrt(sum);
    const triangle: TriangleDiagram = { sideA: a, sideB: b, unknownSide: "c" };
    return {
      id: `m-trig-pyth-${Date.now()}`, category: "trigonometry", difficulty: "medium",
      question: `Right triangle: a = ${a}, b = ${b}. Find hypotenuse (c).`,
      answer: Number(c.toFixed(2)), tolerance: 0.1, unit: "",
      formulaLabel: "c² = a² + b²",
      hint: `Step 1: Identify — a = ${a}, b = ${b}, find c = ?\nStep 2: Formula — c = √(a² + b²)\nStep 3: Square — a² = ${aSq.toFixed(2)}, b² = ${bSq.toFixed(2)}\nStep 4: Add — ${aSq.toFixed(2)} + ${bSq.toFixed(2)} = ${sum.toFixed(2)}\nStep 5: √${sum.toFixed(2)} = ${c.toFixed(2)}`,
      explanation: `c = √(${aSq.toFixed(2)} + ${bSq.toFixed(2)}) = ${c.toFixed(2)}`,
      triangle,
    };
  },
];

// ── HARD: SI prefix conversions (kΩ, mA, kW, MΩ, µA) ──
const hardGenerators: ProblemGenerator[] = [
  // kΩ → find I in mA
  () => {
    const V = pick(VOLTAGES);
    const Rk = rand(1, 50);
    const R = Rk * 1000;
    const I = V / R;
    const ImA = I * 1000;
    return {
      id: `h-ohm-kR-${Date.now()}`, category: "ohm", difficulty: "hard",
      question: `${V}V is applied across ${contextName()} with ${Rk}kΩ resistance. Calculate the current in mA.`,
      answer: Number(ImA.toFixed(2)), tolerance: 0.1, unit: "mA",
      formulaLabel: "I = V/R",
      hint: `Step 1: Convert — ${Rk}kΩ = ${Rk} × 1000 = ${R}Ω\nStep 2: Formula — I = V ÷ R\nStep 3: Calculate — I = ${V} ÷ ${R} = ${I.toFixed(6)} A\nStep 4: Convert — ${I.toFixed(6)} A × 1000 = ${ImA.toFixed(2)} mA`,
      explanation: `${Rk}kΩ = ${R}Ω → I = ${V} ÷ ${R} = ${I.toFixed(6)} A = ${ImA.toFixed(2)} mA`,
    };
  },
  // MΩ → find I in µA
  () => {
    const V = pick(VOLTAGES);
    const RM = rand(1, 10);
    const R = RM * 1e6;
    const I = V / R;
    const IuA = I * 1e6;
    return {
      id: `h-ohm-MR-${Date.now()}`, category: "ohm", difficulty: "hard",
      question: `${V}V is applied across ${contextName()} with ${RM}MΩ resistance. Calculate the current in µA.`,
      answer: Number(IuA.toFixed(2)), tolerance: 0.5, unit: "µA",
      formulaLabel: "I = V/R",
      hint: `Step 1: Convert — ${RM}MΩ = ${RM} × 1,000,000 = ${R.toLocaleString()}Ω\nStep 2: Formula — I = V ÷ R\nStep 3: Calculate — I = ${V} ÷ ${R.toLocaleString()} = ${I.toExponential(4)} A\nStep 4: Convert — × 1,000,000 = ${IuA.toFixed(2)} µA`,
      explanation: `${RM}MΩ = ${R.toLocaleString()}Ω → I = ${V}/${R.toLocaleString()} = ${IuA.toFixed(2)} µA`,
    };
  },
  // mA + kΩ → find V
  () => {
    const ImA = rand(1, 50);
    const I = ImA / 1000;
    const Rk = rand(1, 20);
    const R = Rk * 1000;
    const V = I * R;
    return {
      id: `h-ohm-mAkR-${Date.now()}`, category: "ohm", difficulty: "hard",
      question: `${ImA}mA flows through ${contextName()} with ${Rk}kΩ. Calculate the voltage (V).`,
      answer: Number(V.toFixed(2)), tolerance: 0.5, unit: "V",
      formulaLabel: "V = IR",
      hint: `Step 1: Convert — ${ImA}mA = ${ImA} ÷ 1000 = ${I.toFixed(4)}A\nStep 2: Convert — ${Rk}kΩ = ${Rk} × 1000 = ${R}Ω\nStep 3: Formula — V = I × R\nStep 4: Calculate — V = ${I.toFixed(4)} × ${R} = ${V.toFixed(2)} V`,
      explanation: `${ImA}mA = ${I.toFixed(4)}A, ${Rk}kΩ = ${R}Ω → V = ${I.toFixed(4)} × ${R} = ${V.toFixed(2)} V`,
    };
  },
  // kW conversion
  () => {
    const V = pick(VOLTAGES);
    const I = rand(10, 50);
    const P = V * I;
    const PkW = P / 1000;
    return {
      id: `h-pow-kW-${Date.now()}`, category: "power", difficulty: "hard",
      question: `${contextName()} runs on ${V}V and draws ${I}A. Calculate the power in kW.`,
      answer: Number(PkW.toFixed(3)), tolerance: 0.01, unit: "kW",
      formulaLabel: "P = VI",
      hint: `Step 1: Identify — V = ${V}V, I = ${I}A, find P in kW\nStep 2: Formula — P = V × I\nStep 3: Calculate — P = ${V} × ${I} = ${P} W\nStep 4: Convert — ${P} W ÷ 1000 = ${PkW.toFixed(3)} kW`,
      explanation: `P = ${V} × ${I} = ${P} W = ${PkW.toFixed(3)} kW`,
    };
  },
  // W to kW efficiency
  () => {
    const PinkW = rand(2, 20);
    const Pin = PinkW * 1000;
    const Pout = rand(500, Pin - 100, 0);
    const eta = (Pout / Pin) * 100;
    return {
      id: `h-eff-kW-${Date.now()}`, category: "efficiency", difficulty: "hard",
      question: `${contextName()} has ${PinkW}kW input and ${Pout}W output. Calculate efficiency (η) in %.`,
      answer: Number(eta.toFixed(1)), tolerance: 0.5, unit: "%",
      formulaLabel: "η = (Pout/Pin) × 100%",
      hint: `Step 1: Convert — ${PinkW}kW = ${PinkW} × 1000 = ${Pin}W\nStep 2: Formula — η = (Pout ÷ Pin) × 100\nStep 3: Divide — ${Pout} ÷ ${Pin} = ${(Pout / Pin).toFixed(4)}\nStep 4: × 100 = ${eta.toFixed(1)}%`,
      explanation: `${PinkW}kW = ${Pin}W → η = (${Pout}/${Pin}) × 100 = ${eta.toFixed(1)}%`,
    };
  },
  // Trig: arcsin → find θ
  () => {
    const a = rand(2, 10);
    const c = rand(a + 1, a + 10);
    const ratio = a / c;
    const theta = (Math.asin(ratio) * 180) / Math.PI;
    const triangle: TriangleDiagram = { sideA: a, sideC: c, unknownSide: "theta" };
    return {
      id: `h-trig-arcsin-${Date.now()}`, category: "trigonometry", difficulty: "hard",
      question: `Right triangle: opposite a = ${a}, hypotenuse c = ${c}. Find angle θ in degrees.`,
      answer: Number(theta.toFixed(1)), tolerance: 0.5, unit: "°",
      formulaLabel: "θ = arcsin(a/c)",
      hint: `Step 1: Identify — a = ${a}, c = ${c}, find θ = ?\nStep 2: Formula — θ = sin⁻¹(a ÷ c)\nStep 3: Divide — ${a} ÷ ${c} = ${ratio.toFixed(4)}\nStep 4: sin⁻¹(${ratio.toFixed(4)}) = ${theta.toFixed(1)}°`,
      explanation: `θ = sin⁻¹(${a}/${c}) = sin⁻¹(${ratio.toFixed(4)}) = ${theta.toFixed(1)}°`,
      triangle,
    };
  },
  // Trig: tan with conversion
  () => {
    const theta = rand(15, 65, 0);
    const b = rand(3, 15);
    const tanVal = Math.tan((theta * Math.PI) / 180);
    const a = b * tanVal;
    const triangle: TriangleDiagram = { sideB: b, angleTheta: theta, unknownSide: "a" };
    return {
      id: `h-trig-tan-${Date.now()}`, category: "trigonometry", difficulty: "hard",
      question: `Adjacent b = ${b}, angle θ = ${theta}°. Find opposite side (a) using tan.`,
      answer: Number(a.toFixed(2)), tolerance: 0.1, unit: "",
      formulaLabel: "tan θ = a/b",
      hint: `Step 1: Identify — b = ${b}, θ = ${theta}°, find a = ?\nStep 2: Formula — a = b × tan θ\nStep 3: tan(${theta}°) = ${tanVal.toFixed(4)}\nStep 4: a = ${b} × ${tanVal.toFixed(4)} = ${a.toFixed(2)}`,
      explanation: `a = ${b} × tan(${theta}°) = ${a.toFixed(2)}`,
      triangle,
    };
  },
];

const allByDifficulty: Record<Difficulty, ProblemGenerator[]> = {
  easy: easyGenerators,
  medium: mediumGenerators,
  hard: hardGenerators,
};

export function generateProblems(count: number = 8): MathProblem[] {
  const problems: MathProblem[] = [];

  // Distribution: 3 easy, 3 medium, 2 hard
  const distribution: Difficulty[] = ["easy", "easy", "easy", "medium", "medium", "medium", "hard", "hard"];

  for (let i = 0; i < Math.min(count, distribution.length); i++) {
    const diff = distribution[i];
    const gens = allByDifficulty[diff];
    problems.push(pick(gens)());
  }

  // Fill any extra
  while (problems.length < count) {
    problems.push(pick(mediumGenerators)());
  }

  // Shuffle
  for (let i = problems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [problems[i], problems[j]] = [problems[j], problems[i]];
  }

  return problems.map((p, idx) => ({ ...p, id: `${p.id}-${idx}` }));
}
