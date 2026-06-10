import { create } from 'zustand';
import { UserProfile, Product } from '../types';

interface AppState {
  user: UserProfile | null;
  products: Product[];
  setUser: (user: UserProfile | null) => void;
  setProducts: (products: Product[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  products: [],
  setUser: (user) => set({ user }),
  setProducts: (products) => set({ products }),
}));