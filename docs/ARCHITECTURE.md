# JARK Market architecture

## Current frontend

The application is a Vite + React single-page marketplace. The UI is separated from marketplace state through src/store.js.

That boundary is deliberate: the prototype can run immediately with browser localStorage, while production can replace the store operations with authenticated API calls.

## Core domains

- Discovery: categories, search, filtering and service details
- Identity: customer, provider and admin roles
- Commerce: shortlist, checkout, orders and transaction records
- Communication: marketplace conversations
- Provider operations: listings and seller workspace
- Administration: order monitoring and listing moderation

## Production service boundary

src/lib/api.js provides the frontend API seam.

Current demo serverless routes:

- GET /api/health
- GET /api/catalog

These routes are scaffolding, not a production database.

## Recommended production stack

Authentication: managed identity provider such as Supabase Auth, Firebase Auth or Clerk.

Database: PostgreSQL with row-level authorization.

Media: object storage for provider images and listing media.

Payments: server-side M-Pesa integration plus a PCI-compliant card processor.

Notifications: email + SMS/WhatsApp provider.

Authorization: server-side role checks for customer/provider/admin operations.

Observability: structured logs, error monitoring and analytics.

## Security rules

Never put private API keys, payment credentials or service-role database keys in VITE_* variables.

Validate all prices, IDs, ownership and status transitions on the server.

Treat browser localStorage as demo state only; it is not a security boundary.

## Deployment

The Vite client can be deployed as a static application. The /api directory is compatible with Vercel-style serverless deployment.

Before production launch, replace demo handlers with authenticated business logic and connect the database/payment providers.
