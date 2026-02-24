import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/turkce-ceviriler", label: "Türkçe Yamalar" },
  { href: "/duyurular", label: "Duyurular" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/sss", label: "FAQ" },
  { href: "/destek", label: "Destek" },
];

const socials = [
  {
    label: "Discord",
    href: "#",
    icon: (
      <svg width="16" height="12" viewBox="0 0 24 18" fill="currentColor">
        <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492.07.07 0 0 0 3.644 1.52C.533 6.093-.319 10.555.099 14.961a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.098.246.198.373.293a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.029 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.02zM8.02 12.278c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
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
    href: "#",
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
            <p className="hidden sm:block font-inter text-[12px] leading-[18px] text-white/25 max-w-[240px]">
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
                  className="font-inter text-[12px] text-white/30 hover:text-[#C99BFF] transition-colors duration-200"
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
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-[#C99BFF] hover:border-[#C99BFF]/30 transition-all duration-200"
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
          <p className="font-inter text-[11px] text-white/15">
            © 2026 Anonymous Çeviri. Tüm hakları saklıdır.
          </p>
          <p className="font-inter text-[11px] text-white/10">
            made with love in izmir by &quot;grodi.co&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}
