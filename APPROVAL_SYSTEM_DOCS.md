# TAŞERONCUM.COM - Admin Onay Sistemi Entegrasyonu

## 🎯 Yapılan Değişiklikler

### 1. VERİTABANI ŞEMASI (prisma/schema.prisma)
✅ **Yeni Enum Eklendi:**
- `ApprovalStatus`: DRAFT, PENDING_APPROVAL, APPROVED, REJECTED

✅ **JobPost Modeli Güncellendi:**
- `approvalStatus`: İlanın onay durumu (varsayılan: DRAFT)
- `createdByRole`: İlanı kim oluşturdu (TASERON/FIRMA)
- `createdById`: İlan sahibinin User ID'si
- `approvedAt`, `approvedById`: Onaylama bilgileri
- `rejectedAt`, `rejectedById`, `rejectionReason`: Ret bilgileri
- İlişkiler: `createdBy`, `approvedBy`, `rejectedBy` (User)

✅ **User Modeli Güncellendi:**
- `createdJobs`: Kullanıcının oluşturduğu ilanlar
- `approvedJobs`: Admin'in onayladığı ilanlar
- `rejectedJobs`: Admin'in reddettiği ilanlar

### 2. VALİDATÖRLER (lib/validators.ts)
✅ **Yeni Şemalar:**
- `jobPostCreateSchema`: İlan oluşturma (min açıklama: 30 karakter)
- `jobPostUpdateSchema`: İlan güncelleme
- `adminRejectSchema`: Red sebebi (min 10 karakter, zorunlu)

✅ **Type Export'lar:**
- `JobPostCreateInput`, `JobPostUpdateInput`, `AdminRejectInput`

### 3. SERVER ACTIONS (actions/jobs.ts)
✅ **Taşeron İşlemleri:**
- `createJobDraft()`: Taslak ilan oluşturma (DRAFT)
- `submitJobForApproval()`: İlanı onaya gönderme (DRAFT/REJECTED → PENDING_APPROVAL)
- `updateJobDraft()`: Taslak/reddedilmiş ilanı düzenleme
- `listMyJobsByApprovalStatus()`: Kendi ilanlarını duruma göre listeleme
- `getMyJobById()`: İlan detayı alma

✅ **Firma/Genel İşlemler:**
- `listApprovedJobs()`: Sadece APPROVED + OPEN ilanları listeleme
- `getJobById()`: İlan detayı (APPROVED değilse owner/admin kontrolü)

✅ **Admin İşlemleri:**
- `adminListPendingJobs()`: PENDING_APPROVAL ilanları listeleme
- `adminGetJobById()`: İlan detayı alma
- `adminApproveJob()`: İlanı onaylama (APPROVED, approvedAt, approvedById set)
- `adminRejectJob()`: İlanı reddetme (sebep zorunlu)
- `adminUnpublishJob()`: Yayından kaldırma

### 4. UI BİLEŞENLERİ
✅ **Yeni Bileşenler:**
- `components/jobs/approval-status-badge.tsx`: Onay durumu badge'i
- `components/jobs/job-form.tsx`: İlan formu (react-hook-form + zod)
- `components/admin/admin-moderation-actions.tsx`: Onay/Red butonları ve modal
- `hooks/use-toast.ts`: Toast notification sistemi

### 5. TAŞERON DASHBOARD SAYFALARI
✅ **Yeni Sayfalar:**
- `/dashboard/taseron/ilanlar`: İlanları listeleme (tabs: Tümü, Taslak, Onay Bekliyor, Onaylanan, Reddedilen)
- `/dashboard/taseron/ilanlar/yeni`: Yeni ilan oluşturma
- `/dashboard/taseron/ilanlar/[id]/duzenle`: İlan düzenleme (DRAFT/REJECTED)
- `/dashboard/taseron/ilanlar/[id]/onaya-gonder`: Onaya gönderme confirmation

✅ **Özellikler:**
- Durum badge'leri (renk kodlu)
- Red sebebi görüntüleme
- Duruma göre aksiyon butonları
- Date formatting (date-fns + tr locale)

### 6. ADMIN ONAY PANELİ
✅ **Yeni Sayfalar:**
- `/admin/ilan-onay`: Onay kuyruğu (PENDING_APPROVAL ilanları)
- `/admin/ilan-onay/[id]`: İlan detay + Onay/Red aksiyonları

