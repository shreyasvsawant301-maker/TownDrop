import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AiShoppingAssistant from './AiShoppingAssistant';

export default function CustomerBrowseShops({ onOpenShop }) {
  const { merchants, setSelectedMerchantId, profile, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { label: 'All', icon: '🏪' },
    { label: 'Grocery', icon: '🛒' },
    { label: 'Hardware', icon: '🔨' },
    { label: 'Pharmacy', icon: '💊' },
    { label: 'Electrical', icon: '⚡' },
    { label: 'Home', icon: '🧹' },
    { label: 'Fresh', icon: '🥬' }
  ];

  const filteredMerchants = merchants.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || m.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectShop = (merchantId) => {
    setSelectedMerchantId(merchantId);
    onOpenShop();
  };

  const handleAddAiRecommendedToCart = (recommendedItems) => {
    recommendedItems.forEach(item => addToCart(item));
    if (recommendedItems[0]) {
      setSelectedMerchantId(recommendedItems[0].merchant_id);
      onOpenShop();
    }
  };

  return (
    <div className="space-y-lg">
      {/* Welcome Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-md md:p-lg border border-surface-variant shadow-sm space-y-md">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-label-sm font-label-sm text-secondary block mb-xs">
              📍 Karmala Town • Sector 4
            </span>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Good day, {profile?.full_name || 'Shreyas'} 👋
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              What would you like to order from your local market today?
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-xs bg-tertiary-fixed text-on-tertiary-fixed px-md py-xs rounded-full text-label-sm font-bold">
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span>Hyperlocal Delivery</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-secondary">
            search
          </span>
          <input
            type="text"
            placeholder="Search shops or products (e.g. Hammer, Rice, Paracetamol)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-xl pr-md py-sm bg-surface-container border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* NVIDIA AI Shopping Assistant */}
      <AiShoppingAssistant onAddRecommendedToCart={handleAddAiRecommendedToCart} />

      {/* Category Chips */}
      <section className="space-y-sm">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          What are you looking for?
        </h2>
        <div className="flex gap-sm overflow-x-auto pb-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-xs px-md py-sm rounded-full font-label-md text-label-md transition-all shrink-0 border ${
                selectedCategory === cat.label
                  ? 'bg-primary text-on-primary border-primary shadow-xs font-bold'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Merchants Grid */}
      <section className="space-y-md">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Nearby Local Shops
          </h2>
          <span className="font-label-sm text-label-sm text-secondary">
            Delivering directly from Karmala merchants
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {filteredMerchants.map((merchant) => (
            <div
              key={merchant.id}
              onClick={() => handleSelectShop(merchant.id)}
              className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-surface-container">
                  <img
                    src={merchant.image_url}
                    alt={merchant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-sm right-sm bg-surface/90 backdrop-blur-xs text-on-surface font-label-sm text-xs px-sm py-unit rounded-full font-bold shadow-xs">
                    {merchant.rating ? `⭐ ${merchant.rating}` : '⭐ 4.8'}
                  </span>
                  <span className="absolute bottom-sm left-sm bg-primary/90 text-on-primary font-label-sm text-xs px-sm py-unit rounded-full font-bold">
                    {merchant.eta_range || '15-25 min'} • {merchant.distance_km || 1.2} km
                  </span>
                </div>

                <div className="p-md space-y-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
                      {merchant.category}
                    </span>
                    <span className="text-xs text-tertiary font-bold">Open Now</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    {merchant.name}
                  </h3>
                  <p className="font-body-sm text-xs text-secondary">
                    📍 {merchant.town || 'Karmala Town'} • Verified Town Merchant
                  </p>
                </div>
              </div>

              <div className="p-md pt-0">
                <button className="w-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md py-sm rounded-xl font-bold group-hover:bg-primary group-hover:text-on-primary transition-colors flex items-center justify-center gap-xs">
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  Browse Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
