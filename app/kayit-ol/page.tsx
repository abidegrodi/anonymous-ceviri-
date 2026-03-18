"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from '@/lib/auth-context';
import { getSitekey, isTurnstileSkipped } from '@/lib/services/auth';
import toast from 'react-hot-toast';

declare global {
    interface Window {
        turnstileCallback?: any;
    }
}

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [age, setAge] = useState('');
    const [isAgreedContract, setIsAgreedContract] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [captchaSiteKey, setCaptchaSiteKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [turnstileScriptLoaded, setTurnstileScriptLoaded] = useState(false);
    const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);

    const skipTurnstile = isTurnstileSkipped();
    const { register, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) router.push('/');
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (skipTurnstile) return;
        getSitekey().then(setCaptchaSiteKey).catch(() => {});
    }, [skipTurnstile]);

    useEffect(() => {
        if (skipTurnstile) return;
        if (document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
            setTurnstileScriptLoaded(true);
            return;
        }
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.onload = () => setTurnstileScriptLoaded(true);
        s.onerror = () => setTurnstileScriptLoaded(false);
        document.head.appendChild(s);
    }, [skipTurnstile]);

    useEffect(() => {
        const w = window as Window;
        const container = document.querySelector("#register-turnstile-container");
        if (!captchaSiteKey || !turnstileScriptLoaded || !container || !w.turnstile || turnstileWidgetId) return;
        try {
            const id = w.turnstile.render("#register-turnstile-container", {
                sitekey: captchaSiteKey, theme: 'dark', size: "normal", action: "register",
                callback: (token: string) => setTurnstileToken(token),
                "error-callback": () => setTurnstileToken(null),
                "expired-callback": () => setTurnstileToken(null),
            });
            setTurnstileWidgetId(id ?? null);
        } catch (e) { console.error("Turnstile render error:", e); }
        return () => {
            if (turnstileWidgetId && w.turnstile) { try { w.turnstile.remove(turnstileWidgetId); } catch {} }
        };
    }, [captchaSiteKey, turnstileScriptLoaded, turnstileWidgetId]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !passwordConfirm || !age) { toast.error('Tüm alanları doldurunuz.'); return; }
        if (password !== passwordConfirm) { toast.error('Parolalar eşleşmiyor.'); return; }
        if (password.length < 6) { toast.error('Parola en az 6 karakter olmalıdır.'); return; }
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) { toast.error('Geçerli bir yaş giriniz.'); return; }
        setIsSubmitting(true);
        try {
            const result = await register({ email, password, userUnique: uuidv4(), isAgreedContract: true, age: ageNum, turnstileToken: turnstileToken || undefined });
            if (result.success) { toast.success(result.message); router.push('/hosgeldiniz'); }
        } catch {
            if (window.turnstile && turnstileWidgetId) { window.turnstile.reset(turnstileWidgetId); setTurnstileToken(null); }
        } finally { setIsSubmitting(false); }
    };

    return (
        <main className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden text-white">
            <Header />

            {/* Hero ambient */}
            <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px]" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,155,255,0.08) 0%, transparent 60%)" }} />
                <div className="absolute top-[100px] left-[20%] w-[300px] h-[300px]" style={{ background: "radial-gradient(circle, rgba(120,80,200,0.05) 0%, transparent 60%)" }} />
                <div className="absolute top-[50px] right-[15%] w-[250px] h-[250px]" style={{ background: "radial-gradient(circle, rgba(201,155,255,0.04) 0%, transparent 60%)" }} />
            </div>

            <div className="relative z-10 w-full max-w-[1100px] mx-auto pt-[130px] sm:pt-[150px] pb-20 px-4 sm:px-6 md:px-8">

                {/* Hero title */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1
                        className="font-bold uppercase mb-4"
                        style={{
                            fontFamily: 'Trajan Pro, serif',
                            fontSize: 'clamp(28px, 5vw, 52px)',
                            lineHeight: '1.1',
                            letterSpacing: '-1px',
                            background: 'linear-gradient(180deg, #FFFFFF 0%, #C99BFF 60%, #795D99 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Topluluğa Katıl
                    </h1>
                    <p className="text-white/30 text-[15px] sm:text-[16px] max-w-[420px] mx-auto leading-relaxed" style={{ fontFamily: 'Caviar Dreams' }}>
                        Anonymous Çeviri dünyasının ayrıcalıklarına katılmaya sadece bir adım kaldı.
                    </p>
                </div>

                {/* Two column layout */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                    {/* Left - Form */}
                    <div className="w-full lg:flex-1 lg:max-w-none">
                        <form
                            onSubmit={handleRegister}
                            className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(201,155,255,0.04) 0%, rgba(10,10,10,0.9) 50%, rgba(120,80,200,0.03) 100%)',
                                border: '1px solid rgba(201,155,255,0.1)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,155,255,0.3) 50%, transparent 100%)" }} />

                            <div className="flex items-center gap-2 mb-7">
                                <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #C99BFF 0%, rgba(201,155,255,0.2) 100%)" }} />
                                <span className="text-[13px] font-bold uppercase tracking-[1.5px] text-white/30" style={{ fontFamily: 'Caviar Dreams' }}>Hesap Bilgileri</span>
                            </div>

                            <div className="flex flex-col gap-5">
                                {/* Email */}
                                <div>
                                    <label className="text-white/50 text-[12px] font-bold uppercase tracking-wider mb-2 block" style={{ fontFamily: 'Caviar Dreams' }}>E-Posta Adresi</label>
                                    <input
                                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ornek@email.com"
                                        className="w-full h-12 sm:h-[52px] rounded-xl px-4 text-[14px] text-white placeholder:text-white/15 bg-transparent border border-white/[0.06] focus:border-[#C99BFF]/25 focus:shadow-[0_0_16px_rgba(201,155,255,0.06)] focus:outline-none transition-all"
                                        style={{ fontFamily: 'Caviar Dreams' }} required
                                    />
                                </div>

                                {/* Password row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/50 text-[12px] font-bold uppercase tracking-wider mb-2 block" style={{ fontFamily: 'Caviar Dreams' }}>Parola</label>
                                        <input
                                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Min. 6 karakter"
                                            className="w-full h-12 sm:h-[52px] rounded-xl px-4 text-[14px] text-white placeholder:text-white/15 bg-transparent border border-white/[0.06] focus:border-[#C99BFF]/25 focus:shadow-[0_0_16px_rgba(201,155,255,0.06)] focus:outline-none transition-all"
                                            style={{ fontFamily: 'Caviar Dreams' }} required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-[12px] font-bold uppercase tracking-wider mb-2 block" style={{ fontFamily: 'Caviar Dreams' }}>Parola Tekrarı</label>
                                        <input
                                            type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                                            placeholder="Tekrar girin"
                                            className="w-full h-12 sm:h-[52px] rounded-xl px-4 text-[14px] text-white placeholder:text-white/15 bg-transparent border border-white/[0.06] focus:border-[#C99BFF]/25 focus:shadow-[0_0_16px_rgba(201,155,255,0.06)] focus:outline-none transition-all"
                                            style={{ fontFamily: 'Caviar Dreams' }} required
                                        />
                                    </div>
                                </div>

                                {/* Age */}
                                <div>
                                    <label className="text-white/50 text-[12px] font-bold uppercase tracking-wider mb-2 block" style={{ fontFamily: 'Caviar Dreams' }}>Yaş</label>
                                    <input
                                        type="number" value={age} onChange={(e) => setAge(e.target.value)}
                                        placeholder="Yaşınızı girin" min="0" max="100"
                                        className="w-full h-12 sm:h-[52px] rounded-xl px-4 text-[14px] text-white placeholder:text-white/15 bg-transparent border border-white/[0.06] focus:border-[#C99BFF]/25 focus:shadow-[0_0_16px_rgba(201,155,255,0.06)] focus:outline-none transition-all"
                                        style={{ fontFamily: 'Caviar Dreams' }} required
                                    />
                                </div>


                                {/* Turnstile */}
                                {!skipTurnstile && (
                                    <div className="flex justify-center w-full min-h-[65px] overflow-x-auto">
                                        <div id="register-turnstile-container"></div>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit" disabled={isSubmitting}
                                    className="w-full h-12 sm:h-[50px] rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(201,155,255,0.2)] active:scale-[0.98]"
                                    style={{
                                        fontFamily: 'Caviar Dreams',
                                        background: 'linear-gradient(135deg, #C99BFF 0%, #7B5EA7 100%)',
                                        color: '#0a0a0a',
                                        boxShadow: '0 2px 16px rgba(201,155,255,0.15)',
                                    }}
                                >
                                    {isSubmitting ? <div className="w-5 h-5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" /> : 'Kayıt Ol'}
                                </button>

                                {/* Login link */}
                                <p className="text-center text-white/20 text-[13px] pt-1" style={{ fontFamily: 'Caviar Dreams' }}>
                                    Zaten hesabınız var mı?{' '}
                                    <Link href="/giris-yap" className="text-[#C99BFF]/50 hover:text-[#C99BFF] transition-colors no-underline font-bold">Giriş Yap</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right - Benefits */}
                    <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-4">

                        {/* Subscription card */}
                        <div
                            className="rounded-2xl p-6 sm:p-7 relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(13,242,105,0.04) 0%, rgba(10,10,10,0.9) 100%)',
                                border: '1px solid rgba(13,242,105,0.12)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                            }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(13,242,105,0.4) 50%, transparent 100%)" }} />
                            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(13,242,105,0.06) 0%, transparent 70%)" }} />

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-[1.5px] block mb-1" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(13,242,105,0.5)' }}>Aylık Üyelik</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[28px] font-bold text-white/90" style={{ fontFamily: 'Caviar Dreams' }}>₺150</span>
                                        <span className="text-[13px] text-white/25" style={{ fontFamily: 'Caviar Dreams' }}>/ay</span>
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 rounded-lg" style={{ background: 'rgba(13,242,105,0.08)', border: '1px solid rgba(13,242,105,0.15)' }}>
                                    <span className="text-[10px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: '#0DF269' }}>ÖZEL FİYAT</span>
                                </div>
                            </div>

                            <div className="w-full h-[1px] mb-5" style={{ background: "linear-gradient(90deg, rgba(13,242,105,0.1) 0%, transparent 100%)" }} />

                            <div className="flex flex-col gap-4">
                                {[
                                    { title: 'Hızlı İndirme', desc: 'Bekleme süresi olmadan anında erişim.' },
                                    { title: 'Limitsiz Çeviri Erişimi', desc: 'Yüzlerce oyuna özel Türkçe çeviriler.' },
                                    { title: 'Topluluk Üyeliği', desc: 'Toplulukta ayrıcalıklı statü kazanın.' },
                                    { title: 'Erken Erişim', desc: 'Yeni çevirilere 1 hafta önceden erişim.' },
                                ].map((f, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(13,242,105,0.1)', boxShadow: '0 0 10px rgba(13,242,105,0.15)' }}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0DF269" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-white/60 text-[14px] font-bold block" style={{ fontFamily: 'Caviar Dreams' }}>{f.title}</span>
                                            <span className="text-white/20 text-[12px]" style={{ fontFamily: 'Caviar Dreams' }}>{f.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info box */}
                        <div
                            className="rounded-2xl p-5 flex items-start gap-3"
                            style={{ background: 'rgba(201,155,255,0.03)', border: '1px solid rgba(201,155,255,0.08)' }}
                        >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(201,155,255,0.1)' }}>
                                <span className="text-[9px] font-bold text-[#C99BFF]">i</span>
                            </div>
                            <div>
                                <span className="text-white/50 text-[13px] font-bold block mb-0.5" style={{ fontFamily: 'Caviar Dreams' }}>E-posta Doğrulaması</span>
                                <span className="text-white/20 text-[12px] leading-relaxed" style={{ fontFamily: 'Caviar Dreams' }}>
                                    Kayıt sonrası e-posta adresinize doğrulama bağlantısı gönderilecektir. Giriş için doğrulama zorunludur.
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
