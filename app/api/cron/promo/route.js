import { services } from '@/config/site';
import { promos, promoSettings } from '@/config/promo';
import { nicheForDate } from '@/lib/promo/schedule';
import { generateCopy } from '@/lib/promo/llm';
import { buildImageUrl, fetchImage } from '@/lib/promo/pollinations';
import { composeCaption } from '@/lib/promo/captions';
import { buildPromoMessage, directLink } from '@/lib/whatsapp';
import { sendPhoto } from '@/lib/promo/telegram';
import { dispatchRender } from '@/lib/promo/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Promo agent — pinged every 6h by cron-job.org.
 * Picks the niche for the current IST window and generates integrity-gated copy
 * + a 9:16 image + a pre-filled WhatsApp link.
 *
 * Output mode (auto-detected):
 *  - VIDEO  (GH_DISPATCH_TOKEN + GH_REPO set): dispatches a GitHub Actions render
 *    that builds a 9:16 Short and posts it to Telegram.
 *  - IMAGE  (Telegram env set): posts the static image to Telegram directly.
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get('authorization');
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  try {
    const useRender = Boolean(process.env.GH_DISPATCH_TOKEN && process.env.GH_REPO);
    const hasTelegram = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
    if (!useRender && !hasTelegram) {
      throw new Error('Configure GH_DISPATCH_TOKEN+GH_REPO (video) or TELEGRAM_BOT_TOKEN+TELEGRAM_CHAT_ID (image)');
    }

    const now = new Date();
    const nicheId = nicheForDate(now, {
      promos,
      tzOffsetMinutes: promoSettings.tzOffsetMinutes,
      windowHours: promoSettings.windowHours,
    });
    const promo = promos.find((p) => p.id === nicheId);
    const service = services.find((s) => s.id === nicheId);

    // Integrity-gated copy + keyless image URL + pre-filled WhatsApp link
    const copy = await generateCopy({ promo, service });
    const imageUrl = buildImageUrl(promo.imageSubject, {
      seed: Math.floor(now.getTime() / 1000) % 1_000_000,
      token: process.env.POLLINATIONS_TOKEN,
    });
    const waLink = directLink(
      buildPromoMessage({ message: promo.waMessage, serviceName: service.name, keyword: promo.commentKeyword })
    );
    const caption = composeCaption({ copy, promo, waLink });

    // VIDEO mode: hand off to GitHub Actions (renders 9:16 Short → Telegram)
    if (useRender) {
      await dispatchRender({
        token: process.env.GH_DISPATCH_TOKEN,
        repo: process.env.GH_REPO,
        payload: { niche: nicheId, image_url: imageUrl, hook: copy.hook, caption },
      });
      return Response.json({ ok: true, niche: nicheId, copySource: copy.source, postedTo: 'github-actions' });
    }

    // IMAGE mode: post the static image straight to Telegram
    const imageBuffer = await fetchImage(imageUrl, { token: process.env.POLLINATIONS_TOKEN });
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
