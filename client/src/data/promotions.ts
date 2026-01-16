/**
 * Promotions Configuration
 * 
 * This file defines all available promotions, their stacking rules, and caps.
 * Marketing team can edit this file to add/modify promotions without touching component code.
 * 
 * COMMITMENT MODEL (January 2026):
 * 3 commitment options:
 * - Month-to-Month: +15% premium, no free months, cancel anytime
 * - 1-Year Subscription: 12 months, can pay monthly or pay in full
 * - 2-Year Subscription (Price Lock): 24 months, can pay monthly or pay in full
 * 
 * FREE MONTH RULES:
 * 1) 25th Anniversary Early Bird Bonus (limited time):
 *    - +1 free month
 *    - Enroll by Jan 25, first payment by Feb 1
 * 2) Commitment Bonus (always available):
 *    - 1-Year: +1 free month
 *    - 2-Year: +2 free months
 * 3) Pay-in-Full Accelerator (optional):
 *    - Doubles ALL earned free months (Early Bird + Commitment)
 *    - No cap on stacking
 * 
 * EXAMPLES:
 * - 1-Year (monthly): 1 + 1 = 2 free months
 * - 1-Year + PIF: (1 + 1) × 2 = 4 free months
 * - 2-Year (monthly): 2 + 1 = 3 free months
 * - 2-Year + PIF: (2 + 1) × 2 = 6 free months
 * 
 * BILLING:
 * - termMonths = 12 or 24
 * - billedMonths = termMonths - freeMonths
 * - effectiveMonthly = (monthlySubscription × billedMonths) / termMonths
 * - Free months are skipped billing at END of agreement
 */

