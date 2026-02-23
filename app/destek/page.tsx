"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SupportPage() {
    return (
        <main className="relative min-h-screen w-full bg-[#0C080F] overflow-x-hidden text-white font-['Caviar_Dreams']">
            <Header />

            {/* Background Effects */}
            <div className="absolute top-0 left-[480px] w-[384px] h-[384px] rounded-full pointer-events-none"
                style={{
                    background: "rgba(201, 155, 255, 0.10)",
                    boxShadow: "100px 100px 100px rgba(201, 155, 255, 0.1)",
                    filter: "blur(50px)",
                }}
            />
            <div className="absolute top-[703px] left-[1056px] w-[384px] h-[384px] rounded-full pointer-events-none"
                style={{
                    background: "rgba(255, 0, 153, 0.05)",
                    boxShadow: "100px 100px 100px rgba(255, 0, 153, 0.05)",
                    filter: "blur(50px)",
                }}
            />

            <div className="relative z-10 max-w-[1264px] mx-auto pt-[160px] pb-32 px-8">
                {/* Search Section */}
                <div className="w-full flex flex-col items-center mb-10">
                    <div className="relative w-full max-w-[672px] group">
                        {/* Search Glow */}
                        <div className="absolute -inset-1 opacity-30 bg-gradient-to-r from-[#0DF2F2] to-[#FF0099] blur-[4px] rounded-lg transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative flex items-center h-14 bg-[rgba(255,0,255,0.05)] border border-white/20 rounded-lg px-4 gap-3">
                            <div className="flex-shrink-0">
                                <Image src="/icons/search.svg" alt="Search" width={24} height={24} className="opacity-60" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nasıl yardımcı olabiliriz? (Örn: Çeviri kurulumu)"
                                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-white/30 placeholder:text-white/30 focus:text-white"
                                style={{ fontFamily: 'Caviar Dreams' }}
                            />
                            <button className="px-4 py-1.5 bg-[rgba(255,0,255,0.1)] border border-white/20 rounded text-[#9CA3AF] text-sm hover:bg-[rgba(255,0,255,0.2)] transition-colors"
                                style={{ fontFamily: 'LEMON MILK' }}>
                                ENTER
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side (Categories & Popular Articles) */}
                    <div className="flex-1 flex flex-col gap-10">
                        {/* Categories */}
                        <section>
                            <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-6">
                                <Image src="/icons/kategoriler.svg" alt="Categories" width={24} height={24} />
                                <h2 className="text-white text-sm font-normal uppercase" style={{ fontFamily: 'LEMON MILK' }}>Kategoriler</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Teknik Sorunlar */}
                                <div className="relative h-[180px] bg-[rgba(255,0,255,0.1)] rounded-lg border border-white/20 p-5 overflow-hidden group cursor-pointer hover:border-white/40 transition-all">
                                    <div className="w-12 h-12 bg-[rgba(255,0,255,0.05)] border border-white/20 rounded flex items-center justify-center mb-6">
                                        <Image src="/icons/teknik.svg" alt="Teknik" width={24} height={24} className="opacity-80" />
                                    </div>
                                    <h3 className="text-white text-sm font-normal uppercase mb-2" style={{ fontFamily: 'LEMON MILK' }}>Teknİk Sorunlar</h3>
                                    <p className="text-[#9CA3AF] text-xs font-bold leading-relaxed" style={{ fontFamily: 'Caviar Dreams' }}>
                                        Çeviri dosyaları, kurulum hataları...
                                    </p>
                                    <div className="absolute top-1 right-2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                                        <Image src="/icons/teknik.svg" alt="Teknik" width={60} height={72} />
                                    </div>
                                </div>

                                {/* Hesap ve Üyelik */}
                                <div className="relative h-[180px] bg-[rgba(255,0,255,0.1)] rounded-lg border border-white/20 p-5 overflow-hidden group cursor-pointer hover:border-white/40 transition-all">
                                    <div className="w-12 h-12 bg-[rgba(255,0,255,0.05)] border border-white/20 rounded flex items-center justify-center mb-6">
                                        <Image src="/icons/hesapveguvenlik.svg" alt="Üyelik" width={24} height={24} className="opacity-80" />
                                    </div>
                                    <h3 className="text-white text-sm font-normal uppercase mb-2" style={{ fontFamily: 'LEMON MILK' }}>Hesap ve Üyelİk</h3>
                                    <p className="text-[#9CA3AF] text-xs font-bold leading-relaxed" style={{ fontFamily: 'Caviar Dreams' }}>
                                        Şifre sıfırlama, üyelik planları...
                                    </p>
                                    <div className="absolute top-1 right-2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                                        <Image src="/icons/hesapveguvenlik.svg" alt="Üyelik" width={60} height={72} />
                                    </div>
                                </div>

                                {/* Ödeme İşlemleri */}
                                <div className="relative h-[180px] bg-[rgba(255,0,255,0.1)] rounded-lg border border-white/20 p-5 overflow-hidden group cursor-pointer hover:border-white/40 transition-all">
                                    <div className="w-12 h-12 bg-[rgba(255,0,255,0.05)] border border-white/20 rounded flex items-center justify-center mb-6">
                                        <Image src="/icons/odemeler.svg" alt="Ödeme" width={24} height={24} className="opacity-80" />
                                    </div>
                                    <h3 className="text-white text-sm font-normal uppercase mb-2" style={{ fontFamily: 'LEMON MILK' }}>Ödeme İşlemlerİ</h3>
                                    <p className="text-[#9CA3AF] text-xs font-bold leading-relaxed" style={{ fontFamily: 'Caviar Dreams' }}>
                                        Fatura geçmişi, iade talepleri...
                                    </p>
                                    <div className="absolute top-1 right-2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                                        <Image src="/icons/odemeler.svg" alt="Ödeme" width={60} height={72} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Popular Articles */}
                        <section>
                            <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-6 pt-4">
                                <Image src="/icons/populer.svg" alt="Popular" width={24} height={24} />
                                <h2 className="text-white text-sm font-normal uppercase" style={{ fontFamily: 'LEMON MILK' }}>Popüler Makaleler</h2>
                            </div>

                            <div className="bg-[rgba(255,0,255,0.1)] border border-white/20 rounded-lg overflow-hidden">
                                {[
                                    { title: "Çeviri açılmıyor ne yapmalıyım?", update: "Son güncelleme: 2 gün önce" },
                                    { title: "Discord hesabımı nasıl bağlarım?", update: "Son güncelleme: 1 hafta önce" },
                                    { title: "Hata Kodu: 0x8004101 Çözümü", update: "Son güncelleme: 3 gün önce" },
                                    { title: "Üyelik yenileme sorunu yaşıyorum", update: "Son güncelleme: Dün" }
                                ].map((item, idx) => (
                                    <div key={idx} className={`p-5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors ${idx !== 0 ? 'border-top border-white/20' : ''}`}
                                        style={{ borderTop: idx !== 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                        <div className="flex items-center gap-4">
                                            <Image src="/icons/makaleikon.svg" alt="Doc" width={24} height={24} className="opacity-50" />
                                            <div>
                                                <h4 className="text-white text-sm font-normal uppercase mb-1" style={{ fontFamily: 'LEMON MILK' }}>{item.title}</h4>
                                                <p className="text-white/50 text-xs font-bold" style={{ fontFamily: 'Caviar Dreams' }}>{item.update}</p>
                                            </div>
                                        </div>
                                        <Image src="/icons/arrowr.svg" alt="Select" width={24} height={24} className="opacity-50" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side Sidebar */}
                    <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
                        {/* Live Support Card */}
                        <div className="relative p-6 bg-[rgba(255,0,255,0.1)] border border-white/20 rounded-xl overflow-hidden backdrop-blur-[6px] flex flex-col items-center">
                            {/* Inner glows */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[rgba(255,0,153,0.05)] rounded-full blur-[20px]"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[rgba(255,0,255,0.05)] rounded-full blur-[20px]"></div>

                            <div className="w-16 h-16 bg-[#C99BFF] rounded-full border border-white/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(201,155,255,0.3)]">
                                <Image src="/icons/simdigorusme.svg" alt="Live Support" width={30} height={36} />
                            </div>

                            <h3 className="text-white text-sm font-normal uppercase mb-2" style={{ fontFamily: 'LEMON MILK' }}>Canlı Destek</h3>
                            <p className="text-[#D1D5DB] text-sm font-bold text-center mb-6 px-4" style={{ fontFamily: 'Caviar Dreams' }}>
                                Aradığınız cevabı bulamadınız mı?
                            </p>

                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[rgba(255,0,255,0.05)] rounded border border-white/10 hover:bg-[rgba(255,0,255,0.1)] transition-colors text-[#FAF8FF] text-sm"
                                style={{ boxShadow: '0 0 10px rgba(201,155,255,0.1)' }}>
                                <Image src="/icons/talep.svg" alt="Request" width={20} height={24} />
                                <span style={{ fontFamily: 'LEMON MILK' }}>Talep Oluştur</span>
                            </button>
                        </div>

                        {/* Quick Links */}
                        <div className="p-5 bg-[rgba(255,0,255,0.1)] border border-white/20 rounded-lg flex flex-col gap-4">
                            <h3 className="text-white text-sm font-normal uppercase" style={{ fontFamily: 'LEMON MILK' }}>Hızlı Lİnkler</h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Kurulum Rehberİ", icon: "/icons/arrowr.svg" },
                                    { label: "Sıkça Sorulan Sorular", icon: "/icons/arrowr.svg" },
                                    { label: "Çeviri Notları", icon: "/icons/arrowr.svg" }
                                ].map((link, idx) => (
                                    <div key={idx} className="flex items-center gap-2 cursor-pointer group">
                                        <Image src={link.icon} alt="Arrow" width={12} height={14} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                                        <span className="text-[#9CA3AF] text-sm font-normal uppercase group-hover:text-white transition-colors" style={{ fontFamily: 'LEMON MILK' }}>
                                            {link.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
