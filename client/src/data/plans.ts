export const PROMO_CONFIG = {
  executiveBonusEnabled: true,
  cutoffDate: "2026-01-25T23:59:59", // Sale ends Jan 25th at 11:59 PM (end of day)
  saleLabel: "25th Anniversary Sale + AI Cost Reductions Ends January 25th"
};

export const GLOBAL_CONSTANTS = {
  YARD_ELIGIBILITY: "Yards larger than 1 acre or not in a neighborhood must submit pics for a custom quote.",
  BUSH_TRIMMING_DISPOSAL: "All clippings removed and disposed for clean curb appeal and pristine flower beds.",
  AI_SAVINGS_MESSAGE: "We are lowering costs with new AI + 2026 technology and passing savings on to customers.",
  COMMITMENT_MESSAGE: "If you commit to us, we commit to you.",
  EXISTING_CUSTOMER_LOYALTY: "Our Loyalty Club Customers: Sign into your account with your customer login for your loyalty discount based on your years of service. (Must complete 12 months to get a loyalty discount).",
  CONSULTATION_REFUND_POLICY: "After the first month is paid, schedule a consultation + walkthrough (virtual or in-person). At the time of the consultation, if the customer decides it's not the right fit, provide a full refund.",
  AI_TECH_EXPLANATION: "We sometimes will deploy robotic AI vision, LiDAR sensor, satellite-linked mowing units to achieve the best cut quality and highest efficiency at no additional expense to the customer. Lawn Trooper reserves the right to choose which robot will be best for each property, although customer can weigh in of course."
};

