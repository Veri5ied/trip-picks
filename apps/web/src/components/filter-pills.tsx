"use client";

import { useRef, useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = [
  "All",
  "Culture",
  "Nature",
  "Beach",
  "Shopping",
  "Music",
  "History",
  "Food",
];
const AREAS = ["All", "Lekki", "Victoria Island", "Lagos Island", "Ikoyi"];
const PRICES = [
  { label: "All", value: null },
  { label: "Budget", value: 1 },
  { label: "Moderate", value: 2 },
  { label: "Premium", value: 3 },
];

interface FilterPillsProps {
  category: string;
  area: string;
  priceLevel: number | null;
  onCategoryChange: (cat: string) => void;
  onAreaChange: (area: string) => void;
  onPriceChange: (price: number | null) => void;
}

export default function FilterPills({
  category,
  area,
  priceLevel,
  onCategoryChange,
  onAreaChange,
  onPriceChange,
}: FilterPillsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeCount =
    (category !== "All" ? 1 : 0) +
    (area !== "All" ? 1 : 0) +
    (priceLevel !== null ? 1 : 0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function clearAll() {
    onCategoryChange("All");
    onAreaChange("All");
    onPriceChange(null);
  }

  function Section({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#555] px-4 pt-3 pb-1.5">
          {label}
        </p>
        {children}
      </div>
    );
  }

  const dropdown = (
    <div className="sm:w-56">
      <Section label="Category">
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                category === cat
                  ? "bg-accent text-white"
                  : "text-[#999] bg-[#2a2a2a] hover:bg-[#333] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Section>
      <div className="mx-4 h-px bg-[#2a2a2a]" />
      <Section label="Area">
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {AREAS.map((a) => (
            <button
              key={a}
              onClick={() => onAreaChange(a)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                area === a
                  ? "bg-accent text-white"
                  : "text-[#999] bg-[#2a2a2a] hover:bg-[#333] hover:text-white"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </Section>
      <div className="mx-4 h-px bg-[#2a2a2a]" />
      <Section label="Price">
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {PRICES.map((p) => (
            <button
              key={p.label}
              onClick={() => onPriceChange(p.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                priceLevel === p.value
                  ? "bg-accent text-white"
                  : "text-[#999] bg-[#2a2a2a] hover:bg-[#333] hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Section>
      {activeCount > 0 && (
        <>
          <div className="mx-4 h-px bg-[#2a2a2a]" />
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 w-full px-4 py-2.5 text-xs text-[#999] hover:text-white transition-colors"
          >
            <X size={12} />
            Clear all filters
          </button>
        </>
      )}
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`relative flex items-center justify-center size-10.5 rounded-full transition-colors max-sm:size-9 ${
          activeCount > 0
            ? "bg-accent text-white"
            : "bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white"
        }`}
        title="Filter"
      >
        <SlidersHorizontal size={18} />
        {activeCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-white text-[10px] font-bold text-[#111] flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 sm:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-surface border-t border-[#2a2a2a] max-h-[70vh] overflow-y-auto sm:absolute sm:top-full sm:mt-2 sm:right-0 sm:left-auto sm:bottom-auto sm:rounded-2xl sm:border sm:border-[#333] sm:shadow-xl sm:overflow-visible">
            <div className="flex items-center justify-between px-4 pt-4 pb-1 sm:hidden">
              <p className="text-sm font-semibold">Filters</p>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center size-8 rounded-xl bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {dropdown}
          </div>
        </>
      )}
    </div>
  );
}
