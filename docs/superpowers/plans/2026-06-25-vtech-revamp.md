# V-Tech Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove structural debt and add premium conversion/SEO/UX features to the ByteWork single-page consultancy site, keeping the WhatsApp handoff as the conversion path.

**Architecture:** A single frozen `config/site.js` is the one source of truth; pure logic lives in `lib/` (`pricing`, `whatsapp` Facade); React Server Components render data-driven sections, with `'use client'` isolated to interactive leaves (pricing wizard, scroll-reveal wrapper). Component tree is grouped by responsibility: `layout/`, `sections/`, `pricing/`, `ui/`.

**Tech Stack:** Next.js 16 (App Router), React 19 (React Compiler on), Tailwind CSS v4 (CSS-first), Vitest for unit tests.

## Global Constraints

- **Runtime:** Next 16 needs Node 20+. Default `node` is v14; a working Node is at `/usr/local/bin/node` (v24). Run all npm/node via `PATH="/usr/local/bin:$PATH" …`.
- **No backend:** conversion is a WhatsApp deep link only. No API routes, DB, auth.
- **Tailwind v4 is CSS-first:** theme/utilities live in `app/globals.css` (`@import "tailwindcss"` + `@theme`). Never recreate `tailwind.config.js`.
- **RSC discipline:** components are server components unless they need state/effects/handlers. Add `'use client'` only to interactive leaves.
- **Path alias:** import via `@/…` (maps to repo root).
- **Currency:** Indian Rupees (`₹` / `INR`).
- **Brand/contact (verbatim):** name `Vishnu Vardhan`; brand `V-Tech.Solutions`; WhatsApp `919182407243`; email `ramki3244@gmail.com`; GitHub `ByteCodeSculptor`.

---

## Phase 0 — Environment & Test Harness

### Task 0.1: Install deps, add Vitest, baseline build

**Files:**
- Modify: `package.json` (add `vitest` devDep + `test` script)
- Create: `vitest.config.mjs`

- [ ] Install deps: `PATH="/usr/local/bin:$PATH" npm install`
- [ ] Add Vitest: `PATH="/usr/local/bin:$PATH" npm install -D vitest`
- [ ] Add script `"test": "vitest run"` and `"test:watch": "vitest"` to `package.json`
- [ ] Create `vitest.config.mjs` with `test.environment = 'node'` and resolve alias `@` → repo root
- [ ] Baseline: `PATH="/usr/local/bin:$PATH" npm run build` → expect success (current site builds)
- [ ] Commit: `chore: install deps and add vitest harness`

---

## Phase 1 — Tech Debt & Config Extraction

### Task 1.1: Single source of truth — `config/site.js`

**Files:**
- Create: `config/site.js`

**Produces (consumed by nearly every later task):**
- `contact` `{ name, brand:{name,suffix}, whatsapp, email, github, githubLabel, portfolioUrl }`
- `services[]` `{ id, name, shortName, tech, description, icon, theme, basePrice }` — ids: `quantum|mern|java|python`
- `pricingTiers[]` `{ id, label, maxDays, multiplier, surchargeLabel }` ordered: super-rush(≤3,×1.4), express(≤6,×1.2), standard(≤Infinity,×1.0)
- `addOns[]` `{ id, label, description, price, unit, type:'quantity'|'toggle' }` — extra-docs(₹30/page), research-paper(on request), extra-mentorship(₹500/session), remote-install(from ₹500)
- `deliverables` `{ included:[{title,detail}], limits:[{icon,title,detail}] }`
- `seo` `{ title, description, url, keywords[] }`
- `currency` `{ code:'INR', symbol:'₹' }`

- [ ] Create the module with the shapes above, populated from existing `ServiceCatalog.js`/`PricingCalculator.js`/`Deliverables.js`/`Footer.js` content. `Object.freeze` top-level exports.
- [ ] Verify import resolves: `PATH="/usr/local/bin:$PATH" node --input-type=module -e "import('./config/site.js').then(m=>console.log(Object.keys(m)))"`
- [ ] Commit: `feat(config): add site config as single source of truth`

### Task 1.2: Pure pricing logic — `lib/pricing.js` (TDD)

**Files:**
- Create: `lib/pricing.js`
- Test: `lib/pricing.test.js`

**Produces:**
- `daysBetween(from: Date, to: Date): number` — whole days, `Math.ceil` of ms diff (matches current behavior)
- `resolveTier(diffDays: number, tiers = pricingTiers): tier | null` — `null` when `diffDays < 0`; else first tier with `diffDays <= maxDays`
- `calculateQuote({ basePrice, diffDays, addOnTotal = 0, tiers }): { valid, tier, multiplier, base, surcharge, addOnTotal, total }`

