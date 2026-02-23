"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

// Duyuru verisi tipi
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

// Örnek duyuru verileri
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

export default function Duyurular() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Main Content */}
      <div className="pt-[100px] pb-16 px-4 md:px-8 lg:px-12 max-w-[1280px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm mb-6">
          <Link
            href="/"
            className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase"
            style={{ fontFamily: "Caviar Dreams, sans-serif" }}
          >
            ANA SAYFA
          </Link>
          <Image
            src="/icons/arrowr.svg"
            alt=">"
            width={20}
            height={20}
            className="opacity-50"
          />
          <span
            className="font-medium uppercase"
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(121, 93, 153, 0.90) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DUYURULAR
          </span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1
            className="mb-3 uppercase"
            style={{
              fontFamily: "Trajan Pro, serif",
              fontSize: "clamp(28px, 5vw, 47.8px)",
              fontWeight: 700,
              lineHeight: "clamp(32px, 5.5vw, 48px)",
              letterSpacing: "-0.96px",
            }}
          >
            <span className="text-[#C99BFF]">| </span>
            <span
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(121, 93, 153, 0.90) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              DUYURULAR
            </span>
          </h1>
          <p
            className="max-w-2xl"
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "28px",
              color: "#FAF8FF",
            }}
          >
            En son Türkçe çeviri güncellemeleri, yeni projeler ve topluluk
            haberlerini takip edin.
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcementsData.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2 overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0%, rgba(201, 155, 255, 0.20) 100%)",
              boxShadow:
                "0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)",
              outline: "1px solid rgba(255, 255, 255, 0.20)",
            }}
          >
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all">
              <Image
                src="/icons/arrowl.svg"
                alt="Önceki"
                width={24}
                height={28}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </button>
            <div className="flex items-center gap-1">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold"
                style={{
                  fontFamily: "Inter, sans-serif",
                  background: "#C99BFF",
                  boxShadow: "0px 0px 10px rgba(201, 155, 255, 0.40)",
                }}
              >
                1
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold hover:bg-white/10 transition-all"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                2
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold hover:bg-white/10 transition-all"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                3
              </button>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all">
              <Image
                src="/icons/arrowright.svg"
                alt="Sonraki"
                width={24}
                height={28}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// Announcement Card Component
function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const getTagStyle = (color: string) => {
    switch (color) {
      case "green":
        return {
          background: "rgba(34, 197, 94, 0.20)",
          border: "1px solid #22C55E",
          color: "#22C55E",
        };
      case "yellow":
        return {
          background: "rgba(242, 185, 13, 0.20)",
          border: "1px solid #F2B90D",
          color: "#F2B90D",
        };
      case "purple":
      default:
        return {
          background: "rgba(217, 70, 239, 0.20)",
          border: "1px solid #C99BFF",
          color: "#C99BFF",
        };
    }
  };

  return (
    <Link href={`/duyurular/${announcement.slug}`}>
      <div
        className="group cursor-pointer rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
        style={{
          background: "rgba(255, 0, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Image */}
        <div className="relative w-full h-[180px] overflow-hidden">
          <img
            src={announcement.image}
            alt={announcement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0) 100%)",
            }}
          />
          {/* Tag */}
          {announcement.tag && (
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded"
              style={{
                ...getTagStyle(announcement.tag.color),
                fontFamily: "LEMON MILK, sans-serif",
                fontSize: "10px",
                fontWeight: 400,
              }}
            >
              {announcement.tag.text}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Date & Read Time */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/calendar.svg"
                alt="Tarih"
                width={14}
                height={14}
                className="opacity-60"
              />
              <span
                className="text-xs text-gray-400"
                style={{ fontFamily: "Caviar Dreams, sans-serif" }}
              >
                {announcement.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/icons/sure.svg"
                alt="Okuma Süresi"
                width={14}
                height={14}
                className="opacity-60"
              />
              <span
                className="text-xs text-gray-400"
                style={{ fontFamily: "Caviar Dreams, sans-serif" }}
              >
                {announcement.readTime}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-white group-hover:text-[#C99BFF] transition-colors mb-1"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "24px",
            }}
          >
            {announcement.title}
          </h3>
          <p
            className="text-gray-400"
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            {announcement.subtitle}
          </p>

          {/* Read More */}
          <div className="mt-4 flex items-center gap-2 text-[#C99BFF] group-hover:gap-3 transition-all">
            <span
              style={{
                fontFamily: "LEMON MILK, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
              }}
            >
              Devamını Oku
            </span>
            <Image
              src="/icons/arrowright.svg"
              alt=">"
              width={16}
              height={16}
              className="opacity-70"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
