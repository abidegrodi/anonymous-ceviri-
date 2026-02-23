"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

// Blog verisi tipi
interface BlogPost {
  slug: string;
  title: string;
  titleHighlight: string;
  category: string;
  date: string;
  author: string;
  version: string;
  readTime: string;
  platforms: string[];
  heroImage: string;
  content: string;
  changes: string[];
  videoThumbnail: string;
  screenshots: string[];
  note: string;
}

// Örnek blog verileri
const blogPosts: Record<string, BlogPost> = {
  "starfield-turkce-yama-v1-2": {
    slug: "starfield-turkce-yama-v1-2",
    title: "Starfield Türkçe Çeviri",
    titleHighlight: "Güncellemesi Yayınlandı",
    category: "Güncelleme",
    date: "14 Ekim 2023",
    author: "Admin",
    version: "v1.2.0",
    readTime: "3 Dakika",
    platforms: ["pc", "xbox"],
    heroImage: "/assets/blogicsayfahero.png",
    content:
      "Starfield için beklenen Türkçe çeviri güncellemesi sonunda yayında! Bu güncelleme ile birlikte diyaloglardaki çeviri hataları giderildi, terminoloji sözlüğü genişletildi ve arayüz terimleri oyunun atmosferine daha uygun hale getirildi.",
    changes: [
      "Ana hikaye görevlerindeki 500+ satır diyalog hatası düzeltildi.",
      "Envanter ve crafting menüsündeki font sorunları çözüldü.",
      "Gezegen isimleri ve özel terimler için Cyber-Sözlük entegrasyonu yapıldı.",
    ],
    videoThumbnail: "https://placehold.co/700x393",
    screenshots: [
      "https://placehold.co/341x191",
      "https://placehold.co/341x191",
    ],
    note: "Bu çeviri sadece Steam versiyonu ile uyumludur. Game Pass versiyonu için çalışmalarımız devam etmektedir.",
  },
  "baldurs-gate-3-ceviri-tamamlandi": {
    slug: "baldurs-gate-3-ceviri-tamamlandi",
    title: "Baldur's Gate 3",
    titleHighlight: "%100 Çeviri Tamamlandı",
    category: "Yeni Çeviri",
    date: "12 Ekim 2023",
    author: "Admin",
    version: "v1.0.0",
    readTime: "5 Dakika",
    platforms: ["pc"],
    heroImage: "/assets/blogicsayfahero.png",
    content:
      "Baldur's Gate 3 için tam Türkçe çeviri nihayet tamamlandı! Tüm diyaloglar, menüler ve oyun içi metinler Türkçeye çevrildi.",
    changes: [
      "Tüm ana hikaye diyalogları çevrildi.",
      "Yan görevler ve NPC diyalogları tamamlandı.",
      "Envanter ve karakter ekranları Türkçeleştirildi.",
    ],
    videoThumbnail: "https://placehold.co/700x393",
    screenshots: [
      "https://placehold.co/341x191",
      "https://placehold.co/341x191",
    ],
    note: "Steam ve GOG versiyonları ile uyumludur.",
  },
};

// Diğer duyurular
const otherAnnouncements = [
  {
    slug: "baldurs-gate-3-ceviri-tamamlandi",
    title: "Baldur's Gate 3 - %100 Çeviri Tamamlandı",
    date: "2 gün önce",
    image: "https://placehold.co/80x56",
  },
  {
    slug: "cyberpunk-2077-dlc-yama-hazirligi",
    title: "Cyberpunk 2077 DLC Çeviri Hazırlığı",
    date: "5 gün önce",
    image: "https://placehold.co/80x56",
  },
  {
    slug: "elden-ring-turkce-yama-v2",
    title: "Elden Ring Türkçe Çeviri v2.0",
    date: "1 hafta önce",
    image: "https://placehold.co/80x56",
  },
];

