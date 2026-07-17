import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: ReturnType<typeof useAuthStore.getState>['user'];
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, token, logout } = useAuthStore();
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!token) {
      useAuthStore.getState().logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
