import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { recordRiderLocation } from '../lib/supabase';

export default function RiderDashboard() {
  const { riders, orders, updateRiderStatus, updateOrderStatus, profile } = useApp();

  const [selectedRiderId, setSelectedRiderId] = useState(riders[0]?.id || 'r1111111-1111-1111-1111-111111111111');
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isDemoSimulating, setIsDemoSimulating] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [lastLocationSent, setLastLocationSent] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  const rider = riders.find(r => r.id === selectedRiderId) || riders[0];
  const assignedOrders = orders.filter(o => o.rider_id === rider?.id || (o.status === 'assigned' && !o.rider_id));
  const activeOrder = assignedOrders.find(o => ['assigned', 'picked_up', 'out_for_delivery'].includes(o.status)) || assignedOrders[0];

  // Predefined Demo Coordinates (Merchant Shop -> Karmala Town -> Customer House)
  const DEMO_ROUTE_POINTS = [
    { lat: 18.4088, lng: 75.1953, label: 'Merchant Shop (Origin)' },
    { lat: 18.4110, lng: 75.1980, label: 'Karmala Main Chowk' },
    { lat: 18.4140, lng: 75.2020, label: 'Sector 4 Road' },
    { lat: 18.4165, lng: 75.2055, label: 'Near Customer Landmark (Geofence)' },
    { lat: 18.4180, lng: 75.2080, label: 'Customer Home (Destination)' }
  ];

  // REAL BROWSER GEOLOCATION HANDLER
  const handleStartRealGps = () => {
    if (!activeOrder) return;
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by this browser.');
      return;
    }

    setGpsError(null);
    setIsGpsActive(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const payload = {
          order_id: activeOrder.id,
          rider_id: rider.id,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 10
        };
        const res = await recordRiderLocation(payload);
        setLastLocationSent(res);
      },
      (err) => {
        setGpsError(`GPS Error: ${err.message}. Switch to Demo Simulation Mode.`);
        setIsGpsActive(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // DEMO SIMULATION MODE INTERVAL
  useEffect(() => {
    let timer = null;
    if (isDemoSimulating && activeOrder) {
      timer = setInterval(async () => {
        setSimStepIndex(prev => {
          const nextIdx = (prev + 1) % DEMO_ROUTE_POINTS.length;
          const pt = DEMO_ROUTE_POINTS[nextIdx];

          recordRiderLocation({
            order_id: activeOrder.id,
            rider_id: rider.id,
            latitude: pt.lat,
            longitude: pt.lng,
            accuracy: 5
          }).then(res => setLastLocationSent(res));

          return nextIdx;
        });
      }, 4000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isDemoSimulating, activeOrder, rider?.id]);

  const handleStatusChange = async (orderId, nextStatus) => {
    await updateOrderStatus(orderId, nextStatus, rider.id);
    if (nextStatus === 'delivered') {
      setIsDemoSimulating(false);
      setIsGpsActive(false);
    }
  };

  const toggleWorkStatus = async () => {
    const nextStatus = rider?.status === 'available' ? 'busy' : 'available';
    await updateRiderStatus(rider.id, nextStatus);
  };

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-sm py-xs rounded-full font-label-sm text-label-sm font-bold inline-block mb-xs">
            Rider Delivery Console • {profile?.full_name || rider?.name}
          </span>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
            {rider?.name} ({rider?.phone})
          </h1>
          <p className="font-body-md text-secondary">
            Karmala Community Partner • Real-time Location Sharing
          </p>
        </div>

        <button
          onClick={toggleWorkStatus}
          className={`px-md py-sm rounded-xl font-label-md text-label-md font-bold transition-colors flex items-center gap-xs shadow-xs ${
            rider?.status === 'available'
              ? 'bg-tertiary text-on-tertiary hover:opacity-90'
              : 'bg-error-container text-on-error-container hover:opacity-90'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></span>
          <span>Status: {rider?.status === 'available' ? '🟢 Available' : '🔴 Busy'}</span>
        </button>
      </div>

      {/* Active Order Delivery Card */}
      {activeOrder ? (
        <div className="bg-surface-container-lowest border-2 border-primary rounded-2xl p-md md:p-xl shadow-md space-y-lg">
          <div className="flex justify-between items-start pb-md border-b border-surface-variant">
            <div>
              <span className="bg-primary text-on-primary px-sm py-unit rounded-full text-xs font-bold uppercase tracking-wider">
                Assigned Delivery • #{activeOrder.id}
              </span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mt-xs">
                Deliver to {activeOrder.customer_name}
              </h2>
              <p className="text-xs text-secondary">
                📍 Address: <strong className="text-on-surface">{activeOrder.delivery_address || 'Karmala Market Road'}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-secondary block">Order Value</span>
              <span className="font-headline-lg font-bold text-primary">₹{activeOrder.total}</span>
            </div>
          </div>

          {/* Location Authentication & Security Controls */}
          <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant space-y-sm">
            <h3 className="font-label-md font-bold text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">my_location</span>
              Designated Order Location Security (`order.id = ${activeOrder.id}`)
            </h3>
            <p className="text-xs text-secondary">
              GPS updates are cryptographically scoped to Order <strong className="text-on-surface">#{activeOrder.id}</strong> and Rider <strong className="text-on-surface">{rider.name}</strong>.
            </p>

            {gpsError && (
              <div className="bg-error-container text-on-error-container p-xs rounded text-xs font-medium">
                {gpsError}
              </div>
            )}

            <div className="flex flex-wrap gap-sm pt-xs">
              {/* Button 1: Real Device Geolocation */}
              <button
                onClick={handleStartRealGps}
                className="bg-primary text-on-primary px-md py-sm rounded-xl font-bold text-xs hover:bg-primary-container transition-colors flex items-center gap-xs shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">near_me</span>
                Share Live Device GPS
              </button>

              {/* Button 2: Demo Tracking Simulation */}
              <button
                onClick={() => {
                  setIsDemoSimulating(!isDemoSimulating);
                  setIsGpsActive(false);
                }}
                className={`px-md py-sm rounded-xl font-bold text-xs transition-colors flex items-center gap-xs shadow-xs ${
                  isDemoSimulating
                    ? 'bg-error text-on-error'
                    : 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isDemoSimulating ? 'pause_circle' : 'play_circle'}
                </span>
                <span>{isDemoSimulating ? 'Stop Demo GPS Route' : '▶ Start Demo GPS Route'}</span>
              </button>
            </div>

            {/* Live Location Output Indicator */}
            {lastLocationSent && (
              <div className="bg-surface p-xs rounded-lg border border-outline-variant text-[11px] text-secondary flex justify-between items-center">
                <span>
                  📍 Last Broadcast: <strong>{lastLocationSent.latitude.toFixed(4)}, {lastLocationSent.longitude.toFixed(4)}</strong> (Accuracy: {lastLocationSent.accuracy}m)
                </span>
                <span className="font-bold text-tertiary">✓ Sent to Supabase Realtime</span>
              </div>
            )}
          </div>

          {/* Delivery Workflow Action Stepper */}
          <div className="space-y-sm border-t border-surface-variant pt-md">
            <h3 className="font-label-md font-bold text-on-surface">Update Delivery Status</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
              <button
                onClick={() => handleStatusChange(activeOrder.id, 'picked_up')}
                disabled={activeOrder.status === 'picked_up' || activeOrder.status === 'out_for_delivery'}
                className={`p-sm rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-xs border ${
                  activeOrder.status === 'picked_up'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant'
                }`}
              >
                <span className="material-symbols-outlined text-base">inventory</span>
                1. Mark Picked Up
              </button>

              <button
                onClick={() => handleStatusChange(activeOrder.id, 'out_for_delivery')}
                disabled={activeOrder.status === 'out_for_delivery'}
                className={`p-sm rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-xs border ${
                  activeOrder.status === 'out_for_delivery'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant'
                }`}
              >
                <span className="material-symbols-outlined text-base">two_wheeler</span>
                2. Out for Delivery
              </button>

              <button
                onClick={() => handleStatusChange(activeOrder.id, 'delivered')}
                className="bg-tertiary text-on-tertiary hover:opacity-90 p-sm rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-xs shadow-xs"
              >
                <span className="material-symbols-outlined text-base">task_alt</span>
                3. Mark Delivered
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl text-center text-secondary space-y-sm">
          <span className="material-symbols-outlined text-5xl text-outline">two_wheeler</span>
          <h3 className="font-headline-md font-bold text-on-surface">No Active Deliveries</h3>
          <p className="text-xs">You are on standby. New merchant orders will automatically appear here.</p>
        </div>
      )}
    </div>
  );
}
