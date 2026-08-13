import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Collections",
  path: "/collections",
  description: "View and manage your saved Bangalicon icon collections.",
  noIndex: true,
});

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
