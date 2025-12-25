export const PROMO_CONFIG = {
  executiveBonusEnabled: true,
  cutoffDate: "2026-01-01T23:59:59", // Sale ends Jan 1st at 11:59 PM (end of day)
  saleLabel: "Anniversary Sale Ends January 1st"
};

export const GLOBAL_CONSTANTS = {
  YARD_ELIGIBILITY: "Anniversary Sale pricing applies to typical neighborhood yards. Larger or more complex lots may require price adjustment.",
  BUSH_TRIMMING_DISPOSAL: "All clippings removed and disposed for clean curb appeal and pristine flower beds.",
  AI_SAVINGS_MESSAGE: "We are lowering costs with new AI + 2026 technology and passing savings on to customers.",
  COMMITMENT_MESSAGE: "If you commit to us, we commit to you.",
  EXISTING_CUSTOMER_LOYALTY: "Existing customers: Happy Holidays — log in, select your 2026 plan, and apply your loyalty discount.",
  CONSULTATION_REFUND_POLICY: "After the first month is paid, schedule a consultation + walkthrough (virtual or in-person). At the time of the consultation, if the customer decides it’s not the right fit, provide a full refund.",
};

export const PLANS = [
  {
    id: "basic",
    name: "Basic Patrol",
    price: 129,
    oldPrice: 169,
    priceLabel: "Starts at $129/mo",
    description: "Includes: 1 Basic Add-on • 0 Premium Add-ons",
    features: [
      "Mowing: Regular (bi-weekly) mowing",
      "Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces",
      "Weed Control: 2 pre-emergent weed control treatments per year",
      `Bush Trimming: 2 bush trimmings per year + “${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}”`,
      "Leaf Service (Fall & Winter): Monthly leaf cleanup — Leaf blowing / Mulching / Removal",
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
    price: 199,
    oldPrice: 279,
    priceLabel: "Starts at $199/mo",
    description: "Plus weed control & beds. Includes: 2 Basic Add-ons • 1 Premium Add-on",
    features: [
      "Mowing: Weekly mowing",
      "Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces",
      "Weed Control: 4 weed treatments per year",
      `Bush Trimming: 3 bush trimmings per year + “${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}”`,
      "Leaf Service (Fall & Winter): Bi-weekly leaf cleanup — Leaf blowing / Mulching / Removal",
      "Small Tree & Low-Hanging Branch Trimming: Once per year + debris removed from property",
    ],
    allowance: {
      basic: 2,
      premium: 1
    },
    allowanceLabel: "2 Basic Add-Ons + 1 Premium Add-On"
  },
  {
    id: "executive",
    name: "Executive Patrol",
    price: 299,
    oldPrice: 399,
    priceLabel: "Starts at $299/mo",
    description: "Weekly Main. 6 Weed Apps. Includes: 2 Basic Add-ons • 3 Premium Add-ons",
    features: [
      "Mowing: Weekly mowing (top priority)",
      "Every visit: Precision edging / Detailed trimming / Blowing of all turf & hard surfaces",
      "Weed Control: 6 weed treatments per year",
      `Bush Trimming: 4 bush trimmings per year (scheduled by plant type and growth cycle) + “${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}”`,
      "Leaf Service (Fall & Winter): Bi-weekly leaf cleanup — Leaf blowing / Mulching / Removal",
      "Small Tree & Low-Hanging Branch Trimming: Once per year + debris removed from property",
      "Weed-Free Guarantee: After 12 consecutive months of service, if weeds are present in treated areas, additional weed applications are provided at no charge to help maintain a weed-free yard year-round.",
    ],
    allowance: {
      basic: 2,
      premium: 3
    },
    allowanceLabel: "2 Basic Add-Ons + 3 Premium Add-Ons",
    promoLabel: "Jan Promo: +1 Free Premium Add-on" // Logic handled via config but label kept here or derived
  }
];

export const BASIC_ADDONS = [
  {
    id: "extra_bush_trimming",
    label: "Extra Bush Trimming",
    description: `Additional trimming beyond plan limits. ${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}`
  },
  {
    id: "gutter_cleaning_box",
    label: "Gutter Cleaning Box",
    description: "Cleaning of gutter boxes"
  },
  {
    id: "gutter_cleaning_first_floor",
    label: "Gutter Cleaning (First Floor Only)",
    description: "First-floor / single-story gutters only (no multi-story work)"
  },
  {
    id: "mulch_delivery_install_2yards",
    label: "Mulch Delivery + Installation (Up to 2 Yards)",
    description: "Fresh mulch install + light bed cleanup (Up to 2 Yards)"
  },
  {
    id: "pine_straw_delivery_install_3yards",
    label: "Pine Straw Delivery + Installation (Up to 3 Yards)",
    description: "Fresh pine straw installed neatly in beds (Up to 3 Yards)"
  }
];

export const PREMIUM_ADDONS = [
  {
    id: "aeration_overseeding",
    label: "Aeration + Overseeding",
    description: "Relieves soil compaction / improves nutrient flow / thickens turf"
  },
  {
    id: "spring_cleanup",
    label: "Spring Cleanup",
    description: "Removal of winter debris and preparation for the growing season"
  },
  {
    id: "fall_cleanup",
    label: "Fall Cleanup",
    description: "Removal of fall leaves and debris to prepare for winter"
  },
  {
    id: "mulch_delivery_install_over2yards",
    label: "Mulch Delivery + Installation (Over 2 Yards)",
    description: "Fresh mulch install + light bed cleanup (Over 2 Yards)"
  },
  {
    id: "pine_straw_delivery_install_over3yards",
    label: "Pine Straw Delivery + Installation (Over 3 Yards)",
    description: "Fresh pine straw installed neatly in beds (Over 3 Yards)"
  },
  {
    id: "christmas_lights_premium",
    label: "Christmas Light Premium Package",
    description: "Larger or more detailed lighting layouts. Install / maintenance / removal"
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
  
  // Also keep the existing promo logic if valid, or remove if superceded?
  // User prompt said "If Executive Patrol + pay full term upfront → allow ONE additional Premium add-on."
  // It didn't explicitly say remove the Jan Promo, but typically these might conflict.
  // Assuming they stack or the Jan Promo is separate.
  // Let's keep Jan Promo for now unless it conflicts.
  // Actually, let's just stick to the requested rule for simplicity and correctness per recent prompt.
  // Prompt 8) EXECUTIVE BONUS RULE: If Executive Patrol + pay full term upfront → allow ONE additional Premium add-on.
  
  if (planId === "executive" && PROMO_CONFIG.executiveBonusEnabled) {
    const today = new Date();
    const cutoff = new Date(PROMO_CONFIG.cutoffDate);
    if (today < cutoff) {
       // Jan promo logic from before: +1 Free Premium Add-on
       // If both apply, does user get +2? Let's assume yes as they are distinct reasons (Promo vs Payment Term)
       premium += 1;
    }
  }

  return { basic, premium };
};

export const calculatePlanPrice = (planId: string, acres: number) => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return 0;
  
  // Base price covers up to 1/3 acre (0.33)
  const baseAcres = 0.33;
  
  if (acres <= baseAcres) {
    return plan.price;
  }
  
  // +25% per additional 1/3 acre
  // Calculate how many additional 1/3 acre chunks (rounded up?)
  // "Internal rule (never shown): +25% per additional 1/3 acre."
  // Typically means chunks.
  // Example: 0.5 acres. 
  // 0.5 - 0.33 = 0.17 surplus.
  // 0.17 / 0.33 = ~0.5 chunks. 
  // If we round up, that's 1 chunk.
  
  const additionalAcres = acres - baseAcres;
  const chunks = Math.ceil(additionalAcres / 0.33);
  
  const multiplier = 1 + (chunks * 0.25);
  
  return plan.price * multiplier;
};
