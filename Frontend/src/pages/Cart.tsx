import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatters';

export const Cart = () => {
  const { items, removeItem, updateQty, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="section-padding pt-28 pb-16">
        <div className="text-center py-24 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={28} className="text-text-tertiary" />
          </div>
          <h1 className="heading-md mb-2">Your cart is empty</h1>
          <p className="subtitle mb-8">Looks like you haven&apos;t added anything yet</p>
          <Link to="/products" className="btn-primary">
            Start Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding pt-28 pb-16">
      <Link to="/products" className="btn-ghost mb-8 -ml-2">
        <ArrowLeft size={15} /> Continue Shopping
      </Link>

      <h1 className="heading-lg mb-10">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.product._id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="card flex items-center gap-4 p-4 md:p-5"
            >
              <Link to={`/products/${item.product._id}`} className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                <img
                  src={item.product.imagesUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product._id}`}>
                  <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
                </Link>
                <p className="text-xs text-text-tertiary mt-0.5">{item.product.category}</p>
                <p className="text-sm font-semibold mt-2">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-3 py-1.5 border border-white/[0.06]">
                <button onClick={() => updateQty(item.product._id, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-white transition-colors">
                  <Minus size={13} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                <button onClick={() => updateQty(item.product._id, item.qty + 1)} className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-white transition-colors">
                  <Plus size={13} />
                </button>
              </div>
              <p className="text-sm font-semibold w-20 text-right">{formatPrice(item.product.price * item.qty)}</p>
              <button
                onClick={() => removeItem(item.product._id)}
                className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-error rounded-lg hover:bg-white/[0.04] transition-all"
              >
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 md:p-7 sticky top-24">
            <h3 className="text-sm font-semibold mb-5">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Tax</span>
                <span className="text-text-tertiary">Calculated at checkout</span>
              </div>
              <hr className="border-white/[0.06]" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn-primary w-full mt-6"
            >
              Checkout <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
