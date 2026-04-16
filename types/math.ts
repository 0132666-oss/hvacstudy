export type MathCategory = "ohm" | "power" | "efficiency" | "trigonometry";

export interface Formula {
  id: string;
  category: MathCategory;
  label: string;
  formula: string;
  variables: { symbol: string; name: string; unit: string }[];
}

export type Difficulty = "easy" | "medium" | "hard";

export interface MathProblem {
  id: string;
  category: MathCategory;
  difficulty: Difficulty;
  question: string;
  answer: number;
  tolerance: number;
  unit: string;
  formulaLabel: string;
  hint: string;
  explanation: string;
  triangle?: TriangleDiagram;
}

export interface TriangleDiagram {
  sideA?: number;
  sideB?: number;
  sideC?: number;
  angleTheta?: number;
  unknownSide: "a" | "b" | "c" | "theta";
}

export interface CategoryMeta {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}
