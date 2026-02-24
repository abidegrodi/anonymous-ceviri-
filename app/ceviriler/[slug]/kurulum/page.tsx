"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getGameDetail, type GameDetail } from "@/lib/services/games";

export default function KurulumRehberiPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.slug);

  const [game, setGame] = useState<GameDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gameId || isNaN(gameId)) {
      router.push('/turkce-ceviriler');
      return;
    }
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const data = await getGameDetail(gameId);
        setGame(data);
      } catch (error: any) {
        if (error?.status === 404) {
          router.push('/turkce-ceviriler');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchGame();
  }, [gameId, router]);

  const tabs = [
    { id: "install", label: "KURULUM REHBERİ", href: `/ceviriler/${gameId}/kurulum`, active: true },
    { id: "notes", label: "ÇEVİRİ NOTLARI", href: `/ceviriler/${gameId}`, active: false },
    { id: "screenshots", label: "EKRAN GÖRÜNTÜLERİ", href: `/ceviriler/${gameId}`, active: false },
    { id: "discussion", label: "TARTIŞMA", href: `/ceviriler/${gameId}`, active: false },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#12110E]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
            <span className="text-white/50 text-sm" style={{ fontFamily: "Inter" }}>Oyun bilgileri yükleniyor...</span>
          </div>
        </div>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="min-h-screen bg-[#12110E]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-white/30 text-6xl">🎮</span>
            <h3 className="text-white/70 text-lg font-bold">Oyun bulunamadı</h3>
            <Link href="/turkce-ceviriler" className="text-[#C99BFF] hover:underline">Tüm çevirilere dön</Link>
          </div>
        </div>
      </main>
    );
  }

  const mainPhoto = game.photos?.find(p => p.isMain) || game.photos?.[0];

  return (
    <main className="min-h-screen bg-[#12110E]">
      <Header />

      {/* Hero Background */}
      <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(0deg, #12110E 0%, #12110E 100%)" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: `url(${game.backgroundURL || '/assets/oyundetayhero.png'})`, backgroundSize: "cover", backgroundPosition: "center top", filter: "blur(2px)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, #12110E 0%, rgba(18, 17, 14, 0.80) 50%, rgba(18, 17, 14, 0.40) 100%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(180deg, rgba(242, 166, 13, 0.03) 3%, rgba(242, 166, 13, 0) 3%), linear-gradient(90deg, rgba(242, 166, 13, 0.03) 3%, rgba(242, 166, 13, 0) 3%)`, backgroundSize: "40px 40px" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-[80px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8 flex-wrap">
            <Link href="/" className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px" }}>ANASAYFA</Link>
            <span className="text-white/30">/</span>
            <Link href="/turkce-ceviriler" className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px" }}>ÇEVİRİLER</Link>
            <span className="text-white/30">/</span>
            <Link href={`/ceviriler/${gameId}`} className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px" }}>{game.name.toUpperCase()}</Link>
            <span className="text-white/30">/</span>
            <span className="uppercase font-medium" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px", color: "#C99BFF" }}>KURULUM REHBERİ</span>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6" style={{ maxWidth: "800px" }}>
              {/* Game Info Card */}
              <div className="relative p-8 md:p-12 rounded-[32px] overflow-hidden" style={{ background: "rgba(24, 22, 17, 0.65)", boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)", outline: "1px solid rgba(255, 255, 255, 0.08)", backdropFilter: "blur(8px)" }}>
                <div className="absolute -top-20 -right-10 w-64 h-64 rounded-full" style={{ background: "rgba(255, 94, 0, 0.20)", filter: "blur(50px)" }} />
                <div className="relative z-10 flex flex-col gap-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex flex-col gap-5 flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2">
                        {game.categories?.map((cat, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(255, 255, 255, 0.10)", outline: "1px solid rgba(255, 255, 255, 0.05)", color: "rgba(255, 255, 255, 0.90)", fontFamily: "Space Grotesk, sans-serif" }}>{cat.name}</span>
                        ))}
                      </div>
                      <h1
                        className="uppercase whitespace-nowrap"
                        style={{
                          textShadow: "0 0 10px rgba(242, 166, 13, 0.50)",
                          fontFamily: '"Trajan Pro", serif',
                          fontSize: "clamp(24px, 3.2vw, 44px)",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "1.15",
                          letterSpacing: "-1.2px",
                          textTransform: "uppercase",
                          color: "rgba(255, 255, 255, 0.90)",
                        }}
                      >
                        {game.name}
                      </h1>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 pt-1">
                      <span className="uppercase text-right" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "13px", lineHeight: "18px", letterSpacing: "1.4px", color: "#C99BFF" }}>Sürüm {game.compatibleVersions || 'Tüm Sürümlerle Uyumludur'}</span>
                    </div>
                  </div>

                  {/* Translation Progress */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image src="/icons/ceviridurumu.svg" alt="Çeviri Durumu" width={24} height={28} className="shrink-0" />
                        <span className="uppercase" style={{ fontFamily: "Trajan Pro, serif", fontSize: "18px", fontWeight: 700, lineHeight: "28px", color: "rgba(255, 255, 255, 0.90)" }}>Çeviri Durumu</span>
                      </div>
                      <span style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: "32px", color: "#C99BFF" }}>{game.completeRate}%</span>
                    </div>
                    <div className="w-full h-4 rounded-full p-0.5" style={{ background: "rgba(0, 0, 0, 0.40)", outline: "1px solid rgba(255, 255, 255, 0.10)" }}>
                      <div className="h-full rounded-full relative overflow-hidden" style={{ width: `${game.completeRate}%`, background: "#4F57BB", boxShadow: "0px 0px 15px rgba(242, 166, 13, 0.60)" }}>
                        <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 0px, rgba(255, 255, 255, 0.15) 10px, transparent 10px, transparent 20px)` }} />
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="flex gap-4 pt-1">
                    <button className="flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-full transition-all hover:opacity-90" style={{ background: "#C99BFF" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="#FAF8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17" stroke="#FAF8FF" strokeWidth="2" strokeLinecap="round" /></svg>
                      <span className="uppercase" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "18px", fontWeight: 700, lineHeight: "28px", letterSpacing: "1.8px", color: "#FAF8FF" }}>Türkçe Çeviriyi İndir</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="pt-4">
                <div className="flex flex-wrap gap-4 pb-4 mb-6" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.10)" }}>
                  {tabs.map((tab) => (
                    <Link key={tab.id} href={tab.href} className={`px-6 py-2 rounded-full transition-all ${tab.active ? "bg-white/10" : "hover:bg-white/5"}`} style={{ outline: tab.active ? "1px solid rgba(242, 166, 13, 0.50)" : "none" }}>
                      <span className="uppercase" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "14px", fontWeight: tab.active ? 700 : 400, lineHeight: "20px", letterSpacing: "0.35px", color: tab.active ? "rgba(255, 255, 255, 0.90)" : "rgba(255, 255, 255, 0.60)" }}>{tab.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Installation Guide Content */}
                <div className="flex flex-col gap-6">
                  {/* Hero Banner */}
                  <div
                    className="relative p-8 rounded-[32px] overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(79, 87, 187, 0.30) 0%, rgba(24, 22, 17, 0.65) 100%)",
                      boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)",
                      outline: "1px solid rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span
                      className="inline-block px-3 py-1 rounded-full mb-4"
                      style={{
                        background: "rgba(79, 87, 187, 0.40)",
                        outline: "1px solid rgba(201, 155, 255, 0.30)",
                        fontFamily: "LEMON MILK, sans-serif",
                        fontSize: "10px",
                        fontWeight: 400,
                        lineHeight: "16px",
                        letterSpacing: "1px",
                        color: "#C99BFF",
                      }}
                    >
                      {game.compatibleVersions ? `${game.compatibleVersions} GÜNCEL` : 'GÜNCEL'}
                    </span>
                    <h2
                      className="uppercase mb-2"
                      style={{
                        fontFamily: "Trajan Pro, serif",
                        fontSize: "clamp(24px, 5vw, 36px)",
                        fontWeight: 700,
                        lineHeight: "1.2",
                        color: "rgba(255, 255, 255, 0.90)",
                        textShadow: "0px 0px 10px rgba(201, 155, 255, 0.50)",
                      }}
                    >
                      {game.name} Türkçe Çeviri
                    </h2>
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: "LEMON MILK, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "rgba(255, 255, 255, 0.60)",
                      }}
                    >
                      Kurulum Rehberi
                    </p>
                  </div>

                  {/* ADIM 1: DOSYALARA ERİŞİM */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.10)" }} />
                      <span className="uppercase px-4" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "1.4px", color: "rgba(255, 255, 255, 0.60)" }}>
                        Adım 1: Dosyalara Erişim
                      </span>
                      <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.10)" }} />
                    </div>

                    {/* Oyun Klasörünü Bulun */}
                    <div
                      className="p-6 rounded-[32px]"
                      style={{
                        background: "rgba(24, 22, 17, 0.65)",
                        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)",
                        outline: "1px solid rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-16 h-16 flex items-center justify-center rounded-2xl shrink-0"
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            outline: "1px solid rgba(255, 255, 255, 0.10)",
                          }}
                        >
                          <Image src="/icons/oyunklasoru.svg" alt="Oyun Klasörü" width={32} height={32} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3
                            className="uppercase"
                            style={{
                              fontFamily: "LEMON MILK, sans-serif",
                              fontSize: "24px",
                              fontWeight: 400,
                              lineHeight: "32px",
                              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(121, 93, 153, 0.90) 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            Oyun Klasörünü Bulun
                          </h3>
                          <p
                            style={{
                              fontFamily: "Caviar Dreams, sans-serif",
                              fontSize: "14px",
                              fontWeight: 400,
                              lineHeight: "22px",
                              color: "rgba(255, 255, 255, 0.60)",
                            }}
                          >
                            Çeviri kurulumunu gerçekleştirmek için öncelikle oyunun kurulu olduğu ana dizini açmanız gerekmektedir. Steam veya Epic Games üzerinden &quot;Yerel Dosyalara Göz At&quot; seçeneğİnİ kullanabilirsiniz.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Yedekleme İşlemi */}
                    <div
                      className="p-6 rounded-[32px]"
                      style={{
                        background: "rgba(24, 22, 17, 0.65)",
                        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)",
                        outline: "1px solid rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Image src="/icons/yedeklemeislemi.svg" alt="Yedekleme" width={24} height={24} />
                        <h3
                          className="uppercase"
                          style={{
                            fontFamily: "LEMON MILK, sans-serif",
                            fontSize: "24px",
                            fontWeight: 400,
                            lineHeight: "32px",
                            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(121, 93, 153, 0.90) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          Yedekleme İşlemi
                        </h3>
                      </div>

                      <div
                        className="p-4 rounded-2xl"
                        style={{
                          background: "rgba(255, 0, 255, 0.10)",
                          outline: "1px solid rgba(255, 0, 255, 0.10)",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                            <path d="M12 4L2 20H22L12 4Z" stroke="#C99BFF" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M12 10V14" stroke="#C99BFF" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="17" r="1" fill="#C99BFF" />
                          </svg>
                          <div className="flex flex-col gap-1">
                            <span
                              className="uppercase"
                              style={{
                                fontFamily: "LEMON MILK, sans-serif",
                                fontSize: "12px",
                                fontWeight: 700,
                                lineHeight: "16px",
                                color: "#C99BFF",
                              }}
                            >
                              Dikkat: Orijinal Dosyalarınızı Yedeklemeyi Unutmayın!
                            </span>
                            <p
                              style={{
                                fontFamily: "Caviar Dreams, sans-serif",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "18px",
                                color: "rgba(255, 255, 255, 0.70)",
                              }}
                            >
                              Kurulum sırasında oluşabilecek herhangi bir aksaklıkta oyununuzu yeniden indirmek zorunda kalmamak için{" "}
                              <span style={{ color: "#C99BFF", textDecoration: "underline" }}>exec</span>{" "}
                              klasörünü masaüstüne kopyalayın.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ADIM 2: KURULUM */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.10)" }} />
                      <span className="uppercase px-4" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "1.4px", color: "rgba(255, 255, 255, 0.60)" }}>
                        Adım 2: Kurulum
                      </span>
                      <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.10)" }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Setup Instructions */}
                      <div
                        className="p-6 rounded-[32px]"
                        style={{
                          background: "rgba(24, 22, 17, 0.65)",
                          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)",
                          outline: "1px solid rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Image src="/icons/setupdosyasi.svg" alt="Setup" width={20} height={20} />
                          <span
                            className="uppercase"
                            style={{
                              fontFamily: "LEMON MILK, sans-serif",
                              fontSize: "10px",
                              fontWeight: 400,
                              lineHeight: "16px",
                              letterSpacing: "1px",
                              color: "rgba(255, 255, 255, 0.50)",
                            }}
                          >
                            Yönetici İzni Gerekli
                          </span>
                        </div>

                        <h3
                          className="uppercase mb-3"
                          style={{
                            fontFamily: "LEMON MILK, sans-serif",
                            fontSize: "24px",
                            fontWeight: 400,
                            lineHeight: "32px",
                            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(121, 93, 153, 0.90) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          Setup Dosyasını Çalıştırın
                        </h3>

                        <p
                          className="mb-6"
                          style={{
                            fontFamily: "Caviar Dreams, sans-serif",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "18px",
                            color: "rgba(255, 255, 255, 0.60)",
                          }}
                        >
                          İndirdiğiniz ANONYMOUS_GOW_TR_V1.EXE dosyasına sağ tıklayın ve &quot;Yönetici olarak çalıştır&quot; seçeneğini seçin. Kurulum sihirbazı otomatik olarak oyun yolunu bulacaktır.
                        </p>

                        <button
                          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full transition-all hover:opacity-90"
                          style={{ background: "#C99BFF" }}
                        >
                          <span
                            className="uppercase"
                            style={{
                              fontFamily: "LEMON MILK, sans-serif",
                              fontSize: "14px",
                              fontWeight: 700,
                              lineHeight: "20px",
                              letterSpacing: "0.5px",
                              color: "#FAF8FF",
                            }}
                          >
                            Kurulumu Tamamla
                          </span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#FAF8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>

                      {/* Progress Card */}
                      <div
                        className="p-6 rounded-[32px] flex flex-col items-center justify-center"
                        style={{
                          background: "rgba(24, 22, 17, 0.65)",
                          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)",
                          outline: "1px solid rgba(255, 255, 255, 0.08)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <span
                          className="mb-4 uppercase"
                          style={{
                            fontFamily: "LEMON MILK, sans-serif",
                            fontSize: "10px",
                            fontWeight: 400,
                            lineHeight: "16px",
                            letterSpacing: "1px",
                            color: "rgba(255, 255, 255, 0.50)",
                          }}
                        >
                          ANONYMOUS INSTALLER.EXE
                        </span>

                        <div
                          className="w-full max-w-[200px] p-4 rounded-2xl mb-4"
                          style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            outline: "1px solid rgba(255, 255, 255, 0.10)",
                          }}
                        >
                          <div className="flex justify-end gap-1 mb-3">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>

                          <div className="flex justify-center mb-3">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                              <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="#C99BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17" stroke="#C99BFF" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>

                          <div className="w-full h-2 rounded-full" style={{ background: "rgba(255, 255, 255, 0.10)" }}>
                            <div className="h-full rounded-full" style={{ width: "68%", background: "linear-gradient(90deg, #C99BFF 0%, #4F57BB 100%)" }} />
                          </div>
                        </div>

                        <span
                          style={{
                            fontFamily: "LEMON MILK, sans-serif",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "16px",
                            color: "rgba(255, 255, 255, 0.50)",
                          }}
                        >
                          YÜKLENİYOR... %68
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ADIM 3: OYNA */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.10)" }} />
                      <span className="uppercase px-4" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "1.4px", color: "rgba(255, 255, 255, 0.60)" }}>
                        Adım 3: Oyna
                      </span>
                      <div className="h-px flex-1" style={{ background: "rgba(255, 255, 255, 0.10)" }} />
                    </div>

                    <div
                      className="p-6 rounded-[32px] flex items-center justify-center gap-4"
                      style={{
                        background: "rgba(24, 22, 17, 0.65)",
                        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)",
                        outline: "1px solid rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 3L19 12L5 21V3Z" stroke="#C99BFF" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                      <span
                        className="uppercase"
                        style={{
                          fontFamily: "LEMON MILK, sans-serif",
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "20px",
                          letterSpacing: "0.5px",
                          color: "rgba(255, 255, 255, 0.70)",
                        }}
                      >
                        Kurulum tamamlandığında oyunu başlatabilirsiniz. İyi Oyunlar!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
              {/* Game Cover Card */}
              <div className="relative rounded-[32px] overflow-hidden" style={{ boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)", outline: "1px solid rgba(255, 255, 255, 0.10)" }}>
                <img src={mainPhoto?.photoUrl || "https://placehold.co/382x574"} alt={game.name} className="w-full aspect-[2/3] object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0) 100%)" }} />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                  {game.metacritic && (
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((star) => (
                        <Image key={star} src="/icons/yildiz.svg" alt="Star" width={20} height={24} />
                      ))}
                      <div className="relative">
                        <Image src="/icons/yildiz.svg" alt="Star" width={20} height={24} className="opacity-50" />
                      </div>
                      <span className="pl-1" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "16px", fontWeight: 700, lineHeight: "24px", color: "rgba(255, 255, 255, 0.90)" }}>
                        {game.metacritic}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements Card */}
              <div className="p-6 rounded-[32px]" style={{ background: "rgba(24, 22, 17, 0.65)", boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)", outline: "1px solid rgba(255, 255, 255, 0.08)", backdropFilter: "blur(8px)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/icons/gereksinimler.svg" alt="Gereksinimler" width={24} height={28} className="shrink-0" />
                  <span className="uppercase" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "18px", fontWeight: 400, lineHeight: "28px", color: "rgba(255, 255, 255, 0.90)" }}>
                    Gereksinimler
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "İşletim Sistemi", value: "Windows 10/11" },
                    { label: "İşlemci", value: "Intel Core i5-8400" },
                    { label: "Bellek", value: "12 GB RAM" },
                    { label: "Ekran Kartı", value: "GTX 1060 3GB" },
                    { label: "Depolama", value: "60 GB" },
                  ].map((req, idx, arr) => (
                    <div key={req.label} className="flex justify-between items-center pb-2" style={{ borderBottom: idx < arr.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none" }}>
                      <span style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: "20px", color: "rgba(255, 255, 255, 0.50)" }}>{req.label}</span>
                      <span style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: "20px", color: "rgba(255, 255, 255, 0.90)", textAlign: "right" }}>{req.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
