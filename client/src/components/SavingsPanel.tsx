import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, 
  CheckCircle2,
  Sparkles,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TRUST_MESSAGES, calculateTermFreeMonths } from "@/data/promotions";
import type { PromotionResult, AppliedTotals } from "@/data/promotions";

interface SavingsPanelProps {
  baseMonthly: number;
  promotionResult: PromotionResult;
  appliedTotals: AppliedTotals;
  term: '1-year' | '2-year';
  payUpfront: boolean;
  showUnlockedAnimation?: boolean;
  className?: string;
}

export default function SavingsPanel({
  baseMonthly,
  promotionResult,
  appliedTotals,
  term,
  payUpfront,
  showUnlockedAnimation = false,
  className = "",
}: SavingsPanelProps) {
  const {
    displayedMonthly,
    displayedEffectiveMonthly,
    freeMonthsAtEnd,
    monthlyDiscount,
    termMonths,
  } = appliedTotals;

  const { applied, pending, savingsBreakdown, capApplied } = promotionResult;
  const baseTermFreeMonths = calculateTermFreeMonths(term, false);
  const payInFullFreeMonths = calculateTermFreeMonths(term, true);
  const extraPayInFullMonths = Math.max(0, payInFullFreeMonths - baseTermFreeMonths);
  const commitmentSavings = displayedMonthly * freeMonthsAtEnd;
  const payInFullExtraSavings = displayedMonthly * extraPayInFullMonths;
  const totalSavings = (monthlyDiscount * termMonths) + commitmentSavings;

  const hasDiscounts = applied.length > 0 || pending.length > 0;
  const termLabels: Record<string, string> = {
    '1-year': '1-Year Subscription',
    '2-year': '2-Year Subscription',
  };
  const termLabel = termLabels[term] || term;

  return (
    <div className={`bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20 overflow-hidden ${className}`}>
      <div className="bg-primary/10 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-primary text-sm sm:text-base flex items-center gap-2">
            <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Savings Snapshot
          </h4>
          {capApplied && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Cap Applied
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Maximum discount cap reached (30% off or 6 complimentary months during the sale window).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="text-center p-2.5 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Today's Monthly</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">${displayedMonthly}</div>
            {monthlyDiscount > 0 && (
              <div className="text-[11px] text-green-700 font-semibold">
                Includes ${monthlyDiscount}/mo in applied discounts
              </div>
            )}
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Effective Monthly</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-accent">${displayedEffectiveMonthly}</div>
            <div className="text-[11px] text-muted-foreground">Averages complimentary months across your full term.</div>
          </div>
          <div className="text-center p-2.5 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Total Savings</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-green-700">${totalSavings.toLocaleString()}</div>
            <div className="text-[11px] text-muted-foreground">
              {freeMonthsAtEnd} complimentary month{freeMonthsAtEnd === 1 ? "" : "s"} included
            </div>
          </div>
        </div>

        {freeMonthsAtEnd > 0 && (
          <div className="bg-white/40 rounded-lg p-3 border border-primary/10 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Savings from complimentary months</span>
              <span className="font-bold text-green-700">${commitmentSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {payUpfront ? "Pay-in-full estimate" : "Optional pay-in-full estimate"}
              </span>
              <span className="font-semibold text-green-700">
                +${payInFullExtraSavings.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {hasDiscounts && (
          <div className="border-t border-primary/10 pt-3 opacity-85">
            <div className="text-[11px] text-muted-foreground uppercase font-bold mb-2">
              Why You Got This
            </div>
            <div className="space-y-1.5">
              <AnimatePresence>
                {savingsBreakdown.map((promo, i) => {
                  const isPending = pending.some(p => p.id === promo.promoId);
                  return (
                    <motion.div
                      key={promo.promoId}
                      initial={showUnlockedAnimation && i === savingsBreakdown.length - 1 
                        ? { opacity: 0, scale: 0.9, y: -10 } 
                        : false}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex items-center justify-between text-xs p-2 rounded-lg transition-all ${
                        isPending 
                          ? 'bg-amber-50 border border-amber-200' 
                          : 'bg-white/50'
                      } ${showUnlockedAnimation && i === savingsBreakdown.length - 1 ? 'ring-2 ring-accent ring-opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isPending ? 'text-amber-500' : 'text-green-500'}`} />
                        <span className={isPending ? 'text-amber-700' : 'text-foreground'}>
                          {promo.title}
                          {isPending && <span className="ml-1 text-amber-500">(pending)</span>}
                        </span>
                      </div>
                      <div className="font-semibold text-green-600">
                        {promo.percentOff > 0 && `${promo.percentOff}% off`}
                        {promo.freeMonths > 0 && `+${promo.freeMonths} mo`}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-primary/10 space-y-1">
          <p className="text-xs text-primary/80 font-medium italic flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            {TRUST_MESSAGES.commitment}
            <Sparkles className="w-3 h-3" />
          </p>
        </div>
      </div>
    </div>
  );
}
