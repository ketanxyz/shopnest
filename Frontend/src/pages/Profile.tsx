import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only - no backend endpoint for profile update
  };

  return (
    <div className="section-padding pt-28 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">My Profile</h1>

        <div className="glass rounded-2xl p-8 border border-white/5 mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <User size={28} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-text-secondary">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 glass rounded-xl border border-white/10 text-text-secondary">
                <Mail size={16} />
                {user?.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <div className="flex items-center gap-2 px-4 py-3 glass rounded-xl border border-white/10 text-text-secondary">
                <Shield size={16} />
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
            >
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3.5 glass rounded-xl text-error hover:bg-error/10 transition-all border border-white/5"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </motion.div>
    </div>
  );
};
