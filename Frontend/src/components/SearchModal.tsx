import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/formatters';

export const SearchModal = () => {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: products } = useProducts();

  const recentSearches = JSON.parse(localStorage.getItem('recent-searches') || '[]') as string[];

  const filtered = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const handleSelect = (id: string) => {
    if (query.trim()) {
      const recent = JSON.parse(localStorage.getItem('recent-searches') || '[]') as string[];
      const updated = [query, ...recent.filter((s) => s !== query)].slice(0, 5);
      localStorage.setItem('recent-searches', JSON.stringify(updated));
    }
    closeSearch();
    navigate(`/products/${id}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/70 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[12%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
          >
            <div className="surface-glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <Search size={18} className="text-text-secondary flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-white placeholder-text-tertiary outline-none text-base"
                />
                <kbd className="hidden md:inline-flex text-[10px] text-text-tertiary px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                  ESC
                </kbd>
                <button
                  onClick={closeSearch}
                  className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-white rounded-lg hover:bg-white/[0.06] transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {query ? (
                  filtered?.length ? (
                    filtered.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => handleSelect(p._id)}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/[0.04] transition-all text-left"
                      >
                        <img
                          src={p.imagesUrl}
                          alt={p.name}
                          className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-text-tertiary">{p.category}</p>
                        </div>
                        <span className="text-sm font-semibold flex-shrink-0">{formatPrice(p.price)}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-text-secondary py-10 text-sm">No results found</p>
                  )
                ) : (
                  <div className="p-3 space-y-6">
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary tracking-wider uppercase mb-3">
                          <Clock size={13} /> Recent
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((s) => (
                            <button
                              key={s}
                              onClick={() => setQuery(s)}
                              className="px-3 py-1.5 text-xs bg-white/[0.04] hover:bg-white/[0.08] rounded-full transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary tracking-wider uppercase mb-3">
                        <TrendingUp size={13} /> Popular
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {products?.slice(0, 4).map((p) => (
                          <button
                            key={p._id}
                            onClick={() => handleSelect(p._id)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all text-left"
                          >
                            <img
                              src={p.imagesUrl}
                              alt={p.name}
                              className="w-9 h-9 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{p.name}</p>
                              <p className="text-[10px] text-text-tertiary">{formatPrice(p.price)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
