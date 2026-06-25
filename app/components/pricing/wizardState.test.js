import { describe, it, expect } from 'vitest';
import { wizardReducer, initialState, STEPS, summarizeWizard } from '@/app/components/pricing/wizardState';

describe('wizardReducer', () => {
  it('NEXT advances the step', () => expect(wizardReducer(initialState, { type: 'NEXT' }).step).toBe(1));
  it('NEXT clamps at the last step', () => {
    const atEnd = { ...initialState, step: STEPS.length - 1 };
    expect(wizardReducer(atEnd, { type: 'NEXT' }).step).toBe(STEPS.length - 1);
  });
  it('BACK clamps at 0', () => expect(wizardReducer(initialState, { type: 'BACK' }).step).toBe(0));
  it('GOTO sets and clamps the step', () => {
    expect(wizardReducer(initialState, { type: 'GOTO', step: 2 }).step).toBe(2);
    expect(wizardReducer(initialState, { type: 'GOTO', step: 99 }).step).toBe(STEPS.length - 1);
  });
  it('SET_SERVICE updates serviceId', () =>
    expect(wizardReducer(initialState, { type: 'SET_SERVICE', serviceId: 'java' }).serviceId).toBe('java'));
  it('SET_DEADLINE updates deadline', () =>
    expect(wizardReducer(initialState, { type: 'SET_DEADLINE', deadline: '2026-07-01' }).deadline).toBe('2026-07-01'));
  it('SET_ADDON sets a quantity', () =>
    expect(wizardReducer(initialState, { type: 'SET_ADDON', id: 'extra-docs', quantity: 5 }).addOns['extra-docs']).toBe(5));
  it('RESET returns to initial state', () => {
    const dirty = { step: 2, serviceId: 'java', deadline: 'x', addOns: { 'extra-docs': 3 } };
    expect(wizardReducer(dirty, { type: 'RESET' })).toEqual(initialState);
  });
});

describe('summarizeWizard', () => {
  const today = new Date('2026-06-25T00:00:00');

  it('totals service base + add-ons (no deadline → standard tier)', () => {
    const state = { step: 3, serviceId: 'mern', deadline: '', addOns: { 'extra-docs': 5 } };
    const s = summarizeWizard(state, today);
    expect(s.service.id).toBe('mern');
    expect(s.addOnTotal).toBe(150); // ₹30 × 5
    expect(s.quote.total).toBe(12150); // 12000 base + 150
    expect(s.quote.valid).toBe(true);
  });

  it('applies super-rush multiplier for tight deadlines', () => {
    const state = { step: 3, serviceId: 'quantum', deadline: '2026-06-27', addOns: {} };
    const s = summarizeWizard(state, today); // 2 days out → ×1.4
    expect(s.quote.tier.id).toBe('super-rush');
    expect(s.quote.total).toBe(14000);
  });

  it('flags invalid past deadlines', () => {
    const state = { step: 3, serviceId: 'quantum', deadline: '2026-06-20', addOns: {} };
    expect(summarizeWizard(state, today).quote.valid).toBe(false);
  });

  it('lists on-request add-ons without adding to the total', () => {
    const state = { step: 3, serviceId: 'quantum', deadline: '', addOns: { 'research-paper': 1 } };
    const s = summarizeWizard(state, today);
    expect(s.addOnTotal).toBe(0);
    expect(s.addOnLines.join(' ')).toContain('on request');
  });
});
