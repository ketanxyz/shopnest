import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginUser, registerUser } from '../api/auth';
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
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAuth(data, data.token!);
      toast.success('Account created successfully!');
      navigate('/');
    },
  });
};
