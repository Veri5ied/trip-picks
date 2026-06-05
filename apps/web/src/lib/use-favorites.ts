"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFavorites, addFavorite, removeFavorite } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const STORAGE_KEY = "trip-picks-saved";

function readLocal(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function writeLocal(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: apiSaved = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: !!user,
  });

  const apiSavedIds = new Set(apiSaved.map((a) => a.id));

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const toggleSave = useCallback(
    (id: string) => {
      if (user) {
        if (apiSavedIds.has(id)) {
          removeMutation.mutate(id);
        } else {
          addMutation.mutate(id);
        }
      } else {
        const next = new Set(readLocal());
        if (next.has(id)) next.delete(id);
        else next.add(id);
        writeLocal(next);
      }
    },
    [user, apiSavedIds, addMutation, removeMutation],
  );

  const saved = user ? apiSavedIds : readLocal();

  return { saved, toggleSave };
}
