"use client";

import { useState, useCallback } from "react";
import { QuizQuestion } from "@/types/quiz";
import { useQuizAI } from "@/hooks/useQuizAI";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import NotesInput from "./NotesInput";
import QuizRunner from "./QuizRunner";

export default function NotesQuizSection() {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [title, setTitle] = useState("");
  const { generateFromNotes, loading, error } = useQuizAI();
  const { addWrongNote } = useQuizHistory();

  const handleSubmit = useCallback(
    async (text: string, images: Array<{ base64: string; mimeType: string }>) => {
      const result = await generateFromNotes(text, images);
      if (result) {
        setTitle(result.title);
        setQuestions(result.questions);
      }
    },
    [generateFromNotes]
  );

  const handleReset = useCallback(() => {
    setQuestions(null);
    setTitle("");
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl animate-bounce mb-4">📝</div>
        <p className="text-slate-600 font-medium">Generating quiz from notes...</p>
        <p className="text-slate-400 text-sm mt-1">AI is analyzing your material</p>
      </div>
    );
  }

  if (questions) {
    return (
      <div>
        <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-sm font-medium text-blue-700">📝 {title}</p>
        </div>
        <QuizRunner
          questions={questions}
          sessionTitle={title}
          source="notes"
          onAddWrongNote={addWrongNote}
          onFinish={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-slate-500 text-sm">Upload notes (images or text) to generate a quiz</p>
      </div>
      <NotesInput onSubmit={handleSubmit} loading={loading} />
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
    </div>
  );
}
