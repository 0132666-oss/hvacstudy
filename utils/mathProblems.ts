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
      hint: "Use Ohm's Law: I = V ÷ R",
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
      hint: "Use Ohm's Law: V = I × R",
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
      hint: "Use Ohm's Law: R = V ÷ I",
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
      hint: "Power = Voltage × Current",
      explanation: `P = V × I = ${V} × ${I} = ${P.toFixed(2)} W`,
    };
  },
  // Power: P = I²R
  () => {
    const I = rand(1, 8);
    const R = rand(10, 50, 0);
    const P = I * I * R;
    return {
      id: `power-i2r-${Date.now()}`,
      category: "power",
      question: `A current of ${I}A flows through ${contextName()} with ${R}Ω. Calculate the power (P) using P = I²R.`,
      answer: Number(P.toFixed(2)),
      tolerance: 0.5,
      unit: "W",
      formulaLabel: "P = I²R",
      hint: "P = I² × R — square the current first, then multiply by resistance",
      explanation: `P = I² × R = ${I}² × ${R} = ${(I * I).toFixed(2)} × ${R} = ${P.toFixed(2)} W`,
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
      hint: "I = P ÷ V",
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
      hint: "V = P ÷ I",
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
      hint: "η = (Pout ÷ Pin) × 100",
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
      hint: "Losses = Input Power - Output Power",
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
      hint: "Pout = Pin × (η ÷ 100)",
      explanation: `Pout = ${Pin} × (${eta} ÷ 100) = ${Pout.toFixed(1)} W`,
    };
  },
  // Trig: sin → find a (opposite)
  () => {
    const theta = rand(15, 75, 0);
    const c = rand(5, 20);
    const a = c * Math.sin((theta * Math.PI) / 180);
    const triangle: TriangleDiagram = { sideC: c, angleTheta: theta, unknownSide: "a" };
    return {
      id: `trig-sin-a-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has hypotenuse c = ${c} and angle θ = ${theta}°. Find the opposite side (a) using sin.`,
      answer: Number(a.toFixed(2)),
      tolerance: 0.05,
      unit: "",
      formulaLabel: "sin θ = a/c",
      hint: "a = c × sin θ",
      explanation: `a = c × sin(${theta}°) = ${c} × ${Math.sin((theta * Math.PI) / 180).toFixed(4)} = ${a.toFixed(2)}`,
      triangle,
    };
  },
  // Trig: cos → find b (adjacent)
  () => {
    const theta = rand(15, 75, 0);
    const c = rand(5, 20);
    const b = c * Math.cos((theta * Math.PI) / 180);
    const triangle: TriangleDiagram = { sideC: c, angleTheta: theta, unknownSide: "b" };
    return {
      id: `trig-cos-b-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has hypotenuse c = ${c} and angle θ = ${theta}°. Find the adjacent side (b) using cos.`,
      answer: Number(b.toFixed(2)),
      tolerance: 0.05,
      unit: "",
      formulaLabel: "cos θ = b/c",
      hint: "b = c × cos θ",
      explanation: `b = c × cos(${theta}°) = ${c} × ${Math.cos((theta * Math.PI) / 180).toFixed(4)} = ${b.toFixed(2)}`,
      triangle,
    };
  },
  // Trig: tan → find a (opposite)
  () => {
    const theta = rand(15, 65, 0);
    const b = rand(3, 15);
    const a = b * Math.tan((theta * Math.PI) / 180);
    const triangle: TriangleDiagram = { sideB: b, angleTheta: theta, unknownSide: "a" };
    return {
      id: `trig-tan-a-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has adjacent side b = ${b} and angle θ = ${theta}°. Find the opposite side (a) using tan.`,
      answer: Number(a.toFixed(2)),
      tolerance: 0.05,
      unit: "",
      formulaLabel: "tan θ = a/b",
      hint: "a = b × tan θ",
      explanation: `a = b × tan(${theta}°) = ${b} × ${Math.tan((theta * Math.PI) / 180).toFixed(4)} = ${a.toFixed(2)}`,
      triangle,
    };
  },
  // Trig: Pythagoras → find c
  () => {
    const a = rand(3, 12);
    const b = rand(3, 12);
    const c = Math.sqrt(a * a + b * b);
    const triangle: TriangleDiagram = { sideA: a, sideB: b, unknownSide: "c" };
    return {
      id: `trig-pyth-c-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has sides a = ${a} and b = ${b}. Find the hypotenuse (c).`,
      answer: Number(c.toFixed(2)),
      tolerance: 0.05,
      unit: "",
      formulaLabel: "c² = a² + b²",
      hint: "c = √(a² + b²)",
      explanation: `c = √(${a}² + ${b}²) = √(${(a * a).toFixed(2)} + ${(b * b).toFixed(2)}) = √${(a * a + b * b).toFixed(2)} = ${c.toFixed(2)}`,
      triangle,
    };
  },
  // Trig: arcsin → find θ
  () => {
    const a = rand(2, 10);
    const c = rand(a + 1, a + 10);
    const theta = (Math.asin(a / c) * 180) / Math.PI;
    const triangle: TriangleDiagram = { sideA: a, sideC: c, unknownSide: "theta" };
    return {
      id: `trig-arcsin-${Date.now()}`,
      category: "trigonometry",
      question: `A right triangle has opposite side a = ${a} and hypotenuse c = ${c}. Find the angle θ in degrees.`,
      answer: Number(theta.toFixed(1)),
      tolerance: 0.5,
      unit: "°",
      formulaLabel: "θ = arcsin(a/c)",
      hint: "θ = sin⁻¹(a ÷ c)",
      explanation: `θ = sin⁻¹(${a} ÷ ${c}) = sin⁻¹(${(a / c).toFixed(4)}) = ${theta.toFixed(1)}°`,
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
