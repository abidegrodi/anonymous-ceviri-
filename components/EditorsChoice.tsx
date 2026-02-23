"use client";

import Link from "next/link";

export default function EditorsChoice() {
  return (
    <section className="py-8 sm:py-12 px-4 flex justify-center">
      <div
        className="relative w-full max-w-[1189px] min-h-[220px] sm:min-h-[260px] md:h-[300px] overflow-hidden rounded-[16px] sm:rounded-[24px] flex items-center"
      >
        {/* Background Image */}
        <img
          src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2144740/library_hero.jpg"
          alt="Ghostrunner 2"
          className="absolute left-0 top-0 w-full h-full object-cover"
        />

        {/* Magenta Overlay */}
        <div
          className="absolute left-0 top-0 w-full h-full mix-blend-overlay"
          style={{ background: "rgba(255, 0, 255, 0.20)" }}
        ></div>

        {/* Gradient Overlay */}
        <div
          className="absolute left-0 top-0 w-full h-full"
          style={{
            background: "linear-gradient(90deg, black 0%, rgba(0, 0, 0, 0.80) 50%, rgba(0, 0, 0, 0) 100%)"
          }}
        ></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-start gap-2 px-6 sm:px-10 md:px-16 py-6 max-w-[672px]">

          {/* Editor's Choice Label */}
          <div className="flex flex-col justify-center items-start">
            <span className="text-[#EEEEEE] text-xs sm:text-sm font-inter font-bold uppercase tracking-[1.40px] leading-5">
              Editörün Seçimi
            </span>
          </div>

          {/* Game Title */}
          <div className="flex flex-col justify-center items-start">
            <h2 className="text-[rgba(255,255,255,0.90)] text-2xl sm:text-[36px] md:text-[48px] font-manrope font-bold uppercase leading-tight sm:leading-[40px] md:leading-[48px]">
              Ghostrunner 2
            </h2>
          </div>

          {/* Description */}
          <div className="w-full max-w-[448px] pt-1 sm:pt-2 pb-4 sm:pb-6 flex flex-col justify-center items-start">
            <p className="text-[#D1D5DB] text-sm sm:text-base font-inter font-normal leading-5 sm:leading-6">
              Siberpunk dünyasında hızın sınırlarını zorla. Türkçe yama ile hikayenin her detayını yakala.
            </p>
          </div>

          {/* Button */}
          <Link
            href="/oyun/ghostrunner-2"
            className="h-10 sm:h-12 px-6 sm:px-8 flex justify-center items-center rounded-full bg-gradient-to-r from-[#C99BFF] to-[#4F57BB] transition hover:opacity-90 active:scale-95"
            style={{
              boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.30), 0px 4px 4px rgba(0, 0, 0, 0.25)"
            }}
          >
            <span className="text-black text-center text-sm sm:text-base font-inter font-bold leading-6">
              İncelemeye Git
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}
