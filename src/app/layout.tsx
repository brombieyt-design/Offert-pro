import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Offert-pro – Vackra offerter och anbud för småföretag",
  description:
    "Skapa professionella offerter på minuter. Spåra öppningar, samla e-signaturer och vinn fler affärer med Offert-pro.",
  keywords: [
    "offertsystem",
    "offertsoftware",
    "offertverktyg småföretag",
    "e-signatur",
    "faktureringsprogram",
  ],
  authors: [{ name: "Offert-pro" }],
  openGraph: {
    title: "Offert-pro – Vinn fler affärer med vackra offerter",
    description:
      "Skapa professionella offerter, spåra kundengagemang och samla e-signaturer – allt på ett ställe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">{children}</body>
    </html>
  );
}
