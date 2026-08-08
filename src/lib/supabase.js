import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Full Varied Local Shops Dataset
const INITIAL_MERCHANTS = [
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    name: 'Sharma Grocers',
    category: 'Kirana',
    town: 'Karmala',
    approved: true,
    rating: 4.8,
    eta_range: '15-25 min',
    distance_km: 0.8,
    lat: 18.4088,
    lng: 75.1953,
    image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm2222222-2222-2222-2222-222222222222',
    name: 'VSC Kanedi Hardware Shop',
    category: 'Hardware',
    town: 'Karmala',
    approved: true,
    rating: 4.7,
    eta_range: '25-35 min',
    distance_km: 1.4,
    lat: 18.4120,
    lng: 75.2010,
    image_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm3333333-3333-3333-3333-333333333333',
    name: 'Apollo Pharmacy',
    category: 'Pharmacy',
    town: 'Karmala',
    approved: true,
    rating: 4.9,
    eta_range: '10-20 min',
    distance_km: 0.5,
    lat: 18.4040,
    lng: 75.1910,
    image_url: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm4444444-4444-4444-4444-444444444444',
    name: 'Karmala Electricals & Lighting',
    category: 'Electrical',
    town: 'Karmala',
    approved: true,
    rating: 4.6,
    eta_range: '20-30 min',
    distance_km: 1.1,
    lat: 18.4150,
    lng: 75.1990,
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm5555555-5555-5555-5555-555555555555',
    name: 'Patil Organic Farm Fresh',
    category: 'Fresh',
    town: 'Karmala',
    approved: true,
    rating: 4.9,
    eta_range: '15-20 min',
    distance_km: 0.6,
    lat: 18.4020,
    lng: 75.1880,
    image_url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm6666666-6666-6666-6666-666666666666',
    name: 'Aapla Home Needs',
    category: 'Home',
    town: 'Karmala',
    approved: true,
    rating: 4.7,
    eta_range: '20-35 min',
    distance_km: 1.7,
    lat: 18.4210,
    lng: 75.2090,
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  }
];

