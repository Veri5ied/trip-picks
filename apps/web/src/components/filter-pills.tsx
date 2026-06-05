"use client";

import { useRef, useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";

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

interface FilterPillsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function FilterPills({ selected, onSelect }: FilterPillsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function select(cat: string) {
    onSelect(cat);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-center size-10.5 rounded-full transition-colors max-sm:size-9 ${
          selected !== "All"
            ? "bg-accent text-white"
            : "bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white"
        }`}
        title="Filter"
      >
        <SlidersHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-44 rounded-xl bg-surface border border-[#333] shadow-xl overflow-hidden z-50">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => select(cat)}
              className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors ${
                selected === cat
                  ? "text-accent font-semibold"
                  : "text-[#999] hover:bg-[#2a2a2a] hover:text-white"
              }`}
            >
              {selected === cat && <span className="mr-2 text-accent">✓</span>}
              {selected !== cat && <span className="mr-2 w-4" />}
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
