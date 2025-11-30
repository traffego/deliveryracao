import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
    id: string;
    productId: string;
    productName: string;
    productSlug: string;
    productType: string;
    price: number;
    unit: string;
    orderType: 'by_quantity' | 'by_value';
    quantity: number;
    requestedValue?: number;
    subtotal: number;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemsCount: () => number;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const exists = get().items.find(i => i.id === item.id);
                if (exists) {
                    set({
                        items: get().items.map(i =>
                            i.id === item.id
                                ? { ...i, quantity: i.quantity + item.quantity, subtotal: i.subtotal + item.subtotal }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter(i => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                set({
                    items: get().items.map(i =>
                        i.id === id
                            ? { ...i, quantity, subtotal: quantity * i.price }
                            : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce((sum, item) => sum + item.subtotal, 0);
            },

            getItemsCount: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
