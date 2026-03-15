import {
  PLAN_CONFIGS,
  getPlanConfig,
  EXECUTIVE_PLUS_CONFIG,
  type PlanConfigId,
} from "./planConfig";

export const PROMO_CONFIG = {
  executiveBonusEnabled: true,
  cutoffDate: "2026-03-25T23:59:59", // Sale ends March 25th at 11:59 PM (end of day)
  saleLabel: "25-Year Anniversary Client Rewards"
};

export const ANNIVERSARY_ADDON_BONUS = {
  basicNonExecutive: 0,
  executivePremium: 0,
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

export const PRICE_CALCULATION_NOTE =
  "Monthly base price = selected plan rate multiplied by your yard-size tier. Add-ons are flat monthly rates shown in your total before submission.";

export type PlanId = PlanConfigId;

export interface PlanDefinition {
  id: PlanId;
  name: string;
  price: number;
  oldPrice: number;
  priceLabel: string;
  description: string;
  keyStats: Array<{ label: string; value: string }>;
  features: string[];
  allowance: { basic: number; premium: number };
  allowsSwap: boolean;
  allowanceLabel: string;
  promoLabel?: string;
  executiveExtras?: string[];
  swapLabel?: string;
}

// Build PLANS from planConfig (single source of truth for slots/pricing)
function buildPlansFromConfig(): PlanDefinition[] {
  const uiOverrides: Record<string, { oldPrice: number; keyStats: Array<{ label: string; value: string }>; features: string[]; description: string }> = {
    basic: {
      oldPrice: 199,
      keyStats: [
        { label: "Mowing", value: "Bi-Weekly" },
        { label: "Off-Season", value: "Monthly Check" },
        { label: "Credits", value: "3 Total" },
        { label: "Dream Yard", value: "AI Recon" }
      ],
      description: "Includes 3 Basic-only upgrade credits",
      features: [
        "Mowing: Bi-weekly mowing (growing season)<br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
        "Off-Season: Monthly property check",
        "<span class='font-bold text-primary'>Includes 3 Basic-only upgrade credits</span>",
        "<span class='font-bold text-primary'>Shrub Care Package:</span> 1 annual visit with trimming, cleanup, clipping removal, and AI shrub assessment",
        "Dream Yard Recon\u2122: AI-generated landscape plan emailed to you",
        "Flower bed weed control (included)",
        "Turf Applications: Not Included (Premium & Executive)",
        "Standard Support"
      ]
    },
    premium: {
      oldPrice: 349,
      keyStats: [
        { label: "Mowing", value: "Weekly (Growing Season)" },
        { label: "Off-Season", value: "Bi-Weekly" },
        { label: "Credits", value: "5 Total" }
      ],
      description: "Includes 5 total upgrade credits",
      features: [
        "Mowing: Weekly mowing (growing season)<br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
        "Off-Season: Bi-weekly service",
        "Flower bed weed control (included)",
        "<span class='font-bold text-primary'>Includes 5 upgrade credits (Basic = 1, Premium = 2)</span>",
        "<span class='font-bold text-primary'>Shrub Care Package Plus:</span> 2 annual shrub-care visits + No Shrub Left Behind initiative",
        "Service Photo Updates",
        "Priority Support",
        "Dream Yard Recon\u2122 + Personalized Review",
        "<span class='text-xs text-muted-foreground'>2 Basic credits = 1 Premium upgrade</span>"
      ]
    },
    executive: {
      oldPrice: 469,
      keyStats: [
        { label: "Mowing", value: "Weekly (Growing Season)" },
        { label: "Off-Season", value: "Bi-Weekly" },
        { label: "Turf Defense", value: "7 Apps/Year" },
        { label: "Credits", value: "9 Total" }
      ],
      description: "Includes 9 total upgrade credits",
      features: [
        "<span class='font-bold text-accent'>Weekly mowing (growing season) + bi-weekly off-season service</span><br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
        "<span class='font-bold text-accent'>Executive Turf Defense\u2122</span>: Up to 7 turf applications annually",
        "<span class='font-bold text-accent'>Weed-Free Turf Guarantee</span><br/><span class='text-xs text-muted-foreground'>Turf restoration takes time. Results improve progressively based on starting conditions.</span>",
        "Flower bed weed control (included)",
        "<span class='font-bold text-accent'>Includes 9 upgrade credits (Basic = 1, Premium = 2)</span>",
        "<span class='font-bold text-accent'>Executive Shrub Command:</span> 3 annual shrub-care visits with proactive climate-stress monitoring",
        "Service Photo Updates",
        "<span class='font-bold text-accent'>Priority Storm Service</span>",
        "<span class='font-bold text-accent'>Dedicated Account Manager</span>",
        "<span class='text-xs text-muted-foreground'>2 Basic credits = 1 Premium upgrade</span>"
      ]
    }
  };

  return PLAN_CONFIGS.map((c) => {
    const override = uiOverrides[c.id];
    const totalCredits = c.basicSlots + (c.premiumSlots * 2);
    const allowanceLabel = `${totalCredits} upgrade credits (Basic = 1, Premium = 2)`;
    return {
      id: c.id as PlanId,
      name: c.name,
      price: c.basePrice,
      oldPrice: override?.oldPrice ?? c.basePrice,
      priceLabel: `Starts at $${c.basePrice}/mo`,
      description: override?.description ?? `Includes: ${allowanceLabel}`,
      keyStats: override?.keyStats ?? [],
      features: override?.features ?? [],
      allowance: { basic: c.basicSlots, premium: c.premiumSlots },
      allowsSwap: c.allowConversion,
      allowanceLabel,
      swapLabel: c.allowConversion ? "2 Basic credits = 1 Premium upgrade" : undefined,
    };
  });
}

export const PLANS: PlanDefinition[] = buildPlansFromConfig();

export const EXECUTIVE_PLUS = {
  price: EXECUTIVE_PLUS_CONFIG.priceAdd,
  label: "Executive+ Upgrade",
  description: `+$${EXECUTIVE_PLUS_CONFIG.priceAdd}/mo`,
  bonusAllowance: {
    basic: EXECUTIVE_PLUS_CONFIG.basicSlotsAdd,
    premium: EXECUTIVE_PLUS_CONFIG.premiumSlotsAdd,
  },
  perks: [
    "Quarterly Strategy Session",
    "Rapid Response Priority",
    "Enhanced service coverage"
  ]
};

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
  popularity?: "trending" | "favorite";
}

