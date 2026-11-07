import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { CookieConsent } from "@/components/legal/cookie-consent";

const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  title: "Taşeroncum.com | Firmalar ve taşeronlar için inşaat pazaryeri",
  description: "Kaba inşaattan peyzaja on uzmanlık alanında onaylı ilanlar ve karşılaştırılabilir teklifler. Taşeronlar ve firmalar Taşeroncum'da buluşur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${archivo.className} ${archivo.variable} min-h-screen flex flex-col`}>
        <AuthProvider>
          <LandingHeader />
          <main className="flex-1">{children}</main>
          <LandingFooter />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
