import type { Metadata } from "next";

import "./globals.css";

const rawAdminUrl =
  process.env.NEXT_PUBLIC_ADMIN_SITE_URL ||
  process.env.ADMIN_SITE_URL ||
  "http://localhost:3001";

const adminUrl = rawAdminUrl.startsWith("http")
  ? rawAdminUrl
  : `https://${rawAdminUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(adminUrl),
  title: "Bangalicon Admin",
  description: "Control panel for Bangalicon icons, releases, promo, SEO, and users.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f5f6f8] text-[#121212] antialiased">{children}</body>
    </html>
  );
}
