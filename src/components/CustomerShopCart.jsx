import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CustomerShopCart({ onOrderPlaced, onBackToShops }) {
  const {
    merchants,
    products,
    selectedMerchantId,
    cart,
    addToCart,
    updateCartQty,
    placeOrder
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const merchant = merchants.find(m => m.id === selectedMerchantId) || merchants[0];
  const merchantProducts = products.filter(p => p.merchant_id === merchant?.id);

  const categories = ['All', ...new Set(merchantProducts.map(p => p.category || 'General'))];

  const filteredProducts = merchantProducts.filter(p => {
    if (selectedCategory === 'All') return true;
    return (p.category || 'General') === selectedCategory;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const deliveryFee = cartSubtotal > 0 ? 30 : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const order = await placeOrder();
      if (onOrderPlaced) onOrderPlaced(order?.id);
    } catch (e) {
      console.error('Failed to place order', e);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-lg">
      {/* Merchant Header */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
        <div className="relative h-32 md:h-40 w-full bg-surface-container overflow-hidden">
          <img
            src={merchant?.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
            alt={merchant?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-md left-md right-md text-white">
            <h1 className="font-headline-lg font-bold text-lg md:text-xl">{merchant?.name || 'Local Shop'}</h1>
            <div className="flex items-center gap-md mt-xs text-xs">
              <span>⭐ {merchant?.rating || 4.8}</span>
              <span className="opacity-60">•</span>
              <span>{merchant?.category}</span>
              <span className="opacity-60">•</span>
              <span>🚚 {merchant?.eta_range || '15-25 min'}</span>
              <span className="opacity-60">•</span>
              <span>📍 {merchant?.distance_km || 1.2} km</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-md py-sm">
          <button
            onClick={onBackToShops}
            className="flex items-center gap-xs text-primary font-label-md text-xs hover:underline font-bold"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            All Shops
          </button>
          <div className="flex items-center gap-sm">
            <span className="text-[11px] text-tertiary font-bold">🟢 Open Now</span>
            {merchantProducts.length > 0 && (
              <span className="text-[11px] text-secondary">{merchantProducts.length} products</span>
            )}
          </div>
        </div>
      </div>

      {/* Category Chips */}
      {merchantProducts.length > 0 && (
        <div className="flex gap-sm overflow-x-auto pb-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-md py-sm rounded-full font-label-md text-label-md transition-colors whitespace-nowrap border text-xs ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary font-bold border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Products + Cart Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Product Grid */}
        <div className="lg:col-span-2 space-y-md">
          {filteredProducts.length === 0 ? (
            <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-xl text-center space-y-md">
              <span className="material-symbols-outlined text-4xl text-secondary">inventory_2</span>
              <div>
                <h3 className="font-headline-sm font-bold text-on-surface">No products available</h3>
                <p className="font-body-sm text-secondary text-xs mt-xs">
                  This shop hasn't listed products yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-md">
              {filteredProducts.map(product => {
                const cartItem = cart.find(i => i.product.id === product.id);
                const currentQty = cartItem ? cartItem.qty : 0;

                return (
                  <div
                    key={product.id}
                    className="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="relative h-40 w-full bg-surface-container overflow-hidden">
                        <img
                          src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-sm left-sm bg-surface/90 backdrop-blur-xs text-on-surface font-label-sm text-[11px] px-sm py-unit rounded-full font-bold">
                          In Stock ({product.stock || 50})
                        </span>
                      </div>

                      <div className="p-md space-y-xs">
                        <h3 className="font-headline-sm text-sm font-bold text-on-surface line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="font-body-sm text-[11px] text-secondary">
                          {product.unit || '1 unit'}
                        </p>
                        <div className="font-headline-md text-base font-bold text-primary">
                          ₹{product.price}
                        </div>
                      </div>
                    </div>

                    <div className="p-md pt-0 flex items-center justify-between gap-xs">
                      {currentQty > 0 ? (
                        <div className="flex items-center gap-xs bg-surface-container border border-outline-variant rounded-xl p-xs">
                          <button
                            onClick={() => updateCartQty(product.id, -1)}
                            className="w-7 h-7 rounded-lg bg-surface hover:bg-surface-container-high flex items-center justify-center font-bold text-secondary text-sm"
                          >
                            −
                          </button>
                          <span className="font-bold text-sm px-xs min-w-[20px] text-center">{currentQty}</span>
                          <button
                            onClick={() => updateCartQty(product.id, 1)}
                            className="w-7 h-7 rounded-lg bg-surface hover:bg-surface-container-high flex items-center justify-center font-bold text-secondary text-sm"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <div />
                      )}

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="bg-primary text-on-primary font-label-md text-xs px-sm py-sm rounded-xl font-bold hover:bg-primary-container transition-colors shadow-xs"
                      >
                        {currentQty > 0 ? 'Add More' : 'Add 🛒'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="space-y-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm space-y-md sticky top-20">
            <div className="flex justify-between items-center pb-sm border-b border-outline-variant">
              <h2 className="font-headline-md font-bold text-on-surface flex items-center gap-xs text-sm">
                <span>🛒</span>
                <span>Your Cart</span>
              </h2>
              <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-sm py-unit rounded-full">
                {cartItemsCount} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-lg text-center space-y-sm">
                <span className="material-symbols-outlined text-3xl text-secondary">shopping_cart</span>
                <p className="font-body-sm text-secondary text-xs">
                  Add items from <strong>{merchant?.name}</strong> to get started!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-sm max-h-48 overflow-y-auto pr-xs">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-on-surface">{item.product.name}</span>
                        <div className="text-secondary">{item.qty} × ₹{item.product.price}</div>
                      </div>
                      <span className="font-bold text-primary">₹{item.qty * item.product.price}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-sm border-t border-outline-variant space-y-xs text-xs">
                  <div className="flex justify-between text-secondary">
                    <span>Items Subtotal</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-on-surface pt-xs border-t border-surface-variant">
                    <span>Total</span>
                    <span className="text-primary text-base">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Delivery ETA */}
                <div className="bg-surface-container-low rounded-xl p-sm flex items-center gap-xs text-xs text-secondary">
                  <span className="material-symbols-outlined text-sm text-tertiary">schedule</span>
                  <span>Estimated delivery: <strong className="text-on-surface">{merchant?.eta_range || '15-25 min'}</strong></span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isPlacingOrder}
                  className="w-full bg-primary text-on-primary font-label-md py-sm rounded-xl font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-xs text-xs"
                >
                  {isPlacingOrder ? (
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                  )}
                  <span>{isPlacingOrder ? 'Placing Order...' : `Place Order — ₹${grandTotal}`}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
