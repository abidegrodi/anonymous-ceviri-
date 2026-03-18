"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative flex flex-col bg-[#0a0a0a] overflow-hidden min-h-[70vh] md:min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <div className="absolute inset-0">
          <Image
            src="/hero-background.png"
            alt="Hero Background"
            fill
            priority
            className="object-cover object-top"
            quality={90}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(1, 1, 4, 0.99) 0%, rgba(2, 2, 6, 0.97) 12%, rgba(4, 3, 10, 0.92) 25%, rgba(10, 8, 20, 0.78) 38%, rgba(25, 18, 45, 0.5) 52%, rgba(50, 35, 80, 0.22) 65%, rgba(80, 55, 120, 0.06) 78%, transparent 92%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, transparent 0%, transparent 45%, rgba(100, 70, 150, 0.15) 70%, rgba(121, 93, 153, 0.5) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 70% at 100% 100%, rgba(2, 2, 6, 0.85) 0%, rgba(8, 6, 18, 0.5) 35%, transparent 65%)",
          }}
        />
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: '45%',
            background: "linear-gradient(to bottom, transparent 0%, rgba(10, 10, 10, 0.4) 35%, rgba(8, 8, 10, 0.85) 65%, #0a0a0a 100%)",
            zIndex: 2,
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative flex flex-1 flex-col justify-end w-full"
        style={{
          zIndex: 10,
          paddingTop: '80px',
          paddingBottom: 'clamp(24px, 6vw, 80px)',
          paddingLeft: 'clamp(16px, 5vw, 344px)',
          paddingRight: 'clamp(16px, 5vw, 344px)',
        }}
      >
        <div className="mx-auto w-full" style={{ maxWidth: "1280px" }}>
        <div
          className="w-full max-w-[672px] flex flex-col justify-start items-start gap-4 sm:gap-6"
        >
          {/* Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1 bg-[rgba(79,87,187,0.10)] rounded-full border border-[#D5C6E6] backdrop-blur-[6px]"
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                background: 'linear-gradient(90deg, #D5C6E6 16%, #795D99 100%)',
                borderRadius: '9999px',
              }}
            ></div>
            <div className="text-[#D5C6E6] text-xs font-bold font-caviar uppercase tracking-[0.60px]">
              v2.0 Yayında
            </div>
          </div>

          <div className="w-full max-w-[637px]">
            <Image
              src="/hero-title-figma.png"
              alt="Hikayeyi kendi dilinde yasa"
              width={637}
              height={259}
              priority
              className="w-full h-auto"
            />
          </div>

          <div className="w-full max-w-[529px]">
            <Image
              src="/hero-desc-figma.png"
              alt="Aciklama metni"
              width={529}
              height={80}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
            <Link
              href="/turkce-ceviriler"
              className="h-[48px] sm:h-[56px] px-6 sm:px-8 rounded-[9999px] flex items-center justify-center gap-2 hover:opacity-90 transition no-underline"
              style={{
                background: 'linear-gradient(210deg, rgba(204.67, 183.92, 229.02, 0.20) 0%, rgba(120.60, 93, 153, 0.20) 100%)',
              }}
            >
              <div className="w-[32.02px] h-6 flex items-center justify-center shrink-0 relative">
                <Image
                  src="/icons/ceviriHero.svg"
                  alt=""
                  width={25}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div
                className="text-white text-sm sm:text-base font-normal font-caviar whitespace-nowrap"
                style={{
                  lineHeight: '24px',
                  textShadow: '0px 0px 0px rgba(255, 255, 255, 1.00)',
                }}
              >
                Çevirileri Keşfet
              </div>
            </Link>
            {!isAuthenticated && (
              <Link
                href="/kayit-ol"
                className="h-[48px] sm:h-[56px] px-6 sm:px-8 rounded-[9999px] flex items-center justify-center hover:opacity-90 transition no-underline"
                style={{
                  background: 'linear-gradient(210deg, rgba(204.67, 183.92, 229.02, 0.20) 0%, rgba(120.60, 93, 153, 0.20) 100%)',
                }}
              >
                <div
                  className="text-white text-sm sm:text-base font-normal font-caviar"
                  style={{
                    lineHeight: '24px',
                    textShadow: '0px 0px 0px rgba(255, 255, 255, 1.00)',
                  }}
                >
                  Kayıt ol
                </div>
              </Link>
            )}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
