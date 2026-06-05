"use client";

import { useEffect, useState } from "react";
import { Star, X, Clock, MapPin, DollarSign, CalendarPlus } from "lucide-react";
import type { Activity } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function imgUrl(url: string) {
  const base = url.split("?")[0];
  return `${base}?w=800&q=85`;
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
  const router = useRouter();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function close() {
    setVisible(false);
    setTimeout(onClose, 200);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 max-sm:p-0 max-sm:items-end transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={close}
    >
      <div
        className={`relative bg-surface rounded-3xl max-w-200 w-full max-h-[85vh] overflow-y-auto flex flex-col sm:flex-row transition-all duration-200 max-sm:rounded-b-none max-sm:max-h-[92vh] ${
          visible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 size-9 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
        >
          <X size={18} />
        </button>
        <div className="relative sm:w-[45%] sm:shrink-0 max-sm:w-full">
          <div
            className="h-72 sm:h-full sm:min-h-95 bg-cover bg-center sm:rounded-l-3xl max-sm:rounded-t-3xl"
            style={{ backgroundImage: `url(${imgUrl(activity.imageUrl)})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent sm:rounded-l-3xl max-sm:rounded-t-3xl pointer-events-none" />
        </div>

        <div className="p-6 flex-1 flex flex-col max-sm:p-5">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-accent mb-1">
              {activity.category}
            </p>
            <h2 className="text-2xl font-bold leading-tight mb-3 max-sm:text-xl">
              {activity.title}
            </h2>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5">
                <Star size={14} className="text-[#f5b342] shrink-0" />
                <div>
                  <p className="text-xs text-[#777] leading-tight">Rating</p>
                  <p className="text-sm font-semibold text-white">
                    {activity.rating}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5">
                <Clock size={14} className="text-[#999] shrink-0" />
                <div>
                  <p className="text-xs text-[#777] leading-tight">Duration</p>
                  <p className="text-sm font-semibold text-white">
                    {activity.durationMinutes} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5">
                <MapPin size={14} className="text-[#999] shrink-0" />
                <div>
                  <p className="text-xs text-[#777] leading-tight">Area</p>
                  <p className="text-sm font-semibold text-white">
                    {activity.area}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5">
                <DollarSign size={14} className="text-[#999] shrink-0" />
                <div>
                  <p className="text-xs text-[#777] leading-tight">Price</p>
                  <p className="text-sm font-semibold text-white">
                    {
                      ["Budget", "Moderate", "Premium"][
                        Math.min(Math.max(activity.priceLevel, 1), 3) - 1
                      ]
                    }
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-[#bbb] mb-4">
              {activity.description}
            </p>

            {activity.tags.length > 3 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {activity.tags.slice(3).map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-[#2a2a2a] px-3 py-1.5 text-xs text-[#ccc]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2.5 pt-4 border-t border-[#2a2a2a]">
            <button
              onClick={() => {
                onSave(activity.id);
                if (!saved) close();
              }}
              className={`flex-1 rounded-full py-3 text-sm font-semibold transition-colors ${
                saved
                  ? "bg-[#2a2a2a] text-[#ddd] hover:bg-[#333]"
                  : "bg-accent text-white hover:bg-[#059a5c]"
              }`}
            >
              {saved ? "Remove from saved" : "Save"}
            </button>
            {user && (
              <button
                onClick={() => {
                  close();
                  setTimeout(() => router.push("/plans"), 250);
                }}
                className="rounded-full py-3 px-4 bg-card text-[#ccc] hover:bg-[#2a2a2a] hover:text-white transition-colors"
                title="Add to plan"
              >
                <CalendarPlus size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
