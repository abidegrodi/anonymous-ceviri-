"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchEditorPick, type StrapiEditorPick } from "@/lib/strapi";

const FALLBACK = {
  label: "EDITÖRÜN SEÇİMİ",
  title: "Ghostrunner 2",
  description:
    "Siberpunk dünyasında hızın sınırlarını zorla. Türkçe çeviri ile hikayenin her detayını yakala.",
  buttonText: "İncelemeye Git",
  buttonLink: "/turkce-ceviriler",
  backgroundImage:
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2144740/library_hero.jpg",
};

export default function EditorsChoice() {
  const [data, setData] = useState<StrapiEditorPick | null>(null);

  useEffect(() => {
    fetchEditorPick().then(setData).catch(() => {});
  }, []);

  const label = data?.label || FALLBACK.label;
  const title = data?.title || FALLBACK.title;
  const description = data?.description || FALLBACK.description;
  const buttonText = data?.buttonText || FALLBACK.buttonText;
  const buttonLink = data?.buttonLink || FALLBACK.buttonLink;
  const bgImage =
    data?.backgroundImage?.data?.attributes?.url || FALLBACK.backgroundImage;

  return (
    <section
      className="py-8 sm:py-12"
      style={{
        paddingLeft: "clamp(16px, 5vw, 344px)",
        paddingRight: "clamp(16px, 5vw, 344px)",
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: "1280px" }}>
      <div
        className="relative w-full min-h-[220px] sm:min-h-[260px] md:h-[300px] overflow-hidden rounded-[16px] sm:rounded-[24px] flex items-center border border-white/[0.06]"
        style={{
          boxShadow:
            "0 0 80px rgba(201, 155, 255, 0.15), 0 0 160px rgba(79, 87, 187, 0.08), 0 4px 60px rgba(121, 93, 153, 0.12), 0 8px 32px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Background Image */}
        <img
          src={bgImage}
          alt={title}
          className="absolute left-0 top-0 w-full h-full object-cover"
        />

        {/* Magenta Overlay */}
        <div
          className="absolute left-0 top-0 w-full h-full mix-blend-overlay"
          style={{ background: "rgba(255, 0, 255, 0.20)" }}
        ></div>

        {/* Purple edge glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[16px] sm:rounded-[24px]"
          style={{
            boxShadow:
              "inset 0 0 40px rgba(201, 155, 255, 0.06), inset 0 1px 0 rgba(201, 155, 255, 0.1)",
          }}
        ></div>

        {/* Gradient Overlay */}
        <div
          className="absolute left-0 top-0 w-full h-full"
          style={{
            background:
              "linear-gradient(90deg, black 0%, rgba(0, 0, 0, 0.80) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        ></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-start gap-2 px-6 sm:px-10 md:px-16 py-6 max-w-[672px]">
          {/* Editor's Choice Label */}
          <div className="flex flex-col justify-center items-start">
            <span className="text-[#EEEEEE] text-xs sm:text-sm font-caviar font-bold uppercase tracking-[1.40px] leading-5">
              {label}
            </span>
          </div>

          {/* Game Title */}
          <div className="flex flex-col justify-center items-start">
            <h2 className="text-[rgba(255,255,255,0.90)] text-2xl sm:text-[36px] md:text-[48px] font-trajan font-bold uppercase leading-tight sm:leading-[40px] md:leading-[48px]">
              {title}
            </h2>
          </div>

          {/* Description */}
          <div className="w-full max-w-[448px] pt-1 sm:pt-2 pb-4 sm:pb-6 flex flex-col justify-center items-start">
            <p className="text-[#D1D5DB] text-sm sm:text-base font-caviar font-normal leading-5 sm:leading-6">
              {description}
            </p>
          </div>

          {/* Button */}
          <Link
            href={buttonLink}
            className="h-10 sm:h-12 px-6 sm:px-8 flex justify-center items-center rounded-full bg-gradient-to-r from-[#C99BFF] to-[#4F57BB] transition hover:opacity-90 active:scale-95"
            style={{
              boxShadow:
                "0px 0px 20px rgba(255, 255, 255, 0.30), 0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <span className="text-black text-center text-sm sm:text-base font-caviar font-bold leading-6">
              {buttonText}
            </span>
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
