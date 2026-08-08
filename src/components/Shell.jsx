import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LoginScreen from './LoginScreen';
import CustomerBrowseShops from './CustomerBrowseShops';
import CustomerShopCart from './CustomerShopCart';
import CustomerOrderTracking from './CustomerOrderTracking';
import MerchantDashboard from './MerchantDashboard';
import RiderDashboard from './RiderDashboard';
import AdminDashboard from './AdminDashboard';

export default function Shell() {
  const { role, profile, logout, isSupabaseConfigured, demoLogin } = useApp();
  const [customerSubView, setCustomerSubView] = useState('browse'); // 'browse' | 'shop' | 'tracking'
  const [showDevPanel, setShowDevPanel] = useState(false);

  // If not authenticated, render Login Screen
  if (!role || !profile) {
    return <LoginScreen />;
  }

  const getRoleBadge = (r) => {
    switch (r) {
      case 'customer': return '🛍️ Customer';
      case 'merchant': return '🏪 Merchant';
      case 'rider': return '🛵 Rider';
      case 'admin': return '⚡ Admin';
      default: return r;
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen antialiased flex flex-col">
      {/* Top Navigation Bar (Authenticated State) */}
      <header className="bg-surface dark:bg-surface-dim shadow-[0px_4px_12px_rgba(26,26,26,0.05)] docked full-width top-0 flex justify-between items-center w-full px-container-margin py-md sticky top-0 z-50">
        {/* Brand Logo & Location */}
        <div className="flex items-center gap-md">
          <div className="text-headline-md font-headline-md font-bold text-primary">
            LocalConnect
          </div>
          <span className="hidden sm:inline-flex items-center gap-xs bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm px-sm py-xs rounded-full border border-outline-variant">
            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
            <span>Karmala Town</span>
          </span>
        </div>

        {/* User Account Info & Logout */}
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm bg-surface-container-low px-md py-xs rounded-full border border-outline-variant">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
              {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                {profile.full_name}
              </span>
              <span className="font-label-sm text-[11px] text-secondary leading-tight">
                {getRoleBadge(role)}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-xs bg-surface-container-highest text-secondary hover:bg-error-container hover:text-on-error-container px-md py-sm rounded-full font-label-md text-label-md transition-colors shadow-xs"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation Bar */}
        <aside className="hidden md:flex flex-col w-64 bg-surface-container-lowest border-r border-outline-variant pt-lg pb-md px-md gap-sm shrink-0">
          <div className="flex items-center gap-md mb-lg px-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
              {role[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface font-bold">{profile.full_name}</h3>
              <p className="font-label-sm text-label-sm text-secondary capitalize">{getRoleBadge(role)}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-xs">
            {role === 'customer' && (
              <>
                <button
                  onClick={() => setCustomerSubView('browse')}
                  className={`flex items-center gap-md font-label-md text-label-md rounded-xl px-md py-sm transition-all text-left ${
                    customerSubView === 'browse'
                      ? 'bg-primary-fixed text-on-primary-fixed font-bold border-l-4 border-primary'
                      : 'text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined">storefront</span>
                  <span>Browse Shops</span>
                </button>
                <button
                  onClick={() => setCustomerSubView('shop')}
                  className={`flex items-center gap-md font-label-md text-label-md rounded-xl px-md py-sm transition-all text-left ${
                    customerSubView === 'shop'
                      ? 'bg-primary-fixed text-on-primary-fixed font-bold border-l-4 border-primary'
                      : 'text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined">shopping_basket</span>
                  <span>Shop & Cart</span>
                </button>
                <button
                  onClick={() => setCustomerSubView('tracking')}
                  className={`flex items-center gap-md font-label-md text-label-md rounded-xl px-md py-sm transition-all text-left ${
                    customerSubView === 'tracking'
                      ? 'bg-primary-fixed text-on-primary-fixed font-bold border-l-4 border-primary'
                      : 'text-secondary hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined">local_shipping</span>
                  <span>Live Tracking</span>
                </button>
              </>
            )}

            {role === 'merchant' && (
              <div className="flex items-center gap-md bg-primary-fixed text-on-primary-fixed font-bold rounded-xl px-md py-sm border-l-4 border-primary font-label-md text-label-md">
                <span className="material-symbols-outlined">dashboard</span>
                <span>Store Management</span>
              </div>
            )}

            {role === 'rider' && (
              <div className="flex items-center gap-md bg-primary-fixed text-on-primary-fixed font-bold rounded-xl px-md py-sm border-l-4 border-primary font-label-md text-label-md">
                <span className="material-symbols-outlined">two_wheeler</span>
                <span>Deliveries Queue</span>
              </div>
            )}

            {role === 'admin' && (
              <div className="flex items-center gap-md bg-primary-fixed text-on-primary-fixed font-bold rounded-xl px-md py-sm border-l-4 border-primary font-label-md text-label-md">
                <span className="material-symbols-outlined">insights</span>
                <span>Platform Ops</span>
              </div>
            )}
          </nav>

          {/* Database connection badge */}
          <div className="mt-auto p-sm bg-surface-container-low rounded-lg text-label-sm text-secondary space-y-unit">
            <div className="font-bold text-on-surface">Data Connection</div>
            <div>Mode: {isSupabaseConfigured ? '🟢 Live Supabase DB' : '🟡 Local Realtime'}</div>
          </div>
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
              </>
            )}

            {role === 'merchant' && <MerchantDashboard />}
            {role === 'rider' && <RiderDashboard />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        </main>
      </div>

      {/* DEV / DEMO FOOTER PANEL (For quick role switching during presentation) */}
      <div className="bg-surface-container-highest border-t border-outline-variant py-xs px-container-margin flex justify-between items-center text-label-sm text-secondary">
        <div className="flex items-center gap-xs">
          <span className="font-bold text-on-surface">Demo Control:</span>
          <span>Switch Session Role:</span>
        </div>
        <div className="flex gap-xs">
          <button onClick={() => demoLogin('customer')} className={`px-sm py-unit rounded text-xs ${role === 'customer' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container hover:bg-surface-container-high'}`}>
            🛍️ Customer
          </button>
          <button onClick={() => demoLogin('merchant')} className={`px-sm py-unit rounded text-xs ${role === 'merchant' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container hover:bg-surface-container-high'}`}>
            🏪 Merchant
          </button>
          <button onClick={() => demoLogin('rider')} className={`px-sm py-unit rounded text-xs ${role === 'rider' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container hover:bg-surface-container-high'}`}>
            🛵 Rider
          </button>
          <button onClick={() => demoLogin('admin')} className={`px-sm py-unit rounded text-xs ${role === 'admin' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container hover:bg-surface-container-high'}`}>
            ⚡ Admin
          </button>
        </div>
      </div>
    </div>
  );
}
