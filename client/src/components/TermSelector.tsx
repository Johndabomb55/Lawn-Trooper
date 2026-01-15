import React from "react";
import { Calendar, Check, Sparkles, Gift } from "lucide-react";
import { COMMITMENT_TERMS, TRUST_MESSAGES, LOYALTY_DISCOUNTS } from "@/data/promotions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TermSelectorProps {
  term: '1-year' | '2-year' | '3-year';
  payUpfront: boolean;
  onTermChange: (term: '1-year' | '2-year' | '3-year') => void;
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
      {/* Term Selection */}
      <div>
        <div className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Choose Your Commitment
        </div>
        <div className="grid grid-cols-3 gap-2">
          {COMMITMENT_TERMS.map((option) => {
            const isSelected = term === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onTermChange(option.id)}
                className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 bg-muted/30'
                }`}
              >
                {option.badge && (
                  <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    option.badge === 'Best Value' ? 'bg-accent text-accent-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {option.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-primary text-sm">{option.label}</div>
                    <div className="text-xs text-green-600 font-semibold">
                      +{option.freeMonths} free month{option.freeMonths > 1 ? 's' : ''}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pay Upfront Toggle */}
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
              Pay Upfront
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                +1 extra free month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pay your full term upfront and get an additional free month at the end
            </p>
          </Label>
        </div>
      </div>

      {/* Operation Price Drop - Loyalty Preview */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">Operation Price Drop</span>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Future Benefit</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Loyal customers earn automatic price reductions on renewal:
        </p>
        <div className="flex gap-2 justify-between">
          {LOYALTY_DISCOUNTS.map((tier) => (
            <div key={tier.year} className="flex-1 text-center p-2 bg-white rounded-lg border border-border">
              <div className="text-xs text-muted-foreground">{tier.label}</div>
              <div className="text-lg font-bold text-green-600">-{tier.discount}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commitment Message */}
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
