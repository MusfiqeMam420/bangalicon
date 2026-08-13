"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastTone = "success" | "error" | "info";

type ToastPayload =
  | string
  | {
      message: string;
      tone?: ToastTone;
      duration?: number;
    };

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
};

type ToastContextValue = {
  showToast: (payload: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

const toneStyles: Record<ToastTone, string> = {
  success: "bg-[#111111] text-white",
  error: "bg-[#111111] text-white",
  info: "bg-[#111111] text-white",
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(1);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (payload: ToastPayload) => {
      const parsed =
        typeof payload === "string"
          ? { message: payload, tone: "info" as ToastTone, duration: 2200 }
          : {
              message: payload.message,
              tone: payload.tone || "info",
              duration: payload.duration ?? (payload.tone === "error" ? 3200 : 2200),
            };

      const id = nextIdRef.current++;
      const toast: ToastItem = {
        id,
        message: parsed.message,
        tone: parsed.tone,
        duration: parsed.duration,
      };

      setToasts((prev) => [...prev.filter((item) => item.message !== toast.message), toast].slice(-3));

      const timer = setTimeout(() => {
        removeToast(id);
      }, toast.duration);

      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[9999] flex justify-center px-4">
        <div className="flex w-full max-w-[420px] flex-col items-center gap-3">
          <AnimatePresence initial={false}>
            {toasts.map((toast) => {
              const tone = toneStyles[toast.tone];

              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 14, scale: 0.94, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(8px)" }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className={`pointer-events-auto inline-flex min-h-[44px] items-center justify-center rounded-full px-7 py-3 shadow-[0_18px_40px_rgba(17,17,17,0.22)] ${tone}`}
                >
                  <p className="text-center text-[14px] font-medium leading-none tracking-[-0.02em]">
                    {toast.message}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
