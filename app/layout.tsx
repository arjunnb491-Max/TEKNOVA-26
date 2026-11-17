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
  metadataBase: new URL("https://teknova2026.in"),
  title: "TEKNOVA ’26 | KMM College of Arts and Science, Thrikkakara",
  description: "TEKNOVA ’26 — Department of MCA, KMM College of Arts and Science, Thrikkakara. Fest Dates: December 2–3, 2026. IDEAS TODAY. A BRIGHTER TOMORROW. IDEAS • PEOPLE • POSSIBILITIES. MORE THAN JUST TECH.",
  keywords: ["TEKNOVA", "TEKNOVA 2026", "KMM College", "MCA Fest", "Tech Fest Kerala", "KMM College Thrikkakara", "IDEATEK", "BUG SLAYER", "TEK ROYAL", "FIND-X"],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "TEKNOVA ’26 | Department of MCA, KMM College",
    description: "Premier Intercollegiate Technical & Cultural Confluence. December 2–3, 2026. ₹70,000+ Prize Pool across official tournaments.",
    url: "https://teknova2026.in",
    siteName: "TEKNOVA '26",
    images: [
      {
        url: "/images/og/og-teknova-2026.jpg",
        width: 1200,
        height: 630,
        alt: "TEKNOVA '26 Official Fest Banner"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TEKNOVA ’26 | KMM College",
    description: "IDEAS TODAY. A BRIGHTER TOMORROW. 8 Flagship Contests, ₹70,000+ Prize Pool. Dec 2–3, 2026.",
    images: ["/images/og/twitter-teknova-2026.jpg"],
  }
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
