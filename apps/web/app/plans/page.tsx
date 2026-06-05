"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, Plus, Calendar, Clock, MapPin, X } from "lucide-react";
import { fetchPlans, createPlan, fetchActivities } from "@/lib/api";
import type { Plan } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function PlansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    enabled: !!user,
  });

  const { data: activitiesData } = useQuery({
    queryKey: ["activities", "all"],
    queryFn: () => fetchActivities({ limit: 100 }),
    enabled: !!user,
  });

  const allActivities = activitiesData?.data ?? [];

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setShowForm(false);
      setName("");
      setDate("");
      setNotes("");
      setSelectedIds(new Set());
    },
  });

  function toggleActivity(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !date || selectedIds.size === 0) return;
    createMutation.mutate({
      name: name.trim(),
      date,
      activityIds: [...selectedIds],
      notes: notes.trim() || undefined,
    });
  }

  return (
    <div className="min-h-screen bg-[#111]">
      <div className="sticky top-0 z-10 bg-[#111]">
        <div className="mx-auto max-w-225 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center size-9 rounded-full bg-[#2a2a2a] text-white hover:bg-[#333] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold flex-1">Plans</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#059a5c] transition-colors"
          >
            <Plus size={18} />
            Create plan
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-225 px-6 pb-10 max-sm:px-3">
        {!user ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm text-muted">
              Sign in to create and view plans
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skel h-32 rounded-2xl" />
            ))}
          </div>
        ) : plans && plans.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Calendar size={40} className="text-[#333]" />
            <p className="text-sm text-muted">No plans yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#059a5c] transition-colors"
            >
              Create your first plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4 max-sm:grid-cols-1">
            {plans?.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-12 pb-8 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl bg-surface border border-[#333] p-6 mx-4"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">New plan</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex items-center justify-center size-8 rounded-full bg-[#2a2a2a] text-[#999] hover:bg-[#333] transition-colors"
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saturday adventure"
                  className="w-full rounded-xl bg-card border border-[#333] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#bbb] mb-1.5">
                  Date
                </label>
                <DatePicker
                  selected={date ? new Date(date) : null}
                  onChange={(d: any) =>
                    setDate(d ? d.toISOString().slice(0, 10) : "")
                  }
                  dateFormat="MMM d, yyyy"
                  placeholderText="Select a date"
                  minDate={new Date()}
                  className="w-full rounded-xl bg-card border border-[#333] px-4 py-2.5 text-sm text-white outline-none focus:border-accent cursor-pointer"
                  wrapperClassName="w-full"
                  calendarClassName="!bg-[#1a1a1a] !border-[#333] !text-white"
                  popperClassName="!bg-[#1a1a1a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#bbb] mb-1.5">
                  Activities ({selectedIds.size} selected)
                </label>
                <div className="max-h-48 overflow-y-auto rounded-xl bg-card border border-[#333] p-1 space-y-0.5">
                  {allActivities.length === 0 && (
                    <p className="text-xs text-[#555] px-3 py-4 text-center">
                      No activities found
                    </p>
                  )}
                  {allActivities.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleActivity(a.id)}
                      className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedIds.has(a.id)
                          ? "bg-accent/20 text-white"
                          : "text-[#999] hover:bg-[#2a2a2a]"
                      }`}
                    >
                      <span
                        className={`shrink-0 size-4 rounded border-2 flex items-center justify-center ${
                          selectedIds.has(a.id)
                            ? "border-accent bg-accent"
                            : "border-[#555]"
                        }`}
                      >
                        {selectedIds.has(a.id) && (
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any notes for this plan"
                  className="w-full rounded-xl bg-card border border-[#333] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-accent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl bg-[#2a2a2a] py-2.5 text-sm font-semibold text-white hover:bg-[#333] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !name.trim() ||
                  !date ||
                  selectedIds.size === 0 ||
                  createMutation.isPending
                }
                className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-[#059a5c] transition-colors disabled:opacity-40"
              >
                {createMutation.isPending ? "Creating..." : "Create plan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="rounded-2xl bg-surface border border-[#2a2a2a] p-5 hover:border-[#333] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold truncate">{plan.name}</h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#777]">
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {plan.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {plan.activities.length}{" "}
              {plan.activities.length === 1 ? "activity" : "activities"}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {plan.activities.reduce((s, a) => s + a.durationMinutes, 0)} min
            </span>
          </div>
          {plan.notes && (
            <p className="mt-2 text-sm text-muted line-clamp-2">{plan.notes}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {plan.activities.map((a) => (
          <span
            key={a.id}
            className="text-[11px] text-[#999] bg-card px-2.5 py-1 rounded-full truncate max-w-40"
          >
            {a.title}
          </span>
        ))}
      </div>
    </div>
  );
}
