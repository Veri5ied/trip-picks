"use client";

import { Star, X } from "lucide-react";
import type { Activity } from "@/lib/api";

function priceLabel(level: number) {
  return ["Budget", "Moderate", "Premium"][Math.min(Math.max(level, 1), 3) - 1];
}

function imgUrl(url: string) {
  const base = url.split("?")[0];
  return `${base}?w=600&q=85`;
}

interface ActivityModalProps {
  activity: Activity;
  saved: boolean;
  onSave: (id: string) => void;
  onClose: () => void;
}

export default function ActivityModal({
  activity,
  saved,
  onSave,
  onClose,
}: ActivityModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-12 max-sm:p-0 max-sm:items-end"
      onClick={onClose}
    >
      <button
        className="fixed top-4 left-1/2 -translate-x-1/2 z-60 size-10 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center cursor-pointer hover:bg-[#333] max-sm:left-auto max-sm:right-4 max-sm:translate-x-0 max-sm:top-3 max-sm:size-9"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <div
        className="bg-surface rounded-4xl max-w-200 w-full max-h-[80vh] overflow-y-auto flex max-sm:flex-col max-sm:rounded-b-none max-sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-[45%] shrink-0 rounded-l-4xl bg-cover bg-center min-h-95 max-sm:w-full max-sm:min-h-45 max-sm:rounded-t-4xl max-sm:rounded-bl-none"
          style={{ backgroundImage: `url(${imgUrl(activity.imageUrl)})` }}
        />
        <div className="p-7 flex-1 max-sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#777] mb-1.5">
            {activity.category}
          </p>
          <h2 className="text-2xl font-bold leading-tight mb-2.5 max-sm:text-xl">
            {activity.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2.5 text-sm text-[#999] mb-4.5">
            <span className="flex items-center gap-1 text-[#f5b342]">
              <Star size={14} fill="#f5b342" /> {activity.rating}
            </span>
            <span>&#8226;</span>
            <span>{activity.durationMinutes} min</span>
            <span>&#8226;</span>
            <span>{priceLabel(activity.priceLevel)}</span>
            <span>&#8226;</span>
            <span>{activity.area}</span>
          </div>
          <p className="text-sm leading-relaxed text-[#bbb] mb-5">
            {activity.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {activity.tags.map((t) => (
              <span
                key={t}
                className="rounded-lg bg-[#2a2a2a] px-3.5 py-1.5 text-xs text-[#ccc]"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => onSave(activity.id)}
              className={`flex-1 rounded-full py-3.5 text-sm font-semibold transition-colors ${
                saved
                  ? "bg-[#2a2a2a] text-[#ddd] hover:bg-[#333]"
                  : "bg-accent text-white hover:bg-[#059a5c]"
              }`}
            >
              {saved ? "Remove from saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
