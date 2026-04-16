"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { StudyContent, PipelineStep, UploadedImage, StudySource } from "@/types/study";
import { useStudyAI } from "@/hooks/useStudyAI";
import { useValidation } from "@/hooks/useValidation";
import { useWrongNotes } from "@/hooks/useWrongNotes";
import { useStudySessions } from "@/hooks/useStudySessions";
import ImageUploader from "./ImageUploader";
import SummaryView from "./SummaryView";
import QuizView from "./QuizView";
import LectureView from "./LectureView";
import ValidationBadge from "./ValidationBadge";
import PDFUploader from "@/components/quiz/PDFUploader";

type InputTab = "pdf" | "image";
type ViewTab = "lecture" | "summary" | "quiz";

export default function StudyApp() {
  const [inputTab, setInputTab] = useState<InputTab>("pdf");
  const [viewTab, setViewTab] = useState<ViewTab>("lecture");
  const [step, setStep] = useState<PipelineStep>("idle");
  const [content, setContent] = useState<StudyContent | null>(null);
  const [quizContent, setQuizContent] = useState<StudyContent | null>(null);

  const { analyzeImage, analyzeText, loading, error } = useStudyAI();
  const { validate, validating, validationResult } = useValidation();
  const { addWrongNote } = useWrongNotes();
  const { sessions, addSession, deleteSession } = useStudySessions();

  const processContent = useCallback(
    async (result: StudyContent, source: StudySource) => {
      setContent(result);
      setViewTab("lecture");
      setStep("validating");
      addSession(result.title, result, source);

      const validation = await validate(result);
      if (validation) {
        setQuizContent(validation.correctedContent);
      } else {
        setQuizContent(result);
      }
      setStep("ready");
    },
    [validate, addSession]
  );

  const handleImagesReady = useCallback(
    async (images: UploadedImage[]) => {
      setStep("analyzing");
      const result = await analyzeImage(
        images.map((img) => ({ base64: img.base64, mimeType: img.file.type }))
      );
      if (!result) {
        setStep("idle");
        return;
      }
      await processContent(result, "image");
    },
    [analyzeImage, processContent]
  );

  const handlePDFText = useCallback(
    async (text: string, fileName: string) => {
      setStep("analyzing");
      const result = await analyzeText(text, fileName);
      if (!result) {
        setStep("idle");
        return;
      }
      await processContent(result, "pdf");
    },
    [analyzeText, processContent]
  );

  const handleSelectSession = useCallback((id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;
    const c = session.content;
    // Ensure lessons exist for older sessions
    if (!c.lessons) c.lessons = [];
    setContent(c);
    setQuizContent(c);
    setViewTab("lecture");
    setStep("ready");
    window.scrollTo(0, 0);
  }, [sessions]);

  const handleReset = useCallback(() => {
    setStep("idle");
    setViewTab("summary");
    setContent(null);
    setQuizContent(null);
  }, []);

  const sourceIcon = (source: StudySource) => {
    if (source === "pdf") return "📄";
    if (source === "image") return "📷";
    return "📝";
  };

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
              Back
            </button>
          )}
        </div>
      </header>

      {/* Content view tabs (when viewing study content) */}
      {content && (
        <nav className="max-w-2xl mx-auto px-4 pt-4">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {(["lecture", "summary", "quiz"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setViewTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  viewTab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "lecture" ? "📖 Lecture" : t === "summary" ? "📋 Summary" : "✏️ Quiz"}
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
        {/* Idle: show input tabs + upload + saved sessions */}
        {step === "idle" && (
          <div className="space-y-6">
            {/* Input source tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
              {([
                { key: "pdf" as const, label: "📄 UEE PDF" },
                { key: "image" as const, label: "📷 Image" },
              ]).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setInputTab(t.key)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    inputTab === t.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Upload area */}
            {inputTab === "pdf" && (
              <PDFUploader onTextExtracted={handlePDFText} />
            )}
            {inputTab === "image" && (
              <ImageUploader onImagesReady={handleImagesReady} />
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Saved sessions */}
            {sessions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-3">Saved Studies</h3>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer"
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {sourceIcon(session.source)} {session.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {session.content.summary.length} points &middot; {session.content.keyTerms.length} terms &middot; {new Date(session.createdAt).toLocaleDateString()}
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
        )}

        {/* Analyzing */}
        {step === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-4xl animate-bounce mb-4">🔍</div>
            <p className="text-slate-600 font-medium">Analyzing your material...</p>
            <p className="text-slate-400 text-sm mt-1">Creating study content with AI</p>
          </div>
        )}

        {/* Lecture view */}
        {content && viewTab === "lecture" && (
          <LectureView content={content} />
        )}

        {/* Summary view */}
        {content && viewTab === "summary" && (
          <SummaryView
            content={content}
            quizReady={step === "ready"}
            onStartQuiz={() => setViewTab("quiz")}
          />
        )}

        {/* Quiz view */}
        {content && viewTab === "quiz" && quizContent && (
          <QuizView
            questions={quizContent.questions}
            topicTitle={content.title}
            onAddWrongNote={addWrongNote}
            onFinish={handleReset}
          />
        )}

        {content && viewTab === "quiz" && !quizContent && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-4xl animate-pulse mb-4">⏳</div>
            <p className="text-slate-600">Preparing questions...</p>
          </div>
        )}
      </main>
    </div>
  );
}
