import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import AdminLoginForm from "@/components/AdminLoginForm";
import { getAdminLoginState, getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const state = getAdminLoginState();
  const hint =
    state.mode === "fallback"
      ? {
          email: state.email,
          password: state.passwordHint,
        }
      : null;

  return (
    <div className="admin-auth-shell">
      <div className="admin-auth-card w-full max-w-[460px] p-5 md:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-[1.2rem] bg-[#111111] text-white ">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#8a8a8e]">
              Bangalicon
            </p>
            <h1 className="mt-1 text-[1.7rem] font-semibold tracking-tight text-[#151515]">
              Admin login
            </h1>
          </div>
        </div>

  
        <AdminLoginForm hint={hint} mode={state.mode} />
      </div>
    </div>
  );
}
