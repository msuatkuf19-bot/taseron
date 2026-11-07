"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordField } from "@/components/auth/password-field";

function friendlyError(raw: string) {
  if (/devre dışı/i.test(raw)) return "Hesabınız devre dışı bırakılmış. Destek ekibimizle iletişime geçin.";
  if (/bulunamadı|geçersiz|şifre|credentials/i.test(raw)) return "E-posta adresi veya şifre hatalı. Bilgilerinizi kontrol edip tekrar deneyin.";
  return "Giriş yapılamadı. Lütfen birkaç dakika sonra tekrar deneyin.";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const justRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError(friendlyError(result.error));
        return;
      }
      const session = await (await fetch("/api/auth/session")).json();
      const role = session?.user?.role;
      if (role === "ADMIN") router.replace("/admin");
      else if (role === "FIRMA") router.replace("/dashboard/firma");
      else if (role === "TASERON") router.replace("/dashboard/taseron/ilanlar");
      else router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError("Giriş yapılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Hesabınıza giriş yapın"
      subtitle={
        <>
          Hesabınız yok mu? <Link href="/register">Ücretsiz kayıt olun</Link>
        </>
      }
      aside={{
        heading: "Projeleriniz ve teklifleriniz sizi bekliyor.",
        points: [
          "İlanlarınızın onay durumunu takip edin",
          "Gelen teklifleri yan yana karşılaştırın",
          "Tamamlanan işlerinizin değerlendirmelerini görün",
        ],
      }}
    >
      {justRegistered && !error && (
        <div className="auth-alert is-success" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.</span>
        </div>
      )}
      {error && (
        <div className="auth-alert is-error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="auth-form" noValidate={false}>
        <div className="auth-field">
          <label htmlFor="email">E-posta adresi</label>
          <input
            id="email"
            name="email"
            type="email"
            className="auth-input"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Şifre</label>
          <PasswordField id="password" value={password} onChange={setPassword} autoComplete="current-password" />
        </div>
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? <><Loader2 size={18} className="auth-spin" aria-hidden="true" /> Giriş yapılıyor</> : "Giriş yap"}
        </button>
      </form>
      <p className="auth-legal">
        Giriş yaparak <Link href="/kullanim-kosullari">Kullanım Koşulları</Link>&apos;nı kabul etmiş olursunuz.
        Verilerinizin nasıl işlendiğini <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;nde
        bulabilirsiniz.
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-loading">Yükleniyor…</div>}>
      <LoginForm />
    </Suspense>
  );
}
