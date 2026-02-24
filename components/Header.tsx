"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

const navLinkStyle = {
  background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontSize: '18px',
  fontFamily: 'Caviar Dreams',
  fontWeight: 700,
  lineHeight: '22.75px',
} as React.CSSProperties;

const authButtonStyle = {
  textAlign: 'center',
  color: 'white',
  fontSize: '14px',
  fontFamily: 'LEMON MILK',
  fontWeight: 400,
  lineHeight: '22.75px',
} as React.CSSProperties;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <>
      <header
        className="fixed top-0 w-full z-50"
        style={{
          background: "#000000",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          height: "80px",
        }}
      >
        <nav className="h-full flex items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-[1280px] h-[80px] flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link href="/">
                <Image
                  src="/logo-anonymous.png"
                  alt="ANONYMOUS Logo"
                  width={220}
                  height={40}
                  className="h-auto w-[160px] sm:w-[180px] md:w-[220px]"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link href="/" className="hover:opacity-80 transition-opacity" style={navLinkStyle}>
                Ana Sayfa
              </Link>
              <Link href="/turkce-ceviriler" className="hover:opacity-80 transition-opacity" style={navLinkStyle}>
                Türkçe Çeviriler
              </Link>
              <Link href="/duyurular" className="hover:opacity-80 transition-opacity" style={navLinkStyle}>
                Duyurular
              </Link>
              <Link href="/iletisim" className="hover:opacity-80 transition-opacity" style={navLinkStyle}>
                İletişim
              </Link>
              <Link href="/destek" className="hover:opacity-80 transition-opacity" style={navLinkStyle}>
                Destek
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {!isLoading && (
                isAuthenticated ? (
                  <Link
                    href="/profil"
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 133, 209, 0.15) 0%, rgba(121, 93, 153, 0.25) 100%)',
                      border: '1px solid rgba(168, 133, 209, 0.4)',
                    }}
                  >
                    <Image src="/icons/human.svg" alt="Profil" width={22} height={22} />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/giris-yap"
                      className="h-[40px] px-6 rounded-full flex items-center justify-center hover:opacity-90 transition"
                      style={{ border: '1px solid rgba(168, 133, 209, 0.5)' }}
                    >
                      <span style={authButtonStyle}>GİRİŞ YAP</span>
                    </Link>
                    <Link
                      href="/kayit-ol"
                      className="h-[40px] px-6 rounded-full flex items-center justify-center hover:opacity-90 transition"
                      style={{
                        background: '#A885D133',
                        border: '1px solid rgba(180, 150, 220, 0.6)',
                      }}
                    >
                      <span style={authButtonStyle}>KAYIT OL</span>
                    </Link>
                  </>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menü"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="lg:hidden absolute top-[80px] left-0 w-full px-6 py-6 space-y-4"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/turkce-ceviriler"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Türkçe Çeviriler
            </Link>
            <Link
              href="/duyurular"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Duyurular
            </Link>
            <Link
              href="/iletisim"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              İletişim
            </Link>
            <Link
              href="/destek"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Destek
            </Link>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              {!isLoading && (
                isAuthenticated ? (
                  <Link
                    href="/profil"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-6 py-3 rounded-full text-sm text-center hover:opacity-90 transition flex items-center justify-center gap-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 133, 209, 0.15) 0%, rgba(121, 93, 153, 0.25) 100%)',
                      border: '1px solid rgba(168, 133, 209, 0.4)',
                    }}
                  >
                    <Image src="/icons/human.svg" alt="Profil" width={20} height={20} />
                    <span style={{ color: 'white', fontSize: '14px', fontFamily: 'LEMON MILK', fontWeight: 400 }}>
                      PROFİLİM
                    </span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/giris-yap"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 px-6 py-3 rounded-full text-sm text-center hover:opacity-90 transition flex items-center justify-center"
                      style={{
                        background: '#A885D133',
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                      }}
                    >
                      <span style={{ color: 'white', fontSize: '14px', fontFamily: 'LEMON MILK', fontWeight: 400 }}>
                        GİRİŞ YAP
                      </span>
                    </Link>
                    <Link
                      href="/kayit-ol"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 px-6 py-3 rounded-full text-sm text-center hover:opacity-90 transition flex items-center justify-center"
                      style={{
                        background: '#A885D133',
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                      }}
                    >
                      <span style={{ color: 'white', fontSize: '14px', fontFamily: 'LEMON MILK', fontWeight: 400 }}>
                        KAYIT OL
                      </span>
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
