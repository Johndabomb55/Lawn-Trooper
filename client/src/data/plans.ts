export const PROMO_CONFIG = {
  executiveBonusEnabled: true,
  cutoffDate: "2026-03-25T23:59:59", // Sale ends March 25th at 11:59 PM (end of day)
  saleLabel: "25th Anniversary Sale — Ends March 25th"
};

// Anniversary add-on bonus (limited-time event through cutoffDate):
// - Basic and Premium: +1 included Basic add-on
// - Executive: +1 included Premium add-on
export const ANNIVERSARY_ADDON_BONUS = {
  basicNonExecutive: 1,
  executivePremium: 1,
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

export type PlanId = "basic" | "premium" | "executive";

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

export const PLANS: PlanDefinition[] = [
  {
    id: "basic",
    name: "Basic Patrol",
    price: 169,
    oldPrice: 199,
    priceLabel: "Starts at $169/mo",
    description: "Includes: 2 Basic Upgrades",
    keyStats: [
      { label: "Mowing", value: "Bi-Weekly" },
      { label: "Off-Season", value: "Monthly Check" },
      { label: "Upgrades", value: "2 Basic" },
      { label: "Dream Yard", value: "AI Recon" }
    ],
    features: [
      "Mowing: Bi-weekly mowing (growing season)<br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
      "Off-Season: Monthly property check",
      "<span class='font-bold text-primary'>2 Basic Upgrades included</span>",
      "Dream Yard Recon\u2122: AI-generated landscape plan emailed to you",
      "<span class='text-xs text-muted-foreground'>Upgrade option: Convert 2 Basic Upgrades \u2192 1 Premium Upgrade</span>",
      "Turf Applications: Not Included (Premium & Executive)",
      "Bed Weed Control: Not Included (Premium & Executive)",
      "Account Manager: Not Included (Premium & Executive)",
      "Landscape Allowance\u2122: Not Included (Premium & Executive)"
    ],
    allowance: {
      basic: 2,
      premium: 0
    },
    allowsSwap: true,
    allowanceLabel: "2 Basic Upgrades",
    swapLabel: "Convert 2 Basic \u2192 1 Premium"
  },
  {
    id: "premium",
    name: "Premium Patrol",
    price: 299,
    oldPrice: 349,
    priceLabel: "Starts at $299/mo",
    description: "Includes: 3 Basic + 1 Premium Upgrades",
    keyStats: [
      { label: "Mowing", value: "Weekly" },
      { label: "Off-Season", value: "Bi-Weekly" },
      { label: "Upgrades", value: "3B + 1P" },
      { label: "Allowance", value: "Seasonal" }
    ],
    features: [
      "Mowing: Weekly mowing (growing season)<br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
      "Off-Season: Bi-weekly service",
      "Monthly Bed Weed Control",
      "<span class='font-bold text-primary'>3 Basic + 1 Premium Upgrades included</span>",
      "Service Photo Updates",
      "Account Manager Access (remote + visit request)",
      "Dream Yard Recon\u2122 + Personalized Review",
      "<span class='font-bold text-primary'>Seasonal Landscape Refresh Allowance\u2122</span><br/><span class='text-xs text-muted-foreground'>Includes Seasonal Landscape Refresh Allowance\u2122 usable toward mulch, pine straw, or seasonal bed refresh.</span>",
      "<span class='text-xs text-muted-foreground'>Upgrade option: Convert 2 Basic Upgrades \u2192 1 Premium Upgrade</span>"
    ],
    allowance: {
      basic: 3,
      premium: 1
    },
    allowsSwap: true,
    allowanceLabel: "3 Basic + 1 Premium Upgrades",
    swapLabel: "Convert 2 Basic \u2192 1 Premium"
  },
  {
    id: "executive",
    name: "Executive Command",
    price: 399,
    oldPrice: 469,
    priceLabel: "Starts at $399/mo",
    description: "Includes: 3 Basic + 3 Premium Upgrades",
    keyStats: [
      { label: "Service", value: "Year-Round Weekly" },
      { label: "Turf Defense", value: "7 Apps/Year" },
      { label: "Upgrades", value: "3B + 3P" },
      { label: "Allowance", value: "Premier" }
    ],
    features: [
      "<span class='font-bold text-accent'>Year-Round Weekly Property Monitoring</span><br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
      "<span class='font-bold text-accent'>Executive Turf Defense\u2122</span>: Up to 7 turf applications annually",
      "<span class='font-bold text-accent'>Weed-Free Turf Guarantee</span><br/><span class='text-xs text-muted-foreground'>Turf restoration takes time. Results improve progressively based on starting conditions.</span>",
      "Monthly Bed Weed Control",
      "<span class='font-bold text-accent'>3 Basic + 3 Premium Upgrades included</span>",
      "Service Photo Updates",
      "<span class='font-bold text-accent'>Priority Storm Service</span>",
      "<span class='font-bold text-accent'>Dedicated Account Manager</span>",
      "<span class='font-bold text-accent'>Premier Landscape Allowance\u2122</span><br/><span class='text-xs text-muted-foreground'>Includes Premier Landscape Allowance\u2122 usable toward mulch, pine straw, or property enhancements.</span>",
      "<span class='text-xs text-muted-foreground'>Upgrade option: Convert 2 Basic Upgrades \u2192 1 Premium Upgrade</span>"
    ],
    allowance: {
      basic: 3,
      premium: 3
    },
    allowsSwap: true,
    allowanceLabel: "3 Basic + 3 Premium Upgrades",
    swapLabel: "Convert 2 Basic \u2192 1 Premium"
  }
];

export const EXECUTIVE_PLUS = {
  price: 99,
  label: "Executive+ Upgrade",
  description: "+$99/mo",
  bonusAllowance: { basic: 1, premium: 1 },
  perks: [
    "Quarterly Strategy Session",
    "Rapid Response Priority",
    "Expanded Landscape Allowance\u2122 tier"
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
}

export const ADDON_CATALOG: Addon[] = [
  // --- BASIC ADD-ONS ($20/mo overage) ---
  {
    id: "shrub_hedge_trimming",
    name: "Shrub / Hedge Trimming",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "One-time trimming service for up to 20 small to medium bushes or hedges. Includes shaping to maintain appearance and proper disposal of all clippings."
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
  {
    id: "growing_season_boost",
    name: "Wet-Month Weekly Mow Boost (Basic Plan)",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Best for Basic Patrol homes during heavy-growth months: includes 6 extra weekly cuts per season. Must be booked at least 1 week in advance."
  },
  {
    id: "extra_weed_control",
    name: "Additional Weed Control & Fertilization",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Get your yard weed-free, in shape, and green faster with 3 additional lawn applications—fertilizer, pre-emergent weed prevention, and targeted weed-killer—beyond what's included in your plan."
  },
  {
    id: "pine_straw_basic",
    name: "Basic Pine Straw Install (Up to 10 Bales)",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Pine straw installation for smaller garden beds and landscape areas. Includes up to 10 bales of quality pine straw, delivery, and professional installation."
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
    id: "flower_bed_maintenance",
    name: "Flower Bed Maintenance",
    tier: "basic",
    category: "landscaping",
    price: 20,
    description: "Seasonal flower bed care including weeding, edging, and light pruning to keep your beds looking neat and healthy throughout the year."
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
  },
  {
    id: "pine_straw_premium",
    name: "Premium Pine Straw Install (Up to 25 Bales)",
    tier: "premium",
    category: "landscaping",
    price: 40,
    description: "Expanded pine straw installation for larger properties. Includes up to 25 bales of premium pine straw, delivery, and professional installation with attention to detail."
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

export const EXECUTIVE_EXTRAS = [
  "Year-Round Weekly Property Monitoring",
  "Executive Turf Defense\u2122 (up to 7 applications annually)",
  "Weed-Free Turf Guarantee",
  "Priority Storm Service",
  "Dedicated Account Manager",
  "Premier Landscape Allowance\u2122"
];

export const EXECUTIVE_PERKS = [
  "Year-round weekly property monitoring",
  "Executive Turf Defense\u2122 — up to 7 turf applications annually",
  "Weed-Free Turf Guarantee (progressive improvement)",
  "Priority storm service",
  "Dedicated Account Manager",
  "Premier Landscape Allowance\u2122"
];

// OVERAGE PRICING (LOCKED)
export const OVERAGE_PRICES = {
  basic: 20,  // $20/mo per extra basic add-on
  premium: 40 // $40/mo per extra premium add-on
};

export const isAnniversaryPricingEventActive = (asOf: Date = new Date()): boolean => {
  return asOf <= new Date(PROMO_CONFIG.cutoffDate);
};

const getAnniversaryBonusForPlan = (planId: string, asOf: Date = new Date()): { basic: number; premium: number } => {
  if (!isAnniversaryPricingEventActive(asOf)) {
    return { basic: 0, premium: 0 };
  }

  return {
    basic: planId === "executive" ? 0 : ANNIVERSARY_ADDON_BONUS.basicNonExecutive,
    premium: planId === "executive" ? ANNIVERSARY_ADDON_BONUS.executivePremium : 0,
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
// Available on ALL plans that have allowsSwap: true.
// executivePlus: adds +1 Basic, +1 Premium (Executive plan only).
export const getPlanAllowance = (
  planId: string, 
  swapCount: number = 0,
  payFull: boolean = false,
  asOf: Date = new Date(),
  executivePlus: boolean = false
): { basic: number; premium: number } => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return { basic: 0, premium: 0 };

  let { basic, premium } = plan.allowance;
  const anniversaryBonus = getAnniversaryBonusForPlan(planId, asOf);

  basic += anniversaryBonus.basic;
  premium += anniversaryBonus.premium;

  if (executivePlus && planId === "executive") {
    basic += EXECUTIVE_PLUS.bonusAllowance.basic;
    premium += EXECUTIVE_PLUS.bonusAllowance.premium;
  }

  // Apply swap on any plan with allowsSwap (2 Basic → 1 Premium)
  if (plan.allowsSwap && swapCount > 0) {
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
  return `${allowance.basic} Basic Upgrade${allowance.basic === 1 ? "" : "s"} + ${allowance.premium} Premium Upgrade${allowance.premium === 1 ? "" : "s"}`;
};

// Get swap options for ANY plan (2 Basic → 1 Premium conversion)
export const getSwapOptions = (planId: string, asOf: Date = new Date(), executivePlus: boolean = false) => {
  const baseAllowance = getPlanAllowance(planId, 0, false, asOf, executivePlus);
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
  { value: 1, label: "Convert 2 Basic → 1 Premium" }
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
