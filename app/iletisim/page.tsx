"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Add logic to handle form submission
    };

    return (
        <main className="relative min-h-screen w-full bg-[#0C080F] overflow-x-hidden text-white font-['Caviar_Dreams']">
            <Header />

            {/* Background Ambience - from Figma */}
            <div
                className="absolute"
                style={{
                    width: "800px",
                    height: "500px",
                    left: "50%",
                    transform: "translateX(-20%)",
                    top: "0px",
                    background: "rgba(79, 87, 187, 0.10)",
                    boxShadow: "120px 120px 120px 0px rgba(0,0,0,0.5)",
                    borderRadius: "9999px",
                    filter: "blur(60px)",
                    zIndex: 0,
                }}
            />

            {/* Main Content Container - Centered and Responsive */}
            <div className="relative z-10 w-full max-w-[1242px] mx-auto pt-[160px] pb-32 px-6 flex flex-col items-center">

                {/* Centered Wrapper for Content Alignment */}
                <div className="w-full max-w-[880px] flex flex-col gap-8">

                    {/* Header Section */}
                    <div className="flex flex-col gap-6 items-start text-left">
                        <h1
                            className="font-bold uppercase"
                            style={{
                                fontSize: "clamp(32px, 6vw, 59.6px)",
                                fontFamily: "Trajan Pro, serif",
                                lineHeight: "clamp(36px, 6.5vw, 60px)",
                                letterSpacing: "-1.98px",
                                background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Bize Ulaşın
                        </h1>
                        <p className="text-[#FAF8FF] text-lg font-normal leading-[27px] max-w-[672px]">
                            Oyun çevirileri hakkında soru, görüş ve önerileriniz için aşağıdaki
                            formu doldurun veya topluluğumuzun kalbi olan topluluk sunucumuza
                            katılın.
                        </p>
                    </div>

                    {/* Content Section: Form and Sidebar */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Contact Form Container - Left Side */}
                        <div className="w-full lg:w-[496px] bg-[rgba(255,0,255,0.10)] shadow-[0px_8px_32px_rgba(0,0,0,0.37)] rounded-2xl border border-white/20 backdrop-blur-[2px] p-8">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                                {/* Name Input */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="flex items-center gap-2 text-base font-bold"
                                        style={{
                                            fontFamily: "Caviar Dreams",
                                            background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}
                                    >
                                        <span className="w-4 flex justify-center">
                                            <Image src="/icons/human.svg" alt="User" width={14} height={16} className="opacity-80" />
                                        </span>
                                        Adınız
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Adınızı Giriniz"
                                            className="w-full h-14 bg-[rgba(255,0,255,0.10)] rounded-3xl border border-white/20 px-4 focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/50"
                                            style={{
                                                fontFamily: "Caviar Dreams",
                                                background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text"
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Subject Input */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="flex items-center gap-2 text-base font-bold"
                                        style={{
                                            fontFamily: "Caviar Dreams",
                                            background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}
                                    >
                                        <span className="w-4 flex justify-center">
                                            <Image src="/icons/konu.svg" alt="Subject" width={14} height={16} className="opacity-80" />
                                        </span>
                                        Konu
                                    </label>
                                    <div className="relative">
                                        <div className="relative w-full h-14">
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full h-full appearance-none bg-[rgba(255,0,255,0.10)] rounded-3xl border border-white/20 px-4 pr-10 focus:outline-none focus:border-white/50 transition-colors cursor-pointer"
                                                style={{
                                                    fontFamily: "Caviar Dreams",
                                                    background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                                                    WebkitBackgroundClip: "text",
                                                    WebkitTextFillColor: "transparent",
                                                    backgroundClip: "text"
                                                }}
                                            >
                                                <option value="" disabled className="bg-[#1a1a2e]">Konu Seçiniz</option>
                                                <option value="general" className="bg-[#1a1a2e]">Genel Soru</option>
                                                <option value="translation" className="bg-[#1a1a2e]">Çeviri Hatası</option>
                                                <option value="suggestion" className="bg-[#1a1a2e]">Öneri</option>
                                                <option value="other" className="bg-[#1a1a2e]">Diğer</option>
                                            </select>
                                            {/* Custom Arrow */}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className="w-[10px] h-[5px] border-l-[1.8px] border-b-[1.8px] border-[#FAF8FF] -rotate-45 transform origin-center"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Input */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="flex items-center gap-2 text-base font-bold"
                                        style={{
                                            fontFamily: "Caviar Dreams",
                                            background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}
                                    >
                                        <span className="w-4 flex justify-center">
                                            <Image src="/icons/message.svg" alt="Message" width={14} height={16} className="opacity-80" />
                                        </span>
                                        Mesajınız
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Mesajınızı detaylı bir şekilde buraya yazın..."
                                            className="w-full h-[180px] bg-[rgba(255,0,255,0.10)] rounded-3xl border border-white/20 p-4 resize-none focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
                                            style={{
                                                fontFamily: "Caviar Dreams",
                                                background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text"
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full h-14 bg-[#FAF8FF] hover:bg-white text-[#111818] rounded-3xl font-bold uppercase tracking-[0.90px] text-lg flex items-center justify-center transition-transform active:scale-95"
                                >
                                    Gönder
                                </button>
                            </form>
                        </div>

                        {/* Sidebar Section - Right Side */}
                        <div className="flex flex-col gap-5 w-full lg:w-[343px]">

                            {/* Email Box */}
                            <div className="p-6 bg-[rgba(240,0,255,0.04)] rounded-3xl border border-white/20 flex flex-col items-start gap-3">
                                <div className="w-10 h-10 bg-[rgba(39,22,46,0.50)] rounded-2xl flex items-center justify-center">
                                    <Image src="/icons/e-posta.svg" alt="Email" width={20} height={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#C99BFF] text-xs font-bold uppercase tracking-wider">E-POSTA</span>
                                    <span
                                        className="text-[16px] font-bold"
                                        style={{
                                            fontFamily: "Caviar Dreams",
                                            background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text"
                                        }}
                                    >
                                        info@anonymous.com
                                    </span>
                                </div>
                            </div>

                            {/* FAQ Box */}
                            <Link href="/sss" className="h-[98px] rounded-3xl border border-white/20 relative overflow-hidden group cursor-pointer block">
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,0,255,0.10)_0%,rgba(255,0,255,0.10)_100%)] group-hover:bg-[rgba(255,0,255,0.2)] transition-colors"></div>
                                <div className="absolute inset-0 flex items-center justify-between px-6">
                                    <span
                                        className="text-[16px] uppercase whitespace-nowrap"
                                        style={{
                                            fontFamily: 'LEMON MILK',
                                            background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        Sıkça Sorulan Sorular
                                    </span>
                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                                        <Image src="/icons/rightarrow.svg" alt="Arrow Right" width={16} height={16} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
