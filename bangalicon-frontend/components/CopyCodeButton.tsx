"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BangaliconControlIcon from "@/components/BangaliconControlIcon";
import { useToast } from "@/components/ui/ToastProvider";

interface CopyCodeButtonProps {
  text: string;
  successMessage?: string;
  className?: string;
}

export default function CopyCodeButton({
  text,
  successMessage = "Code copied",
  className = "",
}: CopyCodeButtonProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast({ message: successMessage, tone: "success" });

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      showToast({ message: "Copy failed", tone: "error" });
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy code"
      className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/95 transition hover:bg-white/6 hover:text-white ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <BangaliconControlIcon name="check" className="text-[18px] text-white" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <BangaliconControlIcon name="copy" className="text-[18px] text-white" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
