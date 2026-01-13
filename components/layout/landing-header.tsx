"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#nasil-calisir", label: "Nasıl Çalışır" },
    { href: "#ilanlar", label: "İlanlar" },
    { href: "#avantajlar", label: "Avantajlar" },
    { href: "#sss", label: "SSS" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-primary-orange rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
              <img
                src="/logo.jpeg"
                alt="Taşeroncum Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`text-xl font-bold transition-colors ${
              isScrolled ? "text-text-primary" : "text-white"
            }`}>
              Taşeroncum<span className="text-primary-orange">.com</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all hover:text-primary-orange relative group ${
                  isScrolled ? "text-text-primary" : "text-white"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-orange transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className={`transition-all hover:scale-105 ${
                  isScrolled
                    ? "text-text-primary hover:text-primary-orange"
                    : "text-white hover:text-primary-orange hover:bg-white/10"
                }`}
              >
                Giriş Yap
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white transition-all hover:scale-105 shadow-lg hover:shadow-xl">
                Kayıt Ol
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 transition-transform hover:scale-110"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? "text-text-primary" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? "text-text-primary" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border-gray bg-white">
            <div className="py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-text-primary hover:bg-light-gray-bg hover:text-primary-orange transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-4 pt-4 border-t border-border-gray space-y-3">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full bg-primary-orange hover:bg-primary-orange/90">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
