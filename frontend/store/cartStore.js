// frontend/store/cartStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            // State
            items: [], // Array of { product: {...}, quantity: number }

            // Actions
            addItem: (product, quantity = 1) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (item) => item.product.id === product.id
                    );
                    let newItems = [...state.items];

                    if (existingItemIndex > -1) {
                        // Increase quantity if item already exists
                        const updatedItem = {
                            ...newItems[existingItemIndex],
                            quantity: newItems[existingItemIndex].quantity + quantity,
                        };
                         // Prevent quantity exceeding stock (optional - needs product stock info)
                         // if (updatedItem.quantity > product.stock) { ... handle error ... }
                        newItems[existingItemIndex] = updatedItem;
                    } else {
                        // Add new item
                         // Prevent adding more than stock (optional)
                         // if (quantity > product.stock) { ... handle error ... }
                        newItems.push({ product: product, quantity: quantity });
                    }
                    return { items: newItems };
                });
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId
                            ? { ...item, quantity: Math.max(0, quantity) } // Ensure quantity isn't negative
                            : item
                    ).filter(item => item.quantity > 0) // Remove item if quantity becomes 0
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },

            // Selectors (computed values) - use get() inside
            getCartTotal: () => {
                 const items = get().items;
                 return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
             },
             getCartItemCount: () => {
                 const items = get().items;
                 return items.reduce((count, item) => count + item.quantity, 0);
             },
        }),
        {
            name: 'cart-storage', // Unique name for cart persistence
            storage: createJSONStorage(() => localStorage),
        }
    )
);