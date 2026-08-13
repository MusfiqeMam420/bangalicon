"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReleaseModal from "./ReleaseModal";
import {
  FALLBACK_RELEASE_VERSION,
  getLatestRelease,
  getReleaseKey,
  getReleaseVersion,
} from "@/app/lib/release-version";

export default function Navbar() {
  // 🔐 TEMP AUTH (replace later)
  const [user, setUser] = useState<any>({
    name: "Musfiq",
    avatar: "/avatar/avatar-meow.jpg",
  });

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openRelease, setOpenRelease] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const dropdownRef = useRef<any>(null);

  const [showDot, setShowDot] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(FALLBACK_RELEASE_VERSION);
  const [latestReleaseKey, setLatestReleaseKey] = useState(FALLBACK_RELEASE_VERSION);

  useEffect(() => {
    let active = true;

    const syncReleaseState = async () => {
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
        const seen = localStorage.getItem("seen_version");
        setShowDot(seen !== releaseKey);
      } catch {
        if (!active) {
          return;
        }

        setCurrentVersion(FALLBACK_RELEASE_VERSION);
        setLatestReleaseKey(FALLBACK_RELEASE_VERSION);
        const seen = localStorage.getItem("seen_version");
        setShowDot(seen !== FALLBACK_RELEASE_VERSION);
      }
    };

    void syncReleaseState();

    return () => {
      active = false;
    };
  }, [API]);

  // 🧠 Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🧠 ESC close (modal + dropdown)
  useEffect(() => {
    const esc = (e: any) => {
      if (e.key === "Escape") {
        setOpenDropdown(false);
        setOpenRelease(false);
      }
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#f5f6f8] backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center gap-0.5">
 <Link href="/">
              <Image
                src="/logo/bangalicon-logo.svg"
                alt="Bangalicon"
                width={200}
                height={40}
                className="h-auto w-[200px]"
              />

              {/* VERSION BADGE */}
               </Link>
              <span
  onClick={() => {
    setOpenRelease(true);

    // mark as seen
    localStorage.setItem("seen_version", latestReleaseKey);
    setShowDot(false);
  }}
  className="relative text-xs bg-[#d4d6dd] text-[#838282] px-2 py-[2px] mt-1.5 rounded-xl font-bold cursor-pointer hover:bg-[#c4c6ca] transition"
>
  {currentVersion}

  {/* RED DOT */}
  {showDot && (
    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
  )}
</span>
           
            </div>
           


            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">

                
            {/* MENU */}
            <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-gray-500">
              <Link href="/icons" className="hover:text-black transition">
                Icons
              </Link>
              <Link href="/usage" className="hover:text-black transition">
                Usage
              </Link>
              <Link href="/pricing" className="hover:text-black transition">
                Pricing
              </Link>
            </div>

              {/* NOT LOGGED IN */}
              {!user && (
                <>
                <div className="font-semibold">
   <Link
                    href="/login"
                    className="text-sm  text-gray-500 mr-4 hover:text-black"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="bg-red-600 text-white px-4 py-2 rounded-4xl text-sm font-semibold hover:bg-black transition"
                  >
                    Sign Up
                  </Link>
                </div>
               
                </>
              )}

              {/* LOGGED IN */}
              {user && (
                <div ref={dropdownRef} className="relative mt-1">

                  {/* AVATAR */}
                  <button onClick={() => setOpenDropdown(!openDropdown)}>
                    <Image
                      src={user.avatar}
                      alt="avatar"
                      width={36}
                      height={36}
                      className="rounded-full border cursor-pointer"
                    />
                  </button>

                  {/* DROPDOWN (macOS style) */}
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
                        className="absolute right-0 mt-2 w-52 bg-white backdrop-blur-xl rounded-2xl shadow-xl border p-2 text-sm"
                      >
                        {/* USER */}
                        <div className="px-3 py-2 border-b mb-2">
                          <p className="font-bold text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            user@email.com
                          </p>
                        </div>

                        <Link
                          href="/dashboard"
                          className="block px-3 py-2 rounded-xl hover:bg-gray-200 text-gray-600 transition"
                        >
                          Dashboard
                        </Link>

                        <Link
                          href="/collections"
                          className="block px-3 py-2 rounded-xl hover:bg-gray-200 text-gray-600 transition"
                        >
                          Collections
                        </Link>

                        <Link
                          href="/settings"
                          className="block px-3 py-2 rounded-xl hover:bg-gray-200 text-gray-600 transition"
                        >
                          Settings
                        </Link>

                        <hr className="my-2" />

                        <button
                          onClick={() => setUser(null)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-900 hover:text-white text-gray-600 cursor-pointer transition"
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
      </nav>

      {/* RELEASE MODAL */}
      <ReleaseModal
        open={openRelease}
        onClose={() => setOpenRelease(false)}
      />
    </>
  );
}
