"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

function clearLocal() {
  localStorage.removeItem(STORAGE_KEY);
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const prevUser = useRef(user);

  const { data } = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    enabled: !!user,
  });

  useEffect(() => {
    if (user && data) {
      setSaved(new Set(data.map((a) => a.id)));
    }
  }, [user, data]);

  useEffect(() => {
    if (!user) {
      setSaved(readLocal());
    }
  }, [user]);

  useEffect(() => {
    if (user && !prevUser.current) {
      const local = readLocal();
      if (local.size > 0) {
        Promise.allSettled([...local].map((id) => addFavorite(id))).then(() => {
          clearLocal();
          queryClient.invalidateQueries({ queryKey: ["favorites"] });
        });
      }
    }
    prevUser.current = user;
  }, [user, queryClient]);

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
        const wasSaved = saved.has(id);
        setSaved((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
        if (wasSaved) {
          removeMutation.mutate(id);
          toast.success("Removed from saved", {
            description: "Activity removed from your favorites",
          });
        } else {
          addMutation.mutate(id);
          toast.success("Saved to favorites", {
            description: "Activity added to your saved list",
          });
        }
      } else {
        const wasSaved = saved.has(id);
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
        if (wasSaved) {
          toast.success("Removed from saved", {
            description: "Activity removed from your saved list",
          });
        } else {
          toast.success("Saved to favorites", {
            description: "Activity added to your saved list",
          });
        }
      }
    },
    [user, saved, addMutation, removeMutation],
  );

  return { saved, toggleSave };
}
