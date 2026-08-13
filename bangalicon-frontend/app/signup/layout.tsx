import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Create Account",
  path: "/signup",
  description: "Create your Bangalicon account and verify your email address.",
  noIndex: true,
});

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