export const SHRUB_CARE_TIERS = {
  basic: {
    title: "Shrub Care Package",
    visitsPerYear: 1,
    summary: "1 annual shrub care mission with trim, cleanup, clipping removal, and AI shrub assessment.",
  },
  premium: {
    title: "Shrub Care Package Plus",
    visitsPerYear: 2,
    summary: "2 annual shrub care missions plus No Shrub Left Behind initiative for stronger shrub survival.",
  },
  executive: {
    title: "Executive Shrub Command",
    visitsPerYear: 3,
    summary: "3 annual shrub care missions with advanced climate-stress monitoring and proactive shrub recovery.",
  },
};

export const ADDON_CATALOG: Addon[] = [
  // --- BASIC ADD-ONS ($20/mo overage) ---
  {
    id: "shrub_hedge_trimming",
    name: "Shrub Care Package (Basic Tier)",
    tier: "basic",
    category: "landscaping",
    price: 20,
    popularity: "trending",
    description: "One annual shrub-care mission that includes shaping trim, cleanup, clipping removal, flower bed refresh, and an AI shrub health assessment to spot stress early."
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
    name: "Seasonal Mulch Refresh",
    tier: "basic",
    category: "landscaping",
    price: 20,
    popularity: "trending",
    description: "Mulch installation for defined garden or bed areas to refresh appearance and support plant health. Mulch included (brown, red, black hardwood or pine bark). Delivery and installation included."
  },
  {
    id: "mid_size_tree_trimming_basic",
    name: "Mid-Size Tree Trimming",
    tier: "basic",
    category: "landscaping",
    price: 20,
    popularity: "favorite",
    description: "Targeted shaping and cleanup for small to mid-size trees to reduce overgrowth and improve long-term structure without heavy-equipment work."
  },
  {
    id: "seasonal_color_flowers",
    name: "Premium Seasonal Color Upgrade (2x/Year Abundant Flowers)",
    tier: "premium",
    category: "seasonal",
    price: 40,
    popularity: "favorite",
    description: "Premium seasonal color upgrade with abundant flower installations twice per year, designed to keep your beds vibrant and give your whole yard a standout, polished vibe."
  },
  {
    id: "quarterly_trash_bin_cleaning",
    name: "Every-Other-Month Trash Can Wash",
    tier: "basic",
    category: "trash",
    price: 20,
    description: "Every-other-month wash service for outdoor trash and recycling bins to reduce odors, grime, and buildup year-round."
  },
  {
    id: "christmas_lights_basic",
    name: "Basic Seasonal Lighting",
    tier: "basic",
    category: "seasonal",
    price: 20,
    description: "Ground-level seasonal lighting focused on shrubs, small trees, and select landscape areas using simple yard pop-up lighting. Final layout to be discussed with the homeowner."
  },
  {
    id: "growing_season_boost",
    name: "Reserve Your Rapid-Response Weekly Cuts (Basic Plan)",
    tier: "basic",
    category: "landscaping",
    price: 20,
    popularity: "favorite",
    description: "Includes 6 weekly mowings you can deploy whenever needed. Reserve your rapid-response weekly cuts, pick the weeks that need tighter coverage, and count on us during wet-month growth spikes."
  },
  {
    id: "extra_weed_control",
    name: "Additional Weed Control & Fertilization",
    tier: "basic",
    category: "landscaping",
    price: 20,
    popularity: "favorite",
    description: "Get your yard weed-free, in shape, and green faster with 3 additional lawn applications—fertilizer, pre-emergent weed prevention, and targeted weed-killer—beyond what's included in your plan."
  },
  {
    id: "mosquito_control",
    name: "Mosquito Control",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Targeted mosquito treatment for common yard harborage areas to help reduce mosquito activity around your property."
  },
  {
    id: "pine_straw_basic",
    name: "Basic Pine Straw Install (Up to 10 Big Bales)",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Pine straw installation for smaller garden beds and landscape areas. Includes up to 10 big bales of quality pine straw, delivery, and professional installation."
  },
  {
    id: "gutter_cleaning",
    name: "Gutter Cleaning",
    tier: "basic",
    category: "cleaning",
    price: 20,
    description: "Thorough cleaning of gutters and downspouts to remove debris and ensure proper drainage. Helps prevent water damage and keeps your home protected."
  },
  {
    id: "one_time_leaf_removal",
    name: "One-Time Leaf Removal",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Single-visit leaf removal service for heavily covered yards. Includes blowing, raking, and hauling away all leaves from your property."
  },
  
  // --- PREMIUM ADD-ONS ($40/mo overage) ---
  {
    id: "weekly_growth_season_mowing",
    name: "Weekly Bagging Service",
    tier: "premium",
    category: "landscaping",
    price: 40,
    popularity: "favorite",
    description: "Premium weekly mowing with grass bagging and removal during peak growth periods. Ideal for rain-heavy weeks when your yard needs tighter cleanup and cleaner curb appeal."
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
    name: "Monthly Trash Can Wash (+ 2nd Can Free)",
    tier: "premium",
    category: "trash",
    price: 40,
    description: "Monthly trash can wash service for ongoing freshness and odor control, with your second can cleaned at no extra charge."
  },
  {
    id: "christmas_lights_premium",
    name: "Premium Seasonal Lighting",
    tier: "premium",
    category: "seasonal",
    price: 40,
    description: "Expanded seasonal lighting designed for holidays, including roofline lighting, enhanced landscape features, and decorative yard elements as appropriate."
  },
  {
    id: "pine_straw_premium",
    name: "Premium Pine Straw Install (Up to 25 Big Bales)",
    tier: "premium",
    category: "landscaping",
    price: 40,
    description: "Expanded pine straw installation for larger properties. Includes up to 25 big bales of premium pine straw, delivery, and professional installation with attention to detail."
  },
  {
    id: "aeration_dethatching",
    name: "Aeration & Dethatching",
    tier: "premium",
    category: "landscaping",
    price: 40,
    description: "Professional lawn aeration and dethatching to improve soil health, water absorption, and root development. Ideal for compacted or stressed lawns that need revitalization."
  },
  {
    id: "tree_trimming",
    name: "Tree Trimming (Small to Medium Trees)",
    tier: "premium",
    category: "landscaping",
    price: 40,
    description: "Professional trimming of small to medium trees to improve shape, remove dead branches, and promote healthy growth. Does not include large tree removal or work requiring heavy equipment."
  },
  {
    id: "full_yard_cleanout",
    name: "Full Yard Cleanout",
    tier: "premium",
    category: "landscaping",
    price: 40,
    description: "Complete yard cleanup including debris removal, bed edging, pruning, and general tidying. Perfect for getting your property back in shape after neglect or seasonal buildup."
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
  description: a.description,
  popularity: a.popularity
}));

