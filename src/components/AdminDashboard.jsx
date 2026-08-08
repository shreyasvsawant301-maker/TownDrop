import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const { orders, merchants, riders } = useApp();

  const totalOrdersCount = orders.length;
  const activeMerchantsCount = merchants.length;
  const activeRidersCount = riders.length;
  const ordersInTransitCount = orders.filter(o => ['placed', 'accepted', 'assigned', 'picked_up'].includes(o.status)).length;

  // Chart data calculation
  const merchantOrderCounts = merchants.map(m => {
    const count = orders.filter(o => o.merchant_id === m.id).length;
    return {
      name: m.name.split(' ')[0], // Short name for X-axis
      fullName: m.name,
      orders: count
    };
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return 'bg-error-container text-on-error-container';
      case 'accepted':
      case 'assigned':
        return 'bg-primary-fixed text-on-primary-fixed-variant';
      case 'picked_up':
        return 'bg-tertiary-container text-on-tertiary-container';
      case 'delivered':
        return 'bg-surface-container-high text-on-surface';
      default:
        return 'bg-surface-container text-secondary';
    }
  };

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="bg-tertiary-container text-on-tertiary-container px-sm py-xs rounded-full font-label-sm text-label-sm font-bold inline-block mb-xs">
            Ops & Governance
          </span>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">Platform Operations</h1>
          <p className="font-body-md text-secondary">Real-time metrics and city-wide overview for Karmala</p>
        </div>
      </div>

      {/* Summary Cards (Bento Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md md:gap-lg">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed rounded-full px-2 py-1">+12%</span>
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl font-bold text-on-surface">{totalOrdersCount}</div>
            <div className="font-body-sm text-secondary">Total Orders</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-primary">storefront</span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-bold">Approved</span>
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl font-bold text-on-surface">{activeMerchantsCount}</div>
            <div className="font-body-sm text-secondary">Active Merchants</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-primary">two_wheeler</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed rounded-full px-2 py-1">+5%</span>
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl font-bold text-on-surface">{activeRidersCount}</div>
            <div className="font-body-sm text-secondary">Active Riders</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
            </div>
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl font-bold text-primary">{ordersInTransitCount}</div>
            <div className="font-body-sm text-secondary">Orders in Transit</div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Table & Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Dense Data Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant overflow-hidden">
          <div className="p-md border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Recent Platform Orders</h2>
            <span className="font-label-sm text-label-sm text-secondary">Live Auto-Update</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-variant text-secondary font-label-md text-label-md">
                  <th className="p-md whitespace-nowrap">Order ID</th>
                  <th className="p-md">Customer</th>
                  <th className="p-md">Merchant</th>
                  <th className="p-md">Rider</th>
                  <th className="p-md">Total</th>
                  <th className="p-md">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const merchant = merchants.find(m => m.id === order.merchant_id);
                  const rider = riders.find(r => r.id === order.rider_id);

                  return (
                    <tr key={order.id} className="border-b border-surface-variant hover:bg-surface-container-low transition-colors">
                      <td className="p-md font-label-md text-on-surface font-bold">#{order.id}</td>
                      <td className="p-md font-body-sm text-on-surface">{order.customer_name}</td>
                      <td className="p-md font-body-sm text-secondary">{merchant?.name || 'Local Shop'}</td>
                      <td className="p-md font-body-sm text-secondary">{rider?.name || 'Unassigned'}</td>
                      <td className="p-md font-label-md text-primary font-bold">₹{order.total}</td>
                      <td className="p-md">
                        <span className={`px-sm py-xs rounded-full font-label-sm text-label-sm font-bold uppercase ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Bar Chart */}
        <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-surface-variant flex flex-col justify-between space-y-md">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-xs">Orders by Merchant</h2>
            <p className="font-body-sm text-secondary">Distribution of platform volume</p>
          </div>

          <div className="h-64 w-full pt-md">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={merchantOrderCounts}>
                <XAxis dataKey="name" stroke="#8d7167" fontSize={12} />
                <YAxis stroke="#8d7167" fontSize={12} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value} orders`, 'Volume']}
                  labelFormatter={(label, items) => items[0]?.payload?.fullName || label}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e1bfb4' }}
                />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                  {merchantOrderCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#973100' : index === 1 ? '#004cba' : '#5e5f5d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-sm border-t border-surface-variant text-body-sm text-secondary text-center">
            Updated via global Supabase subscription
          </div>
        </div>
      </div>
    </div>
  );
}
