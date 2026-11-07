"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_COOKIE, CONSENT_VERSION } from "@/lib/legal";

type Consent = { v: number; necessary: true; analytics: boolean; marketing: boolean; at: string };
const OPEN_EVENT = "tc:open-cookie-settings";

function readConsent(): Consent | null {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw.split("=").slice(1).join("=")));
    return parsed?.v === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function writeConsent(analytics: boolean, marketing: boolean) {
  const value: Consent = { v: CONSENT_VERSION, necessary: true, analytics, marketing, at: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent("tc:consent-changed", { detail: value }));
}

export function CookieSettingsButton() {
  return (
    <button type="button" className="footer-link-button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Çerez tercihleri
    </button>
  );
}

export function CookieConsent() {
  const [mode, setMode] = useState<"hidden" | "banner" | "settings">("hidden");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    } else {
      setMode("banner");
    }
    const open = () => {
      const c = readConsent();
      setAnalytics(!!c?.analytics);
      setMarketing(!!c?.marketing);
      setMode("settings");
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (mode !== "settings") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMode(readConsent() ? "hidden" : "banner");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  const save = (a: boolean, m: boolean) => {
    writeConsent(a, m);
    setMode("hidden");
  };

  if (mode === "hidden") return null;

  if (mode === "banner") {
    return (
      <section className="cc-banner" role="region" aria-label="Çerez bildirimi">
        <div className="cc-banner-text">
          <h2>Çerezleri nasıl kullandığımızı seçin</h2>
          <p>
            Oturumunuzu açık tutmak ve siteyi güvenle çalıştırmak için zorunlu çerezler kullanıyoruz.
            Analitik ve pazarlama çerezleri yalnızca onay verirseniz çalışır. Ayrıntılar için{" "}
            <Link href="/cerez-politikasi">Çerez Politikası</Link> ve{" "}
            <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>.
          </p>
        </div>
        <div className="cc-actions">
          <button type="button" className="cc-btn cc-btn-quiet" onClick={() => setMode("settings")}>
            Tercihleri yönet
          </button>
          <button type="button" className="cc-btn cc-btn-line" onClick={() => save(false, false)}>
            Yalnızca zorunlu
          </button>
          <button type="button" className="cc-btn cc-btn-solid" onClick={() => save(true, true)}>
            Tümünü kabul et
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="cc-overlay" onClick={(e) => e.target === e.currentTarget && setMode(readConsent() ? "hidden" : "banner")}>
      <div className="cc-dialog" role="dialog" aria-modal="true" aria-labelledby="cc-title">
        <h2 id="cc-title">Çerez tercihleri</h2>
        <p className="cc-dialog-lede">
          Hangi çerez türlerine izin verdiğinizi seçin. Tercihinizi istediğiniz zaman sayfanın altındaki
          &ldquo;Çerez tercihleri&rdquo; bağlantısından değiştirebilirsiniz.
        </p>
        <ul className="cc-list">
          <li>
            <div>
              <h3>Zorunlu çerezler</h3>
              <p>Oturum açma, güvenlik ve tercihlerinizi hatırlama. Site bunlar olmadan çalışmaz.</p>
            </div>
            <span className="cc-always">Her zaman açık</span>
          </li>
          <li>
            <div>
              <h3 id="cc-analytics">Analitik çerezler</h3>
              <p>Hangi sayfaların kullanıldığını anonim olarak ölçer, siteyi geliştirmemize yardım eder.</p>
            </div>
            <Toggle labelledBy="cc-analytics" checked={analytics} onChange={setAnalytics} />
          </li>
          <li>
            <div>
              <h3 id="cc-marketing">Pazarlama çerezleri</h3>
              <p>İlgi alanınıza uygun duyuru ve kampanyaları göstermek için kullanılır.</p>
            </div>
            <Toggle labelledBy="cc-marketing" checked={marketing} onChange={setMarketing} />
          </li>
        </ul>
        <div className="cc-actions cc-actions-dialog">
          <button type="button" className="cc-btn cc-btn-line" onClick={() => save(false, false)}>
            Yalnızca zorunlu
          </button>
          <button type="button" className="cc-btn cc-btn-solid" autoFocus onClick={() => save(analytics, marketing)}>
            Seçimimi kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, labelledBy }: { checked: boolean; onChange: (v: boolean) => void; labelledBy: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      className="cc-switch"
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}
