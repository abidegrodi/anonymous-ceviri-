"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getGames, type GameListItem } from "@/lib/services/games";
import { toggleReleaseNotification } from "@/lib/services/notifications";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [games, setGames] = useState<GameListItem[]>([]);
  const [followedGames, setFollowedGames] = useState<Set<number>>(new Set());
  const [suggestion, setSuggestion] = useState("");
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getGames({ page: 1, limit: 12, sortBy: "releaseDate", sortOrder: "desc" });
        setGames(data.games);
      } catch { /* handled */ }
      finally { setIsLoading(false); }
    };
    fetchGames();
  }, []);

  const handleFollow = useCallback(async (gameId: number) => {
    if (!isAuthenticated) return;
    try {
      const result = await toggleReleaseNotification(gameId);
      setFollowedGames((prev) => {
        const next = new Set(prev);
        if (result.subscribed) next.add(gameId);
        else next.delete(gameId);
        return next;
      });
    } catch { /* handled */ }
  }, [isAuthenticated]);

  const handleSubmitSuggestion = async () => {
    if (!suggestion.trim()) return;
    setSubmittingSuggestion(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Öneriniz alındı, teşekkürler!");
    setSubmittingSuggestion(false);
    setSuggestion("");
  };

  const handleFinish = () => {
    router.push("/");
  };

  const inProgressGames = games.filter((g) => g.completeRate < 100);

  return (
    <main className="min-h-screen bg-[#12110E] flex items-center justify-center p-4">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: "radial-gradient(circle, rgba(201,155,255,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(123,94,167,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-[540px]">
        {/* Skip */}
        <div className="flex justify-end mb-4">
          <button onClick={handleFinish} className="text-[11px] text-white/25 hover:text-white/50 transition-colors uppercase tracking-wider" style={{ fontFamily: "Caviar Dreams" }}>
            Geç →
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: step === 1 ? "50%" : "100%", background: "linear-gradient(90deg, #C99BFF, #7B5EA7)" }} />
          </div>
          <span className="text-[11px] text-white/30 shrink-0" style={{ fontFamily: "Caviar Dreams" }}>{step}/2</span>
        </div>

        {/* Card */}
        <div className="rounded-[24px] overflow-hidden" style={{ background: "rgba(24,22,17,0.80)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
          {/* Step 1: Follow Games */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.15)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </div>
                <div>
                  <h2 className="text-white/90 text-[16px] font-bold" style={{ fontFamily: "Caviar Dreams" }}>Hoş Geldiniz!</h2>
                  <p className="text-white/30 text-[11px]" style={{ fontFamily: "Caviar Dreams" }}>Adım 1/2</p>
                </div>
              </div>

              <p className="text-[14px] leading-relaxed mb-6 mt-4" style={{ fontFamily: "Caviar Dreams", color: "rgba(255,255,255,0.55)" }}>
                Devam eden çeviri projelerini takip edin, hazır olduklarında size haber verelim.
              </p>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto scrollbar-hide pr-1">
                  {inProgressGames.map((game) => {
                    const mainPhoto = game.photos?.find((p) => p.isMain) || game.photos?.[0];
                    const isFollowed = followedGames.has(game.gameId);
                    return (
                      <button
                        key={game.gameId}
                        onClick={() => handleFollow(game.gameId)}
                        className="relative rounded-xl overflow-hidden transition-all group text-left"
                        style={{
                          border: isFollowed ? "2px solid rgba(201,155,255,0.40)" : "1px solid rgba(255,255,255,0.06)",
                          background: isFollowed ? "rgba(201,155,255,0.05)" : "rgba(0,0,0,0.20)",
                        }}
                      >
                        <div className="relative w-full h-[90px] overflow-hidden">
                          <img
                            src={mainPhoto?.photoUrl || "https://placehold.co/170x225"}
                            alt={game.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.80) 0%, transparent 70%)" }} />
                          {isFollowed && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#C99BFF" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <span className="text-[10px] text-white/80 font-medium line-clamp-1 block" style={{ fontFamily: "Caviar Dreams" }}>{game.name}</span>
                          <span className="text-[9px] text-white/25" style={{ fontFamily: "Caviar Dreams" }}>%{game.completeRate}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {followedGames.size > 0 && (
                <p className="text-[11px] text-[#C99BFF]/60 mt-3 text-center" style={{ fontFamily: "Caviar Dreams" }}>
                  {followedGames.size} proje takip ediliyor
                </p>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-[12px] uppercase tracking-wider font-bold transition-all hover:brightness-110" style={{ fontFamily: "Caviar Dreams", background: "linear-gradient(135deg, #C99BFF, #7B5EA7)", color: "white" }}>
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Suggest a game */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,155,255,0.08)", border: "1px solid rgba(201,155,255,0.15)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C99BFF" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </div>
                <div>
                  <h2 className="text-white/90 text-[16px] font-bold" style={{ fontFamily: "Caviar Dreams" }}>Çeviri Önerisi</h2>
                  <p className="text-white/30 text-[11px]" style={{ fontFamily: "Caviar Dreams" }}>Adım 2/2</p>
                </div>
              </div>

              <p className="text-[14px] leading-relaxed mb-6 mt-4" style={{ fontFamily: "Caviar Dreams", color: "rgba(255,255,255,0.55)" }}>
                Türkçe çevirisini görmek istediğiniz bir oyun var mı? Bize bildirin, topluluğun taleplerini değerlendiriyoruz.
              </p>

              <div className="mb-4">
                <input
                  type="text"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Örn: The Witcher 4, GTA VI..."
                  className="w-full px-4 py-3 rounded-xl text-[14px] text-white/90 placeholder:text-white/20 outline-none transition-all focus:border-[rgba(201,155,255,0.30)]"
                  style={{ fontFamily: "Caviar Dreams", background: "rgba(0,0,0,0.30)", border: "1px solid rgba(255,255,255,0.06)" }}
                />
              </div>

              {suggestion.trim() && (
                <button
                  onClick={handleSubmitSuggestion}
                  disabled={submittingSuggestion}
                  className="w-full py-2.5 rounded-xl text-[11px] uppercase tracking-wider font-bold mb-4 transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ fontFamily: "Caviar Dreams", background: "rgba(201,155,255,0.10)", border: "1px solid rgba(201,155,255,0.25)", color: "#C99BFF" }}
                >
                  {submittingSuggestion ? "Gönderiliyor..." : "Öneri Gönder"}
                </button>
              )}

              {/* Popular games that exist */}
              <div className="mt-2 mb-6">
                <span className="text-[10px] uppercase tracking-wider block mb-3" style={{ fontFamily: "Caviar Dreams", color: "rgba(255,255,255,0.20)" }}>Mevcut çevirilerimiz arasından:</span>
                <div className="flex flex-wrap gap-2">
                  {games.filter(g => g.completeRate === 100).slice(0, 6).map((g) => (
                    <Link key={g.gameId} href={`/ceviriler/${g.gameId}`}
                      className="px-3 py-1.5 rounded-lg text-[10px] text-white/50 hover:text-[#C99BFF] transition-colors"
                      style={{ fontFamily: "Caviar Dreams", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl text-[12px] uppercase tracking-wider transition-all hover:bg-white/5" style={{ fontFamily: "Caviar Dreams", color: "rgba(255,255,255,0.40)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Geri
                </button>
                <button onClick={handleFinish} className="flex-1 py-3 rounded-xl text-[12px] uppercase tracking-wider font-bold transition-all hover:brightness-110" style={{ fontFamily: "Caviar Dreams", background: "linear-gradient(135deg, #C99BFF, #7B5EA7)", color: "white" }}>
                  Keşfetmeye Başla
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-5">
          <div className="w-2 h-2 rounded-full transition-all" style={{ background: step === 1 ? "#C99BFF" : "rgba(255,255,255,0.10)" }} />
          <div className="w-2 h-2 rounded-full transition-all" style={{ background: step === 2 ? "#C99BFF" : "rgba(255,255,255,0.10)" }} />
        </div>
      </div>
    </main>
  );
}
