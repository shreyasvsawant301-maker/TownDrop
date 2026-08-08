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
  assignNearestRider as dbAssignNearestRider,
  subscribeToGlobalRealtime,
  signInUser,
  signUpUser,
  signOutUser,
  getStoredSession,
  DEMO_ACCOUNTS
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
  
  const [selectedMerchantId, setSelectedMerchantId] = useState('m2222222-2222-2222-2222-222222222222'); // VSC Kanedi Hardware default
  const [activeOrderId, setActiveOrderId] = useState('o1001');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load state from DB/Fallback
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

  const signUp = async (email, password, fullName, userRole) => {
    const res = await signUpUser(email, password, fullName, userRole);
    setSession(res);
    return res;
  };

  const demoLogin = async (targetRole) => {
    const demo = DEMO_ACCOUNTS[targetRole] || DEMO_ACCOUNTS.customer;
    const res = await signInUser(demo.email, demo.password);
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
        const newQty = updated[existingIndex].qty + qty;
        if (newQty <= 0) {
          return updated.filter((_, idx) => idx !== existingIndex);
        }
        updated[existingIndex] = { ...updated[existingIndex], qty: newQty };
        return updated;
      } else {
        if (qty <= 0) return prev;
        return [...prev, { product, qty }];
      }
    });
  };

  const updateCartQty = (productId, qty) => {
    setCart(prev => {
      if (qty <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }
      return prev.map(item => item.product.id === productId ? { ...item, qty } : item);
    });
  };

  const clearCart = () => setCart([]);

  // Place Order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return null;

    const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
    const itemsPayload = cart.map(item => ({
      name: item.product.name,
      qty: item.qty,
      price: item.product.price
    }));

    const newOrder = await dbCreateOrder({
      customer_name: profile?.full_name || 'Shreyas',
      merchant_id: selectedMerchantId,
      items: itemsPayload,
      total: totalAmount
    });

    setCart([]);
    if (newOrder?.id) {
      setActiveOrderId(newOrder.id);
    }
    await refreshData();
    return newOrder;
  };

  // Merchant Accept Order (with Smart Nearest Rider Allocation Algorithm)
  const handleAcceptOrder = async (orderId, merchantId) => {
    const assignedRider = await dbAssignNearestRider(orderId, merchantId || selectedMerchantId);
    await refreshData();
    return assignedRider;
  };

  // Advance Order Status
  const handleAdvanceOrderStatus = async (orderId, nextStatus) => {
    const currentOrder = orders.find(o => o.id === orderId);
    await dbUpdateOrderStatus(orderId, nextStatus, currentOrder?.rider_id);

    if (nextStatus === 'delivered' && currentOrder?.rider_id) {
      await dbUpdateRiderStatus(currentOrder.rider_id, 'available');
    }
    await refreshData();
  };

  // Add Product
  const handleAddProduct = async (productData) => {
    await dbAddProduct({
      ...productData,
      merchant_id: selectedMerchantId
    });
    await refreshData();
  };

  // Toggle Rider Status
  const handleToggleRiderStatus = async (riderId) => {
    const r = riders.find(item => item.id === riderId);
    if (!r) return;
    const nextStatus = r.status === 'available' ? 'busy' : 'available';
    await dbUpdateRiderStatus(riderId, nextStatus);
    await refreshData();
  };

  const value = {
    session,
    user,
    profile,
    role,
    login,
    signUp,
    demoLogin,
    logout,
    merchants,
    products,
    riders,
    orders,
    selectedMerchantId,
    setSelectedMerchantId,
    activeOrderId,
    setActiveOrderId,
    cart,
    addToCart,
    updateCartQty,
    clearCart,
    placeOrder: handlePlaceOrder,
    acceptOrder: handleAcceptOrder,
    advanceOrderStatus: handleAdvanceOrderStatus,
    addNewProduct: handleAddProduct,
    toggleRiderStatus: handleToggleRiderStatus,
    refreshData,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
