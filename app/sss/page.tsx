"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFaqs, type StrapiFaq } from "@/lib/strapi";

const categories = [
  { id: "all", label: "Tümü" },
  { id: "genel", label: "Genel", icon: "/icons/genel.svg" },
  { id: "uyelik", label: "Üyelik", icon: "/icons/uyelik.svg" },
  { id: "teknik", label: "Teknik Destek", icon: "/icons/teknikdestek.svg" },
  { id: "odemeler", label: "Ödemeler", icon: "/icons/odemeler.svg" },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: StrapiFaq;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className="rounded-2xl transition-all duration-300 group/item"
      style={{
        background: isOpen
          ? "linear-gradient(135deg, rgba(201,155,255,0.08) 0%, rgba(120,80,200,0.04) 100%)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${isOpen ? "rgba(201,155,255,0.2)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: isOpen ? "0 4px 24px rgba(201,155,255,0.08), inset 0 1px 0 rgba(201,155,255,0.1)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 sm:px-6 py-5 text-left"
      >
        <span
          className="text-[13px] font-bold tabular-nums shrink-0 w-7 text-center transition-all duration-300"
          style={{
            fontFamily: "Caviar Dreams",
            color: isOpen ? "#C99BFF" : "rgba(255,255,255,0.18)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Divider line */}
        <div
          className="w-[1px] h-5 shrink-0 transition-all duration-300"
          style={{
            background: isOpen
              ? "linear-gradient(180deg, #C99BFF 0%, transparent 100%)"
              : "rgba(255,255,255,0.06)",
          }}
        />

        <span
          className={`flex-1 text-[14px] transition-colors duration-300 ${isOpen ? "text-white" : "text-white/60 group-hover/item:text-white/80"}`}
          style={{ fontFamily: "Caviar Dreams" }}
        >
          {item.question}
        </span>

        {/* Animated icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: isOpen ? "rgba(201,155,255,0.15)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${isOpen ? "rgba(201,155,255,0.25)" : "rgba(255,255,255,0.06)"}`,
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke={isOpen ? "#C99BFF" : "rgba(255,255,255,0.25)"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>

      {/* Answer */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "250px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-5 sm:px-6 pb-6" style={{ paddingLeft: "calc(28px + 1px + 24px + 20px)" }}>
          <div className="relative pl-4">
            <div
              className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
              style={{ background: "linear-gradient(180deg, rgba(201,155,255,0.3) 0%, transparent 100%)" }}
            />
            <p className="text-[13px] text-white/55 leading-[22px]" style={{ fontFamily: "Caviar Dreams" }}>
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [faqItems, setFaqItems] = useState<StrapiFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFaqs()
      .then((data) => {
        if (!cancelled) setFaqItems(data);
      })
      .catch(() => {
        if (!cancelled) setError("SSS yüklenemedi. Strapi panelinizi kontrol ediniz.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredItems = useMemo(() => {
    let items = faqItems;
    if (selectedCategory !== "all") {
      items = items.filter((i) => i.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.question.toLowerCase().includes(q) ||
          i.answer.toLowerCase().includes(q)
      );
    }
    return items;
  }, [selectedCategory, searchQuery, faqItems]);

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden text-white">
      <Header />

      {/* Multi-layer ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 30%, rgba(201,155,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 60% 50%, rgba(120,80,200,0.04) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute top-[200px] right-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(201,155,255,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[820px] mx-auto pt-[140px] pb-24 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          {/* Decorative badge */}
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.15)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C99BFF", boxShadow: "0 0 6px #C99BFF" }} />
            <span className="text-[11px] font-bold uppercase tracking-[2px]" style={{ fontFamily: "Caviar Dreams", color: "#C99BFF" }}>
              Yardım Merkezi
            </span>
          </div>

          <h1
            className="font-bold mb-4"
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
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-white/50 text-sm max-w-[420px] mx-auto leading-relaxed" style={{ fontFamily: "Caviar Dreams" }}>
            Platform, üyelikler ve teknik konular hakkında merak ettiğiniz her şey.
          </p>
        </div>

        {/* Search bar with glow border */}
        <div className="relative mb-8">
          <div
            className="absolute -inset-[1px] rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(201,155,255,0.15) 0%, rgba(120,80,200,0.05) 50%, rgba(201,155,255,0.1) 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1px",
              borderRadius: "16px",
            }}
          />
          <div className="relative flex items-center">
            <svg
              className="absolute left-5 pointer-events-none"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C99BFF"
              strokeWidth="2"
              style={{ opacity: 0.4 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Sorunuzu arayın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-13 rounded-2xl pl-13 pr-5 text-sm text-white placeholder:text-white/35 focus:outline-none transition-all"
              style={{
                fontFamily: "Caviar Dreams",
                background: "rgba(201,155,255,0.03)",
                paddingLeft: "52px",
                height: "52px",
              }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOpenId(null);
                }}
                className="h-9 px-5 rounded-xl text-[12px] font-bold transition-all duration-300 flex items-center gap-2"
                style={{
                  fontFamily: "Caviar Dreams",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(201,155,255,0.15) 0%, rgba(120,80,200,0.08) 100%)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? "rgba(201,155,255,0.3)" : "rgba(255,255,255,0.05)"}`,
                  color: isActive ? "#C99BFF" : "rgba(255,255,255,0.45)",
                  boxShadow: isActive
                    ? "0 2px 12px rgba(201,155,255,0.1), inset 0 1px 0 rgba(201,155,255,0.15)"
                    : "none",
                }}
              >
                {cat.icon && (
                  <Image
                    src={cat.icon}
                    alt=""
                    width={14}
                    height={14}
                    style={{
                      filter: isActive ? "none" : "grayscale(100%) brightness(0.4)",
                      opacity: isActive ? 0.8 : 0.5,
                    }}
                  />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-sm text-white/40" style={{ fontFamily: "Caviar Dreams" }}>Sorular yükleniyor…</p>
          </div>
        )}
        {error && (
          <div className="rounded-2xl mb-6 p-5" style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)" }}>
            <p className="text-red-400 text-sm" style={{ fontFamily: "Caviar Dreams" }}>{error}</p>
          </div>
        )}

        {/* FAQ list */}
        {!loading && <div className="flex flex-col gap-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,155,255,0.06)", border: "1px solid rgba(201,155,255,0.1)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="1.5" style={{ opacity: 0.4 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p className="text-sm text-white/25" style={{ fontFamily: "Caviar Dreams" }}>
                Sonuç bulunamadı.
              </p>
            </div>
          ) : (
            filteredItems.map((item, i) => (
              <AccordionItem
                key={item.id}
                item={item}
                index={i}
                isOpen={openId === item.id}
                onToggle={() =>
                  setOpenId(openId === item.id ? null : item.id)
                }
              />
            ))
          )}
        </div>}

        {/* Count */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <div className="h-[1px] flex-1" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,155,255,0.08) 100%)" }} />
          <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: "Caviar Dreams", color: "rgba(201,155,255,0.25)" }}>
            {filteredItems.length} SORU
          </span>
        </div>

        {/* CTA */}
        <div
          className="mt-14 rounded-2xl p-7 sm:p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(201,155,255,0.06) 0%, rgba(120,80,200,0.02) 100%)",
            border: "1px solid rgba(201,155,255,0.12)",
          }}
        >
          {/* Corner glow */}
          <div
            className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(201,155,255,0.12) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(120,80,200,0.08) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-1 text-center sm:text-left">
              <h4
                className="text-[15px] font-bold mb-1"
                style={{
                  fontFamily: "Caviar Dreams, sans-serif",
                  background: "linear-gradient(180deg, #FFFFFF 0%, #C99BFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Aradığınız cevabı bulamadınız mı?
              </h4>
              <p className="text-[13px] text-white/45" style={{ fontFamily: "Caviar Dreams" }}>
                Destek ekibimiz size yardımcı olmaktan memnuniyet duyar.
              </p>
            </div>
            <Link
              href="/iletisim"
              className="h-11 px-7 rounded-xl text-[13px] font-bold flex items-center gap-2.5 shrink-0 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(201,155,255,0.2)] hover:scale-[1.02] no-underline"
              style={{
                fontFamily: "Caviar Dreams",
                background: "linear-gradient(135deg, #C99BFF 0%, #7B5EA7 100%)",
                color: "#0a0a0a",
                boxShadow: "0 2px 12px rgba(201,155,255,0.15)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              İletişime Geç
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
