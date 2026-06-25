# Promo Video Render (Phase 2a)

Turns each promo into a 9:16 Short (Ken-Burns motion over the image + an
auto-wrapped caption) on GitHub Actions' free runners, then posts it to your
Telegram channel. The Vercel route only *dispatches* the job — **no Vercel CPU
is spent rendering**.

## Flow
```
cron-job.org → /api/cron/promo  (generates copy + image + caption)
            → repository_dispatch → .github/workflows/promo-render.yml
            → ffmpeg render (1080×1920 MP4) → Telegram sendVideo (+ artifact)
```

## Enable it
1. **Vercel env vars** (Project → Settings → Environment Variables):
   - `GH_DISPATCH_TOKEN` = a **fine-grained GitHub PAT** scoped to the **ByteWork**
     repo with **Contents: Read and write** (required for `repository_dispatch`).
   - `GH_REPO` = `ByteCodeSculptor/ByteWork`

   With both set, the route switches to **video mode** automatically. Unset either
   one to revert to **image mode** (static image straight to Telegram).
2. **GitHub Actions secrets** (Repo → Settings → Secrets and variables → Actions):
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — the workflow uses these to post the video.

## Test it in isolation (no Vercel, no Telegram needed)
- GitHub → **Actions → promo-render → Run workflow** (uses default test inputs), or
  `gh workflow run promo-render.yml -f hook="Test hook" -f image_url="<url>"`.
- Every run uploads the MP4 as a downloadable **artifact**, even when Telegram
  secrets are absent — so you can verify the render before wiring delivery.

## Tuning
- Duration/zoom: the `-t 10` and `zoompan` expression in the workflow.
- Caption look: the ImageMagick `caption:` step (font size, stroke, width).
- The render is silent (a null audio track is added so platforms accept it).
