"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReleaseModal from "./ReleaseModal";
import PromoStrip from "./PromoStrip";
import UserAvatar from "./UserAvatar";
import { clearAuth, getStoredUser, onAuthChange, refreshStoredUser } from "@/app/lib/auth";
import { getPublicApiBase } from "@/app/lib/runtime";
import { SHOW_PRICING } from "@/app/lib/features";
import {
  FALLBACK_RELEASE_VERSION,
  getLatestRelease,
  getReleaseKey,
  getReleaseVersion,
} from "@/app/lib/release-version";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openRelease, setOpenRelease] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const API = getPublicApiBase();
  const SEEN_RELEASE_KEY = "seen_release_note_key";
  const dropdownRef = useRef<any>(null);

  const [showDot, setShowDot] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(FALLBACK_RELEASE_VERSION);
  const [latestReleaseKey, setLatestReleaseKey] = useState(FALLBACK_RELEASE_VERSION);
  useEffect(() => {
    let active = true;

    const syncReleaseState = async () => {
      const seenReleaseKey =
        typeof window === "undefined" ? null : window.localStorage.getItem(SEEN_RELEASE_KEY);

      try {
        const response = await fetch(`${API}/releases`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load release notes");
        }

        const releases = await response.json();
        const latestRelease = getLatestRelease(releases);
        const releaseVersion = getReleaseVersion(latestRelease);
        const releaseKey = getReleaseKey(latestRelease);

        if (!active) {
          return;
        }

        setCurrentVersion(releaseVersion);
        setLatestReleaseKey(releaseKey);
        setShowDot(seenReleaseKey !== releaseKey);
      } catch {
        if (!active) {
          return;
        }

        setCurrentVersion(FALLBACK_RELEASE_VERSION);
        setLatestReleaseKey(FALLBACK_RELEASE_VERSION);
        setShowDot(seenReleaseKey !== FALLBACK_RELEASE_VERSION);
      }
    };

    void syncReleaseState();

    return () => {
      active = false;
    };
  }, [API]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setOpenDropdown(false);
    setMobileMenu(false);

    if (pathname === "/collections" || pathname === "/account") {
      router.replace("/");
    }
  };

  useEffect(() => {
    const syncUser = async () => {
      const storedUser = getStoredUser();
      setUser(storedUser);

      const freshUser = await refreshStoredUser();
      setUser(freshUser ?? storedUser ?? null);
      setAuthReady(true);
    };

    void syncUser();
    return onAuthChange(() => {
      void syncUser();
    });
  }, []);

  // close dropdown
  useEffect(() => {
    const handleClick = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ESC close
  useEffect(() => {
    const esc = (e: any) => {
      if (e.key === "Escape") {
        setOpenDropdown(false);
        setOpenRelease(false);
        setMobileMenu(false);
      }
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#f5f6f8] ">
        <PromoStrip />

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center gap-1">
              <Link href="/">
                <Image
                  src="/logo/bangalicon-logo.svg"
                  alt="Bangalicon"
                  width={180}
                  height={40}
                  priority
                  className="h-auto w-[180px]"
                />
              </Link>

              {/* VERSION */}
              <span
                onClick={() => {
                  setOpenRelease(true);
                  localStorage.setItem(SEEN_RELEASE_KEY, latestReleaseKey);
                  setShowDot(false);
                }}
                className="relative text-[11px] bg-[#d4d6dd] text-[#838282] px-2 py-[2px] mt-1.5 rounded-xl font-bold cursor-pointer"
              >
                {currentVersion}

                {showDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 ">

              {/* DESKTOP MENU */}
              <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-gray-500">
                <Link href="/" className="hover:text-black transition">Icons</Link>
                {SHOW_PRICING ? <Link href="/pricing" className="hover:text-black transition">Pricing</Link> : null}
                <Link href="/usage" className="hover:text-black transition">Usage</Link>
              </div>

              {/* MOBILE: LOGIN + HAMBURGER */}
              <div className="flex md:hidden items-center gap-3">

                {/* {!user && (
                  <Link href="/login" className="text-sm text-gray-600 text-semibold">
                    Login
                  </Link>
                )} */}

                <button onClick={() => setMobileMenu(!mobileMenu)}>
                  <div className="w-6 h-6 flex flex-col mt-0  justify-between cursor-pointer">
                      <Image
                  src="icons/menu.svg"
                  alt="menu_icon"
                  width={80}
                  height={40}
                />
                  </div>
                </button>
              </div>

              {/* DESKTOP AUTH */}
              <div className="hidden md:flex items-center gap-3">
                {!authReady ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e9ee] bg-white/80 shadow-[0_6px_16px_rgba(17,17,17,0.04)]">
                    <div className="h-7 w-7 rounded-full bg-[#eef1f5] animate-pulse" />
                  </div>
                ) : !user ? (
                  <>
                   <div className="font-semibold">
   {/* <Link
                    href="/login"
                    className="text-sm  text-gray-500 mr-3 hover:text-black transition"
                  >
                    Login
                  </Link> */}

                  <Link
                    href="/signup"
                    className="bg-[#CA1016] text-white px-3 py-2 rounded-3xl text-sm font-semibold hover:bg-black transition"
                  >
                    Get Started
                  </Link>
                </div>
                  </>
                ) : (
                  <div ref={dropdownRef} className="relative mt-1">
                    <button
                      onClick={() => setOpenDropdown(!openDropdown)}
                      className="flex h-9 w-9 items-center cursor-pointer justify-center overflow-hidden rounded-full transition hover:scale-[1.04]"
                      aria-label="Open account menu"
                    >
                      <UserAvatar user={user} size={36} />
                    </button>

                      <AnimatePresence>
                    {openDropdown && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="absolute right-0 mt-2 w-52 bg-white backdrop-blur-xl rounded-2xl shadow-sm  p-2 text-[14px]"
                      >
                        {/* USER */}
                        <div className="px-3 py-2 border-b mb-2 border-gray-200">
                          <p className="font-bold text-gray-800">
                            {user.name}
                          </p>
                          <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
                            {user.email}
                          </p>
                        </div>

                        {/* <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A8A8A]">
                          {user.plan === "premium" ? "Premium Account" : "Free Account"}
                        </div> */}

                        <Link
                          href="/account"
                          className="block px-3 py-2 font-medium rounded-xl hover:bg-gray-200 text-gray-600 transition"
                        >
                          Account
                        </Link>

                        <Link
                          href="/collections"
                          className="block px-3 py-2 font-medium  rounded-xl hover:bg-gray-200 text-gray-600 transition"
                        >
                          Collections
                        </Link>

                        {/* <Link
                          href="/settings"
                          className="block px-3 py-2 rounded-xl hover:bg-gray-200 text-gray-600 transition"
                        >
                          Settings
                        </Link> */}

                        <hr className="my-2 border-gray-200" />

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-xl  hover:bg-gray-900 hover:text-white text-gray-600 cursor-pointer transition"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
   <AnimatePresence>
  {mobileMenu && (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      {/* FULLSCREEN MENU */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f5f6f8]"
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setMobileMenu(false)}
          className="absolute top-5 right-4 cursor-pointer"
        >
           <Image
                  src="icons/close.svg"
                  alt="menu_icon"
                  width={25}
                  height={25}
                />
        </button>

        {/* MENU ITEMS */}
        <div className="flex flex-col items-center gap-6 text-xl font-semibold text-gray-600 ">

          <Link href="/" onClick={() => setMobileMenu(false)} className="hover:text-gray-950 transition"> 
            Icons
          </Link>

          <Link href="/usage" onClick={() => setMobileMenu(false)}  className="hover:text-gray-950 transition">
            Usage
          </Link>

          {SHOW_PRICING ? (
            <Link href="/pricing" onClick={() => setMobileMenu(false)}  className="hover:text-gray-950 transition">
              Pricing
            </Link>
          ) : null}

          {authReady && !user && (
            <Link
              href="/login"
              onClick={() => setMobileMenu(false)}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full text-base hover:bg-gray-950 transition"
            >
              Login
            </Link>
          )}

          {authReady && user && (
            <Link
              href="/account"
              onClick={() => setMobileMenu(false)}
              className="mt-4 bg-black text-white px-6 py-2 rounded-full text-base hover:bg-[#C9151B] transition"
            >
              Account
            </Link>
          )}
        </div>

      </motion.div>
    </>
  )}
</AnimatePresence>

      <ReleaseModal
        open={openRelease}
        onClose={() => setOpenRelease(false)}
      />
    </>
  );
}
