import { describe, it, expect } from 'vitest';
import { buildImageUrl } from '@/lib/promo/pollinations';

describe('buildImageUrl', () => {
  it('targets the Pollinations prompt endpoint', () => {
    expect(buildImageUrl('quantum qubit')).toMatch(/^https:\/\/image\.pollinations\.ai\/prompt\//);
  });

  it('requests a 9:16 (1080x1920) image by default', () => {
    const url = buildImageUrl('x');
    expect(url).toContain('width=1080');
    expect(url).toContain('height=1920');
  });

  it('sets nologo by default and seed when provided', () => {
    const url = buildImageUrl('x', { seed: 7 });
    expect(url).toContain('nologo=true');
    expect(url).toContain('seed=7');
  });

  it('encodes the subject + brand style into the prompt path', () => {
    const url = buildImageUrl('quantum qubit bloch sphere');
    const path = decodeURIComponent(url.split('/prompt/')[1].split('?')[0]);
    expect(path).toContain('quantum qubit bloch sphere');
    expect(path).toContain('9:16'); // from the brand style suffix
  });

  it('different subjects produce different URLs', () => {
    expect(buildImageUrl('a')).not.toBe(buildImageUrl('b'));
  });
});
