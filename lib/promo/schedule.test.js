import { describe, it, expect } from 'vitest';
import { localHour, nicheForDate } from '@/lib/promo/schedule';

const at = (iso) => new Date(iso); // UTC ISO strings

describe('localHour (IST, +330 min)', () => {
  it('UTC 00:00 → IST 05', () => expect(localHour(at('2026-06-25T00:00:00Z'), 330)).toBe(5));
  it('UTC 18:30 → IST 00 (wraps midnight)', () => expect(localHour(at('2026-06-25T18:30:00Z'), 330)).toBe(0));
});

describe('nicheForDate (IST rotation python/mern/java/quantum, 6h windows)', () => {
  const opts = { tzOffsetMinutes: 330, windowHours: 6 };
  // python = IST 00–05, mern = 06–11, java = 12–17, quantum = 18–23
  it('UTC 20:00 → IST 01:30 → python', () => expect(nicheForDate(at('2026-06-24T20:00:00Z'), opts)).toBe('python'));
  it('UTC 01:00 → IST 06:30 → mern', () => expect(nicheForDate(at('2026-06-25T01:00:00Z'), opts)).toBe('mern'));
  it('UTC 07:00 → IST 12:30 → java', () => expect(nicheForDate(at('2026-06-25T07:00:00Z'), opts)).toBe('java'));
  it('UTC 13:00 → IST 18:30 → quantum', () => expect(nicheForDate(at('2026-06-25T13:00:00Z'), opts)).toBe('quantum'));
});
