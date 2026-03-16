"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const subjects = [
  { value: "", label: "Konu Seçiniz" },
  { value: "general", label: "Genel Soru" },
  { value: "translation", label: "Çeviri Hatası" },
  { value: "suggestion", label: "Öneri" },
  { value: "other", label: "Diğer" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", subject: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormData({ name: "", subject: "", message: "" });
  };

  const inputBase = "w-full bg-transparent border border-white/[0.08] rounded-xl px-4 text-white text-sm font-caviar placeholder:text-white/20 focus:outline-none focus:border-[#C99BFF]/30 transition-all duration-200";

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
            Bize Ulaşın
          </h1>
          <p className="text-white/40 text-sm sm:text-base font-caviar max-w-[500px] mx-auto leading-relaxed">
            Soru, öneri veya geri bildirimleriniz için bizimle iletişime geçin.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Email card */}
          <div className="rounded-2xl p-6 flex items-center gap-4 group hover:border-[#C99BFF]/20 transition-all duration-200" style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.12)" }}>
              <Image src="/icons/e-posta.svg" alt="" width={18} height={14} />
            </div>
            <div>
              <span className="font-caviar text-[10px] font-bold uppercase tracking-[1.5px] text-white/25 block">E-Posta</span>
              <span className="font-caviar text-sm text-white/70">info@anonymous.com</span>
            </div>
          </div>

          {/* FAQ card */}
          <Link
            href="/sss"
            className="rounded-2xl p-6 flex items-center gap-4 group hover:border-[#C99BFF]/20 transition-all duration-200 no-underline"
            style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.12)" }}>
              <span className="font-caviar text-sm font-bold text-[#C99BFF]/60">?</span>
            </div>
            <div className="flex-1">
              <span className="font-caviar text-[10px] font-bold uppercase tracking-[1.5px] text-white/25 block">Yardım</span>
              <span className="font-caviar text-sm text-white/70">Sıkça Sorulan Sorular</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,155,255,0.3)" strokeWidth="2" className="shrink-0 group-hover:stroke-[#C99BFF]/60 transition-colors">
              <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-6 sm:p-8 md:p-10"
          style={{ background: "rgba(201,155,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #C99BFF 0%, rgba(201,155,255,0.2) 100%)" }} />
            <span className="font-caviar text-xs font-bold uppercase tracking-[1.5px] text-white/30">Mesaj Gönder</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <label className="font-caviar text-[11px] text-white/30 uppercase tracking-wider mb-2 block">Adınız</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınızı girin"
                  className={`${inputBase} h-12`}
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="font-caviar text-[11px] text-white/30 uppercase tracking-wider mb-2 block">Konu</label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`${inputBase} h-12 appearance-none cursor-pointer`}
                    required
                  >
                    {subjects.map(s => (
                      <option key={s.value} value={s.value} disabled={!s.value} className="bg-[#141414] text-white">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="font-caviar text-[11px] text-white/30 uppercase tracking-wider mb-2 block">Mesajınız</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Mesajınızı buraya yazın..."
                className={`${inputBase} h-[140px] sm:h-[160px] py-3 resize-none`}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full sm:w-auto h-11 px-10 rounded-xl font-caviar text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: sent ? "rgba(13,242,105,0.15)" : "linear-gradient(135deg, #C99BFF 0%, #7B5EA7 100%)",
                color: sent ? "#0DF269" : "#000",
                border: sent ? "1px solid rgba(13,242,105,0.3)" : "none",
              }}
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : sent ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  Gönderildi
                </>
              ) : (
                "Gönder"
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
