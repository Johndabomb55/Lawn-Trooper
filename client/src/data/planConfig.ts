/**
 * Canonical Plan Configuration — Single Source of Truth
 *
 * All plan-related numeric values, slots, and cadences derive from here.
 * UI copy (features, keyStats) remains in plans.ts for flexibility.
 */

export type PlanConfigId = "basic" | "premium" | "executive";

export interface PlanConfig {
  id: PlanConfigId;
  name: string;
  basePrice: number;
  basicSlots: number;
  premiumSlots: number;
  allowConversion: boolean;
  turfAppsIncluded: number | null;
  mowingCadence: string;
  offSeasonCadence: string;
  bedWeedControlCadence: string | null;
  allowanceTierLabel: string | null;
  executivePlusEligible: boolean;
}

export const PLAN_CONFIGS: PlanConfig[] = [
  {
    id: "basic",
    name: "Basic Patrol",
    basePrice: 169,
    basicSlots: 2,
    premiumSlots: 0,
    allowConversion: true,
    turfAppsIncluded: null,
    mowingCadence: "Bi-weekly (growing season)",
    offSeasonCadence: "Monthly property check",
    bedWeedControlCadence: "Monthly",
    allowanceTierLabel: null,
    executivePlusEligible: false,
  },
  {
    id: "premium",
    name: "Premium Patrol",
    basePrice: 299,
    basicSlots: 3,
    premiumSlots: 1,
    allowConversion: true,
    turfAppsIncluded: null,
    mowingCadence: "Weekly (growing season)",
    offSeasonCadence: "Bi-weekly off-season",
    bedWeedControlCadence: "Monthly",
    allowanceTierLabel: "Seasonal Landscape Refresh Allowance™",
    executivePlusEligible: false,
  },
  {
    id: "executive",
    name: "Executive Command",
    basePrice: 399,
    basicSlots: 3,
    premiumSlots: 3,
    allowConversion: true,
    turfAppsIncluded: 7,
    mowingCadence: "Year-round weekly monitoring",
    offSeasonCadence: "Year-round weekly monitoring",
    bedWeedControlCadence: "Monthly",
    allowanceTierLabel: "Premier Landscape Allowance™",
    executivePlusEligible: true,
  },
];

/** Executive Plus toggle: +1 basicSlots, +1 premiumSlots, +$99, allowanceTierLabel → Expanded */
export const EXECUTIVE_PLUS_CONFIG = {
  priceAdd: 99,
  basicSlotsAdd: 1,
  premiumSlotsAdd: 1,
  allowanceTierLabel: "Expanded Landscape Allowance™",
};

export const getPlanConfig = (planId: string): PlanConfig | undefined =>
  PLAN_CONFIGS.find((p) => p.id === planId);

export const getTurfAppsDisplay = (planId: string): string => {
  const config = getPlanConfig(planId);
  if (!config || config.turfAppsIncluded == null) return "—";
  return `${config.turfAppsIncluded} Apps`;
};
