/**
 * Promotions Configuration
 * 
 * This file defines all available promotions, their stacking rules, and caps.
 * Marketing team can edit this file to add/modify promotions without touching component code.
 * 
 * STACKING RULES:
 * - All promotions can stack up to the defined caps
 * - Max 30% total discount from percentage-based promos
 * - Max 3 free months from term-based promos
 * - If cap is exceeded, reduce the last-applied benefit first
 * 
 * PROMO TYPES:
 * - termFreeMonths: Free months at end of agreement (Early Bird deals)
 * - prepayPercentOff: Discount for paying upfront
 * - segmentPercentOff: Discount for customer segments (renter/veteran/senior)
 * - referralFreeMonth: Free month for referrals (pending until friend commits)
 */

export interface Promotion {
  id: string;
  title: string;
  shortDescription: string;
  type: 'termFreeMonths' | 'prepayPercentOff' | 'segmentPercentOff' | 'referralFreeMonth';
  stackGroup: 'freeMonths' | 'percentOff';
  value: number; // Free months OR percent off (e.g., 3 or 15)
  eligibility: {
    term?: '1-year' | '2-year' | '3-year';
    payUpfront?: boolean;
    segment?: 'renter' | 'veteran' | 'senior';
    hasReferral?: boolean;
  };
  displayOrder: number;
  active: boolean;
}

// Stacking caps
export const PROMO_CAPS = {
  maxPercentOff: 30,
  maxFreeMonths: 6,
};

// Early Bird Promotion Config - time-decaying free months
export const EARLY_BIRD_CONFIG = {
  startDate: "2026-01-25",
  endDate: "2026-04-25",
  monthlyDecay: 1, // Each month that passes removes 1 free month
  maxFreeMonths: 3, // Maximum early bird free months
};

// Calculate remaining early bird free months based on current date
export function getEarlyBirdFreeMonths(currentDate: Date = new Date()): number {
  const start = new Date(EARLY_BIRD_CONFIG.startDate);
  const end = new Date(EARLY_BIRD_CONFIG.endDate);
  
  if (currentDate < start) return EARLY_BIRD_CONFIG.maxFreeMonths;
  if (currentDate >= end) return 0;
  
  const monthsPassed = Math.floor(
    (currentDate.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000)
  );
  
  return Math.max(0, EARLY_BIRD_CONFIG.maxFreeMonths - monthsPassed);
}

// Operation Price Drop - Loyalty Pricing
export const LOYALTY_DISCOUNTS = [
  { year: 1, discount: 5, label: "After Year 1" },
  { year: 2, discount: 10, label: "After Year 2" },
  { year: 3, discount: 15, label: "After Year 3" },
];

// Contract term options with commitment rewards
export const COMMITMENT_TERMS = [
  {
    id: '1-year' as const,
    label: 'Flexible (Month-to-Month)',
    months: 12,
    freeMonths: 1,
    badge: 'Flexible',
  },
  {
    id: '2-year' as const,
    label: 'Popular (2-Year Commitment)',
    months: 24,
    freeMonths: 2,
    badge: 'Popular',
  },
  {
    id: '3-year' as const,
    label: 'Best Value (3-Year Commitment)',
    months: 36,
    freeMonths: 3,
    badge: 'Best Value',
  },
];

// All available promotions
export const PROMOTIONS: Promotion[] = [
  // Commitment-based free months (base rewards)
  {
    id: 'commitment_3year',
    title: '3-Year Commitment',
    shortDescription: '3 free months at end of agreement',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 3,
    eligibility: { term: '3-year' },
    displayOrder: 1,
    active: true,
  },
  {
    id: 'commitment_2year',
    title: '2-Year Commitment',
    shortDescription: '2 free months at end of agreement',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 2,
    eligibility: { term: '2-year' },
    displayOrder: 2,
    active: true,
  },
  {
    id: 'commitment_1year',
    title: '1-Year Commitment',
    shortDescription: '1 free month at end of agreement',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 1,
    eligibility: { term: '1-year' },
    displayOrder: 3,
    active: true,
  },

  // Pay in Full bonus - adds +1 free month
  {
    id: 'pay_full_bonus',
    title: 'Pay in Full Bonus',
    shortDescription: '+1 additional free month',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 1,
    eligibility: { payUpfront: true },
    displayOrder: 4,
    active: true,
  },

  // Segment-based discounts
  {
    id: 'renter_discount',
    title: 'Renter Discount',
    shortDescription: '5% off for renters',
    type: 'segmentPercentOff',
    stackGroup: 'percentOff',
    value: 5,
    eligibility: { segment: 'renter' },
    displayOrder: 5,
    active: true,
  },
  {
    id: 'veteran_discount',
    title: 'Veterans Discount',
    shortDescription: '5% off for veterans',
    type: 'segmentPercentOff',
    stackGroup: 'percentOff',
    value: 5,
    eligibility: { segment: 'veteran' },
    displayOrder: 6,
    active: true,
  },
  {
    id: 'senior_discount',
    title: 'Seniors Discount',
    shortDescription: '5% off for seniors (60+)',
    type: 'segmentPercentOff',
    stackGroup: 'percentOff',
    value: 5,
    eligibility: { segment: 'senior' },
    displayOrder: 7,
    active: true,
  },

  // Referral bonus
  {
    id: 'referral_bonus',
    title: 'Referral Bonus',
    shortDescription: '+1 free month after your friend commits',
    type: 'referralFreeMonth',
    stackGroup: 'freeMonths',
    value: 1,
    eligibility: { hasReferral: true },
    displayOrder: 8,
    active: true,
  },
];