export const PLANS = [
  {
    id: "basic",
    name: "Basic Patrol",
    price: 169,  // Fixed base price for Basic plan
    oldPrice: 199,
    priceLabel: "Starts at $169/mo",
    description: "Includes: 1 Basic Add-on + 0 Premium Add-ons",
    keyStats: [
      { label: "Mowing", value: "Bi-Weekly" },
      { label: "Weed Control", value: "2 Treatments" },
      { label: "Bush Trimming", value: "1x/Year" },
      { label: "Add-ons", value: "1 Included" }
    ],
    features: [
      "Mowing: Regular (bi-weekly) mowing<br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
      "Weed Control: 2 pre-emergent weed control treatments per year",
      "Weed Control (Beds): Weed control in all flower beds included",
      `<span class='font-bold text-primary'>Bush Trimming: 1 bush trimming per year (Limit 20 bushes) + "${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}"</span>`,
      "Light Spring & Fall Cleanup: Pull out dead seasonal plants, cut back pampas grasses, lillies, and other seasonal and ornamental growth for excellent early season curb appeal.",
      "Leaf Service (Fall & Winter): Monthly leaf cleanup - Leaf blowing / Mulching / Removal",
      "Weekly Mowing: Not Included (Upgrade to Premium or Executive)",
      "Weed-Free Guarantee: Not Included (Executive only)",
      "Off-season Bi-weekly Yard Checks: Not Included (Premium & Executive)",
      "Small Tree & Low-Hanging Branch Trimming: Not Included (Premium & Executive)",
      "Free Customized Landscaping Plan: Not Included (Premium & Executive)",
      "Multiple Trash Cans Cleaning: Not Included (Executive only)"
    ],
    allowance: {
      basic: 1,
      premium: 0
    },
    allowsSwap: false,
    allowanceLabel: "1 Basic Add-On"
  },
  {
    id: "premium",
    name: "Premium Patrol",
    price: 299,  // Fixed base price for Premium plan
    oldPrice: 349,
    priceLabel: "Starts at $299/mo",
    description: "Includes: 2 Basic Add-ons + 1 Premium Add-on",
    keyStats: [
      { label: "Mowing", value: "Weekly" },
      { label: "Weed Control", value: "4 Treatments" },
      { label: "Bush Trimming", value: "2x/Year" },
      { label: "Add-ons", value: "3 Included" }
    ],
    features: [
      "Mowing: Weekly mowing<br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
      "Weed Control: 4 weed control treatments + weed killer",
      "Weed Control (Beds): Weed control in all flower beds included",
      "Weed-Free Guarantee: Not Included",
      `<span class='font-bold text-primary'>Bush Trimming: 2 bush trimmings per year (Limit 20 bushes) + "${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}"</span>`,
      "<span class='font-bold text-primary'>Spring & Fall Cleanup</span><br/><span class='text-xs text-muted-foreground'>Heavy cleanups with overgrown plants, trees, and debris require a premium upgrade to be included.</span>",
      "<span class='font-bold text-primary'>Holiday Hustle Cleanup</span><br/><span class='text-xs text-muted-foreground'>Pre-holiday leaf and debris cleanup before major holidays or events.</span>",
      "Off-season Bi-weekly Yard Checks<br/><span class='text-xs text-muted-foreground'>Trash pick up, blow driveway and steps, pick any unwanted winter weeds, pick up sticks and limbs, check for winter damage, etc.</span>",
      "Small Tree & Low-Hanging Branch Trimming: Once per year + debris removed from property",
      "<span class='font-bold text-primary'>Leaf Service (Fall & Winter): Bi-weekly leaf cleanup</span> - Leaf blowing / Mulching / Removal",
      "Free Customized Wish List Landscaping Plan & Diagram + Itemized Cost Layout",
      "Multiple Trash Cans Cleaning: Not Included (Executive only)"
    ],
    allowance: {
      basic: 2,
      premium: 1
    },
    allowsSwap: false,
    allowanceLabel: "2 Basic Add-Ons + 1 Premium Add-On"
  },
  {
    id: "executive",
    name: "Executive Command",
    price: 399,  // Fixed base price for Executive plan
    oldPrice: 469,
    priceLabel: "Starts at $399/mo",
    description: "Includes: 3 Basic Add-ons + 2 Premium Add-ons",
    keyStats: [
      { label: "Mowing", value: "Priority Weekly" },
      { label: "Weed Control", value: "6 Treatments" },
      { label: "Bush Trimming", value: "3x/Year" },
      { label: "Add-ons", value: "5 Included" }
    ],
    features: [
      "<span class='font-bold text-accent'>Priority Mowing: Weekly mowing with top-priority scheduling</span><br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
      "Weed Control: 6 weed treatments per year",
      "Weed Control (Beds): Weed control in all flower beds included",
      "<span class='font-bold text-accent'>Weed-Free Guarantee</span>: After 12 consecutive months of service, if weeds are present in treated areas, additional weed applications are provided at no charge.",
      `<span class='font-bold text-accent'>Bush Trimming: 3 bush trimmings per year (Unlimited Bushes) + "${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}"</span>`,
      "<span class='font-bold text-accent'>Spring & Fall Cleanup</span><br/><span class='text-xs text-muted-foreground'>Heavy cleanups with overgrown plants, trees, and debris require a premium upgrade to be included.</span>",
      "<span class='font-bold text-accent'>Holiday Hustle Cleanup</span><br/><span class='text-xs text-muted-foreground'>Pre-holiday leaf and debris cleanup before major holidays or events.</span>",
      "<span class='font-bold text-accent'>After-Storm Visits: Small limbs and debris cleanup included</span>",
      "<span class='font-bold text-accent'>Bi-weekly Winter Visits & Yard Checks</span><br/><span class='text-xs text-muted-foreground'>Trash pick up, blow driveway and steps, pick any unwanted winter weeds, pick up sticks and limbs, check for winter damage, etc.</span>",
      "Small Tree & Low-Hanging Branch Trimming: Once per year + debris removed from property",
      "<span class='font-bold text-accent'>Leaf Service (Fall & Winter): Bi-weekly leaf cleanup</span> - Leaf blowing / Mulching / Removal",
      "Free Customized Wish List Landscaping Plan & Diagram + Itemized Cost Layout",
      "<span class='font-bold text-accent'>Multiple Trash Cans: Included with any trash bin cleaning add-on (up to 3 cans)</span>",
      "<span class='font-bold text-accent'>Commander's Club: 1 FREE premium add-on on your service anniversary</span>"
    ],
    allowance: {
      basic: 3,
      premium: 2
    },
    allowsSwap: true,
    executiveExtras: [
      "Unlimited Mulch",
      "Unlimited Pine Straw",
      "Bi-Monthly Shrub Trimmings (every 2 months year-round)",
      "After-Storm Visits",
      "Bi-Weekly Winter Visits & Yard Checks"
    ],
    allowanceLabel: "3 Basic Add-Ons + 2 Premium Add-Ons",
    swapLabel: "Swap option: 1 Premium = 2 Basic"
  }
];

