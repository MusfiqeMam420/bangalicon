"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { getApiBase } from "@/app/lib/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    const runVerification = async () => {
      if (!token) {
        if (!active) {
          return;
        }

        setError("This verification link is missing or invalid");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${getApiBase()}/users/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not verify email");
        }

        if (!active) {
          return;
        }

        setNotice(data.message || "Your email has been verified successfully");
      } catch (verifyError) {
        if (!active) {
          return;
        }

        setError(
          verifyError instanceof Error ? verifyError.message : "Could not verify email"
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void runVerification();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f3f3]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/auth-login-bg-large.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1280px auto",
            backgroundPosition: "center center",
            opacity: 0.6,
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

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-[420px] flex-col items-center text-center"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center">
            <Image
              src="/auth-login-icon.svg"
              alt="Bangalicon icon"
              width={62}
              height={62}
              className="h-[62px] w-[62px]"
              priority
              sizes="62px"
            />
          </div>

          <h1 className="text-[26px] font-bold tracking-[-0.05em] text-[#0f1012] md:text-[40px]">
            {loading
              ? "Verifying Your Email"
              : error
                ? "Verification Link Problem"
                : "Email Verified"}
          </h1>

          <p className="mt-4 max-w-[390px] text-[14px] leading-7 text-[#202126] md:text-[16px]">
            {loading
              ? "We are confirming your Bangalicon account now. This only takes a moment."
              : error ||
                notice ||
                "Your email has been verified successfully. You can now sign in to your account."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-3 text-sm font-medium text-[#6f6f6f]">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#d81317]" />
                Checking your verification link...
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex min-w-[180px] items-center justify-center rounded-[10px] bg-[#d81317] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111]"
                >
                  Go to Login
                </Link>
                <Link
                  href="/signup"
                  className="text-[13px] font-medium text-[#7d7d7d] transition hover:text-[#111111]"
                >
                  Back to signup
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f3f3]" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
