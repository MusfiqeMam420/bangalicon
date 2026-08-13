import { redirect } from "next/navigation";

import AdminLayout from "@/components/AdminLayout";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return <AdminLayout session={session}>{children}</AdminLayout>;
}
