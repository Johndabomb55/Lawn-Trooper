import { DollarSign, Sparkles } from "lucide-react";
import type { SavingsSummary } from "@/data/promotions";

interface TotalSavingsBoxProps {
  summary: SavingsSummary;
  title?: string;
  className?: string;
}

export default function TotalSavingsBox({
  summary,
  title = "Savings Snapshot",
  className = "",
}: TotalSavingsBoxProps) {
  return (
    <div className={`rounded-xl border border-green-300 bg-green-50 p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-green-700">{title}</p>
          <p className="text-2xl font-extrabold text-green-700">${summary.totalSavings.toLocaleString()}</p>
        </div>
        <div className="rounded-full bg-green-100 p-2 text-green-700">
          <DollarSign className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-green-200 bg-white p-2">
          <p className="text-muted-foreground">Commitment savings</p>
          <p className="font-bold text-green-700">${summary.commitmentSavings.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-white p-2">
          <p className="text-muted-foreground">Monthly discount savings</p>
          <p className="font-bold text-green-700">${summary.monthlyDiscountSavings.toLocaleString()}</p>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-green-700">
        <Sparkles className="mr-1 inline h-3.5 w-3.5" />
        {summary.complimentaryMonths} complimentary month{summary.complimentaryMonths === 1 ? "" : "s"} over a {summary.termMonths}-month term.
      </p>
    </div>
  );
}
