"use client";

import { Star } from "lucide-react";
import type { Activity } from "@/lib/api";

function imgUrl(url: string) {
  const base = url.split("?")[0];
  return `${base}?w=400&q=80`;
}

function priceLabel(level: number) {
  return ["Budget", "Moderate", "Premium"][Math.min(Math.max(level, 1), 3) - 1];
}

interface ActivityCardProps {
  activity: Activity;
  saved: boolean;
  onSave: (id: string) => void;
  onClick: (id: string) => void;
  alwaysShowSave?: boolean;
}

export default function ActivityCard({
  activity,
  saved,
  onSave,
  onClick,
  alwaysShowSave,
}: ActivityCardProps) {
  return (
    <div
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-card"
      onClick={() => onClick(activity.id)}
    >
      <div className="relative">
        <img
          src={imgUrl(activity.imageUrl)}
          alt={activity.title}
          loading="lazy"
          className="w-full block"
        />
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none ${
            alwaysShowSave
              ? ""
              : "opacity-0 group-hover:opacity-100 transition-opacity"
          }`}
        />
        <div
          className={`absolute top-0 left-0 right-0 p-3 flex items-start pointer-events-auto ${
            alwaysShowSave
              ? ""
              : "opacity-0 group-hover:opacity-100 transition-opacity"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full pointer-events-none">
            {activity.category}
          </span>
          <button
            onClick={() => onSave(activity.id)}
            className={`ml-auto rounded-full px-5 py-3 text-sm font-bold transition-colors max-sm:px-4 max-sm:py-2 max-sm:text-[12px] ${
              saved
                ? "bg-white text-[#111] hover:bg-[#ddd]"
                : "bg-accent text-white hover:bg-[#059a5c]"
            }`}
          >
            {saved ? (alwaysShowSave ? "Remove" : "Saved") : "Save"}
          </button>
        </div>
      </div>
      <div className="px-3 pb-3.5 pt-2.5 max-sm:px-2 max-sm:pb-2 max-sm:pt-1.5">
        <h3 className="text-sm font-semibold leading-tight max-sm:text-[13px]">
          {activity.title}
        </h3>
        <p className="mt-0.5 text-xs text-muted max-sm:text-[11px]">
          {activity.area}
        </p>
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#777] max-sm:text-[10px]">
          <span className="flex items-center gap-0.5 text-[#f5b342]">
            <Star size={11} fill="#f5b342" /> {activity.rating}
          </span>
          <span>&#8226;</span>
          <span>{activity.durationMinutes} min</span>
          <span>&#8226;</span>
          <span>{priceLabel(activity.priceLevel)}</span>
        </div>
      </div>
    </div>
  );
}
