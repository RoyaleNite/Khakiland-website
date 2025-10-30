import { create } from 'zustand';
import type { Cart } from '../types';
import { cartAPI } from '../api/client';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, variantId?: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const cart = await cartAPI.getCart();
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch cart',
        isLoading: false,
      });
    }
  },

  addToCart: async (productId, variantId, quantity = 1) => {
    try {
      set({ isLoading: true, error: null });
      const cart = await cartAPI.addToCart(productId, variantId, quantity);
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to add item to cart',
        isLoading: false,
      });
      throw error;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      set({ isLoading: true, error: null });
      const cart = await cartAPI.updateCartItem(itemId, quantity);
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to update cart item',
        isLoading: false,
      });
    }
  },

  removeItem: async (itemId) => {
    try {
      set({ isLoading: true, error: null });
      const cart = await cartAPI.removeFromCart(itemId);
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to remove item',
        isLoading: false,
      });
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const cart = await cartAPI.clearCart();
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Failed to clear cart',
        isLoading: false,
      });
    }
  },
}));
