import { promoSettings } from '@/config/promo';
import { INTEGRITY_SYSTEM_RULES, vetCopy } from '@/lib/promo/integrity';

/**
 * Provider-agnostic LLM copy generation over the OpenAI-compatible
 * /chat/completions API. Defaults to Groq (free, no card, available in India),
 * but works with any OpenAI-compatible endpoint (OpenRouter, Cerebras, etc.)
 * via env: LLM_API_KEY, LLM_BASE_URL, LLM_MODEL.
 */

const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

/** Vetted, deterministic copy used whenever the LLM is unavailable or rejected. */
export function fallbackCopy(promo, source = 'fallback') {
  return {
    hook: promo.hooks[0],
    caption:
      'Reference build + clean source code + 1:1 mentorship so you can learn it and defend your own final-year project. DM to start.',
    hashtags: promo.hashtags,
    source,
  };
}

function userPrompt(promo, service) {
  return [
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
 * Generate promo copy via an OpenAI-compatible chat API, gated by the integrity
 * filter. Always resolves to usable copy: on missing key / API error / bad JSON
 * / integrity violation it returns vetted static fallback copy.
 */
export async function generateCopy({
  promo,
  service,
  apiKey = process.env.LLM_API_KEY,
  baseUrl = process.env.LLM_BASE_URL || DEFAULT_BASE_URL,
  model = process.env.LLM_MODEL || promoSettings.llmModel || DEFAULT_MODEL,
  timeoutMs = 20000,
}) {
  if (!apiKey) return fallbackCopy(promo, 'fallback-no-key');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.9,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: INTEGRITY_SYSTEM_RULES },
          { role: 'user', content: userPrompt(promo, service) },
        ],
      }),
    });
    if (!res.ok) return fallbackCopy(promo, 'fallback-http');

    const data = await res.json();
    const parsed = extractJson(data?.choices?.[0]?.message?.content);
    if (!parsed?.hook || !parsed?.caption) return fallbackCopy(promo, 'fallback-parse');

    const copy = {
      hook: String(parsed.hook),
      caption: String(parsed.caption),
      hashtags: Array.isArray(parsed.hashtags) && parsed.hashtags.length ? parsed.hashtags.slice(0, 5) : promo.hashtags,
      source: 'llm',
    };
    // Integrity gate: never ship copy implying contract cheating.
    return vetCopy(copy).clean ? copy : fallbackCopy(promo, 'fallback-integrity');
  } catch {
    return fallbackCopy(promo, 'fallback-error');
  } finally {
    clearTimeout(timer);
  }
}
