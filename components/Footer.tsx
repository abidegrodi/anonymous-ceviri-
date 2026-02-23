import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="relative z-20 w-full"
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
          {/* Brand/About Section */}
          <div className="max-w-[320px]">
            {/* Logo */}
            <div className="mb-6">
              <Link href="/">
                <Image
                  src="/logo-anonymous.png"
                  alt="ANONYMOUS Logo"
                  width={162}
                  height={48}
                  className="h-auto"
                />
              </Link>
            </div>
            <p
              style={{
                fontFamily: "Caviar Dreams, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "22.75px",
                color: "#FAF8FF",
              }}
            >
              Oyun deneyiminizi ana dilinizde yaşamanız için tutkuyla çalışıyoruz. Türkiye&apos;nin en kapsamlı{" "}
              <span style={{ fontWeight: 700 }}>Türkçe çeviri</span> platformu.
            </p>
          </div>

          {/* Links Sections */}
          <div className="flex flex-wrap gap-12 lg:gap-24">
            {/* Site Haritası */}
            <div className="min-w-[100px]">
              <h4
                className="mb-4"
                style={{
                  fontFamily: "Caviar Dreams, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: "24px",
                  color: "#FAF8FF",
                }}
              >
                Site Haritası
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#C99BFF] transition-colors"
                    style={{
                      fontFamily: "Caviar Dreams, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#FAF8FF",
                    }}
                  >
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/turkce-ceviriler"
                    className="hover:text-[#C99BFF] transition-colors"
                    style={{
                      fontFamily: "Caviar Dreams, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#FAF8FF",
                    }}
                  >
                    Türkçe Çeviriler
                  </Link>
                </li>
                <li>
                  <Link
                    href="/duyurular"
                    className="hover:text-[#C99BFF] transition-colors"
                    style={{
                      fontFamily: "Caviar Dreams, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#FAF8FF",
                    }}
                  >
                    Duyurular
                  </Link>
                </li>
                <li>
                  <Link
                    href="/iletisim"
                    className="hover:text-[#C99BFF] transition-colors"
                    style={{
                      fontFamily: "Caviar Dreams, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#FAF8FF",
                    }}
                  >
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="min-w-[110px]">
              <h4
                className="mb-4"
                style={{
                  fontFamily: "Caviar Dreams, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: "24px",
                  color: "#FAF8FF",
                }}
              >
                Legal
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/sss"
                    className="hover:text-[#C99BFF] transition-colors"
                    style={{
                      fontFamily: "Caviar Dreams, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#FAF8FF",
                    }}
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gizlilik-politikasi"
                    className="hover:text-[#C99BFF] transition-colors"
                    style={{
                      fontFamily: "Caviar Dreams, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#FAF8FF",
                    }}
                  >
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link
                    href="/satis-sozlesmesi"
                    className="hover:text-[#C99BFF] transition-colors"
                    style={{
                      fontFamily: "Caviar Dreams, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#FAF8FF",
                    }}
                  >
                    Satış Sözleşmesi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4
                className="mb-4"
                style={{
                  fontFamily: "Caviar Dreams, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: "24px",
                  color: "#FAF8FF",
                }}
              >
                Sosyal Medya
              </h4>
              <div className="flex gap-4">
                {/* Discord */}
                <Link
                  href="https://discord.gg"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  aria-label="Discord"
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "16px",
                      color: "rgba(255, 255, 255, 0.90)",
                    }}
                  >
                    DC
                  </span>
                </Link>
                {/* Instagram */}
                <Link
                  href="https://instagram.com"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  aria-label="Instagram"
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "16px",
                      color: "rgba(255, 255, 255, 0.90)",
                    }}
                  >
                    IG
                  </span>
                </Link>
                {/* Twitter */}
                <Link
                  href="https://twitter.com"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  aria-label="Twitter"
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      lineHeight: "16px",
                      color: "rgba(255, 255, 255, 0.90)",
                    }}
                  >
                    TW
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
        >
          <p
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#FAF8FF",
            }}
          >
            © 2026 Anonymous Çeviri. Tüm hakları saklıdır.
          </p>
          <p
            style={{
              fontFamily: "Caviar Dreams, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#FAF8FF",
              textAlign: "right",
            }}
          >
            made with love in izmir by "grodi.co"
          </p>
        </div>
      </div>
    </footer>
  );
}
