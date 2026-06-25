/**
 * Compose the Telegram message caption from generated copy + the WhatsApp link.
 * Telegram photo captions cap at 1024 chars, so we truncate defensively.
 */
export function composeCaption({ copy, promo, waLink, maxLen = 1024 }) {
  const tags = (copy?.hashtags?.length ? copy.hashtags : promo.hashtags).slice(0, 5).join(' ');
  const text = [
    copy.hook,
    '',
    copy.caption,
    '',
    `💬 Chat on WhatsApp: ${waLink}`,
    `🔑 Comment "${promo.commentKeyword}" for the reference build + mentorship.`,
    '',
    tags,
  ]
    .filter((line) => line !== undefined && line !== null)
    .join('\n');

  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}
