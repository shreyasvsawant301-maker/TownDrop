-- LocalConnect Supabase Schema & Seed Data Script (With Auth & Profiles)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Connects Supabase Auth user -> LocalConnect Role)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('customer', 'merchant', 'rider', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MERCHANTS TABLE
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    town TEXT NOT NULL DEFAULT 'Karmala',
    approved BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(2,1) DEFAULT 4.8,
    eta_range TEXT DEFAULT '20-30 min',
    distance_km NUMERIC(3,1) DEFAULT 1.2,
    lat NUMERIC(9,6) DEFAULT 18.4088,
    lng NUMERIC(9,6) DEFAULT 75.1953,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 50,
    unit TEXT DEFAULT '1 item',
    category TEXT DEFAULT 'Grocery',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RIDERS TABLE
CREATE TABLE IF NOT EXISTS public.riders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'busy')) DEFAULT 'available',
    lat NUMERIC(9,6) DEFAULT 18.4050,
    lng NUMERIC(9,6) DEFAULT 75.1920,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL DEFAULT 'Rahul Sharma',
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    rider_id UUID REFERENCES public.riders(id) ON DELETE SET NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('placed', 'accepted', 'assigned', 'picked_up', 'delivered')) DEFAULT 'placed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public Policy & RLS setup
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon users to read public tables for hackathon ease
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert to profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to merchants" ON public.merchants FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to riders" ON public.riders FOR SELECT USING (true);
CREATE POLICY "Allow public read access to orders" ON public.orders FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update to orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update to products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update to riders" ON public.riders FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.merchants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.riders;

-- SEED DATA
TRUNCATE public.orders, public.products, public.merchants, public.riders CASCADE;

-- Insert Merchants with coordinates
INSERT INTO public.merchants (id, name, category, town, approved, rating, eta_range, distance_km, lat, lng, image_url) VALUES
('m1111111-1111-1111-1111-111111111111', 'Sharma Grocers', 'Kirana', 'Karmala', true, 4.8, '15-25 min', 0.8, 18.4088, 75.1953, 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'),
('m2222222-2222-2222-2222-222222222222', 'VSC Kanedi Hardware Shop', 'Hardware', 'Karmala', true, 4.7, '25-35 min', 1.4, 18.4120, 75.2010, 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80'),
('m3333333-3333-3333-3333-333333333333', 'Apollo Pharmacy', 'Pharmacy', 'Karmala', true, 4.9, '10-20 min', 0.5, 18.4040, 75.1910, 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80');

-- Products for Sharma Grocers
INSERT INTO public.products (merchant_id, name, price, stock, unit, category, image_url) VALUES
('m1111111-1111-1111-1111-111111111111', 'Premium Basmati Rice', 180.00, 45, '1 kg', 'Staples', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'),
('m1111111-1111-1111-1111-111111111111', 'Cold Pressed Mustard Oil', 220.00, 30, '1 Litre', 'Staples', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'),
('m1111111-1111-1111-1111-111111111111', 'Fresh Coriander Bunch', 25.00, 100, '100g', 'Fresh', 'https://images.unsplash.com/photo-1588879460405-5609fa84742a?auto=format&fit=crop&w=600&q=80'),
('m1111111-1111-1111-1111-111111111111', 'Chakki Fresh Atta', 280.00, 25, '5 kg', 'Staples', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80');

-- Products for VSC Hardware
INSERT INTO public.products (merchant_id, name, price, stock, unit, category, image_url) VALUES
('m2222222-2222-2222-2222-222222222222', 'Heavy-Duty Steel Hammer', 350.00, 15, '1 pc', 'Hardware', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80'),
('m2222222-2222-2222-2222-222222222222', 'Galvanized Nails (1-inch)', 120.00, 50, '500g box', 'Hardware', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80'),
('m2222222-2222-2222-2222-222222222222', 'PVC Plumbing Pipe (3m)', 240.00, 20, '1 pipe', 'Hardware', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80');

-- Products for Apollo Pharmacy
INSERT INTO public.products (merchant_id, name, price, stock, unit, category, image_url) VALUES
('m3333333-3333-3333-3333-333333333333', 'Paracetamol 650mg Tablets', 45.00, 100, 'Strip of 15', 'Pharmacy', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'),
('m3333333-3333-3333-3333-333333333333', 'Waterproof Bandages', 60.00, 75, 'Pack of 20', 'Pharmacy', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80');

-- Insert Riders with Location coordinates
INSERT INTO public.riders (id, name, phone, status, lat, lng) VALUES
('r1111111-1111-1111-1111-111111111111', 'Vikram Singh', '+91 98765 43210', 'available', 18.4060, 75.1930),
('r2222222-2222-2222-2222-222222222222', 'Amit Kumar', '+91 98765 43211', 'busy', 18.4200, 75.2100);

-- Insert Initial Sample Order
INSERT INTO public.orders (id, customer_name, merchant_id, rider_id, items, total, status, created_at) VALUES
(
    'o1001',
    'Shreyas',
    'm2222222-2222-2222-2222-222222222222',
    NULL,
    '[{"name":"Heavy-Duty Steel Hammer","qty":2,"price":350},{"name":"PVC Plumbing Pipe (3m)","qty":1,"price":240}]'::jsonb,
    940.00,
    'placed',
    NOW() - INTERVAL '5 minutes'
);
