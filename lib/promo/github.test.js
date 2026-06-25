import { describe, it, expect } from 'vitest';
import { buildDispatchBody } from '@/lib/promo/github';

describe('buildDispatchBody', () => {
  it('wraps the payload as a promo-render repository_dispatch', () => {
    const body = buildDispatchBody({ niche: 'quantum', image_url: 'https://x/y.jpg', hook: 'H', caption: 'C' });
    expect(body.event_type).toBe('promo-render');
    expect(body.client_payload).toMatchObject({ niche: 'quantum', hook: 'H' });
  });
});
