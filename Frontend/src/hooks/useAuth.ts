import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginUser, registerUser, verifyOtp, resendOtp } from '../api/auth';
import type { RegisterResponse, VerifyOtpData, ResendOtpData } from '../types';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data, data.token!);
      toast.success('Welcome back!');
      navigate(data.role === 'admin' ? '/admin' : '/');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation<RegisterResponse, unknown, Parameters<typeof registerUser>[0]>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/verify-otp', { state: { email: data.email } });
    },
  });
};

export const useVerifyOtp = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setAuth(data, data.token!);
      toast.success('Account verified successfully!');
      navigate(data.role === 'admin' ? '/admin' : '/');
    },
  });
};

export const useResendOtp = () => {
  return useMutation<{ message: string }, unknown, ResendOtpData>({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};
