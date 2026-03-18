import React, { useEffect, useState } from "react";
import { X, Gift, Sparkles } from "lucide-react";
import { BIRTHDAY_BONUS, COMMITMENT_COPY } from "@/data/promotions";

interface PromoBannerProps {
  variant?: "inline" | "sticky";
  storageKey?: string;
  ctaHref?: string;
  compact?: boolean;
}

export default function PromoBanner({
  variant = "inline",
  storageKey = "lt_anniversary_banner_dismissed",
  ctaHref = "/promotions",
  compact = false,
}: PromoBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isDismissed = window.sessionStorage.getItem(storageKey) === "1";
    if (isDismissed) setDismissed(true);
  }, [storageKey]);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(storageKey, "1");
    }
  };

  if (dismissed) return null;

  const isSticky = variant === "sticky";

  return (
    <div
      className={`${isSticky ? "fixed top-16 left-0 right-0 z-40 px-3 md:px-6" : ""}`}
      data-testid={isSticky ? "promo-banner-sticky-wrap" : undefined}
    >
      <div
        className={`relative border border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 ${isSticky ? "rounded-none shadow-lg md:rounded-xl p-4 md:p-5" : compact ? "rounded-xl p-3 md:p-4" : "rounded-xl p-4"}`}
        data-testid="promo-banner"
      >
      <button
        data-testid="button-dismiss-promo"
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-amber-600/60 hover:text-amber-800 transition-colors"
        aria-label="Dismiss promotion"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="bg-amber-500 rounded-full p-2 shrink-0 shadow-sm">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div className="w-full">
          <h4 className={`font-extrabold uppercase tracking-wide text-amber-900 ${isSticky ? "text-lg md:text-xl" : "text-base"}`} data-testid="text-promo-title">
            {BIRTHDAY_BONUS.marketingName}
          </h4>
          <div className={`mt-1 ${compact ? "space-y-0 text-xs md:text-sm" : "space-y-0.5 text-sm"} text-amber-800`} data-testid="text-promo-details">
            <p className="font-semibold text-amber-900">Welcome to Lawn Trooper.</p>
            <p>{COMMITMENT_COPY.promoIntro}</p>
            {!compact && <p>{COMMITMENT_COPY.oneYearLine}</p>}
            {!compact && <p>{COMMITMENT_COPY.twoYearLine}</p>}
            {!compact && <p>{COMMITMENT_COPY.payInFullBonus}</p>}
            {!compact && <p>{COMMITMENT_COPY.maxLine}</p>}
            <p className="text-xs font-medium text-amber-900">{COMMITMENT_COPY.loyaltyLine}</p>
          </div>
          <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-amber-900">
              <Sparkles className="h-4 w-4 text-amber-600" />
              {COMMITMENT_COPY.deadlineLine}
            </div>
            {(isSticky || compact) && (
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-md bg-amber-500 px-3 py-1.5 text-xs md:text-sm font-bold text-white hover:bg-amber-600 transition-colors"
              >
                View Promotions
              </a>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
