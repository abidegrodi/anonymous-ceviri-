"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Platform = "steam" | "epic" | "gog";

const platforms: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: "steam", label: "Steam", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-9.96 9.04l5.35 2.21a2.83 2.83 0 011.6-.49h.05l2.39-3.46v-.05a3.78 3.78 0 113.78 3.78h-.08l-3.4 2.43a2.85 2.85 0 01-5.66.49L.96 13.36A10 10 0 1012 2z" /></svg> },
  { id: "epic", label: "Epic Games", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.537 0C2.165 0 1.66.506 1.66 1.879V18.12c0 1.373.505 1.879 1.877 1.879h4.635V24l4.015-4.001h4.276c1.372 0 1.877-.506 1.877-1.879V1.879C18.34.506 17.835 0 16.463 0H3.537z" /></svg> },
  { id: "gog", label: "GOG", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg> },
];

const steps = [
  {
    number: "01",
    title: "Çeviri Dosyasını İndirin",
    description: "İlgili oyunun detay sayfasından \"Türkçe Çeviriyi İndir\" butonuna tıklayarak çeviri dosyasını bilgisayarınıza indirin.",
    tip: null,
  },
  {
    number: "02",
    title: "Oyun Klasörünü Bulun",
    description: "Oyunun kurulu olduğu ana dizini açmanız gerekmektedir.",
    tip: "Steam için: Kütüphane → Oyuna sağ tıklayın → Yönet → Yerel Dosyalara Göz At",
  },
  {
    number: "03",
    title: "Orijinal Dosyaları Yedekleyin",
    description: "Kurulum sırasında oluşabilecek herhangi bir aksaklıkta oyununuzu yeniden indirmek zorunda kalmamak için ilgili klasörü masaüstüne kopyalayın.",
    tip: "Genellikle yedeklemeniz gereken klasör: \"localization\" veya \"data\" klasörüdür.",
  },
  {
    number: "04",
    title: "Kurulum Dosyasını Çalıştırın",
    description: "İndirdiğiniz .EXE dosyasına sağ tıklayın ve \"Yönetici olarak çalıştır\" seçeneğini seçin. Kurulum sihirbazı otomatik olarak oyun yolunu bulacaktır.",
    tip: null,
  },
  {
    number: "05",
    title: "Oyunu Başlatın",
    description: "Kurulum tamamlandığında oyunu normal şekilde başlatın. Dil ayarlarından Türkçe seçili olduğundan emin olun. İyi oyunlar!",
    tip: null,
  },
];

const faqs = [
  { q: "Çeviri kurulumu oyunumu bozar mı?", a: "Hayır, orijinal dosyaları yedeklediğiniz sürece istediğiniz zaman geri dönebilirsiniz. Çevirilerimiz sadece dil dosyalarını değiştirir." },
  { q: "Setup dosyası virüs uyarısı veriyor, güvenli mi?", a: "Evet, güvenlidir. Antivirüs yazılımları bazen .EXE dosyalarını yanlış pozitif olarak işaretleyebilir. Geçici olarak antivirüsü devre dışı bırakabilirsiniz." },
  { q: "Oyun güncellendikten sonra çeviri bozuluyor mu?", a: "Bazı güncellemeler çeviri dosyalarını sıfırlayabilir. Bu durumda çeviriyi tekrar kurmanız yeterlidir. Bildirim almak için oyun sayfasından abonelik butonunu kullanın." },
  { q: "Her oyun için aynı kurulum yöntemi mi geçerli?", a: "Büyük çoğunluğu için evet. İstisnai oyunlar için ilgili oyunun detay sayfasında özel kurulum talimatları yer almaktadır." },
];

