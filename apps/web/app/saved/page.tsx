"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";
import { fetchActivities } from "@/lib/api";
import { useFavorites } from "@/lib/use-favorites";
import ActivityCard from "@/components/activity-card";
import SkeletonCard from "@/components/skeleton-card";

const SKELETON_COUNT = 6;

export default function Page() {
  const router = useRouter();
  const { saved, toggleSave } = useFavorites();

  const { data, isLoading } = useQuery({
    queryKey: ["activities", "all"],
    queryFn: () => fetchActivities({ limit: 100 }),
  });

  const activities = useMemo(
    () => (data?.data ?? []).filter((a) => saved.has(a.id)),
    [data, saved],
  );

  return (
    <div className="min-h-screen bg-[#111]">
      <div className="sticky top-0 z-10 bg-[#111]">
        <div className="mx-auto max-w-225 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-8 text-[#777] hover:text-white transition-colors -ml-1"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Saved Picks</h1>
            <p className="text-xs text-muted">
              {activities.length}{" "}
              {activities.length === 1 ? "activity" : "activities"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-225 px-6 pb-10 max-sm:px-3">
        {isLoading ? (
          <div className="masonry mt-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Bookmark size={40} className="text-[#333]" />
            <p className="text-sm text-muted">No saved activities yet</p>
            <button
              onClick={() => router.push("/")}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#059a5c] transition-colors"
            >
              Browse activities
            </button>
          </div>
        ) : (
          <div className="masonry">
            {activities.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                saved={saved.has(a.id)}
                onSave={toggleSave}
                onClick={() => {}}
                alwaysShowSave
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
