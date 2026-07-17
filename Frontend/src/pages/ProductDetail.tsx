import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, ShoppingBag, Minus, Plus, Truck, Shield, Clock } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  if (isLoading) {
    return (
      <div className="section-padding pt-28 pb-16">
        <div className="animate-pulse space-y-8">
          <div className="h-96 glass rounded-2xl" />
          <div className="h-8 w-64 glass rounded-lg" />
          <div className="h-4 w-96 glass rounded-lg" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-padding pt-28 pb-16 text-center">
        <p className="text-text-secondary">Product not found</p>
        <Link to="/products" className="text-accent hover:underline mt-4 inline-block">Back to products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    addItem(product, qty);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="section-padding pt-28 pb-16">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden glass cursor-crosshair"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.imagesUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {zoom && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${product.imagesUrl})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '200%',
                }}
              />
            )}
            {product.stock <= 0 && (
              <span className="absolute top-4 left-4 px-4 py-2 text-sm font-medium bg-error/20 text-error rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm text-accent font-medium mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-text-secondary'} />
              ))}
            </div>
            <span className="text-sm text-text-secondary">{product.numReviews || 0} reviews</span>
          </div>

          <div className="text-3xl font-bold">
            {formatPrice(product.price)}
          </div>

          <p className="text-text-secondary leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">Quantity</span>
            <div className="flex items-center gap-3 glass rounded-xl px-4 py-2 border border-white/10">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-accent transition-colors">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-1 hover:text-accent transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <span className="text-sm text-text-secondary">{product.stock} available</span>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 glass rounded-xl font-medium hover:bg-white/10 transition-all disabled:opacity-50 border border-white/10"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button
              onClick={() => toggle(product)}
              className={`p-4 rounded-xl border transition-all ${
                has(product._id) ? 'border-error text-error bg-error/10' : 'border-white/10 text-text-secondary hover:text-white'
              }`}
            >
              <Heart size={20} fill={has(product._id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <Link
            to={product.stock > 0 ? `/cart` : '#'}
            onClick={handleBuyNow}
            className="block w-full text-center py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
          >
            Buy Now
          </Link>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="glass rounded-xl p-4 text-center border border-white/5">
              <Truck size={20} className="mx-auto mb-2 text-accent" />
              <p className="text-xs text-text-secondary">Free Shipping</p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-white/5">
              <Shield size={20} className="mx-auto mb-2 text-accent" />
              <p className="text-xs text-text-secondary">1 Year Warranty</p>
            </div>
            <div className="glass rounded-xl p-4 text-center border border-white/5">
              <Clock size={20} className="mx-auto mb-2 text-accent" />
              <p className="text-xs text-text-secondary">2-3 Days Delivery</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
