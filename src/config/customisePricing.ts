/**
 * ==============================================================================
 * CORNICE & QUERY — CUSTOMISE PRICING CONFIGURATION
 * ==============================================================================
 * 
 * All pricing values and early-bird limits are controlled from this ONE file.
 * Do not scatter pricing numbers across components.
 */

export interface ScorePricingConfig {
  score: number; // 3, 4, or 5
  startingPriceDisplay: string; // e.g. "₹399"
  originalPriceDisplay?: string; // e.g. "₹499"
  discountDisplay?: string; // e.g. "40% OFF"
  isEarlyBirdEligible: boolean;
}

export const EARLY_BIRD_LIMIT = 20; // First 20 qualified customization requests

export const PRICING_BY_SCORE: Record<number, ScorePricingConfig> = {
  3: {
    score: 3,
    startingPriceDisplay: "₹399",
    originalPriceDisplay: "₹499",
    discountDisplay: "20% OFF",
    isEarlyBirdEligible: true,
  },
  4: {
    score: 4,
    startingPriceDisplay: "₹349",
    originalPriceDisplay: "₹499",
    discountDisplay: "30% OFF",
    isEarlyBirdEligible: true,
  },
  5: {
    score: 5,
    startingPriceDisplay: "₹299",
    originalPriceDisplay: "₹499",
    discountDisplay: "40% OFF",
    isEarlyBirdEligible: true,
  },
};

export function getPricingForScore(score: number): ScorePricingConfig {
  const boundedScore = Math.max(3, Math.min(5, score));
  return PRICING_BY_SCORE[boundedScore] || PRICING_BY_SCORE[3];
}
