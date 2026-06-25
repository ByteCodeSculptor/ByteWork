# ByteWork — Social Launch Kit

Public brand: **ByteWork**. Founder/person: **Vishnu Vardhan**. WhatsApp CTA: `wa.me/919182407243`.
Site brand mark: `/brand/icon.svg` (indigo square + `</>`), matching the navbar.

## 1. Handles (grab the SAME string everywhere)
First choice: **`bytework`**. If taken, use the same fallback on *all* platforms for consistency:
`bytework.dev` · `byteworkprojects` · `getbytework` · `bytework.in`

- YouTube: `@ByteWork` (or the chosen fallback)
- Instagram: `@bytework` (or the chosen fallback)
- Keep GitHub (`ByteCodeSculptor`) + portfolio linked from bios too.

## 2. Account setup — do it automation-ready
**Instagram (must be Business, not Creator):**
1. Create a **Facebook Page** named ByteWork.
2. Create the Instagram account → Settings → **switch to Professional → Business**.
3. **Link the Instagram Business account to the Facebook Page.**
   *(This exact combo is required later for Reels API publishing AND comment-to-DM automation. Creator/personal accounts can't publish via the API.)*

**YouTube (Brand Account):**
1. Create the channel as a **Brand Account** (not your personal-name channel) under **the Google account you'll use for the auto-post OAuth app**.
2. **Verify your phone number** (unlocks uploads/custom thumbnails).

## 3. Bios (copy-paste)
**Instagram** (≤150 chars):
> Final-year project mentorship 💻 Quantum·MERN·SpringBoot·Python/AI | reference build + source + 1:1 viva prep | DM 'PROJECT' 👇

Link field → `https://wa.me/919182407243`

**YouTube — About / channel description:**
> ByteWork helps final-year engineering students learn and ship their projects — reference builds, clean source code, and 1:1 mentorship so you can confidently defend your own viva. Domains: Quantum Computing (Qiskit), MERN, Java/Spring Boot, Python & AI/Data Science.
> 📲 Chat on WhatsApp: https://wa.me/919182407243

## 4. Profile picture + banner
- **Official mark (recommended):** `/brand/icon.svg` — export to a 512×512 PNG for the profile pic (matches the site exactly, no watermark). Any SVG→PNG converter works.
- **AI concepts (optional, watermarked unless you add a free `POLLINATIONS_TOKEN`):**
  - Logo: `https://image.pollinations.ai/prompt/minimalist%20app%20icon%20for%20a%20software%20developer%20brand%2C%20indigo%20and%20white%2C%20abstract%20angle-bracket%20code%20symbol%2C%20flat%20vector%2C%20centered?width=1024&height=1024&model=flux&seed=11`
  - YT banner: `https://image.pollinations.ai/prompt/tech%20youtube%20banner%2C%20indigo%20gradient%2C%20abstract%20circuit%20and%20code%20motifs%2C%20clean%2C%20wide?width=1456&height=816&model=flux&seed=22`

## 5. Comment-to-DM keywords (match the promo agent)
Use these in captions so the (later) comment-to-DM automation lines up with `config/promo.js`:
`DATASCIENCE` (Python/AI) · `MERN` · `SPRING` (Java) · `QISKIT` (Quantum)

## 6. Seeding plan (don't launch empty)
Empty accounts convert poorly. Activate the **Telegram MVP** first → it produces ready posts → manually post **3–5** to fill the grid/Shorts shelf → *then* turn on full automation.

## 7. Once handles are live
Tell me the final handles and I'll add a `socials` block to `config/site.js` and wire the footer links (kept out for now to avoid dead links to non-existent accounts).
