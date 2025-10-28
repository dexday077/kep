import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
  productId?: string;
};

interface CartState {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (item: Omit<CartItem, 'qty'> | CartItem, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      total: 0,

      addToCart: (item, qty = 1) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          let newItems: CartItem[];

          if (existingItem) {
            // Update existing item quantity
            newItems = state.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
          } else {
            // Add new item
            newItems = [...state.items, { ...item, qty }];
          }

          const count = newItems.reduce((sum, item) => sum + item.qty, 0);
          const total = newItems.reduce((sum, item) => sum + item.price * item.qty, 0);

          return {
            items: newItems,
            count,
            total,
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          const count = newItems.reduce((sum, item) => sum + item.qty, 0);
          const total = newItems.reduce((sum, item) => sum + item.price * item.qty, 0);

          return {
            items: newItems,
            count,
            total,
          };
        });
      },

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeFromCart(id);
          return;
        }

        set((state) => {
          const newItems = state.items.map((i) => (i.id === id ? { ...i, qty } : i));

          const count = newItems.reduce((sum, item) => sum + item.qty, 0);
          const total = newItems.reduce((sum, item) => sum + item.price * item.qty, 0);

          return {
            items: newItems,
            count,
            total,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          count: 0,
          total: 0,
        });
      },

      getItemQuantity: (id) => {
        const item = get().items.find((i) => i.id === id);
        return item?.qty || 0;
      },
    }),
    {
      name: 'kep-cart-storage', // localStorage key
    },
  ),
);
