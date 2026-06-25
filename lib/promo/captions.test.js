import { describe, it, expect } from 'vitest';
import { composeCaption } from '@/lib/promo/captions';

const promo = { commentKeyword: 'QISKIT', hashtags: ['#a', '#b', '#c', '#d', '#e', '#f'] };
const copy = { hook: 'Hook line', caption: 'Body copy', hashtags: ['#x', '#y'] };
const waLink = 'https://wa.me/919182407243?text=hi';

describe('composeCaption', () => {
  it('includes hook, caption, WhatsApp link and comment keyword', () => {
    const c = composeCaption({ copy, promo, waLink });
    expect(c).toContain('Hook line');
    expect(c).toContain('Body copy');
    expect(c).toContain(waLink);
    expect(c).toContain('QISKIT');
  });

  it('prefers AI hashtags, falling back to promo hashtags', () => {
    expect(composeCaption({ copy, promo, waLink })).toContain('#x #y');
    expect(composeCaption({ copy: { ...copy, hashtags: [] }, promo, waLink })).toContain('#a #b');
  });

  it('caps fallback hashtags at 5', () => {
    const c = composeCaption({ copy: { ...copy, hashtags: [] }, promo, waLink });
    expect(c).toContain('#e');
    expect(c).not.toContain('#f');
  });

  it('truncates to maxLen', () => {
    const longCopy = { hook: 'H', caption: 'x'.repeat(2000), hashtags: ['#x'] };
    expect(composeCaption({ copy: longCopy, promo, waLink, maxLen: 200 }).length).toBeLessThanOrEqual(200);
  });
});
