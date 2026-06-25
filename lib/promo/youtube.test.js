import { describe, it, expect } from 'vitest';
import { buildTitle, buildDescription, buildVideoMetadata } from '@/lib/promo/youtube.mjs';

describe('buildTitle', () => {
  it('appends #Shorts', () => expect(buildTitle('Quantum project due?')).toBe('Quantum project due? #Shorts'));
  it('stays within the 100-char title limit for long hooks', () => {
    const t = buildTitle('x'.repeat(200));
    expect(t.length).toBeLessThanOrEqual(100);
    expect(t.endsWith('#Shorts')).toBe(true);
  });
});

describe('buildDescription', () => {
  it('preserves the caption (incl. the WhatsApp link) and adds tags', () => {
    const d = buildDescription('Chat: https://wa.me/919182407243');
    expect(d).toContain('wa.me/919182407243');
    expect(d).toContain('#Shorts');
  });
});

describe('buildVideoMetadata', () => {
  it('defaults to unlisted, not-for-kids, sci/tech category', () => {
    const m = buildVideoMetadata({ title: 'T', description: 'D' });
    expect(m.status.privacyStatus).toBe('unlisted');
    expect(m.status.selfDeclaredMadeForKids).toBe(false);
    expect(m.snippet.categoryId).toBe('28');
  });
  it('passes valid privacy through and falls back on invalid', () => {
    expect(buildVideoMetadata({ privacy: 'public' }).status.privacyStatus).toBe('public');
    expect(buildVideoMetadata({ privacy: 'nonsense' }).status.privacyStatus).toBe('unlisted');
  });
  it('truncates the title to 100 chars', () => {
    expect(buildVideoMetadata({ title: 'y'.repeat(150) }).snippet.title.length).toBe(100);
  });
});
