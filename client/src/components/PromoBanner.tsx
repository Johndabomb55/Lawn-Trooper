import React, { useState } from "react";
import { X, Gift } from "lucide-react";

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-300 relative" data-testid="promo-banner">
      <button
        data-testid="button-dismiss-promo"
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 text-amber-600/60 hover:text-amber-800 transition-colors"
        aria-label="Dismiss promotion"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="bg-amber-500 rounded-full p-2 shrink-0">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-base" data-testid="text-promo-title">
            Anniversary Launch Special — ends March 25
          </h4>
          <p className="text-sm text-amber-800 mt-1" data-testid="text-promo-details">
            Sign up before March 25 and get 1 free month. Pay annually: 2 months free total. 2-year agreement paid in full: 6 months free total.
          </p>
        </div>
      </div>
    </div>
  );
}
