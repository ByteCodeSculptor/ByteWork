import { promoSettings } from '@/config/promo';

/**
 * Build a keyless Pollinations.ai image URL (9:16 by default).
 * Pure — safe to unit test. `nologo` only takes effect with an account token.
 */
export function buildImageUrl(
  subject,
  { width = 1080, height = 1920, model = 'flux', seed, nologo = true, style = promoSettings.imageStyle } = {}
) {
  const prompt = [subject, style].filter(Boolean).join(', ');
  const params = new URLSearchParams({ width: String(width), height: String(height), model });
  if (nologo) params.set('nologo', 'true');
  if (seed != null) params.set('seed', String(seed));
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

/** Fetch the generated image bytes (with timeout + optional Bearer token). */
export async function fetchImage(url, { token, timeoutMs = 25000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(url, { headers, signal: controller.signal });
    if (!res.ok) throw new Error(`Pollinations responded ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new Error('Pollinations returned an empty image');
    return buf;
  } finally {
    clearTimeout(timer);
  }
}
