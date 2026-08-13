"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBase, startGoogleSignIn, storeAuth } from "@/app/lib/auth";

type SignupStep = "email" | "code" | "password" | "complete";

const CODE_LENGTH = 6;

export default function SignupPage() {
  const router = useRouter();
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  const redirectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [step, setStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [codeDigits, setCodeDigits] = useState(Array.from({ length: CODE_LENGTH }, () => ""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const codeValue = useMemo(() => codeDigits.join(""), [codeDigits]);

  useEffect(() => {
    return () => {
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (step !== "code" || codeValue.length !== CODE_LENGTH || verifyingCode) {
      return;
    }

    const verifyCode = async () => {
      setVerifyingCode(true);
      setError("");
      setNotice("");

      try {
        const response = await fetch(`${getApiBase()}/users/signup/verify-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code: codeValue }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not verify code");
        }

        setNotice("");
        setStep("password");
      } catch (verifyError) {
        setError(verifyError instanceof Error ? verifyError.message : "Could not verify code");
        setCodeDigits(Array.from({ length: CODE_LENGTH }, () => ""));
        requestAnimationFrame(() => {
          codeRefs.current[0]?.focus();
        });
      } finally {
        setVerifyingCode(false);
      }
    };

    void verifyCode();
  }, [codeValue, email, step, verifyingCode]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${getApiBase()}/users/signup/request-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not send signup code");
      }

      setMaskedEmail(data.maskedEmail || email);
      setCodeDigits(Array.from({ length: CODE_LENGTH }, () => ""));
      setStep("code");
      setNotice("");
      requestAnimationFrame(() => {
        codeRefs.current[0]?.focus();
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not send signup code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${getApiBase()}/users/signup/request-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not resend code");
      }

      setMaskedEmail(data.maskedEmail || email);
      setCodeDigits(Array.from({ length: CODE_LENGTH }, () => ""));
      setNotice("A fresh code is on the way");
      requestAnimationFrame(() => {
        codeRefs.current[0]?.focus();
      });
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Could not resend code");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    if (password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${getApiBase()}/users/signup/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create account");
      }

      if (data.token && data.user) {
        storeAuth(data.token, data.user);
      }

      setNotice("");
      setStep("complete");
      redirectRef.current = setTimeout(() => {
        router.push("/");
      }, 2200);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  const updateCodeDigit = (index: number, rawValue: string) => {
    const nextValue = rawValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...codeDigits];
    nextDigits[index] = nextValue;
    setCodeDigits(nextDigits);
    setError("");
    setNotice("");

    if (nextValue && index < CODE_LENGTH - 1) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);

    if (!pasted) {
      return;
    }

    const nextDigits = Array.from({ length: CODE_LENGTH }, (_, index) => pasted[index] || "");
    setCodeDigits(nextDigits);

    const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    requestAnimationFrame(() => {
      codeRefs.current[nextIndex]?.focus();
    });
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
              "radial-gradient(circle at center, rgba(255,255,255,0.94) 0 18%, rgba(255,255,255,0.88) 18% 31%, rgba(255,255,255,0.36) 31% 44%, rgba(255,255,255,0.09) 44% 56%, rgba(255,255,255,0.02) 56% 63%, rgba(255,255,255,0) 63%)",
            filter: "blur(28px)",
            transform: "scale(1.08)",
          }}
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-3 py-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] px-6 py-16 md:px-12 md:py-20"
        >
          {step !== "complete" ? (
            <div className="mx-auto flex w-full max-w-[214px] flex-col items-center text-center sm:max-w-[500px]">
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

              <h1 className="text-[23px] font-bold tracking-[-0.03em] text-[#171717]">Create Account</h1>
              <div className="mt-3 h-px w-full bg-[#e7e7e7]" />
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="signup-email-step"
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <form onSubmit={handleEmailSubmit} className="mx-auto mt-5 w-full max-w-[214px] sm:max-w-[500px]">
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

                  {error ? <p className="mt-3 text-sm text-[#d31217]">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 h-[42px] w-full rounded-[10px] bg-[#d81317] text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Continue"}
                  </button>
                </form>

                <p className="mx-auto mt-3 w-full max-w-[214px] text-center text-[12px] leading-5 text-[#8a8a8a] sm:max-w-[500px]">
                  by continuing, you agree to our{" "}
                  <Link href="/terms" className="underline underline-offset-2">
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </p>

                <div className="mx-auto mt-3 flex w-full max-w-[214px] items-center gap-3 sm:max-w-[500px]">
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
                    startGoogleSignIn("/", "/signup");
                  }}
                  className="mx-auto mt-3 flex h-[42px] w-full max-w-[214px] cursor-pointer  items-center justify-center gap-3 rounded-[10px] bg-[linear-gradient(180deg,#1f1f1f_0%,#050505_100%)] text-sm font-semibold text-white shadow-[0_10px_18px_rgba(0,0,0,0.12)] transition hover:opacity-95 sm:max-w-[500px]"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 12.9955 12.9232 12.0423 13.5614V15.8195H14.9509C16.6527 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                      <path d="M9 18C11.43 18 13.4673 17.1941 14.9509 15.8195L12.0423 13.5614C11.2364 14.1014 10.2055 14.4205 9 14.4205C6.65591 14.4205 4.67045 12.8373 3.96273 10.71H0.955902V13.0418C2.43136 15.9718 5.46318 18 9 18Z" fill="#34A853" />
                      <path d="M3.96273 10.71C3.78273 10.17 3.68045 9.59318 3.68045 9C3.68045 8.40682 3.78273 7.83 3.96273 7.29V4.95818H0.955902C0.347727 6.16909 0 7.53818 0 9C0 10.4618 0.347727 11.8309 0.955902 13.0418L3.96273 10.71Z" fill="#FBBC05" />
                      <path d="M9 3.57955C10.3159 3.57955 11.4982 4.03227 12.4282 4.92L15.0164 2.33182C13.4632 0.87 11.4259 0 9 0C5.46318 0 2.43136 2.02818 0.955902 4.95818L3.96273 7.29C4.67045 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                    </svg>
                  </span>
                  {googleLoading ? "Opening Google..." : "Sign up with Google"}
                </button>

                <p className="mx-auto mt-3 w-full max-w-[214px] text-center text-[12px] text-[#8a8a8a] sm:max-w-[500px]">
                  already have an account?{" "}
                  <Link href="/login" className="text-[#5d5d5d] transition hover:text-[#111111]">
                    Login
                  </Link>
                </p>
              </motion.div>
            ) : null}

            {step === "code" ? (
              <motion.div
                key="signup-code-step"
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-5 w-full max-w-[214px] text-center sm:max-w-[500px]"
              >
                <p className="mx-auto max-w-[260px] text-[12px] leading-5 text-[#787878]">
                  we&apos;ve sent you a message please check your inbox at{" "}
                  <span className="font-medium text-[#5f5f5f]">{maskedEmail}</span>.
                </p>

                <div className="mt-4 flex justify-center gap-2 sm:gap-3">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(node) => {
                        codeRefs.current[index] = node;
                      }}
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      onChange={(event) => updateCodeDigit(index, event.target.value)}
                      onKeyDown={(event) => handleCodeKeyDown(index, event)}
                      onPaste={handleCodePaste}
                      className="h-[38px] w-[38px] rounded-[10px] border border-[#e8e8ea] bg-[#f5f6f8] text-center text-base font-semibold text-[#111111] outline-none transition focus:border-[#db161b] focus:bg-white sm:h-[42px] sm:w-[42px]"
                    />
                  ))}
                </div>

                {error ? <p className="mt-3 text-sm text-[#d31217]">{error}</p> : null}
                {notice ? <p className="mt-3 text-sm text-[#2c7a46]">{notice}</p> : null}
                {verifyingCode ? <p className="mt-3 text-[11px] text-[#8a8a8a]">Checking code...</p> : null}

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading || verifyingCode}
                  className="mt-4 text-[11px] font-medium text-[#7b7b7b] transition hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Resend Code"}
                </button>
              </motion.div>
            ) : null}

            {step === "password" ? (
              <motion.div
                key="signup-password-step"
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <form onSubmit={handlePasswordSubmit} className="mx-auto mt-5 w-full max-w-[214px] sm:max-w-[500px]">
                  <div className="space-y-3">
                    <div>
                      <label className="mb-2 block text-left text-[12px] font-semibold text-[#242424]">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Password"
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
                    {loading ? "Creating..." : "Create an Account"}
                  </button>
                </form>

                <p className="mx-auto mt-3 w-full max-w-[214px] text-center text-[10px] leading-5 text-[#8a8a8a] sm:max-w-[500px]">
                  by continuing, you agree to our{" "}
                  <Link href="/usage" className="underline underline-offset-2">
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/usage" className="underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                </p>

                <div className="mx-auto mt-3 flex w-full max-w-[214px] items-center gap-3 sm:max-w-[500px]">
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
                    startGoogleSignIn("/", "/signup");
                  }}
                  className="mx-auto mt-3 flex h-[42px] w-full max-w-[214px] items-center justify-center gap-3 rounded-[10px] bg-[linear-gradient(180deg,#1f1f1f_0%,#050505_100%)] text-sm font-semibold text-white shadow-[0_10px_18px_rgba(0,0,0,0.12)] transition hover:opacity-95 sm:max-w-[500px]"
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 12.9955 12.9232 12.0423 13.5614V15.8195H14.9509C16.6527 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4" />
                      <path d="M9 18C11.43 18 13.4673 17.1941 14.9509 15.8195L12.0423 13.5614C11.2364 14.1014 10.2055 14.4205 9 14.4205C6.65591 14.4205 4.67045 12.8373 3.96273 10.71H0.955902V13.0418C2.43136 15.9718 5.46318 18 9 18Z" fill="#34A853" />
                      <path d="M3.96273 10.71C3.78273 10.17 3.68045 9.59318 3.68045 9C3.68045 8.40682 3.78273 7.83 3.96273 7.29V4.95818H0.955902C0.347727 6.16909 0 7.53818 0 9C0 10.4618 0.347727 11.8309 0.955902 13.0418L3.96273 10.71Z" fill="#FBBC05" />
                      <path d="M9 3.57955C10.3159 3.57955 11.4982 4.03227 12.4282 4.92L15.0164 2.33182C13.4632 0.87 11.4259 0 9 0C5.46318 0 2.43136 2.02818 0.955902 4.95818L3.96273 7.29C4.67045 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335" />
                    </svg>
                  </span>
                  {googleLoading ? "Opening Google..." : "Sign up with Google"}
                </button>

                <p className="mx-auto mt-3 w-full max-w-[214px] text-center text-[10px] text-[#8a8a8a] sm:max-w-[500px]">
                  already have an account?{" "}
                  <Link href="/login" className="text-[#5d5d5d] transition hover:text-[#111111]">
                    sign in
                  </Link>
                </p>
              </motion.div>
            ) : null}

            {step === "complete" ? (
              <motion.div
                key="signup-complete-step"
                initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-12 flex w-full max-w-[320px] flex-col items-center text-center"
              >
                <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#ececef] shadow-[0_16px_32px_rgba(17,17,17,0.08)]">
                  <div className="absolute inset-[6px] rounded-full border border-white/70 bg-white/70" />
                  <div className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full border-[3px] border-[#4d4d4f] bg-transparent">
                    <i className="bgs bgs-check-circle text-[20px] leading-none text-[#3f4043]" />
                  </div>
                </div>

                <h2 className="mt-8 text-[22px] font-bold tracking-[-0.04em] text-[#111111] md:text-[24px]">
                  Welcome to our Family
                </h2>
                <p className="mt-2 max-w-[260px] text-[12px] leading-6 text-[#7d7d7d]">
                  Your Bangalicon account is ready. We&apos;re taking you to the home page now.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
