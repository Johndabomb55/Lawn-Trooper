import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Info,
  Star,
  ArrowRightLeft,
  Shield,
} from "lucide-react";
import {
  ADDON_CATALOG,
  EXECUTIVE_PLUS,
  OVERAGE_PRICES,
  getSwapOptions,
  getPlanAllowance,
  type PlanId,
  type Addon,
} from "@/data/plans";

interface LockedFeature {
  label: string;
  planIds: PlanId[];
}

const LOCKED_FEATURES: LockedFeature[] = [
  { label: "Bi-weekly mowing (growing season)", planIds: ["basic"] },
  { label: "Weekly mowing (growing season)", planIds: ["premium", "executive"] },
  { label: "Every visit: Precision edging, trimming, blowing", planIds: ["basic", "premium", "executive"] },
  { label: "Off-Season: Monthly property check", planIds: ["basic"] },
  { label: "Off-Season: Bi-weekly service", planIds: ["premium"] },
  { label: "Year-Round Weekly Property Monitoring", planIds: ["executive"] },
  { label: "Monthly Bed Weed Control", planIds: ["premium", "executive"] },
  { label: "Executive Turf Defense™ (up to 7 applications)", planIds: ["executive"] },
  { label: "Weed-Free Turf Guarantee", planIds: ["executive"] },
  { label: "Priority Storm Service", planIds: ["executive"] },
  { label: "Account Manager Access", planIds: ["premium"] },
  { label: "Dedicated Account Manager", planIds: ["executive"] },
  { label: "Dream Yard Recon™: AI-generated landscape plan", planIds: ["basic"] },
  { label: "Dream Yard Recon™ + Personalized Review", planIds: ["premium", "executive"] },
  { label: "Service Photo Updates", planIds: ["premium", "executive"] },
];

const LANDSCAPE_ALLOWANCE: Record<string, { label: string; show: boolean }> = {
  basic: { label: "", show: false },
  premium: { label: "Seasonal Landscape Refresh Allowance™", show: true },
  executive: { label: "Premier Landscape Allowance™", show: true },
  "executive+": { label: "Expanded Landscape Allowance™", show: true },
};

const ALLOWANCE_HELPER = "An included allowance you can apply toward mulch/pine straw refreshes, bed enhancements, pruning upgrades, and cleanups. Resets annually. Specialty materials may require additional upgrade.";

interface PlanDetailsPanelProps {
  plan: PlanId;
  executivePlus: boolean;
  setExecutivePlus: (v: boolean) => void;
  swapCount: number;
  setSwapCount: (v: number) => void;
  basicAddons: string[];
  setBasicAddons: (v: string[]) => void;
  premiumAddons: string[];
  setPremiumAddons: (v: string[]) => void;
  effectiveBasicAllowance: number;
  effectivePremiumAllowance: number;
  showInfo: (title: string, content: React.ReactNode) => void;
}

