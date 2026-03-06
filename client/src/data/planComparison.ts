/**
 * Plan comparison matrix — single source for feature-by-plan comparison.
 * Used by the Feature Matrix in Step 2 of the quote wizard.
 */

export type PlanId = "basic" | "premium" | "executive";

export interface PlanComparisonRow {
  category: string;
  feature: string;
  basic: string;
  premium: string;
  executive: string;
}

export const PLAN_COMPARISON_ROWS: PlanComparisonRow[] = [
  // Core service outcomes
  {
    category: "Mowing",
    feature: "Every visit includes edging, trimming, and blowing",
    basic: "✓",
    premium: "✓",
    executive: "✓",
  },
  {
    category: "Mowing",
    feature: "Mowing frequency (growing season)",
    basic: "Bi-weekly",
    premium: "Weekly",
    executive: "Weekly",
  },
  {
    category: "Mowing",
    feature: "Off-season visits",
    basic: "Monthly check",
    premium: "Bi-weekly",
    executive: "Year-round weekly",
  },
  {
    category: "Turf",
    feature: "Lawn treatment applications per year",
    basic: "2",
    premium: "4",
    executive: "7",
  },
  {
    category: "Turf",
    feature: "Flower bed weed control",
    basic: "✓",
    premium: "✓",
    executive: "✓",
  },
  {
    category: "Turf",
    feature: "Weed-free turf guarantee",
    basic: "—",
    premium: "—",
    executive: "✓",
  },

  // Support and communication
  {
    category: "Support",
    feature: "Dream Yard Recon (landscape plan)",
    basic: "AI plan + personal review",
    premium: "AI plan + personal review",
    executive: "AI plan + personal review",
  },
  {
    category: "Support",
    feature: "Dedicated account manager",
    basic: "Included",
    premium: "Included",
    executive: "Dedicated account manager",
  },
  {
    category: "Support",
    feature: "Service photo updates",
    basic: "—",
    premium: "Included",
    executive: "Included",
  },
  {
    category: "Support",
    feature: "Priority storm scheduling",
    basic: "—",
    premium: "—",
    executive: "Included",
  },

  // Included upgrades
  {
    category: "Allowance",
    feature: "Landscape allowance",
    basic: "—",
    premium: "Seasonal refresh",
    executive: "Premier allowance",
  },
  {
    category: "Allowance",
    feature: "Included upgrades",
    basic: "2 Basic",
    premium: "3 Basic + 1 Premium",
    executive: "3 Basic + 3 Premium",
  },
];
