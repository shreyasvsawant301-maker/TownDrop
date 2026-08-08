import React from 'react';
import { useApp } from '../context/AppContext';

export default function RiderDashboard() {
  const { riders, orders, merchants, advanceOrderStatus, toggleRiderStatus } = useApp();

  const currentRider = riders.find(r => r.id === 'r1111111-1111-1111-1111-111111111111') || riders[0];

  const assignedOrders = orders.filter(o => 
    (o.rider_id === currentRider?.id || !o.rider_id) && 
    ['assigned', 'picked_up'].includes(o.status)
  );

  const completedToday = orders.filter(o => 
    o.rider_id === currentRider?.id && o.status === 'delivered'
  ).length;

  const handleAction = async (order) => {
    if (order.status === 'assigned') {
      await advanceOrderStatus(order.id, 'picked_up');
    } else if (order.status === 'picked_up') {
      await advanceOrderStatus(order.id, 'delivered');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-lg pb-24">
      {/* Rider Profile & Status Toggle */}
      <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-outline-variant flex items-center justify-between">
        <div>
          <span className="font-label-sm text-label-sm text-secondary block">Delivery Partner</span>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            {currentRider?.name || 'Vikram Singh'} ({currentRider?.phone})
          </h2>
          <p className="font-body-sm text-secondary mt-xs">
            Status: <strong className={currentRider?.status === 'available' ? 'text-[#10b981]' : 'text-primary'}>
              {currentRider?.status === 'available' ? 'Available for orders' : 'Busy on delivery'}
            </strong>
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={currentRider?.status === 'available'}
            onChange={() => toggleRiderStatus(currentRider?.id)}
          />
          <div className="w-14 h-7 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
        Active Delivery Tasks ({assignedOrders.length})
      </h3>

      {/* Stacked Delivery Cards */}
      <div className="space-y-md">
        {assignedOrders.map(order => {
          const merchant = merchants.find(m => m.id === order.merchant_id);
          const isAssigned = order.status === 'assigned';
          const isPickedUp = order.status === 'picked_up';

          return (
            <div
              key={order.id}
              className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-outline-variant flex flex-col gap-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`inline-block font-label-sm text-label-sm px-sm py-xs rounded-full mb-xs border border-outline-variant font-bold ${
                      isAssigned
                        ? 'bg-primary-fixed text-on-primary-fixed-variant'
                        : 'bg-tertiary-container text-on-tertiary-container'
                    }`}
                  >
                    {isAssigned ? 'Assigned' : 'Picked Up'}
                  </span>
                  <div className="font-label-md text-label-md font-bold text-on-surface">Order #{order.id}</div>
                  <div className="font-body-sm text-secondary">Customer: {order.customer_name}</div>
                </div>
                <span className="font-headline-md text-headline-md font-bold text-primary">₹ {order.total}</span>
              </div>

              {/* Location Route */}
              <div className="space-y-sm relative pl-md border-l-2 border-outline-variant ml-xs">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-tertiary">storefront</span>
                  <span className="font-body-md text-on-surface font-semibold">
                    Pickup: {merchant?.name || 'Local Shop'}, Karmala
                  </span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="font-body-md text-on-surface">
                    Drop: {order.customer_name}, Karmala Sector 4
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low p-sm rounded-lg">
                <p className="font-body-sm text-secondary">
                  {order.items?.length || 0} items • Total Value ₹{order.total}
                </p>
              </div>

              {/* Main Step Button */}
              {isAssigned && (
                <button
                  onClick={() => handleAction(order)}
                  className="w-full bg-tertiary text-on-tertiary font-label-md text-label-md py-sm rounded-lg min-h-[48px] hover:bg-tertiary-container transition-colors shadow-sm font-bold flex items-center justify-center gap-xs"
                >
                  <span className="material-symbols-outlined">local_shipping</span>
                  Mark Picked Up
                </button>
              )}

              {isPickedUp && (
                <button
                  onClick={() => handleAction(order)}
                  className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg min-h-[48px] hover:bg-primary-container transition-colors shadow-sm font-bold flex items-center justify-center gap-xs"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Mark Delivered
                </button>
              )}
            </div>
          );
        })}

        {assignedOrders.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl p-xl border border-surface-container text-center py-xl space-y-xs">
            <span className="material-symbols-outlined text-outline text-5xl">two_wheeler</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">No active deliveries</h3>
            <p className="font-body-md text-secondary">You have completed all assigned deliveries! Stay available for new orders.</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Stats Strip */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-container-high border-t border-outline-variant shadow-[0px_-4px_12px_rgba(26,26,26,0.05)] z-40 p-md flex justify-around items-center">
        <div className="text-center">
          <span className="block font-headline-md text-headline-md font-bold text-on-surface">{completedToday}</span>
          <span className="font-label-sm text-label-sm text-secondary">Deliveries Completed</span>
        </div>
        <div className="h-8 w-px bg-outline-variant"></div>
        <div className="text-center">
          <span className="block font-headline-md text-headline-md font-bold text-primary">{assignedOrders.length}</span>
          <span className="font-label-sm text-label-sm text-secondary">Deliveries In Progress</span>
        </div>
      </div>
    </div>
  );
}