- [ ] **Write failing tests** in `lib/pricing.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { daysBetween, resolveTier, calculateQuote } from '@/lib/pricing';

const d = (s) => new Date(s + 'T00:00:00');

describe('resolveTier', () => {
  it('≤3 days → super-rush ×1.4', () => expect(resolveTier(2).multiplier).toBe(1.4));
  it('4–6 days → express ×1.2', () => expect(resolveTier(5).multiplier).toBe(1.2));
  it('≥7 days → standard ×1.0', () => expect(resolveTier(10).multiplier).toBe(1.0));
  it('boundary: exactly 3 → super-rush', () => expect(resolveTier(3).id).toBe('super-rush'));
  it('boundary: exactly 6 → express', () => expect(resolveTier(6).id).toBe('express'));
  it('negative → null (invalid)', () => expect(resolveTier(-1)).toBeNull());
});

describe('daysBetween', () => {
  it('counts whole days forward', () => expect(daysBetween(d('2026-06-25'), d('2026-06-30'))).toBe(5));
  it('same day → 0', () => expect(daysBetween(d('2026-06-25'), d('2026-06-25'))).toBe(0));
});

describe('calculateQuote', () => {
  it('standard service, no add-ons', () => {
    const q = calculateQuote({ basePrice: 10000, diffDays: 10 });
    expect(q).toMatchObject({ valid: true, multiplier: 1.0, base: 10000, total: 10000 });
  });
  it('super-rush adds 40% then add-ons', () => {
    const q = calculateQuote({ basePrice: 10000, diffDays: 1, addOnTotal: 500 });
    expect(q.total).toBe(14500); // 10000*1.4 + 500
  });
  it('invalid deadline → valid:false, total 0', () => {
    expect(calculateQuote({ basePrice: 10000, diffDays: -2 })).toMatchObject({ valid: false, total: 0 });
  });
});
```

- [ ] Run → FAIL (module missing): `PATH="/usr/local/bin:$PATH" npm test -- pricing`
- [ ] Implement `lib/pricing.js` (pure functions, import `pricingTiers` from `@/config/site` as default)
- [ ] Run → PASS
- [ ] Commit: `feat(lib): pure pricing logic with tests`

### Task 1.3: WhatsApp Facade — `lib/whatsapp.js` (TDD)

**Files:**
- Create: `lib/whatsapp.js`
- Test: `lib/whatsapp.test.js`

**Produces:**
- `buildQuoteMessage({ serviceName, deadline, tierLabel, price, addOnLines = [], name }): string`
- `quoteLink(args, number = contact.whatsapp): string` → `https://wa.me/<number>?text=<encoded>`
- `directLink(text = '', number = contact.whatsapp): string`

- [ ] **Write failing tests** in `lib/whatsapp.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { quoteLink, directLink, buildQuoteMessage } from '@/lib/whatsapp';

describe('whatsapp facade', () => {
  it('quoteLink targets the configured number', () => {
    expect(quoteLink({ serviceName: 'MERN', deadline: '2026-07-01', tierLabel: 'Standard', price: 12000 }))
      .toMatch(/^https:\/\/wa\.me\/919182407243\?text=/);
  });
  it('quoteLink encodes service name and price into the message', () => {
    const url = quoteLink({ serviceName: 'Java Architecture', deadline: '2026-07-01', tierLabel: 'Standard', price: 12000 });
    const text = decodeURIComponent(url.split('text=')[1]);
    expect(text).toContain('Java Architecture');
    expect(text).toContain('12000');
  });
  it('directLink encodes arbitrary text', () => {
    expect(directLink('hello world')).toBe('https://wa.me/919182407243?text=hello%20world');
  });
  it('buildQuoteMessage lists add-ons', () => {
    const msg = buildQuoteMessage({ serviceName: 'X', deadline: 'd', tierLabel: 't', price: 1, addOnLines: ['Extra docs x5'] });
    expect(msg).toContain('Extra docs x5');
  });
});
```

- [ ] Run → FAIL
- [ ] Implement `lib/whatsapp.js` (Facade; import `contact` from `@/config/site`)
- [ ] Run → PASS
- [ ] Commit: `feat(lib): whatsapp deep-link facade with tests`

### Task 1.4: Rewire existing components to config; delete dead config files

