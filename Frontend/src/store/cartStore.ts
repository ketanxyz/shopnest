import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty = 1) => {
        const existing = get().items.find((i) => i.product._id === product._id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product._id === product._id ? { ...i, qty: i.qty + qty } : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, qty }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product._id !== productId) });
      },
      updateQty: (productId, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map((i) =>
            i.product._id === productId ? { ...i, qty } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    }),
    { name: 'cart-storage' }
  )
);
