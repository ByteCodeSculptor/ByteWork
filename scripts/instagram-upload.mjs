// Publishes a rendered Reel to Instagram via the Graph Content Publishing API.
// Run by the render workflow: `node scripts/instagram-upload.mjs <public_video_url>`
// Meta FETCHES the video from the public URL (no binary upload), so the workflow
// hosts out.mp4 as a transient public GitHub Release asset first.
import { graphBase, buildContainerParams, isTerminalStatus } from '../lib/promo/instagram.mjs';

const videoUrl = process.argv[2];
const IG_USER_ID = process.env.IG_USER_ID;
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const VERSION = process.env.IG_GRAPH_VERSION || 'v21.0';
const CAPTION = process.env.CAPTION || '';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function publish() {
  if (!IG_ACCESS_TOKEN || !IG_USER_ID) {
    console.log('IG_ACCESS_TOKEN / IG_USER_ID not set — skipping Instagram upload.');
    return;
  }
  if (!videoUrl) throw new Error('no public video URL provided');

  const base = graphBase(VERSION);

  // 1) Create the REELS media container (Meta fetches video_url asynchronously).
  const createRes = await fetch(`${base}/${IG_USER_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(buildContainerParams({ videoUrl, caption: CAPTION, accessToken: IG_ACCESS_TOKEN })),
  });
  if (!createRes.ok) throw new Error(`create container ${createRes.status}: ${await createRes.text()}`);
  const creationId = (await createRes.json()).id;
  if (!creationId) throw new Error('no creation_id returned');

  // 2) Poll until the container finishes processing (Reels take time).
  let status = 'IN_PROGRESS';
  for (let i = 0; i < 20 && !isTerminalStatus(status); i++) {
    await sleep(15000);
    const stRes = await fetch(
      `${base}/${creationId}?fields=status_code&access_token=${encodeURIComponent(IG_ACCESS_TOKEN)}`
    );
    status = (await stRes.json()).status_code || 'IN_PROGRESS';
    console.log(`container status: ${status}`);
  }
  if (status !== 'FINISHED') throw new Error(`container not ready (status: ${status})`);

  // 3) Publish the container.
  const pubRes = await fetch(`${base}/${IG_USER_ID}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: creationId, access_token: IG_ACCESS_TOKEN }),
  });
  if (!pubRes.ok) throw new Error(`publish ${pubRes.status}: ${await pubRes.text()}`);
  console.log(`Published Reel: ${(await pubRes.json()).id}`);
}

publish().catch((err) => {
  console.error(`Instagram upload failed: ${err.message}`);
  process.exit(1);
});
