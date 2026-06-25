import { describe, it, expect } from 'vitest';
import { daysBetween, resolveTier, calculateQuote } from '@/lib/pricing';

const d = (s) => new Date(s + 'T00:00:00');

describe('resolveTier', () => {
  it('≤3 days → super-rush ×1.4', () => expect(resolveTier(2).multiplier).toBe(1.4));
  it('4–6 days → express ×1.2', () => expect(resolveTier(5).multiplier).toBe(1.2));
  it('≥7 days → standard ×1.0', () => expect(resolveTier(10).multiplier).toBe(1.0));
  it('boundary: exactly 3 → super-rush', () => expect(resolveTier(3).id).toBe('super-rush'));
  it('boundary: exactly 6 → express', () => expect(resolveTier(6).id).toBe('express'));
  it('boundary: exactly 7 → standard', () => expect(resolveTier(7).id).toBe('standard'));
  it('negative → null (invalid)', () => expect(resolveTier(-1)).toBeNull());
});

describe('daysBetween', () => {
  it('counts whole days forward', () => expect(daysBetween(d('2026-06-25'), d('2026-06-30'))).toBe(5));
  it('same day → 0', () => expect(daysBetween(d('2026-06-25'), d('2026-06-25'))).toBe(0));
  it('past date → negative', () => expect(daysBetween(d('2026-06-25'), d('2026-06-23'))).toBe(-2));
});

describe('calculateQuote', () => {
  it('standard service, no add-ons', () => {
    const q = calculateQuote({ basePrice: 10000, diffDays: 10 });
    expect(q).toMatchObject({ valid: true, multiplier: 1.0, base: 10000, total: 10000 });
  });
  it('super-rush adds 40% then add-ons', () => {
    const q = calculateQuote({ basePrice: 10000, diffDays: 1, addOnTotal: 500 });
    expect(q.total).toBe(14500); // 10000*1.4 + 500
    expect(q.tier.id).toBe('super-rush');
  });
  it('express tier with add-ons', () => {
    const q = calculateQuote({ basePrice: 12000, diffDays: 5, addOnTotal: 0 });
    expect(q.total).toBe(14400); // 12000*1.2
  });
  it('invalid deadline → valid:false, total 0', () => {
    expect(calculateQuote({ basePrice: 10000, diffDays: -2 })).toMatchObject({ valid: false, total: 0 });
  });
  it('no deadline (null diffDays) → standard base price, valid', () => {
    const q = calculateQuote({ basePrice: 9000, diffDays: null });
    expect(q).toMatchObject({ valid: true, multiplier: 1.0, total: 9000 });
  });
});
