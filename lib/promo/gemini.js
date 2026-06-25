import { promoSettings } from '@/config/promo';
import { INTEGRITY_SYSTEM_RULES, vetCopy } from '@/lib/promo/integrity';

const endpoint = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

/** Vetted, deterministic copy used whenever the AI is unavailable or rejected. */
export function fallbackCopy(promo, source = 'fallback') {
  return {
    hook: promo.hooks[0],
    caption:
      'Reference build + clean source code + 1:1 mentorship so you can learn it and defend your own final-year project. DM to start.',
    hashtags: promo.hashtags,
    source,
  };
}

function buildPrompt(promo, service) {
  return [
    INTEGRITY_SYSTEM_RULES,
    '',
    `NICHE: ${service.name} (${service.tech}). Audience: final-year engineering students in India, stressed about deadlines.`,
    `Tone reference hooks (vary, don't copy verbatim): ${promo.hooks.join(' | ')}`,
    'Write ONE short Instagram Reel / YouTube Short script for this niche.',
    'Return STRICT JSON only: {"hook": string (<=90 chars), "caption": string (<=350 chars), "hashtags": string[] (3-5, each starting with #)}.',
  ].join('\n');
}

/** Extract the first JSON object from model text (handles ```json fences / prose). */
export function extractJson(text) {
  const match = String(text || '').match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

/**
 * Generate promo copy with Gemini, gated by the integrity filter.
 * Always resolves to usable copy: on missing key / API error / bad JSON /
 * integrity violation it returns vetted static fallback copy.
 */
export async function generateCopy({ promo, service, apiKey, model = promoSettings.geminiModel, timeoutMs = 20000 }) {
  if (!apiKey) return fallbackCopy(promo, 'fallback-no-key');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint(model), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(promo, service) }] }],
        generationConfig: { temperature: 0.9, responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) return fallbackCopy(promo, 'fallback-http');

    const data = await res.json();
    const parsed = extractJson(data?.candidates?.[0]?.content?.parts?.[0]?.text);
    if (!parsed?.hook || !parsed?.caption) return fallbackCopy(promo, 'fallback-parse');

    const copy = {
      hook: String(parsed.hook),
      caption: String(parsed.caption),
      hashtags: Array.isArray(parsed.hashtags) && parsed.hashtags.length ? parsed.hashtags.slice(0, 5) : promo.hashtags,
      source: 'gemini',
    };
    // Integrity gate: never ship copy implying contract cheating.
    return vetCopy(copy).clean ? copy : fallbackCopy(promo, 'fallback-integrity');
  } catch {
    return fallbackCopy(promo, 'fallback-error');
  } finally {
    clearTimeout(timer);
  }
}
