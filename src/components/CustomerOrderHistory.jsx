import React from 'react';
import { useApp } from '../context/AppContext';

export default function CustomerOrderHistory({ onViewTracking, onBackToShops }) {
  const { orders, merchants, riders, profile } = useApp();

  // Filter orders relevant to this customer (by name match or show all in demo)
  const customerOrders = orders.filter(o =>
    o.customer_name === profile?.full_name || orders.length <= 5
  );

  const activeOrders = customerOrders.filter(o =>
    ['placed', 'accepted', 'assigned', 'picked_up', 'out_for_delivery'].includes(o.status)
  );
  const completedOrders = customerOrders.filter(o => o.status === 'delivered');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed': return { label: 'Order Placed', color: 'bg-surface-container-high text-on-surface' };
      case 'accepted': return { label: 'Merchant Accepted', color: 'bg-primary-fixed text-on-primary-fixed' };
      case 'assigned': return { label: 'Rider Assigned', color: 'bg-tertiary-fixed text-on-tertiary-fixed' };
      case 'picked_up': return { label: 'Picked Up', color: 'bg-tertiary text-on-tertiary' };
      case 'out_for_delivery': return { label: 'On the Way', color: 'bg-primary text-on-primary' };
      case 'delivered': return { label: 'Delivered', color: 'bg-tertiary text-on-tertiary' };
      default: return { label: status, color: 'bg-surface-container-high text-on-surface' };
    }
  };

  const OrderCard = ({ order }) => {
    const merchant = merchants.find(m => m.id === order.merchant_id);
    const rider = riders.find(r => r.id === order.rider_id);
    const badge = getStatusBadge(order.status);
    const isActive = order.status !== 'delivered';

    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-xs hover:shadow-md transition-shadow space-y-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] text-secondary font-bold uppercase tracking-wider">
              Order #{order.id}
            </span>
            <h3 className="font-headline-sm font-bold text-on-surface mt-xs">
              {merchant?.name || 'Local Shop'}
            </h3>
          </div>
          <span className={`${badge.color} text-[10px] font-bold uppercase px-sm py-unit rounded-full`}>
            {badge.label}
          </span>
        </div>

        <div className="text-xs text-secondary space-y-1">
          {order.items?.map((it, i) => (
            <div key={i} className="flex justify-between">
              <span>{it.name} × {it.qty}</span>
              <span className="font-bold text-on-surface">₹{it.price * it.qty}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-sm border-t border-outline-variant">
          <span className="font-bold text-primary text-sm">₹{order.total}</span>
          <div className="flex items-center gap-sm">
            {rider && isActive && (
              <span className="text-[11px] text-secondary flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm text-tertiary">two_wheeler</span>
                {rider.name}
              </span>
            )}
            {isActive && (
              <button
                onClick={() => onViewTracking(order.id)}
                className="bg-primary text-on-primary text-xs font-bold px-sm py-xs rounded-lg hover:bg-primary-container transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-sm">map</span>
                Track
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-lg">
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={onBackToShops}
            className="flex items-center gap-xs text-primary font-label-md text-label-md hover:underline mb-xs font-bold"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Marketplace
          </button>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">My Orders</h1>
          <p className="font-body-md text-secondary">Track active deliveries and view past orders</p>
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <section className="space-y-sm">
          <h2 className="font-headline-sm font-bold text-on-surface flex items-center gap-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Active Orders ({activeOrders.length})
          </h2>
          <div className="space-y-md">
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <section className="space-y-sm">
          <h2 className="font-headline-sm font-bold text-on-surface flex items-center gap-xs">
            <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
            Past Orders ({completedOrders.length})
          </h2>
          <div className="space-y-md">
            {completedOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {customerOrders.length === 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl text-center space-y-sm">
          <span className="material-symbols-outlined text-5xl text-outline">receipt_long</span>
          <h3 className="font-headline-md font-bold text-on-surface">No orders yet</h3>
          <p className="text-xs text-secondary">Browse local shops and place your first order!</p>
          <button
            onClick={onBackToShops}
            className="bg-primary text-on-primary font-label-md px-md py-sm rounded-xl font-bold hover:bg-primary-container transition-colors shadow-xs"
          >
            Browse Shops →
          </button>
        </div>
      )}
    </div>
  );
}
