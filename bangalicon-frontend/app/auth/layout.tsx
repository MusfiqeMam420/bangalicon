import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Authentication",
  path: "/auth/google",
  description: "Authentication flow for your Bangalicon account.",
  noIndex: true,
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
