import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Scoped to the homepage's hero/showcase sections only (via --font-kanit),
// not applied to html/body — the rest of the product stays on Inter.
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Origin: The Intelligent Business Operating System",
  description:
    "AI-powered, white-label business OS with wallet, documents, e-signature, HR/payroll, CRM and analytics, built for startups, schools, NGOs, agencies and government.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${kanit.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
