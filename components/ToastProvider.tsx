"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cn";

type ToastPayload = {
  message: string;
  subline?: string;
  variant?: "success" | "info";
};

type ToastContextValue = {
  show: (message: string, subline?: string, variant?: ToastPayload["variant"]) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const show = useCallback((message: string, subline?: string, variant?: ToastPayload["variant"]) => {
    clearTimers();
    setToast({ message, subline, variant });
    setIsClosing(false);

    closeTimerRef.current = window.setTimeout(() => {
      setIsClosing(true);
      hideTimerRef.current = window.setTimeout(() => {
        setToast(null);
        setIsClosing(false);
      }, 160);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 md:inset-x-auto md:bottom-auto md:right-6 md:top-6">
          <div
            className={cx(
              "toast-shell pointer-events-auto relative w-full max-w-xs overflow-hidden rounded-2xl border border-text/10 bg-bg/80 px-4 py-3 text-sm text-text shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur",
              isClosing ? "toast-out" : "toast-in"
            )}
            role="status"
            aria-live="polite"
          >
            <div className="absolute inset-0 toast-scanline pointer-events-none" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text">
              {toast.message}
            </p>
            {toast.subline ? <p className="mt-1 text-xs text-muted">{toast.subline}</p> : null}
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
