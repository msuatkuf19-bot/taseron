import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Taşeroncum.com",
  description: "Taşeroncum.com üyelik ve kullanım koşulları.",
};

export default function TermsPage() {
  return (
    <LegalPage
      current="/kullanim-kosullari"
      title="Kullanım koşulları"
      intro={
        <p>
          Bu koşullar, {LEGAL.company} (&ldquo;Taşeroncum&rdquo;) tarafından işletilen {LEGAL.brand}
          platformunun kullanımını düzenler. Üye olarak veya platformu kullanarak bu koşulları kabul
          etmiş sayılırsınız.
        </p>
      }
      sections={[
        {
          id: "hizmet",
          title: "Hizmetin tanımı",
          body: (
            <p>
              Taşeroncum, inşaat sektöründe taşeronların iş ilanı yayınladığı ve firmaların bu ilanlara
              teklif verdiği bir aracı hizmet sağlayıcıdır. Taşeroncum, kullanıcılar arasında kurulan
              sözleşmelerin tarafı değildir; işin ifası, ödeme, kalite ve iş güvenliği yükümlülükleri
              tarafların kendi sorumluluğundadır.
            </p>
          ),
        },
        {
          id: "uyelik",
          title: "Üyelik",
          body: (
            <ul>
              <li>Üye olmak için 18 yaşını doldurmuş olmanız ve doğru bilgi vermeniz gerekir.</li>
              <li>Firma hesabı açan kişi, temsil ettiği şirket adına işlem yapmaya yetkili olduğunu beyan eder.</li>
              <li>Hesap güvenliğinden ve parolanızın gizliliğinden siz sorumlusunuz.</li>
              <li>Bir kişi veya şirket adına birden fazla hesap açılamaz.</li>
            </ul>
          ),
        },
        {
          id: "ilanlar",
          title: "İlan ve moderasyon kuralları",
          body: (
            <>
              <p>Her ilan yayına girmeden önce incelenir. Aşağıdaki içerikler reddedilir veya yayından kaldırılır:</p>
              <ul>
                <li>Gerçeğe aykırı, yanıltıcı veya başkasına ait bilgiler,</li>
                <li>Mevzuata, iş sağlığı ve güvenliği kurallarına aykırı işler,</li>
                <li>Kayıt dışı çalışmayı teşvik eden ifadeler,</li>
                <li>Hakaret, ayrımcılık veya üçüncü kişilerin haklarını ihlal eden içerikler,</li>
                <li>Platform dışına yönlendirme amacı taşıyan spam veya reklamlar.</li>
              </ul>
              <p>Reddedilen ilanlar, gerekçesiyle birlikte ilan sahibine bildirilir.</p>
            </>
          ),
        },
        {
          id: "teklifler",
          title: "Teklifler ve değerlendirmeler",
          body: (
            <ul>
              <li>Teklifler bağlayıcı bir sözleşme yerine geçmez; kesin şartlar taraflar arasında yazılı olarak belirlenmelidir.</li>
              <li>Değerlendirmeler yalnızca gerçekleşen iş birliklerine dayanmalı ve dürüst olmalıdır.</li>
              <li>Taşeroncum, kurallara aykırı değerlendirmeleri kaldırma hakkını saklı tutar.</li>
            </ul>
          ),
        },
        {
          id: "yasaklar",
          title: "Yasaklanan kullanımlar",
          body: (
            <ul>
              <li>Platformun güvenliğini tehdit eden her türlü girişim,</li>
              <li>Otomatik araçlarla izinsiz veri toplanması,</li>
              <li>Diğer kullanıcıların iletişim bilgilerinin platform amacı dışında kullanılması.</li>
            </ul>
          ),
        },
        {
          id: "sorumluluk",
          title: "Sorumluluğun sınırlandırılması",
          body: (
            <p>
              Taşeroncum, ilanları yayın öncesi incelemekle birlikte kullanıcıların beyanlarının
              doğruluğunu veya işlerin sonucunu garanti etmez. Kullanıcılar arasındaki uyuşmazlıklardan
              doğan zararlardan, kanunen sorumlu tutulamayacağı ölçüde sorumlu değildir.
            </p>
          ),
        },
        {
          id: "fesih",
          title: "Hesabın askıya alınması",
          body: (
            <p>
              Bu koşulları ihlal eden hesaplar uyarı yapılarak veya ihlalin ağırlığına göre doğrudan
              askıya alınabilir ya da kapatılabilir.
            </p>
          ),
        },
        {
          id: "uygulanacak-hukuk",
          title: "Uygulanacak hukuk",
          body: (
            <p>
              Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda tüketici işlemleri için
              tüketici hakem heyetleri ve tüketici mahkemeleri, diğer hâllerde [şehir] mahkemeleri ve
              icra daireleri yetkilidir.
            </p>
          ),
        },
        {
          id: "iletisim",
          title: "İletişim",
          body: (
            <p>
              Sorularınız için <strong>{LEGAL.supportEmail}</strong> adresine yazabilirsiniz.
            </p>
          ),
        },
      ]}
    />
  );
}
