"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { getApiBase } from "@/app/lib/auth";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!token) {
      setError("This reset link is missing or invalid");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${getApiBase()}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not reset password");
      }

      setNotice(data.message || "Your password has been reset successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f3f3]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/auth-login-bg-large.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "1280px auto",
            backgroundPosition: "0px 34%",
            opacity: 0.3,
            animation: "auth-marquee 26s linear infinite",
          }}
        />
        <style jsx>{`
          @keyframes auth-marquee {
            from {
              background-position: 0px 34%;
            }
            to {
              background-position: -1180px 34%;
            }
          }
        `}</style>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.96) 0 16%, rgba(255,255,255,0.9) 16% 28%, rgba(255,255,255,0.44) 28% 40%, rgba(255,255,255,0.14) 40% 52%, rgba(255,255,255,0.03) 52% 60%, rgba(255,255,255,0) 60%)",
            filter: "blur(24px)",
            transform: "scale(1.08)",
          }}
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-2 py-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[460px] bg-transparent px-6 py-16 md:px-12 md:py-20"
        >
          <div className="mx-auto flex w-full max-w-[240px] flex-col items-center text-center sm:max-w-[500px]">
            <Link
              href="/"
              aria-label="Go to home page"
              className="mb-3 flex h-[62px] w-[62px] items-center justify-center transition hover:opacity-90"
            >
              <Image
                src="/auth-login-icon.svg"
                alt="Bangalicon icon"
                width={62}
                height={62}
                className="h-[62px] w-[62px]"
                priority
                sizes="62px"
              />
            </Link>

            <h1 className="text-[23px] font-bold tracking-[-0.03em] text-[#171717]">
              Create New Password
            </h1>
            <div className="mt-3 h-px w-full bg-[#e7e7e7]" />
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-5 w-full max-w-[240px] sm:max-w-[500px]">
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-left text-[12px] font-semibold text-[#242424]">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[42px] w-full rounded-[10px] border border-[#ececec] bg-[#f5f6f8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#ababab] focus:border-[#db161b] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-left text-[12px] font-semibold text-[#242424]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-[42px] w-full rounded-[10px] border border-[#ececec] bg-[#f5f6f8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#ababab] focus:border-[#db161b] focus:bg-white"
                />
              </div>
            </div>

            {error ? <p className="mt-3 text-sm text-[#d31217]">{error}</p> : null}
            {notice ? <p className="mt-3 text-sm text-[#2c7a46]">{notice}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 h-[42px] w-full rounded-[10px] bg-[#d81317] text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save New Password"}
            </button>
          </form>

          <div className="mx-auto mt-3 flex w-full max-w-[240px] items-center justify-center sm:max-w-[500px]">
            <Link
              href="/login"
              className="text-[12px] font-medium text-[#7d7d7d] transition hover:text-[#111111]"
            >
              Back to login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f3f3]" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
