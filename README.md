# Coverpenny

A modern, interactive **P&C insurance marketplace** website — auto, home, motorcycle, and
small business (no life). Customers compare real prices from 40+ carriers and pick the best one.
Built as a fast single-page site with an English/Spanish toggle and an interactive quote wizard.

> Tap. Compare. Covered. — Insurance, simplified.

## Features

- 🎨 **Modern, minimalist brand** — magenta-pink + cream palette, bold grotesk display type,
  monospace labels, the signature pink-dot logo.
- 🧮 **Interactive quote wizard** — a 4-step flow (coverage → ZIP → details → contact) that
  returns a carrier comparison sorted cheapest-first, with a "best price" badge.
- 🌎 **Bilingual (EN/ES)** — instant language toggle, persisted in `localStorage`. English is
  the default.
- ✨ **Smooth motion** — scroll reveals, an animated savings ticker, and spring-based modal
  transitions via `framer-motion`.
- 📱 **Fully responsive** — mobile-first layout with a collapsible nav.

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build
```

The `dist/` folder is a static site — deploy it to Netlify, Vercel, GitHub Pages, or any host.

## Project structure

```
src/
  i18n/                EN/ES dictionaries + language context (useT hook)
  lib/
    carriers.js        carrier partner list + logo marks
    quoteService.js    getQuotes() — sample data today, Turborater-ready
  components/
    Navbar, Hero, SavingsTicker, Coverage, HowItWorks, Stats,
    Carriers, Testimonials, FinalCTA, Footer, Logo, CarrierMark, Reveal
    quote/             QuoteContext, QuoteModal, QuoteWizard, QuoteResults
```

## Connecting Turborater (real rates)

The quote UI is fully decoupled from the rating source. Today
`src/lib/quoteService.js` returns deterministic **sample** quotes so the wizard feels complete
without a backend. To use real carrier rates:

1. Set `VITE_TURBORATER_API_URL` in a `.env.local` file (see `.env.example`).
2. In `src/lib/quoteService.js`, uncomment the `// TODO: integrar Turborater` block — the
   `payload` passed to `getQuotes()` is already shaped for the rater, so no UI changes are needed.

## Notes

- Coverage is **property & casualty only** — there is intentionally no life insurance content.
- Carrier names, prices, reviews, and savings figures are illustrative placeholders.
