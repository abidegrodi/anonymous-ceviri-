"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryPills, { type CategoryItem } from "@/components/CategoryPills";
import GameSection, { type GameCardData } from "@/components/GameSection";
import EditorsChoice from "@/components/EditorsChoice";
import Footer from "@/components/Footer";
import { getGames, type GameListItem } from "@/lib/services/games";

// API oyun verisini GameCard formatına dönüştür
function mapGameToCard(game: GameListItem): GameCardData {
  const mainPhoto = game.photos?.find((p) => p.isMain) || game.photos?.[0];
  const progress = game.completeRate ?? 0;

  // Tag belirleme
  let tag: GameCardData["tag"] | undefined;
  if (progress === 100) {
    const releaseDate = new Date(game.releaseDate);
    const now = new Date();
    const daysDiff = (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 30) {
      tag = { text: "YENİ", color: "gradient" };
    }
  } else if (progress > 0 && progress < 100) {
    tag = { text: "DEVAM EDİYOR", color: "bg-yellow-500 text-black" };
  }

  // Kategori adlarını subtitle olarak göster (sadece Oyun Türleri olanları)
  const genreCategories = game.categories?.filter(
    (c) => c.categoryType?.name === "Oyun Türleri"
  );
  const subtitle = genreCategories?.map((c) => c.name).join(", ") || "";

  return {
    title: game.name,
    subtitle,
    progress,
    tag,
    image: mainPhoto?.photoUrl || undefined,
    href: `/ceviriler/${game.gameId}`,
  };
}

export default function Home() {
  const [allGames, setAllGames] = useState<GameListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

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

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <Hero />
      <div className="flex flex-col gap-8 pb-12">
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-[#C99BFF] border-t-transparent rounded-full animate-spin" />
              <span className="text-white/50 text-sm" style={{ fontFamily: "Inter" }}>
                Oyunlar yükleniyor...
              </span>
            </div>
          </div>
        ) : activeCategory === "all" ? (
          <>
            {/* En Yeni Türkçe Çeviriler */}
            <GameSection
              title="| En Yeni Türkçe Çeviriler"
              games={newestGames}
            />

            <EditorsChoice
              gameId={allGames.find((g) => g.name.toLowerCase().includes("ghostrunner 2"))?.gameId}
            />

            {/* Kategorilere göre bölümler */}
            {categorySections.map((section, idx) => (
              <GameSection
                key={idx}
                title={section.title}
                games={section.games}
                showViewAll={false}
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
            />
          </>
        )}

        {/* Oyun yoksa */}
        {!isLoading && allGames.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-white/30 text-sm" style={{ fontFamily: "Inter" }}>
              Henüz yayınlanmış oyun bulunmuyor.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
