"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchActivities } from "@/lib/api";
import { useDebounce } from "@/lib/use-debounce";
import { useSaved } from "@/lib/use-saved";
import TopBar from "@/components/top-bar";
import FilterPills from "@/components/filter-pills";
import ActivityGrid from "@/components/activity-grid";
import ActivityModal from "@/components/activity-modal";

export default function HomePage() {
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [modalId, setModalId] = useState<string | null>(null);
  const { saved, toggleSave } = useSaved();

  const debouncedSearch = useDebounce(search, 300);

  const filters = useMemo(
    () => ({
      category: category === "All" ? undefined : category,
      q: debouncedSearch || undefined,
      limit: 20,
    }),
    [category, debouncedSearch],
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["activities", filters],
    queryFn: ({ pageParam }) =>
      fetchActivities({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const activities = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const modalActivity = useMemo(
    () => (modalId ? (activities.find((a) => a.id === modalId) ?? null) : null),
    [modalId, activities],
  );

  return (
    <div className="min-h-screen bg-[#111]">
      <TopBar
        search={search}
        savedCount={saved.size}
        onSearchChange={setSearch}
        onSavedClick={() => router.push("/saved")}
      />
      <FilterPills selected={category} onSelect={setCategory} />
      <div className="mx-auto max-w-225 px-6 pb-10 max-sm:px-3">
        <ActivityGrid
          activities={activities}
          saved={saved}
          onSave={toggleSave}
          onCardClick={setModalId}
          loading={isLoading}
          error={isError}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
          onRetry={() => refetch()}
        />
      </div>
      {modalActivity && (
        <ActivityModal
          activity={modalActivity}
          saved={saved.has(modalActivity.id)}
          onSave={toggleSave}
          onClose={() => setModalId(null)}
        />
      )}
    </div>
  );
}
