"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiBase, storeAuth, type AuthUser } from "@/app/lib/auth";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
  title?: string;
  description?: string;
};

export default function LoginModal({
  open,
  onClose,
  onSuccess,
  title = "Login to continue",
  description = "Sign in to download your saved icon group and keep your collection connected.",
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${getApiBase()}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not sign in");
      }

      storeAuth(data.token, data.user, { rememberMe });
      onSuccess?.(data.user as AuthUser);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[480px] rounded-[2rem] border border-[#E7E7E9] bg-white p-6 shadow-[0_24px_80px_rgba(17,17,17,0.14)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#C9151B]">Bangalicon Access</p>
                <h2 className="mt-1 text-2xl font-bold text-[#121212]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#6F6F6F]">{description}</p>
              </div>

              <button
                onClick={onClose}
                className="rounded-full border border-[#E7E7E9] px-3 py-1.5 text-xs font-semibold tracking-[0.2em] text-[#8A8A8A] transition hover:text-[#121212]"
              >
                CLOSE
              </button>
            </div>

            <div className="my-6 h-px bg-[#E7E7E9]" />

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#313131]">Email Address</label>
                <input
                  type="email"
                  placeholder="you@bangalicon.com"
                  className="w-full rounded-2xl border border-[#E7E7E9] bg-[#FBFBFC] px-4 py-3 text-sm text-[#121212] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#C9151B] focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#313131]">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-[#E7E7E9] bg-[#FBFBFC] px-4 py-3 text-sm text-[#121212] outline-none transition placeholder:text-[#A1A1A1] focus:border-[#C9151B] focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-[12px] font-medium text-[#6d6d72]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border border-[#d6d6da] accent-[#C9151B]"
                />
                Remember me for longer
              </label>

              {error ? <p className="text-sm text-[#C9151B]">{error}</p> : null}

              <button
                disabled={loading}
                className="w-full rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#C9151B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#6F6F6F]">
              Need an account?{" "}
              <Link href="/signup" className="font-semibold text-[#121212] transition hover:text-[#C9151B]">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
