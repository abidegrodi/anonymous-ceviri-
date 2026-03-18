"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
  {
    id: "teknik",
    title: "Teknik Sorunlar",
    desc: "Çeviri dosyaları, kurulum hataları ve uyumluluk sorunları",
    icon: "/icons/teknik.svg",
    articles: 12,
  },
  {
    id: "hesap",
    title: "Hesap & Üyelik",
    desc: "Şifre sıfırlama, üyelik planları ve hesap ayarları",
    icon: "/icons/hesapveguvenlik.svg",
    articles: 8,
  },
  {
    id: "odeme",
    title: "Ödeme İşlemleri",
    desc: "Fatura geçmişi, iade talepleri ve ödeme yöntemleri",
    icon: "/icons/odemeler.svg",
    articles: 6,
  },
];

const popularArticles = [
  { title: "Çeviri açılmıyor, ne yapmalıyım?", tag: "Teknik" },
  { title: "Discord hesabımı nasıl bağlarım?", tag: "Hesap" },
  { title: "Hata Kodu: 0x8004101 Çözümü", tag: "Teknik" },
  { title: "Üyelik yenileme sorunu yaşıyorum", tag: "Ödeme" },
];

const quickLinks = [
  { label: "Kurulum Rehberi", href: "#" },
  { label: "Sıkça Sorulan Sorular", href: "/sss" },
  { label: "Çeviri Notları", href: "#" },
  { label: "İletişim", href: "/iletisim" },
];

