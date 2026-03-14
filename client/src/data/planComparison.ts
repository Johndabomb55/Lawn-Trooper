export type PlanId = "basic" | "premium" | "executive";

export interface PlanComparisonRow {
  category: string;
  feature: string;
  basic: string;
  premium: string;
  executive: string;
}

export const PLAN_COMPARISON_ROWS: PlanComparisonRow[] = [
  {
    category: "Core",
    feature: "Every visit includes edging, trimming, and blowing",
    basic: "✓",
    premium: "✓",
    executive: "✓",
  },
  {
    category: "Core",
    feature: "Flower bed weed control",
    basic: "✓",
    premium: "✓",
    executive: "✓",
  },
  {
    category: "Core",
    feature: "Service photo updates",
    basic: "✓",
    premium: "✓",
    executive: "✓",
  },
  {
    category: "Core",
    feature: "Dream Yard Recon\u2122 (landscape plan)",
    basic: "AI-generated plan + personalized review",
    premium: "AI-generated plan + personalized review",
    executive: "AI-generated plan + personalized review",
  },
  {
    category: "Core",
    feature: "Fall leaf control",
    basic: "Bi-weekly",
    premium: "Bi-weekly",
    executive: "Bi-weekly priority cleanup",
  },

  {
    category: "Service",
    feature: "Mowing frequency (growing season)",
    basic: "Bi-weekly",
    premium: "Weekly",
    executive: "Weekly",
  },
  {
    category: "Service",
    feature: "Off-season visits",
    basic: "Monthly check",
    premium: "Bi-weekly",
    executive: "Year-round weekly",
  },
  {
    category: "Service",
    feature: "Lawn treatment applications per year",
    basic: "2 Applications",
    premium: "4 Applications",
    executive: "7 Applications",
  },
  {
    category: "Service",
    feature: "Property care level",
    basic: "Essential Care",
    premium: "Complete Care",
    executive: "Total Care",
  },
  {
    category: "Support",
    feature: "Support level",
    basic: "Standard support",
    premium: "Priority support",
    executive: "Dedicated account manager",
  },
  {
    category: "Service",
    feature: "Total upgrades included",
    basic: "2 upgrades",
    premium: "4 upgrades (3B + 1P)",
    executive: "6 upgrades (3B + 3P)",
  },

  {
    category: "Executive",
    feature: "Weed-free turf guarantee",
    basic: "—",
    premium: "—",
    executive: "✓",
  },
  {
    category: "Executive",
    feature: "Priority storm scheduling",
    basic: "—",
    premium: "—",
    executive: "Included",
  },
];
