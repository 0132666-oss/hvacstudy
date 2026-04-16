"use client";

import { useState } from "react";
import Link from "next/link";
import FormulaView from "./FormulaView";
import MathQuizView from "./MathQuizView";

type MathTab = "formula" | "quiz";

export default function MathApp() {
  const [tab, setTab] = useState<MathTab>("formula");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600">
            ←
          </Link>
          <h1 className="text-lg font-bold text-slate-800">🔢 Math</h1>
        </div>
      </header>

      {/* Tabs */}
      <nav className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { key: "formula" as const, label: "📐 Formula Sheet" },
            { key: "quiz" as const, label: "🧮 Calculator Quiz" },
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
        {tab === "formula" ? <FormulaView /> : <MathQuizView />}
      </main>
    </div>
  );
}
