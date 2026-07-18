import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useVerifyOtp, useResendOtp } from '../hooks/useAuth';

export const VerifyOtp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  useEffect(() => {
    const stateEmail = (location.state as { email?: string })?.email;
    if (stateEmail) setEmail(stateEmail);
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verifyOtp.mutateAsync({ email, otp });
    } catch (error) {
      // error handled in hook
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp.mutateAsync({ email });
    } catch (error) {
      // handled by toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center section-padding py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <button onClick={() => navigate('/signup')} className="btn-ghost mb-12 -ml-2 flex items-center gap-2">
          <ArrowLeft size={15} /> Back
        </button>

        <h1 className="heading-lg mb-1">Verify your account</h1>
        <p className="subtitle mb-10">Enter the OTP sent to your email to complete signup.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-premium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="input-premium"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={verifyOtp.isPending}>
            {verifyOtp.isPending ? 'Verifying...' : 'Verify Account'}
          </button>

          <button
            type="button"
            className="w-full py-3 text-sm text-text-secondary hover:text-white transition-colors"
            onClick={handleResend}
            disabled={resendOtp.isPending}
          >
            {resendOtp.isPending ? 'Resending...' : 'Resend OTP'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
