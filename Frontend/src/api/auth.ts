import API from './axios';
import type { User, LoginCredentials, RegisterData } from '../types';

export const loginUser = async (data: LoginCredentials): Promise<User> => {
  const res = await API.post('/auth/login', data);
  return res.data;
};

export const registerUser = async (data: RegisterData): Promise<User> => {
  const res = await API.post('/auth/register', data);
  return res.data;
};

export const getUsers = async (): Promise<User[]> => {
  const res = await API.get('/auth/users');
  return res.data;
};
