"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

interface TopBarProps {
  search: string;
  savedCount: number;
  onSearchChange: (value: string) => void;
  onSavedClick: () => void;
}

export default function TopBar({
  search,
  savedCount,
  onSearchChange,
  onSavedClick,
}: TopBarProps) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 bg-[#111] px-6 py-4 max-sm:px-4 max-sm:py-3 max-sm:gap-2.5">
      <h1 className="text-xl font-bold tracking-tight whitespace-nowrap max-sm:text-[17px]">
        trip<span className="text-accent">picks</span>
      </h1>
      <input
        className="mx-auto max-w-160 flex-1 min-w-0 rounded-full bg-[#2a2a2a] px-5 py-3 text-sm text-white outline-none placeholder:text-[#666] focus:bg-[#333] max-sm:px-3.5 max-sm:py-2.5 max-sm:text-[14px]"
        placeholder="Search Lagos activities"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        onClick={onSavedClick}
        className="relative flex items-center justify-center size-10.5 rounded-full bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors max-sm:size-9"
      >
        <Bookmark size={18} />
        {hydrated && savedCount > 0 && (
          <span className="absolute -top-1 -right-1 z-20 size-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
            {savedCount > 9 ? "9+" : savedCount}
          </span>
        )}
      </button>
    </header>
  );
}