export const PREMIUM_ADDONS = ADDON_CATALOG.filter(a => a.tier === 'premium').map(a => ({
  id: a.id,
  label: a.name,
  description: a.description,
  popularity: a.popularity
}));

export const SEASONAL_ADDONS = ADDON_CATALOG.filter(a => a.category === 'seasonal').map(a => ({
  id: a.id,
  label: a.name,
  description: a.description
}));

export const EXECUTIVE_EXTRAS = [
  "Weekly growing-season mowing + bi-weekly off-season service",
  "Executive Turf Defense\u2122 (up to 7 applications annually)",
  "Weed-Free Turf Guarantee",
  "Priority Storm Service",
  "Dedicated Account Manager",
];

export const EXECUTIVE_PERKS = [
  "Weekly growing-season mowing + bi-weekly off-season service",
  "Executive Turf Defense\u2122 — up to 7 turf applications annually",
  "Weed-Free Turf Guarantee (progressive improvement)",
  "Priority storm service",
  "Dedicated Account Manager"
];

// OVERAGE PRICING (LOCKED)
export const OVERAGE_PRICES = {
  basic: 20,  // $20/mo per extra basic add-on
  premium: 40 // $40/mo per extra premium add-on
};

export const PREMIUM_CREDIT_COST = 2;

