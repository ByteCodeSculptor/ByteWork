import { describe, it, expect } from 'vitest';
import { extractJson, fallbackCopy, generateCopy } from '@/lib/promo/llm';

const promo = { hooks: ['Hook A', 'Hook B'], hashtags: ['#a', '#b'] };

describe('extractJson', () => {
  it('parses bare JSON', () => expect(extractJson('{"hook":"h"}')).toEqual({ hook: 'h' }));
  it('parses fenced JSON', () => expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 }));
  it('parses JSON embedded in prose', () => expect(extractJson('Here you go: {"a":1} thanks')).toEqual({ a: 1 }));
  it('returns null on non-JSON', () => expect(extractJson('no json here')).toBeNull());
});

describe('fallbackCopy', () => {
  it('uses the niche hook + hashtags and is integrity-clean', () => {
    const c = fallbackCopy(promo);
    expect(c.hook).toBe('Hook A');
    expect(c.hashtags).toEqual(['#a', '#b']);
    expect(c.caption).toContain('mentorship');
  });
});

describe('generateCopy without an API key', () => {
  it('returns vetted fallback copy (no network)', async () => {
    const c = await generateCopy({ promo, service: { name: 'X', tech: 'Y' }, apiKey: '' });
    expect(c.source).toBe('fallback-no-key');
    expect(c.hook).toBe('Hook A');
  });
});
