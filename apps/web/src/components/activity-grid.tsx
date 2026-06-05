"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import type { Activity } from "@/lib/api";
import ActivityCard from "./activity-card";
import SkeletonCard from "./skeleton-card";

const SKELETON_COUNT = 6;

interface ActivityGridProps {
  activities: Activity[];
  saved: Set<string>;
  onSave: (id: string) => void;
  onCardClick: (id: string) => void;
  loading: boolean;
  error: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
}

function useInView(ref: React.RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

export default function ActivityGrid({
  activities,
  saved,
  onSave,
  onCardClick,
  loading,
  error,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRetry,
}: ActivityGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, loading, onLoadMore]);

  if (loading) {
    return (
      <div className="masonry">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <AlertCircle size={32} className="text-muted" />
        <p className="text-sm text-muted">Failed to load activities</p>
        <button
          onClick={onRetry}
          className="rounded-full border border-[#333] px-5 py-2 text-xs text-[#999] hover:border-[#555] hover:text-[#ddd] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex justify-center py-20 text-sm text-muted">
        No activities found
      </div>
    );
  }

  return (
    <>
      <div className="masonry">
        {activities.map((a, i) => (
          <FadeInCard key={a.id} index={i}>
            <ActivityCard
              activity={a}
              saved={saved.has(a.id)}
              onSave={onSave}
              onClick={onCardClick}
            />
          </FadeInCard>
        ))}
      </div>
      {hasNextPage && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="inline-block size-3 rounded-full border-2 border-[#555] border-t-transparent animate-spin" />
              Loading more...
            </div>
          )}
        </div>
      )}
    </>
  );
}

function FadeInCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className={inView ? "fade-in" : "opacity-0"}
      style={{ animationDelay: inView ? `${(index % 12) * 40}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
