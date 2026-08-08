import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistanceKm } from '../lib/supabase';

// Custom Leaflet Markers with SVG / Emoji HTML
const createCustomIcon = (emoji, bgColor) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${bgColor};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const merchantIcon = createCustomIcon('🏪', '#8B3A00');
const riderIcon = createCustomIcon('🛵', '#006D3B');
const customerIcon = createCustomIcon('🏠', '#1A73E8');

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

export default function LiveDeliveryMap({
  merchantLat = 18.4088,
  merchantLng = 75.1953,
  riderLat = 18.4060,
  riderLng = 75.1930,
  customerLat = 18.4180,
  customerLng = 75.2080,
  riderName = 'Vikram Singh',
  merchantName = 'Merchant Shop',
  orderStatus = 'out_for_delivery'
}) {
  const merchantPos = [Number(merchantLat), Number(merchantLng)];
  const riderPos = [Number(riderLat), Number(riderLng)];
  const customerPos = [Number(customerLat), Number(customerLng)];

  const distanceKm = calculateDistanceKm(riderPos[0], riderPos[1], customerPos[0], customerPos[1]);
  const isGeofenceReached = distanceKm <= 0.15;

  const polylineCoords = [merchantPos, riderPos, customerPos];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-outline-variant shadow-md h-80 w-full bg-surface-container">
      {/* Map Container */}
      <MapContainer
        center={riderPos}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={riderPos} />

        {/* Polyline Route */}
        <Polyline
          positions={polylineCoords}
          color="#006D3B"
          weight={4}
          dashArray="6, 8"
        />

        {/* Merchant Marker */}
        <Marker position={merchantPos} icon={merchantIcon}>
          <Popup>
            <div className="font-bold font-label-md">🏪 {merchantName}</div>
            <div className="text-xs text-secondary">Pickup Origin</div>
          </Popup>
        </Marker>

        {/* Rider Marker */}
        <Marker position={riderPos} icon={riderIcon}>
          <Popup>
            <div className="font-bold font-label-md">🛵 {riderName}</div>
            <div className="text-xs text-secondary">Live Delivery Partner</div>
            <div className="text-xs font-bold text-primary">{distanceKm} km to customer</div>
          </Popup>
        </Marker>

        {/* Customer Marker */}
        <Marker position={customerPos} icon={customerIcon}>
          <Popup>
            <div className="font-bold font-label-md">🏠 Customer Address</div>
            <div className="text-xs text-secondary">Karmala Town</div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Real-Time Info Overlay */}
      <div className="absolute top-3 right-3 bg-surface/95 backdrop-blur-md px-md py-xs rounded-xl shadow-lg border border-outline-variant/80 text-xs space-y-1 z-10">
        <div className="flex items-center gap-xs font-bold text-on-surface">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
          <span>Live Tracking Active</span>
        </div>
        <div className="text-secondary">
          Distance to destination: <strong className="text-primary">{distanceKm} km</strong>
        </div>
        <div className="text-secondary">
          Est. Arrival: <strong className="text-on-surface">{Math.max(3, Math.round(distanceKm * 4))} mins</strong>
        </div>
      </div>

      {/* Geofence Arrival Banner */}
      {isGeofenceReached && (
        <div className="absolute bottom-3 left-3 right-3 bg-tertiary text-on-tertiary px-md py-xs rounded-xl shadow-lg font-bold text-xs flex items-center justify-between animate-bounce z-10">
          <span className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>Rider has arrived at the delivery destination!</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider bg-on-tertiary/20 px-2 py-0.5 rounded">Geofence Verified</span>
        </div>
      )}
    </div>
  );
}
