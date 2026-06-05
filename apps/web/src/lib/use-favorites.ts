"use client";

import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goeyToast } from "goey-toast";
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
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const { data: apiSaved = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: !!user,
  });

  useEffect(() => {
    if (user) {
      setSaved(new Set(apiSaved.map((a) => a.id)));
    }
  }, [user, apiSaved]);

  useEffect(() => {
    if (!user) {
      setSaved(readLocal());
    }
  }, [user]);

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
        setSaved((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
            removeMutation.mutate(id);
            goeyToast.success("Removed from saved");
          } else {
            next.add(id);
            addMutation.mutate(id);
            goeyToast.success("Saved to favorites");
          }
          return next;
        });
      } else {
        setSaved((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          writeLocal(next);
          return next;
        });
      }
    },
    [user, addMutation, removeMutation],
  );

  return { saved, toggleSave };
}
