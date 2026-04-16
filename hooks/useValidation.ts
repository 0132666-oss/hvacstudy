"use client";

import { useState, useCallback } from "react";
import { StudyContent, QuizQuestion } from "@/types/study";

const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";
const MODEL = "claude-sonnet-4-20250514";
const API_URL = "https://api.anthropic.com/v1/messages";

export interface QuestionValidation {
  questionId: string;
  isCorrect: boolean;
  issue?: string;
  correctedAnswer?: string;
  correctedExplanation?: string;
}

export interface ValidationResult {
  status: "passed" | "corrected" | "failed";
  corrections: QuestionValidation[];
  correctedContent: StudyContent;
}

export function useValidation() {
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const validate = useCallback(async (content: StudyContent): Promise<ValidationResult | null> => {
    setValidating(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1500,
          system: `You are an HVAC education quality assurance expert for Australian TAFE.
Review these generated quiz questions and verify:
1. The correct answer is actually correct
2. MCQ options are reasonable and unambiguous
3. Explanations are accurate
4. Content aligns with Australian standards (AS/NZS)

Return ONLY valid JSON:
{
  "corrections": [
    {
      "questionId": "q1",
      "isCorrect": true
    },
    {
      "questionId": "q2",
      "isCorrect": false,
      "issue": "What was wrong",
      "correctedAnswer": "The correct answer",
      "correctedExplanation": "Updated explanation"
    }
  ]
}`,
          messages: [
            {
              role: "user",
              content: `Review these HVAC quiz questions:\n${JSON.stringify(content.questions, null, 2)}`,
            },
          ],
        }),
      });

      if (!res.ok) throw new Error(`Validation API error: ${res.status}`);

      const data = await res.json();
      const text = data.content[0].text;
      const parsed = JSON.parse(text);

      const corrections: QuestionValidation[] = parsed.corrections;
      const hasCorrections = corrections.some((c) => !c.isCorrect);

      // Apply corrections to content
      const correctedQuestions: QuizQuestion[] = content.questions.map((q) => {
        const correction = corrections.find((c) => c.questionId === q.id);
        if (correction && !correction.isCorrect) {
          return {
            ...q,
            correctAnswer: correction.correctedAnswer || q.correctAnswer,
            explanation: correction.correctedExplanation || q.explanation,
          };
        }
        return q;
      });

      const result: ValidationResult = {
        status: hasCorrections ? "corrected" : "passed",
        corrections,
        correctedContent: { ...content, questions: correctedQuestions },
      };

      setValidationResult(result);
      return result;
    } catch {
      // On error, use original content
      const fallback: ValidationResult = {
        status: "failed",
        corrections: [],
        correctedContent: content,
      };
      setValidationResult(fallback);
      return fallback;
    } finally {
      setValidating(false);
    }
  }, []);

  return { validate, validating, validationResult };
}
