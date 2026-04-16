"use client";

import { useState } from "react";
import Link from "next/link";
import { useWrongNotes } from "@/hooks/useWrongNotes";
import WrongNoteCard from "./WrongNoteCard";
import WrongNoteReview from "./WrongNoteReview";

type FilterTab = "pending" | "all" | "mastered";

export default function WrongNoteApp() {
  const { notes, loaded, stats, toggleMastered, deleteNote, clearAll } = useWrongNotes();
  const [filter, setFilter] = useState<FilterTab>("pending");
  const [reviewMode, setReviewMode] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = notes
    .filter((n) => {
      if (filter === "pending") return !n.mastered;
      if (filter === "mastered") return n.mastered;
      return true;
    })
    .sort((a, b) => {
      // Sort by attemptCount desc, then newest first
      if (b.attemptCount !== a.attemptCount) return b.attemptCount - a.attemptCount;
      return b.addedAt - a.addedAt;
    });

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/20 flex items-center justify-center">
        <div className="text-4xl animate-pulse">📝</div>
      </div>
    );
  }

  if (reviewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/20">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setReviewMode(false)} className="text-slate-400 hover:text-slate-600">
              ←
            </button>
            <h1 className="text-lg font-bold text-slate-800">📝 Review Mode</h1>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">
          <WrongNoteReview
            notes={notes}
            onToggleMastered={toggleMastered}
            onClose={() => setReviewMode(false)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600">
            ←
          </Link>
          <h1 className="text-lg font-bold text-slate-800">📝 Wrong Notes</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
            <div className="text-2xl font-bold text-slate-700">{stats.total}</div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-red-100">
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
            <div className="text-xs text-red-400">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">{stats.mastered}</div>
            <div className="text-xs text-emerald-400">Mastered</div>
          </div>
        </div>

        {/* Source breakdown */}
        <div className="flex gap-2">
          <div className="flex-1 bg-orange-50 rounded-xl p-2.5 text-center border border-orange-100">
            <span className="text-sm font-medium text-orange-700">📚 Learning {stats.learning}</span>
          </div>
          <div className="flex-1 bg-emerald-50 rounded-xl p-2.5 text-center border border-emerald-100">
            <span className="text-sm font-medium text-emerald-700">🔢 Math {stats.math}</span>
          </div>
        </div>

        {/* Review button */}
        {stats.pending > 0 && (
          <button
            onClick={() => setReviewMode(true)}
            className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-[0.98] transition-transform shadow-lg shadow-red-500/20"
          >
            Start Review ({stats.pending} pending)
          </button>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {(["pending", "all", "mastered"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "pending" ? "Pending" : t === "all" ? "All" : "Mastered"}
            </button>
          ))}
        </div>

        {/* Notes list */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-slate-500">
              {filter === "pending" ? "No pending notes!" : filter === "mastered" ? "No mastered notes yet" : "No wrong notes yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((note) => (
              <WrongNoteCard
                key={note.id}
                note={note}
                onToggleMastered={toggleMastered}
                onDelete={deleteNote}
              />
            ))}
          </div>
        )}

        {/* Clear all */}
        {notes.length > 0 && (
          <div className="pt-4">
            {confirmClear ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    clearAll();
                    setConfirmClear(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold"
                >
                  Yes, delete all
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 text-slate-600 text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full py-2 rounded-xl text-red-400 text-sm hover:text-red-600"
              >
                Clear All Notes
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
