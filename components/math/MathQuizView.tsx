"use client";

import { useState, useCallback, useEffect } from "react";
import { MathProblem } from "@/types/math";
import { CATEGORY_META } from "@/data/formulas";
import { generateProblems } from "@/utils/mathProblems";
import { useWrongNotes } from "@/hooks/useWrongNotes";
import TriangleVisual from "./TriangleVisual";

interface ProblemResult {
  correct: boolean;
  userAnswer: string;
}

export default function MathQuizView() {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ProblemResult | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [results, setResults] = useState<ProblemResult[]>([]);
  const [showFinish, setShowFinish] = useState(false);

  const { addWrongNote } = useWrongNotes();

  useEffect(() => {
    setProblems(generateProblems(8));
  }, []);

  const current = problems[currentIdx];
  const isLast = currentIdx === problems.length - 1;

  const handleSubmit = useCallback(() => {
    if (!current || !input.trim()) return;
    const val = parseFloat(input);
    if (isNaN(val)) return;

    const correct = Math.abs(val - current.answer) <= current.tolerance;
    const r: ProblemResult = { correct, userAnswer: input };
    setResult(r);
    setResults((prev) => [...prev, r]);

    if (!correct) {
      addWrongNote({
        source: "math",
        category: current.category,
        question: current.question,
        userAnswer: `${input} ${current.unit}`,
        correctAnswer: `${current.answer} ${current.unit}`,
        explanation: current.explanation,
        hint: current.hint,
        formulaLabel: current.formulaLabel,
        keyWords: [current.formulaLabel],
        missingWords: [],
      });
    }
  }, [current, input, addWrongNote]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setShowFinish(true);
      return;
    }
    setCurrentIdx((prev) => prev + 1);
    setInput("");
    setResult(null);
    setHintVisible(false);
  }, [isLast]);

  const handleRestart = useCallback(() => {
    setProblems(generateProblems(8));
    setCurrentIdx(0);
    setInput("");
    setResult(null);
    setHintVisible(false);
    setResults([]);
    setShowFinish(false);
  }, []);

  if (!current) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-4xl animate-pulse">🧮</div>
      </div>
    );
  }

  if (showFinish) {
    const correctCount = results.filter((r) => r.correct).length;
    const pct = Math.round((correctCount / results.length) * 100);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray={`${pct}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{pct}%</span>
            </div>
          </div>
          <p className="text-lg font-semibold text-slate-700">
            {correctCount} / {results.length} correct
          </p>
        </div>

        <div className="space-y-3">
          {results.map((r, idx) => {
            const p = problems[idx];
            const meta = CATEGORY_META[p.category];
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${r.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <div className="flex items-start gap-2">
                  <span>{r.correct ? "✅" : "❌"}</span>
                  <div className="flex-1">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${meta.bgColor} ${meta.textColor}`}>
                      {meta.label}
                    </span>
                    <p className="text-sm text-slate-700 mt-1">{p.question}</p>
                    {!r.correct && (
                      <p className="text-xs text-slate-500 mt-1">
                        Your: <span className="text-red-600">{r.userAnswer}</span> | Answer:{" "}
                        <span className="text-green-600">
                          {p.answer} {p.unit}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-transform"
        >
          New Problems 🔄
        </button>
      </div>
    );
  }

  const meta = CATEGORY_META[current.category];

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / problems.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-slate-500 font-medium">
          {currentIdx + 1}/{problems.length}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.bgColor} ${meta.textColor} border ${meta.borderColor}`}>
            {meta.label}
          </span>
          <span className="text-xs text-slate-400 font-mono">{current.formulaLabel}</span>
        </div>
        <p className="text-slate-800 font-medium">{current.question}</p>

        {current.triangle && <TriangleVisual triangle={current.triangle} />}
      </div>

      {/* Hint */}
      <button
        onClick={() => setHintVisible((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm hover:bg-amber-100"
      >
        💡 Hint
      </button>
      {hintVisible && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-1">
          {current.hint.split("\n").map((line, i) => (
            <p key={i} className="text-sm text-amber-800 font-mono">{line}</p>
          ))}
        </div>
      )}

      {/* Input */}
      {!result && (
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Answer${current.unit ? ` (${current.unit})` : ""}`}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 p-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-300"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400"
          >
            Check
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`p-5 rounded-2xl border ${result.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{result.correct ? "✅" : "❌"}</span>
            <span className={`font-semibold ${result.correct ? "text-green-700" : "text-red-700"}`}>
              {result.correct ? "Correct!" : "Incorrect"}
            </span>
          </div>

          {!result.correct && (
            <p className="text-sm text-slate-600 mb-2">
              Answer: <span className="font-semibold text-green-700">{current.answer} {current.unit}</span>
            </p>
          )}

          <p className="text-sm text-slate-600">{current.explanation}</p>

          <button
            onClick={handleNext}
            className="mt-4 w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-transform"
          >
            {isLast ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
