# JARK Market — Launch Checklist

This is the handoff from prototype to a real production marketplace.

## 1. Create the backend

Recommended first backend: Supabase.

1. Create a Supabase project.
2. Open SQL Editor.
3. Copy and run supabase/schema.sql from this repository.
4. Confirm these tables exist: profiles, listings, favorites, orders, messages, reviews.
5. Confirm Row Level Security is enabled on all six tables.
6. Create a Storage bucket for marketplace media.

The schema prevents a browser client from choosing an arbitrary order amount. Order creation goes through a database function so the amount comes from the selected listing.

## 2. Create real authentication

Enable Supabase email/password authentication.

For Google: create a Google Cloud project, configure the Google OAuth client, add the Supabase callback URL shown in the Supabase Google provider settings, add local and production redirect URLs, enable the provider, then test signup and sign-in.

The frontend already contains Supabase-ready sign-in, signup and Google OAuth code. It falls back to demo roles only when Supabase variables are missing.

## 3. Configure JARK roles

Public signup supports customer and provider. Admin must never be self-selected.

After creating your first real account, assign admin manually in Supabase SQL Editor:

    update public.profiles
    set role='admin', updated_at=now()
    where email='YOUR-ADMIN-EMAIL';

Create at least one test customer and one provider.

## 4. Configure the frontend

Copy .env.example to .env.local and fill:

    VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

Never put a Supabase secret/service-role key in a VITE_* variable.

Run:

    npm install
    npm run dev

Production build:

    npm run build

## 5. Deploy

Vercel is a straightforward deployment target for this Vite application.

1. Open Vercel.
2. Import jark-zenith/JARK-Market-.
3. Keep the detected Vite settings.
4. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY as environment variables.
5. Deploy a preview.
6. Test the preview.
7. Add your production domain.
8. Add the production URL to Supabase Auth site/redirect settings.

vercel.json is already included for SPA deep-link routing.

## 6. Replace demo marketplace state

The application still uses src/store.js for demo/local browser state.

Connect these operations to Supabase: listings -> public.listings; favorites -> public.favorites; orders -> public.create_order(...); order status -> public.update_order_status(...); messages -> public.messages; reviews -> public.reviews; profiles -> public.profiles and provider_public_profiles.

Do not trust price, provider ID, buyer ID or order status from the browser. Validate them on the server/database.

## 7. Connect M-Pesa

For a Kenya-first launch, use Safaricom Daraja.

1. Create a Daraja developer account.
2. Create a sandbox application.
3. Configure M-Pesa credentials server-side.
4. Implement STK Push for checkout.
5. Implement the callback endpoint.
6. Validate payment confirmation server-side.
7. Save the M-Pesa receipt/reference in orders.transaction_id.
8. Mark payment_status='paid' only after verified confirmation.
9. Test sandbox before production credentials.

Never put M-Pesa secrets in Vite browser variables.

## 8. Connect card payments

Choose a processor appropriate for the business and country. Stripe lists Kenya in its global availability as an Extended network market, so confirm your account eligibility and settlement details before implementation.

For cards, use server-side checkout/payment endpoints and webhooks. Never handle raw card numbers yourself.

## 9. Make provider onboarding real

Add production fields for display name, bio, profile photo, location, phone/contact preference, categories, service area, portfolio, availability, payout details and verification status.

Admin should approve provider verification rather than trusting a browser flag.

## 10. Finish marketplace operations

Build real workflows for listing create/edit/archive, provider verification, messaging, booking/order lifecycle, cancellation, review submission, reports/moderation, disputes, notifications and provider payouts.

## 11. Notifications

Choose email/SMS/WhatsApp infrastructure and send account verification, new order, payment confirmation, new message, order status changes, provider approval and review requests.

## 12. Security before launch

Verify RLS for anonymous and authenticated users; keep private keys out of GitHub; never expose service-role keys; enforce server-side roles; never trust browser prices; authenticate payment webhooks; rate-limit auth, messaging and payment endpoints; restrict uploads by type and size; keep secrets out of logs; enable backups; monitor dependencies.

## 13. Legal and business pages

Add Terms of Service, Privacy Policy, Refund/Cancellation Policy, Provider Terms and Contact/Support. Get Kenyan legal advice appropriate to the final business model.

## 14. Final test matrix

Test desktop Chrome, Android Chrome, iPhone Safari and slow mobile networks.

Test these end-to-end flows:
1. Visitor -> search -> service -> signup -> order.
2. Customer -> payment -> confirmation -> order history.
3. Provider -> signup -> listing -> order -> status update.
4. Customer -> message -> complete order -> review.
5. Admin -> verify provider -> moderate listing -> inspect order.
6. Failed payment -> retry.
7. Cancelled order -> correct refund/status behavior.

## 15. Fully functioning definition

JARK Market is ready for real customers only when real authentication, database persistence, provider listing management, real orders, server-verified payments, persistent messaging, order-linked reviews, protected admin controls, backups, monitoring, HTTPS and complete mobile/desktop testing are working.

The current repository already contains the marketplace UI, demo flows, payment boundary, Supabase-ready auth code, production database schema, API scaffold, Vercel SPA routing and this handoff checklist.