"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchActivities } from "@/lib/api";
import { useDebounce } from "@/lib/use-debounce";
import { useFavorites } from "@/lib/use-favorites";
import TopBar from "@/components/top-bar";
import FilterPills from "@/components/filter-pills";
import ActivityGrid from "@/components/activity-grid";
import ActivityModal from "@/components/activity-modal";

export default function Page() {
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [area, setArea] = useState("All");
  const [priceLevel, setPriceLevel] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [modalId, setModalId] = useState<string | null>(null);
  const { saved, toggleSave } = useFavorites();

  const debouncedSearch = useDebounce(search, 300);

  const filters = useMemo(
    () => ({
      category: category === "All" ? undefined : category,
      area: area === "All" ? undefined : area,
      priceLevel: priceLevel ?? undefined,
      q: debouncedSearch || undefined,
      limit: 20,
    }),
    [category, area, priceLevel, debouncedSearch],
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
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
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

  const activeLabel = useMemo(() => {
    if (category !== "All") return category;
    if (area !== "All") return area;
    if (priceLevel !== null) return ["Budget", "Moderate", "Premium"][priceLevel - 1];
    return null;
  }, [category, area, priceLevel]);

  return (
    <div className="min-h-screen bg-[#111]">
      <TopBar
        search={search}
        savedCount={saved.size}
        onSearchChange={setSearch}
        onSavedClick={() => router.push("/saved")}
      />
      <div className="mx-auto max-w-225 px-6 pb-10 max-sm:px-3">
        <div className="flex items-center gap-2 pb-3">
          <FilterPills
            category={category}
            area={area}
            priceLevel={priceLevel}
            onCategoryChange={setCategory}
            onAreaChange={setArea}
            onPriceChange={setPriceLevel}
          />
          {activeLabel && (
            <span className="text-xs text-[#777]">
              Showing <span className="text-white font-medium">{activeLabel}</span>
            </span>
          )}
        </div>
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
