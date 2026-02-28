# BrickCitySwap

A student housing and general marketplace platform for RIT (Rochester Institute of Technology) students. BrickCitySwap lets students list and discover subleases/rentals, sell/buy goods, and connect with each other in a campus-verified community.

---

## Features

- **Housing Listings** — Browse and post subleases and rentals near RIT
- **Marketplace** — Buy and sell textbooks, electronics, furniture, and more
- **RIT Community** — Campus-verified platform for RIT students
- **Subscription Tiers** — Free browsing; paid tiers unlock posting capabilities
- **Dark Mode** — Full light/dark theme support

---

## Repository Structure

```
BrickCitySwap/
├── index.html          # "Coming Soon" landing page (root)
└── Figma_Output/       # Main application (develop here)
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        └── app/
            ├── App.tsx
            └── components/   # Views, dialogs, and UI components
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| UI Primitives | Radix UI |
| Component Library | shadcn/ui |
| Additional UI | Material UI |
| Icons | Lucide React + MUI Icons |
| Forms | React Hook Form |
| Animations | Motion (Framer Motion) |
| Toasts | Sonner |

---

## Getting Started

All commands must be run from the `Figma_Output/` directory.

```bash
cd Figma_Output
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build (outputs to dist/)
```

> Use `npm` or `pnpm`. Do not use `yarn`.

---

## Subscription Tiers

| Tier | Price | Capabilities |
|------|-------|-------------|
| Free | $0 | Browse listings, sees ads |
| Poster | $2.99/mo or $25/yr | Post listings |

---

## Status

This project is currently in active development. The root `index.html` serves a **Coming Soon** landing page. The full application lives under `Figma_Output/`.

Backend integrations (auth, listings API, payments, messaging) are currently stubbed with in-memory mock data.

---

## Contributing

Feature branches follow the pattern: `claude/<description>-<session-id>`

Default development branch: `master`
