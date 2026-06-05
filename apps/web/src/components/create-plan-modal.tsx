"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";
import { createPlan } from "@/lib/api";
import type { Activity } from "@/lib/api";

interface CreatePlanModalProps {
  open: boolean;
  onClose: () => void;
  allActivities: Activity[];
}

export default function CreatePlanModal({
  open,
  onClose,
  allActivities,
}: CreatePlanModalProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      onClose();
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-surface border border-[#2a2a2a] p-6 shadow-2xl max-sm:p-5"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">New plan</h2>
          <button
            type="button"
            onClick={onClose}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              selected={date ? new Date(date) : null}
              onChange={(d: Date | null) =>
                setDate(d ? d.toISOString().slice(0, 10) : "")
              }
              dateFormat="MMM d, yyyy"
              placeholderText="Select a date"
              minDate={new Date()}
              className="w-full rounded-xl bg-card border border-[#333] px-4 py-2.5 text-sm text-white outline-none focus:border-accent cursor-pointer transition-colors"
              wrapperClassName="w-full"
              calendarClassName="!bg-[#1a1a1a] !border-[#333] !text-white"
              popperClassName="!bg-[#1a1a1a]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#bbb] mb-1.5">
              Activities{" "}
              <span className="text-[#555]">({selectedIds.size} selected)</span>
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
                  onClick={() => toggleActivity(a.id)}
                  className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedIds.has(a.id)
                      ? "bg-accent/15 text-white"
                      : "text-[#999] hover:bg-[#2a2a2a]"
                  }`}
                >
                  <span
                    className={`shrink-0 size-5 rounded-md border-2 flex items-center justify-center transition-colors ${
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
              className="w-full rounded-xl bg-card border border-[#333] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#555] focus:border-accent transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
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
            className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-[#059a5c] transition-colors disabled:opacity-40 shadow-lg shadow-accent/20"
          >
            {createMutation.isPending ? "Creating..." : "Create plan"}
          </button>
        </div>
      </form>
    </div>
  );
}
