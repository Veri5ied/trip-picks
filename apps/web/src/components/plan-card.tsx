"use client";

import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import type { Plan } from "@/lib/api";

function imgUrl(url: string) {
  const base = url.split("?")[0];
  return `${base}?w=200&q=60`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

interface PlanCardProps {
  plan: Plan;
  onSelect: () => void;
}

export default function PlanCard({ plan, onSelect }: PlanCardProps) {
  const totalMin = plan.activities.reduce((s, a) => s + a.durationMinutes, 0);
  const previews = plan.activities.slice(0, 3);
  const remaining = plan.activities.length - 3;

  return (
    <div className="group rounded-2xl bg-surface border border-[#2a2a2a] overflow-hidden hover:border-[#3a3a3a] transition-all cursor-pointer">
      {previews.length > 0 && (
        <div className="relative h-36 overflow-hidden max-sm:h-32">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${imgUrl(previews[0].imageUrl)})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent" />
          {previews.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {previews.slice(1).map((a) => (
                <div
                  key={a.id}
                  className="size-7 rounded-lg bg-cover bg-center ring-2 ring-surface"
                  style={{ backgroundImage: `url(${imgUrl(a.imageUrl)})` }}
                />
              ))}
              {remaining > 0 && (
                <div className="size-7 rounded-lg bg-[#2a2a2a] ring-2 ring-surface flex items-center justify-center text-[10px] text-[#999] font-medium">
                  +{remaining}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-[15px] leading-tight truncate">
          {plan.name}
        </h3>

        <div className="flex items-center gap-2.5 mt-2 text-xs text-[#777]">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(plan.date)}
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-[#444]" />
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {totalMin} min
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="flex items-center gap-0.5 text-[11px] text-[#999] bg-card px-2 py-1 rounded-lg">
            <MapPin size={11} />
            {plan.activities.length}{" "}
            {plan.activities.length === 1 ? "stop" : "stops"}
          </div>
          {plan.notes && (
            <span className="text-[11px] text-[#555] truncate max-w-28">
              {plan.notes}
            </span>
          )}
          <ChevronRight
            size={14}
            className="ml-auto text-[#444] group-hover:text-[#777] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
