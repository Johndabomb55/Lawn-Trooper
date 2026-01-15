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
    price: 169,
    oldPrice: 199,
    priceLabel: "Starts at $169/mo",
    description: "Includes: 1 Basic Add-on - 0 Premium Add-ons",
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
    allowanceLabel: "1 Basic Add-On"
  },
  {
    id: "premium",
    name: "Premium Patrol",
    price: 299,
    oldPrice: 349,
    priceLabel: "Starts at $299/mo",
    description: "Plus weed control & beds. Includes: 2 Basic Add-ons - 1 Premium Add-on",
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
      "Spring & Fall Cleanup<br/><span class='text-xs text-muted-foreground'>Heavy cleanups with overgrown plants, trees, and debris require a premium upgrade to be included.</span>",
      "Off-season Bi-weekly Yard Checks<br/><span class='text-xs text-muted-foreground'>Trash pick up, blow driveway and steps, pick any unwanted winter weeds, pick up sticks and limbs, check for winter damage, etc.</span>",
      "Small Tree & Low-Hanging Branch Trimming: Once per year + debris removed from property",
      "Leaf Service (Fall & Winter): Bi-weekly leaf cleanup - Leaf blowing / Mulching / Removal",
      "Free Customized Wish List Landscaping Plan & Diagram + Itemized Cost Layout",
      "Multiple Trash Cans Cleaning: Not Included (Executive only)"
    ],
    allowance: {
      basic: 2,
      premium: 1
    },
    allowanceLabel: "2 Basic Add-Ons + 1 Premium Add-On",
    promoLabel: "Jan Promo: +1 Free Basic Add-on"
  },
  {
    id: "executive",
    name: "Executive Command",
    price: 399,
    oldPrice: 479,
    priceLabel: "Starts at $399/mo",
    description: "Weekly Main. 6 Weed Apps. Includes: 2 Basic Add-ons - 3 Premium Add-ons",
    keyStats: [
      { label: "Mowing", value: "Weekly" },
      { label: "Weed Control", value: "6 Treatments" },
      { label: "Bush Trimming", value: "3x/Year" },
      { label: "Add-ons", value: "5 Included" }
    ],
    features: [
      "Mowing: Weekly mowing (top priority)<br/><span class='text-xs text-muted-foreground'>Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces</span>",
      "Weed Control: 6 weed treatments per year",
      "Weed Control (Beds): Weed control in all flower beds included",
      "Weed-Free Guarantee: After 12 consecutive months of service, if weeds are present in treated areas, additional weed applications are provided at no charge to help maintain a weed-free yard year-round.",
      `<span class='font-bold text-accent'>Bush Trimming: 3 bush trimmings per year (Unlimited Bushes) + "${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}"</span>`,
      "Spring & Fall Cleanup<br/><span class='text-xs text-muted-foreground'>Heavy cleanups with overgrown plants, trees, and debris require a premium upgrade to be included.</span>",
      "Off-season Bi-weekly Yard Checks<br/><span class='text-xs text-muted-foreground'>Trash pick up, blow driveway and steps, pick any unwanted winter weeds, pick up sticks and limbs, check for winter damage, etc.</span>",
      "Small Tree & Low-Hanging Branch Trimming: Once per year + debris removed from property",
      "Leaf Service (Fall & Winter): Bi-weekly leaf cleanup - Leaf blowing / Mulching / Removal",
      "Free Customized Wish List Landscaping Plan & Diagram + Itemized Cost Layout",
      "<span class='font-bold text-accent'>Multiple Trash Cans: Included with any trash bin cleaning add-on (up to 3 cans)</span>"
    ],
    allowance: {
      basic: 2,
      premium: 3
    },
    allowanceLabel: "2 Basic Add-Ons + 3 Premium Add-Ons",
    promoLabel: "Jan Promo: +1 Free Basic Add-on"
  }
];

