"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import UserAvatar from "@/components/UserAvatar";

import {
  getStoredUser,
  onAuthChange,
  refreshStoredUser,
  type AuthUser,
} from "@/app/lib/auth";

import {
  getUserAvatarGradient,
  getUserAvatarHeroIcon,
} from "@/app/lib/userAvatar";

/* =========================================================
   STATIC NOISE
========================================================= */

const STATIC_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.65'/%3E%3C/svg%3E")`;

/* =========================================================
   DEFAULT THEME
========================================================= */

const DEFAULT_GRADIENT =
  "linear-gradient(110deg, #F4D54A 0%, #F2A900 48%, #E87900 100%)";

/* =========================================================
   ACCOUNT PAGE
========================================================= */

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [loadingUser, setLoadingUser] =
    useState(true);

  /* =======================================================
     AUTH
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const syncUser = async () => {
      const storedUser =
        getStoredUser();

      if (!mounted) return;

      setUser(storedUser);

      if (!storedUser) {
        setLoadingUser(false);
        return;
      }

      try {
        const freshUser =
          await refreshStoredUser();

        if (!mounted) return;

        setUser(
          freshUser ??
            storedUser
        );
      } catch {
        if (!mounted) return;

        setUser(storedUser);
      } finally {
        if (mounted) {
          setLoadingUser(false);
        }
      }
    };

    void syncUser();

    const unsubscribe =
      onAuthChange(() => {
        setLoadingUser(true);

        void syncUser();
      });

    return () => {
      mounted = false;

      if (
        typeof unsubscribe ===
        "function"
      ) {
        unsubscribe();
      }
    };
  }, []);

  /* =======================================================
     AVATAR GRADIENT

     Comes directly from userAvatar.ts.
  ======================================================= */

  const bannerBackground =
    useMemo(() => {
      if (!user) {
        return DEFAULT_GRADIENT;
      }

      return getUserAvatarGradient(
        user
      );
    }, [user]);

  /* =======================================================
     CUSTOM HERO ICON

     Also comes directly from userAvatar.ts.
  ======================================================= */

  const heroIcon = useMemo(() => {
    if (!user) return "";

    return getUserAvatarHeroIcon(
      user
    );
  }, [user]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-[#F5F6F7]">
        {/* ===============================================
            HERO SKELETON
        =============================================== */}

        <section className="relative h-[185px] w-full overflow-hidden bg-[#E5E7EA]">
          {/* STATIC GRAIN */}

          <div
            className="pointer-events-none  absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                STATIC_NOISE,
              backgroundRepeat:
                "repeat",
              backgroundSize:
                "180px 180px",
            }}
          />
        </section>

        {/* ===============================================
            CARD SKELETON
        =============================================== */}

        <div className="relative z-20 mx-auto -mt-[58px] w-full max-w-[800px] px-4 pb-24 sm:px-5">
          <div className="rounded-[28px] bg-white px-6 pb-7 pt-6 shadow-[0_5px_20px_rgba(0,0,0,0.035)] sm:px-8">
            {/* USER */}

            <div className="flex items-center gap-[13px]">
              <div className="h-[46px] w-[46px] animate-pulse rounded-full bg-[#ECEEF1]" />

              <div>
                <div className="h-4 w-36 animate-pulse rounded-full bg-[#ECEEF1]" />

                <div className="mt-2 h-3 w-48 animate-pulse rounded-full bg-[#ECEEF1]" />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="mt-[22px] h-[138px] animate-pulse rounded-[20px] bg-[#F0F1F3]" />
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT LOGGED IN
  ======================================================= */

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F5F6F7]">
        {/* ===============================================
            HERO
        =============================================== */}

        <section
          className="relative h-[185px] w-full overflow-hidden"
          style={{
            background:
              DEFAULT_GRADIENT,
          }}
        >
          {/* STATIC GRAIN */}

          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
            style={{
              backgroundImage:
                STATIC_NOISE,

              backgroundRepeat:
                "repeat",

              backgroundSize:
                "180px 180px",
            }}
          />

          {/* SOFT LIGHT */}

          <div
            className="pointer-events-none absolute inset-0  z-[2]"
            style={{
              background:
                "radial-gradient(circle at 18% 15%, rgba(255,255,255,0.14), transparent 34%)",
            }}
          />
        </section>

        {/* ===============================================
            SIGN IN CARD
        =============================================== */}

        <div className="relative z-20 mx-auto -mt-[58px] w-full max-w-[800px] px-4 pb-24 sm:px-5">
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="rounded-[28px] bg-white px-6 py-7 shadow-[0_5px_20px_rgba(0,0,0,0.04)] sm:px-8"
          >
            <p className="text-[12px] font-medium text-[#8F9296]">
              Account
            </p>

            <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.035em] text-[#111111]">
              Sign in to view your
              account
            </h1>

            <p className="mt-2 max-w-[500px] text-[13px] leading-6 text-[#85898E]">
              Your account page keeps
              your basic profile
              details in one simple
              place.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/login"
                className="inline-flex h-[36px] items-center justify-center rounded-full bg-[#111111] px-5 text-[11px] font-semibold text-white transition hover:bg-[#C9151B]"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="inline-flex h-[36px] items-center justify-center rounded-full border border-[#DFE1E4] bg-white px-5 text-[11px] font-semibold text-[#111111] transition hover:bg-[#F5F6F7]"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  /* =======================================================
     LOGGED IN ACCOUNT
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#F5F6F7]">
      {/* ===================================================
          HERO
      =================================================== */}

      <section
        className="relative h-[120px] sm:h-[185px] w-full overflow-hidden"
        style={{
          background:
            bannerBackground,
        }}
      >
        {/* ===============================================
            STATIC GRAIN
        =============================================== */}

        <div
          className="pointer-events-none absolute  inset-0 z-[1] opacity-[0.06]"
          style={{
            backgroundImage:
              STATIC_NOISE,

            backgroundRepeat:
              "repeat",

            backgroundSize:
              "180px 180px",
          }}
        />

        {/* ===============================================
            SOFT LIGHT
        =============================================== */}

        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(circle at 18% 15%, rgba(255,255,255,0.14), transparent 34%)",
          }}
        />

        {/* ===============================================
            CUSTOM HERO ICON
        =============================================== */}

        {heroIcon && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.82,
              y: "-50%",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: "-50%",
            }}
            transition={{
              duration: 0.4,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              absolute
              right-[8%]
              top-1/2
              z-[3]
              sm:right-[10%]
            "
          >
            <img
              src={heroIcon}
              alt=""
              draggable={false}
              className="
                h-[0px]
                w-[0px]
                object-contain
                sm:h-[60px]
                sm:w-[60px]
              "
            />
          </motion.div>
        )}
      </section>

      {/* ===================================================
          ACCOUNT CARD
      =================================================== */}

      <div className="relative z-20 mx-auto -mt-[58px] w-full max-w-[800px] px-4 pb-24 sm:px-5">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.32,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            rounded-[28px]
            bg-white
            px-6
            pb-7
            pt-6
            shadow-[0_5px_20px_rgba(0,0,0,0.035)]
            sm:px-8
          "
        >
          {/* ===============================================
              USER DETAILS
          =============================================== */}

          <div className="flex items-center gap-[13px]">
            <UserAvatar
              user={user}
              size={46}
            />

            <div className="min-w-0">
              <h1 className="truncate text-[16px] font-semibold leading-tight tracking-[-0.02em] text-[#111111]">
                {user.name ||
                  "Bangalicon User"}
              </h1>

              <p className="mt-[3px] truncate text-[12px] font-medium text-[#555A60]">
                {user.email}
              </p>
            </div>
          </div>

          {/* ===============================================
              PASSWORD
          =============================================== */}

          <div
            className="
              mt-[22px]
              rounded-[20px]
              border
              border-[#DEE1E5]
              bg-[#F5F6F7]
              px-[20px]
              py-[18px]
              sm:px-[22px]
            "
          >
            <p className="text-[16px] font-semibold text-[#111111]">
              Password
            </p>

            <p className="mt-[4px] text-[15px] font-semibold tracking-[0.2em] text-[#111111]">
              ••••••••
            </p>

            <p className="mt-[2px] text-[11px] leading-5 text-[#92969C]">
              For security, your
              password is never shown
              here.
            </p>

            {/* =============================================
                ACTIONS
            ============================================= */}

            <div className="mt-[8px] flex flex-wrap items-center gap-[7px]">
              <Link
                href="/reset-password"
                className="
                  inline-flex
                  h-[32px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#111111]
                  px-[15px]
                  text-[13px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#C9151B]
                "
              >
                Change Password
              </Link>

              <Link
                href="/login"
                className="
                  inline-flex
                  h-[32px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DDE0E4]
                  bg-white
                  px-[15px]
                  text-[13px]
                  font-semibold
                  text-[#111111]
                  transition
                  hover:bg-[#F8F9FA]
                "
              >
                Login again
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}