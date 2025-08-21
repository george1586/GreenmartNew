-- Enable pgcrypto for gen_random_uuid if needed
create extension if not exists "pgcrypto";

-- Catalog (optional; you can also manage products in Stripe only)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  stripe_product_id text unique,
  name text not null,
  description text,
  active boolean default true,
  image_url text
);

create table if not exists public.prices (
  id uuid primary key default gen_random_uuid(),
  stripe_price_id text unique,
  product_id uuid references public.products(id) on delete cascade,
  unit_amount integer not null,
  currency text not null check (currency ~ '^[a-z]{3}$'),
  recurring_interval text,
  active boolean default true
);

-- Customers
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text unique,
  stripe_customer_id text unique
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_payment_intent_id text unique,
  stripe_checkout_session_id text unique,
  customer_id uuid references public.customers(id),
  amount_total integer not null,
  currency text not null,
  status text not null,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  price_id uuid references public.prices(id),
  quantity integer not null default 1,
  unit_amount integer not null
);

-- Subscriptions (optional)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  stripe_subscription_id text unique,
  status text,
  current_period_end timestamptz
);
