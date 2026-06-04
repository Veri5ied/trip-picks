"use client";

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
  return (
    <div className="flex flex-wrap justify-center gap-1.5 px-6 pb-4 max-sm:px-4 max-sm:pb-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors max-sm:px-3 max-sm:py-1.5 ${
            selected === cat
              ? "border-accent bg-accent text-white"
              : "border-[#333] text-[#999] hover:border-[#555] hover:text-[#ddd]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
