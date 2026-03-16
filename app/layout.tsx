import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Anonymous Çeviri - Türkçe Çeviriler",
  description: "Oyun deneyiminizi ana dilinizde yaşamanız için tutkuyla çalışıyoruz. Türkiye'nin en kapsamlı Türkçe çeviri platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
