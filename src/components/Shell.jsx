import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LoginScreen from './LoginScreen';
import CustomerBrowseShops from './CustomerBrowseShops';
import CustomerShopCart from './CustomerShopCart';
import CustomerOrderTracking from './CustomerOrderTracking';
import CustomerOrderHistory from './CustomerOrderHistory';
import MerchantDashboard from './MerchantDashboard';
import RiderDashboard from './RiderDashboard';
import AdminDashboard from './AdminDashboard';
import logoImg from '../assets/logo.png';

export default function Shell() {
  const { role, profile, logout, cart } = useApp();
  const [customerSubView, setCustomerSubView] = useState('browse'); // 'browse' | 'shop' | 'tracking' | 'orders'

  // If not authenticated, render Login Screen
  if (!role || !profile) {
    return <LoginScreen />;
  }

  const cartItemsCount = cart?.reduce((sum, item) => sum + item.qty, 0) || 0;

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen antialiased flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-surface-container-lowest shadow-[0px_2px_8px_rgba(26,26,26,0.06)] flex justify-between items-center w-full px-container-margin py-xs md:py-sm sticky top-0 z-50">
        {/* Brand Logo & Location */}
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs cursor-pointer" onClick={() => role === 'customer' && setCustomerSubView('browse')}>
            <img src={logoImg} alt="LocalConnect" className="h-9 md:h-11 object-contain" />
          </div>
          <span className="hidden sm:inline-flex items-center gap-xs bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm px-sm py-xs rounded-full border border-outline-variant">
            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
            <span>Karmala Town</span>
          </span>
        </div>

        {/* User Account Info & Logout */}
        <div className="flex items-center gap-sm">
          {/* Cart badge for customers */}
          {role === 'customer' && cartItemsCount > 0 && (
            <button
              onClick={() => setCustomerSubView('shop')}
              className="relative flex items-center gap-xs bg-primary-fixed text-on-primary-fixed px-sm py-xs rounded-full text-xs font-bold hover:bg-primary-fixed-dim transition-colors"
            >
              <span className="material-symbols-outlined text-sm">shopping_cart</span>
              <span>{cartItemsCount}</span>
            </button>
          )}

          <div className="flex items-center gap-sm bg-surface-container-low px-sm py-xs rounded-full border border-outline-variant">
            <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
              {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface font-bold leading-tight text-xs">
                {profile.full_name}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-xs bg-surface-container-highest text-secondary hover:bg-error-container hover:text-on-error-container px-sm py-xs rounded-full font-label-md text-label-md transition-colors text-xs"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation Bar */}
        <aside className="hidden md:flex flex-col w-56 bg-surface-container-lowest border-r border-outline-variant pt-md pb-md px-sm gap-xs shrink-0">
          <div className="flex items-center gap-sm mb-md px-sm">
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
              {role[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface font-bold text-xs">{profile.full_name}</h3>
              <p className="font-label-sm text-label-sm text-secondary text-[11px] capitalize">
                {role === 'customer' ? '🛍️ Customer' : role === 'merchant' ? '🏪 Merchant' : role === 'rider' ? '🛵 Rider' : '⚡ Admin'}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-xs">
            {role === 'customer' && (
              <>
                <button
                  onClick={() => setCustomerSubView('browse')}
                  className={`flex items-center gap-sm font-label-md text-label-md rounded-xl px-sm py-sm transition-all text-left text-xs ${
                    customerSubView === 'browse'
                      ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                      : 'text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">storefront</span>
                  <span>Browse Shops</span>
                </button>
                <button
                  onClick={() => setCustomerSubView('shop')}
                  className={`flex items-center gap-sm font-label-md text-label-md rounded-xl px-sm py-sm transition-all text-left text-xs ${
                    customerSubView === 'shop'
                      ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                      : 'text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">shopping_basket</span>
                  <span>Shop & Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="ml-auto bg-primary text-on-primary text-[10px] font-bold px-xs py-0 rounded-full">{cartItemsCount}</span>
                  )}
                </button>
                <button
                  onClick={() => setCustomerSubView('orders')}
                  className={`flex items-center gap-sm font-label-md text-label-md rounded-xl px-sm py-sm transition-all text-left text-xs ${
                    customerSubView === 'orders'
                      ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                      : 'text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">receipt_long</span>
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setCustomerSubView('tracking')}
                  className={`flex items-center gap-sm font-label-md text-label-md rounded-xl px-sm py-sm transition-all text-left text-xs ${
                    customerSubView === 'tracking'
                      ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                      : 'text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">local_shipping</span>
                  <span>Live Tracking</span>
                </button>
              </>
            )}

            {role === 'merchant' && (
              <div className="flex items-center gap-sm bg-primary-fixed text-on-primary-fixed font-bold rounded-xl px-sm py-sm font-label-md text-label-md text-xs">
                <span className="material-symbols-outlined text-lg">dashboard</span>
                <span>Store Management</span>
              </div>
            )}

            {role === 'rider' && (
              <div className="flex items-center gap-sm bg-primary-fixed text-on-primary-fixed font-bold rounded-xl px-sm py-sm font-label-md text-label-md text-xs">
                <span className="material-symbols-outlined text-lg">two_wheeler</span>
                <span>Deliveries</span>
              </div>
            )}

            {role === 'admin' && (
              <div className="flex items-center gap-sm bg-primary-fixed text-on-primary-fixed font-bold rounded-xl px-sm py-sm font-label-md text-label-md text-xs">
                <span className="material-symbols-outlined text-lg">insights</span>
                <span>Platform Ops</span>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 p-container-margin md:p-xl overflow-y-auto bg-background">
          <div className="max-w-6xl mx-auto">
            {role === 'customer' && (
              <>
                {customerSubView === 'browse' && (
                  <CustomerBrowseShops
                    onOpenShop={() => setCustomerSubView('shop')}
                  />
                )}
                {customerSubView === 'shop' && (
                  <CustomerShopCart
                    onBackToShops={() => setCustomerSubView('browse')}
                    onOrderPlaced={() => setCustomerSubView('tracking')}
                  />
                )}
                {customerSubView === 'tracking' && (
                  <CustomerOrderTracking
                    onBackToShops={() => setCustomerSubView('browse')}
                  />
                )}
                {customerSubView === 'orders' && (
                  <CustomerOrderHistory
                    onViewTracking={() => setCustomerSubView('tracking')}
                    onBackToShops={() => setCustomerSubView('browse')}
                  />
                )}
              </>
            )}

            {role === 'merchant' && <MerchantDashboard />}
            {role === 'rider' && <RiderDashboard />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
}
