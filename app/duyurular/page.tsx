"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Announcement {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tag?: {
    text: string;
    color: string;
  };
}

const announcementsData: Announcement[] = [
  {
    id: 1,
    slug: "starfield-turkce-yama-v1-2",
    title: "Starfield Türkçe Çeviri",
    subtitle: "Güncellemesi Yayınlandı",
    category: "Güncelleme",
    date: "14 Ekim 2023",
    readTime: "3 Dakika",
    image: "https://placehold.co/400x250",
    tag: { text: "GÜNCELLEME", color: "purple" },
  },
  {
    id: 2,
    slug: "baldurs-gate-3-ceviri-tamamlandi",
    title: "Baldur's Gate 3",
    subtitle: "%100 Çeviri Tamamlandı",
    category: "Yeni Çeviri",
    date: "12 Ekim 2023",
    readTime: "5 Dakika",
    image: "https://placehold.co/400x250",
    tag: { text: "YENİ", color: "green" },
  },
  {
    id: 3,
    slug: "cyberpunk-2077-dlc-yama-hazirligi",
    title: "Cyberpunk 2077 DLC",
    subtitle: "Çeviri Hazırlığı Başladı",
    category: "Duyuru",
    date: "10 Ekim 2023",
    readTime: "4 Dakika",
    image: "https://placehold.co/400x250",
  },
  {
    id: 4,
    slug: "elden-ring-turkce-yama-v2",
    title: "Elden Ring",
    subtitle: "Türkçe Çeviri v2.0",
    category: "Güncelleme",
    date: "8 Ekim 2023",
    readTime: "3 Dakika",
    image: "https://placehold.co/400x250",
    tag: { text: "GÜNCELLEME", color: "purple" },
  },
  {
    id: 5,
    slug: "god-of-war-ragnarok-beta",
    title: "God of War Ragnarok",
    subtitle: "Beta Sürümü Yayınlandı",
    category: "Beta",
    date: "5 Ekim 2023",
    readTime: "6 Dakika",
    image: "https://placehold.co/400x250",
    tag: { text: "BETA", color: "yellow" },
  },
  {
    id: 6,
    slug: "hogwarts-legacy-yama-duyurusu",
    title: "Hogwarts Legacy",
    subtitle: "Türkçe Çeviri Duyurusu",
    category: "Duyuru",
    date: "1 Ekim 2023",
    readTime: "4 Dakika",
    image: "https://placehold.co/400x250",
  },
];

type FilterType = "all" | "Güncelleme" | "Yeni Çeviri" | "Duyuru" | "Beta";

const filters: { id: FilterType; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "Güncelleme", label: "Güncelleme" },
  { id: "Yeni Çeviri", label: "Yeni Çeviri" },
  { id: "Duyuru", label: "Duyuru" },
  { id: "Beta", label: "Beta" },
];

function getTagColors(color: string) {
  switch (color) {
    case "green": return { bg: "rgba(34, 197, 94, 0.10)", border: "rgba(34, 197, 94, 0.25)", text: "#22C55E" };
    case "yellow": return { bg: "rgba(242, 185, 13, 0.10)", border: "rgba(242, 185, 13, 0.25)", text: "#F2B90D" };
    default: return { bg: "rgba(201, 155, 255, 0.10)", border: "rgba(201, 155, 255, 0.25)", text: "#C99BFF" };
  }
}

