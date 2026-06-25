# V-Tech Revamp — Design Spec

**Date:** 2026-06-25
**Status:** Approved
**Repo:** ByteWork (Next.js 16 / React 19 / Tailwind v4)

## Overview

Revamp a single-route freelance-consultancy marketing site to remove structural debt
and add premium, high-converting features. Conversion stays a WhatsApp handoff (no backend).

## Current-State Analysis (debt being addressed)

- **Duplicated service data:** `ServiceCatalog.js` (titles/descriptions/icons) and
  `PricingCalculator.js` (ids/names/`basePrice`) hold two unsynced arrays with mismatched IDs.
- **Scattered hardcoded business data:** WhatsApp `919182407243` in `PricingCalculator.js` and
  `Footer.js`; email, GitHub, prices spread across `Footer.js` and `Deliverables.js`.
- **Empty stubs:** `Hero.js`, `ServiceCard.js`, `ContactModal.js`, `utils/pricingLogic.js`,
  `tailwind.config.js` (all 0 bytes).
- **Inline hero** in `page.js` (not a clean composition root).
- **Unoptimized RSC boundaries:** `Navbar` is a client component only to call `window.scrollTo`.
- **Cosmetic bugs:** `layout.js` metadata still "Create Next App"; Footer "Your Vishnu Vardhan";
  `globals.css` sets `font-family: Arial` despite loading Geist and defines dead dark-mode vars;
  hero "View Services" button has no handler.

## Prerequisite (Phase 0)

Default `node` is v14.21.3; Next 16 needs Node 20+. Switch (e.g. `nvm use 20`) before build/run.

## Architectural Decisions

1. **Facade for WhatsApp** (`lib/whatsapp.js`) — hides number, message templating, encoding,
   `wa.me` format behind `quoteLink({...})` / `directLink()`. Strong fit.
2. **Flyweight intent, idiomatic form** — a frozen `config/site.js` is the shared-descriptor
   "factory"; service objects are shared by reference across catalog, wizard, footer, JSON-LD.
   `ServiceCard` holds only extrinsic state. (Literal GoF factory only if explicitly wanted.)
3. **Wizard state:** `useReducer` in a `usePricingWizard` hook (no deps, testable, RSC/Compiler friendly).
4. **Animations:** CSS keyframes/transitions + an `IntersectionObserver` `useInView` hook inside one
   `<Reveal>` client wrapper; honors `prefers-reduced-motion`. Framer Motion only if a signature hero
   animation is wanted (≈34 KB, forces `'use client'`).
5. **SEO:** Metadata API (title/description/OG/Twitter) + JSON-LD `ProfessionalService` + `OfferCatalog`
   (services priced in INR); optional dynamic OG image.

## Non-Goals

No backend/API/database, no TypeScript migration, no CMS, no auth.

## Target Structure

```
config/site.js                         NEW  single source of truth
lib/pricing.js                         NEW  pure pricing logic
lib/whatsapp.js                        NEW  WhatsApp Facade
lib/hooks/useInView.js                 NEW  IntersectionObserver hook
app/layout.js                          MOD  metadata + JSON-LD + Geist body font
app/page.js                            MOD  thin composition root
app/globals.css                        MOD  font fix, smooth scroll, reveal utilities
app/opengraph-image.js                 NEW (optional)
app/components/layout/{Navbar,Footer}.js
app/components/sections/{Hero,ServiceCatalog,Deliverables,PricingSection}.js
app/components/pricing/{PricingWizard,usePricingWizard,PriceSummary}.js + steps/*
app/components/ui/{ServiceCard,Section,Reveal}.js
DELETE: app/components/PricingCalculator.js, app/components/ContactModal.js,
        utils/pricingLogic.js, tailwind.config.js
```

## Phases

### Phase 1 — Tech Debt & Config Extraction
Create `config/site.js`, `lib/pricing.js`, `lib/whatsapp.js`. Rewire `Footer`, `Navbar`,
`ServiceCatalog`, `PricingCalculator` to read config. Delete `utils/pricingLogic.js`,
`tailwind.config.js`.

### Phase 2 — Structural Refactoring
Implement `Hero.js` (extract from `page.js`, fix dead button), `ServiceCard.js`, `Section.js`.
Map `config.services` → `ServiceCard`. Move Navbar/Footer to `layout/`; convert scroll CTAs to
anchor links + CSS smooth scroll so `Navbar` becomes a server component. Slim `page.js`.
Delete `ContactModal.js`.

### Phase 3 — Feature Additions (Conversion + SEO)
`PricingWizard` (4 tunable steps: Service → Timeline → Add-ons → Review) with `usePricingWizard`
reducer, `PriceSummary`, `PricingSection`; add-ons sourced from config. Delete `PricingCalculator.js`.
`layout.js`: Metadata API + JSON-LD. Optional `opengraph-image.js`.
Decision: `metadataBase` URL (Vercel preview vs custom domain).

### Phase 4 — UI/UX Polish
`globals.css`: Geist body font, `scroll-behavior: smooth`, reveal keyframes + reduced-motion,
resolve dead dark-mode vars. Add `useInView` + `Reveal`. Wrap sections; responsive/focus/aria audit.
Fix Footer name and socials.

## Cross-Cutting

- **Testing (recommended/optional):** add Vitest for `lib/pricing.js` and `lib/whatsapp.js`.
- **Sequencing:** each phase independently shippable; 1 foundational, 2 pure refactor, 3–4 user-facing.
- **Risk:** Node-version prerequisite blocks build/run.
