import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChevronLeft,
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', href: '/admin/users', icon: Users },
];

export const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-white flex">
      <aside className="w-64 bg-secondary border-r border-white/5 fixed h-full p-6 hidden lg:block">
        <Link to="/admin" className="flex items-center gap-2 mb-8">
          <span className="text-xl font-bold">ShopNest</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
            Admin
          </span>
        </Link>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/"
          className="absolute bottom-6 left-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft size={18} /> Back to Store
        </Link>
      </aside>

      <div className="lg:ml-64 flex-1 min-h-screen">
        <header className="h-16 border-b border-white/5 flex items-center px-6 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/" className="text-lg font-bold">ShopNest</Link>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
              Admin
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              View Store
            </Link>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
