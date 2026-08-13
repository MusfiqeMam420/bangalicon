"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getApiBase, getStoredToken, startGoogleSignIn, storeAuth } from "@/app/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const getReturnTo = () => {
    if (typeof window === "undefined") {
      return "/";
    }

    const params = new URLSearchParams(window.location.search);
    const next = params.get("returnTo") || "/";
    return next.startsWith("/") ? next : "/";
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleStatus = params.get("google");

    if (googleStatus === "failed") {
      setError("Google sign-in could not be completed. Please try again.");
    } else if (googleStatus === "not-configured") {
      setError("Google sign-in is not configured yet.");
    }

    const token = getStoredToken();
    if (token) {
      router.replace("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "forgot") {
      if (!email.trim()) {
        setError("Enter your email address");
        return;
      }

      setLoading(true);
      setError("");
      setNotice("");
      setForgotSent(false);

      try {
        const response = await fetch(`${getApiBase()}/users/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message === "Route not found"
              ? "Password reset is getting ready. Please try again in a moment."
              : data.message || "Could not start password reset"
          );
        }

        setNotice(
          data.message || "If this email is registered, a reset email is on the way."
        );
        setForgotSent(true);
      } catch (submitError) {
        setError(
          submitError instanceof Error ? submitError.message : "Could not start password reset"
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (step === "email") {
      if (!email.trim()) {
        setError("Enter your email address");
        return;
      }

      setError("");
      setNotice("");
      setForgotSent(false);
      setStep("password");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    setForgotSent(false);

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
      router.push(getReturnTo());
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f3f3]">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundPosition: "0px 34%" }}
          animate={{ backgroundPosition: ["0px 34%", "-1180px 34%"] }}
          transition={{
            duration: 35,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            backgroundImage: "url('/auth-login-bg-large.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "1280px auto",
            opacity: 0.3,
          }}
        />
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
        <AnimatePresence mode="wait">
          {mode === "forgot" && forgotSent ? (
            <motion.div
              key="forgot-confirm-card"
              initial={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[560px] px-6"
            >
              <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#e8e8e8]/95 shadow-[0_10px_24px_rgba(17,17,17,0.05)]">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-[30px] w-[30px] items-center justify-center text-[#5b5b5f] [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
                    dangerouslySetInnerHTML={{
                      __html:
                        '<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M152 448q-24-25-28-56a88 88 0 0 1 14-58q18-26 51-36l510-151a90.8 90.8 0 0 1 65 4q32 13 45 45 14 31 4 65l-151 510q-10 33-36 51a88 88 0 0 1-58 14q-31-4-56-28zM303 600L360 657l188-189q17-17 10-38-7-22-28-29-20-7-38 11z"/></svg>',
                    }}
                  />
                </div>

                <h2 className="mt-10 text-[28px] font-bold tracking-[-0.05em] text-[#0f1012] md:text-[42px]">
                  Please Check Your Email
                </h2>
                <p className="mx-auto mt-4 max-w-[380px] text-[14px] leading-7 text-[#202126] md:text-[17px]">
                  We have sent a password reset link to your email address. Please check your inbox and click the link to reset your password.
                </p>
                <p className="mx-auto mt-6 max-w-[380px] text-[12px] leading-6 text-[#8a8f99] md:text-[14px]">
                  If you don&apos;t see the email, please check your spam folder.{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setStep("email");
                      setPassword("");
                      setError("");
                      setNotice("");
                      setForgotSent(false);
                    }}
                    className="font-semibold text-[#d81317] transition hover:text-[#111111]"
                  >
                    Login
                  </button>
                </p>
                <div className="mt-8 flex items-center justify-center gap-6 text-[13px] font-medium text-[#6f6f6f]">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setNotice("");
                      setForgotSent(false);
                    }}
                    className="transition hover:text-[#111111]"
                  >
                    Send again
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="login-card"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(8px)" }}
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

                <h1 className="text-[23px] font-bold tracking-[-0.03em] text-[#171717]">Welcome Back</h1>
                <div className="mt-3 h-px w-full bg-[#e7e7e7]" />
              </div>

              <form onSubmit={handleSubmit} className="mx-auto mt-5 w-full max-w-[240px] sm:max-w-[500px]">
                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block text-left text-[12px] font-semibold text-[#242424]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-[42px] w-full rounded-[10px] border border-[#ececec] bg-[#f5f6f8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#ababab] focus:border-[#db161b] focus:bg-white"
                    />
                  </div>

                  <AnimatePresence initial={false} mode="wait">
                    {mode === "login" && step === "password" ? (
                      <motion.div
                        key="password-field"
                        initial={{ opacity: 0, y: -8, scale: 0.985, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -6, scale: 0.99, filter: "blur(8px)" }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="origin-top"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <label className="block text-left text-[12px] font-semibold text-[#242424]">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setStep("email");
                              setPassword("");
                              setError("");
                            }}
                            className="text-[11px] font-medium text-[#8a8a8a] transition hover:text-[#111111]"
                          >
                            Change email
                          </button>
                        </div>
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-[42px] w-full rounded-[10px] border border-[#ececec] bg-[#f5f6f8] px-4 text-sm text-[#111111] outline-none transition placeholder:text-[#ababab] focus:border-[#db161b] focus:bg-white"
                        />
                      </motion.div>
                    ) : null}

                    {mode === "forgot" ? (
                      <motion.div
                        key="forgot-password-panel"
                        initial={{ opacity: 0, y: -8, scale: 0.985, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -6, scale: 0.99, filter: "blur(8px)" }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="origin-top rounded-[14px] border border-[#ececec] bg-white/60 px-4 py-3 text-left backdrop-blur-sm"
                      >
                        <p className="text-[12px] font-semibold text-[#242424]">Forgot your password?</p>
                        <p className="mt-1 text-[12px] leading-5 text-[#707070]">
                          Enter your account email and we&apos;ll send the reset email in the background.
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {error ? <p className="mt-3 text-sm text-[#d31217]">{error}</p> : null}
                {notice ? <p className="mt-3 text-sm text-[#2c7a46]">{notice}</p> : null}

                {mode === "login" && step === "password" ? (
                  <label className="mt-3 flex cursor-pointer items-center gap-3 text-[12px] font-medium text-[#6d6d72]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border border-[#d6d6da] accent-[#d81317]"
                    />
                    Remember me for longer
                  </label>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 h-[42px] w-full rounded-[10px] bg-[#d81317] text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? mode === "forgot"
                      ? "Sending..."
                      : "Continuing..."
                    : mode === "forgot"
                      ? "Reset Password"
                      : "Continue"}
                </button>
              </form>

              <div className="mx-auto mt-3 flex w-full max-w-[240px] items-center justify-center sm:max-w-[500px]">
                {mode === "login" && step === "password" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setStep("email");
                      setPassword("");
                      setError("");
                      setNotice("");
                      setForgotSent(false);
                    }}
                    className="text-[12px] font-medium text-[#7d7d7d] transition hover:text-[#111111]"
                  >
                    Forgot password?
                  </button>
                ) : mode === "forgot" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setNotice("");
                      setForgotSent(false);
                    }}
                    className="text-[12px] font-medium text-[#7d7d7d] transition hover:text-[#111111]"
                  >
                    Back to login
                  </button>
                ) : null}
              </div>

              <p className="mx-auto mt-3 w-full max-w-[240px] text-center text-[12px] text-[#7d7d7d] sm:max-w-[500px]">
                don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#4a4a4a] transition hover:text-[#111111]">
                  create an account
                </Link>
              </p>

              <div className="mx-auto mt-3 flex w-full max-w-[240px] items-center gap-3 sm:max-w-[500px]">
                <div className="h-px flex-1 bg-[#e7e7e7]" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9f9f9f]">or</span>
                <div className="h-px flex-1 bg-[#e7e7e7]" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setGoogleLoading(true);
                  setError("");
                  setNotice("");
                  startGoogleSignIn("/", "/login");
                }}
                className="mx-auto mt-3 flex h-[42px] cursor-pointer  w-full max-w-[240px] items-center justify-center gap-3 rounded-[10px] bg-[linear-gradient(180deg,#1f1f1f_0%,#050505_100%)] text-sm font-semibold text-white shadow-[0_10px_18px_rgba(0,0,0,0.12)] transition hover:opacity-95 sm:max-w-[500px]"
              >
                <span className="inline-flex h-4 w-4 items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 12.9955 12.9232 12.0423 13.5614V15.8195H14.9509C16.6527 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                    <path d="M9 18C11.43 18 13.4673 17.1941 14.9509 15.8195L12.0423 13.5614C11.2364 14.1014 10.2055 14.4205 9 14.4205C6.65591 14.4205 4.67045 12.8373 3.96273 10.71H0.955902V13.0418C2.43136 15.9718 5.46318 18 9 18Z" fill="#34A853" />
                    <path d="M3.96273 10.71C3.78273 10.17 3.68045 9.59318 3.68045 9C3.68045 8.40682 3.78273 7.83 3.96273 7.29V4.95818H0.955902C0.347727 6.16909 0 7.53818 0 9C0 10.4618 0.347727 11.8309 0.955902 13.0418L3.96273 10.71Z" fill="#FBBC05" />
                    <path d="M9 3.57955C10.3159 3.57955 11.4982 4.03227 12.4282 4.92L15.0164 2.33182C13.4632 0.87 11.4259 0 9 0C5.46318 0 2.43136 2.02818 0.955902 4.95818L3.96273 7.29C4.67045 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                  </svg>
                </span>
                {googleLoading ? "Opening Google..." : "Sign in with Google"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
