"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

const iconFileMap: Record<string, string> = {
  "en-populer": "enpopuler",
  aksiyon: "aksiyon",
  macera: "macera",
  strateji: "strateji",
  korku: "korku",
  simulasyon: "simulasyon",
  ryo: "ryo",
  "rol-yapma": "rolyapma",
  "taktiksel-rol-yapma": "rolyapma",
  "ucuncu-sahis": "tps",
  "birinci-sahis": "fps",
  dovus: "dovus",
  spor: "spor",
  "hack--slash": "hackslash",
  "battle-royale": "battleroyale",
  "acik-dunya": "acikdunya",
  "dungeon-crawler": "dungeoncrawlee",
  mmorpg: "mmorpg",
  grpg: "grpg",
  "point--click": "pointclick",
  roguelike: "roguelike",
  "4x": "4x",
  idle: "Idle",
  "arac-simulasyonu": "aracsim",
  "arac-sim": "aracsim",
  arcade: "arcade",
  bulmaca: "bulmaca",
  "gorsel-roman": "gorselroman",
  "hyper-casual": "hypercasual",
  "interaktif-film": "interaktiffilm",
  "kart-oyunu": "kartoyunu",
  "metin-tabanli": "metintabanli",
  platform: "platform",
  "psikolojik-korku": "psikolojikkorku",
  "psikolojik-gerilim": "psikolojikkorku",
  ritim: "ritim",
  rts: "rts",
  "sira-tabanli": "siratabanli",
  "tower-defense": "towerdefense",
  tycoon: "tycoon",
  "yapay-zeka": "yapayzeka",
  populer: "populer",
  "roguelite": "roguelike",
  "dovus-oyunu": "dovus",
  "aksiyon-rpg": "grpg",
  "aksiyon-macera": "aksiyon",
  "taktiksel-fps": "fps",
  "taktiksel-strateji": "strateji",
  "gercek-zamanli-strateji": "rts",
  "aksiyon-rol-yapma": "rolyapma",
  "hayatta-kalma": "korku",
  "sandbox": "acikdunya",
  "metroidvania": "platform",
  "soulslike": "soulslike",
  "yaris": "aracsim",
  "ucus-simulasyonu": "aracsim",
  "spor-yonetim": "spor",
  shooter: "shooter",
  "ubisoft-oyunlari": "ubisoftoyunlari",
  "souls-like": "soulslike",
  indie: "indie",
  esli: "esli",
  "secim-tabanli": "secimtabanli",
  gundelik: "gundelik",
  "rogue-like": "roguelike",
};

// Kategori adını slug'a çevir (ikon dosya adı için)
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export interface CategoryItem {
  id: string;
  name: string;
}

interface CategoryPillsProps {
  categories?: CategoryItem[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export default function CategoryPills({ categories, activeCategory, onCategoryChange }: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const allCategories = [
    { id: "all", name: "En Popüler Türkçe Çeviriler" },
    ...(categories || []).filter(c => c.id !== "all"),
  ];

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScrollability();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);
    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [checkScrollability, allCategories.length]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 300;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const getIconSrc = (id: string) => {
    const mapped = iconFileMap[id] || iconFileMap[slugify(id)] || id;
    return `/icons/${mapped}.svg`;
  };

  return (
    <section
      className="mt-16 z-40 overflow-hidden"
      style={{
        background: "#050505",
        boxShadow: "0px 25px 50px -12px black",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        paddingTop: "16px",
        paddingBottom: "16px",
        paddingLeft: "clamp(12px, 5vw, 344px)",
        paddingRight: "clamp(12px, 5vw, 344px)",
      }}
    >
      <div className="relative flex items-center mx-auto w-full pl-0 sm:pl-4 md:pl-[56px]" style={{ maxWidth: "1280px" }}>
        {/* Sol ok */}
        <button
          onClick={() => scroll("left")}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all mr-2"
          style={{
            opacity: canScrollLeft ? 1 : 0.2,
            pointerEvents: canScrollLeft ? "auto" : "none",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          aria-label="Sola kaydır"
        >
          <Image src="/icons/arrowl.svg" alt="" width={14} height={14} />
        </button>

        {/* Kaydırılabilir pill'ler */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allCategories.map((category) => {
            const isActive = activeCategory === category.id;
            const iconSrc = getIconSrc(category.id === "all" ? "en-populer" : slugify(category.name));
            const buttonContent = (
              <>
                <span className="flex items-center justify-center w-5 h-6 shrink-0">
                  {isActive ? (
                    <span
                      className="block w-5 h-6 shrink-0"
                      style={{
                        background: "linear-gradient(90deg, #FFFFFF 0%, #C99BFF 100%)",
                        WebkitMaskImage: `url(${iconSrc})`,
                        maskImage: `url(${iconSrc})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                      }}
                    />
                  ) : (
                    <Image
                      src={iconSrc}
                      alt=""
                      width={20}
                      height={24}
                      className="shrink-0"
                    />
                  )}
                </span>
                <span className="font-manrope">{category.name}</span>
              </>
            );

            const baseButtonStyle = "flex items-center shrink-0 whitespace-nowrap h-[42px] px-6 rounded-full gap-2 text-sm font-manrope transition-all";
            const activeStyle = "bg-[rgba(20,20,20,0.60)] text-white/90 font-bold";
            const inactiveStyle = "bg-[rgba(20,20,20,0.60)] text-[#9CA3AF] font-medium border border-[#ffffff0d]";

            if (isActive) {
              return (
                <div
                  key={category.id}
                  className="shrink-0 rounded-full p-[2px] transition-all"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.49) 0%, rgba(247, 246, 249, 0.49) 45%, rgba(121, 93, 153, 0.49) 100%)",
                    boxShadow: "0px 0px 12px rgba(121, 93, 153, 0.25)",
                  }}
                >
                  <button
                    onClick={() => onCategoryChange(category.id)}
                    className={`${baseButtonStyle} ${activeStyle}`}
                  >
                    {buttonContent}
                  </button>
                </div>
              );
            }

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`${baseButtonStyle} ${inactiveStyle}`}
              >
                {buttonContent}
              </button>
            );
          })}
        </div>

        {/* Sağ ok */}
        <button
          onClick={() => scroll("right")}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all ml-2"
          style={{
            opacity: canScrollRight ? 1 : 0.2,
            pointerEvents: canScrollRight ? "auto" : "none",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          aria-label="Sağa kaydır"
        >
          <Image src="/icons/arrowr.svg" alt="" width={14} height={14} />
        </button>
      </div>
    </section>
  );
}
