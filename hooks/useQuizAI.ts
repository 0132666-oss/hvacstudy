"use client";

import { useState, useCallback } from "react";
import { QuizQuestion } from "@/types/quiz";

const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";
const MODEL = "claude-haiku-4-5-20251001";
const API_URL = "https://api.anthropic.com/v1/messages";

interface ShortAnswerResult {
  correct: boolean;
  feedback: string;
  keyWords: string[];
  missingWords: string[];
}

async function callClaude(
  systemPrompt: string,
  userContent: Array<{ type: string; [key: string]: unknown }>,
  maxTokens: number
): Promise<string> {
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
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  let text = data.content[0].text;
  // Strip markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) text = jsonMatch[1].trim();
  return text;
}

const QUIZ_SYSTEM_PROMPT = `You are an HVAC exam writer for Australian TAFE Certificate III.
Generate HARD, DETAILED quiz questions from the provided study material.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "Topic/Unit title",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Question text?",
      "options": ["A) opt1", "B) opt2", "C) opt3", "D) opt4"],
      "correctAnswer": "A) opt1",
      "hint": "Helpful hint",
      "explanation": "Why correct"
    },
    {
      "id": "q6",
      "type": "short",
      "question": "Short answer question?",
      "correctAnswer": "Expected answer",
      "hint": "Helpful hint",
      "explanation": "Explanation"
    }
  ]
}

STRICTLY FORBIDDEN question types (NEVER generate these):
- "What does [abbreviation] stand for?"
- "What is the main objective/purpose of this unit?"
- "Which of the following is an objective of...?"
- Any question about the unit code, unit name, or unit structure
- Any question answerable without reading the technical content

REQUIRED question types (generate ONLY these):
- Specific voltage/current/resistance values mentioned in the text
- Circuit diagrams: component identification, fault finding steps
- Safety procedures: specific steps, order of operations, PPE requirements
- Australian Standards: specific AS/NZS numbers and what they require
- Formulas: Ohm's law applications, power calculations with specific values
- Troubleshooting: "If symptom X occurs, what is the most likely cause?"
- Tool/equipment usage: specific tools for specific tasks
- Wiring methods: color codes, termination procedures, testing methods

Rules:
- Generate exactly 8 questions: 5 MCQ + 3 short answer
- Every question must require reading the PDF content to answer
- Questions must be at TAFE exam difficulty level, not introductory
- All content in English
- Each question should cover a DIFFERENT topic from the material`;

const GRADING_PROMPT = `You are an HVAC exam grader. Grade the student's short answer.
Accept if meaning is correct and key technical concepts are present.
Be strict only on technical accuracy. Respond feedback in Korean.

Return ONLY valid JSON:
{
  "correct": true/false,
  "feedback": "Korean feedback 1-2 sentences",
  "keyWords": ["keyword1", "keyword2", "keyword3"],
  "missingWords": ["missed1"]
}`;

export function useQuizAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFromPDF = useCallback(
    async (pdfText: string, fileName: string): Promise<{ title: string; questions: QuizQuestion[] } | null> => {
      setLoading(true);
      setError(null);
      try {
        const truncated = pdfText.slice(0, 8000);
        const seed = Math.random().toString(36).slice(2, 8);
        const text = await callClaude(
          QUIZ_SYSTEM_PROMPT,
          [
            {
              type: "text",
              text: `[Seed: ${seed}] This is content from a UEE TAFE unit PDF (${fileName}):\n\n${truncated}\n\nGenerate a UNIQUE set of quiz questions. Focus on different sections and details each time.`,
            },
          ],
          2500
        );
        return JSON.parse(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate quiz from PDF");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateFromNotes = useCallback(
    async (
      noteText: string,
      images: Array<{ base64: string; mimeType: string }>
    ): Promise<{ title: string; questions: QuizQuestion[] } | null> => {
      setLoading(true);
      setError(null);
      try {
        const userContent: Array<{ type: string; [key: string]: unknown }> = [];

        // Add images
        for (const img of images) {
          userContent.push({
            type: "image",
            source: { type: "base64", media_type: img.mimeType, data: img.base64 },
          });
        }

        // Add text
        const prompt = noteText
          ? `Here are my study notes:\n\n${noteText}\n\nGenerate quiz questions based on these notes and any uploaded images.`
          : "Generate quiz questions based on the uploaded study material images.";
        userContent.push({ type: "text", text: prompt });

        const text = await callClaude(QUIZ_SYSTEM_PROMPT, userContent, 2500);
        return JSON.parse(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate quiz from notes");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const checkShortAnswer = useCallback(
    async (question: string, correctAnswer: string, userAnswer: string): Promise<ShortAnswerResult | null> => {
      setError(null);
      try {
        const text = await callClaude(
          GRADING_PROMPT,
          [{ type: "text", text: `Question: ${question}\nCorrect Answer: ${correctAnswer}\nStudent Answer: ${userAnswer}` }],
          500
        );
        return JSON.parse(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check answer");
        return null;
      }
    },
    []
  );

  return { generateFromPDF, generateFromNotes, checkShortAnswer, loading, error };
}
