"use client";

import { useState, useEffect, useRef } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
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
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (skipTurnstile) return;
        getSitekey()
            .then((key) => {
                console.log('DEBUG: Fetched Site Key:', key);
                setCaptchaSiteKey(key);
            })
            .catch((err) => {
                console.error('DEBUG: Failed to fetch site key:', err);
            });
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

        if (!captchaSiteKey || !turnstileScriptLoaded || !container) return;
        if (!w.turnstile) return;
        if (turnstileWidgetId) return;

        try {
            const id = w.turnstile.render("#register-turnstile-container", {
                sitekey: captchaSiteKey,
                theme: 'dark',
                size: "normal",
                action: "register",
                callback: (token: string) => setTurnstileToken(token),
                "error-callback": () => setTurnstileToken(null),
                "expired-callback": () => setTurnstileToken(null),
            });
            setTurnstileWidgetId(id ?? null);
        } catch (e) {
            console.error("Turnstile render error:", e);
        }

        return () => {
            if (turnstileWidgetId && w.turnstile) {
                try {
                    w.turnstile.remove(turnstileWidgetId);
                } catch (e) {
                    // ignore
                }
            }
        };
    }, [captchaSiteKey, turnstileScriptLoaded, turnstileWidgetId]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !passwordConfirm || !age) {
            toast.error('Tüm alanları doldurunuz.');
            return;
        }

        if (password !== passwordConfirm) {
            toast.error('Parolalar eşleşmiyor.');
            return;
        }

        if (password.length < 6) {
            toast.error('Parola en az 6 karakter olmalıdır.');
            return;
        }

        if (!isAgreedContract) {
            toast.error('Kullanım sözleşmesini kabul etmeniz gerekmektedir.');
            return;
        }

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 0 || ageNum > 100) {
            toast.error('Geçerli bir yaş giriniz (0-100).');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await register({
                email,
                password,
                userUnique: uuidv4(),
                isAgreedContract: true,
                age: ageNum,
                turnstileToken: turnstileToken || undefined,
            });

            if (result.success) {
                toast.success(result.message);
                router.push('/giris-yap');
            }
        } catch {
            if (window.turnstile && turnstileWidgetId) {
                window.turnstile.reset(turnstileWidgetId);
                setTurnstileToken(null);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0C080F] flex flex-col">
            <Header />

            {/* Main Content */}
            <div
                className="flex-1 flex justify-center items-start lg:items-center px-4 sm:px-6 lg:px-8"
                style={{
                    paddingTop: 'clamp(100px, 15vw, 180px)',
                    paddingBottom: 'clamp(40px, 8vw, 130.50px)',
                }}
            >
                <div className="w-full max-w-[1152px] flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-[64px]">

                    {/* Left Column */}
                    <div className="w-full lg:w-[442px] flex flex-col justify-start items-start gap-8 lg:gap-[40px]" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>

                        {/* Title Section */}
                        <div className="self-stretch pb-4 lg:pb-[30px] flex flex-col justify-start items-start">
                            <div className="self-stretch flex flex-col gap-[15px]">
                                <div className="self-stretch flex flex-col justify-center">
                                    <h1
                                        className="leading-tight"
                                        style={{
                                            fontFamily: 'Inter',
                                            fontWeight: 800,
                                            fontSize: 'clamp(28px, 4vw, 36px)',
                                            lineHeight: 'clamp(32px, 4.5vw, 36px)',
                                            background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        Hesabınızı<br />Oluşturun
                                    </h1>
                                </div>
                                <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                                    <p
                                        className="text-[#9CA3AF] text-[14px] sm:text-[16px] font-normal leading-[22px] sm:leading-[24px]"
                                        style={{ fontFamily: 'Inter' }}
                                    >
                                        Anonymous Çeviri dünyasının ayrıcalıklarına katılmaya sadece bir adım kaldı.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Card */}
                        <div className="self-stretch relative flex flex-col justify-start items-start group">
                            {/* Blur/Glow Effect Behind */}
                            <div
                                className="absolute -left-1 -top-1 w-[calc(100%+8px)] h-[calc(100%+8px)] rounded-[32px] opacity-75 blur-[4px]"
                                style={{
                                    background: 'linear-gradient(90deg, rgba(79, 87, 187, 0.15) 0%, rgba(79, 87, 187, 0.10) 100%)',
                                }}
                            />

                            {/* Card Content */}
                            <div
                                className="self-stretch relative p-6 sm:p-[32px] bg-black/60 rounded-[24px] overflow-hidden flex flex-col justify-start items-start gap-[24px]"
                                style={{
                                    outline: '1px solid rgba(255, 255, 255, 0.10)',
                                    outlineOffset: '-1px'
                                }}
                            >
                                {/* Header of Card */}
                                <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                                    <div className="flex flex-col gap-[4px]">
                                        <span className="text-white/90 text-xl sm:text-[24px] font-bold leading-[32px] font-manrope">
                                            Aylık Üyelik
                                        </span>
                                        <span className="text-[#9CA3AF] text-[14px] font-normal leading-[20px] font-manrope">
                                            1 Ay Süreli Erişim
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-[5.5px] pb-[2.50px] sm:text-right">
                                        <span className="text-white/90 text-xl sm:text-[24px] font-bold leading-[32px] font-manrope">
                                            ₺150.00
                                        </span>
                                        <span className="text-[#FAF8FF] text-[12px] font-medium leading-[16px] font-manrope">
                                            Her ay yenilenir.
                                        </span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="w-full h-[1px] border-t border-white/10 relative" />

                                {/* Features List */}
                                <div className="w-full flex flex-col gap-[16px]">
                                    {[
                                        { title: 'Hızlı İndirme', desc: 'Bekleme süresi olmadan anında erişim.' },
                                        { title: 'Limitsiz Çeviri Erişimi', desc: 'Yüzlerce oyuna özel Türkçe çeviriler.' },
                                        { title: 'Topluluk Üyeliği', desc: 'Toplulukta ayrıcalıklı statü kazanın.' },
                                        { title: 'Erken Erişim', desc: 'Yeni çevirilere 1 hafta önceden erişim.' },
                                    ].map((feature, idx) => (
                                        <div key={idx} className="self-stretch flex justify-start items-start gap-[12px]">
                                            <div className="w-[20px] h-[22px] pt-[2px] flex flex-col justify-start items-start shrink-0">
                                                <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[rgba(13,242,105,0.10)] shadow-[0px_0px_10px_rgba(13,242,105,0.40)]">
                                                    <div className="relative w-[14.02px] h-[16px]">
                                                        <div className="absolute left-[2.48px] top-[4.65px] w-[9.06px] h-[6.68px] bg-[#0DF269]" style={{ clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 0, 80% 0, 43% 62%)' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-[5.50px] pb-[2.50px]">
                                                <span className="text-[#E5E7EB] text-[14px] font-bold leading-[20px] font-manrope">
                                                    {feature.title}
                                                </span>
                                                <span className="text-[#FAF8FF] text-[12px] font-normal leading-[16px] font-manrope">
                                                    {feature.desc}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Glow Effect Top Right */}
                                <div
                                    className="absolute right-0 top-[-63px] w-[128px] h-[128px] rounded-full blur-[32px]"
                                    style={{
                                        background: 'rgba(13, 242, 105, 0.05)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Register Form */}
                    <div className="w-full lg:flex-1 lg:max-w-[645px] flex flex-col justify-start items-start gap-[24px]">

                        {/* Form Container */}
                        <form
                            onSubmit={handleRegister}
                            className="self-stretch p-6 sm:p-[40px] relative bg-[rgba(255,0,255,0.10)] rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-col justify-start items-start gap-[24px] backdrop-blur-[6px]"
                            style={{
                                boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                outline: '1px solid rgba(255, 255, 255, 0.08)',
                                outlineOffset: '-1px'
                            }}
                        >
                            {/* Top Gradient Line */}
                            <div
                                className="absolute left-[1px] top-[1px] right-[1px] h-[4px]"
                                style={{
                                    background: 'linear-gradient(90deg, #C99BFF 0%, rgba(201, 155, 255, 0) 0%, #C99BFF 50%, rgba(201, 155, 255, 0) 100%)',
                                    opacity: 0.5
                                }}
                            />

                            {/* Form Fields */}
                            <div className="w-full flex flex-col gap-5">
                                {/* Email Input */}
                                <div className="w-full">
                                    <div className="w-full h-[48px] sm:h-[54px] bg-[rgba(19,31,24,0.50)] rounded-[16px] overflow-hidden" style={{ outline: '1px solid rgba(255, 255, 255, 0.10)', outlineOffset: '-1px' }}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="E-Posta Adresi"
                                            className="w-full h-full bg-transparent px-[17px] text-[#FAF8FF] text-[14px] sm:text-[16px] font-normal tracking-[0.40px] placeholder-[#FAF8FF]/50 focus:outline-none"
                                            style={{ fontFamily: 'Inter' }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="w-full">
                                    <div className="w-full h-[48px] sm:h-[54px] bg-[rgba(19,31,24,0.50)] rounded-[16px] overflow-hidden" style={{ outline: '1px solid rgba(255, 255, 255, 0.10)', outlineOffset: '-1px' }}>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Parola"
                                            className="w-full h-full bg-transparent px-[17px] text-[#FAF8FF] text-[14px] sm:text-[16px] font-normal tracking-[1.60px] placeholder-[#FAF8FF]/50 focus:outline-none"
                                            style={{ fontFamily: 'Inter' }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Confirm Input */}
                                <div className="w-full">
                                    <div className="w-full h-[48px] sm:h-[54px] bg-[rgba(19,31,24,0.50)] rounded-[16px] overflow-hidden" style={{ outline: '1px solid rgba(255, 255, 255, 0.10)', outlineOffset: '-1px' }}>
                                        <input
                                            type="password"
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            placeholder="Parola Tekrarı"
                                            className="w-full h-full bg-transparent px-[17px] text-[#FAF8FF] text-[14px] sm:text-[16px] font-normal tracking-[1.60px] placeholder-[#FAF8FF]/50 focus:outline-none"
                                            style={{ fontFamily: 'Inter' }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Age Input */}
                                <div className="w-full">
                                    <div className="w-full h-[48px] sm:h-[54px] bg-[rgba(19,31,24,0.50)] rounded-[16px] overflow-hidden" style={{ outline: '1px solid rgba(255, 255, 255, 0.10)', outlineOffset: '-1px' }}>
                                        <input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            placeholder="Yaş"
                                            min="0"
                                            max="100"
                                            className="w-full h-full bg-transparent px-[17px] text-[#FAF8FF] text-[14px] sm:text-[16px] font-normal tracking-[0.40px] placeholder-[#FAF8FF]/50 focus:outline-none"
                                            style={{ fontFamily: 'Inter' }}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Contract Agreement */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <div
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all shrink-0 ${isAgreedContract ? 'border-[#C99BFF] bg-[#C99BFF]' : 'border-white/30'
                                            }`}
                                        onClick={() => setIsAgreedContract(!isAgreedContract)}
                                    >
                                        {isAgreedContract && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[#9CA3AF] text-[13px] leading-[18px]" style={{ fontFamily: 'Inter' }}>
                                        <Link href="#" className="text-[#C99BFF] hover:underline">Kullanım sözleşmesini</Link> okudum ve kabul ediyorum.
                                    </span>
                                </label>

                                {/* Turnstile CAPTCHA */}
                                {!skipTurnstile && (
                                    <div className="flex justify-center w-full min-h-[65px]">
                                        <div id="register-turnstile-container"></div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full p-[14px] sm:p-[16px] rounded-[24px] overflow-hidden flex justify-center items-center shadow-[0px_0px_20px_-5px_white] hover:opacity-90 transition disabled:opacity-50 relative"
                                    style={{
                                        background: 'linear-gradient(90deg, white 0%, #795D99 73%)',
                                    }}
                                >
                                    <span className="text-center text-white text-[16px] sm:text-[20px] font-bold leading-[24px]" style={{ fontFamily: 'LEMON MILK' }}>
                                        {isSubmitting ? 'KAYIT YAPILIYOR...' : 'KAYIT OL'}
                                    </span>
                                </button>
                            </div>
                        </form>

                        {/* Info Box */}
                        <div
                            className="self-stretch p-4 bg-[rgba(255,0,255,0.05)] rounded-[16px] flex justify-start items-start gap-4"
                            style={{
                                outline: '1px solid rgba(255, 255, 255, 0.05)',
                                outlineOffset: '-1px'
                            }}
                        >
                            <div className="w-6 h-6 shrink-0 relative">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#C99BFF]">
                                    <span className="text-black font-bold text-xs">i</span>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <span className="text-white/90 text-[14px] font-bold leading-[20px] font-manrope">
                                    E-posta Doğrulaması
                                </span>
                                <span
                                    className="text-[#9CA3AF] text-[12px] font-normal leading-[16px]"
                                    style={{ fontFamily: 'Inter' }}
                                >
                                    Kayıt olduktan sonra e-posta adresinize bir doğrulama bağlantısı gönderilecektir. Giriş yapabilmek için e-postanızı doğrulamanız gerekmektedir.
                                </span>
                            </div>
                        </div>

                        {/* Already have account link */}
                        <div className="self-stretch text-center">
                            <span className="text-[#9CA3AF] text-[14px]" style={{ fontFamily: 'Inter' }}>
                                Zaten bir hesabınız var mı?{' '}
                                <Link href="/giris-yap" className="text-[#C99BFF] hover:underline font-medium">
                                    Giriş Yap
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
