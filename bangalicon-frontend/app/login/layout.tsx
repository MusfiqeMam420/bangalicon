import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Login",
  path: "/login",
  description: "Sign in to your Bangalicon account.",
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
