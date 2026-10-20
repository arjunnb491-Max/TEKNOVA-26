import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#020713",
};

export const metadata: Metadata = {
  title: "TEKNOVA ’26 | KMM College of Arts and Science, Thrikkakara",
  description: "TEKNOVA ’26 — Department of MCA, KMM College of Arts and Science, Thrikkakara. Fest Dates: December 2–3, 2026. IDEAS TODAY. A BRIGHTER TOMORROW. IDEAS • PEOPLE • POSSIBILITIES. MORE THAN JUST TECH.",
  keywords: ["TEKNOVA", "TEKNOVA 2026", "KMM College", "MCA Fest", "Tech Fest Kerala", "KMM College Thrikkakara", "IDEATEK"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth dark`}>
      <body className="min-h-screen bg-[#020713] text-[#A9B8D0] font-sans antialiased overflow-x-hidden selection:bg-[#7B2CFF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
