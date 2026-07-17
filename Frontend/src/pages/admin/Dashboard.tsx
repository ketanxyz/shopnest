import { motion } from 'framer-motion';
import { Users, ShoppingCart, Package, IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatPrice } from '../../utils/formatters';

const statCards = [
  { label: 'Total Users', key: 'totalUsers', icon: Users, color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
  { label: 'Total Orders', key: 'totalOrders', icon: ShoppingCart, color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20' },
  { label: 'Total Products', key: 'totalProducts', icon: Package, color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
  { label: 'Total Revenue', key: 'totalRevenue', icon: IndianRupee, color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/20' },
];

export const AdminDashboard = () => {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 glass rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-text-secondary text-sm">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const value = analytics ? analytics[card.key as keyof typeof analytics] : 0;
          const isCurrency = card.key === 'totalRevenue';

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-2xl p-6 border ${card.border} bg-gradient-to-br ${card.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon size={24} className="text-accent" />
                </div>
                <TrendingUp size={20} className="text-success" />
              </div>
              <p className="text-2xl font-bold">
                {isCurrency ? formatPrice(Number(value)) : Number(value).toLocaleString()}
              </p>
              <p className="text-sm text-text-secondary mt-1">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-text-secondary text-sm">Analytics data loaded. Revenue tracking and order charts will appear here once more data is available.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/5"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/admin/products" className="flex items-center justify-between p-3 glass rounded-xl hover:bg-white/5 transition-colors border border-white/5">
              <span className="text-sm">Manage Products</span>
              <ArrowUpRight size={16} className="text-text-secondary" />
            </a>
            <a href="/admin/orders" className="flex items-center justify-between p-3 glass rounded-xl hover:bg-white/5 transition-colors border border-white/5">
              <span className="text-sm">View Orders</span>
              <ArrowUpRight size={16} className="text-text-secondary" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
