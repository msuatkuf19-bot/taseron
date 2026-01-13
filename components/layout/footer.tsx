import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">
                T
              </div>
              <span className="text-xl font-bold">
                Taşeroncum<span className="text-primary">.com</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              İnşaat sektöründe firma ve taşeronları buluşturan güvenilir
              marketplace platformu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/ilanlar" className="hover:text-primary transition-colors">
                  Tüm İlanlar
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Kayıt Ol
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h3 className="font-semibold mb-4">Firmalar İçin</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Firma Olarak Kayıt
                </Link>
              </li>
              <li>
                <Link href="/ilanlar" className="hover:text-primary transition-colors">
                  İlan Yayınla
                </Link>
              </li>
            </ul>
          </div>

          {/* For Contractors */}
          <div>
            <h3 className="font-semibold mb-4">Taşeronlar İçin</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Taşeron Olarak Kayıt
                </Link>
              </li>
              <li>
                <Link href="/ilanlar" className="hover:text-primary transition-colors">
                  İş Bul
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Taşeroncum.com - Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
