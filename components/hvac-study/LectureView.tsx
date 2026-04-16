"use client";

import { useState } from "react";
import { StudyContent } from "@/types/study";

interface Props {
  content: StudyContent;
}

export default function LectureView({ content }: Props) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentLesson, setCurrentLesson] = useState(0);

  const lessons = content.lessons || [];
  const hasLessons = lessons.length > 0;

  const toggleCard = (idx: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Step-by-step Lessons */}
      {hasLessons && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📖 Lesson</h3>

          {/* Lesson progress */}
          <div className="flex gap-1.5 mb-4">
            {lessons.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentLesson(i)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i === currentLesson ? "bg-orange-500" : i < currentLesson ? "bg-orange-300" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Current lesson card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                Step {currentLesson + 1}/{lessons.length}
              </span>
            </div>
            <h4 className="text-base font-semibold text-slate-800 mb-3">
              {lessons[currentLesson].heading}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lessons[currentLesson].body}
            </p>

            {/* Navigation */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setCurrentLesson((p) => Math.max(0, p - 1))}
                disabled={currentLesson === 0}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentLesson((p) => Math.min(lessons.length - 1, p + 1))}
                disabled={currentLesson === lessons.length - 1}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flashcards */}
      {content.keyTerms.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">🃏 Flashcards</h3>
          <p className="text-xs text-slate-400 mb-4">Tap to flip</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.keyTerms.map((term, i) => (
              <button
                key={i}
                onClick={() => toggleCard(i)}
                className="text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-orange-300 transition-all min-h-[80px] relative overflow-hidden"
              >
                {flippedCards.has(i) ? (
                  <div>
                    <span className="text-[10px] font-medium text-orange-500 uppercase">Definition</span>
                    <p className="text-sm text-slate-600 mt-1">{term.definition}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm font-semibold text-slate-800">{term.term}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
