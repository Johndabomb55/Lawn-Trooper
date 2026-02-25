/**
 * Promotions Configuration
 * 
 * This file defines all available promotions, their stacking rules, and caps.
 * Marketing team can edit this file to add/modify promotions without touching component code.
 * 
 * COMMITMENT MODEL (March 2026):
 * 3 commitment options:
 * - Month-to-Month: +15% premium, no complimentary months, cancel anytime
 * - 1-Year Subscription: 12 months, can pay monthly or pay in full
 * - 2-Year Subscription (Price Lock): 24 months, can pay monthly or pay in full
 * 
 * COMPLIMENTARY MONTH RULES:
 * "Complimentary months" = skipped billing months at the END of your term.
 * Your agreement still ends on your 12-month or 24-month anniversary date.
 * 
 * 1) Commitment Bonus (always available):
 *    - 1-Year: +1 complimentary month
 *    - 2-Year: +2 complimentary months
 * 2) Pay-in-Full Option:
 *    - Doubles ONLY commitment months (bonus months NOT doubled)
 *    - 1-Year PIF: 1×2 = 2 commitment months
 *    - 2-Year PIF: 2×2 = 4 commitment months
 * 3) 25th Anniversary Enrollment Bonus (limited time):
 *    - Enroll by March 25: +2 bonus months
 *    - After March 25: +0 bonus months
 *    - Bonus months are NOT doubled by pay-in-full
 * 
 * EXAMPLES (before March 25 bonus = +2):
 * - 1-Year (monthly): 1 + 2 = 3 complimentary months
 * - 1-Year + PIF: 2 + 2 = 4 complimentary months
 * - 2-Year (monthly): 2 + 2 = 4 complimentary months
 * - 2-Year + PIF: 4 + 2 = 6 complimentary months
 * 
 * MAX OUTCOMES:
 * - 1-Year Pay in Full + March bonus = 4 total
 * - 2-Year Pay in Full + March bonus = 6 total
 * 
 * BILLING:
 * - termMonths = 12 or 24
 * - billedMonths = termMonths - complimentaryMonths
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
  maxFreeMonths: 6,  // Max: 2-Year PIF (4) + March bonus (2) = 6
};

// Month-to-month premium (15% over 2-year base rate)
export const MONTH_TO_MONTH_PREMIUM = 0.15;

// 25-Year Birthday Bonus (25th Anniversary Enrollment Bonus) - Single deadline March 25
export const BIRTHDAY_BONUS = {
  endDate: new Date('2026-03-25T23:59:59'),  // Enroll by March 25: +2 months
  tier1EndDate: new Date('2026-03-25T23:59:59'),  // Legacy alias
  tier2EndDate: new Date('2026-03-25T23:59:59'),  // Legacy alias (same as tier1)
  bonusMonths: 2,  // +2 bonus months if enrolled by March 25
  tier1Months: 2,  // Legacy alias
  tier2Months: 0,  // No second tier
  marketingName: '25-Year Birthday Bonus',
  formalName: '25th Anniversary Enrollment Bonus',
};

// Legacy alias
export const ANNIVERSARY_BONUS = BIRTHDAY_BONUS;

/**
 * Get 25-Year Birthday Bonus status
 * - Enroll by March 25: +2 bonus months
 * - After March 25: +0 bonus months (Concluded)
 * 
 * NOTE: Bonus months are NOT doubled by pay-in-full
 */
export function getBirthdayBonus(): { 
  months: number; 
  tier: 'tier1' | 'tier2' | 'concluded'; 
  isActive: boolean;
  tierLabel: string;
  name: string;
} {
  const now = new Date();
  
  if (now < BIRTHDAY_BONUS.endDate) {
    return {
      months: BIRTHDAY_BONUS.bonusMonths,
      tier: 'tier1',
      isActive: true,
      tierLabel: 'Enroll by Mar 25: +2 months',
      name: BIRTHDAY_BONUS.marketingName,
    };
  } else {
    return {
      months: 0,
      tier: 'concluded',
      isActive: false,
      tierLabel: 'Bonus concluded',
      name: BIRTHDAY_BONUS.marketingName,
    };
  }
}

// Alias for backward compatibility
export function getAnniversaryBonus() {
  return getBirthdayBonus();
}

// Check if Birthday bonus is active (either tier)
export const isBirthdayBonusActive = (): boolean => {
  return getBirthdayBonus().isActive;
};

