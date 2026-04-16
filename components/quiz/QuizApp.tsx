"use client";

import { useState } from "react";
import Link from "next/link";
import UEEQuizSection from "./UEEQuizSection";
import NotesQuizSection from "./NotesQuizSection";

type QuizTab = "uee" | "notes";

export default function QuizApp() {
  const [tab, setTab] = useState<QuizTab>("uee");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600">
            ←
          </Link>
          <h1 className="text-lg font-bold text-slate-800">🎯 Quiz</h1>
        </div>
      </header>

      {/* Tabs */}
      <nav className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { key: "uee" as const, label: "📄 UEE PDF" },
            { key: "notes" as const, label: "📝 My Notes" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === t.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {tab === "uee" ? <UEEQuizSection /> : <NotesQuizSection />}
      </main>
    </div>
  );
}
