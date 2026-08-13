"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getApiBase,
  getAuthHeaders,
  getStoredUser,
  onAuthChange,
  storeAuth,
  type AuthUser,
} from "@/app/lib/auth";
import { useToast } from "@/components/ui/ToastProvider";

const plans = [
  {
    name: "Monthly",
    price: "$1.50",
    cycle: "/month",
    badge: "Flexible",
    accent: "bg-white",
    border: "border-[#E7E7E9]",
    button: "bg-[#111111] text-white hover:bg-[#C9151B]",
    points: [
      "Private premium CDN access",
      "Premium icon packs and future releases",
      "Signed premium stylesheet, JSON, and manifest links",
      "Best if you want to try premium with a low monthly cost",
    ],
  },
  {
    name: "Yearly",
    price: "$15",
    cycle: "/year",
    badge: "Best Value",
    accent: "bg-gradient-to-br from-[#121212] via-[#1C1C1C] to-[#2A2A2A] text-white",
    border: "border-[#1F1F1F]",
    button: "bg-white text-[#121212] hover:bg-[#F2F2F2]",
    points: [
      "Everything in the monthly plan",
      "Lower long-term cost for regular users",
      "One plan for the full year of premium access",
      "Best for teams or designers using Bangalicon often",
    ],
  },
];

const comparePoints = [
  ["Free CDN", "Yes", "Yes"],
  ["Premium CDN", "No", "Yes"],
  ["Premium icons", "No", "Yes"],
  ["Private signed links", "No", "Yes"],
];

