import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function MerchantDashboard() {
  const {
    merchants,
    selectedMerchantId,
    orders,
    products,
    riders,
    acceptOrder,
    addNewProduct,
    profile
  } = useApp();

  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'all' | 'products'
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [allocationNotice, setAllocationNotice] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '50',
    unit: '1 unit',
    category: 'Hardware',
    image_url: ''
  });

  const merchant = merchants.find(m => m.id === selectedMerchantId) || merchants[1] || merchants[0];
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

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    await addNewProduct({
      ...newProduct,
      merchant_id: merchant.id
    });
    setNewProduct({ name: '', price: '', stock: '50', unit: '1 unit', category: 'Hardware', image_url: '' });
    setShowAddProductModal(false);
  };

  return (
    <div className="space-y-xl">
      {/* Smart Rider Allocation Toast Banner */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <span className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-bold inline-block mb-xs">
            Merchant Portal • {profile?.full_name || merchant?.name}
          </span>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
            {merchant?.name || 'VSC Kanedi Hardware Shop'}
          </h1>
          <p className="font-body-md text-secondary">
            {merchant?.category} • {merchant?.town} • Real-time sales & fulfillment
          </p>
        </div>
        <button
          onClick={() => setShowAddProductModal(true)}
          className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-lg flex items-center gap-xs hover:bg-primary-container transition-colors shadow-sm font-bold"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> Add Product
        </button>
      </div>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border-l-4 border-error border border-surface-variant">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-label-md text-label-md text-secondary">Pending Orders</span>
            <span className="material-symbols-outlined text-error bg-error-container p-xs rounded-full">pending_actions</span>
          </div>
          <div className="font-headline-xl text-headline-xl font-bold text-on-surface">{pendingOrders.length}</div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border-l-4 border-primary border border-surface-variant">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-label-md text-label-md text-secondary">Active Deliveries</span>
            <span className="material-symbols-outlined text-primary bg-primary-fixed p-xs rounded-full">receipt_long</span>
          </div>
          <div className="font-headline-xl text-headline-xl font-bold text-on-surface">{activeOrders.length}</div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border-l-4 border-tertiary border border-surface-variant">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-label-md text-label-md text-secondary">Listed Products</span>
            <span className="material-symbols-outlined text-tertiary bg-tertiary-container text-on-tertiary p-xs rounded-full">inventory_2</span>
          </div>
          <div className="font-headline-xl text-headline-xl font-bold text-on-surface">{merchantProducts.length}</div>
        </div>
      </section>

      {/* Orders & Products Tabs */}
      <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant space-y-md">
        <div className="flex gap-lg border-b border-surface-variant">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`font-label-md text-label-md pb-sm px-xs transition-colors ${
              activeTab === 'incoming'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Incoming Orders ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`font-label-md text-label-md pb-sm px-xs transition-colors ${
              activeTab === 'all'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            All Shop Orders ({merchantOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`font-label-md text-label-md pb-sm px-xs transition-colors ${
              activeTab === 'products'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Inventory ({merchantProducts.length})
          </button>
        </div>

        {/* Tab 1 & 2: Orders List */}
        {(activeTab === 'incoming' || activeTab === 'all') && (
          <div className="space-y-md">
            {(activeTab === 'incoming' ? pendingOrders : merchantOrders).map(order => {
              const assignedRider = riders.find(r => r.id === order.rider_id);

              return (
                <div key={order.id} className="border border-outline-variant rounded-lg p-md hover:bg-surface-container-low transition-colors space-y-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{order.customer_name}</h3>
                      <p className="font-body-sm text-body-sm text-secondary">
                        Order #{order.id} • Status: <strong className="uppercase text-primary">{order.status}</strong>
                      </p>
                    </div>
                    <span className="font-headline-md text-headline-md font-bold text-primary">₹{order.total}</span>
                  </div>

                  <div className="bg-surface-container-low p-sm rounded-lg">
                    <span className="font-label-sm text-label-sm text-secondary block mb-xs">Items:</span>
                    <ul className="font-body-sm text-body-sm text-on-surface space-y-unit">
                      {order.items?.map((item, i) => (
                        <li key={i}>• {item.name} × {item.qty} (₹{item.price * item.qty})</li>
                      ))}
                    </ul>
                  </div>

                  {assignedRider && (
                    <div className="flex items-center gap-xs font-label-sm text-label-sm text-tertiary bg-tertiary-fixed p-xs rounded">
                      <span className="material-symbols-outlined text-sm">two_wheeler</span>
                      <span>Assigned Rider: {assignedRider.name} ({assignedRider.phone})</span>
                    </div>
                  )}

                  {order.status === 'placed' && (
                    <div className="flex gap-sm pt-xs">
                      <button
                        onClick={() => handleAcceptClick(order.id)}
                        className="flex-1 bg-tertiary text-on-tertiary font-label-md text-label-md py-sm rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-xs font-bold"
                      >
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Accept Order & Allocate Rider
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {(activeTab === 'incoming' ? pendingOrders : merchantOrders).length === 0 && (
              <div className="py-xl text-center text-secondary">
                <span className="material-symbols-outlined text-4xl text-outline mb-xs">task_alt</span>
                <p className="font-body-md text-body-md">No orders in this view.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Inventory Table */}
        {activeTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-variant text-secondary font-label-sm text-label-sm bg-surface-container-low">
                  <th className="py-sm px-sm">Product Name</th>
                  <th className="py-sm px-sm">Category</th>
                  <th className="py-sm px-sm">Price</th>
                  <th className="py-sm px-sm">Stock</th>
                  <th className="py-sm px-sm">Unit</th>
                </tr>
              </thead>
              <tbody>
                {merchantProducts.map(p => (
                  <tr key={p.id} className="border-b border-surface-variant hover:bg-surface-container-low transition-colors">
                    <td className="py-sm px-sm font-label-md text-on-surface font-bold">{p.name}</td>
                    <td className="py-sm px-sm font-body-sm text-secondary">{p.category || 'Hardware'}</td>
                    <td className="py-sm px-sm font-label-md text-primary font-bold">₹{p.price}</td>
                    <td className="py-sm px-sm font-body-sm text-on-surface">{p.stock || 50} pcs</td>
                    <td className="py-sm px-sm font-body-sm text-secondary">{p.unit || '1 unit'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-md">
          <div className="bg-surface-container-lowest rounded-xl p-lg max-w-md w-full border border-outline-variant shadow-xl space-y-md">
            <div className="flex justify-between items-center pb-sm border-b border-surface-variant">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Add New Product</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-md">
              <div>
                <label className="block font-label-sm text-label-sm text-secondary mb-xs">Product Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg font-body-md"
                  placeholder="e.g. Electric Drill 500W"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-xs">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg font-body-md"
                    placeholder="450"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-xs">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg font-body-md"
                    placeholder="50"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-xs">Category</label>
                  <input
                    type="text"
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg font-body-md"
                    placeholder="Hardware / Tools"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-xs">Unit Size</label>
                  <input
                    type="text"
                    className="w-full p-sm bg-surface-container border border-outline-variant rounded-lg font-body-md"
                    placeholder="1 pc"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-sm pt-md border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 bg-surface-container text-on-surface font-label-md text-label-md py-sm rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg hover:bg-primary-container transition-colors shadow-sm font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