export default function KurulumRehberiPage() {
  const router = useRouter();
  const [activePlatform, setActivePlatform] = useState<Platform>("steam");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#12110E]">
      <Header />

      <div className="relative z-10 pt-[80px]">
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-sm mb-8 flex-wrap">
            <button onClick={() => router.back()} className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase flex items-center gap-2" style={{ fontFamily: "Caviar Dreams" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60"><path d="M19 12H5m0 0l7 7m-7-7l7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              GERİ DÖN
            </button>
            <Image src="/icons/arrowr.svg" alt=">" width={20} height={20} className="opacity-50" />
            <span className="font-medium uppercase" style={{ fontFamily: "Caviar Dreams", background: "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(121,93,153,0.90) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              KURULUM REHBERİ
            </span>
          </div>

          {/* Title */}
          <div className="mb-10">
            <h1 className="mb-3 uppercase" style={{ fontFamily: "Trajan Pro, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, lineHeight: "1.1" }}>
              <span className="text-[#C99BFF]">| </span>
              <span style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(121,93,153,0.90) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                ÇEVİRİ KURULUM REHBERİ
              </span>
            </h1>
            <p style={{ fontFamily: "Caviar Dreams", fontSize: "16px", lineHeight: "26px", color: "rgba(255,255,255,0.60)" }}>
              Tüm Anonymous çevirileri için geçerli genel kurulum adımları. İstisnai oyunlar için ilgili oyunun detay sayfasındaki özel talimatları takip edin.
            </p>
          </div>

          {/* Platform Selector */}
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-wider block mb-3" style={{ fontFamily: "Caviar Dreams", color: "rgba(255,255,255,0.30)" }}>Platform Seçin</span>
            <div className="flex gap-2">
              {platforms.map((p) => (
                <button key={p.id} onClick={() => setActivePlatform(p.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${activePlatform === p.id ? "text-[#C99BFF]" : "text-white/30 hover:text-white/50"}`}
                  style={{ background: activePlatform === p.id ? "rgba(201,155,255,0.08)" : "rgba(255,255,255,0.03)", border: activePlatform === p.id ? "1px solid rgba(201,155,255,0.25)" : "1px solid rgba(255,255,255,0.05)" }}>
                  {p.icon}
                  <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: "Caviar Dreams" }}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-4 mb-12">
            {steps.map((step, i) => (
              <div key={i} className="relative p-5 sm:p-6 rounded-[20px] overflow-hidden" style={{ background: "rgba(24,22,17,0.65)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-4 sm:gap-5">
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,155,255,0.06)", border: "1px solid rgba(201,155,255,0.12)" }}>
                    <span className="text-[14px] sm:text-[16px] font-bold" style={{ fontFamily: "Caviar Dreams", color: "#C99BFF" }}>{step.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white/90 text-[14px] sm:text-[16px] font-bold mb-1.5" style={{ fontFamily: "Trajan Pro, serif" }}>{step.title}</h3>
                    <p className="text-[13px] sm:text-[14px] leading-relaxed" style={{ fontFamily: "Caviar Dreams", color: "rgba(255,255,255,0.55)" }}>{step.description}</p>
                    {step.tip && (
                      <div className="mt-3 p-3 rounded-xl flex items-start gap-2.5" style={{ background: "rgba(201,155,255,0.05)", border: "1px solid rgba(201,155,255,0.10)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" stroke="#C99BFF" strokeWidth="1.5" /><path d="M12 8v4m0 4h.01" stroke="#C99BFF" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        <span className="text-[12px] leading-relaxed" style={{ fontFamily: "Caviar Dreams", color: "rgba(201,155,255,0.70)" }}>{step.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
                {i < steps.length - 1 && <div className="absolute bottom-0 left-16 sm:left-[4.5rem] w-px h-4" style={{ background: "rgba(201,155,255,0.10)" }} />}
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h2 className="text-[14px] uppercase tracking-wider mb-5" style={{ fontFamily: "Trajan Pro, serif", color: "rgba(255,255,255,0.70)" }}>Sık Sorulan Sorular</h2>
            <div className="flex flex-col gap-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-[16px] overflow-hidden" style={{ background: "rgba(24,22,17,0.65)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 sm:p-5 text-left">
                    <span className="text-[13px] sm:text-[14px] pr-4" style={{ fontFamily: "Caviar Dreams", color: openFaq === i ? "#C99BFF" : "rgba(255,255,255,0.70)" }}>{faq.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={openFaq === i ? "#C99BFF" : "rgba(255,255,255,0.30)"} strokeWidth="2" className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <p className="text-[13px] leading-relaxed" style={{ fontFamily: "Caviar Dreams", color: "rgba(255,255,255,0.45)" }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-6 rounded-[20px]" style={{ background: "rgba(201,155,255,0.04)", border: "1px solid rgba(201,155,255,0.10)" }}>
            <p className="text-[13px] mb-4" style={{ fontFamily: "Caviar Dreams", color: "rgba(255,255,255,0.50)" }}>Sorun mu yaşıyorsunuz?</p>
            <Link href="/destek" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] text-[#C99BFF] hover:bg-white/5 transition" style={{ fontFamily: "Caviar Dreams", border: "1px solid rgba(201,155,255,0.20)" }}>
              DESTEK MERKEZİ
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
