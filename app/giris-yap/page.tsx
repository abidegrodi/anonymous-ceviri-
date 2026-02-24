"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useAuth } from '@/lib/auth-context';
import { getSitekey, isTurnstileSkipped } from '@/lib/services/auth';
import toast from 'react-hot-toast';

export default function GirisYapPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const [siteKey, setSiteKey] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSubmitting, setForgotSubmitting] = useState(false);
    const turnstileRef = useRef<TurnstileInstance>(null);

    const { login, forgotPassword, resendVerification, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const skipTurnstile = isTurnstileSkipped();

    useEffect(() => {
        if (skipTurnstile) return;
        getSitekey()
            .then(setSiteKey)
            .catch(() => {});
    }, [skipTurnstile]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('E-posta ve şifre gereklidir.');
            return;
        }
        setIsSubmitting(true);
        try {
            await login(email, password, turnstileToken || undefined);
            toast.success('Giriş başarılı!');
        } catch (error: any) {
            turnstileRef.current?.reset();
            setTurnstileToken('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.error('E-posta adresi gereklidir.');
            return;
        }
        setForgotSubmitting(true);
        try {
            const result = await forgotPassword(forgotEmail);
            if (result.success) {
                toast.success(result.message);
                setShowForgotPassword(false);
                setForgotEmail('');
            }
        } catch {
        } finally {
            setForgotSubmitting(false);
        }
    };

    const handleResendVerification = async () => {
        if (!email) {
            toast.error('Lütfen önce e-posta adresinizi girin.');
            return;
        }
        try {
            const result = await resendVerification(email);
            toast.success(result.message);
        } catch {
        }
    };

    const inputClass = "w-full h-12 sm:h-[54px] pl-12 pr-4 rounded-xl text-[14px] sm:text-[15px] text-white placeholder:text-white/20 focus:outline-none transition-all duration-200 border border-white/[0.08] focus:border-[#C99BFF]/30 focus:shadow-[0_0_20px_rgba(201,155,255,0.08)]";
    const inputBg = "rgba(201,155,255,0.03)";

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row">

            {/* Left Column - Desktop only */}
            <div className="relative hidden lg:block lg:w-1/2 xl:w-[960px] h-screen overflow-hidden shrink-0">
                <Image
                    src="/girisbackground.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div
                    className="absolute inset-0 opacity-90"
                    style={{ background: 'linear-gradient(0deg, #050505 0%, rgba(5, 5, 5, 0) 50%, rgba(5, 5, 5, 0) 100%)' }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, rgba(5, 5, 5, 0.80) 0%, rgba(5, 5, 5, 0) 50%, rgba(5, 5, 5, 0) 100%)' }}
                />
                <div className="absolute left-8 xl:left-12 bottom-[48px] max-w-[448px]">
                    <h1
                        className="text-[28px] xl:text-[36px] leading-[36px] xl:leading-[45px] mb-4"
                        style={{
                            fontFamily: 'Trajan Pro, serif',
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #FFFFFF 0%, #795D99 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        GELECEĞİ KENDİ<br />DİLİNDE OYNA!
                    </h1>
                    <p className="text-[#FAF8FF] text-base xl:text-[18px] font-bold leading-[28px]" style={{ fontFamily: 'Inter' }}>
                        Türkiye&apos;nin en kapsamlı oyun yerelleştirme platformuna hoş geldiniz.
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col lg:justify-center relative min-h-screen lg:min-h-0 overflow-y-auto">
                {/* Ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(201,155,255,0.04) 0%, transparent 70%)" }} />

                {/* Back to home - all screens */}
                <div className="flex justify-end px-4 sm:px-6 lg:px-0 pt-4 sm:pt-6 lg:pt-0 lg:absolute lg:top-8 lg:right-8 relative z-10">
                    <Link
                        href="/"
                        className="h-10 px-5 rounded-xl flex items-center gap-2 no-underline transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_4px_16px_rgba(201,155,255,0.15)] active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, rgba(201,155,255,0.12) 0%, rgba(120,80,200,0.06) 100%)',
                            border: '1px solid rgba(201,155,255,0.2)',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2.5">
                            <path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[13px] font-bold text-[#C99BFF]" style={{ fontFamily: 'Caviar Dreams' }}>
                            Anasayfaya Dön
                        </span>
                    </Link>
                </div>

                {/* Content */}
                <div className="w-full max-w-[520px] mx-auto flex flex-col gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-0 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col gap-2 sm:gap-3 w-full">
                        <h2
                            className="font-bold uppercase"
                            style={{
                                fontFamily: 'Trajan Pro, serif',
                                fontSize: 'clamp(24px, 6vw, 44px)',
                                lineHeight: '1.15',
                                letterSpacing: '-1px',
                                background: 'linear-gradient(180deg, #FFFFFF 0%, #C99BFF 60%, #795D99 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            SINIRLARI KALDIR.<br />OYUNA HÜKMET!
                        </h2>
                        <p className="text-white/35 text-[14px] sm:text-[15px] leading-relaxed" style={{ fontFamily: 'Caviar Dreams' }}>
                            Hesabınıza giriş yapın.
                        </p>
                    </div>

                    {/* Login Form */}
                    {!showForgotPassword ? (
                        <form
                            onSubmit={handleLogin}
                            className="flex flex-col gap-4 sm:gap-5 p-5 sm:p-6 md:p-8 rounded-2xl w-full relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(201,155,255,0.04) 0%, rgba(120,80,200,0.02) 100%)',
                                border: '1px solid rgba(201,155,255,0.1)',
                            }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,155,255,0.3) 50%, transparent 100%)" }} />

                            {/* Email */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="text-white/70 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider" style={{ fontFamily: 'Caviar Dreams' }}>
                                    E-Posta
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20 opacity-40">
                                        <Image src="/icons/girismessage.svg" alt="" width={20} height={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ornek@email.com"
                                        className={inputClass}
                                        style={{ fontFamily: 'Caviar Dreams', background: inputBg }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-white/70 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider" style={{ fontFamily: 'Caviar Dreams' }}>
                                        Şifre
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-[#C99BFF]/40 text-[11px] sm:text-[12px] hover:text-[#C99BFF]/80 transition-colors"
                                        style={{ fontFamily: 'Caviar Dreams' }}
                                    >
                                        Şifremi unuttum?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20 opacity-40">
                                        <Image src="/icons/girissifre.svg" alt="" width={20} height={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={inputClass}
                                        style={{ fontFamily: 'Caviar Dreams', background: inputBg }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Turnstile */}
                            {!skipTurnstile && siteKey && (
                                <div className="flex justify-center overflow-x-auto">
                                    <Turnstile
                                        ref={turnstileRef}
                                        siteKey={siteKey}
                                        onSuccess={(token) => setTurnstileToken(token)}
                                        onError={() => setTurnstileToken('')}
                                        onExpire={() => setTurnstileToken('')}
                                        options={{ theme: 'dark', action: 'login' }}
                                    />
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-1">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-12 sm:h-[48px] rounded-xl font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(201,155,255,0.2)] active:scale-[0.98]"
                                    style={{
                                        fontFamily: 'Caviar Dreams',
                                        background: 'linear-gradient(135deg, #C99BFF 0%, #7B5EA7 100%)',
                                        color: '#0a0a0a',
                                        boxShadow: '0 2px 12px rgba(201,155,255,0.12)',
                                    }}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            GİRİŞ YAP
                                            <Image src="/icons/girisgiris.svg" alt="" width={18} height={18} />
                                        </>
                                    )}
                                </button>
                                <Link
                                    href="/kayit-ol"
                                    className="flex-1 h-12 sm:h-[48px] rounded-xl font-bold text-[14px] sm:text-[15px] flex items-center justify-center no-underline transition-all duration-200 hover:bg-white/[0.04] active:scale-[0.98]"
                                    style={{
                                        fontFamily: 'Caviar Dreams',
                                        color: 'rgba(201,155,255,0.6)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    KAYIT OL
                                </Link>
                            </div>

                            {/* Resend verification */}
                            <div className="text-center pt-1">
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    className="text-white/20 text-[11px] sm:text-[12px] hover:text-[#C99BFF]/60 transition-colors"
                                    style={{ fontFamily: 'Caviar Dreams' }}
                                >
                                    Doğrulama e-postasını tekrar gönder
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Forgot Password */
                        <form
                            onSubmit={handleForgotPassword}
                            className="flex flex-col gap-4 sm:gap-5 p-5 sm:p-6 md:p-8 rounded-2xl w-full relative overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(201,155,255,0.04) 0%, rgba(120,80,200,0.02) 100%)',
                                border: '1px solid rgba(201,155,255,0.1)',
                            }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,155,255,0.3) 50%, transparent 100%)" }} />

                            <div className="flex flex-col gap-2 sm:gap-3">
                                <label className="text-white/70 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider" style={{ fontFamily: 'Caviar Dreams' }}>
                                    E-Posta Adresi
                                </label>
                                <p className="text-white/25 text-[12px] sm:text-[13px] leading-relaxed" style={{ fontFamily: 'Caviar Dreams' }}>
                                    Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderilecektir.
                                </p>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20 opacity-40">
                                        <Image src="/icons/girismessage.svg" alt="" width={20} height={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder="ornek@email.com"
                                        className={inputClass}
                                        style={{ fontFamily: 'Caviar Dreams', background: inputBg }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-1">
                                <button
                                    type="submit"
                                    disabled={forgotSubmitting}
                                    className="flex-1 h-12 sm:h-[48px] rounded-xl font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(201,155,255,0.2)] active:scale-[0.98]"
                                    style={{
                                        fontFamily: 'Caviar Dreams',
                                        background: 'linear-gradient(135deg, #C99BFF 0%, #7B5EA7 100%)',
                                        color: '#0a0a0a',
                                        boxShadow: '0 2px 12px rgba(201,155,255,0.12)',
                                    }}
                                >
                                    {forgotSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                                    ) : 'ŞİFRE SIFIRLA'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="flex-1 h-12 sm:h-[48px] rounded-xl font-bold text-[14px] sm:text-[15px] flex items-center justify-center transition-all duration-200 hover:bg-white/[0.04] active:scale-[0.98]"
                                    style={{
                                        fontFamily: 'Caviar Dreams',
                                        color: 'rgba(201,155,255,0.6)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    GERİ DÖN
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Subscription */}
                    <div className="w-full pb-4 sm:pb-0">
                        <div className="flex items-center gap-3 mb-4 sm:mb-5">
                            <div className="h-[1px] w-6 sm:w-8" style={{ background: "linear-gradient(90deg, rgba(201,155,255,0.3) 0%, transparent 100%)" }} />
                            <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[1.5px] sm:tracking-[2px] whitespace-nowrap" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(201,155,255,0.4)' }}>
                                Abonelik Planı
                            </span>
                            <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)" }} />
                        </div>

                        <div
                            className="relative w-full rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(242,185,13,0.04) 0%, rgba(242,185,13,0.01) 100%)',
                                border: '1px solid rgba(242,185,13,0.15)',
                                minHeight: '150px',
                            }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F2B90D 50%, transparent 100%)" }} />

                            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg" style={{ background: 'rgba(242,185,13,0.12)', border: '1px solid rgba(242,185,13,0.2)' }}>
                                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: '#F2B90D' }}>
                                    ÖZEL FİYAT
                                </span>
                            </div>

                            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(242,185,13,0.06) 0%, transparent 70%)" }} />

                            <div className="mb-2 sm:mb-3">
                                <Image src="/icons/girisabonelik.svg" alt="" width={28} height={28} className="sm:w-8 sm:h-8" />
                            </div>
                            <h3 className="text-[14px] sm:text-[16px] font-bold mb-1.5 sm:mb-2 text-center" style={{ fontFamily: 'Caviar Dreams', color: '#F2B90D' }}>
                                Anonymous Aylık Aboneliği
                            </h3>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-[20px] sm:text-[24px] font-bold" style={{ fontFamily: 'Caviar Dreams', color: '#F2B90D' }}>
                                    ₺150
                                </span>
                                <span className="text-[12px] sm:text-[13px] text-white/30" style={{ fontFamily: 'Caviar Dreams' }}>
                                    /ay
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
