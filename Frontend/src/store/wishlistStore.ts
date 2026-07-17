import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.find((i) => i._id === product._id);
        if (exists) {
          set({ items: get().items.filter((i) => i._id !== product._id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      has: (productId) => get().items.some((i) => i._id === productId),
      clear: () => set({ items: [] }),
    }),
    { name: 'wishlist-storage' }
  )
);
