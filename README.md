# 🏗️ TAŞERONCUM.COM

> İnşaat sektörü için modern, güvenli ve kapsamlı online pazaryeri platformu

İnşaat sektöründe **firmalar** ile **taşeronları** bir araya getiren, admin onaylı ilan sistemi ile güvenli iş birliği sağlayan Next.js tabanlı web platformu.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#️-kurulum)
- [Kullanım](#-kullanım)
- [Demo Hesapları](#-demo-hesapları)
- [Proje Yapısı](#-proje-yapısı)
- [Ortam Değişkenleri](#-ortam-değişkenleri)
- [API & Server Actions](#-api--server-actions)
- [Ekran Görüntüleri](#-ekran-görüntüleri)

---

## ✨ Özellikler

### 🌐 Genel Özellikler
- 📱 **Responsive Tasarım** - Mobil, tablet ve masaüstü uyumlu
- 🎨 **Modern UI/UX** - Shadcn/ui ile profesyonel arayüz bileşenleri
- 🌍 **Türkçe Arayüz** - Tam Türkçe dil desteği
- 🔒 **Güvenli Kimlik Doğrulama** - NextAuth.js ile session yönetimi
- ⚡ **Server Actions** - Next.js 14 App Router yapısı
- 🔍 **Gelişmiş Arama & Filtreleme** - Çoklu kriter filtreleme
- 📊 **Real-time İstatistikler** - Görüntüleme ve teklif sayaçları

### 👷 Taşeron Özellikleri
- ✅ **İlan Oluşturma** - Detaylı iş ilanı oluşturma formu
- 📝 **Taslak Sistemi** - İlanları taslak olarak kaydetme
- 🔄 **Onay Süreci** - İlanları admin onayına gönderme
- ✏️ **İlan Düzenleme** - Taslak ve reddedilen ilanları düzenleme
- 📋 **İlan Takibi** - Durum bazlı ilan yönetimi (Taslak, Onay Bekliyor, Onaylanan, Reddedilen)
- 📊 **Portfolio Yönetimi** - Geçmiş iş deneyimleri
- ⭐ **Değerlendirme Sistemi** - Firmalardan puan ve yorum alma
- 🔔 **Teklif Bildirimleri** - Gelen teklifleri takip etme

### 🏢 Firma Özellikleri
- 🔍 **İlan Görüntüleme** - Sadece onaylanmış ilanları görme
- 📱 **Gelişmiş Filtreleme** - Kategori, şehir, bütçe filtreleri
- 💬 **Teklif Verme** - İlanlara fiyat, süre ve mesaj ile teklif verme
- 📊 **Teklif Yönetimi** - Verilen teklifleri dashboard'tan takip
- ✅ **Teklif Karar Sistemi** - Teklifleri kabul/red etme
- ⭐ **Değerlendirme** - Taşeronlara puan ve yorum verme
- 📞 **Direkt İletişim** - Taşeron profil sayfalarında iletişim bilgileri
- 🏢 **Profil Yönetimi** - Firma bilgilerini güncelleme

### 👨‍💼 Admin Özellikleri
- 📋 **Onay Kuyruğu** - Bekleyen ilanları görüntüleme ve inceleme
- ✅ **İlan Onaylama** - İlanları anında yayına alma
- ❌ **İlan Reddetme** - Detaylı sebep ile reddetme (zorunlu)
- 📊 **Dashboard İstatistikleri** - Sistem geneli istatistikler
- 👥 **Kullanıcı Yönetimi** - Hesapları aktif/pasif yapma
- 🗑️ **İlan Yönetimi** - İlanları yayından kaldırma/silme
- 💬 **Yorum Moderasyonu** - Uygunsuz yorumları silme
- 📈 **Detaylı Raporlama** - Bugün onaylanan, bekleyen ilan sayıları

---

## �️ Teknolojiler

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework (App Router)
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Re-usable UI components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon pack
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Backend
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database client
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Zod](https://zod.dev/)** - Schema validation
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing

### DevOps & Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Prisma Studio](https://www.prisma.io/studio)** - Database GUI
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript execution

---

## 📋 Gereksinimler

Projeyi çalıştırmadan önce aşağıdaki araçların sisteminizde kurulu olduğundan emin olun:

- **Node.js** 18.x veya üzeri
- **PostgreSQL** 14.x veya üzeri
- **npm** veya **yarn** veya **pnpm**
- **Git**

---

## � Kurulum

### 1️⃣ Depoyu Klonlayın

```bash
git clone https://github.com/your-username/teserencum.git
cd teserencum
```

### 2️⃣ Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
# veya
pnpm install
```

### 3️⃣ Ortam Değişkenlerini Yapılandırın

Proje kök dizininde `.env` dosyası oluşturun:

```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/taseroncum"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

> **💡 İpucu:** `NEXTAUTH_SECRET` için güçlü bir anahtar oluşturun:
> ```bash
> openssl rand -base64 32
> ```

### 4️⃣ Veritabanını Hazırlayın

```bash
# Prisma client'ı oluştur
npx prisma generate

# Veritabanı migration'ını çalıştır
npx prisma migrate dev --name init

# (Opsiyonel) Demo verileri yükle
npx prisma db seed
```

### 5️⃣ Uygulamayı Başlatın

```bash
# Development modunda çalıştır
npm run dev

# veya Production build
npm run build
npm start
```

✅ Uygulama şu adreste çalışacak: **http://localhost:3000**

---

## 🔐 Demo Hesapları

Seed data çalıştırıldıktan sonra aşağıdaki test hesapları ile sisteme giriş yapabilirsiniz:

### 👨‍💼 Admin Hesabı
| Email | Şifre | Rol |
|-------|-------|-----|
| `admin@taseroncum.com` | `123456` | Admin |

### 🏢 Firma Hesapları
| Email | Şifre | Rol |
|-------|-------|-----|
| `firma1@taseroncum.com` | `123456` | Firma |
| `firma2@taseroncum.com` | `123456` | Firma |

### 👷 Taşeron Hesapları
| Email | Şifre | Rol |
|-------|-------|-----|
| `taseron1@taseroncum.com` | `123456` | Taşeron |
| `taseron2@taseroncum.com` | `123456` | Taşeron |
| `taseron3@taseroncum.com` | `123456` | Taşeron |
| `taseron4@taseroncum.com` | `123456` | Taşeron |
| `taseron5@taseroncum.com` | `123456` | Taşeron |

> ⚠️ **Güvenlik Uyarısı:** Production ortamında bu hesapları mutlaka silin veya şifrelerini değiştirin!

---

## 📁 Proje Yapısı

```
teserencum/
├── 📂 app/                          # Next.js 14 App Router
│   ├── 📂 admin/                   # Admin panel sayfaları
│   │   ├── 📂 approvals/          # İlan onay kuyruğu
│   │   ├── 📂 ilan-onay/          # İlan detay inceleme
│   │   ├── 📂 jobs/               # İlan yönetimi
│   │   ├── 📂 reviews/            # Yorum moderasyonu
│   │   └── 📂 users/              # Kullanıcı yönetimi
│   ├── 📂 api/
│   │   ├── 📂 auth/[...nextauth]/ # NextAuth API route
│   │   └── 📂 health/             # Health check endpoint
│   ├── 📂 dashboard/
│   │   ├── 📂 firma/              # Firma dashboard
│   │   │   └── 📂 ilan/[id]/      # Alınan teklifler
│   │   └── 📂 taseron/            # Taşeron dashboard
│   │       ├── 📂 ilanlar/        # İlan yönetimi
│   │       │   ├── 📂 [id]/       # İlan düzenleme/onaya gönderme
│   │       │   └── 📂 yeni/       # Yeni ilan oluştur
│   │       └── 📂 teklifler/      # Verilen teklifler
│   ├── 📂 firma/[id]/             # Firma profil sayfası
│   ├── 📂 taseron/[id]/           # Taşeron profil sayfası
│   ├── 📂 ilan/[id]/              # İlan detay sayfası
│   ├── 📂 ilanlar/                # İlan listeleme (filtreleme)
│   ├── 📂 login/                  # Giriş sayfası
│   ├── 📂 register/               # Kayıt sayfası
│   ├── 📂 unauthorized/           # Yetkisiz erişim
│   ├── 📄 layout.tsx              # Root layout
│   ├── 📄 page.tsx                # Landing page
│   └── 📄 globals.css             # Global styles
│
├── 📂 actions/                     # Server Actions (Next.js 14)
│   ├── 📄 admin.ts                # Admin işlemleri
│   ├── 📄 auth.ts                 # Kimlik doğrulama
│   ├── 📄 bids.ts                 # Teklif işlemleri
│   ├── 📄 jobs.ts                 # İlan işlemleri (CRUD + Approval)
│   ├── 📄 profile.ts              # Profil işlemleri
│   └── 📄 reviews.ts              # Değerlendirme işlemleri
│
├── 📂 components/                  # React bileşenleri
│   ├── 📂 admin/                  # Admin panel bileşenleri
│   │   ├── 📄 ApprovalQueueTable.tsx
│   │   ├── 📄 ApprovalReviewDrawer.tsx
│   │   └── 📄 admin-*-actions.tsx
│   ├── 📂 dashboard/              # Dashboard bileşenleri
│   │   ├── 📄 bid-card.tsx
│   │   ├── 📄 create-job-dialog.tsx
│   │   └── 📄 job-status-toggle.tsx
│   ├── 📂 jobs/                   # İlan bileşenleri
│   │   ├── 📄 approval-status-badge.tsx
│   │   ├── 📄 JobsGrid.tsx
│   │   ├── 📄 PublicJobCard.tsx
│   │   └── 📄 job-*.tsx
│   ├── 📂 landing/                # Landing page bileşenleri
│   │   ├── 📄 hero-section.tsx
│   │   ├── 📄 how-it-works.tsx
│   │   └── 📄 *-section.tsx
│   ├── 📂 layout/                 # Layout bileşenleri
│   │   ├── 📄 header.tsx
│   │   ├── 📄 footer.tsx
│   │   └── 📄 landing-*.tsx
│   ├── 📂 providers/              # Context providers
│   │   └── 📄 auth-provider.tsx
│   └── 📂 ui/                     # Shadcn/ui bileşenleri
│       ├── 📄 button.tsx
│       ├── 📄 card.tsx
│       ├── 📄 dialog.tsx
│       └── ... (diğer UI bileşenleri)
│
├── 📂 lib/                         # Utility fonksiyonlar
│   ├── 📄 auth.ts                 # NextAuth konfigürasyonu
│   ├── 📄 db.ts                   # Prisma client
│   ├── 📄 utils.ts                # Genel yardımcı fonksiyonlar
│   └── 📄 validators.ts           # Zod validation şemaları
│
├── 📂 prisma/                      # Database
│   ├── 📄 schema.prisma           # Veritabanı şeması
│   └── 📄 seed.ts                 # Seed data script
│
├── 📂 types/                       # TypeScript type definitions
│   └── 📄 next-auth.d.ts          # NextAuth type extensions
│
├── 📂 hooks/                       # Custom React hooks
│   └── 📄 use-toast.ts
│
├── 📂 public/                      # Static files
│
├── 📄 middleware.ts                # Next.js middleware (auth)
├── 📄 next.config.js               # Next.js configuration
├── 📄 tailwind.config.ts           # Tailwind CSS config
├── 📄 tsconfig.json                # TypeScript config
├── 📄 package.json                 # Dependencies
├── 📄 .env                         # Environment variables
├── 📄 README.md                    # Bu dosya
└── 📄 APPROVAL_SYSTEM_DOCS.md      # Onay sistemi detayları
```

---

## �️ Veritabanı Şeması

### Ana Modeller

#### 👤 User
Kullanıcı hesap bilgileri ve kimlik doğrulama

```prisma
model User {
  id                String             @id @default(cuid())
  name              String?
  email             String             @unique
  emailVerified     DateTime?
  password          String
  role              Role               @default(TASERON)
  image             String?
  isActive          Boolean            @default(true)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  
  // İlişkiler
  companyProfile    CompanyProfile?
  contractorProfile ContractorProfile?
  bids              Bid[]
  receivedReviews   Review[]
  givenReviews      Review[]
  createdJobs       JobPost[]          // Oluşturduğu ilanlar
  approvedJobs      JobPost[]          // Onayladığı ilanlar (admin)
  rejectedJobs      JobPost[]          // Reddettiği ilanlar (admin)
}
```

#### 🏢 CompanyProfile
Firma profil bilgileri

```prisma
model CompanyProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  companyName     String
  taxNumber       String?
  address         String?
  phone           String?
  description     String?
  website         String?
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### 👷 ContractorProfile
Taşeron profil ve portfolio bilgileri

```prisma
model ContractorProfile {
  id              String     @id @default(cuid())
  userId          String     @unique
  companyName     String?
  taxNumber       String?
  address         String?
  phone           String?
  description     String?
  skills          String[]
  experience      Int?
  portfolio       String[]
  certifications  String[]
  
  user            User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### 📋 JobPost
İş ilanları (Admin onay sistemi ile)

```prisma
model JobPost {
  id                String          @id @default(cuid())
  title             String
  description       String
  category          Category
  location          String
  budget            Float
  estimatedDuration Int
  status            JobStatus       @default(OPEN)
  approvalStatus    ApprovalStatus  @default(DRAFT)
  createdByRole     Role
  createdById       String
  companyId         String
  views             Int             @default(0)
  
  // Onay sistemi alanları
  approvedAt        DateTime?
  approvedById      String?
  rejectedAt        DateTime?
  rejectedById      String?
  rejectionReason   String?
  
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  
  // İlişkiler
  createdBy         User            @relation("CreatedJobs", fields: [createdById], references: [id])
  approvedBy        User?           @relation("ApprovedJobs", fields: [approvedById], references: [id])
  rejectedBy        User?           @relation("RejectedJobs", fields: [rejectedById], references: [id])
  bids              Bid[]
}
```

#### 💰 Bid
Teklifler

```prisma
model Bid {
  id              String     @id @default(cuid())
  jobPostId       String
  contractorId    String
  proposedBudget  Float
  proposedDuration Int
  message         String?
  status          BidStatus  @default(PENDING)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  
  jobPost         JobPost    @relation(fields: [jobPostId], references: [id], onDelete: Cascade)
  contractor      User       @relation(fields: [contractorId], references: [id], onDelete: Cascade)
}
```

#### ⭐ Review
Değerlendirmeler ve yorumlar

```prisma
model Review {
  id           String   @id @default(cuid())
  jobPostId    String
  reviewerId   String   // Kim yazdı
  reviewedId   String   // Kim için yazıldı
  rating       Int      // 1-5
  comment      String?
  createdAt    DateTime @default(now())
  
  reviewer     User     @relation("GivenReviews", fields: [reviewerId], references: [id])
  reviewed     User     @relation("ReceivedReviews", fields: [reviewedId], references: [id])
}
```

### Enum Tipleri

```prisma
enum Role {
  ADMIN
  FIRMA      // İş veren
  TASERON    // İş yapan
}

enum JobStatus {
  OPEN       // Aktif
  CLOSED     // Kapalı
}

enum ApprovalStatus {
  DRAFT              // Taslak
  PENDING_APPROVAL   // Onay bekliyor
  APPROVED          // Onaylandı
  REJECTED          // Reddedildi
}

enum BidStatus {
  PENDING    // Bekliyor
  ACCEPTED   // Kabul edildi
  REJECTED   // Reddedildi
}

enum Category {
  KABA_INSAAT
  INCE_INSAAT
  ELEKTRIK
  TESISAT
  BOYA_BADANA
  DEKORASYON
  IZOLASYON
  CELIK_YAPI
  PEYZAJ
  RESTORASYON
}
```

---

## 💡 Kullanım

### 🏗️ Taşeron Kullanım Senaryosu

1. **Kayıt Ol & Giriş Yap**
   - `/register` sayfasından Taşeron olarak kayıt olun
   - `/login` sayfasından giriş yapın

2. **İlan Oluştur**
   - Dashboard → "Yeni İlan" butonuna tıklayın
   - İlan detaylarını doldurun (başlık, açıklama, kategori, lokasyon, bütçe, süre)
   - "Taslak Kaydet" ile ilanı taslak olarak saklayın

3. **Onaya Gönder**
   - Taslak ilanı düzenleyin
   - "Onaya Gönder" butonuna tıklayın
   - İlan `PENDING_APPROVAL` durumuna geçer

4. **Sonuç Bekle**
   - ✅ **Onaylanırsa:** İlan otomatik yayına girer, firmalar görebilir
   - ❌ **Reddedilirse:** Admin'in red sebebini görebilir, düzenleyip tekrar gönderebilirsiniz

5. **Teklifleri Takip Et**
   - Dashboard'tan gelen teklifleri görüntüleyin
   - Firmalarla iletişime geçin

### 💼 Firma Kullanım Senaryosu

1. **Kayıt Ol & Giriş Yap**
   - `/register` sayfasından Firma olarak kayıt olun
   - `/login` sayfasından giriş yapın

2. **İlanları İncele**
   - Ana sayfa veya `/ilanlar` sayfasından onaylanmış ilanları görün
   - Kategori, şehir, bütçe filtrelerini kullanın
   - Arama yapın

3. **İlan Detayına Git**
   - İlgilendiğiniz ilana tıklayın
   - Tüm detayları inceleyin
   - Taşeron profilini kontrol edin

4. **Teklif Ver**
   - Teklif formunu doldurun (fiyat, süre, açıklama)
   - "Teklif Gönder" butonuna tıklayın

5. **Tekliflerimi Yönet**
   - Dashboard'tan verdiğiniz teklifleri görüntüleyin
   - Durum güncellemelerini takip edin

6. **Değerlendir**
   - İş tamamlandıktan sonra taşerona puan ve yorum verin

### 👨‍💼 Admin Kullanım Senaryosu

1. **Admin Paneline Git**
   - Admin hesabı ile giriş yapın
   - `/admin/approvals` sayfasını açın

2. **Onay Kuyruğunu İncele**
   - Bekleyen ilanlar tablosunu görün
   - İstatistikleri kontrol edin

3. **İlan Detayını Gör**
   - "İncele" butonuna tıklayın
   - Drawer açılır, tüm detayları görün

4. **Karar Ver**
   - ✅ **Onayla:** "İlanı Onayla" butonuna tıklayın → Anında yayına girer
   - ❌ **Reddet:** "İlanı Reddet" → Sebep yazın (min 10 karakter) → Taşerona bildirim gider

5. **Diğer Yönetim İşlemleri**
   - `/admin/users` - Kullanıcı yönetimi
   - `/admin/jobs` - Tüm ilanları yönet
   - `/admin/reviews` - Yorumları yönet

---

## � API & Server Actions

### Server Actions Yapısı

Next.js 14'ün Server Actions özelliği kullanılarak API endpoint'leri yerine doğrudan sunucu fonksiyonları kullanılır.

#### 🔐 Auth Actions (`actions/auth.ts`)
- `registerUser()` - Yeni kullanıcı kaydı
- `updateProfile()` - Profil güncelleme

#### 📋 Job Actions (`actions/jobs.ts`)

**Taşeron İşlemleri:**
```typescript
createJobDraft()              // Taslak ilan oluştur (DRAFT)
updateJobDraft(id)            // Taslak ilanı düzenle
submitJobForApproval(id)      // Onaya gönder (DRAFT → PENDING_APPROVAL)
listMyJobsByApprovalStatus()  // Kendi ilanlarını listele
getMyJobById(id)              // İlan detayı
```

**Firma/Genel İşlemler:**
```typescript
listApprovedJobs(filters)     // Onaylanmış ilanları listele
getJobById(id)                // İlan detayı (onay kontrolü ile)
```

**Admin İşlemleri:**
```typescript
adminListPendingJobs()        // Onay bekleyen ilanlar
adminGetJobById(id)           // İlan detayı
adminApproveJob(id)           // İlanı onayla
adminRejectJob(id, reason)    // İlanı reddet (sebep zorunlu)
adminUnpublishJob(id)         // Yayından kaldır
```

#### 💰 Bid Actions (`actions/bids.ts`)
```typescript
createBid()                   // Yeni teklif ver
listBidsForJob(jobId)         // İlanın tekliflerini listele
listMyBids()                  // Kendi tekliflerini listele
updateBidStatus()             // Teklif durumunu güncelle (firma)
```

#### ⭐ Review Actions (`actions/reviews.ts`)
```typescript
createReview()                // Değerlendirme yap
getReviewsForUser(userId)     // Kullanıcının aldığı yorumlar
deleteReview(id)              // Yorum sil (admin)
```

#### 👨‍💼 Admin Actions (`actions/admin.ts`)
```typescript
getDashboardStats()           // Dashboard istatistikleri
listAllUsers()                // Tüm kullanıcılar
toggleUserStatus(userId)      // Kullanıcı aktif/pasif
deleteJob(jobId)              // İlan sil
```

### API Routes

#### Authentication
- `POST /api/auth/signin` - Giriş yap
- `POST /api/auth/signout` - Çıkış yap
- `GET /api/auth/session` - Session bilgisi

#### Health Check
- `GET /api/health` - API durumu

---

## 🛠️ NPM Komutları

### Geliştirme

```bash
# Development sunucusunu başlat (hot-reload)
npm run dev

# Prisma Studio'yu aç (database GUI)
npm run db:studio

# Linting çalıştır
npm run lint
```

### Veritabanı İşlemleri

```bash
# Prisma client'ı oluştur/güncelle
npm run db:generate

# Migration oluştur ve uygula
npm run db:migrate

# Şema değişikliklerini doğrudan uygula (migration olmadan)
npm run db:push

# Seed data yükle (demo veriler)
npm run db:seed
```

### Production

```bash
# Production build oluştur
npm run build

# Production modda çalıştır
npm start
```

### Diğer Faydalı Komutlar

```bash
# Prisma migration sıfırlama (dikkatli kullanın!)
npx prisma migrate reset

# Prisma format (schema.prisma dosyasını formatla)
npx prisma format

# Veritabanını tamamen sil ve yeniden oluştur
npx prisma migrate reset && npm run db:seed

# Type kontrolü
npx tsc --noEmit
```

---
---

## 🚀 Önemli Sayfalar & Rotalar

### 🌐 Public Sayfalar
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Landing page + öne çıkan ilanlar |
| İlanlar | `/ilanlar` | Tüm onaylanmış ilanlar (filtreleme & arama) |
| İlan Detay | `/ilan/[id]` | İlan detayları, teklif verme formu |
| Taşeron Profil | `/taseron/[id]` | Taşeron bilgileri, portfolio, yorumlar |
| Firma Profil | `/firma/[id]` | Firma bilgileri ve ilanları |
| Giriş | `/login` | Kullanıcı girişi |
| Kayıt | `/register` | Yeni kullanıcı kaydı |

### 👷 Taşeron Dashboard
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| İlanlarım | `/dashboard/taseron/ilanlar` | Tüm ilanlar (taslak, onay bekliyor, vb.) |
| Yeni İlan | `/dashboard/taseron/ilanlar/yeni` | Yeni ilan oluştur |
| İlan Düzenle | `/dashboard/taseron/ilanlar/[id]/duzenle` | Taslak/reddedilen ilanı düzenle |
| Onaya Gönder | `/dashboard/taseron/ilanlar/[id]/onaya-gonder` | İlanı admin onayına gönder |
| Tekliflerim | `/dashboard/taseron/teklifler` | Aldığım teklifler |

### 🏢 Firma Dashboard
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Dashboard | `/dashboard/firma` | Genel bakış |
| İlan Teklifleri | `/dashboard/firma/ilan/[id]` | İlanıma gelen teklifler |

### 👨‍💼 Admin Panel
| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Dashboard | `/admin` | Genel istatistikler |
| Onay Kuyruğu | `/admin/approvals` | Bekleyen ilanları onayla/reddet |
| İlan İnceleme | `/admin/ilan-onay/[id]` | İlan detaylı inceleme |
| Tüm İlanlar | `/admin/jobs` | İlan yönetimi |
| Kullanıcılar | `/admin/users` | Kullanıcı yönetimi |
| Yorumlar | `/admin/reviews` | Yorum moderasyonu |

---
# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/teserencum"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

> 💡 **İpucu:** `.env.example` dosyasını kopyalayıp `.env` olarak kaydedebilirsiniz.

---

## 🎯 Admin Onay Sistemi

### Nasıl Çalışır?

Taşeronlar artık direkt ilan oluşturabilir ve admin onayına gönderebilir:

```mermaid
graph LR
    A[Taşeron İlan Oluşturur] --> B[DRAFT]
    B --> C[Onaya Gönder]
    C --> D[PENDING_APPROVAL]
    D --> E{Admin İnceler}
    E -->|Onayla| F[APPROVED]
    E -->|Reddet| G[REJECTED]
    G --> H[Düzenle]
    H --> C
    F --> I[Yayında]
```

### İlan Durumları

| Durum | Açıklama | Görünürlük |
|-------|----------|------------|
| 🟡 **DRAFT** | Taslak, henüz tamamlanmamış | Sadece sahip |
| 🟠 **PENDING_APPROVAL** | Admin onayı bekliyor | Sadece sahip & admin |
| 🟢 **APPROVED** | Onaylandı, yayında | Herkes |
| 🔴 **REJECTED** | Reddedildi, düzenleme gerekli | Sadece sahip |

### Onay Kriterleri

Admin aşağıdaki kriterlere göre değerlendirme yapar:

- ✅ Açıklama kalitesi ve detaylılık
- ✅ Bütçe gerçekçiliği
- ✅ Kategori uygunluğu
- ✅ Lokasyon bilgisi
- ✅ Spam/tekrar içerik kontrolü
- ✅ Türkçe dil kurallarına uygunluk

> 📖 **Detaylı Dokümantasyon:** [APPROVAL_SYSTEM_DOCS.md](APPROVAL_SYSTEM_DOCS.md)

---

## 🚀 Deployment

### Vercel (Önerilen)

1. GitHub'a push yapın
2. [Vercel](https://vercel.com) üzerinden projeyi import edin
3. Ortam değişkenlerini ayarlayın
4. Deploy butonuna tıklayın

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://user:pass@host:5432/teserencum"
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
```

### Database Migration

```bash
# Production'da migration çalıştır
npx prisma migrate deploy
```

---

## 🎨 Tasarım Sistemi

### Renk Paleti

| Renk | Hex | Kullanım Alanı |
|------|-----|----------------|
| 🟠 Primary | `#F37021` | Ana turuncu renk, CTA butonlar |
| 🟠 Primary Dark | `#D85F17` | Hover durumları |
| ⚫ Dark | `#2E2E2E` | Ana metin, başlıklar |
| 🔵 Blue | `#3B82F6` | Linkler, bilgi badge'leri |
| 🟢 Success | `#10B981` | Onaylı durumlar |
| 🟡 Warning | `#F59E0B` | Bekleyen durumlar |
| 🔴 Danger | `#EF4444` | Red/silme işlemleri |
| ⚪ Background | `#F9FAFB` | Sayfa arka planı |
| ⬜ Card | `#FFFFFF` | Kart/panel arka planı |

### Tipografi

- **Font Family:** `Inter`, system-ui
- **Heading:** `font-bold` (700)
- **Body:** `font-normal` (400)
- **Small:** `text-sm` (14px)

---

## 📊 Özellik Roadmap

### ✅ Tamamlananlar (v2.0)
- [x] Admin onay sistemi
- [x] Taşeron ilan oluşturma
- [x] Public ilan listesi ve filtreleme
- [x] Teklif sistemi
- [x] Değerlendirme sistemi
- [x] Kullanıcı rolleri (Admin, Firma, Taşeron)

### 🚧 Yapılacaklar (v3.0)
- [ ] E-posta bildirimleri
- [ ] Mesajlaşma sistemi
- [ ] Dosya yükleme (portfolio, belgeler)
- [ ] Ödeme entegrasyonu
- [ ] Mobil uygulama
- [ ] İlan istatistikleri (görüntülenme, tıklama)
- [ ] Gelişmiş raporlama
- [ ] Multi-language support

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen aşağıdaki adımları izleyin:

1. Bu repo'yu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Mesaj Formatı

```
feat: Yeni özellik ekleme
fix: Bug düzeltme
docs: Dokümantasyon güncellemesi
style: Kod formatı düzenleme
refactor: Kod refactoring
test: Test ekleme/düzeltme
chore: Genel değişiklikler
```

---

## 🐛 Bilinen Sorunlar

Şu anda bilinen kritik bir sorun bulunmamaktadır. Bir sorun bulduysanız lütfen [issue](https://github.com/your-username/taseroncum/issues) açın.

---

## 📞 İletişim & Destek

- 📧 Email: support@taseroncum.com
- 🌐 Website: https://taseroncum.com
- 📖 Docs: [APPROVAL_SYSTEM_DOCS.md](APPROVAL_SYSTEM_DOCS.md)

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 👏 Teşekkürler

Bu proje aşağıdaki harika teknolojiler sayesinde oluşturulmuştur:

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication

---

<div align="center">

**🏗️ TAŞERONCUM.COM**

_İnşaat Sektörünün Güvenilir Online Pazaryeri_

Made with ❤️ using AI

[⭐ Star](https://github.com/your-username/taseroncum) | [🐛 Report Bug](https://github.com/your-username/taseroncum/issues) | [✨ Request Feature](https://github.com/your-username/taseroncum/issues)

</div>

#   R e n d e r   d e p l o y   t r i g g e r  
 