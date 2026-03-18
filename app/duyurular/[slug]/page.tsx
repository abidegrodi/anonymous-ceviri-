"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { fetchDuyuruBySlug, fetchDuyurular, mapStrapiDuyuruToBlogPost, mapStrapiDuyuruToAnnouncement } from "@/lib/strapi";

// Blog verisi tipi (detay sayfası)
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

export default function BlogDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [otherAnnouncements, setOtherAnnouncements] = useState<Array<{ slug: string; title: string; date: string; image: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    Promise.all([
      fetchDuyuruBySlug(slug),
      fetchDuyurular(),
    ])
      .then(([duyuru, list]) => {
        if (cancelled) return;
        if (duyuru) {
          setPost(mapStrapiDuyuruToBlogPost(duyuru));
          const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
          const others = list
            .filter((d) => d.slug !== slug)
            .slice(0, 3)
            .map((d) => {
              const a = mapStrapiDuyuruToAnnouncement(d);
              return { slug: a.slug, title: a.title + (a.subtitle ? " - " + a.subtitle : ""), date: a.date, image: a.image };
            });
          setOtherAnnouncements(others);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading || !post) {
    return (
      <main className="min-h-screen bg-[#0C080F]">
        <Header />
        <div className="pt-[100px] pb-16 px-4 text-center">
          {loading && <p className="text-white/60" style={{ fontFamily: "Caviar Dreams" }}>Yükleniyor…</p>}
          {!loading && notFound && (
            <>
              <p className="text-white/60 mb-4" style={{ fontFamily: "Caviar Dreams" }}>Bu duyuru bulunamadı.</p>
              <Link href="/duyurular" className="text-[#C99BFF] hover:underline" style={{ fontFamily: "Caviar Dreams" }}>← Duyurulara dön</Link>
            </>
          )}
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden text-white">
      <Header />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(201,155,255,0.04) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-[1100px] mx-auto pt-[140px] pb-24 px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <h1
            className="font-bold uppercase mb-4"
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontFamily: "Trajan Pro, serif",
              lineHeight: "1.1",
              letterSpacing: "-1px",
              background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {post.title}
          </h1>
          {post.titleHighlight && (
            <h2
              className="font-bold uppercase mb-4"
              style={{
                fontSize: "clamp(22px, 4vw, 36px)",
                fontFamily: "Trajan Pro, serif",
                lineHeight: "1.1",
                color: "#C99BFF",
              }}
            >
              {post.titleHighlight}
            </h2>
          )}
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="font-caviar text-xs text-white/30">{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span className="font-caviar text-xs text-white/30">{post.readTime}</span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span className="font-caviar text-xs text-[#C99BFF]/60">{post.category}</span>
          </div>
        </div>

        {/* Hero Image - 16:9 */}
        <div className="rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="relative w-full" style={{ aspectRatio: "1920 / 1080" }}>
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Meta Info Cards */}
        {(post.author || post.version || post.readTime || post.platforms.length > 0) && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {post.author && (
              <div className="rounded-2xl p-5 flex items-center gap-3" style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.12)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <span className="font-caviar text-[10px] font-bold uppercase tracking-[1.5px] text-white/25 block">Yazar</span>
                  <span className="font-caviar text-sm text-white/70">{post.author}</span>
                </div>
              </div>
            )}
            {post.version && (
              <div className="rounded-2xl p-5 flex items-center gap-3" style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.12)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <span className="font-caviar text-[10px] font-bold uppercase tracking-[1.5px] text-white/25 block">Versiyon</span>
                  <span className="font-caviar text-sm text-[#C99BFF]">{post.version}</span>
                </div>
              </div>
            )}
            {post.readTime && (
              <div className="rounded-2xl p-5 flex items-center gap-3" style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.12)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <span className="font-caviar text-[10px] font-bold uppercase tracking-[1.5px] text-white/25 block">Okuma</span>
                  <span className="font-caviar text-sm text-white/70">{post.readTime}</span>
                </div>
              </div>
            )}
            {post.platforms.length > 0 && (
              <div className="rounded-2xl p-5 flex items-center gap-3" style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.12)" }}>
                  <Image src="/icons/platformtv.svg" alt="Platform" width={14} height={14} />
                </div>
                <div>
                  <span className="font-caviar text-[10px] font-bold uppercase tracking-[1.5px] text-white/25 block">Platform</span>
                  <div className="flex items-center gap-2">
                    <Image src="/icons/platformtv.svg" alt="PC" width={16} height={16} />
                    <Image src="/icons/platformgame.svg" alt="Console" width={16} height={16} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {post.content && (
          <div
            className="rounded-2xl p-6 sm:p-8 md:p-10 mb-8"
            style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="font-caviar text-sm text-white/60 leading-relaxed">
              {post.content}
            </p>
          </div>
        )}

        {/* Changes Section */}
        {post.changes.length > 0 && (
          <div
            className="rounded-2xl p-6 sm:p-8 md:p-10 mb-8"
            style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #C99BFF 0%, rgba(201,155,255,0.2) 100%)" }} />
              <span className="font-caviar text-xs font-bold uppercase tracking-[1.5px] text-white/30">Neler Değişti?</span>
            </div>

            <div className="flex flex-col gap-3">
              {post.changes.map((change, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#C99BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-caviar text-sm text-white/50 leading-relaxed">
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
        )}

        {/* Video Section */}
        {post.videoThumbnail && (
          <div
            className="rounded-2xl p-6 sm:p-8 md:p-10 mb-8"
            style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #C99BFF 0%, rgba(201,155,255,0.2) 100%)" }} />
              <span className="font-caviar text-xs font-bold uppercase tracking-[1.5px] text-white/30">Oynanış Videosu</span>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden group cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <img
                src={post.videoThumbnail}
                alt="Video Thumbnail"
                className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center pl-0.5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" style={{ background: "rgba(201,155,255,0.9)" }}>
                  <svg width="20" height="22" viewBox="0 0 24 28" fill="black"><path d="M4 4L20 14L4 24V4Z" /></svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screenshots Section */}
        {post.screenshots.length > 0 && (
          <div
            className="rounded-2xl p-6 sm:p-8 md:p-10 mb-8"
            style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #C99BFF 0%, rgba(201,155,255,0.2) 100%)" }} />
              <span className="font-caviar text-xs font-bold uppercase tracking-[1.5px] text-white/30">Ekran Görüntüleri</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.screenshots.map((screenshot, index) => (
                <div key={index} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note Box */}
        {post.note && (
          <div
            className="rounded-2xl p-6 sm:p-8 mb-8 flex items-start gap-3"
            style={{ background: "rgba(201,155,255,0.05)", border: "1px solid rgba(201,155,255,0.12)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#C99BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 16V12M12 8H12.01" stroke="#C99BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-caviar text-sm text-white/50 leading-relaxed">{post.note}</p>
          </div>
        )}

        {/* CTA Box */}
        <div
          className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
          style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h3 className="font-trajan text-sm text-white/80 mb-1">Kuruluma Hazır mısın?</h3>
            <p className="font-caviar text-xs text-white/30">Üyeliğinle giriş yap ve çeviriyi hemen indir.</p>
          </div>
          <Link
            href="/kayit-ol"
            className="flex items-center gap-2 h-11 px-8 rounded-xl font-caviar text-sm font-semibold transition-all duration-200 shrink-0 no-underline"
            style={{ background: "linear-gradient(135deg, #C99BFF 0%, #7B5EA7 100%)", color: "#000" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Çeviriyi İndir
          </Link>
        </div>

        {/* Back to announcements */}
        <div className="mb-8">
          <Link
            href="/duyurular"
            className="rounded-2xl p-6 flex items-center gap-4 group hover:border-[#C99BFF]/20 transition-all duration-200 no-underline"
            style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.12)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div className="flex-1">
              <span className="font-caviar text-[10px] font-bold uppercase tracking-[1.5px] text-white/25 block">Geri Dön</span>
              <span className="font-caviar text-sm text-white/70">Tüm Duyurular</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,155,255,0.3)" strokeWidth="2" className="shrink-0 group-hover:stroke-[#C99BFF]/60 transition-colors">
              <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Other Announcements */}
        {otherAnnouncements.length > 0 && (
          <div
            className="rounded-2xl p-6 sm:p-8 md:p-10"
            style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #C99BFF 0%, rgba(201,155,255,0.2) 100%)" }} />
              <span className="font-caviar text-xs font-bold uppercase tracking-[1.5px] text-white/30">Diğer Duyurular</span>
            </div>
            <div className="flex flex-col gap-3">
              {otherAnnouncements.map((item, index) => (
                <Link
                  key={index}
                  href={`/duyurular/${item.slug}`}
                  className="flex items-center gap-4 p-3 rounded-xl group hover:bg-white/[0.02] transition-all duration-200"
                >
                  <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-trajan text-sm text-white/60 group-hover:text-[#C99BFF] transition-colors truncate">{item.title}</h4>
                    <span className="font-caviar text-[11px] text-white/20">{item.date}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,155,255,0.2)" strokeWidth="2" className="shrink-0 group-hover:stroke-[#C99BFF]/50 transition-colors">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
