# Backend Plan (Supabase + Stripe)

This document describes everything needed to add authentication, data persistence, and billing to the current React + Vite codebase using Supabase (Postgres + Auth + RLS) and Stripe webhooks.

## 1) Overview Architecture

Client (React + Vite)
- Supabase JS SDK for auth + database reads/writes.
- Uses Supabase RLS to secure per-user data.

Backend (Supabase)
- Postgres database for user data and app state.
- Supabase Auth for user accounts.
- Row Level Security (RLS) policies for all user data.

Billing (Stripe)
- Stripe Checkout / Customer Portal on the client.
- Serverless functions for webhooks.
- Webhook syncs subscription state into Supabase (service role key only).

## 2) Supabase Setup

1. Create a Supabase project
- Note `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- Generate `SUPABASE_SERVICE_ROLE_KEY` (server-only).

2. Configure Auth
- Enable email/password.
- Optional: OAuth providers (Google, GitHub, etc.).
- Configure redirect URLs for local + production.

3. Create tables and RLS
- See schema section below.
- Enable RLS on all user data tables.

4. Configure storage (optional)
- If you want user-generated exports, thumbnails, etc., use Supabase Storage.

## 3) Stripe Setup

1. Create Stripe account + products
- Create a product and price for each plan.
- Decide on monthly/annual billing.

2. Checkout and Portal
- Use Stripe Checkout for initial subscription.
- Use Customer Portal for upgrades/cancellations.

3. Webhooks
- Create a webhook endpoint (Vercel/Netlify/Cloudflare Functions).
- Handle events:
  - checkout.session.completed
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.payment_failed

4. Sync to Supabase
- Webhook uses service role key to upsert subscription row.

## 4) Database Schema (Suggested)

### profiles
- id (uuid, primary key, FK to auth.users)
- display_name (text)
- username (text, unique, optional for public profiles)
- avatar_url (text)
- created_at (timestamp)

### user_preferences
- id (uuid, primary key)
- user_id (uuid, FK to auth.users)
- theme (text)
- playback_speed (numeric)
- layout_prefs (jsonb)  // split widths, active tab, etc.
- created_at (timestamp)
- updated_at (timestamp)
Constraints:
- UNIQUE (user_id)  // one preferences row per user

### saved_inputs
- id (uuid, primary key)
- user_id (uuid, FK to auth.users)
- algorithm_id (text)
- name (text)
- input_json (jsonb)
- created_at (timestamp)
- updated_at (timestamp)
Indexes:
- INDEX (user_id, algorithm_id)

### progress
- id (uuid, primary key)
- user_id (uuid, FK to auth.users)
- algorithm_id (text)
- last_state_json (jsonb)
- last_step (integer)
- last_seen_at (timestamp)
Constraints:
- UNIQUE (user_id, algorithm_id)

### favorites
- id (uuid, primary key)
- user_id (uuid, FK to auth.users)
- algorithm_id (text)
- created_at (timestamp)

### recent_activity
- id (uuid, primary key)
- user_id (uuid, FK to auth.users)
- algorithm_id (text)
- visited_at (timestamp)

### subscriptions
- id (uuid, primary key)
- user_id (uuid, FK to auth.users, nullable)
- stripe_customer_id (text)
- stripe_subscription_id (text)
- status (text)  // active, trialing, canceled, past_due
- current_period_end (timestamp)
- plan_id (text)
- created_at (timestamp)
- updated_at (timestamp)
Notes:
- `user_id` can be null until a Stripe customer is linked to an auth user.

## 5) RLS Policies (Must Have)

For all user-owned tables:
- Enable RLS.
- Policy: `user_id = auth.uid()` for SELECT/INSERT/UPDATE/DELETE.

For subscriptions:
- SELECT allowed for the user.
- INSERT/UPDATE/DELETE only via service role (webhook).
- Do not allow client writes at all.

Example policy:
- SELECT: `user_id = auth.uid()`
- INSERT: no user policy
- UPDATE: no user policy

## 6) Client Integration Steps

1. Install Supabase client
- `npm install @supabase/supabase-js`

2. Add env vars
- `.env.local`:
  - `VITE_SUPABASE_URL=...`
  - `VITE_SUPABASE_ANON_KEY=...`

3. Create supabase client file
- `src/lib/supabaseClient.js`
- Initialize with `createClient`.

4. Auth UI and session state
- Add login/signup/reset pages or modal.
- Store session in React state or context.
- Protect routes that need auth.

5. Replace local-only persistence
- Save preferences (tab choice, split widths, speed) into Supabase.
- Save inputs for visualizers.
- Track progress and last viewed algorithm.
Implementation notes:
- Load preferences once on login and store in context.
- Debounce preference writes (avoid saving on every keystroke).

6. Feature gating
- Check subscription status on login.
- Hide or lock premium features accordingly.

## 7) Serverless Webhooks

Create a function (Vercel example):
- `api/stripe/webhook.js`
- Verify Stripe signature.
- On events, upsert to Supabase `subscriptions` table.
- Use `SUPABASE_SERVICE_ROLE_KEY` for admin access.

## 8) Security Considerations

- Never expose service role key to the client.
- Use RLS for all user data.
- Validate inputs before writing to the database.
- Rate limit any custom endpoints (if added).
- Keep webhook signature validation strict.

## 9) Suggested Feature Mapping

Auth-protected features:
- Saved inputs and presets.
- Progress tracking and checkpoints.
- Personal preferences (theme, speed, tab).
- Favorites and history.

Premium features (Stripe):
- Unlimited saved inputs.
- Advanced or premium visualizers.
- Guided learning paths or quizzes.
- Export/share state links.
Gating model:
- Auth gates identity.
- Subscription gates entitlement.
- Premium content can be visible but locked to improve conversion.

## 10) Deployment Checklist

- Add Supabase env vars to hosting provider.
- Add Stripe keys to hosting provider:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Configure webhook endpoint URL in Stripe.
- Test webhook events in Stripe dashboard.
- Verify RLS works by testing with a non-admin user.

## 11) Next Steps (Practical Order)

1. Build Supabase project + schema + RLS policies.
2. Wire auth into the React app.
3. Persist user preferences (tab, layout, speed).
4. Add saved inputs and favorites.
5. Add Stripe checkout + webhook sync.
6. Gate premium features.
