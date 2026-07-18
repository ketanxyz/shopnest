import API from './axios';
import type { User, LoginCredentials, RegisterData, RegisterResponse, VerifyOtpData, ResendOtpData } from '../types';

export const loginUser = async (data: LoginCredentials): Promise<User> => {
  const res = await API.post('/auth/login', data);
  return res.data;
};

export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const res = await API.post('/auth/register', data);
  return res.data;
};

export const verifyOtp = async (data: VerifyOtpData): Promise<User> => {
  const res = await API.post('/auth/verify-otp', data);
  return res.data;
};

export const resendOtp = async (data: ResendOtpData): Promise<{ message: string }> => {
  const res = await API.post('/auth/resend-otp', data);
  return res.data;
};

export const getUsers = async (): Promise<User[]> => {
  const res = await API.get('/auth/users');
  return res.data;
};
