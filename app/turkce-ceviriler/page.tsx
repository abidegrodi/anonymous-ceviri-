"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { getGames, type GameListItem, type GameCategory, type GamesQueryParams, type Pagination } from "@/lib/services/games";
import { useDebounce } from "@/lib/hooks/use-debounce";

const statusFilters = [
  { label: "%100 Tamamlandı", value: "completed" as const },
  { label: "Devam Aşamasında", value: "in-progress" as const },
];

interface ApiCategory {
  id: number;
  name: string;
}

export default function TurkceYamalar() {
  const [games, setGames] = useState<GameListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [genresOpen, setGenresOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Desktop'ta filtreleri açık başlat
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setGenresOpen(true);
      setStatusOpen(true);
    }
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'releaseDate' | 'name' | 'popularity'>('releaseDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [availableCategories, setAvailableCategories] = useState<ApiCategory[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // İlk yüklemede tüm oyunlardan kategorileri çıkar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getGames({ page: 1, limit: 50, sortBy: 'releaseDate', sortOrder: 'desc' });
        const catMap = new Map<number, string>();
        result.games.forEach((game) => {
          game.categories?.forEach((cat) => {
            if (cat.categoryType?.name === "Oyun Türleri" && !catMap.has(cat.id)) {
              catMap.set(cat.id, cat.name);
            }
          });
        });
        setAvailableCategories(
          Array.from(catMap.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name, 'tr'))
        );
      } catch {
        // Hata durumunda boş kalır
      } finally {
        setCategoriesLoaded(true);
      }
    };
    fetchCategories();
  }, []);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GamesQueryParams = {
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder,
      };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      if (selectedGenres.length > 0) {
        params.categories = selectedGenres;
      }

      if (selectedStatus === 'completed') {
        params.translationStatus = 'completed';
      } else if (selectedStatus === 'in-progress') {
        params.translationStatus = 'in-progress';
      }

      const result = await getGames(params);
      setGames(result.games);
      setPagination(result.pagination);
    } catch {
      // Error handled by API interceptor
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedGenres, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedGenres, selectedStatus, sortBy, sortOrder]);

  const toggleGenre = (categoryId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? "" : status));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];
    const { page, totalPages } = pagination;
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Main Content */}
      <div className="pt-[100px] pb-16 px-4 md:px-8 lg:px-12 max-w-[1280px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm mb-6">
          <Link
            href="/"
            className="text-white/50 hover:text-[#C99BFF] transition-colors uppercase"
            style={{ fontFamily: "Caviar Dreams, sans-serif" }}
          >
            ANA SAYFA
          </Link>
          <Image
            src="/icons/arrowr.svg"
            alt=">"
            width={20}
            height={20}
            className="opacity-50"
          />
          <span
            className="font-medium uppercase"
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(121, 93, 153, 0.90) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TÜM ÇEVİRİLER
          </span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1
            className="mb-3 uppercase"
            style={{
              fontFamily: "Trajan Pro, serif",
              fontSize: "clamp(28px, 5vw, 47.8px)",
              fontWeight: 700,
              lineHeight: "clamp(32px, 5.5vw, 48px)",
              letterSpacing: "-0.96px",
            }}
          >
            <span className="text-[#C99BFF]">| </span>
            <span
              style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(121, 93, 153, 0.90) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              TÜM ÇEVİRİLER
            </span>
          </h1>
          <p
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              fontSize: "clamp(14px, 2vw, 18px)",
              fontWeight: 400,
              lineHeight: "28px",
              color: "#FAF8FF",
            }}
          >
            En yeni Türkçe çevirileri, yerelleştirme projelerini ve %100 tamamlanmış projeleri keşfedin.
          </p>
        </div>

        {/* Search Section */}
        <div
          className="mb-8 px-5 py-3 flex items-center gap-2"
          style={{
            background: "rgba(140, 0, 160, 0.15)",
            borderRadius: "9999px",
            outline: "1px solid rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(2px)",
          }}
        >
          <Image
            src="/icons/search.svg"
            alt="Ara"
            width={16}
            height={20}
            className="shrink-0 opacity-70"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Oyun ara..."
            className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-white/40 hover:text-white transition-colors text-sm"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Filters Label */}
        <div className="flex items-center gap-2 mb-6">
          <Image
            src="/icons/filtreler.svg"
            alt="Filtreler"
            width={20}
            height={20}
            className="shrink-0"
          />
          <span
            className="text-sm uppercase tracking-wider"
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            FİLTRELER
          </span>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
            {/* Türler Filter */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255, 0, 255, 0.10)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <button
                onClick={() => setGenresOpen(!genresOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <span
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{
                    fontFamily: "Inter",
                    background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  TÜRLER
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C99BFF"
                  strokeWidth="2"
                  className={`transition-transform ${
                    genresOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {genresOpen && (
                <div className="px-4 pb-4 flex flex-col gap-1">
                  {!categoriesLoaded ? (
                    <div className="flex items-center justify-center py-3">
                      <div className="w-4 h-4 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : availableCategories.length === 0 ? (
                    <span className="text-white/30 text-xs py-2" style={{ fontFamily: "Inter" }}>Kategori bulunamadı</span>
                  ) : (
                    availableCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center gap-3 py-2 cursor-pointer group"
                        onClick={() => toggleGenre(cat.id)}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                            selectedGenres.includes(cat.id)
                              ? "border-[#C99BFF] bg-[#C99BFF]"
                              : "border-white/30 group-hover:border-[#C99BFF]/50"
                          }`}
                        >
                          {selectedGenres.includes(cat.id) && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span
                          className="text-white/60 group-hover:text-white transition-colors text-sm select-none"
                          style={{ fontFamily: "Inter" }}
                        >
                          {cat.name}
                        </span>
                      </div>
                    ))
                  )}
                  {selectedGenres.length > 0 && (
                    <button
                      onClick={() => setSelectedGenres([])}
                      className="mt-1 text-xs text-[#C99BFF] hover:text-white transition-colors text-left"
                      style={{ fontFamily: "Inter" }}
                    >
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Durum Filter */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255, 0, 255, 0.10)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <span
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{
                    fontFamily: "Inter",
                    background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  DURUM
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C99BFF"
                  strokeWidth="2"
                  className={`transition-transform ${
                    statusOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {statusOpen && (
                <div className="px-4 pb-4 flex flex-col gap-1">
                  {statusFilters.map((status) => (
                    <div
                      key={status.value}
                      className="flex items-center gap-3 py-2 cursor-pointer group"
                      onClick={() => handleStatusChange(status.value)}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                          selectedStatus === status.value
                            ? "border-[#C99BFF] bg-[#C99BFF]"
                            : "border-white/30 group-hover:border-[#C99BFF]/50"
                        }`}
                      >
                        {selectedStatus === status.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className="text-white/60 group-hover:text-white transition-colors text-sm select-none"
                        style={{ fontFamily: "Inter" }}
                      >
                        {status.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Premium Box */}
            <div
              className="mt-4 relative overflow-hidden"
              style={{
                width: "100%",
                minHeight: "208px",
                background: "black",
                borderRadius: "48px",
                outline: "1px solid #283939",
                padding: "21px",
              }}
            >
              <div
                className="absolute"
                style={{
                  width: "96px",
                  height: "96px",
                  right: "-15px",
                  top: "-15px",
                  background: "rgba(79, 87, 187, 0.20)",
                  borderRadius: "9999px",
                  filter: "blur(20px)",
                }}
              />
              <div
                className="inline-flex px-2 py-0.5 rounded-2xl mb-3"
                style={{ outline: "1px solid #FAF8FF" }}
              >
                <span
                  className="text-[10px] uppercase"
                  style={{
                    fontFamily: "LEMON MILK, Caviar Dreams, sans-serif",
                    fontWeight: 400,
                    color: "#FAF8FF",
                    lineHeight: "16px",
                    letterSpacing: "1.2px",
                  }}
                >
                  SINIRSIZ İNDİRME
                </span>
              </div>
              <h4
                className="relative z-10 mb-2"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: "22.5px",
                  color: "rgba(255, 255, 255, 0.90)",
                }}
              >
                Anonymous Aboneliği
              </h4>
              <p
                className="relative z-10 mb-4"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#FAF8FF",
                }}
              >
                Anonymous aboneliği tüm Anony-
                <br />
                mous çevirilerine sınırsız erişim verir.
              </p>
              <Link
                href="/kayit-ol"
                className="block w-full py-2 transition-all hover:bg-white/10 text-center"
                style={{
                  borderRadius: "32px",
                  outline: "1px solid #FAF8FF",
                  background: "transparent",
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: "20px",
                    letterSpacing: "0.35px",
                    color: "#FAF8FF",
                  }}
                >
                  KAYIT OL
                </span>
              </Link>
            </div>
          </aside>

          {/* Games Grid */}
          <section className="flex-1">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
                  <span className="text-white/50 text-sm" style={{ fontFamily: "Inter" }}>Çeviriler yükleniyor...</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && games.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4 text-center">
                  <span className="text-white/30 text-6xl">🎮</span>
                  <h3 className="text-white/70 text-lg font-bold" style={{ fontFamily: "Inter" }}>
                    Çeviri bulunamadı
                  </h3>
                  <p className="text-white/40 text-sm" style={{ fontFamily: "Inter" }}>
                    Arama kriterlerinize uygun çeviri bulunamadı. Farklı filtreler deneyebilirsiniz.
                  </p>
                </div>
              </div>
            )}

            {/* Games Grid */}
            {!isLoading && games.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {games.map((game) => (
                  <GameCard key={game.gameId} game={game} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div
                  className="flex items-center gap-2 rounded-full px-4 py-2 overflow-hidden"
                  style={{
                    background: "linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0%, rgba(201, 155, 255, 0.20) 100%)",
                    boxShadow: "0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)",
                    outline: "1px solid rgba(255, 255, 255, 0.20)",
                  }}
                >
                  {/* Left Arrow */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all disabled:opacity-30"
                  >
                    <Image
                      src="/icons/arrowl.svg"
                      alt="Önceki"
                      width={24}
                      height={28}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                      typeof page === 'string' ? (
                        <span
                          key={`sep-${idx}`}
                          className="text-white text-sm font-bold px-1"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold transition-all ${
                            currentPage === page ? "" : "hover:bg-white/10"
                          }`}
                          style={{
                            fontFamily: "Inter, sans-serif",
                            ...(currentPage === page ? {
                              background: "#C99BFF",
                              boxShadow: "0px 0px 10px rgba(201, 155, 255, 0.40)",
                            } : {}),
                          }}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all disabled:opacity-30"
                  >
                    <Image
                      src="/icons/arrowright.svg"
                      alt="Sonraki"
                      width={24}
                      height={28}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Results count */}
            {pagination && !isLoading && (
              <div className="mt-4 text-center">
                <span className="text-white/30 text-xs" style={{ fontFamily: "Inter" }}>
                  Toplam {pagination.total} çeviri bulundu (Sayfa {pagination.page}/{pagination.totalPages})
                </span>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// Game Card Component
function GameCard({ game }: { game: GameListItem }) {
  const mainPhoto = game.photos?.find(p => p.isMain) || game.photos?.[0];
  const imageUrl = mainPhoto?.photoUrl || "https://placehold.co/225x339";
  const isComplete = game.completeRate === 100;

  return (
    <Link href={`/ceviriler/${game.gameId}`} className="flex-shrink-0 flex flex-col gap-3 cursor-pointer group">
      {/* Card Container */}
      <div className="relative flex flex-col justify-center items-start overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] hover:border-[#C99BFF]/30 transition-all">
        {/* Image Area */}
        <div className="relative w-full aspect-[3/4]">
          <img
            src={imageUrl}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.90) 0%, rgba(0, 0, 0, 0.40) 60%, rgba(0, 0, 0, 0) 100%)",
            }}
          />

          {/* Badge */}
          {isComplete && (
            <div
              className="absolute top-3 left-3 flex items-center justify-center px-2 py-1 rounded-md backdrop-blur-[2px]"
              style={{
                background:
                  "linear-gradient(270deg, rgba(120, 93, 153, 0.90) 0%, rgba(201, 155, 255, 0.90) 100%)",
                boxShadow:
                  "0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 4px 6px -4px rgba(0, 0, 0, 0.10)",
              }}
            >
              <span
                className="uppercase text-[10px] leading-[15px] font-bold tracking-[0.50px] text-white"
                style={{ fontFamily: "Inter" }}
              >
                TAMAMLANDI
              </span>
            </div>
          )}

          {game.isFree && (
            <div
              className="absolute top-3 right-3 flex items-center justify-center px-2 py-1 rounded-md backdrop-blur-[2px]"
              style={{
                background: "rgba(13, 242, 105, 0.80)",
              }}
            >
              <span
                className="uppercase text-[10px] leading-[15px] font-bold tracking-[0.50px] text-black"
                style={{ fontFamily: "Inter" }}
              >
                ÜCRETSİZ
              </span>
            </div>
          )}

          {/* Progress Area */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold"
                style={{
                  fontFamily: "Inter",
                  color: isComplete ? "rgba(255, 255, 255, 0.90)" : "#795D99",
                  textShadow: isComplete
                    ? "0px 0px 5px rgba(255, 255, 255, 0.25)"
                    : undefined,
                }}
              >
                %{game.completeRate}
              </span>
            </div>
            <div className="w-full h-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(0, game.completeRate))}%`,
                  background: "linear-gradient(90deg, #C99BFF 0%, #4F57BB 100%)",
                  boxShadow: "0 0 12px rgba(201, 155, 255, 0.4)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Title + Categories */}
      <div className="flex flex-col items-start gap-1">
        <h3
          className="group-hover:text-[#C99BFF] transition-colors font-bold text-base leading-tight text-white"
          style={{ fontFamily: "Inter" }}
        >
          {game.name}
        </h3>
        <p
          className="text-xs text-white/50"
          style={{ fontFamily: "Inter" }}
        >
          {game.categories?.map(c => c.name).join(', ') || ''}
        </p>
      </div>
    </Link>
  );
}