export default function Duyurular() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filtered = activeFilter === "all"
    ? announcementsData
    : announcementsData.filter((a) => a.category === activeFilter);

  const featured = announcementsData[0];

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <div className="pt-[100px] pb-16 px-4 md:px-8 lg:px-12 max-w-[1280px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm mb-6">
          <Link href="/" className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase" style={{ fontFamily: "Caviar Dreams" }}>ANA SAYFA</Link>
          <Image src="/icons/arrowr.svg" alt=">" width={20} height={20} className="opacity-50" />
          <span className="font-medium uppercase" style={{ fontFamily: "Caviar Dreams", background: "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(121,93,153,0.90) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            DUYURULAR
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="mb-3 uppercase" style={{ fontFamily: "Trajan Pro, serif", fontSize: "clamp(28px, 5vw, 47.8px)", fontWeight: 700, lineHeight: "clamp(32px, 5.5vw, 48px)", letterSpacing: "-0.96px" }}>
            <span className="text-[#C99BFF]">| </span>
            <span style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(121,93,153,0.90) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              DUYURULAR
            </span>
          </h1>
          <p style={{ fontFamily: "Caviar Dreams", fontSize: "18px", fontWeight: 400, lineHeight: "28px", color: "#FAF8FF" }}>
            En son Türkçe çeviri güncellemeleri, yeni projeler ve topluluk haberlerini takip edin.
          </p>
        </div>

        {/* Featured Announcement */}
        <Link href={`/duyurular/${featured.slug}`}>
          <div className="relative rounded-[24px] overflow-hidden mb-8 group cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-[45%] h-[200px] md:h-auto overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ minHeight: "240px" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 60%, rgba(18,17,14,1) 100%)" }} />
                <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(0deg, rgba(18,17,14,1) 40%, transparent 100%)" }} />
              </div>
              <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-center" style={{ background: "rgba(18,17,14,0.95)" }}>
                <div className="flex items-center gap-3 mb-3">
                  {featured.tag && (() => {
                    const c = getTagColors(featured.tag.color);
                    return (
                      <span className="px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider" style={{ fontFamily: "LEMON MILK", background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                        {featured.tag.text}
                      </span>
                    );
                  })()}
                  <span className="text-[11px] text-white/30 uppercase tracking-wider" style={{ fontFamily: "LEMON MILK" }}>ÖNE ÇIKAN</span>
                </div>
                <h2 className="text-white text-[22px] md:text-[28px] font-bold mb-2 group-hover:text-[#C99BFF] transition-colors" style={{ fontFamily: "LEMON MILK", lineHeight: "1.2" }}>
                  {featured.title}
                </h2>
                <p className="text-white/50 text-[15px] mb-4" style={{ fontFamily: "Caviar Dreams", lineHeight: "24px" }}>
                  {featured.subtitle}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-white/30" style={{ fontFamily: "Caviar Dreams" }}>{featured.date}</span>
                  <span className="text-[12px] text-white/30" style={{ fontFamily: "Caviar Dreams" }}>{featured.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="px-4 py-2 rounded-xl shrink-0 transition-all text-[11px] uppercase tracking-wider"
              style={{
                fontFamily: "LEMON MILK",
                background: activeFilter === f.id ? "rgba(201,155,255,0.10)" : "rgba(255,255,255,0.03)",
                border: activeFilter === f.id ? "1px solid rgba(201,155,255,0.30)" : "1px solid rgba(255,255,255,0.06)",
                color: activeFilter === f.id ? "#C99BFF" : "rgba(255,255,255,0.40)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        <div className="flex flex-col gap-3">
          {filtered.map((announcement) => {
            const tagColors = announcement.tag ? getTagColors(announcement.tag.color) : null;
            return (
              <Link key={announcement.id} href={`/duyurular/${announcement.slug}`}>
                <div
                  className="group flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-[16px] transition-all hover:scale-[1.005] cursor-pointer"
                  style={{
                    background: "rgba(24,22,17,0.50)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
                    <img src={announcement.image} alt={announcement.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.40) 100%)" }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {announcement.tag && tagColors && (
                        <span className="px-2 py-0.5 rounded text-[8px] sm:text-[9px] uppercase tracking-wider" style={{ fontFamily: "LEMON MILK", background: tagColors.bg, border: `1px solid ${tagColors.border}`, color: tagColors.text }}>
                          {announcement.tag.text}
                        </span>
                      )}
                      <span className="text-[10px] text-white/20 hidden sm:inline" style={{ fontFamily: "Caviar Dreams" }}>{announcement.category}</span>
                    </div>
                    <h3 className="text-white/85 text-[14px] sm:text-[16px] font-bold group-hover:text-[#C99BFF] transition-colors truncate" style={{ fontFamily: "LEMON MILK" }}>
                      {announcement.title}
                    </h3>
                    <p className="text-white/35 text-[12px] sm:text-[13px] truncate" style={{ fontFamily: "Caviar Dreams" }}>
                      {announcement.subtitle}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] text-white/25" style={{ fontFamily: "Caviar Dreams" }}>{announcement.date}</span>
                    <span className="text-[10px] text-white/15" style={{ fontFamily: "Caviar Dreams" }}>{announcement.readTime}</span>
                  </div>

                  {/* Arrow */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,155,255,0.25)" strokeWidth="2" className="shrink-0 group-hover:stroke-[#C99BFF] transition-colors">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2 overflow-hidden"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(201,155,255,0.20) 100%)",
              boxShadow: "0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)",
              outline: "1px solid rgba(255,255,255,0.20)",
            }}
          >
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all">
              <Image src="/icons/arrowl.svg" alt="Önceki" width={24} height={28} className="opacity-70 hover:opacity-100 transition-opacity" />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold" style={{ fontFamily: "Inter", background: "#C99BFF", boxShadow: "0px 0px 10px rgba(201,155,255,0.40)" }}>1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold hover:bg-white/10 transition-all" style={{ fontFamily: "Inter" }}>2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold hover:bg-white/10 transition-all" style={{ fontFamily: "Inter" }}>3</button>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all">
              <Image src="/icons/arrowright.svg" alt="Sonraki" width={24} height={28} className="opacity-70 hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