export default function BlogDetail() {
  const params = useParams();
  const slug = params.slug as string;

  // Blog verisini al
  const post = blogPosts[slug] || blogPosts["starfield-turkce-yama-v1-2"];

  return (
    <main className="min-h-screen bg-[#0C080F]">
      <Header />

      {/* Hero Section - Fixed at top, behind header */}
      <div className="relative w-full h-[600px] overflow-hidden" style={{ marginTop: '80px' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${post.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />

        {/* Gradient Overlay - Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(0deg, #0C080F 0%, rgba(12, 8, 15, 0.80) 40%, rgba(12, 8, 15, 0) 100%)",
          }}
        />
        
        {/* Gradient Overlay - Left fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(12, 8, 15, 0.90) 0%, rgba(12, 8, 15, 0) 50%)",
          }}
        />

        {/* Hero Content - Positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 pb-20">
          <div className="max-w-[1200px] mx-auto px-8">
            <div className="max-w-[896px] flex flex-col gap-4 pl-8">
              {/* Category & Date */}
              <div className="flex items-center gap-3">
                {/* Category Tag */}
                <div
                  className="px-3 py-1 rounded"
                  style={{
                    background: "rgba(217, 70, 239, 0.20)",
                    boxShadow: "0px 0px 20px rgba(217, 70, 239, 0.10), 0px 0px 10px rgba(217, 70, 239, 0.30)",
                    border: "1px solid #C99BFF",
                  }}
                >
                  <span
                    className="text-[#C99BFF]"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span
                    className="text-[#9CA3AF]"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    {post.date}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1>
                <span
                  className="block text-white"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "60px",
                    fontWeight: 700,
                    lineHeight: "60px",
                    textShadow: "0px 0px 15px rgba(201, 155, 255, 0.60)",
                  }}
                >
                  {post.title}
                </span>
                <span
                  className="block"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "60px",
                    fontWeight: 700,
                    lineHeight: "60px",
                    color: "#4E56B9",
                    textShadow: "0px 0px 15px rgba(201, 155, 255, 0.60)",
                  }}
                >
                  {post.titleHighlight}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1136px] mx-auto px-4" style={{ marginTop: '-8px' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            <div
              className="p-10 rounded-2xl"
              style={{
                background: "rgba(255, 0, 255, 0.05)",
                boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Breadcrumb */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <Link
                  href="/"
                  className="text-[#6B7280] hover:text-[#C99BFF] transition-colors"
                  style={{
                    fontFamily: "LEMON MILK, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22.75px",
                  }}
                >
                  Anasayfa
                </Link>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                  className="text-[#6B7280]"
                >
                  <path
                    d="M6 6L10 10L6 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Link
                  href="/duyurular"
                  className="text-[#6B7280] hover:text-[#C99BFF] transition-colors"
                  style={{
                    fontFamily: "LEMON MILK, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22.75px",
                  }}
                >
                  Duyurular
                </Link>
                <svg
                  width="16"
                  height="20"
                  viewBox="0 0 16 20"
                  fill="none"
                  className="text-[#6B7280]"
                >
                  <path
                    d="M6 6L10 10L6 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-[#C99BFF]"
                  style={{
                    fontFamily: "LEMON MILK, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22.75px",
                  }}
                >
                  Starfield V1.2
                </span>
              </div>

              {/* Meta Info */}
              <div
                className="flex flex-wrap gap-4 pb-6 mb-8"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.10)" }}
              >
                {/* Author */}
                <div className="flex-1 min-w-[140px]">
                  <div
                    className="text-[#6B7280] mb-1"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    Yazar
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-black font-bold text-xs"
                      style={{
                        background:
                          "linear-gradient(135deg, #4E56B9 0%, #C99BFF 100%)",
                        fontFamily: "Space Grotesk, sans-serif",
                      }}
                    >
                      A
                    </div>
                    <span
                      className="text-white"
                      style={{
                        fontFamily: "LEMON MILK, sans-serif",
                        fontSize: "14px",
                        lineHeight: "22.75px",
                      }}
                    >
                      {post.author}
                    </span>
                  </div>
                </div>

                {/* Version */}
                <div className="flex-1 min-w-[140px]">
                  <div
                    className="text-[#6B7280] mb-1"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    Versiyon
                  </div>
                  <span
                    className="text-[#C99BFF]"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    {post.version}
                  </span>
                </div>

                {/* Read Time */}
                <div className="flex-1 min-w-[140px]">
                  <div
                    className="text-[#6B7280] mb-1"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    Okuma
                  </div>
                  <span
                    className="text-[#D1D5DB]"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    {post.readTime}
                  </span>
                </div>

                {/* Platform */}
                <div className="flex-1 min-w-[140px]">
                  <div
                    className="text-[#6B7280] mb-1"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    Platform
                  </div>
                  <div className="flex items-center gap-2">
                    {/* PC/TV Icon */}
                    <Image
                      src="/icons/platformtv.svg"
                      alt="PC"
                      width={18}
                      height={18}
                    />
                    {/* Game/Console Icon */}
                    <Image
                      src="/icons/platformgame.svg"
                      alt="Console"
                      width={18}
                      height={18}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <p
                className="text-[#E5E7EB] mb-8"
                style={{
                  fontFamily: "Caviar Dreams, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: "22.75px",
                }}
              >
                {post.content}
              </p>

              {/* Changes Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{
                      background: "#C99BFF",
                      boxShadow:
                        "0px 0px 20px rgba(201, 155, 255, 0.10), 0px 0px 10px rgba(201, 155, 255, 0.30)",
                    }}
                  />
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    Neler Değişti?
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {post.changes.map((change, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg flex items-start gap-3"
                      style={{
                        background: "rgba(16, 34, 34, 0.50)",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {/* Check Icon */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="flex-shrink-0 mt-0.5"
                      >
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="#C99BFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span
                        className="text-[#D1D5DB]"
                        style={{
                          fontFamily: "Caviar Dreams, sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          lineHeight: "22.75px",
                        }}
                      >
                        {change.includes("Cyber-Sözlük") ? (
                          <>
                            Gezegen isimleri ve özel terimler için{" "}
                            <span className="text-[#C99BFF]">Cyber-Sözlük</span>{" "}
                            entegrasyonu yapıldı.
                          </>
                        ) : (
                          change
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Section */}
              <div className="mb-8">
                <span
                  className="text-white block mb-4"
                  style={{
                    fontFamily: "LEMON MILK, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22.75px",
                  }}
                >
                  Oynanış Videosu
                </span>
                <div
                  className="relative w-full rounded-xl overflow-hidden group cursor-pointer"
                  style={{
                    boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                  }}
                >
                  <img
                    src={post.videoThumbnail}
                    alt="Video Thumbnail"
                    className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center pl-1"
                      style={{
                        background: "rgba(13, 242, 242, 0.90)",
                        boxShadow:
                          "0px 0px 20px rgba(13, 242, 242, 0.10), 0px 0px 10px rgba(13, 242, 242, 0.30)",
                      }}
                    >
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 24 28"
                        fill="black"
                      >
                        <path d="M4 4L20 14L4 24V4Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshots Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{
                      background: "#D946EF",
                      boxShadow:
                        "0px 0px 20px rgba(217, 70, 239, 0.10), 0px 0px 10px rgba(217, 70, 239, 0.30)",
                    }}
                  />
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    Ekran Görüntüleri
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {post.screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden"
                      style={{
                        border: "1px solid rgba(255, 255, 255, 0.10)",
                      }}
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-auto object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Box */}
              <div
                className="p-6 rounded-lg mb-8"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255, 0, 255, 0.30) 0%, rgba(255, 0, 255, 0.10) 100%)",
                  borderLeft: "4px solid rgba(255, 0, 255, 0.10)",
                  borderTopRightRadius: "8px",
                  borderBottomRightRadius: "8px",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {/* Info Icon */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#C99BFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16V12M12 8H12.01"
                      stroke="#C99BFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="text-[#C99BFF]"
                    style={{
                      fontFamily: "LEMON MILK, sans-serif",
                      fontSize: "14px",
                      lineHeight: "22.75px",
                    }}
                  >
                    Not
                  </span>
                </div>
                <p
                  className="text-white"
                  style={{
                    fontFamily: "Caviar Dreams, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "22.75px",
                  }}
                >
                  {post.note}
                </p>
              </div>

              {/* CTA Box */}
              <div
                className="relative p-8 rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255, 0, 255, 0.10)",
                  border: "1px solid rgba(255, 255, 255, 0.20)",
                }}
              >
                {/* Decorative blur */}
                <div
                  className="absolute -top-24 -right-10 w-48 h-48 rounded-full"
                  style={{
                    background: "rgba(201, 155, 255, 0.20)",
                    filter: "blur(30px)",
                  }}
                />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3
                      className="text-white mb-1"
                      style={{
                        fontFamily: "LEMON MILK, sans-serif",
                        fontSize: "14px",
                        lineHeight: "22.75px",
                      }}
                    >
                      Kuruluma Hazır mısın?
                    </h3>
                    <p
                      className="text-[#9CA3AF]"
                      style={{
                        fontFamily: "Caviar Dreams, sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        lineHeight: "22.75px",
                      }}
                    >
                      Üyeliğinle giriş yap ve çeviriyi hemen indir.
                    </p>
                  </div>
                  <button
                    className="flex items-center gap-2 px-8 py-2.5 rounded-lg transition-all hover:opacity-90"
                    style={{
                      background: "#3B1F45",
                      boxShadow:
                        "0px 0px 20px rgba(201, 155, 255, 0.10), 0px 0px 10px rgba(201, 155, 255, 0.30)",
                    }}
                  >
                    {/* Download Icon */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3"
                        stroke="#C99BFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className="text-[#C99BFF]"
                      style={{
                        fontFamily: "LEMON MILK, sans-serif",
                        fontSize: "14px",
                        lineHeight: "22.75px",
                      }}
                    >
                      Çeviriyi İndir
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
            {/* Other Announcements */}
            <div
              className="p-5"
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(201, 155, 255, 0.30)",
                background: "rgba(255, 0, 255, 0.10)",
                boxShadow: "0 0 16px 0 #000",
              }}
            >
              <div
                className="flex items-center justify-between pb-2 mb-4"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <span
                  className="text-white"
                  style={{
                    fontFamily: "LEMON MILK, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22.75px",
                  }}
                >
                  Diğer Duyurular
                </span>
                <Link
                  href="/duyurular"
                  className="text-[#C99BFF] hover:opacity-80 transition-opacity"
                  style={{
                    fontFamily: "LEMON MILK, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22.75px",
                  }}
                >
                  Tümünü Gör
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {otherAnnouncements.map((item, index) => (
                  <Link
                    key={index}
                    href={`/duyurular/${item.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4
                        className="text-[#E5E7EB] group-hover:text-[#C99BFF] transition-colors"
                        style={{
                          fontFamily: "Caviar Dreams, sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          lineHeight: "22.75px",
                        }}
                      >
                        {item.title}
                      </h4>
                      <span
                        className="text-[#6B7280]"
                        style={{
                          fontFamily: "Caviar Dreams, sans-serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          lineHeight: "22.75px",
                        }}
                      >
                        {item.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div
              className="p-5"
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(201, 155, 255, 0.30)",
                background: "rgba(255, 0, 255, 0.10)",
                boxShadow: "0 0 16px 0 #000",
              }}
            >
              <div
                className="text-center mb-4"
                style={{
                  fontFamily: "LEMON MILK, sans-serif",
                  fontSize: "14px",
                  lineHeight: "22.75px",
                  color: "white",
                }}
              >
                Bu Haberi Paylaş
              </div>
              <div className="flex justify-center gap-3">
                {/* Twitter */}
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(255, 0, 255, 0.10)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                {/* Discord */}
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(255, 0, 255, 0.10)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </button>
                {/* Copy Link */}
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(255, 0, 255, 0.10)" }}
                >
                  <svg
                    width="14"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Newsletter Section */}
            <div
              className="p-5"
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(201, 155, 255, 0.30)",
                background: "rgba(255, 0, 255, 0.10)",
                boxShadow: "0 0 16px 0 #000",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {/* Mail Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="#C99BFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 6L12 13L2 6"
                    stroke="#C99BFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="text-[#C99BFF]"
                  style={{
                    fontFamily: "LEMON MILK, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22.75px",
                  }}
                >
                  HABERDAR OL
                </span>
              </div>
              <p
                className="text-[#9CA3AF] mb-4 whitespace-nowrap"
                style={{
                  fontFamily: "Caviar Dreams, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: "22.75px",
                }}
              >
                Yeni çeviriler yayınlandığında ilk sen öğren.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="E-posta adresi"
                  className="flex-1 px-4 py-3 text-white placeholder-[#4B5563] outline-none"
                  style={{
                    fontFamily: "Caviar Dreams, sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    borderRadius: "4px",
                    background: "#050B0B",
                  }}
                />
                <button
                  className="flex items-center justify-center transition-all hover:opacity-90 flex-shrink-0"
                  style={{ 
                    background: "#C99BFF",
                    borderRadius: "4px",
                    padding: "12px",
                  }}
                >
                  <Image
                    src="/icons/haberdarol.svg"
                    alt="Gönder"
                    width={16}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer before footer */}
      <div className="h-16" />

      <Footer />
    </main>
  );
}
