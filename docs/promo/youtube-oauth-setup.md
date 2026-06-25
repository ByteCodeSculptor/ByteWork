# YouTube OAuth Setup (Phase 2b prep)

A one-time setup to get **three credentials** the agent will use to upload Shorts
unattended: `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`.

## Before you start
- The **ByteWork YouTube Brand channel must already exist** (see the launch kit).
- Use the **Google account that owns that channel** for every step below.

## Read first — two gotchas the steps defuse
- Scope used: `https://www.googleapis.com/auth/youtube.upload` (a **sensitive** scope).
- Quota: 10,000 units/day; each upload ≈ **1,600** ⇒ ~6/day max (we post 4 — fine).
1. **An app left in "Testing" mode kills its refresh token after 7 days** → the cron breaks weekly. Fix: **publish the app to Production** (Step 3).
2. **Unverified apps can only upload as `private`/`unlisted`.** To auto-post **public** Shorts you must finish Google's (free) **OAuth verification** (Step 4). `youtube.upload` is *sensitive*, so it needs review but **not** a paid security assessment. Until verified, post as **unlisted** and flip to public by hand — still a huge time-saver.

## Step 1 — Create a Google Cloud project
console.cloud.google.com → new project, e.g. **ByteWork**.

## Step 2 — Enable the API
APIs & Services → **Library** → "YouTube Data API v3" → **Enable**.

## Step 3 — OAuth consent screen
APIs & Services → **OAuth consent screen**:
- User type: **External** → Create.
- App name **ByteWork**, your support email + developer email.
- **Scopes** → Add → filter "YouTube Data API v3" → add `.../auth/youtube.upload`.
- Add your own Google account under **Test users**.
- **Publish app** → confirm "Push to production." *(This removes the 7-day refresh-token expiry — do it even before verification.)*

## Step 4 — (For PUBLIC posting) submit for verification
On the same consent screen, submit for verification. Sensitive scope ⇒ Google review (days–weeks), no paid audit. **Until approved, upload as `unlisted`** (Phase 2b defaults to that; one flag flips to `public` once verified).

## Step 5 — Create OAuth client credentials
APIs & Services → **Credentials** → Create credentials → **OAuth client ID**:
- Application type: **Web application**.
- **Authorized redirect URIs** → add: `https://developers.google.com/oauthplayground`
- Create → copy the **Client ID** and **Client secret**.

## Step 6 — Mint the refresh token (no code, via OAuth Playground)
1. Open **developers.google.com/oauthplayground**.
2. Gear ⚙ (top-right) → check **"Use your own OAuth credentials"** → paste Client ID + Secret.
3. Left panel → "Input your own scopes" → enter `https://www.googleapis.com/auth/youtube.upload` → **Authorize APIs**.
4. Sign in with the **channel's** Google account → Allow (click through the "unverified app" warning — it's your own app).
5. Step 2 → **Exchange authorization code for tokens**.
6. Copy the **Refresh token** (starts with `1//`). That's the durable credential.
   - If no refresh token appears: revoke the app at myaccount.google.com/permissions and retry (a refresh token is only issued on first consent).

## Step 7 — Store the three values (do NOT paste them in chat)
Set these as **GitHub Actions secrets** — Repo → Settings → Secrets and variables → Actions.
(The render workflow performs the upload, so they live with GitHub, not Vercel.)
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_REFRESH_TOKEN`

Optional repo **variable** (Actions → Variables tab): `YT_PRIVACY` = `unlisted` (default) →
switch to `public` once your app is verified.

## What Phase 2b will build on top of this
- Exchange `refresh_token → access_token` each run (no user interaction).
- `videos.insert` (resumable upload) of the rendered MP4 from Phase 2a:
  - title + `#Shorts`, description containing the `wa.me/919182407243` link,
  - `privacyStatus: unlisted` (switch to `public` after verification).
- ~1,600 quota units/upload; 4/day ≪ the 10,000/day limit.
