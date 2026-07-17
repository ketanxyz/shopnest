export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  verified: boolean;
  token?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imagesUrl: string;
  createdAt: string;
  rating: number;
  numReviews: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface OrderItem {
  productId: string | Product;
  qty: number;
  price: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  totalAmount: number;
  address: Address | string;
  status: OrderStatus;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface CreateOrderData {
  items: { productId: string; qty: number; price: number }[];
  totalAmount: number;
  address: Address;
  paymentId: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: File;
}

export const CATEGORIES = [
  'Phones',
  'Laptops',
  'Gaming',
  'Audio',
  'Wearables',
  'Accessories',
  'Cameras',
  'Smart Home',
] as const;

export const BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'Google',
  'ASUS',
  'MSI',
  'Dell',
  'Nothing',
  'HP',
  'Lenovo',
] as const;

export const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];
