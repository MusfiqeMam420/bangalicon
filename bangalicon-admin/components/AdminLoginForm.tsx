"use client";

import { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminLoginFormProps {
  hint:
    | {
        email: string;
        password: string | null;
      }
    | null;
  mode: "configured" | "fallback" | "missing";
}

export default function AdminLoginForm({ hint, mode }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(hint?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "missing") {
      setError("Admin access is not configured yet. Add admin credentials to the admin app env file first.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(payload?.message || "Unable to sign in right now.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach the admin app right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-[#242424]">Admin email</label>
        <input
          className="admin-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@bangalicon.com"
          autoComplete="email"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[13px] font-semibold text-[#242424]">Password</label>
        <input
          className="admin-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your admin password"
          autoComplete="current-password"
        />
      </div>

    
      {error ? <p className="text-[13px] font-medium text-[#c9151b]">{error}</p> : null}

      <button
        type="submit"
        className="admin-button admin-button-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LockKeyhole size={15} />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <LogIn size={15} />
            <span>Open admin panel</span>
          </>
        )}
      </button>
    </form>
  );
}
