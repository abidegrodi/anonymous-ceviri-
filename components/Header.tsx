"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

const navLinkStyle = {
  color: '#fff',
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
  fontFamily: 'Caviar Dreams',
  fontWeight: 400,
  lineHeight: '22.75px',
} as React.CSSProperties;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <>
      <header
        className="fixed top-0 w-full z-50"
        style={{
          background: "rgba(5, 5, 5, 0.70)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          height: "80px",
        }}
      >
        <nav
          aria-label="Ana menü"
          className="h-full flex items-center w-full"
          style={{
            paddingLeft: 'clamp(16px, 5vw, 344px)',
            paddingRight: 'clamp(16px, 5vw, 344px)',
          }}
        >
          <div className="mx-auto w-full flex items-center justify-between" style={{ maxWidth: '1280px' }}>
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
              <a href="https://destek.anonymousceviri.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" style={navLinkStyle}>
                Destek
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 133, 209, 0.15) 0%, rgba(121, 93, 153, 0.25) 100%)',
                      border: '1px solid rgba(168, 133, 209, 0.4)',
                    }}
                  >
                    <Image src="/icons/human.svg" alt="Profil" width={22} height={22} />
                  </button>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                      <div
                        className="absolute right-0 top-[52px] z-50 w-[180px] rounded-xl overflow-hidden py-1"
                        style={{
                          background: 'rgba(15, 15, 15, 0.95)',
                          border: '1px solid rgba(201, 155, 255, 0.12)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                      >
                        <Link
                          href="/profil"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/[0.04] transition-all no-underline"
                          style={{ fontFamily: 'Caviar Dreams', fontSize: '13px' }}
                        >
                          <Image src="/icons/human.svg" alt="" width={16} height={16} className="opacity-60" />
                          Profilim
                        </Link>
                        <div className="mx-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <button
                          onClick={() => { setIsProfileOpen(false); logout(); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-[#FF5555]/70 hover:text-[#FF5555] hover:bg-white/[0.04] transition-all text-left"
                          style={{ fontFamily: 'Caviar Dreams', fontSize: '13px' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
                          </svg>
                          Çıkış Yap
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/giris-yap"
                    className="h-[40px] px-6 rounded-full flex items-center justify-center hover:brightness-110 transition"
                    style={{
                      background: 'rgba(168, 133, 209, 0.12)',
                      border: '1px solid rgba(168, 133, 209, 0.45)',
                    }}
                  >
                    <span style={authButtonStyle}>Giriş Yap</span>
                  </Link>
                  <Link
                    href="/kayit-ol"
                    className="h-[40px] px-6 rounded-full flex items-center justify-center hover:brightness-110 transition"
                    style={{
                      background: 'rgba(168, 133, 209, 0.12)',
                      border: '1px solid rgba(168, 133, 209, 0.45)',
                    }}
                  >
                    <span style={authButtonStyle}>Kayıt Ol</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              style={{ fontFamily: 'Caviar Dreams', color: '#fff', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/turkce-ceviriler"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', color: '#fff', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Türkçe Çeviriler
            </Link>
            <Link
              href="/duyurular"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', color: '#fff', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Duyurular
            </Link>
            <Link
              href="/iletisim"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', color: '#fff', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              İletişim
            </Link>
            <a
              href="https://destek.anonymousceviri.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg font-bold hover:opacity-80 transition-opacity py-2"
              style={{ fontFamily: 'Caviar Dreams', color: '#fff', background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Destek
            </a>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <Link
                  href="/profil"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-3 rounded-full text-sm text-center hover:opacity-90 transition flex items-center justify-center gap-3"
                  style={{
                    background: 'rgba(168, 133, 209, 0.12)',
                    border: '1px solid rgba(168, 133, 209, 0.45)',
                  }}
                >
                  <Image src="/icons/human.svg" alt="Profil" width={20} height={20} />
                  <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Caviar Dreams', fontWeight: 400 }}>
                    Profilim
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/giris-yap"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-6 py-3 rounded-full text-sm text-center hover:brightness-110 transition flex items-center justify-center"
                    style={{
                      background: 'rgba(168, 133, 209, 0.12)',
                      border: '1px solid rgba(168, 133, 209, 0.45)',
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Caviar Dreams', fontWeight: 400 }}>
                      Giriş Yap
                    </span>
                  </Link>
                  <Link
                    href="/kayit-ol"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-6 py-3 rounded-full text-sm text-center hover:brightness-110 transition flex items-center justify-center"
                    style={{
                      background: 'rgba(168, 133, 209, 0.12)',
                      border: '1px solid rgba(168, 133, 209, 0.45)',
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Caviar Dreams', fontWeight: 400 }}>
                      Kayıt Ol
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