export const getPlanCredits = (
  planId: string,
  executivePlus: boolean = false,
): number => {
  const allowance = getPlanAllowance(planId, 0, false, new Date(), executivePlus);
  return allowance.basic + (allowance.premium * PREMIUM_CREDIT_COST);
};

export const calculateUsedCredits = (
  selectedBasic: number,
  selectedPremium: number,
): number => {
  return selectedBasic + (selectedPremium * PREMIUM_CREDIT_COST);
};

export const calculateCreditOverage = (
  usedCredits: number,
  includedCredits: number,
  overagePrices: { basic: number; premium: number } = OVERAGE_PRICES,
): { extraCredits: number; totalOverage: number } => {
  const extraCredits = Math.max(0, usedCredits - includedCredits);
  const perCreditRate = Math.min(overagePrices.basic, Math.round(overagePrices.premium / PREMIUM_CREDIT_COST));
  return {
    extraCredits,
    totalOverage: extraCredits * perCreditRate,
  };
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
// swapCount: each swap converts 2 Basic slots into 1 Premium slot.
// Available on plans that have allowConversion: true.
// executivePlus: adds +1 Basic, +1 Premium (Executive plan only).
export const getPlanAllowance = (
  planId: string, 
  swapCount: number = 0,
  payFull: boolean = false,
  asOf: Date = new Date(),
  executivePlus: boolean = false
): { basic: number; premium: number } => {
  const config = getPlanConfig(planId);
  if (!config) return { basic: 0, premium: 0 };

  let basic = config.basicSlots;
  let premium = config.premiumSlots;

  if (executivePlus && config.executivePlusEligible) {
    basic += EXECUTIVE_PLUS_CONFIG.basicSlotsAdd;
    premium += EXECUTIVE_PLUS_CONFIG.premiumSlotsAdd;
  }

  // Apply swap on any plan with allowConversion (2 Basic → 1 Premium)
  if (config.allowConversion && swapCount > 0) {
    const maxSwaps = Math.floor(basic / 2);
    const validSwap = Math.min(swapCount, maxSwaps);
    basic -= validSwap * 2;
    premium += validSwap;
  }

  return { basic, premium };
};

export const getPlanAllowanceLabel = (
  planId: string,
  swapCount: number = 0,
  payFull: boolean = false,
  asOf: Date = new Date(),
  executivePlus: boolean = false
): string => {
  const allowance = getPlanAllowance(planId, swapCount, payFull, asOf, executivePlus);
  if (allowance.premium === 0) {
    return `${allowance.basic} Basic Upgrade${allowance.basic === 1 ? "" : "s"}`;
  }
  return `${allowance.basic} Basic Upgrade${allowance.basic === 1 ? "" : "s"} + ${allowance.premium} Premium Upgrade${allowance.premium === 1 ? "" : "s"}`;
};

// Get swap options for plans that support conversion (2 Basic → 1 Premium).
export const getSwapOptions = (planId: string, asOf: Date = new Date(), executivePlus: boolean = false) => {
  const config = getPlanConfig(planId);
  const baseAllowance = getPlanAllowance(planId, 0, false, asOf, executivePlus);
  if (!config?.allowConversion) {
    return [
      {
        value: 0,
        label: `No swap (${baseAllowance.basic} Basic + ${baseAllowance.premium} Premium)`,
        compactLabel: `${baseAllowance.basic}B + ${baseAllowance.premium}P`,
      },
    ];
  }
  const maxSwaps = Math.floor(baseAllowance.basic / 2);
  const options: Array<{ value: number; label: string; compactLabel: string }> = [];

  for (let swapCount = 0; swapCount <= maxSwaps; swapCount += 1) {
    const swappedAllowance = getPlanAllowance(planId, swapCount, false, asOf, executivePlus);
    if (swapCount === 0) {
      options.push({
        value: 0,
        label: `No swap (${swappedAllowance.basic} Basic + ${swappedAllowance.premium} Premium)`,
        compactLabel: `${swappedAllowance.basic}B + ${swappedAllowance.premium}P`,
      });
    } else {
      options.push({
        value: swapCount,
        label: `Convert ${swapCount * 2} Basic → ${swapCount} Premium (${swappedAllowance.basic}B + ${swappedAllowance.premium}P)`,
        compactLabel: `${swappedAllowance.basic}B + ${swappedAllowance.premium}P`,
      });
    }
  }

  return options;
};

// Legacy alias
export const getExecutiveSwapOptions = (asOf: Date = new Date()) => getSwapOptions("executive", asOf);

export const SWAP_OPTIONS = [
  { value: 0, label: "No swap" },
  { value: 1, label: "Trade 2 Basic → 1 Premium" }
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

// Get base price for a plan from planConfig (single source of truth)
export const getPlanBasePrice = (planId: string): number => {
  const config = getPlanConfig(planId);
  return config?.basePrice ?? 169;
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
