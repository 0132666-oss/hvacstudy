"use client";

import { useState, useCallback } from "react";
import { StudyContent, ShortAnswerResult } from "@/types/study";

const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";
const MODEL = "claude-haiku-4-5-20251001";
const API_URL = "https://api.anthropic.com/v1/messages";

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

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  let text = data.content[0].text;
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) text = jsonMatch[1].trim();
  return text;
}

const STUDY_PROMPT = `You are an HVAC education expert creating a comprehensive study guide for Australian TAFE Certificate III in Air Conditioning & Refrigeration.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "Topic title",
  "lessons": [
    {"heading": "Section heading", "body": "2-4 sentence detailed explanation of this concept. Include specific values, standards, or procedures."}
  ],
  "summary": ["Key point 1", "Key point 2"],
  "keyTerms": [
    {"term": "Technical Term", "definition": "Clear definition with context"}
  ],
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Question?",
      "options": ["A) opt1", "B) opt2", "C) opt3", "D) opt4"],
      "correctAnswer": "A) opt1",
      "hint": "Hint",
      "explanation": "Why correct"
    },
    {
      "id": "q4",
      "type": "short",
      "question": "Short answer question?",
      "correctAnswer": "Expected answer",
      "hint": "Hint",
      "explanation": "Explanation"
    }
  ]
}

Rules:
- lessons: 4-6 sections that teach the material step-by-step, like a textbook chapter. Each body should be detailed (2-4 sentences) with specific technical facts.
- summary: 4-6 bullet points of the most important takeaways
- keyTerms: 6-10 terms with definitions a student must memorize
- questions: exactly 5 questions — 3 MCQ + 2 short answer
- Questions must test specific technical details, NOT unit names or objectives
- Focus on values, procedures, Australian standards (AS/NZS), components, formulas
- All content in English`;

export function useStudyAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (images: Array<{ base64: string; mimeType: string }>): Promise<StudyContent | null> => {
    setLoading(true);
    setError(null);
    try {
      const userContent: Array<{ type: string; [key: string]: unknown }> = [];
      for (const img of images) {
        userContent.push({
          type: "image",
          source: { type: "base64", media_type: img.mimeType, data: img.base64 },
        });
      }
      userContent.push({
        type: "text",
        text: `Analyze ${images.length > 1 ? "these" : "this"} HVAC study material image${images.length > 1 ? "s" : ""} and generate study content with lessons, summary, key terms, and quiz questions.`,
      });

      const text = await callClaude(STUDY_PROMPT, userContent, 3500);
      const parsed = JSON.parse(text) as StudyContent;
      return parsed;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeText = useCallback(async (pdfText: string, fileName: string): Promise<StudyContent | null> => {
    setLoading(true);
    setError(null);
    try {
      const systemPrompt = STUDY_PROMPT;

      const truncated = pdfText.slice(0, 10000);
      const text = await callClaude(
        systemPrompt,
        [
          {
            type: "text",
            text: `Study material from ${fileName}:\n\n${truncated}\n\nCreate comprehensive study content with lessons, summary, key terms, and quiz questions.`,
          },
        ],
        3500
      );

      return JSON.parse(text) as StudyContent;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze text");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkShortAnswer = useCallback(
    async (
      question: string,
      correctAnswer: string,
      userAnswer: string
    ): Promise<ShortAnswerResult | null> => {
      setError(null);
      try {
        const systemPrompt = `You are an HVAC exam grader. Grade the student's short answer.

Rules:
- The answer doesn't need to be word-for-word identical
- Accept if the meaning is correct and key technical concepts are present
- Be strict only on technical accuracy
- Respond in Korean for feedback

Return ONLY valid JSON:
{
  "correct": true/false,
  "feedback": "Korean feedback 1-2 sentences",
  "keyWords": ["keyword1", "keyword2", "keyword3"],
  "missingWords": ["missed1"]
}

keyWords: 3-6 essential keywords from the correct answer
missingWords: keywords the student missed (empty if correct)`;

        const text = await callClaude(
          systemPrompt,
          [
            {
              type: "text",
              text: `Question: ${question}\nCorrect Answer: ${correctAnswer}\nStudent Answer: ${userAnswer}`,
            },
          ],
          500
        );

        return JSON.parse(text) as ShortAnswerResult;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check answer");
        return null;
      }
    },
    []
  );

  const translateQuestion = useCallback(async (question: string): Promise<string | null> => {
    try {
      const text = await callClaude(
        "Translate the following HVAC exam question to Korean. Keep technical terms in English. Return only the translation, no JSON.",
        [{ type: "text", text: question }],
        300
      );
      return text;
    } catch {
      return null;
    }
  }, []);

  return { analyzeImage, analyzeText, checkShortAnswer, translateQuestion, loading, error };
}
