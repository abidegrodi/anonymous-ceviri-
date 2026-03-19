"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryPills, { type CategoryItem } from "@/components/CategoryPills";
import GameSection, { type GameCardData } from "@/components/GameSection";
import EditorsChoice from "@/components/EditorsChoice";
import Footer from "@/components/Footer";
import { getGames, type GameListItem } from "@/lib/services/games";
import { toggleReleaseNotification } from "@/lib/services/notifications";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";

function mapGameToCard(game: GameListItem): GameCardData {
  const mainPhoto = game.photos?.find((p) => p.isMain) || game.photos?.[0];

  return {
    title: game.name,
    progress: game.completeRate ?? 0,
    image: mainPhoto?.photoUrl || undefined,
    href: `/ceviriler/${game.gameId}`,
    gameId: game.gameId,
  };
}

export default function Home() {
  const [allGames, setAllGames] = useState<GameListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const { isAuthenticated, requireAuth } = useAuth();

  const handleNotify = useCallback(async (gameId: number) => {
    if (!requireAuth()) return;
    try {
      const result = await toggleReleaseNotification(gameId);
      toast.success(result.subscribed ? 'Bildirim aktif: Çeviri çıktığında haber verilecek.' : 'Bildirim kapatıldı.');
    } catch {
      toast.error('İşlem başarısız oldu.');
    }
  }, [requireAuth]);

  // Oyunları API'den çek
  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const data = await getGames({
          page: 1,
          limit: 50,
          sortBy: "releaseDate",
          sortOrder: "desc",
        });
        setAllGames(data.games);
      } catch {
        // Hata interceptor tarafından handle edilir
      } finally {
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  // API'den gelen oyunlardan benzersiz "Oyun Türleri" kategorilerini çıkar
  const categories = useMemo<CategoryItem[]>(() => {
    const categoryMap = new Map<number, string>();
    allGames.forEach((game) => {
      game.categories?.forEach((cat) => {
        // Sadece "Oyun Türleri" tipindeki kategorileri al
        if (cat.categoryType?.name === "Oyun Türleri" && !categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, cat.name);
        }
      });
    });
    // Oyun sayısına göre sırala (çok oyunu olan kategori önce)
    const catCounts = new Map<number, number>();
    allGames.forEach((game) => {
      game.categories?.forEach((cat) => {
        if (cat.categoryType?.name === "Oyun Türleri") {
          catCounts.set(cat.id, (catCounts.get(cat.id) || 0) + 1);
        }
      });
    });
    return Array.from(categoryMap.entries())
      .sort((a, b) => (catCounts.get(b[0]) || 0) - (catCounts.get(a[0]) || 0))
      .map(([id, name]) => ({ id: String(id), name }));
  }, [allGames]);

  // En yeni çeviriler (ilk 8)
  const newestGames = useMemo<GameCardData[]>(() => {
    return allGames.slice(0, 8).map(mapGameToCard);
  }, [allGames]);

  // Çok Yakında: devam eden çeviriler (completeRate < 100)
  const comingSoonGames = useMemo<GameCardData[]>(() => {
    return allGames
      .filter((g) => g.completeRate < 100)
      .slice(0, 8)
      .map(mapGameToCard);
  }, [allGames]);

  // Seçili kategoriye göre filtrelenmiş oyunlar
  const filteredByCategory = useMemo<GameCardData[]>(() => {
    if (activeCategory === "all") return [];
    const catId = Number(activeCategory);
    return allGames
      .filter((game) =>
        game.categories?.some((cat) => cat.id === catId)
      )
      .map(mapGameToCard);
  }, [allGames, activeCategory]);

  // Kategorilere göre grupla: en çok oyunu olan ilk 4 kategoriyi göster
  const categorySections = useMemo(() => {
    if (activeCategory !== "all") return [];

    const categoryMap = new Map<number, { name: string; games: GameListItem[] }>();

    allGames.forEach((game) => {
      game.categories?.forEach((cat) => {
        if (cat.categoryType?.name === "Oyun Türleri") {
          if (!categoryMap.has(cat.id)) {
            categoryMap.set(cat.id, { name: cat.name, games: [] });
          }
          categoryMap.get(cat.id)!.games.push(game);
        }
      });
    });

    // En çok oyunu olan kategorileri al (en az 2 oyun), max 8 kategori
    return Array.from(categoryMap.entries())
      .filter(([, { games }]) => games.length >= 2)
      .sort(([, a], [, b]) => b.games.length - a.games.length)
      .slice(0, 8)
      .map(([, { name, games }]) => ({
        title: `| ${name}`,
        games: games.slice(0, 8).map(mapGameToCard), // Her kategoride max 8 oyun
      }));
  }, [allGames, activeCategory]);

  // Aktif kategorinin adı
  const activeCategoryName = useMemo(() => {
    if (activeCategory === "all") return null;
    return categories.find((c) => c.id === activeCategory)?.name || null;
  }, [activeCategory, categories]);

  // Aynı kategoriye ikinci tıklamada anasayfaya dön
  const handleCategoryChange = useCallback((nextCategory: string) => {
    setActiveCategory((prevCategory) => {
      if (prevCategory === nextCategory) {
        return "all";
      }
      return nextCategory;
    });
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <Hero />
      <div className="flex flex-col gap-8 pb-12">
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
              <span className="text-white/50 text-sm" style={{ fontFamily: "Caviar Dreams" }}>
                Oyunlar yükleniyor...
              </span>
            </div>
          </div>
        ) : activeCategory === "all" ? (
          <>
            {/* Çok Yakında (devam eden çeviriler) */}
            {comingSoonGames.length > 0 && (
              <GameSection
                title="| Çok Yakında"
                games={comingSoonGames}
                showViewAll={false}
                onNotify={handleNotify}
              />
            )}

            <EditorsChoice />

            {/* En Yeni Türkçe Çeviriler (kategori bölümlerinin üstünde) */}
            <GameSection
              title="| En Yeni Türkçe Çeviriler"
              games={newestGames}
              onNotify={handleNotify}
            />

            {/* Kategorilere göre bölümler */}
            {categorySections.map((section, idx) => (
              <GameSection
                key={idx}
                title={section.title}
                games={section.games}
                showViewAll={false}
                onNotify={handleNotify}
              />
            ))}
          </>
        ) : (
          <>
            {/* Seçili kategorideki oyunlar */}
            <GameSection
              title={`| ${activeCategoryName || 'Seçili Kategori'}`}
              games={filteredByCategory}
              showViewAll={false}
              onNotify={handleNotify}
            />
          </>
        )}

        {/* Oyun yoksa */}
        {!isLoading && allGames.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-white/30 text-sm" style={{ fontFamily: "Caviar Dreams" }}>
              Henüz yayınlanmış oyun bulunmuyor.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