✅ **Özellikler:**
- Gönderen bilgileri (taşeron profili)
- Red sebebi modal (textarea, min 10 karakter)
- Onay kriterleri rehberi
- Toast bildirimleri

### 7. FİRMA/GENEL İLANLAR SAYFASI
✅ **Güncelleme:**
- `/app/ilanlar/page.tsx`: `getJobs()` → `listApprovedJobs()`
- Sadece **APPROVED** ve **OPEN** ilanlar gösteriliyor

### 8. AUTH & MIDDLEWARE
✅ **Login Redirect Güncellendi:**
- Admin → `/admin`
- Firma → `/dashboard/firma`
- Taşeron → `/dashboard/taseron/ilanlar`

✅ **Middleware Güncellemesi:**
- `/dashboard/taseron/*` → TASERON rolü zorunlu
- `/admin/*` → ADMIN rolü zorunlu
- Yetkisiz erişimde `/unauthorized` sayfası

✅ **Yeni Sayfa:**
- `/app/unauthorized/page.tsx`: Yetkisiz erişim uyarı sayfası

### 9. SEED DATA
✅ **Demo Veriler:**
- 1 DRAFT ilan (Taşeron 1)
- 2 PENDING_APPROVAL ilan (Taşeron 2, 3)
- 1 REJECTED ilan (Taşeron 4 - red sebebi ile)
- 4 APPROVED ilan (Admin onaylı)
- 5 Bid (onaylanmış ilanlara)
- 3 Review

---

## 📦 KURULUM ADIMLARI

### 1. Bağımlılıkları Kontrol Et
```bash
npm install
```

### 2. Prisma Migration Çalıştır
```bash
npx prisma migrate dev --name add_approval_system
```

### 3. Veritabanını Seed Et
```bash
npx prisma db seed
```

### 4. Development Sunucusu
```bash
npm run dev
```

---

## 🧪 TEST SENARYOLARI

### TAŞERON AKIŞI
1. **Login:** `taseron1@taseroncum.com` / `123456`
2. **Yönlendirme:** `/dashboard/taseron/ilanlar`
3. **Yeni İlan:**
   - "Yeni İlan" butonuna tıkla
   - Formu doldur (min 30 karakter açıklama)
   - Seçenek 1: "Taslak Kaydet" → İlan DRAFT olarak kaydedilir
   - Seçenek 2: "Kaydet ve Onaya Gönder" → İlan direkt PENDING_APPROVAL olur
4. **Taslak Düzenle:**
   - Taslaklar tabına git
   - "Düzenle" butonuna tıkla
   - Değişiklikleri yap, kaydet
5. **Onaya Gönder:**
   - "Onaya Gönder" butonuna tıkla
   - İlan detayını kontrol et
   - Onayla → İlan PENDING_APPROVAL olur
6. **Reddedilen İlan:**
   - Reddedilen tabına git
   - Red sebebini gör
   - "Düzenle" → Düzelt
   - "Tekrar Gönder" → PENDING_APPROVAL

### ADMIN AKIŞI
1. **Login:** `admin@taseroncum.com` / `123456`
2. **Yönlendirme:** `/admin`
3. **Onay Kuyruğu:**
   - Sol menüden "İlan Onay" (veya direkt `/admin/ilan-onay`)
   - PENDING_APPROVAL ilanları görüntüle
4. **İlan İnceleme:**
   - "İncele ve Karar Ver" butonuna tıkla
   - İlan detayını oku
   - Gönderen bilgilerini kontrol et
5. **Onaylama:**
   - "Onayla" butonu → İlan APPROVED + approvedAt set
   - Toast bildirimi
   - Listelemeye dön
6. **Reddetme:**
   - "Reddet" butonu → Modal açılır
   - Red sebebi yaz (min 10 karakter)
   - "Reddet" → İlan REJECTED + rejectionReason set
   - Toast bildirimi

### FİRMA AKIŞI
1. **Login:** `firma1@taseroncum.com` / `123456`
2. **Genel İlanlar:** `/ilanlar`
3. **Görüntüleme:** Sadece APPROVED + OPEN ilanlar listelenir
4. **Teklif Verme:** İlan detayına git, teklif ver (mevcut sistem)

---

## 🎨 UI/UX ÖZELLİKLERİ

