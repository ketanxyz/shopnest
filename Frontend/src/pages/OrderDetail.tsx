import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { useMyOrders } from '../hooks/useOrders';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

const statusFlow = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: orders, isLoading } = useMyOrders();
  const order = orders?.find((o) => o._id === id);

  if (isLoading) {
    return (
      <div className="section-padding pt-28 pb-16">
        <div className="h-96 glass rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section-padding pt-28 pb-16 text-center">
        <p className="text-text-secondary">Order not found</p>
        <Link to="/orders" className="text-accent hover:underline mt-4 inline-block">Back to Orders</Link>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(order.status);

  return (
    <div className="section-padding pt-28 pb-16">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order #{order._id.slice(-8)}</h1>
          <p className="text-text-secondary">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-lg font-semibold ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-white/5 mb-8"
      >
        <div className="flex items-center justify-between">
          {statusFlow.map((status, i) => {
            const isComplete = i <= currentStatusIndex;
            return (
              <div key={status} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  order.status === 'Cancelled' && i > 0
                    ? 'bg-error/20 text-error'
                    : isComplete
                    ? 'bg-accent text-white'
                    : 'glass text-text-secondary'
                }`}>
                  {isComplete ? '✓' : i + 1}
                </div>
                <span className={`text-xs ${isComplete ? 'text-white' : 'text-text-secondary'}`}>{status}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package size={18} className="text-accent" /> Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item: any, i: number) => {
              const product = item.productId as any;
              return (
                <div key={i} className="flex items-center gap-4">
                  <img
                    src={product?.imagesUrl || ''}
                    alt={product?.name || 'Product'}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product?.name || 'Product'}</p>
                    <p className="text-sm text-text-secondary">Qty: {item.qty} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Shipping & Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-accent" /> Shipping Address
            </h2>
            {typeof order.address === 'object' && order.address ? (
              <div className="text-sm text-text-secondary space-y-1">
                <p className="text-white font-medium">{(order.address as any).fullName}</p>
                <p>{(order.address as any).street}</p>
                <p>{(order.address as any).city}, {(order.address as any).state} {(order.address as any).zipCode}</p>
                <p>{(order.address as any).country}</p>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">{String(order.address)}</p>
            )}
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-accent" /> Payment
            </h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-text-secondary">
                <span>Payment ID</span>
                <span className="text-white">{order.paymentId}</span>
              </div>
              <hr className="border-white/5" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
