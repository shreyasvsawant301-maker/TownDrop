-- TownDrop (LocalConnect) Complete Database Schema & DDL
-- Execute in Supabase SQL Editor

-- 1. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  phone text,
  role text not null check (role in ('customer', 'merchant', 'rider', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. MERCHANTS TABLE
create table if not exists public.merchants (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid references auth.users(id),
  name text not null,
  category text not null,
  town text not null default 'Karmala',
  approved boolean default true,
  rating numeric default 4.8,
  eta_range text default '15-25 min',
  distance_km numeric default 1.2,
  lat numeric default 18.4088,
  lng numeric default 75.1953,
  image_url text,
  created_at timestamptz default now()
);

-- 3. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  merchant_id text references public.merchants(id) on delete cascade,
  name text not null,
  price numeric not null,
  stock integer default 50,
  unit text default '1 unit',
  category text default 'General',
  image_url text,
  created_at timestamptz default now()
);

-- 4. RIDERS TABLE
create table if not exists public.riders (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id),
  name text not null,
  phone text not null,
  status text not null default 'available' check (status in ('available', 'busy', 'offline')),
  lat numeric default 18.4060,
  lng numeric default 75.1930,
  created_at timestamptz default now()
);

-- 5. ORDERS TABLE (Order statuses: placed, accepted, assigned, picked_up, out_for_delivery, delivered, cancelled)
create table if not exists public.orders (
  id text primary key default gen_random_uuid()::text,
  customer_id uuid references auth.users(id),
  customer_name text not null,
  merchant_id text references public.merchants(id),
  rider_id text references public.riders(id),
  items jsonb not null default '[]'::jsonb,
  total numeric not null,
  status text not null default 'placed' check (status in ('placed', 'accepted', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled')),
  delivery_address text default 'Karmala Market Road, Sector 4',
  delivery_latitude numeric default 18.4180,
  delivery_longitude numeric default 75.2080,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. DELIVERY LOCATIONS TABLE (Real-Time Geolocation Tracking)
create table if not exists public.delivery_locations (
  id uuid default gen_random_uuid() primary key,
  order_id text not null,
  rider_id text not null,
  latitude numeric not null,
  longitude numeric not null,
  accuracy numeric default 10,
  recorded_at timestamptz default now(),
  created_at timestamptz default now()
);

-- PERFORMANCE INDEXES
create index if not exists idx_delivery_locations_order_id on public.delivery_locations(order_id);
create index if not exists idx_delivery_locations_rider_id on public.delivery_locations(rider_id);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.merchants enable row level security;
alter table public.products enable row level security;
alter table public.riders enable row level security;
alter table public.orders enable row level security;
alter table public.delivery_locations enable row level security;

-- POLICIES
create policy "Allow public read access to profiles" on public.profiles for select using (true);
create policy "Allow user self insert profile" on public.profiles for insert with check (true);
create policy "Allow user self update profile" on public.profiles for update using (true);

create policy "Allow public read access to merchants" on public.merchants for select using (true);
create policy "Allow insert access to merchants" on public.merchants for insert with check (true);
create policy "Allow update access to merchants" on public.merchants for update using (true);

create policy "Allow public read access to products" on public.products for select using (true);
create policy "Allow insert access to products" on public.products for insert with check (true);
create policy "Allow update access to products" on public.products for update using (true);

create policy "Allow public read access to riders" on public.riders for select using (true);
create policy "Allow insert access to riders" on public.riders for insert with check (true);
create policy "Allow update access to riders" on public.riders for update using (true);

create policy "Allow public read access to orders" on public.orders for select using (true);
create policy "Allow insert order" on public.orders for insert with check (true);
create policy "Allow update order" on public.orders for update using (true);

create policy "Allow public read access to delivery locations" on public.delivery_locations for select using (true);
create policy "Allow assigned rider to insert delivery location" on public.delivery_locations for insert with check (true);

-- ENABLE SUPABASE REALTIME
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.merchants;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.riders;
alter publication supabase_realtime add table public.delivery_locations;

-- SEED DATA
insert into public.merchants (id, name, category, town, rating, eta_range, distance_km, lat, lng, image_url)
values
  ('m1111111-1111-1111-1111-111111111111', 'Sharma Grocers', 'Kirana', 'Karmala', 4.8, '15-25 min', 0.8, 18.4088, 75.1953, 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'),
  ('m2222222-2222-2222-2222-222222222222', 'VSC Kanedi Hardware Shop', 'Hardware', 'Karmala', 4.7, '25-35 min', 1.4, 18.4120, 75.2010, 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80'),
  ('m3333333-3333-3333-3333-333333333333', 'Apollo Pharmacy', 'Pharmacy', 'Karmala', 4.9, '10-20 min', 0.5, 18.4040, 75.1910, 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80')
on conflict (id) do nothing;
