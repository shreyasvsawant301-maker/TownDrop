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

// Pre-created Demo Accounts Definition
export const DEMO_ACCOUNTS = {
  customer: {
    email: 'customer@localconnect.demo',
    password: 'password123',
    full_name: 'Shreyas',
    phone: '+91 98765 00001',
    role: 'customer'
  },
  merchant: {
    email: 'merchant@localconnect.demo',
    password: 'password123',
    full_name: 'VSC Kanedi Hardware',
    phone: '+91 98765 00002',
    role: 'merchant'
  },
  rider: {
    email: 'rider@localconnect.demo',
    password: 'password123',
    full_name: 'Vikram Singh',
    phone: '+91 98765 43210',
    role: 'rider'
  },
  admin: {
    email: 'admin@localconnect.demo',
    password: 'password123',
    full_name: 'Platform Ops Admin',
    phone: '+91 98765 00000',
    role: 'admin'
  }
};

// Initial Fallback Seed Data
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
  }
];

const INITIAL_PRODUCTS = [
  // Sharma Grocers
  { id: 'p101', merchant_id: 'm1111111-1111-1111-1111-111111111111', name: 'Premium Basmati Rice', price: 180, stock: 45, unit: '1 kg', category: 'Grocery', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { id: 'p102', merchant_id: 'm1111111-1111-1111-1111-111111111111', name: 'Cold Pressed Mustard Oil', price: 220, stock: 30, unit: '1 Litre', category: 'Grocery', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
  { id: 'p103', merchant_id: 'm1111111-1111-1111-1111-111111111111', name: 'Fresh Coriander Bunch', price: 25, stock: 100, unit: '100g', category: 'Fresh', image_url: 'https://images.unsplash.com/photo-1588879460405-5609fa84742a?auto=format&fit=crop&w=600&q=80' },
  
  // VSC Kanedi Hardware Shop
  { id: 'p201', merchant_id: 'm2222222-2222-2222-2222-222222222222', name: 'Heavy-Duty Steel Hammer', price: 350, stock: 15, unit: '1 pc', category: 'Hardware', image_url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80' },
  { id: 'p202', merchant_id: 'm2222222-2222-2222-2222-222222222222', name: 'Galvanized Nails (1-inch)', price: 120, stock: 50, unit: '500g box', category: 'Hardware', image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80' },
  { id: 'p203', merchant_id: 'm2222222-2222-2222-2222-222222222222', name: 'PVC Plumbing Pipe (3m)', price: 240, stock: 20, unit: '1 pipe', category: 'Hardware', image_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80' },

  // Apollo Pharmacy
  { id: 'p301', merchant_id: 'm3333333-3333-3333-3333-333333333333', name: 'Paracetamol 650mg Tablets', price: 45, stock: 100, unit: 'Strip of 15', category: 'Pharmacy', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
  { id: 'p302', merchant_id: 'm3333333-3333-3333-3333-333333333333', name: 'Waterproof Bandages', price: 60, stock: 75, unit: 'Pack of 20', category: 'Pharmacy', image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80' }
];

const INITIAL_RIDERS = [
  { id: 'r1111111-1111-1111-1111-111111111111', name: 'Vikram Singh', phone: '+91 98765 43210', status: 'available', lat: 18.4060, lng: 75.1930 },
  { id: 'r2222222-2222-2222-2222-222222222222', name: 'Amit Kumar', phone: '+91 98765 43211', status: 'busy', lat: 18.4200, lng: 75.2100 }
];

const INITIAL_ORDERS = [
  {
    id: 'o1001',
    customer_name: 'Shreyas',
    merchant_id: 'm2222222-2222-2222-2222-222222222222',
    rider_id: null,
    items: [
      { name: 'Heavy-Duty Steel Hammer', qty: 2, price: 350 },
      { name: 'PVC Plumbing Pipe (3m)', qty: 1, price: 240 }
    ],
    total: 940,
    status: 'placed',
    created_at: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

// Haversine distance calculator
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
  return Number((R * c).toFixed(1));
}

// Local Storage Helper
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

// AUTH FUNCTIONS (REAL SUPABASE AUTH CONNECTIVITY)
export async function signInUser(email, password) {
  if (isSupabaseConfigured && supabase) {
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // Auto-create user in Supabase Auth if demo user isn't created in Supabase project yet
    if (error && (error.message.includes('Invalid login credentials') || error.status === 400)) {
      const demoKey = Object.keys(DEMO_ACCOUNTS).find(k => DEMO_ACCOUNTS[k].email === email);
      const fullName = demoKey ? DEMO_ACCOUNTS[demoKey].full_name : email.split('@')[0];
      const role = demoKey ? DEMO_ACCOUNTS[demoKey].role : 'customer';

      const signUpRes = await supabase.auth.signUp({ email, password });
      if (signUpRes.data?.user) {
        data = signUpRes.data;
        await supabase.from('profiles').upsert([{ id: data.user.id, full_name: fullName, role }]);
        error = null;
      }
    }

    if (!error && data?.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      const demoKey = Object.keys(DEMO_ACCOUNTS).find(k => DEMO_ACCOUNTS[k].email === email);
      const userRole = profile?.role || (demoKey ? DEMO_ACCOUNTS[demoKey].role : 'customer');
      const fullName = profile?.full_name || (demoKey ? DEMO_ACCOUNTS[demoKey].full_name : email.split('@')[0]);

      const userProfile = { id: data.user.id, full_name: fullName, role: userRole };
      setLocalStore('active_session', { user: data.user, profile: userProfile });
      return { user: data.user, profile: userProfile };
    }
  }

  // Fallback User Authentication
  const matchedDemoKey = Object.keys(DEMO_ACCOUNTS).find(k => DEMO_ACCOUNTS[k].email === email);
  if (matchedDemoKey) {
    const demo = DEMO_ACCOUNTS[matchedDemoKey];
    const mockUser = { id: `user_${matchedDemoKey}`, email: demo.email };
    const mockProfile = { id: mockUser.id, full_name: demo.full_name, role: demo.role, phone: demo.phone };
    setLocalStore('active_session', { user: mockUser, profile: mockProfile });
    return { user: mockUser, profile: mockProfile };
  }

  const mockUser = { id: `user_${Date.now()}`, email };
  const mockProfile = { id: mockUser.id, full_name: email.split('@')[0], role: 'customer' };
  setLocalStore('active_session', { user: mockUser, profile: mockProfile });
  return { user: mockUser, profile: mockProfile };
}

export async function signUpUser(email, password, fullName, role = 'customer') {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error && data?.user) {
      await supabase.from('profiles').upsert([{ id: data.user.id, full_name: fullName, role }]);
      const profile = { id: data.user.id, full_name: fullName, role };
      setLocalStore('active_session', { user: data.user, profile });
      return { user: data.user, profile };
    }
  }

  const mockUser = { id: `user_${Date.now()}`, email };
  const mockProfile = { id: mockUser.id, full_name: fullName, role };
  setLocalStore('active_session', { user: mockUser, profile: mockProfile });
  return { user: mockUser, profile: mockProfile };
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

// DATA ACCESS APIS
export async function fetchMerchants() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('merchants').select('*');
    if (!error && data?.length) return data;
  }
  return getLocalStore('merchants', INITIAL_MERCHANTS);
}

export async function fetchProducts(merchantId = null) {
  if (isSupabaseConfigured) {
    let query = supabase.from('products').select('*');
    if (merchantId) query = query.eq('merchant_id', merchantId);
    const { data, error } = await query;
    if (!error && data?.length) return data;
  }
  const products = getLocalStore('products', INITIAL_PRODUCTS);
  return merchantId ? products.filter(p => p.merchant_id === merchantId) : products;
}

export async function fetchRiders() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('riders').select('*');
    if (!error && data?.length) return data;
  }
  return getLocalStore('riders', INITIAL_RIDERS);
}

export async function fetchOrders() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  return getLocalStore('orders', INITIAL_ORDERS);
}

export async function createOrder(newOrderData) {
  const orderObj = {
    id: `o_${Date.now()}`,
    customer_name: newOrderData.customer_name || 'Shreyas',
    merchant_id: newOrderData.merchant_id,
    rider_id: null,
    items: newOrderData.items,
    total: newOrderData.total,
    status: 'placed',
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
  if (isSupabaseConfigured) {
    const updatePayload = { status: nextStatus };
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
        rider_id: riderId !== null ? riderId : ord.rider_id
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

  const currentProds = getLocalStore('products', INITIAL_PRODUCTS);
  const updated = [newProd, ...currentProds];
  setLocalStore('products', updated);
  return newProd;
}

// GLOBAL REALTIME SUBSCRIPTION
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
