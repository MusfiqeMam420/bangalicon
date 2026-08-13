import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Reset Password",
  path: "/reset-password",
  description: "Reset your Bangalicon account password securely.",
  noIndex: true,
});

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
