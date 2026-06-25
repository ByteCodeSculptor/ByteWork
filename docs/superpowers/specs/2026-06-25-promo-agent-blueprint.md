# ByteWork Promo Agent — Blueprint (Approved)

**Date:** 2026-06-25 · **Status:** Approved, MVP in progress
**Budget:** ₹0–₹300/mo. No paid LLM APIs. Groq (free, OpenAI-compatible) for text, Pollinations.ai (keyless) for images. Provider is env-swappable.

## MVP scope (this iteration) — "Telegram-first content factory"
A cron-triggered Next.js route generates a per-niche promo (AI copy + image + WhatsApp deep link)
and posts it to a **private Telegram channel** the owner controls. Owner copy-pastes winners to
Instagram/YouTube manually while platform permissions (Meta App Review / Google OAuth verification)
are handled in the background. No auto-posting to IG/YT in the MVP.

## Hard constraints discovered in research
- **Vercel Hobby cron = once/day max** → use external **cron-job.org** (free, 1-min granularity, supports
  `Authorization: Bearer` header) to ping the route every 6h.
- **cron-job.org request timeout = 30s** → route should be fast (MVP work is well under 30s).
- **Vercel Hobby** Node fn: 300s max, 2GB/1vCPU, 250MB bundle, **4 CPU-hrs/mo** active CPU.
- **Don't send confidential data to any third-party LLM** → marketing copy only. (Gemini's free tier in India also has a reported `limit:0` provisioning bug → defaulted to Groq instead; provider is swappable via env.)
- **Pollinations** anonymous = 1 req/15s, `nologo` needs a token; fine at 4/day.
- **Video render** is deferred (v2 via GitHub Actions ffmpeg, or image carousel). MVP sends a single image.

## Integrity guardrail (non-negotiable)
Two layers: (1) Gemini **system prompt** forbids contract-cheating framing; (2) a **banned-phrase filter**
rejects any output implying "we do your assignment / submit as your own / guaranteed marks". On violation,
fall back to vetted static copy from `config/promo.js`. Positioning = reference build + source + 1:1
mentorship + viva prep so the **student** learns and defends their own work.

## 6-hour themed rotation (IST)
| Slot | Niche | comment keyword |
|---|---|---|
| 00:00 | Python & AI/Data Science | DATASCIENCE |
| 06:00 | MERN Stack | MERN |
| 12:00 | Java / Spring Boot | SPRING |
| 18:00 | Quantum (Qiskit) | QISKIT |

## Architecture (MVP)
```
cron-job.org (6h, Bearer secret) → GET /api/cron/promo
  → nicheForDate() picks niche by IST hour
  → llm.generateCopy() (Groq/OpenAI-compatible, system rules) → integrity filter → fallback if dirty
  → pollinations.buildImageUrl()+fetchImage()
  → whatsapp.buildPromoMessage()+directLink()  [reuses existing facade + config/site.js]
  → telegram.sendPhoto(channel, image, caption)
  → 200 JSON {ok, niche, postedTo:'telegram'}
```

## Files
- `config/promo.js` — per-niche promo data (keyed by config/site.js service id)
- `lib/promo/integrity.js` — system rules + banned-phrase filter (tested)
- `lib/promo/schedule.js` — IST hour → niche (tested)
- `lib/promo/pollinations.js` — image URL builder (tested) + fetch
- `lib/promo/llm.js` — provider-agnostic copy generation (Groq default) + integrity filter + fallback
- `lib/promo/telegram.js` — sendPhoto/sendMessage
- `lib/promo/captions.js` — compose Telegram caption (tested)
- `lib/whatsapp.js` — add `buildPromoMessage()` (tested)
- `app/api/cron/promo/route.js` — the route
- `.env.example` — CRON_SECRET, LLM_API_KEY/LLM_BASE_URL/LLM_MODEL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, POLLINATIONS_TOKEN

## Env / accounts (MVP)
Groq (LLM_API_KEY — free, no card, OpenAI-compatible) · Telegram @BotFather (TELEGRAM_BOT_TOKEN + channel chat id) ·
cron-job.org (pinger) · Pollinations token (optional, for nologo).

## Deferred (v2/v3)
GitHub Actions ffmpeg video render · YouTube Data API auto-post (after OAuth verification) ·
Instagram Graph API Reels (after Meta App Review + public video host).