export default function PricingPage() {
  const { showToast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[number] | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/30");
  const [cvc, setCvc] = useState("123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const syncUser = () => {
      setUser(getStoredUser());
    };

    syncUser();
    return onAuthChange(syncUser);
  }, []);

  const openCheckout = (plan: (typeof plans)[number]) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setSelectedPlan(plan);
    setError("");
    setCardName(user.name || "");
  };

  const handleDemoPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedPlan) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${getApiBase()}/users/demo-upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          cycle: selectedPlan.name.toLowerCase(),
          cardName,
          cardNumber,
          expiry,
          cvc,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Demo payment failed");
      }

      storeAuth(data.token, data.user);
      showToast({ message: `${selectedPlan.name} premium activated`, tone: "success" });
      setSelectedPlan(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Demo payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden px-2 py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="mb-4 inline-flex rounded-full border border-[#E7E7E9] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8A8A8A]">
          Pricing
        </p>
        <h1 className="text-4xl font-bold text-[#121212] md:text-6xl">Simple premium pricing</h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6E6E6E] md:text-base">
          Bangalicon stays easy to understand. Use the free library anytime, or unlock premium access
          with one small monthly or yearly plan.
        </p>
      </motion.div>

      <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-2">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className={`rounded-[2rem] border p-7 shadow-[0_24px_80px_rgba(17,17,17,0.08)] ${plan.accent} ${plan.border}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.28em] ${
                    plan.name === "Yearly" ? "text-white/60" : "text-[#8A8A8A]"
                  }`}
                >
                  {plan.name} Plan
                </p>
                <h2 className="mt-2 text-3xl font-bold">{plan.name}</h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${
                  plan.name === "Yearly"
                    ? "bg-white/10 text-white"
                    : "bg-[#F3F4F6] text-[#6F6F6F]"
                }`}
              >
                {plan.badge}
              </span>
            </div>

            <div className="mt-8 flex items-end gap-2">
              <span className="text-5xl font-bold">{plan.price}</span>
              <span className={`pb-1 text-sm ${plan.name === "Yearly" ? "text-white/65" : "text-[#7A7A7A]"}`}>
                {plan.cycle}
              </span>
            </div>

            <div className={`my-7 h-px ${plan.name === "Yearly" ? "bg-white/10" : "bg-[#E7E7E9]"}`} />

            <div className="space-y-4">
              {plan.points.map((point) => (
                <div key={point} className="flex gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      plan.name === "Yearly" ? "bg-white" : "bg-[#C9151B]"
                    }`}
                  />
                  <p className={`text-sm leading-7 ${plan.name === "Yearly" ? "text-white/80" : "text-[#525252]"}`}>
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openCheckout(plan)}
                className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${plan.button}`}
              >
                {user ? `Choose ${plan.name}` : "Login to Upgrade"}
              </button>
              <Link
                href="/account"
                className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${
                  plan.name === "Yearly"
                    ? "border-white/15 text-white hover:bg-white/8"
                    : "border-[#DADDE3] text-[#121212] hover:bg-white"
                }`}
              >
                View Account
              </Link>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto mt-8 max-w-6xl rounded-[2rem] border border-[#E7E7E9] bg-white p-6 shadow-[0_20px_70px_rgba(17,17,17,0.05)] md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8A8A8A]">Compare Access</p>
            <h3 className="mt-2 text-3xl font-bold text-[#121212]">Free vs premium</h3>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#6E6E6E]">
            Free keeps the public library open. Premium adds private CDN access and premium icon usage in a
            simple, user-friendly way.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#ECEEF2]">
          <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] bg-[#F7F8FA] px-5 py-4 text-sm font-semibold text-[#121212]">
            <div>Feature</div>
            <div>Free</div>
            <div>Premium</div>
          </div>

          {comparePoints.map(([label, free, premium]) => (
            <div
              key={label}
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr] border-t border-[#ECEEF2] px-5 py-4 text-sm text-[#525252]"
            >
              <div className="font-semibold text-[#121212]">{label}</div>
              <div>{free}</div>
              <div>{premium}</div>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedPlan && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.18 }}
            >
              <form
                onSubmit={handleDemoPayment}
                className="w-full max-w-[560px] rounded-[2rem] border border-[#E7E7E9] bg-white p-6 shadow-[0_32px_90px_rgba(17,17,17,0.16)] md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8A8A8A]">Demo Checkout</p>
                    <h2 className="mt-2 text-3xl font-bold text-[#121212]">{selectedPlan.name} Premium</h2>
                    <p className="mt-3 text-sm leading-7 text-[#6E6E6E]">
                      This is a demo payment flow. No real charge will be made, but your account will be
                      upgraded to premium so you can test the full user experience.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="rounded-full border border-[#E7E7E9] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8A8A8A]"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-6 rounded-[1.4rem] bg-[#F7F8FA] px-4 py-4">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-[#121212]">{selectedPlan.price}</span>
                    <span className="pb-1 text-sm text-[#6E6E6E]">{selectedPlan.cycle}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#6E6E6E]">
                    Premium CDN, premium icons, and signed private asset links.
                  </p>
                </div>

                <div className="mt-6 grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#313131]">Card Name</label>
                    <input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-2xl border border-[#E7E7E9] bg-[#FBFBFC] px-4 py-3 text-sm text-[#121212] outline-none"
                      placeholder="Cardholder name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#313131]">Card Number</label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-2xl border border-[#E7E7E9] bg-[#FBFBFC] px-4 py-3 text-sm text-[#121212] outline-none"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#313131]">Expiry</label>
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full rounded-2xl border border-[#E7E7E9] bg-[#FBFBFC] px-4 py-3 text-sm text-[#121212] outline-none"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#313131]">CVC</label>
                      <input
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full rounded-2xl border border-[#E7E7E9] bg-[#FBFBFC] px-4 py-3 text-sm text-[#121212] outline-none"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.25rem] bg-[#F5F6F8] px-4 py-3 text-sm leading-7 text-[#525252]">
                  Demo mode only. Enter the prefilled sample payment details or any valid-looking demo card
                  format to continue.
                </div>

                {error ? <p className="mt-4 text-sm font-semibold text-[#C9151B]">{error}</p> : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-[#C9151B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Processing..." : `Pay ${selectedPlan.price}`}
                  </button>
                  <Link
                    href="/account"
                    className="rounded-full border border-[#DADDE3] bg-white px-6 py-3 text-sm font-semibold text-[#121212] transition hover:bg-[#F7F8FA]"
                  >
                    View Account
                  </Link>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
