import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CustomerBrowseShops({ onOpenShop }) {
  const { merchants, setSelectedMerchantId, profile } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'All', icon: '🏪' },
    { id: 'Kirana', label: 'Grocery', icon: '🛒' },
    { id: 'Hardware', label: 'Hardware', icon: '🔨' },
    { id: 'Pharmacy', label: 'Pharmacy', icon: '💊' },
    { id: 'Electrical', label: 'Electrical', icon: '⚡' },
    { id: 'Home', label: 'Home', icon: '🧹' },
    { id: 'Fresh', label: 'Fresh', icon: '🥬' }
  ];

  const filteredMerchants = merchants.filter(merchant => {
    const matchesCategory = selectedCategory === 'All' ||
      merchant.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Kirana' && merchant.category?.toLowerCase() === 'grocery') ||
      (selectedCategory === 'Grocery' && merchant.category?.toLowerCase() === 'kirana');

    const matchesSearch = merchant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleShopClick = (merchantId) => {
    setSelectedMerchantId(merchantId);
    if (onOpenShop) onOpenShop(merchantId);
  };

  return (
    <div className="space-y-xl">
      {/* Consumer Header & Location */}
      <div className="bg-surface-container-lowest rounded-xl p-lg border border-surface-variant shadow-[0px_4px_12px_rgba(26,26,26,0.05)] space-y-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
          <div>
            <div className="flex items-center gap-xs text-primary font-label-md text-label-md">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span>Karmala Town • Sector 4</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-xs">
              Good day, {profile?.full_name || 'Shreyas'} 👋
            </h1>
            <p className="font-body-md text-secondary">What would you like to order from your local market today?</p>
          </div>

          <div className="bg-primary-container text-on-primary-container px-md py-sm rounded-full font-label-md text-label-md font-bold flex items-center gap-xs shadow-xs">
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span>Hyperlocal Delivery</span>
          </div>
        </div>

        {/* Consumer Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
          <input
            type="text"
            className="w-full pl-12 pr-md py-md bg-surface-container border border-outline-variant rounded-full focus:outline-none focus:border-primary text-body-md transition-colors shadow-xs"
            placeholder="Search shops or products (e.g. Hammer, Rice, Paracetamol)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Chips with Emojis */}
      <section>
        <h2 className="font-headline-md text-headline-md font-bold mb-md text-on-surface">What are you looking for?</h2>
        <div className="flex gap-sm overflow-x-auto pb-xs hide-scrollbar">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-md py-sm rounded-full font-label-md text-label-md transition-all flex items-center gap-xs border ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary shadow-sm font-bold'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Nearby Shop Grid */}
      <section>
        <div className="flex justify-between items-end mb-md">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Nearby Local Shops</h2>
            <p className="font-body-sm text-secondary">Delivering directly from Karmala merchants</p>
          </div>
          <span className="font-label-md text-label-md text-primary font-bold">
            {filteredMerchants.length} Shops Open
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {filteredMerchants.map(merchant => (
            <div
              key={merchant.id}
              onClick={() => handleShopClick(merchant.id)}
              className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant overflow-hidden hover:shadow-md transition-all group cursor-pointer relative"
            >
              <div className="h-40 bg-surface-container relative overflow-hidden">
                <img
                  src={merchant.image_url || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80'}
                  alt={merchant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-sm right-sm bg-surface-container-lowest/95 backdrop-blur-sm px-xs py-xs rounded-md flex items-center gap-xs shadow-xs border border-surface-variant">
                  <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Open Now</span>
                </div>
                <div className="absolute bottom-sm left-sm bg-surface-container-lowest/95 backdrop-blur-sm px-sm py-xs rounded-md flex items-center gap-xs text-label-sm font-bold text-on-surface shadow-xs">
                  <span className="text-amber-500">⭐</span>
                  <span>{merchant.rating || 4.8}</span>
                </div>
              </div>

              <div className="p-md space-y-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                      {merchant.name}
                    </h3>
                    <div className="flex items-center gap-xs font-body-sm text-secondary mt-unit">
                      <span>{merchant.category}</span>
                      <span>•</span>
                      <span>{merchant.town || 'Karmala'}</span>
                    </div>
                  </div>
                  <div className="bg-primary-container text-on-primary-container p-xs rounded-full shrink-0">
                    <span className="material-symbols-outlined text-sm">shopping_basket</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-body-sm font-label-md text-on-surface pt-sm border-t border-surface-variant">
                  <div className="flex items-center gap-xs text-primary font-semibold">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>{merchant.eta_range || '20-30 min'}</span>
                  </div>
                  <div className="flex items-center gap-xs text-secondary">
                    <span className="material-symbols-outlined text-sm">near_me</span>
                    <span>{merchant.distance_km || 1.2} km away</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredMerchants.length === 0 && (
            <div className="col-span-full bg-surface-container-lowest rounded-xl p-xl border border-surface-container text-center py-xl">
              <span className="material-symbols-outlined text-outline text-5xl mb-sm">storefront</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">No shops found</h3>
              <p className="font-body-md text-body-md text-secondary">Try searching for a different item or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
