"use client";

import Link from "next/link";

interface GameCardProps {
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

export default function GameCard({ title, subtitle, progress, status, tag, image, href }: GameCardProps) {
  const isTestStatus = status != null && progress < 100;
  const progressBarWidth = `${Math.min(100, Math.max(0, progress))}%`;

  const cardContent = (
    <div
      className="flex-shrink-0 inline-flex flex-col gap-[11px] cursor-pointer group"
      style={{ width: "clamp(170px, 40vw, 227.2px)" }}
    >
      {/* Kart container */}
      <div
        className="relative flex flex-col justify-center items-start overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        {/* Görsel alanı */}
        <div className="relative w-full aspect-[2/3]">
          <img
            src={image || "https://placehold.co/225x339"}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.90) 0%, rgba(0, 0, 0, 0.40) 60%, rgba(0, 0, 0, 0) 100%)",
            }}
          />

          {/* Badge */}
          {tag && (
            <div
              className="absolute top-[13px] left-[13px] flex items-center justify-center px-2 py-1 rounded-md backdrop-blur-[2px]"
              style={{
                background:
                  tag.text === "TEST"
                    ? "linear-gradient(267deg, rgba(79, 87, 187, 0.90) 0%, rgba(201, 155, 255, 0.90) 100%)"
                    : "linear-gradient(270deg, rgba(120.60, 93, 153, 0.90) 0%, rgba(201, 155, 255, 0.90) 100%)",
                backgroundBlendMode: tag.text === "TEST" ? "overlay" : "color",
                boxShadow:
                  tag.text === "TEST"
                    ? "0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)"
                    : "0px 10px 15px -3px rgba(0, 0, 0, 0.10)",
              }}
            >
              <span
                className="uppercase text-[10px] leading-[15px] font-bold font-inter tracking-[0.50px] text-white"
                style={{
                  textShadow: tag.text === "TEST" ? "0px 4px 4px rgba(0, 0, 0, 0.25)" : undefined,
                }}
              >
                {tag.text}
              </span>
            </div>
          )}

          {/* Progress alanı */}
          <div
            className="absolute flex flex-col justify-start items-start gap-2 p-4 w-full left-0 bottom-4"
          >
            <div className="inline-flex justify-start items-end w-full">
              <div className="flex-1 flex flex-col justify-start items-start">
                <span
                  className="font-inter font-bold text-xs leading-4"
                  style={{
                    color: isTestStatus ? "#795D99" : "rgba(255, 255, 255, 0.90)",
                    textShadow: !isTestStatus && progress === 100 ? "0px 0px 5px rgba(255, 255, 255, 0.25)" : undefined,
                  }}
                >
                  %{progress}
                  {status ? ` ${status}` : ""}
                </span>
              </div>
            </div>
            {/* Progress bar track */}
            <div
              className="w-full h-1 overflow-hidden rounded-full bg-white/20"
            >
              <div
                className="h-full rounded-full min-w-0"
                style={{
                  width: progressBarWidth,
                  background: "linear-gradient(90deg, #C99BFF 0%, #4F57BB 100%)",
                  boxShadow: "0 0 12px rgba(201, 155, 255, 0.4)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Başlık + ekip */}
      <div className="flex flex-col items-center gap-1 w-full text-center">
        <h3
          className="group-hover:text-[#C99BFF]/90 transition-colors w-full font-inter font-bold text-lg leading-[22.5px] text-white"
        >
          {title}
        </h3>
        <p
          className="w-full font-inter font-normal text-xs leading-4 text-white/70"
        >
          {subtitle}
        </p>
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
