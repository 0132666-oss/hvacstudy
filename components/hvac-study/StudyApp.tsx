"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { StudyContent, PipelineStep, UploadedImage } from "@/types/study";
import { useStudyAI } from "@/hooks/useStudyAI";
import { useValidation } from "@/hooks/useValidation";
import { useWrongNotes } from "@/hooks/useWrongNotes";
import ImageUploader from "./ImageUploader";
import SummaryView from "./SummaryView";
import QuizView from "./QuizView";
import ValidationBadge from "./ValidationBadge";

type Tab = "summary" | "quiz";

export default function StudyApp() {
  const [step, setStep] = useState<PipelineStep>("idle");
  const [tab, setTab] = useState<Tab>("summary");
  const [content, setContent] = useState<StudyContent | null>(null);
  const [quizContent, setQuizContent] = useState<StudyContent | null>(null);

  const { analyzeImage, loading, error } = useStudyAI();
  const { validate, validating, validationResult } = useValidation();
  const { addWrongNote } = useWrongNotes();

  const handleImageReady = useCallback(
    async (image: UploadedImage) => {
      setStep("analyzing");
      setTab("summary");

      const result = await analyzeImage(image.base64, image.file.type);
      if (!result) {
        setStep("idle");
        return;
      }

      setContent(result);
      setStep("validating");

      // Background validation
      const validation = await validate(result);
      if (validation) {
        setQuizContent(validation.correctedContent);
      } else {
        setQuizContent(result);
      }
      setStep("ready");
    },
    [analyzeImage, validate]
  );

  const handleReset = useCallback(() => {
    setStep("idle");
    setTab("summary");
    setContent(null);
    setQuizContent(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600">
              ←
            </Link>
            <h1 className="text-lg font-bold text-slate-800">📚 Learning</h1>
          </div>
          {step !== "idle" && (
            <button
              onClick={handleReset}
              className="text-sm px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              New Page
            </button>
          )}
        </div>
      </header>

      {/* Navigation tabs */}
      {content && (
        <nav className="max-w-2xl mx-auto px-4 pt-4">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {(["summary", "quiz"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "summary" ? "📋 Summary" : "✏️ Quiz"}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Validation badge */}
      {content && (
        <div className="max-w-2xl mx-auto px-4 pt-3 flex justify-center">
          <ValidationBadge validating={validating} result={validationResult} />
        </div>
      )}

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {step === "idle" && <ImageUploader onImageReady={handleImageReady} />}

        {step === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-4xl animate-bounce mb-4">🔍</div>
            <p className="text-slate-600 font-medium">Analyzing your material...</p>
            <p className="text-slate-400 text-sm mt-1">This may take a moment</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mt-4">
            {error}
          </div>
        )}

        {content && tab === "summary" && (
          <SummaryView
            content={content}
            quizReady={step === "ready"}
            onStartQuiz={() => setTab("quiz")}
          />
        )}

        {content && tab === "quiz" && quizContent && (
          <QuizView
            questions={quizContent.questions}
            topicTitle={content.title}
            onAddWrongNote={addWrongNote}
            onFinish={handleReset}
          />
        )}

        {content && tab === "quiz" && !quizContent && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-4xl animate-pulse mb-4">⏳</div>
            <p className="text-slate-600">Preparing questions...</p>
          </div>
        )}
      </main>
    </div>
  );
}
