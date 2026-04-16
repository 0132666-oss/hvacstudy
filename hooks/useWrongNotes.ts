"use client";

import { useState, useEffect, useCallback } from "react";
import { WrongNote, WrongNoteSource } from "@/types/wrongNote";

const STORAGE_KEY = "hvac_wrong_notes";

function loadNotes(): WrongNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: WrongNote[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useWrongNotes() {
  const [notes, setNotes] = useState<WrongNote[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
    setLoaded(true);
  }, []);

  const persist = useCallback((updated: WrongNote[]) => {
    setNotes(updated);
    saveNotes(updated);
  }, []);

  const addWrongNote = useCallback(
    (note: Omit<WrongNote, "id" | "addedAt" | "mastered" | "attemptCount" | "reviewedAt">) => {
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
        const newNote: WrongNote = {
          ...note,
          id: `wn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
      const updated = current.map((n) =>
        n.id === id ? { ...n, mastered: !n.mastered, reviewedAt: Date.now() } : n
      );
      persist(updated);
    },
    [persist]
  );

  const deleteNote = useCallback(
    (id: string) => {
      const current = loadNotes();
      persist(current.filter((n) => n.id !== id));
    },
    [persist]
  );

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const getBySource = useCallback(
    (source: WrongNoteSource) => notes.filter((n) => n.source === source),
    [notes]
  );

  const stats = {
    total: notes.length,
    pending: notes.filter((n) => !n.mastered).length,
    mastered: notes.filter((n) => n.mastered).length,
    learning: notes.filter((n) => n.source === "learning").length,
    math: notes.filter((n) => n.source === "math").length,
  };

  return {
    notes,
    loaded,
    stats,
    addWrongNote,
    toggleMastered,
    deleteNote,
    clearAll,
    getBySource,
  };
}
