"use client";

import { useState, useEffect, useCallback } from "react";
import { QuizWrongNote, QuizSource } from "@/types/quiz";

const STORAGE_KEY = "hvac_quiz_history";

function loadNotes(): QuizWrongNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: QuizWrongNote[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useQuizHistory() {
  const [notes, setNotes] = useState<QuizWrongNote[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
    setLoaded(true);
  }, []);

  const persist = useCallback((updated: QuizWrongNote[]) => {
    setNotes(updated);
    saveNotes(updated);
  }, []);

  const addWrongNote = useCallback(
    (note: Omit<QuizWrongNote, "id" | "addedAt" | "mastered" | "attemptCount">) => {
      const current = loadNotes();
      const existing = current.find((n) => n.question === note.question);

      if (existing) {
        const updated = current.map((n) =>
          n.id === existing.id
            ? { ...n, attemptCount: n.attemptCount + 1, mastered: false, userAnswer: note.userAnswer }
            : n
        );
        persist(updated);
      } else {
        const newNote: QuizWrongNote = {
          ...note,
          id: `qwn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          addedAt: Date.now(),
          mastered: false,
          attemptCount: 1,
        };
        persist([newNote, ...current]);
      }
    },
    [persist]
  );

  const toggleMastered = useCallback(
    (id: string) => {
      const current = loadNotes();
      persist(current.map((n) => (n.id === id ? { ...n, mastered: !n.mastered } : n)));
    },
    [persist]
  );

  const deleteNote = useCallback(
    (id: string) => {
      persist(loadNotes().filter((n) => n.id !== id));
    },
    [persist]
  );

  const clearAll = useCallback(() => persist([]), [persist]);

  const stats = {
    total: notes.length,
    pending: notes.filter((n) => !n.mastered).length,
    mastered: notes.filter((n) => n.mastered).length,
    uee: notes.filter((n) => n.source === "uee").length,
    notesCount: notes.filter((n) => n.source === "notes").length,
  };

  const getBySource = useCallback(
    (source: QuizSource) => notes.filter((n) => n.source === source),
    [notes]
  );

  return { notes, loaded, stats, addWrongNote, toggleMastered, deleteNote, clearAll, getBySource };
}
