import API from './axios';
import type { Order, CreateOrderData } from '../types';

export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const res = await API.post('/orders', data);
  return res.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const res = await API.get('/orders/myorders');
  return res.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await API.get('/orders');
  return res.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  const res = await API.put(`/orders/${id}/status`, { status });
  return res.data;
};
