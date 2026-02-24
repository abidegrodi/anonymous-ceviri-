"use client";

import { useState } from "react";
import Link from "next/link";
import GameCard from "./GameCard";

export interface GameCardData {
  title: string;
  progress: number;
  image?: string;
  href?: string;
  gameId?: number;
  isSubscribed?: boolean;
}

interface GameSectionProps {
  title: string;
  games: GameCardData[];
  showViewAll?: boolean;
  onNotify?: (gameId: number) => void;
}

export default function GameSection({ title, games, showViewAll = true, onNotify }: GameSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`game-section-${title}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === "left"
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  if (games.length === 0) return null;

  return (
    <section
      className="py-8 sm:py-12 bg-[#0a0a0a] px-4 sm:px-6 md:px-8"
      style={{
        paddingLeft: "clamp(16px, 5vw, 344px)",
        paddingRight: "clamp(16px, 5vw, 344px)",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1280px" }}>
        {/* Section Header */}
        <div
          className="flex items-center justify-between w-full mb-6 sm:mb-8 gap-4"
          style={{ minHeight: "56px" }}
        >
          <div className="flex items-center flex-shrink-0 min-w-0 pl-0 sm:pl-4 md:pl-[72px]" style={{ minHeight: "56px" }}>
            {/* Dikey çubuk */}
            <div
              className="flex-shrink-0 rounded-full w-1 h-6 sm:h-8 bg-gradient-to-t from-black/20 to-[#C99BFF]"
              style={{
                boxShadow:
                  "0px 0px 20px rgba(201, 155, 255, 0.30), 0px 0px 10px rgba(201, 155, 255, 0.50)",
              }}
            />
            {/* Başlık */}
            <h2
              className="capitalize flex items-center ml-3 font-inter font-bold text-xl sm:text-2xl md:text-[30px] leading-tight sm:leading-[36px] tracking-[-0.5px] md:tracking-[-0.75px]"
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #795D99 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title.replace(/^\|\s*/, "").replace(/türkçe/i, "Türkçe")}
            </h2>
          </div>

          {showViewAll ? (
            <Link
              href="/turkce-ceviriler"
              className="inline-flex items-center gap-1.5 flex-shrink-0 hover:opacity-90 transition no-underline"
            >
              <span
                className="font-inter font-normal text-xs sm:text-sm leading-[22.75px] uppercase whitespace-nowrap"
                style={{
                  background: "linear-gradient(90deg, #FFFFFF 0%, #C99BFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Tümünü Gör
              </span>
              <span
                style={{
                  fontSize: "14px",
                  lineHeight: "22.75px",
                  background: "linear-gradient(90deg, #FFFFFF 0%, #C99BFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                →
              </span>
            </Link>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.12] transition-all duration-200 border border-white/[0.08] hover:border-[#C99BFF]/30 hover:shadow-[0_0_16px_rgba(201,155,255,0.1)]"
                aria-label="Scroll left"
              >
                <img src="/icons/vectorleft.svg" alt="" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.12] transition-all duration-200 border border-white/[0.08] hover:border-[#C99BFF]/30 hover:shadow-[0_0_16px_rgba(201,155,255,0.1)]"
                aria-label="Scroll right"
              >
                <img src="/icons/vectorright.svg" alt="" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Oyun kartları */}
        <div
          id={`game-section-${title}`}
          className="flex overflow-x-auto scrollbar-hide pb-4 pl-0 sm:pl-4 md:pl-[88px]"
          style={{
            scrollBehavior: "smooth",
            gap: "11px",
          }}
        >
          {games.map((game, index) => (
            <GameCard key={index} {...game} onNotify={onNotify} />
          ))}
        </div>
      </div>
    </section>
  );
}
