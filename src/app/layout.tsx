import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Scoped to the AI Assistant's chat only (via --font-chat), not applied
// globally. Anthropic's own chat interface uses proprietary typefaces that
// can't be licensed or embedded here — this is a genuinely different font,
// chosen because it reads the same way: a calm serif built for paragraphs of
// prose rather than UI chrome, which is what actually gives that interface
// its quieter, more "written for you" feel versus a dense sans-serif chat
// bubble.
const sourceSerif = Source_Serif_4({
  variable: "--font-chat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Primue: The Intelligent Business Operating System",
  description:
    "AI-powered, white-label business OS with wallet, documents, e-signature, HR/payroll, CRM and analytics, built for startups, schools, NGOs, agencies and government.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
