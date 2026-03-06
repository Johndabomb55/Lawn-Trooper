import React from "react";
import { Award, Star } from "lucide-react";

interface PlanBadgeProps {
  planId: string;
}

const BADGE_CONFIG: Record<string, { label: string; colorClass: string; icon: React.ElementType }> = {
  premium: {
    label: "Most Popular",
    colorClass: "bg-amber-500 text-white border-amber-600",
    icon: Star,
  },
  executive: {
    label: "Best Value",
    colorClass: "bg-emerald-600 text-white border-emerald-700",
    icon: Award,
  },
};

export default function PlanBadge({ planId }: PlanBadgeProps) {
  const config = BADGE_CONFIG[planId];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      data-testid={`badge-plan-${planId}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${config.colorClass}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
