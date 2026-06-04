"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "trip-picks-saved";

function readSaved(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function writeSaved(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useSaved() {
  const [saved, setSaved] = useState<Set<string>>(readSaved);

  useEffect(() => {
    writeSaved(saved);
  }, [saved]);

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { saved, toggleSave };
}
