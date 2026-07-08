import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brand Store — Premium Footwear",
    template: "%s | Brand Store",
  },
  description:
    "Premium footwear from the world's top brands. Shop sneakers, boots, formal shoes, and more from Adidas, Prada, Cole Haan, New Balance, and 16+ luxury brands.",
  keywords: [
    "premium footwear",
    "luxury shoes",
    "sneakers",
    "boots",
    "formal shoes",
    "brand store",
    "designer shoes",
  ],
  authors: [{ name: "Brand Store" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brandstore.com",
    siteName: "Brand Store",
    title: "Brand Store — Premium Footwear",
    description:
      "Premium footwear from the world's top brands. Curated, authenticated, delivered.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Store — Premium Footwear",
    description:
      "Premium footwear from the world's top brands. Curated, authenticated, delivered.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
