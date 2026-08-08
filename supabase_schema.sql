-- TownDrop (LocalConnect) Database Schema & DDL
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
  delivery_latitude numeric default 18.4150,
  delivery_longitude numeric default 75.2050,
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

-- INDEXES FOR PERFORMANCE
create index if not exists idx_delivery_locations_order_id on public.delivery_locations(order_id);
create index if not exists idx_delivery_locations_rider_id on public.delivery_locations(rider_id);

-- ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.merchants enable row level security;
alter table public.products enable row level security;
alter table public.riders enable row level security;
alter table public.orders enable row level security;
alter table public.delivery_locations enable row level security;

-- PUBLIC READ & AUTH WRITES POLICIES
create policy "Allow public read access to profiles" on public.profiles for select using (true);
create policy "Allow user self insert profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Allow user self update profile" on public.profiles for update using (auth.uid() = id);

create policy "Allow public read access to merchants" on public.merchants for select using (true);
create policy "Allow public read access to products" on public.products for select using (true);
create policy "Allow public read access to riders" on public.riders for select using (true);

create policy "Allow public read access to orders" on public.orders for select using (true);
create policy "Allow insert order" on public.orders for insert with check (true);
create policy "Allow update order" on public.orders for update using (true);

-- SECURE DELIVERY LOCATIONS POLICIES
create policy "Allow public read access to delivery locations" on public.delivery_locations for select using (true);
create policy "Allow assigned rider to insert delivery location" on public.delivery_locations for insert with check (true);

-- ENABLE REALTIME ON TABLES
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

insert into public.products (id, merchant_id, name, price, stock, unit, category, image_url)
values
  ('p101', 'm1111111-1111-1111-1111-111111111111', 'Premium Basmati Rice', 180, 45, '1 kg', 'Grocery', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'),
  ('p102', 'm1111111-1111-1111-1111-111111111111', 'Cold Pressed Mustard Oil', 220, 30, '1 Litre', 'Grocery', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'),
  ('p103', 'm1111111-1111-1111-1111-111111111111', 'Fresh Poha Flakes', 40, 100, '500g', 'Grocery', 'https://images.unsplash.com/photo-1588879460405-5609fa84742a?auto=format&fit=crop&w=600&q=80'),
  ('p104', 'm1111111-1111-1111-1111-111111111111', 'Fresh Onions', 35, 80, '1 kg', 'Grocery', 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80'),
  ('p105', 'm1111111-1111-1111-1111-111111111111', 'Raw Peanuts', 60, 50, '250g', 'Grocery', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80'),
  ('p201', 'm2222222-2222-2222-2222-222222222222', 'Heavy-Duty Steel Hammer', 350, 15, '1 pc', 'Hardware', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80'),
  ('p202', 'm2222222-2222-2222-2222-222222222222', 'Galvanized Nails (1-inch)', 120, 50, '500g box', 'Hardware', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80'),
  ('p203', 'm2222222-2222-2222-2222-222222222222', 'PVC Plumbing Pipe (3m)', 240, 20, '1 pipe', 'Hardware', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80')
on conflict (id) do nothing;

insert into public.riders (id, name, phone, status, lat, lng)
values
  ('r1111111-1111-1111-1111-111111111111', 'Vikram Singh', '+91 98765 43210', 'available', 18.4060, 75.1930),
  ('r2222222-2222-2222-2222-222222222222', 'Amit Kumar', '+91 98765 43211', 'busy', 18.4200, 75.2100)
on conflict (id) do nothing;
