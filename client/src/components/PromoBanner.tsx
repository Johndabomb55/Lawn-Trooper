import React, { useEffect, useState } from "react";
import { X, Award } from "lucide-react";
import { TRUST_CELEBRATION_COPY } from "@/data/content";

interface PromoBannerProps {
  variant?: "inline" | "sticky";
  storageKey?: string;
  ctaHref?: string;
  compact?: boolean;
}

/** Dismissible trust strip (legacy routes). No time-limited offers. */
export default function PromoBanner({
  variant = "inline",
  storageKey = "lt_trust_banner_dismissed",
  ctaHref = "#faq",
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
        className={`relative border border-primary/25 bg-primary/5 ${isSticky ? "rounded-none shadow-lg md:rounded-xl p-4 md:p-5" : compact ? "rounded-xl p-3 md:p-4" : "rounded-xl p-4"}`}
        data-testid="promo-banner"
      >
        <button
          data-testid="button-dismiss-promo"
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-muted-foreground/70 hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="bg-primary rounded-full p-2 shrink-0 shadow-sm">
            <Award className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="w-full">
            <h4
              className={`font-extrabold uppercase tracking-wide text-primary ${isSticky ? "text-lg md:text-xl" : "text-base"}`}
              data-testid="text-promo-title"
            >
              {TRUST_CELEBRATION_COPY.headline}
            </h4>
            <div
              className={`mt-1 ${compact ? "space-y-0 text-xs md:text-sm" : "space-y-0.5 text-sm"} text-muted-foreground`}
              data-testid="text-promo-details"
            >
              <p>{TRUST_CELEBRATION_COPY.body}</p>
            </div>
            {(isSticky || compact) && (
              <div className="mt-2">
                <a
                  href={ctaHref}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs md:text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Learn more
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
