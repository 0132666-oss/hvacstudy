"use client";

import { useState, useCallback } from "react";
import { QuizQuestion } from "@/types/quiz";
import { useQuizAI } from "@/hooks/useQuizAI";
import { useQuizHistory } from "@/hooks/useQuizHistory";
import { useQuizSessions } from "@/hooks/useQuizSessions";
import NotesInput from "./NotesInput";
import QuizRunner from "./QuizRunner";

export default function NotesQuizSection() {
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[] | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const { generateFromNotes, loading, error } = useQuizAI();
  const { addWrongNote } = useQuizHistory();
  const { sessions, addSession, deleteSession } = useQuizSessions("notes");

  const handleSubmit = useCallback(
    async (text: string, images: Array<{ base64: string; mimeType: string }>) => {
      const result = await generateFromNotes(text, images);
      if (result) {
        addSession(result.title, result.questions, "notes");
      }
    },
    [generateFromNotes, addSession]
  );

  const handleSelectSession = useCallback((id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setActiveTitle(session.title);
      setActiveQuestions(session.questions);
    }
  }, [sessions]);

  const handleReset = useCallback(() => {
    setActiveQuestions(null);
    setActiveTitle("");
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

  if (activeQuestions) {
    return (
      <div>
        <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-sm font-medium text-blue-700">📝 {activeTitle}</p>
        </div>
        <QuizRunner
          questions={activeQuestions}
          sessionTitle={activeTitle}
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
                    📝 {session.title}
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