export const BASIC_ADDONS = [
  {
    id: "extra_bush_trimming",
    label: "Extra Bush Trimming",
    description: `Additional trimming beyond plan limits. ${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}`
  },
  {
    id: "shrub_fertilization",
    label: "Shrub Fertilization / Diseased Plant Application",
    description: "Targeted nutrient boost and disease control for healthier shrubs."
  },
  {
    id: "irrigation_check",
    label: "Full Irrigation Check/Diagnosis + Seasonal Activation & Winterization",
    description: "System diagnostics and seasonal preparation."
  },
  {
    id: "fire_ant_app",
    label: "Quarterly Fire Ant Applications",
    description: "Quarterly treatments to control fire ant mounds."
  },
  {
    id: "quarterly_trash_bin_cleaning",
    label: "Quarterly Trash Bin Cleaning",
    description: "Cleaning and sanitizing of trash bins once every quarter. Executive Plan: Multiple cans (up to 3) included."
  },
  {
    id: "gutter_cleaning_first_floor",
    label: "Gutter Cleaning (First Floor Only)",
    description: "First-floor / single-story gutters only (no multi-story work)"
  },
  {
    id: "mulch_delivery_install_2yards",
    label: "Mulch Delivery + Installation (Up to 3 Yards)",
    description: "Fresh mulch install + light bed cleanup (Up to 3 Yards)"
  },
  {
    id: "pine_straw_delivery_install_3yards",
    label: "Pine Straw Delivery + Installation (Up to 4 Yards)",
    description: "Fresh pine straw installed neatly in beds (Up to 4 Yards)"
  },
  {
    id: "basic_flower_install",
    label: "Basic Flower Install (Fall Only)",
    description: "Up to 4 flats of flowers (Fall Only). Upgrade to Premium for Spring."
  },
  {
    id: "basic_christmas_lights",
    label: "Basic Christmas Light Package",
    description: "Basic shrub and small tree decorations only. (No roofline lights)."
  },
  {
    id: "extra_weed_control",
    label: "Extra Weed Control + Fire Ant",
    description: "2 extra weed control apps w/ fertilizer & weed killer + 1 fire ant treatment."
  }
];

export const PREMIUM_ADDONS = [
  {
    id: "pest_control",
    label: "Quarterly Pest Control Applications",
    description: "Exterior pest barrier treatments + spray for mosquitos and bugs around perimeter (4x/year)."
  },
  {
    id: "aeration_overseeding",
    label: "Aeration + Overseeding",
    description: "Relieves soil compaction / improves nutrient flow / thickens turf"
  },
  {
    id: "pressure_washing",
    label: "Driveway & Sidewalk Pressure Washing",
    description: "Professional cleaning of driveway and front sidewalks."
  },
  {
    id: "mulch_delivery_install_over2yards",
    label: "Mulch Delivery + Installation (Up to 8 Yards)",
    description: "Fresh mulch install + light bed cleanup. 4 colors avail (Brown Hardwood recommended)."
  },
  {
    id: "pine_straw_delivery_install_over3yards",
    label: "Pine Straw Delivery + Installation (Up to 10 Yards)",
    description: "Fresh pine straw installed neatly in beds (Up to 10 Yards)."
  },
  {
    id: "premium_flower_install",
    label: "Premium Flower Install (Spring or 2 Seasons)",
    description: "Spring flowers (or Spring AND Fall). Up to 5 flats per season."
  },
  {
    id: "bimonthly_trash_bin_cleaning",
    label: "Monthly Trash Bin Cleaning",
    description: "Cleaning and sanitizing of trash bins every month. Executive Plan: Multiple cans (up to 3) included."
  },
  {
    id: "christmas_lights_premium",
    label: "Christmas Light Premium Package",
    description: "First floor roofline lighting + yard decorations."
  }
];

// Helper to get allowance including promo
export const getPlanAllowance = (planId: string, payFull: boolean = false) => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return { basic: 0, premium: 0 };

  let { basic, premium } = plan.allowance;

  // Executive Bonus Rule: Executive + Pay Upfront -> +1 Premium Add-on
  if (planId === "executive" && payFull) {
     premium += 1;
  }
  
  if ((planId === "executive" || planId === "premium") && PROMO_CONFIG.executiveBonusEnabled) {
    const today = new Date();
    const cutoff = new Date(PROMO_CONFIG.cutoffDate);
    if (today < cutoff) {
       // Jan promo logic: +1 Free Basic Add-on
       basic += 1;
    }
  }

  return { basic, premium };
};

// Acre multipliers for pricing: 1/3 acre = 1.0, 2/3 acre = 1.2, 1 acre = 1.44
// For future larger sizes: each additional 1/3 acre multiplies by 1.2
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

// Calculate 2026 AI-Savings price (current promotional price)
export const calculate2026Price = (planId: string, yardSizeId: string): number => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return 0;
  
  const multiplier = getAcreMultiplier(yardSizeId);
  const price = plan.price * multiplier;
  
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
  { id: "1/3", label: "Small", subtitle: "Up to 1/3 acre", acres: 0.33 },
  { id: "2/3", label: "Medium", subtitle: "1/3 - 2/3 acre", acres: 0.66 },
  { id: "1", label: "Large", subtitle: "2/3 - 1 acre", acres: 1.0 }
];
