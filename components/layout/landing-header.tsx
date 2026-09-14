"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./brand-logo";
export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [{href:"/ilanlar",label:"İş İlanları"},{href:"/#nasil-calisir",label:"Nasıl Çalışır?"},{href:"/yonetim-kurulu",label:"Yönetim Kurulu"}];
  return <header className="brand-header"><div className="brand-shell header-inner"><Link href="/" aria-label="Taşeroncum ana sayfa" onClick={() => setOpen(false)}><BrandLogo /></Link><nav className="desktop-nav" aria-label="Ana menü">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}</nav><div className="header-actions"><Link href="/login">Giriş yap</Link><Link className="brand-button compact" href="/register">Aramıza katıl <ArrowUpRight size={17} /></Link></div><button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button></div>{open && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobil menü">{[...links,{href:"/login",label:"Giriş yap"},{href:"/register",label:"Aramıza katıl"}].map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>}</header>;
}
