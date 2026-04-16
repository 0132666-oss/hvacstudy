import { MathProblem, MathCategory, TriangleDiagram } from "@/types/math";

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

const generators: ProblemGenerator[] = [
  // Ohm: find I
  () => {
    const V = pick(VOLTAGES);
    const R = rand(10, 200, 0);
    const I = V / R;
    return {
      id: `ohm-find-i-${Date.now()}`,
      category: "ohm",
      question: `A ${V}V supply is connected to ${contextName()} with a resistance of ${R}Ω. Calculate the current (I).`,
      answer: Number(I.toFixed(2)),
      tolerance: 0.01,
      unit: "A",
      formulaLabel: "I = V/R",
      hint: `Step 1: Identify — V = ${V}V, R = ${R}Ω, find I = ?\nStep 2: Formula — I = V ÷ R\nStep 3: Substitute — I = ${V} ÷ ${R}\nStep 4: Calculate — I = ${I.toFixed(2)} A`,
      explanation: `I = V ÷ R = ${V} ÷ ${R} = ${I.toFixed(2)} A`,
    };
  },
  // Ohm: find V
  () => {
    const I = rand(0.5, 10);
    const R = rand(10, 100, 0);
    const V = I * R;
    return {
      id: `ohm-find-v-${Date.now()}`,
      category: "ohm",
      question: `A current of ${I}A flows through ${contextName()} with ${R}Ω resistance. Calculate the voltage (V).`,
      answer: Number(V.toFixed(2)),
      tolerance: 0.1,
      unit: "V",
      formulaLabel: "V = IR",
      hint: `Step 1: Identify — I = ${I}A, R = ${R}Ω, find V = ?\nStep 2: Formula — V = I × R\nStep 3: Substitute — V = ${I} × ${R}\nStep 4: Calculate — V = ${V.toFixed(2)} V`,
      explanation: `V = I × R = ${I} × ${R} = ${V.toFixed(2)} V`,
    };
  },
  // Ohm: find R
  () => {
    const V = pick(VOLTAGES);
    const I = rand(0.5, 10);
    const R = V / I;
    return {
      id: `ohm-find-r-${Date.now()}`,
      category: "ohm",
      question: `${contextName()} operates at ${V}V and draws ${I}A. Calculate the resistance (R).`,
      answer: Number(R.toFixed(2)),
      tolerance: 0.1,
      unit: "Ω",
      formulaLabel: "R = V/I",
      hint: `Step 1: Identify — V = ${V}V, I = ${I}A, find R = ?\nStep 2: Formula — R = V ÷ I\nStep 3: Substitute — R = ${V} ÷ ${I}\nStep 4: Calculate — R = ${R.toFixed(2)} Ω`,
      explanation: `R = V ÷ I = ${V} ÷ ${I} = ${R.toFixed(2)} Ω`,
    };
  },
  // Power: P = VI
  () => {
    const V = pick(VOLTAGES);
    const I = rand(1, 15);
    const P = V * I;
    return {
      id: `power-vi-${Date.now()}`,
      category: "power",
      question: `${contextName()} runs on ${V}V and draws ${I}A. Calculate the power (P).`,
      answer: Number(P.toFixed(2)),
      tolerance: 0.5,
      unit: "W",
      formulaLabel: "P = VI",
      hint: `Step 1: Identify — V = ${V}V, I = ${I}A, find P = ?\nStep 2: Formula — P = V × I\nStep 3: Substitute — P = ${V} × ${I}\nStep 4: Calculate — P = ${P.toFixed(2)} W`,
      explanation: `P = V × I = ${V} × ${I} = ${P.toFixed(2)} W`,
    };
  },
  // Power: P = I²R
  () => {
    const I = rand(1, 8);
    const R = rand(10, 50, 0);
    const Isq = I * I;
    const P = Isq * R;
    return {
      id: `power-i2r-${Date.now()}`,
      category: "power",
      question: `A current of ${I}A flows through ${contextName()} with ${R}Ω. Calculate the power (P) using P = I²R.`,
      answer: Number(P.toFixed(2)),
      tolerance: 0.5,
      unit: "W",
      formulaLabel: "P = I²R",
      hint: `Step 1: Identify — I = ${I}A, R = ${R}Ω, find P = ?\nStep 2: Formula — P = I² × R\nStep 3: Square the current — I² = ${I}² = ${Isq.toFixed(2)}\nStep 4: Multiply — P = ${Isq.toFixed(2)} × ${R} = ${P.toFixed(2)} W`,
      explanation: `P = I² × R = ${I}² × ${R} = ${Isq.toFixed(2)} × ${R} = ${P.toFixed(2)} W`,
    };
  },
  // Power: I = P/V
  () => {
    const V = pick(VOLTAGES);
    const P = rand(100, 3000, 0);
    const I = P / V;
    return {
      id: `power-ipv-${Date.now()}`,
      category: "power",
      question: `${contextName()} consumes ${P}W on a ${V}V supply. Calculate the current (I).`,
      answer: Number(I.toFixed(2)),
      tolerance: 0.01,
      unit: "A",
      formulaLabel: "I = P/V",
      hint: `Step 1: Identify — P = ${P}W, V = ${V}V, find I = ?\nStep 2: Formula — I = P ÷ V\nStep 3: Substitute — I = ${P} ÷ ${V}\nStep 4: Calculate — I = ${I.toFixed(2)} A`,
      explanation: `I = P ÷ V = ${P} ÷ ${V} = ${I.toFixed(2)} A`,
    };
  },
  // Power: V = P/I
  () => {
    const I = rand(1, 15);
    const P = rand(100, 3000, 0);
    const V = P / I;
    return {
      id: `power-vpi-${Date.now()}`,
      category: "power",
      question: `${contextName()} uses ${P}W and draws ${I}A. Calculate the voltage (V).`,
      answer: Number(V.toFixed(2)),
      tolerance: 0.1,
      unit: "V",
      formulaLabel: "V = P/I",
      hint: `Step 1: Identify — P = ${P}W, I = ${I}A, find V = ?\nStep 2: Formula — V = P ÷ I\nStep 3: Substitute — V = ${P} ÷ ${I}\nStep 4: Calculate — V = ${V.toFixed(2)} V`,
      explanation: `V = P ÷ I = ${P} ÷ ${I} = ${V.toFixed(2)} V`,
    };
  },
  // Efficiency: find η
  () => {
    const Pin = rand(500, 5000, 0);
    const Pout = rand(300, Pin - 50, 0);
    const eta = (Pout / Pin) * 100;
    return {
      id: `eff-eta-${Date.now()}`,
      category: "efficiency",
      question: `${contextName()} has an input power of ${Pin}W and output power of ${Pout}W. Calculate the efficiency (η) in %.`,
      answer: Number(eta.toFixed(1)),
      tolerance: 0.5,
      unit: "%",
      formulaLabel: "η = (Pout/Pin) × 100%",
      hint: `Step 1: Identify — Pin = ${Pin}W, Pout = ${Pout}W, find η = ?\nStep 2: Formula — η = (Pout ÷ Pin) × 100\nStep 3: Divide — ${Pout} ÷ ${Pin} = ${(Pout / Pin).toFixed(4)}\nStep 4: Multiply — ${(Pout / Pin).toFixed(4)} × 100 = ${eta.toFixed(1)}%`,
      explanation: `η = (${Pout} ÷ ${Pin}) × 100 = ${eta.toFixed(1)}%`,
    };
  },
  // Efficiency: find Losses
  () => {
    const Pin = rand(500, 5000, 0);
    const Pout = rand(300, Pin - 50, 0);
    const losses = Pin - Pout;
    return {
      id: `eff-losses-${Date.now()}`,
      category: "efficiency",
      question: `${contextName()} has ${Pin}W input and ${Pout}W output. Calculate the power losses.`,
      answer: losses,
      tolerance: 0.1,
      unit: "W",
      formulaLabel: "Losses = Pin - Pout",
      hint: `Step 1: Identify — Pin = ${Pin}W, Pout = ${Pout}W, find Losses = ?\nStep 2: Formula — Losses = Pin - Pout\nStep 3: Substitute — Losses = ${Pin} - ${Pout}\nStep 4: Calculate — Losses = ${losses} W`,
      explanation: `Losses = ${Pin} - ${Pout} = ${losses} W`,
    };
  },
  // Efficiency: find Pout
  () => {
    const Pin = rand(500, 5000, 0);
    const eta = rand(60, 95, 0);
    const Pout = Pin * (eta / 100);
    return {
      id: `eff-pout-${Date.now()}`,
      category: "efficiency",
      question: `${contextName()} has ${Pin}W input power and ${eta}% efficiency. Calculate the output power (Pout).`,
      answer: Number(Pout.toFixed(1)),
      tolerance: 0.5,
      unit: "W",
      formulaLabel: "Pout = Pin × (η/100)",
      hint: `Step 1: Identify — Pin = ${Pin}W, η = ${eta}%, find Pout = ?\nStep 2: Formula — Pout = Pin × (η ÷ 100)\nStep 3: Convert — ${eta} ÷ 100 = ${(eta / 100).toFixed(2)}\nStep 4: Multiply — Pout = ${Pin} × ${(eta / 100).toFixed(2)} = ${Pout.toFixed(1)} W`,
      explanation: `Pout = ${Pin} × (${eta} ÷ 100) = ${Pout.toFixed(1)} W`,
    };
  },
  // Trig: sin → find a (opposite)
  () => {
    const theta = rand(15, 75, 0);
    const c = rand(5, 20);
    const sinVal = Math.sin((theta * Math.PI) / 180);
    const a = c * sinVal;
    const triangle: TriangleDiagram = { sideC: c, angleTheta: theta, unknownSide: "a" };
    return {
      id: `trig-sin-a-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has hypotenuse c = ${c} and angle θ = ${theta}°. Find the opposite side (a) using sin.`,
      answer: Number(a.toFixed(2)),
      tolerance: 0.05,
      unit: "",
      formulaLabel: "sin θ = a/c",
      hint: `Step 1: Identify — c = ${c}, θ = ${theta}°, find a = ?\nStep 2: Formula — sin θ = a/c → a = c × sin θ\nStep 3: Find sin(${theta}°) = ${sinVal.toFixed(4)}\nStep 4: Multiply — a = ${c} × ${sinVal.toFixed(4)} = ${a.toFixed(2)}`,
      explanation: `a = c × sin(${theta}°) = ${c} × ${sinVal.toFixed(4)} = ${a.toFixed(2)}`,
      triangle,
    };
  },
  // Trig: cos → find b (adjacent)
  () => {
    const theta = rand(15, 75, 0);
    const c = rand(5, 20);
    const cosVal = Math.cos((theta * Math.PI) / 180);
    const b = c * cosVal;
    const triangle: TriangleDiagram = { sideC: c, angleTheta: theta, unknownSide: "b" };
    return {
      id: `trig-cos-b-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has hypotenuse c = ${c} and angle θ = ${theta}°. Find the adjacent side (b) using cos.`,
      answer: Number(b.toFixed(2)),
      tolerance: 0.05,
      unit: "",
      formulaLabel: "cos θ = b/c",
      hint: `Step 1: Identify — c = ${c}, θ = ${theta}°, find b = ?\nStep 2: Formula — cos θ = b/c → b = c × cos θ\nStep 3: Find cos(${theta}°) = ${cosVal.toFixed(4)}\nStep 4: Multiply — b = ${c} × ${cosVal.toFixed(4)} = ${b.toFixed(2)}`,
      explanation: `b = c × cos(${theta}°) = ${c} × ${cosVal.toFixed(4)} = ${b.toFixed(2)}`,
      triangle,
    };
  },
  // Trig: tan → find a (opposite)
  () => {
    const theta = rand(15, 65, 0);
    const b = rand(3, 15);
    const tanVal = Math.tan((theta * Math.PI) / 180);
    const a = b * tanVal;
    const triangle: TriangleDiagram = { sideB: b, angleTheta: theta, unknownSide: "a" };
    return {
      id: `trig-tan-a-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has adjacent side b = ${b} and angle θ = ${theta}°. Find the opposite side (a) using tan.`,
      answer: Number(a.toFixed(2)),
      tolerance: 0.05,
      unit: "",
      formulaLabel: "tan θ = a/b",
      hint: `Step 1: Identify — b = ${b}, θ = ${theta}°, find a = ?\nStep 2: Formula — tan θ = a/b → a = b × tan θ\nStep 3: Find tan(${theta}°) = ${tanVal.toFixed(4)}\nStep 4: Multiply — a = ${b} × ${tanVal.toFixed(4)} = ${a.toFixed(2)}`,
      explanation: `a = b × tan(${theta}°) = ${b} × ${tanVal.toFixed(4)} = ${a.toFixed(2)}`,
      triangle,
    };
  },
  // Trig: Pythagoras → find c
  () => {
    const a = rand(3, 12);
    const b = rand(3, 12);
    const aSq = a * a;
    const bSq = b * b;
    const sum = aSq + bSq;
    const c = Math.sqrt(sum);
    const triangle: TriangleDiagram = { sideA: a, sideB: b, unknownSide: "c" };
    return {
      id: `trig-pyth-c-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has sides a = ${a} and b = ${b}. Find the hypotenuse (c).`,
      answer: Number(c.toFixed(2)),
      tolerance: 0.05,
      unit: "",
      formulaLabel: "c² = a² + b²",
      hint: `Step 1: Identify — a = ${a}, b = ${b}, find c = ?\nStep 2: Formula — c = √(a² + b²)\nStep 3: Square each — a² = ${aSq.toFixed(2)}, b² = ${bSq.toFixed(2)}\nStep 4: Add — ${aSq.toFixed(2)} + ${bSq.toFixed(2)} = ${sum.toFixed(2)}\nStep 5: Square root — c = √${sum.toFixed(2)} = ${c.toFixed(2)}`,
      explanation: `c = √(${a}² + ${b}²) = √(${aSq.toFixed(2)} + ${bSq.toFixed(2)}) = √${sum.toFixed(2)} = ${c.toFixed(2)}`,
      triangle,
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
      id: `trig-arcsin-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has opposite side a = ${a} and hypotenuse c = ${c}. Find the angle θ in degrees.`,
      answer: Number(theta.toFixed(1)),
      tolerance: 0.5,
      unit: "°",
      formulaLabel: "θ = arcsin(a/c)",
      hint: `Step 1: Identify — a = ${a}, c = ${c}, find θ = ?\nStep 2: Formula — θ = sin⁻¹(a ÷ c)\nStep 3: Divide — ${a} ÷ ${c} = ${ratio.toFixed(4)}\nStep 4: Inverse sin — θ = sin⁻¹(${ratio.toFixed(4)}) = ${theta.toFixed(1)}°`,
      explanation: `θ = sin⁻¹(${a} ÷ ${c}) = sin⁻¹(${ratio.toFixed(4)}) = ${theta.toFixed(1)}°`,
      triangle,
    };
  },
];

const categoryGenerators: Record<MathCategory, ProblemGenerator[]> = {
  ohm: generators.slice(0, 3),
  power: generators.slice(3, 7),
  efficiency: generators.slice(7, 10),
  trigonometry: generators.slice(10, 15),
};

export function generateProblems(count: number = 8): MathProblem[] {
  const problems: MathProblem[] = [];
  const categories: MathCategory[] = ["ohm", "power", "efficiency", "trigonometry"];

  // Ensure at least one from each category
  for (const cat of categories) {
    const gens = categoryGenerators[cat];
    problems.push(pick(gens)());
  }

  // Fill remaining
  while (problems.length < count) {
    const gen = pick(generators);
    problems.push(gen());
  }

  // Shuffle
  for (let i = problems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [problems[i], problems[j]] = [problems[j], problems[i]];
  }

  // Ensure unique IDs
  return problems.map((p, idx) => ({ ...p, id: `${p.id}-${idx}` }));
}
