/**
 * Pure helpers for Instagram Reels publishing via the Graph Content Publishing API.
 * Used by scripts/instagram-upload.mjs (runs in GitHub Actions). No app imports.
 */

export function graphBase(version = 'v21.0') {
  return `https://graph.facebook.com/${version}`;
}

/** Public GitHub Release asset URL — Meta fetches the Reel from here. */
export function releaseAssetUrl(repo, tag, asset) {
  return `https://github.com/${repo}/releases/download/${tag}/${asset}`;
}

/** Params for the REELS media-container create call. */
export function buildContainerParams({ videoUrl, caption = '', accessToken }) {
  return {
    media_type: 'REELS',
    video_url: videoUrl,
    caption: caption.slice(0, 2200), // Instagram caption limit
    access_token: accessToken,
  };
}

/** Container status_code values that end polling. */
export function isTerminalStatus(code) {
  return ['FINISHED', 'ERROR', 'EXPIRED'].includes(code);
}
