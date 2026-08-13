"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Home, Image, Layers3, LogOut, Megaphone, NotebookPen, ShieldCheck, Tag, Users } from "lucide-react";
import type { AdminSession } from "@/lib/admin-auth";

const menu = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Icons", href: "/admin/icons", icon: Image },
  { name: "Categories", href: "/admin/categories", icon: Layers3 },
  { name: "Tags", href: "/admin/tags", icon: Tag },
  { name: "Releases", href: "/admin/releases", icon: NotebookPen },
  { name: "SEO", href: "/admin/seo", icon: BarChart3 },
  { name: "Promo", href: "/admin/promo", icon: Megaphone },
  { name: "Users", href: "/admin/users", icon: Users },
];

interface TopbarProps {
  session: AdminSession;
}

export default function Topbar({ session }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initial = useMemo(() => {
    const source = String(session.name || session.email || "A").trim();
    return source.charAt(0).toUpperCase() || "A";
  }, [session.email, session.name]);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin-auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="admin-card p-3.5 md:p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[1rem] bg-[#111111] text-white">
              <span className="text-base font-bold">B</span>
            </div>
            <div>
              <h2 className="text-[1rem] font-semibold tracking-tight">Admin Panel</h2>
              <p className="mt-0.5 text-[12px] text-[var(--muted)]">
                Manage icons, categories, tags, and users.
              </p>
            </div>
          </div>

          <div className="flex justify-start md:justify-end">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-[#fcfcfd] px-2.5 py-1.5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#111111] text-white">
                  <ShieldCheck size={15} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{session.name}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{session.email}</p>
                </div>
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#111111] text-white">
                  <span className="text-[13px] font-semibold">{initial}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="admin-button admin-button-secondary"
                disabled={isLoggingOut}
              >
                <LogOut size={15} />
                <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="admin-nav-strip border-t border-[var(--line)] px-0.5 pt-3 pb-0.5">
          <nav className="flex min-w-max items-center gap-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && Boolean(pathname?.startsWith(`${item.href}/`)));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`admin-nav-link ${active ? "admin-nav-link-active" : ""}`}
                >
                  <span className="admin-nav-link-icon">
                    <Icon size={13.5} />
                  </span>
                  <span className="admin-nav-link-label">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
