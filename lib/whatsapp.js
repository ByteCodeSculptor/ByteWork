import { contact, currency } from '@/config/site';

/**
 * WhatsApp deep-link Facade.
 *
 * Hides the wa.me URL shape, the business phone number, message templating, and
 * URL encoding behind a tiny surface. No component should ever build a wa.me
 * URL or encode a message by hand — call `quoteLink` / `directLink` instead.
 */

/** Compose the human-readable quote message sent to WhatsApp. */
export function buildQuoteMessage({ serviceName, deadline, tierLabel, price, addOnLines = [], name }) {
  const lines = [
    name ? `Hello, this is ${name}.` : 'Hello!',
    `I'd like to book the *${serviceName}* service.`,
    `📅 Deadline: ${deadline}`,
    `🚀 Urgency: ${tierLabel}`,
  ];
  if (addOnLines.length > 0) {
    lines.push(`➕ Add-ons: ${addOnLines.join(', ')}`);
  }
  lines.push(`💰 Estimated quote: ${currency.symbol}${price}`);
  lines.push('Please confirm and I will proceed with the booking.');
  return lines.join('\n');
}

/** Build a wa.me link to the business number with arbitrary pre-filled text. */
export function directLink(text = '', number = contact.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Build a wa.me link pre-filled with a formatted quote message. */
export function quoteLink(args, number = contact.whatsapp) {
  return directLink(buildQuoteMessage(args), number);
}
