import API from './axios';
import type { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get('/products');
  return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const res = await API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateProduct = async (id: string, formData: FormData): Promise<Product> => {
  const res = await API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await API.delete(`/products/${id}`);
};
