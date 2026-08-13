import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getAdminSession();
  redirect(session ? "/admin" : "/login");
}
