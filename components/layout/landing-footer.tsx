import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { CookieSettingsButton } from "@/components/legal/cookie-consent";
import { LEGAL } from "@/lib/legal";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/ilanlar", label: "İş ilanları" },
      { href: "/#uzmanliklar", label: "Uzmanlık alanları" },
      { href: "/#nasil-calisir", label: "Nasıl çalışır?" },
    ],
  },
  {
    title: "Hesap",
    links: [
      { href: "/register?type=firma", label: "Firma hesabı aç" },
      { href: "/register?type=taseron", label: "Taşeron hesabı aç" },
      { href: "/login", label: "Giriş yap" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { href: "/yonetim-kurulu", label: "Yönetim kurulu" },
      { href: "/#yatirimci", label: "Yatırımcı ilişkileri" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/kvkk-aydinlatma-metni", label: "KVKK aydınlatma metni" },
      { href: "/gizlilik-politikasi", label: "Gizlilik politikası" },
      { href: "/cerez-politikasi", label: "Çerez politikası" },
      { href: "/kullanim-kosullari", label: "Kullanım koşulları" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="site-footer">
      <div className="brand-shell">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link href="/" aria-label="Taşeroncum ana sayfa">
              <BrandLogo tone="dark" />
            </Link>
            <p>
              Firmaları ve taşeronları onaylı ilanlar ve karşılaştırılabilir tekliflerle buluşturan
              inşaat pazaryeri.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="site-footer-col">
              <h2>{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
                {col.title === "Yasal" && (
                  <li>
                    <CookieSettingsButton />
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} {LEGAL.brand}. Tüm hakları saklıdır.</span>
          <span>Kişisel verileriniz 6698 sayılı KVKK kapsamında korunur.</span>
        </div>
      </div>
    </footer>
  );
}
