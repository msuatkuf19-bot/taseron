"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!session?.user) return "/login";
    switch (session.user.role) {
      case "ADMIN":
        return "/admin";
      case "FIRMA":
        return "/dashboard/firma";
      case "TASERON":
        return "/dashboard/taseron";
      default:
        return "/";
    }
  };

  const getProfileLink = () => {
    if (!session?.user) return null;
    if (session.user.role === "FIRMA" && session.user.companyProfileId) {
      return `/firma/${session.user.companyProfileId}`;
    }
    if (session.user.role === "TASERON" && session.user.contractorProfileId) {
      return `/taseron/${session.user.contractorProfileId}`;
    }
    return null;
  };

  return (
    <header className="bg-dark text-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">
            T
          </div>
          <span className="text-xl font-bold">
            Taşeroncum<span className="text-primary">.com</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/ilanlar" className="hover:text-primary transition-colors">
            İlanlar
          </Link>
          
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">
                      {session.user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.role === "FIRMA"
                        ? "Firma Hesabı"
                        : session.user.role === "TASERON"
                        ? "Taşeron Hesabı"
                        : "Admin"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {getProfileLink() && (
                  <DropdownMenuItem asChild>
                    <Link href={getProfileLink()!}>
                      <User className="mr-2 h-4 w-4" />
                      Profilim
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Giriş Yap</Button>
              </Link>
              <Link href="/register">
                <Button>Kayıt Ol</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark border-t border-gray-700">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/ilanlar"
              className="block hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              İlanlar
            </Link>
            {session?.user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="block hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {getProfileLink() && (
                  <Link
                    href={getProfileLink()!}
                    className="block hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profilim
                  </Link>
                )}
                <button
                  className="block text-left hover:text-primary transition-colors"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Kayıt Ol</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