// Legacy aliases for backward compatibility
export const isAnniversaryActive = isBirthdayBonusActive;
export const EARLY_BIRD_BONUS = BIRTHDAY_BONUS;
export const getEarlyBirdBonus = () => {
  const bonus = getBirthdayBonus();
  return {
    months: bonus.months,
    isActive: bonus.isActive,
    enrollBy: 'Mar 25',
    payBy: 'Apr 1',
  };
};
export const isEarlyBird = isBirthdayBonusActive;

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
    description: 'Month-to-month does not include complimentary months because we reward long-term commitment.',
    shortDescription: 'No complimentary months (+15% flexibility premium)',
    hasPremium: true,
    allowsPayInFull: false,
  },
  {
    id: '1-year' as const,
    label: '1-Year Subscription',
    months: 12,
    freeMonths: 1,  // Commitment Bonus
    badge: 'Save More',
    description: 'Commit to one year and earn +1 complimentary billing month. Pay monthly or pay in full.',
    shortDescription: '+1 complimentary month (Commitment Bonus)',
    hasPremium: false,
    allowsPayInFull: true,
  },
  {
    id: '2-year' as const,
    label: '2-Year Subscription (Price Lock)',
    months: 24,
    freeMonths: 2,  // Commitment Bonus
    badge: 'Best Value',
    description: 'Lock in your rate for 2 years and earn +2 complimentary billing months. Pay monthly or pay in full.',
    shortDescription: '+2 complimentary months (Commitment Bonus)',
    hasPremium: false,
    allowsPayInFull: true,
  },
];

/**
 * Calculate complimentary service months for term commitments
 * 
 * Formula:
 * - Commitment months: 1 (1-year) or 2 (2-year)
 * - Pay-in-Full doubles ONLY commitment months (NOT bonus)
 * - Anniversary Enrollment Bonus: +2 (before March 25) — NOT doubled
 * 
 * Examples (before March 25, bonus = +2):
 * - 1-Year (monthly): 1 + 2 = 3 complimentary months
 * - 1-Year + PIF: 2 + 2 = 4 complimentary months
 * - 2-Year (monthly): 2 + 2 = 4 complimentary months
 * - 2-Year + PIF: 4 + 2 = 6 complimentary months
 */
export function calculateTermFreeMonths(term: 'month-to-month' | '1-year' | '2-year', payInFull: boolean): number {
  if (term === 'month-to-month') return 0;
  
  // Commitment Bonus: 1 for 1-year, 2 for 2-year
  const commitmentBase = term === '1-year' ? 1 : 2;
  
  // Pay-in-Full doubles ONLY commitment months
  const commitmentMonths = payInFull ? commitmentBase * 2 : commitmentBase;
  
  // 25th Anniversary Enrollment Bonus: NOT doubled by PIF
  const anniversaryBonus = getAnniversaryBonus().months;
  
  // Total: doubled commitment + undoubled bonus
  const totalFreeMonths = commitmentMonths + anniversaryBonus;
  
  return totalFreeMonths;
}

// Legacy alias for backward compatibility
export function calculate2YearFreeMonths(payInFull: boolean): number {
  return calculateTermFreeMonths('2-year', payInFull);
}

/**
 * Get itemized breakdown of complimentary months
 * Useful for displaying in UI
 * 
 * Returns:
 * - commitmentBase: Base commitment months (1 for 1-year, 2 for 2-year)
 * - commitmentMonths: After PIF doubling (if applicable)
 * - anniversaryBonus: Enrollment bonus (NOT doubled by PIF)
 * - total: Final complimentary months
 * - payInFull: Whether PIF is applied
 */
