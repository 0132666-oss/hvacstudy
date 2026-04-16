"use client";

import { StudyContent } from "@/types/study";

interface Props {
  content: StudyContent;
  quizReady: boolean;
  onStartQuiz: () => void;
}

export default function SummaryView({ content, quizReady, onStartQuiz }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary bullets */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">📋 Key Summary</h3>
        <ul className="space-y-2">
          {content.summary.map((point, i) => (
            <li key={i} className="flex gap-3 text-slate-600">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Terms */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">🔑 Key Terms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {content.keyTerms.map((term, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-orange-50/50 border border-orange-100"
            >
              <div className="font-medium text-orange-800 text-sm">{term.term}</div>
              <div className="text-slate-600 text-sm mt-1">{term.definition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Quiz CTA */}
      <button
        onClick={onStartQuiz}
        disabled={!quizReady}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          quizReady
            ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {quizReady ? "Start Quiz →" : "⏳ Preparing questions..."}
      </button>
    </div>
  );
}