### Renk Kodlama (Approval Status Badge)
- **DRAFT** (Taslak): Gri/Secondary
- **PENDING_APPROVAL** (Onay Bekliyor): Mavi/Default
- **APPROVED** (Onaylandı): Yeşil
- **REJECTED** (Reddedildi): Kırmızı/Destructive

### Toast Mesajları
- Başarılı işlemler: Yeşil
- Hata mesajları: Kırmızı/Destructive
- Otomatik kapanma: 5 saniye

### Form Validasyonları
- Başlık: Min 5, max 100 karakter
- Açıklama: Min 30, max 2000 karakter
- Red Sebebi: Min 10, max 500 karakter
- Tüm zorunlu alanlar işaretli

---

## 📊 VERİTABANI İSTATİSTİKLERİ (Seed Sonrası)

- **Kullanıcılar:** 8 (1 Admin, 2 Firma, 5 Taşeron)
- **İlanlar:** 8 toplam
  - 1 DRAFT
  - 2 PENDING_APPROVAL
  - 1 REJECTED
  - 4 APPROVED
- **Teklifler:** 5
- **Değerlendirmeler:** 3

---

## 🔒 YETKİLENDİRME MATRİSİ

| İşlem | TASERON | FIRMA | ADMIN |
|-------|---------|-------|-------|
| İlan oluşturma | ✅ (DRAFT) | ❌ | ✅ |
| İlanı onaya gönderme | ✅ (kendi ilanı) | ❌ | ✅ |
| İlan düzenleme | ✅ (DRAFT/REJECTED) | ❌ | ✅ |
| İlan onaylama | ❌ | ❌ | ✅ |
| İlan reddetme | ❌ | ❌ | ✅ |
| APPROVED ilanları görme | ✅ | ✅ | ✅ |
| Tüm ilanları görme | ❌ (sadece kendi) | ❌ | ✅ |
| Teklif verme | ❌ | ✅ | ❌ |

---

## 🚨 ÖNEMLİ NOTLAR

1. **Migration Önce:**
   ```bash
   npx prisma migrate dev --name add_approval_system
   ```
   Migration çalıştırılmadan sistem çalışmaz!

2. **Seed Data:**
   Test için mutlaka seed çalıştırın.

3. **CompanyProfile:**
   Taşeronlar ilan oluştururken otomatik olarak CompanyProfile oluşturuluyor (schema constraint nedeniyle).

4. **Date Library:**
   `date-fns` ve `date-fns/locale` kullanılıyor (Türkçe formatlar için).

5. **Toast Sistemi:**
   Custom `useToast` hook kullanılıyor (shadcn/ui toast değil).

---

## 🐛 MUHTEMEL HATALAR VE ÇÖZÜMLER

### 1. Migration Hatası
**Hata:** `Can't reach database server`
**Çözüm:** PostgreSQL'in çalıştığından emin olun.

### 2. Seed Hatası
**Hata:** `passwordHash field not found`
**Çözüm:** Schema'da `password` → `passwordHash` olmalı.

### 3. Type Hatası
**Hata:** `ApprovalStatus is not defined`
**Çözüm:** `npx prisma generate` çalıştırın.

### 4. Toast Çalışmıyor
**Hata:** `useToast is not defined`
**Çözüm:** `hooks/use-toast.ts` dosyasının var olduğundan emin olun.

---

## 📝 GELİŞTİRME ÖNERİLERİ

1. **Email Bildirimleri:**
   - Admin'e yeni ilan bildirimi
   - Taşerona onay/red bildirimi

2. **Filtreleme:**
   - Admin panelinde kategori/şehir filtresi
   - Taşeron panelinde arama

3. **Toplu İşlemler:**
   - Admin için toplu onay/red

4. **İstatistikler:**
   - Admin dashboard: günlük/aylık onay sayıları
   - Taşeron dashboard: onay başarı oranı

5. **Versiyonlama:**
   - İlan değişiklik geçmişi

6. **Dosya Yükleme:**
   - İlan resmi/belge ekleme

---

## 📞 DESTEK

Herhangi bir sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Network sekmesini inceleyin
3. Prisma Studio ile veritabanını kontrol edin: `npx prisma studio`

---

**TAŞERONCUM.COM** - İnşaat Sektörünün Online Pazaryeri 🏗️

*Admin Onay Sistemi v1.0 - Başarıyla Entegre Edildi ✅*
