import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-bg text-white">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-orange rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                <img
                  src="/logo.jpeg"
                  alt="Taşeroncum Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">
                Taşeroncum<span className="text-primary-orange">.com</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Türkiye'nin en güvenilir inşaat marketplace platformu. Firmalar ve taşeronları hızlıca buluşturan dijital çözüm.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-9 h-9 bg-soft-dark rounded-lg flex items-center justify-center hover:bg-primary-orange transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-soft-dark rounded-lg flex items-center justify-center hover:bg-primary-orange transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-soft-dark rounded-lg flex items-center justify-center hover:bg-primary-orange transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/register"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Kayıt Ol
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Giriş Yap
                </Link>
              </li>
              <li>
                <Link
                  href="/ilanlar"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  İlanlar
                </Link>
              </li>
              <li>
                <a
                  href="#nasil-calisir"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Nasıl Çalışır
                </a>
              </li>
              <li>
                <a
                  href="#avantajlar"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Avantajlar
                </a>
              </li>
            </ul>
          </div>

          {/* Firmalar İçin */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Firmalar İçin</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/register?type=firma"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  İlan Yayınla
                </Link>
              </li>
              <li>
                <Link
                  href="/register?type=firma"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Firma Kaydı
                </Link>
              </li>
              <li>
                <Link
                  href="/ilanlar"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Örnek İlanlar
                </Link>
              </li>
              <li>
                <a
                  href="#sss"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Sıkça Sorulan Sorular
                </a>
              </li>
            </ul>
          </div>

          {/* Taşeronlar İçin */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Taşeronlar İçin</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/register?type=taseron"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Teklif Ver
                </Link>
              </li>
              <li>
                <Link
                  href="/ilanlar"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  İş Bul
                </Link>
              </li>
              <li>
                <Link
                  href="/register?type=taseron"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Taşeron Kaydı
                </Link>
              </li>
              <li>
                <a
                  href="#avantajlar"
                  className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
                >
                  Avantajlarımız
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-soft-dark">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm">
              © {currentYear} Taşeroncum.com - Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6">
              <Link
                href="/gizlilik"
                className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
              >
                Gizlilik Politikası
              </Link>
              <Link
                href="/kullanim-kosullari"
                className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
              >
                Kullanım Koşulları
              </Link>
              <Link
                href="/iletisim"
                className="text-text-secondary hover:text-primary-orange transition-colors text-sm"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
