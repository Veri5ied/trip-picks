"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Calendar } from "lucide-react";
import { fetchPlans, fetchActivities } from "@/lib/api";
import type { Plan } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import PlanCard from "@/components/plan-card";
import CreatePlanModal from "@/components/create-plan-modal";

function groupPlansByMonth(plans: Plan[]) {
  const groups: { label: string; plans: Plan[] }[] = [];
  for (const plan of plans) {
    const d = new Date(plan.date + "T00:00:00");
    const label = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const existing = groups.find((g) => g.label === label);
    if (existing) existing.plans.push(plan);
    else groups.push({ label, plans: [plan] });
  }
  return groups;
}

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();

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

  const grouped = useMemo(
    () => (plans ? groupPlansByMonth(plans) : []),
    [plans],
  );

  const [showForm, setShowForm] = useState(false);

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
          <h1 className="text-lg font-bold flex-1">Plans</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#059a5c] transition-colors shadow-lg shadow-accent/20"
          >
            <Plus size={18} />
            New plan
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-225 px-6 pb-12 max-sm:px-4">
        {!user ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <Calendar size={48} className="text-card" />
            <p className="text-sm text-muted">
              Sign in to create and view plans
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-8 mt-8">
            {Array.from({ length: 2 }).map((_, g) => (
              <div key={g}>
                <div className="skel h-5 w-32 rounded-lg mb-4" />
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="skel h-40 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : plans && plans.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <div className="size-16 rounded-2xl bg-surface flex items-center justify-center">
              <Calendar size={32} className="text-[#333]" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-1">
                No plans yet
              </p>
              <p className="text-sm text-muted">
                Create your first day plan to get started
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-[#059a5c] transition-colors shadow-lg shadow-accent/20"
            >
              Create your first plan
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {grouped.map((group) => (
              <div key={group.label}>
                <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-4 px-1">
                  {group.label}
                </h2>
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  {group.plans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} onSelect={() => {}} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreatePlanModal
        open={showForm}
        onClose={() => setShowForm(false)}
        allActivities={allActivities}
      />
    </div>
  );
}