// User selections interface for promotions engine
export interface UserSelections {
  term: '1-year' | '2-year' | '3-year';
  payUpfront: boolean;
  segments: ('renter' | 'veteran' | 'senior')[];
  hasReferral: boolean;
  monthlyTotal: number;
  promoCode?: string;
}

// HOA Promo Codes
export const HOA_PROMO_CODES: Record<string, { discount: number; hoaName: string }> = {
  'HOA2026': { discount: 10, hoaName: 'Partner HOA' },
};

// Validate and get HOA promo code details
export function validatePromoCode(code: string): { valid: boolean; discount: number; hoaName?: string } {
  const upperCode = code.toUpperCase().trim();
  const hoaPromo = HOA_PROMO_CODES[upperCode];
  if (hoaPromo) {
    return { valid: true, discount: hoaPromo.discount, hoaName: hoaPromo.hoaName };
  }
  return { valid: false, discount: 0 };
}

// Result types
export interface PromotionResult {
  eligible: Promotion[];
  applied: Promotion[];
  pending: Promotion[]; // For referral that's not yet confirmed
  savingsBreakdown: {
    promoId: string;
    title: string;
    savings: number;
    freeMonths: number;
    percentOff: number;
  }[];
  capApplied: boolean;
  totalPercentOff: number;
  totalFreeMonths: number;
}

export interface AppliedTotals {
  displayedMonthly: number;
  displayedEffectiveMonthly: number;
  freeMonthsAtEnd: number;
  percentSavings: number;
  annualSavingsEstimate: number;
  monthlyDiscount: number;
  termMonths: number;
}

/**
 * Get applicable promotions based on user selections
 */
