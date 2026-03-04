import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Offert-pro – Beautiful Quotes & Proposals for Small Businesses",
  description:
    "Create stunning, professional quotes and proposals in minutes. Track opens, collect e-signatures, and close more deals with Offert-pro.",
  keywords: [
    "quotation software",
    "proposal tool",
    "small business quotes",
    "e-signature",
    "invoice software",
  ],
  authors: [{ name: "Offert-pro" }],
  openGraph: {
    title: "Offert-pro – Close More Deals with Beautiful Quotes",
    description:
      "Create stunning proposals, track client engagement, and get e-signatures — all in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
