"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Star,
  X,
  Clock,
  MapPin,
  DollarSign,
  CalendarPlus,
  Plus,
  ArrowLeft,
  Calendar,
  Search,
} from "lucide-react";
import type { Activity } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { priceLabel, imgUrl, formatDate } from "@/lib/utils";
import { fetchPlans, updatePlan, createPlan } from "@/lib/api";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [planSearch, setPlanSearch] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState(`${activity.title} & more`);
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    enabled: showPlans && !!user,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const addToPlanMutation = useMutation({
    mutationFn: ({
      planId,
      activityIds,
    }: {
      planId: string;
      activityIds: string[];
    }) => updatePlan(planId, { activityIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Added to plan");
      close();
    },
    onError: () => {
      toast.error("Failed to add to plan");
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: () =>
      createPlan({
        name: newName.trim() || `${activity.title} & more`,
        date: newDate || new Date().toISOString().slice(0, 10),
        activityIds: [activity.id],
        notes: newNotes.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("New plan created");
      close();
    },
    onError: () => {
      toast.error("Failed to create plan");
    },
  });

  function close() {
    setVisible(false);
    setTimeout(onClose, 200);
  }

  function handleAddToPlan(planId: string, currentIds: string[]) {
    if (currentIds.includes(activity.id)) {
      toast.info("Already in this plan");
      return;
    }
    addToPlanMutation.mutate({
      planId,
      activityIds: [...currentIds, activity.id],
    });
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
            style={{
              backgroundImage: `url(${imgUrl(activity.imageUrl, 800, 85)})`,
            }}
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

            {showPlans ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => {
                      setShowPlans(false);
                      setCreatingNew(false);
                      setPlanSearch("");
                    }}
                    className="flex items-center justify-center size-7 rounded-lg bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <p className="text-sm font-semibold">
                    {creatingNew ? "New plan" : "Add to existing plan"}
                  </p>
                </div>

                {creatingNew ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-[#777] mb-1">
                        Name
                      </label>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Saturday adventure"
                        className="w-full rounded-xl bg-card border border-[#333] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#777] mb-1">
                        Date
                      </label>
                      <DatePicker
                        selected={newDate ? new Date(newDate) : null}
                        onChange={(d: Date | null) =>
                          setNewDate(d ? d.toISOString().slice(0, 10) : "")
                        }
                        dateFormat="MMM d, yyyy"
                        placeholderText="Select a date"
                        minDate={new Date()}
                        className="w-full rounded-xl bg-card border border-[#333] px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent cursor-pointer transition-colors"
                        wrapperClassName="w-full"
                        calendarClassName="!bg-[#1a1a1a] !border-[#333] !text-white"
                        popperClassName="!bg-[#1a1a1a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#777] mb-1">
                        Notes <span className="text-[#555]">(optional)</span>
                      </label>
                      <textarea
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        rows={2}
                        placeholder="Any notes"
                        className="w-full rounded-xl bg-card border border-[#333] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-accent transition-colors resize-none"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setCreatingNew(false)}
                        className="flex-1 rounded-xl bg-[#2a2a2a] py-2.5 text-sm font-medium text-white hover:bg-[#333] transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => createPlanMutation.mutate()}
                        disabled={createPlanMutation.isPending}
                        className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-medium text-white hover:bg-[#059a5c] transition-colors disabled:opacity-40"
                      >
                        {createPlanMutation.isPending
                          ? "Creating..."
                          : "Create"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-2">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
                      />
                      <input
                        value={planSearch}
                        onChange={(e) => setPlanSearch(e.target.value)}
                        placeholder="Search plans..."
                        className="w-full rounded-xl bg-card border border-[#333] pl-9 pr-3.5 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-accent transition-colors"
                      />
                    </div>
                    {plans && plans.length > 0 ? (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {plans
                          .filter(
                            (p) =>
                              !planSearch ||
                              p.name
                                .toLowerCase()
                                .includes(planSearch.toLowerCase()),
                          )
                          .map((p) => {
                            const inPlan = p.activityIds.includes(activity.id);
                            return (
                              <button
                                key={p.id}
                                onClick={() =>
                                  handleAddToPlan(p.id, p.activityIds)
                                }
                                disabled={addToPlanMutation.isPending || inPlan}
                                className={`flex items-center gap-3 w-full rounded-xl bg-card border px-3.5 py-2.5 text-left transition-colors disabled:opacity-40 ${
                                  inPlan
                                    ? "border-accent/20"
                                    : "border-[#333] hover:border-accent/40"
                                }`}
                              >
                                <Calendar
                                  size={14}
                                  className="shrink-0 text-[#777]"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {p.name}
                                  </p>
                                  <p className="text-[11px] text-[#777]">
                                    {formatDate(p.date)} &middot;{" "}
                                    {p.activities.length} activities
                                  </p>
                                </div>
                                <span className="shrink-0 text-xs font-semibold text-accent">
                                  {inPlan ? "Added" : "Add"}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    ) : plans && plans.length === 0 ? (
                      <p className="text-xs text-[#777] text-center py-6">
                        No plans yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <div key={i} className="skel h-14 rounded-xl" />
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setCreatingNew(true)}
                      className="flex items-center gap-2 w-full rounded-xl bg-accent/10 border border-accent/30 px-3.5 py-3 mt-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                    >
                      <Plus size={14} />
                      Create a new plan
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <div className="flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5">
                    <Star size={14} className="text-[#f5b342] shrink-0" />
                    <div>
                      <p className="text-xs text-[#777] leading-tight">
                        Rating
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {activity.rating}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-card px-3.5 py-2.5">
                    <Clock size={14} className="text-[#999] shrink-0" />
                    <div>
                      <p className="text-xs text-[#777] leading-tight">
                        Duration
                      </p>
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
                        {priceLabel(activity.priceLevel)}
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
              </>
            )}
          </div>

          {!showPlans && (
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
                  onClick={() => setShowPlans(true)}
                  className="rounded-full py-3 px-4 bg-card text-[#ccc] hover:bg-[#2a2a2a] hover:text-white transition-colors"
                  title="Add to plan"
                >
                  <CalendarPlus size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