// CANONICAL ADD-ON CATALOG
// All add-ons defined here with: id, name, tier, category, price, description
// Pricing: Basic = $20/mo overage, Premium = $40/mo overage

export type AddonTier = 'basic' | 'premium';
export type AddonCategory = 'landscaping' | 'cleaning' | 'seasonal' | 'trash';

export interface Addon {
  id: string;
  name: string;
  tier: AddonTier;
  category: AddonCategory;
  price: number;
  description: string;
}

export const ADDON_CATALOG: Addon[] = [
  // --- BASIC ADD-ONS ($20/mo overage) ---
  {
    id: "shrub_hedge_trimming",
    name: "Shrub / Hedge Trimming",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Light trimming of shrubs or hedges to maintain shape and appearance. All clippings will be collected and properly disposed of."
  },
  {
    id: "basic_pressure_wash",
    name: "Basic Pressure-Wash Package",
    tier: "basic",
    category: "cleaning",
    price: 20,
    description: "Light exterior pressure washing to refresh high-visibility areas around your home and maintain a clean, welcoming entrance. Includes: Porch, Sidewalk, Mailbox."
  },
  {
    id: "driveway_pressure_wash_basic",
    name: "Driveway Pressure Wash",
    tier: "basic",
    category: "cleaning",
    price: 20,
    description: "Targeted pressure washing to clean and brighten driveway surfaces, improving curb appeal and removing built-up grime."
  },
  {
    id: "overseeding",
    name: "Overseeding",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Overseeding services to help improve lawn density and encourage healthier grass growth."
  },
  {
    id: "mulch_install_4yards",
    name: "Basic Mulch Install (Up to 4 Yards)",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Mulch installation for defined garden or bed areas to refresh appearance and support plant health. Mulch included (brown, red, black hardwood or pine bark). Delivery and installation included."
  },
  {
    id: "quarterly_trash_bin_cleaning",
    name: "Quarterly Trash Can Cleaning",
    tier: "basic",
    category: "trash",
    price: 20,
    description: "Periodic cleaning of outdoor trash and recycling bins to reduce odors and buildup."
  },
  {
    id: "christmas_lights_basic",
    name: "Basic Seasonal Lighting",
    tier: "basic",
    category: "seasonal",
    price: 20,
    description: "Ground-level seasonal lighting focused on shrubs, small trees, and select landscape areas using simple yard pop-up lighting. Final layout to be discussed with the homeowner."
  },
  
  // --- PREMIUM ADD-ONS ($40/mo overage) ---
  {
    id: "extra_weed_control",
    name: "Additional Weed Control & Fertilization",
    tier: "premium",
    category: "landscaping",
    price: 40,
    description: "Adds three additional lawn applications, including fertilizer, pre-emergent weed prevention, and targeted weed-killer applications, beyond what's included in your plan."
  },
  {
    id: "premium_pressure_wash",
    name: "Premium Pressure-Wash Package",
    tier: "premium",
    category: "cleaning",
    price: 40,
    description: "Comprehensive exterior pressure washing for a deeper, more complete clean across key areas of your property. Includes: Driveway, Porch, Sidewalk, Mailbox, additional exterior surfaces as appropriate."
  },
  {
    id: "house_soft_wash",
    name: "House Soft Wash",
    tier: "premium",
    category: "cleaning",
    price: 40,
    description: "Low-pressure soft washing to safely clean exterior siding and surfaces, helping restore appearance while protecting your home's finish."
  },
  {
    id: "mulch_install_10yards",
    name: "Premium Mulch Install (Up to 10 Yards)",
    tier: "premium",
    category: "landscaping",
    price: 40,
    description: "Expanded mulch installation with increased coverage and attention to detail for enhanced curb appeal. Mulch included. Delivery and installation included."
  },
  {
    id: "monthly_trash_bin_cleaning",
    name: "Monthly Trash Can Cleaning",
    tier: "premium",
    category: "trash",
    price: 40,
    description: "Monthly cleaning of outdoor trash and recycling bins to help maintain freshness and reduce odor over time."
  },
  {
    id: "christmas_lights_premium",
    name: "Premium Seasonal Lighting",
    tier: "premium",
    category: "seasonal",
    price: 40,
    description: "Expanded seasonal lighting designed for holidays, including roofline lighting, enhanced landscape features, and decorative yard elements as appropriate."
  }
];

