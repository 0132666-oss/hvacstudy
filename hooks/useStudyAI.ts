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
  return data.content[0].text;
}

export function useStudyAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (base64: string, mimeType: string): Promise<StudyContent | null> => {
    setLoading(true);
    setError(null);
    try {
      const systemPrompt = `You are an HVAC education expert for Australian TAFE Certificate III in Air Conditioning & Refrigeration.
Analyze the uploaded textbook/study material image and create study content.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "title": "Topic title in English",
  "summary": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "keyTerms": [
    {"term": "Technical Term", "definition": "Clear definition"}
  ],
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Question text?",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correctAnswer": "A) option1",
      "hint": "Helpful hint",
      "explanation": "Why this is correct"
    },
    {
      "id": "q4",
      "type": "short",
      "question": "Short answer question?",
      "correctAnswer": "Expected answer",
      "hint": "Helpful hint",
      "explanation": "Detailed explanation"
    }
  ]
}

Rules:
- Generate exactly 5 questions: 3 MCQ + 2 short answer
- Focus on HVAC concepts: refrigeration cycle, ductwork, electrical, safety, Australian standards (AS/NZS)
- Questions should match TAFE exam style
- All content in English
- Summary should have 4-6 bullet points
- Include 4-8 key terms`;

      const text = await callClaude(
        systemPrompt,
        [
          {
            type: "image",
            source: { type: "base64", media_type: mimeType, data: base64 },
          },
          { type: "text", text: "Analyze this HVAC study material and generate study content." },
        ],
        2000
      );

      const parsed = JSON.parse(text) as StudyContent;
      return parsed;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
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

  return { analyzeImage, checkShortAnswer, translateQuestion, loading, error };
}