export function getApplicablePromotions(
  selections: UserSelections,
  nowDate: Date = new Date()
): PromotionResult {
  const activePromos = PROMOTIONS.filter(p => p.active);
  const eligible: Promotion[] = [];
  const applied: Promotion[] = [];
  const pending: Promotion[] = [];
  const savingsBreakdown: PromotionResult['savingsBreakdown'] = [];

  let totalPercentOff = 0;
  let totalFreeMonths = 0;
  let capApplied = false;

  // Apply Early Bird time-decaying promotion if applicable
  const earlyBirdFreeMonths = getEarlyBirdFreeMonths(nowDate);
  if (earlyBirdFreeMonths > 0) {
    const earlyBirdPromo: Promotion = {
      id: 'early_bird_dynamic',
      title: 'Early Bird Bonus',
      shortDescription: `${earlyBirdFreeMonths} free month${earlyBirdFreeMonths > 1 ? 's' : ''} for signing up early`,
      type: 'termFreeMonths',
      stackGroup: 'freeMonths',
      value: earlyBirdFreeMonths,
      eligibility: {},
      displayOrder: 0,
      active: true,
    };

    eligible.push(earlyBirdPromo);
    applied.push(earlyBirdPromo);
    
    // Apply early bird with cap check
    const newTotal = totalFreeMonths + earlyBirdFreeMonths;
    if (newTotal > PROMO_CAPS.maxFreeMonths) {
      const allowedValue = PROMO_CAPS.maxFreeMonths - totalFreeMonths;
      if (allowedValue > 0) {
        savingsBreakdown.push({
          promoId: earlyBirdPromo.id,
          title: `${earlyBirdPromo.title} (capped)`,
          savings: selections.monthlyTotal * allowedValue,
          freeMonths: allowedValue,
          percentOff: 0,
        });
        totalFreeMonths = PROMO_CAPS.maxFreeMonths;
        capApplied = true;
      }
    } else {
      savingsBreakdown.push({
        promoId: earlyBirdPromo.id,
        title: earlyBirdPromo.title,
        savings: selections.monthlyTotal * earlyBirdFreeMonths,
        freeMonths: earlyBirdFreeMonths,
        percentOff: 0,
      });
      totalFreeMonths = newTotal;
    }
  }

  // Sort by display order for consistent application
  const sortedPromos = [...activePromos].sort((a, b) => a.displayOrder - b.displayOrder);

  for (const promo of sortedPromos) {
    // Check eligibility
    let isEligible = true;
    const { eligibility } = promo;

    if (eligibility.term && eligibility.term !== selections.term) {
      isEligible = false;
    }
    if (eligibility.payUpfront !== undefined && eligibility.payUpfront !== selections.payUpfront) {
      isEligible = false;
    }
    if (eligibility.segment && !selections.segments.includes(eligibility.segment)) {
      isEligible = false;
    }
    if (eligibility.hasReferral && !selections.hasReferral) {
      isEligible = false;
    }

    if (!isEligible) continue;

    eligible.push(promo);

    // Handle referral as pending (not applied until friend commits)
    if (promo.type === 'referralFreeMonth') {
      pending.push(promo);
      savingsBreakdown.push({
        promoId: promo.id,
        title: promo.title,
        savings: 0, // Not calculated until confirmed
        freeMonths: promo.value,
        percentOff: 0,
      });
      continue;
    }

    // Apply the promotion, respecting caps
    if (promo.stackGroup === 'percentOff') {
      const newTotal = totalPercentOff + promo.value;
      if (newTotal > PROMO_CAPS.maxPercentOff) {
        const allowedValue = PROMO_CAPS.maxPercentOff - totalPercentOff;
        if (allowedValue > 0) {
          applied.push(promo);
          const actualSavings = (selections.monthlyTotal * allowedValue) / 100;
          savingsBreakdown.push({
            promoId: promo.id,
            title: `${promo.title} (capped)`,
            savings: actualSavings,
            freeMonths: 0,
            percentOff: allowedValue,
          });
          totalPercentOff = PROMO_CAPS.maxPercentOff;
          capApplied = true;
        }
      } else {
        applied.push(promo);
        const savings = (selections.monthlyTotal * promo.value) / 100;
        savingsBreakdown.push({
          promoId: promo.id,
          title: promo.title,
          savings,
          freeMonths: 0,
          percentOff: promo.value,
        });
        totalPercentOff = newTotal;
      }
    } else if (promo.stackGroup === 'freeMonths') {
      const newTotal = totalFreeMonths + promo.value;
      if (newTotal > PROMO_CAPS.maxFreeMonths) {
        const allowedValue = PROMO_CAPS.maxFreeMonths - totalFreeMonths;
        if (allowedValue > 0) {
          applied.push(promo);
          savingsBreakdown.push({
            promoId: promo.id,
            title: `${promo.title} (capped)`,
            savings: selections.monthlyTotal * allowedValue,
            freeMonths: allowedValue,
            percentOff: 0,
          });
          totalFreeMonths = PROMO_CAPS.maxFreeMonths;
          capApplied = true;
        }
      } else {
        applied.push(promo);
        savingsBreakdown.push({
          promoId: promo.id,
          title: promo.title,
          savings: selections.monthlyTotal * promo.value,
          freeMonths: promo.value,
          percentOff: 0,
        });
        totalFreeMonths = newTotal;
      }
    }
  }

  // Apply HOA promo code if provided and valid
  if (selections.promoCode) {
    const promoResult = validatePromoCode(selections.promoCode);
    if (promoResult.valid && promoResult.discount > 0) {
      const hoaPromo: Promotion = {
        id: 'hoa_promo',
        title: `${promoResult.hoaName} Partner Discount`,
        shortDescription: `${promoResult.discount}% off for HOA partners`,
        type: 'segmentPercentOff',
        stackGroup: 'percentOff',
        value: promoResult.discount,
        eligibility: {},
        displayOrder: 99,
        active: true,
      };

      const newTotal = totalPercentOff + promoResult.discount;
      if (newTotal > PROMO_CAPS.maxPercentOff) {
        const allowedValue = PROMO_CAPS.maxPercentOff - totalPercentOff;
        if (allowedValue > 0) {
          applied.push(hoaPromo);
          savingsBreakdown.push({
            promoId: hoaPromo.id,
            title: `${hoaPromo.title} (capped)`,
            savings: (selections.monthlyTotal * allowedValue) / 100,
            freeMonths: 0,
            percentOff: allowedValue,
          });
          totalPercentOff = PROMO_CAPS.maxPercentOff;
          capApplied = true;
        }
      } else {
        applied.push(hoaPromo);
        savingsBreakdown.push({
          promoId: hoaPromo.id,
          title: hoaPromo.title,
          savings: (selections.monthlyTotal * promoResult.discount) / 100,
          freeMonths: 0,
          percentOff: promoResult.discount,
        });
        totalPercentOff = newTotal;
      }
    }
  }

  return {
    eligible,
    applied,
    pending,
    savingsBreakdown,
    capApplied,
    totalPercentOff,
    totalFreeMonths,
  };
}

