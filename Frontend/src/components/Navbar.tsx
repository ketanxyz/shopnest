import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';

const navLinks = [
  { label: 'Store', href: '/products' },
  { label: 'Phones', href: '/products?category=Phones' },
  { label: 'Laptops', href: '/products?category=Laptops' },
  { label: 'Gaming', href: '/products?category=Gaming' },
  { label: 'Audio', href: '/products?category=Audio' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const { openSearch } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-[rgba(5,5,5,0.85)] backdrop-blur-2xl border-b border-white/[0.04]'
            : 'bg-transparent'
        }`}
      >
        <div className="section-padding mx-auto flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              ShopNest
            </span>
            <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] text-text-secondary mt-1">
              /future of smart living
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative text-sm text-text-secondary hover:text-white transition-colors duration-300 py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={openSearch}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors rounded-xl hover:bg-white/[0.04]"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <Link
              to="/wishlist"
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors rounded-xl hover:bg-white/[0.04]"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>

            <Link
              to="/cart"
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors rounded-xl hover:bg-white/[0.04] relative"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors rounded-xl hover:bg-white/[0.04]">
                  <User size={18} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-2xl rounded-2xl border border-white/[0.06] p-2 shadow-2xl shadow-black/50">
                    <div className="px-3 py-2 mb-1 border-b border-white/[0.04]">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-text-secondary truncate">{user.email}</p>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/profile'}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
                    >
                      {user.role === 'admin' ? 'Dashboard' : 'Profile'}
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
                    >
                      Wishlist
                    </Link>
                    <hr className="my-1 border-white/[0.04]" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-error hover:bg-white/[0.04] rounded-xl transition-all"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex h-10 px-5 items-center text-sm font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] rounded-full transition-all"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors rounded-xl hover:bg-white/[0.04]"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-[#0A0A0A] border-l border-white/[0.06] p-6 pt-20"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-base text-text-secondary hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-3 border-white/[0.04]" />
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-base text-text-secondary hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="px-4 py-3 text-base text-error text-left hover:bg-white/[0.04] rounded-xl transition-all"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-6 py-3 mt-2 text-sm font-medium text-center text-black bg-white rounded-full hover:bg-white/90 transition-all"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
