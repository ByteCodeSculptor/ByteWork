/**
 * Pure helpers for the YouTube Shorts upload. Used by scripts/youtube-upload.mjs
 * (which runs inside the GitHub Actions render). Intentionally has NO app/config
 * imports so plain Node in CI can load it via a relative path. `.mjs` so Node
 * treats it as ESM without a package "type".
 */

/** YouTube title from the hook (kept under the 100-char limit, incl. #Shorts). */
export function buildTitle(hook) {
  const base = (hook || 'ByteWork').trim().slice(0, 90).trimEnd();
  return `${base} #Shorts`;
}

/** YouTube description from the Telegram caption (kept well under 5000 chars). */
export function buildDescription(caption) {
  return `${(caption || '').trim()}\n\n#Shorts #finalyearproject`.slice(0, 4900);
}

/** A videos.insert resource (snippet + status). */
export function buildVideoMetadata({ title, description, privacy = 'unlisted' }) {
  const allowed = ['public', 'unlisted', 'private'];
  return {
    snippet: {
      title: (title || 'ByteWork Short').slice(0, 100),
      description: (description || '').slice(0, 4900),
      categoryId: '28', // Science & Technology
      tags: ['Shorts', 'finalyearproject', 'coding'],
    },
    status: {
      privacyStatus: allowed.includes(privacy) ? privacy : 'unlisted',
      selfDeclaredMadeForKids: false,
    },
  };
}
