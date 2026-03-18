import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/turkce-ceviriler", label: "Türkçe Çeviriler" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/sss", label: "FAQ" },
  { href: "https://destek.anonymousceviri.com/", label: "Destek", target: "_blank", rel: "noopener noreferrer" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/anonymousceviri/",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com/CeviriAnonymous",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative z-20 w-full" style={{ background: "#060606" }}>
      {/* Top gradient line */}
      <div
        className="h-[2px] w-full"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #7B5EA7 30%, #C99BFF 50%, #7B5EA7 70%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        {/* Main content - compact single row */}
        <div className="py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left: Logo + tagline */}
          <div className="flex items-center gap-5">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo-anonymous.png"
                alt="ANONYMOUS Logo"
                width={140}
                height={36}
                className="h-auto opacity-80"
              />
            </Link>
            <div
              className="hidden sm:block w-[1px] h-8 shrink-0"
              style={{ background: "rgba(123, 94, 167, 0.2)" }}
            />
            <p className="hidden sm:block font-caviar text-[13px] leading-[18px] text-white/40 font-medium whitespace-nowrap" style={{ fontStyle: 'normal' }}>
              Türkiye&apos;nin en kapsamlı oyun çeviri platformu.
            </p>
          </div>

          {/* Right: Links + Social */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            {/* Navigation links - inline */}
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  {...('target' in link ? { target: link.target, rel: link.rel } : {})}
                  className="font-caviar text-[12px] text-white/45 font-medium hover:text-[#C99BFF] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div
              className="hidden sm:block w-[1px] h-6 shrink-0"
              style={{ background: "rgba(123, 94, 167, 0.15)" }}
            />

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-[#C99BFF] hover:border-[#C99BFF]/30 transition-all duration-200"
                  style={{
                    background: "rgba(123, 94, 167, 0.06)",
                    border: "1px solid rgba(123, 94, 167, 0.12)",
                  }}
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 flex flex-col sm:flex-row justify-between items-center gap-2"
          style={{ borderTop: "1px solid rgba(123, 94, 167, 0.08)" }}
        >
          <p className="font-caviar text-[11px] text-white/30 font-medium">
            © 2026 Anonymous Çeviri. Tüm hakları saklıdır.
          </p>
          <p className="font-caviar text-[11px] text-white/20 font-medium">
            made with love in izmir by &quot;grodi.co&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
