import Link from "next/link";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-[760px] overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] shadow-[var(--shadow)]">
        <div className="border-b border-[var(--line)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),rgba(255,255,255,0.92)_40%,rgba(201,21,27,0.06)_100%)] px-6 py-6 md:px-8 md:py-8">
          <span className="admin-badge bg-[#111111] text-white">404</span>
          <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.04em] text-[#121212]">
            Admin page not found
          </h1>
          <p className="mt-2 max-w-[540px] text-[0.92rem] text-[var(--muted)]">
            This admin route does not exist right now, or the address was opened from an old link.
            Let&apos;s move back to the places you actually manage.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2 md:px-8 md:py-8">
          <div className="rounded-[1.4rem] border border-[var(--line)] bg-[#fcfcfd] p-5">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#111111] text-white">
              <Home size={18} />
            </div>
            <h2 className="text-[1rem] font-semibold tracking-tight">Go to dashboard</h2>
            <p className="mt-1 text-[0.85rem] text-[var(--muted)]">
              Return to your main admin overview, stats, and quick actions.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-[var(--line)] bg-[#fcfcfd] p-5">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#c9151b] text-white">
              <ShieldAlert size={18} />
            </div>
            <h2 className="text-[1rem] font-semibold tracking-tight">Need to sign in again?</h2>
            <p className="mt-1 text-[0.85rem] text-[var(--muted)]">
              If your session changed, you can reopen the admin login page and continue from
              there.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 px-6 pb-8 md:px-8">
          <Link href="/admin" className="admin-button admin-button-primary">
            <Home size={15} />
            <span>Back to dashboard</span>
          </Link>
          <Link href="/login" className="admin-button admin-button-secondary">
            <ArrowLeft size={15} />
            <span>Open admin login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
