import React from "react";

interface ValueMeterProps {
  planId: string;
}

const METER_CONFIG: Record<string, { percent: number; label: string; description: string; colorClass: string; bgClass: string }> = {
  basic: {
    percent: 45,
    label: "Essential Care",
    description: "Keeps the HOA off your back and handles the basics.",
    colorClass: "bg-primary",
    bgClass: "bg-primary/20",
  },
  premium: {
    percent: 75,
    label: "Complete Care",
    description: "Covers most of your yard so you rarely have to worry about it.",
    colorClass: "bg-amber-500",
    bgClass: "bg-amber-500/20",
  },
  executive: {
    percent: 100,
    label: "Total Care",
    description: "Full-property attention for homeowners who want the closest thing to perfection.",
    colorClass: "bg-emerald-600",
    bgClass: "bg-emerald-600/20",
  },
};

export default function ValueMeter({ planId }: ValueMeterProps) {
  const config = METER_CONFIG[planId];
  if (!config) return null;

  return (
    <div data-testid={`value-meter-${planId}`} className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-muted-foreground">Property Care Level</span>
        <span className="font-bold text-foreground">{config.label}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${config.bgClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.colorClass}`}
          style={{ width: `${config.percent}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground leading-tight">{config.description}</p>
    </div>
  );
}
