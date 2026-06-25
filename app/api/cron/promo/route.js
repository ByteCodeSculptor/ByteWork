import { services } from '@/config/site';
import { promos, promoSettings } from '@/config/promo';
import { nicheForDate } from '@/lib/promo/schedule';
import { generateCopy } from '@/lib/promo/gemini';
import { buildImageUrl, fetchImage } from '@/lib/promo/pollinations';
import { composeCaption } from '@/lib/promo/captions';
import { buildPromoMessage, directLink } from '@/lib/whatsapp';
import { sendPhoto } from '@/lib/promo/telegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Promo agent (MVP) — pinged every 6h by cron-job.org.
 * Picks the niche for the current IST window, generates integrity-gated copy +
 * a 9:16 image + a pre-filled WhatsApp link, and posts it to a private Telegram
 * channel for manual review/cross-posting. Auto-posting to IG/YT is a later phase.
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get('authorization');
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  try {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    }

    const now = new Date();
    const nicheId = nicheForDate(now, {
      promos,
      tzOffsetMinutes: promoSettings.tzOffsetMinutes,
      windowHours: promoSettings.windowHours,
    });
    const promo = promos.find((p) => p.id === nicheId);
    const service = services.find((s) => s.id === nicheId);

    // 1. Integrity-gated AI copy (falls back to vetted static copy on any issue)
    const copy = await generateCopy({ promo, service, apiKey: process.env.GEMINI_API_KEY });

    // 2. Keyless 9:16 image; seed varies per run for visual variety
    const imageUrl = buildImageUrl(promo.imageSubject, {
      seed: Math.floor(now.getTime() / 1000) % 1_000_000,
      token: process.env.POLLINATIONS_TOKEN,
    });
    const imageBuffer = await fetchImage(imageUrl, { token: process.env.POLLINATIONS_TOKEN });

    // 3. Pre-filled WhatsApp deep link (reuses the existing facade + config number)
    const waLink = directLink(
      buildPromoMessage({ message: promo.waMessage, serviceName: service.name, keyword: promo.commentKeyword })
    );

    // 4. Post to the private Telegram channel
    const caption = composeCaption({ copy, promo, waLink });
    await sendPhoto({
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
      imageBuffer,
      caption,
    });

    return Response.json({ ok: true, niche: nicheId, copySource: copy.source, postedTo: 'telegram' });
  } catch (err) {
    return Response.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
