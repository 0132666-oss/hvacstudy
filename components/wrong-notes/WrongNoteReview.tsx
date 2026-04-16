"use client";

import { useState, useCallback } from "react";
import { WrongNote } from "@/types/wrongNote";

interface Props {
  notes: WrongNote[];
  onToggleMastered: (id: string) => void;
  onClose: () => void;
}

export default function WrongNoteReview({ notes, onToggleMastered, onClose }: Props) {
  const pendingNotes = notes.filter((n) => !n.mastered);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [done, setDone] = useState(false);

  const current = pendingNotes[currentIdx];
  const isLast = currentIdx === pendingNotes.length - 1;

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleStillLearning = useCallback(() => {
    if (isLast) {
      setDone(true);
      return;
    }
    setCurrentIdx((prev) => prev + 1);
    setRevealed(false);
    setHintVisible(false);
  }, [isLast]);

  const handleMastered = useCallback(() => {
    onToggleMastered(current.id);
    setMasteredCount((prev) => prev + 1);
    if (isLast) {
      setDone(true);
      return;
    }
    setCurrentIdx((prev) => prev + 1);
    setRevealed(false);
    setHintVisible(false);
  }, [current, isLast, onToggleMastered]);

  if (done || pendingNotes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-lg font-semibold text-slate-700">Review Complete!</p>
          <p className="text-slate-500 mt-1">
            Mastered: {masteredCount} / {pendingNotes.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
        >
          Back to Notes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / pendingNotes.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-slate-500">
          {currentIdx + 1}/{pendingNotes.length}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            current.source === "learning" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
          }`}>
            {current.source === "learning" ? "📚" : "🔢"} {current.category}
          </span>
        </div>
        <p className="text-slate-800 font-medium">{current.question}</p>

        {/* Previous wrong answer */}
        <div className="mt-3 p-2 rounded-lg bg-red-50">
          <p className="text-xs text-red-400 mb-0.5">Previous answer</p>
          <p className="text-sm text-red-600 line-through">{current.userAnswer}</p>
        </div>
      </div>

      {/* Hint button */}
      {!revealed && (
        <button
          onClick={() => setHintVisible((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm"
        >
          💡 Hint
        </button>
      )}
      {hintVisible && !revealed && current.hint && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-sm text-amber-800">💡 {current.hint}</p>
        </div>
      )}

      {/* Reveal button */}
      {!revealed && (
        <button
          onClick={handleReveal}
          className="w-full py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900"
        >
          Show Answer
        </button>
      )}

      {/* Answer revealed */}
      {revealed && (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
            <p className="text-xs text-green-500 font-medium mb-1">Correct Answer</p>
            <p className="text-green-800 font-medium">{current.correctAnswer}</p>
            <p className="text-sm text-slate-600 mt-3">{current.explanation}</p>
          </div>

          {/* Self-assessment */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleStillLearning}
              className="py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200"
            >
              Still learning 😅
            </button>
            <button
              onClick={handleMastered}
              className="py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-transform"
            >
              Got it! ✅
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
