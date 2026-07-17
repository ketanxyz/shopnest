import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { loginSchema, type LoginForm } from '../utils/validators';
import { useLogin } from '../hooks/useAuth';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const login = useLogin();

  const onSubmit = (data: LoginForm) => {
    login.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-padding py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="btn-ghost mb-12 -ml-2">
          <ArrowLeft size={15} /> Back
        </Link>

        <h1 className="heading-lg mb-1">Welcome back</h1>
        <p className="subtitle mb-10">Sign in to your NOVA account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className={`input-premium ${errors.email ? 'input-premium-error' : ''}`}
            />
            {errors.email && <p className="text-error text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className={`input-premium ${errors.password ? 'input-premium-error' : ''}`}
            />
            {errors.password && <p className="text-error text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-xs text-text-secondary hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="btn-primary w-full"
          >
            {login.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-tertiary">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
