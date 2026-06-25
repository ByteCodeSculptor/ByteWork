// Uploads a rendered Short to YouTube via Data API v3 (resumable upload).
// Run by the GitHub Actions render workflow: `node scripts/youtube-upload.mjs out.mp4`
// Reads creds + copy from env (GitHub Actions secrets / job env).
import { readFileSync, statSync } from 'node:fs';
import { buildTitle, buildDescription, buildVideoMetadata } from '../lib/promo/youtube.mjs';

const FILE = process.argv[2] || 'out.mp4';

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`token exchange ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (!json.access_token) throw new Error('no access_token in token response');
  return json.access_token;
}

async function upload() {
  if (!process.env.YOUTUBE_REFRESH_TOKEN) {
    console.log('YOUTUBE_REFRESH_TOKEN not set — skipping YouTube upload.');
    return;
  }

  const meta = buildVideoMetadata({
    title: buildTitle(process.env.HOOK),
    description: buildDescription(process.env.CAPTION),
    privacy: process.env.YT_PRIVACY || 'unlisted',
  });
  const size = statSync(FILE).size;
  const token = await getAccessToken();

  // 1) Start a resumable upload session (metadata only).
  const session = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': String(size),
      },
      body: JSON.stringify(meta),
    }
  );
  if (!session.ok) throw new Error(`start session ${session.status}: ${await session.text()}`);
  const uploadUrl = session.headers.get('location');
  if (!uploadUrl) throw new Error('no resumable upload URL returned');

  // 2) Upload the bytes.
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(size) },
    body: readFileSync(FILE),
  });
  if (!put.ok) throw new Error(`upload ${put.status}: ${await put.text()}`);
  const data = await put.json();
  console.log(`Uploaded to YouTube: https://youtu.be/${data.id} (privacy: ${meta.status.privacyStatus})`);
}

upload().catch((err) => {
  console.error(`YouTube upload failed: ${err.message}`);
  process.exit(1);
});
