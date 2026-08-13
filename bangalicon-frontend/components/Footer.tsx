"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" ">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-6 px-6 py-7 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <Link href="/" aria-label="Go to home page" className="transition hover:opacity-90">
            <Image
              src="/logo/bangalicon-logo.svg"
              alt="Bangalicon"
              width={170}
              height={38}
              className="h-auto w-[170px]"
            />
          </Link>
          <p className="mt-1 text-[10px] text-[#8e8e8e]">© 2026 Bangalicon. All Rights Reserved.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-medium text-[#2a2a2a] sm:justify-end">
          <Link href="/categories" className="transition hover:text-[#d81317]">
            Categories
          </Link>
          <Link href="/terms" className="transition hover:text-[#d81317]">
            Terms
          </Link>
          <Link href="/privacy-policy" className="transition hover:text-[#d81317]">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="transition hover:text-[#d81317]">
            Refund Policy
          </Link>
          <Link href="/license" className="transition hover:text-[#d81317]">
            License
          </Link>
        </div>
      </div>
    </footer>
  );
}
