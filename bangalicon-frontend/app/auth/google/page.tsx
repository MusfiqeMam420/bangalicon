"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getApiBase, storeAuth, type AuthUser } from "@/app/lib/auth";

export default function GoogleAuthPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Finishing your Google sign-in...");

  useEffect(() => {
    const finishGoogleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token") || "";
      const returnTo = params.get("returnTo") || "/";
      const fallbackTo = params.get("fallbackTo") || "/login";

      if (!token) {
        router.replace(fallbackTo.startsWith("/") ? `${fallbackTo}?google=failed` : "/login?google=failed");
        return;
      }

      try {
        const response = await fetch(`${getApiBase()}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data?.user) {
          throw new Error(data.message || "Could not finish Google sign-in");
        }

        storeAuth(token, data.user as AuthUser);
        setMessage("Google sign-in complete. Taking you back...");
        router.replace(returnTo.startsWith("/") ? returnTo : "/");
      } catch {
        router.replace(fallbackTo.startsWith("/") ? `${fallbackTo}?google=failed` : "/login?google=failed");
      }
    };

    finishGoogleAuth();
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f3f3]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/auth-login-bg-large.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            opacity: 0.4,
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

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center">
            <Image
              src="/auth-login-icon.png"
              alt="Bangalicon icon"
              width={62}
              height={62}
              className="h-[62px] w-[62px]"
              priority
              sizes="62px"
            />
          </div>
          <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#121212]">Signing you in</h1>
          <p className="mt-4 text-sm leading-7 text-[#6f6f6f]">{message}</p>
        </div>
      </div>
    </div>
  );
}
