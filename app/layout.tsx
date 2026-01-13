import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taşeroncum.com - İnşaat Marketplace",
  description: "İnşaat sektöründe firma ve taşeronları buluşturan güvenilir marketplace platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <LandingHeader />
          <main className="flex-1">{children}</main>
          <LandingFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