export default function PlanDetailsPanel({
  plan,
  executivePlus,
  setExecutivePlus,
  swapCount,
  setSwapCount,
  basicAddons,
  setBasicAddons,
  premiumAddons,
  setPremiumAddons,
  effectiveBasicAllowance,
  effectivePremiumAllowance,
  showInfo,
}: PlanDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "premium">("basic");
  const lockedFeatures = LOCKED_FEATURES.filter((f) => f.planIds.includes(plan));
  const allowanceKey = plan === "executive" && executivePlus ? "executive+" : plan;
  const landscapeAllowance = LANDSCAPE_ALLOWANCE[allowanceKey];
  const allowsSwap = plan !== "basic";

  const swapOptions = getSwapOptions(plan, new Date(), executivePlus);
  const maxSwaps = swapOptions.length > 1 ? swapOptions[swapOptions.length - 1].value : 0;

  const basicCatalog = ADDON_CATALOG.filter((a) => a.tier === "basic");
  const premiumCatalog = ADDON_CATALOG.filter((a) => a.tier === "premium");

  const basicRemaining = Math.max(0, effectiveBasicAllowance - basicAddons.length);
  const premiumRemaining = Math.max(0, effectivePremiumAllowance - premiumAddons.length);

  const toggleBasicAddon = (id: string) => {
    if (basicAddons.includes(id)) {
      setBasicAddons(basicAddons.filter((a) => a !== id));
    } else {
      setBasicAddons([...basicAddons, id]);
    }
  };

  const togglePremiumAddon = (id: string) => {
    if (premiumAddons.includes(id)) {
      setPremiumAddons(premiumAddons.filter((a) => a !== id));
    } else {
      setPremiumAddons([...premiumAddons, id]);
    }
  };

  const handleSwapForward = () => {
    if (swapCount < maxSwaps) {
      const newSwap = swapCount + 1;
      setSwapCount(newSwap);
      const newAllowance = getPlanAllowance(plan, newSwap, false, new Date(), executivePlus);
      if (premiumAddons.length > newAllowance.premium) {
        setPremiumAddons(premiumAddons.slice(0, newAllowance.premium));
      }
      if (basicAddons.length > newAllowance.basic) {
        setBasicAddons(basicAddons.slice(0, newAllowance.basic));
      }
    }
  };

  const handleSwapReverse = () => {
    if (swapCount > 0) {
      const newSwap = swapCount - 1;
      setSwapCount(newSwap);
    }
  };

  const renderAddonItem = (
    addon: Addon,
    isSelected: boolean,
    onToggle: () => void,
    tier: "basic" | "premium",
    isOverage: boolean
  ) => {
    const isPremiumTier = tier === "premium";
    return (
      <div key={addon.id} className="flex items-center gap-2 mb-1.5">
        <button
          data-testid={`step2-addon-${addon.id}`}
          onClick={onToggle}
          className={`flex-1 p-2.5 rounded-lg border transition-all text-left flex items-center gap-2 ${
            isSelected
              ? isPremiumTier
                ? "border-accent bg-accent/10"
                : "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              isSelected
                ? isPremiumTier
                  ? "bg-accent border-accent"
                  : "bg-primary border-primary"
                : "border-muted-foreground/40"
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-medium text-sm">{addon.name}</span>
            {isOverage && isSelected && (
              <span className="text-[10px] text-amber-600 ml-1">
                (+${addon.price}/mo)
              </span>
            )}
          </div>
          {isPremiumTier && (
            <Star className="w-3 h-3 text-accent ml-auto flex-shrink-0" />
          )}
        </button>
        <button
          type="button"
          data-testid={`step2-info-${addon.id}`}
          onClick={() => showInfo(addon.name, <p>{addon.description}</p>)}
          className="text-muted-foreground hover:text-primary p-1"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const groupByCategory = (addons: Addon[]) => {
    const categories: Record<string, { label: string; items: Addon[] }> = {};
    const catLabels: Record<string, string> = {
      landscaping: "Landscaping",
      cleaning: "Cleaning & Wash",
      seasonal: "Seasonal / Christmas Lights",
      trash: "Trash Can Cleaning",
    };
    for (const addon of addons) {
      if (!categories[addon.category]) {
        categories[addon.category] = {
          label: catLabels[addon.category] || addon.category,
          items: [],
        };
      }
      categories[addon.category].items.push(addon);
    }
    return Object.values(categories);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-muted/20 border border-border rounded-xl overflow-hidden"
    >
      <div className="p-4 space-y-4">
        {plan === "executive" && (
          <button
            data-testid="executive-plus-toggle"
            onClick={() => {
              setExecutivePlus(!executivePlus);
              setSwapCount(0);
            }}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              executivePlus
                ? "border-accent bg-accent/10"
                : "border-border hover:border-accent/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  {EXECUTIVE_PLUS.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {EXECUTIVE_PLUS.description} — +1 Basic, +1 Premium upgrade
                </div>
                <div className="text-xs text-accent/80 mt-1">
                  {EXECUTIVE_PLUS.perks.join(" • ")}
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  executivePlus
                    ? "border-accent bg-accent"
                    : "border-muted-foreground/30"
                }`}
              >
                {executivePlus && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
          </button>
        )}

        <div>
          <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" />
            Included (Locked)
          </h4>
          <div className="space-y-1">
            {lockedFeatures.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm py-1"
                data-testid={`locked-feature-${i}`}
              >
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-foreground/90">{feature.label}</span>
              </div>
            ))}
            {landscapeAllowance?.show && (
              <div className="flex items-start gap-2 text-sm py-1">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-accent">
                    {landscapeAllowance.label}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                    {ALLOWANCE_HELPER}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
            <ArrowRightLeft className="w-4 h-4" />
            Included Upgrades (Swappable)
          </h4>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-primary">
                {effectiveBasicAllowance}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Basic Slots
              </div>
              <div className="text-[10px] text-primary/70 mt-0.5">
                {basicRemaining > 0
                  ? `${basicRemaining} remaining`
                  : basicAddons.length > effectiveBasicAllowance
                  ? `${basicAddons.length - effectiveBasicAllowance} overage`
                  : "All filled"}
              </div>
            </div>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-accent">
                {effectivePremiumAllowance}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Premium Slots
              </div>
              <div className="text-[10px] text-accent/70 mt-0.5">
                {effectivePremiumAllowance === 0
                  ? "Not available"
                  : premiumRemaining > 0
                  ? `${premiumRemaining} remaining`
                  : premiumAddons.length > effectivePremiumAllowance
                  ? `${premiumAddons.length - effectivePremiumAllowance} overage`
                  : "All filled"}
              </div>
            </div>
          </div>

          {allowsSwap && maxSwaps > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-sm flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
                    Upgrade Conversion
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Trade 2 Basic slots for 1 Premium slot
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  data-testid="swap-reverse"
                  onClick={handleSwapReverse}
                  disabled={swapCount === 0}
                  className={`flex-1 py-2 px-3 text-xs rounded-lg border-2 transition-all font-medium ${
                    swapCount === 0
                      ? "border-border text-muted-foreground/50 cursor-not-allowed"
                      : "border-primary/30 bg-background hover:border-primary/50 text-foreground"
                  }`}
                >
                  +2 Basic ← 1 Premium
                </button>
                <div className="flex items-center px-2 text-xs font-bold text-primary">
                  {swapCount > 0 ? `${swapCount}×` : "0"}
                </div>
                <button
                  data-testid="swap-forward"
                  onClick={handleSwapForward}
                  disabled={swapCount >= maxSwaps}
                  className={`flex-1 py-2 px-3 text-xs rounded-lg border-2 transition-all font-medium ${
                    swapCount >= maxSwaps
                      ? "border-border text-muted-foreground/50 cursor-not-allowed"
                      : "border-primary bg-primary/10 hover:bg-primary/20 text-primary"
                  }`}
                >
                  2 Basic → +1 Premium
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-1 mb-3 border-b border-border">
            <button
              data-testid="tab-basic-upgrades"
              onClick={() => setActiveTab("basic")}
              className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 ${
                activeTab === "basic"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Basic Upgrades ({basicAddons.length}/{effectiveBasicAllowance})
            </button>
            {(plan === "premium" || plan === "executive") && (
              <button
                data-testid="tab-premium-upgrades"
                onClick={() => setActiveTab("premium")}
                className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 ${
                  activeTab === "premium"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Premium Upgrades ({premiumAddons.length}/
                {effectivePremiumAllowance})
              </button>
            )}
          </div>

          <div className="max-h-[280px] overflow-y-auto scroll-smooth pr-1">
            {activeTab === "basic" && (
              <div>
                {groupByCategory(basicCatalog).map((cat) => (
                  <div key={cat.label}>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-2 first:mt-0">
                      {cat.label}
                    </div>
                    {cat.items.map((addon) => {
                      const isSelected = basicAddons.includes(addon.id);
                      const idx = basicAddons.indexOf(addon.id);
                      const isOverage =
                        isSelected && idx >= effectiveBasicAllowance;
                      return renderAddonItem(
                        addon,
                        isSelected,
                        () => toggleBasicAddon(addon.id),
                        "basic",
                        isOverage
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "premium" && (
              <div>
                {effectivePremiumAllowance === 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg mb-2">
                    No Premium slots included. Each selection adds +$
                    {OVERAGE_PRICES.premium}/mo.
                  </div>
                )}
                {groupByCategory(premiumCatalog).map((cat) => (
                  <div key={cat.label}>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-2 first:mt-0">
                      {cat.label}
                    </div>
                    {cat.items.map((addon) => {
                      const isSelected = premiumAddons.includes(addon.id);
                      const idx = premiumAddons.indexOf(addon.id);
                      const isOverage =
                        isSelected && idx >= effectivePremiumAllowance;
                      return renderAddonItem(
                        addon,
                        isSelected,
                        () => togglePremiumAddon(addon.id),
                        "premium",
                        isOverage
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground/70">
          Some upgrade services are seasonal and may be scheduled during
          appropriate times of the year.
        </p>
      </div>
    </motion.div>
  );
}
