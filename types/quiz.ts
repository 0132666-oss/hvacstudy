export type QuizSource = "uee" | "notes";

export interface QuizQuestion {
  id: string;
  type: "mcq" | "short";
  question: string;
  options?: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
}

export interface QuizSession {
  id: string;
  source: QuizSource;
  title: string;
  questions: QuizQuestion[];
  createdAt: number;
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  feedback?: string;
  keyWords?: string[];
  missingWords?: string[];
}

export interface QuizWrongNote {
  id: string;
  source: QuizSource;
  sessionTitle: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  hint?: string;
  keyWords: string[];
  missingWords: string[];
  addedAt: number;
  mastered: boolean;
  attemptCount: number;
}