export function getFreeMonthsBreakdown(term: 'month-to-month' | '1-year' | '2-year', payInFull: boolean): {
  commitmentBase: number;
  commitmentMonths: number;
  anniversaryBonus: number;
  total: number;
  payInFull: boolean;
  // Legacy aliases for backward compatibility
  earlyBirdBonus: number;
  commitmentBonus: number;
  earnedTotal: number;
  acceleratorMultiplier: number;
} {
  if (term === 'month-to-month') {
    return { 
      commitmentBase: 0,
      commitmentMonths: 0,
      anniversaryBonus: 0,
      total: 0,
      payInFull: false,
      // Legacy
      earlyBirdBonus: 0,
      commitmentBonus: 0,
      earnedTotal: 0,
      acceleratorMultiplier: 1,
    };
  }
  
  // Commitment Bonus base: 1 for 1-year, 2 for 2-year
  const commitmentBase = term === '1-year' ? 1 : 2;
  
  // Pay-in-Full doubles ONLY commitment months
  const commitmentMonths = payInFull ? commitmentBase * 2 : commitmentBase;
  
  // 25th Anniversary Enrollment Bonus: NOT doubled
  const anniversaryBonus = getAnniversaryBonus().months;
  
  // Total = doubled commitment + undoubled bonus
  const total = commitmentMonths + anniversaryBonus;
  
  return {
    commitmentBase,
    commitmentMonths,
    anniversaryBonus,
    total,
    payInFull,
    // Legacy aliases
    earlyBirdBonus: anniversaryBonus,
    commitmentBonus: commitmentBase,
    earnedTotal: commitmentBase + anniversaryBonus,
    acceleratorMultiplier: payInFull ? 2 : 1,
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
    shortDescription: '+1 complimentary month',
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
    shortDescription: '+2 complimentary months',
    type: 'termFreeMonths',
    stackGroup: 'freeMonths',
    value: 2,
    eligibility: { term: '2-year' },
    displayOrder: 2,
    active: true,
  },

  // Pay-in-Full Option - doubles ONLY commitment months (bonus NOT doubled)
  {
    id: 'pay_full_option',
    title: 'Pay-in-Full Option',
    shortDescription: 'Doubles commitment months (bonus not doubled)',
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
    shortDescription: '+1 complimentary month after your friend commits',
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

  // Calculate term-based free months from canonical commitment logic.
  // This ensures pay-in-full correctly increases free months.
  const freeMonthsBreakdown = getFreeMonthsBreakdown(selections.term, selections.payUpfront);
  if (selections.term !== 'month-to-month') {
    const commitmentPromo = activePromos.find(
      (p) => p.id === (selections.term === '1-year' ? 'commitment_1year' : 'commitment_2year')
    );
    if (commitmentPromo) {
      applied.push(commitmentPromo);
    }
    if (freeMonthsBreakdown.commitmentBase > 0) {
      savingsBreakdown.push({
        promoId: commitmentPromo?.id || `commitment_${selections.term}`,
        title: commitmentPromo?.title || 'Commitment Bonus',
        savings: selections.monthlyTotal * freeMonthsBreakdown.commitmentBase,
        freeMonths: freeMonthsBreakdown.commitmentBase,
        percentOff: 0,
      });
    }

    if (selections.payUpfront && freeMonthsBreakdown.commitmentMonths > freeMonthsBreakdown.commitmentBase) {
      const payFullPromo = activePromos.find((p) => p.id === 'pay_full_option');
      if (payFullPromo) {
        applied.push(payFullPromo);
      }
      const extraMonthsFromMultiplier = freeMonthsBreakdown.commitmentMonths - freeMonthsBreakdown.commitmentBase;
      savingsBreakdown.push({
        promoId: payFullPromo?.id || 'pay_full_option',
        title: 'Pay-in-Full Commitment Multiplier',
        savings: selections.monthlyTotal * extraMonthsFromMultiplier,
        freeMonths: extraMonthsFromMultiplier,
        percentOff: 0,
      });
    }

    if (freeMonthsBreakdown.anniversaryBonus > 0) {
      const anniversaryPromo: Promotion = {
        id: 'anniversary_enrollment_bonus',
        title: '25th Anniversary Enrollment Bonus',
        shortDescription: `+${freeMonthsBreakdown.anniversaryBonus} complimentary months`,
        type: 'termFreeMonths',
        stackGroup: 'freeMonths',
        value: freeMonthsBreakdown.anniversaryBonus,
        eligibility: {},
        displayOrder: 4,
        active: true,
      };
      applied.push(anniversaryPromo);
      savingsBreakdown.push({
        promoId: anniversaryPromo.id,
        title: anniversaryPromo.title,
        savings: selections.monthlyTotal * freeMonthsBreakdown.anniversaryBonus,
        freeMonths: freeMonthsBreakdown.anniversaryBonus,
        percentOff: 0,
      });
    }

    totalFreeMonths = freeMonthsBreakdown.total;
  }

  // Sort by display order for consistent application
  const sortedPromos = [...activePromos].sort((a, b) => a.displayOrder - b.displayOrder);

  for (const promo of sortedPromos) {
    // Term-based free months are handled above from canonical formulas.
    if (promo.stackGroup === 'freeMonths' && promo.type !== 'referralFreeMonth') {
      continue;
    }

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

  if (totalFreeMonths > PROMO_CAPS.maxFreeMonths) {
    totalFreeMonths = PROMO_CAPS.maxFreeMonths;
    capApplied = true;
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
  contactStep: "No payment required. We never sell your data. An account manager will reach out to schedule a good time for your FREE property walk-through.",
  confirmation: "Your information is secure. We never sell your data. An account manager will reach out to schedule your FREE property walk-through.",
  commitment: "Commit to us and we commit to you.",
  miguelNote: "An account manager will contact you via your preferred method (call, email, or text) to coordinate a good time for your FREE property walk-through and Dream Yard Recon.",
  referralNudge: "Refer a neighbour — you both earn 1 complimentary month after your friend commits.",
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
