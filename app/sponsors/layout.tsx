import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sponsors & Industry Partners | TEKNOVA '26",
  description:
    "Meet the official sponsors, industry leaders, and community partners powering TEKNOVA'26 – the premier intercollegiate tech & cultural confluence at KMM College of Arts and Science, Thrikkakara.",
  openGraph: {
    title: "Sponsors & Industry Partners | TEKNOVA '26",
    description: "Powering the future together. Explore the technology giants, venture partners, and media organizations backing TEKNOVA'26.",
    url: "https://teknova.co.in/sponsors",
    siteName: "TEKNOVA '26",
    images: [
      {
        url: "/images/og/og-teknova-2026.jpg",
        width: 1200,
        height: 630,
        alt: "TEKNOVA '26 Sponsors & Partners",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function SponsorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

