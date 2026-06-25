import { pricingTiers } from '@/config/site';

const DAY_MS = 1000 * 60 * 60 * 24;

/** Whole days from `from` to `to` (negative if `to` is in the past). */
export function daysBetween(from, to) {
  return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);
}

/**
 * Pick the urgency tier for a number of remaining days.
 * - `null`/`undefined` days (no deadline chosen) → the standard tier
 * - negative days (past date) → `null` (invalid)
 * - otherwise the first tier whose `maxDays` covers the remaining days
 */
export function resolveTier(diffDays, tiers = pricingTiers) {
  if (diffDays == null) {
    return tiers.find((t) => t.maxDays === Infinity) ?? tiers[tiers.length - 1];
  }
  if (diffDays < 0) return null;
  return tiers.find((t) => diffDays <= t.maxDays) ?? null;
}

/**
 * Compute a full quote breakdown.
 * @returns {{valid:boolean, tier:object|null, multiplier:number, base:number,
 *            surcharge:number, addOnTotal:number, total:number}}
 */
export function calculateQuote({ basePrice, diffDays, addOnTotal = 0, tiers = pricingTiers }) {
  const tier = resolveTier(diffDays, tiers);
  if (!tier) {
    return { valid: false, tier: null, multiplier: 0, base: basePrice, surcharge: 0, addOnTotal, total: 0 };
  }
  const base = Math.round(basePrice * tier.multiplier);
  return {
    valid: true,
    tier,
    multiplier: tier.multiplier,
    base,
    surcharge: base - basePrice,
    addOnTotal,
    total: base + addOnTotal,
  };
}
