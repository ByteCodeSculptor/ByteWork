# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm start        # Serve the production build
npm run lint     # ESLint (flat config, next/core-web-vitals) — the only check; there is no test suite
```

**Environment gotcha:** the codebase targets Next.js 16 / React 19, which require **Node 20+**. The machine's default `node` is v14.21.3 — `npm install`/`dev`/`build` will fail until a newer Node is active (e.g. `nvm use 20`).

## What this is

A single-page marketing/landing site for a freelance dev-consultancy ("V-Tech.Solutions", branded as Vishnu Vardhan) that sells final-year student project development across four niches: Quantum Computing (Qiskit), MERN, Java/Spring Boot, and Python/AI. The repo name is `ByteWork`; the `package.json` name (`my-portfolio`) and `layout.js` metadata ("Create Next App") are stale leftovers.

There is **no backend** — no API routes, database, or auth. Lead conversion happens entirely through **WhatsApp deep links** (`https://wa.me/<number>?text=...`) constructed client-side. This is the core architectural fact: every "Get Quote" / "Book" CTA just opens WhatsApp with a pre-filled message.

## Architecture

- **Next.js App Router**, but effectively a one-route app. `app/layout.js` is the root layout (loads Geist fonts); `app/page.js` is the single composition root that assembles the whole page: `Navbar` → inline hero `<section>` → `ServiceCatalog` → `Deliverables` → `PricingCalculator` → `Footer`.
- **Server vs client components:** components are server components by default. Only `Navbar` and `PricingCalculator` carry `'use client'` (they use `onClick`/`useState`/`useEffect`).
- **The only real logic lives in `app/components/PricingCalculator.js`:** per-service base prices plus a deadline-based urgency multiplier — `≤3 days` → +40% ("Super Rush"), `4–6 days` → +20% ("Express"), `≥7 days` → Standard. It computes a quote and emits a WhatsApp message.
- **Path alias:** `@/*` maps to the repo root (`jsconfig.json`).
- **React Compiler is enabled** (`next.config.mjs` → `reactCompiler: true`, plus `babel-plugin-react-compiler`). Don't hand-add `useMemo`/`useCallback` micro-optimizations expecting the default Babel pipeline.

## Styling — Tailwind CSS v4 (CSS-first)

Theme is configured in **`app/globals.css`** via `@import "tailwindcss"` and an `@theme inline { ... }` block (PostCSS plugin `@tailwindcss/postcss`). **`tailwind.config.js` is empty and unused** — do not add v3-style `module.exports` config there; extend the theme in `globals.css` instead.

## Conventions & gotchas

- **Empty placeholder files exist and are not imported:** `app/components/Hero.js`, `ServiceCard.js`, `ContactModal.js`, and `utils/pricingLogic.js` are all 0-byte stubs. The hero is currently inlined in `page.js`. If extracting pricing logic, `utils/pricingLogic.js` is its intended home.
- **Service data is duplicated and unsynced:** `ServiceCatalog.js` has one services array (titles/descriptions/icons/tech) and `PricingCalculator.js` has a separate one (ids/names/`basePrice`). Editing one does not update the other — keep them in sync or consolidate.
- **Hardcoded contact details across components:** WhatsApp number `919182407243` (in `PricingCalculator.js` and `Footer.js`), email `ramki3244@gmail.com`, and GitHub `ByteCodeSculptor` (in `Footer.js`). Update all sites together. Prices are in Indian Rupees (₹).
