import { useState } from 'react';
import { useAllOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import { formatPrice, formatDate, getStatusColor } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../types';

export const AdminOrders = () => {
  const { data: orders, isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState('');

  const filtered = filter ? orders?.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-text-secondary text-sm">{orders?.length || 0} total orders</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 glass rounded-xl text-sm text-white outline-none border border-white/10 focus:border-accent/50 transition-colors"
        >
          <option value="" className="bg-secondary">All Status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-secondary">{s}</option>
          ))}
        </select>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-5 w-20 glass rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                filtered?.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">#{order._id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm">
                      {typeof order.user === 'object' ? (order.user as any).name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{order.items.length}</td>
                    <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus.mutate({ id: order._id, status: e.target.value })}
                        className={`text-sm px-3 py-1.5 glass rounded-lg outline-none border border-white/10 ${getStatusColor(order.status)}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-secondary">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(order.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