// Helper to get add-ons by tier
export const getAddonsByTier = (tier: AddonTier): Addon[] => {
  return ADDON_CATALOG.filter(addon => addon.tier === tier);
};

// Helper to get add-on by ID
export const getAddonById = (id: string): Addon | undefined => {
  return ADDON_CATALOG.find(addon => addon.id === id);
};

// Legacy arrays for backward compatibility
export const BASIC_ADDONS = ADDON_CATALOG.filter(a => a.tier === 'basic').map(a => ({
  id: a.id,
  label: a.name,
  description: a.description
}));

export const PREMIUM_ADDONS = ADDON_CATALOG.filter(a => a.tier === 'premium').map(a => ({
  id: a.id,
  label: a.name,
  description: a.description
}));

export const SEASONAL_ADDONS = ADDON_CATALOG.filter(a => a.category === 'seasonal').map(a => ({
  id: a.id,
  label: a.name,
  description: a.description
}));

// EXECUTIVE EXCLUSIVES (included with Executive plan, not selectable add-ons)
export const EXECUTIVE_EXTRAS = [
  "Unlimited Mulch",
  "Unlimited Pine Straw",
  "Bi-Monthly Shrub Trimmings (every 2 months year-round)",
  "After-Storm Visits",
  "Bi-Weekly Winter Visits & Yard Checks"
];

export const EXECUTIVE_PERKS = [
  "Priority mowing scheduling",
  "After-storm visits: Small limbs & debris cleanup",
  "Bi-weekly winter visits & yard checks",
  "Commander's Club: 1 FREE premium add-on on anniversary",
  "Swap option: Trade 1 Premium slot for +2 Basic slots"
];

// OVERAGE PRICING (LOCKED)
export const OVERAGE_PRICES = {
  basic: 20,  // $20/mo per extra basic add-on
  premium: 40 // $40/mo per extra premium add-on
};

// Calculate overage cost
export const calculateOverageCost = (
  selectedBasic: number,
  selectedPremium: number,
  includedBasic: number,
  includedPremium: number
): { basicOverage: number; premiumOverage: number; totalOverage: number } => {
  const basicOverage = Math.max(0, selectedBasic - includedBasic);
  const premiumOverage = Math.max(0, selectedPremium - includedPremium);
  return {
    basicOverage,
    premiumOverage,
    totalOverage: (basicOverage * OVERAGE_PRICES.basic) + (premiumOverage * OVERAGE_PRICES.premium)
  };
};

