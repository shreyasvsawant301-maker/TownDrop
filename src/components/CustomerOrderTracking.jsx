import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { subscribeToOrderLocation, subscribeToGlobalRealtime } from '../lib/supabase';
import LiveDeliveryMap from './LiveDeliveryMap';

export default function CustomerOrderTracking({ onBackToShops }) {
  const { orders, riders, merchants } = useApp();
  const [liveLocation, setLiveLocation] = useState(null);

  // Active customer order
  const latestOrder = orders[0] || {
    id: 'TD1024',
    status: 'out_for_delivery',
    total: 940,
    merchant_id: 'm2222222-2222-2222-2222-222222222222',
    rider_id: 'r1111111-1111-1111-1111-111111111111',
    delivery_address: 'Karmala Main Road, House #42',
    items: [{ name: 'Heavy-Duty Steel Hammer', qty: 2, price: 350 }]
  };

  const merchant = merchants.find(m => m.id === latestOrder.merchant_id) || merchants[1] || merchants[0];
  const rider = riders.find(r => r.id === latestOrder.rider_id) || riders[0];

  // Subscribe to live geolocation updates specific to this order ID
  useEffect(() => {
    if (!latestOrder?.id) return;

    const unsubscribeLocation = subscribeToOrderLocation(latestOrder.id, (locationData) => {
      setLiveLocation(locationData);
    });

    const unsubscribeGlobal = subscribeToGlobalRealtime(() => {
      // Data refreshed by context
    });

    return () => {
      if (unsubscribeLocation) unsubscribeLocation();
      if (unsubscribeGlobal) unsubscribeGlobal();
    };
  }, [latestOrder?.id]);

  const steps = [
    { key: 'placed', label: 'Order Placed', icon: 'check_circle' },
    { key: 'accepted', label: 'Merchant Accepted', icon: 'storefront' },
    { key: 'assigned', label: 'Rider Assigned', icon: 'person_pin' },
    { key: 'picked_up', label: 'Picked Up', icon: 'inventory' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'two_wheeler' },
    { key: 'delivered', label: 'Delivered', icon: 'home' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted': return 1;
      case 'assigned': return 2;
      case 'picked_up': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(latestOrder.status);

  // Determine current rider coordinates (live location > rider profile > default fallback)
  const currentRiderLat = liveLocation?.latitude || rider?.lat || 18.4060;
  const currentRiderLng = liveLocation?.longitude || rider?.lng || 75.1930;

  return (
    <div className="max-w-4xl mx-auto space-y-lg">
      {/* Navigation Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBackToShops}
          className="flex items-center gap-xs font-label-md text-label-md text-secondary hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back to Marketplace</span>
        </button>
        <span className="bg-primary-container text-on-primary-container px-md py-xs rounded-full font-bold text-xs">
          Live Order Status • {latestOrder.id}
        </span>
      </div>

      {/* Main Order Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md md:p-xl shadow-sm space-y-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md pb-md border-b border-surface-variant">
          <div>
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">Order ID: #{latestOrder.id}</span>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              {merchant?.name || 'Local Store'} Order
            </h1>
            <p className="text-xs text-secondary">
              Delivery to: <strong className="text-on-surface">{latestOrder.delivery_address || 'Karmala Main Road'}</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-secondary block">Total Paid</span>
            <span className="font-headline-lg text-headline-lg font-bold text-primary">₹{latestOrder.total}</span>
          </div>
        </div>

        {/* Real-time Order Stepper */}
        <div className="space-y-sm">
          <h2 className="font-label-md text-label-md font-bold text-on-surface">Delivery Timeline</h2>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-xs">
            {steps.map((step, idx) => {
              const isPassed = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={step.key}
                  className={`p-xs rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    isCurrent
                      ? 'bg-primary text-on-primary border-primary font-bold shadow-xs'
                      : isPassed
                      ? 'bg-primary-fixed-dim/30 text-on-surface border-primary/30'
                      : 'bg-surface-container text-secondary border-outline-variant/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isPassed ? 'check_circle' : step.icon}
                  </span>
                  <span className="text-[11px] leading-tight font-medium">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Delivery Map Component */}
        <div className="space-y-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-label-md font-bold text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">map</span>
              Live Geolocation Route Map
            </h3>
            <span className="text-xs text-secondary">
              {liveLocation ? `Updated: ${new Date(liveLocation.recorded_at).toLocaleTimeString()}` : 'Connected to Supabase Realtime'}
            </span>
          </div>

          <LiveDeliveryMap
            merchantLat={merchant?.lat || 18.4088}
            merchantLng={merchant?.lng || 75.1953}
            riderLat={currentRiderLat}
            riderLng={currentRiderLng}
            customerLat={latestOrder.delivery_latitude || 18.4180}
            customerLng={latestOrder.delivery_longitude || 75.2080}
            riderName={rider?.name || 'Vikram Singh'}
            merchantName={merchant?.name || 'Sharma Grocers'}
            orderStatus={latestOrder.status}
          />
        </div>

        {/* Designated Rider Info Card */}
        {rider && (
          <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant/60 flex items-center justify-between">
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold text-lg">
                🛵
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-tertiary">Assigned Community Rider</span>
                <h4 className="font-headline-md font-bold text-on-surface">{rider.name}</h4>
                <p className="text-xs text-secondary">{rider.phone} • Karmala Delivery Partner</p>
              </div>
            </div>
            <a
              href={`tel:${rider.phone}`}
              className="bg-surface text-on-surface border border-outline-variant px-md py-sm rounded-xl font-label-md text-xs font-bold hover:bg-surface-container-high transition-colors flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-sm text-primary">call</span>
              Call Rider
            </a>
          </div>
        )}

        {/* Order Items List */}
        <div className="border-t border-surface-variant pt-md">
          <h4 className="font-label-md font-bold text-on-surface mb-xs">Order Items</h4>
          <ul className="text-xs text-secondary space-y-1">
            {latestOrder.items?.map((it, i) => (
              <li key={i} className="flex justify-between">
                <span>• {it.name} × {it.qty}</span>
                <span className="font-bold text-on-surface">₹{it.price * it.qty}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
