"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  modelId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItemQuantity: (productId: string, modelId: string, quantity: number) => void;
  removeItem: (productId: string, modelId: string) => void;
  clearCart: () => void;
  totalQuantity: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "senteWearCart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch {
        setItems([]);
      }
    }
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.productId === item.productId && entry.modelId === item.modelId
      );
      if (existingIndex === -1) {
        return [...prev, item];
      }
      return prev.map((entry, index) =>
        index === existingIndex
          ? { ...entry, quantity: entry.quantity + item.quantity }
          : entry
      );
    });
  };

  const updateItemQuantity = (productId: string, modelId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.productId === productId && entry.modelId === modelId
          ? { ...entry, quantity }
          : entry
      )
    );
  };

  const removeItem = (productId: string, modelId: string) => {
    setItems((prev) =>
      prev.filter(
        (entry) => !(entry.productId === productId && entry.modelId === modelId)
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
      totalQuantity,
    }),
    [items, totalQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