**Files:**
- Modify: `app/components/Footer.js`, `app/components/Navbar.js`, `app/components/ServiceCatalog.js`, `app/components/PricingCalculator.js`
- Delete: `utils/pricingLogic.js`, `tailwind.config.js` (and empty `utils/`)

- [ ] `Footer.js`: read name/email/github/whatsapp/services from `@/config/site`; fix `Your Vishnu Vardhan` → `contact.name`.
- [ ] `Navbar.js`: brand from `contact.brand`; WhatsApp/quote target from config.
- [ ] `ServiceCatalog.js`: replace inline array with `import { services }`.
- [ ] `PricingCalculator.js`: replace inline array with `import { services }`; route math through `@/lib/pricing` and link through `@/lib/whatsapp` (full wizard replacement comes in Phase 3 — this is interim de-duplication).
- [ ] Delete `utils/pricingLogic.js` and `tailwind.config.js`.
- [ ] Verify: `PATH="/usr/local/bin:$PATH" npm run build` → success; `npm test` → green.
- [ ] Commit: `refactor: source business data from config; drop dead config files`

---

## Phase 2 — Structural Refactoring

### Task 2.1: `app/components/ui/Section.js`
**Files:** Create `app/components/ui/Section.js`
**Produces:** `<Section id className background>` server component — standard `max-w-*`, responsive padding, optional anchor `id`.
- [ ] Implement; build; commit `feat(ui): shared Section wrapper`.

### Task 2.2: `app/components/ui/ServiceCard.js` (extract)
**Files:** Create `app/components/ui/ServiceCard.js`
**Consumes:** one `services[]` item. **Produces:** `<ServiceCard service />` presentational card (theme→Tailwind class map for `purple|blue|red|green`).
- [ ] Extract card markup from current `ServiceCatalog.js`; build; commit `feat(ui): extract ServiceCard`.

### Task 2.3: `app/components/sections/Hero.js` (implement stub)
**Files:** Create `app/components/sections/Hero.js`; Modify `app/page.js`
- [ ] Move inline hero JSX out of `page.js` into `Hero.js`; fix dead "View Services" button → `<a href="#services">`; "Get Quote"/primary CTA → `<a href="#pricing">`.
- [ ] Build; commit `refactor(hero): extract Hero section, fix dead CTA`.

### Task 2.4: Move Navbar/Footer to `layout/`, de-client Navbar
**Files:** Move `Navbar.js`→`app/components/layout/Navbar.js`, `Footer.js`→`app/components/layout/Footer.js`; Modify `app/page.js` imports
- [ ] Convert Navbar scroll button to `<a href="#pricing">` + rely on CSS `scroll-behavior` (Phase 4) → **remove `'use client'`** from Navbar.
- [ ] Build; commit `refactor(layout): group nav/footer, make Navbar a server component`.

### Task 2.5: ServiceCatalog → `sections/`, data-driven
**Files:** Move `ServiceCatalog.js`→`app/components/sections/ServiceCatalog.js`; Modify
- [ ] Render `services.map(s => <ServiceCard service={s} />)`; add `id="services"`.
- [ ] Build; commit `refactor(catalog): render via ServiceCard from config`.

### Task 2.6: Slim `page.js`; delete ContactModal
**Files:** Modify `app/page.js`; Move `Deliverables.js`→`app/components/sections/Deliverables.js`; Delete `app/components/ContactModal.js`
- [ ] `page.js` becomes ordered composition of `<Navbar/> <Hero/> <ServiceCatalog/> <Deliverables/> <PricingSection/> <Footer/>` (PricingSection lands in Phase 3; keep current calculator section until then).
- [ ] `Deliverables.js` reads `deliverables` + `addOns` from config.
- [ ] Build; commit `refactor: thin composition root; remove unused ContactModal`.

---

## Phase 3 — Feature Additions (Conversion + SEO)

### Task 3.1: `usePricingWizard` reducer (TDD)
**Files:** Create `app/components/pricing/usePricingWizard.js`; Test `app/components/pricing/usePricingWizard.test.js`
**Produces:** `wizardReducer(state, action)` (pure, exported) + `usePricingWizard()` hook.
- State: `{ step, serviceId, deadline, addOns: { [id]: number } }`. Actions: `NEXT|BACK|SET_SERVICE|SET_DEADLINE|SET_ADDON|RESET`. `NEXT` clamps to last step; `BACK` clamps to 0.
- [ ] Tests for: NEXT/BACK clamping, SET_SERVICE, SET_DEADLINE, SET_ADDON quantity set, RESET.
- [ ] Run FAIL → implement reducer (+ thin hook wrapping `useReducer`) → run PASS.
- [ ] Commit `feat(pricing): wizard reducer with tests`.

