import { CartProductType } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProductType[];
  totalItems: number;
  totalPrice: number;
}

interface Actions {
  addToCart: (items: CartProductType) => void;
  removeFromCart: (item: CartProductType) => void; // single prodcut removal
  updateProductQty: (product: CartProductType, quantity: number) => void;
  removeMultipleFromCart: (items: CartProductType[]) => void;
  emptyCart: () => void;
}

// Initial a default state
const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      addToCart: (product: CartProductType) => {
        if (!product) return;
        const cart = get().cart;
        // if product already exists in cart
        const cartItem = cart.find(
          (item) =>
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId,
        );

        if (cartItem) {
          const updatedCart = cart.map((item) =>
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId
              ? { ...item, quantity: item.quantity + product.quantity }
              : item,
          );
          set((state) => ({
            cart: updatedCart,
            totalPrice: state.totalPrice + product.price * product.quantity,
          }));
        } else {
          const updatedCart = [...cart, { ...product }];
          set((state) => ({
            cart: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + product.price * product.quantity,
          }));
        }
      },
      updateProductQty: (product: CartProductType, quantity: number) => {
        const cart = get().cart;

        // if quantity is 0 or less, remove the item
        if (quantity <= 0) {
          get().removeFromCart(product);
          return;
        }

        const updatedCart = cart.map((item) =>
          item.productId === product.productId &&
          item.variantId === product.variantId &&
          item.sizeId === product.sizeId
            ? { ...item, quantity }
            : item,
        );

        const totalItems = updatedCart.length;
        const totalPrice = updatedCart.reduce(
          (sum, item) => sum + item.price * quantity,
          0,
        );
        set(() => ({
          cart: updatedCart,
          totalItems,
          totalPrice,
        }));
      },
      removeMultipleFromCart: (product: CartProductType[]) => {
        product.forEach((product) => {
          get().removeFromCart(product);
        });
      },
      removeFromCart: (product: CartProductType) => {
        const cart = get().cart;
        const updatedCart = cart.filter(
          (item) =>
            !(
              item.productId === product.productId &&
              item.variantId === product.variantId &&
              item.sizeId === product.sizeId
            ),
        );

        const totalItems = updatedCart.length;
        const totalPrice = updatedCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        set(() => ({
          cart: updatedCart,
          totalItems,
          totalPrice,
        }));
      },
      emptyCart: () => {
        set(() => ({
          cart: [],
          totalItems: 0,
          totalPrice: 0,
        }));
      },
    }),
    {
      name: "cart",
    },
  ),
);
