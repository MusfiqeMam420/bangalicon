import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Verify Email",
  path: "/verify-email",
  description: "Verify your Bangalicon email address.",
  noIndex: true,
});

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
