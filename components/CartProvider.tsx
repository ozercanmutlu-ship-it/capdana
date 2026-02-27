"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export type CartItem = {
  id: string;
  type: "ready" | "custom";
  name: string;
  price: number;
  quantity: number;
  slug?: string;
  frontId?: string;
  bandanaId?: string;
  image?: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalQuantity: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "capdanaCart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      hasLoadedRef.current = true;
      return;
    }
    try {
      const parsed = JSON.parse(stored) as CartItem[];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    } finally {
      hasLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    trackEvent("add_to_cart", {
      item_id: item.id,
      item_name: item.name,
      currency: "TRY",
      value: item.price * item.quantity,
      quantity: item.quantity,
      item_category: item.type,
    });
    setItems((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === item.id);
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

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems((prev) => prev.map((entry) => (entry.id === id ? { ...entry, quantity } : entry)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
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
