# Fresh Farm Starter (Stripe + Supabase Auth)

A minimal, production‑ready template that gives you:
- Email/password **Sign Up / Sign In** via Supabase Auth
- **Two offers** selection (configurable via `.env` PRICE IDs)
- **Stripe Checkout** integration (Supabase Edge Functions)
- Clean **Vite + React + Tailwind CSS** frontend

> You only need to set environment variables and deploy two Supabase Functions.

---

## 0) Prerequisites
- Node 18+
- A Supabase project
- A Stripe account

Install deps:
```bash
npm i
```

## 1) Configure environment

Copy `.env.example` to `.env` and fill in values:

```ini
# Frontend (public)
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Functions base URL
VITE_SUPABASE_FUNCTIONS_URL=https://<project-ref>.functions.supabase.co

# Stripe price IDs for the two offers
VITE_STRIPE_PRICE_BASIC=price_basic_123
VITE_STRIPE_PRICE_PRO=price_pro_456
```

> To find your **project-ref**, open your Supabase project and check the URL:  
> `https://supabase.com/dashboard/project/<project-ref>/...`

## 2) Create database tables
Open **Supabase Dashboard → SQL editor** and run the contents of:
```
supabase/sql/schema.sql
```

This creates:
- `products`, `prices` (optional catalog)
- `customers`, `orders`, `order_items`, `subscriptions`

## 3) Create Stripe products/prices
In **Stripe Dashboard → Products**, create two prices (one-time or recurring).  
Paste their IDs into your `.env` as `VITE_STRIPE_PRICE_BASIC` and `VITE_STRIPE_PRICE_PRO`.

## 4) Set Supabase Function secrets
In **Supabase Dashboard → Project Settings → Functions → Secrets**, add:

- `STRIPE_SECRET_KEY` = `sk_test_...`
- `STRIPE_WEBHOOK_SECRET` = `whsec_...` (you'll get this in step 6)
- `SUPABASE_URL` = `https://<project-ref>.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = *service_role* key from Dashboard → API
- `FRONTEND_URL` = `http://localhost:5173` (or your deployed domain)

## 5) Deploy functions
Login and link once:
```bash
npx supabase login
npx supabase link --project-ref <project-ref>
```

Deploy:
```bash
npx supabase functions deploy create-checkout-session --no-verify-jwt
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

## 6) Add Stripe Webhook
**Stripe Dashboard → Developers → Webhooks → Add endpoint**  
URL: `https://<project-ref>.functions.supabase.co/stripe-webhook`  
Events: start with `checkout.session.completed`  
Copy the **Signing secret** (`whsec_...`) → paste into Supabase secrets as `STRIPE_WEBHOOK_SECRET`.

## 7) Run locally
```bash
npm run dev
```
Open http://localhost:5173

- Sign up / Sign in in the header.
- Go to **Pricing** and choose an offer.
- You’ll be redirected to Stripe Checkout.
- After test payment, check `orders` in Supabase.

## 8) Deploy static frontend
Any static host works (Netlify, Vercel static, etc.). Set `FRONTEND_URL` secret to your domain and redeploy functions if needed.

---

### Notes
- Edge Functions run on **Deno** (use `Deno.env.get`, not `process.env`).  
- We use `npm:` import specifiers inside functions to avoid import map issues.
- You may enable Stripe Tax by uncommenting `automatic_tax: { enabled: true }`.

Enjoy! 🚀
