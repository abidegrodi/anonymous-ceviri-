"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
    { id: "genel", label: "GENEL", icon: "/icons/genel.svg" },
    { id: "uyelik", label: "ÜYELİK", icon: "/icons/uyelik.svg" },
    { id: "teknik", label: "TEKNİK DESTEK", icon: "/icons/teknikdestek.svg" },
    { id: "odemeler", label: "ÖDEMELER", icon: "/icons/odemeler.svg" },
];

const faqItems = [
    {
        id: 1,
        question: "Türkçe çeviriler hangi oyun sürümleriyle uyumlu?",
        answer: "Çevirilerimiz genellikle oyunların en güncel sürümleriyle uyumludur. Ancak Epic Games, Steam veya diğer platformlara göre farklılık gösterebilir.",
    },
    {
        id: 2,
        question: "Üyelik ücretleri nelerdir ve neleri kapsar?",
        answer: "Üyelik ücretleri seçtiğiniz pakete göre değişiklik gösterir. Tüm paketlerimiz güncel çevirilere erişim imkanı sunar.",
    },
    {
        id: 3,
        question: "Çeviri kurulumu nasıl yapılır?",
        answer: "Çeviri kurulumu için indirdiğiniz dosyayı oyunun ana dizinine kopyalamanız yeterlidir. Detaylı kurulum rehberi çeviri sayfasında yer almaktadır.",
    },
    {
        id: 4,
        question: "İade politikanız nedir?",
        answer: "Dijital içeriklerde iade politikamız kullanım durumuna göre değişiklik göstermektedir.",
    },
    {
        id: 5,
        question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        answer: "Kredi kartı, banka kartı ve çeşitli dijital cüzdanları kabul etmekteyiz.",
    },
];

export default function FAQPage() {
    const [selectedCategory, setSelectedCategory] = useState("genel");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <main className="relative min-h-screen w-full bg-[#0C080F] overflow-x-hidden text-white font-['Caviar_Dreams']">
            <Header />

            {/* Background Ambience */}
            <div
                className="absolute top-0 left-0 w-[384px] h-[384px] rounded-full pointer-events-none"
                style={{
                    background: "rgba(255, 0, 255, 0.10)",
                    boxShadow: "100px 100px 100px rgba(255, 0, 255, 0.1)",
                    filter: "blur(50px)",
                    top: "7px",
                    left: "0px",
                }}
            />

            <div className="relative z-10 max-w-[1242px] mx-auto pt-[160px] pb-32 px-6">
                {/* Header Section */}
                <div className="w-full mb-12 border-b border-white/10 pb-8 flex flex-col gap-4">
                    <h1 className="font-bold uppercase leading-tight flex flex-wrap gap-2"
                        style={{ fontFamily: 'Trajan Pro', fontSize: 'clamp(28px, 5vw, 47.8px)', lineHeight: 'clamp(32px, 5.5vw, 48px)' }}>
                        <span className="text-white">Sıkça Sorulan</span>
                        <span className="text-[rgba(255,0,255,0.39)]">Sorular</span>
                    </h1>
                    <p className="max-w-[672px] text-[#9CA3AF] text-sm font-bold leading-[22.75px]">
                        Anonymous Çeviri platformu, üyelikler ve teknik konular hakkında merak ettiğiniz her şey.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left Sidebar - Categories */}
                    <div className="w-full lg:w-[270px] shrink-0">
                        <h3 className="text-[#6B7280] text-sm font-normal uppercase leading-[22.75px] mb-4 pl-4"
                            style={{ fontFamily: 'LEMON MILK' }}>
                            Kategoriler
                        </h3>
                        <div className="flex flex-col gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all ${selectedCategory === cat.id
                                        ? "bg-[rgba(255,0,255,0.1)] border-[#C99BFF] shadow-[0px_0px_15px_rgba(255,0,255,0.3)] text-[#C99BFF]"
                                        : "border-transparent text-[#D1D5DB] hover:bg-white/5"
                                        }`}
                                >
                                    <div className="w-6 h-7 relative flex items-center justify-center">
                                        <Image
                                            src={cat.icon}
                                            alt={cat.label}
                                            width={18}
                                            height={18}
                                            className={selectedCategory === cat.id ? "brightness-125" : "opacity-60"}
                                            style={{ filter: selectedCategory === cat.id ? 'none' : 'grayscale(100%) brightness(0.7)' }}
                                        />
                                    </div>
                                    <span style={{ fontFamily: 'LEMON MILK' }} className="text-sm font-normal leading-[22.75px]">
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Search and FAQ List */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Search Bar */}
                        <div className="relative w-full">
                            <div className="absolute top-0 left-0 w-full h-[60px] opacity-0 bg-gradient-to-r from-[rgba(13,242,242,0.2)] to-[rgba(255,0,255,0.2)] blur-[4px] rounded-xl"></div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Image src="/icons/search.svg" alt="Search" width={18} height={18} className="opacity-60 group-focus-within:opacity-100 transition-opacity" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Sorunuzu arayın (örn. kurulum, iade, çeviri sürümü)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-[60px] bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 text-sm font-bold text-[#6B7280] focus:text-white focus:outline-none focus:border-white/30 backdrop-blur-[2px] transition-all"
                                    style={{ fontFamily: 'Caviar Dreams' }}
                                />
                            </div>
                        </div>

                        {/* FAQ List */}
                        <div className="flex flex-col gap-4">
                            {faqItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="group overflow-hidden bg-[#0F1111]/80 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                                >
                                    <button className="w-full p-6 flex items-center justify-between text-left">
                                        <span className="text-white text-sm font-normal uppercase leading-[22.75px]"
                                            style={{ fontFamily: 'LEMON MILK' }}>
                                            {item.question}
                                        </span>
                                        <div className="w-5 h-5 flex items-center justify-center">
                                            {/* We can add an arrow here later if needed */}
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <div className="pt-8">
                            <div className="relative p-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-[6px] overflow-hidden group">
                                {/* Glow circles */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[rgba(255,0,255,0.2)] rounded-full blur-[25px] pointer-events-none"></div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[rgba(201,155,255,0.2)] rounded-full blur-[25px] pointer-events-none"></div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex flex-col gap-2">
                                        <h4 className="text-white text-sm font-normal uppercase leading-[22.75px]"
                                            style={{ fontFamily: 'LEMON MILK' }}>
                                            Hala sorunuz mu var?
                                        </h4>
                                        <p className="text-[#9CA3AF] text-sm font-bold leading-[22.75px]">
                                            Aradığınız cevabı bulamadıysanız, destek ekibimiz size yardımcı olmaktan memnuniyet duyar.
                                        </p>
                                    </div>
                                    <button className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15 transition-all text-white font-bold text-sm">
                                        <Image src="/icons/simdigorusme.svg" alt="Chat" width={20} height={20} />
                                        <span style={{ fontFamily: 'Caviar Dreams' }}>Şimdi Görüşelim</span>
                                    </button>
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
