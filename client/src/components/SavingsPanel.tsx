import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, 
  TrendingDown, 
  Calendar, 
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
import { TRUST_MESSAGES } from "@/data/promotions";
import type { PromotionResult, AppliedTotals } from "@/data/promotions";

interface SavingsPanelProps {
  baseMonthly: number;
  promotionResult: PromotionResult;
  appliedTotals: AppliedTotals;
  term: 'month-to-month' | '1-year' | '2-year';
  showUnlockedAnimation?: boolean;
  className?: string;
}

export default function SavingsPanel({
  baseMonthly,
  promotionResult,
  appliedTotals,
  term,
  showUnlockedAnimation = false,
  className = "",
}: SavingsPanelProps) {
  const {
    displayedMonthly,
    displayedEffectiveMonthly,
    freeMonthsAtEnd,
    percentSavings,
    annualSavingsEstimate,
    monthlyDiscount,
  } = appliedTotals;

  const { applied, pending, savingsBreakdown, capApplied } = promotionResult;

  const hasDiscounts = applied.length > 0 || pending.length > 0;
  const termLabels: Record<string, string> = {
    'month-to-month': 'Month-to-Month',
    '1-year': '1-Year Commitment',
    '2-year': '2-Year Commitment',
  };
  const termLabel = termLabels[term] || term;

  return (
    <div className={`bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-primary/10 px-4 py-3 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-primary flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Savings & Promotions
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
                  <p className="text-xs max-w-xs">Maximum discount cap reached (30% off or 6 complimentary months).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="p-4 space-y-4">
        {/* Main Pricing */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Monthly Total</div>
            <div className="text-2xl font-bold text-primary">${displayedMonthly}</div>
            {monthlyDiscount > 0 && (
              <div className="text-xs text-green-600">
                <TrendingDown className="w-3 h-3 inline mr-1" />
                Save ${monthlyDiscount}/mo
              </div>
            )}
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Effective Monthly</div>
            <div className="text-2xl font-bold text-green-600">${displayedEffectiveMonthly}</div>
            <div className="text-xs text-muted-foreground">After complimentary</div>
          </div>
        </div>

        {/* Complimentary Months & Total Savings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg">
            <Calendar className="w-5 h-5 text-accent shrink-0" />
            <div>
              <div className="text-sm font-bold text-accent">{freeMonthsAtEnd} Complimentary</div>
              <div className="text-xs text-muted-foreground">At end of {termLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <TrendingDown className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <div className="text-sm font-bold text-green-600">{percentSavings}% Off</div>
              <div className="text-xs text-muted-foreground">~${annualSavingsEstimate}/yr saved</div>
            </div>
          </div>
        </div>

        {/* Applied Promotions */}
        {hasDiscounts && (
          <div className="border-t border-primary/10 pt-3">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-2">
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

        {/* Commitment Message */}
        <div className="text-center pt-2 border-t border-primary/10">
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
