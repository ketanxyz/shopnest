import API from './axios';
import type { RazorpayOrder } from '../types';

export const createRazorpayOrder = async (amount: number): Promise<RazorpayOrder> => {
  const res = await API.post('/payment/order', { amount });
  return res.data;
};

export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ message: string }> => {
  const res = await API.post('/payment/verify', data);
  return res.data;
};
