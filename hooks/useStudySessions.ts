"use client";

import { useState, useCallback, useEffect } from "react";
import { StudyContent, StudySession, StudySource } from "@/types/study";

const STORAGE_KEY = "hvac_study_sessions";

function loadSessions(): StudySession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: StudySession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const addSession = useCallback(
    (title: string, content: StudyContent, source: StudySource): StudySession => {
      const session: StudySession = {
        id: `ss_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        source,
        title,
        content,
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

  return { sessions, addSession, deleteSession };
}
