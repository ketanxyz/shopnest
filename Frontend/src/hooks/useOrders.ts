import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyOrders, getAllOrders, updateOrderStatus, createOrder } from '../api/orders';
import type { CreateOrderData } from '../types';
import toast from 'react-hot-toast';

export const useMyOrders = () => {
  return useQuery({
    queryKey: ['myOrders'],
    queryFn: getMyOrders,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['allOrders'],
    queryFn: getAllOrders,
  });
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderData) => createOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myOrders'] });
      qc.invalidateQueries({ queryKey: ['allOrders'] });
      toast.success('Order placed successfully!');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allOrders'] });
      toast.success('Order status updated');
    },
  });
};
