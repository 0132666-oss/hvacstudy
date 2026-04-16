"use client";

import { useState, useCallback } from "react";
import { QuizQuestion } from "@/types/quiz";
import { useQuizAI } from "@/hooks/useQuizAI";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import PDFUploader from "./PDFUploader";
import QuizRunner from "./QuizRunner";

export default function UEEQuizSection() {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [title, setTitle] = useState("");
  const { generateFromPDF, loading, error } = useQuizAI();
  const { addWrongNote } = useQuizHistory();

  const handlePDFText = useCallback(
    async (text: string, fileName: string) => {
      const result = await generateFromPDF(text, fileName);
      if (result) {
        setTitle(result.title);
        setQuestions(result.questions);
      }
    },
    [generateFromPDF]
  );

  const handleReset = useCallback(() => {
    setQuestions(null);
    setTitle("");
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl animate-bounce mb-4">📄</div>
        <p className="text-slate-600 font-medium">Generating quiz from PDF...</p>
        <p className="text-slate-400 text-sm mt-1">AI is analyzing the UEE content</p>
      </div>
    );
  }

  if (questions) {
    return (
      <div>
        <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-sm font-medium text-blue-700">📄 {title}</p>
        </div>
        <QuizRunner
          questions={questions}
          sessionTitle={title}
          source="uee"
          onAddWrongNote={addWrongNote}
          onFinish={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-slate-500 text-sm">Upload a UEE unit PDF to generate a quiz</p>
      </div>
      <PDFUploader onTextExtracted={handlePDFText} />
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
    </div>
  );
}
