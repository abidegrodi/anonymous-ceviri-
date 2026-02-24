"use client";

import Link from "next/link";
import { useState } from "react";

interface GameCardProps {
  title: string;
  progress: number;
  image?: string;
  href?: string;
  gameId?: number;
  onNotify?: (gameId: number) => void;
  isSubscribed?: boolean;
}

export default function GameCard({ title, progress, image, href, gameId, onNotify, isSubscribed }: GameCardProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const isComplete = clampedProgress === 100;
  const circumference = 2 * Math.PI * 16;
  const strokeOffset = circumference - (clampedProgress / 100) * circumference;
  const [bellHover, setBellHover] = useState(false);

  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (gameId && onNotify) onNotify(gameId);
  };

  const cardContent = (
    <div
      className="flex-shrink-0 inline-flex flex-col cursor-pointer group"
      style={{ width: "170px" }}
    >
      <div className="relative overflow-hidden rounded-xl bg-[#111] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(201,155,255,0.12)]">
        <div className="relative w-[170px] h-[225px]">
          <img
            src={image || "https://placehold.co/225x339"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />

          {/* Hover gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{
              background:
                "linear-gradient(0deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 35%, transparent 65%)",
            }}
          />

          {/* Hover border */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow: "inset 0 0 0 1.5px rgba(201, 155, 255, 0.2)",
            }}
          />

          {/* Notify bell for in-progress games */}
          {!isComplete && onNotify && gameId && (
            <button
              onClick={handleBellClick}
              onMouseEnter={() => setBellHover(true)}
              onMouseLeave={() => setBellHover(false)}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
              style={{
                background: isSubscribed ? "rgba(201,155,255,0.20)" : "rgba(0,0,0,0.50)",
                border: isSubscribed ? "1px solid rgba(201,155,255,0.40)" : "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                transform: bellHover ? "scale(1.1)" : "scale(1)",
              }}
              title={isSubscribed ? "Bildirimden çık" : "Çıktığında haber ver"}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill={isSubscribed ? "#C99BFF" : "none"} stroke={isSubscribed ? "#C99BFF" : "rgba(255,255,255,0.70)"} strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          )}

          {/* Hover progress panel */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
            <div className="flex items-center gap-2.5">
              {/* Circular progress ring */}
              <div className="relative flex-shrink-0 w-9 h-9">
                <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    stroke="url(#progressGrad)"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    className="transition-all duration-700 ease-out"
                    style={{
                      filter: isComplete ? "drop-shadow(0 0 4px rgba(201, 155, 255, 0.5))" : undefined,
                    }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C99BFF" />
                      <stop offset="100%" stopColor="#7B5EA7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-inter font-bold text-[9px] text-white/90">
                  %{clampedProgress}
                </span>
              </div>

              {/* Status text */}
              <div className="flex flex-col min-w-0">
                <span className="font-inter font-medium text-[11px] leading-tight text-white/90 truncate">
                  {isComplete ? "Tamamlandı" : "Devam Ediyor"}
                </span>
                <span className="font-inter text-[9px] leading-tight text-white/40 mt-0.5">
                  Çeviri Durumu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-3 px-1 text-center">
        <h3 className="font-inter font-semibold text-sm leading-[1.3] text-white/90 group-hover:text-[#C99BFF] transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
