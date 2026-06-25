import { describe, it, expect } from 'vitest';
import { quoteLink, directLink, buildQuoteMessage, buildPromoMessage } from '@/lib/whatsapp';

describe('whatsapp facade', () => {
  it('quoteLink targets the configured number', () => {
    expect(
      quoteLink({ serviceName: 'MERN', deadline: '2026-07-01', tierLabel: 'Standard', price: 12000 })
    ).toMatch(/^https:\/\/wa\.me\/919182407243\?text=/);
  });

  it('quoteLink encodes service name and price into the message', () => {
    const url = quoteLink({ serviceName: 'Java Architecture', deadline: '2026-07-01', tierLabel: 'Standard', price: 12000 });
    const text = decodeURIComponent(url.split('text=')[1]);
    expect(text).toContain('Java Architecture');
    expect(text).toContain('12000');
  });

  it('directLink encodes arbitrary text', () => {
    expect(directLink('hello world')).toBe('https://wa.me/919182407243?text=hello%20world');
  });

  it('buildQuoteMessage lists add-ons when provided', () => {
    const msg = buildQuoteMessage({ serviceName: 'X', deadline: 'd', tierLabel: 't', price: 1, addOnLines: ['Extended Documentation ×5'] });
    expect(msg).toContain('Extended Documentation ×5');
  });

  it('buildQuoteMessage greets by name when provided', () => {
    expect(buildQuoteMessage({ serviceName: 'X', deadline: 'd', tierLabel: 't', price: 1, name: 'Asha' })).toContain('Asha');
  });

  it('accepts a custom number override', () => {
    expect(directLink('hi', '910000000000')).toBe('https://wa.me/910000000000?text=hi');
  });
});

describe('buildPromoMessage', () => {
  it('uses the niche message and appends the keyword reference', () => {
    const msg = buildPromoMessage({ message: 'Custom niche pitch', keyword: 'QISKIT' });
    expect(msg).toContain('Custom niche pitch');
    expect(msg).toContain('QISKIT');
  });

  it('falls back to a mentorship-framed default using the service name', () => {
    const msg = buildPromoMessage({ serviceName: 'MERN Stack Development', keyword: 'MERN' });
    expect(msg).toContain('MERN Stack Development');
    expect(msg).toContain('mentorship');
  });

  it('produces a valid wa.me link via directLink to the configured number', () => {
    const link = directLink(buildPromoMessage({ serviceName: 'X', keyword: 'K' }));
    expect(link).toMatch(/^https:\/\/wa\.me\/919182407243\?text=/);
  });
});
