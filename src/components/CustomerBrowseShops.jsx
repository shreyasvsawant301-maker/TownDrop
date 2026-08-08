import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import AiShoppingAssistant from './AiShoppingAssistant';

export default function CustomerBrowseShops({ onOpenShop }) {
  const { merchants, products, setSelectedMerchantId, profile, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const categories = [
    { label: 'All', icon: '🏪' },
    { label: 'Grocery', icon: '🛒' },
    { label: 'Hardware', icon: '🔨' },
    { label: 'Pharmacy', icon: '💊' },
    { label: 'Electrical', icon: '⚡' },
    { label: 'Home', icon: '🧹' },
    { label: 'Fresh', icon: '🥬' }
  ];

  // Global product search results
  const productSearchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map(p => {
        const merchant = merchants.find(m => m.id === p.merchant_id);
        return { ...p, merchant };
      });
  }, [searchQuery, products, merchants]);

  const filteredMerchants = merchants.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() || m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || m.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectShop = (merchantId) => {
    setSelectedMerchantId(merchantId);
    onOpenShop();
  };

  const handleProductClick = (product) => {
    if (product.merchant_id) {
      setSelectedMerchantId(product.merchant_id);
      onOpenShop();
    }
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
              📍 Karmala Town
            </span>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Good day, {profile?.full_name || 'there'} 👋
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
            placeholder="Search products or shops (e.g. Hammer, Rice, Paracetamol)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length >= 2);
            }}
            onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
            className="w-full pl-xl pr-xl py-sm bg-surface-container border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
              className="absolute right-md top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}

          {/* Product Search Dropdown */}
          {showSearchResults && searchQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-xs bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-30 max-h-80 overflow-y-auto">
              {productSearchResults.length > 0 ? (
                <>
                  <div className="px-md py-xs border-b border-outline-variant">
                    <span className="text-[11px] text-secondary font-bold uppercase tracking-wider">
                      Products ({productSearchResults.length})
                    </span>
                  </div>
                  {productSearchResults.map(product => (
                    <button
                      key={product.id}
                      onClick={() => {
                        handleProductClick(product);
                        setShowSearchResults(false);
                      }}
                      className="w-full flex items-center gap-sm p-sm hover:bg-surface-container-high transition-colors text-left border-b border-outline-variant/40 last:border-0"
                    >
                      <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-on-surface truncate">{product.name}</h4>
                        <p className="text-[11px] text-secondary truncate">
                          {product.merchant?.name || 'Local Shop'} • {product.merchant?.eta_range || '15-25 min'}
                        </p>
                      </div>
                      <span className="font-bold text-primary text-xs shrink-0">₹{product.price}</span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="p-md text-center text-xs text-secondary">
                  <span className="material-symbols-outlined text-2xl text-outline block mb-xs">search_off</span>
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click-away overlay for search dropdown */}
      {showSearchResults && (
        <div className="fixed inset-0 z-20" onClick={() => setShowSearchResults(false)} />
      )}

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
            {filteredMerchants.length} shops in Karmala
          </span>
        </div>

        {filteredMerchants.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl text-center text-secondary space-y-sm">
            <span className="material-symbols-outlined text-4xl text-outline">storefront</span>
            <p className="text-xs">No shops found matching your criteria. Try a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                onClick={() => handleSelectShop(merchant.id)}
                className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-surface-container">
                    <img
                      src={merchant.image_url}
                      alt={merchant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-sm right-sm bg-surface/90 backdrop-blur-xs text-on-surface font-label-sm text-xs px-sm py-unit rounded-full font-bold shadow-xs">
                      ⭐ {merchant.rating || 4.8}
                    </span>
                    <span className="absolute bottom-sm left-sm bg-primary/90 text-on-primary font-label-sm text-[11px] px-sm py-unit rounded-full font-bold">
                      🚚 {merchant.eta_range || '15-25 min'} • {merchant.distance_km || 1.2} km
                    </span>
                  </div>

                  <div className="p-md space-y-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-bold">
                        {merchant.category}
                      </span>
                      <span className="text-[11px] text-tertiary font-bold">🟢 Open</span>
                    </div>
                    <h3 className="font-headline-md text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {merchant.name}
                    </h3>
                    <p className="font-body-sm text-[11px] text-secondary">
                      📍 {merchant.town || 'Karmala Town'} • Verified Merchant
                    </p>
                  </div>
                </div>

                <div className="p-md pt-0">
                  <button className="w-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md py-sm rounded-xl font-bold group-hover:bg-primary group-hover:text-on-primary transition-colors flex items-center justify-center gap-xs text-xs">
                    <span className="material-symbols-outlined text-sm">storefront</span>
                    Browse Products
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
