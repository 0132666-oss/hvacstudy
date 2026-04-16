"use client";

import { useState } from "react";
import { WrongNote } from "@/types/wrongNote";

interface Props {
  note: WrongNote;
  onToggleMastered: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function WrongNoteCard({ note, onToggleMastered, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${note.mastered ? "border-emerald-200" : "border-slate-100"} overflow-hidden`}>
      {/* Header (clickable) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              note.source === "learning" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              {note.source === "learning" ? "📚 Learning" : "🔢 Math"}
            </span>
            <span className="text-[10px] text-slate-400">{note.category}</span>
            {note.attemptCount > 1 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-50 text-red-600">
                ×{note.attemptCount}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-700 line-clamp-2">{note.question}</p>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform mt-1 flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Keywords */}
          {(note.keyWords.length > 0 || note.missingWords.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {note.keyWords.map((kw) => (
                <span
                  key={kw}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    note.missingWords.includes(kw) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  🔑 {kw}
                </span>
              ))}
            </div>
          )}

          {/* My answer vs correct */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-red-50">
              <div className="text-[10px] text-red-500 font-medium mb-0.5">My Answer</div>
              <div className="text-sm text-red-700">{note.userAnswer}</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <div className="text-[10px] text-green-500 font-medium mb-0.5">Correct</div>
              <div className="text-sm text-green-700">{note.correctAnswer}</div>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-3 rounded-lg bg-slate-50">
            <p className="text-sm text-slate-600">{note.explanation}</p>
          </div>

          {/* Hint */}
          {note.hint && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-sm text-amber-800">💡 {note.hint}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onDelete(note.id)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => onToggleMastered(note.id)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                note.mastered
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-slate-300 text-transparent hover:border-emerald-400"
              }`}
            >
              ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
