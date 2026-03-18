"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchDuyurular, mapStrapiDuyuruToAnnouncement } from "@/lib/strapi";

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

const ITEMS_PER_PAGE = 10;

export default function Duyurular() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [announcementsData, setAnnouncementsData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDuyurular()
      .then((data) => {
        if (!cancelled) {
          setAnnouncementsData(data.map(mapStrapiDuyuruToAnnouncement));
        }
      })
      .catch(() => {
        if (!cancelled) setError("Duyurular yüklenemedi. Strapi panelinin çalıştığından emin olun (http://localhost:1337).");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = activeFilter === "all"
    ? announcementsData
    : announcementsData.filter((a) => a.category === activeFilter);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: FilterType) => {
    setActiveFilter(f);
    setCurrentPage(1);
  };

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

        {/* Loading / Error */}
        {loading && (
          <div className="rounded-[24px] mb-8 p-12 text-center" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(18,17,14,0.95)" }}>
            <p className="text-white/60" style={{ fontFamily: "Caviar Dreams" }}>Duyurular yükleniyor…</p>
          </div>
        )}
        {error && (
          <div className="rounded-[24px] mb-8 p-6" style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)" }}>
            <p className="text-red-400 text-sm" style={{ fontFamily: "Caviar Dreams" }}>{error}</p>
          </div>
        )}

        {/* Filters */}
        {!loading && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className="px-4 py-2 rounded-xl shrink-0 transition-all text-[11px] uppercase tracking-wider"
              style={{
                fontFamily: "Caviar Dreams",
                background: activeFilter === f.id ? "rgba(201,155,255,0.10)" : "rgba(255,255,255,0.03)",
                border: activeFilter === f.id ? "1px solid rgba(201,155,255,0.30)" : "1px solid rgba(255,255,255,0.06)",
                color: activeFilter === f.id ? "#C99BFF" : "rgba(255,255,255,0.40)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        )}

        {/* Announcements List */}
        {!loading && filtered.length === 0 && !error && (
          <p className="text-white/50 py-8 text-center" style={{ fontFamily: "Caviar Dreams" }}>Henüz duyuru yok.</p>
        )}
        <div className="flex flex-col gap-3">
          {paginatedItems.map((announcement) => {
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
                        <span className="px-2 py-0.5 rounded text-[8px] sm:text-[9px] uppercase tracking-wider" style={{ fontFamily: "Caviar Dreams", background: tagColors.bg, border: `1px solid ${tagColors.border}`, color: tagColors.text }}>
                          {announcement.tag.text}
                        </span>
                      )}
                      <span className="text-[10px] text-white/20 hidden sm:inline" style={{ fontFamily: "Caviar Dreams" }}>{announcement.category}</span>
                    </div>
                    <h3 className="text-white/85 text-[14px] sm:text-[16px] font-bold group-hover:text-[#C99BFF] transition-colors truncate" style={{ fontFamily: "Trajan Pro, serif" }}>
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

        {/* Pagination - only show when multiple pages */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 overflow-hidden"
              style={{
                background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(201,155,255,0.20) 100%)",
                boxShadow: "0px 4px 6px -4px rgba(0,0,0,0.10), 0px 10px 15px -3px rgba(0,0,0,0.10)",
                outline: "1px solid rgba(255,255,255,0.20)",
              }}
            >
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <Image src="/icons/arrowl.svg" alt="Önceki" width={24} height={28} className="opacity-70 hover:opacity-100 transition-opacity" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold hover:bg-white/10 transition-all"
                    style={{
                      fontFamily: "Caviar Dreams",
                      ...(currentPage === page ? { background: "#C99BFF", boxShadow: "0px 0px 10px rgba(201,155,255,0.40)" } : {}),
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <Image src="/icons/arrowright.svg" alt="Sonraki" width={24} height={28} className="opacity-70 hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
