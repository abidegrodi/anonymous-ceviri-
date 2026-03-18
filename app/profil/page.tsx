"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { updateUsername } from '@/lib/services/profile';
import toast from 'react-hot-toast';

type TabType = 'genel' | 'indirme' | 'uyelik' | 'ayarlar';

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#12110E]">
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
    const { user, isAuthenticated, isLoading, logout, refreshUser, patchUser } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [usernameSubmitting, setUsernameSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('genel');
    const [editMode, setEditMode] = useState(false);
    const [editUsername, setEditUsername] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/giris-yap');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (user && !user.Username) {
            setShowUsernameModal(true);
        }
    }, [user]);

    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim()) { toast.error('Kullanıcı adı boş olamaz.'); return; }
        if (newUsername.length < 2 || newUsername.length > 30) { toast.error('Kullanıcı adı 2-30 karakter arasında olmalıdır.'); return; }
        setUsernameSubmitting(true);
        try {
            const trimmed = newUsername.trim();
            await updateUsername(trimmed);
            patchUser({ Username: trimmed });
            toast.success('Kullanıcı adı güncellendi!');
            setShowUsernameModal(false);
            setNewUsername('');
            if (searchParams.get('setup') === 'username') {
                router.replace('/profil');
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Kullanıcı adı güncellenemedi.');
        } finally { setUsernameSubmitting(false); }
    };

    const handleSaveEdit = async () => {
        if (!editUsername.trim()) { toast.error('Kullanıcı adı boş olamaz.'); return; }
        if (editUsername.length < 2 || editUsername.length > 30) { toast.error('Kullanıcı adı 2-30 karakter arasında olmalıdır.'); return; }
        setUsernameSubmitting(true);
        try {
            const trimmed = editUsername.trim();
            await updateUsername(trimmed);
            patchUser({ Username: trimmed });
            toast.success('Kullanıcı adı güncellendi!');
            setEditMode(false);
            setEditUsername('');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Kullanıcı adı güncellenemedi.');
        } finally { setUsernameSubmitting(false); }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#12110E]">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-12 h-12 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    if (!user) return null;

    const registerDate = user.RegisterDate ? new Date(user.RegisterDate).toLocaleDateString('tr-TR') : '-';
    const initial = (user.Username || user.Email)?.[0]?.toUpperCase() || '?';

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'genel', label: 'Genel Bakış', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
        { id: 'indirme', label: 'İndirmelerim', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" strokeLinecap="round" /></svg> },
        { id: 'uyelik', label: 'Üyelik', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" /></svg> },
        { id: 'ayarlar', label: 'Ayarlar', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg> },
    ];

    return (
        <main className="min-h-screen bg-[#12110E]">
            <Header />

            {/* Username Modal */}
            {showUsernameModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="w-full max-w-[440px] p-6 sm:p-8 rounded-[20px]" style={{ background: 'linear-gradient(145deg, rgba(30,28,22,0.95) 0%, rgba(18,17,14,0.98) 100%)', border: '1px solid rgba(201,155,255,0.10)' }}>
                        <h2 className="text-white text-lg font-bold mb-2" style={{ fontFamily: 'Trajan Pro, serif' }}>Kullanıcı Adı Belirle</h2>
                        <p className="text-white/60 text-sm mb-6" style={{ fontFamily: 'Caviar Dreams' }}>
                            {user.Username ? 'Kullanıcı adınızı güncelleyebilirsiniz.' : 'Yorum yapabilmek için bir kullanıcı adı belirlemeniz gerekmektedir.'}
                        </p>
                        <form onSubmit={handleUpdateUsername} className="flex flex-col gap-4">
                            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Kullanıcı adınız (2-30 karakter)"
                                className="w-full h-[48px] px-4 rounded-xl text-white placeholder:text-white/20 focus:outline-none transition-all bg-white/5 focus:bg-white/8 text-sm"
                                style={{ fontFamily: 'Caviar Dreams', border: '1px solid rgba(201,155,255,0.15)' }} minLength={2} maxLength={30} required />
                            <div className="flex gap-3">
                                <button type="submit" disabled={usernameSubmitting}
                                    className="flex-1 h-[44px] rounded-xl font-bold text-[13px] text-[#12110E] hover:brightness-110 transition disabled:opacity-50"
                                    style={{ background: '#C99BFF', fontFamily: 'Caviar Dreams' }}>
                                    {usernameSubmitting ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                                </button>
                                {user.Username && (
                                    <button type="button" onClick={() => setShowUsernameModal(false)}
                                        className="flex-1 h-[44px] rounded-xl text-white/50 text-[13px] hover:bg-white/5 transition"
                                        style={{ border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Caviar Dreams' }}>
                                        İPTAL
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="relative z-10 pt-[80px]">
                <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-8">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-3 text-sm mb-8">
                        <Link href="/" className="text-white/50 hover:text-[#C99BFF] transition-colors" style={{ fontFamily: 'Caviar Dreams' }}>Ana Sayfa</Link>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                        <span className="font-medium" style={{ fontFamily: 'Caviar Dreams', background: 'linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(121,93,153,0.90) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Profil</span>
                    </div>

                    {/* Profile Header */}
                    <div className="relative p-5 sm:p-8 rounded-[20px] overflow-hidden mb-6" style={{ background: 'linear-gradient(145deg, rgba(30,28,22,0.80) 0%, rgba(20,18,14,0.70) 100%)', border: '1px solid rgba(201,155,255,0.06)', backdropFilter: 'blur(12px)' }}>
                        <div className="absolute -top-24 -right-16 w-64 h-64 rounded-full" style={{ background: 'rgba(201,155,255,0.05)', filter: 'blur(80px)' }} />
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2a1b3d 0%, #1a1128 100%)', border: '2px solid rgba(201,155,255,0.15)', boxShadow: '0 0 30px rgba(201,155,255,0.15)' }}>
                                    <span className="text-[#C99BFF] text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Caviar Dreams' }}>{initial}</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0DF269', border: '2px solid #12110E' }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#12110E" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                {editMode ? (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white/50 text-[12px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams' }}>Kullanıcı Adı</label>
                                        <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Kullanıcı adınız"
                                            className="w-full sm:max-w-[300px] h-[44px] px-4 rounded-xl text-white placeholder:text-white/20 focus:outline-none text-base font-bold bg-white/5"
                                            style={{ fontFamily: 'Caviar Dreams', border: '1px solid rgba(201,155,255,0.25)' }} autoFocus minLength={2} maxLength={30}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') { setEditMode(false); setEditUsername(''); } }} />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-white/95 text-xl sm:text-2xl font-bold truncate" style={{ fontFamily: '"Trajan Pro", serif' }}>
                                            {user.Username || 'Kullanıcı adı belirlenmemiş'}
                                        </h1>
                                        <div className="mt-2 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold  tracking-wider"
                                                style={{ background: 'rgba(201,155,255,0.10)', border: '1px solid rgba(201,155,255,0.20)', color: '#C99BFF', fontFamily: 'Caviar Dreams' }}>
                                                ÜYE
                                            </span>
                                            <span className="text-white/40 text-[12px]" style={{ fontFamily: 'Caviar Dreams' }}>{user.Email}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 flex items-center gap-2">
                                {editMode ? (
                                    <>
                                        <button onClick={handleSaveEdit} disabled={usernameSubmitting}
                                            className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-[#12110E] hover:brightness-110 transition disabled:opacity-50"
                                            style={{ background: '#C99BFF', fontFamily: 'Caviar Dreams' }}>
                                            {usernameSubmitting ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                                        </button>
                                        <button onClick={() => { setEditMode(false); setEditUsername(''); }} disabled={usernameSubmitting}
                                            className="px-5 py-2.5 rounded-xl text-white/40 text-[12px] hover:bg-white/5 transition"
                                            style={{ border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Caviar Dreams' }}>
                                            İPTAL
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => { setEditUsername(user.Username || ''); setEditMode(true); }}
                                        className="px-5 py-2.5 rounded-xl text-white/60 text-[13px] font-bold hover:bg-white/8 hover:text-white/80 transition"
                                        style={{ border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Caviar Dreams' }}>
                                        DÜZENLE
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
                        {tabs.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl shrink-0 transition-all duration-200 ${activeTab === tab.id ? 'bg-white/8' : 'hover:bg-white/4'}`}
                                style={{ border: activeTab === tab.id ? '1px solid rgba(201,155,255,0.25)' : '1px solid transparent' }}>
                                <span className={activeTab === tab.id ? 'text-[#C99BFF]' : 'text-white/40'}>{tab.icon}</span>
                                <span className="text-[12px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: activeTab === tab.id ? '#C99BFF' : 'rgba(255,255,255,0.55)' }}>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'genel' && <GenelTab registerDate={registerDate} />}
                    {activeTab === 'indirme' && <IndirmeTab />}
                    {activeTab === 'uyelik' && <UyelikTab />}
                    {activeTab === 'ayarlar' && <AyarlarTab user={user} onEditUsername={() => { setEditUsername(user.Username || ''); setEditMode(true); }} onLogout={logout} />}
                </div>
            </div>

            <Footer />
        </main>
    );
}

/* ========== GENEL BAKIŞ ========== */
function GenelTab({ registerDate }: { registerDate: string }) {
    return (
        <div className="flex flex-col gap-5">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Toplam İndirme" value="-" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="1.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" strokeLinecap="round" /></svg>} />
                <StatCard label="Kayıt Tarihi" value={registerDate} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>} />
                <StatCard label="Kalan Süre" value="-" suffix="GÜN" accent icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2B90D" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
            </div>

            {/* Son İndirmeler */}
            <div className="rounded-[20px] overflow-hidden" style={{ background: 'rgba(24,22,17,0.65)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-5 sm:px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-2.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" /></svg>
                        <span className="text-[13px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.80)' }}>Son İndirmeler</span>
                    </div>
                </div>
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 sm:px-6 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.40)' }}>Oyun Adı</span>
                    <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.40)' }}>Platform</span>
                    <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.40)' }}>Tarih</span>
                    <span className="text-[11px] font-bold tracking-wider text-right" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.40)' }}>Durum</span>
                </div>
                <div className="px-5 sm:px-6 py-12 text-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" className="mx-auto mb-3"><path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" /><path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" strokeLinecap="round" /></svg>
                    <p className="text-white/40 text-sm font-medium" style={{ fontFamily: 'Caviar Dreams' }}>Henüz indirme geçmişiniz bulunmamaktadır.</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, suffix, icon, accent }: { label: string; value: string; suffix?: string; icon: React.ReactNode; accent?: boolean }) {
    const accentColor = accent ? '#F2B90D' : '#C99BFF';
    return (
        <div className="relative p-5 rounded-[16px] overflow-hidden flex flex-col justify-between min-h-[140px]"
            style={{ background: 'rgba(24,22,17,0.65)', border: accent ? '1px solid rgba(242,185,13,0.12)' : '1px solid rgba(255,255,255,0.06)' }}>
            {accent && <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)` }} />}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
                {icon}
            </div>
            <div className="mt-4">
                <span className="text-[12px] font-bold tracking-wider block mb-1" style={{ fontFamily: 'Caviar Dreams', color: accent ? `${accentColor}99` : 'rgba(255,255,255,0.50)' }}>{label}</span>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold" style={{ fontFamily: 'Caviar Dreams', color: accent ? accentColor : 'rgba(255,255,255,0.85)' }}>{value}</span>
                    {suffix && <span className="text-sm" style={{ fontFamily: 'Caviar Dreams', color: `${accentColor}60` }}>{suffix}</span>}
                </div>
            </div>
        </div>
    );
}

/* ========== İNDİRME GEÇMİŞİ ========== */
function IndirmeTab() {
    return (
        <div className="rounded-[20px] overflow-hidden" style={{ background: 'rgba(24,22,17,0.65)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-5 sm:px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="1.5"><path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" strokeLinecap="round" /></svg>
                <span className="text-[13px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.80)' }}>İndirme Geçmişi</span>
            </div>
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 sm:px-6 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.40)' }}>Oyun Adı</span>
                <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.40)' }}>Platform</span>
                <span className="text-[11px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.40)' }}>Tarih</span>
                <span className="text-[11px] font-bold tracking-wider text-right" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.40)' }}>Durum</span>
            </div>
            <div className="px-5 sm:px-6 py-16 text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" className="mx-auto mb-3"><path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" /><path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" strokeLinecap="round" /></svg>
                <p className="text-white/40 text-sm font-medium" style={{ fontFamily: 'Caviar Dreams' }}>Henüz indirme geçmişiniz bulunmamaktadır.</p>
            </div>
        </div>
    );
}

/* ========== ÜYELİK ========== */
function UyelikTab() {
    return (
        <div className="rounded-[20px] overflow-hidden" style={{ background: 'rgba(24,22,17,0.65)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-5 sm:px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-[13px] font-bold tracking-wider" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.80)' }}>Üyelik Planım</span>
            </div>
            <div className="p-6 sm:p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(201,155,255,0.06)', border: '1px solid rgba(201,155,255,0.12)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(201,155,255,0.40)" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 className="text-white/80 text-base font-bold mb-2" style={{ fontFamily: 'Trajan Pro, serif', fontSize: '16px' }}>Aktif Üyeliğiniz Bulunmamaktadır</h3>
                <p className="text-white/50 text-sm max-w-md mx-auto mb-7 font-medium" style={{ fontFamily: 'Caviar Dreams' }}>
                    Anonymous Çeviri üyeliği ile tüm Türkçe çevirilere erişim sağlayabilirsiniz.
                </p>
                <a href="https://odeme.anonymousceviri.com" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-[13px] text-[#12110E] hover:brightness-110 transition"
                    style={{ background: 'linear-gradient(135deg, #C99BFF 0%, #9B6DD7 100%)', fontFamily: 'Caviar Dreams' }}>
                    ÜYELİK SATIN AL
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#12110E" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
            </div>
        </div>
    );
}

/* ========== AYARLAR ========== */
function AyarlarTab({ user, onEditUsername, onLogout }: { user: any; onEditUsername: () => void; onLogout: () => void }) {
    return (
        <div className="flex flex-col gap-4">
            {/* Kullanıcı Adı */}
            <div className="p-5 rounded-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{ background: 'rgba(24,22,17,0.65)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                    <span className="text-[12px] font-bold tracking-wider block mb-1" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.45)' }}>Kullanıcı Adı</span>
                    <span className="text-white/90 text-[15px] font-bold" style={{ fontFamily: 'Caviar Dreams' }}>{user.Username || 'Belirlenmemiş'}</span>
                </div>
                <button onClick={onEditUsername}
                    className="shrink-0 px-4 py-2 rounded-lg text-white/55 text-[12px] font-bold hover:bg-white/5 hover:text-white/70 transition"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Caviar Dreams' }}>
                    DÜZENLE
                </button>
            </div>

            {/* E-posta */}
            <div className="p-5 rounded-[16px]" style={{ background: 'rgba(24,22,17,0.65)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-[12px] font-bold tracking-wider block mb-1" style={{ fontFamily: 'Caviar Dreams', color: 'rgba(255,255,255,0.45)' }}>E-Posta Adresi</span>
                <span className="text-white/90 text-[15px] font-bold" style={{ fontFamily: 'Caviar Dreams' }}>{user.Email}</span>
            </div>

            {/* Çıkış */}
            <div className="pt-4">
                <button onClick={onLogout}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-[#FF5555] text-[13px] font-bold hover:bg-[#FF5555]/8 transition"
                    style={{ border: '1px solid rgba(255,85,85,0.15)', fontFamily: 'Caviar Dreams' }}>
                    ÇIKIŞ YAP
                </button>
            </div>
        </div>
    );
}
