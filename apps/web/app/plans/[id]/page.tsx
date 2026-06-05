"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { getPlan, updatePlan, deletePlan, fetchActivities } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { priceLabel, imgUrl, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const planId = params.id as string;

  const { data: plan, isLoading } = useQuery({
    queryKey: ["plan", planId],
    queryFn: () => getPlan(planId),
    enabled: !!planId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const { data: activitiesData } = useQuery({
    queryKey: ["activities", "all"],
    queryFn: () => fetchActivities({ limit: 100 }),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
  const allActivities = activitiesData?.data ?? [];

  const isOwner = !!user && plan?.userId === user.id;

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editActivityIds, setEditActivityIds] = useState<Set<string>>(
    new Set(),
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function openEdit() {
    if (!plan) return;
    setEditName(plan.name);
    setEditDate(plan.date);
    setEditNotes(plan.notes ?? "");
    setEditActivityIds(new Set(plan.activityIds));
    setEditing(true);
  }

  const updateMutation = useMutation({
    mutationFn: (input: {
      name?: string;
      date?: string;
      notes?: string;
      activityIds?: string[];
    }) => updatePlan(planId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setEditing(false);
      toast.success("Plan updated");
    },
    onError: () => {
      toast.error("Failed to update plan");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan deleted");
      router.replace("/plans");
    },
    onError: () => {
      toast.error("Failed to delete plan");
    },
  });

  function handleRemoveActivity(activityId: string) {
    if (!plan) return;
    const next = plan.activityIds.filter((id) => id !== activityId);
    updateMutation.mutate({ activityIds: next });
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim() || !editDate || editActivityIds.size === 0) return;
    updateMutation.mutate({
      name: editName.trim(),
      date: editDate,
      notes: editNotes.trim() || undefined,
      activityIds: [...editActivityIds],
    });
  }

  function toggleEditActivity(id: string) {
    setEditActivityIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111]">
        <div className="mx-auto max-w-225 px-6 py-4 max-sm:px-4">
          <div className="skel h-5 w-32 rounded-lg mb-6" />
          <div className="skel h-48 rounded-2xl mb-4" />
          <div className="skel h-24 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted mb-4">Plan not found</p>
          <button
            onClick={() => router.push("/plans")}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to plans
          </button>
        </div>
      </div>
    );
  }

  const totalMin = plan.activities.reduce((s, a) => s + a.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-[#111]">
      <div className="sticky top-0 z-10 bg-[#111]/80 backdrop-blur-lg">
        <div className="mx-auto max-w-225 px-6 py-4 flex items-center gap-4 max-sm:px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-8 text-[#777] hover:text-white transition-colors -ml-1"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold flex-1 truncate">{plan.name}</h1>
          {isOwner && (
            <div className="relative flex items-center h-9 min-w-40 justify-end">
              <div
                className={`absolute right-0 flex items-center gap-2 transition-all duration-200 ${
                  confirmingDelete
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100"
                }`}
              >
                <button
                  onClick={openEdit}
                  className="flex items-center justify-center size-9 rounded-xl bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="flex items-center justify-center size-9 rounded-xl bg-[#2a2a2a] text-[#999] hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div
                className={`absolute right-0 flex items-center gap-2 transition-all duration-200 ${
                  confirmingDelete
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <button
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  className="rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-40"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded-xl bg-[#2a2a2a] px-4 py-2 text-xs font-semibold text-white hover:bg-[#333] transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-225 px-6 pb-12 max-sm:px-4">
        <div className="mt-6 flex items-center gap-3 text-sm text-[#777]">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(plan.date)}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#444]" />
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {totalMin} min
          </span>
          <span className="w-1 h-1 rounded-full bg-[#444]" />
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            {plan.activities.length}{" "}
            {plan.activities.length === 1 ? "stop" : "stops"}
          </span>
        </div>

        {plan.notes && (
          <p className="mt-5 text-sm text-[#999] bg-card rounded-xl px-4 py-3 leading-relaxed border border-[#2a2a2a]">
            {plan.notes}
          </p>
        )}

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-4">
            Activities
          </h2>

          {plan.activities.length === 0 ? (
            <p className="text-sm text-muted">No activities in this plan</p>
          ) : (
            <div className="relative">
              <div className="absolute left-4.75 top-3 bottom-3 w-0.5 bg-[#2a2a2a]" />
              <div className="space-y-5">
                {plan.activities.map((a, idx) => (
                  <div key={a.id} className="relative flex gap-4 pl-11">
                    <div className="absolute left-0 top-1 size-9.5 rounded-full bg-surface border border-[#333] flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex-1 rounded-2xl bg-surface border border-[#2a2a2a] overflow-hidden hover:border-[#3a3a3a] transition-all">
                      <div className="relative h-36 max-sm:h-28">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${imgUrl(a.imageUrl, 200, 60)})`,
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/30 to-transparent" />
                        <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                          {a.category}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => handleRemoveActivity(a.id)}
                            className="absolute top-3 right-3 flex items-center justify-center size-7 rounded-full bg-black/50 text-[#ccc] hover:bg-red-500/80 hover:text-white transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <div className="p-4 max-sm:p-3">
                        <h3 className="font-semibold text-[15px] leading-tight truncate">
                          {a.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#777]">
                          <span className="flex items-center gap-0.5">
                            <Clock size={11} />
                            {a.durationMinutes}m
                          </span>
                          <span className="w-0.5 h-0.5 rounded-full bg-[#444]" />
                          <span className="flex items-center gap-0.5">
                            <Star size={11} className="text-yellow-500" />
                            {a.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-[#666] bg-card px-2 py-0.5 rounded-md border border-[#333]">
                            {a.area}
                          </span>
                          <span className="text-[10px] text-[#666] bg-card px-2 py-0.5 rounded-md border border-[#333]">
                            {priceLabel(a.priceLevel)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditing(false);
          }}
        >
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg rounded-2xl bg-surface border border-[#2a2a2a] p-6 shadow-2xl max-sm:p-5"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Edit plan</h2>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex items-center justify-center size-8 rounded-xl bg-[#2a2a2a] text-[#999] hover:bg-[#333] hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#bbb] mb-1.5">
                  Name
                </label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Saturday adventure"
                  className="w-full rounded-xl bg-card border border-[#333] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-accent transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#bbb] mb-1.5">
                  Date
                </label>
                <DatePicker
                  selected={editDate ? new Date(editDate) : null}
                  onChange={(d: Date | null) =>
                    setEditDate(d ? d.toISOString().slice(0, 10) : "")
                  }
                  dateFormat="MMM d, yyyy"
                  placeholderText="Select a date"
                  className="w-full rounded-xl bg-card border border-[#333] px-4 py-2.5 text-sm text-white outline-none focus:border-accent cursor-pointer transition-colors"
                  wrapperClassName="w-full"
                  calendarClassName="!bg-[#1a1a1a] !border-[#333] !text-white"
                  popperClassName="!bg-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#bbb] mb-1.5">
                  Activities{" "}
                  <span className="text-[#555]">
                    ({editActivityIds.size} selected)
                  </span>
                </label>
                <div className="max-h-44 overflow-y-auto rounded-xl bg-card border border-[#333] p-1 space-y-0.5">
                  {allActivities.length === 0 && (
                    <p className="text-xs text-[#555] px-3 py-4 text-center">
                      No activities found
                    </p>
                  )}
                  {allActivities.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleEditActivity(a.id)}
                      className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        editActivityIds.has(a.id)
                          ? "bg-accent/15 text-white"
                          : "text-[#999] hover:bg-[#2a2a2a]"
                      }`}
                    >
                      <span
                        className={`shrink-0 size-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          editActivityIds.has(a.id)
                            ? "border-accent bg-accent"
                            : "border-[#555]"
                        }`}
                      >
                        {editActivityIds.has(a.id) && (
                          <span className="text-white text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </span>
                      <span className="flex-1 truncate">{a.title}</span>
                      <span className="shrink-0 text-[11px] text-[#666]">
                        {a.durationMinutes}m
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#bbb] mb-1.5">
                  Notes <span className="text-[#555]">(optional)</span>
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  placeholder="Any notes for this plan"
                  className="w-full rounded-xl bg-card border border-[#333] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-accent transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-xl bg-[#2a2a2a] py-2.5 text-sm font-semibold text-white hover:bg-[#333] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !editName.trim() ||
                  !editDate ||
                  editActivityIds.size === 0 ||
                  updateMutation.isPending
                }
                className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-[#059a5c] transition-colors disabled:opacity-40 shadow-lg shadow-accent/20"
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
