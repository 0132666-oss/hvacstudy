export type WrongNoteSource = "learning" | "math";

export interface WrongNote {
  id: string;
  source: WrongNoteSource;
  category: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  hint?: string;
  formulaLabel?: string;
  keyWords: string[];
  missingWords: string[];
  addedAt: number;
  reviewedAt?: number;
  mastered: boolean;
  attemptCount: number;
}
