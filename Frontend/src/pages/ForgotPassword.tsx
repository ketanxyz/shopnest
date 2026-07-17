import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-padding py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        {sent ? (
          <div className="text-center">
            <CheckCircle size={48} className="text-success mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">Check your email</h1>
            <p className="text-text-secondary">
              We've sent a password reset link to <strong className="text-white">{email}</strong>
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-8 text-sm text-text-secondary hover:text-white transition-colors"
            >
              Send again
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Reset password</h1>
            <p className="text-text-secondary mb-8">Enter your email and we'll send you a reset link</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-5 py-3 glass rounded-xl text-white placeholder-text-secondary outline-none focus:border-accent/50 transition-colors border border-white/10"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
              >
                Send Reset Link
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};