### Task 3.2: Wizard UI
**Files:** Create `app/components/pricing/steps/StepService.js`, `StepDeadline.js`, `StepAddOns.js`, `StepReview.js`, `app/components/pricing/PriceSummary.js`, `app/components/pricing/PricingWizard.js` (`'use client'`)
- Steps (tunable, default 4): Service → Timeline (live tier via `lib/pricing`) → Add-ons (from `config.addOns`) → Review (calls `quoteLink`). `PriceSummary` shows live breakdown; min-date guard preserved from current calculator.
- [ ] Implement; build; commit `feat(pricing): multi-step wizard UI`.

### Task 3.3: PricingSection; swap in; delete calculator
**Files:** Create `app/components/sections/PricingSection.js`; Modify `app/page.js`; Delete `app/components/PricingCalculator.js`
- [ ] `PricingSection` (`id="pricing"`) wraps `PricingWizard`; replace old section in `page.js`; delete `PricingCalculator.js`.
- [ ] Build; commit `feat(pricing): ship wizard, remove old calculator`.

### Task 3.4: SEO — metadata + JSON-LD
**Files:** Modify `app/layout.js`
- [ ] Replace default metadata with Metadata API from `config.seo` (title, description, keywords, `metadataBase`, `openGraph`, `twitter`). **Decision pending:** `metadataBase` = Vercel preview URL vs custom domain (default to `contact.portfolioUrl`).
- [ ] Inject JSON-LD `ProfessionalService` + `founder` Person + `makesOffer`→`OfferCatalog` of `services` (priceCurrency INR) via a `<script type="application/ld+json">`.
- [ ] Build; commit `feat(seo): metadata, OpenGraph, JSON-LD`.

### Task 3.5 (optional): Dynamic OG image
**Files:** Create `app/opengraph-image.js` (next/og `ImageResponse`)
- [ ] Implement; build; commit `feat(seo): dynamic OpenGraph image`. *(Skip if time-boxed.)*

---

## Phase 4 — UI/UX Polish

### Task 4.1: `globals.css`
**Files:** Modify `app/globals.css`
- [ ] `body` font → Geist (`var(--font-geist-sans)`), not Arial. Add `html { scroll-behavior: smooth }`. Add reveal keyframes + `@media (prefers-reduced-motion: reduce)` disabling them. Resolve dead dark-mode vars (remove for now unless dark mode is wanted).
- [ ] Build; commit `style: fix body font, smooth scroll, motion-safe reveals`.

### Task 4.2: `useInView` + `Reveal`
**Files:** Create `lib/hooks/useInView.js` (+ `lib/hooks/useInView.test.js` if feasible in node env), `app/components/ui/Reveal.js` (`'use client'`)
- [ ] IntersectionObserver hook returning `[ref, inView]`; `Reveal` applies entry animation when in view, respects reduced-motion.
- [ ] Build; commit `feat(ui): scroll-reveal primitive`.

### Task 4.3: Apply reveals + a11y/responsive audit
**Files:** Modify `sections/*`
- [ ] Wrap section contents in `<Reveal>`; verify focus rings, `aria` labels, mobile layout.
- [ ] Build; commit `polish: scroll reveals + a11y/responsive pass`.

### Task 4.4: Footer socials + final verification
**Files:** Modify `app/components/layout/Footer.js`
- [ ] Confirm live socials from config; final `npm run build` + `npm run lint` + `npm test` all green.
- [ ] Commit `polish: footer socials; final verification`.

---

## Self-Review Notes

- **Spec coverage:** dedup (1.1/1.4), config centralization (1.1), stub resolution (Hero 2.3, ServiceCard 2.2, ContactModal del 2.6, pricingLogic del 1.4, tailwind.config del 1.4), Facade (1.3), Flyweight-intent (1.1+2.2/2.5), hero extraction (2.3), multi-step wizard (3.1–3.3), SEO/JSON-LD (3.4/3.5), animations+smooth scroll+responsive (4.1–4.3). All covered.
- **TDD scope:** real unit tests for pure logic (`pricing`, `whatsapp`, wizard reducer); presentational/JSX verified by `npm run build` + `npm run lint` + manual check — not forced unit tests.
- **Open decision:** `metadataBase` URL (Task 3.4).
