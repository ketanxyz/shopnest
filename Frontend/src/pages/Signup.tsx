import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { registerSchema, type RegisterForm } from '../utils/validators';
import { useRegister } from '../hooks/useAuth';

export const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const signup = useRegister();

  const onSubmit = (data: RegisterForm) => {
    signup.mutate(data);
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

        <h1 className="heading-lg mb-1">Create account</h1>
        <p className="subtitle mb-10">Join the future of smart living</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input
              type="text"
              {...register('name')}
              placeholder="John Doe"
              className={`input-premium ${errors.name ? 'input-premium-error' : ''}`}
            />
            {errors.name && <p className="text-error text-xs mt-1.5">{errors.name.message}</p>}
          </div>

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
              placeholder="Create a password"
              className={`input-premium ${errors.password ? 'input-premium-error' : ''}`}
            />
            {errors.password && <p className="text-error text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={signup.isPending}
            className="btn-primary w-full"
          >
            {signup.isPending ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-tertiary">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
