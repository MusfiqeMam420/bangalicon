"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/reset-password" ||
    pathname === "/verify-email" ||
    pathname.startsWith("/auth/");

  return (
    <>
      {!isAuthPage ? <Navbar /> : null}
      <main className={isAuthPage ? "min-h-screen" : "min-h-screen pb-6 pt-28"}>{children}</main>
      {!isAuthPage ? <Footer /> : null}
    </>
  );
}
