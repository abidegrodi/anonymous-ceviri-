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

    return (
        <div className="min-h-screen bg-[#0C080F] flex flex-col lg:flex-row">

            {/* Left Column - Background Image with Overlay (hidden on mobile) */}
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
                    style={{
                        background: 'linear-gradient(0deg, #050505 0%, rgba(5, 5, 5, 0) 50%, rgba(5, 5, 5, 0) 100%)'
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, rgba(5, 5, 5, 0.80) 0%, rgba(5, 5, 5, 0) 50%, rgba(5, 5, 5, 0) 100%)'
                    }}
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
                    <p
                        className="text-[#FAF8FF] text-base xl:text-[18px] font-bold leading-[28px]"
                        style={{ fontFamily: 'Inter' }}
                    >
                        Türkiye&apos;nin en kapsamlı oyun yerelleştirme platformuna hoş geldiniz.
                    </p>
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0 relative min-h-screen lg:min-h-0">
                {/* Back to Homepage Button */}
                <Link
                    href="/"
                    className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-1 hover:opacity-80 transition-opacity z-10"
                >
                    <div className="w-[18px] h-[22px] relative flex items-center justify-center">
                        <Image src="/icons/girisleft.svg" alt="Back" width={12} height={12} />
                    </div>
                    <span
                        className="text-[#9CA3AF] text-[14px] font-medium leading-[20px]"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                        Anasayfaya Dön
                    </span>
                </Link>

                <div className="w-full max-w-[576px] flex flex-col gap-6 items-start pt-16 sm:pt-8 lg:pt-0">
                    {/* Header Section */}
                    <div className="flex flex-col gap-2 w-full text-left">
                        <h2
                            className="font-bold"
                            style={{
                                fontFamily: 'Trajan Pro, serif',
                                fontSize: 'clamp(32px, 5vw, 47.6px)',
                                lineHeight: 'clamp(36px, 5.5vw, 48px)',
                                letterSpacing: '-2.4px',
                                fontWeight: 700,
                                background: 'linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textTransform: 'uppercase'
                            }}
                        >
                            SINIRLARI KALDIR.<br />OYUNA HÜKMET!
                        </h2>
                        <p className="text-[#9CA3AF] text-[14px] font-normal leading-[20px]" style={{ fontFamily: 'Inter' }}>
                            Hesabınıza giriş yapın.
                        </p>
                    </div>

                    {/* Login Form */}
                    {!showForgotPassword ? (
                        <form onSubmit={handleLogin} className="flex flex-col gap-5 sm:gap-6 p-5 sm:p-8 rounded-[24px] w-full" style={{ background: 'linear-gradient(135deg, rgba(26, 26, 42, 0.6) 0%, rgba(15, 15, 25, 0.8) 100%)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            {/* Email Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-[14px] font-medium" style={{ fontFamily: 'Inter' }}>
                                    E-Posta
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20">
                                        <Image src="/icons/girismessage.svg" alt="Email" width={20} height={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder=""
                                        className="w-full h-[48px] sm:h-[56px] pl-12 pr-4 rounded-[12px] text-white placeholder:text-[#666666] focus:outline-none transition-all border border-[#FAF8FF]/20"
                                        style={{
                                            fontFamily: 'Inter',
                                            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(121, 93, 153, 0.2) 90%)'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-white text-[14px] font-medium" style={{ fontFamily: 'Inter' }}>
                                        Şifre
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-[#9CA3AF] text-[12px] hover:text-white transition-colors"
                                        style={{ fontFamily: 'Inter' }}
                                    >
                                        Şifremi unuttum?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20">
                                        <Image src="/icons/girissifre.svg" alt="Password" width={20} height={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder=""
                                        className="w-full h-[48px] sm:h-[56px] pl-12 pr-4 rounded-[12px] text-white placeholder:text-[#666666] focus:outline-none transition-all border border-[#FAF8FF]/20"
                                        style={{
                                            fontFamily: 'Inter',
                                            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(121, 93, 153, 0.2) 90%)'
                                        }}
                                        required
                                    />
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
                                        options={{
                                            theme: 'dark',
                                            action: 'login',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Resend Verification Link */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    className="text-[#9CA3AF] text-[12px] hover:text-[#C99BFF] transition-colors underline"
                                    style={{ fontFamily: 'Inter' }}
                                >
                                    Doğrulama e-postasını tekrar gönder
                                </button>
                            </div>

                            {/* Buttons Row */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-[48px] rounded-[12px] font-bold text-[#1A1A2A] text-[14px] sm:text-[16px] transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{
                                        fontFamily: 'LEMON MILK, sans-serif',
                                        background: 'linear-gradient(135deg, #C8A2E0 0%, #A78BCA 100%)'
                                    }}
                                >
                                    {isSubmitting ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
                                    {!isSubmitting && <Image src="/icons/girisgiris.svg" alt="Arrow" width={20} height={20} />}
                                </button>
                                <Link
                                    href="/kayit-ol"
                                    className="flex-1 h-[48px] rounded-[12px] font-bold text-[#E9D5FF] text-[14px] sm:text-[16px] transition-opacity hover:opacity-70 flex items-center justify-center"
                                    style={{
                                        fontFamily: 'LEMON MILK, sans-serif',
                                        background: 'transparent',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    KAYIT OL
                                </Link>
                            </div>
                        </form>
                    ) : (
                        /* Forgot Password Form */
                        <form onSubmit={handleForgotPassword} className="flex flex-col gap-5 sm:gap-6 p-5 sm:p-8 rounded-[24px] w-full" style={{ background: 'linear-gradient(135deg, rgba(26, 26, 42, 0.6) 0%, rgba(15, 15, 25, 0.8) 100%)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-[14px] font-medium" style={{ fontFamily: 'Inter' }}>
                                    E-Posta Adresi
                                </label>
                                <p className="text-[#9CA3AF] text-[12px]" style={{ fontFamily: 'Inter' }}>
                                    Kayıtlı e-posta adresinize yeni şifreniz gönderilecektir.
                                </p>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-20">
                                        <Image src="/icons/girismessage.svg" alt="Email" width={20} height={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder="ornek@email.com"
                                        className="w-full h-[48px] sm:h-[56px] pl-12 pr-4 rounded-[12px] text-white placeholder:text-[#666666] focus:outline-none transition-all border border-[#FAF8FF]/20"
                                        style={{
                                            fontFamily: 'Inter',
                                            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(121, 93, 153, 0.2) 90%)'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    type="submit"
                                    disabled={forgotSubmitting}
                                    className="flex-1 h-[48px] rounded-[12px] font-bold text-[#1A1A2A] text-[14px] sm:text-[16px] transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{
                                        fontFamily: 'LEMON MILK, sans-serif',
                                        background: 'linear-gradient(135deg, #C8A2E0 0%, #A78BCA 100%)'
                                    }}
                                >
                                    {forgotSubmitting ? 'GÖNDERİLİYOR...' : 'ŞİFRE SIFIRLA'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="flex-1 h-[48px] rounded-[12px] font-bold text-[#E9D5FF] text-[14px] sm:text-[16px] transition-opacity hover:opacity-70 flex items-center justify-center"
                                    style={{
                                        fontFamily: 'LEMON MILK, sans-serif',
                                        background: 'transparent',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    GERİ DÖN
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Subscription Plan Section */}
                    <div className="mt-6 sm:mt-8 w-full">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div style={{ width: '32px', height: '1px', background: '#374151' }}></div>
                            <div style={{
                                color: '#FAF8FF',
                                fontSize: '14px',
                                fontFamily: 'LEMON MILK, sans-serif',
                                fontWeight: 400,
                                lineHeight: '22.75px',
                                letterSpacing: '0.05em'
                            }}>
                                ABONELİK PLANI
                            </div>
                            <div style={{ flex: 1, height: '1px', background: '#374151' }}></div>
                        </div>

                        {/* Subscription Card */}
                        <div className="relative w-full h-[186px] rounded-[12px] flex flex-col items-center justify-between"
                            style={{
                                background: 'rgba(17, 24, 24, 0.60)',
                                boxShadow: '0px 0px 20px rgba(255, 215, 0, 0.15)',
                                outline: '1px solid rgba(242, 185, 13, 0.50)',
                                outlineOffset: '-1px',
                                backdropFilter: 'blur(6px)',
                                overflow: 'hidden'
                            }}
                        >
                            <div className="absolute top-[1px] left-[1px] right-[1px] h-[4px] bg-[#F2B90D]"></div>
                            <div className="absolute top-[1px] right-[1px] px-3 py-1 bg-[#F2B90D] rounded-bl-[8px] flex items-center justify-center z-10">
                                <span style={{
                                    color: 'black',
                                    fontSize: '10px',
                                    fontFamily: 'Space Grotesk, sans-serif',
                                    fontWeight: 700,
                                    lineHeight: '15px'
                                }}>
                                    YENİ YILA ÖZEL ABONELİK FİYATI
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center h-full w-full pt-6">
                                <div className="mb-2">
                                    <Image src="/icons/girisabonelik.svg" alt="Subscription" width={36} height={36} />
                                </div>
                                <div className="text-center mb-2">
                                    <span style={{
                                        color: '#F2B90D',
                                        fontSize: '18px',
                                        fontFamily: 'Space Grotesk, sans-serif',
                                        fontWeight: 700,
                                        lineHeight: '28px'
                                    }}>
                                        Anonymous Aylık Aboneliği
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span style={{
                                        color: '#F2B90D',
                                        fontSize: '20px',
                                        fontFamily: 'Space Grotesk, sans-serif',
                                        fontWeight: 700,
                                        lineHeight: '28px'
                                    }}>
                                        ₺150
                                    </span>
                                    <span style={{
                                        color: '#FAF8FF',
                                        fontSize: '12px',
                                        fontFamily: 'Space Grotesk, sans-serif',
                                        fontWeight: 400,
                                        lineHeight: '16px'
                                    }}>
                                        /ay
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
