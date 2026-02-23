"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { getGameDetail, type GameDetail } from "@/lib/services/games";
import { getComments, createComment, editComment, deleteComment, likeComment, dislikeComment, type Comment, type CommentsResponse } from "@/lib/services/comments";
import { getNotificationStatus, toggleReleaseNotification, toggleUpdateNotification, type NotificationStatus } from "@/lib/services/notifications";
import { getStickers, sendSticker, type Sticker } from "@/lib/services/stickers";
import { useAuth } from "@/lib/auth-context";

type TabType = "about" | "notes" | "comments";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.slug);
  const { user, isAuthenticated, requireAuth, requireUsername } = useAuth();

  const [game, setGame] = useState<GameDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("about");

  // Comments state
  const [commentsData, setCommentsData] = useState<CommentsResponse | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsSortBy, setCommentsSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [commentsPage, setCommentsPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Notifications state
  const [notifStatus, setNotifStatus] = useState<NotificationStatus | null>(null);
  const [notifLoading, setNotifLoading] = useState(false);

  // Stickers state
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [showStickerPicker, setShowStickerPicker] = useState<number | null>(null);

  // Fetch game detail
  useEffect(() => {
    if (!gameId || isNaN(gameId)) {
      router.push('/turkce-ceviriler');
      return;
    }

    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const data = await getGameDetail(gameId);
        setGame(data);
      } catch (error: any) {
        if (error?.status === 404) {
          router.push('/turkce-ceviriler');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId, router]);

  // Fetch comments when tab changes
  const fetchComments = useCallback(async () => {
    if (!gameId) return;
    setCommentsLoading(true);
    try {
      const data = await getComments(gameId, { page: commentsPage, limit: 10, sortBy: commentsSortBy });
      setCommentsData(data);
    } catch {
      // Handled by interceptor
    } finally {
      setCommentsLoading(false);
    }
  }, [gameId, commentsPage, commentsSortBy]);

  useEffect(() => {
    if (activeTab === 'comments') {
      fetchComments();
    }
  }, [activeTab, fetchComments]);

  // Fetch notification status
  useEffect(() => {
    if (isAuthenticated && gameId) {
      getNotificationStatus(gameId)
        .then(setNotifStatus)
        .catch(() => {});
    }
  }, [isAuthenticated, gameId]);

  // Fetch stickers
  useEffect(() => {
    getStickers()
      .then(setStickers)
      .catch(() => {});
  }, []);

  // Handlers
  const handleCreateComment = async () => {
    if (!requireAuth()) return;
    if (!requireUsername()) return;
    if (!newComment.trim()) {
      toast.error('Yorum boş olamaz.');
      return;
    }
    setCommentSubmitting(true);
    try {
      await createComment(gameId, newComment.trim());
      toast.success('Yorumunuz gönderildi. Admin onayından sonra yayınlanacaktır.');
      setNewComment('');
      fetchComments();
    } catch {
      // Handled
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleReply = async (parentId: number) => {
    if (!requireAuth()) return;
    if (!requireUsername()) return;
    if (!replyContent.trim()) return;
    setCommentSubmitting(true);
    try {
      await createComment(gameId, replyContent.trim(), parentId);
      toast.success('Yanıtınız gönderildi. Admin onayından sonra yayınlanacaktır.');
      setReplyingTo(null);
      setReplyContent('');
      fetchComments();
    } catch {
      // Handled
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return;
    setCommentSubmitting(true);
    try {
      await editComment(commentId, editContent.trim());
      toast.success('Yorum güncellendi. Admin onayından sonra tekrar yayınlanacaktır.');
      setEditingCommentId(null);
      setEditContent('');
      fetchComments();
    } catch {
      // Handled
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    try {
      await deleteComment(commentId);
      toast.success('Yorum silindi.');
      fetchComments();
    } catch {
      // Handled
    }
  };

  // Optimistic like/dislike
  const handleLike = async (comment: Comment) => {
    if (!requireAuth()) return;

    // Optimistic update
    const prevLikes = comment.reactions.likes;
    const prevDislikes = comment.reactions.dislikes;

    try {
      const result = await likeComment(comment.id);
      // Refresh comments to get accurate counts
      fetchComments();
    } catch {
      // Revert handled by refetch
    }
  };

  const handleDislike = async (comment: Comment) => {
    if (!requireAuth()) return;

    try {
      await dislikeComment(comment.id);
      fetchComments();
    } catch {
      // Handled
    }
  };

  const handleToggleRelease = async () => {
    if (!requireAuth()) return;
    setNotifLoading(true);
    try {
      const result = await toggleReleaseNotification(gameId);
      setNotifStatus(prev => prev ? { ...prev, release: result.subscribed } : null);
      toast.success(result.subscribed ? 'Yayın bildirimlerine abone oldunuz.' : 'Yayın bildirimlerinden çıkıldı.');
    } catch {
      // Handled
    } finally {
      setNotifLoading(false);
    }
  };

  const handleToggleUpdate = async () => {
    if (!requireAuth()) return;
    setNotifLoading(true);
    try {
      const result = await toggleUpdateNotification(gameId);
      setNotifStatus(prev => prev ? { ...prev, update: result.subscribed } : null);
      toast.success(result.subscribed ? 'Güncelleme bildirimlerine abone oldunuz.' : 'Güncelleme bildirimlerinden çıkıldı.');
    } catch {
      // Handled
    } finally {
      setNotifLoading(false);
    }
  };

  const handleSendSticker = async (commentId: number, stickerId: number) => {
    if (!requireAuth()) return;
    try {
      const result = await sendSticker(commentId, stickerId);
      toast.success(`Sticker gönderildi! Kalan bakiye: ${result.newBalance} puan`);
      setShowStickerPicker(null);
      fetchComments();
    } catch {
      // Handled (yetersiz puan vs.)
    }
  };

  const tabs = [
    { id: "about" as TabType, label: "ÇEVİRİ HAKKINDA", isLink: false },
    { id: "install" as TabType | "install", label: "KURULUM REHBERİ", isLink: true, href: `/ceviriler/${gameId}/kurulum` },
    { id: "notes" as TabType, label: "ÇEVİRİ NOTLARI", isLink: false },
    { id: "comments" as TabType, label: "YORUMLAR", isLink: false },
  ];

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#12110E]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
            <span className="text-white/50 text-sm" style={{ fontFamily: "Inter" }}>Oyun bilgileri yükleniyor...</span>
          </div>
        </div>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="min-h-screen bg-[#12110E]">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-white/30 text-6xl">🎮</span>
            <h3 className="text-white/70 text-lg font-bold">Oyun bulunamadı</h3>
            <Link href="/turkce-ceviriler" className="text-[#C99BFF] hover:underline">Tüm çevirilere dön</Link>
          </div>
        </div>
      </main>
    );
  }

  const mainPhoto = game.photos?.find(p => p.isMain) || game.photos?.[0];

  return (
    <main className="min-h-screen bg-[#12110E]">
      <Header />

      {/* Hero Background */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: "linear-gradient(0deg, #12110E 0%, #12110E 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url(${game.backgroundURL || '/assets/oyundetayhero.png'})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "blur(2px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(0deg, #12110E 0%, rgba(18, 17, 14, 0.80) 50%, rgba(18, 17, 14, 0.40) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(242, 166, 13, 0.03) 3%, rgba(242, 166, 13, 0) 3%),
              linear-gradient(90deg, rgba(242, 166, 13, 0.03) 3%, rgba(242, 166, 13, 0) 3%)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-[80px]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8 flex-wrap">
            <Link href="/" className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px" }}>
              ANASAYFA
            </Link>
            <span className="text-white/30">/</span>
            <Link href="/turkce-ceviriler" className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px" }}>
              ÇEVİRİLER
            </Link>
            <span className="text-white/30">/</span>
            <span className="uppercase font-medium" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "14px", color: "#C99BFF" }}>
              {game.name.toUpperCase()}
            </span>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6" style={{ maxWidth: "800px" }}>
              {/* Game Info Card */}
              <div
                className="relative p-4 sm:p-8 md:p-12 rounded-[16px] sm:rounded-[32px] overflow-hidden"
                style={{
                  background: "rgba(24, 22, 17, 0.65)",
                  boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)",
                  outline: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="absolute -top-20 -right-10 w-64 h-64 rounded-full" style={{ background: "rgba(255, 94, 0, 0.20)", filter: "blur(50px)" }} />

                <div className="relative z-10 flex flex-col gap-10">
                  {/* Categories + Title */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex flex-col gap-5 flex-1">
                      <div className="flex flex-wrap gap-2">
                        {game.categories?.map((cat, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(255, 255, 255, 0.10)", outline: "1px solid rgba(255, 255, 255, 0.05)", color: "rgba(255, 255, 255, 0.90)", fontFamily: "Space Grotesk, sans-serif" }}>
                            {cat.name}
                          </span>
                        ))}
                      </div>
                      <h1 className="uppercase" style={{ fontFamily: "Trajan Pro, serif", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700, lineHeight: "1.1", color: "rgba(255, 255, 255, 0.90)", textShadow: "0px 0px 10px rgba(242, 166, 13, 0.50)" }}>
                        {game.name}
                      </h1>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 pt-1">
                      <span className="uppercase text-right" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "13px", lineHeight: "18px", letterSpacing: "1.4px", color: "#C99BFF" }}>
                        Sürüm {game.compatibleVersions || 'Tüm Sürümlerle Uyumludur'}
                      </span>
                    </div>
                  </div>

                  {/* Translation Progress */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image src="/icons/ceviridurumu.svg" alt="Çeviri Durumu" width={24} height={28} className="shrink-0" />
                        <span className="uppercase" style={{ fontFamily: "Trajan Pro, serif", fontSize: "18px", fontWeight: 700, lineHeight: "28px", color: "rgba(255, 255, 255, 0.90)" }}>
                          Çeviri Durumu
                        </span>
                      </div>
                      <span style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: "32px", color: "#C99BFF" }}>
                        {game.completeRate}%
                      </span>
                    </div>
                    <div className="w-full h-4 rounded-full p-0.5" style={{ background: "rgba(0, 0, 0, 0.40)", outline: "1px solid rgba(255, 255, 255, 0.10)" }}>
                      <div className="h-full rounded-full relative overflow-hidden" style={{ width: `${game.completeRate}%`, background: "#4F57BB", boxShadow: "0px 0px 15px rgba(242, 166, 13, 0.60)" }}>
                        <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 0px, rgba(255, 255, 255, 0.15) 10px, transparent 10px, transparent 20px)` }} />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
                    <button className="flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-8 rounded-full transition-all hover:opacity-90" style={{ background: "#C99BFF" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                        <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="#FAF8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17" stroke="#FAF8FF" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="uppercase text-sm sm:text-base md:text-lg" style={{ fontFamily: "LEMON MILK, sans-serif", fontWeight: 700, lineHeight: "28px", letterSpacing: "1.8px", color: "#FAF8FF" }}>
                        Türkçe Çeviriyi İndir
                      </span>
                    </button>

                    {/* Notification Buttons */}
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={handleToggleRelease}
                          disabled={notifLoading}
                          className="flex items-center justify-center p-4 rounded-full transition-all hover:bg-white/10"
                          style={{
                            background: notifStatus?.release ? "rgba(201, 155, 255, 0.20)" : "rgba(255, 255, 255, 0.05)",
                            outline: notifStatus?.release ? "1px solid rgba(201, 155, 255, 0.50)" : "1px solid rgba(255, 255, 255, 0.10)",
                          }}
                          title={notifStatus?.release ? "Yayın bildirimini kapat" : "Yayın bildirimi al"}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill={notifStatus?.release ? "#C99BFF" : "none"} stroke={notifStatus?.release ? "#C99BFF" : "#FAF8FF"} strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                        </button>
                        <button
                          onClick={handleToggleUpdate}
                          disabled={notifLoading}
                          className="flex items-center justify-center p-4 rounded-full transition-all hover:bg-white/10"
                          style={{
                            background: notifStatus?.update ? "rgba(201, 155, 255, 0.20)" : "rgba(255, 255, 255, 0.05)",
                            outline: notifStatus?.update ? "1px solid rgba(201, 155, 255, 0.50)" : "1px solid rgba(255, 255, 255, 0.10)",
                          }}
                          title={notifStatus?.update ? "Güncelleme bildirimini kapat" : "Güncelleme bildirimi al"}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={notifStatus?.update ? "#C99BFF" : "#FAF8FF"} strokeWidth="2">
                            <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="pt-4">
                <div className="flex flex-wrap gap-2 sm:gap-4 pb-4 mb-6 overflow-x-auto scrollbar-hide" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.10)" }}>
                  {tabs.map((tab) => (
                    tab.isLink ? (
                      <Link key={tab.id} href={tab.href || "#"} className="px-3 sm:px-6 py-2 rounded-full transition-all hover:bg-white/5 shrink-0">
                        <span className="uppercase whitespace-nowrap" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "11px", lineHeight: "20px", letterSpacing: "0.35px", color: "rgba(255, 255, 255, 0.60)" }}>
                          {tab.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`px-3 sm:px-6 py-2 rounded-full transition-all shrink-0 ${activeTab === tab.id ? "bg-white/10" : "hover:bg-white/5"}`}
                        style={{ outline: activeTab === tab.id ? "1px solid rgba(242, 166, 13, 0.50)" : "none" }}
                      >
                        <span className="uppercase whitespace-nowrap" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "11px", fontWeight: activeTab === tab.id ? 700 : 400, lineHeight: "20px", letterSpacing: "0.35px", color: activeTab === tab.id ? "rgba(255, 255, 255, 0.90)" : "rgba(255, 255, 255, 0.60)" }}>
                          {tab.label}
                        </span>
                      </button>
                    )
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'about' && (
                  <div className="p-8 rounded-[32px] relative overflow-hidden" style={{ background: "rgba(24, 22, 17, 0.65)", boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)", outline: "1px solid rgba(255, 255, 255, 0.08)", backdropFilter: "blur(8px)" }}>
                    <div className="absolute -left-20 bottom-0 w-32 h-48 rounded-full" style={{ background: "rgba(201, 155, 255, 0.10)", filter: "blur(50px)" }} />
                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex items-center gap-3 pl-4" style={{ borderLeft: "4px solid #C99BFF" }}>
                        <Image src="/icons/info.svg" alt="Info" width={24} height={28} className="shrink-0" />
                        <span className="uppercase" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "24px", fontWeight: 400, lineHeight: "32px", letterSpacing: "0.6px", color: "rgba(255, 255, 255, 0.90)" }}>
                          Çeviri Hakkında
                        </span>
                      </div>
                      <p style={{ fontFamily: "Caviar Dreams, sans-serif", fontSize: "16px", fontWeight: 700, lineHeight: "26px", color: "rgba(255, 255, 255, 0.70)" }}>
                        {game.description || 'Bu çeviri hakkında henüz bir açıklama eklenmemiş.'}
                      </p>
                      {game.installationInstructions && (
                        <div className="p-4 rounded-2xl" style={{ background: "rgba(255, 255, 255, 0.05)", outline: "1px solid rgba(255, 255, 255, 0.10)" }}>
                          <p style={{ fontFamily: "Caviar Dreams, sans-serif", fontSize: "14px", lineHeight: "22px", color: "rgba(255, 255, 255, 0.60)" }}>
                            {game.installationInstructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="p-8 rounded-[32px]" style={{ background: "rgba(24, 22, 17, 0.65)", boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.50)", outline: "1px solid rgba(255, 255, 255, 0.08)", backdropFilter: "blur(8px)" }}>
                    <div className="flex items-center gap-3 pl-4 mb-6" style={{ borderLeft: "4px solid #C99BFF" }}>
                      <span className="uppercase" style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "20px", fontWeight: 400, lineHeight: "28px", color: "rgba(255, 255, 255, 0.90)" }}>
                        Çeviri Notları
                      </span>
                    </div>
                    {game.dlcs && (
                      <div className="mb-4">
                        <h4 className="text-white/70 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>DLC&apos;ler:</h4>
                        <p className="text-white/50 text-sm" style={{ fontFamily: "Inter" }}>{game.dlcs}</p>
                      </div>
                    )}
                    {game.compatibleVersions && (
                      <div>
                        <h4 className="text-white/70 text-sm font-bold mb-2" style={{ fontFamily: "Inter" }}>Uyumlu Sürümler:</h4>
                        <p className="text-white/50 text-sm" style={{ fontFamily: "Inter" }}>{game.compatibleVersions}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="flex flex-col gap-6">
                    {/* Comment Form */}
                    <div className="p-6 rounded-[32px]" style={{ background: "rgba(24, 22, 17, 0.65)", outline: "1px solid rgba(255, 255, 255, 0.08)", backdropFilter: "blur(8px)" }}>
                      <h3 className="text-white/90 text-sm font-bold mb-4 uppercase" style={{ fontFamily: "LEMON MILK, sans-serif", letterSpacing: "0.5px" }}>
                        Yorum Yaz
                      </h3>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={isAuthenticated ? "Yorumunuzu yazın..." : "Yorum yazmak için giriş yapın..."}
                        className="w-full h-24 bg-white/5 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none resize-none text-sm"
                        style={{ fontFamily: "Inter", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                        maxLength={2000}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-white/30 text-xs">{newComment.length}/2000</span>
                        <button
                          onClick={handleCreateComment}
                          disabled={commentSubmitting || !newComment.trim()}
                          className="px-6 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
                          style={{ background: "#C99BFF", color: "#1a1a2e", fontFamily: "Inter" }}
                        >
                          {commentSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                        </button>
                      </div>
                    </div>

                    {/* Sort */}
                    <div className="flex gap-3">
                      {(['newest', 'oldest', 'popular'] as const).map((sort) => (
                        <button
                          key={sort}
                          onClick={() => { setCommentsSortBy(sort); setCommentsPage(1); }}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${commentsSortBy === sort ? 'bg-white/10' : 'hover:bg-white/5'}`}
                          style={{ outline: commentsSortBy === sort ? "1px solid rgba(201, 155, 255, 0.50)" : "1px solid rgba(255, 255, 255, 0.08)", fontFamily: "Inter", color: commentsSortBy === sort ? "#C99BFF" : "rgba(255, 255, 255, 0.50)" }}
                        >
                          {sort === 'newest' ? 'En Yeni' : sort === 'oldest' ? 'En Eski' : 'Popüler'}
                        </button>
                      ))}
                    </div>

                    {/* Comments List */}
                    {commentsLoading ? (
                      <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : commentsData && commentsData.comments.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {commentsData.comments.map((comment) => (
                          <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUsername={user?.Username || null}
                            onReply={(id) => { setReplyingTo(id); setReplyContent(''); }}
                            onEdit={(id, content) => { setEditingCommentId(id); setEditContent(content); }}
                            onDelete={handleDeleteComment}
                            onLike={handleLike}
                            onDislike={handleDislike}
                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            onReplyContentChange={setReplyContent}
                            onReplySubmit={handleReply}
                            editingCommentId={editingCommentId}
                            editContent={editContent}
                            onEditContentChange={setEditContent}
                            onEditSubmit={handleEditComment}
                            onCancelEdit={() => setEditingCommentId(null)}
                            onCancelReply={() => setReplyingTo(null)}
                            commentSubmitting={commentSubmitting}
                            stickers={stickers}
                            showStickerPicker={showStickerPicker}
                            onToggleStickerPicker={(id) => setShowStickerPicker(showStickerPicker === id ? null : id)}
                            onSendSticker={handleSendSticker}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-white/30 text-sm" style={{ fontFamily: "Inter" }}>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                      </div>
                    )}

                    {/* Comments Pagination */}
                    {commentsData && commentsData.pagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        <button
                          onClick={() => setCommentsPage(p => Math.max(1, p - 1))}
                          disabled={commentsPage === 1}
                          className="px-3 py-1 rounded-full text-xs text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                          Önceki
                        </button>
                        <span className="text-white/30 text-xs flex items-center">
                          {commentsPage} / {commentsData.pagination.totalPages}
                        </span>
                        <button
                          onClick={() => setCommentsPage(p => Math.min(commentsData!.pagination.totalPages, p + 1))}
                          disabled={commentsPage === commentsData.pagination.totalPages}
                          className="px-3 py-1 rounded-full text-xs text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                          Sonraki
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
              {/* Game Cover */}
              <div className="relative rounded-[32px] overflow-hidden" style={{ boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)", outline: "1px solid rgba(255, 255, 255, 0.10)" }}>
                <img
                  src={mainPhoto?.photoUrl || "https://placehold.co/382x574"}
                  alt={game.name}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0) 100%)" }} />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                  {game.metacritic && (
                    <span style={{ fontFamily: "LEMON MILK, sans-serif", fontSize: "16px", fontWeight: 700, lineHeight: "24px", color: "rgba(255, 255, 255, 0.90)" }}>
                      Metacritic: {game.metacritic}
                    </span>
                  )}
                </div>
              </div>

              {/* Info Links */}
              {game.websiteURL && (
                <a href={game.websiteURL} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl flex items-center gap-3 transition-all hover:bg-white/10" style={{ background: "rgba(24, 22, 17, 0.65)", outline: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                  <span className="text-white/70 text-sm" style={{ fontFamily: "Inter" }}>Resmi Web Sitesi</span>
                </a>
              )}
              {game.videoURL && (
                <a href={game.videoURL} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl flex items-center gap-3 transition-all hover:bg-white/10" style={{ background: "rgba(24, 22, 17, 0.65)", outline: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  <span className="text-white/70 text-sm" style={{ fontFamily: "Inter" }}>Tanıtım Videosu</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// ====== Comment Item Component ======
interface CommentItemProps {
  comment: Comment;
  currentUsername: string | null;
  onReply: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  onDelete: (id: number) => void;
  onLike: (comment: Comment) => void;
  onDislike: (comment: Comment) => void;
  replyingTo: number | null;
  replyContent: string;
  onReplyContentChange: (v: string) => void;
  onReplySubmit: (parentId: number) => void;
  editingCommentId: number | null;
  editContent: string;
  onEditContentChange: (v: string) => void;
  onEditSubmit: (commentId: number) => void;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  commentSubmitting: boolean;
  stickers: Sticker[];
  showStickerPicker: number | null;
  onToggleStickerPicker: (id: number) => void;
  onSendSticker: (commentId: number, stickerId: number) => void;
  depth?: number;
}

function CommentItem({
  comment,
  currentUsername,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  replyingTo,
  replyContent,
  onReplyContentChange,
  onReplySubmit,
  editingCommentId,
  editContent,
  onEditContentChange,
  onEditSubmit,
  onCancelEdit,
  onCancelReply,
  commentSubmitting,
  stickers,
  showStickerPicker,
  onToggleStickerPicker,
  onSendSticker,
  depth = 0,
}: CommentItemProps) {
  const isOwn = currentUsername && comment.username === currentUsername;
  const isEditing = editingCommentId === comment.id;
  const isReplying = replyingTo === comment.id;
  const maxDepthIndent = Math.min(depth, 4);

  return (
    <div style={{ marginLeft: `${maxDepthIndent * 24}px` }}>
      <div className="p-4 rounded-2xl" style={{ background: "rgba(24, 22, 17, 0.65)", outline: "1px solid rgba(255, 255, 255, 0.05)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C99BFF] to-[#4F57BB] flex items-center justify-center">
              <span className="text-white text-xs font-bold">{comment.username?.[0]?.toUpperCase() || '?'}</span>
            </div>
            <span className="text-white/90 text-sm font-bold" style={{ fontFamily: "Inter" }}>{comment.username}</span>
            <span className="text-white/30 text-xs" style={{ fontFamily: "Inter" }}>
              {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
            </span>
            {comment.isEdited && <span className="text-white/20 text-xs">(düzenlendi)</span>}
          </div>
          {isOwn && (
            <div className="flex gap-2">
              <button onClick={() => onEdit(comment.id, comment.content)} className="text-white/30 hover:text-[#C99BFF] text-xs transition-colors">Düzenle</button>
              <button onClick={() => onDelete(comment.id)} className="text-white/30 hover:text-red-400 text-xs transition-colors">Sil</button>
            </div>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => onEditContentChange(e.target.value)}
              className="w-full h-20 bg-white/5 rounded-xl p-3 text-white text-sm focus:outline-none resize-none"
              style={{ fontFamily: "Inter", border: "1px solid rgba(255, 255, 255, 0.08)" }}
              maxLength={2000}
            />
            <div className="flex gap-2 mt-2">
              <button onClick={() => onEditSubmit(comment.id)} disabled={commentSubmitting} className="px-4 py-1 rounded-full text-xs font-bold bg-[#C99BFF] text-[#1a1a2e] disabled:opacity-40">
                Kaydet
              </button>
              <button onClick={onCancelEdit} className="px-4 py-1 rounded-full text-xs text-white/50 hover:text-white" style={{ outline: "1px solid rgba(255, 255, 255, 0.10)" }}>
                İptal
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white/70 text-sm mb-3" style={{ fontFamily: "Inter", lineHeight: "20px" }}>
            {comment.content}
          </p>
        )}

        {/* Stickers on comment */}
        {comment.stickers && comment.stickers.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {comment.stickers.map((s) => (
              <div key={s.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(201, 155, 255, 0.10)", outline: "1px solid rgba(201, 155, 255, 0.20)" }}>
                <img src={s.imageUrl} alt={s.stickerName} className="w-4 h-4" />
                <span className="text-white/50 text-[10px]">{s.senderUsername}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={() => onLike(comment)} className="flex items-center gap-1 text-white/40 hover:text-[#0DF269] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
            <span className="text-xs">{comment.reactions.likes}</span>
          </button>
          <button onClick={() => onDislike(comment)} className="flex items-center gap-1 text-white/40 hover:text-red-400 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
            <span className="text-xs">{comment.reactions.dislikes}</span>
          </button>
          <button onClick={() => onReply(comment.id)} className="text-white/30 hover:text-[#C99BFF] text-xs transition-colors">
            Yanıtla
          </button>
          <button onClick={() => onToggleStickerPicker(comment.id)} className="text-white/30 hover:text-[#C99BFF] text-xs transition-colors">
            🎁 Sticker ({comment.stickerCount})
          </button>
        </div>

        {/* Sticker Picker */}
        {showStickerPicker === comment.id && stickers.length > 0 && (
          <div className="mt-3 p-3 rounded-xl flex flex-wrap gap-2" style={{ background: "rgba(0, 0, 0, 0.40)", outline: "1px solid rgba(255, 255, 255, 0.08)" }}>
            {stickers.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => onSendSticker(comment.id, sticker.id)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-all"
                title={`${sticker.name} (${sticker.pointCost} puan)`}
              >
                <img src={sticker.imageUrl} alt={sticker.name} className="w-8 h-8" />
                <span className="text-white/40 text-[10px]">{sticker.pointCost}p</span>
              </button>
            ))}
          </div>
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => onReplyContentChange(e.target.value)}
              placeholder="Yanıtınızı yazın..."
              className="w-full h-16 bg-white/5 rounded-xl p-3 text-white text-sm placeholder:text-white/30 focus:outline-none resize-none"
              style={{ fontFamily: "Inter", border: "1px solid rgba(255, 255, 255, 0.08)" }}
              maxLength={2000}
            />
            <div className="flex gap-2 mt-2">
              <button onClick={() => onReplySubmit(comment.id)} disabled={commentSubmitting || !replyContent.trim()} className="px-4 py-1 rounded-full text-xs font-bold bg-[#C99BFF] text-[#1a1a2e] disabled:opacity-40">
                Yanıtla
              </button>
              <button onClick={onCancelReply} className="px-4 py-1 rounded-full text-xs text-white/50 hover:text-white" style={{ outline: "1px solid rgba(255, 255, 255, 0.10)" }}>
                İptal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Replies (recursive) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUsername={currentUsername}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onDislike={onDislike}
              replyingTo={replyingTo}
              replyContent={replyContent}
              onReplyContentChange={onReplyContentChange}
              onReplySubmit={onReplySubmit}
              editingCommentId={editingCommentId}
              editContent={editContent}
              onEditContentChange={onEditContentChange}
              onEditSubmit={onEditSubmit}
              onCancelEdit={onCancelEdit}
              onCancelReply={onCancelReply}
              commentSubmitting={commentSubmitting}
              stickers={stickers}
              showStickerPicker={showStickerPicker}
              onToggleStickerPicker={onToggleStickerPicker}
              onSendSticker={onSendSticker}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