export default function SupportPage() {
  const [search, setSearch] = useState("");

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden text-white">
      <Header />

      {/* Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 40% 30%, rgba(201,155,255,0.05) 0%, transparent 60%), radial-gradient(ellipse at 65% 50%, rgba(120,80,200,0.03) 0%, transparent 50%)" }} />

      <div className="relative z-10 w-full max-w-[1060px] mx-auto pt-[140px] pb-24 px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.15)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C99BFF", boxShadow: "0 0 6px #C99BFF" }} />
            <span className="text-[13px] font-bold uppercase tracking-[2px]" style={{ fontFamily: "Caviar Dreams", color: "#C99BFF" }}>Destek Merkezi</span>
          </div>

          <h1
            className="font-bold uppercase mb-4"
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontFamily: "Trajan Pro, serif",
              lineHeight: "1.1",
              letterSpacing: "-0.5px",
              background: "linear-gradient(180deg, #FFFFFF 0%, #C99BFF 60%, #795D99 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Nasıl Yardımcı Olabiliriz?
          </h1>
          <p className="text-white/35 text-base max-w-[480px] mx-auto leading-relaxed" style={{ fontFamily: "Caviar Dreams" }}>
            Sorunuzu arayın veya aşağıdaki kategorilerden birini seçin.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-[600px] mx-auto mb-14">
          <div className="absolute -inset-[1px] rounded-2xl pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(201,155,255,0.15) 0%, rgba(120,80,200,0.05) 50%, rgba(201,155,255,0.1) 100%)", mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", maskComposite: "exclude", WebkitMaskComposite: "xor", padding: "1px", borderRadius: "16px" }} />
          <div className="relative flex items-center">
            <svg className="absolute left-5 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2" style={{ opacity: 0.4 }}>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Sorunuzu veya anahtar kelimeyi yazın..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[52px] rounded-2xl pl-[52px] pr-5 text-[15px] text-white placeholder:text-white/20 focus:outline-none transition-all"
              style={{ fontFamily: "Caviar Dreams", background: "rgba(201,155,255,0.03)" }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, rgba(201,155,255,0.05) 0%, rgba(120,80,200,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,155,255,0.2)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,155,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.12)" }}
              >
                <Image src={cat.icon} alt="" width={20} height={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3
                className="text-[17px] font-bold mb-2 transition-colors duration-300"
                style={{
                  fontFamily: "Trajan Pro, serif",
                  background: "linear-gradient(180deg, #FFFFFF 0%, #C99BFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {cat.title}
              </h3>
              <p className="text-[14px] text-white/30 leading-relaxed mb-4" style={{ fontFamily: "Caviar Dreams" }}>
                {cat.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/15 font-bold" style={{ fontFamily: "Caviar Dreams" }}>
                  {cat.articles} makale
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,155,255,0.3)" strokeWidth="2" className="group-hover:stroke-[#C99BFF]/60 group-hover:translate-x-1 transition-all duration-300">
                  <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Two column: articles + sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Popular articles */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #C99BFF 0%, rgba(201,155,255,0.2) 100%)" }} />
              <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-white/30" style={{ fontFamily: "Caviar Dreams" }}>Popüler Makaleler</span>
            </div>

            <div className="flex flex-col gap-2">
              {popularArticles.map((item, idx) => (
                <div
                  key={idx}
                  className="group/a flex items-center gap-4 rounded-xl px-5 py-4 cursor-pointer transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(201,155,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(201,155,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.015)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  }}
                >
                  {/* Number */}
                  <span
                    className="text-[14px] font-bold tabular-nums shrink-0 w-7 text-center"
                    style={{
                      fontFamily: "Caviar Dreams",
                      background: "linear-gradient(180deg, rgba(201,155,255,0.4) 0%, rgba(201,155,255,0.15) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="w-[1px] h-5 shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] text-white/60 group-hover/a:text-white/90 truncate transition-colors duration-200" style={{ fontFamily: "Trajan Pro, serif" }}>
                      {item.title}
                    </h4>
                  </div>

                  {/* Tag */}
                  <span
                    className="text-[12px] font-bold px-3 py-1 rounded-lg shrink-0 hidden sm:block"
                    style={{
                      fontFamily: "Caviar Dreams",
                      background: "rgba(201,155,255,0.06)",
                      border: "1px solid rgba(201,155,255,0.1)",
                      color: "rgba(201,155,255,0.5)",
                    }}
                  >
                    {item.tag}
                  </span>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,155,255,0.2)" strokeWidth="2" className="shrink-0 group-hover/a:stroke-[#C99BFF]/50 transition-colors">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-4">

            {/* Live support */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden text-center"
              style={{
                background: "linear-gradient(135deg, rgba(201,155,255,0.06) 0%, rgba(120,80,200,0.03) 100%)",
                border: "1px solid rgba(201,155,255,0.12)",
              }}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,155,255,0.1) 0%, transparent 70%)" }} />

              <div
                className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(201,155,255,0.15) 0%, rgba(120,80,200,0.08) 100%)",
                  border: "1px solid rgba(201,155,255,0.2)",
                  boxShadow: "0 4px 16px rgba(201,155,255,0.1)",
                }}
              >
                <Image src="/icons/simdigorusme.svg" alt="" width={24} height={24} />
              </div>

              <h3
                className="text-[17px] font-bold mb-1"
                style={{
                  fontFamily: "Trajan Pro, serif",
                  background: "linear-gradient(180deg, #FFFFFF 0%, #C99BFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Canlı Destek
              </h3>
              <p className="text-[14px] text-white/25 mb-5 leading-relaxed" style={{ fontFamily: "Caviar Dreams" }}>
                Aradığınız cevabı bulamadınız mı? Ekibimiz size yardımcı olsun.
              </p>

              <button
                className="w-full h-11 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(201,155,255,0.2)] hover:scale-[1.02]"
                style={{
                  fontFamily: "Caviar Dreams",
                  background: "linear-gradient(135deg, #C99BFF 0%, #7B5EA7 100%)",
                  color: "#0a0a0a",
                  boxShadow: "0 2px 12px rgba(201,155,255,0.12)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Talep Oluştur
              </button>
            </div>

            {/* Quick links */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-white/20 block mb-4" style={{ fontFamily: "Caviar Dreams" }}>
                Hızlı Linkler
              </span>
              <div className="flex flex-col gap-1">
                {quickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline group/link hover:bg-white/[0.03] transition-all duration-200"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(201,155,255,0.25)" strokeWidth="2" className="shrink-0 group-hover/link:stroke-[#C99BFF]/60 group-hover/link:translate-x-0.5 transition-all duration-200">
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[15px] text-white/35 group-hover/link:text-white/70 transition-colors duration-200" style={{ fontFamily: "Caviar Dreams" }}>
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
