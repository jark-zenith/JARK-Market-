# JARK Market

JARK Market is a Kenya-first marketplace for discovering trusted service providers, creators, artisans and professionals.

## Build status

This repository is being built as a real marketplace prototype in phased Git commits.

### Phase 1 — Marketplace foundation
- Responsive JARK Market visual system
- Home / landing page
- Search and category discovery
- Marketplace listing cards

### Phase 2 — Accounts & provider onboarding
- Customer, provider and admin roles
- Browser-persisted demo account state
- Provider workspace
- Provider listing creation
- Customer profile area

### Phase 3 — Marketplace engine
- Explore page with filters and sorting
- Service detail pages
- Favorites
- Shortlist/cart
- Orders
- Messaging workspace
- Review-ready listing data

### Phase 4 — Payments
- Checkout
- M-Pesa, card and pay-on-arrangement selectors
- Demo transaction state
- Order confirmation
- Production payment adapter boundary

### Phase 5 — Operations
- Admin control center
- Marketplace health indicators
- Order monitoring
- Provider/listing operations foundation
- Notification counter

### Phase 6 — Production hardening
The current build keeps business logic behind a small local store so a real backend can replace it without rebuilding the UI.

Production work that still requires connected infrastructure includes authentication, database, media storage, server-side authorization, live M-Pesa/card payments, notifications, analytics, moderation and secrets.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Demo accounts

Use **Sign in** and choose Customer, Provider or Admin. The prototype stores data in browser localStorage.


## Production API scaffold

A small serverless API boundary is included under /api, with frontend access helpers in src/lib/api.js. See docs/ARCHITECTURE.md before connecting authentication, database, media storage or live payments.
