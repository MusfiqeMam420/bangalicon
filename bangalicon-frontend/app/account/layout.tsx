import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Account",
  path: "/account",
  description: "Manage your Bangalicon account details and preferences.",
  noIndex: true,
});

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
