import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_METADATA } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  keywords: [
    "vedic mathematics",
    "mental math tricks",
    "math tricks for students",
    "CBSE math coaching",
    "ICSE math tutor",
    "IB math online",
    "GCSE mathematics",
    "private math tutor",
    "exam preparation math",
    "merit score expert",
  ],
  authors: [{ name: SITE_METADATA.teacher }],
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: SITE_METADATA.siteUrl,
    siteName: SITE_METADATA.siteName,
    images: [
      {
        url: `${SITE_METADATA.siteUrl}/logo.png`,
        width: 800,
        height: 600,
        alt: SITE_METADATA.siteName,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [`${SITE_METADATA.siteUrl}/logo.png`],
  },
  alternates: {
    canonical: SITE_METADATA.siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-gray-100 antialiased selection:bg-cyan/35 selection:text-white">
        {children}
      </body>
    </html>
  );
}
