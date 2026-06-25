# Instagram Reels Auto-Post (Phase 3)

Publishes each rendered Short to Instagram **Reels** via the Graph Content
Publishing API, from the same render workflow (after Telegram + YouTube).

## How it works
Meta does **not** accept a file upload — it **fetches the Reel from a public URL**.
So the workflow hosts `out.mp4` as a **transient public GitHub Release asset**
(the repo is public), runs the 3-step publish (container → poll → publish), then
**deletes the release**. The step skips entirely if the IG secrets aren't set.

## Prerequisites (the heavy part — start early)
1. **Instagram Business account linked to a Facebook Page** (from the launch kit — *not* a Creator/personal account).
2. **Meta app** (developers.facebook.com → Create App → Business) with the **Instagram** product added.
3. **App Review** for permissions `instagram_business_basic` + `instagram_business_content_publish` — requires a screencast and takes **~2–4 weeks**. Until approved, publishing only works for app roles (you) in dev mode.

## Get the two credentials
- **`IG_USER_ID`** — your Instagram Business account id. Via Graph API Explorer: `GET /me/accounts` → your Page → `GET /{page-id}?fields=instagram_business_account`.
- **`IG_ACCESS_TOKEN`** — a **long-lived** (60-day) access token: get a short-lived token in Graph API Explorer (with the two permissions), then exchange it for a long-lived one. ⚠️ **It expires in 60 days** — refresh it before then (a refresh job can be automated later).

## Wire it up (GitHub Actions secrets)
Repo → Settings → Secrets and variables → Actions:
- `IG_USER_ID`
- `IG_ACCESS_TOKEN`

Optional repo **variable** `IG_GRAPH_VERSION` (default `v21.0`).

> The render workflow already has `contents: write` permission so it can create
> and delete the transient Release used to host the Reel. The public repo makes
> that asset URL fetchable by Meta — no extra file host needed.

## Limits / notes
- Rate limit: ~100 API-published posts / 24h (we post 4). Reels must be 9:16, 3–90s, H.264 — our render fits.
- Caption is reused from the promo (≤2200 chars); it includes the `wa.me` link.
- Like the other channels, the step is **dormant until the secrets exist** — render + Telegram + YouTube keep working without it.
