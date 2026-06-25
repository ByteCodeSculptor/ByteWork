import { promos as defaultPromos, promoSettings } from '@/config/promo';

/** Hour-of-day (0–23) in the configured timezone for a given Date. */
export function localHour(date, tzOffsetMinutes = 0) {
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const local = (((utcMinutes + tzOffsetMinutes) % 1440) + 1440) % 1440;
  return Math.floor(local / 60);
}

/**
 * Pick the niche whose time-window contains `date`. The day is divided into
 * `windowHours`-sized slots; each promo's `slot` hour marks its window.
 * @returns {string} the service/niche id (falls back to the first promo)
 */
export function nicheForDate(
  date,
  { promos = defaultPromos, tzOffsetMinutes = promoSettings.tzOffsetMinutes, windowHours = promoSettings.windowHours } = {}
) {
  const h = localHour(date, tzOffsetMinutes);
  const window = Math.floor(h / windowHours);
  const match = promos.find((p) => Math.floor(p.slot / windowHours) === window);
  return (match ?? promos[0]).id;
}
