import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { CookieSettingsButton } from "@/components/legal/cookie-consent";
import { LEGAL, CONSENT_COOKIE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Çerez Politikası | Taşeroncum.com",
  description: "Taşeroncum.com'da kullanılan çerezler, amaçları ve tercihlerinizi nasıl yöneteceğiniz.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      current="/cerez-politikasi"
      title="Çerez politikası"
      intro={
        <p>
          {LEGAL.brand} olarak sitemizi güvenle çalıştırmak için çerezler kullanıyoruz. Bu sayfa hangi
          çerezleri neden kullandığımızı ve tercihlerinizi nasıl değiştirebileceğinizi açıklar.
        </p>
      }
      sections={[
        {
          id: "cerez-nedir",
          title: "Çerez nedir?",
          body: (
            <p>
              Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin
              dosyalarıdır. Oturumunuzun açık kalmasını, tercihlerinizin hatırlanmasını ve sitenin
              güvenli çalışmasını sağlar.
            </p>
          ),
        },
        {
          id: "turler",
          title: "Kullandığımız çerez türleri",
          body: (
            <>
              <ul>
                <li><strong>Zorunlu çerezler:</strong> Giriş yapma, oturum güvenliği ve çerez tercihinizin hatırlanması için gereklidir. Bu çerezler KVKK md. 5/2-c ve 5/2-f kapsamında onay aranmaksızın kullanılır ve kapatılamaz.</li>
                <li><strong>Analitik çerezler:</strong> Sitenin nasıl kullanıldığını anonim olarak ölçer. Yalnızca açık rızanızla çalışır.</li>
                <li><strong>Pazarlama çerezleri:</strong> İlgi alanınıza uygun içerik göstermek için kullanılır. Yalnızca açık rızanızla çalışır.</li>
              </ul>
              <p>
                Şu anda sitemizde analitik veya pazarlama çerezi bulunmamaktadır. Bu çerezler ileride
                kullanılmaya başlanırsa, yalnızca onay vermiş olmanız hâlinde etkinleşir ve bu sayfa
                güncellenir.
              </p>
            </>
          ),
        },
        {
          id: "liste",
          title: "Çerez listesi",
          body: (
            <table className="legal-table">
              <thead><tr><th>Çerez adı</th><th>Tür</th><th>Amaç</th><th>Süre</th></tr></thead>
              <tbody>
                <tr><td><code>next-auth.session-token</code></td><td>Zorunlu</td><td>Giriş yapmış kullanıcının oturumunu sürdürür</td><td>30 gün</td></tr>
                <tr><td><code>next-auth.csrf-token</code></td><td>Zorunlu</td><td>Form gönderimlerini sahte isteklere karşı korur</td><td>Oturum</td></tr>
                <tr><td><code>next-auth.callback-url</code></td><td>Zorunlu</td><td>Girişten sonra doğru sayfaya dönmenizi sağlar</td><td>Oturum</td></tr>
                <tr><td><code>{CONSENT_COOKIE}</code></td><td>Zorunlu</td><td>Çerez tercihinizi hatırlar</td><td>1 yıl</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          id: "yonetim",
          title: "Tercihlerinizi yönetme",
          body: (
            <>
              <p>
                Çerez tercihlerinizi istediğiniz zaman değiştirebilir veya verdiğiniz onayı geri
                alabilirsiniz:
              </p>
              <p><CookieSettingsButton /></p>
              <p>
                Ayrıca tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Zorunlu
                çerezleri engellerseniz giriş yapma gibi bazı özellikler çalışmayabilir.
              </p>
            </>
          ),
        },
        {
          id: "haklar",
          title: "Haklarınız",
          body: (
            <p>
              Çerezler aracılığıyla işlenen kişisel verilerinize ilişkin KVKK&apos;nın 11. maddesindeki
              haklarınızı ve başvuru yöntemini <a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a>&apos;nde
              bulabilirsiniz.
            </p>
          ),
        },
      ]}
    />
  );
}
