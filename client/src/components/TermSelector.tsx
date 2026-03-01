import React from "react";
import { Calendar, Check, Sparkles } from "lucide-react";
import { calculateTermFreeMonths, COMMITMENT_TERMS, TRUST_MESSAGES } from "@/data/promotions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TermSelectorProps {
  term: '1-year' | '2-year';
  payUpfront: boolean;
  onTermChange: (term: '1-year' | '2-year') => void;
  onPayUpfrontChange: (payUpfront: boolean) => void;
  className?: string;
}

export default function TermSelector({
  term,
  payUpfront,
  onTermChange,
  onPayUpfrontChange,
  className = "",
}: TermSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <div className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Choose Your Commitment
        </div>
        <div className="grid grid-cols-2 gap-2">
          {COMMITMENT_TERMS.map((option) => {
            const isSelected = term === option.id;
            const dynamicFreeMonths = calculateTermFreeMonths(option.id as '1-year' | '2-year', payUpfront);
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onTermChange(option.id as '1-year' | '2-year')}
                className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 bg-muted/30'
                }`}
              >
                {option.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap bg-accent text-accent-foreground">
                    {option.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-primary text-sm">{option.label}</div>
                    <div className="text-xs text-green-600 font-semibold">
                      +{dynamicFreeMonths} complimentary month{dynamicFreeMonths === 1 ? '' : 's'}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
        <div className="flex items-start gap-3">
          <Checkbox
            id="payUpfront"
            checked={payUpfront}
            onCheckedChange={(checked) => onPayUpfrontChange(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="payUpfront" className="cursor-pointer flex-1">
            <div className="font-bold text-primary flex items-center gap-2">
              Pay-in-Full Option
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Doubles commitment
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pay your full term upfront to double commitment months. 1-year goes 1 to 2, and 2-year goes 3 to 6.
            </p>
          </Label>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-primary/70 font-medium italic flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          {TRUST_MESSAGES.commitment}
          <Sparkles className="w-3 h-3" />
        </p>
      </div>
    </div>
  );
}
