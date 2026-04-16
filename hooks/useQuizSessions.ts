"use client";

import { useState, useCallback, useEffect } from "react";
import { QuizSession, QuizQuestion, QuizSource } from "@/types/quiz";

const STORAGE_KEY = "hvac_quiz_sessions";

function loadSessions(): QuizSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: QuizSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useQuizSessions(source?: QuizSource) {
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const filtered = source ? sessions.filter((s) => s.source === source) : sessions;

  const addSession = useCallback(
    (title: string, questions: QuizQuestion[], sessionSource: QuizSource): QuizSession => {
      const session: QuizSession = {
        id: `qs_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        source: sessionSource,
        title,
        questions,
        createdAt: Date.now(),
      };
      setSessions((prev) => {
        const next = [session, ...prev];
        saveSessions(next);
        return next;
      });
      return session;
    },
    []
  );

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSessions(next);
      return next;
    });
  }, []);

  return { sessions: filtered, addSession, deleteSession };
}
