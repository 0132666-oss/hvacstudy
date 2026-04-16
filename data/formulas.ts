import { Formula, MathCategory, CategoryMeta } from "@/types/math";

export const CATEGORY_META: Record<MathCategory, CategoryMeta> = {
  ohm: {
    label: "Ohm's Law",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
  },
  power: {
    label: "Power",
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-700",
  },
  efficiency: {
    label: "Efficiency & Losses",
    color: "emerald",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
  },
  trigonometry: {
    label: "Trigonometry",
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
  },
};

export const FORMULAS: Formula[] = [
  // Ohm's Law (3)
  {
    id: "ohm-v",
    category: "ohm",
    label: "V = IR",
    formula: "V = I × R",
    variables: [
      { symbol: "V", name: "Voltage", unit: "V (Volts)" },
      { symbol: "I", name: "Current", unit: "A (Amps)" },
      { symbol: "R", name: "Resistance", unit: "Ω (Ohms)" },
    ],
  },
  {
    id: "ohm-i",
    category: "ohm",
    label: "I = V/R",
    formula: "I = V ÷ R",
    variables: [
      { symbol: "I", name: "Current", unit: "A (Amps)" },
      { symbol: "V", name: "Voltage", unit: "V (Volts)" },
      { symbol: "R", name: "Resistance", unit: "Ω (Ohms)" },
    ],
  },
  {
    id: "ohm-r",
    category: "ohm",
    label: "R = V/I",
    formula: "R = V ÷ I",
    variables: [
      { symbol: "R", name: "Resistance", unit: "Ω (Ohms)" },
      { symbol: "V", name: "Voltage", unit: "V (Volts)" },
      { symbol: "I", name: "Current", unit: "A (Amps)" },
    ],
  },
  // Power (5)
  {
    id: "power-vi",
    category: "power",
    label: "P = VI",
    formula: "P = V × I",
    variables: [
      { symbol: "P", name: "Power", unit: "W (Watts)" },
      { symbol: "V", name: "Voltage", unit: "V (Volts)" },
      { symbol: "I", name: "Current", unit: "A (Amps)" },
    ],
  },
  {
    id: "power-i2r",
    category: "power",
    label: "P = I²R",
    formula: "P = I² × R",
    variables: [
      { symbol: "P", name: "Power", unit: "W (Watts)" },
      { symbol: "I", name: "Current", unit: "A (Amps)" },
      { symbol: "R", name: "Resistance", unit: "Ω (Ohms)" },
    ],
  },
  {
    id: "power-v2r",
    category: "power",
    label: "P = V²/R",
    formula: "P = V² ÷ R",
    variables: [
      { symbol: "P", name: "Power", unit: "W (Watts)" },
      { symbol: "V", name: "Voltage", unit: "V (Volts)" },
      { symbol: "R", name: "Resistance", unit: "Ω (Ohms)" },
    ],
  },
  {
    id: "power-ipv",
    category: "power",
    label: "I = P/V",
    formula: "I = P ÷ V",
    variables: [
      { symbol: "I", name: "Current", unit: "A (Amps)" },
      { symbol: "P", name: "Power", unit: "W (Watts)" },
      { symbol: "V", name: "Voltage", unit: "V (Volts)" },
    ],
  },
  {
    id: "power-vpi",
    category: "power",
    label: "V = P/I",
    formula: "V = P ÷ I",
    variables: [
      { symbol: "V", name: "Voltage", unit: "V (Volts)" },
      { symbol: "P", name: "Power", unit: "W (Watts)" },
      { symbol: "I", name: "Current", unit: "A (Amps)" },
    ],
  },
  // Efficiency & Losses (4)
  {
    id: "eff-eta",
    category: "efficiency",
    label: "η = (Pout/Pin) × 100%",
    formula: "η = (Pout ÷ Pin) × 100%",
    variables: [
      { symbol: "η", name: "Efficiency", unit: "%" },
      { symbol: "Pout", name: "Output Power", unit: "W" },
      { symbol: "Pin", name: "Input Power", unit: "W" },
    ],
  },
  {
    id: "eff-losses",
    category: "efficiency",
    label: "Losses = Pin - Pout",
    formula: "Losses = Pin - Pout",
    variables: [
      { symbol: "Losses", name: "Power Losses", unit: "W" },
      { symbol: "Pin", name: "Input Power", unit: "W" },
      { symbol: "Pout", name: "Output Power", unit: "W" },
    ],
  },
  {
    id: "eff-pout",
    category: "efficiency",
    label: "Pout = Pin - Losses",
    formula: "Pout = Pin - Losses",
    variables: [
      { symbol: "Pout", name: "Output Power", unit: "W" },
      { symbol: "Pin", name: "Input Power", unit: "W" },
      { symbol: "Losses", name: "Power Losses", unit: "W" },
    ],
  },
  {
    id: "eff-pout-eta",
    category: "efficiency",
    label: "Pout = Pin × (η/100)",
    formula: "Pout = Pin × (η ÷ 100)",
    variables: [
      { symbol: "Pout", name: "Output Power", unit: "W" },
      { symbol: "Pin", name: "Input Power", unit: "W" },
      { symbol: "η", name: "Efficiency", unit: "%" },
    ],
  },
  // Trigonometry (4)
  {
    id: "trig-sin",
    category: "trigonometry",
    label: "sin θ = opposite / hypotenuse",
    formula: "sin θ = a ÷ c",
    variables: [
      { symbol: "θ", name: "Angle", unit: "degrees" },
      { symbol: "a", name: "Opposite side (반대변)", unit: "" },
      { symbol: "c", name: "Hypotenuse (빗변)", unit: "" },
    ],
  },
  {
    id: "trig-cos",
    category: "trigonometry",
    label: "cos θ = adjacent / hypotenuse",
    formula: "cos θ = b ÷ c",
    variables: [
      { symbol: "θ", name: "Angle", unit: "degrees" },
      { symbol: "b", name: "Adjacent side (인접변)", unit: "" },
      { symbol: "c", name: "Hypotenuse (빗변)", unit: "" },
    ],
  },
  {
    id: "trig-tan",
    category: "trigonometry",
    label: "tan θ = opposite / adjacent",
    formula: "tan θ = a ÷ b",
    variables: [
      { symbol: "θ", name: "Angle", unit: "degrees" },
      { symbol: "a", name: "Opposite side (반대변)", unit: "" },
      { symbol: "b", name: "Adjacent side (인접변)", unit: "" },
    ],
  },
  {
    id: "trig-pythagoras",
    category: "trigonometry",
    label: "c² = a² + b²",
    formula: "c² = a² + b²",
    variables: [
      { symbol: "c", name: "Hypotenuse (빗변)", unit: "" },
      { symbol: "a", name: "Opposite side (반대변)", unit: "" },
      { symbol: "b", name: "Adjacent side (인접변)", unit: "" },
    ],
  },
];
