import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ArrowLeft } from 'lucide-react';
import { useMyOrders } from '../hooks/useOrders';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

const statusFlow = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export const Orders = () => {
  const { data: orders, isLoading } = useMyOrders();

  if (isLoading) {
    return (
      <div className="section-padding pt-28 pb-16">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 glass rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding pt-28 pb-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Store
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">My Orders</h1>

      {!orders?.length ? (
        <div className="text-center py-24">
          <Package size={64} className="mx-auto mb-6 text-text-secondary opacity-50" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-text-secondary mb-8">Start shopping to see your orders here</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-white/5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-text-secondary">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-text-secondary">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-sm text-accent hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="flex items-center gap-2 mb-4">
                {statusFlow.map((status, i) => {
                  const currentIndex = statusFlow.indexOf(order.status);
                  const isComplete = i <= currentIndex;
                  const isCancelled = order.status === 'Cancelled';
                  return (
                    <div key={status} className="flex items-center gap-2 flex-1">
                      <div className={`w-3 h-3 rounded-full ${
                        isCancelled ? 'bg-error' : isComplete ? 'bg-accent' : 'bg-white/10'
                      }`} />
                      <span className={`text-xs ${isComplete ? 'text-white' : 'text-text-secondary'}`}>
                        {status}
                      </span>
                      {i < statusFlow.length - 1 && (
                        <div className={`flex-1 h-px ${isComplete && !isCancelled ? 'bg-accent' : 'bg-white/10'}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  {order.items.slice(0, 3).map((item: any, i: number) => (
                    <img
                      key={i}
                      src={item.productId?.imagesUrl || ''}
                      alt={item.productId?.name || 'Product'}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-text-secondary">+{order.items.length - 3} more</span>
                  )}
                </div>
                <span className="text-lg font-bold">{formatPrice(order.totalAmount)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
