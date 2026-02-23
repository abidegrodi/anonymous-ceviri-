"use client";

import { useState } from "react";
import Link from "next/link";
import GameCard from "./GameCard";

export interface GameCardData {
  title: string;
  subtitle: string;
  progress: number;
  status?: string;
  tag?: {
    text: string;
    color: string;
  };
  image?: string;
  href?: string;
}

interface GameSectionProps {
  title: string;
  games: GameCardData[];
  showViewAll?: boolean;
}

export default function GameSection({ title, games, showViewAll = true }: GameSectionProps) {
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
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition border border-white/10"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition border border-white/10"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
            <GameCard key={index} {...game} />
          ))}
        </div>
      </div>
    </section>
  );
}
