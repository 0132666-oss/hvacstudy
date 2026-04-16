"use client";

import { useState, useCallback, useRef } from "react";
import { QuizQuestion } from "@/types/quiz";
import { useQuizAI } from "@/hooks/useQuizAI";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { useQuizSessions } from "@/hooks/useQuizSessions";
import PDFUploader from "./PDFUploader";
import QuizRunner from "./QuizRunner";

export default function UEEQuizSection() {
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[] | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const { generateFromPDF, loading, error } = useQuizAI();
  const { addWrongNote } = useQuizHistory();
  const { sessions, addSession, deleteSession } = useQuizSessions("uee");

  // Store PDF text + fileName for re-generation
  const pdfDataRef = useRef<{ text: string; fileName: string } | null>(null);

  const handlePDFText = useCallback(
    async (text: string, fileName: string) => {
      pdfDataRef.current = { text, fileName };
      const result = await generateFromPDF(text, fileName);
      if (result) {
        addSession(result.title, result.questions, "uee");
        setActiveTitle(result.title);
        setActiveQuestions(result.questions);
      }
    },
    [generateFromPDF, addSession]
  );

  const handleSelectSession = useCallback((id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setActiveTitle(session.title);
      setActiveQuestions(session.questions);
    }
  }, [sessions]);

  const handleContinue = useCallback(async () => {
    if (!pdfDataRef.current) return;
    const { text, fileName } = pdfDataRef.current;
    setActiveQuestions(null); // show loading
    const result = await generateFromPDF(text, fileName);
    if (result) {
      addSession(result.title, result.questions, "uee");
      setActiveTitle(result.title);
      setActiveQuestions(result.questions);
    }
  }, [generateFromPDF, addSession]);

  const handleReset = useCallback(() => {
    setActiveQuestions(null);
    setActiveTitle("");
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

  if (activeQuestions) {
    return (
      <div>
        <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-sm font-medium text-blue-700">📄 {activeTitle}</p>
        </div>
        <QuizRunner
          questions={activeQuestions}
          sessionTitle={activeTitle}
          source="uee"
          onAddWrongNote={addWrongNote}
          onFinish={handleReset}
          onContinue={pdfDataRef.current ? handleContinue : undefined}
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

      {sessions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-3">Saved Quizzes</h3>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer"
                onClick={() => handleSelectSession(session.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    📄 {session.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {session.questions.length} questions &middot; {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="ml-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