// Helper to get allowance with swap adjustment
// swapCount: 0, 1, or 2 (only applies to Executive)
// Each swap converts 1 Premium slot to +2 Basic slots
export const getPlanAllowance = (
  planId: string, 
  swapCount: number = 0
): { basic: number; premium: number } => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return { basic: 0, premium: 0 };

  let { basic, premium } = plan.allowance;

  // Apply swap only for Executive plan
  if (planId === "executive" && plan.allowsSwap && swapCount > 0) {
    const validSwap = Math.min(swapCount, premium); // Can't swap more than available premium slots
    basic += validSwap * 2;
    premium -= validSwap;
  }

  return { basic, premium };
};

// SWAP RULES (LOCKED)
// Executive base: 3 Basic + 2 Premium
// Swap 0: 3B + 2P
// Swap 1: 5B + 1P (traded 1P for +2B)
// Swap 2: 7B + 0P (traded 2P for +4B)
export const SWAP_OPTIONS = [
  { value: 0, label: "No swap (3 Basic + 2 Premium)" },
  { value: 1, label: "Swap 1 Premium → +2 Basic (5 Basic + 1 Premium)" },
  { value: 2, label: "Swap 2 Premium → +4 Basic (7 Basic + 0 Premium)" }
];

// Acre multipliers for pricing: 20% increase per yard size tier
// 1/3 acre = 1.0, 2/3 acre = 1.2, 1 acre = 1.44
const ACRE_MULTIPLIERS: Record<string, number> = {
  "1/3": 1.0,
  "2/3": 1.2,
  "1": 1.44
};

// AI Savings rate: 15% discount (2025 = 2026 / 0.85)
const AI_SAVINGS_RATE = 0.15;

// Get multiplier for a given yard size ID
export const getAcreMultiplier = (yardSizeId: string): number => {
  return ACRE_MULTIPLIERS[yardSizeId] || 1.0;
};

// Get base price for a plan from PLANS config (single source of truth)
export const getPlanBasePrice = (planId: string): number => {
  const plan = PLANS.find(p => p.id === planId);
  return plan?.price || 169;
};

// Calculate 2026 AI-Savings price (current promotional price)
// Price = Plan Base Price × Yard Size Multiplier
// Add-ons are NOT affected by yard size - they are flat rates
export const calculate2026Price = (planId: string, yardSizeId: string): number => {
  const planBasePrice = getPlanBasePrice(planId);
  const yardMultiplier = getAcreMultiplier(yardSizeId);
  const price = planBasePrice * yardMultiplier;
  
  // Round to whole dollars
  return Math.round(price);
};

// Calculate 2025 Standard price (before AI savings)
export const calculate2025Price = (planId: string, yardSizeId: string): number => {
  const price2026 = calculate2026Price(planId, yardSizeId);
  // 2025 = 2026 / (1 - 0.15) = 2026 / 0.85
  const price2025 = price2026 / (1 - AI_SAVINGS_RATE);
  
  // Round to nearest $5 for cleaner display
  return Math.round(price2025 / 5) * 5;
};

// Legacy function for backward compatibility
export const calculatePlanPrice = (planId: string, acres: number): number => {
  // Map acres to yard size ID
  let yardSizeId = "1/3";
  if (acres > 0.5) yardSizeId = "2/3";
  if (acres > 0.8) yardSizeId = "1";
  
  return calculate2026Price(planId, yardSizeId);
};

// Yard size options for Plan Builder
export const YARD_SIZES = [
  { id: "1/3", label: "Small", subtitle: "Up to 1/3 acre", acres: 0.33, multiplier: 1.0 },
  { id: "2/3", label: "Medium", subtitle: "1/3 - 2/3 acre", acres: 0.66, multiplier: 1.2 },
  { id: "1", label: "Large", subtitle: "2/3 - 1 acre", acres: 1.0, multiplier: 1.44 }
];

export const getYardMultiplier = (yardSizeId: string): number => {
  const yard = YARD_SIZES.find(y => y.id === yardSizeId);
  return yard?.multiplier ?? 1.0;
};
