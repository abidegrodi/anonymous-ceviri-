"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/lib/auth-context';
import { updateUsername } from '@/lib/services/profile';
import toast from 'react-hot-toast';

type SidebarTab = 'genel' | 'indirme' | 'uyelik' | 'ayarlar';

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#0a0a0a] font-sans">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-12 h-12 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
                </div>
            </main>
        }>
            <ProfileContent />
        </Suspense>
    );
}

function ProfileContent() {
    const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [usernameSubmitting, setUsernameSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<SidebarTab>('genel');
    const [editMode, setEditMode] = useState(false);
    const [editUsername, setEditUsername] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/giris-yap');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (searchParams.get('setup') === 'username' || (user && !user.Username)) {
            setShowUsernameModal(true);
        }
    }, [searchParams, user]);

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim()) {
            toast.error('Kullanıcı adı boş olamaz.');
            return;
        }
        if (newUsername.length < 2 || newUsername.length > 30) {
            toast.error('Kullanıcı adı 2-30 karakter arasında olmalıdır.');
            return;
        }
        setUsernameSubmitting(true);
        try {
            await updateUsername(newUsername.trim());
            toast.success('Kullanıcı adı güncellendi!');
            setShowUsernameModal(false);
            setNewUsername('');
            await refreshUser();
        } catch {
        } finally {
            setUsernameSubmitting(false);
        }
    };

    const handleStartEdit = () => {
        setEditUsername(user?.Username || '');
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditUsername('');
    };

    const handleSaveEdit = async () => {
        if (!editUsername.trim()) {
            toast.error('Kullanıcı adı boş olamaz.');
            return;
        }
        if (editUsername.length < 2 || editUsername.length > 30) {
            toast.error('Kullanıcı adı 2-30 karakter arasında olmalıdır.');
            return;
        }
        setUsernameSubmitting(true);
        try {
            await updateUsername(editUsername.trim());
            toast.success('Kullanıcı adı güncellendi!');
            setEditMode(false);
            setEditUsername('');
            await refreshUser();
        } catch {
        } finally {
            setUsernameSubmitting(false);
        }
    };

    const handleTabClick = (tab: SidebarTab) => {
        setActiveTab(tab);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] font-sans">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-12 h-12 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    if (!user) return null;

    const registerDate = user.RegisterDate
        ? new Date(user.RegisterDate).toLocaleDateString('tr-TR')
        : '-';

    const sidebarItems: { key: SidebarTab; label: string; icon: string }[] = [
        { key: 'genel', label: 'Genel Bakış', icon: '/icons/genelbakis.svg' },
        { key: 'indirme', label: 'İndirme Geçmişi', icon: '/icons/indirmegecmisi.svg' },
        { key: 'uyelik', label: 'Üyelik Planım', icon: '/icons/uyelikplani.svg' },
        { key: 'ayarlar', label: 'Ayarlar', icon: '/icons/ayarlar.svg' },
    ];

    return (
        <main className="min-h-screen bg-[#0a0a0a] font-sans">
            <Header />

            {/* Username Modal */}
            {showUsernameModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="w-full max-w-[480px] p-6 sm:p-8 rounded-[24px] relative" style={{ background: 'linear-gradient(135deg, rgba(26, 26, 42, 0.95) 0%, rgba(15, 15, 25, 0.98) 100%)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <h2 className="text-white text-lg sm:text-xl font-bold mb-2" style={{ fontFamily: 'Inter' }}>
                            Kullanıcı Adı Belirle
                        </h2>
                        <p className="text-[#9CA3AF] text-sm mb-6" style={{ fontFamily: 'Inter' }}>
                            {user.Username ? 'Kullanıcı adınızı güncelleyebilirsiniz.' : 'Yorum yapabilmek için bir kullanıcı adı belirlemeniz gerekmektedir.'}
                        </p>
                        <form onSubmit={handleUpdateUsername} className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Kullanıcı adınız (2-30 karakter)"
                                className="w-full h-[48px] px-4 rounded-[12px] text-white placeholder:text-[#666666] focus:outline-none transition-all border border-[#FAF8FF]/20 bg-white/5"
                                style={{ fontFamily: 'Inter' }}
                                minLength={2}
                                maxLength={30}
                                required
                            />
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={usernameSubmitting}
                                    className="flex-1 h-[44px] rounded-[12px] font-bold text-[#1A1A2A] text-[14px] transition-opacity hover:opacity-90 disabled:opacity-50"
                                    style={{ background: '#C99BFF', fontFamily: 'Inter' }}
                                >
                                    {usernameSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                                </button>
                                {user.Username && (
                                    <button
                                        type="button"
                                        onClick={() => setShowUsernameModal(false)}
                                        className="flex-1 h-[44px] rounded-[12px] text-white/60 text-[14px] transition-opacity hover:opacity-70"
                                        style={{ border: '1px solid rgba(255, 255, 255, 0.1)', fontFamily: 'Inter' }}
                                    >
                                        İptal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Mini Sidebar (icon-only) */}
            <aside className="lg:hidden fixed left-0 top-[80px] w-[56px] h-[calc(100vh-80px)] flex flex-col justify-between py-4 bg-[#0a0a0a] border-r border-[rgba(168,133,209,0.12)] z-40">
                <div className="flex flex-col items-center gap-2">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => handleTabClick(item.key)}
                            className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                activeTab === item.key
                                    ? 'bg-[rgba(201,155,255,0.12)]'
                                    : 'hover:bg-white/5'
                            }`}
                            title={item.label}
                        >
                            {activeTab === item.key && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#C99BFF] rounded-r-full" />
                            )}
                            <Image src={item.icon} alt={item.label} width={20} height={20} className={activeTab === item.key ? '' : 'opacity-50'} />
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => logout()}
                    className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center hover:bg-[#FF5555]/10 transition-all"
                    title="Çıkış Yap"
                >
                    <Image src="/icons/cikisyap.svg" alt="Çıkış Yap" width={20} height={20} className="opacity-60" />
                </button>
            </aside>

            {/* Desktop Sidebar (full) */}
            <aside className="hidden lg:flex fixed left-0 top-[80px] w-[287px] h-[calc(100vh-80px)] flex-col justify-between py-8 px-4 bg-[#0a0a0a] border-r border-[rgba(168,133,209,0.15)] z-40">
                <div className="space-y-4">
                    {sidebarItems.map((item) => (
                        <div
                            key={item.key}
                            onClick={() => handleTabClick(item.key)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                                activeTab === item.key
                                    ? 'border-l-4 border-[#C99BFF] bg-[rgba(255,0,255,0.10)]'
                                    : 'hover:bg-white/5 text-[#9CA3AF] hover:text-[#D1D5DB]'
                            }`}
                        >
                            <div className="relative w-6 h-6 flex items-center justify-center">
                                <Image src={item.icon} alt={item.label} width={24} height={24} className={activeTab === item.key ? '' : 'opacity-70'} />
                            </div>
                            <span className={`text-sm font-bold font-lemon-milk uppercase tracking-wide ${
                                activeTab === item.key ? 'text-[#C99BFF]' : ''
                            }`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    onClick={() => logout()}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer hover:bg-white/5 transition-all mt-auto group"
                >
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        <Image src="/icons/cikisyap.svg" alt="Çıkış Yap" width={24} height={24} />
                    </div>
                    <span className="text-[#FF5555] text-sm font-bold font-lemon-milk uppercase tracking-wide group-hover:text-[#ff7777]">
                        ÇIKIŞ YAP
                    </span>
                </div>
            </aside>

            {/* Main content area */}
            <div className="ml-[56px] lg:ml-[287px] pt-[80px] min-h-screen flex justify-center bg-[#0a0a0a] px-3 sm:px-6 lg:px-8">
                <div className="relative mt-4 sm:mt-8 lg:mt-12 w-full max-w-[1024px] pb-8">

                    {/* Profile Header Card */}
                    <div className={`w-full relative bg-[#121212] rounded-xl overflow-hidden border ${editMode ? 'border-[#C99BFF]/40' : 'border-[#272727]'} transition-colors`} style={{ minHeight: '140px' }}>
                        <div className="absolute w-[256px] h-[256px] right-[-60px] top-[-127px] bg-[rgba(201,155,255,0.10)] rounded-full blur-[32px] hidden sm:block" style={{ boxShadow: '64px 64px 64px' }}></div>

                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                            {/* Avatar */}
                            <div className="relative shrink-0 group">
                                <div
                                    className={`w-16 h-16 sm:w-[88px] sm:h-[88px] md:w-[112px] md:h-[112px] bg-[#1A1A1A] rounded-xl border-2 ${editMode ? 'border-[#C99BFF]/30 cursor-pointer' : 'border-[rgba(255,0,255,0.05)]'} shadow-[0_0_20px_rgba(201,155,255,0.34)] overflow-hidden flex items-center justify-center relative`}
                                    onClick={() => {
                                        if (editMode) toast('Profil fotoğrafı özelliği yakında aktif olacak.', { icon: '📷' });
                                    }}
                                >
                                    <div className="w-full h-full bg-gradient-to-br from-[#2a1b3d] to-[#121212] flex items-center justify-center">
                                        <span className="text-[#C99BFF] text-xl sm:text-2xl md:text-3xl font-bold">
                                            {(user.Username || user.Email)?.[0]?.toUpperCase() || '?'}
                                        </span>
                                    </div>
                                    {editMode && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {!editMode && (
                                    <div className="absolute bottom-[-6px] right-[-6px] w-5 h-5 sm:w-6 sm:h-6 bg-black rounded-full flex items-center justify-center border border-[rgba(255,0,255,0.05)] z-10">
                                        <Image src="/icons/check.svg" alt="Status" width={12} height={12} />
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0 text-center sm:text-left w-full sm:w-auto">
                                {editMode ? (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[#9CA3AF] text-[11px] font-lemon-milk uppercase tracking-wider">Kullanıcı Adı</label>
                                        <input
                                            type="text"
                                            value={editUsername}
                                            onChange={(e) => setEditUsername(e.target.value)}
                                            placeholder="Kullanıcı adınız (2-30 karakter)"
                                            className="w-full sm:max-w-[320px] h-[44px] px-4 rounded-lg text-white placeholder:text-[#666666] focus:outline-none transition-all border border-[#C99BFF]/30 bg-white/5 focus:border-[#C99BFF]/60 text-base sm:text-lg font-bold"
                                            style={{ fontFamily: 'Inter' }}
                                            minLength={2}
                                            maxLength={30}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveEdit();
                                                if (e.key === 'Escape') handleCancelEdit();
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                                            <h1 className="text-white/90 text-lg sm:text-2xl md:text-[30px] font-bold font-trajan tracking-wide leading-tight truncate">
                                                {user.Username || 'Kullanıcı adı belirlenmemiş'}
                                            </h1>
                                        </div>
                                        <div className="mt-2 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-lemon-milk uppercase tracking-wider"
                                                style={{
                                                    background: 'rgba(168, 133, 209, 0.15)',
                                                    border: '1px solid rgba(168, 133, 209, 0.3)',
                                                    color: '#C99BFF',
                                                }}
                                            >
                                                <Image src="/icons/abone.svg" alt="Abone" width={12} height={12} />
                                                ÜYE
                                            </span>
                                            <span className="text-[#6B7280] text-xs font-lemon-milk">ID: #{user.UserId}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Edit / Save / Cancel Buttons */}
                            <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                                {editMode ? (
                                    <>
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={usernameSubmitting}
                                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-[#1A1A2A] text-xs sm:text-sm font-lemon-milk font-bold hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
                                            style={{ background: '#C99BFF' }}
                                        >
                                            {usernameSubmitting ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={usernameSubmitting}
                                            className="flex-1 sm:flex-none px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#9CA3AF] text-xs sm:text-sm font-lemon-milk hover:bg-white/10 transition whitespace-nowrap"
                                        >
                                            İPTAL
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleStartEdit}
                                        className="w-full sm:w-auto px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#D1D5DB] text-xs sm:text-sm font-lemon-milk hover:bg-white/10 transition whitespace-nowrap"
                                    >
                                        PROFİLİ DÜZENLE
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'genel' && (
                        <GenelBakisTab registerDate={registerDate} />
                    )}
                    {activeTab === 'indirme' && (
                        <IndirmeGecmisiTab />
                    )}
                    {activeTab === 'uyelik' && (
                        <UyelikPlaniTab />
                    )}
                    {activeTab === 'ayarlar' && (
                        <AyarlarTab
                            user={user}
                            onEditUsername={handleStartEdit}
                            onLogout={logout}
                        />
                    )}

                    {/* Footer Text */}
                    <div className="mt-12 mb-8 text-center text-[#4B5563] text-xs font-lemon-milk">
                        ANONYMOUS ÇEVİRİ © 2026 - v3.5.0 SYSTEM_READY
                    </div>
                </div>
            </div>
        </main>
    );
}

/* ========== GENEL BAKIŞ TAB ========== */
function GenelBakisTab({ registerDate }: { registerDate: string }) {
    return (
        <>
            {/* Stats Row */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1 - Toplam İndirme */}
                <div className="bg-[#121212] border border-[#272727] rounded-xl p-5 flex flex-col justify-between min-h-[160px] sm:min-h-[185px]">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-[rgba(168,85,247,0.10)] rounded-lg">
                            <Image src="/icons/toplamindirme2.svg" width={22} height={16} alt="Toplam İndirme" />
                        </div>
                        <span className="text-[#FAF8FF] text-[10px] bg-[#1F2937] px-1 py-0.5 rounded border border-[#1F2937]">DAT_01</span>
                    </div>
                    <div>
                        <span className="text-[#9CA3AF] text-xs font-lemon-milk font-medium uppercase tracking-wider block mb-1">Toplam İndirme</span>
                        <span className="text-white/90 text-2xl sm:text-3xl font-lemon-milk font-bold">-</span>
                    </div>
                </div>

                {/* Card 2 - Kayıt Tarihi */}
                <div className="bg-[#121212] border border-[#272727] rounded-xl p-5 flex flex-col justify-between min-h-[160px] sm:min-h-[185px]">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-[rgba(168,85,247,0.10)] rounded-lg">
                            <Image src="/icons/kayittarihi.svg" width={18} height={20} alt="Kayıt Tarihi" />
                        </div>
                        <span className="text-[#FAF8FF] text-[10px] bg-[#1F2937] px-1 py-0.5 rounded border border-[#1F2937]">DAT_02</span>
                    </div>
                    <div>
                        <span className="text-[#9CA3AF] text-xs font-lemon-milk font-medium uppercase tracking-wider block mb-1">Kayıt Tarihi</span>
                        <span className="text-white/90 text-2xl sm:text-3xl font-lemon-milk font-bold">{registerDate}</span>
                    </div>
                </div>

                {/* Card 3 - Kalan Süre */}
                <div className="sm:col-span-2 lg:col-span-1 bg-[#121212] border border-[rgba(242,185,13,0.15)] rounded-xl p-5 flex flex-col justify-between min-h-[160px] sm:min-h-[185px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#F2B90D] to-[#F2B90D]/50"></div>
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-[rgba(242,185,13,0.10)] rounded-lg">
                            <Image src="/icons/kalansure.svg" width={16} height={20} alt="Kalan Süre" />
                        </div>
                        <span className="text-[#F2B90D]/50 text-[10px] border border-[rgba(242,185,13,0.15)] px-1.5 py-0.5 rounded">AKT_01</span>
                    </div>
                    <div>
                        <span className="text-[rgba(242,185,13,0.70)] text-xs font-lemon-milk font-medium uppercase tracking-wider block mb-1">Kalan Süre</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[#F2B90D] text-2xl sm:text-3xl font-lemon-milk font-bold drop-shadow-[0_0_10px_rgba(242,185,13,0.3)]">-</span>
                            <span className="text-[#F2B90D]/60 text-sm font-lemon-milk">GÜN</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Son İndirmeler Section */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Image src="/icons/sonindirmeler.svg" alt="Son İndirmeler" width={20} height={20} />
                        <h2 className="text-white/90 text-sm font-lemon-milk font-bold uppercase tracking-wide">Son İndirmeler</h2>
                    </div>
                    <button className="text-[#C99BFF] text-xs font-lemon-milk hover:opacity-80 transition-opacity uppercase tracking-wide">
                        Tümünü Gör
                    </button>
                </div>

                {/* Table */}
                <div className="bg-[#121212] border border-[#272727] rounded-xl overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-[#272727]">
                        <span className="text-[#6B7280] text-[11px] font-lemon-milk uppercase tracking-wider">Oyun Adı</span>
                        <span className="text-[#6B7280] text-[11px] font-lemon-milk uppercase tracking-wider">Platform</span>
                        <span className="text-[#6B7280] text-[11px] font-lemon-milk uppercase tracking-wider">Tarih</span>
                        <span className="text-[#6B7280] text-[11px] font-lemon-milk uppercase tracking-wider text-right">Durum</span>
                    </div>

                    {/* Empty State */}
                    <div className="px-5 py-10 text-center">
                        <p className="text-[#4B5563] text-sm font-lemon-milk">Henüz indirme geçmişiniz bulunmamaktadır.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ========== İNDİRME GEÇMİŞİ TAB ========== */
function IndirmeGecmisiTab() {
    return (
        <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
                <Image src="/icons/indirmegecmisi.svg" alt="İndirme Geçmişi" width={24} height={24} />
                <h2 className="text-white/90 text-lg font-lemon-milk font-bold uppercase tracking-wide">İndirme Geçmişi</h2>
            </div>

            <div className="bg-[#121212] border border-[#272727] rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-[#272727]">
                    <span className="text-[#6B7280] text-[11px] font-lemon-milk uppercase tracking-wider">Oyun Adı</span>
                    <span className="text-[#6B7280] text-[11px] font-lemon-milk uppercase tracking-wider">Platform</span>
                    <span className="text-[#6B7280] text-[11px] font-lemon-milk uppercase tracking-wider">Tarih</span>
                    <span className="text-[#6B7280] text-[11px] font-lemon-milk uppercase tracking-wider text-right">Durum</span>
                </div>

                {/* Empty State */}
                <div className="px-5 py-16 text-center">
                    <p className="text-[#4B5563] text-sm font-lemon-milk">Henüz indirme geçmişiniz bulunmamaktadır.</p>
                </div>
            </div>
        </div>
    );
}

/* ========== ÜYELİK PLANI TAB ========== */
function UyelikPlaniTab() {
    return (
        <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
                <Image src="/icons/uyelikplani.svg" alt="Üyelik Planım" width={24} height={24} />
                <h2 className="text-white/90 text-lg font-lemon-milk font-bold uppercase tracking-wide">Üyelik Planım</h2>
            </div>

            <div className="bg-[#121212] border border-[#272727] rounded-xl p-6 sm:p-8">
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(168,85,247,0.10)] flex items-center justify-center">
                        <Image src="/icons/uyelikplani.svg" alt="Üyelik" width={32} height={32} className="opacity-50" />
                    </div>
                    <h3 className="text-white/70 text-lg font-lemon-milk font-bold mb-2">Aktif Üyeliğiniz Bulunmamaktadır</h3>
                    <p className="text-[#6B7280] text-sm max-w-md mx-auto mb-6">
                        Anonymous Çeviri üyeliği ile tüm Türkçe çevirilere erişim sağlayabilirsiniz.
                    </p>
                    <a
                        href="https://www.anonymousceviri.com/uyelik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] text-[#1A1A2A] hover:opacity-90 transition-opacity"
                        style={{
                            background: 'linear-gradient(135deg, #C8A2E0 0%, #A78BCA 100%)',
                            fontFamily: 'LEMON MILK',
                        }}
                    >
                        ÜYELİK SATIN AL
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ========== AYARLAR TAB ========== */
function AyarlarTab({ user, onEditUsername, onLogout }: { user: any; onEditUsername: () => void; onLogout: () => void }) {
    return (
        <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
                <Image src="/icons/ayarlar.svg" alt="Ayarlar" width={24} height={24} />
                <h2 className="text-white/90 text-lg font-lemon-milk font-bold uppercase tracking-wide">Ayarlar</h2>
            </div>

            <div className="space-y-4">
                {/* Kullanıcı Adı */}
                <div className="bg-[#121212] border border-[#272727] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-[#9CA3AF] text-xs font-lemon-milk uppercase tracking-wider block mb-1">Kullanıcı Adı</span>
                        <span className="text-white/90 text-base font-medium">{user.Username || 'Belirlenmemiş'}</span>
                    </div>
                    <button
                        onClick={onEditUsername}
                        className="shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#D1D5DB] text-xs font-lemon-milk hover:bg-white/10 transition"
                    >
                        DÜZENLE
                    </button>
                </div>

                {/* E-posta */}
                <div className="bg-[#121212] border border-[#272727] rounded-xl p-5">
                    <span className="text-[#9CA3AF] text-xs font-lemon-milk uppercase tracking-wider block mb-1">E-Posta Adresi</span>
                    <span className="text-white/90 text-base font-medium">{user.Email}</span>
                </div>

                {/* Kullanıcı ID */}
                <div className="bg-[#121212] border border-[#272727] rounded-xl p-5">
                    <span className="text-[#9CA3AF] text-xs font-lemon-milk uppercase tracking-wider block mb-1">Kullanıcı ID</span>
                    <span className="text-white/90 text-base font-medium">#{user.UserId}</span>
                </div>

                {/* Çıkış Yap */}
                <div className="pt-4">
                    <button
                        onClick={onLogout}
                        className="w-full sm:w-auto px-8 py-3 rounded-xl text-[#FF5555] text-sm font-lemon-milk font-bold border border-[#FF5555]/20 hover:bg-[#FF5555]/10 transition"
                    >
                        ÇIKIŞ YAP
                    </button>
                </div>
            </div>
        </div>
    );
}
