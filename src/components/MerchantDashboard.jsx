import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getProductImage } from '../lib/supabase';

export default function MerchantDashboard() {
  const {
    merchants,
    selectedMerchantId,
    orders,
    products,
    acceptOrder,
    addNewProduct,
    updateMerchantInfo,
    profile
  } = useApp();

  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'all' | 'products' | 'settings'
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [allocationNotice, setAllocationNotice] = useState(null);
  const [saveSettingsNotice, setSaveSettingsNotice] = useState(false);

  const merchant = merchants.find(m => m.id === selectedMerchantId || m.owner_id === profile?.id) || merchants[0];

  // Shop Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: merchant?.name || '',
    category: merchant?.category || 'Kirana',
    town: merchant?.town || 'Karmala',
    eta_range: merchant?.eta_range || '15-25 min',
    image_url: merchant?.image_url || ''
  });

  useEffect(() => {
    if (merchant) {
      setSettingsForm({
        name: merchant.name || '',
        category: merchant.category || 'Kirana',
        town: merchant.town || 'Karmala',
        eta_range: merchant.eta_range || '15-25 min',
        image_url: merchant.image_url || ''
      });
    }
  }, [merchant]);

  // Product Creation Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '50',
    unit: '1 unit',
    category: merchant?.category || 'General',
    image_url: ''
  });

  const merchantOrders = orders.filter(o => o.merchant_id === merchant?.id);
  const pendingOrders = merchantOrders.filter(o => o.status === 'placed');
  const activeOrders = merchantOrders.filter(o => ['accepted', 'assigned', 'picked_up'].includes(o.status));
  const merchantProducts = products.filter(p => p.merchant_id === merchant?.id);

  const handleAcceptClick = async (orderId) => {
    const assignedRider = await acceptOrder(orderId, merchant.id);
    setAllocationNotice({
      orderId,
      riderName: assignedRider?.name || 'Vikram Singh',
      distanceKm: assignedRider?.distanceKm || 1.2
    });
    setTimeout(() => {
      setAllocationNotice(null);
    }, 6000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    await addNewProduct({
      ...newProduct,
      merchant_id: merchant.id,
      category: newProduct.category || merchant?.category || 'General',
      image_url: newProduct.image_url || merchant?.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
    });
    setNewProduct({ name: '', price: '', stock: '50', unit: '1 unit', category: merchant?.category || 'General', image_url: '' });
    setShowAddProductModal(false);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!merchant) return;
    await updateMerchantInfo(merchant.id, settingsForm);
    setSaveSettingsNotice(true);
    setTimeout(() => setSaveSettingsNotice(false), 4000);
  };

  const SHOP_PRESETS = [
    { label: 'Kirana / Grocery', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80' },
    { label: 'Hardware', url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80' },
    { label: 'Pharmacy', url: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80' },
    { label: 'Electrical', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80' },
    { label: 'Fresh Vegetables', url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80' }
  ];

  const PRODUCT_PRESETS = [
    { label: '🔨 Tool', url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80' },
    { label: '💊 Medicine', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
    { label: '🌾 Grocery', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { label: '💡 Electrical', url: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=600&q=80' },
    { label: '🥭 Fresh Fruit', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' },
    { label: '🧴 Bottle/Liquid', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="space-y-xl">
      {/* Rider Allocation Toast Banner */}
      {allocationNotice && (
        <div className="bg-primary text-on-primary p-md rounded-xl shadow-lg border border-primary-container flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-3xl">two_wheeler</span>
            <div>
              <h4 className="font-headline-md text-headline-md font-bold">✓ Order #{allocationNotice.orderId} Accepted</h4>
              <p className="font-body-md">
                Smart Rider Allocation: Assigned nearest available rider <strong>{allocationNotice.riderName}</strong> (🟢 Available, {allocationNotice.distanceKm} km away).
              </p>
            </div>
          </div>
          <button onClick={() => setAllocationNotice(null)} className="text-on-primary hover:opacity-80">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Save Settings Toast Banner */}
      {saveSettingsNotice && (
        <div className="bg-tertiary-container text-on-tertiary-container p-md rounded-xl shadow-md flex items-center gap-md animate-fadeIn">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
          <div>
            <h4 className="font-bold text-sm">✓ Shop Settings Updated Successfully!</h4>
            <p className="text-xs">Your updated store details and catalog category are now live for customers.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <span className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-bold inline-block mb-xs">
            Merchant Portal • {profile?.full_name || merchant?.name}
          </span>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
            {merchant?.name || 'Local Shop'}
          </h1>
          <p className="font-body-md text-secondary">
            Category: <strong className="text-primary">{merchant?.category}</strong> • {merchant?.town} • Real-time sales & fulfillment
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            onClick={() => setActiveTab('settings')}
            className="bg-surface-container-high text-on-surface font-label-md text-label-md px-md py-sm rounded-xl flex items-center gap-xs hover:bg-surface-container-highest transition-colors font-bold border border-outline-variant"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span> Shop Settings
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-xl flex items-center gap-xs hover:bg-primary-container transition-colors shadow-sm font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Add Product
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="font-label-sm text-label-sm text-secondary">Pending Orders</p>
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-xs">
              {pendingOrders.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="font-label-sm text-label-sm text-secondary">Active Deliveries</p>
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-xs">
              {activeOrders.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="font-label-sm text-label-sm text-secondary">Listed Products</p>
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-xs">
              {merchantProducts.length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="border-b border-outline-variant flex gap-md">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`pb-sm font-label-md text-label-md transition-colors relative ${
            activeTab === 'incoming'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          Incoming Orders ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-sm font-label-md text-label-md transition-colors relative ${
            activeTab === 'all'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          All Shop Orders ({merchantOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-sm font-label-md text-label-md transition-colors relative ${
            activeTab === 'products'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          Inventory ({merchantProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-sm font-label-md text-label-md transition-colors relative ${
            activeTab === 'settings'
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-secondary hover:text-on-surface'
          }`}
        >
          ⚙️ Shop Settings
        </button>
      </div>

      {/* TAB CONTENT: INCOMING ORDERS */}
      {activeTab === 'incoming' && (
        <div className="space-y-md">
          {pendingOrders.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl text-center text-secondary">
              <span className="material-symbols-outlined text-4xl mb-xs">check_circle</span>
              <p className="font-body-md">No pending incoming orders at the moment.</p>
            </div>
          ) : (
            pendingOrders.map(order => (
              <div
                key={order.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-md"
              >
                <div className="space-y-xs">
                  <div className="flex items-center gap-sm">
                    <span className="font-bold text-on-surface text-base">Order #{order.id}</span>
                    <span className="bg-error-container text-on-error-container text-xs px-sm py-unit rounded-full font-bold">
                      NEW PLACED
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-secondary">
                    Customer: <strong>{order.customer_name}</strong> • Delivery: {order.delivery_address}
                  </p>
                  <div className="flex items-center gap-md text-xs font-bold text-on-surface">
                    <span>Items: {order.items?.map(i => `${i.name} (${i.qty})`).join(', ')}</span>
                    <span className="text-primary text-sm font-bold">₹{order.total}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAcceptClick(order.id)}
                  className="w-full md:w-auto bg-primary text-on-primary px-lg py-sm rounded-xl font-bold font-label-md hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-xs"
                >
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                  <span>Accept Order & Allocate Rider</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: ALL ORDERS */}
      {activeTab === 'all' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant text-xs text-secondary font-bold uppercase">
                <th className="p-md">Order ID</th>
                <th className="p-md">Customer</th>
                <th className="p-md">Items</th>
                <th className="p-md">Total</th>
                <th className="p-md">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-xs">
              {merchantOrders.map(o => (
                <tr key={o.id} className="hover:bg-surface-container-low">
                  <td className="p-md font-bold text-on-surface">#{o.id}</td>
                  <td className="p-md">{o.customer_name}</td>
                  <td className="p-md">{o.items?.map(i => i.name).join(', ')}</td>
                  <td className="p-md font-bold text-primary">₹{o.total}</td>
                  <td className="p-md">
                    <span className="bg-surface-container-high px-sm py-unit rounded-full font-bold uppercase text-[10px]">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: INVENTORY PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-md">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-sm font-bold text-on-surface">Listed Products Inventory</h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-primary text-on-primary text-xs font-bold px-md py-sm rounded-xl flex items-center gap-xs hover:bg-primary-container shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
            {merchantProducts.map(prod => (
              <div key={prod.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-xs p-md space-y-xs flex flex-col justify-between">
                <div className="space-y-xs">
                  <img src={getProductImage(prod, merchant)} alt={prod.name} className="h-36 w-full object-cover rounded-xl" />
                  <h4 className="font-bold text-sm text-on-surface line-clamp-1">{prod.name}</h4>
                  <p className="text-xs text-secondary">{prod.unit || '1 unit'} • Stock: {prod.stock || 50}</p>
                </div>
                <div className="font-bold text-primary text-base pt-xs border-t border-outline-variant">₹{prod.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SHOP SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg space-y-md max-w-2xl shadow-xs">
          <div>
            <h3 className="font-headline-md font-bold text-on-surface">⚙️ Merchant Shop Settings</h3>
            <p className="font-body-sm text-xs text-secondary">
              Update your shop profile details visible to customers in Karmala Town.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-md">
            <div>
              <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                Shop Name
              </label>
              <input
                type="text"
                required
                value={settingsForm.name}
                onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div>
                <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                  Shop Category
                </label>
                <select
                  value={settingsForm.category}
                  onChange={(e) => setSettingsForm({ ...settingsForm, category: e.target.value })}
                  className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  {['Kirana', 'Hardware', 'Pharmacy', 'Electrical', 'Fresh', 'Home', 'General'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                  Town Location
                </label>
                <input
                  type="text"
                  value={settingsForm.town}
                  onChange={(e) => setSettingsForm({ ...settingsForm, town: e.target.value })}
                  className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                Estimated Delivery ETA Range
              </label>
              <input
                type="text"
                placeholder="e.g. 15-25 min"
                value={settingsForm.eta_range}
                onChange={(e) => setSettingsForm({ ...settingsForm, eta_range: e.target.value })}
                className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                Shop Cover Image URL
              </label>
              <input
                type="url"
                value={settingsForm.image_url}
                onChange={(e) => setSettingsForm({ ...settingsForm, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
              <div className="mt-xs">
                <span className="text-[11px] text-secondary font-bold block mb-xs">Or Pick Category Preset Banner:</span>
                <div className="flex gap-xs overflow-x-auto pb-xs">
                  {SHOP_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setSettingsForm({ ...settingsForm, image_url: preset.url })}
                      className="px-xs py-unit bg-surface-container text-xs rounded-md text-secondary hover:bg-primary-container hover:text-on-primary-container"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary text-on-primary font-label-md py-sm px-lg rounded-xl font-bold hover:bg-primary-container transition-colors shadow-xs"
            >
              Save Shop Settings →
            </button>
          </form>
        </div>
      )}

      {/* MODAL: ADD PRODUCT WITH FILE UPLOAD + LIVE PREVIEW */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-xs flex items-center justify-center p-md z-50 animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg max-w-lg w-full shadow-2xl space-y-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-xs border-b border-outline-variant">
              <div>
                <h3 className="font-headline-md font-bold text-on-surface">➕ Add New Product</h3>
                <p className="text-xs text-secondary">Add item with custom image upload or preset icon</p>
              </div>
              <button onClick={() => setShowAddProductModal(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-md">
              {/* Product Photo Upload & Preview Section */}
              <div className="space-y-xs">
                <label className="block font-label-sm text-xs text-secondary font-bold">
                  🖼️ Product Photo / Image
                </label>
                
                {/* Live Preview Box */}
                {newProduct.image_url ? (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-primary">
                    <img src={newProduct.image_url} alt="Product Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, image_url: '' })}
                      className="absolute top-xs right-xs bg-error text-on-error rounded-full p-xs text-xs shadow-xs"
                      title="Remove image"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-outline-variant rounded-xl p-md text-center space-y-xs bg-surface-container-low hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-3xl text-secondary">add_a_photo</span>
                    <div className="text-xs text-secondary">
                      <label className="text-primary font-bold cursor-pointer hover:underline">
                        Upload Image File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span> or enter URL below</span>
                    </div>
                  </div>
                )}

                {/* Preset Fast Selectors */}
                <div className="pt-xs">
                  <span className="text-[11px] text-secondary font-bold block mb-xs">Fast Select Product Preset Photo:</span>
                  <div className="flex gap-xs overflow-x-auto pb-xs">
                    {PRODUCT_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setNewProduct({ ...newProduct, image_url: preset.url })}
                        className="px-xs py-unit bg-surface-container text-xs rounded-md text-secondary hover:bg-primary-container hover:text-on-primary-container font-bold shrink-0 border border-outline-variant"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image URL Text Input */}
                <input
                  type="url"
                  placeholder="Or paste Image URL (https://...)"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full p-sm bg-surface border border-outline-variant rounded-xl text-xs font-body-md text-on-surface focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 650mg / Steel Hammer"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                    Unit Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg / 1 pc / Strip of 10"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-label-sm text-xs text-secondary mb-xs font-bold">
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden"
                  >
                    {['Kirana', 'Hardware', 'Pharmacy', 'Electrical', 'Fresh', 'Home', 'General'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-sm justify-end pt-xs">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-md py-sm bg-surface-container-high rounded-xl text-xs font-bold text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-lg py-sm bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs"
                >
                  Save Product →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
