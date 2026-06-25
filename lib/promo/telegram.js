const api = (token, method) => `https://api.telegram.org/bot${token}/${method}`;

/** Send a plain text message to a Telegram chat/channel. */
export async function sendMessage({ botToken, chatId, text }) {
  const res = await fetch(api(botToken, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: false }),
  });
  if (!res.ok) throw new Error(`Telegram sendMessage ${res.status}: ${await res.text()}`);
  return res.json();
}

/** Upload a photo (as bytes) with a caption to a Telegram chat/channel. */
export async function sendPhoto({ botToken, chatId, imageBuffer, caption }) {
  const form = new FormData();
  form.set('chat_id', String(chatId));
  if (caption) form.set('caption', caption);
  form.set('photo', new Blob([imageBuffer], { type: 'image/jpeg' }), 'promo.jpg');

  const res = await fetch(api(botToken, 'sendPhoto'), { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Telegram sendPhoto ${res.status}: ${await res.text()}`);
  return res.json();
}
