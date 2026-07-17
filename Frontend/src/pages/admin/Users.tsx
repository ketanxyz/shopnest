import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api/auth';
import { formatDate } from '../../utils/formatters';
import { Shield, User as UserIcon } from 'lucide-react';

export const AdminUsers = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-text-secondary text-sm">{users?.length || 0} registered users</p>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Verified</th>
                <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-5 w-24 glass rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : (
                users?.map((user) => (
                  <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
                          {user.role === 'admin' ? <Shield size={16} className="text-accent" /> : <UserIcon size={16} className="text-text-secondary" />}
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-text-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${user.verified ? 'text-success' : 'text-text-secondary'}`}>
                        {user.verified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {(user as any).createdAt ? formatDate((user as any).createdAt) : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
