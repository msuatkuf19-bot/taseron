import type { Metadata } from "next";
import { LegalPage, Controller } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Taşeroncum.com",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Taşeroncum.com aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <LegalPage
      current="/kvkk-aydinlatma-metni"
      title="KVKK aydınlatma metni"
      intro={
        <p>
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun (&ldquo;KVKK&rdquo;) 10. maddesi ve
          Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ
          uyarınca, {LEGAL.brand} kullanıcılarının kişisel verilerinin nasıl işlendiğini açıklar.
        </p>
      }
      sections={[
        {
          id: "veri-sorumlusu",
          title: "Veri sorumlusu",
          body: (
            <>
              <p>Kişisel verileriniz, veri sorumlusu sıfatıyla aşağıda bilgileri yer alan şirket tarafından işlenir:</p>
              <Controller />
            </>
          ),
        },
        {
          id: "islenen-veriler",
          title: "İşlenen kişisel veriler",
          body: (
            <>
              <p>Platformu kullanım şeklinize göre aşağıdaki veri kategorileri işlenebilir:</p>
              <table className="legal-table">
                <thead><tr><th>Kategori</th><th>Örnek veriler</th></tr></thead>
                <tbody>
                  <tr><td>Kimlik</td><td>Ad soyad, unvan, firma adı</td></tr>
                  <tr><td>İletişim</td><td>E-posta adresi, telefon numarası, şehir</td></tr>
                  <tr><td>Müşteri işlem</td><td>Oluşturulan ilanlar, verilen ve alınan teklifler, teklif tutarları, değerlendirme ve yorumlar</td></tr>
                  <tr><td>Mesleki deneyim</td><td>Uzmanlık alanları, deneyim yılı, profil açıklaması</td></tr>
                  <tr><td>İşlem güvenliği</td><td>Şifrelenmiş parola, oturum bilgileri, IP adresi, giriş kayıtları</td></tr>
                  <tr><td>Pazarlama</td><td>Çerez tercihleri ve, onay vermeniz hâlinde, kullanım istatistikleri</td></tr>
                </tbody>
              </table>
              <p>Platform, özel nitelikli kişisel veri (sağlık, din, biyometrik vb.) talep etmez. Lütfen ilan ve profil açıklamalarına bu tür veriler eklemeyin.</p>
            </>
          ),
        },
        {
          id: "amaclar",
          title: "İşleme amaçları",
          body: (
            <ul>
              <li>Üyelik hesabının oluşturulması ve yönetilmesi</li>
              <li>İlanların yayınlanması, moderasyonu ve teklif süreçlerinin yürütülmesi</li>
              <li>Firma ve taşeronların birbirleriyle iletişim kurabilmesinin sağlanması</li>
              <li>Değerlendirme ve itibar sisteminin işletilmesi</li>
              <li>Bilgi güvenliği süreçlerinin yürütülmesi, kötüye kullanımın önlenmesi</li>
              <li>Hukuki yükümlülüklerin yerine getirilmesi ve yetkili kurumlara bilgi verilmesi</li>
              <li>Talep ve şikâyetlerin yanıtlanması</li>
              <li>Onay vermeniz hâlinde, platformun geliştirilmesi için kullanım analizi</li>
            </ul>
          ),
        },
        {
          id: "hukuki-sebep",
          title: "Toplama yöntemi ve hukuki sebepler",
          body: (
            <>
              <p>
                Kişisel verileriniz; kayıt ve ilan formları, profil sayfaları, teklif ekranları ve
                çerezler aracılığıyla elektronik ortamda, tamamen veya kısmen otomatik yollarla toplanır.
              </p>
              <p>Verileriniz KVKK&apos;nın 5. maddesinde yer alan şu hukuki sebeplere dayanılarak işlenir:</p>
              <ul>
                <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (md. 5/2-c): üyelik ve platform hizmetleri</li>
                <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi (md. 5/2-ç): 5651 sayılı Kanun kapsamındaki kayıtlar</li>
                <li>Bir hakkın tesisi, kullanılması veya korunması (md. 5/2-e)</li>
                <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaat (md. 5/2-f): güvenlik ve dolandırıcılığın önlenmesi</li>
                <li>Açık rıza (md. 5/1): zorunlu olmayan çerezler ve ticari elektronik ileti gönderimi</li>
              </ul>
            </>
          ),
        },
        {
          id: "aktarim",
          title: "Kişisel verilerin aktarılması",
          body: (
            <>
              <p>Kişisel verileriniz, yukarıdaki amaçlarla sınırlı olarak şu alıcı gruplarına aktarılabilir:</p>
              <ul>
                <li><strong>Diğer kullanıcılar:</strong> Yayındaki ilanınız ve profil bilgileriniz, teklif verebilmeleri için platformdaki firmalar tarafından görülebilir. Bir teklifi kabul ettiğinizde iletişim bilgileriniz karşı tarafla paylaşılır.</li>
                <li><strong>Hizmet sağlayıcılar:</strong> Barındırma, veritabanı ve e-posta altyapısı sağlayan tedarikçiler.</li>
                <li><strong>Yetkili kurum ve kuruluşlar:</strong> Kanunen yetkili kamu kurumları ve adli makamlar.</li>
              </ul>
              <p>
                Barındırma ve veritabanı hizmetlerimizin bir kısmı yurt dışında bulunan sunucularda
                sağlanabilir. Yurt dışına aktarım, KVKK&apos;nın 9. maddesinde öngörülen güvenceler (standart
                sözleşme vb.) çerçevesinde yapılır.
              </p>
            </>
          ),
        },
        {
          id: "saklama",
          title: "Saklama süresi",
          body: (
            <p>
              Kişisel verileriniz, üyeliğiniz devam ettiği sürece ve üyeliğin sona ermesinden sonra ilgili
              mevzuatta öngörülen zamanaşımı ve saklama süreleri boyunca saklanır. Sürenin dolmasıyla
              veriler silinir, yok edilir veya anonim hâle getirilir.
            </p>
          ),
        },
        {
          id: "haklar",
          title: "KVKK'nın 11. maddesi kapsamındaki haklarınız",
          body: (
            <>
              <p>Veri sorumlusuna başvurarak:</p>
              <ul>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
                <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
                <li>KVKK&apos;nın 7. maddesi çerçevesinde silinmesini veya yok edilmesini isteme,</li>
                <li>Düzeltme ve silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
                <li>Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme,</li>
                <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
              </ul>
              <p>haklarına sahipsiniz.</p>
            </>
          ),
        },
        {
          id: "basvuru",
          title: "Başvuru yöntemi",
          body: (
            <>
              <p>
                Taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&apos;e uygun olarak;
                kimliğinizi tespit edici bilgilerle birlikte aşağıdaki yollardan biriyle iletebilirsiniz:
              </p>
              <ul>
                <li>Kayıtlı e-posta adresinizden <strong>{LEGAL.kvkkEmail}</strong> adresine e-posta ile,</li>
                <li><strong>{LEGAL.kep}</strong> adresine KEP ile,</li>
                <li>Islak imzalı dilekçe ile <strong>{LEGAL.address}</strong> adresine posta yoluyla.</li>
              </ul>
              <p>Başvurunuz, talebin niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.</p>
            </>
          ),
        },
      ]}
    />
  );
}
