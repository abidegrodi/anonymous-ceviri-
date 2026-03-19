import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Anonymous Çeviri - Türkçe Çeviriler",
  description: "Oyun deneyiminizi ana dilinizde yaşamanız için tutkuyla çalışıyoruz. Türkiye'nin en kapsamlı Türkçe çeviri platformu.",
  metadataBase: new URL("https://anonymousceviri.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Anonymous Çeviri - Türkçe Çeviriler",
    description: "Oyun deneyiminizi ana dilinizde yaşamanız için tutkuyla çalışıyoruz. Türkiye'nin en kapsamlı Türkçe çeviri platformu.",
    url: "https://anonymousceviri.com",
    siteName: "Anonymous Çeviri",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preload" href="/fonts/CaviarDreams.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/CaviarDreams-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Cinzel-Regular-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.anonymousceviri.com" />
        <link rel="preconnect" href="https://api.anonymousceviri.com" />
        <link rel="dns-prefetch" href="https://shared.fastly.steamstatic.com" />
      </head>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:text-sm"
        >
          İçeriğe atla
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
