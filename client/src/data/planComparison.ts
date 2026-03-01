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
  // Mowing & Service
  {
    category: "Mowing",
    feature: "Mowing frequency (growing season)",
    basic: "Bi-weekly",
    premium: "Weekly May–August",
    executive: "Weekly May–August",
  },
  {
    category: "Mowing",
    feature: "Off-season service",
    basic: "Monthly property check",
    premium: "Bi-weekly",
    executive: "Year-round weekly",
  },
  {
    category: "Mowing",
    feature: "Every visit: Edging, trimming, blowing",
    basic: "✓",
    premium: "✓",
    executive: "✓",
  },
  // Turf & Beds
  {
    category: "Turf & Beds",
    feature: "Flower bed weed control",
    basic: "✓",
    premium: "✓",
    executive: "✓",
  },
  {
    category: "Turf & Beds",
    feature: "Executive Turf Defense™",
    basic: "—",
    premium: "—",
    executive: "7 apps/year",
  },
  {
    category: "Turf & Beds",
    feature: "Weed-Free Turf Guarantee",
    basic: "—",
    premium: "—",
    executive: "✓",
  },
  // Support & Extras
  {
    category: "Support",
    feature: "Dream Yard Recon™",
    basic: "AI-generated plan",
    premium: "+ Personalized review",
    executive: "+ Personalized review",
  },
  {
    category: "Support",
    feature: "Account manager",
    basic: "—",
    premium: "Access",
    executive: "Dedicated",
  },
  {
    category: "Support",
    feature: "Service photo updates",
    basic: "—",
    premium: "✓",
    executive: "✓",
  },
  {
    category: "Support",
    feature: "Priority storm service",
    basic: "—",
    premium: "—",
    executive: "✓",
  },
  // Allowance & Upgrades
  {
    category: "Allowance",
    feature: "Landscape Allowance™",
    basic: "—",
    premium: "Seasonal Refresh",
    executive: "Premier",
  },
  {
    category: "Allowance",
    feature: "Upgrades included",
    basic: "2 Basic",
    premium: "3 Basic + 1 Premium",
    executive: "3 Basic + 3 Premium",
  },
];
