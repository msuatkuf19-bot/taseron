import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Taşeroncum.com",
  description: "Taşeroncum.com'da bilgilerinizin nasıl korunduğu, kimlerle paylaşıldığı ve hesabınız üzerindeki kontrolünüz.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      current="/gizlilik-politikasi"
      title="Gizlilik politikası"
      intro={
        <p>
          {LEGAL.brand}, firmaların ve taşeronların güvenle iş birliği kurabildiği bir platform olmayı
          hedefler. Bu politika, paylaştığınız bilgilerin platformda nasıl görüneceğini ve nasıl
          korunduğunu sade bir dille anlatır. Yasal ayrıntılar için KVKK Aydınlatma Metni&apos;ne bakabilirsiniz.
        </p>
      }
      sections={[
        {
          id: "gorunurluk",
          title: "Bilgileriniz kimlere görünür?",
          body: (
            <table className="legal-table">
              <thead><tr><th>Bilgi</th><th>Kimler görür?</th></tr></thead>
              <tbody>
                <tr><td>Onaylanmış ilan içeriği (başlık, açıklama, şehir, bütçe)</td><td>Siteyi ziyaret eden herkes</td></tr>
                <tr><td>Taslak ve onay bekleyen ilanlar</td><td>Yalnızca siz ve moderasyon ekibi</td></tr>
                <tr><td>Profil adı, şehir, uzmanlık ve değerlendirmeler</td><td>Platform kullanıcıları</td></tr>
                <tr><td>Teklif tutarı ve mesajı</td><td>Teklifi veren firma ve ilan sahibi taşeron</td></tr>
                <tr><td>E-posta ve telefon</td><td>İlanda iletişim bilgisi olarak paylaşmayı seçtiğinizde ilgili kullanıcılar</td></tr>
                <tr><td>Parola</td><td>Hiç kimse; parolanız geri döndürülemez biçimde şifrelenir</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          id: "guvenlik",
          title: "Bilgilerinizi nasıl koruyoruz?",
          body: (
            <ul>
              <li>Parolalar bcrypt algoritmasıyla tek yönlü şifrelenerek saklanır.</li>
              <li>Site trafiği HTTPS (TLS) ile şifrelenir.</li>
              <li>Yönetim paneline yalnızca yetkili hesaplar erişebilir; ilanlar yayın öncesi moderasyondan geçer.</li>
              <li>Veritabanı bağlantıları şifreli kanal üzerinden kurulur ve erişim yetkileri sınırlandırılır.</li>
            </ul>
          ),
        },
        {
          id: "satmiyoruz",
          title: "Verilerinizi satmıyoruz",
          body: (
            <p>
              Kişisel verilerinizi reklam veya pazarlama amacıyla üçüncü kişilere satmayız ya da
              kiralamayız. Paylaşım yalnızca hizmetin sunulması, yasal yükümlülükler ve güvenlik
              amaçlarıyla sınırlıdır.
            </p>
          ),
        },
        {
          id: "kontrol",
          title: "Hesabınız üzerindeki kontrolünüz",
          body: (
            <ul>
              <li>Profil ve ilan bilgilerinizi panelinizden güncelleyebilirsiniz.</li>
              <li>Taslak ilanlarınızı düzenleyebilir, yayındaki ilanlarınızı kapatabilirsiniz.</li>
              <li>Hesabınızın silinmesini <strong>{LEGAL.supportEmail}</strong> adresinden talep edebilirsiniz.</li>
              <li>Çerez tercihlerinizi sayfanın altındaki &ldquo;Çerez tercihleri&rdquo; bağlantısından değiştirebilirsiniz.</li>
            </ul>
          ),
        },
        {
          id: "cocuklar",
          title: "Yaş sınırı",
          body: <p>Platform, 18 yaşını doldurmuş gerçek kişiler ve tüzel kişi temsilcileri içindir.</p>,
        },
        {
          id: "degisiklik",
          title: "Politikadaki değişiklikler",
          body: (
            <p>
              Bu politikayı güncelleyebiliriz. Önemli değişiklikleri sitede duyurur, sayfanın üstündeki
              güncelleme tarihini yenileriz.
            </p>
          ),
        },
      ]}
    />
  );
}
