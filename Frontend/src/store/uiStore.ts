import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  isCartOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleCart: () => void;
  closeCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isCartOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
  closeCart: () => set({ isCartOpen: false }),
}));
