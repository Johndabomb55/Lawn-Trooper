export const PROMO_CONFIG = {
  executiveBonusEnabled: true,
  cutoffDate: "2026-01-01",
};

export const GLOBAL_CONSTANTS = {
  YARD_ELIGIBILITY: "These neighborhood plan prices are for yards UNDER 1 acre. For country properties or yards OVER 1 acre: request a custom estimate (send pictures) and we will provide a detailed custom quote.",
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
    description: "Weekly mowing & edging. 2 Basic add-ons.",
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
    description: "Plus weed control & beds. 2 Basic + 3 Premium Add-ons.",
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
    description: "Weekly Main. 6 Weed Apps. 1 Basic + 5 Premium Add-ons.",
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
    id: "extra_weed_treatments",
    label: "Extra Weed Treatments",
    description: "Adds 2 additional weed applications"
  },
  {
    id: "quarterly_trash_can_cleaning",
    label: "Quarterly Trash Can Cleaning",
    description: "Quarterly trash can cleaning"
  },
  {
    id: "small_tree_trimming_annual",
    label: "Small Tree & Low-Hanging Branch Trimming (Annual)",
    description: "Once per year + debris removed from property"
  },
  {
    id: "christmas_lights_basic",
    label: "Christmas Lights – Basic Package",
    description: "Install / maintenance / removal (simple, clean holiday lighting)"
  }
];

export const PREMIUM_ADDONS = [
  {
    id: "bi_monthly_trash_can_cleaning",
    label: "Every-Other-Month Trash Can Cleaning",
    description: "Every-other-month trash can cleaning"
  },
  {
    id: "mulch_install",
    label: "Mulch Installation",
    description: "Fresh mulch install + light bed cleanup"
  },
  {
    id: "pine_straw_install",
    label: "Pine Straw Installation",
    description: "Fresh pine straw installed neatly in beds"
  },
  {
    id: "driveway_pressure_washing",
    label: "Driveway Pressure Washing",
    description: "Professional pressure washing for driveways (and similar flat hard surfaces if applicable)"
  },
  {
    id: "aeration",
    label: "Aeration",
    description: "Relieves soil compaction / improves nutrient flow"
  },
  {
    id: "overseeding",
    label: "Overseeding",
    description: "Thickens turf / best paired with aeration"
  },
  {
    id: "extra_bush_trimming",
    label: "Extra Bush Trimming",
    description: `Additional trimming beyond plan limits. ${GLOBAL_CONSTANTS.BUSH_TRIMMING_DISPOSAL}`
  },
  {
    id: "hedge_shaping",
    label: "Hedge Shaping",
    description: "Precision shaping for formal hedges"
  },
  {
    id: "flower_bed_cleanup",
    label: "Flower Bed Cleanup",
    description: "Weed removal / edging / debris clearing"
  },
  {
    id: "leaf_bagging_haul_off",
    label: "Leaf Bagging & Haul-Off",
    description: "Removal of collected leaves from the property"
  },
  {
    id: "property_cleanup",
    label: "Property Cleanup",
    description: "Removal of sticks, debris, and storm material"
  },
  {
    id: "gutter_cleaning",
    label: "Gutter Cleaning (First Floor Only)",
    description: "First-floor / single-story gutters only (no multi-story work)"
  },
  {
    id: "christmas_lights_premium",
    label: "Christmas Lights – Premium Package",
    description: "Larger or more detailed lighting layouts. Install / maintenance / removal"
  }
];

// Helper to get allowance including promo
export const getPlanAllowance = (planId: string) => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return { basic: 0, premium: 0 };

  let { basic, premium } = plan.allowance;

  // Executive Promo Logic
  if (planId === "executive" && PROMO_CONFIG.executiveBonusEnabled) {
    const today = new Date();
    const cutoff = new Date(PROMO_CONFIG.cutoffDate);
    if (today < cutoff) {
      premium += 1;
    }
  }

  return { basic, premium };
};
