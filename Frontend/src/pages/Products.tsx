import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, List, SlidersHorizontal, Star, Heart, X, ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useWishlistStore } from '../store/wishlistStore';
import { formatPrice } from '../utils/formatters';
import type { Product } from '../types';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products, isLoading } = useProducts();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilters, setMobileFilters] = useState(false);

  const selectedCategory = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'popular': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, selectedCategory, search, sort, minPrice, maxPrice]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('sort', value);
    else params.delete('sort');
    setSearchParams(params);
  };

  const filterPanel = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        <button onClick={clearFilters} className="text-xs text-text-secondary hover:text-white transition-colors">
          Clear all
        </button>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-tertiary tracking-wider uppercase mb-3">Category</h4>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('category', '')}
            className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
              !selectedCategory ? 'bg-white/[0.06] text-white' : 'text-text-secondary hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                selectedCategory === cat ? 'bg-white/[0.06] text-white' : 'text-text-secondary hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-tertiary tracking-wider uppercase mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="input-premium text-sm"
          />
          <span className="text-text-tertiary text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="input-premium text-sm"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-tertiary tracking-wider uppercase mb-3">Search</h4>
        <input
          value={search}
          onChange={(e) => updateFilter('q', e.target.value)}
          placeholder="Search products..."
          className="input-premium text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="section-padding pt-28 pb-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="heading-lg">
            {selectedCategory || 'All Products'}
          </h1>
          <p className="text-sm text-text-secondary mt-2">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="hidden md:block px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-white/[0.15] transition-colors"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#0A0A0A]">{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setView('grid')}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              view === 'grid' ? 'bg-white/[0.08] text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
              view === 'list' ? 'bg-white/[0.08] text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-text-secondary rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="sticky top-24 surface rounded-2xl p-6">
            {filterPanel}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-80">
                  <div className="skeleton h-full w-full rounded-none" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-lg text-text-secondary">No products found</p>
              <button onClick={clearFilters} className="text-sm text-accent hover:underline mt-3">
                Clear filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <div className={view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'space-y-4'
              }>
                {filtered.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                  >
                    {view === 'grid' ? (
                      <ProductGridCard product={product} />
                    ) : (
                      <ProductListCard product={product} />
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0A0A0A] z-50 p-6 overflow-y-auto border-l border-white/[0.06] lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-semibold">Filters</h3>
                <button onClick={() => setMobileFilters(false)} className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white rounded-lg hover:bg-white/[0.04]">
                  <X size={16} />
                </button>
              </div>
              {filterPanel}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Grid Card ─── */
const ProductGridCard = ({ product }: { product: Product }) => {
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product._id);

  return (
    <div className="group card">
      <div className="relative h-72 overflow-hidden">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.imagesUrl}
            alt={product.name}
            className="img-cover group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
        {product.stock <= 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase bg-error/15 text-error rounded-full border border-error/20">
            Sold Out
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-error/15 text-error'
              : 'bg-black/20 text-white/40 hover:text-white hover:bg-black/40 backdrop-blur-sm'
          }`}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <Link
          to={`/products/${product._id}`}
          className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
        >
          <span className="text-sm font-medium">Quick View</span>
        </Link>
      </div>
      <Link to={`/products/${product._id}`} className="p-5 block">
        <p className="text-[11px] text-text-tertiary tracking-wider uppercase mb-1.5">{product.category}</p>
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-semibold">{formatPrice(product.price)}</span>
          <span className="flex items-center gap-1 text-[11px] text-text-secondary">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            {product.rating || 'New'}
          </span>
        </div>
      </Link>
    </div>
  );
};

/* ─── List Card ─── */
const ProductListCard = ({ product }: { product: Product }) => {
  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(product._id);

  return (
    <div className="group card flex overflow-hidden">
      <Link to={`/products/${product._id}`} className="w-44 h-44 flex-shrink-0">
        <img src={product.imagesUrl} alt={product.name} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <Link to={`/products/${product._id}`}>
            <p className="text-[11px] text-text-tertiary tracking-wider uppercase mb-1">{product.category}</p>
            <h3 className="text-base font-medium">{product.name}</h3>
            <p className="text-sm text-text-secondary/70 mt-2 line-clamp-2">{product.description}</p>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-text-secondary">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              {product.rating || 'New'}
            </span>
            <button
              onClick={() => toggle(product)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                isWishlisted ? 'text-error' : 'text-text-secondary hover:text-white'
              }`}
            >
              <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <Link
              to={`/products/${product._id}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-white hover:bg-white/[0.05] transition-all"
            >
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
