"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getGames, type GameListItem, type GamesQueryParams, type Pagination } from "@/lib/services/games";
import { toggleReleaseNotification } from "@/lib/services/notifications";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface ApiCategory { id: number; name: string; }

export default function TurkceYamalar() {
  const [games, setGames] = useState<GameListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy] = useState<'releaseDate' | 'name' | 'popularity'>('releaseDate');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [availableCategories, setAvailableCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const { requireAuth } = useAuth();

  const handleNotify = useCallback(async (gameId: number) => {
    if (!requireAuth()) return;
    try {
      const result = await toggleReleaseNotification(gameId);
      toast.success(result.subscribed ? 'Bildirim aktif: Çeviri çıktığında haber verilecek.' : 'Bildirim kapatıldı.');
    } catch {
      toast.error('İşlem başarısız oldu.');
    }
  }, [requireAuth]);
  const genreScrollRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const activeFilterCount = selectedGenres.length + (selectedStatus ? 1 : 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getGames({ page: 1, limit: 50, sortBy: 'releaseDate', sortOrder: 'desc' });
        const catMap = new Map<number, string>();
        result.games.forEach((game) => {
          game.categories?.forEach((cat) => {
            if (cat.categoryType?.name === "Oyun Türleri" && !catMap.has(cat.id)) catMap.set(cat.id, cat.name);
          });
        });
        setAvailableCategories(
          Array.from(catMap.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        );
      } catch { /* empty */ } finally { setCategoriesLoaded(true); }
    };
    fetchCategories();
  }, []);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GamesQueryParams = { page: currentPage, limit: 12, sortBy, sortOrder };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedGenres.length > 0) params.categories = selectedGenres;
      if (selectedStatus === 'completed') params.translationStatus = 'completed';
      else if (selectedStatus === 'in-progress') params.translationStatus = 'in-progress';
      const result = await getGames(params);
      setGames(result.games);
      setPagination(result.pagination);
    } catch { setGames([]); } finally { setIsLoading(false); }
  }, [currentPage, debouncedSearch, selectedGenres, selectedStatus, sortBy, sortOrder]);

  useEffect(() => { fetchGames(); }, [fetchGames]);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, selectedGenres, selectedStatus]);

  const toggleGenre = (id: number) => setSelectedGenres(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const clearAll = () => { setSelectedGenres([]); setSelectedStatus(""); };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const { page, totalPages } = pagination;
    const pages: (number | string)[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <div className="pt-[100px] pb-16 px-4 md:px-8 lg:px-12 max-w-[1280px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm mb-6">
          <Link href="/" className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase" style={{ fontFamily: "Caviar Dreams" }}>ANA SAYFA</Link>
          <Image src="/icons/arrowr.svg" alt=">" width={20} height={20} className="opacity-50" />
          <span className="font-medium uppercase" style={{ fontFamily: "Caviar Dreams", background: "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(121,93,153,0.90) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>TÜM ÇEVİRİLER</span>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="mb-3 uppercase" style={{ fontFamily: "Trajan Pro, serif", fontSize: "clamp(28px, 5vw, 47.8px)", fontWeight: 700, lineHeight: "clamp(32px, 5.5vw, 48px)", letterSpacing: "-0.96px" }}>
            <span className="text-[#C99BFF]">| </span>
            <span style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(121,93,153,0.90) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>TÜM ÇEVİRİLER</span>
          </h1>
          <p style={{ fontFamily: "Caviar Dreams", fontSize: "18px", fontWeight: 400, fontStyle: "normal", lineHeight: "28px", color: "#FAF8FF" }}>
            En yeni Türkçe oyun yamalarını, yerelleştirme projelerini ve %100 tamamlanmış çevirileri keşfedin.
          </p>
        </div>

        {/* Search + Filter Toggle */}
        <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Image src="/icons/search.svg" alt="" width={16} height={16} className="opacity-40" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Oyun adı ile ara..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-inter placeholder:text-white/25 focus:outline-none focus:border-[#C99BFF]/30 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-xs transition-colors">✕</button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="h-11 px-5 rounded-xl flex items-center gap-2.5 transition-all duration-200 shrink-0"
            style={{
              background: filtersOpen ? "rgba(201,155,255,0.1)" : "rgba(255,255,255,0.04)",
              border: filtersOpen ? "1px solid rgba(201,155,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filtersOpen ? "#C99BFF" : "rgba(255,255,255,0.4)"} strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
            <span className="font-inter text-xs font-medium" style={{ color: filtersOpen ? "#C99BFF" : "rgba(255,255,255,0.5)" }}>
              Filtreler
            </span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C99BFF] text-black text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter tags */}
        {activeFilterCount > 0 && !filtersOpen && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            {selectedStatus && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-inter font-medium text-[#C99BFF] bg-[#C99BFF]/10 border border-[#C99BFF]/20">
                {selectedStatus === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                <button onClick={() => setSelectedStatus("")} className="text-[#C99BFF]/60 hover:text-white transition-colors">✕</button>
              </span>
            )}
            {selectedGenres.map(id => {
              const cat = availableCategories.find(c => c.id === id);
              return cat ? (
                <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-inter font-medium text-[#C99BFF] bg-[#C99BFF]/10 border border-[#C99BFF]/20">
                  {cat.name}
                  <button onClick={() => toggleGenre(id)} className="text-[#C99BFF]/60 hover:text-white transition-colors">✕</button>
                </span>
              ) : null;
            })}
            <button onClick={clearAll} className="text-[10px] font-inter text-white/30 hover:text-white transition-colors ml-1">Tümünü temizle</button>
          </div>
        )}

        {/* Expandable filter panel */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: filtersOpen ? "400px" : "0px",
            opacity: filtersOpen ? 1 : 0,
            marginBottom: filtersOpen ? "24px" : "0px",
          }}
        >
          <div
            className="rounded-2xl p-5 flex flex-col gap-5"
            style={{ background: "rgba(201,155,255,0.04)", border: "1px solid rgba(201,155,255,0.08)" }}
          >
            {/* Status */}
            <div>
              <span className="font-inter text-[10px] font-bold uppercase tracking-[1.5px] text-white/20 mb-3 block">Çeviri Durumu</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Tümü", value: "" },
                  { label: "Tamamlandı", value: "completed" },
                  { label: "Devam Ediyor", value: "in-progress" },
                ].map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedStatus(prev => prev === s.value ? "" : s.value)}
                    className="h-8 px-4 rounded-lg text-[12px] font-inter font-medium transition-all duration-200"
                    style={{
                      background: selectedStatus === s.value ? "rgba(201,155,255,0.15)" : "rgba(255,255,255,0.03)",
                      border: selectedStatus === s.value ? "1px solid rgba(201,155,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
                      color: selectedStatus === s.value ? "#C99BFF" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div>
              <span className="font-inter text-[10px] font-bold uppercase tracking-[1.5px] text-white/20 mb-3 block">Oyun Türleri</span>
              <div
                ref={genreScrollRef}
                className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto scrollbar-hide"
                style={{ scrollbarWidth: "none" }}
              >
                {!categoriesLoaded ? (
                  <div className="w-4 h-4 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
                ) : (
                  availableCategories.map(cat => {
                    const sel = selectedGenres.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleGenre(cat.id)}
                        className="h-7 px-3 rounded-lg text-[11px] font-inter font-medium transition-all duration-200"
                        style={{
                          background: sel ? "rgba(201,155,255,0.15)" : "rgba(255,255,255,0.03)",
                          border: sel ? "1px solid rgba(201,155,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
                          color: sel ? "#C99BFF" : "rgba(255,255,255,0.35)",
                        }}
                      >
                        {cat.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
              <div className="flex justify-end">
                <button onClick={clearAll} className="text-xs font-inter text-[#C99BFF]/70 hover:text-[#C99BFF] transition-colors">
                  Filtreleri temizle ({activeFilterCount})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        {pagination && !isLoading && (
          <div className="mb-5 flex items-center justify-between">
            <span className="font-inter text-[11px] text-white/25">{pagination.total} çeviri bulundu</span>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
              <span className="text-white/40 text-sm font-inter">Çeviriler yükleniyor...</span>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && games.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-white/15 text-5xl">🎮</span>
              <h3 className="text-white/50 text-base font-bold font-inter">Çeviri bulunamadı</h3>
              <p className="text-white/25 text-sm font-inter">Farklı filtreler deneyebilirsiniz.</p>
            </div>
          </div>
        )}

        {/* Grid */}
        {!isLoading && games.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {games.map(game => <GameCard key={game.gameId} game={game} onNotify={handleNotify} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-1 sm:gap-2 rounded-full px-3 sm:px-4 py-2" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(201,155,255,0.15) 100%)", outline: "1px solid rgba(255,255,255,0.15)" }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all disabled:opacity-30">
                <Image src="/icons/arrowl.svg" alt="" width={18} height={18} className="opacity-70" />
              </button>
              {getPageNumbers().map((page, idx) => typeof page === 'string' ? (
                <span key={`s${idx}`} className="text-white/40 text-xs font-inter px-0.5">...</span>
              ) : (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-white text-xs font-bold font-inter transition-all ${currentPage === page ? "" : "hover:bg-white/10"}`} style={currentPage === page ? { background: "#C99BFF", boxShadow: "0 0 10px rgba(201,155,255,0.4)" } : {}}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))} disabled={currentPage === pagination.totalPages} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all disabled:opacity-30">
                <Image src="/icons/arrowright.svg" alt="" width={18} height={18} className="opacity-70" />
              </button>
            </div>
          </div>
        )}
        {pagination && !isLoading && <p className="mt-3 text-center font-inter text-[11px] text-white/15">Sayfa {pagination.page}/{pagination.totalPages}</p>}
      </div>

      <Footer />
    </main>
  );
}

function GameCard({ game, onNotify }: { game: GameListItem; onNotify?: (gameId: number) => void }) {
  const mainPhoto = game.photos?.find(p => p.isMain) || game.photos?.[0];
  const imageUrl = mainPhoto?.photoUrl || "https://placehold.co/225x339";
  const progress = Math.min(100, Math.max(0, game.completeRate));
  const isComplete = progress === 100;
  const circ = 2 * Math.PI * 16;
  const offset = circ - (progress / 100) * circ;
  const genres = game.categories?.filter(c => c.categoryType?.name === "Oyun Türleri").map(c => c.name) || [];

  const handleBell = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNotify) onNotify(game.gameId);
  };

  return (
    <Link href={`/ceviriler/${game.gameId}`} className="flex-shrink-0 flex flex-col cursor-pointer group">
      <div className="relative overflow-hidden rounded-xl bg-[#111] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(201,155,255,0.1)]">
        <div className="relative w-full" style={{ aspectRatio: "170 / 225" }}>
          <img src={imageUrl} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />

          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(0deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, transparent 70%)" }} />
          <div className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "inset 0 0 0 1.5px rgba(201,155,255,0.2)" }} />

          {game.isFree && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded backdrop-blur-sm" style={{ background: "rgba(13,242,105,0.8)" }}>
              <span className="uppercase text-[8px] font-bold tracking-[0.4px] text-black font-inter">ÜCRETSİZ</span>
            </div>
          )}

          {/* Notify bell for in-progress games */}
          {!isComplete && onNotify && (
            <button
              onClick={handleBell}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110"
              style={{ background: "rgba(0,0,0,0.50)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
              title="Çıktığında haber ver"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.70)" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          )}

          {/* Hover panel */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="relative flex-shrink-0 w-8 h-8">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" strokeLinecap="round" stroke="url(#pg)" strokeDasharray={circ} strokeDashoffset={offset} style={{ filter: isComplete ? "drop-shadow(0 0 3px rgba(201,155,255,0.5))" : undefined }} />
                  <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#C99BFF" /><stop offset="100%" stopColor="#7B5EA7" /></linearGradient></defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-inter font-bold text-[8px] text-white/90">%{progress}</span>
              </div>
              <span className="font-inter font-medium text-[10px] text-white/80">{isComplete ? "Tamamlandı" : "Devam Ediyor"}</span>
            </div>
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {genres.slice(0, 3).map(g => (
                  <span key={g} className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-inter font-semibold text-white/70 truncate max-w-[90px]" style={{ background: "rgba(201,155,255,0.12)", border: "1px solid rgba(201,155,255,0.20)" }}>{g}</span>
                ))}
                {genres.length > 3 && <span className="text-[9px] font-inter text-white/35 self-center">+{genres.length - 3}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="font-inter font-semibold text-xs sm:text-sm leading-[1.3] text-white/90 group-hover:text-[#C99BFF] transition-colors duration-300 line-clamp-2">{game.name}</h3>
      </div>
    </Link>
  );
}
