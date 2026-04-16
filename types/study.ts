export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  base64: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "short";
  question: string;
  options?: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
}

export interface StudyContent {
  title: string;
  summary: string[];
  keyTerms: KeyTerm[];
  questions: QuizQuestion[];
}

export interface ShortAnswerResult {
  correct: boolean;
  feedback: string;
  keyWords: string[];
  missingWords: string[];
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  userAnswer: string;
  feedback?: string;
  keyWords?: string[];
  missingWords?: string[];
}

export type PipelineStep = "idle" | "analyzing" | "validating" | "ready";

export type StudySource = "pdf" | "image" | "notes";

export interface StudySession {
  id: string;
  source: StudySource;
  title: string;
  content: StudyContent;
  createdAt: number;
}
