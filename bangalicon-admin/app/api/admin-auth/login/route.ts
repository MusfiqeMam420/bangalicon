import { NextResponse } from "next/server";

import { applyAdminSessionCookie, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: string; password?: string }
      | null;

    const result = verifyAdminCredentials(body?.email || "", body?.password || "");

    if (!result.ok) {
      const message =
        result.reason === "missing_config"
          ? "Admin login is not configured yet for this app."
          : "Incorrect admin email or password.";

      return NextResponse.json({ message }, { status: result.reason === "missing_config" ? 503 : 401 });
    }

    const response = NextResponse.json({
      ok: true,
      admin: {
        email: result.session.email,
        name: result.session.name,
      },
    });

    applyAdminSessionCookie(response, result.session);
    return response;
  } catch {
    return NextResponse.json({ message: "Unable to process admin login right now." }, { status: 500 });
  }
}
