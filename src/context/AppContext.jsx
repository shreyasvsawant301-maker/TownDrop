import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchMerchants,
  fetchProducts,
  fetchRiders,
  fetchOrders,
  createOrder as dbCreateOrder,
  updateOrderStatus as dbUpdateOrderStatus,
  updateRiderStatus as dbUpdateRiderStatus,
  addProduct as dbAddProduct,
  updateMerchantSettings as dbUpdateMerchantSettings,
  assignNearestRider as dbAssignNearestRider,
  subscribeToGlobalRealtime,
  signInUser,
  signUpUser,
  signOutUser,
  getStoredSession,
  isSupabaseConfigured
} from '../lib/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Session / Profile state
  const [session, setSession] = useState(() => getStoredSession());
  const user = session?.user || null;
  const profile = session?.profile || null;
  const role = profile?.role || null; // Null when not logged in!

  const [merchants, setMerchants] = useState([]);
  const [products, setProducts] = useState([]);
  const [riders, setRiders] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [selectedMerchantId, setSelectedMerchantId] = useState('m2222222-2222-2222-2222-222222222222');
  const [activeOrderId, setActiveOrderId] = useState('TD1024');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load state from DB
  const refreshData = useCallback(async () => {
    try {
      const [m, p, r, o] = await Promise.all([
        fetchMerchants(),
        fetchProducts(),
        fetchRiders(),
        fetchOrders()
      ]);
      setMerchants(m || []);
      setProducts(p || []);
      setRiders(r || []);
      setOrders(o || []);
    } catch (e) {
      console.error('Error refreshing data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize data on mount + setup SINGLE GLOBAL REALTIME SUBSCRIPTION
  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeToGlobalRealtime(() => {
      refreshData();
    });
    return () => {
      unsubscribe();
    };
  }, [refreshData]);

  // AUTH ACTIONS
  const login = async (email, password) => {
    const res = await signInUser(email, password);
    setSession(res);
    return res;
  };

  const signUp = async (email, password, fullName, userRole, phone) => {
    const res = await signUpUser(email, password, fullName, userRole, phone);
    setSession(res);
    return res;
  };

  const logout = async () => {
    await signOutUser();
    setSession(null);
    setCart([]);
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        return updated;
      }
      return [...prev, { product, qty }];
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  // Business actions
  const placeOrder = async () => {
    if (cart.length === 0) return null;

    const merchantId = cart[0].product.merchant_id;
    const itemsPayload = cart.map(i => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      qty: i.qty
    }));

    const created = await dbCreateOrder({
      customer_name: profile?.full_name || 'Customer',
      merchant_id: merchantId,
      items: itemsPayload,
      total: cartTotal
    });

    if (created) {
      setActiveOrderId(created.id);
      clearCart();
      await refreshData();
      return created;
    }
    return null;
  };

  const acceptOrder = async (orderId, merchantId) => {
    const assignedRider = await dbAssignNearestRider(orderId, merchantId);
    await refreshData();
    return assignedRider;
  };

  const updateOrderStatus = async (orderId, nextStatus, riderId = null) => {
    const updated = await dbUpdateOrderStatus(orderId, nextStatus, riderId);
    await refreshData();
    return updated;
  };

  const updateRiderStatus = async (riderId, newStatus) => {
    await dbUpdateRiderStatus(riderId, newStatus);
    await refreshData();
  };

  const addNewProduct = async (productData) => {
    const created = await dbAddProduct(productData);
    await refreshData();
    return created;
  };

  const updateMerchantInfo = async (merchantId, settingsPayload) => {
    const updated = await dbUpdateMerchantSettings(merchantId, settingsPayload);
    await refreshData();
    return updated;
  };

  const value = {
    session,
    user,
    profile,
    role,
    merchants,
    products,
    riders,
    orders,
    selectedMerchantId,
    setSelectedMerchantId,
    activeOrderId,
    setActiveOrderId,
    cart,
    cartTotal,
    loading,
    login,
    signUp,
    logout,
    addToCart,
    updateCartQty,
    clearCart,
    placeOrder,
    acceptOrder,
    updateOrderStatus,
    updateRiderStatus,
    addNewProduct,
    updateMerchantInfo,
    refreshData,
    isSupabaseConfigured
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