/**
 * Apply promotions to base totals and return display values
 */
export function applyPromotions(
  baseTotals: { monthlyTotal: number; term: '1-year' | '2-year' | '3-year' },
  promotionResult: PromotionResult
): AppliedTotals {
  const termMonthsMap: Record<string, number> = { '1-year': 12, '2-year': 24, '3-year': 36 };
  const termMonths = termMonthsMap[baseTotals.term] || 12;
  const { totalPercentOff, totalFreeMonths } = promotionResult;

  // Calculate discounted monthly
  const monthlyDiscount = (baseTotals.monthlyTotal * totalPercentOff) / 100;
  const displayedMonthly = baseTotals.monthlyTotal - monthlyDiscount;

  // Effective monthly considers free months at end
  // Effective = (monthly * (termMonths - freeMonths)) / termMonths
  const paidMonths = termMonths - totalFreeMonths;
  const displayedEffectiveMonthly = (displayedMonthly * paidMonths) / termMonths;

  // Annual savings = discount per month * 12 + free months value
  const annualMonthlySavings = monthlyDiscount * 12;
  const freeMonthsValue = displayedMonthly * totalFreeMonths;
  const annualSavingsEstimate = annualMonthlySavings + (freeMonthsValue / (termMonths / 12));

  return {
    displayedMonthly: Math.round(displayedMonthly),
    displayedEffectiveMonthly: Math.round(displayedEffectiveMonthly),
    freeMonthsAtEnd: totalFreeMonths,
    percentSavings: totalPercentOff,
    annualSavingsEstimate: Math.round(annualSavingsEstimate),
    monthlyDiscount: Math.round(monthlyDiscount),
    termMonths,
  };
}

// Trust messaging constants
export const TRUST_MESSAGES = {
  ctaTop: "No payment required. This is a FREE Dream Yard Recon request.",
  contactStep: "No payment required. We never sell your data. We only use this to contact you to schedule your FREE Dream Yard Recon.",
  confirmation: "Your information is secure. We never sell your data and will only use it to schedule your FREE Dream Yard Recon.",
  commitment: "Commit to us and we commit to you.",
  miguelNote: "We will contact you via your preferred method (call, email, or text) to schedule your FREE Dream Yard Recon. If you don't attach yard photos, we'll send Miguel to scout your property — no commitment needed.",
  referralNudge: "Refer a neighbour — you both get 1 month free after your friend commits.",
};


// Segment options for self-declaration
export const SEGMENT_OPTIONS = [
  { id: 'renter' as const, label: 'I rent my home', description: '5% off for renters' },
  { id: 'veteran' as const, label: 'I am a veteran', description: '5% off for veterans' },
  { id: 'senior' as const, label: 'I am 60 or older', description: '5% off for seniors' },
];

// Recommended add-ons by plan and season
export const RECOMMENDED_ADDONS: Record<string, { basic: string[]; premium: string[] }> = {
  basic: {
    basic: ['irrigation_check', 'fire_ant_app', 'extra_weed_control'],
    premium: [],
  },
  premium: {
    basic: ['irrigation_check', 'mulch_delivery_install_2yards'],
    premium: ['pest_control', 'aeration_overseeding'],
  },
  executive: {
    basic: ['mulch_delivery_install_2yards', 'basic_christmas_lights'],
    premium: ['pressure_washing', 'premium_flower_install', 'christmas_lights_premium'],
  },
};

// Value highlights for plan upsell
export const PLAN_VALUE_HIGHLIGHTS: Record<string, string[]> = {
  premium: [
    'Weekly mowing for pristine curb appeal',
    'Free customized landscaping plan',
    'Off-season yard checks included',
  ],
  executive: [
    '6 weed treatments with Weed-Free Guarantee',
    'Unlimited bush trimmings (3x/year)',
    'Multiple trash can cleaning included',
  ],
};
