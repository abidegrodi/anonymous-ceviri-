"use client";

import { useState, useEffect, useRef, useId } from 'react';
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
    const [showPassword, setShowPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const [siteKey, setSiteKey] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSubmitting, setForgotSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    const uid = useId();
    const emailId = `${uid}-email`;
    const passwordId = `${uid}-password`;
    const forgotEmailId = `${uid}-forgot-email`;
    const forgotDescId = `${uid}-forgot-desc`;

    const { login, forgotPassword, resendVerification, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) router.push('/');
    }, [isAuthenticated, router]);

    const skipTurnstile = isTurnstileSkipped();

    useEffect(() => {
        if (skipTurnstile) return;
        getSitekey().then(setSiteKey).catch(() => {});
    }, [skipTurnstile]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { toast.error('E-posta ve şifre gereklidir.'); return; }
        setIsSubmitting(true);
        try {
            await login(email, password, turnstileToken || undefined);
            toast.success('Giriş başarılı!');
        } catch {
            turnstileRef.current?.reset();
            setTurnstileToken('');
        } finally { setIsSubmitting(false); }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) { toast.error('E-posta adresi gereklidir.'); return; }
        setForgotSubmitting(true);
        try {
            const result = await forgotPassword(forgotEmail);
            if (result.success) { toast.success(result.message); setShowForgotPassword(false); setForgotEmail(''); }
        } catch { /* handled by context */ } finally { setForgotSubmitting(false); }
    };

    const handleResendVerification = async () => {
        if (!email) { toast.error('Lütfen önce e-posta adresinizi girin.'); return; }
        try { const result = await resendVerification(email); toast.success(result.message); } catch { /* handled */ }
    };

    const inputStyles = (field: string) => ({
        fontFamily: 'Caviar Dreams',
        background: focusedField === field ? 'rgba(201,155,255,0.06)' : 'rgba(255,255,255,0.025)',
        border: focusedField === field ? '1px solid rgba(201,155,255,0.30)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: focusedField === field
            ? '0 0 0 3px rgba(201,155,255,0.06), 0 4px 16px rgba(201,155,255,0.08)'
            : 'none',
    });

    return (
        <main className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">

            {/* ══════════════════════════════════════════
                PHOTO BACKGROUND — Mobile & Tablet
                Fixed behind everything, visible through
                content padding-top and overlay opacity
            ══════════════════════════════════════════ */}
            <div className="fixed inset-0 lg:hidden" aria-hidden="true">
                <Image
                    src="/girisbackground.png"
                    alt=""
                    fill
                    className="object-cover object-center scale-[1.05] md:blur-[3px]"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.80) 35%, rgba(10,10,10,0.96) 65%, #0A0A0A 100%)',
                }} />
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse 90% 50% at 50% 20%, rgba(201,155,255,0.06) 0%, transparent 70%)',
                }} />
            </div>

            {/* ══════════════════════════════════════════
                PHOTO PANEL — Desktop (lg+)
                Sticky left column with layered overlays
                for quality masking & edge transition
            ══════════════════════════════════════════ */}
            <aside
                className="hidden lg:flex fixed top-0 left-0 w-[50%] xl:w-[54%] h-screen flex-col justify-between overflow-hidden"
                aria-hidden="true"
            >
                <Image
                    src="/girisbackground.png"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    sizes="55vw"
                />
                {/* Bottom fade to #0A0A0A */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(0deg, #0A0A0A 0%, rgba(10,10,10,0.35) 35%, transparent 60%)',
                }} />
                {/* Right edge: smooth transition into form panel */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(90deg, transparent 25%, rgba(10,10,10,0.45) 65%, #0A0A0A 100%)',
                }} />
                {/* Top darken for logo contrast */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(10,10,10,0.45) 0%, transparent 30%)',
                }} />
                {/* Brand color tint — masks artifacts, unifies palette */}
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse 70% 60% at 35% 50%, rgba(121,93,153,0.12) 0%, transparent 70%)',
                }} />

                {/* Logo */}
                <div className="relative z-10 p-8 xl:p-10">
                    <Link href="/" aria-label="Ana sayfaya dön">
                        <Image src="/logo-anonymous.png" alt="Anonymous Çeviri" width={160} height={32} priority />
                    </Link>
                </div>

                {/* Hero copy */}
                <div className="relative z-10 px-8 xl:px-10 pb-12 max-w-[480px]">
                    <h1 className="mb-4" style={{
                        fontFamily: 'Trajan Pro, serif',
                        fontWeight: 700,
                        fontSize: 'clamp(26px, 2.4vw, 38px)',
                        lineHeight: 1.2,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 20%, rgba(201,155,255,0.55) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        GELECEĞİ KENDİ<br />DİLİNDE OYNA
                    </h1>
                    <p className="text-white/40 text-[15px] xl:text-[16px] leading-[26px]" style={{ fontFamily: 'Caviar Dreams' }}>
                        Türkiye&apos;nin en kapsamlı oyun yerelleştirme platformuna hoş geldiniz.
                    </p>
                </div>

                {/* Vertical separator */}
                <div className="absolute top-[8%] bottom-[8%] right-0 w-px" style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(201,155,255,0.08) 30%, rgba(201,155,255,0.08) 70%, transparent 100%)',
                }} />
            </aside>

            {/* ══════════════════════════════════════════
                SCROLLABLE CONTENT — Auth Panel
                Mobile: scrolls over fixed photo
                Tablet: scrolls over blurred photo
                Desktop: positioned to the right of aside
            ══════════════════════════════════════════ */}
            <div className="relative z-10 min-h-screen flex flex-col lg:ml-[50%] xl:ml-[54%]">

                {/* ── Top navigation bar ── */}
                <nav className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6 lg:pt-8 lg:px-10">
                    <Link href="/" className="lg:hidden" aria-label="Ana sayfaya dön">
                        <Image src="/logo-anonymous.png" alt="Anonymous Çeviri" width={130} height={26} priority />
                    </Link>
                    <span className="hidden lg:block" aria-hidden="true" />
                    <Link
                        href="/"
                        className="h-9 lg:h-10 px-4 lg:px-5 rounded-xl flex items-center gap-2 text-[11px] lg:text-[12px] font-bold transition-all duration-200 hover:bg-white/[0.04] active:scale-95"
                        style={{
                            fontFamily: 'Caviar Dreams',
                            color: 'rgba(201,155,255,0.50)',
                            border: '1px solid rgba(201,155,255,0.12)',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="hidden sm:inline">Anasayfaya Dön</span>
                    </Link>
                </nav>

                {/* ── Form area — vertically centered ── */}
                <section className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 sm:py-14 lg:py-0">
                    <div className="w-full max-w-[440px] flex flex-col gap-8">

                        {/* Page heading */}
                        <header>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-6 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #C99BFF, transparent)' }} />
                                <span className="text-[9px] uppercase tracking-[3px] text-[#C99BFF]/40" style={{ fontFamily: 'Caviar Dreams' }}>Hesap</span>
                            </div>
                            <h2 className="font-bold uppercase mb-2" style={{
                                fontFamily: 'Trajan Pro, serif',
                                fontSize: 'clamp(24px, 5vw, 34px)',
                                lineHeight: 1.15,
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(201,155,255,0.55) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                GİRİŞ YAP
                            </h2>
                            <p className="text-white/30 text-[13px] sm:text-[14px]" style={{ fontFamily: 'Caviar Dreams' }}>
                                Hesabınıza giriş yaparak tüm çevirilere erişin.
                            </p>
                        </header>

                        {/* ── Login Form ── */}
                        {!showForgotPassword ? (
                            <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>

                                {/* Email field */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor={emailId}
                                        className="text-white/45 text-[11px] font-bold uppercase tracking-[1.5px]"
                                        style={{ fontFamily: 'Caviar Dreams' }}
                                    >
                                        E-Posta
                                    </label>
                                    <div className="relative">
                                        <span
                                            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200 ${focusedField === 'email' ? 'opacity-60' : 'opacity-25'}`}
                                            aria-hidden="true"
                                        >
                                            <Image src="/icons/girismessage.svg" alt="" width={18} height={18} />
                                        </span>
                                        <input
                                            id={emailId}
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="ornek@email.com"
                                            autoComplete="email"
                                            required
                                            className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[14px] text-white placeholder:text-white/15 outline-none transition-all duration-300"
                                            style={inputStyles('email')}
                                        />
                                    </div>
                                </div>

                                {/* Password field */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <label
                                            htmlFor={passwordId}
                                            className="text-white/45 text-[11px] font-bold uppercase tracking-[1.5px]"
                                            style={{ fontFamily: 'Caviar Dreams' }}
                                        >
                                            Şifre
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-[#C99BFF]/25 text-[11px] hover:text-[#C99BFF]/60 transition-colors duration-200"
                                            style={{ fontFamily: 'Caviar Dreams' }}
                                        >
                                            Şifremi Unuttum
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span
                                            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200 ${focusedField === 'password' ? 'opacity-60' : 'opacity-25'}`}
                                            aria-hidden="true"
                                        >
                                            <Image src="/icons/girissifre.svg" alt="" width={18} height={18} />
                                        </span>
                                        <input
                                            id={passwordId}
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            required
                                            className="w-full h-[52px] pl-11 pr-12 rounded-[14px] text-[14px] text-white placeholder:text-white/15 outline-none transition-all duration-300"
                                            style={inputStyles('password')}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors duration-200"
                                            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Turnstile CAPTCHA */}
                                {!skipTurnstile && siteKey && (
                                    <div className="flex justify-center">
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

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative w-full h-[52px] rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2.5 disabled:opacity-50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,155,255,0.18)] active:scale-[0.98] overflow-hidden group"
                                    style={{ fontFamily: 'Caviar Dreams', color: '#0A0A0A' }}
                                >
                                    <span className="absolute inset-0 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, #C99BFF 0%, #A67CD9 50%, #7B5EA7 100%)' }} />
                                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, #D4AFFF 0%, #C99BFF 50%, #A67CD9 100%)' }} />
                                    <span className="absolute inset-[1px] rounded-[13px] opacity-20 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, transparent 40%)' }} />
                                    <span className="relative z-10 flex items-center gap-2.5">
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" role="status" aria-label="Giriş yapılıyor" />
                                        ) : (
                                            <>
                                                GİRİŞ YAP
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                                    <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-4" role="separator">
                                    <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05))' }} />
                                    <span className="text-[9px] text-white/10 uppercase tracking-[2px]" style={{ fontFamily: 'Caviar Dreams' }}>veya</span>
                                    <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' }} />
                                </div>

                                {/* Register CTA */}
                                <Link
                                    href="/kayit-ol"
                                    className="w-full h-[48px] rounded-[14px] flex items-center justify-center gap-2 text-[12px] font-bold no-underline transition-all duration-300 hover:bg-white/[0.03] hover:border-white/10 active:scale-[0.98]"
                                    style={{
                                        fontFamily: 'Caviar Dreams',
                                        color: 'rgba(255,255,255,0.25)',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                    }}
                                >
                                    HESABIN YOK MU?
                                    <span style={{ color: '#C99BFF' }}>KAYIT OL</span>
                                </Link>

                                {/* Resend verification */}
                                <p className="text-center m-0">
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        className="text-white/10 text-[11px] hover:text-[#C99BFF]/40 transition-colors duration-200"
                                        style={{ fontFamily: 'Caviar Dreams' }}
                                    >
                                        Doğrulama e-postasını tekrar gönder
                                    </button>
                                </p>
                            </form>
                        ) : (
                            /* ── Forgot Password Form ── */
                            <form onSubmit={handleForgotPassword} className="flex flex-col gap-5" noValidate>
                                {/* Info card */}
                                <div className="flex items-start gap-3.5 p-4 rounded-2xl" style={{
                                    background: 'rgba(201,155,255,0.03)',
                                    border: '1px solid rgba(201,155,255,0.08)',
                                }}>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{
                                        background: 'rgba(201,155,255,0.06)',
                                        border: '1px solid rgba(201,155,255,0.10)',
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="1.5" aria-hidden="true">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-white/60 text-[12px] font-bold block mb-0.5" style={{ fontFamily: 'Caviar Dreams' }}>
                                            Şifre Sıfırlama
                                        </span>
                                        <span id={forgotDescId} className="text-white/25 text-[12px] leading-relaxed" style={{ fontFamily: 'Caviar Dreams' }}>
                                            Kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderilecektir.
                                        </span>
                                    </div>
                                </div>

                                {/* Forgot email field */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor={forgotEmailId}
                                        className="text-white/45 text-[11px] font-bold uppercase tracking-[1.5px]"
                                        style={{ fontFamily: 'Caviar Dreams' }}
                                    >
                                        E-Posta
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none" aria-hidden="true">
                                            <Image src="/icons/girismessage.svg" alt="" width={18} height={18} />
                                        </span>
                                        <input
                                            id={forgotEmailId}
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            onFocus={() => setFocusedField('forgotEmail')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="ornek@email.com"
                                            autoComplete="email"
                                            aria-describedby={forgotDescId}
                                            required
                                            className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[14px] text-white placeholder:text-white/15 outline-none transition-all duration-300"
                                            style={inputStyles('forgotEmail')}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={forgotSubmitting}
                                        className="flex-1 h-[48px] rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                                        style={{ fontFamily: 'Caviar Dreams', background: 'linear-gradient(135deg, #C99BFF 0%, #7B5EA7 100%)', color: '#0A0A0A' }}
                                    >
                                        {forgotSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" role="status" aria-label="Gönderiliyor" />
                                        ) : 'GÖNDER'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(false)}
                                        className="h-[48px] px-6 rounded-[14px] text-white/25 text-[12px] font-bold hover:bg-white/[0.03] hover:text-white/40 transition-all duration-200 active:scale-[0.98]"
                                        style={{ fontFamily: 'Caviar Dreams', border: '1px solid rgba(255,255,255,0.04)' }}
                                    >
                                        GERİ
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── Subscription Teaser ── */}
                        <section
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(242,185,13,0.03) 0%, rgba(242,185,13,0.01) 100%)',
                                border: '1px solid rgba(242,185,13,0.08)',
                            }}
                            aria-label="Abonelik planı"
                        >
                            <span className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(242,185,13,0.25) 50%, transparent 90%)' }} aria-hidden="true" />
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(242,185,13,0.06)', border: '1px solid rgba(242,185,13,0.10)' }}>
                                        <Image src="/icons/girisabonelik.svg" alt="" width={20} height={20} />
                                    </div>
                                    <div>
                                        <span className="text-[12px] text-white/55 font-bold block leading-tight" style={{ fontFamily: 'Caviar Dreams' }}>Anonymous Abonelik</span>
                                        <span className="text-[11px] text-white/20" style={{ fontFamily: 'Caviar Dreams' }}>Tüm çevirilere sınırsız erişim</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 pl-4">
                                    <span className="text-[20px] font-bold" style={{ fontFamily: 'Trajan Pro', color: '#F2B90D' }}>₺150</span>
                                    <span className="text-[11px] text-white/20" style={{ fontFamily: 'Caviar Dreams' }}>/ay</span>
                                </div>
                            </div>
                        </section>

                    </div>
                </section>

                {/* Footer — mobile & tablet only */}
                <footer className="lg:hidden text-center pb-6 pt-2">
                    <small className="text-[10px] text-white/10" style={{ fontFamily: 'Caviar Dreams' }}>
                        © 2026 Anonymous Çeviri. Tüm hakları saklıdır.
                    </small>
                </footer>
            </div>
        </main>
    );
}
