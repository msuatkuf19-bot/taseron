"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Building2, HardHat, Loader2 } from "lucide-react";
import { registerUser } from "@/actions/auth";
import { CITIES } from "@/lib/utils";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordField } from "@/components/auth/password-field";

type Role = "FIRMA" | "TASERON";

function initialRole(params: { get(name: string): string | null }): Role | "" {
  const v = (params.get("type") || params.get("role") || "").toUpperCase();
  return v === "FIRMA" || v === "TASERON" ? v : "";
}

const ROLES: { value: Role; title: string; text: string; icon: typeof Building2 }[] = [
  { value: "FIRMA", title: "Firmayım", text: "Onaylı ilanları inceleyip teklif vermek istiyorum.", icon: Building2 },
  { value: "TASERON", title: "Taşeronum", text: "İlan açıp firmalardan teklif almak istiyorum.", icon: HardHat },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    role: initialRole(searchParams),
    email: "",
    password: "",
    companyName: "",
    displayName: "",
    city: "",
    phone: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.role) return setError("Devam etmek için hesap türünü seçin.");
    if (!form.city) return setError("Lütfen şehrinizi seçin.");
    if (!accepted) return setError("Kayıt için Kullanım Koşulları'nı kabul etmeniz ve Aydınlatma Metni'ni okumanız gerekir.");
    setLoading(true);
    try {
      const result = await registerUser({
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        companyName: form.companyName.trim(),
        displayName: form.displayName.trim(),
        city: form.city,
        phone: form.phone.trim(),
      });
      if (result.error) setError(result.error);
      else router.push("/login?registered=true");
    } catch {
      setError("Kayıt tamamlanamadı. Lütfen birkaç dakika sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Ücretsiz hesap oluşturun"
      subtitle={
        <>
          Zaten üye misiniz? <Link href="/login">Giriş yapın</Link>
        </>
      }
      aside={{
        heading: "Doğru iş, doğru ekiple başlar.",
        points: [
          "Kayıt ve ilan yayınlama ücretsiz",
          "Her ilan yayına girmeden önce incelenir",
          "Teklifler fiyat ve süreyle yan yana",
          "Tamamlanan işler profilinize puan olarak işlenir",
        ],
      }}
    >
      {error && (
        <div className="auth-alert is-error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="auth-form">
        <fieldset className="auth-roles">
          <legend>Hesap türü</legend>
          {ROLES.map(({ value, title, text, icon: Icon }) => (
            <label key={value} className={`auth-role${form.role === value ? " is-active" : ""}`}>
              <input
                type="radio"
                name="role"
                value={value}
                checked={form.role === value}
                onChange={() => set("role", value)}
              />
              <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
              <span className="auth-role-title">{title}</span>
              <span className="auth-role-text">{text}</span>
            </label>
          ))}
        </fieldset>

        {form.role === "FIRMA" && (
          <div className="auth-field">
            <label htmlFor="companyName">Firma adı</label>
            <input id="companyName" className="auth-input" autoComplete="organization" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} required />
          </div>
        )}
        {form.role === "TASERON" && (
          <div className="auth-field">
            <label htmlFor="displayName">Ad soyad veya ticari unvan</label>
            <input id="displayName" className="auth-input" autoComplete="name" value={form.displayName} onChange={(e) => set("displayName", e.target.value)} required />
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="email">E-posta adresi</label>
          <input id="email" type="email" className="auth-input" autoComplete="email" inputMode="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Şifre</label>
          <PasswordField id="password" value={form.password} onChange={(v) => set("password", v)} autoComplete="new-password" minLength={6} describedBy="password-hint" />
          <p id="password-hint" className="auth-hint">En az 6 karakter. Harf ve rakam karışımı daha güvenlidir.</p>
        </div>

        <div className="auth-row">
          <div className="auth-field">
            <label htmlFor="city">Şehir</label>
            <select id="city" className="auth-input auth-select" value={form.city} onChange={(e) => set("city", e.target.value)} required>
              <option value="" disabled>Seçin</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="auth-field">
            <label htmlFor="phone">
              Telefon <span className="auth-optional">(isteğe bağlı)</span>
            </label>
            <input id="phone" type="tel" className="auth-input" autoComplete="tel" inputMode="tel" placeholder="05xx xxx xx xx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
        </div>

        <label className="auth-check">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required />
          <span>
            <Link href="/kullanim-kosullari" target="_blank">Kullanım Koşulları</Link>&apos;nı okudum ve kabul ediyorum.
            Kişisel verilerimin <Link href="/kvkk-aydinlatma-metni" target="_blank">KVKK Aydınlatma Metni</Link> kapsamında
            işleneceği konusunda bilgilendirildim.
          </span>
        </label>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? <><Loader2 size={18} className="auth-spin" aria-hidden="true" /> Hesap oluşturuluyor</> : "Hesap oluştur"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="auth-loading">Yükleniyor…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
