import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';

export const Wishlist = () => {
  const { items, toggle } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success('Added to cart');
  };

  if (items.length === 0) {
    return (
      <div className="section-padding pt-28 pb-16">
        <div className="text-center py-24">
          <Heart size={64} className="mx-auto mb-6 text-text-secondary opacity-50" />
          <h1 className="text-3xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-text-secondary mb-8">Save your favorite items here</p>
          <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding pt-28 pb-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Store
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <motion.div
            key={product._id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group glass rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-500"
          >
            <Link to={`/products/${product._id}`}>
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.imagesUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </Link>
            <button
              onClick={() => toggle(product)}
              className="absolute top-3 right-3 p-2 rounded-full bg-error/20 text-error"
            >
              <Heart size={16} fill="currentColor" />
            </button>
            <div className="p-5">
              <Link to={`/products/${product._id}`}>
                <p className="text-xs text-text-secondary mb-1">{product.category}</p>
                <h3 className="font-medium truncate mb-2">{product.name}</h3>
                <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 glass rounded-xl text-sm font-medium hover:bg-white/10 transition-all border border-white/10"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