export interface Promotion {
  id: string;
  title: string;
  shortDescription: string;
  type: 'termFreeMonths' | 'prepayPercentOff' | 'segmentPercentOff' | 'referralFreeMonth';
  stackGroup: 'freeMonths' | 'percentOff';
  value: number;
  eligibility: {
    term?: 'month-to-month' | '1-year' | '2-year';
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
  maxFreeMonths: 6,  // Max: 2-Year (2) + Early Bird (1) = 3 × 2 (PIF) = 6
};

// Month-to-month premium (15% over 2-year base rate)
export const MONTH_TO_MONTH_PREMIUM = 0.15;

// 25th Anniversary Early Bird Bonus dates
export const EARLY_BIRD_BONUS = {
  enrollByDate: new Date('2026-01-25T23:59:59'),  // Must enroll by Jan 25
  firstPaymentByDate: new Date('2026-02-01T23:59:59'),  // First payment by Feb 1
  bonusMonths: 1,  // +1 free month
};

/**
 * Get Early Bird bonus status
 * - Enroll by Jan 25, pay by Feb 1: +1 free month
 * - After Jan 25: Offer expired
 * 
 * NOTE: This bonus IS doubled by Pay-in-Full Accelerator
 */
export function getEarlyBirdBonus(): { months: number; isActive: boolean; enrollBy: string; payBy: string } {
  const now = new Date();
  const isActive = now < EARLY_BIRD_BONUS.enrollByDate;
  
  return {
    months: isActive ? EARLY_BIRD_BONUS.bonusMonths : 0,
    isActive,
    enrollBy: 'Jan 25',
    payBy: 'Feb 1',
  };
}

// Check if Early Bird offer is active
export const isEarlyBird = (): boolean => {
  return getEarlyBirdBonus().isActive;
};

// Operation Price Drop - Loyalty Pricing
export const LOYALTY_DISCOUNTS = [
  { year: 1, discount: 5, label: "After Year 1" },
  { year: 2, discount: 10, label: "After Year 2" },
  { year: 3, discount: 15, label: "After Year 3" },
];

// Contract term options - 3 options
export const COMMITMENT_TERMS = [
  {
    id: 'month-to-month' as const,
    label: 'Month-to-Month',
    months: 1,
    freeMonths: 0,
    badge: 'Flexible',
    description: 'Month-to-month plans do not include free months because we reward long-term commitment.',
    shortDescription: 'Cancel anytime with 30 days notice',
    hasPremium: true,
    allowsPayInFull: false,
  },
  {
    id: '1-year' as const,
    label: '1-Year Subscription',
    months: 12,
    freeMonths: 1,  // Commitment Bonus
    badge: 'Save More',
    description: 'Commit to one year and earn +1 free month. Pay monthly or pay in full — your choice.',
    shortDescription: '+1 free month (Commitment Bonus)',
    hasPremium: false,
    allowsPayInFull: true,
  },
  {
    id: '2-year' as const,
    label: '2-Year Subscription (Price Lock)',
    months: 24,
    freeMonths: 2,  // Commitment Bonus
    badge: 'Best Value',
    description: 'Lock in your rate for 2 years and earn +2 free months. Pay monthly or pay in full — your choice.',
    shortDescription: '+2 free months (Commitment Bonus)',
    hasPremium: false,
    allowsPayInFull: true,
  },
];

/**
 * Calculate free service months for term commitments
 * 
 * Earned free months = Early Bird Bonus + Commitment Bonus
 * Pay-in-Full Accelerator: Doubles ALL earned free months
 * 
 * Examples:
 * - 1-Year (monthly): 1 + 1 = 2 free months
 * - 1-Year + PIF: (1 + 1) × 2 = 4 free months
 * - 2-Year (monthly): 2 + 1 = 3 free months
 * - 2-Year + PIF: (2 + 1) × 2 = 6 free months
 */
export function calculateTermFreeMonths(term: 'month-to-month' | '1-year' | '2-year', payInFull: boolean): number {
  if (term === 'month-to-month') return 0;
  
  // Commitment Bonus: 1 for 1-year, 2 for 2-year
  const commitmentBonus = term === '1-year' ? 1 : 2;
  
  // 25th Anniversary Early Bird Bonus: +1 if active
  const earlyBirdBonus = getEarlyBirdBonus().months;
  
  // Total earned free months BEFORE accelerator
  const earnedFreeMonths = commitmentBonus + earlyBirdBonus;
  
  // Pay-in-Full Accelerator: doubles ALL earned free months
  const totalFreeMonths = payInFull ? earnedFreeMonths * 2 : earnedFreeMonths;
  
  return totalFreeMonths;
}

// Legacy alias for backward compatibility
export function calculate2YearFreeMonths(payInFull: boolean): number {
  return calculateTermFreeMonths('2-year', payInFull);
}

/**
 * Get itemized breakdown of free months
 * Useful for displaying in UI
 * 
 * Returns:
 * - earlyBirdBonus: 25th Anniversary Early Bird Bonus (+1 if active)
 * - commitmentBonus: Commitment Bonus (1-year: +1, 2-year: +2)
 * - earnedTotal: Sum of early bird + commitment bonuses
 * - acceleratorMultiplier: 1 (monthly) or 2 (Pay-in-Full)
 * - total: Final free months after accelerator
 */
export function getFreeMonthsBreakdown(term: 'month-to-month' | '1-year' | '2-year', payInFull: boolean): {
  earlyBirdBonus: number;
  commitmentBonus: number;
  earnedTotal: number;
  acceleratorMultiplier: number;
  total: number;
} {
  if (term === 'month-to-month') {
    return { 
      earlyBirdBonus: 0, 
      commitmentBonus: 0, 
      earnedTotal: 0,
      acceleratorMultiplier: 1,
      total: 0,
    };
  }
  
  // 25th Anniversary Early Bird Bonus: +1 if active
  const earlyBirdBonus = getEarlyBirdBonus().months;
  
  // Commitment Bonus: 1 for 1-year, 2 for 2-year
  const commitmentBonus = term === '1-year' ? 1 : 2;
  
  // Total earned BEFORE accelerator
  const earnedTotal = earlyBirdBonus + commitmentBonus;
  
  // Pay-in-Full Accelerator: ×2
  const acceleratorMultiplier = payInFull ? 2 : 1;
  const total = earnedTotal * acceleratorMultiplier;
  
  return {
    earlyBirdBonus,
    commitmentBonus,
    earnedTotal,
    acceleratorMultiplier,
    total,
  };
}

/**
 * Calculate the actual monthly payment based on term and base price
 * Month-to-month includes 15% flexibility pricing
 * 1-year and 2-year use base pricing
 */
export function calculateActualMonthly(basePrice: number, term: 'month-to-month' | '1-year' | '2-year'): number {
  if (term === 'month-to-month') {
    return Math.round(basePrice * (1 + MONTH_TO_MONTH_PREMIUM));
  }
  return basePrice;
}

// NOTE: Legacy functions below kept for backward compatibility
// New code should use calculate2YearFreeMonths() directly

// All available promotions - SIMPLIFIED for new commitment model
export const PROMOTIONS: Promotion[] = [
  // 1-Year Commitment Bonus
  {
    id: 'commitment_1year',
    title: '1-Year Commitment Bonus',
    shortDescription: '+1 free month',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 1,
    eligibility: { term: '1-year' },
    displayOrder: 1,
    active: true,
  },
  
  // 2-Year Commitment Bonus
  {
    id: 'commitment_2year',
    title: '2-Year Commitment Bonus',
    shortDescription: '+2 free months',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 2,
    eligibility: { term: '2-year' },
    displayOrder: 2,
    active: true,
  },

  // Pay-in-Full Accelerator - doubles ALL earned free months
  {
    id: 'pay_full_accelerator',
    title: 'Pay-in-Full Accelerator',
    shortDescription: 'Doubles ALL earned free months',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 0, // Computed dynamically, not a static value
    eligibility: { payUpfront: true },
    displayOrder: 3,
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
  term: 'month-to-month' | '1-year' | '2-year';
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
  selections: UserSelections
): PromotionResult {
  const activePromos = PROMOTIONS.filter(p => p.active);
  const eligible: Promotion[] = [];
  const applied: Promotion[] = [];
  const pending: Promotion[] = [];
  const savingsBreakdown: PromotionResult['savingsBreakdown'] = [];

  let totalPercentOff = 0;
  let totalFreeMonths = 0;
  let capApplied = false;

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
 * Accepts month-to-month, 1-year, or 2-year terms
 */
export function applyPromotions(
  baseTotals: { monthlyTotal: number; term: 'month-to-month' | '1-year' | '2-year' },
  promotionResult: PromotionResult
): AppliedTotals {
  const termMonthsMap: Record<string, number> = { 'month-to-month': 1, '1-year': 12, '2-year': 24 };
  const termMonths = termMonthsMap[baseTotals.term] || 24;
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