// Rich Product Dataset for All Merchant Categories
const INITIAL_PRODUCTS = [
  // 1. Sharma Grocers (Grocery / Kirana)
  { id: 'p101', merchant_id: 'm1111111-1111-1111-1111-111111111111', name: 'Premium Basmati Rice', price: 180, stock: 45, unit: '1 kg', category: 'Grocery', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { id: 'p102', merchant_id: 'm1111111-1111-1111-1111-111111111111', name: 'Cold Pressed Mustard Oil', price: 220, stock: 30, unit: '1 Litre', category: 'Grocery', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
  { id: 'p103', merchant_id: 'm1111111-1111-1111-1111-111111111111', name: 'Fresh Poha Flakes', price: 40, stock: 100, unit: '500g', category: 'Grocery', image_url: 'https://images.unsplash.com/photo-1588879460405-5609fa84742a?auto=format&fit=crop&w=600&q=80' },
  { id: 'p104', merchant_id: 'm1111111-1111-1111-1111-111111111111', name: 'Fresh Onions', price: 35, stock: 80, unit: '1 kg', category: 'Grocery', image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80' },
  { id: 'p105', merchant_id: 'm1111111-1111-1111-1111-111111111111', name: 'Raw Peanuts', price: 60, stock: 50, unit: '250g', category: 'Grocery', image_url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80' },
  
  // 2. VSC Kanedi Hardware Shop (Hardware)
  { id: 'p201', merchant_id: 'm2222222-2222-2222-2222-222222222222', name: 'Heavy-Duty Steel Hammer', price: 350, stock: 15, unit: '1 pc', category: 'Hardware', image_url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80' },
  { id: 'p202', merchant_id: 'm2222222-2222-2222-2222-222222222222', name: 'Galvanized Nails (1-inch)', price: 120, stock: 50, unit: '500g box', category: 'Hardware', image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80' },
  { id: 'p203', merchant_id: 'm2222222-2222-2222-2222-222222222222', name: 'PVC Plumbing Pipe (3m)', price: 240, stock: 20, unit: '1 pipe', category: 'Hardware', image_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80' },
  { id: 'p204', merchant_id: 'm2222222-2222-2222-2222-222222222222', name: 'Waterproof Sealant Tape', price: 90, stock: 40, unit: '1 roll', category: 'Hardware', image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80' },

  // 3. Apollo Pharmacy (Pharmacy)
  { id: 'p301', merchant_id: 'm3333333-3333-3333-3333-333333333333', name: 'Paracetamol 650mg Tablets', price: 45, stock: 100, unit: 'Strip of 15', category: 'Pharmacy', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
  { id: 'p302', merchant_id: 'm3333333-3333-3333-3333-333333333333', name: 'Waterproof Bandages', price: 60, stock: 75, unit: 'Pack of 20', category: 'Pharmacy', image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80' },
  { id: 'p303', merchant_id: 'm3333333-3333-3333-3333-333333333333', name: 'ORS Rehydration Sachet', price: 30, stock: 150, unit: 'Pack of 5', category: 'Pharmacy', image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80' },
  { id: 'p304', merchant_id: 'm3333333-3333-3333-3333-333333333333', name: 'Digital Body Thermometer', price: 250, stock: 25, unit: '1 pc', category: 'Pharmacy', image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80' },

  // 4. Karmala Electricals & Lighting (Electrical)
  { id: 'p401', merchant_id: 'm4444444-4444-4444-4444-444444444444', name: 'Syska LED Bulb 9W', price: 110, stock: 60, unit: '1 pc', category: 'Electrical', image_url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=600&q=80' },
  { id: 'p402', merchant_id: 'm4444444-4444-4444-4444-444444444444', name: 'Heavy Extension Cord 4-Socket', price: 380, stock: 20, unit: '1 pc', category: 'Electrical', image_url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80' },
  { id: 'p403', merchant_id: 'm4444444-4444-4444-4444-444444444444', name: 'Anchor Modular Switch 16A', price: 75, stock: 80, unit: '1 pc', category: 'Electrical', image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80' },

  // 5. Patil Organic Farm Fresh (Fresh Vegetables & Fruits)
  { id: 'p501', merchant_id: 'm5555555-5555-5555-5555-555555555555', name: 'Fresh Alphonso Mangoes', price: 450, stock: 30, unit: '1 dozen', category: 'Fresh', image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' },
  { id: 'p502', merchant_id: 'm5555555-5555-5555-5555-555555555555', name: 'Farm Fresh Red Tomatoes', price: 40, stock: 90, unit: '1 kg', category: 'Fresh', image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { id: 'p503', merchant_id: 'm5555555-5555-5555-5555-555555555555', name: 'Organic Green Spinach Bunch', price: 20, stock: 50, unit: '250g', category: 'Fresh', image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80' },

  // 6. Aapla Home Needs (Home)
  { id: 'p601', merchant_id: 'm6666666-6666-6666-6666-666666666666', name: 'Stainless Steel Water Bottle 1L', price: 320, stock: 25, unit: '1 pc', category: 'Home', image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
  { id: 'p602', merchant_id: 'm6666666-6666-6666-6666-666666666666', name: 'Microfiber Cleaning Cloth 4-Pack', price: 150, stock: 40, unit: '1 pack', category: 'Home', image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80' }
];

const INITIAL_RIDERS = [
  { id: 'r1111111-1111-1111-1111-111111111111', name: 'Vikram Singh', phone: '+91 98765 43210', status: 'available', lat: 18.4060, lng: 75.1930 },
  { id: 'r2222222-2222-2222-2222-222222222222', name: 'Amit Kumar', phone: '+91 98765 43211', status: 'busy', lat: 18.4200, lng: 75.2100 }
];

const INITIAL_ORDERS = [
  {
    id: 'TD1024',
    customer_name: 'Shreyas',
    merchant_id: 'm2222222-2222-2222-2222-222222222222',
    rider_id: null,
    items: [
      { name: 'Heavy-Duty Steel Hammer', qty: 2, price: 350 },
      { name: 'PVC Plumbing Pipe (3m)', qty: 1, price: 240 }
    ],
    total: 940,
    status: 'placed',
    delivery_address: 'Karmala Main Road, House #42',
    delivery_latitude: 18.4180,
    delivery_longitude: 75.2080,
    created_at: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

// Haversine distance calculator in KM
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.2;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Local Storage Helpers
function getLocalStore(key, defaultValue) {
  try {
    const item = localStorage.getItem(`localconnect_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalStore(key, value) {
  try {
    localStorage.setItem(`localconnect_${key}`, JSON.stringify(value));
    notifyFallbackSubscribers();
  } catch (e) {
    console.error('Storage error', e);
  }
}

const fallbackBus = new EventTarget();
const BROADCAST_CHANNEL_NAME = 'localconnect_realtime_bus';
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(BROADCAST_CHANNEL_NAME)
  : null;

if (broadcastChannel) {
  broadcastChannel.onmessage = () => {
    fallbackBus.dispatchEvent(new CustomEvent('update'));
  };
}

function notifyFallbackSubscribers() {
  fallbackBus.dispatchEvent(new CustomEvent('update'));
  if (broadcastChannel) {
    broadcastChannel.postMessage('update');
  }
}

// DIRECT LIVE SUPABASE AUTHENTICATION
export async function signInUser(email, password) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      const userProfile = profile || {
        id: data.user.id,
        full_name: email.split('@')[0],
        role: 'customer'
      };

      setLocalStore('active_session', { user: data.user, profile: userProfile });
      return { user: data.user, profile: userProfile };
    }
  }

  // Fallback / demo mode — detect demo role from email
  const DEMO_ACCOUNTS = {
    'customer@localconnect.demo': { full_name: 'Shreyas', role: 'customer' },
    'merchant@localconnect.demo': { full_name: 'VSC Kanedi Hardware', role: 'merchant' },
    'rider@localconnect.demo': { full_name: 'Vikram Singh', role: 'rider' },
    'admin@localconnect.demo': { full_name: 'Admin', role: 'admin' }
  };

  const demoAccount = DEMO_ACCOUNTS[email.toLowerCase()];
  const mockUser = { id: `user_${Date.now()}`, email };
  const mockProfile = {
    id: mockUser.id,
    full_name: demoAccount?.full_name || email.split('@')[0],
    role: demoAccount?.role || 'customer'
  };
  setLocalStore('active_session', { user: mockUser, profile: mockProfile });
  return { user: mockUser, profile: mockProfile };
}

export async function signUpUser(email, password, fullName, role = 'customer', phone = '') {
  let userId = `user_${Date.now()}`;
  let userObj = { id: userId, email };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (!error && data?.user) {
        userId = data.user.id;
        userObj = data.user;
      }
    } catch (e) {
      console.warn('Supabase Auth signUp rate limit bypassed:', e);
    }

    const profilePayload = {
      id: userId,
      full_name: fullName,
      role: role,
      phone: phone
    };
    await supabase.from('profiles').upsert([profilePayload]);

    if (role === 'merchant') {
      const merchantObj = {
        owner_id: userId,
        name: fullName.includes('Shop') || fullName.includes('Store') ? fullName : `${fullName}'s Town Shop`,
        category: 'General Kirana & Hardware',
        town: 'Karmala',
        approved: true,
        rating: 4.8,
        lat: 18.4088,
        lng: 75.1953,
        image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'
      };
      
      const { data: createdMerch, error: mErr } = await supabase.from('merchants').insert([merchantObj]).select().single();
      if (mErr) console.error('Error inserting merchant into Supabase:', mErr);

      const curM = getLocalStore('merchants', []);
      setLocalStore('merchants', [createdMerch || { id: `m_${Date.now()}`, ...merchantObj }, ...curM]);
    }

    if (role === 'rider') {
      const riderObj = {
        user_id: userId,
        name: fullName,
        phone: phone || '+91 98765 43210',
        status: 'available',
        lat: 18.4060,
        lng: 75.1930
      };

      const { data: createdRider, error: rErr } = await supabase.from('riders').insert([riderObj]).select().single();
      if (rErr) console.error('Error inserting rider into Supabase:', rErr);

      const curR = getLocalStore('riders', []);
      setLocalStore('riders', [createdRider || { id: `r_${Date.now()}`, ...riderObj }, ...curR]);
    }
  }

  const userProfile = { id: userId, full_name: fullName, role, phone };
  setLocalStore('active_session', { user: userObj, profile: userProfile });
  return { user: userObj, profile: userProfile };
}

export async function signOutUser() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('localconnect_active_session');
  notifyFallbackSubscribers();
}

export function getStoredSession() {
  return getLocalStore('active_session', null);
}

// DATA ACCESS APIS WITH ROBUST MERGING (INITIAL + DB + LOCAL)
export async function fetchMerchants() {
  let dbMerchants = [];
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('merchants').select('*');
    if (!error && data) dbMerchants = data;
  }
  const localMerchants = getLocalStore('merchants', []);

  // Merge INITIAL_MERCHANTS + DB Merchants + Local Storage Merchants without duplicates
  const map = new Map();
  INITIAL_MERCHANTS.forEach(m => map.set(m.id, m));
  dbMerchants.forEach(m => map.set(m.id, m));
  localMerchants.forEach(m => map.set(m.id, m));

  return Array.from(map.values());
}

export async function fetchProducts(merchantId = null) {
  let dbProducts = [];
  if (isSupabaseConfigured) {
    let query = supabase.from('products').select('*');
    if (merchantId) query = query.eq('merchant_id', merchantId);
    const { data, error } = await query;
    if (!error && data) dbProducts = data;
  }
  const localProducts = getLocalStore('products', []);

  // Merge INITIAL_PRODUCTS + DB Products + Local Storage Products without duplicates
  const map = new Map();
  INITIAL_PRODUCTS.forEach(p => map.set(p.id, p));
  dbProducts.forEach(p => map.set(p.id, p));
  localProducts.forEach(p => map.set(p.id, p));

  const allProducts = Array.from(map.values());
  return merchantId ? allProducts.filter(p => p.merchant_id === merchantId) : allProducts;
}

export async function updateMerchantSettings(merchantId, settingsPayload) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('merchants')
      .update(settingsPayload)
      .eq('id', merchantId)
      .select()
      .single();
    if (!error && data) return data;
  }
  const merchantsList = getLocalStore('merchants', []);
  const updated = merchantsList.map(m => m.id === merchantId ? { ...m, ...settingsPayload } : m);
  setLocalStore('merchants', updated);
  return updated.find(m => m.id === merchantId);
}

export async function fetchRiders() {
  let dbRiders = [];
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('riders').select('*');
    if (!error && data) dbRiders = data;
  }
  const localRiders = getLocalStore('riders', []);
  const map = new Map();
  INITIAL_RIDERS.forEach(r => map.set(r.id, r));
  dbRiders.forEach(r => map.set(r.id, r));
  localRiders.forEach(r => map.set(r.id, r));
  return Array.from(map.values());
}

export async function fetchOrders() {
  let dbOrders = [];
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) dbOrders = data;
  }
  const localOrders = getLocalStore('orders', []);
  const map = new Map();
  INITIAL_ORDERS.forEach(o => map.set(o.id, o));
  dbOrders.forEach(o => map.set(o.id, o));
  localOrders.forEach(o => map.set(o.id, o));
  return Array.from(map.values());
}

export async function createOrder(newOrderData) {
  const orderObj = {
    id: `TD${Math.floor(1000 + Math.random() * 9000)}`,
    customer_name: newOrderData.customer_name || 'Customer',
    merchant_id: newOrderData.merchant_id,
    rider_id: null,
    items: newOrderData.items,
    total: newOrderData.total,
    status: 'placed',
    delivery_address: newOrderData.delivery_address || 'Karmala Main Road, House #42',
    delivery_latitude: 18.4180,
    delivery_longitude: 75.2080,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('orders').insert([orderObj]).select().single();
    if (!error && data) return data;
  }

  const currentOrders = getLocalStore('orders', INITIAL_ORDERS);
  const updated = [orderObj, ...currentOrders];
  setLocalStore('orders', updated);
  return orderObj;
}

// SMART NEAREST RIDER ASSIGNMENT ALGORITHM
export async function assignNearestRider(orderId, merchantId) {
  const merchantsList = await fetchMerchants();
  const ridersList = await fetchRiders();

  const merchant = merchantsList.find(m => m.id === merchantId) || merchantsList[0];
  const availableRiders = ridersList.filter(r => r.status === 'available');

  let assignedRider = null;

  if (availableRiders.length > 0) {
    const ridersWithDistance = availableRiders.map(r => ({
      ...r,
      distanceKm: calculateDistanceKm(merchant.lat, merchant.lng, r.lat, r.lng)
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    assignedRider = ridersWithDistance[0];
  } else {
    assignedRider = ridersList[0];
  }

  await updateOrderStatus(orderId, 'assigned', assignedRider.id);
  await updateRiderStatus(assignedRider.id, 'busy');

  return assignedRider;
}

export async function updateOrderStatus(orderId, nextStatus, riderId = null) {
  const VALID_STATUSES = ['placed', 'accepted', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!VALID_STATUSES.includes(nextStatus)) {
    throw new Error(`Invalid status transition to '${nextStatus}'`);
  }

  if (isSupabaseConfigured) {
    const updatePayload = { status: nextStatus, updated_at: new Date().toISOString() };
    if (riderId) updatePayload.rider_id = riderId;
    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select()
      .single();
    if (!error && data) return data;
  }

  const currentOrders = getLocalStore('orders', INITIAL_ORDERS);
  const updated = currentOrders.map(ord => {
    if (ord.id === orderId) {
      return {
        ...ord,
        status: nextStatus,
        rider_id: riderId !== null ? riderId : ord.rider_id,
        updated_at: new Date().toISOString()
      };
    }
    return ord;
  });
  setLocalStore('orders', updated);

  if (nextStatus === 'delivered' && riderId) {
    await updateRiderStatus(riderId, 'available');
  }

  return updated.find(o => o.id === orderId);
}

export async function updateRiderStatus(riderId, newStatus) {
  if (isSupabaseConfigured) {
    await supabase.from('riders').update({ status: newStatus }).eq('id', riderId);
  }
  const currentRiders = getLocalStore('riders', INITIAL_RIDERS);
  const updated = currentRiders.map(r => r.id === riderId ? { ...r, status: newStatus } : r);
  setLocalStore('riders', updated);
}

// SECURE GEOLOCATION LOCATION RECORDING
export async function recordRiderLocation({ order_id, rider_id, latitude, longitude, accuracy = 10 }) {
  const locationPayload = {
    order_id,
    rider_id,
    latitude: Number(latitude),
    longitude: Number(longitude),
    accuracy: Number(accuracy),
    recorded_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('delivery_locations')
      .insert([locationPayload])
      .select()
      .single();
    if (!error && data) return data;
  }

  const key = `location_${order_id}`;
  setLocalStore(key, locationPayload);

  const ridersList = getLocalStore('riders', INITIAL_RIDERS);
  const updatedRiders = ridersList.map(r => r.id === rider_id ? { ...r, lat: latitude, lng: longitude } : r);
  setLocalStore('riders', updatedRiders);

  return locationPayload;
}

export async function fetchLatestOrderLocation(orderId) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('delivery_locations')
      .select('*')
      .eq('order_id', orderId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();
    if (!error && data) return data;
  }
  return getLocalStore(`location_${orderId}`, null);
}

export async function addProduct(productData) {
  const newProd = {
    id: `p_${Date.now()}`,
    ...productData,
    price: Number(productData.price),
    stock: Number(productData.stock || 50),
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('products').insert([newProd]).select().single();
    if (!error && data) return data;
  }

  const currentProds = getLocalStore('products', []);
  const updated = [newProd, ...currentProds];
  setLocalStore('products', updated);
  return newProd;
}

// REALTIME SUBSCRIPTIONS
export function subscribeToGlobalRealtime(onDataChanged) {
  if (isSupabaseConfigured && supabase) {
    const channel = supabase
      .channel('global_db_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          onDataChanged(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } else {
    const handler = () => onDataChanged({ event: 'LOCAL_UPDATE' });
    fallbackBus.addEventListener('update', handler);
    return () => {
      fallbackBus.removeEventListener('update', handler);
    };
  }
}

export function subscribeToOrderLocation(orderId, onLocationUpdate) {
  if (isSupabaseConfigured && supabase) {
    const channel = supabase
      .channel(`location_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'delivery_locations',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          onLocationUpdate(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } else {
    const handler = () => {
      const loc = getLocalStore(`location_${orderId}`, null);
      if (loc) onLocationUpdate(loc);
    };
    fallbackBus.addEventListener('update', handler);
    return () => {
      fallbackBus.removeEventListener('update', handler);
    };
  }
}

// NVIDIA AI ASSISTANT API FUNCTION
export async function fetchAiShoppingRecommendations(userPrompt, catalog) {
  const nvidiaKey = import.meta.env.VITE_NVIDIA_API_KEY || '';

  if (nvidiaKey) {
    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${nvidiaKey}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [
            {
              role: "system",
              content: `You are TownDrop AI Shopping Assistant for small town residents. Given a user request, select relevant products from this JSON catalog: ${JSON.stringify(catalog)}. Return ONLY JSON array of product IDs matching the request.`
            },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 150
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const matchedIds = JSON.parse(content.replace(/```json|```/g, '').trim());
        return catalog.filter(p => matchedIds.includes(p.id));
      }
    } catch (e) {
      console.warn('NVIDIA API fallback to keyword matching:', e);
    }
  }

  // Keyword Matching Fallback AI Engine
  const promptLower = userPrompt.toLowerCase();
  if (promptLower.includes('poha')) {
    return catalog.filter(p => ['Poha', 'Onions', 'Peanuts', 'Mustard Oil'].some(kw => p.name.toLowerCase().includes(kw.toLowerCase())));
  }
  if (promptLower.includes('hardware') || promptLower.includes('hammer') || promptLower.includes('repair') || promptLower.includes('pipe')) {
    return catalog.filter(p => p.category === 'Hardware');
  }
  if (promptLower.includes('fever') || promptLower.includes('medicine') || promptLower.includes('pain')) {
    return catalog.filter(p => p.category === 'Pharmacy');
  }

  return catalog.filter(p => 
    promptLower.split(' ').some(word => word.length > 2 && p.name.toLowerCase().includes(word))
  ).slice(0, 3);
}

// Category-based product fallback image mapping
export function getProductImage(product, merchant) {
  if (product?.image_url && product.image_url.trim() !== '') {
    return product.image_url;
  }
  
  const cat = (product?.category || '').toLowerCase();
  const name = (product?.name || '').toLowerCase();
  
  // 1. High priority name-based overrides
  if (name.includes('bulb') || name.includes('led') || name.includes('switch') || name.includes('cord') || name.includes('wire') || name.includes('plug') || name.includes('light')) {
    return 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=600&q=80'; // Electrical / LED Bulb
  }
  if (name.includes('drill') || name.includes('hammer') || name.includes('nail') || name.includes('screw') || name.includes('saw') || name.includes('wrench') || name.includes('tool')) {
    return 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80'; // Tool / Hammer
  }
  if (name.includes('tablet') || name.includes('pill') || name.includes('capsule') || name.includes('syrup') || name.includes('paracetamol') || name.includes('bandage') || name.includes('ors') || name.includes('medicine')) {
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'; // Medicine / Pills
  }
  if (name.includes('rice') || name.includes('oil') || name.includes('poha') || name.includes('onion') || name.includes('peanut') || name.includes('salt') || name.includes('sugar') || name.includes('atta')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'; // Grocery / Rice
  }
  if (name.includes('mango') || name.includes('tomato') || name.includes('spinach') || name.includes('fruit') || name.includes('veg') || name.includes('apple') || name.includes('banana')) {
    return 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80'; // Fresh Fruit
  }
  if (name.includes('bottle') || name.includes('cloth') || name.includes('clean') || name.includes('brush') || name.includes('soap') || name.includes('shampoo')) {
    return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'; // Home Needs
  }
  
  // 2. Category fallback mapping
  if (cat.includes('hardware') || cat.includes('tool')) {
    return 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80'; // Tool / Hammer
  }
  if (cat.includes('pharmacy') || cat.includes('medicine') || cat.includes('medical') || cat.includes('health')) {
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'; // Medicine / Pills
  }
  if (cat.includes('grocery') || cat.includes('kirana') || cat.includes('rice') || cat.includes('food')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'; // Grocery / Rice
  }
  if (cat.includes('electrical') || cat.includes('light')) {
    return 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=600&q=80'; // Electrical / LED Bulb
  }
  if (cat.includes('fresh') || cat.includes('fruit') || cat.includes('veg')) {
    return 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80'; // Fresh Fruit
  }
  if (cat.includes('home') || cat.includes('house')) {
    return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'; // Home Needs
  }
  
  // Try merchant's cover image as secondary fallback, otherwise general default
  return merchant?.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
}


