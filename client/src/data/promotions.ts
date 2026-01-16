/**
 * Promotions Configuration
 * 
 * This file defines all available promotions, their stacking rules, and caps.
 * Marketing team can edit this file to add/modify promotions without touching component code.
 * 
 * COMMITMENT MODEL (January 2026):
 * 3 commitment options:
 * - Month-to-Month: +15% premium, no free months, cancel anytime
 * - 1-Year Subscription: 12 months, +1 base free month (2 with PIF)
 * - 2-Year Subscription (Price Lock): 24 months, +2 base free months (4 with PIF)
 * 
 * FREE MONTH RULES:
 * - Month-to-Month: 0 complimentary months
 * - 1-Year: 1 complimentary month (commitment bonus)
 * - 1-Year Pay in Full: doubles commitment to 2 complimentary months
 * - 2-Year: 2 complimentary months (commitment bonus)
 * - 2-Year Pay in Full: doubles commitment to 4 complimentary months
 * - 25th Anniversary Bonus (NOT doubled by pay-in-full):
 *   - Enroll Dec 25 - Jan 25: +2 bonus months
 *   - Enroll Jan 25 - Feb 25: +1 bonus month
 *   - After Feb 25: Enrollment concluded
 * - Max total: 6 complimentary months (4 + 2 bonus)
 * 
 * BILLING:
 * - termMonths = 12 or 24
 * - billedMonths = termMonths - freeMonths
 * - effectiveMonthly = (monthlySubscription × billedMonths) / termMonths
 * - Complimentary months are skipped billing at END of agreement
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
  maxFreeMonths: 6,  // Max: 4 (pay-in-full) + 2 (anniversary bonus)
};

// Month-to-month premium (15% over 2-year base rate)
export const MONTH_TO_MONTH_PREMIUM = 0.15;

// 25th Anniversary Enrollment Bonus dates
export const ANNIVERSARY_BONUS = {
  tier1End: new Date('2026-01-25T23:59:59'),  // +2 bonus months
  tier2End: new Date('2026-02-25T23:59:59'),  // +1 bonus month
};

/**
 * Get anniversary bonus months based on enrollment date
 * - Dec 25 - Jan 25: +2 months
 * - Jan 25 - Feb 25: +1 month
 * - After Feb 25: 0 (enrollment concluded)
 * 
 * NOTE: Bonus months are NOT doubled by pay-in-full
 */
export function getAnniversaryBonus(): { months: number; tier: 'tier1' | 'tier2' | 'concluded' } {
  const now = new Date();
  
  if (now < ANNIVERSARY_BONUS.tier1End) {
    return { months: 2, tier: 'tier1' };
  } else if (now < ANNIVERSARY_BONUS.tier2End) {
    return { months: 1, tier: 'tier2' };
  }
  return { months: 0, tier: 'concluded' };
}

// Legacy alias for backward compatibility
export const isEarlyBird = (): boolean => {
  return getAnniversaryBonus().months > 0;
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
    description: 'Cancel anytime with 30 days notice',
    hasPremium: true,
    allowsPayInFull: false,
  },
  {
    id: '1-year' as const,
    label: '1-Year Subscription',
    months: 12,
    freeMonths: 1,  // Base commitment bonus
    badge: 'Save More',
    description: '+1 complimentary month (2 with pay-in-full)',
    hasPremium: false,
    allowsPayInFull: true,
  },
  {
    id: '2-year' as const,
    label: '2-Year Subscription (Price Lock)',
    months: 24,
    freeMonths: 2,  // Base commitment bonus
    badge: 'Best Value',
    description: '+2 complimentary months (4 with pay-in-full)',
    hasPremium: false,
    allowsPayInFull: true,
  },
];

/**
 * Calculate complimentary service months for term commitments
 * 
 * 1-Year: 1 month base, 2 with pay-in-full
 * 2-Year: 2 months base, 4 with pay-in-full
 * Pay in Full: doubles COMMITMENT bonus only
 * Anniversary bonus: +0 to +2 (NOT doubled)
 * 
 * Max possible: 6 months
 */
export function calculateTermFreeMonths(term: 'month-to-month' | '1-year' | '2-year', payInFull: boolean): number {
  if (term === 'month-to-month') return 0;
  
  // Base commitment bonus by term
  const baseCommitment = term === '1-year' ? 1 : 2;
  
  // Pay in full doubles commitment only
  const commitmentMonths = payInFull ? baseCommitment * 2 : baseCommitment;
  
  // Anniversary bonus: NOT doubled by pay-in-full
  const anniversaryBonus = getAnniversaryBonus().months;
  
  // Total capped at max
  return Math.min(commitmentMonths + anniversaryBonus, PROMO_CAPS.maxFreeMonths);
}

// Legacy alias for backward compatibility
export function calculate2YearFreeMonths(payInFull: boolean): number {
  return calculateTermFreeMonths('2-year', payInFull);
}

/**
 * Get itemized breakdown of complimentary months
 * Useful for displaying in UI
 */
export function getFreeMonthsBreakdown(term: 'month-to-month' | '1-year' | '2-year', payInFull: boolean): {
  commitment: number;
  payInFullBonus: number;
  anniversaryBonus: number;
  total: number;
} {
  if (term === 'month-to-month') {
    return { commitment: 0, payInFullBonus: 0, anniversaryBonus: 0, total: 0 };
  }
  
  const baseCommitment = term === '1-year' ? 1 : 2;
  const payInFullBonus = payInFull ? baseCommitment : 0;
  const anniversaryBonus = getAnniversaryBonus().months;
  
  const total = Math.min(
    baseCommitment + payInFullBonus + anniversaryBonus,
    PROMO_CAPS.maxFreeMonths
  );
  
  return {
    commitment: baseCommitment,
    payInFullBonus,
    anniversaryBonus,
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
  // 2-Year commitment with pay-in-full doubling
  {
    id: 'commitment_2year',
    title: '2-Year Price Lock',
    shortDescription: '2 free months (4 with pay in full)',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 2,
    eligibility: { term: '2-year' },
    displayOrder: 1,
    active: true,
  },

  // Pay in Full bonus - doubles free months for 2-year
  {
    id: 'pay_full_bonus',
    title: 'Pay in Full Bonus',
    shortDescription: 'Doubles free months to 4',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 2,
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
