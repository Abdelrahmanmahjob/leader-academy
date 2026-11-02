"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS } from "@/content/products";

export type StoreCartLine = {
  productId: string;
  quantity: number;
};

type StoreCartContextValue = {
  cart: StoreCartLine[];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  addToCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const StoreCartContext = createContext<StoreCartContextValue | null>(null);

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreCartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((productId: string) => {
    if (!PRODUCTS.some((product) => product.id === productId)) {
      throw new Error(`Unknown store product: ${productId}`);
    }

    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      return existing
        ? current.map((line) =>
            line.productId === productId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...current, { productId, quantity: 1 }];
    });
  }, []);

  const increaseQuantity = useCallback((productId: string) => {
    setCart((current) =>
      current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      ),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) =>
      current.filter((line) => line.productId !== productId),
    );
  }, []);

  const decreaseQuantity = useCallback(
    (productId: string) => {
      setCart((current) => {
        const line = current.find((item) => item.productId === productId);
        if (!line || line.quantity <= 1) {
          return current.filter((item) => item.productId !== productId);
        }

        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      });
    },
    [],
  );

  const cartCount = useMemo(
    () => cart.reduce((total, line) => total + line.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce((total, line) => {
        const product = PRODUCTS.find((item) => item.id === line.productId);
        return total + (product?.price ?? 0) * line.quantity;
      }, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      subtotal,
      isCartOpen,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      openCart,
      closeCart,
    }),
    [
      cart,
      cartCount,
      subtotal,
      isCartOpen,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      openCart,
      closeCart,
    ],
  );

  return (
    <StoreCartContext.Provider value={value}>
      {children}
    </StoreCartContext.Provider>
  );
}

export function useStoreCart() {
  const context = useContext(StoreCartContext);
  if (!context) {
    throw new Error("useStoreCart must be used within StoreCartProvider");
  }
  return context;
}
