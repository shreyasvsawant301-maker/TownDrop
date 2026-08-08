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
  const merchantProducts = products.filter(p => p.merchant_id === (merchant?.id || selectedMerchantId));

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
      const order = await placeOrder('Rahul Sharma');
      if (onOrderPlaced) onOrderPlaced(order?.id);
    } catch (e) {
      console.error('Failed to place order', e);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-lg">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md pb-md border-b border-outline-variant">
        <div>
          <button
            onClick={onBackToShops}
            className="flex items-center gap-xs text-primary font-label-md text-label-md hover:underline mb-xs"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Shops
          </button>
          <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface">
            {merchant?.name || 'Local Shop'}
          </h1>
          <p className="text-body-md text-secondary">
            {merchant?.town || 'Karmala'} • {merchant?.category} • Verified Local
          </p>
        </div>

        {/* Category Chips */}
        <div className="flex gap-sm overflow-x-auto w-full md:w-auto pb-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-md py-sm rounded-md font-label-md text-label-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Products + Cart Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Product Grid */}
        <div className="lg:col-span-2 space-y-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-md">
            {filteredProducts.map(product => {
              const cartItem = cart.find(i => i.product.id === product.id);
              const currentQty = cartItem ? cartItem.qty : 0;

              return (
                <div
                  key={product.id}
                  className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="relative h-44 w-full bg-surface-variant overflow-hidden">
                      <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-sm left-sm bg-surface-container-lowest/90 backdrop-blur-sm px-sm py-unit rounded flex items-center gap-unit shadow-xs">
                        <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
                        <span className="text-label-sm font-label-sm text-on-surface">In Stock ({product.stock || 50})</span>
                      </div>
                    </div>
                    <div className="p-md">
                      <h3 className="text-headline-md font-headline-md font-bold text-on-surface mb-unit line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-body-sm text-secondary mb-md">{product.unit || '1 unit'}</p>
                      <div className="text-headline-md font-headline-md font-bold text-primary mb-md">
                        ₹ {product.price}
                      </div>
                    </div>
                  </div>

                  <div className="p-md border-t border-surface-variant flex items-center justify-between gap-sm bg-surface-container-lowest">
                    {/* Stepper */}
                    <div className="flex items-center gap-xs bg-surface-container rounded-lg px-sm py-xs">
                      <button
                        onClick={() => addToCart(product, -1)}
                        className="text-on-surface-variant hover:text-primary transition-colors p-unit disabled:opacity-30"
                        disabled={currentQty <= 0}
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="text-body-md font-bold text-on-surface w-6 text-center">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="text-on-surface-variant hover:text-primary transition-colors p-unit"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-lg flex items-center gap-xs hover:bg-primary-container transition-colors h-11 shrink-0"
                    >
                      <span>Add</span>
                      <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-full bg-surface-container-lowest rounded-xl p-xl border border-surface-container text-center py-xl">
                <span className="material-symbols-outlined text-outline text-5xl mb-sm">inventory_2</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">No products in this category</h3>
                <p className="font-body-md text-body-md text-secondary">Select another category or view all products.</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Drawer / Summary Sidebar */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-[0px_4px_12px_rgba(26,26,26,0.05)] h-fit sticky top-24 space-y-md">
          <div className="flex justify-between items-center pb-md border-b border-surface-variant">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Your Cart</h2>
            </div>
            <span className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-bold">
              {cartItemsCount} items
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="py-xl text-center text-secondary space-y-xs">
              <span className="material-symbols-outlined text-4xl text-outline">remove_shopping_cart</span>
              <p className="font-body-md text-body-md">Your cart is currently empty.</p>
              <p className="font-body-sm text-body-sm">Add products from the list above to get started.</p>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-sm max-h-60 overflow-y-auto pr-xs">
                {cart.map(({ product, qty }) => (
                  <div key={product.id} className="flex justify-between items-center py-xs border-b border-surface-container">
                    <div className="flex-1 pr-sm">
                      <div className="font-label-md text-label-md text-on-surface font-bold line-clamp-1">{product.name}</div>
                      <div className="font-body-sm text-body-sm text-secondary">₹{product.price} × {qty}</div>
                    </div>
                    <div className="flex items-center gap-xs">
                      <span className="font-label-md text-label-md font-bold text-primary">₹{product.price * qty}</span>
                      <button
                        onClick={() => updateCartQty(product.id, 0)}
                        className="text-outline hover:text-error transition-colors p-xs"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-md border-t border-surface-variant space-y-xs text-body-md">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span>₹ {cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Delivery Fee (Karmala)</span>
                  <span>₹ {deliveryFee}</span>
                </div>
                <div className="flex justify-between font-headline-md text-headline-md text-on-surface font-bold pt-sm border-t border-surface-variant">
                  <span>Grand Total</span>
                  <span className="text-primary">₹ {grandTotal}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckout}
                disabled={isPlacingOrder}
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg flex items-center justify-center gap-sm hover:bg-primary-container transition-colors shadow-md disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹ {grandTotal})</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
