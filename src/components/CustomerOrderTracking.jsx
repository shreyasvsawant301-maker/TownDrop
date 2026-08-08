import React from 'react';
import { useApp } from '../context/AppContext';

export default function CustomerOrderTracking({ onBackToShops }) {
  const { orders, activeOrderId, merchants, riders } = useApp();

  const currentOrder = orders.find(o => o.id === activeOrderId) || orders[0];
  const merchant = merchants.find(m => m.id === currentOrder?.merchant_id);
  const rider = riders.find(r => r.id === currentOrder?.rider_id);

  const STATUS_STEPS = [
    { key: 'placed', label: 'Placed', icon: 'receipt_long' },
    { key: 'accepted', label: 'Accepted', icon: 'storefront' },
    { key: 'assigned', label: 'Assigned', icon: 'two_wheeler' },
    { key: 'picked_up', label: 'Picked Up', icon: 'local_shipping' },
    { key: 'delivered', label: 'Delivered', icon: 'home' }
  ];

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === currentOrder?.status);
  const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;

  const getStatusText = (status) => {
    switch (status) {
      case 'placed':
        return {
          title: 'Order Placed with Merchant',
          desc: `Your order #${currentOrder?.id || 'LC-9823'} has been received by ${merchant?.name || 'the shop'}. Waiting for shop acceptance.`
        };
      case 'accepted':
        return {
          title: 'Shop accepted your order',
          desc: `${merchant?.name || 'The shop'} has accepted your order and is packing items. Allocating nearest community rider...`
        };
      case 'assigned':
        return {
          title: 'Nearest Rider Allocated!',
          desc: `${rider?.name || 'Rider'} (🟢 Available) has been assigned and is navigating to ${merchant?.name || 'the shop'}.`
        };
      case 'picked_up':
        return {
          title: 'Out for Delivery',
          desc: `${rider?.name || 'Delivery partner'} has picked up your order from ${merchant?.name || 'the shop'} and is on the way!`
        };
      case 'delivered':
        return {
          title: 'Order Delivered Successfully!',
          desc: 'Your order has been safely delivered to your doorstep in Karmala.'
        };
      default:
        return {
          title: 'Processing Order',
          desc: 'Updating status in real-time...'
        };
    }
  };

  const statusInfo = getStatusText(currentOrder?.status);

  // Map progress calculation percentage based on status
  const mapProgressPercent = currentOrder?.status === 'delivered' ? 100
    : currentOrder?.status === 'picked_up' ? 70
    : currentOrder?.status === 'assigned' ? 40
    : currentOrder?.status === 'accepted' ? 20
    : 10;

  return (
    <div className="max-w-3xl mx-auto space-y-lg py-md">
      {/* Back button */}
      <button
        onClick={onBackToShops}
        className="flex items-center gap-xs text-primary font-label-md text-label-md hover:underline"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Shopping
      </button>

      {/* Header Section */}
      <div className="text-center flex flex-col items-center gap-xs">
        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-xs shadow-md">
          <span className="material-symbols-outlined text-3xl">
            {currentOrder?.status === 'delivered' ? 'check_circle' : 'local_shipping'}
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          Order #{currentOrder?.id || 'LC-1024'}
        </h1>
        <p className="font-body-md text-secondary font-medium">
          {merchant?.name || 'Shop'} • Delivery to Karmala Sector 4
        </p>
      </div>

      {/* Interactive Map Visual Section */}
      <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-[0px_4px_12px_rgba(26,26,26,0.05)] space-y-md">
        <div className="flex justify-between items-center pb-sm border-b border-surface-variant">
          <div className="flex items-center gap-xs font-label-md text-label-md text-on-surface font-bold">
            <span className="material-symbols-outlined text-primary">map</span>
            <span>Live Hyperlocal Delivery Route</span>
          </div>
          {rider && (
            <span className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-bold animate-pulse">
              ETA: {currentOrder?.status === 'delivered' ? 'Arrived' : '8 minutes'}
            </span>
          )}
        </div>

        {/* Visual Map Canvas Graphic */}
        <div className="relative bg-surface-container-low rounded-xl p-lg h-56 flex flex-col justify-between overflow-hidden border border-surface-variant">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#8d7167_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>

          {/* Route Connection Line */}
          <div className="absolute top-1/2 left-16 right-16 h-1 bg-outline-variant -translate-y-1/2 rounded"></div>
          <div
            className="absolute top-1/2 left-16 h-1 bg-primary -translate-y-1/2 rounded transition-all duration-700"
            style={{ width: `calc(${mapProgressPercent}% - 3rem)` }}
          ></div>

          {/* Map Node 1: Shop */}
          <div className="relative z-10 flex justify-between items-center h-full">
            <div className="flex flex-col items-center gap-xs">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-2 border-tertiary flex items-center justify-center text-xl shadow-md">
                🏪
              </div>
              <span className="font-label-sm text-label-sm font-bold text-on-surface bg-surface-container-lowest/90 px-xs py-unit rounded shadow-xs">
                {merchant?.name || 'Shop'}
              </span>
            </div>

            {/* Map Node 2: Rider Moving Indicator */}
            {rider && (
              <div className="flex flex-col items-center gap-xs animate-bounce">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary border-2 border-white flex items-center justify-center text-xl shadow-lg ring-4 ring-primary-fixed">
                  🛵
                </div>
                <div className="text-center bg-surface-container-lowest/90 px-sm py-xs rounded shadow-sm border border-outline-variant">
                  <div className="font-label-sm text-label-sm font-bold text-primary">{rider.name}</div>
                  <div className="text-[10px] text-secondary">650m away</div>
                </div>
              </div>
            )}

            {/* Map Node 3: Home */}
            <div className="flex flex-col items-center gap-xs">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center text-xl shadow-md">
                🏠
              </div>
              <span className="font-label-sm text-label-sm font-bold text-on-surface bg-surface-container-lowest/90 px-xs py-unit rounded shadow-xs">
                Customer Home
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant space-y-md">
        {/* Live Stepper */}
        <div className="py-sm">
          <div className="grid grid-cols-5 gap-xs items-center text-center relative">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={step.key} className="flex flex-col items-center gap-xs relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-primary text-on-primary shadow-md ring-4 ring-primary-fixed'
                        : isCompleted
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                  </div>
                  <span className={`font-label-sm text-label-sm ${isCurrent ? 'text-primary font-bold' : isCompleted ? 'text-on-surface font-semibold' : 'text-secondary'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Status Alert Banner */}
        <div className="bg-surface-container-low rounded-lg p-md flex items-start gap-md border border-outline-variant">
          <span className="material-symbols-outlined text-primary text-2xl">info</span>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface mb-unit">
              {statusInfo.title}
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {statusInfo.desc}
            </p>
            {rider && (
              <div className="mt-sm pt-sm border-t border-surface-variant flex items-center gap-sm text-body-sm font-label-md text-on-surface">
                <span className="material-symbols-outlined text-tertiary">person_pin</span>
                <span>Assigned Rider: <strong className="text-primary">{rider.name}</strong> ({rider.phone})</span>
              </div>
            )}
          </div>
        </div>

        {/* Items Summary */}
        <div className="border-t border-surface-variant pt-md">
          <h4 className="font-label-md text-label-md text-secondary mb-xs font-bold">Order Items Summary</h4>
          <div className="space-y-xs">
            {currentOrder?.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-body-md text-on-surface">
                <span>{item.name} × {item.qty}</span>
                <span className="font-bold">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-headline-md font-bold text-primary pt-md mt-sm border-t border-surface-variant">
            <span>Grand Total</span>
            <span>₹{currentOrder?.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
